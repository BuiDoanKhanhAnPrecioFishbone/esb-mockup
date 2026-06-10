"use client";

import React from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, X,
  FileText, Database, Eye,
  AlertTriangle, AlertOctagon, Clock, CheckCircle2, Loader2,
  ArrowRight, MoreHorizontal, Trello,
  UploadCloud, History,
  UserPlus, Check
} from "lucide-react";

const FLOW = [
  { id: "ml-seeding",  label: "Minh Lê · Seeding",      trigger: "Phase 1 · Prepare · seeding from Trello (loading state)." },
  { id: "ml-scope",    label: "Minh Lê · Review scope",  trigger: "Phase 1 · Prepare · review crawl results and confirm stakeholders." },
];

const LIFECYCLE_PHASES = [
  { id: 1, key: "prepare", label: "Prepare", subStages: [
    { id: 1, label: "Setup confirmed" },
    { id: 2, label: "Context seeding" },
    { id: 3, label: "Knowledge map ready" },
  ] },
  { id: 2, key: "capture", label: "Capture", subStages: [
    { id: 4, label: "Questions assigned" },
    { id: 5, label: "Answering queue" },
    { id: 6, label: "Answers reviewed" },
  ] },
  { id: 3, key: "deliver", label: "Deliver", subStages: [
    { id: 7, label: "Committed to KG" },
    { id: 8, label: "Playbook delivered" },
  ] },
];

function getPhase(subStageId) {
  return LIFECYCLE_PHASES.find((p) => p.subStages.some((s) => s.id === subStageId));
}
function getSubStage(subStageId) {
  for (const p of LIFECYCLE_PHASES) {
    const s = p.subStages.find((x) => x.id === subStageId);
    if (s) return s;
  }
  return null;
}

const SESSIONS = {
  ml: {
    urlSlug: "minh-le", offboarder: "Minh Lê", role: "Senior Backend Engineer",
    dept: "Engineering", initials: "ML", subStageId: 3, daysLeft: 26,
    deadline: "June 30, 2026 · 17:00",
  },
};

const CRAWL_SUMMARY = { totalKept: 38, thinSkipped: 14, redacted: 2, gaps: 8 };

const CRAWL_CATEGORIES = [
  { label: "Architecture decisions",  count: 10, items: ["Migrate payment service to event-driven (Kafka)", "Replace REST gateway with GraphQL federation", "Adopt CQRS for order domain", "Database sharding strategy for tenant isolation"] },
  { label: "Bug/Hotfix resolutions",  count: 8,  items: ["Race condition in payment retry loop (#1247)", "Memory leak in WebSocket connection pool (#1183)", "Deadlock in concurrent inventory update (#1302)"] },
  { label: "Core Feature specs",      count: 7,  items: ["Real-time inventory sync across warehouses", "Multi-tenant API rate limiting", "Batch export pipeline for finance reconciliation", "Webhook delivery guarantee system"] },
  { label: "Code review patterns",    count: 5,  items: ["PR template enforcement for backend services", "Load test gate required before staging merge", "SQL migration review checklist"] },
  { label: "Infrastructure/DevOps",   count: 4,  items: ["Terraform modules for AKS cluster provisioning", "GitHub Actions CI/CD pipeline (replaced Jenkins)", "Datadog APM instrumentation for payment flow"] },
  { label: "Documentation/Runbooks",  count: 2,  items: ["Production incident response playbook", "On-call escalation matrix and rotation rules"] },
  { label: "Integration configs",     count: 2,  items: ["Stripe webhook endpoint configuration", "SAP ERP nightly sync job parameters"] },
];

const KNOWLEDGE_GAPS = [
  "Verbal agreements with Stripe on custom retry policy",
  "Why the order service bypasses the cache layer on weekends",
  "Undocumented manual step in the SAP reconciliation flow",
  "Performance tuning tricks for the Kafka consumer group",
  "Context behind the inventory service's 3-second timeout",
  "Cross-team API contract with the Data Platform team",
  "Rationale for the tech debt items deferred from Q1",
  "On-call war stories — recurring false-positive alerts and their workarounds",
];

