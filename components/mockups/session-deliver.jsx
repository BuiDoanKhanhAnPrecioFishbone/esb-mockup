"use client";
import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, AlertTriangle, Sparkles, Database, ArrowLeftRight, Shield, PartyPopper, ArrowRight, Info, ChevronDown } from "lucide-react";

export function DeliverOverview({ role, onSwitchTab, S, MD, modProgress, MC, ProgressBar }) {
  const [showCommit, setShowCommit] = useState(false);
  const [showBack, setShowBack] = useState(false);
  if (role === "offboarder") return <div className="space-y-4"><div className="text-center py-4"><div className="w-12 h-12 rounded-full bg-violet-100 text-violet-700 text-sm font-semibold inline-flex items-center justify-center mx-auto mb-3">{S.initials}</div><h2 className="text-xl font-semibold">{"Thank you, "}<span className="text-violet-600">Minh</span>.</h2><p className="text-[12px] text-gray-500 max-w-xs mx-auto mt-2">{"Your contributions are captured. H\u00e0 Vy will review before committing to the Knowledge Graph."}</p></div><div className="rounded-lg border border-gray-200 bg-white p-4"><p className="text-[11px] font-medium mb-2">What you contributed</p><div className="grid grid-cols-3 gap-3"><MC l="Answered" v={S.answered}/><MC l="Files" v={1}/><MC l="Gaps addressed" v={S.gapsAddressed}/></div></div><div className="rounded-lg border border-gray-200 bg-white p-4"><p className="text-[11px] font-medium mb-2">What happens next</p><div className="space-y-2">{[{n:1,t:"H\u00e0 Vy reviews your contributions",d:"You\u2019ll get a copy of any follow-ups.",active:true},{n:2,t:"Knowledge Graph commit",d:"Your answers will be available to the team in the Knowledge Graph."}].map(s=><div key={s.n} className="flex gap-2.5 text-[11px]"><div className={`w-5 h-5 rounded-full text-[10px] font-medium flex items-center justify-center shrink-0 ${s.active?"bg-violet-100 text-violet-700":"bg-gray-100 text-gray-500"}`}>{s.n}</div><div><p className="font-medium">{s.t}</p><p className="text-gray-500 text-[10px]">{s.d}</p></div></div>)}</div></div></div>;
  if (role === "coworker") return <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center"><div className="w-12 h-12 rounded-full bg-gray-100 inline-flex items-center justify-center mb-3 mx-auto"><Clock className="w-5 h-5 text-gray-400" strokeWidth={1.5}/></div><h3 className="text-sm font-medium text-gray-700 mb-1">Session is being finalized</h3><p className="text-xs text-gray-500 max-w-xs mx-auto">{"H\u00e0 Vy is reviewing contributions before committing to the Knowledge Graph."}</p></div>;

  // MV-R05 \u2014 Manager Deliver review. Commit is NEVER blocked by gaps.
  const ENTRIES = 42;
  const ANSWERED = S.answered ?? 14;
  const MODULES = S.modules ?? 5;
  const SENSITIVE = 3;

  // All module-level gaps detected across boards.
  const allModuleGaps = MD.flatMap(b => b.modules.flatMap(m => (m.moduleGaps || []).map(g => ({ module: m.name, gap: g }))));
  const resolvedCount = S.gapsAddressed ?? 4;
  const unresolvedCount = Math.max(0, (S.gaps ?? 6) - resolvedCount);

  // Resolved gaps \u2014 believable items, topped up from real module gaps when available.
  const resolvedSeed = [
    { module: "Payment Service", gap: "Kafka poison-message handling undocumented", how: "answered by Minh L\u00ea" },
    { module: "CI/CD Pipeline", gap: "Atlas migration rollback procedure missing", how: "answered by Minh L\u00ea" },
    { module: "Shared Libraries", gap: "API key rotation runbook location unknown", how: "answered by Minh L\u00ea" },
    { module: "Inventory Sync", gap: "Vendor XYZ contract owner unclear", how: "dismissed by H\u00e0 Vy" },
    { module: "Monitoring & Alerts", gap: "Alert routing for batch failures undocumented", how: "answered by Minh L\u00ea" },
    { module: "Infrastructure as Code", gap: "Terraform state backend ownership unclear", how: "dismissed by H\u00e0 Vy" },
  ];
  const resolvedGaps = resolvedSeed.slice(0, resolvedCount);

  // Unresolved gaps \u2014 pull from real module gaps first, then fill.
  const unresolvedSeed = [
    { module: allModuleGaps[0]?.module || "Payment Service", gap: allModuleGaps[0]?.gap || "No disaster recovery or failover procedures documented", status: "1 question waiting" },
    { module: allModuleGaps[1]?.module || "CI/CD Pipeline", gap: allModuleGaps[1]?.gap || "Deployment described differently across modules", status: "0 questions" },
    { module: allModuleGaps[2]?.module || "Monitoring & Alerts", gap: allModuleGaps[2]?.gap || "SLA commitments undocumented", status: "1 question waiting" },
  ];
  const unresolvedGaps = unresolvedSeed.slice(0, unresolvedCount);

  return <div className="space-y-4">
    <div>
      <h2 className="text-xl font-semibold text-gray-900">Ready to commit</h2>
      <p className="text-[12px] text-gray-500 mt-1">Review Minh Lê&apos;s knowledge before committing to the Knowledge Graph.</p>
    </div>

    {/* Knowledge summary */}
    <div className="grid grid-cols-3 gap-3">
      <MC l="Entries total" v={ENTRIES}/>
      <MC l="Questions answered" v={ANSWERED}/>
      <MC l="Modules covered" v={MODULES}/>
    </div>

    {/* Resolved gaps */}
    <ResolvedGaps items={resolvedGaps}/>

    {/* Unresolved gaps */}
    {unresolvedGaps.length > 0 && <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-[11px] font-medium text-gray-700 mb-3 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-yellow-600"/>Unresolved gaps<span className="text-gray-400" style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{unresolvedGaps.length}</span></p>
      <div className="space-y-2 mb-3">
        {unresolvedGaps.map((g, i) => <div key={i} className="flex items-start gap-2 text-[11px]">
          <Info className="w-3.5 h-3.5 text-yellow-600 shrink-0 mt-0.5"/>
          <div className="flex-1"><span className="text-gray-900">{g.gap}</span><span className="text-gray-400">{" · "}{g.module}</span></div>
          <span className="text-yellow-700 text-[10px] shrink-0" style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{g.status}</span>
        </div>)}
      </div>
      <div className="text-[10px] text-yellow-800 bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2 flex items-start gap-1.5">
        <Info className="w-3 h-3 shrink-0 mt-0.5"/>
        <span>{unresolvedGaps.length} {unresolvedGaps.length === 1 ? "gap" : "gaps"} will remain unresolved and stored as potential knowledge. If relevant information is found during chunking, it will help resolve them. Otherwise, they remain logged for manual resolution.</span>
      </div>
    </div>}

    {/* Sanitization note */}
    <div className="rounded-md bg-blue-50 border border-blue-200 px-3 py-2.5 flex items-start gap-2">
      <Shield className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5"/>
      <p className="text-[11px] text-blue-800">{SENSITIVE} entries contain sensitive content that will be sanitized before commit.</p>
    </div>

    {/* Actions \u2014 Commit always enabled */}
    <div className="flex items-center gap-3">
      <button onClick={()=>setShowBack(true)} className="h-9 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 inline-flex items-center gap-1.5"><ArrowLeftRight className="w-3.5 h-3.5"/>Back to Capture</button>
      <button onClick={()=>setShowCommit(true)} className="h-9 px-4 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium inline-flex items-center gap-2"><Database className="w-3.5 h-3.5"/>Commit to KG</button>
    </div>

    {showCommit && <CommitModal S={S} entries={ENTRIES} sensitive={SENSITIVE} unresolved={unresolvedGaps.length} onClose={()=>setShowCommit(false)}/>}
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
        <div className="flex-1"><span className="text-gray-900">{g.gap}</span><span className="text-gray-400">{" · "}{g.module}</span></div>
        <span className="text-emerald-700 text-[10px] shrink-0">{g.how}</span>
      </div>)}
    </div>
  </div>;
}

