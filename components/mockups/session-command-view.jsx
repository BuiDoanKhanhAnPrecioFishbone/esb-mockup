"use client";

import React, { useState } from "react";
import {
  ChevronLeft, ChevronRight, ChevronDown, X, Check,
  Settings, FileText, MessageSquare, Network, Database, Eye,
  AlertTriangle, AlertOctagon, Clock, CheckCircle2, Loader2,
  Calendar, ArrowRight, ArrowUpRight, ExternalLink, MoreHorizontal,
  Users, Tag, GitBranch, Folder, Mail, Sparkles, Hash, Lock,
  PlayCircle, PauseCircle, RefreshCw, Inbox, ShieldCheck
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   Session Command View — dedicated full-screen page at /session/[id]

   Design response to feedback that a 480px side drawer is too cramped
   for the data volume involved in managing a handover session
   (timeline, extraction progress, audit logs, etc.).

   Layout:
     · TopBar with breadcrumb back to dashboard
     · Hero with persona + 8-segment progress bar + current stage info
     · Tab navigation · Overview · Stages · Data · Audit log · Settings
     · Two-column main: content (left) + action sidebar (right ~280px)

   Three screens demonstrate state diversity:
     1. Minh Lê · Overview tab · mid-seeding (stage 3 of 8)
     2. Minh Lê · Stages tab · full vertical timeline of all 8 stages
     3. Phương Anh Nguyễn · Overview tab · awaiting transcript review
        (stage 6 of 8 · the case that needs the manager's action)

   Honors locked design rules:
     · CL-054 violet primary · CL-055 32px buttons · CL-059 focus rings
     · CL-020 audit anchor referenced ambiently
     · CL-022 "AI asked" eyebrow for Manager Priority prompts
     · CL-063 multi-persona — this view is per-session, not per-manager
   ═══════════════════════════════════════════════════════════════════ */

const FLOW = [
  { id: "ml-overview", label: "Minh Lê · Overview",   trigger: "Session in stage 3 of 8 · context seeding · system actively running." },
  { id: "ml-stages",   label: "Minh Lê · Stages",     trigger: "Stages tab · full 8-stage vertical timeline replaces the drawer." },
  { id: "pa-overview", label: "Phương Anh · Overview", trigger: "Different session at stage 6 · awaiting manager review · action needed." },
];

const LIFECYCLE_STAGES = [
  { id: 1, key: "setup",     label: "Setup pending",          actor: "Manager",    description: "Waiting for the manager to initiate the session." },
  { id: 2, key: "config",    label: "Configuration",          actor: "Manager",    description: "Manager confirms details and data sources." },
  { id: 3, key: "seeding",   label: "Context seeding",        actor: "System",     description: "System scans Offboarder's accessible work." },
  { id: 4, key: "ready",     label: "Ready for interview",    actor: "Offboarder", description: "Knowledge map produced. Interview can be scheduled." },
  { id: 5, key: "interview", label: "Interview in progress",  actor: "Offboarder", description: "AI-guided voice interview with the Offboarder." },
  { id: 6, key: "review",    label: "Transcript review",      actor: "Manager",    description: "Manager reviews and approves the captured content." },
  { id: 7, key: "commit",    label: "Committing to KG",       actor: "System",     description: "Verified content propagates to the knowledge graph." },
  { id: 8, key: "playbook",  label: "Playbook delivered",     actor: "Successor",  description: "Personalized onboarding playbook ready for the successor." },
];

const SESSIONS = {
  ml: {
    id: "sess-minhle",
    sessionRef: "SESSION-2026-05-29-7a3c",
    offboarder: "Minh Lê",
    role: "Senior Backend Engineer",
    dept: "Engineering",
    initials: "ML",
    stageId: 3,
    progressPct: 32,
    daysLeft: 6,
    successor: "Trần Hữu Nam",
    deadline: "June 8, 2026 · 17:00",
    anchoredAt: "2026-05-29 · 14:32:08Z",
    scopeHash: "b7e29f...4ac1",
  },
  pa: {
    id: "sess-phuonganh",
    sessionRef: "SESSION-2026-05-27-3f2b",
    offboarder: "Phương Anh Nguyễn",
    role: "Senior Account Executive",
    dept: "Sales",
    initials: "PA",
    stageId: 6,
    progressPct: 72,
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
  { id: "settings",  label: "Settings" },
];

export default function SessionCommandView() {
  const [stepIdx, setStepIdx] = useState(0);
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
   The command view — shared layout for all 3 screens
   ═══════════════════════════════════════════════════════════════════ */

function CommandView({ session, activeTab }) {
  return (
    <div className="max-w-7xl mx-auto">
      <Hero session={session} />
      <TabBar activeTab={activeTab} />
      <div className="grid grid-cols-[1fr_280px] gap-5 p-6">
        <div className="min-w-0">
          {activeTab === "overview" && <OverviewTab session={session} />}
          {activeTab === "stages"   && <StagesTab session={session} />}
        </div>
        <ActionSidebar session={session} />
      </div>
    </div>
  );
}

/* ─── Hero · persona identity + 8-segment progress + current stage ──── */

function Hero({ session }) {
  const stage = LIFECYCLE_STAGES.find((s) => s.id === session.stageId);
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

          <SegmentedProgress stageId={session.stageId} progressPct={session.progressPct} />

          <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-500">
            <span className="font-semibold text-gray-900">{stage.label}</span>
            <span className="text-gray-300">·</span>
            <span>{stage.description}</span>
            <span className="text-gray-300">·</span>
            <span>Next actor · <span className="text-gray-700 font-medium">{stage.actor}</span></span>
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

function SegmentedProgress({ stageId, progressPct }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1 text-[10px]">
        <span className="text-gray-700 font-medium" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
          Stage {stageId} of 8 · {progressPct}%
        </span>
        <span className="text-gray-500">{LIFECYCLE_STAGES[stageId - 1].label}</span>
      </div>
      <div className="flex items-center gap-0.5">
        {LIFECYCLE_STAGES.map((stage) => {
          const isDone = stage.id < stageId;
          const isCurrent = stage.id === stageId;
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

/* ─── TabBar ────────────────────────────────────────────────────────── */

function TabBar({ activeTab }) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 sticky top-[3.25rem] z-10">
      <div className="flex items-center gap-1">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              className={`h-10 px-3 text-sm font-medium border-b-2 transition-colors focus:outline-none ${
                isActive
                  ? "border-violet-600 text-violet-700"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab.label}
              {tab.id === "audit" && <span className="ml-1 text-[10px] text-gray-400" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>14</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Tab content · Overview (varies by stage) ──────────────────────── */

function OverviewTab({ session }) {
  if (session.stageId === 3) return <OverviewSeedingActive session={session} />;
  if (session.stageId === 6) return <OverviewTranscriptReview session={session} />;
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
              Scanning {session.offboarder}'s accessible work across approved sources. About 4 minutes remaining. You can leave this page — seeding continues in the background.
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
          <SubStep active>Extracting Google Drive · 318 of 412 files</SubStep>
          <SubStep>Email metadata · subject lines and participants only</SubStep>
          <SubStep>Sensitivity classification gate</SubStep>
          <SubStep>Knowledge gaps inference</SubStep>
          <SubStep>Preliminary knowledge map build</SubStep>
        </ul>
      </article>

      <div>
        <SectionLabel>Sources being scanned</SectionLabel>
        <div className="space-y-2 mt-2">
          <SourceRow icon={GitBranch} name="Jira"          detail="47 tickets · 6 months · comments included" status="done" />
          <SourceRow icon={Folder}    name="Google Drive"  detail="412 files · titles and edit recency only" status="active" subDetail="318 of 412 · 77%" />
          <SourceRow icon={Mail}      name="Email metadata" detail="Subject lines and participants only · email content is never read or stored" status="pending" />
        </div>
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

/* ─── Tab content · Stages — full vertical timeline ─────────────────── */

function StagesTab({ session }) {
  return (
    <div>
      <SectionLabel>Lifecycle timeline · all 8 stages</SectionLabel>
      <p className="text-[11px] text-gray-500 mt-1 mb-4 leading-relaxed">
        Each stage names the actor responsible for advancing the session. Click a completed stage to see the detail of what happened. The active stage is expanded inline.
      </p>

      <div className="relative">
        {LIFECYCLE_STAGES.map((stage, i) => (
          <StageBlock
            key={stage.id}
            stage={stage}
            session={session}
            status={
              stage.id < session.stageId ? "done"
              : stage.id === session.stageId ? "active"
              : "pending"
            }
            isLast={i === LIFECYCLE_STAGES.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function StageBlock({ stage, session, status, isLast }) {
  const cfg = {
    done:    { icon: CheckCircle2, iconCls: "text-emerald-600 bg-emerald-50 border-emerald-200", labelCls: "text-gray-900",        lineCls: "bg-emerald-200" },
    active:  { icon: Loader2,      iconCls: "text-violet-600 bg-violet-50 border-violet-200 animate-spin", labelCls: "text-gray-900 font-semibold", lineCls: "bg-gray-200" },
    pending: { icon: Clock,        iconCls: "text-gray-300 bg-white border-gray-200",           labelCls: "text-gray-400",        lineCls: "bg-gray-200" },
  }[status];
  const Icon = cfg.icon;
  const showDetail = status === "active";

  return (
    <div className="flex items-start gap-4 relative pb-5 last:pb-0">
      {!isLast && <span className={`absolute left-[15px] top-9 bottom-0 w-px ${cfg.lineCls}`} />}
      <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 z-10 ${cfg.iconCls}`}>
        <Icon className="w-3.5 h-3.5" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm ${cfg.labelCls}`}>{stage.label}</span>
          <span className="text-[10px] text-gray-500">·</span>
          <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">{stage.actor}</span>
          {status === "done"  && <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>· complete</span>}
          {status === "active" && <span className="text-[10px] text-violet-700 font-medium">· in progress</span>}
        </div>
        <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{stage.description}</p>

        {showDetail && (
          <div className="mt-3 rounded-md border border-violet-200 bg-violet-50/30 p-3">
            <ul className="space-y-1 text-[11px]">
              <SubStep done>Authorization scope established · 2.1s</SubStep>
              <SubStep done>Decomposed seeding job · 3 sources · 0.8s</SubStep>
              <SubStep done>Extracted Jira metadata · 47 tickets · 1m 24s</SubStep>
              <SubStep active>Extracting Google Drive · 318 of 412 files</SubStep>
              <SubStep>Email metadata · subject lines and participants only</SubStep>
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
    </div>
  );
}

/* ─── Action sidebar (right) ────────────────────────────────────────── */

function ActionSidebar({ session }) {
  const isSeeding = session.stageId === 3;
  const isReview  = session.stageId === 6;

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
          <QuickLink icon={Network}     label="Knowledge map preview"   disabled={isSeeding} />
          <QuickLink icon={MessageSquare} label="Interview transcript"   disabled={isSeeding} />
          <QuickLink icon={Tag}         label="Priority prompts"        count={3} />
          <QuickLink icon={FileText}    label="Audit log"               count={14} />
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
      <span className={`text-gray-900 font-medium text-right ${mono ? "" : ""}`} style={mono ? { fontFamily: "ui-monospace, Menlo, monospace" } : undefined}>{value}</span>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">{children}</h2>
  );
}
