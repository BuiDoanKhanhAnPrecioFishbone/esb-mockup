"use client";

import React, { useState } from "react";
import {
  ChevronLeft, ChevronRight, ChevronDown, X,
  Search, Filter, MoreHorizontal, Bell, Plus, Settings,
  AlertTriangle, AlertOctagon, Clock, CheckCircle2, Loader2,
  Calendar, ArrowRight, ArrowUpRight, ExternalLink,
  Users, FileText, MessageSquare, Network, Tag,
  GitBranch, Folder, Mail, Sparkles, Database, Eye,
  Briefcase, Hash, Inbox
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   Hà Vy's Handover Dashboard — multi-session progress view

   Architectural intent · separate the dashboard (Manager's command
   center) from per-session work, which now lives on dedicated routes:

     · /session/[id]/setup  → uc-ho-01-quick-initiate (one-click)
     · /session/[id]        → session-command-view (tabbed full page)

   The dashboard's job is ONLY to surface state at a glance:
     · Which sessions need my attention?
     · How far along is each one?
     · What's the next action?

   Clicking a session card NAVIGATES to the command view — no more
   480px side drawer (replaced based on UX feedback that drawers
   are too cramped for the data volume in session management).

   Two screens demonstrate the dashboard's stateful behavior:
     1. Active dashboard — 3 sessions in different lifecycle stages
     2. Just completed — Minh Lê's session moved to "Completed" section

   Design system locked decisions exercised:
     · CL-054 violet primary + yellow secondary + rose critical + emerald verified
     · CL-063 multi-persona dashboard (3 concurrent sessions visible)
     · CL-065 critical urgency · 2px rose left-border + Urgent pill
     · CL-020 audit anchor referenced in activity feed
     · CL-055 32px primary buttons; CL-059 explicit focus rings
   ═══════════════════════════════════════════════════════════════════ */

const FLOW = [
  { id: "active",    label: "Active dashboard",       trigger: "3 sessions in flight at different lifecycle stages." },
  { id: "completed", label: "Just completed",         trigger: "Minh Lê's session finished · moves to Completed section." },
];

// The 8 user-facing lifecycle stages (vs 13 internal UC-HO-01 steps)
const LIFECYCLE_STAGES = [
  { id: 1, key: "setup",       label: "Setup pending",          actor: "Manager",    description: "Waiting for the manager to initiate the session." },
  { id: 2, key: "config",      label: "Configuration",          actor: "Manager",    description: "Manager confirms details and data sources." },
  { id: 3, key: "seeding",     label: "Context seeding",        actor: "System",     description: "System scans Offboarder's accessible work." },
  { id: 4, key: "ready",       label: "Ready for interview",    actor: "Offboarder", description: "Knowledge map produced. Interview can be scheduled." },
  { id: 5, key: "interview",   label: "Interview in progress",  actor: "Offboarder", description: "AI-guided voice interview with the Offboarder." },
  { id: 6, key: "review",      label: "Transcript review",      actor: "Manager",    description: "Manager reviews and approves the captured content." },
  { id: 7, key: "commit",      label: "Committing to KG",       actor: "System",     description: "Verified content propagates to the knowledge graph." },
  { id: 8, key: "playbook",    label: "Playbook delivered",     actor: "Successor",  description: "Personalized onboarding playbook ready for the successor." },
];

const SESSIONS_ACTIVE = [
  {
    id: "sess-kltran",
    offboarder: "Khánh Linh Trần",
    role: "Head of People Operations",
    dept: "People & Culture",
    stageId: 1,
    progressPct: 0,
    daysLeft: 2,
    urgency: "critical",
    statusText: "Awaiting your initiation",
    activeDetail: "HR sync detected · 38 minutes ago",
    action: { label: "Start setup", primary: true, route: "/session/sess-kltran/setup" },
    successor: null,
  },
  {
    id: "sess-minhle",
    offboarder: "Minh Lê",
    role: "Senior Backend Engineer",
    dept: "Engineering",
    stageId: 3,
    progressPct: 32,
    daysLeft: 6,
    urgency: "in-progress",
    statusText: "Context seeding in progress",
    activeDetail: "Stage 3 of 8 · 4m 12s elapsed · ~4m remaining",
    action: { label: "Open session", primary: false, route: "/session/sess-minhle" },
    successor: "Trần Hữu Nam",
  },
  {
    id: "sess-pha",
    offboarder: "Phương Anh Nguyễn",
    role: "Senior Account Executive",
    dept: "Sales",
    stageId: 6,
    progressPct: 72,
    daysLeft: 4,
    urgency: "needs-action",
    statusText: "Awaiting your review",
    activeDetail: "Signed by Phương Anh · 38 minutes ago",
    action: { label: "Review transcript", primary: true, route: "/session/sess-pha" },
    successor: "Đặng Khải Hoàn",
  },
];

const SESSION_COMPLETED_ML = {
  id: "sess-minhle-done",
  offboarder: "Minh Lê",
  role: "Senior Backend Engineer",
  dept: "Engineering",
  stageId: 8,
  progressPct: 100,
  completedAt: "Just now",
  durationLabel: "3 days, 4 hours total",
  successor: "Trần Hữu Nam",
  stats: { items: 487, canonicalFacts: 12, gapsResolved: 9 },
};

const ACTIVITY = [
  { ts: "2 min ago",   actor: "System",            text: "Minh Lê's playbook generated for Trần Hữu Nam",   severity: "low" },
  { ts: "7 min ago",   actor: "System",            text: "Minh Lê's session committed to knowledge graph · 487 items", severity: "low" },
  { ts: "38 min ago",  actor: "Phương Anh Nguyễn", text: "Signed handover transcript · awaiting Hà Vy's review", severity: "medium" },
  { ts: "1 hour ago",  actor: "System",            text: "Khánh Linh Trần's departure record synced from HR · urgent (2 days)", severity: "high" },
  { ts: "4 hours ago", actor: "Hà Vy",             text: "Added 3 priority prompts to Minh Lê's session",  severity: "low" },
];

export default function HaVyHandoverDashboard() {
  const [stepIdx, setStepIdx] = useState(0);
  const step = FLOW[stepIdx];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      <TopBar />
      <FlowBar step={step} stepIdx={stepIdx} onJump={setStepIdx} />
      <main className="flex-1">
        <StepRenderer id={step.id} />
      </main>
      <FooterNav stepIdx={stepIdx} step={step} onChange={setStepIdx} />
    </div>
  );
}

