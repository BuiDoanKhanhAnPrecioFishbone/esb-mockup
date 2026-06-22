# Design brief — Session command view · Manager · Capture · Overview tab

> **What this is:** the session detail page for Minh Lê's handover, viewed by the manager (Hà Vy) while the session is in the **Capture** step, on the **Overview** tab. It shows live progress on the question-answering work plus two CTAs to advance the session.
>
> **Reproduce, don't reinvent.** Rebuild this exact screen — same regions, same order, same relative positions and proportions as the screenshot. Do not invent, drop, reorder, or move pieces. Re-render the visuals on the design system tokens below. The screenshot is the layout contract, this outline is the content contract, the token table is the style contract.

- **Source of truth:** `components/mockups/session-command-view.jsx` (chrome from `components/app/AppShell.tsx`), route `/session/minh-le`
- **Live state captured:** `/session/minh-le?role=manager&step=capture&tab=overview` — role = manager (Hà Vy), step = `capture`, tab = `overview` · viewport 1440×900, light mode
- **Render path:** `SessionCommandView` → `SessionPage` → `HeroBar(phase="capture")` + tab bar + `OverviewContent` → `ManagerOverview(stepId="capture")` → "Capture in progress" card + CTA row

---

## 1. Layout contract

```
┌──────────┬────────────────────────────────────────────────────────────────────┐
│ SIDEBAR  │ TOPBAR  h-12 (48px)                                                  │
│ w-56     │ [🔍 search ……………… {K]   (spacer)   🔔  [≣ State: Capture (active) ▾] │
│ (224px)  │                                          [HV  Hà Vy / Manager / HR ▾]│
│ bg-white ├────────────────────────────────────────────────────────────────────┤
│          │  MAIN  bg-gray-50 canvas                                             │
│ • ART-EEP│  ┌──────────────────────────────────────────────────────────────┐  │
│ (h-12    │  │ content column: max-w-5xl (1024px), mx-auto, p-6              │  │
│  header) │  │                                                              │  │
│ WORKSPACE│  │  ┌────────────────── HERO BAR ──────────────────┐  (mb-5)    │  │
│ ▣ Dash   │  │  │ (ML) │ Minh Lê's session  [CAPTURE badge]    │            │  │
│ ▣ Sessio*│  │  │      │ Senior Backend Engineer · Engineering │            │  │
│ ⨁ Know.  │  │  │      │ 22d left · 9/14 answered · 7 satisfied│            │  │
│ ⚙ Setting│  │  └───────────────────────────────────────────────┘           │  │
│          │  │  ┌── TAB BAR (border-b) ──────────────────────────┐ (mb-5)   │  │
│ MORE     │  │  │  Overview*   Data    Logs                      │          │  │
│ ▣ Design │  │  └────────────────────────────────────────────────┘          │  │
│   states │  │                                                              │  │
│          │  │  ┌──────────── "Capture in progress" CARD ─────────┐         │  │
│ (footer  │  │  │ Capture in progress                             │         │  │
│  block)  │  │  │ [████████████░░░░░░]  9/14                       │         │  │
│ Mockup   │  │  │ 5 questions remaining                            │         │  │
│ playgr…  │  │  │ ┌ SATISFIED ┐ ┌ WAITING REVIEW ┐ ┌ GAPS ADDR.┐ │ (3-col) │  │
│          │  │  │ │    7      │ │      2         │ │   4/6    │  │         │  │
│          │  │  │ └───────────┘ └────────────────┘ └──────────┘  │         │  │
│          │  │  │ Started 3d ago · 22d left                       │         │  │
│          │  │  └─────────────────────────────────────────────────┘         │  │
│          │  │  [ Review in Data tab ]  [ Move to Deliver → ]    (gap-3)     │  │
│          │  └──────────────────────────────────────────────────────────────┘  │
└──────────┴────────────────────────────────────────────────────────────────────┘
```

