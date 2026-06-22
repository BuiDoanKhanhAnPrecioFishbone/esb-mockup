# Design brief — Session command view · Deliver · Overview (Manager)

> **What this is:** the manager's review screen right before committing a handover session to the
> Knowledge Graph. It shows session-wide readiness, a per-module readiness table, an unanswered-questions
> warning, and the two terminal actions (Back to Capture / Commit to Knowledge Graph). **Reproduce this
> exact screen — same regions, same order, same relative positions and proportions as the screenshot.
> Do not invent, drop, reorder, or move pieces.** Re-render the visuals on the design system tokens
> below. The screenshot is the layout contract, this outline is the content contract, the tokens are
> the style contract.

- **Source of truth:** `components/mockups/session-command-view.jsx` → renders `DeliverOverview` from `components/mockups/session-deliver.jsx`; chrome from `components/app/AppShell.tsx`
- **Live state captured:** `/session/minh-le?role=manager&step=deliver&tab=overview` · viewport 1440×900, light mode
- **Render trace:** `SessionCommandView` → `phase==="deliver"` → `OverviewContent` → `stepId==="deliver"` returns `<DeliverOverview role="manager" …>` → `role==="manager"` falls through both early returns to the manager branch (the `space-y-4` block with the readiness card + action row).

---

## 1. Layout contract

Full app chrome wraps the page: fixed 224px sidebar (`w-56`) on the left, a 48px topbar (`h-12`) across
the top, and a centered content column. The Overview content column is capped at `max-w-5xl` (1024px)
with `p-6` padding, centered in the remaining viewport.

```
┌────────────┬──────────────────────────────────────────────────────────────────────┐
│ SIDEBAR    │ TOPBAR  h-12  [search ......]      (flex spacer)   🔔  State▾   HV pill │
│ w-56 224px ├──────────────────────────────────────────────────────────────────────┤
│ ●ART-EEP   │                                                                        │
│            │   ┌── max-w-5xl content column · p-6 ─────────────────────────────┐    │
│ WORKSPACE  │   │  HERO CARD  (rounded-lg border bg-white p-4, flex)            │    │
│ ▸Dashboard │   │   [ML avatar 48]  Minh Lê's session  [DELIVER badge]         │    │
│ ▸Sessions* │   │                   Senior Backend Engineer · Engineering       │    │
│ ▸Knowledge │   │                   22d left · 9/14 answered · reviewing (mono) │    │
│  graph     │   └───────────────────────────────────────────────────────────────┘    │
│ ▸Settings  │   ── Tabs row (border-b) ───────────────────────────────────────       │
│            │   [Overview]  Data   Logs        (Overview active: violet underline)    │
│ MORE       │                                                                        │
│ ▸Design    │   ┌── READINESS CARD (rounded-lg border bg-white p-5) ───────────┐     │
│  states    │   │  Session readiness                                           │     │
│            │   │  [▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░] 9/14   (violet bar + mono count)      │     │
│ ┌────────┐ │   │  ┌────────┬────────┬────────┬────────┐  (grid-cols-4 gap-3) │     │
│ │playground│  │   │  │ANSWERED│SATISFIED│ GAPS  │ FILES │                     │     │
│ │ footer  │ │   │  │   9    │   7    │  4/6   │   3   │                       │     │
│ └────────┘ │   │  └────────┴────────┴────────┴────────┘                       │     │
│            │   │  ── border-t ──                                              │     │
│            │   │  Per-module readiness                                        │     │
│            │   │  Payment Service ............ 3/4   2 gaps  [⚠ 1 unanswered] │     │
│            │   │  CI/CD Pipeline ............. 2/2   2 gaps  [✓ Ready]        │     │
│            │   │  Shared Libraries ........... 2/2   0 gaps  [✓ Ready]        │     │
│            │   │  Monitoring & Alerts ........ 0/2   2 gaps  [⚠ 2 unanswered] │     │
│            │   │  Infrastructure as Code ..... 0/2   0 gaps  [⚠ 2 unanswered] │     │
│            │   │  ┌── yellow banner ─────────────────────────────────────┐   │     │
│            │   │  │ ⚠ 5 questions unanswered — they will not be committed │   │     │
│            │   │  └──────────────────────────────────────────────────────┘   │     │
│            │   └───────────────────────────────────────────────────────────────┘    │
│            │                                                                        │
│            │   [⇄ Back to Capture]   [▤ Commit to Knowledge Graph]   (flex gap-3)   │
│            │    outline button         violet-filled button                         │
└────────────┴──────────────────────────────────────────────────────────────────────┘
```

