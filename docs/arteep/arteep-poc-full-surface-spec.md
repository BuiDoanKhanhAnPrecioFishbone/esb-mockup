# ART-EEP POC — Full Surface Specification

> Comprehensive spec of all built surfaces: Dashboard, Create Session, Sessions Registry, and Session Detail (Prepare + Capture + Deliver + Complete). Covers all roles, all states, all interactions.
> 
> **Source decisions:** CL-121 through CL-129. **Repo:** `BuiDoanKhanhAnPrecioFishbone/esb-mockup`

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
10. [Demo Data Inventory](#10-demo-data-inventory)

---

## 1. Terminology

| Use | Don't use | Why |
|---|---|---|
| **Session** | Handover | Action-oriented |
| **Coworker** | Stakeholder | Immediately understood |
| **Knowledge area** | Module | User-facing label for AI-derived topic clusters |
| **Sensitive content** | PII | Non-technical language |

---

## 2. Roles & Permissions

| Role | Who | Can do | Cannot do |
|---|---|---|---|
| **Manager / HR** | Hà Vy | Create sessions, manage modules, add questions, upload files, mark satisfied, ask follow-ups, start Capture, move to Deliver, commit to KG | Answer questions |
| **Offboarder** | Minh Lê | Answer questions during Capture, attach files to answers | Act during Prepare, manage modules, mark satisfied, ask follow-ups |
| **Coworker** | Project peer | Ask questions, upload files in Side Panel, mark satisfied, ask follow-ups, browse accordion | Manage modules, answer questions, see Logs tab, start phase transitions |

---

## 3. Route Map

| Route | Component | Surface |
|---|---|---|
| `/` | `ha-vy-handover-dashboard.jsx` | Dashboard with 4 role tabs |
| `/session/new` | `create-session.jsx` | Create session (accordion departures) |
| `/sessions` | `all-sessions.jsx` | All sessions registry (Active/Completed/All) |
| `/session/[id]` | `session-command-view.jsx` + `session-deliver.jsx` | Session detail (5-step flow) |

---

## 4. Dashboard (`/`)

**File:** `ha-vy-handover-dashboard.jsx` (~38KB) · **Decisions:** CL-122–126

**Manager (Hà Vy) — 3 states:** Departures pending (yellow banner + "Start session" CTAs) → Active sessions (4 action cards + session cards sorted blocked-first + activity feed) → Session completed (emerald banner).

**Offboarder (Minh Lê) — 4 states:** Not started (deadline bar + empty state) → Active queue (3 action cards + progress bar + question list) → All answered (emerald 14/14) → Complete (emerald celebration).

**Coworker A — 2 states:** Active (3 action cards + per-session feed + "Mark satisfied" inline) → All satisfied (emerald success).

**Coworker B — 1 state:** Empty activity + warning prompt + "Ask your first question →".

---

## 5. Create Session (`/session/new`)

**Decisions:** CL-121. Accordion of HRIS departures. Each expands to show deadline, board picker (Trello boards with metadata), "Start session" CTA. Direct redirect to `/session/[id]`.

---

## 6. Sessions Registry (`/sessions`)

**Decisions:** CL-123. Active / Completed / All tabs. Completed sessions live here, not on dashboard.

---

## 7. Session Detail (`/session/[id]`)

**Files:** `session-command-view.jsx` (~40KB) + `session-deliver.jsx` (~10KB)
**Decisions:** CL-119, CL-120, CL-127, CL-128, CL-129

### 7.1 Hero Bar

Always visible. Avatar + name + phase badge + role + dept + days left + stage-scoped metrics. Phase badge: blue (Prepare), violet (Capture), emerald (Deliver/Complete).

### 7.2–7.4 Prepare Phase (Steps 1–2)

**Overview:** Manager sees spinner (Collecting) or 4 metrics + "Start Capture" (Ready). Offboarder/Coworker see waiting states.
**Data:** Full accordion (Board → Module → Card) + 480px Side Panel drawer. Module headers show gaps, Q count, Upload/Rename. Offboarder tab disabled.
**Logs:** Session created, crawl events, questions asked. Coworker tab hidden.

### 7.5–7.7 Capture Phase (Step 3)

**Overview:** Manager: progress + 3 metrics + "Move to Deliver". Offboarder: progress + "Open queue". Coworker: 3 metrics + review prompt.
**Data:** Same accordion + answer blocks (emerald left border) + satisfaction buttons + follow-up inputs + offboarder answer textarea. Answers immutable. "Mark satisfied" → badge swap.
**Logs:** All Prepare events + answer/satisfaction/file/follow-up events.

### 7.8–7.10 Shared Components

**Side Panel:** 480px drawer with Description → Checklist → Gaps (with "Related Q:" link) → Files → Questions → Ask input.
**Knowledge Gaps:** Signals, not questions. 6 total (3 card + 3 AI). Some auto-generate linked questions.
**File Uploads:** Module header (Manager, Prepare+Capture), Side Panel (Manager+Coworker, Prepare+Capture), Answer (Offboarder, Capture only).

### 7.11 Deliver Phase — Overview (Step 4, CL-129)

**Manager:** Readiness summary with progress bar + 4 metric cards (Answered/Satisfied/Gaps/Files) + per-module readiness table (name + answered/total + gaps + files + ✅ Ready or ⚠ X unanswered) + yellow callout for excluded questions + "Back to Capture" (secondary) + "Commit to Knowledge Graph" (primary).

**Offboarder:** "Thank you, Minh." + contribution stats (Answered 9, Files 1, Gaps addressed 4) + "What happens next" 2-step timeline (Hà Vy reviews → KG commit). No actions.

**Coworker:** "Session is being finalized" + clock icon. Read-only Data tab, no actions.

### 7.12 Deliver Phase — Data Tab (Step 4)

Read-only for all roles. Same accordion, no action buttons (no Ask, no Mark satisfied, no answer textarea, no Upload/Rename). Prior satisfaction status still visible. No "Committed" badges yet.

### 7.13 Deliver Phase — Commit Flow (CL-129)

**Commit modal:** What's committed (9 answers, 3 files, 4 gaps) + what's excluded (5 unanswered) + sanitization note + "permanent" warning + Cancel / Commit.

**Back to Capture modal:** "This will reopen for Minh Lê. He'll be notified." + Cancel / Reopen Capture.

**Edge cases:** Empty commit blocked (0 answers → button disabled). Back to Capture reverts Offboarder to Capture Overview.

### 7.14 Complete Phase — All Roles (Step 5)

**Manager:** Emerald success banner with timestamp + 4 metrics (Committed/Files/Gaps resolved/Excluded) + "View in Knowledge Graph" + "Back to dashboard".

**Offboarder:** Confetti + "Your knowledge has been committed" + contribution stats.

**Coworker:** "Session complete. The answers you reviewed are available to the team."

**Data tab:** Read-only + emerald "Committed" badges on answered questions. **Logs:** All prior events + commit event (emerald border).

---

## 8. Phase Transitions

| Transition | Who | Where | Type |
|---|---|---|---|
| Create → Prepare | Manager/HR | `/session/new` | Automatic |
| Prepare → Capture | Manager/HR | Overview "Start Capture" | Manual gate |
| Capture → Deliver | Manager/HR | Overview "Move to Deliver" | Manual gate |
| Deliver → Complete | Manager/HR | Commit modal "Commit" | Manual gate (permanent) |
| Deliver → Capture | Manager/HR | Overview "Back to Capture" | Manual gate (with confirmation) |

No auto-transitions. No separate QA gate. Single "Commit to KG" = Manager sign-off.

---

## 9. Design System Quick Reference

| Element | Rule |
|---|---|
| Palette | Violet (brand/AI), Yellow (gaps/warnings), Emerald (done/satisfied/committed), Rose (critical only), Blue (Prepare badge) |
| Mode | Light only. `bg-gray-50` canvas, `bg-white` surfaces |
| Borders | 1px `border-gray-200`. 2px semantic left accents |
| Buttons | 32px height. `focus:ring-2 focus:ring-violet-500/20` |
| Typography | Sans-serif body. Monospace for timestamps/counts. Sentence-case. |
| Icons | `lucide-react` only |
| Copy | Named humans. "Session" not "handover". "Coworker" not "Stakeholder". |
| Drawer | 480px `fixed top-0 right-0` + dark scrim |
| Answer block | `bg-gray-50` + `border-l-2 border-emerald-400` |
| Committed badge | Emerald — only on Complete phase |

---

## 10. Demo Data Inventory

| Data | Value |
|---|---|
| Offboarder | Minh Lê · Senior Backend Engineer · Engineering |
| Manager | Hà Vy · Manager · Engineering |
| Days left | 22 · Last day Jun 30, 2026 |
| Boards | 2 (Backend Services · Platform Infrastructure) |
| Knowledge areas | 5 (Payment Service · CI/CD Pipeline · Shared Libraries · Monitoring & Alerts · Infrastructure as Code) |
| Questions | 14 total (9 answered, 5 unanswered) |
| Gaps | 6 (3 card + 3 AI) · 4 addressed |
| Satisfied | 7 of 9 answered |
| Files on cards | 3 (kafka-config.yaml, api-key-rotation.md, oncall-schedule.pdf) |
| File on answer | 1 (dlq-replay-runbook.pdf) |

---

*Source: CL-121 through CL-129.*
