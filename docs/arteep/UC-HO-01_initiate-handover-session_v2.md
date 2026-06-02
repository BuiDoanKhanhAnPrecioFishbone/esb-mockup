# Use Case Specification — ART-EEP / Phân hệ A: Handover

| **Use Case ID:**        | UC-HO-01                                              | | |
|-------------------------|-------------------------------------------------------|-|-|
| **Use Case Name:**      | Initiate Handover Session                             | **Version:** | 2.1 |
| **Created By:**         |                    | **Last Updated By:**   | BA Pod |
| **Date Created:**       |                    | **Date Last Updated:** | 2026-06-02 |

> **Version 2.1 changes:** Email removed as an automated data source per the data-ingestion governance rule. Approved sources are now restricted to shared workspaces only · Jira · GitHub · Google Drive (shared) · SharePoint · Trello · Microsoft Planner. AC.2 ("Manager excludes email") repurposed as a generic source-deselection case using GitHub as the example. The Privacy — Email Scanning Constraint Special Requirement is replaced with a broader data-ingestion governance Special Requirement. Personal mailboxes, personal directories, and private messaging are excluded from automated collection entirely; personal files reach the system only via manual upload by the Offboarder. See Change Log at the end for full v2.0 → v2.1 delta.

> **Version 2.0 changes:** Names the Semantic Kernel Orchestrator and Planner Agent explicitly. Adds Microsoft Purview PII classification as a mandatory gate between Graph Connector ingest and the Preliminary Knowledge Map. Establishes the session's RBAC scope at creation time so all downstream retrieval (UC-HO-02, UC-ON-01) inherits a pre-defined authorization boundary.

---

## Identity & Description

| Field | Value |
|---|---|
| **Actor:** | **Primary:** Manager / **Secondary:** Offboarder, ART-EEP Semantic Kernel Orchestrator (Planner + Context Seeding Agent), Microsoft Purview (PII Classification), Microsoft Graph Connectors and direct shared-workspace adapters (Jira / GitHub / Google Drive shared / SharePoint / Trello / Microsoft Planner) |
| **Description:** | When an employee's departure has been confirmed in the HR system, the Manager must formally open a handover session in ART-EEP to set the parameters for knowledge transfer and trigger the automated context seeding process. Context seeding is an orchestrated background scan — coordinated by the Semantic Kernel Planner Agent — of the Offboarder's accessible work across approved shared workspaces (Jira tickets, GitHub shared repositories, Google Drive shared files, SharePoint, Trello, Microsoft Planner) that pre-loads the AI Agent with targeted intelligence before the voice interview begins. **Email, personal directories, and private messaging are NEVER scanned** by the Context Seeding Agent under any condition — personal files reach the system only via manual upload by the Offboarder during the interview workflow. Ingested content passes through a Microsoft Purview PII classification gate before being staged, ensuring no personally identifiable or sensitive content enters the system without proper labeling. The session also establishes the RBAC scope that bounds every downstream retrieval call (UC-HO-02 interview questions, UC-ON-01 Playbook generation). This UC is the entry point for the entire Phân hệ A pipeline; nothing downstream can begin without it. |

---

## Conditions + Priority + Frequency

| Field | Value |
|---|---|
| **Preconditions:** | 1. The Offboarder's departure has been formally recorded in the HR system with a confirmed last working date. 2. The HR system event has been synced to ART-EEP, creating an Offboarder record with status `Departure Confirmed`. 3. Manager is authenticated and has managerial authority over the Offboarder's record in ART-EEP. 4. At least one approved shared workspace (Jira, GitHub, Google Drive shared, SharePoint, Trello, or Microsoft Planner) is integrated and accessible for the Offboarder's account. 5. Microsoft Purview PII classification service is operational and configured with the organization's active sensitivity labels. |
| **Postconditions:** | 1. A Handover Session record is created in ART-EEP with a unique Session ID, linked to the Offboarder's profile and the Manager's account. 2. Session status is set to `Offboarding In Progress`. 3. The review deadline for UC-HO-03 is recorded (default: 3 business days after interview completion, configurable by Manager). 4. The session's **RBAC scope** is established — the union of the Offboarder's role authorizations and Manager's authority, bounding all downstream retrieval calls until session closure. 5. Context seeding has completed — the Offboarder's accessible work across approved shared workspaces has been scanned, PII-classified, and a preliminary knowledge map (list of projects, tools, clients, and detected knowledge gaps) is stored in the session workspace. 6. The Offboarder receives an in-app notification: "Your handover process has been initiated. Please check your workspace for next steps." 7. UC-HO-02 (*Conduct AI-Guided Voice Interview*) and UC-HO-05 (*Configure Handover Interview Prompts*) are unblocked. 8. An immutable audit anchor entry is written, capturing session creation context (Manager ID, Offboarder ID, configuration, RBAC scope, timestamp) — this anchor is the parent record for all subsequent audit entries across the session's lifecycle. |
| **Priority:** | High |
| **Frequency of Use:** | Once per departing employee. Estimated 5–20 sessions/month. |

