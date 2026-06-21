# Setting up the claude.ai Project (for Tram)

This is what to configure once so every chat in the Project "just works" for the
mockup → brief → claude.ai/design → Figma flow. Your designer then only needs the
`DESIGNER-GUIDE.md` steps.

## 1. Connect the repo (you've done this)
The Project has the **GitHub connector** pointed at `esb-mockup`. That's what lets Claude read
`RECIPE.md`, the mockup components, and the design system without anyone pasting files. Keep it
on the **`main`** branch (the connector reads what's pushed, not local work).

## 2. Paste this into the Project's custom instructions
Project settings → **Instructions** → paste:

```
This Project works on ART-EEP, a product mockup. The repo `esb-mockup` is connected via
GitHub and is the SOURCE OF TRUTH for the app's flow and what lives on each page.

When asked to design or redesign a screen:
- Follow `design-briefs/RECIPE.md` exactly to produce a brief (layout + content + design-system
  contracts), then ask for a screenshot of that screen from the deployed app.
- Never invent a layout from scratch. Reproduce the real screen; restyle only when asked.
- Use the locked design system: the "Design system (locked)" section of `CLAUDE.md` and
  `ARTEEP-context-snapshot.md` §4 (violet brand / yellow gaps / emerald verified / rose critical;
  light mode; mono for IDs, timestamps, counts; sentence-case; named humans; "sensitive content"
  not "PII"; no "playbook" wording).

The mockup decides WHAT is on the page; the designer decides HOW it looks.
```

## 3. (Optional but recommended) Upload two files as Project knowledge
The connector reads the repo on demand, but uploading these as Project files makes the design
system always-present and a touch more reliable:
- `ARTEEP-context-snapshot.md` — the canonical design system, personas, use cases.
- `design-briefs/RECIPE.md` — so the recipe is available even if a connector read is slow.

Re-upload them if they change materially. (If you'd rather not maintain copies, skip this —
the GitHub connector still reads them live.)

## 4. What you do NOT need
- No local setup, no Node, no Playwright, no terminal for the designer.
- The screenshot step uses the **already-deployed** app — nothing to run locally.
- Only the **final HTML → Figma** step needs Claude **Desktop** + the `use-figma` plugin; the
  rest is claude.ai web.

## The division of labor, in one line
GitHub connector gives Claude the **flow + content + tokens**; the designer's screenshot gives
it the **positions**; claude.ai/design renders it; Claude Desktop pushes it to Figma.
