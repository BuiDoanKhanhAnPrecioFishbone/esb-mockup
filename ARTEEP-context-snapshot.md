# ART-EEP — Project Context Snapshot

*Conversation compaction · 2026-05-22 · Use this as the seed document for any future session.*

---

## 1. Project Overview

**ART-EEP** is an enterprise Knowledge Graph platform for employee handover and onboarding, built on Azure. It captures departing employees' tacit knowledge via AI-guided voice interviews, commits verified content to a knowledge graph, and generates personalized onboarding playbooks for successors with active learning correction loops.

**Hackathon scoring:** 40% Agentic Workflow / 40% Human-in-the-Loop / 20% Token Efficiency

**Primary user / BA / Product Designer:** Tram, based in HCMC, Vietnam.

---

## 2. Locked Architectural Decisions

| Decision | Rationale |
|---|---|
| Semantic Kernel Orchestrator with Planner Agent | Coordinates Worker/Expert routing |
| ComplexityScore-based dynamic Worker/Expert routing | Phi-3/GPT-4o-mini for low complexity, GPT-4o for high |
| Confidence-gate escalation Worker → Expert | Quality control at each tier |
| Pre-retrieval ACL trimming at Azure AI Search + Cosmos DB partition level | Security by design |
| Microsoft Purview as mandatory PII gate (no fallback) | Compliance non-negotiable |
| Cosmos DB Integrated Cache (Redis rejected) | Simpler architecture |
| Section Blueprint primitive for dynamic N-section generation | Avoids hardcoded structure |
| Dynamic N-domain coverage in voice interview | Replaces hardcoded 4 sections |
| GraphRAG dual-strategy retrieval | Combines graph + vector search |
| Atomic KG commit pipeline with rollback | Data integrity |

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

Each persona has different handover material types:
- **Engineering (Minh Lê)**: Jira tickets, Drive files, Email metadata
- **Sales (Phương Anh)**: Salesforce deals, Calendar, Email metadata
- **People Ops (Khánh Linh)**: HR records, Notion policies, Email metadata

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
- Vietnamese system terms preserved in tooltips: "Canonical · Sự thật gốc"

---

## 5. Use Cases (10 + Step Zero)

### Handover (HO)
- **UC-HO-01** Initiate Handover Session
- **UC-HO-02** Conduct AI-Guided Voice Interview (Dynamic N-Domain Coverage)
- **UC-HO-03** Review and Sign Transcript
- **UC-HO-04** Submit Handover Record to Knowledge Graph
- **UC-HO-05** Configure Custom Prompts and Section Blueprints
- **UC-HO-06** Report Hallucination or Error
- **UC-HO-07** Approve Knowledge Graph Correction

### Onboarding (ON)
- **UC-ON-01** Generate Personalized Onboarding Playbook
- **UC-ON-02** Read Playbook with Inline Knowledge Tools
- **UC-ON-03** Skill Gap Analysis and Growth Plan

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
| **S1 Handover Initiation** | 2 weeks | UC-HO-01, UC-HO-05 | COMPLETED (v2 with violet/yellow) |
| **S2 Capture & Verify** | 2 weeks | UC-HO-02, UC-HO-03 | COMPLETED (old amber palette — needs migration) |
| **S3 KG Commit** | 1.5 weeks | UC-HO-04 | COMPLETED (old amber palette) |
| **S4 Onboarding Gen & Read** | 2 weeks | UC-ON-01, UC-ON-02 | COMPLETED (old amber palette) |
| **S5 Skill Gap & Feedback** | 1.5 weeks | UC-ON-03, HO-06, HO-07 | PENDING (also home for QA-INT-01 gap fixes) |
| **S6 Polish & Demo** | 1 week | Cross-cutting | PENDING |

**Total timeline:** ~12 weeks (was ~7–8 in v1; Step Zero added 2 weeks). Hackathon-compressed mode can cut SZ to 1 week with 2 connectors instead of 8.

---

