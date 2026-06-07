# ART-EEP — Project Context Snapshot

*Conversation compaction · 2026-05-22 · Use this as the seed document for any future session.*

*Updated 2026-06-02 · email removed as an automated data source per data-ingestion governance rule; persona material types updated to use approved shared workspaces only.*

*Updated 2026-06-05 · grill-me session on the Automated Handover Knowledge Lake architecture (`ART_EEP_Architecture_Summary_EN.md`). Scope narrowed (Peer Programming removed), Trello selected as the POC showcase source, layered sanitization + hybrid security tiering + Knowledge Graph consumer-plane model adopted, `MASTER.md` scoped to the Consumer plane, English-only showcase. See CL-090–097.*

*Updated 2026-06-05 (later) · POC capture model. Voice interview (UC-HO-02) deferred to Phase 2; POC capture = self-serve upload + an asynchronous question queue; new UC-HO-08 (network knowledge requests) added in the Prepare stage. See CL-098–101.*

*Updated 2026-06-07 · UC-HO-04 Manager Review + Sign-off mockup completed (violet/yellow palette · all 8 states real · S1 Arrival → S8 SHA-256 sign-off). Sibling-file pattern adopted (CL-102) and the mockup wired into the live `SessionCommandView` as the 6th "Manager review" tab (CL-103). See §15 for the full delta and the live route map; the older sections below remain authoritative for everything else.*

*Updated 2026-06-07 (later) · Consumer-plane personas expanded to four archetypes for the PO's "show how the KG is used internally" requirement. Locked persona set grows 6 → 9 with three additions — Duy Nguyễn (promoted from supporting · project peer), Linh Phạm (new · cross-departmental colleague), Thảo Vũ (new · upper management, owns Timeline + Heatmap surface). See CL-104. Open follow-ups: Heatmap content definition and UC-ON-02 single-vs-split for the four reader archetypes.*

---

## 1. Project Overview

**ART-EEP** is an enterprise Knowledge Graph platform for employee handover and onboarding, built on Azure. It captures departing employees' tacit knowledge, commits verified content to a knowledge graph, and generates personalized onboarding playbooks for successors with active learning correction loops. *(Capture is via AI-guided voice interview in Phase 2; in the POC it is self-serve upload + an async question queue — see §2.)*

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
| **3-phase user-facing lifecycle** | Internal 8-stage pipeline grouped as **Prepare · Capture · Deliver** at every glance-level UI view. Reduces cognitive load. |
| **Sibling-file pattern for mockup state extraction (CL-102 · 2026-06-07)** | When a mockup JSX file exceeds ~100KB (the safe-write threshold), extract self-contained state views into sibling files. Main file owns shared scaffolding; siblings own one or more state views + their decision-panel content. First applied to UC-HO-04 (`uc-ho-04-s6-flag-fix.jsx`, `uc-ho-04-s7s8-signoff.jsx`). |
| **Mockups merged into 1 live control (CL-103 · 2026-06-07)** | Standalone mockups under `components/mockups/` are wired into existing live control surfaces (e.g. `SessionCommandView`) as tabs via the `embedded` + `state` props contract — not exposed as separate `/m/<slug>` routes (retired) or new top-level routes. The session command view is the system for per-session work, including Manager review (UC-HO-04). |
| **Consumer-plane four-archetype persona model (CL-104 · 2026-06-07)** | The Consumer class spans **four archetypes** — newcomer (Trần Hữu Nam) · project peer (Duy Nguyễn) · cross-departmental colleague (Linh Phạm) · upper management (Thảo Vũ). Locked persona set expanded 6 → 9 to make the Consumption plane demonstrate how the KG is used internally across the organization, not only by the canonical Onboarder. Heatmap content definition and UC-ON-02 single-vs-split for the four readers are open follow-ups noted at decision time. |

---

## 3. Personas (9 total — locked · four-archetype Consumer model per CL-104)