const STAKEHOLDERS = [
  { id: "duy",   name: "Duy Nguyễn",   role: "Data Platform Engineer", cards: 18, detail: "5 Architecture · 3 Core Feature — co-owns Kafka pipeline + inventory sync", defaultChecked: true },
  { id: "linh",  name: "Linh Phạm",    role: "Frontend Engineer",      cards: 12, detail: "4 Core Feature · 2 Bug/Hotfix — consumes Minh's API gateway + webhooks", defaultChecked: true },
  { id: "thao",  name: "Thảo Vũ",      role: "Engineering Director",   cards: 7,  detail: "3 Architecture · 1 Infrastructure — approved sharding + CQRS decisions",  defaultChecked: true },
  { id: "huong", name: "Hương Trần",   role: "QA Lead",                cards: 9,  detail: "6 Bug/Hotfix · 2 Code Review — owns regression suite for payment flow",  defaultChecked: true },
  { id: "bao",   name: "Bảo Ngọc Lê",  role: "DevOps Engineer",        cards: 6,  detail: "4 Infrastructure · 2 Integration — maintains AKS + CI/CD Minh built",   defaultChecked: false },
  { id: "tung",  name: "Tùng Đặng",    role: "Product Manager",        cards: 4,  detail: "2 Core Feature · 1 Architecture — prioritized inventory sync + export",  defaultChecked: false },
];

const LOGS_SEEDING = [
  { ts: "14:36:24", actor: "Worker Agent",  text: "Trello board 'Backend Platform' scan complete · 24 cards kept · 11 thin skipped · 0 redacted" },
  { ts: "14:35:00", actor: "Planner Agent", text: "Applied 4-layer hard-filter to Minh Lê's Trello board" },
  { ts: "14:34:12", actor: "System",        text: "Connected to Trello · board 'Backend Platform' · authorized via Hà Vy's scope" },
  { ts: "14:33:45", actor: "System",        text: "Source configuration loaded · Trello (Engineering dept mapping) · 1 integration active" },
  { ts: "14:32:08", actor: "Hà Vy",         text: "Started handover session for Minh Lê · Senior Backend Engineer · last day Jul 4" },
];

const LOGS_SCOPE = [
  { ts: "14:41:03", actor: "System",        text: "Knowledge map ready · 8 gaps identified — topics with no Trello coverage" },
  { ts: "14:40:18", actor: "Worker Agent",  text: "Sensitive-content check passed · 2 cards redacted (contained API keys in comments)" },
  { ts: "14:39:50", actor: "Worker Agent",  text: "Label prioritization complete · Bug/Hotfix (8) · Architecture (10) · Core Feature (7)" },
  { ts: "14:38:44", actor: "Worker Agent",  text: "Content depth filter · 38 cards with description or comments kept · 14 title-only cards skipped" },
  { ts: "14:37:30", actor: "Worker Agent",  text: "Scanned lists · In Progress (6) · Review (4) · Done (42) · skipped Backlog (23) and To-Do (17)" },
  { ts: "14:36:00", actor: "Planner Agent", text: "Applied 4-layer hard-filter to Minh Lê's Trello board 'Backend Platform'" },
  { ts: "14:34:12", actor: "System",        text: "Connected to Trello · board 'Backend Platform' · authorized via Hà Vy's scope" },
  { ts: "14:33:45", actor: "System",        text: "Source configuration loaded · Trello (Engineering dept mapping) · 1 integration active" },
  { ts: "14:32:08", actor: "Hà Vy",         text: "Started handover session for Minh Lê · Senior Backend Engineer · last day Jul 4" },
];

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "data",     label: "Data" },
  { id: "logs",     label: "Logs" },
];

