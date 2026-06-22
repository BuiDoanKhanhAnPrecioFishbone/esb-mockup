# How to turn a mockup screen into a Figma design — designer guide

You work entirely in **claude.ai** (plus one screenshot, and Claude Desktop only at the very
end). The mockup app is the **source of truth** for the flow and what lives on each page — we
never ask Claude to invent a layout from scratch. Instead we hand it the real screen and say
"reproduce this." That's what kills the drift you've been seeing.

## Two things you can ask claude.ai/design for

- **Single screens (frames)** — the 4 steps below produce one faithful screen at a time. Best
  for redesigning a specific surface.
- **The whole app as one clickable HTML** — see **`design-briefs/INTERACTIVE-PROTOTYPE.md`**: a
  single standalone HTML that *behaves* like the mockup (log in by role, click the sidebar,
  switch tabs, advance the session lifecycle, log out). Use this when you want to click through
  the product like a prototype instead of viewing isolated frames.

The rest of this guide covers the single-screen flow.

## The 4 steps, every time

**1. Ask Claude to build the brief.**
In a chat inside the ART-EEP Project, name the screen you want — the route plus, for the
session view, which **step / role / tab**:

> *Follow `design-briefs/RECIPE.md` to build a brief for the session command view — Manager
> role, Capture step, Overview tab.*

Claude reads the repo and writes a brief with three parts: the **layout** (where things sit),
the **content** (exact text/numbers), and the **design system** (colors, type, spacing).

**2. Give it the screenshot.**
Claude will ask for one. Open the **live app** and **sign in by picking the role for this
screen** — the login is a role-select (no password), and the topbar chrome follows the role you
log in as. Then navigate to that exact screen and take a normal screenshot. Paste it into the
chat. That's the picture Claude uses to get the positions right — Claude can't open the app
itself, so this one capture is on you (takes 5 seconds). Make sure the app is showing the *same*
step/role/tab you asked for.

**3. Make the design in claude.ai/design.**
Start a new design, attach **the brief + the screenshot**, and paste this:

> *Reproduce this exact screen — same regions, same order, same relative positions and
> proportions as the screenshot. Do not invent, drop, reorder, or move pieces. Re-render the
> visuals on the design system in the doc. The screenshot is the layout contract, the outline
> is the content contract, the tokens are the style contract.*

Then **export the design to HTML.**

**4. Import into Figma (Claude Desktop).**
This is the only step the web version can't do. In **Claude Desktop**, with the Figma plugin
(`use-figma`) connected, ask it to import the exported HTML into Figma.

## Redesigning instead of copying

Same steps — just add what you want changed to the step-3 prompt, e.g. *"…reproduce the
regions and copy, but restyle the cards with softer shadows and more breathing room."* Keep
the **regions, their order, and the text** fixed; restyle freely. The mockup decides *what's on
the page*; you decide *how it looks*.

## Good to know

- **Which routes/states exist** — ask Claude "what routes and states can I make a brief for?"
  It reads the current route map from the repo (the app changes often, so don't rely on memory).
- **If the result drifts**, it's almost always because the screenshot was missing or was the
  wrong state. Re-attach the correct one and ask it to match the screenshot exactly.
- **Want to see a finished brief first?** Ask Claude to *"generate a sample brief now so I can
  see the format"* — it'll produce one live (none is kept in the repo, because the app changes
  too often for a saved example to stay accurate).
