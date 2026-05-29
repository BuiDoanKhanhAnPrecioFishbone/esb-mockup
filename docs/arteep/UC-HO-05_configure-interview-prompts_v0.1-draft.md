# UC-HO-05 · Configure Handover Interview Prompts

> **Status · v0.1 DRAFT · Claude-drafted from inference (2026-05-29).**
> This draft was synthesized from the master UC index metadata, design-log entries CL-018 / CL-019 / CL-060, and cross-references in UC-HO-01 v2.0 and UC-HO-02 v2.0. It has **not** been authored or reviewed by the BA. Do not treat any clause below as canonical until Tram has reviewed and stamped it. Sections with `[INFERRED]` are Claude's best guess at a defensible default; sections with `[GROUNDED]` derive from existing committed documents.

| Field | Value |
|---|---|
| **UC ID** | UC-HO-05 |
| **Title** | Configure Handover Interview Prompts |
| **Version** | v0.1 DRAFT |
| **Date** | 2026-05-29 |
| **Owner** | Tram (BA / Product Designer) |
| **Sprint** | S1 |
| **Priority** | Medium |
| **Scope (v0.1)** | Priority Prompts only. Section Blueprints (the dynamic N-section primitive from Plan v2) is referenced but deferred to a separate v2 spec — see TBD-3. |

---

## Description

`[GROUNDED]` The Manager configures **Priority Prompts** to steer the AI-guided voice interview (UC-HO-02) toward specific topics the system might otherwise miss or under-cover. Prompts can be added **pre-interview** (from the Preliminary Knowledge Map review) or **injected live** during the interview (≤30 seconds queue-update latency). The system suggests starter prompts derived from the Likely Knowledge Gaps detected during UC-HO-01 seeding; the Manager edits, adds, or removes prompts; each prompt passes a content-policy safety check before entering the interview queue.

`[INFERRED]` v0.1 caps Priority Prompts at **3 per session** to keep the AI question budget bounded and prevent the interview from feeling over-scripted. Section Blueprints — which let the Manager shape the interview's overall structure rather than insert individual prompts — are a separate, larger surface deferred to v2.

---

## Actors

`[GROUNDED]`

- **Primary** · Manager (same persona as UC-HO-01 — Hà Vy in the canonical demo).
- **Secondary** · Semantic Kernel Orchestrator (routes prompts into the UC-HO-02 queue, runs the safety check), Content-Policy Service `[TBD-1]`, System audit logger.

---

## Preconditions

`[GROUNDED unless marked]`

- **PC.1** A handover session exists in `Offboarding In Progress` status (created via UC-HO-01).
- **PC.2** The Manager's authority over the Offboarder is verified against the directory service — same RBAC scope as UC-HO-01. If the scope ever invalidates mid-edit, see EX.4.
- **PC.3** Either: (a) the session has a Preliminary Knowledge Map (UC-HO-01 step 10 complete) for the pre-interview pathway, OR (b) UC-HO-02 is currently live for the live-injection pathway (AS.2).
- **PC.4** `[INFERRED]` The content-policy ruleset for safety checking is loaded and reachable. If unavailable, see EX.5.

---

## Trigger

`[GROUNDED]` The Manager enters the Priority Prompts surface from one of three places:

1. **"Add priority prompts" next-action card** at the bottom of the Preliminary Knowledge Map view (UC-HO-01 step 13).
2. **"+ Add live prompt" action** in the UC-HO-02 live interview transcript view (AS.2 pathway).
3. **Direct navigation** from the session dashboard's "Configure" menu `[INFERRED]`.

---

## Normal Course

`[INFERRED for step ordering; GROUNDED for individual touchpoints noted]`

1. Manager opens the Priority Prompts surface. System displays:
   - Existing prompts list (0–3 prompts, empty on first entry).
   - **AI-suggested starter prompts** panel (1–3 suggestions, one per documented Likely Knowledge Gap). `[GROUNDED CL-060]` Rendered on `bg-violet-50/40` with a Sparkles icon and the eyebrow "AI suggested."
   - Composer with sentence-shaped placeholder. `[GROUNDED CL-018]` Example: *"Add a focus area — for example, 'Probe deeply on the renewal negotiation with Vendor XYZ.'"*
   - Audit summary footer: `Last edit · [actor] · [timestamp]` (empty on first entry).

2. System pre-populates each AI-suggested prompt with:
   - The gap title it traces back to (e.g., "Payment Gateway timeout").
   - A draft sentence-shaped prompt (e.g., *"Walk through the symptoms you look for and the fix you've used to resolve Payment Gateway timeout incidents."*).
   - A **"Use this prompt"** action that copies the suggestion into the editable composer.
   - A **"Dismiss"** action that hides the suggestion (logged for the session, does not affect future sessions).

