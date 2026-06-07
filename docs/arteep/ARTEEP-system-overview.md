# ART-EEP · System Overview

*Last updated 2026-06-07 · post UC-HO-04 Manager Review live merge (CL-103). This document is the single-source narrative of the entire ART-EEP system. For decision history see `ARTEEP-design-change-log.md`. For the seed context after compaction see `ARTEEP-context-snapshot.md`. For the use-case catalogue see `ARTEEP-master-uc-index.md`.*

---

## 1. What ART-EEP is

ART-EEP is an enterprise Knowledge Graph platform for employee handover and onboarding, built on Microsoft Azure. It captures a departing employee's tacit knowledge from approved shared workspaces, lets the manager review and sign off on it, commits the verified content to an organisation-wide Knowledge Graph, and delivers personalised onboarding playbooks to the successor with an active feedback loop.

Three things make it different from a generic knowledge-base or wiki:

- **No interview required for the POC.** Instead of relying on the offboarder's availability for a live voice session, the POC composes an asynchronous queue of questions (manager prompts + auto-derived network requests from the offboarder's collaborators + the offboarder's own additions) that the offboarder answers in text. The voice interview is retained for Phase 2.
- **Human-in-the-loop is the architecture, not a feature.** Every AI output carries visible provenance, every commit requires an explicit manager signature, every change is propagated atomically across all consumers. This is QA-INT-01, a foundational governance rule that sits above sprint-level decisions.
- **Three planes, one knowledge graph.** Management (the manager runs sessions), Capture (the offboarder contributes content), Consumption (the successor explores the graph). Each plane has its own design language, but the semantic palette is shared so meaning carries across surfaces.

The business spine, set in CL-090: *Data Gravity creates Vendor Lock-in.* Two ROI metrics anchor the pitch — Time-to-Productivity (onboarding compressed from ~2 months to ~2 weeks) and Tacit Knowledge Capture Rate (risk factors + undocumented procedures captured before the employee leaves).

Scope is narrowed to the **Automated Handover Knowledge Lake**. Peer Programming / developer-performance evaluation is explicitly out of scope; it bloated the system and diluted the core message.

The hackathon scoring rubric the build is optimising for: **40% Agentic Workflow · 40% Human-in-the-Loop · 20% Token Efficiency.**

---

## 2. The three planes

ART-EEP is organised into three planes that map to the three actor groups. Each plane has a distinct surface but they share the same underlying data contracts.

### 2.1 Management plane

Owned by the **Manager** (Hà Vy). Surfaces:

- **Dashboard (`/`)** — Hà Vy's multi-session command center. Three concurrent sessions visible with 3-phase progress, urgency layered signals (rose for critical timelines), source chips inline.
- **Quick initiate (`/session/new`)** — one-click session creation. Progressive disclosure for customisation; defaults cover the common path. Replaces the old multi-step wizard.
- **Session command view (`/session/[id]`)** — per-session full-screen workspace with six tabs: Overview · Stages · Data · Audit log · **Manager review** · Settings. The Manager review tab is UC-HO-04 (Sprint 3) rendered inline; see §6 for the eight states it surfaces.

Design language: locked light-mode system. Violet (`violet-50/100/200/500/600/700`) for brand, AI signal, primary CTAs, active states. Pastel yellow (`yellow-50/100/200/700/800`) for warnings, knowledge gaps, low confidence. Rose reserved for critical severity; emerald for verified / canonical. 1px hairlines, 32px button heights, two-animation budget (recording mic rings + completion glow).

### 2.2 Capture plane

Owned by the **Offboarder** (Minh Lê, Phương Anh, Khánh Linh). In the POC, capture is **self-serve upload + an asynchronous question queue**. Voice interview (UC-HO-02) is deferred to Phase 2.

The queue is the surface. It composes three sources of questions in priority order:

1. **Manager Priority Prompts** (UC-HO-05) — questions Hà Vy explicitly weighted to focus capture
2. **Network-solicited questions** (UC-HO-08, new in CL-100) — questions submitted by the offboarder's auto-derived connection set (Trello card co-members, comment participants, co-assignees, manager, named coach; the manager edits the set before sending)
3. **The offboarder's own additions** — anything Minh Lê thinks the successor will need

