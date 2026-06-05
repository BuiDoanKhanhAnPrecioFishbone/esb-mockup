# ART-EEP — Project Context Snapshot

*Conversation compaction · 2026-05-22 · Use this as the seed document for any future session.*

*Updated 2026-06-02 · email removed as an automated data source per data-ingestion governance rule; persona material types updated to use approved shared workspaces only.*

*Updated 2026-06-05 · grill-me session on the Automated Handover Knowledge Lake architecture (`ART_EEP_Architecture_Summary_EN.md`). Scope narrowed (Peer Programming removed), Trello selected as the POC showcase source, layered sanitization + hybrid security tiering + Knowledge Graph consumer-plane model adopted, `MASTER.md` scoped to the Consumer plane, English-only showcase. See CL-090–097.*

*Updated 2026-06-05 (later) · POC capture model. Voice interview (UC-HO-02) deferred to Phase 2; POC capture = self-serve upload + an asynchronous question queue; new UC-HO-08 (network knowledge requests) added in the Prepare stage. See CL-098–101.*

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

---

## 3. Personas (6 total — locked)

| Name | Role | Department | Notes |
|---|---|---|---|
| **Hà Vy** | Manager | Engineering | Owns handover sessions; primary actor in UC-HO-01, HO-04, HO-07 |
| **Minh Lê** | Offboarder | Engineering | Canonical demo persona; Senior Backend Engineer |
| **Trần Hữu Nam** | Onboarder | Engineering | Succeeds Minh Lê |
| **Khánh Linh Trần** | Offboarder | People & Culture | Head of People Operations; urgent offboard (2 days) — exercises EX.2 + high PII |
| **Phương Anh Nguyễn** | Offboarder | Sales | Senior Account Executive; demonstrates non-engineering source mix |
| **An Quân Vũ** | Platform Admin / IT | — | NEW (Plan v2 CL-068); owns Step Zero |

Each persona has different handover material types · scoped to approved shared workspaces only:
- **Engineering (Minh Lê)**: Jira tickets, GitHub repos (PR descriptions, commit messages, wiki pages), Google Drive (shared) files. *POC showcase source: Trello (CL-091).*
- **Sales (Phương Anh)**: Salesforce deals, shared Calendar, SharePoint sales-collateral documents
- **People Ops (Khánh Linh)**: HRIS records, Notion policy pages, SharePoint policy archive

Email, personal mailboxes, and private direct messages are excluded from automated collection per the data-ingestion governance rule. Where role-specific context lives in email threads, it surfaces through the POC question queue or manual file upload, not automated scanning.

**POC showcase rendering (CL-097):** within the Consumer-plane POC showcase, persona names render as diacritic-free latinized handles (`Minh Le`, `Ha Vy`, `@minh.le`). Persona identities are unchanged — only the on-screen string is latinized, and no Vietnamese text appears in the showcase.

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
The **Knowledge Graph Consumer plane / POC showcase** uses the `MASTER.md` "AI-Native Minimal" shell as its **presentation layer only** — indigo `#6366F1` primary, glassmorphism cards, light/dark toggle, `rounded-xl`/`2xl`, soft shadows, floating navbar. This does **NOT** apply to the Management / Capture surfaces (dashboard, quick-initiate, command-view), which stay on the locked light-mode system above. The ART-EEP **semantic palette is preserved as the meaning layer everywhere** — rose = critical / locked, yellow = low-confidence / contested, emerald = verified / canonical, violet = AI signal. Same scoping shape as the Transactional Gateways deviations (CL-077 / CL-078).

**English-only showcase (CL-097):** no Vietnamese text appears in the Consumer-plane showcase. The "Canonical · Sự thật gốc" / bilingual-tooltip rule above is overridden within the showcase — Canonical renders in English only ("Canonical" / "Canonical fact"). Usernames are latinized handles (see §3).

---

## 5. Use Cases (11 + Step Zero)

