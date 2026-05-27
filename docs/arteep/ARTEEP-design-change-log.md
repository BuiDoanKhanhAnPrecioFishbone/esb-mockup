# ART-EEP — Design Change Log

*Living document. Every design or architectural decision made during build is logged here with its rationale. Entries are append-only; never delete, only mark superseded.*

---

## Entry Format

| Field | Purpose |
|---|---|
| Date | When the decision was made |
| Sprint | Which sprint the decision belongs to |
| Change | What was decided or changed |
| UC Reference | The Use Case step, rule, or TBD this traces to (or "cross-cutting" if system-wide) |
| Why | The rationale — the "because" behind the decision |
| Decided By | Role / team that owns this decision |
| Category | BA Gap · UX Refinement · Visual System · Performance · Scope Deferral · Default Pending Confirmation |

---

## Sprint 0 — Foundation

### CL-001 — UI copy language standardized to English

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S0 |
| Change | All user-facing UI copy will be written in English. Proper nouns (persona names like Trần Hữu Nam, Minh Lê, Hà Vy) remain unchanged as they are names, not content. |
| UC Reference | Cross-cutting (all UCs) |
| Why | Stakeholder direction. Broader team accessibility and international consistency. The prior Vietnamese copy from the State-driven Prototype phase is superseded by this decision. |
| Decided By | Stakeholder |
| Category | UX Refinement |

### CL-002 — UX writing principles adopted

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S0 |
| Change | Adopted six writing principles for all UI copy: (1) Clear, not clever — simple words over jargon; (2) Active voice — "Request access" not "Access can be requested"; (3) Concise — cut filler words; (4) Helpful, not corporate — no "Please" prefixes, no "We apologize for the inconvenience"; (5) Consistent vocabulary — same word for same concept everywhere; (6) Action-oriented buttons — verbs that describe what happens. Sentence case throughout (e.g., "Request access" not "Request Access"). |
| UC Reference | Cross-cutting (all UCs) |
| Why | English copy quality is non-negotiable for enterprise-grade perception. Matches the writing register of Linear, Notion, Stripe, GitHub — which is the visual and tonal benchmark for our deep-tech aesthetic. |
| Decided By | UX |
| Category | UX Refinement |

### CL-003 — Hackathon-compressed mode confirmed

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S0 |
| Change | Build mode is Hackathon-compressed: real Azure architecture (Cosmos DB Gremlin, Azure AI Search, Semantic Kernel, Purview), but external integrations (HR sync, Microsoft Graph Connectors, Whisper API) are mocked with deterministic fixtures during the demo period. Production integration work is deferred to v2. |
| UC Reference | Cross-cutting |
| Why | Default per project context. The architecture stays honest (so pitch claims are real), the demo runs reliably (no flaky third-party dependencies), and integration realism is a v2 concern rather than a v1 blocker. |
| Decided By | BA Pod (default) — reversible by stakeholder before S1 |
| Category | Default Pending Confirmation |

### CL-004 — Demo personas locked

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S0 |
| Change | The canonical demo personas for all screens, mock data, and the S6 end-to-end demo are: **Trần Hữu Nam** (Onboarder, Senior Backend Engineer), **Minh Lê** (Offboarder / predecessor in the same role), **Hà Vy** (Manager). |
| UC Reference | Cross-cutting (referenced in all screens with mock data) |
| Why | Continuity with the prior State-driven Prototype phase preserves narrative momentum and the team's shared vocabulary. Three named characters make the demo a story, not a feature gallery. |
| Decided By | BA Pod (default) |
| Category | Default Pending Confirmation |

### CL-005 — Sprint blocker defaults taken pending stakeholder confirmation

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S0 |
| Change | Defaults adopted for 5 sprint-blocking TBDs, each reversible before its target sprint starts: (a) HO-01 TBD-1 — Vietnam PDPA basis for automated scanning; (b) HO-01 TBD-3 — Offboarder right to view their own Knowledge Map deferred to v2; (c) HO-03 TBD-1 — Vietnam local e-signature standard (eIDAS-equivalent); (d) ON-01 TBD-2 — static Playbook delivery + Persistent Copilot overlay for queries (vs. fully live-querying interface); (e) ON-02 TBD-3 — desktop-first v1, mobile parity in v2. |
| UC Reference | UC-HO-01, UC-HO-03, UC-ON-01, UC-ON-02 |
| Why | Each default is the simpler, lower-risk path. Each can be reversed without architectural rework if stakeholder corrects before the target sprint starts (S1 for HO-01 blockers, S2 for HO-03, S4 for ON-01/ON-02). |
| Decided By | BA Pod (default) — pending stakeholder confirmation |
| Category | Default Pending Confirmation |

### CL-006 — Shared component library built in S0

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S0 |
| Change | All 7 shared components (Provenance Chip, Severity Badge, Verified Badge, Disputed Badge, Low Confidence Badge, Mask Card, Section Card) are built in Sprint 0 before any screen work begins, instead of just-in-time during their first-use sprint. |
| UC Reference | Cross-cutting (components are reused across ≥3 screens each) |
| Why | Building shared components in S0 eliminates duplication risk across S1–S5 and locks the visual grammar before any screen-level decisions can drift it. Cost: 2–3 days of S0 time. Benefit: zero rework on shared visual treatments downstream. |
| Decided By | Architecture |
| Category | Visual System |

### CL-007 — State taxonomy locked at 14 states

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S0 |
| Change | The 14-state vocabulary defined in the Implementation Plan §4 is locked. Every state needed across all 20 screens draws from this taxonomy. New states require an explicit Change Log entry justifying why the existing 14 are insufficient. |
| UC Reference | Cross-cutting |
| Why | A bounded vocabulary forces consistency. If we let screens invent their own states ad hoc, the visual system fragments and users can't transfer learning between surfaces. |
| Decided By | Architecture + UX |
| Category | Visual System |

### CL-008 — Color palette restricted to two accents

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S0 |
| Change | The visual system uses exactly two accent colors: **amber** (signal — active states, provenance, generation moments) and **rose** (critical — only for Critical severity items and the recording indicator in HO-02). Emerald is reserved exclusively for verified-content badges and "accept change" affordances (UC-HO-07). No other accent colors are introduced. |
| UC Reference | Cross-cutting |
| Why | When every signal has its own color, no signal stands out. Restricting to amber + rose makes the visual hierarchy load-bearing: a rose element on screen is *always* critical; an amber element is *always* a system signal. Emerald earns its place because "verified" is a distinct conceptual category that needs visual differentiation. |
| Decided By | UX |
| Category | Visual System |

### CL-009 — Animation budget restricted to two moments

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S0 |
| Change | Animation is permitted in exactly two places: (a) the concentric pulsing rings on the recording indicator in UC-HO-02 (signals "live capture"); (b) the per-section completion glow fade in the UC-ON-01 Generation Stage (signals "this section just landed"). All other UI transitions use 200ms ease-out CSS transitions for state changes only — no decorative motion. |
| UC Reference | UC-HO-02, UC-ON-01 |
| Why | Enterprise tools earn credibility through restraint. Decorative motion makes the product feel consumer-grade. Reserving animation for the two moments where it conveys actual state information ("we're recording" / "this just completed") preserves the deep-tech register. |
| Decided By | UX |
| Category | Visual System |

### CL-010 — Border discipline locked at 1px

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S0 |
| Change | All borders in the system are 1px hairlines using gray-200. Active or focused states earn visual weight through (a) accent-color hairline + (b) outer ring at 12px / 12% opacity — not thicker borders. No 2px, 3px, or dashed-pattern borders except for the dashed circle on the RBAC-locked node glyph (semantic meaning: "this exists but you can't see inside it"). |
| UC Reference | Cross-cutting |
| Why | The 1px hairline is the single most identifiable visual signature of enterprise deep-tech UI (Palantir, Linear, Vercel). Breaking the rule erodes the entire visual identity. |
| Decided By | UX |
| Category | Visual System |

