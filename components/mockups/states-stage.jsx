"use client";
import React, { useState } from "react";
import { ROLES, STEPS, TABS, FLOWS, tabVisibility, sessionUrl } from "@/lib/view-matrix";

const GROUPS = [
  { id: "workspace", label: "Workspace" },
  { id: "session", label: "Session lifecycle" },
  { id: "spec", label: "Spec traces" },
];

export default function StatesStage() {
  const [flowId, setFlowId] = useState("session");
  const [role, setRole] = useState("manager");
  const [step, setStep] = useState("capture");
  const [tab, setTab] = useState("data");
  const [stateId, setStateId] = useState("default");

  const flow = FLOWS.find((f) => f.id === flowId) || FLOWS[0];
  const isSession = flow.matrix === "session";

  let src;
  if (isSession) {
    src = sessionUrl(role, step, tab);
  } else {
    const st = (flow.states || []).find((s) => s.id === stateId) || (flow.states || [])[0];
    src = flow.route + ((st && st.query) || "");
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-100" style={{ fontFamily: 'ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif' }}>
      <div className="flex items-center gap-3 px-4 h-12 bg-gray-900 border-b border-gray-700 shrink-0">
        <span className="text-[10px] tracking-[0.16em] font-semibold text-gray-400" style={{ fontFamily: "ui-monospace,Menlo,monospace" }}>PREVIEW STAGE</span>
        <span className="text-gray-600">·</span>
        <span className="text-[12px] text-gray-300 truncate">{flow.label}</span>
        <div className="flex-1" />
        {isSession ? (
          <div className="flex items-center gap-2">
            <select value={role} onChange={(e) => setRole(e.target.value)} className="h-7 px-2 rounded-md bg-gray-800 border border-gray-700 text-[12px] text-gray-100 focus:outline-none">
              {ROLES.map((r) => <option key={r.id} value={r.id}>{r.label} · {r.sub}</option>)}
            </select>
            <div className="flex items-center gap-1">
              {STEPS.map((s, i) => (
                <button key={s.id} title={s.label} onClick={() => setStep(s.id)} className={`w-7 h-7 rounded-md text-[11px] border ${step === s.id ? "bg-gray-100 text-gray-900 border-gray-100" : "bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-500"}`} style={{ fontFamily: "ui-monospace,Menlo,monospace" }}>{i + 1}</button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {TABS.map((t) => {
                const v = tabVisibility(role, step, t.id);
                const on = tab === t.id && v === "visible";
                return <button key={t.id} disabled={v !== "visible"} onClick={() => setTab(t.id)} title={v !== "visible" ? `${t.label} (${v})` : t.label} className={`h-7 px-2 rounded-md text-[11px] border ${on ? "bg-violet-600 text-white border-violet-600" : v !== "visible" ? "bg-gray-800 text-gray-600 border-gray-800 cursor-not-allowed" : "bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-500"}`}>{t.label}</button>;
              })}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            {(flow.states || []).map((s) => (
              <button key={s.id} onClick={() => setStateId(s.id)} className={`h-7 px-2.5 rounded-md text-[11px] border ${stateId === s.id ? "bg-violet-600 text-white border-violet-600" : "bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-500"}`}>{s.label}</button>
            ))}
          </div>
        )}
        <a href={src} target="_blank" rel="noreferrer" className="h-7 px-2.5 rounded-md text-[11px] bg-gray-800 border border-gray-700 text-gray-300 hover:border-gray-500 inline-flex items-center">Open ↗</a>
      </div>

      <div className="flex-1 flex min-h-0">
        <aside className="w-64 shrink-0 bg-gray-900 border-r border-gray-700 overflow-y-auto p-3">
          {GROUPS.map((g) => {
            const flows = FLOWS.filter((f) => f.group === g.id);
            if (!flows.length) return null;
            return (
              <div key={g.id} className="mb-4">
                <p className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold px-1 mb-1.5" style={{ fontFamily: "ui-monospace,Menlo,monospace" }}>{g.label}</p>
                {flows.map((f) => (
                  <button key={f.id} onClick={() => { setFlowId(f.id); setStateId(((f.states || [{ id: "default" }])[0] || {}).id || "default"); }} className={`w-full text-left px-2 py-1.5 rounded-md text-[12px] mb-0.5 ${flowId === f.id ? "bg-violet-600/20 text-violet-200 border border-violet-700" : "text-gray-300 hover:bg-gray-800 border border-transparent"}`}>
                    {f.label}
                    {f.matrix === "session" && <span className="block text-[9px] text-gray-500 mt-0.5">{ROLES.length}×{STEPS.length}×{TABS.length} states</span>}
                    {f.states && <span className="block text-[9px] text-gray-500 mt-0.5">{f.states.length} state{f.states.length > 1 ? "s" : ""}</span>}
                  </button>
                ))}
              </div>
            );
          })}
          {isSession && <SessionGrid role={role} step={step} onPick={(r, s) => { setRole(r); setStep(s); }} />}
        </aside>

        <main className="flex-1 min-w-0 bg-gray-800 p-4 overflow-auto">
          <div className="mx-auto max-w-[1100px] bg-white rounded-lg overflow-hidden border border-gray-700 shadow-xl" style={{ height: "calc(100vh - 110px)" }}>
            <iframe key={src} src={src} title={flow.label} className="w-full h-full border-0" />
          </div>
          <p className="text-[10px] text-gray-500 mt-2 text-center" style={{ fontFamily: "ui-monospace,Menlo,monospace" }}>{src}</p>
        </main>
      </div>
    </div>
  );
}

function SessionGrid({ role, step, onPick }) {
  return (
    <div className="mt-2 border-t border-gray-700 pt-3">
      <p className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold px-1 mb-2" style={{ fontFamily: "ui-monospace,Menlo,monospace" }}>Session matrix</p>
      <div className="grid gap-1" style={{ gridTemplateColumns: `46px repeat(${STEPS.length},1fr)` }}>
        <span />
        {STEPS.map((s, i) => <span key={s.id} className="text-[8px] text-gray-500 text-center" title={s.label}>{i + 1}</span>)}
        {ROLES.map((r) => [
          <span key={r.id + "l"} className="text-[9px] text-gray-400 truncate">{r.label}</span>,
          ...STEPS.map((s) => {
            const sel = role === r.id && step === s.id;
            return <button key={r.id + s.id} title={`${r.label} · ${s.label}`} onClick={() => onPick(r.id, s.id)} className={`h-5 rounded-sm ${sel ? "bg-violet-500" : "bg-gray-700 hover:bg-gray-600"}`} />;
          }),
        ])}
      </div>
    </div>
  );
}
