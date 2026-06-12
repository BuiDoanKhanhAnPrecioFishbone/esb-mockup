# CL-125 — Stakeholder Dashboard Design

| Field | Value |
|---|---|
| Date | 2026-06-11 |
| Sprint | POC build · Dashboard |
| Change | Stakeholder dashboard design — 3 states (no questions, active, all satisfied). Feed shows only actionable items (answers to review + waiting for answer). Satisfied items not shown — history in session detail. Answers inline with max 4-line height + "See more" expand. Attachments shown as compact indicators. Feed grouped by session, not flat chronological. |
| UC Reference | CL-122 (dashboard interactions) · CL-123 (dashboard refinements) · CL-124 (offboarder dashboard) |
| Why | The stakeholder's mental model is a notification feed: "did my questions get answered?" Design must surface actionable items and hide completed history. |
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
- **Feed grouped by session** (only actionable items):

**Minh Lê's session · Capture · 22 days left**
- ✅ Answer ready: "Who should I contact about the SLA penalty terms?"
  - Answer text inline (max 4 lines, "See more" to expand)
  - If attachment: compact indicator (📎 filename · size) + "View in session →"
  - [Mark satisfied] [Ask follow-up]
- ⏳ Waiting: "What are the undocumented rate limits on the payment API?" · 3 days
- [Ask a question]

**Thanh Tùng's session · Prepare · 28 days left**
- ⏳ Waiting: "Which E2E tests are flaky and need ownership transfer?" · 1 day
- [Ask a question]

### State 3: All satisfied
- **Action summary**: Answers to review: 0 | Waiting: 0 | Sessions: 2
- **Caught-up card** (emerald): "You're all caught up. All your questions have been answered and reviewed."

---

## Key Decisions

### Feed shows only actionable items
- **Answers to review** — offboarder answered, stakeholder hasn't marked satisfied
- **Waiting for answer** — stakeholder asked, offboarder hasn't answered
- **Already satisfied items are NOT shown.** They're done. History lives in session detail page. Consistent with Manager dashboard pattern (completed sessions → /sessions, not on dashboard).

### Answer text: full text with max height
- Show full answer text but cap at ~4 lines (~80px max-height)
- "See more" expands inline (not navigate away)
- Stakeholder can mark satisfied after reading the expanded answer without navigating

### Attachments: compact indicator
- Below answer text: 📎 filename · size (per file)
- "View in session →" link to open full Side Panel with download
- Dashboard preview = "there's an attachment." Actual file interaction in session detail.

### Grouping: by session
- Questions grouped under session headers, not flat chronological
- Each session group: session name + phase badge + days left
- "Ask a question" CTA at the bottom of each group → `/session/[id]?tab=data`

---

## Interaction Patterns

| Element | Click behavior |
|---|---|
| "Mark satisfied" | Inline — button becomes ✓ Satisfied badge. Item removed from feed (it's no longer actionable). No navigation. |
| "Ask follow-up" | Inline — text input expands below the answer. Submit without navigating. New question appears in "Waiting" state. |
| "See more" on answer | Inline expand — reveals full answer text. No navigation. |
| "View in session →" on attachment | → `/session/[id]?tab=data` with Side Panel open to that Q's card |
| "Ask a question" on session group | → `/session/[id]?tab=data` (needs module context) |
| "Open session" | → `/session/[id]` |

---

*End of CL-125. Companion document for the main change log.*
