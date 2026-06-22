# Design brief — All Sessions registry · `all-sessions-list` (All filter)

> **What this is.** The All Sessions registry at `/sessions`: a single-column, filterable list of every handover session in the workspace, wrapped in the shared ART-EEP AppShell (sidebar + topbar). This screen is the default landing state — the **All** filter is selected, so all four sessions render.
>
> **Reproduce, don't reinvent.** Rebuild *this exact screen* — same regions, same order, same relative positions and proportions as the attached screenshot. Do not invent, drop, reorder, or move pieces. Re-render the visuals on the design system tokens below. The screenshot is the layout contract, this outline is the content contract, the tokens are the style contract.

- **Source of truth:** `components/mockups/all-sessions.jsx` (route `/sessions`), wrapped by `components/app/AppShell.tsx`
- **Live state captured:** `/sessions`, default filter **All** selected (`useState("All")`) → all 4 session rows visible · viewport 1440×900, light mode
- **Role pill:** Hà Vy · Manager / HR (AppShell default `role="manager"`)

---

## 1. Layout contract

Two-column app frame: fixed 224px sidebar on the left, everything else in a flex column (48px topbar + main content). The list itself is centered in a `max-w-4xl` (896px) column with 24px padding.

```
┌──────────────┬──────────────────────────────────────────────────────────────┐
│ SIDEBAR 224px │ TOPBAR  h-48px  border-b                                       │
│ (w-56)        │ ┌────────────────────────┐         [🔔] [≡ State] │ [HV ▼]    │
│ border-r      │ │ 🔍 Search sessions,…{K}│  flex-1                            │
│ bg-white      │ └────────────────────────┘                                    │
│              ├──────────────────────────────────────────────────────────────┤
│ ● ART-EEP    │  MAIN  bg-gray-50                                              │
│ ───────────  │   ┌──────── max-w-4xl (896px) centered · p-6 ────────────┐    │
│ WORKSPACE    │   │ Sessions (h1)                      [+ Create session] │    │
│ ▣ Dashboard  │   │                                                       │    │
│ ▣ Sessions ◀ │   │ [ All | Active 2 | Completed 2 ]      [🔍 Search ses…]│    │
│ ⬡ Knowledge  │   │                                                       │    │
│   graph      │   │ ┌─ row · TT ─ Thanh Tùng · PREPARE · Waiting on you ─┐│    │
│ ⚙ Settings   │   │ └────────────────────────────────────────────────────┘│    │
│              │   │ ┌─ row · ML ─ Minh Lê · CAPTURE ────────────── → ────┐│    │
│ MORE         │   │ └────────────────────────────────────────────────────┘│    │
│ ▣ Design     │   │ ┌─ row · TĐ ─ Thanh Đức · ✓COMPLETE ──── [View in KG]┐│    │
│   states     │   │ └────────────────────────────────────────────────────┘│    │
│              │   │ ┌─ row · AT ─ Anh Thư · ✓COMPLETE ────── [View in KG]┐│    │
│ ───────────  │   │ └────────────────────────────────────────────────────┘│    │
│ Mockup       │   └───────────────────────────────────────────────────────┘    │
│ playground   │                                                                │
└──────────────┴──────────────────────────────────────────────────────────────┘
```

**Key measurements (from Tailwind classes):**

- **Sidebar** — `w-56` = **224px**, `shrink-0`, `border-r border-gray-200`, `bg-white`. Hidden below `md`. Logo header `h-12` (48px). Nav `px-2 py-3`, items `h-8` (32px). Footer block pinned at bottom (`border-t`, `px-4 py-3`).
- **Topbar** — `h-12` = **48px**, `bg-white`, `border-b border-gray-200`, `px-4`, `flex items-center gap-4`. Search box `h-8`, `max-w-md`, `flex-1`; then `flex-1` spacer; then bell, State switcher, and user pill (the user pill has `pl-2 border-l`).
- **Main content** — `max-w-4xl mx-auto p-6` → **896px** centered column, **24px** padding. `bg-gray-50` canvas.
- **Page header row** — `flex items-center justify-between mb-6`: h1 left, Create button right (`h-8 px-3`).
- **Filter / search row** — `flex items-center gap-4 mb-5`: segmented filter (left) + `flex-1` spacer + search input (`h-8`, `max-w-xs`).
- **List** — `space-y-2` vertical stack of full-width rows. Each row `rounded-lg border bg-white`, inner `p-4 flex items-center gap-4`.
- **Row internal grid** — avatar (`w-9 h-9`, 36px) · title/meta block (`flex-1 min-w-0`) · right metrics block (`text-right`, `hidden sm:block`) · trailing action (`→` arrow or **View in KG** button).

