# Design brief — Handover dashboard · Manager / Active sessions

> **What this is:** the manager's home dashboard (Hà Vy, Manager / HR) in its **"Active sessions"**
> state — two handover sessions in flight, one waiting on the manager, with KPI stat cards and a
> recent-activity rail. **Reproduce, don't reinvent.** Re-create this exact screen — same regions,
> same order, same relative positions and proportions as the attached screenshot. Do not invent,
> drop, reorder, or move pieces. Re-render the visuals on the design system tokens in §3. The
> screenshot is the layout contract, §2 is the content contract, §3 is the style contract.

- **Source of truth:** `components/mockups/ha-vy-handover-dashboard.jsx` — the `ManagerActive()` branch (reached when `role === "manager"` and `stepId === "active"`). Chrome from `components/app/AppShell.tsx`.
- **Live state captured:** route `/?role=manager&state=active` · role **Manager** (Hà Vy) · state **Active sessions** · viewport **1440×900, light mode**.
- **Scope note:** describe **only** the manager / active-sessions state. The departures, completed, offboarder, and coworker branches are out of scope.

---

## 1. Layout contract

Full app chrome wraps the page: a fixed left **sidebar** (`w-56` = 224px), a top **topbar**
(`h-12` = 48px), and a scrolling **main** content column. Content is centered in a `max-w-4xl`
(896px) container with `p-6` (24px) padding.

```
┌────────────┬──────────────────────────────────────────────────────────────┐
│ SIDEBAR    │ TOPBAR  h-12 (48px)                                            │
│ w-56       │ [search box ........]   (spacer)   🔔  [State: Active …]  HV ▾ │
│ (224px)    ├──────────────────────────────────────────────────────────────┤
│            │  MAIN  (bg-gray-50)                                            │
│ • ART-EEP  │  ┌──────────────── max-w-4xl (896px), p-6 ─────────────────┐   │
│            │  │ Dashboard                          [ + Create session ] │   │
│ WORKSPACE  │  │                                                         │   │
│ ▣ Dashboard│  │ ┌──────┬──────┬──────┬──────┐  grid-cols-4, gap-3       │   │
│ ▤ Sessions │  │ │NEEDS │DEADL.│ACTIVE│ OPEN │  4 stat cards            │   │
│ ⊹ Knowledge│  │ │ACTION│≤7 d  │SESS. │ GAPS │                          │   │
│   graph    │  │ │  1   │  0   │  2   │  2   │                          │   │
│ ⚙ Settings │  │ └──────┴──────┴──────┴──────┘                          │   │
│            │  │                                                         │   │
│ MORE       │  │ grid-cols-3, gap-5 ────────────┐  ┌──────────────────┐ │   │
│ ▦ Design   │  │ │ col-span-2 (2/3)            │  │ 1/3 column        │ │   │
│   states   │  │ │ ACTIVE SESSIONS · 2         │  │ RECENT ACTIVITY   │ │   │
│            │  │ │ ┌────────────────────────┐  │  │ ┌──────────────┐  │ │   │
│            │  │ │ │ TT Thanh Tùng's session│  │  │ │ 1 hour ago   │  │ │   │
│            │  │ │ │   PREPARE · WAITING…   │  │  │ │ System  …    │  │ │   │
│            │  │ │ │   3-seg phase bar      │  │  │ └──────────────┘  │ │   │
│ ┌────────┐ │  │ │ └────────────────────────┘  │  │ ┌──────────────┐  │ │   │
│ │Mockup  │ │  │ │ ┌────────────────────────┐  │  │ │ 2 hours ago  │  │ │   │
│ │playgrnd│ │  │ │ │ ML Minh Lê's session   │  │  │ └──────────────┘  │ │   │
│ └────────┘ │  │ │ │   CAPTURE              │  │  │ ┌──────────────┐  │ │   │
│            │  │ │ │   3-seg phase bar      │  │  │ │ 3 hours ago  │  │ │   │
│            │  │ │ └────────────────────────┘  │  │ └──────────────┘  │ │   │
│            │  │ │ [ + Create session ] dashed │  │ ┌──────────────┐  │ │   │
│            │  │ └─────────────────────────────┘  │ │ 5 hours ago  │  │ │   │
│            │  │                                   │ └──────────────┘  │ │   │
│            │  └───────────────────────────────────┴──────────────────┘ │   │
└────────────┴──────────────────────────────────────────────────────────────┘
```

