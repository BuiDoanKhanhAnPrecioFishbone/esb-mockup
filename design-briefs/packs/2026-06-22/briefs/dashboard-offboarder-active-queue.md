# Design brief — Offboarder dashboard · "Active queue" state

> This is the **offboarder's home dashboard** (Minh Lê's view) in the **Active queue** state:
> a deadline banner, three stat tiles, a progress bar, a list of 5 questions waiting to be
> answered, a primary "Open question queue" CTA, and a dimmed "Recently answered" list below.
> **Reproduce this exact screen — do not reinvent.** Match the same regions, order, relative
> positions, proportions, and copy as the screenshot. Re-render only the *visuals* on the
> design-system tokens below. Do not invent, drop, reorder, or move any piece.

- **Source of truth:** `components/mockups/ha-vy-handover-dashboard.jsx` → `OBActiveQueue()` (line 106), reached via `OffboarderStep({ id: "active-queue" })`. Chrome from `components/app/AppShell.tsx`.
- **Capture URL / state:** `/?role=offboarder&state=active-queue` — role = offboarder (Minh Lê), state = `active-queue`. Single state (no tabs).
- **Viewport:** 1440 × 900, light mode only.

---

## 1. Layout contract

Full app frame = fixed left **sidebar (224px)** + a right column with a fixed **topbar (48px)** over a scrolling **main** canvas. The dashboard content is a centered column, **max-width 672px** (`max-w-2xl`), padding 24px (`p-6`), left-aligned within the canvas (canvas is `bg-gray-50`, surfaces `bg-white`).

```
┌────────────┬──────────────────────────────────────────────────────────────┐
│ SIDEBAR    │ TOPBAR  h-12 (48px) · bg-white · border-b · px-4               │
│ w-56       │ ┌──────────────────┐   🔔  [▦ State·Active queue ▾]  [ML  Minh Lê ▾]│
│ (224px)    │ │ 🔍 Search… …  {K       │  flex-1 gap                         │
│ bg-white   │ └───────────────────────┘ (max-w-md)                          │
│ border-r   ├──────────────────────────────────────────────────────────────┤
│            │  MAIN · bg-gray-50 · scrolls                                   │
│ ● ART-EEP  │   ┌──────── centered column · max-w-2xl (672px) · p-6 ──────┐ │
│  (h-12 hd) │   │ ⏱ DEADLINE BANNER (emerald) — full width, mb-4          │ │
│            │   ├──────────────────────────────────────────────────────────┤ │
│ WORKSPACE  │   │ STAT TILES — grid-cols-3 · gap-3 · mb-4                  │ │
│ ▦ Dashboard│   │ [ TO ANSWER 5 ] [ ANSWERED 9 ] [ FILES UPLOADED 2 ]     │ │
│   (active) │   ├──────────────────────────────────────────────────────────┤ │
│ ▣ Sessions │   │ PROGRESS BAR (5px track) ────────────●         9 / 14    │ │
│ ⛓ Knowledge│   ├──────────────────────────────────────────────────────────┤ │
│   graph    │   │ section label: QUESTIONS WAITING FOR YOU · 5            │ │
│ ⚙ Settings │   │ ┌ question card ──────────────────────────────────────┐ │ │
│            │   │ ├ question card ──────────────────────────────────────┤ │ │
│ MORE       │   │ ├ … 5 cards total, space-y-2 ────────────────────────┤ │ │
│ ▦ Design   │   │ └──────────────────────────────────────────────────────┘ │ │
│   states   │   │ [ Open question queue → ]  (violet btn)                  │ │
│            │   │   Opens in Data tab                                      │ │
│            │   ├──────────────────────────────────────────────────────────┤ │
│            │   │ section label: RECENTLY ANSWERED · 9                     │ │
│ ┌────────┐ │   │ ┌ answered card (opacity-50, strikethrough) ──────────┐ │ │
│ │Mockup  │ │   │ ├ answered card ──────────────────────────────────────┤ │ │
│ │playgrnd│ │   │ └──────────────────────────────────────────────────────┘ │ │
│ └────────┘ │   └──────────────────────────────────────────────────────────┘ │
└────────────┴──────────────────────────────────────────────────────────────┘
```