---

## Normal Course of Events

| Step | Actor / System | Action |
|------|----------------|--------|
| 1 | System | Detects the Offboarder's departure record sync from the HR system and creates a draft Handover Session record. Sends the Manager an in-app notification: "A handover session is ready to be initiated for [Offboarder Name]. Last working date: [Date]." |
| 2 | Manager | Opens the notification and clicks **"Initiate Handover Session"** to enter the session setup wizard. |
| 3 | System | Displays the Session Setup screen with three configuration panels: (a) **Session Details** — pre-filled with Offboarder name, role, department, and last working date; (b) **Review Deadline** — defaulted to 3 business days after interview completion, editable; (c) **Data Sources** — a checklist of approved shared workspaces available for this Offboarder, pre-selected based on active integrations (e.g., Jira, GitHub, Google Drive for Engineering; Salesforce, SharePoint for Sales; Notion, SharePoint for People Operations). Email is not listed because it is never an automated source under the data-ingestion governance rule. |
| 4 | Manager | Reviews and adjusts configuration as needed: modifies the review deadline if the Offboarder has a shorter notice period, deselects shared workspaces that are not relevant to the successor's scope (e.g., excludes GitHub archived legacy repos), and adds a free-text **Focus Note** (optional) to guide the context seeding (e.g., "Prioritize Project X and Client Y"). |
| 5 | Manager | Clicks **"Start Session & Begin Context Seeding"**. |
| 6 | System (Semantic Kernel Orchestrator) | Creates the Handover Session record with a unique Session ID. Sets status to `Offboarding In Progress`. Records the configured review deadline. Establishes the session's RBAC scope by resolving the Offboarder's role authorizations and the Manager's authority — this scope is bound to the Session ID and consumed by all downstream retrieval calls. Writes the audit anchor entry. Displays a progress indicator: "Context seeding in progress — scanning [Offboarder Name]'s shared work history." |
| 7 | System (Planner Agent → Context Seeding Agent) | The Planner Agent decomposes the seeding job by source and complexity. Routes structured metadata extraction (Jira ticket fields, GitHub PR descriptions and commit messages, shared Drive file names, SharePoint document titles) to the **Worker Agent (SLM)**. Reserves the **Expert Agent (LLM)** for the knowledge-gap inference pass (step 9). The Context Seeding Agent then scans the selected shared workspaces via Microsoft Graph Connectors and direct shared-workspace adapters in the background. |
| 8 | System (Microsoft Purview) | All ingested content from step 7 passes through the Purview PII classification gate before any further processing. Content tagged with organizational sensitivity labels (e.g., `Confidential — Personal Data`, `Confidential — Salary`, `Highly Confidential`) is either redacted (label-dependent) or excluded from the staged context. The original ingest count and the post-classification count are both recorded for auditability. |
| 9 | System (Context Seeding Agent) | Processes the scrubbed, classified data to produce a **Preliminary Knowledge Map**: a structured list of identified projects, clients, tools, key contacts, and detected knowledge gaps (areas with significant activity but sparse documentation). The Expert Agent is invoked only for the gap-detection inference pass; metadata-only items use Worker Agent throughput. The map is stored in the session workspace, scoped to the session's RBAC boundary. |
| 10 | System | Updates the session status display to show seeding completion. Displays the Preliminary Knowledge Map to the Manager as a summary card: total items detected, total items excluded by Purview classification (without revealing what was excluded), top 3 projects by activity, and flagged knowledge gaps. |
| 11 | Manager | Reviews the Preliminary Knowledge Map. Optionally navigates to UC-HO-05 to add priority prompts based on the map's findings before the interview begins. |
| 12 | System | Sends an in-app notification to the Offboarder: "Your handover process has been initiated by [Manager Name]. Please visit your workspace to begin your knowledge transfer interview at your earliest convenience." |
| 13 | Manager | Confirms the session is ready. The session dashboard shows UC-HO-02 and UC-HO-05 as available next actions. |

