"use client";

import React, { useState } from "react";
import {
  ChevronLeft, ChevronRight, Sparkles, Network, MessageSquare,
  Lock, Eye, KeyRound, Send, Search, Bell, HelpCircle,
  ChevronDown, ChevronUp, ArrowUpRight, Check, X, AlertTriangle,
  AlertOctagon, Info, Tag, Hash, FileText, GitBranch, Folder,
  Calendar, ArrowRight, Plus, Maximize2, ZoomIn, Minus,
  Clock, BookOpen, ChevronsRight, Cpu, Award, Bookmark,
  ShieldOff, Users, Compass, Filter, History, Flame,
  Activity, BarChart3, TrendingUp, ShieldCheck, FileCheck,
  Crosshair, Layers, Radio, Zap, RotateCcw, Edit3,
  ThumbsUp, ThumbsDown, MoreHorizontal, GitMerge, Settings,
  Bell as BellIcon, ShieldAlert, Hourglass
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   UC-ON-02 · Consumer · MANAGER · Sprint 4 · Consumption plane

   Ha Vy's Manager view of the global Knowledge Graph. The same graph
   the Newcomer and Colleague see · richer permissions, richer
   affordances. Manager-only patterns:

     · Timeline scrub · drag through history to see what changed
     · Heatmap overlay · interaction-level visualization
     · UC-HO-06 / UC-HO-07 actions · review hallucination reports
       + sign off on Knowledge Graph corrections
     · Lineage drawer (CL-085) · 4-event timeline per node
     · Critical-path Manager alerts (CL-095) · real-time for [Risk]/
       [Finance] tagged nodes · batch for everything else
     · Full team scope + cross-team Canonical visibility · few locks

   MASTER.md "AI-Native Minimal" design language per CL-096.
   Semantic palette (rose / yellow / emerald / violet) preserved.

   Honors:
     · CL-091 Trello as POC source · 4-layer hard-filter contract
     · CL-093 Manager sees more (team scope) · still gated for
              cross-team Tier 1 (e.g. People Ops)
     · CL-094 Progressive Disclosure · Timeline + Heatmap split-
              screen for historical visualization
     · CL-095 Critical/Batch triage routing · QA-INT-01 §1.4
              commit gate preserved
     · CL-096 MASTER.md indigo / glassmorphism design system
     · CL-097 English-only · latinized usernames

   8 clickable states walk the Manager's review cycle:

     S1 · Arrival · team scope · Timeline at "now"
     S2 · Heatmap overlay · interaction-frequency heatmap
     S3 · Timeline drag · rewound 2 weeks · ghost view
     S4 · Contested flag drill-down · CL-095 grammar
     S5 · UC-HO-07 correction approval · side-by-side diff
     S6 · Lineage drawer · CL-085 4-event timeline
     S7 · Critical alert · [Risk] flagged · real-time path
     S8 · Approved + signed · audit log entry · graph updated
   ═══════════════════════════════════════════════════════════════════ */

const FLOW = [
  { id: "s1", uc: "Step 1", label: "Arrival · team scope · 'now'",        trigger: "Ha Vy lands at /knowledge-graph from her dashboard's 'Explore the graph' CTA · Timeline anchored at today." },
  { id: "s2", uc: "Step 2", label: "Heatmap overlay · activity",          trigger: "Ha Vy toggled the Heatmap layer · warm zones reveal where her team is reading/editing the most." },
  { id: "s3", uc: "Step 3", label: "Timeline drag · 2 weeks ago",         trigger: "Ha Vy dragged the Timeline back · graph reflects state from 2 weeks ago · new ghost edges + missing nodes." },
  { id: "s4", uc: "Step 4", label: "Contested flag drill-down",           trigger: "Clicked a yellow-flagged node · side panel shows who flagged + the colleague's reason + AI recommendation." },
  { id: "s5", uc: "Step 5", label: "UC-HO-07 correction approval",        trigger: "Ha Vy reviews a proposed correction · side-by-side diff per CL-086 · sign-off gate preserved per QA-INT-01 §1.4." },
  { id: "s6", uc: "Step 6", label: "Lineage drawer · 4 events",           trigger: "Clicked a Canonical badge · CL-085 LineageDrawer · Created → Verified → Committed → Propagated." },
  { id: "s7", uc: "Step 7", label: "Critical alert · [Risk] flagged",     trigger: "Real-time alert per CL-095 Critical path · a [Risk]-tagged node was flagged · Ha Vy needs to review NOW." },
  { id: "s8", uc: "Step 8", label: "Approved + signed · graph updated",   trigger: "After sign-off · graph reflects the correction · audit log entry created · propagation downstream." },
];

const SESSION = {
  reader: "Ha Vy",
  readerInitials: "HV",
  readerHandle: "@ha.vy",
  readerRole: "Engineering Manager",
  readerTeam: "Platform · Engineering",
  predecessor: "Minh Le",
  predecessorHandle: "@minh.le",
  flagger: "Duy Nguyen",
  flaggerHandle: "@duy.nguyen",
  flaggerTeam: "Data Platform",
  successor: "Tran Huu Nam",
};

const FONT_STACK = 'Inter, "Geist", "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';
const MONO_STACK = 'ui-monospace, "Geist Mono", "JetBrains Mono", Menlo, monospace';

export default function UCON02ConsumerManager() {
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
          <span className="text-slate-500 text-xs">UC-ON-02 · Manager · Consumer plane</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          <span className="uppercase tracking-wider font-semibold text-indigo-700">AI-Native Minimal · Manager lens</span>
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
  if (id === "s1") return <ManagerShell><S1Arrival /></ManagerShell>;
  if (id === "s2") return <ManagerShell><S2Heatmap /></ManagerShell>;
  if (id === "s3") return <ManagerShell><S3TimelineDrag /></ManagerShell>;
  if (id === "s4") return <ManagerShell><S4ContestedDrill /></ManagerShell>;
  if (id === "s5") return <ManagerShell><S5CorrectionApproval /></ManagerShell>;
  if (id === "s6") return <ManagerShell><S6LineageDrawer /></ManagerShell>;
  if (id === "s7") return <ManagerShell><S7CriticalAlert /></ManagerShell>;
  if (id === "s8") return <ManagerShell><S8AfterSignoff /></ManagerShell>;
  return null;
}

/* ═══════════════════════════════════════════════════════════════════
   ManagerShell · floating navbar with Manager-specific affordances
   ═══════════════════════════════════════════════════════════════════ */

function ManagerShell({ children }) {
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
          <a href="#" className="text-[12px] font-medium text-slate-500 hover:text-slate-900 transition-colors">Dashboard</a>
          <a href="#" className="text-[12px] font-medium text-indigo-700">Knowledge graph</a>
          <a href="#" className="text-[12px] font-medium text-slate-500 hover:text-slate-900 transition-colors">Audit log</a>
          <a href="#" className="text-[12px] font-medium text-slate-500 hover:text-slate-900 transition-colors">Sessions</a>
        </div>

        <div className="flex items-center gap-2">
          <ScopeChip />
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-slate-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 relative">
            <Bell className="w-4 h-4" strokeWidth={1.75} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-slate-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
            <Settings className="w-4 h-4" strokeWidth={1.75} />
          </button>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <div className="flex items-center gap-2 pl-1">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 border border-white shadow-sm flex items-center justify-center">
              <span className="text-[10px] font-semibold text-white">{SESSION.readerInitials}</span>
            </div>
            <div className="hidden md:flex flex-col leading-tight">
              <span className="text-[11px] font-semibold text-slate-900">{SESSION.reader}</span>
              <span className="text-[9px] text-slate-500" style={{ fontFamily: MONO_STACK }}>{SESSION.readerHandle} · Manager</span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

function ScopeChip() {
  return (
    <button className="hidden md:flex items-center gap-1.5 h-8 px-2.5 rounded-xl bg-violet-50 border border-violet-200 transition-colors hover:bg-violet-100">
      <ShieldCheck className="w-3 h-3 text-violet-700" strokeWidth={2.5} />
      <span className="text-[10px] uppercase tracking-wider font-semibold text-violet-700">Manager scope</span>
      <ChevronDown className="w-3 h-3 text-violet-700" strokeWidth={2} />
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Shared layout primitives for Manager states
   ═══════════════════════════════════════════════════════════════════ */

function ThreeColumnLayout({ left, center, right }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_320px] gap-4">
      <aside className="lg:sticky lg:top-[180px] self-start">{left}</aside>
      <div className="min-w-0">{center}</div>
      <aside className="lg:sticky lg:top-[180px] self-start">{right}</aside>
    </div>
  );
}

function InsightsBar({ items, current, view }) {
  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <div className="flex items-center gap-2">
          <EyebrowPill>
            <Crosshair className="w-3 h-3" strokeWidth={2.5} />
            {view || "Team scope · Engineering · Platform"}
          </EyebrowPill>
          {current && (
            <span className="text-[10px] text-slate-500 inline-flex items-center gap-1">
              <Clock className="w-3 h-3" strokeWidth={2} />
              <span style={{ fontFamily: MONO_STACK }}>{current}</span>
            </span>
          )}
        </div>
        <button className="text-[10px] text-indigo-700 hover:text-indigo-900 font-semibold inline-flex items-center gap-1 cursor-pointer">
          <BarChart3 className="w-3 h-3" strokeWidth={2} />
          View team report
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((it, i) => (
          <KPITile key={i} {...it} />
        ))}
      </div>
    </div>
  );
}

