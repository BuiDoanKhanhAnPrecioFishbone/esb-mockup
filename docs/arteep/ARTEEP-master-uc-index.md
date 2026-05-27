# ART-EEP — Master Use Case Index

*Version 1.0 · BA Authoritative Reference · Consolidates all Use Cases across the Handover (HO) and Onboarding (ON) modules.*

---

## 0. Reading This Document

This index is the single navigation layer over the 10 individual Use Case Specifications that define ART-EEP. It does not replace the full UC documents — it makes them addressable. Every claim in this index is traceable back to a numbered step, rule, or condition in one of the underlying UCs.

**Coverage note.** Nine UCs were provided in the current document set: HO-01, HO-03, HO-04, HO-05, HO-06, HO-07, ON-01, ON-02, ON-03. UC-HO-02 (*Conduct AI-Guided Voice Interview*) is referenced as a precondition, postcondition trigger, or include by six of the nine — but its full specification is not in this upload. Its entry in §2 is reconstructed from cross-references and flagged as such; the team should reconcile against the canonical UC-HO-02 spec when available.

---

## 1. System Overview

ART-EEP is an Enterprise Knowledge Graph platform that converts the tacit knowledge of a departing employee (Offboarder) into structured, queryable institutional memory, then uses that memory to personalize the experience of a new employee (Onboarder) into the same role. The system operates through three coordinated capability layers — **Capture** (AI-guided voice interview + human verification), **Commit** (GraphRAG indexing into Cosmos DB Gremlin + Azure AI Search), and **Consume** (personalized Playbook generation + interactive reading + skill gap analysis) — with a closed feedback loop (**Correct**) that allows any user to flag AI-generated content for Manager review and Active Learning refinement.

The ten Use Cases below decompose this end-to-end flow into individually testable, BA-validated specifications.

---

## 2. Use Case Catalog

| ID | Name | Module | Primary Actor | Priority | Frequency | Status |
|---|---|---|---|---|---|---|
| **UC-HO-01** | Initiate Handover Session | Handover | Manager | High | 5–20/month | ✅ Spec available |
| **UC-HO-02** | Conduct AI-Guided Voice Interview | Handover | Offboarder | High | 5–20/month | ⚠️ Spec not in this upload — reconstructed from references |
| **UC-HO-03** | Review and Approve Handover Transcript | Handover | Offboarder | High | 5–20/month | ✅ Spec available |
| **UC-HO-04** | Submit Handover Record to Knowledge Graph | Handover | System (auto) | High | 5–20/month | ✅ Spec available |
| **UC-HO-05** | Configure Handover Interview Prompts | Handover | Manager | Medium | 0–3/session | ✅ Spec available |
| **UC-HO-06** | Report AI Hallucination in Handover Content | Handover | Offboarder / Onboarder | Medium | 1–5/session | ✅ Spec available |
| **UC-HO-07** | Approve Knowledge Graph Correction | Handover | Manager | Medium | 1–5/Manager/month | ✅ Spec available |
| **UC-ON-01** | Generate Personalized Onboarding Playbook | Onboarding | System (auto) | High | 5–20/month | ✅ Spec available |
| **UC-ON-02** | View and Navigate Onboarding Playbook | Onboarding | Onboarder | High | 3–10/Onboarder | ✅ Spec available |
| **UC-ON-03** | Receive Skill Gap Analysis and Growth Plan | Onboarding | Onboarder | Medium | 1×/onboarding | ✅ Spec available |

---

## 3. End-to-End Lifecycle

The flow below traces the canonical journey of a single knowledge record from the moment an employee gives notice through the eventual continuous-improvement loop.

