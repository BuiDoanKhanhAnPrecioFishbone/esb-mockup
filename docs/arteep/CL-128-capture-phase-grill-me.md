# CL-128 — Capture Phase Design (14 Decisions)

| Field | Value |
|---|---|
| Date | 2026-06-13 |
| Sprint | POC build · Session detail page |
| Change | Full Capture phase design for session detail page. 14 decisions covering offboarder answering UX, progress indicators, satisfaction flow, follow-ups, transition to Deliver, and logging. |
| UC Reference | CL-119 (RBAC) · CL-120 (Data tab) · CL-127 (Prepare phase) |
| Why | Capture is the core value-creation phase — offboarder answers, coworkers review, Manager monitors. Every interaction must be frictionless or knowledge gets lost. |
| Decided By | PO (Tram) + BA (Claude) — grill-me format |
| Category | Architectural Decision · UX Design |

---

## Decision Summary

### Q1: Offboarder Data tab layout during Capture
**Same accordion as Manager/Coworker.** Offboarder clicks a card → drawer opens with questions + answer textarea. They work card by card, choosing their own path. No flat queue — the module structure gives them context about priority.

### Q2: Navigation between questions
**Auto-advance within card, manual across cards.** When offboarder submits an answer, the drawer scrolls to the next unanswered question on the same card. When all questions on a card are answered, drawer shows "All answered ✓" and offboarder closes manually to pick the next card.

### Q3: Can't answer / skip mechanism
**No action needed.** Offboarder simply doesn't answer and moves to another card. Unanswered questions stay visible. Manager sees the count ("9 of 14 answered") and can follow up directly if something important stays unanswered.

### Q4: Manager Data tab during Capture
**Answers in drawer + progress indicators on accordion (both).** Manager opens a card's drawer to see submitted answers. Accordion rows show ✓/○/— status icons and module headers show "[2/4 answered]" progress counts.

### Q5: Coworker during Capture
**Sees answers + "Mark satisfied" / "Ask follow-up" in drawer.** When offboarder answers a coworker's question, the answer appears in the Side Panel with action buttons. Closes the loop in the same context where the question was asked.

### Q6: Overview tab during Capture
- **Manager:** Progress bar (9/14) + coworker satisfaction (7 satisfied · 2 waiting) + gaps status (4/6 addressed) + time context (started 3 days ago · 22 days left) + "Review in Data tab" + "Move to Deliver"
- **Offboarder:** Progress bar (9/14) + remaining count + "Open question queue →"
- **Coworker:** Your questions status (2 answered, 1 waiting) + mark satisfied prompt

### Q7: Answered question layout in Side Panel
Answer block with emerald left border + gray-50 bg. Shows: answer text, optional file attachment inline, attribution ("Minh Lê · 2 hours ago"). Action buttons below for non-offboarder roles.

### Q8: Who gets satisfaction actions
**All non-offboarder roles (Manager, HR, Coworker).** Manager/HR can mark satisfied or ask follow-up in case coworker forgets to check. For AI-generated questions (no coworker), Manager marks satisfied to signal answer quality.

### Q9: Follow-up mechanism
**New question tagged "Follow-up" with reference to original.** Inline text input expands below the answer. Submitted follow-up appears as a regular question on the same card. Flat data model, no threads, KG-friendly.

### Q10: Capture → Deliver transition
**Manual gate — Manager clicks "Move to Deliver."** Same pattern as Prepare→Capture. Manager reviews progress, decides when enough answers are collected. Can move even if not all questions answered.

### Q11: "Mark satisfied" behavior
**Visual badge swap.** "Mark satisfied" button replaced by "✓ Satisfied by [name]" emerald badge. No collapsing, no moving. The Q&A pair stays in place with the new visual state.

### Q12: "Move to Deliver" button location
**Overview tab, same position as "Start Capture."** Below the progress summary with context: "9 of 14 answered · 7 satisfied · 2 gaps remaining."

### Q13: Logs during Capture
New event types: offboarder answers, follow-ups asked, files attached to answers, questions marked satisfied, new questions added during Capture, phase transition to Deliver. All use existing filter chips and color-coded left borders.

### Q14: Answer editing
**No editing — immutable once submitted.** If clarification needed, Manager/Coworker uses "Ask follow-up" → new question. Creates clean audit trail in Logs.

---

## Accordion Progress Indicators (Capture)

### Module header
```
▼ Payment Service    12 cards    4 Qs    2 gaps    [2/4 answered]
```

### Card row status icons
- ✓ emerald = all questions on card answered
- ○ hollow = has unanswered questions
- — gray dash = no questions (context-only card)

---

## Answer Layout in Side Panel

```
Q: "How does the retry logic handle poison messages?"
   ✨ AI-generated

A: "After 5 retries with exponential backoff, the message
   routes to the DLQ. We monitor DLQ depth via Datadog..."
   📎 dlq-replay-runbook.pdf (12 KB)
   Minh Lê · 2 hours ago

   [Mark satisfied]  [Ask follow-up]     ← Manager + Coworker
```

After satisfaction:
```
   ✓ Satisfied by Coworker A · 1 hour ago
```

---

*End of CL-128. Companion document for the main change log.*