| Name | Role | Department | Plane | Notes |
|---|---|---|---|---|
| **Hà Vy** | Manager | Engineering | Management | Owns handover sessions; primary actor in UC-HO-01, HO-04, HO-07 |
| **Minh Lê** | Offboarder | Engineering | Capture | Canonical demo persona; Senior Backend Engineer |
| **Trần Hữu Nam** | Successor / Onboarder | Engineering | Consumption (newcomer) | Succeeds Minh Lê; reads the personalized playbook |
| **Khánh Linh Trần** | Offboarder | People & Culture | Capture | Head of People Operations; urgent offboard (2 days) — exercises EX.2 + high PII |
| **Phương Anh Nguyễn** | Offboarder | Sales | Capture | Senior Account Executive; demonstrates non-engineering source mix |
| **An Quân Vũ** | Platform Admin / IT | — | Step Zero | Plan v2 CL-068; owns Step Zero |
| **Duy Nguyễn** *(NEW · CL-104 · promoted from supporting)* | Senior Data Engineer | Data Platform | Consumption (project peer) | Already in UC-HO-04 S6 (Atlas rollback 3-way) as corroborating colleague; now locked as the **project peer** Consumer archetype |
| **Linh Phạm** *(NEW · CL-104)* | Product Manager | Product | Consumption (cross-dept) | **Cross-departmental colleague** archetype; exercises Tier-1 "Request access" (CL-093) on content scoped to other teams |
| **Thảo Vũ** *(NEW · CL-104)* | Engineering Director | Engineering (leadership) | Consumption (upper mgmt) | **Upper-management** archetype; **owns the Timeline + Heatmap surface** (CL-094) — the locked actor that was missing |

**Four Consumer archetypes mapped to personas (CL-104):**

| Archetype | Persona | Primary read pattern |
|---|---|---|
| Newcomer | Trần Hữu Nam | Personalized playbook (UC-ON-02) |
| Project peer | Duy Nguyễn | Cross-team handover context · UC-HO-08 corroboration |
| Cross-departmental colleague | Linh Phạm | Researching adjacent team work · Tier-1 stub + Request access |
| Upper management | Thảo Vũ | Timeline + Heatmap surfaces (CL-094) · project evolution + risk tracking |

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

### Onboarding (ON)
- **UC-ON-01** Generate Personalized Onboarding Playbook
- **UC-ON-02** Read Playbook with Inline Knowledge Tools *(per CL-104, may need to extend or split to serve all four Consumer archetypes — open follow-up)*
- **UC-ON-03** Skill Gap Analysis and Growth Plan

### Consumption plane — Knowledge Graph explorer (NEW · CL-094 / CL-095 · four-archetype reader model per CL-104)
The Knowledge Graph explorer is the **Consumption plane** surface (extends UC-ON-02). Interaction model: Progressive Disclosure, Contextual-AI quick-start chips, 0-token hover via stored `short_summary`, Timeline + Heatmap split-screen, Prompt Disambiguation. The feedback loop (UC-HO-06 / UC-HO-07) runs through **token-free triage** with a contested-flag-on-report and the preserved §1.4 commit gate (CL-095). Three-plane architecture is now explicit: **Management** (dashboard / command-view, with UC-HO-04 inline as the Manager review tab) · **Capture** (POC: upload + question queue + UC-HO-08 network requests; voice interview is Phase 2) · **Consumption** (KG explorer).

