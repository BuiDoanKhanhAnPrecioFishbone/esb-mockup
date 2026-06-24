"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, X, CheckCircle2, Clock, AlertTriangle, Sparkles, Bell, Layers, User, FileText, ChevronDown, Plus, MessageCircle, Paperclip, Pencil, Trash2, Check } from "lucide-react";
import { DeliverOverview, CompleteOverview } from "./session-deliver";
import { useViewAs } from "@/lib/view-as";

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
  { id: "collecting", label: "Collecting data", trigger: "Crawl running \u2014 3 boards." },
  { id: "ready", label: "Ready for review", trigger: "5 modules, 14 questions, 6 gaps." },
  { id: "capture", label: "Capture (active)", trigger: "9 of 14 answered, 7 satisfied." },
  { id: "deliver", label: "Deliver (review)", trigger: "Manager reviewing before KG commit." },
  { id: "complete", label: "Complete", trigger: "Committed to Knowledge Graph." },
];
export const SESSION = { id: "minh-le", name: "Minh L\u00ea", role: "Senior Backend Engineer", dept: "Engineering", initials: "ML", daysLeft: 22, deadline: "Jun 30, 2026", boards: 3, cards: 64, modules: 5, questions: 14, gaps: 6, coworkers: 3, answered: 9, satisfied: 7, gapsAddressed: 4, files: 3 };
const SEED_GQ = [
  { id: "gq1", q: "What\u2019s the process for handling customer escalations?", from: "Coworker", fromType: "human", answer: "On-call engineer first. P1: page lead via PagerDuty. Engineering provides RCA within 24h.", answeredBy: "Minh L\u00ea", answeredAt: "1d ago", satisfiedBy: "H\u00e0 Vy", satisfiedAt: "3h" },
  { id: "gq2", q: "Are there any undocumented vendor agreements I should know about?", from: "H\u00e0 Vy", fromType: "human" },
];
const OB_QUEUE = [
  { id: "obq1", q: "What are the undocumented rate limits on the payment API?", from: "Coworker", fromType: "human", module: "Payment Service", answered: false },
  { id: "obq2", q: "Is there a runbook for the nightly batch job failures?", from: "Coworker", fromType: "human", module: "CI/CD Pipeline", answered: false },
  { id: "obq3", q: "What's the rollback procedure for the Atlas migration?", from: "H\u00e0 Vy", fromType: "human", module: "CI/CD Pipeline", answered: false },
  { id: "obq4", q: "How does the Kafka retry logic handle poison messages?", from: "AI-generated", fromType: "ai", module: "Payment Service", answered: false },
  { id: "obq5", q: "Who owns the vendor XYZ contract renewal?", from: "AI-generated", fromType: "ai", module: "Inventory Sync", answered: false },
  { id: "oba1", q: "Where is the API key rotation doc?", module: "Shared Libraries", answered: true, satisfied: true, answer: "Engineering wiki at /security/api-key-rotation.md. Rotates every 90 days via GitHub Action." },
  { id: "oba2", q: "Who should I contact about the SLA penalty terms?", module: "Inventory Sync", answered: true, satisfied: false, answer: "Talk to Linh Ph\u1ea1m in Procurement \u2014 she handled the last renewal. SLA doc at /vendor-contracts." },
];

