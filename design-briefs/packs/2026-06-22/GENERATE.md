# How to generate the designs from this pack (claude.ai/design)

The designer's claude.ai/design has this repo connected, so every brief **and** screenshot in
this pack is readable directly — no manual screenshotting needed. Pick one of two modes.

## Mode A — one prompt for the whole pack (fast)

Paste this into claude.ai/design:

> Read `design-briefs/packs/2026-06-22/manifest.md`. For **every** state listed there, generate
> a faithful design frame:
> - Read its brief `design-briefs/packs/2026-06-22/briefs/<id>.md` and its screenshot
>   `design-briefs/packs/2026-06-22/screens/<id>.png`.
> - **Reproduce the screen exactly** — same regions, order, positions, proportions, and copy as
>   the screenshot and the brief's Content contract. Do not invent, drop, reorder, or move pieces.
> - Style it on each brief's **Style contract** (the design-system tokens).
> - The screenshot is the layout authority; the brief's Content contract is the copy authority;
>   the Style contract is the styling authority. If you can't open a PNG, the brief's Layout
>   contract is a complete text spec — use it.
>
> Produce **one labeled frame per state**, and work through them **one at a time, in manifest
> order**, so each gets full attention. Start now and don't stop until every state is done.

## Mode B — one prompt per brief (highest fidelity)

For dense screens (e.g. the Data tab) where Mode A drifts, do them individually:

> Generate a design from `design-briefs/packs/2026-06-22/briefs/<id>.md` and its screenshot
> `design-briefs/packs/2026-06-22/screens/<id>.png`. Reproduce it exactly — same regions, order,
> positions, and copy; restyle only the visuals on the brief's design system.

## Why "one at a time"

Generating many screens in a single pass splits the model's attention and details drift — the
exact problem this pipeline exists to prevent. Mode A is still a single prompt, but it instructs
claude.ai/design to treat each frame as its own task. Use Mode B when a screen must be pixel-faithful.

## After generating
Export each design → HTML, then (in **Claude Desktop**, the only non-web step) import the HTML
into Figma via the `use-figma` plugin. See `design-briefs/DESIGNER-GUIDE.md`.
