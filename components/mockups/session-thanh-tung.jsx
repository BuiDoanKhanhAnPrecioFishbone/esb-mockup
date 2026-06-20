"use client";
import React from "react";
import Link from "next/link";
import { CheckCircle2, Clock, AlertTriangle, ArrowRight, Users } from "lucide-react";

/* Session detail for Thanh T\u00f9ng — Prepare phase, "Ready for review" state.
   Follows the same pattern as Minh L\u00ea's ready state in session-command-view.
   Knowledge map is ready. Manager reviews modules, then clicks Start Capture.
   Questions are added via the Data tab, not here. */

const SESSION = {
  name: "Thanh T\u00f9ng", role: "QA Lead", dept: "Engineering",
  initials: "TT", daysLeft: 28, deadline: "Jul 4, 2026",
  boards: 3, cards: 127, modules: 4, questions: 0, gaps: 3, coworkers: 2,
};

const KNOWLEDGE_AREAS = [
  "Test Automation Framework", "Bug Triage & Escalation",
  "Release Testing", "QA Infrastructure",
];

const COWORKERS = [
  { name: "Linh Tr\u1ea7n", role: "QA Engineer", initials: "LT", joined: true },
  { name: "B\u1ea3o Nguy\u1ec5n", role: "Junior QA", initials: "BN", joined: false },
];

function MC({ l, v }) {
  return <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-center"><div className="text-lg font-semibold text-gray-900" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{v}</div><div className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-0.5">{l}</div></div>;
}

export default function SessionThanhTung({ embedded = false } = {}) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Session header */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 mb-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200 text-sm font-semibold inline-flex items-center justify-center shrink-0">{SESSION.initials}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-lg font-semibold text-gray-900">{SESSION.name}&apos;s session</h1>
            <span className="text-[9px] px-2 py-0.5 rounded uppercase tracking-wider font-semibold border bg-blue-50 border-blue-200 text-blue-700">Prepare</span>
            <span className="text-[9px] px-2 py-0.5 rounded uppercase tracking-wider font-semibold bg-yellow-50 border border-yellow-200 text-yellow-700 inline-flex items-center gap-1"><Clock className="w-2.5 h-2.5" />Waiting on you</span>
          </div>
          <p className="text-[12px] text-gray-500">{SESSION.role}{" \u00b7 "}{SESSION.dept}</p>
          <p className="text-[11px] text-gray-500 mt-0.5" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{SESSION.daysLeft}{"d left \u00b7 "}{SESSION.boards}{" boards \u00b7 "}{SESSION.cards}{" cards \u00b7 "}{SESSION.modules}{" modules derived"}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4">
          {/* Data collection complete — same pattern as Minh L\u00ea */}
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Data collection complete</h3>
            <div className="grid grid-cols-4 gap-3 mb-4">
              <MC l="Boards" v={SESSION.boards} />
              <MC l="Cards" v={SESSION.cards} />
              <MC l="Areas" v={SESSION.modules} />
              <MC l="Questions" v={SESSION.questions} />
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Knowledge areas</p>
              <div className="flex flex-wrap gap-1.5">
                {KNOWLEDGE_AREAS.map(a => <span key={a} className="text-[11px] px-2 py-1 rounded-md bg-gray-50 border border-gray-200 text-gray-700">{a}</span>)}
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-gray-100 grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">Coworker engagement</p>
                <p className="text-[12px] text-gray-700">{COWORKERS.filter(c => c.joined).length}{" of "}{SESSION.coworkers}{" have joined"}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">Knowledge gaps</p>
                <p className="text-[12px] text-yellow-700">{SESSION.gaps}{" gaps detected (card-level)"}</p>
              </div>
            </div>
          </div>

          {/* CTAs — same as Minh L\u00ea's ready state */}
          <div className="flex items-center gap-3">
            <Link href="/" className="h-9 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 inline-flex items-center gap-1.5">Back to dashboard</Link>
            <button className="h-9 px-4 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium inline-flex items-center gap-2 transition-colors">
              {"Start Capture"}<ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Coworkers */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-3 flex items-center gap-1"><Users className="w-3 h-3" />Coworkers</h3>
            {COWORKERS.map((cw, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5">
                <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 text-gray-700 text-[9px] font-semibold inline-flex items-center justify-center">{cw.initials}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-gray-900">{cw.name}</p>
                  <p className="text-[10px] text-gray-500">{cw.role}</p>
                </div>
                {cw.joined ? <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Joined</span> : <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-50 text-gray-500 border border-gray-200">Invited</span>}
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-3">Timeline</h3>
            <div className="space-y-2">
              {[
                { time: "2h ago", text: "Knowledge map ready", accent: true },
                { time: "3h ago", text: "4 modules derived from 127 cards" },
                { time: "5h ago", text: "Crawl complete \u2014 3 boards" },
                { time: "1d ago", text: "Session created by H\u00e0 Vy" },
              ].map((ev, i) => (
                <div key={i} className="flex gap-2 text-[11px]" style={ev.accent ? { borderLeft: "2px solid rgb(234,179,8)", paddingLeft: "8px", borderRadius: 0 } : undefined}>
                  <span className="text-gray-400 shrink-0" style={{ fontFamily: "ui-monospace, Menlo, monospace", minWidth: "48px" }}>{ev.time}</span>
                  <span className="text-gray-700">{ev.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
