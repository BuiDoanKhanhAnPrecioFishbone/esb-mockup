# QA-INT-01 — Dual-Verification & Workflow Integration

*Foundational system-level governance rule · Effective 2026-05-22 · Authority: Product Owner*

This rule sits above individual sprint decisions and governs the integrity of the entire ART-EEP system. All UCs, components, and sprints must honor it. Deviations require explicit Product Owner approval and an entry in the Design Change Log.

---

## 1. Rule Statement

### 1.1 Dual-Verification Protocol (Double-Check)

**Definition.** Every AI-generated output — Transcript, Summary, or Insight — must undergo a "Glass-box Verification" process before final commitment to the Knowledge Graph.

**The UX Mandate.** AI outputs are never treated as ground truth. All generated content must include visible provenance (sources/citations).

**Verification Workflow.** Three required steps in order:
- **Surface the Source.** AI must expose the specific document, snippet, or transcript timestamp used to generate the information. Provenance must be inline with the content, not buried in a separate view.
- **Human-in-the-Loop (HITL) Review.** Any discrepancy found by the user must trigger a "Flag" workflow, presenting a side-by-side diff between the AI claim and the user's correction. The original AI version must be preserved, not overwritten.
- **Final Sign-off.** No data is committed to the Knowledge Graph without explicit user validation or digital signature. Sign-off cannot be bypassed by any system path, including admin override.

### 1.2 Workflow Integration (Sáp nhập luồng chính)

**Unified Data Pipeline.** All verified corrections and approved transcripts must automatically propagate through the ART-EEP ecosystem. Verified content cannot remain isolated in one module; downstream consumers (Playbook Generator, Copilot, Skill Intelligence Engine) must receive the update.

**Consistency Assurance.** Once a piece of data is verified, it becomes a **"Canonical Fact" (Sự thật gốc)** and must be instantly reflected across all downstream modules. A "Canonical" status is visually distinct from a one-time "Verified" status — Canonical implies system-wide propagation has completed.

**Data Lineage.** Every update must maintain an immutable audit trail tracking:
- *Who* approved the change
- *What* was corrected
- *The original version* of the data
- *Timestamp* of the approval
- *Downstream propagation* events (which modules received the update, when)

The audit trail must be queryable per knowledge item, not only at the system-aggregate level.

---

## 2. Architectural Anchoring

QA-INT-01 sits above all UCs and references the following architectural commitments already locked in prior planning:

| Architectural Commitment | QA-INT-01 Clause It Serves |
|---|---|
| Semantic Kernel Orchestrator with Planner Agent | 1.1 (verification routing) |
| Microsoft Purview as mandatory PII gate | 1.1 (no fallback bypass) |
| Pre-retrieval ACL trimming at Azure AI Search + Cosmos DB | 1.1 (provenance integrity) |
| ComplexityScore-based Worker/Expert routing | 1.1 (escalation on low confidence) |
| Atomic KG commit pipeline (UC-HO-04) | 1.2 (unified pipeline) |
| Active Learning Engine wiring (S5) | 2.1 (downstream propagation) |
| Audit Log infrastructure (S0) | 2.2 (data lineage) |
| Step Zero entity schema mapping | 2.1 (consistency across sources) |

---

## 3. Compliance Matrix (as of 2026-05-22)

### Clause 1.1 — Visible Provenance on AI Outputs · ✅ COMPLIANT
- **Provenance Chip** (S0 component) consumed across HO-04, ON-01, ON-02, HO-06
- **Confidence Badge** (S0 component) inline on all AI-generated content
- **AI vs. Human authorship badges** (HO-03 Review Workspace)

### Clause 1.2 — Surface the Source · ✅ COMPLIANT
- **Source chips with timestamps** on every draft item (UC-HO-03 step 5)
- **Audio playback** verifies against transcript (UC-HO-03 step 3)
- **Copilot citations** as named source chips with timestamps (UC-ON-02 step 7)
- **Inline entity mini-cards** on hover (UC-ON-02 step 5)

### Clause 1.3 — HITL Review with Side-by-Side Diff · ⚠️ COMPLIANT WITH MINOR GAP
- ✅ UC-HO-07 Correction Review — rose/emerald side-by-side diff
- ✅ UC-HO-03 AC.3 — Manager Flag blocks sign until resolved
- ✅ Low-Confidence Drawer (Transactional Gateways State 3) — per-passage Verify/Edit/Clear
- ⚠️ **GAP — Refinement C:** Inline editing in HO-03 step 5-6 doesn't render before/after diff to the Offboarder during the edit session (the data is preserved in the audit trail, but not visualized)

### Clause 1.4 — Final Sign-off · ✅ COMPLIANT
- **PIN/biometric Sign-off Modal** (UC-HO-03 step 10-12)
- **Sign button disabled** when Manager flags unresolved (CL-030)
- **Sign button disabled** when low-confidence items remain (Transactional Gateways State 3)
- **Vietnam e-signature legal note** in footer (CL-031)