```
                    ┌──────────────────────────────────────────┐
                    │  CAPTURE  (Offboarding · 1–2 weeks)      │
                    └──────────────────────────────────────────┘
                                       │
   UC-HO-01 ───► UC-HO-05  (optional, Manager steers)
   Initiate         Configure
   Session          Prompts
       │               │
       └───────┬───────┘
               ▼
        UC-HO-02   (Voice Interview · 30–60 min)
        Conduct
               │
               ▼
        UC-HO-03   (Offboarder reviews + signs · ≤3 business days)
        Review &
        Approve
               │
               ▼
                    ┌──────────────────────────────────────────┐
                    │  COMMIT  (Automated · ~10 min SLA)       │
                    └──────────────────────────────────────────┘
                                       │
        UC-HO-04   (System indexes to Knowledge Graph)
        Submit to KG
               │
               ▼
                    ┌──────────────────────────────────────────┐
                    │  CONSUME  (Onboarding · 30–90 days)      │
                    └──────────────────────────────────────────┘
                                       │
        UC-ON-01   (System generates Playbook + Skill Gap)
        Generate
               │
               ├───────────┬───────────┐
               ▼           ▼           ▼
        UC-ON-02      UC-ON-03    [Manager review]
        View &        Skill Gap
        Navigate      & Growth Plan
               │           │
               └─────┬─────┘
                     │
                     ▼
                    ┌──────────────────────────────────────────┐
                    │  CORRECT  (Continuous · ongoing)         │
                    └──────────────────────────────────────────┘
                                       │
        UC-HO-06   (User flags AI content as incorrect)
        Report
        Hallucination
               │
               ▼
        UC-HO-07   (Manager approves / rejects / escalates)
        Approve KG
        Correction
               │
               ▼
        ◄── Active Learning loop feeds back to AI refinement
            and Knowledge Graph node update (UC-HO-04 pipeline)
```

### Stage Timing

| Stage | UCs Involved | Typical Duration | SLA Constraint |
|---|---|---|---|
| Capture | HO-01, HO-05, HO-02, HO-03 | 1–2 weeks | Review ≤3 business days (HO-03) |
| Commit | HO-04 | Automated | ≤10 minutes end-to-end (HO-04 SR) |
| Consume | ON-01, ON-02, ON-03 | First 30 days | Playbook generation ≤15 min (ON-01 SR) |
| Correct | HO-06, HO-07 | Continuous | Manager review ≤5 business days (HO-06 EX.1) |

---

## 4. Actor Responsibility Matrix

The table below counts every appearance of each actor across all 10 UCs, distinguishing primary (drives the use case) from secondary (supporting / notified / impacted).

| Actor | Primary In | Secondary In | Total Touchpoints |
|---|---|---|---|
| **Manager** | HO-01, HO-05, HO-07 | HO-03, HO-04, HO-06, ON-01, ON-02, ON-03 | 9 |
| **Offboarder** | HO-02, HO-03, HO-06 | HO-04, HO-07 | 5 |
| **Onboarder** | HO-06, ON-02, ON-03 | ON-01 | 4 |
| **System (auto-triggered)** | HO-04, ON-01 | HO-01, HO-02, HO-03, HO-05, HO-06, HO-07, ON-02, ON-03 | 10 |
| **HR Admin** | — | HO-04 (taxonomy), HO-06 (escalation), ON-03 (taxonomy) | 3 |
| **Subject Matter Expert (SME)** | — | HO-06 (escalation), HO-07 (escalation) | 2 |
| **Platform Admin** | — | HO-03 (EX), HO-04 (EX), HO-06 (EX), HO-07 (EX) | 4 |

### Sub-system / AI Actors

These are technical actors invoked under "System" in the UC docs but warrant explicit tracking for architectural clarity.

| Sub-system | Role | Invoked In |
|---|---|---|
| **Semantic Kernel Orchestrator** | Task decomposition, agent routing, ACL trimming | HO-04, ON-01 |
| **Worker Agent (Phi-3 / GPT-4o-mini)** | Chunking, extraction, structured generation | HO-04 (steps 3–4), ON-01 (Worker Blueprints) |
| **Expert Agent (GPT-4o)** | Synthesis, complex inference | HO-04 (step 6), ON-01 (Expert Blueprints) |
| **GraphRAG Engine** | Local + DRIFT retrieval, graph traversal | HO-04, ON-01, ON-02 |
| **AI Copilot (contextual)** | In-Playbook semantic Q&A | ON-02 |
| **Skill Intelligence Engine** | Fuzzy skill matching, gap computation | ON-01 (step 9), ON-03 |
| **Active Learning Engine** | Correction diff → refinement pipeline | HO-06, HO-07 |
| **Handover AI Agent** | Voice interview question generation | HO-02, HO-05 |

---

## 5. Dependency Matrix

Each row reads: *UC X depends on UC Y* (i.e., Y must complete before X can run).