Alongside the queue runs a pre-commit, ACL-bounded correction loop (CL-101): colleagues can flag wrong or insufficient AI-collected data, which surfaces as a correction task to the offboarder. The colleague can only flag what they already had access to — the loop is ACL-bounded.

Design language: same as Management. Capture-plane mockup surfaces (file upload, question queue, UC-HO-08 network-request fan-out) are pending build.

### 2.3 Consumption plane

Owned by the **Successor** (Trần Hữu Nam). Extends UC-ON-02. Pending build.

Interaction model (CL-094): Progressive Disclosure (central node + 1-hop neighbourhood, double-click to expand or collapse), Contextual-AI quick-start chips (center / zoom / dim), 0-token hover via stored `short_summary` (15 words per node), Timeline + Heatmap split-screen for temporal exploration, Prompt Disambiguation when the user's query is too broad.

Design language deviation (CL-096): the Consumption plane uses the `MASTER.md` "AI-Native Minimal" presentation shell — indigo `#6366F1` primary, glassmorphism cards, light/dark toggle, `rounded-xl`/`2xl`, soft shadows, floating navbar. This is presentation only; the semantic palette is preserved as the meaning layer (rose = critical/locked, yellow = low-confidence/contested, emerald = verified/canonical, violet = AI signal).

The Consumption plane POC showcase is English-only (CL-097); usernames render as latinized handles (`Minh Le`, `@minh.le`) within the showcase. Persona identities are unchanged — only the on-screen string is latinized, and no Vietnamese text appears in the showcase.

---

## 3. Personas

Six personas are locked. Each has a different handover material mix, scoped to approved shared workspaces only.

| Name | Role | Department | Notes |
|---|---|---|---|
| **Hà Vy** | Manager | Engineering | Owns handover sessions; primary actor in UC-HO-01, UC-HO-04, UC-HO-07 |
| **Minh Lê** | Offboarder | Engineering | Canonical demo persona; Senior Backend Engineer; 12-day timeline |
| **Trần Hữu Nam** | Successor | Engineering | Succeeds Minh Lê |
| **Khánh Linh Trần** | Offboarder | People & Culture | Head of People Operations; urgent offboard (2 days) — exercises high PII path |
| **Phương Anh Nguyễn** | Offboarder | Sales | Senior Account Executive; demonstrates non-engineering source mix |
| **An Quân Vũ** | Platform Admin / IT | — | Owns Step Zero (Plan v2 CL-068) |

Material types by department (shared workspaces only):

- **Engineering (Minh Lê)** — Jira tickets, GitHub repos (PR descriptions, commit messages, wiki pages), Google Drive (shared) files. POC showcase source: **Trello** (CL-091).
- **Sales (Phương Anh)** — Salesforce deals, shared Calendar, SharePoint sales-collateral documents.
- **People Ops (Khánh Linh)** — HRIS records, Notion policy pages, SharePoint policy archive.

Email, personal mailboxes, and private direct messages are excluded from automated collection per the data-ingestion governance rule. Where role-specific context lives in email threads, it surfaces through the POC question queue or manual file upload, never automated scanning.

---

## 4. The 3-phase lifecycle

Internally the system runs an 8-stage pipeline. At the glance level it always renders as 3 user-facing phases. This is CL-088: the 8-stage taxonomy was cognitively heavy at glance views; grouping into 3 phases (Prepare · Capture · Deliver) reduces load without losing internal tracking precision.

### Phase 1 · Prepare

*Owned by: Manager + System*

The session is set up and the system scans accessible work across approved sources. Sub-stages: Setup confirmed → Context seeding → Knowledge map ready. The system also fans out network knowledge requests (UC-HO-08) to the offboarder's auto-derived collaborator set, soliciting questions and data flags.

### Phase 2 · Capture

*Owned by: Offboarder + Manager*

The offboarder contributes content. In the POC: self-serve file upload + the asynchronous question queue. In Phase 2 of the product: AI-guided voice interview with Dynamic N-Domain Coverage. Sub-stages: Interview scheduled (POC: queue ready) → Voice interview (POC: queue worked) → Transcript reviewed.

