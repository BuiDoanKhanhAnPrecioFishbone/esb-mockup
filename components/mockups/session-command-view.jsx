"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, ArrowUpRight, X, CheckCircle2, Clock, AlertTriangle, Sparkles, Bell, Layers, User, FileText, ChevronDown, Plus, MessageCircle, Paperclip, Pencil, Trash2, Check, GripVertical, HelpCircle, Inbox, ExternalLink, Mic, Pause, SkipForward, RotateCcw, Zap, MoreHorizontal, Circle, Package, MessageSquare, Database } from "lucide-react";
import { DeliverOverview, CompleteOverview } from "./session-deliver";
import { useViewAs } from "@/lib/view-as";
import { tabVisibility } from "@/lib/view-matrix";
import { SESSION, MODULES_DATA, UNCATEGORIZED, CLASSIFY, OB_QUEUE, SEED_COWORKERS, SEED_GQ } from "@/lib/data";

/* Session Command View — CL-119/120/127/128/129
   Prepare + Capture + Deliver + Complete · 3 roles
   Questions functional in Prepare: add + inline edit + delete.
   Module headers: Rename only (functional inline edit). No upload in POC.
   Coworker network in Overview tab. */

const ROLES = [
  { id: "manager", label: "H\u00e0 Vy", sub: "Manager / HR", icon: "HV" },
  { id: "offboarder", label: "Minh L\u00ea", sub: "Offboarder", icon: "ML" },
  { id: "coworker", label: "Coworker", sub: "Project peer", icon: "CW" },
];
const FLOW = [
  { id: "collecting", label: "Collecting data", trigger: `Crawl running \u2014 ${SESSION.boards} boards.` },
  { id: "ready", label: "Ready for review", trigger: `${SESSION.modules} modules, ${SESSION.questions} questions, ${SESSION.gaps} gaps.` },
  { id: "capture", label: "Capture (active)", trigger: `${SESSION.answered} of ${SESSION.questions} answered, ${SESSION.satisfied} accepted.` },
  { id: "deliver", label: "Deliver (review)", trigger: "Manager reviewing before KG commit." },
  { id: "complete", label: "Complete", trigger: "Committed to Knowledge Graph." },
];

let qId = 200;
// "Detects" — MECHANICAL, card-level metadata checks (orange, dismissable, informational). Distinct from module-level gaps. §4.1.
function cardFlags(card) {
  const f = [];
  if (!card.desc || !card.desc.trim()) f.push("no description");
  if (card.checklist && card.checklist.length) { const d = card.checklist.filter(c=>c.done).length; if (d < card.checklist.length) f.push(`checklist ${d}/${card.checklist.length}`); }
  if (card.stale) f.push("stale (90d)");
  return f;
}
// CD-02 — status reflects the MANUAL questions shown on the card (RF-04): green = all answered + accepted,
// amber = has questions with some unanswered/unaccepted, gray = no questions.
function cardStatus(c) { const m=(c.qs||[]).filter(q=>q.fromType!=="ai"&&q.from!=="AI-generated"); if (m.length===0) return "none"; return m.every(q=>q.answer&&q.satisfiedBy)?"done":"pending"; }
// CR-04 — count MANUAL questions only (matches the card detail); answered = answered AND accepted.
export function modProgress(m) { if (!m.items) return {total:m.qs||0,answered:0}; let t=0,a=0; m.items.forEach(c=>(c.qs||[]).forEach(q=>{ if(q.fromType==="ai"||q.from==="AI-generated") return; t++; if(q.answer&&q.satisfiedBy) a++; })); return {total:t,answered:a}; }

export default function SessionCommandView({ embedded = false, view = "ready", role: roleProp, step: stepProp, tab: tabProp, chrome = true } = {}) {
  const { role: ctxRole, state: ctxState } = useViewAs();
  const pinned = !!roleProp;
  const activeRole = pinned ? roleProp : ctxRole;
  const wantStep = pinned ? (stepProp || view) : (ctxState || stepProp || view);
  const i = FLOW.findIndex(s=>s.id===wantStep);
  const step = FLOW[i>=0?i:1];
  return <SessionPage role={activeRole} stepId={step.id} initialTab={tabProp}/>;
}

