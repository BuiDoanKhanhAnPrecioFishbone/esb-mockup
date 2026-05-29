"use client";

import React, { useState } from "react";
import {
  ChevronLeft, ChevronRight, Check, X, AlertTriangle, AlertCircle, Info,
  Plus, Pencil, Trash2, Sparkles, ArrowRight, ArrowUpRight, GripVertical,
  ShieldCheck, ShieldAlert, Tag, MessageSquare, Hash, Send, FileText,
  CheckCircle2, ExternalLink, Lightbulb
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   UC-HO-05 v0.1 DRAFT · Configure Handover Interview Prompts

   ⚠️  This mockup is paired with the v0.1 DRAFT spec at
   docs/arteep/UC-HO-05_configure-interview-prompts_v0.1-draft.md
   Both are Claude-drafted from inference, not yet reviewed by Tram.
   Treat as a thinking aid, not as canonical product direction.

   Five screens covering the Priority Prompts flow:

     1. Entry  — empty draft list + 3 AI suggestions on violet bg
     2. Pass   — composer with safety check returning Pending review
     3. EX.1   — composer with safety check rejection (named category)
     4. List   — draft list with 3 prompts; cap reached
     5. Done   — confirmation surface with UC-HO-02 queue preview

   Scenario throughout: Hà Vy adding priority prompts for Minh Lê's
   handover interview, seeded by the knowledge gaps from his
   UC-HO-01 Preliminary Knowledge Map.

   Honors the locked S1 v2 visual system:
     · CL-018 sentence-shaped composer placeholder
     · CL-019 policy-violation messages name the category first
     · CL-022 "AI asked" / "AI suggested" eyebrow convention
     · CL-054 violet primary + pastel yellow secondary
     · CL-055 primary CTA brand color · 32px button height
     · CL-059 explicit focus rings
     · CL-060 AI-suggested prompts on bg-violet-50/40 with Sparkles
   ═══════════════════════════════════════════════════════════════════ */

const FLOW = [
  { id: "entry",   label: "Entry · AI suggestions",      trigger: "Manager opens the Priority Prompts surface from the Knowledge Map next-actions card." },
  { id: "pass",    label: "Safety check · pass",         trigger: "Manager added a prompt to the composer · safety check returned Pending review." },
  { id: "reject",  label: "Safety check · rejection",    trigger: "Manager wrote a prompt that violates the content policy · EX.1." },
  { id: "list",    label: "Draft list · cap reached",    trigger: "3 prompts in the draft list · the BR-01 cap is now visible to the Manager." },
  { id: "done",    label: "Injected into interview queue", trigger: "Prompts confirmed · queue updated · UC-HO-02 will surface them next." },
];

const SCENARIO = {
  manager: "Hà Vy",
  offboarder: "Minh Lê",
  role: "Senior Backend Engineer",
  dept: "Engineering",
  successor: "Trần Hữu Nam",
};

export default function UCHO05ConfigurePromptsDraft() {
  const [stepIdx, setStepIdx] = useState(0);
  const step = FLOW[stepIdx];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      <DraftBanner />
      <TopBar step={step} stepIdx={stepIdx} onJump={setStepIdx} />
      <main className="flex-1">
        <StepRenderer id={step.id} />
      </main>
      <FooterNav stepIdx={stepIdx} step={step} onChange={setStepIdx} />
    </div>
  );
}

/* ─── Draft banner (v0.1 indicator) ──────────────────────────── */

function DraftBanner() {
  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-5 py-1.5 flex items-center justify-between gap-3 text-[11px]">
      <div className="flex items-center gap-2 min-w-0">
        <AlertTriangle className="w-3.5 h-3.5 text-yellow-700 shrink-0" strokeWidth={1.75} />
        <span className="text-yellow-900 truncate">
          <strong>v0.1 DRAFT</strong> · Claude-drafted from inference. UC-HO-05 spec is not yet reviewed by the BA — treat as a thinking aid.
        </span>
      </div>
      <span className="text-yellow-800/70 shrink-0 hidden sm:inline" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
        UC-HO-05 v0.1
      </span>
    </div>
  );
}

/* ─── Chrome ────────────────────────────────────────────────── */

