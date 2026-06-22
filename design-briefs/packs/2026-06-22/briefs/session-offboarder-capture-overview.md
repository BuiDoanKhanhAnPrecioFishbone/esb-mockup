# Design brief — Session command view · Offboarder · Capture · Overview tab

> **What this is:** the first-person view Minh Lê (the departing engineer) sees when they open
> their own handover session during the **Capture** step, on the **Overview** tab. It is a single
> calm card: a progress bar over their AI-generated question queue plus one primary CTA to open it.
> **Reproduce, don't reinvent.** The screenshot is the positional ground truth. Re-render every
> region in the same order, position, and proportion — same copy, same counts, same single CTA.
> Do not add panels, stats grids, or manager-style controls; the offboarder view is deliberately
> sparse compared to the manager view of the same screen.

- **Source of truth:** `components/mockups/session-command-view.jsx` — `OffboarderOverview` (the `stepId==="capture"` branch), inside `SessionPage` → `OverviewContent`. Chrome from `components/app/AppShell.tsx`.
- **Live state captured:** `/session/minh-le?role=offboarder&step=capture&tab=overview` · viewport 1440×900, light mode.
- **State resolution:** `role=offboarder` + `step=capture` → `phase="capture"`, `isReady=true`. Overview tab → `OverviewContent` routes to `OffboarderOverview` → returns the violet question-queue card. Data tab is **enabled** (only disabled for offboarder during Prepare). Logs tab is **visible** (only hidden for coworker).

---

## 1. Layout contract

Two fixed regions wrap the content: a 224px sidebar (left, full height) and a 48px topbar (top, right of sidebar). Content sits in a centered column, `max-w-5xl` (1024px) with `p-6` (24px) padding, on a `bg-gray-50` canvas.

```
┌──────────────┬────────────────────────────────────────────────────────────────┐
│ SIDEBAR      │ TOPBAR  h-12 (48px) · white · border-b                          │
│ w-56 (224px) │ [search box ······]      (flex-1 spacer)   [🔔] [State ▾] │[ML▾]│
│ white        ├────────────────────────────────────────────────────────────────┤
│ border-r     │                                                                 │
│              │   ┌── max-w-5xl centered column · p-6 ────────────────────────┐ │
│ ● ART-EEP    │   │ HERO BAR  rounded-lg border bg-white p-4 · flex gap-4     │ │
│              │   │  ┌──┐  Minh Lê's session  [CAPTURE]                       │ │
│ WORKSPACE    │   │  │ML│  Senior Backend Engineer · Engineering              │ │
│ ▸ Dashboard  │   │  └──┘  22d left · 9/14 answered · 7 satisfied   (mono)    │ │
│ ▸ Sessions ◄ │   ├──────────────────────────────────────────────────────────┤ │
│ ▸ Knowledge  │   │ TABS  border-b · [Overview] Data  Logs                    │ │
│   graph      │   │        ▔▔▔▔▔▔▔ (violet underline on Overview)             │ │
│ ▸ Settings   │   ├──────────────────────────────────────────────────────────┤ │
│              │   │ QUEUE CARD  rounded-lg border-violet-200 bg-violet-50/30  │ │
│ MORE         │   │   ✦ Your question queue                                   │ │
│ ▸ Design     │   │   �per progress bar▔▔▔▔▔▔▔▔▔▔▔▔░░░░░░░░  9/14 (mono)      │ │
│   states     │   │   5 remaining                                             │ │
│              │   │   [ Open question queue → ]  (violet, h-8)                │ │
│ ─────────    │   └──────────────────────────────────────────────────────────┘ │
│ Mockup       │                                                                 │
│ playground   │            (rest of canvas empty — single card, no fill)        │
└──────────────┴────────────────────────────────────────────────────────────────┘
```

