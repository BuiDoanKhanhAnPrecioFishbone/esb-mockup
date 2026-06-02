# Use Case Specification — ART-EEP / Phân hệ A: Handover

| **Use Case ID:**        | UC-HO-02                                              | | |
|-------------------------|-------------------------------------------------------|-|-|
| **Use Case Name:**      | Conduct AI-Guided Voice Interview                     | **Version:** | 2.1 |
| **Created By:**         |                    | **Last Updated By:**   | BA Pod |
| **Date Created:**       |                    | **Date Last Updated:** | 2026-06-02 |

> **Version 2.1 changes:** Assumption A.1 updated to reflect the data-ingestion governance rule (CL-087) · context seeding integrations are restricted to approved shared workspaces only (Jira, GitHub, Google Drive shared, SharePoint, Trello, Microsoft Planner). Email is no longer described as an "optional integration" because it is not an automated data source at all. No changes to the Normal Course, ACs, EXs, or core flow — this UC's behavior is unaffected because UC-HO-02 consumes the Preliminary Knowledge Map from UC-HO-01, regardless of which approved shared workspaces seeded it.

> **Version 2.0 changes:** Replaces the hardcoded 4-section domain coverage with **dynamic N-domain coverage** derived from the Preliminary Knowledge Map and Manager's UC-HO-05 prompts. Introduces ComplexityScore-based routing for question generation, GraphRAG dual-strategy retrieval, and live RBAC scope enforcement.

---

## Identity & Description

| Field | Value |
|---|---|
| **Actor:** | **Primary:** Offboarder (departing employee) / **Secondary:** ART-EEP Semantic Kernel Orchestrator (Planner Agent + Handover AI Agent), Worker Agent (SLM — Phi-3 / GPT-4o-mini), Expert Agent (LLM — GPT-4o), Whisper API (speech-to-text) |
| **Description:** | An Offboarder whose departure has been formally initiated needs to transfer tacit knowledge — unwritten rules, project risks, and institutional context — that cannot be captured from documents alone. The Offboarder engages in a structured, AI-facilitated voice conversation (≈45 minutes) where the Semantic Kernel Planner Agent dynamically generates questions covering N knowledge domains derived from (a) the Preliminary Knowledge Map seeded in UC-HO-01 and (b) any priority prompts the Manager has injected via UC-HO-05. Question generation routes between the Worker Agent (standard follow-ups) and Expert Agent (complex multi-hop inference) based on a runtime ComplexityScore. All retrieval calls during the live session are bound to the session's RBAC scope (established in UC-HO-01) and pass through pre-retrieval ACL trimming. Upon completion, the system produces a raw transcript and a draft handover summary structured around the N domains actually covered — ready for the Offboarder's review in UC-HO-03. |

---

## Conditions + Priority + Frequency

| Field | Value |
|---|---|
| **Preconditions:** | 1. Offboarder's departure has been formally recorded in ART-EEP (status = `Offboarding In Progress`). 2. UC-HO-01 (*Initiate Handover Session*) has been completed — Preliminary Knowledge Map is staged, RBAC scope is established, and Microsoft Purview classification has been applied to all seeded context. 3. Offboarder is authenticated and has an active ART-EEP session. 4. Microphone access is granted by the Offboarder's device. |
| **Postconditions:** | 1. A timestamped voice recording is saved to the Offboarder's handover workspace (status = `Raw Recording Saved`). 2. Whisper API has produced a full text transcript linked to the session. 3. ART-EEP Handover AI Agent has generated a draft handover summary structured around the N knowledge domains actually covered during the interview (status = `Pending Offboarder Review`), triggering UC-HO-03. 4. All identified entities (projects, tools, clients, risk flags) are tagged but **not yet committed** to the Knowledge Graph. 5. The full question-generation trace — including Planner routing decisions, ComplexityScore evaluations, agent assignments (Worker vs Expert), GraphRAG retrieval strategy per question, and any confidence-gate escalation events — is written to the session's audit log under the audit anchor established in UC-HO-01. |
| **Priority:** | High |
| **Frequency of Use:** | Once per departing employee. Estimated 5–20 sessions/month depending on organization headcount and attrition rate. |

---

## Normal Course of Events

