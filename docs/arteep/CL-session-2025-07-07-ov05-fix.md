# ART-EEP — OV-05 Correction: 2-Column Scope (2025-07-07)

*Fixes the OV-05 implementation. Apply via Claude Code. Delete after verified.*

---

## OV-05-FIX: 2-column layout applies ONLY to stepper + KPI card ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**Issue:** OV-05 was applied too broadly. The entire Overview tab was restructured into 2 columns, including the Coworker network and everything below. That's wrong.

**Correct behavior:** The 2-column layout wraps ONLY the top section:
- **Left (~35%):** Vertical stepper + phase CTA button(s)
- **Right (~65%):** KPI stat cards + phase progress summary ("Capture in progress", progress bar, "5 questions remaining", Accepted/Waiting/Gaps stats, "Started 3d ago")

**Everything below is FULL-WIDTH, single column:**
- Coworker network
- Module progress
- Gap summary
- Any other Overview sections

**Layout structure:**
```
┌── 2-column row (stepper + KPIs) ──────────────────┐
│ ┌─ Stepper (~35%) ─┐ ┌─ KPI Card (~65%) ────┐ │
│ │ (✓) Prepare      │ │ Capture in progress       │ │
│ │  │              │ │ █████████████░░░░  9/14 │ │
│ │ (●) Capture     │ │ 5 questions remaining     │ │
│ │  │              │ │                           │ │
│ │ (○) Deliver     │ │ [7 Accepted] [2 Waiting]  │ │
│ │                │ │ [4/6 Gaps]                │ │
│ │ [Start Deliver]│ │                           │ │
│ └────────────────┘ │ Started 3d ago · 22d left │ │
│                    └───────────────────────────┘ │
└────────────────────────────────────────────────┘

┌── Full-width sections below ─────────────────────┐
│                                                    │
│ Coworker network (3)                               │
│ ──────────────────────────────────────────── │
│ Trần Hữu Nam  ·  Linh Anh  ·  Bảo Nguyễn          │
│                                                    │
│ [More overview content below...]                    │
│                                                    │
└────────────────────────────────────────────────┘
```

**Implementation:** The 2-column `flex` or `grid` wrapper should contain ONLY the stepper div and the KPI card div. The Coworker network section and anything below it must be OUTSIDE this wrapper, rendered as normal full-width children of the Overview tab.

---

## Verification checklist

- [ ] 2-column layout wraps ONLY stepper + KPI card
- [ ] Coworker network section is full-width below the 2-column row
- [ ] Module progress / gap summary / other sections are also full-width
- [ ] Stepper is still vertical with 16px circles
- [ ] Phase CTA button(s) still at bottom of stepper column
- [ ] Deliver phase still shows two buttons in stepper column

---

*End of correction. Apply via Claude Code. Delete after verified.*
