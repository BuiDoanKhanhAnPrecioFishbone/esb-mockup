# esb-mockup

A Next.js mockup of the **ART-EEP** app — a real, navigable web app (not a flow-by-flow demo site) that PMs/designers use for user testing and brainstorming. Each surface is a real route inside a shared AppShell.

**Workflow:** PM/designer brainstorms in Claude.ai → asks Claude to apply the idea via the `apply-to-mockup` skill → Claude commits to `main` via the GitHub connector → Vercel deploys → team views the updated app at the password-protected URL.

## App route map (current)

```
REAL APP — shared sidebar + topbar via components/app/AppShell.tsx
─────────────────────────────────────────────────────────────────
/                         → Hà Vy's handover dashboard (home)
                            components/mockups/ha-vy-handover-dashboard.jsx
                            4 role tabs: Manager · Offboarder · Coworker A · Coworker B
                            10 states across roles (CL-122 to CL-126)

/session/new              → Create session (accordion departures from HRIS)
                            components/mockups/create-session.jsx
                            Board picker + "Start session" CTA (CL-121)

/sessions                 → All sessions registry (Active/Completed/All)
                            components/mockups/all-sessions.jsx
                            Completed sessions live here, not on dashboard (CL-123)

/session/[id]             → Session command view (5-step flow · 3 roles · 3 tabs)
                            components/mockups/session-command-view.jsx (~40KB)
                            components/mockups/session-deliver.jsx (~10KB)
                            Valid ids · minh-le
                            5 steps: Collecting → Ready → Capture → Deliver → Complete
                            3 roles: Manager (Hà Vy) · Offboarder (Minh Lê) · Coworker
                            3 tabs: Overview · Data · Logs
                            Decisions: CL-119/120/127/128/129

/knowledge-graph          → Consumer Plane KG explorer (CL-121)
                            components/mockups/knowledge-graph-explorer.jsx
                            Force-directed graph · dept-first default · 7 modules · 19 entries
                            AI copilot chat bar · 5 Quick Start chips · side panel
                            ?prompt=minh-le auto-fires from-session entry point
                            12 locked grill-me decisions (see CL-121 patch file)

SPEC TRACES — standalone walkthroughs (no AppShell, Prev/Next chrome)
─────────────────────────────────────────────────────────────────
/spec                     → Index of traces (lives in AppShell)
                            app/spec/page.tsx
/spec/uc-ho-01/normal     → 8-state happy path walkthrough
                            components/mockups/uc-ho-01-normal-flow.jsx
/spec/uc-ho-01/edges      → 10-state edge cases walkthrough
                            components/mockups/uc-ho-01-edge-cases.jsx

INFRASTRUCTURE — don't touch unless asked
─────────────────────────────────────────────────────────────────
/login                    → Password gate UI (app/login/page.tsx)
/api/auth                 → Cookie set/clear (app/api/auth/route.ts)
/guide                    → Team guide rendered from TEAM-GUIDE.md
middleware.ts             → Sitewide password redirect
```

**Session command view file split.** The session detail page is split across two files due to size constraints:
- `session-command-view.jsx` (~40KB) — Main file with Prepare + Capture phases, all data/accordion/drawer/logs components, and shared exports (SESSION, MODULES_DATA, modProgress, ProgressBar, MC).
- `session-deliver.jsx` (~10KB) — Deliver phase components: DeliverOverview, CompleteOverview, CommitModal, BackModal. Imported by main file.

**Embedded mode.** The feature mockups (dashboard, quick-initiate, command-view) accept an `embedded` prop and a `view` prop. When `embedded={true}`, they skip their internal demo chrome and let `AppShell` provide navigation.

## Read this first

The full ART-EEP context — design system (violet/yellow/rose/emerald palette), the locked persona set, 10 use cases + Step Zero, QA-INT-01 governance rule — lives in **`ARTEEP-context-snapshot.md`** at the repo root. Always read it before working on any ART-EEP mockup.

Deeper reference docs are in `docs/arteep/`:
- `ARTEEP-design-change-log.md` — the change log is the source of truth for locked decisions
- `CL-121-kg-explorer-patch.md` — 12 KG explorer grill-me decisions + from-session entry point
- `CL-128-capture-phase-grill-me.md` — 14 Capture phase decisions
- `CL-129-deliver-phase-design.md` — 10 Deliver phase decisions + 3 edge cases
- `arteep-poc-full-surface-spec.md` — full spec of all built surfaces
- `session-detail-design-prompt.md` — design prompt for session detail

## Three workflows in this repo

Two are file-writing, one is a router. They must not bleed into each other.

| Skill | Touches | Use for |
|---|---|---|
| **`apply-to-mockup`** | `components/mockups/`, `components/app/`, `app/**/page.tsx` | Updating a part of the real app, adding a new tab/section, or adding a new route |
| **`update-context`** | `ARTEEP-context-snapshot.md`, `docs/arteep/*.md` | Persisting a *written* decision (new CL entry, persona/UC/sprint/palette change) |
| **`ship-it`** (router) | Delegates only | One-shot "save what we just did" — surveys the chat, picks one or both of the above |

## How to update the app

### File cheat sheet

