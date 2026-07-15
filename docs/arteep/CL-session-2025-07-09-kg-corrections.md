# ART-EEP — Knowledge Graph Corrections (2025-07-09)

*Apply via Claude Code. Delete after verified.*

---

## KG-07: Rename "Ask about this dept" → "Ask about this employee" ✅ LOCKED

**File:** `components/mockups/knowledge-graph-explorer.jsx`

The KG is scoped to a single offboarder (Minh Lê), not a department. The chat pre-fill chip or action text that says "Ask about this dept" must say "Ask about this employee" or "Ask about Minh Lê".

---

## KG-08: Remove "Cross-link" label + rename concept ✅ LOCKED

**File:** `components/mockups/knowledge-graph-explorer.jsx`

**Issue:** "Cross-link" is vague and meaningless to users. It appears on the center node and in the legend.

**Fix:**
- Remove "Cross-link" label from the center node (Minh Lê). The center node is just the offboarder — it doesn't need a type label.
- Replace "Cross-link" in the legend with descriptive edge types:

**Updated legend:**

| Visual | Label |
|---|---|
| Purple filled circle | Knowledge (cards) |
| Gray filled circle | Structure (modules, person) |
| Yellow filled circle | Gap (unresolved) |
| Solid line | Hierarchy (module → card) |
| Dashed line | Cross-reference (semantic relationship) |

Do NOT use the term "Cross-link" anywhere in the UI.

---

## KG-09: Add cross-module edges to demonstrate real graph mechanics ✅ LOCKED

**File:** `components/mockups/knowledge-graph-explorer.jsx`

**Issue:** The current graph is a tree (Employee → Module → Card) drawn as circles. This fails to demonstrate Knowledge Graph value. Judges will recognize it as a folder structure.

**Fix:** Add **cross-module edges** — dashed violet lines connecting cards across different modules that share semantic content.

**Required cross-module edges (add to mock data):**

| Card A | Module A | Card B | Module B | Why they connect |
|---|---|---|---|---|
| Kafka retry configuration | Payment Service | GitHub Actions workflow | CI/CD Pipeline | Both reference deployment error handling |
| Datadog dashboard | Monitoring & Alerts | Payment gateway timeout | Payment Service | Monitoring watches this service's timeouts |
| Stripe webhook handler | Payment Service | PagerDuty escalation | Monitoring & Alerts | Webhook failures trigger alert escalation |
| Docker image caching | CI/CD Pipeline | Helm chart templates | Infrastructure as Code | Both part of the deployment pipeline |

**Edge rendering:**
- Cross-module edges: dashed line, violet/indigo color (#6366f1), stroke-dasharray="6,4"
- Hierarchy edges: solid line, gray (#d1d5db)
- The force simulation should position cross-referenced nodes closer together (increase link strength for cross-edges)

---

## KG-10: Add gap nodes to the graph ✅ LOCKED

**File:** `components/mockups/knowledge-graph-explorer.jsx`

**Issue:** Gaps are currently shown only as a list in the Insights panel. They should also appear as NODES in the graph, connected to the cards that detected them.

**Fix:** Add gap nodes as yellow circles connected to their source cards:

**Gap nodes to add:**

| Gap | Connected to (source cards) | Module |
|---|---|---|
| No disaster recovery | Kafka retry config, Payment gateway timeout | Payment Service |
| No error escalation process | Stripe webhook handler | Payment Service |
| No alert routing documented | PagerDuty escalation | Monitoring & Alerts |

**Node rendering:**
- Gap nodes: yellow fill (#eab308), smaller than knowledge nodes (8px radius vs 10px)
- Gap edges: dashed line, yellow color (#eab308), stroke-dasharray="4,4"
- Gap node label: the gap description (truncated to ~25 chars)
- On hover: show full gap description in tooltip

---

## KG-11: Node sizing by centrality ✅ LOCKED

**File:** `components/mockups/knowledge-graph-explorer.jsx`

**Issue:** All knowledge nodes are the same size. Hub nodes (cards with many connections) should be visually larger to show importance.

**Fix:** Scale node radius based on connection count:

| Connections | Radius | Example |
|---|---|---|
| 1 (leaf) | 8px | A card with only its module connection |
| 2-3 | 10px | A card with module + 1 cross-reference |
| 4+ (hub) | 12px | A card with module + cross-refs + gap links |

The center node (Minh Lê) stays at 14px (largest). Module nodes stay at 12px.

This creates visual hierarchy: hub knowledge nodes stand out as important connectors in the graph.

---

## KG-12: Updated node taxonomy for legend and tooltips ✅ LOCKED

**File:** `components/mockups/knowledge-graph-explorer.jsx`

**Final node + edge types:**

**Nodes:**

| Type | Color | Size | Description |
|---|---|---|---|
| Person (center) | Gray (#6b7280) | 14px | The offboarder (Minh Lê) |
| Module (structural) | Gray (#9ca3af) | 12px | Knowledge modules (Payment Service, etc.) |
| Knowledge (card) | Purple (#7c3aed) | 8-12px (by centrality) | Cards/chunks of knowledge |
| Gap | Yellow (#eab308) | 8px | Unresolved knowledge gaps |

**Edges:**

| Type | Style | Color | Description |
|---|---|---|---|
| Hierarchy | Solid | Gray (#d1d5db) | Module → Card, Person → Module |
| Cross-reference | Dashed (6,4) | Violet (#6366f1) | Semantic relationship across modules |
| Gap link | Dashed (4,4) | Yellow (#eab308) | Gap detected from / relates to card |

---

## Verification checklist

- [ ] "Ask about this dept" → "Ask about this employee" or "Ask about Minh Lê"
- [ ] "Cross-link" removed from center node and all UI text
- [ ] Legend shows: Knowledge (purple), Structure (gray), Gap (yellow), Hierarchy (solid), Cross-reference (dashed)
- [ ] At least 4 cross-module dashed edges visible in the graph
- [ ] Cross-referenced cards visually closer together (force simulation)
- [ ] 3 gap nodes (yellow circles) visible, connected to source cards
- [ ] Gap nodes smaller than knowledge nodes (8px vs 10px)
- [ ] Hub nodes (4+ connections) visually larger (12px)
- [ ] Leaf nodes smaller (8px)
- [ ] Graph looks like a GRAPH with lateral connections, not a tree

---

*End of corrections. Apply via Claude Code. Delete after verified.*
