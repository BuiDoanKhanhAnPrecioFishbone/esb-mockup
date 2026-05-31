# Sprint 1 — Compact Snapshot

*Date · 2026-05-29 · Single seed document for Sprint 1*

Sprint 1 covers two use cases: **UC-HO-01 Initiate Handover Session** (canonical v2.0 spec) and **UC-HO-05 Configure Handover Interview Prompts** (v0.1 DRAFT, Claude-drafted, pending BA review). This document compacts everything needed to resume Sprint 1 work: the simplified dev-centric UCs, the mockup inventory, the file map, open items, and the commit history from the build session.

---

## 1. Sprint 1 Coverage at a Glance

| Use Case | Spec status | Mockups shipped | Screens |
|---|---|---|---|
| **UC-HO-01** · Initiate Handover Session | v2.0 canonical + simplified dev-spec | normal · alternative-courses · exceptions | 4 + 4 + 5 = 13 |
| **UC-HO-05** · Configure Interview Prompts | v0.1 DRAFT (Claude-drafted) + simplified dev-spec | configure-prompts-draft | 5 |
| **Total** | — | 4 mockups | **18 spec-traced screens** |

Live at the password-protected `esb-mockup` deployment under `/m/<slug>`. The index page auto-lists every registered mockup.

---

## 2. Documentation Format

As of this snapshot, Sprint 1 uses the **simplified dev-centric format** for use cases — three sections only: Meta Data, Happy Path (linear, no IF/ELSE), Edge Cases & Error Handling (each with an explicit UI/UX response). The v2 / v0.1 detailed governance specs (with Preconditions, Postconditions, Business Rules, System Rules, TBDs, Cross-References) remain at `docs/arteep/UC-HO-01_initiate-handover-session_v2.md` and `docs/arteep/UC-HO-05_configure-interview-prompts_v0.1-draft.md` for audit / compliance reference but are not the dev team's working document.

The dev-centric versions live at `docs/arteep/dev-specs/UC-HO-XX.md` and are reproduced in full below.

---

## 3. UC-HO-01 · Initiate Handover Session

### 1. Meta Data

* **Feature Name:** Initiate Handover Session
* **Actor:** Manager (Hà Vy in the canonical demo)
* **User Story:** As a Manager, I want to start a handover session for a departing team member so that the AI can capture their tacit knowledge before they leave.

### 2. Happy Path (Main Flow)

* **Step 1:** User opens the handover dashboard. System displays the "New from HR sync" notification card for the Offboarder with name, role, last working date, source preview chips (Jira, Drive, email), and an "Initiate handover session" CTA.
* **Step 2:** User clicks "Initiate handover session". System opens the Session Setup screen with three panels pre-filled from the HR record: Session Details, Review Deadline (default +3 business days), Data Sources (all integrated sources pre-selected).
* **Step 3:** User optionally adds a Focus Note in the free-text panel. System keeps the "Start session & begin context seeding" primary CTA active.
* **Step 4:** User clicks "Start session & begin context seeding". System creates the session record, writes the audit anchor, and navigates to the Context Seeding Progress screen.
* **Step 5:** System runs the seeding pipeline: authorization scope → planner decomposition → source extraction → sensitivity classification gate → knowledge-gap inference → preliminary map build. UI shows each stage with live status and timing.
* **Step 6:** System displays the Preliminary Knowledge Map: summary stats (items detected / excluded / in scope / gaps), top 3 projects by activity, list of likely knowledge gaps in yellow callouts, and a "What we excluded" privacy panel (counts only).
* **Step 7:** System notifies the Offboarder in-app, displays an emerald "Session ready" card, and surfaces two Next Action cards: "Schedule the voice interview" (UC-HO-02, primary) and "Add priority prompts" (UC-HO-05).
* **Outcome:** Session created in `Offboarding In Progress` status. Preliminary Knowledge Map stored in session workspace. Audit anchor written with classification counts and RBAC scope hash. UC-HO-02 and UC-HO-05 unlocked.

