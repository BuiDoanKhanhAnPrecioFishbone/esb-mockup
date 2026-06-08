# ART-EEP — Project Context Snapshot

*Conversation compaction · 2026-05-22 · Use this as the seed document for any future session.*

*Updated 2026-06-02 · email removed as an automated data source per data-ingestion governance rule; persona material types updated to use approved shared workspaces only.*

*Updated 2026-06-05 · grill-me session on the Automated Handover Knowledge Lake architecture (`ART_EEP_Architecture_Summary_EN.md`). Scope narrowed (Peer Programming removed), Trello selected as the POC showcase source, layered sanitization + hybrid security tiering + Knowledge Graph consumer-plane model adopted, `MASTER.md` scoped to the Consumer plane, English-only showcase. See CL-090–097.*

*Updated 2026-06-05 (later) · POC capture model. Voice interview (UC-HO-02) deferred to Phase 2; POC capture = self-serve upload + an asynchronous question queue; new UC-HO-08 (network knowledge requests) added in the Prepare stage. See CL-098–101.*

*Updated 2026-06-07 · UC-HO-04 Manager Review + Sign-off mockup completed (violet/yellow palette · all 8 states real · S1 Arrival → S8 SHA-256 sign-off). Sibling-file pattern adopted (CL-102) and the mockup wired into the live `SessionCommandView` as the 6th "Manager review" tab (CL-103). See §15 for the full delta and the live route map; the older sections below remain authoritative for everything else.*

*Updated 2026-06-07 (later) · Consumer-plane personas expanded to four archetypes for the PO's "show how the KG is used internally" requirement. Locked persona set grows 6 → 9 with three additions — Duy Nguyễn (promoted from supporting · project peer), Linh Phạm (new · cross-departmental colleague), Thảo Vũ (new · upper management, owns Timeline + Heatmap surface). See CL-104. Open follow-up: Heatmap content definition.*

*Updated 2026-06-07 (final) · **Consumer Knowledge Graph default corrected (CL-110).** The Consumption plane is the **organization's shared knowledge layer** for internal users, so its **default view must be a company-wide GraphRAG** over everything the system holds — **not** a single offboarder's handover subgraph. The graph spans three streams: (1) what the system extracted from departing employees' sources during their handovers; (2) what current employees uploaded themselves; (3) what current employees permitted the system to collect from their own data. Default canvas is a multi-cluster company map (organized by domain / project / team) with **no single human at the center**. A single offboarder centered (e.g. Minh Lê) is one filtered lens — filter: `offboarder = …` — alongside filters by project, team / department, and status (canonical / contested / critical). All CL-094 interaction primitives operate over the whole graph, respecting both the active filter and the viewer's ACL. The current `knowledge-graph-explorer.jsx` hardcodes Minh as the central hub and **diverges from this model**; per PO direction the correction is documented now and the rebuild is deferred ("we will build it later").*

*Updated 2026-06-08 · **playbook eliminated** as a separate artifact (CL-113). The Consumption plane is unified on the Knowledge Graph; role-customization happens at the **initial-state layer**, not as a separately-generated document. The newcomer (Trần Hữu Nam) enters the KG with **role-customized initial exploration prompts**; the other three archetypes (project peer · cross-dept · upper management) enter the same KG with their archetype-appropriate default lens. **UC-ON-01** reframed as "Generate Newcomer Initial Exploration Prompts"; **UC-ON-02** reframed as "Explore Knowledge Graph (role-customized)" — one UC for all four archetypes. **Resolves the UC-ON-02 single-vs-split** that was a CL-104 follow-up. `arteep-s4-onboarding-gen-read.jsx` superseded.*