| Step | Actor / System | Action |
|------|----------------|--------|
| 1 | Offboarder | Opens the ART-EEP Handover module and selects "Start Voice Interview" for their active offboarding session. |
| 2 | System | Displays a pre-interview briefing screen: estimated duration (≈45 min), recording consent notice, and a summary of the context already seeded — including the N knowledge domains the Planner Agent has derived from the Preliminary Knowledge Map and any Manager priority prompts. |
| 3 | Offboarder | Reads the briefing, grants recording consent, and clicks "Begin Interview". |
| 4 | System | Activates the microphone, establishes a live connection to Whisper API for real-time speech-to-text transcription, and displays a session timer and live transcript panel. |
| 5 | System (Semantic Kernel Planner Agent) | Selects the first knowledge domain to cover (typically the highest-priority gap detected during seeding, or any UC-HO-05 prompt tagged `Critical`). The Planner computes the ComplexityScore for the opening question and routes generation: standard openers go to the **Worker Agent**; multi-hop synthesis openers go to the **Expert Agent**. The selected Agent generates the first question. |
| 6 | Offboarder | Responds verbally. Whisper transcribes the answer in real time and displays it in the transcript panel. |
| 7 | System (Planner Agent) | Analyzes the response and selects the next question. The Planner: (a) determines retrieval strategy — **Local Search** for entity-anchored follow-ups (specific project / tool / client), **DRIFT Search** for thematic / cross-domain probes (cultural norms, escalation patterns); (b) applies pre-retrieval ACL trimming via the session's RBAC scope before querying the seeded context; (c) computes the ComplexityScore for the next question; (d) routes to Worker or Expert Agent accordingly. If Worker Agent output falls below the confidence threshold, the question is automatically re-generated by Expert Agent — the escalation is logged. |
| 8 | Offboarder & System | Steps 6–7 repeat iteratively for the duration of the interview. The Planner systematically covers the N knowledge domains identified for this session, prioritizing `Critical` domains first and reserving lower-priority domains for the wrap-up phase. Coverage progress is tracked internally; the Offboarder sees a subtle progress indicator showing domain completion. |
| 9 | System | At the 40-minute mark, displays a soft warning: "5 minutes remaining — wrapping up." The Planner Agent shifts to closing questions for any domain still marked as uncovered or undercovered. |
| 10 | Offboarder | Signals completion by clicking "End Interview" or the session timer reaches 60 minutes (hard stop). |
| 11 | System | Stops recording, finalizes the transcript via Whisper API, and triggers the AI Agent to produce a structured draft handover summary. The summary is organized around the N domains actually covered — not a hardcoded template — with one section per covered domain. Any domain that received fewer than the configured minimum coverage threshold is flagged as `Incomplete — Supplementary Review Suggested`. |
| 12 | System | Saves the raw recording and transcript to the Offboarder's handover workspace, writes the full generation trace (Planner decisions, routing, escalations, retrieval strategies) to the session audit log, updates session status to `Pending Offboarder Review`, and sends an in-app notification prompting the Offboarder to proceed to UC-HO-03. |

---

## Alternative Courses

**UC-HO-02.AC.1 — Offboarder Pauses and Resumes the Interview**
> At step 6 of the Normal Course, if the Offboarder clicks "Pause", the system suspends recording and saves a checkpoint of the transcript and AI context state — including domain coverage progress, the active domain, and the next-question queue. The Offboarder may resume within 24 hours by re-entering the session; the Planner Agent re-loads the context and continues from the last uncovered domain. If not resumed within 24 hours, a reminder notification is sent to both the Offboarder and Manager.

**UC-HO-02.AC.2 — Offboarder Prefers Text Input Over Voice**
> At step 3, if the Offboarder selects "Switch to Text Mode", the system deactivates the microphone and Whisper API. The Planner Agent presents the same dynamically generated questions as text prompts in a chat-style interface. The Offboarder types responses. All subsequent steps proceed identically — including ComplexityScore routing, RBAC trimming, and dynamic domain coverage — but no audio recording is saved.

