# ART-EEP — Mockup Review Round 6 (2025-06-27)

*Single fix missed in R5. Apply via Claude Code.*

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

## Verification checklist

- [ ] Manager: gap context panel has "Ask about this gap" button at bottom
- [ ] Manager: click → inline input → type question → "Ask" → question added to gap list + Offboarder queue
- [ ] Manager: question tagged "Hà Vy · [Module] · waiting"
- [ ] Manager: "Ask about this gap" (manual) coexists with "+ Generate question" (AI) on Data tab — both available
- [ ] Coworker: "Ask about this gap" still works (from R5)
- [ ] Offboarder: button still removed (from R4)

---

*End of R6. Apply via Claude Code. Delete this file after verified.*
