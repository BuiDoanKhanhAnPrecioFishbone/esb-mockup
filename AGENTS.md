# esb-mockup

A Next.js mockup of the **ART-EEP** app — a real, navigable web app (not a flow-by-flow demo site) that PMs/designers use for user testing and brainstorming. Each surface is a real route inside a shared AppShell.

**Workflow:** PM/designer brainstorms in Codex.ai → asks Codex to apply the idea via the `apply-to-mockup` skill → Codex commits to `main` via the GitHub connector → Vercel deploys → team views the updated app at the password-protected URL.

## App route map (current)

```
REAL APP — shared sidebar + topbar via components/app/AppShell.tsx
─────────────────────────────────────────────────────────────────
/                         → Hà Vy's handover dashboard (home)
                            components/mockups/ha-vy-handover-dashboard.jsx

/session/new              → Quick initiate (one-click session creation)
                            components/mockups/uc-ho-01-quick-initiate.jsx
                            ?customize=1 opens the customize expander

/session/[id]             → Session command view (3 tabs · Overview + Data + Logs)
                            components/mockups/session-command-view.jsx
                            Valid ids · minh-le
                            ?tab=scope   → Overview with subStage 3 (review scope / duyệt)
                            ?tab=data    → Data tab (source + items by category + gaps + upload)
                            ?tab=logs    → Logs tab (full activity feed)
                            Default (no ?tab) → Overview subStage 2 (seeding)
                            UC-HO-04 Review tab removed — uc-ho-04-manager-review.jsx
                            is reference-only, no longer imported
                            Standalone demo: 2-step flow (Seeding → Review scope)
                            Mock data: Minh Lê-specific — Trello board 'Backend Platform',
                            Kafka/CQRS/GraphQL architecture, 6 named stakeholders

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

**Embedded mode.** The three "feature" mockups (dashboard, quick-initiate, command-view) accept an `embedded` prop and a `view` prop. When `embedded={true}`, they skip their internal demo chrome (TopBar / FlowBar / FooterNav) and let `AppShell` provide navigation. The same files work standalone (demo mode) or embedded — they're the same component tree.

**Spec traces.** The two flow walkthroughs (`uc-ho-01-normal-flow`, `uc-ho-01-edge-cases`) keep their internal Prev/Next chrome because they're inherently demo artifacts, not app pages.

## Read this first

The full ART-EEP context — design system (violet/yellow/rose/emerald palette), the locked persona set, 10 use cases + Step Zero, QA-INT-01 governance rule — lives in **`ARTEEP-context-snapshot.md`** at the repo root. Always read it before working on any ART-EEP mockup.

Deeper reference docs are in `docs/arteep/`:
- `ARTEEP-master-uc-index.md` — all 10 use cases with dependencies
- `ARTEEP-implementation-plan-v2.md` — 12-week sprint roadmap with Step Zero
- `ARTEEP-design-change-log.md` — the change log is the source of truth for locked decisions; the rule bullets in §"Design system" below are a quick-reference subset, not a replacement.
- `QA-INT-01-Dual-Verification-Rule.md` — foundational governance rule + compliance matrix
- `UC-HO-01_initiate-handover-session_v2.md`, `UC-HO-02_conduct-ai-guided-voice-interview_v2.md` — detailed UC specs

## Three workflows in this repo

Two are file-writing, one is a router. They must not bleed into each other.

| Skill | Touches | Use for |
|---|---|---|
| **`apply-to-mockup`** | `components/mockups/`, `components/app/`, `app/**/page.tsx` | Updating a part of the real app, adding a new tab/section, or adding a new route. Also still handles "save this JSX artifact Codex generated in chat" |
| **`update-context`** | `ARTEEP-context-snapshot.md`, `docs/arteep/*.md` | Persisting a *written* decision (new CL entry, persona/UC/sprint/palette change) so the next contributor sees it |
| **`ship-it`** (router) | Delegates only | One-shot "save what we just did" — surveys the chat, picks one or both of the above, runs them in the right order |

**Cheat sheet — which to fire**

- User is specific about *what* to save → use the matching specific skill:
  - *"Save this artifact" / "put this into the repo" / "make this viewable"* → **`apply-to-mockup`**
  - *"Save this decision" / "log this" / "update the context" / "compact this chat"* → **`update-context`**
- User is non-specific ("ship it", "save this", "save everything", "sync to repo") → **`ship-it`** — it surveys the chat and dispatches.
- When both apply (e.g. *"log the new rule and update S2 to follow it"*), the order is always **context first, then mockup**, as two separate commits. `ship-it` enforces this automatically.

## How to update the app

When asked to change a part of the app, follow this sequence. Identify *which surface* the request touches first (see the route map above), then make the surgical edit.

### Updating an existing surface

For tweaks to the dashboard, quick-initiate, or session command view — by far the most common ask — edit the matching JSX file in `components/mockups/`:

| Ask refers to… | File to edit |
|---|---|
| The dashboard, pending session cards, completed row, activity feed | `components/mockups/ha-vy-handover-dashboard.jsx` |
| The quick-initiate page, default tiles, customize expander | `components/mockups/uc-ho-01-quick-initiate.jsx` |
| Any session-detail tab (Overview, Data, Logs), the 3-phase hero, Prepare subStage views, stakeholder selection | `components/mockups/session-command-view.jsx` |
| The sidebar, top bar, search, notifications, user pill | `components/app/AppShell.tsx` |
| The team guide content | `TEAM-GUIDE.md` (rendered at `/guide`) |
| A spec-trace state | `components/mockups/uc-ho-01-normal-flow.jsx` or `uc-ho-01-edge-cases.jsx` |

Inside each feature JSX, sub-sections are normal React functions (e.g. `PendingSessionCard`, `ActiveDashboard`, `OverviewTab`, `DataTab`, `LogsTab`). Edit the smallest function that matches the request — don't rewrite the whole file.

### Adding a new section/tab to an existing surface

Edit only the matching JSX file. For example, adding a new tab to the command view: add the new entry to its `TABS` array and the matching `case` to its `CommandView` renderer.

### Adding a brand-new surface (new top-level route)

1. **Pick the route.** Match the locked architecture (e.g. `/knowledge-graph`, `/admin/connectors`). Use Next.js App Router conventions.
2. **Create the surface component** in `components/mockups/<descriptive-name>.jsx`:
   - `"use client";` at top if it uses hooks.
   - Default-export a React component. Accept an `embedded?: boolean` prop and skip any internal chrome when true.
   - Use Tailwind + `lucide-react` only.
3. **Create the route** at `app/<segment>/page.tsx`:
   ```tsx
   import { AppShell } from "@/components/app/AppShell";
   import NewSurface from "@/components/mockups/<name>.jsx";

   export default function Page() {
     return <AppShell><NewSurface embedded /></AppShell>;
   }
   ```
4. **Add the route to the sidebar.** Open `components/app/AppShell.tsx` and add an entry to `PRIMARY_NAV` (or `SECONDARY_NAV` for "More").
5. **Commit and push to `main`.** Vercel deploys in ~60s.

**Don't:**
- Don't recreate `/m/[slug]` or a "registry of mockups". The app *is* the registry — routes in `app/` define what exists.
- Don't fetch real data, hit external APIs, or add a backend. Mockups are static UI.
- Don't add database, auth, or session logic to a surface. The only auth is the sitewide password gate in `middleware.ts`.
- Don't touch `middleware.ts`, `app/api/auth/`, or `app/login/` unless explicitly asked.
- Don't introduce new UI libraries. Tailwind + `lucide-react` are the toolkit.
- Don't open a PR unless the user asks. Direct push to `main` is the default.

## How to update context

When asked to capture, log, or save decisions from the conversation:

1. **Read first.** Open `ARTEEP-context-snapshot.md`, `docs/arteep/ARTEEP-design-change-log.md`, and the relevant `docs/arteep/UC-*.md`. Scan the change log for the highest existing `CL-###` — the next entry uses that number + 1.
2. **Summarize what you're about to write** to the user in one short paragraph before touching files. If anything is ambiguous, ask.
3. **Make surgical edits, not rewrites:**
   - New design rule / visual change → append a `CL-###` entry to `docs/arteep/ARTEEP-design-change-log.md`.
   - Persona / palette / sprint / UC / TBD / QA-INT-01 state change → edit the matching numbered section of `ARTEEP-context-snapshot.md` (§3 personas, §4 design system, §5 UCs, §6 sprints, §7 Step Zero, §8 QA-INT-01, §9 artifacts, §10 CL summary, §11 TBDs).
   - UC behavior change → update the specific `docs/arteep/UC-*.md` and bump its version line.
4. **Commit and push to `main`** with a message naming the CL IDs added and the §sections touched. Example: `context: log CL-087 (canonical badge on hover); bump §4 visual rules`.

**Don't:**
- Don't invent CL numbers — always grep for the highest existing one first.
- Don't restructure the snapshot beyond the targeted edits. Headings, tables, and the footer are load-bearing.
- Don't capture decisions that are still being deliberated. If the user is mid-thought, ask first.
- Don't touch `components/mockups/` from this workflow — that's `apply-to-mockup`'s job. Do them as two separate commits if both are needed.

## Design system (locked — do not deviate)

From `ARTEEP-context-snapshot.md` §4. Keep visual fidelity high:

| Color | Use |
|---|---|
| **violet** (50/100/200/500/600/700) | Brand, AI signal, primary CTAs, active states |
| **pastel yellow** (50/100/200/700/800) | Warnings, knowledge gaps, low confidence |
| **rose** | Critical severity only — recording indicator, urgency, conflict |
| **emerald** | Verified content, canonical facts (emerald-300 border) |
| **muted blue** | Entity badges for projects/products (Transactional Gateways only) |

- Light mode only. `bg-gray-50` canvas, `bg-white` surfaces.
- 1px `border-gray-200` hairlines except 2px semantic left accents.
- Sans-serif body + monospace for IDs/timestamps/stats.
- 32px button heights. Explicit focus rings: `focus:ring-2 focus:ring-violet-500/20`.
- Sentence-case English UX writing. Named humans, not roles ("Hà Vy will review" not "your manager").
- "Sensitive content" not "PII". Don't name "Microsoft Purview" in user copy.
- **Chrome does not announce the user's role (CL-115).** Topbar reads `ART-EEP` or a neutral route hint. RBAC gates access invisibly; the UI does not narrate it.
- **No "playbook" in user copy (CL-113 / CL-116).** Pre-commit content is "bundle"; post-commit content is "Knowledge Graph entries". Phase 3 sub-stage is "KG access ready". Any leftover "playbook" wording is a bug.
- **No named successor at session time (CL-114).** Sessions do not carry a successor field. Newcomer identity is established by RBAC at KG access time.
- **Labels + values only on POC surfaces (CL-107).** Helper text kept only on risky or destructive actions.
- **Session command view · 3-tab Prepare-first build (2026-06-10).** Tabs are **Overview · Data · Logs**. UC-HO-04 Review tab removed entirely — `uc-ho-04-manager-review.jsx` is reference-only, no longer imported. Overview shows Prepare subStages 2 (seeding) and 3 (review scope / duyệt with stakeholder selection + "Move to Capture" CTA). Data shows source detail + items grouped by category (expandable) + knowledge gaps (yellow) + upload. Logs shows full activity feed. All mock data is Minh Lê-specific (Trello board 'Backend Platform', Kafka/CQRS/GraphQL architecture, 6 named stakeholders with co-occurrence context). Session creator is role-neutral (may be Manager, HR, or Admin). CL-119 RBAC view-switching (`?role=`) is still deferred — current build is single-view (session creator perspective).

## Personas (locked)

Hà Vy (Manager · Engineering) · Minh Lê (Offboarder · Engineering) · Trần Hữu Nam (Onboarder · Engineering) · Khánh Linh Trần (Offboarder · People & Culture, urgent) · An Quân Vũ (Platform Admin)

*Note · CL-118:* POC scope narrowed 9 → 8. Phương Anh Nguyễn (Sales) removed. Five locked personas + three Consumer-plane archetypes (Duy Nguyễn, Linh Phạm, Thảo Vũ per CL-104) = eight total.

*Note · CL-114:* Successor removed from session model. Trần Hữu Nam's KG access via Newcomer role in Entra ID at access time, not session-time assignment.

*Note · CL-119:* Stakeholder role is relationship-based (same Trello card/board/dept/reporting line), orthogonal to the four Consumer-plane archetypes.

## Local dev

```bash
npm install
cp .env.example .env.local   # fill in MOCKUP_PASSWORD + MOCKUP_AUTH_TOKEN
npm run dev                  # http://localhost:3000
```

## Deployment

Vercel auto-deploys from `main`. Set `MOCKUP_PASSWORD` and `MOCKUP_AUTH_TOKEN` in the Vercel project's Environment Variables (Production + Preview + Development).
