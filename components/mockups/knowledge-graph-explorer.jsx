"use client";

// ART-EEP — Knowledge Graph explorer (Consumer plane)
// Scoped to the MASTER.md "AI-Native Minimal" glass shell (CL-096). English-only
// showcase with latinized handles (CL-097). Implements CL-094 (progressive
// disclosure, contextual chips, 0-token hover via stored short_summary, Timeline
// + Heatmap, prompt disambiguation) and CL-093 (Tier-1 locked stub / Tier-2 ghost).
// Tailwind + lucide-react only. Static mock data — no backend.

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Network, CheckCircle2, AlertTriangle, ShieldAlert, Lock, User,
  Boxes, Workflow, FileText, GitBranch, Sparkles, Search, Sun, Moon,
  ArrowLeft, RotateCcw, Plus, Minus, Clock, Activity, X,
} from "lucide-react";

const CX = 500, CY = 360, DOMAIN_R = 235, CHILD_R = 132;

const SUBJECT = { id: "minh-le", label: "Minh Le", sub: "Senior Backend Engineer · offboarding" };

const RAW_DOMAINS = [
  {
    id: "atlas", label: "Project Atlas", kind: "project", status: "verified",
    summary: "Core ledger service Minh owned for three years; powers every balance read.",
    source: "Trello · Atlas board",
    children: [
      { id: "atlas-model", label: "Ledger data model", kind: "decision", status: "canonical", summary: "Double-entry schema; never mutate posted rows, append reversals instead.", source: "Trello · ATLAS-204" },
      { id: "atlas-migration", label: "Shard migration risk", kind: "risk", status: "critical", summary: "Re-sharding mid-quarter risks balance drift; only do it in a freeze window.", source: "Trello · ATLAS-512" },
      { id: "atlas-shardkeys", label: "Shard-key rework", kind: "ticket", status: "contested", summary: "Proposed new shard keys; a teammate flagged this as out of date.", source: "Trello · ATLAS-530" },
    ],
  },
  {
    id: "gateway", label: "Payment Gateway", kind: "project", status: "verified",
    summary: "Handles third-party payment callbacks and retries across the platform.",
    source: "Trello · Gateway board",
    children: [
      { id: "gw-retry", label: "Retry & backoff", kind: "runbook", status: "verified", summary: "Exponential backoff capped at six tries; idempotency key on every call.", source: "Trello · GW-88" },
      { id: "gw-idem", label: "Webhook idempotency", kind: "decision", status: "canonical", summary: "Dedupe on provider event id; keep seen ids for thirty days.", source: "Trello · GW-91" },
      { id: "gw-creds", label: "Sandbox key rotation", kind: "runbook", status: "verified", summary: "Rotate sandbox keys monthly; production keys live in Key Vault only.", source: "Trello · GW-103 · secret redacted" },
    ],
  },
  {
    id: "oncall", label: "On-call & incidents", kind: "runbook", status: "verified",
    summary: "How Minh ran the rotation and the playbooks he leaned on.",
    source: "Trello · Ops board",
    children: [
      { id: "oc-failover", label: "DB failover runbook", kind: "runbook", status: "canonical", summary: "Promote the replica, flip the DNS weight, then drain the old primary.", source: "Trello · OPS-12" },
      { id: "oc-escalation", label: "Pager escalation", kind: "decision", status: "verified", summary: "Page Minh first, then Ha Vy after fifteen minutes with no ack.", source: "Trello · OPS-19" },
    ],
  },
  {
    id: "people", label: "Team & stakeholders", kind: "people", status: "verified",
    summary: "The people Minh worked with most across his handover surface.",
    source: "Trello · board members",
    children: [
      { id: "p-havy", label: "Ha Vy", kind: "person", status: "verified", summary: "Minh's manager; owns the handover and signs off every committed fact.", source: "Manager" },
      { id: "p-nam", label: "Nam · successor", kind: "person", status: "verified", summary: "Incoming senior backend engineer inheriting Atlas and the Gateway.", source: "Successor" },
      { id: "p-linh", label: "Linh", kind: "person", status: "verified", summary: "Frontend lead; main consumer of the Gateway webhook contract.", source: "Trello · co-member" },
    ],
  },
  {
    id: "decisions", label: "Decisions & rationale", kind: "decision", status: "verified",
    summary: "The non-obvious calls a successor would otherwise have to rediscover.",
    source: "Trello · various",
    children: [
      { id: "d-cosmos", label: "Cosmos over Redis", kind: "decision", status: "canonical", summary: "Chose Cosmos integrated cache to avoid running a separate Redis tier.", source: "Trello · ARCH-7" },
      { id: "d-email", label: "Dropped email scanning", kind: "decision", status: "verified", summary: "Removed email as a source; shared workspaces only, for a cleaner privacy posture.", source: "Trello · ARCH-22" },
    ],
  },
  {
    id: "legal", label: "Vendor retainer", kind: "doc", status: "locked", tier: 1,
    summary: null, source: "Legal · access controlled", children: [],
  },
];