const SEED_COWORKERS = [
  { id: "cw1", name: "Tr\u1ea7n H\u1eefu Nam", initials: "TN", modules: ["Payment Service", "CI/CD Pipeline"], sharedCards: 14, source: "trello", status: "joined" },
  { id: "cw2", name: "Linh Anh", initials: "LA", modules: ["Monitoring & Alerts"], sharedCards: 6, source: "trello", status: "joined" },
  { id: "cw3", name: "B\u1ea3o Nguy\u1ec5n", initials: "BN", modules: ["Infrastructure as Code"], sharedCards: 0, source: "manual", status: "pending" },
];
export const MODULES_DATA = [
  { board: "Backend Services", boardCards: 34, modules: [
    { name: "Payment Service", cards: 12, qs: 4, gaps: 1, moduleGaps: ["No disaster recovery or failover procedures documented"], items: [
      { name: "Kafka retry configuration", desc: "DLQ routing, backoff strategy, poison message handling. Max 5 retries.", checklist: [{ text: "DLQ routing configured", done: true }, { text: "Backoff documented", done: false }, { text: "Alert on failures", done: false }], gaps: ["Incomplete checklist (2/3 not done)"], gapQs: ["How does the retry logic handle poison messages?"], files: [{ name: "kafka-config.yaml", size: "3.2 KB" }], qs: [
        { q: "How does the retry logic handle poison messages?", from: "AI-generated", answer: "After 5 retries with exponential backoff, messages route to the DLQ. Monitor via Datadog alert #4421.", answeredBy: "Minh L\u00ea", answeredAt: "2h ago", file: { name: "dlq-replay-runbook.pdf", size: "12 KB" }, satisfiedBy: "Coworker A", satisfiedAt: "30m" },
        { q: "Max retry count before DLQ routing?", from: "AI-generated", answer: "Max 5, configurable per topic in kafka-config.yaml. Backoff: 2x from 500ms.", answeredBy: "Minh L\u00ea", answeredAt: "1h ago" },
      ] },
      { name: "Payment gateway timeout", desc: "Circuit breaker pattern, 30s timeout.", checklist: [], gaps: [], files: [], qs: [{ q: "What happens when gateway times out mid-transaction?", from: "AI-generated" }] },
      { name: "Stripe webhook handler", desc: "Payment confirmations and refunds.", checklist: [], gaps: [], files: [], qs: [{ q: "Which webhook events are critical vs optional?", from: "Coworker", answer: "Critical: payment_intent.succeeded, charge.refunded, invoice.payment_failed. Optional \u2192 batch queue.", answeredBy: "Minh L\u00ea", answeredAt: "45m", satisfiedBy: "Coworker A", satisfiedAt: "20m" }] },
      { name: "Refund reconciliation", desc: "Nightly Stripe\u2194ledger reconciliation.", checklist: [], gaps: [], files: [], qs: [] },
      { name: "Currency conversion", desc: "ECB API rates, 04:00 UTC.", checklist: [{ text: "Fallback on API failure", done: true }], gaps: [], files: [], qs: [] },
    ]},
    { name: "CI/CD Pipeline", cards: 8, qs: 3, gaps: 1, moduleGaps: ["Deployment described differently across modules"], items: [
      { name: "Atlas migration rollback", desc: "Migration procedures and rollback.", checklist: [], gaps: ["Missing description"], gapQs: ["Rollback procedure?"], files: [], qs: [{ q: "Rollback procedure for failed Atlas migrations?", from: "H\u00e0 Vy", answer: "Run /scripts/atlas-rollback.sh with migration ID. Snapshot before (7d expiry).", answeredBy: "Minh L\u00ea", answeredAt: "4h ago", satisfiedBy: "H\u00e0 Vy", satisfiedAt: "2h" }] },
      { name: "GitHub Actions workflow", desc: "lint\u2192test\u2192build\u2192deploy. Node 18/20.", checklist: [{ text: "Staging automated", done: true }, { text: "Prod approval", done: true }], gaps: [], files: [], qs: [{ q: "Runbook for nightly batch failures?", from: "Coworker", answer: "Check Actions logs, rerun transient. 3x fails: check Datadog.", answeredBy: "Minh L\u00ea", answeredAt: "3h ago" }] },
      { name: "Docker image caching", desc: "Layer caching in GHCR.", checklist: [], gaps: [], files: [], qs: [] },
    ]},
    { name: "Shared Libraries", cards: 6, qs: 2, gaps: 0, items: [
      { name: "API key rotation", desc: "90-day rotation via GitHub Action.", checklist: [{ text: "Schedule documented", done: true }, { text: "Auto-rotation on", done: true }], gaps: [], files: [{ name: "api-key-rotation.md", size: "1.8 KB" }], qs: [{ q: "Where is the rotation runbook?", from: "AI-generated", answer: "Wiki: /security/api-key-rotation.md. Ping DevOps on failure.", answeredBy: "Minh L\u00ea", answeredAt: "5h ago", satisfiedBy: "H\u00e0 Vy", satisfiedAt: "4h" }] },
      { name: "Logging middleware", desc: "Structured logging + PII redaction.", checklist: [], gaps: [], files: [], qs: [] },
      { name: "Auth token validator", desc: "JWT. RS256 + EdDSA.", checklist: [], gaps: [], files: [], qs: [{ q: "Token refresh strategy?", from: "AI-generated", answer: "15-min access, 7-day refresh HTTP-only cookies. Failure \u2192 login.", answeredBy: "Minh L\u00ea", answeredAt: "6h ago", satisfiedBy: "Coworker A", satisfiedAt: "5h" }] },
    ]},
  ]},
  { board: "Platform Infrastructure", boardCards: 18, modules: [
    { name: "Monitoring & Alerts", cards: 10, qs: 3, gaps: 1, moduleGaps: ["SLA commitments undocumented"], items: [
      { name: "Datadog dashboard", desc: "SLO tracking. P50/P95/P99.", checklist: [], gaps: ["Thresholds undocumented"], gapQs: ["Critical alert thresholds?"], files: [], qs: [{ q: "Critical alert thresholds?", from: "AI-generated" }] },
      { name: "PagerDuty escalation", desc: "Primary\u2192secondary\u2192eng mgr.", checklist: [{ text: "Rotation current", done: true }], gaps: [], files: [{ name: "oncall-schedule.pdf", size: "45 KB" }], qs: [] },
      { name: "Log aggregation", desc: "Fluentd\u2192ES\u2192Kibana.", checklist: [], gaps: [], files: [], qs: [{ q: "Log retention policy?", from: "AI-generated" }] },
    ]},
    { name: "Infrastructure as Code", cards: 8, qs: 2, gaps: 0, items: [
      { name: "Terraform modules", desc: "VPC, EKS, RDS. S3+DynamoDB.", checklist: [], gaps: [], files: [], qs: [{ q: "Terraform version pinned?", from: "AI-generated" }] },
      { name: "Helm chart templates", desc: "Deployments + monitoring sidecar.", checklist: [], gaps: [], files: [], qs: [{ q: "Helm overrides per env?", from: "AI-generated" }] },
      { name: "Secrets management", desc: "Vault via sidecar.", checklist: [{ text: "Auto-unseal on", done: true }, { text: "Rotation automated", done: false }], gaps: [], files: [], qs: [] },
    ]},
  ]},
];

