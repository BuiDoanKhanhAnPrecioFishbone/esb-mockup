"use client";
import React, { useState } from "react";
import { CheckCircle2, Clock, AlertTriangle, ArrowRight, Plus, ChevronDown, FileText, Sparkles, Layers, Pencil, Trash2, Check, X } from "lucide-react";

/* Session command view for Thanh Tùng — Prepare (ready) state.
   Mirrors session-command-view.jsx layout: HeroBar + 3 tabs.
   Questions are functional: add + edit + delete (Prepare only). */

const BASE = {
  name: "Thanh Tùng", role: "QA Lead", dept: "Engineering",
  initials: "TT", daysLeft: 28, boards: 3, cards: 127, modules: 4,
  gaps: 3, coworkers: 2,
};

const MODULES_DATA = [
  { board: "QA Processes", boardCards: 80, modules: [
    { name: "Test Automation Framework", cards: 42, gaps: 1,
      moduleGaps: ["No documentation for mobile test suite setup"],
      items: [
        { name: "Selenium grid configuration", desc: "Hub + 4 node setup, Chrome/Firefox.", gaps: [], files: [] },
        { name: "CI test pipeline", desc: "Jenkins nightly + GitHub Actions on PR.", gaps: [], files: [{ name: "ci-test-config.yml", size: "2.1 KB" }] },
        { name: "Flaky test quarantine process", desc: "Auto-quarantine after 3 consecutive failures.", gaps: ["No documentation for mobile test suite setup"], files: [] },
        { name: "Test data seeding strategy", desc: "Factory-based seeding for staging.", gaps: [], files: [] },
      ] },
    { name: "Bug Triage & Escalation", cards: 38, gaps: 1,
      moduleGaps: ["Escalation contacts in personal notes, not shared"],
      items: [
        { name: "Severity classification (P0\u2013P4)", desc: "P0: data loss. P1: feature down. P2: degraded. P3: cosmetic. P4: enhancement.", gaps: [], files: [] },
        { name: "Escalation paths per product area", desc: "Product \u2192 QA Lead \u2192 Engineering Manager.", gaps: ["Escalation contacts in personal notes, not shared"], files: [] },
        { name: "Customer-facing bug SLA", desc: "P0: 4h response, 24h fix. P1: 8h response.", gaps: [], files: [{ name: "bug-sla-matrix.pdf", size: "28 KB" }] },
        { name: "Regression vs new bug workflow", desc: "Regression: auto-P1. New: triage meeting.", gaps: [], files: [] },
      ] },
  ] },
  { board: "Release & Infrastructure", boardCards: 47, modules: [
    { name: "Release Testing", cards: 31, gaps: 1,
      moduleGaps: ["Rollback criteria are verbal \u2014 never written down"],
      items: [
        { name: "Pre-release checklist", desc: "12-step checklist before go/no-go.", gaps: [], files: [{ name: "release-checklist.md", size: "1.4 KB" }] },
        { name: "Smoke test suite", desc: "42 critical-path tests, 8-minute runtime.", gaps: [], files: [] },
        { name: "Rollback criteria", desc: "When to roll back a release.", gaps: ["Rollback criteria are verbal \u2014 never written down"], files: [] },
        { name: "Hotfix testing shortcut", desc: "Reduced test matrix for emergency fixes.", gaps: [], files: [] },
      ] },
    { name: "QA Infrastructure", cards: 16, gaps: 0,
      moduleGaps: [],
      items: [
        { name: "Staging environment management", desc: "3 staging envs, weekly reset cycle.", gaps: [], files: [] },
        { name: "Test database snapshots", desc: "Daily snapshots, 7-day retention.", gaps: [], files: [] },
        { name: "Performance test tooling (k6)", desc: "Load tests on staging, 500 VU baseline.", gaps: [], files: [{ name: "k6-config.js", size: "3.8 KB" }] },
        { name: "QA environment access control", desc: "Role-based, synced with Entra ID.", gaps: [], files: [] },
      ] },
  ] },
];

const SEED_QUESTIONS = [
  { id: "q1", text: "Who are the escalation contacts for each product area?", from: "AI-generated", fromType: "ai", module: "Bug Triage & Escalation" },
  { id: "q2", text: "What are the rollback criteria for a failed release?", from: "H\u00e0 Vy", fromType: "human", module: "Release Testing" },
];

