# ART-EEP — Data Validation Feature (Deliver Stage) — 2025-07-04

*New feature for the Deliver stage. Design brief + behavior spec.*
*Apply via Claude Code after review. Delete after verified.*

---

## Overview

A new "Data Validation" section on the Deliver page that simulates conversations between the AI and hypothetical consumers (newcomer, manager, coworker) to prove the collected data is actually useful before committing to the Knowledge Graph.

**The pitch:** "Before we commit Minh Lê's knowledge, let's test it. Can a newcomer actually learn from this data? Can a manager oversee the payment service using only what we collected?"

---

## DV-01: Data Validation section on Deliver page ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx` — Deliver state

### Position in Deliver page layout

Updated Deliver page order (top to bottom):
1. **Header:** "Ready to commit" + subtitle
2. **Knowledge summary:** 3 stat cards (entries/answered/modules)
3. **✨ NEW — Data Validation:** two-column layout (test cases + source data)
4. **Resolved gaps:** green checkmarks
5. **Unresolved gaps:** yellow info (not blockers)
6. **Sanitization note**
7. **Action buttons:** Back to Capture + Commit to KG

---

## DV-02: Test case library ✅ LOCKED

### Organized by consumer persona

| Persona | Icon | Purpose | Example questions |
|---|---|---|---|
| **Newcomer** | 🧑‍💻 | "Can someone onboard using this data?" | "How do I deploy the payment service?" · "What's the retry logic for failed transactions?" · "Who do I contact for Kafka issues?" |
| **Manager** | 📊 | "Can a manager oversee using this data?" | "What are the key risks in the payment pipeline?" · "What's the disaster recovery procedure?" · "What SLAs exist for the payment gateway?" |
| **Coworker** | 👥 | "Can a peer maintain this system using this data?" | "How does the webhook handler work?" · "What's the error escalation path?" · "How is the DLQ consumer group configured?" |

### Demo quantities

- **3 Newcomer test cases** (2 pass, 1 fail)
- **3 Manager test cases** (1 pass, 1 partial, 1 fail)
- **2 Coworker test cases** (2 pass)

Total: **8 test cases** — 5 pass, 1 partial, 2 fail.

---

## DV-03: Two-column layout ✅ LOCKED

### Split view — test cases + source data side by side

The Data Validation section uses a **two-column layout** so the Manager can cross-reference the AI's answer with the actual collected data.

