---
name: apply-to-mockup
description: Update a section, tab, or component of the esb-mockup web app, add a brand-new top-level route, or save a JSX artifact Codex generated in chat — so the team sees the change at the deployed app URL after CI/CD. Use whenever the user wants to add, update, or remix anything visible at `/`, `/session/[id]`, `/spec/...`, or a new route. Common triggers — "save this artifact", "ship the artifact", "put this on the site", "update the dashboard", "on the Stages tab change …", "add a /admin page", "swap the danger zone for …", "make this viewable", "/apply-to-mockup".
---

# apply-to-mockup

Updates a surface of the real ART-EEP mockup app — or adds a new route — so the team can navigate to the change at the deployed URL after CI/CD.

## When to use

The user wants something visible on the deployed app. Three modes:

1. **Update part of an existing surface.** Most common. *"On the dashboard, change X to Y."* *"In the Stages tab, replace this with that."* *"Move the Danger zone above Notifications in Settings."*
2. **Save a JSX artifact Codex generated in chat.** The user will usually say *"save this"*, *"put this on the site"*, or *"ship it"* after seeing the rendered artifact. Decide whether the artifact REPLACES content in an existing surface or becomes a NEW route.
3. **Add a brand-new top-level route.** *"Add a `/admin/connectors` page"*, *"build a `/knowledge-graph` route"*.

If the user is *only* logging written decisions or design rules (no visual change), use `update-context` instead. If they want both — log the rule AND update the UI to follow it — do `update-context` first (so the new context is the source of truth), then this skill, as two separate commits.

## What to do

Always:

1. **Read `AGENTS.md`** at the repo root for the live route map and the file-routing cheat sheet.
2. **Read `ARTEEP-context-snapshot.md`** for locked personas, design system, and QA-INT-01 governance. Anything that conflicts with these is wrong.
3. **Identify which surface the request touches** and match it to the right file (cheat sheet — see `AGENTS.md` for the canonical version):

   | Ask is about… | File to edit |
   |---|---|
   | The dashboard, session cards, completed row, activity feed, KPI tiles | `components/mockups/ha-vy-handover-dashboard.jsx` |
   | The quick-initiate page, default tiles, customize expander | `components/mockups/uc-ho-01-quick-initiate.jsx` |
   | Any session-detail tab (Overview, Stages, Data, Audit, Settings), the 3-phase hero, action sidebar | `components/mockups/session-command-view.jsx` |
   | The sidebar nav, top bar, search, notifications dropdown, user pill | `components/app/AppShell.tsx` |
   | A spec-trace walkthrough state (UC-HO-01 normal flow or edge cases) | `components/mockups/uc-ho-01-normal-flow.jsx` or `uc-ho-01-edge-cases.jsx` |
   | The team guide content | `TEAM-GUIDE.md` (rendered at `/guide`) |

4. **Confirm scope with the user before editing** if the request is ambiguous. Quote back what you're about to do in one sentence — *"I'll edit the `DataTab` in `session-command-view.jsx` to add a 'Last synced' column. OK?"*

### Mode 1 — Update an existing surface

Find the **smallest function** inside the matching JSX file that already matches the request (e.g. `PendingSessionCard`, `OverviewSeedingActive`, `DataTab`, `NotificationItem`, `SettingsTab`) and edit it. Do NOT rewrite the whole file. Do NOT touch unrelated functions for cosmetic consistency without being asked.

### Mode 2 — Save a generated artifact

First decide:
- **Does this artifact map to an existing surface?** If yes, swap the artifact's JSX into the matching sub-function, preserving props/exports and the embedded/non-embedded contract. (Surfaces accept `embedded` + `view` props — keep this working.)
- **Does it warrant a new route?** If yes, follow Mode 3.

### Mode 3 — Add a brand-new top-level route

1. **Create the surface component** at `components/mockups/<descriptive-kebab>.jsx`:
   - `"use client";` at top if it uses hooks.
   - Default-export a React component. Accept `{ embedded = false } = {}` and skip any internal demo chrome when `embedded` is true.
   - Use Tailwind classes + `lucide-react` icons only. No new UI libraries.
2. **Create the route** at `app/<segment>/page.tsx`:
   ```tsx
   import { AppShell } from "@/components/app/AppShell";
   import NewSurface from "@/components/mockups/<name>.jsx";

   export default function Page() {
     return <AppShell><NewSurface embedded /></AppShell>;
   }
   ```
3. **Add it to the sidebar** in `components/app/AppShell.tsx` — append an entry to `PRIMARY_NAV` (or `SECONDARY_NAV` for "More") with the right icon + match function.
4. **Wire internal navigation.** Any clickable thing that should navigate must use `<Link href="...">` from `next/link`, not a raw `<button>` or `<a>`. NEVER nest a `<button>` inside a `<Link>` — that's invalid HTML and causes hydration warnings. If a card already has a button styled as the CTA, wrap the whole card in a `<Link>` and convert the inner button to a `<span>` styled the same way (this codebase already uses that pattern in `SessionCard`).

### Commit & push

1. Run `npm run typecheck` if available — fix any errors before committing.
2. Commit to `main` with a short, specific message:
   - `feat(dashboard): show priority badge on urgent session cards`
   - `feat(session): build Data + Audit + Settings tabs`
   - `feat(route): add /admin/connectors`
   - `fix(appshell): close notifications dropdown on link click`
3. Push directly. Vercel redeploys in ~60s.

## Never

- Don't recreate `/m/[slug]` or `lib/mockups-registry.ts`. Routes in `app/` are the registry now — adding a new surface means adding an `app/<segment>/page.tsx`.
- Don't deviate from the locked palette — violet / pastel yellow / rose / emerald. Muted blue is scoped to the Transactional Gateways artifact only.
- Don't introduce new UI libraries beyond Tailwind + `lucide-react`.
- Don't fetch real data, hit external APIs, or add a backend. Mockups are static UI.
- Don't touch `middleware.ts`, `app/api/auth/`, or `app/login/` unless the user explicitly asks to change auth.
- Don't add `<button>` inside `<Link>` — use `<span>` styled as a button, or convert the inner button to a `<Link>` directly.
- Don't rewrite a whole feature JSX file when a single sub-function is what changed.
- Don't break the `embedded` prop contract on the three feature surfaces (dashboard, quick-initiate, command-view). They must work both standalone (demo) and embedded (in `AppShell`).
- Don't open a PR unless the user asks. Direct push to `main` is the default.

## After pushing

Tell the user:
- The **route(s)** they should open to see the change — e.g. `/`, `/session/minh-le?tab=settings`, `/admin/connectors`.
- Vercel takes **~60 seconds** to redeploy.
- If multiple files changed (e.g. a new route + sidebar entry), list them briefly so they can scan the diff in GitHub.
- If the change implies a follow-up `update-context` (e.g. the user just adopted a new pattern), suggest logging it as a CL entry.