export default function SessionCommandView({ embedded = false, view = "ml-overview" } = {}) {
  const [stepIdx, setStepIdx] = React.useState(() => {
    const i = FLOW.findIndex((s) => s.id === view);
    return i >= 0 ? i : 0;
  });
  if (embedded) {
    const parts = view.split("-");
    const sessKey = parts[0] || "ml";
    const rawTab = parts[1] || "overview";
    const isScope = rawTab === "scope";
    const activeTab = ["data", "logs"].includes(rawTab) ? rawTab : "overview";
    const session = SESSIONS[sessKey];
    if (!session) return null;
    const sessionForView = isScope ? { ...session, subStageId: 3 } : session;
    return <CommandView session={sessionForView} activeTab={activeTab} />;
  }
  const step = FLOW[stepIdx];
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      <TopBar step={step} stepIdx={stepIdx} onJump={setStepIdx} />
      <main className="flex-1"><StepRenderer id={step.id} /></main>
      <FooterNav stepIdx={stepIdx} step={step} onChange={setStepIdx} />
    </div>
  );
}

function TopBar({ step, stepIdx, onJump }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="px-5 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0 shrink-0">
          <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
          <span className="text-gray-900 font-semibold tracking-[0.18em] text-xs" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>ART-EEP</span>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-xs text-gray-900 font-medium">Session command view</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {FLOW.map((s, i) => (
            <button key={s.id} onClick={() => onJump(i)} title={s.label}
              className={`h-7 px-2 rounded-md border text-[10px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${
                i === stepIdx ? "bg-violet-600 text-white border-violet-600" : "bg-white text-violet-700 border-violet-200 hover:border-violet-400"
              }`} style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{i + 1}</button>
          ))}
        </div>
      </div>
    </header>
  );
}

function FooterNav({ stepIdx, step, onChange }) {
  const atFirst = stepIdx === 0, atLast = stepIdx === FLOW.length - 1;
  return (
    <footer className="bg-white border-t border-gray-200 px-5 py-2.5 flex items-center justify-between sticky bottom-0 z-20">
      <button onClick={() => !atFirst && onChange(stepIdx - 1)} disabled={atFirst}
        className={`h-8 px-3 rounded-md text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${
          atFirst ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}>
        <ChevronLeft className="w-3.5 h-3.5" /> Previous
      </button>
      <div className="hidden sm:block text-[11px] text-gray-500 max-w-md text-center truncate px-3">{step.trigger}</div>
      <button onClick={() => !atLast && onChange(stepIdx + 1)} disabled={atLast}
        className={`h-8 px-3 rounded-md text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30 ${
          atLast ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-700 text-white"}`}>
        Next <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </footer>
  );
}

function StepRenderer({ id }) {
  if (id === "ml-seeding") return <CommandView session={{ ...SESSIONS.ml, subStageId: 2 }} activeTab="overview" />;
  if (id === "ml-scope")   return <CommandView session={SESSIONS.ml} activeTab="overview" />;
  return null;
}

function CommandView({ session, activeTab }) {
  return (
    <div className="max-w-7xl mx-auto">
      <Hero session={session} />
      <TabBar session={session} activeTab={activeTab} />
      <div className="grid grid-cols-[1fr_280px] gap-5 p-6">
        <div className="min-w-0">
          {activeTab === "overview" && <OverviewTab session={session} />}
          {activeTab === "data"     && <DataTab session={session} />}
          {activeTab === "logs"     && <LogsTab session={session} />}
        </div>
        <ActionSidebar session={session} />
      </div>
    </div>
  );
}

function Hero({ session }) {
  const phase = getPhase(session.subStageId);
  const subStage = getSubStage(session.subStageId);
  const isUrgent = session.daysLeft <= 3;
  return (
    <section className="bg-white border-b border-gray-200 px-6 py-5">
      <div className="flex items-start gap-5">
        <div className="w-14 h-14 rounded-full bg-gray-100 border border-gray-200 text-gray-700 text-base font-semibold inline-flex items-center justify-center shrink-0">{session.initials}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">{session.offboarder}</h1>
            <span className="text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold bg-gray-100 border border-gray-200 text-gray-700">{session.dept}</span>
            {isUrgent && <span className="text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold bg-rose-50 border border-rose-200 text-rose-700 inline-flex items-center gap-1"><AlertOctagon className="w-2.5 h-2.5" />{session.daysLeft} days left</span>}
          </div>
          <p className="text-sm text-gray-500 mb-3">{session.role} · deadline <span className="text-gray-700" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{session.deadline}</span></p>
          <PhaseProgress subStageId={session.subStageId} />
          <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-500 flex-wrap">
            <span className="font-semibold text-gray-900">Phase {phase.id} · {phase.label}</span>
            <span className="text-gray-300">·</span>
            <span>{subStage.label}</span>
          </div>
        </div>
        <button className="h-8 w-8 rounded-md hover:bg-gray-100 inline-flex items-center justify-center text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 shrink-0" title="Session settings"><MoreHorizontal className="w-3.5 h-3.5" /></button>
      </div>
    </section>
  );
}

function PhaseProgress({ subStageId }) {
  const currentPhase = getPhase(subStageId);
  return (
    <div>
      <div className="grid grid-cols-3 gap-1">
        {LIFECYCLE_PHASES.map((phase) => {
          const isDone = phase.id < currentPhase.id, isCurrent = phase.id === currentPhase.id;
          let fill = 0;
          if (isCurrent) { const subIdx = phase.subStages.findIndex((s) => s.id === subStageId); fill = ((subIdx + 0.5) / phase.subStages.length) * 100; }
          return (<div key={phase.id} className="relative h-2 rounded-sm bg-gray-200 overflow-hidden" title={phase.label}>{isDone && <div className="absolute inset-0 bg-emerald-500" />}{isCurrent && <div className="absolute inset-y-0 left-0 bg-violet-500 animate-pulse" style={{ width: `${fill}%` }} />}</div>);
        })}
      </div>
      <div className="grid grid-cols-3 gap-1 mt-1">
        {LIFECYCLE_PHASES.map((phase) => {
          const isDone = phase.id < currentPhase.id, isCurrent = phase.id === currentPhase.id;
          return (<span key={phase.id} className={`text-[10px] uppercase tracking-wider font-medium text-center ${isDone ? "text-emerald-700" : isCurrent ? "text-violet-700" : "text-gray-400"}`}>{phase.id}. {phase.label}</span>);
        })}
      </div>
    </div>
  );
}

function TabBar({ session, activeTab }) {
  const base = `/session/${session.urlSlug}`;
  return (
    <div className="bg-white border-b border-gray-200 px-6 sticky top-0 z-10">
      <div className="flex items-center gap-1">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          const href = tab.id === "overview" ? base : `${base}?tab=${tab.id}`;
          return (<Link key={tab.id} href={href} className={`h-10 px-3 text-sm font-medium border-b-2 transition-colors focus:outline-none inline-flex items-center ${isActive ? "border-violet-600 text-violet-700" : "border-transparent text-gray-500 hover:text-gray-900"}`}>{tab.label}</Link>);
        })}
      </div>
    </div>
  );
}