---

## Alternative Courses

**UC-HO-01.AC.1 — Manager Initiates Session Manually Without HR System Sync**
> At step 1, if the HR system sync has not occurred (e.g., a delay in the HR system, or an informal departure agreement not yet recorded), the Manager may manually initiate a handover session by navigating to the Offboarding module and clicking **"Create Manual Handover Session"**.
> The system presents the same Session Setup wizard (step 3) but requires the Manager to manually enter: Offboarder name, role, department, and last working date.
> All subsequent steps proceed identically. The manually created session is flagged as `Manual Initiation` in the audit trail, and the HR Admin is notified to sync the official departure record.

**UC-HO-01.AC.2 — Manager Deselects a Shared Workspace Source**
> *(v2.1 · repurposed from the v2.0 "Email Excluded" case — email is no longer an automated source.)*
> At step 4, if the Manager deselects one of the approved shared workspaces (e.g., GitHub for an Offboarder whose shared repos are mostly archived legacy code not relevant to the successor's scope; or SharePoint for a session where the Manager wants to scope-limit the seed), the Context Seeding Agent (step 7) skips that source and scans only the remaining selected sources.
> The Preliminary Knowledge Map is generated from the reduced dataset. A notice is displayed: "[Source Name] data excluded — knowledge map coverage may be reduced for topics held there." The session proceeds normally; the deselection is captured in the audit anchor.

**UC-HO-01.AC.3 — Offboarder Has No Integrated Shared Workspaces Available**
> At step 3, if no approved shared workspaces are integrated or accessible for the Offboarder's account (e.g., all tools are external to ART-EEP's integrations), the system disables the data source checklist and displays a notice: "No integrated shared workspaces found. Context seeding will be skipped. The interview will use a generic question bank based on the Offboarder's role and department."
> The Manager confirms and clicks **"Start Session (No Seeding)"**. Steps 7–9 are skipped. The session is created with a `No Context — Generic Interview` flag. UC-HO-02 proceeds using the fallback question bank as per UC-HO-02.EX.4.

**UC-HO-01.AC.4 — Purview Classification Excludes a High Proportion of Content**
> At step 8, if Purview classification redacts or excludes more than 30% of the ingested content for any single source (suggesting the role is heavily concentrated in PII-handling work), the system flags this in the Preliminary Knowledge Map summary.
> The Manager sees an additional warning card: "A significant portion of [Offboarder Name]'s activity involves PII-classified content. Interview questions may be less detailed for those areas. Consider adding priority prompts via UC-HO-05 to compensate, or request an override review."
> The session proceeds normally; the redacted volume is recorded for HR Admin review and potential future policy refinement.

---

## Exceptions

**UC-HO-01.EX.1 — Context Seeding Fails to Complete**
> Trigger: At step 7 or 9, the Context Seeding Agent encounters an error (shared workspace API unavailable, permission denied, OAuth refresh token expired, processing timeout exceeding 30 minutes).
> System response: Stops the seeding process for the failing source. Marks the affected source as `Seeding Failed` in the session workspace. Proceeds with data from successfully seeded sources. Displays a warning to the Manager: "Context seeding from [Source Name] could not be completed. Interview questions may be less targeted for topics covered by this source." Logs the failure for platform admin review with full retrieval trace.
> Final state: Session is created with partial seeding data. UC-HO-02 proceeds with available context; the failed source is flagged in the Preliminary Knowledge Map.

**UC-HO-01.EX.2 — Offboarder Record Not Found in ART-EEP**
> Trigger: At step 2, the Manager opens the initiation wizard but the Offboarder's profile does not exist in ART-EEP (e.g., the HR system sync created the departure record but the employee's ART-EEP profile was never provisioned).
> System response: Displays an error: "Offboarder profile not found in ART-EEP. Please contact HR Admin to provision this account before initiating a handover session."
> Final state: Session creation is blocked. Manager contacts HR Admin. Once the profile is provisioned, the Manager retries from step 2. No partial session record is created.