### Handover (HO)
- **UC-HO-01** Initiate Handover Session
- **UC-HO-02** Conduct AI-Guided Voice Interview (Dynamic N-Domain Coverage) — ⏸ **deferred to Phase 2 (out of POC)**
- **UC-HO-03** Review and Sign Transcript
- **UC-HO-04** Submit Handover Record to Knowledge Graph
- **UC-HO-05** Configure Custom Prompts and Section Blueprints *(POC: prompts feed the capture queue)*
- **UC-HO-06** Report Hallucination or Error
- **UC-HO-07** Approve Knowledge Graph Correction
- **UC-HO-08** Solicit Handover Inputs from the Employee's Network — **NEW · Prepare stage (CL-100 / CL-101)**

**POC capture model (CL-098 / CL-099):** the voice interview is Phase 2. In the POC, capture is **self-serve upload + an asynchronous question queue** the Offboarder answers in text — the queue being manager prompts (UC-HO-05) + network questions (UC-HO-08) + the Offboarder's own additions. The captured content is reviewed and signed via UC-HO-03 as before, then committed via UC-HO-04. A pre-commit, ACL-bounded correction loop (UC-HO-08 flags → Offboarder fixes) runs alongside (CL-101).

### Onboarding (ON)
- **UC-ON-01** Generate Personalized Onboarding Playbook
- **UC-ON-02** Read Playbook with Inline Knowledge Tools
- **UC-ON-03** Skill Gap Analysis and Growth Plan

### Consumption plane — Knowledge Graph explorer (NEW · CL-094 / CL-095)
The successor-facing Knowledge Graph explorer is the **Consumption plane** surface (extends UC-ON-02). Interaction model: Progressive Disclosure, Contextual-AI quick-start chips, 0-token hover via stored `short_summary`, Timeline + Heatmap split-screen, Prompt Disambiguation. The feedback loop (UC-HO-06 / UC-HO-07) runs through **token-free triage** with a contested-flag-on-report and the preserved §1.4 commit gate (CL-095). Three-plane architecture is now explicit: **Management** (dashboard / command-view) · **Capture** (POC: upload + question queue + UC-HO-08 network requests; voice interview is Phase 2) · **Consumption** (KG explorer).

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
| **S3 KG Commit** | 1.5 weeks | UC-HO-04 | COMPLETED (old amber palette) |
| **S4 Onboarding Gen & Read** | 2 weeks | UC-ON-01, UC-ON-02 | COMPLETED (old amber palette) |
| **S-KG Consumption plane (NEW)** | TBD | Knowledge Graph explorer (CL-094) · feedback triage (CL-095) | PENDING — next build · target route `/knowledge-graph` · `MASTER.md` shell |
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

---

## 9. Artifact Inventory

All files in `/mnt/user-data/outputs/`:

### Code Artifacts (React/JSX)
| File | Status | Notes |
|---|---|---|
| `arteep-s0-component-library.jsx` | CANONICAL | 7 shared components |
| `arteep-s1-handover-initiation.jsx` | SUPERSEDED | V1 with old amber palette |
| `arteep-s1-handover-initiation-v2.jsx` | SUPERSEDED | V2 with violet/yellow palette; replaced by dashboard + quick-initiate + command-view trio (2026-06-02) |
| `ha-vy-handover-dashboard.jsx` | CURRENT | Multi-session command center · 3-phase progress |
| `uc-ho-01-quick-initiate.jsx` | CURRENT | One-click session creation · progressive-disclosure customize |
| `session-command-view.jsx` | CURRENT | Per-session full-screen tabbed workspace |
| `uc-ho-02-interview-canvas` (Capture plane) | DEFERRED TO PHASE 2 | Voice interview focus-mode surface · retained for Phase 2, not in the POC (CL-098) |
| `arteep-s2-capture-verify.jsx` | NEEDS MIGRATION | 5 Offboarder screens · old amber palette |
| `arteep-s3-kg-commit.jsx` | NEEDS MIGRATION | Manager Completion Report 4 states · old amber palette |
| `arteep-s4-onboarding-gen-read.jsx` | NEEDS MIGRATION | 5 Onboarder screens · old amber palette |
| `arteep-system-ui-tour.jsx` | **CANONICAL DEMO** | 8 features × 3-4 states · violet/yellow · QA-INT-01 fixes integrated |
| `arteep-transactional-gateways.jsx` | CANONICAL (specialized) | 3 states · Vietnamese UI |
| POC Capture surfaces (upload + question queue · UC-HO-08 network requests) | NOT YET BUILT | POC Capture plane · replaces voice interview (CL-099 / CL-100 / CL-101) |
| Knowledge Graph explorer (Consumer plane) | NOT YET BUILT | Next build · `MASTER.md` shell · target route `/knowledge-graph` (CL-094 / CL-096 / CL-097) |

