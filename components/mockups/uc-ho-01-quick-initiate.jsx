"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Check,
  Calendar, Trello, User, Sparkles, ArrowRight,
  Settings, Clock, ShieldCheck
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   UC-HO-01 · Quick Initiate — streamlined session creation

   CL-107 · labels + values only; explainer prose removed (no
   destructive action on this surface, so no helper text retained).
   CL-105 · every field shown, selectable, pre-filled to happy-path.
   CL-091 · Trello 4-layer source. CL-099 · async question queue.
   ═══════════════════════════════════════════════════════════════════ */

const FLOW = [
  { id: "ready",     label: "Ready to start",            trigger: "Defaults from HR sync · all fields pre-filled." },
  { id: "customize", label: "Customize before starting", trigger: "Every field is shown and adjustable." },
];

const SCENARIO = {
  manager: "Hà Vy",
  managerDept: "Engineering",
  offboarder: "Minh Lê",
  role: "Senior Backend Engineer",
  dept: "Engineering",
  initials: "ML",
  lastDay: "June 4, 2026",
  daysLeft: 12,
  defaultDeadline: "June 8, 2026 · 17:00",
  successor: "Trần Hữu Nam",
  successorOptions: ["Trần Hữu Nam", "Duy Nguyễn", "Assign later"],
  sources: [
    { icon: Trello, name: "Trello", detail: "In Progress / Review / Done · 4-layer hard-filter", selected: true },
  ],
  seedingEstimate: "About 7 minutes",
};

export default function UCHO01QuickInitiate({ embedded = false, view = "ready" } = {}) {
  const [stepIdx, setStepIdx] = useState(() => {
    const i = FLOW.findIndex((s) => s.id === view);
    return i >= 0 ? i : 0;
  });
  const step = FLOW[stepIdx];

  if (embedded) {
    return <QuickInitiateScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      <TopBar step={step} stepIdx={stepIdx} onJump={setStepIdx} />
      <main className="flex-1">
        <QuickInitiateScreen />
      </main>
      <FooterNav stepIdx={stepIdx} step={step} onChange={setStepIdx} />
    </div>
  );
}

/* ─── Chrome ────────────────────────────────────────────────── */

