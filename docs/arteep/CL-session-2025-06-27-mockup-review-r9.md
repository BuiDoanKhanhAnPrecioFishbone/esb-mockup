# ART-EEP — Mockup Review Round 9 (2025-06-27)

*Corrections and refinements to R8. Apply via Claude Code.*

---

## R9-01: "Detects" tag coloring — orange, not amber ✅ LOCKED

**⚠️ CORRECTION to R8-07:** The "Detects" tag should use **orange**, not amber. Orange is more vivid and eye-catching for the demo.

**Updated coloring:**

| Element | R8 (amber) | R9 (orange) |
|---|---|---|
| Badge background | ~~#fef3c7~~ | **#fff7ed** (orange-50) |
| Badge text | ~~#92400e~~ | **#c2410c** (orange-700) |
| Badge border | ~~#fcd34d~~ | **#fb923c** (orange-400) |
| Badge icon | ⚡ | ⚡ (unchanged) |

**Examples:** `⚡ no description` · `⚡ checklist 1/3` · `⚡ stale (90d)`

All rendered in orange tones.

**Files:** `components/mockups/session-command-view.jsx`, `components/mockups/session-thanh-tung.jsx`

---

## R9-02: Gap module label — show once per group, not per gap ✅ LOCKED

**⚠️ CORRECTION to R8-02:** When multiple gaps belong to the same module, don't repeat "Module: [name]" on every gap. Show it once at the group header.

**Before (R8):**
```
✨ GAP #1: No disaster recovery documented
   Module: Payment Service
   └── Questions (2)

✨ GAP #2: No error escalation process
   Module: Payment Service       ← redundant
   └── Questions (1)
```

**After (R9):**
```
Payment Service — 2 gaps
───────────────────────────
✨ GAP #1: No disaster recovery documented
   └── Questions (2)

✨ GAP #2: No error escalation process
   └── Questions (1)
```

The module name appears once as a section header with the gap count. Individual gaps are numbered within that group. If gaps span different modules, each module gets its own group header.

**Files:** `components/mockups/session-command-view.jsx`, `components/mockups/session-thanh-tung.jsx`

---

## R9-03: AI Reasoning — show actual multi-agent chat, trigger from module tag ✅ LOCKED

**⚠️ CORRECTION to R8-11:** The user WANTS the multi-agent chat format (as shown in the reference images), NOT the simplified single narrative proposed in R8.

### What changes from R8-11

| R8 (proposed) | R9 (corrected) |
|---|---|
| Single AI reasoning narrative | **Actual chat between two AI agents** |
| Coherent explanation paragraph | **Chat bubbles: Modulize Agent (left) vs Gap Agent (right)** |
| Simplified for POC | **Full agent debate visible — judges need to see the multi-agent system** |

### Two AI agents

| Agent | Role | Chat position | Avatar |
|---|---|---|---|
| **Modulize Agent** (M) | Analyzes card content and decides which module it belongs to | Left-aligned bubble | Purple circle with "M" |
| **Gap Agent** (G) | Checks for knowledge gaps, ambiguity, and missing coverage | Right-aligned bubble | Orange/rose circle with "G" |

### Chat format (inside the reasoning panel)

The AI reasoning panel shows a conversation between the two agents, ending with a verdict:

**Example — Pass (high confidence):**
```
[M] Modulize Agent
    Title mentions 'timesheet' and 'monthly' — clearly tracks
    working hours. This is Attendance.

                                        [G] Gap Agent
                                        Agree. No ambiguity detected.
                                        'Submit' implies employee action,
                                        fits Attendance workflow.

┌────────────────────────────────────────┐
│ ✅ VERDICT                                │
│ FINAL: Attendance — both agents aligned,  │
│ high confidence.                          │
│ ████████████████████████ 94%         │
└────────────────────────────────────────┘
```

**Example — Review (low confidence):**
```
[M] Modulize Agent
    But there's no mention of amount or currency.
    Contract metadata lives in employee record = Profile.

                                        [G] Gap Agent
                                        Neither module handles the contract
                                        lifecycle end-to-end. This might be
                                        a gap in our taxonomy.

┌────────────────────────────────────────┐
│ ⚠️ VERDICT                                │
│ UNDECIDED — Context spans both Profile    │
│ and Payslip. Admin review required.       │
│ ██████████████████────── 41%         │
└────────────────────────────────────────┘
```

### Trigger location

**Where to open the AI reasoning panel:** The **module tag/badge** inside the card detail side panel.

In the card detail panel (R8-08 reordered layout), the module assignment is item #2:
```
Card: Update contract renewal date
├── Module: [Payslip] ← this is clickable
├── Detects: ...
├── Q&A: ...
```

Clicking the module tag (e.g., the violet "Payslip" badge) opens the AI reasoning panel to the LEFT of the card detail panel. The module tag acts as the trigger.