### Phase 3 · Deliver

*Owned by: System + Successor*

Verified knowledge commits atomically to the Knowledge Graph; the personalised onboarding playbook is generated for the successor; the active feedback loop runs in perpetuity. Sub-stages: Committed to KG → Playbook delivered.

The phase progress bar (3 segments, violet for current with pulse animation, emerald for done) is the canonical glance widget across every Management surface.

---

## 5. Use case map

Eleven use cases plus Step Zero. The master catalogue with dependency matrix lives in `ARTEEP-master-uc-index.md` (v1.1).

### Handover (HO)

| UC | Title | Status |
|---|---|---|
| **UC-HO-01** | Initiate Handover Session | Sprint 1 v2 complete; dashboard + quick-initiate + command-view trio |
| **UC-HO-02** | Conduct AI-Guided Voice Interview (Dynamic N-Domain Coverage) | Deferred to Phase 2 (CL-098) — out of POC scope |
| **UC-HO-03** | Review and Sign Transcript | Sprint 2 complete (amber palette — needs migration) |
| **UC-HO-04** | Submit Handover Record to Knowledge Graph | **Sprint 3 complete (2026-06-07).** Mockup with 8 real states live at `/session/[id]?tab=review` (CL-103) |
| **UC-HO-05** | Configure Custom Prompts and Section Blueprints | Sprint 1 complete; in POC, prompts feed the capture queue |
| **UC-HO-06** | Report Hallucination or Error | Sprint 5 pending; feedback triage rules set (CL-095) |
| **UC-HO-07** | Approve Knowledge Graph Correction | Sprint 5 pending |
| **UC-HO-08** | Solicit Handover Inputs from the Employee's Network | New (CL-100). Prepare-stage. Spec pending. |

### Onboarding (ON)

| UC | Title | Status |
|---|---|---|
| **UC-ON-01** | Generate Personalized Onboarding Playbook | Sprint 4 complete (amber palette — needs migration) |
| **UC-ON-02** | Read Playbook with Inline Knowledge Tools | Sprint 4 complete (amber palette — needs migration) |
| **UC-ON-03** | Skill Gap Analysis and Growth Plan | Sprint 5 pending |

### Step Zero (Z)

Plan v2 addition. Platform Admin (An Quân Vũ) configures integrations before any handover can happen.

| UC | Title |
|---|---|
| **Z01** | Connector Library — browse 8 curated integrations |
| **Z02** | Connector Setup Wizard — OAuth + scope confirmation |
| **Z03** | Connector Health Dashboard — operational monitoring |
| **Z04** | Department × Source Mapping — per-dept configuration |

The 8 curated connectors: Microsoft 365 (OneDrive + SharePoint + Teams), Google Workspace (Drive shared + Calendar), Jira, Salesforce, Slack (shared channels only), Notion (shared workspaces only), GitHub (shared repos only), Generic HRIS (BambooHR/Workday adapter). Trello joins this list as the POC showcase source.

Email components in the connector list above are listed for platform-integration completeness only — ART-EEP does **not** scan email content at any point.

---

## 6. UC-HO-04 Manager Review — the centerpiece of S3

UC-HO-04 is the use case where the QA-INT-01 commit gate becomes visible to the manager. The eight-state mockup completed on 2026-06-07 surfaces every clause of QA-INT-01 in one continuous flow, and lives inside the Session command view as the "Manager review" tab.

