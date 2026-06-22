# Design brief — Offboarder Dashboard (= their session command view) · "Active queue" state

> **What this is.** The **offboarder's Dashboard** at `/` for Minh Lê. Under the new
> structure the offboarder's Dashboard is **not** a standalone dashboard — it **renders their
> session command view**: a session **hero bar**, an **Overview / Data / Logs** tab row, and the
> Overview tab body, which is the old question-queue dashboard UI (deadline bar, 3 stat tiles,
> progress, "Questions waiting for you", "Open question queue" CTA, "Recently answered"). The
> Overview tab is selected. The sidebar is **minimal** for the offboarder — only **Dashboard**
> (under Workspace) and **Design states** (under More); Sessions / Knowledge graph / Settings are
> hidden.
>
> **Reproduce this exact screen — do not reinvent.** Match the same regions, order, relative
> positions, proportions, and copy as the screenshot. Re-render only the *visuals* on the
> design-system tokens below. Do not invent, drop, reorder, or move any piece.

- **Source of truth:**
  - `components/mockups/ha-vy-handover-dashboard.jsx` → `OffboarderStep({ id: "active-queue" })` → renders `<SessionCommandView role="offboarder" step="capture" chrome={false} />` (`OB_STATE_TO_STEP["active-queue"] = "capture"`).
  - `components/mockups/session-command-view.jsx` → `SessionPage` (hero + tab row) → `OverviewContent` → **`OffboarderOverview({ stepId: "capture" })`** (line 140) supplies the Overview body. Question/answer data is `OB_QUEUE` (line 38); session facts are `SESSION` (line 25).
  - Chrome from `components/app/AppShell.tsx` (role-filtered `Sidebar`, `TopBar`, `UserPill`).
- **Capture URL / state:** `/?role=offboarder&state=active-queue` — role = offboarder (Minh Lê), state = `active-queue` → step `capture`. Active tab = **Overview**.
- **Viewport:** 1440 × 900, light mode only.

---

## 1. Layout contract

App frame = fixed left **sidebar (224px)** + a right column with a fixed **topbar (48px)** over a scrolling **main** canvas (`bg-gray-50`, surfaces `bg-white`). The command-view content is a centered column, **max-width 1024px** (`max-w-5xl`), `mx-auto`, padding 24px (`p-6`). The hero bar and tab row span that full 1024px width; the Overview **body** below the tabs is constrained narrower to **max-width 672px** (`OffboarderOverview` returns `<div className="max-w-2xl">`), so the deadline bar / tiles / question list sit left-aligned and do **not** stretch as wide as the hero.

```
┌────────────┬──────────────────────────────────────────────────────────────┐
│ SIDEBAR    │ TOPBAR  h-12 (48px) · bg-white · border-b · px-4               │
│ w-56       │ ┌────────────────────┐  🔔 [▦ State·Active queue ▾] [ML Minh Lê ▾]│
│ (224px)    │ │ 🔍 Search… …  {K     │  (search max-w-md, then flex spacer) │
│ MINIMAL    │ └──────────────────────┘                                       │
│ bg-white   ├──────────────────────────────────────────────────────────────┤
│ border-r   │  MAIN · bg-gray-50 · scrolls                                   │
│            │   ┌──────── centered column · max-w-5xl (1024px) · p-6 ──────┐ │
│ ● ART-EEP  │   │ HERO BAR (full width) · bg-white border rounded-lg p-4   │ │
│  (h-12 hd) │   │  (ML) Minh Lê's session  [CAPTURE]                       │ │
│            │   │       Senior Backend Engineer · Engineering              │ │
│ WORKSPACE  │   │       22d left · 9/14 answered · 7 satisfied  (mono)     │ │
│ ▦ Dashboard│   ├──────────────────────────────────────────────────────────┤ │
│   (active) │   │ TAB ROW (full width, border-b)                          │ │
│            │   │  [ Overview ]  Data   Logs    ← Overview active (violet) │ │
│ MORE       │   ├──────────────────────────────────────────────────────────┤ │
│ ▦ Design   │   │ ░ OVERVIEW BODY · max-w-2xl (672px), left-aligned ░     │ │
│   states   │   │ ⏱ DEADLINE BAR (emerald) — mb-4                          │ │
│            │   │ STAT TILES grid-cols-3 gap-3 mb-4                        │ │
│            │   │  [ TO ANSWER 5 ][ ANSWERED 9 ][ FILES UPLOADED 2 ]      │ │
│            │   │ PROGRESS ───────────●            9 / 14  (mono)          │ │
│ ┌────────┐ │   │ QUESTIONS WAITING FOR YOU · 5                            │ │
│ │Mockup  │ │   │  ┌ question card ×5 (space-y-2) ─────────────────────┐  │ │
│ │playgrnd│ │   │  └───────────────────────────────────────────────────┘  │ │
│ └────────┘ │   │ [ Open question queue → ]  (violet btn)                  │ │
│            │   │   Opens in Data tab                                      │ │
│            │   │ RECENTLY ANSWERED · 9                                    │ │
│            │   │  ┌ answered card ×2 (opacity-50, strikethrough) ─────┐  │ │
│            │   │  └───────────────────────────────────────────────────┘  │ │
│            │   └──────────────────────────────────────────────────────────┘ │
└────────────┴──────────────────────────────────────────────────────────────┘
```

