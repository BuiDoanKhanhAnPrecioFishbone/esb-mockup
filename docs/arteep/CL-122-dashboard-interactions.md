# CL-122 — Dashboard Interaction Patterns & Gap Fixes

| Field | Value |
|---|---|
| Date | 2026-06-11 |
| Sprint | POC build · Dashboard |
| Change | Dashboard layout decisions (adaptive per role, action-first), interaction flow for every clickable element across all 3 roles, and 5 gap fixes. Builds on CL-120 (Data tab architecture) and CL-121 (create session flow). |
| UC Reference | UC-HO-01 · UC-HO-08 · CL-120 (Data tab + Side Panel) · CL-121 (create session) |
| Why | The dashboard is the entry point for all users. Every click must lead somewhere defined — no dead ends. |
| Decided By | PO (Tram) + BA (Claude) — grill-me format |
| Category | UX Refinement · Interaction Design |

---

## Layout Decisions

**1. One route (`/`) with role-based content.** System detects user from Entra ID. POC shows 4 toggleable demo states (Manager, Offboarder, Stakeholder A active, Stakeholder B passive).

**2. Adaptive layout (B) with section stacking for multi-role.** Different structures per role matching their mental model. If a user has multiple roles (e.g. Manager + Stakeholder), sections stack. Shared design tokens across all views.

**3. Action-first, sessions-second (flipped layers).** Layer 1 = action summary (urgent counts, deadline warnings). Layer 2 = session cards with progress and drill-down. The action summary answers "what needs attention NOW" in 2 seconds.

**4. Three role mental models:**
- Manager = command center (sessions × progress × blocked items)
- Offboarder = task queue (questions to answer, deadline countdown)
- Stakeholder = notification feed (answers to review, inline actions)

---

## Interaction Patterns — Manager (Hà Vy)

| Element | Click behavior |
|---|---|
| Action card ("Need your review: 2") | Scrolls to and highlights the matching session cards on the same page. Not a navigation — just a scroll + highlight. |
| Session card (e.g. "Minh Lê's handover") | Navigates to `/session/minh-le` (session detail page, Overview tab) |
| Task line "5 questions unanswered" | Navigates to `/session/minh-le?tab=data` with a filter pre-applied showing only unanswered questions |
| Task line "Crawl complete — needs your review" | Navigates to `/session/thanh-tung?tab=data` (Prepare stage crawl results) |
| **"+ Create session" button (top-right)** | Navigates to `/session/new` (create session flow per CL-121) |

**Gap fix #1:** Action cards are tappable — scroll + highlight matching sessions.
**Gap fix #2:** "+ Create session" CTA added to dashboard top-right.

---

## Interaction Patterns — Offboarder (Minh Lê)

| Element | Click behavior |
|---|---|
| "Answer next question" button | Navigates to `/session/minh-le?tab=data` with Side Panel pre-opened to the first unanswered question |
| A specific question in the queue | Navigates to `/session/minh-le?tab=data` with Side Panel pre-opened to THAT question's card, scrolled to the Q&A section |
| A recently answered question | Same route, Side Panel showing the answered Q&A (read-only) |

**Gap fix #3:** After answering a question in the Side Panel, the system auto-advances to the next unanswered question. No dashboard round-trips. The dashboard is the entry point; the Data tab Side Panel is the working surface.

**Flow:** Dashboard → click question → Data tab + Side Panel → answer → auto-advance to next → answer → ... → all done → back to dashboard.

---

## Interaction Patterns — Stakeholder A (active, 2 sessions)

| Element | Click behavior |
|---|---|
| "Mark satisfied" button | **Inline action.** Button changes to a "Satisfied" badge. No navigation. The answer card stays visible. |
| "Ask follow-up" button | **Inline action.** A text input expands below the answer card. Stakeholder types the follow-up question and submits. No navigation — they have full context (the answer is right above). |
| Answer text block | Already visible inline — no click needed. |
| "Ask a question" on a session card | Navigates to `/session/[id]?tab=data` — stakeholder needs module/card context to know WHAT to ask. |
| "Open session" on a session card | Navigates to `/session/[id]` (Overview tab) |

**Gap fix #4:** "Ask follow-up" is inline with text input expansion, not navigation.
**Gap fix #5:** "Ask a question" (new, not follow-up) navigates to session Data tab for module context.

---

## Interaction Patterns — Stakeholder B (no questions)

| Element | Click behavior |
|---|---|
| "Ask your first question" button | Navigates to `/session/minh-le?tab=data` — browse modules/cards and ask |
| "Open session" | Navigates to `/session/minh-le` (Overview tab) |

Clean. Empty state has a nudge message + clear CTA.

---

## Mock Data Consistency Rules

All dashboard views must reflect the same underlying data:
- Manager's "5 unanswered" = Offboarder's "5 to answer" = sum of Stakeholder A's pending + AI-generated + Manager's own questions
- Offboarder's "9 answered" includes the specific questions shown as answered in Stakeholder A's view
- Stakeholder A's "3 questions asked" should be traceable in Offboarder's queue

---

*End of CL-122. Companion document for the main change log.*