function OverviewTab({ session }) {
  if (session.subStageId === 2) return <OverviewSeeding session={session} />;
  if (session.subStageId === 3) return <OverviewScope session={session} />;
  return null;
}

function OverviewSeeding({ session }) {
  return (
    <div className="space-y-5">
      <SectionLabel>What's happening now</SectionLabel>
      <article className="rounded-lg border border-violet-200 bg-violet-50/40 p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-md bg-white border border-violet-200 flex items-center justify-center shrink-0"><Loader2 className="w-4 h-4 text-violet-600 animate-spin" strokeWidth={1.75} /></div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900">Seeding from Trello</h3>
            <p className="text-[12px] text-gray-500 mt-0.5">~4 min remaining · runs in the background</p>
          </div>
          <span className="text-[11px] text-gray-500 shrink-0" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>4m 12s</span>
        </div>
        <ul className="space-y-1 text-[11px] text-gray-600">
          <SubStep done>Authorization scope established via Hà Vy</SubStep>
          <SubStep done>Connected Trello · board 'Backend Platform'</SubStep>
          <SubStep done>Scanned lists · In Progress (6) · Review (4) · Done (42)</SubStep>
          <SubStep active>Filtering by content depth · 24 kept · 11 thin skipped</SubStep>
          <SubStep>Prioritizing labels · Bug/Hotfix · Architecture · Core Feature</SubStep>
          <SubStep>Sensitive-content check (API keys, credentials)</SubStep>
          <SubStep>Knowledge gaps inference</SubStep>
          <SubStep>Knowledge map build</SubStep>
        </ul>
      </article>
      <div><SectionLabel>Source</SectionLabel>
        <div className="mt-2"><SourceRow icon={Trello} name="Trello · Backend Platform" detail="In Progress / Review / Done · thin cards skipped · labels prioritized" status="active" subDetail="4-layer filter" /></div>
      </div>
    </div>
  );
}

