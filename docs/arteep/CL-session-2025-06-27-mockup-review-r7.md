# ART-EEP — Mockup Review Round 7 (2025-06-27)

*Flow audit fixes. Apply via Claude Code.*

---

## R7-01: Update `view-matrix.ts` to match locked tab decisions ✅ LOCKED

**File:** `lib/view-matrix.ts`

**Issue:** The `tabVisibility` function is completely out of sync with locked decisions from R2/R4. It currently says Coworker NEVER sees Logs (wrong) and only disables Offboarder Data in Prepare (wrong).

**Change:** Replace the `tabVisibility` function to match the locked Part D matrix:

### Manager

| Step | Overview | Data | Logs |
|---|---|---|---|
| collecting | visible | disabled | disabled |
| ready | visible | visible | visible |
| capture | visible | visible | visible |
| deliver | visible | disabled | disabled |
| complete | visible | disabled | disabled |

### Offboarder

| Step | Overview | Data | Logs |
|---|---|---|---|
| collecting | visible | disabled | visible |
| ready | visible | hidden | visible |
| capture | visible | hidden | visible |
| deliver | visible | hidden | visible |
| complete | visible | hidden | visible |

Note: Offboarder "not-started" / "pending" state has Logs disabled. Once Collecting begins, Logs is enabled and stays enabled through Complete.

### Coworker

| Step | Overview | Data | Logs |
|---|---|---|---|
| collecting | visible | disabled | disabled |
| ready | visible | visible | visible |
| capture | visible | visible | visible |
| deliver | visible | disabled | visible |
| complete | visible | disabled | visible |

The function should use a lookup table or explicit conditionals per role × step × tab. The current 3-line implementation is too simplistic for the actual matrix.

---

## R7-02: Manager "Needs more" — same flow as Coworker ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**Issue:** The "Needs more" interaction was fully designed for the Coworker (CW-R01) but the Manager also has Satisfy/Needs more buttons on answers. The Manager's flow was never explicitly defined.

**Decision:** Identical to the Coworker flow.

### Manager "Needs more" flow
1. Manager clicks "Needs more" on an answered question
2. Note field appears: "What's missing?" with text area
3. Manager writes feedback (e.g., "Please include the DLQ consumer group config")
4. Clicks "Send back"
5. Offboarder sees: question with "↩ Revision requested" badge, original answer struck-through, Manager's note (attributed to "Hà Vy"), fresh answer field
6. Offboarder revises and resubmits

**Attribution:** The note shows "Hà Vy" (Manager name) not "Manager". Same pattern as Coworker notes showing "Coworker".

---

## R7-03: Coworker joining flow ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx` + `ha-vy-handover-dashboard.jsx`

**Issue:** The Coworker network shows "Joined" vs "Pending" but the joining mechanism was never defined.

### Two joining paths

| Type | How identified | How they get access | Pending → Joined trigger |
|---|---|---|---|
| **Auto-derived** | Trello card overlap (system discovers them) | Session auto-appears on their dashboard next time they log in | First access of the session |
| **Manually added** | Manager clicks "+ Add" and enters name | System sends email notification: "Hà Vy added you to Minh Lê's handover session" with link | Clicks link and accesses session |

### Status definitions

| Status | Meaning | Visual |
|---|---|---|
| **Pending** | System identified them (auto) or Manager invited them (manual), but they haven't accessed the session yet | Yellow avatar, "Pending" badge |
| **Joined** | Has accessed the session at least once | Violet avatar, "Joined" badge |

### What the Coworker sees on first access
- Logs into ART-EEP (or clicks email link)
- Session appears on their dashboard
- Session state determines what they see (orbital if Collecting, Overview if Prepare, etc.)
- Their status in the Coworker network automatically changes from "Pending" to "Joined"

---

## R7-04: Offboarder first interaction — email invitation ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**Issue:** When a session is created, the Offboarder needs to know. The entry point was never defined.

### Flow
1. Manager creates session → configures boards → clicks "Start session"
2. System sends **email to the Offboarder**: "Hà Vy has started a knowledge handover session for you. Click here to access your session."
3. Email uses the address from the session creation form (required field)
4. Offboarder clicks link → logs into ART-EEP
5. Sees their dashboard with the session card:
   - If still Collecting: orbital + "Your session is being prepared" (R5-02)
   - If Capture has started: question queue with questions
6. When new questions arrive: notification fires (R6-03)

### For the POC mockup
We don't build actual email sending. The flow is implied. The mockup starts with the Offboarder already logged in, seeing their session in the current state. The email is documented as part of the product spec.

---

## R7-05: "All Answered" → new question — automatic reversion ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**Issue:** The transition from "All Answered" celebration back to active queue when new questions arrive was undefined.

