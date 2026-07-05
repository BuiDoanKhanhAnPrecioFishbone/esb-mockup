# ART-EEP — Deliver Page UX Refinements (2025-07-05)

*Layout + visual clutter fixes. Apply via Claude Code.*
*These refine items in `CL-session-2025-07-04-deliver-fixes.md` and `CL-session-2025-07-04-data-validation.md`.*
*Delete after verified.*

---

## UX-01: Sticky bottom action bar ✅ LOCKED

**File:** `components/mockups/session-deliver.jsx`

**Issue:** "Back to Capture" and "Commit to KG" are at the bottom of a long page. Too much scrolling to reach them.

**Fix:** Pin the action buttons in a sticky bar at the bottom of the viewport.

**Styling:**
- Fixed to bottom of viewport (`position: sticky; bottom: 0`)
- White background with top border (`border-t border-gray-200`)
- Subtle shadow upward (`shadow-[0_-2px_8px_rgba(0,0,0,0.04)]`)
- Padding: `py-3 px-6`
- "Back to Capture" = secondary (gray outline, left-aligned)
- "Commit to Knowledge Graph" = primary (violet gradient, right-aligned)
- Full width, same max-width as page content
- Z-index above page content

**Remove** the old inline action buttons from the bottom of the page content — they now live in the sticky bar only. No duplicate buttons.

---

## UX-02: Simplify Data Validation visual signals ✅ LOCKED

### Change 1: DV section collapsed by default

The section starts collapsed. Only the summary bar is visible:

```
Data Validation — 5 passed, 1 partial, 2 gaps found       [Show details ▾]
   ████████████████████████░░░░░░░░ (progress bar)
```

Click "Show details" → expands to show persona tabs + accordion + right column.
Click "Hide details" → collapses back to summary bar.

### Change 2: Simplify accordion rows

- Remove persona icon from collapsed rows
- Result as a small **colored dot** (8px circle: green/amber/rose) — no emoji
- Flag only visible inside expanded view, not on collapsed rows
- Chevron (Lucide `ChevronDown`) at the far right
- The left border color + dot are the ONLY signals on collapsed rows

### Change 3: Simplify expanded conversation

- Persona as text label only ("Manager asks:") — no emoji
- AI answer in gray background block — labeled "AI:" in gray text, no robot emoji
- Recommendation as plain indented text — no colored background, no lightbulb emoji
- "Flag" as text link at bottom-left
- "Back to Capture" as text link at bottom-right

### Change 4: Simplify right column

- Module name (bold, violet text)
- Card list (plain text, no color coding — just names)
- Gap list: the matching gap gets subtle yellow background + "← related" label. Other gaps are plain text.
- No answer snippets

### Change 5: Reduce summary bar

Persona tabs only appear INSIDE the expanded view. The collapsed summary uses plain text counts — no emoji per state. The progress bar does the color work.

---

## UX-03: Refined visual hierarchy ✅ LOCKED

**The page reads like a report, not a dashboard.**

1. **"Ready to commit" header** — violet gradient, largest text
2. **3 stat cards** — numbers
3. **Data Validation summary** — one line + progress bar
4. **Resolved/Unresolved gaps** — simple lists
5. **Sanitization note** — small info card
6. **Sticky action bar** — always visible

---

## UX-04: No emoji icons — Lucide + color + typography only ✅ LOCKED

**⚠️ GLOBAL DESIGN RULE — applies to the entire Deliver page and should be followed across the whole app.**

**Problem:** 12+ different emoji (✨ ✅ ⚠️ ❌ 🚩 💡 🤖 📊 🧑‍💻 👥 🔒 ℹ️) make the page look like a prototype, not an enterprise product.

**Rule:** Color and typography do the work. Icons come from Lucide only (already in the codebase). No emoji anywhere in the rendered UI.

### Replacements table

| Current (emoji) | Replace with |
|---|---|
| ✨ (sparkle on headers) | Lucide `Sparkles` icon (already imported, violet, 16px) — the ONE decorative icon allowed on the header |
| ✅ on passed test cases | Small green circle (8px, `bg-emerald-500`, `rounded-full`) |
| ⚠️ on partial test cases | Small amber circle (8px, `bg-amber-500`, `rounded-full`) |
| ❌ on failed test cases | Small rose circle (8px, `bg-rose-500`, `rounded-full`) |
| 🚩 Flag button | Text link: "Flag" (gray text, underline on hover). Or Lucide `Flag` icon (14px, gray) |
| 💡 Recommendation | Plain indented text. No icon. The indentation signals it's a secondary note. |
| 🤖 AI answer label | Text: "AI:" in gray — no icon |
| 📊 / 🧑‍💻 / 👥 persona icons | Text labels only: "Newcomer" / "Manager" / "Coworker" — the tab color distinguishes them |
| 🔒 Sanitization | Lucide `Shield` icon (already imported, blue, 14px) |
| ℹ️ Info banner | Lucide `Info` icon (already imported, 14px) |
| ✅ / ✓ on resolved gaps | Lucide `CheckCircle2` icon (already imported, emerald, 14px) |
| ⚠️ on unresolved gaps | Lucide `AlertTriangle` icon (already imported, amber, 14px) |

### What's allowed

- **Lucide icons** — max 3-4 distinct icons per page section. Already imported: `Sparkles`, `CheckCircle2`, `AlertTriangle`, `Shield`, `Info`, `ChevronDown`, `Database`, `ArrowLeftRight`, `Flag`
- **Colored dots** (8px circles) — for inline status indicators (pass/partial/fail) on compact rows
- **Colored text** — green for passed, amber for partial, rose for failed. Font weight does the rest.
- **Colored left borders** — on accordion rows and gap items

### What's NOT allowed

- No emoji (Unicode emoji characters like ✨ ✅ ❌ 🚩 💡 🤖 📊 🧑‍💻 👥 🔒 ℹ️) in the rendered JSX
- No stacking multiple icons on the same row
- No decorative icons that don't convey information

### Where to apply

Search `session-deliver.jsx` for all emoji characters and replace per the table above. Also check `session-command-view.jsx` and `session-thanh-tung.jsx` for consistency across the app.

**Files:** `components/mockups/session-deliver.jsx`, `session-command-view.jsx`, `session-thanh-tung.jsx`

---

## Verification checklist

- [ ] Action buttons pinned in sticky bottom bar
- [ ] No duplicate action buttons in page content
- [ ] DV section collapsed by default — only summary bar visible
- [ ] Summary bar: plain text counts + progress bar, no emoji per state
- [ ] Collapsed accordion rows: question text + colored dot (8px) + left border + chevron only
- [ ] No persona emoji on any row — text labels only inside expanded view
- [ ] Expanded rows: "Manager asks:" text + "AI:" text + plain recommendation + "Flag" text link
- [ ] Right column: plain card names + ONE highlighted gap (yellow bg + "← related")
- [ ] **Zero emoji characters in the rendered Deliver page**
- [ ] Lucide icons only: Sparkles (header), CheckCircle2 (resolved), AlertTriangle (unresolved), Shield (sanitization), Info (banners), ChevronDown (accordion), Flag (flag action)
- [ ] Test case result indicators: 8px colored circles (green/amber/rose), not emoji
- [ ] Page reads like a report: header → numbers → quality stamp → evidence → action
- [ ] Same no-emoji rule applied to session-command-view.jsx and session-thanh-tung.jsx

---

*End of UX refinements. Apply via Claude Code. Delete after verified.*