function TopBar({ step, stepIdx, onJump }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="px-5 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
          <span className="text-gray-900 font-semibold tracking-[0.18em] text-xs" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>ART-EEP</span>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-gray-500 text-xs">UC-HO-05 · Configure interview prompts</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-gray-500 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
          <span className="uppercase tracking-wider font-semibold text-violet-700">Priority prompts</span>
          <span className="text-gray-300">·</span>
          <span className="text-gray-700" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>v0.1</span>
        </div>
      </div>

      <div className="px-5 pb-2 flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-sm font-semibold text-gray-900 truncate">
            {stepIdx + 1} of {FLOW.length} · {step.label}
          </h1>
          <p className="text-[11px] text-gray-500 mt-0.5 truncate">
            Scenario · <span className="text-gray-700 font-medium">{SCENARIO.manager}</span> · configuring prompts for {SCENARIO.offboarder}'s handover
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {FLOW.map((s, i) => (
            <StepDot key={s.id} idx={i + 1} active={i === stepIdx} onClick={() => onJump(i)} title={s.label} />
          ))}
        </div>
      </div>
    </header>
  );
}

function StepDot({ idx, active, onClick, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-7 h-7 rounded-md border text-[11px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${
        active
          ? "bg-violet-600 text-white border-violet-600"
          : "bg-white text-violet-700 border-violet-200 hover:border-violet-400"
      }`}
      style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
    >
      {idx}
    </button>
  );
}

function FooterNav({ stepIdx, step, onChange }) {
  const atFirst = stepIdx === 0;
  const atLast = stepIdx === FLOW.length - 1;
  return (
    <footer className="bg-white border-t border-gray-200 px-5 py-2.5 flex items-center justify-between sticky bottom-0 z-20">
      <button
        onClick={() => !atFirst && onChange(stepIdx - 1)}
        disabled={atFirst}
        className={`h-8 px-3 rounded-md text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${
          atFirst ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        Previous
      </button>

      <div className="hidden sm:block text-[11px] text-gray-500 max-w-md text-center truncate px-3">
        {step.trigger}
      </div>

      <button
        onClick={() => !atLast && onChange(stepIdx + 1)}
        disabled={atLast}
        className={`h-8 px-3 rounded-md text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30 ${
          atLast ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-700 text-white"
        }`}
      >
        Next
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </footer>
  );
}

function StepRenderer({ id }) {
  if (id === "entry")  return <EntryScreen />;
  if (id === "pass")   return <SafetyPassScreen />;
  if (id === "reject") return <SafetyRejectScreen />;
  if (id === "list")   return <DraftListScreen />;
  if (id === "done")   return <ConfirmationScreen />;
  return null;
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 1 · ENTRY · AI SUGGESTIONS
   ═══════════════════════════════════════════════════════════════════ */

function EntryScreen() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader
        eyebrow="Priority prompts · steps 1–2"
        title={`Add priority prompts for ${SCENARIO.offboarder}'s interview`}
        subtitle={`Steer the AI questioning toward what matters most for ${SCENARIO.successor}. Up to 3 prompts per session.`}
        actor={`${SCENARIO.manager} · Manager · ${SCENARIO.dept}`}
      />

      <Banner tone="muted" icon={Info}>
        Each prompt passes a content-policy safety check before entering the interview queue. {SCENARIO.offboarder} will see them with a <strong>Manager Priority</strong> badge during the interview — not before.
      </Banner>

      <FormSection
        title="AI-suggested prompts"
        subtitle={`Drafted from ${SCENARIO.offboarder}'s likely knowledge gaps. Use as-is, edit, or skip.`}
      >
        <div className="space-y-2.5">
          <SuggestionCard
            gap="Payment Gateway timeout"
            gapDetail="Recurring incidents · no runbook · 4 tickets in 6 months"
            prompt="Walk through the symptoms you look for and the fix you've used to resolve Payment Gateway timeout incidents. Include the rollback step if needed."
          />
          <SuggestionCard
            gap="Vendor XYZ renewal · SLA terms"
            gapDetail="Heavy email traffic · no project page captures the negotiated penalty clause"
            prompt="Explain the penalty clause you negotiated in the Vendor XYZ renewal, and the trigger condition for pricing renegotiation."
          />
          <SuggestionCard
            gap="Project Atlas · rollback procedure"
            gapDetail="Mentioned in three tickets · never documented anywhere central"
            prompt="Describe the Project Atlas rollback procedure end-to-end, including the manual steps that aren't in any runbook."
          />
        </div>
      </FormSection>

      <FormSection title="Write your own" subtitle={`Optional · max ${remainingSlots(0)} more prompts can be added.`}>
        <textarea
          placeholder="Add a focus area — for example, 'Probe deeply on the renewal negotiation with Vendor XYZ.'"
          className="w-full min-h-[80px] px-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/15 transition-colors resize-none"
          style={{ fontFamily: "inherit" }}
        />
        <div className="flex items-center justify-between mt-2">
          <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3" />
            Safety check runs on save · usually under 2 seconds.
          </div>
          <PrimaryButton>
            <Plus className="w-3 h-3" />
            Add to draft list
          </PrimaryButton>
        </div>
      </FormSection>

      <div className="border-t border-gray-200 pt-3 mt-2 flex items-center justify-between text-[11px] text-gray-500">
        <div className="flex items-center gap-2">
          <Hash className="w-3 h-3" />
          <span>Draft list · <strong className="text-gray-900">0 of 3</strong> prompts</span>
        </div>
        <div style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
          Last edit · — · session not yet configured
        </div>
      </div>
    </div>
  );
}

function SuggestionCard({ gap, gapDetail, prompt }) {
  return (
    <article className="rounded-lg border border-violet-200 bg-violet-50/40 p-3.5">
      <div className="flex items-start gap-2.5 mb-2">
        <Sparkles className="w-3.5 h-3.5 text-violet-600 shrink-0 mt-0.5" strokeWidth={1.75} />
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-[0.2em] text-violet-700 font-semibold mb-0.5">AI suggested · from a knowledge gap</div>
          <h4 className="text-xs font-semibold text-gray-900">{gap}</h4>
          <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{gapDetail}</p>
        </div>
      </div>
      <p className="text-sm text-gray-900 leading-relaxed mb-3 pl-6">{prompt}</p>
      <div className="flex items-center gap-2 pl-6">
        <PrimaryButton>
          Use this prompt
          <ArrowRight className="w-3 h-3" />
        </PrimaryButton>
        <GhostButton>Edit first</GhostButton>
        <GhostButton>Dismiss</GhostButton>
      </div>
    </article>
  );
}

function remainingSlots(used) {
  return 3 - used;
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 2 · COMPOSER · SAFETY CHECK PASS
   ═══════════════════════════════════════════════════════════════════ */

function SafetyPassScreen() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader
        eyebrow="Priority prompts · step 4 · safety check"
        title="Safety check passed"
        subtitle="The prompt is cleared to enter the draft list. Review the wording, then add it."
        actor={`${SCENARIO.manager} · Manager · ${SCENARIO.dept}`}
      />

      <FormSection title="Your prompt" subtitle="Edited from the Payment Gateway suggestion.">
        <textarea
          defaultValue="Walk me through the Payment Gateway timeout fix you actually use — not the one in the docs. Include how you decide to rollback vs. patch in place. We've had 4 incidents in 6 months and the runbook doesn't match what you do in practice."
          className="w-full min-h-[100px] px-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/15 transition-colors resize-none"
          style={{ fontFamily: "inherit" }}
        />
      </FormSection>

      <FormSection title="Safety check result" subtitle="Per the content policy ruleset · check completes in under 2 seconds.">
        <article className="rounded-lg border border-emerald-200 bg-emerald-50/30 p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-md bg-white border border-emerald-200 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-700" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="text-sm font-semibold text-gray-900">Cleared to add</h3>
                <span className="text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700">Pending review</span>
                <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>1.2s</span>
              </div>
              <p className="text-[12px] text-gray-700 leading-relaxed">
                The prompt focuses on work-specific knowledge transfer. No protected-characteristic content, no requests for personal opinions about colleagues, no out-of-scope confidential asks.
              </p>
              <ul className="mt-2 space-y-1 text-[11px] text-gray-600">
                <CheckRow>Work-focused — asks about an incident response procedure</CheckRow>
                <CheckRow>Names a specific system, not a person's character</CheckRow>
                <CheckRow>Within {SCENARIO.offboarder}'s documented scope</CheckRow>
              </ul>
            </div>
          </div>
        </article>
      </FormSection>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <GhostButton>Cancel</GhostButton>
          <GhostButton>Re-edit</GhostButton>
        </div>
        <PrimaryButton>
          <Plus className="w-3 h-3" />
          Add to draft list
        </PrimaryButton>
      </div>

      <p className="text-[11px] text-gray-500 mt-5 leading-relaxed">
        <span className="text-gray-700 font-medium">After you add ·</span> the prompt enters your draft list at the next available position. You can still edit, reorder, or remove it before injecting the list into the interview queue.
      </p>
    </div>
  );
}