**Key measurements (from Tailwind classes):**
- **Sidebar** `w-56` (224px), `border-r border-gray-200`, white. Logo row `h-12` matches topbar height. Nav items `h-8` (32px), `gap-0.5`. Footer block pinned at bottom with `border-t`.
- **Topbar** `h-12` (48px), white, `border-b`, `px-4`, `flex items-center gap-4`. Search box `h-8`, `max-w-md`, `flex-1`; then a `flex-1` spacer pushes the right cluster (bell, State switcher, user pill) to the right edge.
- **Content container** `max-w-4xl` (896px), `mx-auto`, `p-6` (24px).
- **Header row** `flex justify-between mb-6` (24px) — title left, Create button right.
- **Stat-card grid** `grid-cols-4 gap-3 mb-6` (12px gaps, 24px below). Each card `rounded-lg border p-3`.
- **Two-column body** `grid-cols-3 gap-5` (20px). Left = `col-span-2` (sessions, ~2/3 width); right = 1 column (activity, ~1/3 width). Both use `space-y-3` (12px) vertical rhythm.
- **Session card** `rounded-lg border p-4`, avatar `w-10 h-10`, blocked card carries a 2px left accent. Create-session row below is `w-full h-10` dashed button.
- **Activity item** `rounded-md border px-3 py-2` with a 2px colored left border.

---

## 2. Content contract

Top-to-bottom, exact copy/counts/icons. Render **only** the manager / active state.

### Sidebar (chrome)
- **Logo:** violet 1.5×1.5 dot + `ART-EEP` in mono, letter-spaced, uppercase feel.
- **Section label** `WORKSPACE`, then nav links (icon + label): **Dashboard** (active — violet-50 bg, violet-700 text, LayoutDashboard icon), **Sessions** (Briefcase), **Knowledge graph** (Network), **Settings** (gear).
- **Section label** `MORE`, then **Design states** (LayoutGrid icon).
- **Footer block:** bold `Mockup playground`, then muted "Live preview of ART-EEP surfaces. Changes ship via Claude → main → Vercel."

### Topbar (chrome)
- **Search input** (Search icon): placeholder `Search sessions, people, or knowledge`, with a `⌘K`-style keycap badge `{K` on the right (mono).
- **Notifications bell** with a rose unread dot (top-right of the icon).
- **State switcher** (Layers icon): label `State` + bold current value `Active sessions` + chevron.
- **User pill:** violet avatar circle `HV`, then two stacked lines — `Hà Vy` (bold) / `Manager / HR` (muted) — + chevron.

### Header
- **H1:** `Dashboard` (xl, semibold).
- **Primary button (right):** `+ Create session` — violet-600 fill, white text, `h-8` (Plus icon).

### Stat cards (4, left→right) — `grid-cols-4`
Each card: tiny uppercase label (mono-ish) over a large semibold mono number. Number colors per state:
1. `NEEDS YOUR ACTION` — **1** — rose-600 (urgent).
2. `DEADLINE ≤ 7 DAYS` — **0** — gray-900 (normal; would turn rose if > 0).
3. `ACTIVE SESSIONS` — **2** — gray-900 (normal).
4. `OPEN GAPS` — **2** — yellow-700 (warn).

> Cards are clickable filter toggles (hover border-gray-300; active = violet-400 border + violet ring). In the captured state none is active. Reproduce the resting look.

