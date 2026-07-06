# ART-EEP — Deliver Page UX Refinements (2025-07-05)

*UX-01/02/03 already applied to `session-deliver.jsx` by claude.ai session.*
*UX-04 (no emoji) still needs propagation to `session-command-view.jsx` and `session-thanh-tung.jsx`.*
*Delete this file after UX-04 is fully propagated.*

---

## ~~UX-01: Sticky bottom action bar~~ ✅ APPLIED to session-deliver.jsx

## ~~UX-02: Simplify Data Validation visual signals~~ ✅ APPLIED to session-deliver.jsx

## ~~UX-03: Refined visual hierarchy~~ ✅ APPLIED to session-deliver.jsx

---

## UX-04: NO EMOJI design rule — STILL PENDING on other files

**GLOBAL DESIGN RULE — applies to all mockup files, not just the Deliver page.**

**Rule:** Zero emoji in rendered UI. Color and typography do the work. Icons come from Lucide only.

### Replacements table

| Current (emoji) | Replace with |
|---|---|
| ✨ (sparkle on headers) | Lucide `Sparkles` icon (violet, 16px) — the ONE decorative icon allowed on section headers |
| ✅ on test results / passed states | Small green dot (8px `bg-emerald-500 rounded-full`) or Lucide `CheckCircle2` (emerald) |
| ⚠️ on partial / warning states | Small amber dot (8px `bg-amber-500 rounded-full`) or Lucide `AlertTriangle` (amber) |
| ❌ on failed / insufficient states | Small rose dot (8px `bg-rose-500 rounded-full`) |
| 🚩 Flag button | Text link "Flag" or Lucide `Flag` icon (14px, gray) |
| 💡 Recommendation | Plain indented text. No icon. |
| 🤖 AI answer label | Text: "AI:" in gray |
| 📊 / 🧑‍💻 / 👥 persona icons | Text labels only: "Newcomer" / "Manager" / "Coworker" |
| 🔒 Sanitization | Lucide `Shield` icon (blue, 14px) |
| ℹ️ Info banner | Lucide `Info` icon (14px) |
| 🎙 Voice badge | Text: "voice" in small badge, no emoji |
| 🎉 Celebration | Remove — use typography + color for celebration states |

### What's allowed

- **Lucide icons** (already imported): `Sparkles`, `CheckCircle2`, `AlertTriangle`, `Shield`, `Info`, `ChevronDown`, `Database`, `ArrowLeftRight`, `Flag`
- **Colored dots** (8px circles) for inline status indicators on compact rows
- **Colored text** — green/amber/rose for states. Font weight does the rest.

### Files to apply UX-04

| File | Status |
|---|---|
| `session-deliver.jsx` | ✅ Done (applied this session) |
| `session-command-view.jsx` | ❌ Pending — search for all emoji, replace per table |
| `session-thanh-tung.jsx` | ❌ Pending — search for all emoji, replace per table |

### Verification checklist

- [ ] Zero emoji characters in `session-command-view.jsx` rendered output
- [ ] Zero emoji characters in `session-thanh-tung.jsx` rendered output
- [ ] Lucide icons used consistently across all three files
- [ ] Colored dots (8px) used for test result indicators, not emoji
- [ ] Text labels for persona names, not emoji icons

---

*Delete this file after UX-04 is propagated to all files.*
