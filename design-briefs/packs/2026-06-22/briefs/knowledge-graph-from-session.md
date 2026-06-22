# Design brief — Knowledge Graph explorer · from-session entry (`?prompt=minh-le`)

> **What this is:** the ART-EEP Knowledge Graph explorer as it renders when opened *from a session* via the deep-link `/knowledge-graph?prompt=minh-le`. This is **not** the default cold-start graph — on entry the AI Copilot auto-fires Minh Lê's contributions prompt: the six modules Minh contributed to are pre-expanded, Minh's entries are focused/highlighted, the chat input is pre-filled, and a violet copilot answer is already shown above the input.
>
> **Reproduce, don't reinvent.** The screenshot is the positional ground-truth; this doc is the content + style contract. Re-render the regions in the same order, position, and proportion. Do not invent, drop, reorder, or move pieces. Re-skin visuals onto the design system below; keep every literal string exactly as written.

- **Source of truth:** `components/mockups/knowledge-graph-explorer.jsx`, wrapped by `components/app/AppShell.tsx` (route `/knowledge-graph`)
- **Live state captured:** `/knowledge-graph?prompt=minh-le` — the `useEffect` reads `?prompt`, looks up `PROMPTS["minh-le"]`, sets `expanded` = the 6 Minh-contributed modules, `chatFocus` = those modules + their entries, `chatInput` = "Show me Minh Lê's contributions", `chatResponse` = the Minh summary, then strips the query string from the URL (`replaceState` → `/knowledge-graph`). No side panel is open (no node selected), so the graph is full-width.
- **Viewport:** 1440×900, light mode.

---

## 1. Layout contract

```
┌──────────┬───────────────────────────────────────────────────────────────────────┐
│ SIDEBAR  │  TOPBAR  h-12 (48px)                                                    │
│ w-56     │  [search ........................ ⌘K]      🔔   [State]   (HV) Hà Vy ▾  │
│ (224px)  ├───────────────────────────────────────────────────────────────────────┤
│          │  GRAPH HEADER (mb-2)                                                    │
│ • ART-EEP│  [✦] Knowledge Graph                              [Expand all] [Reset]  │
│          │      Engineering · 7 modules · 19 entries · 42 relationships           │
│ WORKSPACE├───────────────────────────────────────────────────────────────────────┤
│ ▢ Dashbd │  FILTER BAR (mb-2)                                                      │
│ ▢ Sessns │  ⛁ Status [All][Verified][Draft] | Contributor [All][Minh Lê][Thanh   │
│ ▣ Knowl. │  Đức] | [Has gaps]                                                      │
│ ▢ Settngs├───────────────────────────────────────────────────────────────────────┤
│          │  ┌─────────────────────────────────────────────────────────────────┐  │
│ MORE     │  │ GRAPH CANVAS  (w-full · flex-1)  bg-gray-50 rounded-lg border    │  │
│ ▢ Design │  │   force-directed: Eng hub center, 7 module rings, Minh's         │  │
│   states │  │   entries fanned out around their modules (expanded)             │  │
│          │  │                                                                  │  │
│          │  │  ┌legend (bottom-left, bg-white/80)────────────────────────┐    │  │
│ ┌──────┐ │  │  │ ● Structural ● Knowledge ● Gap ● Reported | Solid =     │    │  │
│ │play- │ │  │  │ hierarchy  Dashed = cross-link                          │    │  │
│ │ground│ │  │  └─────────────────────────────────────────────────────────┘    │  │
│ └──────┘ │  └─────────────────────────────────────────────────────────────────┘  │
│          │  ┌COPILOT DOCK (mt-2)──────────────────────────────────────────────┐  │
│          │  │ ┌violet answer box (bg-violet-50 border-violet-100)───────────┐ │  │
│          │  │ │ Minh Lê contributed 42 entries across 6 modules …           │ │  │
│          │  │ │ Clear                                                       │ │  │
│          │  │ └─────────────────────────────────────────────────────────────┘ │  │
│          │  │ [✦ AI Copilot] [Show risks][Critical paths][Auth flow]          │  │
│          │  │               [Deploy pipeline][Incident response]              │  │
│          │  │ [ Show me Minh Lê's contributions ................. ] [✈ Send]  │  │
│          │  └─────────────────────────────────────────────────────────────────┘  │
└──────────┴───────────────────────────────────────────────────────────────────────┘
```