**Visual hint that it's clickable:**
- Module tag has a subtle right arrow or expand icon: `[Payslip ›]`
- Or: a small "View AI reasoning" link below the module tag
- On hover: cursor pointer + slight background highlight on the tag

### Panel positioning (unchanged from R8-11)
- AI Reasoning panel: ~400px, opens to the LEFT of the card detail panel
- Card Detail panel: ~480px, stays on the RIGHT
- Both visible simultaneously
- Graph/Data tab content behind both panels

### Agent avatars

Three small circular avatars shown below the verdict box (matching reference images):
- **M** (purple) — Modulize Agent
- **G** (orange) — Gap Agent  
- **R** (rose) — Resolution/Verdict (the system's final call)

### Design system adaptation

The reference images use dark mode. Adapt to ART-EEP light mode:

| Element | Reference (dark) | ART-EEP (light) |
|---|---|---|
| Panel background | Dark (#1a1a2e) | White (#ffffff) with gray-50 canvas |
| Modulize Agent bubble | Dark with green text | White card, left-aligned, purple "M" avatar, violet left border |
| Gap Agent bubble | Dark with pink text | White card, right-aligned, orange "G" avatar, orange left border |
| Verdict box (Pass) | Green border on dark | Green border (#059669) on white, green background (#f0fdf4) |
| Verdict box (Review) | Amber border on dark | Amber border (#f59e0b) on white, amber background (#fffbeb) |
| Verdict box (New Module) | Purple border on dark | Violet border (#7c3aed) on white, violet background (#f5f3ff) |
| Confidence bar | Colored bar on dark | Same colored bar on gray-100 track |

**Files:** `components/mockups/session-command-view.jsx`

---

## R9-04: Session creation — expandable third-party link inputs ✅ LOCKED

**⚠️ REFINEMENT to R8-05:** The inactive integrations should not just be grayed-out icons. Each one should be a **clickable card that expands to reveal a link input field** when clicked.

### Layout

Below the Trello link (which is always expanded and required), show a row of integration cards:

```
Data sources
───────────────────────────────────────

[📌 Trello]  ✅ Active — required
┌─────────────────────────────────────┐
│ Paste Trello board or workspace URL    │
└─────────────────────────────────────┘

[GitHub]  [OneDrive]  [Planner]  [Jira]  [Notion]
   ↑ click any to expand
```

### Interaction
1. All non-Trello cards start **collapsed** — show icon + name only
2. Click a card (e.g., "GitHub") → it **expands** to reveal a link input field:
   ```
   [🐙 GitHub]  ▼
   ┌─────────────────────────────────────┐
   │ Paste GitHub repository URL            │
   └─────────────────────────────────────┘
   ```
3. The input is **non-functional** for the demo — typing is allowed but nothing processes
4. Click another card → it expands too (multiple can be open simultaneously)
5. Click the expanded card header → collapses back

### Integration list

| Integration | Icon | Placeholder text |
|---|---|---|
| **Trello** (✅ always expanded) | Trello icon | "Paste Trello board or workspace URL" |
| GitHub | GitHub icon | "Paste GitHub repository URL" |
| OneDrive | OneDrive icon | "Paste OneDrive folder URL" |
| Planner | Planner icon | "Paste Planner board URL" |
| Jira | Jira icon | "Paste Jira project URL" |
| Notion | Notion icon | "Paste Notion workspace URL" |
| Slack | Slack icon | "Paste Slack channel URL" |

Trello is the only one that's required and functional. The rest demonstrate platform extensibility for the judges.

### Visual treatment
- **Trello (active):** violet border, full opacity, required asterisk
- **Others (demo):** gray border, full opacity (NOT grayed out — they should look real), small "Demo" or "Coming soon" badge in the corner
- **Expanded state:** smooth expand animation, input field matches Trello input styling

**File:** `components/mockups/create-session.jsx`

---

## Verification checklist

- [ ] "Detects" tags use orange coloring (orange-50 bg, orange-700 text, orange-400 border)
- [ ] Gaps within same module: module name shown once as group header, not repeated per gap
- [ ] AI Reasoning panel shows actual multi-agent chat (Modulize Agent left, Gap Agent right, Verdict box)
- [ ] AI Reasoning trigger: clicking the module tag in card detail panel opens the reasoning panel to the left
- [ ] Module tag has visual hint that it's clickable (arrow, cursor pointer, hover highlight)
- [ ] Agent avatars: M (purple), G (orange), R (rose) shown below verdict
- [ ] Light-mode adaptation: white panels, colored borders, no dark-mode elements
- [ ] Session creation: Trello always expanded + GitHub/OneDrive/Planner/Jira/Notion/Slack as expandable cards
- [ ] Clicking an integration card expands to show link input field
- [ ] Non-Trello inputs are non-functional (typing allowed, nothing processes)
- [ ] Multiple integration cards can be expanded simultaneously

---

*End of R9. Apply via Claude Code alongside R8. Delete both files after verified.*