function SessionPage({ role, stepId, initialTab }) {
  const [activeTab, setActiveTab] = useState(initialTab || "overview");
  const [generalQs, setGeneralQs] = useState(SEED_GQ);
  const [addedModQs, setAddedModQs] = useState([]);
  const [focusQ, setFocusQ] = useState(null);
  const [focusKey, setFocusKey] = useState(0);
  const openQuestion = (id) => { setFocusQ(id); setFocusKey((k) => k + 1); setActiveTab("data"); };
  const phase = stepId==="capture"?"capture":stepId==="deliver"||stepId==="complete"?"deliver":"prepare";
  const isPrepare = phase==="prepare";
  const isReady = stepId!=="collecting";
  const canEditQs = role!=="offboarder" && phase!=="deliver"; // CR-01 — manual-question edit/remove in Prepare + Capture
  // §1.4 — tab availability comes from the shared view-matrix (single source of truth).
  const tabTip = stepId==="collecting" ? "Available after data collection" : "Available once your session is active";
  const tabs = [{id:"overview",label:"Overview"},{id:"data",label:"Data"},{id:"logs",label:"Logs"}].map(t=>{const v=tabVisibility(role,stepId,t.id);return {...t, hidden:v==="hidden", disabled:v==="disabled", tip:tabTip};});
  const tabAllowed = (id) => { const t=tabs.find(x=>x.id===id); return !!t && !t.hidden && !t.disabled; };
  const shownTab = tabAllowed(activeTab) ? activeTab : "overview";
  const addGQ = (text) => { if (!text.trim()) return; setGeneralQs(prev => [...prev, { id: `gq${++qId}`, q: text.trim(), from: "H\u00e0 Vy", fromType: "human" }]); };
  const editGQ = (id, text) => { setGeneralQs(prev => prev.map(q => q.id === id ? { ...q, q: text } : q)); };
  const deleteGQ = (id) => { setGeneralQs(prev => prev.filter(q => q.id !== id)); };
  const addModQ = (text, modName) => { if (!text.trim()) return; setAddedModQs(prev => [...prev, { id: `mq${++qId}`, q: text.trim(), from: "H\u00e0 Vy", fromType: "human", module: modName }]); };
  const editModQ = (id, text) => { setAddedModQs(prev => prev.map(q => q.id === id ? { ...q, q: text } : q)); };
  const deleteModQ = (id) => { setAddedModQs(prev => prev.filter(q => q.id !== id)); };
  const [coworkers, setCoworkers] = useState(SEED_COWORKERS);
  const addCoworker = (name) => { if (!name.trim()) return; const initials = name.trim().split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(); setCoworkers(prev => [...prev, { id: `cw${Date.now()}`, name: name.trim(), initials, modules: [], sharedCards: 0, source: "manual", status: "pending" }]); };
  const removeCoworker = (id) => { setCoworkers(prev => prev.filter(cw => cw.id !== id)); };
  return <div className="max-w-5xl mx-auto p-6"><HeroBar phase={phase} stepId={stepId} role={role}/><div className="flex gap-0 border-b border-gray-200 mb-5">{tabs.filter(t=>!t.hidden).map(t=><button key={t.id} onClick={()=>!t.disabled&&setActiveTab(t.id)} title={t.disabled?t.tip:undefined} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${shownTab===t.id?"border-violet-600 text-gray-900":t.disabled?"border-transparent text-gray-300 cursor-not-allowed":"border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer"}`}>{t.label}</button>)}</div>{shownTab==="overview"&&<OverviewContent role={role} stepId={stepId} isReady={isReady} onSwitchTab={setActiveTab} onOpenQuestion={openQuestion} coworkers={coworkers} onAddCoworker={addCoworker} onRemoveCoworker={removeCoworker}/>}{shownTab==="data"&&<DataContent role={role} stepId={stepId} isReady={isReady} canEditQs={canEditQs} generalQs={generalQs} addedModQs={addedModQs} onAddGQ={addGQ} onEditGQ={editGQ} onDeleteGQ={deleteGQ} onAddModQ={addModQ} onEditModQ={editModQ} onDeleteModQ={deleteModQ} focusQ={focusQ} focusKey={focusKey}/>}{shownTab==="logs"&&<LogsContent role={role} stepId={stepId}/>}</div>;
}

// SA-01 — session actions "..." menu (Manager only), lives in the session header. Holds Cancel session.
// SA-01 / UR-03 — session actions "..." menu (Manager only, hidden on Complete). Holds ALL backward
// navigation (Back to Prepare/Capture, phase-dependent) plus Cancel session. Forward actions live in the stepper.
// SA-01 / OV-07 — session actions "..." menu (Manager only, hidden on Complete): ONLY Cancel session.
// Backward nav is not here — Back to Capture is a visible button in the Deliver stepper column (OV-06);
// Back to Prepare was removed entirely (OV-07).
function SessionActionsMenu() {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  return <div className="relative shrink-0">
    <button onClick={()=>setOpen(o=>!o)} onBlur={()=>setTimeout(()=>setOpen(false),150)} title="Session actions" className="w-8 h-8 rounded-md hover:bg-gray-100 inline-flex items-center justify-center text-gray-500 cursor-pointer"><MoreHorizontal className="w-5 h-5"/></button>
    {open&&<div className="absolute right-0 top-full mt-1 z-30 w-44 rounded-md border border-gray-200 bg-white shadow-lg py-1"><button onMouseDown={e=>e.preventDefault()} onClick={()=>{setOpen(false);setConfirm(true);}} className="w-full text-left px-3 py-1.5 text-[12px] text-rose-600 hover:bg-rose-50 cursor-pointer">Cancel session</button></div>}
    {confirm&&<div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={()=>setConfirm(false)}><div className="bg-white rounded-xl shadow-xl p-6 w-[400px] border border-gray-200" onClick={e=>e.stopPropagation()}><h3 className="text-base font-semibold mb-2 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-rose-500"/>Cancel this session?</h3><p className="text-[12px] text-gray-500 mb-4">{"All collected data will be archived. Minh Lê and all participants will be notified. This cannot be undone."}</p><div className="flex gap-2 justify-end"><button onClick={()=>setConfirm(false)} className="h-8 px-3 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">Keep session</button><button onClick={()=>{setCancelled(true);setConfirm(false);}} className="h-8 px-3 rounded-md bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 cursor-pointer">Cancel session</button></div></div></div>}
    {cancelled&&<div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-lg bg-gray-900 text-white text-[12px] px-4 py-2.5 shadow-lg flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400"/>Session cancelled — data archived and participants notified.</div>}
  </div>;
}

// OV-05 + UI-01 — VERTICAL 3-step stepper for the left column of the Overview 2-col layout.
// 16px circles, labels beside each, CTA button(s) stacked at the bottom (`cta` may be one or two buttons).
// CS-05 — premium vertical stepper: 32px gradient icon nodes, gradient/dashed connectors, dynamic
// per-state sub-captions, and a violet-tinted gradient column background. CTA(s) passed via `cta`.
function PhaseHero({ phase, cta }) {
  const activeIdx = phase==="complete" ? 3 : ["prepare","capture","deliver"].indexOf(phase);
  const steps = [
    { id:"prepare", label:"Prepare", Icon:Package,       done:`${SESSION.cards} cards · ${SESSION.modules} modules`,          active:"Classifying cards",  upcoming:"" },
    { id:"capture", label:"Capture", Icon:MessageSquare, done:`${SESSION.questions} answered · ${SESSION.satisfied} accepted`, active:`${SESSION.answered} of ${SESSION.questions} answered`, upcoming:"Questions and answers" },
    { id:"deliver", label:"Deliver", Icon:Database,      done:"",                                                            active:"Review and commit",  upcoming:"Validate and commit" },
  ];
  const stateOf = (i) => i<activeIdx ? "done" : i===activeIdx ? "active" : "upcoming";
  const node = (st, Icon) => st==="done"
    ? <div className="w-8 h-8 rounded-full inline-flex items-center justify-center shrink-0" style={{background:"linear-gradient(135deg,#34d399,#059669)",boxShadow:"0 2px 6px rgba(5,150,105,0.15)"}}><Check className="w-3.5 h-3.5 text-white"/></div>
    : st==="active"
    ? <div className="w-8 h-8 rounded-full inline-flex items-center justify-center shrink-0" style={{background:"linear-gradient(135deg,#818cf8,#7c3aed)",boxShadow:"0 0 0 4px rgba(124,58,237,0.12), 0 2px 8px rgba(124,58,237,0.2)"}}><Icon className="w-3.5 h-3.5 text-white"/></div>
    : <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 inline-flex items-center justify-center shrink-0"><Icon className="w-3.5 h-3.5 text-gray-300"/></div>;
  const conn = (from, to) => from==="done"&&to==="done"
    ? <div className="ml-[15px] h-5 w-0.5" style={{background:"#059669"}}/>
    : from==="done"&&to==="active"
    ? <div className="ml-[15px] h-5 w-0.5" style={{background:"linear-gradient(180deg,#059669,#c4b5fd)"}}/>
    : from==="active"
    ? <div className="ml-[15px] h-5 border-l-2 border-dashed" style={{borderColor:"#c4b5fd"}}/>
    : <div className="ml-[15px] h-5 border-l-2 border-dashed" style={{borderColor:"#e5e7eb"}}/>;
  return <div className="rounded-lg p-4" style={{background:"linear-gradient(180deg, #f5f3ff 0%, transparent 100%)", border:"1px solid #ede9fe"}}>
    <div className="flex flex-col">{steps.map((s,i)=>{
      const st = stateOf(i);
      const labelCls = st==="done"?"text-[11px] font-medium text-emerald-700":st==="active"?"text-[12px] font-semibold text-violet-800":"text-[11px] font-medium text-gray-400";
      const capCls = st==="done"?"text-gray-500":st==="active"?"text-violet-600":"text-gray-300";
      const cap = st==="done"?s.done:st==="active"?s.active:s.upcoming;
      return <React.Fragment key={s.id}>
        <div className="flex items-center gap-2.5">{node(st,s.Icon)}<div className="min-w-0"><div className={labelCls}>{s.label}</div>{cap&&<div className={`text-[9px] ${capCls}`}>{cap}</div>}</div></div>
        {i<steps.length-1&&conn(st, stateOf(i+1))}
      </React.Fragment>;
    })}</div>
    {cta&&<div className="flex flex-col gap-2 mt-4">{cta}</div>}
  </div>;
}

function HeroBar({ phase, stepId, role }) {
  const cls = {prepare:"bg-blue-50 border-blue-200 text-blue-700",capture:"bg-violet-50 border-violet-200 text-violet-700",deliver:"bg-emerald-50 border-emerald-200 text-emerald-700"};
  const label = stepId==="complete"?"Complete":phase==="prepare"?"Prepare":phase==="capture"?"Capture":"Deliver";
  const metrics = phase==="prepare"?`${SESSION.coworkers} coworkers · ${SESSION.questions} Qs · ${SESSION.gaps} gaps`:phase==="capture"?`${SESSION.answered}/${SESSION.questions} answered · ${SESSION.satisfied} accepted`:stepId==="complete"?`${SESSION.answered} committed · ${SESSION.files} files`:`${SESSION.answered}/${SESSION.questions} answered · reviewing`;
  return <div className="rounded-lg border border-gray-200 bg-white p-4 mb-5 flex items-center gap-4"><div className={`w-12 h-12 rounded-full ${stepId==="complete"?"bg-emerald-100 text-emerald-700":"bg-violet-100 text-violet-700"} text-sm font-semibold inline-flex items-center justify-center shrink-0`}>{stepId==="complete"?<CheckCircle2 className="w-5 h-5"/>:SESSION.initials}</div><div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-0.5"><h1 className="text-lg font-semibold text-gray-900">{SESSION.name}&apos;s session</h1><span className={`text-[9px] px-2 py-0.5 rounded uppercase tracking-wider font-semibold border ${cls[phase]}`}>{label}</span></div><p className="text-[12px] text-gray-500">{SESSION.role}{" · "}{SESSION.dept}</p><p className="text-[11px] text-gray-500 mt-0.5" style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{stepId!=="complete"?`${SESSION.daysLeft}d left · `:""}{metrics}</p></div>{role==="manager"&&stepId!=="complete"&&<SessionActionsMenu/>}</div>;
}

function OverviewContent({ role, stepId, isReady, onSwitchTab, onOpenQuestion, coworkers, onAddCoworker, onRemoveCoworker }) {
  if (stepId==="complete") return <CompleteOverview role={role} S={SESSION} MC={MC} PhaseHero={PhaseHero}/>;
  if (stepId==="deliver") return <DeliverOverview role={role} onSwitchTab={onSwitchTab} S={SESSION} MD={MODULES_DATA} modProgress={modProgress} MC={MC} ProgressBar={ProgressBar} PhaseHero={PhaseHero}/>;
  if (role==="offboarder") return <OffboarderOverview stepId={stepId} onSwitchTab={onSwitchTab} onOpenQuestion={onOpenQuestion}/>;
  if (role==="coworker") return <CoworkerOverview stepId={stepId} isReady={isReady} onSwitchTab={onSwitchTab} coworkers={coworkers}/>;
  return <ManagerOverview stepId={stepId} isReady={isReady} onSwitchTab={onSwitchTab} coworkers={coworkers} onAddCoworker={onAddCoworker} onRemoveCoworker={onRemoveCoworker}/>;
}

function ManagerOverview({ stepId, isReady, onSwitchTab, coworkers, onAddCoworker, onRemoveCoworker }) {
  // MV-R4-04 \u2014 Collecting Data is animation-only. The orbital belongs to empty/pending states, not active collection.
  if (!isReady) return <div className="space-y-4"><CategorizeAnimation/><div className="rounded-lg border border-gray-200 bg-white p-4 flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-violet-50 inline-flex items-center justify-center shrink-0"><div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-violet-500 animate-spin"/></div><div><h3 className="text-sm font-medium text-gray-900">{"Collecting data from "}{SESSION.boards}{" boards\u2026"}</h3><p className="text-xs text-gray-500">{"We\u2019ll notify you when ready."}</p></div></div></div>;
  if (stepId==="capture") return <div className="space-y-4"><div className="grid grid-cols-3 gap-5"><div><PhaseHero phase="capture" cta={<Link href={`/session/${SESSION.id}?step=deliver`} className="w-full h-9 px-4 rounded-lg border-[1.5px] border-violet-400 bg-white hover:bg-violet-50 text-violet-700 text-sm font-medium inline-flex items-center justify-center gap-2">Start Deliver<ArrowRight className="w-3.5 h-3.5"/></Link>}/></div><div className="col-span-2"><div className="rounded-lg border border-gray-200 bg-white p-5"><h3 className="text-sm font-semibold text-gray-900 mb-3">Capture in progress</h3><ProgressBar/><p className="text-[11px] text-gray-500 mb-4">{SESSION.questions-SESSION.answered}{" questions remaining"}</p><div className="grid grid-cols-3 gap-3"><MC l="Accepted" v={SESSION.satisfied}/><MC l="Waiting review" v={SESSION.answered-SESSION.satisfied}/><MC l="Gaps addressed" v={`${SESSION.gapsAddressed}/${SESSION.gaps}`}/></div><p className="text-[11px] text-gray-500 mt-3" style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{"Started 3d ago · "}{SESSION.daysLeft}{"d left"}</p></div></div></div><CoworkerNetwork coworkers={coworkers} readOnly/></div>;
  return <div className="space-y-4"><div className="grid grid-cols-3 gap-5"><div><PhaseHero phase="prepare" cta={<Link href={`/session/${SESSION.id}`} className="w-full h-9 px-4 rounded-lg border-[1.5px] border-violet-400 bg-white hover:bg-violet-50 text-violet-700 text-sm font-medium inline-flex items-center justify-center gap-2">Start Capture<ArrowRight className="w-3.5 h-3.5"/></Link>}/></div><div className="col-span-2"><div className="rounded-lg border border-gray-200 bg-white p-5"><h3 className="text-sm font-semibold text-gray-900 mb-3">Data collection complete</h3><div className="grid grid-cols-4 gap-3 mb-4"><MC l="Boards" v={SESSION.boards}/><MC l="Cards" v={SESSION.cards}/><MC l="Modules" v={SESSION.modules}/><MC l="Questions" v={SESSION.questions}/></div><div className="pt-3 border-t border-gray-100 space-y-2"><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Modules</p><div className="flex flex-wrap gap-1.5">{["Payment Service","CI/CD Pipeline","Shared Libraries","Monitoring & Alerts","Infrastructure as Code"].map(m=><span key={m} className="text-[11px] px-2 py-1 rounded-md bg-gray-50 border border-gray-200 text-gray-700">{m}</span>)}</div></div><div className="pt-3 mt-3 border-t border-gray-100 grid grid-cols-2 gap-3"><div><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">Coworker engagement</p><p className="text-[12px] text-gray-700">2 of 3 have asked questions</p></div><div><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">Gaps</p><p className="text-[12px] text-gray-700">3 unresolved gaps across 2 modules</p></div></div></div></div></div><CoworkerNetwork coworkers={coworkers} onAdd={onAddCoworker} onRemove={onRemoveCoworker} readOnly={false}/></div>;
}

// Orbital illustration (R5-02) \u2014 the "waiting" visual for roles that can't act during
// Collecting (Offboarder + Coworker). Manager keeps the categorization animation instead.
function OrbitalIllustration() {
  return (<div className="relative w-32 h-32 mx-auto mb-5">
    <style>{"@keyframes sorbit-cw{from{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes sorbit-ccw{from{transform:rotate(0)}to{transform:rotate(-360deg)}}"}</style>
    <div className="absolute inset-0 rounded-full border border-violet-200/70" />
    <div className="absolute inset-[16px] rounded-full border border-violet-200/60" />
    <div className="absolute inset-[32px] rounded-full border border-violet-200/50" />
    <div className="absolute inset-0" style={{ animation: "sorbit-cw 18s linear infinite" }}><span className="absolute left-1/2 top-0 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-violet-400" /></div>
    <div className="absolute inset-[16px]" style={{ animation: "sorbit-ccw 24s linear infinite" }}><span className="absolute left-1/2 top-0 -translate-x-1/2 w-2 h-2 rounded-full bg-violet-300" /></div>
    <div className="absolute inset-[32px]" style={{ animation: "sorbit-cw 14s linear infinite" }}><span className="absolute left-1/2 top-0 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-fuchsia-300" /></div>
    <div className="absolute inset-0 flex items-center justify-center"><div className="w-11 h-11 rounded-full inline-flex items-center justify-center shadow-sm" style={{ background: "linear-gradient(135deg,#8b5cf6,#7c3aed)" }}><Sparkles className="w-5 h-5 text-white" strokeWidth={1.75} /></div></div>
  </div>);
}

function OffboarderOverview({ stepId, onSwitchTab, onOpenQuestion }) {
  // R5-02 \u2014 waiting state: orbital + "being prepared" message, no CTA.
  if (stepId!=="capture") return <div className="rounded-xl border border-gray-200 bg-white p-10 text-center"><OrbitalIllustration/><h3 className="text-sm font-semibold text-gray-900 mb-1">Your session is being prepared</h3><p className="text-xs text-gray-500 max-w-sm mx-auto">{"H\u00e0 Vy is setting up your knowledge handover. You\u2019ll be notified when questions are ready for you."}</p></div>;
  return <OffboarderWorkspace/>;
}
function primaryHome(card){ const x = ALL_CARDS.find(a=>a.card.name===card.name); return x?x.home:"__uncat__"; }
// GP-01/02 — per-gap evidence: only the 2-3 source cards the AI used, plus its analysis (chat bubbles).
const GAP_EVIDENCE = {
  "Payment Service": {
    intro: "I reviewed the cards in Payment Service and found 2 that reference failure handling:",
    sources: [
      { name: "Kafka retry configuration", note: "retry logic + DLQ, no failover" },
      { name: "Payment gateway timeout", note: "circuit breaker, no DR" },
    ],
    conclusion: "2 cards reference failure handling, but none document what happens when the entire service goes down. This is a critical gap.",
  },
  "Monitoring & Alerts": {
    intro: "I reviewed the cards in Monitoring & Alerts and found 2 that touch on alerting:",
    sources: [
      { name: "Datadog dashboard", note: "tracks SLOs, no routing rules" },
      { name: "PagerDuty escalation", note: "rotation defined, routing unclear" },
    ],
    conclusion: "Alerts are tracked and an on-call rotation exists, but no card documents which alert pages which rotation — routing is undocumented.",
  },
  "CI/CD Pipeline": {
    intro: "I compared how deployment is described across CI/CD Pipeline cards:",
    sources: [
      { name: "Atlas migration rollback", note: "rollback script, no deploy order" },
      { name: "GitHub Actions workflow", note: "lint → test → build → deploy" },
    ],
    conclusion: "Two cards describe deployment differently, so I couldn't determine which process is authoritative.",
  },
};
function gapEvidence(moduleName, cards) {
  return GAP_EVIDENCE[moduleName] || {
    intro: `I reviewed the cards in ${moduleName} and found these most relevant to the gap:`,
    sources: (cards||[]).slice(0,2).map(c=>({ name:c.name, note:"related context, gap not covered" })),
    conclusion: "None of these cards documents the missing area, so I flagged it as a knowledge gap.",
  };
}
// Module-level gap context — shows the source cards + AI analysis as chat bubbles (GP-01/02).
// showAsk gates the always-visible question input (GP-03): Manager/Coworker see it; Offboarder doesn't.
function GapContextPanel({ moduleName, onClose, showAsk = false, askLabel = "Coworker" }) {
  const mod = MODULES_DATA.flatMap(b=>b.modules).find(m=>m.name===moduleName);
  const gap = (mod&&mod.moduleGaps&&mod.moduleGaps[0]) || "Knowledge gap detected by AI";
  const gapQ = mod&&mod.moduleGapQs&&mod.moduleGapQs[0];
  const cards = (mod&&mod.items) || [];
  const ev = gapEvidence(moduleName, cards);
  // CW-R5-01 — the question input posts a human question to the Offboarder's queue (OB_QUEUE)
  // and it appears immediately in "Questions from this gap" below.
  const [input, setInput] = useState("");
  const [extraQs, setExtraQs] = useState([]);
  const [editExtra, setEditExtra] = useState(null); const [editExtraText, setEditExtraText] = useState(""); const [confirmExtra, setConfirmExtra] = useState(null); // CR-01 — edit/remove manual gap questions
  const saveExtra = (i)=>{ setExtraQs(p=>p.map((x,j)=>j===i?(editExtraText.trim()||x):x)); setEditExtra(null); };
  const removeExtra = (i)=>{ setExtraQs(p=>p.filter((_,j)=>j!==i)); setConfirmExtra(null); };
  const [sent, setSent] = useState(false);
  const sentTimer = useRef(null);
  // GC-01 — the AI gap question is editable + removable here too (Manager/Coworker via showAsk).
  const [gqText, setGqText] = useState(gapQ); const [gqGone, setGqGone] = useState(false); const [gqEdit, setGqEdit] = useState(false); const [gqInput, setGqInput] = useState(""); const [gqConfirm, setGqConfirm] = useState(false);
  const submitAsk = () => {
    const t = input.trim(); if(!t) return;
    OB_QUEUE.push({ id:`cwgap${++qId}`, q:t, from:askLabel, fromType:"human", module:moduleName, answered:false });
    setExtraQs(p=>[...p, t]); setInput("");
    setSent(true); if(sentTimer.current) clearTimeout(sentTimer.current); sentTimer.current = setTimeout(()=>setSent(false), 2400);
  };
  const hasQs = (!!gqText&&!gqGone) || extraQs.length>0;
  return <div className="p-5">
    <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-yellow-600"/><h3 className="text-[15px] font-semibold text-gray-900">Gap context</h3></div><button onClick={onClose} className="w-7 h-7 rounded-md hover:bg-gray-100 inline-flex items-center justify-center text-gray-400 cursor-pointer"><X className="w-4 h-4"/></button></div>
    <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-3 py-2.5 mb-3" style={{borderLeft:"3px solid #eab308"}}><p className="text-[10px] text-yellow-700 uppercase tracking-wider font-medium">Module</p><p className="text-[13px] font-medium text-gray-900">{moduleName}</p><p className="text-[11px] text-yellow-800 mt-1.5 flex items-start gap-1.5"><AlertTriangle className="w-3 h-3 shrink-0 mt-0.5"/>{gap}</p><span className="inline-flex items-center gap-1 text-[9px] mt-2 px-1.5 py-0.5 rounded bg-white border border-yellow-200 text-yellow-700"><Sparkles className="w-2.5 h-2.5"/>Detected by AI analysis</span></div>
    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-2">AI analysis</p>
    <div className="space-y-2 mb-3">
      <div className="bg-gray-100 rounded-lg rounded-tl-none px-3 py-2 text-[11px] text-gray-800 leading-relaxed" style={{maxWidth:"90%"}}>{ev.intro}</div>
      <div className="space-y-1 pl-1">{ev.sources.map((s,i)=><div key={i} className="flex items-start gap-1.5 text-[11px]"><FileText className="w-3 h-3 text-gray-400 shrink-0 mt-0.5"/><span className="text-gray-800 font-medium">{s.name}</span><span className="text-gray-400">{" → "}{s.note}</span></div>)}</div>
      <div className="bg-violet-50 border-l-2 border-violet-300 rounded-lg rounded-tl-none px-3 py-2 text-[11px] text-gray-700 leading-relaxed" style={{maxWidth:"90%"}}>{ev.conclusion}</div>
    </div>
    {hasQs&&<><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1 pt-2 border-t border-gray-100">{"Questions from this gap ("}{((gqText&&!gqGone)?1:0)+extraQs.length}{")"}</p>
      {gqText&&!gqGone&&<div className="group/gq text-[11px] bg-gray-50 rounded-md px-2.5 py-2 mb-1.5">{gqEdit?<div className="flex items-center gap-1.5"><input value={gqInput} onChange={e=>setGqInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){setGqText(gqInput.trim()||gqText);setGqEdit(false);}if(e.key==="Escape")setGqEdit(false);}} autoFocus className="flex-1 h-6 px-1.5 rounded border border-violet-300 text-[11px] focus:outline-none focus:ring-2 focus:ring-violet-500/20"/><button onClick={()=>{setGqText(gqInput.trim()||gqText);setGqEdit(false);}} className="w-5 h-5 rounded bg-violet-600 text-white inline-flex items-center justify-center cursor-pointer hover:bg-violet-700"><Check className="w-3 h-3"/></button><button onClick={()=>setGqEdit(false)} className="w-5 h-5 rounded border border-gray-300 text-gray-500 inline-flex items-center justify-center cursor-pointer hover:bg-gray-50"><X className="w-3 h-3"/></button></div>:<div className="flex items-center gap-1.5"><HelpCircle className="w-3 h-3 text-violet-500 shrink-0"/><span className="flex-1 text-gray-800">{gqText}</span>{showAsk?<span className="flex items-center gap-1 opacity-0 group-hover/gq:opacity-100"><button onClick={()=>{setGqEdit(true);setGqInput(gqText);}} className="w-5 h-5 rounded border border-gray-200 bg-white hover:bg-gray-50 inline-flex items-center justify-center text-gray-400 hover:text-violet-600 cursor-pointer" title="Edit question"><Pencil className="w-2.5 h-2.5"/></button><button onClick={()=>setGqConfirm(true)} className="w-5 h-5 rounded border border-gray-200 bg-white hover:bg-rose-50 inline-flex items-center justify-center text-gray-400 hover:text-rose-600 cursor-pointer" title="Remove question"><Trash2 className="w-2.5 h-2.5"/></button></span>:<span className="text-[9px] text-gray-400">waiting</span>}</div>}{gqConfirm&&<div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={()=>setGqConfirm(false)}><div className="bg-white rounded-xl shadow-xl p-5 w-[340px] border border-gray-200" onClick={e=>e.stopPropagation()}><h3 className="text-sm font-semibold text-gray-900 mb-1">Delete this question?</h3><p className="text-[12px] text-gray-500 mb-4">The AI won’t regenerate it.</p><div className="flex gap-2 justify-end"><button onClick={()=>setGqConfirm(false)} className="h-8 px-3 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button><button onClick={()=>{setGqGone(true);setGqConfirm(false);}} className="h-8 px-3 rounded-md bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 cursor-pointer">Delete</button></div></div></div>}</div>}
      {extraQs.map((q,i)=><div key={i} className="group/eq text-[11px] bg-violet-50/60 border border-violet-100 rounded-md px-2.5 py-2 mb-1.5">{editExtra===i?<div className="flex items-center gap-1.5"><input value={editExtraText} onChange={e=>setEditExtraText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")saveExtra(i);if(e.key==="Escape")setEditExtra(null);}} autoFocus className="flex-1 h-6 px-1.5 rounded border border-violet-300 text-[11px] focus:outline-none focus:ring-2 focus:ring-violet-500/20"/><button onClick={()=>saveExtra(i)} className="w-5 h-5 rounded bg-violet-600 text-white inline-flex items-center justify-center cursor-pointer hover:bg-violet-700"><Check className="w-3 h-3"/></button><button onClick={()=>setEditExtra(null)} className="w-5 h-5 rounded border border-gray-300 text-gray-500 inline-flex items-center justify-center cursor-pointer hover:bg-gray-50"><X className="w-3 h-3"/></button></div>:<div className="flex items-center gap-1.5"><HelpCircle className="w-3 h-3 text-violet-500 shrink-0"/><span className="flex-1 text-gray-800">{q}</span><span className="text-[9px] px-1.5 py-0.5 rounded bg-white border border-violet-200 text-violet-600 shrink-0">{askLabel}{" · waiting"}</span>{showAsk&&<span className="flex items-center gap-1 opacity-0 group-hover/eq:opacity-100"><button onClick={()=>{setEditExtra(i);setEditExtraText(q);}} className="w-5 h-5 rounded border border-gray-200 bg-white hover:bg-gray-50 inline-flex items-center justify-center text-gray-400 hover:text-violet-600 cursor-pointer" title="Edit question"><Pencil className="w-2.5 h-2.5"/></button><button onClick={()=>setConfirmExtra(i)} className="w-5 h-5 rounded border border-gray-200 bg-white hover:bg-rose-50 inline-flex items-center justify-center text-gray-400 hover:text-rose-600 cursor-pointer" title="Remove question"><X className="w-2.5 h-2.5"/></button></span>}</div>}{confirmExtra===i&&<ConfirmDeleteQ onConfirm={()=>removeExtra(i)} onCancel={()=>setConfirmExtra(null)}/>}</div>)}
      <div className="mb-1.5"/></>}
    {showAsk&&<div className="pt-2 border-t border-gray-100">
      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1.5">Ask about this gap</p>
      <div className="flex items-center gap-1.5">
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")submitAsk();}} placeholder="Type a question..." className="flex-1 h-9 px-3 rounded-lg border border-gray-200 text-[11px] focus:outline-none focus:ring-2 focus:ring-violet-500/20"/>
        <button onClick={submitAsk} className="h-9 px-3 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-medium cursor-pointer">Ask</button>
      </div>
      {sent&&<p className="text-[10px] text-emerald-600 mt-2 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/>Question sent to Minh Lê</p>}
    </div>}
  </div>;
}
// Offboarder workspace — lives in the Overview tab (Data is hidden for the Offboarder, Part D).
// Answer + edit-during-Capture (OV-R03) + "See in context" -> card or gap panel (OV-R05) + all-answered celebration (OV-R04).
function OffboarderWorkspace() {
  const [answers, setAnswers] = useState(()=>{ const m={}; OB_QUEUE.forEach(q=>{ if(q.answered) m[q.id]={text:q.answer, satisfied:q.satisfied, edited:false}; }); return m; });
  const [drafts, setDrafts] = useState({});
  const [editing, setEditing] = useState(null); const [editText, setEditText] = useState("");
  const [ctxCard, setCtxCard] = useState(null); const [ctxGap, setCtxGap] = useState(null); const [activeQ, setActiveQ] = useState(null);
  const [voiceMode, setVoiceMode] = useState(false); // R5-04 — voice interview mode
  const submit = (q) => { const t=(drafts[q.id]||"").trim(); if(!t) return; setAnswers(p=>({...p,[q.id]:{text:t,satisfied:false,edited:false}})); setDrafts(p=>({...p,[q.id]:""})); };
  // R5-04 — voice session submits all recorded transcripts at once; answers carry a voice flag.
  const submitVoice = (transcripts) => { setAnswers(p=>{ const n={...p}; Object.entries(transcripts).forEach(([id,text])=>{ if(text&&text.trim()) n[id]={text:text.trim(),satisfied:false,edited:false,voice:true}; }); return n; }); setVoiceMode(false); };
  const saveEdit = (qid) => { if(editText.trim()) setAnswers(p=>({...p,[qid]:{...p[qid],text:editText.trim(),edited:true}})); setEditing(null); };
  const openCtx = (q) => { setActiveQ(q.id); if(q.fromType==="ai"){ setCtxGap(q.module); setCtxCard(null); } else { setCtxCard(findCardForQuestion(q)); setCtxGap(null); } };
  const closeCtx = () => { setCtxCard(null); setCtxGap(null); setActiveQ(null); };
  const items = OB_QUEUE.map(q=>({ q, ans: answers[q.id] }));
  const waiting = items.filter(x=>!x.ans); const answered = items.filter(x=>x.ans);
  const done = answered.length; const total = OB_QUEUE.length; const allDone = waiting.length===0;
  const SeeCtx = ({ q }) => <button onClick={()=>openCtx(q)} className="text-[9px] text-violet-600 hover:text-violet-700 cursor-pointer inline-flex items-center gap-1 shrink-0 mt-0.5" title={q.fromType==="ai"?"See the module gap this came from":"Open the source card"}><ExternalLink className="w-2.5 h-2.5"/>See in context</button>;
  const Meta = ({ q, ans }) => <div className="text-[11px] text-gray-500 flex items-center gap-1.5 flex-wrap">{ans?<CheckCircle2 className="w-3 h-3 text-emerald-500"/>:q.fromType==="ai"?<Sparkles className="w-3 h-3 text-violet-500"/>:<User className="w-3 h-3"/>}<span>{ans?"Answered":q.from}</span>{ans&&(ans.satisfied?<span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 inline-flex items-center gap-0.5"><CheckCircle2 className="w-2.5 h-2.5"/>Accepted</span>:<span className="text-[9px] text-gray-400">waiting for review</span>)}{ans&&ans.edited&&<span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-50 text-violet-600 border border-violet-200">Edited</span>}{ans&&ans.voice&&<span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200 inline-flex items-center gap-0.5" title="Answered via voice"><Mic className="w-2.5 h-2.5"/>Voice</span>}<span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{q.module}</span></div>;
  if (voiceMode) return <VoiceSession questions={waiting.map(x=>x.q)} onSubmitAll={submitVoice} onClose={()=>setVoiceMode(false)}/>;
  return <div className="max-w-2xl">
    <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 text-emerald-800 px-4 py-2.5 mb-4 text-[12px] flex items-center gap-2"><Clock className="w-3.5 h-3.5 shrink-0"/><span><span className="font-semibold">{SESSION.daysLeft}{" days"}</span>{" until your last day · July 4, 2026"}</span></div>
    {allDone&&<div className="rounded-xl border border-emerald-200 p-5 text-center mb-4" style={{background:"linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)"}}><div className="w-11 h-11 rounded-full bg-white inline-flex items-center justify-center mb-2 shadow-sm"><CheckCircle2 className="w-6 h-6 text-emerald-500"/></div><h3 className="text-sm font-semibold text-gray-900">{"You’re all caught up!"}</h3><p className="text-[11px] text-gray-600 mt-0.5">{"You answered "}{done}{" questions. New questions may still come in from Hà Vy or coworkers."}</p></div>}
    <div className="grid grid-cols-3 gap-3 mb-4"><QTile label="To answer" value={waiting.length} tone={waiting.length>0?"urgent":"good"}/><QTile label="Answered" value={done} tone="good"/><QTile label="Gaps" value={SESSION.gaps} tone="normal"/></div>
    <div className="flex items-center gap-3 mb-5"><div className="flex-1 h-[5px] rounded-full bg-gray-200 overflow-hidden"><div className={`h-full rounded-full ${allDone?"bg-emerald-500":"bg-violet-500"}`} style={{width:`${Math.round(done/total*100)}%`}}/></div><span className="text-[11px] text-gray-500" style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{done}{" / "}{total}</span></div>
    {waiting.length>0&&<><button onClick={()=>setVoiceMode(true)} className="w-full text-left rounded-lg border mb-4 px-4 py-3 flex items-center gap-3 transition-colors hover:bg-violet-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500/20" style={{borderColor:"#c4b5fd",background:"#f5f3ff"}}><div className="w-9 h-9 rounded-full bg-white border border-violet-200 inline-flex items-center justify-center shrink-0"><Mic className="w-4 h-4 text-violet-600"/></div><div className="flex-1 min-w-0"><div className="text-[13px] font-semibold" style={{color:"#5b21b6"}}>Answer by voice</div><div className="text-[11px] text-gray-500">The AI will guide you through all questions. Speak your answers naturally.</div></div><span className="text-[11px] font-medium inline-flex items-center gap-1 shrink-0" style={{color:"#5b21b6"}}>Start voice session<ArrowRight className="w-3.5 h-3.5"/></span></button>
    <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium">Questions waiting for you <span className="text-gray-400" style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{"· "}{waiting.length}</span></p>
    <div className="space-y-2 mt-2 mb-6">{waiting.map(({q})=><div key={q.id} className={`rounded-lg border bg-white px-4 py-3 ${activeQ===q.id?"border-violet-500 ring-2 ring-violet-500/15":"border-gray-200"}`}><div className="flex items-start gap-2"><div className="text-[13px] text-gray-900 mb-1 flex-1">{q.q}</div><SeeCtx q={q}/></div><Meta q={q}/><div className="mt-2"><textarea value={drafts[q.id]||""} onChange={e=>setDrafts(p=>({...p,[q.id]:e.target.value}))} placeholder="Type your answer..." className="w-full h-16 px-2 py-1.5 rounded border border-gray-200 text-[11px] resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/20"/><div className="flex items-center justify-end mt-1"><button onClick={()=>submit(q)} className="h-6 px-2 rounded bg-violet-600 text-white text-[10px] cursor-pointer hover:bg-violet-700">Submit</button></div></div></div>)}</div></>}
    <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium">Answered <span className="text-gray-400" style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{"· "}{done}</span></p>
    <div className="space-y-2 mt-2">{answered.map(({q,ans})=><div key={q.id} className={`group/ans rounded-lg border bg-white px-4 py-3 ${activeQ===q.id?"border-violet-500 ring-2 ring-violet-500/15":"border-gray-200"}`}><div className="flex items-start gap-2"><div className="text-[13px] text-gray-900 mb-1 flex-1">{q.q}</div><SeeCtx q={q}/></div><Meta q={q} ans={ans}/>{editing===q.id?<div className="mt-2"><textarea value={editText} onChange={e=>setEditText(e.target.value)} className="w-full h-16 px-2 py-1.5 rounded border border-violet-300 text-[11px] resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/20" autoFocus/><div className="flex items-center justify-end gap-1.5 mt-1"><button onClick={()=>saveEdit(q.id)} className="h-6 px-2 rounded bg-violet-600 text-white text-[10px] cursor-pointer hover:bg-violet-700">Save</button><button onClick={()=>setEditing(null)} className="h-6 px-2 rounded border border-gray-300 text-gray-600 text-[10px] cursor-pointer hover:bg-gray-50">Cancel</button></div></div>:<div className="mt-2 rounded-md px-3 py-2 bg-gray-50 border-l-2 border-emerald-400 relative"><p className="text-[11px] text-gray-800 leading-relaxed">{ans.text}</p><button onClick={()=>{setEditing(q.id);setEditText(ans.text);}} className="absolute top-1.5 right-1.5 opacity-0 group-hover/ans:opacity-100 w-6 h-6 rounded border border-gray-200 bg-white hover:bg-gray-100 inline-flex items-center justify-center text-gray-400 hover:text-violet-600 cursor-pointer" title="Edit answer"><Pencil className="w-3 h-3"/></button></div>}</div>)}</div>
    {(ctxCard||ctxGap)&&<><div className="fixed inset-0 bg-black/10 z-30" onClick={closeCtx}/><div className="fixed top-0 right-0 h-full w-[480px] bg-white border-l border-gray-200 shadow-xl z-40 overflow-y-auto">{ctxGap?<GapContextPanel moduleName={ctxGap} onClose={closeCtx}/>:<SidePanel key={ctxCard.name} card={ctxCard} role="offboarder" onClose={closeCtx} isCapture={true} isDeliver={false} isComplete={false} primaryModule={primaryHome(ctxCard)}/>}</div></>}
  </div>;
}
// ── §4.6 / §4.8 — Module Classification Review ──────────────────────────────
// Per-card AI verdict: state (pass/review/newmod/uncat), confidence, the modules
// involved, and the two-agent reasoning transcript. Cards not listed default to a
// clean single-module Pass. Modulize Agent (M, purple) classifies; Gap Agent (G,
// orange) checks. The 6 conversation templates (§4.6) are realised below.
function classify(card){ return CLASSIFY[card.name] || { state:"pass", confidence:94, primary:undefined }; }
const CLS_META = {
  pass:    { label:"Pass",         badge:null,                                                       border:null,        chip:"bg-violet-50 text-violet-700 border-violet-200",        rowBg:"",               rowBorder:null,                dotColor:null,      dotDashed:false },
  review:  { label:"Review",       badge:"bg-amber-50 text-amber-700 border-amber-400",              border:"#f59e0b",   chip:"bg-amber-50 text-amber-700 border-amber-400",           rowBg:"bg-amber-50/50", rowBorder:"3px solid #f59e0b", dotColor:"#f59e0b", dotDashed:false },
  newmod:  { label:"New Module",   badge:"bg-violet-50 text-violet-700 border-violet-300",           border:"#8b5cf6",   chip:"bg-violet-50 text-violet-700 border-violet-300",        rowBg:"bg-violet-50/50",rowBorder:"3px solid #8b5cf6", dotColor:"#8b5cf6", dotDashed:false },
  uncat:   { label:"Uncategorized",badge:"bg-gray-50 text-gray-500 border-gray-300",               border:null,        chip:"bg-gray-50 text-gray-500 border-gray-300 border-dashed",rowBg:"bg-gray-50/50",  rowBorder:"3px solid #9ca3af", dotColor:null,      dotDashed:false },
};
function confColor(c){ return c>70?"#10b981":c>=40?"#f59e0b":"#f43f5e"; }
const AGENT_AV = { M:{bg:"#ede9fe",fg:"#6d28d9",name:"Modulize Agent"}, G:{bg:"#fff7ed",fg:"#c2410c",name:"Gap Agent"} };

// MU-01/02 — distinct gray-dashed "Add module" that expands into a free-text search + create control.
function AddModuleControl({ addable, onAdd }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const query = q.trim();
  const matches = addable.filter(m=>m.toLowerCase().includes(query.toLowerCase()));
  const exact = addable.some(m=>m.toLowerCase()===query.toLowerCase());
  const canCreate = query.length>0 && !exact;
  const pick = (m)=>{ onAdd(m); setQ(""); setOpen(false); };
  if(!open) return <button onClick={()=>setOpen(true)} className="text-[10px] px-2 py-0.5 rounded-md border border-dashed border-gray-300 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700 cursor-pointer inline-flex items-center gap-0.5"><Plus className="w-2.5 h-2.5"/>Add module</button>;
  return <div className="relative">
    <input value={q} autoFocus onChange={e=>setQ(e.target.value)} onBlur={()=>setTimeout(()=>setOpen(false),150)} onKeyDown={e=>{if(e.key==="Escape"){setOpen(false);setQ("");}if(e.key==="Enter"){if(matches.length===1)pick(matches[0]);else if(canCreate)pick(query);}}} placeholder="Search or create…" className="h-6 w-44 px-2 rounded-md border border-violet-300 text-[10px] focus:outline-none focus:ring-2 focus:ring-violet-500/20"/>
    <div className="absolute left-0 top-full mt-1 z-10 w-52 rounded-md border border-gray-200 bg-white shadow-lg py-1 max-h-44 overflow-y-auto">
      {matches.map(m=><button key={m} onMouseDown={e=>e.preventDefault()} onClick={()=>pick(m)} className="w-full text-left px-2.5 py-1 text-[11px] text-gray-700 hover:bg-violet-50 hover:text-violet-700 cursor-pointer">{m}</button>)}
      {matches.length===0&&!canCreate&&<p className="px-2.5 py-1 text-[10px] text-gray-400">No modules</p>}
      {canCreate&&<button onMouseDown={e=>e.preventDefault()} onClick={()=>pick(query)} className="w-full text-left px-2.5 py-1 text-[11px] text-violet-700 hover:bg-violet-50 cursor-pointer border-t border-gray-100 mt-1 pt-1.5 inline-flex items-center gap-1"><Plus className="w-2.5 h-2.5"/>Create &quot;{query}&quot;</button>}
    </div>
  </div>;
}

// The AI Reasoning panel — opens to the left of the card detail when a module chip is clicked.
// readOnly (Coworker, §9) hides the action area; the Manager gets the full assign/accept controls.
// §3 MC-01..05 — Module Classification panel. Reasoning is always visible; the Assigned-modules box is
// the prominent result; chips are directly interactive (× remove · + add) and double as a per-module switcher.
function AIReasoningPanel({ card, onClose, readOnly = false }) {
  const cls = classify(card);
  const init = cls.primary ? [cls.primary, ...(cls.linked||[])] : cls.newModule ? [] : (cls.candidates ? [cls.candidates[0]] : []);
  const [assign, setAssign] = useState(init);
  const [orig, setOrig] = useState(init);
  const [active, setActive] = useState(init[0]||null);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false); // MC-06 — Accept confirmed → suggested chip becomes a solid assignment
  const [skipped, setSkipped] = useState(false);
  const [newName, setNewName] = useState(cls.newModule||"");
  const [saved, setSaved] = useState(null);
  const [everSaved, setEverSaved] = useState(false); // MU-03 — after a save, a further chip change re-shows Save/Cancel
  const addable = ALL_MOD_NAMES.filter(m=>!assign.includes(m));
  const dirty = JSON.stringify(assign)!==JSON.stringify(orig);
  const isNew = cls.state==="newmod" && !skipped && !accepted; // MC-06 — after Accept, behaves like a normal assignment
  const needsConfirm = cls.state==="review" || cls.state==="uncat" || skipped; // MC-05 — these open with Save/Cancel visible
  // MU-03 — Save/Cancel visibility = current vs last-saved (dirty). Review/Uncat force it only until the first save.
  const showSave = !readOnly && !isNew && (dirty || (needsConfirm && !everSaved));
  const removeM=(m)=>{const next=assign.filter(x=>x!==m); setAssign(next); setSaved(null); if(active===m) setActive(next[0]||null);};
  const addM=(m)=>{setAssign(a=>[...a,m]); setActive(m); setSaved(null);};
  const doSave=()=>{setOrig(assign); setEverSaved(true); setSaved(assign.length?`Saved · ${assign.join(", ")}.`:"Saved · card left Uncategorized.");};
  const doCancel=()=>{setAssign(orig); setActive(orig[0]||null); setSkipped(false);};
  const confirmNew=()=>{const nm=(newName.trim()||cls.newModule); setAssign([nm]); setOrig([nm]); setActive(nm); setAccepted(true); setAccepting(false); setEverSaved(true); setSaved(`Created module “${nm}” and assigned this card.`);};
  const verdictBox = cls.state==="pass"
    ? <div className="rounded-md bg-emerald-50 border border-emerald-200 px-3 py-2 text-[11px] text-emerald-800 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5"/>Confident match — no action needed.</div>
    : cls.state==="review" ? <div className="rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] text-amber-800 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5"/>Needs your call — confirm the module(s).</div>
    : cls.state==="newmod" ? <div className="rounded-md bg-violet-50 border border-violet-200 px-3 py-2.5 text-[11px] text-violet-900"><p className="text-[9px] uppercase tracking-wider font-semibold text-violet-500 mb-1 flex items-center gap-1"><Sparkles className="w-3 h-3"/>New module suggested</p><p className="text-[13px] font-semibold text-gray-900 mb-1">{cls.newModule}</p><p className="text-[10px] text-violet-800 leading-relaxed">{(cls.chat&&cls.chat[0]&&cls.chat[0].t)||"No existing module covers these cards."}</p></div>
    : <div className="rounded-md bg-gray-50 border border-gray-300 border-dashed px-3 py-2 text-[11px] text-gray-600 flex items-center gap-1.5"><Inbox className="w-3.5 h-3.5"/>Couldn’t place this card — assign it below.</div>;
  return <div className="fixed top-0 right-[480px] h-full w-[400px] bg-white border-l border-gray-200 shadow-xl z-50 overflow-y-auto" onClick={e=>e.stopPropagation()}>
    <div className="p-4">
      <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-violet-600"/><h3 className="text-[14px] font-semibold text-gray-900">Module Classification</h3>{readOnly&&<span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200">Read-only</span>}</div><button onClick={onClose} className="w-7 h-7 rounded-md hover:bg-gray-100 inline-flex items-center justify-center text-gray-400 cursor-pointer"><X className="w-4 h-4"/></button></div>
      <p className="text-[11px] text-gray-500 mb-3">{card.name}</p>
      {/* MC-07 — verdict/conclusion FIRST (executive-summary style), above the Assigned modules section. */}
      <div className="mb-3">{verdictBox}</div>
      {/* MC-04 — Assigned modules: the prominent result. MC-03 — chips double as a switcher. MC-05 — × remove · + add. */}
      <div className="rounded-lg border border-violet-300 bg-violet-50 px-3 py-2.5 mb-2">
        <p className="text-[10px] text-violet-700 uppercase tracking-wider font-semibold mb-1.5">Assigned modules</p>
        {accepting ? <div className="flex items-center gap-1.5">
          {/* MC-06 #3 — Accept → the suggested name becomes inline-editable (per RF-01). */}
          <input value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")confirmNew();if(e.key==="Escape")setAccepting(false);}} placeholder="Module name" className="flex-1 h-7 px-2 rounded-md border border-violet-400 text-[11px] focus:outline-none focus:ring-2 focus:ring-violet-500/20" autoFocus/>
          <button onClick={confirmNew} className="w-7 h-7 rounded bg-violet-600 text-white inline-flex items-center justify-center cursor-pointer hover:bg-violet-700"><Check className="w-3.5 h-3.5"/></button>
          <button onClick={()=>setAccepting(false)} className="w-7 h-7 rounded border border-gray-300 text-gray-500 inline-flex items-center justify-center cursor-pointer hover:bg-gray-50"><X className="w-3.5 h-3.5"/></button>
        </div>
        : isNew ? <div className="flex flex-wrap items-center gap-1.5">
          {/* MC-06 #1 — suggested name shown here as a violet DASHED chip (a suggestion, not a confirmed assignment). */}
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-md border border-dashed border-violet-400 bg-violet-50 text-violet-700 font-medium"><Sparkles className="w-2.5 h-2.5"/>{cls.newModule}</span>
        </div>
        : assign.length? <div className="flex flex-wrap gap-1.5 items-center">{assign.map(m=><span key={m} className={`inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-md border ${active===m?"bg-violet-50 text-violet-800 border-violet-500 ring-1 ring-violet-400":"bg-violet-50 text-violet-700 border-violet-300 hover:border-violet-500"}`}><button onClick={()=>setActive(m)} className="cursor-pointer">{m}</button>{!readOnly&&<button onClick={()=>removeM(m)} className="cursor-pointer hover:text-rose-500">×</button>}</span>)}
          {!readOnly&&<AddModuleControl addable={addable} onAdd={addM}/>}
        </div> : <div className="rounded-md border border-dashed border-gray-300 bg-white/60 px-2.5 py-1.5 text-[11px] text-gray-500 flex items-center gap-1.5"><Inbox className="w-3 h-3"/>No modules assigned — card is Uncategorized{!readOnly&&<div className="ml-auto"><AddModuleControl addable={addable} onAdd={addM}/></div>}</div>}
      </div>
      {/* MC-05 — Save/Cancel (or New-Module Accept/Skip) */}
      {readOnly ? <p className="text-[10px] text-gray-400 flex items-center gap-1.5 mb-3"><User className="w-3 h-3"/>Read-only — only the Manager can change the assignment.</p>
        : saved ? <p className="text-[11px] text-emerald-600 flex items-center gap-1.5 mb-3"><CheckCircle2 className="w-3.5 h-3.5"/>{saved}</p>
        : accepting ? <div className="mb-3"/>
        : isNew ? <div className="flex flex-wrap gap-2 mb-3"><button onClick={()=>{setAccepting(true);setNewName(cls.newModule);}} className="h-7 px-3 rounded-md bg-violet-600 text-white text-[11px] font-medium hover:bg-violet-700 cursor-pointer">Accept</button><button onClick={()=>{setSkipped(true);setAssign([]);setActive(null);}} className="h-7 px-3 rounded-md border border-gray-300 text-gray-600 text-[11px] font-medium hover:bg-gray-50 cursor-pointer">Skip</button></div>
        : showSave ? <div className="flex gap-2 mb-3"><button onClick={doSave} className="h-7 px-3 rounded-md bg-violet-600 text-white text-[11px] font-medium hover:bg-violet-700 cursor-pointer">Save</button><button onClick={doCancel} className="h-7 px-3 rounded-md border border-gray-300 text-gray-600 text-[11px] font-medium hover:bg-gray-50 cursor-pointer">Cancel</button></div>
        : <div className="mb-3"/>}
      {/* Confidence — for the active module */}
      <div className="mb-3"><div className="flex items-center justify-between text-[10px] mb-1"><span className="text-gray-500 uppercase tracking-wider font-medium">Confidence{active?` · ${active}`:""}</span><span style={{fontFamily:"ui-monospace,Menlo,monospace",color:confColor(cls.confidence)}}>{cls.confidence}%</span></div><div className="h-1.5 rounded-full bg-gray-100 overflow-hidden"><div className="h-full rounded-full" style={{width:`${cls.confidence}%`,background:confColor(cls.confidence)}}/></div></div>
      {/* MC-04 — AI conversation ALWAYS visible */}
      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1.5">AI reasoning{active?` · ${active}`:""}</p>
      <div className="space-y-2 mb-3">{(cls.chat||[]).map((m,i)=>{const av=AGENT_AV[m.a];return <div key={i} className={`flex gap-2 ${m.a==="G"?"pl-5":""}`}><div className="w-5 h-5 rounded-full inline-flex items-center justify-center text-[9px] font-semibold shrink-0 mt-0.5" style={{background:av.bg,color:av.fg}}>{m.a}</div><div className="flex-1 rounded-lg px-2.5 py-1.5" style={{background:m.a==="M"?"#faf5ff":"#fff7ed",borderLeft:`2px solid ${av.fg}`}}><p className="text-[8px] uppercase tracking-wider font-semibold mb-0.5" style={{color:av.fg}}>{m.step}</p><p className="text-[10px] text-gray-700 leading-snug">{m.t}</p></div></div>;})}</div>
    </div>
  </div>;
}

function QTile({ label, value, tone }) { const c = { urgent: "text-rose-600", good: "text-emerald-600", normal: "text-gray-900" }[tone]; return <div className="rounded-lg border border-gray-200 bg-white p-3"><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">{label}</p><p className={`text-xl font-semibold ${c}`} style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{value}</p></div>; }

// ── R5-04: Voice interview mode ─────────────────────────────────────────────
// Mock recording (no real audio): animated mic + waveform, a streamed canned transcript the
// Offboarder can edit, manual advance, skipped-question round, and a batch submit at the end.
function vFmt(s){ return `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`; }
function mockTranscript(q){ if(!q) return ""; const base=(q.q||"").replace(/\?+$/,"").trim(); const lead=base?base.charAt(0).toLowerCase()+base.slice(1):"this"; return `Good question about ${q.module||"this area"}. On ${lead} — the short version is we handle it through the documented runbook. I'd point the next person to the wiki page and the on-call rotation, and flag the two edge cases the team usually hits.`; }

function VoiceContext({ q }) {
  if (!q) return null;
  if (q.fromType==="ai") {
    const mod = MODULES_DATA.flatMap(b=>b.modules).find(m=>m.name===q.module);
    const gap = (mod&&mod.moduleGaps&&mod.moduleGaps[0])||"Knowledge gap detected by AI";
    return <div><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1.5">Gap context</p><div className="rounded-md bg-yellow-50 border border-yellow-200 px-2.5 py-2" style={{borderLeft:"3px solid #eab308"}}><p className="text-[12px] font-medium text-gray-900">{q.module}</p><p className="text-[10px] text-yellow-800 mt-1 flex items-start gap-1"><AlertTriangle className="w-3 h-3 shrink-0 mt-0.5"/>{gap}</p></div></div>;
  }
  const card = findCardForQuestion(q);
  if (!card) return <p className="text-[11px] text-gray-400">No card context.</p>;
  return <div><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1.5">Card context</p><p className="text-[12px] font-medium text-gray-900 mb-1">{card.name}</p><p className="text-[11px] text-gray-600 leading-relaxed mb-2">{card.desc||<span className="text-gray-400 italic">No description</span>}</p>{card.checklist&&card.checklist.length>0&&<div className="mb-2 space-y-0.5">{card.checklist.map((c,i)=><div key={i} className="flex items-center gap-1.5 text-[11px]">{c.done?<CheckCircle2 className="w-3 h-3 text-emerald-500"/>:<div className="w-3 h-3 rounded border border-gray-300"/>}<span className={c.done?"text-gray-500 line-through":"text-gray-700"}>{c.text}</span></div>)}</div>}{(card.files||[]).map((f,i)=><p key={i} className="text-[10px] text-gray-500 flex items-center gap-1"><Paperclip className="w-2.5 h-2.5"/>{f.name}</p>)}</div>;
}

// Stable wrapper (module-level so streaming re-renders reconcile instead of remounting).
function VoiceShell({ children }) {
  return <div className="max-w-3xl">
    <style>{"@keyframes vring{0%{transform:scale(.75);opacity:.55}100%{transform:scale(1.7);opacity:0}}@keyframes vbar{0%,100%{transform:scaleY(.25)}50%{transform:scaleY(1)}}"}</style>
    {children}
  </div>;
}

function VoiceSession({ questions, onSubmitAll, onClose }) {
  const [queue, setQueue] = useState(questions);
  const [idx, setIdx] = useState(0);
  const [recording, setRecording] = useState(true);
  const [paused, setPaused] = useState(false);
  const [secs, setSecs] = useState(0);
  const [transcripts, setTranscripts] = useState({});
  const [durations, setDurations] = useState({});
  const [skipped, setSkipped] = useState([]);
  const [phase, setPhase] = useState("interview"); // interview | review | skipped | complete
  const [editId, setEditId] = useState(null);
  const cur = queue[idx];

  useEffect(()=>{ if(phase!=="interview"||!recording||paused) return; const iv=setInterval(()=>setSecs(s=>s+1),1000); return ()=>clearInterval(iv); }, [phase,recording,paused]);
  useEffect(()=>{ if(phase!=="interview"||!recording||paused||!cur) return; const full=mockTranscript(cur); const iv=setInterval(()=>{ setTranscripts(t=>{ const have=(t[cur.id]||"").length; if(have>=full.length) return t; return {...t,[cur.id]: full.slice(0, Math.min(full.length, have+3))}; }); }, 110); return ()=>clearInterval(iv); }, [idx,phase,recording,paused]); // eslint-disable-line

  const remaining = queue.filter(q=>!(transcripts[q.id]||"").trim()).length;
  const answeredInQueue = queue.length - remaining;

  const goReview = () => { setRecording(false); setDurations(d=>({...d,[cur.id]:secs})); setPhase("review"); };
  const reRecord = () => { setTranscripts(t=>({...t,[cur.id]:""})); setSecs(0); setRecording(true); setPhase("interview"); };
  const advance = (justSkippedId) => {
    if (idx+1 < queue.length) { setIdx(idx+1); setSecs(0); setRecording(true); setPhase("interview"); }
    else { const sk=[...new Set([...skipped, ...(justSkippedId?[justSkippedId]:[])])].filter(id=>!(transcripts[id]||"").trim()); setPhase(sk.length>0?"skipped":"complete"); }
  };
  const skip = () => { setTranscripts(t=>{ const n={...t}; delete n[cur.id]; return n; }); setSkipped(s=>s.includes(cur.id)?s:[...s,cur.id]); advance(cur.id); };
  const answerSkipped = () => { const sk=questions.filter(q=>skipped.includes(q.id)&&!(transcripts[q.id]||"").trim()); setQueue(sk); setSkipped([]); setIdx(0); setSecs(0); setRecording(true); setPhase("interview"); };

  const answeredAll = questions.filter(q=>(transcripts[q.id]||"").trim());
  const skippedAll = questions.filter(q=>!(transcripts[q.id]||"").trim());

  if (phase==="skipped") return <VoiceShell><div className="rounded-xl border border-gray-200 bg-white p-6">
    <h3 className="text-base font-semibold text-gray-900 mb-1">You skipped {skippedAll.length} question{skippedAll.length!==1?"s":""}</h3>
    <p className="text-[12px] text-gray-500 mb-4">Answer them now by voice, or leave them in your regular queue for later.</p>
    <div className="space-y-2 mb-5">{skippedAll.map(q=><div key={q.id} className="rounded-lg bg-gray-50 px-3 py-2.5" style={{borderLeft:"2px solid #eab308",borderRadius:0}}><p className="text-[12px] text-gray-900">{q.q}</p><p className="text-[10px] text-gray-500 mt-0.5">{q.module}</p></div>)}</div>
    <div className="flex items-center justify-end gap-2"><button onClick={onClose} className="h-9 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">Leave for later</button><button onClick={answerSkipped} className="h-9 px-4 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium inline-flex items-center gap-1.5 cursor-pointer"><Mic className="w-3.5 h-3.5"/>Answer these now</button></div>
  </div></VoiceShell>;

  if (phase==="complete") return <VoiceShell><div className="rounded-xl border border-emerald-200 p-6 text-center mb-4" style={{background:"linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%)"}}>
      <h3 className="text-base font-semibold text-gray-900 mb-1">Voice session complete</h3>
      <p className="text-[12px] text-gray-600">{questions.length}{" questions · "}{vFmt(Object.values(durations).reduce((a,b)=>a+b,0))}{" · "}{skippedAll.length}{" skipped"}</p>
    </div>
    <div className="space-y-2 mb-5">{answeredAll.map(q=><div key={q.id} className="rounded-lg border border-gray-200 bg-white px-4 py-3"><div className="flex items-start gap-2"><div className="flex-1"><div className="text-[12px] text-gray-900 mb-1 inline-flex items-center gap-1.5"><Mic className="w-3 h-3 text-gray-400"/>{q.q}</div>{editId===q.id?<textarea value={transcripts[q.id]} onChange={e=>setTranscripts(t=>({...t,[q.id]:e.target.value}))} className="w-full h-16 px-2 py-1.5 rounded border border-violet-300 text-[11px] resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/20" autoFocus/>:<p className="text-[11px] text-gray-600 italic leading-relaxed">&quot;{transcripts[q.id]}&quot;</p>}</div><button onClick={()=>setEditId(editId===q.id?null:q.id)} className="text-[10px] text-violet-600 hover:text-violet-700 cursor-pointer shrink-0 inline-flex items-center gap-1"><Pencil className="w-2.5 h-2.5"/>{editId===q.id?"Done":"Edit"}</button></div></div>)}
      {skippedAll.map(q=><div key={q.id} className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 opacity-60"><div className="text-[12px] text-gray-600">{q.q}</div><p className="text-[10px] text-gray-400 mt-0.5">left in queue</p></div>)}</div>
    <div className="flex items-center justify-between"><button onClick={onClose} className="h-9 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">Back to queue</button><button onClick={()=>onSubmitAll(transcripts)} className="h-9 px-5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium inline-flex items-center gap-1.5 cursor-pointer"><Check className="w-3.5 h-3.5"/>Submit all ({answeredAll.length} answer{answeredAll.length!==1?"s":""})</button></div>
  </VoiceShell>;

  // interview / review
  return <VoiceShell><div className="flex gap-4">
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-3"><div className="text-sm font-semibold text-gray-900 inline-flex items-center gap-1.5"><Mic className="w-4 h-4 text-rose-500"/>{"Voice session · "}{remaining}{" remaining"}</div><button onClick={onClose} className="h-7 px-2.5 rounded-md border border-gray-300 text-[11px] font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">End session</button></div>
      <div className="flex items-center gap-3 mb-1"><div className="flex-1 h-[5px] rounded-full bg-gray-200 overflow-hidden"><div className="h-full rounded-full bg-violet-500" style={{width:`${Math.round((answeredInQueue/queue.length)*100)}%`}}/></div><span className="text-[11px] text-gray-500" style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{"Question "}{idx+1}{" of "}{queue.length}</span></div>
      <p className="text-[10px] text-gray-400 mb-4">{answeredInQueue}{" answered · "}{skipped.length}{" skipped"}</p>

      <div className="rounded-lg bg-white px-4 py-4 mb-4" style={{border:"1px solid #e5e7eb",borderLeft:"3px solid #7c3aed"}}>
        <p className="text-[14px] text-gray-900 leading-snug">{cur?cur.q:""}</p>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 inline-block mt-2">{cur?cur.module:""}</span>
      </div>

      {phase==="interview"?<>
        <div className="relative w-20 h-20 mx-auto mb-2">
          {!paused&&<><span className="absolute inset-0 rounded-full" style={{background:"#fecdd3",animation:"vring 1.8s ease-out infinite"}}/><span className="absolute inset-0 rounded-full" style={{background:"#fecdd3",animation:"vring 1.8s ease-out infinite",animationDelay:"0.9s"}}/></>}
          <button onClick={()=>setPaused(p=>!p)} className="absolute inset-2 rounded-full inline-flex items-center justify-center shadow cursor-pointer" style={{background:"#e11d48"}} title={paused?"Resume":"Pause"}>{paused?<Pause className="w-6 h-6 text-white"/>:<Mic className="w-6 h-6 text-white"/>}</button>
        </div>
        <p className="text-center text-[12px] text-gray-500 mb-2" style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{paused?"Paused":vFmt(secs)}</p>
        <div className="flex items-end justify-center gap-1 h-8 mb-3">{[0,1,2,3,4,5,6].map(i=><span key={i} className="w-1 rounded-full" style={{height:24,transformOrigin:"bottom",background:"#fda4af",animation:paused?"none":`vbar 0.9s ease-in-out ${i*0.11}s infinite`}}/>)}</div>
        <div className="rounded-md bg-[#f8f8f8] border border-gray-200 px-3 py-2 mb-3 min-h-[64px]"><p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-1">Live transcript</p><textarea value={transcripts[cur?.id]||""} onChange={e=>setTranscripts(t=>({...t,[cur.id]:e.target.value}))} placeholder="Speak now — your words appear here…" className="w-full h-16 bg-transparent text-[11px] text-gray-700 resize-none focus:outline-none"/></div>
        <div className="flex items-center justify-between"><button onClick={()=>setPaused(p=>!p)} className="h-8 px-3 rounded-lg border border-gray-300 text-[12px] font-medium text-gray-700 hover:bg-gray-50 inline-flex items-center gap-1.5 cursor-pointer"><Pause className="w-3.5 h-3.5"/>{paused?"Resume":"Pause"}</button><div className="flex items-center gap-2"><button onClick={skip} className="h-8 px-3 rounded-lg border border-gray-300 text-[12px] font-medium text-gray-600 hover:bg-gray-50 inline-flex items-center gap-1.5 cursor-pointer"><SkipForward className="w-3.5 h-3.5"/>Skip</button><button onClick={goReview} className="h-8 px-4 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[12px] font-medium inline-flex items-center gap-1.5 cursor-pointer">Next question<ArrowRight className="w-3.5 h-3.5"/></button></div></div>
      </>:<>
        <p className="text-[12px] text-emerald-600 mb-2 inline-flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4"/>{"Answer recorded · "}{vFmt(durations[cur?.id]||0)}</p>
        <textarea value={transcripts[cur?.id]||""} onChange={e=>setTranscripts(t=>({...t,[cur.id]:e.target.value}))} className="w-full h-24 px-3 py-2 rounded-lg border border-gray-200 text-[12px] text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/20 mb-1" placeholder="Edit your transcript…"/>
        <p className="text-[10px] text-gray-400 mb-3">Edit the text above to fix names or technical terms.</p>
        <div className="flex items-center justify-end gap-2"><button onClick={reRecord} className="h-8 px-3 rounded-lg border border-gray-300 text-[12px] font-medium text-gray-600 hover:bg-gray-50 inline-flex items-center gap-1.5 cursor-pointer"><RotateCcw className="w-3.5 h-3.5"/>Re-record</button><button onClick={()=>advance()} className="h-8 px-4 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[12px] font-medium inline-flex items-center gap-1.5 cursor-pointer">Next<ArrowRight className="w-3.5 h-3.5"/></button></div>
      </>}
    </div>

    <div className="w-[200px] shrink-0 rounded-lg border border-gray-200 bg-gray-50/50 p-3 self-start"><VoiceContext q={cur}/></div>
  </div></VoiceShell>;
}
// Offboarder hybrid queue (\u00a78.3): a flat list \u2014 no module tree, headers, card counts, gaps, flags, drag, or rename.
// Each question carries a light module tag + a "See in context" link that opens the source card in the Side Panel.
function OffboarderQueue({ focusQ, focusKey, onSelectCard, selectedCard }) {
  const refs = useRef({}); const [flash, setFlash] = useState(null); const [activeQ, setActiveQ] = useState(null);
  useEffect(()=>{ if(!focusQ) return; const el = refs.current[focusQ]; if(el) el.scrollIntoView({behavior:"smooth", block:"center"}); setFlash(focusQ); const t = setTimeout(()=>setFlash(null), 1600); return ()=>clearTimeout(t); }, [focusKey, focusQ]);
  useEffect(()=>{ if(!selectedCard) setActiveQ(null); }, [selectedCard]);
  const openContext = (q) => { const card = findCardForQuestion(q); if(card&&onSelectCard){ setActiveQ(q.id); onSelectCard(card); } };
  return <div className="space-y-2">
    <style>{"@keyframes qflash{0%{box-shadow:0 0 0 2px #a78bfa;background:#f5f3ff}100%{box-shadow:0 0 0 0 rgba(0,0,0,0);background:#ffffff}}"}</style>
    {OB_QUEUE.map(q=>{const isActive=activeQ===q.id&&!!selectedCard;return <div key={q.id} ref={el=>{refs.current[q.id]=el;}} style={flash===q.id?{animation:"qflash 1.6s ease-out"}:undefined} className={`rounded-lg border bg-white px-4 py-3 ${isActive?"border-violet-500 ring-2 ring-violet-500/15":"border-gray-200"}`}><div className="flex items-start gap-2"><div className="text-[13px] text-gray-900 mb-1 flex-1">{q.q}</div>{onSelectCard&&<button onClick={()=>openContext(q)} className="text-[9px] text-violet-600 hover:text-violet-700 cursor-pointer inline-flex items-center gap-1 shrink-0 mt-0.5" title="Open the source card"><ExternalLink className="w-2.5 h-2.5"/>See in context</button>}</div><div className="text-[11px] text-gray-500 flex items-center gap-1.5">{q.answered?<CheckCircle2 className="w-3 h-3 text-emerald-500"/>:q.fromType==="ai"?<Sparkles className="w-3 h-3 text-violet-500"/>:<User className="w-3 h-3"/>}<span>{q.answered?"Answered":q.from}</span>{q.answered&&(q.satisfied?<span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 inline-flex items-center gap-0.5"><CheckCircle2 className="w-2.5 h-2.5"/>Accepted</span>:<span className="text-[9px] text-gray-400">waiting for review</span>)}<span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 ml-1">{q.module}</span></div>{q.answered?<div className="mt-2 rounded-md px-3 py-2 bg-gray-50 border-l-2 border-emerald-400"><p className="text-[11px] text-gray-800 leading-relaxed">{q.answer}</p></div>:<AnswerInput/>}</div>})}
  </div>;
}

function CoworkerOverview({ stepId, isReady, onSwitchTab, coworkers }) {
  // R5-02 \u2014 waiting state: orbital + "Data is being collected" message, no CTA.
  if (!isReady) return <div className="rounded-xl border border-gray-200 bg-white p-10 text-center"><OrbitalIllustration/><h3 className="text-sm font-semibold text-gray-900 mb-1">Data is being collected</h3><p className="text-xs text-gray-500 max-w-sm mx-auto">{"The system is crawling Trello boards and organizing knowledge. You\u2019ll be able to review and ask questions once data is ready."}</p></div>;
  if (stepId==="capture") return <div className="space-y-4"><div className="rounded-lg border border-gray-200 bg-white p-5"><h3 className="text-sm font-semibold text-gray-900 mb-1">Your questions</h3><p className="text-[12px] text-gray-500 mb-3">Review answers and ask follow-ups.</p><div className="grid grid-cols-3 gap-3"><MC l="Answered" v={2}/><MC l="Waiting" v={1}/><MC l="Accepted" v={1}/></div><p className="text-[11px] text-yellow-700 mt-3 flex items-center gap-1.5"><AlertTriangle className="w-3 h-3"/>1 answer waiting for review</p></div><CoworkerNetwork coworkers={coworkers} readOnly/></div>;
  return <div className="space-y-4"><div className="rounded-lg border border-gray-200 bg-white p-5"><h3 className="text-sm font-semibold text-gray-900 mb-1">{"Minh L\u00ea is leaving soon"}</h3><p className="text-[12px] text-gray-500 mb-3">{"Senior Backend Engineer · Last day July 4, 2026"}</p><div className="pt-3 border-t border-gray-100 space-y-2"><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Modules</p><div className="flex flex-wrap gap-1.5">{["Payment Service","CI/CD Pipeline","Shared Libraries","Monitoring & Alerts","Infrastructure as Code"].map(m=><span key={m} className="text-[11px] px-2 py-1 rounded-md bg-gray-50 border border-gray-200 text-gray-700">{m}</span>)}</div></div><div className="pt-3 mt-3 border-t border-gray-100 grid grid-cols-2 gap-3"><div><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">Your activity</p><p className="text-[12px] text-gray-700">0 questions asked</p></div><div><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">Others</p><p className="text-[12px] text-gray-700">2 coworkers active</p></div></div></div><CoworkerNetwork coworkers={coworkers} readOnly/></div>;
}

function CoworkerNetwork({ coworkers=[], onAdd, onRemove, readOnly=false }) {
  const [showAdd, setShowAdd] = useState(false);
  const [addInput, setAddInput] = useState("");
  const handleAdd = () => { if (addInput.trim() && onAdd) { onAdd(addInput); setAddInput(""); setShowAdd(false); } };
  return <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
    <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between"><div className="flex items-center gap-2"><span className="text-sm font-semibold text-gray-900">Coworker network</span><span className="text-[11px] text-gray-500" style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{coworkers.length}</span></div>{!readOnly&&onAdd&&<button onClick={()=>setShowAdd(!showAdd)} className="text-[10px] px-2 py-1 rounded-md border border-violet-200 text-violet-700 bg-violet-50 hover:bg-violet-100 cursor-pointer font-medium">+ Add</button>}</div>
    {coworkers.map(cw=><div key={cw.id} className="px-4 py-2.5 border-b border-gray-100 last:border-b-0 flex items-center gap-3"><div className={`w-8 h-8 rounded-full text-[10px] font-semibold inline-flex items-center justify-center shrink-0 ${cw.source==="manual"?"bg-yellow-50 text-yellow-700 border border-yellow-200":"bg-violet-50 text-violet-700 border border-violet-200"}`}>{cw.initials}</div><div className="flex-1 min-w-0"><div className="flex items-center gap-1.5"><span className="text-[12px] font-medium text-gray-900">{cw.name}</span><span className={`text-[8px] px-1.5 py-0.5 rounded border ${cw.status==="joined"?"bg-emerald-50 text-emerald-700 border-emerald-200":"bg-yellow-50 text-yellow-700 border-yellow-200"}`}>{cw.status==="joined"?"Joined":"Pending"}</span></div><p className="text-[10px] text-gray-500 mt-0.5">{cw.modules.length>0?cw.modules.join(", "):"No module overlap"}</p><p className="text-[9px] text-gray-400 mt-0.5">{cw.source==="trello"?`From Trello · ${cw.sharedCards} shared cards`:"Added by H\u00e0 Vy"}</p></div>{!readOnly&&cw.source==="manual"&&onRemove&&<button onClick={()=>onRemove(cw.id)} className="w-7 h-7 rounded hover:bg-rose-50 inline-flex items-center justify-center text-gray-400 hover:text-rose-500 cursor-pointer shrink-0 text-[20px] leading-none">{"\u00d7"}</button>}</div>)}
    {showAdd&&<div className="px-4 py-2.5 border-t border-violet-200 bg-violet-50/30"><div className="flex gap-1.5"><input value={addInput} onChange={e=>setAddInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAdd()} placeholder="Search by name..." className="flex-1 h-8 px-2.5 rounded-md border border-gray-200 text-[11px] bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"/><button onClick={handleAdd} className="h-8 px-3 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-medium cursor-pointer">Add</button><button onClick={()=>{setShowAdd(false);setAddInput("");}} className="h-8 px-2 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 cursor-pointer"><X className="w-3 h-3"/></button></div></div>}
  </div>;
}

// MV-R04 — confirm before deleting an AI question (it won't be regenerated).
function ConfirmDeleteQ({ onConfirm, onCancel, isAI }) {
  return <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={onCancel}><div className="bg-white rounded-xl shadow-xl p-5 w-[320px] border border-gray-200" onClick={e=>e.stopPropagation()}><h3 className="text-sm font-semibold text-gray-900 mb-1">Remove this question?</h3><p className="text-[12px] text-gray-500 mb-4">{isAI?"The AI won’t regenerate it.":"This removes the question for everyone."}</p><div className="flex gap-2 justify-end"><button onClick={onCancel} className="h-8 px-3 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button><button onClick={onConfirm} className="h-8 px-3 rounded-md bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 cursor-pointer">Remove</button></div></div></div>;
}
// R6-02 — confirmation before bulk-dismissing a module's flags.
function ConfirmDismissFlags({ count, module, onConfirm, onCancel }) {
  return <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={onCancel}><div className="bg-white rounded-xl shadow-xl p-5 w-[340px] border border-gray-200" onClick={e=>e.stopPropagation()}><h3 className="text-sm font-semibold text-gray-900 mb-1">{"Dismiss "}{count}{" flags in "}{module}{"?"}</h3><p className="text-[12px] text-gray-500 mb-4">This removes the flag badges from these cards. Flags are informational metadata checks, not knowledge gaps.</p><div className="flex gap-2 justify-end"><button onClick={onCancel} className="h-8 px-3 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button><button onClick={onConfirm} className="h-8 px-3 rounded-md bg-gray-800 text-white text-sm font-medium hover:bg-gray-900 cursor-pointer">Dismiss</button></div></div></div>;
}
// CD-01 — "Created by [Avatar] [Name]"; avatar colored by role (violet Manager, teal Coworker, gray AI).
function QAttr({ from, fromType }) {
  const isAI = fromType==="ai" || from==="AI-generated";
  const isManager = from==="Hà Vy";
  const av = isAI ? "bg-gray-100 text-gray-500" : isManager ? "bg-violet-100 text-violet-700" : "bg-teal-100 text-teal-700";
  const label = isAI ? "AI" : (from||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const name = isAI ? "AI-generated" : from;
  return <span className="inline-flex items-center gap-1.5 text-[10px] text-gray-500"><span>Created by</span><span className={`w-[18px] h-[18px] rounded-full inline-flex items-center justify-center text-[8px] font-semibold shrink-0 ${av}`}>{label}</span><span className="text-gray-700">{name}</span></span>;
}

function EditableQuestion({ q, onEdit, onDelete, canEdit, hideAttr }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(q.q);
  const [confirmDel, setConfirmDel] = useState(false);
  const isAI = q.fromType==="ai"||q.from==="AI-generated";
  const handleSave = () => { if (editText.trim()) { onEdit(q.id, editText.trim()); setEditing(false); } };
  if (editing) return <div className="flex items-center gap-2 py-1"><input value={editText} onChange={e=>setEditText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")handleSave();if(e.key==="Escape"){setEditText(q.q);setEditing(false);}}} className="flex-1 h-7 px-2 rounded border border-violet-300 text-[12px] focus:outline-none focus:ring-2 focus:ring-violet-500/20" autoFocus/><button onClick={handleSave} className="w-6 h-6 rounded bg-violet-600 text-white inline-flex items-center justify-center cursor-pointer hover:bg-violet-700"><Check className="w-3 h-3"/></button><button onClick={()=>{setEditText(q.q);setEditing(false);}} className="w-6 h-6 rounded border border-gray-300 text-gray-500 inline-flex items-center justify-center cursor-pointer hover:bg-gray-50"><X className="w-3 h-3"/></button></div>;
  return <><div className="flex items-start gap-2 group"><div className="flex-1"><div className="text-[12px] text-gray-900">{q.q}</div>{!hideAttr&&<div className="mt-0.5"><QAttr from={q.from} fromType={q.fromType}/></div>}</div>{canEdit&&<div className="flex items-center gap-1 shrink-0"><button onClick={()=>setEditing(true)} className="w-6 h-6 rounded border border-gray-200 hover:bg-gray-100 inline-flex items-center justify-center text-gray-400 hover:text-violet-600 cursor-pointer" title="Edit question"><Pencil className="w-3 h-3"/></button><button onClick={()=>setConfirmDel(true)} className="w-6 h-6 rounded border border-gray-200 hover:bg-rose-50 inline-flex items-center justify-center text-gray-400 hover:text-rose-600 cursor-pointer" title="Remove question"><X className="w-3 h-3"/></button></div>}</div>{confirmDel&&<ConfirmDeleteQ isAI={isAI} onConfirm={()=>{onDelete(q.id);setConfirmDel(false);}} onCancel={()=>setConfirmDel(false)}/>}</>;
}

const ALL_MOD_NAMES = MODULES_DATA.flatMap(b=>b.modules.map(m=>m.name));
const ALL_CARDS = [
  ...MODULES_DATA.flatMap(b=>b.modules.flatMap(m=>(m.items||[]).map(c=>({card:c,home:m.name})))),
  ...UNCATEGORIZED.map(c=>({card:c,home:"__uncat__"})),
];
// Resolve the source card a queue question belongs to, so the Offboarder can open it "in context" (§8.3).
function findCardForQuestion(q) {
  for (const b of MODULES_DATA) for (const m of b.modules) for (const c of (m.items||[])) { if ((c.qs||[]).some(cq=>cq.q===q.q)) return c; }
  if (q.module) { for (const b of MODULES_DATA) for (const m of b.modules) if (m.name===q.module && (m.items||[]).length) return m.items[0]; }
  for (const b of MODULES_DATA) for (const m of b.modules) if ((m.items||[]).length) return m.items[0];
  return null;
}

function DataContent({ role, stepId, isReady, canEditQs, generalQs, addedModQs, onAddGQ, onEditGQ, onDeleteGQ, onAddModQ, onEditModQ, onDeleteModQ, focusQ, focusKey }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [ctxGap, setCtxGap] = useState(null); // CW-R4-01 — coworker gap-context side panel
  const [gqInput, setGqInput] = useState("");
  const [assignments, setAssignments] = useState({}); // cardName -> moduleName | "__uncat__"
  const [dismissedFlags, setDismissedFlags] = useState(new Set()); // `${cardName}::${flag}`
  const [reasoningCard, setReasoningCard] = useState(null); // §4.6 — open AI Reasoning panel for this card
  const [clsFilter, setClsFilter] = useState("all"); // §4.6 — classification filter tabs
  // R6-02 — lifted satisfaction/needs-more (keyed by question text) so module-level bulk ops can drive it.
  const [satKeys, setSatKeys] = useState(()=>new Set());
  const [moreKeys, setMoreKeys] = useState(()=>new Set());
  const [undoneKeys, setUndoneKeys] = useState(()=>new Set()); // UR-01 — accepted answers that were undone
  const onSatisfyQ = (k)=>{ setSatKeys(s=>{ const n=new Set(s); n.add(k); return n; }); setUndoneKeys(s=>{ const n=new Set(s); n.delete(k); return n; }); };
  const onMoreQ = (k)=>setMoreKeys(s=>{ const n=new Set(s); n.add(k); return n; });
  const onUndoQ = (k)=>{ setSatKeys(s=>{ const n=new Set(s); n.delete(k); return n; }); setUndoneKeys(s=>{ const n=new Set(s); n.add(k); return n; }); }; // UR-01 — revert Accept back to pending
  const onWithdrawQ = (k)=>setMoreKeys(s=>{ const n=new Set(s); n.delete(k); return n; }); // CR-03 — withdraw a revision request
  const satisfyMany = (keys)=>setSatKeys(s=>{ const n=new Set(s); keys.forEach(k=>n.add(k)); return n; });
  const satCtl = { satKeys, moreKeys, undoneKeys, onSatisfyQ, onMoreQ, onUndoQ, onWithdrawQ };
  // CW-04 — deep link: ?card=<name> pre-opens the side panel on that card.
  useEffect(() => { const c = new URLSearchParams(window.location.search).get("card"); if (c) { const found = ALL_CARDS.find(x => x.card.name === c); if (found) setSelectedCard(found.card); } }, []);
  const isCapture = stepId==="capture"; const isDeliver = stepId==="deliver"||stepId==="complete"; const isComplete = stepId==="complete"; const readOnly = isDeliver;
  const clsOn = stepId==="ready"; // WS-01/02 — AI classification (badges · filter tabs · Uncategorized) shows in Prepare only; Capture is "all resolved".
  const canManage = role==="manager" && !readOnly;
  const eff = (x) => assignments[x.card.name] ?? x.home;
  const primaryFor = (modName) => ALL_CARDS.filter(x=>eff(x)===modName).map(x=>x.card);
  const linkedFor = (modName) => ALL_CARDS.filter(x=>eff(x)!==modName && eff(x)!=="__uncat__" && (x.card.linkedIn||[]).includes(modName)).map(x=>x.card);
  const uncats = ALL_CARDS.filter(x=>eff(x)==="__uncat__").map(x=>x.card);
  const primaryModuleOf = (card) => { const x=ALL_CARDS.find(a=>a.card.name===card.name); return x?eff(x):"__uncat__"; };
  const dismissFlag = (key) => setDismissedFlags(prev=>new Set([...prev,key]));
  const restoreFlag = (key) => setDismissedFlags(prev=>{ const n=new Set(prev); n.delete(key); return n; }); // UR-02 — restore a dismissed detect
  // §4.2 — drag-and-drop removed; card reassignment happens via Module Classification Review (§4.6).
  const cardProps = { canManage, dismissedFlags, onDismissFlag:dismissFlag, onRestoreFlag:restoreFlag, primaryModuleOf, selectedCard, onSelectCard:setSelectedCard, clsFilter, clsOn };
  if (role==="offboarder"&&!isCapture&&!isDeliver) return <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center"><h3 className="text-sm font-medium text-gray-700 mb-1">Questions are being collected</h3><p className="text-xs text-gray-500">{"You\u2019ll see them when Capture starts."}</p></div>;
  if (!isReady) return <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center"><div className="w-10 h-10 rounded-full bg-violet-50 inline-flex items-center justify-center mb-3 mx-auto"><div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-violet-500 animate-spin"/></div><h3 className="text-sm font-medium text-gray-700 mb-1">Data is being collected...</h3></div>;
  const drawer = selectedCard&&<><div className="fixed inset-0 bg-black/10 z-30" onClick={()=>{setSelectedCard(null);setReasoningCard(null);}}/><div className="fixed top-0 right-0 h-full w-[480px] bg-white border-l border-gray-200 shadow-xl z-40 overflow-y-auto"><SidePanel key={selectedCard.name} card={selectedCard} role={role} onClose={()=>{setSelectedCard(null);setReasoningCard(null);}} isCapture={isCapture} isDeliver={isDeliver} isComplete={isComplete} primaryModule={primaryModuleOf(selectedCard)} sat={satCtl} clsOn={clsOn} onOpenReasoning={role!=="offboarder"?setReasoningCard:undefined} dismissedFlags={dismissedFlags} onDismissFlag={dismissFlag} onRestoreFlag={restoreFlag}/></div>{reasoningCard&&<AIReasoningPanel card={reasoningCard} onClose={()=>setReasoningCard(null)} readOnly={role==="coworker"}/>}</>;
  // CW-R4-01 / R6-01 — gap-context drawer with a functional "Ask about this gap" for both
  // Coworker and Manager. Attribution differs: Manager → "Hà Vy", Coworker → "Coworker".
  const gapDrawer = ctxGap&&<><div className="fixed inset-0 bg-black/10 z-30" onClick={()=>setCtxGap(null)}/><div className="fixed top-0 right-0 h-full w-[480px] bg-white border-l border-gray-200 shadow-xl z-40 overflow-y-auto"><GapContextPanel moduleName={ctxGap} onClose={()=>setCtxGap(null)} showAsk={role!=="offboarder"} askLabel={role==="manager"?"Hà Vy":"Coworker"}/></div></>;
  if (role==="offboarder" && isCapture) return <div className="relative"><OffboarderQueue focusQ={focusQ} focusKey={focusKey} onSelectCard={setSelectedCard} selectedCard={selectedCard}/>{drawer}</div>;
  const showAnswers = isCapture||isDeliver; const showProgress = isCapture||isDeliver;
  const handleGQAsk = () => { if(gqInput.trim()){ onAddGQ(gqInput); setGqInput(""); } };
  return <div className="relative"><div>
    {!readOnly&&<div className="mb-4 flex items-center gap-2"><input value={gqInput} onChange={e=>setGqInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleGQAsk()} placeholder="Ask a general question..." className="flex-1 h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20"/><button onClick={handleGQAsk} className="h-9 px-3 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium cursor-pointer">Ask</button></div>}
    {!clsOn&&generalQs.length>0&&<div className="rounded-lg border border-violet-200 bg-violet-50/20 mb-3 overflow-hidden"><div className="px-4 py-2.5 bg-violet-50/40 border-b border-violet-200 flex items-center gap-2"><MessageCircle className="w-3.5 h-3.5 text-violet-500"/><span className="text-sm font-semibold text-gray-900">General questions</span><span className="text-[11px] text-gray-500">{generalQs.length}</span></div>{generalQs.map(q=><div key={q.id} className="px-4 py-2.5 border-b border-violet-100 last:border-b-0"><EditableQuestion q={q} onEdit={onEditGQ} onDelete={onDeleteGQ} canEdit={canEditQs}/>{showAnswers&&q.answer&&<AnswerBlock q={q} role={role} committed={isComplete} readOnly={readOnly} sat={satCtl}/>}{isCapture&&!q.answer&&role==="offboarder"&&<AnswerInput/>}</div>)}</div>}
    {/* §4.6 / WS-01 — Module Classification filter tabs (Prepare only) */}
    {clsOn&&<div className="flex items-center gap-1.5 mb-3 flex-wrap">{[["all","All"],["pass","Pass"],["review","Review"],["newmod","New Module"],["uncat","Uncategorized"]].map(([k,lbl])=>{const n=k==="all"?ALL_CARDS.length:ALL_CARDS.filter(x=>classify(x.card).state===k).length;return <button key={k} onClick={()=>setClsFilter(k)} className={`text-[11px] px-2.5 py-1 rounded-md border inline-flex items-center gap-1.5 cursor-pointer ${clsFilter===k?"bg-violet-600 text-white border-violet-600":"bg-white text-gray-600 border-gray-200 hover:border-violet-300 hover:text-violet-700"}`}>{lbl}<span className={`text-[9px] ${clsFilter===k?"text-violet-100":"text-gray-400"}`} style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{n}</span></button>;})}</div>}
    {clsOn&&uncats.length>0&&clsFilter!=="pass"&&clsFilter!=="review"&&clsFilter!=="newmod"&&<div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50/60 mb-3 overflow-hidden"><div className="px-4 py-2.5 border-b border-dashed border-gray-300 flex items-center gap-2"><Inbox className="w-3.5 h-3.5 text-gray-400"/><span className="text-sm font-semibold text-gray-700">Uncategorized</span><span className="text-[11px] text-gray-500">{uncats.length}</span><span className="text-[10px] text-gray-400 ml-1">AI couldn’t confidently assign these — review first</span></div>{uncats.map((card,ci)=><CardRow key={ci} card={card} linked={false} showProgress={showProgress} {...cardProps}/>)}</div>}
    {MODULES_DATA.map((board,bi)=><div key={bi} className="rounded-lg border border-gray-200 bg-white mb-3 overflow-hidden"><div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center gap-2"><Layers className="w-3.5 h-3.5 text-gray-400"/><span className="text-sm font-semibold text-gray-900">{board.board}</span><span className="text-[11px] text-gray-500">{board.boardCards}c</span></div>{board.modules.map((mod,mi)=><ModuleSection key={mi} mod={mod} role={role} isCapture={isCapture} isDeliver={isDeliver} isComplete={isComplete} canEditQs={canEditQs} primaryCards={primaryFor(mod.name)} linkedCards={linkedFor(mod.name)} showProgress={showProgress} addedQs={addedModQs.filter(q=>q.module===mod.name)} onAddModQ={onAddModQ} onEditModQ={onEditModQ} onDeleteModQ={onDeleteModQ} onSeeGapContext={role!=="offboarder"?setCtxGap:undefined} satKeys={satKeys} moreKeys={moreKeys} onSatisfyMany={satisfyMany} {...cardProps}/>)}</div>)}
    {/* Uncategorized \u2014 AI couldn't confidently assign (1:N \u00a75). Drop target for moving cards out of modules. */}
  </div>{drawer}{gapDrawer}</div>;
}

function CardRow({ card, linked, showProgress, canManage, dismissedFlags, onDismissFlag, onRestoreFlag, primaryModuleOf, selectedCard, onSelectCard, clsFilter, clsOn, moduleName }) {
  const isSel = selectedCard?.name===card.name;
  const allFlags = cardFlags(card);
  const flags = allFlags.filter(f=>!dismissedFlags.has(`${card.name}::${f}`)).slice(0,2); // DT-01 — cap active Detects at 2 per row
  const dismissed = allFlags.filter(f=>dismissedFlags.has(`${card.name}::${f}`)); // UR-02 — kept, shown dimmed with Restore
  // CD-02 — Prepare (clsOn) shows empty gray circle for every card (no Q&A yet); Capture/Deliver use real status.
  const st = clsOn ? "none" : cardStatus(card);
  const primaryMod = linked&&primaryModuleOf?primaryModuleOf(card):null;
  const cls = classify(card); const cmeta = CLS_META[cls.state]; // §4.6 — AI classification verdict
  const manualQ = card.qs.filter(q=>q.fromType!=="ai"&&q.from!=="AI-generated").length; // DT-02 — row count matches detail (manual only)
  if (clsOn && clsFilter && clsFilter!=="all" && cls.state!==clsFilter) return null;
  // CS-01 — non-Pass rows in Prepare get a full-row tint + 3px left border so they jump out when scanning.
  const showSignal = clsOn && !isSel && !linked && cls.state!=="pass";
  // CS-02 — the other modules this card belongs to (bidirectional: home + linkedIn, minus the current module).
  const membership = [...new Set([primaryModuleOf?primaryModuleOf(card):null, ...(card.linkedIn||[])].filter(m=>m&&m!=="__uncat__"))];
  const alsoIn = membership.filter(m=>m!==moduleName);
  // IC-01/02/03/04 — status-only left icon, no dashed borders, top-aligned rows, badge next to the title.
  return <div className={`group/row relative w-full flex items-start gap-2 pr-3 py-2 pl-10 border-t border-gray-50 ${isSel?"bg-violet-50 border-l-2 border-l-violet-500":showSignal?cmeta.rowBg:"hover:bg-gray-50"}`} style={showSignal?{borderLeft:cmeta.rowBorder}:undefined}>
    <span className="w-4 shrink-0 inline-flex items-center justify-center mt-0.5" title={st==="done"?"All answered & accepted":st==="pending"?"In progress":"No questions"}>{st==="done"?<CheckCircle2 className="w-3.5 h-3.5 text-emerald-500"/>:st==="pending"?<Circle className="w-3 h-3 text-amber-500" fill="currentColor" strokeWidth={0}/>:<Circle className="w-3 h-3 text-gray-300"/>}</span>
    <button onClick={()=>onSelectCard(card)} className="flex items-start gap-2 flex-1 min-w-0 text-left cursor-pointer"><FileText className={`w-3 h-3 shrink-0 mt-0.5 ${linked?"text-violet-400":"text-gray-400"}`}/><div className="min-w-0"><div className="flex items-center gap-1.5"><span className={`text-[12px] truncate min-w-0 ${linked?"text-gray-500":"text-gray-800"}`}>{card.name}</span>{clsOn&&cls.state!=="pass"&&<span className={`text-[11px] px-2 py-0.5 rounded border inline-flex items-center gap-1 shrink-0 ${cmeta.badge}`} title={`AI: ${cmeta.label}`}>{cls.state==="review"?<AlertTriangle className="w-3 h-3"/>:cls.state==="newmod"?<Sparkles className="w-3 h-3"/>:<Inbox className="w-3 h-3"/>}{cmeta.label}</span>}</div>{alsoIn.length>0&&<span className="text-[10px] text-indigo-500 block truncate">{"Also in: "}{alsoIn.join(", ")}</span>}</div></button>
    {!linked&&flags.map(f=><span key={f} className="group/flag text-[8px] px-1 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-400 inline-flex items-center gap-0.5 shrink-0" title="Detects — mechanical metadata check"><Zap className="w-2 h-2"/>{f}{canManage&&<button onClick={e=>{e.stopPropagation();onDismissFlag(`${card.name}::${f}`);}} className="opacity-0 group-hover/flag:opacity-100 hover:text-rose-600 cursor-pointer text-[12px] leading-none ml-0.5" title="Dismiss">{"×"}</button>}</span>)}
    {!linked&&dismissed.map(f=><span key={`d-${f}`} className="text-[8px] px-1 py-0.5 rounded bg-gray-50 text-gray-400 border border-gray-200 inline-flex items-center gap-0.5 shrink-0 opacity-60" title="Dismissed detect"><Zap className="w-2 h-2"/><span className="line-through">{f}</span>{canManage&&onRestoreFlag&&<button onClick={e=>{e.stopPropagation();onRestoreFlag(`${card.name}::${f}`);}} className="text-violet-500 hover:text-violet-700 cursor-pointer ml-0.5" title="Restore this detect">Restore</button>}</span>)}
    {!clsOn&&flags.length===0&&manualQ>0&&<span className="text-[8px] px-1 py-0.5 rounded bg-violet-50 text-violet-600 shrink-0">{manualQ}Q</span>}
  </div>;
}
function ModuleSection({ mod, role, isCapture, isDeliver, isComplete, canEditQs, primaryCards=[], linkedCards=[], showProgress, addedQs, onAddModQ, onEditModQ, onDeleteModQ, onSeeGapContext, satKeys, moreKeys, onSatisfyMany, canManage, dismissedFlags, onDismissFlag, onRestoreFlag, primaryModuleOf, selectedCard, onSelectCard, clsFilter, clsOn }) {
  const [expanded, setExpanded] = useState(true); const [showModQ, setShowModQ] = useState(false); const [modInput, setModInput] = useState("");
  const [confirmFlags, setConfirmFlags] = useState(false); // R6-02 — confirm bulk flag dismissal
  const [renaming, setRenaming] = useState(false); const [displayName, setDisplayName] = useState(mod.name); const [renameInput, setRenameInput] = useState(mod.name);
  const prog = modProgress(mod); const moduleGaps = mod.moduleGaps||[]; const moduleGapQs = mod.moduleGapQs||[];
  const [gapQs, setGapQs] = useState(moduleGapQs); const [editingGap, setEditingGap] = useState(null); const [gapEditText, setGapEditText] = useState(""); const [confirmGap, setConfirmGap] = useState(null);
  // RF-07 — gap-level edit + remove (Manager/Coworker; Offboarder read-only).
  const [gaps, setGaps] = useState(moduleGaps); const [editingDesc, setEditingDesc] = useState(null); const [descText, setDescText] = useState(""); const [confirmRemove, setConfirmRemove] = useState(null);
  const saveDesc = (gi) => { if(descText.trim()) setGaps(p=>p.map((x,i)=>i===gi?descText.trim():x)); setEditingDesc(null); };
  const removeGap = (gi) => { setGaps(p=>p.map((x,i)=>i===gi?null:x)); setGapQs(p=>p.map((x,i)=>i===gi?null:x)); setConfirmRemove(null); };
  const canManageGap = role!=="offboarder" && !isDeliver;
  const saveGapQ = (gi) => { if(gapEditText.trim()) setGapQs(p=>p.map((x,i)=>i===gi?gapEditText.trim():x)); setEditingGap(null); };
  const delGapQ = (gi) => { setGapQs(p=>p.map((x,i)=>i===gi?null:x)); setEditingGap(null); };
  const readOnly = isDeliver;
  const totalQs = prog.total + addedQs.length; // CR-04 — total = manual card Q + added Q (matches accepted + waiting)
  const cardCount = primaryCards.length + linkedCards.length;
  const cardCommon = { showProgress, canManage, dismissedFlags, onDismissFlag, onRestoreFlag, primaryModuleOf, selectedCard, onSelectCard, clsFilter, clsOn, moduleName: mod.name };
  const handleModAsk = () => { if(modInput.trim()){ onAddModQ(modInput, mod.name); setModInput(""); setShowModQ(false); } };
  const handleRename = () => { if(renameInput.trim()){ setDisplayName(renameInput.trim()); setRenaming(false); } };
  // R6-02 — bulk-op candidates across this module's cards (Manager-only). Satisfy excludes "needs more".
  const moduleCards = [...primaryCards, ...linkedCards];
  const unsatisfiedKeys = moduleCards.flatMap(c=>(c.qs||[]).filter(q=>q.answer && !q.satisfiedBy && !(satKeys&&satKeys.has(q.q)) && !(moreKeys&&moreKeys.has(q.q))).map(q=>q.q));
  const undismissedFlags = moduleCards.flatMap(c=>cardFlags(c).filter(f=>!(dismissedFlags&&dismissedFlags.has(`${c.name}::${f}`))).map(f=>`${c.name}::${f}`));
  const showSatisfyAll = role==="manager" && isCapture && unsatisfiedKeys.length>=2;
  const showDismissAll = canManage && isCapture && undismissedFlags.length>=2; // WS-01/02 — bulk actions in Capture only
  return <div className="border-b border-gray-100 last:border-b-0">
    <div className="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-50">{renaming?<div className="flex items-center gap-2 flex-1" onClick={e=>e.stopPropagation()}><ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${expanded?"":"-rotate-90"}`}/><input value={renameInput} onChange={e=>setRenameInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")handleRename();if(e.key==="Escape"){setRenameInput(displayName);setRenaming(false);}}} className="flex-1 h-7 px-2 rounded border border-violet-300 text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20" autoFocus/><button onClick={handleRename} className="w-6 h-6 rounded bg-violet-600 text-white inline-flex items-center justify-center cursor-pointer hover:bg-violet-700"><Check className="w-3 h-3"/></button><button onClick={()=>{setRenameInput(displayName);setRenaming(false);}} className="w-6 h-6 rounded border border-gray-300 text-gray-500 inline-flex items-center justify-center cursor-pointer hover:bg-gray-50"><X className="w-3 h-3"/></button></div>:<button onClick={()=>setExpanded(!expanded)} className="flex items-center gap-2 flex-1 text-left cursor-pointer"><ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${expanded?"":"-rotate-90"}`}/><span className="text-[13px] font-medium text-gray-900">{"Module: "}{displayName}</span><span className="text-[11px] text-gray-500">{cardCount}c</span>{totalQs>0&&<span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-50 text-violet-600 border border-violet-200">{totalQs}Qs</span>}{moduleGaps.length>0&&<span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-50 text-yellow-700 border border-yellow-200 inline-flex items-center gap-0.5"><Sparkles className="w-2.5 h-2.5"/>{moduleGaps.length}{" gap"}{moduleGaps.length>1?"s":""}</span>}{showProgress&&totalQs>0&&<span className={`text-[9px] px-1.5 py-0.5 rounded border ${prog.answered===totalQs?"bg-emerald-50 text-emerald-700 border-emerald-200":"bg-gray-50 text-gray-600 border-gray-200"}`}>{prog.answered}/{totalQs}</span>}</button>}{role==="manager"&&!readOnly&&!renaming&&<span onClick={e=>{e.stopPropagation();setRenaming(true);setRenameInput(displayName);}} className="text-[10px] text-gray-400 hover:text-violet-600 cursor-pointer shrink-0 ml-2">Rename</span>}</div>
    {expanded&&<>
      {/* Module-level GAPS \u2014 AI-detected missing knowledge (yellow + sparkle), each generates a question (\u00A74). */}
      {gaps.some(Boolean)&&<div className="px-4 py-2 pl-10 border-t border-gray-50 space-y-1.5"><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-0.5">{displayName}{" — "}{gaps.filter(Boolean).length}{" gap"}{gaps.filter(Boolean).length>1?"s":""}</p>{gaps.map((g,gi)=>{if(!g)return null;const gq=gapQs[gi];return <div key={gi} className="group/gap rounded-md bg-yellow-50 border border-yellow-200 px-2.5 py-1.5">{editingDesc===gi?<div className="flex items-center gap-1.5"><input value={descText} onChange={e=>setDescText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")saveDesc(gi);if(e.key==="Escape")setEditingDesc(null);}} autoFocus className="flex-1 h-6 px-1.5 rounded border border-yellow-400 text-[10px] focus:outline-none focus:ring-2 focus:ring-yellow-500/20"/><button onClick={()=>saveDesc(gi)} className="w-5 h-5 rounded bg-yellow-600 text-white inline-flex items-center justify-center cursor-pointer hover:bg-yellow-700"><Check className="w-3 h-3"/></button><button onClick={()=>setEditingDesc(null)} className="w-5 h-5 rounded border border-gray-300 text-gray-500 inline-flex items-center justify-center cursor-pointer hover:bg-gray-50"><X className="w-3 h-3"/></button></div>:<div className="text-[10px] text-yellow-800 flex items-start gap-1.5"><Sparkles className="w-3 h-3 shrink-0 mt-0.5 text-yellow-600"/><span className="font-semibold mr-1">{"GAP #"}{gi+1}{":"}</span><span className="flex-1">{g}</span>{canManageGap&&<span className="flex items-center gap-1 shrink-0 opacity-0 group-hover/gap:opacity-100"><button onClick={()=>{setEditingDesc(gi);setDescText(g);}} className="w-5 h-5 rounded border border-yellow-300 bg-white/60 hover:bg-white inline-flex items-center justify-center text-gray-400 hover:text-yellow-700 cursor-pointer" title="Edit gap"><Pencil className="w-2.5 h-2.5"/></button><button onClick={()=>setConfirmRemove(gi)} className="w-5 h-5 rounded border border-yellow-300 bg-white/60 hover:bg-rose-50 inline-flex items-center justify-center text-gray-400 hover:text-rose-600 cursor-pointer" title="Remove gap"><Trash2 className="w-2.5 h-2.5"/></button></span>}</div>}{gq&&<div className="text-[10px] text-violet-700 flex items-start gap-1.5 mt-1.5 pl-4 border-t border-yellow-200/70 pt-1.5"><HelpCircle className="w-3 h-3 shrink-0 mt-0.5 text-violet-500"/><span className="flex-1"><span className="text-violet-500 font-medium">AI question:</span> {gq}</span>{onSeeGapContext&&<button onClick={()=>onSeeGapContext(mod.name)} className="text-[9px] text-violet-600 hover:text-violet-700 cursor-pointer inline-flex items-center gap-1 shrink-0" title="See why this gap was flagged"><ExternalLink className="w-2.5 h-2.5"/>See in context</button>}</div>}{confirmRemove===gi&&<div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={()=>setConfirmRemove(null)}><div className="bg-white rounded-xl shadow-xl p-5 w-[340px] border border-gray-200" onClick={e=>e.stopPropagation()}><h3 className="text-sm font-semibold text-gray-900 mb-1">Remove this gap?</h3><p className="text-[12px] text-gray-500 mb-4">Its AI-generated questions will be deleted. Manual questions are kept at the module level.</p><div className="flex gap-2 justify-end"><button onClick={()=>setConfirmRemove(null)} className="h-8 px-3 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button><button onClick={()=>removeGap(gi)} className="h-8 px-3 rounded-md bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 cursor-pointer">Remove</button></div></div></div>}</div>;})}</div>}
      {primaryCards.map((card,ci)=><CardRow key={"p"+ci} card={card} linked={false} {...cardCommon}/>)}
      {linkedCards.map((card,ci)=><CardRow key={"l"+ci} card={card} linked={true} {...cardCommon}/>)}
      {cardCount===0&&<div className="px-4 py-2 pl-10 text-[11px] text-gray-400 border-t border-gray-50">No cards</div>}
      {addedQs.length>0&&<div className="px-4 py-2 pl-10 border-t border-gray-100"><p className="text-[9px] text-violet-600 uppercase tracking-wider font-medium mb-1">{"Added questions ("}{addedQs.length}{")"}</p>{addedQs.map(q=><div key={q.id} className="py-1"><EditableQuestion q={q} onEdit={onEditModQ} onDelete={onDeleteModQ} canEdit={canEditQs}/></div>)}</div>}
      {(showSatisfyAll||showDismissAll)&&<div className="px-4 py-2 pl-10 border-t border-gray-100 flex items-center justify-end gap-2">
        {showDismissAll&&<button onClick={()=>setConfirmFlags(true)} className="h-7 px-2.5 rounded-md border border-gray-300 bg-white text-gray-600 text-[10px] font-medium inline-flex items-center gap-1 hover:bg-gray-50 cursor-pointer"><X className="w-3 h-3"/>{"Dismiss all flags ("}{undismissedFlags.length}{")"}</button>}
        {showSatisfyAll&&<button onClick={()=>onSatisfyMany(unsatisfiedKeys)} className="h-7 px-2.5 rounded-md text-[10px] font-medium inline-flex items-center gap-1 cursor-pointer" style={{border:"1px solid #c4b5fd",background:"#f5f3ff",color:"#5b21b6"}}><CheckCircle2 className="w-3 h-3"/>{"Accept remaining ("}{unsatisfiedKeys.length}{")"}</button>}
      </div>}
      {confirmFlags&&<ConfirmDismissFlags count={undismissedFlags.length} module={displayName} onConfirm={()=>{undismissedFlags.forEach(k=>onDismissFlag(k));setConfirmFlags(false);}} onCancel={()=>setConfirmFlags(false)}/>}
    </>}
  </div>;
}

function AnswerBlock({ q, role, committed, readOnly, sat }) {
  // R6-02 — when a `sat` controller is supplied (Manager Data tab), satisfaction/needs-more is
  // lifted so module-level "Accept remaining" can drive it. Otherwise falls back to local state.
  const key = q.q;
  const [localSat, setLocalSat] = useState(false); const [localSent, setLocalSent] = useState(false);
  const [showMore, setShowMore] = useState(false); const [moreText, setMoreText] = useState("");
  const satisfied = (!!q.satisfiedBy || (sat ? sat.satKeys.has(key) : localSat)) && !(sat && sat.undoneKeys && sat.undoneKeys.has(key));
  const sentBack = sat ? sat.moreKeys.has(key) : localSent;
  const doSatisfy = () => { if (sat) sat.onSatisfyQ(key); else setLocalSat(true); };
  const doUndo = () => { if (sat) sat.onUndoQ(key); else setLocalSat(false); }; // UR-01 — revert Accept back to pending
  const doWithdraw = () => { if (sat) sat.onWithdrawQ(key); else setLocalSent(false); }; // CR-03 — withdraw revision request
  const doSendBack = () => { if (sat) sat.onMoreQ(key); else setLocalSent(true); setShowMore(false); };
  return <div className="mt-2"><div className="rounded-md px-3 py-2 bg-gray-50 border-l-2 border-emerald-400"><p className="text-[10px] text-gray-500 mb-1">{q.answeredBy}{" · "}{q.answeredAt}{committed&&<span className="ml-1 text-[8px] px-1 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-0.5"><CheckCircle2 className="w-2 h-2"/>Committed</span>}</p><p className="text-[11px] text-gray-800 leading-relaxed">{q.answer}</p>{q.file&&<p className="text-[10px] text-gray-500 mt-1.5 flex items-center gap-1"><Paperclip className="w-2.5 h-2.5"/>{q.file.name}{" ("}{q.file.size}{")"}</p>}</div>{role!=="offboarder"&&!readOnly&&!committed&&<div className="mt-1.5">{satisfied?<div className="flex items-center gap-2"><p className="text-[10px] text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/>{"Accepted by "}{q.satisfiedBy||"you"}{" · "}{q.satisfiedAt||"now"}</p><button onClick={doUndo} className="text-[10px] text-gray-500 hover:text-gray-700 cursor-pointer">Undo</button></div>:sentBack?<div className="rounded-md bg-yellow-50 border border-yellow-200 px-2.5 py-1.5"><div className="flex items-center justify-between gap-2"><p className="text-[10px] text-yellow-800 font-medium inline-flex items-center gap-1"><RotateCcw className="w-3 h-3"/>Revision requested — sent back to Minh Lê</p><button onClick={doWithdraw} className="text-[10px] text-gray-500 hover:text-gray-700 cursor-pointer shrink-0">Withdraw</button></div>{moreText&&<p className="text-[10px] text-gray-600 mt-0.5 italic">&quot;{moreText}&quot;</p>}</div>:<div className="flex items-center gap-2"><button onClick={doSatisfy} className="h-6 px-2 rounded border border-emerald-300 text-emerald-700 text-[10px] inline-flex items-center gap-1 hover:bg-emerald-50 cursor-pointer"><CheckCircle2 className="w-2.5 h-2.5"/>Accept</button><button onClick={()=>setShowMore(!showMore)} className="h-6 px-2 rounded border border-yellow-300 text-yellow-700 text-[10px] inline-flex items-center gap-1 hover:bg-yellow-50 cursor-pointer">Needs more</button></div>}{showMore&&!sentBack&&!satisfied&&<div className="mt-1.5"><textarea value={moreText} onChange={e=>setMoreText(e.target.value)} placeholder="What's missing? This note goes back to the offboarder with the question." className="w-full h-12 px-2 py-1 rounded border border-yellow-300 text-[10px] resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500/20"/><div className="flex justify-end mt-1"><button onClick={doSendBack} className="h-6 px-2 rounded bg-yellow-600 text-white text-[9px] cursor-pointer hover:bg-yellow-700">Send back</button></div></div>}</div>}{(readOnly||committed)&&satisfied&&<p className="mt-1 text-[10px] text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/>{"Accepted by "}{q.satisfiedBy}{" · "}{q.satisfiedAt}</p>}</div>;
}

function AnswerInput() { return <div className="mt-2"><textarea placeholder="Type your answer..." className="w-full h-16 px-2 py-1.5 rounded border border-gray-200 text-[11px] resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/20"/><div className="flex items-center justify-end mt-1"><button className="h-6 px-2 rounded bg-violet-600 text-white text-[10px] cursor-pointer">Submit</button></div></div>; }

function SidePanel({ card, role, onClose, isCapture, isDeliver, isComplete, primaryModule, sat, onOpenReasoning, clsOn, dismissedFlags, onDismissFlag, onRestoreFlag }) {
  const [followUp, setFollowUp] = useState(""); const showAnswers = isCapture||isDeliver; const readOnly = isDeliver;
  const flags = cardFlags(card);
  const linkedMods = (card.linkedIn||[]); const isUncat = primaryModule==="__uncat__";
  // §8.2 — card questions (incl. AI-generated) are editable/deletable by Manager + Coworker in Prepare. Keyed remount gives fresh state per card.
  const isPrepare = !isCapture && !isDeliver; const canEditQ = !isDeliver && role!=="offboarder"; // CR-01 — manual card-Q edit/remove in Prepare + Capture
  const canManageDetect = role!=="offboarder" && !isDeliver; // CR-02 — dismiss/restore detects from the panel too
  // RF-04 — card Q&A shows ONLY manual (Coworker/Manager) questions; AI gap questions live at the module level.
  const [qs, setQs] = useState(()=>card.qs.filter(q=>q.fromType!=="ai"&&q.from!=="AI-generated").map((q,i)=>({ ...q, id: q.id||`cq${i}`, time: q.time||"2 days ago" })));
  const qRole = (q)=> (q.from==="Hà Vy"||q.from==="Hà Vy") ? "Manager" : "Coworker";
  const qInit = (q)=> (q.from||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const editQ = (id,t)=>setQs(p=>p.map(x=>x.id===id?{...x,q:t}:x));
  const delQ = (id)=>setQs(p=>p.filter(x=>x.id!==id));
  // CR-01 — add a manual question directly on this card (Manager/Coworker).
  const addQ = ()=>{ if(!followUp.trim()) return; setQs(p=>[...p,{ id:`cq${Date.now()}`, q:followUp.trim(), from: role==="manager"?"Hà Vy":"Coworker", fromType:"human", time:"Just now" }]); setFollowUp(""); };
  return <div className="p-5">
    <div className="flex items-center justify-between mb-3"><h3 className="text-[15px] font-semibold text-gray-900">{card.name}</h3><button onClick={onClose} className="w-7 h-7 rounded-md hover:bg-gray-100 inline-flex items-center justify-center text-gray-400 cursor-pointer"><X className="w-4 h-4"/></button></div>
    {/* §4.8 / MC-01/02 — module chip(s). Every chip is clickable (›) and opens the Module Classification panel. In Capture (clsOn=false) all cards read as clean module chips. */}
    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-1 mb-1.5">Module</p>
    <div className="flex flex-wrap gap-1.5 mb-1">{(()=>{const cls=classify(card);const open=onOpenReasoning?()=>onOpenReasoning(card):undefined;
      const plain=()=>{const mods=[primaryModule,...linkedMods].filter(m=>m&&m!=="__uncat__");if(!mods.length)return <button onClick={open} className="text-[10px] px-2 py-0.5 rounded border border-dashed border-gray-300 bg-gray-50 text-gray-500 inline-flex items-center gap-1 cursor-pointer hover:border-violet-300"><Inbox className="w-2.5 h-2.5"/>Uncategorized{open&&<ChevronRight className="w-2.5 h-2.5"/>}</button>;return mods.map(m=><button key={m} onClick={open} className="text-[10px] px-2 py-0.5 rounded border border-violet-200 bg-violet-50 text-violet-700 font-medium inline-flex items-center gap-1 cursor-pointer hover:border-violet-400">{m}{open&&<ChevronRight className="w-2.5 h-2.5 text-violet-400"/>}</button>);};
      if(!clsOn) return plain();
      if(cls.state==="uncat"||isUncat) return <button onClick={open} className="text-[10px] px-2 py-0.5 rounded border border-dashed border-gray-300 bg-gray-50 text-gray-500 inline-flex items-center gap-1 cursor-pointer hover:border-violet-300"><Inbox className="w-2.5 h-2.5"/>Uncategorized{open&&<ChevronRight className="w-2.5 h-2.5"/>}</button>;
      if(cls.state==="review") return <button onClick={open} className="text-[10px] px-2 py-0.5 rounded border border-amber-400 bg-amber-50 text-amber-700 inline-flex items-center gap-1 cursor-pointer">{(cls.candidates&&cls.candidates[0])||primaryModule}<span className="inline-flex items-center gap-0.5"><AlertTriangle className="w-2.5 h-2.5"/>{cls.confidence}%</span>{open&&<ChevronRight className="w-2.5 h-2.5"/>}</button>;
      if(cls.state==="newmod") return <button onClick={open} className="text-[10px] px-2 py-0.5 rounded border border-violet-300 bg-violet-50 text-violet-700 inline-flex items-center gap-1 cursor-pointer"><Sparkles className="w-2.5 h-2.5"/>{cls.newModule}{" · "}{cls.confidence}%{open&&<ChevronRight className="w-2.5 h-2.5"/>}</button>;
      return plain();
    })()}</div>
    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-3 mb-1 pt-2 border-t border-gray-100">Description</p><p className="text-[11px] text-gray-700 leading-relaxed mb-2">{card.desc||<span className="text-gray-400 italic">No description</span>}</p>
    {card.checklist.length>0&&<><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-3 mb-1 pt-2 border-t border-gray-100">Checklist</p>{card.checklist.map((c,i)=><div key={i} className="flex items-center gap-1.5 text-[11px] py-0.5">{c.done?<CheckCircle2 className="w-3 h-3 text-emerald-500"/>:<div className="w-3 h-3 rounded border border-gray-300"/>}<span className={c.done?"text-gray-500 line-through":"text-gray-700"}>{c.text}</span></div>)}</>}
    {/* Flags — mechanical metadata checks, informational only (§4). */}
    {flags.length>0&&<><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-3 mb-1.5 pt-2 border-t border-gray-100">{"Detects ("}{flags.length}{")"}</p><div className="space-y-1 mb-1">{flags.map((f,i)=>{const dis=dismissedFlags&&dismissedFlags.has(`${card.name}::${f}`);return <div key={i} className="flex items-center gap-2"><span className={`text-[10px] px-2 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-400 inline-flex items-center gap-1 ${dis?"opacity-50":""}`}><Zap className="w-2.5 h-2.5"/><span className={dis?"line-through":""}>{f}</span></span>{canManageDetect&&(dis?<button onClick={()=>onRestoreFlag&&onRestoreFlag(`${card.name}::${f}`)} className="text-[10px] text-violet-600 hover:text-violet-700 cursor-pointer">Restore</button>:<button onClick={()=>onDismissFlag&&onDismissFlag(`${card.name}::${f}`)} className="text-[10px] text-gray-500 hover:text-gray-700 cursor-pointer">Dismiss</button>)}</div>;})}</div><p className="text-[9px] text-gray-400 mb-1">Automated metadata checks — informational, not knowledge gaps.</p></>}
    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-3 mb-1 pt-2 border-t border-gray-100">{"Files ("}{(card.files||[]).length}{")"}</p>
    {(card.files||[]).length>0?(card.files||[]).map((f,i)=><div key={i} className="flex items-center gap-2 text-[11px] py-1.5 px-2.5 rounded-md bg-gray-50 mb-1"><Paperclip className="w-3 h-3 text-gray-400 shrink-0"/><span className="text-gray-800 flex-1">{f.name}</span><span className="text-[10px] text-gray-400">{f.size}</span></div>):<p className="text-[11px] text-gray-400 mb-1">No files yet</p>}
    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-3 mb-1 pt-2 border-t border-gray-100">{"Questions ("}{qs.length}{")"}</p>
    {qs.length>0?qs.map((q,i)=><div key={q.id} className="text-[11px] bg-gray-50 rounded-md px-2.5 py-2 mb-1.5">{canEditQ?<EditableQuestion q={q} onEdit={editQ} onDelete={delQ} canEdit hideAttr/>:<p className="text-gray-900 mb-0.5">{q.q}</p>}<div className="mt-0.5 flex items-center gap-1.5 flex-wrap"><QAttr from={q.from} fromType={q.fromType}/><span className="text-gray-300 text-[10px]">·</span><span className="text-[10px] text-gray-400">{q.time}</span></div>{showAnswers&&q.answer&&<AnswerBlock q={q} role={role} committed={isComplete} readOnly={readOnly} sat={sat}/>}{isCapture&&!q.answer&&role==="offboarder"&&<AnswerInput/>}</div>):<p className="text-[11px] text-gray-400 mb-1">No questions yet</p>}
    {role!=="offboarder"&&!readOnly&&<><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-3 mb-1 pt-2 border-t border-gray-100">Add question</p><div className="flex gap-1.5"><input value={followUp} onChange={e=>setFollowUp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addQ()} placeholder="Type a question..." className="flex-1 h-8 px-2.5 rounded-md border border-gray-200 text-[11px] focus:outline-none focus:ring-2 focus:ring-violet-500/20"/><button onClick={addQ} className="h-8 px-2.5 rounded-md bg-violet-600 text-white text-[10px] font-medium cursor-pointer">Ask</button></div></>}
  </div>;
}

function LogsContent({ role, stepId }) {
  if (stepId==="collecting"||(role==="offboarder"&&stepId==="ready")) return <div className="text-center py-8 text-sm text-gray-500">No activity yet</div>;
  const logs = [
    ...(stepId==="complete"?[{ts:"3:42 PM",type:"system",text:"H\u00e0 Vy committed to Knowledge Graph \u2014 9 answers, 5 modules",accent:"#5DCAA5"}]:[]),
    ...(stepId==="deliver"||stepId==="complete"?[{ts:"2:30 PM",type:"system",text:"H\u00e0 Vy moved session to Deliver"}]:[]),
    ...(["capture","deliver","complete"].includes(stepId)?[
      {ts:"2:15 PM",type:"questions",text:"Minh L\u00ea answered about token refresh"},
      {ts:"1:40 PM",type:"questions",text:"Coworker A accepted: webhook events"},
      {ts:"12:50 PM",type:"questions",text:"Minh L\u00ea answered about retry logic"},
      {ts:"11:05 AM",type:"system",text:"Capture started \u2014 Minh L\u00ea notified"},
    ]:[]),
    {ts:"10:45 AM",type:"questions",text:"Coworker asked about escalations"},
    {ts:"10:32 AM",type:"system",text:"Crawl complete \u2014 64 cards, 5 modules"},
    {ts:"10:24 AM",type:"system",text:"Session created by H\u00e0 Vy"},
  ];
  return <div className="space-y-1.5"><div className="flex gap-2 mb-3">{["All","System","Questions","Edits"].map(f=><button key={f} className={`px-2.5 py-1 rounded-md text-[11px] cursor-pointer ${f==="All"?"bg-violet-50 text-violet-700 font-medium":"text-gray-500 hover:bg-gray-100"}`}>{f}</button>)}</div>{logs.map((l,i)=>{const border=l.accent||(l.type==="system"?"rgb(229,231,235)":l.type==="questions"?"rgb(124,58,237)":"rgb(234,179,8)");return <div key={i} className="flex items-start gap-3 px-3 py-2 rounded-md border border-gray-200 bg-white" style={{borderLeft:`2px solid ${border}`,borderRadius:0}}><span className="text-[10px] text-gray-500 shrink-0 mt-0.5" style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{l.ts}</span><span className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-medium shrink-0 ${l.type==="questions"?"bg-violet-50 text-violet-600":l.type==="files"?"bg-yellow-50 text-yellow-700":"bg-gray-100 text-gray-500"}`}>{l.type}</span><span className="text-[11px] text-gray-900">{l.text}</span></div>})}</div>;
}

export function ProgressBar() { return <div className="flex items-center gap-3 mb-1"><div className="flex-1 h-[6px] rounded-full bg-gray-200 overflow-hidden"><div className="h-full rounded-full bg-violet-500" style={{width:`${Math.round(SESSION.answered/SESSION.questions*100)}%`}}/></div><span className="text-[11px] text-gray-700 font-medium" style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{SESSION.answered}/{SESSION.questions}</span></div>; }
export function MC({ l, v }) { return <div className="rounded-md bg-gray-50 border border-gray-200 px-3 py-2"><div className="text-[9px] text-gray-500 uppercase tracking-wider font-medium">{l}</div><div className="text-lg font-semibold text-gray-900 mt-0.5" style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{v}</div></div>; }

/* AI categorization animation — cartoon explainer of HOW the AI sorts cards (placeholder data, loops). CL-session 2025-06-25 §6.
   4 scenes: simple match → second match → 1:N split (one card, two modules — equal weight) → no match (Uncategorized). */
function CategorizeAnimation() {
  const buckets = [
    { label: "Module 1", left: 31, bg: "#f5f3ff", bd: "#c4b5fd", fg: "#6d28d9" },
    { label: "Module 2", left: 121, bg: "#eff6ff", bd: "#bfdbfe", fg: "#1d4ed8" },
    { label: "Module 3", left: 211, bg: "#fdf2f8", bd: "#fbcfe8", fg: "#be185d" },
    { label: "Uncat.", left: 311, bg: "#f9fafb", bd: "#e5e7eb", fg: "#6b7280" },
  ];
  return <div className="rounded-lg border border-gray-200 bg-white p-5">
    <div className="flex items-center justify-center gap-2 mb-0.5"><Sparkles className="w-4 h-4 text-violet-500"/><h3 className="text-sm font-semibold text-gray-900">Organizing knowledge…</h3></div>
    <p className="text-[11px] text-gray-500 text-center mb-3">The AI reads each card and sorts it into the right module. Here&apos;s how.</p>
    <style>{`
      .cat-card{position:absolute;left:197px;top:11px;width:26px;height:26px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;box-shadow:0 1px 3px rgba(0,0,0,.12);opacity:0;will-change:transform,opacity}
      .cat-hub{position:absolute;left:194px;top:4px;width:32px;height:32px;border-radius:9999px;background:#ede9fe;border:1px solid #c4b5fd;display:flex;align-items:center;justify-content:center;animation:cat-pulse 1.6s ease-in-out infinite}
      @keyframes cat-pulse{0%,100%{box-shadow:0 0 0 0 rgba(167,139,250,.45)}50%{box-shadow:0 0 0 7px rgba(167,139,250,0)}}
      @keyframes cat-a{0%{opacity:0;transform:translate(0,0) scale(.5)}3%{opacity:1;transform:translate(0,0) scale(1)}16%{opacity:1;transform:translate(-140px,124px) scale(1)}20%{transform:translate(-140px,124px) scale(1.2)}24%{opacity:1;transform:translate(-140px,124px) scale(1)}27%{opacity:0}100%{opacity:0;transform:translate(-140px,124px)}}
      @keyframes cat-b{0%,25%{opacity:0;transform:translate(0,0) scale(.5)}28%{opacity:1;transform:translate(0,0) scale(1)}41%{opacity:1;transform:translate(-50px,124px) scale(1)}45%{transform:translate(-50px,124px) scale(1.2)}49%{opacity:1;transform:translate(-50px,124px) scale(1)}52%{opacity:0}100%{opacity:0;transform:translate(-50px,124px)}}
      @keyframes cat-cp{0%,50%{opacity:0;transform:translate(0,0) scale(.5)}53%{opacity:1;transform:translate(0,0) scale(1)}60%{transform:translate(0,38px) scale(1)}68%{opacity:1;transform:translate(-140px,124px) scale(1)}72%{transform:translate(-140px,124px) scale(1.2)}76%{opacity:1;transform:translate(-140px,124px) scale(1)}79%{opacity:0}100%{opacity:0;transform:translate(-140px,124px)}}
      @keyframes cat-cl{0%,57%{opacity:0;transform:translate(0,38px) scale(.85)}60%{opacity:1;transform:translate(0,38px) scale(.85)}68%{opacity:1;transform:translate(40px,124px) scale(.85)}76%{opacity:1;transform:translate(40px,124px) scale(.85)}79%{opacity:0}100%{opacity:0;transform:translate(40px,124px)}}
      @keyframes cat-d{0%,75%{opacity:0;transform:translate(0,0) scale(.5)}78%{opacity:1;transform:translate(0,0) scale(1)}84%{transform:translate(0,46px) rotate(-12deg)}87%{transform:translate(0,46px) rotate(12deg)}90%{transform:translate(0,46px) rotate(-8deg)}96%{opacity:1;transform:translate(140px,124px) rotate(0)}99%{opacity:0}100%{opacity:0;transform:translate(140px,124px)}}
      .cat-a{animation:cat-a 9s linear infinite}.cat-b{animation:cat-b 9s linear infinite}.cat-cp{animation:cat-cp 9s linear infinite}.cat-cl{animation:cat-cl 9s linear infinite}.cat-d{animation:cat-d 9s linear infinite}
      .cat-cap{position:absolute;left:0;right:0;top:0;text-align:center;font-size:11px;font-weight:500;opacity:0}
      @keyframes cap-a{0%,1%{opacity:0}5%,22%{opacity:1}26%{opacity:0}100%{opacity:0}}
      @keyframes cap-b{0%,27%{opacity:0}30%,47%{opacity:1}51%{opacity:0}100%{opacity:0}}
      @keyframes cap-c{0%,52%{opacity:0}55%,74%{opacity:1}78%{opacity:0}100%{opacity:0}}
      @keyframes cap-d{0%,77%{opacity:0}80%,97%{opacity:1}100%{opacity:0}}
      .cap-a{animation:cap-a 9s linear infinite}.cap-b{animation:cap-b 9s linear infinite}.cap-c{animation:cap-c 9s linear infinite}.cap-d{animation:cap-d 9s linear infinite}
      @media (prefers-reduced-motion: reduce){.cat-card,.cat-hub,.cat-cap{animation:none!important}.cat-card{opacity:.25!important}}
    `}</style>
    <div className="relative mx-auto h-5" style={{width:420}}>
      <span className="cat-cap cap-a text-violet-700">Clear match → one module</span>
      <span className="cat-cap cap-b text-blue-700">Another clear match</span>
      <span className="cat-cap cap-c text-gray-700">2 matches → <span className="text-violet-700">both modules</span> · <span className="text-gray-500">equal weight</span></span>
      <span className="cat-cap cap-d text-gray-500">No confident match → Uncategorized</span>
    </div>
    <div className="relative mx-auto" style={{width:420,height:180}}>
      <div className="cat-hub"><Sparkles className="w-4 h-4 text-violet-600"/></div>
      <div className="cat-card cat-a" style={{background:"#f5f3ff",border:"1px solid #c4b5fd",color:"#6d28d9"}}>A</div>
      <div className="cat-card cat-b" style={{background:"#eff6ff",border:"1px solid #bfdbfe",color:"#1d4ed8"}}>B</div>
      <div className="cat-card cat-cp" style={{background:"#f5f3ff",border:"1px solid #c4b5fd",color:"#6d28d9"}}>C</div>
      <div className="cat-card cat-cl" style={{background:"#fdf2f8",border:"1px solid #fbcfe8",color:"#be185d"}}>C</div>
      <div className="cat-card cat-d" style={{background:"#f9fafb",border:"1px solid #e5e7eb",color:"#6b7280"}}>D</div>
      {buckets.map(b=><div key={b.label} className="absolute flex items-center justify-center text-[9px] font-semibold" style={{left:b.left,top:140,width:78,height:30,borderRadius:8,background:b.bg,border:`1px solid ${b.bd}`,color:b.fg}}>{b.label}</div>)}
    </div>
    <p className="text-center text-[11px] text-gray-500 mt-2 inline-flex items-center justify-center gap-1 w-full" style={{fontFamily:"ui-monospace,Menlo,monospace"}}>Sorting cards… 12 · 28 · 47 · 64 <CheckCircle2 className="w-3 h-3 text-emerald-500"/></p>
  </div>;
}