Key measurements (from Tailwind classes):
- Sidebar `w-56` = 224px; logo/topbar rows `h-12` = 48px.
- Content column `max-w-5xl` = 1024px, `mx-auto`, `p-6` = 24px.
- Hero card: `rounded-lg border border-gray-200 bg-white p-4 mb-5`, flex with `gap-4`; avatar `w-12 h-12` = 48px circle.
- Tabs row: `border-b border-gray-200 mb-5`; each tab `px-4 py-2.5`, active tab carries `border-b-2 border-violet-600`.
- Readiness card: `rounded-lg border border-gray-200 bg-white p-5`, vertical rhythm `space-y-4` between it and the action row.
- Metric tiles: `grid grid-cols-4 gap-3 my-3`, each tile `rounded-md bg-gray-50 border px-3 py-2`.
- Per-module rows: `flex items-center gap-2 py-1.5 border-t border-gray-50`, `text-[11px]`; module name takes `flex-1`.
- Action buttons: both `h-9` = 36px, `px-4 rounded-lg`; row is `flex items-center gap-3`.

---

## 2. Content contract

Walk top-to-bottom. Use these EXACT strings, counts, and badges.

**A. Sidebar (AppShell).** Logo dot + `ART-EEP` (mono, letter-spaced). Section label `WORKSPACE` then nav:
Dashboard · **Sessions** (active — violet-50 bg, violet-700 text, since path starts `/session`) · Knowledge graph · Settings.
Section label `MORE` then **Design states**. Footer block: bold `Mockup playground` + "Live preview of ART-EEP surfaces. Changes ship via Claude → main → Vercel."

**B. Topbar (AppShell).** Search input placeholder `Search sessions, people, or knowledge` with a `{K` mono keycap on the right. Flex spacer. Bell icon with a rose unread dot. **State switcher** pill: layers icon + `State` + bold `Deliver (review)` + chevron. **View-as pill:** violet `HV` avatar + two lines `Hà Vy` / `Manager / HR` + chevron.

**C. Hero card.**
- Avatar: violet-100 circle, violet-700 text `ML`.
- Title line: `Minh Lê's session` (text-lg semibold) + DELIVER badge — uppercase, `text-[9px]`, emerald (`bg-emerald-50 border-emerald-200 text-emerald-700`), reading `DELIVER`.
- Subtitle: `Senior Backend Engineer · Engineering`.
- Mono meta line: `22d left · 9/14 answered · reviewing`.

**D. Tabs.** `Overview` (active, violet-600 underline, gray-900 text) · `Data` · `Logs` (both inactive gray-500). All three visible for the manager role.

**E. Readiness card.**
- Heading: `Session readiness` (text-sm semibold).
- Progress bar: violet-500 fill at `round(9/14)=64%` on a gray-200 track, with mono `9/14` to its right.
- Four metric tiles (uppercase mono labels / large mono values):
  | Label | Value |
  |---|---|
  | ANSWERED | `9` |
  | SATISFIED | `7` |
  | GAPS | `4/6` |
  | FILES | `3` |
- Divider, then small-caps label `Per-module readiness`.
- **Per-module table** — five rows, in this exact order. Each row = module name (flex-1) · mono `answered/total` · gray `N gap(s)` · status badge. A module is **Ready** (emerald badge, CheckCircle2 icon) only when answered === total; otherwise a yellow badge reads `{total-answered} unanswered` with an AlertTriangle icon.

  | Module | answered/total | gaps | Badge |
  |---|---|---|---|
  | Payment Service | `3/4` | `2 gaps` | `⚠ 1 unanswered` (yellow) |
  | CI/CD Pipeline | `2/2` | `2 gaps` | `✓ Ready` (emerald) |
  | Shared Libraries | `2/2` | `0 gaps` | `✓ Ready` (emerald) |
  | Monitoring & Alerts | `0/2` | `2 gaps` | `⚠ 2 unanswered` (yellow) |
  | Infrastructure as Code | `0/2` | `0 gaps` | `⚠ 2 unanswered` (yellow) |

- **Unanswered banner** (shown because `14 − 9 = 5 > 0`): yellow strip (`bg-yellow-50 border-yellow-200 text-yellow-800`, AlertTriangle icon), text exactly:
  `5 questions unanswered — they will not be committed.`

