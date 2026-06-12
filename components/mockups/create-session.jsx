"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, ChevronDown, Check, Database, X } from "lucide-react";

/* Create Session flow (CL-121) — single screen with offboarder picker */

const OFFBOARDERS = [
  { id: "minh-le", name: "Minh Lê", role: "Senior Backend Engineer", dept: "Engineering", lastDay: "July 4, 2026", daysLeft: 30, initials: "ML" },
  { id: "thanh-tung", name: "Thanh Tùng", role: "QA Lead", dept: "Engineering", lastDay: "July 8, 2026", daysLeft: 26, initials: "TT" },
];

const BOARDS = [
  { id: "b1", name: "Backend Services", cards: 89, lastActive: "2 days ago", suggested: true },
  { id: "b2", name: "Platform Infrastructure", cards: 42, lastActive: "5 days ago", suggested: true },
  { id: "b3", name: "API Gateway", cards: 31, lastActive: "1 week ago", suggested: true },
  { id: "b4", name: "Test Board - QA", cards: 4, lastActive: "3 months ago", suggested: false },
  { id: "b5", name: "Onboarding Sandbox", cards: 2, lastActive: "6 months ago", suggested: false },
];

function calcDeadline(daysLeft) {
  const d = new Date();
  d.setDate(d.getDate() + daysLeft - 4);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function CreateSession({ embedded = false } = {}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [boardSelection, setBoardSelection] = useState(() => {
    const m = {}; BOARDS.forEach(b => { m[b.id] = b.suggested; }); return m;
  });
  const [deadline, setDeadline] = useState("");

  const handleSelect = (person) => {
    setSelected(person);
    setPickerOpen(false);
    setDeadline(calcDeadline(person.daysLeft));
  };

  const selectedCount = Object.values(boardSelection).filter(Boolean).length;

  const content = (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Create session</h1>
        <Link href="/" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">Cancel</Link>
      </div>

      {/* Offboarder picker */}
      <div className="mb-6">
        <label className="text-[11px] text-gray-500 uppercase tracking-wider font-medium mb-1.5 block">Who is leaving?</label>
        <div className="relative">
          <button onClick={() => setPickerOpen(!pickerOpen)} className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-left text-sm flex items-center justify-between hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-colors">
            {selected ? (
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 text-[10px] font-semibold inline-flex items-center justify-center">{selected.initials}</div>
                <span className="text-gray-900 font-medium">{selected.name}</span>
                <span className="text-gray-500 text-xs">{selected.role}</span>
              </div>
            ) : (
              <span className="text-gray-400">Select from upcoming departures...</span>
            )}
            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${pickerOpen ? "rotate-180" : ""}`} />
          </button>
          {pickerOpen && (
            <div className="absolute top-11 left-0 right-0 rounded-lg border border-gray-200 bg-white shadow-lg z-20 overflow-hidden">
              <p className="px-3 py-2 text-[10px] text-gray-500 uppercase tracking-wider font-medium border-b border-gray-100">Upcoming departures from HRIS</p>
              {OFFBOARDERS.map(p => (
                <button key={p.id} onClick={() => handleSelect(p)} className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-gray-50 text-left transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 text-gray-700 text-[10px] font-semibold inline-flex items-center justify-center shrink-0">{p.initials}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">{p.name}</div>
                    <div className="text-[11px] text-gray-500">{p.role} · {p.dept}</div>
                  </div>
                  <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>Last day {p.lastDay} · {p.daysLeft}d</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Form — appears after selection */}
      {selected && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Identity card */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-violet-100 text-violet-700 text-sm font-semibold inline-flex items-center justify-center">{selected.initials}</div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">{selected.name}</h3>
              <p className="text-[12px] text-gray-500">{selected.role} · {selected.dept}</p>
              <p className="text-[11px] text-gray-500 mt-0.5" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
                <Calendar className="w-3 h-3 inline mr-1" />Last day {selected.lastDay} · {selected.daysLeft} days
              </p>
            </div>
          </div>

          {/* Review deadline */}
          <div>
            <label className="text-[11px] text-gray-500 uppercase tracking-wider font-medium mb-1.5 block">Review deadline</label>
            <div className="flex items-center gap-2">
              <input type="text" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 flex-1 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400" />
              <span className="text-[10px] text-gray-400">Last day minus 4 days (editable)</span>
            </div>
          </div>

          {/* Board picker */}
          <div>
            <label className="text-[11px] text-gray-500 uppercase tracking-wider font-medium mb-1.5 block">Data sources — Trello boards ({selectedCount} selected, max 3)</label>
            <div className="space-y-2">
              {BOARDS.map(b => {
                const isOn = boardSelection[b.id];
                const disabled = !isOn && selectedCount >= 3;
                return (
                  <button key={b.id} onClick={() => !disabled && setBoardSelection(s => ({...s, [b.id]: !s[b.id]}))} disabled={disabled}
                    className={`w-full rounded-lg border p-3 text-left transition-all flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${
                      isOn ? "border-violet-300 bg-violet-50/30" : disabled ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed" : "border-gray-200 bg-white hover:border-gray-300"
                    }`}>
                    <div className={`w-5 h-5 rounded border inline-flex items-center justify-center shrink-0 transition-colors ${
                      isOn ? "bg-violet-600 border-violet-600" : "bg-white border-gray-300"
                    }`}>{isOn && <Check className="w-3 h-3 text-white" />}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">{b.name}</div>
                      <div className="text-[11px] text-gray-500">{b.cards} cards · last active {b.lastActive}</div>
                    </div>
                    {b.suggested && <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-50 text-violet-600 font-medium border border-violet-200">Suggested</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Cancel</Link>
            <Link href={`/session/${selected.id}`} className="h-10 px-5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium inline-flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30">
              Start session<ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  if (embedded) return content;
  return <div className="min-h-screen bg-gray-50 text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>{content}</div>;
}
