# ART-EEP — Mockup Review + Build Instructions (2025-06-25)

*Single instruction file for Claude Code. Contains all NOT BUILT features, consistency fixes, and review issues.*
*Apply in the order listed. Delete this file after everything is verified.*

---

## PART A: Features to build

### A1. Dashboard redesign — NOT BUILT 🔒

**File:** `components/mockups/ha-vy-handover-dashboard.jsx`

#### A1.1 Manager dashboard (`ManagerActive` function)

**Remove:**
- 4 KPI tiles ("Needs your action", "Deadline ≤ 7 days", "Active sessions", "Open gaps")
- "Needs your action" / "Waiting on you" tags and `blockedOnManager` logic

**Add — Greeting banner:**
- Gradient background (`#f5f3ff` → `#ede9fe` → `#faf5ff`)
- "Good afternoon, Hà Vy" + "2 active handovers" subtitle
- Faint decorative graph nodes in the background corner (very low opacity)

**Change — Session cards (section title stays "Active sessions"):**
- Days left stays as **text** (no countdown ring, no urgency left border)
- Phase progress bar kept (3 segments: Prepare / Capture / Deliver, with sub-stage fill)
- Replace old metrics line with **inline knowledge metrics**: `✨ 4/6 gaps resolved · 💬 9/14 answered`
- One compact text row — no full-width bars

**Add — Dashed "+ Create session" card** below session cards

**Keep — Activity feed:** compact, same position

