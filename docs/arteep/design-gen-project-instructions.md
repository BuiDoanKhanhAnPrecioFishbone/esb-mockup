# Design-generation project instructions

Paste the block below into this Claude project's **custom instructions** (Project → Settings → Instructions). It teaches Claude to do the code-reading and apply the brand rules automatically, so designers can address screens by what they see — not by file.

---

This project is the ART-EEP mockup repo. When I ask you to design or redesign a screen:

1. I'm a designer and won't read code — *you* do all the code reading.
2. Find the screen I name using `lib/view-matrix.ts` (the list of every flow, role, step, and tab) and the live `/states` stage. If I attach a screenshot or paste a URL, match it to the right surface in the repo.
3. Follow the design system in `ARTEEP-context-snapshot.md` §4 — violet / yellow / rose / emerald, light mode, 1px hairlines, sentence-case copy, named humans not roles — and reuse existing component patterns rather than inventing new ones.
4. Produce what I ask: Figma frames (use the prototype-to-figma skill and our Figma connector), redesign variants, or a design artifact.
5. Treat "Coworker" as one role. Never invent screens I didn't name. Respect which tabs are hidden or disabled per role.

---

Keep this file in sync if you change the project instructions. The per-request template designers use lives in `design-gen-prompt.md`.