const LOGS = [
  { time: "2h ago", actor: "System", text: "Knowledge map ready \u2014 4 modules derived from 127 cards" },
  { time: "3h ago", actor: "System", text: "Crawl complete \u2014 3 boards, 127 cards" },
  { time: "4h ago", actor: "System", text: "4-layer hard-filter applied \u2014 removed 43 cards (backlog, empty)" },
  { time: "5h ago", actor: "System", text: "Crawl started \u2014 QA Processes, Release & Infrastructure, QA Tooling" },
  { time: "1d ago", actor: "H\u00e0 Vy", text: "Session created for Thanh T\u00f9ng" },
  { time: "1d ago", actor: "System", text: "Coworker Linh Tr\u1ea7n invited" },
  { time: "1d ago", actor: "System", text: "Coworker B\u1ea3o Nguy\u1ec5n invited" },
];

let qIdCounter = 100;

function MC({ l, v }) {
  return <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-center"><div className="text-lg font-semibold text-gray-900" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{v}</div><div className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-0.5">{l}</div></div>;
}

export default function SessionThanhTung({ embedded = false } = {}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [questions, setQuestions] = useState(SEED_QUESTIONS);
  const tabs = [{ id: "overview", label: "Overview" }, { id: "data", label: "Data" }, { id: "logs", label: "Logs" }];

  const addQuestion = (text, module) => {
    if (!text.trim()) return;
    setQuestions(prev => [...prev, { id: `q${++qIdCounter}`, text: text.trim(), from: "H\u00e0 Vy", fromType: "human", module }]);
  };
  const editQuestion = (id, newText) => { setQuestions(prev => prev.map(q => q.id === id ? { ...q, text: newText } : q)); };
  const deleteQuestion = (id) => { setQuestions(prev => prev.filter(q => q.id !== id)); };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <HeroBar qCount={questions.length} />
      <div className="flex gap-0 border-b border-gray-200 mb-5">
        {tabs.map(t => <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${activeTab === t.id ? "border-violet-600 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>{t.label}</button>)}
      </div>
      {activeTab === "overview" && <OverviewTab qCount={questions.length} onSwitchTab={() => setActiveTab("data")} />}
      {activeTab === "data" && <DataTab questions={questions} onAdd={addQuestion} onEdit={editQuestion} onDelete={deleteQuestion} />}
      {activeTab === "logs" && <LogsTab />}
    </div>
  );
}

function HeroBar({ qCount }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 mb-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200 text-sm font-semibold inline-flex items-center justify-center shrink-0">{BASE.initials}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <h1 className="text-lg font-semibold text-gray-900">{BASE.name}&apos;s session</h1>
          <span className="text-[9px] px-2 py-0.5 rounded uppercase tracking-wider font-semibold border bg-blue-50 border-blue-200 text-blue-700">Prepare</span>
          <span className="text-[9px] px-2 py-0.5 rounded uppercase tracking-wider font-semibold bg-yellow-50 border border-yellow-200 text-yellow-700 inline-flex items-center gap-1"><Clock className="w-2.5 h-2.5" />Waiting on you</span>
        </div>
        <p className="text-[12px] text-gray-500">{BASE.role}{" \u00b7 "}{BASE.dept}</p>
        <p className="text-[11px] text-gray-500 mt-0.5" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{BASE.daysLeft}{"d left \u00b7 "}{BASE.coworkers}{" coworkers \u00b7 "}{qCount}{" Qs \u00b7 "}{BASE.gaps}{" gaps"}</p>
      </div>
    </div>
  );
}

function OverviewTab({ qCount, onSwitchTab }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Data collection complete</h3>
        <div className="grid grid-cols-4 gap-3 mb-4">
          <MC l="Boards" v={BASE.boards} /><MC l="Cards" v={BASE.cards} /><MC l="Areas" v={BASE.modules} /><MC l="Questions" v={qCount} />
        </div>
        <div className="pt-3 border-t border-gray-100 space-y-2">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Knowledge areas</p>
          <div className="flex flex-wrap gap-1.5">
            {["Test Automation Framework", "Bug Triage & Escalation", "Release Testing", "QA Infrastructure"].map(m => <span key={m} className="text-[11px] px-2 py-1 rounded-md bg-gray-50 border border-gray-200 text-gray-700">{m}</span>)}
          </div>
        </div>
        <div className="pt-3 mt-3 border-t border-gray-100 grid grid-cols-2 gap-3">
          <div><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">Coworker engagement</p><p className="text-[12px] text-gray-700">1 of 2 have joined</p></div>
          <div><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">Knowledge gaps</p><p className="text-[12px] text-yellow-700">{BASE.gaps}{" gaps (card-level)"}</p></div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={onSwitchTab} className="h-9 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">Review in Data tab</button>
        <button className="h-9 px-4 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium inline-flex items-center gap-2 cursor-pointer transition-colors">{"Start Capture"}<ArrowRight className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  );
}