**Add — Empty state (zero active sessions):**
- **Orbital illustration:** central AI node with gradient fill (#7c3aed → #a78bfa), 3 elliptical orbital rings (`stroke: #ede9fe`, 0.8px), smaller knowledge nodes orbiting slowly (CSS `@keyframes` rotation, 12-20s cycles, different speeds per ring)
- "No departures on the horizon"
- "When someone's leaving, their knowledge graph starts building here."
- "+ Create session" CTA button with gradient background (`linear-gradient(135deg, #6366f1, #7c3aed)`)
- Only shown when Manager has zero active sessions. When first session is created, orbital disappears and session cards appear.

#### A1.2 Offboarder dashboard (`OBActiveQueue` function)

- **Remove** "Files uploaded" KPI tile (upload removed from POC)
- **Keep** "To answer" and "Answered" tiles
- **Add greeting banner:** "Good afternoon, Minh Lê" · "5 questions waiting for you" — same gradient as Manager
- **Completion state** ("You're all caught up"): keep existing green checkmark, optionally add small illustration (connected graph nodes)

#### A1.3 Coworker dashboard (`CoworkerActive` function)

- **Keep** existing KPI tiles ("Answers to review", "Waiting for answer", "Active sessions")
- **Add greeting banner:** "Good afternoon" · "3 answers to review across 2 sessions" — same gradient
- **Completion state** ("All satisfied"): keep existing structure, optionally add matching illustration

#### A1.4 Artwork summary

| Artwork | Manager | Offboarder | Coworker |
|---|---|---|---|
| Greeting banner | ✅ personalized | ✅ personalized | ✅ generic |
| Empty state orbital | ✅ (no sessions) | ❌ (n/a) | ❌ (n/a) |
| Completion celebration | ✅ (emerald banner) | ✅ (all caught up) | ✅ (all satisfied) |

---

### A2. Chat-to-graph interactive node references — NOT BUILT 🔒

**File:** `components/mockups/knowledge-graph-explorer.jsx`

**Decision:** AI chat responses contain clickable node references that bridge text and graph.

#### Visual style

| Property | Value |
|---|---|
| Text color | Violet (`#5b21b6`) |
| Background | Subtle violet (`#f5f3ff`) |
| Underline | `text-decoration: underline`, `text-decoration-color: #c4b5fd`, offset 2px |
| Border radius | 3px (inline pill shape) |
| Cursor | Pointer |

#### Interactions

| Action | What happens |
|---|---|
| **Hover** reference in chat | Graph highlights that specific node (violet glow ring `box-shadow: 0 0 0 4px rgba(124,58,237,0.2)`, others dim to ~20% opacity). "Node name · from chat" indicator appears on graph top-left |
| **Click** reference in chat | Graph zooms to that node + node detail drawer opens from the right |
| **Multiple references** in one response | Each highlights independently on hover |
| **Mouse leave** reference | Graph returns to normal (all nodes visible, no highlighting) |

#### Example AI response
```
"Start with [Kafka retry config] — incomplete checklist, DLQ undocumented.
Then review [Stripe webhook handler] since it depends on retry logic."
```
Each `[bracketed term]` renders as inline violet reference linked to existing graph node.

#### Rules
- Only existing nodes — references never create new nodes
- Node matching by `id` or `label` in graph data
- If referenced node doesn't exist in graph, render as plain text (no link)
- Works alongside dynamic recommendation chips

---

## PART B: Review issues (by view)

### Graph View

#### GV-01: Node ambient motion
**Issue:** Graph nodes are completely static.
**Change:** Add subtle slow ambient animation — nodes drift slightly in random directions. CSS `@keyframes` with small translate offsets (±3px) over 10-20 second cycles. Different delays per node so they don't move in sync.
**File:** `components/mockups/knowledge-graph-explorer.jsx`

---

### Manager View

#### MV-01: Remove "Draft" tag — use "Verified" and "Flagged" ✅ LOCKED
**Issue:** POC still uses "Draft" as a node status. Now only two statuses.
**Change:**

| Old status | New status | Visual |
|---|---|---|
| Draft | *(removed)* | — |
| Verified | **Verified** | Purple node (#ede9fe border #c4b5fd), emerald badge when canonical |
| *(new)* | **Flagged** | Rose node (#fff1f2 border #fda4af), small rose "Flagged" badge with flag icon. Reported via UC-HO-06, pending Manager review. Resolves back to Verified |

**Updated legend:** Verified (purple) · Flagged (rose) · Module (gray)
**File:** `components/mockups/knowledge-graph-explorer.jsx`

#### MV-02: Rename "System node" to "Module"
**Issue:** Gray structural nodes labeled "System" in legend. Should be "Module" to match session terminology.
**Change:** Rename in graph legend + any internal references.
**File:** `components/mockups/knowledge-graph-explorer.jsx`

#### MV-03: Orbital empty state location
**Decision:** On the Manager dashboard (`/` route) when zero active sessions. See §A1.1 for full spec.
**File:** `components/mockups/ha-vy-handover-dashboard.jsx`

#### MV-04: `/sessions` route not updated
**Issue:** `all-sessions.jsx` hasn't been updated to match Dashboard/Session Details changes.
**Change:** Audit and align:
- New session card structure (inline knowledge metrics, no KPI tiles)
- Remove "Needs your action" / "Waiting on you" tags
- Remove upload references
- Ensure phase progress bar matches dashboard format
**File:** `components/mockups/all-sessions.jsx`

#### MV-05: Logs tab still tracks file uploads
**Issue:** Logs tab shows file upload events. Upload removed from POC.
**Change:** Remove all file-upload log entries from mock data. Keep question/answer/gap/coworker log entries.
**File:** `components/mockups/session-command-view.jsx` — `LogsTab` or `AuditContent` function

#### MV-06: Functional drag-and-drop ✅ LOCKED
**Issue:** Static drag handle icon (⠿) with no interaction.
**Change:** Build functional React DnD.

**Three states:**
1. **Idle** — handle (⠿) appears on card row hover. Cursor: grab.
2. **Dragging** — card lifts as ghost (violet border, shadow, slight rotation). Target modules highlight with violet border as drop zones. Original position shows dashed placeholder.
3. **Dropped** — card lands in new module with violet highlight + "moved" badge (fades after 3s). Source/destination card counts update.

**Card movement rules:**

| Rule | Value |
|---|---|
| Primary-only cards | ✅ Can be dragged between modules or to/from Uncategorized |
| Uncategorized cards | ✅ Can be dragged into any module |
| Linked cards (1:N) | ❌ Cannot be dragged. Handle hidden or grayed out with tooltip "This card is linked to multiple modules — use Move to" |
| Linked card reassignment | Use "Move to" dropdown — shows all current assignments |
| Gaps after card move | Independent — gaps are module-level, unaffected by card moves |
| Q&A after card move | Moves with the card — belongs to card, not module |

**File:** `components/mockups/session-command-view.jsx` — `ModuleSection` / card rows

#### MV-07: Edit/remove AI-generated questions in Gaps section
**Decision (locked in §8.2):** AI questions editable + deletable. Same hover pencil + trash as human questions. Deleting last question does NOT dismiss gap.
**Verify:** Check `canEdit` prop reaches AI-generated question rows in gap sections.
**File:** `components/mockups/session-command-view.jsx`

---

### Offboarder View

#### OV-01: Remove double header (greeting inside session)
**Screenshot:** Session header "Minh Lê's session · CAPTURE" + below tabs "Good afternoon, Minh Lê" card.
**Issue:** Greeting banner designed for dashboard only. Redundant inside session detail.
**Change:** Remove "Good afternoon, Minh Lê · 5 questions waiting for you" from Offboarder's session Overview tab. Keep greeting ONLY on dashboard.
**File:** `components/mockups/session-command-view.jsx` — Offboarder Overview rendering

#### OV-02: Offboarder data access scope (verify)
**Decision (locked in §8.3):** Offboarder does NOT see full data page. Capture = flat question queue + "See in context". Deliver/Complete = read-only summary.
**Status:** Verify implementation matches.

#### OV-03: "All Answered" state needs distinct design
**Issue:** Same visual as Active Queue — should be a celebration moment.
**Change:**
1. Green checkmark icon or small connected-nodes illustration
2. "You're all caught up!" heading
3. Contribution summary: "You answered 14 questions across 5 modules"
4. Read-only list of submitted answers (collapsed by default, expandable)
5. No answer inputs, no Submit buttons, no progress bar
**File:** `components/mockups/session-command-view.jsx` — Offboarder state rendering

#### OV-04: Redesign "Complete" page ✅ LOCKED
**Change:** Proper thank-you/celebration page:
1. **Green gradient header** (`#f0fdf4` → `#dcfce7`) with connected-nodes SVG illustration (emerald gradient nodes + lines)
2. **"Thank you, Minh Lê"** + "Your knowledge has been preserved."
3. **Contribution stats** (3 cards grid): 14 questions answered · 5 modules covered · 42 knowledge entries
4. **"What happens next" timeline** (3 steps only — NO successor playbook):
   - ✅ Your answers submitted (green, completed)
   - 🔵 Manager review — "Hà Vy will verify your answers and resolve any gaps" (violet, in progress)
   - ⚪ Committed to Knowledge Graph — "Your knowledge becomes a permanent part of the team's memory" (gray, upcoming)
5. **Footer:** "Thank you for contributing to the team's success."

**NOTE:** No successor's playbook step — ART-EEP POC does not have this feature.
**File:** `components/mockups/session-command-view.jsx` — Offboarder Complete state

---

### Coworker View

#### CW-01: Remove upload references from Logs tab
**Same as MV-05.** Remove file-upload log entries from Coworker Logs.
**File:** `components/mockups/session-command-view.jsx`

#### CW-02: "Ask a question" → Data tab not Overview
**Issue:** Button navigates to Overview tab.
**Change:** Update to `?tab=data`. Coworker needs module/card structure to ask contextual questions.
**File:** `components/mockups/ha-vy-handover-dashboard.jsx` — Coworker session card CTA

#### CW-03: Fix question count + show answer text ✅ LOCKED
**Issue:** "4 asked total" but only 2 shown. No answer text visible.
**Change:** Separate sections:

**Section 1: "Ready for review (2)"**
- Question text + Offboarder's full answer (green-left-bordered card)
- Satisfy / Needs more buttons
- Module tag
- Each question is a deep link (see CW-04)

**Section 2: "Waiting for answer (2)"**
- Question text + when asked + "Waiting · 1 day" status
- Module tag
- No action buttons

**File:** `components/mockups/ha-vy-handover-dashboard.jsx` — Coworker session card

#### CW-04: Deep links from dashboard to card Q&A
**Issue:** Question clicks should go to specific card, not generic session.
**Change:** Link to `/session/minh-le?tab=data&card=<cardId>` — opens Data tab with side panel pre-opened on that card.
**File:** `components/mockups/ha-vy-handover-dashboard.jsx` — question click handlers

#### CW-05: Overview tab should show coworker list
**Issue:** Coworker's Overview tab missing coworker list.
**Change:** Add `CoworkerNetwork` component in **read-only mode** — no "+ Add", no × remove. Just names, avatars, shared card counts, join status.
**File:** `components/mockups/session-command-view.jsx` — Coworker Overview rendering

---

## PART C: Consistency cleanup

### C1. KG Explorer cleanup
**File:** `components/mockups/knowledge-graph-explorer.jsx`

| Issue | Change |
|---|---|
| 5 fixed `CHIPS` array (Show risks, Auth flow, etc.) | Remove — replaced by dynamic contextual chips in chat |
| `FilterChip` component (~line 94) | Remove — filtering through chat only |
| Graph toolbar filter button | Remove if still present — toolbar = title + entry count + zoom only |
| Graph toolbar padding | Review spacing after filter removal for visual balance |
| Chat layout | Verify left-panel layout matches spec: history sidebar (~120px, hide/show toggle) + active chat (~180px) |
| Node statuses | Remove "Draft", add "Flagged" per MV-01 |
| Legend | Update to: Verified (purple) · Flagged (rose) · Module (gray) |
| Node references | Add per §A2 |
| Node motion | Add per GV-01 |

### C2. Dashboard cleanup
**File:** `components/mockups/ha-vy-handover-dashboard.jsx`

See §A1 for full spec. Summary of all changes:
- Manager: remove 4 KPI tiles, remove action/waiting tags, add greeting banner, add inline metrics, add orbital empty state
- Offboarder: remove "Files uploaded" tile, add greeting banner
- Coworker: add greeting banner, fix question sections (CW-03), fix Ask button (CW-02), add deep links (CW-04)

### C3. Session view cleanup
**File:** `components/mockups/session-command-view.jsx`

| Issue | Change |
|---|---|
| OV-01 | Remove greeting card from Offboarder session Overview |
| OV-03 | Build distinct "All Answered" celebration state |
| OV-04 | Build Complete page with thank-you + 3-step timeline |
| MV-05 + CW-01 | Remove file-upload entries from Logs tab mock data |
| MV-06 | Build functional drag-and-drop (linked cards blocked) |
| MV-07 | Verify AI question edit/delete in gap rows |
| CW-05 | Add CoworkerNetwork (read-only) to Coworker Overview |

### C4. All-sessions page cleanup
**File:** `components/mockups/all-sessions.jsx`

Audit and align with dashboard changes (MV-04). Remove stale tags, upload refs, update card format.

### C5. Orphaned files — DELETE

| File | Why |
|---|---|
| `components/mockups/prepare-stage.jsx` | Replaced by Prepare steps inside `session-command-view.jsx`. Has stale "Successor" row |
| `components/mockups/uc-ho-01-quick-initiate.jsx` | Replaced by `create-session.jsx` |

---

## Priority order

| # | Scope | Files |
|---|---|---|
| 1 | Dashboard redesign (A1) + dashboard fixes (CW-02, CW-03, CW-04) | `ha-vy-handover-dashboard.jsx` |
| 2 | Session view fixes (OV-01, OV-03, OV-04, MV-05, MV-06, MV-07, CW-01, CW-05) | `session-command-view.jsx` |
| 3 | KG Explorer (MV-01, MV-02, GV-01, A2, filter/chip cleanup) | `knowledge-graph-explorer.jsx` |
| 4 | All-sessions page (MV-04) | `all-sessions.jsx` |
| 5 | Delete orphaned files (C5) | `prepare-stage.jsx`, `uc-ho-01-quick-initiate.jsx` |

---

## Verification checklist

After applying all changes:

- [ ] `/` — Manager dashboard: no KPI tiles, greeting banner visible, inline metrics on cards, orbital shows when zero sessions
- [ ] `/` — Offboarder dashboard: no "Files uploaded" tile, greeting banner visible
- [ ] `/` — Coworker dashboard: greeting banner, questions grouped Ready/Waiting with answer text
- [ ] `/session/minh-le` — Offboarder: no greeting card inside session, flat question queue with "See in context"
- [ ] `/session/minh-le` — Offboarder All Answered: celebration state, not empty queue
- [ ] `/session/minh-le` — Offboarder Complete: thank-you page, 3-step timeline, no playbook step
- [ ] `/session/minh-le` — Manager Data tab: drag-and-drop works on primary/uncategorized cards, linked cards blocked
- [ ] `/session/minh-le` — Logs tab: no file upload entries
- [ ] `/session/minh-le` — Coworker Overview: coworker list visible (read-only)
- [ ] `/session/minh-le` — Coworker "Ask a question" → goes to Data tab
- [ ] `/knowledge-graph` — no Draft nodes, Verified + Flagged + Module in legend
- [ ] `/knowledge-graph` — no filter button, no fixed AI chips, no FilterChip component
- [ ] `/knowledge-graph` — node references in chat: hover highlights, click opens drawer
- [ ] `/knowledge-graph` — nodes drift slowly (ambient motion)
- [ ] `/sessions` — cards match dashboard format, no stale tags
- [ ] `prepare-stage.jsx` deleted
- [ ] `uc-ho-01-quick-initiate.jsx` deleted

---

*End of review + build instructions. Delete this file after all items are applied and verified.*
