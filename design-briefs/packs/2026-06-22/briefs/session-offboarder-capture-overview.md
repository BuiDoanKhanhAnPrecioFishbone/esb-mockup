# Design brief — Session command view · Offboarder · Capture · Overview tab

> **What this is:** the first-person view Minh Lê (the departing engineer) sees when they open
> their own handover session during the **Capture** step, on the **Overview** tab. The Overview tab
> was just restructured: it is now Minh Lê's full **question-queue dashboard** — an emerald deadline
> bar, three stat tiles, an answered/total progress bar, a list of five clickable "questions waiting
> for you" cards, an "Open question queue" CTA, and a "recently answered" list of two cards. This is
> the same screen the offboarder reaches as their **Dashboard** (their sidebar's Dashboard link is
> this session view).
> **Reproduce, don't reinvent.** The screenshot is the positional ground truth. Re-render every
> region in the same order, position, and proportion — same copy, same counts, same chips. Do not add
> manager-style controls (no "Move to Deliver", no satisfy/review buttons) and do not collapse this
> back into a single card — this is now a multi-region dashboard.

- **Source of truth:** `components/mockups/session-command-view.jsx` — `OffboarderOverview` (the `stepId==="capture"` branch), reached via `SessionPage` → `OverviewContent` → `if (role==="offboarder") return <OffboarderOverview …/>`. Question data is the `OB_QUEUE` array. Chrome from `components/app/AppShell.tsx`.
- **Live state captured:** `/session/minh-le?role=offboarder&step=capture&tab=overview` · viewport 1440×900, light mode.
- **State resolution:** `role=offboarder` + `step=capture` → `phase="capture"`. Overview tab → `OverviewContent` routes to `OffboarderOverview`; the `stepId==="capture"` branch renders the dashboard (the `stepId!=="capture"` branch would render a dashed "Your session is being prepared" empty state instead). The Data tab is **enabled** (only disabled for offboarder during Prepare); Logs is **visible** (only hidden for coworker).

---

## 1. Layout contract

Two fixed regions wrap the content: a 224px sidebar (left, full height) and a 48px topbar (top, right of sidebar). The body content sits in a centered `max-w-5xl` column with `p-6` padding, but the offboarder dashboard itself is constrained to a narrower **`max-w-2xl` (672px)** sub-column, left-aligned inside that padding — so the dashboard hugs the left of the content area, leaving empty canvas to its right.

```
┌──────────────┬────────────────────────────────────────────────────────────────┐
│ SIDEBAR      │ TOPBAR  h-12 (48px) · white · border-b                          │
│ w-56 (224px) │ [search box ······]      (flex-1 spacer)   [🔔] [State ▾] │[ML▾]│
│ white        ├────────────────────────────────────────────────────────────────┤
│ border-r     │                                                                 │
│              │   ┌── max-w-5xl column · p-6 ────────────────────────────────┐  │
│ ● ART-EEP    │   │ HERO BAR  rounded-lg border bg-white p-4 · flex gap-4    │  │
│              │   │  ┌──┐ Minh Lê's session [CAPTURE]                        │  │
│ WORKSPACE    │   │  │ML│ Senior Backend Engineer · Engineering              │  │
│ ▸ Dashboard◄ │   │  └──┘ 22d left · 9/14 answered · 7 satisfied  (mono)     │  │
│              │   ├──────────────────────────────────────────────────────────┤  │
│ MORE         │   │ TABS  border-b · [Overview] Data  Logs                   │  │
│ ▸ Design     │   │        ▔▔▔▔▔▔▔ (violet underline on Overview)            │  │
│   states     │   ├── DASHBOARD  max-w-2xl (672px), left-aligned ────────┐   │  │
│              │   │ │ ⏱ 22 days until your last day · July 4, 2026  (emerald)│ │  │
│ ─────────    │   │ ├──────────┬──────────┬──────────┐                    │   │  │
│ Mockup       │   │ │TO ANSWER │ ANSWERED │FILES UPL.│  3 stat tiles      │   │  │
│ playground   │   │ │   5(rose)│  9(emer.)│   2(gray)│                    │   │  │
│              │   │ ├──────────┴──────────┴──────────┘                    │   │  │
│              │   │ │ progress ▔▔▔▔▔▔▔▔▔▔▔░░░░░░  9 / 14 (mono)           │   │  │
│              │   │ │ QUESTIONS WAITING FOR YOU · 5                       │   │  │
│              │   │ │ ┌ q card · source + module chip ──────────────────┐ │   │  │
│              │   │ │ │ … ×5                                            │ │   │  │
│              │   │ │ [ Open question queue → ]   Opens in Data tab     │   │  │
│              │   │ │ RECENTLY ANSWERED · 9                              │   │  │
│              │   │ │ ┌ answered card · preview + Satisfied/waiting ────┐ │   │  │
│              │   │ │ │ … ×2                                            │ │   │  │
│              │   └─┴─────────────────────────────────────────────────────┘   │  │
└──────────────┴────────────────────────────────────────────────────────────────┘
```

