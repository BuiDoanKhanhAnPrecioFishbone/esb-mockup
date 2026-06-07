"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, ChevronDown, X, Check,
  Settings, FileText, MessageSquare, Network, Database, Eye,
  AlertTriangle, AlertOctagon, Clock, CheckCircle2, Loader2,
  Calendar, ArrowRight, ArrowUpRight, ExternalLink, MoreHorizontal,
  Users, Tag, GitBranch, Github, Folder, Sparkles, Hash, Lock,
  PlayCircle, PauseCircle, RefreshCw, Inbox, ShieldCheck,
  UploadCloud, History, ShieldAlert
} from "lucide-react";
import UCHO04ManagerReview from "./uc-ho-04-manager-review.jsx";

/* ═══════════════════════════════════════════════════════════════════
   Session Command View — dedicated full-screen page at /session/[id]

   THIS VERSION:
     · Compresses the 8-stage lifecycle into 3 user-facing phases
       (Prepare · Capture · Deliver), per UX feedback that 8 stages
       was cognitively heavy. Internal sub-stages (8 of them) still
       exist for system tracking.
     · Removes all email-as-source references per data-ingestion
       governance. Engineering sources are now Jira · GitHub · Drive.
     · CL-103 · UC-HO-04 Manager Review is wired as a 6th tab. The
       review tab special-cases the wrapper layout — UC-HO-04 has its
       own ItemListRail + DecisionRail, so we skip the standard
       1fr_280px grid + ActionSidebar that the other tabs share.

   Layout · TopBar with breadcrumb · Hero with persona + 3-phase
   progress · Tab navigation (Overview · Stages · Data · Audit ·
   Manager review · Settings) · Two-column main with content (left) +
   action sidebar (right) — except for Manager review which is full
   width inside the page container.

   Three screens demonstrate state diversity:
     1. Minh Lê · Overview tab · mid-seeding (Phase 1 · Prepare)
     2. Minh Lê · Stages tab · 3-phase timeline with sub-stages
     3. Phương Anh · Overview tab · awaiting review (Phase 2 · Capture)
   ═══════════════════════════════════════════════════════════════════ */

const FLOW = [
  { id: "ml-overview", label: "Minh Lê · Overview",   trigger: "Phase 1 of 3 · Prepare · context seeding in progress." },
  { id: "ml-stages",   label: "Minh Lê · Stages",     trigger: "Stages tab · 3-phase timeline · sub-stages expand within current phase." },
  { id: "pa-overview", label: "Phương Anh · Overview", trigger: "Phase 2 of 3 · Capture · awaiting your transcript review." },
];

