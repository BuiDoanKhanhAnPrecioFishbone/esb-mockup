# ART-EEP — Design Change Log

*Living document. Every design or architectural decision made during build is logged here with its rationale. Entries are append-only; never delete, only mark superseded.*

---

## Entry Format

| Field | Purpose |
|---|---|
| Date | When the decision was made |
| Sprint | Which sprint the decision belongs to |
| Change | What was decided or changed |
| UC Reference | The Use Case step, rule, or TBD this traces to (or "cross-cutting" if system-wide) |
| Why | The rationale — the "because" behind the decision |
| Decided By | Role / team that owns this decision |
| Category | BA Gap · UX Refinement · Visual System · Performance · Scope Deferral · Default Pending Confirmation · Engineering Pattern |

---

## Sprint 0 — Foundation

### CL-001 — UI copy language standardized to English

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S0 |
| Change | All user-facing UI copy will be written in English. Proper nouns (persona names like Trần Hữu Nam, Minh Lê, Hà Vy) remain unchanged as they are names, not content. |
| UC Reference | Cross-cutting (all UCs) |
| Why | Stakeholder direction. Broader team accessibility and international consistency. The prior Vietnamese copy from the State-driven Prototype phase is superseded by this decision. |
| Decided By | Stakeholder |
| Category | UX Refinement |

### CL-002 — UX writing principles adopted

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S0 |
| Change | Adopted six writing principles for all UI copy: (1) Clear, not clever; (2) Active voice; (3) Concise; (4) Helpful, not corporate; (5) Consistent vocabulary; (6) Action-oriented buttons. Sentence case throughout. |
| UC Reference | Cross-cutting (all UCs) |
| Why | English copy quality is non-negotiable for enterprise-grade perception. Matches Linear / Notion / Stripe / GitHub register. |
| Decided By | UX |
| Category | UX Refinement |

### CL-003 — Hackathon-compressed mode confirmed

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S0 |
| Change | Build mode is Hackathon-compressed: real Azure architecture (Cosmos DB Gremlin, Azure AI Search, Semantic Kernel, Purview), but external integrations (HR sync, Microsoft Graph Connectors, Whisper API) are mocked with deterministic fixtures during the demo period. Production integration work is deferred to v2. |
| UC Reference | Cross-cutting |
| Why | The architecture stays honest, the demo runs reliably, and integration realism is a v2 concern rather than a v1 blocker. |
| Decided By | BA Pod (default) — reversible by stakeholder before S1 |
| Category | Default Pending Confirmation |

### CL-004 — Demo personas locked

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S0 |
| Change | Canonical demo personas: **Trần Hữu Nam** (Onboarder, Senior Backend Engineer), **Minh Lê** (Offboarder / predecessor in the same role), **Hà Vy** (Manager). |
| UC Reference | Cross-cutting (referenced in all screens with mock data) |
| Why | Continuity with prior phase preserves narrative momentum. Three named characters make the demo a story. |
| Decided By | BA Pod (default) |
| Category | Default Pending Confirmation |

### CL-005 — Sprint blocker defaults taken pending stakeholder confirmation

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S0 |
| Change | Defaults adopted for 5 sprint-blocking TBDs, each reversible before its target sprint starts. |
| UC Reference | UC-HO-01, UC-HO-03, UC-ON-01, UC-ON-02 |
| Why | Each default is the simpler, lower-risk path. Each can be reversed without architectural rework if stakeholder corrects before the target sprint starts. |
| Decided By | BA Pod (default) |
| Category | Default Pending Confirmation |

### CL-006 — Shared component library built in S0

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S0 |
| Change | All 7 shared components built in Sprint 0 before any screen work begins. |
| UC Reference | Cross-cutting (components reused across ≥3 screens each) |
| Why | Eliminates duplication risk across S1–S5 and locks the visual grammar before any screen-level decisions can drift it. |
| Decided By | Architecture |
| Category | Visual System |

### CL-007 — State taxonomy locked at 14 states

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S0 |
| Change | The 14-state vocabulary defined in the Implementation Plan §4 is locked. |
| UC Reference | Cross-cutting |
| Why | A bounded vocabulary forces consistency. |
| Decided By | Architecture + UX |
| Category | Visual System |

### CL-008 — Color palette restricted to two accents *(SUPERSEDED by CL-054)*

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S0 |
| Change | Visual system uses exactly two accent colors: amber + rose. Emerald reserved for verified-content badges. *Superseded by CL-054 which introduces violet + pastel yellow.* |
| UC Reference | Cross-cutting |
| Why | When every signal has its own color, no signal stands out. |
| Decided By | UX |
| Category | Visual System |

### CL-009 — Animation budget restricted to two moments

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S0 |
| Change | Animation permitted in exactly two places: recording indicator rings (UC-HO-02), per-section completion glow (UC-ON-01). |
| UC Reference | UC-HO-02, UC-ON-01 |
| Why | Enterprise tools earn credibility through restraint. |
| Decided By | UX |
| Category | Visual System |

### CL-010 — Border discipline locked at 1px

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S0 |
| Change | All borders in the system are 1px hairlines using gray-200. |
| UC Reference | Cross-cutting |
| Why | The 1px hairline is the single most identifiable visual signature of enterprise deep-tech UI. |
| Decided By | UX |
| Category | Visual System |

---

## Sprint 1 — Handover Initiation

### CL-011 — CTAs in screens advance to next sprint screen (happy path only)

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 |
| Change | In the S1 prototype, primary CTAs advance the prototype to the next screen's happy path. |
| UC Reference | Cross-cutting |
| Why | A purely state-driven prototype with no forward motion feels like a slideshow. |
| Decided By | UX |
| Category | UX Refinement |

### CL-012 — "Sensitive content" copy replaces "PII" in user-facing text

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 |
| Change | The term "PII" is replaced with "personal or sensitive content" in user-facing copy. UC docs and architecture continue to use "PII classification" and "Microsoft Purview" as technical terms. |
| UC Reference | UC-HO-01 step 8, UC-HO-01 SR (Purview PII Gate) |
| Why | "PII" is industry jargon. "Sensitive content" is clearer and more honest about the scope. |
| Decided By | UX |
| Category | UX Refinement |

### CL-013 — "Microsoft Purview" not named in user-facing copy

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 |
| Change | The product name "Microsoft Purview" does not appear in user-facing copy. |
| UC Reference | UC-HO-01 step 8, UC-HO-01 EX.4 |
| Why | No backend leakage in UX copy. |
| Decided By | UX |
| Category | UX Refinement |

### CL-014 — Critical Notice Period banner copy

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 |
| Change | EX.3 banner uses the actual person's name, not a placeholder. |
| UC Reference | UC-HO-01 EX.3 |
| Why | Naming the person grounds the urgency in someone the Manager actually knows. |
| Decided By | UX |
| Category | UX Refinement |

### CL-015 — Email source description clarifies privacy constraint inline *(DEPRECATED 2026-06-02 by CL-087)*

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 |
| Change | The Email metadata data source row in the Setup Wizard includes the inline copy: *"Subject lines and participants only. Email content is never read or stored."* *Deprecated 2026-06-02 — email is no longer an automated data source per the data-ingestion governance rule (CL-087). The inline-scope-reminder pattern generalizes to all sources.* |
| UC Reference | UC-HO-01 SR (Privacy — Email Scanning Constraint) — also superseded |
| Why | The constraint was a real privacy guarantee enforced at the integration layer. Now obviated because email isn't read at all. |
| Decided By | UX (original) · Stakeholder (deprecation) |
| Category | UX Refinement (deprecated) |

### CL-016 — "Likely knowledge gaps" framed as warm guidance, not deficiency

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 |
| Change | The Knowledge Map screen frames detected gaps as "Likely knowledge gaps" with warm-amber styling and constructive phrasing rather than alarming language. |
| UC Reference | UC-HO-01 step 9 (Preliminary Knowledge Map) |
| Why | Naming knowledge gaps as "deficiencies" makes the Manager defensive about their team. |
| Decided By | UX |
| Category | UX Refinement |

### CL-017 — Progress stages use "Skipped" with strikethrough rather than "Failed"

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 |
| Change | Dependent stages of a failed source show "Skipped" with strikethrough — not "Failed." |
| UC Reference | UC-HO-01 EX.1 |
| Why | "Skipped" with strikethrough is honest about what happened. |
| Decided By | UX |
| Category | UX Refinement |

### CL-018 — Manager priority prompts use sentence-shaped examples in copy

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 |
| Change | The Priority Prompts composer uses a placeholder that's a full sentence example. |
| UC Reference | UC-HO-05 step 4 |
| Why | Modeling the kind of input we want steers the Manager toward good prompts. |
| Decided By | UX |
| Category | UX Refinement |

### CL-019 — Policy violation messages name the issue category, then suggest action

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 |
| Change | When the content policy check flags a prompt, the message names the specific category triggered + offers a constructive next action. |
| UC Reference | UC-HO-05 EX.1 |
| Why | Generic policy violation messages are frustrating because the user doesn't know what to fix. |
| Decided By | UX |
| Category | UX Refinement |

### CL-020 — Audit Log Tile (S0 component) extended for S1 use

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 |
| Change | The Audit Log Tile component from S0 is consumed on the Dashboard screen "Recent activity" section. |
| UC Reference | UC-HO-01 PC.8 (audit anchor) |
| Why | The audit log doubles as ambient context. |
| Decided By | Architecture + UX |
| Category | Visual System |

---

## Sprint 2 — Capture & Verify

### CL-021 through CL-033 — *(Retained verbatim from the prior version of this log; see Sprint 2 entries covering recording indicator triple-ring, "AI asked" eyebrow, recording consent concrete promises, dynamic topic count, inactivity modal "Still there?", text mode as equal choice, transcript line highlighting on edit, four draft-item status badges, Manager flag avatar, Sign button disabled rule, sign-off modal copy, authentication failure copy naming attempts remaining, audio playback minimal chrome.)*

---

## Sprint 3 — Knowledge Graph Commit

### CL-034 through CL-040 — *(Retained verbatim; covers Progress Stage component reuse, "Needs your call" copy, "Up next" front-loading, skill chips by status, partial commit framing, Retryable vs Needs-admin distinction, no completion animation on Screen 11.)*

---

## Sprint 4 — Onboarding Generation & Reading

### CL-041 through CL-053 — *(Retained verbatim; covers Smart Preset cards, custom prompt interpretation, out-of-scope prompt naming, Generation Stage skeleton+typewriter+glow vocabulary, Agent Activity log plain English, Critical content can't be hidden behind a chevron, inline entity underline accent, entity mini-card on hover, Persistent Copilot Bar, named source chips, Spotlight Graph 30% dimming, Restricted content explains what+why, Onboarder Dashboard names Hà Vy and Minh Lê by name.)*

---

## Sprint 1 v2 — Handover Initiation Rebuild