```
┌── Data Validation ─────────────────────────────────────────────────┐
│                                                                     │
│  ✅ 5 answered · ⚠️ 1 partial · ❌ 2 insufficient (1 flagged)       │
│  [All 8] [🧑‍💻 Newcomer 3] [📊 Manager 3] [👥 Coworker 2]            │
│                                                                     │
│  ┌─── Test cases (left ~55%) ───┬─── Source data (right ~45%) ────┐ │
│  │                              │                                  │ │
│  │ 📊 Manager asks:             │ Module: Payment Service          │ │
│  │ "What's the DR procedure?"   │ ──────────────────────────       │ │
│  │                              │ Cards (5):                       │ │
│  │ 🤖 AI:                       │ · Kafka retry config ✓           │ │
│  │ "I don't have enough info    │ · Stripe webhook ✓               │ │
│  │  about disaster recovery..." │ · Payment timeout ✓              │ │
│  │                              │ · Currency conversion ✓          │ │
│  │ ❌ Insufficient              │ · Contract renewal ✓             │ │
│  │                              │                                  │ │
│  │ 💡 No card covers DR         │ Gaps (3):                        │ │
│  │    procedures                │ ✨ #1 No disaster recovery ← !!  │ │
│  │                              │ ✨ #2 No escalation process      │ │
│  │ [🚩 Flag] [→ Back to Capture]│ ✨ #3 Missing SLAs               │ │
│  │                              │                                  │ │
│  └──────────────────────────────┴──────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Left column (~55%) — Test case conversation
- The simulated consumer question + AI answer + result badge
- Sources line (for passed cases)
- Recommendation (for failed cases)
- **Flag button** (see DV-04)
- "→ Back to Capture" quick link (for failed/partial cases)

### Right column (~45%) — Source data from session
Shows the relevant module's data that the AI referenced (or couldn't find):
- **Module name** at the top
- **Cards in module** — listed with checkmarks if the AI used them as source
- **Gaps in module** — listed with highlight (← !!) on the gap that matches the failed test case
- **Answers** — if any Q&A relates to this test case, show the answer snippet

**The right column updates when the Manager clicks a different test case on the left.** It always shows the data relevant to the SELECTED test case.

### How the right column differs per result

| Result | Right column shows |
|---|---|
| **✅ Answered** | Module + cards the AI used as sources (highlighted in green) |
| **⚠️ Partial** | Module + cards used + gaps/cards that COULD have helped (highlighted in amber) |
| **❌ Insufficient** | Module + all cards (none highlighted) + the gap that matches (highlighted in rose with ← !!) |

---

## DV-04: Flag button on test cases ✅ LOCKED

### Purpose

Not every failed test case requires going back to Capture. Some gaps are low priority or not worth the time. The flag button lets the Manager mark test cases as "not critical — skip on revisit."

### Interaction

- Each test case card (especially ❌ and ⚠️) has a small **flag icon button** (🚩) in the bottom-left
- **Click flag** → test case is marked as flagged:
  - Flag icon fills/changes color (rose → muted gray)
  - Badge updates: "❌ Insufficient" → "❌ Insufficient · 🚩 Flagged"
  - The test case row dims slightly (80% opacity)
- **Click again** → unflag (toggle)
- Flagged test cases are excluded from the "insufficient" count in the summary:
  - Before: "❌ 2 insufficient"
  - After flagging 1: "❌ 2 insufficient (1 flagged)"

### What flagging does

| When | Effect |
|---|---|
| **On the Deliver page** | Flagged test cases dim and move to the bottom of the list. Summary shows "(1 flagged)" |
| **Going back to Capture** | Flagged test case topics are NOT auto-generated as new questions for the Offboarder |
| **Re-run test cases** | Flagged cases still run but their result doesn't affect the summary color (green/amber/rose) |
| **Commit** | Flagged insufficient cases are committed as low-priority gaps (not high-priority) |

### Visual

| State | Flag icon | Card appearance |
|---|---|---|
| Unflagged (default) | 🚩 outline, gray | Full opacity |
| Flagged | 🚩 filled, muted | 80% opacity, moves to bottom |

---

## DV-05: Simulated conversation format ✅ LOCKED

### Three result states

| Result | Badge | Left border | Icon |
|---|---|---|---|
| **Answered** | Green bg (#dcfce7) | Green (#059669) | ✅ |
| **Partial** | Amber bg (#fef3c7) | Amber (#f59e0b) | ⚠️ |
| **Insufficient** | Rose bg (#ffe4e6) | Rose (#e11d48) | ❌ |

### Conversation card content
- Persona icon + label ("🧑‍💻 Newcomer asks:")
- Question text (bold)
- AI answer (gray-50 background, 2-4 sentences)
- Sources (small violet links to card names) — for Answered/Partial
- Recommendation + gap link — for Insufficient
- Flag button (🚩) — bottom-left
- "→ Back to Capture" link — for Insufficient/Partial, bottom-right

---

## DV-06: Results summary bar ✅ LOCKED

### Above the two-column layout

```
Data Validation — 8 test cases
✅ 5 answered   ⚠️ 1 partial   ❌ 2 insufficient (1 flagged)
```

- Horizontal bar: green/amber/rose segments proportional to counts
- Flagged count shown in parentheses
- If all pass: green banner "All test cases passed — data is ready."
- If any fail (unflagged): amber banner "N test cases found insufficient data."
- Persona tabs below: [All 8] [Newcomer 3] [Manager 3] [Coworker 2]

---

## DV-07: Actions after validation ✅ LOCKED

### Validation is INFORMATIONAL, not blocking

Commit always enabled. Summary in confirmation modal: "Data validation: 5/8 passed, 1 flagged."

### "Back to Capture" from a test case
- Each failed/partial test case has a "→ Back to Capture" link
- Click → returns to Capture phase with a NEW question auto-generated from that test case's topic
- The question is pre-filled: "What's the disaster recovery procedure?" attributed to "Data Validation"

### "Re-run test cases" after returning
- Appears at the top of validation section after returning from Capture
- Click → re-evaluates all test cases using updated data
- Previously failed cases may now pass

---

## DV-08: Fallback logic ✅ LOCKED

- Manager commits with failed test cases → topics become gap entries marked "unverified"
- Flagged failed cases → committed as low-priority gaps
- Unflagged failed cases → committed as standard gaps
- Future sessions or manual research can fill these gaps later

---

## DV-09: Integration with Deliver page ✅ LOCKED

### Updated layout (two-column within validation section)

```
┌─────────────────────────────────────────────────────────┐
│  Ready to commit                                         │
│  Review Minh Lê's knowledge before committing.           │
├─────────────────────────────────────────────────────────┤
│  [42 entries] [14 answered] [5 modules]                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ✨ DATA VALIDATION                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │
│  ✅ 5  ⚠️ 1  ❌ 2 (1 flagged)                             │
│  [All] [Newcomer] [Manager] [Coworker]                   │
│                                                         │
│  ┌── Test cases ──────────┬── Source data ──────────┐    │
│  │ (scrollable list)      │ (updates per selection) │    │
│  │                        │                          │    │
│  │ Test case 1 ✅         │ Module: CI/CD Pipeline   │    │
│  │ Test case 2 ❌         │ Cards: ...               │    │
│  │ Test case 3 ⚠️         │ Gaps: ...                │    │
│  │ ...                    │ Answers: ...             │    │
│  └────────────────────────┴──────────────────────────┘    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  Resolved gaps (4) ✅                                     │
├─────────────────────────────────────────────────────────┤
│  Unresolved gaps (2) ⚠️                                   │
├─────────────────────────────────────────────────────────┤
│  Sanitization note                                       │
├─────────────────────────────────────────────────────────┤
│  [Back to Capture]              [Commit to KG]           │
└─────────────────────────────────────────────────────────┘
```

### How it interacts with existing elements

| Existing element | Impact |
|---|---|
| Knowledge summary | Unchanged — stays above |
| Resolved/Unresolved gaps | Unchanged — stays below |
| Commit button | Unchanged — always enabled |
| Confirmation modal | Add: "Data validation: 5/8 passed, 1 flagged." |

---

## Verification checklist

- [ ] Two-column layout: left = test cases, right = source data
- [ ] Right column updates when a different test case is selected
- [ ] Answered: right column highlights cards AI used (green)
- [ ] Partial: right column shows used cards + missing areas (amber)
- [ ] Insufficient: right column shows all cards (none highlighted) + matching gap (← !!)
- [ ] Flag button (🚩) on each test case — click to toggle
- [ ] Flagged cases: dim to 80%, move to bottom, excluded from summary count
- [ ] Summary bar: shows "(N flagged)" in parentheses
- [ ] "→ Back to Capture" link on failed/partial test cases
- [ ] Back to Capture: auto-generates question from test case topic
- [ ] "Re-run test cases" button after returning from Capture
- [ ] Commit modal: includes validation summary
- [ ] Persona tabs filter test cases
- [ ] Demo data: 8 test cases (5 pass, 1 partial, 2 fail)

---

*End of feature spec. Apply via Claude Code. Delete after verified.*
