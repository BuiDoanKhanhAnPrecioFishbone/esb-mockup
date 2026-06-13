"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, ArrowRight, X,
  CheckCircle2, Clock, AlertTriangle, Sparkles,
  Bell, Layers, User, Users, FileText,
  ChevronDown, Plus, Search, MessageCircle
} from "lucide-react";

/* ═══ Session Command View — CL-119/120/127 ═══
   Prepare phase with 3 roles (Manager, Offboarder, Coworker).
   Hero bar + tabs (Overview, Data, Logs).
   Data tab: Board→Module→Card accordion + Side Panel RIGHT DRAWER. */

const ROLES = [
  { id: "manager", label: "Hà Vy", sub: "Manager / HR", icon: "HV" },
  { id: "offboarder", label: "Minh Lê", sub: "Offboarder", icon: "ML" },
  { id: "coworker", label: "Coworker", sub: "Project peer", icon: "CW" },
];

const FLOW = [
  { id: "collecting", label: "Collecting data", trigger: "Crawl running — 3 boards being processed." },
  { id: "ready", label: "Ready for review", trigger: "Crawl done. 5 modules, 14 questions, 3 gaps." },
  { id: "capture-preview", label: "Capture (preview)", trigger: "After Manager clicks Start Capture — offboarder answering." },
];

const SESSION = {
  name: "Minh Lê", role: "Senior Backend Engineer", dept: "Engineering",
  initials: "ML", daysLeft: 30, deadline: "Jun 30, 2026",
  boards: 3, cards: 64, modules: 5, questions: 14, gaps: 3, coworkers: 3,
};

const MODULES_DATA = [
  { board: "Backend Services", boardCards: 34, modules: [
    { name: "Payment Service", cards: 12, qs: 4, gaps: 1, items: [
      { name: "Kafka retry configuration", desc: "Configures retry behavior for Kafka consumers when processing fails. Includes dead letter queue routing, backoff strategy, and poison message handling. Current config uses exponential backoff with max 5 retries.", checklist: [{ text: "DLQ routing configured", done: true }, { text: "Backoff strategy documented", done: false }, { text: "Alert on repeated failures", done: false }], gaps: ["Incomplete checklist — 2 of 3 items not done"], qs: [{ q: "How does the retry logic handle poison messages?", from: "AI-generated" }, { q: "What's the max retry count before DLQ routing?", from: "AI-generated" }] },
      { name: "Payment gateway timeout handling", desc: "Timeout configuration and fallback behavior for payment gateway calls. Uses circuit breaker pattern with 30s timeout.", checklist: [], gaps: [], qs: [{ q: "What happens when the gateway times out mid-transaction?", from: "AI-generated" }] },
      { name: "Stripe webhook handler", desc: "Processes Stripe webhook events for payment confirmations and refunds.", checklist: [], gaps: [], qs: [{ q: "Which webhook events are critical vs optional?", from: "Coworker" }] },
    ]},
    { name: "CI/CD Pipeline", cards: 8, qs: 3, gaps: 1, items: [
      { name: "Atlas migration rollback", desc: "MongoDB Atlas migration procedures and rollback steps.", checklist: [], gaps: ["Missing description detail"], qs: [{ q: "What's the rollback procedure for failed Atlas migrations?", from: "Hà Vy" }] },
    ]},
    { name: "Shared Libraries", cards: 6, qs: 2, gaps: 0, items: [
      { name: "API key rotation", desc: "Scheduled rotation of API keys across services. Runs every 90 days via GitHub Action.", checklist: [{ text: "Rotation schedule documented", done: true }, { text: "Auto-rotation configured", done: true }], gaps: [], qs: [{ q: "Where is the API key rotation runbook?", from: "AI-generated" }] },
    ]},
  ]},
  { board: "Platform Infrastructure", boardCards: 18, modules: [
    { name: "Monitoring & Alerts", cards: 10, qs: 3, gaps: 1, items: [] },
    { name: "Infrastructure as Code", cards: 8, qs: 2, gaps: 0, items: [] },
  ]},
];

