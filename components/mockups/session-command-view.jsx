"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, ArrowUpRight, X, CheckCircle2, Clock, AlertTriangle, Sparkles, Bell, Layers, User, FileText, ChevronDown, Plus, MessageCircle, Paperclip, Pencil, Trash2, Check, GripVertical, HelpCircle, Inbox, ExternalLink, Mic, Pause, SkipForward, RotateCcw } from "lucide-react";
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
    { name: "Payment Service", cards: 12, qs: 4, gaps: 1, moduleGaps: ["No disaster recovery or failover procedures documented"], moduleGapQs: ["What is the failover procedure if the primary payment processor goes down?"], items: [
      { name: "Kafka retry configuration", linkedIn: ["CI/CD Pipeline"], desc: "DLQ routing, backoff strategy, poison message handling. Max 5 retries.", checklist: [{ text: "DLQ routing configured", done: true }, { text: "Backoff documented", done: false }, { text: "Alert on failures", done: false }], gaps: ["Incomplete checklist (2/3 not done)"], gapQs: ["How does the retry logic handle poison messages?"], files: [{ name: "kafka-config.yaml", size: "3.2 KB" }], qs: [
        { q: "How does the retry logic handle poison messages?", from: "AI-generated", answer: "After 5 retries with exponential backoff, messages route to the DLQ. Monitor via Datadog alert #4421.", answeredBy: "Minh L\u00ea", answeredAt: "2h ago", file: { name: "dlq-replay-runbook.pdf", size: "12 KB" }, satisfiedBy: "Coworker A", satisfiedAt: "30m" },
        { q: "Max retry count before DLQ routing?", from: "AI-generated", answer: "Max 5, configurable per topic in kafka-config.yaml. Backoff: 2x from 500ms.", answeredBy: "Minh L\u00ea", answeredAt: "1h ago" },
      ] },
      { name: "Payment gateway timeout", desc: "Circuit breaker pattern, 30s timeout.", checklist: [{ text: "Timeout tuned per route", done: false }], gaps: [], files: [], qs: [{ q: "What happens when gateway times out mid-transaction?", from: "AI-generated", answer: "Circuit breaker trips after 30s and returns 503. The client retries with an idempotency key, so no double-charge.", answeredBy: "Minh Lê", answeredAt: "1h ago" }] },
      { name: "Stripe webhook handler", desc: "Payment confirmations and refunds.", checklist: [], gaps: [], files: [], qs: [{ q: "Which webhook events are critical vs optional?", from: "Coworker", answer: "Critical: payment_intent.succeeded, charge.refunded, invoice.payment_failed. Optional \u2192 batch queue.", answeredBy: "Minh L\u00ea", answeredAt: "45m", satisfiedBy: "Coworker A", satisfiedAt: "20m" }] },
      { name: "Refund reconciliation", desc: "Nightly Stripe\u2194ledger reconciliation.", checklist: [], gaps: [], files: [], qs: [{ q: "How are partial refunds reconciled?", from: "AI-generated", answer: "Matched nightly against the Stripe balance report; mismatches route to a manual queue owned by Finance.", answeredBy: "Minh L\u00ea", answeredAt: "2h ago" }] },
      { name: "Currency conversion", desc: "ECB API rates, 04:00 UTC.", checklist: [{ text: "Fallback on API failure", done: true }], gaps: [], files: [], qs: [] },
    ]},
    { name: "CI/CD Pipeline", cards: 8, qs: 3, gaps: 1, moduleGaps: ["Deployment described differently across modules"], moduleGapQs: ["Which deployment process is authoritative across services?"], items: [
      { name: "Atlas migration rollback", desc: "Migration procedures and rollback.", checklist: [], gaps: ["Missing description"], gapQs: ["Rollback procedure?"], files: [], qs: [{ q: "Rollback procedure for failed Atlas migrations?", from: "H\u00e0 Vy", answer: "Run /scripts/atlas-rollback.sh with migration ID. Snapshot before (7d expiry).", answeredBy: "Minh L\u00ea", answeredAt: "4h ago", satisfiedBy: "H\u00e0 Vy", satisfiedAt: "2h" }] },
      { name: "GitHub Actions workflow", linkedIn: ["Infrastructure as Code"], desc: "lint\u2192test\u2192build\u2192deploy. Node 18/20.", checklist: [{ text: "Staging automated", done: true }, { text: "Prod approval", done: true }], gaps: [], files: [], qs: [{ q: "Runbook for nightly batch failures?", from: "Coworker", answer: "Check Actions logs, rerun transient. 3x fails: check Datadog.", answeredBy: "Minh L\u00ea", answeredAt: "3h ago" }] },
      { name: "Docker image caching", desc: "Layer caching in GHCR.", checklist: [], gaps: [], files: [], qs: [] },
    ]},
    { name: "Shared Libraries", cards: 6, qs: 2, gaps: 0, items: [
      { name: "API key rotation", desc: "90-day rotation via GitHub Action.", checklist: [{ text: "Schedule documented", done: true }, { text: "Auto-rotation on", done: true }], gaps: [], files: [{ name: "api-key-rotation.md", size: "1.8 KB" }], qs: [{ q: "Where is the rotation runbook?", from: "AI-generated", answer: "Wiki: /security/api-key-rotation.md. Ping DevOps on failure.", answeredBy: "Minh L\u00ea", answeredAt: "5h ago", satisfiedBy: "H\u00e0 Vy", satisfiedAt: "4h" }] },
      { name: "Logging middleware", desc: "Structured logging + PII redaction.", checklist: [], gaps: [], files: [], qs: [] },
      { name: "Auth token validator", desc: "JWT. RS256 + EdDSA.", checklist: [], gaps: [], files: [], qs: [{ q: "Token refresh strategy?", from: "AI-generated", answer: "15-min access, 7-day refresh HTTP-only cookies. Failure \u2192 login.", answeredBy: "Minh L\u00ea", answeredAt: "6h ago", satisfiedBy: "Coworker A", satisfiedAt: "5h" }] },
    ]},
  ]},
  { board: "Platform Infrastructure", boardCards: 18, modules: [
    { name: "Monitoring & Alerts", cards: 10, qs: 3, gaps: 1, moduleGaps: ["SLA commitments undocumented"], moduleGapQs: ["What are the contractual SLA commitments and who owns them?"], items: [
      { name: "Datadog dashboard", linkedIn: ["Payment Service"], desc: "SLO tracking. P50/P95/P99.", checklist: [], gaps: ["Thresholds undocumented"], gapQs: ["Critical alert thresholds?"], files: [], qs: [{ q: "Critical alert thresholds?", from: "AI-generated" }] },
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

// Cards the AI couldn't confidently assign to any module (below 80% for all). CL-session 2025-06-25 §5.
const UNCATEGORIZED = [
  { name: "Legacy cron job notes", desc: "Scattered notes on the nightly settlement cron. Unclear which service owns it.", checklist: [], gaps: [], files: [], qs: [{ q: "Which service owns the nightly settlement cron?", from: "AI-generated" }] },
  { name: "Vendor onboarding checklist", desc: "Half-finished checklist copied from an old board.", checklist: [{ text: "Contact added", done: true }, { text: "SLA reviewed", done: false }], gaps: [], files: [], qs: [] },
];

let qId = 200;
// Flags are MECHANICAL, card-level metadata checks (gray, dismissable, informational). Distinct from module-level gaps. CL-session 2025-06-25 §4.
function cardFlags(card) {
  const f = [];
  if (!card.desc || !card.desc.trim()) f.push("no desc");
  if (card.checklist && card.checklist.length) { const d = card.checklist.filter(c=>c.done).length; if (d < card.checklist.length) f.push(`checklist ${d}/${card.checklist.length}`); }
  return f;
}
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
  // Part D — per-role, per-state tab availability. Data/Logs are live only in Prepare(ready) + Capture.
  const dataLogsActive = stepId==="ready" || stepId==="capture";
  const collecting = stepId==="collecting";
  const tabTip = collecting ? "Available after data collection" : "Available during Prepare and Capture";
  // Part D (R4) — Logs widened. Offboarder: Logs everywhere except the not-started/pending state.
  // Coworker: Logs everywhere except Collecting (now incl. Deliver/Complete). Manager: Logs stays
  // Prepare+Capture only. Data-tab gating is unchanged across roles.
  let tabs;
  if (role==="offboarder") {
    const logsDisabled = stepId==="ready"; // "being prepared" = pending/not-started
    tabs = [{id:"overview",label:"Overview"},{id:"data",label:"Data",hidden:true},{id:"logs",label:"Logs",disabled:logsDisabled,tip:"Available once your session is active"}];
  } else if (role==="coworker") {
    tabs = [{id:"overview",label:"Overview"},{id:"data",label:"Data",disabled:!dataLogsActive,tip:tabTip},{id:"logs",label:"Logs",disabled:collecting,tip:collecting?"Available after data collection":undefined}];
  } else {
    tabs = [{id:"overview",label:"Overview"},{id:"data",label:"Data",disabled:!dataLogsActive,tip:tabTip},{id:"logs",label:"Logs",disabled:!dataLogsActive,tip:tabTip}];
  }
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
  return <div className="max-w-5xl mx-auto p-6"><HeroBar phase={phase} stepId={stepId}/><div className="flex gap-0 border-b border-gray-200 mb-5">{tabs.filter(t=>!t.hidden).map(t=><button key={t.id} onClick={()=>!t.disabled&&setActiveTab(t.id)} title={t.disabled?t.tip:undefined} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${shownTab===t.id?"border-violet-600 text-gray-900":t.disabled?"border-transparent text-gray-300 cursor-not-allowed":"border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer"}`}>{t.label}</button>)}</div>{shownTab==="overview"&&<OverviewContent role={role} stepId={stepId} isReady={isReady} onSwitchTab={setActiveTab} onOpenQuestion={openQuestion} coworkers={coworkers} onAddCoworker={addCoworker} onRemoveCoworker={removeCoworker}/>}{shownTab==="data"&&<DataContent role={role} stepId={stepId} isReady={isReady} canEditQs={canEditQs} generalQs={generalQs} addedModQs={addedModQs} onAddGQ={addGQ} onEditGQ={editGQ} onDeleteGQ={deleteGQ} onAddModQ={addModQ} onEditModQ={editModQ} onDeleteModQ={deleteModQ} focusQ={focusQ} focusKey={focusKey}/>}{shownTab==="logs"&&<LogsContent role={role} stepId={stepId}/>}</div>;
}

function HeroBar({ phase, stepId }) {
  const cls = {prepare:"bg-blue-50 border-blue-200 text-blue-700",capture:"bg-violet-50 border-violet-200 text-violet-700",deliver:"bg-emerald-50 border-emerald-200 text-emerald-700"};
  const label = stepId==="complete"?"Complete":phase==="prepare"?"Prepare":phase==="capture"?"Capture":"Deliver";
  const metrics = phase==="prepare"?`${SESSION.coworkers} coworkers · ${SESSION.questions} Qs · ${SESSION.gaps} gaps`:phase==="capture"?`${SESSION.answered}/${SESSION.questions} answered · ${SESSION.satisfied} satisfied`:stepId==="complete"?`${SESSION.answered} committed · ${SESSION.files} files`:`${SESSION.answered}/${SESSION.questions} answered · reviewing`;
  return <div className="rounded-lg border border-gray-200 bg-white p-4 mb-5 flex items-center gap-4"><div className={`w-12 h-12 rounded-full ${stepId==="complete"?"bg-emerald-100 text-emerald-700":"bg-violet-100 text-violet-700"} text-sm font-semibold inline-flex items-center justify-center shrink-0`}>{stepId==="complete"?<CheckCircle2 className="w-5 h-5"/>:SESSION.initials}</div><div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-0.5"><h1 className="text-lg font-semibold text-gray-900">{SESSION.name}&apos;s session</h1><span className={`text-[9px] px-2 py-0.5 rounded uppercase tracking-wider font-semibold border ${cls[phase]}`}>{label}</span></div><p className="text-[12px] text-gray-500">{SESSION.role}{" · "}{SESSION.dept}</p><p className="text-[11px] text-gray-500 mt-0.5" style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{stepId!=="complete"?`${SESSION.daysLeft}d left · `:""}{metrics}</p></div></div>;
}

function OverviewContent({ role, stepId, isReady, onSwitchTab, onOpenQuestion, coworkers, onAddCoworker, onRemoveCoworker }) {
  if (stepId==="complete") return <CompleteOverview role={role} S={SESSION} MC={MC}/>;
  if (stepId==="deliver") return <DeliverOverview role={role} onSwitchTab={onSwitchTab} S={SESSION} MD={MODULES_DATA} modProgress={modProgress} MC={MC} ProgressBar={ProgressBar}/>;
  if (role==="offboarder") return <OffboarderOverview stepId={stepId} onSwitchTab={onSwitchTab} onOpenQuestion={onOpenQuestion}/>;
  if (role==="coworker") return <CoworkerOverview stepId={stepId} isReady={isReady} onSwitchTab={onSwitchTab} coworkers={coworkers}/>;
  return <ManagerOverview stepId={stepId} isReady={isReady} onSwitchTab={onSwitchTab} coworkers={coworkers} onAddCoworker={onAddCoworker} onRemoveCoworker={onRemoveCoworker}/>;
}

function ManagerOverview({ stepId, isReady, onSwitchTab, coworkers, onAddCoworker, onRemoveCoworker }) {
  // MV-R4-04 \u2014 Collecting Data is animation-only. The orbital belongs to empty/pending states, not active collection.
  if (!isReady) return <div className="space-y-4"><CategorizeAnimation/><div className="rounded-lg border border-gray-200 bg-white p-4 flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-violet-50 inline-flex items-center justify-center shrink-0"><div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-violet-500 animate-spin"/></div><div><h3 className="text-sm font-medium text-gray-900">{"Collecting data from "}{SESSION.boards}{" boards\u2026"}</h3><p className="text-xs text-gray-500">{"We\u2019ll notify you when ready."}</p></div></div></div>;
  if (stepId==="capture") return <div className="space-y-4"><div className="rounded-lg border border-gray-200 bg-white p-5"><h3 className="text-sm font-semibold text-gray-900 mb-3">Capture in progress</h3><ProgressBar/><p className="text-[11px] text-gray-500 mb-4">{SESSION.questions-SESSION.answered}{" questions remaining"}</p><div className="grid grid-cols-3 gap-3"><MC l="Satisfied" v={SESSION.satisfied}/><MC l="Waiting review" v={SESSION.answered-SESSION.satisfied}/><MC l="Gaps addressed" v={`${SESSION.gapsAddressed}/${SESSION.gaps}`}/></div><p className="text-[11px] text-gray-500 mt-3" style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{"Started 3d ago · "}{SESSION.daysLeft}{"d left"}</p></div><CoworkerNetwork coworkers={coworkers} readOnly/><div className="flex items-center gap-3"><button onClick={()=>onSwitchTab("data")} className="h-9 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">Review in Data tab</button><button className="h-9 px-4 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium inline-flex items-center gap-2 cursor-pointer">{"Move to Deliver"}<ArrowRight className="w-3.5 h-3.5"/></button></div></div>;
  return <div className="space-y-4"><div className="rounded-lg border border-gray-200 bg-white p-5"><h3 className="text-sm font-semibold text-gray-900 mb-3">Data collection complete</h3><div className="grid grid-cols-4 gap-3 mb-4"><MC l="Boards" v={SESSION.boards}/><MC l="Cards" v={SESSION.cards}/><MC l="Areas" v={SESSION.modules}/><MC l="Questions" v={SESSION.questions}/></div><div className="pt-3 border-t border-gray-100 space-y-2"><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Knowledge areas</p><div className="flex flex-wrap gap-1.5">{["Payment Service","CI/CD Pipeline","Shared Libraries","Monitoring & Alerts","Infrastructure as Code"].map(m=><span key={m} className="text-[11px] px-2 py-1 rounded-md bg-gray-50 border border-gray-200 text-gray-700">{m}</span>)}</div></div><div className="pt-3 mt-3 border-t border-gray-100 grid grid-cols-2 gap-3"><div><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">Coworker engagement</p><p className="text-[12px] text-gray-700">2 of 3 have asked questions</p></div><div><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">Knowledge gaps</p><p className="text-[12px] text-gray-700">3 module gaps · flags on cards</p></div></div></div><CoworkerNetwork coworkers={coworkers} onAdd={onAddCoworker} onRemove={onRemoveCoworker} readOnly={false}/><div className="flex items-center gap-3"><button onClick={()=>onSwitchTab("data")} className="h-9 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">Review in Data tab</button><Link href={`/session/${SESSION.id}`} className="h-9 px-4 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium inline-flex items-center gap-2">{"Start Capture"}<ArrowRight className="w-3.5 h-3.5"/></Link></div></div>;
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
// Module-level gap context for an AI gap question — shows WHY it was flagged, not a single card (OV-R05).
// showAsk gates the "Ask about this gap" action: Coworker keeps it (CW-R4-01), Offboarder doesn't (OV-R4-03).
function GapContextPanel({ moduleName, onClose, showAsk = false, askLabel = "Coworker" }) {
  const mod = MODULES_DATA.flatMap(b=>b.modules).find(m=>m.name===moduleName);
  const gap = (mod&&mod.moduleGaps&&mod.moduleGaps[0]) || "Knowledge gap detected by AI";
  const gapQ = mod&&mod.moduleGapQs&&mod.moduleGapQs[0];
  const cards = (mod&&mod.items) || [];
  const reason = `${moduleName} has ${mod?mod.cards:cards.length} cards covering ${cards.slice(0,3).map(c=>c.name).join(", ")}, but none of them addresses this area — so the AI flagged it as missing knowledge.`;
  // CW-R5-01 — "Ask about this gap" creates a human question targeting the gap. It posts to the
  // Offboarder's queue (OB_QUEUE) and appears immediately in "Questions from this gap" below.
  const [asking, setAsking] = useState(false);
  const [input, setInput] = useState("");
  const [extraQs, setExtraQs] = useState([]);
  const [sent, setSent] = useState(false);
  const sentTimer = useRef(null);
  const submitAsk = () => {
    const t = input.trim(); if(!t) return;
    OB_QUEUE.push({ id:`cwgap${++qId}`, q:t, from:askLabel, fromType:"human", module:moduleName, answered:false });
    setExtraQs(p=>[...p, t]); setInput("");
    setSent(true); if(sentTimer.current) clearTimeout(sentTimer.current); sentTimer.current = setTimeout(()=>setSent(false), 2400);
  };
  const hasQs = !!gapQ || extraQs.length>0;
  return <div className="p-5">
    <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-yellow-600"/><h3 className="text-[15px] font-semibold text-gray-900">Gap context</h3></div><button onClick={onClose} className="w-7 h-7 rounded-md hover:bg-gray-100 inline-flex items-center justify-center text-gray-400 cursor-pointer"><X className="w-4 h-4"/></button></div>
    <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-3 py-2.5 mb-3" style={{borderLeft:"3px solid #eab308"}}><p className="text-[10px] text-yellow-700 uppercase tracking-wider font-medium">Module</p><p className="text-[13px] font-medium text-gray-900">{moduleName}</p><p className="text-[11px] text-yellow-800 mt-1.5 flex items-start gap-1.5"><AlertTriangle className="w-3 h-3 shrink-0 mt-0.5"/>{gap}</p><span className="inline-flex items-center gap-1 text-[9px] mt-2 px-1.5 py-0.5 rounded bg-white border border-yellow-200 text-yellow-700"><Sparkles className="w-2.5 h-2.5"/>Detected by AI analysis</span></div>
    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">Why this was flagged</p><p className="text-[11px] text-gray-600 leading-relaxed mb-3">{reason}</p>
    {hasQs&&<><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1 pt-2 border-t border-gray-100">{"Questions from this gap ("}{(gapQ?1:0)+extraQs.length}{")"}</p>
      {gapQ&&<div className="text-[11px] bg-gray-50 rounded-md px-2.5 py-2 mb-1.5 flex items-center gap-1.5"><HelpCircle className="w-3 h-3 text-violet-500 shrink-0"/><span className="flex-1 text-gray-800">{gapQ}</span><span className="text-[9px] text-gray-400">waiting</span></div>}
      {extraQs.map((q,i)=><div key={i} className="text-[11px] bg-violet-50/60 border border-violet-100 rounded-md px-2.5 py-2 mb-1.5 flex items-center gap-1.5"><HelpCircle className="w-3 h-3 text-violet-500 shrink-0"/><span className="flex-1 text-gray-800">{q}</span><span className="text-[9px] px-1.5 py-0.5 rounded bg-white border border-violet-200 text-violet-600 shrink-0">{askLabel}{" · waiting"}</span></div>)}
      <div className="mb-1.5"/></>}
    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1 pt-2 border-t border-gray-100">{"Cards in this module ("}{cards.length}{")"}</p>
    <div className="space-y-1 mb-3">{cards.map((c,i)=><div key={i} className="flex items-center gap-2 text-[11px] text-gray-700 px-2 py-1 rounded bg-gray-50"><FileText className="w-3 h-3 text-gray-400 shrink-0"/>{c.name}</div>)}</div>
    {showAsk&&<div className="pt-2 border-t border-gray-100">
      <button onClick={()=>setAsking(a=>!a)} className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-violet-50 border border-violet-200 text-violet-700 text-[11px] font-medium hover:bg-violet-100 cursor-pointer"><Sparkles className="w-3 h-3"/>Ask about this gap</button>
      {asking&&<div className="mt-2">
        <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Escape"){setAsking(false);setInput("");}}} autoFocus placeholder={`What would you like Minh Lê to clarify about ${moduleName}?`} className="w-full h-16 px-2 py-1.5 rounded border border-violet-300 text-[11px] resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/20"/>
        <div className="flex items-center justify-end gap-2 mt-1.5"><button onClick={()=>{setAsking(false);setInput("");}} className="text-[11px] text-gray-500 hover:text-gray-700 cursor-pointer">Cancel</button><button onClick={submitAsk} className="h-7 px-3 rounded bg-violet-600 text-white text-[11px] font-medium hover:bg-violet-700 cursor-pointer">Ask</button></div>
      </div>}
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
  const Meta = ({ q, ans }) => <div className="text-[11px] text-gray-500 flex items-center gap-1.5 flex-wrap">{ans?<CheckCircle2 className="w-3 h-3 text-emerald-500"/>:q.fromType==="ai"?<Sparkles className="w-3 h-3 text-violet-500"/>:<User className="w-3 h-3"/>}<span>{ans?"Answered":q.from}</span>{ans&&(ans.satisfied?<span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">{"✓ Satisfied"}</span>:<span className="text-[9px] text-gray-400">waiting for review</span>)}{ans&&ans.edited&&<span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-50 text-violet-600 border border-violet-200">Edited</span>}{ans&&ans.voice&&<span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200 inline-flex items-center gap-0.5" title="Answered via voice"><Mic className="w-2.5 h-2.5"/>Voice</span>}<span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{q.module}</span></div>;
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
      <h3 className="text-base font-semibold text-gray-900 mb-1">🎉 Voice session complete</h3>
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
    {OB_QUEUE.map(q=>{const isActive=activeQ===q.id&&!!selectedCard;return <div key={q.id} ref={el=>{refs.current[q.id]=el;}} style={flash===q.id?{animation:"qflash 1.6s ease-out"}:undefined} className={`rounded-lg border bg-white px-4 py-3 ${isActive?"border-violet-500 ring-2 ring-violet-500/15":"border-gray-200"}`}><div className="flex items-start gap-2"><div className="text-[13px] text-gray-900 mb-1 flex-1">{q.q}</div>{onSelectCard&&<button onClick={()=>openContext(q)} className="text-[9px] text-violet-600 hover:text-violet-700 cursor-pointer inline-flex items-center gap-1 shrink-0 mt-0.5" title="Open the source card"><ExternalLink className="w-2.5 h-2.5"/>See in context</button>}</div><div className="text-[11px] text-gray-500 flex items-center gap-1.5">{q.answered?<CheckCircle2 className="w-3 h-3 text-emerald-500"/>:q.fromType==="ai"?<Sparkles className="w-3 h-3 text-violet-500"/>:<User className="w-3 h-3"/>}<span>{q.answered?"Answered":q.from}</span>{q.answered&&(q.satisfied?<span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">{"\u2713 Satisfied"}</span>:<span className="text-[9px] text-gray-400">waiting for review</span>)}<span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 ml-1">{q.module}</span></div>{q.answered?<div className="mt-2 rounded-md px-3 py-2 bg-gray-50 border-l-2 border-emerald-400"><p className="text-[11px] text-gray-800 leading-relaxed">{q.answer}</p></div>:<AnswerInput/>}</div>})}
  </div>;
}

function CoworkerOverview({ stepId, isReady, onSwitchTab, coworkers }) {
  // R5-02 \u2014 waiting state: orbital + "Data is being collected" message, no CTA.
  if (!isReady) return <div className="rounded-xl border border-gray-200 bg-white p-10 text-center"><OrbitalIllustration/><h3 className="text-sm font-semibold text-gray-900 mb-1">Data is being collected</h3><p className="text-xs text-gray-500 max-w-sm mx-auto">{"The system is crawling Trello boards and organizing knowledge. You\u2019ll be able to review and ask questions once data is ready."}</p></div>;
  if (stepId==="capture") return <div className="space-y-4"><div className="rounded-lg border border-gray-200 bg-white p-5"><h3 className="text-sm font-semibold text-gray-900 mb-1">Your questions</h3><p className="text-[12px] text-gray-500 mb-3">Review answers and ask follow-ups.</p><div className="grid grid-cols-3 gap-3"><MC l="Answered" v={2}/><MC l="Waiting" v={1}/><MC l="Satisfied" v={1}/></div><p className="text-[11px] text-yellow-700 mt-3 flex items-center gap-1.5"><AlertTriangle className="w-3 h-3"/>1 answer waiting for review</p></div><CoworkerNetwork coworkers={coworkers} readOnly/><button onClick={()=>onSwitchTab("data")} className="h-9 px-4 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium inline-flex items-center gap-2 cursor-pointer">{"Review in Data tab"}<ArrowRight className="w-3.5 h-3.5"/></button></div>;
  return <div className="space-y-4"><div className="rounded-lg border border-gray-200 bg-white p-5"><h3 className="text-sm font-semibold text-gray-900 mb-1">{"Minh L\u00ea is leaving soon"}</h3><p className="text-[12px] text-gray-500 mb-3">{"Senior Backend Engineer · Last day July 4, 2026"}</p><div className="pt-3 border-t border-gray-100 space-y-2"><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Knowledge areas</p><div className="flex flex-wrap gap-1.5">{["Payment Service","CI/CD Pipeline","Shared Libraries","Monitoring & Alerts","Infrastructure as Code"].map(m=><span key={m} className="text-[11px] px-2 py-1 rounded-md bg-gray-50 border border-gray-200 text-gray-700">{m}</span>)}</div></div><div className="pt-3 mt-3 border-t border-gray-100 grid grid-cols-2 gap-3"><div><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">Your activity</p><p className="text-[12px] text-gray-700">0 questions asked</p></div><div><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">Others</p><p className="text-[12px] text-gray-700">2 coworkers active</p></div></div></div><CoworkerNetwork coworkers={coworkers} readOnly/><button onClick={()=>onSwitchTab("data")} className="h-9 px-4 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium inline-flex items-center gap-2 cursor-pointer">{"Browse Data tab"}<ArrowRight className="w-3.5 h-3.5"/></button></div>;
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
function ConfirmDeleteQ({ onConfirm, onCancel }) {
  return <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={onCancel}><div className="bg-white rounded-xl shadow-xl p-5 w-[320px] border border-gray-200" onClick={e=>e.stopPropagation()}><h3 className="text-sm font-semibold text-gray-900 mb-1">Delete this question?</h3><p className="text-[12px] text-gray-500 mb-4">The AI won&apos;t regenerate it.</p><div className="flex gap-2 justify-end"><button onClick={onCancel} className="h-8 px-3 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button><button onClick={onConfirm} className="h-8 px-3 rounded-md bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 cursor-pointer">Delete</button></div></div></div>;
}
// R6-02 — confirmation before bulk-dismissing a module's flags.
function ConfirmDismissFlags({ count, module, onConfirm, onCancel }) {
  return <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={onCancel}><div className="bg-white rounded-xl shadow-xl p-5 w-[340px] border border-gray-200" onClick={e=>e.stopPropagation()}><h3 className="text-sm font-semibold text-gray-900 mb-1">{"Dismiss "}{count}{" flags in "}{module}{"?"}</h3><p className="text-[12px] text-gray-500 mb-4">This removes the flag badges from these cards. Flags are informational metadata checks, not knowledge gaps.</p><div className="flex gap-2 justify-end"><button onClick={onCancel} className="h-8 px-3 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button><button onClick={onConfirm} className="h-8 px-3 rounded-md bg-gray-800 text-white text-sm font-medium hover:bg-gray-900 cursor-pointer">Dismiss</button></div></div></div>;
}
function EditableQuestion({ q, onEdit, onDelete, canEdit }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(q.q);
  const [confirmDel, setConfirmDel] = useState(false);
  const isAI = q.fromType==="ai"||q.from==="AI-generated";
  const handleSave = () => { if (editText.trim()) { onEdit(q.id, editText.trim()); setEditing(false); } };
  if (editing) return <div className="flex items-center gap-2 py-1"><input value={editText} onChange={e=>setEditText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")handleSave();if(e.key==="Escape"){setEditText(q.q);setEditing(false);}}} className="flex-1 h-7 px-2 rounded border border-violet-300 text-[12px] focus:outline-none focus:ring-2 focus:ring-violet-500/20" autoFocus/><button onClick={handleSave} className="w-6 h-6 rounded bg-violet-600 text-white inline-flex items-center justify-center cursor-pointer hover:bg-violet-700"><Check className="w-3 h-3"/></button><button onClick={()=>{setEditText(q.q);setEditing(false);}} className="w-6 h-6 rounded border border-gray-300 text-gray-500 inline-flex items-center justify-center cursor-pointer hover:bg-gray-50"><X className="w-3 h-3"/></button></div>;
  return <><div className="flex items-start gap-2 group"><div className="flex-1"><div className="text-[12px] text-gray-900">{q.q}</div><div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">{isAI?<Sparkles className="w-2.5 h-2.5 text-violet-500"/>:<User className="w-2.5 h-2.5"/>}<span>{q.from}</span></div></div>{canEdit&&<div className="flex items-center gap-1 shrink-0"><button onClick={()=>setEditing(true)} className="w-6 h-6 rounded border border-gray-200 hover:bg-gray-100 inline-flex items-center justify-center text-gray-400 hover:text-violet-600 cursor-pointer" title="Edit question"><Pencil className="w-3 h-3"/></button><button onClick={()=>isAI?setConfirmDel(true):onDelete(q.id)} className="w-6 h-6 rounded border border-gray-200 hover:bg-rose-50 inline-flex items-center justify-center text-gray-400 hover:text-rose-600 cursor-pointer" title="Delete question"><Trash2 className="w-3 h-3"/></button></div>}</div>{confirmDel&&<ConfirmDeleteQ onConfirm={()=>{onDelete(q.id);setConfirmDel(false);}} onCancel={()=>setConfirmDel(false)}/>}</>;
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
  // R6-02 — lifted satisfaction/needs-more (keyed by question text) so module-level bulk ops can drive it.
  const [satKeys, setSatKeys] = useState(()=>new Set());
  const [moreKeys, setMoreKeys] = useState(()=>new Set());
  const onSatisfyQ = (k)=>setSatKeys(s=>{ const n=new Set(s); n.add(k); return n; });
  const onMoreQ = (k)=>setMoreKeys(s=>{ const n=new Set(s); n.add(k); return n; });
  const satisfyMany = (keys)=>setSatKeys(s=>{ const n=new Set(s); keys.forEach(k=>n.add(k)); return n; });
  const satCtl = { satKeys, moreKeys, onSatisfyQ, onMoreQ };
  const [dragCard, setDragCard] = useState(null); const [dropTarget, setDropTarget] = useState(null); const [movedCard, setMovedCard] = useState(null); const movedTimer = useRef(null);
  // CW-04 — deep link: ?card=<name> pre-opens the side panel on that card.
  useEffect(() => { const c = new URLSearchParams(window.location.search).get("card"); if (c) { const found = ALL_CARDS.find(x => x.card.name === c); if (found) setSelectedCard(found.card); } }, []);
  const isCapture = stepId==="capture"; const isDeliver = stepId==="deliver"||stepId==="complete"; const isComplete = stepId==="complete"; const readOnly = isDeliver;
  const canManage = role==="manager" && !readOnly;
  const eff = (x) => assignments[x.card.name] ?? x.home;
  const primaryFor = (modName) => ALL_CARDS.filter(x=>eff(x)===modName).map(x=>x.card);
  const linkedFor = (modName) => ALL_CARDS.filter(x=>eff(x)!==modName && eff(x)!=="__uncat__" && (x.card.linkedIn||[]).includes(modName)).map(x=>x.card);
  const uncats = ALL_CARDS.filter(x=>eff(x)==="__uncat__").map(x=>x.card);
  const primaryModuleOf = (card) => { const x=ALL_CARDS.find(a=>a.card.name===card.name); return x?eff(x):"__uncat__"; };
  const moveCard = (name, dest) => setAssignments(p=>({...p,[name]:dest}));
  const dismissFlag = (key) => setDismissedFlags(prev=>new Set([...prev,key]));
  // MV-06 — functional drag-and-drop. Primary + uncategorized cards are draggable; linked cards are blocked (use "Move to").
  const onDragStart = (name) => setDragCard(name);
  const onDragEnd = () => { setDragCard(null); setDropTarget(null); };
  const onDropTo = (dest) => { if (dragCard) { moveCard(dragCard, dest); setMovedCard(dragCard); if (movedTimer.current) clearTimeout(movedTimer.current); movedTimer.current = setTimeout(() => setMovedCard(null), 3000); } setDragCard(null); setDropTarget(null); };
  const cardProps = { canManage, dismissedFlags, onDismissFlag:dismissFlag, onMoveCard:moveCard, primaryModuleOf, selectedCard, onSelectCard:setSelectedCard, dragCard, movedCard, onDragStart, onDragEnd };
  const dndZone = { dragActive: !!dragCard, dropTarget, onDropTarget: setDropTarget, onDropTo, canManage };
  if (role==="offboarder"&&!isCapture&&!isDeliver) return <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center"><h3 className="text-sm font-medium text-gray-700 mb-1">Questions are being collected</h3><p className="text-xs text-gray-500">{"You\u2019ll see them when Capture starts."}</p></div>;
  if (!isReady) return <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center"><div className="w-10 h-10 rounded-full bg-violet-50 inline-flex items-center justify-center mb-3 mx-auto"><div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-violet-500 animate-spin"/></div><h3 className="text-sm font-medium text-gray-700 mb-1">Data is being collected...</h3></div>;
  const drawer = selectedCard&&<><div className="fixed inset-0 bg-black/10 z-30" onClick={()=>setSelectedCard(null)}/><div className="fixed top-0 right-0 h-full w-[480px] bg-white border-l border-gray-200 shadow-xl z-40 overflow-y-auto"><SidePanel key={selectedCard.name} card={selectedCard} role={role} onClose={()=>setSelectedCard(null)} isCapture={isCapture} isDeliver={isDeliver} isComplete={isComplete} primaryModule={primaryModuleOf(selectedCard)} sat={satCtl}/></div></>;
  // CW-R4-01 / R6-01 — gap-context drawer with a functional "Ask about this gap" for both
  // Coworker and Manager. Attribution differs: Manager → "Hà Vy", Coworker → "Coworker".
  const gapDrawer = ctxGap&&<><div className="fixed inset-0 bg-black/10 z-30" onClick={()=>setCtxGap(null)}/><div className="fixed top-0 right-0 h-full w-[480px] bg-white border-l border-gray-200 shadow-xl z-40 overflow-y-auto"><GapContextPanel moduleName={ctxGap} onClose={()=>setCtxGap(null)} showAsk={role!=="offboarder"} askLabel={role==="manager"?"Hà Vy":"Coworker"}/></div></>;
  if (role==="offboarder" && isCapture) return <div className="relative"><OffboarderQueue focusQ={focusQ} focusKey={focusKey} onSelectCard={setSelectedCard} selectedCard={selectedCard}/>{drawer}</div>;
  const showAnswers = isCapture||isDeliver; const showProgress = isCapture||isDeliver;
  const handleGQAsk = () => { if(gqInput.trim()){ onAddGQ(gqInput); setGqInput(""); } };
  return <div className="relative"><div>
    {!readOnly&&<div className="mb-4 flex items-center gap-2"><input value={gqInput} onChange={e=>setGqInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleGQAsk()} placeholder="Ask a general question..." className="flex-1 h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20"/><button onClick={handleGQAsk} className="h-9 px-3 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium cursor-pointer">Ask</button></div>}
    {generalQs.length>0&&<div className="rounded-lg border border-violet-200 bg-violet-50/20 mb-3 overflow-hidden"><div className="px-4 py-2.5 bg-violet-50/40 border-b border-violet-200 flex items-center gap-2"><MessageCircle className="w-3.5 h-3.5 text-violet-500"/><span className="text-sm font-semibold text-gray-900">General questions</span><span className="text-[11px] text-gray-500">{generalQs.length}</span></div>{generalQs.map(q=><div key={q.id} className="px-4 py-2.5 border-b border-violet-100 last:border-b-0"><EditableQuestion q={q} onEdit={onEditGQ} onDelete={onDeleteGQ} canEdit={canEditQs}/>{showAnswers&&q.answer&&<AnswerBlock q={q} role={role} committed={isComplete} readOnly={readOnly} sat={satCtl}/>}{isCapture&&!q.answer&&role==="offboarder"&&<AnswerInput/>}</div>)}</div>}
    {MODULES_DATA.map((board,bi)=><div key={bi} className="rounded-lg border border-gray-200 bg-white mb-3 overflow-hidden"><div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center gap-2"><Layers className="w-3.5 h-3.5 text-gray-400"/><span className="text-sm font-semibold text-gray-900">{board.board}</span><span className="text-[11px] text-gray-500">{board.boardCards}c</span></div>{board.modules.map((mod,mi)=><ModuleSection key={mi} mod={mod} role={role} isCapture={isCapture} isDeliver={isDeliver} isComplete={isComplete} canEditQs={canEditQs} primaryCards={primaryFor(mod.name)} linkedCards={linkedFor(mod.name)} showProgress={showProgress} addedQs={addedModQs.filter(q=>q.module===mod.name)} onAddModQ={onAddModQ} onEditModQ={onEditModQ} onDeleteModQ={onDeleteModQ} onSeeGapContext={role!=="offboarder"?setCtxGap:undefined} satKeys={satKeys} moreKeys={moreKeys} onSatisfyMany={satisfyMany} {...cardProps} {...dndZone}/>)}</div>)}
    {/* Uncategorized \u2014 AI couldn't confidently assign (1:N \u00a75). Drop target for moving cards out of modules. */}
    {uncats.length>0&&<div onDragOver={dndZone.canManage&&dndZone.dragActive?(e=>{e.preventDefault();if(dropTarget!=="__uncat__")setDropTarget("__uncat__");}):undefined} onDrop={dndZone.canManage&&dndZone.dragActive?(e=>{e.preventDefault();onDropTo("__uncat__");}):undefined} className={`rounded-lg border-2 border-dashed mb-3 overflow-hidden transition-colors ${dndZone.dragActive&&dropTarget==="__uncat__"?"border-violet-400 bg-violet-50/40":"border-gray-300 bg-gray-50/60"}`}><div className="px-4 py-2.5 border-b border-dashed border-gray-300 flex items-center gap-2"><Inbox className="w-3.5 h-3.5 text-gray-400"/><span className="text-sm font-semibold text-gray-700">Uncategorized</span><span className="text-[11px] text-gray-500">{uncats.length}</span><span className="text-[10px] text-gray-400 ml-1">{dndZone.dragActive?"Drop here to remove from module":"AI couldn\u2019t confidently assign these"}</span></div>{uncats.map((card,ci)=><CardRow key={ci} card={card} linked={false} showProgress={showProgress} moveTargets={ALL_MOD_NAMES.map(n=>({value:n,label:n}))} {...cardProps}/>)}</div>}
  </div>{drawer}{gapDrawer}</div>;
}

function CardRow({ card, linked, showProgress, moveTargets=[], canManage, dismissedFlags, onDismissFlag, onMoveCard, primaryModuleOf, selectedCard, onSelectCard, dragCard, movedCard, onDragStart, onDragEnd }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isSel = selectedCard?.name===card.name;
  const flags = cardFlags(card).filter(f=>!dismissedFlags.has(`${card.name}::${f}`));
  const st = showProgress?cardStatus(card):null;
  const primaryMod = linked&&primaryModuleOf?primaryModuleOf(card):null;
  const draggable = canManage && !linked; const isDragging = dragCard===card.name; const justMoved = movedCard===card.name;
  return <div draggable={draggable} onDragStart={draggable?(e=>{e.dataTransfer.effectAllowed="move";e.dataTransfer.setData("text/plain",card.name);onDragStart&&onDragStart(card.name);}):undefined} onDragEnd={draggable?(()=>onDragEnd&&onDragEnd()):undefined} className={`group/row relative w-full flex items-center gap-2 pr-3 py-2 border-t border-gray-50 ${linked?"pl-7 border-l-2 border-l-violet-300":"pl-10"} ${isDragging?"opacity-40 outline-dashed outline-1 outline-violet-300":""} ${isSel?"bg-violet-50 border-l-2 border-l-violet-500":"hover:bg-gray-50"}`} style={linked&&!isSel?{borderLeftStyle:"dashed"}:undefined}>
    {canManage&&(linked
      ? <span title="This card is linked to multiple modules — use Move to" className="opacity-0 group-hover/row:opacity-100 text-gray-200 cursor-not-allowed shrink-0 -ml-2"><GripVertical className="w-3 h-3"/></span>
      : <span title="Drag to move between modules" className="opacity-0 group-hover/row:opacity-100 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 shrink-0 -ml-2"><GripVertical className="w-3 h-3"/></span>)}
    {showProgress&&<span className="w-4 shrink-0 text-center">{st==="done"?<CheckCircle2 className="w-3.5 h-3.5 text-emerald-500"/>:st==="pending"?<span className="text-gray-400 text-[11px]">{"\u25CB"}</span>:<span className="text-gray-300 text-[11px]">{"\u2014"}</span>}</span>}
    <button onClick={()=>onSelectCard(card)} className="flex items-center gap-2 flex-1 min-w-0 text-left cursor-pointer"><FileText className={`w-3 h-3 shrink-0 ${linked?"text-violet-400":"text-gray-400"}`}/><span className={`text-[12px] truncate ${linked?"text-gray-500":"text-gray-800"}`}>{card.name}</span></button>
    {linked&&primaryMod&&<span className="text-[8px] px-1.5 py-0.5 rounded bg-violet-50 text-violet-600 border border-violet-200 inline-flex items-center gap-0.5 shrink-0" title={`Primary module: ${primaryMod}`}><ArrowUpRight className="w-2.5 h-2.5"/>{primaryMod}</span>}
    {card.files&&card.files.length>0&&<Paperclip className="w-2.5 h-2.5 text-gray-300 shrink-0"/>}
    {!linked&&flags.map(f=><span key={f} className="group/flag text-[8px] px-1 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200 inline-flex items-center gap-0.5 shrink-0" title="Mechanical metadata check">{f}{canManage&&<button onClick={e=>{e.stopPropagation();onDismissFlag(`${card.name}::${f}`);}} className="opacity-0 group-hover/flag:opacity-100 hover:text-rose-500 cursor-pointer text-[13px] leading-none ml-0.5" title="Dismiss flag">{"\u00D7"}</button>}</span>)}
    {card.qs.length>0&&<span className="text-[8px] px-1 py-0.5 rounded bg-violet-50 text-violet-600 shrink-0">{card.qs.length}Q</span>}
    {justMoved&&<span className="text-[8px] px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 border border-violet-200 shrink-0 inline-flex items-center gap-0.5"><Check className="w-2.5 h-2.5"/>moved</span>}
    {canManage&&!linked&&<div className="relative shrink-0 opacity-0 group-hover/row:opacity-100"><button onClick={e=>{e.stopPropagation();setMenuOpen(!menuOpen);}} className="text-[9px] text-gray-400 hover:text-violet-600 px-1.5 py-0.5 rounded border border-gray-200 hover:border-violet-200 inline-flex items-center gap-0.5 cursor-pointer">Move to<ChevronDown className="w-2.5 h-2.5"/></button>{menuOpen&&<><div className="fixed inset-0 z-10" onClick={e=>{e.stopPropagation();setMenuOpen(false);}}/><div className="absolute right-0 top-full mt-1 z-20 w-48 rounded-md border border-gray-200 bg-white shadow-lg py-1 max-h-56 overflow-y-auto">{moveTargets.map(t=><button key={t.value} onClick={e=>{e.stopPropagation();onMoveCard(card.name,t.value);setMenuOpen(false);}} className="w-full text-left px-2.5 py-1.5 text-[11px] text-gray-700 hover:bg-violet-50 hover:text-violet-700 cursor-pointer flex items-center gap-1.5">{t.value==="__uncat__"?<Inbox className="w-3 h-3 text-gray-400"/>:<Layers className="w-3 h-3 text-gray-400"/>}{t.label}</button>)}</div></>}</div>}
  </div>;
}

function ModuleSection({ mod, role, isCapture, isDeliver, isComplete, canEditQs, primaryCards=[], linkedCards=[], showProgress, addedQs, onAddModQ, onEditModQ, onDeleteModQ, onSeeGapContext, satKeys, moreKeys, onSatisfyMany, canManage, dismissedFlags, onDismissFlag, onMoveCard, primaryModuleOf, selectedCard, onSelectCard, dragCard, movedCard, onDragStart, onDragEnd, dragActive, dropTarget, onDropTarget, onDropTo }) {
  const [expanded, setExpanded] = useState(true); const [showModQ, setShowModQ] = useState(false); const [modInput, setModInput] = useState("");
  const [confirmFlags, setConfirmFlags] = useState(false); // R6-02 — confirm bulk flag dismissal
  const [renaming, setRenaming] = useState(false); const [displayName, setDisplayName] = useState(mod.name); const [renameInput, setRenameInput] = useState(mod.name);
  const prog = modProgress(mod); const moduleGaps = mod.moduleGaps||[]; const moduleGapQs = mod.moduleGapQs||[];
  const [gapQs, setGapQs] = useState(moduleGapQs); const [editingGap, setEditingGap] = useState(null); const [gapEditText, setGapEditText] = useState(""); const [confirmGap, setConfirmGap] = useState(null);
  const saveGapQ = (gi) => { if(gapEditText.trim()) setGapQs(p=>p.map((x,i)=>i===gi?gapEditText.trim():x)); setEditingGap(null); };
  const delGapQ = (gi) => { setGapQs(p=>p.map((x,i)=>i===gi?null:x)); setEditingGap(null); };
  const readOnly = isDeliver;
  const totalQs = (mod.qs||0) + addedQs.length;
  const cardCount = primaryCards.length + linkedCards.length;
  const moveTargets = [...ALL_MOD_NAMES.filter(n=>n!==mod.name).map(n=>({value:n,label:n})), {value:"__uncat__",label:"Uncategorized"}];
  const cardCommon = { showProgress, canManage, dismissedFlags, onDismissFlag, onMoveCard, primaryModuleOf, selectedCard, onSelectCard, dragCard, movedCard, onDragStart, onDragEnd };
  const handleModAsk = () => { if(modInput.trim()){ onAddModQ(modInput, mod.name); setModInput(""); setShowModQ(false); } };
  const handleRename = () => { if(renameInput.trim()){ setDisplayName(renameInput.trim()); setRenaming(false); } };
  // R6-02 — bulk-op candidates across this module's cards (Manager-only). Satisfy excludes "needs more".
  const moduleCards = [...primaryCards, ...linkedCards];
  const unsatisfiedKeys = moduleCards.flatMap(c=>(c.qs||[]).filter(q=>q.answer && !q.satisfiedBy && !(satKeys&&satKeys.has(q.q)) && !(moreKeys&&moreKeys.has(q.q))).map(q=>q.q));
  const undismissedFlags = moduleCards.flatMap(c=>cardFlags(c).filter(f=>!(dismissedFlags&&dismissedFlags.has(`${c.name}::${f}`))).map(f=>`${c.name}::${f}`));
  const showSatisfyAll = role==="manager" && isCapture && unsatisfiedKeys.length>=2;
  const showDismissAll = canManage && undismissedFlags.length>=2;
  const isDrop = dragActive && dropTarget===mod.name;
  return <div onDragOver={canManage&&dragActive?(e=>{e.preventDefault();if(dropTarget!==mod.name)onDropTarget(mod.name);}):undefined} onDrop={canManage&&dragActive?(e=>{e.preventDefault();onDropTo(mod.name);}):undefined} className={`border-b border-gray-100 last:border-b-0 transition-colors ${isDrop?"ring-2 ring-inset ring-violet-400 bg-violet-50/30":""}`}>
    <div className="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-50">{renaming?<div className="flex items-center gap-2 flex-1" onClick={e=>e.stopPropagation()}><ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${expanded?"":"-rotate-90"}`}/><input value={renameInput} onChange={e=>setRenameInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")handleRename();if(e.key==="Escape"){setRenameInput(displayName);setRenaming(false);}}} className="flex-1 h-7 px-2 rounded border border-violet-300 text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20" autoFocus/><button onClick={handleRename} className="w-6 h-6 rounded bg-violet-600 text-white inline-flex items-center justify-center cursor-pointer hover:bg-violet-700"><Check className="w-3 h-3"/></button><button onClick={()=>{setRenameInput(displayName);setRenaming(false);}} className="w-6 h-6 rounded border border-gray-300 text-gray-500 inline-flex items-center justify-center cursor-pointer hover:bg-gray-50"><X className="w-3 h-3"/></button></div>:<button onClick={()=>setExpanded(!expanded)} className="flex items-center gap-2 flex-1 text-left cursor-pointer"><ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${expanded?"":"-rotate-90"}`}/><span className="text-[13px] font-medium text-gray-900">{displayName}</span><span className="text-[11px] text-gray-500">{cardCount}c</span>{totalQs>0&&<span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-50 text-violet-600 border border-violet-200">{totalQs}Qs</span>}{moduleGaps.length>0&&<span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-50 text-yellow-700 border border-yellow-200 inline-flex items-center gap-0.5"><Sparkles className="w-2.5 h-2.5"/>{moduleGaps.length}{" gap"}{moduleGaps.length>1?"s":""}</span>}{showProgress&&prog.total>0&&<span className={`text-[9px] px-1.5 py-0.5 rounded border ${prog.answered===prog.total?"bg-emerald-50 text-emerald-700 border-emerald-200":"bg-gray-50 text-gray-600 border-gray-200"}`}>{prog.answered}/{prog.total}</span>}</button>}{role==="manager"&&!readOnly&&!renaming&&<span onClick={e=>{e.stopPropagation();setRenaming(true);setRenameInput(displayName);}} className="text-[10px] text-gray-400 hover:text-violet-600 cursor-pointer shrink-0 ml-2">Rename</span>}</div>
    {expanded&&<>
      {/* Module-level GAPS \u2014 AI-detected missing knowledge (yellow + sparkle), each generates a question (\u00A74). */}
      {moduleGaps.length>0&&<div className="px-4 py-2 pl-10 border-t border-gray-50 space-y-1.5">{moduleGaps.map((g,gi)=>{const gq=gapQs[gi];return <div key={gi} className="rounded-md bg-yellow-50 border border-yellow-200 px-2.5 py-1.5"><div className="text-[10px] text-yellow-800 flex items-start gap-1.5"><Sparkles className="w-3 h-3 shrink-0 mt-0.5 text-yellow-600"/>{g}</div>{gq&&(editingGap===gi?<div className="flex items-center gap-1.5 mt-1.5 pl-4"><input value={gapEditText} onChange={e=>setGapEditText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")saveGapQ(gi);if(e.key==="Escape")setEditingGap(null);}} autoFocus className="flex-1 h-6 px-1.5 rounded border border-violet-300 text-[10px] focus:outline-none focus:ring-2 focus:ring-violet-500/20"/><button onClick={()=>saveGapQ(gi)} className="w-5 h-5 rounded bg-violet-600 text-white inline-flex items-center justify-center cursor-pointer hover:bg-violet-700"><Check className="w-3 h-3"/></button><button onClick={()=>setEditingGap(null)} className="w-5 h-5 rounded border border-gray-300 text-gray-500 inline-flex items-center justify-center cursor-pointer hover:bg-gray-50"><X className="w-3 h-3"/></button></div>:<div className="text-[10px] text-violet-700 flex items-start gap-1.5 mt-1.5 pl-4 border-t border-yellow-200/70 pt-1.5"><HelpCircle className="w-3 h-3 shrink-0 mt-0.5 text-violet-500"/><span className="flex-1"><span className="text-violet-500 font-medium">AI question:</span> {gq}</span>{onSeeGapContext&&<button onClick={()=>onSeeGapContext(mod.name)} className="text-[9px] text-violet-600 hover:text-violet-700 cursor-pointer inline-flex items-center gap-1 shrink-0" title="See why this gap was flagged"><ExternalLink className="w-2.5 h-2.5"/>See in context</button>}{canEditQs&&<span className="flex items-center gap-1 shrink-0"><button onClick={()=>{setEditingGap(gi);setGapEditText(gq);}} className="w-5 h-5 rounded border border-yellow-300 bg-white/60 hover:bg-white inline-flex items-center justify-center text-gray-400 hover:text-violet-600 cursor-pointer" title="Edit question"><Pencil className="w-2.5 h-2.5"/></button><button onClick={()=>setConfirmGap(gi)} className="w-5 h-5 rounded border border-yellow-300 bg-white/60 hover:bg-rose-50 inline-flex items-center justify-center text-gray-400 hover:text-rose-600 cursor-pointer" title="Delete question — gap stays flagged"><Trash2 className="w-2.5 h-2.5"/></button></span>}</div>)}{canEditQs&&<button onClick={()=>{const gen=moduleGapQs[gi]||`What is the documented procedure that fills the "${g}" gap?`;setGapQs(p=>p.map((x,i)=>i===gi?gen:x));setEditingGap(gi);setGapEditText(gen);}} className="text-[10px] text-violet-600 hover:text-violet-700 inline-flex items-center gap-1 mt-1.5 pl-4 cursor-pointer"><Plus className="w-2.5 h-2.5"/>{gq?"Generate another question":"Generate question"}</button>}{confirmGap===gi&&<ConfirmDeleteQ onConfirm={()=>{delGapQ(gi);setConfirmGap(null);}} onCancel={()=>setConfirmGap(null)}/>}</div>;})}</div>}
      {primaryCards.map((card,ci)=><CardRow key={"p"+ci} card={card} linked={false} moveTargets={moveTargets} {...cardCommon}/>)}
      {linkedCards.map((card,ci)=><CardRow key={"l"+ci} card={card} linked={true} {...cardCommon}/>)}
      {cardCount===0&&<div className="px-4 py-2 pl-10 text-[11px] text-gray-400 border-t border-gray-50">No cards</div>}
      {addedQs.length>0&&<div className="px-4 py-2 pl-10 border-t border-gray-100"><p className="text-[9px] text-violet-600 uppercase tracking-wider font-medium mb-1">{"Added questions ("}{addedQs.length}{")"}</p>{addedQs.map(q=><div key={q.id} className="py-1"><EditableQuestion q={q} onEdit={onEditModQ} onDelete={onDeleteModQ} canEdit={canEditQs}/></div>)}</div>}
      {role!=="offboarder"&&!readOnly&&<div className="px-4 py-1.5 pl-10 border-t border-gray-50"><button onClick={e=>{e.stopPropagation();setShowModQ(!showModQ)}} className="text-[10px] text-violet-600 inline-flex items-center gap-1 hover:text-violet-700 cursor-pointer"><Plus className="w-2.5 h-2.5"/>Ask about this module</button>{showModQ&&<div className="flex gap-1.5 mt-1.5"><input value={modInput} onChange={e=>setModInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleModAsk()} placeholder={`Question about ${mod.name}...`} className="flex-1 h-7 px-2 rounded border border-gray-200 text-[10px] focus:outline-none focus:ring-2 focus:ring-violet-500/20"/><button onClick={handleModAsk} className="h-7 px-2 rounded bg-violet-600 text-white text-[9px] cursor-pointer">Ask</button></div>}</div>}
      {(showSatisfyAll||showDismissAll)&&<div className="px-4 py-2 pl-10 border-t border-gray-100 flex items-center justify-end gap-2">
        {showDismissAll&&<button onClick={()=>setConfirmFlags(true)} className="h-7 px-2.5 rounded-md border border-gray-300 bg-white text-gray-600 text-[10px] font-medium inline-flex items-center gap-1 hover:bg-gray-50 cursor-pointer"><X className="w-3 h-3"/>{"Dismiss all flags ("}{undismissedFlags.length}{")"}</button>}
        {showSatisfyAll&&<button onClick={()=>onSatisfyMany(unsatisfiedKeys)} className="h-7 px-2.5 rounded-md text-[10px] font-medium inline-flex items-center gap-1 cursor-pointer" style={{border:"1px solid #c4b5fd",background:"#f5f3ff",color:"#5b21b6"}}><CheckCircle2 className="w-3 h-3"/>{"Satisfy remaining ("}{unsatisfiedKeys.length}{")"}</button>}
      </div>}
      {confirmFlags&&<ConfirmDismissFlags count={undismissedFlags.length} module={displayName} onConfirm={()=>{undismissedFlags.forEach(k=>onDismissFlag(k));setConfirmFlags(false);}} onCancel={()=>setConfirmFlags(false)}/>}
    </>}
  </div>;
}

function AnswerBlock({ q, role, committed, readOnly, sat }) {
  // R6-02 — when a `sat` controller is supplied (Manager Data tab), satisfaction/needs-more is
  // lifted so module-level "Satisfy remaining" can drive it. Otherwise falls back to local state.
  const key = q.q;
  const [localSat, setLocalSat] = useState(false); const [localSent, setLocalSent] = useState(false);
  const [showMore, setShowMore] = useState(false); const [moreText, setMoreText] = useState("");
  const satisfied = !!q.satisfiedBy || (sat ? sat.satKeys.has(key) : localSat);
  const sentBack = sat ? sat.moreKeys.has(key) : localSent;
  const doSatisfy = () => { if (sat) sat.onSatisfyQ(key); else setLocalSat(true); };
  const doSendBack = () => { if (sat) sat.onMoreQ(key); else setLocalSent(true); setShowMore(false); };
  return <div className="mt-2"><div className="rounded-md px-3 py-2 bg-gray-50 border-l-2 border-emerald-400"><p className="text-[10px] text-gray-500 mb-1">{q.answeredBy}{" · "}{q.answeredAt}{committed&&<span className="ml-1 text-[8px] px-1 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-0.5"><CheckCircle2 className="w-2 h-2"/>Committed</span>}</p><p className="text-[11px] text-gray-800 leading-relaxed">{q.answer}</p>{q.file&&<p className="text-[10px] text-gray-500 mt-1.5 flex items-center gap-1"><Paperclip className="w-2.5 h-2.5"/>{q.file.name}{" ("}{q.file.size}{")"}</p>}</div>{role!=="offboarder"&&!readOnly&&!committed&&<div className="mt-1.5">{satisfied?<p className="text-[10px] text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/>{"Satisfied by "}{q.satisfiedBy||"you"}{" · "}{q.satisfiedAt||"now"}</p>:sentBack?<div className="rounded-md bg-yellow-50 border border-yellow-200 px-2.5 py-1.5"><p className="text-[10px] text-yellow-800 font-medium">{"↩ Revision requested — sent back to Minh Lê"}</p>{moreText&&<p className="text-[10px] text-gray-600 mt-0.5 italic">&quot;{moreText}&quot;</p>}</div>:<div className="flex items-center gap-2"><button onClick={doSatisfy} className="h-6 px-2 rounded border border-emerald-300 text-emerald-700 text-[10px] inline-flex items-center gap-1 hover:bg-emerald-50 cursor-pointer"><CheckCircle2 className="w-2.5 h-2.5"/>Satisfy</button><button onClick={()=>setShowMore(!showMore)} className="h-6 px-2 rounded border border-yellow-300 text-yellow-700 text-[10px] inline-flex items-center gap-1 hover:bg-yellow-50 cursor-pointer">Needs more</button></div>}{showMore&&!sentBack&&!satisfied&&<div className="mt-1.5"><textarea value={moreText} onChange={e=>setMoreText(e.target.value)} placeholder="What's missing? This note goes back to the offboarder with the question." className="w-full h-12 px-2 py-1 rounded border border-yellow-300 text-[10px] resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500/20"/><div className="flex justify-end mt-1"><button onClick={doSendBack} className="h-6 px-2 rounded bg-yellow-600 text-white text-[9px] cursor-pointer hover:bg-yellow-700">Send back</button></div></div>}</div>}{(readOnly||committed)&&satisfied&&<p className="mt-1 text-[10px] text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/>{"Satisfied by "}{q.satisfiedBy}{" · "}{q.satisfiedAt}</p>}</div>;
}

function AnswerInput() { return <div className="mt-2"><textarea placeholder="Type your answer..." className="w-full h-16 px-2 py-1.5 rounded border border-gray-200 text-[11px] resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/20"/><div className="flex items-center justify-end mt-1"><button className="h-6 px-2 rounded bg-violet-600 text-white text-[10px] cursor-pointer">Submit</button></div></div>; }

function SidePanel({ card, role, onClose, isCapture, isDeliver, isComplete, primaryModule, sat }) {
  const [followUp, setFollowUp] = useState(""); const showAnswers = isCapture||isDeliver; const readOnly = isDeliver;
  const flags = cardFlags(card);
  const linkedMods = (card.linkedIn||[]); const isUncat = primaryModule==="__uncat__";
  // §8.2 — card questions (incl. AI-generated) are editable/deletable by Manager + Coworker in Prepare. Keyed remount gives fresh state per card.
  const isPrepare = !isCapture && !isDeliver; const canEditQ = isPrepare && role!=="offboarder";
  const [qs, setQs] = useState(()=>card.qs.map((q,i)=>({ ...q, id: q.id||`cq${i}` })));
  const editQ = (id,t)=>setQs(p=>p.map(x=>x.id===id?{...x,q:t}:x));
  const delQ = (id)=>setQs(p=>p.filter(x=>x.id!==id));
  return <div className="p-5">
    <div className="flex items-center justify-between mb-3"><h3 className="text-[15px] font-semibold text-gray-900">{card.name}</h3><button onClick={onClose} className="w-7 h-7 rounded-md hover:bg-gray-100 inline-flex items-center justify-center text-gray-400 cursor-pointer"><X className="w-4 h-4"/></button></div>
    {/* Modules — a card can belong to several; primary marked. No percentages (§5). */}
    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-1 mb-1.5">Modules</p>
    <div className="flex flex-wrap gap-1.5 mb-1">{isUncat?<span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200 inline-flex items-center gap-1"><Inbox className="w-2.5 h-2.5"/>Uncategorized</span>:<><span className="text-[10px] px-2 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-200 font-medium">{primaryModule}<span className="text-violet-400 ml-1">primary</span></span>{linkedMods.map(m=><span key={m} className="text-[10px] px-2 py-0.5 rounded bg-white text-violet-600 border border-violet-200 border-dashed inline-flex items-center gap-0.5">{m}</span>)}</>}</div>
    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-3 mb-1 pt-2 border-t border-gray-100">Description</p><p className="text-[11px] text-gray-700 leading-relaxed mb-2">{card.desc||<span className="text-gray-400 italic">No description</span>}</p>
    {card.checklist.length>0&&<><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-3 mb-1 pt-2 border-t border-gray-100">Checklist</p>{card.checklist.map((c,i)=><div key={i} className="flex items-center gap-1.5 text-[11px] py-0.5">{c.done?<CheckCircle2 className="w-3 h-3 text-emerald-500"/>:<div className="w-3 h-3 rounded border border-gray-300"/>}<span className={c.done?"text-gray-500 line-through":"text-gray-700"}>{c.text}</span></div>)}</>}
    {/* Flags — mechanical metadata checks, informational only (§4). */}
    {flags.length>0&&<><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-3 mb-1.5 pt-2 border-t border-gray-100">{"Flags ("}{flags.length}{")"}</p><div className="flex flex-wrap gap-1.5 mb-1">{flags.map((f,i)=><span key={i} className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">{f}</span>)}</div><p className="text-[9px] text-gray-400 mb-1">Automated metadata checks — informational, not knowledge gaps.</p></>}
    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-3 mb-1 pt-2 border-t border-gray-100">{"Files ("}{(card.files||[]).length}{")"}</p>
    {(card.files||[]).length>0?(card.files||[]).map((f,i)=><div key={i} className="flex items-center gap-2 text-[11px] py-1.5 px-2.5 rounded-md bg-gray-50 mb-1"><Paperclip className="w-3 h-3 text-gray-400 shrink-0"/><span className="text-gray-800 flex-1">{f.name}</span><span className="text-[10px] text-gray-400">{f.size}</span></div>):<p className="text-[11px] text-gray-400 mb-1">No files yet</p>}
    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-3 mb-1 pt-2 border-t border-gray-100">{"Questions ("}{qs.length}{")"}</p>
    {qs.length>0?qs.map((q,i)=>canEditQ?<div key={q.id} className="bg-gray-50 rounded-md px-2.5 py-2 mb-1.5"><EditableQuestion q={q} onEdit={editQ} onDelete={delQ} canEdit/></div>:<div key={q.id} className="text-[11px] bg-gray-50 rounded-md px-2.5 py-2 mb-1.5"><p className="text-gray-900 mb-0.5">{q.q}</p><p className="text-[10px] text-gray-500 flex items-center gap-1">{q.from==="AI-generated"?<><Sparkles className="w-2.5 h-2.5 text-violet-500"/>{q.from}</>:<><User className="w-2.5 h-2.5"/>{q.from}</>}</p>{showAnswers&&q.answer&&<AnswerBlock q={q} role={role} committed={isComplete} readOnly={readOnly} sat={sat}/>}{isCapture&&!q.answer&&role==="offboarder"&&<AnswerInput/>}</div>):<p className="text-[11px] text-gray-400 mb-1">No questions yet</p>}
    {role!=="offboarder"&&!readOnly&&<><p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-3 mb-1 pt-2 border-t border-gray-100">Ask a question</p><div className="flex gap-1.5"><input value={followUp} onChange={e=>setFollowUp(e.target.value)} placeholder="Your question..." className="flex-1 h-8 px-2.5 rounded-md border border-gray-200 text-[11px] focus:outline-none focus:ring-2 focus:ring-violet-500/20"/><button className="h-8 px-2.5 rounded-md bg-violet-600 text-white text-[10px] font-medium cursor-pointer">Ask</button></div></>}
  </div>;
}

function LogsContent({ role, stepId }) {
  if (stepId==="collecting"||(role==="offboarder"&&stepId==="ready")) return <div className="text-center py-8 text-sm text-gray-500">No activity yet</div>;
  const logs = [
    ...(stepId==="complete"?[{ts:"3:42 PM",type:"system",text:"H\u00e0 Vy committed to Knowledge Graph \u2014 9 answers, 5 modules",accent:"#5DCAA5"}]:[]),
    ...(stepId==="deliver"||stepId==="complete"?[{ts:"2:30 PM",type:"system",text:"H\u00e0 Vy moved session to Deliver"}]:[]),
    ...(["capture","deliver","complete"].includes(stepId)?[
      {ts:"2:15 PM",type:"questions",text:"Minh L\u00ea answered about token refresh"},
      {ts:"1:40 PM",type:"questions",text:"Coworker A marked satisfied: webhook events"},
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
   4 scenes: simple match → second match → 1:N split (★ primary + ↗ linked) → no match (Uncategorized). */
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
      <span className="cat-cap cap-c text-gray-700">2 matches → <span className="text-violet-700">★ primary</span> + <span className="text-pink-600">↗ linked</span></span>
      <span className="cat-cap cap-d text-gray-500">No confident match → Uncategorized</span>
    </div>
    <div className="relative mx-auto" style={{width:420,height:180}}>
      <div className="cat-hub"><Sparkles className="w-4 h-4 text-violet-600"/></div>
      <div className="cat-card cat-a" style={{background:"#f5f3ff",border:"1px solid #c4b5fd",color:"#6d28d9"}}>A</div>
      <div className="cat-card cat-b" style={{background:"#eff6ff",border:"1px solid #bfdbfe",color:"#1d4ed8"}}>B</div>
      <div className="cat-card cat-cp" style={{background:"#f5f3ff",border:"1px solid #c4b5fd",color:"#6d28d9"}}>{"★"}</div>
      <div className="cat-card cat-cl" style={{background:"#fdf2f8",border:"1px solid #fbcfe8",color:"#be185d"}}>{"↗"}</div>
      <div className="cat-card cat-d" style={{background:"#f9fafb",border:"1px solid #e5e7eb",color:"#6b7280"}}>D</div>
      {buckets.map(b=><div key={b.label} className="absolute flex items-center justify-center text-[9px] font-semibold" style={{left:b.left,top:140,width:78,height:30,borderRadius:8,background:b.bg,border:`1px solid ${b.bd}`,color:b.fg}}>{b.label}</div>)}
    </div>
    <p className="text-center text-[11px] text-gray-500 mt-2" style={{fontFamily:"ui-monospace,Menlo,monospace"}}>Sorting cards… 12 · 28 · 47 · 64 {"✓"}</p>
  </div>;
}
