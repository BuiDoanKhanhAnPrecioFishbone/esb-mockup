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

## 4. Gap vs flag distinction — BUILT ✅ (via Claude Code)

**Decision:** Gaps and flags are fundamentally different concepts with distinct visual treatments.

### Definitions

| Concept | Gap | Flag |
|---|---|---|
| What | AI-detected missing knowledge at **module level** | Mechanical card-level metadata check |
| Source | AI analyzes the full module, identifies what SHOULD exist but DOESN'T | Automated rule: "no desc", "checklist 1/3", etc. |
| Visual | Yellow background, AI sparkle icon (✨) | Gray badge, inline on card row |
| Generates questions? | Yes — AI auto-generates questions from gaps | No |
| Shows in KG Explorer? | Yes — yellow node in graph (session-scoped only, not after commit) | No |
| Dismissable? | No — filled through Q&A only | Yes — Manager can dismiss irrelevant flags |
| Resolution | Offboarder answers AI-generated questions → knowledge fills the gap | Informational only |

### Visual treatment
- **Gaps:** yellow background row under module header, sparkle icon, generates question sub-rows
- **Flags:** small gray badge on the card row (e.g., `no desc`, `checklist 1/3`), × dismiss on hover
- When a gap is resolved (questions answered), the gap row returns to normal (purple/no highlight)

---

## 5. 1:N card-to-module relationship — BUILT ✅ (via Claude Code)

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

## 6. AI categorization animation — BUILT ✅ (via Claude Code)

**Decision:** A short cartoon-style explainer animation plays during Prepare, between "Crawl complete" and "Knowledge map ready."

### Format
- **Cartoon explainer** with simple placeholder data (Card A, B, C, D...), NOT real session data
- Shows the **mechanism** of how AI sorts cards, not the actual sorting
- **Auto-plays continuously** — no clicks needed

### Animation flow (4 scenes, auto-plays)

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

---

## 7. KG Explorer chat redesign — BUILT ✅ (via Claude Code)

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
- Filter button from graph toolbar (POC only — all filtering through chat)

### Graph toolbar (after filter removal)
- Title + entry count badge + zoom button only
- Review padding/spacing for visual balance

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

### Entry from session
- `?prompt=minh-le` pre-fills chat on Deliver Complete (existing decision, unchanged)

---

## 8. Resolved discussion items — LOCKED ✅

*All items resolved during the Jun 25 session.*

### 8.1a — Graph filter: REMOVED for POC ✅

Filter button removed from the KG Explorer graph toolbar. All filtering goes through the chat copilot. Graph toolbar becomes: title + entry count + zoom only.

### 8.1b — Graph header padding ✅

Review and adjust padding/spacing of graph toolbar after filter removal. To be done when building §7.

### 8.1c — Gap → normal node on commit ✅

| Rule | Value |
|---|---|
| On KG commit | Gap nodes lose yellow status, become normal purple knowledge nodes |
| Unanswered gaps at commit | Must be resolved or dismissed before commit (blocked) |
| Gap resolution criteria | ALL generated questions must be satisfied or dismissed |
| KG Explorer | Only shows committed entries — no gap nodes (gaps are session-scoped) |

### 8.2 — AI question editing ✅

| Rule | Value |
|---|---|
| AI-generated questions | Now editable AND deletable by Manager and Coworker |
| Edit interaction | Same as human questions: hover → pencil → inline edit |
| Delete interaction | Same as human questions: hover → trash → removed |
| Regeneration | Deleted AI questions are NOT regenerated |
| Gap relationship | Deleting a gap's question does NOT dismiss the gap — gap stays visible with zero questions |
| Dismiss gap | Removes the gap row AND all its generated questions |

### 8.3 — Offboarder Capture view: HYBRID (Option C) ✅

| Rule | Value |
|---|---|
| Default view | Flat question queue — no module tree, no card list |
| What Offboarder sees | Question text, who asked, module tag (light context), answer input |
| What Offboarder does NOT see | Module → card tree, card counts, gap rows, flag badges, drag handles, "Move to", rename |
| "See in context" link | Opens side panel showing source card (description, checklist, gap, files, other questions) |
| Active question | Highlighted with violet border when its context panel is open |
| Deliver/Complete | Read-only summary (contribution stats, thank-you, timeline) — not full Data tab |

---

## 9. Dashboard redesign — NOT BUILT 🔒

**Decision:** Replace weak KPI tiles with meaningful knowledge-at-risk cards. Different treatment per role.

