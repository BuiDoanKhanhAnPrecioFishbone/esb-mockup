"use client";

import React from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, X,
  FileText, MessageSquare, Network, Eye,
  AlertTriangle, AlertOctagon, Clock, CheckCircle2, Loader2,
  ArrowRight, MoreHorizontal, Tag, Trello, Lock,
  RefreshCw, UploadCloud, History, ShieldAlert
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
     · CL-118 (2026-06-09) · POC persona scope narrowed 9 → 8 —
       Phương Anh Nguyễn (Sales · Senior Account Executive) removed
       from POC scope. This supersedes CL-109 (the Phương Anh real
       Manager review surface). Concrete removals: the `pa` entry
       from SESSIONS, the `phuong-anh` slug branch in ReviewTab, the
       PhuongAnhReview + PaSectionDetail components, the PA_SECTIONS
       data, and the dead OverviewReview + ActionSidebar.isReview
       paths (PA was the only session at subStage 6). The persona-
       agnosticism of the UC-HO-04 + UC-HO-03 review model is
       preserved at the architecture level — a future second offboarder
       persona at subStage 6 would route through the same generic
       review surface.
     · CL-112 · the review unit is "items" everywhere so all review
       surfaces and the dashboard use one noun. The post-commit KG
       count on the dashboard is "entries" — a different unit at a
       different stage.
     · CL-111 · 30-day offboarding-window timeline. Minh — last day
       Jul 4, review deadline Jun 30, 26 days left. Khánh Linh's
       2-day urgent path lives on the dashboard, not here.
   ═══════════════════════════════════════════════════════════════════ */

const FLOW = [
  { id: "ml-overview", label: "Minh Lê · Overview",    trigger: "Phase 1 · Prepare · seeding from Trello." },
  { id: "ml-review",   label: "Minh Lê · Review",      trigger: "Manager review · UC-HO-04 decision workspace." },
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

// CL-118 · the `pa` (Phương Anh Nguyễn · Sales) session entry is removed
// from this map. Minh Lê remains the only wired session in the
// session-command-view; Khánh Linh's urgent path lives on the
// dashboard. Future offboarder personas would add their own entry here
// using the same shape.
const SESSIONS = {
  ml: {
    urlSlug: "minh-le", offboarder: "Minh Lê", role: "Senior Backend Engineer",
    dept: "Engineering", initials: "ML", subStageId: 2, daysLeft: 26,
    successor: "Trần Hữu Nam", deadline: "June 30, 2026 · 17:00",
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
            {session.role} · successor <span className="text-gray-700">{session.successor || "to be assigned"}</span> · deadline <span className="text-gray-700" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{session.deadline}</span>
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

/* ─── Overview · varies by phase ─────────────────────────────────────
   CL-118 · the subStage === 6 ("Answers reviewed") branch + the
   matching OverviewReview component are removed because Phương Anh
   was the only wired session in that state. A future session at
   subStage 6 would re-introduce a generic items-preview surface,
   keyed off its own bundle items rather than the deleted PA_SECTIONS
   mockup data. */

function OverviewTab({ session }) {
  if (session.subStageId === 2) return <OverviewSeeding session={session} />;
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

/* ─── Action rail · next action + info + cancel (Settings folds here) ──
   CL-118 · the isReview branch (subStage === 6) is removed alongside
   OverviewReview — Phương Anh was the only session that triggered it.
   A future subStage-6 session would add its own action card here. */

function ActionSidebar({ session }) {
  const isSeeding = session.subStageId === 2;

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
      </div>

      <div>
        <SectionLabel>Session</SectionLabel>
        <div className="rounded-md border border-gray-200 bg-white p-3 mt-2 space-y-2 text-[11px]">
          <InfoRow label="Successor" value={session.successor || "to be assigned"} />
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

/* ─── Manager review (CL-103 · Minh Lê) ──────────────────────────────
   CL-118 · the `phuong-anh` slug branch is removed; CL-109's Phương Anh
   real-review surface (PhuongAnhReview + PaSectionDetail + PA_SECTIONS)
   is superseded. Minh Lê routes to UCHO04ManagerReview; any other
   slug renders empty (the slug allow-list lives in
   app/session/[id]/page.tsx, which CL-118 updates separately). */

function ReviewTab({ session, state }) {
  if (session.urlSlug === "minh-le") {
    return <UCHO04ManagerReview embedded state={state || "s1"} />;
  }
  return null;
}
