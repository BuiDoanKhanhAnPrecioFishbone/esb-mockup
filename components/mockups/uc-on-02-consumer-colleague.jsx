"use client";

import React, { useState } from "react";
import {
  ChevronLeft, ChevronRight, Sparkles, Network, MessageSquare,
  Lock, Eye, KeyRound, Send, Search, Bell, HelpCircle,
  ChevronDown, ChevronUp, ArrowUpRight, Check, X, AlertTriangle,
  Info, Tag, Hash, FileText, GitBranch, Folder, Briefcase,
  Calendar, ArrowRight, Plus, Maximize2, ZoomIn,
  Clock, BookOpen, ChevronsRight, Cpu, AlertOctagon, Award,
  ShieldOff, Users, Compass, Filter, History, Bookmark
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   UC-ON-02 · Consumer · COLLEAGUE · Sprint 4 · Consumption plane

   The Colleague's lookup experience · Duy Nguyen (Senior SRE on the
   Data Platform team) needs context on Project Atlas because his
   Cosmos partition service depends on it. No personalized playbook.
   Search-first entry. Single-question lookups. The same GLOBAL
   knowledge graph the Newcomer sees, but through a narrower RBAC
   lens · multiple Tier 1 Lock stubs visible, no personnel context,
   no salary / disciplinary content.

   MASTER.md "AI-Native Minimal" design language per CL-096.
   Semantic palette (rose / yellow / emerald / violet) preserved as
   the meaning layer.

   Honors:
     · CL-091 Trello as POC source · 4-layer hard-filter contract
     · CL-093 Multiple Tier 1 metadata Lock stubs (Colleague's
              narrower RBAC means MORE locks visible than Newcomer's)
     · CL-094 Progressive Disclosure · Quick-start chips ·
              0-token hover via pre-computed short_summary ·
              Prompt Disambiguation (used aggressively here)
     · CL-096 MASTER.md "AI-Native Minimal" indigo / glassmorphism
     · CL-097 English-only · latinized usernames

   8 clickable states walk the lookup lifecycle:

     S1 · Entry · search the graph · empty state with suggestions
     S2 · Typed query · searching with optimistic UI
     S3 · Prompt Disambiguation · 3 narrowed chips
     S4 · Grounded answer · canonical rollback steps
     S5 · Tier 1 lock-heavy view · narrower RBAC visible
     S6 · Out-of-scope query · clear rejection with explanation
     S7 · Browsing 1-hop neighborhood from result
     S8 · Following an entity to another · graph re-centers
   ═══════════════════════════════════════════════════════════════════ */

const FLOW = [
  { id: "s1", uc: "Step 1", label: "Entry · search the graph",         trigger: "Duy lands at /knowledge-graph from a Slack deep-link · no personalized playbook · search is the hero." },
  { id: "s2", uc: "Step 2", label: "Typed query · searching",          trigger: "Duy types 'How do I roll back Atlas?' · search affordance fires." },
  { id: "s3", uc: "Step 3", label: "Disambiguation · 3 chips",         trigger: "Question is borderline broad · AI offers 3 narrowed chips before pulling the subgraph." },
  { id: "s4", uc: "Step 4", label: "Grounded answer · canonical",      trigger: "Picked 'Rollback procedure' · grounded steps + named source chips · graph focuses." },
  { id: "s5", uc: "Step 5", label: "Tier 1 lock-heavy view",           trigger: "Same graph, narrower RBAC · 3 Tier-1 lock stubs · 2 personnel ghosts hinted." },
  { id: "s6", uc: "Step 6", label: "Out-of-scope · clear rejection",   trigger: "Duy asked about 'Khanh Linh's salary' · Copilot returns out-of-scope card with CL-019 grammar." },
  { id: "s7", uc: "Step 7", label: "Browsing 1-hop neighborhood",      trigger: "Duy explores Atlas's 1-hop neighborhood after the answer · narrower than Tran's view." },
  { id: "s8", uc: "Step 8", label: "Follow entity · graph re-centers", trigger: "Duy clicked Cosmos · graph re-centers · Atlas becomes a spoke · global graph navigation." },
];

const SESSION = {
  reader: "Duy Nguyen",
  readerInitials: "DN",
  readerHandle: "@duy.nguyen",
  readerRole: "Senior Site Reliability Engineer",
  readerTeam: "Data Platform",
  predecessor: "Minh Le",
  predecessorHandle: "@minh.le",
  manager: "Ha Vy",
};

const FONT_STACK = 'Inter, "Geist", "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';
const MONO_STACK = 'ui-monospace, "Geist Mono", "JetBrains Mono", Menlo, monospace';

export default function UCON02ConsumerColleague() {
  const [stepIdx, setStepIdx] = useState(0);
  const step = FLOW[stepIdx];
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900" style={{ fontFamily: FONT_STACK }}>
      <DevChrome step={step} stepIdx={stepIdx} onJump={setStepIdx} />
      <main className="flex-1 flex flex-col bg-gradient-to-b from-indigo-50/40 to-white">
        <StateRenderer id={step.id} />
      </main>
      <DevFooterNav stepIdx={stepIdx} step={step} onChange={setStepIdx} />
    </div>
  );
}

/* ─── Dev chrome ─── */

function DevChrome({ step, stepIdx, onJump }) {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="px-5 py-2 flex items-center justify-between gap-4 max-w-[1600px] mx-auto w-full">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
          <span className="text-slate-900 font-semibold tracking-[0.18em] text-xs" style={{ fontFamily: MONO_STACK }}>ART-EEP</span>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-slate-500 text-xs">UC-ON-02 · Colleague · Consumer plane</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          <span className="uppercase tracking-wider font-semibold text-indigo-700">AI-Native Minimal · narrow RBAC</span>
          <span className="text-gray-300">·</span>
          <span className="text-slate-700" style={{ fontFamily: MONO_STACK }}>{step.uc}</span>
        </div>
      </div>
      <div className="px-5 pb-2 flex items-center justify-between gap-4 max-w-[1600px] mx-auto w-full">
        <div className="min-w-0 flex-1">
          <h1 className="text-sm font-semibold text-slate-900 truncate">
            {stepIdx + 1} of {FLOW.length} · {step.label}
          </h1>
          <p className="text-[11px] text-slate-500 mt-0.5 truncate">{step.trigger}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0 flex-wrap">
          {FLOW.map((s, i) => (
            <StepDot key={s.id} idx={i + 1} active={i === stepIdx} onClick={() => onJump(i)} title={s.label} />
          ))}
        </div>
      </div>
    </header>
  );
}

