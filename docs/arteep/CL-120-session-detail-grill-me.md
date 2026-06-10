# CL-120 — Session Detail Page: Data Architecture, Q&A Model, Knowledge Gaps, Approval Flow, and Stage Transitions

| Field | Value |
|---|---|
| Date | 2026-06-10 |
| Sprint | POC build · Management plane (session detail page) |
| Change | Comprehensive grill-me session resolving 23 design decisions for the `/session/[id]` Data tab, Side-Panel interaction, Q&A model, knowledge gap detection, approval flow, and stage transitions. All decisions build on CL-119 (3-view × 3-tab restructure + Side-Panel UX). Logged as a companion document to keep the main change log file manageable. |
| UC Reference | UC-HO-01 (session lifecycle) · UC-HO-04 (Manager review → now Side-Panel inline) · UC-HO-08 (network knowledge requests) · CL-119 (3-view × 3-tab + Side-Panel) · CL-091 (Trello POC source) · CL-099 (async capture model) |
| Why | The Data tab is the primary working surface for all three roles. These decisions lock the data architecture, interaction model, and approval flow so the build can proceed without mid-build redesigns. |
| Decided By | PO (Tram) + BA (Claude) — grill-me format |
| Category | Architectural Decision (significant) · UX Refinement · Performance (token efficiency) |

---

## Decisions Locked

### Data Architecture

**1. One-way data.** Ingested data lives in our Staging Graph (Azure AI Search). No write-back to Trello ever. Updated data stays in our system.

**2. Board = project for POC.** The Trello board is the natural project boundary. Module registry (renames, merges, creates, deletes) persists at the board level in the Knowledge Graph, so the next offboarder from the same board inherits the corrected taxonomy.

**3. AI-derived modules/features.** After ingestion and chunking, the system uses AI to identify feature/module names (e.g. "Payment Service", "Inventory Sync", "CI/CD Pipeline") and clusters cards into those modules. Not Trello's native lists or labels.

**4. Module management — all four operations.** Users can: (A) rename a module (inline double-click), (B) merge two modules (drag all cards then delete empty), (C) create a new module (button at bottom), (D) delete/collapse a module (move cards to Uncategorized). Changes persist in KG at the board level per decision #2.

### Data Tab Structure

**5. Accordion: Board → Module → Card.** Two levels of accordion. Board is the top-level group (multiple boards possible per offboarder). Inside each board, AI-derived modules are the second level. Cards are the leaf nodes clicked to open the Side Panel.

**6. Side Panel (CL-119 confirmed).** ~480px right-side slide-in drawer, body scrollable. Layout top-to-bottom: card detail (title, description, checklist, metadata) → gaps (if any for this card) → Q&A section → answer input. Closes on backdrop click, Escape, or X button.

**7. Side Panel in Prepare = card detail + gaps + add questions.** No answering yet — the offboarder hasn't been notified. Manager and stakeholders can add questions during Prepare so the question queue is ready when Capture starts.

**8. Side Panel in Capture = full Q&A interaction.** Answer input (text + file upload) active. Stakeholders can add more questions + mark Satisfied. Manager can Approve/Reject.

### Q&A Model

**9. Three entry points for questions:**
- **(A) Card level** — stakeholder opens Side Panel for a specific card, types a question. Auto-tagged to that card.
- **(B) Module/feature level** — stakeholder adds a question at the module header, then selects which cards inside that module the question relates to. This is the cross-card question path.
- **(C) Out of scope** — a question that doesn't belong to any existing card or module. Becomes a knowledge gap (see decision #14).

**10. Single answer + re-ask (not threads).** A question gets one answer. The asker then marks "Satisfied" (closes the question) or writes a new, more specific follow-up question auto-linked to the original. Structurally flat — each Q&A is one pair, independently trackable. The link between original and follow-up preserves context. No thread UI, no infinite back-and-forth.

**11. Questions build during Prepare, get answered during Capture.** By the time the offboarder logs in, a complete question queue (AI-generated + Manager + stakeholder questions) is waiting. No cold start.

