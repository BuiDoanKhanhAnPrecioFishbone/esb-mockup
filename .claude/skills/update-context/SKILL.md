---
name: update-context
description: Capture decisions, new CL entries, persona/UC/sprint changes, or design-rule shifts from this conversation back into the esb-mockup repo so future apply-to-mockup calls work from current state. Use when the user wraps up a brainstorm, says "save this to the repo", "update the context", "log this decision", "compact this chat", or "/update-context".
---

# update-context

Persists decisions made in this chat into the repo's source-of-truth files (`ARTEEP-context-snapshot.md`, `docs/arteep/ARTEEP-design-change-log.md`, the matching UC spec) so the next contributor — or the next `apply-to-mockup` call — sees them.

Think of this as **"compaction to the repo"** — what `apply-to-mockup` is for visuals, this is for the written context that drives those visuals.

## When to use

The conversation has produced decisions or shifts that affect future mockup work but haven't been written down yet. Typical triggers:

- A new design rule was agreed ("from now on, all critical states use a 2px rose left-edge accent")
- A new CL entry should be logged (anything that would warrant a CL-### in the design change log)
- A persona's role, status, or details changed; a new persona was added
- A use case was added, retired, scoped, or its behavior shifted
- Sprint status changed (e.g., S2 just finished its palette migration; SZ moved from PENDING to IN PROGRESS)
- A TBD was resolved or a new TBD was raised
- The QA-INT-01 compliance picture changed for a clause

Use even for small changes — many small CL entries beat one big retroactive edit later.

**Not for visual artifacts or app changes.** If the user wants to save a JSX artifact Claude generated in chat, update a part of the app (dashboard, a session tab, the sidebar), or add a new route, that's `apply-to-mockup`'s job — not this one. If they want both — log the decision *and* update the UI to follow it — do this skill **first** (so the new context is the source of truth), then chain into `apply-to-mockup` as a second commit.

## What to do

Always:

1. **Read what's already there** before touching anything:
   - `ARTEEP-context-snapshot.md` at the repo root (current state-of-the-project)
   - `docs/arteep/ARTEEP-design-change-log.md` — **scan for the highest existing `CL-###` and use the next sequential number**
   - `docs/arteep/ARTEEP-master-uc-index.md` if a use case is involved
   - The specific spec in `docs/arteep/UC-*.md` if that UC's behavior changed
2. **List what you're about to capture** to the user in one short paragraph before writing files. Use the user's own phrasing where possible. If anything is ambiguous (especially the "why"), ask before continuing.
3. **Make surgical edits, not rewrites.** Preserve heading hierarchy, table formatting, and surrounding context.

Then for each captured change:

1. **New design decision, rule, or visual change → append a CL entry** in `docs/arteep/ARTEEP-design-change-log.md`:
   - Use the next sequential `CL-###` ID.
   - Match the format of existing entries: sentence-case title, the rationale in 1–3 sentences, the affected sprint/UC/component, and any superseded prior CL if relevant.
2. **State-of-the-project change → targeted edit in `ARTEEP-context-snapshot.md`**:
   - Personas → §3
   - Design system / palette / visual rules / UX writing → §4
   - Use cases → §5
   - Sprint roadmap status → §6
   - Step Zero scope/blockers → §7
   - QA-INT-01 compliance status → §8
   - Artifact inventory → §9
   - CL summary one-liners → §10 (add under the right theme group)
   - Pending decisions / TBDs → §11
3. **UC-level behavior change → update the specific `docs/arteep/UC-*.md`** and bump its version line at the top of the file.
4. **Commit and push to `main`** with a message that names the CL IDs added and the snapshot sections touched. Example:
   ```
   context: log CL-087 (canonical badge on hover) + CL-088 (rose 2px accent rule); bump §4 visual rules and §10 summary
   ```

Never:

- Don't invent CL numbers. Always grep the change log file for the current highest `CL-###` and add 1. If two entries are added in one commit, they get consecutive IDs (CL-087, CL-088).
- Don't restructure the snapshot beyond the targeted edits. The numbered §sections, the tables, and the footer are load-bearing for downstream readers (including `apply-to-mockup`).
- Don't capture things that are still being deliberated. If the user is mid-thought, ask whether to log the final position or just a TBD entry.
- Don't touch `components/mockups/`, `components/app/`, or anything under `app/` from this skill — that's `apply-to-mockup`'s territory. This skill writes only to docs.
- Don't open a PR unless the user explicitly asks. Direct push to `main` is the default, matching the rest of the workflow.
- Don't modify `middleware.ts`, `app/api/auth/`, or `app/login/`.

## After pushing

Report back, briefly:

- New CL IDs added, with the one-line rationale for each.
- Snapshot sections updated (by §number).
- The branch and commit SHA / URL if available.
- A note that the next `apply-to-mockup` call — from this chat or any future one — will now see the new context.

If a captured change implies a follow-up UI edit (e.g., "all critical states use a 2px rose left-edge accent" → the dashboard's urgent session card already uses this pattern but the Settings Danger Zone doesn't), say so explicitly and offer to chain into `apply-to-mockup`. Reference the affected surface by route, not by abstract sprint name (`/`, `/session/<id>?tab=settings`).
