# Session Detail Page — Design Build Prompt

> Give this prompt to Claude (connected to `BuiDoanKhanhAnPrecioFishbone/esb-mockup`) to build or refine the session detail page.

---

## What to build

The **session detail page** at `/session/[id]` — the core workspace where a knowledge handover session lives. It shows the full lifecycle of a departing employee's knowledge capture: **Prepare → Capture → Deliver**.

The file is `components/mockups/session-command-view.jsx`. Read `CLAUDE.md` and `ARTEEP-context-snapshot.md` before touching anything. Design decisions are in `docs/arteep/CL-127-prepare-phase-design.md` and `docs/arteep/CL-128-capture-phase-grill-me.md`.

---

## Architecture

### 3 roles view the same page differently

| Role | Tab | Who |
|---|---|---|
| **Manager / HR** (Hà Vy) | All 3 tabs: Overview, Data, Logs | Owns the session. Reviews, manages modules, starts transitions. |
| **Offboarder** (Minh Lê) | Overview + Data (during Capture only) + Logs | Answers questions. Can't act during Prepare. |
| **Coworker** | Overview + Data (no Logs tab — hidden entirely) | Asks questions, reviews answers, marks satisfied. |

### 3 tabs

- **Overview** — Phase-specific summary + CTAs. Different content per role and phase.
- **Data** — Board → Module → Card accordion. Click a card → 480px right drawer (Side Panel) slides in with card detail.
- **Logs** — Chronological event log with filter chips (All · System · Questions · Files · Edits). Hidden from Coworker.

### Hero bar (top of page, all tabs)

Identity + phase badge + days left + deadline + stage-scoped metrics. No action buttons in the hero — CTAs live on Overview tab.

```
[ML avatar]  Minh Lê's session                    [PREPARE] or [CAPTURE] badge
             Senior Backend Engineer · Engineering
             22 days left · Deadline Jun 30, 2026
             Prepare: 3 coworkers · 14 questions · 6 gaps
             Capture: 9 of 14 answered · 7 satisfied · 2 gaps open
```

### Flow steps (demo navigation)

The mockup uses a step bar to let reviewers switch between states:
1. **Collecting data** — Prepare substage: crawl running
2. **Ready for review** — Prepare substage: crawl done, modules derived
3. **Capture (active)** — Offboarder answering questions

---

## Prepare Phase (CL-127)

### Overview tab by role

**Manager (Ready state):**
- "Data collection complete" heading
- 4 metric cards: Boards processed, Cards eligible, Knowledge areas, Questions generated
- Knowledge areas found — module name chips (Payment Service, CI/CD Pipeline, etc.)
- Coworker engagement: "2 of 3 coworkers have asked questions"
- Knowledge gaps: "6 gaps detected — 3 card-level · 3 AI-detected cross-card"
- Two CTAs: "Review in Data tab" (secondary, switches tab) + "Start Capture" (primary)

**Offboarder (all Prepare substages):**
- Dashed border empty state: "Your session is being prepared. You'll be notified when ready."
- Data tab disabled (grayed out, cursor-not-allowed)

**Coworker (Ready state):**
- "Minh Lê is leaving soon" + role + dept + last day
- Knowledge areas chips
- Your activity: "You've asked 0 questions"
- Other coworkers: "2 others are asking questions"
- CTA: "Browse Data tab" (switches tab)

### Data tab

**Structure:** General questions bucket (violet border, above accordion) → Board headers → Module sections → Card rows

**General questions bucket:**
- Input at top: "Ask a general question..."
- Below: "General questions" section with violet border showing questions not tied to any card
- During Capture: shows answers + answer textarea for offboarder

**Board → Module → Card accordion:**
- Board header: icon + name + card count
- Module header: expand/collapse + name + card count + Q count badge + gap count badge + Manager: Upload + Rename buttons
- Module-level AI gaps: yellow box with ✨ Sparkles icon below module header, above cards
- Card rows: FileText icon + name + 📎 (if files) + gap badge + Q count badge
- Module-level "+ Ask about this module" input (expandable, Manager + Coworker only)

**Side Panel (480px right drawer overlay):**
- Fixed position, full height, slides in from right with dark scrim backdrop
- Click scrim or X to close
- Sections: Description → Checklist → Knowledge gaps (with "Related Q:" link) → Attachments (+ Upload for Manager/Coworker) → Questions (+ answer textarea for Offboarder during Capture) → Ask a question (Manager/Coworker)

### File uploads

| Location | Who can upload |
|---|---|
| Module header "Upload" button | Manager only |
| Side Panel "Upload a file" | Manager + Coworker |
| Answer textarea "Attach file" | Offboarder (Capture only) |

### Knowledge gaps = signals, not questions

Gaps are detected during crawl (4 metadata types + 2 AI cross-card types). They show as yellow warnings. Some gaps auto-generate questions — the gap shows "Related Q: [question text]" in violet to make the connection explicit. The offboarder answers the *question*, not the gap. When the related question is answered, the gap is considered "addressed."

### Logs during Prepare