### Clause 2.1 — Unified Data Pipeline · ✅ COMPLIANT
- **UC-HO-04 atomic commit** pipeline (rollback on partial failure)
- **Step Zero entity schema** feeds KG (CL-070)
- **HO-07 correction propagation** — "3 playbooks updated · 12 onboarders notified · KG v3 → v4"

### Clause 2.2 — Canonical Fact Consistency · ⚠️ GAP IDENTIFIED
- ✅ Propagation logic exists and is demonstrable
- ❌ **GAP — Gap A:** No visible "Canonical Fact" status surface. The existing `Verified` badge means "one human signed off." The system needs to distinguish:
  - `Verified` (emerald) — one human signed off in the originating workflow
  - `Canonical · Sự thật gốc` (emerald + lineage glyph) — verified AND propagated as system ground truth across ≥2 downstream modules

### Clause 2.3 — Data Lineage · ⚠️ GAP IDENTIFIED
- ✅ **Audit Log Tile** (S0) — used in HO-04 Completion Report, HO-07 Resolved state
- ✅ **System-level immutable log** infrastructure (S0)
- ❌ **GAP — Gap B:** No per-item lineage view from the reading surface. Plan v2 CL-067 deferred dedicated Lineage UI to v2 ("admin power-user, deferred"). That deferral was made before QA-INT-01 was formalized — needs reconsideration.

---

## 4. Identified Gaps and Proposed Remediation

### Gap A — Canonical Fact Surface
**Severity:** Medium · **Cost:** ~2 days · **Recommended Sprint:** S5 (Skill Gap & Feedback)
**Rationale:** Canonical status is most consequential in the downstream-consumer surfaces (Playbook Reading, Skill Gap, Feedback Loop). Building it during S5 aligns with where the feedback loop closes.
**Proposed implementation:**
- Extend S0 Confidence Badge component to support a `canonical` variant (emerald + Network glyph)
- Add `propagationStatus` to the data model on every committed item: `local | canonical | superseded`
- Canonical badge is clickable, opens the lineage drawer (closes Gap B simultaneously)

### Gap B — Per-Item Lineage View
**Severity:** Medium · **Cost:** ~1.5 days · **Recommended Sprint:** S5 (concurrent with Gap A)
**Rationale:** Minimum lineage visibility — not the full admin Lineage UI from Plan v2's deferred list, but a per-item drawer that reuses existing Audit Log Tile components scoped to one item's history.
**Proposed implementation:**
- Add `<HistoryDrawer itemId={...}>` component that queries the audit log filtered to the item
- Show timeline: created → verified → propagated → corrected (if applicable)
- Reuse S0 AuditLogTile — no new visual primitives
- Triggered from any canonical item via "View history" link

### Refinement C — Inline Edit Diff Visualization
**Severity:** Low · **Cost:** ~0.5 days · **Recommended Sprint:** S2 v3 (revisit HO-03 Review Workspace)
**Rationale:** Minor compliance shortcoming; audit trail captures the data but doesn't surface it to the user during the edit session.
**Proposed implementation:**
- When user clicks `Edit` on a draft item, original AI text shows greyed-out above the editable field
- After save, a small "Compare with original" affordance reveals the before/after on demand
- Component-level change to `EditingDraftItem` in HO-03

---

## 5. Exceptions

QA-INT-01 has no permitted exceptions for normal operation. The following edge cases require explicit handling:

| Edge Case | Required Handling |
|---|---|
| Source data deleted before commit | Item enters "orphaned source" state and is excluded from canonical promotion until source is restored or item is re-verified with new source |
| Verification user later loses access | Verification stands as historical record; if challenged, the verification's audit trail remains immutable |
| Verifier is the original AI-flagged author of the correction | Self-verification is not permitted — system routes to next available qualified verifier |
| Connector goes offline mid-propagation | Propagation marked `partial` in the audit trail; canonical status cannot be claimed until propagation completes |
| Conflict between two verified facts | Triggers UC-HO-07 conflict resolution flow; the more recent verification wins by default, with the older preserved as `superseded` |

---

## 6. Review Schedule

| Cadence | Activity | Owner |
|---|---|---|
| Per sprint | Compliance check on all new artifacts against QA-INT-01 | UX + BA |
| Quarterly | Full system re-audit against this rule | Product Owner |
| On rule modification | All affected components re-validated and Change Log updated | Architecture |

---

## 7. References

- Design Change Log: `ARTEEP-design-change-log.md` (entries CL-080 through CL-083)
- Implementation Plan v2: `ARTEEP-implementation-plan-v2.md` (Step Zero + sprint schedule)
- Master UC Index: existing baseline for UC-HO-01 through UC-ON-03
- Component Library: S0 Provenance Chip, Confidence Badge, Audit Log Tile, Section Card

---

*This rule supersedes any prior design decision that conflicts with it. Where conflict exists, this rule wins and a Change Log entry must document the reconciliation.*
