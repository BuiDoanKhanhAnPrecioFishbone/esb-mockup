# Design brief — Session command view · Manager · Complete step · Overview tab

> **What this is:** the session command view for Minh Lê at the **Complete** step (knowledge committed to the Knowledge Graph), seen from the **Manager** (Hà Vy) perspective, on the **Overview** tab. It's a single calm "you're done" confirmation screen: a success banner, a 4-up commit summary, a one-line "now available to the team" note, and two link buttons. This is the terminal state of the 5-step session flow.
>
> **Reproduce, don't reinvent.** The screenshot is the positional ground-truth. Match the same regions, in the same order, at the same relative positions and proportions. Do not invent, drop, reorder, or move pieces. Re-render the visuals on the design system tokens below — the screenshot is the layout contract, this outline is the content contract, the tokens are the style contract.

- **Source of truth:** `components/mockups/session-command-view.jsx` (route `/session/[id]`), with the Complete-state body in `components/mockups/session-deliver.jsx` → `CompleteOverview` (manager branch). Chrome from `components/app/AppShell.tsx`.
- **Live state captured:** `/session/minh-le?role=manager&step=complete&tab=overview` — role `manager`, step `complete`, tab `overview` · viewport 1440×900, light mode.
- **Render trace:** `SessionCommandView` → `SessionPage` → `HeroBar(phase="deliver", stepId="complete")` (Complete badge variant) → tab row (Overview active) → `OverviewContent(stepId="complete")` → `CompleteOverview(role="manager")` → the **third** `return` in `CompleteOverview` (the manager branch; not the offboarder or coworker branches).

---

## 1. Layout contract

```
┌──────────┬──────────────────────────────────────────────────────────────┐
│ SIDEBAR  │  TOPBAR  h-12 (48px)                                          │
│ w-56     │  [search box ....................]  (🔔) [State: Complete ▾]  │
│ (224px)  │                                          [HV  Hà Vy ▾]        │
│ bg-white │──────────────────────────────────────────────────────────────│
│ border-r │                                                              ▲ │
│          │     main · content max-w-5xl (1024px), mx-auto, p-6 (24px)    │
│ • dot    │   ┌──────────────────────────────────────────────────────┐   │
│ ART-EEP  │   │ HERO BAR  rounded-lg border bg-white p-4, mb-5        │   │
│          │   │ [◯✓]  Minh Lê's session  [COMPLETE]                   │   │
│ WORKSPACE│   │  48px  Senior Backend Engineer · Engineering          │   │
│ Dashboard│   │  emerald 9 committed · 3 files   (mono)               │   │
│ Sessions◀│   └──────────────────────────────────────────────────────┘   │
│ Knowled… │                                                               │
│ Settings │   Overview │ Data │ Logs      ← tab row, border-b, mb-5       │
│          │   ───────                       (Overview active, violet u/l) │
│ MORE     │                                                               │
│ Design…  │   ┌──────────────────────────────────────────────────────┐   │
│          │   │ SUCCESS BANNER  rounded-md emerald-50 border p-3      │   │
│          │   │ [✓] Committed to Knowledge Graph                      │   │
│  (footer │   │     Jun 14, 2026 at 3:42 PM · 487 entries   (mono)    │   │
│   card)  │   └──────────────────────────────────────────────────────┘   │
│ Mockup   │   ┌──────────────────────────────────────────────────────┐   │
│ playgr…  │   │ SUMMARY CARD  rounded-lg border bg-white p-5          │   │
│          │   │ ┌────────┬────────┬────────────┬──────────┐  4 cols   │   │
│          │   │ │COMMITTED│ FILES │GAPS RESOLVED│ EXCLUDED │  gap-3   │   │
│          │   │ │   9    │   3   │     4      │    5     │           │   │
│          │   │ └────────┴────────┴────────────┴──────────┘           │   │
│          │   │ Minh Lê's knowledge is now available to the team…     │   │
│          │   │ [✨ Explore in Knowledge Graph] [Back to dashboard]   │   │
│          │   └──────────────────────────────────────────────────────┘   │
└──────────┴──────────────────────────────────────────────────────────────┘
```

Key measurements (from Tailwind classes):

- **Sidebar** `w-56` = 224px, `border-r border-gray-200`, `bg-white`, full height. Brand row `h-12` (48px). Nav links `h-8` (32px).
- **Topbar** `h-12` = 48px, `bg-white`, `border-b`, `px-4`, flex row, `gap-4`. Search box `h-8` left, flex-spacer, then bell `h-8 w-8`, State switcher `h-8`, View-as pill `h-8`.
- **Main content column** centered: `max-w-5xl` (1024px) `mx-auto`, `p-6` (24px padding). Everything below stacks vertically; nothing is full-bleed.
- **Hero bar** `rounded-lg border border-gray-200 bg-white p-4 mb-5`, flex row, `gap-4`. Avatar circle `w-12 h-12` (48px). Right side: title row, role/dept line, mono metric line.
- **Tab row** flex, `border-b border-gray-200 mb-5`. Each tab `px-4 py-2.5`, `border-b-2`; active tab has `border-violet-600`.
- **Body** (`CompleteOverview` manager branch) is a vertical stack `space-y-4` (16px):
  1. **Success banner** — `rounded-md bg-emerald-50 border border-emerald-200 p-3`, flex row `gap-2`, icon + 2 text lines.
  2. **Summary card** — `rounded-lg border border-gray-200 bg-white p-5`. Inside: a `grid grid-cols-4 gap-3` metric strip, then a note paragraph (`mt-3`), then a button row (`flex gap-3 mt-3`).