// 3 user-facing phases · each contains 2-3 internal sub-stages
const LIFECYCLE_PHASES = [
  {
    id: 1, key: "prepare", label: "Prepare",
    description: "Set up the session and scan accessible work across approved sources",
    actor: "Manager + System",
    subStages: [
      { id: 1, label: "Setup confirmed",     actor: "Manager",    note: "Quick-initiate page · one click" },
      { id: 2, label: "Context seeding",     actor: "System",     note: "Scan Jira / GitHub / Drive" },
      { id: 3, label: "Knowledge map ready", actor: "System",     note: "Gaps inferred · ready for interview" },
    ],
  },
  {
    id: 2, key: "capture", label: "Capture",
    description: "AI-guided interview captures tacit knowledge, then Manager reviews",
    actor: "Offboarder + Manager",
    subStages: [
      { id: 4, label: "Interview scheduled",  actor: "Offboarder", note: "Offboarder picks a time" },
      { id: 5, label: "Voice interview",      actor: "Offboarder", note: "AI-guided dynamic questioning" },
      { id: 6, label: "Transcript reviewed",  actor: "Manager",    note: "Manager approves captured content" },
    ],
  },
  {
    id: 3, key: "deliver", label: "Deliver",
    description: "Commit verified knowledge and deliver personalized playbook",
    actor: "System + Successor",
    subStages: [
      { id: 7, label: "Committed to KG",      actor: "System",     note: "Atomic commit with rollback safety" },
      { id: 8, label: "Playbook delivered",   actor: "Successor",  note: "Personalized onboarding playbook" },
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

const SESSIONS = {
  ml: {
    id: "sess-minhle",
    urlSlug: "minh-le",
    sessionRef: "SESSION-2026-05-29-7a3c",
    offboarder: "Minh Lê",
    role: "Senior Backend Engineer",
    dept: "Engineering",
    initials: "ML",
    subStageId: 2, // mid-seeding in Phase 1 (Prepare)
    daysLeft: 6,
    successor: "Trần Hữu Nam",
    deadline: "June 8, 2026 · 17:00",
    anchoredAt: "2026-05-29 · 14:32:08Z",
    scopeHash: "b7e29f...4ac1",
  },
  pa: {
    id: "sess-phuonganh",
    urlSlug: "phuong-anh",
    sessionRef: "SESSION-2026-05-27-3f2b",
    offboarder: "Phương Anh Nguyễn",
    role: "Senior Account Executive",
    dept: "Sales",
    initials: "PA",
    subStageId: 6, // transcript review in Phase 2 (Capture)
    daysLeft: 4,
    successor: "Đặng Khải Hoàn",
    deadline: "June 5, 2026 · 17:00",
    anchoredAt: "2026-05-27 · 09:14:22Z",
    scopeHash: "d4a18c...9e02",
  },
};

const TABS = [
  { id: "overview",  label: "Overview" },
  { id: "stages",    label: "Stages" },
  { id: "data",      label: "Data" },
  { id: "audit",     label: "Audit log" },
  { id: "review",    label: "Manager review" },
  { id: "settings",  label: "Settings" },
];

export default function SessionCommandView({ embedded = false, view = "ml-overview" } = {}) {
  const [stepIdx, setStepIdx] = useState(() => {
    const i = FLOW.findIndex((s) => s.id === view);
    return i >= 0 ? i : 0;
  });

  if (embedded) {
    // view encodes "<sessionKey>-<tabId>", e.g. "ml-overview", "pa-audit", "ml-review"
    const dash = view.indexOf("-");
    const sessKey = dash > 0 ? view.slice(0, dash) : "ml";
    const tab = dash > 0 ? view.slice(dash + 1) : "overview";
    const session = SESSIONS[sessKey];
    if (!session) return null;
    return <CommandView session={session} activeTab={tab} />;
  }

  const step = FLOW[stepIdx];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      <TopBar step={step} stepIdx={stepIdx} onJump={setStepIdx} />
      <main className="flex-1">
        <StepRenderer id={step.id} />
      </main>
      <FooterNav stepIdx={stepIdx} step={step} onChange={setStepIdx} />
    </div>
  );
}

/* ─── Chrome ────────────────────────────────────────────────── */

function TopBar({ step, stepIdx, onJump }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="px-5 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0 shrink-0">
          <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
          <span className="text-gray-900 font-semibold tracking-[0.18em] text-xs" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>ART-EEP</span>
          <span className="text-gray-300 text-xs">·</span>
          <button className="text-xs text-gray-500 hover:text-gray-900 inline-flex items-center gap-1">
            <ChevronLeft className="w-3 h-3" />
            Dashboard
          </button>
          <span className="text-gray-300 text-xs">/</span>
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
  if (id === "ml-overview") return <CommandView session={SESSIONS.ml} activeTab="overview" />;
  if (id === "ml-stages")   return <CommandView session={SESSIONS.ml} activeTab="stages" />;
  if (id === "pa-overview") return <CommandView session={SESSIONS.pa} activeTab="overview" />;
  return null;
}

/* ═══════════════════════════════════════════════════════════════════
   The command view — shared layout for all 6 tabs

   The "review" tab special-cases the wrapper: UC-HO-04 owns its own
   ItemListRail + DecisionRail layout, so we skip the standard
   1fr_280px grid + ActionSidebar to avoid a redundant right column.
   ═══════════════════════════════════════════════════════════════════ */

function CommandView({ session, activeTab }) {
  if (activeTab === "review") {
    return (
      <div className="max-w-7xl mx-auto">
        <Hero session={session} />
        <TabBar session={session} activeTab={activeTab} />
        <ReviewTab session={session} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Hero session={session} />
      <TabBar session={session} activeTab={activeTab} />
      <div className="grid grid-cols-[1fr_280px] gap-5 p-6">
        <div className="min-w-0">
          {activeTab === "overview" && <OverviewTab session={session} />}
          {activeTab === "stages"   && <StagesTab session={session} />}
          {activeTab === "data"     && <DataTab session={session} />}
          {activeTab === "audit"    && <AuditTab session={session} />}
          {activeTab === "settings" && <SettingsTab session={session} />}
        </div>
        <ActionSidebar session={session} />
      </div>
    </div>
  );
}

/* ─── Hero · persona identity + 3-phase progress + current sub-stage ── */

function Hero({ session }) {
  const phase = getPhase(session.subStageId);
  const subStage = getSubStage(session.subStageId);
  const isUrgent = session.daysLeft <= 3;

  return (
    <section className="bg-white border-b border-gray-200 px-6 py-5">
      <div className="flex items-start gap-5">
        <div className="w-14 h-14 rounded-full bg-gray-100 border border-gray-200 text-gray-700 text-base font-semibold inline-flex items-center justify-center shrink-0">
          {session.initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">{session.offboarder}</h1>
            <span className="text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold bg-gray-100 border border-gray-200 text-gray-700">
              {session.dept}
            </span>
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
            <span className="text-gray-300">·</span>
            <span>Owned by <span className="text-gray-700 font-medium">{subStage.actor}</span></span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button className="h-8 px-3 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
            <ExternalLink className="w-3 h-3" />
            Audit log
          </button>
          <button className="h-8 w-8 rounded-md hover:bg-gray-100 inline-flex items-center justify-center text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
        <span>{session.sessionRef}</span>
        <span className="text-gray-300">·</span>
        <span>anchored {session.anchoredAt}</span>
        <span className="text-gray-300">·</span>
        <span>RBAC scope · {session.scopeHash}</span>
      </div>
    </section>
  );
}

/* 3-segment phase progress bar */
function PhaseProgress({ subStageId }) {
  const currentPhase = getPhase(subStageId);
  return (
    <div>
      <div className="grid grid-cols-3 gap-1">
        {LIFECYCLE_PHASES.map((phase) => {
          const isDone = phase.id < currentPhase.id;
          const isCurrent = phase.id === currentPhase.id;
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

/* ─── TabBar ────────────────────────────────────────────────────────── */

function TabBar({ session, activeTab }) {
  const slug = session?.urlSlug;
  const base = slug ? `/session/${slug}` : "#";
  return (
    <div className="bg-white border-b border-gray-200 px-6 sticky top-[3.25rem] z-10">
      <div className="flex items-center gap-1">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          const href = tab.id === "overview" ? base : `${base}?tab=${tab.id}`;
          return (
            <Link
              key={tab.id}
              href={href}
              className={`h-10 px-3 text-sm font-medium border-b-2 transition-colors focus:outline-none inline-flex items-center ${
                isActive
                  ? "border-violet-600 text-violet-700"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab.label}
              {tab.id === "audit"  && <span className="ml-1 text-[10px] text-gray-400" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>14</span>}
              {tab.id === "review" && <span className="ml-1 text-[10px] px-1 py-0.5 rounded-sm bg-violet-50 border border-violet-200 text-violet-700 font-semibold" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>UC-HO-04</span>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Tab content · Overview (varies by phase) ──────────────────────── */

function OverviewTab({ session }) {
  if (session.subStageId === 2) return <OverviewSeedingActive session={session} />;
  if (session.subStageId === 6) return <OverviewTranscriptReview session={session} />;
  return null;
}

function OverviewSeedingActive({ session }) {
  return (
    <div className="space-y-5">
      <SectionLabel>What's happening now</SectionLabel>
      <article className="rounded-lg border border-violet-200 bg-violet-50/40 p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-md bg-white border border-violet-200 flex items-center justify-center shrink-0">
            <Loader2 className="w-4 h-4 text-violet-600 animate-spin" strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900">Context seeding in progress</h3>
            <p className="text-[12px] text-gray-700 mt-0.5 leading-relaxed">
              Scanning {session.offboarder}'s accessible work across approved shared workspaces. About 4 minutes remaining. You can leave this page — seeding continues in the background.
            </p>
          </div>
          <span className="text-[11px] text-gray-500 shrink-0" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
            4m 12s elapsed
          </span>
        </div>

        <ul className="space-y-1 text-[11px] text-gray-600">
          <SubStep done>Authorization scope established · 2.1s</SubStep>
          <SubStep done>Decomposed seeding job · 3 sources · 0.8s</SubStep>
          <SubStep done>Extracted Jira metadata · 47 tickets · 1m 24s</SubStep>
          <SubStep active>Extracting GitHub · 18 of 23 shared repos</SubStep>
          <SubStep>Google Drive · titles and edit recency only</SubStep>
          <SubStep>Sensitivity classification gate</SubStep>
          <SubStep>Knowledge gaps inference</SubStep>
          <SubStep>Preliminary knowledge map build</SubStep>
        </ul>
      </article>

      <div>
        <SectionLabel>Sources being scanned</SectionLabel>
        <div className="space-y-2 mt-2">
          <SourceRow icon={GitBranch} name="Jira"           detail="47 tickets · 6 months · comments included" status="done" />
          <SourceRow icon={Github}    name="GitHub"         detail="23 shared repos · PR descriptions, commit messages, wiki pages" status="active" subDetail="18 of 23 · 78%" />
          <SourceRow icon={Folder}    name="Google Drive"   detail="412 files · titles and edit recency only · file content is not read until interview" status="pending" />
        </div>
        <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">
          Per the data-ingestion governance rule, automated collection is restricted to shared workspaces only. Personal directories and individual messaging are excluded; manual upload of specific files is supported via the interview workflow.
        </p>
      </div>

      <div>
        <SectionLabel>Recent activity</SectionLabel>
        <div className="rounded-lg border border-gray-200 bg-white mt-2 overflow-hidden">
          <ActivityEntry ts="14:36:24" actor="Worker Agent"        text="Jira extraction complete · 47 tickets · 0 redacted" />
          <ActivityEntry ts="14:35:00" actor="Planner Agent"       text="Decomposed seeding plan · 3 parallel source jobs" />
          <ActivityEntry ts="14:32:18" actor="Auth Service"        text="RBAC scope hash computed · b7e29f...4ac1" />
          <ActivityEntry ts="14:32:08" actor="Hà Vy"               text="Started session · accepted defaults" last />
        </div>
      </div>
    </div>
  );
}

function OverviewTranscriptReview({ session }) {
  return (
    <div className="space-y-5">
      <article className="rounded-lg border border-emerald-200 bg-emerald-50/30 p-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-md bg-white border border-emerald-200 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-emerald-700" strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900">Transcript signed and ready for your review</h3>
            <p className="text-[12px] text-gray-700 mt-0.5 leading-relaxed">
              {session.offboarder} reviewed and signed the captured transcript 38 minutes ago. 7 sections · 23 verified facts · 2 facts flagged for clarification. Your review unblocks the KG commit.
            </p>
          </div>
          <span className="text-[10px] text-gray-500 shrink-0" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
            signed 38m ago
          </span>
        </div>
      </article>

      <div>
        <SectionLabel>Captured content summary</SectionLabel>
        <div className="grid grid-cols-4 gap-2 mt-2">
          <SmallStat icon={MessageSquare} label="Sections"        value="7" />
          <SmallStat icon={Network}       label="Verified facts"  value="23" />
          <SmallStat icon={AlertTriangle} label="Flagged"         value="2" tone="warning" />
          <SmallStat icon={Lock}          label="Redacted"        value="1" />
        </div>
      </div>

      <div>
        <SectionLabel>Sections to review</SectionLabel>
        <div className="space-y-2 mt-2">
          <SectionRow title="Sales pipeline · Q3 outlook"         status="verified" wordCount="1,247 words · 4 facts" />
          <SectionRow title="Vendor XYZ renewal · penalty clause" status="flagged"  wordCount="864 words · 3 facts · 1 flagged" detail="Phương Anh marked one paragraph for clarification" />
          <SectionRow title="Account TXM · escalation paths"      status="verified" wordCount="932 words · 5 facts" />
          <SectionRow title="Forecast methodology"                status="verified" wordCount="513 words · 3 facts" />
          <SectionRow title="Customer success · churn signals"    status="verified" wordCount="678 words · 4 facts" />
          <SectionRow title="Internal team dynamics"              status="redacted" wordCount="Redacted by sensitivity classification" muted />
          <SectionRow title="Reflection · what worked"            status="flagged"  wordCount="442 words · 1 fact · 1 flagged" detail="Phương Anh asked you to verify one specific claim" />
        </div>
      </div>
    </div>
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
  const statusCfg = {
    done:    { cls: "border-emerald-200 bg-emerald-50/20", badge: "bg-emerald-50 border-emerald-200 text-emerald-700", label: "Complete" },
    active:  { cls: "border-violet-200 bg-violet-50/20",   badge: "bg-violet-50 border-violet-200 text-violet-700",    label: "In progress" },
    pending: { cls: "border-gray-200 bg-white",            badge: "bg-gray-50 border-gray-200 text-gray-500",         label: "Pending" },
  }[status];
  return (
    <article className={`rounded-md border px-3 py-2.5 flex items-center gap-3 ${statusCfg.cls}`}>
      <Icon className="w-3.5 h-3.5 text-gray-500 shrink-0" strokeWidth={1.75} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-medium text-gray-900">{name}</span>
          <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold border ${statusCfg.badge}`}>{statusCfg.label}</span>
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

function SectionRow({ title, status, wordCount, detail, muted }) {
  const cfg = {
    verified: { icon: CheckCircle2, iconCls: "text-emerald-600", badge: "bg-emerald-50 border-emerald-200 text-emerald-700", label: "Verified" },
    flagged:  { icon: AlertTriangle, iconCls: "text-yellow-600", badge: "bg-yellow-50 border-yellow-200 text-yellow-800",   label: "Flagged" },
    redacted: { icon: Lock,         iconCls: "text-gray-400",   badge: "bg-gray-50 border-gray-200 text-gray-500",         label: "Redacted" },
  }[status];
  const Icon = cfg.icon;
  return (
    <article className={`rounded-md border border-gray-200 bg-white px-3 py-2.5 flex items-start gap-3 hover:border-gray-300 transition-colors cursor-pointer ${muted ? "opacity-60" : ""}`}>
      <Icon className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${cfg.iconCls}`} strokeWidth={1.75} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className="text-sm font-medium text-gray-900">{title}</span>
          <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold border ${cfg.badge}`}>{cfg.label}</span>
        </div>
        <div className="text-[11px] text-gray-500 leading-relaxed">{wordCount}</div>
        {detail && <div className="text-[11px] text-yellow-800 mt-1 leading-relaxed">{detail}</div>}
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0 mt-0.5" />
    </article>
  );
}

function SmallStat({ icon: Icon, label, value, tone }) {
  const cfg = {
    default: { border: "border-gray-200",   bg: "bg-gray-50/40",   iconCls: "text-gray-500",  valueCls: "text-gray-900" },
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

/* ─── Tab content · Stages — now 3 phase blocks instead of 8 rows ───── */

function StagesTab({ session }) {
  return (
    <div>
      <SectionLabel>Lifecycle · 3 phases</SectionLabel>
      <p className="text-[11px] text-gray-500 mt-1 mb-4 leading-relaxed">
        Each phase groups the steps that move together. Click a completed phase to see the detail of what happened. The active phase auto-expands with sub-stage detail.
      </p>

      <div className="space-y-3">
        {LIFECYCLE_PHASES.map((phase) => {
          const isDone    = phase.subStages.every((s) => s.id < session.subStageId);
          const isCurrent = phase.subStages.some((s) => s.id === session.subStageId);
          const status    = isDone ? "done" : isCurrent ? "active" : "pending";
          return (
            <PhaseBlock
              key={phase.id}
              phase={phase}
              session={session}
              status={status}
            />
          );
        })}
      </div>
    </div>
  );
}

function PhaseBlock({ phase, session, status }) {
  const cfg = {
    done:    { border: "border-emerald-200", bg: "bg-emerald-50/20", iconCls: "text-emerald-600 bg-emerald-50 border-emerald-200", pillCls: "bg-emerald-50 border-emerald-200 text-emerald-700", pillLabel: "Complete" },
    active:  { border: "border-violet-200",  bg: "bg-violet-50/30",  iconCls: "text-violet-600 bg-violet-50 border-violet-200",    pillCls: "bg-violet-50 border-violet-200 text-violet-700",    pillLabel: "In progress" },
    pending: { border: "border-gray-200",    bg: "bg-white",         iconCls: "text-gray-300 bg-white border-gray-200",            pillCls: "bg-gray-50 border-gray-200 text-gray-500",          pillLabel: "Pending" },
  }[status];

  const Icon = status === "done" ? CheckCircle2 : status === "active" ? Loader2 : Clock;
  const isExpanded = status === "active";

  return (
    <article className={`rounded-lg border ${cfg.border} ${cfg.bg}`}>
      <div className="px-4 py-3 flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${cfg.iconCls}`}>
          <Icon className={`w-3.5 h-3.5 ${status === "active" ? "animate-spin" : ""}`} strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h3 className="text-sm font-semibold text-gray-900">Phase {phase.id} · {phase.label}</h3>
            <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold border ${cfg.pillCls}`}>{cfg.pillLabel}</span>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed">{phase.description}</p>
          <p className="text-[10px] text-gray-500 mt-0.5"><span className="uppercase tracking-wider font-medium">Owned by</span> · {phase.actor}</p>
        </div>
      </div>

      <div className="border-t border-gray-100 px-4 py-3 space-y-1.5">
        {phase.subStages.map((sub) => {
          const isCurrentSub = sub.id === session.subStageId;
          const isDoneSub    = sub.id < session.subStageId;
          return (
            <div key={sub.id} className="flex items-start gap-2 text-[11px]">
              <span className="shrink-0 mt-0.5">
                {isDoneSub    && <CheckCircle2 className="w-3 h-3 text-emerald-600" strokeWidth={2.5} />}
                {isCurrentSub && <Loader2      className="w-3 h-3 text-violet-600 animate-spin" strokeWidth={2} />}
                {!isDoneSub && !isCurrentSub && <Clock className="w-3 h-3 text-gray-300" strokeWidth={1.75} />}
              </span>
              <span className={`leading-relaxed ${isDoneSub ? "text-gray-700" : isCurrentSub ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                {sub.label}
                <span className="text-gray-500 font-normal"> · {sub.note}</span>
              </span>
            </div>
          );
        })}

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-violet-100">
            <div className="text-[10px] uppercase tracking-[0.2em] text-violet-700 font-semibold mb-2">Live detail · context seeding</div>
            <ul className="space-y-1 text-[11px]">
              <SubStep done>Authorization scope established · 2.1s</SubStep>
              <SubStep done>Decomposed seeding job · 3 sources · 0.8s</SubStep>
              <SubStep done>Extracted Jira metadata · 47 tickets · 1m 24s</SubStep>
              <SubStep active>Extracting GitHub · 18 of 23 shared repos</SubStep>
              <SubStep>Google Drive · titles and edit recency only</SubStep>
              <SubStep>Sensitivity classification gate</SubStep>
              <SubStep>Knowledge gaps inference</SubStep>
              <SubStep>Preliminary knowledge map build</SubStep>
            </ul>
            <div className="mt-2 pt-2 border-t border-violet-100 text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
              4m 12s elapsed · ~4m remaining
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

/* ─── Action sidebar (right) ────────────────────────────────────────── */

function ActionSidebar({ session }) {
  const isSeeding = session.subStageId === 2;
  const isReview  = session.subStageId === 6;

  return (
    <aside className="space-y-4">
      <div>
        <SectionLabel>Next action</SectionLabel>
        {isSeeding && (
          <article className="rounded-lg border border-gray-200 bg-white p-3 mt-2">
            <p className="text-[12px] text-gray-700 leading-relaxed mb-3">
              System is actively scanning. No action needed from you right now. You'll be notified when the knowledge map is ready.
            </p>
            <button className="w-full h-8 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium inline-flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
              <Eye className="w-3 h-3" />
              Watch live progress
            </button>
          </article>
        )}
        {isReview && (
          <article className="rounded-lg border border-emerald-200 bg-emerald-50/30 p-3 mt-2">
            <p className="text-[12px] text-gray-700 leading-relaxed mb-3">
              <strong className="text-gray-900">2 sections need your decision</strong> before the content can commit to the knowledge graph.
            </p>
            <button className="w-full h-9 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30 mb-1.5">
              Review transcript
              <ArrowRight className="w-3 h-3" />
            </button>
            <button className="w-full h-8 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
              <RefreshCw className="w-3 h-3" />
              Request re-interview
            </button>
          </article>
        )}
      </div>

      <div>
        <SectionLabel>Quick links</SectionLabel>
        <div className="space-y-1 mt-2">
          <QuickLink icon={Network}       label="Knowledge map preview"   disabled={isSeeding} />
          <QuickLink icon={MessageSquare} label="Interview transcript"    disabled={isSeeding} />
          <QuickLink icon={Tag}           label="Priority prompts"        count={3} />
          <QuickLink icon={FileText}      label="Audit log"               count={14} />
        </div>
      </div>

      <div>
        <SectionLabel>Session info</SectionLabel>
        <div className="rounded-md border border-gray-200 bg-white p-3 mt-2 space-y-2 text-[11px]">
          <InfoRow label="Successor"      value={session.successor} />
          <InfoRow label="Deadline"       value={session.deadline} mono />
          <InfoRow label="Anchored"       value={session.anchoredAt} mono />
          <InfoRow label="Scope hash"     value={session.scopeHash} mono />
        </div>
      </div>

      <button className="w-full h-8 rounded-md text-gray-500 hover:text-rose-700 hover:bg-rose-50 text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/20">
        <X className="w-3 h-3" />
        Cancel session
      </button>
    </aside>
  );
}

function QuickLink({ icon: Icon, label, count, disabled }) {
  return (
    <button
      disabled={disabled}
      className={`w-full px-2.5 py-2 rounded-md border text-left text-[12px] font-medium inline-flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${
        disabled
          ? "border-gray-200 bg-gray-50/40 text-gray-400 cursor-not-allowed"
          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300"
      }`}
    >
      <Icon className="w-3 h-3 shrink-0" strokeWidth={1.75} />
      <span className="flex-1">{label}</span>
      {count !== undefined && (
        <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{count}</span>
      )}
      {!disabled && <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />}
    </button>
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
  return (
    <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">{children}</h2>
  );
}

/* ─── Tab content · Data ─────────────────────────────────────────────── */

function DataTab({ session }) {
  return (
    <div className="space-y-5">
      <div>
        <SectionLabel>Data sources for this session</SectionLabel>
        <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
          Approved shared workspaces only. Personal directories, individual mailboxes, and private messaging are never scanned. Per the data-ingestion governance rule.
        </p>
      </div>

      <div className="space-y-2">
        <SourceRow icon={GitBranch} name="Jira"         detail="47 tickets · 6 months · comments included"                                             status="done"    subDetail="last sync 4m ago" />
        <SourceRow icon={Github}    name="GitHub"       detail="23 shared repos · PR descriptions, commit messages, wiki pages"                       status="active"  subDetail="18 of 23 · 78%" />
        <SourceRow icon={Folder}    name="Google Drive" detail="412 files · titles and edit recency only · content read only during interview"       status="pending" subDetail="queued" />
      </div>

      <div>
        <SectionLabel>Manual upload</SectionLabel>
        <article className="mt-2 rounded-lg border border-dashed border-gray-300 bg-gray-50/40 p-5 text-center">
          <UploadCloud className="w-5 h-5 text-gray-400 mx-auto mb-1.5" strokeWidth={1.75} />
          <p className="text-[13px] text-gray-700 font-medium">Drop files here or click to upload</p>
          <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
            Add files from personal folders or external systems that {session.offboarder} flags as important. Files inherit this session's access scope.
          </p>
        </article>
      </div>

      <div>
        <SectionLabel>Excluded by governance</SectionLabel>
        <ul className="mt-2 space-y-1 text-[12px] text-gray-600">
          <ExcludedRow icon={Lock} label="Personal mailbox" reason="Per data-ingestion governance · email is never scanned" />
          <ExcludedRow icon={Lock} label="Direct messages"  reason="Per data-ingestion governance · private messaging is never scanned" />
          <ExcludedRow icon={Lock} label="Personal Drive"   reason="Per data-ingestion governance · personal folders are never scanned" />
        </ul>
      </div>
    </div>
  );
}

function ExcludedRow({ icon: Icon, label, reason }) {
  return (
    <li className="flex items-start gap-2.5 px-3 py-2 rounded-md bg-gray-50 border border-gray-200">
      <Icon className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" strokeWidth={1.75} />
      <div className="flex-1 min-w-0">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-300 mx-1.5">·</span>
        <span className="text-gray-500">{reason}</span>
      </div>
    </li>
  );
}

/* ─── Tab content · Audit log ────────────────────────────────────────── */

const AUDIT_ML = [
  { ts: "2026-05-29 · 14:32:08Z", actor: "Hà Vy",              action: "Session created",                  detail: "Quick-initiate · 3 sources selected · review deadline 2026-06-08 17:00", severity: "low" },
  { ts: "2026-05-29 · 14:32:15Z", actor: "System",             action: "Connector scope validated",         detail: "Jira · GitHub · Google Drive · all within OAuth scope",                  severity: "low" },
  { ts: "2026-05-29 · 14:32:18Z", actor: "System",             action: "Seeding job decomposed",            detail: "3 source tasks queued · estimated 7 minutes",                            severity: "low" },
  { ts: "2026-05-29 · 14:33:42Z", actor: "System",             action: "Jira extraction completed",         detail: "47 tickets · 6 months · 2,184 comments",                                 severity: "low" },
  { ts: "2026-05-29 · 14:34:01Z", actor: "System",             action: "GitHub extraction started",         detail: "18 of 23 shared repos in progress",                                      severity: "low" },
  { ts: "2026-05-29 · 14:34:15Z", actor: "Hà Vy",              action: "Added priority prompt",             detail: "Focus on payment-service migration · weighted +0.3 for interview",       severity: "low" },
];

const AUDIT_PA = [
  { ts: "2026-05-27 · 09:14:22Z", actor: "Hà Vy",              action: "Session created",                  detail: "Quick-initiate · Salesforce · SharePoint · Calendar",                    severity: "low" },
  { ts: "2026-05-27 · 09:18:04Z", actor: "System",             action: "Seeding completed",                 detail: "286 items pulled · 4 knowledge gaps inferred",                           severity: "low" },
  { ts: "2026-05-28 · 14:02:18Z", actor: "Phương Anh Nguyễn",  action: "Voice interview started",           detail: "Scheduled session begun · estimated 45 minutes",                         severity: "low" },
  { ts: "2026-05-28 · 14:47:53Z", actor: "Phương Anh Nguyễn",  action: "Voice interview signed",            detail: "Transcript reviewed and signed off · awaiting Manager review",           severity: "medium" },
  { ts: "2026-05-28 · 16:31:09Z", actor: "System",             action: "Sensitivity classification",        detail: "12 items flagged for sensitive-content review",                          severity: "medium" },
  { ts: "2026-05-29 · 08:04:11Z", actor: "System",             action: "Awaiting Manager review",           detail: "Transcript ready · 4 days until review deadline",                        severity: "medium" },
];

function AuditTab({ session }) {
  const rows = session.urlSlug === "phuong-anh" ? AUDIT_PA : AUDIT_ML;
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-2">
        <div>
          <SectionLabel>Audit log · per-item lineage</SectionLabel>
          <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
            Immutable record of every action on this session. Per QA-INT-01 §2.3.
          </p>
        </div>
        <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
          {rows.length} events
        </span>
      </div>

      <ul className="space-y-1.5">
        {rows.slice().reverse().map((r, i) => (
          <AuditRow key={i} {...r} />
        ))}
      </ul>

      <button
        type="button"
        className="w-full h-9 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-[12px] text-gray-600 inline-flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20"
      >
        <History className="w-3.5 h-3.5" strokeWidth={1.75} />
        Show all events
      </button>
    </div>
  );
}

function AuditRow({ ts, actor, action, detail, severity }) {
  const leftCls =
    severity === "high"   ? "border-l-rose-500"   :
    severity === "medium" ? "border-l-yellow-500" :
                            "border-l-gray-200";
  return (
    <li className={`rounded-md border border-gray-200 bg-white px-3 py-2 border-l-2 ${leftCls}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] text-gray-900 font-medium leading-snug">{action}</p>
          <p className="text-[12px] text-gray-600 mt-0.5 leading-snug">{detail}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[11px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{ts}</p>
          <p className="text-[10px] text-gray-500 mt-0.5">{actor}</p>
        </div>
      </div>
    </li>
  );
}

/* ─── Tab content · Manager review (CL-103) ──────────────────────────
   Renders UC-HO-04 inside the session for Minh Lê; shows a POC-scope
   placeholder for Phương Anh.
   ──────────────────────────────────────────────────────────────────── */

function ReviewTab({ session }) {
  if (session.urlSlug === "minh-le") {
    return <UCHO04ManagerReview embedded state="s1" />;
  }

  return (
    <div className="p-6">
      <article className="rounded-lg border border-yellow-200 bg-yellow-50/30 p-6 max-w-2xl mx-auto">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-md bg-white border border-yellow-200 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 text-yellow-700" strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Manager review is wired for Minh Lê's session in this POC</h3>
            <p className="text-[12px] text-gray-700 leading-relaxed mb-3">
              The UC-HO-04 review surface (sourced-vs-AI diff, inline edit, pre-commit flag fix, SHA-256 sign-off) is currently scoped to Minh Lê's Engineering session as the canonical demo persona. {session.offboarder}'s Sales session uses the same data contract; when reviewer-side content for this session lands in Phase 2, this tab will render the same UC-HO-04 surface keyed to her bundle.
            </p>
            <div className="flex items-center gap-2">
              <Link
                href="/session/minh-le?tab=review"
                className="h-8 px-3 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-[12px] font-semibold inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              >
                Open Minh Lê's Manager review
                <ArrowRight className="w-3 h-3" />
              </Link>
              <Link
                href={`/session/${session.urlSlug}`}
                className="h-8 px-3 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-[12px] font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              >
                Back to Overview
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

/* ─── Tab content · Settings ─────────────────────────────────────────── */

function SettingsTab({ session }) {
  return (
    <div className="space-y-6">
      <div>
        <SectionLabel>Session details</SectionLabel>
        <article className="mt-2 rounded-lg border border-gray-200 bg-white divide-y divide-gray-200">
          <SettingsRow label="Session ref"      value={session.sessionRef} mono />
          <SettingsRow label="Anchored at"      value={session.anchoredAt} mono />
          <SettingsRow label="Scope hash"       value={session.scopeHash}  mono />
          <SettingsRow label="Offboarder"       value={`${session.offboarder} · ${session.role}`} />
          <SettingsRow label="Successor"        value={session.successor} />
        </article>
      </div>

      <div>
        <SectionLabel>Review deadline</SectionLabel>
        <article className="mt-2 rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] text-gray-900 font-medium">{session.deadline}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{session.daysLeft} days remaining</p>
            </div>
            <button
              type="button"
              className="h-8 px-3 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-[12px] text-gray-700 inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            >
              <PauseCircle className="w-3.5 h-3.5" strokeWidth={1.75} />
              Request extension
            </button>
          </div>
        </article>
      </div>

      <div>
        <SectionLabel>Notifications</SectionLabel>
        <article className="mt-2 rounded-lg border border-gray-200 bg-white divide-y divide-gray-200">
          <SettingsToggle label="Notify me on phase transitions" enabled />
          <SettingsToggle label="Notify me when sensitivity-flagged items appear" enabled />
          <SettingsToggle label="Daily summary email" />
        </article>
      </div>

      <div>
        <h2 className="text-[10px] uppercase tracking-[0.2em] text-rose-600 font-medium">Danger zone</h2>
        <article className="mt-2 rounded-lg border-2 border-rose-200 bg-rose-50/40 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[13px] text-gray-900 font-medium">Cancel session</p>
              <p className="text-[12px] text-gray-700 mt-0.5 leading-relaxed">
                Discards seeded context. {session.offboarder} will not be interviewed. This is permanent.
              </p>
            </div>
            <button
              type="button"
              className="h-8 px-3 rounded-md border border-rose-300 bg-white hover:bg-rose-50 text-[12px] text-rose-700 inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/20 shrink-0"
            >
              <X className="w-3.5 h-3.5" strokeWidth={1.75} />
              Cancel session
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}

function SettingsRow({ label, value, mono }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 text-[12px]">
      <span className="text-gray-500">{label}</span>
      <span
        className="text-gray-900 font-medium text-right truncate ml-3"
        style={mono ? { fontFamily: "ui-monospace, Menlo, monospace" } : undefined}
      >
        {value}
      </span>
    </div>
  );
}

function SettingsToggle({ label, enabled }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 text-[12px]">
      <span className="text-gray-700">{label}</span>
      <span
        className={`inline-flex h-4 w-7 items-center rounded-full transition-colors ${
          enabled ? "bg-violet-600" : "bg-gray-200"
        }`}
        title={enabled ? "On" : "Off"}
      >
        <span
          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
            enabled ? "translate-x-3.5" : "translate-x-0.5"
          }`}
        />
      </span>
    </div>
  );
}
