# Sprint 1 — Compact Snapshot

*Date · 2026-06-02 · Single seed document for Sprint 1 (post-redesign)*

Sprint 1 covers **UC-HO-01 Initiate Handover Session** (canonical v2.0 spec + streamlined one-click flow) and **UC-HO-05 Configure Handover Interview Prompts** (v0.1 DRAFT, Claude-drafted, pending BA review). This document compacts everything needed to resume Sprint 1 work · the dev-centric UCs, the new 3-phase lifecycle model, the mockup inventory across the new architecture, the file map, open items, and the commit history.

This snapshot supersedes the earlier 8-stage / drawer-based version. Two big changes landed since then:
1. The 8-stage lifecycle compressed to **3 user-facing phases** (Prepare · Capture · Deliver).
2. The 480px side drawer replaced with a dedicated **session command view** at `/session/[id]`.
3. **Email is NEVER an automated data source** per the data-ingestion governance rule. Approved sources are Jira · GitHub · Google Drive (shared) · SharePoint · Trello · Microsoft Planner.

---

## 1. Sprint 1 Coverage at a Glance

| Use Case | Spec status | Mockups shipped | Screens |
|---|---|---|---|
| **UC-HO-01** · Initiate Handover Session | v2.0 canonical + dev-spec (3-phase) | dashboard · quick-initiate · command-view · normal-course (superseded) · alt-courses · exceptions | 2+2+3+4+4+5 = 20 |
| **UC-HO-05** · Configure Interview Prompts | v0.1 DRAFT (Claude-drafted) + dev-spec | configure-prompts-draft | 5 |
| **Total** | — | 7 mockups | **25 spec-traced screens** |

Live at the password-protected `esb-mockup` deployment under `/m/<slug>`. The index page auto-lists every registered mockup.

---

## 2. Lifecycle Model · 3 Phases (replacing 8 stages)

User-facing phases are 3. Internal sub-stages still exist (8 of them) for system tracking, but the UI only surfaces 3 phases at every glance-level view.

| Phase | # | Sub-stage | Actor | Notes |
|---|---|---|---|---|
| **1 · Prepare** | 1 | Setup confirmed | Manager | Triggered by `Start session` on quick-initiate |
| **1 · Prepare** | 2 | Context seeding | System | Background scan of Jira / GitHub / Drive |
| **1 · Prepare** | 3 | Knowledge map ready | System | Preliminary KM rendered, Offboarder notified |
| **2 · Capture** | 4 | Interview scheduled | Offboarder | UC-HO-02 unlock |
| **2 · Capture** | 5 | Voice interview | Offboarder | AI-guided dynamic questioning |
| **2 · Capture** | 6 | Transcript reviewed | Manager | UC-HO-03 unlock |
| **3 · Deliver** | 7 | Committed to KG | System | Atomic commit with rollback safety |
| **3 · Deliver** | 8 | Playbook delivered | Successor | UC-ON-01 unlock |

Dashboard cards show 3 phase segments. The command-view Stages tab shows 3 phase blocks with sub-stages nested inside each. Audit log keeps the full 8-sub-stage granularity.

---

## 3. Architecture · 3 routes

| Route | Purpose | Mockup |
|---|---|---|
| `/dashboard` | Manager command center · multi-session glance · 3-phase progress per session | `ha-vy-handover-dashboard` |
| `/session/[id]/setup` | One-click session initiation · HR-pre-filled defaults · customize expander | `uc-ho-01-quick-initiate` |
| `/session/[id]` | Per-session full-screen tabbed workspace (Overview · Stages · Data · Audit · Settings) | `session-command-view` |

Dashboard cards navigate to `/session/[id]` on click — no more side drawer.

---

## 4. UC-HO-01 · Initiate Handover Session

### 1. Meta Data

* **Feature Name:** Initiate Handover Session
* **Actor:** Manager (Hà Vy in the canonical demo)
* **User Story:** As a Manager, I want to start a handover session for a departing team member so that the AI can capture their tacit knowledge before they leave — with the minimum effort upfront.

### 2. Happy Path (Main Flow · streamlined one-click)

