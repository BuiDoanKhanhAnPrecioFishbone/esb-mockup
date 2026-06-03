"use client";

import React, { useState } from "react";
import {
  ChevronLeft, ChevronRight, Check, AlertTriangle, Info, Clock,
  Bell, Calendar, GitBranch, Github, Folder, Users, Briefcase,
  ShieldCheck, Sparkles, Loader2, Database, ArrowRight, ArrowUpRight,
  Tag, MessageSquare, FileText, Layers, CheckCircle2, Pencil,
  ChevronDown, Network, Plus, Eye, Hash, History, Mic
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   UC-HO-01 · Normal Flow — Sprint 1 happy path

   8 clickable states walking the complete UC-HO-01 v2.1 happy path
   from dashboard entry through Phase 2 transition. Built on the
   current definition · 3-phase lifecycle (CL-088), approved shared
   workspaces only (CL-087 — Jira / GitHub / Google Drive shared),
   one-click initiation, command-view route at /session/[id] (CL-089).

     S1 · Dashboard · new from HR sync
     S2 · Quick-initiate · HR-pre-filled defaults
     S3 · Quick-initiate · customize expander opened
     S4 · Command view · Phase 1 Prepare starts (seeding queued)
     S5 · Command view · Phase 1 mid-seeding (GitHub extracting)
     S6 · Command view · Phase 1 complete (Knowledge Map ready)
     S7 · Command view · Next Action cards surfaced
     S8 · Dashboard · session now in Phase 2 Capture

   Canonical scenario · Hà Vy initiating a handover for Minh Lê
   (Senior Backend Engineer · Engineering · last working date
   June 4 · 12 days remaining).

   Honors the locked S1 v2 visual system:
     · CL-054 violet primary + pastel yellow secondary
     · CL-055 primary CTAs · 32px button height
     · CL-013 "sensitivity classification" (no vendor names)
     · CL-016 knowledge gaps as warm guidance (yellow dot bullets)
     · CL-020 audit anchor as ambient context
     · CL-059 explicit focus rings
     · CL-088 3-phase progress bar with within-phase sub-stage fill
   ═══════════════════════════════════════════════════════════════════ */

const FLOW = [
  { id: "s1", uc: "Step 1",  label: "Dashboard · new from HR sync",          trigger: "System detects HR sync · Hà Vy opens her dashboard." },
  { id: "s2", uc: "Step 2",  label: "Quick-initiate · HR-pre-filled",       trigger: "Hà Vy clicks Start setup · navigates to /session/[id]/setup." },
  { id: "s3", uc: "Step 3",  label: "Quick-initiate · customize",            trigger: "Hà Vy clicks Customize before starting · expander opens inline." },
  { id: "s4", uc: "Step 4",  label: "Command view · Phase 1 starts",         trigger: "Hà Vy clicks Start session · navigates to /session/[id] · Phase 1 begins." },
  { id: "s5", uc: "Step 5",  label: "Command view · mid-seeding",            trigger: "Background pipeline runs · GitHub extracting · Hà Vy can leave the page." },
  { id: "s6", uc: "Step 6",  label: "Command view · Knowledge Map ready",   trigger: "Seeding complete · sub-stage 3 of 3 in Phase 1 reached." },
  { id: "s7", uc: "Step 7",  label: "Command view · Next Actions",          trigger: "Offboarder notified · Hà Vy sees Schedule interview + Add priority prompts." },
  { id: "s8", uc: "Step 8",  label: "Dashboard · Phase 2 Capture",          trigger: "Hà Vy returns to /dashboard · Minh Lê's session now shows Phase 2 active." },
];

const SCENARIO = {
  name: "Minh Lê",
  role: "Senior Backend Engineer",
  dept: "Engineering",
  lastDay: "June 4, 2026",
  daysLeft: 12,
  successor: "Trần Hữu Nam",
  sessionId: "SESSION-2026-05-29-7a3c",
};

export default function UCHO01NormalFlow() {
  const [stepIdx, setStepIdx] = useState(0);
  const step = FLOW[stepIdx];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      <TopBar step={step} stepIdx={stepIdx} onJump={setStepIdx} />
      <main className="flex-1">
        <StateRenderer id={step.id} />
      </main>
      <FooterNav stepIdx={stepIdx} step={step} onChange={setStepIdx} />
    </div>
  );
}

/* ─── Chrome ──────────────────────────────────────────────────── */