function OverviewScope({ session }) {
  const [checked, setChecked] = React.useState(() => { const m = {}; STAKEHOLDERS.forEach((s) => { m[s.id] = s.defaultChecked; }); return m; });
  const toggle = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  return (
    <div className="space-y-5">
      <SectionLabel>Crawl complete</SectionLabel>
      <article className="rounded-lg border border-emerald-200 bg-emerald-50/30 p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-md bg-white border border-emerald-200 flex items-center justify-center shrink-0"><CheckCircle2 className="w-4 h-4 text-emerald-600" strokeWidth={1.75} /></div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900">{CRAWL_SUMMARY.totalKept} items from Trello · {CRAWL_SUMMARY.gaps} knowledge gaps</h3>
            <p className="text-[12px] text-gray-500 mt-0.5">{CRAWL_SUMMARY.thinSkipped} thin cards skipped · {CRAWL_SUMMARY.redacted} contained sensitive content (auto-redacted)</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3">
          {CRAWL_CATEGORIES.map((cat) => (<div key={cat.label} className="flex items-center justify-between text-[11px] py-0.5"><span className="text-gray-700">{cat.label}</span><span className="text-gray-900 font-medium" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{cat.count}</span></div>))}
          <div className="flex items-center justify-between text-[11px] py-0.5"><span className="text-yellow-700 font-medium">Knowledge gaps</span><span className="text-yellow-700 font-medium" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{CRAWL_SUMMARY.gaps}</span></div>
        </div>
      </article>
      <div><SectionLabel>Source</SectionLabel>
        <div className="mt-2"><SourceRow icon={Trello} name="Trello · Backend Platform" detail={`${CRAWL_SUMMARY.totalKept} items kept · ${CRAWL_SUMMARY.thinSkipped} skipped · ${CRAWL_SUMMARY.redacted} redacted`} status="done" subDetail="4-layer filter" /></div>
      </div>
      <div><SectionLabel>Stakeholders</SectionLabel>
        <p className="text-[11px] text-gray-500 mt-1 mb-2">Auto-derived from Trello card co-occurrence. Select who to notify for Capture.</p>
        <div className="space-y-1.5">{STAKEHOLDERS.map((s) => (<StakeholderRow key={s.id} stakeholder={s} isChecked={checked[s.id]} onToggle={() => toggle(s.id)} />))}</div>
        <button className="mt-2 h-8 px-3 rounded-md border border-dashed border-gray-300 bg-white hover:bg-gray-50 text-gray-600 text-xs font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20"><UserPlus className="w-3 h-3" /> Add someone</button>
      </div>
    </div>
  );
}