**Four reader archetypes (CL-104).** The Consumption plane serves four locked personas with distinct read patterns: Trần Hữu Nam (newcomer · playbook-first), Duy Nguyễn (project peer · cross-team handover context), Linh Phạm (cross-departmental colleague · researching adjacent team work via Tier-1 stub + Request access), and Thảo Vũ (upper management · Timeline + Heatmap surfaces for project evolution and risk tracking). The Heatmap content (Knowledge Hotspots · Skill Density · Risk Heatmap or a subset) is an open follow-up.

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
| **S1 Handover Initiation** | 2 weeks | UC-HO-01, UC-HO-05 | COMPLETED (v2 with violet/yellow; redesigned 2026-06-02 to 3-phase + drawer→command-view + one-click initiation) |
| **S2 Capture & Verify** | 2 weeks | UC-HO-02, UC-HO-03 | COMPLETED (old amber palette — needs migration). **POC: voice interview deferred to Phase 2 (CL-098); capture = self-serve upload + question queue (CL-099). New surfaces pending.** |
| **S3 KG Commit · UC-HO-04** | 1.5 weeks | UC-HO-04 Manager Review + Sign-off | **COMPLETED 2026-06-07 with violet/yellow palette.** Mockup at `components/mockups/uc-ho-04-manager-review.jsx` + siblings `uc-ho-04-s6-flag-fix.jsx` + `uc-ho-04-s7s8-signoff.jsx`. All 8 states real (S1 Arrival → S2 Reviewing → S3 Quick accept → S4 Edit inline · CL-086 → S5 Send back → S6 3-way flag fix · CL-101 → S7 Bundle summary · propagation → S8 Sign-off · SHA-256 anchor). Wired into live `/session/[id]` as the **Manager review** tab via CL-103. The old amber `arteep-s3-kg-commit.jsx` is superseded by this build. |
| **S4 Onboarding Gen & Read** | 2 weeks | UC-ON-01, UC-ON-02 | COMPLETED (old amber palette) |
| **S-KG Consumption plane (NEW)** | TBD | Knowledge Graph explorer (CL-094) · feedback triage (CL-095) · **four-archetype reader model (CL-104)** | PENDING — next build · target route `/knowledge-graph` · `MASTER.md` shell. Scope now includes surfaces for all 4 Consumer archetypes: playbook view (Trần Hữu Nam), cross-team query (Duy), cross-dept research with Tier-1 stub (Linh), Timeline + Heatmap (Thảo). |
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
- UC-ON-01 Section Blueprint optionally informed by department-source patterns

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

**§1.4 surfaced in UC-HO-04 (2026-06-07):** the S8 state of the new Manager Review mockup renders the commit gate as a SHA-256 cryptographic anchor (`8f3a2b9c…d7a5f` preview) bound to Hà Vy's Entra ID identity, with a visible 15-min undo grace window before the audit trail becomes immutable. Live commit progress shows hash validation → ACL trim → Purview gate → Cosmos writes → Verified edges → playbook propagation → Slack notifications → audit log entry. Surfaces §1.4 + §2.3 in one screen.

---

## 9. Artifact Inventory

