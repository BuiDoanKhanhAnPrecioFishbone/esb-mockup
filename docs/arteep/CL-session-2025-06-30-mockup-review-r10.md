# ART-EEP — Mockup Review Round 10 (2025-06-30)

*Refinements to R8/R9. Apply via Claude Code.*

---

## R10-01: Remove "Pass" badge from card rows ✅ LOCKED

**⚠️ CORRECTION to R8-11:** The "Pass" badge creates visual clutter since most cards (~70%) will be Pass. The absence of a badge IS the Pass state.

**Updated badge visibility:**

| State | Badge on card row | Left border accent | Visual weight |
|---|---|---|---|
| **Pass** | ❌ No badge — clean row | No accent | Quiet — the default |
| **Review** | ⚠ Review (amber) | 2px amber (#f59e0b) | Draws attention |
| **New Module** | 💡 New Module (violet) | 2px violet (#7c3aed) | Draws attention |
| **Uncategorized** | Uncategorized (gray) | Dashed gray (#cbd5e1) | Draws attention |

**Filter tabs still show Pass count:** "All 12 · Pass 7 · Review 2 · New Module 1 · Uncategorized 2" — clicking Pass filters to show only Pass cards. But individual Pass card rows have NO badge.

**AI Reasoning still accessible for Pass cards:** Manager can click the module tag in the card detail panel to see the AI reasoning even for Pass cards. The reasoning panel is available for ALL states — the badge is just the surface-level signal.

**Files:** `components/mockups/session-command-view.jsx`, `components/mockups/session-thanh-tung.jsx`

---

## R10-02: AI Reasoning panel — full UX definition ✅ LOCKED

**⚠️ REFINEMENT to R8-11 + R9-03:** Deep drill into the AI conversation UI.

### Format: Chat with labeled reasoning steps

Not plain chat bubbles — each message has a **labeled reasoning step** (action verb) that tells the reader what the agent is doing at each turn.

### Agent step labels

| Agent | Available step labels |
|---|---|
| **Modulize Agent (M)** | CLASSIFY, RECONSIDER, PROPOSE, DEFER |
| **Gap Agent (G)** | VERIFY, CHALLENGE, COUNTER, VALIDATE, FLAG |

These are action verbs, not generic labels. They tell the judges WHAT each agent is doing at each turn of the conversation.

### Message rules
- **1-2 sentences max** per message. Short and scannable.
- **No filler.** Every sentence makes a point.
- The conversation should read like a structured analysis, not casual chat.

### Conversation templates per state

#### Pass (2 messages — both agree)
```
[M] CLASSIFY
    Title mentions 'timesheet' and 'monthly' —
    clearly tracks working hours. This is Attendance.

                              [G] VERIFY
                              Agree. No ambiguity detected.
                              'Submit' implies employee action.

┌─ ✅ VERDICT ──────────────────────────┐
│ PASS: Attendance                      │
│ Both agents aligned, high confidence. │
│ ██████████████████████████████── 94%   │
└───────────────────────────────────────┘

● Module: Attendance — No action needed
```

#### Review (4 messages — agents disagree, escalate)
```
[M] CLASSIFY
    Contract metadata could be Profile or Payslip.
    No clear signal from the title alone.

                              [G] CHALLENGE
                              Neither module handles contract
                              lifecycle end-to-end. Taxonomy gap?

[M] RECONSIDER
    Checklist mentions renewal dates —
    that's a Payslip concern. Leaning Payslip.

                              [G] COUNTER
                              But no amount or currency mentioned.
                              Profile stores employee metadata.

┌─ ⚠️ VERDICT ─────────────────────────────┐
│ UNDECIDED — Context spans Profile +       │
│ Payslip. Admin review required.           │
│ █████████████████───────────────── 41%     │
└───────────────────────────────────────────┘

Your call: [Payslip ▼] [Confirm]
```

#### New Module (3 messages — agents agree on new module)
```
[M] CLASSIFY
    'Benchmark competitor features' doesn't fit
    any existing module. Suggest: Market Intelligence.

                              [G] VALIDATE
                              Agree. Cards like this should be
                              visible to PO, not buried in HR ops.

[M] PROPOSE
    New module 'Market Intelligence' — owned by PO.

┌─ 💡 VERDICT ──────────────────────────────┐
│ NEW MODULE SUGGESTED                       │
│ 'Market Intelligence' for PO.              │
│ No existing module fits.                   │
│ ████████████████████████████──── 88%        │
└────────────────────────────────────────────┘

Suggested: Market Intelligence → for PO
[Accept] [Skip]
```

#### Uncategorized (3 messages — agents can't decide)
```
[M] CLASSIFY
    'Fix office WiFi' — no clear module match.
    Could be Infrastructure, but we don't have one.

                              [G] FLAG
                              This might not be knowledge-relevant.
                              Administrative task, not domain expertise.

[M] DEFER
    Confidence too low. Leaving unassigned.

┌─ ⬜ VERDICT ───────────────────────────────┐
│ UNASSIGNED — No module match found.        │
│ Manual assignment required.                │
│ ████─────────────────────────── 12%         │
└────────────────────────────────────────────┘

Assign to: [Select module ▼] [Assign]
```

### Visual design (light mode)

| Element | Style |
|---|---|
| M bubble | White bg, **violet left border** (2px #7c3aed), left-aligned |
| G bubble | White bg, **orange left border** (2px #f97316), right-aligned (indented from left, not literally right-aligned in the panel) |
| Step label (CLASSIFY, VERIFY, etc.) | Uppercase, bold, colored to match agent (violet for M, orange for G), font-size 9px |
| Message text | 11px, regular weight, dark text, 1-2 sentences |
| Verdict box — Pass | Green border (#059669), green-50 background (#f0fdf4) |
| Verdict box — Review | Amber border (#f59e0b), amber-50 background (#fffbeb) |
| Verdict box — New Module | Violet border (#7c3aed), violet-50 background (#f5f3ff) |
| Verdict box — Uncategorized | Gray dashed border (#cbd5e1), gray-50 background (#f8fafc) |
| Confidence bar | Colored gradient bar on gray track. Green for high (>70%), amber for medium (40-70%), red for low (<40%) |
| Agent avatars | 20px circles: M = purple (#7c3aed), G = orange (#f97316), R = rose (#e11d48). Shown below verdict. |
| Action area | Below verdict. Matches the state: Pass = green text, Review = dropdown + Confirm, New Module = Accept/Skip, Uncategorized = dropdown + Assign |

### Panel positioning (unchanged)
- AI Reasoning: ~400px, LEFT of card detail panel
- Card Detail: ~480px, RIGHT
- Both visible simultaneously
- Trigger: click the module tag in card detail panel

**Files:** `components/mockups/session-command-view.jsx`

---

## R10-03: Data sources as selectable chips/tags ✅ LOCKED

**⚠️ OVERRIDE of R9-04:** Replace expandable accordion cards with a **chip/tag selection pattern**.

### Layout

Below the form fields, a "Data sources" section shows all integrations as horizontal chips:

```
Data sources
─────────────────────────────────────────────────────
[📌 Trello ✓]  [GitHub +]  [OneDrive +]  [Jira +]  [Notion +]  [Slack +]  [Planner +]

┌───────────────────────────────────────────────────┐
│ 📌 Paste Trello board or workspace URL *          │
└───────────────────────────────────────────────────┘
```

### Interaction

1. **Trello chip** — always active (violet bg, checkmark, can't be removed). Its input field is always visible below.
2. **Other chips** — start inactive (gray outline, "+" icon).
3. **Click an inactive chip** (e.g., "GitHub +") → chip activates (colored bg matching the integration) + a new input field appears below:
   ```
   [📌 Trello ✓]  [🐙 GitHub ✓ ×]  [OneDrive +]  ...
   
   📌 Paste Trello board or workspace URL *
   ┌───────────────────────────────────┐
   │ https://trello.com/b/abc123      │
   └───────────────────────────────────┘
   
   🐙 Paste GitHub repository URL
   ┌───────────────────────────────────┐
   │                                   │
   └───────────────────────────────────┘
   ```
4. **Click × on an active chip** → chip deactivates, input field disappears.
5. **Trello has no ×** — it's required and can't be removed.
6. **Multiple chips can be active** simultaneously.

### Chip visual states

| State | Appearance |
|---|---|
| **Active (Trello)** | Violet bg (#ede9fe), violet border (#c4b5fd), violet text (#5b21b6), ✓ icon, no × |
| **Active (other)** | Light bg matching integration brand color, colored border, ✓ icon + × remove button |
| **Inactive** | Gray outline (#e2e8f0), gray text, "+" icon, "Demo" tooltip on hover |

### Integration chips

| Chip | Brand color (active bg) | Icon placeholder |
|---|---|---|
| **Trello** (required) | Violet (#ede9fe) | 📌 |
| GitHub | Dark (#f1f5f9) | 🐙 |
| OneDrive | Blue (#dbeafe) | ☁️ |
| Jira | Blue (#dbeafe) | 🔷 |
| Notion | Gray (#f1f5f9) | 📓 |
| Slack | Purple (#f3e8ff) | 💬 |
| Planner | Green (#dcfce7) | 📋 |

### Input fields

Each active chip gets its own input field below the chip row. Fields stack vertically in the order they were activated. Each field shows:
- Integration icon + name
- Placeholder text: "Paste [integration] [type] URL"
- Non-functional for demo (typing allowed, nothing processes)

**File:** `components/mockups/create-session.jsx`

---

## Verification checklist

- [ ] No "Pass" badge on any card row in the Data tab
- [ ] Review/New Module/Uncategorized cards still have their badges + left border accents
- [ ] Filter tabs still show "Pass N" count (clickable to filter)
- [ ] AI Reasoning panel: messages have labeled steps (CLASSIFY, VERIFY, CHALLENGE, etc.)
- [ ] AI Reasoning panel: 1-2 sentences per message, no filler
- [ ] AI Reasoning: Pass = 2 messages, Review = 4 messages, New Module = 3 messages, Uncategorized = 3 messages
- [ ] AI Reasoning: verdict box colored per state (green/amber/violet/gray-dashed)
- [ ] AI Reasoning: confidence bar gradient (green >70%, amber 40-70%, red <40%)
- [ ] AI Reasoning: action area matches state (no action / dropdown+Confirm / Accept+Skip / dropdown+Assign)
- [ ] Session creation: data sources shown as horizontal chips
- [ ] Session creation: Trello chip always active, no × remove
- [ ] Session creation: clicking inactive chip activates it + reveals input field below
- [ ] Session creation: clicking × on active chip deactivates + hides input
- [ ] Session creation: multiple chips can be active simultaneously
- [ ] Session creation: non-Trello inputs are non-functional (typing allowed, nothing processes)

---

*End of R10. Apply via Claude Code alongside R8/R9. Delete all three files after verified.*
