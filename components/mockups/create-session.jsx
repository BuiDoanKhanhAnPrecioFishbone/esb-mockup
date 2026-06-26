"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Calendar, Check, ChevronDown, Users, RefreshCw,
  Info, Mail, Building2, AlertCircle, CheckCircle2, Plus,
} from "lucide-react";

/* Create Session (CL-121 + R3 two-path flow)
   Path 1 — HRIS sync: accordion of synced departures → configure & start.
   Path 2 — Manual creation: form (email = Trello lookup key) → boards → start.
   Both paths converge at the shared BoardPicker. */

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

const DEPARTMENTS = ["Engineering", "Sales", "People & Culture", "Product", "Design", "Operations"];

function calcDeadline(daysLeft) {
  const d = new Date();
  d.setDate(d.getDate() + daysLeft - 4);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function calcDeadlineFromDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return "";
  d.setDate(d.getDate() - 4);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function CreateSession({ embedded = false, asSection = false } = {}) {
  const [synced, setSynced] = useState(false);
  const hasHris = OFFBOARDERS.length > 0;

  const content = (
    <div className="max-w-2xl mx-auto p-6">
      {!asSection && (
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Create session</h1>
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">Cancel</Link>
        </div>
      )}

      {/* Path 1 — HRIS sync */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[11px] uppercase tracking-wider font-medium text-gray-500 flex items-center gap-1.5">
            <Users className="w-3 h-3" />
            {hasHris ? "Synced from HRIS" : "No upcoming departures from HRIS"}
            {hasHris && <span className="text-gray-400" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{"· "}{OFFBOARDERS.length}</span>}
          </h2>
          <SyncButton synced={synced} onSync={() => setSynced(true)} />
        </div>

        {hasHris ? (
          <div className="space-y-3">
            {OFFBOARDERS.map(person => <DepartureCard key={person.id} person={person} />)}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center">
            <p className="text-sm text-gray-600">No upcoming departures from HRIS.</p>
            <p className="text-xs text-gray-500 mt-1">Sync again, or create a session manually below.</p>
          </div>
        )}
      </section>

      {/* Divider */}
      <div className="flex items-center gap-3 my-7">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-[11px] uppercase tracking-wider font-medium text-gray-400">or create manually</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Path 2 — Manual creation */}
      <ManualForm />
    </div>
  );

  if (embedded) return content;
  return <div className="min-h-screen bg-gray-50 text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>{content}</div>;
}

function SyncButton({ synced, onSync }) {
  const [spinning, setSpinning] = useState(false);
  const handle = () => { setSpinning(true); setTimeout(() => { setSpinning(false); onSync(); }, 700); };
  return (
    <button onClick={handle} disabled={spinning} className="h-7 px-2.5 rounded-md border border-gray-300 bg-white text-[11px] font-medium text-gray-700 hover:bg-gray-50 inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 disabled:opacity-60">
      <RefreshCw className={`w-3 h-3 ${spinning ? "animate-spin" : ""}`} />
      {spinning ? "Syncing…" : synced ? "Synced just now" : "Sync now"}
    </button>
  );
}

function DepartureCard({ person }) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className={`rounded-lg border bg-white transition-all ${isExpanded ? "border-violet-300 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}>
      <button onClick={() => setIsExpanded(v => !v)} className="w-full px-4 py-3.5 flex items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-violet-500/20 rounded-lg">
        <div className={`w-10 h-10 rounded-full text-[11px] font-semibold inline-flex items-center justify-center shrink-0 border ${isExpanded ? "bg-violet-100 text-violet-700 border-violet-200" : "bg-gray-100 text-gray-700 border-gray-200"}`}>{person.initials}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900">{person.name}</h3>
            <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{person.daysLeft}d left</span>
          </div>
          <p className="text-[12px] text-gray-500">{person.role} {"·"} {person.dept} {"·"} Last day {person.lastDay}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[11px] font-medium ${isExpanded ? "text-violet-600" : "text-gray-500"}`}>{isExpanded ? "Collapse" : "Configure & start"}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-gray-100">
          <div className="pt-4">
            <BoardPicker initialDeadline={calcDeadline(person.daysLeft)} personId={person.id} onCancel={() => setIsExpanded(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

// Shared board-selection step — used by both the HRIS accordion and the manual path.
function BoardPicker({ initialDeadline, personId = "minh-le", onCancel }) {
  const [boardSelection, setBoardSelection] = useState(() => { const m = {}; BOARDS.forEach(b => { m[b.id] = b.suggested; }); return m; });
  const [deadline, setDeadline] = useState(initialDeadline);
  const selectedCount = Object.values(boardSelection).filter(Boolean).length;

  return (
    <div className="space-y-5">
      <div>
        <label className="text-[11px] text-gray-500 uppercase tracking-wider font-medium mb-1.5 block">Review deadline</label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input type="text" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400" />
          </div>
          <span className="text-[10px] text-gray-400 shrink-0">Last day minus 4 days (editable)</span>
        </div>
      </div>

      <div>
        <label className="text-[11px] text-gray-500 uppercase tracking-wider font-medium mb-1.5 block">
          {"Data sources — Trello boards"} <span style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>({selectedCount} selected)</span>
        </label>
        <div className="space-y-2">
          {BOARDS.map(b => {
            const isOn = boardSelection[b.id];
            return (
              <button key={b.id} onClick={() => setBoardSelection(prev => ({ ...prev, [b.id]: !prev[b.id] }))} className={`w-full rounded-lg border p-3 text-left transition-all flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${isOn ? "border-violet-300 bg-violet-50/30" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                <div className={`w-5 h-5 rounded border inline-flex items-center justify-center shrink-0 transition-colors ${isOn ? "bg-violet-600 border-violet-600" : "bg-white border-gray-300"}`}>
                  {isOn && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">{b.name}</div>
                  <div className="text-[11px] text-gray-500">{b.cards} cards {"·"} last active {b.lastActive}</div>
                </div>
                {b.suggested && <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-50 text-violet-600 font-medium border border-violet-200">Suggested</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Cancel</button>
        {selectedCount > 0 ? (
          <Link href={`/session/${personId}`} className="h-10 px-5 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30 bg-violet-600 hover:bg-violet-700 text-white">
            Start session<ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <span aria-disabled="true" className="h-10 px-5 rounded-lg text-sm font-medium inline-flex items-center gap-2 bg-gray-100 text-gray-400 cursor-not-allowed select-none">
            Start session<ArrowRight className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
    </div>
  );
}

function ManualForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dept, setDept] = useState("");
  const [lastDay, setLastDay] = useState("");
  const [title, setTitle] = useState("");
  const [result, setResult] = useState(null); // null | "found" | "notfound"
  const [looking, setLooking] = useState(false);

  const canSubmit = name.trim() && email.trim() && dept && lastDay;

  const submit = () => {
    if (!canSubmit) return;
    setLooking(true);
    setResult(null);
    // Mock Trello lookup by email. Local-parts "unknown"/"notfound" simulate the no-account case.
    const local = email.split("@")[0].toLowerCase();
    const found = !(local === "unknown" || local.includes("notfound"));
    setTimeout(() => { setLooking(false); setResult(found ? "found" : "notfound"); }, 800);
  };

  const reset = () => setResult(null);

  return (
    <section>
      <h2 className="text-[11px] uppercase tracking-wider font-medium text-gray-500 mb-3 flex items-center gap-1.5">
        <Plus className="w-3 h-3" />
        Create manually
      </h2>

      <div className="rounded-lg border border-gray-200 bg-white p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Full name" required>
            <input value={name} onChange={(e) => { setName(e.target.value); reset(); }} placeholder="Phương Anh Nguyễn" className={inputCls} />
          </Field>
          <Field label="Role / Title" hint="optional">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Senior Backend Engineer" className={inputCls} />
          </Field>
        </div>

        <Field label="Email" required>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); reset(); }} placeholder="name@company.com" className={`${inputCls} pl-9`} />
          </div>
        </Field>

        {/* Info card — email is the Trello lookup key */}
        <div className="rounded-lg p-3 flex items-start gap-2.5" style={{ background: "#f5f3ff", border: "1px solid #c4b5fd" }}>
          <Info className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-violet-900 leading-relaxed">The email is used to find the employee&apos;s Trello account and discover their boards. Make sure they have a Trello account with this email.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Department" required>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <select value={dept} onChange={(e) => setDept(e.target.value)} className={`${inputCls} pl-9 appearance-none cursor-pointer ${dept ? "text-gray-900" : "text-gray-400"}`}>
                <option value="" disabled>Select department</option>
                {DEPARTMENTS.map(d => <option key={d} value={d} className="text-gray-900">{d}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
          </Field>
          <Field label="Last day" required hint="sets review deadline">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <input type="date" value={lastDay} onChange={(e) => setLastDay(e.target.value)} className={`${inputCls} pl-9 ${lastDay ? "text-gray-900" : "text-gray-400"}`} />
            </div>
          </Field>
        </div>

        {!result && (
          <div className="flex justify-end pt-1">
            {canSubmit ? (
              <button onClick={submit} disabled={looking} className="h-10 px-5 rounded-lg text-sm font-medium inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30 disabled:opacity-70">
                {looking ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                {looking ? "Looking up Trello…" : "Find in Trello"}
              </button>
            ) : (
              <span aria-disabled="true" className="h-10 px-5 rounded-lg text-sm font-medium inline-flex items-center gap-2 bg-gray-100 text-gray-400 cursor-not-allowed select-none">
                <Mail className="w-3.5 h-3.5" />Find in Trello
              </span>
            )}
          </div>
        )}
      </div>

      {/* Lookup result */}
      {result === "notfound" && (
        <div className="rounded-lg border border-rose-200 bg-rose-50/50 p-4 mt-3 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-[13px] font-medium text-gray-900">No Trello account found for this email.</p>
            <p className="text-[11px] text-gray-600 mt-0.5">Check the address or ask the employee to confirm. You can also start a manual Q&amp;A session without boards.</p>
            <button onClick={reset} className="text-[11px] text-violet-600 hover:text-violet-700 font-medium mt-2 inline-flex items-center gap-1">Try a different email</button>
          </div>
        </div>
      )}

      {result === "found" && (
        <div className="rounded-lg border border-violet-300 bg-white shadow-sm p-4 mt-3">
          <div className="flex items-center gap-3 pb-3 mb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 text-[11px] font-semibold inline-flex items-center justify-center shrink-0 border border-violet-200">
              {name.trim().split(/\s+/).map(w => w[0]).slice(-2).join("").toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">{name}</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5" />Found in Trello</span>
              </div>
              <p className="text-[12px] text-gray-500">{[title.trim(), dept].filter(Boolean).join(" · ")}{" · "}{email}</p>
            </div>
          </div>
          <BoardPicker initialDeadline={calcDeadlineFromDate(lastDay)} personId="minh-le" onCancel={reset} />
        </div>
      )}
    </section>
  );
}

const inputCls = "w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400";

function Field({ label, required, hint, children }) {
  return (
    <div>
      <label className="text-[11px] text-gray-500 uppercase tracking-wider font-medium mb-1.5 flex items-center gap-1.5">
        {label}
        {required && <span className="text-rose-400 normal-case tracking-normal">*</span>}
        {hint && <span className="text-gray-400 normal-case tracking-normal font-normal">{"· "}{hint}</span>}
      </label>
      {children}
    </div>
  );
}
