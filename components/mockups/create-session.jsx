"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight, ArrowLeft, Calendar, Check, ChevronDown, Users, RefreshCw,
  Info, Mail, Building2, AlertCircle, AlertTriangle, CheckCircle2, Plus, Link2, X,
} from "lucide-react";

/* Create Session (CL-121 + R3 two-path + R4 Trello-link-as-source)
   Path 1 — HRIS sync: accordion of synced departures → board selection.
            ?employee=<id> pre-fills a person and jumps straight to board selection (MV-R4-01).
   Path 2 — Manual creation: form where the Trello link is the REQUIRED data source (MV-R4-02).
   Email is identification only — NOT a Trello lookup key (Part E). */

const OFFBOARDERS = [
  { id: "minh-le", name: "Minh Lê", role: "Senior Backend Engineer", dept: "Engineering", email: "minh.le@company.com", lastDay: "July 4, 2026", daysLeft: 30, initials: "ML", stepZeroMapped: true },
  { id: "thanh-tung", name: "Thanh Tùng", role: "QA Lead", dept: "Engineering", email: "thanh.tung@company.com", lastDay: "July 8, 2026", daysLeft: 26, initials: "TT", stepZeroMapped: true },
  { id: "phuong-anh", name: "Phương Anh Nguyễn", role: "Account Executive", dept: "Sales", email: "phuong.anh@company.com", lastDay: "July 11, 2026", daysLeft: 33, initials: "PA", stepZeroMapped: false },
  { id: "khanh-linh", name: "Khánh Linh Trần", role: "People Partner", dept: "People & Culture", email: "khanh.linh@company.com", lastDay: "July 6, 2026", daysLeft: 28, initials: "KL", stepZeroMapped: false },
  { id: "duc-an", name: "Đức An Phạm", role: "Finance Analyst", dept: "Finance", email: "duc.an@company.com", lastDay: "July 15, 2026", daysLeft: 37, initials: "DA", stepZeroMapped: false },
];

const BOARDS = [
  { id: "b1", name: "Backend Services", cards: 89, lastActive: "2 days ago", suggested: true },
  { id: "b2", name: "Platform Infrastructure", cards: 42, lastActive: "5 days ago", suggested: true },
  { id: "b3", name: "API Gateway", cards: 31, lastActive: "1 week ago", suggested: true },
  { id: "b4", name: "Test Board - QA", cards: 4, lastActive: "3 months ago", suggested: false },
  { id: "b5", name: "Onboarding Sandbox", cards: 2, lastActive: "6 months ago", suggested: false },
];
// Boards discovered from a second Trello link ("Add another Trello link", Part E scenario 5).
const EXTRA_BOARDS = [
  { id: "x1", name: "Data Platform", cards: 23, lastActive: "1 day ago", suggested: true },
  { id: "x2", name: "Analytics Workspace", cards: 11, lastActive: "4 days ago", suggested: false },
];

const DEPARTMENTS = ["Engineering", "People & Culture", "Sales", "Finance", "Operations"];

// §3.2 — optional data sources (non-functional in the mockup). Trello is always-on + required.
const OPTIONAL_SOURCES = ["GitHub", "OneDrive", "Planner", "Jira", "Notion", "Slack"];

// §3.4 — employees who already have an active session must NOT reappear in the departure list.
const ACTIVE_SESSION_IDS = ["minh-le", "thanh-tung"];

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