**UC-HO-01.EX.3 — Last Working Date Is Fewer Than 3 Business Days Away**
> Trigger: At step 3, the system detects that the Offboarder's last working date is fewer than 3 business days from today — less than the default review deadline.
> System response: Displays an urgent warning banner: "⚠️ Critical: [Offboarder Name]'s last working date is [X] business day(s) away. The default review deadline has been automatically reduced to match. Consider scheduling the interview immediately."
> The review deadline field is auto-adjusted to the last working date minus 1 business day. The Manager may override this, but cannot set a deadline beyond the last working date.
> Final state: Session is created with an expedited timeline. The Offboarder's notification (step 12) includes an urgency flag.

**UC-HO-01.EX.4 — Purview Classification Service Unavailable**
> Trigger: At step 8, the Microsoft Purview classification service is unavailable or returns a service error.
> System response: Halts the seeding pipeline immediately. Does NOT proceed with unclassified content under any circumstance — content cannot enter the staging area without classification. Sets session status to `Seeding Paused — Classification Service Unavailable`. Notifies the platform admin with full error logs. Retries the Purview call every 15 minutes for up to 4 hours.
> Final state: If the service recovers within 4 hours, seeding resumes automatically from the failed step. If not, the platform admin manually re-triggers the seeding after service restoration. The Manager is notified at each state change.

**UC-HO-01.EX.5 — RBAC Scope Cannot Be Resolved**
> Trigger: At step 6, the Semantic Kernel Orchestrator cannot resolve the session's RBAC scope (e.g., the Offboarder's role authorizations are corrupted or the Manager's authority over the Offboarder cannot be verified against the directory service).
> System response: Halts session creation. Displays an error: "Session authorization scope could not be established. Please contact HR Admin." Logs the resolution failure with full directory query traces.
> Final state: No session is created. No partial data is stored. HR Admin investigates and resolves the authorization records; Manager retries from step 2.

---

## Includes, Special Requirements, Assumptions, Notes

