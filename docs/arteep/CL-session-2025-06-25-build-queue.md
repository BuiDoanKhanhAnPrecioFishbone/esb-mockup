# ART-EEP — Session 2025-06-25 Build Queue

*All decisions from the Jun 25 session, arranged in build order.*
*Status: design-locked unless marked as BUILT.*

---

## 1. Upload removal — BUILT ✅

**Decision:** No upload/attach-file in the POC. Knowledge enters through Q&A only. Upload is deferred to Phase 2.

**What was removed:**
- Upload buttons from general, module, and SidePanel question inputs
- `UploadableInputBar` / `TTUploadBar` components
- Paperclip attach-file icons on all input bars
- All file-attachment affordances in both session files

**Files changed:**
- `components/mockups/session-command-view.jsx`
- `components/mockups/session-thanh-tung.jsx`

---

## 2. Coworker network — BUILT ✅

**Decision:** Coworkers are auto-derived from shared Trello card activity or manually added by the Manager.

### Design rules

| Rule | Value |
|---|---|
| Auto-derived coworkers | Violet avatar, "From Trello · N shared cards", no remove button |
| Manually added coworkers | Yellow avatar, "Added by Hà Vy", × remove button |
| Relationship shown | Which modules they share (no org labels like Teammate/Cross-team — system only knows card overlap) |
| Prepare state | Editable: "+ Add" button, × remove on manually-added |
| Capture state | Read-only: no add/remove buttons |
| Add coworker flow | Click "+ Add" → input appears → type name → Enter or click Add → new coworker with auto-generated initials, "Pending", "Added by Hà Vy" |
| Location | Overview tab, between stats card and CTA buttons |

### Mock data

**Minh Lê session:**
- Trần Hữu Nam — 14 shared cards, Payment Service + CI/CD Pipeline, Joined
- Linh Anh — 6 shared cards, Monitoring & Alerts, Joined
- Bảo Nguyễn — manual, Infrastructure as Code, Pending

**Thanh Tùng session:**
- Linh Trần — 22 shared cards, Test Automation + Bug Triage, Joined
- Bảo Nguyễn — 9 shared cards, Release Testing, Pending

### Files changed
- `components/mockups/session-command-view.jsx` — `CoworkerNetwork` component + `SEED_COWORKERS` data
- `components/mockups/session-thanh-tung.jsx` — `TTCoworkerNetwork` component + `TT_COWORKERS` data

---

## 3. Module rename — BUILT ✅

**Decision:** Module names are editable via inline rename.

### Interaction
1. Click "Rename" text on module header row
2. Module name becomes an inline `<input>` with violet border
3. Enter saves the new name, Escape cancels
4. ✓ and × buttons for mouse users
5. `stopPropagation` prevents expand/collapse when clicking Rename

### Visibility rules
- **Minh Lê:** Manager role only, Prepare + Capture (hidden in Deliver/Complete via `readOnly` flag)
- **Thanh Tùng:** Always visible (Prepare-only session)

### Files changed
- `components/mockups/session-command-view.jsx` — `ModuleSection` with `renaming`/`displayName`/`renameInput` state
- `components/mockups/session-thanh-tung.jsx` — same pattern

---

## 4. Gap vs flag distinction — NOT BUILT 🔒

**Decision:** Gaps and flags are fundamentally different concepts with distinct visual treatments.

### Definitions

| Concept | Gap | Flag |
|---|---|---|
| What | AI-detected missing knowledge at **module level** | Mechanical card-level metadata check |
| Source | AI analyzes the full module, identifies what SHOULD exist but DOESN'T | Automated rule: "no desc", "checklist 1/3", etc. |
| Visual | Yellow background, AI sparkle icon (✨) | Gray badge, inline on card row |
| Generates questions? | Yes — AI auto-generates questions from gaps | No |
| Shows in KG Explorer? | Yes — yellow node in graph | No |
| Dismissable? | No — filled through Q&A only | Yes — Manager can dismiss irrelevant flags |
| Resolution | Offboarder answers AI-generated questions → knowledge fills the gap | Informational only |

### Visual treatment (to build)
- **Gaps:** yellow background row under module header, sparkle icon, generates question sub-rows
- **Flags:** small gray badge on the card row (e.g., `no desc`, `checklist 1/3`), × dismiss on hover
- When a gap is resolved (questions answered), the gap row returns to normal (purple/no highlight)

---

## 5. 1:N card-to-module relationship — NOT BUILT 🔒

**Decision:** One card can belong to multiple modules. The AI agent evaluates each card against ALL modules.

### AI assignment rules

| Rule | Value |
|---|---|
| Confidence threshold | ≥80% per card-module pair |
| Confidence visibility | Hidden from all users — internal AI metric only |
| Primary module | Highest confidence match |
| Linked modules | Other modules above threshold |
| Uncategorized | Cards below 80% for ALL modules |