/* ─── Chrome ────────────────────────────────────────────────── */

function TopBar() {
  return (
    <header className="bg-white border-b border-gray-200 px-5 py-2.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
        <span className="text-gray-900 font-semibold tracking-[0.18em] text-xs" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>ART-EEP</span>
        <span className="text-gray-300 text-xs">·</span>
        <span className="text-gray-500 text-xs">Manager dashboard</span>
      </div>

      <div className="flex items-center gap-3">
        <button className="h-8 w-8 rounded-md hover:bg-gray-100 inline-flex items-center justify-center text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 relative" title="Notifications">
          <Bell className="w-3.5 h-3.5" strokeWidth={1.75} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500" />
        </button>
        <button className="h-8 w-8 rounded-md hover:bg-gray-100 inline-flex items-center justify-center text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20" title="Settings">
          <Settings className="w-3.5 h-3.5" strokeWidth={1.75} />
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
          <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 text-[11px] font-semibold inline-flex items-center justify-center">HV</div>
          <div className="text-[11px] text-gray-700">
            <div className="font-medium text-gray-900 leading-tight">Hà Vy</div>
            <div className="text-gray-500 leading-tight">Manager · Engineering</div>
          </div>
        </div>
      </div>
    </header>
  );
}

function FlowBar({ step, stepIdx, onJump }) {
  return (
    <div className="bg-white border-b border-gray-200 px-5 py-2 flex items-center justify-between gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-[11px] text-gray-500">
          <span className="uppercase tracking-wider font-semibold text-violet-700">Design exploration</span>
          <span className="text-gray-300">·</span>
          <span>Cards navigate to /session/[id] · no more side drawer</span>
          <span className="text-gray-300">·</span>
          <span style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>step {stepIdx + 1} of {FLOW.length}</span>
        </div>
        <h1 className="text-sm font-semibold text-gray-900 truncate mt-0.5">{step.label}</h1>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {FLOW.map((s, i) => (
          <button
            key={s.id}
            onClick={() => onJump(i)}
            title={s.label}
            className={`w-7 h-7 rounded-md border text-[11px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${
              i === stepIdx ? "bg-violet-600 text-white border-violet-600" : "bg-white text-violet-700 border-violet-200 hover:border-violet-400"
            }`}
            style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
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
  if (id === "active")    return <ActiveDashboard />;
  if (id === "completed") return <JustCompletedDashboard />;
  return null;
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 1 · ACTIVE DASHBOARD
   ═══════════════════════════════════════════════════════════════════ */

function ActiveDashboard() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <PageHeader
        title="Good afternoon, Hà Vy"
        subtitle="You have 3 active handover sessions. One needs your action right now."
      />

      <KpiRow active={3} needsAction={1} completedThisWeek={2} />

      <FilterChips />

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-3">
          <SectionLabel count={SESSIONS_ACTIVE.length}>Active sessions</SectionLabel>
          {SESSIONS_ACTIVE.map((s) => <SessionCard key={s.id} session={s} />)}

          <button className="w-full h-10 rounded-md border border-dashed border-gray-300 text-sm text-gray-500 hover:text-gray-700 hover:border-gray-400 inline-flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
            <Plus className="w-3.5 h-3.5" />
            Create a manual handover session
          </button>
        </div>

        <div className="space-y-3">
          <SectionLabel>Recent activity</SectionLabel>
          <div className="space-y-1.5">
            {ACTIVITY.map((a, i) => <ActivityItem key={i} {...a} />)}
          </div>

          <div className="pt-3 mt-3 border-t border-gray-200">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium mb-2">This week</h4>
            <div className="space-y-1.5 text-[12px]">
              <MiniStat label="Sessions completed" value="2" />
              <MiniStat label="Avg. session time" value="3.1 days" />
              <MiniStat label="Items committed to KG" value="892" />
              <MiniStat label="Hallucinations reported" value="0" tone="emerald" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 2 · JUST COMPLETED
   ═══════════════════════════════════════════════════════════════════ */

function JustCompletedDashboard() {
  // Minh Lê has now moved to completed; only Khánh Linh + Phương Anh are active
  const stillActive = SESSIONS_ACTIVE.filter((s) => s.id !== "sess-minhle");

  return (
    <div className="max-w-7xl mx-auto p-6">
      <PageHeader
        title="Good afternoon, Hà Vy"
        subtitle="Minh Lê's session just finished. Trần Hữu Nam's playbook is being prepared."
      />

      <CompletionCelebration />

      <KpiRow active={2} needsAction={1} completedThisWeek={3} />

      <FilterChips />

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          <div className="space-y-3">
            <SectionLabel count={stillActive.length}>Active sessions</SectionLabel>
            {stillActive.map((s) => <SessionCard key={s.id} session={s} />)}
          </div>

          <div className="space-y-3">
            <SectionLabel count={1}>Completed this week</SectionLabel>
            <CompletedSessionCard session={SESSION_COMPLETED_ML} />
          </div>
        </div>

        <div className="space-y-3">
          <SectionLabel>Recent activity</SectionLabel>
          <div className="space-y-1.5">
            {ACTIVITY.map((a, i) => <ActivityItem key={i} {...a} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function CompletionCelebration() {
  return (
    <article className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4 mb-6 flex items-start gap-3">
      <div className="w-10 h-10 rounded-full bg-white border border-emerald-200 flex items-center justify-center shrink-0">
        <CheckCircle2 className="w-4 h-4 text-emerald-700" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900">Minh Lê's handover is complete</h3>
        <p className="text-[12px] text-gray-700 mt-0.5 leading-relaxed">
          487 items committed to the knowledge graph · 12 canonical facts · 9 knowledge gaps resolved. Trần Hữu Nam's personalized onboarding playbook is being prepared and will be ready in a few minutes.
        </p>
      </div>
      <button className="h-8 px-3 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium inline-flex items-center gap-1.5 transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-violet-500/30">
        View Nam's playbook
        <ArrowUpRight className="w-3.5 h-3.5" />
      </button>
    </article>
  );
}

function CompletedSessionCard({ session }) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-colors cursor-pointer" title={`Opens /session/${session.id}`}>
      <div className="p-4 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold inline-flex items-center justify-center shrink-0 border border-emerald-200">ML</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-sm font-semibold text-gray-900">{session.offboarder}</h3>
            <span className="text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 inline-flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" />
              Complete
            </span>
            <span className="text-[10px] text-gray-500">{session.completedAt}</span>
          </div>
          <p className="text-[12px] text-gray-500 mb-3">{session.role} · {session.dept} · successor {session.successor}</p>

          <ProgressBar progressPct={100} currentStage={8} done />
          <div className="text-[10px] text-gray-500 mt-1.5" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
            All 8 stages complete · {session.durationLabel}
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            <SmallStat icon={Database}    label="Items"          value={String(session.stats.items)} />
            <SmallStat icon={Network}     label="Canonical facts" value={String(session.stats.canonicalFacts)} />
            <SmallStat icon={Sparkles}    label="Gaps resolved"  value={String(session.stats.gapsResolved)} />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <button className="h-8 px-3 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
            <FileText className="w-3 h-3" />
            View transcript
          </button>
          <button className="h-8 w-8 rounded-md hover:bg-gray-100 inline-flex items-center justify-center text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

function SmallStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-md border border-gray-200 bg-gray-50/40 px-2 py-1.5">
      <div className="flex items-center gap-1 text-[10px] text-gray-500 uppercase tracking-wider font-medium">
        <Icon className="w-2.5 h-2.5" strokeWidth={1.75} />
        {label}
      </div>
      <div className="text-sm font-semibold text-gray-900 mt-0.5" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{value}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Reusable session card · entire card is clickable
   Navigates to /session/[id] command view (no more drawer)
   ═══════════════════════════════════════════════════════════════════ */

function SessionCard({ session }) {
  const isUrgent = session.urgency === "critical";
  const needsAction = session.urgency === "needs-action";
  const cardCls = isUrgent
    ? "border-rose-200 bg-rose-50/20"
    : "border-gray-200";
  const leftBorder = isUrgent ? "2px solid rgb(244, 63, 94)" : undefined;

  const initials = session.offboarder.split(" ").map((w) => w[0]).join("").slice(0, 2);
  const stage = LIFECYCLE_STAGES.find((s) => s.id === session.stageId);

  return (
    <article
      className={`rounded-lg border bg-white transition-all hover:border-gray-300 hover:shadow-sm cursor-pointer ${cardCls}`}
      style={leftBorder ? { borderLeft: leftBorder } : undefined}
      title={`Opens ${session.action.route}`}
    >
      <div className="p-4 flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full text-[11px] font-semibold inline-flex items-center justify-center shrink-0 border ${
          isUrgent ? "bg-rose-50 text-rose-700 border-rose-200"
            : needsAction ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-gray-100 text-gray-700 border-gray-200"
        }`}>{initials}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-sm font-semibold text-gray-900">{session.offboarder}</h3>
            {isUrgent && (
              <span className="text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold bg-rose-100 border border-rose-200 text-rose-700 inline-flex items-center gap-1">
                <AlertOctagon className="w-2.5 h-2.5" />
                Urgent · {session.daysLeft} days
              </span>
            )}
            {needsAction && (
              <span className="text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700">
                Action needed
              </span>
            )}
          </div>

          <p className="text-[12px] text-gray-500 mb-3">
            {session.role} · {session.dept}
            {session.successor && <> · successor {session.successor}</>}
            {!isUrgent && <> · {session.daysLeft} days remaining</>}
          </p>

          <ProgressBar progressPct={session.progressPct} currentStage={session.stageId} stageName={stage.label} />

          <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-500">
            <span className="font-semibold text-gray-700">{session.statusText}</span>
            <span className="text-gray-300">·</span>
            <span>{session.activeDetail}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <button className={`h-8 px-3 rounded-md text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 ${
            session.action.primary
              ? "bg-violet-600 hover:bg-violet-700 text-white focus:ring-violet-500/30"
              : "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-violet-500/20"
          }`}>
            {session.action.label}
            <ArrowRight className="w-3 h-3" />
          </button>
          <span className="text-[10px] text-gray-400 inline-flex items-center gap-1" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
            <ExternalLink className="w-2.5 h-2.5" />
            {session.action.route}
          </span>
        </div>
      </div>
    </article>
  );
}

function ProgressBar({ progressPct, currentStage, stageName, done }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1 text-[10px]">
        <span className="text-gray-700 font-medium">{stageName || (done ? "Complete" : "")}</span>
        <span className="text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
          Stage {currentStage} of 8 · {progressPct}%
        </span>
      </div>
      <div className="flex items-center gap-0.5">
        {LIFECYCLE_STAGES.map((stage) => {
          const isDone = stage.id < currentStage || done;
          const isCurrent = stage.id === currentStage && !done;
          return (
            <span
              key={stage.id}
              title={stage.label}
              className={`flex-1 h-1.5 rounded-sm transition-colors ${
                isDone ? "bg-emerald-500"
                : isCurrent ? "bg-violet-500 animate-pulse"
                : "bg-gray-200"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Other primitives
   ═══════════════════════════════════════════════════════════════════ */

function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">{title}</h1>
      {subtitle && <p className="text-sm text-gray-500 mt-1 leading-relaxed">{subtitle}</p>}
    </div>
  );
}

function KpiRow({ active, needsAction, completedThisWeek }) {
  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      <KpiTile icon={Inbox}        label="Active sessions"        value={String(active)} />
      <KpiTile icon={AlertOctagon} label="Need your action"       value={String(needsAction)} tone={needsAction > 0 ? "warning" : "default"} />
      <KpiTile icon={CheckCircle2} label="Completed this week"    value={String(completedThisWeek)} tone="emerald" />
      <KpiTile icon={Clock}        label="Avg. session time"      value="3.1d" />
    </div>
  );
}

function KpiTile({ icon: Icon, label, value, tone }) {
  const cfg = {
    default: { border: "border-gray-200",   bg: "bg-white",        iconCls: "text-gray-500",   valueCls: "text-gray-900",   labelCls: "text-gray-500" },
    warning: { border: "border-yellow-200", bg: "bg-yellow-50/40", iconCls: "text-yellow-700", valueCls: "text-yellow-800", labelCls: "text-yellow-700" },
    emerald: { border: "border-emerald-200", bg: "bg-emerald-50/30", iconCls: "text-emerald-700", valueCls: "text-emerald-700", labelCls: "text-emerald-700" },
  }[tone || "default"];
  return (
    <div className={`rounded-lg border ${cfg.border} ${cfg.bg} px-3 py-3`}>
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className={`w-3 h-3 ${cfg.iconCls}`} strokeWidth={1.75} />
        <span className={`text-[10px] uppercase tracking-[0.18em] ${cfg.labelCls} font-medium`}>{label}</span>
      </div>
      <div className={`text-2xl font-semibold ${cfg.valueCls} tracking-tight`} style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{value}</div>
    </div>
  );
}

function FilterChips() {
  const chips = [
    { label: "All",            count: 3, active: true  },
    { label: "Awaiting you",   count: 1, active: false },
    { label: "In progress",    count: 1, active: false },
    { label: "Urgent",         count: 1, active: false, urgent: true },
    { label: "Completed",      count: 2, active: false },
  ];
  return (
    <div className="flex items-center gap-2 mb-5 flex-wrap">
      <span className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium mr-1">Filter</span>
      {chips.map((c) => (
        <button
          key={c.label}
          className={`h-7 px-2.5 rounded-md text-[12px] font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${
            c.active ? "bg-gray-900 text-white border border-gray-900"
            : c.urgent ? "bg-white text-rose-700 border border-rose-200 hover:border-rose-400"
            : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
          }`}
        >
          {c.label}
          <span className={`text-[10px] ${c.active ? "text-gray-300" : c.urgent ? "text-rose-500" : "text-gray-400"}`} style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
            {c.count}
          </span>
        </button>
      ))}
      <div className="flex-1" />
      <div className="relative">
        <Search className="w-3 h-3 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
        <input
          placeholder="Search sessions, people, projects…"
          className="h-7 pl-7 pr-2 rounded-md border border-gray-200 bg-white text-[12px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/15 w-64"
        />
      </div>
    </div>
  );
}

function SectionLabel({ count, children }) {
  return (
    <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium flex items-center gap-2">
      <span>{children}</span>
      {count !== undefined && (
        <span className="text-gray-400" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>· {count}</span>
      )}
    </h2>
  );
}

function ActivityItem({ ts, actor, text, severity }) {
  const borderColor = {
    low:    "rgb(229, 231, 235)",
    medium: "rgb(234, 179, 8)",
    high:   "rgb(244, 63, 94)",
  }[severity];
  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2" style={{ borderLeft: `2px solid ${borderColor}` }}>
      <div className="flex items-center justify-between mb-0.5 gap-2">
        <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{ts}</span>
        <span className="text-[10px] text-gray-700 font-medium shrink-0">{actor}</span>
      </div>
      <div className="text-[11px] text-gray-900 leading-relaxed">{text}</div>
    </div>
  );
}

function MiniStat({ label, value, tone }) {
  const valueCls = {
    default: "text-gray-900",
    emerald: "text-emerald-700",
  }[tone || "default"];
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500">{label}</span>
      <span className={`font-semibold ${valueCls}`} style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{value}</span>
    </div>
  );
}
