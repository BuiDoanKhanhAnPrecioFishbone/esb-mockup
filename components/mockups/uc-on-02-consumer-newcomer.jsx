"use client";

import React, { useState } from "react";
import {
  ChevronLeft, ChevronRight, Sparkles, Network, MessageSquare,
  Lock, Eye, KeyRound, Send, Filter, Layers, Search,
  Bell, HelpCircle, ChevronDown, ChevronUp, ArrowUpRight,
  Check, AlertTriangle, Info, Tag, Hash, Bookmark,
  GitBranch, Github, Folder, FileText, Briefcase, Users, Calendar,
  ArrowRight, X, Plus, Minus, Maximize2, ZoomIn,
  ExternalLink, Clock, TrendingUp, Activity, BookOpen,
  ChevronsRight, MapPin, Cpu, AlertOctagon, Award
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   UC-ON-02 · Consumer · NEWCOMER · Sprint 4 · Consumer plane

   The Newcomer's reading experience · Tran Huu Nam's personalized
   Day 1 playbook with the global Knowledge Graph in the right pane.
   First mockup in the MASTER.md "AI-Native Minimal" design language
   per CL-096 (scoped to Consumer plane only); semantic palette
   (rose / yellow / emerald / violet) preserved as the meaning layer.

   Honors all 2026-06-05 grill-me decisions:
     · CL-091 Trello as POC source · 4-layer hard-filter contract
     · CL-093 Tier 1 metadata Lock stubs · Tier 2 ghosted
     · CL-094 Progressive Disclosure · Quick-start chips ·
              0-token hover via pre-computed short_summary ·
              Prompt Disambiguation · Historical Timeline (Mgr only)
     · CL-096 MASTER.md "AI-Native Minimal" indigo / glassmorphism
     · CL-097 English-only · latinized usernames (Tran Huu Nam,
              Minh Le, Ha Vy, @minh.le)

   8 clickable states walk the full reading lifecycle:

     S1 · Landing · welcome from inheritance
     S2 · Reading Section 3 · Project Atlas
     S3 · Entity mini-card hover (0-token pre-computed)
     S4 · Graph node double-click expands the branch
     S5 · Tier 1 Lock stub clicked · Request access modal
     S6 · Copilot · Prompt Disambiguation chips
     S7 · Copilot · grounded answer with named source chips
     S8 · Quick Check at section end · feeds Skill Gap (UC-ON-03)

   The Knowledge Graph rendered here is the GLOBAL graph filtered
   through Tran's RBAC scope · same graph the Colleague and Manager
   see, different lens. Default view "Around your role" shows 1-hop
   around the section he's currently reading; double-click expands.
   ═══════════════════════════════════════════════════════════════════ */

const FLOW = [
  { id: "s1", uc: "Step 1", label: "Landing · welcome",                  trigger: "Tran lands from the 'Your Day 1 playbook is ready' notification." },
  { id: "s2", uc: "Step 2", label: "Reading Section 3 · Atlas",          trigger: "Section 3 of 8 · Project Atlas · red flags + unwritten rules visible." },
  { id: "s3", uc: "Step 3", label: "Entity mini-card hover",             trigger: "Hovering 'Payment Gateway' in-text · 0-token short_summary surfaces." },
  { id: "s4", uc: "Step 4", label: "Graph node expand · 2-hop",          trigger: "Double-click Atlas in the graph · 2nd-hop neighbors fan out." },
  { id: "s5", uc: "Step 5", label: "Tier 1 Lock stub · request access",  trigger: "Click a locked node · metadata visible · content withheld." },
  { id: "s6", uc: "Step 6", label: "Copilot · disambiguation chips",     trigger: "Ask 'tell me about Project Atlas' · AI returns clarifying chips, not 5000 tokens." },
  { id: "s7", uc: "Step 7", label: "Copilot · grounded answer",          trigger: "Pick 'Risk areas' chip · grounded reply + source chips + graph focus." },
  { id: "s8", uc: "Step 8", label: "Quick Check · skill gap signal",     trigger: "Section end · 3 questions feed Tran's Skill Gap (UC-ON-03)." },
];

const SESSION = {
  reader: "Tran Huu Nam",
  readerInitials: "TN",
  readerHandle: "@tran.huu.nam",
  predecessor: "Minh Le",
  predecessorHandle: "@minh.le",
  manager: "Ha Vy",
  managerHandle: "@ha.vy",
  role: "Senior Backend Engineer",
  team: "Engineering · Platform",
  currentSection: 3,
  totalSections: 8,
};

const FONT_STACK = 'Inter, "Geist", "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';
const MONO_STACK = 'ui-monospace, "Geist Mono", "JetBrains Mono", Menlo, monospace';

export default function UCON02ConsumerNewcomer() {
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

/* ─── Dev-only chrome (state nav · not part of the real surface) ─── */

function DevChrome({ step, stepIdx, onJump }) {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="px-5 py-2 flex items-center justify-between gap-4 max-w-[1600px] mx-auto w-full">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
          <span className="text-slate-900 font-semibold tracking-[0.18em] text-xs" style={{ fontFamily: MONO_STACK }}>ART-EEP</span>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-slate-500 text-xs">UC-ON-02 · Newcomer · Consumer plane</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          <span className="uppercase tracking-wider font-semibold text-indigo-700">AI-Native Minimal</span>
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
        className={`h-7 px-3 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
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
        className={`h-7 px-3 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
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
  if (id === "s1") return <ConsumerShell><S1Landing /></ConsumerShell>;
  if (id === "s2") return <ConsumerShell><S2ReadingAtlas /></ConsumerShell>;
  if (id === "s3") return <ConsumerShell><S3EntityHover /></ConsumerShell>;
  if (id === "s4") return <ConsumerShell><S4GraphExpand /></ConsumerShell>;
  if (id === "s5") return <ConsumerShell><S5LockStub /></ConsumerShell>;
  if (id === "s6") return <ConsumerShell><S6Disambiguation /></ConsumerShell>;
  if (id === "s7") return <ConsumerShell><S7GroundedAnswer /></ConsumerShell>;
  if (id === "s8") return <ConsumerShell><S8QuickCheck /></ConsumerShell>;
  return null;
}

/* ═══════════════════════════════════════════════════════════════════
   ConsumerShell · the surface chrome the Newcomer actually sees
   AI-Native Minimal · floating navbar · light-first
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
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
              <Network className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-bold text-slate-900 tracking-tight">ART-EEP</span>
          </a>
          <span className="text-gray-300">·</span>
          <a href="#" className="text-[12px] font-medium text-indigo-700">Your playbook</a>
          <a href="#" className="text-[12px] font-medium text-slate-500 hover:text-slate-900 transition-colors">Knowledge graph</a>
          <a href="#" className="text-[12px] font-medium text-slate-500 hover:text-slate-900 transition-colors">Skill gap</a>
        </div>

        <div className="flex items-center gap-2">
          <SearchPill />
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-slate-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
            <Bell className="w-4 h-4" strokeWidth={1.75} />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-slate-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
            <HelpCircle className="w-4 h-4" strokeWidth={1.75} />
          </button>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <div className="flex items-center gap-2 pl-1">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 border border-white shadow-sm flex items-center justify-center">
              <span className="text-[10px] font-semibold text-white">{SESSION.readerInitials}</span>
            </div>
            <div className="hidden md:flex flex-col leading-tight">
              <span className="text-[11px] font-semibold text-slate-900">{SESSION.reader}</span>
              <span className="text-[9px] text-slate-500" style={{ fontFamily: MONO_STACK }}>{SESSION.readerHandle}</span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

function SearchPill() {
  return (
    <button className="hidden md:flex items-center gap-2 px-3 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors min-w-[200px] text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
      <Search className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
      <span className="text-[11px] text-slate-500 flex-1">Search the graph...</span>
      <kbd className="px-1.5 py-0.5 rounded border border-gray-200 bg-white text-[9px] text-slate-500" style={{ fontFamily: MONO_STACK }}>⌘K</kbd>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S1 · Landing · welcome from inheritance
   ═══════════════════════════════════════════════════════════════════ */

function S1Landing() {
  return (
    <TwoPaneLayout>
      <LeftPane>
        <div className="space-y-6">
          <EyebrowPill>
            <Sparkles className="w-3 h-3" strokeWidth={2.5} />
            Your Day 1 playbook is ready
          </EyebrowPill>

          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.05] mb-4" style={{ fontFamily: FONT_STACK }}>
              Welcome,<br />
              {SESSION.reader}.{" "}
              <span className="bg-gradient-to-br from-indigo-500 to-violet-600 bg-clip-text text-transparent">Your handover</span>
              <br />is ready to read.
            </h1>
            <p className="text-base text-slate-600 leading-relaxed max-w-xl">
              Inherited from <strong className="text-slate-900 font-semibold">{SESSION.predecessor}</strong>. We've organized {SESSION.totalSections} sections from his interview · the unwritten rules, the red flags, and the canonical facts about the systems you're inheriting.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <StatTile value={SESSION.totalSections} label="Sections" sublabel={`~ ${SESSION.totalSections * 8} min read total`} />
            <StatTile value="14" label="Canonical facts" sublabel="Verified · ready to act on" tone="emerald" />
            <StatTile value="6" label="Red flags" sublabel="Things to know early" tone="rose" />
          </div>

          <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" strokeWidth={2} />
              What you'll read first
            </h3>
            <ol className="space-y-2">
              <SectionRow n={1} title="Your role in one paragraph" status="ready" estimate="3 min" />
              <SectionRow n={2} title="Your team and how you'll work" status="ready" estimate="6 min" />
              <SectionRow n={3} title="Project Atlas" status="ready" estimate="12 min" hot />
              <SectionRow n={4} title="Payment Gateway timeout" status="ready" estimate="8 min" hot />
              <SectionRow n={5} title="Vendor XYZ renewal" status="ready" estimate="9 min" />
            </ol>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <PrimaryButton>
              <BookOpen className="w-3.5 h-3.5" strokeWidth={2} />
              Start reading
            </PrimaryButton>
            <SecondaryButton>
              <Network className="w-3.5 h-3.5" strokeWidth={2} />
              Explore the graph first
            </SecondaryButton>
          </div>
        </div>
      </LeftPane>

      <RightStack
        graph={<GlobalGraph focus="tran" view="around-your-role" />}
        copilot={<CopilotWelcome />}
      />
    </TwoPaneLayout>
  );
}

function SectionRow({ n, title, status, estimate, hot }) {
  return (
    <li className="flex items-center gap-3 py-1.5 group cursor-pointer">
      <span className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-[10px] font-semibold text-indigo-700" style={{ fontFamily: MONO_STACK }}>{n}</span>
      <div className="flex-1 min-w-0">
        <span className="text-sm text-slate-900 font-medium group-hover:text-indigo-700 transition-colors">{title}</span>
      </div>
      {hot && <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700">hot path</span>}
      <span className="text-[10px] text-slate-500 shrink-0" style={{ fontFamily: MONO_STACK }}>{estimate}</span>
    </li>
  );
}

function StatTile({ value, label, sublabel, tone }) {
  const cfg = {
    default: { ring: "border-gray-200", valueCls: "text-slate-900", labelCls: "text-slate-600" },
    emerald: { ring: "border-emerald-200/60", valueCls: "text-emerald-700", labelCls: "text-emerald-700/80" },
    rose: { ring: "border-rose-200/60", valueCls: "text-rose-700", labelCls: "text-rose-700/80" },
  }[tone || "default"];
  return (
    <div className={`rounded-2xl bg-white/80 backdrop-blur-md border ${cfg.ring} shadow-sm p-4`}>
      <div className={`text-3xl font-extrabold ${cfg.valueCls} tracking-tight leading-none`} style={{ fontFamily: FONT_STACK }}>{value}</div>
      <div className={`text-[12px] font-semibold ${cfg.labelCls} mt-1.5`}>{label}</div>
      <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">{sublabel}</div>
    </div>
  );
}

function CopilotWelcome() {
  return (
    <CopilotBar>
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Sparkles className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
          </span>
          <span className="text-[11px] font-semibold text-slate-900">Copilot</span>
          <span className="text-[10px] text-slate-500">· grounded in {SESSION.predecessor}'s handover</span>
        </div>
        <p className="text-[12px] text-slate-600 leading-relaxed">
          I'll answer anything about your role, what you're inheriting, or how the team works. Every answer cites where it came from.
        </p>
      </div>
      <div className="px-4 py-2.5">
        <div className="text-[9px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-2">Try starting with</div>
        <div className="flex flex-wrap gap-1.5">
          <QuickChip>What's the most important thing to learn this week?</QuickChip>
          <QuickChip>Who do I talk to about Vendor XYZ?</QuickChip>
          <QuickChip>Show me the on-call rotation</QuickChip>
        </div>
      </div>
      <CopilotInput placeholder="Ask anything · the graph is listening..." />
    </CopilotBar>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S2 · Reading Section 3 · Project Atlas
   ═══════════════════════════════════════════════════════════════════ */

function S2ReadingAtlas() {
  return (
    <TwoPaneLayout>
      <LeftPane>
        <ReadingHeader />
        <article className="space-y-5">
          <EyebrowPill>
            <Hash className="w-3 h-3" strokeWidth={2.5} />
            Section 3 of 8 · Project Atlas
          </EyebrowPill>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight" style={{ fontFamily: FONT_STACK }}>
            You're inheriting <span className="bg-gradient-to-br from-indigo-500 to-violet-600 bg-clip-text text-transparent">Project Atlas</span> from {SESSION.predecessor}.
          </h1>

          <p className="text-[15px] text-slate-700 leading-relaxed">
            Project Atlas is the platform's <Entity>order-routing layer</Entity> — about 60% of peak transactions flow through it. {SESSION.predecessor} led it for 8 months. You'll inherit ownership on his last day.
          </p>

          <CalloutCard kind="redflag" icon={AlertOctagon}>
            <CalloutHeader>Red flag · Payment Gateway timeout</CalloutHeader>
            <p>
              A recurring incident with <strong>no runbook</strong>. <Entity>Minh Le</Entity> shared the fix verbally · 4 tickets in 6 months. The runbook only mentions the timeout bump, but the real fix needs <strong>both</strong> the timeout bump AND a listener restart. See Section 4 for the full unwritten procedure.
            </p>
          </CalloutCard>

          <CalloutCard kind="unwritten" icon={Bookmark}>
            <CalloutHeader>Unwritten rules — Project Atlas deployments</CalloutHeader>
            <ul className="space-y-1.5 mt-1">
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-yellow-500 shrink-0 mt-1.5" />
                <span>Production rollbacks <strong>always go through staging first</strong> — never deploy directly to production, even with a snapshot. The wiki is wrong about this.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-yellow-500 shrink-0 mt-1.5" />
                <span>Never deploy Atlas on Fridays — team agreement since the Q3 incident, not company policy.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-yellow-500 shrink-0 mt-1.5" />
                <span>When the partition lock holds for &gt;90s, check <Entity>Datadog</Entity> for the listener heartbeat before anything else.</span>
              </li>
            </ul>
          </CalloutCard>

          <CalloutCard kind="canonical" icon={Award}>
            <CalloutHeader>Canonical · Atlas rollback procedure</CalloutHeader>
            <ol className="space-y-1.5 mt-1 list-decimal pl-5">
              <li>Snapshot <span style={{ fontFamily: MONO_STACK }} className="text-[12px] bg-emerald-100/60 px-1 rounded">Cosmos partition</span> keyed by <span style={{ fontFamily: MONO_STACK }} className="text-[12px] bg-emerald-100/60 px-1 rounded">org</span>.</li>
              <li>Run the migration playbook against <strong>staging first</strong> — never production directly.</li>
              <li>Verify schema integrity before promoting.</li>
            </ol>
            <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-emerald-700/80">
              <Check className="w-3 h-3" strokeWidth={2.5} />
              Verified by {SESSION.predecessor} during interview · committed to KG on May 16
            </div>
          </CalloutCard>

          <SourceFooter sources={[
            { name: `${SESSION.predecessor} interview`, detail: "topic 3 · transcript 09:14–12:42", verified: true },
            { name: "Atlas wiki · v2.3", detail: "Trello board · Atlas-Docs · last edit 2 weeks ago" },
            { name: "Incident log INC-2942", detail: "Q3 Friday deployment freeze · post-mortem" },
          ]} />

          <SectionProgressFooter />
        </article>
      </LeftPane>

      <RightStack
        graph={<GlobalGraph focus="atlas" view="around-your-role" highlight={["atlas"]} />}
        copilot={<CopilotResting />}
      />
    </TwoPaneLayout>
  );
}

function ReadingHeader() {
  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
      <div className="flex items-center gap-2 text-[11px] text-slate-500">
        <span>Your playbook</span>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <span className="text-slate-900 font-medium">Section 3 · Project Atlas</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-slate-500" style={{ fontFamily: MONO_STACK }}>{SESSION.currentSection} / {SESSION.totalSections}</span>
        <ReadingProgressBar value={SESSION.currentSection} max={SESSION.totalSections} />
      </div>
    </div>
  );
}

function ReadingProgressBar({ value, max }) {
  const pct = (value / max) * 100;
  return (
    <div className="w-32 h-1.5 rounded-full bg-gray-100 overflow-hidden">
      <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: `${pct}%` }} />
    </div>
  );
}

function SectionProgressFooter() {
  return (
    <div className="mt-8 pt-5 border-t border-gray-100 flex items-center justify-between gap-4 flex-wrap">
      <div className="text-[11px] text-slate-500">
        Reading time so far · <span className="text-slate-900 font-semibold" style={{ fontFamily: MONO_STACK }}>11 min</span> · 1 of 3 callouts marked
      </div>
      <div className="flex items-center gap-2">
        <SecondaryButton>
          <ChevronLeft className="w-3 h-3" strokeWidth={2} />
          Section 2
        </SecondaryButton>
        <PrimaryButton>
          Section 4 · Payment Gateway
          <ChevronRight className="w-3.5 h-3.5" strokeWidth={2} />
        </PrimaryButton>
      </div>
    </div>
  );
}

function CopilotResting() {
  return (
    <CopilotBar>
      <div className="px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Sparkles className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
          </span>
          <span className="text-[11px] font-semibold text-slate-900">Copilot · listening</span>
        </div>
        <span className="text-[9px] text-slate-500" style={{ fontFamily: MONO_STACK }}>~ Atlas focus</span>
      </div>
      <div className="px-4 pb-2.5">
        <div className="flex flex-wrap gap-1.5">
          <QuickChip><AlertTriangle className="w-3 h-3" />Show Atlas risks</QuickChip>
          <QuickChip><Users className="w-3 h-3" />Who else worked on it?</QuickChip>
          <QuickChip><Clock className="w-3 h-3" />Recent changes</QuickChip>
        </div>
      </div>
      <CopilotInput placeholder="Ask about anything you just read..." />
    </CopilotBar>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S3 · Entity mini-card hover (0-token pre-computed short_summary)
   ═══════════════════════════════════════════════════════════════════ */

function S3EntityHover() {
  return (
    <TwoPaneLayout>
      <LeftPane>
        <ReadingHeader />
        <article className="space-y-5 relative">
          <EyebrowPill>
            <Hash className="w-3 h-3" strokeWidth={2.5} />
            Section 3 of 8 · Project Atlas
          </EyebrowPill>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight" style={{ fontFamily: FONT_STACK }}>
            You're inheriting <span className="bg-gradient-to-br from-indigo-500 to-violet-600 bg-clip-text text-transparent">Project Atlas</span>.
          </h1>

          <p className="text-[15px] text-slate-700 leading-relaxed">
            Project Atlas is the platform's <Entity>order-routing layer</Entity>. The most fragile dependency is the <EntityHover>Payment Gateway</EntityHover> — recurring timeouts surface there more than anywhere else.
          </p>

          <EntityMiniCard
            label="Payment Gateway"
            tier="canonical"
            summary="External payment processor · 4 incidents in 6 months · runbook exists but incomplete · fix needs both timeout bump AND listener restart."
            related={[
              { icon: Folder, label: "Payment-Service-Docs", kind: "doc" },
              { icon: AlertOctagon, label: "INC-2942 · Q3 outage", kind: "incident" },
              { icon: Users, label: SESSION.predecessor, kind: "person" },
            ]}
            stats={[
              { label: "Owners", value: "1" },
              { label: "Linked tickets", value: "23" },
              { label: "Last incident", value: "11 days ago" },
            ]}
          />

          <p className="text-[15px] text-slate-700 leading-relaxed">
            Most of the institutional memory about the timeout fix lives in <Entity>{SESSION.predecessor}'s</Entity> head and a few Trello comments. The Knowledge Graph caught what we could · the rest will be on you to absorb and re-document.
          </p>

          <SourceFooter sources={[
            { name: `${SESSION.predecessor} interview`, detail: "topic 3 · transcript 09:14–12:42", verified: true },
            { name: "Atlas wiki · v2.3", detail: "Trello board · last edit 2 weeks ago" },
          ]} />
        </article>
      </LeftPane>

      <RightStack
        graph={<GlobalGraph focus="atlas" view="around-your-role" highlight={["payment-gateway"]} />}
        copilot={<CopilotResting />}
      />
    </TwoPaneLayout>
  );
}

function EntityHover({ children }) {
  return (
    <span className="relative inline-block">
      <span className="text-indigo-700 font-medium border-b-2 border-indigo-400 cursor-pointer">{children}</span>
    </span>
  );
}

function EntityMiniCard({ label, tier, summary, related, stats }) {
  const tierConfig = {
    canonical: { ring: "border-emerald-300", badge: "bg-emerald-50 border-emerald-200 text-emerald-700", badgeLabel: "Canonical" },
    verified: { ring: "border-indigo-300", badge: "bg-indigo-50 border-indigo-200 text-indigo-700", badgeLabel: "Verified" },
  }[tier];
  return (
    <div className="relative -mt-1 mb-1 ml-4">
      <div className={`bg-white/95 backdrop-blur-md border ${tierConfig.ring} rounded-2xl shadow-xl shadow-indigo-900/[0.08] p-4 max-w-md inline-block`}>
        <div className="flex items-start justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500/10 to-violet-600/10 border border-indigo-200 flex items-center justify-center">
              <Cpu className="w-3.5 h-3.5 text-indigo-700" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">{label}</h3>
              <div className="text-[9px] text-slate-500 uppercase tracking-wider">Service · external</div>
            </div>
          </div>
          <span className={`text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-semibold border ${tierConfig.badge} inline-flex items-center gap-1`}>
            <Check className="w-2.5 h-2.5" strokeWidth={2.5} />
            {tierConfig.badgeLabel}
          </span>
        </div>

        <p className="text-[12px] text-slate-700 leading-relaxed mb-3">{summary}</p>

        <div className="grid grid-cols-3 gap-2 mb-3 pb-3 border-b border-gray-100">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-sm font-bold text-slate-900" style={{ fontFamily: MONO_STACK }}>{s.value}</div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            {related.slice(0, 2).map((r, i) => (
              <span key={i} className="inline-flex items-center gap-1 text-[10px] text-slate-600 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded-md">
                <r.icon className="w-2.5 h-2.5 text-slate-500" strokeWidth={1.75} />
                {r.label}
              </span>
            ))}
            {related.length > 2 && (
              <span className="text-[10px] text-slate-500 px-1.5 py-0.5">+{related.length - 2}</span>
            )}
          </div>
          <button className="text-[10px] text-indigo-700 hover:text-indigo-900 font-semibold inline-flex items-center gap-1 cursor-pointer">
            Focus in graph
            <ArrowUpRight className="w-2.5 h-2.5" strokeWidth={2.5} />
          </button>
        </div>

        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center gap-1.5 text-[9px] text-slate-500">
          <Sparkles className="w-2.5 h-2.5 text-indigo-500" strokeWidth={2} />
          Pre-computed summary · 0 tokens · hover anytime
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S4 · Graph node double-click → 2-hop expand
   ═══════════════════════════════════════════════════════════════════ */

function S4GraphExpand() {
  return (
    <TwoPaneLayout>
      <LeftPane>
        <ReadingHeader />
        <article className="space-y-5">
          <EyebrowPill>
            <Hash className="w-3 h-3" strokeWidth={2.5} />
            Section 3 of 8 · Project Atlas
          </EyebrowPill>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight" style={{ fontFamily: FONT_STACK }}>
            You're inheriting <span className="bg-gradient-to-br from-indigo-500 to-violet-600 bg-clip-text text-transparent">Project Atlas</span>.
          </h1>

          <p className="text-[15px] text-slate-700 leading-relaxed">
            Atlas connects to a wider web of services and people · double-click any node in the graph on the right to see what it touches. The default view is 1-hop · expand to see who else worked on these things.
          </p>

          <div className="rounded-2xl bg-indigo-50/40 border border-indigo-200/60 p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-indigo-200 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-indigo-600" strokeWidth={1.75} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-900 mb-1">You just expanded Atlas's branch</h3>
                <p className="text-[12px] text-slate-600 leading-relaxed">
                  The graph went from 1-hop (Atlas + 5 direct neighbors) to 2-hop (15 nodes). One node is locked · click it to see what kind of access it requires.
                </p>
                <div className="flex items-center gap-3 mt-2.5 text-[10px] text-slate-500" style={{ fontFamily: MONO_STACK }}>
                  <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> 14 visible</span>
                  <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> 1 lock-stub (tier 1)</span>
                  <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gray-300" /> ~ 3 ghosted (tier 2)</span>
                </div>
              </div>
            </div>
          </div>

          <SourceFooter sources={[
            { name: `${SESSION.predecessor} interview`, detail: "topic 3 · transcript 09:14–12:42", verified: true },
            { name: "Atlas wiki · v2.3", detail: "Trello board · last edit 2 weeks ago" },
          ]} />
        </article>
      </LeftPane>

      <RightStack
        graph={<GlobalGraph focus="atlas" view="around-your-role" expanded highlight={["atlas"]} />}
        copilot={<CopilotResting />}
      />
    </TwoPaneLayout>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S5 · Tier 1 Lock stub clicked → Request access modal
   ═══════════════════════════════════════════════════════════════════ */

function S5LockStub() {
  return (
    <TwoPaneLayout>
      <LeftPane>
        <ReadingHeader />
        <article className="space-y-5">
          <EyebrowPill>
            <Hash className="w-3 h-3" strokeWidth={2.5} />
            Section 3 of 8 · Project Atlas
          </EyebrowPill>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight" style={{ fontFamily: FONT_STACK }}>
            You're inheriting <span className="bg-gradient-to-br from-indigo-500 to-violet-600 bg-clip-text text-transparent">Project Atlas</span>.
          </h1>

          <p className="text-[15px] text-slate-700 leading-relaxed">
            Some nodes in the graph carry restricted content — you can see they exist, but you can't read the content until access is granted. This is by design · the graph never hides existence, it just gates what you can read.
          </p>

          <LockStubModal
            label="Compensation framework v3"
            tier={1}
            tags={["[Finance]", "[Restricted]"]}
            reason={`This node is tagged Finance/Restricted · part of People Operations' compensation workstream led by Khanh Linh Tran. ${SESSION.predecessor} touched it through one Trello board he was added to, but the contents are not in your read-scope.`}
            note="Tier 1 nodes always render as Lock stubs — you can request access from the node's current owner."
          />

          <p className="text-[15px] text-slate-700 leading-relaxed">
            Tier 2 nodes (highly sensitive · e.g. <span className="text-rose-700 font-semibold">[Legal]</span> or active <span className="text-rose-700 font-semibold">[Risk]</span> matters) are <strong>ghosted entirely</strong> — they don't appear in your graph at all. If a node isn't shown, it's either Tier 2 in another scope, or it doesn't exist.
          </p>

          <SourceFooter sources={[
            { name: `${SESSION.predecessor} interview`, detail: "topic 3 · transcript", verified: true },
          ]} />
        </article>
      </LeftPane>

      <RightStack
        graph={<GlobalGraph focus="atlas" view="around-your-role" expanded showLockHighlight />}
        copilot={<CopilotResting />}
      />
    </TwoPaneLayout>
  );
}

function LockStubModal({ label, tier, tags, reason, note }) {
  return (
    <div className="rounded-2xl bg-white/90 backdrop-blur-md border-2 border-yellow-200 shadow-xl shadow-yellow-900/[0.08] overflow-hidden">
      <div className="bg-yellow-50/60 border-b border-yellow-200 px-5 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white border border-yellow-300 flex items-center justify-center shrink-0">
          <Lock className="w-4 h-4 text-yellow-700" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h3 className="text-sm font-semibold text-slate-900">{label}</h3>
            <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-yellow-100 border border-yellow-300 text-yellow-800">Tier {tier} · Lock</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {tags.map((t, i) => (
              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-md bg-white border border-gray-200 text-slate-600" style={{ fontFamily: MONO_STACK }}>{t}</span>
            ))}
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-700 p-1">
          <X className="w-4 h-4" strokeWidth={1.75} />
        </button>
      </div>

      <div className="px-5 py-4 space-y-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-1.5">Why is this locked?</div>
          <p className="text-[12px] text-slate-700 leading-relaxed">{reason}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 py-2">
          <LockStat label="Node type" value="Document set" />
          <LockStat label="Owner" value="Khanh Linh T." />
          <LockStat label="Connected to" value="3 of your sections" />
        </div>

        <div className="rounded-xl bg-yellow-50/40 border border-yellow-100 px-3 py-2 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-yellow-700 shrink-0 mt-0.5" strokeWidth={1.75} />
          <p className="text-[11px] text-yellow-900/80 leading-relaxed">{note}</p>
        </div>

        <div className="flex items-center justify-between gap-2 pt-2">
          <button className="text-[11px] text-slate-500 hover:text-slate-700 inline-flex items-center gap-1 cursor-pointer">
            <Eye className="w-3 h-3" strokeWidth={1.75} />
            Why is this restricted?
          </button>
          <div className="flex items-center gap-2">
            <SecondaryButton><X className="w-3 h-3" />Close</SecondaryButton>
            <PrimaryButton>
              <KeyRound className="w-3 h-3" strokeWidth={2} />
              Request access from Khanh Linh
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function LockStat({ label, value }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white/80 px-2.5 py-2">
      <div className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">{label}</div>
      <div className="text-[12px] font-semibold text-slate-900 mt-0.5 truncate">{value}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S6 · Copilot · Prompt Disambiguation chips
   ═══════════════════════════════════════════════════════════════════ */

function S6Disambiguation() {
  return (
    <TwoPaneLayout>
      <LeftPane>
        <ReadingHeader />
        <article className="space-y-5">
          <EyebrowPill>
            <Hash className="w-3 h-3" strokeWidth={2.5} />
            Section 3 of 8 · Project Atlas
          </EyebrowPill>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight" style={{ fontFamily: FONT_STACK }}>
            You're inheriting <span className="bg-gradient-to-br from-indigo-500 to-violet-600 bg-clip-text text-transparent">Project Atlas</span>.
          </h1>

          <p className="text-[15px] text-slate-700 leading-relaxed">
            You can also ask the Copilot anything — it's grounded in {SESSION.predecessor}'s handover. Broad questions get a clarifier · narrow ones get a grounded answer.
          </p>

          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/30 p-4">
            <div className="text-[10px] uppercase tracking-[0.18em] text-indigo-700 font-semibold mb-2">Why does the AI ask before answering?</div>
            <p className="text-[12px] text-slate-700 leading-relaxed">
              Atlas has a lot connected to it · risks, people, recent changes, deployment story. Pulling the whole graph for every broad question would burn tokens and bury the answer in noise. So the Copilot asks one quick clarifying question first · just one click and you get exactly the slice you wanted.
            </p>
          </div>
        </article>
      </LeftPane>

      <RightStack
        graph={<GlobalGraph focus="atlas" view="around-your-role" dim />}
        copilot={<CopilotDisambiguation />}
      />
    </TwoPaneLayout>
  );
}

function CopilotDisambiguation() {
  return (
    <CopilotBar elevated>
      <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-2">
        <span className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
          <Sparkles className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
        </span>
        <span className="text-[11px] font-semibold text-slate-900">Copilot</span>
        <span className="text-[10px] text-slate-500">· grounded in {SESSION.predecessor}'s handover</span>
      </div>

      <div className="px-4 py-3 space-y-3 max-h-[280px] overflow-y-auto">
        <UserMessage>Tell me about Project Atlas.</UserMessage>

        <CopilotMessage>
          <p className="text-[12px] text-slate-700 leading-relaxed mb-3">
            Project Atlas has a lot connected to it — let me ask which slice you want, so I don't bury the answer in noise. Pick one and I'll fetch just that subgraph:
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            <DisambigChip icon={AlertTriangle} label="Risk areas" detail="3 known risks · what could break" tone="rose" />
            <DisambigChip icon={Users} label="Stakeholders" detail={`Who works on this besides ${SESSION.predecessor}`} tone="indigo" />
            <DisambigChip icon={Clock} label="Recent timeline" detail="Last 30 days of changes" tone="indigo" />
            <DisambigChip icon={GitBranch} label="How to deploy" detail="Rollback + Friday rule" tone="emerald" />
          </div>
          <div className="mt-2.5 text-[9px] text-slate-500 inline-flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-indigo-500" strokeWidth={2} />
            Each chip is a focused query · ~ 200 tokens · the broad query would be ~ 5,000
          </div>
        </CopilotMessage>
      </div>

      <CopilotInput placeholder="Or type a more specific question..." />
    </CopilotBar>
  );
}

function DisambigChip({ icon: Icon, label, detail, tone }) {
  const cfg = {
    rose: { ring: "border-rose-200 hover:border-rose-400", iconCls: "text-rose-600 bg-rose-50" },
    indigo: { ring: "border-indigo-200 hover:border-indigo-400", iconCls: "text-indigo-600 bg-indigo-50" },
    emerald: { ring: "border-emerald-200 hover:border-emerald-400", iconCls: "text-emerald-600 bg-emerald-50" },
  }[tone];
  return (
    <button className={`text-left rounded-xl bg-white border ${cfg.ring} p-2.5 transition-all cursor-pointer hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}>
      <div className="flex items-start gap-2">
        <div className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 ${cfg.iconCls} border-current/20`}>
          <Icon className="w-3 h-3" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-semibold text-slate-900 leading-tight">{label}</div>
          <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">{detail}</div>
        </div>
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S7 · Copilot · grounded answer with source chips
   ═══════════════════════════════════════════════════════════════════ */

function S7GroundedAnswer() {
  return (
    <TwoPaneLayout>
      <LeftPane>
        <ReadingHeader />
        <article className="space-y-5">
          <EyebrowPill>
            <Hash className="w-3 h-3" strokeWidth={2.5} />
            Section 3 of 8 · Project Atlas
          </EyebrowPill>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight" style={{ fontFamily: FONT_STACK }}>
            You're inheriting <span className="bg-gradient-to-br from-indigo-500 to-violet-600 bg-clip-text text-transparent">Project Atlas</span>.
          </h1>

          <p className="text-[15px] text-slate-700 leading-relaxed">
            Every Copilot answer cites where it came from · interview transcript timestamps, Trello cards, wiki pages, incident reports. If a fact has no source chip, it doesn't come back. The graph also focuses to show you the cited nodes.
          </p>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-emerald-200 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 text-emerald-700" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1">3 risks confirmed · 2 canonical, 1 contested</h3>
              <p className="text-[12px] text-slate-600 leading-relaxed">
                Copilot pulled the Risk subgraph and surfaced 3 known risks. The graph on the right is now centered on Atlas with risk-linked nodes outlined in rose · canonical risks have an emerald check, the contested one is flagged yellow until {SESSION.manager} reviews the most recent flag.
              </p>
            </div>
          </div>
        </article>
      </LeftPane>

      <RightStack
        graph={<GlobalGraph focus="atlas" view="around-your-role" mode="risks" />}
        copilot={<CopilotGroundedAnswer />}
      />
    </TwoPaneLayout>
  );
}

function CopilotGroundedAnswer() {
  return (
    <CopilotBar elevated>
      <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-2">
        <span className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
          <Sparkles className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
        </span>
        <span className="text-[11px] font-semibold text-slate-900">Copilot</span>
        <span className="text-[10px] text-slate-500">· risks · 4 sources</span>
        <span className="ml-auto text-[9px] text-emerald-700 font-semibold uppercase tracking-wider inline-flex items-center gap-1">
          <Check className="w-2.5 h-2.5" strokeWidth={2.5} />
          High confidence
        </span>
      </div>

      <div className="px-4 py-3 space-y-3 max-h-[300px] overflow-y-auto">
        <UserMessage>Risk areas</UserMessage>

        <CopilotMessage>
          <p className="text-[12px] text-slate-700 leading-relaxed mb-2.5">
            Three known risk areas for Project Atlas, ranked by how often they've surfaced in {SESSION.predecessor}'s last 6 months:
          </p>
          <ol className="space-y-2 mb-3">
            <RiskListItem
              rank={1}
              label="Payment Gateway timeout"
              detail="4 incidents · no complete runbook · undocumented listener-restart step"
              tier="canonical"
            />
            <RiskListItem
              rank={2}
              label="Vendor XYZ renewal SLA penalty clause"
              detail="Verbal commitment from vendor not in contract · negotiated by Minh"
              tier="canonical"
            />
            <RiskListItem
              rank={3}
              label="Cosmos partition lock cascade"
              detail="Flagged contested · network member disputes the diagnosis last week"
              tier="contested"
            />
          </ol>
          <SourceChipRow sources={[
            { label: `${SESSION.predecessor} interview`, kind: "transcript", ts: "May 14" },
            { label: "Atlas wiki v2.3", kind: "doc" },
            { label: "INC-2942 post-mortem", kind: "incident" },
            { label: "Trello · Atlas-Risks", kind: "board" },
          ]} />
        </CopilotMessage>
      </div>

      <CopilotInput placeholder="Ask a follow-up · narrowed to risks..." />
    </CopilotBar>
  );
}

function RiskListItem({ rank, label, detail, tier }) {
  const tierConfig = {
    canonical: { dotCls: "bg-emerald-500", labelTone: "" },
    contested: { dotCls: "bg-yellow-500", labelTone: "" },
  }[tier];
  return (
    <li className="flex items-start gap-2.5 text-[11px]">
      <span className="w-5 h-5 rounded-md bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0 text-[9px] font-bold text-rose-700" style={{ fontFamily: MONO_STACK }}>{rank}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-slate-900">{label}</span>
          <span className={`w-1.5 h-1.5 rounded-full ${tierConfig.dotCls}`} />
          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">{tier}</span>
        </div>
        <div className="text-[11px] text-slate-600 mt-0.5 leading-snug">{detail}</div>
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
    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-gray-100">
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

/* ═══════════════════════════════════════════════════════════════════
   S8 · Quick Check at section end · feeds UC-ON-03 Skill Gap
   ═══════════════════════════════════════════════════════════════════ */

function S8QuickCheck() {
  return (
    <TwoPaneLayout>
      <LeftPane>
        <ReadingHeader />
        <article className="space-y-5">
          <div className="rounded-2xl border-2 border-indigo-300 bg-gradient-to-br from-indigo-50/40 to-white p-6 shadow-lg shadow-indigo-900/[0.06]">
            <EyebrowPill>
              <Sparkles className="w-3 h-3" strokeWidth={2.5} />
              Quick check · feeds your Skill Gap
            </EyebrowPill>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mt-3 mb-2" style={{ fontFamily: FONT_STACK }}>
              Three questions about <span className="bg-gradient-to-br from-indigo-500 to-violet-600 bg-clip-text text-transparent">Section 3</span>
            </h2>

            <p className="text-[13px] text-slate-600 leading-relaxed mb-5">
              Quick way to check what stuck and what didn't. Your answers feed UC-ON-03 · we'll surface a personalized growth plan after you finish all 8 sections.
            </p>

            <div className="space-y-4">
              <CheckQuestion
                n={1}
                question="What's the trap door in the Atlas rollback procedure?"
                options={[
                  { text: "Forgetting the staging step", correct: true },
                  { text: "Not snapshotting the partition" },
                  { text: "Running it on a Friday" },
                  { text: "Schema verification" },
                ]}
              />

              <CheckQuestion
                n={2}
                question="Who do you talk to about the Vendor XYZ renewal?"
                options={[
                  { text: "Sales team" },
                  { text: `${SESSION.predecessor} (before he leaves) and then ${SESSION.manager}`, correct: true },
                  { text: "Legal directly" },
                  { text: "The vendor's account manager" },
                ]}
              />

              <CheckQuestion
                n={3}
                question="What's the recurring Payment Gateway incident not captured in the runbook?"
                options={[
                  { text: "The timeout value is too high" },
                  { text: "The fix needs BOTH the timeout bump AND a listener restart", correct: true },
                  { text: "Datadog is misconfigured" },
                  { text: "The partition key is wrong" },
                ]}
              />
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-indigo-100">
              <div className="text-[11px] text-slate-500 inline-flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-indigo-600" strokeWidth={2} />
                Your answers don't affect anything · they only shape your growth plan
              </div>
              <PrimaryButton>
                Submit and continue
                <ChevronRight className="w-3.5 h-3.5" strokeWidth={2} />
              </PrimaryButton>
            </div>
          </div>
        </article>
      </LeftPane>

      <RightStack
        graph={<GlobalGraph focus="atlas" view="around-your-role" dim />}
        copilot={<CopilotResting />}
      />
    </TwoPaneLayout>
  );
}

function CheckQuestion({ n, question, options }) {
  return (
    <div className="rounded-xl bg-white border border-gray-200 p-4">
      <div className="flex items-start gap-3 mb-3">
        <span className="w-6 h-6 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center justify-center shrink-0 text-[10px] font-bold text-indigo-700" style={{ fontFamily: MONO_STACK }}>{n}</span>
        <h4 className="text-sm font-semibold text-slate-900 leading-snug pt-0.5">{question}</h4>
      </div>
      <div className="space-y-1.5 ml-9">
        {options.map((opt, i) => (
          <button
            key={i}
            className="w-full text-left rounded-lg border border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors px-3 py-2 flex items-center gap-2.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <span className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
            <span className="text-[12px] text-slate-700 flex-1">{opt.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Global Knowledge Graph · SVG render · Progressive Disclosure
   Same graph the Colleague and Manager see, this is the Newcomer lens
   ═══════════════════════════════════════════════════════════════════ */

function GlobalGraph({ focus, view, expanded, highlight = [], mode, dim, showLockHighlight }) {
  // Node positions for the 1-hop view (around Project Atlas) ─ small, focused.
  // Coordinates are within a 600x420 viewBox.
  const oneHopNodes = [
    { id: "atlas", label: "Project Atlas", kind: "project", x: 300, y: 210, primary: true },
    { id: "you", label: SESSION.reader.split(" ").slice(-1)[0], handle: "you", kind: "person-self", x: 130, y: 130 },
    { id: "minh", label: "Minh Le", handle: SESSION.predecessorHandle, kind: "person", x: 130, y: 290, predecessor: true },
    { id: "payment-gateway", label: "Payment Gateway", kind: "service", x: 470, y: 130, canonical: true },
    { id: "vendor-xyz", label: "Vendor XYZ", kind: "vendor", x: 470, y: 290 },
    { id: "atlas-docs", label: "Atlas wiki", kind: "doc", x: 300, y: 60 },
    { id: "incident", label: "INC-2942", kind: "incident", x: 300, y: 360, contested: true },
  ];

  // 2-hop additions (only shown when expanded === true)
  const twoHopNodes = [
    { id: "cosmos", label: "Cosmos · order-partition", kind: "service", x: 40, y: 60, canonical: true },
    { id: "datadog", label: "Datadog · alerts", kind: "service", x: 40, y: 360 },
    { id: "compensation-fw", label: "Compensation FW v3", kind: "lock", x: 560, y: 60, tier1: true },
    { id: "renewal-doc", label: "XYZ renewal · drive", kind: "doc", x: 560, y: 360 },
    { id: "khanh", label: "Khanh Linh", handle: "@khanh.linh", kind: "person", x: 380, y: 30 },
    { id: "phuong-anh", label: "Phuong Anh", handle: "@phuong.anh", kind: "person", x: 380, y: 390 },
    { id: "platform-team", label: "Platform team", kind: "group", x: 230, y: 30 },
    { id: "atlas-rollback", label: "Atlas rollback procedure", kind: "doc", x: 230, y: 390, canonical: true },
  ];

  const edges1 = [
    { from: "atlas", to: "you", label: "you'll own" },
    { from: "atlas", to: "minh", label: "owned by" },
    { from: "atlas", to: "payment-gateway", label: "depends on" },
    { from: "atlas", to: "vendor-xyz", label: "contracts" },
    { from: "atlas", to: "atlas-docs", label: "documented in" },
    { from: "atlas", to: "incident", label: "incident · last Q3" },
  ];
  const edges2 = [
    { from: "payment-gateway", to: "cosmos", dashed: true },
    { from: "incident", to: "datadog" },
    { from: "vendor-xyz", to: "renewal-doc" },
    { from: "vendor-xyz", to: "phuong-anh", label: "managed by" },
    { from: "minh", to: "atlas-rollback" },
    { from: "minh", to: "platform-team" },
    { from: "atlas-docs", to: "platform-team" },
    { from: "vendor-xyz", to: "compensation-fw", dashed: true, locked: true },
    { from: "compensation-fw", to: "khanh" },
  ];

  const allNodes = expanded ? [...oneHopNodes, ...twoHopNodes] : oneHopNodes;
  const allEdges = expanded ? [...edges1, ...edges2] : edges1;
  const nodeById = Object.fromEntries(allNodes.map(n => [n.id, n]));

  return (
    <div className="relative h-full">
      <GraphHeader expanded={expanded} mode={mode} />

      <div className="absolute inset-0 top-[44px]">
        <svg viewBox="0 0 600 420" className={`w-full h-full ${dim ? "opacity-60" : ""}`} style={{ maxHeight: "calc(100% - 0px)" }}>
          {/* edges */}
          <g>
            {allEdges.map((edge, i) => {
              const from = nodeById[edge.from];
              const to = nodeById[edge.to];
              if (!from || !to) return null;
              const isDim = mode === "risks" && !(edge.from === "atlas" || edge.to === "atlas" || ["payment-gateway", "vendor-xyz", "incident"].includes(edge.from) || ["payment-gateway", "vendor-xyz", "incident"].includes(edge.to));
              const isHighlight = highlight.includes(edge.from) || highlight.includes(edge.to);
              const stroke = edge.locked ? "#fbbf24" : isHighlight ? "#6366F1" : "#cbd5e1";
              const strokeWidth = isHighlight ? 1.5 : 1;
              return (
                <g key={i} opacity={isDim ? 0.25 : 1}>
                  <line
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeDasharray={edge.dashed ? "3,3" : ""}
                  />
                </g>
              );
            })}
          </g>

          {/* nodes */}
          <g>
            {allNodes.map((n, i) => (
              <GraphNode
                key={n.id}
                node={n}
                isPrimary={n.primary}
                isFocus={focus === n.id}
                isHighlight={highlight.includes(n.id)}
                isLockHighlight={showLockHighlight && n.tier1}
                dimNonRisk={mode === "risks" && !["atlas", "payment-gateway", "vendor-xyz", "incident"].includes(n.id)}
              />
            ))}
          </g>
        </svg>
      </div>

      <GraphFooter expanded={expanded} />
    </div>
  );
}

function GraphHeader({ expanded, mode }) {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 px-3 py-2 flex items-center justify-between gap-2 border-b border-gray-100 bg-white/70 backdrop-blur-sm rounded-t-2xl">
      <div className="flex items-center gap-2">
        <Network className="w-3.5 h-3.5 text-indigo-700" strokeWidth={2} />
        <span className="text-[11px] font-semibold text-slate-900">Knowledge graph</span>
        {mode === "risks" && (
          <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700">Risk focus</span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <ViewModeChip label="Around your role" active />
        <ViewModeChip label="Cross-team" />
        <ViewModeChip label="Full" locked />
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

function GraphFooter({ expanded }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 px-3 py-1.5 border-t border-gray-100 bg-white/70 backdrop-blur-sm rounded-b-2xl flex items-center justify-between gap-2">
      <div className="flex items-center gap-3 text-[9px] text-slate-500">
        <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Service</span>
        <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-500" /> Person</span>
        <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded border border-emerald-500" /> Canonical</span>
        <span className="inline-flex items-center gap-1"><Lock className="w-2 h-2 text-yellow-700" strokeWidth={2.5} /> Tier 1</span>
      </div>
      <div className="flex items-center gap-1">
        <button className="p-1 rounded text-slate-400 hover:text-slate-700"><ZoomIn className="w-3 h-3" /></button>
        <button className="p-1 rounded text-slate-400 hover:text-slate-700"><Maximize2 className="w-3 h-3" /></button>
        <span className="text-[9px] text-slate-400 ml-1 px-1.5 py-0.5 rounded border border-gray-200" style={{ fontFamily: MONO_STACK }}>{expanded ? "2-hop · 15 nodes" : "1-hop · 7 nodes"}</span>
      </div>
    </div>
  );
}

function GraphNode({ node, isPrimary, isFocus, isHighlight, isLockHighlight, dimNonRisk }) {
  if (node.kind === "lock") {
    return (
      <g opacity={dimNonRisk ? 0.3 : 1}>
        <g transform={`translate(${node.x}, ${node.y})`}>
          {isLockHighlight && (
            <rect x={-32} y={-22} width={64} height={44} rx={11} fill="#fef3c7" stroke="#fbbf24" strokeWidth={2} strokeDasharray="3,3" />
          )}
          <rect x={-28} y={-18} width={56} height={36} rx={8} fill="#fffbeb" stroke="#fbbf24" strokeWidth={1.25} />
          <foreignObject x={-26} y={-16} width={52} height={32}>
            <div className="w-full h-full flex flex-col items-center justify-center gap-0.5">
              <Lock className="w-3 h-3 text-yellow-700" strokeWidth={2} />
              <span className="text-[8px] font-semibold text-yellow-800 leading-none">Locked</span>
            </div>
          </foreignObject>
        </g>
        <text x={node.x} y={node.y + 30} textAnchor="middle" className="text-[8px] fill-slate-600" style={{ fontFamily: FONT_STACK, fontWeight: 600 }}>{node.label}</text>
      </g>
    );
  }

  const config = {
    project: { fill: "#EEF0FF", stroke: "#6366F1", textColor: "#1e1b4b", radius: 32 },
    "person-self": { fill: "#ddd6fe", stroke: "#7C3AED", textColor: "#3b0764", radius: 22 },
    person: { fill: "#ede9fe", stroke: "#a78bfa", textColor: "#4c1d95", radius: 22 },
    service: { fill: node.canonical ? "#ecfdf5" : "#f1f5f9", stroke: node.canonical ? "#10b981" : "#94a3b8", textColor: "#0f172a", radius: 22 },
    vendor: { fill: "#fef9c3", stroke: "#eab308", textColor: "#713f12", radius: 22 },
    doc: { fill: node.canonical ? "#ecfdf5" : "#ffffff", stroke: node.canonical ? "#10b981" : "#cbd5e1", textColor: "#0f172a", radius: 20 },
    incident: { fill: node.contested ? "#fef9c3" : "#fff1f2", stroke: node.contested ? "#eab308" : "#f43f5e", textColor: "#881337", radius: 22 },
    group: { fill: "#f5f3ff", stroke: "#a78bfa", textColor: "#4c1d95", radius: 22 },
  }[node.kind] || { fill: "#fff", stroke: "#cbd5e1", textColor: "#475569", radius: 20 };

  const finalRadius = isPrimary ? 36 : config.radius;
  const finalStroke = isFocus || isHighlight ? "#6366F1" : config.stroke;
  const finalStrokeWidth = isFocus || isHighlight || isPrimary ? 2 : 1;
  const opacity = dimNonRisk ? 0.3 : 1;

  return (
    <g opacity={opacity}>
      {(isFocus || isHighlight) && (
        <circle cx={node.x} cy={node.y} r={finalRadius + 6} fill={config.stroke} opacity={0.12} />
      )}
      <circle cx={node.x} cy={node.y} r={finalRadius} fill={config.fill} stroke={finalStroke} strokeWidth={finalStrokeWidth} />
      {node.canonical && (
        <circle cx={node.x + finalRadius - 6} cy={node.y - finalRadius + 6} r={5} fill="#10b981" stroke="#fff" strokeWidth={1.5} />
      )}
      {node.contested && (
        <circle cx={node.x + finalRadius - 6} cy={node.y - finalRadius + 6} r={5} fill="#eab308" stroke="#fff" strokeWidth={1.5} />
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
  return (
    <div className="min-w-0">
      {children}
    </div>
  );
}

function RightStack({ graph, copilot }) {
  return (
    <aside className="flex flex-col gap-4 self-start lg:sticky lg:top-[180px]">
      <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg shadow-indigo-900/[0.04] h-[420px] relative overflow-hidden">
        {graph}
      </div>
      <div>{copilot}</div>
    </aside>
  );
}

function CopilotBar({ children, elevated }) {
  return (
    <div className={`rounded-2xl bg-white/90 backdrop-blur-md border ${elevated ? "border-indigo-200 shadow-xl shadow-indigo-900/[0.08]" : "border-gray-200 shadow-lg shadow-indigo-900/[0.04]"} overflow-hidden`}>
      {children}
    </div>
  );
}

function CopilotInput({ placeholder }) {
  return (
    <div className="px-3 py-2.5 border-t border-gray-100 bg-gradient-to-r from-indigo-50/30 to-violet-50/30">
      <div className="rounded-xl bg-white border border-gray-200 px-3 py-1.5 flex items-center gap-2 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/15 transition-colors">
        <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" strokeWidth={2} />
        <input
          placeholder={placeholder}
          className="flex-1 text-[12px] text-slate-900 placeholder:text-slate-400 bg-transparent outline-none min-w-0"
          style={{ fontFamily: FONT_STACK }}
        />
        <button className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shrink-0 cursor-pointer hover:brightness-110 transition-all shadow-sm">
          <Send className="w-3 h-3" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

function UserMessage({ children }) {
  return (
    <div className="flex justify-end">
      <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white px-3 py-1.5 text-[12px] max-w-xs">{children}</div>
    </div>
  );
}

function CopilotMessage({ children }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 mt-0.5">
        <Sparkles className="w-3 h-3 text-white" strokeWidth={2.5} />
      </span>
      <div className="flex-1 min-w-0 rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5">
        {children}
      </div>
    </div>
  );
}

function QuickChip({ children }) {
  return (
    <button className="text-[10px] text-slate-700 bg-white hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300 px-2 py-1 rounded-full inline-flex items-center gap-1 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
      {children}
    </button>
  );
}

function EyebrowPill({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] font-semibold text-indigo-700">
      {children}
    </span>
  );
}

function Entity({ children }) {
  return <span className="text-slate-900 font-semibold border-b-2 border-indigo-200 cursor-pointer hover:border-indigo-500 transition-colors">{children}</span>;
}

function CalloutCard({ kind, icon: Icon, children }) {
  const cfg = {
    redflag: { border: "border-rose-200", bg: "bg-rose-50/30", iconBg: "bg-rose-100 border-rose-200", iconColor: "text-rose-700", accent: "border-l-rose-500" },
    unwritten: { border: "border-yellow-200", bg: "bg-yellow-50/30", iconBg: "bg-yellow-100 border-yellow-200", iconColor: "text-yellow-700", accent: "border-l-yellow-500" },
    canonical: { border: "border-emerald-300", bg: "bg-emerald-50/30", iconBg: "bg-emerald-100 border-emerald-200", iconColor: "text-emerald-700", accent: "border-l-emerald-500" },
  }[kind];
  return (
    <div className={`rounded-2xl border ${cfg.border} ${cfg.bg} border-l-[3px] ${cfg.accent} p-4`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg ${cfg.iconBg} border flex items-center justify-center shrink-0`}>
          <Icon className={`w-4 h-4 ${cfg.iconColor}`} strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0 text-[13px] text-slate-700 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

function CalloutHeader({ children }) {
  return <h3 className="text-sm font-semibold text-slate-900 mb-1">{children}</h3>;
}

function SourceFooter({ sources }) {
  return (
    <div className="rounded-xl bg-gray-50/60 border border-gray-200 px-3 py-2.5">
      <div className="text-[9px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-2">Sources for this section</div>
      <div className="space-y-1.5">
        {sources.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1 text-[10px] text-indigo-700 bg-white border border-indigo-200 px-1.5 py-0.5 rounded-md font-medium">
              {s.verified && <Check className="w-2.5 h-2.5 text-emerald-600" strokeWidth={2.5} />}
              {s.name}
            </span>
            <span className="text-slate-500 truncate" style={{ fontFamily: MONO_STACK }}>{s.detail}</span>
          </div>
        ))}
      </div>
    </div>
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
