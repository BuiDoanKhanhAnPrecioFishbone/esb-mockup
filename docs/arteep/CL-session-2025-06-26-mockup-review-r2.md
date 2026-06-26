# ART-EEP — Mockup Review Round 2 (2025-06-26)

*Review after CL-130–141 were applied by Claude Code. No code changes — issues documented for next build.*
*Companion to the CL-130–141 build summary provided by the user.*

---

## PART A: Coworker View

### CW-R01: "Needs more" vs "Ask follow-up" — two distinct actions ✅ LOCKED
**Issue:** "Needs more" and "Ask follow-up" may coexist as labels. They're different actions.
**Decision:** Both actions exist but serve different purposes. Remove any "Ask follow-up" LABEL — use "Ask a question" instead.

#### ↩ Needs more (yellow)
- **Where:** Button on an answered card (next to "Satisfy")
- **What it does:** Sends the SAME answer back to the Offboarder for improvement
- **Flow:**
  1. Coworker clicks "Needs more" on an answered question
  2. A note field appears: "What's missing?" with a text area
  3. Coworker writes feedback (e.g., "What about per-user limits?")
  4. Clicks "Send back"
  5. Offboarder sees: question with "↩ Revision requested" badge, original answer struck-through, Coworker's note, and a fresh answer field to resubmit
- **Result:** Same question, better answer. One Q&A thread.

#### + Ask a question (violet)
- **Where:** Button on the Coworker dashboard card OR on the Data tab (per card)
- **What it does:** Creates a brand-new question on the same (or different) card
- **Flow:**
  1. Coworker navigates to Data tab → finds a card → writes a new question
  2. New question appears in Offboarder's queue as a separate item
  3. Original Q&A stays untouched (satisfied or otherwise)
- **Result:** New question, new answer. Separate Q&A thread.

**File:** `components/mockups/session-command-view.jsx` + `ha-vy-handover-dashboard.jsx`

### CW-R02: Logs tab must exist
**Issue:** Coworker view is missing a Logs tab.
**Change:** Add Logs tab to Coworker session view. Same log format as Manager (questions asked, answers submitted, reviews done). No file-upload entries.
**File:** `components/mockups/session-command-view.jsx`

### CW-R03: Tab state during Collecting — only Overview active
**Issue:** Data and Logs tabs should be disabled when session is in "Collecting" state — there's no data yet.
**Change:** During Collecting state:
- Overview: ✅ enabled
- Data: ❌ disabled (grayed out, tooltip "Data will be available after collection")
- Logs: ❌ disabled
**File:** `components/mockups/session-command-view.jsx`

### CW-R04: Disable Data and Logs during Start Deliver and Complete
**Issue:** Coworker shouldn't access Data or Logs after Deliver starts.
**Change:** During Start Deliver and Complete states:
- Overview: ✅ enabled (read-only summary)
- Data: ❌ disabled
- Logs: ❌ disabled
**File:** `components/mockups/session-command-view.jsx`

### CW-R05: Use Offboarder finishing artwork for Coworker Complete
**Issue:** Coworker Complete state should have the same celebration feel as Offboarder.
**Change:** Reuse the connected-nodes celebration illustration from the Offboarder Complete page. Adapt text: "Session complete" + relevant stats for the Coworker role (questions asked, answers reviewed, etc.).
**File:** `components/mockups/session-command-view.jsx`

---

## PART B: Manager View

### MV-R01: Dashboard + session empty states — corrected orbital logic ✅ LOCKED

**⚠️ The orbital is NOT for "zero departures." It's for "departures exist but no sessions started."**

#### Dashboard empty states (Manager)

| Condition | What shows |
|---|---|
| HRIS departures exist + **zero active sessions** | Orbital illustration + "2 upcoming departures" + HRIS departure list + "Create session" CTA. The orbital = "knowledge is waiting to be captured." |
| HRIS departures exist + **active sessions** | Greeting banner + session cards + activity feed (normal dashboard) |
| Zero HRIS departures + zero sessions | Simple text: "No upcoming departures. Sync from HRIS to check." + "Sync now" button. No orbital. |