## 7. Step Zero MVP Scope

**4 screens (Z01–Z04)** · **8 curated connectors:**
1. Microsoft 365 (Email + OneDrive + SharePoint + Teams)
2. Google Workspace (Drive + Gmail + Calendar)
3. Jira
4. Salesforce
5. Slack
6. Notion
7. GitHub
8. Generic HRIS (BambooHR/Workday adapter)

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

---

## 9. Artifact Inventory

All files in `/mnt/user-data/outputs/`:

### Code Artifacts (React/JSX)
| File | Status | Notes |
|---|---|---|
| `arteep-s0-component-library.jsx` | CANONICAL | 7 shared components (Provenance Chip, Severity/Confidence/Status Badges, Mask Card, Section Card, Audit Log Tile) |
| `arteep-s1-handover-initiation.jsx` | SUPERSEDED | V1 with old amber palette |
| `arteep-s1-handover-initiation-v2.jsx` | CANONICAL | V2 with violet/yellow palette · 5 screens · 3-persona dashboard |
| `arteep-s2-capture-verify.jsx` | NEEDS MIGRATION | 5 Offboarder screens · old amber palette |
| `arteep-s3-kg-commit.jsx` | NEEDS MIGRATION | Manager Completion Report 4 states · old amber palette |
| `arteep-s4-onboarding-gen-read.jsx` | NEEDS MIGRATION | 5 Onboarder screens · old amber palette |
| `arteep-system-ui-tour.jsx` | **CURRENT CANONICAL DEMO** | 8 features × 3-4 states · violet/yellow · QA-INT-01 fixes integrated |
| `arteep-transactional-gateways.jsx` | CANONICAL (specialized) | 3 states · Vietnamese UI (CL-077 deviation) · Ontology Mapping, Seeding Progress, Glass-Box Editor |

### Documentation
| File | Purpose |
|---|---|
| `UC-HO-01_initiate-handover-session_v2.md` | UC-HO-01 v2.0 with Semantic Kernel, Purview, RBAC, 13 normal course steps |
| `UC-HO-02_conduct-ai-guided-voice-interview_v2.md` | UC-HO-02 v2.0 with dynamic N-domain coverage replacing hardcoded 4 sections |
| `ARTEEP-master-uc-index.md` | All 10 UCs, dependency matrix, 22 TBDs |
| `ARTEEP-implementation-plan.md` | V1 7-sprint roadmap (SUPERSEDED) |
| `ARTEEP-implementation-plan-v2.md` | V2 with Step Zero, 12-week timeline, 24-screen inventory, risk register |
| `QA-INT-01-Dual-Verification-Rule.md` | Foundational governance rule + compliance matrix |
| `ARTEEP-design-change-log.md` | Living document — 86 entries (CL-001 through CL-086) |

---

## 10. Design Change Log Summary (CL-001 through CL-086)

86 entries across these major themes:

### S0 Foundation (CL-001 to CL-010)
English UI · UX writing principles · persona lock · 14-state taxonomy · 2-accent palette · animation budget · 1px borders

### S1 (CL-011 to CL-020)
CTAs advance happy path · "sensitive content" copy · Purview not named in UI · audit log tile reuse

### S2 (CL-021 to CL-033)
Pulsing rings · text mode equal choice · transcript auto-highlight · 4 draft-item badges · Manager flag avatar · sign disabled · auth failure attempts remaining

### S3 (CL-034 to CL-040)
Progress Stage reuse · "Needs your call" not "Disambiguation" · "Up next" front-loaded · skill chips by status · partial commit framed by success

### S4 (CL-041 to CL-053)
Smart preset rationale · custom prompt interpretation before generation · skeleton+typewriter+glow vocabulary · Critical can't hide · inline entity underline · entity mini-card hover · Persistent Copilot Bar · named source chips · spotlight 30% dimming · restricted content explains what+why