- **Metric cards** (`MC`) — each `rounded-md bg-gray-50 border border-gray-200 px-3 py-2`; tiny uppercase label + large mono value.
- **Buttons** in the card are `h-8` (32px), `px-3`, `rounded-md`, small text.
- The page is **short** — all content sits in the upper-left of the content column; large empty canvas below (see screenshot). Do not stretch to fill.

---

## 2. Content contract

Walk top-to-bottom. All copy is **exact** — reproduce verbatim, including the Vietnamese diacritics in "Minh Lê" and "Hà Vy".

### Chrome — sidebar (left, `AppShell`)
- **Brand:** small violet dot + `ART-EEP` in monospace, letter-spaced.
- Section label **WORKSPACE** (uppercase, mono, gray-400), then nav:
  - **Dashboard** (grid icon) → `/`
  - **Sessions** (briefcase icon) → `/sessions` — **active** (violet-50 bg, violet-700 text, violet icon), because the path starts with `/session`.
  - **Knowledge graph** (network icon) → `/knowledge-graph`
  - **Settings** (gear icon) → `/settings`
- Section label **MORE**, then **Design states** (grid icon) → `/states`.
- Footer card: **Mockup playground** / "Live preview of ART-EEP surfaces. Changes ship via Claude → main → Vercel."

### Chrome — topbar (`AppShell`)
- **Search box** (left): placeholder "Search sessions, people, or knowledge", with a `⌘K` hint chip on the right.
- **Bell** notifications button with a small rose dot (unread indicator).
- **State switcher** (Layers icon): label "State" + current value **Complete** + chevron. (This is the topbar control that sets `step=complete`.)
- **View-as pill** (right): violet avatar **HV** + name **Hà Vy** / sub **Manager / HR** + chevron. (This is the role control set to `manager`.)

### Hero bar (`HeroBar`, Complete variant)
- **Avatar:** `w-12 h-12` circle, **emerald** (`bg-emerald-100 text-emerald-700`) with a **CheckCircle2** check icon inside — NOT the violet "ML" initials. The emerald check is the Complete-state signal.
- **Title row:** `Minh Lê's session` (text-lg, semibold) + a status badge **COMPLETE** — tiny uppercase, `border`, emerald tones (`bg-emerald-50 border-emerald-200 text-emerald-700`). (Badge label is literally "Complete" rendered uppercase via `tracking-wider`.)
- **Subtitle line:** `Senior Backend Engineer · Engineering` (12px, gray-500).
- **Metric line (mono, 11px, gray-500):** `9 committed · 3 files`. NOTE: at Complete, the "22d left ·" prefix is **omitted** (only shown pre-complete) — start directly with "9 committed".

### Tab row
- Three tabs: **Overview** · **Data** · **Logs**. **Overview is active** — gray-900 text with a violet-600 underline (`border-b-2`). Data and Logs are inactive (gray-500, no underline). (For manager, no tab is disabled or hidden.)

### Body region 1 — success banner (`CompleteOverview`, manager branch, first child)
- Container: `rounded-md bg-emerald-50 border border-emerald-200 p-3`, flex row, `gap-2`.
- **Icon:** CheckCircle2, `w-4 h-4`, `text-emerald-600`.
- **Line 1 (title):** `Committed to Knowledge Graph` — 12px, font-medium, `text-emerald-800`.
- **Line 2 (mono, 10px, `text-emerald-600`):** `Jun 14, 2026 at 3:42 PM · 487 entries`.

### Body region 2 — commit summary card
- Container: `rounded-lg border border-gray-200 bg-white p-5`.
- **Metric strip:** `grid grid-cols-4 gap-3`, four `MC` cards. Each card = tiny uppercase gray-500 label (9px, tracking-wider) above a large mono semibold value (text-lg). In order:

  | Label (uppercase) | Value | Source |
  |---|---|---|
  | **COMMITTED** | `9` | `SESSION.answered` |
  | **FILES** | `3` | `SESSION.files` |
  | **GAPS RESOLVED** | `4` | `SESSION.gapsAddressed` |
  | **EXCLUDED** | `5` | `SESSION.questions − SESSION.answered` = 14 − 9 |