| State | Name | What it shows |
|---|---|---|
| **S1** | Arrival | Bundle overview · 14 items · 4 source tiles · pre-review checks · review order recommendations |
| **S2** | Reviewing priority | Side-by-side raw source vs AI-structured rendering · Source Provenance Strip · Network Corroboration Card |
| **S3** | Quick accept | Accepted Toast Bar · Canonical upgrade · Post-accept inline actions |
| **S4** | Edit inline | CL-086 grammar · rose strikethrough for deletions + violet underline for insertions · Edit Lineage Footer (3-card lineage trail) |
| **S5** | Send back | Incomplete Answer Card · AI-drafted Send-Back Composer · Urgency Selector · Source Context Panel · Send-Back Impact Note |
| **S6** | Pre-commit flag fix | The Atlas rollback 3-way: AI got it wrong → Trần flagged 4h ago → Minh corrected 30m ago (snapshot → staging → verify → promote 94%) → Duy corroborated in #data-platform. Three-way diff in grid-cols-3 (rose / yellow / emerald). Flag Network Agreement Card. Audit Chain Preview (5-row immutable trail) |
| **S7** | Bundle summary | Outcome stats (9 accept / 3 edit / 2 send-back / 0 reject) · Category Breakdown Table · Propagation Preview (5-node graph) · Team Impact Row (Engineering 8 · Sales 1 · Data Platform 2) · Ready-to-Sign-Off Strip |
| **S8** | Sign-off | The QA-INT-01 §1.4 commit gate rendered as a **SHA-256 cryptographic anchor** (`8f3a2b9c…d7a5f` preview) bound to Hà Vy's Entra ID identity. 8-step Commit Progress Log (hash validation → ACL trim → Purview gate → Cosmos writes → Verified edges → playbook propagation → Slack notifications → audit log entry). 15-minute undo grace before the trail becomes immutable. |

The mockup is architected per CL-102 as a sibling-file pattern: main file owns shared scaffolding (ReviewShell, ItemListRail, DecisionRail, DiffPanes, LineageCard, ContextStrip, BundleProgress), with two siblings owning the heavier states (`uc-ho-04-s6-flag-fix.jsx`, `uc-ho-04-s7s8-signoff.jsx`).

CL-103 wires it live: `embedded` + `state` props let SessionCommandView render UC-HO-04 inline as the 6th tab. URL routing — `/session/minh-le?tab=review` lands on S1; `/session/minh-le?tab=review&state=s4` deep-links to S4. The Phương Anh session shows a POC-scope placeholder with a link to Minh Lê's review.

---

## 7. Data flow & governance

Six locked decisions govern how data moves through ART-EEP. These supersede any sprint-level design choices.

### 7.1 Data-ingestion scope · shared workspaces only

Automated collection is restricted to Jira · GitHub · Google Drive (shared) · SharePoint · Trello · Microsoft Planner. Email, personal directories, and individual messaging are **never** scanned. Personal files only via manual upload during the session.

The deprecation of CL-015 (2026-06-02) generalised this into a system-wide data-ingestion governance pattern; no source-specific exception exists.

### 7.2 Flexible multi-source model · Trello as POC showcase (CL-091)

The source mix is driven by department / role / position — not a fixed list. The **4-Layer Hard-Filter** (list/status · content-depth · label-priority; time-decay removed) is a source-agnostic ingestion contract. Trello is the POC showcase source because it is the company's primary third-party system today; other sources map onto the same four layers.

### 7.3 Hybrid sanitization pipeline (CL-092)

Filter-at-capture in three passes:

1. **Regex redaction** — 0-token; structural patterns (SSNs, credit cards, API keys)
2. **Few-Shot neutralization** — token-cost, semantic re-write of softer PII
3. **Microsoft Purview** — the authoritative mandatory gate. Non-bypassable. No fallback path.

The two pre-passes sit in front of Purview to reduce its load; they do not replace it.

### 7.4 Hybrid security tiering (CL-093)

Tier is auto-assigned from Purview sensitivity + source labels.

- **Tier 2** (sensitive / legal) — ghosted via strict ACL trim. The successor never sees the existence of these nodes.
- **Tier 1** (operational, access-controlled) — returns a **metadata-only stub** for the Lock + "Request access" affordance. A narrow exception to pre-retrieval ACL trimming: the successor sees that the node exists and can request access, but does not see content until access is granted.

### 7.5 Knowledge Graph consumer-plane interaction model (CL-094)

Progressive Disclosure (central node + 1-hop · double-click expand/collapse) · Contextual-AI quick-start chips (center/zoom/dim) · 0-token hover via stored 15-word `short_summary` · Timeline + Heatmap split-screen · Prompt Disambiguation on broad queries. Optimises for token efficiency (the 20% scoring weight).

### 7.6 Feedback triage · commit gate preserved (CL-095)

