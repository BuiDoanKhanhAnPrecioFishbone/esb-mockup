"use client";
import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, AlertTriangle, Sparkles, Database, ArrowLeftRight, Shield, ArrowRight, Info, ChevronDown, FileText, Flag } from "lucide-react";

export function DeliverOverview({ role, onSwitchTab, S, MD, modProgress, MC, ProgressBar }) {
  const [showCommit, setShowCommit] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const [flagged, setFlagged] = useState(() => new Set());
  const [dvOpen, setDvOpen] = useState(false); // UX-02: collapsed by default

  if (role === "offboarder") return <div className="space-y-4"><div className="text-center py-4"><div className="w-12 h-12 rounded-full bg-violet-100 text-violet-700 text-sm font-semibold inline-flex items-center justify-center mx-auto mb-3">{S.initials}</div><h2 className="text-xl font-semibold">{"Thank you, "}<span className="text-violet-600">Minh</span>.</h2><p className="text-[12px] text-gray-500 max-w-xs mx-auto mt-2">{"Your contributions are captured. H\u00e0 Vy will review before committing to the Knowledge Graph."}</p></div><div className="rounded-lg border border-gray-200 bg-white p-4"><p className="text-[11px] font-medium mb-2">What you contributed</p><div className="grid grid-cols-2 gap-3"><MC l="Answered" v={S.answered}/><MC l="Gaps addressed" v={S.gapsAddressed}/></div></div><div className="rounded-lg border border-gray-200 bg-white p-4"><p className="text-[11px] font-medium mb-2">What happens next</p><div className="space-y-2">{[{n:1,t:"H\u00e0 Vy reviews your contributions",d:"You\u2019ll get a copy of any follow-ups.",active:true},{n:2,t:"Knowledge Graph commit",d:"Your answers will be available to the team in the Knowledge Graph."}].map(s=><div key={s.n} className="flex gap-2.5 text-[11px]"><div className={`w-5 h-5 rounded-full text-[10px] font-medium flex items-center justify-center shrink-0 ${s.active?"bg-violet-100 text-violet-700":"bg-gray-100 text-gray-500"}`}>{s.n}</div><div><p className="font-medium">{s.t}</p><p className="text-gray-500 text-[10px]">{s.d}</p></div></div>)}</div></div></div>;
  if (role === "coworker") return <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center"><div className="w-12 h-12 rounded-full bg-gray-100 inline-flex items-center justify-center mb-3 mx-auto"><Clock className="w-5 h-5 text-gray-400" strokeWidth={1.5}/></div><h3 className="text-sm font-medium text-gray-700 mb-1">Session is being finalized</h3><p className="text-xs text-gray-500 max-w-xs mx-auto">{"H\u00e0 Vy is reviewing contributions before committing to the Knowledge Graph."}</p></div>;

  const ENTRIES = 42;
  const ANSWERED = S.answered ?? 14;
  const MODULES = S.modules ?? 5;
  const SENSITIVE = 3;

  const resolvedGaps = [
    { module: "Payment Service", gap: "Missing SLA definitions", how: "answered by Minh L\u00ea" },
    { module: "CI/CD Pipeline", gap: "Atlas migration rollback procedure missing", how: "answered by Minh L\u00ea" },
    { module: "Shared Libraries", gap: "API key rotation runbook location unknown", how: "answered by Minh L\u00ea" },
    { module: "Monitoring & Alerts", gap: "No incident response runbook", how: "dismissed by H\u00e0 Vy" },
  ];
  const unresolvedGaps = [
    { module: "Payment Service", gap: "No disaster recovery or failover procedures documented", status: "1 question waiting" },
    { module: "Payment Service", gap: "No error escalation process defined", status: "0 questions" },
    { module: "Monitoring & Alerts", gap: "No alert routing documented", status: "1 question waiting" },
  ];

  return <div className="space-y-4 pb-20">
    {/* DP-04: violet gradient header */}
    <div className="rounded-xl p-5" style={{ background: "linear-gradient(135deg, #f5f3ff, #ede9fe)" }}>
      <h2 className="text-xl font-semibold text-violet-900"><Sparkles className="w-4 h-4 inline mr-1.5 text-violet-500"/>Ready to commit</h2>
      <p className="text-[12px] text-violet-600 mt-1">Review Minh L&#234;&apos;s knowledge before committing to the Knowledge Graph.</p>
    </div>

    {/* Knowledge summary */}
    <div className="grid grid-cols-3 gap-3">
      <MC l="Entries total" v={ENTRIES}/>
      <MC l="Questions answered" v={ANSWERED}/>
      <MC l="Modules covered" v={MODULES}/>
    </div>

    {/* Data Validation — UX-02: collapsed by default */}
    <DataValidation MD={MD} flagged={flagged} setFlagged={setFlagged} onBackToCapture={()=>setShowBack(true)} dvOpen={dvOpen} setDvOpen={setDvOpen}/>

    {/* Resolved gaps */}
    <ResolvedGaps items={resolvedGaps}/>

    {/* Unresolved gaps */}
    {unresolvedGaps.length > 0 && <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-[11px] font-medium text-gray-700 mb-3 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-yellow-600"/>Unresolved gaps<span className="text-gray-400" style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{unresolvedGaps.length}</span></p>
      <div className="space-y-2 mb-3">
        {unresolvedGaps.map((g, i) => <div key={i} className="flex items-start gap-2 text-[11px]">
          <Info className="w-3.5 h-3.5 text-yellow-600 shrink-0 mt-0.5"/>
          <div className="flex-1"><span className="text-gray-900">{g.gap}</span><span className="text-gray-400">{" \u00b7 "}{g.module}</span></div>
          <span className="text-yellow-700 text-[10px] shrink-0" style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{g.status}</span>
        </div>)}
      </div>
      <div className="text-[10px] text-yellow-800 bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2 flex items-start gap-1.5">
        <Info className="w-3 h-3 shrink-0 mt-0.5"/>
        <span>{unresolvedGaps.length} {unresolvedGaps.length === 1 ? "gap" : "gaps"} will remain unresolved and stored as potential knowledge.</span>
      </div>
    </div>}

    {/* Sanitization note */}
    <div className="rounded-md bg-blue-50 border border-blue-200 px-3 py-2.5 flex items-start gap-2">
      <Shield className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5"/>
      <p className="text-[11px] text-blue-800">{SENSITIVE} entries contain sensitive content that will be sanitized before commit.</p>
    </div>

    {/* UX-01: Sticky bottom action bar */}
    <div className="sticky bottom-0 z-10 -mx-4 px-4 py-3 bg-white border-t border-gray-200 flex items-center justify-between" style={{boxShadow:"0 -2px 8px rgba(0,0,0,0.04)"}}>
      <button onClick={()=>setShowBack(true)} className="h-9 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 inline-flex items-center gap-1.5"><ArrowLeftRight className="w-3.5 h-3.5"/>Back to Capture</button>
      <button onClick={()=>setShowCommit(true)} className="h-9 px-5 rounded-lg text-white text-sm font-medium inline-flex items-center gap-2" style={{background:"linear-gradient(135deg, #6366f1, #7c3aed)"}}><Database className="w-3.5 h-3.5"/>Commit to Knowledge Graph</button>
    </div>

    {showCommit && <CommitModal S={S} entries={ENTRIES} sensitive={SENSITIVE} unresolved={unresolvedGaps.length} validation={{ passed: TEST_CASES.filter(t=>t.result==="pass").length, total: TEST_CASES.length, flagged: flagged.size }} onClose={()=>setShowCommit(false)}/>}
    {showBack && <BackModal onClose={()=>setShowBack(false)}/>}
  </div>;
}

