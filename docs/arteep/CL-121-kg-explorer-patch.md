# Patch Instructions for ARTEEP-design-change-log.md

**Target file:** `docs/arteep/ARTEEP-design-change-log.md`
**Insert location:** Immediately BEFORE the line `---` that precedes `## Pending Decisions (Need Stakeholder Input)`
**Action:** Insert the following block:

---

## Consumer Plane Knowledge Graph Explorer (grill-me session · 2026-06-15)

*15 design decisions locked via a grill-me session stress-testing every interaction pattern for the Consumer Plane KG explorer (`/knowledge-graph`). Built and shipped to the live mockup in the same session, including the from-session entry point.*

### CL-121 — Consumer Plane KG Explorer: 12 locked design decisions + initial build

| Field | Value |
|---|---|
| Date | 2026-06-15 |
| Sprint | Consumption plane (S-KG) |
| Change | The Consumer Plane Knowledge Graph Explorer at `/knowledge-graph` is designed, stress-tested, and built with 12 locked decisions. **Entry points:** two — sidebar (department-first default) and from-session (person-centered via chat pre-fill — see CL-122). **POC scope:** Engineering department only; 1–2 past handovers (Thanh Đức, Mar 2026) as graph history alongside Minh Lê (Jun 2026). **Graph structure:** modules as primary nodes, people as provenance metadata (not structural layer). Knowledge survives the person leaving. **Card taxonomy (POC-scoped):** 2 statuses (Draft → Verified), 2 gap types in UI (Auto-detected · Human-created), 2 Q&A states (Pending · Satisfied). Canonical status dropped from session view — pitch-only concept, not rendered. **Visual weight:** equal across all entries regardless of age. Draft/Verified is the only quality signal. No time-based dimming. Time-slider noted as future enhancement. **Chat:** static mock with pre-written exchanges and pre-mapped node highlights. 5 Quick Start chips (Show risks · Critical paths · Auth flow · Deploy pipeline · Incident response). **Node design:** minimal circles (option A), not rich rectangles. Color encodes structural role (purple = knowledge nodes, gray = structural/system, yellow = gap-flagged). Size encodes depth (department large, module medium, entry small). **Edge design:** solid for hierarchy (department→module→entry), dashed for cross-links (entry→entry across modules). One visual style per category. Relationship type (depends, relates, uses) shown in the side panel on click, not on the graph. Referenced Claude Code's "How the Pieces Connect" graph as precedent — one edge style, meaning from connection structure. **Chat bar:** persistent bottom bar, always visible. AI Copilot label + 5 Quick Start chips + free-text input. Responses appear inline AND highlight relevant nodes on graph. **Side panel:** opens on click with type-specific hero section. Module hero: entry count + verified/draft split + gap count + provenance (NO readiness percentage — readiness is a session metric, not a Consumer Plane concept). Entry hero: status badge + knowledge content. "Ask about this" chip at bottom of every panel pre-fills the chat bar with a contextual question. **Interaction loop:** graph → hover tooltip (0 tokens, pre-computed) → click panel → "Ask about this" → chat bar → response highlights nodes → click next. The AI is woven into the exploration, not sitting in a separate box. **Module stats:** entry count + verified/draft split + gap count. No readiness %, no progress bar. Readiness was a Management Plane session metric; the Consumer Plane has no target. **Mock data:** 7 modules (Payment · Auth · Database · CI/CD · Monitoring · Rate Limiting · Infrastructure as Code), 19 entries, 5 gap-flagged entries, 2 system nodes (Azure Key Vault · PagerDuty), 16 cross-link edges with relationship labels. Provenance spans two contributors (Minh Lê + Thanh Đức). |
| UC Reference | Consumption plane · implements CL-094 (interaction model) · implements CL-110 (company-wide default — partially; POC scoped to Engineering) · implements CL-113 (no playbook, KG is the single consumption artifact) · compounds with CL-096 (MASTER.md design system scoped to Consumer plane) |
| Why | The grill-me session stress-tested each decision against POC constraints (3-minute demo, 40% Agentic Workflow scoring, build time). Key simplifications vs the original architecture: Canonical status dropped from session view (no prior commits exist in POC to inherit), 7 gap subtypes collapsed to 2 in UI (detail text still explains what was detected), readiness % removed from Consumer Plane (it's a session metric). The Claude Code architecture reference ("Six Key Abstractions" graph) informed two decisions: one edge style (not multiple visual types) and color encoding structural role (not category). The "Ask about this" bridge between panel and chat was the modern UX addition — creates an AI-native exploration loop rather than a static graph browser. |
| Decided By | PO (Tram) via grill-me + BA (Claude) |
| Category | Architectural Decision (Consumer Plane) · Visual System (graph design) · UX Refinement (interaction model) |

### CL-122 — From-session KG entry point: Deliver-only, chat pre-fill, auto-fire

| Field | Value |
|---|---|
| Date | 2026-06-15 |
| Sprint | Consumption plane (S-KG) · Management plane (session detail) |
| Change | The from-session entry point to the KG explorer is designed and built with 3 locked decisions. **(1) Deliver completion only.** The "Explore in Knowledge Graph" link appears only on the Complete state (step 5) of `/session/[id]`, not on Overview or any pre-commit state. Pre-commit, the knowledge isn't in the KG — showing a link would mislead. The link is a `<Link>` (not a button) pointing to `/knowledge-graph?prompt=minh-le`. **(2) Chat pre-fill, not URL filter.** The KG page always opens department-first (CL-110 preserved). The `?prompt=minh-le` param pre-fills the chat bar with "Show me Minh Lê's contributions" and auto-fires the static response. This avoids contradicting CL-110 (company-wide default, not person-centered), Decision #4 (modules as primary structure, not people), and Decision #5 (equal visual weight, not person-filtered dimming). A URL filter (`?person=minh-le`) was rejected because it would re-center the KG around one individual, which is what CL-110 explicitly designed away from. **(3) Auto-fire on mount.** The KG component reads `window.location.search` on mount via a `useEffect([], [])`. If `prompt=minh-le`, it expands Minh Lê's 6 modules, highlights their entries, shows the response in the chat bar, then cleans the URL via `history.replaceState` to `/knowledge-graph`. The user can clear the focus to see the full department graph. **Stale text cleanup (bonus).** `session-deliver.jsx` CompleteOverview updated: "Trần Hữu Nam can access it through Onboarding Playbooks" → "available to the team in the Knowledge Graph" (CL-113 no playbook, CL-114 no named successor). "Your answers propagate to Trần Hữu Nam's playbook" → "Your answers will be available to the team in the Knowledge Graph." |
| UC Reference | Consumption plane · Management plane · compounds with CL-110 (company-wide default preserved) · CL-113 (no playbook — KG link replaces playbook CTA) · CL-114 (no successor — team-oriented language) |
| Why | Three alternatives were grilled. (A) URL param filter was rejected — contradicts CL-110, Decision #4, Decision #5. (B) Camera zoom was rejected — too subtle, no visible "you came from a session" signal. (C) Chat pre-fill won — uses the existing interaction loop (chip → response → highlight), preserves CL-110 department-first default, creates a strong demo moment ("we came from Minh's session, the AI shows his contributions, but clear focus and see the full department graph"). The Deliver-only placement was chosen because pre-commit the knowledge isn't in the KG yet. |
| Decided By | PO (Tram) via grill-me + BA (Claude) |
| Category | UX Refinement (entry point design) · implements CL-110 · cleans up CL-113/CL-114 stale text |

**The 12 + 3 locked decisions in summary:**

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
| 13 | From-session entry: Deliver completion only | Pre-commit the knowledge isn't in the KG |
| 14 | From-session entry: chat pre-fill, not URL filter | Preserves CL-110 dept-first; uses existing interaction loop |
| 15 | From-session entry: auto-fire on mount, clean URL | Seamless transition; user can clear to see full graph |

---

**Also update the Pending Decisions table:** Replace the CL-121 row with:

| **Consumer Plane KG Explorer (CL-121 + CL-122)** | **BUILT 2026-06-15 — 15 decisions locked via grill-me; KG explorer shipped to `/knowledge-graph`; from-session entry point wired on Complete state via `?prompt=minh-le` chat pre-fill.** | S-KG | PO (built) |
