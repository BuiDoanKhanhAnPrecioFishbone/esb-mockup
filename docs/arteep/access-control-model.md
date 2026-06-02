# Access Control Model · Knowledge Graph View Scoping

> **Status · v0.1 DRAFT · Design specification (2026-05-31)**
> Author · Claude (drafted from access-scoping discussion with Tram)
> Subject · How the ART-EEP UI determines what each user sees in the Knowledge Graph, both at query time and in the graph explorer UI.
> Scope · Cross-cutting · touches every UC that reads from the KG (UC-ON-02, UC-HO-02, UC-HO-06, UC-HO-07, and any cross-session admin/analyst view).

---

## 1 · Problem Statement

The Knowledge Graph aggregates content from every handover session across the organization. Without an access model, three failure modes follow:

1. **Noise** — Successors see thousands of nodes they can't act on; signal drowns.
2. **Privacy violation** — Confidential content (HR cases, salary, contract terms) reaches users without clearance.
3. **No audit defensibility** — Compliance cannot answer "who saw X at what time?" when an incident is reviewed.

This document specifies the access model that resolves all three.

---

## 2 · Background · The 3-Tier Proposal

A prior proposal suggested three graph scopes:

| Scope | Focus | Who |
|---|---|---|
| Enterprise Knowledge Graph | Full org-wide view, cross-department links | C-level, Admin, CPO |
| Departmental Sub-graph | Single department's content | Department Manager, dept System Owner |
| Handover / Session Graph | Single session, 1–2 hops from Offboarder | Offboarder, Successor, direct Manager |

The proposal also called for ontology-driven semantic permissions on edge types (e.g., regular employees see `[is_working_on]`, managers also see `[has_budget_of]`).

---

## 3 · Critique · Eight Issues with the 3-Tier Approach

| # | Issue | Why it matters |
|---|---|---|
| **1** | **Only 3 tiers** — misses Project / Cross-functional, Role-based (Audit, Legal, Security), and Temporal scopes. | Real handover work crosses departments (Vendor XYZ touches Sales + Engineering + Legal). A 3-tier model forces awkward duplication or denies legitimate access. |
| **2** | **Edge-type permissions ≠ instance-level security.** Granting Managers "can see `[has_budget_of]`" doesn't say *which* budgets. | Two managers both have edge-type permission — but Manager A in Engineering must not see Manager B's HR budgets. The proposal as written would leak. |
| **3** | **"1-Hop or 2-Hops" as the Session scope is a proxy, not a boundary.** | 2 hops from Minh Lê via Project Atlas reaches every Atlas contributor across departments, including people the Offboarder shouldn't expose. Hop-count is arithmetic, not authorization. |
| **4** | **No layered trust tiers.** Treats the KG as monolithic but ART-EEP has at least three trust levels: staged (Workstation Notes), verified (signed transcripts), and Canonical Facts (CL-084). | A Successor's "what did Minh Lê know" question should weight Canonical Facts higher than staged notes. The view-scoping model must distinguish them. |
| **5** | **Sensitivity classification is orthogonal to scope — proposal collapses them.** | A Sales VP may have wide scope (sees the whole sales sub-graph) but no clearance for sensitive HR-classified nodes. These are independent axes. Conflating them produces over-permissioning or over-restriction. |
| **6** | **No degraded-view design.** What does the UI show for an out-of-scope or sensitive-redacted node? Silence? Placeholder? Access-request? | Without a defined degraded view, the UI fills the vacuum inconsistently. Per CL-013, ART-EEP already has a "Restricted · sensitivity classification" pattern that should be reused. |
| **7** | **No audit dimension.** Permission to *see* a node is itself an event worth logging. | Without query-time audit, the system can't answer "who saw Khánh Linh's compensation data and when?" — exactly the question Compliance will ask in incident review. |
| **8** | **The "Integrated Talent Ecosystem" callout doesn't connect to the technical model.** | The 90% CPO stat is a market signal, not a design constraint. Either bake skills-based access into the model, or remove the callout. |