### Code Artifacts (React/JSX) · live in repo
| File | Status | Notes |
|---|---|---|
| `arteep-s0-component-library.jsx` | CANONICAL | 7 shared components |
| `arteep-s1-handover-initiation.jsx` | SUPERSEDED | V1 with old amber palette |
| `arteep-s1-handover-initiation-v2.jsx` | SUPERSEDED | V2; replaced by dashboard + quick-initiate + command-view trio (2026-06-02) |
| `ha-vy-handover-dashboard.jsx` | CURRENT | Multi-session command center · 3-phase progress |
| `uc-ho-01-quick-initiate.jsx` | CURRENT | One-click session creation · progressive-disclosure customize |
| `session-command-view.jsx` | CURRENT | Per-session tabbed workspace · **6 tabs now: Overview · Stages · Data · Audit log · Settings · Manager review (CL-103)** |
| `uc-ho-04-manager-review.jsx` | **CURRENT (NEW 2026-06-07)** | Sprint 3 Manager Review + Sign-off · 8 states · violet/yellow · `embedded` + `state` props (CL-103) |
| `uc-ho-04-s6-flag-fix.jsx` | **CURRENT (NEW 2026-06-07)** | UC-HO-04 sibling · S6 3-way diff for Atlas rollback flag chain (CL-102) |
| `uc-ho-04-s7s8-signoff.jsx` | **CURRENT (NEW 2026-06-07)** | UC-HO-04 sibling · S7 bundle summary + S8 SHA-256 sign-off (CL-102) |
| `uc-ho-02-interview-canvas` | DEFERRED TO PHASE 2 | Voice interview focus-mode surface · retained for Phase 2, not in the POC (CL-098) |
| `arteep-s2-capture-verify.jsx` | NEEDS MIGRATION | 5 Offboarder screens · old amber palette |
| `arteep-s3-kg-commit.jsx` | **SUPERSEDED 2026-06-07** | Old amber-palette Manager Completion Report 4 states; replaced by `uc-ho-04-manager-review.jsx` trio above |
| `arteep-s4-onboarding-gen-read.jsx` | NEEDS MIGRATION | 5 Onboarder screens · old amber palette |
| `arteep-system-ui-tour.jsx` | **CANONICAL DEMO** | 8 features × 3-4 states · violet/yellow · QA-INT-01 fixes integrated |
| `arteep-transactional-gateways.jsx` | CANONICAL (specialized) | 3 states · Vietnamese UI |
| POC Capture surfaces (upload + question queue · UC-HO-08 network requests) | NOT YET BUILT | POC Capture plane · replaces voice interview (CL-099 / CL-100 / CL-101) |
| Knowledge Graph explorer (Consumer plane) | NOT YET BUILT | Next build · `MASTER.md` shell · target route `/knowledge-graph` · **now scoped to all four Consumer archetypes per CL-104** (CL-094 / CL-096 / CL-097 / CL-104) |

### Documentation
| File | Purpose |
|---|---|
| `UC-HO-01_initiate-handover-session_v2.md` | UC-HO-01 v2.0 governance spec |
| `UC-HO-02_conduct-ai-guided-voice-interview_v2.md` | UC-HO-02 v2.0 spec (Phase 2) |
| `ARTEEP-master-uc-index.md` | v1.1 · 11 UCs (UC-HO-08 added), dependency matrix, TBD register |
| `ARTEEP-implementation-plan-v2.md` | V2 with Step Zero, 12-week timeline |
| `QA-INT-01-Dual-Verification-Rule.md` | Foundational governance rule |
| `ARTEEP-design-change-log.md` | Living document — **104 entries** (latest: CL-104) |
| `docs/arteep/ARTEEP-system-overview.md` | Single-document full-view system narrative |
| `Sprint-1-compact.md` | Sprint 1 snapshot (3-phase lifecycle, post-redesign) |
| `ART_EEP_Architecture_Summary_EN.md` | Grill-me session record — Knowledge Lake architecture (source of CL-090–101) |

---

## 10. Design Change Log Summary (CL-001 through CL-104)

104 entries across these major themes. Sections CL-001 through CL-101 are unchanged — see prior commits of this file or the change-log itself for theme summaries.

### UC-HO-04 Manager Review build (CL-102 to CL-103, 2026-06-07)
- Sibling-file pattern for mockup state extraction — main file under ~100KB safe-write threshold, sibling files own state views + decision-panel content (CL-102)
- UC-HO-04 wired into the live `SessionCommandView` as the 6th "Manager review" tab via `embedded` + `state` props; orphan-mockup state resolved; `/m/<slug>` retirement reaffirmed (CL-103)

### Consumer-plane persona expansion (CL-104, 2026-06-07)
- Locked persona set expanded 6 → 9 for the PO's "show how the KG is used internally" requirement
- Four Consumer archetypes locked: newcomer (Trần Hữu Nam) · project peer (Duy Nguyễn) · cross-departmental colleague (Linh Phạm) · upper management (Thảo Vũ)
- Thảo Vũ unlocks the Timeline + Heatmap surface that CL-094 specified but had no locked actor
- Open follow-ups noted: Heatmap content definition (3 candidates · Knowledge Hotspots / Skill Density / Risk Heatmap) and UC-ON-02 single-vs-split for the four reader archetypes

---

