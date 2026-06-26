"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Search, Sparkles, Layers, MessageCircle } from "lucide-react";

/* All Sessions registry (CL-123) — filterable list of all sessions.
   Aligned with redesigned dashboard (MV-04): inline knowledge metrics,
   3-segment phase progress, no urgency tags, no upload references. */

// Phase model mirrors the dashboard (ha-vy-handover-dashboard.jsx).
const PHASES = [
  { id: 1, key: "prepare", label: "Prepare", subs: [{ id: 1, label: "Setup confirmed" }, { id: 2, label: "Context seeding" }, { id: 3, label: "Knowledge map ready" }] },
  { id: 2, key: "capture", label: "Capture", subs: [{ id: 4, label: "Questions assigned" }, { id: 5, label: "Answering queue" }, { id: 6, label: "Answers reviewed" }] },
  { id: 3, key: "deliver", label: "Deliver", subs: [{ id: 7, label: "Committed to KG" }, { id: 8, label: "KG access ready" }] },
];
function getPhase(sid) { return PHASES.find(p => p.subs.some(s => s.id === sid)); }
function getSub(sid) { for (const p of PHASES) { const s = p.subs.find(x => x.id === sid); if (s) return s; } return null; }

const ALL_SESSIONS = [
  { id: "thanh-tung", name: "Thanh Tùng", role: "QA Lead", dept: "Engineering", initials: "TT", subStageId: 3, status: "active", daysLeft: 28, modules: 4, createdAt: "Jun 10, 2026" },
  { id: "minh-le", name: "Minh Lê", role: "Senior Backend Engineer", dept: "Engineering", initials: "ML", subStageId: 5, status: "active", daysLeft: 22, gapsResolved: "4/6", answered: "9/14", createdAt: "Jun 4, 2026" },
  { id: "thanh-duc", name: "Thanh Đức", role: "DevOps Engineer", dept: "Engineering", initials: "TĐ", subStageId: 8, status: "completed", gapsResolved: "5/5", answered: "11/11", createdAt: "Feb 20, 2026", completedAt: "Mar 12, 2026" },
  { id: "anh-thu", name: "Anh Thư", role: "Product Designer", dept: "Design", initials: "AT", subStageId: 8, status: "completed", gapsResolved: "6/6", answered: "38/38", createdAt: "May 15, 2026", completedAt: "Jun 1, 2026" },
];

const FILTERS = ["All", "Active", "Completed"];

export default function AllSessions({ embedded = false } = {}) {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? ALL_SESSIONS : ALL_SESSIONS.filter(s => filter === "Active" ? s.status === "active" : s.status === "completed");

  const content = (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Sessions</h1>
        <Link href="/session/new" className="h-8 px-3 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30">
          + Create session
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${filter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>{f}
              {f === "Active" && <span className="ml-1 text-[10px] text-gray-400" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{ALL_SESSIONS.filter(s => s.status === "active").length}</span>}
              {f === "Completed" && <span className="ml-1 text-[10px] text-gray-400" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{ALL_SESSIONS.filter(s => s.status === "completed").length}</span>}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5 h-8 px-2.5 rounded-md border border-gray-200 bg-white max-w-xs">
          <Search className="w-3 h-3 text-gray-400" />
          <input type="text" placeholder="Search sessions..." className="bg-transparent outline-none text-[11px] text-gray-700 placeholder:text-gray-400 flex-1 min-w-0" />
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map(s => <SessionRow key={s.id} session={s} />)}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-gray-500">No sessions match this filter.</div>
        )}
      </div>
    </div>
  );

  if (embedded) return content;
  return <div className="min-h-screen bg-gray-50 text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>{content}</div>;
}

// 3-segment Prepare / Capture / Deliver progress — same model as the dashboard.
function PhaseProgress({ subStageId, done }) {
  const cur = getPhase(subStageId);
  const curSub = getSub(subStageId);
  return (
    <div>
      <div className="flex items-center justify-between mb-1 text-[10px]">
        <span className="text-gray-700 font-medium">{done ? "All 3 phases complete" : <>{"Phase "}{cur.id}{" of 3 · "}<span className="text-gray-900">{cur.label}</span></>}</span>
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

// Compact one-row knowledge metrics — same format as the dashboard cards.
function InlineMetrics({ session: s, isComplete }) {
  const phase = getPhase(s.subStageId);
  const isPrepare = !isComplete && phase.key === "prepare";
  if (isPrepare) {
    return (
      <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-100 text-[11px] text-gray-600">
        <span className="inline-flex items-center gap-1"><Layers className="w-3 h-3 text-gray-400" />{s.modules}{" modules mapped"}</span>
        <span className="text-gray-300">&middot;</span>
        <span className="text-gray-400">capture not started</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-100 text-[11px] text-gray-600">
      <span className="inline-flex items-center gap-1"><Sparkles className="w-3 h-3 text-violet-500" />{s.gapsResolved}{" gaps resolved"}</span>
      <span className="text-gray-300">&middot;</span>
      <span className="inline-flex items-center gap-1"><MessageCircle className="w-3 h-3 text-gray-400" />{s.answered}{" answered"}</span>
    </div>
  );
}

function SessionRow({ session: s }) {
  const isComplete = s.status === "completed";
  const phase = getPhase(s.subStageId);
  const phaseColors = { prepare: "bg-blue-50 border-blue-200 text-blue-700", capture: "bg-violet-50 border-violet-200 text-violet-700", deliver: "bg-emerald-50 border-emerald-200 text-emerald-700" };
  const phaseBadge = isComplete ? "bg-emerald-50 border-emerald-200 text-emerald-700" : phaseColors[phase.key];
  return (
    <div className="rounded-lg border border-gray-200 bg-white transition-all hover:border-gray-300 hover:shadow-sm">
      <div className="p-4 flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full text-[11px] font-semibold inline-flex items-center justify-center shrink-0 border ${isComplete ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-700 border-gray-200"}`}>{s.initials}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{s.name}&apos;s session</h3>
            <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold border ${phaseBadge}`}>
              {isComplete && <CheckCircle2 className="w-2.5 h-2.5 inline mr-0.5" />}{isComplete ? "Complete" : phase.label}
            </span>
          </div>
          <p className="text-[12px] text-gray-500 mb-3">{s.role} &middot; {s.dept} {isComplete ? `· Completed ${s.completedAt}` : `· ${s.daysLeft} days left`}</p>
          <PhaseProgress subStageId={s.subStageId} done={isComplete} />
          <InlineMetrics session={s} isComplete={isComplete} />
        </div>
        <div className="flex items-center gap-2 shrink-0 self-center">
          {isComplete ? (
            <Link href={`/knowledge-graph?prompt=${s.id}`} className="h-7 px-2.5 rounded-md bg-violet-50 border border-violet-200 text-violet-700 text-[10px] font-medium inline-flex items-center gap-1 hover:bg-violet-100 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
              <Sparkles className="w-3 h-3" />View in KG
            </Link>
          ) : (
            <Link href={`/session/${s.id}`} className="h-8 px-3 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium inline-flex items-center gap-1.5 hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
              Open<ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
