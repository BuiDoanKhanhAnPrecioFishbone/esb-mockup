"use client";

import React from "react";
import {
  Settings as SettingsIcon, Plus, AlertTriangle, CheckCircle2,
  Clock, RefreshCw, Lock, GitBranch, Github, Folder, MessageSquare,
  Briefcase, FileText, Calendar, Database, ArrowUpRight, ShieldCheck,
  AlertCircle, Hash
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   Settings — Platform Admin home (Step Zero · SZ)

   Three sections:
     1. Connector library · 8 integrations · status per connector
     2. Connector health · last sync per source · failures highlighted
     3. Department × source mapping · which dept uses which sources

   Owner persona · An Quân Vũ (Platform Admin · IT)
   ═══════════════════════════════════════════════════════════════════ */

const CONNECTORS = [
  { id: "m365",     name: "Microsoft 365",     icon: Database,        scope: "OneDrive · SharePoint · Teams",  status: "connected",  lastSync: "3 min ago",  items: 1842, governance: "shared workspaces only · email never scanned" },
  { id: "google",   name: "Google Workspace",  icon: Folder,          scope: "Drive shared · Calendar",         status: "connected",  lastSync: "12 min ago", items: 1124, governance: "shared workspaces only · Gmail never scanned" },
  { id: "jira",     name: "Jira",              icon: GitBranch,       scope: "Tickets · comments",              status: "connected",  lastSync: "4 min ago",  items: 524,  governance: "issues + comments only" },
  { id: "github",   name: "GitHub",            icon: Github,          scope: "Shared repos only",               status: "connected",  lastSync: "4 min ago",  items: 318,  governance: "PR descriptions · commit messages · wiki" },
  { id: "salesf",   name: "Salesforce",        icon: Briefcase,       scope: "Deals · accounts",                status: "connected",  lastSync: "20 min ago", items: 286,  governance: "owner-shared records only" },
  { id: "slack",    name: "Slack",             icon: MessageSquare,   scope: "Shared channels only",            status: "degraded",   lastSync: "2 hours ago", items: 94,   governance: "no DMs · private channels excluded" },
  { id: "notion",   name: "Notion",            icon: FileText,        scope: "Shared workspaces only",          status: "needs-auth", lastSync: "Never",       items: 0,    governance: "shared pages only · personal pages excluded" },
  { id: "hris",     name: "Generic HRIS",      icon: Calendar,        scope: "BambooHR / Workday adapter",      status: "connected",  lastSync: "1 day ago",  items: 38,   governance: "department + last-day fields only" },
];

const DEPT_MAPPING = [
  {
    dept: "Engineering",
    sources: ["Jira", "GitHub", "Google Drive shared", "M365 SharePoint"],
    seedingFrequency: "Hourly",
    sensitivity: "Standard",
  },
  {
    dept: "Sales",
    sources: ["Salesforce", "Google Calendar", "M365 SharePoint", "Slack"],
    seedingFrequency: "Hourly",
    sensitivity: "Standard",
  },
  {
    dept: "People & Culture",
    sources: ["HRIS", "Notion", "M365 SharePoint"],
    seedingFrequency: "Every 4 hours",
    sensitivity: "Elevated · Purview gate strict",
  },
];

const RECENT_EVENTS = [
  { ts: "2026-06-03 · 09:12:04Z", actor: "An Quân Vũ", action: "Slack connector marked degraded", detail: "Rate-limit threshold reached on shared channels · auto-throttling enabled", severity: "medium" },
  { ts: "2026-06-03 · 08:47:31Z", actor: "System",     action: "Microsoft 365 sync completed",     detail: "1,842 items · 3 minutes",                                                  severity: "low"    },
  { ts: "2026-06-03 · 07:30:00Z", actor: "System",     action: "All connectors validated",         detail: "OAuth scopes refreshed · no scope drift detected",                         severity: "low"    },
  { ts: "2026-06-02 · 16:20:09Z", actor: "An Quân Vũ", action: "Notion connector added",           detail: "Awaiting initial OAuth grant from workspace admin",                        severity: "medium" },
];

export default function SettingsConnectors() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <Header />

      <StatRow />

      <div className="grid grid-cols-[1fr_320px] gap-5">
        <div className="space-y-6 min-w-0">
          <ConnectorLibrary />
          <DepartmentMapping />
        </div>
        <RecentActivity />
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="mb-6 flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-violet-700 mb-1">
          <SettingsIcon className="w-5 h-5" strokeWidth={1.75} />
          <span
            className="text-xs uppercase tracking-wider font-semibold"
            style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
          >
            Settings · Step Zero
          </span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Org connectors and source mapping
        </h1>
        <p className="text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
          Configure the data sources ART-EEP scans during handover sessions. Only approved shared
          workspaces are eligible per the data-ingestion governance rule. Email, personal folders,
          and direct messages are never scanned.
        </p>
      </div>
      <button
        type="button"
        className="shrink-0 h-9 px-3 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30"
      >
        <Plus className="w-3.5 h-3.5" />
        Add connector
      </button>
    </header>
  );
}

