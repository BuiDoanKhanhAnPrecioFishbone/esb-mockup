# Team guide — using Claude to update the mockup site

For PMs, POs, and designers. **No coding needed.** Just chat with Claude.

---

## The 30-second version

1. **Brainstorm** with Claude in a normal chat. Show sketches. Describe a flow. Let Claude draw artifacts.
2. When you're happy, say **"ship it"**.
3. **~60 seconds later**, the whole team can see your idea at the mockup site URL.

That's the whole loop.


## The three magic phrases

You don't need to remember which "skill" to use. Just say what you want in normal English. Claude figures out the rest.

### 🚢 "Ship it" — for everything

Use this most of the time. It's the no-think option.

> "ship it" · "save this" · "save everything" · "push this to the repo" · "sync this chat to the repo"

Claude will:
- Survey the chat for what's saveable
- Confirm in one sentence what it's about to do
- Save it, push it, and tell you the URL

### 🎨 "Save this artifact" — for a new mockup or page update

Use right after Claude has drawn / rendered something in the chat that you like.

> "save this artifact" · "put this on the mockup site" · "make this viewable" · "ship the artifact" · "update the dashboard with this" · "replace the Stages tab with this"

Claude figures out which page to update. If it's a new screen, it adds a new route. If it's a change to an existing page (the dashboard, a session tab, the sidebar), Claude edits that page directly. You get the URL to visit when it's done — typically `/`, `/session/[id]`, or a new route like `/admin/connectors`.

### 📝 "Log this decision" — for a rule we agreed on

Use when you've discussed something and want it remembered so **every future mockup follows the rule automatically**.

> "log this decision" · "update the context" · "save this rule" · "compact this chat"

Examples of decisions worth logging:

- "From now on, all critical states use a 2px rose left-edge accent."
- "Khánh Linh's offboard window is 1 day, not 2."
- "We're dropping the standalone PII screen from S2."
- "Sales persona needs Salesforce + LinkedIn, not just Salesforce."

Claude writes it into the project's design log. The next person (or the next mockup you ask for) will see the rule and follow it.

---

## Real chat examples

**Example 1: Ship a single artifact**

> You: "Draw the Minh Lê voice interview screen with the rose pulsing rings active, and a manager-priority badge on the live AI question."
>
> *(Claude renders a mockup artifact in chat.)*
>
> You: "Perfect — ship it."
>
> Claude: "I'll save this as `/m/minh-le-voice-interview-active`. Confirming now…"
>
> *(Claude commits and pushes.)*
>
> Claude: "Done. Visit `/m/minh-le-voice-interview-active` in ~60s once Vercel finishes."

**Example 2: Log a rule, then update mockups to match**

> You: "Let's say critical states always get a 2px rose left-edge accent, not just a badge."
>
> Claude: "Got it. Should I log that as a design rule?"
>
> You: "Yes, and update S2 and S3 to follow it."
>
> Claude: "I'll do two commits: first, log CL-087 in the design log; second, update S2 and S3 mockups with the new accent. OK?"
>
> You: "Yes."
>
> *(Claude does both, in that order.)*

**Example 3: Just log a decision, no mockup change**

> You: "Khánh Linh's window shrank to 1 day. Save that."
>
> Claude: "I'll log CL-088 and update §3 (personas) + §11 (TBDs). Confirming."

---

## Where you see results

- **Main URL:** the Vercel deployment (ask your tech lead for the link, then bookmark it).
- **Password:** the team password (ask verbally — don't share in chat or commits).
- **The site IS a real app.** Open the main URL and you land on Hà Vy's dashboard. Use the left sidebar to navigate to a session, the spec traces, or the team guide.
- **Key routes:**
  - `/` — Dashboard
  - `/session/new` — Quick initiate
  - `/session/minh-le` and `/session/phuong-anh` — Session command view
  - `/spec` — Spec walkthroughs (UC-HO-01 normal flow + edge cases)
  - `/guide` — This guide

Claude tells you the route when it ships. Deploys take **~60 seconds**. If you don't see your update after a minute, hard-refresh (Ctrl+Shift+R / Cmd+Shift+R).

---

## Frequently asked

**What if I don't like the artifact Claude drew?**
Keep iterating in chat — *"make the header bigger"*, *"swap rose for yellow"*, *"add a save button"*. The artifact updates in place. Only say "ship it" when you're happy.

**Can I edit the mockup directly on the site?**
No. Every change goes through chat → commit → deploy. That way nothing is ever lost — you can always revert.

**What if I make a mistake?**
Tell Claude: *"undo the last commit"* or *"revert what you just did"*. Claude can roll it back.

**Can I add a new persona or use case?**
Yes. Discuss with Claude, then say *"log this decision"*. From that point on, the new persona/UC is part of the project context — Claude will know about them in every future chat.

**I want to rename or delete a mockup. How?**
Just ask: *"rename /m/old-slug to /m/new-slug"* or *"delete the s1 v1 mockup, we're done comparing"*. Claude handles it.

**Several of us are working in parallel — will we step on each other?**
Each person's "ship it" is a separate commit. As long as you're not editing the same file at the same exact second, you're fine. If a conflict happens, Claude will tell you and ask how to resolve.

**My teammate isn't getting the update — what's wrong?**
Check that they're on the right URL and that they hard-refreshed. The deploy takes ~60s; if it's been longer than 2 minutes and still missing, ping your tech lead — there may be a build error.

**Do I need to install the skills somewhere?**
No. The skills live in the repo and are already wired into the shared **Claude.ai Project**. As long as you're chatting inside that project, the workflow rules load on every chat automatically — no per-skill upload, no per-browser install. The Project's pinned files + GitHub connector do all the work.

**What if I forgot to use the project and Claude doesn't know the workflow?**
You'll notice it — Claude won't fire "ship it" reliably and may ask basic questions about the repo. Two options: (a) start over in a chat inside the `esb-mockup` project, or (b) in the current chat, paste *"Please read `CLAUDE.md` and `ARTEEP-context-snapshot.md` from the connected GitHub repo and follow the workflows there."* That nudge gets you back on track.

---

## Quick reference card

| You want to… | Say this in chat |
|---|---|
| Save the artifact Claude just drew | *"save this artifact"* or *"ship the artifact"* |
| Save a rule or decision you agreed on | *"log this decision"* or *"update the context"* |
| Save everything from this chat (mixed) | *"ship it"* or *"save everything"* |
| See it live | Open the route Claude tells you — e.g. `/`, `/session/minh-le`, or a new route |
| Undo something | *"revert the last commit"* or *"undo what you just did"* |
| Update an existing page | *"on the dashboard, change X to Y, then ship"* or *"in the Stages tab, …"* |
| Add a brand-new page | *"add a /knowledge-graph page that shows ... then ship"* |
| Tweak the app sidebar | *"add a 'Reports' link to the sidebar pointing to /reports, then ship"* |

---

## Need help?

- **Bug in a mockup or wrong design?** Just chat with Claude to fix it, then ship.
- **Claude is confused about the project?** Ask it to *"read `ARTEEP-context-snapshot.md` and `CLAUDE.md` first"*. Those files are the project's memory.
- **Something feels broken?** Ping your tech lead — there may be a deploy error visible in Vercel.

Have fun. The whole point is that you can move from idea → live mockup faster than the team can finish reading a Slack thread about it.
