#!/usr/bin/env node
// Run locally: node scripts/apply-cl120-patches.js
// Then: git add -A && git commit -m 'context: apply CL-120 patches' && git push

const fs = require('fs');

// === CHANGELOG PATCH ===
let cl = fs.readFileSync('docs/arteep/ARTEEP-design-change-log.md', 'utf8');

// Insert CL-120 section before Pending Decisions
const cl120Section = `---\n\n## Session Detail Page \u00b7 Data Architecture & Interaction Model (grill-me session \u00b7 2026-06-10)\n\n### CL-120 \u2014 Data tab restructure, Q&A model, knowledge gaps, approval flow, stage transitions (companion doc)\n\n| Field | Value |\n|---|---|\n| Date | 2026-06-10 |\n| Sprint | POC build \u00b7 Management plane (session detail page) |\n| Change | 24 design decisions resolving the Data tab data architecture (board \u2192 AI-derived modules \u2192 cards), Q&A interaction model (single answer + re-ask), knowledge gap detection (4 metadata + 2 AI piggybacked on clustering + human-created), minimal approval flow (zero gates during Capture, one \"Commit to KG\" at Deliver), file uploads (on answer + on module), stage transitions (auto with timeout + manual override), and Logs tab (flat + filter chips). Full details in companion doc: \`docs/arteep/CL-120-session-detail-grill-me.md\`. |\n| UC Reference | UC-HO-01 \u00b7 UC-HO-04 \u00b7 UC-HO-08 \u00b7 CL-119 (builds on 3-view \u00d7 3-tab + Side-Panel) \u00b7 CL-091 (Trello source) \u00b7 CL-099 (async capture) |\n| Why | The Data tab is the primary working surface for all three roles. These decisions lock the data architecture, interaction model, and approval flow so the build can proceed without mid-build redesigns. |\n| Decided By | PO (Tram) + BA (Claude) \u2014 grill-me format |\n| Category | Architectural Decision (significant) \u00b7 UX Refinement \u00b7 Performance (token efficiency) |\n\n---\n\n## Pending Decisions (Need Stakeholder Input)`;
cl = cl.replace('---\n\n## Pending Decisions (Need Stakeholder Input)', cl120Section);

// Add CL-120 row after CL-119 row
const cl119marker = '| **Session Detail Page 3-view \u00d7 3-tab restructure (CL-119)** |';
const idx = cl.indexOf(cl119marker);
if (idx !== -1) {
  const lineEnd = cl.indexOf('\n', idx);
  const cl119line = cl.substring(idx, lineEnd + 1);
  const cl120row = '| **Session Detail Data Architecture (CL-120)** | **LOGGED 2026-06-10 (CL-120) \u2014 Board\u2192Module\u2192Card accordion \u00b7 AI-derived modules \u00b7 Q&A single-answer + re-ask \u00b7 4 metadata + 2 AI gap detection \u00b7 zero-gate Capture + one-gate Deliver \u00b7 auto-transition with manual override. See companion doc.** | POC build | PO (logged \u00b7 build pending) |\n';
  cl = cl.replace(cl119line, cl119line + cl120row);
}
fs.writeFileSync('docs/arteep/ARTEEP-design-change-log.md', cl);
console.log(`Changelog: ${cl.split('CL-120').length - 1} CL-120 refs`);

// === SNAPSHOT PATCH ===
let sn = fs.readFileSync('ARTEEP-context-snapshot.md', 'utf8');

// P1: Add Data Tab primitives subsection to section 4
const p1old = 'Usernames are latinized handles (see \u00a73).\n\n---\n\n## 5.';
const p1new = `Usernames are latinized handles (see \u00a73).\n\n### Data Tab & Side-Panel Primitives (CL-119 / CL-120)\n- **Data tab accordion:** Board \u2192 AI-derived Module \u2192 Card (two levels). Module registry persists at board level in KG. Users can rename, merge, create, delete modules; drag cards between modules.\n- **Side Panel:** ~480px right-side drawer, Data-tab only. In Prepare: card detail + gaps + add questions. In Capture: full Q&A + answer input + file upload.\n- **Q&A model:** Single answer + re-ask (not threads). Three entry points: card-level, module-level (select cards), out-of-scope (becomes knowledge gap).\n- **Knowledge gaps:** 4 metadata checks (missing description, incomplete checklist, high-priority not done, stale) + 2 AI piggybacked on clustering (implicit knowledge, contradiction) + human-created.\n- **Approval flow:** Zero gates during Capture. One \"Commit to KG\" at Deliver. Four total Manager touchpoints.\n- **File uploads:** On answer (A) + on module header (C). No standalone card-level upload.\n- **Logs tab:** Flat chronological + filter chips (All \u00b7 System \u00b7 Questions \u00b7 Files \u00b7 Edits).\n\n---\n\n## 5.`;
sn = sn.replace(p1old, p1new);