### CL-054 — Color palette shifts to Violet primary + Pastel Yellow secondary (supersedes CL-008)

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 v2 |
| Change | Four-color system with explicit role separation: **Violet (primary)**, **Pastel Yellow (secondary)**, **Rose (semantic)**, **Emerald (semantic)**. Supersedes CL-008's amber + rose system. |
| UC Reference | Cross-cutting (CL-008 supersession) |
| Why | Splitting AI-signal vs warning into distinct colors. Establishes stronger brand presence. |
| Decided By | Stakeholder direction + UX |
| Category | Visual System |

### CL-055 — Primary CTAs carry the brand color

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 v2 |
| Change | All primary action buttons use `bg-violet-600 hover:bg-violet-700 text-white`. Three-tier button system (PrimaryButton / SecondaryButton / GhostButton) at 32px height. |
| UC Reference | Cross-cutting |
| Why | Brand identity needs a load-bearing visual surface. |
| Decided By | UX |
| Category | Visual System |

### CL-056 — RBAC scope failure state added to Setup Wizard

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 v2 |
| Change | New "Access scope unresolved" state on Setup Wizard for UC-HO-01 v2.0 EX.5. Rose header, mono error reference, 3-step remediation guide, Retry / Back-to-Dashboard actions. |
| UC Reference | UC-HO-01 v2.0 EX.5 |
| Why | v1 build missing this exception path. |
| Decided By | BA |
| Category | BA Gap |

### CL-057 — PII Override Request action added to High PII state

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 v2 |
| Change | High PII Exclusion banner now offers two parallel actions: "Add priority prompts" and "Request override review". |
| UC Reference | UC-HO-01 v2.0 AC.1 |
| Why | v1 build conflated "high PII detected" with "add manual prompts to compensate" — only one valid response. |
| Decided By | BA |
| Category | BA Gap |

### CL-058 — Empty "In progress · 0" section removed from Dashboard happy path

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 v2 |
| Change | Sections with zero items don't render. |
| UC Reference | UC-HO-01 step 1 |
| Why | Empty placeholder for a category with nothing to show is visual noise. |
| Decided By | UX |
| Category | UX Refinement |

### CL-059 — Explicit focus rings on all interactive elements

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 v2 |
| Change | All buttons / inputs / checkboxes / clickable tabs carry `focus:ring-2 focus:ring-violet-500/20` (`/30` for primary actions). |
| UC Reference | Cross-cutting (accessibility) |
| Why | WCAG 2.1 SC 2.4.7 requires visible focus indicators. |
| Decided By | UX (accessibility) |
| Category | UX Refinement |

### CL-060 — AI-generated prompts use violet-tinted background

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 v2 |
| Change | AI-generated prompts render against `bg-violet-50/40 border-violet-100` with `text-violet-600` Sparkles icon. |
| UC Reference | UC-HO-05 step 3 |
| Why | Visual differentiation from Manager-authored prompts because editability model differs. |
| Decided By | UX |
| Category | Visual System |

### CL-061 — Audit Log Tile high-severity color shifts amber → yellow

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 v2 |
| Change | Audit Log Tile high-severity left-edge changes from amber-500 to yellow-500. |
| UC Reference | S0 component update reflecting CL-054 |
| Why | Component library inherits the new palette. |
| Decided By | UX |
| Category | Visual System |

### CL-062 — Knowledge gap dots replace icon, tighten visual rhythm

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 v2 |
| Change | Likely Knowledge Gaps panel uses 4px yellow dot bullets (was AlertTriangle icon). |
| UC Reference | UC-HO-01 step 9 |
| Why | Dot is the minimum viable bullet marker when surrounding context already carries the meaning. |
| Decided By | UX |
| Category | UX Refinement |

### CL-063 — Dashboard expanded to three concurrent pending sessions

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 v2 |
| Change | Dashboard renders three diverse offboarding sessions: Khánh Linh Trần (People Ops · 2 days), Phương Anh Nguyễn (Sales · 6 days), Minh Lê (Engineering · 12 days). |
| UC Reference | UC-HO-01 step 1 |
| Why | Demonstrates platform handles full org-level diversity. |
| Decided By | Stakeholder request + BA |
| Category | UX Refinement |

### CL-064 — Pending Session Card surfaces data source diversity inline

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 v2 |
| Change | Each Pending Session Card renders source chips below the date/days line. |
| UC Reference | UC-HO-01 step 4 |
| Why | Source diversity is the most consequential difference between handover sessions. |
| Decided By | UX |
| Category | UX Refinement |

### CL-065 — Critical urgency (<3 days) earns rose left-border accent + Urgent pill

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 v2 |
| Change | Pending Session Cards with daysRemaining < 3 get 2px rose left-border + "Urgent" pill badge inline with the offboarder's name. |
| UC Reference | UC-HO-01 EX.2 |
| Why | Layering three signals (left-border, pill badge, text color) for the truly urgent case makes it unmissable. |
| Decided By | UX |
| Category | Visual System |

---

## Planning v2 — Step Zero integration

### CL-066 through CL-073 — *(Retained verbatim; covers Step Zero sprint introduction, 4-screen MVP scoping, Platform Admin persona, 8 MVP connectors, UC-HO-01 refinements per Step Zero, 5 new TBDs, Plan v2 supersession, ~12-week timeline.)*

---

## System UI Tour

### CL-074 through CL-076 — *(Retained verbatim; covers the System UI Tour artifact, Feedback Loop combining UC-HO-06+07, two-tone violet skill progress bars.)*

---

## Transactional Gateways

### CL-077 through CL-079 — *(Retained verbatim; covers Vietnamese UI deviation, three entity badge categories, low-confidence yellow underline pattern.)*

---

## QA-INT-01 Adoption

### CL-080 through CL-086 — *(Retained verbatim; covers QA-INT-01 adoption as foundational governance, Gap A identified, Gap B identified, Refinement C identified, CanonicalBadge implemented, LineageDrawer implemented, Inline Edit Diff implemented.)*

> **Note · 2026-06-02:** The original Sprints 2/3/4 sections (CL-021–CL-053), Planning v2 (CL-066–CL-073), System UI Tour (CL-074–CL-076), Transactional Gateways (CL-077–CL-079), and QA-INT-01 (CL-080–CL-086) entries have been retained as summary placeholders in this 2026-06-02 update to keep the file at a manageable size while preserving the canonical CL numbering. The full per-entry tables for these CLs are recoverable from the prior git revision (SHA `19bb047b68f637d0a742b0013042ef2db4cf4e14`) and remain authoritative there. New entries CL-087 through CL-089 below are full-format.

---

## Sprint 1 Redesign (post-launch · 2026-06-02)

### CL-087 — Email removed as automated data source (supersedes CL-015 specifics)

| Field | Value |
|---|---|
| Date | 2026-06-02 |
| Sprint | S1 post-redesign |
| Change | The data-ingestion governance rule is codified · automated collection is restricted to approved shared workspaces only · Jira · GitHub · Google Drive (shared) · SharePoint · Trello · Microsoft Planner. Email is NEVER scanned as an automated source under any condition. Personal directories, individual mailboxes, and private messaging are excluded. Personal files reach the system only via manual upload by the Offboarder during the interview workflow. CL-015's email-scanning inline copy is deprecated and replaced with a generic "shared workspaces only · scope reminder per source" pattern. The Engineering persona (Minh Lê) source set updates to Jira + GitHub + Google Drive (shared). Sales persona (Phương Anh) updates to Salesforce + shared Calendar + SharePoint. People Ops (Khánh Linh) updates to HRIS + Notion + SharePoint. The OAuth-scope-layer enforcement is explicit in the data-ingestion governance Special Requirement of UC-HO-01 v2.1 — the platform does not request the read scopes that would enable scanning these surfaces, so the constraint cannot be bypassed even by misconfiguration. |
| UC Reference | UC-HO-01 step 4 (data sources) · UC-HO-01 v2.0 → v2.1 amendment · supersedes CL-015 |
| Why | Stakeholder direction · email as a data source is incompatible with the data-handling commitments ART-EEP needs to make. Even with metadata-only scanning, the privacy posture is harder to defend than restricting to shared workspaces (where access is already governed by team membership). Manual upload remains the escape valve for legitimate one-off needs without the architectural commitment. CL-015's inline reassurance about "subject lines and participants only" becomes unnecessary because email isn't read at all — and the inline-reassurance pattern itself generalizes to the data-ingestion governance rule. |
| Decided By | Stakeholder + BA |
| Category | BA Gap (architectural · supersedes CL-015) |

### CL-088 — User-facing lifecycle compressed from 8 stages to 3 phases

| Field | Value |
|---|---|
| Date | 2026-06-02 |
| Sprint | S1 post-redesign |
| Change | The 8-stage handover lifecycle is reorganized into 3 user-facing phases at every glance-level UI view · **Prepare** (Manager + System · 3 sub-stages · setup confirmed → context seeding → knowledge map ready), **Capture** (Offboarder + Manager · 3 sub-stages · interview scheduled → voice interview → transcript reviewed), **Deliver** (System + Successor · 2 sub-stages · committed to KG → playbook delivered). The 8 sub-stages still exist for system tracking and audit-log granularity, but the dashboard cards show 3 phase segments and the command-view hero shows a 3-phase progress bar. The command-view Stages tab shows 3 expandable phase blocks instead of 8 sequential rows. Progress visualization · 3 horizontal segments side by side, completed phases fully emerald, current phase showing within-phase fill in violet (proportional to sub-stage position), future phases gray-empty. Sub-stage detail surfaces inside the current phase block when that phase is active. *Note · 2026-06-08 (CL-113): the "Playbook delivered" sub-stage is renamed "KG access ready" — there is no playbook artifact; the newcomer's KG opens with role-customized initial exploration prompts.* |
| UC Reference | UC-HO-01 lifecycle reference (dev-spec §4 · v2.1 reference table) |
| Why | 8 stages exhausted users on first glance. The Manager opens the dashboard wanting to know "where is this session?" — 8 options is too many to hold in working memory, 3 is comfortable. Phase names map cleanly to actor handoffs (Manager + System prepares → Offboarder + Manager captures → System + Successor delivers), so the 3 phases also surface ownership at a glance. The 8 sub-stages remain available via drill-down for moments when the Manager needs the detail (e.g., diagnosing why Phase 1 is stuck). |
| Decided By | Stakeholder direction + UX |
| Category | UX Refinement (significant) |

### CL-089 — Session command-view route replaces 480px side drawer

| Field | Value |
|---|---|
| Date | 2026-06-02 |
| Sprint | S1 post-redesign |
| Change | The previous 480px right-side drawer pattern for per-session details is replaced with a dedicated full-screen route at `/session/[id]`. Dashboard session cards now navigate to the command-view URL on click rather than opening a drawer. The command view uses a tabbed layout · **Overview · Stages · Data · Audit log · Settings**. Hero shows persona identity + 3-phase progress + current sub-stage. Two-column main: content (left ~70%) + action sidebar (right 280px) that adapts to the current sub-stage (e.g., during seeding shows "Watch live progress"; during transcript review shows "Review transcript" primary + "Request re-interview" secondary). Three routes total · `/dashboard` for cross-session glance, `/session/[id]/setup` for one-click initiation, `/session/[id]` for per-session workspace. |
| UC Reference | UC-HO-01 cross-cutting (dashboard architecture) |
| Why | 480px is too cramped for the data volume of a real session (3-phase timeline + audit log + action sidebar + quick info). The drawer also stretched the eye laterally and reduced the dashboard to ~50% width while open. Dedicated route gives each surface (dashboard vs. per-session) full-screen real estate and clean cognitive boundaries. The tabbed layout means new per-session surfaces (Data tab, Audit log tab) can grow without re-architecting. Pairs cleanly with CL-088 (3-phase model) · the hero progress bar and the Stages tab both surface 3 phases as their primary organization. *Note · 2026-06-07: the 5-tab layout here (later 6 with CL-103) is superseded by CL-107, which collapses the command view to 2 visible tabs (Overview + Manager review).* |
| Decided By | Stakeholder direction + UX |
| Category | Visual System (architectural) |

