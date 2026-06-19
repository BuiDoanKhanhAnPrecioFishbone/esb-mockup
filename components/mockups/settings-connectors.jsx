"use client";

import React from "react";
import {
  Settings as SettingsIcon, Plus, CheckCircle2, Clock,
  Github, Folder, MessageSquare, FileText, Cloud, Users, AlertCircle
} from "lucide-react";

/* Settings — Connector library (Step Zero) */

const CONNECTORS = [
  { id: "trello",  name: "Trello",        icon: AlertCircle, iconBg: "bg-blue-50",    iconColor: "text-blue-600",   status: "connected", health: "Healthy",  stats: "3 boards \u00b7 162 cards",  lastSync: "2 min ago",   desc: "Kanban boards and cards" },
  { id: "github",  name: "GitHub",        icon: Github,      iconBg: "bg-gray-100",   iconColor: "text-gray-700",   status: "connected", health: "Healthy",  stats: "4 repos \u00b7 89 PRs",     lastSync: "5 min ago",   desc: "Shared repos, PRs, wiki" },
  { id: "gdrive",  name: "Google Drive",  icon: Folder,      iconBg: "bg-yellow-50",  iconColor: "text-yellow-700", status: "connected", health: "Syncing",  stats: "12 shared folders",         lastSync: "Initial sync\u2026", desc: "Shared folders and docs" },
  { id: "jira",    name: "Jira",          icon: AlertCircle, iconBg: "bg-gray-50",    iconColor: "text-gray-500",   status: "available", health: null,       stats: null,                        lastSync: null,          desc: "Project tracking and issues" },
  { id: "slack",   name: "Slack",         icon: MessageSquare, iconBg: "bg-gray-50",  iconColor: "text-gray-500",   status: "available", health: null,       stats: null,                        lastSync: null,          desc: "Shared channels only, no DMs" },
  { id: "notion",  name: "Notion",        icon: FileText,    iconBg: "bg-gray-50",    iconColor: "text-gray-500",   status: "available", health: null,       stats: null,                        lastSync: null,          desc: "Shared workspaces only" },
  { id: "salesf",  name: "Salesforce",    icon: Cloud,       iconBg: "bg-gray-50",    iconColor: "text-gray-400",   status: "coming",    health: null,       stats: null,                        lastSync: null,          desc: "Deals, accounts, contacts" },
  { id: "hris",    name: "HRIS",          icon: Users,       iconBg: "bg-gray-50",    iconColor: "text-gray-400",   status: "coming",    health: null,       stats: null,                        lastSync: null,          desc: "BambooHR / Workday adapter" },
];

export default function SettingsConnectors() {
  const connected = CONNECTORS.filter(c => c.status === "connected").length;
  const available = CONNECTORS.filter(c => c.status === "available").length;
  const coming = CONNECTORS.filter(c => c.status === "coming").length;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-violet-700 mb-1">
            <SettingsIcon className="w-5 h-5" strokeWidth={1.75} />
            <span className="text-xs uppercase tracking-wider font-semibold" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
              {"Settings \u00b7 Step Zero"}
            </span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Connectors</h1>
          <p className="text-sm text-gray-500 mt-1">
            {connected}{" connected \u00b7 "}{available}{" available \u00b7 "}{coming}{" coming soon"}
          </p>
        </div>
        <button type="button" className="shrink-0 h-9 px-3 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30 cursor-pointer">
          <Plus className="w-3.5 h-3.5" />
          Add connector
        </button>
      </header>

      <div className="grid grid-cols-4 gap-3">
        {CONNECTORS.map(c => <ConnectorCard key={c.id} c={c} />)}
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium mb-2">Data-ingestion governance</p>
        <p className="text-[12px] text-gray-600 leading-relaxed">
          Only approved shared workspaces are scanned. Email, personal folders, and direct messages are never ingested.
          Sensitive content is redacted via Microsoft Purview before reaching the knowledge graph.
        </p>
      </div>
    </div>
  );
}

function ConnectorCard({ c }) {
  const Icon = c.icon;
  const isComing = c.status === "coming";
  const isAvailable = c.status === "available";
  const isConnected = c.status === "connected";
  const healthDot = c.health === "Healthy" ? "bg-emerald-500" : c.health === "Syncing" ? "bg-yellow-500" : null;
  const healthText = c.health === "Healthy" ? "text-emerald-600" : c.health === "Syncing" ? "text-yellow-600" : "";

  return (
    <article className={`rounded-lg border bg-white p-4 transition-all ${isComing ? "border-gray-200 opacity-50" : isConnected ? "border-gray-200 hover:border-gray-300 hover:shadow-sm" : "border-gray-200"}`}>
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`w-8 h-8 rounded-lg ${c.iconBg} inline-flex items-center justify-center shrink-0`}>
          <Icon className={`w-4 h-4 ${c.iconColor}`} strokeWidth={1.75} />
        </div>
        <h3 className="text-[13px] font-semibold text-gray-900">{c.name}</h3>
      </div>

      {isConnected && <>
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className={`w-[5px] h-[5px] rounded-full ${healthDot}`}></div>
          <span className={`text-[10px] font-medium ${healthText}`}>{"Connected \u00b7 "}{c.health}</span>
        </div>
        <p className="text-[11px] text-gray-600 mb-0.5">{c.stats}</p>
        <p className="text-[10px] text-gray-400" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
          <Clock className="w-3 h-3 inline -mt-0.5 mr-0.5" strokeWidth={1.75} />
          {c.lastSync}
        </p>
      </>}

      {isAvailable && <>
        <p className="text-[11px] text-gray-500 mb-3">{c.desc}</p>
        <button type="button" className="w-full h-8 rounded-md border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500/20">
          Connect
        </button>
      </>}

      {isComing && <>
        <p className="text-[11px] text-gray-400 mb-1">{c.desc}</p>
        <p className="text-[10px] text-gray-400 font-medium">Coming soon</p>
      </>}
    </article>
  );
}