function ConnectedNodes() {
  return (<svg className="mx-auto mb-3 relative" width="132" height="56" viewBox="0 0 132 56" fill="none" aria-hidden="true"><defs><linearGradient id="cn-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#34d399"/><stop offset="1" stopColor="#059669"/></linearGradient></defs><line x1="22" y1="28" x2="66" y2="12" stroke="#86efac" strokeWidth="1.5"/><line x1="22" y1="28" x2="66" y2="44" stroke="#86efac" strokeWidth="1.5"/><line x1="66" y1="12" x2="110" y2="28" stroke="#86efac" strokeWidth="1.5"/><line x1="66" y1="44" x2="110" y2="28" stroke="#86efac" strokeWidth="1.5"/><line x1="66" y1="12" x2="66" y2="44" stroke="#86efac" strokeWidth="1.5" strokeDasharray="3,3"/><circle cx="22" cy="28" r="7" fill="url(#cn-grad)"/><circle cx="66" cy="12" r="6" fill="url(#cn-grad)"/><circle cx="66" cy="44" r="6" fill="url(#cn-grad)"/><circle cx="110" cy="28" r="8" fill="url(#cn-grad)"/></svg>);
}
export function CompleteOverview({ role, S, MC }) {
  // OV-04 — Offboarder Complete: thank-you/celebration with connected-nodes header + 3-step timeline (no successor playbook).
  if (role === "offboarder") {
    const steps = [
      { title: "Your answers submitted", desc: `All ${S.questions} questions answered.`, state: "done" },
      { title: "Manager review", desc: "Hà Vy will verify your answers and resolve any gaps.", state: "active" },
      { title: "Committed to Knowledge Graph", desc: "Your knowledge becomes a permanent part of the team’s memory.", state: "upcoming" },
    ];
    return <div className="max-w-lg mx-auto">
      <div className="relative overflow-hidden rounded-xl border border-emerald-200 p-7 text-center mb-5" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)" }}>
        <ConnectedNodes />
        <h2 className="text-xl font-semibold text-gray-900 mb-1 relative">{"Thank you, Minh Lê"}</h2>
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
  return <div className="space-y-4"><div className="rounded-md bg-emerald-50 border border-emerald-200 p-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0"/><div><p className="text-[12px] font-medium text-emerald-800">Committed to Knowledge Graph</p><p className="text-[10px] text-emerald-600" style={{fontFamily:"ui-monospace,Menlo,monospace"}}>{"Jun 14, 2026 at 3:42 PM · 487 entries"}</p></div></div><div className="rounded-lg border border-gray-200 bg-white p-5"><div className="grid grid-cols-4 gap-3"><MC l="Committed" v={S.answered}/><MC l="Files" v={S.files}/><MC l="Gaps resolved" v={S.gapsAddressed}/><MC l="Excluded" v={S.questions-S.answered}/></div><p className="text-[11px] text-gray-500 mt-3">{"Minh L\u00ea\u2019s knowledge is now available to the team in the Knowledge Graph."}</p><div className="flex gap-3 mt-3"><Link href={`/knowledge-graph?prompt=${S.id}`} className="h-8 px-3 rounded-md border border-violet-300 text-violet-700 text-xs font-medium inline-flex items-center gap-1.5 hover:bg-violet-50"><Sparkles className="w-3 h-3"/>Explore in Knowledge Graph</Link><Link href="/" className="h-8 px-3 rounded-md border border-gray-300 text-gray-700 text-xs font-medium inline-flex items-center gap-1.5 hover:bg-gray-50">Back to dashboard</Link></div></div></div>;
}

