# ART-EEP — Mockup Review Notes (2025-06-25)

*Review of deployed mockup state. No code changes — issues documented for Claude Code to apply later.*

---

## Graph View

### GV-01: Node ambient motion
**Issue:** Graph nodes are completely static.
**Change:** Add subtle slow ambient animation — nodes drift slightly in random directions. CSS `@keyframes` with small translate offsets (±3px) over 10-20 second cycles. Different delays per node so they don't move in sync.
**File:** `components/mockups/knowledge-graph-explorer.jsx`

---

## Manager View

### MV-01: Remove "Draft" tag — rename to "Verified" and "Flagged" ✅ LOCKED
**Issue:** POC still uses "Draft" as a node status. We now only have two statuses.
**Change:**

| Old status | New status | Visual |
|---|---|---|
| Draft | *(removed)* | — |
| Verified | **Verified** | Purple node, emerald badge when canonical |
| *(new)* | **Flagged** | Rose border + small rose "Flagged" badge with flag icon — node reported via UC-HO-06, pending Manager review |

Updated legend: **Verified** (purple) · **Flagged** (rose) · **Module** (gray)

**Affects:** KG Explorer node rendering, legend, any status filters in the chat copilot.
**File:** `components/mockups/knowledge-graph-explorer.jsx`

### MV-02: Rename "System node" to "Module"
**Issue:** The gray structural nodes (Payment Service, CI/CD Pipeline, etc.) are labeled "System" in the legend. This is confusing — they're module-level grouping nodes.
**Change:** Rename from "System" to **"Module"** in the graph legend and any internal references. Matches the session terminology where these are called "modules."
**File:** `components/mockups/knowledge-graph-explorer.jsx`

### MV-03: Orbital empty state location
**Issue:** The orbital illustration (§9 in build queue) is not yet built. Clarification needed on where it appears.
**Decision:** It belongs on the **Manager dashboard** (`/` route, `ha-vy-handover-dashboard.jsx`) when there are zero active sessions. NOT a separate "Departure Pending" page. When the first session is created, the orbital disappears and session cards appear.
**File:** `components/mockups/ha-vy-handover-dashboard.jsx`

### MV-04: `/sessions` route not updated
**Issue:** The `esb-mockup.vercel.app/sessions` (all-sessions page) hasn't been updated to reflect recent Dashboard and Session Details changes.
**Change:** Audit `all-sessions.jsx` and align with:
- New session card structure (inline knowledge metrics, no KPI tiles)
- Remove any "Needs your action" / "Waiting on you" tags
- Remove any upload references
- Ensure phase progress bar matches the dashboard card format
**File:** `components/mockups/all-sessions.jsx`

### MV-05: Logs tab still tracks file uploads
**Issue:** The Logs/Audit tab in Session Details still shows file upload events ("File uploaded: kafka-config.yaml"). Upload is removed from POC.
**Change:** Remove all file-upload log entries from the Logs tab mock data. Keep other log entries (questions asked, answers submitted, gaps detected, coworker joined, etc.).
**File:** `components/mockups/session-command-view.jsx` — `LogsTab` or `AuditContent` function

### MV-06: Functional drag-and-drop ✅ LOCKED
**Issue:** Data tab shows a static drag handle icon (⠿) on cards but no actual drag interaction.
**Decision:** Build functional drag-and-drop. Implement React DnD (or simple onDrag handlers) so cards can be dragged between modules and to/from Uncategorized.

**Three interaction states:**
1. **Idle** — drag handle (⠿) appears on card row hover. Cursor changes to grab.
2. **Dragging** — card lifts as a ghost (violet border, shadow, slight rotation). Target modules highlight with violet border as drop zones. Original position shows dashed placeholder.
3. **Dropped** — card lands in new module with violet highlight + "moved" badge (fades after 3s). Source/destination card counts update.

**Card movement rules:**

| Rule | Value |
|---|---|
| Primary-only cards | ✅ Can be dragged between modules or to/from Uncategorized |
| Uncategorized cards | ✅ Can be dragged into any module |
| Linked cards (1:N) | ❌ Cannot be dragged — they exist in multiple modules by design. Drag handle is hidden or grayed out with tooltip "This card is linked to multiple modules — use Move to" |
| Linked card reassignment | Use the "Move to" dropdown instead — it shows all current assignments and lets the Manager pick precisely |
| Gaps after card move | Gaps are independent of card moves. Moving a card does NOT create, resolve, or invalidate any gap. Gaps are module-level knowledge assessments, not card-level |
| Q&A after card move | Questions and answers move with the card — they belong to the card, not the module |

