# ART-EEP — The Automated Handover Knowledge Lake

### When someone leaves, their knowledge stays.

---

## The problem

Every time a senior engineer, a key account owner, or a head of operations walks out the door, a decade of judgment walks out with them. Not the documents — those stay. The *tacit* knowledge: why a workaround exists, which client hates surprises, which part of the codebase is held together with hope. Today that knowledge survives only in a rushed exit interview and a folder nobody reopens. New hires spend two months rediscovering what the last person already knew.

Knowledge doesn't leave because people are careless. It leaves because nothing was built to catch it.

---

## The solution

**ART-EEP** turns the messy, human act of "handing over" into an automated, governed pipeline that ends in a living **Knowledge Graph** — a Knowledge Lake the company owns, that gets richer with every departure instead of poorer.

It works in three planes:

**1 · Capture.** ART-EEP starts by pulling structured history from the tools a team already lives in — for the POC, that's **Trello**, the company's primary system today. It doesn't scrape blindly: a four-layer hard-filter strips the noise before a single token is spent — backlog clutter, empty cards, and administrative chatter are dropped; real "In Progress / Review / Done" work, bug and architecture labels, and genuine discussion are kept.

Then ART-EEP turns to the people who actually know what's missing. It notifies the departing employee's network — teammates, manager, coach — and asks two things: *what do you still need to know from them?* and *did we get anything wrong?* Those questions flow into a queue the departing employee answers in their own words, alongside any files they choose to upload, at their own pace. No scheduled interview, no bottleneck — capture happens asynchronously, led by the person who holds the knowledge and steered by the people who depend on it.

**2 · Verify.** Nothing reaches the graph unchecked. Captured content runs a sanitization pipeline — secrets and personal data are redacted by regex at zero cost, toxic comments are neutralized into objective facts, and Microsoft Purview stands as the final, mandatory compliance gate. A human reviews every draft side-by-side with its source and signs off before anything commits. Provenance is visible on every fact; canonical truths are marked distinctly from merely-verified ones.

**3 · Consume.** The successor doesn't get a folder — they get a graph they can *ask*. It opens calm, showing one node and its closest links, and expands only when you double-click, so it never becomes a hairball. The AI Copilot offers one-tap starting points ("Show risks"), zooms to the answer, and dims the rest. Hovering any node shows a one-line summary instantly, at zero token cost, because the summary was written once when the graph was built. A Timeline and a Heatmap let a manager see how a project actually evolved and where the effort really went.

---

## What makes it smart, not just big

- **The team corrects before the graph commits.** Anyone in the departing employee's network can flag a captured fact as wrong or thin — and that flag becomes a task for the departing employee to fix, *before* the content ever reaches the graph. Flags ride existing permissions: you can only question what you could already see, so nothing is exposed that wasn't already.
- **Security that invites, then protects.** Operational nodes show a lock and a "Request access" button — you can see that knowledge *exists* and ask for it. Truly sensitive or legal content is ghosted entirely: it never appears, never leaks. Tiers are assigned automatically from signals the system already computes — no manual tagging.
- **Trust that never sleeps, attention that's rationed.** When someone flags an error after commit, the node is instantly marked "under review" so no one acts on contested knowledge — but the fix never auto-commits. Critical-path errors alert a manager in real time; routine ones batch into a weekly digest. Nothing rots: anything ignored too long escalates. A human always signs off.
- **Cost discipline by design.** The hard-filter, the pre-computed hover summaries, the token-free flag routing, and the "ask a clarifying question before answering" routing all exist for one reason — to keep the token budget honest while the system scales.

---

## Why it wins

> **Data Gravity creates Vendor Lock-in.**

The more institutional knowledge accumulates in ART-EEP, the more indispensable it becomes — and the harder it is to ever leave. That's the business moat in one sentence.

Two numbers prove it:

- **Time-to-Productivity** — new-hire ramp from **2 months to 2 weeks**.
- **Tacit Knowledge Capture Rate** — *X* risk factors and *Y* undocumented procedures captured automatically **before** an employee's last day, instead of zero after it.

---

## The 3-minute demo

A platform admin connects Trello once. A manager opens a dashboard of departing employees, each shown as a clean three-phase journey — **Prepare · Capture · Deliver**. One click starts a session; the four-layer filter visibly drops the noise as Trello seeds the graph, and the departing engineer's network is invited to ask what they still need and flag anything the AI got wrong. The engineer uploads what matters and answers the question queue in their own words. The manager reviews and signs. The successor opens the Knowledge Graph, asks "Show risks," watches it light up the path — and hits a locked node they can request access to. Finally, someone reports an error: it's flagged under review, triaged, approved, and propagated across the graph. Knowledge, caught.

---

## How it scores

| Hackathon axis | Weight | How ART-EEP earns it |
|---|---|---|
| **Agentic Workflow** | 40% | Planner-orchestrated capture → verify → commit pipeline; four-layer ingestion filter; auto-derived network solicitation; automated tiering and triage |
| **Human-in-the-Loop** | 40% | The network asks and corrects before commit; mandatory sign-off before any write; side-by-side provenance diff; "request access" and "under review" flows keep a human in control |
| **Token Efficiency** | 20% | Four-layer hard-filter, zero-cost regex redaction, pre-computed hover summaries, token-free flag routing, prompt disambiguation before retrieval |

---

*ART-EEP — the handover that finally sticks.*