> **Note:** State switcher (`≡ State`) only renders when the view has >1 state in the view-matrix; on `/sessions` it may be hidden. The screenshot shows the bell + user pill on the right; reproduce whatever the screenshot shows. The small dark circle at the very bottom-left over the footer is a dev/preview widget — **not** part of the design; omit it.

---

## 2. Content contract

Walk top-to-bottom, left-to-right. All strings are exact.

### Sidebar (AppShell)
- **Logo:** `●` violet dot (`w-1.5 h-1.5 bg-violet-500`) + `ART-EEP` in mono, letter-spacing `0.18em`.
- **Section label:** `WORKSPACE` (mono, 10px, uppercase, gray-400).
- **Nav items** (icon + label, `h-8`): **Dashboard** · **Sessions** · **Knowledge graph** · **Settings**.
  - **Sessions is ACTIVE** (matches `/session*`): `bg-violet-50 text-violet-700 font-medium`, icon `text-violet-600`.
- **Section label:** `MORE`.
- **Nav item:** **Design states**.
- **Footer block:** bold `Mockup playground`, then `Live preview of ART-EEP surfaces. Changes ship via Claude → main → Vercel.` (11px, gray-500).

### Topbar (AppShell)
- **Search input** (left, `max-w-md`): placeholder `Search sessions, people, or knowledge`, leading search icon, trailing mono key hint `{K`.
- **Right cluster:** bell button with a rose unread dot (`bg-rose-500`, top-right); the **State** switcher pill (`≡ State <label> ▾`) if present; user pill — violet avatar `HV`, name **Hà Vy**, sub **Manager / HR**, chevron.

### Page header
- **h1:** `Sessions` — `text-xl font-semibold tracking-tight text-gray-900`.
- **Primary button (right):** `+ Create session` — `h-8 px-3`, `bg-violet-600 hover:bg-violet-700`, white text, `text-xs font-medium`, rounded-md. Links to `/session/new`.

### Filter + search row
- **Segmented filter** — pill group in `bg-gray-100 rounded-lg p-0.5`. Three buttons, each `px-3 py-1.5 rounded-md text-xs font-medium`:
  - **All** — **SELECTED**: `bg-white text-gray-900 shadow-sm`. No count.
  - **Active** — unselected (`text-gray-500`), trailing mono count **2** (10px, gray-400).
  - **Completed** — unselected, trailing mono count **2**.
- **Search input (right):** `h-8 px-2.5 max-w-xs`, border-gray-200, white bg, search icon + placeholder `Search sessions...` (11px).

### Session rows (All filter → all 4, in this order)

Each row: avatar (initials) · name `'s session` + phase badge (+ optional "Waiting on you") · role · dept · timing · right-aligned two-line metrics · trailing action.

**Row 1 — Thanh Tùng** *(active · blocked on manager)*
- Row has a **2px yellow left accent** (`borderLeft 2px rgb(234,179,8)`) and `border-yellow-200`.
- Avatar **TT** — yellow tint (`bg-yellow-50 text-yellow-700 border-yellow-200`).
- Title: **Thanh Tùng's session**
- Phase badge: **PREPARE** — blue (`bg-blue-50 border-blue-200 text-blue-700`), uppercase, 9px.
- Extra badge: **Waiting on you** — yellow, with clock icon, uppercase, 9px. (In the screenshot it reads "WAITING ON YOU".)
- Meta line: `QA Lead · Engineering · 28 days left`
- Right metrics: top `3 boards · 127 cards · 4 modules` · bottom `0 questions added`
- Trailing action: **→** arrow (gray-400), links to `/session/thanh-tung`.

**Row 2 — Minh Lê** *(active)*
- Avatar **ML** — neutral (`bg-gray-100 text-gray-700 border-gray-200`).
- Title: **Minh Lê's session**
- Phase badge: **CAPTURE** — violet (`bg-violet-50 border-violet-200 text-violet-700`).
- Meta line: `Senior Backend Engineer · Engineering · 22 days left`
- Right metrics: top `9 of 14 answered · 7 satisfied` · bottom `2 gaps open`
- Trailing action: **→** arrow, links to `/session/minh-le`.

**Row 3 — Thanh Đức** *(completed)*
- Avatar **TĐ** — emerald tint (`bg-emerald-50 text-emerald-700 border-emerald-200`).
- Title: **Thanh Đức's session**
- Phase badge: **COMPLETE** — emerald (`bg-emerald-50 border-emerald-200 text-emerald-700`), with leading ✓ check icon (`CheckCircle2`).
- Meta line: `DevOps Engineer · Engineering · Completed Mar 12, 2026`
- Right metrics: top `9 entries · 9 verified` · bottom `0 gaps remaining`
- Trailing action: **View in KG** button — `h-7 px-2.5`, `bg-violet-50 border-violet-200 text-violet-700`, sparkles icon, 10px. Links to `/knowledge-graph?prompt=thanh-duc`.

