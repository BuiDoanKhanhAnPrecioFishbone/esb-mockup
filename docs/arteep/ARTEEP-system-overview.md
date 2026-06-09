# ART-EEP · System Overview

*Last updated 2026-06-09 · post CL-118 (POC persona scope narrowed 9 → 8 — Phương Anh removed; four-archetype Consumer model intact). Builds on CL-112 → CL-117 sweep (review-unit terminology unified on "items" / KG count renamed to "entries"; playbook artifact eliminated and Consumption plane unified on the Knowledge Graph; successor field removed from the POC session model; Management-plane chrome rule; playbook reference cleanup; dashboards for infrequent high-stakes activities show actions not aggregates), the 30-day offboarding-window policy (CL-111), the 6→2 tab redesign (CL-107), embedded review cleanup (CL-108) and the now-superseded second-persona review (CL-109 · superseded by CL-118), the consumer-graph company-wide-default correction (CL-110), the UC-HO-04 live merge (CL-103), and the Consumer-plane persona expansion (CL-104). This document is the single-source narrative of the entire ART-EEP system. For decision history see `ARTEEP-design-change-log.md`. For the seed context after compaction see `ARTEEP-context-snapshot.md`. For the use-case catalogue see `ARTEEP-master-uc-index.md`.*

---

## 1. What ART-EEP is

ART-EEP is an enterprise Knowledge Graph platform for employee handover and onboarding, built on Microsoft Azure. It captures a departing employee's tacit knowledge from approved shared workspaces, lets the manager review and sign off on it, commits the verified content to an organisation-wide Knowledge Graph, and grants role-customized access to newcomers (and the rest of the organization) via RBAC — with an active feedback loop. The personalised onboarding playbook as a separate artifact has been eliminated (CL-113); the Consumption plane has exactly one artifact going forward — the company-wide Knowledge Graph — and role-customization happens at the initial-state layer (newcomer initial exploration prompts seeded for the successor's role at commit time).

Three things make it different from a generic knowledge-base or wiki:

- **No interview required for the POC.** Instead of relying on the offboarder's availability for a live voice session, the POC composes an asynchronous queue of questions (manager prompts + auto-derived network requests from the offboarder's collaborators + the offboarder's own additions) that the offboarder answers in text. The voice interview is retained for Phase 2.
- **Human-in-the-loop is the architecture, not a feature.** Every AI output carries visible provenance, every commit requires an explicit manager signature, every change is propagated atomically across all consumers. This is QA-INT-01, a foundational governance rule that sits above sprint-level decisions.
- **Three planes, one knowledge graph.** Management (the manager runs sessions), Capture (the offboarder contributes content), Consumption (any internal user reads the graph — newcomers, project peers, cross-departmental colleagues, upper management). Each plane has its own design language, but the semantic palette is shared so meaning carries across surfaces.

The business spine, set in CL-090: *Data Gravity creates Vendor Lock-in.* Two ROI metrics anchor the pitch — Time-to-Productivity (onboarding compressed from ~2 months to ~2 weeks) and Tacit Knowledge Capture Rate (risk factors + undocumented procedures captured before the employee leaves).

Scope is narrowed to the **Automated Handover Knowledge Lake**. Peer Programming / developer-performance evaluation is explicitly out of scope; it bloated the system and diluted the core message.

The hackathon scoring rubric the build is optimising for: **40% Agentic Workflow · 40% Human-in-the-Loop · 20% Token Efficiency.**

---

## 2. The three planes

ART-EEP is organised into three planes that map to the three actor groups. Each plane has a distinct surface but they share the same underlying data contracts.

### 2.1 Management plane

Owned by the **Manager** (Hà Vy). Surfaces:

- **Dashboard (`/`)** — Hà Vy's multi-session command center. Three concurrent sessions visible with 3-phase progress and urgency layered signals (rose for critical timelines). In the 3-phase redesign the dashboard renders no source chips and no forms (CL-106). **Per CL-117, dashboards for infrequent high-stakes activities show actions, not aggregates** — the previous KPI row and "This week" mini-stats panel are removed; urgency lives at the card level (rose left-border + Urgent pill, "Action needed" badge, days-remaining inline, status text) and segmentation lives in the FilterChips row. Aggregate / throughput metrics belong on a future `/reports` surface or in Thảo Vũ's Heatmap (CL-094), not here. Sessions follow the 30-day offboarding window (CL-111). **The successor field is removed from the session model entirely (CL-114)** — no name, no "to be assigned" placeholder, no field at all; newcomer identity is RBAC-flagged at Knowledge Graph access time (Entra ID Newcomer role), not at session creation. **No "playbook" wording anywhere (CL-113 / CL-116)** — the Deliver phase sub-stage 8 reads "KG access ready"; the completion banner is informational only ("Knowledge Graph access ready for the {role}"), no playbook CTA; the activity feed says "committed to Knowledge Graph", not "playbook generated for X".
- **Quick initiate (`/session/new`)** — one-click session creation. Every field is shown, selectable, and pre-filled to the happy path (CL-105); the Customize panel is open by default. The review deadline defaults to 3–5 days before the last day per the 30-day policy (CL-111). **No successor field appears (CL-114)** — newcomer identity is RBAC-gated at KG access time, not at session creation. The Customize panel exposes three fields in order: Review deadline · Data source · Focus areas. The focus-areas checklist is editable and pre-filled; each item feeds the offboarder's question queue (UC-HO-05). Replaces the old multi-step wizard.
- **Prepare stage (`/prepare/[id]`)** — the automated Prepare cascade the manager oversees: Trello seeded through the 4-Layer Hard-Filter, the auto-derived network + UC-HO-08 knowledge requests, the pre-commit flag → correction loop, and the knowledge map building toward the capture queue. Built & live (`prepare-stage.jsx`).
- **Session command view (`/session/[id]`)** — per-session full-screen workspace with **two visible tabs (CL-107): Overview + Manager review.** The former six (Overview · Stages · Data · Audit log · Manager review · Settings) were collapsed: Stages folds into the hero's 3-phase progress bar, Data + Settings fold into Overview and the action rail, and Audit log becomes a link rather than a tab. Legacy `?tab=stages|data|audit|settings` deep-links resolve to Overview (no 404). The Manager review tab is UC-HO-04 (Sprint 3) rendered inline; see §6.