**UC-HO-02.AC.3 — Manager Injects a Priority Question Mid-Session**
> At any point during steps 5–8, if the Manager has submitted an override prompt via UC-HO-05, the prompt first passes through pre-retrieval ACL trimming against the session's RBAC scope (prompts requesting out-of-scope information are rejected before reaching the AI Agent). Valid prompts are inserted by the Planner Agent at the next natural pause in the conversation flow, flagged visually as "Manager Priority Question" in the transcript panel.

**UC-HO-02.AC.4 — Confidence-Gate Escalation Worker → Expert**
> At step 7, if the Worker Agent's generated question fails the confidence threshold (e.g., the question is generic, off-topic, or insufficiently anchored to the Offboarder's prior response), the Planner Agent re-routes the same generation task to the Expert Agent. The escalation event — including the Worker's rejected output, ComplexityScore, and Expert's replacement output — is recorded in the session audit log. The Offboarder experiences this transparently as a single delivered question.

---

## Exceptions

**UC-HO-02.EX.1 — Microphone or Audio Device Failure**
> Trigger: At step 4, device microphone is unavailable or permission is denied.
> System response: Displays an error message ("Microphone not detected. Please check your device settings or switch to Text Mode.") and presents two options: retry microphone access or switch to AC.2 (Text Mode).
> Final state: Session remains in `Not Started` status; no recording is initiated.

**UC-HO-02.EX.2 — Whisper API Transcription Timeout**
> Trigger: During steps 6–8, the Whisper API fails to return a transcription within 10 seconds for a given audio segment.
> System response: Displays a warning banner ("Transcription delayed — your audio is saved. Retrying…"). The system buffers the audio and retries up to 3 times. If all retries fail, it flags the segment as `[Transcription Pending]` and continues the session; the flagged segment is queued for offline processing.
> Final state: Session continues; flagged segments are resolved before step 11 can complete.

**UC-HO-02.EX.3 — Offboarder Session Expires (Inactivity)**
> Trigger: No audio input or user interaction is detected for more than 5 consecutive minutes during the interview.
> System response: Displays a "Are you still there?" modal with a 60-second countdown. If no response, the session auto-pauses and saves a checkpoint.
> Final state: Session status set to `Paused — Awaiting Resumption`; Manager is notified.

**UC-HO-02.EX.4 — Context Seeding Data Unavailable**
> Trigger: At step 2, the system detects that UC-HO-01 did not complete successfully (no seeded data available).
> System response: Displays a warning ("Interview context is incomplete — some questions may be less targeted. Proceed anyway or contact your Manager to re-run context seeding.").
> Final state: If Offboarder proceeds, the Planner Agent falls back to a generic question bank based on the Offboarder's job title and department. The interview operates with a default minimal domain set (3–4 broad domains). Session quality is flagged as `Low Context` in the Manager's dashboard.

**UC-HO-02.EX.5 — Hard Time Limit Reached (60 Minutes)**
> Trigger: At step 8, the session timer reaches 60 minutes.
> System response: Automatically ends the recording, notifies the Offboarder ("Maximum session duration reached. Your interview has been saved."), and proceeds to step 11.
> Final state: Transcript is processed normally; any knowledge domains not yet covered are flagged as `Incomplete` in the draft summary for the Manager's awareness.

**UC-HO-02.EX.6 — RBAC Trimming Excludes All Retrieval Context for a Question**
> Trigger: At step 7, after applying the session's RBAC scope, the Planner Agent finds that the retrieval context for the intended question is fully excluded — meaning the Offboarder is authorized to *speak about* a domain but the AI Agent is not authorized to *retrieve* supporting context to ground its question.
> System response: The Planner Agent falls back to a generic question for that domain (no retrieval grounding) and logs the trim event. The transcript panel displays a small indicator: "This question is being asked without retrieval context due to authorization boundaries."
> Final state: Question is asked; Offboarder may answer normally. The trim event is recorded in the audit log for HR Admin policy review.

---

## Includes, Special Requirements, Assumptions, Notes

