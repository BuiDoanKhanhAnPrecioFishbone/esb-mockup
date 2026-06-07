"use client";

import React from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, X,
  FileText, MessageSquare, Network, Eye,
  AlertTriangle, AlertOctagon, Clock, CheckCircle2, Loader2,
  ArrowRight, MoreHorizontal, Tag, Trello, Lock,
  RefreshCw, UploadCloud, History, ShieldAlert,
  Check, Award, Send, ShieldCheck
} from "lucide-react";
import UCHO04ManagerReview from "./uc-ho-04-manager-review.jsx";

/* ═══════════════════════════════════════════════════════════════════
   Session Command View — /session/[id]

   Redesign (PO direction · "fewer to be seen, easier to use"):
     · 6 tabs → 2. Overview + Manager review. Stages/Data/Settings are
       folded into Overview and the action rail; Audit is a link, not a
       tab. Legacy ?tab=stages|data|audit|settings deep-links resolve to
       Overview (no 404).
     · Explainer prose removed. Labels + values only; helper text kept
       ONLY on the two destructive actions (cancel, request more detail).
     · Trello 4-layer source (CL-091) · async question-queue capture
       (CL-098/099) · UC-HO-04 review wired in (CL-103).
     · CL-109 · Phương Anh's Manager review is now a real surface (her
       7 Sales sections, per-item accept / send-back, sign-off CTA),
       not a placeholder. Minh Lê still routes to the full UC-HO-04.
   ═══════════════════════════════════════════════════════════════════ */

const FLOW = [
  { id: "ml-overview", label: "Minh Lê · Overview",    trigger: "Phase 1 · Prepare · seeding from Trello." },
  { id: "ml-review",   label: "Minh Lê · Review",      trigger: "Manager review · UC-HO-04 decision workspace." },
  { id: "pa-overview", label: "Phương Anh · Overview", trigger: "Phase 2 · Capture · answers ready for review." },
];

// 3 user-facing phases · 8 internal sub-stages kept for tracking
const LIFECYCLE_PHASES = [
  { id: 1, key: "prepare", label: "Prepare", subStages: [
    { id: 1, label: "Setup confirmed" },
    { id: 2, label: "Context seeding" },
    { id: 3, label: "Knowledge map ready" },
  ] },
  { id: 2, key: "capture", label: "Capture", subStages: [
    { id: 4, label: "Questions assigned" },
    { id: 5, label: "Answering queue" },
    { id: 6, label: "Answers reviewed" },
  ] },
  { id: 3, key: "deliver", label: "Deliver", subStages: [
    { id: 7, label: "Committed to KG" },
    { id: 8, label: "Playbook delivered" },
  ] },
];

function getPhase(subStageId) {
  return LIFECYCLE_PHASES.find((p) => p.subStages.some((s) => s.id === subStageId));
}
function getSubStage(subStageId) {
  for (const p of LIFECYCLE_PHASES) {
    const s = p.subStages.find((x) => x.id === subStageId);
    if (s) return s;
  }
  return null;
}

const SESSIONS = {
  ml: {
    urlSlug: "minh-le", offboarder: "Minh Lê", role: "Senior Backend Engineer",
    dept: "Engineering", initials: "ML", subStageId: 2, daysLeft: 6,
    successor: "Trần Hữu Nam", deadline: "June 8, 2026 · 17:00",
  },
  pa: {
    urlSlug: "phuong-anh", offboarder: "Phương Anh Nguyễn", role: "Senior Account Executive",
    dept: "Sales", initials: "PA", subStageId: 6, daysLeft: 4,
    successor: "Đặng Khải Hoàn", deadline: "June 5, 2026 · 17:00",
  },
};

// Visible tabs · two only. "review" carries the UC-HO-04 badge.
const TABS = [
  { id: "overview", label: "Overview" },
  { id: "review",   label: "Manager review" },
];