### Visual treatment in Data tab

| Card type | Appearance |
|---|---|
| **Primary** | Normal row, no extra indicator. This module is the card's best match |
| **Linked** | Dashed violet left border, muted text color, violet file icon, `↗ Primary Module` chip |
| **Uncategorized** | Dashed border section at bottom of Data tab, "AI couldn't confidently assign these" |

### Side panel
- Primary card: shows one module
- Linked card: shows all modules with primary marked — e.g., "CI/CD Pipeline (primary), Payment Service, Shared Libraries"
- No percentages anywhere

### Manager actions (all cards, hover-only)

| Action | Location | Behavior |
|---|---|---|
| Drag handle (⠿) | Left side of card row, hover-only | Drag card between modules or to uncategorized |
| "Move to" dropdown | Right side of card row, hover-only | Pick destination module or "Uncategorized" |
| Remove from module | Via "Move to → Uncategorized" | Card moves back to uncategorized section |

### Data model implications
- Q&A belongs to the **card**, not the module — visible from any module the card appears in
- Gaps remain **module-level** — AI analyzes all cards in module (primary + linked)
- Flags remain **card-level** — shows in every module the card appears in
- Module card count = all cards in that module (primary + linked)

---

## 6. AI categorization animation — NOT BUILT 🔒

**Decision:** A short cartoon-style explainer animation plays during Prepare, between "Crawl complete" and "Knowledge map ready."

### Format
- **Cartoon explainer** with simple placeholder data (Card A, B, C, D...), NOT real session data
- Shows the **mechanism** of how AI sorts cards, not the actual sorting
- **Auto-plays continuously** — no clicks needed

### Animation flow (4 scenes, loops)

| Scene | What happens | Duration |
|---|---|---|
| 1. Card arrives | Card floats in, AI sparkle spins, module buckets wait | ~3s |
| 2. Simple match | AI says "match!" → card pops into one module, checkmark appears | ~3s |
| 3. Multi-match (1:N) | AI says "2 matches!" → card splits: ★ primary flies to Module 1, ↗ linked flies to Module 3 | ~4s |
| 4. No match | Card wiggles, AI says "hmm..." → card drops to uncategorized bucket | ~3.5s |

### After animation
- Counter fast-forwards: "12... 28... 47... 64 ✓"
- Transitions to real Data tab with organized modules
- Plays **once** in the real product (loops in demo mode)

### Design references
- Colored module buckets (purple/blue/pink pills)
- Cards as simple rounded pills with single letters
- Bounce/pop animations for card landing
- Shake animation for "no match" rejection

---

## 7. KG Explorer chat redesign — NOT BUILT 🔒

**Decision:** Remove the 5 fixed AI chips and footer chat bar. Replace with a proper chat panel on the left with conversation history.

### Layout (3 panels)

| Panel | Position | Width | Behavior |
|---|---|---|---|
| Chat history sidebar | Left | ~120px | Separate panel, hide/show toggle |
| Active chat | Left (next to history) | ~180px | Always visible, conversation thread |
| Graph canvas | Center | All remaining space | **Always primary**, always full graph |
| Node detail drawer | Right | ~480px | Slides in on node click, overlays graph |

### What's removed
- 5 fixed AI chips ("Show risks", "Key dependencies", etc.)
- Small footer chat bar

### What's added

#### Conversation history sidebar
- Saved threads like ChatGPT
- Title + timestamp per thread
- **Renamable**: hover → pencil icon → inline edit (Enter to save, Escape to cancel)
- "+ New chat" button
- **Hide/show toggle**: collapse to just the chat panel, expand to see history

#### Active chat panel
- Thread title + AI sparkle at top
- Message bubbles: user (violet bg, right-aligned) + AI (gray bg, left-aligned)
- **Dynamic recommendation chips** below AI responses:
  - Contextual, not fixed count (varies by topic)
  - Examples: "Show the gap", "Kafka details", "Who contributed?", "Zoom to node", "Connected entries"
  - Each chip has a small Tabler icon
- Chat input bar at bottom with send button

#### Graph interaction
- User asks a question or picks a recommendation → response is either:
  - **Free text in chat** (explanations, summaries)
  - **Graph highlighting** (existing nodes light up, others dim to ~20% opacity)
  - **Both** (text + graph focus)
- "Focusing: Payment Service ×" chip appears on graph when a cluster is highlighted — click × to clear
- **Only existing nodes** — chatbot never creates new nodes

#### Bridge between panels
- Node detail drawer has "Ask about this" button at bottom
- Clicking sends node context to the chat panel
- Chat can reference specific nodes; graph can be navigated via chat