Key measurements (from Tailwind classes):
- **Sidebar** `w-56` = 224px, `border-r border-gray-200`, white. Logo row `h-12` (48px) matches topbar height. Nav items `h-8` (32px), `gap-0.5`.
- **Topbar** `h-12` = 48px, white, `border-b`, `px-4`, `gap-4`. Search box `h-8` (32px) `max-w-md` left; `flex-1` spacer pushes the bell, State switcher, and role pill to the right.
- **Content column** `max-w-5xl` (1024px) `mx-auto`, `p-6` (24px).
- **Hero bar** `rounded-lg border border-gray-200 bg-white p-4 mb-5`, `flex items-center gap-4`. Avatar `w-12 h-12` (48px) rounded-full, `bg-violet-100`.
- **Tab row** `flex border-b border-gray-200 mb-5`. Each tab `px-4 py-2.5` (≈ 32px h), `text-sm font-medium`, `border-b-2` (active = `border-violet-600`).
- **Queue card** `rounded-lg border border-violet-200 bg-violet-50/30 p-5` (20px). Progress bar track `h-[6px]` rounded-full `bg-gray-200`, fill `bg-violet-500` at ~64% (9/14). CTA button `h-8` (32px) `px-4` rounded-md.

---

## 2. Content contract

Walk top-to-bottom. Exact strings, counts, badges, icons.

### Sidebar (`AppShell` → `Sidebar`)
- Logo row: 1.5×1.5 violet dot + **`ART-EEP`** (mono, letter-spacing `0.18em`, uppercase).
- Section label **`WORKSPACE`** (mono, 10px, uppercase, gray-400), then nav links (icon + label, `h-8`):
  - `Dashboard` · `Sessions` (active — `bg-violet-50 text-violet-700`, since path starts with `/session`) · `Knowledge graph` · `Settings`.
- Section label **`MORE`**, then `Design states`.
- Footer block: **`Mockup playground`** (gray-700 medium) + `Live preview of ART-EEP surfaces. Changes ship via Claude → main → Vercel.` (In the screenshot a round avatar overlaps this footer — that is a browser/devtools artifact, not part of the design; ignore it.)

### Topbar (`AppShell` → `TopBar`)
- Search box: search icon + placeholder **`Search sessions, people, or knowledge`** + a mono keycap **`⌘K`** (renders the `&lcub;K` glyph — treat as `⌘K`).
- Bell icon with a rose dot (unread indicator, top-right of bell).
- **State switcher** pill: Layers icon + label `State` + value **`Capture (active)`** + chevron. (This is the current `step`; the FLOW label for `capture` is `Capture (active)`.)
- **Role pill** (right, `border-l` divider): avatar circle + name + sub-label.
  - **For this offboarder view it reads `ML` · `Minh Lê` · `Offboarder`** — matches the screenshot.

### Hero bar (`HeroBar`, phase=capture)
- Avatar `ML` in violet circle (`bg-violet-100 text-violet-700`, 48px).
- Title row: **`Minh Lê's session`** (`text-lg font-semibold`) + uppercase badge **`CAPTURE`** (`bg-violet-50 border-violet-200 text-violet-700`, 9px, tracking-wider).
- Sub-line: **`Senior Backend Engineer · Engineering`** (12px, gray-500).
- Mono meta line (11px, gray-500, monospace): **`22d left · 9/14 answered · 7 satisfied`**.

### Tab row
- Three tabs in order: **`Overview`** (active — gray-900 text, violet-600 underline) · **`Data`** (gray-500, enabled) · **`Logs`** (gray-500). No counts on tabs.

### Overview content — `OffboarderOverview`, capture branch (the only body region)
One card: `rounded-lg border border-violet-200 bg-violet-50/30 p-5`.
- **Heading row:** violet Sparkles icon (`✦`, `w-4 h-4 text-violet-600`) + **`Your question queue`** (`text-sm font-semibold text-gray-900`).
- **Progress bar** (`ProgressBar`): full-width track, violet fill at `round(9/14×100)` ≈ **64%**, right-aligned mono count **`9/14`** (`text-[11px] font-medium`).
- **Caption:** **`5 remaining`** (`text-[12px] text-gray-500`). Value = `questions − answered` = `14 − 9 = 5`.
- **CTA:** filled violet button **`Open question queue`** with a trailing arrow (`→`, `ArrowRight w-3 h-3`). `h-8 px-4 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium`. Links to `/session/minh-le?tab=data` (opens the Data tab queue).

