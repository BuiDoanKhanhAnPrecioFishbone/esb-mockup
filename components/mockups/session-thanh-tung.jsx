"use client";
import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, AlertTriangle, Sparkles, ArrowRight, Plus, ChevronDown, Users, FileText, Database } from "lucide-react";

/* Session detail for Thanh T\u00f9ng — Prepare phase, "Waiting on you" state.
   The knowledge map is ready. Manager (H\u00e0 Vy) needs to review modules,
   add priority prompts, and approve to start Capture. */

const SESSION = {
  name: "Thanh T\u00f9ng", role: "QA Lead", dept: "Engineering",
  initials: "TT", daysLeft: 28, deadline: "Jul 4, 2026",
  boards: 3, cards: 127, modules: 4, questions: 0, gaps: 3, coworkers: 2,
};

const MODULES = [
  { name: "Test Automation Framework", cards: 42, status: "ready",
    areas: ["Selenium grid configuration", "CI test pipeline (Jenkins + GitHub Actions)", "Flaky test quarantine process", "Test data seeding strategy"],
    gaps: ["No documentation for mobile test suite setup"],
    suggested: ["What happens when the Selenium grid goes down during a release?", "How do you handle test data cleanup between runs?"] },
  { name: "Bug Triage & Escalation", cards: 38, status: "ready",
    areas: ["Severity classification (P0\u2013P4)", "Escalation paths per product area", "Customer-facing bug SLA", "Regression vs new bug workflow"],
    gaps: ["Escalation contacts are in Thanh T\u00f9ng\u2019s personal notes, not shared"],
    suggested: ["Who are the escalation contacts for each product area?", "What\u2019s the SLA for P0 bugs reported by enterprise customers?"] },
  { name: "Release Testing", cards: 31, status: "needs-review",
    areas: ["Pre-release checklist", "Smoke test suite", "Rollback criteria", "Hotfix testing shortcut"],
    gaps: ["Rollback criteria are verbal \u2014 never written down"],
    suggested: ["What are the rollback criteria for a failed release?", "Is there a fast path for hotfix testing?"] },
  { name: "QA Infrastructure", cards: 16, status: "ready",
    areas: ["Staging environment management", "Test database snapshots", "Performance test tooling (k6)", "QA environment access control"],
    gaps: [],
    suggested: ["How do you reset the staging environment between test cycles?"] },
];

const COWORKERS = [
  { name: "Linh Tr\u1ea7n", role: "QA Engineer", initials: "LT", joined: true },
  { name: "B\u1ea3o Nguy\u1ec5n", role: "Junior QA", initials: "BN", joined: false },
];