export default function SessionCommandView({ embedded = false, view = "ml-overview" } = {}) {
  const [stepIdx, setStepIdx] = React.useState(() => {
    const i = FLOW.findIndex((s) => s.id === view);
    return i >= 0 ? i : 0;
  });

  if (embedded) {
    // view = "<sessionKey>-<tabId>[-<state>]" e.g. "ml-overview", "ml-review-s4".
    const parts = view.split("-");
    const sessKey = parts[0] || "ml";
    const rawTab = parts[1] || "overview";
    const state = parts[2];
    // Everything that isn't the review surface resolves to Overview.
    const tab = rawTab === "review" ? "review" : "overview";
    const session = SESSIONS[sessKey];
    if (!session) return null;
    return <CommandView session={session} activeTab={tab} state={state} />;
  }

  const step = FLOW[stepIdx];
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      <TopBar step={step} stepIdx={stepIdx} onJump={setStepIdx} />
      <main className="flex-1"><StepRenderer id={step.id} /></main>
      <FooterNav stepIdx={stepIdx} step={step} onChange={setStepIdx} />
    </div>
  );
}

/* ─── Standalone demo chrome (skipped when embedded in AppShell) ────── */

function TopBar({ step, stepIdx, onJump }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="px-5 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0 shrink-0">
          <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
          <span className="text-gray-900 font-semibold tracking-[0.18em] text-xs" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>ART-EEP</span>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-xs text-gray-900 font-medium">Session command view</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {FLOW.map((s, i) => (
            <button
              key={s.id}
              onClick={() => onJump(i)}
              title={s.label}
              className={`h-7 px-2 rounded-md border text-[10px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${
                i === stepIdx ? "bg-violet-600 text-white border-violet-600" : "bg-white text-violet-700 border-violet-200 hover:border-violet-400"
              }`}
              style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </header>
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
      <div className="hidden sm:block text-[11px] text-gray-500 max-w-md text-center truncate px-3">{step.trigger}</div>
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
  if (id === "ml-overview") return <CommandView session={SESSIONS.ml} activeTab="overview" />;
  if (id === "ml-review")   return <CommandView session={SESSIONS.ml} activeTab="review" />;
  if (id === "pa-overview") return <CommandView session={SESSIONS.pa} activeTab="overview" />;
  return null;
}

/* ─── Command view shell ────────────────────────────────────────────── */