Key measurements (from Tailwind classes):
- Sidebar `w-56` = **224px**, `border-r border-gray-200`, `bg-white`. Logo header `h-12` matches topbar height.
- Topbar `h-12` = **48px**, `bg-white border-b border-gray-200 px-4`, items `gap-4`.
- Search box `h-8` (32px), `max-w-md` (448px), `flex-1`, `rounded-md border bg-gray-50`. Then a `flex-1` spacer pushes the right cluster to the edge.
- Content column `max-w-2xl` = **672px**, `mx-auto`, `p-6` (24px).
- Deadline banner: `rounded-lg border px-4 py-2.5 mb-4`, flex row, icon + text.
- Stat tiles: `grid-cols-3 gap-3 mb-4`; each tile `rounded-lg border bg-white p-3`.
- Progress row: `flex items-center gap-3 mb-4`; track `flex-1 h-[5px] rounded-full bg-gray-200`, fill `bg-violet-500` at **width 64%**; count to the right, mono.
- Question cards: `space-y-2 mt-2`, each `rounded-lg border border-gray-200 bg-white px-4 py-3`.
- CTA: `h-8 px-4 rounded-md bg-violet-600`, mt-3; helper text `mt-1.5`.
- Recently-answered block: `mt-6`; cards `rounded-lg border bg-white px-4 py-3 opacity-50`, `space-y-2 mt-2`.

---

## 2. Content contract

Walk top to bottom. All copy is exact; render **only the offboarder / active-queue branch**.

### A. Sidebar (from AppShell)
- Logo header: small violet dot (`bg-violet-500`, 6px) + **ART-EEP** wordmark (mono, uppercase, letter-spaced).
- Section label **WORKSPACE** (mono, uppercase, gray-400). Nav items, each icon + label, `h-8`:
  - **Dashboard** — active (violet pill: `bg-violet-50 text-violet-700`, violet icon). [LayoutDashboard icon]
  - **Sessions** — inactive gray. [Briefcase icon]
  - **Knowledge graph** — inactive gray. [Network icon]
  - **Settings** — inactive gray. [Settings icon]
- Section label **MORE**:
  - **Design states** — inactive gray. [LayoutGrid icon]
- Footer block (border-top, `text-[11px]`): bold **Mockup playground**, then "Live preview of ART-EEP surfaces. Changes ship via Claude → main → Vercel."

### B. Topbar (from AppShell)
- Search input (left): placeholder **"Search sessions, people, or knowledge"**, leading search icon, trailing key hint **⌘K** (`{K` glyph) in a bordered chip.
- Right cluster (after a flex spacer): **bell** icon button with a rose unread dot (top-right); **State** switcher button [Layers icon] reading **"State"** + bold value **"Active queue"** + chevron; then a left-bordered **user pill** — violet avatar circle "ML", name **Minh Lê**, sub **Offboarder**, chevron.
  - Note: the pill and State switcher reflect the offboarder (Minh Lê / Offboarder, State "Active queue"), matching the offboarder page body below. Reproduce exactly as shown.

### C. Deadline banner (emerald — days = 22, > 14 ⇒ "safe" variant)
- `bg-emerald-50 border-emerald-200 text-emerald-800`, clock icon, text `text-[12px]`:
  - Bold **"22 days"** then **" until your last day · July 4, 2026"**.

### D. Stat tiles (grid of 3, exact values)
Each tile: uppercase mono-ish micro label (gray-500, `text-[10px]` tracking-wider) over a large mono number (`text-xl font-semibold`).
| Label (uppercase) | Value | Number color |
|---|---|---|
| **TO ANSWER** | **5** | rose-600 (urgent) |
| **ANSWERED** | **9** | emerald-600 (good) |
| **FILES UPLOADED** | **2** | gray-900 (normal) |

### E. Progress bar
- Track `bg-gray-200`, fill `bg-violet-500` at **64% width**. Right-aligned mono count **"9 / 14"** (gray-500, `text-[11px]`).

### F. "Questions waiting for you" section
- Section label (uppercase, letter-spaced `tracking-[0.2em]`, gray-500): **"Questions waiting for you"** with a mono **· 5** count suffix.
- Five cards (each links to `/session/minh-le?tab=data`), in this exact order. Card = question text (`text-[13px] text-gray-900`) on top, then a meta row (`text-[11px] text-gray-500`): a source icon + source label + a gray module chip (`text-[9px] px-1.5 py-0.5 rounded bg-gray-100`).
  1. **"What are the undocumented rate limits on the payment API?"** — [User icon] **Coworker** · chip **Payment Service**
  2. **"Is there a runbook for the nightly batch job failures?"** — [User icon] **Coworker** · chip **CI/CD Pipeline**
  3. **"What's the rollback procedure for the Atlas migration?"** — [User icon] **Hà Vy** · chip **CI/CD Pipeline**
  4. **"How does the Kafka retry logic handle poison messages?"** — [Sparkles icon, violet] **AI-generated** · chip **Payment Service**
  5. **"Who owns the vendor XYZ contract renewal?"** — [Sparkles icon, violet] **AI-generated** · chip **Inventory Sync**
  - Icon rule: `fromType: "ai"` → violet **Sparkles**; `fromType: "human"` → **User** outline icon.

