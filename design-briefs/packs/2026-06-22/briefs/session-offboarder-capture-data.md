# Design brief — Session command view · Offboarder · Capture · Data tab

> **What this is.** The offboarder's (Minh Lê's) **answerable question queue** — the Data tab
> of the session command view while the session is in **Capture**. Unlike the manager's Data
> tab (nested board → module → card tree with a side panel), the offboarder sees a **flat
> vertical list of question cards**: each is one question to answer, or one answer already
> given. This is a NEW state.
>
> **Reproduce, don't reinvent.** The screenshot is the positional ground truth. Keep the same
> regions, the same order, the same flat list, the exact question/answer strings and the exact
> source + module chips. Re-render the visuals on the ART-EEP design system below — do not
> invent, drop, reorder, or restyle the flow.

- **Source of truth:** `components/mockups/session-command-view.jsx` — `OffboarderQueue` component (renders when `role==="offboarder" && stepId==="capture"` inside `DataContent`), driven by the `OB_QUEUE` data array. Card input is the `AnswerInput` component. Chrome from `components/app/AppShell.tsx` (offboarder branch).
- **Live state captured:** `/session/minh-le?role=offboarder&step=capture&tab=data` — Offboarder role, Capture step, Data tab.
- **Viewport:** 1440×900, light mode only.

---

## 1. Layout contract

```
┌──────────┬──────────────────────────────────────────────────────────────────────┐
│ SIDEBAR  │ TOPBAR  h-12 (48px), white, 1px bottom hairline                        │
│ w-56     │ [search box ......... {K]   (flex spacer)   [🔔]  [State ▾]  [ML pill] │
│ (224px)  ├──────────────────────────────────────────────────────────────────────┤
│ white    │                                                                        │
│ 1px      │   ┌── CONTENT · max-w-5xl (1024px) mx-auto · p-6 ───────────────────┐  │
│ right    │   │                                                                  │  │
│ border   │   │  HERO BAR  rounded-lg border bg-white p-4, flex items-center     │  │
│          │   │  [ML ●48px] Minh Lê's session  [CAPTURE badge]                   │  │
│ ● ART-EEP│   │            Senior Backend Engineer · Engineering                 │  │
│          │   │            22d left · 9/14 answered · 7 satisfied  (mono)        │  │
│ WORKSPACE│   │                                                                  │  │
│ ▣ Dash-  │   │  TABS  flex, border-b hairline                                   │  │
│   board  │   │   Overview   [Data]   Logs     ← Data active (violet underline)  │  │
│          │   │                                                                  │  │
│ MORE     │   │  FLAT QUESTION LIST  space-y-2  (one card per question)          │  │
│ ▣ Design │   │  ┌────────────────────────────────────────────────────────┐    │  │
│   states │   │  │ What are the undocumented rate limits on the payment…?  │    │  │
│          │   │  │ 👤 Coworker   [Payment Service]                         │    │  │
│ ········ │   │  │ ┌────────────────────────────────────────────────────┐ │    │  │
│ (avatar  │   │  │ │ Type your answer...                (textarea h-16) │ │    │  │
│  bubble) │   │  │ └────────────────────────────────────────────────────┘ │    │  │
│          │   │  │ 📎 Attach file                              [ Submit ] │    │  │
│ Mockup   │   │  └────────────────────────────────────────────────────────┘    │  │
│ play-    │   │  … 4 more unanswered cards (same shape) …                       │  │
│ ground   │   │  ┌────────────────────────────────────────────────────────┐    │  │
│ (footer) │   │  │ Where is the API key rotation doc?                      │    │  │
│          │   │  │ ✓ Answered  [✓ Satisfied]  [Shared Libraries]           │    │  │
│          │   │  │ ▎Engineering wiki at /security/api-key-rotation.md…     │ ←emerald│
│          │   │  └────────────────────────────────────────────────────────┘    │  │
│          │   │  … 1 more answered card …                                       │  │
│          │   └──────────────────────────────────────────────────────────────────┘  │
└──────────┴──────────────────────────────────────────────────────────────────────┘
```