### Left column — Active sessions (`col-span-2`)
- **Section label:** `ACTIVE SESSIONS · 2` (10px uppercase, wide tracking `0.2em`, gray-500; the `· 2` count in mono gray-400).
- Two session cards, sorted **blocked-first** (the "Waiting on you" card is on top):

  **Card 1 — Thanh Tùng (blocked / waiting on manager):**
  - Avatar `TT` in a **yellow** circle (yellow-50 bg, yellow-700 text, yellow-200 border). Card has a 2px **yellow** left accent and yellow-200 border.
  - Title `Thanh Tùng's session` + phase badge `PREPARE` (blue-50/blue-200/blue-700, uppercase) + status badge `⏱ WAITING ON YOU` (yellow, Clock icon).
  - Meta line: `QA Lead · Engineering · 28 days left`.
  - **Phase progress:** top row `Phase 1 of 3 · Prepare` (left) and sub-stage `Knowledge map ready` (right, mono). Three equal segments labeled `PREPARE` · `CAPTURE` · `DELIVER`. Segment 1 is partially filled **violet** (current phase, ~mid), segments 2–3 empty gray. `PREPARE` label violet-700, the other two gray-400.
  - Footer metrics (split by a hairline): left `3 boards · 127 cards · 4 modules` (gray-700); right `0 questions added` (yellow-700, warn).
  - Right edge: outlined `Open →` button (gray border, `h-8`).

  **Card 2 — Minh Lê (in Capture):**
  - Avatar `ML` in a neutral gray circle. Neutral gray-200 border, no accent.
  - Title `Minh Lê's session` + phase badge `CAPTURE` (violet-50/violet-200/violet-700, uppercase). No "waiting" badge.
  - Meta line: `Senior Backend Engineer · Engineering · 22 days left`.
  - **Phase progress:** top row `Phase 2 of 3 · Capture` (left), sub-stage `Answering queue` (right, mono). Segment 1 (`PREPARE`) fully **emerald** (done); segment 2 (`CAPTURE`) partially **violet**; segment 3 (`DELIVER`) empty. `PREPARE` label emerald-700, `CAPTURE` violet-700, `DELIVER` gray-400.
  - Footer metrics: left `9 of 14 answered · 7 satisfied` (gray-700); right `2 gaps open` (yellow-700, warn).
  - Right edge: outlined `Open →` button.

- **Create-session row:** full-width `h-10` dashed-border button, muted text, `+ Create session` (Plus icon).

### Right column — Recent activity (1/3)
- **Section label:** `RECENT ACTIVITY` (no count).
- Four activity items, newest first. Each: top row `timestamp` (mono, gray-500, left) + `actor` (bold, gray-700, right); below, the message (gray-900). Left border color encodes severity (gray = low, yellow = medium).
  1. `1 hour ago` · **System** — "Thanh Tùng's crawl complete — 3 boards, 127 cards, 4 modules derived" — **medium** (yellow left border).
  2. `2 hours ago` · **System** — "Coworker joined Minh Lê's session · asked 2 questions" — low (gray border).
  3. `3 hours ago` · **Minh Lê** — "Answered 3 questions in Payment Service module" — low.
  4. `5 hours ago` · **Hà Vy** — "Added 3 priority prompts to Minh Lê's session" — low.

---

## 3. Style contract

Light mode only. `bg-gray-50` canvas, `bg-white` surfaces, 1px `border-gray-200` hairlines except 2px semantic left accents.