Design language: locked light-mode system. Violet (`violet-50/100/200/500/600/700`) for brand, AI signal, primary CTAs, active states. Pastel yellow (`yellow-50/100/200/700/800`) for warnings, knowledge gaps, low confidence. Rose reserved for critical severity; emerald for verified / canonical. 1px hairlines, 32px button heights, two-animation budget (recording mic rings + completion glow). Per CL-107, glance-level UI is labels + values only; helper / explainer text is kept only on risky or destructive actions. **Per CL-115, Management-plane chrome doesn't announce the user's role** — topbars use the product wordmark "ART-EEP" alone (dashboard) or a neutral breadcrumb-style route descriptor (quick-initiate · "ART-EEP · Dashboard / Initiate Minh Lê's handover"), never a role qualifier ("Manager dashboard", "Admin X"). RBAC governs access invisibly; the persona pill in the topbar's user area identifies *who* the user is, the chrome doesn't restate it.

### 2.2 Capture plane

Owned by the **Offboarder** (Minh Lê, Khánh Linh Trần — CL-118 narrowed the offboarder persona set 3 → 2; Phương Anh Nguyễn removed from POC scope). In the POC, capture is **self-serve upload + an asynchronous question queue**. Voice interview (UC-HO-02) is deferred to Phase 2.

The queue is the surface. It composes three sources of questions in priority order:

1. **Manager Priority Prompts** (UC-HO-05) — questions Hà Vy explicitly weighted to focus capture
2. **Network-solicited questions** (UC-HO-08, new in CL-100) — questions submitted by the offboarder's auto-derived connection set (Trello card co-members, comment participants, co-assignees, manager, named coach; the manager edits the set before sending)
3. **The offboarder's own additions** — anything Minh Lê thinks the successor will need

Alongside the queue runs a pre-commit, ACL-bounded correction loop (CL-101): colleagues can flag wrong or insufficient AI-collected data, which surfaces as a correction task to the offboarder. The colleague can only flag what they already had access to — the loop is ACL-bounded.

Design language: same as Management. The Prepare-stage fan-out (UC-HO-08) is built at `/prepare/[id]`; the offboarder's own capture surfaces (file upload, question-queue answering) are pending build.

### 2.3 Consumption plane

**Default view · company-wide GraphRAG (CL-110).** The Consumption plane is the organisation's shared knowledge layer, so its default is a **company-wide graph** over everything the system holds: knowledge extracted from departing employees' sources during their handovers, material current employees upload themselves, and data current employees permit the system to collect. The default canvas is a multi-cluster company map (organised by domain / project / team) with **no single person at the center**. A single offboarder centered (e.g. Minh Lê) is **one filtered lens** — filter `offboarder = …` — alongside filters by project, team / department, and status (canonical / contested / critical). *Build status:* the current explorer (`knowledge-graph-explorer.jsx` · `/knowledge-graph`) still hardcodes Minh Lê as the central hub and shows only his handover subgraph, so it diverges from this model; per PO direction the correction is documented (CL-110) and the rebuild is deferred.

**Consumption-plane unification (CL-113).** The plane has exactly one artifact — the company-wide Knowledge Graph above. The earlier separate "personalised onboarding playbook" is eliminated; role-customization happens at the **initial-state layer**, not as a separately-generated document. Each archetype enters the same surface with a different default lens, ACL-bounded.

Per CL-104 / CL-113, the Consumption plane serves **four locked Consumer archetypes** with the following initial-state lenses:

| Archetype | Persona | Initial lens into the Knowledge Graph |
|---|---|---|
| **Newcomer** | Trần Hữu Nam | KG opens with **role-customized initial exploration prompts** seeded for the successor's role (CL-113) — surfaced as Contextual-AI chips above the canvas (e.g. "Where do I start with the auth flow?" · "Who owns the data platform?" · "What's the rollback runbook for billing?"); the **Newcomer RBAC role (Entra ID, CL-114)** gates Consumer-plane access; primary actor for UC-ON-02 (reframed as "Explore Knowledge Graph (role-customized)") |
| **Project peer** | Duy Nguyễn (Senior Data Engineer · Data Platform) | KG opens filtered to cross-team handover context relevant to the current query; corroborates flags (already appeared in UC-HO-04 S6) |
| **Cross-departmental colleague** | Linh Phạm (Product Manager · Product) | KG opens with the adjacent-team filter applied; hits Tier-1 stubs and uses the "Request access" affordance (CL-093) |
| **Upper management** | Thảo Vũ (Engineering Director) | KG opens to the Timeline + Heatmap surfaces (CL-094) for project evolution and risk tracking at her org level |

Interaction model (CL-094): Progressive Disclosure (central node + 1-hop neighbourhood, double-click to expand or collapse), Contextual-AI quick-start chips (center / zoom / dim · also the carrier for the newcomer's initial prompts), 0-token hover via stored `short_summary` (15 words per node), Timeline + Heatmap split-screen for temporal exploration (Thảo's primary surface), Prompt Disambiguation when the user's query is too broad. Per CL-110 these primitives operate over the **company-wide graph**, respecting both the active filter and the viewer's ACL.

Design language deviation (CL-096): the Consumption plane uses the `MASTER.md` "AI-Native Minimal" presentation shell — indigo `#6366F1` primary, glassmorphism cards, light/dark toggle, `rounded-xl`/`2xl`, soft shadows, floating navbar. This is presentation only; the semantic palette is preserved as the meaning layer (rose = critical/locked, yellow = low-confidence/contested, emerald = verified/canonical, violet = AI signal).

The Consumption plane POC showcase is English-only (CL-097); usernames render as latinized handles (`Minh Le`, `@minh.le`, `Duy Nguyen`, `Linh Pham`, `Thao Vu`) within the showcase. Persona identities are unchanged — only the on-screen string is latinized, and no Vietnamese text appears in the showcase.

**Open follow-up:** Heatmap content for Thảo's surface is still unlocked. CL-094 specified "Timeline + Heatmap split-screen" but did not define what the Heatmap shows. Three candidates were proposed during CL-104 (Knowledge Hotspots · Skill Density · Risk Heatmap), all mapping cleanly onto the semantic palette. To be locked in a follow-up CL.

---

## 3. Personas (8 locked · four-archetype Consumer model per CL-104 · narrowed 9 → 8 per CL-118)

