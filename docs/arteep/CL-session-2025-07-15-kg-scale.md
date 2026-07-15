# ART-EEP — Knowledge Graph: Gaps + Scale (2025-07-15)

*Apply via Claude Code. Delete after verified.*
*Do NOT merge with `CL-session-2025-07-09-kg-corrections.md` — that file has its own items (KG-07–12). Apply that one first, then this one.*

---

## KG-13: Gap nodes in the Knowledge Graph ✅ LOCKED

**File:** `components/mockups/knowledge-graph-explorer.jsx`

**Issue:** Gaps are not visualized in the final Knowledge Graph. The graph only shows cards and modules — there's no representation of WHERE knowledge is missing.

**Fix:** Add gap nodes as yellow circles in the graph, connected to the cards/modules that identified them.

**Gap nodes to add (from session mock data):**

| Gap name | Module | Connect to (source cards) |
|---|---|---|
| No disaster recovery | Payment Service | Kafka retry config, Payment gateway timeout |
| No error escalation process | Payment Service | Stripe webhook handler |
| No alert routing documented | Monitoring & Alerts | PagerDuty escalation, Datadog dashboard |

**Node rendering:**
- Fill: yellow (#eab308)
- Radius: 8px (smaller than knowledge nodes)
- Border: 1px solid #ca8a04
- Label: gap description truncated to ~25 chars, full text on hover tooltip
- Gap edges: dashed yellow line (#eab308), stroke-dasharray="4,4"

**Position:** Gap nodes should cluster near their source cards (not floating randomly). The force simulation should pull gap nodes toward the cards they connect to.

**Interaction:** Clicking a gap node opens the gap detail in the side panel (same as clicking from the Insights heatmap).

---

## KG-14: Add chunk-level depth for scale ✅ LOCKED

**File:** `components/mockups/knowledge-graph-explorer.jsx`

**Issue:** The graph is only 3 levels deep (Person → Module → Card ≈ 20 nodes). This looks small and doesn't demonstrate the scale or depth of a real Knowledge Graph. Real GraphRAG systems decompose documents into semantic chunks for embedding and retrieval.

**Fix:** Add a 4th level of depth by breaking 2-3 cards into **semantic chunks**. Each chunk is a smaller knowledge unit extracted from the parent card.

**Chunk nodes to add:**

| Parent card | Chunks |
|---|---|
| Kafka retry configuration | DLQ routing · Backoff strategy · Poison message handling |
| GitHub Actions workflow | Build pipeline · Deployment approval · Staging auto-deploy |
| Stripe webhook handler | Event processing · Refund flow · Failure alerting |

**This adds ~9 chunk nodes**, bringing the total from ~20 to ~30+ nodes (with gaps from KG-13, total ≈ 35 nodes).

**Node rendering for chunks:**
- Fill: lighter purple (#a78bfa / violet-400) — distinguishable from card nodes (violet-600)
- Radius: 6px (smallest knowledge nodes)
- Border: none
- Label: chunk name (short, 2-3 words)
- Edges to parent card: thin solid line, lighter gray (#e5e7eb)

**Cross-chunk edges (the graph payoff):**
Some chunks connect to chunks in OTHER cards, demonstrating semantic relationships at the granular level:

| Chunk A | Card A | Chunk B | Card B | Why |
|---|---|---|---|---|
| Failure alerting | Stripe webhook | PagerDuty escalation | (card-level) | Webhook failures trigger alerts |
| DLQ routing | Kafka retry config | Build pipeline | GitHub Actions | Both reference the CI/CD error path |

These cross-chunk edges are dashed violet (same as cross-module edges from KG-09) but thinner (1px vs 1.5px).

**Node taxonomy update (full hierarchy):**

| Level | Type | Color | Radius | Example |
|---|---|---|---|---|
| 0 (center) | Person | Gray (#6b7280) | 14px | Minh Lê |
| 1 | Module | Gray (#9ca3af) | 12px | Payment Service |
| 2 | Card (knowledge) | Purple (#7c3aed) | 8-12px (by centrality) | Kafka retry configuration |
| 2 | Gap | Yellow (#eab308) | 8px | No disaster recovery |
| 3 | Chunk | Light purple (#a78bfa) | 6px | DLQ routing |

**Progressive disclosure:** On initial load, only Levels 0-2 are visible (Person, Modules, Cards, Gaps). Clicking/expanding a card node reveals its Level 3 chunks. This prevents the graph from being overwhelming on first render while allowing the presenter to "zoom in" during the demo.

Alternatively, if progressive disclosure is too complex for the mockup, show all levels by default but position chunks close to their parent cards so they cluster naturally.

---

## Verification checklist

**Gaps:**
- [ ] 3 gap nodes visible as yellow circles in the graph
- [ ] Gap nodes connected to their source cards with dashed yellow lines
- [ ] Gap nodes smaller than knowledge nodes (8px vs 10px)
- [ ] Gap nodes cluster near their source cards (not floating)
- [ ] Gap hover shows full description
- [ ] Gap click opens detail in side panel

**Chunks & Scale:**
- [ ] 2-3 cards broken into chunks (9+ chunk nodes)
- [ ] Chunk nodes are lighter purple (#a78bfa) and smallest (6px)
- [ ] Chunks connected to parent card with thin solid lines
- [ ] At least 2 cross-chunk edges connecting chunks across different cards
- [ ] Cross-chunk edges are dashed violet, thinner than cross-module edges
- [ ] Total visible nodes ≈ 30-35 (significantly denser than before)
- [ ] Graph looks like a real knowledge graph, not a folder tree

---

*End of corrections. Apply via Claude Code. Delete after verified.*