### S1 v2 Rebuild (CL-054 to CL-062)
Violet primary + Pastel Yellow palette migration · primary buttons branded · RBAC scope failure state · PII override action · empty section removed · focus rings · AI prompts violet-tinted

### Multi-Persona Dashboard (CL-063 to CL-065)
3 concurrent sessions · source chips inline · critical urgency layered signals (left border + Urgent pill + rose days)

### Plan v2 (CL-066 to CL-073)
Step Zero introduction · 4 MVP screens · Platform Admin persona · 8 MVP connectors · UC refinements · 5 new blockers · 12-week timeline

### System UI Tour (CL-074 to CL-076)
Single navigable artifact · Feedback Loop combines HO-06/HO-07 · skill progress bar two-tone

### Transactional Gateways (CL-077 to CL-079)
Vietnamese UI deviation · 3 entity badge categories (project blue / person gray / concept violet) · low-confidence yellow underline pattern

### QA-INT-01 Adoption (CL-080 to CL-086)
- CL-080 — Rule formally adopted as foundational governance
- CL-081 — Gap A identified: Canonical Fact surface needed
- CL-082 — Gap B identified: Per-item lineage view needed (partial reversal of CL-067)
- CL-083 — Refinement C identified: Inline edit diff visualization
- CL-084 — Gap A resolved: `CanonicalBadge` implemented
- CL-085 — Gap B resolved: `LineageDrawer` implemented
- CL-086 — Refinement C resolved: Inline diff in `DraftItemEditing`

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
- HO-06 TBD-1 — SLA for Manager correction review

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
- **Microsoft Graph Connectors** — MS-stack source integration
- **Azure AI Search** — Per-source indexes; pre-retrieval ACL trimming
- **Cosmos DB Gremlin** — Knowledge Graph; partition-keyed by org
- **Microsoft Purview** — Mandatory PII gate (no fallback path)
- **Entra ID** — RBAC; Platform Admin role distinct from Manager
- **Azure OpenAI** — GPT-4o-mini (Worker) + GPT-4o (Expert) routing
- **Semantic Kernel** — Orchestrator + Planner Agent

---

## 13. Demo & Pitch Flow (Current)

The hackathon pitch opens with a 10–15 second Step Zero moment ("Before any handover can happen, our Platform Admin configures the integrations once"), demonstrating Z01 → Z02 → Z03. Then transitions to "Now Hà Vy can run a handover session…" and proceeds through the canonical flow:

1. Hà Vy's Dashboard (3 pending sessions, urgency visible)
2. Initiate session for Minh Lê
3. Seeding progress with live AI activity feed
4. Minh Lê's voice interview (rose recording rings, AI questions with Manager Priority badges)
5. Review & sign with QA-INT-01 inline diff visible
6. KG Commit with Canonical Facts surfaced
7. Trần Hữu Nam's Day 1 playbook with Canonical badge + clickable lineage drawer
8. Skill Gap analysis
9. Feedback loop: hallucination reported → Manager reviews diff → Canonical promotion → propagation

Total runtime: ~3 minutes.

---

## 14. To Resume This Project

If picking up where this left off, the next actionable items are:

1. **Stakeholder approval needed** on the 6 Plan v2 decision points (especially Step Zero blockers TBD-Z1 through TBD-Z5)
2. **Migration sweep** — S2/S3/S4 artifacts need violet/yellow palette migration
3. **S5 build** — UC-ON-03 (Skill Gap), UC-HO-06 (Report Hallucination), UC-HO-07 (Correction Review) need full per-sprint artifacts (currently only in System UI Tour condensed form)
4. **UC-HO-01 v2.1 update** — incorporate Step Zero references per CL-070
5. **Master UC Index refresh** — reflect Step Zero per CL-072
6. **Demo script** — write the 3-minute narrative tying all the states together

**Canonical artifact for current state:** `arteep-system-ui-tour.jsx` — fully QA-INT-01 compliant with violet/yellow palette.

---

*End of context snapshot. Use this document as the seed for any future ART-EEP session.*
