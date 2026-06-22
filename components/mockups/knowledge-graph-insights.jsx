"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Sparkles, ChevronRight, ChevronDown, ArrowLeft, List, BarChart3 } from "lucide-react";

/* Knowledge Graph Insights — /knowledge-graph/insights
   Two modes:
   - Unfiltered: department overview (modules list + module heatmap)
   - Filtered (?node=payment): entry drill-down (entry list + entry heatmap)
   Grill-me decisions: CL-130+ */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const MODULES = [
  { id: "payment", name: "Payment Processing", entries: 12, verified: 9, draft: 3, gaps: 2,
    activity: [1, 0, 2, 0, 0, 4],
    contributors: [{ name: "Minh L\u00ea", date: "Jun 2026", count: 10 }, { name: "Thanh \u0110\u1ee9c", date: "Mar 2026", count: 2 }],
    items: [
      { name: "Kafka retry configuration", status: "verified", contributor: "Minh L\u00ea", date: "Jun 2026", activity: [1, 0, 1, 0, 0, 3] },
      { name: "Stripe webhook handler", status: "verified", contributor: "Minh L\u00ea", date: "Jun 2026", activity: [0, 0, 0, 0, 0, 2] },
      { name: "Payment retry race condition", status: "verified", contributor: "Minh L\u00ea", date: "Jun 2026", activity: [0, 0, 0, 0, 1, 2] },
      { name: "PCI Compliance scope", status: "gap", contributor: "Minh L\u00ea", date: "Jun 2026", activity: [0, 0, 0, 0, 0, -1] },
      { name: "Stripe API pinning", status: "draft", contributor: "Minh L\u00ea", date: "Jun 2026", activity: [0, 0, 0, 0, 0, 1] },
      { name: "Payment gateway timeout", status: "verified", contributor: "Thanh \u0110\u1ee9c", date: "Mar 2026", activity: [1, 0, 2, 0, 0, 0] },
      { name: "Refund reconciliation", status: "draft", contributor: "Thanh \u0110\u1ee9c", date: "Mar 2026", activity: [1, 0, 0, 0, 0, 0] },
      { name: "Currency conversion", status: "verified", contributor: "System", date: "Jan 2026", activity: [1, 0, 0, 0, 0, 0] },
    ] },
  { id: "auth", name: "Auth & Identity", entries: 8, verified: 5, draft: 3, gaps: 3,
    activity: [0, 0, 0, 0, 0, 3],
    contributors: [{ name: "Minh L\u00ea", date: "Jun 2026", count: 8 }],
    items: [
      { name: "OAuth2 PKCE flow", status: "verified", contributor: "Minh L\u00ea", date: "Jun 2026", activity: [0, 0, 0, 0, 0, 2] },
      { name: "Azure AD SAML SSO", status: "verified", contributor: "Minh L\u00ea", date: "Jun 2026", activity: [0, 0, 0, 0, 0, 1] },
      { name: "JWT key rotation", status: "gap", contributor: "Minh L\u00ea", date: "Jun 2026", activity: [0, 0, 0, 0, 0, -1] },
      { name: "RBAC permission matrix", status: "gap", contributor: "Minh L\u00ea", date: "Jun 2026", activity: [0, 0, 0, 0, 0, -1] },
    ] },
  { id: "database", name: "Database & Migrations", entries: 9, verified: 5, draft: 4, gaps: 4,
    activity: [0, 0, 1, 0, 0, 2],
    contributors: [{ name: "Minh L\u00ea", date: "Jun 2026", count: 7 }, { name: "Thanh \u0110\u1ee9c", date: "Mar 2026", count: 2 }],
    items: [
      { name: "Cosmos DB partitioning", status: "verified", contributor: "Minh L\u00ea", date: "Jun 2026", activity: [0, 0, 0, 0, 0, 2] },
      { name: "Migration v8 to v9", status: "gap", contributor: "Minh L\u00ea", date: "Jun 2026", activity: [0, 0, 0, 0, 0, -1] },
      { name: "Flyway migration pipeline", status: "verified", contributor: "Thanh \u0110\u1ee9c", date: "Mar 2026", activity: [0, 0, 1, 0, 0, 0] },
    ] },
  { id: "cicd", name: "CI/CD & Deployments", entries: 6, verified: 4, draft: 2, gaps: 2,
    activity: [0, 0, 0, 0, 0, 2],
    contributors: [{ name: "Minh L\u00ea", date: "Jun 2026", count: 6 }],
    items: [
      { name: "GitHub Actions matrix", status: "verified", contributor: "Minh L\u00ea", date: "Jun 2026", activity: [0, 0, 0, 0, 0, 2] },
      { name: "Helm rollback procedure", status: "verified", contributor: "Minh L\u00ea", date: "Jun 2026", activity: [0, 0, 0, 0, 0, 1] },
    ] },
  { id: "monitor", name: "Monitoring", entries: 5, verified: 5, draft: 0, gaps: 0,
    activity: [0, 0, 1, 0, 0, 1],
    contributors: [{ name: "Minh L\u00ea", date: "Jun 2026", count: 3 }, { name: "Thanh \u0110\u1ee9c", date: "Mar 2026", count: 2 }],
    items: [
      { name: "Grafana dashboard suite", status: "verified", contributor: "Minh L\u00ea", date: "Jun 2026", activity: [0, 0, 0, 0, 0, 2] },
      { name: "SLA & escalation paths", status: "verified", contributor: "Minh L\u00ea", date: "Jun 2026", activity: [0, 0, 0, 0, 0, 1] },
      { name: "Terraform modules", status: "verified", contributor: "Thanh \u0110\u1ee9c", date: "Mar 2026", activity: [0, 0, 1, 0, 0, 0] },
    ] },
  { id: "ratelimit", name: "Rate Limiting & API", entries: 4, verified: 3, draft: 1, gaps: 1,
    activity: [0, 0, 0, 0, 0, 2],
    contributors: [{ name: "Minh L\u00ea", date: "Jun 2026", count: 4 }],
    items: [
      { name: "Token bucket rate limiter", status: "verified", contributor: "Minh L\u00ea", date: "Jun 2026", activity: [0, 0, 0, 0, 0, 2] },
      { name: "API versioning & sunset", status: "verified", contributor: "Minh L\u00ea", date: "Jun 2026", activity: [0, 0, 0, 0, 0, 1] },
    ] },
  { id: "infra", name: "Infrastructure as Code", entries: 3, verified: 3, draft: 0, gaps: 0,
    activity: [0, 0, 2, 0, 0, 0],
    contributors: [{ name: "Thanh \u0110\u1ee9c", date: "Mar 2026", count: 3 }],
    items: [
      { name: "Terraform modules", status: "verified", contributor: "Thanh \u0110\u1ee9c", date: "Mar 2026", activity: [0, 0, 2, 0, 0, 0] },
      { name: "AKS cluster config", status: "verified", contributor: "Thanh \u0110\u1ee9c", date: "Mar 2026", activity: [0, 0, 1, 0, 0, 0] },
      { name: "Network policies", status: "verified", contributor: "Thanh \u0110\u1ee9c", date: "Mar 2026", activity: [0, 0, 1, 0, 0, 0] },
    ] },
];