Token-free tag-based routing: Critical reports trigger a real-time alert; Batch reports flow into a weekly digest. A report immediately flags the node "under review" (a 0-token status flag), but **no correction auto-commits** — QA-INT-01 §1.4 stays absolute. Two-cycle SLA escalation: if a manager doesn't review within two weekly digests, the report auto-escalates to the Critical path. Sign-off is still required.

The pre-commit network-flag loop (CL-101) is the sibling rule for the Capture phase: colleagues' flags route corrections through the offboarder, then through UC-HO-03 sign-off — never directly into the KG.

---

## 8. Design system

### 8.1 Brand palette (CL-054 · supersedes CL-008)

| Color | Use |
|---|---|
| **Violet** (50/100/200/500/600/700) | Brand, AI signal, primary CTAs, Provenance Chip, active states |
| **Pastel yellow** (50/100/200/700/800) | Warnings, knowledge gaps, Manager priority badges, low confidence |
| **Rose** | Critical severity only — recording indicator, urgency, critical content, conflict |
| **Emerald** | Verified content, canonical success states (Canonical Fact uses `emerald-300` border) |
| **Muted blue** (CL-078) | Entity badges for projects/products only — scoped to the Transactional Gateways artifact |

### 8.2 Visual rules

- Light mode only · `bg-gray-50` canvas · `bg-white` surfaces
- 1px `border-gray-200` hairlines (except 2px semantic left-edge accents)
- Sans-serif primary + monospace for IDs/timestamps/stats
- Two-animation budget: recording mic rings (rose) + completion glow (violet)
- 32px button heights · 7px ghost-button vertical padding
- Explicit focus rings: `focus:ring-2 focus:ring-violet-500/20`

### 8.3 UX writing

- English by default. The Vietnamese deviation (CL-077) is scoped to the Transactional Gateways artifact only.
- Sentence case · active voice · Linear/Notion/Stripe register
- Named humans, not roles: "Hà Vy will review" not "your manager will review"
- "Sensitive content" — not "PII". "Microsoft Purview" never appears in user copy.
- Vietnamese system terms preserved in tooltips: "Canonical · Sự thật gốc" (overridden in the POC Consumer-plane showcase per CL-097, where Canonical renders in English only)

### 8.4 Plane-scoped deviations

- **Consumer plane (CL-096)** — `MASTER.md` "AI-Native Minimal" shell as the presentation layer. Indigo `#6366F1` primary, glassmorphism cards, light/dark toggle, `rounded-xl`/`2xl`, soft shadows, floating navbar. Semantic palette preserved as the meaning layer everywhere.
- **Transactional Gateways (CL-077 / CL-078)** — Vietnamese UI deviation. Muted-blue entity badges for projects/products only. Yellow-underline pattern for low-confidence claims.

---

## 9. QA-INT-01 · foundational governance rule

Adopted as a system-level rule above sprint decisions (CL-080). Full text at `/mnt/user-data/outputs/QA-INT-01-Dual-Verification-Rule.md`.

### 9.1 The seven clauses

| Clause | Requirement |
|---|---|
| **1.1** | Visible provenance on every AI output |
| **1.2** | Surface the specific source document/snippet |
| **1.3** | HITL review with side-by-side diff |
| **1.4** | Explicit sign-off before KG commit |
| **2.1** | Unified data pipeline — verified content propagates ecosystem-wide |
| **2.2** | Canonical Fact (Sự thật gốc) status visibly distinct from Verified |
| **2.3** | Immutable audit trail queryable per item |

### 9.2 Compliance status

All seven clauses are compliant. Three gaps were identified during the audit and remediated:

- **Gap A (CL-081 → CL-084)** — Canonical Fact had no dedicated surface. Fixed via `CanonicalBadge`: emerald-300 border + Network icon + "Sự thật gốc" tag. Wired in Feature 04 (KG Commit), Feature 06 (Reading), Feature 08 (Resolved).
- **Gap B (CL-082 → CL-085)** — No per-item lineage view. Fixed via `LineageDrawer`: 400px right drawer with 4-event timeline (Created → Verified → Committed → Propagated). Opens from the Canonical badge in Feature 06.
- **Refinement C (CL-083 → CL-086)** — Inline edit had no diff. Fixed: original AI text greyed/strikethrough above the editable field, "Original · AI-generated" label, QA-INT-01 §1.3 citation in the footer.

