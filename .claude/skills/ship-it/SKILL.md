---
name: ship-it
description: One-shot dispatcher that surveys the current chat and saves whatever is saveable to the repo — visual artifacts via apply-to-mockup, written decisions via update-context, or both in the correct order. Use when the user says "ship it", "save this", "save everything", "sync to repo", "push this to the repo", "wrap this up", "compact this chat to the repo", or "/ship-it" and you don't want them to think about which underlying skill to fire.
---

# ship-it

A thin router. Looks at what the current chat produced, picks the right downstream workflow(s), and runs them in order. Owns no file-writing logic of its own — delegates to `apply-to-mockup` and `update-context`.

## When to use

The user wants to persist the chat's work to the repo with a single ask, in the most natural phrasing:

- "ship it"
- "save this" / "save everything"
- "sync this chat to the repo"
- "push this to the repo"
- "wrap this up and commit"
- "compact this to the repo"
- "/ship-it"

If the user is explicit about which workflow they want (e.g. *"save this artifact"* → only mockup; *"log this decision"* → only context), prefer the specific skill directly. `ship-it` is for the ambiguous "save what we just did" case.

## What to do

1. **Survey the chat for saveable output.** Identify each independently:
   - **Visual artifacts** — any JSX/React artifact Claude rendered (this turn or recent turns) that the user wants live at `/m/<slug>`. Includes "remix this existing mockup with X change."
   - **Written decisions** — any design rule, CL-worthy entry, persona change, sprint status shift, UC behavior change, new/resolved TBD, or QA-INT-01 status update.
2. **Pick the plan based on what's present:**
   - Only visual artifacts → run `apply-to-mockup` rules only (see `.claude/skills/apply-to-mockup/SKILL.md` and the "How to add a mockup" section of `CLAUDE.md`).
   - Only written decisions → run `update-context` rules only (see `.claude/skills/update-context/SKILL.md` and the "How to update context" section of `CLAUDE.md`).
   - **Both** → run `update-context` **first**, then `apply-to-mockup`. Two separate commits. The mockup work consumes the freshly-updated context.
   - Neither → tell the user there's nothing saveable yet and stop. Don't push empty commits.
3. **Confirm before writing files.** One short paragraph: "I'll log CL-### (…) via update-context, then ship `/m/<slug>` via apply-to-mockup. OK?" Use the user's own phrasing. Skip the confirm only if the user explicitly told you to skip ("just ship it, no preview").
4. **Execute each sub-workflow in full** — read its target files, follow its rules (CL numbering, slug conventions, palette guards, never-touch list), and push each as its own commit with the commit-message format that sub-workflow specifies.
5. **Report at the end:**
   - For context: CL IDs added and snapshot §sections touched.
   - For mockup: slug(s) shipped, `/m/<slug>` route(s), reminder that Vercel takes ~60s.
   - Both commit SHAs / URLs if available.

## Never

- Don't merge a context change and a mockup change into one commit. Always two separate commits when both apply.
- Don't reverse the order when both apply — context always lands first, so the mockup commit can reference the new state.
- Don't invent a third workflow. Anything that doesn't fit `apply-to-mockup` or `update-context` is out of scope for this skill — escalate to the user.
- Don't push if nothing changed.
- Don't open a PR unless the user asks. Direct push to `main` is the default for both sub-workflows.
- Don't touch `middleware.ts`, `app/api/auth/`, `app/login/`, or any infrastructure file. Those are off-limits for both sub-workflows.

## Quick examples

- *"Ship it"* after Claude rendered an artifact and you discussed a new "rose 2px critical accent" rule →
  1. `update-context`: log `CL-###` for the rose 2px rule, bump §4
  2. `apply-to-mockup`: save the artifact at `/m/<slug>`
- *"Save everything"* after only a discussion (no artifact) → `update-context` only.
- *"Save this"* right after an artifact appeared and no rules were discussed → `apply-to-mockup` only.