**File:** `components/mockups/session-command-view.jsx` — `ModuleSection` / card rows

### MV-07: Edit/remove AI-generated questions in Gaps section
**Issue:** AI-generated questions in gap rows may not have edit/delete affordances.
**Decision (already locked in §8.2):** AI-generated questions are editable AND deletable by Manager and Coworker. Same hover pencil + trash pattern as human questions. Deleting a gap's last question does NOT dismiss the gap — gap stays visible with zero questions.
**Verify:** Check that `canEdit` prop is passed to AI-generated question rows in gap sections, not just card-level questions.
**File:** `components/mockups/session-command-view.jsx`

---

## Offboarder View

### OV-01: Remove double header (greeting inside session)
**Screenshot:** Image 1 — session header "Minh Lê's session · CAPTURE" appears at top, then below the tabs a "Good afternoon, Minh Lê" greeting card appears.
**Issue:** The greeting banner was designed for the **dashboard**, not inside the session detail page. Inside the session, the session header already identifies the user. The greeting is redundant.
**Change:** Remove the "Good afternoon, Minh Lê · 5 questions waiting for you" card from the Offboarder's session Overview tab. Keep the greeting banner ONLY on the dashboard.
**File:** `components/mockups/session-command-view.jsx` — Offboarder Overview rendering

### OV-02: Offboarder data access scope (double-check)
**Decision (already locked in §8.3):** The Offboarder does NOT see the full data page (module tree, card counts, board headers). They see:
- **Capture:** Flat question queue + "See in context" link → opens side panel with specific card
- **Deliver/Complete:** Read-only summary (contribution stats, thank-you, timeline)

They never see the full module → card tree structure. The module tag on each question provides light context. "See in context" opens the specific card's detail, not the whole tree.
**Status:** Already locked. Verify implementation matches.

### OV-03: "All Answered" state needs distinct design
**Issue:** The "All Answered" state looks identical to the "Active Queue" state — same layout, just no unanswered questions. It should feel like a celebration/completion moment.
**Change:** When all questions are answered, show:
1. A green checkmark icon or small celebration illustration (matching the orbital illustration style — connected graph nodes)
2. "You're all caught up!" heading
3. Contribution summary: "You answered 14 questions across 5 modules"
4. Read-only list of submitted answers below (collapsed by default, expandable)
5. Distinct from the active queue — no answer inputs, no "Submit" buttons, no progress bar
**File:** `components/mockups/session-command-view.jsx` — Offboarder state rendering

### OV-04: Redesign "Complete" page ✅ LOCKED
**Issue:** The Offboarder's Complete page (after Manager commits to KG) is plain and not engaging.
**Change:** Make it a proper thank-you/celebration page:

1. **Green gradient header** with connected-nodes illustration (small SVG — gradient emerald nodes connected by lines)
2. **"Thank you, Minh Lê"** heading + "Your knowledge has been preserved." subtitle
3. **Contribution stats** (3 cards in a grid):
   - 14 questions answered
   - 5 modules covered
   - 42 knowledge entries
4. **"What happens next" timeline** (3 steps):
   - ✅ Your answers submitted (completed, green)
   - 🔵 Manager review — "Hà Vy will verify your answers and resolve any gaps" (in progress, violet)
   - ⚪ Committed to Knowledge Graph — "Your knowledge becomes a permanent part of the team's memory" (upcoming, gray)
5. **Footer:** "Thank you for contributing to the team's success."

**NOTE:** No successor's playbook step — ART-EEP POC does not have this feature. Timeline is 3 steps only.

**File:** `components/mockups/session-command-view.jsx` — Offboarder Complete state

---

## Coworker View

### CW-01: Remove upload references from Logs tab
**Issue:** Same as MV-05 — the Coworker's Logs tab may still show file upload events.
**Change:** Remove file-upload log entries. Keep question/answer/review log entries.
**File:** `components/mockups/session-command-view.jsx` — Coworker Logs rendering

### CW-02: "Ask a question" button should go to Data tab
**Issue:** Clicking "Ask a question" on the Coworker dashboard navigates to the Overview tab instead of the Data tab.
**Change:** Update the link/navigation target to `?tab=data` (or the Data tab equivalent). The Coworker needs to see the module/card structure to ask contextual questions.
**File:** `components/mockups/ha-vy-handover-dashboard.jsx` — Coworker session card CTA

