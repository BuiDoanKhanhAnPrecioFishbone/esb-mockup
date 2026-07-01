# ART-EEP — Mockup Patch (2025-07-01 session 2)

*Demo polish + data consistency. Apply via Claude Code.*
*Delete this file after verified.*

---

## §1 — Data Tab: Reduce Visual Noise

### DT-01: Audit and reduce signals for demo clarity ✅ LOCKED

**Issue:** Too many badges, borders, icons, and indicators on the Data tab. During a fast-paced hackathon demo, judges can't absorb them all.

**Principle:** Every visible signal must be explainable in one sentence. If it can't be explained quickly, it shouldn't be on screen during the demo.

**Audit checklist — what stays vs what goes:**

| Signal | Keep? | Reason |
|---|---|---|
| Module section headers ("Module: Payment Service") | ✅ Keep | Core structure |
| Card title in row | ✅ Keep | Core content |
| AI Classification badges (Review, New Module, Uncategorized) | ✅ Keep | Core demo value — shows HITL |
| Left border accents (amber/violet/dashed) | ✅ Keep | Reinforces classification state |
| Orange ⚡ Detects badges | ✅ Keep but limit | Max 1-2 per card row, don't stack many |
| Filter tabs (All/Pass/Review/New/Uncat) | ✅ Keep | Demo navigation |
| Gap rows (✨ GAP #1, #2) | ✅ Keep | Core gap detection feature |
| Card count per module | ✅ Keep | Contextual info |
| Q&A count on card row | ⚠️ Simplify | Show only if > 0, hide if zero |
| Bulk buttons (Accept remaining, Dismiss flags) | ⚠️ Show only in Capture | Not visible in Prepare stage |

**Action for Claude Code:** Scan all card rows and ensure no card has more than 2 badges/indicators visible at once. If a card has a classification badge AND a Detects badge AND a Q&A count, the Q&A count can be hidden to reduce clutter.

**File:** `components/mockups/session-command-view.jsx`

---

### DT-02: Fix data consistency — mock data audit ✅ LOCKED

**Issue:** Card rows show indicators (e.g., "1 Q") but the detail panel shows an empty state. All mock data must be internally consistent.

**Rules:**
- If a card row shows "1 Q" → the card detail MUST have 1 question visible
- If a card row shows a Detects badge → the card detail MUST show matching detects
- If a gap shows "Questions (2)" → there MUST be 2 questions listed under that gap
- If the module header shows "5 cards" → there MUST be exactly 5 card rows in that module
- If the filter tab shows "Review 2" → there MUST be exactly 2 cards with Review badges

**Action for Claude Code:** Audit ALL mock data in `session-command-view.jsx` and `session-thanh-tung.jsx`. Fix any mismatches between card row indicators and their detail panel content.

**Files:** `components/mockups/session-command-view.jsx`, `session-thanh-tung.jsx`

---

### DT-03: Set specific gap quantities for demo ✅ LOCKED

**Demo script requirement:**

| Module | Gap count | Gap examples |
|---|---|---|
| **Payment Service** | **3 gaps** | e.g., No disaster recovery documented · No error escalation process · Missing SLA definitions |
| **Monitoring & Alert** | **2 gaps** | e.g., No alert routing documented · No incident response runbook |
| Other modules | 0-1 gaps each | As needed for realism |

Each gap must have at least 1 AI-generated question under it. Gap numbering: GAP #1, GAP #2, GAP #3 per module.

**File:** `components/mockups/session-command-view.jsx`

---

## §2 — Gap Context Panel

### GC-01: AI questions editable + removable from gap context panel ✅ LOCKED

**Issue:** Users must be able to manage AI-generated gap questions directly from the "See in context" gap panel, not just from the Data tab.

**Change:** Add edit + remove actions to each AI-generated question inside the gap context panel:

- **Edit** (pencil icon, hover): click → question text becomes inline-editable → Save/Cancel
- **Remove** (× icon, hover): click → confirmation: "Delete this question? The AI won't regenerate it." → Delete/Cancel

This is the SAME interaction as on the Data tab gap rows, but accessible from within the side panel.

**Who can edit/remove:**
- Manager: ✅
- Coworker: ✅
- Offboarder: ❌ (read-only gap context panel — per OV-R4-03)

**File:** `components/mockups/session-command-view.jsx`

---

## §3 — Module Classification Panel

### MC-01: Rename "AI Classification" → "Module Classification" ✅ LOCKED

**Files:** `components/mockups/session-command-view.jsx`, `session-thanh-tung.jsx`

Rename everywhere:
- Panel header: ~~"AI Classification"~~ → **"Module Classification"**
- Card detail section label: ~~"AI Classification"~~ → **"Module Classification"**
- Any tooltip or label referencing "AI Classification"

**Remove mid-dots:** No `·` or `.` between words in this label. It's "Module Classification" — two words, space only.

---

### MC-02: ALL module chips clickable — not just the first ✅ LOCKED

**Issue:** If a card belongs to multiple modules (`[Payment Service ›]` `[CI/CD Pipeline]`), only the first chip has the `›` trigger. ALL chips must be clickable.

**Change:** Every module chip on every card has the `›` arrow and opens the Module Classification panel when clicked. The panel opens showing the reasoning for THAT specific module assignment.

**Visual:** All chips show `›`:
```
[Payment Service ›] [CI/CD Pipeline ›]
```

**File:** `components/mockups/session-command-view.jsx`

---

### MC-03: Module switching inside Classification panel ✅ LOCKED

**Issue:** When a card belongs to multiple modules, users should switch between module reasonings without closing the panel.

**Change:** Inside the Module Classification panel, the "Assigned modules" chips at the top double as a switcher. Clicking a different chip switches the conversation/confidence/verdict below to show THAT module's reasoning. The active chip has a violet underline or background highlight.

**File:** `components/mockups/session-command-view.jsx`

---

### MC-04: AI reasoning visible in ALL states + result highlighted ✅ LOCKED

**⚠️ CLARIFICATION — applies to all states**

Every card, regardless of state (Pass, Review, New Module, Uncategorized), shows the full AI conversation in the Module Classification panel. The conversation is ALWAYS visible — it's not hidden behind a toggle or only shown for certain states.

**Panel layout (top to bottom):**

1. **Header:** "✨ Module Classification" + × close
2. **Card identity:** title + ID
3. **Assigned modules** — the RESULT — **highly visible and highlighted:**
   - Violet background (#f5f3ff) with violet border (#c4b5fd)
   - Label: "Assigned modules"
   - Module chips with × to remove + "+ Add module" button
   - This is the most prominent section — it's what the Manager acts on
4. **Save / Cancel** — appears when chips are modified (see MC-05)
5. **Confidence bar** — green/amber/red gradient with percentage
6. **AI conversation** — multi-agent chat (M/G) with labeled steps — ALWAYS visible
7. **Verdict box** — colored per state (green/amber/violet/gray dashed)
8. **Agent avatars** — M (purple), G (orange), R (rose)

**File:** `components/mockups/session-command-view.jsx`

---

### MC-05: Direct inline editing of module chips + Save/Cancel ✅ LOCKED

**⚠️ OVERRIDE of RF-02 from refinements file:** Remove the "Change assignment" button. Users edit modules DIRECTLY by interacting with chips.

**How it works:**
- Module chips in the "Assigned modules" section are ALWAYS interactive — no edit mode toggle
- Click **×** on any chip → removes that module from the assignment
- Click **"+ Add module"** → dropdown of existing modules → select one → chip appears
- Removing ALL chips → result box changes to dashed gray "No modules assigned — card is Uncategorized"
- Any change to chips triggers **Save / Cancel** buttons to appear below the result box

**Save / Cancel behavior:**

| Scenario | Save/Cancel visible? |
|---|---|
| Panel opened, no edits made (Pass) | ❌ Hidden — nothing changed |
| Panel opened, no edits made (Review/New Module/Uncategorized) | ✅ Visible — these states need confirmation |
| User added or removed a chip | ✅ Visible — change needs confirmation |
| User clicks Save | Changes confirmed, Save/Cancel disappear, card row updates |
| User clicks Cancel | Chips revert to original state, Save/Cancel disappear |

**For Review and Uncategorized states:** Save/Cancel are shown immediately when the panel opens because these states need a human decision. The AI's suggested chip is pre-populated but the Manager must confirm.

**For New Module:** "Accept" and "Skip" buttons replace Save/Cancel (per RF-01). Accept = inline-edit name + create. Skip = switch to multi-select existing modules.

**File:** `components/mockups/session-command-view.jsx`

---

## §4 — Workflow Stage Data

### WS-01: Prepare stage = fresh import, no human questions ✅ LOCKED

**Issue:** The Prepare stage (currently labeled "Ready for review") should feel like a completely fresh state — data just arrived from Trello. No human involvement yet.

**Prepare stage data rules:**

| Element | Present in Prepare? |
|---|---|
| Cards from Trello | ✅ Yes — freshly imported |
| Module assignments (AI) | ✅ Yes — AI has classified cards |
| AI Classification badges (Review/New Module/Uncategorized) | ✅ Yes — AI decisions visible, Manager needs to review |
| AI-generated gap questions | ✅ Yes — AI detected gaps and generated questions |
| Human-asked questions | ❌ No — nobody has asked anything yet |
| Answered questions | ❌ No — Offboarder hasn't started |
| Detects (⚡) | ✅ Yes — auto-detected from card metadata |
| Coworker questions | ❌ No — Coworkers join during Capture |
| "Accepted" badges on answers | ❌ No — no answers to accept |
| Bulk "Accept remaining" button | ❌ No — nothing to accept yet |

**The demo story for Prepare:** "The system just crawled Minh Lê's Trello boards. Here's what it found — 64 cards organized into 5 modules. Some cards need your review (amber badges). The AI also detected 5 knowledge gaps. Let's review before inviting Minh Lê to answer."

**File:** `components/mockups/session-command-view.jsx` (Manager Prepare state)

---

### WS-02: Capture stage = mature, all cards organized ✅ LOCKED

**Issue:** The Capture stage should look polished — the Manager has already reviewed all AI decisions. No lingering "Review" or "Uncategorized" cards.

**Capture stage data rules:**

| Element | Present in Capture? |
|---|---|
| Cards from Trello | ✅ Yes — all organized |
| AI Classification badges (Review/New Module/Uncategorized) | ❌ No — all resolved by Manager in Prepare |
| All cards in modules | ✅ Yes — every card assigned, no Uncategorized section |
| AI-generated gap questions | ✅ Yes — some answered, some waiting |
| Human-asked questions | ✅ Yes — Manager and Coworkers have asked questions |
| Answered questions | ✅ Yes — Offboarder has been answering |
| Detects (⚡) | ✅ Yes — still visible as metadata |
| Coworker questions | ✅ Yes — Coworkers are participating |
| "Accepted" badges | ✅ Yes — some answers accepted |
| Bulk "Accept remaining" button | ✅ Yes — Manager is reviewing answers |
| "Needs more" revisions | ✅ Optionally — shows the review cycle |

**The demo story for Capture:** "Minh Lê has been answering questions. 9 of 14 answered so far. Hà Vy and the coworkers are reviewing. Let's see the progress."

**The key visual difference:** In Prepare, the Data tab has amber/violet/dashed classification badges everywhere. In Capture, those badges are GONE — all cards are clean, organized rows. The focus shifts from "review AI decisions" to "review human answers."

**File:** `components/mockups/session-command-view.jsx` (Manager Capture state)

---

## Verification checklist

- [ ] Data tab: no card row has more than 2 badges/indicators visible
- [ ] Data tab: Q&A count hidden on cards with zero questions
- [ ] Mock data: all card row indicators match their detail panel content
- [ ] Mock data: filter tab counts match actual card counts
- [ ] Payment Service: exactly 3 gaps (GAP #1, #2, #3) with questions
- [ ] Monitoring & Alert: exactly 2 gaps (GAP #1, #2) with questions
- [ ] Gap context panel: AI questions have edit (pencil) + remove (×) actions
- [ ] "AI Classification" renamed to "Module Classification" everywhere — no mid-dots
- [ ] ALL module chips on multi-module cards have › trigger and are clickable
- [ ] Module Classification panel: clicking different chips switches reasoning content
- [ ] Module Classification panel: AI conversation visible in ALL states (Pass, Review, New Module, Uncategorized)
- [ ] Module Classification panel: "Assigned modules" section is visually prominent (violet bg + border)
- [ ] Module Classification panel: chips directly editable — × to remove, + to add — no "Change assignment" button
- [ ] Module Classification panel: Save/Cancel appears on any chip modification
- [ ] Module Classification panel: Review/Uncategorized show Save/Cancel immediately on open
- [ ] Module Classification panel: removing all chips → "Uncategorized" state
- [ ] Prepare state: fresh import — cards + AI badges + gaps, NO human questions or answers
- [ ] Capture state: mature — all cards organized, NO classification badges, human Q&A active
- [ ] Prepare → Capture visual transition is clear: badges disappear, answers appear

---

*End of patch. Apply via Claude Code. Delete after verified.*