Eight personas are locked. Six were established earlier; three were added by CL-104 (2026-06-07) to make the Consumption plane demonstrate how the KG is used internally across the organisation, not only by the canonical Newcomer; then CL-118 (2026-06-09) narrowed the set 9 → 8 by removing the Sales offboarder Phương Anh Nguyễn from POC scope (the four-archetype Consumer-plane model is unaffected — all four archetype actors remain). Each persona has a different handover material mix, scoped to approved shared workspaces only.

| Name | Role | Department | Plane | Notes |
|---|---|---|---|---|
| **Hà Vy** | Manager | Engineering | Management | Owns handover sessions; primary actor in UC-HO-01, UC-HO-04, UC-HO-07. Her Entra ID identity signs the SHA-256 commit gate in UC-HO-04 S8. |
| **Minh Lê** | Offboarder | Engineering | Capture | **Canonical demo persona.** Senior Backend Engineer; 30-day offboarding window (last day Jul 4, 2026 · review deadline Jun 30 · 26 days left at demo time · CL-111). Wired live at `/session/minh-le`. Sources: Jira · GitHub · Google Drive (POC showcase via Trello). **No successor field at session time (CL-114)** — role-customized starter prompts at KG access time are seeded from the "Senior Backend Engineer" role string. |
| **Trần Hữu Nam** | Newcomer / Successor | Engineering | Consumption (newcomer) | Inherits the Senior Backend Engineer role and lands in the company-wide KG with role-customized starter prompts (CL-113). Identified by the Entra ID Newcomer role at KG access time (CL-114), not by session-time assignment. Primary actor for UC-ON-02 / UC-ON-03. Also flags the AI in UC-HO-04 S6 (Atlas rollback chain). |
| **Khánh Linh Trần** | Offboarder | People & Culture | Capture | Head of People Operations. Urgent 2-day offboard — the short-notice **exception** to the 30-day standard (CL-111); exercises EX.2 + high PII (Tier-2 ghosting via Purview + ACL trim). Sources: HRIS · Notion · SharePoint. |
| **An Quân Vũ** | Platform Admin / IT | — | Step Zero | Plan v2 (CL-068). Owns Step Zero (Z01–Z04). The 10–15-second pitch opener. Distinct from Manager in RBAC. |
| **Duy Nguyễn** *(NEW · CL-104 · promoted from supporting)* | Senior Data Engineer | Data Platform | Consumption (project peer) | Already in UC-HO-04 S6 (Atlas rollback 3-way) as the corroborating colleague. Now locked as the **project peer** Consumer archetype. |
| **Linh Phạm** *(NEW · CL-104)* | Product Manager | Product | Consumption (cross-dept) | Locks the **cross-departmental colleague** archetype. Exercises Tier-1 "Request access" affordances (CL-093) on content scoped to other teams. |
| **Thảo Vũ** *(NEW · CL-104)* | Engineering Director | Engineering (leadership tier) | Consumption (upper mgmt) | Locks the **upper management** archetype. **Owns the Timeline + Heatmap surface** (CL-094) — the locked actor that was missing from the previous six-persona set. |

*Note · CL-114 removes the successor field from the POC session model entirely, superseding the "successor optional · to be assigned" portion of CL-111. The 30-day window, the review-deadline-3-5-days-before-last-day rule, and the Khánh Linh 2-day exception from CL-111 are unaffected and remain authoritative. Newcomer identity is established by RBAC (Entra ID Newcomer role) at Knowledge Graph access time, not by session-time assignment. The locked persona set is **eight** (narrowed from nine per CL-118 · 2026-06-09 — Phương Anh Nguyễn removed from POC scope; the four-archetype Consumer-plane model is unaffected). Trần Hữu Nam is locked as the Newcomer archetype not because he is named in any session record, but because he carries the Entra ID Newcomer role at the moment he enters the system as Minh Lê's successor.*

### Four Consumer archetypes mapped to read patterns

| Archetype | Persona | Primary read pattern |
|---|---|---|
| Newcomer | Trần Hữu Nam | Role-customized starter prompts (CL-113) · Newcomer RBAC role gates access (CL-114) · Canonical badge + lineage drawer |
| Project peer | Duy Nguyễn | Cross-team handover context · Progressive Disclosure + Contextual-AI chips |
| Cross-departmental colleague | Linh Phạm | Researching adjacent team work · hits Tier-1 stubs + Request access |
| Upper management | Thảo Vũ | Timeline + Heatmap surfaces · project evolution + risk distribution |

### Material types by department (shared workspaces only)

- **Engineering (Minh Lê)** — Jira tickets, GitHub repos (PR descriptions, commit messages, wiki pages), Google Drive (shared) files. POC showcase source: **Trello** (CL-091).
- **Sales** *(no demo persona post-CL-118)* — Salesforce deals, shared Calendar, SharePoint sales-collateral documents. Remains a documented supported mix per the flexible multi-source model (CL-091); no longer demoed end-to-end in the POC since Phương Anh Nguyễn was removed from POC scope.
- **People Ops (Khánh Linh)** — HRIS records, Notion policy pages, SharePoint policy archive.

Email, personal mailboxes, and private direct messages are excluded from automated collection per the data-ingestion governance rule. Where role-specific context lives in email threads, it surfaces through the POC question queue or manual file upload, never automated scanning.

---

## 4. The 3-phase lifecycle

Internally the system runs an 8-stage pipeline. At the glance level it always renders as 3 user-facing phases. This is CL-088: the 8-stage taxonomy was cognitively heavy at glance views; grouping into 3 phases (Prepare · Capture · Deliver) reduces load without losing internal tracking precision.

The whole lifecycle runs inside the standard 30-day offboarding window (CL-111); the manager's review/handover deadline is set 3–5 days before the last day so the admin and the offboarder verify the captured bundle together. Khánh Linh's 2-day session is the documented short-notice exception that compresses the same three phases.

### Phase 1 · Prepare

*Owned by: Manager + System*

The session is set up and the system scans accessible work across approved sources. Sub-stages: Setup confirmed → Context seeding → Knowledge map ready. The system also fans out network knowledge requests (UC-HO-08) to the offboarder's auto-derived collaborator set, soliciting questions and data flags.

### Phase 2 · Capture

*Owned by: Offboarder + Manager*

The offboarder contributes content. In the POC: self-serve file upload + the asynchronous question queue. In Phase 2 of the product: AI-guided voice interview with Dynamic N-Domain Coverage. Sub-stages: Questions assigned → Answering queue → Answers reviewed.

### Phase 3 · Deliver

