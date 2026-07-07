# ART-EEP — CRUD, Sync, Layout Fixes (2025-07-07 session 2)

*Apply via Claude Code. Delete after verified.*

---

## §1 — CRUD & Sync Issues

### CR-01: Enable edit + remove on manual questions ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**Issue:** Users cannot edit or remove manual questions in General questions, Gap context, or Module questions. Also, users cannot manually add a question directly to a card.

**Fix:** Every manual question (added by Manager or Coworker) must have:
- **Edit** (Lucide `Pencil` icon, 12px, gray, hover) → question text becomes inline-editable → Save/Cancel
- **Remove** (Lucide `X` icon, 12px, gray, hover) → confirmation: "Remove this question?" → Remove/Cancel

Applies to ALL question locations:
- General questions section
- Gap context panel questions
- Card detail panel Q&A section

**Also add:** An "+ Add question" text input at the bottom of the card detail panel Q&A section. Same pattern as GP-03 (always-visible input + "Ask" button). This allows the Manager/Coworker to ask a question directly on a specific card.

**AI-generated questions** retain their existing edit/remove behavior (pencil + × with "The AI won’t regenerate" confirmation).

---

### CR-02: Symmetrical flag/detect actions in Card Details ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**Issue:** Flags/detects can be dismissed from the card ROW view (⚡ badges), but the same dismiss action is missing inside the Card Details side panel.

**Fix:** Inside the Card Details panel, each detect badge must also have a dismiss action:

```
Detects
⚡ no description              [Dismiss]
⚡ checklist 1/3                [Dismiss]
```

- "Dismiss" = small text link (10px, gray-500)
- Click → detect dims (50% opacity + strikethrough) with "Restore" link (per UR-02)
- Same behavior as dismissing from the row view — state stays in sync

---

### CR-03: Undo/Withdraw "Revision requested" ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**Issue:** When a Manager/Coworker clicks "Needs more" and sends a revision request, there’s no way to withdraw it before the Offboarder re-answers.

**Fix:** On the revision-requested answer, show a **"Withdraw"** text link:

```
[Original answer struck through]
↩ Revision requested by Hà Vy     Withdraw
"Please add error handling details"
```

- "Withdraw" = 10px text link, gray-500, hover gray-700
- Click "Withdraw" → no confirmation needed (low risk)
- Answer reverts to its pre-revision state (original answer restored, not struck through)
- The revision note disappears
- The question returns to the Accept / Needs more button state

This is only available BEFORE the Offboarder submits a new answer. Once the Offboarder re-answers, the revision is resolved and "Withdraw" is no longer shown.

---

### CR-04: Fix question count math ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**Issue:** The total question count in a module header doesn’t match the sum of satisfied + pending + revision-requested questions.

**Fix:** Audit all modules in the mock data. For each module:
- Total questions = answered + waiting + revision-requested
- Answered = accepted count
- The module header count must equal the sum of all states

Example: if a module says "8 questions" but only shows 3 accepted + 2 waiting = 5, the count is wrong. Either add 3 more questions or change the header to 5.

Check both Prepare and Capture mock data states.

---

## §2 — UI Layout & Navigation

### UI-01: Reduce stepper size ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx` (PhaseHero / stepper component)

**Issue:** The 3-step stepper is too large and visually disconnected from the action button below it.

**Fix:**
- Reduce circle size from 20px to **16px**
- Reduce connector line length — tighter spacing between steps
- Reduce step labels from current size to **10px**
- Reduce vertical padding around the stepper
- Move the CTA button **closer to the stepper** — reduce the gap between the last step label and the button to 8px max
- The entire PhaseHero (stepper + button) should feel like ONE compact component, not two separate sections

**Target height:** The full PhaseHero (stepper + button + padding) should be approximately **80px tall**, not 120+.

---

### UI-02: Fix Start Deliver + Commit button click handlers ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**Issue:** Start Capture button works, but Start Deliver and Commit to Knowledge Graph are inactive/unclickable.

**Fix:** Ensure all three phase CTA buttons have working click handlers:
- **Start Capture** → advances step from "ready" to "capture" (already works)
- **Start Deliver** → advances step from "capture" to "deliver"
- **Commit to KG** → opens the CommitModal (same modal from session-deliver.jsx)

If the step-advancement logic uses a `setStep` or URL param update, ensure all three buttons use the same pattern.

---

### UI-03: Dashboard progress — replace percentage bar with node stepper ✅ LOCKED

**File:** `components/mockups/ha-vy-handover-dashboard.jsx`

**Issue:** The dashboard shows session progress as percentage-based progress bars. This is inconsistent with the 3-step stepper used inside sessions.

**Fix:** Replace the percentage progress bar on each session card with a **compact 3-node stepper**:

```
(✓)─(●)─(○)  Capture
```

- Same visual language as the session stepper (green done, violet active, gray upcoming)
- Compact — fits in the session card row (circles ~10px, inline layout)
- Show the active phase name next to it: "Prepare" / "Capture" / "Deliver" / "Complete"
- Remove the percentage text (e.g., "65%") and the continuous bar

This creates visual consistency: the dashboard preview matches what you see inside the session.

---

### UI-04: Remove Thanh Tùng session from mock data ✅ LOCKED

**Files:** `components/mockups/ha-vy-handover-dashboard.jsx`, `components/app/AppShell.tsx`, any route referencing thanh-tung

**Issue:** Thanh Tùng’s session uses an outdated design layout that doesn’t match current patterns.

**Fix:**
- Remove Thanh Tùng from the dashboard session list (active sessions)
- Remove the `/session/thanh-tung` route if it exists (or hide it)
- Remove `session-thanh-tung.jsx` import/reference from any page
- Keep only Minh Lê’s session as the primary demo session
- If a second session is needed for the dashboard, show Phương Anh (already in OFFBOARDERS data) as a simpler card with less detail

**Do NOT delete `session-thanh-tung.jsx` file itself** — just remove references to it. The file can be cleaned up later.

---

## Verification checklist

**CRUD:**
- [ ] Manual questions have edit (pencil) + remove (×) in General questions, Gap context, Card detail
- [ ] Card detail panel has "+ Add question" input at the bottom of Q&A section
- [ ] Card Details panel: detect badges have "Dismiss" action with Restore undo
- [ ] Detect dismiss behavior identical in row view and Card Details (synced state)
- [ ] Revision-requested answers have "Withdraw" link (before Offboarder re-answers)
- [ ] Withdraw reverts answer to pre-revision state
- [ ] Module question counts match the sum of all question states

**Layout:**
- [ ] Stepper circles 16px, tighter spacing, ~80px total PhaseHero height
- [ ] CTA button close to stepper (max 8px gap)
- [ ] Start Deliver button clickable → advances to deliver step
- [ ] Commit to KG button clickable → opens CommitModal
- [ ] Dashboard session cards: percentage bar replaced with compact 3-node stepper
- [ ] Dashboard: active phase name shown next to stepper ("Capture")
- [ ] Thanh Tùng removed from dashboard session list
- [ ] `/session/thanh-tung` route hidden or removed
- [ ] Only Minh Lê shown as primary demo session

---

*End of fixes. Apply via Claude Code. Delete after verified.*
