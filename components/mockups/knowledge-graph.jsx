"use client";

import React from "react";
import Link from "next/link";
import {
  Network, Search, Filter, ArrowUpRight, Hash, Tag, Database,
  CheckCircle2, Sparkles, GitBranch, Briefcase, Users,
  Clock, Eye, History
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   Knowledge graph — committed knowledge across all handover sessions

   Read-only Manager view. Search, browse by department, see recent
   commits, drill into individual canonical facts (lineage drawer).
   ═══════════════════════════════════════════════════════════════════ */

const STATS = {
  totalItems: 4_218,
  canonicalFacts: 187,
  sessionsCommitted: 14,
  lastCommit: "7m ago",
};

const RECENT_COMMITS = [
  {
    id: "minh-le-2026-05-29",
    persona: "Minh Lê",
    role: "Senior Backend Engineer · Engineering",
    initials: "ML",
    when: "7 minutes ago",
    items: 487,
    canonical: 12,
    gapsResolved: 9,
    sessionHref: "/session/minh-le",
  },
  {
    id: "phuong-anh-2026-05-25",
    persona: "Phương Anh Nguyễn",
    role: "Senior Account Executive · Sales",
    initials: "PA",
    when: "5 days ago",
    items: 286,
    canonical: 8,
    gapsResolved: 4,
    sessionHref: "/session/phuong-anh",
  },
  {
    id: "long-doan-2026-05-19",
    persona: "Đoàn Hoàng Long",
    role: "Tech Lead · Engineering",
    initials: "LD",
    when: "12 days ago",
    items: 612,
    canonical: 21,
    gapsResolved: 11,
    sessionHref: null,
  },
];

const ENTITIES_BY_DEPT = [
  {
    dept: "Engineering",
    icon: GitBranch,
    tone: "violet",
    entities: [
      { kind: "service",   name: "payment-service",         count: 38 },
      { kind: "service",   name: "billing-pipeline",        count: 22 },
      { kind: "domain",    name: "retry-and-idempotency",   count: 14 },
      { kind: "runbook",   name: "p1-incident-response",    count: 9  },
      { kind: "convention",name: "trunk-based-deploys",     count: 7  },
    ],
  },
  {
    dept: "Sales",
    icon: Briefcase,
    tone: "yellow",
    entities: [
      { kind: "account",     name: "tier-1-enterprise-track", count: 19 },
      { kind: "playbook",    name: "renewal-q4-2026",         count: 12 },
      { kind: "convention",  name: "salesforce-stage-rubric", count: 8  },
      { kind: "domain",      name: "deal-handoff-criteria",   count: 6  },
    ],
  },
  {
    dept: "People & Culture",
    icon: Users,
    tone: "emerald",
    entities: [
      { kind: "policy",      name: "leave-policy-vn",         count: 14 },
      { kind: "playbook",    name: "performance-review-2H",   count: 11 },
      { kind: "convention",  name: "interview-rubric-pm",     count: 7  },
    ],
  },
];

const INSIGHTS = [
  {
    icon: Sparkles,
    tone: "violet",
    title: "Cross-team pattern detected",
    detail: "5 services across Engineering reference the same retry-and-idempotency domain. Consider promoting to a canonical pattern.",
    cta: "Review",
  },
  {
    icon: CheckCircle2,
    tone: "emerald",
    title: "0 hallucinations this week",
    detail: "187 canonical facts hold. QA-INT-01 §2.1 propagation is healthy.",
    cta: null,
  },
  {
    icon: Eye,
    tone: "yellow",
    title: "9 facts pending Manager review",
    detail: "Phương Anh's commit includes 9 items flagged for sensitive-content review. Awaiting your sign-off.",
    cta: "Review",
  },
];

export default function KnowledgeGraph() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <Header />

      <StatRow />

      <SearchBar />

      <div className="grid grid-cols-[1fr_320px] gap-5">
        <div className="space-y-6 min-w-0">
          <RecentCommits />
          <EntitiesByDept />
        </div>
        <Insights />
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="mb-6">
      <div className="flex items-center gap-2 text-violet-700 mb-1">
        <Network className="w-5 h-5" strokeWidth={1.75} />
        <span
          className="text-xs uppercase tracking-wider font-semibold"
          style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
        >
          Knowledge graph
        </span>
      </div>
      <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
        What the team has captured
      </h1>
      <p className="text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
        Every handover session commits verified knowledge here. Search by entity or browse by
        department. Canonical facts are emerald — they have an immutable lineage trail per
        QA-INT-01 §2.3.
      </p>
    </header>
  );
}