*Owned by: System + (RBAC-gated) Newcomer + broader Consumers*

Verified knowledge commits atomically to the Knowledge Graph; role-customized initial exploration prompts are synthesised at commit time from the offboarder's role (e.g. "Senior Backend Engineer") and seeded into the Consumer plane (CL-113); the newcomer's RBAC role (Entra ID Newcomer) gates their Consumer-plane view of the graph (CL-114); the active feedback loop runs in perpetuity. Per CL-104, Deliver reaches all four Consumer archetypes (newcomer · project peer · cross-departmental colleague · upper management), not only the newcomer. Sub-stages: Committed to KG → **KG access ready** (CL-113 / CL-116 · supersedes the prior "Playbook delivered" sub-stage label; there is no playbook artifact).

The phase progress bar (3 segments, violet for current with pulse animation, emerald for done) is the canonical glance widget across every Management surface.

---

## 5. Use case map

Eleven use cases plus Step Zero. The master catalogue with dependency matrix lives in `ARTEEP-master-uc-index.md` (v1.1). Two of the eleven were reframed by CL-113 — UC-ON-01 and UC-ON-02 — as the playbook artifact is eliminated.

### Handover (HO)

| UC | Title | Status |
|---|---|---|
| **UC-HO-01** | Initiate Handover Session | Sprint 1 v2 complete; dashboard + quick-initiate + command-view trio. Review deadline defaults to 3–5 days before last day (CL-111); **no successor field in the session model (CL-114)**. Dashboard + quick-initiate CL-114/115/116/117-applied as of 2026-06-08/09. |
| **UC-HO-02** | Conduct AI-Guided Voice Interview (Dynamic N-Domain Coverage) | Deferred to Phase 2 (CL-098) — out of POC scope |
| **UC-HO-03** | Review and Sign Transcript | Sprint 2 complete (amber palette — needs migration) |
| **UC-HO-04** | Submit Handover Record to Knowledge Graph | **Sprint 3 complete (2026-06-07).** Mockup with 8 real states live at `/session/[id]?tab=review` (CL-103); embedded cleanup CL-108; terminology unified on "items" (CL-112). *(The earlier Phương Anh real-review surface from CL-109 is **superseded by CL-118 (2026-06-09)** — Phương Anh removed from POC scope; the `PhuongAnhReview` component, `PA_SECTIONS` data, and `phuong-anh` slug branch in `session-command-view.jsx` are pending removal in the surface-application commit. The "review model generalizes beyond one persona" proof is preserved at the architecture level — UC-HO-04 + UC-HO-03 are persona-agnostic.)* |
| **UC-HO-05** | Configure Custom Prompts and Section Blueprints | Sprint 1 complete; in POC, prompts feed the capture queue |
| **UC-HO-06** | Report Hallucination or Error | Sprint 5 pending; feedback triage rules set (CL-095) |
| **UC-HO-07** | Approve Knowledge Graph Correction | Sprint 5 pending |
| **UC-HO-08** | Solicit Handover Inputs from the Employee's Network | New (CL-100). Prepare-stage surface built & live at `/prepare/[id]` (`prepare-stage.jsx`); full UC spec still pending. |

### Onboarding (ON)