| Field | Value |
|---|---|
| **Includes:** | UC-HO-02 *(Conduct AI-Guided Voice Interview)* — unblocked upon completion of this UC. UC-HO-05 *(Configure Handover Interview Prompts)* — unblocked upon completion of this UC. |
| **Special Requirements:** | **Data-Ingestion Governance (v2.1 · supersedes v2.0 Email Scanning Constraint):** Automated context seeding is restricted to approved shared workspaces only — Jira, GitHub (shared repos), Google Drive (shared), SharePoint, Trello, Microsoft Planner. Email (Outlook, Exchange, Gmail), personal directories, individual mailboxes, and private messaging (DMs, Slack DMs, Teams 1:1 chats) are NEVER scanned by the Context Seeding Agent under any condition. This constraint is enforced at the integration layer at the OAuth scope level — the platform does not request the read scopes that would enable scanning these surfaces, so the constraint cannot be bypassed even by misconfiguration. Personal files reach the system only via explicit manual upload by the Offboarder during the interview workflow (UC-HO-02). **Purview PII Gate (Mandatory):** All Graph Connector and shared-workspace adapter ingest must pass through Microsoft Purview classification before being staged in the session workspace. The pipeline must NEVER fall back to unclassified ingest — under classification service unavailability (EX.4), the pipeline halts rather than proceeding without the gate. **RBAC Scope Establishment:** The session's RBAC scope is established at session creation (step 6) and immutable for the session's lifetime. All downstream retrieval calls (UC-HO-02 question generation, UC-ON-01 Playbook synthesis, UC-ON-02 Copilot queries) must inherit this scope and apply security trimming at the retrieval layer (Azure AI Search index filters + Cosmos DB partition-level filters) — NOT via LLM-side redaction. **Performance:** Context seeding (steps 7–9) must complete within 15 minutes for a standard Offboarder with up to 500 Jira tickets, 30 GitHub shared repos, and 1,000 Drive files. A progress indicator must be shown throughout; the Manager must not be blocked from other tasks during seeding. **Token Cost Management:** The Worker Agent (SLM — Phi-3 / GPT-4o-mini) must handle ≥80% of seeding tokens by volume (metadata extraction, structured indexing). The Expert Agent (LLM — GPT-4o) is invoked only for the knowledge-gap inference pass and is bounded by a per-session token ceiling. **Auditability:** The Session ID, configuration choices (shared workspaces selected/excluded, review deadline, Focus Note), Manager ID, seeding completion timestamp, Purview classification counts (ingested vs retained), and the RBAC scope hash must all be recorded in the immutable audit log at session creation as the audit anchor. **Data Minimization:** The Context Seeding Agent must not store raw file content from shared Drive or raw ticket descriptions. Only extracted metadata (project names, tool names, activity frequency, document titles, PR descriptions, wiki page titles) is stored in the Preliminary Knowledge Map. |
| **Assumptions:** | 1. The HR system integration with ART-EEP is operational and syncs departure records within 24 hours of HR confirmation. 2. The Offboarder's Jira, GitHub (shared repos), Google Drive (shared), SharePoint, Trello, and Microsoft Planner accounts are accessible to the Context Seeding Agent via OAuth or service account credentials provisioned during ART-EEP onboarding setup — limited to the read scopes required for shared-workspace metadata only. 3. The Manager initiates the handover session promptly upon receiving the notification — ideally within 24 hours of the departure being confirmed, to maximize interview scheduling time. 4. The organization's data privacy policy permits automated scanning of employee shared-workspace work data (Jira, GitHub shared, Drive shared, SharePoint, Trello, Planner) for knowledge transfer purposes, subject to the constraints defined in Special Requirements. 5. Microsoft Purview is provisioned, configured with the organization's sensitivity labels, and integrated with ART-EEP's Semantic Kernel Orchestrator before go-live. 6. The directory service holding role authorizations and reporting hierarchy (e.g., Entra ID) is the single source of truth for RBAC scope resolution. |
| **Notes and Issues:** | [TBD-1] Confirm the legal basis for automated scanning of Offboarder shared-workspace data under applicable labor and data privacy laws (e.g., PDPA for Vietnam, GDPR for EU-linked entities). Owner: Legal. Due: Sprint 1 — blocker for development. [TBD-2] Define the maximum file/ticket/repo count thresholds for context seeding before performance degrades beyond the 15-minute SLA. Owner: AI Engineer / Infra Lead. Due: Sprint 2. [TBD-3] Clarify whether the Offboarder can view or object to the Preliminary Knowledge Map generated about them (data subject rights). Owner: Legal / HR Lead. Due: Sprint 1 — potential blocker. [TBD-4] Define the per-session token ceiling for the Expert Agent's knowledge-gap inference pass. Owner: AI Engineer / Finance. Due: Sprint 2. [TBD-5] Confirm which Purview sensitivity labels trigger redaction vs full exclusion (AC.4 threshold of 30% is provisional). Owner: HR Lead / Infosec. Due: Sprint 2. [TBD-6] (v2.1) Confirm the policy for handling shared workspaces that nominally include private content (e.g., a "shared" Trello board that contains private member-only cards). Owner: Legal / Infosec. Due: Sprint 2. |

---

## Quality Validation — 20-Point Checklist