function TopBar({ step, stepIdx, onJump }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="px-5 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
          <span className="text-gray-900 font-semibold tracking-[0.18em] text-xs" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>ART-EEP</span>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-gray-500 text-xs">UC-HO-01 · Normal flow</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-gray-500 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="uppercase tracking-wider font-semibold text-emerald-700">Happy path</span>
          <span className="text-gray-300">·</span>
          <span className="text-gray-700" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{step.uc}</span>
        </div>
      </div>
      <div className="px-5 pb-2 flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-sm font-semibold text-gray-900 truncate">
            {stepIdx + 1} of {FLOW.length} · {step.label}
          </h1>
          <p className="text-[11px] text-gray-500 mt-0.5 truncate">
            Scenario · <span className="text-gray-700 font-medium">{SCENARIO.name}</span> · {SCENARIO.role}
          </p>
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
        active ? "bg-violet-600 text-white border-violet-600" : "bg-white text-violet-700 border-violet-200 hover:border-violet-400"
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

function StateRenderer({ id }) {
  if (id === "s1") return <S1Dashboard />;
  if (id === "s2") return <S2QuickInitiateDefault />;
  if (id === "s3") return <S3QuickInitiateCustomize />;
  if (id === "s4") return <S4CommandPhase1Start />;
  if (id === "s5") return <S5CommandMidSeeding />;
  if (id === "s6") return <S6CommandKnowledgeMap />;
  if (id === "s7") return <S7CommandNextActions />;
  if (id === "s8") return <S8DashboardPhase2 />;
  return null;
}

/* ═══════════════════════════════════════════════════════════════════
   S1 · Dashboard · new from HR sync
   ═══════════════════════════════════════════════════════════════════ */

function S1Dashboard() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <PageHeader
        eyebrow="Handover dashboard · /dashboard"
        title="Good afternoon, Hà Vy"
        subtitle="Three active handover sessions. One new arrival from HR sync — start when you're ready."
        actor="Hà Vy · Manager · Engineering"
      />

      <SectionLabel count={3}>Active sessions</SectionLabel>
      <div className="space-y-3 mb-8">
        <SessionCard
          name="Khánh Linh Trần"
          role="Head of People Operations · People & Culture"
          daysLeft={2}
          urgent
          phaseIdx={0}
          subStage="Setup confirmed"
          subStageIdx={0}
          sources={[
            { icon: Users, label: "HRIS · 240 records" },
            { icon: FileText, label: "Notion · 38 policy pages" },
            { icon: Folder, label: "SharePoint · 92 files" },
          ]}
        />
        <SessionCard
          name="Phương Anh Nguyễn"
          role="Senior Account Executive · Sales"
          daysLeft={6}
          phaseIdx={1}
          subStage="Voice interview"
          subStageIdx={1}
          sources={[
            { icon: Briefcase, label: "Salesforce · 38 deals" },
            { icon: Calendar, label: "Shared Calendar · 6 months" },
            { icon: Folder, label: "SharePoint · 124 files" },
          ]}
        />
        <SessionCard
          name={SCENARIO.name}
          role={`${SCENARIO.role} · ${SCENARIO.dept}`}
          daysLeft={SCENARIO.daysLeft}
          newFromSync
          phaseIdx={null}
          subStage="Ready to initiate"
          sources={[
            { icon: GitBranch, label: "Jira · 47 active tickets" },
            { icon: Github, label: "GitHub · 23 shared repos" },
            { icon: Folder, label: "Google Drive · 412 files" },
          ]}
          ctaLabel="Start setup"
          ctaPrimary
        />
      </div>

      <SectionLabel>Recent activity</SectionLabel>
      <div className="space-y-1.5">
        <AuditTile timestamp="2026-05-29 14:18:42" actor="System" action="Detected new departure record from HR sync · Minh Lê" severity="medium" />
        <AuditTile timestamp="2026-05-22 16:42:08" actor="System" action="Trần Hữu Nam's onboarding playbook released — built from Minh Lê's verified handover" severity="low" />
      </div>
    </div>
  );
}

