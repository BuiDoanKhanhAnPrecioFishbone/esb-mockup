# Design brief — Knowledge Graph explorer · `knowledge-graph-default`

> **What this is:** the default landing view of the ART-EEP Knowledge Graph explorer — a
> force-directed graph of the Engineering knowledge map (department hub + 7 module spokes,
> collapsed), wrapped in the shared AppShell, with a filter row above the canvas and an AI
> Copilot chat bar with Quick Start chips below it. No node is selected, no module is expanded,
> no Copilot answer is showing — this is the cold-open resting state.
>
> **Reproduce, don't reinvent.** Rebuild this *exact* screen — same regions, same order, same
> relative positions and proportions as the attached screenshot. Do not invent, drop, reorder,
> or move pieces. Re-render the visuals on the design system tokens below. The screenshot is the
> layout contract; this outline is the content contract; the token table is the style contract.
> The graph node *positions* are physics-driven and free; everything else (chrome, filters,
> chips, legend, copy, counts) is fixed.

- **Source of truth:** `components/mockups/knowledge-graph-explorer.jsx` (embedded in `components/app/AppShell.tsx`)
- **Route / capture URL:** `/knowledge-graph` (no query params; the `?prompt=` from-session entry is *not* active in this state)
- **Live state captured:** default load — `selected=null`, `expanded={}` (empty), `chatFocus=null`, `chatResponse=""`, all filters `all`. Side panel collapsed (canvas full-width).
- **Viewport:** 1440×900, light mode.

---

## 1. Layout contract

```
┌──────────┬──────────────────────────────────────────────────────────────────────┐
│ SIDEBAR  │ TOPBAR  h-12 (48px)  white, border-b                                   │
│ w-56     │ [search box ········· {K]            (flex-1 spacer)   [🔔] [HV pill ▾] │
│ (224px)  ├──────────────────────────────────────────────────────────────────────┤
│ white    │ MAIN — KnowledgeGraphExplorer (embedded, p-4)                          │
│ border-r │                                                                        │
│ ●ART-EEP │  ── header row (mb-2) ────────────────────────────────────────────┐   │
│          │  [✦] Knowledge Graph                          [Expand all] [Reset] │   │
│ WORKSPACE│      Engineering · 7 modules · 19 entries · 42 relationships       │   │
│ ▣ Dash   │  ───────────────────────────────────────────────────────────────────  │
│ ▣ Sess   │  ── filter row (mb-2) ────────────────────────────────────────────┐   │
│ ▣ Know.  │  ⛢ Status [All][Verified][Draft] | Contributor [All][Minh Lê]      │   │
│   graph  │            [Thanh Đức] | [Has gaps]                                │   │
│ ▣ Set    │  ───────────────────────────────────────────────────────────────────  │
│          │  ┌── GRAPH CANVAS (flex-1, w-full) ──────────────────────────────┐ │   │
│ MORE     │  │ bg-gray-50, rounded-lg, border, grab cursor                   │ │   │
│ ▣ Design │  │                                                               │ │   │
│   states │  │            ◦ Payment Processing                               │ │   │
│          │  │     ◦ Infra…      ◦ Auth & Identity                           │ │   │
│ ┌──────┐ │  │            ( Eng )  ← dept hub, centered                      │ │   │
│ │Mockup│ │  │   ◦ Rate Limiting   Engineering   ◦ Database & Migrati…       │ │   │
│ │play- │ │  │            ◦ Monitoring  ◦ CI/CD & Deployments                │ │   │
│ │ground│ │  │                                                               │ │   │
│ │ (N)  │ │  │ [legend pill ⌄ bottom-left]                                   │ │   │
│ └──────┘ │  └───────────────────────────────────────────────────────────────┘ │   │
│          │  ── chat bar (mt-2) white, border, rounded-lg, px-3 py-2 ──────────┐  │
│          │  [✦ AI Copilot][Show risks][Critical paths][Auth flow][Deploy …]   │  │
│          │  [ Ask about the knowledge graph…              ] [✈ Send]          │  │
│          │  ─────────────────────────────────────────────────────────────────────│
└──────────┴──────────────────────────────────────────────────────────────────────┘
```

**Measurements (from Tailwind classes):**