* **Step 1:** User opens the handover dashboard. System displays the "New from HR sync" notification card for the Offboarder with name, role, last working date, source preview chips (Jira · GitHub · Google Drive for Engineering · varies by department), and a `Start setup` CTA.
* **Step 2:** User clicks `Start setup`. System navigates to the quick-initiate page (`/session/[id]/setup`).
* **Step 3:** System displays the quick-initiate page with HR-pre-filled defaults · identity card, review deadline (+3 business days), data sources (all approved shared workspaces selected), estimated seeding time, and a `Customize before starting` collapsed expander. One primary `Start session` CTA.
* **Step 4:** User clicks `Start session`. System creates the session record, writes the audit anchor, and navigates to `/session/[id]` (command view). Session enters **Phase 1 · Prepare**.
* **Step 5:** System runs the seeding pipeline in the background · authorization → planner decomposition → source extraction (Jira / GitHub / Drive) → sensitivity classification gate → knowledge-gap inference → preliminary map build. Command view's Overview tab shows live sub-step progress.
* **Step 6:** System completes seeding, displays the Preliminary Knowledge Map within the command view's Data tab. Phase 1 sub-stage 3 reached. Manager notified.
* **Step 7:** System notifies the Offboarder, surfaces two Next Action cards on the command view · `Schedule the voice interview` (UC-HO-02, primary · transitions to **Phase 2 · Capture**) and `Add priority prompts` (UC-HO-05).

* **Outcome:** Session in `Offboarding In Progress` status · Phase 1 · Prepare. Preliminary Knowledge Map stored. Audit anchor written. UC-HO-02 and UC-HO-05 unlocked. Manager spent ~10 seconds on the initiation page.

### 3. Edge Cases & Error Handling (UI/UX States)

* **E1: Validation / Permission · Offboarder profile not provisioned.** Lookup returns no ART-EEP profile. System displays a blocking error card on the quick-initiate page (replacing the identity card) with `UserX` icon, mono error reference (`UC-HO-01.EX.2 · attempted-uid · not-found`), 3-step remediation list, and `Notify HR Admin` / `Back to dashboard` actions. No partial session record written.
* **E2: Validation / Permission · RBAC scope cannot resolve.** Directory lookup fails on `Start session` click. Quick-initiate page stays open, blocking error card overlay with `ShieldAlert` icon, mono trace, 3-step remediation, `Retry` / `Back to dashboard` actions.
* **E3: System / Network · One data source fails to seed.** Source extraction errors out after seeding starts (e.g., expired GitHub OAuth, Drive scope revoked). Command view's Overview tab marks source `Failed`, lets others complete, yellow banner on Knowledge Map, `Retry [source] after re-auth` and `Continue with partial seed` actions. Session still created.
* **E4: System / Network · Sensitivity classification service unavailable.** Gate cannot be reached. System pauses pipeline (NEVER falls back to unclassified content), marks gate sub-stage `paused`, auto-retry panel with 15-min interval / 4-hour window. Phase 1 cannot advance until the gate clears.
* **E5: User Branching · Manual initiation (no HR sync yet).** User enters from dashboard's `+ Create a manual handover session`. Quick-initiate page loads with empty identity fields, eyebrow changes to "Manual initiation · audit-flagged", info banner about HR Admin notification. Same one-click `Start session` once valid.
* **E6: User Branching · Manager wants to customize before starting.** User clicks `Customize before starting` expander. Inline expansion (no navigation) reveals editable review deadline, data-source checkboxes with one-line scope reminders (e.g. "GitHub · shared repos only · no personal forks"), focus note textarea, successor reassignment. Same one-click ship.
* **E7: User Branching · No integrated sources available.** Quick-initiate page finds no approved integrations connected. Data sources tile becomes dashed-border "No integrated shared workspaces found" placeholder with `Lock` icon, surfaces `Session flag · No Context — Generic Interview` pill, primary CTA changes to `Start session · no seeding`. UC-HO-02 falls back to role-based questions.
* **E8: User Branching · Last working date <3 business days away.** Quick-initiate page renders 2px rose left-border banner with `AlertOctagon` and `Urgent` pill. Auto-reduces Review Deadline to last-working-day minus 1, deadline tile gets rose border + `Auto-reduced` pill. Max override is last working day.
* **E9: User Branching · >30% sensitivity exclusion after seeding.** Command view's Overview tab renders yellow banner above Knowledge Map naming the percentage, offers TWO parallel actions · `Add priority prompts` (primary) and `Request override review` (secondary).
* **E10: User Branching · Manager pauses on quick-initiate page.** Page state retained, no draft written until `Start session` clicked. Return reloads same defaults; nothing lost, nothing committed.

---

## 5. UC-HO-05 · Configure Handover Interview Prompts (v0.1 DRAFT)

> **Status note · v0.1 DRAFT spec.** Claude-drafted from inference. Five open questions await BA review (see Section 8). Mockup carries persistent yellow draft banner.

The dev-centric spec lives at `docs/arteep/dev-specs/UC-HO-05.md` (verified clean — no email refs since UC-HO-05 is about prompts, not data sources). The mockup at `/m/uc-ho-05-configure-prompts-draft` covers the 5-screen Priority Prompts flow with the BR-01 3-prompt cap, CL-019 rejection pattern with named category, and the post-injection confirmation surface.

