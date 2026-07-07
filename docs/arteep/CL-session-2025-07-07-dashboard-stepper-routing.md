# ART-EEP — Dashboard, Stepper Layout, Workflow Routing (2025-07-07 session 3)

*Apply via Claude Code. Delete after verified.*

---

## §1 — Dashboard

### DB-01: Remove overview stats from session cards ✅ LOCKED

**File:** `components/mockups/ha-vy-handover-dashboard.jsx`

**Issue:** Session cards on the dashboard show stats like "Gaps resolved" and "Answered" — too much detail for a dashboard-level view.

**Fix:** Remove these stat lines from the session cards. Keep only:
- Offboarder name + role + department
- Compact 3-node stepper showing current phase (per UI-03, already applied)
- Last day / days remaining
- Last activity timestamp

No KPI numbers on the dashboard card. The Overview tab inside the session handles detailed stats.

---

### DB-02: "Create session" as solid primary button, moved to top ✅ LOCKED

**File:** `components/mockups/ha-vy-handover-dashboard.jsx`

**Issue:** "Create session" is styled as a dashed outline button. It's a primary action and should look like one. Also, it's at the bottom — should be at the top.

**Fix:**
- Style: **solid violet button** (`bg-violet-600 text-white`, same as other primary CTAs). NOT dashed or outlined.
- Position: **top of the page**, in the header row next to the page title. Layout:

```
Sessions                           [+ Create session]
─────────────────────────────────────────────
[Session cards below...]
```

- Remove any dashed "+ Create session" button or card from the bottom of the page.
- The button navigates to `/session/new`.

---

## §2 — Overview Tab: 2-Column Layout with Compact Stepper

### OV-05: 2-column layout — stepper left, content right ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx` (PhaseHero / Overview tab)

**Issue:** The stepper spans the full page width, making it too large. The button feels disconnected from the stepper.

**Fix:** Restructure the top of the Overview tab as a **2-column layout**:

```
┌── Stepper (~35%) ──────┬── Overview Content (~65%) ──────┐
│                          │                                  │
│  (✓)                     │  [KPI stat cards]                │
│   │                      │  42 entries · 14 answered         │
│  (●) Capture              │  5 modules                       │
│   │                      │                                  │
│  (○) Deliver              │  [Module progress]               │
│                          │  [Gap summary]                   │
│  [Start Deliver →]       │  [Recent activity]               │
│                          │                                  │
└──────────────────────────┴──────────────────────────────────┘
```

**Left column (stepper):**
- **Vertical stepper** (not horizontal) — steps stacked vertically with connectors
- Circles: 16px (per UI-01)
- Step labels next to each circle (not below)
- Active step label bold + violet
- CTA button(s) at the bottom of the stepper column
- The stepper column has a subtle right border (`border-r border-gray-100`) or light background to visually separate

**Right column (content):**
- KPI stat cards
- Module progress summary
- Gap summary
- Recent activity
- All existing Overview content lives here

**Vertical stepper layout:**
```
  (✓) Prepare
   │
  (●) Capture    ← active (violet, bold)
   │
  (○) Deliver

  [Start Deliver →]
```

This constrains the stepper to ~35% width and puts it alongside content rather than above it.

---

### OV-06: Deliver phase — two buttons in stepper column ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`, `components/mockups/session-deliver.jsx`

**⚠️ REVERSAL of UR-03:** "Back to Capture" is a critical workflow action. It must NOT be hidden in the "..." menu. It belongs as a visible button.

**Deliver phase stepper column:**
```
  (✓) Prepare
   │
  (✓) Capture
   │
  (●) Deliver    ← active

  [← Back to Capture]         ← outlined, gray/violet border
  [Commit to Knowledge Graph]  ← gradient filled
```

Two buttons stacked vertically in the stepper column:
1. **Back to Capture** — outlined button, secondary styling. Click → reopens Capture (existing BackModal confirmation).
2. **Commit to Knowledge Graph** — gradient filled, primary styling. Click → opens CommitModal.

