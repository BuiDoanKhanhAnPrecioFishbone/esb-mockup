# ART-EEP — Mockup Review Round 6 (2025-06-27)

*Fixes and features from R5 drilling session. Apply via Claude Code.*

---

## R6-01: "Ask about this gap" must also be functional for Manager ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**Issue:** R5-01 made "Ask about this gap" functional for the Coworker, but the Manager's gap context panel is missing the same functionality. The Manager needs it too.

**Change:** The Manager's gap context panel (opened from gap rows on the Data tab or via "See in context") should have the same functional "Ask about this gap" button as the Coworker.

### Manager has TWO ways to create gap questions

| Action | Where | What it does | Who creates |
|---|---|---|---|
| **"+ Generate question"** | Data tab, on the gap row | AI generates a question automatically | AI |
| **"Ask about this gap"** | Gap context panel (side panel) | Manager writes a human question manually | Manager (Hà Vy) |

Both are available to the Manager. They complement each other — AI for broad coverage, manual for specific knowledge the Manager knows is needed.

### Flow (same as Coworker, different attribution)

1. Manager opens gap context panel
2. Panel shows: module name, gap description, "Why this was flagged", sibling questions, cards in module
3. At the bottom: "Ask about this gap" button (violet, full-width)
4. Click → inline question input appears below the button
5. Manager types question → clicks "Ask"
6. Question created:
   - Added to the gap's question list in the panel
   - Appears in the Offboarder's queue
   - Tagged as: **"Hà Vy · [Module Name] · waiting"**
7. Input clears, ready for another question

### Updated button visibility

| Role | "Ask about this gap" | "+ Generate question" |
|---|---|---|
| **Manager** | ✅ Functional (creates human question) | ✅ Also available on Data tab (AI-generated) |
| **Coworker** | ✅ Functional (creates human question) | ❌ Not available (Manager-only) |
| **Offboarder** | ❌ Removed (OV-R4-03) | ❌ Not available |

---

## R6-02: Bulk operations — module-level "Satisfy all" and "Dismiss all flags" ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**Decision:** No checkboxes, no multi-select. Instead, a simple module-level button for batch approval. Only Manager. Only for low-risk "approve" actions — never for "reject" actions (Needs more) or deletions.

### What gets bulk operations

| Action | Bulk? | Why |
|---|---|---|
| **Satisfy answers** | ✅ "Satisfy remaining (N)" | Low risk — Manager already read them. Most frequent repetitive action. |
| **Dismiss flags** | ✅ "Dismiss all flags (N)" | Medium risk — flags are informational. Brief confirmation dialog. |
| **Needs more** | ❌ Individual only | Requires a specific note per answer — can't batch. |
| **Delete AI questions** | ❌ Individual only | Too risky for bulk. Per-question confirmation locked in MV-R4. |
| **Dismiss gaps** | ❌ Individual only | Each gap should be evaluated separately. |
| **Ask about this gap** | ❌ Individual only | Each question is unique. |

### "Satisfy remaining" button

**Location:** Bottom of each module's answer section, after the last answer.

**Appears when:** ≥2 unsatisfied answers exist in the module.

**Label:** "Satisfy remaining (N)" where N = count of unsatisfied answers. If Manager already flagged some as "Needs more", those are excluded from the count.

**Flow:**
1. Manager opens module in Data tab, reads through answers
2. Flags 1 answer as "Needs more" with a note (individual action)
3. At the bottom of the answer section: "Satisfy remaining (4)" button appears
4. Click → all 4 remaining answers marked as Satisfied instantly
5. No confirmation dialog (low risk, each answer is individually reversible)
6. Green checkmarks appear on all 4 answers
7. Button disappears (no remaining unsatisfied answers)

**Undo:** No bulk undo. If the Manager realizes one answer was wrong, they click that specific answer and change it individually. Bulk is one-way for speed, individual correction for precision.

**Styling:**
- Secondary button (not primary — individual Satisfy per answer is still the default workflow)
- Violet outline, same height as other action buttons
- Position: right-aligned at bottom of the module's answer section
- Icon: double-check (✓✓) or batch icon

### "Dismiss all flags" button

**Location:** Bottom of each module's flag section (below the card rows that have flags).

**Appears when:** ≥2 undismissed flags exist in the module.

**Label:** "Dismiss all flags (N)"

**Flow:**
1. Manager reviews flags in the module ("no desc", "checklist 1/3", etc.)
2. Most are irrelevant Trello metadata
3. At the bottom: "Dismiss all flags (3)" button
4. Click → brief confirmation: "Dismiss 3 flags in Payment Service? This removes the flag badges from these cards."
5. Confirm → all 3 flags dismissed, badges removed
6. Button disappears

**Styling:** Same as Satisfy button but gray/neutral (flags are informational, not knowledge-critical).

### What this does NOT include

| Excluded | Reason |
|---|---|
| Checkboxes on rows | Adds visual clutter to an already-dense Data tab |
| Cross-module bulk | Too risky — "Satisfy all 14 answers across all modules" could miss bad answers |
| Selection bar / toolbar | Overengineered for module-level batch of 3-5 items |
| Coworker bulk | Scope too small (2-4 answers) — not worth the UI complexity |
| Bulk undo | Dangerous — individual correction is safer |

### Design system fit

| Element | Treatment |
|---|---|
| "Satisfy remaining" button | Secondary — violet outline (`border: 1px solid #c4b5fd`, `bg: #f5f3ff`, `color: #5b21b6`). Right-aligned. |
| "Dismiss all flags" button | Secondary — gray outline (`border: 1px solid border-tertiary`, `bg: background-primary`, `color: text-secondary`). Right-aligned. |
| Confirmation dialog (flags only) | Simple centered modal: "Dismiss N flags in [Module]?" + "Dismiss" / "Cancel" |
| No confirmation (satisfy) | Instant action — low risk, individually reversible |
| Button visibility | Only when ≥2 items qualify. 0-1 items = no button (individual action is fine) |

### Priority

Nice-to-have for POC. The demo works without it. If time allows, it's ~30 lines per button and makes the demo look production-ready.

---

## Verification checklist

- [ ] Manager: gap context panel has "Ask about this gap" button at bottom
- [ ] Manager: click → inline input → type question → "Ask" → question added to gap list + Offboarder queue
- [ ] Manager: question tagged "Hà Vy · [Module] · waiting"
- [ ] Manager: "Ask about this gap" (manual) coexists with "+ Generate question" (AI) on Data tab — both available
- [ ] Coworker: "Ask about this gap" still works (from R5)
- [ ] Offboarder: button still removed (from R4)
- [ ] Manager Data tab: "Satisfy remaining (N)" button appears at bottom of module answer section when ≥2 unsatisfied answers
- [ ] Manager: clicking "Satisfy remaining" marks all unsatisfied answers in that module as Satisfied (no confirmation)
- [ ] Manager: answers flagged as "Needs more" are excluded from the bulk satisfy count
- [ ] Manager: button disappears after all answers are satisfied
- [ ] Manager Data tab: "Dismiss all flags (N)" button appears at bottom of module flag section when ≥2 undismissed flags
- [ ] Manager: clicking "Dismiss all flags" shows confirmation dialog → confirm → all flags dismissed
- [ ] No bulk operations visible for Coworker or Offboarder
- [ ] No checkboxes on any row

---

*End of R6. Apply via Claude Code. Delete this file after verified.*
