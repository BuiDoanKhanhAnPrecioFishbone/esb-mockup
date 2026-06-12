# CL-126 — Queue Order, Flagging Removal, Offboarder Interaction Refinements

| Field | Value |
|---|---|
| Date | 2026-06-12 |
| Sprint | POC build · Dashboard |
| Change | Removed module flagging from POC scope. Simplified queue order to stakeholder-first then AI. Renamed "Answer next question" to "Open question queue." Added truncated answer preview to recently answered section. Clarified dashboard is triage-only, answering happens in session detail Side Panel. |
| UC Reference | CL-124 (offboarder dashboard) · CL-121 (removed focus areas) · CL-120 (Q&A model) |
| Why | Manager-absent scenario (HR creates session, stakeholders drive questions, Manager only shows up for final commit) makes flagging unnecessary. With 14 questions at POC scale, priority ordering is sufficient without flags. |
| Decided By | PO (Tram) + BA (Claude) — grill-me format |
| Category | UX Refinement · Scope Reduction |

---

## Decisions Locked

### Flagging Removed

**1. No module/card flagging in POC.** The module flagging planned for Capture stage (CL-121/CL-123) is removed. Reason: in the Manager-absent scenario (HR creates session, stakeholders ask questions, Manager only commits at the end), no one flags anything. The priority signal IS who asked — a real person's question always outranks a machine's question. Flagging can be Phase 2 if 100+ question deployments need it.

**2. No flag permissions model needed.** Since flagging is removed, the question of who can flag (Manager only? HR? Stakeholders?) is deferred entirely.

### Queue Order (Simplified)

**3. Two-level queue order:**
- **Stakeholder questions first** — real humans waiting for answers
- **AI-generated questions second** — system-generated, no one waiting
- Within each group: oldest first

No flags, no flag-aware tiers. The asker's identity IS the priority signal.

### Offboarder Dashboard Interaction

**4. Dashboard is triage-only.** Offboarder cannot answer questions on the dashboard. They must click into the session detail page where the Side Panel provides full context (card description, module, gaps, related Q&As). This follows the standard list → detail pattern (email inbox, Jira board, Slack channel list).

**5. Rename CTA: "Open question queue →" replaces "Answer next question →".** The old label implied inline answering. The new label communicates navigation to the session detail page.

**6. Recently answered section shows truncated answer preview.** Each answered question shows 1–2 lines of the offboarder's actual answer, with "See full answer →" linking to the session. This lets the offboarder verify what they said without making the dashboard heavy.

---

## Supersession Notes

- **Module flagging in Capture stage** (mentioned in CL-121 stress-test, CL-123 session card discussion) — removed from POC scope.
- **"Answer next question" CTA** from CL-124 — renamed to "Open question queue."
- **Queue order** from earlier discussion (Manager → Stakeholder → AI with flag tiers) — simplified to Stakeholder → AI, no flags.

---

*End of CL-126.*