**Key measurements (from Tailwind classes):**
- **Sidebar** `w-56` = 224px, white, `border-r border-gray-200`. Logo row `h-12` (48px) with `border-b`.
- **Topbar** `h-12` (48px), white, `border-b border-gray-200`, `px-4`, `gap-4`. Search box `h-8` (32px), `max-w-md`, `bg-gray-50` rounded with `⌘K` chip on the right; then a `flex-1` spacer, then bell, State switcher, user pill.
- **Content column** vertical flex (`flex-col h-full min-h-0`): graph header (`mb-2`), filter bar (`mb-2`), graph+panel row (`flex-1 min-h-0 flex gap-2`), copilot dock (`mt-2`). Component root has `p-4` only in standalone mode; embedded under AppShell it omits the pad.
- **Graph canvas** is `w-full` here because **no node is selected** (`selected` is null). When a node *is* clicked the canvas becomes `w-3/5` and a `w-2/5` side panel opens — that panel is **absent** in this captured state.
- **Header sparkle tile** `w-8 h-8` (32px) `rounded-lg bg-violet-600`. Header buttons `Expand all` / `Reset` are small pill buttons (`px-2.5 py-1 text-[11px]`).
- **Filter chips** `px-2.5 py-1 text-[10px] rounded-full border`; vertical `|` dividers are `text-gray-200`.
- **Copilot dock** white card `rounded-lg border px-3 py-2`. Answer box `rounded-md px-3 py-2`. Chip row `gap-1.5`. Input `py-1.5 text-[11px]`, Send button `bg-violet-600` `px-3 py-1.5`.

---

## 2. Content contract

### A. Sidebar (AppShell)
- Brand row: violet dot (`w-1.5 h-1.5 bg-violet-500`) + **ART-EEP** in mono, letter-spaced `tracking-[0.18em]`.
- Section label **WORKSPACE** (mono, uppercase, gray-400). Items, in order, each with a lucide icon:
  - **Dashboard** · **Sessions** · **Knowledge graph** *(active — `bg-violet-50 text-violet-700`, violet icon)* · **Settings**
- Section label **MORE**. Item: **Design states**.
- Footer block: **Mockup playground** (bold) / "Live preview of ART-EEP surfaces. Changes ship via Claude → main → Vercel."
- *(Screenshot shows an avatar bubble "N" floating at bottom-left over the footer — that is a browser/extension overlay, not part of the app. Ignore it.)*

