# ART-EEP — Mockup Review Round 5 (2025-06-27)

*Remaining items from R4 drilling session + new features. Apply via Claude Code.*

---

## R5-01: Make "Ask about this gap" button functional — Manager AND Coworker ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**Current state:** The gap context panel (opened via "See in context" on a gap question) has an "Ask about this gap" button at the bottom, but it's static — clicking does nothing. This applies to BOTH the Manager and Coworker views.

**Change:** Make the button functional for both Manager and Coworker. Clicking it creates a new human question targeting that gap.

### Flow (identical for Manager and Coworker)

1. Manager/Coworker opens gap context panel via "See in context" on a gap question
2. Panel shows: module name, gap description, "Why this was flagged", sibling questions, cards in module
3. At the bottom: "Ask about this gap" button (violet, full-width)
4. Click → an **inline question input field** appears INSIDE the panel, below the button
5. Types their question (e.g., "What's the manual failover procedure when Stripe goes down?")
6. Clicks **"Ask"** → question is created:
   - Added to the gap's question list (visible in "Questions from this gap" section above — panel updates immediately)
   - Appears in the Offboarder's queue as a new item
   - Tagged as: **"Hà Vy · [Module Name] · waiting"** (Manager) or **"Coworker · [Module Name] · waiting"** (Coworker)
7. Input field clears, ready for another question
8. Optional: show a brief success toast/message ("Question sent to Minh Lê")

### Implementation notes

- The input field should match existing question input patterns in the codebase (same border, padding, font size)
- "Ask" button: small violet primary button, right-aligned below the input
- "Cancel" link or Escape to dismiss the input without submitting
- After submission, the new question should appear in the "Questions from this gap" section above with "waiting" status and correct attribution (Manager name or "Coworker")
- The button text stays "Ask about this gap" (not "Ask follow-up" — terminology locked in CW-R01)

### How this relates to "Generate question"

The Manager has TWO ways to create questions for a gap:

| Action | Where | What it does |
|---|---|---|
| **"+ Generate question"** | Data tab, on the gap row | AI generates a question automatically |
| **"Ask about this gap"** | Gap context panel (side panel) | Manager writes a human question manually |

Both are available to the Manager. They complement each other — AI for broad coverage, manual for specific knowledge the Manager knows is needed.