### G. Primary CTA
- Violet button (`bg-violet-600`, white, `text-xs font-medium`, `h-8`): **"Open question queue"** + trailing arrow (ArrowRight). Links to `/session/minh-le?tab=data`.
- Helper line below (`text-[10px] text-gray-400`): **"Opens in Data tab"**.

### H. "Recently answered" section (dimmed, `opacity-50`)
- Section label: **"Recently answered"** with mono **· 9** suffix.
- Two cards, each: question text with **line-through** (`text-[13px] text-gray-900 line-through`); meta row with emerald check icon + **"Answered"**, a status chip, and a gray module chip; an italic preview quote (`text-[11px] text-gray-500 italic`); a violet **"See full answer →"** link (`text-[10px] text-violet-600`).
  1. **"Where is the API key rotation doc?"** — ✓ check · **Answered** · green chip **"✓ Satisfied"** (`bg-emerald-50 text-emerald-700`) · gray chip **Shared Libraries**
     Preview: *"Engineering wiki at /security/api-key-rotation.md. Rotates every 90 days via GitHub Action…"*
  2. **"Who should I contact about the SLA penalty terms?"** — ✓ check · **Answered** · plain gray text **"waiting for review"** (not satisfied) · gray chip **Inventory Sync**
     Preview: *"Talk to Linh Phạm in Procurement — she handled the last renewal. SLA doc at /vendor-contracts…"*

---

## 3. Style contract

| Token | Where it's used here |
|---|---|
| **violet** (500/600/700, 50/100) | Active sidebar nav pill, ART-EEP dot, progress-bar fill, "Open question queue" CTA, AI-generated Sparkles icon, "See full answer →" links, focus rings `ring-violet-500/20` |
| **pastel yellow** (50/200/700/800) | Not present in this state (no warnings/gaps surfaced here). Reserve for low-confidence/warning only |
| **rose** (500/600) | "TO ANSWER" value **5** (urgent count), topbar bell unread dot |
| **emerald** (50/200/500/600/700/800) | Deadline banner (safe, >14 days), "ANSWERED" value **9**, answered-card check icon, "✓ Satisfied" chip |
| **muted blue** | Not used here |
| **neutral grays** (gray-50/100/200/400/500/700/900) | Canvas `bg-gray-50`, surfaces `bg-white`, 1px `border-gray-200` hairlines, module chips `bg-gray-100`, secondary text |

Type & writing rules (locked):
- Sans-serif body; **monospace for IDs, timestamps, counts, dates** — applies to stat values, "9 / 14" progress count, and the "· N" count suffixes on section labels.
- Section labels: `text-[10px]` uppercase, `tracking-[0.2em]`, gray-500, with a mono "· count" suffix.
- Stat-tile labels: `text-[10px]` uppercase `tracking-wider` gray-500; values `text-xl font-semibold` mono.
- **32px (`h-8`) button heights.** Explicit focus rings `focus:ring-2 focus:ring-violet-500/20` (CTA uses `/30`).
- 1px `border-gray-200` hairlines; semantic accents only where present (left-accent borders are used on the manager view's cards, not here).
- Light mode only; `bg-gray-50` canvas, `bg-white` cards.
- Sentence-case English UX writing. Named humans, not roles ("Hà Vy", "Coworker", "Minh Lê").
- "Sensitive content" not "PII"; no "playbook" wording (this state has none — keep it that way).

---

## 4. Notes for the redesign pass

**Fixed (do not change):**
- Region order: deadline banner → 3 stat tiles → progress bar → "Questions waiting for you" (5 cards) → CTA + helper → "Recently answered" (2 dimmed cards).
- All copy, the 5 question strings + their source/module/icon mapping, the 2 answered strings + previews, and all counts.
- The dimming treatment on the "Recently answered" block (it is visually de-emphasized vs the active queue).
- The centered single-column layout (`max-w-2xl`), not a multi-column grid (this is the offboarder, not the manager dashboard).
- Sidebar + topbar chrome including the "Minh Lê / Offboarder" pill and "Active queue" State value as shown.

**Free (designer's discretion):**
- Visual treatment of cards (shadow vs hairline, corner radius rhythm), icon weight, exact spacing rhythm, how the progress bar and stat tiles are styled — as long as proportions and the design-system palette hold.

**Cross-checks (must hold):**
- Stat tiles must be internally consistent with the progress bar: **ANSWERED 9** + **TO ANSWER 5** = **14 total**, and the bar reads **9 / 14** at **64%** fill.
- "Questions waiting for you · 5" must list exactly **5** cards; "Recently answered · 9" header count is 9 but only the **2** most-recent cards render here.

---

> **Screenshot:** `design-briefs/packs/2026-06-22/screens/dashboard-offboarder-active-queue.png` is the positional ground-truth this layout contract describes. Treat it as the layout authority where it and the prose differ on placement.