---

## Knowledge Lake Architecture (grill-me session · 2026-06-05)

*Decisions from the grill-me interrogation of the Automated Handover Knowledge Lake architecture (`ART_EEP_Architecture_Summary_EN.md`). These define the Consumption plane (Knowledge Graph explorer) plus the data-pipeline, security, and feedback model that feeds it. All eight were resolved decision-by-decision down the dependency tree.*

### CL-090 — Scope narrowed to the Automated Handover Knowledge Lake (Peer Programming eliminated)

| Field | Value |
|---|---|
| Date | 2026-06-05 |
| Sprint | Cross-cutting (scope) |
| Change | All goals related to Peer Programming / developer-performance evaluation are removed from scope. 100% of scope focuses on the Automated Handover Knowledge Lake — capture a departing employee's tacit knowledge, commit verified content to the Knowledge Graph, and serve it to successors. |
| UC Reference | Cross-cutting |
| Why | The dual mandate (handover + dev-performance evaluation) bloated the system, diluted the core message, and put resources at risk. A single, sharp value proposition pitches better and ships. |
| Decided By | Stakeholder + BA |
| Category | Scope Deferral |

### CL-091 — Flexible multi-source model retained; Trello selected as the POC showcase source

| Field | Value |
|---|---|
| Date | 2026-06-05 |
| Sprint | Cross-cutting (data ingestion) |
| Change | The data-source model stays flexible — the source mix is driven by department / role / position, not a fixed list (this clarifies, and does not narrow, CL-087's shared-workspaces scope). For the POC showcase, **Trello is the demonstrated source** because it is the company's primary third-party system in use today. The 4-Layer Hard-Filter from the architecture summary is adopted as a **source-agnostic ingestion contract**, demonstrated on Trello: (1) Time-decay — removed, to retain history for Timeline + Heatmap; (2) List/Status filter — ingest only "In Progress / Review / Done"-equivalent stages, skip Backlog / To-Do; (3) Content-depth filter — drop title-only cards with empty description and zero comments; (4) Label-prioritization — prioritize Bug/Hotfix, Architecture, Core-Feature labels, ignore administrative labels (e.g. "Team Building"). Other sources (Jira statuses, GitHub PR states, etc.) map onto the same four layers. |
| UC Reference | UC-HO-01 step 4 · UC-HO-04 ingestion · builds on CL-087 |
| Why | A single clean source lets the POC run end-to-end without contradicting the persona source mix or rewriting the locked flexible model. Framing the filter as a contract keeps it generalizable to every other source. The hard-filter protects the token budget (Cost-Optimization criterion) and keeps graph noise down. |
| Decided By | Stakeholder + BA |
| Category | Performance · Scope |

### CL-092 — Hybrid Sanitization Pipeline layered in front of Purview (Purview not replaced)

| Field | Value |
|---|---|
| Date | 2026-06-05 |
| Sprint | Cross-cutting (capture / security) |
| Change | Filter-at-capture sanitization runs as two cheap pre-passes ahead of the mandatory Purview gate: **Layer 1 (Regex)** redacts secrets / API keys and PII (emails, phone numbers) to `[REDACTED]` at 0-token cost; **Layer 2 (Few-Shot prompting)** neutralizes toxic / emotional comments into objective statements. **Microsoft Purview remains the authoritative mandatory PII gate with no fallback** — the new layers sit in front of it, they do not replace it. In the POC the Regex + Few-Shot layers are demoed visibly; Purview runs behind. |
| UC Reference | UC-HO-04 · QA-INT-01 · preserves the locked Purview decision (snapshot §2) |
| Why | The 0-token Regex pass shrinks what reaches the expensive gate (token efficiency) and the Few-Shot pass protects graph quality — without discarding a locked, compliance-non-negotiable commitment. |
| Decided By | BA |
| Category | Performance · Visual System |

### CL-093 — Hybrid Security Tiering with auto-assignment and a Tier-1 stub exception to ACL trimming

| Field | Value |
|---|---|
| Date | 2026-06-05 |
| Sprint | Consumption plane (Knowledge Graph) |
| Change | Graph nodes carry a security tier, **auto-assigned** from signals already computed in the pipeline (Purview sensitivity output + source labels) — no manual tagging step. **Tier 2 (highly sensitive / legal · e.g. `[Finance]` `[Legal]` `[Risk]`)** is ghosted: removed by the locked pre-retrieval ACL trimming, never enters the result set. **Tier 1 (operational · access-controlled)** renders a metadata-only stub — node id, type, lock state, and nothing else (no `short_summary`, no content) — so a Lock icon + "Request access" affordance can show. The Tier-1 stub is a deliberate, narrow exception to the locked "pre-retrieval ACL trimming at Azure AI Search + Cosmos DB" decision (§2): strict trimming still applies to Tier 2; Tier 1 returns the redacted stub instead of being trimmed away entirely. |
| UC Reference | Consumption plane · modifies the practical meaning of the locked ACL-trimming decision (§2) |
| Why | Ghosting everything is safe but loses the "knowledge exists here — ask for it" discovery moment, a strong pitch beat. The stub surfaces existence without leaking content. Auto-assignment avoids a manual classification step that would not scale. |
| Decided By | BA |
| Category | BA Gap · Visual System |

### CL-094 — Knowledge Graph Consumer-plane interaction model adopted

| Field | Value |
|---|---|
| Date | 2026-06-05 |
| Sprint | Consumption plane (Knowledge Graph) |
| Change | The Consumption plane (Knowledge Graph explorer) interaction model is locked: **Progressive Disclosure** — the graph opens showing only the central node + its 1-hop links; double-click expands / collapses branches (solves "the hairball problem"). **Contextual AI** — the Copilot offers Quick-Start chips (e.g. "Show risks"); clicking centers / zooms the relevant node and dims the rest, highlighting the path. **0-token hover** — the AI generates a 15-word `short_summary` per node at graph-creation time and stores it in the DB; hover reads from the DB (0 token, ~0 ms), never an API call. **Historical visualization** — split-screen Timeline (ticket / card change over time) + Heatmap (interaction / workload / update frequency) for managers. **Prompt Disambiguation** — on an over-broad query ("tell me about Project A") the Copilot asks a clarifying question with clickable chips (Risk areas · Stakeholders · Recent timeline) rather than pulling the whole graph, protecting the context window. |
| UC Reference | UC-ON-02 (read with inline knowledge tools) · new Consumption-plane surface |
| Why | Cognitive-load control for graph UX, token / latency optimization (pre-compute on write, ~0 cost on read), and context-window protection on query. Each choice maps to a hackathon scoring axis (Human-in-the-Loop / Token Efficiency). |
| Decided By | BA + UX |
| Category | UX Refinement · Performance |

### CL-095 — Feedback triage with contested-flag-on-report; commit gate (QA-INT-01 §1.4) preserved; resolves HO-06 TBD-1

| Field | Value |
|---|---|
| Date | 2026-06-05 |
| Sprint | Consumption plane / Feedback (UC-HO-06 · UC-HO-07) |
| Change | Token-free Triage routes an error report by the reported node's existing tag: **Critical path** (`[Finance]` `[Risk]`) fires a real-time Manager alert; **Batch path** (`[Guidelines]` etc.) drops into a weekly review digest — routing is tag-based and 0-token. The moment a report is filed, the node immediately enters a visible **"flagged — under review"** state (reuses the yellow low-confidence pattern · a pure status flag · 0-token · no LLM call) so consumers see it is contested while it waits. **No correction ever auto-commits** — QA-INT-01 §1.4 (explicit Manager sign-off before KG commit) stays absolute; Critical and Batch both require sign-off. Triage governs only notification timing and the contested flag, never the commit gate. **SLA backstop**: a batch item unreviewed past **two weekly cycles** auto-escalates to the Critical path (real-time nudge), still requiring sign-off. The two-cycle window is a policy default and is logged as the resolution of **HO-06 TBD-1** (SLA for Manager correction review); change the window if stakeholders prefer. |
| UC Reference | UC-HO-06 · UC-HO-07 · QA-INT-01 §1.4 · resolves HO-06 TBD-1 |
| Why | Prevents Manager alert fatigue while never letting a node already known to be wrong masquerade as authoritative — and without reopening a locked governance clause. |
| Decided By | BA (Claude recommendation, accepted by stakeholder) |
| Category | BA Gap · UX Refinement |

### CL-096 — MASTER.md "AI-Native Minimal" design system scoped to the Consumer plane

| Field | Value |
|---|---|
| Date | 2026-06-05 |
| Sprint | Consumption plane (Knowledge Graph) |
| Change | The `MASTER.md` "AI-Native Minimal / WriteAI" design system (indigo `#6366F1` primary, glassmorphism cards, light / dark toggle, `rounded-xl` / `2xl`, soft shadows, floating navbar) is scoped to the **Knowledge Graph Consumer plane / POC showcase only** as its presentation shell. It does **not** apply to the Management or Capture surfaces (dashboard, quick-initiate, command-view), which stay on the locked ART-EEP light-mode system (snapshot §4). The ART-EEP **semantic palette is preserved as the meaning layer everywhere**: rose = critical / locked, yellow = low-confidence / contested, emerald = verified / canonical, violet = AI signal. Same scoping shape as the Transactional Gateways deviations (CL-077 / CL-078). |
| UC Reference | Consumption plane · scoped deviation from §4 |
| Why | Graph viz reads better on a dark, glass canvas (dimming, progressive disclosure), which `MASTER.md` provides; the rest of the app already has a working system not worth re-migrating. Scoping rather than replacing keeps both intact and follows existing precedent. |
| Decided By | Stakeholder + UX |
| Category | Visual System |

### CL-097 — POC showcase is English-only; latinized usernames; personas otherwise locked

| Field | Value |
|---|---|
| Date | 2026-06-05 |
| Sprint | Consumption plane / POC showcase |
| Change | The POC showcase (Consumer plane) contains **no Vietnamese text**. The Vietnamese system terms preserved by §4 (e.g. "Sự thật gốc" on the Canonical badge, bilingual tooltips) are **dropped within the showcase** — Canonical renders in English only ("Canonical" / "Canonical fact"). **Usernames render as diacritic-free latinized handles** (e.g. `Minh Le`, `Ha Vy`, `@minh.le`); the locked personas (§3) are unchanged in identity — only the on-screen string is latinized for the showcase. Scoped override; does not change CL-077's Vietnamese deviation for the Transactional Gateways artifact, nor the locked persona names elsewhere in the app. |
| UC Reference | Cross-cutting (showcase) · scoped override of the §4 Vietnamese-terms rule |
| Why | The POC showcase audience reads English; consistency and legibility matter most in the pitch surface. Keeping personas locked preserves narrative continuity with the rest of the demo. |
| Decided By | Stakeholder |
| Category | UX Refinement |

---

## POC Capture Model (2026-06-05)

*The POC swaps the live voice interview for a self-serve, network-sourced capture model. These entries follow CL-090–097 and are the second half of the 2026-06-05 session.*

### CL-098 — Voice interview (UC-HO-02) deferred to Phase 2; out of POC scope

| Field | Value |
|---|---|
| Date | 2026-06-05 |
| Sprint | POC scope |
| Change | UC-HO-02 (Conduct AI-Guided Voice Interview) is removed from the POC and deferred to **Phase 2**. The `uc-ho-02-interview-canvas` surface and the rose recording-rings animation grammar (CL-009) are retained in the repo for Phase 2 but do not appear in the POC build or demo. The 3-phase lifecycle (Prepare · Capture · Deliver) is unchanged — only the Capture *mechanism* changes (see CL-099). |
| UC Reference | UC-HO-02 (deferred) · 3-phase lifecycle (CL-088) unaffected |
| Why | The voice interview is the heaviest surface to build and the riskiest to demo live. Deferring it lets the POC prove the end-to-end value (capture → verify → commit → consume) with a simpler, more reliable capture path, and keeps the voice work intact for Phase 2. |
| Decided By | Stakeholder |
| Category | Scope Deferral |

### CL-099 — POC capture model = self-serve upload + asynchronous question queue

| Field | Value |
|---|---|
| Date | 2026-06-05 |
| Sprint | POC scope |
| Change | In the POC, the Offboarder captures knowledge two ways, asynchronously and at their own pace: (a) **uploading their own files**, and (b) **answering a question queue** in text. The queue is the union of **Manager Priority Prompts** (UC-HO-05) and **network-solicited questions** (CL-100), plus the Offboarder's own freely-added contributions ("answer on their own needs"). This replaces the live voice interview as the POC Capture mechanism. Because the Offboarder now answers the prompts directly, the prompts are visible to them by design (resolves the spirit of HO-05 TBD-2 for the POC). |
| UC Reference | Replaces UC-HO-02 within the POC · extends UC-HO-05 · feeds UC-HO-03 (review/sign) |
| Why | Async self-serve capture is lower-risk to build and demo than voice, lets the Offboarder lead with what they think matters, and naturally absorbs the network's questions and the manager's prompts into one queue. |
| Decided By | Stakeholder + BA |
| Category | UX Refinement (architectural) |

### CL-100 — Network knowledge requests in the Prepare stage (new UC-HO-08)

| Field | Value |
|---|---|
| Date | 2026-06-05 |
| Sprint | POC scope · Prepare stage |
| Change | New Prepare-stage use case **UC-HO-08 — Solicit Handover Inputs from the Employee's Network**. When a session is initiated, the system notifies the offboarding employee's **connection set** and asks two things: *what do you still need to know from them?* (questions) and *did the AI collect anything wrong or insufficient?* (flags). The connection set is **auto-derived** from the ingested data (for the POC: Trello card co-members, comment participants, co-assignees) plus the manager and any explicitly named coach / mentor; the manager can add or remove people before requests go out — no manual list-building from scratch. Questions feed the unified capture queue (CL-099); flags feed the pre-commit correction loop (CL-101). |
| UC Reference | New UC-HO-08 (Prepare) · feeds CL-099 queue and CL-101 flags · added to master UC index v1.1 |
| Why | The offboarder's network knows what's missing better than any prompt template. Crowd-sourcing the questions and the corrections raises capture quality and coverage, and auto-deriving the network from data we already ingested means it costs the manager nothing to set up. |
| Decided By | Stakeholder + BA |
| Category | BA Gap (new UC) |

### CL-101 — Pre-commit, network-driven data-flag correction loop (ACL-bounded; sibling of CL-095)

| Field | Value |
|---|---|
| Date | 2026-06-05 |
| Sprint | POC scope · Prepare / Capture |
| Change | A colleague in the connection set can flag an AI-collected item as **wrong or insufficient** during Prepare. The flag becomes a correction request assigned to the **Offboarder**, who fixes or clarifies it before that content moves toward commit. This reuses the **"flagged — under review"** visual grammar and is the **pre-commit, network-driven sibling** of the post-commit, consumer-driven triage in CL-095 (same pattern, different actor and timing). **ACL-bounded**: a colleague can only see and flag items they **already had access to** (e.g. a Trello card they were already on) — flagging never grants net-new visibility, staying consistent with pre-retrieval ACL trimming and Tier-2 ghosting (CL-093). |
| UC Reference | UC-HO-08 · pre-commit variant of UC-HO-06 / UC-HO-07 · CL-093 · CL-095 |
| Why | The people who know the captured work is wrong should be able to say so before it ever reaches the graph — without widening who can see what. Mirroring CL-095's grammar keeps the two correction loops (pre-commit network / post-commit consumer) legible as one family. |
| Decided By | Stakeholder + BA |
| Category | BA Gap |

---

## UC-HO-04 Manager Review build (2026-06-07)

*Decisions arising from the incremental build of the UC-HO-04 Manager Review + Sign-off mockup (Sprint 3 deliverable · violet/yellow palette · all 8 states real). These supersede the "needs migration" note on Sprint 3 in §6 of the snapshot.*

### CL-102 — Sibling-file pattern for mockup state extraction

| Field | Value |
|---|---|
| Date | 2026-06-07 |
| Sprint | S3 build (UC-HO-04) |
| Change | When a mockup JSX file exceeds ~100KB (the practical safe-write threshold for the GitHub `create_or_update_file` API used by the build workflow), extract self-contained state views into **sibling files** alongside the main file. Pattern · the main file owns the **shared scaffolding** (shell, header, navigation, list rails, dispatch) and exports nothing for siblings; **sibling files own one or more state views + their accompanying decision-panel right-rail content** and export named functions consumed by the main file's `StateRenderer` and `DecisionRail`. The boundary is the state view + its decision panel; shared primitives (`ItemHeader`, `DiffPanes`, `LineageCard`, `ContextStrip`, etc.) stay in the main file. SESSION constants and `MONO_STACK` are duplicated across siblings (cheap; avoids a shared module). Established on UC-HO-04 with two siblings · `uc-ho-04-s6-flag-fix.jsx` (S6) and `uc-ho-04-s7s8-signoff.jsx` (S7 + S8). With this split the main file lands at 90KB and each sibling fits comfortably under 50KB; without it, a 130KB monolithic write fails silently mid-stream. |
| UC Reference | Cross-cutting build pattern · first applied to UC-HO-04 |
| Why | A single failed write loses the entire build step, not just the new code; recovery requires diff-from-memory which is error-prone. Splitting at the natural state boundary keeps each write under threshold, preserves build-step granularity (each step is one safe commit), and makes the diff in code review reflect the build narrative rather than churn across one giant file. Duplicating SESSION across siblings is a deliberate cost — it keeps each sibling self-contained and avoids a shared-module dependency tree that would couple commits. |
| Decided By | Engineering (Claude, accepted by Tram) |
| Category | Engineering Pattern |

### CL-103 — UC-HO-04 wired into SessionCommandView as the "Manager review" tab (orphan resolved)

| Field | Value |
|---|---|
| Date | 2026-06-07 |
| Sprint | S3 → live |
| Change | The UC-HO-04 Manager Review + Sign-off mockup is wired into the live app as a **6th tab "Manager review"** on `SessionCommandView` at `/session/[id]?tab=review`. Three coordinated changes: (1) `UCHO04ManagerReview` accepts `embedded` and `state` props on its default export — when `embedded={true}`, the outer dev chrome (top step-dot bar + footer prev/next) is replaced by a single inline `EmbeddedStateStrip`, and its `ReviewShell` is told via React context to skip the redundant `ManagementHeader` + `ReviewSubHeader` (which would duplicate the SessionCommandView Hero + TabBar above). (2) `SessionCommandView` imports `UCHO04ManagerReview`, adds `{ id: "review", label: "Manager review" }` to the `TABS` array, and gates the tab to Minh Lê's session (since UC-HO-04's SESSION constant is built for that persona); other sessions get a friendly placeholder. (3) `app/session/[id]/page.tsx` adds `"review"` to `VALID_TABS`. All 8 states (`s1` through `s8`) remain accessible via the embedded state strip. Standalone behavior preserved when `embedded={false}` — UC-HO-04 still renders with its full dev chrome on a hypothetical direct route. Removes the "orphan mockup" state where a built component existed at a file path but had no live entry point. *Note · 2026-06-07: superseded in layout by CL-107 — "Manager review" is now one of only 2 visible tabs (Overview + Manager review); the wiring and `?tab=review` deep-link are unchanged. The Phương Anh placeholder noted here is superseded by CL-109 (real review surface).* |
| UC Reference | UC-HO-04 · architectural · pairs with CL-089 (command-view tab system) |
| Why | The standalone mockup at `components/mockups/uc-ho-04-manager-review.jsx` was an orphan — built but unreachable from the live app. Tram's directive "merge mockup live into 1 control only, likely a system" calls for absorbing the mockup into the existing single control surface (the session command view) rather than spawning new top-level routes or a separate `/m/<slug>` registry (which CLAUDE.md explicitly retired). Mirrors the existing `embedded` + `view` prop contract that `SessionCommandView` already uses for the management feature surfaces, so the team's mental model of "embedded mockups" is consistent. |
| Decided By | Stakeholder + UX |
| Category | BA Gap (architectural) · resolves orphan-mockup state |