### Transition rules

| Event | What happens |
|---|---|
| All questions answered | Celebration header appears + full read-only queue visible + "New questions may still come in" note |
| New question arrives | **Automatic reversion** — no user action needed |

### Automatic reversion flow
1. New question arrives from Manager or Coworker
2. Notification fires: "1 new question from Hà Vy" (per R6-03)
3. Celebration header **disappears immediately**
4. State reverts to **"Active queue"** (Capture active)
5. New question appears at the **top of the queue** with a violet **"NEW"** badge
6. Answer input visible on the new question
7. Previously answered questions remain below in read-only "Answered" section
8. If Offboarder answers the new question → can return to "All Answered" again

### "NEW" badge
- Small violet badge on newly arrived questions: "NEW"
- Disappears once the Offboarder interacts with the question (clicks, starts typing, or scrolls past)
- Helps the Offboarder find what changed since they last looked

---

## R7-06: Voice session + "Needs more" — counts as unanswered ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**Issue:** If an Offboarder answered via voice, submitted, and got "Needs more" back — does the voice session include it on re-entry?

**Decision:** Yes — "Needs more" answers count as **unanswered** for voice session purposes.

When the Offboarder re-enters the voice session, it shows:
- Questions never answered (truly unanswered)
- Questions marked "Needs more" (need revision)

Both appear in the voice queue. For "Needs more" questions, the voice session shows:
- The question text
- The Manager/Coworker's note ("Please include the DLQ consumer group config")
- The original answer struck-through in the context panel (right side)
- The Offboarder speaks a new answer

---

## R7-07: Trello private boards — not an error state ✅ LOCKED

**Decision:** For the POC, assume all boards linked by URL are accessible. Auto-recognized boards (from Step Zero) are already authorized via the 3rd-party connection configured in Step Zero.

**Remove from the Trello validation table:** No "private board / access denied" error state. If a board URL is valid, it's accessible.

**Updated validation table:**

| Check | Behavior |
|---|---|
| Valid board URL | System discovers cards → board appears in selection |
| Valid workspace URL | System discovers ALL boards → Manager selects |
| Invalid URL / 404 | Error: "Could not access this Trello link. Check the URL." |
| Valid URL, zero cards after filtering | Warning: "0 cards found after filtering." Manager can still start or try different board |
| Valid URL, board is empty | Error: "This Trello board has no cards." |
| ~~Private board / access denied~~ | ~~Removed — not applicable for POC~~ |

---

## R7-08: Hide KG Explorer from Offboarder sidebar ✅ LOCKED

**File:** `components/app/AppShell.tsx`

**Issue:** The KG Explorer is in the sidebar for all roles. But the Offboarder never needs it — they don't explore the knowledge graph, they answer questions.

**Change:** Hide the "Knowledge graph" sidebar entry when the current role is Offboarder.

**Implementation:** In `AppShell.tsx`, the `PRIMARY_NAV` or `SECONDARY_NAV` array that renders sidebar links should filter out the Knowledge Graph entry when `role === 'offboarder'`.

Also update `ROUTE_GATES` in `view-matrix.ts`:
```typescript
{ prefix: "/knowledge-graph", roles: ["manager", "coworker"] },
```

If the Offboarder navigates to `/knowledge-graph` directly (URL), redirect to `/` (dashboard).

---

## Verification checklist

- [ ] `view-matrix.ts`: `tabVisibility` matches Part D matrix for all role × step × tab combinations
- [ ] `view-matrix.ts`: ROUTE_GATES includes `/knowledge-graph` blocked for Offboarder
- [ ] Manager: "Needs more" shows note field → "Send back" → Offboarder sees revision request with "Hà Vy" attribution
- [ ] Auto-derived Coworker: session appears on dashboard automatically, status is "Pending" until first access
- [ ] Manually added Coworker: status is "Pending" until first access (email implied, not built)
- [ ] Coworker: accessing session changes status from "Pending" to "Joined" in the network
- [ ] Offboarder: email invitation implied in the flow (not built in mockup)
- [ ] Offboarder "All Answered": new question arrives → celebration disappears → active queue → new question at top with "NEW" badge
- [ ] Offboarder: "NEW" badge on newly arrived questions disappears on interaction
- [ ] Voice session re-entry: "Needs more" answers appear as questions to re-answer
- [ ] Voice session: "Needs more" questions show the reviewer's note + original answer in context panel
- [ ] Trello validation: no "private board" error state
- [ ] Sidebar: "Knowledge graph" hidden when role is Offboarder
- [ ] `/knowledge-graph` redirects to `/` for Offboarder

---

*End of R7. Apply via Claude Code. Delete this file after verified.*
