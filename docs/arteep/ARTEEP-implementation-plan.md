# ART-EEP — Implementation Plan & Strategy

*Version 1.0 · Sprint 0 Planning Document · Awaiting Approval Before Build*

---

## 1. Executive Summary

**System scope.** 10 Use Cases, 4 distinct module surfaces (Handover, Onboarding, Manager Dashboard, Correction Review), 20 distinct screens, ~14-state taxonomy applied selectively per screen. The critical path is linear (HO-01 → HO-02 → HO-03 → HO-04 → ON-01 → ON-02 → ON-03), but several UCs can be developed in parallel inside the same sprint when they target different surfaces.

**Sprint count.** 6 sprints + 1 foundation week = ~7 weeks of development for a complete MVP. For a hackathon submission specifically, collapse to 4 sprints by mocking integrations (HR sync, Microsoft Graph Connectors, Purview, Whisper) with deterministic fixtures.

**Locked architectural anchors:**
- Semantic Kernel Orchestrator with Planner Agent for routing
- ComplexityScore-based dynamic Worker/Expert assignment
- Pre-retrieval ACL trimming at Azure AI Search + Cosmos DB partition level
- Microsoft Purview as mandatory PII gate (no fallback to unclassified)
- Cosmos DB Integrated Cache over Redis
- Section Blueprint primitive for dynamic N-section generation

---

## 2. Sprint Roadmap

### 2.1 Sprint Table

| Sprint | Duration | UCs Delivered | Surface | Demo-able Output |
|---|---|---|---|---|
| **S0 — Foundation** | 1 week | (none — infra) | DevOps + Design System | Auth working, design tokens shipped, Azure stack provisioned |
| **S1 — Handover Initiation** | 2 weeks | UC-HO-01, UC-HO-05 | Manager Dashboard | Session open + configured + seeded with PII gate visible |
| **S2 — Capture & Verify** | 2 weeks | UC-HO-02, UC-HO-03 | Offboarder workspace | Full voice interview → signed transcript |
| **S3 — KG Commit** | 1.5 weeks | UC-HO-04 | Manager Completion Report | Atomic indexing pipeline runs end-to-end |
| **S4 — Onboarding Gen & Read** | 2 weeks | UC-ON-01, UC-ON-02 | Manager Builder + Onboarder Reader | Playbook configured, generated, read with Copilot + Spotlight Graph |
| **S5 — Skill Gap & Feedback** | 1.5 weeks | UC-ON-03, UC-HO-06, UC-HO-07 | Onboarder Skill Gap, Flag drawer, Manager Diff Review | Active Learning loop closes |
| **S6 — Polish, Pitch, Deploy** | 1 week | (end-to-end) | All surfaces | 3-min demo runs unattended; SLAs met |

### 2.2 Per-Sprint Detail

#### S0 — Foundation (1 week)

*Goal:* infrastructure and design system shipped so all subsequent sprints work in parallel.

Tasks:
- Azure provisioning: Cosmos DB Gremlin, Azure AI Search, Entra ID, Azure OpenAI (GPT-4o + Phi-3 / GPT-4o-mini), Microsoft Purview, APIM, SignalR
- Semantic Kernel Orchestrator scaffolded with Planner Agent stub
- Design system implementation: ZinC tokens, Tailwind config
- Shared components (see §6.2): Provenance Chip, Severity Badge, Verified/Disputed/Low-Confidence badges, Mask Card, Section Card
- Auth flow and RBAC scope resolver
- Audit log infrastructure

#### S1 — Handover Initiation (2 weeks)

*Goal:* Manager can fully kick off a handover session.

UCs: UC-HO-01 (v2.0), UC-HO-05.

Screens delivered: 1, 2, 3, 4, 5 (Manager Dashboard, Session Setup Wizard, Context Seeding Progress, Preliminary Knowledge Map Summary, Prompt Configuration Panel).

Key integrations:
- Microsoft Graph Connectors (Jira, Drive, email metadata)
- Microsoft Purview PII classification gate
- Session-level RBAC scope establishment with audit anchor

Parallelization: 2 frontend devs (Dashboard+Wizard | Prompt Config), 1 backend on Graph Connectors, 1 backend on Purview integration.

