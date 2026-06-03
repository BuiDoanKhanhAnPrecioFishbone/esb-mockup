"use client";

import React, { useState } from "react";
import {
  ChevronLeft, ChevronRight, Pause, Play, X, Mic, MicOff, Type,
  ChevronUp, ChevronDown, Sparkles, AlertCircle, AlertTriangle, Clock,
  ArrowRight, Check, MessageSquare, Volume2, HelpCircle, Loader2,
  Save, MoreHorizontal, Tag, Hourglass
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   UC-HO-02 · Interview Canvas — Sprint 2 · Offboarder focus surface

   The Offboarder's dedicated voice-interview workspace. Architecturally
   isolated from the Manager / HR plane · lives in /me/handover/[id]/
   interview · zero AppShell, zero sidebar, zero session enumeration.

   8 clickable states walking the full focus-mode lifecycle:

     S1 · Just begun · first question · ready to speak
     S2 · Mid-recording · question 3 of 6 · waveform active
     S3 · Manager Priority Prompt arrives inline
     S4 · Live transcript drawer expanded
     S5 · Paused · checkpoint saved
     S6 · 5-minute soft warning · wrapping up
     S7 · Final question · last domain
     S8 · Ending · saving + transitioning to review

   Honors the locked S1 v2 visual system, plus three new design
   moves specific to the Offboarder plane:

     · OffboarderShell · stripped chrome · no sidebar / no team nav
     · CL-009 recording rings · rose triple-pulse · ONLY animation
       allowed in this surface (the canvas is otherwise still)
     · Manager Priority Prompts inline · violet Sparkles eyebrow
       labeled "[Manager's name]'s priority" · CL-022 "AI asked"
       pattern but with attributed origin

   Canonical scenario · Minh Lê interviewing about his 6 domains ·
   Hà Vy is the Manager · Trần Hữu Nam is the successor.
   ═══════════════════════════════════════════════════════════════════ */

const FLOW = [
  { id: "s1", uc: "Step 1", label: "Just begun · first question",        trigger: "Minh Lê clicks Begin interview · mic activates · AI poses the opening question." },
  { id: "s2", uc: "Step 2", label: "Mid-recording · topic 3 of 6",       trigger: "14 minutes in · third domain · waveform active · live transcript collapsed." },
  { id: "s3", uc: "Step 3", label: "Manager priority arrives inline",     trigger: "Hà Vy added a priority prompt via UC-HO-05 · inserted at the next pause." },
  { id: "s4", uc: "Step 4", label: "Live transcript expanded",            trigger: "Minh Lê pulls the transcript drawer up to verify accuracy." },
  { id: "s5", uc: "Step 5", label: "Paused · checkpoint saved",           trigger: "Minh Lê paused at 18:42 · pipeline holds · resume when ready." },
  { id: "s6", uc: "Step 6", label: "5-minute soft warning",               trigger: "At the 40-minute mark · Planner shifts to closing under-covered domains." },
  { id: "s7", uc: "Step 7", label: "Final question · last domain",        trigger: "Topic 6 of 6 · wrap-up question · then end interview." },
  { id: "s8", uc: "Step 8", label: "Ending · saving + transitioning",     trigger: "Minh Lê clicks End interview · Whisper finalizes transcript · routes to review." },
];

const SESSION = {
  offboarder: "Minh Lê",
  initials: "ML",
  manager: "Hà Vy",
  managerFirst: "Hà Vy",
  successor: "Trần Hữu Nam",
  totalTopics: 6,
  targetMin: 45,
  hardStopMin: 60,
};

export default function UCHO02InterviewCanvas() {
  const [stepIdx, setStepIdx] = useState(0);
  const step = FLOW[stepIdx];
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      <DevChrome step={step} stepIdx={stepIdx} onJump={setStepIdx} />
      <main className="flex-1 flex flex-col bg-white border-x border-gray-200 shadow-sm max-w-[1400px] w-full mx-auto">
        <StateRenderer id={step.id} />
      </main>
      <DevFooterNav stepIdx={stepIdx} step={step} onChange={setStepIdx} />
    </div>
  );
}

/* ─── Dev-only chrome · for navigating states · NOT part of the real surface ─── */