let qId = 200;
function cardStatus(c) { if (!c.qs||c.qs.length===0) return "none"; return c.qs.filter(q=>q.answer).length===c.qs.length?"done":"pending"; }
export function modProgress(m) { if (!m.items) return {total:m.qs,answered:0}; let t=0,a=0; m.items.forEach(c=>c.qs.forEach(q=>{t++;if(q.answer)a++})); return {total:t,answered:a}; }

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
  const canEditQs = isPrepare && role!=="offboarder";
  const tabs = [{id:"overview",label:"Overview"},{id:"data",label:"Data",disabled:role==="offboarder"&&isPrepare},{id:"logs",label:"Logs",hidden:role==="coworker"}];
  const addGQ = (text) => { if (!text.trim()) return; setGeneralQs(prev => [...prev, { id: `gq${++qId}`, q: text.trim(), from: "H\u00e0 Vy", fromType: "human" }]); };
  const editGQ = (id, text) => { setGeneralQs(prev => prev.map(q => q.id === id ? { ...q, q: text } : q)); };
  const deleteGQ = (id) => { setGeneralQs(prev => prev.filter(q => q.id !== id)); };
  const addModQ = (text, modName) => { if (!text.trim()) return; setAddedModQs(prev => [...prev, { id: `mq${++qId}`, q: text.trim(), from: "H\u00e0 Vy", fromType: "human", module: modName }]); };
  const editModQ = (id, text) => { setAddedModQs(prev => prev.map(q => q.id === id ? { ...q, q: text } : q)); };
  const deleteModQ = (id) => { setAddedModQs(prev => prev.filter(q => q.id !== id)); };
  const [coworkers, setCoworkers] = useState(SEED_COWORKERS);
  const addCoworker = (name) => { if (!name.trim()) return; const initials = name.trim().split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(); setCoworkers(prev => [...prev, { id: `cw${Date.now()}`, name: name.trim(), initials, modules: [], sharedCards: 0, source: "manual", status: "pending" }]); };
  const removeCoworker = (id) => { setCoworkers(prev => prev.filter(cw => cw.id !== id)); };
  return <div className="max-w-5xl mx-auto p-6"><HeroBar phase={phase} stepId={stepId}/><div className="flex gap-0 border-b border-gray-200 mb-5">{tabs.filter(t=>!t.hidden).map(t=><button key={t.id} onClick={()=>!t.disabled&&setActiveTab(t.id)} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${activeTab===t.id?"border-violet-600 text-gray-900":t.disabled?"border-transparent text-gray-300 cursor-not-allowed":"border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>{t.label}</button>)}</div>{activeTab==="overview"&&<OverviewContent role={role} stepId={stepId} isReady={isReady} onSwitchTab={setActiveTab} onOpenQuestion={openQuestion} coworkers={coworkers} onAddCoworker={addCoworker} onRemoveCoworker={removeCoworker}/>}{activeTab==="data"&&<DataContent role={role} stepId={stepId} isReady={isReady} canEditQs={canEditQs} generalQs={generalQs} addedModQs={addedModQs} onAddGQ={addGQ} onEditGQ={editGQ} onDeleteGQ={deleteGQ} onAddModQ={addModQ} onEditModQ={editModQ} onDeleteModQ={deleteModQ} focusQ={focusQ} focusKey={focusKey}/>}{activeTab==="logs"&&<LogsContent role={role} stepId={stepId}/>}</div>;
}

function HeroBar({ phase, stepId }) {
  const cls = {prepare:"bg-blue-50 border-blue-200 text-blue-700",capture:"bg-violet-50 border-violet-200 text-violet-700",deliver:"bg-emerald-50 border-emerald-200 text-emerald-700"};
  const label = stepId==="complete"?"Complete":phase==="prepare"?"Prepare":phase==="capture"?"Capture":"Deliver";
  const metrics = phase==="prepare"?`${SESSION.coworkers} coworkers \u00b7 ${SESSION.questions} Qs \u00b7 ${SESSION.gaps} gaps`:phase==="capture"?`${SESSION.answered}/${SESSION.questions} answered \u00b7 ${SESSION.satisfied} satisfied`:stepId==="complete"?`${SESSION.answered} committed \u00b7 ${SESSION.files} files`:`${SESSION.answered}/${SESSION.questions} answered \u00b7 reviewing`;
  return <div className="rounded-lg border border-gray-200 bg-white p-4 mb-5 flex items-center gap-4"><div className={`w-12 h-12 rounded-full ${stepId==="complete"?"bg-emerald-100 text-emerald-700":"bg-violet-100 text-violet-700"} text-sm font-semibold inline-flex items-center justify-center shrink-0`}>{stepId==="complete"?<CheckCircle2 className="w-5 h-5"/>:SESSION.initials}</div><div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-0.5"><h1 className="text-lg font-semibold text-gray-900">{SESSION.name}&apos;s session</h1><span className={`text-[9px] px-2 py-0.5 rounded uppercase tracking-wider font-semibold border ${cls[phase]}`}>{label}</span></div><p className="text-[12px] text-gray-500">{SESSION.role}{" \u00b7 "}{SESSION.dept}</p><p className="text-[11px] text-gray-500 mt-0.5" style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{stepId!=="complete"?`${SESSION.daysLeft}d left \u00b7 `:""}{metrics}</p></div></div>;
}

function OverviewContent({ role, stepId, isReady, onSwitchTab, onOpenQuestion, coworkers, onAddCoworker, onRemoveCoworker }) {
  if (stepId==="complete") return <CompleteOverview role={role} S={SESSION} MC={MC}/>;
  if (stepId==="deliver") return <DeliverOverview role={role} onSwitchTab={onSwitchTab} S={SESSION} MD={MODULES_DATA} modProgress={modProgress} MC={MC} ProgressBar={ProgressBar}/>;
  if (role==="offboarder") return <OffboarderOverview stepId={stepId} onSwitchTab={onSwitchTab} onOpenQuestion={onOpenQuestion}/>;
  if (role==="coworker") return <CoworkerOverview stepId={stepId} isReady={isReady} onSwitchTab={onSwitchTab} coworkers={coworkers}/>;
  return <ManagerOverview stepId={stepId} isReady={isReady} onSwitchTab={onSwitchTab} coworkers={coworkers} onAddCoworker={onAddCoworker} onRemoveCoworker={onRemoveCoworker}/>;
}

function ManagerOverview({ stepId, isReady, onSwitchTab, coworkers, onAddCoworker, onRemoveCoworker }) {
  if (!isReady) return <div className="rounded-lg border border-gray-200 bg-white p-6 text-center"><div className="w-10 h-10 rounded-full bg-violet-50 inline-flex items-center justify-center mb-3 mx-auto"><div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-violet-500 animate-spin"/></div><h3 className="text-sm font-medium text-gray-900 mb-1">{"Collecting data from "}{SESSION.boards}{" boards..."}</h3><p className="text-xs text-gray-500">{"We\u2019ll notify you when ready."}</p></div>;
  if (stepId==="capture") return <div className="space-y-4"><div className="rounded-lg border border-gray-200 bg-white p-5"><h3 className="text-sm font-semibold text-gray-900 mb-3">Capture in progress</h3><ProgressBar/><p className="text-[11px] text-gray-500 mb-4">{SESSION.questions-SESSION.answered}{" questions remaining"}</p><div className="grid grid-cols-3 gap-3"><MC l="Satisfied" v={SESSION.satisfied}/><MC l="Waiting review" v={SESSION.answered-SESSION.satisfied}/><MC l="Gaps addressed" v={`${SESSION.gapsAddressed}/${SESSION.gaps}`}/></div><p className="text-[11px] text-gray-500 mt-3" style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{"Started 3d ago \u00b7 "}{SESSION.daysLeft}{"d left"}</p></div><CoworkerNetwork coworkers={coworkers} readOnly/><div className="flex items-center gap-3"><button onClick={()=>onSwitchTab("data")} className="h-9 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">Review in Data tab</button><button className="h-9 px-4 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium inline-flex items-center gap-2 cursor-pointer">{"Move to Deliver"}<ArrowRight className="w-3.5 h-3.5"/></button></div></div>;
  return <div className="space-y-4"><div className="rounded-lg border border-gray-200 bg-white p-5"><h3 className="text-sm font-semibold text-gray-900 mb-3">Data collection complete</h3><div className="grid grid-cols-4 gap-3 mb-4"><MC l="Boards" v={SESSION.boards}/><MC l="Cards" v={SESSION.cards}/><MC l="Areas" v={SESSION.modules}/><MC l="Questions" v={SESSION.questions}/></div><div className="pt-3 border-t border-gray-100 space-y-2"><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Knowledge areas</p><div className="flex flex-wrap gap-1.5">{["Payment Service","CI/CD Pipeline","Shared Libraries","Monitoring & Alerts","Infrastructure as Code"].map(m=><span key={m} className="text-[11px] px-2 py-1 rounded-md bg-gray-50 border border-gray-200 text-gray-700">{m}</span>)}</div></div><div className="pt-3 mt-3 border-t border-gray-100 grid grid-cols-2 gap-3"><div><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">Coworker engagement</p><p className="text-[12px] text-gray-700">2 of 3 have asked questions</p></div><div><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">Knowledge gaps</p><p className="text-[12px] text-gray-700">6 gaps (3 card + 3 AI)</p></div></div></div><CoworkerNetwork coworkers={coworkers} onAdd={onAddCoworker} onRemove={onRemoveCoworker} readOnly={false}/><div className="flex items-center gap-3"><button onClick={()=>onSwitchTab("data")} className="h-9 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">Review in Data tab</button><Link href={`/session/${SESSION.id}`} className="h-9 px-4 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium inline-flex items-center gap-2">{"Start Capture"}<ArrowRight className="w-3.5 h-3.5"/></Link></div></div>;
}

function OffboarderOverview({ stepId, onSwitchTab, onOpenQuestion }) {
  if (stepId!=="capture") return <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center"><div className="w-12 h-12 rounded-full bg-gray-100 inline-flex items-center justify-center mb-3 mx-auto"><Clock className="w-5 h-5 text-gray-400" strokeWidth={1.5}/></div><h3 className="text-sm font-medium text-gray-700 mb-1">Your session is being prepared</h3><p className="text-xs text-gray-500">{"You\u2019ll be notified when your question queue is ready."}</p></div>;
  const waiting = OB_QUEUE.filter(q=>!q.answered); const answered = OB_QUEUE.filter(q=>q.answered);
  const QCard = ({ q, done }) => (<button onClick={()=>onOpenQuestion(q.id)} className="w-full text-left block rounded-lg border border-gray-200 bg-white px-4 py-3 hover:border-violet-300 hover:shadow-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500/20"><div className="text-[13px] text-gray-900 mb-1">{q.q}</div><div className="text-[11px] text-gray-500 flex items-center gap-1.5">{done?<CheckCircle2 className="w-3 h-3 text-emerald-500"/>:q.fromType==="ai"?<Sparkles className="w-3 h-3 text-violet-500"/>:<User className="w-3 h-3"/>}<span>{done?"Answered":q.from}</span>{done&&(q.satisfied?<span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">{"\u2713 Satisfied"}</span>:<span className="text-[9px] text-gray-400">waiting for review</span>)}<span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 ml-1">{q.module}</span></div>{done&&q.answer&&<p className="text-[11px] text-gray-500 mt-1.5 italic leading-relaxed">&quot;{q.answer}&quot;</p>}</button>);
  return <div className="max-w-2xl">
    <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 text-emerald-800 px-4 py-2.5 mb-4 text-[12px] flex items-center gap-2"><Clock className="w-3.5 h-3.5 shrink-0"/><span><span className="font-semibold">{SESSION.daysLeft}{" days"}</span>{" until your last day \u00b7 July 4, 2026"}</span></div>
    <div className="grid grid-cols-3 gap-3 mb-4"><QTile label="To answer" value={SESSION.questions-SESSION.answered} tone="urgent"/><QTile label="Answered" value={SESSION.answered} tone="good"/><QTile label="Gaps" value={SESSION.gaps} tone="normal"/></div>
    <div className="flex items-center gap-3 mb-4"><div className="flex-1 h-[5px] rounded-full bg-gray-200 overflow-hidden"><div className="h-full rounded-full bg-violet-500" style={{width:`${Math.round(SESSION.answered/SESSION.questions*100)}%`}}/></div><span className="text-[11px] text-gray-500" style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{SESSION.answered}{" / "}{SESSION.questions}</span></div>
    <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium">Questions waiting for you <span className="text-gray-400" style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{"\u00b7 "}{waiting.length}</span></p>
    <div className="space-y-2 mt-2">{waiting.map(q=><QCard key={q.id} q={q}/>)}</div>
    <div className="mt-3"><button onClick={()=>onSwitchTab("data")} className="h-8 px-4 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer">Open question queue<ArrowRight className="w-3 h-3"/></button><p className="text-[10px] text-gray-400 mt-1.5">Opens in Data tab</p></div>
    <div className="mt-6"><p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium">Recently answered <span className="text-gray-400" style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{"\u00b7 "}{SESSION.answered}</span></p><div className="space-y-2 mt-2">{answered.map(q=><QCard key={q.id} q={q} done/>)}</div></div>
  </div>;
}
function QTile({ label, value, tone }) { const c = { urgent: "text-rose-600", good: "text-emerald-600", normal: "text-gray-900" }[tone]; return <div className="rounded-lg border border-gray-200 bg-white p-3"><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">{label}</p><p className={`text-xl font-semibold ${c}`} style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{value}</p></div>; }
function OffboarderQueue({ focusQ, focusKey }) {
  const refs = useRef({}); const [flash, setFlash] = useState(null);
  useEffect(()=>{ if(!focusQ) return; const el = refs.current[focusQ]; if(el) el.scrollIntoView({behavior:"smooth", block:"center"}); setFlash(focusQ); const t = setTimeout(()=>setFlash(null), 1600); return ()=>clearTimeout(t); }, [focusKey, focusQ]);
  return <div className="space-y-2">
    <style>{"@keyframes qflash{0%{box-shadow:0 0 0 2px #a78bfa;background:#f5f3ff}100%{box-shadow:0 0 0 0 rgba(0,0,0,0);background:#ffffff}}"}</style>
    {OB_QUEUE.map(q=><div key={q.id} ref={el=>{refs.current[q.id]=el;}} style={flash===q.id?{animation:"qflash 1.6s ease-out"}:undefined} className="rounded-lg border border-gray-200 bg-white px-4 py-3"><div className="text-[13px] text-gray-900 mb-1">{q.q}</div><div className="text-[11px] text-gray-500 flex items-center gap-1.5">{q.answered?<CheckCircle2 className="w-3 h-3 text-emerald-500"/>:q.fromType==="ai"?<Sparkles className="w-3 h-3 text-violet-500"/>:<User className="w-3 h-3"/>}<span>{q.answered?"Answered":q.from}</span>{q.answered&&(q.satisfied?<span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">{"\u2713 Satisfied"}</span>:<span className="text-[9px] text-gray-400">waiting for review</span>)}<span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 ml-1">{q.module}</span></div>{q.answered?<div className="mt-2 rounded-md px-3 py-2 bg-gray-50 border-l-2 border-emerald-400"><p className="text-[11px] text-gray-800 leading-relaxed">{q.answer}</p></div>:<AnswerInput/>}</div>)}
  </div>;
}

function CoworkerOverview({ stepId, isReady, onSwitchTab, coworkers }) {
  if (!isReady) return <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center"><div className="w-12 h-12 rounded-full bg-gray-100 inline-flex items-center justify-center mb-3 mx-auto"><Clock className="w-5 h-5 text-gray-400" strokeWidth={1.5}/></div><h3 className="text-sm font-medium text-gray-700 mb-1">Session is being set up</h3><p className="text-xs text-gray-500">{"You\u2019ll be notified when ready."}</p></div>;
  if (stepId==="capture") return <div className="space-y-4"><div className="rounded-lg border border-gray-200 bg-white p-5"><h3 className="text-sm font-semibold text-gray-900 mb-1">Your questions</h3><p className="text-[12px] text-gray-500 mb-3">Review answers and ask follow-ups.</p><div className="grid grid-cols-3 gap-3"><MC l="Answered" v={2}/><MC l="Waiting" v={1}/><MC l="Satisfied" v={1}/></div><p className="text-[11px] text-yellow-700 mt-3 flex items-center gap-1.5"><AlertTriangle className="w-3 h-3"/>1 answer waiting for review</p></div><button onClick={()=>onSwitchTab("data")} className="h-9 px-4 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium inline-flex items-center gap-2 cursor-pointer">{"Review in Data tab"}<ArrowRight className="w-3.5 h-3.5"/></button></div>;
  return <div className="space-y-4"><div className="rounded-lg border border-gray-200 bg-white p-5"><h3 className="text-sm font-semibold text-gray-900 mb-1">{"Minh L\u00ea is leaving soon"}</h3><p className="text-[12px] text-gray-500 mb-3">{"Senior Backend Engineer \u00b7 Last day July 4, 2026"}</p><div className="pt-3 border-t border-gray-100 space-y-2"><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Knowledge areas</p><div className="flex flex-wrap gap-1.5">{["Payment Service","CI/CD Pipeline","Shared Libraries","Monitoring & Alerts","Infrastructure as Code"].map(m=><span key={m} className="text-[11px] px-2 py-1 rounded-md bg-gray-50 border border-gray-200 text-gray-700">{m}</span>)}</div></div><div className="pt-3 mt-3 border-t border-gray-100 grid grid-cols-2 gap-3"><div><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">Your activity</p><p className="text-[12px] text-gray-700">0 questions asked</p></div><div><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">Others</p><p className="text-[12px] text-gray-700">2 coworkers active</p></div></div></div><button onClick={()=>onSwitchTab("data")} className="h-9 px-4 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium inline-flex items-center gap-2 cursor-pointer">{"Browse Data tab"}<ArrowRight className="w-3.5 h-3.5"/></button></div>;
}

function CoworkerNetwork({ coworkers=[], onAdd, onRemove, readOnly=false }) {
  const [showAdd, setShowAdd] = useState(false);
  const [addInput, setAddInput] = useState("");
  const handleAdd = () => { if (addInput.trim() && onAdd) { onAdd(addInput); setAddInput(""); setShowAdd(false); } };
  return <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
    <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between"><div className="flex items-center gap-2"><span className="text-sm font-semibold text-gray-900">Coworker network</span><span className="text-[11px] text-gray-500" style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{coworkers.length}</span></div>{!readOnly&&onAdd&&<button onClick={()=>setShowAdd(!showAdd)} className="text-[10px] px-2 py-1 rounded-md border border-violet-200 text-violet-700 bg-violet-50 hover:bg-violet-100 cursor-pointer font-medium">+ Add</button>}</div>
    {coworkers.map(cw=><div key={cw.id} className="px-4 py-2.5 border-b border-gray-100 last:border-b-0 flex items-center gap-3"><div className={`w-8 h-8 rounded-full text-[10px] font-semibold inline-flex items-center justify-center shrink-0 ${cw.source==="manual"?"bg-yellow-50 text-yellow-700 border border-yellow-200":"bg-violet-50 text-violet-700 border border-violet-200"}`}>{cw.initials}</div><div className="flex-1 min-w-0"><div className="flex items-center gap-1.5"><span className="text-[12px] font-medium text-gray-900">{cw.name}</span><span className={`text-[8px] px-1.5 py-0.5 rounded border ${cw.status==="joined"?"bg-emerald-50 text-emerald-700 border-emerald-200":"bg-yellow-50 text-yellow-700 border-yellow-200"}`}>{cw.status==="joined"?"Joined":"Pending"}</span></div><p className="text-[10px] text-gray-500 mt-0.5">{cw.modules.length>0?cw.modules.join(", "):"No module overlap"}</p><p className="text-[9px] text-gray-400 mt-0.5">{cw.source==="trello"?`From Trello \u00b7 ${cw.sharedCards} shared cards`:"Added by H\u00e0 Vy"}</p></div>{!readOnly&&cw.source==="manual"&&onRemove&&<button onClick={()=>onRemove(cw.id)} className="w-5 h-5 rounded hover:bg-rose-50 inline-flex items-center justify-center text-gray-300 hover:text-rose-500 cursor-pointer shrink-0 text-[14px]">\u00d7</button>}</div>)}
    {showAdd&&<div className="px-4 py-2.5 border-t border-violet-200 bg-violet-50/30"><div className="flex gap-1.5"><input value={addInput} onChange={e=>setAddInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAdd()} placeholder="Search by name..." className="flex-1 h-8 px-2.5 rounded-md border border-gray-200 text-[11px] bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"/><button onClick={handleAdd} className="h-8 px-3 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-medium cursor-pointer">Add</button><button onClick={()=>{setShowAdd(false);setAddInput("");}} className="h-8 px-2 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 cursor-pointer"><X className="w-3 h-3"/></button></div></div>}
  </div>;
}

function EditableQuestion({ q, onEdit, onDelete, canEdit }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(q.q);
  const handleSave = () => { if (editText.trim()) { onEdit(q.id, editText.trim()); setEditing(false); } };
  if (editing) return <div className="flex items-center gap-2 py-1"><input value={editText} onChange={e=>setEditText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")handleSave();if(e.key==="Escape"){setEditText(q.q);setEditing(false);}}} className="flex-1 h-7 px-2 rounded border border-violet-300 text-[12px] focus:outline-none focus:ring-2 focus:ring-violet-500/20" autoFocus/><button onClick={handleSave} className="w-6 h-6 rounded bg-violet-600 text-white inline-flex items-center justify-center cursor-pointer hover:bg-violet-700"><Check className="w-3 h-3"/></button><button onClick={()=>{setEditText(q.q);setEditing(false);}} className="w-6 h-6 rounded border border-gray-300 text-gray-500 inline-flex items-center justify-center cursor-pointer hover:bg-gray-50"><X className="w-3 h-3"/></button></div>;
  return <div className="flex items-start gap-2 group"><div className="flex-1"><div className="text-[12px] text-gray-900">{q.q}</div><div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">{q.fromType==="ai"||q.from==="AI-generated"?<Sparkles className="w-2.5 h-2.5 text-violet-500"/>:<User className="w-2.5 h-2.5"/>}<span>{q.from}</span></div></div>{canEdit&&<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"><button onClick={()=>setEditing(true)} className="w-6 h-6 rounded hover:bg-gray-100 inline-flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer" title="Edit"><Pencil className="w-3 h-3"/></button><button onClick={()=>onDelete(q.id)} className="w-6 h-6 rounded hover:bg-rose-50 inline-flex items-center justify-center text-gray-400 hover:text-rose-600 cursor-pointer" title="Delete"><Trash2 className="w-3 h-3"/></button></div>}</div>;
}

function DataContent({ role, stepId, isReady, canEditQs, generalQs, addedModQs, onAddGQ, onEditGQ, onDeleteGQ, onAddModQ, onEditModQ, onDeleteModQ, focusQ, focusKey }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [gqInput, setGqInput] = useState("");
  const isCapture = stepId==="capture"; const isDeliver = stepId==="deliver"||stepId==="complete"; const isComplete = stepId==="complete"; const readOnly = isDeliver;
  if (role==="offboarder"&&!isCapture&&!isDeliver) return <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center"><h3 className="text-sm font-medium text-gray-700 mb-1">Questions are being collected</h3><p className="text-xs text-gray-500">{"You\u2019ll see them when Capture starts."}</p></div>;
  if (!isReady) return <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center"><div className="w-10 h-10 rounded-full bg-violet-50 inline-flex items-center justify-center mb-3 mx-auto"><div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-violet-500 animate-spin"/></div><h3 className="text-sm font-medium text-gray-700 mb-1">Data is being collected...</h3></div>;
  if (role==="offboarder" && isCapture) return <OffboarderQueue focusQ={focusQ} focusKey={focusKey}/>;
  const showAnswers = isCapture||isDeliver;
  const handleGQAsk = () => { if(gqInput.trim()){ onAddGQ(gqInput); setGqInput(""); } };
  return <div className="relative"><div>
    {!readOnly&&<div className="mb-4 flex items-center gap-2"><input value={gqInput} onChange={e=>setGqInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleGQAsk()} placeholder="Ask a general question..." className="flex-1 h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20"/><button onClick={handleGQAsk} className="h-9 px-3 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium cursor-pointer">Ask</button></div>}
    {generalQs.length>0&&<div className="rounded-lg border border-violet-200 bg-violet-50/20 mb-3 overflow-hidden"><div className="px-4 py-2.5 bg-violet-50/40 border-b border-violet-200 flex items-center gap-2"><MessageCircle className="w-3.5 h-3.5 text-violet-500"/><span className="text-sm font-semibold text-gray-900">General questions</span><span className="text-[11px] text-gray-500">{generalQs.length}</span></div>{generalQs.map(q=><div key={q.id} className="px-4 py-2.5 border-b border-violet-100 last:border-b-0"><EditableQuestion q={q} onEdit={onEditGQ} onDelete={onDeleteGQ} canEdit={canEditQs}/>{showAnswers&&q.answer&&<AnswerBlock q={q} role={role} committed={isComplete} readOnly={readOnly}/>}{isCapture&&!q.answer&&role==="offboarder"&&<AnswerInput/>}</div>)}</div>}
    {MODULES_DATA.map((board,bi)=><div key={bi} className="rounded-lg border border-gray-200 bg-white mb-3 overflow-hidden"><div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center gap-2"><Layers className="w-3.5 h-3.5 text-gray-400"/><span className="text-sm font-semibold text-gray-900">{board.board}</span><span className="text-[11px] text-gray-500">{board.boardCards}c</span></div>{board.modules.map((mod,mi)=><ModuleSection key={mi} mod={mod} role={role} isCapture={isCapture} isDeliver={isDeliver} isComplete={isComplete} canEditQs={canEditQs} selectedCard={selectedCard} onSelectCard={setSelectedCard} addedQs={addedModQs.filter(q=>q.module===mod.name)} onAddModQ={onAddModQ} onEditModQ={onEditModQ} onDeleteModQ={onDeleteModQ}/>)}</div>)}
  </div>{selectedCard&&<><div className="fixed inset-0 bg-black/10 z-30" onClick={()=>setSelectedCard(null)}/><div className="fixed top-0 right-0 h-full w-[480px] bg-white border-l border-gray-200 shadow-xl z-40 overflow-y-auto"><SidePanel card={selectedCard} role={role} onClose={()=>setSelectedCard(null)} isCapture={isCapture} isDeliver={isDeliver} isComplete={isComplete}/></div></>}</div>;
}

function ModuleSection({ mod, role, isCapture, isDeliver, isComplete, canEditQs, selectedCard, onSelectCard, addedQs, onAddModQ, onEditModQ, onDeleteModQ }) {
  const [expanded, setExpanded] = useState(true); const [showModQ, setShowModQ] = useState(false); const [modInput, setModInput] = useState("");
  const [renaming, setRenaming] = useState(false); const [displayName, setDisplayName] = useState(mod.name); const [renameInput, setRenameInput] = useState(mod.name);
  const prog = modProgress(mod); const totalGaps = mod.gaps+(mod.moduleGaps||[]).length;
  const showProgress = isCapture||isDeliver; const readOnly = isDeliver;
  const totalQs = (mod.qs||0) + addedQs.length;
  const handleModAsk = () => { if(modInput.trim()){ onAddModQ(modInput, mod.name); setModInput(""); setShowModQ(false); } };
  const handleRename = () => { if(renameInput.trim()){ setDisplayName(renameInput.trim()); setRenaming(false); } };
  return <div className="border-b border-gray-100 last:border-b-0">
    <div className="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-50">{renaming?<div className="flex items-center gap-2 flex-1" onClick={e=>e.stopPropagation()}><ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${expanded?"":"-rotate-90"}`}/><input value={renameInput} onChange={e=>setRenameInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")handleRename();if(e.key==="Escape"){setRenameInput(displayName);setRenaming(false);}}} className="flex-1 h-7 px-2 rounded border border-violet-300 text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20" autoFocus/><button onClick={handleRename} className="w-6 h-6 rounded bg-violet-600 text-white inline-flex items-center justify-center cursor-pointer hover:bg-violet-700"><Check className="w-3 h-3"/></button><button onClick={()=>{setRenameInput(displayName);setRenaming(false);}} className="w-6 h-6 rounded border border-gray-300 text-gray-500 inline-flex items-center justify-center cursor-pointer hover:bg-gray-50"><X className="w-3 h-3"/></button></div>:<button onClick={()=>setExpanded(!expanded)} className="flex items-center gap-2 flex-1 text-left cursor-pointer"><ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${expanded?"":"-rotate-90"}`}/><span className="text-[13px] font-medium text-gray-900">{displayName}</span><span className="text-[11px] text-gray-500">{mod.cards}c</span>{totalQs>0&&<span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-50 text-violet-600 border border-violet-200">{totalQs}Qs</span>}{totalGaps>0&&<span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-50 text-yellow-700 border border-yellow-200">{totalGaps}{"gap"}{totalGaps>1?"s":""}</span>}{showProgress&&prog.total>0&&<span className={`text-[9px] px-1.5 py-0.5 rounded border ${prog.answered===prog.total?"bg-emerald-50 text-emerald-700 border-emerald-200":"bg-gray-50 text-gray-600 border-gray-200"}`}>{prog.answered}/{prog.total}</span>}</button>}{role==="manager"&&!readOnly&&!renaming&&<span onClick={e=>{e.stopPropagation();setRenaming(true);setRenameInput(displayName);}} className="text-[10px] text-gray-400 hover:text-violet-600 cursor-pointer shrink-0 ml-2">Rename</span>}</div>
    {expanded&&<>
      {mod.moduleGaps&&mod.moduleGaps.length>0&&<div className="px-4 py-2 pl-10 border-t border-gray-50 space-y-1">{mod.moduleGaps.map((g,gi)=><div key={gi} className="text-[10px] text-yellow-800 bg-yellow-50 border border-yellow-200 rounded-md px-2.5 py-1.5 flex items-start gap-1.5"><Sparkles className="w-3 h-3 shrink-0 mt-0.5 text-yellow-600"/>{g}</div>)}</div>}
      {mod.items&&mod.items.map((card,ci)=>{const isSel=selectedCard?.name===card.name;const st=showProgress?cardStatus(card):null;return <button key={ci} onClick={()=>onSelectCard(card)} className={`w-full px-4 py-2 pl-10 flex items-center gap-2 text-left border-t border-gray-50 cursor-pointer ${isSel?"bg-violet-50 border-l-2 border-l-violet-500":"hover:bg-gray-50"}`}>{showProgress&&<span className="w-4 shrink-0 text-center">{st==="done"?<CheckCircle2 className="w-3.5 h-3.5 text-emerald-500"/>:st==="pending"?<span className="text-gray-400 text-[11px]">{"\u25CB"}</span>:<span className="text-gray-300 text-[11px]">{"\u2014"}</span>}</span>}<FileText className="w-3 h-3 text-gray-400 shrink-0"/><span className="text-[12px] text-gray-800 flex-1">{card.name}</span>{card.files&&card.files.length>0&&<Paperclip className="w-2.5 h-2.5 text-gray-300"/>}{card.gaps.length>0&&<span className="text-[8px] px-1 py-0.5 rounded bg-yellow-50 text-yellow-700">gap</span>}{card.qs.length>0&&<span className="text-[8px] px-1 py-0.5 rounded bg-violet-50 text-violet-600">{card.qs.length}Q</span>}</button>})}
      {(!mod.items||mod.items.length===0)&&<div className="px-4 py-2 pl-10 text-[11px] text-gray-400 border-t border-gray-50">{mod.cards} cards</div>}
      {addedQs.length>0&&<div className="px-4 py-2 pl-10 border-t border-gray-100"><p className="text-[9px] text-violet-600 uppercase tracking-wider font-medium mb-1">{"Added questions ("}{addedQs.length}{")"}</p>{addedQs.map(q=><div key={q.id} className="py-1"><EditableQuestion q={q} onEdit={onEditModQ} onDelete={onDeleteModQ} canEdit={canEditQs}/></div>)}</div>}
      {role!=="offboarder"&&!readOnly&&<div className="px-4 py-1.5 pl-10 border-t border-gray-50"><button onClick={e=>{e.stopPropagation();setShowModQ(!showModQ)}} className="text-[10px] text-violet-600 inline-flex items-center gap-1 hover:text-violet-700 cursor-pointer"><Plus className="w-2.5 h-2.5"/>Ask about this module</button>{showModQ&&<div className="flex gap-1.5 mt-1.5"><input value={modInput} onChange={e=>setModInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleModAsk()} placeholder={`Question about ${mod.name}...`} className="flex-1 h-7 px-2 rounded border border-gray-200 text-[10px] focus:outline-none focus:ring-2 focus:ring-violet-500/20"/><button onClick={handleModAsk} className="h-7 px-2 rounded bg-violet-600 text-white text-[9px] cursor-pointer">Ask</button></div>}</div>}
    </>}
  </div>;
}

function AnswerBlock({ q, role, committed, readOnly }) {
  const [satisfied, setSatisfied] = useState(!!q.satisfiedBy); const [showFU, setShowFU] = useState(false);
  return <div className="mt-2"><div className="rounded-md px-3 py-2 bg-gray-50 border-l-2 border-emerald-400"><p className="text-[10px] text-gray-500 mb-1">{q.answeredBy}{" \u00b7 "}{q.answeredAt}{committed&&<span className="ml-1 text-[8px] px-1 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-0.5"><CheckCircle2 className="w-2 h-2"/>Committed</span>}</p><p className="text-[11px] text-gray-800 leading-relaxed">{q.answer}</p>{q.file&&<p className="text-[10px] text-gray-500 mt-1.5 flex items-center gap-1"><Paperclip className="w-2.5 h-2.5"/>{q.file.name}{" ("}{q.file.size}{")"}</p>}</div>{role!=="offboarder"&&!readOnly&&!committed&&<div className="mt-1.5">{satisfied?<p className="text-[10px] text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/>{"Satisfied by "}{q.satisfiedBy||"you"}{" \u00b7 "}{q.satisfiedAt||"now"}</p>:<div className="flex items-center gap-2"><button onClick={()=>setSatisfied(true)} className="h-6 px-2 rounded border border-emerald-300 text-emerald-700 text-[10px] inline-flex items-center gap-1 hover:bg-emerald-50 cursor-pointer"><CheckCircle2 className="w-2.5 h-2.5"/>Mark satisfied</button><button onClick={()=>setShowFU(!showFU)} className="h-6 px-2 rounded border border-gray-300 text-gray-600 text-[10px] inline-flex items-center gap-1 hover:bg-gray-50 cursor-pointer">Ask follow-up</button></div>}{showFU&&<div className="flex gap-1.5 mt-1.5"><input placeholder="Follow-up..." className="flex-1 h-7 px-2 rounded border border-gray-200 text-[10px] focus:outline-none focus:ring-2 focus:ring-violet-500/20"/><button className="h-7 px-2 rounded bg-violet-600 text-white text-[9px] cursor-pointer">Ask</button></div>}</div>}{(readOnly||committed)&&satisfied&&<p className="mt-1 text-[10px] text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/>{"Satisfied by "}{q.satisfiedBy}{" \u00b7 "}{q.satisfiedAt}</p>}</div>;
}

function AnswerInput() { return <div className="mt-2"><textarea placeholder="Type your answer..." className="w-full h-16 px-2 py-1.5 rounded border border-gray-200 text-[11px] resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/20"/><div className="flex items-center justify-end mt-1"><button className="h-6 px-2 rounded bg-violet-600 text-white text-[10px] cursor-pointer">Submit</button></div></div>; }

function SidePanel({ card, role, onClose, isCapture, isDeliver, isComplete }) {
  const [followUp, setFollowUp] = useState(""); const showAnswers = isCapture||isDeliver; const readOnly = isDeliver;
  return <div className="p-5">
    <div className="flex items-center justify-between mb-3"><h3 className="text-[15px] font-semibold text-gray-900">{card.name}</h3><button onClick={onClose} className="w-7 h-7 rounded-md hover:bg-gray-100 inline-flex items-center justify-center text-gray-400 cursor-pointer"><X className="w-4 h-4"/></button></div>
    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-3 mb-1 pt-2 border-t border-gray-100">Description</p><p className="text-[11px] text-gray-700 leading-relaxed mb-2">{card.desc}</p>
    {card.checklist.length>0&&<><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-3 mb-1 pt-2 border-t border-gray-100">Checklist</p>{card.checklist.map((c,i)=><div key={i} className="flex items-center gap-1.5 text-[11px] py-0.5">{c.done?<CheckCircle2 className="w-3 h-3 text-emerald-500"/>:<div className="w-3 h-3 rounded border border-gray-300"/>}<span className={c.done?"text-gray-500 line-through":"text-gray-700"}>{c.text}</span></div>)}</>}
    {card.gaps.length>0&&<><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-3 mb-1 pt-2 border-t border-gray-100">{"Gaps ("}{card.gaps.length}{")"}</p>{card.gaps.map((g,i)=><div key={i} className="text-[10px] text-yellow-800 bg-yellow-50 border border-yellow-200 rounded-md px-2.5 py-1.5 mb-1"><div className="flex items-start gap-1.5"><AlertTriangle className="w-3 h-3 shrink-0 mt-0.5"/>{g}</div>{card.gapQs&&card.gapQs[i]&&<p className="text-[9px] text-violet-600 mt-1 pl-4">{"Related Q: "}{card.gapQs[i]}</p>}</div>)}</>}
    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-3 mb-1 pt-2 border-t border-gray-100">{"Files ("}{(card.files||[]).length}{")"}</p>
    {(card.files||[]).length>0?(card.files||[]).map((f,i)=><div key={i} className="flex items-center gap-2 text-[11px] py-1.5 px-2.5 rounded-md bg-gray-50 mb-1"><Paperclip className="w-3 h-3 text-gray-400 shrink-0"/><span className="text-gray-800 flex-1">{f.name}</span><span className="text-[10px] text-gray-400">{f.size}</span></div>):<p className="text-[11px] text-gray-400 mb-1">No files yet</p>}
    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-3 mb-1 pt-2 border-t border-gray-100">{"Questions ("}{card.qs.length}{")"}</p>
    {card.qs.length>0?card.qs.map((q,i)=><div key={i} className="text-[11px] bg-gray-50 rounded-md px-2.5 py-2 mb-1.5"><p className="text-gray-900 mb-0.5">{q.q}</p><p className="text-[10px] text-gray-500 flex items-center gap-1">{q.from==="AI-generated"?<><Sparkles className="w-2.5 h-2.5 text-violet-500"/>{q.from}</>:<><User className="w-2.5 h-2.5"/>{q.from}</>}</p>{showAnswers&&q.answer&&<AnswerBlock q={q} role={role} committed={isComplete} readOnly={readOnly}/>}{isCapture&&!q.answer&&role==="offboarder"&&<AnswerInput/>}</div>):<p className="text-[11px] text-gray-400 mb-1">No questions yet</p>}
    {role!=="offboarder"&&!readOnly&&<><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-3 mb-1 pt-2 border-t border-gray-100">Ask a question</p><div className="flex gap-1.5"><input value={followUp} onChange={e=>setFollowUp(e.target.value)} placeholder="Your question..." className="flex-1 h-8 px-2.5 rounded-md border border-gray-200 text-[11px] focus:outline-none focus:ring-2 focus:ring-violet-500/20"/><button className="h-8 px-2.5 rounded-md bg-violet-600 text-white text-[10px] font-medium cursor-pointer">Ask</button></div></>}
  </div>;
}

function LogsContent({ role, stepId }) {
  if (stepId==="collecting"||(role==="offboarder"&&stepId==="ready")) return <div className="text-center py-8 text-sm text-gray-500">No activity yet</div>;
  const logs = [
    ...(stepId==="complete"?[{ts:"3:42 PM",type:"system",text:"H\u00e0 Vy committed to Knowledge Graph \u2014 9 answers, 3 files",accent:"#5DCAA5"}]:[]),
    ...(stepId==="deliver"||stepId==="complete"?[{ts:"2:30 PM",type:"system",text:"H\u00e0 Vy moved session to Deliver"}]:[]),
    ...(["capture","deliver","complete"].includes(stepId)?[
      {ts:"2:15 PM",type:"questions",text:"Minh L\u00ea answered about token refresh"},
      {ts:"1:40 PM",type:"questions",text:"Coworker A marked satisfied: webhook events"},
      {ts:"1:20 PM",type:"files",text:"Minh L\u00ea attached dlq-replay-runbook.pdf"},
      {ts:"12:50 PM",type:"questions",text:"Minh L\u00ea answered about retry logic"},
      {ts:"11:05 AM",type:"system",text:"Capture started \u2014 Minh L\u00ea notified"},
    ]:[]),
    {ts:"10:45 AM",type:"questions",text:"Coworker asked about escalations"},
    {ts:"10:32 AM",type:"system",text:"Crawl complete \u2014 64 cards, 5 modules"},
    {ts:"10:24 AM",type:"system",text:"Session created by H\u00e0 Vy"},
  ];
  return <div className="space-y-1.5"><div className="flex gap-2 mb-3">{["All","System","Questions","Files","Edits"].map(f=><button key={f} className={`px-2.5 py-1 rounded-md text-[11px] cursor-pointer ${f==="All"?"bg-violet-50 text-violet-700 font-medium":"text-gray-500 hover:bg-gray-100"}`}>{f}</button>)}</div>{logs.map((l,i)=>{const border=l.accent||(l.type==="system"?"rgb(229,231,235)":l.type==="questions"?"rgb(124,58,237)":"rgb(234,179,8)");return <div key={i} className="flex items-start gap-3 px-3 py-2 rounded-md border border-gray-200 bg-white" style={{borderLeft:`2px solid ${border}`,borderRadius:0}}><span className="text-[10px] text-gray-500 shrink-0 mt-0.5" style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{l.ts}</span><span className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-medium shrink-0 ${l.type==="questions"?"bg-violet-50 text-violet-600":l.type==="files"?"bg-yellow-50 text-yellow-700":"bg-gray-100 text-gray-500"}`}>{l.type}</span><span className="text-[11px] text-gray-900">{l.text}</span></div>})}</div>;
}

export function ProgressBar() { return <div className="flex items-center gap-3 mb-1"><div className="flex-1 h-[6px] rounded-full bg-gray-200 overflow-hidden"><div className="h-full rounded-full bg-violet-500" style={{width:`${Math.round(SESSION.answered/SESSION.questions*100)}%`}}/></div><span className="text-[11px] text-gray-700 font-medium" style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{SESSION.answered}/{SESSION.questions}</span></div>; }
export function MC({ l, v }) { return <div className="rounded-md bg-gray-50 border border-gray-200 px-3 py-2"><div className="text-[9px] text-gray-500 uppercase tracking-wider font-medium">{l}</div><div className="text-lg font-semibold text-gray-900 mt-0.5" style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{v}</div></div>; }