#### Session "Departure Pending" state
Same orbital illustration used when a session exists but data collection hasn't started yet. "Departure Pending" = waiting for the crawl to begin.

**Files:** `components/mockups/ha-vy-handover-dashboard.jsx` + `components/mockups/session-command-view.jsx`

### MV-R02: Fix `·` (middle dot / unicode) rendering
**Issue:** Middle dot characters showing as garbled text in some places.
**Change:** Replace HTML entities and escaped unicode with actual `·` character (U+00B7) throughout. Audit all JSX files for `\u00b7`, `&middot;`, or Babel-mangled entities.
**Files:** All mockup JSX files — search globally.

### MV-R03: Disable Data and Logs during Collecting Data state
**Issue:** Same as CW-R03 but for Manager. No data to show during collection.
**Change:** During "Collecting Data" state:
- Overview: ✅ enabled (shows crawl progress, coworker network)
- Data: ❌ disabled (tooltip "Data will be available after collection")
- Logs: ❌ disabled
**File:** `components/mockups/session-command-view.jsx`

### MV-R04: AI question deletion confirmation + "Generate question" button ✅ LOCKED
**Issue:** Deleting an AI question is irreversible (not regenerated). Needs safeguard. Also need a way to generate NEW questions for gaps.
**Changes:**

1. **Deletion confirmation dialog:**
   - Trigger: click trash icon on any AI-generated question
   - Dialog: "Delete this question? The AI won't regenerate it."
   - Buttons: "Delete" (destructive, rose) / "Cancel" (secondary)
   - Simple centered modal, not inline

2. **"+ Generate question" button on gap rows:**
   - Location: inside each gap row, after the last question
   - Click: AI generates a new question targeting this gap
   - The Manager can then edit/delete it like any AI question
   - Gives the Manager a way to get fresh questions after deleting irrelevant ones

**File:** `components/mockups/session-command-view.jsx`

### MV-R05: Deliver page — FULL DEFINITION ✅ LOCKED (UPDATED)

**⚠️ RULE CHANGE: Commit is NO LONGER blocked by unresolved gaps.**

**Previous rule (overridden):** Commit disabled if unresolved gaps remain.
**New rule:** Commit is **always allowed**. Unresolved gaps are stored as "potential knowledge" in the session.

**When does Deliver activate?**
Manager clicks "Start Deliver" when satisfied with Capture. This locks the Offboarder's queue (no more answers accepted).

**Layout:**

#### Header
- "Ready to commit" heading
- "Review Minh Lê's knowledge before committing to the Knowledge Graph." subtitle

#### Knowledge summary (3 stat cards in grid)
- 42 entries total
- 14 questions answered
- 5 modules covered

#### Resolved gaps section
- List of all resolved gaps with green checkmarks
- Each shows: gap name → how resolved ("answered by Minh Lê" / "dismissed by Hà Vy")
- Collapsible if >5 items

#### Unresolved gaps section (if any)
- List with yellow info icons (NOT red blockers)
- Each shows: gap name → status ("1 question waiting" / "0 questions")
- **Info banner (NOT a blocker):** "2 gaps will remain unresolved and stored as potential knowledge. If relevant information is found during chunking, it will help resolve them. Otherwise, they remain logged for manual resolution."
- This section is **informational only** — it does NOT block the Commit button

#### Sanitization note
- Info card: "N entries contain sensitive content that will be sanitized before commit."
- Light blue or gray background, informational only

#### Action buttons
- **"Back to Capture"** — secondary button, returns to Capture phase (Offboarder queue reopens, new answers accepted)
- **"Commit to KG"** — primary button, **always enabled** regardless of gap status

#### Confirmation modal (on Commit click)
- "Commit 42 entries to the Knowledge Graph?"
- "This action cannot be undone."
- Entry count + sanitization note summary
- If unresolved gaps exist: "2 unresolved gaps will be preserved for future resolution."
- Buttons: "Commit" (primary, violet) / "Cancel" (secondary)

