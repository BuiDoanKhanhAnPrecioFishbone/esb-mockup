# ART-EEP — Knowledge Graph: Scale + Animation (2025-07-15)

*Apply via Claude Code. Delete after verified.*
*Do NOT merge with `CL-session-2025-07-09-kg-corrections.md` — that file has its own items (KG-07–12). Apply that one first, then this one.*
*⚠️ OVERRIDE: Skip KG-10 (gap nodes) from the 07-09 file — gaps should NOT appear as nodes in the Knowledge Graph.*

---

## KG-13: Even slower node animation ✅ LOCKED (replaces original KG-13)

**File:** `components/mockups/knowledge-graph-explorer.jsx`

**Issue:** KG-05 reduced animation speed, but nodes still move too fast. They need to be significantly calmer — gentle drift, not bouncing.

**Fix:** Further reduce the force simulation parameters:
- `alphaDecay`: increase to 0.05+ (nodes lose energy faster → settle sooner)
- `velocityDecay`: increase to 0.6+ (more friction → slower movement)
- `alpha` initial: reduce to 0.1 (start with less energy)
- Link force strength: reduce (weaker pull → less oscillation)

**Target behavior:** Nodes should barely move once settled. A very slow, gentle drift — like objects floating in calm water. NOT bouncing, NOT oscillating, NOT jittering.

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

**This adds ~9 chunk nodes**, bringing the total from ~20 to ~30+ nodes.

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

**Updated node taxonomy (NO gap nodes):**

| Level | Type | Color | Radius | Example |
|---|---|---|---|---|
| 0 (center) | Person | Gray (#6b7280) | 14px | Minh Lê |
| 1 | Module | Gray (#9ca3af) | 12px | Payment Service |
| 2 | Card (knowledge) | Purple (#7c3aed) | 8-12px (by centrality) | Kafka retry configuration |
| 3 | Chunk | Light purple (#a78bfa) | 6px | DLQ routing |

**No gap nodes.** Gaps are tracked in the session (gap lists, Data Validation), not visualized as nodes in the Knowledge Graph.

**Progressive disclosure:** On initial load, only Levels 0-2 are visible (Person, Modules, Cards). Clicking/expanding a card node reveals its Level 3 chunks. This prevents the graph from being overwhelming on first render while allowing the presenter to "zoom in" during the demo.

Alternatively, if progressive disclosure is too complex for the mockup, show all levels by default but position chunks close to their parent cards so they cluster naturally.

---

## Verification checklist

**Animation:**
- [ ] Nodes settle quickly and barely move once settled
- [ ] No bouncing, oscillating, or jittering
- [ ] Gentle drift only — like objects floating in calm water
- [ ] `alphaDecay` ≥ 0.05, `velocityDecay` ≥ 0.6

**Chunks & Scale:**
- [ ] 2-3 cards broken into chunks (9+ chunk nodes)
- [ ] Chunk nodes are lighter purple (#a78bfa) and smallest (6px)
- [ ] Chunks connected to parent card with thin solid lines
- [ ] At least 2 cross-chunk edges connecting chunks across different cards
- [ ] Cross-chunk edges are dashed violet, thinner than cross-module edges
- [ ] Total visible nodes ≈ 30+ (significantly denser than before)
- [ ] Graph looks like a real knowledge graph, not a folder tree

**No gaps in graph:**
- [ ] Zero yellow gap nodes in the graph
- [ ] Node taxonomy: Person, Module, Card, Chunk only — no Gap type
- [ ] KG-10 from the 07-09 file is skipped/overridden

---

*End of corrections. Apply via Claude Code. Delete after verified.*