### Entry from session
- `?prompt=minh-le` pre-fills chat on Deliver Complete (existing decision, unchanged)

---

## 8. Open discussion items — NEEDS DECISION ❓

*These items are under discussion and have NOT been decided yet. Resolve before building.*

### 8.1 Graph adjustments

**8.1a — Graph filter: keep or remove?**

The current KG Explorer mockup includes a "Filter" button in the graph header toolbar. With the new chat-based interaction model (§7), filtering may be handled entirely through the chatbot (e.g., "Show only gaps" → graph highlights gap nodes). If so, the explicit Filter button may be redundant.

- **Option A:** Keep the filter button — direct manipulation for users who prefer clicking over chatting
- **Option B:** Remove it — all filtering goes through the chat copilot, keeps the graph toolbar minimal
- **Decision:** TBD

**8.1b — Graph header padding**

Review the padding/spacing of the graph header toolbar (title, entry count badge, filter/zoom buttons). Current mockup may need adjustment for visual balance once filter decision is made.

- **Action:** Check and adjust after 8.1a is resolved

**8.1c — Gap → normal node on commit**

When data is committed to the Knowledge Graph (Deliver Complete), all gap nodes lose their "gap" status and become normal knowledge nodes. The yellow color disappears — they're now filled knowledge, not missing knowledge.

- **Current behavior:** Gap nodes stay yellow in the KG Explorer regardless of session status
- **Expected behavior:** Once committed, former gaps become normal purple nodes (same as any other verified entry)
- **Decision:** Locked ✅ — gaps transition to normal nodes on KG commit. Needs implementation in the KG Explorer.

### 8.2 Session mechanics — AI question editing

**Feature request:** Users (Manager, Coworker) should be able to edit AI-generated questions, not just human-added ones.

Current state:
- Human-added questions: editable (inline edit) + deletable ✅
- AI-generated questions: read-only ❌

Proposed change:
- AI-generated questions become **editable and deletable** by Manager and Coworker
- Works the same as human questions: hover → pencil (edit) + trash (delete)
- Deleting an AI-generated question works similarly to "dismiss gap" — the question is removed, the system doesn't regenerate it
- If the question came from a gap, deleting the question does NOT resolve the gap — the gap remains, the Manager can ask a different question or dismiss the gap separately

- **Decision:** TBD — confirm whether edit and delete should both be available, or just delete

### 8.3 Offboarder UI / permissions

**Clarification needed:** What should the Offboarder see in the Data tab?

Current behavior:
- **Prepare:** Offboarder cannot access the Data tab (disabled, "Your session is being prepared")
- **Capture:** Offboarder sees a flat question queue (all questions listed, answerable, no module/card tree)
- **Deliver/Complete:** Offboarder sees the full Data tab (read-only, same view as Manager)

Open question: should the Capture-state Offboarder view change?

- **Option A (current):** Simple question queue only — Offboarder just answers questions without seeing the module/card structure. Clean, focused, low cognitive load.
- **Option B:** Full Data tab access — Offboarder sees the module/card tree with their questions embedded. More context about where their knowledge fits, but potentially overwhelming.
- **Option C:** Hybrid — question queue as the default view, with a "See in context" link on each question that scrolls/expands to show it within the module tree. Best of both worlds but more complex to build.

- **Decision:** TBD

---

## Build order recommendation

Features are ordered by dependency and demo impact:

1. **Gap vs flag distinction** (§4 — foundation for Data tab visual clarity)
2. **1:N card-to-module UI** (§5 — linked card rows, uncategorized section, drag handle, "Move to")
3. **AI categorization animation** (§6 — cartoon explainer for Prepare phase)
4. **KG Explorer chat redesign** (§7 — left panel chat, conversation history, dynamic chips, graph highlighting)

Items 1–2 affect the session Data tab directly and are prerequisites for the demo flow.
Item 3 is a standalone animation component in Prepare.
Item 4 is a standalone page redesign at `/knowledge-graph`.

**Resolve §8 discussion items before building §4, §5, and §7** — they affect the Data tab, question management, and graph behavior respectively.

---

## Pending from previous sessions (not addressed here)

- [ ] CL entries to be logged for all decisions above
- [ ] Context snapshot update (`ARTEEP-context-snapshot.md`)
- [ ] CL-121/122 patch merge into main design change log
- [ ] CL-114 cleanup in `prepare-stage.jsx` (remove stale Successor row)
- [ ] CL-107 labels-only style
- [ ] Delete orphaned `prepare-stage.jsx` and `uc-ho-01-quick-initiate.jsx`
- [ ] Manager-confirm gate between Prepare Step 2 and Step 3

---

*End of build queue. Reference this document when starting any of the NOT BUILT items.*