function StatRow() {
  const connected = CONNECTORS.filter((c) => c.status === "connected").length;
  const degraded = CONNECTORS.filter((c) => c.status === "degraded").length;
  const needsAuth = CONNECTORS.filter((c) => c.status === "needs-auth").length;
  return (
    <div className="grid grid-cols-4 gap-3 mb-5">
      <StatTile label="Connectors connected" value={connected}              sub={`of ${CONNECTORS.length} total`} tone="emerald" />
      <StatTile label="Degraded"             value={degraded}               sub="auto-throttling"              tone={degraded ? "yellow" : "gray"} />
      <StatTile label="Needs auth"           value={needsAuth}              sub="pending OAuth"                tone={needsAuth ? "rose" : "gray"} />
      <StatTile label="Items synced today"   value="3,418"                  sub="across all sources" />
    </div>
  );
}

function StatTile({ label, value, sub, tone }) {
  const valueCls =
    tone === "emerald" ? "text-emerald-700" :
    tone === "yellow"  ? "text-yellow-700"  :
    tone === "rose"    ? "text-rose-700"    :
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

function ConnectorLibrary() {
  return (
    <section>
      <div className="flex items-end justify-between mb-2">
        <SectionLabel>Connector library</SectionLabel>
        <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
          {CONNECTORS.length} integrations
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {CONNECTORS.map((c) => <ConnectorCard key={c.id} c={c} />)}
      </div>
    </section>
  );
}

function ConnectorCard({ c }) {
  const Icon = c.icon;
  const accent =
    c.status === "connected"  ? "border-emerald-200 bg-emerald-50/30" :
    c.status === "degraded"   ? "border-yellow-200 bg-yellow-50/30"   :
    c.status === "needs-auth" ? "border-rose-200 bg-rose-50/30"       :
                                "border-gray-200 bg-white";

  return (
    <article className={`rounded-lg border bg-white p-3.5 ${accent} hover:shadow-sm transition-shadow`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-md border border-gray-200 bg-white inline-flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-gray-700" strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-[13px] font-semibold text-gray-900">{c.name}</h3>
            <StatusPill status={c.status} />
          </div>
          <p className="text-[11px] text-gray-600 mt-0.5">{c.scope}</p>
          <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500">
            <Clock className="w-3 h-3" strokeWidth={1.75} />
            <span>{c.lastSync}</span>
            <span className="text-gray-300">·</span>
            <span style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{c.items} items</span>
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200/60 flex items-start gap-1.5">
        <Lock className="w-3 h-3 text-gray-400 shrink-0 mt-0.5" strokeWidth={1.75} />
        <p className="text-[10px] text-gray-500 leading-snug">{c.governance}</p>
      </div>
    </article>
  );
}

function StatusPill({ status }) {
  const cfg = {
    connected:    { label: "Connected",   cls: "bg-emerald-100 text-emerald-700 border-emerald-200",  Icon: CheckCircle2 },
    degraded:     { label: "Degraded",    cls: "bg-yellow-100 text-yellow-700 border-yellow-200",     Icon: AlertTriangle },
    "needs-auth": { label: "Needs auth",  cls: "bg-rose-100 text-rose-700 border-rose-200",           Icon: AlertCircle },
  }[status] ?? { label: status, cls: "bg-gray-100 text-gray-700 border-gray-200", Icon: AlertCircle };
  const Icon = cfg.Icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${cfg.cls}`}>
      <Icon className="w-2.5 h-2.5" strokeWidth={2} />
      {cfg.label}
    </span>
  );
}

function DepartmentMapping() {
  return (
    <section>
      <div className="flex items-end justify-between mb-2">
        <SectionLabel>Department × source mapping</SectionLabel>
        <button
          type="button"
          className="text-[11px] text-violet-700 hover:text-violet-900 inline-flex items-center gap-1"
        >
          Edit mapping
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
      <article className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-[10px] uppercase tracking-wider text-gray-500">
              <th className="text-left font-medium px-4 py-2.5">Department</th>
              <th className="text-left font-medium px-4 py-2.5">Sources</th>
              <th className="text-left font-medium px-4 py-2.5">Sync frequency</th>
              <th className="text-left font-medium px-4 py-2.5">Sensitivity tier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {DEPT_MAPPING.map((row) => (
              <tr key={row.dept} className="hover:bg-gray-50/40">
                <td className="px-4 py-3 font-semibold text-gray-900">{row.dept}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {row.sources.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 text-gray-700"
                        style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700">{row.seedingFrequency}</td>
                <td className="px-4 py-3">
                  {row.sensitivity.startsWith("Elevated") ? (
                    <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border border-yellow-200 bg-yellow-50 text-yellow-700 font-medium">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      {row.sensitivity}
                    </span>
                  ) : (
                    <span className="text-gray-700">{row.sensitivity}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </section>
  );
}

function RecentActivity() {
  return (
    <aside className="space-y-3">
      <div className="flex items-end justify-between">
        <SectionLabel>Recent activity</SectionLabel>
        <RefreshCw className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />
      </div>
      <ul className="space-y-1.5">
        {RECENT_EVENTS.map((e, i) => (
          <ActivityItem key={i} ev={e} />
        ))}
      </ul>
      <article className="rounded-lg border border-gray-200 bg-white p-3.5">
        <div className="flex items-center gap-1.5 mb-2">
          <Hash className="w-3.5 h-3.5 text-gray-500" strokeWidth={1.75} />
          <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">Today</h4>
        </div>
        <div className="space-y-1.5 text-[12px]">
          <MiniStat label="Successful syncs"   value="42" tone="emerald" />
          <MiniStat label="Throttled requests" value="3"  tone="yellow"  />
          <MiniStat label="Failed syncs"       value="0"  tone="emerald" />
          <MiniStat label="Scope drifts"       value="0"  tone="emerald" />
        </div>
      </article>
    </aside>
  );
}

function ActivityItem({ ev }) {
  const leftCls =
    ev.severity === "high"   ? "border-l-rose-500"   :
    ev.severity === "medium" ? "border-l-yellow-500" :
                               "border-l-gray-200";
  return (
    <li className={`rounded-md border border-gray-200 bg-white px-3 py-2 border-l-2 ${leftCls}`}>
      <p className="text-[12px] text-gray-900 font-medium leading-snug">{ev.action}</p>
      <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">{ev.detail}</p>
      <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-500">
        <span style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{ev.ts}</span>
        <span className="text-gray-300">·</span>
        <span>{ev.actor}</span>
      </div>
    </li>
  );
}

function MiniStat({ label, value, tone }) {
  const valueCls =
    tone === "emerald" ? "text-emerald-700" :
    tone === "yellow"  ? "text-yellow-700"  :
    tone === "rose"    ? "text-rose-700"    :
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
