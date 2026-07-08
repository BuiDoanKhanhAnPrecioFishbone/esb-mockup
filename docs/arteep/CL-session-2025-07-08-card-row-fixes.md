# ART-EEP — Card Row Fixes: Icons, Alignment, Badges, Borders (2025-07-08)

*Apply via Claude Code. Delete after verified.*

---

## Datadog Dashboard Cross-Card Status: VERIFIED ✔

**Result:** The mock data is correct. `"Datadog dashboard"` has `linkedIn: ["Payment Service"]` and `state: "review"` at 41% confidence. It IS intentionally a cross-module card showing "Also in: Payment Service." No data change needed.

---

## IC-01: Left icon = questionnaire status ONLY (correction to CS-01) ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx` (CardRow component)

**Issue:** CS-01 changed the left dot color per classification state (amber for Review, violet for New Module). This overloads the icon — it should ONLY represent questionnaire status.

**Fix:** The left icon must ALWAYS represent questionnaire status, regardless of classification:

| Left icon | Meaning | When |
|---|---|---|
| Lucide `CheckCircle2` (emerald-500) | All Q answered + accepted | Every manual Q on this card is done |
| Lucide `Circle` filled (amber-500) | In progress | Has manual Q, some not yet accepted |
| Lucide `Circle` empty (gray-300) | No questions | Zero manual Q on this card |

**In Prepare (clsOn=true):** All cards show the gray empty circle because no questions exist yet. Classification state is communicated ONLY via:
- Row background tint
- 3px left border
- Badge (next to title per IC-04)

**In Capture (clsOn=false):** The classification tints/badges disappear. Icons show real Q&A status.

**Code change:** In the CardRow component, remove the classification-based icon rendering (the `clsOn` branch that uses `cmeta.dotColor` and `cmeta.dotDashed`). Always use the CD-02 questionnaire status logic regardless of `clsOn`.

---

## IC-02: Remove ALL dashed borders from card rows ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**Issue:** Cross-module cards have dashed left borders. Uncategorized cards have dashed left borders. These are inconsistent with the solid borders on other card types.

**Fix:**
- **Uncategorized rows:** Change from `3px dashed` to `3px solid #9ca3af` (solid gray). Keep the gray-50 tint.
- **Cross-module cards (linked):** Remove the dashed left border entirely. Cross cards use the "Also in" subtitle as their signal — they don't need a separate border treatment.
- **Uncategorized badge:** Remove `border-dashed` from the badge class. Use solid border: `bg-gray-100 text-gray-500 border border-gray-300` (no dashed).

Update `CLS_META.uncat` to use solid border and solid dot:
```
uncat: { 
  rowBorder: "3px solid #9ca3af",  // was dashed
  dotColor: null,                    // no colored dot — use standard Q status
  dotDashed: false,                  // was true — remove dashed circle
  badge: "bg-gray-50 text-gray-500 border-gray-300"  // was border-dashed
}
```

---

## IC-03: Align cross-module card rows to the vertical grid ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx` (CardRow component)

**Issue:** The "Also in" subtitle adds vertical space, causing cross-module card rows to be taller than standard rows. This breaks the vertical alignment grid.

**Fix:** Ensure cross-module rows use `align-items: flex-start` (not center) so the icon and title stay on the same baseline as other cards. The subtitle sits below the title within the same flex container.

The card row layout:
```
[○] [📄] [Title text]           [Badge] [Detects]
           [Also in: CI/CD]            ← subtitle inside the text column
```

The icon (○) and file icon (📄) align to the TOP of the row (`mt-1` or `self-start`), not vertically centered. This keeps them at the same position regardless of whether a subtitle is present.

---

## IC-04: Move classification badge NEXT TO title ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx` (CardRow component)

**Issue:** Classification badges (Review, New Module, Uncategorized) are pushed to the far right of the row. Users must scan across the entire row width to see the classification state.

**Fix:** Move the badge to sit IMMEDIATELY after the card title, in the same flex row:

```
[○] [📄] [Datadog dashboard] [Review]              [checklist 1/3]
           [Also in: Payment Service]
```

**Layout change:**
- The card title and badge are in a flex row together (`items-center gap-1.5`)
- The badge follows the title with no spacer between them
- Detect badges (orange, e.g., "checklist 1/3") stay at the far right — they're metadata, not classification

The reading flow becomes: icon → file icon → title + badge (classification) → then optionally detect badges at the far right.

---

## Verification checklist

- [ ] Left icon is ALWAYS questionnaire status (gray circle in Prepare, green/amber/gray in Capture)
- [ ] Left icon does NOT change color based on classification (no amber dot for Review, no violet dot for New Module)
- [ ] Classification state uses ONLY: row tint + left border + badge
- [ ] Zero dashed borders on any card row (Uncategorized = solid gray, cross-module = no special border)
- [ ] Uncategorized badge uses solid border (no `border-dashed`)
- [ ] Cross-module rows: icon and title align to the same baseline as non-cross rows
- [ ] "Also in" subtitle does not push the icon/title down — uses `flex-start` alignment
- [ ] Classification badge sits immediately after the title text (not pushed to far right)
- [ ] Detect badges stay at the far right of the row
- [ ] Datadog dashboard correctly shows: Review badge + "Also in: Payment Service" + amber tint

---

*End of fixes. Apply via Claude Code. Delete after verified.*