// P2: Add CL-120 note after POC capture model
const p2old = 'A pre-commit, ACL-bounded correction loop (UC-HO-08 flags \u2192 Offboarder fixes) runs alongside (CL-101).';
const p2new = p2old + '\n\n**Data tab architecture (CL-120 \u00b7 2026-06-10):** Data tab restructured around Board \u2192 AI-derived Module \u2192 Card accordion. Q&A model: single answer + re-ask (not threads). Knowledge gaps: 4 metadata checks (zero tokens) + 2 AI types piggybacked on clustering (implicit knowledge + contradiction) + human-created out-of-scope questions. Approval flow minimized: zero gates during Capture, one \"Commit to KG\" gate at Deliver. File uploads on answer or module. Capture\u2192Deliver auto-transition with timeout + manual override. Full details in `docs/arteep/CL-120-session-detail-grill-me.md`.';
sn = sn.replace(p2old, p2new);

// P3: Update section 10 header
sn = sn.replace('CL-001 through CL-118)', 'CL-001 through CL-120)');

// P4: Add CL-120 theme group after CL-118
const p4old = "slug allow-list\n\n---\n\n## 11.";
const p4new = `slug allow-list\n\n### Session Detail Data Architecture (CL-120, 2026-06-10)\n- Board\u2192Module\u2192Card data tab \u00b7 AI-derived modules with user rename/merge/create/delete \u00b7 module registry persists at board level in KG\n- Q&A single-answer + re-ask (not threads) \u00b7 three entry points: card-level, module-level (select cards), out-of-scope (becomes knowledge gap)\n- Knowledge gaps: 4 metadata checks (zero tokens) + 2 AI (implicit knowledge + contradiction, piggybacked on clustering) + human-created\n- Minimal approval: zero gates during Capture \u00b7 one \"Commit to KG\" at Deliver \u00b7 four total Manager touchpoints\n- File uploads: on answer (A) + on module (C) \u00b7 no standalone card-level upload\n- Capture\u2192Deliver: auto-transition on completion or timeout + Manager manual override\n- Logs tab: flat chronological + filter chips (All \u00b7 System \u00b7 Questions \u00b7 Files \u00b7 Edits)\n- Full details in companion doc: \`docs/arteep/CL-120-session-detail-grill-me.md\`\n\n---\n\n## 11.`;
sn = sn.replace(p4old, p4new);

// P5: Add CL-120 to section 11
const p5old = 'final names to land when the UC spec is rewritten. Owner: BA.\n\n### Step Zero Blockers';
const p5new = `final names to land when the UC spec is rewritten. Owner: BA.\n\n### New \u2014 Session Detail Data Architecture (logged 2026-06-10 \u00b7 CL-120)\n- **Build pending.** 24 decisions locked in grill-me session: Board\u2192Module\u2192Card accordion, AI-derived modules, Q&A single-answer + re-ask, 4 metadata + 2 AI gap detection, zero-gate Capture + one-gate Deliver, auto-transition with manual override. Companion doc: \`docs/arteep/CL-120-session-detail-grill-me.md\`.\n\n### Step Zero Blockers`;
sn = sn.replace(p5old, p5new);

fs.writeFileSync('ARTEEP-context-snapshot.md', sn);
console.log(`Snapshot: ${sn.split('CL-120').length - 1} CL-120 refs`);

// Delete patch files
try { fs.unlinkSync('docs/arteep/CL-120-changelog-patch.md'); } catch(e) {}
try { fs.unlinkSync('docs/arteep/CL-120-snapshot-patch.md'); } catch(e) {}
console.log('Patch files deleted. Run: git add -A && git commit -m "context: apply CL-120 patches" && git push');