| Item | Criterion | Status | Note |
|------|-----------|--------|------|
| C1 | UC Name follows "verb + object", active voice | ✅ | "Initiate Handover Session" |
| C2 | UC is at user-goal level (coffee-break test) | ✅ | Manager opens the wizard, configures, clicks start, and walks away while seeding runs; reviews the map on return |
| C3 | UC ID is unique and follows naming convention | ✅ | UC-HO-01 |
| C4 | Exactly 1 primary actor + 1 clear business goal | ✅ | Manager / formally open the handover pipeline and pre-load the AI Agent with classified, scope-bound contextual intelligence |
| C5 | System boundary is clear | ✅ | Scoped to session creation, RBAC scope establishment, and Purview-gated context seeding of approved shared workspaces; interview → UC-HO-02, prompt config → UC-HO-05 |
| C6 | Actor is a specific role, not "User" | ✅ | "Manager" with named secondary actors including Purview and Semantic Kernel Orchestrator |
| C7 | Description answers WHY + WHAT + OUTCOME | ✅ | Why: AI needs classified, scope-bound context to ask sharp questions safely. What: configure session + RBAC scope + trigger Purview-gated data scan across shared workspaces only. Outcome: session active, classified knowledge map ready, audit anchor written, UC-HO-02 unblocked |
| C8 | Frequency of Use is quantified | ✅ | "5–20 sessions/month" |
| C9 | Preconditions are verifiable | ✅ | All 5 are system-checkable states |
| C10 | Postconditions cover success state and all system changes | ✅ | 8 postconditions covering session record, status, deadline, RBAC scope, classified knowledge map, Offboarder notification, downstream UC unlocks, and audit anchor |
| C11 | Preconditions not confused with Assumptions | ✅ | Preconditions = hard system states (including Purview service availability); Assumptions = integration/policy beliefs |
| C12 | Normal Course: numbered list, one action per step | ✅ | 13 steps, each single-action |
| C13 | Alternates Actor / System with clear subjects | ✅ | Every step has explicit subject including specific Azure / Microsoft components |
| C14 | No embedded if/else/loop in Normal Course | ✅ | All branching in AC and EX sections |
| C15 | Flow runs from trigger to postcondition | ✅ | Step 1 (HR sync detected) → Step 13 (all postconditions met, downstream UCs unblocked) |
| C16 | Each AC specifies trigger condition clearly | ✅ | AC.1 at step 1 (no HR sync); AC.2 at step 4 (shared workspace deselected); AC.3 at step 3 (no shared workspaces available); AC.4 at step 8 (high PII exclusion) |
| C17 | Each Exception has trigger + system response + final state | ✅ | All 5 EXs follow the 3-part structure |
| C18 | Common failure modes covered | ✅ | Seeding failure (EX.1), missing profile (EX.2), critical short notice period (EX.3), Purview unavailable (EX.4), RBAC scope unresolvable (EX.5) |
| C19 | Includes point to existing UCs | ✅ | UC-HO-02 and UC-HO-05 both exist in the UC List |
| C20 | Special Requirements don't duplicate functional requirements | ✅ | All SRs are non-functional (data-ingestion governance, mandatory Purview gate, RBAC scope establishment, performance SLA, token cost management, auditability, data minimization) |

**Result: 20/20 ✅ — UC-HO-01 v2.1 passes all quality checks.**

---

## Change Log

| Version | Date | Changes |
|---|---|---|
| 1.0 | Sprint 1 | Initial specification. |
| 2.0 | Sprint 2 | Named the Semantic Kernel Orchestrator and Planner Agent explicitly (step 6, step 7). Added Microsoft Purview as a mandatory PII classification gate between Graph Connector ingest and the Preliminary Knowledge Map (new step 8). Established session-level RBAC scope at session creation, inherited by all downstream retrieval (step 6, PC.4, PC.8, SR). Renumbered Normal Course from 12 to 13 steps to accommodate the Purview gate. Added AC.4 (high PII exclusion warning), EX.4 (Purview service unavailable), and EX.5 (RBAC scope unresolvable). Added ComplexityScore-aware routing for the Context Seeding Agent — Worker SLM handles ≥80% of seeding tokens; Expert LLM reserved for the knowledge-gap inference pass (step 7, step 9, SR). Added audit anchor entry as a new postcondition (PC.8). Added [TBD-4] and [TBD-5] to the open issues register. |
| **2.1** | **2026-06-02** | **Removed email as an automated data source across the entire UC per the data-ingestion governance rule (CL-087). Actor list, Description, PC.4, PC.5, Normal Course steps 3 / 4 / 6 / 7, AC.2 (repurposed from "Email excluded" to generic "Source deselected"), AC.3 (renamed "No integrated data sources" → "No integrated shared workspaces"), the Special Requirements section (the v2.0 "Privacy — Email Scanning Constraint" replaced with the broader Data-Ingestion Governance SR), and Assumption A.2 / A.4 all updated to reference approved shared workspaces only (Jira / GitHub / Google Drive shared / SharePoint / Trello / Microsoft Planner). The OAuth-scope-layer enforcement is now explicit in the Data-Ingestion Governance SR. Personal files reach the system only via manual upload by the Offboarder during UC-HO-02. Added [TBD-6] covering the edge case of shared workspaces that include private member-only content. Decided by: Stakeholder direction + BA. Spec compliance category: BA Gap (architectural · supersedes v2.0 Email Scanning Constraint).** |

---
*Skill developed by **Phúc NT** · BA Zone · Digital School*