function DevChrome({ step, stepIdx, onJump }) {
  return (
    <header className="bg-gray-50 border-b border-gray-200 sticky top-0 z-30">
      <div className="px-5 py-2 flex items-center justify-between gap-4 max-w-[1400px] mx-auto w-full">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
          <span className="text-gray-900 font-semibold tracking-[0.18em] text-xs" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>ART-EEP</span>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-gray-500 text-xs">UC-HO-02 · Interview canvas · Offboarder plane</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-gray-500 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          <span className="uppercase tracking-wider font-semibold text-rose-700">Focus mode</span>
          <span className="text-gray-300">·</span>
          <span className="text-gray-700" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{step.uc}</span>
        </div>
      </div>
      <div className="px-5 pb-2 flex items-center justify-between gap-4 max-w-[1400px] mx-auto w-full">
        <div className="min-w-0 flex-1">
          <h1 className="text-sm font-semibold text-gray-900 truncate">
            {stepIdx + 1} of {FLOW.length} · {step.label}
          </h1>
          <p className="text-[11px] text-gray-500 mt-0.5 truncate">{step.trigger}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0 flex-wrap">
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
        active ? "bg-rose-600 text-white border-rose-600" : "bg-white text-rose-700 border-rose-200 hover:border-rose-400"
      }`}
      style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
    >
      {idx}
    </button>
  );
}

function DevFooterNav({ stepIdx, step, onChange }) {
  const atFirst = stepIdx === 0;
  const atLast = stepIdx === FLOW.length - 1;
  return (
    <footer className="bg-gray-50 border-t border-gray-200 px-5 py-2 flex items-center justify-between sticky bottom-0 z-30">
      <button
        onClick={() => !atFirst && onChange(stepIdx - 1)}
        disabled={atFirst}
        className={`h-7 px-3 rounded-md text-xs font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${
          atFirst ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <ChevronLeft className="w-3 h-3" />
        Previous
      </button>
      <div className="hidden sm:block text-[10px] text-gray-500 max-w-md text-center truncate px-3">
        Dev chrome · this strip is NOT shown to {SESSION.offboarder}. The real surface is the canvas above.
      </div>
      <button
        onClick={() => !atLast && onChange(stepIdx + 1)}
        disabled={atLast}
        className={`h-7 px-3 rounded-md text-xs font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30 ${
          atLast ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-rose-600 hover:bg-rose-700 text-white"
        }`}
      >
        Next
        <ChevronRight className="w-3 h-3" />
      </button>
    </footer>
  );
}

function StateRenderer({ id }) {
  if (id === "s1") return <S1FirstQuestion />;
  if (id === "s2") return <S2MidRecording />;
  if (id === "s3") return <S3ManagerPriority />;
  if (id === "s4") return <S4TranscriptExpanded />;
  if (id === "s5") return <S5Paused />;
  if (id === "s6") return <S6SoftWarning />;
  if (id === "s7") return <S7FinalQuestion />;
  if (id === "s8") return <S8Ending />;
  return null;
}

/* ═══════════════════════════════════════════════════════════════════
   OffboarderShell · the stripped chrome the Offboarder actually sees
   ═══════════════════════════════════════════════════════════════════ */

function OffboarderShell({ children, onPause, onEnd, paused, hideEndAffordance, statePill }) {
  return (
    <div className="flex flex-col flex-1 min-h-[640px]">
      <header className="px-6 h-14 flex items-center justify-between border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 bg-violet-500 rounded-full" />
          <span className="text-gray-900 font-semibold tracking-[0.18em] text-[11px]" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>ART-EEP</span>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-xs text-gray-700">{SESSION.offboarder}'s handover</span>
          {statePill}
        </div>
        <div className="flex items-center gap-1.5">
          <button className="h-8 px-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-50 text-xs font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
            <HelpCircle className="w-3.5 h-3.5" strokeWidth={1.75} />
            Help
          </button>
          <span className="w-px h-5 bg-gray-200 mx-1" />
          {!paused && (
            <button onClick={onPause} className="h-8 px-3 rounded-md border border-gray-200 bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-50 text-xs font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
              <Pause className="w-3 h-3" strokeWidth={2} />
              Pause
            </button>
          )}
          {!hideEndAffordance && (
            <button onClick={onEnd} className="h-8 px-3 rounded-md border border-rose-200 bg-white text-rose-700 hover:bg-rose-50 text-xs font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/20">
              <X className="w-3 h-3" strokeWidth={2.5} />
              End interview
            </button>
          )}
          <span className="w-px h-5 bg-gray-200 mx-1" />
          <div className="w-8 h-8 rounded-full bg-violet-50 border border-violet-200 flex items-center justify-center shrink-0" title={SESSION.offboarder}>
            <span className="text-[10px] font-semibold text-violet-700">{SESSION.initials}</span>
          </div>
        </div>
      </header>
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      <HotkeysFooter />
    </div>
  );
}

