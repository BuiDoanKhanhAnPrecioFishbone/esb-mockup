# CL-125 — Stakeholder Dashboard Design

| Field | Value |
|---|---|
| Date | 2026-06-11 |
| Sprint | POC build · Dashboard |
| Change | Stakeholder dashboard design — 3 states (no questions, active, all satisfied). Two demo personas: Stakeholder A (active, 2 sessions) and Stakeholder B (no questions). Activity feed grouped by session, only actionable items shown. Inline answers with max-height + expand. Compact attachment indicators. |
| UC Reference | CL-122 (dashboard interactions) · CL-123 (dashboard refinements) · CL-124 (offboarder dashboard) · CL-120 (file uploads on answers) |
| Why | Stakeholder's mental model is a notification feed: "did my questions get answered?" Design must surface answers inline so they can review and mark satisfied without navigating. |
| Decided By | PO (Tram) + BA (Claude) — grill-me format |
| Category | UX Refinement |

---

## 3 States

### State 1: No questions yet (Stakeholder B)
- **Action summary** (3 cards): Answers to review: 0 | Waiting: 0 | Sessions: 1
- **Empty activity**: "No activity yet — you haven't asked any questions"
- **Session card**: "Minh Lê's session · Capture · You're a stakeholder · 0 questions"
- **Nudge**: "Minh Lê is leaving soon. Ask about knowledge you'll need after they're gone."
- **CTA**: "Ask your first question" → `/session/minh-le?tab=data`

### State 2: Active (Stakeholder A — 2 sessions)
- **Action summary** (3 cards): Answers to review: 2 | Waiting: 2 | Sessions: 2
- **Activity feed grouped by session** (only actionable items — no satisfied/completed items):

**Minh Lê's session · Capture · 22 days left**
- ✅ Answer ready: "Who should I contact about the SLA penalty terms?"
  - Inline answer text (max 4 lines, "See more" expands inline)
  - If attachment: compact indicator (📎 filename · size) + "View in session →"
  - [Mark satisfied] [Ask follow-up]
- ⏳ Waiting for Minh Lê · 3 days: "What are the undocumented rate limits on the payment API?"
- [Ask a question]

**Thanh Tùng's session · Prepare · 28 days left**
- ⏳ Waiting for Thanh Tùng · 1 day: "Which E2E tests are flaky and need ownership transfer?"
- [Ask a question]

### State 3: All satisfied
- **Action summary**: Answers to review: 0 | Waiting: 0 | Sessions: 2
- **Caught-up card** (emerald): "You're all caught up. All your questions have been answered and reviewed."
- Activity feed shows no items (all satisfied = all removed from actionable feed)
- Session cards still visible for context + "Ask a question" CTA

---

## Key Design Decisions

### Feed shows only actionable items
- **Shown**: answers waiting for review + questions waiting for answer
- **Not shown**: already-satisfied items. They're done. History lives in session detail page.
- Consistent with Manager dashboard pattern (active sessions on dashboard, completed at /sessions)

### Grouped by session (not flat chronological)
- Each session is a group header with session name + phase badge + days left
- Questions nested below each session
- "Ask a question" CTA at bottom of each group → `/session/[id]?tab=data`

### Inline answer text with max height
- Show full answer text, capped at ~4 lines (~80px max-height)
- "See more" expands inline (stakeholder can mark satisfied after reading expanded text)
- No navigation required for text-only answers

### Attachment handling
- Compact indicator below answer text: 📎 filename · size (per file)
- "View in session →" link for full download/preview
- Dashboard shows the indicator; actual file interaction happens in session detail

### Action summary cards
- 3 cards: Answers to review | Waiting for answer | Sessions
- Sparse numbers are OK — stakeholders typically have 1–5 questions. The cards still communicate "what needs me" at a glance.

---

## Interaction Patterns

| Element | Click behavior |
|---|---|
| "Mark satisfied" | Inline — button becomes ✓ badge, item fades and removes from feed |
| "Ask follow-up" | Inline — text input expands below the answer. Submit without navigating. |
| "See more" on truncated answer | Expands inline to show full text |
| "View in session →" on attachment | → `/session/[id]?tab=data` with Side Panel open to that Q |
| "Ask a question" on session group | → `/session/[id]?tab=data` (browse modules to ask) |
| "Open session" | → `/session/[id]` (Overview tab) |

---

*End of CL-125. Companion document for the main change log.*