function StatRow() {
  return (
    <div className="grid grid-cols-4 gap-3 mb-5">
      <StatTile label="Total items"             value={STATS.totalItems.toLocaleString()}            sub="across 14 sessions" />
      <StatTile label="Canonical facts"          value={STATS.canonicalFacts}                          sub="Sự thật gốc · emerald" tone="emerald" />
      <StatTile label="Sessions committed"       value={STATS.sessionsCommitted}                       sub="Q1 + Q2 2026" />
      <StatTile label="Last commit"              value={STATS.lastCommit}                              sub="Minh Lê · 487 items" tone="violet" />
    </div>
  );
}

function StatTile({ label, value, sub, tone }) {
  const valueCls =
    tone === "emerald" ? "text-emerald-700" :
    tone === "violet"  ? "text-violet-700" :
                         "text-gray-900";
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-3.5">
      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">{label}</p>
      <p className={`text-xl font-semibold mt-1 ${valueCls}`} style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
        {value}
      </p>
      <p className="text-[11px] text-gray-500 mt-0.5">{sub}</p>
    </article>
  );
}

function SearchBar() {
  return (
    <div className="flex items-center gap-2 mb-5">
      <div className="flex items-center gap-2 h-9 px-3 rounded-md border border-gray-200 bg-white flex-1 max-w-2xl">
        <Search className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />
        <input
          type="text"
          placeholder="Search entities, canonical facts, runbooks, conventions…"
          className="bg-transparent outline-none text-[13px] text-gray-700 placeholder:text-gray-400 flex-1 min-w-0"
        />
        <span
          className="text-[10px] text-gray-400 border border-gray-200 rounded px-1 py-0.5"
          style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
        >
          /
        </span>
      </div>
      <button
        type="button"
        className="h-9 px-3 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-[12px] text-gray-700 inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20"
      >
        <Filter className="w-3.5 h-3.5" strokeWidth={1.75} />
        Filters
      </button>
    </div>
  );
}

function RecentCommits() {
  return (
    <section>
      <div className="flex items-end justify-between mb-2">
        <SectionLabel>Recent commits</SectionLabel>
        <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
          {RECENT_COMMITS.length} of 14
        </span>
      </div>
      <div className="space-y-2">
        {RECENT_COMMITS.map((c) => <CommitRow key={c.id} commit={c} />)}
      </div>
    </section>
  );
}

