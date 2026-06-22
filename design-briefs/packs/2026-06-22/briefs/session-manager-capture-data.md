# Design brief — Session command view · Manager · Capture · Data tab

> **What this is.** The deep "Data" tab of a single handover session, seen by the Manager
> (Hà Vy) while the session is in the **Capture (active)** step. It is a dense, scrollable
> column: a general-question composer, a violet "General questions" panel, then two
> Trello-board groups (**Backend Services**, **Platform Infrastructure**), each expanded into
> module accordions whose rows are individual knowledge cards with status glyphs, gap markers,
> and per-card question counts. Clicking any card opens a 480px right-side detail panel (not in
> the captured screenshot — panel is closed by default).
>
> **Reproduce, don't reinvent.** The screenshot is the positional ground-truth. Re-render the
> exact same regions, in the same order, at the same relative proportions. Do not invent, drop,
> reorder, or relabel any board, module, card, badge, count, or icon. Keep every string and
> number verbatim. Restyle visuals onto the design-system tokens below — nothing else.

- **Source of truth:** `components/mockups/session-command-view.jsx`
  (chrome from `components/app/AppShell.tsx`)
- **Render path:** `SessionCommandView` → `SessionPage` (`initialTab="data"`) →
  `DataContent` (capture branch) → per-board `ModuleSection` rows. Role `manager`, step
  `capture`, tab `data`.
- **Live state captured:** `/session/minh-le?role=manager&step=capture&tab=data` ·
  viewport 1440×900, light mode.
- **State resolution:** `phase="capture"`, `isReady=true`, `readOnly=false`,
  `showAnswers=true`, `showProgress=true`, `canEditQs=false` (edit/delete pencils suppressed —
  only Prepare allows them). Manager sees all three tabs; `Upload`/`Rename` module affordances
  are visible (manager + not read-only).

---

## 1. Layout contract

Full-app chrome (AppShell) wraps a centered content column.

```
┌──────────┬────────────────────────────────────────────────────────────────┐
│ SIDEBAR  │ TOPBAR  h-12 (48px) ─────────────────────────────────────────── │
│ w-56     │ [search box ~max-w-md] ········· [🔔] [State: Capture(active) ▾] │
│ (224px)  │                                            [HV · Hà Vy ▾]        │
│ bg-white ├────────────────────────────────────────────────────────────────┤
│          │  MAIN  bg-gray-50, content = max-w-5xl (1024px) mx-auto, p-6     │
│ • ART-EEP│  ┌──────────────────────────────────────────────────────────┐  │
│          │  │ HERO BAR  rounded-lg border bg-white p-4, flex gap-4      │  │
│ WORKSPACE│  │ [ML avatar 48px] Minh Lê's session  [CAPTURE pill]        │  │
│ Dashboard│  │                  Senior Backend Engineer · Engineering    │  │
│ Sessions◀│  │                  22d left · 9/14 answered · 7 satisfied   │  │
│ Knowledge│  └──────────────────────────────────────────────────────────┘  │
│ Settings │  ── Tab bar: Overview | [Data] | Logs  (border-b, active=violet)│
│          │  ┌──────────────────────────────────────────────────────────┐  │
│ MORE     │  │ [ Ask a general question…  h-9 input ]          [ Ask ]   │  │
│ Design   │  └──────────────────────────────────────────────────────────┘  │
│  states  │  ┌── General questions  (violet panel) ─────────────────  2 ─┐ │
│          │  │  Q row … (answered → emerald-left answer block)            │ │
│          │  │  Q row …                                                   │ │
│          │  └──────────────────────────────────────────────────────────┘ │
│          │  ┌── ▦ Backend Services                              34c ─────┐ │
│          │  │  ▾ Payment Service 12c [4Qs][2gaps][3/4]   ⬆Upload  Rename│ │
│          │  │      ⚠ module-gap banner (yellow, pl-10)                   │ │
│          │  │      ✓ 📄 Kafka retry configuration            📎 gap 2Q   │ │
│          │  │      ○ 📄 Payment gateway timeout                      1Q  │ │
│          │  │      … card rows … + Ask about this module                │ │
│          │  │  ▾ CI/CD Pipeline 8c [3Qs][2gaps][2/2]                     │ │
│          │  │  ▾ Shared Libraries 6c [2Qs][2/2]                          │ │
│          │  └──────────────────────────────────────────────────────────┘ │
│          │  ┌── ▦ Platform Infrastructure                      18c ─────┐ │
│ Mockup   │  │  ▾ Monitoring & Alerts 10c [3Qs][2gaps][0/2]               │ │
│ playgrnd │  │  ▾ Infrastructure as Code 8c [2Qs][0/2]                    │ │
│ footer   │  └──────────────────────────────────────────────────────────┘ │
└──────────┴────────────────────────────────────────────────────────────────┘
```

