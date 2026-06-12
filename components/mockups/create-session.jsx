"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Check, ChevronDown, Users } from "lucide-react";

/* Create Session (CL-121 + grill refinements)
   Accordion of HRIS departures. Expand to configure + start.
   No dropdown. No board disabling. Max 3 boards selectable. */

const OFFBOARDERS = [
  { id: "minh-le", name: "Minh L\u00ea", role: "Senior Backend Engineer", dept: "Engineering", lastDay: "July 4, 2026", daysLeft: 30, initials: "ML" },
  { id: "thanh-tung", name: "Thanh T\u00f9ng", role: "QA Lead", dept: "Engineering", lastDay: "July 8, 2026", daysLeft: 26, initials: "TT" },
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
  const [expandedId, setExpandedId] = useState(null);

  const content = (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Create session</h1>
        <Link href="/" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">Cancel</Link>
      </div>

      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-3 flex items-center gap-1.5">
        <Users className="w-3 h-3" />
        Upcoming departures from HRIS \u00b7 {OFFBOARDERS.length}
      </p>

      <div className="space-y-3">
        {OFFBOARDERS.map(person => (
          <DepartureCard
            key={person.id}
            person={person}
            isExpanded={expandedId === person.id}
            onToggle={() => setExpandedId(expandedId === person.id ? null : person.id)}
          />
        ))}
      </div>
    </div>
  );

  if (embedded) return content;
  return <div className="min-h-screen bg-gray-50 text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>{content}</div>;
}

function DepartureCard({ person, isExpanded, onToggle }) {
  const [boardSelection, setBoardSelection] = useState(() => {
    const m = {}; BOARDS.forEach(b => { m[b.id] = b.suggested; }); return m;
  });
  const [deadline, setDeadline] = useState(() => calcDeadline(person.daysLeft));
  const selectedCount = Object.values(boardSelection).filter(Boolean).length;

  const handleBoardToggle = (boardId) => {
    setBoardSelection(prev => {
      const isOn = prev[boardId];
      if (isOn) return { ...prev, [boardId]: false };
      const count = Object.values(prev).filter(Boolean).length;
      if (count >= 3) return prev;
      return { ...prev, [boardId]: true };
    });
  };

  return (
    <div className={`rounded-lg border bg-white transition-all ${
      isExpanded ? "border-violet-300 shadow-sm" : "border-gray-200 hover:border-gray-300"
    }`}>
      {/* Header (always visible) */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3.5 flex items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-violet-500/20 rounded-lg"
      >
        <div className={`w-10 h-10 rounded-full text-[11px] font-semibold inline-flex items-center justify-center shrink-0 border ${
          isExpanded ? "bg-violet-100 text-violet-700 border-violet-200" : "bg-gray-100 text-gray-700 border-gray-200"
        }`}>{person.initials}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900">{person.name}</h3>
            <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{person.daysLeft}d left</span>
          </div>
          <p className="text-[12px] text-gray-500">{person.role} \u00b7 {person.dept} \u00b7 Last day {person.lastDay}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[11px] font-medium ${
            isExpanded ? "text-violet-600" : "text-gray-500"
          }`}>{isExpanded ? "Collapse" : "Configure & start"}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-gray-100 mt-0">
          <div className="pt-4 space-y-5">
            {/* Review deadline */}
            <div>
              <label className="text-[11px] text-gray-500 uppercase tracking-wider font-medium mb-1.5 block">Review deadline</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400"
                  />
                </div>
                <span className="text-[10px] text-gray-400 shrink-0">Last day minus 4 days (editable)</span>
              </div>
            </div>

            {/* Board picker */}
            <div>
              <label className="text-[11px] text-gray-500 uppercase tracking-wider font-medium mb-1.5 block">
                Data sources \u2014 Trello boards <span style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>({selectedCount} of 3 selected)</span>
              </label>
              <div className="space-y-2">
                {BOARDS.map(b => {
                  const isOn = boardSelection[b.id];
                  const atMax = selectedCount >= 3 && !isOn;
                  return (
                    <button
                      key={b.id}
                      onClick={() => handleBoardToggle(b.id)}
                      className={`w-full rounded-lg border p-3 text-left transition-all flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${
                        isOn
                          ? "border-violet-300 bg-violet-50/30"
                          : atMax
                            ? "border-gray-200 bg-white opacity-50 cursor-not-allowed"
                            : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border inline-flex items-center justify-center shrink-0 transition-colors ${
                        isOn ? "bg-violet-600 border-violet-600" : "bg-white border-gray-300"
                      }`}>
                        {isOn && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">{b.name}</div>
                        <div className="text-[11px] text-gray-500">{b.cards} cards \u00b7 last active {b.lastActive}</div>
                      </div>
                      {b.suggested && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-50 text-violet-600 font-medium border border-violet-200">Suggested</span>
                      )}
                    </button>
                  );
                })}
              </div>
              {atMaxMessage(selectedCount)}
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button onClick={() => {}} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Cancel</button>
              <Link
                href={`/session/${person.id}`}
                className={`h-10 px-5 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30 ${
                  selectedCount > 0
                    ? "bg-violet-600 hover:bg-violet-700 text-white"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Start session<ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function atMaxMessage(count) {
  if (count >= 3) {
    return <p className="text-[10px] text-yellow-700 mt-1.5">Maximum 3 boards selected. Deselect one to choose a different board.</p>;
  }
  return null;
}
