'use client';

import React, { useState } from 'react';
import {
  Mic, Pause, Square, Play, Sparkles, MessageCircle, Send,
  AlertTriangle, AlertCircle, CheckCircle2, Clock, ArrowRight,
  ChevronDown, ChevronRight, Flag, Pencil, Plus, X, Edit3,
  FileText, Volume2, SkipBack, SkipForward, Type, ShieldCheck,
  Lock, KeyRound, Info, Eye, Network, Hash, ExternalLink,
  Sparkle, RefreshCw, MicOff, FileSignature
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════
   ART-EEP — Sprint 2: Capture & Verify
   
   Screens delivered:
     06. Pre-Interview Briefing (UC-HO-02 step 2)
     07. Live Voice Interview (UC-HO-02 steps 4–10)
     08. Text Mode Interview (UC-HO-02 AC.2)
     09. Review Workspace (UC-HO-03 steps 2–8)
     10. Sign-off Confirmation (UC-HO-03 steps 10–12)
   
   Highest-risk sprint technically. The concentric pulsing rings on
   Screen 07 are one of only two animations in the entire system
   (per CL-009). Persona: Minh Lê is the Offboarder.
   ═══════════════════════════════════════════════════════════════════ */

const SCREENS = [
  { id: 6,  num: '06', name: 'Briefing',         uc: 'UC-HO-02', states: [['happy', 'Happy path'], ['no-context', 'No seeded context']] },
  { id: 7,  num: '07', name: 'Live Interview',   uc: 'UC-HO-02', states: [['recording', 'Recording'], ['paused', 'Paused'], ['inactivity', 'Inactivity check'], ['wrap', 'Wrap-up phase']] },
  { id: 8,  num: '08', name: 'Text Mode',        uc: 'UC-HO-02', states: [['active', 'Text mode']] },
  { id: 9,  num: '09', name: 'Review Workspace', uc: 'UC-HO-03', states: [['reading', 'Reading draft'], ['editing', 'Editing item'], ['manager-flag', 'Manager flag'], ['near-deadline', 'Deadline approaching']] },
  { id: 10, num: '10', name: 'Sign-off',         uc: 'UC-HO-03', states: [['ready', 'Ready to sign'], ['auth-failed', 'Authentication failed']] },
];

export default function S2CaptureVerify() {
  const [screenId, setScreenId] = useState(6);
  const [stateKey, setStateKey] = useState('happy');

  const screen = SCREENS.find(s => s.id === screenId);

  const handleScreenChange = (id) => {
    setScreenId(id);
    const next = SCREENS.find(s => s.id === id);
    setStateKey(next.states[0][0]);
  };

  const advance = (toId) => {
    setScreenId(toId);
    const next = SCREENS.find(s => s.id === toId);
    setStateKey(next.states[0][0]);
  };

  return (
    <div className="h-screen w-full bg-gray-50 text-gray-900 flex flex-col overflow-hidden" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>

      {/* Brand + screen nav */}
      <header className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between shrink-0 gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
          <span className="text-gray-900 font-semibold tracking-[0.18em] text-xs" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>ART-EEP</span>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-gray-500 text-xs">Sprint 2 · Capture & Verify</span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {SCREENS.map(s => {
            const isActive = s.id === screenId;
            return (
              <button
                key={s.id}
                onClick={() => handleScreenChange(s.id)}
                className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] border transition-all whitespace-nowrap ${
                  isActive ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-gray-400 font-medium" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{s.num}</span>
                <span>{s.name}</span>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-gray-500 shrink-0" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{screen.uc}</div>
      </header>

      {/* State selector */}
      <div className="bg-white border-b border-gray-200 px-5 py-2 flex items-center gap-2 shrink-0">
        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium shrink-0">State</span>
        <span className="w-px h-3 bg-gray-200" />
        <div className="flex items-center gap-1 flex-wrap">
          {screen.states.map(([key, label]) => {
            const isActive = stateKey === key;
            return (
              <button
                key={key}
                onClick={() => setStateKey(key)}
                className={`px-2 py-0.5 rounded text-[11px] border transition-all ${
                  isActive ? 'border-amber-300 bg-amber-50 text-amber-800' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {screenId === 6  && <Screen06Briefing state={stateKey} onBegin={() => advance(7)} />}
        {screenId === 7  && <Screen07LiveInterview state={stateKey} onEnd={() => advance(9)} />}
        {screenId === 8  && <Screen08TextMode state={stateKey} onEnd={() => advance(9)} />}
        {screenId === 9  && <Screen09ReviewWorkspace state={stateKey} onSign={() => advance(10)} />}
        {screenId === 10 && <Screen10Signoff state={stateKey} />}
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 06 — PRE-INTERVIEW BRIEFING
   UC-HO-02 step 2 · Offboarder sees what's about to happen
   ═══════════════════════════════════════════════════════════════════ */
function Screen06Briefing({ state, onBegin }) {
  const lowContext = state === 'no-context';

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Breadcrumb path={['Handover', 'My session']} />
      <PageHeader
        eyebrow={lowContext ? 'Limited context mode' : 'Ready when you are'}
        title="Ready to capture your knowledge"
        subtitle="This session will take about 45 minutes. The AI will ask follow-up questions based on what you share."
        actor="Minh Lê · Offboarder"
      />

      {lowContext && (
        <Banner tone="warning" icon={AlertCircle}>
          <strong>Your context wasn't fully seeded.</strong> The AI will ask broader questions based on your role rather than your specific work history. You can still cover everything that matters — it might just take longer.
        </Banner>
      )}

      {/* Consent card */}
      <FormSection title="Recording consent" subtitle="What happens with your voice during this session.">
        <div className="rounded-md border border-gray-200 bg-white p-4 space-y-3">
          <ConsentLine icon={Mic}>
            Your voice will be transcribed in real time. The audio file is encrypted and auto-deleted 90 days after your knowledge is committed to the system.
          </ConsentLine>
          <ConsentLine icon={Eye}>
            Only you, your manager, and authorized HR admins can access the recording during that window.
          </ConsentLine>
          <ConsentLine icon={Type}>
            You can switch to text mode at any time if you prefer typing over speaking.
          </ConsentLine>
        </div>
      </FormSection>

      {/* Domains to cover (dynamic, per UC-HO-02 v2.0) */}
      <FormSection
        title={`Topics we've prepared (${lowContext ? '3 from your role' : '7 from your work history'})`}
        subtitle="The AI will steer the conversation through these. You can dive deeper into any of them."
      >
        {lowContext ? (
          <div className="space-y-2">
            <DomainRow title="Active projects" detail="Generic prompts based on your role" generic />
            <DomainRow title="Team relationships" detail="Generic prompts based on your role" generic />
            <DomainRow title="Tools and workflows" detail="Generic prompts based on your role" generic />
          </div>
        ) : (
          <div className="space-y-2">
            <DomainRow title="Project Atlas" detail="32 tickets · primary contributor" priority="high" />
            <DomainRow title="Payment Gateway timeout" detail="Recurring incident · no runbook" priority="critical" badge="Manager priority" />
            <DomainRow title="Vendor XYZ renewal" detail="High email volume · no project doc" priority="critical" badge="Manager priority" />
            <DomainRow title="Customer Portal infra config" detail="Owned by you · low documentation" />
            <DomainRow title="Payment Gateway v2 maintenance" detail="18 tickets · maintenance lead" />
            <DomainRow title="Architecture decisions" detail="Cross-cutting · escalation patterns" />
            <DomainRow title="Tools & access handoff" detail="Standard closeout" />
          </div>
        )}
      </FormSection>

      {/* Action bar */}
      <div className="flex items-center justify-between pt-2">
        <button className="text-xs text-gray-700 hover:text-gray-900 inline-flex items-center gap-1.5 transition-colors">
          <Type className="w-3 h-3" />
          Switch to text mode
        </button>
        <button
          onClick={onBegin}
          className="px-4 py-2 rounded-md bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium inline-flex items-center gap-2 transition-colors"
        >
          Begin interview
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-center text-[11px] text-gray-400 mt-5">
        You can pause and resume anytime within 24 hours. Your progress is saved automatically.
      </p>
    </div>
  );
}

function ConsentLine({ icon: Icon, children }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" strokeWidth={1.75} />
      <p className="text-[12px] text-gray-700 leading-relaxed">{children}</p>
    </div>
  );
}

function DomainRow({ title, detail, priority, badge, generic }) {
  const priCfg = {
    critical: 'bg-rose-500',
    high: 'bg-amber-500',
  };
  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2.5 flex items-center gap-3">
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${generic ? 'bg-gray-300' : priority ? priCfg[priority] : 'bg-gray-400'}`} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900">{title}</div>
        <div className="text-[11px] text-gray-500 mt-0.5">{detail}</div>
      </div>
      {badge && (
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700 uppercase tracking-wider font-semibold shrink-0">
          {badge}
        </span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 07 — LIVE VOICE INTERVIEW
   UC-HO-02 steps 4–10 · The signature animated screen
   ═══════════════════════════════════════════════════════════════════ */
function Screen07LiveInterview({ state, onEnd }) {
  const isPaused = state === 'paused';
  const isInactive = state === 'inactivity';
  const isWrap = state === 'wrap';

  return (
    <div className="h-full flex flex-col bg-white relative">
      <InterviewTopBar paused={isPaused} />

      <div className="flex-1 flex items-center justify-center px-6 py-6 overflow-y-auto">
        <div className="w-full max-w-2xl">

          {/* Wrap-up banner */}
          {isWrap && (
            <Banner tone="warning" icon={Clock}>
              <strong>5 minutes remaining.</strong> The AI is moving to closing questions. Anything important you haven't covered yet?
            </Banner>
          )}

          {/* Concentric pulsing rings — the signature element */}
          <div className="flex justify-center mb-6">
            <PulsingMic paused={isPaused} />
          </div>

          {/* Recording status */}
          <div className="text-center mb-7">
            {isPaused ? (
              <div className="flex items-center justify-center gap-2 text-sm">
                <PauseCircle className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 font-medium">Paused</span>
                <span className="text-gray-300">·</span>
                <span className="text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>12:34 elapsed</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                <span className="text-rose-700 font-medium">Recording</span>
                <span className="text-gray-300">·</span>
                <span className="text-gray-700" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>
                  {isWrap ? '40:12' : '12:34'}
                </span>
              </div>
            )}
          </div>

          {/* AI Question card */}
          <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-5 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium">AI asked</span>
              {state === 'recording' && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700 ml-auto">
                  Manager priority
                </span>
              )}
            </div>
            <p className="text-base text-gray-900 leading-relaxed">
              {isWrap
                ? "Before we wrap up — is there anything about the Customer Portal infrastructure config that wouldn't be obvious from the code?"
                : "Can you walk me through what conditions you committed to in the Vendor XYZ renewal negotiation?"}
            </p>
          </div>

          {/* Live transcription */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium">Live transcription</span>
              </div>
              <span className="text-[10px] text-gray-400">Auto-syncing</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {isPaused ? (
                <span className="text-gray-500 italic">
                  Yes, the most challenging conversation was around the SLA terms. We agreed to a 4-hour response window for critical issues, but only after pushing back on their initial 1-hour ask…
                </span>
              ) : (
                <>
                  Yes, the most challenging conversation was around the SLA terms. We agreed to a 4-hour response window for critical issues, but only after pushing back on their initial 1-hour ask. The trade-off was that we accepted a higher per-incident penalty, which means
                  <span className="inline-block w-0.5 h-3.5 bg-gray-900 ml-0.5 align-middle animate-pulse" />
                </>
              )}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            {isPaused ? (
              <>
                <button className="px-4 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors">
                  Save & exit
                </button>
                <button className="px-4 py-2 rounded-md border border-gray-900 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium inline-flex items-center gap-2 transition-colors">
                  <Play className="w-3.5 h-3.5" fill="currentColor" />
                  Resume
                </button>
              </>
            ) : (
              <>
                <button className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">
                  <Pause className="w-3.5 h-3.5" />
                  Pause
                </button>
                <button
                  onClick={onEnd}
                  className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-900 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium transition-colors"
                >
                  <Square className="w-3.5 h-3.5" fill="currentColor" />
                  End interview
                </button>
              </>
            )}
          </div>

          {!isPaused && (
            <p className="text-center text-[11px] text-gray-400 mt-5">
              The AI moves on after 3 seconds of silence, or when you press ↵
            </p>
          )}
        </div>
      </div>

      {/* Inactivity modal overlay */}
      {isInactive && <InactivityModal />}
    </div>
  );
}

function InterviewTopBar({ paused }) {
  return (
    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
      <div className="text-xs flex items-center gap-2">
        <span className="text-gray-500">Handover</span>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 font-medium">Voice interview</span>
        <span className="text-gray-300">·</span>
        <span className="text-gray-700">Minh Lê</span>
        <span className="text-gray-300">·</span>
        <span className="text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>HO-2026-04-22</span>
      </div>
      <div className="text-xs flex items-center gap-2 text-gray-500">
        <span>Topic <span className="text-gray-900 font-semibold">3</span> of <span className="text-gray-900 font-semibold">7</span></span>
        <div className="w-20 h-1 rounded-full bg-gray-100 overflow-hidden">
          <div className="h-full bg-gray-900" style={{ width: '42%' }} />
        </div>
      </div>
    </div>
  );
}

function PulsingMic({ paused }) {
  if (paused) {
    return (
      <div className="relative flex items-center justify-center" style={{ width: 112, height: 112 }}>
        <span className="absolute rounded-full bg-gray-100" style={{ width: 88, height: 88 }} />
        <span className="relative inline-flex items-center justify-center rounded-full bg-gray-400" style={{ width: 64, height: 64 }}>
          <MicOff className="w-7 h-7 text-white" strokeWidth={2} />
        </span>
      </div>
    );
  }
  return (
    <div className="relative flex items-center justify-center" style={{ width: 112, height: 112 }}>
      {/* Outer animated ring */}
      <span className="absolute inline-flex rounded-full bg-rose-400 opacity-20 animate-ping" style={{ width: 112, height: 112 }} />
      {/* Static mid ring */}
      <span className="absolute rounded-full bg-rose-100" style={{ width: 88, height: 88 }} />
      {/* Inner solid */}
      <span className="relative inline-flex items-center justify-center rounded-full bg-rose-500" style={{ width: 64, height: 64 }}>
        <Mic className="w-7 h-7 text-white" strokeWidth={2} />
      </span>
    </div>
  );
}

function PauseCircle({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <circle cx="12" cy="12" r="10" />
      <line x1="10" y1="9" x2="10" y2="15" />
      <line x1="14" y1="9" x2="14" y2="15" />
    </svg>
  );
}

function InactivityModal() {
  return (
    <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center z-10" style={{ backdropFilter: 'blur(2px)' }}>
      <div className="bg-white rounded-lg border border-gray-200 px-6 py-5 max-w-sm shadow-xl">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Still there?</h3>
            <p className="text-xs text-gray-600 mt-1">
              We haven't heard from you in 5 minutes. We'll pause automatically in 60 seconds if you don't respond.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button className="px-3 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors">
            Pause now
          </button>
          <button className="px-3 py-1.5 rounded-md bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium transition-colors">
            I'm here
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 08 — TEXT MODE INTERVIEW (AC.2)
   Chat-style fallback when voice isn't an option
   ═══════════════════════════════════════════════════════════════════ */
function Screen08TextMode({ state, onEnd }) {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
        <div className="text-xs flex items-center gap-2">
          <span className="text-gray-500">Handover</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium">Text mode interview</span>
          <span className="text-gray-300">·</span>
          <span className="text-gray-700">Minh Lê</span>
        </div>
        <div className="text-xs flex items-center gap-2 text-gray-500">
          <span>Topic <span className="text-gray-900 font-semibold">3</span> of <span className="text-gray-900 font-semibold">7</span></span>
          <div className="w-20 h-1 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full bg-gray-900" style={{ width: '42%' }} />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-2xl mx-auto space-y-4">

          {/* Mode notice */}
          <div className="text-center mb-2">
            <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-600 uppercase tracking-wider font-semibold inline-flex items-center gap-1.5">
              <Type className="w-2.5 h-2.5" />
              Text mode · no audio recording
            </span>
          </div>

          {/* AI message */}
          <AiMessage>
            Hi Minh Lê — let's start with Project Atlas. What architecture decisions are you most proud of, and which ones would you reconsider if you started over?
          </AiMessage>

          {/* User message */}
          <UserMessage>
            Most proud of: splitting the read and write paths early. That decision saved us during the Q3 traffic spike when reads jumped 8x and writes stayed flat. We could scale them independently.

            Would reconsider: using event sourcing for the audit log. It was overkill for the volume we actually had, and the replay tooling became a maintenance burden. Standard append-only logs would have been fine.
          </UserMessage>

          {/* AI message — Manager priority */}
          <AiMessage priority>
            Following up on something your manager flagged as important: the Vendor XYZ renewal. What conditions did you commit to that aren't documented anywhere?
          </AiMessage>

          {/* User input */}
          <div className="pt-2">
            <div className="rounded-lg border border-gray-200 bg-white p-3 focus-within:border-gray-400 transition-colors">
              <textarea
                placeholder="Type your answer…"
                className="w-full min-h-[80px] resize-none outline-none text-sm placeholder:text-gray-400 text-gray-900"
                style={{ fontFamily: 'inherit' }}
              />
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-[10px] text-gray-400">⌘ + ↵ to submit</span>
                <button className="px-3 py-1 rounded-md bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors">
                  Submit
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* End interview action */}
          <div className="flex justify-center pt-4">
            <button
              onClick={onEnd}
              className="text-xs text-gray-500 hover:text-gray-900 inline-flex items-center gap-1.5 transition-colors"
            >
              <Square className="w-3 h-3" />
              End interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AiMessage({ children, priority }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${priority ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50 border border-gray-200'}`}>
        <Sparkles className={`w-3.5 h-3.5 ${priority ? 'text-amber-600' : 'text-gray-500'}`} />
      </div>
      <div className="flex-1 min-w-0 pt-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium">AI</span>
          {priority && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700 font-medium">
              Manager priority
            </span>
          )}
        </div>
        <p className="text-sm text-gray-900 leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

function UserMessage({ children }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] font-medium text-gray-600 shrink-0">
        ML
      </div>
      <div className="flex-1 min-w-0 pt-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium">You</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{children}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 09 — REVIEW WORKSPACE
   UC-HO-03 steps 2–8 · Offboarder verifies the draft
   ═══════════════════════════════════════════════════════════════════ */
function Screen09ReviewWorkspace({ state, onSign }) {
  const isEditing = state === 'editing';
  const hasManagerFlag = state === 'manager-flag';
  const nearDeadline = state === 'near-deadline';
  const signDisabled = hasManagerFlag;

  return (
    <div className="h-full flex flex-col bg-white">

      {/* Top bar */}
      <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">Review and sign</span>
            <h1 className="text-base font-semibold text-gray-900 tracking-tight">Your handover summary</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {nearDeadline && (
            <span className="text-[11px] px-2 py-1 rounded bg-rose-50 border border-rose-200 text-rose-700 font-medium inline-flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              Deadline in 6 hours
            </span>
          )}
          <button className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
            Save & exit
          </button>
          <button
            onClick={signDisabled ? undefined : onSign}
            disabled={signDisabled}
            className={`px-3 py-1.5 rounded-md text-sm font-medium inline-flex items-center gap-1.5 transition-colors ${
              signDisabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-900 hover:bg-gray-800 text-white'
            }`}
          >
            Approve & sign
            <FileSignature className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {hasManagerFlag && (
        <div className="px-6 py-2 border-b border-rose-200 bg-rose-50/40 flex items-center gap-2 shrink-0">
          <Flag className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <p className="text-[12px] text-rose-800">
            <strong>Your manager flagged 1 item.</strong> Resolve it before you can sign — scroll to find it, or jump to <button className="underline">item BUG-404</button>.
          </p>
        </div>
      )}

      {/* Split content */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT — Transcript */}
        <div style={{ width: '45%' }} className="border-r border-gray-200 flex flex-col overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50/60 flex items-center justify-between shrink-0">
            <h2 className="text-xs uppercase tracking-[0.18em] text-gray-500 font-medium">Interview transcript</h2>
            <span className="text-[10px] text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>HO-2026-04-22 · 42:18</span>
          </div>

          <AudioPlayer />

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            <TranscriptLine time="00:34" speaker="ai">
              Let's start with Project Atlas. What were the most important architecture decisions you made there?
            </TranscriptLine>
            <TranscriptLine time="00:52" speaker="user">
              I'd say the biggest one was splitting the read and write paths early. We knew the traffic pattern would be read-heavy…
            </TranscriptLine>
            <TranscriptLine time="03:21" speaker="ai">
              Can you walk me through what conditions you committed to in the Vendor XYZ renewal negotiation?
            </TranscriptLine>
            <TranscriptLine time="03:38" speaker="user" highlighted={isEditing}>
              The most challenging conversation was around the SLA terms. We agreed to a 4-hour response window for critical issues, but only after pushing back on their initial 1-hour ask. The trade-off was a higher per-incident penalty.
            </TranscriptLine>
            <TranscriptLine time="05:02" speaker="user">
              On the Payment Gateway timeout — we never wrote a formal runbook for it. The fix is always the same: restart the connection pool service between 2 and 4 AM, after the nightly batch finishes.
            </TranscriptLine>
          </div>
        </div>

        {/* RIGHT — Draft summary */}
        <div style={{ width: '55%' }} className="flex flex-col overflow-hidden bg-white">
          <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50/60 flex items-center gap-2 shrink-0 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            <SectionTab active>Vendor XYZ renewal</SectionTab>
            <SectionTab>Project Atlas decisions</SectionTab>
            <SectionTab flagged={hasManagerFlag}>Payment Gateway timeout</SectionTab>
            <SectionTab>Customer Portal infra</SectionTab>
            <SectionTab>Architecture decisions</SectionTab>
            <SectionTab>Tools & access</SectionTab>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">

            {hasManagerFlag && (
              <ManagerFlagCallout />
            )}

            {/* Item 1 — either editing or read */}
            {isEditing ? (
              <EditingDraftItem />
            ) : (
              <DraftItem
                id="VXZ-01"
                title="SLA terms agreed during renewal"
                body="Agreed to a 4-hour response window for critical issues (initial Vendor ask was 1-hour). Trade-off: accepted higher per-incident penalty."
                status="verified"
                sourceTime="03:38"
              />
            )}

            <DraftItem
              id="VXZ-02"
              title="Penalty escalation clause"
              body="If three SLA breaches occur in a calendar quarter, the per-incident penalty doubles for the rest of the quarter."
              status="ai"
              sourceTime="04:12"
            />

            <DraftItem
              id="VXZ-03"
              title="Termination notice period"
              body="60-day notice required either direction. Vendor pushed for 30 days; we held at 60."
              status="edited"
              sourceTime="04:48"
            />

            <DraftItem
              id="VXZ-04"
              title="Pricing renegotiation trigger"
              body="If our monthly transaction volume exceeds 2.5M, pricing automatically renegotiates. Currently at 1.8M."
              status="manual"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function AudioPlayer() {
  return (
    <div className="px-4 py-2.5 border-b border-gray-200 bg-white flex items-center gap-3 shrink-0">
      <button className="w-7 h-7 rounded-full bg-gray-900 hover:bg-gray-800 text-white flex items-center justify-center transition-colors">
        <Play className="w-3 h-3" fill="currentColor" />
      </button>
      <span className="text-[10px] text-gray-500 shrink-0" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>03:38</span>
      <div className="flex-1 h-1 rounded-full bg-gray-100 overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 bg-gray-900" style={{ width: '8.5%' }} />
      </div>
      <span className="text-[10px] text-gray-400 shrink-0" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>42:18</span>
      <button className="text-gray-500 hover:text-gray-900 transition-colors">
        <Volume2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function TranscriptLine({ time, speaker, children, highlighted }) {
  return (
    <div className={`rounded-md px-2.5 py-1.5 transition-colors ${highlighted ? 'bg-amber-50 border border-amber-200' : ''}`}>
      <div className="flex items-center gap-2 mb-0.5">
        <span className="text-[10px] text-gray-400" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{time}</span>
        <span className={`text-[10px] uppercase tracking-wider font-semibold ${speaker === 'ai' ? 'text-amber-700' : 'text-gray-600'}`}>
          {speaker === 'ai' ? 'AI' : 'You'}
        </span>
      </div>
      <p className="text-[12px] text-gray-700 leading-relaxed">{children}</p>
    </div>
  );
}

function SectionTab({ children, active, flagged }) {
  return (
    <button className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition-all border shrink-0 ${
      active
        ? 'border-gray-900 bg-white text-gray-900 font-medium'
        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-white hover:border-gray-200'
    }`}>
      <span>{children}</span>
      {flagged && <Flag className="w-3 h-3 text-rose-500" />}
    </button>
  );
}

function DraftItem({ id, title, body, status, sourceTime }) {
  const statusCfg = {
    verified: { label: 'AI generated',     cls: 'bg-gray-50 border-gray-200 text-gray-600',         icon: Sparkles },
    ai:       { label: 'AI generated',     cls: 'bg-gray-50 border-gray-200 text-gray-600',         icon: Sparkles },
    edited:   { label: 'Edited',           cls: 'bg-amber-50 border-amber-200 text-amber-700',      icon: Pencil },
    manual:   { label: 'Added by you',     cls: 'bg-emerald-50 border-emerald-200 text-emerald-700',icon: Plus },
  }[status];
  const Icon = statusCfg.icon;

  return (
    <article className="rounded-lg border border-gray-200 bg-white overflow-hidden hover:border-gray-300 transition-colors">
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase tracking-wider font-semibold inline-flex items-center gap-1 ${statusCfg.cls}`}>
            <Icon className="w-2.5 h-2.5" />
            {statusCfg.label}
          </span>
          <span className="text-[10px] text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{id}</span>
          {sourceTime && (
            <>
              <span className="text-gray-300">·</span>
              <button className="text-[10px] text-gray-500 hover:text-gray-900 inline-flex items-center gap-1 transition-colors">
                <ExternalLink className="w-2.5 h-2.5" />
                Source · {sourceTime}
              </button>
            </>
          )}
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-700 leading-relaxed">{body}</p>
        <div className="flex items-center justify-end mt-2">
          <button className="text-xs text-gray-500 hover:text-gray-900 inline-flex items-center gap-1 transition-colors">
            <Pencil className="w-3 h-3" />
            Edit
          </button>
        </div>
      </div>
    </article>
  );
}

function EditingDraftItem() {
  return (
    <article className="rounded-lg border border-amber-300 bg-amber-50/30 overflow-hidden">
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="text-[10px] px-1.5 py-0.5 rounded border uppercase tracking-wider font-semibold bg-amber-100 border-amber-300 text-amber-800 inline-flex items-center gap-1">
            <Edit3 className="w-2.5 h-2.5" />
            Editing
          </span>
          <span className="text-[10px] text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>VXZ-01</span>
          <span className="text-gray-300">·</span>
          <button className="text-[10px] text-gray-500 hover:text-gray-900 inline-flex items-center gap-1">
            <ExternalLink className="w-2.5 h-2.5" />
            Source · 03:38
          </button>
        </div>
        <input
          defaultValue="SLA terms agreed during renewal"
          className="w-full text-sm font-semibold text-gray-900 bg-transparent outline-none border-b border-amber-300 pb-1 mb-2"
        />
        <textarea
          defaultValue="Agreed to a 4-hour response window for critical issues (initial Vendor ask was 1-hour). Trade-off: accepted higher per-incident penalty."
          className="w-full text-sm text-gray-700 leading-relaxed bg-transparent outline-none resize-none min-h-[60px]"
          style={{ fontFamily: 'inherit' }}
        />
        <div className="flex items-center justify-between pt-2 border-t border-amber-200/60 mt-2">
          <span className="text-[10px] text-amber-700">Your edit will be saved as a versioned correction.</span>
          <div className="flex items-center gap-2">
            <button className="text-xs text-gray-500 hover:text-gray-900 transition-colors">Cancel</button>
            <button className="px-2.5 py-1 rounded-md bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors">
              <CheckCircle2 className="w-3 h-3" />
              Save correction
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function ManagerFlagCallout() {
  return (
    <div className="rounded-lg border border-rose-200 bg-rose-50/40 overflow-hidden" style={{ borderLeft: '2px solid rgb(244, 63, 94)' }}>
      <div className="px-4 py-3">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-[10px] font-medium text-rose-700 shrink-0">
            HV
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-gray-900">Hà Vy</span>
              <span className="text-[10px] text-gray-500">flagged this item · 2 hours ago</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              Could you also cover the rollback procedure if the timeout fix doesn't take? Trần Hữu Nam will likely need it in his first month.
            </p>
            <div className="flex items-center gap-2">
              <button className="text-xs px-2.5 py-1 rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium transition-colors">
                Add to the item
              </button>
              <button className="text-xs px-2.5 py-1 rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition-colors">
                Dismiss (with note)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 10 — SIGN-OFF CONFIRMATION
   UC-HO-03 steps 10–12 · Digital signature gate
   ═══════════════════════════════════════════════════════════════════ */
function Screen10Signoff({ state }) {
  const authFailed = state === 'auth-failed';

  return (
    <div className="h-full bg-gray-100/60 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-w-lg w-full" style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
              <FileSignature className="w-4 h-4 text-gray-700" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Sign and finalize</h2>
              <p className="text-xs text-gray-500">Your knowledge becomes permanent after this.</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <SignoffStat value="7" label="Topics covered" />
            <SignoffStat value="4" label="Corrections made" />
            <SignoffStat value="1" label="Items you added" />
          </div>
          <p className="text-[13px] text-gray-700 leading-relaxed">
            By signing, you confirm that this summary accurately represents your handover knowledge. It will be committed to the company's knowledge graph and used to build the onboarding playbook for whoever fills your role next.
          </p>
        </div>

        {/* Auth */}
        <div className="px-6 py-5">
          {authFailed && (
            <div className="rounded-md border border-rose-200 bg-rose-50/40 px-3 py-2 mb-4 flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
              <p className="text-[12px] text-rose-800">
                <strong>Authentication failed.</strong> 2 attempts remaining before signing is locked for 15 minutes. <button className="underline">Reset your credentials</button>
              </p>
            </div>
          )}

          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.18em] text-gray-500 font-medium">Enter your PIN to sign</span>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 flex items-center gap-1.5">
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <input
                    key={i}
                    type="password"
                    maxLength={1}
                    className={`w-10 h-10 rounded-md border text-center text-base font-medium outline-none transition-colors ${
                      authFailed ? 'border-rose-300 bg-rose-50/30' : 'border-gray-300 bg-white focus:border-gray-500'
                    }`}
                    style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}
                  />
                ))}
              </div>
              <button className="text-xs text-gray-500 hover:text-gray-900 inline-flex items-center gap-1 transition-colors">
                <KeyRound className="w-3 h-3" />
                Use biometric
              </button>
            </div>
          </label>

          <div className="mt-5 flex items-center justify-between">
            <button className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
              Back to review
            </button>
            <button
              disabled={authFailed}
              className={`px-4 py-2 rounded-md text-sm font-medium inline-flex items-center gap-2 transition-colors ${
                authFailed ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800 text-white'
              }`}
            >
              <FileSignature className="w-3.5 h-3.5" />
              Sign and commit
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50/60 flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-gray-500 shrink-0" />
          <p className="text-[11px] text-gray-600">
            Your signature is legally binding under Vietnam's e-signature law. The signed record will be retained for 2 years.
          </p>
        </div>
      </div>
    </div>
  );
}

function SignoffStat({ value, label }) {
  return (
    <div className="text-center px-2 py-2 rounded-md border border-gray-200 bg-gray-50/60">
      <div className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{value}</div>
      <div className="text-[10px] text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SHARED PRIMITIVES
   ═══════════════════════════════════════════════════════════════════ */

function PageHeader({ eyebrow, title, subtitle, actor }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        {eyebrow && <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">{eyebrow}</span>}
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight mt-1">{title}</h1>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {actor && <span className="text-[11px] text-gray-500 shrink-0 pt-1">{actor}</span>}
    </div>
  );
}

function Breadcrumb({ path }) {
  return (
    <div className="flex items-center gap-1.5 mb-2 text-[11px]">
      {path.map((p, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="text-gray-300">/</span>}
          <span className={i === path.length - 1 ? 'text-gray-700' : 'text-gray-500'}>{p}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

function FormSection({ title, subtitle, children }) {
  return (
    <section className="mb-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      {subtitle && <p className="text-[12px] text-gray-500 mb-3">{subtitle}</p>}
      {children}
    </section>
  );
}

function Banner({ tone, icon: Icon, children }) {
  const cfg = {
    critical: { cls: 'border-rose-200 bg-rose-50/60',   iconCls: 'text-rose-600',  textCls: 'text-rose-900' },
    warning:  { cls: 'border-amber-200 bg-amber-50/60', iconCls: 'text-amber-600', textCls: 'text-amber-900' },
    muted:    { cls: 'border-gray-200 bg-gray-50',      iconCls: 'text-gray-500',  textCls: 'text-gray-700' },
  }[tone];

  return (
    <div className={`rounded-md border ${cfg.cls} px-3 py-2.5 mb-5 flex items-start gap-2`}>
      <Icon className={`w-4 h-4 ${cfg.iconCls} shrink-0 mt-0.5`} strokeWidth={1.75} />
      <div className={`text-[12px] ${cfg.textCls} leading-relaxed`}>{children}</div>
    </div>
  );
}