function cellColor(v) {
  if (v < 0) return { bg: "#fde68a", border: "#fbbf24" };
  if (v === 0) return { bg: "#f5f3ff", border: "#e4e0f5" };
  if (v === 1) return { bg: "#ede9fe", border: "#c4b5fd" };
  if (v === 2) return { bg: "#c4b5fd", border: "#a78bfa" };
  return { bg: "#7c3aed", border: "#6d28d9" };
}

function StatusBadge({ status }) {
  if (status === "verified") return <span className="text-[8px] px-1.5 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-200">Verified</span>;
  if (status === "gap") return <span className="text-[8px] px-1.5 py-0.5 rounded bg-yellow-50 text-yellow-700 border border-yellow-200">Gap</span>;
  return <span className="text-[8px] px-1.5 py-0.5 rounded bg-gray-50 text-gray-600 border border-gray-200">Draft</span>;
}

export default function KnowledgeGraphInsights({ embedded = false } = {}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const nodeParam = searchParams?.get("node");
  const selectedModule = nodeParam ? MODULES.find(m => m.id === nodeParam) : null;
  const [hoveredRow, setHoveredRow] = useState(null);

  const goToModule = (id) => router.push(`/knowledge-graph/insights?node=${id}`);
  const goToAll = () => router.push("/knowledge-graph/insights");

  return (
    <div className={`${embedded ? "" : "p-4"} max-w-6xl mx-auto`} style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center"><BarChart3 className="w-4 h-4 text-white" strokeWidth={1.75} /></div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900 leading-tight">Knowledge insights</h2>
            <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
              {selectedModule ? (
                <><button onClick={goToAll} className="text-violet-600 hover:text-violet-700 cursor-pointer">Engineering</button>{" \u203A "}<span className="text-gray-900 font-medium">{selectedModule.name}</span></>
              ) : (
                <span>Engineering department</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedModule && <button onClick={goToAll} className="h-7 px-2.5 rounded-md border border-gray-200 bg-white text-[11px] text-gray-600 inline-flex items-center gap-1 hover:bg-gray-50 cursor-pointer"><List className="w-3 h-3" />All modules</button>}
          <Link href="/knowledge-graph" className="h-7 px-2.5 rounded-md border border-gray-200 bg-white text-[11px] text-gray-600 inline-flex items-center gap-1 hover:bg-gray-50"><ArrowLeft className="w-3 h-3" />Back to graph</Link>
        </div>
      </div>

      {selectedModule ? <FilteredView mod={selectedModule} hoveredRow={hoveredRow} setHoveredRow={setHoveredRow} /> : <UnfilteredView onSelect={goToModule} hoveredRow={hoveredRow} setHoveredRow={setHoveredRow} />}
    </div>
  );
}

function UnfilteredView({ onSelect, hoveredRow, setHoveredRow }) {
  return (
    <div className="grid grid-cols-12 gap-3">
      {/* Left: Module list */}
      <div className="col-span-5 rounded-lg border border-gray-200 bg-white overflow-hidden">
        <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <span className="text-[12px] font-semibold text-gray-900">Modules</span>
          <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{MODULES.length}</span>
        </div>
        {MODULES.map((m, i) => (
          <button key={m.id} onClick={() => onSelect(m.id)} onMouseEnter={() => setHoveredRow(i)} onMouseLeave={() => setHoveredRow(null)}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left border-b border-gray-100 last:border-b-0 transition-colors cursor-pointer ${hoveredRow === i ? "bg-violet-50/50" : "hover:bg-gray-50"}`}>
            <span className={`w-2 h-2 rounded-full shrink-0 ${m.gaps > 0 ? "bg-yellow-400" : "bg-emerald-400"}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-medium text-gray-900 truncate">{m.name}</span>
              </div>
              <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                <span style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{m.entries}e</span>
                {m.gaps > 0 && <span className="text-[8px] px-1 py-0.5 rounded bg-yellow-50 text-yellow-700 border border-yellow-200">{m.gaps}</span>}
              </div>
            </div>
            <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
          </button>
        ))}
      </div>

      {/* Right: Module heatmap */}
      <div className="col-span-7 rounded-lg border border-gray-200 bg-white overflow-hidden">
        <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <span className="text-[12px] font-semibold text-gray-900">Activity heatmap</span>
          <Legend />
        </div>
        <div className="p-4">
          <HeatmapGrid rows={MODULES.map(m => ({ label: m.name, activity: m.activity }))} hoveredRow={hoveredRow} setHoveredRow={setHoveredRow} />
        </div>
      </div>
    </div>
  );
}

function FilteredView({ mod, hoveredRow, setHoveredRow }) {
  return (
    <div className="grid grid-cols-12 gap-3">
      {/* Left: Entry list */}
      <div className="col-span-5 rounded-lg border border-gray-200 bg-white overflow-hidden">
        <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <span className="text-[12px] font-semibold text-gray-900">Entries</span>
          <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{mod.items.length}</span>
        </div>
        {mod.items.map((entry, i) => (
          <div key={i} onMouseEnter={() => setHoveredRow(i)} onMouseLeave={() => setHoveredRow(null)}
            className={`px-4 py-2.5 border-b border-gray-100 last:border-b-0 transition-colors ${entry.status === "gap" ? "border-l-2 border-l-yellow-400" : ""} ${hoveredRow === i ? "bg-violet-50/50" : ""}`} style={entry.status === "gap" ? { borderRadius: 0 } : undefined}>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[11px] font-medium text-gray-900 flex-1 truncate">{entry.name}</span>
              <StatusBadge status={entry.status} />
            </div>
            <p className="text-[10px] text-gray-500">{entry.contributor}{" \u00b7 "}{entry.date}</p>
          </div>
        ))}
      </div>

      {/* Right: Entry heatmap */}
      <div className="col-span-7 rounded-lg border border-gray-200 bg-white overflow-hidden">
        <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <span className="text-[12px] font-semibold text-gray-900">Activity heatmap</span>
          <Legend />
        </div>
        <div className="p-4">
          <HeatmapGrid rows={mod.items.map(e => ({ label: e.name.length > 22 ? e.name.slice(0, 20) + "\u2026" : e.name, activity: e.activity }))} hoveredRow={hoveredRow} setHoveredRow={setHoveredRow} />
        </div>
      </div>
    </div>
  );
}

function HeatmapGrid({ rows, hoveredRow, setHoveredRow }) {
  return (
    <table className="w-full" style={{ borderCollapse: "collapse", tableLayout: "fixed" }}>
      <thead>
        <tr>
          <th style={{ width: "38%", padding: "0 6px 8px 0" }} />
          {MONTHS.map(m => <th key={m} className="text-[10px] font-normal text-gray-400 text-center" style={{ padding: "0 0 8px" }}>{m}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} onMouseEnter={() => setHoveredRow(ri)} onMouseLeave={() => setHoveredRow(null)}
            className={hoveredRow === ri ? "bg-violet-50/30" : ""}>
            <td className="text-[11px] text-gray-800 truncate" style={{ padding: "4px 8px 4px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.label}</td>
            {row.activity.map((v, ci) => {
              const c = cellColor(v);
              return <td key={ci} style={{ padding: "2px" }}><div style={{ height: 22, borderRadius: 3, background: c.bg, border: `0.5px solid ${c.border}` }} /></td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Legend() {
  return (
    <div className="flex items-center gap-2 text-[9px] text-gray-400">
      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: "#f5f3ff", border: "0.5px solid #e4e0f5" }} />None</span>
      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: "#c4b5fd" }} />Low</span>
      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: "#7c3aed" }} />High</span>
      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: "#fde68a" }} />Gap</span>
    </div>
  );
}
