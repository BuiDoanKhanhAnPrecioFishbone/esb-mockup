# Patch Instructions for ARTEEP-design-change-log.md

**Target file:** `docs/arteep/ARTEEP-design-change-log.md`
**Insert location:** Immediately BEFORE the line `---` that precedes `## Pending Decisions (Need Stakeholder Input)`
**Action:** Insert the following block:

---

## Consumer Plane Knowledge Graph Explorer (grill-me session · 2026-06-15)

*12 design decisions locked via a grill-me session stress-testing every interaction pattern for the Consumer Plane KG explorer (`/knowledge-graph`). Built and shipped to the live mockup in the same session.*

### CL-121 — Consumer Plane KG Explorer: 12 locked design decisions + initial build

| Field | Value |
|---|---|
| Date | 2026-06-15 |
| Sprint | Consumption plane (S-KG) |
| Change | The Consumer Plane Knowledge Graph Explorer at `/knowledge-graph` is designed, stress-tested, and built with 12 locked decisions. **Entry points:** two — sidebar (department-first default) and from-session (person-centered, deferred). **POC scope:** Engineering department only; 1–2 past handovers (Thanh Đức, Mar 2026) as graph history alongside Minh Lê (Jun 2026). **Graph structure:** modules as primary nodes, people as provenance metadata (not structural layer). Knowledge survives the person leaving. **Card taxonomy (POC-scoped):** 2 statuses (Draft → Verified), 2 gap types in UI (Auto-detected · Human-created), 2 Q&A states (Pending · Satisfied). Canonical status dropped from session view — pitch-only concept, not rendered. **Visual weight:** equal across all entries regardless of age. Draft/Verified is the only quality signal. No time-based dimming. Time-slider noted as future enhancement. **Chat:** static mock with pre-written exchanges and pre-mapped node highlights. 5 Quick Start chips (Show risks · Critical paths · Auth flow · Deploy pipeline · Incident response). **Node design:** minimal circles (option A), not rich rectangles. Color encodes structural role (purple = knowledge nodes, gray = structural/system, yellow = gap-flagged). Size encodes depth (department large, module medium, entry small). **Edge design:** solid for hierarchy (department→module→entry), dashed for cross-links (entry→entry across modules). One visual style per category. Relationship type (depends, relates, uses) shown in the side panel on click, not on the graph. Referenced Claude Code's "How the Pieces Connect" graph as precedent — one edge style, meaning from connection structure. **Chat bar:** persistent bottom bar, always visible. AI Copilot label + 5 Quick Start chips + free-text input. Responses appear inline AND highlight relevant nodes on graph. **Side panel:** opens on click with type-specific hero section. Module hero: entry count + verified/draft split + gap count + provenance (NO readiness percentage — readiness is a session metric, not a Consumer Plane concept). Entry hero: status badge + knowledge content. "Ask about this" chip at bottom of every panel pre-fills the chat bar with a contextual question. **Interaction loop:** graph → hover tooltip (0 tokens, pre-computed) → click panel → "Ask about this" → chat bar → response highlights nodes → click next. The AI is woven into the exploration, not sitting in a separate box. **Module stats:** entry count + verified/draft split + gap count. No readiness %, no progress bar. Readiness was a Management Plane session metric; the Consumer Plane has no target. **Mock data:** 7 modules (Payment · Auth · Database · CI/CD · Monitoring · Rate Limiting · Infrastructure as Code), 19 entries, 5 gap-flagged entries, 2 system nodes (Azure Key Vault · PagerDuty), 16 cross-link edges with relationship labels. Provenance spans two contributors (Minh Lê + Thanh Đức). |
| UC Reference | Consumption plane · implements CL-094 (interaction model) · implements CL-110 (company-wide default — partially; POC scoped to Engineering) · implements CL-113 (no playbook, KG is the single consumption artifact) · compounds with CL-096 (MASTER.md design system scoped to Consumer plane) |
| Why | The grill-me session stress-tested each decision against POC constraints (3-minute demo, 40% Agentic Workflow scoring, build time). Key simplifications vs the original architecture: Canonical status dropped from session view (no prior commits exist in POC to inherit), 7 gap subtypes collapsed to 2 in UI (detail text still explains what was detected), readiness % removed from Consumer Plane (it's a session metric). The Claude Code architecture reference ("Six Key Abstractions" graph) informed two decisions: one edge style (not multiple visual types) and color encoding structural role (not category). The "Ask about this" bridge between panel and chat was the modern UX addition — creates an AI-native exploration loop rather than a static graph browser. |
| Decided By | PO (Tram) via grill-me + BA (Claude) |
| Category | Architectural Decision (Consumer Plane) · Visual System (graph design) · UX Refinement (interaction model) |

**The 12 locked decisions in summary:**

| # | Decision | Rationale |
|---|---|---|
| 1 | Two entry points: sidebar (dept-first) vs session (person-centered) | Different default views for different contexts |
| 2 | Engineering only for POC, department nodes as default | One department with variety, not three thin departments |
| 3 | 1–2 past handovers as graph history | Sells "accumulated knowledge" not "personal wiki" |
| 4 | Modules as primary structure, people as provenance | Knowledge survives the person leaving |
| 5 | Equal visual weight, Draft/Verified only, no time decay | Verification status > recency; stale ≠ irrelevant |
| 6 | Static mock chat with pre-written exchanges | Demo reliability > live AI impressiveness |
| 7 | Minimal circles, color by role, size by depth | Cleanest at zoom; degrades gracefully; presenter narrates |
| 8 | Solid hierarchy, dashed cross-links, type in panel | One edge style per Claude Code precedent |
| 9 | Purple = knowledge, gray = structural, yellow = gaps | Two colors + one accent, same as Claude Code |
| 10 | Chat bar bottom, always visible, chips + input | Always visible for demo; no "open" step needed |
| 11 | Hover tooltip + side panel + "Ask about this" chip | Two-tier progressive disclosure + AI bridge |
| 12 | No readiness %, module shows count + verified/draft + gaps | Readiness is a session metric, not a KG metric |

---

**Also update the Pending Decisions table:** Add row:

| **Consumer Plane KG Explorer (CL-121)** | **BUILT 2026-06-15 — 12 decisions locked via grill-me; initial build shipped to `/knowledge-graph`. Session entry point (from-session, person-centered) deferred.** | S-KG | PO (built) |