| Ask refers to… | File to edit |
|---|---|
| Dashboard, session cards, activity feed, role tabs | `components/mockups/ha-vy-handover-dashboard.jsx` |
| Create session, departure accordion, board picker | `components/mockups/create-session.jsx` |
| Sessions registry (Active/Completed/All) | `components/mockups/all-sessions.jsx` |
| Session detail: Prepare + Capture phases, Data tab accordion, Side Panel drawer, Logs, hero bar | `components/mockups/session-command-view.jsx` |
| Session detail: Deliver Overview, Complete Overview, Commit modal, Back-to-Capture modal | `components/mockups/session-deliver.jsx` |
| Knowledge Graph explorer, AI copilot, graph nodes, side panel, chat bar | `components/mockups/knowledge-graph-explorer.jsx` |
| Sidebar, top bar, search, notifications, user pill | `components/app/AppShell.tsx` |
| Team guide content | `TEAM-GUIDE.md` (rendered at `/guide`) |
| A spec-trace state | `components/mockups/uc-ho-01-normal-flow.jsx` or `uc-ho-01-edge-cases.jsx` |

### Session detail 5-step flow

The session command view has 5 interactive steps navigable via the flow bar:

| Step | Phase | Manager Overview | Offboarder Overview | Coworker Overview |
|---|---|---|---|---|
| 1 Collecting | Prepare | Spinner + "Collecting data" | "Being prepared" empty state | "Being set up" empty state |
| 2 Ready | Prepare | 4 metrics + knowledge areas + "Start Capture" CTA | "Being prepared" empty state | Knowledge areas + "Browse Data tab" |
| 3 Capture | Capture | Progress bar + 3 metrics + "Move to Deliver" CTA | Progress bar + "Open question queue" CTA | 3 metrics + "Review in Data tab" |
| 4 Deliver | Deliver | Per-module readiness table + "Commit to KG" + "Back to Capture" | "Thank you, Minh" + contribution stats + "What happens next" | "Session is being finalized" |
| 5 Complete | Deliver | Emerald success banner + commit summary + "Explore in Knowledge Graph" link | Confetti + "Your knowledge has been committed" | "Session complete" |

Data tab behavior: read-only during Deliver/Complete (no ask inputs, no satisfaction buttons). "Committed" badges appear only on Complete (step 5). Complete state's "Explore in Knowledge Graph" links to `/knowledge-graph?prompt=minh-le`.

### Adding a brand-new surface (new top-level route)

1. Create component in `components/mockups/<name>.jsx` with `"use client"` + default export + `embedded` prop.
2. Create route at `app/<segment>/page.tsx` wrapping in `<AppShell>`.
3. Add to sidebar in `components/app/AppShell.tsx`.
4. Push to `main`. Vercel deploys in ~60s.

**Don't:**
- Don't fetch real data, hit external APIs, or add a backend.
- Don't touch `middleware.ts`, `app/api/auth/`, or `app/login/` unless asked.
- Don't introduce new UI libraries beyond Tailwind + `lucide-react`.
- Don't open a PR unless asked. Direct push to `main` is default.

## How to update context

1. Read `ARTEEP-context-snapshot.md` + `docs/arteep/ARTEEP-design-change-log.md`. Scan for highest `CL-###`.
2. Summarize what you're about to write. Ask if ambiguous.
3. Surgical edits: new CL entry → append to change log. State change → edit matching § in snapshot.
4. Push to `main` with message naming CL IDs + §sections.

## Design system (locked)

From `ARTEEP-context-snapshot.md` §4:

| Color | Use |
|---|---|
| **violet** (50/100/200/500/600/700) | Brand, AI signal, primary CTAs, active states |
| **pastel yellow** (50/100/200/700/800) | Warnings, knowledge gaps, low confidence |
| **rose** | Critical severity only |
| **emerald** | Verified content, canonical facts, satisfied states, committed badges |
| **blue** | Prepare phase badge only |

Light mode only. `bg-gray-50` canvas, `bg-white` surfaces. 1px `border-gray-200` hairlines. 32px button heights. Monospace for timestamps/counts. Sentence-case English. Named humans ("Hà Vy" not "your manager"). "Sensitive content" not "PII".

**KG explorer color encoding (CL-121):** Purple = knowledge nodes (modules + entries). Gray = structural (department, system nodes). Yellow = gap-flagged entries. Two colors + one accent.

## Personas (locked)

Hà Vy (Manager · Engineering) · Minh Lê (Offboarder · Engineering) · Trần Hữu Nam (Onboarder · Engineering) · Khánh Linh Trần (Offboarder · People & Culture, urgent) · An Quân Vũ (Platform Admin)

**Terminology:** "Coworker" (not "Stakeholder") for project peers who ask questions and review answers (CL-127).

## Local dev

```bash
npm install
cp .env.example .env.local   # fill in MOCKUP_PASSWORD + MOCKUP_AUTH_TOKEN
npm run dev                  # http://localhost:3000
```

## Deployment

Vercel auto-deploys from `main`. Set `MOCKUP_PASSWORD` and `MOCKUP_AUTH_TOKEN` in the Vercel project's Environment Variables (Production + Preview + Development).