function StakeholderRow({ stakeholder, isChecked, onToggle }) {
  const s = stakeholder;
  const initials = s.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div onClick={onToggle} className={`flex items-center gap-3 rounded-md border px-3 py-2.5 cursor-pointer transition-colors ${isChecked ? "border-violet-200 bg-violet-50/30" : "border-gray-200 bg-white hover:bg-gray-50"}`}>
      <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${isChecked ? "bg-violet-600 border-violet-600" : "bg-white border-gray-300"}`}>{isChecked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}</span>
      <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 text-gray-600 text-[10px] font-semibold inline-flex items-center justify-center shrink-0">{initials}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2"><span className="text-sm font-medium text-gray-900">{s.name}</span><span className="text-[10px] text-gray-500">{s.role}</span></div>
        <div className="text-[10px] text-gray-500 mt-0.5" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{s.cards} cards · {s.detail}</div>
      </div>
    </div>
  );
}

function DataTab({ session }) {
  const isSeeding = session.subStageId === 2;
  return (
    <div className="space-y-5">
      <div><SectionLabel>Source</SectionLabel>
        <div className="mt-2"><SourceRow icon={Trello} name="Trello · Backend Platform" detail={isSeeding ? "In Progress / Review / Done · thin cards skipped · labels prioritized" : `${CRAWL_SUMMARY.totalKept} items kept · ${CRAWL_SUMMARY.thinSkipped} skipped · ${CRAWL_SUMMARY.redacted} redacted`} status={isSeeding ? "active" : "done"} subDetail="4-layer filter" /></div>
      </div>
      {isSeeding ? (
        <div><SectionLabel>Items</SectionLabel>
          <div className="mt-2 rounded-lg border border-gray-200 bg-white p-4 text-center"><Loader2 className="w-4 h-4 text-violet-600 animate-spin mx-auto mb-2" strokeWidth={1.75} /><p className="text-[12px] text-gray-500">Scanning in progress — items will appear here when seeding completes.</p></div>
        </div>
      ) : (
        <>
          <div><SectionLabel>Items by category</SectionLabel>
            <div className="mt-2 space-y-2">{CRAWL_CATEGORIES.map((cat) => (<CategoryGroup key={cat.label} category={cat} />))}</div>
          </div>
          <div><SectionLabel>Knowledge gaps</SectionLabel>
            <div className="mt-2 space-y-1">{KNOWLEDGE_GAPS.map((gap) => (<div key={gap} className="flex items-center gap-2 rounded-md border border-yellow-200 bg-yellow-50/30 px-3 py-2"><AlertTriangle className="w-3 h-3 text-yellow-600 shrink-0" strokeWidth={1.75} /><span className="text-[11px] text-gray-700">{gap}</span></div>))}</div>
          </div>
        </>
      )}
      <div><SectionLabel>Upload</SectionLabel>
        <button className="w-full mt-2 rounded-lg border border-dashed border-gray-300 bg-gray-50/40 hover:bg-gray-50 px-3 py-4 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20"><UploadCloud className="w-5 h-5 text-gray-400 mx-auto mb-1" strokeWidth={1.75} /><span className="text-[12px] text-gray-600 font-medium">Drag files here or click to upload</span><p className="text-[10px] text-gray-400 mt-0.5">Handover briefs, scope docs, architecture diagrams</p></button>
      </div>
    </div>
  );
}

function CategoryGroup({ category }) {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <div className="rounded-md border border-gray-200 bg-white overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
        <div className="flex items-center gap-2"><Database className="w-3 h-3 text-gray-400" strokeWidth={1.75} /><span className="text-sm font-medium text-gray-900">{category.label}</span></div>
        <div className="flex items-center gap-2"><span className="text-[11px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{category.count}</span><ChevronRight className={`w-3 h-3 text-gray-400 transition-transform ${expanded ? "rotate-90" : ""}`} /></div>
      </button>
      {expanded && (<div className="border-t border-gray-100 px-3 py-2 space-y-1">{category.items.map((item) => (<div key={item} className="flex items-center gap-2 text-[11px] text-gray-700 py-0.5"><FileText className="w-2.5 h-2.5 text-gray-400 shrink-0" strokeWidth={1.75} /><span>{item}</span></div>))}{category.count > category.items.length && (<span className="text-[10px] text-gray-400">+{category.count - category.items.length} more</span>)}</div>)}
    </div>
  );
}

function LogsTab({ session }) {
  const entries = session.subStageId === 3 ? LOGS_SCOPE : LOGS_SEEDING;
  return (
    <div className="space-y-3"><SectionLabel>Activity log</SectionLabel>
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">{entries.map((entry, i) => (<ActivityEntry key={entry.ts} ts={entry.ts} actor={entry.actor} text={entry.text} last={i === entries.length - 1} />))}</div>
    </div>
  );
}

function ActionSidebar({ session }) {
  const isSeeding = session.subStageId === 2, isScope = session.subStageId === 3;
  const confirmedCount = STAKEHOLDERS.filter((s) => s.defaultChecked).length;
  return (
    <aside className="space-y-4">
      <div><SectionLabel>Next action</SectionLabel>
        {isSeeding && (<article className="rounded-lg border border-gray-200 bg-white p-3 mt-2"><p className="text-[12px] text-gray-700 mb-3">Scanning — nothing needed from you yet.</p><button className="w-full h-8 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium inline-flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20"><Eye className="w-3 h-3" /> Watch progress</button></article>)}
        {isScope && (<article className="rounded-lg border border-violet-200 bg-white p-3 mt-2"><button className="w-full h-8 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium inline-flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30"><ArrowRight className="w-3 h-3" /> Move to Capture</button><p className="text-[10px] text-gray-500 text-center mt-1.5 leading-relaxed">Notifies {session.offboarder} and {confirmedCount} stakeholder{confirmedCount !== 1 ? "s" : ""} to begin.</p></article>)}
      </div>
      <div><SectionLabel>Session</SectionLabel>
        <div className="rounded-md border border-gray-200 bg-white p-3 mt-2 space-y-2 text-[11px]"><InfoRow label="Deadline" value={session.deadline} mono /><InfoRow label="Source" value="Trello · Backend Platform" /><InfoRow label="Days left" value={`${session.daysLeft}`} mono /></div>
      </div>
      <CancelSession session={session} />
    </aside>
  );
}

function CancelSession({ session }) {
  return (
    <div className="pt-2 border-t border-gray-200">
      <button className="w-full h-8 rounded-md text-gray-500 hover:text-rose-700 hover:bg-rose-50 text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/20"><X className="w-3 h-3" /> Cancel session</button>
      <p className="text-[10px] text-gray-400 text-center mt-1 leading-relaxed">Discards seeded context permanently. {session.offboarder} won't be asked to capture.</p>
    </div>
  );
}

function SubStep({ done, active, children }) {
  return (<li className="flex items-start gap-1.5"><span className="shrink-0 mt-0.5">{done && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" strokeWidth={2.5} />}{active && <Loader2 className="w-2.5 h-2.5 text-violet-600 animate-spin" strokeWidth={2} />}{!done && !active && <Clock className="w-2.5 h-2.5 text-gray-300" strokeWidth={1.75} />}</span><span className={`leading-relaxed ${done ? "text-gray-700" : active ? "text-gray-900 font-medium" : "text-gray-400"}`}>{children}</span></li>);
}

function SourceRow({ icon: Icon, name, detail, status, subDetail }) {
  const cfg = { active: { cls: "border-violet-200 bg-violet-50/20", badge: "bg-violet-50 border-violet-200 text-violet-700", label: "In progress" }, done: { cls: "border-emerald-200 bg-emerald-50/20", badge: "bg-emerald-50 border-emerald-200 text-emerald-700", label: "Complete" } }[status];
  return (<article className={`rounded-md border px-3 py-2.5 flex items-center gap-3 ${cfg.cls}`}><Icon className="w-3.5 h-3.5 text-gray-500 shrink-0" strokeWidth={1.75} /><div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-0.5"><span className="text-sm font-medium text-gray-900">{name}</span><span className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold border ${cfg.badge}`}>{cfg.label}</span>{subDetail && <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{subDetail}</span>}</div><div className="text-[11px] text-gray-500 leading-relaxed">{detail}</div></div></article>);
}

function ActivityEntry({ ts, actor, text, last }) {
  return (<div className={`px-3 py-2 ${!last ? "border-b border-gray-100" : ""}`}><div className="flex items-center justify-between gap-3 mb-0.5"><span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{ts}</span><span className="text-[10px] text-gray-700 font-medium shrink-0">{actor}</span></div><div className="text-[11px] text-gray-900 leading-relaxed">{text}</div></div>);
}

function InfoRow({ label, value, mono }) {
  return (<div className="flex items-center justify-between gap-2"><span className="text-gray-500">{label}</span><span className="text-gray-900 font-medium text-right" style={mono ? { fontFamily: "ui-monospace, Menlo, monospace" } : undefined}>{value}</span></div>);
}

function SectionLabel({ children }) {
  return <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">{children}</h2>;
}