function SessionCard({ name, role, daysLeft, urgent, newFromSync, phaseIdx, subStage, subStageIdx, sources, ctaLabel, ctaPrimary }) {
  const urgencyBorder = urgent ? "border-l-[2px] border-l-rose-500" : "";
  const daysClass = daysLeft <= 3 ? "text-rose-700 font-semibold" : daysLeft <= 5 ? "text-rose-600" : "text-gray-700";
  return (
    <article className={`rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-colors ${urgencyBorder}`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {newFromSync && (
                <span className="text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold bg-violet-50 border border-violet-200 text-violet-700">New from HR sync</span>
              )}
              {urgent && (
                <span className="text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold bg-rose-100 border border-rose-200 text-rose-700">Urgent</span>
              )}
            </div>
            <h3 className="text-base font-semibold text-gray-900">{name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{role}</p>
          </div>
          <div className="text-right shrink-0">
            <div className={`text-sm ${daysClass}`} style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{daysLeft} days left</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Sub-stage · {subStage}</div>
          </div>
        </div>

        <PhaseProgress activePhaseIdx={phaseIdx} activeSubStageIdx={subStageIdx} />

        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
          {sources.map((s, i) => (
            <span key={i} className="inline-flex items-center gap-1 text-[10px] text-gray-600 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded">
              <s.icon className="w-2.5 h-2.5 text-gray-500" strokeWidth={1.75} />
              {s.label}
            </span>
          ))}
        </div>

        {ctaLabel && (
          <div className="flex items-center justify-end mt-3 pt-3 border-t border-gray-100">
            {ctaPrimary ? (
              <PrimaryButton>{ctaLabel}<ArrowRight className="w-3.5 h-3.5" /></PrimaryButton>
            ) : (
              <SecondaryButton>{ctaLabel}<ArrowRight className="w-3 h-3" /></SecondaryButton>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function PhaseProgress({ activePhaseIdx, activeSubStageIdx }) {
  // 3 phases · sub-stages 3/3/2
  const phases = [
    { label: "Prepare", subStages: 3 },
    { label: "Capture", subStages: 3 },
    { label: "Deliver", subStages: 2 },
  ];
  return (
    <div className="flex items-center gap-1.5">
      {phases.map((p, i) => {
        const isComplete = activePhaseIdx !== null && i < activePhaseIdx;
        const isActive = activePhaseIdx === i;
        const isFuture = activePhaseIdx === null || i > activePhaseIdx;
        const fillPct = isActive && activeSubStageIdx !== null
          ? Math.round(((activeSubStageIdx + 1) / p.subStages) * 100)
          : 0;
        return (
          <div key={p.label} className="flex-1">
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden relative">
              {isComplete && <div className="absolute inset-0 bg-emerald-400" />}
              {isActive && (
                <div className="absolute inset-y-0 left-0 bg-violet-500" style={{ width: `${Math.max(fillPct, 8)}%` }} />
              )}
            </div>
            <div className={`text-[9px] uppercase tracking-wider font-semibold mt-1 ${
              isComplete ? "text-emerald-700" : isActive ? "text-violet-700" : "text-gray-400"
            }`}>
              {p.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S2 · Quick-initiate · HR-pre-filled defaults
   ═══════════════════════════════════════════════════════════════════ */

function S2QuickInitiateDefault() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader
        eyebrow="/session/[id]/setup · from HR sync"
        title={`Start ${SCENARIO.name}'s handover`}
        subtitle="Everything below is pre-filled from the HR record. Click Start session to begin · the system will take it from there."
        actor="Hà Vy · Manager · Engineering"
      />

      <FormSection title="Offboarder">
        <div className="rounded-lg border border-gray-200 bg-white p-4 flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-violet-50 border border-violet-200 flex items-center justify-center shrink-0">
            <span className="text-base font-semibold text-violet-700">ML</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900">{SCENARIO.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{SCENARIO.role} · {SCENARIO.dept}</p>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>Last working day · <span className="text-gray-900 font-medium" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{SCENARIO.lastDay}</span> · {SCENARIO.daysLeft} days remaining</span>
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection title="Session defaults">
        <div className="grid grid-cols-3 gap-3">
          <DefaultTile icon={Calendar} label="Review deadline" value="June 8, 2026" detail="+3 business days after the interview" />
          <DefaultTile icon={Database} label="Data sources" value="3 integrated" detail="Jira · GitHub · Drive shared" />
          <DefaultTile icon={Clock} label="Estimated seeding" value="~7 minutes" detail="Background · you can leave the page" />
        </div>
      </FormSection>

      <FormSection title="">
        <button className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 flex items-center justify-between hover:border-gray-300 transition-colors text-left">
          <div className="flex items-center gap-2.5">
            <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90" strokeWidth={1.75} />
            <span className="text-sm font-medium text-gray-900">Customize before starting</span>
            <span className="text-[11px] text-gray-500">— optional · review deadline, source scope, focus note, successor</span>
          </div>
        </button>
      </FormSection>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200 mt-2">
        <GhostButton>Cancel · back to dashboard</GhostButton>
        <PrimaryButton>
          Start session
          <ArrowRight className="w-3.5 h-3.5" />
        </PrimaryButton>
      </div>

      <p className="text-[11px] text-gray-500 mt-5 leading-relaxed">
        <span className="text-gray-700 font-medium">When you click Start session ·</span> the audit anchor is written, the RBAC scope is locked to this session, and the background pipeline scans Jira / GitHub / Drive shared. You're redirected to {SCENARIO.sessionId.slice(0, 16)}'s command view.
      </p>
    </div>
  );
}

function DefaultTile({ icon: Icon, label, value, detail }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="flex items-center gap-1.5 mb-2">
        <Icon className="w-3 h-3 text-gray-500" strokeWidth={1.75} />
        <span className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium">{label}</span>
      </div>
      <div className="text-sm font-semibold text-gray-900">{value}</div>
      <div className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{detail}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S3 · Quick-initiate · customize expander open
   ═══════════════════════════════════════════════════════════════════ */

function S3QuickInitiateCustomize() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader
        eyebrow="/session/[id]/setup · customizing"
        title={`Start ${SCENARIO.name}'s handover`}
        subtitle="Customize expander opened inline · all defaults remain in effect unless you change them."
        actor="Hà Vy · Manager · Engineering"
      />

      <FormSection title="Offboarder">
        <div className="rounded-lg border border-gray-200 bg-white p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-violet-50 border border-violet-200 flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-violet-700">ML</span>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900">{SCENARIO.name} · {SCENARIO.role}</h3>
            <p className="text-[11px] text-gray-500">{SCENARIO.dept} · Last working day {SCENARIO.lastDay}</p>
          </div>
        </div>
      </FormSection>

      <article className="rounded-lg border border-violet-200 bg-violet-50/30 overflow-hidden mb-6">
        <div className="px-4 py-2.5 bg-violet-50 border-b border-violet-200 flex items-center gap-2">
          <ChevronDown className="w-3.5 h-3.5 text-violet-700" strokeWidth={1.75} />
          <span className="text-xs font-semibold text-violet-900">Customize before starting</span>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-[0.18em] text-gray-600 font-medium block mb-1.5">Review deadline</label>
            <div className="rounded-md border border-gray-200 bg-white p-2.5 flex items-center gap-3 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-500/15 transition-colors">
              <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" strokeWidth={1.75} />
              <input defaultValue="June 8, 2026 · 17:00" className="flex-1 text-sm text-gray-900 bg-transparent outline-none" style={{ fontFamily: "ui-monospace, Menlo, monospace" }} />
              <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>+3 business days</span>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.18em] text-gray-600 font-medium block mb-1.5">Approved shared workspaces</label>
            <div className="space-y-1.5">
              <SourceRow icon={GitBranch} name="Jira" detail="47 active tickets · 6 months of comments" selected />
              <SourceRow icon={Github} name="GitHub" detail="23 shared repos · PR descriptions, commit messages, wiki pages" selected />
              <SourceRow icon={Folder} name="Google Drive · shared" detail="412 files · titles and edit recency · content read only during interview" selected />
            </div>
            <p className="text-[10px] text-gray-500 mt-2 leading-relaxed flex items-start gap-1.5">
              <ShieldCheck className="w-3 h-3 mt-0.5 shrink-0 text-gray-400" />
              <span>Email, personal directories, and private messaging are never scanned. Personal files reach the system only via manual upload by {SCENARIO.name} during the interview.</span>
            </p>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.18em] text-gray-600 font-medium block mb-1.5">Focus note · optional</label>
            <textarea
              defaultValue="Probe deeply on the Payment Gateway timeout — recurring incident, no runbook. Also the Vendor XYZ renewal SLA terms."
              className="w-full min-h-[64px] px-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/15 transition-colors resize-none"
              style={{ fontFamily: "inherit" }}
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.18em] text-gray-600 font-medium block mb-1.5">Successor</label>
            <div className="rounded-md border border-gray-200 bg-white p-2.5 flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-semibold text-emerald-700">TN</span>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-900">{SCENARIO.successor}</div>
                <div className="text-[10px] text-gray-500">Pre-assigned from HR · onboarding starts after KG commit</div>
              </div>
              <button className="text-[11px] text-violet-700 hover:text-violet-900 font-medium">Reassign</button>
            </div>
          </div>
        </div>
      </article>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <GhostButton>Cancel · back to dashboard</GhostButton>
        <PrimaryButton>
          Start session
          <ArrowRight className="w-3.5 h-3.5" />
        </PrimaryButton>
      </div>
    </div>
  );
}

function SourceRow({ icon: Icon, name, detail, selected }) {
  return (
    <label className="flex items-start gap-3 rounded-md border border-gray-200 bg-white px-3 py-2 cursor-pointer hover:border-gray-300 transition-colors">
      <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${selected ? "bg-violet-600 border-violet-600" : "bg-white border-gray-300"}`}>
        {selected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
      </span>
      <Icon className="w-3.5 h-3.5 text-gray-500 mt-0.5 shrink-0" strokeWidth={1.75} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900">{name}</div>
        <div className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{detail}</div>
      </div>
    </label>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S4 · Command view · Phase 1 starts
   ═══════════════════════════════════════════════════════════════════ */

function S4CommandPhase1Start() {
  return (
    <CommandViewLayout subtitle="Just clicked Start session · audit anchor written · Phase 1 Prepare begins">
      <CommandHero phaseIdx={0} subStageIdx={0} subStageLabel="Setup confirmed" timeElapsed="0m 8s" />

      <CommandTabs active="overview" />

      <div className="grid grid-cols-[1fr_280px] gap-6 mt-4">
        <div className="space-y-4">
          <FormSection title="Phase 1 · Prepare" subtitle="Manager + System · 3 sub-stages · setup confirmed → context seeding → knowledge map ready">
            <article className="rounded-lg border border-gray-200 bg-white overflow-hidden">
              <ProgressStage status="done" label="Setup confirmed" detail="Audit anchor written · RBAC scope locked · 8 seconds" />
              <ProgressStage status="active" label="Context seeding" detail="Queuing background pipeline · 3 sources approved" />
              <ProgressStage status="pending" label="Knowledge map ready" last />
            </article>
          </FormSection>

          <FormSection title="What was decided" subtitle="From the quick-initiate page · captured in the audit anchor.">
            <DecisionList items={[
              { label: "Sources approved", value: "Jira · GitHub · Drive shared (no deselections)" },
              { label: "Review deadline", value: "June 8, 2026 · 17:00 (+3 business days)" },
              { label: "Focus note", value: "Payment Gateway timeout · Vendor XYZ SLA terms" },
              { label: "Successor", value: SCENARIO.successor },
            ]} />
          </FormSection>
        </div>

        <ActionSidebar
          title="What's next"
          steps={[
            { label: "Pipeline kicks off (~10s)", active: true },
            { label: "Sources extracted in parallel (~5 min)" },
            { label: "Sensitivity gate (~30s)" },
            { label: "Gap inference + map build (~90s)" },
          ]}
          note="You can leave this page. We'll notify you when the map is ready."
        />
      </div>
    </CommandViewLayout>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S5 · Command view · mid-seeding
   ═══════════════════════════════════════════════════════════════════ */

function S5CommandMidSeeding() {
  return (
    <CommandViewLayout subtitle="Background pipeline running · GitHub extracting · Manager can leave this page">
      <CommandHero phaseIdx={0} subStageIdx={1} subStageLabel="Context seeding" timeElapsed="3m 12s" subStageFraction="2 of 3" />

      <CommandTabs active="overview" />

      <div className="grid grid-cols-[1fr_280px] gap-6 mt-4">
        <div className="space-y-4">
          <FormSection title="Seeding pipeline" subtitle="Jira already in · GitHub mid-extract · Drive next.">
            <article className="rounded-lg border border-gray-200 bg-white overflow-hidden">
              <ProgressStage status="done" label="Establishing authorization scope" detail="RBAC resolved · 23 nodes in scope · 2 seconds" />
              <ProgressStage status="done" label="Decomposing the seeding job" detail="3 sources · Worker handles metadata · Expert reserved for gaps" />
              <ProgressStage status="done" label="Extracting Jira ticket metadata" detail="47 tickets · titles, statuses, labels, comment counts · 1.4 minutes" />
              <ProgressStage status="active" label="Extracting GitHub metadata" detail="18 of 23 shared repos · PR descriptions, commit messages, wiki pages" />
              <ProgressStage status="pending" label="Extracting Google Drive metadata" detail="412 files · titles and edit recency only · no raw content read" />
              <ProgressStage status="pending" label="Sensitivity classification gate" detail="All ingested content classified before staging" />
              <ProgressStage status="pending" label="Inferring likely knowledge gaps" />
              <ProgressStage status="pending" label="Building the preliminary knowledge map" last />
            </article>
          </FormSection>

          <div className="grid grid-cols-3 gap-3">
            <ActivityTile label="Worker tokens" value="48,210" detail="Phi-3 / GPT-4o-mini · ≥80% target" />
            <ActivityTile label="Expert tokens" value="0" detail="Reserved for gap inference" />
            <ActivityTile label="Items classified" value="83" detail="0 redacted · 0 excluded" />
          </div>
        </div>

        <ActionSidebar
          title="Watch live progress"
          steps={[
            { label: "Jira extraction", done: true },
            { label: "GitHub extraction", active: true },
            { label: "Drive extraction" },
            { label: "Classification + map" },
          ]}
          note="Status updates every 5 seconds. Hà Vy will get an in-app notification when the map is ready."
        />
      </div>
    </CommandViewLayout>
  );
}

function ActivityTile({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium">{label}</div>
      <div className="text-lg font-semibold text-gray-900 mt-0.5 tracking-tight" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{value}</div>
      <div className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{detail}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S6 · Command view · Knowledge Map ready
   ═══════════════════════════════════════════════════════════════════ */

function S6CommandKnowledgeMap() {
  return (
    <CommandViewLayout subtitle="Seeding complete · Knowledge Map ready · sub-stage 3 of 3 in Phase 1">
      <CommandHero phaseIdx={0} subStageIdx={2} subStageLabel="Knowledge map ready" timeElapsed="7m 12s" subStageFraction="3 of 3" />

      <CommandTabs active="overview" />

      <div className="grid grid-cols-[1fr_280px] gap-6 mt-4">
        <div className="space-y-4">
          <article className="rounded-lg border border-emerald-200 bg-emerald-50/30 p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-md bg-white border border-emerald-200 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900">Phase 1 · Prepare · complete</h3>
              <p className="text-xs text-gray-600 mt-0.5">{SCENARIO.name}'s knowledge map is staged. Phase 2 · Capture is ready to begin once he picks an interview time.</p>
            </div>
          </article>

          <div className="grid grid-cols-4 gap-3">
            <SummaryStat value="487" label="Items detected" />
            <SummaryStat value="23" label="Excluded by classification" subtle />
            <SummaryStat value="464" label="Items in scope" />
            <SummaryStat value="3" label="Likely knowledge gaps" tone="warning" />
          </div>

          <FormSection title="Top 3 projects by activity">
            <div className="grid grid-cols-3 gap-3">
              <ProjectCard icon={Layers} name="Project Atlas" detail="32 tickets · primary contributor · 8 months" />
              <ProjectCard icon={Network} name="Payment Gateway v2" detail="19 tickets · most recent owner · critical service" />
              <ProjectCard icon={MessageSquare} name="Vendor XYZ renewal" detail="Several Drive docs · no central project page · negotiation lead" />
            </div>
          </FormSection>

          <FormSection title="Likely knowledge gaps" subtitle="High activity, sparse documentation. The interview should probe these.">
            <div className="rounded-lg border border-yellow-200 bg-yellow-50/30 p-4">
              <ul className="space-y-2.5">
                <KnowledgeGap title="Payment Gateway timeout" detail="Recurring incidents · no runbook · 4 tickets in 6 months · fix appears in three ticket comments but never written up" />
                <KnowledgeGap title="Vendor XYZ renewal · SLA terms" detail="Several Drive docs but no project page captures the negotiated penalty clause" />
                <KnowledgeGap title="Project Atlas · rollback procedure" detail="Mentioned in three tickets · never documented anywhere central" />
              </ul>
            </div>
          </FormSection>
        </div>

        <ActionSidebar
          title="Phase 1 complete"
          variant="success"
          steps={[
            { label: "Setup confirmed", done: true },
            { label: "Context seeding", done: true },
            { label: "Knowledge map ready", done: true, current: true },
          ]}
          note="Phase 2 begins once Minh Lê schedules his interview. Hà Vy can review the map now or pre-load priority prompts."
        />
      </div>
    </CommandViewLayout>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S7 · Command view · Next Action cards
   ═══════════════════════════════════════════════════════════════════ */

function S7CommandNextActions() {
  return (
    <CommandViewLayout subtitle="Offboarder notified · Next Actions surfaced to Manager">
      <CommandHero phaseIdx={0} subStageIdx={2} subStageLabel="Knowledge map ready · awaiting Offboarder" timeElapsed="7m 38s" subStageFraction="3 of 3" />

      <CommandTabs active="overview" />

      <div className="grid grid-cols-[1fr_280px] gap-6 mt-4">
        <div className="space-y-4">
          <article className="rounded-lg border border-emerald-200 bg-emerald-50/30 p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-md bg-white border border-emerald-200 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-emerald-700" strokeWidth={1.75} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900">Minh Lê notified · session ready</h3>
              <p className="text-xs text-gray-600 mt-0.5">In-app notification sent. He can start his voice interview at his convenience — the interview is scoped to the knowledge map you just reviewed.</p>
            </div>
          </article>

          <FormSection title="Next actions" subtitle="Both unblock as of this moment. Phase 2 begins when Minh Lê schedules.">
            <div className="grid grid-cols-2 gap-3">
              <NextActionCard
                icon={MessageSquare}
                title="Schedule the voice interview"
                detail={`Send ${SCENARIO.name} a calendar invite for the AI-guided interview. ~45 minutes. Triggers Phase 2 · Capture.`}
                ucRef="UC-HO-02"
                primary
              />
              <NextActionCard
                icon={Tag}
                title="Add priority prompts"
                detail="Steer the interview toward the Payment Gateway runbook gap and the SLA terms. Up to 3 prompts per session."
                ucRef="UC-HO-05"
              />
            </div>
          </FormSection>

          <FormSection title="Audit anchor extended" subtitle="Every choice on this page traced.">
            <article className="rounded-lg border border-gray-200 bg-white overflow-hidden">
              <AuditEntry event="session.created" ts="2026-05-29 14:18:50" detail={`Manager · Hà Vy · scope hash · 0x4a7c…fe21`} />
              <AuditEntry event="sources.confirmed" ts="2026-05-29 14:18:50" detail="Jira · GitHub · Drive shared · no deselections" />
              <AuditEntry event="seeding.complete" ts="2026-05-29 14:26:02" detail="487 items detected · 464 retained · 23 redacted" />
              <AuditEntry event="phase1.complete" ts="2026-05-29 14:26:08" detail="Sub-stages 1 · 2 · 3 done · phase 2 unlocked" last />
            </article>
          </FormSection>
        </div>

        <ActionSidebar
          title="Phase 2 · Capture · queued"
          steps={[
            { label: "Interview scheduled" },
            { label: "Voice interview" },
            { label: "Transcript reviewed" },
          ]}
          note={`Awaiting ${SCENARIO.name} to pick a time. You'll see his sub-stage update on the dashboard.`}
        />
      </div>
    </CommandViewLayout>
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
   S8 · Dashboard · session in Phase 2 Capture
   ═══════════════════════════════════════════════════════════════════ */

function S8DashboardPhase2() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <PageHeader
        eyebrow="Handover dashboard · /dashboard · refreshed"
        title="Good afternoon, Hà Vy"
        subtitle={`Minh Lê's session moved to Phase 2 · Capture. He scheduled his interview for tomorrow at 10:00.`}
        actor="Hà Vy · Manager · Engineering"
      />

      <SectionLabel count={3}>Active sessions</SectionLabel>
      <div className="space-y-3 mb-8">
        <SessionCard
          name="Khánh Linh Trần"
          role="Head of People Operations · People & Culture"
          daysLeft={2}
          urgent
          phaseIdx={0}
          subStage="Setup confirmed"
          subStageIdx={0}
          sources={[
            { icon: Users, label: "HRIS · 240 records" },
            { icon: FileText, label: "Notion · 38 policy pages" },
            { icon: Folder, label: "SharePoint · 92 files" },
          ]}
        />
        <SessionCard
          name="Phương Anh Nguyễn"
          role="Senior Account Executive · Sales"
          daysLeft={6}
          phaseIdx={1}
          subStage="Voice interview"
          subStageIdx={1}
          sources={[
            { icon: Briefcase, label: "Salesforce · 38 deals" },
            { icon: Calendar, label: "Shared Calendar · 6 months" },
            { icon: Folder, label: "SharePoint · 124 files" },
          ]}
        />
        <SessionCard
          name={SCENARIO.name}
          role={`${SCENARIO.role} · ${SCENARIO.dept}`}
          daysLeft={SCENARIO.daysLeft}
          phaseIdx={1}
          subStage="Interview scheduled · 2026-05-30 10:00"
          subStageIdx={0}
          sources={[
            { icon: GitBranch, label: "Jira · 47 active tickets" },
            { icon: Github, label: "GitHub · 23 shared repos" },
            { icon: Folder, label: "Google Drive · 412 files" },
          ]}
          ctaLabel="Open session"
        />
      </div>

      <SectionLabel>Recent activity</SectionLabel>
      <div className="space-y-1.5">
        <AuditTile timestamp="2026-05-29 14:31:14" actor={SCENARIO.name} action="Scheduled voice interview for 2026-05-30 10:00 · 45 minutes" severity="low" />
        <AuditTile timestamp="2026-05-29 14:26:02" actor="System" action={`Minh Lê's seeding complete · 464 items retained · 3 gaps flagged`} severity="low" />
        <AuditTile timestamp="2026-05-29 14:18:50" actor="Hà Vy" action="Initiated handover session for Minh Lê · sources Jira / GitHub / Drive shared" severity="medium" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Shared command-view primitives
   ═══════════════════════════════════════════════════════════════════ */

function CommandViewLayout({ subtitle, children }) {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">/session/{SCENARIO.sessionId.slice(0, 24)}</span>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight mt-1">{SCENARIO.name}'s handover · command view</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-1 leading-relaxed">{subtitle}</p>}
        </div>
        <span className="text-[11px] text-gray-500 shrink-0 pt-1">Hà Vy · Manager · Engineering</span>
      </div>
      {children}
    </div>
  );
}

function CommandHero({ phaseIdx, subStageIdx, subStageLabel, timeElapsed, subStageFraction }) {
  const phases = [
    { label: "Prepare", subStages: 3, actor: "Manager + System" },
    { label: "Capture", subStages: 3, actor: "Offboarder + Manager" },
    { label: "Deliver", subStages: 2, actor: "System + Successor" },
  ];
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-5 mb-4">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-violet-50 border border-violet-200 flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-violet-700">ML</span>
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">{SCENARIO.name}</h2>
            <p className="text-[11px] text-gray-500">{SCENARIO.role} · last day {SCENARIO.lastDay}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-[0.18em] text-violet-700 font-semibold">Phase {phaseIdx + 1} · {phases[phaseIdx].label}</div>
          <div className="text-sm font-medium text-gray-900 mt-0.5">{subStageLabel}</div>
          <div className="text-[10px] text-gray-500 mt-0.5" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
            {subStageFraction ? `${subStageFraction} sub-stages · ` : ""}{timeElapsed} elapsed
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {phases.map((p, i) => {
          const isComplete = i < phaseIdx;
          const isActive = i === phaseIdx;
          const fillPct = isActive ? Math.round(((subStageIdx + 1) / p.subStages) * 100) : 0;
          return (
            <div key={p.label} className="flex-1">
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden relative">
                {isComplete && <div className="absolute inset-0 bg-emerald-400" />}
                {isActive && <div className="absolute inset-y-0 left-0 bg-violet-500" style={{ width: `${Math.max(fillPct, 8)}%` }} />}
              </div>
              <div className={`flex items-center justify-between mt-1.5 ${isComplete ? "text-emerald-700" : isActive ? "text-violet-700" : "text-gray-400"}`}>
                <span className="text-[10px] uppercase tracking-wider font-semibold">Phase {i + 1} · {p.label}</span>
                <span className="text-[9px]">{p.actor}</span>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function CommandTabs({ active }) {
  const tabs = ["Overview", "Stages", "Data", "Audit log", "Settings"];
  return (
    <nav className="border-b border-gray-200 flex items-center gap-1 mb-4">
      {tabs.map((t) => {
        const isActive = t.toLowerCase().replace(" ", "-") === active.toLowerCase().replace(" ", "-") || t.toLowerCase() === active;
        return (
          <button
            key={t}
            className={`px-3 h-9 text-xs font-medium border-b-2 transition-colors -mb-px ${
              isActive ? "text-violet-700 border-violet-600" : "text-gray-500 border-transparent hover:text-gray-900"
            }`}
          >
            {t}
          </button>
        );
      })}
    </nav>
  );
}

function ActionSidebar({ title, steps, note, variant }) {
  const bg = variant === "success" ? "bg-emerald-50/30 border-emerald-200" : "bg-white border-gray-200";
  return (
    <aside className={`rounded-lg border ${bg} p-4 self-start`}>
      <h3 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wider">{title}</h3>
      <ol className="space-y-2 mb-3">
        {steps.map((s, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
              s.done ? "bg-emerald-50 border-emerald-300" : s.active ? "bg-violet-50 border-violet-300" : "bg-white border-gray-200"
            }`}>
              {s.done ? <Check className="w-2.5 h-2.5 text-emerald-700" strokeWidth={2.5} /> : s.active ? <Loader2 className="w-2.5 h-2.5 text-violet-600 animate-spin" /> : null}
            </span>
            <span className={`text-[11px] leading-relaxed ${s.done ? "text-gray-700" : s.active ? "text-gray-900 font-medium" : "text-gray-500"}`}>
              {s.label}
            </span>
          </li>
        ))}
      </ol>
      {note && <p className="text-[10px] text-gray-500 leading-relaxed border-t border-gray-100 pt-2.5">{note}</p>}
    </aside>
  );
}

function DecisionList({ items }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      {items.map((item, i) => (
        <div key={i} className={`px-3 py-2 flex items-baseline gap-3 ${i < items.length - 1 ? "border-b border-gray-100" : ""}`}>
          <span className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium w-32 shrink-0">{item.label}</span>
          <span className="text-xs text-gray-900 flex-1">{item.value}</span>
        </div>
      ))}
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

function SectionLabel({ count, children }) {
  return (
    <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium mb-3 flex items-center gap-2">
      <span>{children}</span>
      {count !== undefined && <span className="text-gray-400" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>· {count}</span>}
    </h2>
  );
}

function FormSection({ title, subtitle, children }) {
  return (
    <section className="mb-6">
      {title && <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>}
      {subtitle && <p className="text-[12px] text-gray-500 mb-2.5 leading-relaxed">{subtitle}</p>}
      {children}
    </section>
  );
}

function ProgressStage({ status, label, detail, last }) {
  const config = {
    done: { icon: Check, iconCls: "text-emerald-600 bg-emerald-50 border-emerald-200", labelCls: "text-gray-900" },
    active: { icon: Loader2, iconCls: "text-violet-600 bg-violet-50 border-violet-200 animate-spin", labelCls: "text-gray-900 font-medium" },
    pending: { icon: Clock, iconCls: "text-gray-300 bg-white border-gray-200", labelCls: "text-gray-400" },
  }[status];
  const Icon = config.icon;
  return (
    <div className={`px-4 py-2.5 flex items-start gap-3 ${!last ? "border-b border-gray-100" : ""}`}>
      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${config.iconCls}`}>
        <Icon className="w-2.5 h-2.5" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-xs ${config.labelCls}`}>{label}</div>
        {detail && <div className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{detail}</div>}
      </div>
    </div>
  );
}

function AuditTile({ timestamp, actor, action, severity }) {
  const borderColor = { low: "rgb(229, 231, 235)", medium: "rgb(234, 179, 8)", high: "rgb(244, 63, 94)" }[severity];
  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2" style={{ borderLeft: `2px solid ${borderColor}` }}>
      <div className="flex items-center justify-between mb-0.5 gap-2">
        <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{timestamp}</span>
        <span className="text-[10px] text-gray-700 font-medium shrink-0">{actor}</span>
      </div>
      <div className="text-xs text-gray-900">{action}</div>
    </div>
  );
}

function SummaryStat({ value, label, tone, subtle }) {
  const cfg = {
    default: { border: "border-gray-200", bg: "bg-white", valueCls: "text-gray-900", labelCls: "text-gray-500" },
    warning: { border: "border-yellow-200", bg: "bg-yellow-50/30", valueCls: "text-yellow-800", labelCls: "text-yellow-700" },
  }[tone || "default"];
  return (
    <div className={`rounded-lg border ${cfg.border} ${cfg.bg} px-3 py-3 ${subtle ? "opacity-90" : ""}`}>
      <div className={`text-2xl font-semibold ${cfg.valueCls} tracking-tight`} style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{value}</div>
      <div className={`text-[11px] ${cfg.labelCls} mt-0.5`}>{label}</div>
    </div>
  );
}

function ProjectCard({ icon: Icon, name, detail }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="w-7 h-7 rounded-md bg-gray-50 border border-gray-200 flex items-center justify-center mb-2">
        <Icon className="w-3.5 h-3.5 text-gray-600" strokeWidth={1.75} />
      </div>
      <h4 className="text-sm font-medium text-gray-900 leading-tight">{name}</h4>
      <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{detail}</p>
    </div>
  );
}

function KnowledgeGap({ title, detail }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="w-1 h-1 rounded-full bg-yellow-500 shrink-0 mt-2" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 leading-tight">{title}</div>
        <div className="text-[11px] text-yellow-900/70 mt-0.5 leading-relaxed">{detail}</div>
      </div>
    </li>
  );
}

function NextActionCard({ icon: Icon, title, detail, ucRef, primary }) {
  return (
    <button className={`text-left rounded-lg border bg-white p-4 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${
      primary ? "border-violet-300 hover:border-violet-500 ring-1 ring-violet-600/5" : "border-gray-200 hover:border-gray-400"
    }`}>
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-md border flex items-center justify-center shrink-0 ${primary ? "bg-violet-50 border-violet-200" : "bg-gray-50 border-gray-200"}`}>
          <Icon className={`w-4 h-4 ${primary ? "text-violet-600" : "text-gray-600"}`} strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
            <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{ucRef}</span>
          </div>
          <p className="text-[12px] text-gray-600 leading-relaxed">{detail}</p>
        </div>
        <ArrowUpRight className={`w-3.5 h-3.5 shrink-0 mt-1 ${primary ? "text-violet-600" : "text-gray-400"}`} />
      </div>
    </button>
  );
}

function PrimaryButton({ onClick, children }) {
  return (
    <button onClick={onClick} className="h-8 px-3 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30">
      {children}
    </button>
  );
}

function SecondaryButton({ onClick, children }) {
  return (
    <button onClick={onClick} className="h-8 px-3 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
      {children}
    </button>
  );
}

function GhostButton({ onClick, children }) {
  return (
    <button onClick={onClick} className="h-8 px-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 text-xs font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
      {children}
    </button>
  );
}
