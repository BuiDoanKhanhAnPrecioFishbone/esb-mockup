# ART-EEP — Module Classification Signals (2025-07-08)

*Apply via Claude Code. Delete after verified.*

---

## CS-01: Stronger visual signals for Review and New Module cards ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**Issue:** Review and New Module cards are hard to distinguish from Pass cards at a glance. The left border accents are thin and the badges are small chips pushed to the right edge of wide rows. During a fast hackathon demo, judges can't see which cards need attention.

**Fix:** Apply a **row-level background tint** to non-Pass cards so the entire row changes color. Combined with a thicker left border and a colored left icon, the signal becomes impossible to miss.

**Card row visual treatment per state:**

| State | Left border | Row background | Right badge | Left icon (replaces gray circle) |
|---|---|---|---|---|
| **Pass** | None | White (default `bg-white`) | No badge | Gray empty circle (`text-gray-300`) |
| **Review** | 3px solid `border-l-amber-400` | `bg-amber-50/50` (subtle tint) | Amber badge: "Review" (`bg-amber-100 text-amber-700 border-amber-300`) | Amber filled dot (8px `bg-amber-400`) |
| **New Module** | 3px solid `border-l-violet-500` | `bg-violet-50/50` (subtle tint) | Violet badge: "New Module" with Sparkles icon (`bg-violet-100 text-violet-700 border-violet-300`) | Violet filled dot (8px `bg-violet-500`) |
| **Uncategorized** | 3px dashed `border-l-gray-400` | `bg-gray-50/50` (subtle tint) | Gray dashed badge: "Uncategorized" (`bg-gray-100 text-gray-500 border-dashed border-gray-300`) | Gray dashed circle (8px, `border border-dashed border-gray-400 bg-transparent`) |

**Key changes from current:**
1. **Row background tint** — the entire row gets a subtle wash of color, not just the left border
2. **Left border thickness** — increase from 2px to **3px** for better visibility
3. **Left icon changes per state** — the circle at the start of each row reflects the classification state (amber dot, violet dot, gray dashed), not just the question status
4. **Badge size** — ensure badges are at least 11px font size with adequate padding (`px-2 py-0.5`), not too small to read

**What stays the same:**
- Pass cards: clean white row, no badge, no tint (the default state)
- Detects (⚡) still show as orange badges alongside classification badges
- Filter tabs (All/Pass/Review/New Module/Uncategorized) unchanged
- Card click behavior unchanged

**The visual hierarchy should be:** Scan the Data tab → amber and violet tinted rows jump out immediately → user knows exactly which cards need attention without reading badges.

---

## Verification checklist

- [ ] Pass card rows: white background, no left border accent, no badge, gray empty circle
- [ ] Review card rows: amber-50 background tint, 3px amber left border, amber "Review" badge, amber dot
- [ ] New Module card rows: violet-50 background tint, 3px violet left border, violet "New Module" badge, violet dot
- [ ] Uncategorized card rows: gray-50 background tint, 3px dashed gray left border, gray dashed badge, gray dashed circle
- [ ] Background tints are subtle (50% opacity or `/50` modifier) — not overwhelming
- [ ] Left border is 3px (not 2px)
- [ ] Badges are readable (11px+ font, adequate padding)
- [ ] Non-Pass rows visually jump out when scanning the full card list

---

*End of fix. Apply via Claude Code. Delete after verified.*