### Documentation
| File | Purpose |
|---|---|
| `UC-HO-01_initiate-handover-session_v2.md` | UC-HO-01 v2.0 governance spec |
| `UC-HO-02_conduct-ai-guided-voice-interview_v2.md` | UC-HO-02 v2.0 spec (Phase 2) |
| `ARTEEP-master-uc-index.md` | v1.1 · 11 UCs (UC-HO-08 added), dependency matrix, TBD register |
| `ARTEEP-implementation-plan-v2.md` | V2 with Step Zero, 12-week timeline |
| `QA-INT-01-Dual-Verification-Rule.md` | Foundational governance rule |
| `ARTEEP-design-change-log.md` | Living document — 101+ entries |
| `Sprint-1-compact.md` | Sprint 1 snapshot (3-phase lifecycle, post-redesign) |
| `ART_EEP_Architecture_Summary_EN.md` | Grill-me session record — Knowledge Lake architecture (source of CL-090–101) |

---

## 10. Design Change Log Summary (CL-001 through CL-101)

101+ entries across these major themes:

### S0 Foundation (CL-001 to CL-010)
English UI · UX writing principles · persona lock · 14-state taxonomy · 2-accent palette · animation budget · 1px borders

### S1 (CL-011 to CL-020)
CTAs advance happy path · "sensitive content" copy · Purview not named in UI · audit log tile reuse
- *Note · CL-015 (email scanning constraint inline) deprecated 2026-06-02 — email is no longer a data source; the inline scope-reminder pattern generalizes to all sources via the data-ingestion governance rule.*

### S2 (CL-021 to CL-033)
Pulsing rings · text mode equal choice · transcript auto-highlight · 4 draft-item badges · Manager flag avatar · sign disabled · auth failure attempts remaining

### S3 (CL-034 to CL-040)
Progress Stage reuse · "Needs your call" not "Disambiguation" · "Up next" front-loaded · skill chips by status · partial commit framed by success

### S4 (CL-041 to CL-053)
Smart preset rationale · custom prompt interpretation · skeleton+typewriter+glow vocabulary · Critical can't hide · inline entity underline · entity mini-card hover · Persistent Copilot Bar · named source chips · spotlight 30% dimming · restricted content explains what+why

### S1 v2 Rebuild (CL-054 to CL-062)
Violet primary + Pastel Yellow palette · primary buttons branded · RBAC scope failure state · PII override action · empty section removed · focus rings · AI prompts violet-tinted

### Multi-Persona Dashboard (CL-063 to CL-065)
3 concurrent sessions · source chips inline · critical urgency layered signals

### Plan v2 (CL-066 to CL-073)
Step Zero introduction · 4 MVP screens · Platform Admin persona · 8 MVP connectors · UC refinements · 5 new blockers · 12-week timeline

### System UI Tour (CL-074 to CL-076)
Single navigable artifact · Feedback Loop combines HO-06/HO-07 · skill progress bar two-tone

