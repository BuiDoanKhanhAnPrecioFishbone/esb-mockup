---
name: apply-to-mockup
description: Translate a brainstormed idea, flow, wireframe, or a JSX/React artifact Claude just generated in chat into a clickable mockup in this repo. Use whenever the user wants to add, update, or remix an ART-EEP screen, flow, or component for the team to view at the deployed URL — including when they say "save this artifact", "put this into the repo", "ship the artifact", "make this viewable", "add a mockup for…", "show this as a wireframe", "put this flow on the mockup site", or "/apply-to-mockup".
---

# apply-to-mockup

Adds or updates a mockup in the `esb-mockup` repo (Next.js + Tailwind) so the team can view the idea at the deployed URL after CI/CD.

## When to use

The user wants something visible at `/m/<slug>` on the deployed site. Sources can be:

- **A JSX/React artifact Claude generated in the current chat** — the most common case. The user will usually say "save this", "put this in the repo", or "ship it" after seeing the rendered artifact.
- An idea, flow, or wireframe described in text or a sketch.
- A riff on or update to an existing mockup already in `components/mockups/`.
- An external JSX file the user pastes in.

If the user is *only* logging written decisions or design rules (no visual component to render), use `update-context` instead. If they want both (e.g. "log this new rule and update S2 to follow it"), do `update-context` first, then `apply-to-mockup` — as two separate commits.

## What to do

Always:

1. **Read `ARTEEP-context-snapshot.md`** at the repo root. It is the canonical source for personas, use cases, design system, and QA-INT-01 governance. Anything that conflicts with it is wrong.
2. **Read `CLAUDE.md`** at the repo root. It defines the file convention and design tokens. Follow it exactly.
3. **Confirm scope with the user before creating files** if the request is vague. Ask: what slug? which persona(s)? which use case? is this a single screen or a multi-step flow?

Then for each mockup:

1. Create `components/mockups/<slug>.tsx` with `"use client";` if it uses hooks. Default export the React component. Use only Tailwind + `lucide-react`.
2. Add an entry to `lib/mockups-registry.ts` with `slug`, `title`, `description`, `sprint`, `personas`, `useCases`, optional `tags`, and optional `flow`.
3. For multi-step flows, set the same `flow.id`, `flow.label`, and `flow.steps` (ordered slug array) on every mockup in the flow.
4. Run `npm run typecheck` if available — fix any errors before committing.
5. Commit to `main` with a short conventional message: `feat(mockup): add <slug>` or `chore(mockup): update <slug>` and push.

Never:

- Don't add new routes, backends, databases, or auth.
- Don't deviate from the violet / pastel-yellow / rose / emerald palette.
- Don't open a PR unless the user asks. Direct push to `main` is the default.
- Don't touch `middleware.ts`, `app/api/auth/`, or `app/login/` unless the user explicitly asks to change auth.
- Don't rename existing slugs without checking they aren't referenced by a `flow.steps` array.

## After pushing

Tell the user the slug, the route (`/m/<slug>`), and remind them the deploy takes ~60s on Vercel. If a flow was added, list the step order so they can share the entry point.