- **Note paragraph** (`mt-3`, 11px, gray-500): `Minh Lê's knowledge is now available to the team in the Knowledge Graph.`
- **Button row** (`flex gap-3 mt-3`), two buttons, both `h-8 px-3 rounded-md` with small (text-xs) medium-weight labels:
  1. **Explore in Knowledge Graph** — `border border-violet-300 text-violet-700`, hover `bg-violet-50`, with a leading **Sparkles** icon (`w-3 h-3`). **Link target: `/knowledge-graph?prompt=minh-le`.** (This is the primary forward action — it deep-links the graph explorer to Minh Lê's just-committed entries.)
  2. **Back to dashboard** — `border border-gray-300 text-gray-700`, hover `bg-gray-50`, no icon. **Link target: `/`.**

**Not present in this state (do not add):** no progress bar, no per-module readiness list, no "Commit to Knowledge Graph" / "Back to Capture" action buttons, no commit modal, no "questions unanswered" yellow warning. Those belong to the **Deliver** step, not Complete. The Complete manager view is purely a read-only confirmation.

---

## 3. Style contract

Light mode only. `bg-gray-50` page canvas, `bg-white` surfaces, 1px `border-gray-200` hairlines.

| Token | Where it's used here |
|---|---|
| **emerald** (50/100/200/300/400/600/700/800) | The success signal everywhere in this state: hero avatar fill + check, COMPLETE badge, the success banner (bg-50, border-200, title-800, timestamp-600), and the answer "Committed" chips elsewhere. Emerald = verified / committed / done. This screen's defining accent. |
| **violet** (50/300/600/700) | Brand dot + active nav (Sessions) + active Overview tab underline + the "Explore in Knowledge Graph" outline button (border-300/text-700) and its Sparkles icon. AI/brand/primary-action signal. |
| **gray** (50/200/500/700/900) | Neutral structure: card borders, metric-card fills (gray-50), labels (gray-500), body text (gray-700/900), the "Back to dashboard" button. |
| **rose** | Only the tiny unread dot on the notification bell. No other rose on this screen. |
| **yellow** | None on this screen (no gaps/warnings surfaced at Complete). |

Type rules:
- **Sans-serif** body (system UI stack). **Monospace** (`ui-monospace, Menlo, monospace`) for: the `ART-EEP` brand, all nav section labels, the hero metric line (`9 committed · 3 files`), the success-banner timestamp (`Jun 14, 2026 at 3:42 PM · 487 entries`), and every metric-card **value** (`9 / 3 / 4 / 5`). IDs, timestamps, counts, and dates are always mono.
- **Section-label spec:** metric-card labels and nav section headers are `text-[9px]`–`text-[10px]`, `uppercase`, `tracking-wider`, `font-medium`/`font-semibold`, gray-400/500.
- **Buttons:** card action buttons are 32px tall (`h-8`); chrome controls (search, bell, state, view-as) are also `h-8`. Explicit focus rings elsewhere use `focus:ring-2 focus:ring-violet-500/20`.
- **Badges:** `text-[9px]`, `px-2 py-0.5`, `rounded`, `uppercase tracking-wider`, `border` — the COMPLETE badge follows this.

Writing rules (locked):
- Sentence-case English UX writing. Named humans, not roles — "Minh Lê's knowledge", "Hà Vy" — never "the offboarder" / "your manager".
- "Knowledge Graph" is the post-commit destination (title case). No "playbook" wording anywhere (CL-113/116). Chrome does not announce the user's role beyond the neutral view-as pill (CL-115).

---

## 4. Notes for the redesign pass

**Fixed (reproduce exactly):**
- Region order: chrome → hero bar → tab row → success banner → summary card (metrics → note → buttons). Two buttons in that left-to-right order.
- All copy, the four metric labels + values (`9 / 3 / 4 / 5`), the timestamp string, and the `487 entries` count.
- The two link targets: **Explore in Knowledge Graph → `/knowledge-graph?prompt=minh-le`**, **Back to dashboard → `/`**.
- Emerald as the success accent on the hero avatar/badge and banner; the hero avatar shows a **check icon**, not the "ML" initials.
- Overview tab active; Sessions nav active. State switcher reads "Complete", view-as reads "Hà Vy / Manager / HR".
- The page is short — content top-aligned in the centered column with generous empty canvas below. Don't pad it out to full height.

**Free (visual treatment may be reinterpreted):**
- Exact spacing rhythm, shadow depth, corner-radius scale, icon weight/style, and the precise emerald shade — as long as the design-system palette and the emerald-success semantic are preserved.
- Metric-card internal layout (label-over-value) may be restyled, but keep the 4-up grid and mono values.

**Cross-checks:**
- The four metric numbers come from one `SESSION` object: COMMITTED 9 = answered; EXCLUDED 5 = questions(14) − answered(9); so **COMMITTED + EXCLUDED = 14** (total questions). FILES 3 and GAPS RESOLVED 4 are independent. Keep these consistent if any number is edited.
- The hero metric line ("9 committed · 3 files") must match the COMMITTED and FILES cards.

---

> **Screenshot:** the attached capture of `/session/minh-le?role=manager&step=complete&tab=overview` (deployed app, 1440×900, light mode) is the positional ground-truth this layout contract describes.