### 9.1 Manager dashboard

**File:** `components/mockups/ha-vy-handover-dashboard.jsx` — `ManagerActive` function

#### What's removed
- 4 KPI tiles ("Needs your action", "Deadline ≤ 7 days", "Active sessions", "Open gaps")
- "Needs your action" / "Waiting on you" tags and `blockedOnManager` logic
- All references to "Next actions" (explored and rejected)

#### What's added / changed

**Greeting banner:**
- Gradient background (`#f5f3ff` → `#ede9fe` → `#faf5ff`)
- "Good afternoon, Hà Vy" + "2 active handovers" subtitle
- Faint decorative graph nodes in the background corner (very low opacity)

**Session cards (under section title "Active sessions"):**
- Section title stays **"Active sessions"** (not "Knowledge at risk")
- Days left stays as **text** (no countdown ring)
- **No urgency left border**
- Phase progress bar kept (3 segments: Prepare / Capture / Deliver, with sub-stage fill)
- **Inline knowledge metrics** replacing old metrics line: `✨ 4/6 gaps resolved · 💬 9/14 answered`
- One compact row, text only — no full-width bars

**Dashed "+ Create session" card** below session cards

**Activity feed:** kept, compact, same position

**Empty state (zero active sessions):**
- **Orbital illustration:** central AI node with gradient fill, 3 elliptical orbital rings, smaller knowledge nodes orbiting slowly (CSS animation)
- "No departures on the horizon"
- "When someone's leaving, their knowledge graph starts building here."
- "+ Create session" CTA button with gradient background

#### Completed session banner
- Keep existing emerald completion banner ("Minh Lê's session is complete")
- No change needed

### 9.2 Offboarder dashboard

**File:** `components/mockups/ha-vy-handover-dashboard.jsx` — `OBActiveQueue` function

#### Changes
- **Remove** "Files uploaded" KPI tile (upload removed from POC)
- **Keep** "To answer" and "Answered" tiles — they're actionable for this role
- **Add greeting banner:** "Good afternoon, Minh Lê" · "5 questions waiting for you"
- Same gradient background as Manager banner
- **Completion state** ("You're all caught up"): keep existing green checkmark celebration, optionally add a small illustration (connected graph nodes — knowledge preserved)

### 9.3 Coworker dashboard

**File:** `components/mockups/ha-vy-handover-dashboard.jsx` — `CoworkerActive` function

#### Changes
- **Keep** existing KPI tiles ("Answers to review", "Waiting for answer", "Active sessions") — they're functional for this role
- **Add greeting banner:** "Good afternoon" · "3 answers to review across 2 sessions"
- Same gradient background as Manager/Offboarder banners
- **Completion state** ("All satisfied"): keep existing structure, optionally add matching celebration illustration

### 9.4 Artwork summary across roles

| Artwork | Manager | Offboarder | Coworker |
|---|---|---|---|
| Greeting banner | ✅ personalized | ✅ personalized | ✅ generic |
| Empty state orbital | ✅ (no sessions) | ❌ (n/a) | ❌ (n/a) |
| Completion celebration | ✅ (emerald banner) | ✅ (all caught up) | ✅ (all satisfied) |

---

## 10. Chat-to-graph interactive node references — NOT BUILT 🔒

**Decision:** AI chat responses in the KG Explorer contain clickable node references that bridge text and graph.

### Visual style

| Property | Value |
|---|---|
| Text color | Violet (`#5b21b6`) |
| Background | Subtle violet (`#f5f3ff`) |
| Underline | `text-decoration: underline`, `text-decoration-color: #c4b5fd`, offset 2px |
| Border radius | 3px (inline pill shape) |
| Cursor | Pointer |

### Interactions

| Action | What happens |
|---|---|
| **Hover** reference in chat | Graph highlights that specific node (violet glow ring, others dim to ~20%). "Node name · from chat" indicator appears on graph |
| **Click** reference in chat | Graph zooms to that node + node detail drawer opens from the right |
| **Multiple references** in one response | Each highlights independently on hover. Example: "Auth spans **OAuth2 PKCE**, **Azure AD SAML**, **JWT Rotation**, and **RBAC matrix**" — four separate hover targets |
| **Mouse leave** reference | Graph returns to normal (all nodes visible, no highlighting) |

### Example AI response with references

```
"Based on the knowledge graph, the successor should focus on:
1. Start with [Kafka retry config] — incomplete checklist, DLQ undocumented
2. Then review [Stripe webhook handler] since it depends on retry logic
3. [JWT Key Rotation] is separate but has a critical gap — emergency procedure is tacit only"
```