export default function SessionCommandView({ embedded = false, view = "ready" } = {}) {
  const [role, setRole] = useState("manager");
  const [stepIdx, setStepIdx] = useState(() => { const i = FLOW.findIndex(s => s.id === view); return i >= 0 ? i : 1; });
  const step = FLOW[Math.min(stepIdx, FLOW.length - 1)];
  const handleRoleChange = (r) => { setRole(r); setStepIdx(role === "manager" ? stepIdx : Math.min(stepIdx, 1)); };
  if (embedded) { return (<div><RoleTabBar role={role} onChange={handleRoleChange} /><FlowBar step={step} stepIdx={Math.min(stepIdx, FLOW.length - 1)} onJump={setStepIdx} roleLabel={ROLES.find(r => r.id === role)?.sub} /><SessionPage role={role} stepId={step.id} /></div>); }
  return (<div className="min-h-screen bg-gray-50 flex flex-col text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}><TopBar /><RoleTabBar role={role} onChange={handleRoleChange} /><FlowBar step={step} stepIdx={Math.min(stepIdx, FLOW.length - 1)} onJump={setStepIdx} roleLabel={ROLES.find(r => r.id === role)?.sub} /><main className="flex-1"><SessionPage role={role} stepId={step.id} /></main><FooterNav stepIdx={Math.min(stepIdx, FLOW.length - 1)} total={FLOW.length} onChange={setStepIdx} trigger={step.trigger} /></div>);
}

function SessionPage({ role, stepId }) {
  const [activeTab, setActiveTab] = useState("overview");
  const phase = stepId === "capture-preview" ? "capture" : "prepare";
  const isReady = stepId === "ready" || stepId === "capture-preview";
  const tabs = [{ id: "overview", label: "Overview" }, { id: "data", label: "Data", disabled: role === "offboarder" && phase === "prepare" }, { id: "logs", label: "Logs", hidden: role === "coworker" }];
  return (<div className="max-w-5xl mx-auto p-6">
    <HeroBar phase={phase} stepId={stepId} />
    <div className="flex gap-0 border-b border-gray-200 mb-5">{tabs.filter(t => !t.hidden).map(t => (<button key={t.id} onClick={() => !t.disabled && setActiveTab(t.id)} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === t.id ? "border-violet-600 text-gray-900" : t.disabled ? "border-transparent text-gray-300 cursor-not-allowed" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>{t.label}</button>))}</div>
    {activeTab === "overview" && <OverviewContent role={role} stepId={stepId} isReady={isReady} />}
    {activeTab === "data" && <DataContent role={role} stepId={stepId} isReady={isReady} />}
    {activeTab === "logs" && <LogsContent role={role} stepId={stepId} />}
  </div>);
}

function HeroBar({ phase }) {
  const s = SESSION;
  const phaseLabel = phase === "prepare" ? "Prepare" : phase === "capture" ? "Capture" : "Deliver";
  const phaseCls = phase === "prepare" ? "bg-blue-50 border-blue-200 text-blue-700" : phase === "capture" ? "bg-violet-50 border-violet-200 text-violet-700" : "bg-emerald-50 border-emerald-200 text-emerald-700";
  const metrics = phase === "prepare" ? `${s.coworkers} coworkers · ${s.questions} questions · ${s.gaps} gaps` : `9 of 14 answered · 7 satisfied · 2 gaps open`;
  return (<div className="rounded-lg border border-gray-200 bg-white p-4 mb-5 flex items-center gap-4">
    <div className="w-12 h-12 rounded-full bg-violet-100 text-violet-700 text-sm font-semibold inline-flex items-center justify-center shrink-0">{s.initials}</div>
    <div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-0.5"><h1 className="text-lg font-semibold text-gray-900">{s.name}&apos;s session</h1><span className={`text-[9px] px-2 py-0.5 rounded uppercase tracking-wider font-semibold border ${phaseCls}`}>{phaseLabel}</span></div><p className="text-[12px] text-gray-500">{s.role} · {s.dept}</p><p className="text-[11px] text-gray-500 mt-0.5" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{s.daysLeft} days left · Deadline {s.deadline} · {metrics}</p></div>
  </div>);
}

function OverviewContent({ role, stepId, isReady }) { if (role === "offboarder") return <OffboarderOverview stepId={stepId} />; if (role === "coworker") return <CoworkerOverview isReady={isReady} />; return <ManagerOverview stepId={stepId} isReady={isReady} />; }

function ManagerOverview({ stepId, isReady }) {
  if (!isReady) return (<div className="rounded-lg border border-gray-200 bg-white p-6 text-center"><div className="w-10 h-10 rounded-full bg-violet-50 inline-flex items-center justify-center mb-3 mx-auto"><div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-violet-500 animate-spin" /></div><h3 className="text-sm font-medium text-gray-900 mb-1">Collecting data from {SESSION.boards} boards...</h3><p className="text-xs text-gray-500">This takes a few minutes. You can leave and come back — we&apos;ll notify you when it&apos;s ready.</p></div>);
  if (stepId === "capture-preview") return (<div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4"><div className="flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /><h3 className="text-sm font-semibold text-gray-900">Capture is active</h3></div><p className="text-xs text-gray-500">Minh Lê has been notified and can start answering questions. Coworkers can still add new questions.</p></div>);
  return (<div className="space-y-4">
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Data collection complete</h3>
      <div className="grid grid-cols-4 gap-3 mb-4"><MetricCard label="Boards processed" value={SESSION.boards} /><MetricCard label="Cards eligible" value={SESSION.cards} /><MetricCard label="Knowledge areas" value={SESSION.modules} /><MetricCard label="Questions generated" value={SESSION.questions} /></div>
      <div className="pt-3 border-t border-gray-100 space-y-2">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Knowledge areas found</p>
        <div className="flex flex-wrap gap-1.5">{["Payment Service", "CI/CD Pipeline", "Shared Libraries", "Monitoring & Alerts", "Infrastructure as Code"].map(m => (<span key={m} className="text-[11px] px-2 py-1 rounded-md bg-gray-50 border border-gray-200 text-gray-700">{m}</span>))}</div>
      </div>
      <div className="pt-3 mt-3 border-t border-gray-100 grid grid-cols-2 gap-3">
        <div><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">Coworker engagement</p><p className="text-[12px] text-gray-700">2 of 3 coworkers have asked questions</p><p className="text-[11px] text-gray-500">1 coworker hasn&apos;t engaged yet</p></div>
        <div><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">Knowledge gaps</p><p className="text-[12px] text-gray-700">3 gaps detected</p><p className="text-[11px] text-gray-500">1 incomplete checklist · 2 missing descriptions</p></div>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <button className="h-9 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Review in Data tab</button>
      <Link href="/session/minh-le" className="h-9 px-4 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium inline-flex items-center gap-2 transition-colors">Start Capture<ArrowRight className="w-3.5 h-3.5" /></Link>
    </div>
    <p className="text-[10px] text-gray-400">Coworkers have been notified and can add questions. You can review the Data tab before starting Capture.</p>
  </div>);
}

function OffboarderOverview({ stepId }) {
  if (stepId === "capture-preview") return (<div className="rounded-lg border border-violet-200 bg-violet-50/30 p-4"><div className="flex items-center gap-2 mb-1"><Sparkles className="w-4 h-4 text-violet-600" /><h3 className="text-sm font-semibold text-gray-900">Your question queue is ready</h3></div><p className="text-xs text-gray-500">14 questions waiting for your answers. Open the Data tab to start answering.</p><Link href="/session/minh-le?tab=data" className="mt-3 h-8 px-4 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors">Open question queue<ArrowRight className="w-3 h-3" /></Link></div>);
  return (<div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center"><div className="w-12 h-12 rounded-full bg-gray-100 inline-flex items-center justify-center mb-3 mx-auto"><Clock className="w-5 h-5 text-gray-400" strokeWidth={1.5} /></div><h3 className="text-sm font-medium text-gray-700 mb-1">Your session is being prepared</h3><p className="text-xs text-gray-500">You&apos;ll be notified when your question queue is ready.</p></div>);
}

function CoworkerOverview({ isReady }) {
  if (!isReady) return (<div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center"><div className="w-12 h-12 rounded-full bg-gray-100 inline-flex items-center justify-center mb-3 mx-auto"><Clock className="w-5 h-5 text-gray-400" strokeWidth={1.5} /></div><h3 className="text-sm font-medium text-gray-700 mb-1">Session is being set up</h3><p className="text-xs text-gray-500">You&apos;ll be notified when you can browse and ask questions.</p></div>);
  return (<div className="rounded-lg border border-gray-200 bg-white p-5"><h3 className="text-sm font-semibold text-gray-900 mb-1">Minh Lê is leaving soon</h3><p className="text-xs text-gray-500 mb-3">Browse their knowledge areas in the Data tab and ask questions about what you&apos;ll need after they&apos;re gone. Questions can be added anytime, even after Capture starts.</p><button className="h-8 px-4 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors">Browse Data tab<ArrowRight className="w-3 h-3" /></button></div>);
}

function DataContent({ role, stepId, isReady }) {
  const [selectedCard, setSelectedCard] = useState(null);
  if (role === "offboarder" && stepId !== "capture-preview") return (<div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center"><h3 className="text-sm font-medium text-gray-700 mb-1">Questions are being collected</h3><p className="text-xs text-gray-500">You&apos;ll be able to answer them once Capture starts.</p></div>);
  if (!isReady) return (<div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center"><div className="w-10 h-10 rounded-full bg-violet-50 inline-flex items-center justify-center mb-3 mx-auto"><div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-violet-500 animate-spin" /></div><h3 className="text-sm font-medium text-gray-700 mb-1">Data is being collected...</h3><p className="text-xs text-gray-500">The accordion will appear here when the crawl finishes.</p></div>);
  return (<div className="relative">
    <div>
      <div className="mb-4 flex items-center gap-2"><input placeholder="Ask a general question not tied to a specific card..." className="flex-1 h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400" /><button className="h-9 px-3 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium transition-colors">Ask</button></div>
      {MODULES_DATA.map((board, bi) => (<div key={bi} className="rounded-lg border border-gray-200 bg-white mb-3 overflow-hidden"><div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center gap-2"><Layers className="w-3.5 h-3.5 text-gray-400" /><span className="text-sm font-semibold text-gray-900">{board.board}</span><span className="text-[11px] text-gray-500">{board.boardCards} cards</span></div>{board.modules.map((mod, mi) => (<ModuleSection key={mi} mod={mod} role={role} selectedCard={selectedCard} onSelectCard={setSelectedCard} />))}</div>))}
    </div>
    {selectedCard && <><div className="fixed inset-0 bg-black/10 z-30" onClick={() => setSelectedCard(null)} /><div className="fixed top-0 right-0 h-full w-[480px] bg-white border-l border-gray-200 shadow-xl z-40 overflow-y-auto"><SidePanel card={selectedCard} role={role} onClose={() => setSelectedCard(null)} isCapture={stepId === "capture-preview"} /></div></>}
  </div>);
}

function ModuleSection({ mod, role, selectedCard, onSelectCard }) {
  const [expanded, setExpanded] = useState(true);
  return (<div className="border-b border-gray-100 last:border-b-0">
    <button onClick={() => setExpanded(!expanded)} className="w-full px-4 py-2 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"><div className="flex items-center gap-2"><ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${expanded ? "" : "-rotate-90"}`} /><span className="text-[13px] font-medium text-gray-900">{mod.name}</span><span className="text-[11px] text-gray-500">{mod.cards} cards</span>{mod.qs > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-50 text-violet-600 border border-violet-200">{mod.qs} Qs</span>}{mod.gaps > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-50 text-yellow-700 border border-yellow-200">{mod.gaps} gap</span>}</div>{role === "manager" && <span className="text-[10px] text-gray-400 hover:text-violet-600">Rename</span>}</button>
    {expanded && mod.items && mod.items.map((card, ci) => { const isSel = selectedCard?.name === card.name; return (<button key={ci} onClick={() => onSelectCard(card)} className={`w-full px-4 py-2 pl-10 flex items-center gap-2 text-left border-t border-gray-50 transition-colors ${isSel ? "bg-violet-50 border-l-2 border-l-violet-500" : "hover:bg-gray-50"}`}><FileText className="w-3 h-3 text-gray-400 shrink-0" /><span className="text-[12px] text-gray-800 flex-1">{card.name}</span>{card.gaps.length > 0 && <span className="text-[8px] px-1 py-0.5 rounded bg-yellow-50 text-yellow-700">gap</span>}{card.qs.length > 0 && <span className="text-[8px] px-1 py-0.5 rounded bg-violet-50 text-violet-600">{card.qs.length} Q</span>}</button>); })}
    {expanded && (!mod.items || mod.items.length === 0) && (<div className="px-4 py-2 pl-10 text-[11px] text-gray-400 border-t border-gray-50">{mod.cards} cards — click to expand in full build</div>)}
  </div>);
}

function SidePanel({ card, role, onClose, isCapture }) {
  const [followUp, setFollowUp] = useState("");
  return (<div className="p-5">
    <div className="flex items-center justify-between mb-3"><h3 className="text-[15px] font-semibold text-gray-900">{card.name}</h3><button onClick={onClose} className="w-7 h-7 rounded-md hover:bg-gray-100 inline-flex items-center justify-center text-gray-400"><X className="w-4 h-4" /></button></div>
    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-3 mb-1 pt-2 border-t border-gray-100">Description</p>
    <p className="text-[11px] text-gray-700 leading-relaxed mb-2">{card.desc}</p>
    {card.checklist.length > 0 && (<><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-3 mb-1 pt-2 border-t border-gray-100">Checklist</p>{card.checklist.map((c, i) => (<div key={i} className="flex items-center gap-1.5 text-[11px] py-0.5">{c.done ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <div className="w-3 h-3 rounded border border-gray-300" />}<span className={c.done ? "text-gray-500 line-through" : "text-gray-700"}>{c.text}</span></div>))}</>)}
    {card.gaps.length > 0 && (<><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-3 mb-1 pt-2 border-t border-gray-100">Knowledge gaps ({card.gaps.length})</p>{card.gaps.map((g, i) => (<div key={i} className="text-[10px] text-yellow-800 bg-yellow-50 border border-yellow-200 rounded-md px-2.5 py-1.5 mb-1 flex items-start gap-1.5"><AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />{g}</div>))}</>)}
    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-3 mb-1 pt-2 border-t border-gray-100">Questions ({card.qs.length})</p>
    {card.qs.map((q, i) => (<div key={i} className="text-[11px] bg-gray-50 rounded-md px-2.5 py-2 mb-1.5"><p className="text-gray-900 mb-0.5">{q.q}</p><p className="text-[10px] text-gray-500 flex items-center gap-1">{q.from === "AI-generated" ? <><Sparkles className="w-2.5 h-2.5 text-violet-500" />{q.from}</> : <><User className="w-2.5 h-2.5" />{q.from}</>}</p>{isCapture && role === "offboarder" && (<div className="mt-2 pt-2 border-t border-gray-200"><textarea placeholder="Type your answer..." className="w-full h-16 px-2 py-1.5 rounded border border-gray-200 text-[11px] resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/20" /><button className="mt-1 h-6 px-2 rounded bg-violet-600 text-white text-[10px]">Submit answer</button></div>)}</div>))}
    {role !== "offboarder" && (<><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-3 mb-1 pt-2 border-t border-gray-100">Ask a question</p><div className="flex gap-1.5"><input value={followUp} onChange={e => setFollowUp(e.target.value)} placeholder="Type your question..." className="flex-1 h-8 px-2.5 rounded-md border border-gray-200 text-[11px] focus:outline-none focus:ring-2 focus:ring-violet-500/20" /><button className="h-8 px-2.5 rounded-md bg-violet-600 text-white text-[10px] font-medium">Ask</button></div><p className="text-[9px] text-gray-400 mt-1">Added to Minh Lê&apos;s question queue</p></>)}
  </div>);
}

function LogsContent({ role, stepId }) {
  if (stepId === "collecting") return <div className="text-center py-8 text-sm text-gray-500">No activity yet</div>;
  const logs = [
    { ts: "10:32 AM", type: "system", text: "Crawl complete — 3 boards, 64 eligible cards, 5 modules derived" },
    { ts: "10:31 AM", type: "system", text: "Board: API Gateway — 31 cards scanned, 12 eligible" },
    { ts: "10:29 AM", type: "system", text: "Board: Platform Infrastructure — 42 cards scanned, 18 eligible" },
    { ts: "10:25 AM", type: "system", text: "Board: Backend Services — 89 cards scanned, 34 eligible" },
    { ts: "10:24 AM", type: "system", text: "Crawl started — 3 boards selected" },
    { ts: "10:24 AM", type: "system", text: "Session created by Hà Vy" },
  ];
  return (<div className="space-y-1.5"><div className="flex gap-2 mb-3">{["All", "System", "Questions", "Files", "Edits"].map(f => (<button key={f} className={`px-2.5 py-1 rounded-md text-[11px] ${f === "All" ? "bg-violet-50 text-violet-700 font-medium" : "text-gray-500 hover:bg-gray-100"}`}>{f}</button>))}</div>{logs.map((l, i) => (<div key={i} className="flex items-start gap-3 px-3 py-2 rounded-md border border-gray-200 bg-white"><span className="text-[10px] text-gray-500 shrink-0 mt-0.5" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{l.ts}</span><span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 uppercase tracking-wider font-medium shrink-0">{l.type}</span><span className="text-[11px] text-gray-900">{l.text}</span></div>))}</div>);
}

function MetricCard({ label, value }) { return (<div className="rounded-md bg-gray-50 border border-gray-200 px-3 py-2"><div className="text-[9px] text-gray-500 uppercase tracking-wider font-medium">{label}</div><div className="text-lg font-semibold text-gray-900 mt-0.5" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{value}</div></div>); }

function RoleTabBar({ role, onChange }) { return (<div className="bg-white border-b border-gray-200 px-5 overflow-x-auto"><div className="flex gap-0 min-w-0">{ROLES.map(r => (<button key={r.id} onClick={() => onChange(r.id)} className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-colors shrink-0 focus:outline-none ${role === r.id ? "border-violet-600 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"}`}><div className={`w-6 h-6 rounded-full text-[9px] font-semibold inline-flex items-center justify-center ${role === r.id ? "bg-violet-100 text-violet-700" : "bg-gray-100 text-gray-500"}`}>{r.icon}</div><div className="text-left"><div className="text-[12px] font-medium leading-tight">{r.label}</div><div className="text-[10px] text-gray-500 leading-tight">{r.sub}</div></div></button>))}</div></div>); }
function FlowBar({ step, stepIdx, onJump, roleLabel }) { return (<div className="bg-white border-b border-gray-200 px-5 py-2 flex items-center justify-between gap-4"><div className="min-w-0 flex-1"><div className="flex items-center gap-2 text-[11px] text-gray-500"><span className="uppercase tracking-wider font-semibold text-violet-700">{roleLabel}</span><span className="text-gray-300">·</span><span style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>step {stepIdx + 1} of {FLOW.length}</span></div><h1 className="text-sm font-semibold text-gray-900 truncate mt-0.5">{step.label}</h1></div><div className="flex items-center gap-1 shrink-0">{FLOW.map((s, i) => (<button key={s.id} onClick={() => onJump(i)} title={s.label} className={`w-7 h-7 rounded-md border text-[11px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${i === stepIdx ? "bg-violet-600 text-white border-violet-600" : "bg-white text-violet-700 border-violet-200 hover:border-violet-400"}`} style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{i + 1}</button>))}</div></div>); }
function TopBar() { return (<header className="bg-white border-b border-gray-200 px-5 py-2.5 flex items-center justify-between gap-4"><div className="flex items-center gap-2 shrink-0"><div className="w-1.5 h-1.5 bg-violet-500 rounded-full" /><span className="text-gray-900 font-semibold tracking-[0.18em] text-xs" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>ART-EEP</span></div><div className="flex items-center gap-3"><button className="h-8 w-8 rounded-md hover:bg-gray-100 inline-flex items-center justify-center text-gray-500 relative"><Bell className="w-3.5 h-3.5" strokeWidth={1.75} /><span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500" /></button><div className="flex items-center gap-2 pl-2 border-l border-gray-200"><div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 text-[11px] font-semibold inline-flex items-center justify-center">HV</div><div className="text-[11px]"><div className="font-medium text-gray-900 leading-tight">Hà Vy</div><div className="text-gray-500 leading-tight">Manager · Engineering</div></div></div></div></header>); }
function FooterNav({ stepIdx, total, onChange, trigger }) { const atFirst = stepIdx === 0, atLast = stepIdx === total - 1; return (<footer className="bg-white border-t border-gray-200 px-5 py-2.5 flex items-center justify-between sticky bottom-0 z-20"><button onClick={() => !atFirst && onChange(stepIdx - 1)} disabled={atFirst} className={`h-8 px-3 rounded-md text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${atFirst ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}><ChevronLeft className="w-3.5 h-3.5" />Previous</button><div className="hidden sm:block text-[11px] text-gray-500 max-w-md text-center truncate px-3">{trigger}</div><button onClick={() => !atLast && onChange(stepIdx + 1)} disabled={atLast} className={`h-8 px-3 rounded-md text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30 ${atLast ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-700 text-white"}`}>Next<ChevronRight className="w-3.5 h-3.5" /></button></footer>); }