## 11. Pending Decisions (Need Stakeholder Input)

### Hackathon vs. Production Mode
- Hackathon-compressed: SZ in 1 week with 2 connectors instead of 8 → total ~11 weeks
- Production-ready: Full SZ as specified → ~12 weeks

### Original V1 Blockers (still open)
- CL-003 — Hackathon-compressed vs production mode
- CL-005 — Vietnam PDPA compliance basis for automated scanning
- HO-03 TBD-1 — E-signature standard (Vietnam-specific)
- ON-01 TBD-2 — Static vs interactive Playbook
- ON-02 TBD-3 — Mobile parity scope (desktop-first v1 default)
- ~~HO-05 TBD-2 — Manager prompts visible to Offboarder pre-capture~~ → **RESOLVED 2026-06-05 (CL-099): yes — the prompts are the queue the Offboarder answers.**
- ~~HO-06 TBD-1 — SLA for Manager correction review~~ → **RESOLVED 2026-06-05 (CL-095): 2 weekly cycles, then auto-escalate to the Critical path; sign-off still required.**

### New — UC-HO-08 (opened 2026-06-05)
- HO-08 TBD-1 — How far the auto-derived connection set reaches (1-hop collaborators only vs N-hop) + manager edit window before send
- HO-08 TBD-2 — Notification channel + reminder cadence for network requests

### New — Consumer-plane persona expansion (opened 2026-06-07 · post-CL-104)
- **Heatmap content definition** — three candidates proposed (Knowledge Hotspots / Skill Density / Risk Heatmap), all mapping onto the existing semantic palette. With Thảo Vũ now the locked actor for the Timeline + Heatmap surface, this needs a CL entry to lock. Owner: BA + Product.
- **UC-ON-02 single vs split** — extend UC-ON-02 to serve all four Consumer archetypes, or split into UC-ON-02a (Onboarder reads playbook) + UC-ON-02b (general KG consumer exploration)? Owner: BA.

### Step Zero Blockers (Plan v2)
- TBD-Z1 — OAuth scope minimums per connector
- TBD-Z2 — Connector approval workflow + SLA
- TBD-Z3 — Default sync frequency
- TBD-Z4 — Source data retention policy
- TBD-Z5 — Connector deprecation behavior

### Migration Pending
- S2 + S4 artifacts still use old amber palette → migrate to violet/yellow when revisited (**S3 done as of 2026-06-07**)
- S2 + S4 artifacts could swap remaining `Verified` badges for `CanonicalBadge` where propagation has completed

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

1. Hà Vy's Dashboard (3 pending sessions, 3-phase progress visible)
2. One-click initiate session for Minh Lê (quick-initiate page)
3. Command-view Overview tab · Phase 1 Prepare · live seeding from Trello (POC source) — 4-Layer Hard-Filter visibly dropping noise; the system fans out **network knowledge requests** (UC-HO-08) to Minh Lê's auto-derived connections (Duy, Linh, and others)
4. **POC capture** — Minh Lê uploads his files and works through the **question queue** (manager prompts + questions from his network); colleagues' flags on wrong/insufficient AI-collected data arrive as his correction tasks. *(The voice interview is Phase 2.)*
5. Phase 2 transcript/content review with QA-INT-01 inline diff
6. **Manager review tab** (UC-HO-04 · CL-103) — Hà Vy works the bundle item-by-item across the 8 states · side-by-side raw vs AI-structured, inline edit, send-back composer, the 3-way pre-commit flag chain (Trần catches AI · Minh corrects · Duy corroborates), bundle summary, **SHA-256 cryptographic sign-off** binding Entra ID identity + immutable audit trail
7. Phase 3 KG Commit propagation (animated commit progress in S8) with Canonical Facts surfaced (Regex + Few-Shot sanitization shown, Purview behind)
8. **Consumption plane · four reader archetypes** (CL-104) — the PO's "how the KG is used internally" beat:
   - **Trần Hữu Nam** (newcomer) opens his personalized Day 1 playbook · Canonical badge + lineage drawer · Tier-1 locked stub with "Request access"
   - **Duy Nguyễn** (project peer · Data Platform) queries the KG for context on a Minh handover item · Progressive Disclosure + Contextual-AI chips
   - **Linh Phạm** (cross-departmental colleague · Product) researches an adjacent team's work · hits a Tier-1 stub on a Finance node and requests access
   - **Thảo Vũ** (upper management · Engineering Director) opens the Timeline + Heatmap surfaces · sees project evolution + risk distribution at her org level