Key measurements (from Tailwind classes):
- **Sidebar** `w-56` = 224px, `border-r border-gray-200`, white. Logo row `h-12` (48px). For the **offboarder** the primary nav is filtered to **Dashboard only** (`role==="offboarder"` → `PRIMARY_NAV.filter(Dashboard)`); the `MORE` section still shows `Design states`. Nav items `h-8` (32px).
- **Topbar** `h-12` = 48px, white, `border-b`, `px-4`, `gap-4`. Search box `h-8` `max-w-md` left; `flex-1` spacer pushes bell + State switcher + role pill right.
- **Content column** `max-w-5xl` (1024px) `mx-auto`, `p-6` (24px). Hero bar and tab row span this column.
- **Dashboard sub-column** `max-w-2xl` (672px), left-aligned — every dashboard region below the tabs lives inside this width.
- **Hero bar** `rounded-lg border border-gray-200 bg-white p-4 mb-5`, `flex items-center gap-4`. Avatar `w-12 h-12` (48px) rounded-full `bg-violet-100`.
- **Tab row** `flex border-b border-gray-200 mb-5`. Each tab `px-4 py-2.5`, `text-sm font-medium`, `border-b-2` (active = `border-violet-600`).
- **Deadline bar** `rounded-lg border border-emerald-200 bg-emerald-50/40 px-4 py-2.5 mb-4`, `flex items-center gap-2`, `text-[12px] text-emerald-800`, Clock icon `w-3.5 h-3.5`.
- **Stat tiles** `grid grid-cols-3 gap-3 mb-4`. Each tile `rounded-lg border border-gray-200 bg-white p-3`: a 10px uppercase gray-500 label + a `text-xl font-semibold` mono value.
- **Progress row** `flex items-center gap-3 mb-4`: track `flex-1 h-[5px] rounded-full bg-gray-200`, fill `bg-violet-500` at ≈64% (9/14); trailing mono count `9 / 14` (`text-[11px] text-gray-500`).
- **Question cards** (`QCard`) `w-full text-left rounded-lg border border-gray-200 bg-white px-4 py-3`, `space-y-2` between them, hover `border-violet-300 hover:shadow-sm`, focus ring `ring-2 ring-violet-500/20`.
- **CTA** `h-8 px-4 rounded-md bg-violet-600 text-white text-xs font-medium`, with a 10px gray-400 caption below it.
- **Recently-answered section** `mt-6`; its two cards reuse `QCard` at full opacity with an italic answer preview line.

---

## 2. Content contract

Walk top-to-bottom. Exact strings, counts, chips, icons. Numbers come from `SESSION` and the `OB_QUEUE` array.