| Use Case | Depends On (Hard Precondition) | Unblocks (Triggers) | Optionally Includes |
|---|---|---|---|
| UC-HO-01 | — (system entry point) | HO-02, HO-05 | — |
| UC-HO-02 | HO-01 | HO-03 | HO-05 (live prompts via AC.3) |
| UC-HO-03 | HO-02 | HO-04 (on approval) · HO-02 (on rejection AC.1) | — |
| UC-HO-04 | HO-03 (status: `Approved`) | ON-01 | — |
| UC-HO-05 | HO-01 | — (modifies HO-02 queue) | — |
| UC-HO-06 | HO-04 (KG committed) **OR** ON-01 (Playbook generated) | HO-07 | — |
| UC-HO-07 | HO-06 | KG node update + Active Learning queue | — |
| UC-ON-01 | HO-04 | ON-02, ON-03 | — |
| UC-ON-02 | ON-01 | HO-06 (on flag AC.1) | — |
| UC-ON-03 | ON-01 (with Skill Gap Report — not EX.1) | — | — |

### Critical Path

The minimum sequence required for a new Onboarder to receive a verified, personalized Playbook is:

> **HO-01 → HO-02 → HO-03 → HO-04 → ON-01 → ON-02**

Every other UC in the catalog is either (a) optional within this path (HO-05), or (b) downstream enhancement / feedback (HO-06, HO-07, ON-03).

### Feedback Loop

The Active Learning loop is the only cyclic path in the system:

> **UC-ON-02 / UC-HO-03 → UC-HO-06 → UC-HO-07 → KG node update → influences future UC-HO-04 / UC-ON-01 outputs**

This cycle is what differentiates ART-EEP from a static document repository — it is the architectural proof point for the *Responsible AI* hackathon scoring criterion.

---

## 6. Cross-Cutting Architectural Themes

The themes below are non-functional concerns that span multiple UCs. Each is mapped to the UCs where it manifests as a Special Requirement or design constraint.

### 6.1 Agentic Orchestration *(Pitch Angle 1 — 40% of judging)*
| Manifestation | UC References |
|---|---|
| Semantic Kernel as task decomposer / planner | UC-HO-04 SR, UC-ON-01 SR |
| Worker/Expert agent routing (ComplexityScore) | UC-HO-04 SR (Token Cost), UC-ON-01 SR |
| GraphRAG dual-strategy (Local + DRIFT) | UC-ON-01 steps 3–4 |
| Context seeding from Microsoft Graph Connectors | UC-HO-01 (referenced), UC-HO-05 AS.1 |

### 6.2 Human-in-the-Loop & Responsible AI *(Pitch Angle 2 — 40%)*
| Manifestation | UC References |
|---|---|
| Glass-box Verification before KG commit | UC-HO-03 (entire flow) |
| Digital signature gate | UC-HO-03 steps 10–12 |
| Hallucination report mechanism | UC-HO-06 (entire flow) |
| Side-by-side diff approval | UC-HO-07 step 3 |
| Active Learning closed loop | UC-HO-06 step 9, UC-HO-07 step 9 |
| Manager safety check on AI prompts | UC-HO-05 EX.1 |
| Skill dispute mechanism | UC-ON-03 AC.1 |

### 6.3 Token & Infrastructure Optimization *(Pitch Angle 3 — 20%)*
| Manifestation | UC References |
|---|---|
| Worker SLM for structured generation | UC-HO-04 steps 3–4, UC-ON-01 steps 7–8 |
| Expert LLM reserved for synthesis | UC-HO-04 step 6, UC-ON-01 steps 5–6 |
| SLA-bounded pipelines | UC-HO-04 (10 min), UC-ON-01 (15 min) |
| Atomic transactions / write rollback | UC-HO-04 SR, UC-HO-07 SR |

### 6.4 RBAC & Confidentiality
| Manifestation | UC References |
|---|---|
| AI Copilot scope restriction to role-relevant nodes | UC-ON-02 AS.3 |
| Pre-retrieval ACL trimming | UC-ON-01 (architectural refinement) |
| Restricted node masking in Playbook view | UC-ON-02 EX.4 (referenced in BA) |
| Manager authority scope check | UC-HO-05 PC.2, UC-HO-07 PC.2 |
| Manager-only annotation visibility | UC-ON-02 AC.3, UC-ON-01 AC.2 [TBD-3] |

