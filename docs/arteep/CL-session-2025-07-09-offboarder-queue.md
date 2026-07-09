# ART-EEP — Offboarder Question Queue (2025-07-09)

*This is the AI Harness demo component. Apply via Claude Code. Delete after verified.*

---

## Overview

The Offboarder (Minh Lê) sees a single-purpose question queue during the Capture phase. The Data tab is locked — the Offboarder cannot browse cards or modules. All context is provided inline within each question card.

This component will also be used for the AI Harness live generation demo during the hackathon pitch.

---

## OQ-01: Queue header with progress + deadline ✅ LOCKED

**File:** new component or integrated into existing Offboarder workspace

**Layout:**
```
Your questions                           3 of 9 answered
Answer these to preserve your            ████████░░░░░░
knowledge for the team.                  22 days left
```

- Left: title + subtitle
- Right: `X of Y answered` (12px, font-semibold) + progress bar (5px, violet gradient) + `N days left` (10px, amber when < 30 days, rose when < 7 days)

---

## OQ-02: Module filter chips ✅ LOCKED

Filter chips below the header:
```
[All 9] [Payment Service 3] [CI/CD Pipeline 2] [Shared Libraries 1] [Inventory Sync 2] [General 1]
```

- Active chip: violet bg (`bg-violet-50 border-violet-300 text-violet-700`)
- Inactive: gray border, gray text
- Counts include both waiting + answered questions
- Filtering affects both Waiting and Answered sections

---

## OQ-03: Three question types with inline context ✅ LOCKED

All context visible by default — NO side panel, NO "See in context" button.

### Card questions (violet left border)

```
┌─ 3px violet border ──────────────────────────────┐
│ What are the undocumented rate limits?            │
│ [TN] Trần Hữu Nam · [Payment Service]            │
│                                                   │
│ ┌─ Context (gray bg) ──────────────────────────┐  │
│ │ 📄 Kafka retry configuration                 │  │
│ │ Also in: CI/CD Pipeline                      │  │
│ │ DLQ routing, backoff strategy, poison...     │  │
│ │ 📎 kafka-config.yaml · Checklist: 1/3        │  │
│ └──────────────────────────────────────────────┘  │
│                                                   │
│ [Type your answer...                        ]     │
│                                      [Submit]     │
└───────────────────────────────────────────────────┘
```

**Context block (gray bg, rounded):**
- Card name with FileText icon (Lucide)
- "Also in: [module]" if cross-module card (10px, indigo-500)
- Card description (first 2 lines)
- File attachments + checklist status (10px, gray)

**Attribution:** `[Avatar] Name · [Module tag]`

### Gap questions (yellow left border)

```
┌─ 3px yellow border ──────────────────────────────┐
│ How does retry logic handle poison messages?      │
│ [AI] AI-generated · [Gap · Payment Service]       │
│                                                   │
│ ┌─ Gap context (yellow bg) ────────────────────┐  │
│ │ ⚠ No disaster recovery documented            │  │
│ │ Your team has documentation on retry logic    │  │
│ │ but nothing on what happens if the entire     │  │
│ │ service goes down.                            │  │
│ │ Related: Kafka retry config · Gateway timeout │  │
│ └──────────────────────────────────────────────┘  │
│                                                   │
│ [Type your answer...                        ]     │
│                                      [Submit]     │
└───────────────────────────────────────────────────┘
```

**Gap context block (yellow-50 bg, yellow border):**
- Gap description (font-medium, yellow-800)
- Simplified AI summary — one human-readable sentence explaining what's missing. NO M/G agent reasoning, NO confidence scores.
- Related card names (10px, yellow-700)

### General questions (gray left border)

```
┌─ 3px gray border ────────────────────────────────┐
│ Are there undocumented vendor agreements?         │
│ [HV] Hà Vy · [General]                           │
│                                                   │
│ [Type your answer...                        ]     │
│                                      [Submit]     │
└───────────────────────────────────────────────────┘
```

No context block. No helper text. Just the question + attribution + answer input.

---

## OQ-04: Priority sort order ✅ LOCKED

Questions sorted by priority, NOT by creation time:

| Priority | Type | Section header |
|---|---|---|
| 1 (top) | Revision requested | "Needs revision · N" (amber text) |
| 2 | Gap questions (AI-generated) | "Waiting for you · N" |
| 3 | Card questions (human-asked) | (same section as gaps) |
| 4 | General questions | (same section) |
| 5 (bottom) | Answered | "Answered · N" |

Revision requests get their own section at the top with amber styling.

---

## OQ-05: Submit button disabled when empty ✅ LOCKED

