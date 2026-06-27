# ART-EEP — Mockup Review Round 4 (2025-06-26)

*Post-R3 review. No code changes — apply via Claude Code.*

---

## PART A: Manager View

### MV-R4-01: "Start session" navigates to Create Session with pre-fill ✅ LOCKED
**Issue:** Clicking "Start session" on an HRIS departure from the dashboard currently opens a generic page.
**Change:** Navigate to `/session/new?employee=<id>` (or equivalent) with the selected employee's info pre-filled:
- Name, email, department, last day already populated from HRIS
- Page skips the manual form and goes directly to the **board selection** step
- "Back" returns to dashboard

**File:** `components/mockups/ha-vy-handover-dashboard.jsx` + `components/mockups/create-session.jsx`

### MV-R4-02: Manual flow — Trello link is REQUIRED ✅ LOCKED

**⚠️ OVERRIDE from R3-02:** Previously email was the Trello lookup key. Now Trello link is a required field.

**Updated manual creation fields:**

| Field | Required | Type | Purpose |
|---|---|---|---|
| Full name | Yes | Text | Display name for the session |
| Email | Yes | Text | Invitation / identification |
| Department | Yes | Dropdown | Engineering, Sales, People & Culture, etc. |
| Last day | Yes | Date picker | Auto-calculates review deadline |
| **Trello link** | **Yes** | **URL input** | **Direct data source — board or workspace URL. System discovers cards from this link.** |
| Role / Title | No | Text | Context ("Senior Backend Engineer") |

The info card text should update: "Paste the employee's Trello board or workspace URL. The system will discover their cards and activity from this link."

**File:** `components/mockups/create-session.jsx`

### MV-R4-03: Edge case — Departure Pending + Active Session ✅ LOCKED
**Issue:** An employee appears in HRIS as departing but already has an active session. The dashboard would show them in both the departure list AND as a session card — duplication.
**Decision (Option B):** Once a session exists for an employee, **remove them from the departure list**. They only appear as a session card. The departure list only shows people WITHOUT sessions.

**Implementation:**
- When rendering the departure list, filter out any employee whose email/ID matches an existing active session
- If all HRIS departures have active sessions, the departure list section is hidden entirely
- The dashboard shows only session cards for people with active sessions

**File:** `components/mockups/ha-vy-handover-dashboard.jsx`

### MV-R4-04: Collecting Data state — animation only, NO orbital
**Issue:** The "Collecting Data" state incorrectly shows the orbital artwork. Orbital is for empty/pending states, not active collection.
**Change:** Remove the orbital from the Collecting Data state. Show ONLY the "organizing knowledge" AI categorization animation (the cartoon explainer from §6). The animation plays while the system crawls Trello boards and categorizes cards.
**File:** `components/mockups/session-command-view.jsx`

---

## PART B: Offboarder View

### OV-R4-01: Logs tab enabled in all states except Pending ✅ LOCKED

**⚠️ OVERRIDE from R2 tab matrix:** Previously Logs was disabled in most Offboarder states. Now it's available everywhere except Pending.

**Updated Offboarder tab matrix:**

| State | Overview / Queue | Data | Logs |
|---|---|---|---|
| Pending (Not started) | ✅ (waiting message) | ❌ disabled | ❌ disabled |
| Collecting | ✅ (waiting message) | ❌ disabled | ✅ enabled |
| Capture (active) | ✅ (question queue) | ❌ hidden | ✅ enabled |
| Capture (all answered) | ✅ (celebration + read-only queue) | ❌ hidden | ✅ enabled |
| Complete | ✅ (thank-you page) | ❌ hidden | ✅ enabled |

**File:** `components/mockups/session-command-view.jsx`

### OV-R4-02: "All Answered" must show ALL historical Q&A, not truncated
**Issue:** Current mockup only shows the 2 most recent answered questions. Should show the complete historical queue.
**Change:** Display ALL questions and answers in the "All Answered" state — no truncation, no "show more" initially hidden. The full queue is visible as a scrollable read-only list below the celebration header.
**File:** `components/mockups/session-command-view.jsx`

### OV-R4-03: Remove "Ask about this module" from Offboarder's gap context panel
**Issue:** The Offboarder's "See in context" side panel for gap questions (OV-R05 from R2) has an "Ask about this" button. This is a KG Explorer / chat feature — the Offboarder doesn't use the chat copilot.
**Change:** Remove the "Ask about this module" / "Ask about this" button from the Offboarder's gap context panel. Keep the panel informational only:
- Module name
- Gap description
- "Why this was flagged" reasoning
- Sibling questions
- Cards in module
- NO action button at the bottom

