# ART-EEP POC — Full Surface Specification

> Comprehensive spec of all built surfaces: Dashboard, Create Session, Sessions Registry, and Session Detail (Prepare + Capture). Covers all roles, all states, all interactions.
> 
> **Source decisions:** CL-121 through CL-128. **Repo:** `BuiDoanKhanhAnPrecioFishbone/esb-mockup`

---

## Table of Contents

1. [Terminology](#1-terminology)
2. [Roles & Permissions](#2-roles--permissions)
3. [Route Map](#3-route-map)
4. [Dashboard (`/`)](#4-dashboard)
5. [Create Session (`/session/new`)](#5-create-session)
6. [Sessions Registry (`/sessions`)](#6-sessions-registry)
7. [Session Detail (`/session/[id]`)](#7-session-detail)
8. [Phase Transitions](#8-phase-transitions)
9. [Design System Quick Reference](#9-design-system-quick-reference)

---

## 1. Terminology

| Use | Don't use | Why |
|---|---|---|
| **Session** | Handover | "Session" is action-oriented, "handover" is abstract |
| **Coworker** | Stakeholder | Immediately understood — someone who works with the offboarder |
| **Knowledge area** | Module | User-facing label for AI-derived topic clusters |
| **Sensitive content** | PII | Non-technical language |
| **Question queue** | Task list | Describes what the offboarder sees during Capture |

---

## 2. Roles & Permissions

### 2.1 Three roles on the session detail page

| Role | Who | Can do | Cannot do |
|---|---|---|---|
| **Manager / HR** | Hà Vy | Create sessions, manage modules (rename/merge/delete/create during Prepare; rename only during Capture), add questions at all 3 levels (card/module/general), upload files on module headers + Side Panel, mark answers satisfied, ask follow-ups, start Capture, move to Deliver | Answer questions |
| **Offboarder** | Minh Lê | Answer questions during Capture, attach files to answers | Act during Prepare, manage modules, mark satisfied, ask follow-ups |
| **Coworker** | Project peer | Ask questions at card/module/general level, upload files in Side Panel, mark answers satisfied, ask follow-ups, browse accordion | Manage modules, answer questions, see Logs tab, start phase transitions |

### 2.2 Four demo personas on the dashboard

| Tab | Role | States shown |
|---|---|---|
| **Hà Vy** (Manager / HR) | Manager | 3 states: Departures pending → Active sessions → Session completed |
| **Minh Lê** (Offboarder) | Offboarder | 4 states: Not started → Active queue → All answered → Complete |
| **Coworker A** (Active) | Coworker | 2 states: Active (answers to review) → All satisfied |
| **Coworker B** (No questions) | Coworker | 1 state: No questions asked yet |

---

## 3. Route Map

| Route | Component | Surface |
|---|---|---|
| `/` | `ha-vy-handover-dashboard.jsx` | Dashboard with 4 role tabs |
| `/session/new` | `create-session.jsx` | Create session (accordion departures) |
| `/sessions` | `all-sessions.jsx` | All sessions registry (Active/Completed/All) |
| `/session/[id]` | `session-command-view.jsx` | Session detail (Prepare + Capture) |

---

## 4. Dashboard (`/`)

**File:** `components/mockups/ha-vy-handover-dashboard.jsx` (~38KB)
**Decisions:** CL-122, CL-123, CL-124, CL-125, CL-126

### 4.1 Layout

One route `/` with role-based content. 4 toggleable demo tabs at top. Adaptive layout — action-first, sessions-second.

### 4.2 Manager View (Hà Vy) — 3 states

**State 1: Departures pending**
- Yellow banner: "2 upcoming departures from HRIS"
- Each departure: avatar + name + role + dept + last day + days left + "Start session →" CTA
- Below: empty state "No active sessions" + "Create session manually" link
- Header: "Dashboard" + "Create session" primary button

**State 2: Active sessions (default)**
- 4 action cards (clickable, filterable): Needs your action (urgent count), Deadline ≤ 7 days, Active sessions, Open gaps
- Clicking an action card highlights/dims matching session cards
- Session cards sorted: blocked-on-Manager first (yellow left border + "Waiting on you" badge)
- Each session card: avatar + name + phase badge (Prepare/Capture/Deliver) + role + dept + days left + 3-phase progress bar + stage-scoped metrics + "Open →" button
- Right column: Recent activity feed (4 entries with colored left borders — gray/yellow/rose by severity)
- Bottom: "+ Create session" dashed button + "View all sessions →" link

**State 3: Session completed**
- Dismissible emerald banner: "Minh Lê's session is complete" + "View in sessions →" link + X close button
- Active sessions list (minus completed one)
- Updated action card counts
- Activity feed shows completion events

### 4.3 Offboarder View (Minh Lê) — 4 states (CL-124)

Single-column layout, no module sidebar. 3 action cards (no "Satisfied" — offboarder can't control it).

**State 1: Not started**
- Deadline bar: green/amber/red based on days left (>14 green, 7-14 amber, <7 red)
- Dashed empty state: "Your session is being prepared. You'll be notified when ready."

**State 2: Active queue**
- Deadline bar (22 days)
- 3 action cards: To answer (5), Answered (9), Files uploaded (2)
- Progress bar: 9/14 with percentage
- Question list: each question shows text + source (AI-generated with ✨ or human with 👤) + module badge
- Questions sorted: Coworker questions first → AI-generated second. Within each: oldest first.
- CTA: "Open question queue →" (links to `/session/minh-le?tab=data`)
- Recently answered section: strikethrough question text + ✓ Answered + Satisfied/waiting badge + truncated answer preview + "See full answer →"

**State 3: All answered**
- Progress bar: 14/14 ✓ (emerald, 100%)
- Emerald success state: "You're all caught up — all 14 questions answered"

**State 4: Complete**
- Emerald celebration: "Your knowledge has been preserved — 14 answers and 4 files committed"

### 4.4 Coworker A View (Active) — 2 states (CL-125)

**State 1: Active**
- 3 action cards: Answers to review (2), Waiting for answer (2), Sessions (2)
- Feed grouped by session (Minh Lê's session [Capture], Thanh Tùng's session [Prepare])
- Answered items: emerald left border, answer preview (max 4 lines + "See more"), file attachment indicator, "Mark satisfied" + "Ask follow-up" inline buttons
- Waiting items: yellow left border, "Waiting for [name] · [time]"
- "+ Ask a question" link per session group

**State 2: All satisfied**
- All zeros in action cards
- Emerald success: "You're all caught up"

### 4.5 Coworker B View — 1 state (CL-125)

- Empty activity: "No activity yet — you haven't asked any questions"
- Session card: "Minh Lê's session [Capture] · Coworker · 0 questions · 22 days left"
- Warning prompt: "⚠ Minh Lê is leaving soon. Ask about knowledge you'll need."
- CTA: "Ask your first question →"

---

## 5. Create Session (`/session/new`)

**File:** `components/mockups/create-session.jsx`
**Decisions:** CL-121

### 5.1 Layout

Accordion of departures from HRIS. Each departure is a collapsible card.

### 5.2 Departure Card (collapsed)

Avatar + name + role + dept + last day + days left

### 5.3 Departure Card (expanded)

Expands to show configuration:
- **Deadline** field (auto-calculated: last day minus 4 business days)
- **Board picker**: list of Trello boards with metadata (card count, last activity). All boards equally selectable — no limit, no disabling. "Suggested" badge as hint only.
- **"Start session" CTA** — inside the expanded card. Disabled if 0 boards selected.
- Direct redirect to `/session/[id]` after creation.

### 5.4 Who can create

Either Manager or HR. Offboarder populated from HRIS sync.

---

## 6. Sessions Registry (`/sessions`)

**File:** `components/mockups/all-sessions.jsx`
**Decisions:** CL-123

Filter tabs: Active / Completed / All. Search bar. Completed sessions are NOT on the dashboard — they live here for reference.

---

## 7. Session Detail (`/session/[id]`)

**File:** `components/mockups/session-command-view.jsx` (~42KB)
**Decisions:** CL-119, CL-120, CL-127, CL-128

### 7.1 Hero Bar

Always visible. Avatar + name + phase badge + role + dept + days left + deadline + stage-scoped metrics. No action buttons.

- Prepare metrics: `3 coworkers · 14 questions · 6 gaps`
- Capture metrics: `9 of 14 answered · 7 satisfied · 2 gaps open`

### 7.2 Prepare Phase — Overview Tab

**Manager (Collecting):** Spinner + "Collecting data from 3 boards..."

**Manager (Ready):** 4 metric cards + knowledge area chips + coworker engagement + gap breakdown + "Review in Data tab" + "Start Capture →"

**Offboarder (all Prepare):** "Your session is being prepared. You'll be notified when ready."

**Coworker (Collecting):** "Session is being set up. You'll be notified when ready."

**Coworker (Ready):** "Minh Lê is leaving soon" + knowledge areas + your activity + others count + "Browse Data tab →"

### 7.3 Prepare Phase — Data Tab

- **Manager/Coworker:** Full accordion (General Q bucket → Board → Module → Card) + 480px right drawer Side Panel on card click
- **Offboarder:** Disabled tab. "Questions are being collected."
- Module headers: name + card count + Q badge + gap badge + Manager: Upload/Rename
- Module-level AI gaps: yellow box with ✨ below module header
- Card rows: icon + name + 📎 + gap badge + Q badge
- "+ Ask about this module" expandable input (Manager + Coworker)

### 7.4 Prepare Phase — Logs Tab

- **Manager:** Session created, crawl events, questions asked
- **Offboarder:** "No activity yet"
- **Coworker:** Tab hidden entirely
- Filter chips: All · System · Questions · Files · Edits
- Color-coded left borders: gray (system), violet (questions), yellow (files)

### 7.5 Capture Phase — Overview Tab

**Manager:** Progress bar (9/14) + 3 metric cards (Satisfied/Waiting/Gaps) + time context + "Review in Data tab" + "Move to Deliver →"

**Offboarder:** Progress bar (9/14) + "5 remaining" + "Open question queue →"

**Coworker:** 3 metric cards (Answered/Waiting/Satisfied) + "⚠ 1 answer waiting" + "Review in Data tab →"

### 7.6 Capture Phase — Data Tab

Same accordion + these additions:
- Module headers: `[X/Y]` answered badge
- Card rows: ✓/○/— status icons
- Answered Qs in drawer: emerald-bordered answer block + attribution + file + "Mark satisfied" / "Ask follow-up" (Manager + Coworker)
- Unanswered Qs (Offboarder): answer textarea + "Attach file" + "Submit"
- General Qs: same answer/textarea pattern
- Answers immutable — no editing. Follow-ups = new question.
- "Mark satisfied" → "✓ Satisfied by [name]" badge swap

### 7.7 Capture Phase — Logs Tab

All Prepare events + answer events, satisfaction marks, file attachments, follow-ups, "Capture started"

Offboarder sees logs only during Capture.

### 7.8 Side Panel (Right Drawer)

480px fixed overlay, full height, dark scrim. Sections: Description → Checklist → Gaps (with "Related Q:" link) → Attachments (+ Upload for Manager/Coworker) → Questions (+ answer UI) → Ask a question (Manager/Coworker)

### 7.9 Knowledge Gaps

Gaps are **signals**, not questions. Some auto-generate questions — gap shows "Related Q: [text]" in violet. Offboarder answers the question, not the gap. 6 total: 3 card-level (metadata) + 3 module-level (AI cross-card).

### 7.10 File Uploads

| Location | Who | When |
|---|---|---|
| Module header "Upload" | Manager | Prepare + Capture |
| Side Panel "Upload file" | Manager + Coworker | Prepare + Capture |
| Answer "Attach file" | Offboarder | Capture only |

---

## 8. Phase Transitions

| Transition | Who | Where | Type |
|---|---|---|---|
| Create → Prepare | Manager/HR | `/session/new` | Automatic (on create) |
| Prepare → Capture | Manager/HR | Overview tab "Start Capture" | Manual gate |
| Capture → Deliver | Manager/HR | Overview tab "Move to Deliver" | Manual gate |

All manual. No auto-transitions. Manager can move to Deliver even with unanswered questions.

---

## 9. Design System Quick Reference

| Element | Rule |
|---|---|
| Palette | Violet (brand/AI), Yellow (gaps/warnings), Emerald (done/satisfied), Rose (critical only), Blue (Prepare badge) |
| Mode | Light only. `bg-gray-50` canvas, `bg-white` surfaces |
| Borders | 1px `border-gray-200`. 2px semantic left accents |
| Buttons | 32px height. `focus:ring-2 focus:ring-violet-500/20` |
| Typography | Sans-serif body. Monospace for timestamps/counts. Sentence-case. |
| Icons | `lucide-react` only |
| Copy | Named humans. "Session" not "handover". "Coworker" not "Stakeholder". |
| Drawer | 480px `fixed top-0 right-0` + dark scrim |
| Progress bar | 6px rounded, gray-200 track, violet-500 fill |
| Answer block | `bg-gray-50` + `border-l-2 border-emerald-400` |

---

*Source: CL-121 through CL-128. Not built yet: Deliver phase, voice interview, crawl failures, notifications UI, module merge/delete/create buttons.*