**Row 4 — Anh Thư** *(completed)*
- Avatar **AT** — emerald tint.
- Title: **Anh Thư's session**
- Phase badge: **COMPLETE** — emerald, with leading ✓ check icon.
- Meta line: `Product Designer · Design · Completed Jun 1, 2026`
- Right metrics: top `312 entries · 287 verified` · bottom `6 gaps resolved`
- Trailing action: **View in KG** button (violet), links to `/knowledge-graph?prompt=anh-thu`.

> **Cross-check:** Active count (2 = Thanh Tùng, Minh Lê) + Completed count (2 = Thanh Đức, Anh Thư) = 4 rows under All. Counts in the filter chips must match the rows shown.

---

## 3. Style contract

Light mode only. `bg-gray-50` canvas, `bg-white` surfaces, 1px `border-gray-200` hairlines except 2px semantic left accents.

| Token / color | Used for on this screen |
|---|---|
| **violet** (50/100/200/600/700) | Active **Sessions** nav item; `+ Create session` primary button (violet-600); **View in KG** buttons (violet-50 bg / violet-200 border / violet-700 text); Minh Lê **CAPTURE** badge; logo dot; user avatar; focus rings `ring-violet-500/20–30` |
| **pastel yellow** (50/200, ~700/800) | Thanh Tùng row: 2px left accent + yellow border, yellow avatar tint, **Waiting on you** badge (block-on-manager signal) |
| **emerald** (50/200/300/700) | **COMPLETE** badges (with ✓), completed-session avatar tints (Thanh Đức, Anh Thư), "verified" connotation |
| **rose** | Bell unread dot only (`bg-rose-500`) — critical/attention accent |
| **blue** (50/200/700) | **PREPARE** phase badge only (Thanh Tùng) |
| **gray** (50/100/200/400/500/700/900) | Canvas, surfaces, hairlines, neutral avatar (Minh Lê), unselected filter chips, meta text, mono counts |

**Type rules**
- Body: sans-serif (`ui-sans-serif, system-ui`). h1 `text-xl font-semibold tracking-tight`.
- **Monospace** (`ui-monospace, Menlo`) for: `ART-EEP` wordmark, nav section labels (`WORKSPACE`/`MORE`), filter-chip counts (`2`), the `{K` topbar key hint.
- Phase/status badges: 9px, uppercase, `tracking-wider`, `font-semibold`, 1px border, `rounded`.
- Session title `text-sm font-semibold`; meta line `text-[11px] text-gray-500`; right metrics `text-[11px] text-gray-700` over `text-[10px] text-gray-500`.

**Components**
- **Buttons** 32px tall (`h-8`) for primary; secondary "View in KG" is `h-7` (28px). Explicit focus rings `focus:ring-2 focus:ring-violet-500/20`.
- **Segmented filter:** track `bg-gray-100 rounded-lg p-0.5`; selected pill `bg-white text-gray-900 shadow-sm`; unselected `text-gray-500 hover:text-gray-700`.
- **Rows:** `rounded-lg border bg-white`. Active non-blocked rows get `hover:border-gray-300 hover:shadow-sm`; blocked row gets yellow border + 2px yellow left accent; completed rows stay `border-gray-200` (no hover lift).
- **Avatars:** `w-9 h-9` (36px) circles, initials at `text-[10px] font-semibold`, 1px tinted border by status.

**Writing rules (locked):** sentence-case UX copy; named humans, not roles ("Hà Vy", "Thanh Tùng's session"). Badges are the only uppercase. No "playbook" wording. Chrome does not narrate RBAC.

---

## 4. Notes for the redesign pass

**Fixed (must reproduce exactly):**
- The frame: 224px sidebar + 48px topbar + centered `max-w-4xl` main column.
- Region order: page header (Sessions + Create) → filter/search row → vertical list of rows.
- **All** filter selected; all **4 rows** present in the order Thanh Tùng → Minh Lê → Thanh Đức → Anh Thư.
- Every string, count, badge, meta line, and trailing action above — verbatim.
- The three status semantics: blocked (yellow accent + "Waiting on you"), in-progress (neutral, `→` arrow), completed (emerald badge + "View in KG").
- Filter counts (Active 2, Completed 2) and their match to the rows.

**Free (visual treatment, may be re-rendered):**
- Exact spacing rhythm, shadow depth, icon weight/style, avatar treatment, corner radii — as long as tokens above are honored.
- Hover/focus micro-states need not be shown in a static render.
- Whether the right-side metrics block wraps or stays single-line (it is `hidden sm:block`; at 1440px it shows).

> **Capture instruction:** Open the deployed app, go to `/sessions` (default — **All** filter), and attach a full-page 1440×900 screenshot. That screenshot is the positional ground-truth this layout contract describes.
