# ART-EEP — Quick Fix: Duplicate Attribution (2025-07-07)

*Apply via Claude Code. Delete after verified.*

---

## QF-01: Remove duplicate "Created by" line on questions ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**Issue:** Questions show two "Created by" attribution lines stacked:
```
Which webhook events are critical vs optional?
Created by [C] Coworker            ← line 1 (no timestamp)
Created by [C] Coworker · 2 days ago  ← line 2 (with timestamp)
```

This is a duplicate. Only ONE attribution line should appear.

**Fix:** Keep only the line WITH the timestamp. Remove the line without:
```
Which webhook events are critical vs optional?
Created by [C] Coworker · 2 days ago    ← single line
```

Search all question rendering locations (card detail Q&A, gap context questions, general questions) for duplicate `Created by` renders and ensure only one attribution line per question.

---

## Verification checklist

- [ ] Each question shows exactly ONE "Created by [Avatar] [Name] · [timestamp]" line
- [ ] No duplicate attribution on any question in any panel
- [ ] Check card detail, gap context, and general question sections

---

*End of fix. Apply via Claude Code. Delete after verified.*