---

---

## Sprint 1 — Handover Initiation

### CL-011 — CTAs in screens advance to next sprint screen (happy path only)

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 |
| Change | In the S1 prototype, primary CTAs (e.g., "Initiate session →", "Start session & begin seeding") advance the prototype to the next screen's happy path. State changes remain controlled by the top state selector. This is a prototype-only behavior to make demo flow feel natural; in production each screen is independently routed by URL. |
| UC Reference | Cross-cutting |
| Why | A purely state-driven prototype with no forward motion feels like a slideshow. Letting CTAs advance the demo creates the experience of using a real product. The top selector preserves random access to any state. |
| Decided By | UX |
| Category | UX Refinement |

### CL-012 — "Sensitive content" copy replaces "PII" in user-facing text

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 |
| Change | Across Screens 3 and 4, the term "PII" is replaced with "personal or sensitive content" or "sensitive content" in user-facing copy. The UC docs and architecture continue to use "PII classification" and "Microsoft Purview" as technical terms. |
| UC Reference | UC-HO-01 step 8, UC-HO-01 SR (Purview PII Gate) |
| Why | "PII" is industry jargon. A Manager reading the dashboard doesn't need to know the acronym — they need to know what's being filtered out and why. "Sensitive content" is clearer and more honest about the scope (Purview catches more than just PII per the organization's sensitivity labels). |
| Decided By | UX |
| Category | UX Refinement |

### CL-013 — "Microsoft Purview" not named in user-facing copy

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 |
| Change | The product name "Microsoft Purview" does not appear in user-facing copy. Where the classification step is referenced, it's described as "sensitivity classification" or "classification" without the vendor name. |
| UC Reference | UC-HO-01 step 8, UC-HO-01 EX.4 |
| Why | Per the locked rule: no backend leakage in UX copy. The Manager doesn't need to know which vendor classifies their data; that detail belongs in admin and audit surfaces. The Audit Log Tile (S0 component) still records the technical reference for compliance traceability. |
| Decided By | UX |
| Category | UX Refinement |

### CL-014 — Critical Notice Period banner copy

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 |
| Change | When EX.3 triggers (last working day <3 business days), the Setup Wizard shows a banner with copy: *"Minh Lê's last working day is in 2 days. The review deadline has been adjusted to [Date]. Schedule the interview as soon as possible."* — using the name of the actual person, not a placeholder. |
| UC Reference | UC-HO-01 EX.3 |
| Why | Generic urgency banners ("Critical timeline!") are easy to dismiss. Naming the person grounds the urgency in someone the Manager actually knows. The UX writing principle "Helpful, not corporate" applies. |
| Decided By | UX |
| Category | UX Refinement |

### CL-015 — Email source description clarifies privacy constraint inline

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 |
| Change | The Email metadata data source row in the Setup Wizard includes the inline copy: *"Subject lines and participants only. Email content is never read or stored."* — surfaced in the data source picker itself, not buried in a tooltip or "Learn more" link. |
| UC Reference | UC-HO-01 SR (Privacy — Email Scanning Constraint) |
| Why | The constraint is a real privacy guarantee enforced at the integration layer. Burying that promise in a tooltip would mean Managers wouldn't read it. Putting it at the point of decision (the checkbox) means the privacy story is part of the choice, not an afterthought. |
| Decided By | UX |
| Category | UX Refinement |

### CL-016 — "Likely knowledge gaps" framed as warm guidance, not deficiency

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 |
| Change | The Knowledge Map screen frames detected gaps as "Likely knowledge gaps" with warm-amber styling and constructive phrasing (e.g., *"Payment Gateway timeout — no written runbook, recurring incidents"*) rather than alarming language ("Missing documentation!" / "Critical gaps detected!"). |
| UC Reference | UC-HO-01 step 9 (Preliminary Knowledge Map) |
| Why | Knowledge gaps are a normal feature of every role — naming them as "deficiencies" makes the Manager defensive about their team. Framing them as opportunities for the interview to fill keeps the tone collaborative. The amber color signals "pay attention" without "this is broken." |
| Decided By | UX |
| Category | UX Refinement |

### CL-017 — Progress stages use "Skipped" with strikethrough rather than "Failed"

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 |
| Change | On the Seeding Progress screen, when a source fails and dependent stages can't run, those dependent stages are labeled "Skipped" with a strikethrough — not "Failed." Only the actual failure point shows the error state. |
| UC Reference | UC-HO-01 EX.1 |
| Why | If Drive scanning fails, "Scanning 412 files" didn't fail — it never ran. Calling it "Failed" implies an error in that stage, which would confuse troubleshooting. "Skipped" with strikethrough is honest about what happened. |
| Decided By | UX |
| Category | UX Refinement |

### CL-018 — Manager priority prompts use sentence-shaped examples in copy

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 |
| Change | The Priority Prompts composer uses a placeholder that's a full sentence example: *"Add a focus area — for example, 'Probe deeply on the renewal negotiation with Vendor XYZ.'"* — not a generic prompt like "Enter your prompt here." |
| UC Reference | UC-HO-05 step 4 |
| Why | UC-HO-05 [TBD-1] notes the content policy ruleset is in development. By modeling the kind of input we want (action-shaped, work-focused), we steer the Manager toward good prompts and away from policy violations before the safety check runs. |
| Decided By | UX |
| Category | UX Refinement |

### CL-019 — Policy violation messages name the issue category, then suggest action

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 |
| Change | When the content policy check (UC-HO-05 EX.1) flags a prompt, the message names the specific category that was triggered (e.g., "asks for personal opinions about colleagues") rather than a generic "policy violation," and offers a constructive next action ("Try rephrasing around the work itself.") |
| UC Reference | UC-HO-05 EX.1 |
| Why | Generic policy violation messages are frustrating because the user doesn't know what to fix. Naming the specific category makes the rejection actionable. The constructive action keeps the user moving forward rather than abandoning the prompt. |
| Decided By | UX |
| Category | UX Refinement |

### CL-020 — Audit Log Tile (S0 component) extended for S1 use

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 |
| Change | The Audit Log Tile component from S0 is consumed on the Dashboard screen (Screen 01) in the "Recent activity" section, demonstrating cross-screen reuse and providing the Manager with a passive awareness layer of recent system events. |
| UC Reference | UC-HO-01 PC.8 (audit anchor), UC-HO-04 PC.6 (completion report context) |
| Why | The audit log isn't just a compliance artifact — it doubles as ambient context. A Manager opening the dashboard sees what happened recently in their orbit (a new departure was detected; an onboarding was released last week), which helps them prioritize. Reusing the S0 component validates the S0 investment. |
| Decided By | Architecture + UX |
| Category | Visual System |

---

---

## Sprint 2 — Capture & Verify

### CL-021 — Concentric pulsing rings on the recording indicator

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S2 |
| Change | The Live Voice Interview screen uses three nested concentric layers for the recording indicator: an outer ring (112px, rose-400 at 20% opacity, `animate-ping`), a static mid ring (88px, rose-100), and a solid inner circle (64px, rose-500 with white mic glyph). When paused, the outer ring animation stops, the inner circle desaturates to gray, and the mic icon switches to MicOff. |
| UC Reference | UC-HO-02 step 4 (recording active) · CL-009 (animation budget) |
| Why | Per CL-009, this is one of only two animations allowed in the entire system. The triple-ring construction reads as "live capture" universally — it's the same visual grammar users recognize from voice assistants, phone call screens, and recording apps. The pause state is the same component with the animation removed, which preserves visual identity while clearly signaling state. |
| Decided By | UX |
| Category | Visual System |

### CL-022 — "AI asked" eyebrow, not "Question"

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S2 |
| Change | The eyebrow on AI-generated question cards reads "AI asked" (past tense), not "Question" or "AI question." Same pattern on the transcript: AI utterances are labeled "AI", Offboarder utterances are labeled "You". |
| UC Reference | UC-HO-02 steps 5, 7 |
| Why | "AI asked" frames the AI as a participant in a conversation, which is what's actually happening. "Question" is generic; "AI question" sounds like a quiz. The conversational framing also makes the Manager Priority badge (when present) read as "this is from your manager, via the AI" rather than as a system label. |
| Decided By | UX |
| Category | UX Refinement |

### CL-023 — Recording consent uses concrete promises, not legal boilerplate

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S2 |
| Change | The Pre-Interview Briefing's consent section uses three concrete bullet promises ("auto-deleted 90 days after commit", "encrypted", "only you / your manager / authorized HR admins can access it") instead of legal boilerplate. Each promise has a relevant icon (Mic for transcription, Eye for access, Type for the text mode option). |
| UC Reference | UC-HO-02 step 2 (briefing) · UC-HO-02 SR (Privacy & Security) |
| Why | Legal boilerplate gets skipped because users have learned it's not worth reading. Concrete promises ("90 days") in plain English actually get read because they're specific. The Offboarder is about to share knowledge built over years of work — they deserve to know what will happen to the recording in language they can actually parse. |
| Decided By | UX |
| Category | UX Refinement |

### CL-024 — Topic count is dynamic (per UC-HO-02 v2.0)

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S2 |
| Change | The Briefing screen lists N domains derived from the Preliminary Knowledge Map and Manager priority prompts, not a hardcoded 4 sections. The Low Context state (EX.4) shows only 3 generic domains. The Live Interview top bar shows "Topic 3 of 7" — the 7 is the dynamic N from the seeded context, not a fixed number. |
| UC Reference | UC-HO-02 v2.0 step 2, step 8 (dynamic N-domain coverage) |
| Why | This honors the Dynamic Content Clustering correction we baked into UC-HO-02 v2.0. The interview shape mirrors the actual knowledge being captured — a Senior Backend Engineer at this company gets a different set of topics than, say, a Sales Director would. The Briefing screen showing the actual list (with Manager priority badges for the two that came from Hà Vy's prompts) makes that personalization legible to the Offboarder before they begin. |
| Decided By | UX |
| Category | Visual System |

### CL-025 — Inactivity modal asks "Still there?" not "Are you still active?"

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S2 |
| Change | The inactivity modal (UC-HO-02 EX.3) uses the question "Still there?" with a warm tone — not "Are you still active?" or "Session about to expire." Action buttons are "I'm here" (primary) and "Pause now" (secondary), not "Continue / Cancel." |
| UC Reference | UC-HO-02 EX.3 |
| Why | The Offboarder may have stepped away to think, or to grab notes, or because someone interrupted them. The modal is asking a human question, so it should sound like a human asking. "Still there?" is what a colleague would say if they noticed you'd gone quiet. The primary action "I'm here" mirrors that conversational register. |
| Decided By | UX |
| Category | UX Refinement |

### CL-026 — Text mode is presented as an equal choice, not a fallback

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S2 |
| Change | The "Switch to text mode" option appears on the Briefing screen as a normal action button alongside "Begin interview" — not buried in settings or labeled as "If you can't use voice…" Text mode itself uses a chat-style interface that feels native rather than a degraded voice interview. |
| UC Reference | UC-HO-02 AC.2 |
| Why | Some Offboarders genuinely prefer typing — they think more clearly in writing, or they have a noisy environment, or English isn't their first language and they want time to compose answers. Framing text mode as "fallback" implies they're choosing the inferior path. Equal presentation respects their judgment. |
| Decided By | UX |
| Category | UX Refinement |

### CL-027 — Transcript line highlighting on edit, not on click

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S2 |
| Change | When the Offboarder clicks "Edit" on a draft summary item in the Review Workspace (Screen 9), the corresponding transcript segment is auto-highlighted (amber background) on the left panel — not just when the item is clicked. The Source chip on each item shows the timestamp; clicking the chip scrolls the transcript to that line. |
| UC Reference | UC-HO-03 step 3, step 5 |
| Why | Editing requires cross-reference — the Offboarder needs to verify what they actually said before deciding how to correct it. Auto-highlighting on edit-mode means the relevant evidence is already on screen when the edit field opens, rather than requiring an extra click. The Source chip remains the deliberate jump-to mechanism for reading without editing. |
| Decided By | UX |
| Category | UX Refinement |

### CL-028 — Three draft-item status badges, distinct semantics

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S2 |
| Change | Draft summary items carry one of four status badges: "AI generated" (neutral gray, Sparkles icon), "Edited" (amber, Pencil icon), "Added by you" (emerald, Plus icon), "Editing" (amber, Edit3 icon — transient state while inline editing). These are *separate* from the S0 Confidence Badge — they describe authorship/lifecycle, not certainty. |
| UC Reference | UC-HO-03 step 6 (Edited badge) · AC.2 (Added by you badge) |
| Why | Authorship matters because it affects responsibility. An "Edited" item is the AI's draft with the Offboarder's correction overlaid — they share ownership. An "Added by you" item is fully the Offboarder's contribution. An "AI generated" item is the AI's draft that the Offboarder reviewed and didn't change (implicit endorsement by signing). This distinction is preserved in the audit trail and matters legally. |
| Decided By | BA + UX |
| Category | Visual System |

### CL-029 — Manager flag callout uses Manager's avatar, not a system icon

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S2 |
| Change | When Hà Vy flags an item (UC-HO-03 AC.3), the callout shows her initials "HV" in a rose-tinted avatar circle — not a generic Flag icon. The callout reads "Hà Vy flagged this item · 2 hours ago" with her actual note rendered below. |
| UC Reference | UC-HO-03 AC.3 |
| Why | A human flag from a known colleague carries different weight than a system warning. Showing Hà Vy's avatar tells the Offboarder *who* needs them to address this, not just *that* something needs addressing. The relationship is the urgency. |
| Decided By | UX |
| Category | UX Refinement |

### CL-030 — Sign button disabled when Manager flags unresolved

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S2 |
| Change | The "Approve & sign" button on the Review Workspace is disabled (gray, not interactive) while any Manager flag remains unresolved. A persistent bar at the top of the screen names the flag count and provides a jump-to link: "Your manager flagged 1 item. Resolve it before you can sign — jump to BUG-404." |
| UC Reference | UC-HO-03 AC.3 (Manager flag must be resolved before sign) |
| Why | The UC says "The Offboarder must explicitly resolve or dismiss each Manager flag before the Approve & Sign button becomes active." Making this visible via a persistent bar (not just by sign button state) keeps the reason for the disabled button discoverable. Hiding the rule behind a tooltip would be hostile. |
| Decided By | BA |
| Category | BA Gap |

### CL-031 — Sign-off modal explains what signing actually does

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S2 |
| Change | The Sign-off confirmation modal carries the plain-English statement: *"By signing, you confirm that this summary accurately represents your handover knowledge. It will be committed to the company's knowledge graph and used to build the onboarding playbook for whoever fills your role next."* Below the PIN entry, a footer explains: *"Your signature is legally binding under Vietnam's e-signature law. The signed record will be retained for 2 years."* |
| UC Reference | UC-HO-03 step 10, SR (Auditability), SR (Digital Signature) · CL-005 (Vietnam e-signature default) |
| Why | The legal weight of the signature is real. Burying it in fine print would be both ethically dubious and practically risky (Offboarders could later claim they didn't understand). Naming the consequence ("used to build the onboarding playbook for whoever fills your role") makes the act feel meaningful rather than bureaucratic, which is what we actually want — the signature is supposed to be a moment of intention, not a checkbox. |
| Decided By | UX + BA |
| Category | UX Refinement |

### CL-032 — Authentication failure copy names attempts remaining, not generic error

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S2 |
| Change | When PIN authentication fails (UC-HO-03 EX.2), the error message names how many attempts remain: *"Authentication failed. 2 attempts remaining before signing is locked for 15 minutes."* — and provides an inline link to "Reset your credentials." The PIN input fields tint rose-50 to anchor the error visually. |
| UC Reference | UC-HO-03 EX.2 (3 consecutive failures triggers 15-min lock) |
| Why | Generic "Authentication failed. Try again." gives no information about consequences. Naming the attempts-remaining count tells the user how cautious they need to be on the next try, and the explicit "15-minute lock" makes the system's behavior predictable. The reset link is in the message itself, not a separate "Forgot your PIN?" link far away. |
| Decided By | UX |
| Category | UX Refinement |

### CL-033 — Audio playback uses minimal player chrome, not full media controls

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S2 |
| Change | The audio playback control on the Review Workspace transcript panel uses a minimal player: play/pause button, current time, scrubber, total duration, volume control. No fast-forward, no skip, no speed control, no download. |
| UC Reference | UC-HO-03 SR (Performance — audio inline without page reload) |
| Why | The audio's purpose here is verification ("Did I actually say that?") not consumption. A full media player would be feature creep. The minimal player keeps the focus on the transcript and summary, where the actual review work happens. Skip/speed controls can come in v2 if Offboarders request them. |
| Decided By | UX |
| Category | Scope Deferral |

---

---

## Sprint 3 — Knowledge Graph Commit

### CL-034 — Progress Stage component pattern reused across sprints

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S3 |
| Change | The Indexing-in-progress state of Screen 11 uses the same Progress Stage component pattern introduced in S1's Seeding Progress screen — identical visual treatment (done/active/pending/failed states, status icons, monospace details, line dividers), just with different stage labels. |
| UC Reference | UC-HO-01 step 6 (seeding) · UC-HO-04 step 6 (commit) |
| Why | Both screens describe the same kind of thing — a multi-stage pipeline the user can watch. Using the same component preserves muscle memory: the Manager who watched the seeding finish 10 minutes ago can read the indexing progress without any cognitive overhead. Different content, same shape. |
| Decided By | UX |
| Category | Visual System |

### CL-035 — "Needs your call" replaces "Disambiguation required"

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S3 |
| Change | When the indexing pipeline encounters ambiguous entities (UC-HO-04 AC.1), the resulting Manager-facing prompts use phrases like "needs your call" and "decide before they merge" — not "disambiguation required" or "entity resolution conflict." Each card carries a "Needs your call" badge instead of "Conflict" or "Ambiguous." |
| UC Reference | UC-HO-04 AC.1 (low-confidence entity review) |
| Why | "Disambiguation" is precisely correct in graph database literature but sounds bureaucratic to the Manager. "Needs your call" frames it as a judgment task — which is exactly what it is. The Manager isn't resolving conflicts in a system; they're making decisions about people and projects they know. The language should reflect that. |
| Decided By | UX |
| Category | UX Refinement |

### CL-036 — "Up next" surfaces downstream pipeline immediately on completion

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S3 |
| Change | The Completed state of Screen 11 places "Up next — Onboarding playbook for Trần Hữu Nam" as the *first* element below the page header, in an amber-tinted card with its own visual weight. The commit stats and breakdown come below it. |
| UC Reference | UC-HO-04 step 10 (downstream effects) · cross-sprint: leads into UC-ON-01 |
| Why | The Manager's question after a commit isn't "what did we capture?" — they can read that later. It's "what happens next?" Front-loading the downstream effect (playbook generation, named Onboarder) gives them the orienting answer before they scroll. The amber treatment ties visually to the AI/system activity language used elsewhere (consistent with the Manager Priority Question badge from S2). |
| Decided By | UX |
| Category | UX Refinement |

### CL-037 — Skill chips named by status (New / Strengthened / Refined), not just listed

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S3 |
| Change | Skills mapped from the handover appear as chips with their relationship to the existing catalog labeled inline: "New" (emerald), "Strengthened" (neutral gray), "Refined" (amber). Not a flat list. |
| UC Reference | UC-HO-04 step 9 (skill taxonomy update) |
| Why | "Skills mapped: 8" is a number. The Manager needs to know whether the system *learned new things* (which matters for the org's capability picture) or *reinforced what it already knew*. The status labels make that distinction visible at a glance without requiring a click into the taxonomy. |
| Decided By | BA + UX |
| Category | UX Refinement |

### CL-038 — Partial commit framed by what worked, not what failed

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S3 |
| Change | The Partial Commit state opens with the success number first ("42 of 47 items committed"), then names the issue ("5 items couldn't be written"), then reassures ("Nothing is corrupted — failed items are preserved exactly as Minh Lê signed them"). The stats grid shows committed-count *and* failed-count *and* time-spent, giving proportion rather than just defect. |
| UC Reference | UC-HO-04 EX (atomic commit failure scenarios) |
| Why | A partial commit isn't a failure — it's a state. Framing it as "X items failed" makes it sound like the whole thing went wrong; framing it as "42 of 47 committed, 5 retryable" makes it solvable. The reassurance line addresses the Manager's actual fear ("did we lose the signature?") explicitly. |
| Decided By | UX |
| Category | UX Refinement |

### CL-039 — Retryable vs needs-admin distinction visible on each failed item

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S3 |
| Change | Each failed item in the Partial Commit state carries an explicit badge: "Retryable" (amber) or "Needs admin" (rose). The primary CTA is precise: "Retry the 4 retryable" — not just "Retry." |
| UC Reference | UC-HO-04 EX (atomic commit failure scenarios) |
| Why | The Manager shouldn't have to read each item's failure reason to know what they can do about it. The badge tells them: 4 of these are transient (worth a retry), 1 is structural (needs someone else). The CTA respects that — "Retry the 4 retryable" precludes the false hope of retrying all 5. |
| Decided By | UX |
| Category | UX Refinement |

### CL-040 — No completion animation on Screen 11 (reserved for Screen 13)

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S3 |
| Change | When indexing completes (Screen 11 Completed state), there is no completion glow, no success animation, no celebratory motion. The screen renders statically with the report. The completion-glow animation is reserved exclusively for the ON-01 Generation Stage in S4 (per CL-009). |
| UC Reference | CL-009 (animation budget reserved to 2 places) |
| Why | We have an animation budget of two and one is spent on HO-02's recording indicator (used). The other is reserved for ON-01's Generation Stage in S4, which is the demo's signature wow moment. Spending it here would feel celebratory in the wrong place — indexing completion is satisfying but the Manager's next action is moving on to onboarding, not pausing to enjoy the moment. The animation belongs at the surface where the audience is meant to feel impressed, not the surface where the Manager is on a workflow. |
| Decided By | UX |
| Category | Visual System |

---

---

## Sprint 4 — Onboarding Generation & Reading

### CL-041 — Smart Preset cards lead with one-line rationale, not feature list

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S4 |
| Change | Smart Preset cards on the Playbook Builder display a single concise rationale line beneath the title (e.g., "Matches Trần Hữu Nam's role exactly · uses Minh Lê's handover as primary source") instead of a bulleted list of features or generic descriptions. Section count appears as small mono-typed metadata. |
| UC Reference | UC-ON-01 step 5 (Smart Preset suggestions) |
| Why | The Manager doesn't need a feature spec — they need to know *why this preset, for this Onboarder, right now*. The rationale references the specific people involved (Trần Hữu Nam, Minh Lê) rather than abstract role labels. This makes preset selection feel like a judgment call ("yes, that's the right reasoning") rather than a checkbox exercise. |
| Decided By | UX |
| Category | UX Refinement |

### CL-042 — Custom prompt interpretation surfaced inline before generation

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S4 |
| Change | When the Manager adds a custom prompt, the AI's interpretation is shown directly beneath the prompt in an amber-bordered inline chip (e.g., prompt "Spend extra time on the Payment Gateway timeout" → interpretation: "Generate a runbook-style section with symptoms, fix procedure, and rollback steps"). This appears *before* the Generate CTA is clicked, not after generation begins. |
| UC Reference | UC-ON-01 step 7 (custom prompt confirmation) |
| Why | Letting the Manager see how their prompt was interpreted gives them a free correction loop before any tokens get spent on generation. If the AI's interpretation reads "Generate a section about Minh Lê's compensation" when the Manager meant compensation philosophy, the Manager can fix it before paying for 15 minutes of wrong work. The amber border ties this to the AI-activity language convention from S2. |
| Decided By | UX + Architecture |
| Category | UX Refinement |

### CL-043 — Out-of-scope prompts named with their actual rejection reason

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S4 |
| Change | When a custom prompt is rejected (UC-ON-01 EX.3 — out of access scope), the rejection names the specific reason: e.g., "Compensation history requires HR-Admin permissions, which your Manager role doesn't include." The prompt itself is shown in the banner with the rejection reason and an escalation suggestion ("ask your HR admin to either generate a separate playbook or escalate your access"). |
| UC Reference | UC-ON-01 EX.3 |
| Why | Same principle as CL-019 (S1 policy violation copy): naming the specific blocker makes the rejection actionable. The Manager learns from the rejection rather than just being blocked by it. The constructive escalation path keeps them moving forward. |
| Decided By | UX |
| Category | UX Refinement |

### CL-044 — Generation Stage uses skeleton shimmer for Pending, typewriter cursor for Drafting

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S4 |
| Change | The Generation Stage's per-section state visualization: Pending sections show two skeleton-shimmer bars (Tailwind `animate-pulse`); Drafting sections show partial text content with a blinking cursor at the trailing edge; Complete sections show the final metadata (item count + confidence badge). The completion glow animation fires once on the most-recently-completed section per CL-009. |
| UC Reference | UC-ON-01 steps 10–12 (per-section state visualization) |
| Why | Three different visual treatments map to three different cognitive states: "we haven't started yet" (skeleton), "this is happening live" (typewriter cursor), "this just finished" (glow → settled metadata). The visual vocabulary teaches the user what stage matters as the generation progresses. Animations are bounded by CL-009 — the cursor and skeleton are CSS animations on per-element basis, not the budgeted "moments" (which are the recording mic and the completion glow). |
| Decided By | UX |
| Category | Visual System |

### CL-045 — Agent Activity log uses plain English, names no model

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S4 |
| Change | The Agent Activity log on the Generation Stage uses plain-English status descriptions (e.g., "Section 3 drafting · Payment Gateway timeout · retrieval strategy: GraphRAG Local") instead of internal model names (GPT-4o, Phi-3, etc.) or implementation details. Technical details that aid trust (ComplexityScore, escalation reasons, confidence values) are shown; vendor model identifiers are not. |
| UC Reference | UC-ON-01 step 11 · CL-013 (vendor names not in user copy) |
| Why | The Manager benefits from knowing *how* the system is working (which retrieval strategy ran, why a section was escalated). They don't benefit from knowing *which model* ran — that's an implementation detail that creates the false impression they need to know it. The plain-English line preserves trust and transparency without forcing them to know our stack. |
| Decided By | UX |
| Category | UX Refinement |

### CL-046 — Critical content cannot be hidden behind a chevron (BR-05 enforced)

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S4 |
| Change | On the Playbook Reading screen, items tagged Critical render expanded by default with full body content visible immediately. The chevron toggle is not present on Critical items — they are always open. High/Medium/Low items collapse by default with a chevron toggle. This enforces BR-05 from UC-ON-01. |
| UC Reference | UC-ON-01 BR-05 · UC-ON-02 step 4 (severity-based progressive disclosure) |
| Why | A Critical item (Payment Gateway timeout, vendor SLA breach trigger) cannot be allowed to hide behind a chevron — if Trần Hữu Nam scrolls past it without expanding, the system has failed at its core job. Removing the toggle makes the Critical content load-bearing. Lower-severity content earns its collapsibility because the cost of scrolling past it is lower. |
| Decided By | BA + UX |
| Category | BA Gap |

### CL-047 — Inline entity links use underline-decoration accent, not raw color

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S4 |
| Change | Entity links inside Playbook content (Payment Gateway v2, Minh Lê, feature flag console, etc.) are rendered with `text-gray-900 underline decoration-amber-400 decoration-2 underline-offset-2` — the link text stays in body color, but a 2px amber underline marks it as interactive. Hover state adds a subtle amber-tinted background. |
| UC Reference | UC-ON-02 step 5 (inline entity links) |
| Why | Coloring link text amber would break the body-text legibility and pull attention away from the prose. The amber underline-only treatment marks interactivity at the same affordance level as a traditional underline link, but ties visually to the system's amber-as-signal language. The body text remains scannable; the interactivity is there when the eye needs it. |
| Decided By | UX |
| Category | Visual System |

### CL-048 — Entity mini-card on hover, not on click

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S4 |
| Change | Hovering over an inline entity link shows a mini-card popover with the entity's summary, key relationships, and a "Focus on the graph" affordance. The card appears on hover (with a small delay) and dismisses on mouse-out. Clicking the entity is reserved for the dedicated "Focus on the graph" action inside the card. |
| UC Reference | UC-ON-02 step 5 (inline entity context) |
| Why | Reading flow shouldn't be interrupted by an extra click for context. Hover-to-preview is the lower-friction interaction. Reserving click for the graph-focus action makes the click meaningful — it's the user choosing to leave the prose for the spatial view, not an accidental side effect of reading. |
| Decided By | UX |
| Category | UX Refinement |

### CL-049 — Persistent Copilot Bar with context-chip state machine

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S4 |
| Change | A Copilot bar is anchored at the bottom of the Playbook Reading panel at all times. Its content varies by state: (a) Quiet — sparkle icon + input field + send button; (b) Active — above the input bar, an expanding panel shows the Q&A with source chips and an "Anchored to [section title]" context chip. The bar does not float, hide, or scroll away. |
| UC Reference | UC-ON-02 step 7 (Persistent Copilot Bar) |
| Why | The Onboarder's reading is interrupted constantly by genuine questions ("what does this mean?" / "where would I find this?"). A floating-but-hidden chatbot would force a mode-switch every time. The persistent bar respects that questions are part of reading, not separate from it. The context chip ("Anchored to Payment Gateway timeout") makes the answer's frame explicit — the Onboarder knows the AI is reasoning about the section they're currently in, not the whole playbook. |
| Decided By | UX |
| Category | Visual System |

### CL-050 — Copilot answers cite sources as named chips, not URLs

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S4 |
| Change | When the Copilot returns an answer, the source citations render as small pill-shaped chips with the source name and a brief identifier (e.g., "Minh Lê's interview · 12:18", "Project Atlas docs"). The chips are clickable and navigate to the source. They are not raw URLs or document IDs. |
| UC Reference | UC-ON-02 step 7, BR-04 (source attribution) |
| Why | A citation is only useful if the reader can decide whether to trust it. "Minh Lê's interview · 12:18" tells the Onboarder both the source authority and the precision of the reference. A raw URL or document ID would force them to click before knowing whether it's worth clicking. The named chip lowers the cost of trust-checking without lowering its substance. |
| Decided By | UX |
| Category | UX Refinement |

### CL-051 — Spotlight Graph dims non-related nodes to 30% opacity

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S4 |
| Change | On the Playbook Reading right panel, when a section is active, the graph spotlights the most relevant entity (rose-bordered, larger circle) and the directly-related nodes (full opacity, normal styling). Non-related nodes are dimmed to 30% opacity — they remain visible to preserve spatial context, but they recede. Edges to non-related nodes match the dimming. |
| UC Reference | UC-ON-02 step 4 (Interactive Graph with Spotlight & Dimming) |
| Why | Hiding non-related nodes entirely would lose the user's sense of place in the graph (they're navigating a knowledge structure, not just a list of items). Dimming preserves the wayfinding signal without competing for attention. 30% opacity is enough to read shape but not enough to grab focus. The contrast between full-opacity related nodes and dimmed non-related ones makes the spotlight self-explanatory. |
| Decided By | UX |
| Category | Visual System |

### CL-052 — Restricted content card explains *what* is hidden and *why*

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S4 |
| Change | When a Playbook passage is masked by RBAC (UC-ON-02 EX.4), the placeholder card names the kind of content ("Vendor pricing details"), the specific access gap ("Level 4 access required · your access is Level 3"), and a reassurance about completeness ("The fix procedure above is complete without it"). The request-access CTA is present but not pushed. |
| UC Reference | UC-ON-02 EX.4 |
| Why | Three things matter when content is masked: knowing it exists, knowing why you can't see it, and knowing whether you actually need it. The card gives all three. The reassurance line ("The fix procedure above is complete without it") respects that the Onboarder might be reading mid-incident — they need to know whether the missing piece is a blocker or a curiosity before deciding to chase it. |
| Decided By | UX |
| Category | UX Refinement |

### CL-053 — Onboarder Dashboard card lists Hà Vy and Minh Lê by name

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S4 |
| Change | The primary Playbook card on Trần Hữu Nam's Day 1 Dashboard names both Hà Vy (Manager) and Minh Lê (Offboarder whose handover seeded the content) directly in the subtitle: "built from Minh Lê's verified handover" and the welcome line "Hà Vy and Minh Lê built this for you". |
| UC Reference | UC-ON-02 step 2 (welcome surface) |
| Why | Two named humans are a story the system isn't. Trần Hữu Nam reading "your playbook is ready" is reading a system notification. Reading "Hà Vy and Minh Lê built this for you" is being welcomed by colleagues. The naming costs nothing technically and produces an emotional foundation for the rest of the experience — Trần Hữu Nam is more likely to take the Critical items seriously knowing they came from a specific person who left them behind on purpose. |
| Decided By | UX |
| Category | UX Refinement |

---

---

## Sprint 1 v2 — Handover Initiation Rebuild

The S1 rebuild was prompted by a stakeholder request to (a) audit UC adherence strictly, (b) shift the brand palette to Purple primary + Pastel Yellow secondary, and (c) apply a modern-minimalism discipline to every component. The entries below supersede CL-008 (color palette) and add coverage for two UC paths the v1 missed.

### CL-054 — Color palette shifts to Violet primary + Pastel Yellow secondary (supersedes CL-008)

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 v2 |
| Change | The two-accent palette from CL-008 (amber + rose) is superseded by a four-color system with explicit role separation: **Violet (primary)** — brand identity, AI/system signal, Provenance Chip, primary CTAs, active states (uses Tailwind `violet-50` through `violet-700`); **Pastel Yellow (secondary)** — warning banners, knowledge gaps, "Manager priority" badges, soft attention markers (uses Tailwind `yellow-50` through `yellow-800`); **Rose (semantic, preserved)** — Critical severity only, recording indicator, unmistakable urgency; **Emerald (semantic, preserved)** — verified content only, success-progress checks. CL-008's "amber as signal" role transfers to violet; CL-008's "amber as warning" role transfers to pastel yellow. The previous overload of amber across both signal and warning is resolved. |
| UC Reference | Cross-cutting (CL-008 supersession) |
| Why | The amber-for-everything system muddied two distinct concepts (AI signal vs. user warning). Splitting them into Violet (signal/brand) and Yellow (warning/attention) gives each its own visual identity. Violet establishes a stronger brand presence — primary CTAs now carry the brand color rather than competing for the same dark-gray slot as every other enterprise app. Rose and Emerald are preserved because Critical and Verified are conceptually distinct enough to warrant their own colors — they remain rare by design. |
| Decided By | Stakeholder direction + UX |
| Category | Visual System |

### CL-055 — Primary CTAs carry the brand color

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 v2 |
| Change | All primary action buttons across S1 now use `bg-violet-600 hover:bg-violet-700 text-white` (was `bg-gray-900 hover:bg-gray-800`). Secondary actions remain neutral-gray outlined; tertiary (ghost) actions remain text-only. A three-tier button system is enforced through the `<PrimaryButton>`, `<SecondaryButton>`, and `<GhostButton>` components with consistent 32px height. |
| UC Reference | Cross-cutting |
| Why | Brand identity needs a load-bearing visual surface. Primary CTAs are the most frequent interaction; making them violet is the strongest single signal of the brand without color-painting unrelated parts of the UI. The three-tier button system codifies hierarchy: the user always knows which action is the primary path vs. a fallback. Consistent 32px height satisfies accessibility touch target minimums (44px is the Apple HIG recommendation; 32px is the floor for desktop pointer input, which is the v1 target). |
| Decided By | UX |
| Category | Visual System |

### CL-056 — RBAC scope failure state added to Setup Wizard (UC-HO-01 v2.0 EX.5)

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 v2 |
| Change | A new "Access scope unresolved" state on Screen 02 (Setup Wizard) renders when the directory query for the Offboarder fails (UC-HO-01 v2.0 EX.5). The state replaces the wizard form entirely with: a rose-toned header explaining the failure, a mono-formatted error reference (timestamp + UC-HO-01.EX.5 + the failed identifier), a 3-step ordered remediation guide, and Retry / Back-to-Dashboard actions. |
| UC Reference | UC-HO-01 v2.0 EX.5 (RBAC scope unresolvable) |
| Why | The v1 build was missing this exception path entirely. UC-HO-01 v2.0 made RBAC scope establishment a creation-time concern — when it fails, session creation halts, and the Manager needs to know exactly what to do. The error reference is mono-formatted because it's the thing IT support will ask for; the ordered remediation list is sequential because the most common cause (directory sync delay) is also the cheapest to try first. |
| Decided By | BA |
| Category | BA Gap |

### CL-057 — PII Override Request action added to High PII state (UC-HO-01 v2.0 AC.1)

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 v2 |
| Change | The High PII Exclusion banner on Screen 04 (Knowledge Map) now offers two parallel compensation actions instead of one: "Add priority prompts" (v1's only option) and "Request override review" (new). The two-action footer is visually unified into the yellow banner, making it clear they're peer options rather than a single recommendation. |
| UC Reference | UC-HO-01 v2.0 AC.1 (PII Override Request) |
| Why | The v1 build conflated "high PII detected" with "add manual prompts to compensate" — that's only one valid response. UC-HO-01 v2.0 AC.1 introduces a separate path: the Manager may believe the exclusions are overzealous and request a review by HR/Legal to potentially relax the classification rules. Offering both actions side-by-side respects the Manager's judgment about which response fits their situation. |
| Decided By | BA |
| Category | BA Gap |

### CL-058 — Empty "In progress · 0" section removed from Dashboard happy path

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 v2 |
| Change | The dashed "Nothing in progress right now" empty card on Screen 01's happy path is removed. Sections with zero items don't render. The "Pending" and "Recent activity" sections render directly without a stub for empty categories. |
| UC Reference | UC-HO-01 step 1 (Manager dashboard) |
| Why | An empty placeholder for a category that has nothing to show is visual noise that doesn't carry information. When the dashboard has data to show in that category, it'll appear; until then, its absence is information enough. Modern minimalism rule: every rendered component must carry weight, and an empty placeholder carries none. |
| Decided By | UX |
| Category | UX Refinement |

### CL-059 — Explicit focus rings on all interactive elements

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 v2 |
| Change | All buttons, inputs, checkboxes, and clickable tabs now carry an explicit focus state: `focus:outline-none focus:ring-2 focus:ring-violet-500/20` (or `/30` for primary actions). Text inputs use `focus:border-violet-400 focus:ring-2 focus:ring-violet-500/15` to combine border emphasis with a subtle ring. |
| UC Reference | Cross-cutting (accessibility) |
| Why | The v1 build relied on implicit browser focus rings, which Tailwind's `focus:outline-none` removed but didn't replace consistently. WCAG 2.1 SC 2.4.7 requires visible focus indicators on all interactive elements. The violet-tinted ring at low opacity reads as a brand-consistent focus signal without competing with active states. |
| Decided By | UX (accessibility) |
| Category | UX Refinement |

### CL-060 — AI-generated prompts use violet-tinted background

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 v2 |
| Change | On Screen 05, AI-generated prompts now render against a `bg-violet-50/40 border-violet-100` background (was `bg-gray-50/60 border-gray-200`). The Sparkles icon shifts from `text-amber-500` to `text-violet-600`. |
| UC Reference | UC-HO-05 step 3 (AI-generated prompts display) |
| Why | The AI-generated section needs visual differentiation from Manager-authored prompts because the editability model differs (read-only vs. editable). The violet-tinted background does this work non-verbally — the user reads "this section is AI" before they read the label. Tying AI signal to the brand color (violet) is consistent with CL-054. The Manager-authored Priority Prompts remain on neutral white, marking them visually as "yours to edit." |
| Decided By | UX |
| Category | Visual System |

### CL-061 — Audit Log Tile high-severity color shifts amber → yellow

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 v2 |
| Change | The Audit Log Tile component (S0) high-severity left-edge color changes from `rgb(245, 158, 11)` (amber-500) to `rgb(234, 179, 8)` (yellow-500). Critical (rose), Medium (gray), and Low (light gray) are unchanged. |
| UC Reference | S0 component update reflecting CL-054 |
| Why | The S0 component library inherits the new palette. High-severity audit entries now use the secondary brand color (yellow) consistent with warning banners and knowledge gaps across the system. |
| Decided By | UX |
| Category | Visual System |

### CL-062 — Knowledge gap dots replace icon, tighten visual rhythm

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 v2 |
| Change | The Likely Knowledge Gaps panel on Screen 04 now uses a 4px yellow dot as the bullet marker for each gap row (was a `lucide-react` AlertTriangle icon). The panel's section header is unchanged. |
| UC Reference | UC-HO-01 step 9 (preliminary knowledge map) |
| Why | The AlertTriangle icon was visually heavy and competed with the actual knowledge-gap copy. A small yellow dot is enough to mark each entry as a yellow-themed item belonging to the panel — the panel's amber/yellow border already establishes the category. The dot is the minimum viable bullet marker, which is the right answer when the surrounding context already carries the meaning. |
| Decided By | UX |
| Category | UX Refinement |

### CL-063 — Dashboard expanded to three concurrent pending sessions

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 v2 |
| Change | The Dashboard's Pending section renders three diverse offboarding sessions instead of one: Khánh Linh Trần (Head of People Operations · 2 days), Phương Anh Nguyễn (Senior Account Executive · 6 days), Minh Lê (Senior Backend Engineer · 12 days). Sort order is most-urgent-first to match scan behavior. The Recent Activity log is updated to show system detection events for the two new sessions. |
| UC Reference | UC-HO-01 step 1 (Manager dashboard) |
| Why | A dashboard rendering one pending session was honest only about one work pattern (engineering). Showing three concurrent sessions across Engineering, Sales, and People Operations demonstrates that the platform handles the full org-level diversity — different roles produce different handover material types, and Managers will rarely face just one departure at a time. The most-urgent-first ordering matches how Managers actually scan: by who needs attention soonest. |
| Decided By | Stakeholder request + BA |
| Category | UX Refinement |

### CL-064 — Pending Session Card surfaces data source diversity inline

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 v2 |
| Change | Each Pending Session Card now renders a row of source chips below the date/days line, showing the data sources connected for that session with the key metric. Example chip: `[GitBranch icon] Jira · 47 active tickets`. The icons differ per role (Briefcase for Salesforce, Users for HR system, GitBranch for Jira, etc.) and the labels include the relevant volume metric. Sources are pulled from the configured integrations for the offboarder's account. |
| UC Reference | UC-HO-01 step 4 (data source listing during seeding) |
| Why | Source diversity is the most consequential difference between handover sessions — engineering Jira tickets and HR system records require radically different seeding behavior, classification rules, and review carefulness. Surfacing source chips at the dashboard level lets the Manager mentally prep before clicking Initiate. The volume metric (47 tickets, 240 records, 38 deals) gives a quick sense of scope without requiring a click. Chips are visually quiet — neutral gray on gray-50 background — to avoid competing with the urgency signals. |
| Decided By | UX |
| Category | UX Refinement |

### CL-065 — Critical urgency (<3 days) earns rose left-border accent + Urgent pill

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S1 v2 |
| Change | Pending Session Cards with daysRemaining < 3 receive two additional treatments beyond the existing rose-tinted days text: (a) a 2px rose left-border accent on the card itself (mirrors the AuditLogTile severity-edge pattern from S0); (b) a small "Urgent" pill badge inline with the offboarder's name. Cards with daysRemaining 3-5 keep the rose days text only. Cards with daysRemaining > 5 stay fully neutral. |
| UC Reference | UC-HO-01 EX.2 (Notice Period Too Short) |
| Why | A single rose-tinted text element is easy to miss when three cards stack vertically. Layering three signals (left-border, pill badge, text color) for the truly urgent case makes it unmissable on first scan — and reusing the S0 left-border severity pattern keeps the visual grammar consistent across components (Audit Log Tile, Section Card, and now Pending Session Card all share the same edge-accent convention for severity). The 3-day threshold is the operational threshold from UC-HO-01 EX.2 itself, so the visual signal triggers at the same moment the system-level urgency triggers. |
| Decided By | UX |
| Category | Visual System |

### CL-080 — QA-INT-01 (Dual-Verification & Workflow Integration) adopted as foundational governance rule

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | System-level (above sprints) |
| Change | Rule QA-INT-01 introduced by Product Owner and adopted as foundational system governance. Full text saved at `/mnt/user-data/outputs/QA-INT-01-Dual-Verification-Rule.md`. Rule sits above individual sprint decisions and audits the system at the integrity level. All UCs, components, and sprints must honor it. Deviations require explicit Product Owner approval. |
| UC Reference | Cross-cutting (all UCs) |
| Why | The system needed explicit codification of its dual-verification commitment as a system-wide rule, not just a collection of per-UC behaviors. QA-INT-01 names the principle ("AI outputs are never treated as ground truth") and the mechanics (Surface the Source → HITL → Final Sign-off → Propagation → Lineage) as one coherent governance framework. Compliance audit performed concurrently — system is substantially compliant with 2 gaps and 1 refinement identified. |
| Decided By | Product Owner |
| Category | Visual System (governance) |

### CL-081 — Gap A: Canonical Fact surface needed (Sự thật gốc)

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S5 (recommended) |
| Change | QA-INT-01 clause 2.2 mandates a visible "Canonical Fact / Sự thật gốc" status distinct from the one-time "Verified" status. Current system has propagation logic but no visible distinction between "one human signed off" and "verified AND propagated system-wide as ground truth." Proposed: extend S0 Confidence Badge to support a `canonical` variant (emerald + Network glyph). Add `propagationStatus` to data model: `local | canonical | superseded`. Canonical badge clickable to open lineage drawer (closes Gap B). |
| UC Reference | QA-INT-01 clause 2.2 |
| Why | Without the Canonical surface, readers/Onboarders/Managers cannot distinguish content that has propagated as system-wide truth from content that has only been locally verified. The two are conceptually distinct per the rule and need visual differentiation. Severity: Medium · Cost: ~2 days. |
| Decided By | UX + BA |
| Category | BA Gap |

### CL-082 — Gap B: Per-item lineage view needed (reconsider CL-067 deferral)

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S5 (recommended, concurrent with Gap A) |
| Change | QA-INT-01 clause 2.3 mandates queryable lineage per knowledge item. Plan v2 CL-067 deferred dedicated Lineage UI to v2 — that deferral was made before QA-INT-01 was formalized and needs partial reversal. Proposed: minimum lineage visibility via per-item drawer reusing S0 AuditLogTile components scoped to one item's history. Not the full admin Lineage View (which remains deferred to v2), just a "View history" affordance on canonical items. |
| UC Reference | QA-INT-01 clause 2.3 · supersedes part of CL-067 |
| Why | The QA-INT-01 rule formally elevates lineage visibility from "admin power-user" to "MVP requirement." The minimum scope (per-item drawer reusing existing tiles) is achievable in 1.5 days and doesn't require new visual primitives. The full Lineage View UI remains deferred — only the minimum per-item visibility is being brought into MVP. |
| Decided By | UX + BA |
| Category | BA Gap |

### CL-083 — Refinement C: Inline edit diff visualization

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S2 v3 (recommended) |
| Change | QA-INT-01 clause 1.3 mandates side-by-side diff for discrepancies. Inline editing in HO-03 step 5-6 currently replaces text in-place without visual before/after for the user during the session. Audit trail captures both versions but the user doesn't see them. Proposed: original AI text shows greyed-out above the editable field during edit mode; small "Compare with original" affordance reveals before/after on demand after save. Component-level update to EditingDraftItem. |
| UC Reference | QA-INT-01 clause 1.3 · UC-HO-03 step 5-6 |
| Why | Minor compliance shortcoming — the data exists in the audit trail but isn't surfaced to the Offboarder during the verification work. Surfacing it costs ~0.5 days and reinforces the Glass-Box principle visually. |
| Decided By | UX |
| Category | UX Refinement |

### CL-084 — Canonical Fact badge implemented (closes Gap A from CL-081)

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S0 (component library extension) |
| Change | Added `CanonicalBadge` shared component to the System UI Tour artifact. Visual: emerald-50 background + emerald-300 border (slightly stronger than the standard Verified badge), Network icon, label "CANONICAL · Sự thật gốc" + History glyph indicating clickability. Wired in 3 places: (a) Feature 04 KG Commit complete — committed items are now framed as "47 items are now Canonical Facts" with propagation note; (b) Feature 06 Playbook Reading — Critical passage badge replaced from Verified → Canonical; (c) Feature 08 Feedback Loop Resolved — corrected passage explicitly promoted from Verified to Canonical to signal it has propagated. |
| UC Reference | QA-INT-01 §2.2 · closes CL-081 (Gap A) |
| Why | The Verified badge meant "one human signed off" — Canonical means "verified AND propagated as system ground truth across downstream modules." Per QA-INT-01 §2.2, these are distinct states and the reader should see the distinction. The badge sits above Verified in the trust hierarchy without replacing it — Verified still exists for items that have been signed off but not yet propagated. |
| Decided By | UX implementation of stakeholder-approved Gap A remediation |
| Category | Visual System |

### CL-085 — Lineage Drawer implemented (closes Gap B from CL-082)

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S0 (component library extension) |
| Change | Added `LineageDrawer` and `LineageEvent` shared components. Drawer is a 400px right-aligned overlay with a subtle backdrop blur, slides in over the reading surface. Renders 4 lineage event types from the audit trail: Created (Plus icon, gray) → Verified (CheckCircle2, emerald) → Committed (Database, violet) → Propagated (Network, emerald with highlighted treatment). Footer cites the QA-INT-01 §2.3 clause explicitly. Wired into Feature 06 Playbook Reading via a new 4th state `lineage` — selecting it shows the reading view with the drawer open over the Payment Gateway passage. |
| UC Reference | QA-INT-01 §2.3 · partial reversal of CL-067 (Plan v2 deferral) |
| Why | Plan v2 CL-067 deferred dedicated Lineage UI to v2 on the grounds it was admin power-user. QA-INT-01 §2.3 elevated that deferral by mandating queryable lineage per knowledge item. The drawer is the minimum implementation — reuses 4 standard lineage event types and the existing Audit Log Tile visual grammar. No new design primitives; just composition. Full admin Lineage View remains deferred. |
| Decided By | UX implementation of stakeholder-approved Gap B remediation |
| Category | BA Gap (resolved) |

### CL-086 — Inline Edit Diff implemented (closes Refinement C from CL-083)

| Field | Value |
|---|---|
| Date | 2026-05-22 |
| Sprint | S2 v2 (component-level update to Review Workspace) |
| Change | Updated `DraftItemEditing` component in Feature 03 Review & Sign. When edit mode is entered, the original AI-generated text now renders in a greyed-out, strikethrough panel above the editable field with the label "Original · AI-generated" and a Sparkles icon. The editable inputs sit below under a "Your correction" label. A `GitCompare` icon in the top-right corner marks the diff mode visually. Footer note reads "Both versions preserved in immutable audit trail (QA-INT-01 §1.3)" to surface the rule citation directly. The example correction was also tightened — the AI suggested a flat 4-hour SLA window; the user correction differentiates P1 (4-hour) from P2/P3 (1 business day) with a 2x penalty — demonstrating a meaningful before/after diff worth visualizing. |
| UC Reference | QA-INT-01 §1.3 · UC-HO-03 step 5-6 |
| Why | The audit trail already captured both versions internally, but the Offboarder doing the edit work couldn't see what they were changing. The diff visualization makes the verification work concrete — the user sees AI's claim, sees their correction, and the gap between them is visible during the work, not just queryable afterward. Aligns Glass-Box principle with what the user actually experiences. |
| Decided By | UX implementation of stakeholder-approved Refinement C |
| Category | UX Refinement |

---

## Pending Decisions (Need Stakeholder Input)

The defaults in CL-003, CL-004, and CL-005 are working assumptions. The following decisions remain open and should be confirmed before their respective sprints begin:

| Item | Default Taken | Target Sprint | Decision Owner |
|---|---|---|---|
| Production vs Hackathon mode | Hackathon-compressed | — (cross-cutting) | Stakeholder |
| HO-01 legal scanning basis | Vietnam PDPA | S1 | Legal |
| HO-01 Offboarder Knowledge Map view rights | Deferred to v2 | S1 | Legal / HR |
| HO-03 e-signature standard | Vietnam local | S2 | Legal |
| ON-01 Playbook delivery model | Static + Copilot overlay | S4 | Product / UX |
| ON-02 mobile parity scope | Desktop-first v1 | S4 | Product / UX |

---

*Maintained throughout build. Append-only.*
