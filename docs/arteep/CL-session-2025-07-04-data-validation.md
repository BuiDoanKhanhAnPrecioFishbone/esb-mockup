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
3. **✨ NEW — Data Validation:** simulated conversations testing the data
4. **Resolved gaps:** green checkmarks
5. **Unresolved gaps:** yellow info (not blockers)
6. **Sanitization note**
7. **Action buttons:** Back to Capture + Commit to KG

Data Validation sits BETWEEN the summary and the gap sections — it's the quality gate.

---

## DV-02: Test case library ✅ LOCKED

### Organized by consumer persona

The system maintains a library of test questions, grouped by the type of person who would consume the knowledge:

| Persona | Icon | Purpose | Example questions |
|---|---|---|---|
| **Newcomer** | 🧑‍💻 | "Can someone onboard using this data?" | "How do I deploy the payment service?" · "What's the retry logic for failed transactions?" · "Who do I contact for Kafka issues?" |
| **Manager** | 📊 | "Can a manager oversee using this data?" | "What are the key risks in the payment pipeline?" · "What's the disaster recovery procedure?" · "What SLAs exist for the payment gateway?" |
| **Coworker** | 👥 | "Can a peer maintain this system using this data?" | "How does the webhook handler work?" · "What's the error escalation path?" · "How is the DLQ consumer group configured?" |

### Demo quantities

For the POC demo, use:
- **3 Newcomer test cases** (2 pass, 1 fail)
- **3 Manager test cases** (1 pass, 1 partial, 1 fail)
- **2 Coworker test cases** (2 pass)

Total: **8 test cases** — 5 pass, 1 partial, 2 fail.

This mix demonstrates the feature's value: most data is good, but the validation caught 2 gaps the team missed.

---

## DV-03: Simulated conversation format ✅ LOCKED

### Each test case is a mini-conversation

The test case is displayed as a simulated chat between a hypothetical consumer and the AI:

```
┌── Test case 1 of 3 ────────────────────── ✅ Answered ─┐
│                                                         │
│  🧑‍💻 Newcomer asks:                                     │
│  "How do I deploy the payment service?"                  │
│                                                         │
│  🤖 AI answers (using Minh Lê's data):                    │
│  "The deployment uses Atlas migrations through the       │
│   CI/CD pipeline. Start by running the migration         │
│   script at /scripts/deploy.sh, then verify via the      │
│   health check endpoint at /status. The rollback          │
│   procedure is documented in the Atlas migration card."   │
│                                                         │
│  📎 Sources: Atlas migration · CI/CD pipeline config     │
│              · Deployment checklist (3 cards)              │
│                                                         │
└───────────────────────────────────────────────────────┘
```

Failed test case:
```
┌── Test case 2 of 3 ─────────────────── ❌ Insufficient ─┐
│                                                         │
│  📊 Manager asks:                                       │
│  "What's the disaster recovery procedure?"               │
│                                                         │
│  🤖 AI answers:                                          │
│  "I don't have enough information about disaster         │
│   recovery. The collected data covers retry logic and     │
│   webhook handling, but no DR procedures were             │
│   documented during the session."                        │
│                                                         │
│  💡 Recommendation:                                      │
│  Return to Capture and ask Minh Lê about DR procedures.  │
│  This maps to GAP #1 in Payment Service.                 │
│                                                         │
└───────────────────────────────────────────────────────┘
```

### Three result states