function CommitModal({ S, entries = 42, sensitive = 3, unresolved = 0, onClose }) {
  return <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={onClose}><div className="bg-white rounded-xl shadow-xl p-6 w-[400px] border border-gray-200" onClick={e=>e.stopPropagation()}><h3 className="text-base font-semibold mb-1">{"Commit "}{entries}{" entries to the Knowledge Graph?"}</h3><p className="text-[11px] text-gray-400 mb-3">This action cannot be undone.</p><div className="text-[12px] space-y-0.5 mb-3 text-gray-700"><p>{"· "}{entries}{" entries across "}{S.modules}{" modules"}</p><p>{"· "}{S.answered}{" questions answered"}</p></div><div className="text-[11px] text-blue-800 bg-blue-50 border border-blue-200 rounded-md px-3 py-2 mb-2 flex items-start gap-1.5"><Shield className="w-3.5 h-3.5 shrink-0 mt-0.5"/><span>{sensitive}{" entries contain sensitive content and will be sanitized before commit."}</span></div>{unresolved>0&&<div className="text-[11px] text-yellow-800 bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2 mb-2 flex items-start gap-1.5"><Info className="w-3.5 h-3.5 shrink-0 mt-0.5"/><span>{unresolved}{" unresolved "}{unresolved===1?"gap":"gaps"}{" will be preserved for future resolution."}</span></div>}<div className="flex gap-2 justify-end mt-4"><button onClick={onClose} className="h-8 px-3 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button><button className="h-8 px-3 rounded-md bg-violet-600 text-white text-sm font-medium inline-flex items-center gap-1.5 hover:bg-violet-700"><Database className="w-3.5 h-3.5"/>Commit</button></div></div></div>;
}

function BackModal({ onClose }) {
  return <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={onClose}><div className="bg-white rounded-xl shadow-xl p-6 w-[380px] border border-gray-200" onClick={e=>e.stopPropagation()}><h3 className="text-base font-semibold mb-3">Reopen Capture?</h3><p className="text-[12px] text-gray-500 mb-2">{"This will reopen the session for Minh L\u00ea. He\u2019ll be notified that more input is needed."}</p><p className="text-[10px] text-gray-400 mb-4">You can move back to Deliver again when ready.</p><div className="flex gap-2 justify-end"><button onClick={onClose} className="h-8 px-3 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button><button className="h-8 px-3 rounded-md bg-rose-50 border border-rose-300 text-rose-700 text-sm font-medium inline-flex items-center gap-1.5 hover:bg-rose-100"><ArrowLeftRight className="w-3.5 h-3.5"/>Reopen Capture</button></div></div></div>;
}