### Transactional Gateways (CL-077 to CL-079)
Vietnamese UI deviation · 3 entity badge categories · low-confidence yellow underline pattern

### QA-INT-01 Adoption (CL-080 to CL-086)
Foundational governance rule · 3 gaps remediated (`CanonicalBadge`, `LineageDrawer`, inline diff)

### S1 Redesign (CL-087 to CL-089, 2026-06-02)
- Drawer pattern (480px right-side) replaced with dedicated full-screen command-view route at `/session/[id]`
- 8-stage lifecycle compressed to 3 user-facing phases (Prepare · Capture · Deliver) for cognitive simplicity
- One-click quick-initiate pattern replaces multi-step wizard
- Email removed as automated data source; CL-015 deprecated and replaced with general data-ingestion governance pattern

### Knowledge Lake Architecture (CL-090 to CL-097, 2026-06-05)
- Scope narrowed to the Handover Knowledge Lake; Peer Programming removed (CL-090)
- Flexible multi-source model retained; Trello = POC showcase source; 4-Layer Hard-Filter as a source-agnostic contract (CL-091)
- Layered sanitization Regex → Few-Shot → Purview, Purview not replaced (CL-092)
- Hybrid security tiering: Tier-2 ghost / Tier-1 metadata stub exception to ACL trimming (CL-093)
- Knowledge Graph consumer-plane interaction model: progressive disclosure, contextual chips, 0-token hover, Timeline + Heatmap, prompt disambiguation (CL-094)
- Feedback triage: contested-flag-on-report, commit gate (§1.4) preserved, 2-cycle SLA escalation; resolves HO-06 TBD-1 (CL-095)
- `MASTER.md` scoped to the Consumer plane as presentation shell (CL-096)
- English-only POC showcase; latinized usernames (CL-097)

### POC Capture Model (CL-098 to CL-101, 2026-06-05)
- Voice interview (UC-HO-02) deferred to Phase 2; out of POC scope (CL-098)
- POC capture = self-serve upload + asynchronous question queue (CL-099); resolves HO-05 TBD-2 for the POC
- Network knowledge requests in Prepare = new UC-HO-08; auto-derived, manager-editable connection set solicits questions + data flags (CL-100)
- Pre-commit, network-driven, ACL-bounded data-flag correction loop — sibling of CL-095 (CL-101)

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

### Step Zero Blockers (Plan v2)
- TBD-Z1 — OAuth scope minimums per connector
- TBD-Z2 — Connector approval workflow + SLA
- TBD-Z3 — Default sync frequency
- TBD-Z4 — Source data retention policy
- TBD-Z5 — Connector deprecation behavior

### Migration Pending
- S2/S3/S4 artifacts still use old amber palette → migrate to violet/yellow when revisited
- S2/S3/S4 artifacts could swap remaining `Verified` badges for `CanonicalBadge` where propagation has completed

---

## 12. Key Architectural Files Referenced

The system reads/writes to:
- **Azure Key Vault** — OAuth tokens, API keys (Step Zero secrets management)
- **Microsoft Graph Connectors** — MS-stack source integration platform (scoped to shared workspaces only; email never scanned)
- **Azure AI Search** — Per-source indexes; pre-retrieval ACL trimming (Tier-1 stub exception per CL-093)
- **Cosmos DB Gremlin** — Knowledge Graph; partition-keyed by org; stores per-node `short_summary` for 0-token hover (CL-094)
- **Microsoft Purview** — Mandatory PII gate (no fallback path); fronted by Regex + Few-Shot pre-passes (CL-092)
- **Entra ID** — RBAC; Platform Admin role distinct from Manager
- **Azure OpenAI** — GPT-4o-mini (Worker) + GPT-4o (Expert) routing
- **Semantic Kernel** — Orchestrator + Planner Agent

---

## 13. Demo & Pitch Flow (Current)

