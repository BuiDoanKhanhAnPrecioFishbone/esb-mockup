# UC-HO-01 · Initiate Handover Session

### 1. Meta Data

* **Feature Name:** Initiate Handover Session
* **Actor:** Manager (Hà Vy in the canonical demo · Engineering / Sales / People & Culture variants)
* **User Story:** As a Manager, I want to start a handover session for a departing team member so that the AI can capture their tacit knowledge before they leave.

### 2. Happy Path (Main Flow)

* **Step 1:** User opens the handover dashboard. System displays the "New from HR sync" notification card for the Offboarder with name, role, last working date, source preview chips (Jira, Drive, email), and an "Initiate handover session" CTA.
* **Step 2:** User clicks "Initiate handover session". System opens the Session Setup screen with three panels pre-filled from the HR record: Session Details, Review Deadline (default +3 business days), Data Sources (all integrated sources pre-selected).
* **Step 3:** User optionally adds a Focus Note in the free-text panel. System keeps the "Start session & begin context seeding" primary CTA active.
* **Step 4:** User clicks "Start session & begin context seeding". System creates the session record, writes the audit anchor, and navigates to the Context Seeding Progress screen.
* **Step 5:** System runs the seeding pipeline: authorization scope → planner decomposition → source extraction (Jira / Drive / email) → sensitivity classification gate → knowledge-gap inference → preliminary map build. UI shows each stage with live status and timing.
* **Step 6:** System displays the Preliminary Knowledge Map: summary stats (items detected / excluded / in scope / gaps), top 3 projects by activity, list of likely knowledge gaps in yellow callouts, and a "What we excluded" privacy panel (counts only).
* **Step 7:** System notifies the Offboarder in-app, displays an emerald "Session ready" card, and surfaces two Next Action cards: "Schedule the voice interview" (UC-HO-02, primary) and "Add priority prompts" (UC-HO-05).

* **Outcome:** Session created in `Offboarding In Progress` status. Preliminary Knowledge Map stored in session workspace. Audit anchor written with classification counts and RBAC scope hash. UC-HO-02 and UC-HO-05 unlocked.

### 3. Edge Cases & Error Handling (UI/UX States)

* **E1: Validation / Permission · Offboarder profile not provisioned.** Initiation lookup returns no ART-EEP profile for the person. System displays a blocking error card with `UserX` icon, mono error reference (`UC-HO-01.EX.2 · attempted-uid · not-found`), a 3-step remediation list, and `Email HR Admin` / `Back to dashboard` actions. No partial session record is written.

* **E2: Validation / Permission · RBAC scope cannot resolve.** Directory lookup fails or returns corrupted authorizations. System displays a blocking error card with `ShieldAlert` icon, mono trace (`UC-HO-01.EX.5 · directory-trace · scope-resolve-failed`), 3-step remediation list, and `Retry` (primary — most causes are sync delays) / `Back to dashboard` actions.

* **E3: System / Network · One data source fails to seed.** Source extraction errors out for one source (e.g., expired OAuth token). System marks that source `Failed` in the pipeline view, lets other sources complete, displays a yellow warning banner on the Knowledge Map ("Context seeding from [source] could not be completed"), and offers `Retry [source] after re-auth` and `Continue with partial seed` actions side by side. Session is still created.

* **E4: System / Network · Sensitivity classification service unavailable.** Classification gate cannot be reached. System pauses the pipeline (does NOT fall back to unclassified content), marks the gate stage `paused` in yellow, and shows an auto-retry panel with last-attempt / next-retry / time-remaining counters (15-min interval, 4-hour window). After 4 hours without recovery, Platform Admin gets a high-priority alert.

* **E5: User Branching · Manual initiation (no HR sync yet).** User enters from the Offboarding module's `Create manual handover session` instead of an HR-sync notification. System shows a manual-entry form (name, role, department, last working date) with an info banner: "This session will be flagged in the audit trail · `Manual Initiation`. HR Admin will be notified." Continue routes to the standard Session Setup screen with the manual entries pre-filled.

* **E6: User Branching · Manager deselects email source.** User unchecks the email source in step 3. System shows an inline yellow notice under the Data Sources panel: "Email data excluded — knowledge map coverage may be reduced for communication-heavy work." The flow continues unchanged; email metadata is excluded from seeding.

* **E7: User Branching · No integrated sources available.** Step 3 finds no integrations connected for the Offboarder's account. System renders a dashed-border "No integrated data sources found" placeholder with a `Lock` icon, surfaces a `Session flag · No Context — Generic Interview` pill, and changes the CTA to "Start session · no seeding". UC-HO-02 will fall back to a role-based question bank.

* **E8: User Branching · Last working date is fewer than 3 business days away.** Step 3 detects an urgent timeline. System renders a 2px rose left-border banner with `AlertOctagon` icon and an `Urgent` pill: "Critical · [Name]'s last working date is in [N] business days." Auto-reduces the Review Deadline to last-working-day minus 1; the deadline field gets a rose border and an `Auto-reduced` pill. Maximum override is the last working day. Offboarder's notification carries an urgency flag.

* **E9: User Branching · >30% sensitivity exclusion after seeding.** Classification redacts more than 30% of one source's content. System renders a yellow banner above the Knowledge Map summary: "A significant portion of [Name]'s activity involves sensitive content. [N]% was excluded by sensitivity classification. Interview questions may be less detailed for those areas." The banner offers TWO parallel actions: `Add priority prompts` (primary) and `Request override review` (secondary).