### 6.5 Auditability & Compliance
| Manifestation | UC References |
|---|---|
| Versioned diff retention | UC-HO-03 SR, UC-HO-07 SR |
| Immutable audit log | UC-HO-04 SR (Traceability), UC-HO-05 SR, UC-HO-07 SR |
| Legal e-signature standard (eIDAS or local) | UC-HO-03 SR, [TBD-1] |
| 90-day audio retention policy | UC-HO-04 PC.4 |
| 2-year minimum diff retention | UC-HO-03 SR |

### 6.6 Performance SLAs
| Constraint | UC Reference |
|---|---|
| Playbook initial load ≤5s | UC-ON-02 SR |
| Graph node expansion ≤3s | UC-ON-02 SR |
| AI Copilot response ≤15s | UC-ON-02 SR |
| Live prompt injection ≤30s | UC-HO-05 SR |
| KG indexing pipeline ≤10 min | UC-HO-04 SR |
| Playbook generation ≤15 min | UC-ON-01 SR |

---

## 7. Knowledge Graph Node Lifecycle

A single piece of information (a node in the Knowledge Graph) passes through a deterministic lifecycle as it moves through the UCs. Tracking this lifecycle is the simplest way to validate that the UC suite is complete and internally consistent.

| Phase | Node State | Triggered By | Visible To |
|---|---|---|---|
| 1. Captured | `Draft — Pending Offboarder Review` | UC-HO-02 (transcript extracted) | Offboarder, Manager (read-only) |
| 2. Verified | `Approved — Pending KG Commit` | UC-HO-03 step 12 (signature) | Offboarder, Manager |
| 3. Committed | `KG Commit Complete` · marked `✅ Verified` | UC-HO-04 step 9 | All authorized consumers |
| 4. Consumed | (rendered in Playbook with `✅ Verified` badge) | UC-ON-01 step 10, UC-ON-02 step 4 | Onboarder, Manager |
| 5. Disputed | `⚠️ Disputed` badge appears | UC-HO-06 step 5 (flag submitted) | All readers, until resolved |
| 6a. Corrected | `✅ Verified` (new version) · original archived as `v_previous` | UC-HO-07 step 9 (Manager approval) | All authorized consumers |
| 6b. Confirmed | `✅ Verified` (badge restored, original retained) | UC-HO-07 AC.1 (Manager rejection) | All authorized consumers |
| 7. Archived | Read-only, audit-only | 90 days post-employee-departure (audio) · indefinite (text) | Platform admin, audit/compliance |

Every node state transition produces an immutable audit log entry per UC-HO-04 SR (Traceability) and UC-HO-07 SR (Audit Completeness).

---

## 8. Open Issues — Consolidated TBD Register

All TBD items extracted from the nine UCs, sorted by sprint deadline.

### Sprint 1 (1 issue)
| ID | Description | Owner | Source |
|---|---|---|---|
| ON-02 [TBD-3] | Confirm mobile layout priority (split-screen on mobile in v1 or phase 2?) | Product Owner / UX | UC-ON-02 |

### Sprint 2 (8 issues)
| ID | Description | Owner | Source |
|---|---|---|---|
| HO-03 [TBD-1] | Confirm legally binding e-signature standard (eIDAS or local) | Legal | UC-HO-03 |
| HO-04 [TBD-2] | Confirm end-to-end pipeline SLA (currently 10 min) | Product Owner / Infra Lead | UC-HO-04 |
| HO-05 [TBD-1] | Define content policy ruleset for prompt safety check | Legal / HR Lead | UC-HO-05 |
| HO-05 [TBD-2] | Decide if Manager prompts are visible to Offboarder pre-interview | Product Owner / UX | UC-HO-05 |
| HO-06 [TBD-3] | Decide if Onboarder flags require Offboarder co-confirmation | Product Owner | UC-HO-06 |
| HO-07 [TBD-2] | Define SME edit rights — edit-then-approve, or approve/reject only | BA / Security Lead | UC-HO-07 |
| ON-01 [TBD-2] | Confirm static-vs-interactive Playbook delivery model | Product Owner / UX | UC-ON-01 |
| ON-02 [TBD-2] | Decide if Copilot query history is visible to Manager | BA / HR Lead / Legal | UC-ON-02 |
| ON-03 [TBD-2] | Confirm EX.3 auto-finalization legal compliance | Legal / HR Lead | UC-ON-03 |

