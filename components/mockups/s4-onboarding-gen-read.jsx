'use client';

import React, { useState } from 'react';
import {
  Sparkles, ArrowRight, ArrowUpRight, ChevronDown, ChevronRight, ChevronLeft,
  Plus, X, Pencil, Trash2, AlertTriangle, AlertCircle, CheckCircle2,
  Clock, Loader2, Lock, Flag, Sparkle, MessageCircle, Send,
  Eye, Network, Hash, ExternalLink, RefreshCw, BookOpen,
  Folder, GitBranch, Users, Briefcase, FileText, Settings,
  Maximize2, ZoomIn, ZoomOut, Filter, Info, ShieldCheck,
  PlayCircle, Target, Layers, Wand2, Search, ArrowDownRight
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════
   ART-EEP — Sprint 4: Onboarding Generation & Reading
   
   The hackathon's signature surface.
   
   Screens delivered:
     12. Playbook Builder (UC-ON-01 Manager)
     13. Generation Stage (UC-ON-01 cinematic moment)
     14. Onboarder Dashboard (UC-ON-02 entry point)
     15. Playbook Reading (UC-ON-02 split-screen with Spotlight Graph)
     16. Full Graph View (UC-ON-02 AC.2)
   
   The completion glow animation on Screen 13 is the second and final
   use of motion in the entire system (per CL-009).
   Persona: Trần Hữu Nam reads what Minh Lê left behind, with Hà Vy's
   guidance encoded in the Playbook structure.
   ═══════════════════════════════════════════════════════════════════ */

const SCREENS = [
  { id: 12, num: '12', name: 'Playbook Builder',   uc: 'UC-ON-01', states: [['happy','Happy path'], ['cold','No presets matched'], ['rbac','Out-of-scope prompt']] },
  { id: 13, num: '13', name: 'Generation Stage',   uc: 'UC-ON-01', states: [['mid','Mid-stream'], ['complete','Complete'], ['partial','Section failed']] },
  { id: 14, num: '14', name: 'Onboarder Dashboard',uc: 'UC-ON-02', states: [['happy','Happy path'], ['cold','No playbook yet']] },
  { id: 15, num: '15', name: 'Playbook Reading',   uc: 'UC-ON-02', states: [['reading','Reading'], ['entity','Entity hover'], ['copilot','Copilot active'], ['restricted','Restricted section']] },
  { id: 16, num: '16', name: 'Full Graph View',    uc: 'UC-ON-02', states: [['happy','Happy path'], ['filtered','Filtered']] },
];

export default function S4OnboardingGenRead() {
  const [screenId, setScreenId] = useState(12);
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

      {/* Completion glow keyframe — used only on Screen 13 */}
      <style>{`
        @keyframes completionGlow {
          0% { box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.45), 0 0 16px rgba(245, 158, 11, 0.35); }
          100% { box-shadow: 0 0 0 0px rgba(245, 158, 11, 0), 0 0 0px rgba(245, 158, 11, 0); }
        }
        .completion-glow { animation: completionGlow 800ms ease-out; }
      `}</style>

      {/* Brand + screen nav */}
      <header className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between shrink-0 gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
          <span className="text-gray-900 font-semibold tracking-[0.18em] text-xs" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>ART-EEP</span>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-gray-500 text-xs">Sprint 4 · Onboarding</span>
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

      <main className="flex-1 overflow-y-auto">
        {screenId === 12 && <Screen12Builder state={stateKey} onGenerate={() => advance(13)} />}
        {screenId === 13 && <Screen13Generation state={stateKey} onView={() => advance(14)} />}
        {screenId === 14 && <Screen14OnboarderDashboard state={stateKey} onOpen={() => advance(15)} />}
        {screenId === 15 && <Screen15PlaybookReading state={stateKey} onGraph={() => advance(16)} />}
        {screenId === 16 && <Screen16FullGraph state={stateKey} />}
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 12 — PLAYBOOK BUILDER (UC-ON-01)
   Hà Vy configures the Playbook before generation
   ═══════════════════════════════════════════════════════════════════ */
function Screen12Builder({ state, onGenerate }) {
  const cold = state === 'cold';
  const rbac = state === 'rbac';

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Breadcrumb path={['Onboarding', 'New playbook for Trần Hữu Nam']} />
      <PageHeader
        title="Build Trần Hữu Nam's onboarding playbook"
        subtitle="Configure what gets generated. The AI builds from Minh Lê's verified handover and the company knowledge graph."
        actor="Hà Vy · Manager"
      />

      {/* Knowledge Layer chip — system readiness */}
      <div className="rounded-md border border-emerald-200 bg-emerald-50/40 px-3 py-2 mb-6 flex items-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
        <p className="text-[12px] text-emerald-900">
          <strong>Knowledge layer ready.</strong> 47 verified items from Minh Lê's handover · 318 entities in the engineering subgraph.
        </p>
      </div>

      {rbac && (
        <Banner tone="critical" icon={Lock}>
          <strong>That prompt is outside your access scope.</strong> "Compensation history" requires HR-Admin permissions, which your Manager role doesn't include. The prompt has been removed. To pursue this, ask your HR admin to either generate a separate playbook or escalate your access.
        </Banner>
      )}

      {/* Smart Presets */}
      <FormSection
        title="Smart presets"
        subtitle={cold ? "We couldn't auto-match presets to this role. You can browse manually or start from a custom prompt below." : "Generated from the role profile and the seeded handover context."}
      >
        {cold ? (
          <div className="rounded-md border border-gray-200 border-dashed bg-white p-6 text-center">
            <p className="text-sm text-gray-600 mb-3">No presets matched Trần Hữu Nam's role profile closely enough.</p>
            <button className="px-3 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors">
              Browse all presets
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            <PresetCard
              title="Senior Backend Engineer onboarding"
              rationale="Matches Trần Hữu Nam's role exactly · uses Minh Lê's handover as primary source"
              sections="6 sections"
              selected
            />
            <PresetCard
              title="Departing-engineer transition"
              rationale="High overlap with the handover topics · adds first-90-day priorities"
              sections="5 sections"
            />
            <PresetCard
              title="Critical-incident response"
              rationale="Payment Gateway timeout matches Critical pattern"
              sections="3 sections"
            />
            <PresetCard
              title="Vendor relationship handoff"
              rationale="Vendor XYZ renewal flagged as Manager priority"
              sections="2 sections"
            />
          </div>
        )}
      </FormSection>

      {/* Custom Prompts */}
      <FormSection
        title="Custom prompts"
        subtitle="Anything not covered by the presets. The AI confirms its interpretation before generation."
      >
        {/* Existing custom prompts */}
        {!cold && !rbac && (
          <div className="space-y-2 mb-3">
            <CustomPromptChip
              text="Spend extra time on the Payment Gateway timeout — Trần Hữu Nam will likely hit it in week one"
              interpretation="Generate a runbook-style section with symptoms, fix procedure, and rollback steps"
            />
            <CustomPromptChip
              text="Cover the Vendor XYZ renewal context including the Linh Pham relationship"
              interpretation="Include vendor relationship section with named contacts and SLA terms"
            />
          </div>
        )}

        {/* Composer */}
        <div className="rounded-md border border-gray-200 bg-white p-3 focus-within:border-gray-400 transition-colors">
          {rbac && (
            <div className="rounded border border-rose-200 bg-rose-50/40 px-2 py-1.5 mb-2 text-[11px] text-rose-800 flex items-start gap-1.5">
              <X className="w-3 h-3 mt-0.5 shrink-0" />
              <span>
                <strong>Rejected:</strong> "What was Minh Lê's compensation history?" — outside scope
              </span>
            </div>
          )}
          <textarea
            placeholder="For example: 'Cover the off-hours escalation paths the team relies on.'"
            className="w-full min-h-[60px] resize-none outline-none text-sm placeholder:text-gray-400 text-gray-900"
            style={{ fontFamily: 'inherit' }}
          />
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-[10px] text-gray-400 inline-flex items-center gap-1">
              <Wand2 className="w-3 h-3" />
              AI will confirm its interpretation before adding to the queue
            </span>
            <button className="px-2.5 py-1 rounded-md bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors">
              <Plus className="w-3 h-3" />
              Add prompt
            </button>
          </div>
        </div>
      </FormSection>

      {/* Audience & Scope */}
      <FormSection title="Audience & scope" subtitle="Who reads it, and what they can see.">
        <div className="grid grid-cols-3 gap-2.5">
          <ScopeField label="Onboarder" value="Trần Hữu Nam" />
          <ScopeField label="Role" value="Senior Backend Engineer" />
          <ScopeField label="Access level" value="Level 3 · Standard" />
        </div>
      </FormSection>

      {/* Summary + Generate */}
      <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-4 mb-6 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium mb-1">Ready to generate</div>
          <p className="text-sm text-gray-900">
            <strong>{cold ? '0' : '1'} preset</strong> · <strong>{cold || rbac ? '0' : '2'} custom prompts</strong> · approximately <strong>{cold ? '0' : '6 sections'}</strong> · 28 source items
          </p>
        </div>
        <button
          onClick={onGenerate}
          disabled={cold}
          className={`px-4 py-2 rounded-md text-sm font-medium inline-flex items-center gap-2 transition-colors ${
            cold ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800 text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Generate playbook
        </button>
      </div>

      <p className="text-center text-[11px] text-gray-400">
        Generation typically takes 5–15 minutes depending on scope. You'll get an email when it's ready to review.
      </p>
    </div>
  );
}

function PresetCard({ title, rationale, sections, selected }) {
  return (
    <button className={`text-left rounded-lg border bg-white p-3 transition-all ${
      selected ? 'border-gray-900 ring-1 ring-gray-900/5' : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-start gap-2 mb-1">
        {selected ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" fill="currentColor" />
        ) : (
          <span className="w-3.5 h-3.5 rounded-full border border-gray-300 shrink-0 mt-0.5" />
        )}
        <h3 className="text-sm font-semibold text-gray-900 leading-tight">{title}</h3>
      </div>
      <p className="text-[11px] text-gray-600 leading-relaxed mb-2 ml-5">{rationale}</p>
      <span className="text-[10px] text-gray-500 ml-5" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{sections}</span>
    </button>
  );
}

function CustomPromptChip({ text, interpretation }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-3">
      <div className="flex items-start gap-2 mb-2">
        <MessageCircle className="w-3 h-3 text-gray-500 shrink-0 mt-1" />
        <p className="text-[13px] text-gray-900 leading-relaxed flex-1">{text}</p>
        <div className="flex items-center gap-1 shrink-0">
          <button className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
            <Pencil className="w-3 h-3" />
          </button>
          <button className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-rose-700 transition-colors">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className="ml-5 pl-2 border-l border-amber-200">
        <div className="flex items-center gap-1.5 mb-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium">AI will interpret as</span>
        </div>
        <p className="text-[11px] text-gray-700 italic leading-relaxed">{interpretation}</p>
      </div>
    </div>
  );
}

function ScopeField({ label, value }) {
  return (
    <div className="px-3 py-2 rounded-md border border-gray-200 bg-white">
      <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium mb-0.5">{label}</div>
      <div className="text-sm text-gray-900 font-medium">{value}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 13 — GENERATION STAGE (UC-ON-01)
   The cinematic moment · completion glow animation lives here
   ═══════════════════════════════════════════════════════════════════ */
function Screen13Generation({ state, onView }) {
  const isMid = state === 'mid';
  const isComplete = state === 'complete';
  const isPartial = state === 'partial';

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Breadcrumb path={['Onboarding', "Trần Hữu Nam's playbook", 'Generating']} />

      {isComplete ? (
        <>
          <PageHeader
            eyebrow="Generation complete · 7m 42s"
            title="Trần Hữu Nam's playbook is ready"
            subtitle="6 sections, 38 knowledge items, 14 inline entities. Ready for your review before release."
            actor="Hà Vy · Manager"
          />
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-white border border-emerald-200 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Review before releasing</h3>
                <p className="text-xs text-gray-600">You can adjust any section, swap sources, or release as-is.</p>
              </div>
            </div>
            <button
              onClick={onView}
              className="px-3 py-1.5 rounded-md bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              Open playbook
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      ) : (
        <PageHeader
          eyebrow={isPartial ? 'Generation paused · 1 section failed' : 'Generating · approx. 4 min remaining'}
          title="Building Trần Hữu Nam's playbook"
          subtitle={isPartial ? "Most sections completed. One section couldn't be drafted — retry it or release without." : "The AI is drafting each section from the seeded context. You can leave this page — we'll notify you when it's done."}
          actor="Hà Vy · Manager"
        />
      )}

      {isPartial && (
        <Banner tone="warning" icon={AlertCircle}>
          <strong>"Customer Portal infra" couldn't be drafted.</strong> Worker Agent confidence stayed below threshold across 3 attempts. We didn't escalate further because the source data is sparse — retrying probably won't help unless you add a custom prompt or new source.
        </Banner>
      )}

      {/* Sections */}
      <div className="space-y-3 mb-6">
        <GenerationSection
          step={1}
          title="Your role & responsibilities at the company"
          status="complete"
          itemCount={6}
          confidence="verified"
          glowOnComplete
          newlyComplete={isMid}
        />
        <GenerationSection
          step={2}
          title="Project Atlas — architecture decisions you'll inherit"
          status="complete"
          itemCount={8}
          confidence="verified"
        />
        <GenerationSection
          step={3}
          title="Payment Gateway timeout — runbook"
          severity="critical"
          status={isMid ? 'drafting' : 'complete'}
          itemCount={isMid ? null : 5}
          confidence={isMid ? null : 'verified'}
          partialText={isMid ? "When the gateway fails between 2 and 4 AM, the first action is to check the connection pool service status. The most common cause is the nightly batch job holding open" : null}
        />
        <GenerationSection
          step={4}
          title="Vendor XYZ renewal — context and named contacts"
          severity="high"
          status={isMid ? 'pending' : 'complete'}
          itemCount={isMid ? null : 4}
          confidence={isMid ? null : 'verified'}
        />
        <GenerationSection
          step={5}
          title="Customer Portal infra configuration"
          status={isMid ? 'pending' : isPartial ? 'failed' : 'complete'}
          itemCount={isMid || isPartial ? null : 3}
          confidence={isPartial ? null : isMid ? null : 'low'}
        />
        <GenerationSection
          step={6}
          title="First 30 days — recommended priorities"
          status={isMid ? 'pending' : 'complete'}
          itemCount={isMid ? null : 5}
          confidence={isMid ? null : 'verified'}
        />
      </div>

      {/* Agent Activity */}
      <FormSection title="Agent activity" subtitle="Plain-English status of the generation pipeline.">
        <div className="rounded-md border border-gray-200 bg-gray-50/60 p-3 space-y-1.5" style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 11 }}>
          {isComplete && (
            <>
              <AgentLine time="16:48:11">All sections complete · summary generated · ready for review</AgentLine>
              <AgentLine time="16:47:55">Section 6 verified by source attribution check</AgentLine>
              <AgentLine time="16:47:32">Section 5 escalated Worker → Expert (low confidence on infra config)</AgentLine>
            </>
          )}
          {isMid && (
            <>
              <AgentLine time="16:44:08" active>Section 3 drafting · Payment Gateway timeout · retrieval strategy: GraphRAG Local</AgentLine>
              <AgentLine time="16:43:51">Section 2 complete · verified against 4 source items</AgentLine>
              <AgentLine time="16:43:22">Section 1 complete · ComplexityScore=0.31 · routed Worker</AgentLine>
            </>
          )}
          {isPartial && (
            <>
              <AgentLine time="16:51:02">Generation paused awaiting Manager input on Section 5</AgentLine>
              <AgentLine time="16:50:48" warning>Section 5 failed · Worker Agent confidence 0.42 (threshold 0.65) · 3 attempts · no escalation due to sparse source data</AgentLine>
              <AgentLine time="16:48:33">Section 6 complete · verified by source attribution check</AgentLine>
            </>
          )}
        </div>
      </FormSection>

      {/* Action bar — only on partial state */}
      {isPartial && (
        <div className="flex items-center justify-between pt-2 pb-4 border-t border-gray-200 mt-6">
          <span className="text-xs text-gray-500">5 of 6 sections complete</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors">
              Release without section 5
            </button>
            <button className="px-3 py-1.5 rounded-md border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-sm font-medium inline-flex items-center gap-1.5 transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Add custom prompt for section 5
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function GenerationSection({ step, title, status, itemCount, confidence, severity, partialText, newlyComplete }) {
  const statusCfg = {
    pending:    { label: 'Pending',   cls: 'text-gray-400', borderCls: 'border-gray-200 bg-gray-50/60' },
    drafting:   { label: 'Drafting',  cls: 'text-amber-700 font-medium', borderCls: 'border-amber-200 bg-amber-50/30' },
    complete:   { label: 'Complete',  cls: 'text-emerald-700 font-medium', borderCls: 'border-gray-200 bg-white' },
    failed:     { label: 'Failed',    cls: 'text-rose-700 font-medium', borderCls: 'border-rose-200 bg-rose-50/30' },
  }[status];

  const severityColor = {
    critical: 'rgb(244, 63, 94)',
    high: 'rgb(245, 158, 11)',
  };

  return (
    <article
      className={`rounded-lg border ${statusCfg.borderCls} px-4 py-3 transition-all ${newlyComplete && status === 'complete' ? 'completion-glow' : ''}`}
      style={severity ? { borderLeft: `2px solid ${severityColor[severity]}` } : undefined}
    >
      <div className="flex items-start justify-between gap-3 mb-1">
        <div className="flex items-baseline gap-2 min-w-0 flex-1">
          <span className="text-[10px] text-gray-400 shrink-0" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>0{step}</span>
          <h3 className="text-sm font-semibold text-gray-900 leading-tight">{title}</h3>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {status === 'drafting' && <Loader2 className="w-3 h-3 text-amber-600 animate-spin" />}
          {status === 'failed' && <AlertCircle className="w-3 h-3 text-rose-600" />}
          {status === 'complete' && <CheckCircle2 className="w-3 h-3 text-emerald-600" fill="currentColor" />}
          <span className={`text-[10px] uppercase tracking-wider font-semibold ${statusCfg.cls}`}>
            {statusCfg.label}
          </span>
        </div>
      </div>

      {/* Drafting state — show partial text with cursor */}
      {status === 'drafting' && partialText && (
        <div className="mt-2 text-[12px] text-gray-700 leading-relaxed">
          {partialText}
          <span className="inline-block w-0.5 h-3 bg-gray-900 ml-0.5 align-middle animate-pulse" />
        </div>
      )}

      {/* Pending state — skeleton shimmer */}
      {status === 'pending' && (
        <div className="mt-2 space-y-1.5">
          <div className="h-2 rounded bg-gray-200/70 animate-pulse" style={{ width: '85%' }} />
          <div className="h-2 rounded bg-gray-200/70 animate-pulse" style={{ width: '65%' }} />
        </div>
      )}

      {/* Complete state — metadata */}
      {status === 'complete' && (
        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-gray-500 flex-wrap">
          <span style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{itemCount} items</span>
          {confidence === 'verified' && (
            <>
              <span className="text-gray-300">·</span>
              <span className="text-emerald-700 inline-flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" />
                Verified
              </span>
            </>
          )}
          {confidence === 'low' && (
            <>
              <span className="text-gray-300">·</span>
              <span className="text-amber-700 inline-flex items-center gap-1">
                <AlertTriangle className="w-2.5 h-2.5" />
                Low confidence — review carefully
              </span>
            </>
          )}
        </div>
      )}

      {/* Failed state — retry */}
      {status === 'failed' && (
        <div className="mt-2 text-[12px] text-rose-800">
          Worker Agent confidence stayed below threshold. Source data is sparse.
        </div>
      )}
    </article>
  );
}

function AgentLine({ time, children, active, warning }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-gray-400 shrink-0">{time}</span>
      <span className={active ? 'text-amber-700' : warning ? 'text-rose-700' : 'text-gray-600'}>
        {active && '▸ '}
        {warning && '! '}
        {children}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 14 — ONBOARDER DASHBOARD (UC-ON-02)
   Trần Hữu Nam arrives on Day 1
   ═══════════════════════════════════════════════════════════════════ */
function Screen14OnboarderDashboard({ state, onOpen }) {
  if (state === 'cold') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <PageHeader
          title="Welcome to ART-EEP, Trần Hữu Nam"
          subtitle="Your onboarding playbook isn't quite ready yet. Check back later — usually within a few hours of your start date."
          actor="Trần Hữu Nam · Onboarder"
        />
        <div className="rounded-lg border border-gray-200 bg-white p-12 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-4">
            <Clock className="w-5 h-5 text-gray-400" strokeWidth={1.75} />
          </div>
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Playbook is being prepared</h2>
          <p className="text-sm text-gray-600 max-w-sm">
            Your manager, Hà Vy, is finalizing the content. You'll get an email when it's ready to open.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader
        eyebrow="Day 1 · welcome"
        title="Hello, Trần Hữu Nam"
        subtitle="Your onboarding playbook is ready. Hà Vy and Minh Lê built this for you — start whenever you're ready."
        actor="Trần Hữu Nam · Onboarder"
      />

      {/* Primary playbook card */}
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden mb-6 hover:border-gray-300 transition-colors">
        <div className="p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 text-gray-700" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-gray-900">Senior Backend Engineer · onboarding playbook</h3>
                <p className="text-xs text-gray-500 mt-0.5">6 sections · 38 items · estimated read time 45 minutes</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-[10px] px-1.5 py-0.5 rounded border bg-rose-50 border-rose-200 text-rose-700 uppercase tracking-wider font-semibold inline-flex items-center gap-1">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    1 Critical
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded border bg-amber-50 border-amber-200 text-amber-700 uppercase tracking-wider font-semibold">
                    1 High
                  </span>
                  <span className="text-[10px] text-gray-500">· built from Minh Lê's verified handover</span>
                </div>
              </div>
            </div>
            <button
              onClick={onOpen}
              className="px-3 py-1.5 rounded-md bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium inline-flex items-center gap-1.5 transition-colors shrink-0"
            >
              Open playbook
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Context tiles */}
      <div className="grid grid-cols-3 gap-3">
        <ContextTile
          icon={Users}
          title="Your team"
          items={['Hà Vy · Manager', '4 engineers · Backend platform', 'Minh Lê · departing (2 weeks)']}
        />
        <ContextTile
          icon={Briefcase}
          title="First-week priorities"
          items={['Set up dev environment', 'Pair with Minh Lê × 2 sessions', 'Read Project Atlas docs']}
        />
        <ContextTile
          icon={Sparkles}
          title="Ask the AI anytime"
          items={['Inline copilot on the playbook', "Anchors to whatever you're reading", 'Cites its sources']}
        />
      </div>
    </div>
  );
}

function ContextTile({ icon: Icon, title, items }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <Icon className="w-4 h-4 text-gray-500 mb-2.5" strokeWidth={1.75} />
      <h4 className="text-xs uppercase tracking-[0.18em] text-gray-500 font-medium mb-2">{title}</h4>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={i} className="text-[12px] text-gray-700 leading-relaxed flex items-start gap-1.5">
            <span className="text-gray-400 shrink-0 mt-0.5">·</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 15 — PLAYBOOK READING (UC-ON-02)
   Split-screen with Interactive Graph + Persistent Copilot Bar
   ═══════════════════════════════════════════════════════════════════ */
function Screen15PlaybookReading({ state, onGraph }) {
  const showEntity = state === 'entity';
  const showCopilot = state === 'copilot';
  const restricted = state === 'restricted';

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Top bar */}
      <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button className="text-gray-500 hover:text-gray-900 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-gray-900 truncate">Senior Backend Engineer · onboarding playbook</h1>
            <p className="text-[11px] text-gray-500">Built for Trần Hữu Nam by Hà Vy · from Minh Lê's handover</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-gray-500">Section <span className="text-gray-900 font-medium">3</span> of 6</span>
          <div className="w-20 h-1 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full bg-gray-900" style={{ width: '50%' }} />
          </div>
        </div>
      </div>

      {/* Section tabs */}
      <div className="px-5 py-2 border-b border-gray-200 bg-gray-50/60 flex items-center gap-2 shrink-0 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        <SectionTab>Your role</SectionTab>
        <SectionTab>Project Atlas</SectionTab>
        <SectionTab active critical>Payment Gateway timeout</SectionTab>
        <SectionTab>Vendor XYZ renewal</SectionTab>
        <SectionTab>Customer Portal infra</SectionTab>
        <SectionTab>First 30 days</SectionTab>
      </div>

      {/* Split content */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT — Playbook content */}
        <div style={{ width: '45%' }} className="border-r border-gray-200 flex flex-col overflow-hidden bg-white relative">
          <div className="flex-1 overflow-y-auto px-6 py-5">

            {/* Section header */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded border bg-rose-50 border-rose-200 text-rose-700 uppercase tracking-wider font-semibold inline-flex items-center gap-1">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  Critical
                </span>
                <ProvenanceChip source="From:" label="Minh Lê's handover" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Payment Gateway timeout — runbook</h2>
              <p className="text-sm text-gray-600 mt-1">
                You'll likely encounter this in your first month. Minh Lê hit it three times in his last quarter — no formal runbook existed before this playbook.
              </p>
            </div>

            {/* Critical item — auto-expanded */}
            <article className="rounded-lg border border-rose-200 bg-rose-50/20 overflow-hidden mb-3" style={{ borderLeft: '2px solid rgb(244, 63, 94)' }}>
              <div className="px-4 py-3">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-[10px] px-1.5 py-0.5 rounded border bg-rose-50 border-rose-200 text-rose-700 uppercase tracking-wider font-semibold inline-flex items-center gap-1">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    Critical
                  </span>
                  <span className="text-[10px] text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>BUG-404</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded border bg-emerald-50 border-emerald-200 text-emerald-700 font-medium inline-flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Verified
                  </span>
                  <button className="text-[10px] text-gray-400 hover:text-amber-700 transition-colors ml-auto inline-flex items-center gap-1">
                    <Flag className="w-2.5 h-2.5" />
                    Report
                  </button>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Symptoms</h3>
                <p className="text-sm text-gray-700 leading-relaxed mb-3">
                  Visa card payments fail between 2 AM and 4 AM. Customers see a generic "Payment unavailable, please try again later" error. Logs show
                  <button className="text-gray-900 underline decoration-amber-400 decoration-2 underline-offset-2 mx-1 hover:bg-amber-50 transition-colors">
                    connection pool timeout
                  </button>
                  errors against the
                  <button className="text-gray-900 underline decoration-amber-400 decoration-2 underline-offset-2 mx-1 hover:bg-amber-50 transition-colors">
                    Payment Gateway v2
                  </button>
                  service. The pattern has held for three consecutive incidents.
                </p>
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Fix</h3>
                <p className="text-sm text-gray-700 leading-relaxed mb-3">
                  Restart the connection pool service between 2 and 4 AM, after the nightly batch finishes. The likely root cause is the batch job holding the pool open past its lease window. <button className="text-gray-900 underline decoration-amber-400 decoration-2 underline-offset-2 hover:bg-amber-50 transition-colors">Minh Lê</button> opened a ticket to address the lease behavior but it hadn't shipped before his departure.
                </p>

                {showEntity && <EntityMiniCard />}
              </div>
            </article>

            {/* Rollback procedure — from Manager flag */}
            <article className="rounded-lg border border-gray-200 bg-white overflow-hidden mb-3">
              <div className="px-4 py-3">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-[10px] px-1.5 py-0.5 rounded border bg-amber-50 border-amber-200 text-amber-700 uppercase tracking-wider font-semibold">
                    High
                  </span>
                  <span className="text-[10px] text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>RBK-01</span>
                  <span className="text-[10px] text-gray-500">· added at Hà Vy's request</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Rollback if the restart doesn't take</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  If two consecutive restarts don't restore the gateway, fail over to the secondary processor via the
                  <button className="text-gray-900 underline decoration-amber-400 decoration-2 underline-offset-2 mx-1 hover:bg-amber-50 transition-colors">
                    feature flag console
                  </button>
                  (toggle: <code className="bg-gray-100 px-1 rounded text-[12px]">payment.use_secondary_processor</code>). Confirms within 5 minutes. Notify <button className="text-gray-900 underline decoration-amber-400 decoration-2 underline-offset-2 mx-1 hover:bg-amber-50 transition-colors">Hà Vy</button> immediately if you need to do this.
                </p>
              </div>
            </article>

            {/* Restricted item (only in restricted state) */}
            {restricted ? (
              <article className="rounded-lg border border-gray-200 bg-gray-50/60 overflow-hidden mb-3">
                <div className="px-4 py-6 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-700 mb-0.5">Vendor pricing details</h3>
                    <p className="text-[12px] text-gray-500 mb-2">
                      This content needs Level 4 access. Your current access is Level 3. The fix procedure above is complete without it.
                    </p>
                    <button className="text-xs px-2.5 py-1 rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium inline-flex items-center gap-1.5 transition-colors">
                      Request access
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </article>
            ) : (
              <article className="rounded-lg border border-gray-200 bg-white overflow-hidden mb-3">
                <button className="w-full px-4 py-3 flex items-start justify-between gap-3 hover:bg-gray-50/50 transition-colors text-left">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] px-1.5 py-0.5 rounded border bg-gray-100 border-gray-200 text-gray-600 uppercase tracking-wider font-semibold">Medium</span>
                      <span className="text-[10px] text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>HIST-PG-04</span>
                    </div>
                    <h3 className="text-sm text-gray-900 font-semibold">History of similar incidents (collapsed)</h3>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
                </button>
              </article>
            )}
          </div>

          {/* Persistent Copilot Bar */}
          <CopilotBar expanded={showCopilot} />
        </div>

        {/* RIGHT — Interactive Graph */}
        <div style={{ width: '55%' }} className="flex flex-col overflow-hidden bg-gray-50/40">
          <div className="px-5 py-2.5 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-xs uppercase tracking-[0.18em] text-gray-500 font-medium">Spotlight</h2>
              <p className="text-[11px] text-gray-700 mt-0.5">
                Showing entities related to <span className="font-medium text-gray-900">Payment Gateway v2</span>
              </p>
            </div>
            <button
              onClick={onGraph}
              className="px-2.5 py-1 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs inline-flex items-center gap-1.5 transition-colors"
            >
              <Maximize2 className="w-3 h-3" />
              Expand
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <SpotlightGraph />
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTab({ children, active, critical }) {
  return (
    <button className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition-all border shrink-0 ${
      active
        ? 'border-gray-900 bg-white text-gray-900 font-medium'
        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-white hover:border-gray-200'
    }`}>
      {critical && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
      <span>{children}</span>
    </button>
  );
}

function ProvenanceChip({ source, label }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] bg-amber-50/60"
      style={{
        borderLeft: '2px solid rgb(245, 158, 11)',
        borderTop: '1px solid rgb(229, 231, 235)',
        borderRight: '1px solid rgb(229, 231, 235)',
        borderBottom: '1px solid rgb(229, 231, 235)'
      }}
    >
      <Sparkles className="w-2.5 h-2.5 text-amber-600" />
      <span className="text-gray-500">{source}</span>
      <span className="text-gray-900">{label}</span>
    </span>
  );
}

function EntityMiniCard() {
  return (
    <div className="absolute z-10 mt-2 max-w-xs rounded-lg border border-gray-200 bg-white p-3" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
      <div className="flex items-center gap-2 mb-1.5">
        <Network className="w-3 h-3 text-gray-500" />
        <h4 className="text-[12px] font-semibold text-gray-900">Payment Gateway v2</h4>
      </div>
      <p className="text-[11px] text-gray-600 leading-relaxed mb-2">
        Internal service · handles all card payment processing · 1.8M transactions/month
      </p>
      <div className="space-y-0.5 text-[10px]">
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500">Owned by:</span>
          <span className="text-gray-900">Backend platform team</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500">Integrated with:</span>
          <span className="text-gray-900">Vendor XYZ · 7 internal services</span>
        </div>
      </div>
      <button className="mt-2 text-[10px] text-gray-700 hover:text-gray-900 inline-flex items-center gap-1 transition-colors">
        Focus on the graph
        <ArrowRight className="w-2.5 h-2.5" />
      </button>
    </div>
  );
}

function CopilotBar({ expanded }) {
  return (
    <div className="border-t border-gray-200 bg-white shrink-0">
      {expanded && (
        <div className="px-4 py-3 border-b border-gray-100 max-h-64 overflow-y-auto">
          <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium mb-2 flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Copilot
            <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-medium normal-case tracking-normal">
              Anchored to "Payment Gateway timeout"
            </span>
          </div>

          {/* Q&A */}
          <div className="space-y-3">
            <div className="text-[12px] text-gray-900">
              <span className="text-gray-500">You asked: </span>
              What does the connection pool service actually do?
            </div>
            <div className="rounded-md bg-amber-50/40 border border-amber-200 px-3 py-2">
              <p className="text-[12px] text-gray-800 leading-relaxed">
                The connection pool service holds a reusable set of database connections to the Payment Gateway's downstream processors. Without it, every payment request would open a fresh connection — which is slow (~200ms overhead each) and would overwhelm the database during peak load.
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-[10px] text-gray-500">Sources:</span>
                <button className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-gray-200 text-gray-700 hover:border-gray-300 inline-flex items-center gap-1 transition-colors">
                  <FileText className="w-2.5 h-2.5" />
                  Project Atlas docs
                </button>
                <button className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-gray-200 text-gray-700 hover:border-gray-300 inline-flex items-center gap-1 transition-colors">
                  <ExternalLink className="w-2.5 h-2.5" />
                  Minh Lê's interview · 12:18
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-2.5 flex items-center gap-2.5">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <input
          placeholder="Ask anything about your playbook…"
          className="flex-1 text-sm outline-none placeholder:text-gray-400 bg-transparent"
        />
        <button className="w-7 h-7 rounded-md bg-gray-900 hover:bg-gray-800 text-white flex items-center justify-center transition-colors">
          <Send className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SPOTLIGHT GRAPH SVG
   ───────────────────────────────────────────────────────────────── */
function SpotlightGraph() {
  // Highlighted: Payment Gateway v2 (center)
  // Related (full opacity): Minh Lê, Project Atlas, Vendor XYZ
  // Dimmed (30% opacity): Trần Hữu Nam, Hà Vy, Customer Portal, Linh Pham
  return (
    <svg viewBox="0 0 600 480" className="w-full h-full">
      {/* Edges */}
      <g stroke="rgb(229, 231, 235)" strokeWidth="1" fill="none">
        <line x1="300" y1="80" x2="300" y2="200" opacity="0.3" />
        <line x1="300" y1="80" x2="450" y2="80" opacity="0.3" />
        <line x1="300" y1="200" x2="180" y2="300" />
        <line x1="300" y1="200" x2="300" y2="300" />
        <line x1="300" y1="200" x2="440" y2="280" opacity="0.3" />
        <line x1="180" y1="300" x2="300" y2="320" />
        <line x1="450" y1="350" x2="300" y2="320" />
        <line x1="450" y1="410" x2="450" y2="350" opacity="0.3" />
      </g>

      {/* Edge labels — only on highlighted paths */}
      <g fill="rgb(107, 114, 128)" fontSize="9" textAnchor="middle" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>
        <text x="240" y="252" opacity="0.7">maintained</text>
        <text x="300" y="252">maintained</text>
        <text x="375" y="318">integrates_with</text>
      </g>

      {/* Nodes — dimmed first */}
      <GraphNode x={300} y={80} label="Trần Hữu Nam" sublabel="you" dimmed />
      <GraphNode x={450} y={80} label="Hà Vy" sublabel="manager" dimmed />
      <GraphNode x={440} y={280} label="Customer Portal" sublabel="project" dimmed />
      <GraphNode x={450} y={410} label="Linh Pham" sublabel="contact" dimmed />

      {/* Related */}
      <GraphNode x={300} y={200} label="Minh Lê" sublabel="predecessor" />
      <GraphNode x={180} y={300} label="Project Atlas" sublabel="project" />
      <GraphNode x={450} y={350} label="Vendor XYZ" sublabel="vendor" />

      {/* Highlighted */}
      <GraphNode x={300} y={320} label="Payment Gateway v2" sublabel="service" highlighted />
    </svg>
  );
}

function GraphNode({ x, y, label, sublabel, highlighted, dimmed }) {
  const opacity = dimmed ? 0.3 : 1;
  if (highlighted) {
    return (
      <g opacity={opacity}>
        <circle cx={x} cy={y} r={32} fill="rgb(254, 226, 226)" stroke="rgb(244, 63, 94)" strokeWidth="2" />
        <circle cx={x} cy={y} r={6} fill="rgb(244, 63, 94)" />
        <text x={x} y={y + 50} fill="rgb(17, 24, 39)" fontSize="11" fontWeight="600" textAnchor="middle">{label}</text>
        <text x={x} y={y + 64} fill="rgb(107, 114, 128)" fontSize="9" textAnchor="middle">{sublabel}</text>
      </g>
    );
  }
  return (
    <g opacity={opacity}>
      <circle cx={x} cy={y} r={20} fill="white" stroke="rgb(209, 213, 219)" strokeWidth="1" />
      <circle cx={x} cy={y} r={4} fill="rgb(156, 163, 175)" />
      <text x={x} y={y + 36} fill="rgb(55, 65, 81)" fontSize="10" fontWeight="500" textAnchor="middle">{label}</text>
      <text x={x} y={y + 48} fill="rgb(156, 163, 175)" fontSize="9" textAnchor="middle">{sublabel}</text>
    </g>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 16 — FULL GRAPH VIEW (UC-ON-02 AC.2)
   Expanded canvas with pan / zoom / filter
   ═══════════════════════════════════════════════════════════════════ */
function Screen16FullGraph({ state }) {
  const filtered = state === 'filtered';
  return (
    <div className="h-full flex flex-col bg-gray-50/60">
      {/* Top bar */}
      <div className="px-5 py-3 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button className="text-gray-500 hover:text-gray-900 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-semibold text-gray-900">Knowledge graph · full view</h1>
            <p className="text-[11px] text-gray-500">Trần Hữu Nam's accessible subgraph · 8 entities · 7 relationships</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs inline-flex items-center gap-1.5 transition-colors">
            <Filter className="w-3 h-3" />
            {filtered ? 'Showing: People + Projects only' : 'Filter'}
          </button>
          <div className="flex items-center gap-0.5">
            <button className="p-1 rounded hover:bg-gray-100 text-gray-500 transition-colors">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button className="p-1 rounded hover:bg-gray-100 text-gray-500 transition-colors">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <FullGraphSvg filtered={filtered} />
        </div>

        {/* Side panel */}
        <div className="w-72 border-l border-gray-200 bg-white overflow-y-auto shrink-0">
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Network className="w-3.5 h-3.5 text-gray-500" />
              <h2 className="text-sm font-semibold text-gray-900">Payment Gateway v2</h2>
            </div>
            <p className="text-[11px] text-gray-500">Internal service · selected</p>
          </div>

          <div className="px-4 py-3 space-y-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium mb-1.5">Connections · 4</div>
              <div className="space-y-1.5">
                <ConnectionRow type="maintained_by" target="Minh Lê" />
                <ConnectionRow type="part_of" target="Project Atlas" />
                <ConnectionRow type="integrates_with" target="Vendor XYZ" />
                <ConnectionRow type="related_to" target="Customer Portal" />
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium mb-1.5">Mentioned in your playbook</div>
              <div className="space-y-1.5">
                <button className="w-full text-left rounded-md border border-gray-200 px-2.5 py-1.5 hover:border-gray-300 transition-colors">
                  <div className="text-[11px] font-medium text-gray-900">Payment Gateway timeout — runbook</div>
                  <div className="text-[10px] text-gray-500">Section 3 · Critical</div>
                </button>
                <button className="w-full text-left rounded-md border border-gray-200 px-2.5 py-1.5 hover:border-gray-300 transition-colors">
                  <div className="text-[11px] font-medium text-gray-900">Architecture decisions</div>
                  <div className="text-[10px] text-gray-500">Section 2</div>
                </button>
              </div>
            </div>

            <button className="w-full px-2.5 py-1.5 rounded-md bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors">
              <Eye className="w-3 h-3" />
              Read the runbook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConnectionRow({ type, target }) {
  return (
    <div className="flex items-center justify-between gap-2 text-[11px] py-1">
      <span className="text-gray-500 truncate" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{type}</span>
      <span className="text-gray-900 font-medium truncate">{target}</span>
    </div>
  );
}

function FullGraphSvg({ filtered }) {
  const showPortal = !filtered || true; // Portal is a project, stays in filtered view
  return (
    <svg viewBox="0 0 800 600" className="w-full h-full">
      {/* Edges */}
      <g stroke="rgb(209, 213, 219)" strokeWidth="1" fill="none">
        <line x1="400" y1="100" x2="400" y2="240" />
        <line x1="400" y1="100" x2="600" y2="100" />
        <line x1="400" y1="240" x2="220" y2="340" />
        <line x1="400" y1="240" x2="400" y2="380" />
        <line x1="400" y1="240" x2="580" y2="340" />
        <line x1="220" y1="340" x2="400" y2="380" />
        <line x1="580" y1="340" x2="400" y2="380" />
        {!filtered && <line x1="600" y1="450" x2="580" y2="340" />}
      </g>

      {/* Nodes */}
      <FullGraphNode x={400} y={100} label="Trần Hữu Nam" sublabel="you" kind="person" highlighted={false} />
      <FullGraphNode x={600} y={100} label="Hà Vy" sublabel="manager" kind="person" />
      <FullGraphNode x={400} y={240} label="Minh Lê" sublabel="predecessor" kind="person" />
      <FullGraphNode x={220} y={340} label="Project Atlas" sublabel="project" kind="project" />
      <FullGraphNode x={400} y={380} label="Payment Gateway v2" sublabel="service" kind="service" highlighted />
      <FullGraphNode x={580} y={340} label="Vendor XYZ" sublabel="vendor" kind="vendor" dimmed={filtered} />
      {!filtered && <FullGraphNode x={600} y={450} label="Linh Pham" sublabel="contact" kind="person" />}
      <FullGraphNode x={620} y={250} label="Customer Portal" sublabel="project" kind="project" />
    </svg>
  );
}

function FullGraphNode({ x, y, label, sublabel, kind, highlighted, dimmed }) {
  const fillByKind = {
    person:  'rgb(249, 250, 251)',
    project: 'rgb(249, 250, 251)',
    service: 'rgb(249, 250, 251)',
    vendor:  'rgb(249, 250, 251)',
  };
  const opacity = dimmed ? 0.3 : 1;
  if (highlighted) {
    return (
      <g opacity={opacity}>
        <circle cx={x} cy={y} r={40} fill="rgb(254, 226, 226)" stroke="rgb(244, 63, 94)" strokeWidth="2" />
        <circle cx={x} cy={y} r={8} fill="rgb(244, 63, 94)" />
        <text x={x} y={y + 60} fill="rgb(17, 24, 39)" fontSize="12" fontWeight="600" textAnchor="middle">{label}</text>
        <text x={x} y={y + 76} fill="rgb(107, 114, 128)" fontSize="10" textAnchor="middle">{sublabel}</text>
      </g>
    );
  }
  return (
    <g opacity={opacity}>
      <circle cx={x} cy={y} r={26} fill={fillByKind[kind]} stroke="rgb(209, 213, 219)" strokeWidth="1" />
      <circle cx={x} cy={y} r={5} fill="rgb(156, 163, 175)" />
      <text x={x} y={y + 42} fill="rgb(55, 65, 81)" fontSize="11" fontWeight="500" textAnchor="middle">{label}</text>
      <text x={x} y={y + 56} fill="rgb(156, 163, 175)" fontSize="9" textAnchor="middle">{sublabel}</text>
    </g>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SHARED PIECES
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