- **Sidebar** `w-56` = 224px, `border-r border-gray-200`, white. Logo bar `h-12` (48px). Nav items `h-8` (32px).
- **Topbar** `h-12` = 48px, white, `border-b`. Search box `h-8` (32px), `max-w-md` (~448px), `flex-1`.
- **Main** is the embedded explorer with outer `p-4` (16px) padding, `flex flex-col h-full`.
- **Header row** `mb-2`: 32px violet logo tile (`w-8 h-8 rounded-lg`) + title block on the left; two buttons on the right.
- **Filter row** `mb-2`, `gap-3`, three groups separated by thin `|` dividers (`text-gray-200`).
- **Graph canvas** `flex-1 min-h-0`, **`w-full`** in this state (because nothing is selected; when a node is selected it shrinks to `w-3/5` and a `w-2/5` side panel appears — NOT in this view). `bg-gray-50 rounded-lg border border-gray-200`, `overflow-hidden`. Cursor `grab`.
- **Side panel:** ABSENT in this default state. Reserve the right ~40% of the canvas row as latent space but render it as part of the full-width canvas.
- **Legend pill:** absolutely positioned `bottom-2 left-2`, `bg-white/80 backdrop-blur` rounded, `px-2 py-1`.
- **Chat bar** `mt-2`, full width of main, white `border rounded-lg`, `px-3 py-2`. Two rows: chip row (`mb-1.5`) then input + Send. (The violet Copilot answer card sits above the chip row only when an answer exists — NOT in this state.)

---

## 2. Content contract

Walk top-to-bottom. All strings are exact.

### Sidebar (AppShell)
- Logo: violet dot + **`ART-EEP`** (monospace, letter-spaced).
- Section label **`WORKSPACE`** (uppercase, mono, gray-400), then nav items:
  - `Dashboard`, `Sessions`, **`Knowledge graph`** (ACTIVE — violet-50 bg, violet-700 text, violet-600 icon), `Settings`.
- Section label **`MORE`**, then `Design states`.
- Footer block: **`Mockup playground`** / `Live preview of ART-EEP surfaces. Changes ship via Claude → main → Vercel.`
- (Screenshot shows a circular `N` avatar bottom-left over the footer — environment/preview badge, not part of the component.)

### Topbar (AppShell)
- Search box, placeholder **`Search sessions, people, or knowledge`**, trailing key hint **`{K`** (rendered from `&lcub;K`).
- Spacer, then bell icon with a rose unread dot (`bg-rose-500`).
- *(StateSwitcher is hidden here — `/knowledge-graph` has ≤1 view state, so it does not render.)*
- User pill: violet circle initials **`HV`** + **`Hà Vy`** / **`Manager / HR`**, chevron. (Role label is the default `manager`.)

### Header row (explorer)
- Violet rounded tile with white `Sparkles` icon.
- Title **`Knowledge Graph`** (sm, semibold).
- Subtitle (gray-500, 11px): **`Engineering · 7 modules · 19 entries · 42 relationships`**
  - Counts are computed: 7 module nodes, 19 `type:"entry"` nodes, 42 edges. (Middots are real `·`.)
- Right buttons:
  - **`Expand all`** — violet-700 text on violet-50, `rounded-md`.
  - **`Reset`** — gray-600 on gray-100, `rounded-md`.

### Filter row (explorer) — all chips in their DEFAULT (resting) state
Pill chips `rounded-full`, 10px font. Active = violet-600 fill + white text; inactive = white + gray-600 + gray-200 border.
- `Filter` icon (gray-400) + label **`Status`** then chips: **`All`** (ACTIVE), `Verified`, `Draft`.
- Divider `|`.
- Label **`Contributor`** then chips: **`All`** (ACTIVE), `Minh Lê`, `Thanh Đức`.
- Divider `|`.
- Chip **`Has gaps`** (inactive).
- *(The `Clear filters` link is HIDDEN because no filter is active.)*

### Graph canvas (explorer) — collapsed default
Only depth ≤ 1 nodes are visible (no module is expanded, so no entry/system nodes show, and no edges between hidden nodes). One center hub + 7 spokes:
- **Center hub:** large gray circle (`r=28`, fill `#f4f4f5`, stroke `#d4d4d8`) with centered label **`Eng`** inside and the caption **`Engineering`** below it.
- **7 module nodes** in a ring around the hub (smaller violet circles `r=18`, fill `#f5f3ff`, stroke `#c4b5fd`, each showing a centered **`+`** glyph in violet meaning "expand", with the label below). Labels (>20 chars truncate to 18 + `…`):
  - `Payment Processing`
  - `Auth & Identity`
  - `Database & Migrati…` (full: `Database & Migrations`)
  - `CI/CD & Deployments`
  - `Monitoring`
  - `Rate Limiting & API`
  - `Infrastructure as …` (full: `Infrastructure as Code`)
- **Edges:** 7 solid thin gray hierarchy lines from hub to each module. (No dashed cross-links visible in collapsed state — they connect entry-level nodes that are hidden.)
- **No tooltip, no selection ring** in resting state (those appear only on hover/click).

### Legend pill (bottom-left of canvas)
Single row, 9px gray-400 text, each with a colored dot:
- `●` gray (`bg-gray-200`) **`Structural`**
- `●` violet (`bg-violet-100`) **`Knowledge`**
- `●` yellow (`bg-yellow-100`) **`Gap`**
- `●` rose (`bg-rose-100`) **`Reported`**
- `|` divider, then **`Solid = hierarchy`**  **`Dashed = cross-link`**