| Field | Value |
|---|---|
| **Includes:** | UC-HO-01 *(Initiate Handover Session)* — must be completed before this UC starts; establishes RBAC scope and Preliminary Knowledge Map consumed throughout. UC-HO-05 *(Configure Handover Interview Prompts)* — supplies optional Manager priority prompts injected at step 5 and AC.3. UC-HO-03 *(Review and Approve Handover Transcript)* — triggered upon completion of this UC. |
| **Special Requirements:** | **Performance:** Whisper API must return transcription within 10 seconds per audio segment under normal network conditions (≥10 Mbps). Question generation (Planner → retrieval → agent → delivery) must complete within 4 seconds to maintain conversational flow. **Privacy & Security:** Voice recordings must be encrypted at rest (AES-256) and in transit (TLS 1.3). Recordings are accessible only to the Offboarder, their direct Manager, and authorized HR admins. **Retention:** Raw audio recordings are auto-deleted 90 days after the Knowledge Graph commit in UC-HO-04; text transcripts are retained per the organization's data retention policy. **Usability:** Live transcript panel must render with < 3-second lag relative to speech to maintain conversational flow. **Dynamic Domain Coverage:** The interview must NOT operate on a hardcoded section template. The N knowledge domains covered are derived at runtime from (a) the Preliminary Knowledge Map's flagged knowledge gaps from UC-HO-01, and (b) Manager priority prompts from UC-HO-05. The draft summary at step 11 must mirror the N domains actually covered, not a fixed schema. **Token Cost Management:** The Worker Agent (SLM — Phi-3 / GPT-4o-mini) must handle ≥70% of question-generation tokens by volume (standard entity-anchored follow-ups, structured probes). The Expert Agent (LLM — GPT-4o) is invoked only for: multi-hop synthesis questions, opening questions for high-stakes domains, and confidence-gate escalations from the Worker Agent (AC.4). **RBAC Enforcement at Retrieval:** Every GraphRAG retrieval call during the live interview must apply pre-retrieval ACL trimming via the session's RBAC scope (established in UC-HO-01). LLM-side redaction is not permitted as the primary security mechanism. **Audit Completeness:** The session audit log must record — for every generated question — the Planner's routing decision, ComplexityScore, retrieval strategy (Local / DRIFT / fallback), agent assigned (Worker / Expert), and any escalation event. The trace must be reconstructible from the audit log alone, without re-running the pipeline. |
| **Assumptions:** | 1. *(v2.1)* The organization has integrated ART-EEP with at least one approved shared workspace (Jira, GitHub, Google Drive shared, SharePoint, Trello, or Microsoft Planner) for context seeding via UC-HO-01. Email is not an automated data source under any condition per the data-ingestion governance rule (CL-087) · personal mailboxes and private messaging are excluded entirely; personal files reach the system only via manual upload by the Offboarder during this interview workflow. 2. Whisper API (or equivalent STT service) is provisioned and available in the deployment environment. 3. The Offboarder is a cooperative participant; the system does not handle adversarial or deliberately uninformative responses beyond flagging low-content segments. 4. Interviews are conducted in Vietnamese or English; the Handover AI Agent supports both languages in the same session. 5. The Semantic Kernel Planner Agent is configured with the ComplexityScore evaluation function, threshold values (low / high / confidence-gate), and the GraphRAG dual-strategy routing rules prior to go-live. 6. The minimum coverage threshold per knowledge domain (for the `Incomplete — Supplementary Review Suggested` flag at step 11) is configurable per organization. |
| **Notes and Issues:** | [TBD-1] Clarify whether the 45-minute target is a guideline or enforced. Owner: Product Owner. Due: Sprint 2. [TBD-2] Define the fallback question bank for EX.4 (Low Context mode). Owner: BA / HR Lead. Due: Sprint 3. [TBD-3] Confirm data residency requirements for voice recordings if the organization operates across multiple jurisdictions. Owner: Legal / Infosec. Due: Sprint 2. [TBD-4] Define ComplexityScore threshold values per question type. Owner: AI Engineer. Due: Sprint 3. [TBD-5] Define the minimum coverage threshold per knowledge domain for the `Incomplete` flag at step 11. Owner: AI Engineer / BA. Due: Sprint 3. [TBD-6] Decide whether the Offboarder should see the domain coverage progress indicator (step 8). Owner: Product Owner / UX. Due: Sprint 2. [TBD-7] *(v2.1)* If the Offboarder mentions an email thread during the interview that's relevant to the handover (e.g., "I made the final call on the Vendor XYZ pricing in an email last March"), should the interview workflow offer a manual-upload affordance for that specific email export, or rely on the Offboarder to verbally summarize the decision? Owner: Product Owner / UX. Due: Sprint 2. |