### Sprint 3 (10 issues)
| ID | Description | Owner | Source |
|---|---|---|---|
| HO-03 [TBD-2] | Define max correction cycles before recommending re-interview | Product Owner / BA | UC-HO-03 |
| HO-03 [TBD-3] | Decide if Manager Override (EX.1) requires second approver for C-level/Finance | HR Lead | UC-HO-03 |
| HO-04 [TBD-1] | Define chunk size + overlap for indexing | AI Engineer | UC-HO-04 |
| HO-04 [TBD-3] | Decide if low-confidence entities also notify Offboarder | BA / HR Lead | UC-HO-04 |
| HO-06 [TBD-1] | Confirm SLA for Manager correction review (default 5 business days) | BA / HR Lead | UC-HO-06 |
| HO-06 [TBD-2] | Clarify Active Learning refinement cycle (manual vs automated) | AI Engineer | UC-HO-06 |
| HO-07 [TBD-1] | Decide if `✅ Verified` should distinguish AI-generated-verified vs human-corrected-verified | UX / AI Engineer | UC-HO-07 |
| ON-01 [TBD-1] | Define threshold for "sufficient context" (EX.2) | AI Engineer | UC-ON-01 |
| ON-01 [TBD-3] | Decide visibility scope of provenance footnotes (Onboarder vs Manager-only) | HR Lead / Legal | UC-ON-01 |
| ON-02 [TBD-1] | Define Playbook "active period" — read-only after 90 days? | Product Owner | UC-ON-02 |
| ON-03 [TBD-1] | Benchmark fuzzy skill matching threshold (currently ≥0.80) | AI Engineer | UC-ON-03 |
| ON-03 [TBD-3] | Confirm Skill Wallet external portability (LinkedIn export) | Product Owner | UC-ON-03 |

**Aggregate:** 1 issue in Sprint 1 · 9 in Sprint 2 · 12 in Sprint 3.

---

## 9. Hackathon Pitch Mapping

For each scoring criterion, the table below identifies the strongest demonstrable UCs and the specific elements that prove the claim.

### Pitch 1 — Agentic Workflow (40%)
| Claim | Demonstrated By | Specific Element |
|---|---|---|
| The system *plans* before it acts | UC-ON-01, UC-HO-04 | Planner decomposes config → Section Blueprints (ON-01) or chunking strategy (HO-04) |
| Multi-step task graph executes autonomously | UC-HO-04 steps 3–10 | 8-step pipeline from raw transcript to KG-indexed nodes — fully unattended |
| Routing decisions are signal-driven, not static | UC-ON-01 BR-01 (refined) | ComplexityScore evaluation at runtime |
| Context seeding extends LLM capability | UC-HO-01 (referenced), UC-HO-05 AS.1 | Microsoft Graph Connectors ingest email / Teams / SharePoint as context |

### Pitch 2 — Human-in-the-Loop (40%)
| Claim | Demonstrated By | Specific Element |
|---|---|---|
| Humans gate all writes to enterprise data | UC-HO-03 step 12, UC-HO-07 step 9 | Digital signature required before any KG commit; Manager approval before any correction |
| Errors flow back into improvement | UC-HO-06 → UC-HO-07 → Active Learning | Closed loop visible in 6.2 above |
| AI work is verifiable end-to-end | UC-HO-03 step 5, UC-ON-02 step 11 | "Source" chip linking every claim to its transcript segment |
| Disputed content is publicly marked | UC-HO-06 PC.2 | `⚠️ Disputed` badge visible to all readers during review |

### Pitch 3 — Token & Infrastructure Efficiency (20%)
| Claim | Demonstrated By | Specific Element |
|---|---|---|
| Lightweight models handle ≥60% of token volume | UC-HO-04 SR, UC-ON-01 SR | Worker SLM (Phi-3 / GPT-4o-mini) for chunking, extraction, structured generation |
| Expert models reserved for reasoning | UC-HO-04 step 6, UC-ON-01 steps 5–6 | Expert LLM (GPT-4o) only for synthesis and inference |
| Pipelines are SLA-bounded | UC-HO-04 SR, UC-ON-01 SR | 10-min indexing · 15-min Playbook |
| Infrastructure complexity minimized | (architectural decision) | Cosmos DB Integrated Cache rather than Redis sprawl |

---

## 10. Glossary