#### After commit
- Session moves to Complete state
- Manager sees emerald completion banner ("Minh Lê's knowledge has been committed")
- Offboarder sees thank-you page (OV-04)
- Coworker sees celebration page (CW-R05)
- **Resolved gaps** → normal purple nodes in KG Explorer
- **Unresolved gaps** → stay in session view as logged items, visible to Manager/Coworkers. NOT in KG Explorer (no knowledge to commit). Manager or Coworkers can manage resolution later (e.g., manually creating a Trello card to resolve themselves).

#### Post-commit unresolved gap lifecycle
1. Gaps remain visible in the session's Complete state (read-only list)
2. During the chunking process, if relevant information is found, it can help resolve them automatically
3. If not auto-resolved, Manager/Coworkers can view them and take manual action (e.g., create a Trello card)
4. Unresolved gaps do NOT appear as nodes in the KG Explorer — they have no committed knowledge content

**File:** `components/mockups/session-command-view.jsx` — new `DeliverContent` or `DeliverReview` function

---

## PART C: Offboarder View

### OV-R01: Logs tab disabled in "Not started" state
**Issue:** Offboarder shouldn't see Logs before the session starts.
**Change:** Logs tab disabled (grayed out) when session is in "Not started" state. Enabled once Capture begins.
**File:** `components/mockups/session-command-view.jsx`

### OV-R02: "All answered" vs "Complete" — exact difference ✅ LOCKED

| Aspect | All answered | Complete |
|---|---|---|
| **Phase** | Still in **Capture** | **Deliver** finished |
| **What happened** | Offboarder answered every question in queue | Manager committed to KG |
| **Permanent?** | No — new questions can arrive, state reverts to active queue | Yes — session is done, no more changes |
| **What Offboarder sees** | Celebration header ("You're all caught up!") + full answered queue (read-only) + note "New questions may still come in" | Thank-you page with stats + 3-step timeline. No queue. |
| **Can Offboarder act?** | Yes — if new questions arrive, they can answer | No — read-only farewell page |

### OV-R03: Allow editing answers after submitting ✅ LOCKED
**Decision:** Yes, Offboarder can edit submitted answers **during Capture only**.
- Each submitted answer shows an "Edit" button (pencil icon, hover)
- Click → answer field becomes editable again → Save / Cancel
- Once Deliver starts, all answers are locked (no Edit button)
- Edited answers show a subtle "Edited" badge with timestamp
**File:** `components/mockups/session-command-view.jsx`

### OV-R04: "All answered" must show historical queue ✅ LOCKED
**Issue:** Current design hides the question queue when all are answered. It should stay visible.
**Change:**
- Keep the full answered queue visible (read-only — no answer inputs, no Submit)
- Add celebration header ABOVE the queue: "You're all caught up!" + contribution stats
- Add note below header: "New questions may still come in from Hà Vy or coworkers."
- Each answered question shows: question text, the submitted answer (read-only), who asked, module tag, "Satisfied" / "Needs more" status if reviewed
- The queue IS the historical record — don't hide it
**File:** `components/mockups/session-command-view.jsx`

### OV-R05: Gap questions "See in context" — FULL DEFINITION ✅ LOCKED

**Problem:** AI gap questions don't reference a specific card — they reference a MODULE-level gap. So "See in context" can't show a card.

**Solution:** Show the **module context** instead of a card.

**Side panel content for gap questions (480px right drawer):**

1. **Header:** "Gap context" (not "Card context")
2. **Module name:** e.g., "Payment Service"
3. **Gap description:** e.g., "No disaster recovery procedures documented"
4. **Detected by:** "AI analysis" badge
5. **"Why this was flagged"** section:
   - AI's reasoning: "Payment Service has 12 cards covering retry logic, webhooks, and currency handling, but no card addresses disaster recovery or failover procedures."
   - This explains WHY the gap exists — what's present vs what's missing
6. **Other questions from this gap:** list of sibling questions with their status (answered/waiting)
7. **Cards in this module:** scrollable list for reference — shows what IS covered
8. **"Ask about this"** button at bottom (bridges to chat if KG Explorer is involved)

**Visual distinction from card context:**
- Header says "Gap context" not "Card context"
- Yellow left border (gap color) instead of violet (card color)
- Gap sparkle icon (✨) in the header

**File:** `components/mockups/session-command-view.jsx`

---

## PART D: Cross-role tab state matrix