### Chat bar (explorer) — bottom, resting state
- **(No violet answer card** — `chatResponse` is empty in this state.)
- Chip row: leading badge **`✦ AI Copilot`** (violet-50 bg, violet-100 border, violet-700 text, Sparkles icon), then 5 Quick Start chips (`rounded-full`, all inactive/white):
  - **`Show risks`**
  - **`Critical paths`**
  - **`Auth flow`**
  - **`Deploy pipeline`**
  - **`Incident response`**
- Input row: text input, placeholder **`Ask about the knowledge graph...`** (gray-50 bg, gray-200 border) + violet **`Send`** button with paper-plane (`Send`) icon (violet-600, white text).

---

## 3. Style contract

Light mode only. `bg-gray-50` canvas, `bg-white` surfaces, 1px `border-gray-200` hairlines.

| Token | Where it's used in this screen |
|---|---|
| **violet-600 / 700** | AI/Copilot signal — header logo tile, `AI Copilot` badge, active filter chips, Send button, active nav item, `+` glyph on module nodes, `Expand all`. Violet is the AI/brand accent throughout. |
| **violet-50 / 100 / 200** | Module node fill (`#f5f3ff`) + stroke (`#c4b5fd`), active-nav background, Copilot badge background, soft chip hovers, the (latent) Copilot answer card. |
| **gray (zinc) neutrals** | Department hub fill `#f4f4f5` / stroke `#d4d4d8`; canvas `bg-gray-50`; structural hierarchy edges; body text gray-600/700/900; inactive chips. |
| **pastel yellow** | Knowledge **gap** signal — legend `Gap` dot, gap node fill `#fef9c3` / stroke `#facc15`. (No gap node is visible at depth ≤1, but the legend swatch and `Has gaps` filter use it.) |
| **rose** | Critical/reported signal only — topbar unread bell dot, legend `Reported` dot. Reserved for urgency/corrections. |
| **emerald** | Verified/canonical accent (not surfaced in this collapsed state; appears in side-panel report flow). |
| **muted blue** | Entity badges for projects/products — not present on this surface. |

**Type rules:**
- Body sans-serif (`Inter` / system-ui). Tight scale: title 14px (`text-sm`), subtitle/labels 11px, filter chips & legend 9–10px, node labels 9–11px by depth.
- **Monospace** for the `ART-EEP` logo, nav section labels (`WORKSPACE`/`MORE`), the `{K` search hint, and any IDs/timestamps/counts. The middot-separated count line (`7 modules · 19 entries · 42 relationships`) reads as stats.
- Sentence-case English UX writing. Named humans (`Minh Lê`, `Thanh Đức`, `Hà Vy`) — Vietnamese diacritics must be exact.

**Buttons / controls:**
- 32px control heights in chrome (`h-8`); compact `py-1`/`py-1.5` buttons inside the explorer.
- `rounded-md` buttons, `rounded-full` filter/Quick-Start chips, `rounded-lg` cards/canvas.
- Explicit focus rings: `focus:ring-2 focus:ring-violet-500/20` on chrome; `focus:ring-1 focus:ring-violet-500/20` on the chat input.

**Writing rules (locked):** content is "Knowledge Graph entries" (no "playbook"). Chrome does not announce role beyond the neutral user pill. "Knowledge gap" not "missing PII".

---

## 4. Notes for the redesign pass

**Fixed (do not change):**
- Region order and proportions: sidebar → topbar → header row → filter row → full-width canvas → chat bar.
- All copy, chip labels, filter labels, placeholders, legend text, and the subtitle counts exactly as listed.
- The collapsed hub-and-spoke topology: 1 `Eng` hub + 7 named modules + 7 hierarchy edges, nothing else visible.
- The default chip/filter states: `Status=All`, `Contributor=All`, `Has gaps` off; no Copilot answer card; no side panel.
- Violet = AI/Copilot signal; the legend's four-color semantic mapping.

**Free (visual treatment only):**
- **Node X/Y positions are physics-driven (force-directed) and non-deterministic** — match the *region* (hub centered, modules ringed around it) and relative scale (hub bigger than modules), not exact coordinates. The screenshot shows one settled frame; don't pixel-match node placement.
- Edge curvature, exact spacing rhythm, icon stroke weight, shadow depth, backdrop-blur intensity.

**Cross-checks:**
- Subtitle counts must stay self-consistent with what's drawn: **7 modules** (= 7 spokes), **19 entries** (hidden at this zoom), **42 relationships** (only 7 hierarchy edges are visible now; the other 35 connect hidden entry/system nodes).
- Module count in the ring (7) must equal the `7 modules` in the subtitle and the node count `Expand all` would reveal.
- Exactly one node carries an inner label glyph that is NOT `+`: the `Eng` hub. All 7 modules show `+`.

---

> **Screenshot:** the attached `/knowledge-graph` capture (1440×900, light mode) is the
> positional ground-truth this layout contract describes. Reproduce that frame; treat node
> coordinates as approximate (force-directed), but keep every other region, label, and count fixed.