---

## 4 · Proposed Model · 5 Scopes × 3 Axes

Replace the 3-tier table with a two-dimensional model: **5 graph scopes** (who can query what subgraph) layered with **3 orthogonal axes** (what they actually see within scope).

### 4.1 · Five Graph Scopes — the "where"

| Scope | Subgraph | Who | Boundary mechanism |
|---|---|---|---|
| **S1 · Enterprise** | Full KG, all departments, all time | C-level, Platform Admin, CPO, board-mandated auditors | No filter; full read against Cosmos DB Gremlin |
| **S2 · Departmental** | Single department's nodes + edges + cross-dept edges where this dept is one endpoint | Department Head, dept System Owner | Partition-key filter on `nodes.dept` + edge filter on `source.dept ∨ target.dept` |
| **S3 · Project / Cross-functional** | All nodes connected to a specific Project node (or set of Projects) regardless of department | Project owner, formally-assigned project members | Explicit project-membership table; query is `MATCH (n)-[*1..2]-(p:Project {id: ...})` scoped to membership |
| **S4 · Role-based functional** | Specific node types across the org, but only those types (e.g., Audit sees all CanonicalFact + provenance edges; Security sees all Colleague + RBAC scope edges) | Audit, Legal, Security, Compliance, IT | Node-type filter combined with the user's role declaration; node-content stays sensitivity-classified |
| **S5 · Handover Session** | Nodes whose `provenance.sessionId = this session` + 1-hop neighbors that the Offboarder's RBAC scope allows | Offboarder, Successor, direct Manager | Explicit `sessionScopeHash` (per ART-EEP's locked decision) computed at session creation, stored on the audit anchor — **not hop count** |