function StepDot({ idx, active, onClick, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-7 h-7 rounded-lg border text-[11px] font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer ${
        active
          ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white border-transparent shadow-sm"
          : "bg-white text-indigo-700 border-indigo-200 hover:border-indigo-400"
      }`}
      style={{ fontFamily: MONO_STACK }}
    >
      {idx}
    </button>
  );
}

function DevFooterNav({ stepIdx, step, onChange }) {
  const atFirst = stepIdx === 0;
  const atLast = stepIdx === FLOW.length - 1;
  return (
    <footer className="bg-white/95 backdrop-blur-sm border-t border-gray-200 px-5 py-2 flex items-center justify-between sticky bottom-0 z-50">
      <button
        onClick={() => !atFirst && onChange(stepIdx - 1)}
        disabled={atFirst}
        className={`h-7 px-3 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
          atFirst ? "text-gray-300 cursor-not-allowed" : "text-slate-700 hover:bg-gray-100"
        }`}
      >
        <ChevronLeft className="w-3 h-3" />
        Previous
      </button>
      <div className="hidden sm:block text-[10px] text-slate-500 max-w-md text-center truncate px-3">
        Dev chrome · this strip is NOT part of the real Consumer surface.
      </div>
      <button
        onClick={() => !atLast && onChange(stepIdx + 1)}
        disabled={atLast}
        className={`h-7 px-3 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer ${
          atLast ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gradient-to-br from-indigo-500 to-violet-600 hover:brightness-110 text-white shadow-sm"
        }`}
      >
        Next
        <ChevronRight className="w-3 h-3" />
      </button>
    </footer>
  );
}

function StateRenderer({ id }) {
  if (id === "s1") return <ConsumerShell><S1Entry /></ConsumerShell>;
  if (id === "s2") return <ConsumerShell><S2Searching /></ConsumerShell>;
  if (id === "s3") return <ConsumerShell><S3Disambiguation /></ConsumerShell>;
  if (id === "s4") return <ConsumerShell><S4Grounded /></ConsumerShell>;
  if (id === "s5") return <ConsumerShell><S5LockHeavy /></ConsumerShell>;
  if (id === "s6") return <ConsumerShell><S6OutOfScope /></ConsumerShell>;
  if (id === "s7") return <ConsumerShell><S7Browsing /></ConsumerShell>;
  if (id === "s8") return <ConsumerShell><S8FollowEntity /></ConsumerShell>;
  return null;
}

/* ═══════════════════════════════════════════════════════════════════
   ConsumerShell · Colleague variant
   Same MASTER.md aesthetic · floating navbar reflects "no playbook"
   ═══════════════════════════════════════════════════════════════════ */

function ConsumerShell({ children }) {
  return (
    <div className="flex flex-col flex-1 min-h-[820px] relative">
      <FloatingNavbar />
      <div className="flex-1 pt-20 pb-6 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
        {children}
      </div>
    </div>
  );
}

function FloatingNavbar() {
  return (
    <header className="fixed top-[88px] left-4 right-4 z-40 max-w-[1568px] mx-auto">
      <nav className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg shadow-indigo-900/[0.04] px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
              <Network className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-bold text-slate-900 tracking-tight">ART-EEP</span>
          </a>
          <span className="text-gray-300">·</span>
          <a href="#" className="text-[12px] font-medium text-indigo-700">Knowledge graph</a>
          <a href="#" className="text-[12px] font-medium text-slate-500 hover:text-slate-900 transition-colors">Recent searches</a>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-slate-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
            <Bell className="w-4 h-4" strokeWidth={1.75} />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-slate-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
            <HelpCircle className="w-4 h-4" strokeWidth={1.75} />
          </button>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <div className="flex items-center gap-2 pl-1">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border border-white shadow-sm flex items-center justify-center">
              <span className="text-[10px] font-semibold text-white">{SESSION.readerInitials}</span>
            </div>
            <div className="hidden md:flex flex-col leading-tight">
              <span className="text-[11px] font-semibold text-slate-900">{SESSION.reader}</span>
              <span className="text-[9px] text-slate-500" style={{ fontFamily: MONO_STACK }}>{SESSION.readerHandle} · {SESSION.readerTeam}</span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S1 · Entry · search the graph
   ═══════════════════════════════════════════════════════════════════ */

function S1Entry() {
  return (
    <div className="max-w-3xl mx-auto pt-12">
      <div className="text-center mb-10">
        <EyebrowPill>
          <Compass className="w-3 h-3" strokeWidth={2.5} />
          Cross-team lookup · no personalized playbook
        </EyebrowPill>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.05] mt-5 mb-4" style={{ fontFamily: FONT_STACK }}>
          What do you need to{" "}
          <span className="bg-gradient-to-br from-indigo-500 to-violet-600 bg-clip-text text-transparent">find</span> today?
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
          Ask the knowledge graph. You'll get a grounded answer with named sources, plus the relevant subgraph — never the whole hairball.
        </p>
      </div>

      {/* Hero search */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-md border-2 border-indigo-200 shadow-2xl shadow-indigo-900/[0.08] p-3 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 shadow-sm">
            <Search className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <input
            type="text"
            placeholder="Ask anything · 'How do I roll back Atlas?' · 'Who owns Vendor XYZ?'"
            className="flex-1 text-base text-slate-900 placeholder:text-slate-400 bg-transparent outline-none"
            style={{ fontFamily: FONT_STACK }}
          />
          <kbd className="hidden sm:flex px-2 py-1 rounded-lg border border-gray-200 bg-gray-50 text-[10px] text-slate-500 shrink-0" style={{ fontFamily: MONO_STACK }}>⌘K</kbd>
        </div>
      </div>

      {/* Suggested queries · 3 categories */}
      <div className="space-y-6">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-indigo-500" strokeWidth={2} />
            Most-asked this week
          </div>
          <div className="flex flex-wrap gap-2">
            <SuggestionChip icon={GitBranch}>How do I roll back Project Atlas?</SuggestionChip>
            <SuggestionChip icon={Users}>Who's on-call for Payment Gateway?</SuggestionChip>
            <SuggestionChip icon={FileText}>Where's the Atlas runbook?</SuggestionChip>
            <SuggestionChip icon={AlertOctagon}>What broke last Friday?</SuggestionChip>
          </div>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-2.5 flex items-center gap-1.5">
            <Compass className="w-3 h-3 text-indigo-500" strokeWidth={2} />
            Things connected to your team ({SESSION.readerTeam})
          </div>
          <div className="flex flex-wrap gap-2">
            <SuggestionChip icon={Cpu}>Cosmos partition · how Atlas uses it</SuggestionChip>
            <SuggestionChip icon={Network}>Services that depend on Data Platform</SuggestionChip>
            <SuggestionChip icon={Calendar}>Recent incidents · last 30 days</SuggestionChip>
          </div>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-2.5 flex items-center gap-1.5">
            <Bookmark className="w-3 h-3 text-indigo-500" strokeWidth={2} />
            Your recent searches
          </div>
          <ul className="rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm divide-y divide-gray-100">
            <RecentSearchRow query="Cosmos partition timeout · root cause" when="2 days ago" />
            <RecentSearchRow query="Who edited the Atlas wiki most recently?" when="1 week ago" />
            <RecentSearchRow query="Vendor XYZ SLA terms" when="2 weeks ago" />
          </ul>
        </div>
      </div>

      {/* Footer note · scope reminder */}
      <div className="mt-8 rounded-xl bg-indigo-50/50 border border-indigo-100 px-4 py-3 flex items-start gap-2.5">
        <Info className="w-3.5 h-3.5 text-indigo-700 shrink-0 mt-0.5" strokeWidth={2} />
        <p className="text-[11px] text-indigo-900/80 leading-relaxed">
          <strong>You're searching as a Colleague</strong> · {SESSION.readerTeam} team. You'll see Canonical Facts from shared workspaces and your team's content. Personnel context, compensation, and other teams' Tier-1 content stay locked — you can request access if you find a relevant lock.
        </p>
      </div>
    </div>
  );
}

function SuggestionChip({ icon: Icon, children }) {
  return (
    <button className="inline-flex items-center gap-1.5 text-[12px] text-slate-700 bg-white hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300 px-3 py-1.5 rounded-xl transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
      <Icon className="w-3 h-3 text-indigo-600" strokeWidth={2} />
      {children}
    </button>
  );
}

function RecentSearchRow({ query, when }) {
  return (
    <li className="px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer">
      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" strokeWidth={1.75} />
      <span className="text-[13px] text-slate-700 flex-1 truncate">{query}</span>
      <span className="text-[10px] text-slate-500 shrink-0" style={{ fontFamily: MONO_STACK }}>{when}</span>
      <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" strokeWidth={2} />
    </li>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S2 · Typed query · searching with optimistic UI
   ═══════════════════════════════════════════════════════════════════ */

function S2Searching() {
  return (
    <div className="max-w-3xl mx-auto pt-12">
      <div className="rounded-3xl bg-white/90 backdrop-blur-md border-2 border-indigo-300 shadow-2xl shadow-indigo-900/[0.10] p-3 mb-8 ring-4 ring-indigo-500/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 shadow-sm">
            <Search className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <input
            type="text"
            defaultValue="How do I roll back Project Atlas?"
            autoFocus
            className="flex-1 text-base text-slate-900 bg-transparent outline-none font-medium"
            style={{ fontFamily: FONT_STACK }}
          />
          <button className="px-3 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3 h-3" strokeWidth={2.5} />
            Searching
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg shadow-indigo-900/[0.04] overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-indigo-50/30 to-violet-50/30 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white animate-pulse" strokeWidth={2.5} />
          </span>
          <span className="text-[12px] font-semibold text-slate-900">Searching the graph...</span>
          <span className="text-[10px] text-slate-500 ml-auto" style={{ fontFamily: MONO_STACK }}>~ 1.2 s</span>
        </div>

        <div className="px-5 py-4 space-y-3">
          <SearchStage label="Parsing your question" detail="Identifying entities and intent" status="done" />
          <SearchStage label="Resolving RBAC scope" detail="Data Platform team · Colleague tier" status="done" />
          <SearchStage label="Retrieving subgraph" detail="Pre-retrieval ACL trim · 47 candidate nodes → 23 visible" status="active" />
          <SearchStage label="Disambiguating intent" detail="Question has multiple plausible scopes" status="pending" />
        </div>

        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="text-[10px] text-slate-500 inline-flex items-center gap-1.5">
            <Sparkles className="w-2.5 h-2.5 text-indigo-500" strokeWidth={2} />
            Worker SLM handling parse + ACL · Expert LLM reserved for the answer
          </div>
          <span className="text-[10px] text-slate-500" style={{ fontFamily: MONO_STACK }}>~ 84 tokens used so far</span>
        </div>
      </div>
    </div>
  );
}

function SearchStage({ label, detail, status }) {
  const cfg = {
    done: { icon: Check, ringCls: "bg-emerald-50 border-emerald-200 text-emerald-700", labelCls: "text-slate-700" },
    active: { icon: Sparkles, ringCls: "bg-indigo-50 border-indigo-200 text-indigo-700", labelCls: "text-slate-900 font-semibold" },
    pending: { icon: Clock, ringCls: "bg-gray-50 border-gray-200 text-slate-400", labelCls: "text-slate-400" },
  }[status];
  const Icon = cfg.icon;
  return (
    <div className="flex items-start gap-3">
      <div className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${cfg.ringCls}`}>
        <Icon className={`w-3 h-3 ${status === "active" ? "animate-pulse" : ""}`} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-[12px] ${cfg.labelCls}`}>{label}</div>
        <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">{detail}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S3 · Prompt Disambiguation · 3 narrowed chips
   ═══════════════════════════════════════════════════════════════════ */

function S3Disambiguation() {
  return (
    <div className="max-w-3xl mx-auto pt-12">
      <ResultHeader query="How do I roll back Project Atlas?" stage="disambig" />

      <div className="rounded-2xl bg-white/90 backdrop-blur-md border border-indigo-200 shadow-xl shadow-indigo-900/[0.06] overflow-hidden mb-6">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" strokeWidth={2.5} />
          </span>
          <span className="text-[12px] font-semibold text-slate-900">Copilot</span>
          <span className="text-[10px] text-slate-500">· grounded in 4 sources</span>
          <span className="ml-auto text-[9px] text-indigo-700 font-semibold uppercase tracking-wider inline-flex items-center gap-1">
            <AlertTriangle className="w-2.5 h-2.5" strokeWidth={2.5} />
            Disambiguating
          </span>
        </div>

        <div className="px-5 py-4">
          <p className="text-[14px] text-slate-700 leading-relaxed mb-4">
            <strong>Project Atlas has a few rollback paths</strong> — and which one you need depends on what you're rolling back. Pick a scope and I'll fetch just that subgraph instead of pulling all 47 nodes connected to Atlas:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <DisambigCard
              icon={GitBranch}
              label="Code deployment"
              detail="Standard 3-step procedure · canonical · last verified 11 days ago"
              tone="emerald"
              primary
            />
            <DisambigCard
              icon={Cpu}
              label="Cosmos partition"
              detail="Data layer rollback · involves your Data Platform team"
              tone="indigo"
            />
            <DisambigCard
              icon={AlertOctagon}
              label="Incident-mode rollback"
              detail="Used during INC-2942 last quarter · faster but riskier"
              tone="rose"
            />
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
            <div className="text-[10px] text-slate-500 inline-flex items-center gap-1.5">
              <Sparkles className="w-2.5 h-2.5 text-indigo-500" strokeWidth={2} />
              Each chip ~ 180 tokens · the broad subgraph would be ~ 4,200
            </div>
            <button className="text-[10px] text-indigo-700 hover:text-indigo-900 font-semibold inline-flex items-center gap-1 cursor-pointer">
              Or type a more specific question
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-[11px] text-slate-500 inline-flex items-center gap-1.5">
          <Info className="w-3 h-3" strokeWidth={2} />
          Disambiguation triggered because the question matched multiple distinct subgraphs · this is CL-094's Prompt Disambiguation in action.
        </p>
      </div>
    </div>
  );
}

function DisambigCard({ icon: Icon, label, detail, tone, primary }) {
  const cfg = {
    emerald: { ring: "border-emerald-300", iconBg: "bg-emerald-50 border-emerald-200", iconColor: "text-emerald-700" },
    indigo: { ring: "border-indigo-300", iconBg: "bg-indigo-50 border-indigo-200", iconColor: "text-indigo-700" },
    rose: { ring: "border-rose-300", iconBg: "bg-rose-50 border-rose-200", iconColor: "text-rose-700" },
  }[tone];
  return (
    <button className={`text-left rounded-2xl bg-white border-2 ${cfg.ring} ${primary ? "ring-4 ring-emerald-500/10" : ""} p-4 transition-all cursor-pointer hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 relative`}>
      {primary && (
        <span className="absolute -top-2 right-3 px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-semibold uppercase tracking-wider">
          Most likely
        </span>
      )}
      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center mb-2.5 ${cfg.iconBg}`}>
        <Icon className={`w-4 h-4 ${cfg.iconColor}`} strokeWidth={2} />
      </div>
      <div className="text-[13px] font-semibold text-slate-900 mb-1">{label}</div>
      <div className="text-[11px] text-slate-500 leading-snug">{detail}</div>
    </button>
  );
}

