# Brief recipe — turn any mockup screen into a claude.ai/design brief

**Who runs this:** the designer, in **claude.ai** (with this repo connected via GitHub).
**What it produces:** a faithful, self-contained brief for one screen, which you then feed
to **claude.ai/design** so it *reproduces* the screen instead of reinventing it.

> **How to invoke (in claude.ai):**
> *"Follow `design-briefs/RECIPE.md` to build a brief for `<route>` — e.g. `/session/minh-le?tab=data`."*
>
> Claude reads the repo, writes the brief, then asks you for one screenshot. No CLI, no
> Playwright, no local server needed on your side — the only manual step is screenshotting
> the page on the deployed app.

---

## The model Claude should follow

A brief = **three contracts + one screenshot**:
- **Layout contract** — the regions and their geometry/positions (from the JSX structure).
- **Content contract** — every region, in order, with exact copy (from the JSX + its data).
- **Style contract** — the design-system tokens (from the repo's design system docs).
- **Screenshot** — the positional ground-truth, captured by the designer from the deployed app.

**Format skeleton** to match in shape and depth (fill with the real screen's content):

```
# Design brief — <Surface> · <state>
> What this is + the "reproduce, don't reinvent" instruction.
- Source of truth: <component file> (route <route>)
- Live state captured: <route + which step/role/tab> · viewport 1440×900, light mode

## 1. Layout contract
  ASCII region map + key measurements pulled from Tailwind classes
  (w-56=224px, h-12=48px, grid-cols-[1fr_280px], paddings, gaps).

## 2. Content contract
  Every region top-to-bottom: exact copy, counts, badges, icons, per-state variants.

## 3. Style contract
  Token table: which color does what, type rules, section-label spec, buttons, writing rules.

## 4. Notes for the redesign pass
  What's fixed (flow, regions, order, copy) vs free (visual treatment). Cross-checks (counts must sum).
```

> A static example isn't committed on purpose — the mockup changes often and a frozen brief
> goes stale fast. Generate a fresh one each time with this recipe; that's always current.

---

## Step 1 — Identify the surface and resolve the state

Map the requested route to its source file and figure out **which visual state renders**.
A single component often branches into many states (tabs, sub-stages, seeding vs done) — you
must trace the conditionals for the *exact* params given, not describe the component in general.

> The app changes often. Confirm the current route map from **`CLAUDE.md`** ("App route map")
> before relying on this table — treat `CLAUDE.md` as the live truth if they disagree.

| Route | Component file(s) | What sets the state |
|---|---|---|
| `/` | `components/mockups/ha-vy-handover-dashboard.jsx` | 4 role tabs (Manager/Offboarder/Coworker A/B) |
| `/session/new` | `components/mockups/create-session.jsx` | departure accordion + board picker |
| `/sessions` | `components/mockups/all-sessions.jsx` | Active / Completed / All filter |
| `/session/[id]` | `components/mockups/session-command-view.jsx` (+ `session-deliver.jsx`) | **5 steps** (Collecting→Ready→Capture→Deliver→Complete) × **3 roles** (Manager/Offboarder/Coworker) × **3 tabs** (Overview/Data/Logs), addressable via URL params `?role=&step=&tab=`; role is set at login, the topbar **State** switcher flips steps (the in-app role switcher was removed) |
| `/knowledge-graph` | `components/mockups/knowledge-graph-explorer.jsx` | force-directed graph · `?prompt=minh-le` from-session entry |
| `/spec/uc-ho-01/normal` | `components/mockups/uc-ho-01-normal-flow.jsx` | internal step index |
| `/spec/uc-ho-01/edges` | `components/mockups/uc-ho-01-edge-cases.jsx` | internal step index |

If the route is a real app page (anything except `/spec/*`), it is wrapped by
**`components/app/AppShell.tsx`** — include the sidebar + topbar chrome in the brief.
`/spec/*` traces have their own Prev/Next chrome instead.

**Trace the state.** A screen is usually **route + step + role + tab**, not just a URL — the
session detail view has 5 steps × 3 roles × 3 tabs. So pin down all of those for the requested
screen (ask the designer which step/role/tab if unstated), open the component, follow how that
combination resolves to a specific sub-component, and describe **only that state.**

## Step 2 — Read these files

1. The component file from Step 1 (for structure + content + the data arrays it renders).
2. `components/app/AppShell.tsx` — if it's a real app page (for the sidebar/topbar chrome).
3. **Design system tokens:** the "Design system (locked)" section of `CLAUDE.md`, and
   `ARTEEP-context-snapshot.md` §4 for the full palette/writing rules.

## Step 3 — Write the brief (three contracts)

Emit a markdown doc with this structure (match the depth of the format skeleton above):

- **Header** — surface name, source file + route, the exact state captured, viewport (1440×900, light mode).
- **1. Layout contract** — an ASCII region map + key measurements pulled from the Tailwind
  classes (widths like `w-56`=224px, `h-12`=48px, grid templates like `grid-cols-[1fr_280px]`,
  paddings, gaps). Describe where each block sits and its proportion — not pixel-perfect, but faithful.
- **2. Content contract** — walk every region top-to-bottom, listing exact copy, counts,
  badges, icons, and per-state variants. Pull real strings/numbers from the data arrays.
- **3. Style contract** — the token table: which color does what (violet/yellow/emerald/rose/neutral),
  type rules (mono for IDs/timestamps/counts/dates), section-label spec, 32px buttons, writing rules.
- **4. Notes for the redesign pass** — what's *fixed* (flow, regions, order, copy) vs *free*
  (visual treatment, spacing rhythm, icon weight). Flag any cross-checks (e.g. counts must sum).

## Step 4 — Ask the designer for the screenshot

End the brief with a request:

> *"Open the deployed app, **sign in as the role for this screen** (the login is a role-select),
> go to `<route>`, and attach a full-page screenshot here. That's the positional ground-truth the
> layout contract is describing."*

(The app is live on Vercel; there's no password — the login picks a role, and the topbar chrome
follows the role you log in as. Sign in as the right role, navigate to the exact state,
screenshot, paste.)

## Step 5 — Hand off to claude.ai/design

Start a new design in claude.ai/design with **the brief + the screenshot attached**, and this prompt:

> *"Reproduce this exact screen — same regions, same order, same relative positions and
> proportions as the screenshot. Do not invent, drop, reorder, or move pieces. Re-render the
> visuals on the design system in the doc. The screenshot is the layout contract, the outline
> is the content contract, the tokens are the style contract."*

Then **export → HTML**. The only step that needs **Claude Desktop** (not web) is the final
HTML → Figma import via the `use-figma` plugin.

---

## Why this beats prompting from scratch

The drift you've seen comes from asking claude.ai/design to design a screen *from a description*
— it has no anchor, so it reinvents layout and flow. This recipe gives it three things it was
missing: a **pixel reference** (screenshot), an **explicit reproduce-don't-reinvent instruction**,
and your **real tokens** — all sourced from the mockup, which is the source of truth for the flow.
