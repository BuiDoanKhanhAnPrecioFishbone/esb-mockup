# Setting up the claude.ai Project (for Tram)

One Project does both jobs — **building the mockup** and **producing briefs for
claude.ai/design**. This is what to configure once so every chat routes to the right one.
The designer then only needs the `DESIGNER-GUIDE.md` steps for the brief job.

## 1. Connect the repo (you've done this)
The Project has the **GitHub connector** pointed at `esb-mockup`. That's what lets Claude read
`RECIPE.md`, the mockup components, and the design system without anyone pasting files. Keep it
on the **`main`** branch (the connector reads what's pushed, not local work).

## 2. Paste this into the Project's custom instructions
Project settings → **Instructions** → paste:

```
This Project works on ART-EEP, a product mockup. The repo `esb-mockup` is connected via
GitHub (branch main) and is the SOURCE OF TRUTH for the app's flow and what's on each page.
Always confirm the current route map and design system from CLAUDE.md before relying on
memory — the app changes often. Note: the app logs in by ROLE (a role-select page, no
password); the chosen role follows the user until logout, and there is no in-app role switcher.

First decide which of two jobs I'm asking for, then behave accordingly:

A) UPDATE THE APP — triggers like "add/change/update <surface>", "put X on the dashboard",
   "save this artifact", "ship it".
   → Follow CLAUDE.md "How to update the app" (the apply-to-mockup workflow): edit the
     smallest matching file in components/mockups, components/app, or app/**/page.tsx, keep
     visual fidelity, then commit and push to main via the connector. If a written decision
     is also involved, do context first then mockup, as two separate commits.

B) DESIGN FOR claude.ai/design — READ-ONLY (never edit components or commit). Two output modes:
   • SINGLE SCREEN (frames) — triggers "make a brief for <screen>", "redesign <screen>".
     Follow design-briefs/RECIPE.md: produce a brief (layout + content + design-system
     contracts) and ASK me for a screenshot of that screen from the deployed app (I sign in by
     role first). The brief is the deliverable; I carry it to claude.ai/design.
   • WHOLE APP (one interactive HTML) — triggers "build the interactive prototype", "one HTML
     that behaves like the mockup", "clickable prototype".
     Follow design-briefs/INTERACTIVE-PROTOTYPE.md exactly.
   Reproduce regions/order/copy faithfully. Default to the mockup's locked design system; when
   I ask for a restyle/redesign, swap the visual tokens to the target system but keep layout,
   copy, and behavior.

Design system reference (defaults): "Design system (locked)" in CLAUDE.md and
ARTEEP-context-snapshot.md §4 — violet brand / yellow gaps / emerald verified / rose critical;
light mode; mono for IDs, timestamps, counts; sentence-case; named humans; "sensitive content"
not "PII". A restyle/redesign may remap the accent but keeps these semantic roles.

Entry point for the design pipeline: design-briefs/README.md lists every doc and mode.
```

## 3. (Optional but recommended) Upload two files as Project knowledge
The connector reads the repo on demand, but uploading these as Project files makes the design
system always-present and a touch more reliable:
- `ARTEEP-context-snapshot.md` — the canonical design system, personas, use cases.
- `design-briefs/RECIPE.md` — so the recipe is available even if a connector read is slow.
- `design-briefs/README.md` — the design-pipeline index (which doc/mode to use).

Re-upload them if they change materially. (If you'd rather not maintain copies, skip this —
the GitHub connector still reads them live.)

## 4. What you do NOT need
- No local setup, no Node, no Playwright, no terminal for the designer.
- The screenshot step uses the **already-deployed** app (sign in by role; no password) —
  nothing to run locally.
- Only the **final HTML → Figma** step needs Claude **Desktop** + the `use-figma` plugin; the
  rest is claude.ai web.

## The division of labor, in one line
GitHub connector gives Claude the **flow + content + tokens**; the designer's screenshot gives
it the **positions**; claude.ai/design renders it; Claude Desktop pushes it to Figma.