function ResultHeader({ query, stage }) {
  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm p-4 mb-5 flex items-center gap-3">
      <button className="text-slate-500 hover:text-slate-900 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
        <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
      </button>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Search className="w-3.5 h-3.5 text-indigo-600 shrink-0" strokeWidth={2.5} />
        <span className="text-[14px] text-slate-900 font-medium truncate">{query}</span>
      </div>
      {stage === "disambig" && <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700">Narrowing</span>}
      {stage === "answered" && <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">Answered</span>}
      {stage === "rejected" && <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700">Out of scope</span>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S4 · Grounded answer · canonical rollback steps
   ═══════════════════════════════════════════════════════════════════ */

function S4Grounded() {
  return (
    <TwoPaneLayout>
      <LeftPane>
        <ResultHeader query="How do I roll back Project Atlas? · Code deployment" stage="answered" />

        <article className="space-y-5">
          <div className="rounded-2xl bg-white/90 backdrop-blur-md border border-emerald-200 shadow-lg shadow-emerald-900/[0.04] overflow-hidden">
            <div className="px-5 py-3 border-b border-emerald-100 bg-emerald-50/40 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" strokeWidth={2.5} />
              </span>
              <span className="text-[12px] font-semibold text-slate-900">Copilot · grounded answer</span>
              <span className="text-[10px] text-slate-500">· 4 sources</span>
              <span className="ml-auto text-[9px] text-emerald-700 font-semibold uppercase tracking-wider inline-flex items-center gap-1">
                <Check className="w-2.5 h-2.5" strokeWidth={2.5} />
                Canonical · high confidence
              </span>
            </div>

            <div className="px-5 py-5">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3" style={{ fontFamily: FONT_STACK }}>
                Project Atlas rollback · <span className="bg-gradient-to-br from-indigo-500 to-violet-600 bg-clip-text text-transparent">3 canonical steps</span>
              </h2>

              <p className="text-[14px] text-slate-700 leading-relaxed mb-4">
                The procedure was canonicalized from {SESSION.predecessor}'s handover interview on May 14. Always go through staging first · the wiki documents a shorter path that the team agrees is wrong.
              </p>

              <ol className="space-y-3 mb-5">
                <RollbackStep
                  n={1}
                  title="Snapshot Cosmos partition"
                  detail={<>Take a snapshot of the Cosmos partition keyed by <code className="text-[12px] bg-emerald-100/60 px-1 rounded" style={{ fontFamily: MONO_STACK }}>org</code>. This is the Data Platform team's responsibility — your team owns this step.</>}
                  hot
                />
                <RollbackStep
                  n={2}
                  title="Run migration playbook · staging first"
                  detail={<>Run the migration playbook against <strong>staging mirror first</strong> — never production directly, even with a snapshot. The Atlas wiki v2.3 is wrong about this. <em>Team-agreed correction.</em></>}
                />
                <RollbackStep
                  n={3}
                  title="Verify schema integrity, then promote"
                  detail="Run the schema-integrity check before promoting to production. If anything fails, the snapshot from step 1 is your fallback — restore from there."
                />
              </ol>

              <div className="rounded-xl bg-yellow-50/60 border border-yellow-200 px-3 py-2.5 mb-4 flex items-start gap-2">
                <Bookmark className="w-3.5 h-3.5 text-yellow-700 shrink-0 mt-0.5" strokeWidth={2} />
                <div className="text-[11px] text-yellow-900/90 leading-relaxed">
                  <strong>Unwritten rule:</strong> Don't deploy Atlas on Fridays · team agreement since INC-2942 last quarter, not company policy. This applies to rollbacks too unless it's actively breaking production.
                </div>
              </div>

              <SourceChipRow sources={[
                { label: `${SESSION.predecessor} interview`, kind: "transcript", ts: "May 14" },
                { label: "Atlas wiki · v2.3", kind: "doc" },
                { label: "INC-2942 post-mortem", kind: "incident" },
                { label: "Trello · Atlas-Procedures", kind: "board" },
              ]} />
            </div>

            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between flex-wrap gap-2">
              <div className="text-[10px] text-slate-500 inline-flex items-center gap-1.5">
                <Sparkles className="w-2.5 h-2.5 text-indigo-500" strokeWidth={2} />
                Worker SLM · 178 tokens · Expert LLM not invoked (Worker confidence above threshold)
              </div>
              <div className="flex items-center gap-1.5">
                <SecondaryButtonSm><AlertTriangle className="w-3 h-3" />Flag</SecondaryButtonSm>
                <SecondaryButtonSm><Bookmark className="w-3 h-3" />Save</SecondaryButtonSm>
                <SecondaryButtonSm><ArrowUpRight className="w-3 h-3" />Open in graph</SecondaryButtonSm>
              </div>
            </div>
          </div>

          {/* Follow-up suggestions */}
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-2.5">Follow up</div>
            <div className="flex flex-wrap gap-2">
              <SuggestionChip icon={Users}>Who else worked on Atlas?</SuggestionChip>
              <SuggestionChip icon={AlertOctagon}>What broke during INC-2942?</SuggestionChip>
              <SuggestionChip icon={Cpu}>Show the Cosmos partition diagram</SuggestionChip>
            </div>
          </div>
        </article>
      </LeftPane>

      <RightStack
        graph={<GlobalGraph focus="atlas" lens="colleague" mode="rollback" />}
        bottom={<ContextPanel reader={SESSION.reader} role={SESSION.readerRole} team={SESSION.readerTeam} />}
      />
    </TwoPaneLayout>
  );
}

function RollbackStep({ n, title, detail, hot }) {
  return (
    <li className="flex items-start gap-3">
      <span className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-[12px] font-bold text-emerald-700" style={{ fontFamily: MONO_STACK }}>{n}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="text-[14px] font-semibold text-slate-900 leading-tight">{title}</h4>
          {hot && <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700">Your team owns this</span>}
        </div>
        <div className="text-[12px] text-slate-600 mt-1 leading-relaxed">{detail}</div>
      </div>
    </li>
  );
}

function SourceChipRow({ sources }) {
  const iconFor = (kind) => ({
    transcript: MessageSquare,
    doc: FileText,
    incident: AlertOctagon,
    board: GitBranch,
  }[kind] || FileText);
  return (
    <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-gray-100">
      <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">Sources ·</span>
      {sources.map((s, i) => {
        const Icon = iconFor(s.kind);
        return (
          <span key={i} className="inline-flex items-center gap-1 text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded-md hover:bg-indigo-100 cursor-pointer transition-colors">
            <Icon className="w-2.5 h-2.5" strokeWidth={2} />
            {s.label}
            {s.ts && <span className="text-slate-500" style={{ fontFamily: MONO_STACK }}>· {s.ts}</span>}
          </span>
        );
      })}
    </div>
  );
}

function ContextPanel({ reader, role, team }) {
  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm p-4">
      <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-3">Your search scope</div>
      <div className="space-y-2.5">
        <ScopeRow label="Reader" value={reader} mono="@duy.nguyen" />
        <ScopeRow label="Role" value={role} />
        <ScopeRow label="Team" value={team} />
        <ScopeRow label="Tier" value="Colleague · cross-team" />
        <ScopeRow label="Can see" value="Public Canonical · own team" />
        <ScopeRow label="Cannot see" value="Personnel · Compensation · Tier 1 outside team" tone="muted" />
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-[10px] text-slate-500">
        <ShieldOff className="w-3 h-3" strokeWidth={2} />
        <span>RBAC trimmed at retrieval · not LLM-side</span>
      </div>
    </div>
  );
}

function ScopeRow({ label, value, mono, tone }) {
  return (
    <div className="text-[11px] flex items-baseline gap-2">
      <span className="text-slate-500 font-medium w-16 shrink-0">{label}</span>
      <div className="flex-1 min-w-0">
        <span className={`${tone === "muted" ? "text-slate-500 italic" : "text-slate-900 font-semibold"}`}>{value}</span>
        {mono && <div className="text-[10px] text-slate-500 mt-0.5" style={{ fontFamily: MONO_STACK }}>{mono}</div>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S5 · Tier 1 lock-heavy view (narrower RBAC visible)
   ═══════════════════════════════════════════════════════════════════ */

function S5LockHeavy() {
  return (
    <TwoPaneLayout>
      <LeftPane>
        <ResultHeader query="How do I roll back Project Atlas? · expanded view" stage="answered" />

        <article className="space-y-5">
          <div className="rounded-2xl bg-yellow-50/40 border-2 border-yellow-200 p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-yellow-300 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4 text-yellow-700" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">You're seeing more locks than {SESSION.predecessor}'s successor would</h3>
              <p className="text-[12px] text-slate-700 leading-relaxed">
                Same global graph · narrower RBAC. Your Data Platform team sees the technical content but not the personnel context that {SESSION.predecessor}'s successor (an Engineering teammate) would see by default. <strong>3 nodes around Atlas show as locks for you</strong> · 2 of them you can request access to, 1 is Tier-2 (not even rendered).
            </p>
            </div>
          </div>

          <div className="space-y-3">
            <LockCallout
              icon={Lock}
              label="Compensation framework v3"
              tags={["[Finance]", "[Personnel]"]}
              tier={1}
              reason="Touches the compensation model · scoped to People Operations + senior engineering leadership."
              affordance="Request from Khanh Linh Tran"
            />
            <LockCallout
              icon={Lock}
              label="Engineering succession plan · Atlas"
              tags={["[Personnel]", "[Confidential]"]}
              tier={1}
              reason={`Successor identification + transition plan · scoped to ${SESSION.manager} and HR.`}
              affordance="Request from Ha Vy"
            />
            <GhostStub
              label="(1 more node ghosted · Tier-2)"
              hint="Tier-2 content doesn't appear in your graph at all · existence and label both withheld. If you don't see a node, it's either out of scope or doesn't exist."
            />
          </div>

          <div className="rounded-xl bg-indigo-50/40 border border-indigo-100 px-4 py-3 flex items-start gap-2.5">
            <Info className="w-3.5 h-3.5 text-indigo-700 shrink-0 mt-0.5" strokeWidth={2} />
            <p className="text-[11px] text-indigo-900/80 leading-relaxed">
              The lock pattern is a <strong>deliberate discovery moment</strong> · we show you that knowledge exists rather than silently hiding it. You can request access from the owner if it would help your work.
            </p>
          </div>
        </article>
      </LeftPane>

      <RightStack
        graph={<GlobalGraph focus="atlas" lens="colleague" lockHeavy />}
        bottom={<ContextPanel reader={SESSION.reader} role={SESSION.readerRole} team={SESSION.readerTeam} />}
      />
    </TwoPaneLayout>
  );
}

function LockCallout({ icon: Icon, label, tags, tier, reason, affordance }) {
  return (
    <div className="rounded-2xl bg-white border border-yellow-200 p-3.5">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-yellow-50 border border-yellow-200 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-yellow-700" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4 className="text-[13px] font-semibold text-slate-900">{label}</h4>
            <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-yellow-100 border border-yellow-300 text-yellow-800">Tier {tier}</span>
            {tags.map((t, i) => (
              <span key={i} className="text-[9px] px-1 py-0.5 rounded bg-gray-50 border border-gray-200 text-slate-600" style={{ fontFamily: MONO_STACK }}>{t}</span>
            ))}
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed mb-2">{reason}</p>
          <button className="inline-flex items-center gap-1 text-[10px] text-indigo-700 hover:text-indigo-900 font-semibold cursor-pointer">
            <KeyRound className="w-2.5 h-2.5" strokeWidth={2} />
            {affordance}
          </button>
        </div>
      </div>
    </div>
  );
}

function GhostStub({ label, hint }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/40 p-3.5 flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-white border-2 border-dashed border-gray-300 flex items-center justify-center shrink-0">
        <ShieldOff className="w-4 h-4 text-slate-400" strokeWidth={1.75} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[12px] font-semibold text-slate-500 italic mb-1">{label}</h4>
        <p className="text-[10px] text-slate-500 leading-relaxed">{hint}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S6 · Out-of-scope query · clear rejection
   ═══════════════════════════════════════════════════════════════════ */

function S6OutOfScope() {
  return (
    <div className="max-w-3xl mx-auto pt-12">
      <ResultHeader query="What's Khanh Linh's compensation?" stage="rejected" />

      <div className="rounded-2xl bg-white/90 backdrop-blur-md border-2 border-rose-200 shadow-xl shadow-rose-900/[0.04] overflow-hidden">
        <div className="px-5 py-3 border-b border-rose-100 bg-rose-50/40 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-rose-100 border border-rose-200 flex items-center justify-center">
            <ShieldOff className="w-3 h-3 text-rose-700" strokeWidth={2.5} />
          </span>
          <span className="text-[12px] font-semibold text-rose-900">Out of scope · cannot answer</span>
        </div>

        <div className="px-5 py-5">
          <h2 className="text-xl font-bold text-slate-900 mb-2">That sounds like a Compensation question.</h2>

          <p className="text-[13px] text-slate-700 leading-relaxed mb-4">
            The knowledge graph doesn't carry compensation, payroll, or personnel-cases content for cross-team queries · those live in People Operations under <strong>{SESSION.manager}</strong>'s scope. Even if it did, your Colleague tier wouldn't include access · this is the locked Hybrid Security Tiering (CL-093) in effect.
          </p>

          <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 mb-4">
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-2">Where to find this</div>
            <div className="space-y-2">
              <RedirectRow icon={Users} label="HR self-service portal" detail="For your own payslip, benefits, time-off" />
              <RedirectRow icon={MessageSquare} label="People Operations · Khanh Linh's team" detail="For policy questions about compensation structure" />
            </div>
          </div>

          <div className="rounded-xl bg-yellow-50/40 border border-yellow-200 px-4 py-3 flex items-start gap-2.5">
            <AlertTriangle className="w-3.5 h-3.5 text-yellow-700 shrink-0 mt-0.5" strokeWidth={2} />
            <div className="text-[11px] text-yellow-900/90 leading-relaxed">
              <strong>This question is logged in your search audit</strong> · anonymized for analytics, attributed in security logs. If you needed to ask this for a legitimate reason (e.g., approval workflow), use the proper channel above rather than the graph.
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
            <button className="text-[11px] text-slate-500 hover:text-slate-700 inline-flex items-center gap-1 cursor-pointer">
              <Info className="w-3 h-3" strokeWidth={2} />
              Why is this restricted?
            </button>
            <div className="flex items-center gap-2">
              <SecondaryButton><ChevronLeft className="w-3 h-3" />New search</SecondaryButton>
            </div>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-500 text-center mt-4 inline-flex items-center justify-center w-full gap-1.5">
        <Sparkles className="w-3 h-3 text-indigo-500" strokeWidth={2} />
        CL-019 in effect · name the issue category + suggest the right action, not just refusal.
      </p>
    </div>
  );
}

function RedirectRow({ icon: Icon, label, detail }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-slate-600" strokeWidth={1.75} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-semibold text-slate-900">{label}</div>
        <div className="text-[10px] text-slate-500 leading-snug">{detail}</div>
      </div>
      <ArrowUpRight className="w-3 h-3 text-indigo-600 shrink-0" strokeWidth={2} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S7 · Browsing 1-hop neighborhood (after answer)
   ═══════════════════════════════════════════════════════════════════ */

function S7Browsing() {
  return (
    <TwoPaneLayout>
      <LeftPane>
        <ResultHeader query="Project Atlas · 1-hop neighborhood" stage="answered" />

        <article className="space-y-5">
          <div className="space-y-2">
            <EyebrowPill>
              <Network className="w-3 h-3" strokeWidth={2.5} />
              Browsing the global graph · Colleague lens
            </EyebrowPill>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight" style={{ fontFamily: FONT_STACK }}>
              Atlas connects to <span className="bg-gradient-to-br from-indigo-500 to-violet-600 bg-clip-text text-transparent">4 things you can see</span>.
            </h1>
            <p className="text-[13px] text-slate-600 leading-relaxed">
              Your team's relationship to Atlas runs through <strong>Cosmos partition</strong>. Click any node in the graph to focus on it · double-click to expand 2-hop.
            </p>
          </div>

          <div className="space-y-2.5">
            <NodeCard
              icon={Cpu}
              label="Cosmos partition · order-key"
              kind="Service · Canonical"
              detail="Data Platform team owns this. Atlas writes to it on every rollback. ~ 4.2M writes/day."
              tone="emerald"
              relevance="Most relevant to your team"
            />
            <NodeCard
              icon={Cpu}
              label="Payment Gateway"
              kind="Service · External"
              detail="External payment processor · depends on Atlas's order-routing layer. INC-2942 was here."
              tone="indigo"
            />
            <NodeCard
              icon={FileText}
              label="Atlas wiki · v2.3"
              kind="Doc · Trello board"
              detail="Documentation board. Note · the rollback section is wrong (team-flagged · use Copilot answer instead)."
              tone="yellow"
              flag="Contested"
            />
            <NodeCard
              icon={AlertOctagon}
              label="INC-2942 post-mortem"
              kind="Incident · Resolved"
              detail="Q3 outage during a Friday deployment. The reason for the team's Friday-deploy rule."
              tone="rose"
            />
          </div>

          <div className="text-[11px] text-slate-500 inline-flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-yellow-700" strokeWidth={2} />
            3 more nodes connected · locked or ghosted for your tier
          </div>
        </article>
      </LeftPane>

      <RightStack
        graph={<GlobalGraph focus="atlas" lens="colleague" mode="browse" />}
        bottom={<ContextPanel reader={SESSION.reader} role={SESSION.readerRole} team={SESSION.readerTeam} />}
      />
    </TwoPaneLayout>
  );
}

function NodeCard({ icon: Icon, label, kind, detail, tone, relevance, flag }) {
  const cfg = {
    emerald: { ring: "border-emerald-200", iconBg: "bg-emerald-50 border-emerald-200", iconColor: "text-emerald-700" },
    indigo: { ring: "border-indigo-200", iconBg: "bg-indigo-50 border-indigo-200", iconColor: "text-indigo-700" },
    yellow: { ring: "border-yellow-200", iconBg: "bg-yellow-50 border-yellow-200", iconColor: "text-yellow-700" },
    rose: { ring: "border-rose-200", iconBg: "bg-rose-50 border-rose-200", iconColor: "text-rose-700" },
  }[tone];
  return (
    <button className={`text-left w-full rounded-2xl bg-white border ${cfg.ring} hover:shadow-md transition-all p-3.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}>
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${cfg.iconBg}`}>
          <Icon className={`w-4 h-4 ${cfg.iconColor}`} strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h4 className="text-[13px] font-semibold text-slate-900">{label}</h4>
            {relevance && <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">{relevance}</span>}
            {flag && <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700">{flag}</span>}
          </div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{kind}</div>
          <p className="text-[11px] text-slate-600 leading-relaxed">{detail}</p>
        </div>
        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-1" strokeWidth={2} />
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S8 · Following entity to another · graph re-centers
   ═══════════════════════════════════════════════════════════════════ */

function S8FollowEntity() {
  return (
    <TwoPaneLayout>
      <LeftPane>
        <ResultHeader query="Cosmos partition · order-key" stage="answered" />

        <article className="space-y-5">
          <div className="rounded-2xl bg-emerald-50/40 border border-emerald-200 p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4 text-emerald-700" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">You're now centered on Cosmos partition</h3>
              <p className="text-[12px] text-slate-700 leading-relaxed">
                Atlas became a spoke. Same global graph · new lens. This is how cross-team exploration works · follow an entity and the whole neighborhood re-renders around it. Your tier is the same as before · still Colleague · still on Data Platform team.
              </p>
            </div>
          </div>

          <div>
            <EyebrowPill>
              <Cpu className="w-3 h-3" strokeWidth={2.5} />
              Service · canonical · owned by your team
            </EyebrowPill>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mt-3" style={{ fontFamily: FONT_STACK }}>
              Cosmos partition · <span className="bg-gradient-to-br from-indigo-500 to-violet-600 bg-clip-text text-transparent">order-key</span>
            </h1>
            <p className="text-[13px] text-slate-600 leading-relaxed mt-2">
              The order-key partition is the data layer Atlas writes to. Your team owns it. 4 services currently depend on it · Atlas is the heaviest writer.
            </p>
          </div>

          {/* Inbound services depending on this */}
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-2.5 flex items-center gap-1.5">
              <ArrowRight className="w-3 h-3 text-indigo-500" strokeWidth={2} />
              Services that depend on this · 4 inbound
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <DependencyTile name="Project Atlas" load="~ 4.2M writes/day" tier="primary" />
              <DependencyTile name="Order Reconciliation" load="~ 280K writes/day" tier="secondary" />
              <DependencyTile name="Invoice Generator" load="~ 110K reads/day" tier="secondary" />
              <DependencyTile name="Analytics ETL" load="~ 50K reads/day" tier="tertiary" />
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            <CompactStat value="4.4M" label="Writes/day" />
            <CompactStat value="11" label="Days since last incident" tone="emerald" />
            <CompactStat value="99.97%" label="30-day availability" tone="emerald" />
          </div>

          <SourceChipRow sources={[
            { label: "Cosmos · ops dashboard", kind: "doc" },
            { label: `${SESSION.predecessor} interview`, kind: "transcript", ts: "May 14" },
            { label: "Data Platform runbook", kind: "doc" },
          ]} />
        </article>
      </LeftPane>

      <RightStack
        graph={<GlobalGraph focus="cosmos" lens="colleague" mode="browse" />}
        bottom={<ContextPanel reader={SESSION.reader} role={SESSION.readerRole} team={SESSION.readerTeam} />}
      />
    </TwoPaneLayout>
  );
}

function DependencyTile({ name, load, tier }) {
  const tierCfg = {
    primary: "ring-2 ring-indigo-500/20 border-indigo-200",
    secondary: "border-gray-200",
    tertiary: "border-gray-200 opacity-80",
  }[tier];
  return (
    <div className={`rounded-xl bg-white border ${tierCfg} p-3`}>
      <div className="text-[12px] font-semibold text-slate-900 leading-tight">{name}</div>
      <div className="text-[10px] text-slate-500 mt-1" style={{ fontFamily: MONO_STACK }}>{load}</div>
    </div>
  );
}

function CompactStat({ value, label, tone }) {
  const cfg = {
    default: { ring: "border-gray-200", bg: "bg-white", valueCls: "text-slate-900" },
    emerald: { ring: "border-emerald-200", bg: "bg-emerald-50/30", valueCls: "text-emerald-700" },
  }[tone || "default"];
  return (
    <div className={`rounded-xl bg-white/80 backdrop-blur-md border ${cfg.ring} px-3 py-2.5`}>
      <div className={`text-lg font-extrabold ${cfg.valueCls} tracking-tight leading-none`} style={{ fontFamily: MONO_STACK }}>{value}</div>
      <div className="text-[10px] text-slate-500 mt-1">{label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Global Knowledge Graph · Colleague RBAC lens
   Same graph the Newcomer + Manager see · different visibility set
   ═══════════════════════════════════════════════════════════════════ */

function GlobalGraph({ focus, lens, mode, lockHeavy }) {
  // Focus-driven layouts · Atlas-centered (default) or Cosmos-centered (S8)
  const atlasNodes = [
    { id: "atlas", label: "Project Atlas", kind: "project", x: 300, y: 210, primary: focus === "atlas" },
    { id: "cosmos", label: "Cosmos partition", kind: "service", x: 130, y: 130, canonical: true, ownedByYou: true },
    { id: "minh", label: "Minh Le", handle: "@minh.le", kind: "person", x: 130, y: 290 },
    { id: "payment-gateway", label: "Payment Gateway", kind: "service", x: 470, y: 130, canonical: true },
    { id: "atlas-wiki", label: "Atlas wiki v2.3", kind: "doc", x: 300, y: 60, contested: true },
    { id: "incident", label: "INC-2942", kind: "incident", x: 300, y: 360 },
    { id: "datadog", label: "Datadog · alerts", kind: "service", x: 470, y: 290 },
    // Locked nodes (Tier 1 stubs · visible but content withheld)
    { id: "comp-fw", label: "Compensation FW", kind: "lock", x: 560, y: 60, tier1: true, hidden: !lockHeavy },
    { id: "succession", label: "Succession plan", kind: "lock", x: 560, y: 360, tier1: true, hidden: !lockHeavy },
    { id: "comp-detail", label: "Comp details", kind: "lock", x: 40, y: 60, tier1: true, hidden: !lockHeavy },
  ];

  const cosmosNodes = [
    { id: "cosmos", label: "Cosmos partition", kind: "service", x: 300, y: 210, primary: true, canonical: true, ownedByYou: true },
    { id: "atlas", label: "Project Atlas", kind: "project", x: 130, y: 130 },
    { id: "order-recon", label: "Order Recon", kind: "service", x: 470, y: 130, ownedByYou: true },
    { id: "invoice-gen", label: "Invoice Gen", kind: "service", x: 130, y: 290 },
    { id: "etl", label: "Analytics ETL", kind: "service", x: 470, y: 290 },
    { id: "runbook", label: "Data Platform runbook", kind: "doc", x: 300, y: 60, canonical: true },
    { id: "ops-dash", label: "Ops dashboard", kind: "doc", x: 300, y: 360 },
    { id: "minh", label: "Minh Le", handle: "@minh.le", kind: "person", x: 40, y: 210 },
    { id: "duy", label: "You · Duy", handle: "@duy.nguyen", kind: "person-self", x: 560, y: 210 },
  ];

  const nodes = focus === "cosmos" ? cosmosNodes : atlasNodes;

  const atlasEdges = [
    { from: "atlas", to: "cosmos", label: "writes to" },
    { from: "atlas", to: "minh", label: "owned by" },
    { from: "atlas", to: "payment-gateway", label: "depends on" },
    { from: "atlas", to: "atlas-wiki", label: "documented in" },
    { from: "atlas", to: "incident", label: "incident · last Q3" },
    { from: "atlas", to: "datadog" },
    { from: "minh", to: "comp-fw", dashed: true, locked: true },
    { from: "atlas", to: "succession", dashed: true, locked: true },
    { from: "comp-detail", to: "minh", dashed: true, locked: true },
  ];

  const cosmosEdges = [
    { from: "cosmos", to: "atlas", label: "read by" },
    { from: "cosmos", to: "order-recon", label: "read by" },
    { from: "cosmos", to: "invoice-gen", label: "read by" },
    { from: "cosmos", to: "etl", label: "read by" },
    { from: "cosmos", to: "runbook", label: "documented in" },
    { from: "cosmos", to: "ops-dash", label: "monitored in" },
    { from: "cosmos", to: "duy", label: "owned by" },
    { from: "atlas", to: "minh", label: "owned by" },
  ];

  const edges = focus === "cosmos" ? cosmosEdges : atlasEdges;
  const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]));
  const visibleNodes = nodes.filter(n => !n.hidden);

  return (
    <div className="relative h-full">
      <GraphHeader lens={lens} mode={mode} lockHeavy={lockHeavy} />

      <div className="absolute inset-0 top-[44px]">
        <svg viewBox="0 0 600 420" className="w-full h-full">
          {/* edges */}
          <g>
            {edges.map((edge, i) => {
              const from = nodeById[edge.from];
              const to = nodeById[edge.to];
              if (!from || !to || from.hidden || to.hidden) return null;
              const stroke = edge.locked ? "#fbbf24" : "#cbd5e1";
              return (
                <line
                  key={i}
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={stroke}
                  strokeWidth={1}
                  strokeDasharray={edge.dashed ? "3,3" : ""}
                />
              );
            })}
          </g>

          {/* nodes */}
          <g>
            {visibleNodes.map((n) => (
              <GraphNode
                key={n.id}
                node={n}
                isPrimary={n.primary}
                isFocus={focus === n.id}
                ownedByYou={n.ownedByYou}
              />
            ))}
          </g>
        </svg>
      </div>

      <GraphFooter lens={lens} lockHeavy={lockHeavy} />
    </div>
  );
}

function GraphHeader({ lens, mode, lockHeavy }) {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 px-3 py-2 flex items-center justify-between gap-2 border-b border-gray-100 bg-white/70 backdrop-blur-sm rounded-t-2xl">
      <div className="flex items-center gap-2">
        <Network className="w-3.5 h-3.5 text-indigo-700" strokeWidth={2} />
        <span className="text-[11px] font-semibold text-slate-900">Knowledge graph</span>
        <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">Colleague lens</span>
        {lockHeavy && (
          <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700">3 locks visible</span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <ViewModeChip label="Single-question focus" active />
        <ViewModeChip label="Browse" />
        <ViewModeChip label="Cross-team" locked />
      </div>
    </div>
  );
}

function ViewModeChip({ label, active, locked }) {
  const cls = active
    ? "bg-indigo-100 text-indigo-700 border-indigo-200"
    : locked
    ? "bg-gray-50 text-slate-400 border-gray-200 cursor-not-allowed"
    : "bg-white text-slate-500 border-gray-200 hover:border-indigo-300 hover:text-slate-700";
  return (
    <button className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border transition-colors ${cls}`}>
      {locked && <Lock className="w-2.5 h-2.5 inline-block mr-1" strokeWidth={2} />}
      {label}
    </button>
  );
}

function GraphFooter({ lockHeavy }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 px-3 py-1.5 border-t border-gray-100 bg-white/70 backdrop-blur-sm rounded-b-2xl flex items-center justify-between gap-2">
      <div className="flex items-center gap-3 text-[9px] text-slate-500">
        <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Service</span>
        <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded border border-emerald-500" /> Canonical</span>
        <span className="inline-flex items-center gap-1"><Lock className="w-2 h-2 text-yellow-700" strokeWidth={2.5} /> Tier 1</span>
        <span className="inline-flex items-center gap-1 text-slate-400 italic"><ShieldOff className="w-2 h-2" strokeWidth={2} /> Tier 2 · ghosted</span>
      </div>
      <div className="flex items-center gap-1">
        <button className="p-1 rounded text-slate-400 hover:text-slate-700"><ZoomIn className="w-3 h-3" /></button>
        <button className="p-1 rounded text-slate-400 hover:text-slate-700"><Maximize2 className="w-3 h-3" /></button>
        <span className="text-[9px] text-slate-400 ml-1 px-1.5 py-0.5 rounded border border-gray-200" style={{ fontFamily: MONO_STACK }}>{lockHeavy ? "10 visible · 3 locked" : "7 visible · 2 hinted"}</span>
      </div>
    </div>
  );
}

function GraphNode({ node, isPrimary, isFocus, ownedByYou }) {
  if (node.kind === "lock") {
    return (
      <g>
        <g transform={`translate(${node.x}, ${node.y})`}>
          <rect x={-30} y={-18} width={60} height={36} rx={8} fill="#fffbeb" stroke="#fbbf24" strokeWidth={1.25} strokeDasharray="2,2" />
          <foreignObject x={-28} y={-16} width={56} height={32}>
            <div className="w-full h-full flex flex-col items-center justify-center gap-0.5">
              <Lock className="w-3 h-3 text-yellow-700" strokeWidth={2} />
              <span className="text-[8px] font-semibold text-yellow-800 leading-none">Locked</span>
            </div>
          </foreignObject>
        </g>
        <text x={node.x} y={node.y + 30} textAnchor="middle" className="text-[8px] fill-slate-500 italic" style={{ fontFamily: FONT_STACK, fontWeight: 600 }}>{node.label}</text>
      </g>
    );
  }

  const config = {
    project: { fill: "#EEF0FF", stroke: "#6366F1", textColor: "#1e1b4b", radius: 32 },
    "person-self": { fill: "#dcfce7", stroke: "#10b981", textColor: "#064e3b", radius: 22 },
    person: { fill: "#ede9fe", stroke: "#a78bfa", textColor: "#4c1d95", radius: 22 },
    service: { fill: node.canonical ? "#ecfdf5" : "#f1f5f9", stroke: node.canonical ? "#10b981" : "#94a3b8", textColor: "#0f172a", radius: 22 },
    doc: { fill: node.contested ? "#fef9c3" : (node.canonical ? "#ecfdf5" : "#ffffff"), stroke: node.contested ? "#eab308" : (node.canonical ? "#10b981" : "#cbd5e1"), textColor: "#0f172a", radius: 20 },
    incident: { fill: "#fff1f2", stroke: "#f43f5e", textColor: "#881337", radius: 22 },
  }[node.kind] || { fill: "#fff", stroke: "#cbd5e1", textColor: "#475569", radius: 20 };

  const finalRadius = isPrimary ? 36 : config.radius;
  const finalStroke = isFocus ? "#6366F1" : config.stroke;
  const finalStrokeWidth = isFocus || isPrimary ? 2 : 1;

  return (
    <g>
      {ownedByYou && (
        <circle cx={node.x} cy={node.y} r={finalRadius + 6} fill="#10b981" opacity={0.08} />
      )}
      {isFocus && (
        <circle cx={node.x} cy={node.y} r={finalRadius + 6} fill={config.stroke} opacity={0.12} />
      )}
      <circle cx={node.x} cy={node.y} r={finalRadius} fill={config.fill} stroke={finalStroke} strokeWidth={finalStrokeWidth} />
      {node.canonical && (
        <circle cx={node.x + finalRadius - 6} cy={node.y - finalRadius + 6} r={5} fill="#10b981" stroke="#fff" strokeWidth={1.5} />
      )}
      {node.contested && (
        <circle cx={node.x + finalRadius - 6} cy={node.y - finalRadius + 6} r={5} fill="#eab308" stroke="#fff" strokeWidth={1.5} />
      )}
      {ownedByYou && (
        <circle cx={node.x - finalRadius + 6} cy={node.y - finalRadius + 6} r={4} fill="#10b981" stroke="#fff" strokeWidth={1.5} />
      )}
      <text
        x={node.x}
        y={node.y + 4}
        textAnchor="middle"
        className="text-[10px]"
        style={{ fontFamily: FONT_STACK, fontWeight: isPrimary ? 700 : 600, fill: config.textColor }}
      >
        {node.label.length > 14 ? node.label.slice(0, 12) + "…" : node.label}
      </text>
      {node.handle && (
        <text x={node.x} y={node.y + finalRadius + 14} textAnchor="middle" className="text-[8px]" style={{ fontFamily: MONO_STACK, fill: "#64748b" }}>{node.handle}</text>
      )}
    </g>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Two-pane layout + shared primitives
   ═══════════════════════════════════════════════════════════════════ */

function TwoPaneLayout({ children }) {
  return <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-6">{children}</div>;
}

function LeftPane({ children }) {
  return <div className="min-w-0">{children}</div>;
}

function RightStack({ graph, bottom }) {
  return (
    <aside className="flex flex-col gap-4 self-start lg:sticky lg:top-[180px]">
      <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg shadow-indigo-900/[0.04] h-[420px] relative overflow-hidden">
        {graph}
      </div>
      <div>{bottom}</div>
    </aside>
  );
}

function EyebrowPill({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] font-semibold text-indigo-700">
      {children}
    </span>
  );
}

function PrimaryButton({ children }) {
  return (
    <button className="h-9 px-4 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-sm font-semibold inline-flex items-center gap-1.5 shadow-md shadow-indigo-900/10 hover:brightness-110 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/40">
      {children}
    </button>
  );
}

function SecondaryButton({ children }) {
  return (
    <button className="h-9 px-3.5 rounded-xl bg-white border border-gray-200 text-slate-700 text-sm font-medium inline-flex items-center gap-1.5 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
      {children}
    </button>
  );
}

function SecondaryButtonSm({ children }) {
  return (
    <button className="h-7 px-2.5 rounded-lg bg-white border border-gray-200 text-slate-700 text-[11px] font-medium inline-flex items-center gap-1 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
      {children}
    </button>
  );
}