| UC | Title (CL-113 reframed) | Status |
|---|---|---|
| **UC-ON-01** | **Generate Newcomer Initial Exploration Prompts** *(reframed CL-113 — was "Generate Personalized Onboarding Playbook")* | Synthesis of role-customized starter prompts at commit time (read from the offboarder's role + section blueprints). Sprint 4's old amber surface (`arteep-s4-onboarding-gen-read.jsx`) is **superseded by CL-113** — no migration needed; the surface it portrays (multi-page personalised playbook) no longer exists. Implementation lives in the Consumer-plane explorer rebuild (CL-110). Final naming + prompt-seeding strategy pending (see §13). |
| **UC-ON-02** | **Explore Knowledge Graph (role-customized)** *(reframed CL-113 — was "Read Playbook with Inline Knowledge Tools")* | One unified UC covering all four Consumer archetypes — **CL-113 resolves the CL-104 split question** (no playbook to split around). Pairs with CL-110 (company-wide default) and CL-094 (interaction primitives). Sprint 4's old surface is superseded. |
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

UC-HO-04 is the use case where the QA-INT-01 commit gate becomes visible to the manager. The eight-state mockup completed on 2026-06-07 surfaces every clause of QA-INT-01 in one continuous flow, and lives inside the Session command view as the "Manager review" tab. The pre-commit review unit a manager decides on is an **"item"** (CL-112 · unified vocabulary); the post-commit Knowledge-Graph count on the completed card is **"entries"** — two distinct nouns at two different lifecycle stages, so the same word never names two scales (14 review items vs 487 KG entries).

| State | Name | What it shows |
|---|---|---|
| **S1** | Arrival | Bundle overview · 14 items · **5 source-category tiles** (CL-112 added the "Uploaded files · 3" tile so tiles sum to 14) · one compact "pre-checks cleared" line · single "Start with item 1" CTA. *Collapsed per CL-108 — the earlier "recommended review order" card and the 6-item "pre-review checks" grid were removed.* |
| **S2** | Reviewing priority | Side-by-side raw source vs AI-structured rendering · Source Provenance Strip · Network Corroboration Card |
| **S3** | Quick accept | Accepted Toast Bar · Canonical upgrade · Post-accept inline actions |
| **S4** | Edit inline | Rose strikethrough for deletions + violet underline for insertions · "Edit history · all versions kept" footer (3-card lineage trail). *Internal labels (e.g. "CL-086 grammar", "Worker SLM") stripped from visible copy per CL-108.* |
| **S5** | Send back | Incomplete Answer Card · AI-drafted Send-Back Composer · Urgency Selector · Source Context Panel · Send-Back Impact Note |
| **S6** | Pre-commit flag fix | The Atlas rollback 3-way: AI got it wrong → Trần flagged 4h ago → Minh corrected 30m ago (snapshot → staging → verify → promote 94%) → Duy corroborated in #data-platform. Three-way diff in grid-cols-3 (rose / yellow / emerald). Flag Network Agreement Card. Audit Chain Preview (5-row immutable trail) |
| **S7** | Bundle summary | Outcome stats (9 accept / 3 edit / 2 send-back / 0 reject) · Category Breakdown Table · Propagation Preview (5-node graph) · Team Impact Row (Engineering 8 · Sales 1 · Data Platform 2) · Ready-to-Sign-Off Strip |
| **S8** | Sign-off | The QA-INT-01 §1.4 commit gate rendered as a **SHA-256 cryptographic anchor** (`8f3a2b9c…d7a5f` preview) bound to Hà Vy's Entra ID identity. 8-step Commit Progress Log (hash validation → ACL trim → Purview gate → Cosmos writes → Verified edges → KG propagation → Slack notifications → audit log entry). 15-minute undo grace before the trail becomes immutable. *(CL-113 / CL-116: the prior "playbook propagation" step is now "KG propagation" — there is no playbook artifact.)* |

The mockup is architected per CL-102 as a sibling-file pattern: main file owns shared scaffolding (ReviewShell, ItemListRail, DecisionRail, DiffPanes, LineageCard, ContextStrip, BundleProgress), with two siblings owning the heavier states (`uc-ho-04-s6-flag-fix.jsx`, `uc-ho-04-s7s8-signoff.jsx`).

CL-103 wires it live: `embedded` + `state` props let SessionCommandView render UC-HO-04 inline as the **Manager review tab — now one of only two visible tabs (CL-107)**. URL routing — `/session/minh-le?tab=review` lands on S1; `/session/minh-le?tab=review&state=s4` deep-links to S4. In the embedded view the loud S1–S8 state strip is replaced by a muted "Preview · {state} · ‹N/8›" stepper and internal jargon is stripped from the copy (CL-108). **CL-118 (2026-06-09) supersedes CL-109** — the second-persona review surface (Phương Anh · Sales bundle) is removed from POC scope along with the persona; the `phuong-anh` slug branch in `session-command-view.jsx`, the `PhuongAnhReview` component, and the `PA_SECTIONS` data are removed in the surface-application commit. The Minh Lê review surface remains the single end-to-end review demo; the persona-agnosticism of the review model is preserved at the UC spec level (UC-HO-04 + UC-HO-03 work on any bundle regardless of source department). *(Sibling files for S6–S8 may still carry some internal jargon and successor-name framing — a follow-up CL-114 / CL-108 cleanup is flagged.)*

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

- **Tier 2** (sensitive / legal) — ghosted via strict ACL trim. The newcomer never sees the existence of these nodes.
- **Tier 1** (operational, access-controlled) — returns a **metadata-only stub** for the Lock + "Request access" affordance. A narrow exception to pre-retrieval ACL trimming: the viewer sees that the node exists and can request access, but does not see content until access is granted. **Linh Phạm (CL-104) is the canonical actor for this affordance.**

### 7.5 Knowledge Graph consumer-plane interaction model (CL-094)

Progressive Disclosure (central node + 1-hop · double-click expand/collapse) · Contextual-AI quick-start chips (center/zoom/dim · also the carrier for the newcomer's initial exploration prompts per CL-113) · 0-token hover via stored 15-word `short_summary` · Timeline + Heatmap split-screen (**Thảo Vũ's surface per CL-104**) · Prompt Disambiguation on broad queries. Operates over the company-wide default graph (CL-110), respecting the active filter + the viewer's ACL. Optimises for token efficiency (the 20% scoring weight).

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
- Glance-level UI is labels + values only (CL-107); helper / explainer text only on risky or destructive actions
- **Management-plane dashboards show actions, not aggregates (CL-117)** — for an infrequent high-stakes activity (offboarding), weekly counts, all-time averages, and throughput totals are measurement chrome rather than action prompts; they belong on a future `/reports` surface or in Thảo Vũ's Heatmap (CL-094), not on the operational dashboard. The Hà Vy dashboard exposes only a greeting → FilterChips (segmentation by status with counts) → session list + Recent activity. Card-level affordances carry urgency.
- **Management-plane chrome doesn't announce the user's role (CL-115)** — topbars use the product wordmark "ART-EEP" alone or a neutral route descriptor (e.g. breadcrumb-style "ART-EEP · Dashboard / Initiate Minh Lê's handover"); no "Manager dashboard" or "Admin X" qualifier. The persona pill in the user area shows *who* the user is, not what the surface is called. The "Manager review" tab label inside the session command view is *content* (a mode of work), not chrome, and is unaffected.
- **Session model has no successor field (CL-114)** — newcomer identity is RBAC-flagged at KG access time via Entra ID's Newcomer role, not at session-time. Surfaces show no "Successor: X" line, no "to be assigned" placeholder, and no field in the Customize panel.

### 8.3 UX writing

- English by default. The Vietnamese deviation (CL-077) is scoped to the Transactional Gateways artifact only.
- Sentence case · active voice · Linear/Notion/Stripe register
- Named humans, not roles: "Hà Vy will review" not "your manager will review"
- "Sensitive content" — not "PII". "Microsoft Purview" never appears in user copy. Internal references (CL-###, QA-INT-01 §, agent-tier names) never appear in user copy (CL-108).
- Vietnamese system terms preserved in tooltips: "Canonical · Sự thật gốc" (overridden in the POC Consumer-plane showcase per CL-097, where Canonical renders in English only).
- **No "playbook" in user copy (CL-113 / CL-116)** — the Consumption plane has one artifact (the company-wide Knowledge Graph per CL-110); newcomers enter via role-customized initial exploration prompts gated by their Entra ID Newcomer role (CL-114). Phase 3 Deliver sub-stage 8 is "KG access ready", not "Playbook delivered". Activity-feed and completion-banner wording reflects this throughout.
- **Two distinct nouns for two units (CL-112)** — pre-commit review units the manager decides on are "items" everywhere (UC-HO-04 bundle items, Phương Anh's Sales items, etc.); the post-commit Knowledge-Graph count is "entries". One review = one item; one committed node = one entry. The two never collide on screen.

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
- **Refinement C (CL-083 → CL-086)** — Inline edit had no diff. Fixed: original AI text greyed/strikethrough above the editable field, "Original · AI-generated" label, QA-INT-01 §1.3 honoured in the edit history. *(The visible "§1.3 citation" label was later removed from user copy per CL-108; the diff behaviour is unchanged.)*

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
- **Entra ID** — RBAC. Three relevant roles in the POC: **Manager** (owns sessions; signs the SHA-256 commit gate in UC-HO-04 S8 via Entra ID identity); **Platform Admin** (Step Zero, distinct from Manager); **Newcomer** (CL-114 — gates Consumer-plane access at KG access time; carries the role-customized initial exploration prompts per CL-113). Newcomer identity is RBAC-flagged at Entra ID level, not at session-time.
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
| `/prepare/[id]` | Prepare stage — UC-HO-08 network solicitation + Trello 4-layer seed | `prepare-stage.jsx` |
| `/session/[id]` | Session command view · 2 tabs (Overview + Manager review · CL-107) | `session-command-view.jsx` (slug: `minh-le` · `phuong-anh` slug removed per CL-118 — surface application pending) |
| `/session/[id]?tab=review` | Manager review — Minh Lê → UC-HO-04 (8 states). *(Phương Anh review per CL-109 superseded by CL-118 — Sales persona removed from POC scope.)* | `uc-ho-04-manager-review.jsx` + siblings · `session-command-view.jsx` |
| `/session/[id]?tab=review&state=s4` | Deep-link to a specific UC-HO-04 state (Minh Lê) | same |
| `/knowledge-graph` | Consumer-plane graph explorer · single-subject today, pending CL-110 company-wide rework | `knowledge-graph-explorer.jsx` |
| `/m1-initiation` | Module 1 initiation walkthrough | `m1-handover-initiation.jsx` |
| `/settings` | App settings | `app/settings/page.tsx` |
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
| **S1 Handover Initiation** | 2 weeks | UC-HO-01, UC-HO-05 | COMPLETE (violet/yellow; redesigned 2026-06-02 into 3-phase + drawer→command-view + one-click initiation; 6→2 tab collapse + minimal copy CL-107; 30-day window CL-111; **no-successor-field session model CL-114; chrome rule CL-115; playbook-ref cleanup CL-116; dashboard action-orientation CL-117; POC persona scope narrowed 9 → 8 CL-118** — applied to dashboard + quick-initiate as of 2026-06-08/09; **CL-118 surface application pending** for dashboard `SESSIONS_ACTIVE` (3 → 2), session-command-view (`phuong-anh` slug + `PhuongAnhReview` + `PA_SECTIONS` removal), and `app/session/[id]/page.tsx` slug allow-list). |
| **S2 Capture & Verify** | 2 weeks | UC-HO-02 (deferred), UC-HO-03 | COMPLETE on the old amber palette. POC offboarder capture surfaces (upload + question queue) PENDING; Prepare-stage fan-out (UC-HO-08) built at `/prepare/[id]`. |
| **S3 KG Commit · UC-HO-04** | 1.5 weeks | UC-HO-04 Manager Review + Sign-off | **COMPLETE 2026-06-07.** Violet/yellow, all 8 states real, live at `/session/[id]?tab=review`; embedded cleanup CL-108; Phương Anh real review CL-109; terminology unified on "items" CL-112. |
| **S4 Onboarding Gen & Read** | 2 weeks | UC-ON-01, UC-ON-02 | **SUPERSEDED 2026-06-08 by CL-113** — the playbook artifact no longer exists; UC-ON-01 is reframed as "Generate Newcomer Initial Exploration Prompts" and UC-ON-02 as "Explore Knowledge Graph (role-customized)". Implementation lives in the Consumer-plane explorer rebuild (S-KG). No migration needed for the old `arteep-s4-onboarding-gen-read.jsx`. |
| **S-KG Consumption plane** | TBD | Knowledge Graph explorer (CL-094) · **company-wide default (CL-110)** · **role-customized newcomer entry per CL-113** · feedback triage (CL-095) · **four-archetype reader model (CL-104)** | PENDING · next build · target route `/knowledge-graph` · `MASTER.md` shell. Must default to the company-wide GraphRAG (offboarder/project/team/status filters), gate Consumer-plane access by RBAC (Newcomer role per CL-114), and surface initial-state lenses for Trần (role-customized prompts) · Duy (cross-team query) · Linh (cross-dept research + Request access) · Thảo (Timeline + Heatmap). |
| **S5 Skill Gap & Feedback** | 1.5 weeks | UC-ON-03, UC-HO-06, UC-HO-07 | PENDING |
| **S6 Polish & Demo** | 1 week | Cross-cutting | PENDING |

Total: ~12 weeks at full scope. The hackathon-compressed mode cuts Step Zero to 1 week with 2 connectors instead of 8, bringing total to ~11 weeks.

### 11.3 Artifacts marked for migration or superseded

- `arteep-s2-capture-verify.jsx` — 5 Offboarder screens on old amber palette. **Migration pending.**
- `arteep-s4-onboarding-gen-read.jsx` — 5 Onboarder screens on old amber palette. **SUPERSEDED 2026-06-08 (CL-113)** — no migration needed; the surface it portrays (multi-page personalised playbook) no longer exists in the system. The Consumer-plane explorer rebuild (CL-110) is the new home for the Newcomer experience.
- `arteep-s3-kg-commit.jsx` — the old Manager Completion Report 4 states on amber. **SUPERSEDED 2026-06-07** by the UC-HO-04 trio.

---

## 12. Demo & pitch flow

~3–4 minute pitch. Opens with a 10–15-second Step Zero moment ("Before any handover can happen, our Platform Admin configures the integrations once") demonstrating Z01 → Z02 → Z03. Then transitions to the canonical flow:

1. Hà Vy's Dashboard — **2 pending sessions** post CL-118 narrowing (Minh Lê · Khánh Linh — was 3 with Phương Anh), 3-phase progress visible. No KPI row above; the FilterChips row carries segmentation; urgency lives at the card level (CL-117). Topbar reads "ART-EEP" only, no role qualifier (CL-115).
2. One-click initiate session for Minh Lê (quick-initiate page) — Customize panel open by default with Review deadline · Data source · Focus areas; no Successor field anywhere (CL-114).
3. Prepare stage (`/prepare/[id]`) · Phase 1 · live seeding from Trello (POC source) — the 4-Layer Hard-Filter visibly dropping noise; the system fans out network knowledge requests (UC-HO-08) to Minh Lê's auto-derived collaborators (Duy, Linh, and others)
4. **POC capture** — Minh Lê uploads files and works through the question queue (manager prompts + network questions); colleagues' flags on wrong/insufficient AI-collected data arrive as his correction tasks. *(Voice interview is Phase 2.)*
5. Phase 2 transcript/content review with the QA-INT-01 inline diff
6. **Manager review tab** (UC-HO-04 · CL-103) — Hà Vy works the bundle item-by-item across the 8 states. Side-by-side raw vs AI-structured, inline edit, send-back composer, the 3-way pre-commit flag chain (Trần catches AI · Minh corrects · Duy corroborates), bundle summary, then **SHA-256 cryptographic sign-off** binding Entra ID identity to an immutable audit trail. *(Per CL-118, the Sales-bundle review demo via Phương Anh that CL-109 originally provided is removed from POC scope; the persona-agnosticism of the review model is preserved at the UC spec level — UC-HO-04 + UC-HO-03 work on any bundle regardless of source department.)*
7. Phase 3 KG Commit propagation (animated commit progress in S8) with Canonical Facts surfaced (Regex + Few-Shot sanitization shown, Purview behind). 487 **entries** committed (CL-112 vocabulary).
8. **Consumption plane · company-wide graph, four reader archetypes** (CL-104 / CL-110 / CL-113 / CL-114) — the PO's "show how the KG is used internally" beat. The graph opens company-wide; archetypes filter into it via their Entra ID role:
   - **Trần Hữu Nam** (newcomer · Entra ID Newcomer role · CL-114) lands in the KG with **role-customized initial exploration prompts** seeded for the Senior Backend Engineer role (CL-113) — Contextual-AI chips like "Where do I start with the auth flow?" · "What's the rollback runbook for billing?". Canonical badge + lineage drawer; Tier-1 locked stub with "Request access".
   - **Duy Nguyễn** (project peer · Data Platform) queries the KG for context on a Minh handover item · Progressive Disclosure + Contextual-AI chips
   - **Linh Phạm** (cross-departmental colleague · Product) researches an adjacent team's work · hits a Tier-1 stub on a Finance node and requests access
   - **Thảo Vũ** (upper management · Engineering Director) opens the Timeline + Heatmap surfaces · sees project evolution + risk distribution at her org level
9. Skill Gap analysis (Trần Hữu Nam's growth plan, surfaced from the graph)
10. Feedback loop · hallucination reported → node flagged "under review" → token-free triage → Manager reviews → Canonical promotion → propagation

The Manager review beat (step 6) showcases the QA-INT-01 §1.4 commit gate end-to-end. The Consumption beat (step 8) is the PO's internal-KG demonstration; it runs on Trello-sourced data in the English-only Consumer-plane shell, opening on the company-wide graph before any archetype filters in. Importantly the demo no longer says the word "playbook" — there is no playbook artifact; each role enters the same Knowledge Graph with a different lens (CL-113).

---

## 13. Open decisions

The following decisions need stakeholder input. Resolved items are struck through with the resolution recorded.

### Original V1 blockers (mostly resolved)

- **CL-003** — Hackathon-compressed vs production mode (SZ in 1 week with 2 connectors vs full SZ)
- **CL-005** — Vietnam PDPA compliance basis for automated scanning
- **HO-03 TBD-1** — E-signature standard (Vietnam-specific)
- ~~**ON-01 TBD-2** — Static vs interactive Playbook~~ — **OBSOLETE 2026-06-08 (CL-113):** no playbook artifact; UC-ON-01 reframed as "Generate Newcomer Initial Exploration Prompts" — the question is moot
- **ON-02 TBD-3** — Mobile parity scope (desktop-first v1 is the default). Note: UC-ON-02 is reframed by CL-113 as "Explore Knowledge Graph (role-customized)" — the mobile-parity question now applies to the Consumer-plane explorer rather than to a playbook reader.
- ~~**HO-05 TBD-2** — Manager prompts visible to Offboarder pre-capture~~ — **RESOLVED 2026-06-05 (CL-099):** yes, the prompts are the queue the Offboarder answers
- ~~**HO-06 TBD-1** — SLA for Manager correction review~~ — **RESOLVED 2026-06-05 (CL-095):** 2 weekly cycles, then auto-escalate to the Critical path; sign-off still required
- ~~**Offboarding window + successor model**~~ — **RESOLVED 2026-06-08 (CL-111 · further refined CL-114):** 30-day window · review deadline 3–5 days before last day · **successor field removed from POC scope entirely (CL-114)** · newcomer identified by RBAC at KG access time, not by session-time assignment · Khánh Linh is the 2-day short-notice exception
- ~~**POC persona scope**~~ — **RESOLVED 2026-06-09 (CL-118):** locked set narrowed 9 → 8 · Phương Anh Nguyễn (Sales · Senior Account Executive) removed from POC scope · four-archetype Consumer-plane model intact (all four archetype actors retained — Trần newcomer · Duy project peer · Linh cross-dept · Thảo upper mgmt) · urgent short-notice exception preserved (Khánh Linh) · Step Zero preserved (An Quân Vũ) · CL-109 (Phương Anh review surface) superseded · CL-063 (3 concurrent sessions) partially superseded · CL-087 Sales source mix remains documented per CL-091 but no longer demoed

### New — UC-HO-08 (opened 2026-06-05)

- **HO-08 TBD-1** — How far the auto-derived connection set reaches (1-hop collaborators only vs N-hop) + manager edit window before send
- **HO-08 TBD-2** — Notification channel + reminder cadence for network requests

### New — Consumer-plane (opened 2026-06-07 / 06-08 · post-CL-104 / CL-110 / CL-113)

- **Heatmap content definition** — three candidates proposed by the Microsoft AI prompt review (Knowledge Hotspots / Skill Density / Risk Heatmap). All three map cleanly onto the existing semantic palette. With Thảo Vũ now locked as the Heatmap actor, this needs a separate CL to lock the definition. Owner: BA + Product.
- ~~**UC-ON-02 scope** — extend or split for the four Consumer archetypes~~ — **RESOLVED 2026-06-08 (CL-113):** no playbook to split around; UC-ON-02 unified as "Explore Knowledge Graph (role-customized)" for all four archetypes
- **Newcomer initial-prompt seeding strategy (post-CL-113)** — open: how many prompts (suggest 4–6) · static templates vs LLM-generated at commit time · token-budget implications. The synthesis step at commit time is where this lives. Owner: BA + Product.
- **UC-ON-01 / UC-ON-02 final naming in the master UC index (post-CL-113)** — working names locked; final BA-authored names pending. Owner: BA.
- **Consumer graph rebuild (CL-110)** — rebuild `knowledge-graph-explorer.jsx` to default to the company-wide GraphRAG with offboarder/project/team/status filters (currently hardcodes Minh Lê) and to surface the four-archetype initial-state lenses per CL-113. Documented; build deferred per PO. Owner: PO + BA.
- ~~**Phương Anh's successor**~~ — **OBSOLETE 2026-06-08 (CL-114):** the successor field is removed entirely; the question of who replaces her is post-hoc and resolved by RBAC at KG access time, not at session creation.
- ~~**Minh Lê days-left consistency**~~ — **RESOLVED 2026-06-08 (CL-111):** standard 30-day window — Minh = last day Jul 4 · review deadline Jun 30 · 26 days left at demo time.

### Cross-cutting watch items (CL-117 era)

- **Dashboard action-orientation rule generalization (CL-117)** — the cross-cutting principle that Management-plane dashboards show actions not aggregates is logged. Watch for re-introduction of weekly/period KPI tiles on future surfaces; any operational dashboard for an infrequent high-stakes activity must follow the same rule. Aggregate / throughput metrics belong on a future `/reports` view or in the Heatmap surface.

### Step Zero blockers (Plan v2)

- **TBD-Z1** — OAuth scope minimums per connector (IT Security)
- **TBD-Z2** — Connector approval workflow + SLA (IT + Legal)
- **TBD-Z3** — Default sync frequency vs rate limits (Product + IT)
- **TBD-Z4** — Source data retention policy by sensitivity (Legal + DPO)
- **TBD-Z5** — Connector deprecation behavior (Product)

---

## 14. Next builds

In rough priority order:

1. **Continue the CL-114 / CL-115 / CL-116 surface sweep across the remaining Management-plane mockups.** Dashboard (`ha-vy-handover-dashboard.jsx`) and quick-initiate (`uc-ho-01-quick-initiate.jsx`) are **done as of 2026-06-08/09**. Still pending:
   - `session-command-view.jsx` — any "Successor:" line in Overview / hero / sidebar (CL-114); verify topbar has no role qualifier (CL-115); verify no playbook refs (CL-116)
   - `prepare-stage.jsx` — any successor display (CL-114); verify topbar (CL-115)
   - `uc-ho-04-manager-review.jsx` and its siblings (`uc-ho-04-s6-flag-fix.jsx`, `uc-ho-04-s7s8-signoff.jsx`) — any "for successor X" framing in S7 bundle summary or S8 sign-off copy (CL-114); the sibling-file jargon cleanup from CL-108 also flagged here
2. **POC Capture surfaces** — the **Prepare-stage fan-out (UC-HO-08) is built & live at `/prepare/[id]`**; still pending are the offboarder's self-serve file-upload + question-queue answering surfaces. This is the POC's replacement for the voice interview; voice (UC-HO-02) is Phase 2 (CL-098–101).
3. **Knowledge Graph explorer (Consumer plane) · company-wide default + four-archetype scope + role-customized newcomer entry** — `MASTER.md` shell · route `/knowledge-graph` · Progressive Disclosure, Contextual-AI chips (carrier for the newcomer's initial prompts per CL-113), 0-token hover, Timeline + Heatmap, Tier-1/Tier-2 rendering, feedback triage (CL-094–097). Must default to the company-wide GraphRAG with offboarder/project/team/status filters (CL-110); gate access by RBAC (Newcomer role per CL-114); surface the four archetype initial-state lenses per CL-113.
4. **Heatmap content definition** — lock which of Knowledge Hotspots / Skill Density / Risk Heatmap (or which subset) ships, with semantic-palette mapping. Thảo Vũ is the locked actor.
5. **Newcomer initial-prompt seeding strategy (CL-113 follow-up #3)** — number of prompts, static vs LLM-generated at commit time, token budget.
6. **UC-ON-01 / UC-ON-02 final naming in the master UC index (CL-113 follow-ups #1 + #2)** — BA-owned.
7. **Stakeholder approval** on the Plan v2 decision points (especially Step Zero blockers) + the two UC-HO-08 TBDs.
8. **Migration sweep** — S2 artifacts to violet/yellow palette. S3 already done (2026-06-07); **S4 no longer needs migration (CL-113 superseded it)**.
9. **S5 build** — UC-ON-03 (Skill Gap), UC-HO-06 (Report Hallucination), UC-HO-07 (Correction Review).
10. **UC-HO-01 v2 governance spec update** — reflect the 3-phase lifecycle + data-ingestion governance (CL-015 deprecation) + the 30-day window (CL-111) + **no-successor-field session model (CL-114) + chrome labeling rule (CL-115) + action-orientation rule (CL-117)**.
11. **UC-HO-08 spec** — author the full use case (currently logged via CL-100 / CL-101, surfaced at `/prepare/[id]`, and indexed in the master UC index v1.1).
12. **Demo script** — write the 3–4-minute narrative tying all the states together with the 3-phase lifecycle, POC capture, Manager review, and the company-wide Consumption beat with role-customized newcomer entry. No "playbook" anywhere in the script.

---

## 15. Source-of-truth documents

| File | Purpose |
|---|---|
| `docs/arteep/ARTEEP-design-change-log.md` | Living change log · entries CL-001 → CL-118 |
| `ARTEEP-context-snapshot.md` | Seed document for any future session |
| `docs/arteep/ARTEEP-system-overview.md` | **This document** · the full-view system narrative |
| `ARTEEP-master-uc-index.md` | v1.1 · 11 UCs (UC-HO-08 added; UC-ON-01 / UC-ON-02 reframed by CL-113 · final names pending), dependency matrix, TBD register |
| `UC-HO-01_initiate-handover-session_v2.md` | UC-HO-01 v2.0 governance spec — pending update to include CL-111 / CL-114 / CL-115 / CL-117 / CL-118 |
| `UC-HO-02_conduct-ai-guided-voice-interview_v2.md` | UC-HO-02 v2.0 spec (Phase 2) |
| `ARTEEP-implementation-plan-v2.md` | V2 plan with Step Zero, 12-week timeline |
| `QA-INT-01-Dual-Verification-Rule.md` | Foundational governance rule |
| `ART_EEP_Architecture_Summary_EN.md` | Knowledge Lake architecture · source of CL-090–101 |
| `Sprint-1-compact.md` | Sprint 1 snapshot, post-redesign |
| `docs/arteep/POC-pitch.md` | POC pitch document |
| `CLAUDE.md` | Repo guide · authoritative route map |

---

*End of system overview. For decision history and the rationale behind specific choices, see the design change log. For sprint-level mockup artifact references, see §9 of the context snapshot.*