function ResolvedGaps({ items }) {
  const [open, setOpen] = useState(true);
  const collapsible = items.length > 5;
  const visible = collapsible && !open ? items.slice(0, 5) : items;
  return <div className="rounded-lg border border-gray-200 bg-white p-4">
    <button type="button" onClick={() => collapsible && setOpen(o => !o)} className={`w-full flex items-center gap-1.5 text-[11px] font-medium text-gray-700 mb-3 ${collapsible ? "hover:text-gray-900" : "cursor-default"}`}>
      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500"/>Resolved gaps<span className="text-gray-400" style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{items.length}</span>
      {collapsible && <ChevronDown className={`w-3.5 h-3.5 text-gray-400 ml-auto transition-transform ${open ? "" : "-rotate-90"}`}/>}
    </button>
    <div className="space-y-2">
      {visible.map((g, i) => <div key={i} className="flex items-start gap-2 text-[11px]">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5"/>
        <div className="flex-1"><span className="text-gray-900">{g.gap}</span><span className="text-gray-400">{" \u00b7 "}{g.module}</span></div>
        <span className="text-emerald-700 text-[10px] shrink-0">{g.how}</span>
      </div>)}
    </div>
  </div>;
}

function ConnectedNodes() {
  return (<svg className="mx-auto mb-3 relative" width="132" height="56" viewBox="0 0 132 56" fill="none" aria-hidden="true"><defs><linearGradient id="cn-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#34d399"/><stop offset="1" stopColor="#059669"/></linearGradient></defs><line x1="22" y1="28" x2="66" y2="12" stroke="#86efac" strokeWidth="1.5"/><line x1="22" y1="28" x2="66" y2="44" stroke="#86efac" strokeWidth="1.5"/><line x1="66" y1="12" x2="110" y2="28" stroke="#86efac" strokeWidth="1.5"/><line x1="66" y1="44" x2="110" y2="28" stroke="#86efac" strokeWidth="1.5"/><line x1="66" y1="12" x2="66" y2="44" stroke="#86efac" strokeWidth="1.5" strokeDasharray="3,3"/><circle cx="22" cy="28" r="7" fill="url(#cn-grad)"/><circle cx="66" cy="12" r="6" fill="url(#cn-grad)"/><circle cx="66" cy="44" r="6" fill="url(#cn-grad)"/><circle cx="110" cy="28" r="8" fill="url(#cn-grad)"/></svg>);
}