Submit button is disabled (gray bg, `cursor: not-allowed`) when the textarea is empty. Enabled (violet bg) when text is entered.

---

## OQ-06: Answered section with edit ✅ LOCKED

Answered questions show:
- Question title + attribution + module tag
- Answer block with green left border
- Status badge: "Accepted" (green) or "Waiting review" (gray)
- Pencil edit button (Lucide `Pencil`, 12px) on the answer block
- Click edit → context block reappears + answer becomes editable textarea + Save/Cancel buttons

---

## OQ-07: Revision requested state ✅ LOCKED

When a Manager/Coworker sends a revision request:
- Question appears at the TOP of the queue (priority 1)
- Original answer struck through (50% opacity, line-through)
- Manager's revision note in yellow box: `[HV] Hà Vy requested a revision: "Please add..."` (italic)
- New textarea with yellow border + yellow bg: "Revise your answer..."
- "Resubmit" button (violet)

---

## OQ-08: Empty state ✅ LOCKED

When all questions are answered:
```
    ✓  All questions answered

    Hà Vy will review your answers before
    committing to the Knowledge Graph.
```

- Lucide `CheckCircle` (32px, emerald)
- Title: 14px, font-medium, emerald-700
- Subtitle: 11px, gray-500
- Centered in the page

---

## OQ-09: Data visibility restrictions ✅ LOCKED

**The Offboarder sees CONTENT but not CLASSIFICATION.**

| Data | Visible to Offboarder? |
|---|---|
| Card name, description, checklist, files | ✅ Yes — their own data |
| Gap description | ✅ Yes — need to know what's missing |
| Simplified AI summary (one sentence) | ✅ Yes — helps understanding |
| Related card names | ✅ Yes — context |
| Module name | ✅ Yes — context |
| "Also in" cross-module link | ✅ Yes — same pattern |
| Question attribution (who asked, when) | ✅ Yes — transparency |
| M/G agent reasoning (classification chat) | ❌ No — Manager internal tool |
| Confidence scores | ❌ No — Manager internal tool |
| Classification state (Pass/Review/New Module) | ❌ No — Manager internal tool |
| Filter tabs (Pass/Review/New Module/Uncategorized) | ❌ No — Manager internal tool |
| Detect dismiss/restore actions | ❌ No — Manager internal tool |

---

## OQ-10: Attribution pattern ✅ LOCKED

All attributions use the `[Avatar] Name` pattern:

| Role | Avatar | Color |
|---|---|---|
| Manager (Hà Vy) | `HV` | violet-100 bg, violet-700 text |
| Coworker (Trần Hữu Nam) | `TN` | teal-100 bg, teal-700 text |
| Coworker (Linh Anh) | `LA` | teal-100 bg, teal-700 text |
| AI-generated | `AI` | gray-100 bg, gray-500 text |

---

## OQ-11: File attachment — text-only for POC ✅ LOCKED

No file upload on answers. Text-only for the POC.

---

## Verification checklist

**Header:**
- [ ] "X of Y answered" + progress bar (violet gradient) + "N days left" (amber/rose)
- [ ] Progress bar width matches answered/total ratio

**Filters:**
- [ ] Module filter chips with counts
- [ ] Active chip violet, inactive gray
- [ ] Filtering affects both Waiting and Answered sections

**Question types:**
- [ ] Card questions: violet left border + inline card context (name, desc, files, checklist)
- [ ] Gap questions: yellow left border + inline gap context (gap desc, AI summary, related cards)
- [ ] General questions: gray left border, no context block
- [ ] Cross-module cards show "Also in: [module]" in context block
- [ ] No "See in context" button or side panel

**Sort:**
- [ ] Revision requested at top (own section, amber header)
- [ ] Gaps before cards before general in Waiting section
- [ ] Answered at bottom

**Interactions:**
- [ ] Submit disabled when textarea empty (gray, cursor not-allowed)
- [ ] Submit enabled when text entered (violet)
- [ ] Edit button (pencil) on answered items
- [ ] Edit reopens context block + editable textarea + Save/Cancel
- [ ] Revision state: original struck through, manager note in yellow, "Revise your answer" input, Resubmit button

**States:**
- [ ] Accepted badge (green) on answered items
- [ ] Waiting review badge (gray) on answered items
- [ ] Revision requested badge (amber) on revision items
- [ ] Empty state when all answered (CheckCircle + message)

**Visibility:**
- [ ] No AI classification data visible (M/G chat, confidence, filter tabs)
- [ ] Card content unrestricted (Offboarder's own data)
- [ ] All attributions use [Avatar] Name pattern with role colors

---

*End of component spec. Apply via Claude Code. Delete after verified.*
