# CL-123 — Dashboard Refinements: Terminology, Metrics, Session Archive

| Field | Value |
|---|---|
| Date | 2026-06-11 |
| Sprint | POC build · Dashboard |
| Change | Dashboard content refinements from stress-testing: terminology ("session" not "handover"), session card metrics (stage-scoped key metrics instead of free-form task lines or checklists), completed session handling (archive to /sessions, not on dashboard), completion banner behavior (dismissible + 24h auto-dismiss), drop internal stats minicards (entries/canonical/gaps). New route /sessions for all-sessions registry. |
| UC Reference | CL-122 (dashboard interactions) · CL-121 (create session) |
| Why | Free-form task lines assume expert knowledge. Internal stats (entries/canonical) are meaningless to HR. Completed sessions accumulate as noise. These refinements make the dashboard focused and scannable for new users. |
| Decided By | PO (Tram) + BA (Claude) — grill-me format |
| Category | UX Refinement |

---

## Decisions Locked

### Terminology

**1. "Session" not "handover" in all user-facing copy.** Departure banner says "Start session." Card titles say "Minh Lê's session." Completion banner says "session is complete." Internal docs and CL entries can still use "handover" for clarity.

### Session Card Content

**2. Stage-scoped key metrics replace free-form task lines.** Each card shows 2–3 numbers that communicate stage health:
- Prepare: `3 boards · 127 cards · 4 modules | 0 questions added`
- Capture: `9 of 14 answered · 7 satisfied | 2 gaps open`
- Deliver: `Ready to commit · 14 answers | 0 gaps remaining`

Left column = progress. Right column = what's incomplete. No checklist, no step-by-step guidance, no "← your action" labels.

**3. Phase badge + "Waiting on you" badge are sufficient action signals.** The badge tells the Manager which stage. The "Waiting on you" badge tells them they're blocking. The metrics tell them health. No further guidance needed at the card level.

**4. No checklist pattern on dashboard cards.** Checklists imply sequential steps and teach process — that belongs in onboarding or help docs, not the daily dashboard. The dashboard reports status, not process.

### Completed Sessions

**5. Completed sessions do NOT accumulate on the dashboard.** Dashboard (`/`) shows only active sessions + departure banner.

**6. New `/sessions` route for all-sessions registry.** Shows all sessions with status filter (Active / Completed / All). Sidebar gets a "Sessions" entry. This is the archive and searchable registry.

**7. Completion banner: dismissible + 24h auto-dismiss.** When a session commits to KG, a banner appears: "Minh Lê's session is complete" + "View in sessions →" link. X button to dismiss. Auto-disappears after 24h. No internal stats (entries/canonical/gaps) — just confirmation + link.

**8. Drop stats minicards from completed cards.** "487 entries · 12 canonical · 9 gaps resolved" are internal system metrics meaningless to HR. If the Manager wants stats, they click into the session detail page or view it in `/sessions`.

### Activity Feed

**9. Activity feed scoped per dashboard state.** Active state shows: crawl completions, stakeholder joins, questions answered, prompts added. Completed state shows: KG committed, access ready. No mixing of future/past events.

### Route Architecture

**10. Dashboard + Sessions separation.**

| Route | Shows | Purpose |
|---|---|---|
| `/` Dashboard | Active sessions + departure banner + completion banner (temp) | What needs attention now |
| `/sessions` Sessions | All sessions, filterable by status | Registry + archive + history |

---

## Supersession Notes

- **Session card task lines** from the initial CL-122 sketch ("Crawl complete — needs your review", "5 questions unanswered", "2 knowledge gaps open") are replaced by stage-scoped key metrics.
- **Completed section** on the dashboard is removed. Completed sessions live at `/sessions`.
- **Stats minicards** (entries/canonical/gaps) are removed from the dashboard. Available inside session detail page.
- **"handover" in user-facing copy** replaced by "session" per CL-123 §1.

---

## Empty States Documented (not in POC mockup)

- **State A — System not configured:** Step Zero incomplete. Show: "Connect your HRIS and data sources first" → link to admin/setup.
- **State B — System ready, no departures:** HRIS connected but returns zero upcoming departures. Show: "No upcoming departures. Sessions will appear here when employees are flagged for offboarding."

POC mocks only **State C — System ready, departures pending.**

---

*End of CL-123. Companion document for the main change log.*