### Sidebar (`AppShell` → `Sidebar`, offboarder)
- Logo row: 1.5×1.5 violet dot + **`ART-EEP`** (mono, `tracking-[0.18em]`, uppercase).
- Section label **`WORKSPACE`** (mono, 10px, uppercase, gray-400), then **only** **`Dashboard`** (active — `bg-violet-50 text-violet-700`, since the path starts with `/session` and Dashboard's match resolves active here). No Sessions / Knowledge graph / Settings links for the offboarder.
- Section label **`MORE`**, then **`Design states`**.
- Footer block: **`Mockup playground`** (gray-700 medium) + `Live preview of ART-EEP surfaces. Changes ship via Claude → main → Vercel.` (In the screenshot a round `N` avatar overlaps this footer — a dev-tools/Vercel toolbar artifact, not part of the design; ignore it.)

### Topbar (`AppShell` → `TopBar`)
- Search box: search icon + placeholder **`Search sessions, people, or knowledge`** + mono keycap **`⌘K`** (renders the `&lcub;K` glyph — treat as `⌘K`).
- Bell icon with a rose unread dot (top-right of bell).
- **State switcher** pill: Layers icon + label `State` + value **`Capture (active)`** + chevron (this is the current `step`; the FLOW label for `capture` is `Capture (active)`).
- **Role pill** (right, `border-l` divider): avatar `ML` + **`Minh Lê`** + sub-label **`Offboarder`** — matches the screenshot.

### Hero bar (`HeroBar`, phase=capture)
- Avatar **`ML`** in violet circle (`bg-violet-100 text-violet-700`, 48px).
- Title row: **`Minh Lê's session`** (`text-lg font-semibold`) + uppercase badge **`CAPTURE`** (`bg-violet-50 border-violet-200 text-violet-700`, 9px, tracking-wider).
- Sub-line: **`Senior Backend Engineer · Engineering`** (12px, gray-500).
- Mono meta line (11px, gray-500, monospace): **`22d left · 9/14 answered · 7 satisfied`**.

### Tab row
- Three tabs in order: **`Overview`** (active — gray-900 text, violet-600 underline) · **`Data`** (gray-500, enabled) · **`Logs`** (gray-500, enabled). No counts on tabs.

### Dashboard body — `OffboarderOverview`, capture branch (in `max-w-2xl`)

**1. Deadline bar (emerald).** Clock icon + **`22 days`** (bold) + **` until your last day · July 4, 2026`**. Full string reads: **`22 days until your last day · July 4, 2026`**. Emerald-800 text on `bg-emerald-50/40` with `border-emerald-200`. (Note: the `22 days` is `SESSION.daysLeft`; the date string `July 4, 2026` is hard-coded in this component and differs from `SESSION.deadline` "Jun 30" — reproduce **July 4, 2026** as shown.)

**2. Stat tiles (3, `QTile`).** Label (10px uppercase gray-500) over a mono `text-xl font-semibold` value:
- **`TO ANSWER`** → **`5`**, value colored **rose-600** (`tone="urgent"`). Value = `questions − answered` = `14 − 9`.
- **`ANSWERED`** → **`9`**, value colored **emerald-600** (`tone="good"`).
- **`FILES UPLOADED`** → **`2`**, value colored **gray-900** (`tone="normal"`). (Hard-coded `2` here — note `SESSION.files` is 3; reproduce **2** as shown.)

**3. Progress bar.** Thin (`h-[5px]`) gray track with violet-500 fill at `round(9/14×100)` ≈ **64%**; right-aligned mono count **`9 / 14`** (gray-500).

**4. Section label + waiting list.** Label **`QUESTIONS WAITING FOR YOU`** (10px uppercase, `tracking-[0.2em]`, gray-500) followed by mono **`· 5`** (gray-400). Then five `QCard`s, each: a 13px gray-900 **question** line, then an 11px meta row = a source icon + source name + a gray module chip. The five waiting questions, in order (`OB_QUEUE` where `answered=false`):
  1. **`What are the undocumented rate limits on the payment API?`** — User icon + **`Coworker`** + chip **`Payment Service`**.
  2. **`Is there a runbook for the nightly batch job failures?`** — User icon + **`Coworker`** + chip **`CI/CD Pipeline`**.
  3. **`What's the rollback procedure for the Atlas migration?`** — User icon + **`Hà Vy`** + chip **`CI/CD Pipeline`**.
  4. **`How does the Kafka retry logic handle poison messages?`** — violet Sparkles icon + **`AI-generated`** + chip **`Payment Service`**.
  5. **`Who owns the vendor XYZ contract renewal?`** — violet Sparkles icon + **`AI-generated`** + chip **`Inventory Sync`**.
  (Human sources get a `User` icon; AI sources get a violet `Sparkles` icon. The module chip is `bg-gray-100 text-gray-500`, 9px.)

**5. CTA + caption.** Filled violet button **`Open question queue`** with trailing arrow (`→`), `h-8 px-4 rounded-md bg-violet-600 text-white text-xs font-medium`. Directly below, 10px gray-400 caption **`Opens in Data tab`**. The button switches the active tab to **Data**.

**6. Recently answered (`mt-6`).** Section label **`RECENTLY ANSWERED`** (10px uppercase, `tracking-[0.2em]`, gray-500) + mono **`· 9`** (gray-400). Then **two** full-opacity `QCard`s (the `answered=true` rows of `OB_QUEUE`), each with: question line, a meta row showing an emerald CheckCircle + **`Answered`** + a status chip + module chip, then an **italic** gray-500 answer preview wrapped in quotes:
  1. **`Where is the API key rotation doc?`** — emerald check + **`Answered`** + emerald chip **`✓ Satisfied`** + chip **`Shared Libraries`**. Preview: *`"Engineering wiki at /security/api-key-rotation.md. Rotates every 90 days via GitHub Action."`*
  2. **`Who should I contact about the SLA penalty terms?`** — emerald check + **`Answered`** + gray text **`waiting for review`** (not satisfied) + chip **`Inventory Sync`**. Preview: *`"Talk to Linh Phạm in Procurement — she handled the last renewal. SLA doc at /vendor-contracts."`*

> **Interaction note:** every `QCard` (waiting **and** answered) is a button — clicking it calls `onOpenQuestion(id)`, which **switches the active tab to Data** and then **scrolls to + flashes the matching question row** in the Data-tab queue (a violet box-shadow + violet-50 background `qflash` animation keyed to the question's stable `OB_QUEUE` id). The "Open question queue" CTA does the same tab switch but with no specific row focus. None of this is visible in a static screenshot — but reproduce the cards as clickable affordances (hover border + shadow, focus ring).

The section counts shown (`· 5` waiting, `· 9` recently answered) are the labels' chip values; the visible card lists are deliberately truncated previews (5 waiting cards, 2 answered cards rendered), not the full counts.

---

## 3. Style contract

| Token | Where it's used here |
|---|---|
| **violet-600 / 700** | Primary CTA fill (`Open question queue`), active tab text + underline, active `Dashboard` nav, progress-bar fill (violet-500), Sparkles AI-source icon, `CAPTURE` badge text, card hover border. |
| **violet-50 / 100 / 200** | Hero avatar (`bg-violet-100`); CAPTURE badge bg; active nav bg; card hover/focus accents. |
| **emerald-600 / 700 / 800 / 50 / 200 / 400** | Deadline bar (border-200, bg-50/40, text-800); `ANSWERED` stat value (emerald-600); answered-card check icon (emerald-500); `✓ Satisfied` chip (`bg-emerald-50 text-emerald-700`). Emerald = "on track / verified". |
| **rose-600 / 500** | `TO ANSWER` stat value (rose-600 — the one urgent number); unread dot on the notification bell (rose-500). Used sparingly, for urgency only. |
| **yellow** | Not present in this state (no knowledge-gap warnings render on the offboarder Overview). |
| **gray-50 / 100 / 200** | Canvas (`bg-gray-50`); module chips + `waiting for review` (gray); 1px hairlines on hero, tabs, tiles, cards. |
| **gray-900 / 800 / 700 / 500 / 400** | Question titles / answer previews / nav + tile values / sub-labels + section labels / chip + caption text. |
| **white** | Sidebar, topbar, hero bar, stat tiles, and question cards. |

Type rules:
- **Monospace** (`ui-monospace, Menlo`) for: `ART-EEP` logo, section labels (`WORKSPACE`/`MORE`), the hero meta line, all three stat-tile **values** (`5`/`9`/`2`), the progress count (`9 / 14`), the `· 5` / `· 9` count chips on section labels, and the `⌘K` keycap. Everything else sans-serif.
- Dashboard section labels (`QUESTIONS WAITING FOR YOU`, `RECENTLY ANSWERED`): 10px, uppercase, **`tracking-[0.2em]`** (wider than the sidebar's `tracking-wider`), gray-500. Stat-tile labels: 10px uppercase `tracking-wider` gray-500.
- Answer previews are **italic**, gray-500, wrapped in straight quotes.
- Sentence-case UX writing throughout. Named humans ("Minh Lê's session", source "Hà Vy", "Linh Phạm in Procurement"), not roles — except the literal source label **`Coworker`** and the AI source **`AI-generated`** which are chips, not names.
- Buttons ~32px tall (`h-8`), rounded; explicit focus rings `focus:ring-2 focus:ring-violet-500/20` on interactive chrome and cards.
- Chips/badges: 9px, pill radius; status chips have a tinted bg, module chips are gray.

---

## 4. Notes for the redesign pass

**Fixed (must reproduce exactly):**
- Region order and presence: sidebar → topbar → hero bar → tab row → **deadline bar → 3 stat tiles → progress bar → "Questions waiting for you" label + 5 cards → "Open question queue" CTA + caption → "Recently answered" label + 2 cards.** This is the new dashboard layout — do **not** collapse it back to a single card.
- All copy and numbers verbatim: hero `Minh Lê's session` / `CAPTURE` / `Senior Backend Engineer · Engineering` / `22d left · 9/14 answered · 7 satisfied`; deadline `22 days until your last day · July 4, 2026`; tile labels `TO ANSWER 5` / `ANSWERED 9` / `FILES UPLOADED 2`; progress `9 / 14`; both section labels with their `· 5` and `· 9` counts; the five waiting questions and two answered questions with their exact source, module chip, status, and answer-preview text; CTA `Open question queue` + caption `Opens in Data tab`; State value `Capture (active)`.
- Stat value colors: `TO ANSWER` rose, `ANSWERED` emerald, `FILES UPLOADED` neutral gray.
- Source-icon rule: human sources → User icon; AI sources → violet Sparkles icon. AI-source rows are the 4th and 5th waiting cards.
- All seven question cards are clickable; clicking → Data tab + flash matching row. CTA → Data tab.
- Sidebar nav for the offboarder is **Dashboard only** (+ `Design states` under MORE). Tabs: Overview active, Data + Logs present and enabled. Role pill = **Minh Lê / Offboarder**.
- Dashboard is left-aligned in a `max-w-2xl` column — empty canvas to its right is correct, not a missing region.

**Free (redesign latitude):**
- Visual treatment of the progress bar (thickness, cap rounding, label position) so long as it reads ~64% with `9 / 14`.
- Card hover/shadow treatment, spacing rhythm, icon weight, exact tint of the emerald deadline bar and chips.
- Whether the answered-preview quote uses curly or straight quotes; italic is preferred but the emphasis can be re-rendered.

**Cross-checks (must stay internally consistent):**
- `answered (9) + to-answer (5) = questions (14)`. Hero `9/14 answered`, the `ANSWERED 9` + `TO ANSWER 5` tiles, the progress `9 / 14`, and the `QUESTIONS WAITING FOR YOU · 5` label must all agree.
- `satisfied (7) ≤ answered (9)`; the hero shows `7 satisfied`.
- Progress fill % = `round(9/14×100)` ≈ 64% — roughly two-thirds, not half, not full.
- Of the two recently-answered cards, exactly one is `✓ Satisfied` (API key rotation) and one is `waiting for review` (SLA penalty terms).

> **Screenshot note:** the captured PNG matches this contract — emerald deadline bar, three stat tiles (`5` rose / `9` emerald / `2` gray), two-thirds progress, five waiting cards, the violet `Open question queue` CTA with `Opens in Data tab` caption, and two recently-answered cards with italic previews. The only capture-time artifact is a stray round `N` avatar overlapping the sidebar footer (dev-tools/Vercel toolbar badge); ignore it. Re-capture from `/session/minh-le?role=offboarder&step=capture&tab=overview` if needed.
