"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, ChevronDown, X,
  Search, Filter, MoreHorizontal, Bell, Plus, Settings,
  AlertTriangle, AlertOctagon, CheckCircle2, Loader2,
  Calendar, ArrowRight, ArrowUpRight, ExternalLink,
  Users, FileText, MessageSquare, Network, Tag,
  GitBranch, Folder, Sparkles, Database, Eye,
  Briefcase, Hash
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   Hà Vy's Handover Dashboard — multi-session progress view

   Architectural intent · separate the dashboard (Manager's command
   center) from per-session work, which lives on dedicated routes:
     · /session/new   → uc-ho-01-quick-initiate (one-click)
     · /session/[id]  → session-command-view (2-tab full page · CL-107)

   3 user-facing phases (Prepare · Capture · Deliver · CL-088); the 8
   internal sub-stages remain for tracking. POC source is Trello
   (CL-091) and Capture is the async question queue (CL-098/099) — no
   voice interview. Dashboard renders no source chips or forms.

   CL-107 · labels + values only; explainer subtitles/paragraphs removed.
   Policy (CL-111) · standard offboarding window is 30 days; the review
   deadline is set 3–5 days before the last day so admin + offboarder
   verify together. Khánh Linh is the urgent short-notice exception
   (2 days) that exercises the EX.2 edge case.
   Session model (CL-114) · sessions have NO successor field — no name,
   no "to be assigned" placeholder, no field at all. Newcomer identity
   is RBAC-flagged at Knowledge Graph access time (Entra ID Newcomer
   role), not at session-time. Activity feed + completion banner +
   session-card subtitles reflect this — no named successor anywhere
   in user copy.
   Chrome (CL-115) · the topbar is "ART-EEP" only; no "Manager
   dashboard" suffix or any other role qualifier. The persona pill
   (HV · Hà Vy · Manager · Engineering) is preserved as a user-
   identity affordance, not chrome — it shows who the user is, not
   what the surface is called.
   Vocabulary (CL-113 / CL-116) · no "playbook" in user copy. Phase 3
   sub-stage 8 is "KG access ready" (role-customized starter prompts
   seeded + ACL provisioned for the Newcomer role). Any leftover
   "playbook" wording is a bug to purge.
   CL-112 · terminology. The pre-commit review unit is an "item"
   (across UC-HO-04 and the session review surfaces). The post-commit
   Knowledge-Graph count on the completed card is "entries" — a
   different unit at a different lifecycle stage — so "items" no longer
   means two things across screens.
   Action-orientation (CL-117) · dashboards for infrequent high-stakes
   activities show actions and event-driven signals, not time-
   aggregated metrics. Offboarding is infrequent · weekly-rollup KPIs
   ("this week" counts, all-time averages, throughput totals) are
   measurement chrome, not action prompts, and don't earn dashboard
   space. The top KPI row and the right-rail "This week" panel are
   removed. Urgency is carried by card-level affordances (rose left-
   border + Urgent pill per CL-065 · "Action needed" badge · days-
   remaining inline · status text) and segmentation is handled by the
   FilterChips row. Aggregate / throughput metrics belong on a future
   /reports surface or in the Heatmap (CL-094 · Thảo Vũ's upper-
   management surface per CL-104), not here.
   POC persona scope (CL-118) · narrowed 9 → 8; Phương Anh Nguyễn
   (Sales) removed from POC scope. The dashboard now renders 2
   concurrent active sessions (Minh Lê + Khánh Linh) instead of 3.
   The Phương Anh activity-feed entry and the `sess-pha` SESSIONS_ACTIVE
   card are removed. Khánh Linh remains the urgent short-notice
   exception (CL-111 / EX.2); Minh Lê remains the canonical 30-day
   path. The four-archetype Consumer-plane model (CL-104) is intact
   on its own surface (`/knowledge-graph`); CL-118 doesn't touch it.
   ═══════════════════════════════════════════════════════════════════ */

const FLOW = [
  { id: "active",    label: "Active dashboard", trigger: "2 sessions in flight at different lifecycle phases." },
  { id: "completed", label: "Just completed",   trigger: "Minh Lê's session finished · moves to Completed section." },
];

