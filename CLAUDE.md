# esb-mockup

A Next.js mockup playground for **ART-EEP**. Every page in `/m/<slug>` is a clickable React mockup PMs/designers use for user testing, flow verification, and brainstorming.

**Workflow:** PM/designer brainstorms in Claude.ai (or Gemini) → asks Claude to apply the idea via the `apply-to-mockup` flow → Claude commits to `main` via the GitHub connector → Vercel deploys → team views at the password-protected URL.

## Read this first

The full ART-EEP context — design system (violet/yellow/rose/emerald palette), 6 locked personas, 10 use cases + Step Zero, QA-INT-01 governance rule — lives in **`ARTEEP-context-snapshot.md`** at the repo root. Always read it before working on any ART-EEP mockup.

Deeper reference docs are in `docs/arteep/`:
- `ARTEEP-master-uc-index.md` — all 10 use cases with dependencies
- `ARTEEP-implementation-plan-v2.md` — 12-week sprint roadmap with Step Zero
- `ARTEEP-design-change-log.md` — 86 entries (CL-001 through CL-086)
- `QA-INT-01-Dual-Verification-Rule.md` — foundational governance rule + compliance matrix
- `UC-HO-01_initiate-handover-session_v2.md`, `UC-HO-02_conduct-ai-guided-voice-interview_v2.md` — detailed UC specs

## How to add a mockup

When asked to add or update a mockup, follow this sequence. Do not invent a different structure.

1. **Pick a slug.** lowercase-kebab-case, descriptive: `ha-vy-handover-dashboard`, `minh-le-voice-interview-recording`, etc.
2. **Create the component file** at `components/mockups/<slug>.tsx`.
   - Must `export default` a React component.
   - Add `"use client";` at the top if the mockup uses hooks (`useState`, etc.).
   - Use Tailwind classes only. Use `lucide-react` for icons. Do not introduce new UI libraries without being asked.
   - Wrap the mockup in a top-level `<div className="min-h-screen bg-gray-50">` so it fills the route.
3. **Register it** in `lib/mockups-registry.ts`:
   - Add an `import` for the default export.
   - Add an entry to the `mockups` array with `slug`, `title`, `description`, `sprint`, `personas`, `useCases`, and optionally `tags`.
   - Keep entries roughly in sprint order (S0, SZ, S1, S2, S3, S4, S5, S6).
4. **(Optional) Wire a flow.** If the new mockup is part of a multi-step clickthrough, set `flow: { id, label, steps: [...] }` on every mockup in the flow. `steps` is an ordered array of slugs. The Prev/Next overlay appears automatically.
5. **Commit and push directly to `main`** with a short message describing what was added or changed. Vercel will redeploy in ~30s.

**Don't:**
- Don't create new routes outside `/m/[slug]`. The index page auto-lists every registered mockup.
- Don't fetch real data, hit external APIs, or add a backend. Mockups are static UI.
- Don't add database, auth, or session logic to a mockup. The only auth is the site-wide password gate in `middleware.ts`.
- Don't edit `app/`, `middleware.ts`, or `lib/auth.ts` unless explicitly asked — those are infrastructure.
- Don't open a PR unless the user asks for one. Direct push to `main` is the default for fast iteration.

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

## Personas (locked)

Hà Vy (Manager · Engineering) · Minh Lê (Offboarder · Engineering) · Trần Hữu Nam (Onboarder · Engineering) · Khánh Linh Trần (Offboarder · People & Culture, urgent) · Phương Anh Nguyễn (Offboarder · Sales) · An Quân Vũ (Platform Admin)

## Local dev

```bash
npm install
cp .env.example .env.local   # fill in MOCKUP_PASSWORD + MOCKUP_AUTH_TOKEN
npm run dev                  # http://localhost:3000
```

## Deployment

Vercel auto-deploys from `main`. Set `MOCKUP_PASSWORD` and `MOCKUP_AUTH_TOKEN` in the Vercel project's Environment Variables (Production + Preview + Development).