### 9.3 §1.4 in UC-HO-04

§1.4 is reaffirmed in two places: the feedback loop (CL-095) and the new pre-commit flag loop (CL-101). Both surface corrections back through the explicit manager sign-off; neither auto-commits.

The Manager Review mockup (UC-HO-04 · S8) renders §1.4 as a **SHA-256 cryptographic anchor** bound to Hà Vy's Entra ID identity, with the 8-step commit progress log visualised live and a 15-minute undo grace before the audit trail becomes immutable. This single screen surfaces §1.4 + §2.3 together.

---

## 10. Architecture · what the system reads and writes

Azure-native stack. The architectural decisions are listed in §2 of the context snapshot; this section names the components.

- **Azure Key Vault** — OAuth tokens, API keys (Step Zero secrets management)
- **Microsoft Graph Connectors** — MS-stack source integration platform (shared workspaces only; email never scanned)
- **Azure AI Search** — per-source indexes; pre-retrieval ACL trimming (Tier-1 stub exception per CL-093)
- **Cosmos DB Gremlin** — the Knowledge Graph itself; partition-keyed by organisation; stores per-node `short_summary` for 0-token hover (CL-094)
- **Cosmos DB Integrated Cache** — Redis was rejected for architectural simplicity
- **Microsoft Purview** — mandatory PII gate (no fallback path); fronted by the Regex + Few-Shot pre-passes (CL-092)
- **Entra ID** — RBAC; the Platform Admin role is distinct from the Manager role. Entra ID identity is the commit-gate signer in UC-HO-04 sign-off (visible in S8).
- **Azure OpenAI** — GPT-4o-mini as the Worker tier, GPT-4o as the Expert tier. ComplexityScore-based dynamic routing; confidence-gate escalation from Worker to Expert.
- **Semantic Kernel** — the orchestrator + Planner Agent

Retrieval is **GraphRAG dual-strategy** — graph traversal + vector search combined. Commit is atomic with rollback safety. Per-org partition keying lets the platform scale horizontally without leaking across tenants.

---

## 11. Current state of the build

### 11.1 Live in the repo

The `app/` directory is the registry. The `/m/<slug>` registry pattern from earlier iterations has been retired (CL-103). Routes currently live:

| Route | Surface | Source |
|---|---|---|
| `/` | Hà Vy handover dashboard (home) | `ha-vy-handover-dashboard.jsx` |
| `/session/new` | Quick initiate (one-click session creation) | `uc-ho-01-quick-initiate.jsx` |
| `/session/[id]` | Session command view · 6 tabs | `session-command-view.jsx` (slugs: `minh-le`, `phuong-anh`) |
| `/session/[id]?tab=review` | Manager review (UC-HO-04) inline | `uc-ho-04-manager-review.jsx` + siblings |
| `/session/[id]?tab=review&state=s4` | Deep-link to a specific UC-HO-04 state | same |
| `/spec/uc-ho-01/normal` | 8-state happy-path walkthrough | `uc-ho-01-normal-flow.jsx` |
| `/spec/uc-ho-01/edges` | 10-state edge-case walkthrough | `uc-ho-01-edge-cases.jsx` |
| `/guide` | Team guide (rendered Markdown) | `TEAM-GUIDE.md` |
| `/login` · `/api/auth` · `middleware.ts` | Password gate | infra |

Deployment: Next.js on Vercel, auto-deploys from `main` in ~30 seconds.

### 11.2 Sprint roadmap