**File:** `components/mockups/session-command-view.jsx`

---

## PART C: Coworker View

### CW-R4-01: Implement "See in context" + functional "Ask about this gap" ✅ LOCKED
**Issue:** Coworker doesn't have the "See in context" link on their questions, and the "Ask about this gap" button is not functional.

**Change 1 — "See in context" link:**
- Each question in the Coworker's view has a "See in context" link
- For card-based questions → opens the card context side panel (description, checklist, files, other Q&A)
- For AI gap questions → opens the gap context side panel (module, gap description, "why flagged" reasoning, sibling questions, cards in module)

**Change 2 — "Ask about this gap" button is FUNCTIONAL:**

The "Ask about this gap" button at the bottom of the Coworker's gap context panel creates a new human question targeting that gap.

**Flow:**
1. Coworker clicks "See in context" on a gap question → gap context panel opens
2. At the bottom: "Ask about this gap" button (violet, full-width)
3. Coworker clicks → an inline question input field appears INSIDE the panel, below the button
4. Coworker types their question (e.g., "What's the manual failover procedure when Stripe goes down?")
5. Clicks "Ask" → question is created:
   - Added to the gap's question list (visible in "Questions from this gap" section above)
   - Appears in the Offboarder's queue as a new item
   - Tagged as: "Coworker · Payment Service · waiting"
6. Input field clears, ready for another question

