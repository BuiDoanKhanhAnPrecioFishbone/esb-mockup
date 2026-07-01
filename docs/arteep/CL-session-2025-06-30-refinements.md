# ART-EEP — Refinements to Consolidated File (2025-06-30)

*Corrections to the consolidated pending instructions. Apply AFTER the consolidated file.*
*These items override specific sections in `CL-session-2025-06-30-consolidated-pending.md`.*

---

## RF-01: Accept/Skip behavior for New Module ✅ LOCKED

**⚠️ REFINEMENT to consolidated §4.6 (New Module verdict)**

**When user clicks "Accept":**
1. The suggested module name becomes **inline-editable** — a text input replaces the name
2. Default value = AI's suggestion (e.g., "Market Intelligence")
3. User can rename it (e.g., "Competitive Analysis") or keep the suggestion
4. Press Enter or click ✓ to confirm
5. New module is created with that name
6. The card is assigned to the new module
7. The AI Classification badge on the card row changes from "💡 New Module" to no badge (now it's a normal assignment)

**When user clicks "Skip":**
1. The New Module suggestion is dismissed
2. The panel immediately shows a **module selection dropdown**: "Assign to existing module instead"
3. User selects one or more existing modules from the dropdown
4. Click "Assign" to confirm
5. The card moves to the selected module(s)
6. If user closes without selecting — the card becomes **Uncategorized**

**File:** `components/mockups/session-command-view.jsx`

---

## RF-02: Module reassignment for Pass cards ✅ LOCKED

**⚠️ ADDITION to consolidated §4.6**

Users must be able to change the module assignment for ANY card, including Pass cards. This replaces the removed drag-and-drop and "Move to" functionality.

**How it works:**
- In the card detail panel, the module chip is ALWAYS clickable (not just for Review/New Module)
- Clicking the module chip on a **Pass** card opens the AI Reasoning panel
- At the bottom of the AI Reasoning panel (even for Pass cards): a **"Change assignment"** link
- Clicking "Change assignment" reveals the multi-select module area (same as Review/Uncategorized)
- User can add/remove modules, then click "Confirm"

This is the ONLY way to change a card's module assignment in the POC (since drag-and-drop and "Move to" are removed).

**File:** `components/mockups/session-command-view.jsx`

---

## RF-03: No Primary/Linked distinction — equal weight modules ✅ LOCKED

**⚠️ OVERRIDE of consolidated §4.6 and §4.8**

There is NO longer a "primary" or "linked" module concept. If a card belongs to multiple modules, all assignments have **equal weight**.

**What changes:**

| Before (consolidated) | After (this refinement) |
|---|---|
| ★ primary module + ↗ linked modules | All modules equal — no ★ or ↗ icons |
| First selected = primary | No hierarchy — all chips look the same |
| "+ Add linked module" | "+ Add module" |
| Manager can change which is primary | N/A — no primary concept |

**Module chip appearance (updated):**

| State | Chip |
|---|---|
| Pass (single) | `[Payment Service ›]` |
| Pass (multi) | `[Payment Service ›]` `[CI/CD Pipeline]` |
| Review | `[Payment Service · ⚠ 41% ›]` |
| New Module | `[💡 Market Intelligence · 88% ›]` |
| Uncategorized | Dashed `Uncategorized` badge |

No ★ or ↗ icons on any chip. All chips are violet with the same styling.

**Multi-select action area (updated):**
```
Assign to:
[Payment Service ×] [CI/CD Pipeline ×] [+ Add module]

[Confirm]
```
All chips look identical — no primary/linked visual difference.

**File:** `components/mockups/session-command-view.jsx`

---

## RF-04: Remove AI-generated questions from card view ✅ LOCKED

**⚠️ OVERRIDE of consolidated §4.8 Q&A section**

AI-generated gap questions do NOT appear at the card level. A single card doesn't provide enough context for meaningful AI gap questions. Gap questions live at the **module level** (in the gap rows under each module).

**Card Q&A section now shows ONLY:**
- Manual questions asked by Coworkers or Managers
- Each question shows: "Added by [Name]" with avatar
- If no manual questions exist — show "No questions yet" or hide the section entirely

**Where AI gap questions live instead:**
- At the module level, inside gap rows (§4.5)
- Accessible via "See in context" on the Offboarder's queue
- Generated per-gap, not per-card

**File:** `components/mockups/session-command-view.jsx`

---

## RF-05: "Module: " prefix on Data tab ✅ LOCKED

**⚠️ ADDITION to consolidated §4**

Add the text prefix "Module: " before the module name in the Data tab module section headers.

**Before:** `Payment Service (5 cards)`
**After:** `Module: Payment Service (5 cards)`

This applies to all module section headers in the Data tab, for all roles.

**File:** `components/mockups/session-command-view.jsx`, `session-thanh-tung.jsx`

---

## RF-06: Question attribution — "Added by" with avatar ✅ LOCKED

**⚠️ ADDITION to consolidated §4**

For manual questions on cards (from Coworkers or Managers), show the creator's identity:

```
Q: What's the manual failover procedure?
   Added by Linh Anh · 2 days ago
   [avatar] Coworker
```

| Element | Display |
|---|---|
| Creator name | Full name (e.g., "Linh Anh", "Hà Vy") |
| Avatar | Small circle (20px) with initials |
| Role label | "Coworker" or "Manager" |
| Timestamp | Relative ("2 days ago", "Just now") |

This replaces the generic "Coworker · Payment Service · waiting" format with more personal attribution.

**File:** `components/mockups/session-command-view.jsx`

---

## RF-07: Gap management — edit and remove from gap row ✅ LOCKED

**⚠️ ADDITION to consolidated §4.5**

Multiple gaps per module is already designed (§4.5). This adds **edit and remove** capabilities.

**On each gap row:**
- **Edit** (pencil icon, hover): click → gap description becomes inline-editable → Save/Cancel
- **Remove** (× icon, hover): click → confirmation dialog: "Remove this gap? Its questions will be deleted." → Remove / Cancel

**From the "See in context" side panel:**
- Same edit/remove actions available in the gap context panel header
- Edit: pencil next to gap description
- Remove: × in panel header or "Remove gap" link at bottom

**Rules:**
- Removing a gap also removes all its AI-generated questions
- Manual questions (from Coworkers/Managers) asked via "Ask about this gap" are preserved — they move to the module level as standalone questions
- Manager and Coworker can edit/remove gaps
- Offboarder cannot (they see gaps in read-only context panels)

**File:** `components/mockups/session-command-view.jsx`

---

## RF-08: Rename "Satisfy remaining" → "Accept remaining" ✅ LOCKED

**⚠️ OVERRIDE of consolidated §4.9**

"Satisfy remaining" doesn't read naturally. Replace with **"Accept remaining (N)"** to match the Accept/Skip pattern used in the AI Classification panel.

**Updated bulk operations:**

| Action | Old label | New label |
|---|---|---|
| Approve answers | ~~Satisfy remaining (N)~~ | **Accept remaining (N)** |
| Individual answer approval | ~~Satisfy~~ | **Accept** |
| Individual answer rejection | Needs more | Needs more (unchanged) |
| Dismiss flags | Dismiss all flags (N) | Dismiss all flags (N) (unchanged) |

**Also rename throughout:**
- "Satisfied" badge on reviewed answers → **"Accepted"**
- "Satisfy / Needs more" button pair → **"Accept / Needs more"**
- Dashboard Coworker section "Ready for review" with "Satisfy" button → **"Accept"**

**Files:** All mockup JSX files — search for `satisfy`, `Satisfy`, `Satisfied`

---

## Verification checklist

- [ ] New Module "Accept" → inline-editable module name → confirm creates module
- [ ] New Module "Skip" → shows module dropdown → assign to existing or become Uncategorized
- [ ] Pass cards: module chip is clickable → AI reasoning opens → "Change assignment" link at bottom
- [ ] No ★ primary or ↗ linked icons on any module chip — all modules equal weight
- [ ] Multi-select: all chips look identical, no hierarchy
- [ ] Card Q&A shows ONLY manual questions (no AI-generated) with "Added by [Name]" + avatar
- [ ] AI gap questions appear only at module level in gap rows, not on individual cards
- [ ] Data tab module headers: "Module: Payment Service (5 cards)"
- [ ] Gap rows: edit (pencil) and remove (×) on hover
- [ ] Gap removal confirmation: "Remove this gap? Its questions will be deleted."
- [ ] Gap removal: manual questions preserved, AI questions deleted
- [ ] "Satisfy" renamed to "Accept" everywhere
- [ ] "Satisfied" badge renamed to "Accepted"
- [ ] Bulk button: "Accept remaining (N)" not "Satisfy remaining (N)"

---

*End of refinements. Apply after the consolidated file. Delete after verified.*
