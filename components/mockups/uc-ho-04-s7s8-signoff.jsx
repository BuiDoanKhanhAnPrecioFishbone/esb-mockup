"use client";

import React from "react";
import {
  Sparkles, Check, X, AlertTriangle, Info, ShieldCheck, ShieldAlert,
  Users, ArrowRight, ArrowUpRight, MoreHorizontal, History, RotateCcw,
  CheckCircle2, CircleDot, Crosshair, Flag, FileCheck, Award, Lock,
  GitMerge, GitBranch, FileText, MessageSquare, Hash, Clock, Activity,
  Network, BookOpen, Briefcase, Volume2, Loader2, Eye, Edit3, Send,
  ChevronRight, Star, Hourglass, Tag, Cpu, PenTool,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   UC-HO-04 · Step E · S7 Bundle Summary + S8 Sign-off
   QA-INT-01 §1.4 commit gate · the moment Hà Vy authorizes commit.

   Split from the main file (same reason as S6) — keeps individual
   write under the safe threshold and groups the two final states
   together since they share visual language (the "wrap-up" register).

   Exports:
     · S7BundleSummaryView · inner content for S7
     · S8SignOffView · inner content for S8 (done state visible)
     · DecisionPanelSummary · right rail for S7
     · DecisionPanelSignOff · right rail for S8

   Honors:
     · QA-INT-01 §1.4 · explicit Manager sign-off · SHA-256 anchor
     · QA-INT-01 §2.3 · immutable audit trail · entry created here
     · CL-101 · pre-commit network flag loop already cleared (S6)
     · The 3-phase user-facing lifecycle (Prepare · Capture · Deliver) ·
       this is the moment Deliver begins for Trần.
   ═══════════════════════════════════════════════════════════════════ */

const MONO_STACK = 'ui-monospace, "Geist Mono", "JetBrains Mono", Menlo, monospace';

const SESSION = {
  reviewer: "Hà Vy",
  reviewerInitials: "HV",
  reviewerHandle: "@ha.vy",
  reviewerRole: "Engineering Manager",
  offboarder: "Minh Lê",
  offboarderShort: "Minh",
  offboarderInitials: "ML",
  successor: "Trần Hữu Nam",
  successorShort: "Trần",
  successorInitials: "TN",
  flaggerNet: "Duy Nguyễn",
  flaggerNetInitials: "DN",
  corroboratorName: "Phương Anh Nguyễn",
  corroboratorInitials: "PA",
};

// A plausible SHA-256 hex string for the bundle anchor (64 chars).
const BUNDLE_ANCHOR_SHA = "8f3a2b9c5d1e7f4a6b8c2e9d5a3f7b1c8e6d4a2f9b5c7e3d1a8f6b4c2e9d7a5f";

const BUNDLE_TOTALS = {
  canonical: 9,
  verified: 3,
  sentBack: 2,
  rejected: 0,
  total: 14,
};

/* ═══════════════════════════════════════════════════════════════════
   S7 · Bundle summary · propagation preview
   ═══════════════════════════════════════════════════════════════════ */

export function S7BundleSummaryView() {
  return (
    <div className="px-6 py-6 max-w-[1040px]">
      <BundleSummaryHeader />
      <OutcomeStatRow />
      <CategoryBreakdownTable />
      <PropagationPreview />
      <TeamImpactRow />
      <ReadyToSignOffStrip />
    </div>
  );
}

function BundleSummaryHeader() {
  return (
    <div className="rounded-xl bg-white border border-gray-200 border-l-[3px] border-l-emerald-500 px-4 py-3 mb-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg border bg-emerald-50 border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
        <FileCheck className="w-4.5 h-4.5" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-gray-500">Bundle review · complete</span>
          <span className="text-gray-300">·</span>
          <span className="text-[11px] text-gray-600">All 14 items decided · ready for sign-off</span>
          <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 inline-flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" strokeWidth={2} />
            Review complete
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">
          {SESSION.offboarderShort}'s bundle · what's about to commit
        </h2>
        <p className="text-[11px] text-gray-500 mt-1">
          Once you sign off on the next screen, the items below propagate to the Knowledge Graph and downstream consumers. You're about to start {SESSION.successorShort}'s <strong>Deliver</strong> phase.
        </p>
      </div>
      <button className="text-gray-400 hover:text-gray-700 p-1.5 shrink-0">
        <MoreHorizontal className="w-4 h-4" strokeWidth={1.75} />
      </button>
    </div>
  );
}

function OutcomeStatRow() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <OutcomeTile
        icon={Award}
        value={BUNDLE_TOTALS.canonical}
        label="Canonical"
        sublabel="Promoted to authoritative facts"
        tone="emerald"
      />
      <OutcomeTile
        icon={ShieldCheck}
        value={BUNDLE_TOTALS.verified}
        label="Verified only"
        sublabel="Accurate · session-scoped"
        tone="violet"
      />
      <OutcomeTile
        icon={RotateCcw}
        value={BUNDLE_TOTALS.sentBack}
        label="Sent back"
        sublabel={`Awaiting ${SESSION.offboarderShort}`}
        tone="yellow"
      />
      <OutcomeTile
        icon={X}
        value={BUNDLE_TOTALS.rejected}
        label="Rejected"
        sublabel="No items dropped"
        tone="gray"
      />
    </div>
  );
}