- Offboarder sees "No activity yet" (even after crawl completes — they're not notified until Capture)
- Manager sees: session created, crawl events, questions asked by coworkers/manager
- Question events have violet left-border accent. System events have gray.

### Transitions

- **Prepare → Capture:** Manager clicks "Start Capture" on Overview tab. Manual gate, no auto-transition.

---

## Capture Phase (CL-128)

### Overview tab by role

**Manager:**
- "Capture in progress" heading
- Progress bar: 9/14 (64%) with violet fill
- "5 questions remaining"
- 3 metric cards: Satisfied (7), Waiting review (2), Gaps addressed (4/6)
- Time context: "Started 3 days ago · 22 days left"
- Two CTAs: "Review in Data tab" + "Move to Deliver →"
- Summary line: "9/14 answered · 7 satisfied · 2 gaps left"

**Offboarder:**
- "Your question queue" with progress bar (9/14)
- "5 remaining"
- CTA: "Open question queue →"

**Coworker:**
- "Your questions" heading
- 3 metric cards: Answered (2), Waiting (1), Satisfied (1)
- "⚠ 1 answer waiting for your review"
- CTA: "Review in Data tab →"

### Data tab during Capture

**Progress indicators on accordion:**
- Module header: adds `[3/4]` answered count badge (emerald when complete, gray when in progress)
- Card rows: adds status icon before card name:
  - ✓ emerald CheckCircle = all questions answered
  - ○ gray hollow = has unanswered questions
  - — gray dash = no questions (context-only card)

**Answered questions in Side Panel:**
```
Q: "How does the retry logic handle poison messages?"
   ✨ AI-generated

[emerald left border block]
   Minh Lê · 2h ago
   "After 5 retries with exponential backoff, messages route
   to the DLQ. Monitor DLQ depth via Datadog alert #4421..."
   📎 dlq-replay-runbook.pdf (12 KB)

   [✓ Mark satisfied]  [Ask follow-up]     ← Manager + Coworker
   -- or --
   ✓ Satisfied by Coworker A · 30m ago      ← after clicking
```

**Key rules:**
- Answer block: `bg-gray-50` with `border-l-2 border-emerald-400`
- Attribution: answeredBy + answeredAt
- File attachment shown inline if present
- "Mark satisfied" + "Ask follow-up" for ALL non-offboarder roles (Manager can satisfy in case coworker forgets)
- "Mark satisfied" → visual swap to "✓ Satisfied by [name] · [time]" emerald badge. Button disappears.
- "Ask follow-up" → inline text input expands. Submitted as new question tagged "Follow-up"
- Answers are immutable — no edit button. Follow-ups handle clarification.

**Unanswered questions (Offboarder view):**
- Answer textarea with "Attach file" + "Submit" buttons
- Same for general questions in the General bucket

### Logs during Capture

New event types with color-coded left borders:
- violet: "Minh Lê answered about..." / "Coworker A marked satisfied: ..." / "Hà Vy asked follow-up..."
- yellow: "Minh Lê attached dlq-replay-runbook.pdf"
- gray: "Capture started — Minh Lê notified"

### Transitions

- **Capture → Deliver:** Manager clicks "Move to Deliver" on Overview tab. Manual gate. Can move even if not all questions answered.

---

## Mock Data Requirements

### Session
- Minh Lê, Senior Backend Engineer, Engineering
- 22 days left, deadline Jun 30, 2026
- 3 boards, 64 cards, 5 modules, 14 questions, 6 gaps, 3 coworkers
- During Capture: 9 answered, 7 satisfied, 4 gaps addressed

### 2 boards, 5 modules, 16 cards

**Backend Services (34 cards):**
- Payment Service (12 cards, 4 Qs, 1 card gap, 1 module gap) — 5 cards with data
- CI/CD Pipeline (8 cards, 3 Qs, 1 card gap, 1 module gap) — 3 cards with data
- Shared Libraries (6 cards, 2 Qs, 0 gaps) — 3 cards with data

**Platform Infrastructure (18 cards):**
- Monitoring & Alerts (10 cards, 3 Qs, 1 card gap, 1 module gap) — 3 cards with data
- Infrastructure as Code (8 cards, 2 Qs, 0 gaps) — 3 cards with data

### Card data variety
Mix of: cards with Q + answer + satisfaction, cards with Q but no answer yet, cards with gaps + related Q, cards with files, cards with checklists (complete and partial), cards with no Q/gaps/files (context only)

### 2 general questions
- 1 answered + satisfied
- 1 unanswered (offboarder needs to answer during Capture)

### 3 module-level AI gaps
- "No disaster recovery or failover procedures documented" (Payment Service)
- "Deployment process described differently across modules" (CI/CD Pipeline)
- "SLA commitments for alert thresholds undocumented" (Monitoring & Alerts)

---

## Design System Rules

- **Palette:** violet (brand/AI/CTAs), yellow (warnings/gaps), emerald (verified/satisfied), rose (critical only)
- **Light mode only.** `bg-gray-50` canvas, `bg-white` surfaces
- **1px `border-gray-200`** hairlines, except 2px semantic left-edge accents (emerald for answers, violet for selected cards, yellow for file events)
- **480px right drawer** with `fixed top-0 right-0 h-full` + dark scrim overlay
- **32px button heights**, `focus:ring-2 focus:ring-violet-500/20`
- **Sentence-case English.** Named humans not roles ("Hà Vy" not "your manager")
- **"Session" not "handover"**, **"Coworker" not "Stakeholder"**
- **Icons:** `lucide-react` only. Sparkles for AI, User for human, AlertTriangle for gaps, CheckCircle2 for done/satisfied, Paperclip for files, Upload for upload actions
- **Monospace** for timestamps, counts, progress numbers

---

## What NOT to build (deferred)

- **Deliver phase** — not designed yet
- **Voice interview (UC-HO-02)** — Phase 2
- **Crawl failure states** — Phase 2
- **Auto-advance within card** — behavior described in CL-128 Q2, but static mockup can't demo it
- **Notification system** — described in CL-127 Gap 4, but no UI for it yet
- **Module merge/delete/create** — buttons not in mockup (only Upload + Rename shown)

---

*End of prompt. Read CL-127 and CL-128 companion docs for the full decision rationale.*