const HIDDEN_COUNT = 1; // Tier-2 ghosted (e.g. a [Finance] node) — never enters the result set

const KIND_ICON = {
  project: Boxes, runbook: Workflow, decision: GitBranch, risk: ShieldAlert,
  ticket: FileText, person: User, people: User, doc: FileText, hub: Sparkles,
};

function statusStyle(status) {
  switch (status) {
    case "canonical": return { dot: "#34d399", ring: "ring-emerald-400/60", label: "Canonical fact", Badge: Network, badgeCls: "text-emerald-300 border-emerald-400/40 bg-emerald-400/10" };
    case "verified": return { dot: "#10b981", ring: "ring-emerald-500/30", label: "Verified", Badge: CheckCircle2, badgeCls: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10" };
    case "contested": return { dot: "#f59e0b", ring: "ring-amber-400/60", label: "Under review", Badge: AlertTriangle, badgeCls: "text-amber-300 border-amber-400/40 bg-amber-400/10" };
    case "critical": return { dot: "#fb7185", ring: "ring-rose-400/60", label: "Critical", Badge: ShieldAlert, badgeCls: "text-rose-300 border-rose-400/40 bg-rose-400/10" };
    case "locked": return { dot: "#94a3b8", ring: "ring-slate-400/40", label: "Access controlled", Badge: Lock, badgeCls: "text-slate-300 border-slate-400/30 bg-slate-400/10" };
    case "person": return { dot: "#818cf8", ring: "ring-indigo-400/50", label: "Person", Badge: User, badgeCls: "text-indigo-300 border-indigo-400/40 bg-indigo-400/10" };
    default: return { dot: "#818cf8", ring: "ring-indigo-400/40", label: "Node", Badge: CheckCircle2, badgeCls: "text-indigo-300 border-indigo-400/30 bg-indigo-400/10" };
  }
}

const CHIPS = [
  { id: "risks", label: "Show risks", set: ["atlas", "atlas-migration", "atlas-shardkeys", "oncall"], expand: ["atlas"] },
  { id: "projects", label: "Key projects", set: ["atlas", "gateway"], expand: [] },
  { id: "stakeholders", label: "Stakeholders", set: ["people", "p-havy", "p-nam", "p-linh"], expand: ["people"] },
  { id: "timeline", label: "Recent timeline", set: [], expand: [], view: "history" },
];

const TIMELINE = [
  { date: "Mar 2023", text: "Atlas ledger service goes to production", tone: "emerald" },
  { date: "Aug 2024", text: "Payment Gateway retry logic rewritten after incident", tone: "rose" },
  { date: "Jan 2025", text: "Cosmos-over-Redis decision recorded", tone: "indigo" },
  { date: "Apr 2026", text: "Shard-key rework proposed — later flagged for review", tone: "amber" },
  { date: "Jun 2026", text: "Handover initiated; Trello seeded into the graph", tone: "indigo" },
];

export default function KnowledgeGraphExplorer() {
  const [dark, setDark] = useState(true);
  const [view, setView] = useState("graph");
  const [expanded, setExpanded] = useState(() => new Set(["atlas"]));
  const [selected, setSelected] = useState("atlas");
  const [hovered, setHovered] = useState(null);
  const [focusSet, setFocusSet] = useState(null);
  const [activeChip, setActiveChip] = useState(null);
  const [requested, setRequested] = useState(() => new Set());
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [ask, setAsk] = useState("");
  const [disambig, setDisambig] = useState(false);

  const domains = useMemo(() => {
    const list = RAW_DOMAINS.map((d, i) => {
      const a = ((-90 + i * (360 / RAW_DOMAINS.length)) * Math.PI) / 180;
      const x = CX + DOMAIN_R * Math.cos(a);
      const y = CY + DOMAIN_R * Math.sin(a);
      const n = d.children.length;
      const children = d.children.map((c, j) => {
        const spread = Math.PI / 2.6;
        const off = n > 1 ? -spread / 2 + j * (spread / (n - 1)) : 0;
        const ca = a + off;
        return { ...c, x: x + CHILD_R * Math.cos(ca), y: y + CHILD_R * Math.sin(ca), parent: d.id };
      });
      return { ...d, x, y, children };
    });
    return list;
  }, []);

  const byId = useMemo(() => {
    const m = {};
    m[SUBJECT.id] = { ...SUBJECT, x: CX, y: CY, kind: "hub", status: "hub" };
    domains.forEach((d) => { m[d.id] = d; d.children.forEach((c) => (m[c.id] = c)); });
    return m;
  }, [domains]);

  const visibleNodes = useMemo(() => {
    const nodes = [byId[SUBJECT.id], ...domains];
    domains.forEach((d) => { if (expanded.has(d.id)) d.children.forEach((c) => nodes.push(c)); });
    return nodes;
  }, [domains, expanded, byId]);

  const edges = useMemo(() => {
    const e = [];
    domains.forEach((d) => {
      e.push({ from: byId[SUBJECT.id], to: d });
      if (expanded.has(d.id)) d.children.forEach((c) => e.push({ from: d, to: c }));
    });
    return e;
  }, [domains, expanded, byId]);

  function dimmed(id) {
    if (!focusSet) return false;
    return !focusSet.has(id);
  }

  function focusOn(ids) {
    const pts = ids.map((id) => byId[id]).filter(Boolean);
    if (!pts.length) { setPan({ x: 0, y: 0 }); setZoom(1); return; }
    const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
    const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
    setZoom(pts.length <= 1 ? 1.25 : 1.12);
    setPan({ x: CX - cx, y: CY - cy });
  }

  function applyChip(chip) {
    if (chip.view === "history") { setView("history"); setActiveChip(chip.id); return; }
    setView("graph");
    if (activeChip === chip.id) { resetView(); return; }
    setActiveChip(chip.id);
    setExpanded((prev) => { const n = new Set(prev); chip.expand.forEach((id) => n.add(id)); return n; });
    setFocusSet(new Set(chip.set));
    focusOn(chip.set);
    setSelected(chip.set[0] ?? null);
  }

  function resetView() {
    setFocusSet(null); setActiveChip(null); setZoom(1); setPan({ x: 0, y: 0 });
  }

  function toggleExpand(id) {
    setExpanded((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  function selectNode(node) {
    setSelected(node.id);
    if (node.status === "hub" || node.parent === undefined) focusOn([node.id]);
    else focusOn([node.id]);
  }

  function submitAsk(e) {
    e?.preventDefault?.();
    if (!ask.trim()) return;
    setDisambig(true); // prompt disambiguation: never pull the whole graph
  }

  const sel = selected ? byId[selected] : null;

  const bg = dark ? "bg-[#0B0F1A] text-slate-100" : "bg-gradient-to-b from-[#EEF0FF] to-white text-slate-900";
  const panel = dark ? "bg-white/[0.04] border-white/10" : "bg-white/80 border-slate-200";
  const subtle = dark ? "text-slate-400" : "text-slate-500";
  const mono = { fontFamily: "ui-monospace, Menlo, monospace" };

  return (
    <div className={`min-h-screen w-full ${bg} relative overflow-hidden`} style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      {/* atmosphere */}
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: dark ? "radial-gradient(circle at 30% 20%, rgba(99,102,241,0.12), transparent 45%), radial-gradient(circle at 75% 70%, rgba(124,58,237,0.10), transparent 50%)" : "radial-gradient(circle at 30% 20%, rgba(99,102,241,0.10), transparent 45%)" }} />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)", backgroundSize: "26px 26px" }} />

      {/* floating top bar */}
      <header className={`absolute top-4 left-4 right-4 z-30 h-12 px-3 rounded-2xl border backdrop-blur-md flex items-center gap-3 shadow-lg ${panel}`}>
        <Link href="/" className={`inline-flex items-center gap-1.5 h-8 px-2.5 rounded-xl text-[13px] transition-colors ${dark ? "hover:bg-white/10 text-slate-200" : "hover:bg-slate-100 text-slate-700"}`}>
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} /> Dashboard
        </Link>
        <div className={`w-px h-5 ${dark ? "bg-white/10" : "bg-slate-200"}`} />
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-6 h-6 rounded-lg inline-flex items-center justify-center bg-gradient-to-br from-[#6366F1] to-[#7C3AED] text-white shrink-0"><Network className="w-3.5 h-3.5" strokeWidth={2} /></span>
          <div className="leading-tight min-w-0">
            <div className="text-[13px] font-semibold truncate">Knowledge graph</div>
            <div className={`text-[10px] ${subtle} truncate`}>{SUBJECT.label}'s handover · Engineering</div>
          </div>
        </div>
        <div className="flex-1" />
        <div className={`hidden sm:flex items-center rounded-xl border ${dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
          <button onClick={() => setView("graph")} className={`h-8 px-3 text-[12px] rounded-l-xl transition-colors ${view === "graph" ? "bg-[#6366F1] text-white" : dark ? "text-slate-300 hover:bg-white/5" : "text-slate-600 hover:bg-slate-50"}`}>Graph</button>
          <button onClick={() => setView("history")} className={`h-8 px-3 text-[12px] rounded-r-xl transition-colors ${view === "history" ? "bg-[#6366F1] text-white" : dark ? "text-slate-300 hover:bg-white/5" : "text-slate-600 hover:bg-slate-50"}`}>History</button>
        </div>
        <button onClick={() => setDark((v) => !v)} title="Toggle theme" className={`h-8 w-8 rounded-xl inline-flex items-center justify-center transition-colors ${dark ? "hover:bg-white/10 text-slate-200" : "hover:bg-slate-100 text-slate-600"}`}>
          {dark ? <Sun className="w-4 h-4" strokeWidth={1.75} /> : <Moon className="w-4 h-4" strokeWidth={1.75} />}
        </button>
      </header>

      <div className="absolute inset-0 pt-20 px-4 pb-4 flex gap-4">
        {/* Copilot rail */}
        <aside className={`hidden lg:flex flex-col w-72 shrink-0 rounded-2xl border backdrop-blur-md p-3.5 shadow-lg ${panel}`}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#818cf8]" strokeWidth={1.75} />
            <span className="text-[13px] font-semibold">Ask the graph</span>
          </div>
          <form onSubmit={submitAsk} className={`flex items-center gap-2 h-9 px-2.5 rounded-xl border ${dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
            <Search className={`w-3.5 h-3.5 ${subtle}`} strokeWidth={1.75} />
            <input value={ask} onChange={(e) => { setAsk(e.target.value); setDisambig(false); }} placeholder="e.g. Tell me about Atlas" className={`bg-transparent outline-none text-[12px] flex-1 min-w-0 ${dark ? "placeholder:text-slate-500" : "placeholder:text-slate-400"}`} />
          </form>

          {disambig && (
            <div className={`mt-3 rounded-xl border p-3 ${dark ? "border-indigo-400/30 bg-indigo-400/10" : "border-indigo-200 bg-indigo-50"}`}>
              <p className="text-[12px] leading-snug">That covers a lot of ground. Which part do you want?</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {CHIPS.slice(0, 3).map((c) => (
                  <button key={c.id} onClick={() => { setDisambig(false); applyChip(c); }} className="text-[11px] px-2 py-1 rounded-lg bg-[#6366F1] text-white hover:brightness-110 transition">{c.label}</button>
                ))}
              </div>
              <p className={`text-[10px] mt-2 ${subtle}`} style={mono}>disambiguate before retrieval · protects the context window</p>
            </div>
          )}

          <p className={`text-[10px] uppercase tracking-wider font-semibold mt-4 mb-2 ${subtle}`} style={mono}>Quick start</p>
          <div className="flex flex-col gap-1.5">
            {CHIPS.map((c) => (
              <button key={c.id} onClick={() => applyChip(c)} className={`text-left text-[12px] h-8 px-2.5 rounded-xl border transition-colors ${activeChip === c.id ? "bg-[#6366F1] text-white border-transparent" : dark ? "border-white/10 hover:bg-white/5 text-slate-200" : "border-slate-200 hover:bg-slate-50 text-slate-700"}`}>{c.label}</button>
            ))}
          </div>

          <div className="flex-1" />
          <div className={`rounded-xl border p-2.5 ${dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
            <div className="flex items-center gap-1.5 text-[11px]">
              <Lock className={`w-3 h-3 ${subtle}`} strokeWidth={1.75} />
              <span className={subtle}>{HIDDEN_COUNT} node hidden by access policy</span>
            </div>
            <p className={`text-[10px] mt-1 leading-snug ${subtle}`}>Sensitive content is ghosted — it never enters the result set.</p>
          </div>
        </aside>

        {/* Stage */}
        <main className={`relative flex-1 min-w-0 rounded-2xl border overflow-hidden ${dark ? "border-white/10" : "border-slate-200"}`}>
          {view === "graph" ? (
            <>
              <div className="absolute inset-0 grid place-items-center overflow-hidden">
                <div style={{ position: "relative", width: 1000, height: 720, transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "center center", transition: "transform 600ms cubic-bezier(0.22,1,0.36,1)" }}>
                  <svg width={1000} height={720} className="absolute inset-0 pointer-events-none">
                    {edges.map((e, i) => {
                      const dim = focusSet && (!focusSet.has(e.from.id) || !focusSet.has(e.to.id));
                      return <line key={i} x1={e.from.x} y1={e.from.y} x2={e.to.x} y2={e.to.y} stroke={dark ? "#ffffff" : "#0F172A"} strokeOpacity={dim ? 0.05 : 0.16} strokeWidth={1.5} />;
                    })}
                  </svg>
                  {visibleNodes.map((n) => (
                    <GraphNode key={n.id} node={n} dark={dark} dim={dimmed(n.id)} selected={selected === n.id} hovered={hovered === n.id}
                      expandable={n.status !== "hub" && n.parent === undefined && n.children && n.children.length > 0}
                      isExpanded={expanded.has(n.id)}
                      onHover={setHovered} onSelect={selectNode} onToggle={toggleExpand} />
                  ))}
                </div>
              </div>

              {/* zoom controls */}
              <div className={`absolute bottom-4 left-4 z-10 flex flex-col rounded-xl border backdrop-blur ${panel}`}>
                <button onClick={() => setZoom((z) => Math.min(1.8, z + 0.15))} className={`h-8 w-8 inline-flex items-center justify-center ${dark ? "hover:bg-white/10" : "hover:bg-slate-100"}`}><Plus className="w-3.5 h-3.5" strokeWidth={1.75} /></button>
                <button onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))} className={`h-8 w-8 inline-flex items-center justify-center border-t ${dark ? "border-white/10 hover:bg-white/10" : "border-slate-200 hover:bg-slate-100"}`}><Minus className="w-3.5 h-3.5" strokeWidth={1.75} /></button>
              </div>
              <button onClick={resetView} className={`absolute bottom-4 right-4 z-10 h-8 px-3 rounded-xl border backdrop-blur text-[12px] inline-flex items-center gap-1.5 ${panel} ${dark ? "hover:bg-white/10" : "hover:bg-slate-100"}`}>
                <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.75} /> Reset
              </button>
              <p className={`absolute top-3 left-4 z-10 text-[10px] ${subtle}`} style={mono}>double-click a hub to expand · hover for summary · 0-token</p>
            </>
          ) : (
            <HistoryView dark={dark} subtle={subtle} mono={mono} />
          )}
        </main>

        {/* Detail panel */}
        <aside className={`hidden xl:flex flex-col w-80 shrink-0 rounded-2xl border backdrop-blur-md p-4 shadow-lg ${panel}`}>
          {sel ? <NodeDetail node={sel} dark={dark} subtle={subtle} mono={mono} requested={requested.has(sel.id)} onRequest={() => setRequested((p) => new Set(p).add(sel.id))} /> : (
            <p className={`text-[12px] ${subtle}`}>Select a node to see its provenance and status.</p>
          )}
        </aside>
      </div>
    </div>
  );
}

function GraphNode({ node, dark, dim, selected, hovered, expandable, isExpanded, onHover, onSelect, onToggle }) {
  const s = statusStyle(node.status === "person" ? "person" : node.status);
  const Icon = KIND_ICON[node.kind] || CheckCircle2;
  const isHub = node.status === "hub";
  const isLocked = node.status === "locked";
  const size = isHub ? 76 : node.parent === undefined ? 56 : 44;

  return (
    <div
      style={{ position: "absolute", left: node.x, top: node.y, transform: "translate(-50%,-50%)", opacity: dim ? 0.22 : 1, transition: "opacity 400ms ease, left 500ms ease, top 500ms ease", zIndex: hovered || selected ? 20 : 5 }}
      onMouseEnter={() => onHover(node.id)} onMouseLeave={() => onHover(null)}
    >
      <button
        onClick={() => onSelect(node)}
        onDoubleClick={() => expandable && onToggle(node.id)}
        className="block focus:outline-none"
        style={{ cursor: "pointer" }}
      >
        <div
          className={`rounded-full grid place-items-center ring-2 ${selected ? "ring-[3px] ring-[#818cf8]" : s.ring} transition-all`}
          style={{
            width: size, height: size,
            background: isHub ? "linear-gradient(135deg,#6366F1,#7C3AED)" : dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.92)",
            boxShadow: isHub ? "0 8px 30px rgba(99,102,241,0.45)" : selected || hovered ? `0 6px 22px ${s.dot}55` : "0 2px 10px rgba(0,0,0,0.18)",
            backdropFilter: "blur(6px)",
          }}
        >
          <Icon className="" style={{ width: isHub ? 26 : 18, height: isHub ? 26 : 18, color: isHub ? "#fff" : s.dot }} strokeWidth={1.9} />
          {!isHub && !isLocked && <span style={{ position: "absolute", right: -1, top: -1, width: 10, height: 10, borderRadius: 999, background: s.dot, border: "2px solid " + (dark ? "#0B0F1A" : "#fff") }} />}
        </div>
        <div
          className={`mt-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap ${dark ? "text-slate-100" : "text-slate-800"}`}
          style={{ background: dark ? "rgba(11,15,26,0.7)" : "rgba(255,255,255,0.85)", maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {node.label}
        </div>
        {expandable && (
          <span className={`mt-0.5 inline-block text-[9px] px-1 rounded ${dark ? "bg-white/10 text-slate-300" : "bg-slate-100 text-slate-500"}`} style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
            {isExpanded ? "− collapse" : `+ ${node.children.length}`}
          </span>
        )}
      </button>

      {/* 0-token hover summary */}
      {hovered && (node.summary || isLocked) && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-52 rounded-xl border px-3 py-2 text-[11px] leading-snug shadow-xl ${dark ? "bg-[#0B0F1A]/95 border-white/15 text-slate-200" : "bg-white border-slate-200 text-slate-700"}`}
          style={{ pointerEvents: "none" }}
        >
          {isLocked ? "Access controlled — request access to view this node's contents." : node.summary}
          <span className={`block mt-1 text-[9px] ${dark ? "text-slate-500" : "text-slate-400"}`} style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>short_summary · 0 token</span>
        </div>
      )}
    </div>
  );
}

function NodeDetail({ node, dark, subtle, mono, requested, onRequest }) {
  const s = statusStyle(node.status === "person" ? "person" : node.status);
  const Icon = KIND_ICON[node.kind] || CheckCircle2;
  const isLocked = node.status === "locked";
  const isHub = node.status === "hub";

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start gap-2.5">
        <span className="w-9 h-9 rounded-xl grid place-items-center shrink-0" style={{ background: isHub ? "linear-gradient(135deg,#6366F1,#7C3AED)" : dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.9)", border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0" }}>
          <Icon style={{ width: 18, height: 18, color: isHub ? "#fff" : s.dot }} strokeWidth={1.9} />
        </span>
        <div className="min-w-0">
          <p className="text-[14px] font-semibold leading-tight">{node.label}</p>
          <p className={`text-[11px] ${subtle} capitalize`}>{isHub ? node.sub : node.kind}</p>
        </div>
      </div>

      {!isHub && (
        <span className={`mt-3 inline-flex items-center gap-1.5 self-start text-[11px] px-2 py-1 rounded-lg border ${s.badgeCls}`}>
          <s.Badge className="w-3 h-3" strokeWidth={2} /> {s.label}
        </span>
      )}

      {node.status === "contested" && (
        <div className={`mt-3 rounded-xl border p-2.5 ${dark ? "border-amber-400/30 bg-amber-400/10" : "border-amber-200 bg-amber-50"}`}>
          <p className="text-[11px] leading-snug">A teammate flagged this as wrong or out of date. It's waiting on the offboarder to correct before it commits.</p>
        </div>
      )}

      {isLocked ? (
        <div className={`mt-3 rounded-xl border p-3 ${dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
          <p className="text-[12px] leading-snug">This node exists, but its contents are access controlled. You can request access from the owner.</p>
          <button onClick={onRequest} disabled={requested} className={`mt-2.5 w-full h-8 rounded-xl text-[12px] font-medium transition ${requested ? "bg-emerald-500/20 text-emerald-300 cursor-default" : "bg-[#6366F1] text-white hover:brightness-110"}`}>
            {requested ? "Request sent" : "Request access"}
          </button>
        </div>
      ) : !isHub ? (
        <p className={`mt-3 text-[12.5px] leading-relaxed ${dark ? "text-slate-200" : "text-slate-700"}`}>{node.summary}</p>
      ) : (
        <p className={`mt-3 text-[12.5px] leading-relaxed ${dark ? "text-slate-200" : "text-slate-700"}`}>The handover hub. Double-click any surrounding hub to expand its captured knowledge.</p>
      )}

      <div className="flex-1" />
      {node.source && (
        <div className={`mt-3 pt-3 border-t ${dark ? "border-white/10" : "border-slate-200"}`}>
          <p className={`text-[10px] uppercase tracking-wider font-semibold mb-1.5 ${subtle}`} style={mono}>Provenance</p>
          <span className={`inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-lg border ${dark ? "border-white/10 bg-white/5 text-slate-300" : "border-slate-200 bg-white text-slate-600"}`}>
            <FileText className="w-3 h-3" strokeWidth={1.75} /> {node.source}
          </span>
        </div>
      )}
    </div>
  );
}

function HistoryView({ dark, subtle, mono }) {
  const heat = useMemo(() => {
    const rows = 5, cols = 18, out = [];
    for (let r = 0; r < rows; r++) { const row = []; for (let c = 0; c < cols; c++) row.push((Math.sin(r * 1.7 + c * 0.6) + 1) / 2 * (0.4 + (c / cols) * 0.6)); out.push(row); }
    return out;
  }, []);
  const toneCls = { emerald: "bg-emerald-400", rose: "bg-rose-400", indigo: "bg-indigo-400", amber: "bg-amber-400" };

  return (
    <div className="absolute inset-0 p-5 grid grid-rows-2 gap-4 overflow-auto">
      <section>
        <div className="flex items-center gap-2 mb-3"><Clock className="w-4 h-4 text-[#818cf8]" strokeWidth={1.75} /><span className="text-[13px] font-semibold">Timeline</span></div>
        <ol className="relative ml-2">
          <span className={`absolute left-[5px] top-1 bottom-1 w-px ${dark ? "bg-white/10" : "bg-slate-200"}`} />
          {TIMELINE.map((t, i) => (
            <li key={i} className="relative pl-6 pb-3 last:pb-0">
              <span className={`absolute left-0 top-1 w-2.5 h-2.5 rounded-full ${toneCls[t.tone]}`} />
              <p className="text-[12.5px] leading-snug">{t.text}</p>
              <p className={`text-[10px] ${subtle}`} style={mono}>{t.date}</p>
            </li>
          ))}
        </ol>
      </section>
      <section>
        <div className="flex items-center gap-2 mb-3"><Activity className="w-4 h-4 text-[#818cf8]" strokeWidth={1.75} /><span className="text-[13px] font-semibold">Activity heatmap</span><span className={`text-[10px] ${subtle}`} style={mono}>update frequency · last 18 weeks</span></div>
        <div className="flex flex-col gap-1">
          {heat.map((row, r) => (
            <div key={r} className="flex gap-1">
              {row.map((v, c) => (
                <span key={c} className="rounded-sm" style={{ width: 16, height: 16, background: `rgba(99,102,241,${0.12 + v * 0.8})` }} title={`week ${c + 1}`} />
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