Each `[bracketed term]` renders as an inline violet reference linked to an existing graph node.

### Rules
- **Only existing nodes** — references never create new nodes
- Node matching is by `id` or `label` in the graph data
- If a referenced node doesn't exist in the graph, render as plain text (no link)
- References work alongside dynamic recommendation chips — they're complementary

### File to change
- `components/mockups/knowledge-graph-explorer.jsx`

---

## 11. Consistency audit — changes needed across mockup files

*Cross-file inconsistencies identified by scanning all mockup files against locked decisions.*

### 11.1 `ha-vy-handover-dashboard.jsx` — NEEDS FULL REDESIGN 🔴

| Issue | Current | Should be |
|---|---|---|
| 4 KPI tiles | Present (Needs action, Deadline, Active, Gaps) | Removed (Manager only) |
| "Needs your action" label | Present with `blockedOnManager` | Removed |
| Section title | "Active sessions" | Keep "Active sessions" ✅ |
| Days left | Text "22 days" | Keep as text ✅ |
| Knowledge metrics | "9 of 14 answered · 7 satisfied" + "2 gaps open" | Inline: "✨ 4/6 gaps resolved · 💬 9/14 answered" |
| Greeting banner | Not present | Add gradient banner with personalized greeting |
| Empty state | Not present | Add orbital illustration |
| Offboarder "Files uploaded" tile | Present | Remove (upload gone from POC) |

### 11.2 `knowledge-graph-explorer.jsx` — NEEDS CLEANUP 🟡

| Issue | Current | Should be |
|---|---|---|
| 5 fixed `CHIPS` array | Present (Show risks, Auth flow, etc.) | Remove — replaced by dynamic contextual chips in chat |
| `FilterChip` component | Present (line ~94) | Remove — filtering goes through chat only |
| Chat location | Mixed (has conversation data but layout unclear) | Verify left-panel layout matches §7 spec |
| Interactive node references | Not present | Add hover/click node references per §10 |

### 11.3 `session-command-view.jsx` — MOSTLY CONSISTENT ✅

| Item | Status |
|---|---|
| "See in context" link on Offboarder queue | ✅ Built |
| AI question editing (pencil + trash) | ✅ Built — `canEdit` applies to all questions |
| Upload removed from inputs | ✅ Done |
| Gap vs flag distinction | ✅ Yellow gap rows + gray flag badges |
| 1:N card-to-module | ✅ Primary + linked card rows |

### 11.4 `session-thanh-tung.jsx` — MOSTLY CONSISTENT ✅

| Item | Status |
|---|---|
| Coworker network | ✅ Built |
| Module rename | ✅ Built |
| Upload removed | ✅ Done |

### 11.5 Orphaned files — DELETE 🟢

| File | Why |
|---|---|
| `prepare-stage.jsx` | Replaced by Prepare steps inside `session-command-view.jsx`. Has stale "Successor: Trần Hữu Nam" row |
| `uc-ho-01-quick-initiate.jsx` | Replaced by `create-session.jsx` |

---

## Build order recommendation

| Priority | Item | Scope | File |
|---|---|---|---|
| 🔴 1 | Dashboard redesign (§9) | Full rewrite of Manager view, minor fixes to Offboarder/Coworker | `ha-vy-handover-dashboard.jsx` |
| 🟡 2 | KG Explorer cleanup (§11.2) | Remove fixed chips, FilterChip; verify chat layout | `knowledge-graph-explorer.jsx` |
| 🟡 3 | Chat node references (§10) | Add interactive hover/click references in AI responses | `knowledge-graph-explorer.jsx` |
| 🟢 4 | Delete orphaned files (§11.5) | Remove `prepare-stage.jsx` + `uc-ho-01-quick-initiate.jsx` | — |

Dashboard is highest priority — it's the landing page and the first thing the demo audience sees.

---

## Pending from previous sessions (not addressed here)

- [ ] CL entries to be logged for all decisions above
- [ ] Context snapshot update (`ARTEEP-context-snapshot.md`)
- [ ] CL-121/122 patch merge into main design change log
- [ ] CL-114 cleanup in `prepare-stage.jsx` (moot if file is deleted)
- [ ] CL-107 labels-only style
- [ ] Manager-confirm gate between Prepare Step 2 and Step 3

---

*End of build queue. Reference this document when starting any of the NOT BUILT items.*
