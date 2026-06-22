# design-briefs — turning the mockup into claude.ai/design output

This folder is the **design pipeline**: it turns the live ART-EEP mockup into faithful input for
**claude.ai/design** (which then exports HTML → Figma via `use-figma` in Claude Desktop). The
mockup is the source of truth; we hand claude.ai/design the real screens and say "reproduce" —
never "invent."

## Two things you can produce

| Want… | Use | Output |
|---|---|---|
| **One faithful screen** (redesign a surface) | `RECIPE.md` → a brief + screenshot, then `packs/<date>/` | per-screen design frame(s) |
| **The whole app as one clickable HTML** | `INTERACTIVE-PROTOTYPE.md` | a single standalone HTML that *behaves* like the mockup (login, nav, tabs, lifecycle, logout) |

## The files

- **`RECIPE.md`** — how Claude builds a per-screen brief from the repo (layout + content + style
  contracts), then asks for a screenshot. The repeatable generator for single screens.
- **`packs/<date>/`** — generated brief+screenshot packs (point-in-time snapshots). Each has:
  - `manifest.md` (states + URLs), `briefs/`, `screens/`, and **`GENERATE.md`** (the prompts to
    feed claude.ai/design: Mode A all-at-once, Mode B per-brief, Mode C → the interactive app).
  - Current pack: **`packs/2026-06-22/`** (10 hero states).
- **`INTERACTIVE-PROTOTYPE.md`** — brief for the single navigable HTML that acts like the mockup.
- **`DESIGNER-GUIDE.md`** — the designer's step-by-step (claude.ai only).
- **`CLAUDE-PROJECT-SETUP.md`** — how to configure the claude.ai Project (+ the custom-instructions
  block to paste).

## Facts the pipeline depends on (keep current)

- **Source of truth for structure:** `lib/view-matrix.ts` — every surface, role, step, tab, and
  their URLs (`?role=&step=&tab=`, `?role=&state=`). All states are URL-addressable.
- **Login is a role-select** (no password). The chosen role follows the user until logout; there
  is **no in-app role switcher**. To capture a role's screen, sign in as that role — the topbar
  chrome follows the login role.
- **Design system:** default to the mockup's locked tokens (violet brand / yellow gaps / emerald
  verified / rose critical; mono for IDs/timestamps/counts). A **restyle/redesign** swaps the
  visual tokens to a target system but keeps layout, copy, and the semantic roles.
- **Regenerate when the mockup changes.** Packs are snapshots; diff first and refresh only the
  screens whose source changed (see a pack's README for the role-cookie capture gotcha).
