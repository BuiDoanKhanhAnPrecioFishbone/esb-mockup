# ART-EEP — Mockup Review Round 5 (2025-06-27)

*Remaining items from R4 drilling session. Apply via Claude Code.*

---

## CW-R5-01: Make "Ask about this gap" button functional in Coworker gap context panel ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**Current state:** The Coworker's gap context panel (opened via "See in context" on a gap question) has an "Ask about this gap" button at the bottom, but it's static — clicking does nothing.

**Change:** Make the button functional. Clicking it creates a new human question targeting that gap.

### Flow

1. Coworker opens gap context panel via "See in context" on a gap question
2. Panel shows: module name, gap description, "Why this was flagged", sibling questions, cards in module
3. At the bottom: "Ask about this gap" button (violet, full-width)
4. Coworker clicks → an **inline question input field** appears INSIDE the panel, below the button
5. Coworker types their question (e.g., "What's the manual failover procedure when Stripe goes down?")
6. Clicks **"Ask"** → question is created:
   - Added to the gap's question list (visible in "Questions from this gap" section above — panel updates immediately)
   - Appears in the Offboarder's queue as a new item
   - Tagged as: **"Coworker · [Module Name] · waiting"**
7. Input field clears, ready for another question
8. Optional: show a brief success toast/message ("Question sent to Minh Lê")

### Implementation notes

- The input field should match existing question input patterns in the codebase (same border, padding, font size)
- "Ask" button: small violet primary button, right-aligned below the input
- "Cancel" link or Escape to dismiss the input without submitting
- After submission, the new question should appear in the "Questions from this gap" section above with "waiting" status and "Coworker" attribution
- The button text stays "Ask about this gap" (not "Ask follow-up" — terminology locked in CW-R01)

### What this is NOT

| Action | How it differs |
|---|---|
| Manager's "+ Generate question" | AI-generated, appears on gap row in Data tab |
| "Needs more" | Sends existing answer back for revision |
| "Ask a question" from Data tab | Creates question on a specific CARD, not a gap |
| KG Explorer chat | Navigates the graph, not the session |

### Button visibility per role (reference)

| Role | Gap context panel | "Ask about this gap" button |
|---|---|---|
| Manager | Has "+ Generate question" (AI) on Data tab | Button present — creates human question |
| Coworker | Opens via "See in context" | ✅ **Functional** — creates human question targeting the gap |
| Offboarder | Opens via "See in context" | ❌ **Removed** (OV-R4-03) — Offboarder answers, doesn't ask |

---

## R5-02: Orbital illustration for Offboarder and Coworker during Collecting state ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**Issue:** During the Collecting Data state, the Manager sees the AI categorization animation (active work). But the Offboarder and Coworker are just waiting — they have nothing to do yet. Their Collecting state should show the orbital illustration as a "waiting" visual, not a blank page or the animation.

### What each role sees during Collecting

| Role | Collecting state visual | Why |
|---|---|---|
| **Manager** | AI categorization animation (cartoon explainer) | Manager is actively monitoring the crawl/categorization |
| **Offboarder** | **Orbital illustration** + "Your session is being prepared" | Nothing to do yet — waiting for questions to arrive |
| **Coworker** | **Orbital illustration** + "Data is being collected" | Nothing to do yet — waiting for data before they can review |

### Offboarder Collecting state

- Show the orbital illustration (same one used on Manager dashboard empty state)
- Message below: **"Your session is being prepared"**
- Subtitle: "Hà Vy is setting up your knowledge handover. You'll be notified when questions are ready for you."
- No CTA buttons — Offboarder can't act during this state
- Logs tab: ✅ enabled (per OV-R4-01)

### Coworker Collecting state

- Show the orbital illustration (same one)
- Message below: **"Data is being collected"**
- Subtitle: "The system is crawling Trello boards and organizing knowledge. You'll be able to review and ask questions once data is ready."
- No CTA buttons — Coworker can't act during this state
- Logs tab: ❌ disabled (per CW-R4-02 — Pending/Collecting is the disabled state)

### Orbital spec (same as dashboard)
- Central AI node with gradient fill (`#7c3aed` → `#a78bfa`)
- 3 elliptical orbital rings (`stroke: #ede9fe`, 0.8px width)
- Smaller knowledge nodes orbiting slowly (CSS `@keyframes` rotation, 12-20s cycles)
- Centered above the message text

---

## R5-03: Remove "WAITING ON YOU" tag from session header ✅ LOCKED

**Screenshot:** Thanh Tùng's session in Coworker view shows "PREPARE" badge + "⏳ WAITING ON YOU" tag in the session header.

**Issue:** We locked the decision to remove all "Needs your action" / "Waiting on you" tags in the dashboard redesign (§9 build queue). The tag was removed from the Manager dashboard session cards, but it's still appearing in the **session detail header** across views.

**Change:** Remove the "WAITING ON YOU" tag from the session header in ALL views:
- Manager session detail header
- Coworker session detail header
- Offboarder session detail header (if present)
- Thanh Tùng session detail header
- Any other session that renders this tag

**Search for:** `WAITING ON YOU`, `waitingOnManager`, `blockedOnManager`, `waiting on you` — remove the tag rendering from the session header component. The phase badge (PREPARE / CAPTURE / DELIVER) is sufficient to communicate session state.

**Files:**
- `components/mockups/session-command-view.jsx` — session header area
- `components/mockups/session-thanh-tung.jsx` — session header area
- Any shared header component that renders this tag

---

## Verification checklist

- [ ] Coworker: click "See in context" on gap question → gap context panel opens
- [ ] Coworker: click "Ask about this gap" → inline input appears in panel
- [ ] Coworker: type question + click "Ask" → question added to gap's question list in panel
- [ ] Coworker: new question shows in Offboarder's queue as "Coworker · [Module] · waiting"
- [ ] Coworker: input clears after submission, ready for another question
- [ ] Coworker: Escape or Cancel dismisses input without submitting
- [ ] Offboarder: gap context panel has NO "Ask about this gap" button (removed in R4)
- [ ] Offboarder Collecting state: orbital illustration + "Your session is being prepared" message
- [ ] Coworker Collecting state: orbital illustration + "Data is being collected" message
- [ ] Manager Collecting state: AI animation only, NO orbital (per MV-R4-04)
- [ ] No "WAITING ON YOU" tag visible in ANY session header across ALL roles and sessions

---

*End of R5. Apply via Claude Code. Delete this file after verified.*