| Result | Badge | Card border | Icon | Meaning |
|---|---|---|---|---|
| **Answered** | Green bg (#dcfce7) | Green left border (#059669) | ✅ | AI produced a meaningful, grounded answer from collected data |
| **Partial** | Amber bg (#fef3c7) | Amber left border (#f59e0b) | ⚠️ | AI answered but with gaps, missing details, or low confidence |
| **Insufficient** | Rose bg (#ffe4e6) | Rose left border (#e11d48) | ❌ | AI couldn't answer — data is missing. Links to the relevant gap. |

### Conversation visual design

| Element | Style |
|---|---|
| Consumer message | Left-aligned, bold question text, persona icon + label above |
| AI answer | Left-aligned below, gray background (#f8fafc), regular weight, 2-4 sentences max |
| Sources line | Below AI answer, small text (9px), card/gap names as violet links |
| Recommendation (fail only) | Below AI answer, amber or rose background, 💡 icon, links to specific gap |
| Result badge | Top-right of the test case card |
| Card container | White bg, colored left border (3px), rounded corners, subtle shadow |

---

## DV-04: Results summary bar ✅ LOCKED

### Above the individual test cases

A summary bar showing the overall validation result:

```
Data Validation — 8 test cases
✅ 5 answered   ⚠️ 1 partial   ❌ 2 insufficient
```

### Visual
- Horizontal bar with 3 colored segments (green/amber/rose) proportional to counts
- Below: text counts for each state
- If all pass: green banner "All test cases passed — data is ready for consumption."
- If any fail: amber banner "2 test cases found insufficient data. Consider returning to Capture."

### Persona tabs

Below the summary bar, persona tabs to filter test cases:
```
[All 8] [🧑‍💻 Newcomer 3] [📊 Manager 3] [👥 Coworker 2]
```

Clicking a tab filters to show only that persona's test cases.

---

## DV-05: Actions after validation ✅ LOCKED

### Validation is INFORMATIONAL, not blocking

Consistent with our "commit always allowed" rule — the Manager can commit even if test cases fail.

| Validation result | Commit button state | Additional messaging |
|---|---|---|
| All pass | ✅ Enabled (green confidence) | "All 8 test cases passed. Data is ready." |
| Some fail | ✅ Enabled (amber warning) | "2 test cases found gaps. You can return to Capture or commit as-is." |
| All fail | ✅ Enabled (rose warning) | "All test cases failed. The collected data may not be sufficient. Consider returning to Capture." |

### "Back to Capture" flow (unchanged)
- Manager clicks "Back to Capture"
- Offboarder's queue reopens
- New targeted questions can be added based on the failed test cases
- The validation results are preserved — Manager can re-run after new answers arrive

### "Re-run validation" button
- After returning from Capture (new answers submitted), a **"Re-run test cases"** button appears
- Click → system re-evaluates using the updated collected data
- Results refresh — previously failed cases may now pass

---

## DV-06: Fallback logic — time runs out ✅ LOCKED

**Scenario:** The Offboarder's last day is approaching. Some test cases still fail but there's no time to go back to Capture.

**Behavior:**
- Manager commits anyway → unresolved gaps stored as potential knowledge (existing rule)
- Failed test case topics become gap entries in the committed session
- The KG marks these as "unverified — data validation incomplete"
- Future sessions or manual research can fill these gaps later

This is NOT a new mechanism — it reuses the existing "commit with unresolved gaps" flow.

---

## DV-07: Integration with existing Deliver page ✅ LOCKED

### Updated Deliver page layout

```
┌─────────────────────────────────────────────────┐
│  Ready to commit                                │
│  Review Minh Lê's knowledge before committing.   │
├─────────────────────────────────────────────────┤
│  [42 entries] [14 answered] [5 modules]          │
├─────────────────────────────────────────────────┤
│                                                 │
│  ✨ DATA VALIDATION                                │
│  ──────────────────────────────────────────── │
│  ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅  │
│  ✅ 5 answered  ⚠️ 1 partial  ❌ 2 insufficient    │
│                                                 │
│  [All 8] [Newcomer 3] [Manager 3] [Coworker 2]  │
│                                                 │
│  ┌─ Test case 1 ───────────────── ✅ Answered ┐  │
│  │ 🧑‍💻 Newcomer: "How do I deploy..."        │  │
│  │ 🤖 AI: "The deployment uses Atlas..."     │  │
│  │ 📎 Sources: 3 cards                      │  │
│  └─────────────────────────────────────────┘  │
│                                                 │
│  ┌─ Test case 2 ──────────── ❌ Insufficient ┐  │
│  │ 📊 Manager: "What's the DR procedure?"   │  │
│  │ 🤖 AI: "I don't have enough info..."     │  │
│  │ 💡 Return to Capture: ask about DR       │  │
│  └─────────────────────────────────────────┘  │
│                                                 │
├─────────────────────────────────────────────────┤
│  Resolved gaps (4) ✅                             │
├─────────────────────────────────────────────────┤
│  Unresolved gaps (2) ⚠️                           │
├─────────────────────────────────────────────────┤
│  Sanitization note                               │
├─────────────────────────────────────────────────┤
│  [Back to Capture]     [Commit to KG]             │
└─────────────────────────────────────────────────┘
```

### How it interacts with existing elements

| Existing element | Impact |
|---|---|
| Knowledge summary (3 stat cards) | Unchanged — stays above validation |
| Resolved gaps section | Unchanged — stays below validation |
| Unresolved gaps section | Unchanged — info banner, not blocker |
| "Commit to KG" button | Unchanged — always enabled, validation is informational |
| "Back to Capture" button | Unchanged — reopens Offboarder queue |
| Confirmation modal | Add line: "Data validation: 5/8 test cases passed." |

---

## DV-08: "Re-run test cases" after returning from Capture ✅ LOCKED

**Scenario:** Manager saw 2 failed test cases → went back to Capture → Offboarder answered the missing questions → Manager returns to Deliver.

**Behavior:**
- The validation section shows the PREVIOUS results (stale)
- A **"Re-run test cases"** button appears at the top of the validation section
- Click → system re-evaluates using the updated collected data
- Results refresh — previously failed cases may now pass
- The summary bar updates accordingly

**Visual:** "Re-run" button is violet outline, positioned next to the summary bar.

---

## Design system fit

| Element | Treatment |
|---|---|
| Section header | "Data Validation" with ✨ sparkle icon, same size as "Resolved gaps" header |
| Summary bar | Green/amber/rose segments proportional to counts, 6px height |
| Test case cards | White bg, 3px colored left border, rounded-lg, padding 12px |
| Consumer message | Bold text, persona icon (emoji or small avatar), persona label |
| AI answer | Gray-50 background, regular weight, 2-4 sentences max |
| Sources | Small text (9px), violet links to card names |
| Recommendation | Amber or rose-50 background, 💡 icon, links to gap |
| Persona tabs | Same tab styling as filter tabs on Data tab |
| "Re-run" button | Violet outline, same styling as secondary buttons |

---

## Verification checklist

- [ ] Deliver page: Data Validation section appears between knowledge summary and gaps
- [ ] Summary bar: green/amber/rose segments + text counts (5 answered, 1 partial, 2 insufficient)
- [ ] Persona tabs: All / Newcomer / Manager / Coworker with counts
- [ ] Test case cards: consumer question + AI answer + sources + result badge
- [ ] Answered cards: green left border, ✅ badge, sources listed
- [ ] Partial cards: amber left border, ⚠️ badge, AI answer shows gaps
- [ ] Insufficient cards: rose left border, ❌ badge, 💡 recommendation linking to specific gap
- [ ] Commit button: always enabled regardless of validation results
- [ ] Confirmation modal: includes "Data validation: N/8 test cases passed"
- [ ] "Re-run test cases" button appears after returning from Capture
- [ ] Payment Service: 3 gaps → at least 1 test case references a gap as insufficient
- [ ] Demo data: 8 total test cases (5 pass, 1 partial, 2 fail)

---

*End of feature spec. Apply via Claude Code. Delete after verified.*
