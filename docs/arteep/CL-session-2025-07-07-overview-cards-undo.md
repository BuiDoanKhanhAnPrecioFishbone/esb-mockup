# ART-EEP — Overview, Card UI, Undo Audit (2025-07-07)

*Apply via Claude Code. Delete after verified.*

---

## §1 — Overview Page

### PH-01: Replace progress bar with 3-step stepper + unified CTA ✅ LOCKED (UPDATED)

**Files:** `components/mockups/session-command-view.jsx`, `components/mockups/session-deliver.jsx`

**Issue:** Continuous progress bars imply percentages we cannot calculate. Also, Deliver had a separate sticky bar for Commit — inconsistent with how Prepare and Capture place their forward actions.

**Fix:** Replace the progress bar with a **3-step stepper**. ALL forward actions live in the stepper — including Commit. Remove the sticky bar from the Deliver page.

**Stepper step states:**

| State | Circle | Connector (line to next) | Label |
|---|---|---|---|
| Completed | Filled green circle (20px) + white checkmark icon inside | Solid line (#059669) | Normal weight, gray text |
| Active | Filled violet circle (20px) + white dot inside | Dashed line (#c4b5fd) | Bold, violet text |
| Upcoming | Empty circle (20px), gray border | Dashed line (#e5e7eb) | Normal weight, light gray text |

**Phase CTA per phase:**

| Phase | Stepper shows | CTA button below stepper | Button style |
|---|---|---|---|
| **Prepare** | (●) Prepare ─── (○) Capture ─── (○) Deliver | Start Capture → | Outlined violet border, transparent bg |
| **Capture** | (✓) Prepare ─── (●) Capture ─── (○) Deliver | Start Deliver → | Outlined violet border, transparent bg |
| **Deliver** | (✓) Prepare ─── (✓) Capture ─── (●) Deliver | Commit to Knowledge Graph | **Gradient filled** (#6366f1 → #7c3aed), white text, Database icon |
| **Complete** | (✓) Prepare ─── (✓) Capture ─── (✓) Deliver | No button — all done | — |

**The Commit button uses gradient fill** to signal "this is irreversible" — same location as Start Capture/Deliver, but visually heavier. The outlined style = reversible phase transition. The gradient = final action.

**Remove the sticky bottom bar** from `session-deliver.jsx`. The "Back to Capture" button also moves — see UR-03.

**Backward actions** (Back to Prepare / Back to Capture) always live in the "..." header menu (SA-01). They never compete with the forward CTA.

---

### PH-02: Remove text summary from PhaseHero ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx` (PhaseHero component)

**Issue:** The text summary ("AI classified 64 cards into 5 modules. 2 cards need review.") duplicates the KPI dashboard metrics shown elsewhere on the Overview tab.

**Fix:** Remove the summary text paragraph. The PhaseHero now contains ONLY:
1. The 3-step stepper (PH-01)
2. The phase CTA button

Nothing else. The KPI cards below handle the numbers.

---

## §2 — Card & Data UI

### CD-01: Question attribution format ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**Issue:** Standalone names ("Linh Anh") are ambiguous — users don't know the person's role.

**Fix:** Every question must show attribution in this format:

```
Created by [Avatar] [Full Name]
```

| Element | Style |
|---|---|
| "Created by" | Text prefix, 10px, gray-500 |
| Avatar | 18px circle with initials, colored by role |
| Name | 10px, gray-700 |

**Avatar colors by role:**

| Role | Avatar bg | Avatar text |
|---|---|---|
| Manager (Hà Vy) | violet-100 | violet-700 |
| Coworker (Linh Anh) | teal-100 | teal-700 |
| AI-generated | gray-100 | gray-500, label "AI" instead of initials |

**Examples:**
- `Created by [HV] Hà Vy` (violet avatar)
- `Created by [LA] Linh Anh` (teal avatar)
- `Created by [AI] AI-generated` (gray avatar)

This replaces any existing "Added by" or standalone name attribution.

---

### CD-02: Define card row status icons + audit ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**Issue:** Three icons on card rows (✓, ○, —) are confusing and inconsistent with actual card data.

**Fix:** Define exactly what each icon means, then audit all mock data to ensure consistency.

**Icon definitions:**

| Icon | Color | Meaning | When shown |
|---|---|---|---|
| Lucide `CheckCircle2` | Emerald-500 | **All answered + accepted** | Every question on this card has been answered by the Offboarder AND accepted by the Manager/Coworker |
| Lucide `Circle` (filled dot) | Amber-500 | **In progress** | Card has questions, some are unanswered or answered but not yet accepted |
| Lucide `Circle` (empty) | Gray-300 | **No questions** | Card has zero questions — no Q&A activity on this card |

**Remove the dash (—) icon** — it's undefined and confusing. If a card has no questions, use the empty gray circle.

**Audit rules:**
- Count the questions on each card in the mock data
- Count how many are answered + accepted
- Set the icon accordingly
- If the card row shows `CheckCircle2` (green), the detail panel MUST show all Q accepted
- If the card row shows amber dot, the detail panel MUST show at least one Q not yet accepted
- If the card row shows empty gray circle, the detail panel MUST show zero questions

**Stage-specific behavior:**
- **Prepare:** All cards show empty gray circle (no questions yet — per WS-01)
- **Capture:** Mix of all three icons depending on Q&A progress

**Files to audit:** `session-command-view.jsx`, `session-thanh-tung.jsx`

---

## §3 — State Reversibility Audit

### UR-01: Accept → Revert path ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**Issue:** After clicking "Accept" on an answer, there's no way to change your mind.

**Fix:** After an answer is accepted, show a small **"Undo"** text link next to the "Accepted" badge:

```
[Answer text here...]
✔ Accepted              Undo
```

- "Undo" = 10px text link, gray-500, hover gray-700
- Click "Undo" → answer reverts to "Pending review" state (no confirmation needed — low risk, easily re-accepted)
- The "Accepted" badge disappears, answer returns to the Accept / Needs more button state

This also applies to answers accepted via **Bulk Accept remaining** — each individual answer still has the "Undo" link.

---

### UR-02: Dismiss detect → Restore path ✅ LOCKED

**File:** `components/mockups/session-command-view.jsx`

**Issue:** After dismissing a detect (⚡), there's no way to restore it.

**Fix:** Dismissed detects don't disappear — they gray out with a "Restore" link:

```
⚡ no description          [dismissed]  Restore
```

- Dismissed detect: text + badge dimmed (50% opacity), strikethrough on the text
- "Restore" = 10px text link
- Click "Restore" → detect becomes active again (full opacity, no strikethrough)

---

### UR-03: Backward navigation always in "..." header menu ✅ LOCKED (UPDATED)

**File:** `components/mockups/session-command-view.jsx`, `components/mockups/session-deliver.jsx`

**Issue:** "Back to Capture" was in a sticky bar on the Deliver page. With PH-01 moving Commit to the stepper, the sticky bar is removed. Backward actions need a consistent home.

**Fix:** ALL backward navigation lives in the "..." session header menu (SA-01):

| Phase | "..." menu contents |
|---|---|
| **Prepare** | Cancel session (rose) |
| **Capture** | Back to Prepare (gray) · Cancel session (rose) |
| **Deliver** | Back to Capture (gray) · Cancel session (rose) |
| **Complete** | No menu needed — session is done |

**Remove the sticky bar entirely** from `session-deliver.jsx`. The "Back to Capture" button moves from the sticky bar to the "..." header menu. The Commit button moves from the sticky bar to the stepper (PH-01).

---

### UR-04: Summary of all reversible actions ✅ LOCKED (UPDATED)

**Complete undo map:**

| Action | Undo mechanism | Type |
|---|---|---|
| Accept answer | "Undo" link next to badge → reverts to pending | Inline undo |
| Needs more | Offboarder re-answers | Natural flow |
| Bulk Accept remaining | Individual "Undo" per answer | Inline undo |
| Flag (DV test case) | Click again to unflag (toggle) | Toggle |
| Add question | Delete with confirmation dialog | Confirm |
| Delete question | ❌ Irreversible after confirmation | Intentional (confirm protects) |
| Add module chip | Remove via × | Inline |
| Remove module chip | Add back via "+ Add module" | Inline |
| Accept new module | Change via chip editing | Inline |
| Skip new module | Re-open panel, select manually | Inline |
| Dismiss detect | "Restore" link on dimmed detect | Inline undo |
| Edit gap/question | Cancel during edit | Cancel |
| Remove gap | ❌ Irreversible after confirmation | Intentional (confirm protects) |
| Edit answer (Offboarder) | Cancel during edit | Cancel |
| Start Capture | "Back to Prepare" in "..." header menu | Menu action |
| Start Deliver | "Back to Capture" in "..." header menu | Menu action |
| Cancel session | ❌ Irreversible | Intentional (confirm protects) |
| Commit to KG | ❌ Irreversible | Intentional (confirm protects) |

**Rule:** Actions marked ❌ are irreversible BY DESIGN — they all have confirmation dialogs. Every other action has an undo path. ALL backward navigation is in the "..." header menu. ALL forward actions are in the stepper.

---

## Verification checklist

**Overview:**
- [ ] Progress bar replaced with 3-step stepper (circles + connectors)
- [ ] Completed step: green filled circle + checkmark + solid line
- [ ] Active step: violet filled circle + dot + dashed violet line
- [ ] Upcoming step: empty gray circle + dashed gray line
- [ ] Prepare: "Start Capture →" (outlined) below stepper
- [ ] Capture: "Start Deliver →" (outlined) below stepper
- [ ] Deliver: "Commit to Knowledge Graph" (gradient filled, Database icon) below stepper
- [ ] Complete: no button — stepper shows all three steps as completed green
- [ ] Summary text removed from PhaseHero — stepper + button only
- [ ] Sticky bottom bar REMOVED from session-deliver.jsx
- [ ] "Back to Capture" moved from sticky bar to "..." header menu

**Card UI:**
- [ ] All questions show "Created by [Avatar] [Name]" — no standalone names
- [ ] Avatar colors: violet (Manager), teal (Coworker), gray (AI)
- [ ] Card row icons: CheckCircle2 (green) = all accepted, filled dot (amber) = in progress, empty circle (gray) = no questions
- [ ] Dash icon (—) removed entirely
- [ ] Icon matches actual Q&A data on every card row
- [ ] Prepare stage: all cards show empty gray circle (no questions)

**Undo:**
- [ ] "Undo" link on accepted answers → reverts to pending
- [ ] Bulk-accepted answers each have individual "Undo"
- [ ] Dismissed detects show dimmed + "Restore" link
- [ ] "Back to Prepare" in "..." menu during Capture
- [ ] "Back to Capture" in "..." menu during Deliver
- [ ] All irreversible actions have confirmation dialogs

---

*End of corrections. Apply via Claude Code. Delete after verified.*