**Measurements (from Tailwind classes):**
- **Sidebar** `w-56` = **224px**, `border-r border-gray-200`, `bg-white`, full height. Logo row `h-12` (48px) with `border-b`.
- **Topbar** `h-12` = **48px**, `bg-white`, `border-b border-gray-200`, `px-4`, flex row, `gap-4`. Search box `h-8` (32px) `max-w-md flex-1` left; flex spacer; then notifications, State switcher, View-as pill (each `h-8`).
- **Main canvas** `bg-gray-50`, fills remaining width.
- **Content column** `max-w-5xl` (**1024px**) `mx-auto`, `p-6` (24px padding). Everything below sits inside this column (note: the column is centered, so on a 1440px viewport there is generous left/right gutter — see screenshot, content starts well right of the sidebar).
- **Hero bar** `rounded-lg border border-gray-200 bg-white p-4 mb-5`, flex row, `gap-4`. Avatar circle `w-12 h-12` (48px) `rounded-full bg-violet-100`.
- **Tab bar** `flex border-b border-gray-200 mb-5`. Each tab `px-4 py-2.5 text-sm font-medium border-b-2`.
- **Capture card** `rounded-lg border border-gray-200 bg-white p-5`.
- **Progress bar** track `h-[6px] rounded-full bg-gray-200`, fill `bg-violet-500` at `round(9/14*100)` = **64%** width, with `9/14` label mono to its right.
- **Metric cards** `grid grid-cols-3 gap-3`; each card `rounded-md bg-gray-50 border border-gray-200 px-3 py-2`.
- **CTA row** `flex items-center gap-3`; buttons `h-9` (36px) `px-4 rounded-lg`.
- Vertical rhythm between hero / tabs / card / CTAs is `mb-5` (20px) and `space-y-4` (16px).

---

## 2. Content contract

Walk top-to-bottom. All copy below is **exact** for this state.

### Sidebar (`AppShell` · `Sidebar`)
- Logo row: violet dot + **`ART-EEP`** (mono, letter-spaced `0.18em`).
- Section label **`WORKSPACE`** (mono, uppercase, gray-400), then nav links:
  - `Dashboard`, **`Sessions`** (active — violet pill `bg-violet-50 text-violet-700`, icon violet), `Knowledge graph`, `Settings`.
  - "Sessions" is active because pathname starts with `/session`.
- Section label **`MORE`**, then `Design states`.
- Footer block: **`Mockup playground`** / "Live preview of ART-EEP surfaces. Changes ship via Claude → main → Vercel."

### Topbar (`AppShell` · `TopBar`)
- Search input, placeholder **"Search sessions, people, or knowledge"**, trailing **`{K`** key hint chip (mono).
- Bell button with a small **rose-500 dot** (unread indicator) top-right.
- **State switcher** pill: `≣` Layers icon + label **"State"** + value **"Capture (active)"** + chevron. (This is the FLOW entry `capture` → `label: "Capture (active)"`.)
- **View-as** pill (left border divider): avatar **`HV`** in violet circle + two lines **"Hà Vy"** / **"Manager / HR"** + chevron.

### Hero bar (`HeroBar`, phase = capture)
- Avatar circle **`ML`** (violet-100 bg, violet-700 text, semibold).
- Title row: **"Minh Lê's session"** (`text-lg font-semibold`) + badge **`CAPTURE`** — uppercase, `text-[9px]`, tracking-wider, `bg-violet-50 border-violet-200 text-violet-700`.
- Subtitle: **"Senior Backend Engineer · Engineering"** (`text-[12px] text-gray-500`).
- Meta line (mono, `text-[11px] text-gray-500`): **"22d left · 9/14 answered · 7 satisfied"**.
  - Built from `SESSION.daysLeft=22`, and capture metrics `answered=9 / questions=14`, `satisfied=7`.

### Tab bar
- Three tabs: **`Overview`** (active — `border-violet-600 text-gray-900`), **`Data`**, **`Logs`**.
- For manager role none are disabled/hidden. Inactive tabs `text-gray-500`.

### Capture-in-progress card (`ManagerOverview`, stepId = capture)
- Heading: **"Capture in progress"** (`text-sm font-semibold text-gray-900`, `mb-3`).
- **Progress bar**: violet fill at **64%** (9 of 14); right-aligned mono label **`9/14`**.
- Below bar: **"5 questions remaining"** (`text-[11px] text-gray-500`). Value = `questions(14) − answered(9) = 5`.
- **Three metric cards** (`grid-cols-3`), each with a mono uppercase label + large mono value:
  | Label (`text-[9px]` mono uppercase) | Value (`text-lg` mono semibold) | Source |
  |---|---|---|
  | **SATISFIED** | **7** | `SESSION.satisfied` |
  | **WAITING REVIEW** | **2** | `answered(9) − satisfied(7)` |
  | **GAPS ADDRESSED** | **4/6** | `gapsAddressed(4) / gaps(6)` |
- Footer line under the cards (mono, `text-[11px] text-gray-500`, `mt-3`): **"Started 3d ago · 22d left"**.

