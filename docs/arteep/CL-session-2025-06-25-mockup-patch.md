# Patch: Apply §8 Discussion Items to Mockup

*For Claude Code. Read this file, then apply each change to the specified file.*
*Reference: `docs/arteep/CL-session-2025-06-25-build-queue.md` §8 for full context.*

---

## Patch 1: Remove Filter button from KG Explorer (§8.1a)

**File:** `components/mockups/knowledge-graph.jsx`

**Find:** The Filter button in the graph header/toolbar area. It will look something like:
```jsx
<button ...><Filter ... />Filter</button>
```
or similar with a `ti-filter` icon or `Filter` import from lucide-react.

**Action:** Remove the Filter button entirely. Keep the Zoom button. The toolbar should only show: title + entry count badge + zoom button.

**Also:** Check padding/spacing of the graph header toolbar after removal — make sure it looks balanced with just title + badge + zoom.

---

## Patch 2: Gap → normal node on commit (§8.1c)

**File:** `components/mockups/knowledge-graph.jsx`

**Rule:** The KG Explorer only shows committed entries. Committed entries are NEVER gaps. All nodes in the KG Explorer should be purple (knowledge) or gray (structural). No yellow gap nodes should appear.

**Action:** If there are any yellow/gap nodes in the KG Explorer graph data, change them to normal purple knowledge nodes. The KG Explorer represents the post-commit state — gaps only exist within active sessions, not in the committed graph.

**Check:** Verify the legend at the bottom. If it still lists "Gap" as a node type, remove it from the KG Explorer legend. Gaps are session-scoped only.

---

## Patch 3: AI question editing (§8.2)

**File:** `components/mockups/session-command-view.jsx`

**Current behavior:** In the `EditableQuestion` component, the `canEdit` prop controls whether hover pencil/trash icons appear. AI-generated questions (`fromType === "ai"` or `from === "AI-generated"`) currently don't get edit/delete affordances.

**Change:** AI-generated questions should be editable and deletable by Manager and Coworker, using the same inline edit + trash pattern as human questions.

**Where to check:**
- The `canEdit` prop is passed based on `canEditQs` which is `isPrepare && role !== "offboarder"`. This should already apply to ALL questions regardless of source. Verify that AI-generated questions in `MODULES_DATA` (the `qs` arrays inside card items) get the same hover edit/delete icons as human-added questions.
- If there is any conditional that skips edit/delete for AI questions specifically, remove it.
- The questions in `SEED_GQ` (general questions) and inline card questions should ALL show edit/delete on hover for Manager/Coworker in Prepare.

**File:** `components/mockups/session-thanh-tung.jsx`

**Same change:** Verify AI-generated questions (like `q1` in `SEED_QUESTIONS` with `fromType: "ai"`) show edit/delete icons on hover. The `QuestionRow` component should already support this since all questions go through the same render path.

---

## Patch 4: Offboarder hybrid queue — "See in context" (§8.3)

**File:** `components/mockups/session-command-view.jsx`

**Current behavior:** The `OffboarderOverview` component (Capture state) shows a flat question queue with `QCard` components. The `OffboarderQueue` in `DataContent` also shows questions.

**Change:** Add a "See in context" link to each question in the Offboarder Capture view.

**Implementation:**

1. In each question card/row visible to the Offboarder during Capture, add a small link:
```jsx
<span
  onClick={(e) => { e.stopPropagation(); onSelectCard(cardForThisQuestion); }}
  className="text-[9px] text-violet-600 hover:text-violet-700 cursor-pointer inline-flex items-center gap-1 ml-auto"
>
  <ExternalLink className="w-2.5 h-2.5" />
  See in context
</span>
```

2. When clicked, open the existing SidePanel (480px right drawer) showing the source card with: description, checklist, gap, files, other questions on that card.

3. The active question should be highlighted with a violet border (`border-violet-500`) when its context panel is open.

4. **Important:** The Offboarder should NOT see the full module → card tree structure. They only see:
   - Question text
   - Who asked (AI / Hà Vy / Coworker)
   - Module tag as a small badge ("Payment Service") — light context hint only
   - Answer input
   - "See in context" link

5. The Offboarder should NOT see: module headers, board groupings, card counts, gap rows, flag badges, drag handles, "Move to" actions, rename buttons.

---

## Verification after applying

1. Open `/knowledge-graph` — confirm no Filter button, no yellow gap nodes, clean toolbar
2. Open `/session/minh-le` as Manager in Prepare state → Data tab → expand a module → hover an AI-generated question → confirm pencil + trash icons appear
3. Open `/session/minh-le` as Offboarder in Capture state → confirm flat question queue with "See in context" links → click one → confirm side panel opens with card detail
4. Open `/session/thanh-tung` → Data tab → hover AI question → confirm edit/delete icons

---

*End of patch. Delete this file after all patches are applied and verified.*
