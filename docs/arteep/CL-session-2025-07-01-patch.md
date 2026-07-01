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

## §3 — Card Details & Module Classification

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

Not:
```
[Payment Service ›] [CI/CD Pipeline]    ← wrong, second chip not clickable
```

**File:** `components/mockups/session-command-view.jsx`

---

### MC-03: Module switching inside Classification panel ✅ LOCKED

**Issue:** When a card belongs to multiple modules and the user opens the classification panel from one chip, they should be able to switch to see the reasoning for another module without closing and re-opening.

**Change:** Inside the Module Classification panel, show all assigned modules as clickable chips at the top:

```
┌── Module Classification ──────── × ┐
│                                    │
│  Viewing: [Payment Service] [CI/CD]│
│           ▲ active                 │
│                                    │
│  Confidence: 91%                   │
│  ...reasoning for Payment Service..│
│                                    │
└────────────────────────────────────┘
```

Clicking `[CI/CD]` switches the panel content to show CI/CD's classification reasoning, confidence, and verdict — without closing the panel.

The active module chip has a subtle underline or violet background to indicate which reasoning is currently displayed.

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
- [ ] Module Classification panel: module switcher chips at top, clicking switches reasoning
- [ ] Prepare state: fresh import — cards + AI badges + gaps, NO human questions or answers
- [ ] Capture state: mature — all cards organized, NO classification badges, human Q&A active
- [ ] Prepare → Capture visual transition is clear: badges disappear, answers appear

---

*End of patch. Apply via Claude Code. Delete after verified.*