function CommandView({ session, activeTab, state }) {
  if (activeTab === "review") {
    return (
      <div className="max-w-7xl mx-auto">
        <Hero session={session} />
        <TabBar session={session} activeTab="review" />
        <ReviewTab session={session} state={state} />
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto">
      <Hero session={session} />
      <TabBar session={session} activeTab="overview" />
      <div className="grid grid-cols-[1fr_280px] gap-5 p-6">
        <div className="min-w-0"><OverviewTab session={session} /></div>
        <ActionSidebar session={session} />
      </div>
    </div>
  );
}

/* ─── Hero · identity + 3-phase progress (the Stages tab lives here) ─── */

function Hero({ session }) {
  const phase = getPhase(session.subStageId);
  const subStage = getSubStage(session.subStageId);
  const isUrgent = session.daysLeft <= 3;
  const base = `/session/${session.urlSlug}`;

  return (
    <section className="bg-white border-b border-gray-200 px-6 py-5">
      <div className="flex items-start gap-5">
        <div className="w-14 h-14 rounded-full bg-gray-100 border border-gray-200 text-gray-700 text-base font-semibold inline-flex items-center justify-center shrink-0">
          {session.initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">{session.offboarder}</h1>
            <span className="text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold bg-gray-100 border border-gray-200 text-gray-700">{session.dept}</span>
            {isUrgent && (
              <span className="text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold bg-rose-50 border border-rose-200 text-rose-700 inline-flex items-center gap-1">
                <AlertOctagon className="w-2.5 h-2.5" />
                {session.daysLeft} days left
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-3">
            {session.role} · successor <span className="text-gray-700">{session.successor}</span> · deadline <span className="text-gray-700" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{session.deadline}</span>
          </p>

          <PhaseProgress subStageId={session.subStageId} />

          <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-500 flex-wrap">
            <span className="font-semibold text-gray-900">Phase {phase.id} · {phase.label}</span>
            <span className="text-gray-300">·</span>
            <span>{subStage.label}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Link
            href={`${base}?tab=audit`}
            className="h-8 px-3 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          >
            <History className="w-3 h-3" />
            Audit log
          </Link>
          <button className="h-8 w-8 rounded-md hover:bg-gray-100 inline-flex items-center justify-center text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20" title="Session settings">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}

function PhaseProgress({ subStageId }) {
  const currentPhase = getPhase(subStageId);
  return (
    <div>
      <div className="grid grid-cols-3 gap-1">
        {LIFECYCLE_PHASES.map((phase) => {
          const isDone = phase.id < currentPhase.id;
          const isCurrent = phase.id === currentPhase.id;
          let fill = 0;
          if (isCurrent) {
            const subIdx = phase.subStages.findIndex((s) => s.id === subStageId);
            fill = ((subIdx + 0.5) / phase.subStages.length) * 100;
          }
          return (
            <div key={phase.id} className="relative h-2 rounded-sm bg-gray-200 overflow-hidden" title={phase.label}>
              {isDone && <div className="absolute inset-0 bg-emerald-500" />}
              {isCurrent && <div className="absolute inset-y-0 left-0 bg-violet-500 animate-pulse" style={{ width: `${fill}%` }} />}
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-3 gap-1 mt-1">
        {LIFECYCLE_PHASES.map((phase) => {
          const isDone = phase.id < currentPhase.id;
          const isCurrent = phase.id === currentPhase.id;
          return (
            <span key={phase.id} className={`text-[10px] uppercase tracking-wider font-medium text-center ${
              isDone ? "text-emerald-700" : isCurrent ? "text-violet-700" : "text-gray-400"
            }`}>
              {phase.id}. {phase.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Two-tab bar ───────────────────────────────────────────────────── */

function TabBar({ session, activeTab }) {
  const base = `/session/${session.urlSlug}`;
  return (
    <div className="bg-white border-b border-gray-200 px-6 sticky top-0 z-10">
      <div className="flex items-center gap-1">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          const href = tab.id === "overview" ? base : `${base}?tab=${tab.id}`;
          return (
            <Link
              key={tab.id}
              href={href}
              className={`h-10 px-3 text-sm font-medium border-b-2 transition-colors focus:outline-none inline-flex items-center ${
                isActive ? "border-violet-600 text-violet-700" : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab.label}
              {tab.id === "review" && <span className="ml-1 text-[10px] px-1 py-0.5 rounded-sm bg-violet-50 border border-violet-200 text-violet-700 font-semibold" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>UC-HO-04</span>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Overview · varies by phase ────────────────────────────────────── */

function OverviewTab({ session }) {
  if (session.subStageId === 2) return <OverviewSeeding session={session} />;
  if (session.subStageId === 6) return <OverviewReview session={session} />;
  return null;
}

function OverviewSeeding({ session }) {
  return (
    <div className="space-y-5">
      <SectionLabel>What's happening now</SectionLabel>
      <article className="rounded-lg border border-violet-200 bg-violet-50/40 p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-md bg-white border border-violet-200 flex items-center justify-center shrink-0">
            <Loader2 className="w-4 h-4 text-violet-600 animate-spin" strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900">Seeding from Trello</h3>
            <p className="text-[12px] text-gray-500 mt-0.5">~4 min remaining · runs in the background</p>
          </div>
          <span className="text-[11px] text-gray-500 shrink-0" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>4m 12s</span>
        </div>

        <ul className="space-y-1 text-[11px] text-gray-600">
          <SubStep done>Authorization scope established</SubStep>
          <SubStep done>Connected Trello · 1 source</SubStep>
          <SubStep done>Scanned active lists · In Progress / Review / Done</SubStep>
          <SubStep active>Filtering by content depth · 24 kept · 11 thin skipped</SubStep>
          <SubStep>Prioritizing labels · Bug/Hotfix · Architecture · Core Feature</SubStep>
          <SubStep>Sensitive-content check</SubStep>
          <SubStep>Knowledge gaps inference</SubStep>
          <SubStep>Knowledge map build</SubStep>
        </ul>
      </article>

      <div>
        <SectionLabel>Source</SectionLabel>
        <div className="mt-2">
          <SourceRow icon={Trello} name="Trello" detail="In Progress / Review / Done · thin cards skipped · labels prioritized" status="active" subDetail="4-layer filter" />
        </div>
      </div>

      <div>
        <SectionLabel>Recent activity</SectionLabel>
        <div className="rounded-lg border border-gray-200 bg-white mt-2 overflow-hidden">
          <ActivityEntry ts="14:36:24" actor="Worker Agent"  text="Trello scan complete · 24 kept · 11 skipped · 0 redacted" />
          <ActivityEntry ts="14:35:00" actor="Planner Agent" text="Applied 4-layer hard-filter to Trello" />
          <ActivityEntry ts="14:32:08" actor="Hà Vy"         text="Started session" last />
        </div>
        <AuditLink session={session} />
      </div>
    </div>
  );
}

function OverviewReview({ session }) {
  return (
    <div className="space-y-5">
      <article className="rounded-lg border border-emerald-200 bg-emerald-50/30 p-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-md bg-white border border-emerald-200 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-emerald-700" strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900">Answers ready for your review</h3>
            <p className="text-[12px] text-gray-500 mt-0.5">Signed 38m ago · 7 sections · 2 flagged</p>
          </div>
        </div>
      </article>

      <div>
        <SectionLabel>Captured content</SectionLabel>
        <div className="grid grid-cols-4 gap-2 mt-2">
          <SmallStat icon={MessageSquare} label="Sections" value="7" />
          <SmallStat icon={Network}       label="Verified" value="23" />
          <SmallStat icon={AlertTriangle} label="Flagged"  value="2" tone="warning" />
          <SmallStat icon={Lock}          label="Redacted" value="1" />
        </div>
      </div>

      <div>
        <SectionLabel>Sections to review</SectionLabel>
        <div className="space-y-2 mt-2">
          {PA_SECTIONS.map((s) => (
            <SectionRow key={s.title} title={s.title} status={s.status} meta={s.meta} muted={s.status === "redacted"} />
          ))}
        </div>
        <AuditLink session={session} />
      </div>
    </div>
  );
}

function AuditLink({ session }) {
  return (
    <Link
      href={`/session/${session.urlSlug}?tab=audit`}
      className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-violet-700 transition-colors"
    >
      <History className="w-3 h-3" strokeWidth={1.75} />
      View full audit log
      <ChevronRight className="w-3 h-3" />
    </Link>
  );
}

function SubStep({ done, active, children }) {
  return (
    <li className="flex items-start gap-1.5">
      <span className="shrink-0 mt-0.5">
        {done && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" strokeWidth={2.5} />}
        {active && <Loader2 className="w-2.5 h-2.5 text-violet-600 animate-spin" strokeWidth={2} />}
        {!done && !active && <Clock className="w-2.5 h-2.5 text-gray-300" strokeWidth={1.75} />}
      </span>
      <span className={`leading-relaxed ${done ? "text-gray-700" : active ? "text-gray-900 font-medium" : "text-gray-400"}`}>{children}</span>
    </li>
  );
}

function SourceRow({ icon: Icon, name, detail, status, subDetail }) {
  const cfg = {
    active:  { cls: "border-violet-200 bg-violet-50/20", badge: "bg-violet-50 border-violet-200 text-violet-700", label: "In progress" },
    done:    { cls: "border-emerald-200 bg-emerald-50/20", badge: "bg-emerald-50 border-emerald-200 text-emerald-700", label: "Complete" },
  }[status];
  return (
    <article className={`rounded-md border px-3 py-2.5 flex items-center gap-3 ${cfg.cls}`}>
      <Icon className="w-3.5 h-3.5 text-gray-500 shrink-0" strokeWidth={1.75} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-medium text-gray-900">{name}</span>
          <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold border ${cfg.badge}`}>{cfg.label}</span>
          {subDetail && <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{subDetail}</span>}
        </div>
        <div className="text-[11px] text-gray-500 leading-relaxed">{detail}</div>
      </div>
    </article>
  );
}

function ActivityEntry({ ts, actor, text, last }) {
  return (
    <div className={`px-3 py-2 ${!last ? "border-b border-gray-100" : ""}`}>
      <div className="flex items-center justify-between gap-3 mb-0.5">
        <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{ts}</span>
        <span className="text-[10px] text-gray-700 font-medium shrink-0">{actor}</span>
      </div>
      <div className="text-[11px] text-gray-900 leading-relaxed">{text}</div>
    </div>
  );
}

function SectionRow({ title, status, meta, muted, onClick }) {
  const cfg = {
    verified: { icon: CheckCircle2, iconCls: "text-emerald-600", badge: "bg-emerald-50 border-emerald-200 text-emerald-700", label: "Verified" },
    flagged:  { icon: AlertTriangle, iconCls: "text-yellow-600", badge: "bg-yellow-50 border-yellow-200 text-yellow-800",   label: "Flagged" },
    redacted: { icon: Lock,         iconCls: "text-gray-400",   badge: "bg-gray-50 border-gray-200 text-gray-500",         label: "Redacted" },
    accepted: { icon: CheckCircle2, iconCls: "text-violet-600", badge: "bg-violet-50 border-violet-200 text-violet-700",   label: "Accepted" },
    "sent-back": { icon: RefreshCw, iconCls: "text-yellow-700", badge: "bg-yellow-50 border-yellow-200 text-yellow-800",   label: "Sent back" },
  }[status];
  const Icon = cfg.icon;
  return (
    <article
      onClick={onClick}
      className={`rounded-md border border-gray-200 bg-white px-3 py-2.5 flex items-center gap-3 hover:border-gray-300 transition-colors cursor-pointer ${muted ? "opacity-60" : ""}`}
    >
      <Icon className={`w-3.5 h-3.5 shrink-0 ${cfg.iconCls}`} strokeWidth={1.75} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-900">{title}</span>
          <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold border ${cfg.badge}`}>{cfg.label}</span>
        </div>
        <div className="text-[11px] text-gray-500 leading-relaxed">{meta}</div>
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
    </article>
  );
}

function SmallStat({ icon: Icon, label, value, tone }) {
  const cfg = {
    default: { border: "border-gray-200",   bg: "bg-gray-50/40",   iconCls: "text-gray-500",   valueCls: "text-gray-900" },
    warning: { border: "border-yellow-200", bg: "bg-yellow-50/40", iconCls: "text-yellow-700", valueCls: "text-yellow-800" },
  }[tone || "default"];
  return (
    <div className={`rounded-md border ${cfg.border} ${cfg.bg} px-2 py-1.5`}>
      <div className="flex items-center gap-1 text-[10px] text-gray-500 uppercase tracking-wider font-medium">
        <Icon className={`w-2.5 h-2.5 ${cfg.iconCls}`} strokeWidth={1.75} />
        {label}
      </div>
      <div className={`text-sm font-semibold ${cfg.valueCls} mt-0.5`} style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{value}</div>
    </div>
  );
}

/* ─── Action rail · next action + info + cancel (Settings folds here) ── */

function ActionSidebar({ session }) {
  const isSeeding = session.subStageId === 2;
  const isReview  = session.subStageId === 6;

  return (
    <aside className="space-y-4">
      <div>
        <SectionLabel>Next action</SectionLabel>
        {isSeeding && (
          <article className="rounded-lg border border-gray-200 bg-white p-3 mt-2">
            <p className="text-[12px] text-gray-700 mb-3">Scanning — nothing needed from you yet.</p>
            <button className="w-full h-8 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium inline-flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
              <Eye className="w-3 h-3" />
              Watch progress
            </button>
          </article>
        )}
        {isReview && (
          <article className="rounded-lg border border-emerald-200 bg-emerald-50/30 p-3 mt-2">
            <p className="text-[12px] text-gray-700 mb-3"><strong className="text-gray-900">2 sections</strong> need your decision.</p>
            <Link href={`/session/${session.urlSlug}?tab=review`} className="w-full h-9 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30 mb-1.5">
              Review answers
              <ArrowRight className="w-3 h-3" />
            </Link>
            <button className="w-full h-8 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20" title="Send the queue back to the offboarder for more detail">
              <RefreshCw className="w-3 h-3" />
              Request more detail
            </button>
          </article>
        )}
      </div>

      <div>
        <SectionLabel>Session</SectionLabel>
        <div className="rounded-md border border-gray-200 bg-white p-3 mt-2 space-y-2 text-[11px]">
          <InfoRow label="Successor" value={session.successor} />
          <InfoRow label="Deadline"  value={session.deadline} mono />
          <InfoRow label="Source"    value="Trello" />
        </div>
      </div>

      <div>
        <SectionLabel>Upload</SectionLabel>
        <button className="w-full mt-2 rounded-lg border border-dashed border-gray-300 bg-gray-50/40 hover:bg-gray-50 px-3 py-3 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
          <UploadCloud className="w-4 h-4 text-gray-400 mx-auto mb-1" strokeWidth={1.75} />
          <span className="text-[11px] text-gray-600 font-medium">Add files</span>
        </button>
      </div>

      <CancelSession session={session} />
    </aside>
  );
}

/* Destructive action keeps its helper line (per the kept-text rule). */
function CancelSession({ session }) {
  return (
    <div className="pt-2 border-t border-gray-200">
      <button className="w-full h-8 rounded-md text-gray-500 hover:text-rose-700 hover:bg-rose-50 text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/20">
        <X className="w-3 h-3" />
        Cancel session
      </button>
      <p className="text-[10px] text-gray-400 text-center mt-1 leading-relaxed">
        Discards seeded context permanently. {session.offboarder} won't be asked to capture.
      </p>
    </div>
  );
}

function InfoRow({ label, value, mono }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium text-right" style={mono ? { fontFamily: "ui-monospace, Menlo, monospace" } : undefined}>{value}</span>
    </div>
  );
}

function SectionLabel({ children }) {
  return <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">{children}</h2>;
}

/* ─── Manager review (CL-103 · Minh Lê) / (CL-109 · Phương Anh) ─────── */

function ReviewTab({ session, state }) {
  if (session.urlSlug === "minh-le") {
    return <UCHO04ManagerReview embedded state={state || "s1"} />;
  }
  if (session.urlSlug === "phuong-anh") {
    return <PhuongAnhReview session={session} />;
  }
  return null;
}

/* ─── CL-109 · Phương Anh's real review surface ───────────────────────
   Her 7 Sales sections as a working item list. Each item shows the
   captured answer + source, with per-item accept / send-back.
   Labels-only style (CL-107); helper text kept on the destructive
   send-back only. Selecting a section opens it inline. */

const PA_SECTIONS = [
  { id: 1, title: "Sales pipeline · Q3 outlook",          status: "verified", meta: "1,247 words · 4 facts",
    answer: "Pipeline is $2.4M weighted across 14 open deals. Three are committed for Q3 close: TXM ($480K), Helios ($210K), and the Vanta renewal ($95K). The rest are best-case. Vanta and TXM are the two Đặng Khải Hoàn should call in week one.",
    source: "Salesforce · shared pipeline · SharePoint Q3 deck" },
  { id: 2, title: "Vendor XYZ renewal · penalty clause",  status: "flagged",  meta: "864 words · 1 flagged",
    answer: "There's a verbal 5-business-day grace on the SLA penalty that isn't in the signed contract. I worked it out with their account lead last March. It should be confirmed by phone, never email — they'll deny it on record.",
    source: "SharePoint · Vendor-Contracts · call notes",
    flag: "Verbal-only commitment with no written record. Confirm before relying on it in the renewal." },
  { id: 3, title: "Account TXM · escalation paths",        status: "verified", meta: "932 words · 5 facts",
    answer: "TXM escalates through their VP of Ops, not procurement. Procurement stalls everything. Direct line and the two-touch cadence that's worked are in the notes.",
    source: "Salesforce · account history · shared Calendar" },
  { id: 4, title: "Forecast methodology",                 status: "verified", meta: "513 words · 3 facts",
    answer: "I weight commit at 90%, best-case at 40%, pipeline at 15%. It's conservative on purpose — leadership prefers a beat to a miss. The spreadsheet logic is documented.",
    source: "SharePoint · forecast model" },
  { id: 5, title: "Customer success · churn signals",     status: "verified", meta: "678 words · 4 facts",
    answer: "Two early churn signals matter most: a drop in weekly active seats and a quiet renewal quarter with no exec touch. Both are leading indicators I track monthly.",
    source: "Salesforce · usage exports" },
  { id: 6, title: "Internal team dynamics",               status: "redacted", meta: "Redacted by sensitivity",
    answer: null, source: null },
  { id: 7, title: "Reflection · what worked",             status: "flagged",  meta: "442 words · 1 flagged",
    answer: "The single thing that moved deals was getting to the economic buyer early. One specific claim about a competitor's pricing should be verified before it goes in the playbook.",
    source: "Own contribution",
    flag: "Contains a competitor-pricing claim — verify before it reaches the graph." },
];

function PhuongAnhReview({ session }) {
  const [openId, setOpenId] = React.useState(null);
  const [decisions, setDecisions] = React.useState({});

  const setDecision = (id, d) => setDecisions((prev) => ({ ...prev, [id]: d }));

  const decidableIds = PA_SECTIONS.filter((s) => s.status !== "redacted").map((s) => s.id);
  const decidedCount = decidableIds.filter((id) => decisions[id]).length;
  const allDecided = decidedCount === decidableIds.length;

  return (
    <div className="grid grid-cols-[1fr_300px] gap-5 p-6 items-start">
      <div className="min-w-0 space-y-2">
        <div className="flex items-center justify-between gap-2 mb-1">
          <SectionLabel>Sections · {PA_SECTIONS.length}</SectionLabel>
          <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
            {decidedCount} / {decidableIds.length} decided
          </span>
        </div>

        {PA_SECTIONS.map((s) => {
          const decided = decisions[s.id];
          const effectiveStatus = decided || s.status;
          const isOpen = openId === s.id;
          if (s.status === "redacted") {
            return <SectionRow key={s.id} title={s.title} status="redacted" meta={s.meta} muted />;
          }
          return (
            <div key={s.id}>
              <SectionRow
                title={s.title}
                status={effectiveStatus}
                meta={s.meta}
                onClick={() => setOpenId(isOpen ? null : s.id)}
              />
              {isOpen && (
                <PaSectionDetail
                  section={s}
                  decision={decided}
                  onAccept={() => { setDecision(s.id, "accepted"); setOpenId(null); }}
                  onSendBack={() => { setDecision(s.id, "sent-back"); setOpenId(null); }}
                />
              )}
            </div>
          );
        })}
      </div>

      <aside className="space-y-4">
        <div>
          <SectionLabel>Your decision</SectionLabel>
          <article className="rounded-lg border border-gray-200 bg-white p-3 mt-2 space-y-2 text-[11px]">
            <InfoRow label="Accepted" value={String(Object.values(decisions).filter((d) => d === "accepted").length)} />
            <InfoRow label="Sent back" value={String(Object.values(decisions).filter((d) => d === "sent-back").length)} />
            <InfoRow label="Remaining" value={String(decidableIds.length - decidedCount)} />
          </article>
        </div>

        <div>
          <SectionLabel>Sign off</SectionLabel>
          <article className={`rounded-lg border p-3 mt-2 ${allDecided ? "border-emerald-200 bg-emerald-50/30" : "border-gray-200 bg-white"}`}>
            <button
              disabled={!allDecided}
              className={`w-full h-9 rounded-md text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:ring-2 ${
                allDecided
                  ? "bg-violet-600 hover:bg-violet-700 text-white focus:ring-violet-500/30"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Sign off &amp; commit
            </button>
            {!allDecided && (
              <p className="text-[10px] text-gray-400 text-center mt-1.5 leading-relaxed">
                Decide every section first. Nothing reaches the graph until you sign off.
              </p>
            )}
          </article>
        </div>

        <div>
          <SectionLabel>Session</SectionLabel>
          <div className="rounded-md border border-gray-200 bg-white p-3 mt-2 space-y-2 text-[11px]">
            <InfoRow label="Successor" value={session.successor} />
            <InfoRow label="Deadline"  value={session.deadline} mono />
          </div>
        </div>
      </aside>
    </div>
  );
}

function PaSectionDetail({ section, decision, onAccept, onSendBack }) {
  return (
    <div className="rounded-md border border-gray-200 border-t-0 rounded-t-none bg-gray-50/40 p-4 -mt-px mb-2 space-y-3">
      {section.flag && (
        <div className="rounded-md border border-yellow-200 bg-yellow-50/60 px-3 py-2 flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-yellow-700 shrink-0 mt-0.5" strokeWidth={2} />
          <p className="text-[11px] text-yellow-900 leading-relaxed">{section.flag}</p>
        </div>
      )}

      <div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium mb-1">Captured answer</div>
        <p className="text-[13px] text-gray-800 leading-relaxed">{section.answer}</p>
      </div>

      <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
        <FileText className="w-3 h-3" strokeWidth={1.75} />
        <span>{section.source}</span>
      </div>

      {decision ? (
        <div className={`rounded-md border px-3 py-2 text-[12px] font-medium inline-flex items-center gap-1.5 ${
          decision === "accepted" ? "border-violet-200 bg-violet-50/50 text-violet-700" : "border-yellow-200 bg-yellow-50/50 text-yellow-800"
        }`}>
          {decision === "accepted" ? <Check className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5" />}
          {decision === "accepted" ? "Accepted · commits on sign-off" : "Sent back to Phương Anh"}
        </div>
      ) : (
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={onAccept}
            className="h-8 px-3 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-[12px] font-semibold inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          >
            <Check className="w-3.5 h-3.5" />
            Accept
          </button>
          <button
            onClick={onSendBack}
            className="h-8 px-3 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-[12px] font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            title="Returns this section to Phương Anh's queue for a clarification"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Send back
          </button>
        </div>
      )}
    </div>
  );
}
