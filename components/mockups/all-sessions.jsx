"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Search, Filter } from "lucide-react";

/* All Sessions registry (CL-123) — filterable list of all sessions */

const ALL_SESSIONS = [
  { id: "thanh-tung", name: "Thanh Tùng", role: "QA Lead", dept: "Engineering", initials: "TT", phase: "Prepare", phaseKey: "prepare", status: "active", daysLeft: 28, metricsLeft: "3 boards · 127 cards · 4 modules", metricsRight: "0 questions added", blockedOnManager: true, createdAt: "Jun 10, 2026" },
  { id: "minh-le", name: "Minh Lê", role: "Senior Backend Engineer", dept: "Engineering", initials: "ML", phase: "Capture", phaseKey: "capture", status: "active", daysLeft: 22, metricsLeft: "9 of 14 answered · 7 satisfied", metricsRight: "2 gaps open", blockedOnManager: false, createdAt: "Jun 4, 2026" },
  { id: "anh-thu", name: "Anh Thư", role: "Product Designer", dept: "Design", initials: "AT", phase: "Complete", phaseKey: "complete", status: "completed", daysLeft: 0, metricsLeft: "312 entries · 8 canonical", metricsRight: "6 gaps resolved", blockedOnManager: false, createdAt: "May 15, 2026", completedAt: "Jun 1, 2026" },
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
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>{f}
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

function SessionRow({ session: s }) {
  const phaseColors = { prepare: "bg-blue-50 border-blue-200 text-blue-700", capture: "bg-violet-50 border-violet-200 text-violet-700", complete: "bg-emerald-50 border-emerald-200 text-emerald-700" };
  const isComplete = s.status === "completed";
  return (
    <Link href={`/session/${s.id}`} className={`block rounded-lg border bg-white hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${isComplete ? "border-gray-200 opacity-70" : s.blockedOnManager ? "border-yellow-200" : "border-gray-200 hover:border-gray-300"}`} style={s.blockedOnManager ? { borderLeft: "2px solid rgb(234,179,8)" } : undefined}>
      <div className="p-4 flex items-center gap-4">
        <div className={`w-9 h-9 rounded-full text-[10px] font-semibold inline-flex items-center justify-center shrink-0 border ${isComplete ? "bg-emerald-50 text-emerald-700 border-emerald-200" : s.blockedOnManager ? "bg-yellow-50 text-yellow-700 border-yellow-200" : "bg-gray-100 text-gray-700 border-gray-200"}`}>{s.initials}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{s.name}&apos;s session</h3>
            <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold border ${phaseColors[s.phaseKey]}`}>
              {isComplete && <CheckCircle2 className="w-2.5 h-2.5 inline mr-0.5" />}{s.phase}
            </span>
            {s.blockedOnManager && <span className="text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold bg-yellow-50 border border-yellow-200 text-yellow-700 inline-flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />Waiting on you</span>}
          </div>
          <p className="text-[11px] text-gray-500">{s.role} · {s.dept} {isComplete ? `· Completed ${s.completedAt}` : `· ${s.daysLeft} days left`}</p>
        </div>
        <div className="text-right shrink-0 hidden sm:block">
          <p className="text-[11px] text-gray-700">{s.metricsLeft}</p>
          <p className="text-[10px] text-gray-500">{s.metricsRight}</p>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
      </div>
    </Link>
  );
}
