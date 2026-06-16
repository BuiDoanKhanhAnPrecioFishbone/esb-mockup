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
  const [mode, setMode] = useState("single");

  const flow = FLOWS.find((f) => f.id === flowId) || FLOWS[0];
  const isSession = flow.matrix === "session";

  let src;
  if (isSession) {
    src = sessionUrl(role, step, tab);
  } else {
    const st = (flow.states || []).find((s) => s.id === stateId) || (flow.states || [])[0];
    src = flow.route + ((st && st.query) || "");
  }

  function openState(r, s, t) { setFlowId("session"); setRole(r); setStep(s); if (t) setTab(t); setMode("single"); }
  function openFlow(fl, sid) { setFlowId(fl.id); setStateId(sid || ((fl.states || [{ id: "default" }])[0] || {}).id || "default"); setMode("single"); }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-100" style={{ fontFamily: 'ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif' }}>
      <div className="flex items-center gap-3 px-4 h-12 bg-gray-900 border-b border-gray-700 shrink-0">
        <span className="text-[10px] tracking-[0.16em] font-semibold text-gray-400" style={{ fontFamily: "ui-monospace,Menlo,monospace" }}>PREVIEW STAGE</span>
        <span className="text-gray-600">·</span>
        <span className="text-[12px] text-gray-300 truncate">{mode === "matrix" ? "All states" : flow.label}</span>
        <div className="flex-1" />
        {isSession && (
          <div className="flex items-center gap-1">
            {mode === "single" && (
              <>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="h-7 px-2 rounded-md bg-gray-800 border border-gray-700 text-[12px] text-gray-100 focus:outline-none">
                  {ROLES.map((r) => <option key={r.id} value={r.id}>{r.label} · {r.sub}</option>)}
                </select>
                <div className="flex items-center gap-1">
                  {STEPS.map((s, i) => <button key={s.id} title={s.label} onClick={() => setStep(s.id)} className={`w-7 h-7 rounded-md text-[11px] border ${step === s.id ? "bg-gray-100 text-gray-900 border-gray-100" : "bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-500"}`} style={{ fontFamily: "ui-monospace,Menlo,monospace" }}>{i + 1}</button>)}
                </div>
              </>
            )}
            <div className="flex items-center gap-1">
              {TABS.map((t) => { const v = tabVisibility(role, step, t.id); const on = tab === t.id; return <button key={t.id} disabled={mode === "single" && v !== "visible"} onClick={() => setTab(t.id)} title={v !== "visible" ? `${t.label} (${v})` : t.label} className={`h-7 px-2 rounded-md text-[11px] border ${on ? "bg-violet-600 text-white border-violet-600" : mode === "single" && v !== "visible" ? "bg-gray-800 text-gray-600 border-gray-800 cursor-not-allowed" : "bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-500"}`}>{t.label}</button>; })}
            </div>
          </div>
        )}
        {!isSession && mode === "single" && (
          <div className="flex items-center gap-1">
            {(flow.states || []).map((s) => <button key={s.id} onClick={() => setStateId(s.id)} className={`h-7 px-2.5 rounded-md text-[11px] border ${stateId === s.id ? "bg-violet-600 text-white border-violet-600" : "bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-500"}`}>{s.label}</button>)}
          </div>
        )}
        <div className="flex items-center rounded-md border border-gray-700 overflow-hidden ml-1">
          <button onClick={() => setMode("single")} className={`h-7 px-2.5 text-[11px] ${mode === "single" ? "bg-gray-100 text-gray-900" : "bg-gray-800 text-gray-300"}`}>Single</button>
          <button onClick={() => setMode("matrix")} className={`h-7 px-2.5 text-[11px] ${mode === "matrix" ? "bg-gray-100 text-gray-900" : "bg-gray-800 text-gray-300"}`}>Matrix</button>
        </div>
        {mode === "single" && <a href={src} target="_blank" rel="noreferrer" className="h-7 px-2.5 rounded-md text-[11px] bg-gray-800 border border-gray-700 text-gray-300 hover:border-gray-500 inline-flex items-center">Open ↗</a>}
      </div>

      <div className="flex-1 flex min-h-0">
        <aside className="w-60 shrink-0 bg-gray-900 border-r border-gray-700 overflow-y-auto p-3">
          {GROUPS.map((g) => {
            const flows = FLOWS.filter((f) => f.group === g.id);
            if (!flows.length) return null;
            return (
              <div key={g.id} className="mb-4">
                <p className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold px-1 mb-1.5" style={{ fontFamily: "ui-monospace,Menlo,monospace" }}>{g.label}</p>
                {flows.map((f) => (
                  <button key={f.id} onClick={() => openFlow(f)} className={`w-full text-left px-2 py-1.5 rounded-md text-[12px] mb-0.5 ${mode === "single" && flowId === f.id ? "bg-violet-600/20 text-violet-200 border border-violet-700" : "text-gray-300 hover:bg-gray-800 border border-transparent"}`}>
                    {f.label}
                    {f.matrix === "session" && <span className="block text-[9px] text-gray-500 mt-0.5">{ROLES.length}×{STEPS.length}×{TABS.length} states</span>}
                    {f.states && <span className="block text-[9px] text-gray-500 mt-0.5">{f.states.length} state{f.states.length > 1 ? "s" : ""}</span>}
                  </button>
                ))}
              </div>
            );
          })}
        </aside>

        <main className="flex-1 min-w-0 bg-gray-800 overflow-auto">
          {mode === "single" ? (
            <div className="p-4">
              <div className="mx-auto max-w-[1100px] bg-white rounded-lg overflow-hidden border border-gray-700 shadow-xl" style={{ height: "calc(100vh - 110px)" }}>
                <iframe key={src} src={src} title={flow.label} className="w-full h-full border-0" />
              </div>
              <p className="text-[10px] text-gray-500 mt-2 text-center" style={{ fontFamily: "ui-monospace,Menlo,monospace" }}>{src}</p>
            </div>
          ) : (
            <MatrixView tab={tab} onOpenState={openState} onOpenFlow={openFlow} />
          )}
        </main>
      </div>
    </div>
  );
}