**Remove "Back to Capture" from the "..." header menu** (it's now a top-level button).

---

### OV-07: Remove "Back to Prepare" entirely ✅ LOCKED

**⚠️ REVERSAL of UR-03:** "Back to Prepare" is removed from the system.

**Rationale:** The Manager can modify module assignments during Capture via the Module Classification panel. There's no realistic scenario requiring a full phase reversal to Prepare. The AI classification badges disappear in Capture but the reassignment functionality is always available.

**Fix:**
- Remove "Back to Prepare" from the "..." header menu during Capture
- Remove any step-reversal logic for capture → ready
- The "..." menu during Capture and Deliver contains ONLY: "Cancel session" (rose)

**Updated action map:**

| Phase | Stepper column buttons | "..." menu |
|---|---|---|
| **Prepare** | [Start Capture →] outlined | Cancel session |
| **Capture** | [Start Deliver →] outlined | Cancel session |
| **Deliver** | [← Back to Capture] outlined + [Commit to KG] gradient | Cancel session |
| **Complete** | No buttons — all steps green | No menu |

---

## §3 — Data Tab & Panel Fixes

### DT-04: Remove "Ask about this module" button ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**Issue:** The Data tab has an "Ask about this module" button. We will not allow asking about a module — questions are asked about specific cards or gaps, not about an entire module.

**Fix:** Search for "Ask about this module" or similar module-level question buttons and remove them. Module-level questioning is not supported. Users ask questions via:
- Card detail panel (GP-03 always-visible input)
- Gap context panel (GP-03 always-visible input)
- General question section

No module-level "Ask" action.

---

### MC-07: Move alert/conclusion to top of Module Classification panel ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**Issue:** The alert message (AI conclusion / verdict) appears below the conversation in the Module Classification panel. Users must scroll past the reasoning to see what the AI decided.

**Fix:** Move the alert/conclusion to the **absolute top** of the panel, above the "Assigned modules" section. The user sees the conclusion FIRST, then scrolls down to understand the reasoning.

**Updated panel layout (top to bottom):**
1. **Header:** "Module Classification" + × close
2. **Alert / Conclusion** — the verdict box (Pass/Review/New Module/Uncategorized), prominently colored. User knows the result immediately.
3. **Assigned modules** — editable chip section with Save/Cancel
4. **Confidence bar**
5. **AI conversation** — the reasoning (M/G chat bubbles)

This is "conclusion first, evidence second" — the same pattern as executive summaries. The user sees the AI's decision before reading why.

---

### DV-15: Source panel — show only used cards/gaps ✅ LOCKED

**File:** `components/mockups/session-deliver.jsx` (DVSource component)

**Issue:** The Source panel in Data Validation shows ALL cards and ALL gaps in the module. This is noisy — most of them aren't relevant to the selected test case.

**Fix:** Show ONLY the cards and gaps the AI actually used to generate the answer. Hide everything else.

**For a passed test case:**
- Show only the 1-3 cards cited as sources (with "used" label)
- Show only gaps that were used as sources (if any, per DV-12)
- Do NOT show the other cards/gaps in the module

**For a failed test case:**
- Show 0 cards (AI couldn't find relevant data)
- Show the matching gap (the one that maps to the failure)
- Do NOT show other gaps

**For a partial test case:**
- Show the cards that were used (with "used" label)
- Show the gap that represents the missing part

**The right column header should say "Sources used" (not "Source module")** to make it clear this is a filtered view of what the AI actually referenced.

---

## Verification checklist

**Dashboard:**
- [ ] Session cards: no "Gaps resolved", "Answered", or other stat numbers
- [ ] Session cards show only: name, role, dept, stepper, last day, last activity
- [ ] "Create session" is a solid violet button at the top, next to page title
- [ ] No dashed/outline create button at the bottom

**Overview:**
- [ ] 2-column layout: stepper left (~35%), content right (~65%)
- [ ] Stepper is VERTICAL (steps stacked, not horizontal)
- [ ] Stepper circles 16px, labels next to circles
- [ ] Active step: violet circle + bold label
- [ ] CTA button(s) at bottom of stepper column
- [ ] Prepare: one button — [Start Capture →] outlined
- [ ] Capture: one button — [Start Deliver →] outlined
- [ ] Deliver: two buttons — [← Back to Capture] outlined + [Commit to KG] gradient
- [ ] Complete: no buttons, all steps green
- [ ] "Back to Prepare" removed from everywhere
- [ ] "..." menu: only "Cancel session" (Prepare, Capture, Deliver)
- [ ] "..." menu: hidden on Complete

**Data Tab & Panels:**
- [ ] "Ask about this module" button removed from Data tab
- [ ] Module Classification panel: verdict/conclusion at the TOP, above Assigned modules
- [ ] Panel order: verdict → assigned modules → confidence → AI conversation
- [ ] DV Source panel: shows only cards/gaps the AI used, not all module contents
- [ ] Source panel header says "Sources used" not "Source module"
- [ ] Passed test case: only cited cards shown
- [ ] Failed test case: 0 cards + matching gap only
- [ ] Partial test case: used cards + missing gap

---

*End of fixes. Apply via Claude Code. Delete after verified.*