export default function SessionThanhTung({ embedded = false } = {}) {
  const [expandedMod, setExpandedMod] = useState(null);
  const [addedPrompts, setAddedPrompts] = useState(new Set());
  const [showApprove, setShowApprove] = useState(false);

  const totalGaps = MODULES.reduce((s, m) => s + m.gaps.length, 0);
  const totalSuggested = MODULES.reduce((s, m) => s + m.suggested.length, 0);

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

      {/* Action banner */}
      <div className="rounded-lg border border-yellow-200 bg-yellow-50/40 p-4 mb-5" style={{ borderLeft: "2px solid rgb(234,179,8)" }}>
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-yellow-700 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Knowledge map ready for your review</h3>
            <p className="text-[12px] text-gray-600 leading-relaxed">
              {"ART-EEP crawled "}{SESSION.boards}{" Trello boards and derived "}{SESSION.modules}{" knowledge modules from "}{SESSION.cards}{" cards. "}
              {totalGaps > 0 && <><span className="font-medium text-yellow-700">{totalGaps}{" knowledge gaps"}</span>{" were detected. "}</>}
              {"Review the modules below, add priority prompts, then approve to start Capture."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-3">
          {/* Modules */}
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium flex items-center gap-2">
            <span>Knowledge modules</span>
            <span className="text-gray-400" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{"\u00b7 "}{MODULES.length}</span>
          </h2>

          {MODULES.map((mod, mi) => {
            const isExp = expandedMod === mi;
            return (
              <div key={mi} className={`rounded-lg border bg-white transition-all ${mod.status === "needs-review" ? "border-yellow-200" : "border-gray-200"}`} style={mod.status === "needs-review" ? { borderLeft: "2px solid rgb(234,179,8)" } : undefined}>
                <button onClick={() => setExpandedMod(isExp ? null : mi)} className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50/50 transition-colors">
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform shrink-0 ${isExp ? "" : "-rotate-90"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] font-medium text-gray-900">{mod.name}</span>
                      <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{mod.cards}{" cards"}</span>
                      {mod.gaps.length > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-50 text-yellow-700 border border-yellow-200">{mod.gaps.length}{" gap"}{mod.gaps.length > 1 ? "s" : ""}</span>}
                      {mod.status === "needs-review" && <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-50 text-yellow-700 border border-yellow-200 inline-flex items-center gap-0.5"><AlertTriangle className="w-2.5 h-2.5" />Needs review</span>}
                      {mod.status === "ready" && <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-0.5"><CheckCircle2 className="w-2.5 h-2.5" />Ready</span>}
                    </div>
                  </div>
                </button>

                {isExp && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
                    {/* Knowledge areas */}
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1.5">Knowledge areas derived</p>
                      <div className="flex flex-wrap gap-1.5">
                        {mod.areas.map((a, ai) => <span key={ai} className="text-[11px] px-2 py-1 rounded-md bg-gray-50 border border-gray-200 text-gray-700">{a}</span>)}
                      </div>
                    </div>

                    {/* Gaps */}
                    {mod.gaps.length > 0 && (
                      <div>
                        <p className="text-[10px] text-yellow-700 uppercase tracking-wider font-medium mb-1.5">{"Knowledge gaps ("}{mod.gaps.length}{")"}</p>
                        {mod.gaps.map((g, gi) => (
                          <div key={gi} className="rounded-md bg-yellow-50/50 border-l-2 border-yellow-400 px-3 py-2 text-[11px] text-gray-700">{g}</div>
                        ))}
                      </div>
                    )}

                    {/* AI-suggested prompts */}
                    {mod.suggested.length > 0 && (
                      <div>
                        <p className="text-[10px] text-violet-600 uppercase tracking-wider font-medium mb-1.5 flex items-center gap-1"><Sparkles className="w-3 h-3" />{"Suggested priority prompts ("}{mod.suggested.length}{")"}</p>
                        {mod.suggested.map((s, si) => {
                          const key = `${mi}-${si}`;
                          const added = addedPrompts.has(key);
                          return (
                            <div key={si} className={`rounded-md border px-3 py-2 flex items-start gap-2 mb-1.5 ${added ? "border-violet-200 bg-violet-50/30" : "border-gray-200 bg-white"}`}>
                              <Sparkles className="w-3 h-3 text-violet-500 shrink-0 mt-0.5" />
                              <span className="text-[11px] text-gray-700 flex-1">{s}</span>
                              {!added && <button onClick={() => setAddedPrompts(prev => new Set([...prev, key]))} className="text-[10px] px-2 py-0.5 rounded bg-violet-600 text-white hover:bg-violet-700 shrink-0 transition-colors">Add</button>}
                              {added && <span className="text-[10px] text-violet-600 flex items-center gap-0.5 shrink-0"><CheckCircle2 className="w-3 h-3" />Added</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Custom prompt input */}
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
            <p className="text-[11px] text-gray-500 mb-2 flex items-center gap-1.5"><Plus className="w-3 h-3" />Add your own priority prompt</p>
            <div className="flex gap-2">
              <input placeholder={"What should Thanh T\u00f9ng\u2019s team know about...?"} className="flex-1 h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 placeholder:text-gray-400" />
              <button className="h-9 px-4 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors">Add</button>
            </div>
          </div>

          {/* Approve CTA */}
          <div className="flex items-center gap-3 pt-2">
            <Link href="/" className="h-9 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 inline-flex items-center gap-1.5">Back to dashboard</Link>
            <button onClick={() => setShowApprove(true)} className="h-9 px-4 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium inline-flex items-center gap-2 transition-colors">
              {"Approve and start Capture"}<ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Summary */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-3">Session summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-[11px]"><span className="text-gray-500">Boards crawled</span><span className="text-gray-900 font-medium" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{SESSION.boards}</span></div>
              <div className="flex justify-between text-[11px]"><span className="text-gray-500">Cards indexed</span><span className="text-gray-900 font-medium" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{SESSION.cards}</span></div>
              <div className="flex justify-between text-[11px]"><span className="text-gray-500">Modules derived</span><span className="text-gray-900 font-medium" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{SESSION.modules}</span></div>
              <div className="flex justify-between text-[11px]"><span className="text-gray-500">Knowledge gaps</span><span className="text-yellow-700 font-medium" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{totalGaps}</span></div>
              <div className="flex justify-between text-[11px]"><span className="text-gray-500">Suggested prompts</span><span className="text-violet-600 font-medium" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{totalSuggested}</span></div>
              <div className="flex justify-between text-[11px]"><span className="text-gray-500">Priority prompts added</span><span className="text-gray-900 font-medium" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{addedPrompts.size}</span></div>
            </div>
          </div>

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

      {/* Approve modal */}
      {showApprove && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setShowApprove(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-[420px] border border-gray-200" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-semibold mb-3">{"Start Capture for Thanh T\u00f9ng?"}</h3>
            <p className="text-[12px] text-gray-500 mb-3 leading-relaxed">
              {"This will open the question queue for Thanh T\u00f9ng. He\u2019ll be notified and can start answering. "}
              {addedPrompts.size > 0 && <><span className="font-medium text-violet-600">{addedPrompts.size}{" priority prompt"}{addedPrompts.size > 1 ? "s" : ""}</span>{" will be included."}</>}
              {addedPrompts.size === 0 && <span className="text-yellow-700">{"You haven\u2019t added any priority prompts yet. AI-generated questions will be used."}</span>}
            </p>
            <div className="text-[11px] text-gray-600 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 mb-4 space-y-1">
              <p>{"\u00b7 "}{SESSION.modules}{" knowledge modules"}</p>
              <p>{"\u00b7 "}{totalGaps}{" gaps flagged for attention"}</p>
              <p>{"\u00b7 "}{SESSION.coworkers}{" coworkers invited"}</p>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowApprove(false)} className="h-8 px-3 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button className="h-8 px-3 rounded-md bg-violet-600 text-white text-sm font-medium inline-flex items-center gap-1.5 hover:bg-violet-700">
                <ArrowRight className="w-3.5 h-3.5" />Start Capture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
