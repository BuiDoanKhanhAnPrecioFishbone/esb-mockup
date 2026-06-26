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

### MV-01: Remove "Draft" tag — rename to "Verified" and "Flagged"
**Issue:** POC still uses "Draft" as a node status. We now only have two statuses.
**Change:**

| Old status | New status | Visual |
|---|---|---|
| Draft | *(removed)* | — |
| Verified | **Verified** | Purple node, emerald badge when canonical |
| *(new)* | **Flagged** | Rose/amber badge — node reported via UC-HO-06, pending Manager review |

"Flagged" is the recommended name — short, fits a badge, clear meaning. A flagged node has been reported for hallucination or error. Once the Manager resolves it (approve/reject/edit), it returns to Verified.

**Affects:** KG Explorer node rendering, legend, any status filters in the chat copilot.
**File:** `components/mockups/knowledge-graph-explorer.jsx`

### MV-02: Rename "System node" to "Module"
**Issue:** The gray structural nodes (Payment Service, CI/CD Pipeline, etc.) are labeled "System" in the legend. This is confusing — they're module-level grouping nodes.
**Change:** Rename from "System" to **"Module"** in the graph legend and any internal references. Matches the session terminology where these are called "modules."
**Updated legend:** Knowledge (purple) · Module (gray) · Flagged (rose)
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

### MV-06: Functional drag-and-drop
**Issue:** Data tab shows a static drag handle icon (⠿) on cards but no actual drag interaction.
**Recommendation:** 
- **If time allows:** Implement React DnD (or simple onDrag handlers) so cards can be dragged between modules and to/from Uncategorized. Impressive demo moment.
- **Fallback:** Keep static icon, add hover tooltip "Drag to reorder modules" — implies capability without full implementation.
**Priority:** Nice-to-have. The "Move to" dropdown already provides the same functionality.
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

### OV-04: Redesign "Complete" page
**Issue:** The Offboarder's Complete page (after Manager commits to KG) is plain and not engaging.
**Change:** Make it a proper thank-you/celebration page:
1. Illustration or artwork (connected knowledge graph nodes — knowledge preserved)
2. "Thank you, Minh Lê" heading
3. Contribution stats: questions answered, modules covered, knowledge entries created
4. "What happens next" timeline: Your answers → Manager review → Knowledge Graph → Successor's playbook
5. Optionally: "Your knowledge will help Trần Hữu Nam get up to speed" — personal touch
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

### CW-03: Inconsistent question count (Image 2)
**Screenshot:** Image 2 — header shows "2 answers ready · 2 waiting · 4 asked total" but only 2 question cards are displayed. Answer text is not shown.
**Issues:**
1. **Missing questions:** If 4 questions were asked, all 4 should be visible (or clearly separated by status tabs/sections: "Ready for review" vs "Waiting for answer")
2. **Missing answer text:** The Coworker's job is to REVIEW answers. They need to see the actual answer text, not just the status. Each card should show the question + the Offboarder's answer + approve/flag actions.
**Change:**
- Show all 4 questions, grouped by status:
  - "Ready for review (2)" — shows question + answer + approve/flag buttons
  - "Waiting for answer (2)" — shows question + status "Waiting · 1 day"
- Alternatively, add filter tabs: All / Ready / Waiting
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
| 🟡 Medium | CW-02 | Ask a question → Data tab not Overview | ha-vy-handover-dashboard.jsx |
| 🟡 Medium | CW-04 | Deep links from dashboard to card Q&A | ha-vy-handover-dashboard.jsx |
| 🟡 Medium | CW-05 | Show coworker list on Coworker Overview | session-command-view.jsx |
| 🟡 Medium | OV-03 | Distinct "All Answered" celebration state | session-command-view.jsx |
| 🟡 Medium | OV-04 | Redesign Complete page | session-command-view.jsx |
| 🟡 Medium | GV-01 | Node ambient motion | knowledge-graph-explorer.jsx |
| 🟡 Medium | MV-07 | Verify AI question edit/delete in gap rows | session-command-view.jsx |
| 🟡 Medium | CW-01 | Remove upload from Coworker Logs | session-command-view.jsx |
| 🟡 Medium | MV-03 | Orbital empty state on dashboard | ha-vy-handover-dashboard.jsx |
| 🟢 Low | MV-06 | Functional drag-and-drop (nice-to-have) | session-command-view.jsx |

---

## Open questions to confirm

1. **MV-01:** Is "Flagged" the right name for reported nodes, or prefer "Disputed" / "Under review"?
2. **MV-06:** Build functional drag-and-drop, or keep static icon as fallback?
3. **CW-03:** Group questions by status (Ready / Waiting sections), or add filter tabs (All / Ready / Waiting)?
4. **OV-04:** Should the Complete page include a "What happens next" timeline, or keep it simple with just stats + thank you?

---

*End of review notes. Apply via Claude Code using this file as the instruction set.*
