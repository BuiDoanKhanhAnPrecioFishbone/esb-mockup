# Interactive prototype brief — one standalone HTML that behaves like the mockup

**Goal.** Produce **a single self-contained `.html` file** that you navigate like the real
ART-EEP app — log in by role, click the sidebar, switch tabs, advance the session lifecycle,
log out — **not** an index of separate frames you select from. Same layout and copy as the
mockup; **restyled on the target design system** (tokens swapped, structure kept).

> **Prompt to paste into claude.ai/design (repo connected):**
> *"Read `design-briefs/INTERACTIVE-PROTOTYPE.md` and build the single standalone interactive
> HTML it describes. Use `lib/view-matrix.ts` for the navigation/state map and each pack brief
> in `design-briefs/packs/2026-06-22/briefs/` for that screen's layout + copy. Keep layout and
> behavior faithful; apply the target design system (see §6) for all visual tokens — do not use
> the mockup's violet. Output one .html file."*

---

## 1. What to read (all in the repo)

- **`lib/view-matrix.ts`** — the source of truth for surfaces, roles, steps, tabs, and tab
  visibility rules. The app's structure comes from here.
- **`design-briefs/packs/2026-06-22/briefs/*.md`** — for each screen, use its **Layout
  contract** (regions/positions) and **Content contract** (exact copy, counts, data). **Ignore
  each brief's Style contract** (that's the old violet system) — restyle per §6 instead.
- **`design-briefs/packs/2026-06-22/screens/*.png`** — visual reference for each screen's layout.

## 2. The screens (the 10 hero states = the prototype's screens)

| # | Screen | Reached by |
|---|---|---|
| 1 | `dashboard-manager-active` | Dashboard, role = manager |
| 2 | `dashboard-offboarder-active-queue` | Dashboard, role = offboarder |
| 3 | `all-sessions-list` | Sessions nav |
| 4 | `session-manager-capture-overview` | open session (manager) → Overview, step Capture |
| 5 | `session-manager-capture-data` | session → Data tab, step Capture |
| 6 | `session-manager-deliver-overview` | "Move to Deliver" → Overview, step Deliver |
| 7 | `session-manager-complete-overview` | "Commit to Knowledge Graph" → step Complete |
| 8 | `session-offboarder-capture-overview` | open session (offboarder) → Overview, step Capture |
| 9 | `knowledge-graph-default` | Knowledge graph nav |
| 10 | `knowledge-graph-from-session` | "Explore in Knowledge Graph" from a completed session |

## 3. Interaction model (the wiring — this is what makes it "act like the mockup")

**Login (start here).** Open on a role-select screen (matches `app/login`): three personas —
**Hà Vy** (Manager), **Minh Lê** (Offboarder), **Trần Hữu Nam** (Coworker). Selecting one sets
the active role (hold it in a JS variable / `localStorage`) and enters the app. No password.

**App shell (every screen after login).** Left sidebar — Dashboard · Sessions · Knowledge graph
· Settings · Design states. Topbar — search, notifications bell, and a **user pill** showing the
current persona with a **Log out** action. **No role switcher.** Clicking a sidebar item swaps
the main content. The role **persists** across every surface until logout. Log out → back to login.

**Per-surface behavior:**
- **Dashboard** renders the current role's dashboard (manager → screen 1, offboarder → screen 2;
  coworker → a simple active state). Role drives the content; no state switcher.
- **Sessions** shows the list (screen 3). Clicking the **Minh Lê** row opens the session command view.
- **Session command view** opens at **Capture · Overview** for the active role.
  - **Tabs** Overview / Data / Logs switch the body. Visibility rules from `view-matrix.ts`:
    Logs hidden for coworker; Data disabled for offboarder while in Prepare (n/a here since we
    open at Capture).
  - **Lifecycle advances via the real CTAs** (this replaces any state switcher):
    - Manager · Capture · Overview → **"Move to Deliver →"** → Deliver · Overview (screen 6).
    - Manager · Deliver · Overview → **"Commit to Knowledge Graph"** → Complete · Overview (screen 7);
      **"Back to Capture"** → returns to Capture.
    - Manager · Complete · Overview → **"Explore in Knowledge Graph"** → Knowledge graph (screen 10);
      **"Back to dashboard"** → Dashboard.
    - Offboarder · Capture · Overview → **"Open question queue"** → the session's **Data** tab.
  - The hero/step badge + body update when the step changes.
  - **Data tab** (screen 5): module accordions expand/collapse on click.
- **Knowledge graph** renders the explorer (screen 9): graph area + AI copilot chat bar + Quick
  Start chips + filter row + legend. Entering via "Explore in Knowledge Graph" shows the
  from-session variant (screen 10: copilot pre-filled "Show me Minh Lê's contributions" + answer).
  Filters/chips can be visual-only; the graph itself can be a static SVG/keep-it-simple layout.

## 4. Standalone constraints

- **One `.html` file.** Inline all CSS and JS. Vanilla JS only — no build step, no framework.
  Icons: inline SVG (or a single CDN icon set if necessary). A web-font via CDN is fine.
- **Client router / state.** Keep app state in one object, e.g.
  `{ role, route, step, tab, expanded:{} }`. A `render()` function redraws the main content from
  state; nav/tab/CTA clicks mutate state then `render()`. Hash routing (`#/sessions`) is a plus
  but not required.
- **Mock data inlined** from the pack briefs (real strings/counts — e.g. dashboard tiles 5/9/2,
  progress 9/14, the question list, module counts). Don't fetch anything.
- **Desktop-first**, ~1440 canvas, light mode.

## 5. Faithful to the mockup

Keep **regions, order, and copy** exactly as each pack brief's Layout + Content contracts
specify. The prototype is a behavioral + structural replica — only the **visual styling** changes
(§6). Don't invent screens or copy that aren't in the briefs.

## 6. Design system — restyle (do NOT use the mockup's violet)

Apply the **target design system** (the team's chosen system — e.g. the Azure-accent system).
Keep the mockup's **semantic roles**, just remap them to the new palette:

| Semantic role (mockup) | Use the new system's… |
|---|---|
| brand / primary / active / AI signal | primary accent (e.g. Azure) |
| warning / knowledge gaps | warning/amber token |
| verified / complete / success | success/green token |
| critical / urgent | danger/red token |
| surfaces / canvas / hairlines / text | the system's neutrals |

Keep the type rules (monospace for IDs/timestamps/counts), section-label treatment, ~32px
buttons, and sentence-case writing — expressed in the new system's tokens. If the designer names
a specific system in the prompt, use that; otherwise use a clean, consistent modern system with a
single accent.

## 7. "Acts like the mockup" — acceptance checklist

- [ ] Opens on role-select; picking a role enters the app and the role sticks everywhere.
- [ ] Sidebar moves between Dashboard, Sessions, Knowledge graph.
- [ ] Dashboard content matches the logged-in role.
- [ ] Sessions → open Minh Lê → session command view; Overview/Data/Logs tabs switch.
- [ ] CTAs advance the lifecycle: Capture → Deliver → Complete, and Complete → Knowledge graph.
- [ ] Data tab module accordions expand/collapse.
- [ ] User pill → Log out returns to role-select.
- [ ] Everything styled on the new design system — no violet from the old mockup.