### B. Topbar (AppShell)
- Search field placeholder: **"Search sessions, people, or knowledge"** + mono **⌘K** chip (renders as `&lcub;K` literal in the snapshot — treat as the ⌘K keyboard hint).
- Bell icon with a rose unread dot (`bg-rose-500`, top-right).
- **State** switcher (Layers icon + "State") — present in chrome; on this route it has ≤1 state so it may not render a value. Keep the control slot.
- User pill: violet circle initials **HV**, name **Hà Vy**, sub **Manager / HR**, chevron. *(This is the logged-in viewer's identity; the screenshot shows the Manager / HR role.)*

### C. Graph header
- Violet sparkle tile, then:
  - **Knowledge Graph** (title, `text-sm font-semibold`)
  - Sub-line, mono-feel counts: **"Engineering · 7 modules · 19 entries · 42 relationships"**
    - *(These are computed: 7 = `type:"module"` nodes, 19 = `type:"entry"` nodes, 42 = `EDGES.length`. Render exactly "7 modules · 19 entries · 42 relationships".)*
- Right side buttons: **Expand all** (violet, `bg-violet-50 text-violet-700`) and **Reset** (gray, `bg-gray-100`).

### D. Filter bar
- Leading filter funnel icon + label **Status**, then chips: **All** *(active — violet fill)* · **Verified** · **Draft**.
- Divider `|`. Label **Contributor**, then chips: **All** *(active — violet fill)* · **Minh Lê** · **Thanh Đức**.
- Divider `|`. Chip: **Has gaps** (single toggle).
- *(In the captured `?prompt=minh-le` state the filter chips are NOT toggled — Status=All, Contributor=All are the active ones. The Minh-Lê focus comes from the copilot `chatFocus`, not from the Contributor filter. So "All" stays violet on both groups, and no "Clear filters" link shows.)*

### E. Graph canvas (focused on Minh Lê)
Force-directed graph on `bg-gray-50`. **Node positions are physics-driven and will differ run to run — do not pin exact coordinates.** What is fixed:
- **Center hub:** one gray department node labeled **Engineering**, with **"Eng"** rendered inside the circle. `dept` radius 28px, gray fill `#f4f4f5` / gray stroke `#d4d4d8`.
- **Module ring (the 6 Minh modules are expanded in this state):** violet circles (fill `#f5f3ff`, stroke `#c4b5fd`, radius 18px) each showing a **−** glyph (expanded, violet `#6d28d9`) and a label below:
  - **Payment Processing** · **Auth & Identity** · **Database & Migrati…** · **CI/CD & Deployments** · **Monitoring** · **Rate Limiting & API**
  - The 7th module **Infrastructure as Code** is Thanh-Đức-only; not in `chatFocus`, so it is dimmed/hidden in the focused view.
- **Entry nodes** (radius 10px) fan out from each expanded module. Verified/draft entries are violet; **active gap entries are yellow** (fill `#fef9c3`, stroke `#facc15`). Visible entry labels (truncated to ~18 chars with "…") include, around their modules:
  - Payment: **Kafka Event Pipeline**, **Stripe Webhook Ver…**, **Payment Retry Race…**, **PCI Compliance Scope** *(yellow gap)*, **Stripe API Pinning**
  - Auth: **OAuth2 PKCE Flow**, **Azure AD SAML SSO**, **JWT Key Rotation** *(yellow gap)*, **RBAC Permission Ma…** *(yellow gap)*
  - Database: **Cosmos DB Partitio…**, **Migration v8 to v9** *(yellow gap)*, **Flyway Migration P…**
  - CI/CD: **GitHub Actions Mat…**, **Helm Rollback Proc…**
  - Monitoring: **Grafana Dashboard …**, **SLA & Escalation P…**
  - Rate Limiting: **Token Bucket Rate …**, **API Versioning & S…**
- **Edges:** solid gray hairlines = hierarchy (`#d4d4d8`); dashed violet = cross-links (`#c4b5fd`, `4,3` dash). Low opacity (~0.4).
- **Legend** (bottom-left, `bg-white/80 backdrop-blur` pill), left to right:
  - ● **Structural** (gray dot) · ● **Knowledge** (violet dot) · ● **Gap** (yellow dot) · ● **Reported** (rose dot) · `|` · **Solid = hierarchy** · **Dashed = cross-link**

### F. Copilot dock (the from-session payload)
- **Violet answer box** (shown because `chatResponse` is pre-set), exact copy:
  > **"Minh Lê contributed 42 entries across 6 modules (Payment, Auth, Database, CI/CD, Monitoring, Rate Limiting). 5 knowledge gaps remain across 3 modules."**
  - Below it a small violet link **Clear** (clears focus + response).
- **Copilot row:** a violet **✦ AI Copilot** chip, then 5 suggestion chips in order: **Show risks** · **Critical paths** · **Auth flow** · **Deploy pipeline** · **Incident response**. *(None active in this state — the active answer came from the auto-prompt, not a chip, so no chip shows the violet "selected" fill.)*
- **Input row:** text input **pre-filled** with the exact value **"Show me Minh Lê's contributions"** (placeholder would otherwise be "Ask about the knowledge graph…"), and a violet **Send** button (✈ paper-plane icon + "Send").

---

## 3. Style contract

| Token | Where it appears here |
|---|---|
| **violet 600** | Brand sparkle tile, active nav (`violet-50/700`), AI Copilot chip, active filter chip fill, Send button, copilot signal, primary CTAs |
| **violet 50 / 100 / 200** | Answer box bg+border (`violet-50`/`violet-100`), knowledge nodes (`#f5f3ff` fill, `#c4b5fd` stroke), violet pill buttons |
| **pastel yellow** | **Active** knowledge-gap nodes only (`#fef9c3` fill / `#facc15` stroke), the "Gap" legend dot — the 5 unresolved gap entries (PCI Compliance Scope, JWT Key Rotation, RBAC Permission Matrix, Migration v8→v9, + one more in the focus set). **A gap that has been resolved or dismissed reverts to standard violet — yellow signals *only* an open, un-actioned gap** (see gap-resolution behavior in Notes) |
| **emerald** | Reserved for the gap-action panel: the **"Mark as resolved"** button and the transient post-resolve confirmation card. **Not present in this captured state** (no node selected, so no detail panel / gap-action card is open) |
| **rose** | Notification unread dot in topbar; "Reported" legend dot. No reported nodes in this state |
| **muted blue** | Entity badges for projects/products — none surfaced in this graph state; reserve, don't invent |
| **gray / neutral** | Canvas `bg-gray-50`, white surfaces, `border-gray-200` hairlines, department node (`#f4f4f5`/`#d4d4d8`), structural edges, dismissed/draft entries |

**Type rules**
- Sans-serif body (Inter / system-ui). **Monospace** for the ART-EEP wordmark, section labels (WORKSPACE/MORE), the ⌘K chip, notification timestamps, and the count sub-line feel (IDs/counts/stats).
- Sizes are deliberately compact: header title `text-sm`, sub-line `text-[11px]`, filter chips `text-[10px]`, graph labels 9–11px, copilot copy `text-[11px]`.

**Section-label spec:** uppercase, `text-[10px]`, `tracking-wider`, `font-semibold`, gray-400, mono.

**Buttons / controls:** 32px (`h-8`) control height for topbar search/State/pill; pill buttons `px-2.5 py-1`; gap-action buttons (in the detail panel, not visible here) `h-7`. Explicit focus rings `focus:ring-2 focus:ring-violet-500/20`. 1px gray-200 hairlines; 2–3px semantic left accents only on side-panel cards (not visible here).

**Writing rules:** sentence-case English. Named humans ("Minh Lê", "Hà Vy"), never roles in body copy. Counts read as "42 entries across 6 modules", "5 knowledge gaps remain across 3 modules". Chrome stays role-neutral ("ART-EEP" wordmark). No "playbook" / no "PII" wording anywhere.

---

## 4. Notes for the redesign pass

**Fixed (do not change):**
- The four stacked regions and their order: graph header → filter bar → graph canvas (full-width, no side panel) → copilot dock at the bottom.
- All literal copy: the count sub-line "Engineering · 7 modules · 19 entries · 42 relationships"; the filter labels and chip names; the legend; the **pre-filled input string** "Show me Minh Lê's contributions"; and the **answer-box paragraph** verbatim.
- The from-session signature: copilot answer already shown (not empty), input pre-filled, the 6 Minh modules expanded with **−** glyphs, Minh's entries focused, no node-detail panel open.
- The 5 **open** gap entries render yellow (PCI Compliance Scope, JWT Key Rotation, RBAC Permission Matrix, Migration v8 to v9, + one more in the focus set) — an open gap = yellow, never violet.

**Gap-resolution behavior (recently changed — reflect in any interactive redesign):**
- Yellow is reserved strictly for an **active, un-actioned** gap. The detail-panel gap-action card offers two paths: **"Mark as resolved"** (emerald button) and **"Dismiss gap"** (neutral button). **Both** return the node to **standard purple/violet** — Resolve renders it as a normal **Verified** entry, Dismiss renders it as a normal **Draft** entry. There is no separate "resolved-but-still-tinted" color.
- The green/emerald confirmation card ("Gap resolved by Hà Vy · entry is now verified.") is **transient selection feedback only** — it shows while that node stays selected, not a persistent state color on the node.
- *In this captured state none of that is on screen* (no node is selected, so no gap-action card, no Resolve/Dismiss buttons, no green confirmation). The behavior note matters only if the redesign makes nodes clickable; the static screenshot shows all 5 gaps still **open and yellow**.

**Free (re-skin allowed):**
- Exact node coordinates, ring radius, and edge curvature — the layout is force-directed, so match the *gestalt* (Eng hub center, modules around it, entries fanned outward), not pixel positions.
- Spacing rhythm, icon weight, shadow depth, and the visual treatment of chips/cards, as long as tokens above are honored.

**Cross-checks:**
- Header counts must read **7 modules · 19 entries · 42 relationships** (note: the *answer box* says "42 entries across 6 modules" — that's Minh's contribution count, a different number from the graph's 42 *relationships*; keep both exactly as written, don't reconcile them).
- "5 knowledge gaps … across 3 modules" in the answer box should be consistent with the yellow gap nodes visible (gaps cluster in Payment, Auth, Database).
- No "Clear filters" link should appear (filters are at their All defaults); the only "Clear" is the violet link inside the copilot answer box.

---

> **Screenshot to attach:** open the deployed app, go to `/knowledge-graph?prompt=minh-le`, and attach a full-page 1440×900 screenshot. That's the positional ground-truth this layout contract describes (graph node positions will vary; everything else is fixed).