function Thumb({ src, w, h }) {
  const vw = 1280, vh = 800;
  const scale = Math.min(w / vw, h / vh);
  return (
    <div className="relative bg-white rounded-md overflow-hidden border border-gray-700" style={{ width: w, height: h }}>
      <iframe src={src} title={src} loading="lazy" tabIndex={-1} scrolling="no" className="absolute top-0 left-0 origin-top-left border-0 pointer-events-none" style={{ width: vw, height: vh, transform: `scale(${scale})` }} />
    </div>
  );
}

function MatrixView({ tab, onOpenState, onOpenFlow }) {
  const W = 232, H = 146;
  return (
    <div className="p-5 space-y-8">
      <div>
        <div className="flex items-baseline gap-2 mb-3"><h2 className="text-[13px] font-medium text-gray-100">Session command view</h2><span className="text-[10px] text-gray-500">role × step · tab: {tab}</span></div>
        <div className="overflow-x-auto"><div className="inline-grid gap-2" style={{ gridTemplateColumns: `64px repeat(${STEPS.length}, ${W}px)` }}>
          <span />
          {STEPS.map((s, i) => <div key={s.id} className="text-[10px] text-gray-400 px-1 self-end pb-1">{i + 1}. {s.label}</div>)}
          {ROLES.map((r) => [
            <div key={r.id + "l"} className="text-[11px] text-gray-300 flex items-center">{r.label}</div>,
            ...STEPS.map((s) => {
              const v = tabVisibility(r.id, s.id, tab);
              const cellTab = v === "visible" ? tab : "overview";
              return (
                <button key={r.id + s.id} onClick={() => onOpenState(r.id, s.id, cellTab)} className="group text-left" title={`${r.label} · ${s.label}`}>
                  <div className="relative">
                    <Thumb src={sessionUrl(r.id, s.id, cellTab)} w={W} h={H} />
                    {v !== "visible" && <div className="absolute top-1 right-1 text-[8px] px-1 py-0.5 rounded bg-gray-900/80 text-gray-300 border border-gray-600">tab {v}</div>}
                    <div className="absolute inset-0 rounded-md group-hover:ring-2 group-hover:ring-violet-500" />
                  </div>
                </button>
              );
            }),
          ])}
        </div></div>
      </div>
      <div>
        <h2 className="text-[13px] font-medium text-gray-100 mb-3">Other flows</h2>
        <div className="flex flex-wrap gap-3">
          {FLOWS.filter((f) => f.matrix !== "session").map((f) => {
            const st = (f.states || [{}])[0] || {};
            const src = f.route + (st.query || "");
            return (
              <button key={f.id} onClick={() => onOpenFlow(f)} className="group text-left" title={f.label}>
                <div className="relative"><Thumb src={src} w={W} h={H} /><div className="absolute inset-0 rounded-md group-hover:ring-2 group-hover:ring-violet-500" /></div>
                <div className="mt-1 text-[10px] text-gray-300 truncate" style={{ maxWidth: W }}>{f.label}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
