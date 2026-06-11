"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, Plus, ArrowRight,
  AlertTriangle, CheckCircle2, Clock,
  Calendar, Database, Network, Sparkles,
  Bell, Layers
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   Dashboard — Session Creator (HR / Manager) view

   CL-122 · Action-first layout with 4 action cards at top, session
   cards below. Departure banner (State C) for HRIS departures.
   Phase-segmented progress bars. Task lines with nav targets.
   CL-121 · Create session → /session/new.
   CL-120 · Phase-segmented progress. No single percentage.
   CL-118 · 2 active sessions. CL-117 · No time-aggregated KPIs.
   CL-115 · No role qualifier. CL-114 · No successor.
   ═══════════════════════════════════════════════════════════════════ */

const FLOW = [
  { id: "departures", label: "Departures pending", trigger: "HRIS flagged 2 departures — no sessions created yet." },
  { id: "active",     label: "Active sessions",    trigger: "2 sessions in different lifecycle phases." },
  { id: "completed",  label: "Session completed",  trigger: "Minh Lê's session committed to KG." },
];

const PHASES = [
  { id: 1, key: "prepare", label: "Prepare", subs: [
    { id: 1, label: "Setup confirmed" }, { id: 2, label: "Context seeding" }, { id: 3, label: "Knowledge map ready" },
  ] },
  { id: 2, key: "capture", label: "Capture", subs: [
    { id: 4, label: "Questions assigned" }, { id: 5, label: "Answering queue" }, { id: 6, label: "Answers reviewed" },
  ] },
  { id: 3, key: "deliver", label: "Deliver", subs: [
    { id: 7, label: "Committed to KG" }, { id: 8, label: "KG access ready" },
  ] },
];

function getPhase(sid) { return PHASES.find(p => p.subs.some(s => s.id === sid)); }
function getSub(sid) { for (const p of PHASES) { const s = p.subs.find(x => x.id === sid); if (s) return s; } return null; }

const DEPARTURES = [
  { name: "Minh Lê", role: "Senior Backend Engineer", dept: "Engineering", lastDay: "July 4, 2026", daysLeft: 30, initials: "ML" },
  { name: "Thanh Tùng", role: "QA Lead", dept: "Engineering", lastDay: "July 8, 2026", daysLeft: 28, initials: "TT" },
];

const SESSIONS = [
  {
    id: "thanh-tung", name: "Thanh Tùng", role: "QA Lead",
    dept: "Engineering", initials: "TT", subStageId: 3, daysLeft: 28,
    blockedOnManager: true,
    tasks: [
      { text: "Crawl complete — needs your review", dot: "urgent", link: "/session/thanh-tung?tab=data" },
      { text: "No questions added yet", dot: "warn" },
    ],
  },
  {
    id: "minh-le", name: "Minh Lê", role: "Senior Backend Engineer",
    dept: "Engineering", initials: "ML", subStageId: 5, daysLeft: 22,
    blockedOnManager: false,
    tasks: [
      { text: "5 questions unanswered", dot: "urgent", link: "/session/minh-le?tab=data&filter=unanswered" },
      { text: "2 knowledge gaps open", dot: "warn" },
      { text: "3 of 5 modules covered", dot: "good" },
    ],
  },
];

const SESSION_DONE = {
  name: "Minh Lê", role: "Senior Backend Engineer", dept: "Engineering",
  initials: "ML", subStageId: 8, completedAt: "Just now",
  duration: "3 days, 4 hours", stats: { entries: 487, canonical: 12, gaps: 9 },
};

const ACTIVITY = [
  { ts: "2 min ago", actor: "System", text: "KG access ready · starter prompts seeded for Senior Backend Engineer role", severity: "low" },
  { ts: "7 min ago", actor: "System", text: "Minh Lê's session committed to knowledge graph · 487 entries", severity: "low" },
  { ts: "1 hour ago", actor: "System", text: "Thanh Tùng's crawl complete — 3 boards, 127 cards, 4 modules derived", severity: "medium" },
  { ts: "3 hours ago", actor: "Hà Vy", text: "Added 3 priority prompts to Minh Lê's session", severity: "low" },
];

