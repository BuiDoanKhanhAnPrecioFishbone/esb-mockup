# UC-HO-05 · Configure Handover Interview Prompts

### 1. Meta Data

* **Feature Name:** Configure Handover Interview Prompts (Priority Prompts)
* **Actor:** Manager (Hà Vy in the canonical demo)
* **User Story:** As a Manager, I want to add priority prompts to the AI-guided handover interview so that the system covers the specific topics most critical for the successor.

### 2. Happy Path (Main Flow)

* **Step 1:** User clicks "Add priority prompts" from the Knowledge Map next-action card. System opens the Priority Prompts surface with: an AI-suggested prompts panel (1–3 violet-tinted cards drafted from the Offboarder's Likely Knowledge Gaps, each with `Sparkles` icon and "AI suggested" eyebrow), an empty draft list, a free-text composer with sentence-shaped placeholder, and a draft counter showing "0 of 3".
* **Step 2:** User clicks "Use this prompt" on one AI suggestion. System copies the suggestion text into the composer, pre-filled and editable.
* **Step 3:** User refines the prompt text in the composer and clicks "Add to draft list". System runs the content-policy safety check (target <2s) and displays an emerald result card "Cleared to add · Pending review" with three pass-reasons bulleted (work-focused / names a system not a person / within Offboarder's documented scope).
* **Step 4:** User confirms by clicking "Add to draft list". System appends the prompt to the draft list at the next position, increments the counter to "1 of 3", and clears the composer.
* **Step 5:** User repeats steps 2–4 for two additional prompts. System renders the draft list with `GripVertical` reorder handles, per-prompt edit / remove icon buttons, and source provenance labels ("AI suggestion · [gap]" or "Manager-authored").
* **Step 6:** User clicks "Inject 3 prompts into interview queue". System validates count and safety status, writes prompts to the UC-HO-02 prompt queue with the `Manager Priority` flag, and extends the audit anchor with a `prompts.injected` event (text hash, position, safety result per prompt).
* **Step 7:** System displays the confirmation screen: an emerald "3 priority prompts added" success card, a preview of how a prompt appears in UC-HO-02 (with "AI asked" eyebrow + yellow `Manager Priority` badge), and a 3-entry audit log preview.

* **Outcome:** 3 prompts in the UC-HO-02 prompt queue, each carrying the Manager Priority flag. Audit log extended. Live propagation within 30 seconds if UC-HO-02 is already running.

### 3. Edge Cases & Error Handling (UI/UX States)

* **E1: Validation / Permission · Content-policy rejects the prompt.** Safety check flags the prompt text. System keeps the prompt in the composer (rose border, rose-50 fill) and renders a rose-toned rejection card below with `ShieldAlert` icon that names the specific category (e.g., "Asks for personal opinions about colleagues") + a plain-language explanation + a violet `Lightbulb`-iconed "Try rephrasing around the work" panel showing a suggested rephrase as a quoted blockquote + a "Read the full prompt policy" link. Footer actions: `Discard prompt`, `Rephrase`, `Use the suggested rephrase`. The rejected text is NOT persisted in full — only a hash + category code reach the audit log.

* **E2: Validation / Permission · Manager's RBAC scope changes mid-edit.** Authority over the session changes (reassignment / role change). System discards in-flight composer content, preserves any already-confirmed prompts in the queue, and redirects to the session dashboard with a non-blocking message: "Your authority over this session has changed. New edits were not saved. Existing prompts are unaffected."

* **E3: System / Network · Content-policy service unavailable.** Safety check service is unreachable when user clicks "Add to draft list". System does NOT add the prompt (no bypass). Composer shows a yellow inline notice: "Safety check is temporarily unavailable. Retrying in 15 seconds." Auto-retry runs for up to 2 minutes; if still unavailable, the user is asked to come back later or escalate to Platform Admin.

* **E4: System / Network · Live injection exceeds 30-second SLA.** During AS.2 live injection (UC-HO-02 running), queue propagation takes longer than 30 seconds. System still adds the prompt to the queue (no rollback) and shows a non-blocking toast: "Prompt added — it may not appear until the next AI question (longer than usual to propagate)." The SLA breach is logged for monitoring.

* **E5: User Branching · User tries to add a 4th prompt.** Draft list is already at the 3-prompt cap. System disables the "Add to draft list" CTA, replaces the "Add prompt" affordance with a dashed-border disabled state ("Add prompt · disabled · remove one to make room"), and shows a persistent yellow banner: "You've reached the 3-prompt limit for this session. Remove or merge an existing prompt to add a new one." with inline links to each current prompt.

* **E6: User Branching · User tries to edit or remove an already-spoken prompt.** UC-HO-02 has already surfaced the prompt to the Offboarder (BR-04 lock engaged). System disables the edit and remove icon buttons on that prompt's draft card, shows a `Lock` icon in place, and a tooltip on hover: "This prompt has been spoken — it can no longer be edited or removed, only logged." The `Pending review` badge changes to `Spoken` (gray) with a timestamp.
