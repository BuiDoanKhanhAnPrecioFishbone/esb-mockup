# ART-EEP — Mockup Patch (2025-07-01)

*New changes after consolidated build was applied. Apply via Claude Code.*
*Delete this file after verified.*

---

## RF-01: New Module verdict — Accept/Skip behavior ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**When user clicks "Accept":**
1. The suggested module name becomes **inline-editable** — text input replaces the name
2. Default value = AI's suggestion (e.g., "Market Intelligence")
3. User can rename it or keep the suggestion
4. Press Enter or click ✓ to confirm
5. New module is created, card assigned to it
6. Badge changes from "💡 New Module" to no badge (normal assignment)

**When user clicks "Skip":**
1. New Module suggestion is dismissed
2. Panel immediately shows a **module selection dropdown**: "Assign to existing module instead"
3. User selects one or more existing modules
4. Click "Assign" to confirm
5. If user closes without selecting → card becomes **Uncategorized**

---

## RF-02: Pass cards — module reassignment via AI reasoning panel ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

Users must be able to change the module assignment for ANY card, including Pass cards. This is the ONLY way to change module assignment in the POC (drag-and-drop and "Move to" are removed).

**How it works:**
- Module chip is ALWAYS clickable on ALL cards (including Pass)
- Clicking module chip on a Pass card opens the AI Reasoning panel
- At the bottom of the AI Reasoning panel: a **"Change assignment"** link
- Clicking "Change assignment" reveals the multi-select module area
- User can add/remove modules, then click "Confirm"

---

## RF-03: No Primary/Linked distinction — all modules equal weight ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

There is NO "primary" or "linked" module concept. If a card belongs to multiple modules, all assignments have **equal weight**.

**Remove:**
- ★ primary icon from module chips
- ↗ linked icon from module chips
- "primary" / "linked" labels
- Any logic that treats the first-selected module differently

**Module chips — all look the same:**

| State | Chip appearance |
|---|---|
| Pass (single) | `[Payment Service ›]` |
| Pass (multi) | `[Payment Service ›]` `[CI/CD Pipeline]` |
| Review | `[Payment Service · ⚠ 41% ›]` |
| New Module | `[💡 Market Intelligence · 88% ›]` |
| Uncategorized | Dashed `Uncategorized` badge |

**Multi-select action area:**
```
Assign to:
[Payment Service ×] [CI/CD Pipeline ×] [+ Add module]

[Confirm]
```
All chips identical — no hierarchy, no visual difference between first and additional modules.

---

## RF-04: Remove AI-generated questions from card view ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

A single card doesn't provide enough context for meaningful AI gap questions. Remove AI-generated questions from the card detail panel Q&A section.

**Card Q&A now shows ONLY:**
- Manual questions asked by Coworkers or Managers
- Each shows "Added by [Name]" with avatar (see RF-06)
- If no manual questions → "No questions yet" or hide section

**Where AI gap questions live instead:**
- At the module level, inside gap rows (GAP #1, GAP #2)
- Accessible via "See in context" on the Offboarder's queue
- Generated per-gap, not per-card

---

## RF-05: "Module: " prefix on Data tab headers ✅ LOCKED

**Files:** `components/mockups/session-command-view.jsx`, `session-thanh-tung.jsx`

Add "Module: " before module names in Data tab section headers.

**Before:** `Payment Service (5 cards)`
**After:** `Module: Payment Service (5 cards)`

Applies to all module section headers, all roles.

---

## RF-06: Question attribution — "Added by" with avatar ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

For manual questions on cards, show the creator's identity:

```
Q: What's the manual failover procedure?
   Added by Linh Anh · 2 days ago
   [LA] Coworker
```

| Element | Display |
|---|---|
| Creator name | Full name (e.g., "Linh Anh", "Hà Vy") |
| Avatar | Small circle (20px) with initials, colored by role |
| Role label | "Coworker" or "Manager" |
| Timestamp | Relative ("2 days ago", "Just now") |

---

## RF-07: Gap management — edit and remove ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**On each gap row (hover):**
- **Edit** (pencil icon): gap description becomes inline-editable → Save/Cancel
- **Remove** (× icon): confirmation dialog: "Remove this gap? Its questions will be deleted." → Remove / Cancel

**From the "See in context" side panel:**
- Same edit/remove actions in the gap context panel header

**Rules:**
- Removing a gap deletes its AI-generated questions
- Manual questions (from "Ask about this gap") are preserved — they move to the module level as standalone questions
- Manager and Coworker can edit/remove gaps
- Offboarder cannot (read-only context panels)

---

## RF-08: Rename "Satisfy" → "Accept" everywhere ✅ LOCKED

**Files:** All mockup JSX files — search for `satisfy`, `Satisfy`, `Satisfied`

| Old | New |
|---|---|
| ~~Satisfy~~ | **Accept** |
| ~~Satisfied~~ (badge) | **Accepted** |
| ~~Satisfy remaining (N)~~ | **Accept remaining (N)** |

Applies to: individual answer buttons, bulk button, badges on reviewed answers, Coworker dashboard "Ready for review" section.

"Needs more" is unchanged.

---

## Verification checklist

- [ ] New Module "Accept" → inline-editable module name → confirm creates module
- [ ] New Module "Skip" → shows existing module dropdown → assign or become Uncategorized
- [ ] Pass cards: module chip clickable → AI reasoning → "Change assignment" link at bottom
- [ ] No ★ or ↗ icons on any module chip — all equal weight
- [ ] Multi-select: all chips identical, no hierarchy
- [ ] Card Q&A: ONLY manual questions with "Added by [Name]" + avatar — no AI questions
- [ ] AI gap questions only at module level in gap rows
- [ ] Data tab headers: "Module: Payment Service (5 cards)"
- [ ] Gap rows: edit (pencil) + remove (×) on hover
- [ ] Gap removal: AI questions deleted, manual questions preserved
- [ ] "Satisfy" → "Accept" everywhere (buttons, badges, bulk)
- [ ] "Satisfied" → "Accepted" on answer badges

---

*End of patch. Apply via Claude Code. Delete after verified.*
