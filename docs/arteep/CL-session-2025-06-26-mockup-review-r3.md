# ART-EEP — Mockup Review Round 3 (2025-06-26)

*Remaining items NOT applied in R2. Apply via Claude Code.*

---

## R3-01: Dashboard empty states — orbital for ALL zero-session states ✅ LOCKED

**⚠️ UPDATE from R2:** Orbital shows for ANY zero-session dashboard, regardless of HRIS status.

**File:** `components/mockups/ha-vy-handover-dashboard.jsx`

### Dashboard states (Manager)

| Condition | What shows |
|---|---|
| **Zero active sessions + HRIS departures exist** | Orbital illustration + "2 upcoming departures" + HRIS departure list + "Create session" CTA + "Sync from HRIS" button |
| **Zero active sessions + zero HRIS departures** | Orbital illustration + "No upcoming departures" + "Sync from HRIS" button + "Create manually" button |
| **Active sessions exist** | Greeting banner + session cards + inline knowledge metrics + activity feed (normal dashboard, no orbital) |

The orbital is the **"no active work" state** — it appears whenever the Manager has zero active sessions, whether or not HRIS has upcoming departures. The message and CTAs below the orbital change based on HRIS status.

### Orbital illustration spec
- Central AI node with gradient fill (`#7c3aed` → `#a78bfa`)
- 3 elliptical orbital rings (`stroke: #ede9fe`, 0.8px width)
- Smaller knowledge nodes orbiting slowly (CSS `@keyframes` rotation, 12-20s cycles, different speeds per ring)
- Violet sparkle accent
- Centered above the message text and CTA buttons

### Session "Departure Pending" state
Same orbital illustration used inside a session when data collection hasn't started yet.
**File:** `components/mockups/session-command-view.jsx`

---

## R3-02: Session Creation flow — two paths ✅ LOCKED

**File:** `components/mockups/create-session.jsx`

### Overview

Sessions can be created in two ways:
1. **HRIS sync** — system auto-syncs departures; Manager configures and starts
2. **Manual creation** — Manager fills a form; email used to find the employee in Trello

Both paths converge at the **board selection** step.

### Path 1: HRIS sync (primary)
1. System auto-syncs upcoming departures from HRIS (name, email, department, last day already known)
2. Manager sees the list on the Create Session page
3. Clicks "Configure →" on a person → expands to board selection (existing accordion UI)
4. System already looked up their email in Trello → boards discovered
5. Manager selects boards → "Start session"

### Path 2: Manual creation
1. Manager fills in a form with the following fields:

| Field | Required | Type | Purpose |
|---|---|---|---|
| Full name | Yes | Text | Display name for the session |
| Email | Yes | Text | **Trello lookup key** — finds their account, discovers boards |
| Department | Yes | Dropdown | Engineering, Sales, People & Culture, etc. Helps with gap analysis |
| Last day | Yes | Date picker | Auto-calculates review deadline (last day minus 4 days) |
| Role / Title | No | Text | Context ("Senior Backend Engineer") |

2. System uses the **email to find the employee in Trello** and discover their boards
3. If found: "Found in Trello ✓" → shows discovered boards for selection (same UI as HRIS path)
4. If not found: error — "No Trello account found for this email. Check the address or ask the employee to confirm."
5. Manager selects boards → "Start session"

**Key insight:** The email is the Trello lookup key — no separate "Trello link" field needed.

### Page layout

| State | What shows |
|---|---|
| **HRIS departures exist** | "Synced from HRIS" header + "Sync now" button + departure accordion list. Below: "or" divider + manual creation form |
| **Zero HRIS departures** | "No upcoming departures from HRIS" message + "Sync now" button. Below: manual creation form |
| **After manual submit (Trello found)** | Person info card ("Phương Anh Nguyễn · Sales · Found in Trello ✓") + discovered boards with checkboxes + "Start session →" |
| **After manual submit (Trello NOT found)** | Error: "No Trello account found for this email." + retry with different email or skip (manual Q&A only) |

### "Sync from HRIS" button placement

| Surface | Location |
|---|---|
| Dashboard (zero sessions + HRIS departures) | Prominent CTA alongside "Create session" |
| Dashboard (zero sessions + zero HRIS) | Secondary button next to "Create manually" |
| Dashboard (active sessions) | Inside "+ Create session" flow or as secondary action |
| Create Session page (HRIS list exists) | "Sync now" in HRIS section header |
| Create Session page (zero HRIS) | "Sync now" next to "No departures" message |

### Board selection (shared UI for both paths)

After the person is identified (HRIS or manual), board selection is identical:
- List of discovered Trello boards with checkboxes
- Each board: name, card count, last active date
- "Suggested" badge on boards with recent activity
- Review deadline field (auto-calculated from last day minus 4 days, editable)
- "Start session →" button (disabled if zero boards selected)
- Cancel button returns to the Create Session page

### Info card on manual form
Below the email field, show an info card:
- Violet background (#f5f3ff), violet border (#c4b5fd)
- Icon: ℹ️
- Text: "The email will be used to find the employee's Trello account and discover their boards. Make sure they have a Trello account with this email."

---

## Verification checklist

- [ ] Dashboard: zero sessions + HRIS departures → orbital + departure list + CTAs
- [ ] Dashboard: zero sessions + zero HRIS → orbital + "No upcoming departures" + Sync/Create buttons
- [ ] Dashboard: active sessions → normal dashboard (no orbital)
- [ ] Session Departure Pending state → orbital illustration
- [ ] Create Session: HRIS list shown with "Sync now" button + accordion cards
- [ ] Create Session: manual form below "or" divider with Name, Email, Department, Last day, Role fields
- [ ] Create Session: manual submit → email lookup → boards found → board selection UI
- [ ] Create Session: manual submit → email not found → error message with retry option
- [ ] Create Session: "Sync from HRIS" accessible on both empty and active dashboard states
- [ ] Board selection: checkboxes, Suggested badge, card counts, deadline field, Start session button

---

*End of R3. Apply via Claude Code. Delete this file after verified.*