Key measurements (from Tailwind classes):

- **Sidebar** `w-56` = 224px, `border-r border-gray-200 bg-white`, hidden below `md`. Brand
  row `h-12`. Footer block pinned bottom.
- **Topbar** `h-12` = 48px, `bg-white border-b`, `px-4`, `flex items-center gap-4`. Search box
  `h-8` `max-w-md flex-1`; then spacer, bell `h-8 w-8`, State switcher `h-8`, View-as pill `h-8`.
- **Content column** `max-w-5xl` (1024px) `mx-auto p-6` (24px).
- **Hero bar** `rounded-lg border border-gray-200 bg-white p-4 mb-5`, `flex items-center gap-4`;
  avatar `w-12 h-12` rounded-full.
- **Tab bar** `flex border-b border-gray-200 mb-5`; each tab `px-4 py-2.5 text-sm font-medium
  border-b-2`. Active = `border-violet-600 text-gray-900`; inactive = `border-transparent
  text-gray-500`.
- **General-question composer** `mb-4 flex gap-2`: input `h-9 flex-1 rounded-lg border`, Ask
  button `h-9 px-3 rounded-lg bg-violet-600`.
- **General questions panel** `rounded-lg border border-violet-200 bg-violet-50/20 mb-3`; header
  `px-4 py-2.5 bg-violet-50/40 border-b border-violet-200`. Each Q row `px-4 py-2.5 border-b
  border-violet-100`.
- **Board card** `rounded-lg border border-gray-200 bg-white mb-3 overflow-hidden`; board header
  `px-4 py-2.5 bg-gray-50 border-b border-gray-200`.
- **Module header button** `w-full px-4 py-2`, `flex items-center justify-between`; chevron
  rotates (`-rotate-90` when collapsed; all expanded here).
- **Module gap banner** `px-4 py-2 pl-10` (indented to card column), yellow chip.
- **Card row** `w-full px-4 py-2 pl-10` (40px left indent), `flex items-center gap-2`, top
  hairline `border-t border-gray-50`. Selected = `bg-violet-50 border-l-2 border-l-violet-500`.
- **Right side panel** (closed in screenshot): `fixed top-0 right-0 h-full w-[480px] bg-white
  border-l shadow-xl`, behind a `bg-black/10` scrim. Only appears on card click.

---

## 2. Content contract

Top-to-bottom, exact copy / counts / badges / icons.

### Chrome (AppShell)
- **Sidebar brand:** violet 1.5px dot + `ART-EEP` (mono, tracking-wide).
- **Sidebar nav** — section label `WORKSPACE`: Dashboard, **Sessions** (active, violet pill —
  matches `/session`), Knowledge graph, Settings. Section label `MORE`: Design states.
- **Sidebar footer:** "Mockup playground" / "Live preview of ART-EEP surfaces. Changes ship via
  Claude → main → Vercel."
- **Topbar:** search placeholder "Search sessions, people, or knowledge" + `⌘K` hint chip; bell
  with rose unread dot; **State switcher** showing `State` · **Capture (active)**; View-as pill
  `HV` / "Hà Vy" / "Manager / HR".

### Hero bar
- Avatar circle `ML` (violet-100 / violet-700).
- Title **Minh Lê's session** + uppercase pill **CAPTURE** (violet-50/violet-200/violet-700).
- Subtitle: `Senior Backend Engineer · Engineering`.
- Mono meta line: `22d left · 9/14 answered · 7 satisfied`.

### Tab bar
`Overview` · **Data** (active, violet underline) · `Logs`.

### General-question composer (above the panel)
- Input placeholder: `Ask a general question…`  · button label: **Ask** (violet).

### General questions panel  — header count **2**
Icon: `MessageCircle` (violet). Label **General questions**, count `2`.