*Complete reference for which tabs are enabled/disabled per state per role.*

### Manager

| State | Overview | Data | Logs |
|---|---|---|---|
| Departure Pending | ✅ (empty state + orbital) | ❌ disabled | ❌ disabled |
| Collecting Data | ✅ (crawl progress) | ❌ disabled | ❌ disabled |
| Prepare | ✅ | ✅ | ✅ |
| Capture | ✅ | ✅ | ✅ |
| Start Deliver | ✅ (Deliver review page) | ❌ disabled | ❌ disabled |
| Complete | ✅ (completion banner) | ❌ disabled | ❌ disabled |

### Offboarder

| State | Overview / Queue | Data | Logs |
|---|---|---|---|
| Not started | ✅ (waiting message) | ❌ disabled | ❌ disabled |
| Collecting | ✅ (waiting message) | ❌ disabled | ❌ disabled |
| Capture (active) | ✅ (question queue) | ❌ hidden | ❌ disabled |
| Capture (all answered) | ✅ (celebration + read-only queue) | ❌ hidden | ❌ disabled |
| Complete | ✅ (thank-you page) | ❌ hidden | ❌ disabled |

### Coworker

| State | Overview | Data | Logs |
|---|---|---|---|
| Collecting | ✅ | ❌ disabled | ❌ disabled |
| Prepare | ✅ | ✅ | ✅ |
| Capture | ✅ | ✅ | ✅ |
| Start Deliver | ✅ (read-only summary) | ❌ disabled | ❌ disabled |
| Complete | ✅ (celebration page) | ❌ disabled | ❌ disabled |

---

## PART E: Session Creation flow ✅ LOCKED

**File:** `components/mockups/create-session.jsx`

### Two creation paths

Sessions can be created in two ways. Both converge at the board selection step.

#### Path 1: HRIS sync (primary)
1. System auto-syncs upcoming departures from HRIS (name, email, department, last day already known)
2. Manager sees the list on the Create Session page
3. Clicks "Configure →" on a person → expands to board selection
4. System already looked up their email in Trello → boards discovered
5. Manager selects boards → "Start session"

#### Path 2: Manual creation
1. Manager fills in a form: Name, Email, Department, Last day, Role (optional)
2. System uses the **email to find the employee's Trello account** and discover their boards
3. If found: shows discovered boards for selection (same UI as HRIS path)
4. If not found: error state — "No Trello account found for this email. Check the address or ask the employee to confirm."
5. Manager selects boards → "Start session"

**Key insight:** The email is the lookup key for Trello — no separate "Trello link" field needed.

### Manual creation fields

| Field | Required | Type | Purpose |
|---|---|---|---|
| Full name | Yes | Text | Display name for the session |
| Email | Yes | Text | **Trello lookup key** — finds their account, discovers boards |
| Department | Yes | Dropdown | Engineering, Sales, People & Culture, etc. Helps with gap analysis |
| Last day | Yes | Date picker | Auto-calculates review deadline (last day minus 4 days) |
| Role / Title | No | Text | Context ("Senior Backend Engineer") |

### Page states

| State | What shows |
|---|---|
| **HRIS departures exist** | "Synced from HRIS" header with "Sync now" button + departure list (accordion cards). Below, "or" divider + manual creation form. |
| **Zero HRIS departures** | "No upcoming departures from HRIS" message + "Sync now" button + manual creation form. No orbital (orbital is dashboard-only). |
| **After manual form submit (Trello found)** | Person's info card + "Found in Trello ✓" + discovered boards with checkboxes (suggested/not suggested) + "Start session →" |
| **After manual form submit (Trello NOT found)** | Error: "No Trello account found for this email." + options to try different email or skip (manual Q&A only) |

### "Sync from HRIS" button placement

| Surface | Behavior |
|---|---|
| Dashboard (zero sessions + HRIS departures) | Prominent CTA alongside "Create session" |
| Dashboard (active sessions) | "Sync from HRIS" in the "Create session" dropdown or as a secondary action |
| Create Session page (HRIS list exists) | "Sync now" button in the HRIS section header — refreshes the list |
| Create Session page (zero HRIS departures) | "Sync now" button next to the "No departures" message |