Sprint blockers: HO-01 TBD-1 (legal scanning basis), HO-01 TBD-3 (Offboarder rights).

#### S2 — Capture & Verify (2 weeks)

*Goal:* End-to-end voice interview + verification flow.

UCs: UC-HO-02 (v2.0), UC-HO-03.

Screens delivered: 6, 7, 8, 9, 10 (Pre-Interview Briefing, Live Voice Interview, Text Mode, Review Workspace, Sign-off Confirmation).

Key integrations:
- Whisper API for real-time STT (Vietnamese + English)
- Semantic Kernel Planner Agent with ComplexityScore routing
- GraphRAG dual-strategy (Local + DRIFT) over seeded context
- Digital signature mechanism (PIN/biometric)

Risk: highest-risk sprint technically — real-time STT + LLM orchestration + signature compliance converge. Include 3-day buffer.

Sprint blockers: HO-03 TBD-1 (e-signature standard).

#### S3 — KG Commit (1.5 weeks)

*Goal:* Verified handover record permanently enters the Knowledge Graph.

UCs: UC-HO-04.

Screens delivered: 11 (Manager Completion Report).

Key elements:
- Chunking + entity extraction + relationship resolution
- Atomic KG write (rollback on partial failure)
- Skill taxonomy write
- Cosmos DB Integrated Cache warm-up for hot ego-networks
- Low-confidence entity review panel (AC.1)

Sprint mostly backend; minimal frontend.

#### S4 — Onboarding Generation & Reading (2 weeks)

*Goal:* The hackathon's signature surface.

UCs: UC-ON-01, UC-ON-02.

Screens delivered: 12, 13, 14, 15, 16 (Playbook Builder, Generation Stage, Onboarder Dashboard, Playbook Reading, Full Graph View).

