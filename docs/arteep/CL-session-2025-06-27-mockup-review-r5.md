# ART-EEP — Mockup Review Round 5 (2025-06-27)

*Remaining item from R4 drilling session. Apply via Claude Code.*

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

## Verification checklist

- [ ] Coworker: click "See in context" on gap question → gap context panel opens
- [ ] Coworker: click "Ask about this gap" → inline input appears in panel
- [ ] Coworker: type question + click "Ask" → question added to gap's question list in panel
- [ ] Coworker: new question shows in Offboarder's queue as "Coworker · [Module] · waiting"
- [ ] Coworker: input clears after submission, ready for another question
- [ ] Coworker: Escape or Cancel dismisses input without submitting
- [ ] Offboarder: gap context panel has NO "Ask about this gap" button (removed in R4)

---

*End of R5. Apply via Claude Code. Delete this file after verified.*