| Sprint | Duration | Scope | Status |
|---|---|---|---|
| **S0 Platform Foundation** | 1 week | Infra + design system | COMPLETE |
| **SZ Step Zero** | 2 weeks | Z01–Z04 | PENDING (5 blockers — see §13) |
| **S1 Handover Initiation** | 2 weeks | UC-HO-01, UC-HO-05 | COMPLETE (violet/yellow; redesigned 2026-06-02 into 3-phase + drawer→command-view + one-click initiation) |
| **S2 Capture & Verify** | 2 weeks | UC-HO-02 (deferred), UC-HO-03 | COMPLETE on the old amber palette. POC capture surfaces (upload + question queue) PENDING. |
| **S3 KG Commit · UC-HO-04** | 1.5 weeks | UC-HO-04 Manager Review + Sign-off | **COMPLETE 2026-06-07.** Violet/yellow, all 8 states real, live at `/session/[id]?tab=review`. |
| **S4 Onboarding Gen & Read** | 2 weeks | UC-ON-01, UC-ON-02 | COMPLETE on the old amber palette — needs migration |
| **S-KG Consumption plane** | TBD | Knowledge Graph explorer (CL-094) · feedback triage (CL-095) | PENDING · next build · target route `/knowledge-graph` · `MASTER.md` shell |
| **S5 Skill Gap & Feedback** | 1.5 weeks | UC-ON-03, UC-HO-06, UC-HO-07 | PENDING |
| **S6 Polish & Demo** | 1 week | Cross-cutting | PENDING |

Total: ~12 weeks at full scope. The hackathon-compressed mode cuts Step Zero to 1 week with 2 connectors instead of 8, bringing total to ~11 weeks.

### 11.3 Artifacts marked for migration

The following artifacts use the old amber palette from before the CL-054 violet/yellow switch and need a migration sweep:

- `arteep-s2-capture-verify.jsx` — 5 Offboarder screens
- `arteep-s4-onboarding-gen-read.jsx` — 5 Onboarder screens

`arteep-s3-kg-commit.jsx` (the old Manager Completion Report 4 states on amber) is now **superseded** by the UC-HO-04 trio shipped 2026-06-07.

---

## 12. Demo & pitch flow

~3–4 minute pitch. Opens with a 10–15-second Step Zero moment ("Before any handover can happen, our Platform Admin configures the integrations once") demonstrating Z01 → Z02 → Z03. Then transitions to the canonical flow:

1. Hà Vy's Dashboard — 3 pending sessions, 3-phase progress visible
2. One-click initiate session for Minh Lê (quick-initiate page)
3. Command-view Overview tab · Phase 1 Prepare · live seeding from Trello (POC source) — the 4-Layer Hard-Filter visibly dropping noise; the system fans out network knowledge requests (UC-HO-08) to Minh Lê's auto-derived collaborators
4. **POC capture** — Minh Lê uploads files and works through the question queue (manager prompts + network questions); colleagues' flags on wrong/insufficient AI-collected data arrive as his correction tasks. *(Voice interview is Phase 2.)*
5. Phase 2 transcript/content review with the QA-INT-01 inline diff
6. **Manager review tab** (UC-HO-04 · CL-103) — Hà Vy works the bundle item-by-item across the 8 states. Side-by-side raw vs AI-structured, inline edit, send-back composer, the 3-way pre-commit flag chain (Trần catches AI · Minh corrects · Duy corroborates), bundle summary, then **SHA-256 cryptographic sign-off** binding Entra ID identity to an immutable audit trail.
7. Phase 3 KG Commit propagation (animated commit progress in S8) with Canonical Facts surfaced (Regex + Few-Shot sanitization shown, Purview behind)
8. Successor's Knowledge Graph explorer (Consumer plane) — Progressive Disclosure → Contextual-AI chips → 0-token hover → Timeline + Heatmap; the Tier-1 locked stub with "Request access"
9. Trần Hữu Nam's Day 1 playbook with the Canonical badge + lineage drawer
10. Skill Gap analysis
11. Feedback loop · hallucination reported → node flagged "under review" → token-free triage → Manager reviews → Canonical promotion → propagation

The Manager review beat (step 6) showcases the QA-INT-01 §1.4 commit gate end-to-end. The Knowledge Graph explorer beat (step 8) runs on Trello-sourced data in the English-only Consumer-plane shell.

---

## 13. Open decisions

The following decisions need stakeholder input. Resolved items are struck through with the resolution recorded.

### Original V1 blockers (still open)