Key measurements (from Tailwind classes):
- Sidebar `w-56` = **224px**, `border-r border-gray-200`, `bg-white`. Logo header `h-12` matches topbar height. Offboarder sidebar is **minimal** (one Workspace item + one More item; no Sessions/Knowledge graph/Settings).
- Topbar `h-12` = **48px**, `bg-white border-b border-gray-200 px-4`, items `gap-4`. Search box `h-8` (32px), `max-w-md` (448px), `flex-1`, then a `flex-1` spacer pushes the right cluster to the edge.
- Content column `max-w-5xl` = **1024px**, `mx-auto`, `p-6` (24px).
- **Hero bar:** `rounded-lg border border-gray-200 bg-white p-4 mb-5`, flex row, `gap-4`; 48px avatar circle (`w-12 h-12`) + text block.
- **Tab row:** `flex border-b border-gray-200 mb-5`; each tab `px-4 py-2.5 text-sm font-medium border-b-2`; active = `border-violet-600 text-gray-900`, inactive = `border-transparent text-gray-500`.
- **Overview body:** `max-w-2xl` (672px), left-aligned (not centered within the wider column).
- Deadline bar: `rounded-lg border px-4 py-2.5 mb-4`, flex row, clock icon + text `text-[12px]`.
- Stat tiles: `grid-cols-3 gap-3 mb-4`; each tile `rounded-lg border border-gray-200 bg-white p-3`.
- Progress row: `flex items-center gap-3 mb-4`; track `flex-1 h-[5px] rounded-full bg-gray-200`, fill `bg-violet-500` at **width 64%** (`round(9/14*100)`); mono count to the right.
- Question cards: `space-y-2 mt-2`, each a `<button>` (full-width, left-aligned) `rounded-lg border border-gray-200 bg-white px-4 py-3`, hover `border-violet-300 hover:shadow-sm`.
- CTA: `h-8 px-4 rounded-md bg-violet-600`, mt-3; helper text `mt-1.5`.
- Recently-answered block: `mt-6`; cards `rounded-lg border bg-white px-4 py-3 opacity-50`, `space-y-2 mt-2`.

---

## 2. Content contract

Walk top to bottom. All copy is exact; render **only the offboarder / capture / Overview branch**.

### A. Sidebar (from AppShell — minimal offboarder variant)
- Logo header: small violet dot (`bg-violet-500`, 6px) + **ART-EEP** wordmark (mono, uppercase, letter-spaced).
- Section label **WORKSPACE** (mono, uppercase, gray-400). One nav item only:
  - **Dashboard** — active (violet pill: `bg-violet-50 text-violet-700`, violet icon). [LayoutDashboard icon]
  - **(hidden for offboarder: Sessions, Knowledge graph, Settings — do not render them.)**
- Section label **MORE**:
  - **Design states** — inactive gray. [LayoutGrid icon]
- Footer block (border-top, `text-[11px]`): bold **Mockup playground**, then "Live preview of ART-EEP surfaces. Changes ship via Claude → main → Vercel."