function OutcomeTile({ icon: Icon, value, label, sublabel, tone }) {
  const cfg = {
    emerald: { ring: "border-emerald-300 ring-2 ring-emerald-500/10", bg: "bg-emerald-50/30", iconBg: "bg-emerald-100 border-emerald-300 text-emerald-700", valueCls: "text-emerald-700" },
    violet:  { ring: "border-violet-200",                              bg: "bg-violet-50/30",  iconBg: "bg-violet-50 border-violet-200 text-violet-700",      valueCls: "text-violet-700" },
    yellow:  { ring: "border-yellow-200",                              bg: "bg-yellow-50/30",  iconBg: "bg-yellow-50 border-yellow-200 text-yellow-700",      valueCls: "text-yellow-700" },
    gray:    { ring: "border-gray-200",                                bg: "bg-white",         iconBg: "bg-gray-50 border-gray-200 text-gray-500",            valueCls: "text-gray-400" },
  }[tone];
  return (
    <div className={`rounded-xl border ${cfg.ring} ${cfg.bg} p-3`}>
      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center mb-2 ${cfg.iconBg}`}>
        <Icon className="w-3.5 h-3.5" strokeWidth={2} />
      </div>
      <div className={`text-3xl font-bold ${cfg.valueCls} tracking-tight leading-none`} style={{ fontFamily: MONO_STACK }}>{value}</div>
      <div className="text-[11px] font-semibold text-gray-900 mt-2">{label}</div>
      <div className="text-[10px] text-gray-500 mt-0.5 leading-snug">{sublabel}</div>
    </div>
  );
}

function CategoryBreakdownTable() {
  const rows = [
    { label: "Manager priorities",      icon: Sparkles,       count: 2, canonical: 2, verified: 0, sentBack: 0, tone: "violet" },
    { label: "Network questions",       icon: Users,          count: 3, canonical: 2, verified: 0, sentBack: 1, tone: "indigo" },
    { label: "Pre-commit flag fixes",   icon: AlertTriangle,  count: 1, canonical: 1, verified: 0, sentBack: 0, tone: "yellow" },
    { label: "Own contributions",       icon: PenTool,        count: 5, canonical: 3, verified: 1, sentBack: 1, tone: "gray" },
    { label: "Uploaded files",          icon: FileText,       count: 3, canonical: 1, verified: 2, sentBack: 0, tone: "emerald" },
  ];
  return (
    <div className="rounded-xl bg-white border border-gray-200 overflow-hidden mb-4">
      <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
        <FileText className="w-3.5 h-3.5 text-violet-700" strokeWidth={2} />
        <h3 className="text-[12px] font-semibold text-gray-900">Per-category breakdown</h3>
        <span className="ml-auto text-[10px] text-gray-500" style={{ fontFamily: MONO_STACK }}>14 items across 5 categories · 1 redirected</span>
      </div>
      <div className="divide-y divide-gray-100">
        <div className="grid grid-cols-12 gap-2 px-4 py-1.5 text-[9px] uppercase tracking-wider font-semibold text-gray-500 bg-gray-50/30">
          <div className="col-span-5">Category</div>
          <div className="col-span-1 text-right">Total</div>
          <div className="col-span-2 text-right">Canonical</div>
          <div className="col-span-2 text-right">Verified</div>
          <div className="col-span-2 text-right">Sent back</div>
        </div>
        {rows.map((r, i) => <CategoryBreakdownRow key={i} {...r} />)}
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-emerald-50/30">
          <div className="col-span-5 text-[11px] font-bold text-gray-900 inline-flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" strokeWidth={2} />
            Total committed
          </div>
          <div className="col-span-1 text-right text-[11px] font-bold text-gray-900" style={{ fontFamily: MONO_STACK }}>14</div>
          <div className="col-span-2 text-right text-[11px] font-bold text-emerald-700" style={{ fontFamily: MONO_STACK }}>{BUNDLE_TOTALS.canonical}</div>
          <div className="col-span-2 text-right text-[11px] font-bold text-violet-700" style={{ fontFamily: MONO_STACK }}>{BUNDLE_TOTALS.verified}</div>
          <div className="col-span-2 text-right text-[11px] font-bold text-yellow-700" style={{ fontFamily: MONO_STACK }}>{BUNDLE_TOTALS.sentBack}</div>
        </div>
      </div>
    </div>
  );
}

function CategoryBreakdownRow({ label, icon: Icon, count, canonical, verified, sentBack, tone }) {
  const iconCls = { violet: "text-violet-600", indigo: "text-indigo-600", yellow: "text-yellow-700", gray: "text-gray-500", emerald: "text-emerald-600" }[tone];
  return (
    <div className="grid grid-cols-12 gap-2 px-4 py-2 items-center hover:bg-gray-50/50 transition-colors">
      <div className="col-span-5 flex items-center gap-2 min-w-0">
        <Icon className={`w-3.5 h-3.5 shrink-0 ${iconCls}`} strokeWidth={2} />
        <span className="text-[12px] text-gray-900 truncate">{label}</span>
      </div>
      <div className="col-span-1 text-right text-[12px] text-gray-700" style={{ fontFamily: MONO_STACK }}>{count}</div>
      <div className="col-span-2 text-right text-[12px]" style={{ fontFamily: MONO_STACK }}>
        {canonical > 0 ? <span className="text-emerald-700 font-semibold">{canonical}</span> : <span className="text-gray-300">—</span>}
      </div>
      <div className="col-span-2 text-right text-[12px]" style={{ fontFamily: MONO_STACK }}>
        {verified > 0 ? <span className="text-violet-700 font-semibold">{verified}</span> : <span className="text-gray-300">—</span>}
      </div>
      <div className="col-span-2 text-right text-[12px]" style={{ fontFamily: MONO_STACK }}>
        {sentBack > 0 ? <span className="text-yellow-700 font-semibold">{sentBack}</span> : <span className="text-gray-300">—</span>}
      </div>
    </div>
  );
}

function PropagationPreview() {
  return (
    <div className="rounded-xl bg-violet-50/20 border border-violet-200 p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <GitMerge className="w-3.5 h-3.5 text-violet-700" strokeWidth={2} />
        <h3 className="text-[12px] font-semibold text-gray-900">Where it propagates on commit</h3>
        <span className="ml-auto text-[10px] text-gray-500" style={{ fontFamily: MONO_STACK }}>9 Canonical · 3 Verified · 5 destinations</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3 items-stretch">
        <PropagateNode
          icon={Network}
          title="Knowledge Graph"
          detail="12 nodes · 3 edges"
          subdetail="9 Canonical badges"
          tone="violet"
          primary
        />
        <PropagateNode
          icon={BookOpen}
          title={`${SESSION.successorShort}'s playbook`}
          detail="§3, §5, §7 update"
          subdetail="Trần sees Day 1"
          tone="emerald"
          primary
        />
        <PropagateNode
          icon={MessageSquare}
          title="Sales Slack"
          detail="#sales-handover"
          subdetail={`@${SESSION.corroboratorName.split(" ")[0].toLowerCase()}-anh notified`}
          tone="indigo"
        />
        <PropagateNode
          icon={MessageSquare}
          title="Data Platform Slack"
          detail="#data-platform"
          subdetail={`@${SESSION.flaggerNet.split(" ")[0].toLowerCase()} notified`}
          tone="indigo"
        />
        <PropagateNode
          icon={FileText}
          title="Vendor XYZ wiki"
          detail="2 entries replaced"
          subdetail="v2.1 → v3.0"
          tone="emerald"
        />
      </div>

      <div className="rounded-md bg-white border border-violet-200 px-3 py-2 text-[10px] text-gray-600 leading-snug inline-flex items-start gap-1.5 w-full">
        <Info className="w-3 h-3 text-violet-600 shrink-0 mt-0.5" strokeWidth={2} />
        <span>
          Each Canonical fact gets the <code style={{ fontFamily: MONO_STACK }} className="text-[10px] bg-emerald-50 px-1 rounded text-emerald-700">emerald-300</code> border treatment in {SESSION.successorShort}'s playbook (per QA-INT-01 §2.2). Lineage drawer shows the full audit chain on hover · including the AI capture → flag → fix sequence from item 6.
        </span>
      </div>
    </div>
  );
}

