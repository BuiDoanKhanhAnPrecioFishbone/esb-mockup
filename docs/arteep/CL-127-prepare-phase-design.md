# CL-127 — Prepare Phase Design + Terminology Rename + 7 Gap Resolutions

| Field | Value |
|---|---|
| Date | 2026-06-12 |
| Sprint | POC build · Session detail page |
| Change | Full Prepare phase design for session detail page. Renamed "Stakeholder" to "Coworker" in all user-facing copy. Resolved 7 design gaps: Prepare→Capture transition, crawl failure states, offboarder tab visibility, notification timing, out-of-scope questions, module management in Capture, hero bar content. |
| UC Reference | CL-119 (3-view RBAC) · CL-120 (Data tab architecture) · CL-126 (queue order) |
| Why | The Prepare phase is the first thing users see after creating a session. If it's confusing or unclear, they drop the system. Every gap must be resolved before building. |
| Decided By | PO (Tram) + BA (Claude) — grill-me format |
| Category | Architectural Decision · UX Refinement · Terminology |

---

## Terminology: "Stakeholder" → "Coworker"

**All user-facing copy uses "coworker" instead of "stakeholder."** "Stakeholder" is business jargon. "Coworker" is immediately understood — someone who works with the offboarder and needs their knowledge.

- Dashboard tabs: Hà Vy (Manager) · Minh Lê (Offboarder) · Coworker A · Coworker B
- Session detail: coworker questions, coworker view
- Internal docs and CL entries may still say "stakeholder" for backward compatibility

---

## Prepare Phase — Overview

Prepare has 3 substages:
1. **Setup** — session created, crawl starts (2-3 seconds)
2. **Collecting** — crawl running (2-7 minutes)
3. **Ready** — crawl done, modules derived, questions generated, coworkers notified

### Overview Tab by Role

| Role | Substage 1-2 (Collecting) | Substage 3 (Ready) |
|---|---|---|
| **Manager/HR** | "Collecting data from 3 boards..." with spinner. Can leave — dashboard shows action card when done. | Summary card: boards processed, cards eligible, knowledge areas found, questions generated. Two CTAs: "Review in Data tab" (secondary) + "Start Capture" (primary). |
| **Offboarder** | "Your session is being prepared. You'll be notified when your question queue is ready." | Same waiting message — NOT notified until Manager clicks Start Capture. |
| **Coworker** | "Session is being set up. You'll be notified when you can browse and ask questions." | Can browse Data tab accordion + ask questions. "Minh Lê is leaving. Browse their knowledge areas and ask questions about what you'll need." |

### Data Tab by Role (during Prepare)

| Role | What they see | What they can do |
|---|---|---|
| **Manager/HR** | Full Board → Module → Card accordion. Side Panel on card click: description, checklist, gaps, questions, "Add a question" input. | Rename/merge/delete/create modules. Add questions at card, module, or general level. |
| **Offboarder** | "Questions are being collected. You'll be able to answer them once Capture starts." No accordion. | Nothing — wait for Capture. |
| **Coworker** | Full accordion (same as Manager). Side Panel on card click: description, checklist, gaps, questions, "Ask a question" input. | Ask questions at card or general level. CANNOT rename/merge/delete modules. |

### Key: Same Side Panel content for all roles

All roles see the same information in the Side Panel: description, checklist, knowledge gaps, existing questions. The only difference is write permissions (Manager can manage modules; Coworker can only ask questions; Offboarder can't act during Prepare).

---

## 7 Gap Resolutions

### Gap 1: How Prepare ends

**Manager clicks "Start Capture" manually. No auto-transition.**

- Manager/HR sees the button on the Overview tab after crawl completes
- No timer, no auto-trigger
- If Manager is absent, HR can click it (both roles have permission)
- Dashboard shows "Approaching deadline" warning if no action for 7+ days
- Coworkers can still add questions after Capture starts — no knowledge lost from waiting

### Gap 2: Crawl failure states

**Documented for Phase 2, not built in POC.**

- Partial failure: per-board status (✓ success / ⚠ no eligible cards / ✗ access denied)
- Full failure: "Data collection failed" + retry button
- No boards selected: prevented at session creation (Start session disabled if 0 boards)

### Gap 3: Offboarder tab visibility during Prepare

**All tabs visible, but Data shows waiting message.**

| Tab | Offboarder sees during Prepare |
|---|---|
| Overview | "Your session is being prepared. You'll be notified when ready." |
| Data | "Questions are being collected. You'll be able to answer once Capture starts." No accordion. |
| Logs | "No activity yet" (empty, not hidden — Offboarder CAN see Logs; it's Coworker who has Logs hidden per CL-119) |

### Gap 4: Notification timing

| Event | Manager/HR | Offboarder | Coworker |
|---|---|---|---|
| Session created | ✓ They did it | ✗ Not yet | ✗ Not yet |
| Crawl complete | Dashboard: "Needs your review" | ✗ Not yet | ✓ "Session ready — browse and ask questions" |
| Manager clicks Start Capture | Confirmation on page | ✓ "Your question queue is ready" | ✓ "Capture started — answers will arrive" |

Key: Coworkers notified at crawl complete (can start asking). Offboarder notified only at Capture start (when they can act).

### Gap 5: Out-of-scope questions

**"Ask a general question" input at top of Data tab, above the accordion.**

For questions that don't map to any card or module. Creates an entry in a "General" bucket. The Manager can later assign it to a module or leave it standalone. Appears in the offboarder's queue tagged as "General."

### Gap 6: Module management during Capture

| Action | During Prepare | During Capture |
|---|---|---|
| Rename module | ✓ | ✓ (cosmetic, non-disruptive) |
| Merge modules | ✓ | ✗ Locked |
| Delete module | ✓ | ✗ Locked |
| Create module | ✓ | ✗ Locked |

Merge/delete/create locked during Capture because the offboarder is actively working in the module structure. Renaming is always safe. Disabled buttons with tooltip: "Module structure is locked during Capture."

### Gap 7: Session hero bar

**Identity + phase badge + days left + deadline + stage-scoped counts. No action buttons.**

```
[Avatar]  Minh Lê's session                    [Prepare] badge
          Senior Backend Engineer · Engineering
          30 days left · Review deadline Jun 30
          3 coworkers · 14 questions · 3 gaps
```

Metrics adapt by phase:
- Prepare: coworkers · questions · gaps
- Capture: X of Y answered · Z satisfied · N gaps open
- Deliver: ready to commit · answers · gaps remaining

Action buttons ("Start Capture", "Commit to KG") live on the Overview tab, not the hero.

---

*End of CL-127. Companion document for the main change log.*
