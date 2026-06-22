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
   - **App / UI changes** — any JSX artifact Codex rendered, any in-chat agreement to edit a specific surface ("update the dashboard's session card"), any agreement to add a new route ("build /admin/connectors"), or any tweak to the sidebar / notifications / top bar. All of these go through `apply-to-mockup`.
   - **Written decisions** — any design rule, CL-worthy entry, persona change, sprint status shift, UC behavior change, new/resolved TBD, or QA-INT-01 status update. These go through `update-context`.
2. **Pick the plan based on what's present:**
   - Only UI changes → run `apply-to-mockup` rules only (see `.Codex/skills/apply-to-mockup/SKILL.md` and the "How to update the app" section of `AGENTS.md`).
   - Only written decisions → run `update-context` rules only (see `.Codex/skills/update-context/SKILL.md` and the "How to update context" section of `AGENTS.md`).
   - **Both** → run `update-context` **first**, then `apply-to-mockup`. Two separate commits. The UI work consumes the freshly-updated context.
   - Neither → tell the user there's nothing saveable yet and stop. Don't push empty commits.
3. **Confirm before writing files.** One short paragraph: *"I'll log CL-### (…) via update-context, then edit the Settings tab via apply-to-mockup. Two commits. OK?"* Name the route or surface, not a slug. Skip the confirm only if the user explicitly says to ("just ship it, no preview").
4. **Execute each sub-workflow in full** — read its target files, follow its rules (CL numbering, file-routing cheat sheet, palette guards, never-touch list), and push each as its own commit with the commit-message format that sub-workflow specifies.
5. **Report at the end:**
   - For context: CL IDs added and snapshot §sections touched.
   - For UI: the route(s) the user should open (e.g. `/`, `/session/minh-le?tab=settings`, or a brand-new `/admin/connectors`), the file(s) changed, and a reminder that Vercel takes ~60s.
   - Both commit SHAs / URLs if available.

## Never

- Don't merge a context change and a mockup change into one commit. Always two separate commits when both apply.
- Don't reverse the order when both apply — context always lands first, so the mockup commit can reference the new state.
- Don't invent a third workflow. Anything that doesn't fit `apply-to-mockup` or `update-context` is out of scope for this skill — escalate to the user.
- Don't push if nothing changed.
- Don't open a PR unless the user asks. Direct push to `main` is the default for both sub-workflows.
- Don't touch `middleware.ts`, `app/api/auth/`, `app/login/`, or any infrastructure file. Those are off-limits for both sub-workflows.

## Quick examples

- *"Ship it"* after Codex rendered a new Stages-tab artifact AND you discussed a new "rose 2px critical accent" rule →
  1. `update-context`: log `CL-###` for the rose 2px rule, bump §4 of the snapshot.
  2. `apply-to-mockup`: swap the new `StagesTab` JSX into `components/mockups/session-command-view.jsx`, push.
  3. Tell the user to open `/session/minh-le?tab=stages` once Vercel finishes (~60s).
- *"Save everything"* after only a discussion (no artifact, no specific surface mentioned) → `update-context` only.
- *"Save this"* right after an artifact appeared (e.g. a new admin page) → `apply-to-mockup` only — adds the new surface + route + sidebar entry.
- *"Update the dashboard to show the manager-priority badge and ship it"* → `apply-to-mockup` only — edits `ha-vy-handover-dashboard.jsx`. No context change, no second commit.