9. Skill Gap analysis (Trần Hữu Nam's growth plan, surfaced from the playbook)
10. Feedback loop · hallucination reported → node flagged "under review" → token-free triage → Manager reviews → Canonical promotion → propagation

Total runtime: ~3–4 minutes.

**Pitch spine (CL-090 / business value):** *Data Gravity creates Vendor Lock-in.* Two ROI metrics — **Time-to-Productivity** (onboarding 2 months → 2 weeks) and **Tacit Knowledge Capture Rate** (X risk factors + Y undocumented procedures captured before an employee leaves). The Manager review beat (step 6) showcases the QA-INT-01 §1.4 commit gate end-to-end; the four-archetype Consumption beat (step 8) is the PO's internal-KG demonstration, running on Trello-sourced data in the English-only Consumer-plane shell.

---

## 14. To Resume This Project

If picking up where this left off, the next actionable items are:

1. **Build the POC Capture surfaces** — self-serve file upload + the asynchronous question queue + UC-HO-08 network-request fan-out (Prepare stage). This is the POC's replacement for the voice interview; voice (UC-HO-02) is Phase 2 (CL-098–101).
2. **Build the Knowledge Graph explorer (Consumer plane) · now four-archetype** — `MASTER.md` shell · route `/knowledge-graph` · progressive disclosure, contextual chips, 0-token hover, Timeline + Heatmap, Tier-1/Tier-2 rendering, feedback triage. Scope now includes the four Consumer reader surfaces per CL-104 (newcomer / project peer / cross-dept / upper management). (CL-094–097 · CL-104)
3. **Lock the Heatmap content definition** — three candidates proposed (Knowledge Hotspots / Skill Density / Risk Heatmap); decide which one(s) to ship and how they map onto the semantic palette. Thảo Vũ is the locked actor (CL-104).
4. **Resolve UC-ON-02 single-vs-split** — extend the use case to all four reader archetypes, or split into UC-ON-02a (Onboarder) + UC-ON-02b (general consumer exploration)? BA decision.
5. **Stakeholder approval needed** on the Plan v2 decision points (especially Step Zero blockers) + the two UC-HO-08 TBDs.
6. **Migration sweep** — S2 + S4 artifacts need violet/yellow palette migration (**S3 done as of 2026-06-07**).
7. **S5 build** — UC-ON-03 (Skill Gap), UC-HO-06 (Report Hallucination), UC-HO-07 (Correction Review) need full per-sprint artifacts.
8. **UC-HO-01 v2 governance spec update** — reflect 3-phase lifecycle + data-ingestion governance (CL-015 deprecation).
9. **UC-HO-08 spec** — author the full use case (currently only logged via CL-100 / CL-101 and indexed in the master UC index v1.1).
10. **UC-HO-04 spec** — author the full v2 use case to reflect the new mockup (8-state flow · 3-way flag fix · SHA-256 sign-off) — currently logged via CL-102 / CL-103 and built into the live app.
11. **Demo script** — write the 3–4 minute narrative tying all the states together with the 3-phase lifecycle, POC capture, Manager review, and the four-archetype Consumption beat per CL-104.

**Canonical artifact for current state:** `uc-ho-04-manager-review.jsx` (+ siblings) for the Manager review surface; `arteep-system-ui-tour.jsx` for the broader QA-INT-01 demo tour; the dashboard + quick-initiate + command-view trio for everything Sprint 1 since 2026-06-02. The POC Capture surfaces and the four-archetype Knowledge Graph explorer (Consumer plane) are the next builds (CL-098–101, CL-094, CL-104).

---

## 15. 2026-06-07 Delta Detail · UC-HO-04 build wrap-up + Consumer-plane persona expansion

This section captures the *full* delta from the 2026-06-07 update lines at the top, kept here as a single block for clean grep-and-recovery. Earlier sections above are updated in place for the most-visited fields (§3 personas, §5 UC list, §6 sprint roadmap, §8 §1.4 commentary, §9 artifact inventory, §10 CL summary, §11 pending decisions, §13 demo flow, §14 next steps). For full per-entry tables of CL-102 / CL-103 / CL-104 see `docs/arteep/ARTEEP-design-change-log.md`.

**UC-HO-04 build completed.** UC-HO-04 Manager Review + Sign-off mockup is fully real across 8 states using the violet/yellow palette. State map:
- S1 · **Arrival** — bundle overview · 14 items · 4 source tiles · pre-review checks panel · recommended review order
- S2 · **Reviewing Manager Priority** — side-by-side raw text vs AI-structured · source provenance strip · network corroboration card
- S3 · **Quick accept** — accepted toast bar · structured pane upgrades to Canonical · post-accept inline actions
- S4 · **Edit inline (CL-086)** — `DelSpan` rose strikethrough + `InsSpan` violet underline · edit-lineage 3-card footer · live audit-trail note
- S5 · **Send back for clarification** — incomplete-answer card · send-back composer with AI-drafted question · urgency selector · source-context panel · impact note
- S6 · **Pre-commit 3-way flag fix** (CL-101) — Atlas rollback narrative · AI wrong → Trần flagged → Minh corrected → Duy corroborated in #data-platform · `AuditChainPreview` with 5-row immutable trail
- S7 · **Bundle summary** — 9/3/2/0 outcome stats · per-category breakdown table · 5-node propagation graph · 3 team-impact cards (Engineering · Sales · Data Platform) · ready-to-sign-off strip
- S8 · **Sign-off (QA-INT-01 §1.4 commit gate)** — SHA-256 anchor card (`8f3a2b9c…d7a5f`) on dark code-style background · signature card with Entra ID verification · 8-step live commit-progress log · done card with playbook + KG links · 15-min undo grace

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

Open follow-ups noted at CL-104 decision time (deferred to next BA review):
1. **Heatmap content definition.** CL-094 introduced "Timeline + Heatmap split-screen" but never specified Heatmap content. Three candidates proposed by the Microsoft AI prompt review — Knowledge Hotspots (yellow scale · most-queried nodes) · Skill Density (emerald-to-yellow scale · team strengths/gaps) · Risk Heatmap (rose scale · most-flagged nodes). All three map onto the existing semantic palette. Thảo Vũ is the actor that triggers this need.
2. **UC-ON-02 scope.** The use case is currently scoped to the Onboarder reading the playbook. With four reader archetypes, read patterns differ. Decision needed: extend UC-ON-02 to cover all four, or split into UC-ON-02a (Onboarder) + UC-ON-02b (general consumer exploration)?
3. **Demo flow §13.** Updated in this snapshot — step 8 now includes the four-archetype Consumption beat. The demo-script work item in §14 should pick up from this structure.

**Architectural read.** Three planes are now visible end-to-end in the live app · **Management** (dashboard · quick-initiate · command-view with all 6 tabs including Manager review) · **Capture** (POC Capture plane, pending build) · **Consumption** (KG explorer, pending build · now four-archetype per CL-104). The `/m/<slug>` registry is fully retired; per CLAUDE.md, the `app/` directory IS the registry. Future mockups follow the same pattern — they get wired into an existing control surface as a tab, or get a new top-level route under `app/`, never `/m/<slug>`.

---

*End of context snapshot. Use this document as the seed for any future ART-EEP session.*