*Updated 2026-06-08 (later) · **review-unit terminology standardized (CL-112).** The reviewable unit a manager decides on during Manager review is an **"item"** everywhere — the umbrella that covers captured answers, uploaded files, and flag fixes (where "section" doesn't fit an uploaded file). Phương Anh's review surface reworded "sections" → "items". The dashboard's **post-commit Knowledge-Graph node count** is renamed **"entries"** (was "items") so "items" no longer carries two meanings at two scales (14 review items vs 487 KG entries). UC-HO-04 S1 arrival tiles reconciled to sum to 14: a fifth **"Uploaded files (3)"** tile added, `SESSION.filesTotal` corrected 4 → 3 to match the three rendered file rows.*

*Updated 2026-06-08 (later still) · **offboarding policy locked (CL-111).** Company policy fixes the **standard offboarding window at 30 days**, with the **review / handover deadline 3–5 days before the last day** so the admin (manager) and the offboarder verify the captured bundle together. **Successor is optional** — sessions render "to be assigned" when none is named. **Khánh Linh Trần** is the explicit short-notice exception (2-day departure · EX.2). Canonical demo timeline locked: Minh Lê — Jul 4 last day · review Jun 30 · 26 days left · successor Trần Hữu Nam; Phương Anh — Jun 20 last day · review Jun 16 · 12 days left · successor "to be assigned"; Khánh Linh — 2 days · successor "to be assigned". CL-105 / CL-107 propagations still to come.*

---

## 1. Project Overview

**ART-EEP** is an enterprise Knowledge Graph platform for employee handover and onboarding, built on Azure. It captures departing employees' tacit knowledge, commits verified content to a knowledge graph, and serves it to internal users through a **role-customized Knowledge Graph experience** with an active learning correction loop. *(Capture is via AI-guided voice interview in Phase 2; in the POC it is self-serve upload + an async question queue — see §2. The personalized "playbook" artifact was eliminated 2026-06-08 per CL-113; newcomers enter the KG with role-customized initial exploration prompts.)*

**Scope (CL-090):** 100% focused on the **Automated Handover Knowledge Lake**. Peer Programming / developer-performance evaluation is explicitly out of scope — it bloated the system and diluted the core message.

**Hackathon scoring:** 40% Agentic Workflow / 40% Human-in-the-Loop / 20% Token Efficiency

**Primary user / BA / Product Designer:** Tram, based in HCMC, Vietnam.

---

## 2. Locked Architectural Decisions

| Decision | Rationale |
|---|---|
| Semantic Kernel Orchestrator with Planner Agent | Coordinates Worker/Expert routing |
| ComplexityScore-based dynamic Worker/Expert routing | Phi-3/GPT-4o-mini for low complexity, GPT-4o for high |
| Confidence-gate escalation Worker → Expert | Quality control at each tier |
| Pre-retrieval ACL trimming at Azure AI Search + Cosmos DB partition level | Security by design (see CL-093 Tier-1 stub exception) |
| Microsoft Purview as mandatory PII gate (no fallback) | Compliance non-negotiable (now fronted by CL-092 pre-passes) |
| Cosmos DB Integrated Cache (Redis rejected) | Simpler architecture |
| Section Blueprint primitive for dynamic N-section generation | Avoids hardcoded structure |
| Dynamic N-domain coverage in voice interview | Replaces hardcoded 4 sections |
| GraphRAG dual-strategy retrieval | Combines graph + vector search |
| Atomic KG commit pipeline with rollback | Data integrity |
| **Data-ingestion scope · shared workspaces only** | Automated collection restricted to Jira · GitHub · Google Drive (shared) · SharePoint · Trello · Microsoft Planner. Email, personal directories, and individual messaging are NEVER scanned. Personal files only via manual upload. |
| **Flexible multi-source model · Trello POC (CL-091)** | The source mix is driven by department / role / position — not a fixed list. The 4-Layer Hard-Filter (time-decay removed · list/status · content-depth · label-priority) is a **source-agnostic ingestion contract**. **Trello is the POC showcase source** (the company's primary third-party system today); other sources map onto the same four layers. |
| **Hybrid Sanitization Pipeline (CL-092)** | Filter-at-capture: Regex redaction (0-token) → Few-Shot neutralization → **Purview as the authoritative mandatory gate**. The two pre-passes sit in front of Purview; they do not replace it. |
| **Hybrid Security Tiering (CL-093)** | Tier auto-assigned from Purview sensitivity + source labels. **Tier 2** (sensitive / legal) ghosted via strict ACL trim. **Tier 1** (operational, access-controlled) returns a metadata-only stub for the Lock + "Request access" affordance — a narrow exception to pre-retrieval ACL trimming. |
| **Knowledge Graph Consumer plane (CL-094)** | Progressive Disclosure (central node + 1-hop · double-click expand/collapse) · Contextual-AI quick-start chips (center/zoom/dim) · 0-token hover (stored 15-word `short_summary`) · Timeline + Heatmap split-screen · Prompt Disambiguation on broad queries. |
| **Feedback triage · commit gate preserved (CL-095)** | Token-free tag-based routing (Critical → real-time alert / Batch → weekly digest). A report immediately flags the node "under review" (0-token). **No correction auto-commits — QA-INT-01 §1.4 stays absolute.** 2-cycle SLA escalation. |
| **POC capture model · voice deferred (CL-098 / CL-099)** | The POC replaces the live voice interview (UC-HO-02 → **Phase 2**) with self-serve **file upload + an asynchronous question queue** the Offboarder answers in text. The queue = Manager Priority Prompts (UC-HO-05) + network-solicited questions (UC-HO-08) + the Offboarder's own additions. The 3-phase lifecycle is unchanged; only the Capture *mechanism* changes. |
| **Network knowledge requests · UC-HO-08 (CL-100 / CL-101)** | In Prepare, the system notifies the offboarder's **auto-derived connection set** (Trello card co-members / comment participants / co-assignees + manager + named coach; manager-editable) and collects **questions** (→ capture queue) and **flags** on wrong/insufficient AI-collected data (→ pre-commit, **ACL-bounded** correction requests to the Offboarder — a colleague only flags what they already had access to). |
| **3-phase user-facing lifecycle** | Internal 8-stage pipeline grouped as **Prepare · Capture · Deliver** at every glance-level UI view. Reduces cognitive load. *Phase 3 sub-stage 8 renamed "KG access ready" per CL-113 (was "Playbook delivered").* |
| **Sibling-file pattern for mockup state extraction (CL-102 · 2026-06-07)** | When a mockup JSX file exceeds ~100KB (the safe-write threshold), extract self-contained state views into sibling files. Main file owns shared scaffolding; siblings own one or more state views + their decision-panel content. First applied to UC-HO-04 (`uc-ho-04-s6-flag-fix.jsx`, `uc-ho-04-s7s8-signoff.jsx`). |
| **Mockups merged into 1 live control (CL-103 · 2026-06-07)** | Standalone mockups under `components/mockups/` are wired into existing live control surfaces (e.g. `SessionCommandView`) as tabs via the `embedded` + `state` props contract — not exposed as separate `/m/<slug>` routes (retired) or new top-level routes. The session command view is the system for per-session work, including Manager review (UC-HO-04). |
| **Consumer-plane four-archetype persona model (CL-104 · 2026-06-07)** | The Consumer class spans **four archetypes** — newcomer (Trần Hữu Nam) · project peer (Duy Nguyễn) · cross-departmental colleague (Linh Phạm) · upper management (Thảo Vũ). Locked persona set expanded 6 → 9 to make the Consumption plane demonstrate how the KG is used internally across the organization, not only by the canonical Onboarder. |
| **Consumer KG default = company-wide GraphRAG (CL-110 · 2026-06-07)** | The Consumption plane is the **organization's shared knowledge layer** for internal users (newcomers, project peers, cross-departmental colleagues, upper management), so its **default view is a company-wide GraphRAG** over everything the system holds — **not** a single offboarder's handover subgraph. Knowledge spans three streams: (1) what the system extracted from departing employees' sources during their handovers; (2) what current employees uploaded themselves; (3) what current employees permitted the system to collect from their own data. Default canvas is a multi-cluster company map (organized by domain / project / team) with **no single human at the center**. A single offboarder centered (e.g. Minh) is **one filtered lens** alongside filters by project, team / department, and status (canonical / contested / critical). All CL-094 primitives operate over the whole graph, respecting both the active filter and the viewer's ACL. The current `knowledge-graph-explorer.jsx` hardcodes Minh as the central hub (`SUBJECT = minh-le`) and **diverges from this model** — rebuild deferred per PO direction. |
| **Standard offboarding window (CL-111 · 2026-06-08)** | Company policy fixes the **offboarding window at 30 days** from the day an employee's status flips to Offboarding to their last day. The session's **review / handover deadline is 3–5 days before the last day**, baking in a joint admin + offboarder verification buffer before departure. **Successor is optional** — a session may have no successor named at initiation; the field renders **"to be assigned"** in the UI rather than a name. **Khánh Linh Trần (2-day urgent departure · EX.2) is the explicit short-notice exception**, outside the 30-day standard. Canonical demo timeline: Minh Lê (Jul 4 / review Jun 30 / 26 days left / successor Trần Hữu Nam) · Phương Anh Nguyễn (Jun 20 / review Jun 16 / 12 days left / successor "to be assigned") · Khánh Linh Trần (2 days · successor "to be assigned"). |
| **Playbook eliminated · Consumption plane unified on the KG (CL-113 · 2026-06-08)** | The separate "playbook" artifact is removed. The Consumption plane has exactly **one** surface — the Knowledge Graph — and role-customization happens at the **initial-state layer**, not as a separately-generated document. Newcomer (Trần) enters with **role-customized initial exploration prompts**; project peer (Duy), cross-dept (Linh), and upper management (Thảo) each enter with their archetype-appropriate default lens (filter / starting prompts / Timeline+Heatmap). **UC-ON-01** reframed as "Generate Newcomer Initial Exploration Prompts" (working name); **UC-ON-02** reframed as "Explore Knowledge Graph (role-customized)" — one UC for all four archetypes. Resolves the UC-ON-02 single-vs-split that was a CL-104 follow-up. `arteep-s4-onboarding-gen-read.jsx` is superseded entirely (no migration). |
| **Review-unit terminology standardized (CL-112 · 2026-06-08)** | The reviewable unit a manager decides on during Manager review is an **"item"** everywhere — the umbrella that covers captured answers, uploaded files, and flag fixes (where "section" doesn't fit an uploaded file). Phương Anh's review surface reworded "sections" → "items" (data + behavior unchanged · component name `PhuongAnhReview` and `PA_SECTIONS` key kept internal). The dashboard's **post-commit Knowledge-Graph node count** is renamed **"entries"** (was "items" · `stats.entries` key) so "items" no longer carries two meanings at two scales — **14 review items** vs **487 KG entries**. UC-HO-04 S1 arrival tiles reconciled to sum to 14 by adding a fifth **"Uploaded files (3)"** tile (own-contributions recoloured gray to match left-rail source colors); `SESSION.filesTotal` corrected 4 → 3 to match the three rendered file rows. The "Redirected" item (1) stays excluded from the 14 by design. |

---

## 3. Personas (9 total — locked · four-archetype Consumer model per CL-104 · timelines per CL-111)

| Name | Role | Department | Plane | Notes |
|---|---|---|---|---|
| **Hà Vy** | Manager | Engineering | Management | Owns handover sessions; primary actor in UC-HO-01, HO-04, HO-07 |
| **Minh Lê** | Offboarder | Engineering | Capture | Canonical demo persona; Senior Backend Engineer. **Last day Jul 4 · review deadline Jun 30 · 26 days left · successor Trần Hữu Nam (CL-111)** |
| **Trần Hữu Nam** | Successor / Onboarder | Engineering | Consumption (newcomer) | Succeeds Minh Lê. **Per CL-113, his Consumption-plane entry is the Knowledge Graph with newcomer-customized initial exploration prompts** — no separate playbook artifact. Also flags the AI in UC-HO-04 S6 (Atlas rollback chain) |
| **Khánh Linh Trần** | Offboarder | People & Culture | Capture | Head of People Operations. **Short-notice 2-day departure · EX.2 · the explicit exception to the standard 30-day offboarding window (CL-111)**. Exercises EX.2 + high PII. **Successor "to be assigned"** |
| **Phương Anh Nguyễn** | Offboarder | Sales | Capture | Senior Account Executive; demonstrates non-engineering source mix. **Last day Jun 20 · review deadline Jun 16 · 12 days left · successor "to be assigned" (CL-111)** |
| **An Quân Vũ** | Platform Admin / IT | — | Step Zero | Plan v2 CL-068; owns Step Zero |
| **Duy Nguyễn** *(NEW · CL-104 · promoted from supporting)* | Senior Data Engineer | Data Platform | Consumption (project peer) | Already in UC-HO-04 S6 (Atlas rollback 3-way) as corroborating colleague; now locked as the **project peer** Consumer archetype |
| **Linh Phạm** *(NEW · CL-104)* | Product Manager | Product | Consumption (cross-dept) | **Cross-departmental colleague** archetype; exercises Tier-1 "Request access" (CL-093) on content scoped to other teams |
| **Thảo Vũ** *(NEW · CL-104)* | Engineering Director | Engineering (leadership) | Consumption (upper mgmt) | **Upper-management** archetype; **owns the Timeline + Heatmap surface** (CL-094) — the locked actor that was missing |

**Four Consumer archetypes mapped to personas (CL-104 + CL-113):**

| Archetype | Persona | Default lens onto the KG |
|---|---|---|
| Newcomer | Trần Hữu Nam | **KG with role-customized initial exploration prompts** (UC-ON-02 reframed · CL-113) — no separate playbook |
| Project peer | Duy Nguyễn | KG filtered to cross-team handover context · UC-HO-08 corroboration |
| Cross-departmental colleague | Linh Phạm | KG with adjacent-team filter · Tier-1 stub + Request access |
| Upper management | Thảo Vũ | KG Timeline + Heatmap surfaces (CL-094) · project evolution + risk tracking |

All four archetypes enter the **same company-wide Knowledge Graph** (CL-110 · multi-cluster · no single human at the center) through the **same UC-ON-02** ("Explore Knowledge Graph · role-customized") — distinguished only by default lens / filter / starting prompts (CL-113).

Each persona has different handover material types · scoped to approved shared workspaces only:
- **Engineering (Minh Lê)**: Jira tickets, GitHub repos (PR descriptions, commit messages, wiki pages), Google Drive (shared) files. *POC showcase source: Trello (CL-091).*
- **Sales (Phương Anh)**: Salesforce deals, shared Calendar, SharePoint sales-collateral documents
- **People Ops (Khánh Linh)**: HRIS records, Notion policy pages, SharePoint policy archive

Email, personal mailboxes, and private direct messages are excluded from automated collection per the data-ingestion governance rule. Where role-specific context lives in email threads, it surfaces through the POC question queue or manual file upload, not automated scanning.

**POC showcase rendering (CL-097):** within the Consumer-plane POC showcase, persona names render as diacritic-free latinized handles (`Minh Le`, `Ha Vy`, `Duy Nguyen`, `Linh Pham`, `Thao Vu`, `@minh.le`). Persona identities are unchanged — only the on-screen string is latinized, and no Vietnamese text appears in the showcase.

---

## 4. Design System (Current Canonical State)

### Brand Palette (CL-054 — supersedes CL-008)

| Color | Use |
|---|---|
| **Violet** (violet-50/100/200/500/600/700) | Brand, AI signal, primary CTAs, Provenance Chip, active states |
| **Pastel Yellow** (yellow-50/100/200/700/800) | Warnings, knowledge gaps, Manager priority badges, low confidence |
| **Rose** (preserved) | Critical severity only — recording indicator, urgency, critical content, conflict |
| **Emerald** (preserved) | Verified content, canonical success states (Canonical Fact uses emerald-300 border) |
| **Muted Blue** (CL-078) | Entity badges for projects/products only (scope: Transactional Gateways artifact) |

### Visual Rules
- Light mode only · `bg-gray-50` canvas · `bg-white` surfaces
- 1px `border-gray-200` hairlines (except 2px semantic left-edge accents)
- Sans-serif primary + monospace for IDs/timestamps/stats
- 2-animation budget: recording mic rings (rose) + completion glow (violet)
- 32px button heights; 7-px ghost button heights
- Explicit focus rings: `focus:ring-2 focus:ring-violet-500/20`

### UX Writing (CL-001/CL-002)
- English by default (CL-077 Vietnamese deviation scoped to Transactional Gateways artifact only)
- Sentence case · active voice · Linear/Notion/Stripe register
- Named humans not roles ("Hà Vy will review" not "your manager will review")
- "Sensitive content" not "PII" · "Microsoft Purview" not in user copy
- Vietnamese system terms preserved in tooltips: "Canonical · Sự thật gốc" *(overridden in the POC showcase — see below)*
- **Terminology (CL-112):** the review unit is an **"item"** (covers answers, uploads, flag fixes); the post-commit KG node count is **"entries"** — never reuse "items" at the KG-count scale.
- **Unassigned successor (CL-111):** when no successor is named, render the field as **"To be assigned"** — never invent a placeholder name.

### Consumer-plane design system (CL-096 · scoped deviation)
The **Knowledge Graph Consumer plane / POC showcase** uses the `MASTER.md` "AI-Native Minimal" shell as its **presentation layer only** — indigo `#6366F1` primary, glassmorphism cards, light/dark toggle, `rounded-xl`/`2xl`, soft shadows, floating navbar. This does **NOT** apply to the Management / Capture surfaces (dashboard, quick-initiate, command-view), which stay on the locked light-mode system above. The ART-EEP **semantic palette is preserved as the meaning layer everywhere** — rose = critical / locked, yellow = low-confidence / contested, emerald = verified / canonical, violet = AI signal.

**English-only showcase (CL-097):** no Vietnamese text appears in the Consumer-plane showcase. The "Canonical · Sự thật gốc" / bilingual-tooltip rule above is overridden within the showcase — Canonical renders in English only ("Canonical" / "Canonical fact"). Usernames are latinized handles (see §3).

---

## 5. Use Cases (11 + Step Zero)

### Handover (HO)
- **UC-HO-01** Initiate Handover Session
- **UC-HO-02** Conduct AI-Guided Voice Interview (Dynamic N-Domain Coverage) — ⏸ **deferred to Phase 2 (out of POC)**
- **UC-HO-03** Review and Sign Transcript
- **UC-HO-04** Submit Handover Record to Knowledge Graph — **MOCKUP COMPLETE 2026-06-07 · live at `/session/[id]?tab=review` (CL-103)**
- **UC-HO-05** Configure Custom Prompts and Section Blueprints *(POC: prompts feed the capture queue)*
- **UC-HO-06** Report Hallucination or Error
- **UC-HO-07** Approve Knowledge Graph Correction
- **UC-HO-08** Solicit Handover Inputs from the Employee's Network — **NEW · Prepare stage (CL-100 / CL-101)**

**POC capture model (CL-098 / CL-099):** the voice interview is Phase 2. In the POC, capture is **self-serve upload + an asynchronous question queue** the Offboarder answers in text — the queue being manager prompts (UC-HO-05) + network questions (UC-HO-08) + the Offboarder's own additions. The captured content is reviewed and signed via UC-HO-03 as before, then committed via UC-HO-04. A pre-commit, ACL-bounded correction loop (UC-HO-08 flags → Offboarder fixes) runs alongside (CL-101).

### Onboarding (ON) · reframed per CL-113 (2026-06-08)
- **UC-ON-01** **Generate Newcomer Initial Exploration Prompts** *(working name · reframed from "Generate Personalized Onboarding Playbook" per CL-113)* — the system reads section blueprints + the successor's role and synthesizes a curated set of starter prompts (4–6 working default; final count + static-vs-LLM strategy pending) that seed into the newcomer's KG entry view at the end of Phase 3. **No playbook document is generated.**
- **UC-ON-02** **Explore Knowledge Graph (role-customized)** *(working name · reframed from "Read Playbook with Inline Knowledge Tools" per CL-113)* — **one UC** for all four Consumer archetypes, distinguished by default lens / filter / starting prompts, **not by separate surfaces**. Resolves the UC-ON-02 single-vs-split flagged as a CL-104 follow-up — there is no playbook for the split to be about.
- **UC-ON-03** Skill Gap Analysis and Growth Plan

### Consumption plane — the Knowledge Graph (CL-094 / CL-095 / CL-110 / CL-113)
The Consumption plane is the **single artifact** for all four reader archetypes — the **company-wide GraphRAG Knowledge Graph** (CL-110). The default view is a multi-cluster company map (organized by domain / project / team) with no single human at the center; a single offboarder centered is one filtered lens alongside filters by project, team / department, and status. Interaction primitives (CL-094): Progressive Disclosure, Contextual-AI quick-start chips, 0-token hover via stored `short_summary`, Timeline + Heatmap split-screen, Prompt Disambiguation. The feedback loop (UC-HO-06 / UC-HO-07) runs through **token-free triage** with a contested-flag-on-report and the preserved §1.4 commit gate (CL-095). Three-plane architecture: **Management** (dashboard / command-view, with UC-HO-04 inline as the Manager review tab) · **Capture** (POC: upload + question queue + UC-HO-08 network requests; voice interview is Phase 2) · **Consumption** (single KG surface, four archetype lenses, company-wide default).

**Four reader archetypes (CL-104 + CL-113).** Same KG, different default lens: Trần Hữu Nam (newcomer · **KG with starter prompts**), Duy Nguyễn (project peer · cross-team handover context), Linh Phạm (cross-departmental colleague · adjacent-team filter + Tier-1 stub + Request access), Thảo Vũ (upper management · Timeline + Heatmap). The Heatmap content (Knowledge Hotspots · Skill Density · Risk Heatmap or a subset) is an open follow-up.

### Step Zero (Plan v2, NEW)
- **Z01** Connector Library (browse 8 integrations)
- **Z02** Connector Setup Wizard (OAuth + scope confirmation)
- **Z03** Connector Health Dashboard (operational monitoring)
- **Z04** Department × Source Mapping (per-dept configuration)

---

## 6. Sprint Roadmap (Plan v2 — current)

| Sprint | Duration | UCs / Module | Status |
|---|---|---|---|
| **S0 Platform Foundation** | 1 week | Infra + design system | COMPLETED |
| **SZ Step Zero (NEW)** | 2 weeks | Z01–Z04 | PENDING (5 blockers) |
| **S1 Handover Initiation** | 2 weeks | UC-HO-01, UC-HO-05 | COMPLETED (v2 with violet/yellow; redesigned 2026-06-02 to 3-phase + drawer→command-view + one-click initiation). **Session model per CL-111** — 30-day standard window, review deadline 3–5 days before last day, successor optional ("to be assigned"); Khánh Linh remains the 2-day urgent exception. Dashboard timeline applied; `session-command-view.jsx`, `prepare-stage.jsx`, `uc-ho-01-quick-initiate.jsx` propagation pending. |
| **S2 Capture & Verify** | 2 weeks | UC-HO-02, UC-HO-03 | COMPLETED (old amber palette — needs migration). **POC: voice interview deferred to Phase 2 (CL-098); capture = self-serve upload + question queue (CL-099). New surfaces pending.** |
| **S3 KG Commit · UC-HO-04** | 1.5 weeks | UC-HO-04 Manager Review + Sign-off | **COMPLETED 2026-06-07 with violet/yellow palette.** Mockup at `components/mockups/uc-ho-04-manager-review.jsx` + siblings `uc-ho-04-s6-flag-fix.jsx` + `uc-ho-04-s7s8-signoff.jsx`. All 8 states real. Wired into live `/session/[id]` as the **Manager review** tab via CL-103. **Terminology refreshed per CL-112** — "items" everywhere; S1 tiles reconciled to 14 (added Uploaded files tile · `SESSION.filesTotal` corrected 4 → 3). |
| **S4 Onboarding Gen & Read** | 2 weeks | UC-ON-01, UC-ON-02 | **SUPERSEDED 2026-06-08 by CL-113** — no separate playbook artifact. UC-ON-01 / UC-ON-02 reframed; their build is now part of S-KG. `arteep-s4-onboarding-gen-read.jsx` removed from migration scope. |
| **S-KG Consumption plane (NEW)** | TBD · highest-priority next | Knowledge Graph (CL-094) · **company-wide GraphRAG default per CL-110** · feedback triage (CL-095) · **four-archetype reader model with role-customized lenses (CL-104 + CL-113)** | PENDING — **single** Consumer-plane surface for all four archetypes on a **company-wide KG** (CL-110), not offboarder-centered. Existing `knowledge-graph-explorer.jsx` diverges from CL-110 (hardcodes Minh as central hub); rebuild deferred per PO. Target route `/knowledge-graph` · `MASTER.md` shell. Scope: newcomer KG with starter prompts (Trần), cross-team query (Duy), cross-dept research with Tier-1 stub (Linh), Timeline + Heatmap (Thảo). |
| **S5 Skill Gap & Feedback** | 1.5 weeks | UC-ON-03, HO-06, HO-07 | PENDING (also home for QA-INT-01 gap fixes) |
| **S6 Polish & Demo** | 1 week | Cross-cutting | PENDING |

**Total timeline:** ~12 weeks (was ~7–8 in v1; Step Zero added 2 weeks). Hackathon-compressed mode can cut SZ to 1 week with 2 connectors instead of 8. Peer Programming evaluation removed from scope (CL-090).

**Prepare-stage addition:** UC-HO-08 (network knowledge requests · CL-100) lands in the Prepare stage (S1 family). Its surfaces — the network-request fan-out and the Offboarder's capture queue + upload — are the POC's replacement for the S2 voice interview and are pending build.

---

## 7. Step Zero MVP Scope

**4 screens (Z01–Z04)** · **8 curated connectors** — note that automated data collection is scoped to shared workspaces only; email components below are listed for completeness of the connector platform integration, but ART-EEP does NOT scan email content at any point:

1. Microsoft 365 (OneDrive + SharePoint + Teams · *email integration is platform-level only · never scanned for ART-EEP knowledge*)
2. Google Workspace (Drive shared + Calendar · *Gmail integration platform-only · never scanned*)
3. Jira
4. Salesforce
5. Slack (shared channels only, no DMs)
6. Notion (shared workspaces only)
7. GitHub (shared repos only)
8. Generic HRIS (BambooHR/Workday adapter)

*Trello is the POC showcase source (CL-091); in the curated connector library it joins the list above as the demonstrated integration.*

**5 Step Zero blockers (TBD-Z1 to TBD-Z5):**
- TBD-Z1: OAuth scope minimums per connector (IT Security)
- TBD-Z2: Connector approval workflow + SLA (IT + Legal)
- TBD-Z3: Sync frequency policy vs. rate limits (Product + IT)
- TBD-Z4: Source data retention by sensitivity (Legal + DPO)
- TBD-Z5: Connector deprecation behavior (Product)

**Cross-impact on existing UCs:**
- UC-HO-01 step 4 now reads Step Zero's Department × Source mapping
- UC-HO-04 KG schema reads from Step Zero entity mappings
- UC-ON-01 starter-prompt synthesis optionally informed by department-source patterns (per CL-113 reframe)

---

## 8. QA-INT-01 — Foundational Governance Rule

**Adopted as system-level rule above sprint decisions** (CL-080). Full text at `/mnt/user-data/outputs/QA-INT-01-Dual-Verification-Rule.md`.

### Clauses

| Clause | Requirement |
|---|---|
| 1.1 | Visible provenance on every AI output |
| 1.2 | Surface the specific source document/snippet |
| 1.3 | HITL review with side-by-side diff |
| 1.4 | Explicit sign-off before KG commit |
| 2.1 | Unified data pipeline (verified content propagates ecosystem-wide) |
| 2.2 | Canonical Fact (Sự thật gốc) status visibly distinct from Verified |
| 2.3 | Immutable audit trail queryable per item |

### Compliance Status (Post-Fixes)

**ALL 7 CLAUSES NOW COMPLIANT.** Three gaps were identified and remediated:

| Gap | Fix | Implementation |
|---|---|---|
| **Gap A (CL-081)** — Canonical Fact surface | CL-084 — `CanonicalBadge` component | Emerald-300 border + Network icon + "Sự thật gốc" tag; wired in Feature 04 (KG Commit), Feature 06 (Reading), Feature 08 (Resolved) |
| **Gap B (CL-082)** — Per-item lineage view | CL-085 — `LineageDrawer` component | 400px right drawer with 4-event timeline (Created → Verified → Committed → Propagated); opens from Canonical badge in Feature 06 |
| **Refinement C (CL-083)** — Inline edit diff | CL-086 — Updated `DraftItemEditing` | Original AI text greyed/strikethrough above editable field with "Original · AI-generated" label and QA-INT-01 §1.3 citation in footer |

**§1.4 reaffirmed (CL-095):** the feedback-loop token-free triage changes only *when* and *how* a Manager is notified of a reported error — never *whether* they sign off. A report flags the node "under review" (a 0-token status flag), but no correction auto-commits. §1.4 remains absolute, including for the Batch path and the 2-cycle SLA escalation. The pre-commit network-flag loop (CL-101) likewise routes corrections through the Offboarder and then UC-HO-03 sign-off — it never writes to the KG directly.

**§1.4 surfaced in UC-HO-04 (2026-06-07):** the S8 state of the new Manager Review mockup renders the commit gate as a SHA-256 cryptographic anchor (`8f3a2b9c…d7a5f` preview) bound to Hà Vy's Entra ID identity, with a visible 15-min undo grace window before the audit trail becomes immutable. Live commit progress shows hash validation → ACL trim → Purview gate → Cosmos writes → Verified edges → KG propagation → Slack notifications → audit log entry. Surfaces §1.4 + §2.3 in one screen.

---

## 9. Artifact Inventory

### Code Artifacts (React/JSX) · live in repo
| File | Status | Notes |
|---|---|---|
| `arteep-s0-component-library.jsx` | CANONICAL | 7 shared components |
| `arteep-s1-handover-initiation.jsx` | SUPERSEDED | V1 with old amber palette |
| `arteep-s1-handover-initiation-v2.jsx` | SUPERSEDED | V2; replaced by dashboard + quick-initiate + command-view trio (2026-06-02) |
| `ha-vy-handover-dashboard.jsx` | CURRENT | Multi-session command center · 3-phase progress · **post-commit KG count uses "entries" (CL-112)** — completion banner "487 entries", `stats.entries` key, completed-card "Entries" stat, activity-feed line, This-week "Entries committed to KG" stat. **30-day session model + canonical timelines applied (CL-111)** — Minh / Phương Anh / Khánh Linh days-left + successor fields. |
| `uc-ho-01-quick-initiate.jsx` | CURRENT | One-click session creation · progressive-disclosure customize. **CL-111 30-day window + "to be assigned" successor wording propagation pending.** |
| `session-command-view.jsx` | CURRENT | Per-session tabbed workspace · **6 tabs now: Overview · Stages · Data · Audit log · Settings · Manager review (CL-103)**. **CL-111 30-day window propagation pending** — review-deadline strip + successor field. |
| `uc-ho-04-manager-review.jsx` | **CURRENT (NEW 2026-06-07)** | Sprint 3 Manager Review + Sign-off · 8 states · violet/yellow · `embedded` + `state` props (CL-103). **Review-unit terminology "items" (CL-112)** — 14 items total; S1 arrival tiles reconciled to sum to 14 (5 tiles: 4 source tiles + Uploaded files tile); `SESSION.filesTotal` corrected 4 → 3 |
| `uc-ho-04-s6-flag-fix.jsx` | **CURRENT (NEW 2026-06-07)** | UC-HO-04 sibling · S6 3-way diff for Atlas rollback flag chain (CL-102) |
| `uc-ho-04-s7s8-signoff.jsx` | **CURRENT (NEW 2026-06-07)** | UC-HO-04 sibling · S7 bundle summary + S8 SHA-256 sign-off (CL-102) |
| `uc-ho-02-interview-canvas` | DEFERRED TO PHASE 2 | Voice interview focus-mode surface · retained for Phase 2, not in the POC (CL-098) |
| `prepare-stage.jsx` | CURRENT | **CL-111 timeline propagation pending** — 30-day window + 3–5-day review-deadline buffer |
| `arteep-s2-capture-verify.jsx` | NEEDS MIGRATION | 5 Offboarder screens · old amber palette |
| `arteep-s3-kg-commit.jsx` | **SUPERSEDED 2026-06-07** | Old amber-palette Manager Completion Report 4 states; replaced by `uc-ho-04-manager-review.jsx` trio above |
| `arteep-s4-onboarding-gen-read.jsx` | **SUPERSEDED 2026-06-08 (CL-113)** | Amber UC-ON-01 / UC-ON-02 "playbook" artifact. No longer needs migration — the surface it portrays no longer exists. Playbook eliminated; Consumption plane unified on the KG. |
| `arteep-system-ui-tour.jsx` | **CANONICAL DEMO** | 8 features × 3-4 states · violet/yellow · QA-INT-01 fixes integrated |
| `arteep-transactional-gateways.jsx` | CANONICAL (specialized) | 3 states · Vietnamese UI |
| POC Capture surfaces (upload + question queue · UC-HO-08 network requests) | NOT YET BUILT | POC Capture plane · replaces voice interview (CL-099 / CL-100 / CL-101) |
| `knowledge-graph-explorer.jsx` (Consumer plane · single surface · four-archetype lenses per CL-104 + CL-113) | **NEEDS REBUILD (CL-110) · build deferred per PO** | Current build hardcodes Minh Lê as the central hub (`SUBJECT = minh-le`) — every node is from his handover, **diverges from the CL-110 company-wide GraphRAG default**. Per CL-113 this is the **single** Consumer-plane surface for all four reader archetypes (newcomer with starter prompts · project peer · cross-dept · upper mgmt) on a company-wide KG (no single human at the center). Rebuild deferred per PO ("we will build it later") · highest-priority S-KG work item. Route `/knowledge-graph` · `MASTER.md` shell. (CL-094 / CL-096 / CL-097 / CL-104 / CL-110 / CL-113) |

### Documentation
| File | Purpose |
|---|---|
| `UC-HO-01_initiate-handover-session_v2.md` | UC-HO-01 v2.0 governance spec. **CL-111 30-day window + successor optional pending in v2 spec refresh.** |
| `UC-HO-02_conduct-ai-guided-voice-interview_v2.md` | UC-HO-02 v2.0 spec (Phase 2) |
| `ARTEEP-master-uc-index.md` | v1.1 · 11 UCs (UC-HO-08 added). UC-ON-01 / UC-ON-02 names need refresh per CL-113 (working names locked; final names pending). |
| `ARTEEP-implementation-plan-v2.md` | V2 with Step Zero, 12-week timeline |
| `QA-INT-01-Dual-Verification-Rule.md` | Foundational governance rule |
| `ARTEEP-design-change-log.md` | Living document — **113 entries** (latest: CL-113) |
| `docs/arteep/ARTEEP-system-overview.md` | Single-document full-view system narrative |
| `Sprint-1-compact.md` | Sprint 1 snapshot (3-phase lifecycle, post-redesign) |
| `ART_EEP_Architecture_Summary_EN.md` | Grill-me session record — Knowledge Lake architecture (source of CL-090–101) |

---

## 10. Design Change Log Summary (CL-001 through CL-113)

113 entries across these major themes. Sections CL-001 through CL-101 are unchanged — see prior commits of this file or the change-log itself for theme summaries.

### UC-HO-04 Manager Review build (CL-102 to CL-103, 2026-06-07)
- Sibling-file pattern for mockup state extraction — main file under ~100KB safe-write threshold, sibling files own state views + decision-panel content (CL-102)
- UC-HO-04 wired into the live `SessionCommandView` as the "Manager review" tab via `embedded` + `state` props; orphan-mockup state resolved; `/m/<slug>` retirement reaffirmed (CL-103)

### Consumer-plane persona expansion (CL-104, 2026-06-07)
- Locked persona set expanded 6 → 9 for the PO's "show how the KG is used internally" requirement
- Four Consumer archetypes locked: newcomer (Trần Hữu Nam) · project peer (Duy Nguyễn) · cross-departmental colleague (Linh Phạm) · upper management (Thảo Vũ)

### POC live-app migration + minimalist redesign (CL-105 to CL-109, 2026-06-07)
- *Propagation to this snapshot pending in a follow-up commit. Summary entries only here for now; full text in the design change log.*
- CL-105 — form fields shown + selectable across POC surfaces, no hidden / disabled fields
- CL-106 — Management-plane surfaces migrated to Trello (implements CL-091 on surfaces that predated it)
- CL-107 — session command view 6 tabs → 2 (Overview + Manager review); explainer text stripped; labels-only style; helper text only on destructive actions
- CL-108 — UC-HO-04 embedded surface cleanup (preview stepper · jargon strip · S1 collapse)
- CL-109 — real Manager review surface for Phương Anh (Sales bundle); supersedes the CL-103 placeholder

### Consumer KG model correction (CL-110, 2026-06-07)
- **Consumer KG default = company-wide GraphRAG**, not single offboarder; an offboarder centered is one filtered lens, not the home screen
- KG spans three streams: (1) extracted from departing employees' sources during handovers; (2) what current employees uploaded themselves; (3) what current employees permitted the system to collect from their own data
- Default canvas is a multi-cluster company map (domain / project / team), no single human at the center
- Filters: offboarder · project · team / department · status (canonical / contested / critical)
- All CL-094 primitives operate over the whole graph, respecting active filter + viewer's ACL
- Existing `knowledge-graph-explorer.jsx` hardcodes Minh as central hub; diverges from this model; rebuild deferred per PO ("we will build it later")

### Offboarding window policy (CL-111, 2026-06-08)
- Standard **30-day offboarding window** locked from policy
- **Review / handover deadline 3–5 days before last day** — admin + offboarder verify the captured bundle together before departure
- **Successor optional** — sessions render **"to be assigned"** when none is named
- **Khánh Linh Trần (2-day urgent · EX.2)** is the explicit short-notice exception
- Canonical demo timeline: Minh — Jul 4 / review Jun 30 / 26 days · successor Trần · Phương Anh — Jun 20 / review Jun 16 / 12 days · successor "to be assigned" · Khánh Linh — 2 days · successor "to be assigned"
- Applied to `ha-vy-handover-dashboard.jsx` · `session-command-view.jsx` / `prepare-stage.jsx` / `uc-ho-01-quick-initiate.jsx` propagation pending

### Review-unit terminology (CL-112, 2026-06-08)
- Review unit standardized to **"items"** everywhere (was "sections" on Phương Anh's surface) — the umbrella that covers captured answers, uploads, and flag fixes
- Post-commit KG node count renamed **"entries"** on the dashboard so "items" no longer carries two meanings at two scales (14 review items vs 487 KG entries)
- UC-HO-04 S1 arrival tiles reconciled to sum to 14 — added a fifth "Uploaded files (3)" tile; `SESSION.filesTotal` corrected 4 → 3 to match the three rendered file rows; "Redirected" item (1) stays excluded from the 14 by design

### Playbook elimination · Consumption plane unification (CL-113, 2026-06-08)
- Playbook artifact eliminated; Consumption plane has one surface (the KG); role-customization at the initial-state layer
- UC-ON-01 reframed as "Generate Newcomer Initial Exploration Prompts" (working name)
- UC-ON-02 reframed as "Explore Knowledge Graph (role-customized)" for all four archetypes
- Resolves CL-104 follow-up #2 (UC-ON-02 single-vs-split) — no playbook to split around
- Phase 3 sub-stage 8 "Playbook delivered" renamed "KG access ready"
- `arteep-s4-onboarding-gen-read.jsx` SUPERSEDED entirely · `knowledge-graph-explorer.jsx` becomes the single Consumer-plane surface

---

## 11. Pending Decisions (Need Stakeholder Input)

### Hackathon vs. Production Mode
- Hackathon-compressed: SZ in 1 week with 2 connectors instead of 8 → total ~11 weeks
- Production-ready: Full SZ as specified → ~12 weeks

### Original V1 Blockers
- CL-003 — Hackathon-compressed vs production mode
- CL-005 — Vietnam PDPA compliance basis for automated scanning
- HO-03 TBD-1 — E-signature standard (Vietnam-specific)
- ~~ON-01 TBD-2 — Static vs interactive Playbook~~ → **OBSOLETE 2026-06-08 (CL-113): no playbook artifact; UC-ON-01 reframed as "Generate Newcomer Initial Exploration Prompts."**
- ON-02 TBD-3 — Mobile parity scope (desktop-first v1 default)
- ~~HO-05 TBD-2 — Manager prompts visible to Offboarder pre-capture~~ → **RESOLVED 2026-06-05 (CL-099): yes — the prompts are the queue the Offboarder answers.**
- ~~HO-06 TBD-1 — SLA for Manager correction review~~ → **RESOLVED 2026-06-05 (CL-095): 2 weekly cycles, then auto-escalate to the Critical path; sign-off still required.**
- ~~Offboarding window + successor model~~ → **RESOLVED 2026-06-08 (CL-111): 30-day standard window · review deadline 3–5 days before last day · successor optional ("to be assigned"). Khánh Linh is the 2-day urgent exception.**

### New — UC-HO-08 (opened 2026-06-05)
- HO-08 TBD-1 — How far the auto-derived connection set reaches (1-hop collaborators only vs N-hop) + manager edit window before send
- HO-08 TBD-2 — Notification channel + reminder cadence for network requests

### New — Consumer-plane persona expansion (opened 2026-06-07 · post-CL-104)
- **Heatmap content definition** — three candidates proposed (Knowledge Hotspots / Skill Density / Risk Heatmap), all mapping onto the existing semantic palette. With Thảo Vũ now the locked actor for the Timeline + Heatmap surface, this needs a CL entry to lock. Owner: BA + Product.
- ~~UC-ON-02 single vs split for 4 archetypes~~ → **RESOLVED 2026-06-08 (CL-113): unified, not split. No playbook for the split to be about; all four archetypes use one UC ("Explore Knowledge Graph · role-customized") with different default lenses.**

### New — Consumer graph rebuild (opened 2026-06-07 · post-CL-110)
- **`knowledge-graph-explorer.jsx` rebuild to the company-wide GraphRAG default** — current build hardcodes Minh as the central hub; diverges from CL-110. Build deferred per PO direction ("we will build it later"). Highest-priority S-KG work item when started. Scope per CL-113 expands to all four archetype initial states on the same surface.

### New — Playbook elimination follow-ups (opened 2026-06-08 · post-CL-113)
- **Newcomer initial-prompt seeding strategy** — 4–6 prompts (working default)? static templates vs LLM-generated at commit time? token-budget implications? The synthesis step at commit time is where this lives. Owner: BA + Product.
- **UC-ON-01 / UC-ON-02 final naming** — working names locked ("Generate Newcomer Initial Exploration Prompts" · "Explore Knowledge Graph · role-customized"); final names to land when the UC spec is rewritten. Owner: BA.

### Step Zero Blockers (Plan v2)
- TBD-Z1 — OAuth scope minimums per connector
- TBD-Z2 — Connector approval workflow + SLA
- TBD-Z3 — Default sync frequency
- TBD-Z4 — Source data retention policy
- TBD-Z5 — Connector deprecation behavior

### Migration Pending
- S2 artifact still uses old amber palette → migrate to violet/yellow when revisited (**S3 done as of 2026-06-07 · S4 superseded entirely by CL-113**)
- S2 artifact could swap remaining `Verified` badges for `CanonicalBadge` where propagation has completed

---

## 12. Key Architectural Files Referenced

The system reads/writes to:
- **Azure Key Vault** — OAuth tokens, API keys (Step Zero secrets management)
- **Microsoft Graph Connectors** — MS-stack source integration platform (scoped to shared workspaces only; email never scanned)
- **Azure AI Search** — Per-source indexes; pre-retrieval ACL trimming (Tier-1 stub exception per CL-093)
- **Cosmos DB Gremlin** — Knowledge Graph; partition-keyed by org; stores per-node `short_summary` for 0-token hover (CL-094)
- **Microsoft Purview** — Mandatory PII gate (no fallback path); fronted by Regex + Few-Shot pre-passes (CL-092)
- **Entra ID** — RBAC; Platform Admin role distinct from Manager; commit-gate signer in UC-HO-04 S8 sign-off (visible in mockup)
- **Azure OpenAI** — GPT-4o-mini (Worker) + GPT-4o (Expert) routing
- **Semantic Kernel** — Orchestrator + Planner Agent

---

## 13. Demo & Pitch Flow (Current)

The hackathon pitch opens with a 10–15 second Step Zero moment ("Before any handover can happen, our Platform Admin configures the integrations once"), demonstrating Z01 → Z02 → Z03. Then transitions to "Now Hà Vy can run a handover session…" and proceeds through the canonical flow:

1. Hà Vy's Dashboard (3 pending sessions on the **30-day offboarding model with deadlines 3–5 days before each last day per CL-111** — Minh (26 days · Jul 4 last day), Phương Anh (12 days · Jun 20 · "to be assigned" successor), Khánh Linh (2 days · urgent exception); 3-phase progress visible · post-commit KG count rendered as "**entries**" per CL-112)
2. One-click initiate session for Minh Lê (quick-initiate page)
3. Command-view Overview tab · Phase 1 Prepare · live seeding from Trello (POC source) — 4-Layer Hard-Filter visibly dropping noise; the system fans out **network knowledge requests** (UC-HO-08) to Minh Lê's auto-derived connections (Duy, Linh, and others)
4. **POC capture** — Minh Lê uploads his files and works through the **question queue** (manager prompts + questions from his network); colleagues' flags on wrong/insufficient AI-collected data arrive as his correction tasks. *(The voice interview is Phase 2.)*
5. Phase 2 transcript/content review with QA-INT-01 inline diff
6. **Manager review tab** (UC-HO-04 · CL-103) — Hà Vy works the **14 items** (CL-112) item-by-item across the 8 states · side-by-side raw vs AI-structured, inline edit, send-back composer, the 3-way pre-commit flag chain (Trần catches AI · Minh corrects · Duy corroborates), bundle summary, **SHA-256 cryptographic sign-off** binding Entra ID identity + immutable audit trail
7. Phase 3 KG Commit propagation (animated commit progress in S8) with Canonical Facts surfaced (Regex + Few-Shot sanitization shown, Purview behind). **Sub-stage 8 "KG access ready"** (renamed per CL-113) — newcomer's initial exploration prompts seeded into the KG view alongside ACL provisioning. The dashboard "This week" panel now reads **487 entries committed** (CL-112).
8. **Consumption plane · four reader archetypes on one surface** (CL-104 + CL-110 + CL-113) — the PO's "how the KG is used internally" beat. **One company-wide GraphRAG KG** (CL-110: multi-cluster · no single human at the center), four default lenses:
   - **Trần Hữu Nam** (newcomer) — opens the KG with his **role-customized initial exploration prompts** seeded by UC-ON-01 ("Where do I start with the auth flow?" · "Who owns the data platform?" · "What's the rollback runbook for billing?"). Canonical badge + lineage drawer visible. Tier-1 locked stub with "Request access" on adjacent restricted nodes.
   - **Duy Nguyễn** (project peer · Data Platform) opens the same KG filtered to cross-team handover context relevant to his query · Progressive Disclosure + Contextual-AI chips
   - **Linh Phạm** (cross-departmental colleague · Product) opens the same KG with adjacent-team filter applied · hits a Tier-1 stub on a Finance node and requests access
   - **Thảo Vũ** (upper management · Engineering Director) opens the Timeline + Heatmap surfaces over the same KG · sees project evolution + risk distribution at her org level
9. Skill Gap analysis (Trần Hữu Nam's growth plan, surfaced from his role-customized KG view)
10. Feedback loop · hallucination reported → node flagged "under review" → token-free triage → Manager reviews → Canonical promotion → propagation

Total runtime: ~3–4 minutes.

**Pitch spine (CL-090 / business value):** *Data Gravity creates Vendor Lock-in.* Two ROI metrics — **Time-to-Productivity** (onboarding 2 months → 2 weeks) and **Tacit Knowledge Capture Rate** (X risk factors + Y undocumented procedures captured before an employee leaves). The Manager review beat (step 6) showcases the QA-INT-01 §1.4 commit gate end-to-end; the four-archetype Consumption beat (step 8) is the PO's internal-KG demonstration — **one company-wide KG, four lenses** (CL-110 + CL-113) — running on Trello-sourced data in the English-only Consumer-plane shell.

---

## 14. To Resume This Project

If picking up where this left off, the next actionable items are:

1. **Build the Knowledge Graph (Consumer plane) · single surface · company-wide GraphRAG default · four-archetype lenses** — `MASTER.md` shell · route `/knowledge-graph` · progressive disclosure, contextual chips, 0-token hover, Timeline + Heatmap, Tier-1/Tier-2 rendering, feedback triage. Per CL-110 the default canvas is the **company-wide GraphRAG** (multi-cluster · no single human at the center), not offboarder-centered; the existing `knowledge-graph-explorer.jsx` diverges (hardcodes Minh) and must be rebuilt, not just refreshed. Scope covers all four Consumer reader archetypes per CL-104 + CL-113 (newcomer with starter prompts · project peer · cross-dept · upper management). **Highest-priority next build** — without it the PO's "show internal KG usage" requirement has no demo evidence.
2. **Build the POC Capture surfaces** — self-serve file upload + the asynchronous question queue + UC-HO-08 network-request fan-out (Prepare stage). POC's replacement for the voice interview; voice (UC-HO-02) is Phase 2 (CL-098–101).
3. **Lock the Heatmap content definition** — three candidates proposed (Knowledge Hotspots / Skill Density / Risk Heatmap); decide which one(s) to ship and how they map onto the semantic palette. Thảo Vũ is the locked actor (CL-104).
4. **Lock the newcomer initial-prompt seeding strategy (post-CL-113)** — how many prompts (4–6 working default), static templates vs LLM-generated at commit time, token-budget implications.
5. **Finalize UC-ON-01 / UC-ON-02 names (post-CL-113)** — working names locked; finalize when the UC spec is rewritten.
6. **Apply CL-111 timeline propagation to remaining mockups** — `session-command-view.jsx`, `prepare-stage.jsx`, `uc-ho-01-quick-initiate.jsx` need the canonical 30-day window + "to be assigned" successor wording applied (dashboard is already done).
7. **Stakeholder approval needed** on the Plan v2 decision points (especially Step Zero blockers) + the two UC-HO-08 TBDs.
8. **Migration sweep** — S2 artifact needs violet/yellow palette migration (S3 done 2026-06-07 · S4 superseded by CL-113 · no migration needed).
9. **S5 build** — UC-ON-03 (Skill Gap), UC-HO-06 (Report Hallucination), UC-HO-07 (Correction Review).
10. **UC-HO-01 v2 governance spec update** — reflect 3-phase lifecycle + data-ingestion governance (CL-015 deprecation) + 30-day window + successor-optional model (CL-111).
11. **UC-HO-08 spec** — author the full use case.
12. **UC-HO-04 spec** — author the full v2 use case to reflect the new mockup.
13. **Master UC index refresh** — UC-ON-01 / UC-ON-02 names per CL-113; UC-HO-04 / UC-HO-08 added per their live builds.
14. **Demo script** — write the 3–4 minute narrative tying all the states together with the 3-phase lifecycle, POC capture, Manager review, and the four-archetype Consumption beat on the single company-wide KG surface.
15. **CL-105 / CL-107 propagation** — this snapshot has propagated CL-110 + CL-111 + CL-112 + CL-113; the remaining 2026-06-07 changes (form-fields-shown rule, 2-tab session view + labels-only style, UC-HO-04 jargon strip, real Phương Anh review surface, Trello live migration) are logged in the design change log but not yet woven into the snapshot sections above. Follow-up commits.

**Canonical artifact for current state:** `uc-ho-04-manager-review.jsx` (+ siblings) for the Manager review surface; `arteep-system-ui-tour.jsx` for the broader QA-INT-01 demo tour; the dashboard + quick-initiate + command-view trio for everything Sprint 1 since 2026-06-02. The POC Capture surfaces and the four-archetype Knowledge Graph (Consumer plane · single surface per CL-113 · company-wide GraphRAG per CL-110) are the next builds.

---

## 15. 2026-06-07 Delta Detail · UC-HO-04 build wrap-up + Consumer-plane persona expansion

This section captures the *full* delta from the 2026-06-07 update lines at the top, kept here as a single block for clean grep-and-recovery. Earlier sections above are updated in place for the most-visited fields (§3 personas, §5 UC list, §6 sprint roadmap, §8 §1.4 commentary, §9 artifact inventory, §10 CL summary, §11 pending decisions, §13 demo flow, §14 next steps). For full per-entry tables of CL-102 / CL-103 / CL-104 see `docs/arteep/ARTEEP-design-change-log.md`.

**UC-HO-04 build completed.** UC-HO-04 Manager Review + Sign-off mockup is fully real across 8 states using the violet/yellow palette. State map:
- S1 · **Arrival** — bundle overview · **14 items · 5 tiles summing to 14** (4 source tiles + Uploaded files (3) tile per CL-112) · pre-review checks panel · recommended review order. `SESSION.filesTotal` corrected 4 → 3 to match three rendered file rows.
- S2 · **Reviewing Manager Priority** — side-by-side raw text vs AI-structured · source provenance strip · network corroboration card
- S3 · **Quick accept** — accepted toast bar · structured pane upgrades to Canonical · post-accept inline actions
- S4 · **Edit inline (CL-086)** — `DelSpan` rose strikethrough + `InsSpan` violet underline · edit-lineage 3-card footer · live audit-trail note
- S5 · **Send back for clarification** — incomplete-answer card · send-back composer with AI-drafted question · urgency selector · source-context panel · impact note
- S6 · **Pre-commit 3-way flag fix** (CL-101) — Atlas rollback narrative · AI wrong → Trần flagged → Minh corrected → Duy corroborated in #data-platform · `AuditChainPreview` with 5-row immutable trail
- S7 · **Bundle summary** — 9/3/2/0 outcome stats · per-category breakdown table · 5-node propagation graph · 3 team-impact cards (Engineering · Sales · Data Platform) · ready-to-sign-off strip
- S8 · **Sign-off (QA-INT-01 §1.4 commit gate)** — SHA-256 anchor card (`8f3a2b9c…d7a5f`) on dark code-style background · signature card with Entra ID verification · 8-step live commit-progress log · done card with KG link · 15-min undo grace

**File layout (CL-102 sibling-file pattern · proven twice).** Main file is `components/mockups/uc-ho-04-manager-review.jsx` (~90KB). Two siblings hold state views + their decision-panel content so each file stays under the ~100KB safe-write threshold:
- `components/mockups/uc-ho-04-s6-flag-fix.jsx` (~28KB) — exports `S6FlagFixView` + `DecisionPanelFlag`
- `components/mockups/uc-ho-04-s7s8-signoff.jsx` (~43KB) — exports `S7BundleSummaryView` + `S8SignOffView` + `DecisionPanelSummary` + `DecisionPanelSignOff`

Main file owns shared scaffolding · `ReviewShell`, `ItemListRail`, `DecisionRail`, `ItemHeader`, `DiffPanes`, `LineageCard`, `ContextStrip`, `BundleProgress`. SESSION constants and `MONO_STACK` are duplicated across siblings (cheap; avoids a shared module). Pattern is now codified for any future mockup that crosses the threshold.

**Live merge (CL-103).** The mockup is no longer an orphan file. Three coordinated wirings:
1. `UCHO04ManagerReview` accepts `embedded` + `state` props on its default export. In `embedded` mode the outer dev chrome (top step-dot bar + footer prev/next) collapses to a single inline `EmbeddedStateStrip`, and `ReviewShell` skips the redundant `ManagementHeader` + `ReviewSubHeader` via React context (those duplicate the `SessionCommandView` Hero + TabBar above).
2. `SessionCommandView` imports `UCHO04ManagerReview`, adds `{ id: "review", label: "Manager review" }` to `TABS`, and renders the embedded view for Minh Lê's session (the only persona with UC-HO-04 wired in for the POC). Other sessions show a friendly placeholder.
3. `app/session/[id]/page.tsx` adds `"review"` to `VALID_TABS` so `/session/minh-le?tab=review` resolves.

All 8 states are reachable via the inline state strip. Standalone behavior is preserved — `embedded={false}` still renders the full dev chrome, useful for any future direct-route use.

**Consumer-plane persona expansion (CL-104).** Locked persona set grows from 6 to 9 in response to the PO requirement to demonstrate how the KG is used internally across the organization. Three additions:
- **Duy Nguyễn** (Senior Data Engineer · Data Platform) — promoted from supporting (already appeared in UC-HO-04 S6 Atlas rollback as the corroborating colleague). Locks the **project peer** Consumer archetype.
- **Linh Phạm** (Product Manager · Product) — new. Locks the **cross-departmental colleague** Consumer archetype; exercises Tier-1 "Request access" affordances (CL-093) on content scoped to other teams.
- **Thảo Vũ** (Engineering Director · Engineering leadership tier) — new. Locks the **upper management** Consumer archetype; **owns the Timeline + Heatmap surface** (CL-094), which had no locked actor previously.

Four-archetype mapping for the Consumer class: newcomer → Trần Hữu Nam · project peer → Duy Nguyễn · cross-departmental colleague → Linh Phạm · upper management → Thảo Vũ.

---

*End of context snapshot. Use this document as the seed for any future ART-EEP session.*