The hackathon pitch opens with a 10–15 second Step Zero moment ("Before any handover can happen, our Platform Admin configures the integrations once"), demonstrating Z01 → Z02 → Z03. Then transitions to "Now Hà Vy can run a handover session…" and proceeds through the canonical flow:

1. Hà Vy's Dashboard (3 pending sessions, 3-phase progress visible)
2. One-click initiate session for Minh Lê (quick-initiate page)
3. Command-view Overview tab · Phase 1 Prepare · live seeding from Trello (POC source) — 4-Layer Hard-Filter visibly dropping noise; the system fans out **network knowledge requests** (UC-HO-08) to Minh Lê's auto-derived connections
4. **POC capture** — Minh Lê uploads his files and works through the **question queue** (manager prompts + questions from his network); colleagues' flags on wrong/insufficient AI-collected data arrive as his correction tasks. *(The voice interview is Phase 2.)*
5. Phase 2 transcript/content review with QA-INT-01 inline diff
6. Phase 3 KG Commit with Canonical Facts surfaced (Regex + Few-Shot sanitization shown, Purview behind)
7. Successor's Knowledge Graph explorer (Consumer plane) — Progressive Disclosure → Contextual-AI chips → 0-token hover → Timeline + Heatmap; Tier-1 locked stub with "Request access"
8. Trần Hữu Nam's Day 1 playbook with Canonical badge + lineage drawer
9. Skill Gap analysis
10. Feedback loop · hallucination reported → node flagged "under review" → token-free triage → Manager reviews → Canonical promotion → propagation

Total runtime: ~3–4 minutes.

**Pitch spine (CL-090 / business value):** *Data Gravity creates Vendor Lock-in.* Two ROI metrics — **Time-to-Productivity** (onboarding 2 months → 2 weeks) and **Tacit Knowledge Capture Rate** (X risk factors + Y undocumented procedures captured before an employee leaves). The Knowledge Graph explorer beat (step 7) runs on Trello-sourced data in the English-only Consumer-plane shell.

---

## 14. To Resume This Project

If picking up where this left off, the next actionable items are:

1. **Build the POC Capture surfaces** — self-serve file upload + the asynchronous question queue + UC-HO-08 network-request fan-out (Prepare stage). This is the POC's replacement for the voice interview; voice (UC-HO-02) is Phase 2 (CL-098–101).
2. **Build the Knowledge Graph explorer (Consumer plane)** — `MASTER.md` shell · route `/knowledge-graph` · progressive disclosure, contextual chips, 0-token hover, Timeline + Heatmap, Tier-1/Tier-2 rendering, feedback triage (CL-094–097)
3. **Stakeholder approval needed** on the Plan v2 decision points (especially Step Zero blockers) + the two new UC-HO-08 TBDs
4. **Migration sweep** — S2/S3/S4 artifacts need violet/yellow palette migration
5. **S5 build** — UC-ON-03 (Skill Gap), UC-HO-06 (Report Hallucination), UC-HO-07 (Correction Review) need full per-sprint artifacts
6. **UC-HO-01 v2 governance spec update** — reflect 3-phase lifecycle + data-ingestion governance (CL-015 deprecation)
7. **UC-HO-08 spec** — author the full use case (currently only logged via CL-100 / CL-101 and indexed in the master UC index v1.1)
8. **Demo script** — write the 3–4 minute narrative tying all the states together with the 3-phase lifecycle, POC capture, and the KG explorer visible throughout

**Canonical artifact for current state:** `arteep-system-ui-tour.jsx` — fully QA-INT-01 compliant with violet/yellow palette; Sprint 1 work since 2026-06-02 lives at the dashboard + quick-initiate + command-view trio. The POC Capture surfaces and the Knowledge Graph explorer (Consumer plane) are the next builds (CL-098–101, CL-094).

---

*End of context snapshot. Use this document as the seed for any future ART-EEP session.*