### B. Topbar (from AppShell)
- Search input (left): placeholder **"Search sessions, people, or knowledge"**, leading search icon, trailing key hint **{K** in a bordered chip (`{K` glyph).
- Right cluster (after a flex spacer): **bell** icon button with a rose unread dot (top-right); **State** switcher button [Layers icon] reading **"State"** + bold value **"Active queue"** + chevron; then a left-bordered **user pill** — violet avatar circle "ML", name **Minh Lê**, sub **Offboarder**, chevron. (Clicking the pill opens a menu with **Log out**.)
  - Note: the pill and State switcher reflect the offboarder (Minh Lê / Offboarder, State "Active queue"). Reproduce exactly as shown.

### C. Hero bar (session header — phase = capture)
- 48px circle `bg-violet-100 text-violet-700`, initials **ML**.
- Title row: **"Minh Lê's session"** (`text-lg font-semibold`) + a `CAPTURE` badge (uppercase, `text-[9px]`, violet: `bg-violet-50 border-violet-200 text-violet-700`).
- Sub line: **"Senior Backend Engineer · Engineering"** (`text-[12px] text-gray-500`).
- Mono meta line (`text-[11px]`, monospace): **"22d left · 9/14 answered · 7 satisfied"**.

### D. Tab row
- Three tabs: **Overview** (active — violet underline, `text-gray-900`), **Data** (inactive gray, clickable), **Logs** (inactive gray, clickable). Overview is selected on load.

### E. Deadline banner (emerald — days = 22, > 14 ⇒ "safe" variant)
- `bg-emerald-50/40 border-emerald-200 text-emerald-800`, clock icon, text `text-[12px]`:
  - Bold **"22 days"** then **" until your last day · July 4, 2026"**.

### F. Stat tiles (grid of 3, exact values — `QTile`)
Each tile: uppercase micro label (gray-500, `text-[10px]` tracking-wider) over a large mono number (`text-xl font-semibold`).
| Label (uppercase) | Value | Number color |
|---|---|---|
| **To answer** | **5** | rose-600 (urgent) |
| **Answered** | **9** | emerald-600 (good) |
| **Files uploaded** | **2** | gray-900 (normal) |

(Values derive from `SESSION`: to-answer = 14 − 9 = 5; answered = 9; files uploaded = literal 2.)

### G. Progress bar
- Track `bg-gray-200`, fill `bg-violet-500` at **64% width** (`round(9/14*100)`). Right-aligned mono count **"9 / 14"** (gray-500, `text-[11px]`).

### H. "Questions waiting for you" section
- Section label (uppercase, `tracking-[0.2em]`, gray-500): **"Questions waiting for you"** with a mono **· 5** count suffix.
- Five **clickable** cards (each a `<button>`), in this exact order. Card = question text (`text-[13px] text-gray-900`) on top, then a meta row (`text-[11px] text-gray-500`): a source icon + source label + a gray module chip (`text-[9px] px-1.5 py-0.5 rounded bg-gray-100`).
  1. **"What are the undocumented rate limits on the payment API?"** — [User icon] **Coworker** · chip **Payment Service**
  2. **"Is there a runbook for the nightly batch job failures?"** — [User icon] **Coworker** · chip **CI/CD Pipeline**
  3. **"What's the rollback procedure for the Atlas migration?"** — [User icon] **Hà Vy** · chip **CI/CD Pipeline**
  4. **"How does the Kafka retry logic handle poison messages?"** — [Sparkles icon, violet] **AI-generated** · chip **Payment Service**
  5. **"Who owns the vendor XYZ contract renewal?"** — [Sparkles icon, violet] **AI-generated** · chip **Inventory Sync**
  - Icon rule: `fromType: "ai"` → violet **Sparkles**; otherwise → **User** outline icon.
  - **Interaction (important):** clicking **any** of these cards calls `onOpenQuestion(id)` → **switches the active tab to Data** and **flashes the matching question row** there (the Data tab renders `OffboarderQueue`, a flat list of all 7 questions; the clicked row scrolls into view and runs a ~1.6s violet `qflash` highlight via stable ids `obq1…obq5`). This is the same target as the CTA below, but lands on the specific question.

### I. Primary CTA
- Violet button (`bg-violet-600`, white, `text-xs font-medium`, `h-8`): **"Open question queue"** + trailing arrow (ArrowRight). Calls `onSwitchTab("data")` — switches to the **Data** tab (does not navigate away).
- Helper line below (`text-[10px] text-gray-400`): **"Opens in Data tab"**.

### J. "Recently answered" section (dimmed, `opacity-50`)
- Section label: **"Recently answered"** with mono **· 9** suffix.
- Two cards (also clickable buttons → open in Data tab), each: question text with **line-through** (`text-[13px] text-gray-900 line-through`); meta row with emerald check icon + **"Answered"**, a status chip, and a gray module chip; an italic preview quote (`text-[11px] text-gray-500 italic`).
  1. **"Where is the API key rotation doc?"** — ✓ check · **Answered** · green chip **"✓ Satisfied"** (`bg-emerald-50 text-emerald-700`) · gray chip **Shared Libraries**
     Preview: *"Engineering wiki at /security/api-key-rotation.md. Rotates every 90 days via GitHub Action."*
  2. **"Who should I contact about the SLA penalty terms?"** — ✓ check · **Answered** · plain gray text **"waiting for review"** (not satisfied) · gray chip **Inventory Sync**
     Preview: *"Talk to Linh Phạm in Procurement — she handled the last renewal. SLA doc at /vendor-contracts."*

---

## 3. Style contract

| Token | Where it's used here |
|---|---|
| **violet** (500/600/700, 50/100/200) | Active sidebar nav pill, ART-EEP dot, hero avatar + CAPTURE badge, active tab underline, progress-bar fill, "Open question queue" CTA, AI-generated Sparkles icon, question-card hover border, Data-tab flash highlight, focus rings `ring-violet-500/20` |
| **pastel yellow** (50/200/700/800) | Not present in this Overview state (no warnings/gaps surfaced here). Reserve for low-confidence/warning only |
| **rose** (500/600) | "To answer" value **5** (urgent count), topbar bell unread dot |
| **emerald** (50/200/300/500/600/700/800) | Deadline banner (safe, >14 days), "Answered" value **9**, answered-card check icon, "✓ Satisfied" chip |
| **muted blue** | Not used here |
| **neutral grays** (gray-50/100/200/300/400/500/700/900) | Canvas `bg-gray-50`, surfaces `bg-white`, 1px `border-gray-200` hairlines, module chips `bg-gray-100`, secondary text |

Type & writing rules (locked):
- Sans-serif body; **monospace for IDs, timestamps, counts, dates** — applies to the hero mono meta line ("22d left · 9/14 answered · 7 satisfied"), the stat values, the "9 / 14" progress count, and the "· N" count suffixes on section labels.
- Section labels: `text-[10px]` uppercase, `tracking-[0.2em]`, gray-500, with a mono "· count" suffix.
- Stat-tile labels: `text-[10px]` uppercase `tracking-wider` gray-500; values `text-xl font-semibold` mono.
- **32px (`h-8`) button heights.** Explicit focus rings `focus:ring-2 focus:ring-violet-500/20`.
- 1px `border-gray-200` hairlines; semantic accents only where present (e.g. emerald left-accent on answered-answer blocks lives in the Data tab, not this Overview).
- Light mode only; `bg-gray-50` canvas, `bg-white` cards.
- Sentence-case English UX writing. Named humans, not roles ("Hà Vy", "Coworker", "Minh Lê").
- "Sensitive content" not "PII"; no "playbook" wording (this state has none — keep it that way).

---

## 4. Notes for the redesign pass

**Fixed (do not change):**
- This screen **is** the offboarder's session command view, not a standalone dashboard. Keep the **hero bar → tab row (Overview/Data/Logs) → Overview body** structure; Overview is the active tab.
- The offboarder's **minimal sidebar**: only **Dashboard** (Workspace) and **Design states** (More). Do not render Sessions / Knowledge graph / Settings.
- Region order inside Overview: deadline banner → 3 stat tiles → progress bar → "Questions waiting for you" (5 cards) → CTA + helper → "Recently answered" (2 dimmed cards).
- All copy, the 5 question strings + their source/module/icon mapping, the 2 answered strings + previews, all counts, and the hero strings.
- The interaction: question cards and the CTA target the **Data** tab; clicking a specific card flashes its matching Data row.
- The dimming treatment on the "Recently answered" block.
- The wide hero/tabs (`max-w-5xl`) vs the narrower Overview body (`max-w-2xl`, left-aligned) — do not stretch the body to full hero width.
- Sidebar + topbar chrome including the "Minh Lê / Offboarder" pill and "Active queue" State value as shown.

**Free (designer's discretion):**
- Visual treatment of cards (shadow vs hairline, corner radius rhythm), icon weight, exact spacing rhythm, how the progress bar, tiles, and hero are styled — as long as proportions and the design-system palette hold.

**Cross-checks (must hold):**
- Tiles must be internally consistent with the progress bar and hero: **Answered 9** + **To answer 5** = **14 total**, the bar reads **9 / 14** at **64%** fill, and the hero meta reads **"9/14 answered · 7 satisfied"**.
- "Questions waiting for you · 5" must list exactly **5** cards; "Recently answered · 9" header count is 9 but only the **2** answered cards render here (the rest live in the Data tab).

---

> **Screenshot:** `design-briefs/packs/2026-06-22/screens/dashboard-offboarder-active-queue.png` is the positional ground-truth this layout contract describes. Treat it as the layout authority where it and the prose differ on placement.