export function CompleteOverview({ role, S, MC }) {
  if (role === "offboarder") {
    const steps = [
      { title: "Your answers submitted", desc: `All ${S.questions} questions answered.`, state: "done" },
      { title: "Manager review", desc: "H\u00e0 Vy will verify your answers and resolve any gaps.", state: "active" },
      { title: "Committed to Knowledge Graph", desc: "Your knowledge becomes a permanent part of the team\u2019s memory.", state: "upcoming" },
    ];
    return <div className="max-w-lg mx-auto">
      <div className="relative overflow-hidden rounded-xl border border-emerald-200 p-7 text-center mb-5" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)" }}>
        <ConnectedNodes />
        <h2 className="text-xl font-semibold text-gray-900 mb-1 relative">{"Thank you, Minh L\u00ea"}</h2>
        <p className="text-[13px] text-gray-600 relative">Your knowledge has been preserved.</p>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-5"><MC l="Questions answered" v={S.questions}/><MC l="Modules covered" v={S.modules}/><MC l="Knowledge entries" v={42}/></div>
      <div className="rounded-lg border border-gray-200 bg-white p-5 mb-5"><p className="text-[11px] font-medium text-gray-700 mb-3 uppercase tracking-wider">What happens next</p><div className="space-y-3.5">{steps.map((s, i) => <div key={i} className="flex gap-3"><div className="shrink-0 mt-0.5">{s.state === "done" ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : s.state === "active" ? <span className="w-5 h-5 rounded-full bg-violet-100 border-2 border-violet-500 inline-flex items-center justify-center"><span className="w-1.5 h-1.5 rounded-full bg-violet-600" /></span> : <span className="w-5 h-5 rounded-full border-2 border-gray-300 inline-block" />}</div><div><p className={`text-[12px] font-medium ${s.state === "upcoming" ? "text-gray-500" : "text-gray-900"}`}>{s.title}{s.state === "active" && <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-200">In progress</span>}</p><p className="text-[11px] text-gray-500 mt-0.5">{s.desc}</p></div></div>)}</div></div>
      <p className="text-[12px] text-gray-500 text-center">Thank you for contributing to the team&apos;s success.</p>
    </div>;
  }
  if (role === "coworker") return <div className="max-w-lg mx-auto">
    <div className="relative overflow-hidden rounded-xl border border-emerald-200 p-7 text-center mb-5" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)" }}>
      <ConnectedNodes />
      <h2 className="text-xl font-semibold text-gray-900 mb-1 relative">Session complete</h2>
      <p className="text-[13px] text-gray-600 relative">{"Minh L\u00ea\u2019s knowledge is now in the Knowledge Graph."}</p>
    </div>
    <div className="grid grid-cols-2 gap-3 mb-5"><MC l="Questions you asked" v={4}/><MC l="Answers you reviewed" v={2}/></div>
    <p className="text-[12px] text-gray-500 text-center">{"The answers you reviewed are now available to the whole team."}</p>
  </div>;
  return <div className="space-y-4"><div className="rounded-md bg-emerald-50 border border-emerald-200 p-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0"/><div><p className="text-[12px] font-medium text-emerald-800">Committed to Knowledge Graph</p><p className="text-[10px] text-emerald-600" style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{"Jun 14, 2026 at 3:42 PM \u00b7 487 entries"}</p></div></div><div className="rounded-lg border border-gray-200 bg-white p-5"><div className="grid grid-cols-3 gap-3"><MC l="Entries committed" v={42}/><MC l="Questions answered" v={S.answered}/><MC l="Modules covered" v={S.modules}/></div><p className="text-[11px] text-gray-500 mt-3">{"Minh L\u00ea\u2019s knowledge is now available to the team in the Knowledge Graph."}</p><div className="flex gap-3 mt-3"><Link href={`/knowledge-graph?prompt=${S.id}`} className="h-8 px-3 rounded-md border border-violet-300 text-violet-700 text-xs font-medium inline-flex items-center gap-1.5 hover:bg-violet-50"><Sparkles className="w-3 h-3"/>Explore in Knowledge Graph</Link><Link href="/" className="h-8 px-3 rounded-md border border-gray-300 text-gray-700 text-xs font-medium inline-flex items-center gap-1.5 hover:bg-gray-50">Back to dashboard</Link></div></div></div>;
}

function CommitModal({ S, entries = 42, sensitive = 3, unresolved = 0, validation = { passed: 5, total: 8, flagged: 1 }, onClose }) {
  return <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={onClose}><div className="bg-white rounded-xl shadow-xl p-6 w-[400px] border border-gray-200" onClick={e=>e.stopPropagation()}><h3 className="text-base font-semibold mb-1">{"Commit "}{entries}{" entries to the Knowledge Graph?"}</h3><p className="text-[11px] text-gray-400 mb-3">This action cannot be undone.</p><div className="text-[12px] space-y-0.5 mb-3 text-gray-700"><p>{"\u00b7 "}{entries}{" entries across "}{S.modules}{" modules"}</p><p>{"\u00b7 "}{S.answered}{" questions answered"}</p></div><div className="text-[11px] text-blue-800 bg-blue-50 border border-blue-200 rounded-md px-3 py-2 mb-2 flex items-start gap-1.5"><Shield className="w-3.5 h-3.5 shrink-0 mt-0.5"/><span>{sensitive}{" entries contain sensitive content and will be sanitized before commit."}</span></div>{unresolved>0&&<div className="text-[11px] text-yellow-800 bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2 mb-2 flex items-start gap-1.5"><Info className="w-3.5 h-3.5 shrink-0 mt-0.5"/><span>{unresolved}{" unresolved "}{unresolved===1?"gap":"gaps"}{" will be preserved for future resolution."}</span></div>}<div className="text-[11px] text-violet-900 bg-violet-50 border border-violet-200 rounded-md px-3 py-2 mb-2 flex items-start gap-1.5"><Sparkles className="w-3.5 h-3.5 text-violet-500 shrink-0 mt-0.5"/><span>{"Data validation: "}{validation.passed}{"/"}{validation.total}{" test cases passed"}{validation.flagged>0?` (${validation.flagged} flagged)`:""}</span></div><div className="flex gap-2 justify-end mt-4"><button onClick={onClose} className="h-8 px-3 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button><button className="h-8 px-3 rounded-md bg-violet-600 text-white text-sm font-medium inline-flex items-center gap-1.5 hover:bg-violet-700"><Database className="w-3.5 h-3.5"/>Commit</button></div></div></div>;
}

function BackModal({ onClose }) {
  return <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={onClose}><div className="bg-white rounded-xl shadow-xl p-6 w-[380px] border border-gray-200" onClick={e=>e.stopPropagation()}><h3 className="text-base font-semibold mb-3">Reopen Capture?</h3><p className="text-[12px] text-gray-500 mb-2">{"This will reopen the session for Minh L\u00ea. He\u2019ll be notified that more input is needed."}</p><p className="text-[10px] text-gray-400 mb-4">You can move back to Deliver again when ready.</p><div className="flex gap-2 justify-end"><button onClick={onClose} className="h-8 px-3 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button><button className="h-8 px-3 rounded-md bg-rose-50 border border-rose-300 text-rose-700 text-sm font-medium inline-flex items-center gap-1.5 hover:bg-rose-100"><ArrowLeftRight className="w-3.5 h-3.5"/>Reopen Capture</button></div></div></div>;
}

/* -- Data Validation (UX-02/04: collapsed default, no emoji, colored dots) -- */
const DV_PERSONA = {
  newcomer: { label: "Newcomer" },
  manager: { label: "Manager" },
  coworker: { label: "Coworker" },
};
const DV_RESULT = {
  pass:    { label: "Answered",     dot: "bg-emerald-500", border: "border-l-emerald-500", text: "text-emerald-700" },
  partial: { label: "Partial",      dot: "bg-amber-500",   border: "border-l-amber-500",   text: "text-amber-700" },
  fail:    { label: "Insufficient", dot: "bg-rose-500",    border: "border-l-rose-500",    text: "text-rose-700" },
};
const TEST_CASES = [
  { id: "t1", persona: "newcomer", q: "How do I deploy the payment service?", result: "pass", module: "CI/CD Pipeline",
    ai: "Deploys run through the GitHub Actions workflow: lint \u2192 test \u2192 build \u2192 deploy. Staging auto-deploys; production needs manual approval.", note: "Grounded in 2 cards from CI/CD Pipeline.", cards: ["GitHub Actions workflow", "Docker image caching"] },
  { id: "t2", persona: "newcomer", q: "What\u2019s the retry logic for failed transactions?", result: "pass", module: "Payment Service",
    ai: "After 5 retries with exponential backoff, messages route to the DLQ, monitored via Datadog alert #4421.", note: "Grounded in the Kafka retry configuration card.", cards: ["Kafka retry configuration"] },
  { id: "t3", persona: "newcomer", q: "Who do I contact for Kafka issues?", result: "fail", module: "Payment Service",
    ai: "I don\u2019t have enough information. The data covers retry mechanics, but no ownership or escalation contacts were documented.", note: "No card covers escalation. Maps to gap: No error escalation process defined.", cards: [], gap: "No error escalation process defined" },
  { id: "t4", persona: "manager", q: "What SLAs exist for the payment gateway?", result: "pass", module: "Payment Service",
    ai: "The gateway uses a 30s circuit-breaker timeout; on trip it returns 503 and the client retries with an idempotency key.", note: "Grounded in the Payment gateway timeout card.", cards: ["Payment gateway timeout"] },
  { id: "t5", persona: "manager", q: "What are the key risks in the payment pipeline?", result: "partial", module: "Payment Service",
    ai: "Retry storms and DLQ backlog are covered. Reconciliation risk is partially covered \u2014 but there\u2019s no disaster-recovery view.", note: "Answered from 2 cards; disaster recovery is missing.", cards: ["Kafka retry configuration", "Refund reconciliation"], gap: "No disaster recovery or failover procedures documented" },
  { id: "t6", persona: "manager", q: "What\u2019s the disaster recovery procedure?", result: "fail", module: "Payment Service",
    ai: "I don\u2019t have enough information about disaster recovery. The collected data covers retry logic and webhook handling, but no DR procedures were documented.", note: "No card covers DR. Maps to GAP #1 in Payment Service.", cards: [], gap: "No disaster recovery or failover procedures documented" },
  { id: "t7", persona: "coworker", q: "How does the webhook handler work?", result: "pass", module: "Payment Service",
    ai: "The Stripe webhook handler processes payment confirmations and refunds. Critical events: payment_intent.succeeded, charge.refunded, invoice.payment_failed.", note: "Grounded in the Stripe webhook handler card.", cards: ["Stripe webhook handler"] },
  { id: "t8", persona: "coworker", q: "How is the DLQ consumer group configured?", result: "pass", module: "Payment Service",
    ai: "Poison messages route to the DLQ after 5 retries; a replay runbook is attached (dlq-replay-runbook.pdf).", note: "Grounded in the Kafka retry configuration card.", cards: ["Kafka retry configuration"] },
];

function DataValidation({ MD, flagged, setFlagged, onBackToCapture, dvOpen, setDvOpen }) {
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [rerunning, setRerunning] = useState(false);
  const isFlagged = (id) => flagged.has(id);
  const toggleFlag = (id) => setFlagged(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const counts = { pass: 0, partial: 0, fail: 0 };
  TEST_CASES.forEach(t => { counts[t.result]++; });
  const total = TEST_CASES.length;
  const flaggedFails = TEST_CASES.filter(t => t.result !== "pass" && isFlagged(t.id)).length;
  const pct = (n) => `${(n / total) * 100}%`;

  const filtered = TEST_CASES.filter(t => filter === "all" || t.persona === filter);
  const sorted = [...filtered].sort((a, b) => (isFlagged(a.id) ? 1 : 0) - (isFlagged(b.id) ? 1 : 0));
  const selected = TEST_CASES.find(t => t.id === expandedId);

  const tabs = [
    { id: "all", label: "All", count: total },
    { id: "newcomer", label: "Newcomer", count: TEST_CASES.filter(t => t.persona === "newcomer").length },
    { id: "manager", label: "Manager", count: TEST_CASES.filter(t => t.persona === "manager").length },
    { id: "coworker", label: "Coworker", count: TEST_CASES.filter(t => t.persona === "coworker").length },
  ];
  const rerun = () => { setRerunning(true); setTimeout(() => setRerunning(false), 900); };

  return <div className="rounded-lg border border-gray-200 bg-white">
    {/* UX-02/04: Summary bar — always visible, no emoji */}
    <button type="button" onClick={() => setDvOpen(o => !o)} className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 cursor-pointer">
      <Sparkles className="w-4 h-4 text-violet-500 shrink-0"/>
      <div className="flex-1 text-left">
        <span className="text-sm font-semibold text-gray-900">Data Validation</span>
        <span className="text-[11px] text-gray-500 ml-2">{counts.pass} passed, {counts.partial} partial, {counts.fail} gaps found{flaggedFails > 0 ? ` (${flaggedFails} flagged)` : ""}</span>
      </div>
      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dvOpen ? "" : "-rotate-90"}`}/>
    </button>

    {/* Progress bar — always visible */}
    <div className="px-4 pb-3 -mt-1">
      <div className="flex h-[5px] rounded-full overflow-hidden bg-gray-200">
        <div style={{ width: pct(counts.pass), background: "#059669" }}/><div style={{ width: pct(counts.partial), background: "#f59e0b" }}/><div style={{ width: pct(counts.fail), background: "#e11d48" }}/>
      </div>
    </div>

    {/* Expanded section — UX-02: collapsed by default */}
    {dvOpen && <>
      {/* Persona tabs — only inside expanded */}
      <div className="flex flex-wrap gap-1.5 px-4 pb-3 border-t border-gray-100 pt-3">{tabs.map(t => <button key={t.id} onClick={() => setFilter(t.id)} className={`h-7 px-2.5 rounded-md text-[11px] font-medium inline-flex items-center gap-1 border cursor-pointer ${filter === t.id ? "border-violet-300 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{t.label}<span className="text-gray-400" style={{ fontFamily: "ui-monospace,Menlo,monospace" }}>{t.count}</span></button>)}</div>

      {/* Two columns */}
      <div className="flex border-t border-gray-100">
        <div className="min-w-0" style={{ flexBasis: "55%" }}>
          {sorted.map(t => { const r = DV_RESULT[t.result]; const p = DV_PERSONA[t.persona]; const open = expandedId === t.id; const fl = isFlagged(t.id);
            return <div key={t.id} className={`border-b border-gray-100 ${fl ? "opacity-50" : ""} ${open ? "bg-gray-50/50" : ""}`}>
              {/* UX-02/04: Collapsed row — question + colored dot + chevron only */}
              <button onClick={() => setExpandedId(open ? null : t.id)} className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left cursor-pointer hover:bg-gray-50 border-l-[3px] ${r.border}`}>
                <span className="flex-1 min-w-0 text-[12px] text-gray-800 truncate">{t.q}</span>
                <span className={`w-2 h-2 rounded-full shrink-0 ${r.dot}`}/>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform ${open ? "" : "-rotate-90"}`}/>
              </button>
              {/* UX-02/04: Expanded — text labels only, no emoji */}
              {open && <div className="px-4 pb-3 space-y-2 text-[11px] border-l-[3px] border-l-violet-400">
                <div className="pt-1"><p className="text-gray-500 text-[10px]">{p.label} asks:</p><p className="text-gray-900 font-medium">{t.q}</p></div>
                <div><p className="text-gray-400 text-[10px]">AI:</p><div className="text-gray-700 leading-relaxed bg-gray-50 rounded-md px-3 py-2 border border-gray-100">{t.ai}</div></div>
                {t.note && <p className="text-[10px] text-gray-500 pl-1">{t.note}</p>}
                <div className="flex items-center justify-between pt-1">
                  <button onClick={(e) => { e.stopPropagation(); toggleFlag(t.id); }} className="text-[10px] text-gray-400 hover:text-gray-600 cursor-pointer inline-flex items-center gap-1"><Flag className="w-3 h-3"/>{fl ? "Unflag" : "Flag"}</button>
                  {t.result !== "pass" && <button onClick={(e) => { e.stopPropagation(); onBackToCapture(); }} className="text-[10px] text-violet-600 hover:text-violet-700 font-medium cursor-pointer">Back to Capture</button>}
                </div>
              </div>}
            </div>;
          })}
          <div className="px-3 py-2">
            <button onClick={rerun} disabled={rerunning} className="h-7 px-2.5 rounded-md border border-gray-300 text-[11px] font-medium text-gray-600 hover:bg-gray-50 inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60">{rerunning ? "Re-running\u2026" : "Re-run test cases"}</button>
          </div>
        </div>

        {/* UX-02/04: Right column — plain card names, one gap highlight */}
        <div className="shrink-0 border-l border-gray-100 bg-gray-50/50 p-3" style={{ flexBasis: "45%" }}>
          {selected ? <DVSource c={selected} MD={MD}/> : <p className="text-[11px] text-gray-400">Select a test case to see its source data.</p>}
        </div>
      </div>
    </>}
  </div>;
}

