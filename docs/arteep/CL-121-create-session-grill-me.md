# CL-121 — Create Session Flow (`/session/new`) Grill-Me Decisions

| Field | Value |
|---|---|
| Date | 2026-06-11 |
| Sprint | POC build · Management plane (create session) |
| Change | 9 design decisions for the create session flow. Simplifies the existing `uc-ho-01-quick-initiate.jsx` by removing focus areas (moved to module flagging in Capture), removing successor field (CL-114), and removing manager assignment field (auto-derived from Entra ID org chart). Adds HRIS-driven offboarder picker and Trello board card picker with metadata. |
| UC Reference | UC-HO-01 (initiate handover session) · CL-120 (Data tab architecture — module flagging replaces focus areas) · CL-114 (no successor) · CL-111 (30-day window) |
| Why | The original quick-initiate form included focus areas that the creator (HR/Admin or Manager) cannot know before the data crawl runs. Removing them and simplifying to 3 fields + 1 CTA makes the flow honest and fast. |
| Decided By | PO (Tram) + BA (Claude) — grill-me format |
| Category | UX Refinement · Architectural Decision |

---

## Decisions Locked

### Session Creator

**1. Either Manager or HR/Admin can create sessions.** HR/Admin manages offboarding status and progress centrally. Manager has domain context. Both have access to `/session/new`.

### Offboarder Selection

**2. Pre-populated list from HRIS sync.** The system already knows upcoming departures from the HRIS integration (Step Zero). Creator picks from a dropdown/search of upcoming departures — no manual entry. Form pre-fills name, role, department, last day from HR data.

**3. Mock data: 2 offboarders.** One fresh (30 days notice), one mid-range (20–30 days). No 2-day urgent mock — that scenario is rare and not a design driver. The handover system is one downstream consumer of an HRIS status change, not the entire offboarding process.

### Flow Layout

**4. Single screen with inline picker.** No two-step flow. Page loads with an offboarder dropdown/search. Once someone is selected, the form fields appear below. With only 2–3 departures in the POC, a dedicated selection screen is overkill.

**5. Empty state before selection.** When the page loads with no one selected, only the offboarder picker is visible. The rest of the form is hidden — not grayed out, just absent. Pick a person, form appears.

### Form Fields (After Selection)

**6. Three fields only:**
- **Identity card** (read-only) — name, role, department, last day. Pre-filled from HRIS.
- **Review deadline** (editable) — date only (no time picker). Auto-calculated as last day minus 4 days. Creator can edit.
- **Board picker** — cards with metadata (board name + card count + last active date). 5 boards total from offboarder's Trello activity: 2–3 pre-selected (active, meaningful card counts), 2 testing boards unselected (small card counts, obvious skip). Max 3 selected for POC.

### Removed Fields

**7. Focus areas removed entirely.** The creator (especially HR) doesn't know the offboarder's technical scope before the data crawl. Focus areas are replaced by **module flagging in the Capture stage** — after the Manager sees AI-derived modules from the crawl results, they flag high-priority modules. This is the correct place for priority signaling.

**8. Manager assignment: no explicit field.** Auto-derived from Entra ID org chart. If org chart isn't configured, HR picks the Manager from the stakeholder list during Prepare. No field needed at session creation.

### Post-Creation

**9. Direct redirect to `/session/[id]`.** No confirmation screen. Session is created, crawl starts in the background, creator lands on the session detail page showing Prepare stage with seeding progress. The "Start session" button IS the confirmation.

---

## Supersession Notes

- **Focus areas** from the current `uc-ho-01-quick-initiate.jsx` are removed. The editable checklist ("Payment Gateway timeout", "Atlas rollback procedure", etc.) assumed the creator had domain knowledge they don't have at session creation time. Module flagging in Capture replaces this.
- **Successor field** was already removed by CL-114. Confirmed: still absent.
- **Manager field** never existed in the mockup but was considered. Decision: not needed — org chart handles it.
- **Data source toggle** in the current mockup showed a single Trello checkbox. Replaced by the richer board picker with 5 cards showing metadata.
- **Review deadline** simplified from date+time ("June 30, 2026 · 17:00") to date only ("June 30, 2026").

---

*End of CL-121. Companion document for the main change log.*