function PropagateNode({ icon: Icon, title, detail, subdetail, tone, primary }) {
  const cfg = {
    violet:  { border: primary ? "border-violet-300 ring-2 ring-violet-500/10" : "border-violet-200",   iconBg: "bg-violet-50 border-violet-200 text-violet-700",      text: "text-violet-700" },
    emerald: { border: primary ? "border-emerald-300 ring-2 ring-emerald-500/10" : "border-emerald-200", iconBg: "bg-emerald-50 border-emerald-200 text-emerald-700", text: "text-emerald-700" },
    indigo:  { border: "border-indigo-200",                                                               iconBg: "bg-indigo-50 border-indigo-200 text-indigo-700",   text: "text-indigo-700" },
  }[tone];
  return (
    <div className={`rounded-lg bg-white border ${cfg.border} p-2.5 flex flex-col`}>
      <div className={`w-7 h-7 rounded-md border flex items-center justify-center mb-2 shrink-0 ${cfg.iconBg}`}>
        <Icon className="w-3 h-3" strokeWidth={2} />
      </div>
      <div className="text-[11px] font-semibold text-gray-900 leading-tight">{title}</div>
      <div className={`text-[10px] ${cfg.text} mt-0.5 leading-snug`} style={{ fontFamily: MONO_STACK }}>{detail}</div>
      <div className="text-[9px] text-gray-500 mt-0.5 leading-snug">{subdetail}</div>
    </div>
  );
}

function TeamImpactRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
      <TeamImpactCard
        team="Engineering"
        teamLead={SESSION.successor}
        teamLeadInitials={SESSION.successorInitials}
        teamLeadRole="Receiving"
        impact={8}
        impactLabel="items land directly"
        impactDetail={`${SESSION.successorShort}'s playbook §3/§5/§7 + 5 graph nodes`}
        tone="emerald"
        primary
      />
      <TeamImpactCard
        team="Sales"
        teamLead={SESSION.corroboratorName}
        teamLeadInitials={SESSION.corroboratorInitials}
        teamLeadRole="Notified"
        impact={1}
        impactLabel="Vendor XYZ ref update"
        impactDetail="Cross-team via UC-HO-08 follow-up"
        tone="violet"
      />
      <TeamImpactCard
        team="Data Platform"
        teamLead={SESSION.flaggerNet}
        teamLeadInitials={SESSION.flaggerNetInitials}
        teamLeadRole="Corroborated"
        impact={2}
        impactLabel="Atlas rollback · INC-2942"
        impactDetail="Their flag chain anchored the correction"
        tone="indigo"
      />
    </div>
  );
}

function TeamImpactCard({ team, teamLead, teamLeadInitials, teamLeadRole, impact, impactLabel, impactDetail, tone, primary }) {
  const cfg = {
    emerald: { border: primary ? "border-emerald-300 ring-2 ring-emerald-500/10" : "border-emerald-200", bg: "bg-emerald-50/20",  avatarBg: "bg-emerald-100 border-emerald-200 text-emerald-700",  text: "text-emerald-700", labelBg: "bg-emerald-100 border-emerald-200 text-emerald-700" },
    violet:  { border: "border-violet-200",                                                              bg: "bg-violet-50/20",   avatarBg: "bg-violet-100 border-violet-200 text-violet-700",      text: "text-violet-700",  labelBg: "bg-violet-100 border-violet-200 text-violet-700" },
    indigo:  { border: "border-indigo-200",                                                              bg: "bg-indigo-50/20",   avatarBg: "bg-indigo-100 border-indigo-200 text-indigo-700",      text: "text-indigo-700",  labelBg: "bg-indigo-100 border-indigo-200 text-indigo-700" },
  }[tone];
  return (
    <div className={`rounded-xl ${cfg.bg} border ${cfg.border} p-3`}>
      <div className="flex items-center gap-2 mb-3">
        <Briefcase className={`w-3.5 h-3.5 ${cfg.text}`} strokeWidth={2} />
        <span className="text-[12px] font-semibold text-gray-900">{team}</span>
        <span className={`ml-auto text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full border ${cfg.labelBg}`}>{teamLeadRole}</span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className={`w-6 h-6 rounded-full ${cfg.avatarBg} border flex items-center justify-center text-[9px] font-semibold`}>{teamLeadInitials}</span>
        <span className="text-[11px] text-gray-700 truncate">{teamLead}</span>
      </div>

      <div className="rounded-md bg-white border border-gray-100 px-2.5 py-2">
        <div className={`text-2xl font-bold ${cfg.text} leading-none`} style={{ fontFamily: MONO_STACK }}>{impact}</div>
        <div className="text-[11px] font-semibold text-gray-900 mt-1">{impactLabel}</div>
        <div className="text-[9px] text-gray-500 mt-0.5 leading-snug">{impactDetail}</div>
      </div>
    </div>
  );
}