// 3 user-facing phases · each contains 2-3 internal sub-stages
const LIFECYCLE_PHASES = [
  {
    id: 1, key: "prepare", label: "Prepare",
    description: "Set up the session and scan accessible work",
    actor: "Manager + System",
    subStages: [
      { id: 1, label: "Setup confirmed",     actor: "Manager"    },
      { id: 2, label: "Context seeding",     actor: "System"     },
      { id: 3, label: "Knowledge map ready", actor: "System"     },
    ],
  },
  {
    id: 2, key: "capture", label: "Capture",
    description: "Offboarder answers the question queue, then Manager reviews",
    actor: "Offboarder + Manager",
    subStages: [
      { id: 4, label: "Questions assigned", actor: "Offboarder" },
      { id: 5, label: "Answering queue",    actor: "Offboarder" },
      { id: 6, label: "Answers reviewed",   actor: "Manager"    },
    ],
  },
  {
    id: 3, key: "deliver", label: "Deliver",
    description: "Commit knowledge and ready newcomer access",
    actor: "System",
    subStages: [
      { id: 7, label: "Committed to KG",  actor: "System" },
      { id: 8, label: "KG access ready",  actor: "System" },
    ],
  },
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

// CL-118 · `sess-pha` (Phương Anh Nguyễn · Sales) removed; POC persona
// scope narrowed 9 → 8. The remaining 2 active sessions cover the
// canonical 30-day path (Minh Lê · CL-111) and the urgent 2-day
// short-notice exception (Khánh Linh · CL-111 / EX.2).
const SESSIONS_ACTIVE = [
  {
    id: "sess-kltran",
    offboarder: "Khánh Linh Trần",
    role: "Head of People Operations",
    dept: "People & Culture",
    subStageId: 1,
    daysLeft: 2,
    urgency: "critical",
    statusText: "Awaiting your initiation",
    activeDetail: "Short-notice departure · HR sync 38 minutes ago",
    action: { label: "Start setup", primary: true, route: "/session/new" },
  },
  {
    id: "sess-minhle",
    offboarder: "Minh Lê",
    role: "Senior Backend Engineer",
    dept: "Engineering",
    subStageId: 2,
    daysLeft: 26,
    urgency: "in-progress",
    statusText: "Context seeding in progress",
    activeDetail: "4m 12s elapsed · ~4m remaining",
    action: { label: "Open session", primary: false, route: "/session/minh-le" },
  },
];

const SESSION_COMPLETED_ML = {
  id: "sess-minhle-done",
  offboarder: "Minh Lê",
  role: "Senior Backend Engineer",
  dept: "Engineering",
  subStageId: 8,
  completedAt: "Just now",
  durationLabel: "3 days, 4 hours total",
  stats: { entries: 487, canonicalFacts: 12, gapsResolved: 9 },
};

// CL-118 · the Phương Anh "Signed handover answers · awaiting Hà Vy's
// review" entry is removed. The remaining 4 entries cover the post-
// commit KG access ready beat (per CL-113 / CL-116), the Minh Lê
// commit beat (per CL-112 vocabulary), Khánh Linh's urgent HR sync
// (per CL-111 EX.2), and Hà Vy's prompt-add action.
const ACTIVITY = [
  { ts: "2 min ago",   actor: "System",            text: "Knowledge Graph access ready · starter prompts seeded for the Senior Backend Engineer role", severity: "low" },
  { ts: "7 min ago",   actor: "System",            text: "Minh Lê's session committed to knowledge graph · 487 entries", severity: "low" },
  { ts: "1 hour ago",  actor: "System",            text: "Khánh Linh Trần's departure record synced from HR · urgent (2 days)", severity: "high" },
  { ts: "4 hours ago", actor: "Hà Vy",             text: "Added 3 priority prompts to Minh Lê's session",  severity: "low" },
];

export default function HaVyHandoverDashboard({ embedded = false, view = "active" } = {}) {
  const [stepIdx, setStepIdx] = useState(() => {
    const i = FLOW.findIndex((s) => s.id === view);
    return i >= 0 ? i : 0;
  });
  const step = FLOW[stepIdx];

  if (embedded) {
    return <StepRenderer id={step.id} />;
  }

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
  // CL-115 · topbar is "ART-EEP" only · no "Manager dashboard" suffix
  // or other role qualifier. The persona pill (right side) is a user-
  // identity affordance, not chrome, and is preserved.
  return (
    <header className="bg-white border-b border-gray-200 px-5 py-2.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
        <span className="text-gray-900 font-semibold tracking-[0.18em] text-xs" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>ART-EEP</span>
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
          <span>3-phase lifecycle · cards navigate to /session/[id]</span>
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
  // CL-117 · no KPI row above; no "This week" mini-stats panel in the
  // right rail. Aggregate / time-rollup metrics are removed from the
  // operational dashboard. Urgency lives at the card level (rose
  // border + Urgent pill per CL-065 · "Action needed" badge · days-
  // remaining · status text). Segmentation lives in FilterChips below.
  // CL-118 · 2 concurrent sessions (Minh Lê + Khánh Linh), not 3.
  return (
    <div className="max-w-7xl mx-auto p-6">
      <PageHeader title="Good afternoon, Hà Vy" />

      <FilterChips />

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-3">
          <SectionLabel count={SESSIONS_ACTIVE.length}>Active sessions</SectionLabel>
          {SESSIONS_ACTIVE.map((s) => <SessionCard key={s.id} session={s} />)}

          <Link
            href="/session/new"
            className="w-full h-10 rounded-md border border-dashed border-gray-300 text-sm text-gray-500 hover:text-gray-700 hover:border-gray-400 inline-flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            Create a manual handover session
          </Link>
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

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 2 · JUST COMPLETED
   ═══════════════════════════════════════════════════════════════════ */

function JustCompletedDashboard() {
  // CL-117 · KPI row removed; completion celebration banner carries
  // the moment, FilterChips segments by status, and the completed
  // card carries the totals at the card level.
  // CL-118 · with Phương Anh removed and Minh Lê moving to completed,
  // the active list has only Khánh Linh remaining.
  const stillActive = SESSIONS_ACTIVE.filter((s) => s.id !== "sess-minhle");

  return (
    <div className="max-w-7xl mx-auto p-6">
      <PageHeader title="Good afternoon, Hà Vy" />

      <CompletionCelebration />

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
  // CL-113 / CL-116 · the previous "View Nam's playbook" CTA is removed.
  // Banner is informational (the bundle is committed; Newcomer access is
  // ready per sub-stage 8) — not navigational. CL-114 · no named
  // successor in the copy.
  return (
    <article className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4 mb-6 flex items-start gap-3">
      <div className="w-10 h-10 rounded-full bg-white border border-emerald-200 flex items-center justify-center shrink-0">
        <CheckCircle2 className="w-4 h-4 text-emerald-700" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900">Minh Lê's handover is complete</h3>
        <p className="text-[12px] text-gray-500 mt-0.5">487 entries · 12 canonical facts · 9 gaps resolved · Knowledge Graph access ready for the Senior Backend Engineer role</p>
      </div>
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
          {/* CL-114 · successor reference removed from subtitle */}
          <p className="text-[12px] text-gray-500 mb-3">{session.role} · {session.dept}</p>

          <PhaseProgress subStageId={session.subStageId} done />
          <div className="text-[10px] text-gray-500 mt-1.5" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
            All 3 phases complete · {session.durationLabel}
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            <SmallStat icon={Database}    label="Entries"         value={String(session.stats.entries)} />
            <SmallStat icon={Network}     label="Canonical facts" value={String(session.stats.canonicalFacts)} />
            <SmallStat icon={Sparkles}    label="Gaps resolved"  value={String(session.stats.gapsResolved)} />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <button className="h-8 px-3 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
            <FileText className="w-3 h-3" />
            View answers
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
   Reusable session card · entire card is clickable · shows 3 phases
   ═══════════════════════════════════════════════════════════════════ */

function SessionCard({ session }) {
  const isUrgent = session.urgency === "critical";
  const needsAction = session.urgency === "needs-action";
  const cardCls = isUrgent
    ? "border-rose-200 bg-rose-50/20"
    : "border-gray-200";
  const leftBorder = isUrgent ? "2px solid rgb(244, 63, 94)" : undefined;

  const initials = session.offboarder.split(" ").map((w) => w[0]).join("").slice(0, 2);
  const phase = getPhase(session.subStageId);
  const subStage = getSubStage(session.subStageId);

  return (
    <Link
      href={session.action.route}
      className={`block rounded-lg border bg-white transition-all hover:border-gray-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${cardCls}`}
      style={leftBorder ? { borderLeft: leftBorder } : undefined}
      title={`Opens ${session.action.route}`}
    >
      <article className="p-4 flex items-start gap-4">
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

          {/* CL-114 · successor reference removed from subtitle */}
          <p className="text-[12px] text-gray-500 mb-3">
            {session.role} · {session.dept}
            {!isUrgent && <> · {session.daysLeft} days remaining</>}
          </p>

          <PhaseProgress subStageId={session.subStageId} />

          <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-500">
            <span className="font-semibold text-gray-700">{session.statusText}</span>
            <span className="text-gray-300">·</span>
            <span>{session.activeDetail}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className={`h-8 px-3 rounded-md text-sm font-medium inline-flex items-center gap-1.5 transition-colors ${
            session.action.primary
              ? "bg-violet-600 group-hover:bg-violet-700 text-white"
              : "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
          }`}>
            {session.action.label}
            <ArrowRight className="w-3 h-3" />
          </span>
          <span className="text-[10px] text-gray-400 inline-flex items-center gap-1" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
            <ExternalLink className="w-2.5 h-2.5" />
            {session.action.route}
          </span>
        </div>
      </article>
    </Link>
  );
}

/* 3-phase progress · current phase shows within-phase fill;
   completed phases fully emerald; future phases gray. */
function PhaseProgress({ subStageId, done }) {
  const currentPhase = getPhase(subStageId);
  const currentSubStage = getSubStage(subStageId);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5 text-[10px]">
        <span className="text-gray-700 font-medium">
          {done
            ? <>All 3 phases complete</>
            : <>Phase {currentPhase.id} of 3 · <span className="text-gray-900">{currentPhase.label}</span></>
          }
        </span>
        <span className="text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
          {done ? "100%" : `${currentSubStage.label}`}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-1">
        {LIFECYCLE_PHASES.map((phase) => {
          const isDone = done || phase.id < currentPhase.id;
          const isCurrent = !done && phase.id === currentPhase.id;
          let withinFillPct = 0;
          if (isCurrent) {
            const subIdx = phase.subStages.findIndex((s) => s.id === subStageId);
            withinFillPct = ((subIdx + 0.5) / phase.subStages.length) * 100;
          }
          return (
            <div key={phase.id} className="relative h-2 rounded-sm bg-gray-200 overflow-hidden" title={`${phase.label} · ${phase.description}`}>
              {isDone && <div className="absolute inset-0 bg-emerald-500" />}
              {isCurrent && <div className="absolute inset-y-0 left-0 bg-violet-500 animate-pulse" style={{ width: `${withinFillPct}%` }} />}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-1 mt-1">
        {LIFECYCLE_PHASES.map((phase) => {
          const isDone = done || phase.id < currentPhase.id;
          const isCurrent = !done && phase.id === currentPhase.id;
          return (
            <span
              key={phase.id}
              className={`text-[9px] uppercase tracking-wider font-medium text-center ${
                isDone ? "text-emerald-700"
                : isCurrent ? "text-violet-700"
                : "text-gray-400"
              }`}
            >
              {phase.label}
            </span>
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

/* CL-117 · KpiRow / KpiTile / MiniStat removed entirely. Aggregate /
   time-rollup metrics don't render on the operational dashboard.
   See the file header for the rule and the change log for CL-117. */

function FilterChips() {
  // CL-118 · counts updated for the 2-session POC scope. "All · 2"
  // (Minh + Khánh Linh), "Awaiting you · 1" (Khánh Linh's "Awaiting
  // your initiation"), "In progress · 1" (Minh's context seeding),
  // "Urgent · 1" (Khánh Linh's 2-day exception). "Completed · 2"
  // remains a placeholder for the historical completed surface.
  const chips = [
    { label: "All",            count: 2, active: true  },
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