function HotkeysFooter() {
  const items = [
    { key: "⌘ + space", label: "pause" },
    { key: "↵", label: "finish answer" },
    { key: "T", label: "switch to text mode" },
    { key: "Esc", label: "expand transcript" },
  ];
  return (
    <footer className="px-6 h-9 border-t border-gray-100 flex items-center justify-center gap-4 shrink-0 bg-gray-50/50">
      {items.map((item, i) => (
        <span key={i} className="text-[10px] text-gray-500 inline-flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded border border-gray-200 bg-white text-[9px] text-gray-700" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{item.key}</kbd>
          <span>· {item.label}</span>
        </span>
      ))}
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S1 · Just begun · first question · ready to speak
   ═══════════════════════════════════════════════════════════════════ */

function S1FirstQuestion() {
  return (
    <OffboarderShell>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <TopicCounter currentTopic={1} elapsed="0:00" tone="quiet" />

        <QuestionCard
          eyebrow="AI asked · welcome"
          title="Let's start with what matters most"
          body={`Tell me about your role at the broadest level — what you'd want ${SESSION.successor} to understand in the first week. We'll go deeper on each topic from there.`}
        />

        <RecordingZone state="ready" />

        <TranscriptDrawer state="collapsed" lineCount={0} />
      </div>
    </OffboarderShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S2 · Mid-recording · topic 3 of 6 · waveform active
   ═══════════════════════════════════════════════════════════════════ */

function S2MidRecording() {
  return (
    <OffboarderShell>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <TopicCounter currentTopic={3} elapsed="14:23" tone="active" />

        <QuestionCard
          eyebrow="AI asked · Payment Gateway timeout"
          title="What's the fix you've been doing in your head?"
          body="You mentioned a fix that worked but wasn't written down. Walk me through what you do when it triggers — step by step, including what someone less senior would miss."
        />

        <RecordingZone state="active" />

        <TranscriptDrawer state="collapsed" lineCount={12} />
      </div>
    </OffboarderShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S3 · Manager priority arrives inline
   ═══════════════════════════════════════════════════════════════════ */

function S3ManagerPriority() {
  return (
    <OffboarderShell>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <TopicCounter currentTopic={3} elapsed="16:42" tone="active" />

        <QuestionCard
          eyebrow={`${SESSION.managerFirst}'s priority · just added`}
          title="Vendor XYZ renewal · the SLA penalty clause"
          body={`${SESSION.managerFirst} asked the AI to make sure we cover this · what's the exact penalty clause you negotiated, and is there a verbal commitment from the vendor that isn't in the contract? Anything that would surprise ${SESSION.successor} during the renewal.`}
          priority
        />

        <RecordingZone state="active" />

        <TranscriptDrawer state="collapsed" lineCount={14} />
      </div>
    </OffboarderShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S4 · Live transcript expanded
   ═══════════════════════════════════════════════════════════════════ */

function S4TranscriptExpanded() {
  return (
    <OffboarderShell>
      <div className="flex-1 flex flex-col">
        <div className="px-6 pt-8 pb-4 flex flex-col items-center">
          <TopicCounter currentTopic={3} elapsed="17:08" tone="active" compact />

          <QuestionCard
            eyebrow="AI asked · Payment Gateway timeout"
            title="What's the fix you've been doing in your head?"
            body="You mentioned a fix that worked but wasn't written down. Walk me through what you do when it triggers..."
            compact
          />

          <div className="flex items-center justify-center mt-4">
            <RecordingDot active />
          </div>
        </div>

        <TranscriptDrawer state="expanded" lineCount={14} />
      </div>
    </OffboarderShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S5 · Paused
   ═══════════════════════════════════════════════════════════════════ */

function S5Paused() {
  return (
    <OffboarderShell paused>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        <TopicCounter currentTopic={3} elapsed="18:42" tone="paused" />

        <article className="w-full max-w-[640px] mb-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center mx-auto mb-4">
              <Pause className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">Paused at 18:42</h2>
            <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto mb-6">
              Take your time. Your audio, transcript, and the AI's place in the conversation are all saved. Resume whenever you're ready · within 24 hours, you'll come back to exactly this spot.
            </p>

            <div className="flex items-center justify-center gap-2 mb-5">
              <button className="h-9 px-4 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30">
                <Play className="w-3.5 h-3.5" strokeWidth={2} />
                Resume interview
              </button>
              <button className="h-9 px-4 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
                <Type className="w-3.5 h-3.5" strokeWidth={1.75} />
                Switch to text mode
              </button>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button className="text-[11px] text-gray-500 hover:text-rose-700 inline-flex items-center gap-1.5">
                <Save className="w-3 h-3" strokeWidth={1.75} />
                Save draft and exit · come back later
              </button>
            </div>
          </div>

          <p className="text-[11px] text-gray-500 text-center mt-4 leading-relaxed">
            If you don't return within 24 hours, {SESSION.managerFirst} and the system will both get a gentle reminder. Nothing is committed to the Knowledge Graph until you review and sign off.
          </p>
        </article>

        <TranscriptDrawer state="collapsed" lineCount={14} dimmed />
      </div>
    </OffboarderShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S6 · 5-minute soft warning
   ═══════════════════════════════════════════════════════════════════ */

function S6SoftWarning() {
  return (
    <OffboarderShell statePill={<WrappingUpPill />}>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <SoftWarningBanner />

        <TopicCounter currentTopic={5} elapsed="40:15" tone="active" warning />

        <QuestionCard
          eyebrow="AI asked · Project Atlas rollback"
          title="The rollback procedure — what does someone less senior miss?"
          body="We touched on this earlier · the question is what an engineer in their second week would skip without realizing. Walk me through the trap door."
        />

        <RecordingZone state="active" />

        <TranscriptDrawer state="collapsed" lineCount={42} />
      </div>
    </OffboarderShell>
  );
}

function WrappingUpPill() {
  return (
    <span className="ml-2 inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold bg-yellow-50 border border-yellow-200 text-yellow-800">
      <Hourglass className="w-2.5 h-2.5" strokeWidth={2} />
      Wrapping up
    </span>
  );
}

function SoftWarningBanner() {
  return (
    <article className="w-full max-w-[640px] mb-6">
      <div className="rounded-lg border border-yellow-200 bg-yellow-50/60 px-4 py-2.5 flex items-start gap-2.5">
        <Hourglass className="w-4 h-4 text-yellow-700 shrink-0 mt-0.5" strokeWidth={1.75} />
        <div className="flex-1">
          <div className="text-[13px] text-yellow-900 font-semibold leading-tight">5 minutes remaining</div>
          <p className="text-[11px] text-yellow-900/80 mt-0.5 leading-relaxed">
            We have one topic left to cover. If you want to keep going past 45 minutes, no pressure · we can run until {SESSION.hardStopMin} minutes total. After that we'll wrap automatically.
          </p>
        </div>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S7 · Final question
   ═══════════════════════════════════════════════════════════════════ */

function S7FinalQuestion() {
  return (
    <OffboarderShell statePill={<WrappingUpPill />}>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <TopicCounter currentTopic={6} elapsed="44:20" tone="active" warning lastQuestion />

        <QuestionCard
          eyebrow="AI asked · wrap-up · open the floor"
          title={`Anything else you want to make sure ${SESSION.successor} knows?`}
          body={`Last question · this is your space. A risk, a person to find, a number to call, something that's only in your head. ${SESSION.managerFirst} flagged this as the most important moment.`}
        />

        <RecordingZone state="active" />

        <div className="mt-4 flex items-center gap-2">
          <button className="h-9 px-4 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/30">
            <X className="w-3.5 h-3.5" strokeWidth={2} />
            End interview now
          </button>
          <span className="text-[11px] text-gray-500">or keep going · {SESSION.hardStopMin - 44} min until the hard stop</span>
        </div>

        <TranscriptDrawer state="collapsed" lineCount={48} />
      </div>
    </OffboarderShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S8 · Ending · saving + transitioning
   ═══════════════════════════════════════════════════════════════════ */

function S8Ending() {
  return (
    <OffboarderShell hideEndAffordance>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <article className="w-full max-w-[640px]">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-violet-50 border border-violet-200 flex items-center justify-center mx-auto mb-5">
              <Loader2 className="w-6 h-6 text-violet-600 animate-spin" strokeWidth={1.75} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">Thanks, {SESSION.offboarder.split(" ")[0]}.</h2>
            <p className="text-[15px] text-gray-600 leading-relaxed max-w-md mx-auto mb-6">
              Saving your interview and getting the transcript ready for you to review. This usually takes about 30 seconds.
            </p>

            <article className="rounded-lg border border-gray-200 bg-white overflow-hidden text-left max-w-md mx-auto">
              <ProcessRow status="done" label="Recording stopped" detail="45 minutes 02 seconds captured" />
              <ProcessRow status="done" label="Whisper finalizing the transcript" detail="3 segments queued for offline processing" />
              <ProcessRow status="active" label="AI organizing into a draft handover summary" detail={`Structured around the ${SESSION.totalTopics} topics we covered`} />
              <ProcessRow status="pending" label="Opening the review workspace" detail={`You'll see side-by-side · the AI summary and what you actually said`} last />
            </article>

            <p className="text-[11px] text-gray-500 mt-5 leading-relaxed">
              <span className="text-gray-700 font-medium">What happens next ·</span> you'll review the draft · accept, edit, or reject each section · then sign. Nothing reaches the Knowledge Graph until you do.
            </p>
          </div>
        </article>
      </div>
    </OffboarderShell>
  );
}

function ProcessRow({ status, label, detail, last }) {
  const cfg = {
    done: { icon: Check, iconCls: "text-emerald-600 bg-emerald-50 border-emerald-200", labelCls: "text-gray-900" },
    active: { icon: Loader2, iconCls: "text-violet-600 bg-violet-50 border-violet-200 animate-spin", labelCls: "text-gray-900 font-medium" },
    pending: { icon: Clock, iconCls: "text-gray-300 bg-white border-gray-200", labelCls: "text-gray-400" },
  }[status];
  const Icon = cfg.icon;
  return (
    <div className={`px-3 py-2.5 flex items-start gap-3 ${!last ? "border-b border-gray-100" : ""}`}>
      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${cfg.iconCls}`}>
        <Icon className="w-2.5 h-2.5" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-xs ${cfg.labelCls}`}>{label}</div>
        {detail && <div className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{detail}</div>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Shared canvas primitives
   ═══════════════════════════════════════════════════════════════════ */

function TopicCounter({ currentTopic, elapsed, tone, warning, lastQuestion, compact }) {
  const cfg = {
    quiet: { dotCls: "bg-gray-300", textCls: "text-gray-500" },
    active: { dotCls: "bg-rose-500", textCls: "text-gray-700" },
    paused: { dotCls: "bg-gray-300", textCls: "text-gray-400" },
  }[tone];
  return (
    <div className={`flex items-center gap-2 mb-${compact ? "4" : "8"} text-[11px] ${cfg.textCls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotCls}`} />
      <span style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{elapsed} elapsed</span>
      <span className="text-gray-300">·</span>
      <span>
        topic <span className="text-gray-900 font-medium">{currentTopic}</span> of {SESSION.totalTopics}
      </span>
      {warning && (
        <>
          <span className="text-gray-300">·</span>
          <span className="text-yellow-700 font-medium">{lastQuestion ? "last question" : "closing soon"}</span>
        </>
      )}
    </div>
  );
}

function QuestionCard({ eyebrow, title, body, priority, compact }) {
  const ring = priority ? "border-violet-200" : "border-gray-200";
  const eyebrowColor = priority ? "text-violet-700" : "text-gray-500";
  const accent = priority ? <Sparkles className="w-3 h-3 text-violet-600" strokeWidth={2} /> : null;
  return (
    <article className={`w-full max-w-[680px] mb-${compact ? "4" : "8"}`}>
      <div className={`rounded-2xl border ${ring} bg-white p-${compact ? "5" : "8"} relative`}>
        {priority && (
          <div className="absolute -top-2 left-6 px-2 py-0.5 rounded-full bg-violet-600 text-white text-[10px] font-semibold uppercase tracking-wider inline-flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" strokeWidth={2.5} />
            Manager priority
          </div>
        )}
        <div className={`flex items-center gap-1.5 mb-3 text-[10px] uppercase tracking-[0.18em] font-medium ${eyebrowColor}`}>
          {accent}
          <span>{eyebrow}</span>
        </div>
        <h2 className={`${compact ? "text-lg" : "text-2xl"} font-semibold text-gray-900 mb-${compact ? "2" : "3"} tracking-tight leading-snug`}>{title}</h2>
        <p className={`${compact ? "text-[13px]" : "text-[15px]"} text-gray-600 leading-relaxed`}>{body}</p>
      </div>
    </article>
  );
}

function RecordingZone({ state }) {
  if (state === "ready") {
    return (
      <div className="flex flex-col items-center gap-3 mb-8">
        <div className="w-16 h-16 rounded-full border-2 border-gray-200 flex items-center justify-center">
          <Mic className="w-6 h-6 text-gray-400" strokeWidth={1.5} />
        </div>
        <div className="text-[11px] text-gray-500">Ready when you are · start speaking to begin</div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-4 mb-8">
      <RecordingDot active />
      <Waveform />
    </div>
  );
}

function RecordingDot({ active }) {
  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      {/* CL-009 · the only animation in the surface · rose triple pulse */}
      {active && (
        <>
          <span className="absolute inset-0 rounded-full bg-rose-500/15 animate-ping" style={{ animationDuration: "2.4s" }} />
          <span className="absolute inset-1.5 rounded-full bg-rose-500/20 animate-ping" style={{ animationDuration: "2s", animationDelay: "0.2s" }} />
          <span className="absolute inset-3 rounded-full bg-rose-500/25 animate-ping" style={{ animationDuration: "1.6s", animationDelay: "0.4s" }} />
        </>
      )}
      <span className="relative w-5 h-5 rounded-full bg-rose-600 shadow-sm flex items-center justify-center">
        <span className="w-2 h-2 rounded-full bg-white" />
      </span>
    </div>
  );
}

function Waveform() {
  // Static waveform · gentle pseudo-amplitude · purely visual
  const bars = [3, 5, 8, 6, 11, 9, 14, 10, 16, 12, 17, 13, 18, 14, 16, 11, 14, 9, 11, 7, 9, 5, 6, 4, 3];
  return (
    <div className="flex items-center gap-[3px] h-7">
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-rose-500/70"
          style={{
            height: `${h * 2}px`,
            opacity: 0.6 + (h / 30),
          }}
        />
      ))}
    </div>
  );
}

function TranscriptDrawer({ state, lineCount, dimmed }) {
  if (state === "expanded") return <TranscriptDrawerExpanded lineCount={lineCount} />;
  return (
    <article className={`w-full max-w-[680px] ${dimmed ? "opacity-50" : ""}`}>
      <button className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 flex items-center justify-between gap-3 hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
        <div className="flex items-center gap-2.5 min-w-0">
          <ChevronUp className="w-3.5 h-3.5 text-gray-400 shrink-0" strokeWidth={1.75} />
          <span className="text-xs font-medium text-gray-900">Live transcript</span>
          {lineCount > 0 && (
            <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
              · {lineCount} lines · tap to verify accuracy
            </span>
          )}
          {lineCount === 0 && (
            <span className="text-[10px] text-gray-500">· starts as you speak</span>
          )}
        </div>
        <kbd className="text-[9px] text-gray-500 px-1.5 py-0.5 rounded border border-gray-200 bg-gray-50" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>Esc</kbd>
      </button>
    </article>
  );
}

function TranscriptDrawerExpanded({ lineCount }) {
  const lines = [
    { ts: "00:12", speaker: "AI",  text: "Let's start with what matters most. Tell me about your role at the broadest level — what you'd want Trần Hữu Nam to understand in the first week." },
    { ts: "00:24", speaker: "ML",  text: "So my role is owning the platform's order-routing layer — about 60% of peak transactions go through it. Most days I'm reviewing PRs, handling on-call escalations, and trying to keep Project Atlas from drifting." },
    { ts: "02:08", speaker: "AI",  text: "Got it · let's go deeper on Project Atlas. What's something a new owner would miss in the first month?" },
    { ts: "02:18", speaker: "ML",  text: "The rollback procedure isn't documented anywhere central. There's a runbook in the wiki but it's wrong — it says you can deploy direct to prod with a snapshot, but in practice you always go through staging first." },
    { ts: "08:34", speaker: "AI",  text: "Now let's switch to the Payment Gateway timeout — your tickets show 4 incidents in 6 months. Walk me through the fix you've been doing in your head." },
    { ts: "08:45", speaker: "ML",  text: "Right. So when the timeout hits, the partition lock holds for about 90 seconds. The fix is to bump the timeout to 120 seconds AND restart the partition listener — most people only do one of those." },
    { ts: "14:00", speaker: "AI",  text: "What's the fix you've been doing in your head?" },
    { ts: "14:12", speaker: "ML",  text: "Like I said · two things together. Bump the timeout, restart the listener. The runbook only mentions the timeout, which is why we keep getting tickets even after people 'fix' it." },
    { ts: "15:42", speaker: "AI",  text: "Got it. What would you tell someone less senior who's seeing this for the first time?" },
    { ts: "15:54", speaker: "ML",  text: "Don't trust the runbook. Check the listener status in Datadog first. If it's been more than 90 seconds since the last heartbeat, that's your real problem." },
    { ts: "16:30", speaker: "AI",  text: "Anything that would break that fix · like an upstream change?" },
    { ts: "16:38", speaker: "ML",  text: "If they upgrade the gateway library past 2.4, the listener restart syntax changes. We're still on 2.3 so it's fine for now." },
    { ts: "16:55", speaker: "ML",  text: "Actually one more thing · the on-call alert routes to my personal phone, not the team channel. That should change before I leave." },
    { ts: "17:04", speaker: "AI",  text: "Noted · flagging that as an action item for Hà Vy. Want me to mark the timeout fix as canonical?" },
  ];
  return (
    <div className="w-full bg-gray-50 border-t border-gray-200 flex-1 flex flex-col">
      <div className="px-6 py-3 flex items-center justify-between border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center gap-2.5">
          <ChevronDown className="w-3.5 h-3.5 text-gray-500" strokeWidth={1.75} />
          <span className="text-xs font-semibold text-gray-900">Live transcript · {lineCount} lines</span>
          <span className="text-[10px] text-gray-500">· auto-scrolls · tap any line to verify</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[10px] text-rose-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            recording
          </span>
          <button className="text-[10px] text-gray-500 hover:text-gray-900 inline-flex items-center gap-1">
            Collapse
            <ChevronUp className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-4 max-h-[340px]">
        <div className="max-w-[860px] mx-auto space-y-3">
          {lines.map((line, i) => (
            <TranscriptLine key={i} {...line} latest={i === lines.length - 1} />
          ))}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>17:14</span>
            <span className="text-[10px] text-gray-400 italic">transcribing…</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TranscriptLine({ ts, speaker, text, latest }) {
  const isMe = speaker === "ML";
  return (
    <div className="flex items-start gap-3">
      <span className="text-[10px] text-gray-500 shrink-0 w-12 pt-0.5" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{ts}</span>
      <span className={`text-[10px] font-semibold uppercase tracking-wider shrink-0 w-8 pt-0.5 ${isMe ? "text-violet-700" : "text-gray-500"}`}>{isMe ? "You" : "AI"}</span>
      <p className={`text-[13px] flex-1 leading-relaxed ${isMe ? "text-gray-900" : "text-gray-700"} ${latest ? "bg-yellow-50/40 -mx-2 px-2 py-1 rounded" : ""}`}>{text}</p>
    </div>
  );
}