function DataTab({ questions, onAdd, onEdit, onDelete }) {
  const [generalInput, setGeneralInput] = useState("");
  const handleGeneralAsk = () => { if (generalInput.trim()) { onAdd(generalInput, "General"); setGeneralInput(""); } };

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <input value={generalInput} onChange={e => setGeneralInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleGeneralAsk()} placeholder="Ask a general question..." className="flex-1 h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20" />
        <button onClick={handleGeneralAsk} className="h-9 px-3 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium cursor-pointer">Ask</button>
      </div>

      {questions.filter(q => q.module === "General").length > 0 && (
        <div className="rounded-lg border border-violet-200 bg-violet-50/20 mb-3 overflow-hidden">
          <div className="px-4 py-2.5 bg-violet-50/40 border-b border-violet-200 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-violet-500" />
            <span className="text-sm font-semibold text-gray-900">General questions</span>
            <span className="text-[11px] text-gray-500">{questions.filter(q => q.module === "General").length}</span>
          </div>
          {questions.filter(q => q.module === "General").map(q => <QuestionRow key={q.id} q={q} onEdit={onEdit} onDelete={onDelete} />)}
        </div>
      )}

      {MODULES_DATA.map((board, bi) => (
        <div key={bi} className="rounded-lg border border-gray-200 bg-white mb-3 overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-sm font-semibold text-gray-900">{board.board}</span>
            <span className="text-[11px] text-gray-500">{board.boardCards}c</span>
          </div>
          {board.modules.map((mod, mi) => <ModuleSection key={mi} mod={mod} questions={questions.filter(q => q.module === mod.name)} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} />)}
        </div>
      ))}
    </div>
  );
}