function KPITile({ value, label, sublabel, icon: Icon, tone, alert }) {
  const cfg = {
    default: { ring: "border-gray-200", valueCls: "text-slate-900", iconBg: "bg-gray-100 text-slate-600" },
    emerald: { ring: "border-emerald-200/60", valueCls: "text-emerald-700", iconBg: "bg-emerald-50 text-emerald-700" },
    yellow: { ring: "border-yellow-200/60", valueCls: "text-yellow-700", iconBg: "bg-yellow-50 text-yellow-700" },
    rose: { ring: "border-rose-200/60", valueCls: "text-rose-700", iconBg: "bg-rose-50 text-rose-700" },
    indigo: { ring: "border-indigo-200/60", valueCls: "text-indigo-700", iconBg: "bg-indigo-50 text-indigo-700" },
  }[tone || "default"];
  return (
    <div className={`rounded-xl bg-white border ${cfg.ring} px-3 py-2.5 relative`}>
      {alert && <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-rose-500 ring-2 ring-white" />}
      <div className="flex items-start gap-2.5">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cfg.iconBg}`}>
          <Icon className="w-3.5 h-3.5" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-xl font-extrabold ${cfg.valueCls} tracking-tight leading-none`} style={{ fontFamily: MONO_STACK }}>{value}</div>
          <div className="text-[11px] font-semibold text-slate-700 mt-1 leading-tight">{label}</div>
          {sublabel && <div className="text-[9px] text-slate-500 mt-0.5 leading-snug">{sublabel}</div>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S1 · Arrival · team scope · Timeline at "now"
   ═══════════════════════════════════════════════════════════════════ */

function S1Arrival() {
  return (
    <>
      <InsightsBar
        current="now · live"
        items={[
          { value: "47", label: "Nodes in team scope", sublabel: "+ 23 cross-team Canonical visible", icon: Network, tone: "indigo" },
          { value: "12", label: "Canonical facts", sublabel: "Stable · 2 awaiting propagation", icon: Award, tone: "emerald" },
          { value: "3", label: "Contested flags", sublabel: "Awaiting your review", icon: AlertTriangle, tone: "yellow", alert: true },
          { value: "2", label: "Pending sign-offs", sublabel: "From UC-HO-06 reports", icon: FileCheck, tone: "rose", alert: true },
        ]}
      />

      <ThreeColumnLayout
        left={<ManagerActionsPanel state="s1" />}
        center={
          <div className="space-y-4">
            <GraphCard>
              <ManagerGraph mode="default" view="now" />
            </GraphCard>
            <TimelineRibbon position="now" />
          </div>
        }
        right={<HotSpotsPanel />}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S2 · Heatmap overlay activated
   ═══════════════════════════════════════════════════════════════════ */

function S2Heatmap() {
  return (
    <>
      <InsightsBar
        current="now · live"
        items={[
          { value: "47", label: "Nodes · team scope", sublabel: "Heatmap layer active", icon: Network, tone: "indigo" },
          { value: "Atlas", label: "Hottest area", sublabel: "Read 142x this week · 11 edits", icon: Flame, tone: "rose" },
          { value: "Vendor XYZ", label: "Cooling fast", sublabel: "60% drop in reads vs last month", icon: TrendingUp, tone: "indigo" },
          { value: "Comp · Legal", label: "Cold zone", sublabel: "Healthy · low activity expected", icon: ShieldCheck, tone: "emerald" },
        ]}
      />

      <ThreeColumnLayout
        left={<ManagerActionsPanel state="s2" />}
        center={
          <div className="space-y-4">
            <GraphCard>
              <ManagerGraph mode="heatmap" view="now" />
            </GraphCard>
            <TimelineRibbon position="now" />
          </div>
        }
        right={<HeatmapInsightsPanel />}
      />
    </>
  );
}

function HeatmapInsightsPanel() {
  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <Flame className="w-3.5 h-3.5 text-rose-600" strokeWidth={2} />
        <h3 className="text-sm font-semibold text-slate-900">Heatmap insights</h3>
        <span className="ml-auto text-[10px] text-slate-500" style={{ fontFamily: MONO_STACK }}>last 7d</span>
      </div>

      <div className="p-4 space-y-3">
        <HeatRow
          label="Atlas + Payment Gateway"
          intensity="warm"
          metric="142 reads · 11 edits · 4 new flags"
          insight={`Your team is leaning hard on Atlas — likely because ${SESSION.successor}'s onboarding is in week 2.`}
        />
        <HeatRow
          label="Cosmos partition cluster"
          intensity="medium"
          metric="68 reads · 2 edits"
          insight="Healthy cross-team interest. Duy Nguyen's team consuming · expected."
        />
        <HeatRow
          label="Vendor XYZ subtree"
          intensity="cool"
          metric="14 reads · 0 edits"
          insight={`Cooling — ${SESSION.predecessor}'s renewal context is reaching steady state.`}
        />
        <HeatRow
          label="Comp framework v3"
          intensity="cold"
          metric="Locked to most readers"
          insight="Tier 1 lock pattern · low traffic is expected and correct."
        />
      </div>

      <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <span className="text-[10px] text-slate-500 inline-flex items-center gap-1">
          <Layers className="w-2.5 h-2.5" strokeWidth={2} />
          Toggle layers
        </span>
        <div className="flex items-center gap-1">
          <LayerToggle label="Heat" active />
          <LayerToggle label="Edits" />
          <LayerToggle label="Flags" />
        </div>
      </div>
    </div>
  );
}

function HeatRow({ label, intensity, metric, insight }) {
  const cfg = {
    warm: { bar: "from-rose-500 to-rose-300", w: "w-[88%]", text: "text-rose-700" },
    medium: { bar: "from-yellow-500 to-yellow-300", w: "w-[55%]", text: "text-yellow-700" },
    cool: { bar: "from-indigo-400 to-indigo-200", w: "w-[28%]", text: "text-indigo-700" },
    cold: { bar: "from-slate-300 to-slate-200", w: "w-[8%]", text: "text-slate-500" },
  }[intensity];
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[12px] font-semibold text-slate-900 truncate">{label}</span>
        <span className={`text-[9px] uppercase tracking-wider font-semibold ${cfg.text}`}>{intensity}</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${cfg.bar} ${cfg.w} rounded-full`} />
      </div>
      <div className="text-[10px] text-slate-500" style={{ fontFamily: MONO_STACK }}>{metric}</div>
      <p className="text-[10px] text-slate-600 leading-snug italic">{insight}</p>
    </div>
  );
}

function LayerToggle({ label, active }) {
  return (
    <button className={`h-6 px-2 rounded-md text-[9px] uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
      active ? "bg-rose-100 text-rose-700 border border-rose-200" : "bg-white text-slate-500 border border-gray-200 hover:border-rose-300"
    }`}>
      {label}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S3 · Timeline drag · rewound 2 weeks · ghost view
   ═══════════════════════════════════════════════════════════════════ */

function S3TimelineDrag() {
  return (
    <>
      <InsightsBar
        view="Team scope · viewing 2 weeks ago"
        current="May 23, 2026 · 09:14"
        items={[
          { value: "38", label: "Nodes (2w ago)", sublabel: "9 fewer than today", icon: Network, tone: "indigo" },
          { value: "8", label: "Canonical (2w ago)", sublabel: "4 added since · 0 removed", icon: Award, tone: "emerald" },
          { value: "1", label: "Contested (2w ago)", sublabel: "vs 3 today · trending up", icon: AlertTriangle, tone: "yellow" },
          { value: "0", label: "Sign-offs pending", sublabel: "vs 2 today", icon: FileCheck, tone: "default" },
        ]}
      />

      <ThreeColumnLayout
        left={<ManagerActionsPanel state="s3" />}
        center={
          <div className="space-y-4">
            <RewoundBanner />
            <GraphCard>
              <ManagerGraph mode="rewound" view="2w-ago" />
            </GraphCard>
            <TimelineRibbon position="2w-ago" />
          </div>
        }
        right={<ChangesSincePanel />}
      />
    </>
  );
}

function RewoundBanner() {
  return (
    <div className="rounded-2xl bg-yellow-50/60 border-2 border-yellow-200 p-3 flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-white border border-yellow-300 flex items-center justify-center shrink-0">
        <History className="w-4 h-4 text-yellow-700" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-slate-900">You're looking at the graph from 2 weeks ago</h3>
        <p className="text-[11px] text-slate-600 leading-snug">
          Drag the Timeline back to "now" to return to live view. Read-only · changes from then can't be made now.
        </p>
      </div>
      <button className="h-8 px-3 rounded-lg bg-white border border-gray-200 text-slate-700 text-[11px] font-medium inline-flex items-center gap-1.5 hover:bg-gray-50 transition-colors">
        <RotateCcw className="w-3 h-3" strokeWidth={2} />
        Back to now
      </button>
    </div>
  );
}

function ChangesSincePanel() {
  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <GitMerge className="w-3.5 h-3.5 text-indigo-700" strokeWidth={2} />
        <h3 className="text-sm font-semibold text-slate-900">Changes since this point</h3>
        <span className="ml-auto text-[10px] text-slate-500" style={{ fontFamily: MONO_STACK }}>14 events</span>
      </div>

      <div className="p-3 space-y-0">
        <ChangeEvent
          icon={Plus}
          label="9 nodes added"
          detail={`${SESSION.predecessor}'s interview committed · added Atlas rollback canonical, Payment Gateway timeout fix, 7 other entries.`}
          when="May 27"
          tone="emerald"
        />
        <ChangeEvent
          icon={Edit3}
          label="3 nodes promoted"
          detail="Verified → Canonical for Atlas rollback, Cosmos partition spec, Vendor XYZ SLA penalty clause."
          when="May 30"
          tone="indigo"
        />
        <ChangeEvent
          icon={AlertTriangle}
          label="2 contested flags raised"
          detail="Duy flagged the Atlas wiki rollback section. Tran flagged a typo in Payment Gateway summary."
          when="Jun 2"
          tone="yellow"
        />
        <ChangeEvent
          icon={FileCheck}
          label="1 sign-off · Vendor XYZ correction"
          detail="You approved Tran's UC-HO-06 report · propagated to 4 downstream nodes."
          when="Jun 3"
          tone="emerald"
        />
        <ChangeEvent
          icon={AlertOctagon}
          label="1 critical alert (resolved)"
          detail="A [Risk]-tagged node was flagged · you signed off within 4h."
          when="Jun 4"
          tone="rose"
          last
        />
      </div>
    </div>
  );
}

function ChangeEvent({ icon: Icon, label, detail, when, tone, last }) {
  const cfg = {
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    rose: "bg-rose-50 border-rose-200 text-rose-700",
  }[tone];
  return (
    <div className={`flex items-start gap-2.5 py-2 ${!last ? "border-b border-gray-100" : ""}`}>
      <div className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${cfg}`}>
        <Icon className="w-3 h-3" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[11px] font-semibold text-slate-900 truncate">{label}</span>
          <span className="text-[9px] text-slate-500 shrink-0" style={{ fontFamily: MONO_STACK }}>{when}</span>
        </div>
        <p className="text-[10px] text-slate-600 leading-snug mt-0.5">{detail}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S4 · Contested flag drill-down · CL-095 grammar
   ═══════════════════════════════════════════════════════════════════ */

function S4ContestedDrill() {
  return (
    <>
      <InsightsBar
        current="now · live"
        items={[
          { value: "47", label: "Nodes · team scope", icon: Network, tone: "indigo" },
          { value: "12", label: "Canonical · stable", icon: Award, tone: "emerald" },
          { value: "3", label: "Contested · 1 selected", icon: AlertTriangle, tone: "yellow", alert: true },
          { value: "2", label: "Sign-offs pending", icon: FileCheck, tone: "rose", alert: true },
        ]}
      />

      <ThreeColumnLayout
        left={<ManagerActionsPanel state="s4" />}
        center={
          <div className="space-y-4">
            <GraphCard>
              <ManagerGraph mode="contested-focus" view="now" focusNode="atlas-wiki" />
            </GraphCard>
            <TimelineRibbon position="now" />
          </div>
        }
        right={<ContestedDrillPanel />}
      />
    </>
  );
}

function ContestedDrillPanel() {
  return (
    <div className="rounded-2xl bg-white/90 backdrop-blur-md border-2 border-yellow-200 shadow-xl shadow-yellow-900/[0.04] overflow-hidden">
      <div className="px-4 py-3 border-b border-yellow-100 bg-yellow-50/40 flex items-center gap-2">
        <AlertTriangle className="w-3.5 h-3.5 text-yellow-700" strokeWidth={2} />
        <h3 className="text-sm font-semibold text-slate-900">Contested · Atlas wiki rollback</h3>
        <span className="ml-auto text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-yellow-100 border border-yellow-300 text-yellow-800">Batch · weekly</span>
      </div>

      <div className="p-4 space-y-3 max-h-[460px] overflow-y-auto">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-1.5">Flagged by</div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <span className="text-[10px] font-semibold text-white">DN</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-semibold text-slate-900">{SESSION.flagger}</div>
              <div className="text-[10px] text-slate-500" style={{ fontFamily: MONO_STACK }}>{SESSION.flaggerHandle} · {SESSION.flaggerTeam}</div>
            </div>
            <span className="text-[9px] text-slate-500" style={{ fontFamily: MONO_STACK }}>2h ago</span>
          </div>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-1.5">Their reason</div>
          <blockquote className="rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5 text-[12px] text-slate-700 leading-relaxed italic">
            "The wiki says 'snapshot, deploy, verify' but the team agreement (since INC-2942) is to always go through staging first. The wiki is outdated. {SESSION.predecessor} confirmed this in his interview but the wiki entry was never updated. Anyone following the wiki literally would break production."
          </blockquote>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-1.5">AI's recommendation</div>
          <div className="rounded-xl bg-indigo-50/40 border border-indigo-100 px-3 py-2.5">
            <div className="flex items-start gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" strokeWidth={2} />
              <p className="text-[12px] text-slate-700 leading-relaxed">
                <strong>Promote the corrected rollback procedure to Canonical, deprecate the wiki section.</strong> 4 independent signals support {SESSION.flagger}'s claim:
              </p>
            </div>
            <ul className="space-y-1.5 ml-5 mb-2">
              <li className="flex items-start gap-2 text-[11px]">
                <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                <span className="text-slate-700"><strong>{SESSION.predecessor}'s interview</strong> · transcript 09:14–12:42 · explicit on staging-first</span>
              </li>
              <li className="flex items-start gap-2 text-[11px]">
                <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                <span className="text-slate-700"><strong>INC-2942 post-mortem</strong> · root cause was skipping staging</span>
              </li>
              <li className="flex items-start gap-2 text-[11px]">
                <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                <span className="text-slate-700"><strong>3 recent successful rollbacks</strong> · all went through staging</span>
              </li>
              <li className="flex items-start gap-2 text-[11px]">
                <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                <span className="text-slate-700"><strong>Team Slack consensus</strong> · 7 engineers agreed on Mar 12</span>
              </li>
            </ul>
            <div className="pt-2 border-t border-indigo-100 text-[10px] text-slate-500 inline-flex items-center gap-1.5">
              <Sparkles className="w-2.5 h-2.5 text-indigo-500" strokeWidth={2} />
              Confidence · 92% · Worker SLM resolved this without escalating to Expert LLM
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-rose-50/40 border border-rose-200 px-3 py-2.5 flex items-start gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-700 shrink-0 mt-0.5" strokeWidth={2} />
          <p className="text-[11px] text-rose-900/90 leading-relaxed">
            <strong>QA-INT-01 §1.4 commit gate applies.</strong> Your sign-off is required before the wiki's old text is deprecated and the new canonical entry propagates. The contested flag remains visible to all readers until you decide.
          </p>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button className="flex-1 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-[12px] font-semibold inline-flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 transition-all cursor-pointer">
            <Edit3 className="w-3 h-3" strokeWidth={2} />
            Review the correction
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button className="h-7 rounded-lg bg-white border border-gray-200 text-slate-600 text-[10px] font-medium inline-flex items-center justify-center gap-1 hover:bg-gray-50 transition-colors cursor-pointer">
            <ThumbsDown className="w-3 h-3" />
            Dismiss flag
          </button>
          <button className="h-7 rounded-lg bg-white border border-gray-200 text-slate-600 text-[10px] font-medium inline-flex items-center justify-center gap-1 hover:bg-gray-50 transition-colors cursor-pointer">
            <Hourglass className="w-3 h-3" />
            Defer to next cycle
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S5 · UC-HO-07 correction approval · side-by-side diff
   ═══════════════════════════════════════════════════════════════════ */

function S5CorrectionApproval() {
  return (
    <div className="space-y-4">
      <ApprovalHeaderCard />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DiffPane
          side="before"
          title="Current · Atlas wiki v2.3"
          tone="rose"
          author="Wiki · last edited 2 weeks ago"
          content={
            <>
              <p className="mb-2">To roll back Project Atlas:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Snapshot the Cosmos partition keyed by <code style={{ fontFamily: MONO_STACK }} className="text-[12px]">org</code>.</li>
                <li className="line-through text-rose-700/80">Run the migration playbook against production.</li>
                <li>Verify schema integrity.</li>
              </ol>
              <p className="mt-2 text-[12px] italic text-rose-700/70">⚠ Step 2 is the contested step.</p>
            </>
          }
        />
        <DiffPane
          side="after"
          title="Proposed · Canonical correction"
          tone="emerald"
          author={`Sourced from ${SESSION.predecessor}'s interview · INC-2942 PM · team Slack consensus`}
          content={
            <>
              <p className="mb-2">To roll back Project Atlas:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Snapshot the Cosmos partition keyed by <code style={{ fontFamily: MONO_STACK }} className="text-[12px]">org</code>.</li>
                <li className="bg-emerald-100/60 -mx-1 px-1 rounded">Run the migration playbook against <strong>staging first</strong>, then promote to production after verification.</li>
                <li>Verify schema integrity, then promote.</li>
              </ol>
              <p className="mt-2 text-[12px] italic text-emerald-700/80">+ Inline note: "Don't deploy on Fridays per team agreement (since INC-2942)."</p>
            </>
          }
        />
      </div>

      <PropagationPreview />

      <ApprovalActionBar />
    </div>
  );
}

function ApprovalHeaderCard() {
  return (
    <div className="rounded-2xl bg-white/90 backdrop-blur-md border-2 border-indigo-200 shadow-xl shadow-indigo-900/[0.06] p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 shadow-sm">
        <FileCheck className="w-5 h-5 text-white" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <EyebrowPill>
          <ShieldCheck className="w-3 h-3" strokeWidth={2.5} />
          UC-HO-07 · Correction approval · QA-INT-01 §1.4
        </EyebrowPill>
        <h2 className="text-lg font-bold text-slate-900 mt-1.5 leading-tight">Atlas rollback procedure · staging-first rule</h2>
        <p className="text-[11px] text-slate-600 mt-0.5">
          Flagged by {SESSION.flagger} · 2h ago · AI confidence 92% · 4 supporting sources · awaiting your sign-off.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <SecondaryButtonSm><Search className="w-3 h-3" />View in graph</SecondaryButtonSm>
        <SecondaryButtonSm><MoreHorizontal className="w-3 h-3" /></SecondaryButtonSm>
      </div>
    </div>
  );
}

function DiffPane({ side, title, tone, author, content }) {
  const cfg = {
    rose: { border: "border-rose-200", header: "bg-rose-50/40 border-rose-100", badge: "bg-rose-100 border-rose-200 text-rose-700", badgeLabel: "Before · contested" },
    emerald: { border: "border-emerald-200", header: "bg-emerald-50/40 border-emerald-100", badge: "bg-emerald-100 border-emerald-200 text-emerald-700", badgeLabel: "After · proposed" },
  }[tone];
  return (
    <div className={`rounded-2xl bg-white border-2 ${cfg.border} shadow-sm overflow-hidden`}>
      <div className={`px-4 py-2.5 border-b ${cfg.header} flex items-center gap-2`}>
        <span className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full border ${cfg.badge}`}>{cfg.badgeLabel}</span>
        <span className="text-[12px] font-semibold text-slate-900 truncate">{title}</span>
      </div>
      <div className="px-4 py-4 text-[13px] text-slate-700 leading-relaxed">
        {content}
      </div>
      <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/50 text-[10px] text-slate-500 truncate">
        {author}
      </div>
    </div>
  );
}

function PropagationPreview() {
  return (
    <div className="rounded-2xl bg-indigo-50/40 border border-indigo-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <GitMerge className="w-3.5 h-3.5 text-indigo-700" strokeWidth={2} />
        <h3 className="text-sm font-semibold text-slate-900">If you approve, this propagates to:</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <PropagateTile icon={FileText} label="Atlas wiki v2.4" detail="Replaces v2.3 entry" />
        <PropagateTile icon={Network} label="Knowledge Graph" detail="Canonical badge applied" />
        <PropagateTile icon={Users} label={`${SESSION.successor}'s playbook`} detail="Section 3 auto-updates" />
        <PropagateTile icon={BellIcon} label="Team Slack" detail="#engineering-platform notified" />
      </div>
      <div className="mt-3 pt-3 border-t border-indigo-100 text-[10px] text-slate-500 inline-flex items-center gap-1.5">
        <ShieldCheck className="w-2.5 h-2.5 text-violet-600" strokeWidth={2} />
        QA-INT-01 §2.3 immutable audit trail · all 4 propagations logged with your sign-off SHA
      </div>
    </div>
  );
}

function PropagateTile({ icon: Icon, label, detail }) {
  return (
    <div className="rounded-xl bg-white border border-indigo-100 p-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-3 h-3 text-indigo-600" strokeWidth={2} />
        <span className="text-[11px] font-semibold text-slate-900 truncate">{label}</span>
      </div>
      <div className="text-[9px] text-slate-500 leading-snug">{detail}</div>
    </div>
  );
}

function ApprovalActionBar() {
  return (
    <div className="rounded-2xl bg-white border border-gray-200 shadow-lg p-4 flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
          <span className="text-[10px] font-semibold text-white">{SESSION.readerInitials}</span>
        </div>
        <div className="leading-tight">
          <div className="text-[12px] font-semibold text-slate-900">Signing off as {SESSION.reader}</div>
          <div className="text-[10px] text-slate-500" style={{ fontFamily: MONO_STACK }}>{SESSION.readerHandle} · Engineering Manager</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="h-9 px-3.5 rounded-xl bg-white border border-gray-200 text-slate-600 text-[12px] font-medium inline-flex items-center gap-1.5 hover:bg-gray-50 transition-colors cursor-pointer">
          <ThumbsDown className="w-3 h-3" />
          Reject correction
        </button>
        <button className="h-9 px-3.5 rounded-xl bg-white border border-yellow-200 text-yellow-800 text-[12px] font-medium inline-flex items-center gap-1.5 hover:bg-yellow-50 transition-colors cursor-pointer">
          <Edit3 className="w-3 h-3" />
          Edit before approving
        </button>
        <button className="h-9 px-4 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-[12px] font-semibold inline-flex items-center gap-1.5 shadow-md hover:brightness-110 transition-all cursor-pointer">
          <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2.5} />
          Sign off + propagate
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S6 · Lineage drawer · CL-085 4-event timeline
   ═══════════════════════════════════════════════════════════════════ */

function S6LineageDrawer() {
  return (
    <>
      <InsightsBar
        current="now · live"
        items={[
          { value: "47", label: "Nodes · team scope", icon: Network, tone: "indigo" },
          { value: "Atlas rollback", label: "Inspecting", sublabel: "Canonical · 12 days old", icon: Award, tone: "emerald" },
          { value: "4", label: "Lineage events", sublabel: "Created → Verified → Committed → Propagated", icon: History, tone: "indigo" },
          { value: "11", label: "Downstream nodes", sublabel: "Inherited from this Canonical", icon: GitMerge, tone: "indigo" },
        ]}
      />

      <ThreeColumnLayout
        left={<ManagerActionsPanel state="s6" />}
        center={
          <div className="space-y-4">
            <GraphCard>
              <ManagerGraph mode="lineage-focus" view="now" focusNode="atlas-rollback" />
            </GraphCard>
            <TimelineRibbon position="now" />
          </div>
        }
        right={<LineageDrawer />}
      />
    </>
  );
}

function LineageDrawer() {
  return (
    <div className="rounded-2xl bg-white/90 backdrop-blur-md border-2 border-emerald-200 shadow-xl shadow-emerald-900/[0.04] overflow-hidden">
      <div className="px-4 py-3 border-b border-emerald-100 bg-emerald-50/40 flex items-center gap-2">
        <Award className="w-3.5 h-3.5 text-emerald-700" strokeWidth={2} />
        <h3 className="text-sm font-semibold text-slate-900">Lineage · Atlas rollback procedure</h3>
        <span className="ml-auto text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700">Canonical</span>
      </div>

      <div className="p-4">
        <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-3 inline-flex items-center gap-1.5">
          <History className="w-3 h-3" strokeWidth={2} />
          QA-INT-01 §2.3 · Immutable audit trail · 4 events
        </div>

        <ol className="space-y-4 relative">
          <span className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-indigo-300 via-violet-300 to-emerald-300" />

          <LineageEvent
            n={1}
            icon={Plus}
            iconBg="bg-indigo-50 border-indigo-300 text-indigo-700"
            stage="Created"
            title="Surfaced from interview"
            actor={SESSION.predecessor}
            when="May 14 · 09:17"
            detail="AI extracted from interview transcript topic 3 · 'Project Atlas rollback procedure' · classified as Step + Procedure"
            confidence="84%"
          />

          <LineageEvent
            n={2}
            icon={Check}
            iconBg="bg-violet-50 border-violet-300 text-violet-700"
            stage="Verified"
            title="Signed during transcript review"
            actor={SESSION.predecessor}
            when="May 14 · 14:42"
            detail={`${SESSION.predecessor} reviewed the AI-extracted procedure in UC-HO-03 · accepted with one inline edit (clarified the 'staging first' constraint)`}
          />

          <LineageEvent
            n={3}
            icon={ShieldCheck}
            iconBg="bg-emerald-50 border-emerald-300 text-emerald-700"
            stage="Committed"
            title="Promoted to Canonical · KG commit"
            actor={SESSION.reader}
            when="May 16 · 11:30"
            detail="UC-HO-04 · You signed off after reviewing 3 supporting sources · CanonicalBadge applied · QA-INT-01 §1.4 gate passed"
          />

          <LineageEvent
            n={4}
            icon={GitMerge}
            iconBg="bg-emerald-50 border-emerald-300 text-emerald-700"
            stage="Propagated"
            title="Inherited downstream"
            actor="Automatic"
            when="May 16 · 11:32"
            detail="11 downstream nodes inherited this Canonical · Tran's playbook section 3 + Atlas wiki marker + 3 dependent runbooks + 5 cross-team references"
            last
          />
        </ol>

        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-2">Cryptographic anchor</div>
          <div className="rounded-lg bg-gray-50 border border-gray-200 px-2.5 py-2 text-[9px] text-slate-600 break-all" style={{ fontFamily: MONO_STACK }}>
            sha256: 8b3f4d2e9a1c7e6f5d8a2b4c6d9e1f3a5b7c9e1f3a5b7c9e1f3a5b7c9e1f3a5b
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <button className="text-[10px] text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer">
            <ExternalLink className="w-2.5 h-2.5" strokeWidth={2} />
            View full audit row
          </button>
          <SecondaryButtonSm><X className="w-3 h-3" />Close</SecondaryButtonSm>
        </div>
      </div>
    </div>
  );
}

function ExternalLink({ className, strokeWidth }) {
  return <ArrowUpRight className={className} strokeWidth={strokeWidth} />;
}

function LineageEvent({ n, icon: Icon, iconBg, stage, title, actor, when, detail, confidence, last }) {
  return (
    <li className="flex items-start gap-3 relative z-10">
      <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center shrink-0 bg-white ${iconBg}`}>
        <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-500">Event {n}</span>
          <span className="text-[12px] font-bold text-slate-900">{stage}</span>
        </div>
        <h4 className="text-[12px] font-semibold text-slate-700 mt-0.5">{title}</h4>
        <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
          <span style={{ fontFamily: MONO_STACK }}>{actor}</span>
          <span>·</span>
          <span style={{ fontFamily: MONO_STACK }}>{when}</span>
          {confidence && (
            <>
              <span>·</span>
              <span className="text-indigo-700 font-semibold">{confidence} conf</span>
            </>
          )}
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed mt-1.5">{detail}</p>
      </div>
    </li>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S7 · Critical alert · [Risk] flagged · real-time path
   ═══════════════════════════════════════════════════════════════════ */

function S7CriticalAlert() {
  return (
    <>
      <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-white border-2 border-rose-300 shadow-xl shadow-rose-900/[0.08] p-4 mb-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-rose-400 to-rose-500" />

        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-500 flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/30">
            <ShieldAlert className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-full bg-rose-500 text-white">Critical · real-time</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-700" style={{ fontFamily: MONO_STACK }}>[Risk]</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-700" style={{ fontFamily: MONO_STACK }}>[Finance-adjacent]</span>
              <span className="ml-auto text-[10px] text-slate-500" style={{ fontFamily: MONO_STACK }}>4 min ago · ALERT-2026-06-03-001</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              <span className="bg-gradient-to-br from-rose-500 to-rose-700 bg-clip-text text-transparent">Vendor XYZ SLA penalty clause</span> · contested by 2 consumers
            </h2>
            <p className="text-[12px] text-slate-700 leading-relaxed mt-1 max-w-2xl">
              CL-095 routed this through the Critical path because the node carries the <code style={{ fontFamily: MONO_STACK }} className="text-[11px] bg-rose-100 px-1 rounded">[Risk]</code> tag and touches financial exposure. Both flaggers said the penalty clause as currently committed is missing the late-payment grace period — which could trigger the penalty incorrectly on legitimate timing. You need to review this before {SESSION.successor}'s next renewal call (in 2 days).
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-rose-200/60 grid grid-cols-3 gap-3">
          <FlaggerCard
            name={SESSION.flagger}
            initials="DN"
            team={SESSION.flaggerTeam}
            reason="Penalty math is wrong · doesn't account for the 5-business-day grace period in the actual contract."
            when="4 min ago"
          />
          <FlaggerCard
            name={SESSION.successor}
            initials="TN"
            team="Engineering · Platform"
            reason={`Cross-checked with the vendor's account manager · they confirmed Minh negotiated a verbal extension that isn't in the Canonical.`}
            when="22 min ago"
          />
          <div className="rounded-xl bg-white border border-indigo-200 p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3 h-3 text-indigo-600" strokeWidth={2} />
              <span className="text-[10px] uppercase tracking-wider font-semibold text-indigo-700">AI recommendation</span>
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              <strong>Escalate to Expert LLM</strong> + pull the original contract from Vendor XYZ's SharePoint. Two independent sources contradict the Canonical — likely the contract version that was indexed is outdated.
            </p>
            <div className="mt-2 text-[9px] text-slate-500 inline-flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-indigo-500" strokeWidth={2} />
              Confidence · 76% · Worker SLM escalated to Expert
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-rose-200/60 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-[11px] text-slate-600 inline-flex items-center gap-1.5">
            <Hourglass className="w-3.5 h-3.5 text-rose-600" strokeWidth={2} />
            QA-INT-01 §1.4 commit gate · the contested flag is visible to all readers until you sign off
          </div>
          <div className="flex items-center gap-2">
            <SecondaryButton><Hourglass className="w-3 h-3" />Defer 1h</SecondaryButton>
            <button className="h-9 px-4 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 text-white text-[12px] font-semibold inline-flex items-center gap-1.5 shadow-md hover:brightness-110 transition-all cursor-pointer">
              <Zap className="w-3.5 h-3.5" strokeWidth={2.5} />
              Review now
            </button>
          </div>
        </div>
      </div>

      <ThreeColumnLayout
        left={<ManagerActionsPanel state="s7" />}
        center={
          <div className="space-y-4">
            <GraphCard>
              <ManagerGraph mode="critical-focus" view="now" focusNode="vendor-xyz" />
            </GraphCard>
            <TimelineRibbon position="now" alert />
          </div>
        }
        right={<CriticalContextPanel />}
      />
    </>
  );
}

function FlaggerCard({ name, initials, team, reason, when }) {
  return (
    <div className="rounded-xl bg-white border border-rose-200 p-3">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center">
          <span className="text-[9px] font-semibold text-white">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-semibold text-slate-900 truncate">{name}</div>
          <div className="text-[9px] text-slate-500 truncate">{team}</div>
        </div>
        <span className="text-[9px] text-slate-500 shrink-0" style={{ fontFamily: MONO_STACK }}>{when}</span>
      </div>
      <p className="text-[11px] text-slate-600 leading-snug italic">"{reason}"</p>
    </div>
  );
}

function CriticalContextPanel() {
  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <Radio className="w-3.5 h-3.5 text-rose-600 animate-pulse" strokeWidth={2} />
        <h3 className="text-sm font-semibold text-slate-900">Why this is Critical</h3>
      </div>

      <div className="p-4 space-y-3 text-[12px]">
        <div className="flex items-start gap-2">
          <span className="w-5 h-5 rounded-md bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0 mt-0.5">
            <Tag className="w-2.5 h-2.5 text-rose-700" strokeWidth={2.5} />
          </span>
          <div className="text-slate-700 leading-relaxed">
            Carries <code style={{ fontFamily: MONO_STACK }} className="text-[11px] bg-rose-100 px-1 rounded">[Risk]</code> · CL-095 routes [Risk] / [Finance] / [Legal] tags through the Critical path
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="w-5 h-5 rounded-md bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0 mt-0.5">
            <Users className="w-2.5 h-2.5 text-rose-700" strokeWidth={2.5} />
          </span>
          <div className="text-slate-700 leading-relaxed">
            2 independent flaggers · the threshold for Critical promotion (vs Batch) is 2+ flags on a [Risk] node
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="w-5 h-5 rounded-md bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0 mt-0.5">
            <Calendar className="w-2.5 h-2.5 text-rose-700" strokeWidth={2.5} />
          </span>
          <div className="text-slate-700 leading-relaxed">
            <strong>Time-sensitive</strong> · Tran has a Vendor XYZ renewal call in 2 days · without correction, he'd cite the wrong penalty math
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="w-5 h-5 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-2.5 h-2.5 text-emerald-700" strokeWidth={2.5} />
          </span>
          <div className="text-slate-700 leading-relaxed">
            <strong>Contested flag visible</strong> · until you sign off, all readers see Vendor XYZ marked "flagged · under review" (QA-INT-01 §1.4 commit gate)
          </div>
        </div>
      </div>

      <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
        <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-1.5">SLA reminder</div>
        <p className="text-[10px] text-slate-600 leading-snug">
          Critical-path items target sign-off within <strong>4 hours</strong> · Batch items within <strong>2 weekly cycles</strong> (CL-095). You have <span className="text-rose-700 font-bold" style={{ fontFamily: MONO_STACK }}>3h 56m</span> remaining.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S8 · Approved + signed · audit log entry · graph updated
   ═══════════════════════════════════════════════════════════════════ */

function S8AfterSignoff() {
  return (
    <>
      <SignoffConfirmation />

      <InsightsBar
        view="Team scope · just updated"
        current="now · live"
        items={[
          { value: "47", label: "Nodes · team scope", sublabel: "+ 1 promoted Canonical", icon: Network, tone: "indigo" },
          { value: "13", label: "Canonical facts", sublabel: "+ 1 from Atlas rollback fix", icon: Award, tone: "emerald" },
          { value: "2", label: "Contested flags", sublabel: "Was 3 · one resolved", icon: AlertTriangle, tone: "yellow" },
          { value: "1", label: "Sign-off pending", sublabel: "Was 2 · one signed", icon: FileCheck, tone: "indigo" },
        ]}
      />

      <ThreeColumnLayout
        left={<ManagerActionsPanel state="s8" />}
        center={
          <div className="space-y-4">
            <GraphCard>
              <ManagerGraph mode="just-updated" view="now" focusNode="atlas-rollback" />
            </GraphCard>
            <TimelineRibbon position="now" justUpdated />
          </div>
        }
        right={<AuditLogPanel />}
      />
    </>
  );
}

function SignoffConfirmation() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-200 shadow-lg p-4 mb-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shrink-0 shadow-md">
        <Check className="w-6 h-6 text-white" strokeWidth={3} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-full bg-emerald-600 text-white">Signed</span>
          <span className="text-[10px] text-slate-500" style={{ fontFamily: MONO_STACK }}>SIGNED-2026-06-03-1429 · 3 min ago</span>
        </div>
        <h3 className="text-base font-bold text-slate-900">Atlas rollback correction · approved + propagated</h3>
        <p className="text-[11px] text-slate-600 mt-0.5">
          Canonical updated · {SESSION.successor}'s playbook auto-refreshed · #engineering-platform Slack notified · {SESSION.flagger} thanked.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <SecondaryButtonSm><History className="w-3 h-3" />View lineage</SecondaryButtonSm>
        <SecondaryButtonSm><X className="w-3 h-3" /></SecondaryButtonSm>
      </div>
    </div>
  );
}

function AuditLogPanel() {
  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-violet-700" strokeWidth={2} />
        <h3 className="text-sm font-semibold text-slate-900">Audit log · last 24h</h3>
        <span className="ml-auto text-[10px] text-slate-500" style={{ fontFamily: MONO_STACK }}>QA-INT-01 §2.3</span>
      </div>

      <div className="p-3">
        <AuditRow
          icon={ShieldCheck}
          color="emerald"
          who={SESSION.reader}
          what="signed off · Atlas rollback correction"
          when="3 min ago"
          ref="SIGNED-2026-06-03-1429"
          fresh
        />
        <AuditRow
          icon={Edit3}
          color="indigo"
          who={SESSION.flagger}
          what="flagged · Atlas wiki rollback section"
          when="2h ago"
          ref="FLAG-2026-06-03-1224"
        />
        <AuditRow
          icon={Plus}
          color="emerald"
          who={SESSION.successor}
          what="completed Section 3 Quick Check"
          when="5h ago"
          ref="UCON03-2026-06-03-0917"
        />
        <AuditRow
          icon={Search}
          color="indigo"
          who="Duy Nguyen"
          what="searched · Atlas rollback"
          when="6h ago"
          ref="QUERY-2026-06-03-0843"
        />
        <AuditRow
          icon={ShieldAlert}
          color="rose"
          who="System"
          what="Critical alert raised · Vendor XYZ"
          when="8h ago"
          ref="ALERT-2026-06-03-001"
          last
        />
      </div>

      <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <span className="text-[10px] text-slate-500">All entries queryable</span>
        <button className="text-[10px] text-indigo-700 hover:text-indigo-900 font-semibold inline-flex items-center gap-1 cursor-pointer">
          Full audit log
          <ArrowUpRight className="w-2.5 h-2.5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

function AuditRow({ icon: Icon, color, who, what, when, ref, fresh, last }) {
  const cfg = {
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
    rose: "bg-rose-50 border-rose-200 text-rose-700",
  }[color];
  return (
    <div className={`flex items-start gap-2.5 py-2 ${!last ? "border-b border-gray-100" : ""} ${fresh ? "bg-emerald-50/30 -mx-2 px-2 rounded-lg" : ""}`}>
      <div className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${cfg}`}>
        <Icon className="w-3 h-3" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] text-slate-700 leading-snug">
          <span className="font-semibold text-slate-900">{who}</span> {what}
        </div>
        <div className="text-[9px] text-slate-500 mt-0.5 flex items-center gap-2" style={{ fontFamily: MONO_STACK }}>
          <span>{when}</span>
          <span>·</span>
          <span className="truncate">{ref}</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Manager Actions Panel · left sidebar · context-aware
   ═══════════════════════════════════════════════════════════════════ */

function ManagerActionsPanel({ state }) {
  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <Crosshair className="w-3.5 h-3.5 text-indigo-700" strokeWidth={2} />
        <h3 className="text-sm font-semibold text-slate-900">Your queue</h3>
      </div>

      <div className="p-2 space-y-1">
        <ActionRow
          icon={ShieldAlert}
          label="Critical · Vendor XYZ"
          detail="2 flaggers · 3h 56m SLA"
          tone="rose"
          urgent
          active={state === "s7"}
        />
        <ActionRow
          icon={AlertTriangle}
          label="Contested · Atlas wiki"
          detail={`Flagged by ${SESSION.flagger} · 2h`}
          tone="yellow"
          active={state === "s4" || state === "s5"}
        />
        <ActionRow
          icon={FileCheck}
          label="Sign-off · Atlas rollback"
          detail="Promotes to Canonical"
          tone="indigo"
          active={state === "s5"}
        />
        <Divider label="Recently resolved" />
        <ActionRow
          icon={Check}
          label="Vendor XYZ correction"
          detail={`Signed · 4 days ago`}
          tone="emerald"
          quiet
        />
      </div>

      <div className="px-3 py-2 border-t border-gray-100 bg-gray-50/50">
        <div className="text-[9px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-1.5">Triage policy</div>
        <p className="text-[10px] text-slate-600 leading-snug">
          Critical · 4h SLA · real-time. Batch · 2 weekly cycles · digest. CL-095.
        </p>
      </div>
    </div>
  );
}

function ActionRow({ icon: Icon, label, detail, tone, urgent, quiet, active }) {
  const cfg = {
    rose: { ring: active ? "bg-rose-50 border-rose-300" : "border-transparent hover:bg-rose-50/40", iconCls: "bg-rose-50 border-rose-200 text-rose-700" },
    yellow: { ring: active ? "bg-yellow-50 border-yellow-300" : "border-transparent hover:bg-yellow-50/40", iconCls: "bg-yellow-50 border-yellow-200 text-yellow-700" },
    indigo: { ring: active ? "bg-indigo-50 border-indigo-300" : "border-transparent hover:bg-indigo-50/40", iconCls: "bg-indigo-50 border-indigo-200 text-indigo-700" },
    emerald: { ring: "border-transparent", iconCls: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  }[tone];
  return (
    <button className={`w-full text-left rounded-lg border ${cfg.ring} px-2.5 py-2 flex items-center gap-2.5 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${quiet ? "opacity-65" : ""}`}>
      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${cfg.iconCls}`}>
        <Icon className="w-3 h-3" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-slate-900 truncate">{label}</span>
          {urgent && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />}
        </div>
        <div className="text-[9px] text-slate-500 truncate" style={{ fontFamily: MONO_STACK }}>{detail}</div>
      </div>
      <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" strokeWidth={2} />
    </button>
  );
}

function Divider({ label }) {
  return (
    <div className="pt-3 pb-1 px-1">
      <div className="text-[9px] uppercase tracking-[0.18em] text-slate-500 font-semibold">{label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Hot spots panel (S1) · quick glance at what's moving
   ═══════════════════════════════════════════════════════════════════ */

function HotSpotsPanel() {
  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <TrendingUp className="w-3.5 h-3.5 text-indigo-700" strokeWidth={2} />
        <h3 className="text-sm font-semibold text-slate-900">Moving this week</h3>
      </div>

      <div className="p-3 space-y-2">
        <HotSpotRow
          label="Project Atlas"
          detail="11 edits · 142 reads · 2 flags"
          delta="+18%"
          tone="rose"
        />
        <HotSpotRow
          label="Vendor XYZ"
          detail="2 flags · 1 critical alert"
          delta="active"
          tone="rose"
        />
        <HotSpotRow
          label="Cosmos partition"
          detail="68 cross-team reads"
          delta="+6%"
          tone="emerald"
        />
        <HotSpotRow
          label="On-call rotation"
          detail="3 colleagues asked this week"
          delta="–"
          tone="indigo"
        />
      </div>

      <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
        <div className="text-[10px] text-slate-500 inline-flex items-center gap-1.5">
          <Compass className="w-2.5 h-2.5 text-indigo-500" strokeWidth={2} />
          <span>Tip · click a hot spot to focus the graph + see all flags</span>
        </div>
      </div>
    </div>
  );
}

function HotSpotRow({ label, detail, delta, tone }) {
  const cfg = {
    rose: "text-rose-700 bg-rose-50 border-rose-200",
    emerald: "text-emerald-700 bg-emerald-50 border-emerald-200",
    indigo: "text-indigo-700 bg-indigo-50 border-indigo-200",
  }[tone];
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-semibold text-slate-900 truncate">{label}</div>
        <div className="text-[10px] text-slate-500" style={{ fontFamily: MONO_STACK }}>{detail}</div>
      </div>
      <span className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full border ${cfg}`} style={{ fontFamily: MONO_STACK }}>{delta}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Timeline ribbon · DRAGGABLE scrub through history
   The signature Manager affordance · CL-094 historical visualization
   ═══════════════════════════════════════════════════════════════════ */

function TimelineRibbon({ position, alert, justUpdated }) {
  const events = [
    { id: "e1", at: "May 14", kind: "interview", label: `${SESSION.predecessor}'s interview · committed`, tone: "indigo" },
    { id: "e2", at: "May 16", kind: "canonical", label: "Atlas rollback → Canonical", tone: "emerald" },
    { id: "e3", at: "May 20", kind: "canonical", label: "Cosmos partition spec → Canonical", tone: "emerald" },
    { id: "e4", at: "May 23", kind: "rewound-marker", label: "← S3 drag target (2w ago)", tone: "yellow" },
    { id: "e5", at: "May 27", kind: "interview", label: "Khanh Linh interview · committed", tone: "indigo" },
    { id: "e6", at: "May 30", kind: "canonical", label: "Vendor XYZ SLA → Canonical (now contested)", tone: "rose" },
    { id: "e7", at: "Jun 2", kind: "flag", label: `${SESSION.flagger} flagged Atlas wiki`, tone: "yellow" },
    { id: "e8", at: "Jun 3", kind: "signoff", label: justUpdated ? "Atlas rollback corrected · YOU just signed" : "Atlas rollback correction · pending sign-off", tone: justUpdated ? "emerald" : "indigo" },
    { id: "e9", at: "Jun 3", kind: "critical", label: "Vendor XYZ critical alert · 2 flaggers", tone: "rose" },
  ];

  // Position the "current view" marker
  const positionPct = {
    "now": 96,
    "2w-ago": 38,
  }[position] ?? 96;

  return (
    <div className="rounded-2xl bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg shadow-indigo-900/[0.04] overflow-hidden">
      <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-2 flex-wrap">
        <History className="w-3.5 h-3.5 text-indigo-700" strokeWidth={2} />
        <h3 className="text-[12px] font-semibold text-slate-900">Timeline · drag to scrub through history</h3>
        {position === "now" && <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">Live</span>}
        {position === "2w-ago" && <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700">2 weeks ago</span>}
        {alert && <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 animate-pulse">+ Critical event</span>}
        <span className="ml-auto text-[10px] text-slate-500" style={{ fontFamily: MONO_STACK }}>{events.length} events · last 30d</span>
      </div>

      <div className="px-4 pt-4 pb-2 relative">
        {/* Track */}
        <div className="relative h-2 rounded-full bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-100">
          {/* Past · darker fill */}
          <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-400/60 to-indigo-500/40" style={{ width: `${positionPct}%` }} />

          {/* Event dots */}
          {events.map((e, i) => {
            const pos = ((i + 1) / (events.length + 1)) * 100;
            const dotCfg = {
              indigo: "bg-indigo-500 border-indigo-300",
              emerald: "bg-emerald-500 border-emerald-300",
              yellow: "bg-yellow-500 border-yellow-300",
              rose: "bg-rose-500 border-rose-300",
            }[e.tone];
            return (
              <div key={e.id} className="absolute -top-1.5 transform -translate-x-1/2" style={{ left: `${pos}%` }}>
                <div className={`w-4 h-4 rounded-full border-2 ${dotCfg} cursor-pointer hover:scale-125 transition-transform shadow-sm`} title={`${e.at} · ${e.label}`} />
              </div>
            );
          })}

          {/* Scrubber handle */}
          <div className="absolute -top-2.5 transform -translate-x-1/2 z-10" style={{ left: `${positionPct}%` }}>
            <div className="w-7 h-7 rounded-full bg-white border-2 border-indigo-600 shadow-lg shadow-indigo-500/30 cursor-grab active:cursor-grabbing flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600" />
            </div>
          </div>
        </div>

        {/* Tick marks */}
        <div className="flex justify-between mt-3 text-[9px] text-slate-500" style={{ fontFamily: MONO_STACK }}>
          <span>May 14</span>
          <span>May 21</span>
          <span>May 28</span>
          <span className="text-indigo-700 font-semibold">Jun 3 · now</span>
        </div>
      </div>

      {/* Recent events list */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/30">
        <div className="text-[9px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-2 flex items-center gap-1.5">
          <Activity className="w-2.5 h-2.5 text-indigo-500" strokeWidth={2} />
          Recent events
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {events.slice(-5).reverse().map(e => (
            <TimelineEventChip key={e.id} {...e} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineEventChip({ at, label, tone }) {
  const cfg = {
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    rose: "bg-rose-50 border-rose-200 text-rose-700",
  }[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] shrink-0 ${cfg}`}>
      <span style={{ fontFamily: MONO_STACK }} className="font-bold">{at}</span>
      <span className="text-slate-700 truncate max-w-[200px]">{label}</span>
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Graph card + Manager-lens graph rendering
   ═══════════════════════════════════════════════════════════════════ */

function GraphCard({ children }) {
  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg shadow-indigo-900/[0.04] h-[460px] relative overflow-hidden">
      {children}
    </div>
  );
}

function ManagerGraph({ mode, view, focusNode }) {
  // Manager sees team scope + cross-team Canonical · more nodes than Newcomer/Colleague
  const allNodes = [
    { id: "atlas", label: "Project Atlas", kind: "project", x: 320, y: 220, primary: true },
    { id: "minh", label: "Minh Le", handle: "@minh.le", kind: "person", x: 150, y: 130, predecessor: true },
    { id: "tran", label: "Tran Huu Nam", handle: "@tran.huu.nam", kind: "person", x: 150, y: 310, successor: true },
    { id: "duy", label: "Duy Nguyen", handle: "@duy.nguyen", kind: "person", x: 70, y: 220, otherTeam: true },
    { id: "you", label: "You · Ha Vy", handle: "@ha.vy", kind: "person-self", x: 490, y: 220, manager: true },
    { id: "payment-gateway", label: "Payment Gateway", kind: "service", x: 490, y: 90, canonical: true },
    { id: "cosmos", label: "Cosmos partition", kind: "service", x: 490, y: 350, canonical: true },
    { id: "atlas-wiki", label: "Atlas wiki v2.3", kind: "doc", x: 320, y: 90, contested: mode !== "just-updated" },
    { id: "atlas-rollback", label: "Atlas rollback", kind: "doc", x: 320, y: 360, canonical: true, recent: mode === "just-updated" },
    { id: "incident", label: "INC-2942", kind: "incident", x: 570, y: 130 },
    { id: "vendor-xyz", label: "Vendor XYZ", kind: "vendor", x: 570, y: 310, contested: mode === "critical-focus", critical: mode === "critical-focus" },
    // Cross-team Canonical
    { id: "comp-fw", label: "Compensation FW", kind: "doc", x: 40, y: 90, canonical: true, crossTeam: true },
    { id: "khanh", label: "Khanh Linh", handle: "@khanh.linh", kind: "person", x: 40, y: 310, otherTeam: true },
  ];

  const edges = [
    { from: "atlas", to: "minh", label: "predecessor" },
    { from: "atlas", to: "tran", label: "successor" },
    { from: "atlas", to: "you", label: "managed by", strong: true },
    { from: "atlas", to: "payment-gateway", label: "depends on" },
    { from: "atlas", to: "cosmos", label: "writes to" },
    { from: "atlas", to: "atlas-wiki" },
    { from: "atlas", to: "atlas-rollback", canonical: mode === "just-updated", recent: mode === "just-updated" },
    { from: "atlas", to: "incident" },
    { from: "atlas", to: "vendor-xyz", critical: mode === "critical-focus" },
    { from: "cosmos", to: "duy" },
    { from: "khanh", to: "comp-fw" },
    { from: "atlas-rollback", to: "tran", canonical: mode === "just-updated", dashed: true },
  ];

  const nodeById = Object.fromEntries(allNodes.map(n => [n.id, n]));

  return (
    <div className="relative h-full">
      <GraphHeader mode={mode} view={view} />

      <div className="absolute inset-0 top-[44px] bottom-[28px]">
        <svg viewBox="0 0 640 440" className="w-full h-full">
          {/* Heatmap overlay · S2 */}
          {mode === "heatmap" && (
            <g>
              <circle cx="320" cy="220" r="120" fill="#f43f5e" opacity="0.18" />
              <circle cx="320" cy="220" r="80" fill="#f43f5e" opacity="0.22" />
              <circle cx="490" cy="90" r="60" fill="#f43f5e" opacity="0.16" />
              <circle cx="490" cy="350" r="50" fill="#eab308" opacity="0.14" />
              <circle cx="40" cy="90" r="40" fill="#6366f1" opacity="0.05" />
              <circle cx="570" cy="310" r="55" fill="#eab308" opacity="0.10" />
            </g>
          )}

          {/* Edges */}
          <g>
            {edges.map((edge, i) => {
              const from = nodeById[edge.from];
              const to = nodeById[edge.to];
              if (!from || !to) return null;
              const stroke = edge.critical ? "#f43f5e" : edge.canonical ? "#10b981" : edge.strong ? "#6366f1" : "#cbd5e1";
              const strokeWidth = edge.strong || edge.critical ? 2 : edge.recent ? 2.5 : 1;
              return (
                <g key={i}>
                  {edge.recent && (
                    <line
                      x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                      stroke="#10b981"
                      strokeWidth={6}
                      opacity={0.18}
                    />
                  )}
                  <line
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeDasharray={edge.dashed ? "4,3" : ""}
                  />
                </g>
              );
            })}
          </g>

          {/* Rewound ghost nodes for S3 · Atlas rollback didn't exist 2w ago */}
          {mode === "rewound" && (
            <g opacity="0.35">
              <circle cx="320" cy="360" r="22" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3,3" />
              <text x="320" y="364" textAnchor="middle" className="text-[9px] italic" style={{ fontFamily: FONT_STACK, fill: "#94a3b8" }}>(not yet)</text>
              <text x="320" y="395" textAnchor="middle" className="text-[8px] italic" style={{ fontFamily: FONT_STACK, fill: "#94a3b8" }}>Atlas rollback</text>
            </g>
          )}

          {/* Nodes */}
          <g>
            {allNodes.filter(n => !(mode === "rewound" && n.id === "atlas-rollback")).map((n) => (
              <ManagerGraphNode
                key={n.id}
                node={n}
                isPrimary={n.primary}
                isFocus={focusNode === n.id}
                managerView
              />
            ))}
          </g>
        </svg>
      </div>

      <GraphFooter mode={mode} view={view} />
    </div>
  );
}

function GraphHeader({ mode, view }) {
  const modeLabel = {
    heatmap: { label: "Heatmap layer", cls: "bg-rose-50 border-rose-200 text-rose-700" },
    rewound: { label: "Rewound · 2w ago", cls: "bg-yellow-50 border-yellow-200 text-yellow-700" },
    "contested-focus": { label: "Contested focus", cls: "bg-yellow-50 border-yellow-200 text-yellow-700" },
    "critical-focus": { label: "Critical focus", cls: "bg-rose-50 border-rose-200 text-rose-700 animate-pulse" },
    "lineage-focus": { label: "Lineage focus", cls: "bg-emerald-50 border-emerald-200 text-emerald-700" },
    "just-updated": { label: "Just updated", cls: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  }[mode];
  return (
    <div className="absolute top-0 left-0 right-0 z-10 px-3 py-2 flex items-center justify-between gap-2 border-b border-gray-100 bg-white/70 backdrop-blur-sm">
      <div className="flex items-center gap-2 min-w-0">
        <Network className="w-3.5 h-3.5 text-indigo-700 shrink-0" strokeWidth={2} />
        <span className="text-[11px] font-semibold text-slate-900 truncate">Global graph · Manager lens</span>
        {modeLabel && (
          <span className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full border ${modeLabel.cls} shrink-0`}>{modeLabel.label}</span>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <ViewModeChip label="Team scope" active />
        <ViewModeChip label="Cross-team" />
        <ViewModeChip label="Full org" />
      </div>
    </div>
  );
}

function ViewModeChip({ label, active }) {
  const cls = active
    ? "bg-indigo-100 text-indigo-700 border-indigo-200"
    : "bg-white text-slate-500 border-gray-200 hover:border-indigo-300 hover:text-slate-700";
  return (
    <button className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border transition-colors ${cls}`}>
      {label}
    </button>
  );
}

function GraphFooter({ mode, view }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 px-3 py-1.5 border-t border-gray-100 bg-white/70 backdrop-blur-sm flex items-center justify-between gap-2">
      <div className="flex items-center gap-3 text-[9px] text-slate-500">
        <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Service</span>
        <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-500" /> Person</span>
        <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded border border-emerald-500" /> Canonical</span>
        <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Contested</span>
        <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Critical</span>
      </div>
      <div className="flex items-center gap-1">
        <button className="p-1 rounded text-slate-400 hover:text-slate-700"><ZoomIn className="w-3 h-3" /></button>
        <button className="p-1 rounded text-slate-400 hover:text-slate-700"><Maximize2 className="w-3 h-3" /></button>
        <span className="text-[9px] text-slate-400 ml-1 px-1.5 py-0.5 rounded border border-gray-200" style={{ fontFamily: MONO_STACK }}>{mode === "rewound" ? "11 visible" : "13 visible"}</span>
      </div>
    </div>
  );
}

function ManagerGraphNode({ node, isPrimary, isFocus, managerView }) {
  const config = {
    project: { fill: "#EEF0FF", stroke: "#6366F1", textColor: "#1e1b4b", radius: 34 },
    "person-self": { fill: "#ede9fe", stroke: "#7C3AED", textColor: "#3b0764", radius: 22 },
    person: { fill: node.successor ? "#dcfce7" : node.predecessor ? "#fef3c7" : node.otherTeam ? "#f1f5f9" : "#ede9fe", stroke: node.successor ? "#10b981" : node.predecessor ? "#eab308" : node.otherTeam ? "#94a3b8" : "#a78bfa", textColor: "#0f172a", radius: 22 },
    service: { fill: node.canonical ? "#ecfdf5" : "#f1f5f9", stroke: node.canonical ? "#10b981" : "#94a3b8", textColor: "#0f172a", radius: 22 },
    vendor: { fill: node.critical ? "#fff1f2" : "#fef9c3", stroke: node.critical ? "#f43f5e" : "#eab308", textColor: node.critical ? "#881337" : "#713f12", radius: 22 },
    doc: { fill: node.recent ? "#ecfdf5" : node.contested ? "#fef9c3" : node.canonical ? "#ecfdf5" : "#ffffff", stroke: node.recent ? "#10b981" : node.contested ? "#eab308" : node.canonical ? "#10b981" : "#cbd5e1", textColor: "#0f172a", radius: 20 },
    incident: { fill: "#fff1f2", stroke: "#f43f5e", textColor: "#881337", radius: 22 },
  }[node.kind] || { fill: "#fff", stroke: "#cbd5e1", textColor: "#475569", radius: 20 };

  const finalRadius = isPrimary ? 38 : config.radius;
  const finalStroke = isFocus ? "#6366F1" : config.stroke;
  const finalStrokeWidth = isFocus || isPrimary ? 2.5 : 1.5;

  return (
    <g>
      {(isFocus || node.critical) && (
        <circle cx={node.x} cy={node.y} r={finalRadius + 8} fill={node.critical ? "#f43f5e" : "#6366f1"} opacity={node.critical ? 0.18 : 0.12} />
      )}
      {node.recent && (
        <circle cx={node.x} cy={node.y} r={finalRadius + 8} fill="#10b981" opacity={0.18}>
          {/* Subtle ring for the just-promoted node */}
        </circle>
      )}
      {node.manager && (
        <circle cx={node.x} cy={node.y} r={finalRadius + 4} fill="none" stroke="#7C3AED" strokeWidth="1.5" strokeDasharray="2,2" />
      )}
      <circle cx={node.x} cy={node.y} r={finalRadius} fill={config.fill} stroke={finalStroke} strokeWidth={finalStrokeWidth} />
      {node.canonical && (
        <circle cx={node.x + finalRadius - 6} cy={node.y - finalRadius + 6} r={5.5} fill="#10b981" stroke="#fff" strokeWidth={1.5} />
      )}
      {node.contested && (
        <circle cx={node.x + finalRadius - 6} cy={node.y - finalRadius + 6} r={5.5} fill="#eab308" stroke="#fff" strokeWidth={1.5} />
      )}
      {node.critical && (
        <g>
          <circle cx={node.x + finalRadius - 6} cy={node.y - finalRadius + 6} r={6} fill="#f43f5e" stroke="#fff" strokeWidth={1.5} />
          <circle cx={node.x + finalRadius - 6} cy={node.y - finalRadius + 6} r={9} fill="none" stroke="#f43f5e" strokeWidth="1" opacity="0.5" />
        </g>
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
   Shared button + label primitives
   ═══════════════════════════════════════════════════════════════════ */

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