function CheckRow({ children }) {
  return (
    <li className="flex items-start gap-1.5">
      <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 3 · COMPOSER · SAFETY CHECK REJECTION (EX.1)
   ═══════════════════════════════════════════════════════════════════ */

function SafetyRejectScreen() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader
        eyebrow="Priority prompts · EX.1 · safety check rejection"
        title="This prompt can't be added"
        subtitle="The content-policy check flagged a specific concern. You can rephrase or write something different."
        actor={`${SCENARIO.manager} · Manager · ${SCENARIO.dept}`}
      />

      <FormSection title="Your prompt" subtitle="Held in the composer for you to edit.">
        <textarea
          defaultValue={`Ask ${SCENARIO.offboarder} what he really thinks of his teammate's coding style — we've had friction and ${SCENARIO.successor} should know what he's walking into personality-wise.`}
          className="w-full min-h-[100px] px-3 py-2 rounded-md border border-rose-200 bg-rose-50/30 text-sm text-gray-900 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/15 transition-colors resize-none"
          style={{ fontFamily: "inherit" }}
        />
      </FormSection>

      <FormSection title="Why this was flagged" subtitle="Per the content policy · CL-019 rejection pattern.">
        <article className="rounded-lg border border-rose-200 bg-white overflow-hidden" style={{ borderLeft: "2px solid rgb(244, 63, 94)" }}>
          <div className="px-4 py-3 border-b border-gray-100 bg-rose-50/30 flex items-start gap-3">
            <div className="w-9 h-9 rounded-md bg-white border border-rose-200 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4 text-rose-700" strokeWidth={1.75} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="text-sm font-semibold text-gray-900">Asks for personal opinions about colleagues</h3>
                <span className="text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold bg-rose-50 border border-rose-200 text-rose-700">Category</span>
              </div>
              <p className="text-[12px] text-gray-700 leading-relaxed">
                The prompt asks {SCENARIO.offboarder} to evaluate another person's character and behavior. Handover interviews are scoped to work knowledge — the personal-dynamics framing puts the interview, the audit trail, and {SCENARIO.successor} in a difficult position.
              </p>
            </div>
          </div>

          <div className="px-4 py-3.5">
            <div className="flex items-start gap-2.5 mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-violet-600 shrink-0 mt-0.5" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-[0.2em] text-violet-700 font-semibold mb-1">Try rephrasing around the work</div>
                <p className="text-[12px] text-gray-700 leading-relaxed">
                  If there's a working-style or collaboration concern that affects the role, frame it as a process question rather than a character question. For example:
                </p>
                <blockquote className="mt-2 pl-3 border-l-2 border-violet-200 bg-violet-50/40 py-1.5 pr-3 rounded-r">
                  <p className="text-[12px] text-gray-800 italic leading-relaxed">
                    "What collaboration patterns have worked best for code review on this team, and which ones have caused friction? What should {SCENARIO.successor} keep doing or change when working with each direct collaborator?"
                  </p>
                </blockquote>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
              <a className="text-[11px] text-violet-700 hover:text-violet-900 inline-flex items-center gap-1 cursor-pointer">
                Read the full prompt policy
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
                policy-trace · personal-opinions · 2026-05-29T15:04Z
              </span>
            </div>
          </div>
        </article>
      </FormSection>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <GhostButton>Discard prompt</GhostButton>
        <div className="flex items-center gap-2">
          <SecondaryButton>
            <Pencil className="w-3 h-3" />
            Rephrase
          </SecondaryButton>
          <SecondaryButton>
            Use the suggested rephrase
            <ArrowRight className="w-3 h-3" />
          </SecondaryButton>
        </div>
      </div>

      <p className="text-[11px] text-gray-500 mt-5 leading-relaxed">
        <span className="text-gray-700 font-medium">For the audit log ·</span> only the category code and a hash of the rejected text are stored. The text itself isn't retained, by design — we don't want a permanent record of content the policy flagged.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 4 · DRAFT LIST · CAP REACHED
   ═══════════════════════════════════════════════════════════════════ */

function DraftListScreen() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader
        eyebrow="Priority prompts · step 5 · review draft list"
        title="Review your draft list"
        subtitle="Reorder, edit, or remove. When you're ready, inject the list into the interview queue."
        actor={`${SCENARIO.manager} · Manager · ${SCENARIO.dept}`}
      />

      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] text-gray-500 flex items-center gap-2">
          <Hash className="w-3 h-3" />
          Draft list · <strong className="text-gray-900">3 of 3</strong> prompts · cap reached
        </div>
        <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
          Last edit · {SCENARIO.manager} · 3 minutes ago
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <DraftPromptCard
          n={1}
          source="Edited from AI suggestion · Payment Gateway timeout"
          text="Walk me through the Payment Gateway timeout fix you actually use — not the one in the docs. Include how you decide to rollback vs. patch in place. We've had 4 incidents in 6 months and the runbook doesn't match what you do in practice."
          status="Pending review"
          checkTime="1.2s"
        />
        <DraftPromptCard
          n={2}
          source="AI suggestion · Vendor XYZ renewal SLA"
          text="Explain the penalty clause you negotiated in the Vendor XYZ renewal, and the trigger condition for pricing renegotiation."
          status="Pending review"
          checkTime="0.9s"
        />
        <DraftPromptCard
          n={3}
          source="Manager-authored · re-rephrased after EX.1"
          text="What collaboration patterns have worked best for code review on this team, and which have caused friction? What should Trần Hữu Nam keep doing or change when working with each direct collaborator?"
          status="Pending review"
          checkTime="1.7s"
        />
      </div>

      <article className="rounded-lg border border-yellow-200 bg-yellow-50/40 p-3 mb-5 flex items-start gap-2.5">
        <div className="w-1 h-1 rounded-full bg-yellow-500 mt-2 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[12px] text-yellow-900 leading-relaxed">
            <strong>You've reached the 3-prompt limit for this session.</strong>{" "}
            Remove or merge an existing prompt to add a new one. The cap protects {SCENARIO.offboarder}'s interview from feeling over-scripted.
          </p>
        </div>
      </article>

      <button
        disabled
        className="w-full h-10 rounded-md border border-dashed border-gray-300 bg-gray-50/30 text-sm text-gray-400 inline-flex items-center justify-center gap-1.5 cursor-not-allowed mb-5"
      >
        <Plus className="w-3.5 h-3.5" />
        Add prompt · disabled · remove one to make room
      </button>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <GhostButton>Save and exit · keep editing later</GhostButton>
        <PrimaryButton>
          <Send className="w-3 h-3" />
          Inject 3 prompts into interview queue
        </PrimaryButton>
      </div>

      <p className="text-[11px] text-gray-500 mt-5 leading-relaxed">
        <span className="text-gray-700 font-medium">On inject ·</span> the queue updates within 30 seconds if the interview is already live. Once {SCENARIO.offboarder} hears a prompt as an AI question, that prompt is locked (BR-04) — only logged from then on, not editable.
      </p>
    </div>
  );
}