3. Manager evaluates each AI suggestion and chooses one of:
   - **Use as-is** — clicks "Use this prompt"; the prompt enters the composer pre-filled.
   - **Edit** — modifies the suggestion in the composer before adding.
   - **Write from scratch** — types a custom prompt in the composer.
   - **Skip suggestions entirely** — proceeds with no AI input.

4. When the Manager clicks **"Add to draft list"**, the system runs the **content-policy safety check** on the prompt text (target latency ≤2s; SLA ≤5s).
   - **If the check passes** · prompt is added to the draft list with status `Pending review`.
   - **If the check fails** · see EX.1.

5. Manager reviews the draft list (max 3 prompts — BR-01). For each prompt the Manager may:
   - **Reorder** by drag, changing the interview-queue insertion position.
   - **Edit** (any edit re-runs the safety check on save).
   - **Remove** (soft-delete; the removal event is logged but the prompt content is retained for audit).

6. Manager clicks **"Inject prompts into interview queue"**. System:
   - Validates: count ≤3, every prompt has passed the safety check, session is still in `Offboarding In Progress`.
   - Writes prompts to the UC-HO-02 prompt queue with the `Manager Priority` flag.
   - Updates the audit anchor with a `prompts.injected` event including each prompt's text hash, position, and safety-check result.
   - If UC-HO-02 is live, the queue update propagates within 30 seconds (SR — see below). Otherwise the prompts are stored and surface when UC-HO-02 starts.

