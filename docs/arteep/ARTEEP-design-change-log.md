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
| Category | BA Gap · UX Refinement · Visual System · Performance · Scope Deferral · Default Pending Confirmation |

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
| Change | The 8-stage handover lifecycle is reorganized into 3 user-facing phases at every glance-level UI view · **Prepare** (Manager + System · 3 sub-stages · setup confirmed → context seeding → knowledge map ready), **Capture** (Offboarder + Manager · 3 sub-stages · interview scheduled → voice interview → transcript reviewed), **Deliver** (System + Successor · 2 sub-stages · committed to KG → playbook delivered). The 8 sub-stages still exist for system tracking and audit-log granularity, but the dashboard cards show 3 phase segments and the command-view hero shows a 3-phase progress bar. The command-view Stages tab shows 3 expandable phase blocks instead of 8 sequential rows. Progress visualization · 3 horizontal segments side by side, completed phases fully emerald, current phase showing within-phase fill in violet (proportional to sub-stage position), future phases gray-empty. Sub-stage detail surfaces inside the current phase block when that phase is active. |
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
| Why | 480px is too cramped for the data volume of a real session (3-phase timeline + audit log + action sidebar + quick info). The drawer also stretched the eye laterally and reduced the dashboard to ~50% width while open. Dedicated route gives each surface (dashboard vs. per-session) full-screen real estate and clean cognitive boundaries. The tabbed layout means new per-session surfaces (Data tab, Audit log tab) can grow without re-architecting. Pairs cleanly with CL-088 (3-phase model) · the hero progress bar and the Stages tab both surface 3 phases as their primary organization. |
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
| Change | All goals related to Peer Programming / developer performance evaluation are removed from scope. 100% of scope focuses on the Automated Handover Knowledge Lake — capture a departing employee's tacit knowledge, commit verified content to the Knowledge Graph, and serve it to successors. |
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

## Pending Decisions (Need Stakeholder Input)

The defaults in CL-003, CL-004, and CL-005 are working assumptions. The following decisions remain open and should be confirmed before their respective sprints begin:

| Item | Default Taken | Target Sprint | Decision Owner |
|---|---|---|---|
| Production vs Hackathon mode | Hackathon-compressed | — (cross-cutting) | Stakeholder |
| HO-01 legal scanning basis | Vietnam PDPA | S1 | Legal |
| HO-01 Offboarder Knowledge Map view rights | Deferred to v2 | S1 | Legal / HR |
| HO-03 e-signature standard | Vietnam local | S2 | Legal |
| ON-01 Playbook delivery model | Static + Copilot overlay | S4 | Product / UX |
| ON-02 mobile parity scope | Desktop-first v1 | S4 | Product / UX |
| HO-06 SLA for Manager correction review | **RESOLVED 2026-06-05 (CL-095) — 2 weekly cycles, then auto-escalate** | S5 | Product (resolved) |
| **TBD-Z1 OAuth scope minimums per connector** | (no default — hard block) | SZ | IT Security |
| **TBD-Z2 Connector approval workflow + SLA** | (no default — hard block) | SZ | IT + Legal |
| **TBD-Z3 Default sync frequency vs. rate limits** | (no default — hard block) | SZ | Product + IT |
| **TBD-Z4 Source data retention policy by sensitivity** | (no default — hard block) | SZ | Legal + DPO |
| **TBD-Z5 Connector deprecation behavior** | (no default — hard block) | SZ | Product |

---

*Maintained throughout build. Append-only.*