**What this is NOT:**
- NOT "Generate question" (that's AI-generated, Manager-only via MV-R4-04)
- NOT "Needs more" (that sends an existing answer back for revision)
- NOT KG Explorer chat (that navigates the graph)
- It's simply: "I see this gap, I want to ask the Offboarder something specific about it"

**Button behavior per role:**

| Role | Gap context panel | "Ask about this gap" button |
|---|---|---|
| Manager | Has "Generate question" (AI) on the Data tab + can manually add questions | Button shows but labeled "Ask about this gap" — creates human question |
| Coworker | Opens via "See in context" | ✅ **Active** — creates human question targeting the gap |
| Offboarder | Opens via "See in context" | ❌ **Removed** (OV-R4-03) — Offboarder answers, doesn't ask |

**File:** `components/mockups/session-command-view.jsx`

### CW-R4-02: Logs tab enabled in all states except Pending ✅ LOCKED

**⚠️ OVERRIDE from R2 tab matrix:** Previously Logs was disabled in Deliver/Complete for Coworker. Now it's available everywhere except Pending.

**Updated Coworker tab matrix:**

| State | Overview | Data | Logs |
|---|---|---|---|
| Pending (Collecting) | ✅ | ❌ disabled | ❌ disabled |
| Prepare | ✅ | ✅ | ✅ |
| Capture | ✅ | ✅ | ✅ |
| Start Deliver | ✅ (read-only summary) | ❌ disabled | ✅ enabled |
| Complete | ✅ (celebration page) | ❌ disabled | ✅ enabled |

**File:** `components/mockups/session-command-view.jsx`

---

## PART D: Updated cross-role tab state matrix (supersedes R2 Part D)

### Manager (unchanged from R2)

| State | Overview | Data | Logs |
|---|---|---|---|
| Departure Pending | ✅ (orbital) | ❌ disabled | ❌ disabled |
| Collecting Data | ✅ (animation only, no orbital) | ❌ disabled | ❌ disabled |
| Prepare | ✅ | ✅ | ✅ |
| Capture | ✅ | ✅ | ✅ |
| Start Deliver | ✅ (Deliver review) | ❌ disabled | ❌ disabled |
| Complete | ✅ (completion banner) | ❌ disabled | ❌ disabled |

### Offboarder (UPDATED — Logs now enabled in most states)

| State | Overview / Queue | Data | Logs |
|---|---|---|---|
| Pending (Not started) | ✅ | ❌ disabled | ❌ disabled |
| Collecting | ✅ | ❌ disabled | ✅ **enabled** |
| Capture (active) | ✅ (queue) | ❌ hidden | ✅ **enabled** |
| Capture (all answered) | ✅ (celebration + full queue) | ❌ hidden | ✅ **enabled** |
| Complete | ✅ (thank-you) | ❌ hidden | ✅ **enabled** |

### Coworker (UPDATED — Logs enabled in Deliver/Complete)

| State | Overview | Data | Logs |
|---|---|---|---|
| Pending (Collecting) | ✅ | ❌ disabled | ❌ disabled |
| Prepare | ✅ | ✅ | ✅ |
| Capture | ✅ | ✅ | ✅ |
| Start Deliver | ✅ (read-only) | ❌ disabled | ✅ **enabled** |
| Complete | ✅ (celebration) | ❌ disabled | ✅ **enabled** |

---

## PART E: Trello link scenarios — session creation analysis ✅ LOCKED

*Analysis of when and why the Trello link is needed across all session creation paths.*

### Core principle

Without Trello data, the system has nothing to crawl → no cards → no modules → no AI categorization → no gaps → no knowledge map. **A session without a Trello data source is an empty shell for the POC.**

### Scenario matrix

| # | Scenario | Trello link source | Manager provides link? | What happens |
|---|---|---|---|---|
| 1 | **HRIS sync + Step Zero mapped** | Auto from Step Zero config | No — system discovers boards | System finds boards via department-source mapping. Manager just selects boards → Start session. |
| 2 | **HRIS sync + Step Zero NOT mapped** | Manager must provide | Yes | System can't discover boards for this department. Shows: "We couldn't find a Trello workspace for Sales. Paste a Trello board link to continue." Manager provides link → board selection → Start session. |
| 3 | **Manual creation** | Manager must provide | Yes — always required | No HRIS data, no Step Zero mapping. Manager fills form including Trello link → board selection → Start session. |
| 4 | **Employee doesn't use Trello** | N/A — blocked for POC | N/A | POC only supports Trello. Show: "Trello is the only supported data source in this version. Contact the admin to configure additional connectors." Session cannot start. |
| 5 | **Multiple Trello workspaces** | Manager adds additional links | First link required, extras optional | Board selection shows boards from first link. "Add another Trello link" option lets Manager add boards from a second workspace. |

### Trello link validation

| Check | Behavior |
|---|---|
| Valid board URL | System discovers cards from that board → board appears in selection |
| Valid workspace URL | System discovers ALL boards in workspace → Manager selects relevant ones |
| Invalid URL / 404 | Error: "Could not access this Trello link. Check the URL and make sure it's public or shared with the system." |
| Valid URL, zero cards after filtering | Warning: "0 cards found after filtering. The board may not contain relevant work data." Manager can still start (degraded experience — Q&A only, no modules/cards) or try a different board. |
| Valid URL, board is empty | Error: "This Trello board has no cards." |

### What email is used for (NOT for Trello lookup)

| Purpose | How email is used |
|---|---|
| **Invitation** | Send the session invitation to the Offboarder |
| **Identification** | Display the Offboarder's identity in the session |
| **Notification** | Notify when new questions arrive, session status changes |
| **NOT for Trello lookup** | Trello link is the direct connection — email may not match Trello account |

### Impact on Create Session page

**HRIS path:** Trello link may or may not be needed depending on Step Zero config. If not mapped, the board selection step prompts for a link.

**Manual path:** Form has 6 fields (5 required + 1 optional):
```
Full name *     [_______________]
Email *         [_______________]
Department *    [▼ Select ______]
Last day *      [📅 Select date_]
Trello link *   [🔗 Paste URL___]
Role / Title    [_______________]  (optional)
```

Info card below Trello field: "Paste the employee's Trello board or workspace URL. The system will discover their cards and activity from this link."

---

## Verification checklist

- [ ] Dashboard: clicking "Start session" on HRIS departure → navigates to Create Session with pre-fill, skips to board selection
- [ ] Create Session: manual form has Trello link as required field (not email-based lookup)
- [ ] Create Session: Trello link validation — valid URL shows boards, invalid shows error, empty board shows error, zero cards after filtering shows warning
- [ ] Create Session: "Add another Trello link" option on board selection step
- [ ] Create Session: Scenario 2 — HRIS sync without Step Zero mapping prompts for Trello link
- [ ] Create Session: Scenario 4 — employee without Trello shows "only supported data source" message
- [ ] Dashboard: employee with active session is NOT shown in departure list (no duplication)
- [ ] Session Collecting Data: shows AI animation ONLY, no orbital
- [ ] Offboarder: Logs tab enabled in Collecting, Capture, All Answered, and Complete (disabled only in Pending)
- [ ] Offboarder All Answered: shows ALL historical Q&A (no truncation to 2)
- [ ] Offboarder gap context panel: no "Ask about this" button
- [ ] Coworker: "See in context" link works for both card questions and gap questions
- [ ] Coworker: "Ask about this gap" button is functional — click → inline input → creates human question → appears in Offboarder queue
- [ ] Coworker: Logs tab enabled in Deliver and Complete (disabled only in Pending/Collecting)
- [ ] Tab states match Part D matrix for all three roles

---

*End of R4. Apply via Claude Code. Delete this file after verified.*
