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

### Position in Deliver page layout (top to bottom)

1. **Header:** violet gradient, "Ready to commit" + subtitle
2. **Knowledge summary:** 3 stat cards (entries/answered/modules)
3. **✨ Data Validation:** summary bar + persona tabs + two-column accordion
4. **Resolved gaps:** green checkmarks (collapsible if >5)
5. **Unresolved gaps:** yellow info banner (not blockers)
6. **Sanitization note:** 🔒 info
7. **Action buttons:** "← Back to Capture" (secondary) + "Commit to Knowledge Graph" (violet gradient, always enabled)

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

## DV-03: Two-column layout with accordion test cases ✅ LOCKED

### Left column (~55%) — Accordion test case rows

Test cases are **collapsed by default** as compact rows. Click to expand and see the full conversation.

**Collapsed row (default):**
```
[persona icon] [question text truncated] ........ [result badge] [🚩] [▼]
```
Each row shows: persona icon (🧑‍💻/📊/👥), question text (single line, truncated), result badge (✅/⚠️/❌), optional flag button (🚩), chevron (▼).

**Expanded row (clicked):**
```
[persona icon] [question text full] ................. [result badge] [▲]
─────────────────────────────────────────────────────────────
📊 Manager asks:
"What's the disaster recovery procedure?"

🤖 AI (using Minh Lê's data):
"I don't have enough information about disaster recovery.
 The collected data covers retry logic and webhook handling,
 but no DR procedures were documented."

💡 No card covers DR. Maps to GAP #1 in Payment Service.

[🚩 Flag]                                    [→ Back to Capture]
```

**Interaction rules:**
- Only ONE row expanded at a time (accordion style)
- Expanding a row updates the RIGHT column to show that test case's source data
- The expanded row gets a violet left border (3px) + light violet background (#faf8ff)
- Flagged rows: 50% opacity, ❌ 🚩 badge, sorted to bottom

### Right column (~45%) — Source data for selected test case

Updates when a different test case is selected/expanded. Shows the relevant module's data:

- **Module name** at the top
- **Cards in module** — listed, with highlights per result type
- **Gaps in module** — listed, with "← matches this test case" highlight on relevant gap
- **Relevant answers** — if any Q&A relates to this test case

| Result | Right column behavior |
|---|---|
| **✅ Answered** | Cards the AI used highlighted in green |
| **⚠️ Partial** | Used cards highlighted + missing areas in amber |
| **❌ Insufficient** | All cards shown (none highlighted) + matching gap in rose with "← matches" |

---

## DV-04: Flag button on test cases ✅ LOCKED

Each test case has a **flag icon button** (🚩):

- **Click** → toggles flagged state
- **Flagged test case:** dims to 50% opacity, badge shows "❌ 🚩", moves to bottom of list
- **Summary count:** "❌ 2 insufficient (1 flagged)" — flagged count in parentheses
- **Going back to Capture:** flagged topics are NOT auto-generated as new questions
- **Re-run:** flagged cases still run but don't affect summary color
- **Commit:** flagged failures become low-priority gaps (not standard gaps)

---

## DV-05: Three result states ✅ LOCKED

| Result | Badge color | Left border | Meaning |
|---|---|---|---|
| **✅ Answered** | Green (#dcfce7) | Green (#059669) | AI produced a meaningful, grounded answer |
| **⚠️ Partial** | Amber (#fef3c7) | Amber (#f59e0b) | AI answered but with gaps or low confidence |
| **❌ Insufficient** | Rose (#ffe4e6) | Rose (#e11d48) | AI couldn't answer — data missing |

---

## DV-06: Results summary bar ✅ LOCKED

Above the accordion:

- Horizontal progress bar: green/amber/rose segments proportional to counts (5px height)
- Text counts: "✅ 5 answered · ⚠️ 1 partial · ❌ 2 insufficient (1 flagged)"
- Persona tabs below: [All 8] [🧑‍💻 Newcomer 3] [📊 Manager 3] [👥 Coworker 2]
- All pass → green banner. Any fail → amber banner.

---

## DV-07: Actions after validation ✅ LOCKED

### Commit always enabled — validation is informational

| Validation result | Commit button | Messaging |
|---|---|---|
| All pass | ✅ Enabled (green) | "All 8 test cases passed." |
| Some fail | ✅ Enabled (amber) | "2 test cases found gaps." |
| All fail | ✅ Enabled (rose) | "Data may not be sufficient." |

### Per-test-case actions
- **"→ Back to Capture"** link on failed/partial rows → returns to Capture, auto-generates question from that test case topic
- **"Re-run test cases"** button appears after returning from Capture → re-evaluates using updated data

### Confirmation modal
Adds line: "Data validation: 5/8 test cases passed, 1 flagged."

---

## DV-08: Fallback logic ✅ LOCKED

- Manager commits with failures → topics become gap entries
- Flagged failures → low-priority gaps
- Unflagged failures → standard gaps
- Reuses existing "commit with unresolved gaps" flow

---

## Verification checklist

- [ ] Deliver page layout: header → summary → Data Validation → gaps → sanitization → buttons
- [ ] Test cases displayed as accordion rows (collapsed by default)
- [ ] Only one row expanded at a time
- [ ] Expanded row shows full conversation: persona asks → AI answers → sources/recommendation
- [ ] Right column updates per selected test case
- [ ] Answered: right column highlights source cards in green
- [ ] Insufficient: right column shows matching gap with "← matches" in rose
- [ ] Flag button (🚩) toggles on each test case
- [ ] Flagged cases: 50% opacity, sorted to bottom, excluded from summary count
- [ ] Summary bar: green/amber/rose segments + "(N flagged)" count
- [ ] Persona tabs filter test cases
- [ ] "→ Back to Capture" on failed/partial rows
- [ ] "Re-run test cases" button after returning from Capture
- [ ] Commit button: always enabled with violet gradient
- [ ] Confirmation modal: includes validation summary
- [ ] Demo data: 8 test cases (5 pass, 1 partial, 2 fail)

---

*End of feature spec. Apply via Claude Code. Delete after verified.*