// Mock Trello-link validation (§3.5) — no network, switched on simple heuristics of the typed URL:
//   contains "trello.com/w/" → workspace (M boards to pick) · contains "trello.com/b/" → single board (N cards)
//   contains "empty" → empty board (error) · contains "zero"/"nodata" → 0 cards after filter (warning)
//   anything else → invalid / couldn't reach.
function validateTrello(url) {
  const u = (url || "").trim().toLowerCase();
  if (!u) return { ok: false, kind: "empty", msg: "" };
  // Workspace link → discover all boards, Manager picks.
  if (u.includes("trello.com/w/")) {
    return { ok: true, kind: "workspace", boards: BOARDS, msg: `Workspace found · ${BOARDS.length} boards` };
  }
  // Board link.
  if (u.includes("trello.com/b/")) {
    if (u.includes("empty")) return { ok: false, kind: "emptyboard", msg: "This board has no cards — try another link." };
    if (u.includes("zero") || u.includes("nodata")) return { ok: true, kind: "zerocards", boards: [], warn: "No cards after filtering — you can still start." };
    const board = BOARDS[0];
    return { ok: true, kind: "board", boards: [board], msg: `Board found · ${board.cards} cards discovered` };
  }
  return { ok: false, kind: "invalid", msg: "Couldn't reach that board — check the URL." };
}

export default function CreateSession({ embedded = false, asSection = false } = {}) {
  const [employeeId, setEmployeeId] = useState(null);
  const [resolved, setResolved] = useState(false);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("employee");
    setEmployeeId(id);
    setResolved(true);
  }, []);
  const person = employeeId && OFFBOARDERS.find(p => p.id === employeeId);

  const inner = person
    ? <PrefilledFlow person={person} />
    : <TwoPathPage asSection={asSection} resolved={resolved} />;

  if (embedded) return inner;
  return <div className="min-h-screen bg-gray-50 text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>{inner}</div>;
}

function SyncButton({ synced, onSync }) {
  const [spinning, setSpinning] = useState(false);
  const handle = () => { setSpinning(true); setTimeout(() => { setSpinning(false); onSync && onSync(); }, 700); };
  return (
    <button onClick={handle} disabled={spinning} className="h-7 px-2.5 rounded-md border border-gray-300 bg-white text-[11px] font-medium text-gray-700 hover:bg-gray-50 inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 disabled:opacity-60">
      <RefreshCw className={`w-3 h-3 ${spinning ? "animate-spin" : ""}`} />
      {spinning ? "Syncing…" : synced ? "Synced just now" : "Sync now"}
    </button>
  );
}

// ── Path 1: HRIS list + Path 2: manual form ─────────────────────────────────
function TwoPathPage({ asSection, resolved }) {
  const [synced, setSynced] = useState(false);
  // §3.4 — hide anyone who already has an active session so they don't appear twice.
  const departures = OFFBOARDERS.filter(p => !ACTIVE_SESSION_IDS.includes(p.id));
  const hasHris = departures.length > 0;
  return (
    <div className="max-w-2xl mx-auto p-6">
      {!asSection && (
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Create session</h1>
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">Cancel</Link>
        </div>
      )}

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[11px] uppercase tracking-wider font-medium text-gray-500 flex items-center gap-1.5">
            <Users className="w-3 h-3" />
            {hasHris ? "Synced from HRIS" : "No upcoming departures from HRIS"}
            {hasHris && <span className="text-gray-400" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{"· "}{departures.length}</span>}
          </h2>
          <SyncButton synced={synced} onSync={() => setSynced(true)} />
        </div>

        {hasHris ? (
          <div className="space-y-3">
            {departures.map(person => <DepartureCard key={person.id} person={person} />)}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center">
            <p className="text-sm text-gray-600">No upcoming departures from HRIS.</p>
            <p className="text-xs text-gray-500 mt-1">Sync again, or create a session manually below.</p>
          </div>
        )}
      </section>

      <div className="flex items-center gap-3 my-7">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-[11px] uppercase tracking-wider font-medium text-gray-400">or create manually</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <ManualForm />
    </div>
  );
}

// ── MV-R4-01: pre-filled flow — skip the form, go straight to board selection ─
function PrefilledFlow({ person }) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link href="/" className="text-xs text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center gap-1 mb-5"><ArrowLeft className="w-3.5 h-3.5" />Back to dashboard</Link>
      <PersonCard person={person} note="Pre-filled from HRIS" />
      <div className="rounded-lg border border-violet-300 bg-white shadow-sm p-4 mt-3">
        <SourceAndBoards
          stepZeroMapped={person.stepZeroMapped}
          dept={person.dept}
          initialDeadline={calcDeadline(person.daysLeft)}
          personId={person.id}
          cancelHref="/"
        />
      </div>
    </div>
  );
}