1. **What's the process for handling customer escalations?**
   - from line: 👤 `Coworker`
   - Answer block (emerald-left, gray-50): meta `Minh Lê · 1d ago`, body
     "On-call engineer first. P1: page lead via PagerDuty. Engineering provides RCA within 24h."
   - Below answer (manager, not read-only, already satisfied): emerald line
     ✓ `Satisfied by Hà Vy · 3h`.
2. **Are there any undocumented vendor agreements I should know about?**
   - from line: 👤 `Hà Vy`
   - No answer yet → no answer block, no input (input only shows for offboarder).
   - canEdit=false → **no** pencil/trash on hover.

### Board group 1 — `▦ Backend Services`  ·  count `34c`
Header icon `Layers` (gray-400). Three module accordions, all expanded:

**Module · Payment Service** — `12c` · `4Qs` (violet pill) · `2gaps` (yellow pill) · `3/4`
(gray progress pill) · right side: `⬆ Upload`  `Rename` (gray, hover-violet).
- Module-gap banner (yellow, Sparkles icon): "No disaster recovery or failover procedures documented"
- Card rows (status glyph · 📄 · name · trailing chips):
  - ✓(emerald) `Kafka retry configuration` — 📎 · `gap` · `2Q`
  - ○(gray) `Payment gateway timeout` — `1Q`
  - ✓(emerald) `Stripe webhook handler` — `1Q`
  - —(gray dash) `Refund reconciliation` — (no chips)
  - —(gray dash) `Currency conversion` — (no chips)
- Footer link: `+ Ask about this module` (violet).

**Module · CI/CD Pipeline** — `8c` · `3Qs` · `2gaps` · `2/2`  ·  `⬆ Upload  Rename`
- Module-gap banner: "Deployment described differently across modules"
- Cards:
  - ✓ `Atlas migration rollback` — `gap` · `1Q`
  - ✓ `GitHub Actions workflow` — `1Q`
  - — `Docker image caching` — (no chips)
- `+ Ask about this module`

**Module · Shared Libraries** — `6c` · `2Qs` · `2/2` (no gap pill — gaps=0)  ·  `⬆ Upload  Rename`
- No module-gap banner.
- Cards:
  - ✓ `API key rotation` — 📎 · `1Q`
  - — `Logging middleware` — (no chips)
  - ✓ `Auth token validator` — `1Q`
- `+ Ask about this module`

### Board group 2 — `▦ Platform Infrastructure`  ·  count `18c`
Two module accordions, expanded:

**Module · Monitoring & Alerts** — `10c` · `3Qs` · `2gaps` · `0/2`  ·  `⬆ Upload  Rename`
- Module-gap banner: "SLA commitments undocumented"
- Cards:
  - ○ `Datadog dashboard` — `gap` · `1Q`
  - — `PagerDuty escalation` — 📎 (no Q chip)
  - ○ `Log aggregation` — `1Q`
- `+ Ask about this module`

**Module · Infrastructure as Code** — `8c` · `2Qs` · `0/2` (no gap pill)  ·  `⬆ Upload  Rename`
- No module-gap banner.
- Cards:
  - ○ `Terraform modules` — `1Q`
  - ○ `Helm chart templates` — `1Q`
  - — `Secrets management` — (no chips)
- `+ Ask about this module`

**Card status glyph legend** (capture mode, `cardStatus`): ✓ emerald `CheckCircle2` = all its
questions answered; ○ gray circle = has unanswered questions; — gray dash = has no questions.
**Trailing chips per card:** 📎 (`Paperclip`, gray-300) if files attached; `gap` (tiny yellow
chip) if the card has gaps; `NQ` (tiny violet chip) = number of questions on the card.

---

## 3. Style contract

| Token | Where it is used on this screen |
|---|---|
| **violet** (50/100/200/500/600/700) | brand dot + active "Sessions" nav; active Data tab underline (`border-violet-600`); General-questions panel border/bg (`violet-200` / `violet-50/20`); `Ask` buttons (`bg-violet-600`); `NQs` module pill and `NQ` card chip; `+ Ask about this module` link; selected card `bg-violet-50 border-l-violet-500`; CAPTURE hero pill |
| **pastel yellow** (50/100/200/600/700/800) | knowledge-gap signals only: module-gap banner (`bg-yellow-50 border-yellow-200 text-yellow-800` + yellow Sparkles), module `Ngaps` pill (`yellow-50/700/200`), card `gap` chip (`yellow-50/700`) |
| **emerald** (300/400/500/700) | verified/answered: card status ✓ (`text-emerald-500`); answer block 2px left accent (`border-emerald-400`); `Satisfied by …` line (`text-emerald-600`); satisfied/done progress pill (`emerald-50/700/200`) |
| **rose** | only the bell unread dot (`bg-rose-500`). No rose content in the data column. |
| **neutral grays** | `bg-gray-50` canvas + board-header strip; `bg-white` surfaces; `border-gray-200` 1px hairlines; `border-gray-50` row separators; gray-400 layer/file/chevron icons; gray-300 `—` dash and dim paperclip |

