# ART-EEP — Session 2025-06-25 Build Queue (Archive)

*Historical record of decisions made during the Jun 25 session.*
*All NOT BUILT items have been moved to `CL-session-2025-06-25-mockup-review.md` for implementation.*

---

## BUILT items (historical record)

### 1. Upload removal ✅
No upload/attach-file in POC. Q&A only. Phase 2 deferred.

### 2. Coworker network ✅
Auto-derived (violet) + manually added (yellow). Editable in Prepare, read-only in Capture.

### 3. Module rename ✅
Inline edit with violet border. Enter/Escape. `stopPropagation`.

### 4. Gap vs flag distinction ✅ (Claude Code)
Yellow AI gaps (module-level, sparkle) vs gray flags (card-level, dismissible).

### 5. 1:N card-to-module ✅ (Claude Code)
Primary + linked (dashed violet, ↗ chip) + uncategorized. ≥80% threshold. Drag handle + Move to.

### 6. AI categorization animation ✅ (Claude Code)
Cartoon explainer, 4 scenes auto-play, placeholder data. Plays once in Prepare.

### 7. KG Explorer chat redesign ✅ (Claude Code)
Left panel (history sidebar + chat). Graph primary. Node detail drawer right. Dynamic chips. No fixed AI chips.

### 8. Discussion items ✅
- 8.1a: Filter removed for POC
- 8.1b: Graph header padding (adjust when building)
- 8.1c: Gap → normal node on commit (blocked if unresolved)
- 8.2: AI questions editable + deletable (gap stays if questions deleted)
- 8.3: Offboarder hybrid queue (flat + "See in context")

---

## NOT BUILT items → moved

The following sections have been consolidated into `docs/arteep/CL-session-2025-06-25-mockup-review.md`:
- §9 Dashboard redesign → Part A1
- §10 Chat-to-graph node references → Part A2
- §11 Consistency audit → Part C
- All 16 review issues (GV-01 through CW-05) → Part B

---

## Pending from previous sessions

- [ ] CL entries to be logged for all decisions
- [ ] Context snapshot update (`ARTEEP-context-snapshot.md`)
- [ ] CL-121/122 patch merge into main design change log
- [ ] CL-107 labels-only style
- [ ] Manager-confirm gate between Prepare Step 2 and Step 3

---

*End of archive. For implementation instructions, see `CL-session-2025-06-25-mockup-review.md`.*
