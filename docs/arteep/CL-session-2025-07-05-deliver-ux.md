# ART-EEP — Deliver Page UX Refinements (2025-07-05)

*Layout + visual clutter fixes. Apply via Claude Code.*
*These refine items in `CL-session-2025-07-04-deliver-fixes.md` and `CL-session-2025-07-04-data-validation.md`.*
*Delete after verified.*

---

## UX-01: Sticky bottom action bar ✅ LOCKED

**File:** `components/mockups/session-deliver.jsx`

**Issue:** "Back to Capture" and "Commit to KG" are at the bottom of a long page. Too much scrolling to reach them.

**Fix:** Pin the action buttons in a sticky bar at the bottom of the viewport.

```
┌─────────────────────────────── page scrolls ──┐
│  Ready to commit (gradient header)             │
│  3 stat cards                                  │
│  ✨ Data Validation (collapsed / expanded)      │
│  Resolved gaps                                 │
│  Unresolved gaps                               │
│  Sanitization note                             │
│                                                │
│                                                │
└────────────────────────────────────────────────┘
┌──────────── sticky bottom bar (pinned) ────────┐
│  ← Back to Capture          Commit to KG  →    │
└────────────────────────────────────────────────┘
```

**Styling:**
- Fixed to bottom of viewport (`position: sticky; bottom: 0`)
- White background with top border (`border-t border-gray-200`)
- Subtle shadow upward (`shadow-[0_-2px_8px_rgba(0,0,0,0.04)]`)
- Padding: `py-3 px-6`
- "Back to Capture" = secondary (gray outline, left-aligned)
- "Commit to Knowledge Graph" = primary (violet gradient, right-aligned)
- Full width, same max-width as page content
- Z-index above page content

**Remove** the old action buttons from the bottom of the page content — they now live in the sticky bar only. No duplicate buttons.

---

## UX-02: Simplify Data Validation visual signals ✅ LOCKED

**⚠️ REFINEMENT to `CL-session-2025-07-04-data-validation.md`**

**Issue:** Too many icons, colored backgrounds, and highlights in the DV section. Hard to focus.

### Change 1: DV section collapsed by default

The section starts collapsed. Only the summary bar is visible:

```
✨ Data Validation — 5/8 passed · 1 partial · 2 insufficient  [▼ Show details]
   ████████████████████████░░░░░░░░ (progress bar)
```

Click "Show details" → expands to show persona tabs + accordion + right column.
Click "Hide details" → collapses back to summary bar.

The **summary bar alone tells the story.** The details are for drilling.

### Change 2: Simplify accordion rows

**Before (too much):**
```
[🧑‍💻] [How do I deploy the payment service?] [✅ Answered] [🚩] [▼]
```

**After (clean):**
```
How do I deploy the payment service?              ✅    ▼
```

- Remove persona icon from the row — persona is shown in the filter tabs, not repeated per row
- Result as a small icon only (✅/⚠️/❌) — no colored background badge on collapsed rows
- Flag button (🚩) only visible inside the expanded view, not on every collapsed row
- Chevron (▼/▲) at the far right
- The left border color (green/amber/rose) is the ONLY color signal on collapsed rows

### Change 3: Simplify expanded conversation

**Remove from expanded view:**
- Colored background on the recommendation card (💡) — use plain text with icon instead
- Source card links ("📎 Atlas migration · CI/CD config") — move to right column only

**Keep in expanded view:**
- Persona label + question (bold)
- AI answer (gray background, plain)
- Recommendation text for ❌/⚠️ (plain, with 💡 icon, no colored background)
- Flag button (🚩) at bottom-left
- "→ Back to Capture" link at bottom-right

### Change 4: Simplify right column

**Before (too much):**
- Card names with green/amber/none color coding
- Gaps with rose highlight + "← matches this test case" label
- Answer snippets

**After (clean):**
- Module name (bold, violet)
- Card list (plain text, no color coding — just names)
- Gap list with ONE highlight: the matching gap gets a subtle yellow background + "← related" label. Other gaps are plain.
- No answer snippets — just the structural overview

### Change 5: Reduce summary bar

**Before:**
```
✅ 5 answered · ⚠️ 1 partial · ❌ 2 insufficient (1 flagged)
████████████████████░░░░░░░░ (3-color bar)
[All 8] [🧑‍💻 Newcomer 3] [📊 Manager 3] [👥 Coworker 2]
```

**After (collapsed default):**
```
✨ Data Validation — 5 passed · 1 partial · 2 gaps found     [▼ Show details]
   ████████████████████████░░░░░░░░
```

Persona tabs only appear INSIDE the expanded view, not in the collapsed summary. The summary uses plain text counts — no emoji icons for each state. The progress bar does the color work.

---

## UX-03: Refined visual hierarchy for entire Deliver page ✅ LOCKED

**The page should read like a report, not a dashboard.**

Visual hierarchy (most prominent → least):

1. **"Ready to commit" header** — violet gradient, largest text. The opener.
2. **3 stat cards** — the numbers. Quick scan.
3. **Data Validation summary bar** — one line + progress bar. Quality stamp.
4. **Resolved/Unresolved gaps** — simple lists. Supporting evidence.
5. **Sanitization note** — small info card. Legal compliance.
6. **Sticky action bar** — always visible. The closer.

The DV section (when expanded) sits between #3 and #4 — it's a drill-down, not a headline. The presenter can show it or skip it depending on time.

---

## Verification checklist

- [ ] Action buttons pinned in sticky bottom bar — not at the bottom of page content
- [ ] Sticky bar: white bg, top border, upward shadow, full width
- [ ] No duplicate action buttons (removed from page content bottom)
- [ ] DV section collapsed by default — only summary bar visible
- [ ] Summary bar: plain text counts + progress bar, no persona tabs when collapsed
- [ ] "Show details" expands to full accordion + persona tabs + right column
- [ ] Collapsed accordion rows: question text + small result icon + left border only — no persona icon, no flag, no badge background
- [ ] Expanded rows: persona label + question + AI answer + recommendation (plain) + flag + Back to Capture
- [ ] Right column: plain card names + ONE highlighted gap (yellow bg + "← related")
- [ ] No source links in expanded view — sources only in right column
- [ ] Page reads like a report: header → numbers → quality stamp → evidence → action

---

*End of UX refinements. Apply via Claude Code. Delete after verified.*