**Key measurements (from Tailwind classes):**
- **Sidebar** `w-56` = **224px**, `bg-white`, 1px right border. **Offboarder sidebar is minimal** — only the **Dashboard** entry under "Workspace" (other primary nav filtered out), plus "More → Design states". Header rail `h-12` with the `● ART-EEP` wordmark (mono, tracking-[0.18em]). Footer block "Mockup playground / Live preview of ART-EEP surfaces…".
- **Topbar** `h-12` = **48px**, `bg-white`, 1px bottom border, `px-4`, items `gap-4`. Search box `max-w-md flex-1`, then `flex-1` spacer pushes bell + State switcher + user pill right.
- **Content column** `max-w-5xl` = **1024px**, `mx-auto`, padding `p-6` = 24px. (The flat queue itself has no inner `max-w-2xl` clamp — it spans the full content column, unlike the Overview queue.)
- **Hero bar** `rounded-lg border border-gray-200 bg-white p-4 mb-5`, `flex items-center gap-4`. Avatar `w-12 h-12` = 48px rounded-full, `bg-violet-100 text-violet-700`, initials **ML**.
- **Tabs row** `flex border-b border-gray-200 mb-5`; each tab `px-4 py-2.5 text-sm font-medium border-b-2`. Active = `border-violet-600 text-gray-900`; inactive = `border-transparent text-gray-500`.
- **Question list** `space-y-2` (8px between cards). Each card `rounded-lg border border-gray-200 bg-white px-4 py-3`.
- **Answer textarea** (`AnswerInput`) `w-full h-16` = 64px, `rounded border border-gray-200 text-[11px] resize-none`, placeholder "Type your answer…". Below it a flex row: left "Attach file" link, right **Submit** button `h-6 px-2 bg-violet-600 text-white text-[10px]`.
- **Answer block** (answered cards) `mt-2 rounded-md px-3 py-2 bg-gray-50 border-l-2 border-emerald-400` (2px emerald left accent).

---

## 2. Content contract

Walk top to bottom.

### Sidebar (offboarder, minimal)
- Wordmark: `● ART-EEP` (violet dot + mono caps).
- Section label **WORKSPACE** → single item **Dashboard** (LayoutDashboard icon).
- Section label **MORE** → **Design states** (LayoutGrid icon).
- Footer: **Mockup playground** / "Live preview of ART-EEP surfaces. Changes ship via Claude → main → Vercel."

### Topbar
- Search input placeholder: **"Search sessions, people, or knowledge"** with a `{K` mono hint chip.
- Bell icon with a rose unread dot (top-right of the bell).
- **State switcher**: pill reading **State · Capture (active)** with a Layers icon + chevron. (Label comes from FLOW: `Capture (active)`.)
- **User pill**: violet **ML** avatar → **Minh Lê** / **Offboarder** (two lines), chevron. (From `ROLES`: offboarder label "Minh Lê", sub "Offboarder".)

### Hero bar
- Avatar **ML** (violet circle).
- Title: **Minh Lê's session** + uppercase badge **CAPTURE** (`bg-violet-50 border-violet-200 text-violet-700`).
- Subtitle: **Senior Backend Engineer · Engineering**.
- Mono metrics line: **22d left · 9/14 answered · 7 satisfied**.

### Tabs
- **Overview · Data · Logs**. **Data** is active (violet underline, gray-900 text). Overview + Logs are inactive gray. (For the offboarder in Capture all three tabs are enabled.)

### Flat question list — render in this exact order

**Unanswered cards (5)** — each shows: question text (`text-[13px] text-gray-900`), then a meta row with a source icon + source label + a module chip, then the answer textarea ("Type your answer…") with **Attach file** + **Submit**.

| # | Question text (exact) | Source | Source icon | Module chip |
|---|---|---|---|---|
| 1 | What are the undocumented rate limits on the payment API? | **Coworker** | 👤 User (gray) | **Payment Service** |
| 2 | Is there a runbook for the nightly batch job failures? | **Coworker** | 👤 User (gray) | **CI/CD Pipeline** |
| 3 | What's the rollback procedure for the Atlas migration? | **Hà Vy** | 👤 User (gray) | **CI/CD Pipeline** |
| 4 | How does the Kafka retry logic handle poison messages? | **AI-generated** | ✨ Sparkles (violet) | **Payment Service** |
| 5 | Who owns the vendor XYZ contract renewal? | **AI-generated** | ✨ Sparkles (violet) | **Inventory Sync** |

Source-icon rule: `fromType==="ai"` → violet Sparkles; otherwise → gray User icon. The source label is the literal `from` string (the human name "Hà Vy" / generic "Coworker", or "AI-generated").

**Answered cards (2)** — each shows: question text, then a meta row with a green **CheckCircle** + **Answered** + a status badge + module chip, then the **emerald-left-border answer block** containing the answer text. **No textarea** on answered cards.

| # | Question text (exact) | Status badge | Module chip | Answer text (exact, in emerald block) |
|---|---|---|---|---|
| 6 | Where is the API key rotation doc? | **✓ Satisfied** (`bg-emerald-50 text-emerald-700`) | **Shared Libraries** | Engineering wiki at /security/api-key-rotation.md. Rotates every 90 days via GitHub Action. |
| 7 | Who should I contact about the SLA penalty terms? | **waiting for review** (gray-400 text, no chip bg) | **Inventory Sync** | Talk to Linh Phạm in Procurement — she handled the last renewal. SLA doc at /vendor-contracts. |

Status-badge rule: answered card with `satisfied:true` → emerald **✓ Satisfied** pill; with `satisfied:false` → plain gray **waiting for review** text (not a filled pill).