---

## Consumer Plane Persona Expansion (2026-06-07)

*Triggered by the Microsoft AI prompt review on 2026-06-07, which surfaced that the Consumer class spans four archetypes (newcomer · project peer · cross-departmental colleague · upper management) but our locked persona set modeled only the newcomer. PO confirmed the broader framing because the demo must show how the Knowledge Graph is used internally across the organization, not just by the canonical Onboarder.*

### CL-104 — Consumer-plane personas expanded to four archetypes; locked set 6 → 9

| Field | Value |
|---|---|
| Date | 2026-06-07 |
| Sprint | Cross-cutting (personas) · Consumption plane |
| Change | The locked persona set expands from 6 to 9 to cover all four Consumer-class archetypes. **Existing six unchanged** (Hà Vy · Minh Lê · Trần Hữu Nam · Khánh Linh Trần · Phương Anh Nguyễn · An Quân Vũ). **Three additions:** (a) **Duy Nguyễn** — promoted from supporting to locked · Senior Data Engineer · Data Platform · already appeared in UC-HO-04 S6 (Atlas rollback 3-way) as the corroborating colleague · now locked as the **project peer** archetype (someone querying the KG for context on adjacent team work). (b) **Linh Phạm** — new · Product Manager · Product · locked as the **cross-departmental colleague** archetype · exercises Tier-1 "Request access" affordances (CL-093) on content scoped to other teams. (c) **Thảo Vũ** — new · Engineering Director · Engineering (leadership tier, distinct from Hà Vy's operational tier) · locked as the **upper management** archetype · **owns the Timeline + Heatmap surface** (CL-094), which had no locked actor in the previous six. The four-archetype mapping: **newcomer** → Trần Hữu Nam · **project peer** → Duy Nguyễn · **cross-departmental colleague** → Linh Phạm · **upper management** → Thảo Vũ. Source-of-truth docs updated by this change: §3 of `ARTEEP-context-snapshot.md` (persona table 6 → 9 rows); §3 and §2.3 of `docs/arteep/ARTEEP-system-overview.md` (persona table + Consumption-plane scope description). |
| UC Reference | Cross-cutting · primary impact on UC-ON-02 (read playbook · now with four reader archetypes · see follow-up below) · UC-HO-08 (network requests · Duy and Linh are also part of Minh's auto-derived network) |
| Why | PO requirement is to demonstrate how the Knowledge Graph is used internally across the organization, not only by the canonical Onboarder. Without locked personas for the other three archetypes, the pitch could not credibly show internal breadth. Path B (expand to match the four archetypes) chosen over Path A (stay narrow to newcomer) because the PO's framing extends to all daily KG consumers. Duy is promoted (lowest-cost addition · already in the demo) rather than introducing a fourth net-new persona. Thảo Vũ is the highest-leverage addition because she unlocks the Timeline + Heatmap surface that CL-094 specified but no actor triggered. Linh fills the cross-team gap that is otherwise invisible. |
| Decided By | PO + BA |
| Category | BA Gap (personas · scope) |

**Pending follow-ups noted at decision time (not resolved by CL-104):**

1. **Heatmap content definition still unlocked.** CL-094 introduced "Timeline + Heatmap split-screen" as part of the consumer interaction model but never specified what the Heatmap shows. The Microsoft AI prompt review proposed three candidate definitions that all map cleanly onto the existing semantic palette — **Knowledge Hotspots** (most-queried nodes · yellow scale), **Skill Density** (team strengths/gaps when viewing by Team/Department · emerald-to-yellow scale), and **Risk Heatmap** (most-flagged project/process nodes · rose scale). With Thảo Vũ now locked as the Heatmap actor, this needs a separate CL to lock the definition. *(To be opened on confirmation.)*

2. **UC-ON-02 scope may need to split or extend.** The use case is currently scoped to the Onboarder reading the personalized playbook. With four Consumer archetypes, the read patterns differ: Trần Hữu Nam reads a curated playbook · Duy reads handover context for cross-team work · Linh researches another team's work · Thảo views Timeline + Heatmap surfaces. Open question: extend UC-ON-02 to cover all four, or split into UC-ON-02a (Onboarder reads playbook) + UC-ON-02b (general KG consumer exploration)? Flagged for next BA review. *(Resolved 2026-06-08 by CL-113: with the playbook eliminated, all four archetypes use one UC — UC-ON-02 reframed as "Explore Knowledge Graph (role-customized)" — and the question is moot.)*

3. **Demo flow narrative expansion.** §12 of the system overview lists an 11-step demo flow that currently shows only Trần Hữu Nam in the Consumption plane (step 8). The flow should add beats for Duy (project peer querying for handover context), Linh (cross-team research), and Thảo (Timeline + Heatmap oversight) to deliver the PO's "show how the KG is used internally" requirement. Not blocking CL-104 but flagged for the demo-script work item in §14 next-builds.

---

## POC Live-App Migration (2026-06-07)

*Triggered by PO direction "use trello" + "apply all" while deploying Module 1 into the live app. Brings the canonical Management-plane surfaces onto the agreed POC source and codifies the field-visibility rule observed during the deploy.*

### CL-105 — Form fields are shown and selectable, pre-filled to happy-path defaults — never hidden or disabled (POC)

| Field | Value |
|---|---|
| Date | 2026-06-07 |
| Sprint | POC build · cross-cutting |
| Change | Across POC build surfaces, configuration fields are not hidden behind collapsed progressive-disclosure panels and are not rendered as read-only / disabled text. Every field is visible and interactive (selects, toggles, editable inputs), with the happy-path value pre-filled. The Customize panel on the quick-initiate surface (UC-HO-01 · `/session/new`) is therefore open by default with all fields adjustable — review deadline, data-source toggle, section blueprint, question-queue mode, focus note, and a successor select. This refines the "Manager confirms, not configures" rationale of the quick-initiate redesign: on the happy path the manager still does nothing (everything is pre-filled), but nothing is concealed — each field is present and editable if they want it. Applies to POC build surfaces; does not change the locked palette (§4) or the 3-phase model (CL-088). *Note · 2026-06-08 (CL-114): the successor select referenced here is removed from the Customize panel — the successor field is removed from the session model entirely; the rest of CL-105's "show-and-select" rule is unaffected.* |
| UC Reference | UC-HO-01 (quick-initiate) · cross-cutting POC build rule |
| Why | PO direction: hidden or disabled fields make the POC feel non-functional and conceal the system's actual configurability from reviewers clicking through. Showing every field, pre-filled, keeps the happy path one-click while making the full control surface legible and testable. |
| Decided By | PO + BA |
| Category | UX Refinement |

### CL-106 — Canonical Management-plane surfaces migrated to Trello (implements CL-091)

| Field | Value |
|---|---|
| Date | 2026-06-07 |
| Sprint | POC build · S1 surfaces |
| Change | The live Management-plane surfaces are migrated off the stale Jira / GitHub / Google Drive source mix onto **Trello** as the POC showcase source with the 4-layer hard-filter, implementing CL-091 on surfaces that predated it. (1) `uc-ho-01-quick-initiate.jsx` (`/session/new`) — single Trello source with the 4-layer contract; capture copy updated from the voice interview to the async question queue (CL-099). (2) `session-command-view.jsx` (`/session/[id]`) — Prepare-phase seeding and the Data tab present the Trello 4-layer ingestion (active lists scanned, thin cards skipped, prioritized labels, sensitive-content check) in place of the old sources. The dashboard (`ha-vy-handover-dashboard.jsx`) needed no change — in the 3-phase redesign it renders no source chips and no forms. The new `/m1-initiation` walkthrough already used Trello. |
| UC Reference | UC-HO-01 · implements CL-091 · CL-099 capture-copy alignment |
| Why | The deployed surfaces still showed the pre-CL-091 source mix, contradicting the agreed POC showcase source and producing an inconsistent click-through (Trello on initiate → old sources on the command view). Bringing them onto Trello makes the live flow internally consistent with the locked POC direction. |
| Decided By | PO + BA |
| Category | Visual System · Scope |

---

## POC Minimalist Redesign (2026-06-07)

*PO direction · "redesign all screens · don't show all the description / explainer text · fewer to be seen, easier to use" — plus a direct challenge to the 6-tab session view. Establishes two cross-cutting rules and applies them surface by surface.*

### CL-107 — Session command view collapsed 6 tabs → 2; explainer text stripped (labels + values, helper text only on destructive actions)

| Field | Value |
|---|---|
| Date | 2026-06-07 |
| Sprint | POC build · Management plane |
| Change | Two cross-cutting POC redesign rules, established here and to be applied across the Management-plane surfaces. **(A) Tab reduction.** The session command view (`session-command-view.jsx` · `/session/[id]`) drops from **6 visible tabs to 2 — Overview + Manager review.** The six (Overview · Stages · Data · Audit log · Manager review · Settings) had accreted (CL-089 made five, CL-103 added the sixth) rather than being designed. Per-tab verdict: **Stages** is redundant (the Hero's 3-phase progress bar already shows it) → removed; **Data** was one source line + an upload box → folded into Overview ("Source" line) and the action rail ("Add files"); **Audit log** is low-frequency reference → demoted to a header link + a "View full audit log" link at the foot of Overview, no longer a tab; **Settings** was deadline + cancel → folded into the action rail. **Manager review** stays as the second tab because it is a distinct decision *mode* (the UC-HO-04 workspace), reached via the primary CTA. Legacy deep-links (`?tab=stages|data|audit|settings`) resolve to Overview — no 404; `?tab=review` still branches to UC-HO-04 (CL-103 wiring + state passthrough unchanged). The file shrank ~55KB → ~30KB. **(B) Explainer-text rule.** Descriptive / explanatory prose is removed from POC surfaces; UI is **labels + values only**. Helper / explanatory text is kept **only on risky or destructive actions** (e.g. Cancel session, Request more detail). Removed prose included the "Per the data-ingestion governance rule…" source paragraph, the "Each phase groups the steps…" Stages helper, and the "Immutable record… per QA-INT-01 §2.3" audit caption. Governance constraints still hold in the architecture and the change log; they are simply not narrated in the glance-level UI. |
| UC Reference | Cross-cutting POC build rules · first applied to `session-command-view.jsx` (UC-HO-01 status surface + CL-103 review tab) · supersedes the tab layout in CL-089 / CL-103 |
| Why | PO direction: "fewer to be seen, easier to use." Six co-equal tabs forced the manager to hunt for the one thing they came to do; two (glance vs. act) match the actual jobs of the screen. Explainer paragraphs repeated what labels and the architecture already guaranteed, adding reading load without decisions. Keeping helper text on destructive actions preserves safety where a wrong click is costly. Rules are logged as cross-cutting so the dashboard and quick-initiate redesigns (separate commits) follow the same two rules rather than re-deciding per surface. |
| Decided By | PO (Tram) + UX |
| Category | UX Refinement (significant) · supersedes CL-089 / CL-103 tab layout |

### CL-108 — UC-HO-04 embedded-surface cleanup (preview stepper · jargon strip · S1 collapse)

| Field | Value |
|---|---|
| Date | 2026-06-07 |
| Sprint | POC build · Management plane |
| Change | The UC-HO-04 Manager Review surface is brought onto the CL-107 rules for the case where it renders **embedded** in the command view's Manager review tab. Three changes, embedded-only (the standalone dev harness is unchanged): **(1) Preview stepper.** The loud violet S1–S8 state-chip strip (mockup scaffolding that was showing inside the product) is replaced by a muted "Preview · {state name} · ‹ N/8 ›" stepper — demo navigation is kept but de-emphasized so it reads as a preview aid, not product chrome. **(2) Jargon strip.** Internal references are removed from user-visible copy and kept only in code comments + this log: "CL-092 sanitization · cleared" → "Sensitive content checked"; "CL-101 network flag loop" → "Colleague review window closed"; "Worker SLM" → "AI"; "QA-INT-01 §1.3 / §2.3" → "Sources" / "Edit history · all versions kept"; "Tier 1 lock (legal-adjacent)" → "access-limited (sensitive)"; "UC-HO-08 network question" → "network question"; the "CL-086 inline grammar" label dropped. **(3) S1 collapse.** The arrival screen's prose (3xl hero headline, intro paragraph, "Recommended review order" card, the 6-item "Pre-review checks" grid that named Purview/CL refs, and the est-time note) collapses to a compact bundle summary — 4 stat tiles + one plain "pre-checks cleared" line + a single "Start with item 1" CTA — per the CL-107 labels-only rule. File 94KB → 84KB. |
| UC Reference | UC-HO-04 · applies CL-107 · CL-103 (embedded contract) · CL-013 (no backend leakage in UX copy) |
| Why | The Manager review tab predated CL-107 and was rendering the full pre-redesign surface: dense explainer prose, internal jargon (CL-###, QA-INT-01 §, Worker SLM, Tier labels) leaking into user copy, and demo scaffolding (the S1–S8 strip) showing in what is supposed to be the product. The cleanup makes the most-important decision surface match the minimal language used everywhere else in the Management plane. The 3-pane decision core (item list → diff → decision rail) is intentionally kept — it is the actual job of reviewing. |
| Decided By | PO (Tram) + UX |
| Category | UX Refinement |

### CL-109 — Real Manager review surface for Phương Anh (Sales bundle); supersedes the CL-103 placeholder

| Field | Value |
|---|---|
| Date | 2026-06-07 |
| Sprint | POC build · Management plane |
| Change | The Phương Anh session's Manager review tab becomes a **real** review surface instead of the yellow "wired for Minh Lê" placeholder from CL-103. UC-HO-04's `SESSION` constant is hardcoded to Minh / Engineering, so reusing that component for Sales would show the wrong content; instead `ReviewTab` in `session-command-view.jsx` dispatches by slug — `minh-le` → `UCHO04ManagerReview` (embedded, CL-108-cleaned); `phuong-anh` → a new `PhuongAnhReview` component built in the same file. `PhuongAnhReview` renders her seven Sales items (Sales pipeline Q3, Vendor XYZ renewal [flagged], Account TXM escalation, forecast methodology, customer-success churn, internal team dynamics [redacted], reflection [flagged]) as a working item list: selecting an item opens the captured answer + source + any flag warning, with per-item **Accept / Send back** (React state); the right rail tracks accepted / sent-back / remaining and gates a "Sign off & commit" button until every decidable item is decided. The redacted item is read-only. Labels-only style (CL-107); helper text kept only on the disabled sign-off and the destructive send-back. *Note · 2026-06-08: the "sections" noun used here for her reviewable units is renamed to "items" by CL-112; the component name `PhuongAnhReview` and the `PA_SECTIONS` data key are unchanged (internal).* |
| UC Reference | UC-HO-04 · CL-103 (supersedes its placeholder) · CL-107 (labels-only) · QA-INT-01 §1.4 (sign-off gate) |
| Why | The placeholder broke the click-through for the second wired persona — clicking "Review answers" on Phương Anh's session led nowhere real. A real, lighter review surface keeps the non-engineering (Sales) flow demonstrable without distorting Minh's engineering-specific UC-HO-04 mockup. It also proves the review model generalizes beyond one persona. |
| Decided By | PO (Tram) + UX |
| Category | BA Gap (resolves placeholder) · UX Refinement |

---

## Consumer Graph Model Correction (2026-06-07)

*PO direction during the consumer-flow write-up: the Knowledge Graph is the company's shared knowledge layer for all internal users, so defaulting it to a single offboarder frames a shared org asset as a one-person handover viewer. Documented now; the explorer rebuild is deferred.*

### CL-110 — Consumer Knowledge Graph default = company-wide GraphRAG; an offboarder is a filter, not the center

| Field | Value |
|---|---|
| Date | 2026-06-07 |
| Sprint | Consumption plane (S-KG) |
| Change | Corrects the Consumer-plane graph model. The Consumption plane is the **organization's shared knowledge layer** for internal users (newcomers, project peers, cross-departmental colleagues, upper management), so its **default view must be a company-wide GraphRAG** over everything the system holds — **not** a single offboarder's handover subgraph. The graph's knowledge spans three streams: (1) what the system extracted from departing employees' sources during their handovers; (2) what current employees uploaded themselves; and (3) what current employees permitted the system to collect from their own data. The default canvas is a multi-cluster company map (organized by domain / project / team) with **no single human at the center**. A single offboarder centered (e.g. Minh Lê) is **one filtered lens** — filter: `offboarder = …` — alongside filters by project, team / department, and status (canonical / contested / critical). All CL-094 interaction primitives (progressive disclosure, contextual-AI chips, 0-token hover, Tier-1 stub / Tier-2 ghosting per CL-093, prompt disambiguation, Timeline + Heatmap) operate over the whole graph and respect both the active filter and the viewer's ACL. **Build status:** the current explorer (`knowledge-graph-explorer.jsx` · `/knowledge-graph`) hardcodes Minh Lê as the central hub (`SUBJECT = minh-le`) and every node is from his handover, so it **diverges from this model**. Per PO direction the correction is documented now and the rebuild is deferred ("we will build it later"). |
| UC Reference | UC-ON-02 · Consumption plane · refines CL-094 · CL-093 · CL-096 · relates to the four-archetype reader model (CL-104) |
| Why | PO direction: the graph is for internal users across the whole company. Defaulting to one offboarder frames a shared organizational asset as a single handover's viewer, which understates what the Knowledge Graph is and misrepresents how the four Consumer archetypes (CL-104) actually use it — none of them starts from "show me one person's handover." The offboarder-centered view remains valuable, but as a filter state reached from the company-wide default, not as the home screen. |
| Decided By | PO (Tram) + BA |
| Category | BA Gap (scope · corrects consumer-plane default) |

---

## Offboarding Window Policy (2026-06-08)

*PO direction grounded in company policy: a fixed offboarding window, a review deadline a few days before the last day so admin and offboarder verify together, and an optional successor. Resolves the two open items flagged in the system overview §13.*

### CL-111 — Standard 30-day offboarding window · review deadline 3–5 days before last day · successor optional *(successor portion superseded 2026-06-08 by CL-114)*

| Field | Value |
|---|---|
| Date | 2026-06-08 |
| Sprint | POC build · cross-cutting (session model) |
| Change | Company policy fixes the **standard offboarding window at 30 days** for every departing employee — from the day their status flips to Offboarding to their last day. The session's **review / handover deadline is set 3–5 days before the last day**, building in a window for the admin (manager) and the offboarder to verify the captured bundle together before departure. The **successor is optional**: a session may have no successor assigned at initiation; the field can be filled later or left blank, rendering as **"to be assigned"** in the UI rather than a name. **Khánh Linh Trần remains the urgent short-notice exception** (2-day departure · EX.2), explicitly outside the 30-day standard. Canonical demo timeline applied across surfaces: **Minh Lê** — last day Jul 4, 2026 · review deadline Jun 30 · 26 days left · successor Trần Hữu Nam; **Phương Anh Nguyễn** — last day Jun 20, 2026 · review deadline Jun 16 · 12 days left · successor "to be assigned" (resolves the non-locked "Đặng Khải Hoàn"); **Khánh Linh Trần** — 2 days · urgent exception · successor "to be assigned". *Note · 2026-06-08 (CL-114): the "successor optional · to be assigned" portion of this entry is **superseded** — the successor field is removed from the session model entirely; newcomer identity is established by RBAC at KG access time, not by session-time assignment. The 30-day window, the review-deadline-3-5-days-before-last-day rule, and the Khánh Linh 2-day exception are **unaffected** by CL-114 and remain authoritative here.* |
| UC Reference | UC-HO-01 (initiation · review deadline) · cross-cutting session model · resolves the two §13 open items (Phương Anh successor · Minh days-left consistency) |
| Why | PO direction from company policy. A fixed 30-day window makes session timelines consistent and predictable across surfaces (they had drifted — the dashboard showed 6 days, the Prepare stage 12). Setting the deadline a few days before the last day bakes in a joint admin + offboarder verification buffer. Making the successor optional reflects reality — a replacement is frequently not yet hired when offboarding begins — and removes the need to invent a non-locked successor name. |
| Decided By | PO (Tram) — company policy |
| Category | BA Gap (scope · session model) · resolves open items |

*Propagation: applied to `ha-vy-handover-dashboard.jsx` (this batch). Still to bring onto the canonical timeline: `session-command-view.jsx`, `prepare-stage.jsx`, `uc-ho-01-quick-initiate.jsx`, and the system-overview §3 persona note + §13 open items (flip to resolved).*

---

## Review Unit Terminology (2026-06-08)

*Follow-up consistency pass prompted by the "items in bundle" review, which surfaced that the same noun meant different things across screens. Standardizes one vocabulary for the reviewable unit and disambiguates the post-commit Knowledge-Graph count.*

### CL-112 — Review unit standardized to "items" across all review surfaces; post-commit KG count renamed to "entries"

| Field | Value |
|---|---|
| Date | 2026-06-08 |
| Sprint | POC build · cross-cutting (terminology) |
| Change | The reviewable unit a manager decides on during Manager review is an **"item"** everywhere. Previously the two review surfaces behind the single "Manager review" tab used different nouns: Minh Lê's UC-HO-04 bundle called them "items" (14) while Phương Anh's surface called them "sections" (7). **"Items" wins** because it is the umbrella that covers the mixed content of a bundle — captured answers, uploaded files, and flag fixes — whereas "section" does not fit an uploaded file. (1) `session-command-view.jsx` (`PhuongAnhReview` + `OverviewReview`) is reworded "sections" → "items": header "Items · 7", "Items to review", the "Items" stat, the "2 items need your decision" rail, the sign-off helper "Decide every item first"; data + behavior unchanged (component name `PhuongAnhReview` and `PA_SECTIONS` key stay, internal). (2) The dashboard's **post-commit count** said "487 items" — the same word for a different unit (committed Knowledge-Graph nodes) at a different lifecycle stage. Renamed to **"entries"** (`ha-vy-handover-dashboard.jsx` · completion banner "487 entries", the `stats.entries` key, the completed-card "Entries" stat, the activity-feed line, the This-week "Entries committed to KG" stat) so "items" no longer carries two meanings/scales (14 review items vs 487 KG entries). (3) Reconciles UC-HO-04's S1 arrival, whose 4 bundle tiles summed to 11 against a headline of 14: a fifth **"Uploaded files" (3)** tile is added and "Own contributions" recolored gray to match the left-rail source colors, so the tiles now sum to 14; `SESSION.filesTotal` corrected 4 → 3 to match the three rendered file rows, and the S1 step trigger reworded to state files are part of the 14 (not separate). The "Redirected" item (1) stays excluded from the 14 by design. |
| UC Reference | UC-HO-04 · CL-109 (Phương Anh surface) · CL-108 (S1 collapse) · cross-cutting terminology |
| Why | The "items in bundle" review found the noun was overloaded: two review surfaces named the same concept differently ("items" vs "sections"), and "items" also meant committed KG nodes on the dashboard (487) — so a manager moving dashboard → review saw the same word at wildly different scale. One noun for the review unit ("items") and a distinct noun for the committed count ("entries") removes the collision. Reconciling the S1 tiles to the headline 14 (and fixing the 4-vs-3 file count) closes the internal arithmetic gap on the arrival screen itself. |
| Decided By | PO (Tram) + UX |
| Category | UX Refinement (terminology · consistency) |

*Applied this batch to `uc-ho-04-manager-review.jsx`, `session-command-view.jsx`, and `ha-vy-handover-dashboard.jsx`.*

---

## Consumption Plane Unification (2026-06-08)

*PO direction: there is no "playbook" anymore — everyone uses the Knowledge Graph, customized for their role, with the newcomer in particular getting initial exploration prompts to get moving. Resolves the UC-ON-02 single-vs-split follow-up from CL-104 by removing the artifact the split would have been about, and compounds with CL-110 (company-wide KG default) to leave the Consumption plane with exactly one artifact instead of two.*

### CL-113 — Playbook artifact eliminated; Consumption plane unified on the Knowledge Graph; newcomer gets role-customized initial exploration prompts

| Field | Value |
|---|---|
| Date | 2026-06-08 |
| Sprint | Consumption plane (S-KG) · cross-cutting |
| Change | The **personalized onboarding playbook is eliminated as a separate artifact**. The Consumption plane has exactly one artifact going forward — the **company-wide Knowledge Graph** (per CL-110) — and role-customization happens at the **initial-state layer**, not as a separately-generated document. **Per archetype default lens (CL-104):** **newcomer** (Trần Hữu Nam) — the KG opens with a curated set of **initial exploration prompts** seeded for the successor's role (e.g. "Where do I start with the auth flow?" · "Who owns the data platform?" · "What's the rollback runbook for billing?"), surfaced as Contextual-AI chips above the canvas; **project peer** (Duy) — KG opens filtered to cross-team handover context relevant to the current query; **cross-departmental colleague** (Linh) — KG opens with the adjacent-team filter applied and Tier-1 stub + "Request access" affordances available; **upper management** (Thảo) — KG opens to the Timeline + Heatmap surfaces. All four use the **same `/knowledge-graph` surface** with different default lenses, ACL-bounded, over the same company-wide graph. **UC consequences:** (a) **UC-ON-01** ("Generate Personalized Onboarding Playbook") is **reframed as "Generate Newcomer Initial Exploration Prompts"** — the generative step at commit-time still happens (the system reads section blueprints + the successor's role and synthesizes prompts), but the artifact is a small prompt set, not a multi-page document. (b) **UC-ON-02** ("Read Playbook with Inline Knowledge Tools") is **reframed as "Explore Knowledge Graph (role-customized)"** and covers all four Consumer archetypes — this also **resolves the UC-ON-02 single-vs-split open item from CL-104 follow-up #2**: there is no playbook for the split to be about. (c) **Phase 3 Deliver sub-stage "Playbook delivered"** is renamed **"KG access ready"** (newcomer's role-customized prompts seeded + ACL provisioned) — annotated inline on CL-088. **Artifact consequences:** (i) `arteep-s4-onboarding-gen-read.jsx` (the amber UC-ON-01/UC-ON-02 mockup that was marked "needs migration") is **superseded** — it does not need violet/yellow migration; the surface it portrays no longer exists. (ii) `knowledge-graph-explorer.jsx` (CL-110 already flagged for rebuild) becomes the **single** Consumption-plane surface; its rebuild scope expands to cover all four archetype initial states. (iii) **Dashboard wording** — every "Playbook" mention on `ha-vy-handover-dashboard.jsx` (activity feed line, the post-commit completion beat, any per-session card text) needs purge in the doc-cleanup propagation pass. **Pitch impact:** the PO narrative becomes cleaner — "the Knowledge Graph is the company's shared knowledge layer; here is how each role enters it" — one surface, four lenses, instead of two surfaces (graph + playbook). |
| UC Reference | Reframes UC-ON-01 + UC-ON-02 · cross-cutting Consumption plane · compounds with CL-110 (company-wide default) · resolves CL-104 follow-up #2 (UC-ON-02 single-vs-split) · annotates CL-088 sub-stage name |
| Why | PO direction: the Knowledge Graph is the company's shared knowledge layer for all internal users, so the per-role customization should be a lens onto the same graph rather than a parallel document. A separate playbook duplicates effort, fragments the demo narrative (two artifacts to explain instead of one), and isn't how newcomers actually onboard at the company (they explore real systems with starter questions, not a generated PDF). Eliminating the playbook simplifies the Consumption plane to one surface and removes the UC-ON-02 split question that CL-104 left open — because there is no playbook to split around. The newcomer's onboarding still gets personalized — just as starter prompts that route them into the right corner of the graph, not as a separate artifact they read. |
| Decided By | PO (Tram) + BA |
| Category | BA Gap (scope · simplification) · supersedes the playbook artifact across UC-ON-01 / UC-ON-02 · resolves CL-104 follow-up #2 |

**Pending follow-ups noted at decision time (not blocking CL-113):**

1. **Final UC-ON-01 name in the master UC index.** "Generate Newcomer Initial Exploration Prompts" is the working name; the BA may prefer a tighter name (e.g. "Seed Newcomer Exploration") when authoring the v2 UC spec.
2. **Final UC-ON-02 name in the master UC index.** "Explore Knowledge Graph (role-customized)" is the working name.
3. **Newcomer initial-prompt seeding strategy.** Open: how many prompts (suggest 4–6), static templates vs LLM-generated at commit time, token-budget implications. The synthesis step at commit time is where this lives.
4. **Doc cleanup sweep** — `ARTEEP-context-snapshot.md` and `docs/arteep/ARTEEP-system-overview.md` both reference "playbook" in §5, §13 (demo flow), §3 persona notes, §11 artifact inventory, §14 next-builds. Sweep is the next commit immediately after this one.

---

## Session Model Refinement (2026-06-08)

*PO direction: stop pretending the session has a named successor at handover time. In the real flow, the company often genuinely does not know who the newcomer will be — and the system never needs to know, either. Newcomer identity belongs to RBAC at KG access time, not to the session record. Supersedes the "successor optional" portion of CL-111; the 30-day window, the review-deadline rule, and the Khánh Linh 2-day exception from CL-111 are unaffected.*

### CL-114 — Successor field removed from POC scope; newcomer identified by RBAC at KG access time, not by session-time assignment (supersedes the successor portion of CL-111)

| Field | Value |
|---|---|
| Date | 2026-06-08 |
| Sprint | POC build · cross-cutting (session model) |
| Change | The session creator (manager) **no longer assigns a successor** when initiating a handover. The "Successor" field is **removed from the session model entirely** in the POC — no name, no "to be assigned" placeholder, no field at all. **Supersedes the "successor optional" portion of CL-111**: where CL-111 left the field optional with a "to be assigned" string when empty, CL-114 removes the field outright. The **30-day offboarding window**, the **review / handover deadline 3–5 days before the last day**, and the **Khánh Linh 2-day urgent exception** from CL-111 are **unaffected** and remain authoritative. **Newcomer identity is established via RBAC at KG access time, not via session-time assignment.** When someone joins the company and enters the system, they're assigned the **Newcomer role** (Entra ID). The system flags any user carrying the Newcomer role accordingly, and gates their Consumer-plane view of the Knowledge Graph through that role — strict ACL applied per role permissions; role-customized initial exploration prompts surfaced per CL-113. The newcomer → session link becomes a **post-hoc resolution** at KG access time (by role + role-driven prompt synthesis), not a pre-commit decision by the manager. **UC consequences (logged · surface-applied in follow-up commits):** (a) **UC-HO-01** — successor parameter removed from session initiation; the Customize panel's successor select goes (refines CL-105's "show every field" rule by removing the field itself); the dashboard's "successor X" / "successor to be assigned" subtitles go; the quick-initiate form's "Successor" / "To be assigned" wording goes. (b) **UC-HO-04** — sign-off no longer claims to "deliver to successor X"; the commit target is the company-wide Knowledge Graph (per CL-110), period. Any "for successor X" framing in the bundle summary / sign-off copy is dropped. (c) **UC-ON-01** — the role-customized initial-prompt synthesis at commit time uses **the offboarder's role** (which IS known — e.g. "Senior Backend Engineer") to seed prompts a successor inheriting that role would need, **regardless of whether a named successor exists**. Fully compatible with CL-113, which already specified synthesis reads the *role*, not the named person. (d) **UC-ON-02** — KG exploration is gated by the viewer's RBAC role at runtime; the Newcomer role grants the role-customized initial-prompts lens (one of the four CL-104 archetype lenses); the other three lenses (project peer · cross-dept · upper management) are similarly RBAC-driven, not session-driven. |
| UC Reference | UC-HO-01 (session initiation · removes successor parameter) · UC-HO-04 (commit target is the KG · not a named successor) · UC-ON-01 / UC-ON-02 (RBAC-gated KG access · role-driven prompts) · supersedes the successor portion of CL-111 (30-day window + Khánh Linh exception preserved) · compounds with CL-113 (no playbook artifact) and CL-110 (company-wide KG) · refines CL-105 (the successor field is removed, not just shown) |
| Why | PO direction: at handover-initiation time the company often genuinely does not know who the successor will be — the replacement is frequently not yet hired. Forcing the field at session creation — even with a "to be assigned" placeholder — implies the session has a pre-named target it will be delivered to, which the system never actually needs to know. The captured knowledge belongs to the company-wide KG (CL-110); the newcomer's access to it is governed by their RBAC role when they arrive, not by a session-time link. Removing the field cleanly removes a fictional dependency, simplifies the session model, and aligns the architecture with how newcomers actually onboard at a real SaaS — they receive an account with role-appropriate access, not a parcel-delivered playbook addressed to them by name. |
| Decided By | PO (Tram) |
| Category | BA Gap (scope · session model) · supersedes the successor portion of CL-111 · refines CL-105 |

*Propagation pending in follow-up commits: `ha-vy-handover-dashboard.jsx` (card subtitles "successor X" / "successor to be assigned"; completion-banner copy that names a successor), `uc-ho-01-quick-initiate.jsx` (Customize panel successor select + any "To be assigned" placeholder copy), `session-command-view.jsx` (any "Successor: X" line in Overview / hero / sidebar), `prepare-stage.jsx` (any successor display), `uc-ho-04-manager-review.jsx` (any "for successor X" framing in S7 bundle summary or S8 sign-off). Snapshot §2 locked-decisions row for CL-111 to receive a "successor portion superseded by CL-114" annotation; §3 persona table to drop "successor Trần Hữu Nam" from Minh Lê's row and "successor to be assigned" from Phương Anh / Khánh Linh rows.*

---

## Chrome Labeling Rule (2026-06-08)

*PO direction: in a real SaaS product, chrome does not announce the user's role — RBAC governs access invisibly. The dashboard topbar currently reads "ART-EEP · Manager dashboard"; the role suffix should go, and the rule generalizes to all Management-plane chrome. Distinct from "Manager review" as a tab label (CL-103 / CL-107), which describes the mode of work being done, not the chrome of the surface.*

### CL-115 — Topbar role labels removed from Management-plane chrome; RBAC gates access, chrome does not announce it

| Field | Value |
|---|---|
| Date | 2026-06-08 |
| Sprint | POC build · cross-cutting (chrome) |
| Change | The chrome on the Management-plane surfaces **no longer announces the user's role**. The dashboard topbar currently reads `ART-EEP · Manager dashboard`; the **"Manager dashboard" suffix is removed**. The topbar becomes either a plain product identifier — `ART-EEP` — or, when a route-level hint is useful, a **neutral route name** such as `ART-EEP · Sessions` (route descriptor, not role descriptor). The same rule applies to every Management-plane chrome surface — dashboard topbar (`ha-vy-handover-dashboard.jsx`), quick-initiate topbar (`uc-ho-01-quick-initiate.jsx`), session-command-view topbar (`session-command-view.jsx`), prepare-stage topbar (`prepare-stage.jsx`), and any future Management-plane chrome. None of them should label the route with a role qualifier ("Manager X", "Admin Y") in topbars, breadcrumbs, page meta titles, or sidebar headers. **Per-page greetings** ("Good afternoon, Hà Vy") are **personal**, not role-announcing, and remain unaffected. **Scope clarification — what this rule does NOT change.** The "Manager review" **tab label** introduced by CL-103 and reaffirmed by CL-107 describes the *mode of work* — the review-and-sign-off workflow that a manager-permitted user performs — and is therefore **content, not chrome**. It is **not affected by CL-115**. Similarly, the **persona pill** in the topbar's user area ("HV · Hà Vy · Manager · Engineering") shows *who the user is* (their identity and role tier), not what the surface is called, and is also **not affected** — that's a user-identity affordance, not a chrome route label. If a future decision wants to rename "Manager review" to just "Review" or rename the persona-pill role line, those are separate CLs. |
| UC Reference | Cross-cutting chrome rule · applies to UC-HO-01 (dashboard + quick-initiate chrome) · UC-HO-04 (session command view chrome — note: the "Manager review" *tab* label per CL-103 / CL-107 is content and is NOT changed by this CL) · UC-HO-08 (prepare-stage chrome) |
| Why | PO direction: real SaaS products gate access via RBAC; chrome doesn't advertise the role. Labeling the dashboard "Manager dashboard" implies an alternative dashboard exists for non-managers — which it doesn't; there is one sessions dashboard, and access to it is governed by whether the user's RBAC role includes session-management permissions. The user already knows what role they are from their persona pill (and from being logged in); restating it in the chrome adds noise without information. Removing the role suffix tightens the chrome and aligns the UI with the actual access model (invisible RBAC, not narrated role). Generalizing the rule cross-surface prevents the same wording from sneaking back in on quick-initiate or the command view. |
| Decided By | PO (Tram) |
| Category | UX Refinement (chrome · cross-cutting) |

*Propagation pending in follow-up commits: `ha-vy-handover-dashboard.jsx` (TopBar — drop the "Manager dashboard" `<span>` after the ART-EEP wordmark; pick either no suffix or a neutral route suffix like "Sessions"), `uc-ho-01-quick-initiate.jsx` (topbar — verify no "Manager X" label; if present, drop), `session-command-view.jsx` (topbar / sidebar / any breadcrumb — verify no "Manager X" label; if present, drop), `prepare-stage.jsx` (topbar — same verification). Snapshot §2 to receive a new locked-decisions row for CL-115; §4 Design System to receive a chrome-labeling rule bullet alongside the existing UX Writing bullets.*

---

## Playbook Reference Cleanup (2026-06-08)

*Code-sweep follow-up to CL-113 (playbook eliminated). CL-113 settled the architecture; this entry catalogs the leftover "playbook" wording still present in shipped Management-plane mockups and locks the wording each leftover should become in follow-up surface commits. Not a new decision — CL-113 already decided. Logged separately so the surface-edit work has a single referenceable entry rather than living only inside CL-113's already-large propagation note.*

### CL-116 — Dashboard cleanup of leftover playbook refs · CL-113 implementation cleanup (no new decision)

| Field | Value |
|---|---|
| Date | 2026-06-08 |
| Sprint | POC build · Management plane |
| Change | Catalogs the leftover "playbook" wording still present in shipped Management-plane mockups after CL-113 eliminated the artifact, and locks the replacement wording. **No new decision** — purely an implementation cleanup of CL-113 + an alignment with CL-114 (successor field removed). Three concrete leftover refs in `ha-vy-handover-dashboard.jsx` to purge in follow-up surface commits: **(1) `LIFECYCLE_PHASES` Deliver phase sub-stage 8 label** — currently `"Playbook delivered"`; becomes `"KG access ready"` per CL-113's CL-088 annotation. This is the only line in the dashboard that still names the artifact in the lifecycle definition itself; once changed, the phase-progress bar legend and any tooltip surfaced from `LIFECYCLE_PHASES` are also clean. **(2) Completion celebration banner CTA** — currently a button reading `"View Nam's playbook"` (or equivalent successor-name + playbook wording); the **button is removed entirely**. The banner already states the bundle is committed to the KG; routing the manager to a "playbook" CTA contradicts both CL-113 (no playbook artifact) and CL-114 (no named successor). If a forward CTA is wanted, it becomes a neutral `"Open Knowledge Graph"` link to `/knowledge-graph` — but the default is to drop the CTA; the completion banner is informational, not navigational. **(3) Activity feed entry** — currently `"Minh Lê's playbook generated for Trần Hữu Nam"` (or equivalent); rewords to `"Minh Lê's bundle committed to Knowledge Graph"`. Two changes in one: drop "playbook" (CL-113) and drop the named successor "for Trần Hữu Nam" (CL-114). The activity feed describes what the system did, not who the result was addressed to. Other Management-plane mockups (`uc-ho-01-quick-initiate.jsx`, `prepare-stage.jsx`, `session-command-view.jsx`, `uc-ho-04-manager-review.jsx`) are not believed to contain playbook refs at this snapshot, but the same purge rule applies if any are found during the surface sweep: replace user-facing "playbook" with "bundle" (pre-commit) or "Knowledge Graph entries" (post-commit), per the CL-113 vocabulary; drop named successors per CL-114; remove "Playbook delivered" wherever it appears in lifecycle copy. The system-overview §13 demo flow and §11 artifact inventory likewise need the same purge (logged separately as part of the doc-cleanup sweep tracked in CL-113 follow-up #4). |
| UC Reference | Implementation cleanup of CL-113 (playbook artifact eliminated) · aligns with CL-114 (named successor removed) · UC-HO-01 (dashboard lifecycle) · UC-ON-01 / UC-ON-02 (Consumption plane vocabulary) |
| Why | CL-113 settled the architecture (no playbook) and CL-114 settled the session model (no named successor at session time), but the dashboard JSX still ships pre-CL-113 / pre-CL-114 wording in three concrete places. A demo reviewer clicking through today would see "Playbook delivered" in the lifecycle bar and "View Nam's playbook" in the completion banner — both contradicting the architecture the rest of the build now enacts. Cataloging the leftover refs and their replacements in a single CL gives the surface-edit work one referenceable entry, prevents the cleanup from being misread as a new decision, and keeps the change log's append-only discipline (rather than editing CL-113 in place). The activity-feed rewording carries both concerns (CL-113 + CL-114) at once, which is why both are credited in the UC Reference. |
| Decided By | PO (Tram) — implementation cleanup of CL-113 |
| Category | UX Refinement (cleanup) · implementation of CL-113 |

*Propagation pending in follow-up commits: **primary** — `ha-vy-handover-dashboard.jsx` (`LIFECYCLE_PHASES` Deliver sub-stage 8 label · completion-banner CTA · activity-feed playbook entry). **Verification sweep** — `uc-ho-01-quick-initiate.jsx`, `prepare-stage.jsx`, `session-command-view.jsx`, `uc-ho-04-manager-review.jsx` (and any sibling files of UC-HO-04) for "playbook" / "Playbook" string occurrences; treat per the replacement rules above if found. **Docs** — system overview §11 (artifact inventory) and §13 (demo flow) per CL-113 follow-up #4; context-snapshot §5 (KG model) and §13 (open items) per the same follow-up.*

---

## Pending Decisions (Need Stakeholder Input)

The defaults in CL-003, CL-004, and CL-005 are working assumptions. The following decisions remain open and should be confirmed before their respective sprints begin:

| Item | Default Taken | Target Sprint | Decision Owner |
|---|---|---|---|
| Production vs Hackathon mode | Hackathon-compressed | — (cross-cutting) | Stakeholder |
| HO-01 legal scanning basis | Vietnam PDPA | S1 | Legal |
| HO-01 Offboarder Knowledge Map view rights | Deferred to v2 | S1 | Legal / HR |
| HO-03 e-signature standard | Vietnam local | S2 | Legal |
| ~~ON-01 Playbook delivery model~~ | **OBSOLETE 2026-06-08 (CL-113) — no playbook artifact; UC-ON-01 reframed as "Generate Newcomer Initial Exploration Prompts"** | S4 | Product (resolved) |
| ON-02 mobile parity scope | Desktop-first v1 | S4 | Product / UX |
| HO-05 prompts visible to Offboarder pre-capture | **RESOLVED 2026-06-05 (CL-099) — yes; prompts are the queue the Offboarder answers** | S1 | Product (resolved) |
| HO-06 SLA for Manager correction review | **RESOLVED 2026-06-05 (CL-095) — 2 weekly cycles, then auto-escalate** | S5 | Product (resolved) |
| Offboarding window + successor model | **RESOLVED 2026-06-08 (CL-111) — 30-day window · deadline 3–5 days before last day · *further refined 2026-06-08 (CL-114) — successor field removed from POC scope entirely; newcomer identified by RBAC at KG access time, not by session-time assignment***  | S1 | PO (resolved) |
| ~~UC-ON-02 single vs split for 4 archetypes (post-CL-104)~~ | **RESOLVED 2026-06-08 (CL-113) — no playbook to split around; UC-ON-02 unified as "Explore Knowledge Graph (role-customized)" for all four archetypes** | S-KG | BA (resolved) |
| **Heatmap content definition (post-CL-104)** | (no default · 3 candidates proposed · awaiting confirmation) | S-KG | BA + Product |
| **Newcomer initial-prompt seeding strategy (post-CL-113)** | (no default · 4–6 prompts · static templates vs LLM-generated at commit time) | S-KG | BA + Product |
| **UC-ON-01 / UC-ON-02 final naming in master UC index (post-CL-113)** | (working names locked · final names pending) | S-KG | BA |
| **Consumer graph rebuild to company-wide default (CL-110)** | (documented · build deferred per PO) | S-KG | PO + BA |
| **TBD-Z1 OAuth scope minimums per connector** | (no default — hard block) | SZ | IT Security |
| **TBD-Z2 Connector approval workflow + SLA** | (no default — hard block) | SZ | IT + Legal |
| **TBD-Z3 Default sync frequency vs. rate limits** | (no default — hard block) | SZ | Product + IT |
| **TBD-Z4 Source data retention policy by sensitivity** | (no default — hard block) | SZ | Legal + DPO |
| **TBD-Z5 Connector deprecation behavior** | (no default — hard block) | SZ | Product |

---

*Maintained throughout build. Append-only.*