function DraftPromptCard({ n, source, text, status, checkTime }) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-colors">
      <div className="px-4 py-3 flex items-start gap-3">
        <GripVertical className="w-3.5 h-3.5 text-gray-300 shrink-0 mt-1 cursor-grab" />
        <div className="w-5 h-5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-[10px] font-semibold inline-flex items-center justify-center shrink-0 mt-0.5" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{n}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium">{source}</span>
            <span className="text-gray-300">·</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 inline-flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5" />
              {status}
            </span>
            <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{checkTime}</span>
          </div>
          <p className="text-sm text-gray-900 leading-relaxed">{text}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <IconButton title="Edit"><Pencil className="w-3 h-3" /></IconButton>
          <IconButton title="Remove"><Trash2 className="w-3 h-3" /></IconButton>
        </div>
      </div>
    </article>
  );
}

function IconButton({ title, children }) {
  return (
    <button title={title} className="w-7 h-7 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 5 · CONFIRMATION · INJECTED INTO QUEUE
   ═══════════════════════════════════════════════════════════════════ */

function ConfirmationScreen() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader
        eyebrow="Priority prompts · steps 6–7 · injected"
        title="Done"
        subtitle="The interview queue is updated. Audit trail extended."
        actor={`${SCENARIO.manager} · Manager · ${SCENARIO.dept}`}
      />

      <div className="rounded-lg border border-emerald-200 bg-emerald-50/30 p-4 mb-6 flex items-start gap-3">
        <div className="w-9 h-9 rounded-md bg-white border border-emerald-200 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900">3 priority prompts added to {SCENARIO.offboarder}'s interview queue</h3>
          <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
            They'll appear with a <strong>Manager Priority</strong> badge when the AI surfaces them. {SCENARIO.offboarder} won't see them pre-interview — only when each one becomes an AI question.
          </p>
        </div>
      </div>

      <FormSection title="What this looks like in the interview" subtitle={`Preview of how a priority prompt surfaces in UC-HO-02 · CL-022 'AI asked' eyebrow convention with the Manager Priority badge.`}>
        <article className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/40 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium">Preview · UC-HO-02 interview view</span>
            <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>Topic 3 of 7 · Payment Gateway</span>
          </div>
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-violet-50 border border-violet-200 flex items-center justify-center shrink-0">
                <Sparkles className="w-3 h-3 text-violet-600" strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-violet-700 font-semibold">AI asked</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold bg-yellow-50 border border-yellow-200 text-yellow-800 inline-flex items-center gap-1">
                    <Tag className="w-2.5 h-2.5" />
                    Manager priority
                  </span>
                  <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>12:18</span>
                </div>
                <p className="text-sm text-gray-900 leading-relaxed">
                  Walk me through the Payment Gateway timeout fix you actually use — not the one in the docs. Include how you decide to rollback vs. patch in place.
                </p>
              </div>
            </div>
          </div>
        </article>
      </FormSection>

      <FormSection title="What was logged" subtitle="Immutable audit · UC-HO-05 v0.1 SR.A.1.">
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <AuditEntry
            event="prompts.injected"
            detail="3 prompts written to interview queue · positions 1–3"
            ts="2026-05-29 15:08:42"
          />
          <AuditEntry
            event="prompts.safety_passed"
            detail="3 of 3 prompts cleared the content-policy check"
            ts="2026-05-29 15:08:40"
          />
          <AuditEntry
            event="prompts.safety_rejected"
            detail="1 prompt rejected · category personal-opinions · rephrased and re-submitted"
            ts="2026-05-29 15:06:18"
            last
          />
        </div>
      </FormSection>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <SecondaryButton>
          <FileText className="w-3 h-3" />
          View prompt queue in UC-HO-02
        </SecondaryButton>
        <PrimaryButton>
          Done · back to session dashboard
          <ArrowUpRight className="w-3.5 h-3.5" />
        </PrimaryButton>
      </div>

      <p className="text-[11px] text-gray-500 mt-5 leading-relaxed">
        <span className="text-gray-700 font-medium">Live injection ·</span> if {SCENARIO.offboarder}'s interview were running right now, these prompts would propagate to the queue within 30 seconds (SR.P.1). They'd surface at the next AI turn with the Manager Priority badge.
      </p>
    </div>
  );
}