export default function HaVyHandoverDashboard({ embedded = false, view = "active" } = {}) {
  const [stepIdx, setStepIdx] = useState(() => {
    const i = FLOW.findIndex(s => s.id === view);
    return i >= 0 ? i : 1;
  });
  const step = FLOW[stepIdx];
  if (embedded) return <StepRenderer id={step.id} />;
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      <TopBar />
      <FlowBar step={step} stepIdx={stepIdx} onJump={setStepIdx} />
      <main className="flex-1"><StepRenderer id={step.id} /></main>
      <FooterNav stepIdx={stepIdx} onChange={setStepIdx} />
    </div>
  );
}

function StepRenderer({ id }) {
  if (id === "departures") return <DeparturesPending />;
  if (id === "active") return <ActiveDashboard />;
  if (id === "completed") return <CompletedDashboard />;
  return null;
}

function DeparturesPending() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <DashboardHeader />
      <DepartureBanner departures={DEPARTURES} />
      <div className="text-center py-12">
        <div className="w-14 h-14 rounded-full bg-gray-100 inline-flex items-center justify-center mb-4">
          <Layers className="w-6 h-6 text-gray-400" strokeWidth={1.5} />
        </div>
        <h3 className="text-sm font-medium text-gray-700 mb-1">No active sessions</h3>
        <p className="text-xs text-gray-500 mb-4">Start a handover session for an upcoming departure above,<br />or create one manually.</p>
        <Link href="/session/new" className="h-8 px-4 rounded-md border border-dashed border-gray-300 text-xs text-gray-500 hover:text-gray-700 hover:border-gray-400 inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
          <Plus className="w-3 h-3" />Create session manually
        </Link>
      </div>
    </div>
  );
}

function ActiveDashboard() {
  const [hl, setHl] = useState(null);
  const sorted = [...SESSIONS].sort((a, b) => (b.blockedOnManager ? 1 : 0) - (a.blockedOnManager ? 1 : 0));
  const needsAction = SESSIONS.filter(s => s.blockedOnManager).length;
  const approaching = SESSIONS.filter(s => s.daysLeft <= 7).length;
  return (
    <div className="max-w-4xl mx-auto p-6">
      <DashboardHeader />
      <div className="grid grid-cols-4 gap-3 mb-6">
        <ActionCard label="Needs your action" value={needsAction} color="urgent" active={hl === "action"} onClick={() => setHl(h => h === "action" ? null : "action")} />
        <ActionCard label="Deadline ≤ 7 days" value={approaching} color={approaching > 0 ? "urgent" : "normal"} active={hl === "deadline"} onClick={() => setHl(h => h === "deadline" ? null : "deadline")} />
        <ActionCard label="Active sessions" value={SESSIONS.length} color="normal" active={hl === "all"} onClick={() => setHl(h => h === "all" ? null : "all")} />
        <ActionCard label="Open gaps" value={3} color="warn" active={hl === "gaps"} onClick={() => setHl(h => h === "gaps" ? null : "gaps")} />
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-3">
          <SectionLabel count={SESSIONS.length}>Active sessions</SectionLabel>
          {sorted.map(s => {
            const match = hl === "action" ? s.blockedOnManager : hl === "deadline" ? s.daysLeft <= 7 : hl === "all" || hl === "gaps";
            return <SessionCard key={s.id} session={s} highlighted={hl && match} dimmed={hl && !match} />;
          })}
          <Link href="/session/new" className="w-full h-10 rounded-md border border-dashed border-gray-300 text-sm text-gray-500 hover:text-gray-700 hover:border-gray-400 inline-flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
            <Plus className="w-3.5 h-3.5" />Create session
          </Link>
        </div>
        <div className="space-y-3">
          <SectionLabel>Recent activity</SectionLabel>
          {ACTIVITY.map((a, i) => <ActivityItem key={i} {...a} />)}
        </div>
      </div>
    </div>
  );
}