---

## 6. Mockup Inventory

Canonical scenario · **Hà Vy initiating a handover for Minh Lê** (Senior Backend Engineer · Engineering). EX.3 uses Khánh Linh Trần (People Ops, 2-day urgency). AC.1 / AC.3 use Phương Anh Nguyễn (Sales). EX.2 uses a fictional name for the profile-not-found case.

| Route | Mockup file | Chrome | Screens | Status |
|---|---|---|---|---|
| `/m/ha-vy-handover-dashboard` | `ha-vy-handover-dashboard.jsx` | Neutral · violet/emerald | 2 | **Active** · 3-phase progress |
| `/m/uc-ho-01-quick-initiate` | `uc-ho-01-quick-initiate.jsx` | Violet | 2 | **Active** · one-click flow |
| `/m/session-command-view` | `session-command-view.jsx` | Violet · tabbed | 3 | **Active** · per-session workspace |
| `/m/uc-ho-01-normal-course` | `uc-ho-01-normal-course.jsx` | Neutral · emerald | 4 | Superseded · kept for spec-trace |
| `/m/uc-ho-01-alternative-courses` | `uc-ho-01-alternative-courses.jsx` | Violet | 4 | AC.1–AC.4 · AC.2 repurposed |
| `/m/uc-ho-01-exceptions` | `uc-ho-01-exceptions.jsx` | Rose | 5 | EX.1–EX.5 |
| `/m/uc-ho-05-configure-prompts-draft` | `uc-ho-05-configure-prompts-draft.jsx` | Violet · yellow draft banner | 5 | v0.1 DRAFT |

---

## 7. Design System Touchpoints (Sprint 1, post-redesign)

* **CL-012 / CL-013** — "Sensitive content" not "PII"; never name vendor products in user copy
* **CL-014** — Critical-notice copy names the actual person
* **CL-015** — *(Deprecated · email is no longer a data source; rule replaced by general data-ingestion governance · "Automated collection restricted to shared workspaces only · personal directories and email never scanned · scope reminder inline at each source row")*
* **CL-016** — Knowledge gaps framed as warm guidance with yellow dot bullets
* **CL-017** — "Skipped" with strikethrough for cascade cases
* **CL-018** — Sentence-shaped composer placeholder
* **CL-019** — Policy-violation messages name the category first, then suggest action
* **CL-020** — Audit anchor referenced as ambient context
* **CL-022** — "AI asked" eyebrow convention for UC-HO-02 questions
* **CL-054 / CL-055** — Violet primary + pastel yellow secondary; primary CTAs `bg-violet-600` h-8
* **CL-056** — Blocked-state pattern · rose header, mono error ref, 3-step remediation
* **CL-057** — High-sensitivity-exclusion banner offers TWO parallel actions
* **CL-059** — Explicit focus rings · `focus:ring-2 focus:ring-violet-500/20`
* **CL-060** — AI-generated content on `bg-violet-50/40` with `Sparkles` icon
* **CL-062** — Yellow dot bullets for knowledge gaps
* **CL-063** — Multi-persona dashboard · 3 concurrent sessions visible
* **CL-065** — Critical urgency · 2px rose left-border + `Urgent` pill
* **CL-080+ (proposed)** — 3-phase lifecycle visualization · 3-segment bar with within-phase fill on current phase

---

## 8. Open Items

* **UC-HO-05 v0.1 DRAFT awaiting BA review** · 5 open questions in `docs/arteep/UC-HO-05_configure-interview-prompts_v0.1-draft.md`:
  1. Step ordering of normal course (Claude inferred 7 steps)
  2. EX.4 authority-change behavior — preserve or revoke confirmed prompts?
  3. BR-03 / TBD-2 — Offboarder pre-interview visibility of prompts (Claude defaulted to "not visible")
  4. AS.4 Section Blueprints deferral confirmation
  5. Confirm none of the 5 TBDs are already resolved decisions
* **Access Control Model BA review** · 6 open questions in `docs/arteep/access-control-model.md` covering scope assignment, clearance tier count, trust tier defaults, scope expiration, audit retention, cross-scope conflict resolution
* **CL-015 deprecation** · the original CL-015 (email-scanning constraint inline) is obsolete since email is no longer a source. The general data-ingestion governance pattern (shared workspaces only · inline scope reminder per source) replaces it. Confirmation needed on whether to renumber or just retire CL-015 in the change log.
* **Foundational doc updates** · `ARTEEP-context-snapshot.md`, `CLAUDE.md`, and `ARTEEP-design-change-log.md` may still reference email-as-source in their persona/architecture/CL-015 sections. Flagged for surgical review (see Section 11).

---

## 9. File Map

