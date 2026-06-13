# CL-129 — Deliver Phase Design (10 Decisions)

| Field | Value |
|---|---|
| Date | 2026-06-13 |
| Sprint | POC build · Session detail page |
| Change | Full Deliver phase design. 10 decisions covering Manager review, commit flow, per-module readiness, success state, back-to-Capture escape, and all 3 role views. |
| UC Reference | CL-119 (RBAC) · CL-120 (Data tab) · CL-127 (Prepare) · CL-128 (Capture) |
| Why | Deliver is the final gate before knowledge reaches the KG. Must be simple (one commit button), transparent (per-module readiness), and reversible (back to Capture). |
| Decided By | PO (Tram) + BA (Claude) — grill-me format |
| Category | Architectural Decision · UX Design |

---

## Decision Summary

### Q1: Manager Overview during Deliver
**Readiness summary + "Commit to KG" CTA.** Not line-by-line review — Overview is the "am I ready to commit?" decision surface. Data tab is where the Manager does detailed review.

### Q2: Offboarder Overview during Deliver
**"Thank you, Minh" pattern.** Warm personal heading + contribution stats (answers submitted, files attached, gaps addressed) + "What happens next" 3-step timeline (Manager reviews → KG commit → knowledge available). Offboarder has nothing to do — just watch.

### Q3: Coworker Overview during Deliver
**"Session is being finalized."** Minimal view. Data tab is read-only (answers visible, satisfaction badges visible, no new actions). No Logs tab. Coworker's work is done.

### Q4: Manager Data tab during Deliver
**Read-only, same accordion.** No per-answer approval toggle. Manager browses answers in the Side Panel as a final confirmation pass. If something's wrong, uses "Back to Capture" on Overview (coarse-grained escape, not per-answer).

### Q5: Commit action
**Confirmation modal before commit.** Shows: what's being committed (9 answers, 3 files), what's excluded (5 unanswered), sanitization reassurance note, "This action is permanent." Two buttons: Cancel / Commit.

### Q6: Success state after commit
**Emerald banner + commit summary.** Session status changes to "Complete" (emerald badge on hero bar). Data tab becomes archive with emerald "Committed" badges. "View in Knowledge Graph →" and "Back to dashboard" links. Per-role variations:
- Manager: full commit summary
- Offboarder: "Your knowledge has been committed" + updated contribution stats
- Coworker: "Session complete. Knowledge is now in the Knowledge Graph."

### Q7: Back to Capture
**Available with confirmation modal.** "This will reopen the session for Minh Lê. They'll be notified that more input is needed." Prevents accidental regression. Reverts all roles to Capture behavior.

### Q8: Logs during Deliver
**Minimal new events.** Only phase transitions and the commit itself:
- "Hà Vy moved session to Deliver"
- "Hà Vy committed session to Knowledge Graph — 9 answers, 3 files" 
- "Hà Vy reopened Capture" (if Back to Capture used)
Same visibility: Manager + Offboarder see Logs, Coworker tab hidden.

### Q9: Per-module readiness table
**On Manager Overview.** Each module row shows: name, answered/total, gaps count, files count, ✅ Ready / ⚠ status. Manager scans this to decide if ready. Unanswered callout in yellow below table (informational, not blocking).

### Q10: No separate QA gate
**Single "Commit to KG" = Manager sign-off.** QA-INT-01 satisfied by: provenance on answers (§1.1), Manager reviews in Data tab (§1.3), Commit button is explicit sign-off (§1.4), Logs record everything (§2.3). Separate QA step adds friction with zero value when same person does both.

---

## Manager Overview Layout

```
Session readiness

[Progress bar: 9/14 answered]

4 metric cards: Answered (9) | Satisfied (7) | Gaps addressed (4/6) | Files (3)

Per-module readiness:
  Payment Service      4/4 ✓  2 gaps  1 file  ✅ Ready
  CI/CD Pipeline       3/3 ✓  1 gap   0 files ✅ Ready
  Shared Libraries     2/2 ✓  0 gaps  1 file  ✅ Ready
  Monitoring & Alerts  0/3    1 gap   1 file  ⚠ 3 unanswered
  Infrastructure       0/2    0 gaps  0 files ⚠ 2 unanswered

⚠ 5 questions unanswered — they will not be committed.

[Back to Capture]  [Commit to Knowledge Graph →]
```

## Commit Confirmation Modal

```
Commit to Knowledge Graph

You're about to commit:
· 9 answers across 5 knowledge areas
· 3 files
· 4 gaps resolved

5 unanswered questions will be excluded.

🛡 Pre-commit sanitization will run automatically.
  Sensitive content is redacted before anything reaches the graph.

This action is permanent.

[Cancel]  [Commit →]
```

## Post-Commit Success State

```
✓ Committed to Knowledge Graph  ·  Jun 13, 2026 at 3:42 PM

9 answers committed · 3 files ingested · 4 gaps resolved

Minh Lê's knowledge is now available in the Knowledge Graph.
Trần Hữu Nam can access it through Onboarding Playbooks.

[View in Knowledge Graph →]  [Back to dashboard]
```

---

*End of CL-129. Companion document for the main change log.*