function QuestionRow({ q, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(q.text);
  const handleSave = () => { if (editText.trim()) { onEdit(q.id, editText.trim()); setEditing(false); } };
  const handleCancel = () => { setEditText(q.text); setEditing(false); };
  return (
    <div className="px-4 py-2.5 border-b border-violet-100 last:border-b-0 group">
      {editing ? (
        <div className="flex items-center gap-2">
          <input value={editText} onChange={e => setEditText(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") handleCancel(); }} className="flex-1 h-7 px-2 rounded border border-violet-300 text-[12px] focus:outline-none focus:ring-2 focus:ring-violet-500/20" autoFocus />
          <button onClick={handleSave} className="w-6 h-6 rounded bg-violet-600 text-white inline-flex items-center justify-center cursor-pointer hover:bg-violet-700"><Check className="w-3 h-3" /></button>
          <button onClick={handleCancel} className="w-6 h-6 rounded border border-gray-300 text-gray-500 inline-flex items-center justify-center cursor-pointer hover:bg-gray-50"><X className="w-3 h-3" /></button>
        </div>
      ) : (
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <div className="text-[12px] text-gray-900">{q.text}</div>
            <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
              {q.fromType === "ai" ? <Sparkles className="w-2.5 h-2.5 text-violet-500" /> : null}
              <span>{q.from}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 ml-1">{q.module}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button onClick={() => setEditing(true)} className="w-6 h-6 rounded hover:bg-gray-100 inline-flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer" title="Edit"><Pencil className="w-3 h-3" /></button>
            <button onClick={() => onDelete(q.id)} className="w-6 h-6 rounded hover:bg-rose-50 inline-flex items-center justify-center text-gray-400 hover:text-rose-600 cursor-pointer" title="Delete"><Trash2 className="w-3 h-3" /></button>
          </div>
        </div>
      )}
    </div>
  );
}

function ModuleSection({ mod, questions, onAdd, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [showModQ, setShowModQ] = useState(false);
  const [modInput, setModInput] = useState("");
  const totalGaps = mod.gaps + (mod.moduleGaps || []).length;
  const handleModAsk = () => { if (modInput.trim()) { onAdd(modInput, mod.name); setModInput(""); setShowModQ(false); } };

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button onClick={() => setExpanded(!expanded)} className="w-full px-4 py-2 flex items-center justify-between text-left hover:bg-gray-50 cursor-pointer">
        <div className="flex items-center gap-2">
          <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${expanded ? "" : "-rotate-90"}`} />
          <span className="text-[13px] font-medium text-gray-900">{mod.name}</span>
          <span className="text-[11px] text-gray-500">{mod.cards}c</span>
          {questions.length > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-50 text-violet-600 border border-violet-200">{questions.length}Qs</span>}
          {totalGaps > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-50 text-yellow-700 border border-yellow-200">{totalGaps}{" gap"}{totalGaps > 1 ? "s" : ""}</span>}
        </div>
        <span className="text-[10px] text-gray-400 hover:text-violet-600 cursor-pointer">Rename</span>
      </button>
      {expanded && <>
        {mod.moduleGaps && mod.moduleGaps.length > 0 && (
          <div className="px-4 py-2 pl-10 border-t border-gray-50 space-y-1">
            {mod.moduleGaps.map((g, gi) => <div key={gi} className="text-[10px] text-yellow-800 bg-yellow-50 border border-yellow-200 rounded-md px-2.5 py-1.5 flex items-start gap-1.5"><Sparkles className="w-3 h-3 shrink-0 mt-0.5 text-yellow-600" />{g}</div>)}
          </div>
        )}
        {mod.items && mod.items.map((card, ci) => (
          <div key={ci} className="w-full px-4 py-2 pl-10 flex items-center gap-2 text-left border-t border-gray-50 hover:bg-gray-50 cursor-pointer">
            <FileText className="w-3 h-3 text-gray-400 shrink-0" />
            <span className="text-[12px] text-gray-800 flex-1">{card.name}</span>
            {card.files && card.files.length > 0 && <span className="text-[8px] px-1 py-0.5 rounded bg-gray-50 text-gray-500">file</span>}
            {card.gaps && card.gaps.length > 0 && <span className="text-[8px] px-1 py-0.5 rounded bg-yellow-50 text-yellow-700">gap</span>}
          </div>
        ))}
        {questions.length > 0 && (
          <div className="px-4 py-2 pl-10 border-t border-gray-100 space-y-0">
            <p className="text-[9px] text-violet-600 uppercase tracking-wider font-medium mb-1">{"Questions ("}{questions.length}{")"}</p>
            {questions.map(q => <QuestionRow key={q.id} q={q} onEdit={onEdit} onDelete={onDelete} />)}
          </div>
        )}
        <div className="px-4 py-1.5 pl-10 border-t border-gray-50">
          <button onClick={e => { e.stopPropagation(); setShowModQ(!showModQ); }} className="text-[10px] text-violet-600 inline-flex items-center gap-1 hover:text-violet-700 cursor-pointer"><Plus className="w-2.5 h-2.5" />Ask about this module</button>
          {showModQ && <div className="flex gap-1.5 mt-1.5"><input value={modInput} onChange={e => setModInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleModAsk()} placeholder={`Question about ${mod.name}...`} className="flex-1 h-7 px-2 rounded border border-gray-200 text-[10px] focus:outline-none focus:ring-2 focus:ring-violet-500/20" /><button onClick={handleModAsk} className="h-7 px-2 rounded bg-violet-600 text-white text-[9px] cursor-pointer">Ask</button></div>}
        </div>
      </>}
    </div>
  );
}

function LogsTab() {
  return (
    <div className="space-y-2">
      {LOGS.map((log, i) => (
        <div key={i} className="rounded-md border border-gray-200 bg-white px-3 py-2" style={{ borderLeft: `2px solid ${i === 0 ? "rgb(234,179,8)" : "rgb(229,231,235)"}`, borderRadius: 0 }}>
          <div className="flex items-center justify-between mb-0.5 gap-2">
            <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{log.time}</span>
            <span className="text-[10px] text-gray-700 font-medium shrink-0">{log.actor}</span>
          </div>
          <div className="text-[11px] text-gray-900 leading-relaxed">{log.text}</div>
        </div>
      ))}
    </div>
  );
}