---

## Quality Validation — 20-Point Checklist

| Item | Criterion | Status | Note |
|------|-----------|--------|------|
| C1 | UC Name follows "verb + object", active voice | ✅ | "Conduct AI-Guided Voice Interview" |
| C2 | UC is at user-goal level (coffee-break test) | ✅ | Offboarder finishes the interview → can walk away; post-processing is system-side |
| C3 | UC ID is unique and follows naming convention | ✅ | UC-HO-02 |
| C4 | Exactly 1 primary actor + 1 clear business goal | ✅ | Offboarder / capture tacit knowledge across the dynamic N-domain coverage in one session |
| C5 | System boundary is clear | ✅ | Scoped to the interview session; indexing → UC-HO-04, manager config → UC-HO-05, review → UC-HO-03 |
| C6 | Actor is a specific role, not "User" | ✅ | "Offboarder (departing employee)" with named secondary system actors |
| C7 | Description answers WHY + WHAT + OUTCOME | ✅ | Why: tacit knowledge can't be captured from docs. What: ≈45-min AI voice interview with Planner-driven dynamic domain coverage. Outcome: N-section draft summary ready for review |
| C8 | Frequency of Use is quantified | ✅ | "5–20 sessions/month" |
| C9 | Preconditions are verifiable | ✅ | All 4 preconditions are system-checkable states |
| C10 | Postconditions cover success state and all system changes | ✅ | 5 postconditions including the full generation trace |
| C11 | Preconditions not confused with Assumptions | ✅ | Preconditions = hard system states; Assumptions = environmental beliefs |
| C12 | Normal Course: numbered list, one action per step | ✅ | 12 steps, each single-action |
| C13 | Alternates Actor / System with clear subjects | ✅ | Every step has explicit subject — including agent type and orchestrator component |
| C14 | No embedded if/else/loop in Normal Course | ✅ | All branching moved to AC and EX sections |
| C15 | Flow runs from trigger to postcondition | ✅ | Step 1 (trigger) → Step 12 (all postconditions met) |
| C16 | Each AC specifies "at step N" + condition | ✅ | All 4 ACs reference specific steps |
| C17 | Each Exception has trigger + system response + final state | ✅ | All 6 EXs follow the 3-part structure |
| C18 | Common failure modes covered | ✅ | Hardware failure, API timeout, inactivity, missing seed data, time limit, full RBAC trim |
| C19 | Includes point to existing UCs | ✅ | UC-HO-01, UC-HO-03, and UC-HO-05 all exist in the UC List |
| C20 | Special Requirements don't duplicate functional requirements | ✅ | All SRs are non-functional |

**Result: 20/20 ✅ — UC-HO-02 v2.1 passes all quality checks.**

---

## Change Log

| Version | Date | Changes |
|---|---|---|
| 1.0 | Sprint 1 | Initial specification. Hardcoded coverage of 4 sections. |
| 2.0 | Sprint 2 | Replaced hardcoded 4-section coverage with dynamic N-domain coverage. Named Semantic Kernel Orchestrator and Planner Agent explicitly. Introduced ComplexityScore-based routing. Added GraphRAG dual-strategy retrieval. Added pre-retrieval ACL trimming. Added AC.4 and EX.6. Added full generation trace to audit log as PC.5. |
| **2.1** | **2026-06-02** | **Assumption A.1 updated per CL-087 · context seeding integrations restricted to approved shared workspaces (Jira, GitHub, Google Drive shared, SharePoint, Trello, Microsoft Planner). Email no longer described as "optional integration" because it is not an automated data source at all. Personal files reach the system only via manual upload by the Offboarder during this interview workflow. Added [TBD-7] covering the edge case of Offboarders mentioning email-based decisions mid-interview (whether to offer a manual-upload affordance for specific email exports). No changes to Normal Course, ACs, EXs, postconditions, or core flow — UC-HO-02 consumes the Preliminary Knowledge Map regardless of which approved shared workspaces seeded it. Decided by · Stakeholder direction + BA. Category · BA Gap (cross-impact from UC-HO-01 v2.1).** |

---
*Skill developed by **Phúc NT** · BA Zone · Digital School*