### CW-03: Inconsistent question count — separate sections ✅ LOCKED
**Screenshot:** Image 2 — header shows "2 answers ready · 2 waiting · 4 asked total" but only 2 question cards are displayed. Answer text is not shown.
**Change:** Show all questions, grouped into two separate sections:

**Section 1: "Ready for review (2)"**
- Shows question text + Offboarder's full answer text (in a green-left-bordered card)
- Satisfy / Needs more buttons on each
- Module tag on each question
- Each question is a deep link (see CW-04)

**Section 2: "Waiting for answer (2)"**
- Shows question text + when asked + status ("Waiting · 1 day")
- Module tag
- No action buttons — nothing to review yet

**File:** `components/mockups/ha-vy-handover-dashboard.jsx` — Coworker session card

### CW-04: Deep links from dashboard to specific card Q&A
**Issue:** Clicking a question on the Coworker dashboard should navigate directly to that card's Q&A in the Data tab, not to a generic session view.
**Change:** Each question on the dashboard card should link to `/session/minh-le?tab=data&card=<cardId>` (or equivalent) which opens the Data tab and auto-expands/scrolls to the specific card with its Q&A visible. If the side panel pattern is used, clicking the question opens the session Data tab with the side panel pre-opened on that card.
**File:** `components/mockups/ha-vy-handover-dashboard.jsx` — question click handlers

### CW-05: Overview tab should show coworker list
**Issue:** The Coworker's Overview tab doesn't display the list of coworkers in the session.
**Change:** Add the `CoworkerNetwork` component (already built for Manager view) to the Coworker's Overview tab, but in **read-only mode** — no "+ Add" button, no × remove. Just the list of who's participating: names, avatars, shared card counts, join status.
**File:** `components/mockups/session-command-view.jsx` — Coworker Overview rendering

---

## Summary by priority

| Priority | ID | Description | File |
|---|---|---|---|
| 🔴 High | OV-01 | Remove double header (greeting inside session) | session-command-view.jsx |
| 🔴 High | CW-03 | Fix inconsistent question count + show answer text | ha-vy-handover-dashboard.jsx |
| 🔴 High | MV-01 | Remove Draft tag, add Verified + Flagged | knowledge-graph-explorer.jsx |
| 🔴 High | MV-05 | Remove file upload from Logs tab | session-command-view.jsx |
| 🟡 Medium | MV-02 | Rename System → Module in legend | knowledge-graph-explorer.jsx |
| 🟡 Medium | MV-04 | Update /sessions route | all-sessions.jsx |
| 🟡 Medium | MV-06 | Functional drag-and-drop (linked cards blocked) | session-command-view.jsx |
| 🟡 Medium | CW-02 | Ask a question → Data tab not Overview | ha-vy-handover-dashboard.jsx |
| 🟡 Medium | CW-04 | Deep links from dashboard to card Q&A | ha-vy-handover-dashboard.jsx |
| 🟡 Medium | CW-05 | Show coworker list on Coworker Overview | session-command-view.jsx |
| 🟡 Medium | OV-03 | Distinct "All Answered" celebration state | session-command-view.jsx |
| 🟡 Medium | OV-04 | Redesign Complete page (3-step timeline, no playbook) | session-command-view.jsx |
| 🟡 Medium | GV-01 | Node ambient motion | knowledge-graph-explorer.jsx |
| 🟡 Medium | MV-07 | Verify AI question edit/delete in gap rows | session-command-view.jsx |
| 🟡 Medium | CW-01 | Remove upload from Coworker Logs | session-command-view.jsx |
| 🟡 Medium | MV-03 | Orbital empty state on dashboard | ha-vy-handover-dashboard.jsx |

---

## All open questions resolved ✅

| Question | Decision |
|---|---|
| MV-01: Node status naming | **Flagged** — short, fits badge, clear meaning |
| MV-06: Drag-and-drop | **Functional** — build actual DnD. Linked cards blocked from dragging |
| MV-06: Card move + gaps | **Independent** — gaps are module-level, unaffected by card moves |
| MV-06: Linked card movement | **Blocked** — linked cards can't be dragged. Use "Move to" dropdown instead |
| CW-03: Question grouping | **Separate sections** — "Ready for review" + "Waiting for answer" |
| OV-04: Complete page | **"What happens next" timeline** — 3 steps (no successor playbook) |

---

*End of review notes. Apply via Claude Code using this file as the instruction set.*