### 3. Edge Cases & Error Handling (UI/UX States)

* **E1: Validation / Permission · Offboarder profile not provisioned.** Initiation lookup returns no ART-EEP profile. System displays a blocking error card with `UserX` icon, mono error reference (`UC-HO-01.EX.2 · attempted-uid · not-found`), 3-step remediation list, and `Email HR Admin` / `Back to dashboard` actions. No partial session record is written.
* **E2: Validation / Permission · RBAC scope cannot resolve.** Directory lookup fails or returns corrupted authorizations. System displays a blocking error card with `ShieldAlert` icon, mono trace (`UC-HO-01.EX.5 · directory-trace · scope-resolve-failed`), 3-step remediation list, and `Retry` (primary — most causes are sync delays) / `Back to dashboard` actions.
* **E3: System / Network · One data source fails to seed.** Source extraction errors out (e.g., expired OAuth token). System marks that source `Failed` in the pipeline view, lets others complete, displays a yellow warning banner on the Knowledge Map, and offers `Retry [source] after re-auth` and `Continue with partial seed` actions side by side. Session is still created.
* **E4: System / Network · Sensitivity classification service unavailable.** Classification gate cannot be reached. System pauses the pipeline (does NOT fall back to unclassified content), marks the gate stage `paused` in yellow, and shows an auto-retry panel with last-attempt / next-retry / time-remaining counters (15-min interval, 4-hour window). After 4 hours, Platform Admin gets a high-priority alert.
* **E5: User Branching · Manual initiation (no HR sync yet).** User enters from the Offboarding module's `Create manual handover session`. System shows a manual-entry form (name, role, department, last working date) with an info banner: "This session will be flagged in the audit trail · `Manual Initiation`. HR Admin will be notified." Continue routes to the standard Session Setup screen pre-filled.
* **E6: User Branching · Manager deselects email source.** User unchecks email in step 3. System shows an inline yellow notice under the Data Sources panel: "Email data excluded — knowledge map coverage may be reduced for communication-heavy work." Flow continues unchanged.
* **E7: User Branching · No integrated sources available.** Step 3 finds no integrations connected. System renders a dashed-border "No integrated data sources found" placeholder with a `Lock` icon, surfaces a `Session flag · No Context — Generic Interview` pill, and changes the CTA to "Start session · no seeding". UC-HO-02 falls back to a role-based question bank.
* **E8: User Branching · Last working date is fewer than 3 business days away.** Step 3 detects an urgent timeline. System renders a 2px rose left-border banner with `AlertOctagon` icon and `Urgent` pill: "Critical · [Name]'s last working date is in [N] business days." Auto-reduces the Review Deadline to last-working-day minus 1; deadline field gets rose border + `Auto-reduced` pill. Max override is the last working day. Offboarder's notification carries an urgency flag.
* **E9: User Branching · >30% sensitivity exclusion after seeding.** Classification redacts more than 30% of one source's content. System renders a yellow banner above the Knowledge Map summary naming the percentage, and offers TWO parallel actions: `Add priority prompts` (primary) and `Request override review` (secondary).

---

## 4. UC-HO-05 · Configure Handover Interview Prompts

> **Status note · v0.1 DRAFT spec.** The dev-centric UC below was distilled from a Claude-drafted v0.1 spec (`docs/arteep/UC-HO-05_configure-interview-prompts_v0.1-draft.md`). Five open questions are listed at the bottom of that draft awaiting BA review. The mockup carries a persistent yellow draft banner.

### 1. Meta Data

* **Feature Name:** Configure Handover Interview Prompts (Priority Prompts)
* **Actor:** Manager (Hà Vy in the canonical demo)
* **User Story:** As a Manager, I want to add priority prompts to the AI-guided handover interview so that the system covers the specific topics most critical for the successor.

### 2. Happy Path (Main Flow)