function CompletedDashboard() {
  const active = SESSIONS.filter(s => s.id !== "minh-le");
  return (
    <div className="max-w-4xl mx-auto p-6">
      <DashboardHeader />
      <article className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4 mb-6 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-white border border-emerald-200 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900">Minh Lê's handover is complete</h3>
          <p className="text-xs text-gray-500 mt-0.5">487 entries · 12 canonical facts · 9 gaps resolved · KG access ready</p>
        </div>
      </article>
      <div className="grid grid-cols-4 gap-3 mb-6">
        <ActionCard label="Needs your action" value={active.filter(s => s.blockedOnManager).length} color="urgent" />
        <ActionCard label="Deadline ≤ 7 days" value={0} color="normal" />
        <ActionCard label="Active sessions" value={active.length} color="normal" />
        <ActionCard label="Open gaps" value={1} color="warn" />
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          <div className="space-y-3">
            <SectionLabel count={active.length}>Active sessions</SectionLabel>
            {active.map(s => <SessionCard key={s.id} session={s} />)}
          </div>
          <div className="space-y-3">
            <SectionLabel count={1}>Completed</SectionLabel>
            <CompletedCard session={SESSION_DONE} />
          </div>
        </div>
        <div className="space-y-3">
          <SectionLabel>Recent activity</SectionLabel>
          {ACTIVITY.map((a, i) => <ActivityItem key={i} {...a} />)}
        </div>
      </div>
    </div>
  );
}

function DashboardHeader() {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Dashboard</h1>
      <Link href="/session/new" className="h-8 px-3 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30">
        <Plus className="w-3 h-3" />Create session
      </Link>
    </div>
  );
}