function AuditEntry({ event, detail, ts, last }) {
  return (
    <div className={`px-3 py-2 ${!last ? "border-b border-gray-100" : ""}`}>
      <div className="flex items-center justify-between gap-3 mb-0.5">
        <span className="text-[10px] text-violet-700 font-semibold uppercase tracking-wider" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{event}</span>
        <span className="text-[10px] text-gray-500 shrink-0" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{ts}</span>
      </div>
      <div className="text-[11px] text-gray-700 leading-relaxed">{detail}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Shared primitives
   ═══════════════════════════════════════════════════════════════════ */

function PageHeader({ eyebrow, title, subtitle, actor }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        {eyebrow && <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">{eyebrow}</span>}
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight mt-1">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1 leading-relaxed">{subtitle}</p>}
      </div>
      {actor && <span className="text-[11px] text-gray-500 shrink-0 pt-1">{actor}</span>}
    </div>
  );
}

function FormSection({ title, subtitle, children }) {
  return (
    <section className="mb-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      {subtitle && <p className="text-[12px] text-gray-500 mb-2.5 leading-relaxed">{subtitle}</p>}
      {children}
    </section>
  );
}

function Banner({ tone, icon: Icon, children }) {
  const cfg = {
    warning: { cls: "border-yellow-200 bg-yellow-50/60", iconCls: "text-yellow-700", textCls: "text-yellow-900" },
    muted:   { cls: "border-gray-200 bg-gray-50/60",     iconCls: "text-gray-500",   textCls: "text-gray-700"   },
  }[tone];
  return (
    <div className={`rounded-md border ${cfg.cls} px-3 py-2.5 mb-5 flex items-start gap-2`}>
      <Icon className={`w-4 h-4 ${cfg.iconCls} shrink-0 mt-0.5`} strokeWidth={1.75} />
      <div className={`text-[12px] ${cfg.textCls} leading-relaxed flex-1`}>{children}</div>
    </div>
  );
}

function PrimaryButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="h-8 px-3 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30"
    >
      {children}
    </button>
  );
}

function SecondaryButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="h-8 px-3 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20"
    >
      {children}
    </button>
  );
}

function GhostButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="h-8 px-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 text-xs font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20"
    >
      {children}
    </button>
  );
}