**F. Action row** (below the card, `gap-3`):
- **Back to Capture** — outline button (`border-gray-300`, gray-700 text), ArrowLeftRight icon. *Opens the "Reopen Capture?" confirmation modal (separate state — not shown here).*
- **Commit to Knowledge Graph** — primary button, `bg-violet-600` / white text, Database icon. *Opens the "Commit to Knowledge Graph" confirmation modal (separate state — not shown here).*

---

## 3. Style contract

| Token | Where it's used on this screen |
|---|---|
| **violet** (50/100/500/600/700) | Brand dot + active "Sessions" nav, active Overview tab underline, progress-bar fill, `HV` avatar, primary **Commit** button, ML hero avatar |
| **emerald** (50/200/700) | `DELIVER` hero badge, per-module `Ready` badges (CI/CD Pipeline, Shared Libraries) |
| **pastel yellow** (50/200/700/800) | `unanswered` per-module badges, the "5 questions unanswered" warning banner |
| **rose** | Topbar notification unread dot only (no rose content in the body) |
| **gray** (50/100/200/500/900) | Canvas `bg-gray-50`, white surfaces, 1px `border-gray-200` hairlines, metric-tile fills (`bg-gray-50`), row dividers (`border-gray-50`), secondary text |
| **mono** (`ui-monospace, Menlo`) | `ART-EEP` logo, hero meta line, progress count `9/14`, all four metric-tile values, per-module `answered/total` counts, metric-tile uppercase labels |

Type & component rules:
- Light mode only; `bg-gray-50` canvas, `bg-white` cards, 1px hairlines, no shadows on body cards.
- Sentence-case UX writing. Real human name in copy ("Hà Vy will review", "Minh Lê's session") — never role labels in body copy.
- Section labels: `text-[10px]`/`text-[9px]` uppercase, `tracking-wider`, `font-medium`, gray-400/500.
- Buttons: 32–36px height (`h-9` here), `rounded-lg`, explicit focus ring `focus:ring-2 focus:ring-violet-500/20`.
- Status badges: `text-[9px]`, `px-1.5 py-0.5 rounded`, tinted bg + matching 1px border + leading lucide icon (`CheckCircle2` for Ready, `AlertTriangle` for unanswered).
- Per CL-115, the chrome does **not** narrate the user's role for access; the `Manager / HR` pill is the view-as identity, not a permission banner.
- Post-commit destination is the **Knowledge Graph** — never "playbook" (CL-113/116). "Commit to Knowledge Graph" is the exact CTA wording.

---

## 4. Notes for the redesign pass

**Fixed (do not change):**
- Region order: sidebar → topbar → hero card → tabs → readiness card → action row.
- The readiness card's internal order: heading → progress bar → 4 metric tiles → per-module table → unanswered banner.
- The five module rows and their order; the exact counts, gap text, and badge wording in the table above.
- All copy strings, the DELIVER badge, the two CTA labels and their order (Back to Capture left, Commit right).
- This is **review state** — the table is read-only; there are no per-question edit/satisfy controls on Overview (those live in the Data tab).

**Free (redesign latitude):**
- Visual treatment of the progress bar, metric tiles, and badges; spacing rhythm; icon weight; hairline vs. subtle-shadow card styling — as long as the palette roles in §3 hold.
- How the per-module table renders the status badge (pill vs. chip vs. inline) so long as Ready=emerald, unanswered=yellow with the live count.

**Cross-checks (must hold):**
- ANSWERED tile `9` = sum of per-module answered numerators: `3 + 2 + 2 + 0 + 0 = 7`? **No** — the tile shows session-level `S.answered = 9`, which is intentionally higher than the 7 module-question answers because it counts general-question answers too. Do **not** "fix" the tile to match the table; reproduce both as given.
- Unanswered banner count = `S.questions − S.answered = 14 − 9 = 5`. The per-module "unanswered" badges (`1 + 0 + 0 + 2 + 2 = 5`) sum to the same 5 — keep them consistent.
- GAPS tile `4/6` = gaps addressed / total gaps; it is independent of the per-row `N gaps` totals (those count card-gaps + module-gaps per module).

---

> **Screenshot:** the captured PNG at
> `design-briefs/packs/2026-06-22/screens/session-manager-deliver-overview.png` is the positional
> ground-truth this layout contract describes — keep regions in the same relative positions and proportions.