* **Step 1:** User clicks "Add priority prompts" from the Knowledge Map next-action card. System opens the Priority Prompts surface with: an AI-suggested prompts panel (1–3 violet-tinted cards drafted from the Offboarder's Likely Knowledge Gaps, each with `Sparkles` icon and "AI suggested" eyebrow), an empty draft list, a free-text composer with sentence-shaped placeholder, and a draft counter showing "0 of 3".
* **Step 2:** User clicks "Use this prompt" on one AI suggestion. System copies the suggestion text into the composer, pre-filled and editable.
* **Step 3:** User refines the prompt text in the composer and clicks "Add to draft list". System runs the content-policy safety check (target <2s) and displays an emerald result card "Cleared to add · Pending review" with three pass-reasons bulleted.
* **Step 4:** User confirms by clicking "Add to draft list". System appends the prompt to the draft list at the next position, increments the counter to "1 of 3", and clears the composer.
* **Step 5:** User repeats steps 2–4 for two additional prompts. System renders the draft list with `GripVertical` reorder handles, per-prompt edit / remove icon buttons, and source provenance labels ("AI suggestion · [gap]" or "Manager-authored").
* **Step 6:** User clicks "Inject 3 prompts into interview queue". System validates count and safety status, writes prompts to the UC-HO-02 prompt queue with the `Manager Priority` flag, and extends the audit anchor with a `prompts.injected` event.
* **Step 7:** System displays the confirmation screen: emerald "3 priority prompts added" success card, a preview of how a prompt appears in UC-HO-02 (with "AI asked" eyebrow + yellow `Manager Priority` badge), and a 3-entry audit log preview.
* **Outcome:** 3 prompts in the UC-HO-02 prompt queue, each carrying the Manager Priority flag. Audit log extended. Live propagation within 30 seconds if UC-HO-02 is already running.

### 3. Edge Cases & Error Handling (UI/UX States)

* **E1: Validation / Permission · Content-policy rejects the prompt.** Safety check flags the text. System keeps the prompt in the composer (rose border, rose-50 fill) and renders a rose-toned rejection card with `ShieldAlert` icon that names the specific category (e.g., "Asks for personal opinions about colleagues") + a plain-language explanation + a violet `Lightbulb`-iconed "Try rephrasing around the work" panel showing a suggested rephrase as a quoted blockquote + "Read the full prompt policy" link. Footer actions: `Discard prompt`, `Rephrase`, `Use the suggested rephrase`. Rejected text is NOT persisted in full — only a hash + category code reach the audit log.
* **E2: Validation / Permission · Manager's RBAC scope changes mid-edit.** Authority over the session changes. System discards in-flight composer content, preserves any already-confirmed prompts in the queue, and redirects to the session dashboard with a non-blocking message: "Your authority over this session has changed. New edits were not saved. Existing prompts are unaffected."
* **E3: System / Network · Content-policy service unavailable.** Safety check service is unreachable. System does NOT add the prompt (no bypass). Composer shows a yellow inline notice: "Safety check is temporarily unavailable. Retrying in 15 seconds." Auto-retry runs for up to 2 minutes.
* **E4: System / Network · Live injection exceeds 30-second SLA.** During live injection, queue propagation exceeds 30 seconds. System still adds the prompt to the queue (no rollback) and shows a non-blocking toast: "Prompt added — it may not appear until the next AI question (longer than usual to propagate)." SLA breach logged.
* **E5: User Branching · User tries to add a 4th prompt.** Draft list is at the 3-prompt cap. System disables the "Add to draft list" CTA, replaces the "Add prompt" affordance with a dashed-border disabled state ("Add prompt · disabled · remove one to make room"), and shows a persistent yellow banner: "You've reached the 3-prompt limit for this session. Remove or merge an existing prompt to add a new one." with inline links to each current prompt.
* **E6: User Branching · User tries to edit or remove an already-spoken prompt.** UC-HO-02 has already surfaced the prompt to the Offboarder. System disables the edit and remove icon buttons on that prompt's draft card, shows a `Lock` icon in place, and a tooltip on hover: "This prompt has been spoken — it can no longer be edited or removed, only logged." The `Pending review` badge changes to `Spoken` (gray) with a timestamp.

---

## 5. Mockup Inventory

Single canonical scenario across all mockups · **Hà Vy initiating a handover for Minh Lê** (Senior Backend Engineer · Engineering). EX.3 uses Khánh Linh Trần (People Ops, 2-day urgency). AC.1 / AC.3 use Phương Anh Nguyễn (Sales). EX.2 uses a fictional name to demonstrate the "profile not found" case.

| Route | Mockup file | Chrome | Screens | Covers |
|---|---|---|---|---|
| `/m/uc-ho-01-normal-course` | `components/mockups/uc-ho-01-normal-course.jsx` | Neutral · emerald accent | 4 | UC-HO-01 happy path (steps 1–13) |
| `/m/uc-ho-01-alternative-courses` | `components/mockups/uc-ho-01-alternative-courses.jsx` | Violet | 4 | E5–E9 (alternative courses AC.1–AC.4) |
| `/m/uc-ho-01-exceptions` | `components/mockups/uc-ho-01-exceptions.jsx` | Rose | 5 | E1–E4 (exception states EX.1–EX.5) |
| `/m/uc-ho-05-configure-prompts-draft` | `components/mockups/uc-ho-05-configure-prompts-draft.jsx` | Violet · yellow draft banner | 5 | UC-HO-05 happy path + E1 inline |

All four follow the same pattern: clickable Prev/Next chrome with step dots in the top bar, scenario name in the subtitle, trigger-condition reminder in the footer. Each screen surfaces its UC clause reference (or step range) in the chrome so a viewer can audit spec trace at a glance.

---

## 6. Design System Touchpoints (Sprint 1)

Locked design decisions from `ARTEEP-design-change-log.md` exercised in Sprint 1:

* **CL-012 / CL-013** — "Sensitive content" not "PII"; never name "Microsoft Purview" in user copy
* **CL-014** — Critical-notice copy names the actual person ("Khánh Linh's last working date is in 2 days")
* **CL-015** — Email scanning constraint surfaced inline at the source row ("Subject lines and participants only · email content is never read or stored")
* **CL-016** — Knowledge gaps framed as warm guidance with yellow dot bullets, not deficiency
* **CL-017** — "Skipped" with strikethrough on dependent stages (not "Failed") for cascade cases
* **CL-018** — Sentence-shaped composer placeholder
* **CL-019** — Policy-violation messages name the category first, then suggest action
* **CL-020** — Audit anchor referenced as ambient context throughout
* **CL-022** — "AI asked" eyebrow convention for UC-HO-02 questions
* **CL-054 / CL-055** — Violet primary + pastel yellow secondary; primary CTAs `bg-violet-600` h-8
* **CL-056** — Blocked-state pattern · rose header, mono error ref, 3-step remediation, Retry / Back-to-Dashboard
* **CL-057** — High-sensitivity-exclusion banner offers TWO parallel actions (priority prompts + override review)
* **CL-059** — Explicit focus rings: `focus:ring-2 focus:ring-violet-500/20`
* **CL-060** — AI-generated content on `bg-violet-50/40` with `Sparkles` icon
* **CL-062** — Yellow dot bullets for knowledge gaps
* **CL-065** — Critical urgency · 2px rose left-border + `Urgent` pill

---

## 7. Open Items

* **UC-HO-05 v0.1 DRAFT awaiting BA review.** Five open questions at the bottom of `docs/arteep/UC-HO-05_configure-interview-prompts_v0.1-draft.md`:
  1. Step ordering of normal course (Claude inferred 7 steps)
  2. EX.4 authority-change behavior — preserve or revoke confirmed prompts?
  3. BR-03 / TBD-2 — Offboarder pre-interview visibility of prompts (Claude defaulted to "not visible")
  4. AS.4 Section Blueprints deferral confirmation
  5. Confirm none of the 5 TBDs are already resolved decisions
* **Sprint 1 closing.** With UC-HO-05 reviewed, Sprint 1's spec-strict surface is fully closed.
* **Knowledge Consumer realignment.** A separate strategic doc (CL-087+, UC-KC-04, Peer/Leader access, knowledge-hub mockup) drafted earlier this week remains uncommitted to the repo — separate work stream from Sprint 1.

---

## 8. File Map

```
esb-mockup/
├── ARTEEP-context-snapshot.md                            # broader project seed (separate)
├── Sprint-1-compact.md                                   # THIS DOCUMENT
├── docs/arteep/
│   ├── UC-HO-01_initiate-handover-session_v2.md          # v2 governance spec
│   ├── UC-HO-02_conduct-ai-guided-voice-interview_v2.md  # v2 governance spec
│   ├── UC-HO-05_configure-interview-prompts_v0.1-draft.md# v0.1 DRAFT (Claude)
│   ├── ARTEEP-master-uc-index.md
│   ├── ARTEEP-implementation-plan-v2.md
│   ├── ARTEEP-design-change-log.md
│   ├── QA-INT-01-Dual-Verification-Rule.md
│   └── dev-specs/
│       ├── UC-HO-01.md                                    # simplified dev-centric
│       └── UC-HO-05.md                                    # simplified dev-centric
├── components/mockups/
│   ├── uc-ho-01-normal-course.jsx
│   ├── uc-ho-01-alternative-courses.jsx
│   ├── uc-ho-01-exceptions.jsx
│   └── uc-ho-05-configure-prompts-draft.jsx
└── lib/
    └── mockups-registry.ts                                # auto-listed at index page
```

---

## 9. Commit Timeline (Sprint 1 build session)

| Commit | When | What |
|---|---|---|
| `f3e5684` | 2026-05-29 01:43 | feat: UC-HO-01 alternative-courses mockup (AC.1–AC.4) |
| `fddbafc` | 2026-05-29 01:43 | feat: register UC-HO-01 alternative-courses in registry |
| `8362d15` | 2026-05-29 02:09 | feat: UC-HO-01 exceptions mockup (EX.1–EX.5) |
| `312e420` | 2026-05-29 02:10 | feat: register UC-HO-01 exceptions in registry |
| `3d8a371` | 2026-05-29 02:53 | feat: UC-HO-01 normal-course mockup (4 happy-path screens) |
| `3d5e8a2` | 2026-05-29 02:54 | feat: register normal-course; group S1 trio in registry order |
| `85a1d2d` | 2026-05-29 06:31 | feat: UC-HO-05 v0.1 DRAFT spec (Claude-drafted) |
| `3d10e40` | 2026-05-29 06:33 | feat: UC-HO-05 v0.1 DRAFT mockup (5 screens) |
| `1e7be86` | 2026-05-29 06:34 | feat: register UC-HO-05 DRAFT mockup |
| `c158f4e` | 2026-05-29 (later) | feat: dev-centric simplified UCs for UC-HO-01 and UC-HO-05 |

---

## 10. Resumption Notes

If you're picking up Sprint 1 from this snapshot:

1. **Read this file first**, then `ARTEEP-context-snapshot.md` for the broader project context, then `CLAUDE.md` at the repo root for the mockup-build convention.
2. **The dev team works from `docs/arteep/dev-specs/`** — the simplified format. The detailed v2 specs are reference material for compliance / audit only.
3. **UC-HO-05 v0.1 DRAFT is Claude-drafted.** Do not treat any clause as canonical until Tram has reviewed and stamped it. Five open questions are listed at the bottom of the draft spec.
4. **Mockup pattern is settled.** Four-screen / five-screen clickable Prev/Next flows with chrome-themed accents (neutral / violet / rose / yellow-draft) for normal / alternative / exception / draft kinds. New mockups should reuse the primitives already in the existing files.
5. **When UC-HO-05 is reviewed** — replace the v0.1 DRAFT spec, drop the `-draft` suffix from the mockup slug + filename, remove the yellow draft banner from the mockup chrome, and update this snapshot.

*End of compact snapshot.*