| Token | Where it's used on this screen |
|---|---|
| **violet** (50/100/600/700) | Brand dot + active "Dashboard" nav (violet-50 bg / violet-700 text); `Create session` CTA fill (violet-600, hover violet-700); user avatar (violet-100/700); `CAPTURE` phase badge + in-progress phase-bar segment; focus rings `ring-violet-500/20`. |
| **pastel yellow** (50/100/200/700) | Knowledge gaps & "needs action" warnings — `OPEN GAPS` value (yellow-700), `2 gaps open` / `0 questions added` metric, `WAITING ON YOU` badge + blocked-card left accent + yellow avatar, medium-severity activity left border. |
| **rose** (500/600) | Critical/urgent only — `NEEDS YOUR ACTION` value (rose-600), notification unread dot (rose-500). |
| **emerald** (500/700) | Verified / completed phase — the done (`PREPARE`) segment of Minh Lê's phase bar (emerald-500 fill, emerald-700 label). |
| **blue** (50/200/700) | `PREPARE` phase badge only (muted blue chip). |
| **neutrals** (gray-50/100/200/400/500/700/900) | Canvas, surfaces, hairlines, body text, muted meta, dashed buttons, neutral avatar. |

- **Mono** (`ui-monospace, Menlo`): `ART-EEP` logo, the `{K` keycap, all stat-card **numbers**, phase sub-stage labels (`Knowledge map ready`, `Answering queue`), activity **timestamps**, the `· 2` section count, and the sidebar nav section labels.
- **Section label spec:** 10px, uppercase, `tracking-[0.2em]`, gray-500, medium weight; optional trailing `· N` count in gray-400 mono.
- **Badges:** `text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold border`, tinted by phase (blue/violet/emerald) or status (yellow).
- **Buttons:** 32px height (`h-8`); primary = violet-600 fill + white text; secondary = gray-300 border on white; "create" rows = dashed gray border, muted text. All carry explicit `focus:ring-2 focus:ring-violet-500/20`.
- **Writing rules:** sentence-case English; named humans, not roles ("Hà Vy will review", not "your manager"). The topbar reads a neutral `ART-EEP` / route hint — it does **not** announce the user's role (CL-115; the `Manager / HR` text lives only in the user pill). Post-commit content is "Knowledge Graph entries"; pre-commit is a "bundle" — no "playbook" wording anywhere. Use "Knowledge map ready" (not "playbook ready") for the Prepare sub-stage.

---

## 4. Notes for the redesign pass

**Fixed — do not change:**
- All four regions and their order: **header → 4 stat cards → (left) Active sessions + (right) Recent activity**. Left column is wider (`col-span-2`), activity is the narrow right rail.
- The **two** session cards, blocked-first ordering (Thanh Tùng above Minh Lê), and every string/number: the `28 days left` / `22 days left`, `3 boards · 127 cards · 4 modules`, `9 of 14 answered · 7 satisfied`, `0 questions added`, `2 gaps open`.
- Stat-card values **1 / 0 / 2 / 2** and their color coding (rose / neutral / neutral / yellow).
- The four activity items, their order, timestamps, actors, and severity coloring.
- Three-segment phase bar semantics: emerald = done, violet = current (partial fill), gray = not started; `PREPARE · CAPTURE · DELIVER` labels.
- Phase badges by stage (PREPARE=blue, CAPTURE=violet) and the yellow `WAITING ON YOU` treatment for the blocked card.
- All copy stays sentence-case; the user role is shown only in the pill, never narrated by the chrome.

**Free — visual treatment latitude:**
- Exact shadow depth, corner-radius rhythm, icon stroke weight, and hover micro-states.
- Precise internal padding/spacing rhythm (keep proportions, not pixels).
- How the stat-card "active/selected" state looks (only the resting state is captured).
- Avatar styling (initials chip) so long as blocked = yellow vs neutral = gray distinction survives.

**Cross-checks:**
- `ACTIVE SESSIONS` stat (**2**) must equal the session-card count and the `· 2` in the section label.
- `NEEDS YOUR ACTION` (**1**) must equal the number of cards carrying the `WAITING ON YOU` badge (just Thanh Tùng).
- `DEADLINE ≤ 7 DAYS` is **0** because both sessions are 22 / 28 days out — keep that card neutral, not rose.

---

> **Screenshot:** open the deployed app, go to `/?role=manager&state=active`, and attach a full-page
> 1440×900 screenshot. That image is the positional ground-truth this layout contract describes.