### One-shot flash + scroll (arrival from Overview)
When the user clicks a question card in the **Overview** tab, the app switches to this Data tab and **scrolls the matching question into view (centered, smooth) and flashes it once**. Implementation: each card carries a stable `ref` keyed by question id (`obq1`…`oba2`); on arrival the target `scrollIntoView({block:"center"})` fires and a **1.6s `qflash` keyframe** runs — a violet 2px box-shadow ring + a `#f5f3ff` (violet-50) background wash that fades back to white. It plays **once** per arrival (driven by a `focusKey` counter), not on hover, not on a loop. In a static screenshot this is invisible; depict the queue at rest. If you show the flash state, it's a transient violet ring + faint violet fill on a single card.

---

## 3. Style contract

| Token | Where it's used |
|---|---|
| **violet-600** | Active tab underline + text; **Submit** button fill; primary CTAs. |
| **violet-100 / violet-700** | ML avatar circle (bg / text). |
| **violet-500** (Sparkles) | AI-generated source icon on AI questions. |
| **violet-50** (`#f5f3ff`) + **violet-300/`#a78bfa` ring** | One-shot `qflash` arrival highlight (transient only). |
| **emerald-400** | 2px **left border** on the answer block (verified/answered content accent). |
| **emerald-50 / emerald-700** | **✓ Satisfied** badge (bg / text); green CheckCircle on answered meta row (`emerald-500`). |
| **gray-50** | Answer block background; topbar search + State pill bg; sidebar footer. |
| **gray-100 / gray-500** | Module chip (`bg-gray-100 text-gray-500`); "waiting for review" text is gray-400. |
| **gray-200** | All 1px hairlines — card borders, sidebar/topbar borders, tab divider. |
| **gray-900 / gray-500** | Question text (900); meta + subtitle (500). |
| **rose-500** | Bell unread dot only (no other rose on this screen). |
| _no yellow_ | This flat queue has **no knowledge-gap (yellow) blocks** — gaps live in the manager's nested Data tab, not here. |

**Type rules**
- Sans-serif body. **Monospace** (`ui-monospace, Menlo`) for: the hero metrics line, the State-switcher state label is regular, the topbar `{K` hint, and the `· N` counters — i.e. IDs / counts / stats are mono.
- Question text `text-[13px]`; meta row `text-[11px]`; badges `text-[9px]`; answer text `text-[11px]`.

**Component specs**
- Module chip: `text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500`, sits at the end of the meta row (`ml-1`).
- Satisfied badge: `text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700`, label `✓ Satisfied`.
- Submit button: `h-6 px-2 rounded bg-violet-600 text-white text-[10px]` (small, right-aligned under the textarea). Attach file: `text-[10px] text-gray-500` with a small Paperclip, hover → violet.
- Focus rings everywhere: `focus:ring-2 focus:ring-violet-500/20`.

**Writing rules** (locked design system)
- Sentence-case English; named humans not roles ("Hà Vy", "Coworker", "Linh Phạm").
- "Sensitive content" not "PII"; no "playbook" wording; chrome does not announce the user's role (the pill names the person, the topbar reads ART-EEP / route hint).

---

## 4. Notes for the redesign pass

**Fixed (do not change):**
- The **flat list** structure — one card per question, no board/module nesting, no side panel. This is the whole point of the offboarder Data tab vs the manager's.
- Order: **5 unanswered cards first, then 2 answered cards** (waiting → answered), exactly as listed.
- The two card variants: unanswered = question + source/module meta + textarea + Attach/Submit; answered = question + Answered/status/module meta + emerald-left-border answer block (no input).
- Exact strings: every question, every source label, every module chip, both answer texts.
- Source-icon logic (AI → violet Sparkles, human → gray User) and status logic (Satisfied pill vs "waiting for review" plain text).
- The **one-shot flash + center-scroll** behavior when arriving from an Overview click.
- Chrome: minimal offboarder sidebar (Dashboard only), topbar State = "Capture (active)", pill = Minh Lê / Offboarder.

**Free (visual treatment only):**
- Spacing rhythm, card shadow/elevation, icon weight, exact corner radius, the flash easing curve.
- Hover affordance on cards (the Overview variant uses `hover:border-violet-300 hover:shadow-sm`; the Data list cards are static by default — a subtle hover is acceptable).

**Cross-checks:**
- `OB_QUEUE` has **7 items = 5 unanswered + 2 answered**. The hero says **9/14 answered · 7 satisfied** — those are the *session-wide* totals from `SESSION`, not the count of cards on this screen. Don't try to make the visible card counts equal the hero numbers; the queue is a curated subset.
- Exactly **one** answered card is `✓ Satisfied` (API key rotation); the other is `waiting for review` (SLA penalty terms).

---

> **Screenshot to attach:** open the deployed app, sign in as **Offboarder (Minh Lê)**, go to
> `/session/minh-le?role=offboarder&step=capture&tab=data`, and attach a full-page screenshot.
> That's the positional ground truth this layout contract describes.
