# Design-gen prompt template (for designers)

You don't need to read code. Address screens by what you see.

## Step 1 — find your screen
Open **/states** ("Design states" in the sidebar, under More). It's your menu of every screen in the app:

- **Matrix** mode shows every screen at once as live thumbnails.
- Each frame is labeled like `Coworker · Capture · Data` (role · step · tab).
- Click a frame to open it full-size, or screenshot it.

## Step 2 — send this in the project chat

```
Screen: <the /states label, e.g. "Coworker · Capture · Data" — or attach a screenshot, or paste the URL>
Make: <mirror to Figma / redesign / 2–3 variants / explore a different layout>
Direction: <optional, in design terms — e.g. "calmer and less dense", "make the primary action obvious", "keep our palette">
```

## Examples

- **Screen:** Coworker · Capture · Data. **Make:** Figma frames of this exact screen, one per state. **Direction:** none — just mirror it.
- **Screen:** Manager · Deliver · Overview (screenshot attached). **Make:** 2 redesign variants. **Direction:** reduce density, make "Commit to KG" the obvious primary action, keep violet + emerald.
- **Screen:** Prepare stage (URL pasted). **Make:** explore a calmer layout for the automated cascade. **Direction:** less busy, clearer step progression.

## Tips

- Screenshot + label together is the most reliable address.
- For a *new* design (not just mirroring), add one line of intent: the user's goal + the primary action on that screen.
- Claude reads the repo and applies the design system automatically (set in the project instructions) — you don't need to mention files or colors unless you want to override them.

> Today this is most reliable for the **session command view**. Other flows work too, but until their states are fully enumerated, give a bit more direction (or a screenshot) so Claude has something to anchor to.