| Term | Meaning |
|---|---|
| **Active Learning Engine** | Background process consuming approved corrections (UC-HO-07 step 9) as training signals for future AI Agent refinement |
| **AI Copilot** | The contextual Q&A assistant embedded in UC-ON-02, scoped to the Onboarder's role |
| **Digital Signature** | Legally binding sign-off mechanism (PIN or biometric) recorded at UC-HO-03 step 11 |
| **DRIFT Search** | Community-anchored GraphRAG retrieval strategy used for thematic / cross-domain context (UC-ON-01 step 4) |
| **Expert Agent** | The heavy-reasoning LLM (GPT-4o) invoked only for synthesis tasks |
| **Glass-box Verification** | The principle that no AI-generated content enters the KG without explicit human signature (UC-HO-03) |
| **Growth Plan** | The actionable list of recommended courses / certifications produced in UC-ON-03 |
| **Handover Record** | The complete bundle of verified transcript + entities + skills + summary committed in UC-HO-04 |
| **HITL** | Human-in-the-Loop — the architectural principle that all KG writes pass through a human gate |
| **Knowledge Graph (KG)** | The enterprise graph database (Cosmos DB Gremlin) storing entities, relationships, and indexed content |
| **Local Search** | Entity-anchored GraphRAG retrieval strategy used for specific project / client / tool context (UC-ON-01 step 3) |
| **Manager** | The supervisor of both the Offboarder and the Onboarder; primary human reviewer for HITL gates |
| **Offboarder** | The departing employee whose tacit knowledge is being captured |
| **Onboarder** | The new employee receiving the personalized Playbook |
| **Playbook** | The personalized onboarding document generated by UC-ON-01; N dynamic sections per Manager's Builder configuration |
| **Provenance Chip** | UI element on every AI-generated section showing its source (preset / custom prompt / handover session) |
| **RBAC** | Role-Based Access Control; enforced at the retrieval layer for all Knowledge Graph queries |
| **Section Blueprint** | The unit of generation in UC-ON-01; one Blueprint = one section of the Playbook |
| **Semantic Kernel** | The Microsoft orchestration framework hosting the Planner Agent and routing Worker/Expert agent calls |
| **Skill Gap Report** | The component of UC-ON-01 output that compares Onboarder vs. predecessor skill profiles |
| **Skill Wallet** | Portable record of an employee's verified skills and onboarding milestones (UC-ON-03 PC.5) |
| **Worker Agent** | The lightweight SLM (Phi-3 / GPT-4o-mini) handling structured extraction and generation tasks |

---

## 11. Quality Verification Summary

Each individual UC carries its own 20-point quality checklist. All nine UCs in this upload scored **20/20**. This index inherits that quality bar — every entry above is sourced from a passing UC.

| UC | Score | Validated |
|---|---|---|
| UC-HO-01 | (spec not in upload) | Pending |
| UC-HO-02 | (spec not in upload) | Pending |
| UC-HO-03 | 20/20 ✅ | Yes |
| UC-HO-04 | 20/20 ✅ | Yes |
| UC-HO-05 | 20/20 ✅ | Yes |
| UC-HO-06 | 20/20 ✅ | Yes |
| UC-HO-07 | 20/20 ✅ | Yes |
| UC-ON-01 | 20/20 ✅ | Yes |
| UC-ON-02 | 20/20 ✅ | Yes |
| UC-ON-03 | 20/20 ✅ | Yes |

---

## 12. Reading Path Recommendations

For different stakeholders consuming this UC suite for the first time:

**Engineering / AI Team:** UC-HO-04 (pipeline architecture) → UC-ON-01 (generation pipeline) → UC-HO-06/07 (Active Learning) → UC-ON-02 (Copilot integration).

**Product / UX:** UC-ON-02 (reading experience) → UC-ON-01 (Builder configuration) → UC-ON-03 (Skill Gap UI) → UC-HO-03 (verification UX).

**Legal / Compliance:** UC-HO-03 (signature, retention) → UC-HO-04 (atomicity, audit) → UC-HO-07 (immutability) → UC-ON-03 (auto-finalization implications).

**HR / People Ops:** UC-HO-01 (session initiation) → UC-HO-05 (Manager prompt steering) → UC-ON-03 (Skill Gap interpretation) → UC-HO-06/07 (correction governance).

**BA / QA:** This index, in order. Then each UC's 20-point checklist for verification.

---

*Master Index assembled across UC-HO-01 through UC-HO-07 and UC-ON-01 through UC-ON-03.*
*Skill developed by **Phúc NT** · BA Zone · Digital School*