function ReadyToSignOffStrip() {
  return (
    <div className="rounded-2xl border-2 border-violet-300 bg-gradient-to-br from-violet-50/50 to-emerald-50/30 p-5 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-11 h-11 rounded-xl bg-white border-2 border-violet-300 flex items-center justify-center shrink-0">
          <Lock className="w-5 h-5 text-violet-700" strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-bold text-gray-900 tracking-tight">Ready to sign off · QA-INT-01 §1.4</h2>
          <p className="text-[11px] text-gray-600 leading-relaxed mt-0.5 max-w-xl">
            Your sign-off cryptographically anchors all 12 commits to your identity and timestamp. Items sent back to {SESSION.offboarderShort} stay open · he can answer them and you'll do a smaller second sign-off later.
          </p>
        </div>
      </div>
      <button className="h-11 px-5 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-[14px] font-semibold inline-flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30 shrink-0">
        <ShieldCheck className="w-4 h-4" strokeWidth={2} />
        Continue to sign-off
        <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S7 right rail · DecisionPanelSummary
   ═══════════════════════════════════════════════════════════════════ */

export function DecisionPanelSummary() {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border-2 border-emerald-300 bg-emerald-50/50 p-3 text-center">
        <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto mb-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" strokeWidth={2.5} />
        </div>
        <div className="text-[12px] font-semibold text-emerald-900">All 14 items decided</div>
        <div className="text-[10px] text-emerald-800/80 mt-1 leading-snug">
          One step left · sign-off cryptographically anchors the commit
        </div>
      </div>

      <div className="space-y-1.5">
        <SummaryDecisionButton icon={ShieldCheck} label="Continue to sign-off" tone="violet" />
        <SummaryDecisionButton icon={Eye} label="Review a specific item again" tone="gray" subtle />
        <SummaryDecisionButton icon={Edit3} label="Change a decision" tone="yellow" subtle />
      </div>

      <div className="pt-3 border-t border-gray-100">
        <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2">Mini-counts</div>
        <ul className="space-y-1.5 text-[10px] text-gray-600 leading-snug">
          <SummaryCountRow icon={Award} label="Canonical" value={BUNDLE_TOTALS.canonical} tone="emerald" />
          <SummaryCountRow icon={ShieldCheck} label="Verified only" value={BUNDLE_TOTALS.verified} tone="violet" />
          <SummaryCountRow icon={RotateCcw} label="Sent back" value={BUNDLE_TOTALS.sentBack} tone="yellow" />
          <SummaryCountRow icon={GitMerge} label="Propagation targets" value="5" tone="indigo" />
        </ul>
      </div>

      <div className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2 text-[10px] text-gray-600 leading-snug">
        <Info className="w-3 h-3 text-gray-500 inline-block mr-1 -mt-0.5" strokeWidth={2} />
        Sign-off can be undone within 15 minutes · QA-INT-01 §1.4 includes a brief grace window for accidents.
      </div>
    </div>
  );
}

function SummaryDecisionButton({ icon: Icon, label, tone, subtle }) {
  const cfg = {
    violet: subtle ? "border-violet-200 bg-white text-violet-700 hover:bg-violet-50" : "bg-violet-600 hover:bg-violet-700 text-white border-violet-600",
    yellow: subtle ? "border-yellow-200 bg-white text-yellow-800 hover:bg-yellow-50" : "bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-600",
    gray: subtle ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50" : "bg-gray-600 hover:bg-gray-700 text-white border-gray-600",
  }[tone];
  return (
    <button className={`w-full h-9 px-3 rounded-md border text-[12px] font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer focus:outline-none focus:ring-2 ${cfg}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
      <span className="flex-1 text-left">{label}</span>
    </button>
  );
}

function SummaryCountRow({ icon: Icon, label, value, tone }) {
  const text = { emerald: "text-emerald-700", violet: "text-violet-700", yellow: "text-yellow-700", indigo: "text-indigo-700" }[tone];
  return (
    <li className="flex items-center gap-1.5">
      <Icon className={`w-2.5 h-2.5 shrink-0 ${text}`} strokeWidth={2} />
      <span className="text-gray-700 flex-1">{label}</span>
      <span className={`font-semibold ${text}`} style={{ fontFamily: MONO_STACK }}>{value}</span>
    </li>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S8 · Sign-off · QA-INT-01 §1.4 commit gate · cryptographic anchor
   ═══════════════════════════════════════════════════════════════════ */

export function S8SignOffView() {
  return (
    <div className="px-6 py-6 max-w-[900px] mx-auto">
      <SignOffHeader />
      <ReviewSummaryStrip />
      <CryptographicAnchorCard />
      <SignatureCard />
      <CommitProgressLog />
      <DoneCard />
    </div>
  );
}

function SignOffHeader() {
  return (
    <div className="mb-5 text-center">
      <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] font-semibold text-violet-700 mb-3 mx-auto">
        <Lock className="w-3 h-3" strokeWidth={2.5} />
        QA-INT-01 §1.4 · commit gate
      </span>
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">
        Sign off to commit <span className="text-violet-700">{SESSION.offboarder}</span>'s bundle to the Knowledge Graph
      </h1>
      <p className="text-[12px] text-gray-600 leading-relaxed mt-2 max-w-2xl mx-auto">
        Your signature is cryptographically anchored to the 12 items below. {SESSION.successorShort} can start reading the moment this completes. {SESSION.offboarderShort} sees the propagated chain in his post-handover review window.
      </p>
    </div>
  );
}

function ReviewSummaryStrip() {
  return (
    <div className="rounded-xl bg-white border border-gray-200 px-4 py-3 mb-4 flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-1.5 text-[11px]">
        <Award className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2} />
        <span className="font-semibold text-emerald-700" style={{ fontFamily: MONO_STACK }}>{BUNDLE_TOTALS.canonical}</span>
        <span className="text-gray-600">Canonical</span>
      </div>
      <span className="w-px h-4 bg-gray-200" />
      <div className="flex items-center gap-1.5 text-[11px]">
        <ShieldCheck className="w-3.5 h-3.5 text-violet-600" strokeWidth={2} />
        <span className="font-semibold text-violet-700" style={{ fontFamily: MONO_STACK }}>{BUNDLE_TOTALS.verified}</span>
        <span className="text-gray-600">Verified</span>
      </div>
      <span className="w-px h-4 bg-gray-200" />
      <div className="flex items-center gap-1.5 text-[11px]">
        <RotateCcw className="w-3.5 h-3.5 text-yellow-600" strokeWidth={2} />
        <span className="font-semibold text-yellow-700" style={{ fontFamily: MONO_STACK }}>{BUNDLE_TOTALS.sentBack}</span>
        <span className="text-gray-600">sent back (deferred)</span>
      </div>
      <span className="ml-auto text-[10px] text-gray-500 inline-flex items-center gap-1">
        <Activity className="w-2.5 h-2.5" strokeWidth={2} />
        <span>about to commit</span>
      </span>
    </div>
  );
}

function CryptographicAnchorCard() {
  return (
    <div className="rounded-xl bg-gray-900 text-gray-100 border border-gray-800 p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Hash className="w-3.5 h-3.5 text-violet-400" strokeWidth={2} />
        <h3 className="text-[12px] font-semibold text-gray-100">Cryptographic anchor · SHA-256 preview</h3>
        <span className="ml-auto text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/40 text-violet-300">QA-INT-01 §2.3</span>
      </div>

      <div className="rounded-lg bg-black/40 border border-gray-700 px-3 py-3 mb-3">
        <div className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold mb-1.5">Bundle hash · computed live</div>
        <div className="text-[12px] text-emerald-400 break-all leading-relaxed" style={{ fontFamily: MONO_STACK }}>
          {BUNDLE_ANCHOR_SHA}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-[10px]">
        <AnchorMetaCell label="Bundle items" value="12 committed" />
        <AnchorMetaCell label="Algorithm" value="SHA-256" mono />
        <AnchorMetaCell label="Commit window" value="15 min undo" />
      </div>

      <p className="mt-3 text-[10px] text-gray-400 leading-relaxed inline-flex items-start gap-1.5">
        <Info className="w-3 h-3 text-gray-500 shrink-0 mt-0.5" strokeWidth={2} />
        <span>This hash is recomputed if you change any decision before signing. Once you sign, it's locked into the immutable audit trail · any future reader can verify the bundle hasn't been tampered with.</span>
      </p>
    </div>
  );
}

function AnchorMetaCell({ label, value, mono }) {
  return (
    <div className="rounded-md bg-black/30 border border-gray-700 px-2 py-1.5">
      <div className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold">{label}</div>
      <div className={`text-[11px] text-gray-200 font-semibold mt-0.5 ${mono ? "" : ""}`} style={mono ? { fontFamily: MONO_STACK } : {}}>{value}</div>
    </div>
  );
}

function SignatureCard() {
  return (
    <div className="rounded-2xl border-2 border-violet-300 bg-white p-5 mb-4">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-14 h-14 rounded-full bg-violet-50 border-2 border-violet-200 flex items-center justify-center shrink-0">
          <span className="text-[16px] font-bold text-violet-700">{SESSION.reviewerInitials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="text-[14px] font-bold text-gray-900">{SESSION.reviewer}</span>
            <span className="text-[10px] text-gray-500" style={{ fontFamily: MONO_STACK }}>{SESSION.reviewerHandle}</span>
          </div>
          <div className="text-[11px] text-gray-600">{SESSION.reviewerRole}</div>
          <div className="text-[10px] text-gray-500 mt-1.5 inline-flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" strokeWidth={2} />
              <span style={{ fontFamily: MONO_STACK }}>2026-06-03 · 19:51 ICT</span>
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" strokeWidth={2} />
              Entra ID verified
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-violet-50/40 border border-violet-200 px-3 py-2.5 mb-4">
        <div className="text-[10px] uppercase tracking-[0.18em] font-semibold text-violet-700 mb-1.5">By signing</div>
        <p className="text-[11px] text-gray-700 leading-relaxed">
          I authorize commit of <strong>12 items</strong> ({BUNDLE_TOTALS.canonical} Canonical · {BUNDLE_TOTALS.verified} Verified) to the Knowledge Graph. I confirm I have reviewed each item against {SESSION.offboarderShort}'s raw input and the AI-structured output. Items sent back to {SESSION.offboarderShort} are deferred · my signature does not cover them.
        </p>
      </div>

      <button className="w-full h-12 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-[14px] font-bold inline-flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30">
        <Lock className="w-4 h-4" strokeWidth={2.5} />
        Sign and commit to Knowledge Graph
        <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
      </button>

      <div className="mt-3 flex items-center justify-between gap-3">
        <button className="text-[11px] text-gray-500 hover:text-gray-900 inline-flex items-center gap-1">
          <ArrowRight className="w-3 h-3 rotate-180" strokeWidth={2} />
          Back to summary
        </button>
        <button className="text-[11px] text-gray-500 hover:text-gray-900 inline-flex items-center gap-1">
          <Hourglass className="w-3 h-3" strokeWidth={2} />
          Sign later · save draft
        </button>
      </div>
    </div>
  );
}

function CommitProgressLog() {
  const steps = [
    { label: "Validating bundle hash",                 actor: "ART-EEP",        done: true,  ts: "0.2s" },
    { label: "Pre-retrieval ACL trim · per item",      actor: "Azure AI Search", done: true, ts: "0.4s" },
    { label: "Microsoft Purview · final PII gate",     actor: "Purview",        done: true,  ts: "0.6s" },
    { label: "Writing Canonical nodes to Cosmos",      actor: "Cosmos Gremlin", done: true,  ts: "1.1s" },
    { label: "Promoting Verified edges · scoped",      actor: "Cosmos Gremlin", done: false, active: true, ts: "live" },
    { label: `Propagating to ${SESSION.successorShort}'s playbook §3/§5/§7`, actor: "Playbook svc", done: false, ts: "pending" },
    { label: "Notifying #sales-handover · #data-platform", actor: "Slack",      done: false, ts: "pending" },
    { label: "Writing audit log entry · QA-INT-01 §2.3", actor: "Audit",        done: false, ts: "pending" },
  ];
  return (
    <div className="rounded-xl bg-white border border-gray-200 overflow-hidden mb-4">
      <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
        <Activity className="w-3.5 h-3.5 text-violet-700 animate-pulse" strokeWidth={2} />
        <h3 className="text-[12px] font-semibold text-gray-900">Commit progress · live</h3>
        <span className="ml-auto text-[10px] text-gray-500 inline-flex items-center gap-1">
          <Loader2 className="w-2.5 h-2.5 animate-spin" strokeWidth={2.5} />
          <span style={{ fontFamily: MONO_STACK }}>4 of 8 complete · ~3s remaining</span>
        </span>
      </div>
      <ol className="divide-y divide-gray-100">
        {steps.map((s, i) => <CommitProgressRow key={i} idx={i + 1} {...s} />)}
      </ol>
    </div>
  );
}

function CommitProgressRow({ idx, label, actor, done, active, ts }) {
  return (
    <li className={`flex items-center gap-3 px-4 py-2 ${active ? "bg-violet-50/40" : ""}`}>
      <span className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
        done ? "bg-emerald-100 border border-emerald-300" :
        active ? "bg-violet-100 border border-violet-300" :
        "bg-gray-50 border border-gray-200"
      }`}>
        {done ? <Check className="w-3 h-3 text-emerald-700" strokeWidth={2.5} /> :
         active ? <Loader2 className="w-3 h-3 text-violet-700 animate-spin" strokeWidth={2.5} /> :
         <span className="text-[9px] font-semibold text-gray-400" style={{ fontFamily: MONO_STACK }}>{idx}</span>}
      </span>
      <div className="flex-1 min-w-0">
        <div className={`text-[11px] truncate ${active ? "font-semibold text-violet-900" : done ? "text-gray-700" : "text-gray-500"}`}>{label}</div>
        <div className="text-[9px] text-gray-500" style={{ fontFamily: MONO_STACK }}>{actor}</div>
      </div>
      <span className={`text-[10px] shrink-0 ${active ? "text-violet-700 font-semibold" : "text-gray-400"}`} style={{ fontFamily: MONO_STACK }}>{ts}</span>
    </li>
  );
}

function DoneCard() {
  return (
    <div className="rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50/40 to-violet-50/20 p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-white border-2 border-emerald-300 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-6 h-6 text-emerald-700" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Commit successful · Deliver phase open</h2>
          <p className="text-[12px] text-gray-700 leading-relaxed mt-1">
            12 items are now in the Knowledge Graph · {SESSION.successorShort}'s playbook has the new §3/§5/§7 entries with Canonical badges. {SESSION.offboarderShort} can see the propagation chain · including the item-6 flag chain you approved.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
        <DoneLinkCard
          icon={BookOpen}
          title={`Open ${SESSION.successorShort}'s playbook`}
          detail="See where the items landed in his Day 1 view"
          tone="emerald"
        />
        <DoneLinkCard
          icon={Network}
          title="Open the Knowledge Graph"
          detail="9 new Canonical nodes · 3 Verified · 7 edges"
          tone="violet"
        />
      </div>

      <div className="rounded-lg bg-yellow-50/40 border border-yellow-200 px-3 py-2 text-[10px] text-yellow-900/90 leading-relaxed inline-flex items-start gap-1.5">
        <AlertTriangle className="w-3 h-3 text-yellow-700 shrink-0 mt-0.5" strokeWidth={2} />
        <span>
          <strong>2 items sent back</strong> are still open · they'll appear in your dashboard once {SESSION.offboarderShort} answers (he has 4 days left). You'll do a smaller second sign-off then.
        </span>
      </div>
    </div>
  );
}

function DoneLinkCard({ icon: Icon, title, detail, tone }) {
  const cfg = {
    emerald: { border: "border-emerald-200 hover:border-emerald-400", bg: "bg-white hover:bg-emerald-50/40", iconBg: "bg-emerald-100 border-emerald-200 text-emerald-700", arrowCls: "text-emerald-700" },
    violet:  { border: "border-violet-200 hover:border-violet-400",  bg: "bg-white hover:bg-violet-50/40",  iconBg: "bg-violet-100 border-violet-200 text-violet-700",    arrowCls: "text-violet-700" },
  }[tone];
  return (
    <button className={`rounded-lg ${cfg.bg} border ${cfg.border} p-3 flex items-center gap-3 transition-colors text-left cursor-pointer w-full`}>
      <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${cfg.iconBg}`}>
        <Icon className="w-4 h-4" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-semibold text-gray-900 truncate">{title}</div>
        <div className="text-[10px] text-gray-500 leading-snug">{detail}</div>
      </div>
      <ArrowUpRight className={`w-3.5 h-3.5 shrink-0 ${cfg.arrowCls}`} strokeWidth={2} />
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S8 right rail · DecisionPanelSignOff
   ═══════════════════════════════════════════════════════════════════ */

export function DecisionPanelSignOff() {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border-2 border-violet-300 bg-violet-50/50 p-3 text-center">
        <div className="w-10 h-10 rounded-full bg-white border-2 border-violet-300 flex items-center justify-center mx-auto mb-2">
          <Lock className="w-5 h-5 text-violet-700" strokeWidth={2.5} />
        </div>
        <div className="text-[12px] font-semibold text-violet-900">QA-INT-01 §1.4 commit gate</div>
        <div className="text-[10px] text-violet-800/80 mt-1 leading-snug">
          Your signature anchors all commits to the immutable audit trail
        </div>
      </div>

      <div className="rounded-lg bg-white border border-gray-200 p-3">
        <div className="text-[9px] uppercase tracking-[0.18em] font-semibold text-gray-500 mb-1.5">Bundle anchor</div>
        <div className="text-[10px] text-emerald-700 break-all leading-relaxed" style={{ fontFamily: MONO_STACK }}>
          {BUNDLE_ANCHOR_SHA.slice(0, 32)}…
        </div>
        <div className="text-[9px] text-gray-500 mt-1.5 inline-flex items-center gap-1">
          <Cpu className="w-2.5 h-2.5" strokeWidth={2} />
          <span style={{ fontFamily: MONO_STACK }}>SHA-256 · computed live</span>
        </div>
      </div>

      <SignOffContextStrip />

      <div className="rounded-lg bg-yellow-50/40 border border-yellow-200 px-3 py-2.5">
        <div className="text-[10px] uppercase tracking-wider text-yellow-700 font-semibold mb-1.5 inline-flex items-center gap-1.5">
          <ShieldAlert className="w-3 h-3" strokeWidth={2} />
          15-minute grace
        </div>
        <p className="text-[10px] text-yellow-900/90 leading-relaxed">
          If you signed by accident, you have 15 minutes to undo. After that, the audit trail is immutable · changes require UC-HO-07 correction review.
        </p>
      </div>

      <div className="pt-3 border-t border-gray-100">
        <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2">After commit</div>
        <ol className="space-y-1.5 text-[10px] text-gray-600 leading-snug">
          <SignOffStepRow n={1} label={`${SESSION.successorShort}'s playbook updates within 30s`} />
          <SignOffStepRow n={2} label="Cross-team Slack notifications fire" />
          <SignOffStepRow n={3} label={`${SESSION.offboarderShort} sees the propagation in his post-handover view`} />
          <SignOffStepRow n={4} label="2 sent-back items stay open · second sign-off later" last />
        </ol>
      </div>
    </div>
  );
}

function SignOffContextStrip() {
  const items = [
    { label: "Items to commit", value: "12", positive: true },
    { label: "Identity verified", value: "Entra ID", positive: true },
    { label: "Sanitization", value: "all clear", positive: true },
    { label: "Anchor algorithm", value: "SHA-256", positive: true },
  ];
  return (
    <div className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2.5">
      <div className="text-[9px] uppercase tracking-[0.18em] font-semibold text-gray-500 mb-2">Commit conditions</div>
      <div className="space-y-1.5">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-2 text-[10px]">
            {it.positive ? <Check className="w-2.5 h-2.5 text-emerald-600 shrink-0" strokeWidth={2.5} /> : <X className="w-2.5 h-2.5 text-rose-600 shrink-0" strokeWidth={2.5} />}
            <span className="text-gray-700 flex-1">{it.label}</span>
            <span className={`font-medium ${it.positive ? "text-emerald-700" : "text-rose-700"}`} style={{ fontFamily: MONO_STACK }}>{it.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SignOffStepRow({ n, label, last }) {
  return (
    <li className="flex items-start gap-2">
      <span className="w-4 h-4 rounded bg-violet-100 border border-violet-200 flex items-center justify-center shrink-0 text-[8px] font-bold text-violet-700" style={{ fontFamily: MONO_STACK }}>{n}</span>
      <span className="text-gray-700 leading-snug">{label}</span>
    </li>
  );
}