**Why this beats the 3-tier proposal:**
- **S3** handles the real case of cross-departmental projects (Vendor XYZ doesn't fit into Engineering OR Sales alone).
- **S4** gives Auditors a way to do their job without granting them S1.
- **S5's boundary is a hash, not a hop count** — derived from the session's RBAC scope at creation, so it can't drift if the org chart changes.

### 4.2 · Three Orthogonal Axes — the "what they actually see"

A user with scope access still passes three filters before content renders:

| Axis | Question | Mechanism |
|---|---|---|
| **A1 · Sensitivity clearance** | Is this content classified above the user's clearance level? | Microsoft Purview classification result on the node/edge. Independent of scope. |
| **A2 · Trust tier** | Does the user have permission to see staged/inferred content, or only verified/canonical? | Node `status` field. Onboarders default to canonical-only for first 30 days; Managers see verified+canonical; Offboarders see all tiers within their session. |
| **A3 · Temporal validity** | Is this content valid in the user's queried time window? | Edge `validFrom` / `validTo` timestamps. Default window: 6 months pre-departure. |

A user must pass **all three** axes for content to render. Failing any axis triggers a **degraded view** (see §4.4).

### 4.3 · Permission Evaluation Algorithm

Every query runs through this exact order. Each step is short-circuit — failure returns the appropriate degraded view immediately:

```
Given: user U, node N (or edge E), query context Q

1. SCOPE CHECK
   Compute U's scope set: {S1, S2, ..., S5} U is enrolled in.
   For each scope, compute the qualifying subgraph (with instance-level
   filtering: dept match, project membership, sessionScopeHash match).
   If N (or E) is in NO qualifying subgraph → return ScopeRestricted view.

2. SENSITIVITY CHECK (A1)
   Read N.classificationResult.
   If N.classification > U.clearance level → return SensitivityRestricted view.

3. TRUST TIER CHECK (A2)
   Read N.status.
   If N.status NOT IN U.allowedTiers → return TrustTierRestricted view.

4. TEMPORAL CHECK (A3)
   If query has time window [t1, t2]:
     For node: check N.firstSeenAt ≤ t2 AND N.lastActiveAt ≥ t1
     For edge: check E.validFrom ≤ t2 AND (E.validTo IS NULL OR E.validTo ≥ t1)
   If outside window → render at reduced opacity (visible but de-emphasized).

5. AUDIT LOG
   Write {user, node/edge ID, scope used, classification, timestamp,
   degradation if any} to the immutable audit log.

6. RETURN
   Full content if all checks passed; otherwise the corresponding degraded view.
```

The order matters: scope is checked first because it's the cheapest filter (partition-key lookup) and produces the highest rejection rate at the edge of the graph.

### 4.4 · Degraded Views — Consistent UI Behavior

| Failure type | What the user sees |
|---|---|
| **ScopeRestricted** | Node not rendered at all. No placeholder. The user has no business knowing it exists. |
| **SensitivityRestricted** | Per CL-013 · dashed-circle placeholder with `Lock` icon and label "Restricted · sensitivity classification". No metadata, no count of redacted edges, no inferable shape. Hover tooltip: "Outside your authorized scope." |
| **TrustTierRestricted** | Node rendered with reduced opacity + a `Sparkles` icon overlay and "Unverified · staged content" label. Selectable but greyed; SidePanel explains why it's not yet trusted. |
| **TemporalOutOfWindow** | Per the graph explorer spec — 30% opacity, edges 50% opacity dotted. Visible for orientation, de-emphasized to show "not in your selected period." |

The distinction matters: ScopeRestricted = invisible; the other three = visibly degraded so the user understands a limitation exists.

---

## 5 · Worked Example

**Scenario:** Trần Hữu Nam (Onboarder) is exploring Minh Lê's handover. He clicks the `Vendor XYZ renewal` node in his playbook.

**Under the improved model:**

1. **Scope check.** Nam is enrolled in S5 (Handover Session for Minh Lê → Nam, `sessionScopeHash = abc123...`). The Vendor XYZ node has `provenance.sessionId = SESSION-2026-05-29-7a3c`, which is inside Nam's session scope. ✓
2. **Sensitivity check.** Vendor XYZ's contract terms include classified fields (negotiated penalty clause). Nam's clearance covers "operational-confidential" but not "contract-financial." → The node renders, but the `penaltyClause` field returns as `SensitivityRestricted`. The graph explorer shows a `Lock` icon on that specific attribute in the SidePanel.
3. **Trust tier check.** The node is a `CanonicalFact` (status = `committed`). Nam's onboarder tier allows canonical + verified. ✓
4. **Temporal check.** Nam's timeline window is default 6 months pre-departure. Vendor XYZ's last activity is 3 weeks before departure. ✓
5. **Audit log.** System writes: `user=tran-huu-nam, node=vendor-xyz, scope=S5:sessionScopeHash=abc123, classification=partial-redact, ts=2026-05-29T15:40Z`.
6. **Result.** Nam sees the node with most fields visible, the penalty clause field masked with the `Lock` icon, and his action recorded.

**Under the original 3-tier proposal:**
- Nam is in "Handover/Session Graph" → he sees 1–2 hops from Minh Lê.
- Vendor XYZ is 1 hop → fully visible, all fields including the classified penalty clause.
- No audit entry.
- → Compliance violation.

This is the gap the improved model closes.

---

## 6 · Implementation Notes

### 6.1 · Storage Layout
- **Cosmos DB Gremlin** partitioned by `dept` for S2 efficiency. Cross-dept edges stored twice (both partitions) with `isCrossDept = true`.
- **Project membership** in a separate Cosmos document collection keyed by `projectId`; lookup is O(1) at query time.
- **Session scope hashes** persisted on the session anchor; computed once at UC-HO-01 step 6 and never re-derived.
- **Sensitivity classification** stored on every node/edge as `classificationResult` (enum) + `classificationCategory` (string). Set at UC-HO-01 step 8, immutable thereafter.

### 6.2 · Pre-retrieval ACL Trimming
Per ART-EEP's locked architectural decision (see `ARTEEP-context-snapshot.md` §2), ACL trimming happens at Azure AI Search and the Cosmos DB partition level — *before* the agent ever sees results. This means:
- The Worker / Expert agents only ever see nodes the user already has scope + clearance for.
- Hallucinations about restricted content become structurally impossible because that content was never in the agent's context.
- The trimming layer is the enforcement point; the UI degraded-view system is the *display* layer.

### 6.3 · Skills-Based Scope as a v2 Path
The S4 role-based scope can be extended to support skills-based discovery: "people with skill X can see a 1-hop neighborhood around nodes tagged with skill X, scoped to their own department, for learning purposes only." This is a separate v2 feature; v1 ships the 5-scope model without it to avoid scope creep.

### 6.4 · Query Audit Log
Reuse the existing immutable audit log (per CL-020 audit anchor pattern). Every read of a sensitive or restricted node generates an entry. Aggregation queries (e.g., "show me all reads of Khánh Linh's HR nodes in the last 30 days") should be a first-class admin tool, not built ad-hoc later.

---

## 7 · Comparison Summary

| Concern | Original proposal | Improved flow |
|---|---|---|
| Scope tiers | 3 (Enterprise / Dept / Session) | 5 (Enterprise / Dept / Project / Role-functional / Session) |
| Session boundary | Hop count (1–2) | RBAC scope hash from session anchor |
| Permission axes | 1 (edge-type) | 3 (scope, sensitivity clearance, trust tier) — orthogonal |
| Instance-level filtering | Implicit | Explicit (partition keys + project membership + scope hash) |
| Degraded views | Not defined | 4 typed degradations, each with consistent UI |
| Audit | Not addressed | Every restricted/sensitive read logged to immutable audit anchor |
| Talent ecosystem connection | Mentioned, not designed | Path defined (skills-based S4 extension as v2) |
| Alignment with existing arch | Generic | Built on ART-EEP's locked decisions (pre-retrieval ACL, Purview gate, Workstation Notes, CL-013/CL-084) |

---

## 8 · Open Questions for BA Review

When Tram reviews this v0.1, the calls that need product input:

1. **Scope assignment workflow** — How is a user enrolled in S2/S3/S4? Manual admin assignment, automated from HR directory, or self-service request?
2. **Sensitivity clearance levels** — How many tiers? (Public · Operational · Confidential · Restricted · Top-Restricted is a defensible 5-level start.) Who assigns them?
3. **Trust tier defaults for Onboarders** — Default "canonical-only for first 30 days" — is 30 the right number, or do we tie to onboarding milestones (e.g., until first review)?
4. **S5 scope expiration** — Does an Onboarder lose Session scope after some interval (e.g., 90 days after the session closes)? Or only when they leave the team?
5. **Audit retention** — How long are query-audit records retained? 7 years (typical compliance) vs. shorter (privacy)?
6. **Cross-scope conflict resolution** — When a user has S1 + S5 (rare but possible — e.g., a CPO who is also an Offboarder's direct manager), which scope wins for their *own* session? Recommendation: most-restrictive wins by default; explicit opt-in to broader view.

---

## 9 · Cross-References

- **UC-ON-02** — Graph explorer is the primary surface for this model. See `docs/arteep/UC-ON-02-graph-explorer.md` (when committed) for the rendering spec.
- **UC-HO-01** v2.0 § 6 — Session creation establishes the `sessionScopeHash` referenced by S5.
- **UC-HO-04** — KG commit pipeline sets `status` and `classificationResult` on every committed node; these drive A1 and A2.
- **UC-HO-06 / UC-HO-07** — Correction workflows must check write permissions analogously (out of scope for this doc, but parallel model applies).
- **CL-013** — "Restricted · sensitivity classification" UI pattern reused for degraded views.
- **CL-084** — CanonicalFact treatment distinguishes the highest trust tier.
- **QA-INT-01** — Audit anchor pattern provides the immutable record for §6.4.

---

*End of access control model v0.1 DRAFT. Replace with reviewed canonical version before downstream commitments.*