function TopBar({ step, stepIdx, onJump }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="px-5 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0 shrink-0">
          <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
          <span className="text-gray-900 font-semibold tracking-[0.18em] text-xs" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>ART-EEP</span>
          <span className="text-gray-300 text-xs">·</span>
          <button className="text-xs text-gray-500 hover:text-gray-900 inline-flex items-center gap-1">
            <ChevronLeft className="w-3 h-3" />
            Dashboard
          </button>
          <span className="text-gray-300 text-xs">/</span>
          <span className="text-xs text-gray-900 font-medium">Initiate {SCENARIO.offboarder}'s handover</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {FLOW.map((s, i) => (
            <button
              key={s.id}
              onClick={() => onJump(i)}
              title={s.label}
              className={`h-7 px-2 rounded-md border text-[10px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${
                i === stepIdx ? "bg-violet-600 text-white border-violet-600" : "bg-white text-violet-700 border-violet-200 hover:border-violet-400"
              }`}
              style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

function FooterNav({ stepIdx, step, onChange }) {
  const atFirst = stepIdx === 0;
  const atLast = stepIdx === FLOW.length - 1;
  return (
    <footer className="bg-white border-t border-gray-200 px-5 py-2.5 flex items-center justify-between sticky bottom-0 z-20">
      <button
        onClick={() => !atFirst && onChange(stepIdx - 1)}
        disabled={atFirst}
        className={`h-8 px-3 rounded-md text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${
          atFirst ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        Previous
      </button>
      <div className="hidden sm:block text-[11px] text-gray-500 max-w-md text-center truncate px-3">
        {step.trigger}
      </div>
      <button
        onClick={() => !atLast && onChange(stepIdx + 1)}
        disabled={atLast}
        className={`h-8 px-3 rounded-md text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30 ${
          atLast ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-700 text-white"
        }`}
      >
        Next
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Quick-initiate screen · Customize open by default, all fields shown
   ═══════════════════════════════════════════════════════════════════ */

function QuickInitiateScreen() {
  const [open, setOpen] = useState(true);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <span className="text-[10px] uppercase tracking-[0.2em] text-violet-700 font-semibold">From HR sync · {SCENARIO.daysLeft} days notice</span>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight mt-1">
          Start {SCENARIO.offboarder}'s handover session
        </h1>
      </div>

      {/* Identity card */}
      <article className="rounded-lg border border-gray-200 bg-white p-5 mb-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 text-gray-700 text-sm font-semibold inline-flex items-center justify-center shrink-0">
            {SCENARIO.initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-gray-900">{SCENARIO.offboarder}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{SCENARIO.role} · {SCENARIO.dept}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-[10px] uppercase tracking-wider font-medium text-gray-500 inline-flex items-center gap-1">
                <Calendar className="w-2.5 h-2.5" />
                Last day · <span className="text-gray-900" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{SCENARIO.lastDay}</span>
              </span>
              <span className="text-gray-300">·</span>
              <span className="text-[10px] uppercase tracking-wider font-medium text-gray-500 inline-flex items-center gap-1">
                <User className="w-2.5 h-2.5" />
                Successor · <span className="text-gray-900">{SCENARIO.successor}</span>
              </span>
            </div>
          </div>
        </div>
      </article>

      {/* Pre-configured defaults grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <DefaultTile icon={Calendar}    label="Review deadline"   value={SCENARIO.defaultDeadline} />
        <DefaultTile icon={ShieldCheck} label="Data source"       value="Trello · filtered" />
        <DefaultTile icon={Clock}       label="Estimated seeding" value={SCENARIO.seedingEstimate} />
      </div>

      {/* Customize — open by default · all fields visible & adjustable */}
      <article className={`rounded-lg border ${open ? "border-violet-200 bg-violet-50/20" : "border-gray-200 bg-white"} mb-5 transition-colors`}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-full px-4 py-3 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-violet-500/20 rounded-lg"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Settings className="w-3.5 h-3.5 text-gray-500 shrink-0" strokeWidth={1.75} />
            <span className="text-sm font-medium text-gray-900">Customize</span>
          </div>
          {open ? <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />}
        </button>

        {open && <CustomizeBody />}
      </article>

      {/* Primary action row */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <Link
          href="/"
          className="h-8 px-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 text-xs font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        >
          Cancel
        </Link>
        <Link
          href="/session/minh-le"
          className="h-10 px-4 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30 shadow-sm shadow-violet-600/20"
        >
          <Sparkles className="w-4 h-4" strokeWidth={2} />
          Start session
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

function DefaultTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3 h-3 text-gray-500" strokeWidth={1.75} />
        <span className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium">{label}</span>
      </div>
      <div className="text-sm font-medium text-gray-900 leading-tight" style={{ fontFamily: value.includes(":") || value.includes("Jun") ? "ui-monospace, Menlo, monospace" : undefined }}>{value}</div>
    </div>
  );
}

function CustomizeBody() {
  const [sources, setSources] = useState(SCENARIO.sources.map((s) => ({ ...s })));
  const [successor, setSuccessor] = useState(SCENARIO.successor);

  const toggle = (name) =>
    setSources((prev) => prev.map((s) => (s.name === name ? { ...s, selected: !s.selected } : s)));

  return (
    <div className="px-4 pb-4 pt-2 border-t border-violet-100 space-y-4">
      {/* Review deadline */}
      <div>
        <label className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium block mb-1.5">Review deadline</label>
        <div className="rounded-md border border-gray-200 bg-white p-2.5 flex items-center gap-2 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-500/15 transition-colors">
          <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" strokeWidth={1.75} />
          <input
            defaultValue={SCENARIO.defaultDeadline}
            className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
            style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
          />
          <span className="text-[10px] text-gray-500 shrink-0">Max · {SCENARIO.lastDay}</span>
        </div>
      </div>

      {/* Data source (interactive toggle) */}
      <div>
        <label className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium block mb-1.5">Data source</label>
        <div className="space-y-1.5">
          {sources.map((s) => (
            <button
              type="button"
              key={s.name}
              onClick={() => toggle(s.name)}
              className="w-full flex items-start gap-2.5 rounded-md border border-gray-200 bg-white px-2.5 py-2 text-left hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/15"
            >
              <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${s.selected ? "bg-violet-600 border-violet-600" : "bg-white border-gray-300"}`}>
                {s.selected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
              </span>
              <s.icon className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-900 font-medium">{s.name}</div>
                <div className="text-[11px] text-gray-500 leading-relaxed">{s.detail}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Focus note */}
      <div>
        <label className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium block mb-1.5">Focus note · optional</label>
        <textarea
          placeholder="Add a focus area — for example, 'Probe deeply on the renewal negotiation with Vendor XYZ.'"
          defaultValue="Probe deeply on the Payment Gateway timeout — recurring incident, no runbook. Also the Vendor XYZ renewal SLA terms."
          className="w-full min-h-[60px] px-2.5 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/15 transition-colors resize-none"
          style={{ fontFamily: "inherit" }}
        />
      </div>

      {/* Successor (selectable) */}
      <div>
        <label className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium block mb-1.5">Successor</label>
        <div className="rounded-md border border-gray-200 bg-white p-2.5 flex items-center gap-2 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-500/15 transition-colors">
          <User className="w-3.5 h-3.5 text-gray-400 shrink-0" strokeWidth={1.75} />
          <select
            value={successor}
            onChange={(e) => setSuccessor(e.target.value)}
            className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
          >
            {SCENARIO.successorOptions.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