function DVSource({ c, MD }) {
  const mod = MD.flatMap(b => b.modules).find(m => m.name === c.module);
  const cards = mod ? mod.items.map(i => i.name) : [];
  const used = new Set(c.cards || []);
  const gaps = (mod && mod.moduleGaps) || [];
  const showGapExtra = c.gap && !gaps.includes(c.gap) && c.result !== "pass";
  return <div className="space-y-2 text-[11px]">
    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Source</p>
    <p className="text-[12px] font-medium text-violet-700">{c.module}</p>
    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium pt-1">{"Cards ("}{cards.length}{")"}</p>
    <div className="space-y-0.5">
      {cards.map((name, i) => <div key={i} className="text-[11px] text-gray-600 py-0.5 flex items-center gap-1.5">
        <FileText className="w-3 h-3 shrink-0 text-gray-400"/><span className="flex-1 truncate">{name}</span>{used.has(name) && <span className="text-[9px] font-medium text-emerald-600 shrink-0">used</span>}
      </div>)}
      {cards.length === 0 && <p className="text-gray-400">No cards in this module.</p>}
    </div>
    {(gaps.length > 0 || showGapExtra) && <>
      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium pt-1">Gaps</p>
      <div className="space-y-1">
        {gaps.map((g, i) => { const match = c.result !== "pass" && c.gap === g; return <div key={i} className={`flex items-start gap-1.5 px-2 py-1 rounded text-[11px] ${match ? "bg-yellow-50 border border-yellow-200 text-yellow-800" : "text-gray-600"}`}><AlertTriangle className="w-3 h-3 shrink-0 mt-0.5 text-yellow-600"/><span className="flex-1">{g}</span>{match && <span className="text-[9px] font-medium shrink-0 text-yellow-700">related</span>}</div>; })}
        {showGapExtra && <div className="flex items-start gap-1.5 px-2 py-1 rounded bg-yellow-50 border border-yellow-200 text-yellow-800 text-[11px]"><AlertTriangle className="w-3 h-3 shrink-0 mt-0.5 text-yellow-600"/><span className="flex-1">{c.gap}</span><span className="text-[9px] font-medium shrink-0 text-yellow-700">related</span></div>}
      </div>
    </>}
  </div>;
}