Key elements:
- Section Blueprint primitive
- Persistent Copilot Bar with context chip state machine
- Interactive Graph with Spotlight & Dimming
- Inline Entity mini-cards
- Severity-based auto-expand
- Generation Stage cinematic (the pitch's signature moment)

Parallelization: 2 frontend devs (Builder+Generation | Reader+Graph), 1 backend on Blueprint orchestration.

Sprint blockers: ON-01 TBD-2 (static vs interactive Playbook).

#### S5 — Skill Gap & Feedback Loop (1.5 weeks)

*Goal:* Close the Responsible AI story.

UCs: UC-ON-03, UC-HO-06, UC-HO-07.

Screens delivered: 17, 18, 19, 20 (Skill Gap & Growth Plan, Skill Dispute Panel, Hallucination Feedback Drawer, Correction Review Diff).

Key elements:
- Active Learning Engine wiring (async background queue)
- Skill Intelligence Engine with fuzzy matching (≥0.80 threshold)
- Side-by-side diff with rose/emerald highlighting
- "Ảnh hưởng nếu chấp nhận" downstream impact panel
- Manager escalation flow (SME)

#### S6 — Polish, Pitch, Deploy (1 week)

*Goal:* Demo runs end-to-end without intervention; team is pitch-ready.

Tasks:
- End-to-end demo script with planted scenarios
- Performance tuning to SLAs (Playbook ≤5s, graph ≤3s, Copilot ≤15s, KG ≤10min, generation ≤15min)
- Edge case polish (empty, error, mobile fallback)
- Pitch deck integration
- Audit log + security review

### 2.3 Sprint Risk Register

| Sprint | Risk | Mitigation |
|---|---|---|
| S1 | Microsoft Graph Connectors admin consent delay (2–5 days) | Begin admin consent request in S0 |
| S2 | Whisper API latency variance on Vietnamese audio | Test with real samples in S0; fallback to GPT-4o-Audio if persistent |
| S2 | Digital signature compliance (eIDAS / local) blocker | Decide standard before S2 starts |
| S3 | Cosmos DB Gremlin atomic transaction size limits | Chunk commits, test with realistic record sizes in S0 |
| S4 | Section Blueprint primitive — over-engineering vs under-specifying | Lock Blueprint schema in S3, build against fixed schema |
| S5 | Active Learning Engine is async — easy to demo wrongly | Build with explicit "Refinement queued" UI signal |

---

## 3. Screen Inventory — Master Catalog

| # | Screen | UC | Sprint | Primary Actor | Complexity |
|---|---|---|---|---|---|
| 1 | Manager Dashboard — Pending Sessions | HO-01 | S1 | Manager | Low |
| 2 | Session Setup Wizard | HO-01 | S1 | Manager | Medium |
| 3 | Context Seeding Progress | HO-01 | S1 | Manager | Low |
| 4 | Preliminary Knowledge Map Summary | HO-01 | S1 | Manager | Medium |
| 5 | Prompt Configuration Panel | HO-05 | S1 | Manager | Medium |
| 6 | Pre-Interview Briefing | HO-02 | S2 | Offboarder | Low |
| 7 | Live Voice Interview | HO-02 | S2 | Offboarder | High |
| 8 | Text Mode Interview | HO-02 | S2 | Offboarder | Medium |
| 9 | Review Workspace (split-screen) | HO-03 | S2 | Offboarder | High |
| 10 | Sign-off Confirmation Modal | HO-03 | S2 | Offboarder | Low |
| 11 | Manager Completion Report | HO-04 | S3 | Manager | Low |
| 12 | Playbook Builder | ON-01 | S4 | Manager | High |
| 13 | Generation Stage | ON-01 | S4 | Manager | High |
| 14 | Onboarder Dashboard | ON-02 | S4 | Onboarder | Low |
| 15 | Playbook Reading (split-screen) | ON-02 | S4 | Onboarder | High |
| 16 | Full Graph View | ON-02 | S4 | Onboarder | Medium |
| 17 | Skill Gap & Growth Plan | ON-03 | S5 | Onboarder | Medium |
| 18 | Skill Dispute Panel | ON-03 | S5 | Onboarder | Low |
| 19 | Hallucination Feedback Drawer | HO-06 | S5 | Onboarder/Offboarder | Medium |
| 20 | Correction Review Diff | HO-07 | S5 | Manager | Medium |

---

## 4. State Taxonomy

| ID | State | When It Appears | Visual Treatment |
|---|---|---|---|
| S-1 | Cold Start | First encounter, no data exists yet | Empty composition + primary CTA + onboarding hint |
| S-2 | Happy Path | Normal successful flow | Default rendering, no warnings |
| S-3 | Loading | Async work in progress | Skeleton shimmer + status label |
| S-4 | Generation | LLM/Agent producing content | Progressive reveal + agent activity hint |
| S-5 | Empty (post-init) | UI initialized but no items yet | Neutral empty illustration + secondary CTA |
| S-6 | Error (recoverable) | System error, retry available | Inline error + retry affordance, preserves state |
| S-7 | RBAC-Masked | Content blocked by permissions | Lock icon + access-request CTA + blur preview |
| S-8 | Disputed | User flagged AI content under review | `⚠️ Disputed` badge + neutral styling |
| S-9 | Verified | Human-approved content | `✅ Verified` badge + emerald accent (sparingly) |
| S-10 | Low Confidence | AI uncertain about output | `⚠️ Low Confidence` badge + amber warning |
| S-11 | Paused | User-initiated pause | Checkpoint state + resume CTA |
| S-12 | Overdue | Deadline missed | Critical banner + escalation CTA |
| S-13 | Partial / Fallback | Operating without full data | `Partial Mode` chip + degraded-confidence notice |
| S-14 | Locked | Pre-condition missing, UC not unblocked | Greyed + "Requires X to complete first" |

---

## 5. Screen × State Matrix

### High-Complexity Screens

#### Screen 7 — Live Voice Interview (HO-02)
**Key specifications:**
- Pulsing concentric ring mic indicator (one of only 2 animations in entire system)
- Current AI question card with `AI hỏi` label
- Live transcription card with blinking cursor at end
- Progress indicator `Câu hỏi 7/15`
- Mono-typed recording timer `12:34`
- Pause / End Interview controls
- Soft warning banner at 40-min mark
- Subtle domain coverage progress indicator
- Manager Priority Question injection point (AC.3)

**States applicable:** S-2 Happy Path · S-3 Loading (Whisper retry) · S-6 Error (mic failure EX.1) · S-11 Paused (AC.1) · S-13 Partial (EX.4 Low Context fallback)

#### Screen 9 — Review Workspace (HO-03)
**Key specifications:**
- Split-screen (transcript left / draft summary right)
- Audio playback control (inline, no page reload)
- Source-link chip on every draft item linking to transcript segment
- Inline edit affordance per item
- `✏️ Edited` and `✍️ Manually Added` badges
- Manager flag callouts with timestamp (AC.3)
- Save & Exit / Approve & Sign CTAs (Sign disabled until Manager flags resolved)
- 4 dynamic sections matching the N domains covered in HO-02

**States applicable:** S-2 Happy Path · S-3 Loading · S-6 Error (load failure EX.3) · S-11 Paused (AC.4) · S-12 Overdue (EX.1) · S-14 Locked (signature pending until flags resolved)

#### Screen 12 — Playbook Builder (ON-01)
**Key specifications:**
- Knowledge Layer Ready chip in header
- Smart Preset cards (ranked by relevance) with one-line rationale
- Section count estimate per preset
- Custom Prompt composer with inline AI assist showing interpreted scope BEFORE generation
- Custom Prompt chips (pill-shaped) below composer
- Audience & Scope panel
- Running counter (modules + total sections planned)
- Generate Playbook CTA (single primary action)

**States applicable:** S-1 Cold Start (no presets matched — Discovery Mode) · S-2 Happy Path · S-3 Loading (preset matching) · S-7 RBAC-Masked (out-of-scope custom prompt rejection — EX.3)

#### Screen 13 — Generation Stage (ON-01)
**Key specifications:**
- Vertical stack of Section Card placeholders (one per Section Blueprint)
- Per-card state transitions: Pending → Retrieving → Drafting → Refining → Complete
- Skeleton shimmer animation during Retrieving
- Typewriter reveal during Drafting
- Completion glow fade (~600ms ease-out) on Complete
- Agent Activity log (plain-English status lines, no model names)
- Final summary banner with severity counts and source attribution

**States applicable:** S-4 Generation (the entire screen IS this state) · S-6 Error (per-section retry EX.4) · S-13 Partial (Worker Agent degraded mode EX.5)

#### Screen 15 — Playbook Reading (ON-02)
**Key specifications:**
- Left panel (45%): Playbook with N dynamic tabs, scroll-spy nav, progressive disclosure
- Severity-based auto-expand: Critical items expanded by default; others collapsed
- Right panel (55%): Interactive Graph with Spotlight & Dimming
- Persistent Copilot Bar at bottom with context chip
- Inline Entity mini-cards (hover, no click required)
- Provenance Chip on every section header
- ⚠️ Flag affordance on every AI-generated passage
- Confidence badges (Verified / Low Confidence) inline

**States applicable:** S-2 Happy Path · S-3 Loading · S-6 Error (load fail EX.1) · S-7 RBAC-Masked (EX.4) · S-8 Disputed (per-passage post-flag) · S-9 Verified (per-passage default) · S-10 Low Confidence (per-passage when sparse data)

### Medium-Complexity Screens

| # | Screen | States | Key Specs Summary |
|---|---|---|---|
| 2 | Session Setup Wizard | S-2, S-3, S-6 | Session Details + Review Deadline + Data Sources checklist + Focus Note |
| 4 | Preliminary KG Map | S-2, S-13, S-7 | Activity summary, Purview exclusion count visible (content not), knowledge gaps |
| 5 | Prompt Configuration | S-1, S-2, S-3, S-6 (EX.1), S-14 (EX.2) | AI-generated prompts + Manager priority prompts + priority levels |
| 8 | Text Mode Interview | S-2, S-13 | Chat-style fallback for AC.2 |
| 16 | Full Graph View | S-2, S-3, S-7 | Pan/zoom/filter expanded canvas, Spotlight preserved |
| 17 | Skill Gap & Growth Plan | S-1, S-2, S-13 (EX.2), S-14 (EX.1) | Overlay bars (required vs current) + 3 summary cards + course list |
| 19 | Hallucination Drawer | S-2, S-3, S-8 (post-submission) | Side-drawer anchored to source passage, error type dropdown |
| 20 | Correction Review Diff | S-2, S-6, S-8 (during), S-9 (post-approval) | Side-by-side with rose/emerald highlighting + impact panel |

### Low-Complexity Screens

Screens 1 (Manager Dashboard), 3 (Seeding Progress), 6 (Briefing), 10 (Sign-off Modal), 11 (Completion Report), 14 (Onboarder Dashboard), 18 (Skill Dispute) — all use S-2 Happy Path + S-3 Loading + S-6 Error as their primary state palette.

---

## 6. Cross-Cutting Concerns

### 6.1 Pre-Build Decision Blockers

| TBD | UC | Blocks | Decision Required | Owner |
|---|---|---|---|---|
| HO-01 TBD-1 | HO-01 | **S1 blocker** | Legal basis for automated scanning | Legal |
| HO-01 TBD-3 | HO-01 | **S1 blocker** | Offboarder rights to view Knowledge Map | Legal / HR |
| HO-03 TBD-1 | HO-03 | **S2 blocker** | E-signature standard (eIDAS or local) | Legal |
| HO-02 TBD-1 | HO-02 | S2 preferred | 45-min target — soft or enforced | Product |
| ON-01 TBD-2 | ON-01 | **S4 blocker** | Static vs interactive Playbook delivery | Product / UX |
| ON-02 TBD-3 | ON-02 | S4 preferred | Mobile parity scope — v1 or v2 | Product / UX |
| HO-06 TBD-1 | HO-06 | S5 preferred | SLA for Manager correction review | HR |
| ON-03 TBD-2 | ON-03 | S5 preferred | Auto-finalization labor compliance | Legal / HR |

5 hard blockers, 4 preferred-decided.

### 6.2 Shared Components (build in S0)

| Component | Used In Screens | Description |
|---|---|---|
| **Provenance Chip** | 11, 13, 15, 19 | Left-edge accent stripe + 3-side hairline; shows AI source |
| **Severity Badge** | 9, 13, 15, 17 | Critical (rose) / High (amber) / Medium / Low |
| **Verified Badge** | 9, 11, 15, 20 | `✅ Đã xác thực` emerald-tinted |
| **Disputed Badge** | 15, 19, 20 | `⚠️ Disputed` neutral-tinted during review |
| **Low Confidence Badge** | 13, 15 | `⚠️ Low Confidence` amber warning |
| **Mask / Lock Card** | 4, 15, 16 | RBAC denial with access-request CTA |
| **Section Card** | 9, 13, 15 | The most-reused complex component; auto-expand for Critical |

### 6.3 Demo Dataset (S6 prerequisite)

For the pitch demo to run end-to-end:
- Synthetic Offboarder "Minh Lê" with seeded context, completed interview, signed transcript, indexed KG
- Synthetic Onboarder "Trần Hữu Nam" with skill profile, generated Playbook, partial reading progress
- One planted hallucination Nam has flagged
- Manager "Hà Vy" with pending correction in queue
- Scenario context strip at top of each screen for audience orientation

---

## 7. Design Change Log Template

To be maintained in Step 2 onward as a separate artifact.

| Date | Sprint | Change | UC Reference | Why | Decided By |
|---|---|---|---|---|---|
| YYYY-MM-DD | Sx | (description) | UC-XX-YY step Z | (rationale) | (role) |

Categories: BA gap discovered · UX refinement maintaining UC fidelity · Visual system extension · Performance trade-off · Scope deferral.

---

## 8. Approval Gate

This plan locks until the items below are confirmed:

1. **Sprint count and duration** (6 sprints + S0, ~7 weeks) — or compressed hackathon variant?
2. **Sprint blocker decisions** — 5 hard blockers need owner assignment before S1
3. **Hackathon vs Production mode** — mock integrations or real?
4. **Demo dataset personas** — confirm Minh Lê / Trần Hữu Nam / Hà Vy as canonical
5. **State taxonomy** — 14 states sufficient, or do we need extension?

---

*Plan prepared for ART-EEP build kick-off.*
*Skill developed by **Phúc NT** · BA Zone · Digital School*