No other regions. The offboarder Overview is intentionally a single card — **no metric grid, no "Move to Deliver" button, no satisfy/follow-up controls** (those belong to the manager/coworker views of this same step).

---

## 3. Style contract

| Token | Where it's used here |
|---|---|
| **violet-600 / 700** | Primary CTA fill (`Open question queue`), active tab text + underline, active `Sessions` nav, progress-bar fill (violet-500), Sparkles AI signal, `CAPTURE` badge text. |
| **violet-50 / 50/30 / 100 / 200** | Queue card surface (`bg-violet-50/30`) + border (`border-violet-200`); hero avatar (`bg-violet-100`); CAPTURE badge bg; active nav bg. |
| **gray-50** | App canvas (`bg-gray-50`), search box fill, topbar State/search chrome. |
| **white** | Sidebar, topbar, hero bar surfaces. |
| **gray-200** | 1px hairlines: sidebar/topbar borders, hero bar border, tab row `border-b`. |
| **gray-900 / 700 / 500 / 400** | Title text / nav + body / sub-labels + captions / placeholder + section labels. |
| **rose-500** | Single accent: unread dot on the notification bell. Nothing else rose on this screen. |
| **emerald** | Not present in this state (no committed/satisfied chips render on the offboarder Overview). |

Type rules:
- **Monospace** (`ui-monospace, Menlo`) for: `ART-EEP` logo, section labels (`WORKSPACE`/`MORE`), the hero meta line (`22d left · 9/14 answered · 7 satisfied`), the progress count (`9/14`), the `⌘K` keycap. Everything else sans-serif.
- Section labels: 10px, uppercase, `tracking-wider`, gray-400, mono.
- Sentence-case UX writing throughout ("Your question queue", "Open question queue", "5 remaining"). Named human ("Minh Lê's session"), not a role.
- Buttons: ~32px tall (`h-8`), rounded, explicit focus rings `focus:ring-2 focus:ring-violet-500/20` on interactive chrome.
- Badges: 9px uppercase, `tracking-wider`, 1px border, pill radius.

---

## 4. Notes for the redesign pass

**Fixed (must reproduce exactly):**
- Region order and presence: sidebar → topbar → hero bar → tab row → single queue card. Nothing below the card.
- All copy and numbers verbatim: `Minh Lê's session`, `CAPTURE`, `Senior Backend Engineer · Engineering`, `22d left · 9/14 answered · 7 satisfied`, `Your question queue`, `5 remaining`, `Open question queue`, State value `Capture (active)`.
- The single primary CTA. Do **not** add a metric grid, second button, or any satisfy/review control — that's the manager view, not this one.
- Tabs: Overview active, Data + Logs both present and enabled.
- Role pill = **Minh Lê / Offboarder** (as shown in the screenshot).

**Free (redesign latitude):**
- Visual treatment of the progress bar (thickness, end-cap rounding, label position) so long as it reads ~64% with `9/14`.
- Spacing rhythm, icon weight, hairline vs subtle shadow, exact violet tint of the card surface.
- Empty-canvas treatment below the card (it can stay empty; no need to fill it).

**Cross-checks (must stay internally consistent):**
- `answered (9) + remaining (5) = questions (14)`. Progress count `9/14`, caption `5 remaining`, and hero `9/14 answered` must all agree.
- `satisfied (7) ≤ answered (9)`.
- Progress fill % = `round(9/14×100)` ≈ 64% — the bar should be roughly two-thirds filled, not half, not full.

> **Screenshot note:** the captured PNG is faithful — topbar pill correctly reads `Minh Lê / Offboarder`, State switcher `Capture (active)`. The only capture-time artifact is a stray round avatar overlapping the sidebar footer (the dev-tools/Vercel toolbar badge); ignore it. Everything else (hero, tabs, the single violet queue card, `9/14`, `5 remaining`, `Open question queue`) is the layout to reproduce. Re-capture from `/session/minh-le?role=offboarder&step=capture&tab=overview` if needed.