Type & writing rules (locked design system):
- **Mono** (`ui-monospace, Menlo`) for IDs/timestamps/counts/meta: hero meta line, log times,
  the `ART-EEP` brand, section labels, the `⌘K` chip. Body is sans-serif.
- Tiny labels are `uppercase tracking-wider font-medium text-[10px] text-gray-500`.
- Buttons: 32px-ish heights (`h-8`/`h-9`), `rounded-lg`, explicit focus rings
  `focus:ring-2 focus:ring-violet-500/20`. Primary = `bg-violet-600 hover:bg-violet-700 text-white`.
- Sentence-case English UX writing; named humans, not roles ("Satisfied by Hà Vy", "Minh Lê",
  "Coworker"). "Sensitive content" not "PII"; no "playbook" wording.
- **Chrome is role-neutral (CL-115):** topbar reads `ART-EEP` / neutral; it does not announce
  RBAC. The View-as pill is a mockup preview affordance, not product chrome.
- Light mode only, `bg-gray-50` canvas, `bg-white` surfaces, 1px gray-200 hairlines, 2px
  semantic left accents (emerald answer / violet selected card).

---

## 4. Notes for the redesign pass

**Fixed (must reproduce exactly):**
- Region order: chrome → hero → tabs → general-Q composer → General questions panel → Backend
  Services group → Platform Infrastructure group. Data tab is the active tab.
- The two board groups and their five modules, in this order, with these exact `Nc` counts:
  Backend Services `34c` (Payment Service `12c`, CI/CD Pipeline `8c`, Shared Libraries `6c`);
  Platform Infrastructure `18c` (Monitoring & Alerts `10c`, Infrastructure as Code `8c`).
- Every card row, its status glyph, its gap/file/`NQ` chips, and the per-module pill set
  (`NQs` / `Ngaps` / `answered/total`), verbatim.
- All copy: question text, answer body, "Satisfied by …" line, module-gap banner strings.
- In this state: **no** edit/delete pencils (canEditQs=false); `Upload`/`Rename` **are** shown;
  the right side panel is **closed**; answer blocks **are** shown (showAnswers=true).

**Free (restyle at will):** exact spacing rhythm, icon weight/style, chip corner radius, hover
treatments, shadow depth, the visual texture of the violet panel vs white board cards — as long
as the semantic color roles in §3 are preserved.

**Cross-checks (numbers must stay consistent):**
- Hero `9/14 answered · 7 satisfied` is the session roll-up. The five module progress pills are
  `3/4 + 2/2 + 2/2 + 0/2 + 0/2` → **7 / 12** card-question answers — this is the subset surfaced
  on cards and intentionally smaller than the 9/14 session total (general + module-level Qs are
  counted in the hero, not on cards). Keep both as-is; do not "fix" them to match.
- Module `Ngaps` pill = card-level gaps + module-level gap banners. Payment Service `2gaps` =
  1 card gap (Kafka checklist) + 1 module banner. CI/CD `2gaps` = 1 (Atlas) + 1 banner.
  Monitoring `2gaps` = 1 (Datadog) + 1 banner. Shared Libraries and Infrastructure as Code have
  0 gaps → **no** yellow pill and **no** banner.
- A card shows the `gap` chip iff it has card-level gaps: Kafka, Atlas, Datadog only.
- Board `Nc` totals (34, 18) are board-level crawl counts and are **not** the sum of their
  module `Nc` values — leave them as the verbatim data, do not recompute.

---

> **Screenshot:** `design-briefs/packs/2026-06-22/screens/session-manager-capture-data.png`
> is the positional ground-truth this layout contract describes — captured from
> `/session/minh-le?role=manager&step=capture&tab=data` at 1440×900, light mode, side panel
> closed.