### CTA row (below the card, `flex gap-3`)
- **Secondary button** — **"Review in Data tab"** — `h-9 px-4 rounded-lg border border-gray-300 text-gray-700`, hover `bg-gray-50`. (Switches active tab to Data.)
- **Primary button** — **"Move to Deliver"** + right arrow `→` — `h-9 px-4 rounded-lg bg-violet-600 text-white`, hover `bg-violet-700`, `ArrowRight w-3.5`.

**Nothing else renders in this state.** No side panel, no Data/Logs content, no answer blocks — those belong to the Data tab.

---

## 3. Style contract

| Token | Where it's used in this state |
|---|---|
| **violet-50 / 100 / 200** | hero avatar bg (violet-100), `CAPTURE` badge (`bg-violet-50 border-violet-200 text-violet-700`), active sidebar item + active tab accent, State/View-as pill avatar |
| **violet-500** | progress-bar fill |
| **violet-600 / 700** | primary CTA "Move to Deliver" (600 base, 700 hover), active tab underline `border-violet-600` |
| **rose-500** | the single unread dot on the notifications bell only — no other rose on this screen |
| **emerald** | not present in this state (capture overview has no committed/verified content) |
| **yellow** | not present in this state (gaps shown only as the "4/6" count, no yellow chip on Overview) |
| **gray-50** | app canvas, metric-card backgrounds, secondary-button hover, search-box bg |
| **gray-200** | all 1px hairline borders (hero, card, tabs underline track, metric cards, sidebar/topbar dividers) |
| **gray-300** | secondary-button border |
| **gray-500 / 900** | secondary text (gray-500) vs headings & active labels (gray-900) |

**Type rules**
- Body / labels: sans-serif (`ui-sans-serif, system-ui, "Segoe UI"`).
- **Monospace** (`ui-monospace, Menlo, monospace`) for: `ART-EEP` wordmark, section labels, the hero meta line (`22d left · 9/14 answered · 7 satisfied`), progress label `9/14`, metric-card values (`7`, `2`, `4/6`), the "Started 3d ago · 22d left" line, the `{K` key chip, the State-switcher value text per its mono treatments.
- Section/metric labels: `text-[9px]`–`text-[10px]`, **uppercase**, `tracking-wider`, `font-medium/semibold`, gray-400/500.
- Buttons: **36px** tall (`h-9`) on the CTA row; topbar controls **32px** (`h-8`). Explicit focus rings `focus:ring-2 focus:ring-violet-500/20`.

**Writing rules (locked)**
- Sentence-case UX writing; named humans not roles ("Hà Vy", "Minh Lê").
- Chrome does not narrate RBAC — topbar shows `ART-EEP` / route, the only role surfacing is the View-as preview pill (a mockup affordance, "Manager / HR").
- No "playbook" wording anywhere. Post-commit content would read "Knowledge Graph entries" — but this Capture state shows none.

---

## 4. Notes for the redesign pass

**Fixed (do not change):**
- Region order: sidebar → topbar → hero bar → tab bar → capture card → CTA row.
- Tab set and order: Overview · Data · Logs, Overview active.
- Every string and number above is load-bearing and must read exactly: `Minh Lê's session`, `CAPTURE`, `Senior Backend Engineer · Engineering`, `22d left · 9/14 answered · 7 satisfied`, `Capture in progress`, `9/14`, `5 questions remaining`, `SATISFIED 7`, `WAITING REVIEW 2`, `GAPS ADDRESSED 4/6`, `Started 3d ago · 22d left`, `Review in Data tab`, `Move to Deliver`.
- Two CTAs only, secondary then primary, primary carries the right arrow.

**Free (visual treatment latitude):**
- Exact spacing rhythm, shadow depth, icon weight, corner-radius scale — re-render on the design system rather than pixel-matching.
- Progress-bar styling (height, cap shape) as long as fill ≈ 64% and the `9/14` mono label sits at the right.

**Cross-checks (must hold):**
- `answered(9) − satisfied(7) = 2` → WAITING REVIEW.
- `questions(14) − answered(9) = 5` → "5 questions remaining".
- Progress fill = `9/14` ≈ 64%.
- GAPS ADDRESSED numerator ≤ denominator: `4/6`.

---

> **Screenshot:** the positional ground-truth for this brief is `design-briefs/packs/2026-06-22/screens/session-manager-capture-overview.png` (deployed app at `/session/minh-le?role=manager&step=capture&tab=overview`, 1440×900, light mode).
