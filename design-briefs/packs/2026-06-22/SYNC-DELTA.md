# Design sync delta — regenerate only what changed

The mockup moved since the designs were first generated from this pack. **Regenerate only the
stale frames below** in claude.ai/design — leave the unchanged ones alone. (Replace
`<your design system>` with the system you're restyling on, e.g. the Azure-accent one.)

## Stale — regenerate these 5

| Frame id | Why it's stale |
|---|---|
| `knowledge-graph-default` | KG gap-resolution change (resolved/dismissed nodes return to normal; gap buttons moved) |
| `knowledge-graph-from-session` | same KG change |
| `dashboard-offboarder-active-queue` | offboarder Dashboard is now their **session command view** (minimal sidebar; Overview = the question-queue dashboard) |
| `session-offboarder-capture-overview` | Overview tab is now the full question-queue dashboard (deadline, tiles, waiting + answered lists), not the old single card |
| `session-offboarder-capture-data` | **new frame** — offboarder Data tab is a flat answerable question queue |

### One prompt to regenerate just these 5 (paste into claude.ai/design)

> Regenerate ONLY these frames, leaving every other frame as-is:
> `knowledge-graph-default`, `knowledge-graph-from-session`, `dashboard-offboarder-active-queue`,
> `session-offboarder-capture-overview`, `session-offboarder-capture-data`.
> For each, read its brief `design-briefs/packs/2026-06-22/briefs/<id>.md` and screenshot
> `design-briefs/packs/2026-06-22/screens/<id>.png`. Reproduce the screen exactly — same regions,
> order, positions, and copy as the screenshot + the brief's Content contract. Apply
> `<your design system>` for the visual tokens (not the mockup's violet). Do them one at a time.

### Or one prompt per frame (highest fidelity)

> Generate a design from `design-briefs/packs/2026-06-22/briefs/<id>.md` and its screenshot
> `.../screens/<id>.png`. Reproduce it exactly; restyle the visuals on `<your design system>`.

## Unchanged — do NOT regenerate these 6

`dashboard-manager-active` · `all-sessions-list` · `session-manager-capture-overview` ·
`session-manager-capture-data` · `session-manager-deliver-overview` ·
`session-manager-complete-overview`

These manager/list screens' layout, copy, and chrome are unchanged this round. (The login is now
role-select and the in-app role switcher was removed, but the closed topbar pill looks the same,
so these frames don't change visually. Only the **offboarder** sidebar went minimal — already
covered by the offboarder frames above.)

## Interactive prototype — full re-gen

If you built the single interactive HTML (`design-briefs/INTERACTIVE-PROTOTYPE.md`), regenerate it
wholesale — the app *structure* changed in ways the wiring must reflect:
- login is a **role-select** (no password); the role persists; **no in-app role switcher** (the
  user pill just logs out)
- **offboarder** has a minimal sidebar (Dashboard only) and their Dashboard **is** the session view
- completed sessions route to the Knowledge Graph (not the command view)
- the manager "Departures pending" state shows the create-session "Upcoming departures" view

Re-run the `INTERACTIVE-PROTOTYPE.md` prompt; it reads `lib/view-matrix.ts` + the (now-updated)
briefs, so it picks up the new structure.