### Board selection (shared UI for both paths)

After the person is identified (via HRIS or manual form), the board selection step is identical:
- List of discovered Trello boards with checkboxes
- Each board shows: name, card count, last active date
- "Suggested" badge on boards with recent activity
- Review deadline field (auto-calculated, editable)
- "Start session →" button (disabled if zero boards selected)

---

## Summary by priority

| Priority | ID | Description | File |
|---|---|---|---|
| 🔴 High | MV-R05 | Deliver page (commit always allowed, gaps as potential knowledge) | session-command-view.jsx |
| 🔴 High | OV-R04 | All answered shows historical queue | session-command-view.jsx |
| 🔴 High | OV-R05 | Gap questions "See in context" (module context panel) | session-command-view.jsx |
| 🔴 High | Part D | Tab state matrix (all roles, all states) | session-command-view.jsx |
| 🔴 High | Part E | Session Creation — two paths + manual form + board selection | create-session.jsx |
| 🔴 High | MV-R01 | Dashboard empty states — corrected orbital logic | ha-vy-handover-dashboard.jsx |
| 🟡 Medium | MV-R04 | AI question delete confirmation + Generate button | session-command-view.jsx |
| 🟡 Medium | CW-R01 | Needs more (send back) + Ask a question (new Q) — two actions | session-command-view.jsx |
| 🟡 Medium | OV-R03 | Offboarder can edit answers during Capture | session-command-view.jsx |
| 🟡 Medium | CW-R03/R04 | Tab disabled states for Coworker | session-command-view.jsx |
| 🟡 Medium | MV-R03 | Tab disabled states for Manager Collecting | session-command-view.jsx |
| 🟡 Medium | CW-R02 | Add Logs tab to Coworker | session-command-view.jsx |
| 🟡 Medium | CW-R05 | Reuse Offboarder celebration artwork | session-command-view.jsx |
| 🟡 Medium | MV-R02 | Fix unicode middle dot rendering | all files |
| 🟡 Medium | OV-R01 | Logs tab disabled in Not started | session-command-view.jsx |

---

## Verification checklist

- [ ] Dashboard: HRIS departures + zero sessions → orbital + departure list + "Create session" CTA
- [ ] Dashboard: HRIS departures + active sessions → greeting banner + session cards (no orbital)
- [ ] Dashboard: zero HRIS departures + zero sessions → plain text + "Sync now" (no orbital)
- [ ] Create Session: HRIS list + manual form below "or" divider
- [ ] Create Session: manual form → email lookup → boards found → board selection
- [ ] Create Session: manual form → email lookup → not found → error message
- [ ] Create Session: "Sync now" button refreshes HRIS list
- [ ] Manager Collecting: only Overview tab active, Data + Logs grayed out
- [ ] Manager Deliver: shows review page, Commit ALWAYS enabled, unresolved gaps as info banner
- [ ] Manager Deliver: confirmation modal mentions unresolved gaps if any
- [ ] Manager Deliver: Back to Capture reopens Offboarder queue
- [ ] Manager Complete: unresolved gaps visible as logged items (read-only list)
- [ ] Manager: delete AI question shows confirmation dialog
- [ ] Manager: "+ Generate question" button on gap rows works
- [ ] Manager: no garbled `·` characters anywhere
- [ ] Offboarder Not started: Logs tab disabled
- [ ] Offboarder All answered: celebration header + full read-only queue visible + "new questions may come" note
- [ ] Offboarder: can edit submitted answers during Capture (Edit button on hover)
- [ ] Offboarder: answers locked once Deliver starts (no Edit button)
- [ ] Offboarder: gap question "See in context" opens module context panel (yellow border, gap description, AI reasoning)
- [ ] Coworker: "Needs more" sends answer back with note field → Offboarder sees revision request
- [ ] Coworker: "Ask a question" navigates to Data tab to create new question
- [ ] Coworker: Logs tab exists and works
- [ ] Coworker Collecting: only Overview active
- [ ] Coworker Start Deliver / Complete: Data + Logs disabled, celebration page with artwork
- [ ] All roles: tab states match Part D matrix exactly

---

*End of review round 2. Apply via Claude Code using this file.*