- **CL-003** — Hackathon-compressed vs production mode (SZ in 1 week with 2 connectors vs full SZ)
- **CL-005** — Vietnam PDPA compliance basis for automated scanning
- **HO-03 TBD-1** — E-signature standard (Vietnam-specific)
- **ON-01 TBD-2** — Static vs interactive Playbook
- **ON-02 TBD-3** — Mobile parity scope (desktop-first v1 is the default)
- ~~**HO-05 TBD-2** — Manager prompts visible to Offboarder pre-capture~~ — **RESOLVED 2026-06-05 (CL-099):** yes, the prompts are the queue the Offboarder answers
- ~~**HO-06 TBD-1** — SLA for Manager correction review~~ — **RESOLVED 2026-06-05 (CL-095):** 2 weekly cycles, then auto-escalate to the Critical path; sign-off still required

### New — UC-HO-08 (opened 2026-06-05)

- **HO-08 TBD-1** — How far the auto-derived connection set reaches (1-hop collaborators only vs N-hop) + manager edit window before send
- **HO-08 TBD-2** — Notification channel + reminder cadence for network requests

### Step Zero blockers (Plan v2)

- **TBD-Z1** — OAuth scope minimums per connector (IT Security)
- **TBD-Z2** — Connector approval workflow + SLA (IT + Legal)
- **TBD-Z3** — Default sync frequency vs rate limits (Product + IT)
- **TBD-Z4** — Source data retention policy by sensitivity (Legal + DPO)
- **TBD-Z5** — Connector deprecation behavior (Product)

---

## 14. Next builds

In rough priority order:

1. **POC Capture surfaces** — self-serve file upload + the asynchronous question queue + UC-HO-08 network-request fan-out (Prepare stage). This is the POC's replacement for the voice interview; voice (UC-HO-02) is Phase 2 (CL-098–101).
2. **Knowledge Graph explorer (Consumer plane)** — `MASTER.md` shell · route `/knowledge-graph` · Progressive Disclosure, Contextual-AI chips, 0-token hover, Timeline + Heatmap, Tier-1/Tier-2 rendering, feedback triage (CL-094–097).
3. **Stakeholder approval** on the Plan v2 decision points (especially Step Zero blockers) + the two new UC-HO-08 TBDs.
4. **Migration sweep** — S2/S4 artifacts to violet/yellow palette (S3 done as of 2026-06-07).
5. **S5 build** — UC-ON-03 (Skill Gap), UC-HO-06 (Report Hallucination), UC-HO-07 (Correction Review).
6. **UC-HO-01 v2 governance spec update** — reflect the 3-phase lifecycle + data-ingestion governance (CL-015 deprecation).
7. **UC-HO-08 spec** — author the full use case (currently only logged via CL-100 / CL-101 and indexed in the master UC index v1.1).
8. **Demo script** — write the 3–4-minute narrative tying all the states together with the 3-phase lifecycle, POC capture, and the KG explorer visible throughout.

---

## 15. Source-of-truth documents

| File | Purpose |
|---|---|
| `docs/arteep/ARTEEP-design-change-log.md` | Living change log · 103 entries (CL-001 → CL-103) |
| `ARTEEP-context-snapshot.md` | Seed document for any future session · last updated 2026-06-07 |
| `docs/arteep/ARTEEP-system-overview.md` | **This document** · the full-view system narrative |
| `ARTEEP-master-uc-index.md` | v1.1 · 11 UCs (UC-HO-08 added), dependency matrix, TBD register |
| `UC-HO-01_initiate-handover-session_v2.md` | UC-HO-01 v2.0 governance spec |
| `UC-HO-02_conduct-ai-guided-voice-interview_v2.md` | UC-HO-02 v2.0 spec (Phase 2) |
| `ARTEEP-implementation-plan-v2.md` | V2 plan with Step Zero, 12-week timeline |
| `QA-INT-01-Dual-Verification-Rule.md` | Foundational governance rule |
| `ART_EEP_Architecture_Summary_EN.md` | Knowledge Lake architecture · source of CL-090–101 |
| `Sprint-1-compact.md` | Sprint 1 snapshot, post-redesign |
| `docs/arteep/POC-pitch.md` | POC pitch document |
| `CLAUDE.md` | Repo guide · authoritative route map |

---

*End of system overview. For decision history and the rationale behind specific choices, see the design change log. For sprint-level mockup artifact references, see §9 of the context snapshot.*