function CommitRow({ commit }) {
  const inner = (
    <article className="flex items-start gap-3 px-4 py-3 rounded-lg border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition-all">
      <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 text-gray-700 text-[11px] font-semibold inline-flex items-center justify-center shrink-0">
        {commit.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-semibold text-gray-900">{commit.persona}</p>
          <span className="text-gray-300">·</span>
          <p className="text-[11px] text-gray-500">{commit.role}</p>
        </div>
        <div className="flex items-center gap-3 mt-1 text-[11px]">
          <span className="text-gray-700">
            <span className="font-semibold text-gray-900" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{commit.items}</span> items
          </span>
          <span className="text-gray-300">·</span>
          <span className="text-emerald-700">
            <span className="font-semibold" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{commit.canonical}</span> canonical
          </span>
          <span className="text-gray-300">·</span>
          <span className="text-violet-700">
            <span className="font-semibold" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{commit.gapsResolved}</span> gaps resolved
          </span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <span
          className="text-[10px] text-gray-500"
          style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
        >
          {commit.when}
        </span>
      </div>
      {commit.sessionHref && <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />}
    </article>
  );

  if (commit.sessionHref) {
    return (
      <Link href={commit.sessionHref} className="block focus:outline-none focus:ring-2 focus:ring-violet-500/20 rounded-lg">
        {inner}
      </Link>
    );
  }
  return inner;
}

function EntitiesByDept() {
  return (
    <section>
      <SectionLabel>Browse entities by department</SectionLabel>
      <div className="space-y-3 mt-2">
        {ENTITIES_BY_DEPT.map((g) => <DeptGroup key={g.dept} group={g} />)}
      </div>
    </section>
  );
}

function DeptGroup({ group }) {
  const Icon = group.icon;
  const tintCls = {
    violet:  "bg-violet-50 text-violet-700 border-violet-100",
    yellow:  "bg-yellow-50 text-yellow-800 border-yellow-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
  }[group.tone];

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-7 h-7 rounded-md border inline-flex items-center justify-center ${tintCls}`}>
          <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
        </span>
        <h3 className="text-sm font-semibold text-gray-900">{group.dept}</h3>
        <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
          {group.entities.length} groups
        </span>
      </div>
      <ul className="space-y-1">
        {group.entities.map((e) => (
          <EntityRow key={e.name} entity={e} />
        ))}
      </ul>
    </article>
  );
}

function EntityRow({ entity }) {
  const kindTint = {
    service:    "bg-violet-50 text-violet-700 border-violet-100",
    domain:     "bg-gray-50 text-gray-700 border-gray-200",
    runbook:    "bg-yellow-50 text-yellow-800 border-yellow-100",
    convention: "bg-gray-50 text-gray-700 border-gray-200",
    account:    "bg-violet-50 text-violet-700 border-violet-100",
    playbook:   "bg-emerald-50 text-emerald-700 border-emerald-100",
    policy:     "bg-emerald-50 text-emerald-700 border-emerald-100",
  }[entity.kind] || "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <li className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-gray-50">
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={`text-[10px] uppercase tracking-wider font-medium border rounded px-1.5 py-0.5 ${kindTint}`}
          style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
        >
          {entity.kind}
        </span>
        <span className="text-[12px] text-gray-900 truncate" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
          {entity.name}
        </span>
      </div>
      <span className="text-[11px] text-gray-500 shrink-0" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
        {entity.count}
      </span>
    </li>
  );
}

function Insights() {
  return (
    <aside className="space-y-3">
      <SectionLabel>Insights</SectionLabel>
      {INSIGHTS.map((ins, i) => (
        <InsightCard key={i} insight={ins} />
      ))}
      <article className="rounded-lg border border-gray-200 bg-white p-3.5">
        <div className="flex items-center gap-1.5 mb-1.5">
          <History className="w-3.5 h-3.5 text-gray-500" strokeWidth={1.75} />
          <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">This week</h4>
        </div>
        <div className="space-y-1.5 text-[12px]">
          <MiniStat label="Items committed"          value="892" />
          <MiniStat label="Canonical promotions"     value="14" />
          <MiniStat label="Hallucinations reported"  value="0" tone="emerald" />
          <MiniStat label="Open corrections"         value="2" tone="yellow" />
        </div>
      </article>
    </aside>
  );
}

function InsightCard({ insight }) {
  const Icon = insight.icon;
  const tintCls = {
    violet:  "border-violet-200 bg-violet-50/40",
    emerald: "border-emerald-200 bg-emerald-50/40",
    yellow:  "border-yellow-200 bg-yellow-50/40",
  }[insight.tone];
  const iconBg = {
    violet:  "bg-white text-violet-600 border-violet-200",
    emerald: "bg-white text-emerald-600 border-emerald-200",
    yellow:  "bg-white text-yellow-700 border-yellow-200",
  }[insight.tone];
  return (
    <article className={`rounded-lg border p-3.5 ${tintCls}`}>
      <div className="flex items-start gap-2.5 mb-2">
        <span className={`w-7 h-7 rounded-md border inline-flex items-center justify-center shrink-0 ${iconBg}`}>
          <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
        </span>
        <h4 className="text-[13px] font-semibold text-gray-900 leading-snug">{insight.title}</h4>
      </div>
      <p className="text-[11px] text-gray-700 leading-relaxed">{insight.detail}</p>
      {insight.cta && (
        <button
          type="button"
          className="mt-2 h-7 px-2 rounded-md bg-white border border-gray-200 hover:border-violet-300 text-[11px] font-medium text-violet-700 inline-flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        >
          {insight.cta}
          <ArrowUpRight className="w-3 h-3" />
        </button>
      )}
    </article>
  );
}

function MiniStat({ label, value, tone }) {
  const valueCls =
    tone === "emerald" ? "text-emerald-700" :
    tone === "yellow"  ? "text-yellow-700" :
                         "text-gray-900";
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500">{label}</span>
      <span className={`font-semibold ${valueCls}`} style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
        {value}
      </span>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">{children}</h2>
  );
}
