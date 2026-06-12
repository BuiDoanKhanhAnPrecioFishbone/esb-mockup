# CL-124 — Offboarder Dashboard Design

| Field | Value |
|---|---|
| Date | 2026-06-11 |
| Sprint | POC build · Dashboard |
| Change | Offboarder dashboard design — 4 states (not started, active queue, all answered, complete). Single-column layout. Stress-tested: dropped "Satisfied" metric (not in offboarder's control), dropped per-module sidebar (offboarder doesn't pick modules), simplified to inline progress bar. Fixed waiting state copy (no manager name). |
| UC Reference | CL-122 (dashboard interactions) · CL-123 (dashboard refinements) · CL-120 (Q&A model) |
| Why | The offboarder's mental model is a task queue with a deadline, not a command center. Design must be ruthlessly focused on "answer these questions before you leave." |
| Decided By | PO (Tram) + BA (Claude) — grill-me format |
| Category | UX Refinement |

---

## 4 States

### State 1: Not started (Prepare stage)
- **Deadline bar** (green >14d): "30 days until your last day · July 4, 2026"
- **Waiting card** (dashed border, centered): "Your session is being prepared. You'll be notified when your question queue is ready."
- No manager name shown — offboarder doesn't know who created the session.
- No action cards, no queue. Nothing to do.

### State 2: Active queue (Capture stage — main working state)
- **Deadline bar** (amber 7-14d / red <7d): "22 days until your last day · July 4, 2026"
- **Action summary** (3 cards — NOT 4): To answer: 5 | Answered: 9 | Files: 2
  - "Satisfied" DROPPED — offboarder can't control whether someone marks satisfied. That's the stakeholder's metric.
- **Inline progress bar**: compact one-liner "9 of 14 answered" with progress bar. NOT a sidebar.
- **Question queue** (single column — no module sidebar):
  - Unanswered first (5 items), then "Recently answered (2 of 9)"
  - Each item: question text + source icon (✨ AI / 👤 person name) + module badge
  - Click any Q → `/session/minh-le?tab=data` with Side Panel pre-opened to that Q, scrolled to Q&A section
  - After answering, Side Panel auto-advances to next unanswered Q
  - "Answer next question →" CTA at bottom
- **No per-module sidebar.** Dropped because:
  - Offboarder doesn't pick which module to work on — questions come in a flat queue
  - Module badge on each question already shows the area
  - Single-column layout is simpler and matches the task-queue mental model

### State 3: All answered (waiting for Deliver)
- **Deadline bar** (green): "18 days until your last day"
- **Action summary**: To answer: 0 | Answered: 14 | Files: 4
- **Caught-up card** (emerald): "You're all caught up. All 14 questions answered. Your knowledge will be reviewed and committed. If new questions come in, you'll be notified."
  - No manager name — offboarder doesn't need to know who reviews.

### State 4: Complete (KG committed)
- **Thank-you card** (emerald): "Your knowledge has been preserved. 14 answers and 4 files committed to the knowledge graph. Future team members can access this knowledge. Thank you, Minh Lê."
- No further action. Session is done.

---

## Interaction Patterns

| Element | Click behavior |
|---|---|
| Question in queue | → `/session/minh-le?tab=data` with Side Panel pre-opened to that Q's card, scrolled to Q&A section |
| "Answer next question" button | Same as above, first unanswered Q |
| Answered question (faded) | → `/session/minh-le?tab=data` Side Panel, read-only view of the answered Q&A |

After answering in Side Panel → auto-advance to next unanswered Q. Dashboard is entry point; Data tab Side Panel is working surface.

---

## Deadline Bar Color Logic

Pure calendar time, no workload factoring:
- **Green** (>14 days): comfortable, no urgency signal
- **Amber** (7–14 days): getting closer, mild urgency
- **Red** (<7 days): urgent, time running out

Workload urgency is communicated separately by the "To answer" card number and color.

---

## Stress-Test Decisions

**Dropped "Satisfied" metric.** The offboarder can't control whether stakeholders mark satisfied. Showing a number they can't influence creates anxiety, not actionability. "Satisfied" belongs on the Manager's dashboard (session health) and Stakeholder's dashboard (their own actions).

**Dropped per-module sidebar.** The offboarder doesn't pick which module to work on — questions come in a flat queue. Per-module breakdown implies choice that doesn't exist. Module badge on each question already provides area context.

**Simplified to single column.** The queue IS the whole dashboard. No two-column grid needed. Inline progress bar (one line) replaces the module sidebar.

**Removed manager name from waiting state.** Offboarder doesn't know who created the session. Generic copy: "Your session is being prepared."

---

*End of CL-124. Companion document for the main change log.*