7. System displays the confirmation surface:
   - Headline: *"[N] priority prompts added to [Offboarder Name]'s interview queue. They'll appear with a Manager Priority badge during the interview."*
   - **"View prompt queue"** link → returns to UC-HO-02 view (live interview if in progress; otherwise the session dashboard's queue preview).
   - **"Add another prompt"** if `N < 3`.
   - **"Done"** → returns to the session dashboard.

---

## Alternative Courses

`[Mix of GROUNDED and INFERRED]`

- **AS.1 — Template browsing from prior sessions.** `[GROUNDED — named in master UC index]` Microsoft Graph Connectors context seeding informs which prompt templates from previous handovers are relevant for this Offboarder's department + role. The Manager can browse a panel of templates and clone any into the composer. All template clones still pass the safety check.

- **AS.2 — Live prompt injection during UC-HO-02.** `[GROUNDED — implied by ≤30s SR]` Manager opens the Priority Prompts panel from the live interview view. The same normal-course flow applies, but on confirmation the prompt enters the running interview queue with strict ≤30s propagation. If the AI is mid-question, the new prompt queues for the next turn.

- **AS.3 — Edit or remove an existing prompt.** `[INFERRED]` Manager opens an existing prompt from the draft list. Edits re-run the safety check on save. Removes are soft-deletes preserved in the audit trail. **Constraint (BR-04):** once UC-HO-02 has surfaced a prompt to the Offboarder (the AI has spoken it as a question), the prompt cannot be edited or removed — only logged. The audit trail shows when this lock engaged.

- **AS.4 — Section Blueprints.** `[DEFERRED — see TBD-3]` Manager configures a custom interview-section structure that overrides the dynamic N-section default behavior in UC-HO-02 v2.0. Out of scope for v0.1; documented here only so the eventual spec author can find the cross-reference.

---

## Exceptions

`[Mix; EX.1 is GROUNDED, others are INFERRED]`

- **EX.1 — Content-policy safety check rejects the prompt.** `[GROUNDED — master UC index + CL-019]`
  - **Trigger:** the prompt text violates the content-policy ruleset (TBD-1). Common categories `[INFERRED]`: requests for personal opinions about colleagues, content targeting protected characteristics, requests for confidential information outside the Offboarder's documented scope.
  - **System response:** prompt is **not** added to the draft list. The composer displays a rejection message **naming the specific category** that triggered it (CL-019 — *"asks for personal opinions about colleagues"*, not just "policy violation"). A constructive suggestion follows (*"Try rephrasing around the work itself."*). A "Read the prompt policy" link sits next to the message.
  - **Final state:** Manager either rephrases (which re-runs the safety check) or abandons the prompt. The rejection event is logged for monitoring with the rejected text hash and category; the text itself is **not** retained in the audit trail to avoid storing policy-violating content.

- **EX.2 — Maximum prompt count exceeded.** `[INFERRED]`
  - **Trigger:** Manager tries to add a 4th prompt (BR-01 cap of 3).
  - **System response:** the "Add to draft list" CTA is disabled. A persistent bar above the composer reads *"You've reached the 3-prompt limit for this session. Remove or merge an existing prompt to add a new one."* with inline links to each current prompt for quick removal.
  - **Final state:** blocked until the Manager removes a prompt.

- **EX.3 — Live injection beyond the 30-second SLA.** `[INFERRED]`
  - **Trigger:** during AS.2 live injection, the queue-update propagation exceeds 30 seconds (e.g., Orchestrator backlog, transient infrastructure latency).
  - **System response:** the prompt **is still added** to the queue (no rollback). Manager sees a non-blocking notice: *"Prompt added — it may not appear until the next AI question (longer than usual to propagate)."* The SLA breach is logged for monitoring.
  - **Final state:** prompt enters the queue; the Manager is informed; no manual retry needed.

- **EX.4 — Authority scope changed mid-edit.** `[INFERRED — parallel to UC-HO-01 EX.5]`
  - **Trigger:** the Manager's RBAC scope for this session changes (reassignment, role change, directory sync error) while they are on the Priority Prompts surface.
  - **System response:** in-flight composer content is discarded. Existing confirmed prompts remain in the queue (the original Manager's authority at the time of confirmation is what matters for those). The current Manager is redirected to the session dashboard with the message *"Your authority over this session has changed. New edits were not saved. Existing prompts are unaffected."*
  - **Final state:** Manager loses the unconfirmed work but the session integrity is preserved.

- **EX.5 — Content-policy service unavailable.** `[INFERRED — parallel to UC-HO-01 EX.4]`
  - **Trigger:** the content-policy service is unreachable when the Manager clicks "Add to draft list."
  - **System response:** the prompt is **not** added (no bypass — same architectural commitment as the Purview gate in UC-HO-01). The composer shows *"Safety check is temporarily unavailable. We'll retry automatically in 15 seconds — or you can try again now."* Auto-retry runs for up to 2 minutes; if still unavailable, the Manager is asked to come back later or escalate to Platform Admin.
  - **Final state:** Manager retries when the service returns; no prompts enter the queue without classification.

---

## Postconditions

`[INFERRED]`

- Session prompt queue updated; UC-HO-02 sees new prompts within 30 seconds of submission.
- Audit anchor extended with `prompts.injected` event(s).
- If the interview hasn't started, prompts appear with the Manager Priority badge when UC-HO-02 surfaces them.
- If the interview is live, prompts insert at the queue tail and surface at the next AI turn.
- The Knowledge Map's "Next actions" panel updates to show the prompts as configured.

---

## Business Rules

`[Mix; BR-01/02 INFERRED with grounding; BR-04 GROUNDED in interview-archive principle]`

- **BR-01** Maximum 3 priority prompts per session. Hard cap (TBD-4 confirms whether soft or hard; v0.1 default is hard).
- **BR-02** Every prompt must pass the content-policy safety check before entering the queue. No exceptions, no bypass for Manager-authored content.
- **BR-03** The Manager Priority badge is visible to the Offboarder when the AI surfaces the prompt as a question. Whether the badge surfaces *pre-interview* (i.e., the Offboarder can see what prompts exist before the interview starts) is `[TBD-2]`. v0.1 default: not visible pre-interview.
- **BR-04** Prompts are **immutable once spoken**. The moment UC-HO-02 has surfaced a prompt to the Offboarder, the prompt cannot be edited or removed — only the spoken event and any subsequent transcript edits are tracked. This preserves the integrity of the audit trail for what the Offboarder actually responded to.
- **BR-05** AI-suggested prompts are **not autosaved** to the draft list. The Manager must explicitly click "Use this prompt" to adopt a suggestion.

---

## System Rules

### Performance
- **SR.P.1** `[GROUNDED]` Live prompt injection ≤30 seconds from confirm to queue update.
- **SR.P.2** `[INFERRED]` AI suggestion generation ≤5 seconds for the 1–3 suggestions shown on entry.
- **SR.P.3** `[INFERRED]` Safety check ≤2 seconds per prompt (SLA ≤5 seconds).

### Security
- **SR.S.1** `[INFERRED]` All prompt content (Manager-authored and AI-suggested) passes through Microsoft Purview classification before being persisted, like any other ingested content. The classification result is recorded; classification *exclusions* do not apply (the Manager is explicitly choosing to surface this content as a question).
- **SR.S.2** `[GROUNDED]` RBAC scope is inherited from the session and must remain valid throughout edit. Scope-change behavior is defined in EX.4.

### Data
- **SR.D.1** `[INFERRED]` Prompts are stored in the session record (not in the Knowledge Graph) until UC-HO-02 commits the resulting answer.
- **SR.D.2** `[INFERRED]` Removed prompts are soft-deleted; the content remains in the audit trail. Rejected prompts (EX.1) are **not** persisted in full — only a hash + category code.

### Auditability
- **SR.A.1** `[GROUNDED]` Every add / edit / remove / rejection / live-injection event is logged to the immutable audit log with: actor, timestamp, prompt hash (or full text for adds/edits), before/after content where applicable, safety-check result, queue position, propagation latency.
- **SR.A.2** `[INFERRED]` BR-04's "immutable once spoken" event is logged with the exact moment the AI surfaced the prompt.

---

## TBDs

| ID | Question | Owner | v0.1 Default |
|---|---|---|---|
| **HO-05 TBD-1** | Content-policy ruleset definition. What categories, what severity scoring, what edge cases? | Legal + UX | Generic placeholder ruleset — names categories like "personal opinions about colleagues", "protected-characteristic content", "out-of-scope confidential", but the formal taxonomy is pending. |
| **HO-05 TBD-2** | Should Manager prompts be visible to the Offboarder *pre-interview*, or only when the AI surfaces them mid-interview? | Product + UX | Not visible pre-interview. Surfaced live with the Manager Priority badge when the AI speaks the prompt. |
| **HO-05 TBD-3** | Section Blueprints scope. The dynamic N-section primitive bundled with this UC per Plan v2 has no detailed flow. Is it part of UC-HO-05 or a separate UC-HO-08? | BA | Defer to v2 / separate spec. UC-HO-05 v1 covers Priority Prompts only. |
| **HO-05 TBD-4** | 3-prompt cap — soft (UX nudge) or hard (system blocked)? | Product | Hard cap. Override requires admin action, not a Manager toggle. |
| **HO-05 TBD-5** | Should an AI suggestion that the Manager *dismissed* in this session re-appear in a future session for the same Offboarder, or persist as "do not suggest again"? | Product | Session-scoped dismissal. Future sessions get fresh AI suggestions. |

---

## Cross-References

`[GROUNDED]`

- **UC-HO-01** v2.0 — Step 10 produces the Preliminary Knowledge Map (input). Step 13 surfaces the "Add priority prompts" next-action card that triggers UC-HO-05. The session's RBAC scope, established in UC-HO-01 step 6, governs all UC-HO-05 actions.
- **UC-HO-02** v2.0 — Receives the prompt queue. Surfaces prompts with the Manager Priority badge during AI-guided questioning. The "AI asked" eyebrow convention from CL-022 applies to Manager-priority questions too — they're still framed as conversational AI questions, just with a badge indicating their authorship lineage.
- **UC-HO-03** — Review-and-sign transcript displays which AI questions originated from Manager Priority prompts. The Offboarder sees the badge during review.
- **UC-HO-06** — If a Manager-priority-driven answer is later reported as hallucinated, the prompt history is visible in the correction review for context.
- **UC-ON-01** — Onboarding playbook may inherit Manager Priority context (the topics the Manager flagged as critical for handover are good candidates for critical sections in the successor's playbook). This is an opportunity, not a hard link, in v0.1.

---

## Visual Design References

`[GROUNDED]`

- **CL-018** Sentence-shaped composer placeholder example.
- **CL-019** Policy-violation messages name the specific category before suggesting an action.
- **CL-060** AI-generated prompts render on `bg-violet-50/40` with the Sparkles icon and a violet eyebrow — visually distinct from Manager-authored prompts on neutral surfaces.
- **CL-022** "AI asked" eyebrow convention applies when UC-HO-02 surfaces these prompts in the interview.

---

## Open Questions for BA Review

When Tram reviews this v0.1, the most important things to confirm or correct:

1. **Step ordering in Normal Course** — Claude inferred a 7-step flow that goes *open → suggest → choose → safety-check → review → inject → confirm*. Other orderings are possible (e.g., batch-validating all prompts at injection time rather than per-prompt).
2. **EX.4 authority-change behavior** — should existing confirmed prompts be revoked when the Manager loses authority, or preserved? Claude chose preserved (treating the original confirmation as the moment of intent), but this is a judgment call.
3. **BR-03 / TBD-2 Offboarder pre-interview visibility** — this is the only place where transparency-vs-purity-of-response trades off. Claude defaulted to "not visible" to keep the interview honest, but an argument exists for visibility (consent, predictability).
4. **AS.4 Section Blueprints deferral** — confirm this is the right move, or whether UC-HO-05 v1 should include a minimal blueprint surface.
5. **5-TBD list** — confirm none are already resolved decisions that just weren't captured in writing.

---

*End of UC-HO-05 v0.1 DRAFT. Replace with reviewed canonical version before any downstream commitments.*
