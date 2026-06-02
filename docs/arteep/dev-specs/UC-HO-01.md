# UC-HO-01 · Initiate Handover Session

### 1. Meta Data

* **Feature Name:** Initiate Handover Session
* **Actor:** Manager (Hà Vy in the canonical demo · Engineering / Sales / People & Culture variants)
* **User Story:** As a Manager, I want to start a handover session for a departing team member so that the AI can capture their tacit knowledge before they leave — with the absolute minimum effort upfront.

### 2. Happy Path (Main Flow)

*Architectural note · the initiation flow is split across three dedicated routes: `/dashboard` (entry point), `/session/[id]/setup` (one-click initiation), `/session/[id]` (command view for monitoring + post-setup work). The wizard pattern (multi-step configuration upfront) was replaced with a one-click action + progressive-disclosure customization, per UX feedback that the multi-step wizard caused user fatigue.*

* **Step 1:** User opens the handover dashboard (`/dashboard`). System displays the "New from HR sync" notification card for the Offboarder with name, role, last working date, source preview chips (Jira, Drive, email), and a `Start setup` CTA on the urgent or pending session card.

* **Step 2:** User clicks `Start setup`. System navigates to the quick-initiate page (`/session/[id]/setup`).

* **Step 3:** System displays the quick-initiate page with everything pre-filled from the HR record · Offboarder identity card, three default tiles (Review deadline = +3 business days, Data sources = all integrated, Estimated seeding time = ~7 min), and a `Customize before starting` collapsed expander for the rare cases that need tweaking. One primary `Start session` CTA dominates the page.

* **Step 4:** User clicks `Start session`. System creates the session record, writes the audit anchor with the manager's authorship + RBAC scope hash, and navigates to the session command view (`/session/[id]`).

* **Step 5:** System runs the seeding pipeline in the background · authorization scope → planner decomposition → source extraction (Jira / Drive / email metadata) → sensitivity classification gate → knowledge-gap inference → preliminary map build. The command view's Overview tab shows live sub-step progress; the Stages tab shows the full 8-stage lifecycle position.

* **Step 6:** System completes seeding and displays the Preliminary Knowledge Map within the command view's Data tab · summary stats (items detected / excluded / in scope / gaps), top 3 projects by activity, list of likely knowledge gaps in yellow callouts, and a "What we excluded" privacy panel (counts only). Manager receives an in-app notification.

* **Step 7:** System notifies the Offboarder, displays an emerald "Session ready" card in the command view, and surfaces two Next Action cards: `Schedule the voice interview` (UC-HO-02, primary) and `Add priority prompts` (UC-HO-05).

* **Outcome:** Session created in `Offboarding In Progress` status. Preliminary Knowledge Map stored in session workspace. Audit anchor written with classification counts and RBAC scope hash. UC-HO-02 and UC-HO-05 unlocked. The manager spent ~10 seconds on the initiation page before the system took over.

### 3. Edge Cases & Error Handling (UI/UX States)

* **E1: Validation / Permission · Offboarder profile not provisioned.** Initiation lookup returns no ART-EEP profile for the person. System displays a blocking error card on the quick-initiate page (replacing the identity card) with `UserX` icon, mono error reference (`UC-HO-01.EX.2 · attempted-uid · not-found`), a 3-step remediation list, and `Email HR Admin` / `Back to dashboard` actions. No partial session record is written.

* **E2: Validation / Permission · RBAC scope cannot resolve.** Directory lookup fails or returns corrupted authorizations when the manager clicks `Start session`. System keeps the quick-initiate page open, displays a blocking error card overlay with `ShieldAlert` icon, mono trace (`UC-HO-01.EX.5 · directory-trace · scope-resolve-failed`), 3-step remediation list, and `Retry` (primary — most causes are sync delays) / `Back to dashboard` actions.

* **E3: System / Network · One data source fails to seed.** Source extraction errors out for one source (e.g., expired OAuth token) after the manager has clicked `Start session`. The command view's Overview tab marks that source `Failed` in the sub-step list, lets other sources complete, displays a yellow warning banner on the Knowledge Map when seeding finishes, and offers `Retry [source] after re-auth` and `Continue with partial seed` actions side by side. Session is still created.

* **E4: System / Network · Sensitivity classification service unavailable.** Classification gate cannot be reached during seeding. System pauses the pipeline (does NOT fall back to unclassified content), marks the gate stage `paused` in yellow on the command view's Overview tab, and shows an auto-retry panel with last-attempt / next-retry / time-remaining counters (15-min interval, 4-hour window). After 4 hours without recovery, Platform Admin gets a high-priority alert.

* **E5: User Branching · Manual initiation (no HR sync yet).** User enters from the dashboard's `+ Create a manual handover session` dashed-button at the bottom of the active list. System navigates to the quick-initiate page with empty identity fields requiring manual entry (name, role, department, last working date) and the eyebrow changes from "From HR sync" to "Manual initiation · audit-flagged". An info banner above the form reads: "This session will be flagged in the audit trail · `Manual Initiation`. HR Admin will be notified." Same one-click `Start session` CTA once fields are valid.

* **E6: User Branching · Manager wants to customize before starting.** User clicks the `Customize before starting` expander on the quick-initiate page. System expands the expander inline (no navigation) and reveals optional fields · editable review deadline, data-source checkboxes (with the standing `Subject lines and participants only · email content is never read or stored` note inline at the email row, per CL-015), focus note textarea, successor reassignment. `Start session` CTA stays in place at the bottom of the page · same one click to ship.

* **E7: User Branching · No integrated sources available.** When the quick-initiate page loads, system finds no integrations connected for the Offboarder's account. The Data sources tile changes to a dashed-border "No integrated data sources found" placeholder with a `Lock` icon, the page surfaces a `Session flag · No Context — Generic Interview` pill, and the primary CTA changes to `Start session · no seeding`. UC-HO-02 will fall back to a role-based question bank.

* **E8: User Branching · Last working date is fewer than 3 business days away.** Quick-initiate page detects an urgent timeline before display. The page renders a 2px rose left-border banner above the identity card with `AlertOctagon` icon and an `Urgent` pill: "Critical · [Name]'s last working date is in [N] business days." Auto-reduces the Review Deadline tile to last-working-day minus 1; the tile gets a rose border and an `Auto-reduced` pill. Maximum override (in the Customize expander) is the last working day. Offboarder's notification carries an urgency flag.

* **E9: User Branching · >30% sensitivity exclusion after seeding.** Classification redacts more than 30% of one source's content. The command view's Overview tab renders a yellow banner above the Knowledge Map summary: "A significant portion of [Name]'s activity involves sensitive content. [N]% was excluded by sensitivity classification. Interview questions may be less detailed for those areas." The banner offers TWO parallel actions: `Add priority prompts` (primary, links to UC-HO-05) and `Request override review` (secondary).

* **E10: User Branching · Manager pauses on the quick-initiate page.** User opens the quick-initiate page but doesn't click `Start session` within a session-timeout window. System retains the page state (no draft is written to the audit trail until `Start session` is clicked). On return, the page reloads with the same pre-filled defaults; nothing is lost, nothing is committed.