```
esb-mockup/
├── ARTEEP-context-snapshot.md                              # foundational · email refs flagged
├── CLAUDE.md                                                # foundational · persona refs flagged
├── Sprint-1-compact.md                                     # THIS DOCUMENT
├── docs/arteep/
│   ├── UC-HO-01_initiate-handover-session_v2.md            # v2 governance spec (may have email refs)
│   ├── UC-HO-02_conduct-ai-guided-voice-interview_v2.md
│   ├── UC-HO-05_configure-interview-prompts_v0.1-draft.md  # v0.1 DRAFT
│   ├── ARTEEP-master-uc-index.md
│   ├── ARTEEP-implementation-plan-v2.md
│   ├── ARTEEP-design-change-log.md                         # CL-015 lives here · needs deprecation
│   ├── QA-INT-01-Dual-Verification-Rule.md
│   ├── access-control-model.md                             # 6 BA questions open
│   └── dev-specs/
│       ├── UC-HO-01.md                                      # 3-phase lifecycle + email swept
│       └── UC-HO-05.md                                      # verified clean
├── components/mockups/
│   ├── ha-vy-handover-dashboard.jsx                         # ACTIVE · 3-phase
│   ├── uc-ho-01-quick-initiate.jsx                          # ACTIVE · one-click
│   ├── session-command-view.jsx                             # ACTIVE · tabbed full-screen
│   ├── uc-ho-01-normal-course.jsx                           # superseded · email→GitHub swept
│   ├── uc-ho-01-alternative-courses.jsx                     # AC.2 repurposed
│   ├── uc-ho-01-exceptions.jsx                              # email→GitHub swept
│   └── uc-ho-05-configure-prompts-draft.jsx                 # verified clean
└── lib/
    └── mockups-registry.ts                                  # 7 mockups registered
```

---

## 10. Commit Timeline (post-redesign session)

| Commit | What |
|---|---|
| `5e18d4f` | feat: uc-ho-01-quick-initiate · one-click initiation mockup |
| `3a959e3` | feat: session-command-view · full-screen tabbed replacement for the drawer |
| `8dce51e` | refactor: dashboard · drawer removed, cards navigate to /session/[id] |
| `1cfabe9` | docs: UC-HO-01 dev-spec · streamlined one-click happy path |
| `5d4df74` | feat: register quick-initiate + session-command-view |
| `42e9fc7` | refactor: dashboard · 8 stages → 3 phases · email refs removed |
| `7e57646` | refactor: command-view · 8 stages → 3 phases · email → GitHub |
| `a2d27c73` | refactor: quick-initiate · email source → GitHub |
| `e75eeec` | docs: UC-HO-01 dev-spec · 3-phase reference table + email sweep |
| `c0f02b1` | refactor: alt-courses · AC.2 repurposed (email-excluded → source-deselected, GitHub example) |
| `ec71362` | refactor: normal-course · email → GitHub across all 4 screens |
| `ce958458` | refactor: exceptions · email → GitHub in EX.1 / EX.4 pipelines |

(Earlier Sprint 1 commits — `f3e5684`, `fddbafc`, `8362d15`, `312e420`, `3d8a371`, `3d5e8a2`, `85a1d2d`, `3d10e40`, `1e7be86`, `c158f4e` — established the original normal/alt/ex/UC-HO-05 mockups and dev-specs.)

---

## 11. Resumption Notes

If you're picking up Sprint 1 from this snapshot:

1. **Read this file first**, then `ARTEEP-context-snapshot.md` for broader project context (note: still references email-metadata in Minh Lê's persona — pending surgical update), then `CLAUDE.md` for the mockup-build convention.
2. **The dev team works from `docs/arteep/dev-specs/`** — the simplified format. The detailed v2 specs are reference material for compliance / audit only.
3. **Lifecycle UI ALWAYS surfaces 3 phases**, never 8. The 8 sub-stages exist only in the system / audit log / Stages-tab drill-down.
4. **Approved data sources only.** Jira · GitHub · Google Drive (shared) · SharePoint · Trello · Microsoft Planner. Email NEVER as automated source. Personal files only via manual upload by the Offboarder.
5. **UC-HO-05 v0.1 DRAFT is Claude-drafted.** Do not treat any clause as canonical until BA review (5 open questions).
6. **Mockup pattern is settled.** Clickable Prev/Next flows with chrome-themed accents · neutral/emerald for active, violet for alt courses + new flows, rose for exceptions, yellow-draft for v0.1.
7. **When UC-HO-05 is reviewed** — replace the v0.1 DRAFT spec, drop the `-draft` suffix from the mockup slug + filename, remove the yellow draft banner, and update this snapshot.

*End of compact snapshot.*