**12. Questions are first-class entities linked to cards, not children of cards.** A cross-card question shows on all referenced cards' Side Panels. The answer lives on the question, not the card — so answering from card A's panel makes the answer visible on cards B and C too.

### Knowledge Gaps

**13. Two-tier gap detection model:**
- **Tier 1: 4 metadata checks (zero token cost):** missing description, incomplete checklist, high-priority but not done, stale card (no recent activity).
- **Tier 2: 2 AI-powered checks (piggybacked on module clustering prompt, near-zero marginal cost):** (B) implicit knowledge detection — spots tribal knowledge references like "ask Minh about this", "the usual process", "verbal agreement"; (D) contradiction detection — flags conflicting information between cards.

**14. Human-created gaps.** Stakeholder out-of-scope questions (entry point C) auto-become knowledge gaps. The question attaches to the gap; when answered, the gap resolves.

**15. Visual distinction by origin.** System-derived gaps show a bot icon; human-created gaps show the stakeholder's avatar. Both behave the same way (answerable, resolvable).

**16. Trimmed AI gap types for cost optimization.** Cut from the original 5 AI types: (A) semantic gap (high token cost per card), (C) coverage gap (subjective, easy to hallucinate), (E) dependency gap (Trello cards rarely have explicit cross-references). Kept: (B) implicit knowledge + (D) contradiction — highest signal, near-zero marginal cost.

### File Uploads

**17. Two attachment points:** (A) file attached to an answer — stakeholder asks "upload the Kafka config doc", offboarder uploads it as part of their answer; (C) file attached to a module header — covers the entire module, not one specific card. No standalone card-level upload (B was cut).

### Approval Flow — Minimal

**18. Zero gates during Capture.** Asker marks "Satisfied" (acknowledgment, not approval). No Manager involvement during Capture.

**19. One gate at Deliver.** Manager reviews per-module readiness summary, clicks "Commit to Knowledge Graph." QA-INT-01 §1.4 satisfied with one action.

**20. Four total Manager touchpoints across the entire handover:** (1) Review crawl results during Prepare, (2) Click "Move to Capture", (3) Optionally click "Move to Deliver" (or wait for auto-transition), (4) Click "Commit to KG".

### Stage Transitions

**21. Capture → Deliver: automatic with timeout + manual override.** System auto-transitions when either (a) all questions answered + all askers satisfied, OR (b) a deadline threshold hits (e.g. 7 days before offboarder's last day). Whichever comes first. Manager can manually click "Move to Deliver" at any point without waiting.

### Overview Tab per Stage

**22. Overview Prepare:** top-level summary (total cards across all boards, board count, gap count, stakeholder count) → board accordions with per-board stats (cards kept/skipped/redacted, status summary, module count, gap count).

### Logs Tab

**23. Flat chronological list + filter chips:** All · System · Questions · Files · Edits. No search, no date picker, no pagination for POC.

### Deliver Phase

**24. Overview Deliver:** per-module readiness summary (✓ all satisfied / ⚠ pending). One "Commit to Knowledge Graph" button. After commit: confirmation state ("Committed to Knowledge Graph · X entries · Y answers · Z files"), session closed. No playbook (CL-113), no successor (CL-114).

---

## Supersession Notes

- The knowledge gap model here **refines** the earlier "topics with no Trello coverage" framing from the Prepare stage build — gaps are now concrete (metadata checks + AI detection + human-created), not abstract topic inference.
- The module-based accordion structure **supersedes** the label-category-based accordion used in the current deployed mockup (Architecture decisions / Bug/Hotfix / etc.). Those categories were a placeholder; the real grouping is AI-derived modules.
- The single-answer + re-ask model **supersedes** any thread/chat-box implications from CL-119's original Side-Panel description.
- The zero-gate Capture + one-gate Deliver approval flow **simplifies** the CL-119 Approve/Reject/Ignore action set — those actions still exist in the Manager's Side-Panel during Capture as optional data-quality actions, but they are not gates. The only mandatory gate is the Deliver commit.

---

*End of CL-120. This companion document is referenced from the main change log (`ARTEEP-design-change-log.md`) to keep that file at a manageable size.*