function DepartureBanner({ departures }) {
  return (
    <article className="rounded-lg border border-yellow-200 bg-yellow-50/40 p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-3.5 h-3.5 text-yellow-700" strokeWidth={2} />
        <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">{departures.length} upcoming departures from HRIS</h3>
      </div>
      <div className="space-y-2">
        {departures.map((d, i) => (
          <div key={i} className="flex items-center justify-between bg-white rounded-md border border-gray-200 px-3 py-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 text-gray-700 text-[10px] font-semibold inline-flex items-center justify-center shrink-0">{d.initials}</div>
              <div>
                <div className="text-sm font-medium text-gray-900">{d.name}</div>
                <div className="text-[11px] text-gray-500">{d.role} · {d.dept}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>Last day {d.lastDay} · {d.daysLeft}d</span>
              <Link href="/session/new" className="h-7 px-2.5 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-medium inline-flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30">
                Start handover<ArrowRight className="w-2.5 h-2.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function ActionCard({ label, value, color = "normal", active, onClick }) {
  const cls = { urgent: "text-rose-600", warn: "text-yellow-700", good: "text-emerald-600", normal: "text-gray-900" }[color];
  return (
    <button onClick={onClick} className={`rounded-lg border bg-white p-3 text-left transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${active ? "border-violet-400 ring-2 ring-violet-500/10" : "border-gray-200 hover:border-gray-300"}`}>
      <div className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">{label}</div>
      <div className={`text-xl font-semibold ${cls}`} style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{value}</div>
    </button>
  );
}

function SessionCard({ session, highlighted, dimmed }) {
  const phase = getPhase(session.subStageId);
  const blocked = session.blockedOnManager;
  const phaseColors = { prepare: "bg-blue-50 border-blue-200 text-blue-700", capture: "bg-violet-50 border-violet-200 text-violet-700", deliver: "bg-emerald-50 border-emerald-200 text-emerald-700" };
  return (
    <Link href={`/session/${session.id}`}
      className={`block rounded-lg border bg-white transition-all hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${highlighted ? "border-violet-400 shadow-sm" : dimmed ? "border-gray-200 opacity-40" : blocked ? "border-yellow-200" : "border-gray-200 hover:border-gray-300"}`}
      style={blocked ? { borderLeft: "2px solid rgb(234,179,8)" } : undefined}>
      <article className="p-4 flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full text-[11px] font-semibold inline-flex items-center justify-center shrink-0 border ${blocked ? "bg-yellow-50 text-yellow-700 border-yellow-200" : "bg-gray-100 text-gray-700 border-gray-200"}`}>{session.initials}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-sm font-semibold text-gray-900">{session.name}&apos;s handover</h3>
            <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold border ${phaseColors[phase.key]}`}>{phase.label}</span>
            {blocked && <span className="text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold bg-yellow-50 border border-yellow-200 text-yellow-700 inline-flex items-center gap-1"><Clock className="w-2.5 h-2.5" />Waiting on you</span>}
          </div>
          <p className="text-[12px] text-gray-500 mb-3">{session.role} · {session.dept} · {session.daysLeft} days left</p>
          <PhaseProgress subStageId={session.subStageId} />
          <ul className="mt-2 space-y-1">
            {session.tasks.map((t, i) => (
              <li key={i} className="flex items-center gap-1.5 text-[11px] text-gray-600">
                <span className={`w-[5px] h-[5px] rounded-full shrink-0 ${t.dot === "urgent" ? "bg-rose-500" : t.dot === "warn" ? "bg-yellow-500" : "bg-emerald-500"}`} />
                <span className="flex-1">{t.text}</span>
                {t.link && <ArrowRight className="w-2.5 h-2.5 text-gray-400 shrink-0" />}
              </li>
            ))}
          </ul>
        </div>
        <span className="h-8 px-3 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium inline-flex items-center gap-1.5 shrink-0">Open<ArrowRight className="w-3 h-3" /></span>
      </article>
    </Link>
  );
}

function CompletedCard({ session }) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold inline-flex items-center justify-center shrink-0 border border-emerald-200">{session.initials}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-semibold text-gray-900">{session.name}&apos;s handover</h3>
          <span className="text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 inline-flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5" />Complete</span>
          <span className="text-[10px] text-gray-500">{session.completedAt}</span>
        </div>
        <p className="text-[12px] text-gray-500 mb-3">{session.role} · {session.dept}</p>
        <PhaseProgress subStageId={session.subStageId} done />
        <div className="grid grid-cols-3 gap-2 mt-3">
          <StatTile icon={Database} label="Entries" value={session.stats.entries} />
          <StatTile icon={Network} label="Canonical" value={session.stats.canonical} />
          <StatTile icon={Sparkles} label="Gaps resolved" value={session.stats.gaps} />
        </div>
      </div>
    </article>
  );
}

function StatTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-md border border-gray-200 bg-gray-50/40 px-2 py-1.5">
      <div className="flex items-center gap-1 text-[10px] text-gray-500 uppercase tracking-wider font-medium"><Icon className="w-2.5 h-2.5" strokeWidth={1.75} />{label}</div>
      <div className="text-sm font-semibold text-gray-900 mt-0.5" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{value}</div>
    </div>
  );
}

function PhaseProgress({ subStageId, done }) {
  const cur = getPhase(subStageId);
  const curSub = getSub(subStageId);
  return (
    <div>
      <div className="flex items-center justify-between mb-1 text-[10px]">
        <span className="text-gray-700 font-medium">{done ? "All 3 phases complete" : <>Phase {cur.id} of 3 · <span className="text-gray-900">{cur.label}</span></>}</span>
        <span className="text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{done ? "Complete" : curSub.label}</span>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {PHASES.map(p => {
          const isDone = done || p.id < cur.id;
          const isCur = !done && p.id === cur.id;
          let pct = 0;
          if (isCur) { const idx = p.subs.findIndex(s => s.id === subStageId); pct = ((idx + 0.5) / p.subs.length) * 100; }
          return (
            <div key={p.id} className="relative h-2 rounded-sm bg-gray-200 overflow-hidden">
              {isDone && <div className="absolute inset-0 bg-emerald-500" />}
              {isCur && <div className="absolute inset-y-0 left-0 bg-violet-500" style={{ width: `${pct}%` }} />}
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-3 gap-1 mt-1">
        {PHASES.map(p => {
          const isDone = done || p.id < cur.id;
          const isCur = !done && p.id === cur.id;
          return <span key={p.id} className={`text-[9px] uppercase tracking-wider font-medium text-center ${isDone ? "text-emerald-700" : isCur ? "text-violet-700" : "text-gray-400"}`}>{p.label}</span>;
        })}
      </div>
    </div>
  );
}

function SectionLabel({ count, children }) {
  return (
    <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium flex items-center gap-2">
      <span>{children}</span>
      {count !== undefined && <span className="text-gray-400" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>· {count}</span>}
    </h2>
  );
}

function ActivityItem({ ts, actor, text, severity }) {
  const border = { low: "rgb(229,231,235)", medium: "rgb(234,179,8)", high: "rgb(244,63,94)" }[severity];
  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2" style={{ borderLeft: `2px solid ${border}` }}>
      <div className="flex items-center justify-between mb-0.5 gap-2">
        <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{ts}</span>
        <span className="text-[10px] text-gray-700 font-medium shrink-0">{actor}</span>
      </div>
      <div className="text-[11px] text-gray-900 leading-relaxed">{text}</div>
    </div>
  );
}

function TopBar() {
  return (
    <header className="bg-white border-b border-gray-200 px-5 py-2.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
        <span className="text-gray-900 font-semibold tracking-[0.18em] text-xs" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>ART-EEP</span>
      </div>
      <div className="flex items-center gap-3">
        <button className="h-8 w-8 rounded-md hover:bg-gray-100 inline-flex items-center justify-center text-gray-500 relative"><Bell className="w-3.5 h-3.5" strokeWidth={1.75} /><span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500" /></button>
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
          <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 text-[11px] font-semibold inline-flex items-center justify-center">HV</div>
          <div className="text-[11px]"><div className="font-medium text-gray-900 leading-tight">Hà Vy</div><div className="text-gray-500 leading-tight">Manager · Engineering</div></div>
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
          <span className="uppercase tracking-wider font-semibold text-violet-700">Manager / HR view</span>
          <span className="text-gray-300">·</span>
          <span style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>step {stepIdx + 1} of {FLOW.length}</span>
        </div>
        <h1 className="text-sm font-semibold text-gray-900 truncate mt-0.5">{step.label}</h1>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {FLOW.map((s, i) => (
          <button key={s.id} onClick={() => onJump(i)} title={s.label}
            className={`w-7 h-7 rounded-md border text-[11px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${i === stepIdx ? "bg-violet-600 text-white border-violet-600" : "bg-white text-violet-700 border-violet-200 hover:border-violet-400"}`}
            style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{i + 1}</button>
        ))}
      </div>
    </div>
  );
}

function FooterNav({ stepIdx, onChange }) {
  const atFirst = stepIdx === 0, atLast = stepIdx === FLOW.length - 1;
  return (
    <footer className="bg-white border-t border-gray-200 px-5 py-2.5 flex items-center justify-between sticky bottom-0 z-20">
      <button onClick={() => !atFirst && onChange(stepIdx - 1)} disabled={atFirst}
        className={`h-8 px-3 rounded-md text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${atFirst ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}>
        <ChevronLeft className="w-3.5 h-3.5" />Previous
      </button>
      <div className="hidden sm:block text-[11px] text-gray-500 max-w-md text-center truncate px-3">{FLOW[stepIdx].trigger}</div>
      <button onClick={() => !atLast && onChange(stepIdx + 1)} disabled={atLast}
        className={`h-8 px-3 rounded-md text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30 ${atLast ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-700 text-white"}`}>
        Next<ChevronRight className="w-3.5 h-3.5" />
      </button>
    </footer>
  );
}