The Coworker only has "Ask about this gap" (no "Generate question" — that's Manager-only).

### What this is NOT

| Action | How it differs |
|---|---|
| Manager's "+ Generate question" | AI-generated, appears on gap row in Data tab |
| "Needs more" | Sends existing answer back for revision |
| "Ask a question" from Data tab | Creates question on a specific CARD, not a gap |
| KG Explorer chat | Navigates the graph, not the session |

### Button visibility per role

| Role | Gap context panel | "Ask about this gap" button |
|---|---|---|
| Manager | Opens via gap row click or "See in context" | ✅ **Functional** — creates human question (alongside "Generate question" on Data tab) |
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

## R5-04: Voice interview session mode for Offboarder ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**Decision:** The Offboarder can answer their entire question queue by voice in a guided session mode. Voice is an alternative to typing — the Offboarder chooses which mode to use. No per-question mic button — voice is a session-level feature only.

### Entry point

- **"Answer by voice" card** above the regular question queue in the Offboarder's Capture view
- Secondary styling: violet outline with mic icon, NOT primary CTA (typing is the default)
- Text: "Answer by voice" + subtitle "The AI will guide you through all questions. Speak your answers naturally."
- "Start voice session →" button
- The regular text queue remains visible below — Offboarder always has the choice

### Voice session UI (replaces the queue while active)

**Layout:** Two panels side by side.

**Left panel (main):**
- Session header: "Voice session · 5 remaining" + "End session" button
- Progress bar: violet fill on gray track, "Question 2 of 7" + "2 answered · 0 skipped"
- **Active question card:** large text, violet left border, module tag below. Question displayed as text (no text-to-speech — Offboarder reads it)
- **Mic button:** large rose circle with mic icon, pulsing rose rings (from animation budget), timer counting up ("0:12"), waveform visualization bars below
- **Live transcript:** gray background area below the mic, text streaming in as the Offboarder speaks
- **Controls:** Pause | Skip question | Next question →

**Right panel (~200px, alongside):**
- "See in context" content shown **alongside the recording** — NOT in a separate panel the Offboarder has to click away to see
- For card questions: card description, checklist, files
- For gap questions: module name, gap description, "Why flagged" reasoning
- Always visible during recording so the Offboarder has context while speaking

### Recording flow

1. Voice session starts → first unanswered question displayed
2. Mic auto-activates (or Offboarder clicks to start recording)
3. Offboarder speaks → live transcript streams below the mic
4. Offboarder clicks **"Next question →"** to stop recording and advance (manual advance, no silence detection)

### Review before advancing

After clicking "Next question →":
- Recording stops
- "✓ Answer recorded · 0:34" confirmation
- Transcript shown in an editable text area
- Three options:
  - **Edit** — opens transcript for text corrections (fix names, technical terms)
  - **Re-record** — discard and speak again
  - **Next →** — accept transcript, advance to next question

### Skipped questions (offered again at end)

After the last regular question, if any were skipped:
- "You skipped 2 questions" screen
- List of skipped questions with yellow left border
- Two CTAs:
  - "Leave for later" → returns to regular queue, skipped questions stay unanswered
  - "🎙 Answer these now" → re-enters voice mode for just the skipped questions

### Session complete (batch review + submit)

After all questions answered (or skipped questions handled):
- "🎉 Voice session complete" header
- Summary: "7 questions · 4m 32s · 2 skipped"
- **Full list of all answered questions** with transcripts:
  - Each shows: question text + transcript preview + "Edit" button
  - Skipped questions shown dimmed with "left in queue" note
  - 🎙 icon on each answered question
- **"Submit all (5 answers)"** button — batch submission (NOT individual submit per question)
- "Back to queue" returns to regular queue without submitting

### After submission

- All voice-answered questions appear in the regular queue as submitted answers
- Each has a small 🎙 badge: "Answered via voice" — informational, for Manager/Coworker reviewing
- The answers are text — Manager/Coworker review, satisfy, or "needs more" identically to typed answers
- If the Offboarder re-enters the voice session later, it **restarts from the beginning** showing only unanswered questions

### Re-entry behavior

| Scenario | What happens |
|---|---|
| Exit voice session early (3 of 7 done) | Answered questions have transcripts pre-filled but NOT submitted. Return to queue. Can re-enter voice session — it restarts showing only the remaining 4 unanswered questions. |
| All answered via voice, not yet submitted | "Submit all" available. Can also "Back to queue" to review individually. |
| Re-enter after submitting | Voice session shows only NEW unanswered questions (if any arrived from Coworker/Manager). |

### What Manager/Coworker sees

Nothing different. Answers are text. A small 🎙 badge on each answer indicates voice input. The review/satisfy/needs-more flow is identical to typed answers.

### Design system fit

| Element | Treatment |
|---|---|
| Recording indicator | Rose pulsing rings (from animation budget — "recording mic rings (rose)") |
| Active mic button | Rose circle (#e11d48), white mic icon, 44px+ touch target |
| Waveform | 7 vertical bars, rose (#fda4af), animated height cycling |
| Live transcript | Gray background (#f8f8f8), 11px font, text streaming left-to-right |
| Progress bar | Violet fill on gray track |
| "Start voice session" button | Secondary — violet outline (#c4b5fd border, #f5f3ff bg, #5b21b6 text) with mic icon |
| 🎙 badge on submitted answers | Small gray badge, informational only |
| Question card during session | White, violet left border (3px), larger text (14px) |
| Context panel | Right side, ~200px, same styling as existing "See in context" side panel |

---

## Verification checklist

- [ ] Manager: gap context panel has "Ask about this gap" button — click → inline input → creates human question tagged "Hà Vy · [Module] · waiting"
- [ ] Coworker: gap context panel has "Ask about this gap" button — click → inline input → creates human question tagged "Coworker · [Module] · waiting"
- [ ] Manager: "Ask about this gap" (manual) coexists with "+ Generate question" (AI) — both available
- [ ] Input clears after submission, ready for another question
- [ ] Escape or Cancel dismisses input without submitting
- [ ] Offboarder: gap context panel has NO "Ask about this gap" button (removed in R4)
- [ ] Offboarder Collecting state: orbital illustration + "Your session is being prepared" message
- [ ] Coworker Collecting state: orbital illustration + "Data is being collected" message
- [ ] Manager Collecting state: AI animation only, NO orbital (per MV-R4-04)
- [ ] No "WAITING ON YOU" tag visible in ANY session header across ALL roles and sessions
- [ ] Offboarder queue: "Answer by voice" card visible above question list (secondary styling, not primary CTA)
- [ ] Voice session: question displayed as text (no text-to-speech), mic with rose pulsing rings, live transcript
- [ ] Voice session: "See in context" panel visible alongside recording (right side, ~200px)
- [ ] Voice session: "Next question →" stops recording, shows review (Edit / Re-record / Next)
- [ ] Voice session: skipped questions offered again at end ("Answer these now" or "Leave for later")
- [ ] Voice session: complete screen shows all answers + "Submit all (N answers)" batch button
- [ ] Voice session: after submit, answers appear in queue with 🎙 badge
- [ ] Voice session: re-entering restarts with unanswered questions only

---

*End of R5. Apply via Claude Code. Delete this file after verified.*