function PersonCard({ person, note }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 text-[11px] font-semibold inline-flex items-center justify-center shrink-0 border border-violet-200">{person.initials}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900">{person.name}</h3>
          {note && <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-50 text-violet-600 border border-violet-200">{note}</span>}
        </div>
        <p className="text-[12px] text-gray-500">{person.role}{" · "}{person.dept}{" · "}{person.email}{" · "}Last day {person.lastDay}</p>
      </div>
    </div>
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
            <SourceAndBoards
              stepZeroMapped={person.stepZeroMapped}
              dept={person.dept}
              initialDeadline={calcDeadline(person.daysLeft)}
              personId={person.id}
              onCancel={() => setIsExpanded(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Resolves the Trello data source for an HRIS person, then shows board selection.
// Step Zero mapped (e.g. Engineering) → boards auto-discovered (Part E scenario 1).
// Not mapped (e.g. Sales) → prompt for a Trello link first (Part E scenario 2).
function SourceAndBoards({ stepZeroMapped, dept, initialDeadline, personId, onCancel, cancelHref }) {
  const [boards, setBoards] = useState(stepZeroMapped ? BOARDS : null);
  if (boards) return <BoardPicker discovered={boards} initialDeadline={initialDeadline} personId={personId} onCancel={onCancel} cancelHref={cancelHref} />;
  return (
    <div>
      <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 mb-3 flex items-start gap-2.5" style={{ borderLeft: "3px solid #eab308" }}>
        <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-yellow-800 leading-relaxed">{"We couldn’t find a Trello workspace for "}<span className="font-medium">{dept}</span>{". Paste a Trello board or workspace link to continue."}</p>
      </div>
      <TrelloLinkField onDiscover={setBoards} label="Trello link" required />
    </div>
  );
}

// A single Trello-link input with validation feedback. Calls onDiscover(boards) when valid.
function TrelloLinkField({ onDiscover, label = "Trello link", required, autoFocus }) {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const check = () => {
    setChecking(true);
    setTimeout(() => {
      const r = validateTrello(url);
      setChecking(false);
      setResult(r);
      if (r.ok) onDiscover(r.boards || []); // board / workspace / zero-cards all advance to board selection
    }, 700);
  };
  return (
    <div>
      <label className="text-[11px] text-gray-500 uppercase tracking-wider font-medium mb-1.5 flex items-center gap-1.5">{label}{required && <span className="text-rose-400 normal-case tracking-normal">*</span>}</label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input value={url} autoFocus={autoFocus} onChange={(e) => { setUrl(e.target.value); setResult(null); }} onKeyDown={(e) => e.key === "Enter" && check()} placeholder="https://trello.com/b/…" className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400" />
        </div>
        <button onClick={check} disabled={checking} className="h-10 px-4 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium inline-flex items-center gap-1.5 transition-colors disabled:opacity-70">
          {checking ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Link2 className="w-3.5 h-3.5" />}{checking ? "Checking…" : "Discover"}
        </button>
      </div>
      {result && !result.ok && (
        <p className="text-[11px] text-rose-600 mt-2 flex items-start gap-1.5"><AlertCircle className="w-3.5 h-3.5 shrink-0 mt-px" />{result.msg}</p>
      )}
      {result && result.ok && result.kind === "zerocards" && (
        <p className="text-[11px] text-yellow-700 mt-2 flex items-start gap-1.5"><AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" />{result.warn}{" You can still start a Q&A-only session."}</p>
      )}
    </div>
  );
}

// Shared board-selection step. `discovered` is the boards found so far; "Add another Trello
// link" appends more (Part E scenario 5). Zero discovered boards → degraded Q&A-only start.
function BoardPicker({ discovered = [], initialDeadline, personId = "minh-le", onCancel, cancelHref }) {
  const [boards, setBoards] = useState(discovered);
  const [boardSelection, setBoardSelection] = useState(() => { const m = {}; discovered.forEach(b => { m[b.id] = b.suggested; }); return m; });
  const [deadline, setDeadline] = useState(initialDeadline);
  const [adding, setAdding] = useState(false);
  const selectedCount = Object.values(boardSelection).filter(Boolean).length;
  const degraded = boards.length === 0;

  const addBoards = (more) => {
    const fresh = more.filter(b => !boards.some(x => x.id === b.id));
    setBoards(prev => [...prev, ...fresh]);
    setBoardSelection(prev => { const m = { ...prev }; fresh.forEach(b => { m[b.id] = b.suggested; }); return m; });
    setAdding(false);
  };

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
        {degraded ? (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50/60 p-3 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-yellow-800 leading-relaxed">No boards with relevant cards were discovered. You can start a degraded session (manual Q&amp;A only, no modules) or add another Trello link below.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {boards.map(b => {
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
        )}

        {/* Part E scenario 5 — add boards from another Trello workspace */}
        {adding ? (
          <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50/60 p-3">
            <TrelloLinkField onDiscover={addBoards} label="Another Trello link" autoFocus />
            <button onClick={() => setAdding(false)} className="text-[11px] text-gray-500 hover:text-gray-700 mt-2">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setAdding(true)} className="mt-2 text-[11px] text-violet-600 hover:text-violet-700 font-medium inline-flex items-center gap-1"><Plus className="w-3 h-3" />Add another Trello link</button>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        {cancelHref ? (
          <Link href={cancelHref} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Cancel</Link>
        ) : (
          <button onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Cancel</button>
        )}
        {(selectedCount > 0 || degraded) ? (
          <Link href={`/session/${personId}`} className="h-10 px-5 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30 bg-violet-600 hover:bg-violet-700 text-white">
            {degraded ? "Start Q&A session" : "Start session"}<ArrowRight className="w-3.5 h-3.5" />
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

// ── Path 2: manual creation — 4 fields + selectable data-source chips (§3.1 / §3.2) ─
function ManualForm() {
  const [email, setEmail] = useState("");
  const [dept, setDept] = useState("");
  const [lastDay, setLastDay] = useState("");
  // SC-02 — pre-connect Trello so the manual form demos the "connected" state (green validation) on load.
  const [trello, setTrello] = useState("https://trello.com/b/abc123/backend-services");
  // §3.2 — optional sources: name → typed value (non-functional). Presence of a key = chip active.
  const [extraSources, setExtraSources] = useState({});
  const [result, setResult] = useState(null); // null | validateTrello() — set on "Discover boards"
  const [checking, setChecking] = useState(false);

  // §3.5 — live Trello validation feedback driven by the typed value (no network).
  const live = validateTrello(trello);
  const canSubmit = email.trim() && dept && lastDay && live.ok;

  const toggleSource = (name) => setExtraSources(prev => {
    const next = { ...prev };
    if (name in next) delete next[name]; else next[name] = "";
    return next;
  });
  const setSourceValue = (name, value) => setExtraSources(prev => ({ ...prev, [name]: value }));

  const submit = () => {
    if (!canSubmit) return;
    setChecking(true);
    setResult(null);
    setTimeout(() => { setChecking(false); setResult(validateTrello(trello)); }, 800);
  };
  const reset = () => setResult(null);
  const discovered = result && result.ok ? (result.boards || []) : null;

  return (
    <section>
      <h2 className="text-[11px] uppercase tracking-wider font-medium text-gray-500 mb-3 flex items-center gap-1.5">
        <Plus className="w-3 h-3" />Create manually
      </h2>

      <div className="rounded-lg border border-gray-200 bg-white p-5 space-y-4">
        {/* §3.1 — Name is auto-derived from the Trello profile, not entered. */}
        <Field label="Email" required hint="identification & invitation">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); reset(); }} placeholder="name@company.com" className={`${inputCls} pl-9`} />
          </div>
        </Field>

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

        {/* §3.2 — Data sources as selectable chips */}
        <div className="pt-1">
          <label className="text-[11px] text-gray-500 uppercase tracking-wider font-medium mb-2 flex items-center gap-1.5">
            Data sources<span className="text-rose-400 normal-case tracking-normal">*</span>
            <span className="text-gray-400 normal-case tracking-normal font-normal">{"· "}Trello required</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {/* Trello — always active, no × */}
            <span className="h-7 px-2.5 rounded-full bg-violet-600 text-white text-[11px] font-medium inline-flex items-center gap-1.5 select-none">
              <Check className="w-3 h-3" />Trello
            </span>
            {OPTIONAL_SOURCES.map(name => {
              const active = name in extraSources;
              return (
                <button key={name} type="button" onClick={() => toggleSource(name)} className={`h-7 px-2.5 rounded-full text-[11px] font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${active ? "bg-violet-600 text-white" : "border border-gray-300 bg-white text-gray-600 hover:border-gray-400"}`}>
                  {active ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}{name}
                </button>
              );
            })}
          </div>

          {/* Trello link input — always visible. §3.5 live validation feedback below. */}
          <div className="mt-3">
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input value={trello} onChange={(e) => { setTrello(e.target.value); reset(); }} placeholder="https://trello.com/b/…  or  /w/workspace" className={`${inputCls} pl-9`} />
            </div>
            {trello.trim() && live.ok && (
              <p className={`text-[11px] mt-1.5 flex items-start gap-1.5 ${live.kind === "zerocards" ? "text-yellow-700" : "text-emerald-700"}`}>
                {live.kind === "zerocards"
                  ? <><AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" />{live.warn}</>
                  : <><CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-px" />{live.msg}</>}
              </p>
            )}
            {trello.trim() && !live.ok && (
              <p className="text-[11px] text-rose-600 mt-1.5 flex items-start gap-1.5"><AlertCircle className="w-3.5 h-3.5 shrink-0 mt-px" />{live.msg}</p>
            )}
            <p className="text-[10px] text-gray-400 mt-1">The offboarder&apos;s name is auto-derived from their Trello profile.</p>
          </div>

          {/* Link inputs for active optional sources — non-functional in the mockup. */}
          {Object.keys(extraSources).length > 0 && (
            <div className="mt-3 space-y-2">
              {OPTIONAL_SOURCES.filter(n => n in extraSources).map(name => (
                <div key={name} className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input value={extraSources[name]} onChange={(e) => setSourceValue(name, e.target.value)} placeholder={`${name} link (optional)`} className={`${inputCls} pl-9`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {!discovered && (
          <div className="flex justify-end pt-1">
            {canSubmit ? (
              <button onClick={submit} disabled={checking} className="h-10 px-5 rounded-lg text-sm font-medium inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30 disabled:opacity-70">
                {checking ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Link2 className="w-3.5 h-3.5" />}
                {checking ? "Discovering boards…" : "Discover boards"}
              </button>
            ) : (
              <span aria-disabled="true" className="h-10 px-5 rounded-lg text-sm font-medium inline-flex items-center gap-2 bg-gray-100 text-gray-400 cursor-not-allowed select-none">
                <Link2 className="w-3.5 h-3.5" />Discover boards
              </span>
            )}
          </div>
        )}
      </div>

      {/* Discovery succeeded → person card + board selection (same UI as the HRIS path) */}
      {discovered && (
        <div className="rounded-lg border border-violet-300 bg-white shadow-sm p-4 mt-3">
          <div className="flex items-center gap-3 pb-3 mb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 text-[11px] font-semibold inline-flex items-center justify-center shrink-0 border border-violet-200">
              <Users className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">{email || "New offboarder"}</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5" />{result.kind === "zerocards" ? "Link reachable" : result.kind === "workspace" ? "Workspace found" : "Board found"}</span>
              </div>
              <p className="text-[12px] text-gray-500">{dept}{" · "}Name auto-derived from Trello profile</p>
            </div>
          </div>
          <BoardPicker discovered={result.boards || []} initialDeadline={calcDeadlineFromDate(lastDay)} personId="minh-le" onCancel={reset} />
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
