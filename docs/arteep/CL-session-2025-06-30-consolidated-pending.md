# ART-EEP — Consolidated Pending Instructions (R5–R10 merged)

*Single instruction file for Claude Code. All corrections from R9/R10 applied inline.*
*Delete this file + all individual R2–R10 files after verified.*

---

## §1 — AppShell & Navigation

### 1.1 Remove "WAITING ON YOU" tag from all session headers
Search for `WAITING ON YOU`, `waitingOnManager`, `blockedOnManager` — remove from session header rendering in ALL views. The phase badge (PREPARE/CAPTURE/DELIVER) is sufficient.
**Files:** `session-command-view.jsx`, `session-thanh-tung.jsx`

### 1.2 Hide KG Explorer from Offboarder sidebar
Hide "Knowledge graph" sidebar entry when role is Offboarder. If Offboarder navigates to `/knowledge-graph` directly, redirect to `/`.
**File:** `AppShell.tsx`, `view-matrix.ts` (add to ROUTE_GATES)

### 1.3 Notification bell dropdown
**File:** `AppShell.tsx`

| Decision | Value |
|---|---|
| UI | Click bell → 320px dropdown, max 8 visible, scrollable |
| Grouping | By actor + session + time window |
| Deep links | Every notification navigates to specific surface |
| Unread badge | Red circle (#e11d48) with count on bell |
| Mark as read | Opening dropdown clears badge |
| Notification page | ❌ None — dropdown IS the experience |
| Cross-session | Notifications show session name for disambiguation |

**Notification row:** status dot (🟣 unread violet / ○ read gray) + timestamp + title (bold, 12px) + detail line (muted, 10px). Unread = full opacity. Read = 70% opacity. Click → navigates to deep link, closes dropdown.

**Events per role:**

*Manager:* Offboarder answered N questions · Coworker joined · Coworker asked question · AI detected gap · Crawl complete · Answer flagged by Coworker

*Offboarder:* New questions waiting · Answer marked "Needs more" · Answer satisfied · Session phase changed

*Coworker:* Answers ready for review · Gap detected in shared module · Session phase changed

### 1.4 Update `view-matrix.ts` tab states
**File:** `lib/view-matrix.ts`

Replace `tabVisibility` to match this matrix:

**Manager:**
| Step | Overview | Data | Logs |
|---|---|---|---|
| collecting | visible | disabled | disabled |
| ready (prepare) | visible | visible | visible |
| capture | visible | visible | visible |
| deliver | visible | disabled | disabled |
| complete | visible | disabled | disabled |

**Offboarder:**
| Step | Overview | Data | Logs |
|---|---|---|---|
| not-started | visible | disabled | disabled |
| collecting | visible | disabled | visible |
| capture | visible | hidden | visible |
| all-answered | visible | hidden | visible |
| complete | visible | hidden | visible |

**Coworker:**
| Step | Overview | Data | Logs |
|---|---|---|---|
| collecting | visible | disabled | disabled |
| ready (prepare) | visible | visible | visible |
| capture | visible | visible | visible |
| deliver | visible | disabled | visible |
| complete | visible | disabled | visible |

---

## §2 — Dashboard

### 2.1 Orbital empty state — corrected logic
Orbital shows for ANY zero-session Manager dashboard, regardless of HRIS status.

| Condition | What shows |
|---|---|
| Zero sessions + HRIS departures | Orbital + departure list + "Create session" CTA |
| Zero sessions + zero HRIS | Orbital + "No upcoming departures" + Sync/Create buttons |
| Active sessions | Normal dashboard (no orbital) |

**File:** `ha-vy-handover-dashboard.jsx`

---

## §3 — Session Creation

### 3.1 Simplified manual form — 4 fields

| Field | Required | Type |
|---|---|---|
| Email | Yes | Text — identification + invitation |
| Department | Yes | Dropdown |
| Last day | Yes | Date picker |
| Trello link | Yes | URL — data source. Name auto-derived from Trello profile |

Removed: Full name, Role/Title, "doesn't use Trello" checkbox.

### 3.2 Data sources as selectable chips/tags
Below the form fields, a "Data sources" row:

**Trello** (always active, violet bg, ✓, no ×, required) — input always visible below.

Other chips start **inactive** (gray outline, "+" icon): **GitHub · OneDrive · Planner · Jira · Notion · Slack**

**Click inactive chip** → activates (colored bg) + reveals link input field below. **Click × on active chip** → deactivates, input disappears. Multiple can be active. Non-Trello inputs are **non-functional** for demo (typing allowed, nothing processes).

### 3.3 HRIS pre-fill navigation
Clicking "Start session" on an HRIS departure navigates to `/session/new?employee=<id>` with info pre-filled, skipping to board selection.

### 3.4 Departure Pending + Active Session
Once a session exists for an employee, remove them from the departure list (no duplication).

### 3.5 Trello validation
| Check | Behavior |
|---|---|
| Valid board URL | Discovers cards → board appears in selection |
| Valid workspace URL | Discovers ALL boards → Manager selects |
| Invalid URL / 404 | Error message |
| Zero cards after filtering | Warning — Manager can still start |
| Empty board | Error message |
| Private boards | Not applicable — all boards assumed accessible |

**File:** `create-session.jsx`

---

## §4 — Session Detail: Data Tab (Manager)

### 4.1 Rename "Flag" to "Detects" — ORANGE coloring
| Element | Value |
|---|---|
| Badge bg | #fff7ed (orange-50) |
| Badge text | #c2410c (orange-700) |
| Badge border | #fb923c (orange-400) |
| Icon | ⚡ |

Examples: `⚡ no description` · `⚡ checklist 1/3` · `⚡ stale (90d)`

### 4.2 Remove drag-and-drop + "Move to" + attachment icon
No drag handles, no "Move to" dropdown, no paperclip icon on card rows. Module assignment via AI Classification Review (§4.6).

### 4.3 Remove "Generate another question" button from gaps
Gap questions are pre-generated by AI. Manager uses "Ask about this gap" (§4.7) for manual questions.

### 4.4 Move Uncategorized to TOP of module list
Uncategorized section above all module sections. Dashed border styling. Manager sees unresolved cards first.

### 4.5 Gap numbering with module group header
Multiple gaps per module grouped under one header:
```
Payment Service — 2 gaps
────────────────────────
✨ GAP #1: No disaster recovery documented
   └── Questions (2)

✨ GAP #2: No error escalation process
   └── Questions (1)
```
Module name shown ONCE as group header, not repeated per gap.

### 4.6 AI Classification Review panel

**4 states on card rows:**

| State | Badge | Left border | Action |
|---|---|---|---|
| Pass | ❌ No badge (clean row) | No accent | No action needed |
| Review | ⚠ Review (amber) | 2px amber | Manager verifies/overrides |
| New Module | 💡 New Module (violet) | 2px violet | Accept / Skip |
| Uncategorized | Uncategorized (gray) | Dashed gray | Assign manually |

**Filter tabs:** All · Pass · Review · New Module · Uncategorized (with counts).

**Trigger:** Click the **module tag** in the card detail side panel → opens AI Reasoning panel to the LEFT (~400px). Module tag has a `›` arrow hint + pointer cursor.

**AI Reasoning panel — multi-agent chat with labeled steps:**

Two agents: **Modulize Agent (M)** — purple avatar, violet left-border bubbles, left-aligned. **Gap Agent (G)** — orange avatar, orange left-border bubbles, right-indented.

Step labels: M uses CLASSIFY, RECONSIDER, PROPOSE, DEFER. G uses VERIFY, CHALLENGE, COUNTER, VALIDATE, FLAG.

**1-2 sentences per message.** No filler.

**6 conversation templates:**

| Template | Messages | Verdict |
|---|---|---|
| Pass — single module | 2 | ✅ green box, "No action needed" |
| Pass — multi-module (1:N) | 3 | ✅ green box, "Primary: X + Linked: Y" |
| Review | 4 | ⚠️ amber box, dropdown + Confirm + "+ Add linked module" |
| New Module — standalone | 3 | 💡 violet box, Accept / Skip |
| New Module + existing link | 4 | 💡 violet box, "Accept both" / "Accept new only" / Skip |
| Uncategorized | 3 | ⬜ gray dashed box, dropdown + Assign + "+ Add linked module" |

**Confidence bar:** green >70%, amber 40-70%, red <40%.

**Agent avatars below verdict:** M (purple), G (orange), R (rose).

**"+Add linked module" on Review/Uncategorized:** opens dropdown of existing modules, adds as linked.

### 4.7 "Ask about this gap" — Manager AND Coworker
Functional button at bottom of gap context panel. Click → inline input → type question → "Ask" → question added to gap list + Offboarder queue.

| Role | Button | Attribution |
|---|---|---|
| Manager | ✅ Functional | Tagged "Hà Vy · [Module] · waiting" |
| Coworker | ✅ Functional | Tagged "Coworker · [Module] · waiting" |
| Offboarder | ❌ Removed | — |

Manager also has "+ Generate question" (AI) on Data tab gap rows. Both coexist.

Wait — §4.3 removes "Generate question". Correction: §4.3 removes it. Manager uses "Ask about this gap" only for manual questions. No AI generation button for POC.

### 4.8 Card detail panel — reorganized order
1. Card title + ID
2. **Module** — clickable tag (trigger for AI reasoning panel ›)
3. **Detects** — orange badges
4. **Q&A** — question count + expandable list
5. **AI Classification** — state badge + confidence %
6. **[Show details]** — expandable: description, checklist, files, metadata

### 4.9 Bulk operations — Manager only
| Action | Button | Confirmation |
|---|---|---|
| Satisfy answers | "Satisfy remaining (N)" at bottom of module answer section. Appears when ≥2 unsatisfied. | No confirmation (low risk, individually reversible) |
| Dismiss flags | "Dismiss all flags (N)" at bottom of module flag section. Appears when ≥2. | Brief confirmation dialog |

No checkboxes. Module-level only. No cross-module bulk. No Coworker bulk.

### 4.10 AI question deletion confirmation
Click trash on AI question → centered modal: "Delete this question? The AI won't regenerate it." → Delete (rose) / Cancel.

**Files:** `session-command-view.jsx`, `session-thanh-tung.jsx`

---

## §5 — Session Detail: Manager View

### 5.1 Collecting Data — animation only, NO orbital
Show AI categorization animation. Orbital is for Offboarder/Coworker Collecting (§6.2, §7.2).

### 5.2 Departure Pending — orbital illustration
Orbital for "no data yet" state.

### 5.3 Manager "Needs more" — same flow as Coworker
1. Click "Needs more" → note field: "What's missing?"
2. Write feedback → "Send back"
3. Offboarder sees: "↩ Revision requested" badge + struck-through answer + "Hà Vy" note + new answer field

### 5.4 Deliver page
**Commit always allowed** — unresolved gaps are info, NOT blockers.

Layout: header → 3 stat cards (entries/answered/modules) → resolved gaps (green ✓) → unresolved gaps (yellow ⚠, info banner: "will be stored as potential knowledge") → sanitization note → "Back to Capture" + "Commit to KG" (always enabled).

Confirmation modal: entry count + sanitization + "N gaps will be preserved."

After commit: resolved gaps → purple KG nodes. Unresolved → stay in session as logged items.

---

## §6 — Session Detail: Offboarder View

### 6.1 "All Answered" — show full queue + auto-reversion
Celebration header ("You're all caught up!") + full read-only answered queue below (ALL questions, no truncation). Note: "New questions may still come in."

When new question arrives: celebration disappears automatically → active queue → new question at top with violet **"NEW"** badge (disappears on interaction). Notification fires.

### 6.2 Collecting state — orbital illustration
Orbital + "Your session is being prepared" + "Hà Vy is setting up your knowledge handover."

### 6.3 Offboarder can edit answers during Capture
Pencil icon on submitted answers → editable → Save/Cancel. "Edited" badge with timestamp. Locked once Deliver starts.

### 6.4 Gap questions "See in context" — module context panel
Yellow left border (not violet). Shows: module name, gap description, "Why this was flagged" reasoning, sibling questions, cards in module. **NO "Ask about this" button** (removed for Offboarder).

### 6.5 Complete page — 3-step timeline
Thank-you page: green gradient header + connected-nodes illustration + "Thank you, Minh Lê" + 3 stat cards + timeline (submitted ✅ → Manager review 🔵 → KG commit ⚪). **No successor playbook.**

### 6.6 Voice interview session mode
**Entry:** "Answer by voice" card above queue (secondary styling, violet outline). Not primary CTA.

**Voice session UI:** Left panel (question card with violet border, rose pulsing mic, timer, waveform, live transcript, controls: Pause/Skip/Next) + Right panel (~200px, "See in context" visible alongside recording).

**Flow:** question displayed as text (no TTS) → Offboarder speaks → live transcript → click "Next →" → review (Edit/Re-record/Next) → advance.

**Skipped questions:** offered again at end ("Answer these now" / "Leave for later").

**Session complete:** "🎉 Voice session complete" + summary + all answers listed with Edit buttons + **"Submit all (N answers)"** batch button.

**Re-entry:** restarts from beginning with unanswered questions only. "Needs more" answers count as unanswered.

**After submit:** answers appear in queue with 🎙 badge. Manager/Coworker see identical text answers.

### 6.7 Offboarder first interaction
Email invitation sent on session creation (implied, not built in mockup). Offboarder clicks link → logs in → sees session.

---

## §7 — Session Detail: Coworker View

### 7.1 "Needs more" vs "Ask a question" — two actions
**↩ Needs more:** button on answered card → note field "What's missing?" → "Send back" → Offboarder sees revision request with struck-through answer + Coworker's note.

**+ Ask a question:** separate action on Data tab → creates new question on a card → new item in Offboarder queue.

Remove any "Ask follow-up" label.

### 7.2 Collecting state — orbital illustration
Orbital + "Data is being collected" + "The system is crawling Trello boards."

### 7.3 Coworker joining flow
| Type | Access | Pending → Joined |
|---|---|---|
| Auto-derived (Trello overlap) | Session auto-appears on dashboard | First access of session |
| Manually added (Manager) | Email notification with link | Clicks link + accesses session |

### 7.4 "See in context" + functional "Ask about this gap"
Card questions → card context panel. Gap questions → gap context panel (yellow border, module name, "Why flagged", sibling questions, cards in module).

"Ask about this gap" button at bottom → inline input → creates human question tagged "Coworker · [Module] · waiting".

### 7.5 Complete celebration
Reuse Offboarder connected-nodes artwork. Adapt text for Coworker role.

### 7.6 Logs tab
Coworker has a Logs tab. Same format as Manager (questions asked, answers submitted, reviews done). No file-upload entries.

---

## §8 — Insights (within session)

### 8.1 Remove Activity section, keep heatmap only
Entry point from session Overview tab (not from a specific card). Shows heatmap for the ENTIRE session across all modules.

---

## §9 — Cross-role consistency

| Change | Manager | Offboarder | Coworker | Thanh Tùng |
|---|---|---|---|---|
| "Flag" → "Detects" (orange) | ✅ | ✅ | ✅ | ✅ |
| Remove drag-and-drop | ✅ | N/A | N/A | ✅ |
| Remove attachment icon | ✅ | ✅ | ✅ | ✅ |
| Remove "Generate question" | ✅ | N/A | N/A | ✅ |
| Gap numbering | ✅ | ✅ | ✅ | ✅ |
| Uncategorized at top | ✅ | N/A | N/A | ✅ |
| Card detail reorder | ✅ | ✅ | ✅ | ✅ |
| AI Classification badges | ✅ | N/A | ✅ (read-only) | ✅ |
| AI Reasoning panel | ✅ (full) | N/A | Read-only | ✅ |
| Fix unicode `·` | All files | All files | All files | All files |

---

## Verification checklist

**AppShell:**
- [ ] No "WAITING ON YOU" in any session header
- [ ] KG Explorer hidden from Offboarder sidebar + route blocked
- [ ] Bell notification dropdown: 320px, grouped, deep links, per-role events
- [ ] `view-matrix.ts` tab states match §1.4 matrix

**Session Creation:**
- [ ] 4 fields only (Email, Department, Last day, Trello link)
- [ ] Data source chips: Trello always active, others inactive until clicked, × to deactivate
- [ ] HRIS "Start session" pre-fills Create Session
- [ ] Employee with active session removed from departure list

**Data Tab:**
- [ ] Detects in orange, not gray or amber
- [ ] No drag handles, no "Move to", no attachment icons, no "Generate question"
- [ ] Uncategorized at top
- [ ] Gaps numbered GAP #1, #2 under module group header (module name shown once)
- [ ] AI classification: no Pass badge, Review/New Module/Uncategorized have badges + borders
- [ ] Filter tabs: All/Pass/Review/New Module/Uncategorized with counts
- [ ] AI Reasoning: multi-agent chat (M purple, G orange), labeled steps, 6 templates including 1:N
- [ ] Module tag clickable → opens reasoning panel to the left
- [ ] "Ask about this gap" functional for Manager + Coworker, removed for Offboarder
- [ ] Card detail reordered: Module › → Detects → Q&A → Classification → [Show details]
- [ ] Bulk: "Satisfy remaining" + "Dismiss all flags" per module, Manager only
- [ ] AI question delete shows confirmation dialog

**Manager:**
- [ ] Collecting: animation only, no orbital
- [ ] Departure Pending: orbital
- [ ] "Needs more" same flow as Coworker (note → send back → Hà Vy attribution)
- [ ] Deliver: commit always enabled, gaps as info not blockers

**Offboarder:**
- [ ] All Answered: celebration + full queue (no truncation) + auto-revert on new question with NEW badge
- [ ] Collecting: orbital + "Your session is being prepared"
- [ ] Edit answers during Capture, locked in Deliver
- [ ] Gap "See in context": yellow module panel, no "Ask about this" button
- [ ] Complete: 3-step timeline, no playbook
- [ ] Voice: entry card → session mode → live transcript → review → skip offered → Submit all → 🎙 badge

**Coworker:**
- [ ] "Needs more" + "Ask a question" (two separate actions)
- [ ] Collecting: orbital + "Data is being collected"
- [ ] "See in context" works + "Ask about this gap" functional
- [ ] Logs tab exists
- [ ] Complete: celebration with connected-nodes artwork

---

*End of consolidated instructions. Apply via Claude Code. Delete this file + all R2–R10 files after verified.*
