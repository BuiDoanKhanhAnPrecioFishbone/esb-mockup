# ART-EEP — Deliver Page Fixes (2025-07-04)

*Focused fixes for `session-deliver.jsx` based on code audit.*
*Apply via Claude Code. Delete after verified.*

---

## DP-01: Remove "Files" metric from Offboarder Deliver

**File:** `components/mockups/session-deliver.jsx` — Offboarder Deliver block

**Issue:** Offboarder Deliver view shows `<MC l="Files" v={1}/>` but upload is removed from the POC.

**Fix:** Remove the "Files" metric card. Keep only:
- Answered: `{S.answered}`
- Gaps addressed: `{S.gapsAddressed}`

2 stat cards, not 3.

---

## DP-02: Fix Manager Complete metrics

**File:** `components/mockups/session-deliver.jsx` — Manager Complete block (`CompleteOverview`)

**Issue:** Manager Complete shows 4 metrics including "Files" and "Excluded" — stale from before upload removal.

**Fix:** Replace with 3 metrics matching the Deliver summary:
- Entries committed: 42
- Questions answered: `{S.answered}`
- Modules covered: `{S.modules}`

3 stat cards, not 4. Remove "Files" and "Excluded."

---

## DP-03: Align gap seed data with DT-03 module names

**File:** `components/mockups/session-deliver.jsx` — `resolvedSeed` and `unresolvedSeed` arrays

**Issue:** Gap seed data references modules that don't exist in the Data tab ("Inventory Sync", "Infrastructure as Code"). The Deliver page's mock data is disconnected from `session-command-view.jsx`.

**Fix:** Update seed data to use actual module names from the Data tab. Per DT-03:

**Unresolved gaps (match demo script):**

| Module | Gap | Status |
|---|---|---|
| Payment Service | No disaster recovery or failover procedures documented | 1 question waiting |
| Payment Service | No error escalation process defined | 0 questions |
| Monitoring & Alert | No alert routing documented | 1 question waiting |

**Resolved gaps (believable, using real module names):**

| Module | Gap | How resolved |
|---|---|---|
| Payment Service | Missing SLA definitions | answered by Minh Lê |
| CI/CD Pipeline | Atlas migration rollback procedure missing | answered by Minh Lê |
| Shared Libraries | API key rotation runbook location unknown | answered by Minh Lê |
| Monitoring & Alert | No incident response runbook | dismissed by Hà Vy |

Ensure module names match exactly what appears in the Data tab (`session-command-view.jsx` MODULES_DATA).

---

## DP-04: Add violet gradient to "Ready to commit" header

**File:** `components/mockups/session-deliver.jsx` — Manager Deliver heading

**Issue:** "Ready to commit" heading is plain text. Should match the dashboard greeting banner style.

**Fix:** Wrap in a gradient container:
```jsx
<div className="rounded-xl p-5" style={{ background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)' }}>
  <h2 className="text-xl font-semibold text-violet-900">
    <Sparkles className="w-4 h-4 inline mr-1.5 text-violet-500" />
    Ready to commit
  </h2>
  <p className="text-[12px] text-violet-600 mt-1">
    Review Minh Lê's knowledge before committing to the Knowledge Graph.
  </p>
</div>
```

---

## DP-05: Add Data Validation summary line to CommitModal

**File:** `components/mockups/session-deliver.jsx` — `CommitModal`

**Issue:** CommitModal doesn't mention the Data Validation results.

**Fix:** Add a new info card inside CommitModal (after the sanitization note, before the buttons):

```
Data validation: 5/8 test cases passed (1 flagged)
```

Use the same info card style (violet-50 background, violet-200 border, sparkle icon).

This is a static line for now — the actual Data Validation feature (DV-01 through DV-08 in `CL-session-2025-07-04-data-validation.md`) will make it dynamic.

---

## DP-06: Data Validation section — reference only

The full Data Validation feature spec is in `docs/arteep/CL-session-2025-07-04-data-validation.md`.

It adds the following BETWEEN the knowledge summary and the resolved gaps:
- Summary bar (green/amber/rose segments + counts)
- Persona filter tabs (All/Newcomer/Manager/Coworker)
- Two-column accordion layout (test cases left, source data right)
- Flag button (🚩) on each test case
- "Re-run test cases" button

**Apply the DV file AFTER DP-01 through DP-05 are done.** The DV section slots into the existing Deliver layout between stat cards and resolved gaps.

---

## Verification checklist

- [ ] Offboarder Deliver: no "Files" metric — only Answered + Gaps addressed
- [ ] Manager Complete: 3 metrics (Entries/Answered/Modules) — no Files or Excluded
- [ ] Resolved gap names use real module names from Data tab
- [ ] Unresolved gaps: Payment Service (2) + Monitoring & Alert (1) = 3 total
- [ ] "Ready to commit" has violet gradient background + sparkle icon
- [ ] CommitModal includes "Data validation: 5/8 passed" info card
- [ ] After DV file applied: Data Validation section visible between summary and gaps

---

*End of Deliver page fixes. Apply via Claude Code. Delete after verified.*
