"use client";

import React, { useState } from "react";
import {
  ChevronLeft, ChevronRight, Sparkles, Check, X, AlertTriangle,
  AlertOctagon, Info, MessageSquare, Edit3, Send, ShieldCheck,
  GitBranch, FileText, Folder, Calendar, Users, Briefcase,
  Clock, ArrowRight, ArrowUpRight, ThumbsUp, ThumbsDown, MoreHorizontal,
  Save, History, Award, Bookmark, Tag, Hash, Bell, HelpCircle,
  Filter, Search, Plus, Minus, Eye, Lock, Upload,
  CheckCircle2, Circle as CircleIcon, CircleDot, Loader2,
  ChevronDown, ChevronUp, ShieldAlert, Star, Activity,
  GitMerge, FileCheck, Crosshair, Hourglass, Settings,
  Inbox, Network, Cpu, FileQuestion, BookOpen, Hammer,
  PenTool, RotateCcw, Flag, ListChecks, Volume2, Quote
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   UC-HO-04 · Manager Review + Sign-off · Sprint 3 · Management plane

   Hà Vy's workspace for reviewing Minh Lê's captured bundle before
   it commits to the Knowledge Graph. The QA-INT-01 §1.4 commit gate
   in action · nothing reaches the KG without her sign-off.

   BUILD STATUS · Steps A + B landed.
     · Step A · architecture + S1 Arrival full
     · Step B · S2 Reviewing + S3 Accept (side-by-side diff core)
     · Step C (pending) · S4 Edit inline + S5 Send back
     · Step D (pending) · S6 Pre-commit flag fix (3-way diff)
     · Step E (pending) · S7 Bundle summary + S8 Sign-off
     · Step F (DONE early) · registered in mockups-registry

   Honors:
     · QA-INT-01 §1.4 · explicit Manager sign-off required for KG commit
     · QA-INT-01 §1.3 · side-by-side diff (Minh's raw vs AI-structured)
     · QA-INT-01 §2.2 · Canonical vs Verified status visibly distinct
     · QA-INT-01 §2.3 · immutable audit trail · cryptographic anchor on sign-off
     · CL-086 · inline edit diff grammar
     · CL-092 · sanitization pipeline visible (already ran during capture)
     · CL-093 · auto-assigned Tier 1/2 visibility for each item
     · CL-099 · Manager sees text-queue contributions (not transcript)
     · CL-101 · pre-commit network flag results visible in the review
   ═══════════════════════════════════════════════════════════════════ */

const FLOW = [
  { id: "s1", uc: "Step 1", label: "Arrival · bundle overview",        trigger: "Hà Vy opens Minh's submitted bundle · 14 items + 4 files + 1 redirect · pre-commit network flag loop already cleared." },
  { id: "s2", uc: "Step 2", label: "Reviewing Manager Priority",       trigger: "First item · Vendor XYZ SLA penalty clause · side-by-side · Minh's raw text + AI-structured version." },
  { id: "s3", uc: "Step 3", label: "Quick accept · all green",         trigger: "All confidence signals positive · sources cited · one-click acceptance · auto-canonical." },
  { id: "s4", uc: "Step 4", label: "Edit inline · CL-086 grammar",     trigger: "Item needs a small correction · Hà Vy edits inline · original AI text greyed/strikethrough above." },
  { id: "s5", uc: "Step 5", label: "Send back for clarification",      trigger: "Hà Vy needs more from Minh · sends item back with a note · returns to his queue as a follow-up question." },
  { id: "s6", uc: "Step 6", label: "Pre-commit flag fix · 3-way",      trigger: "The Atlas rollback flag Trần raised · Hà Vy sees the original AI version, Trần's flag, and Minh's correction · approves the chain." },
  { id: "s7", uc: "Step 7", label: "Bundle summary · propagation",     trigger: "All 14 items reviewed · 9 accepted as Canonical, 3 Verified-only, 2 sent back · propagation preview shows downstream impact." },
  { id: "s8", uc: "Step 8", label: "Sign-off · QA-INT-01 commit gate", trigger: "Hà Vy signs off · cryptographic anchor created · KG commit begins · propagation to playbook + graph + downstream consumers." },
];

const SESSION = {
  reviewer: "Hà Vy",
  reviewerInitials: "HV",
  reviewerHandle: "@ha.vy",
  reviewerRole: "Engineering Manager",
  offboarder: "Minh Lê",
  offboarderShort: "Minh",
  offboarderInitials: "ML",
  offboarderHandle: "@minh.le",
  successor: "Trần Hữu Nam",
  successorShort: "Trần",
  successorInitials: "TN",
  flaggerNet: "Duy Nguyễn",
  flaggerNetInitials: "DN",
  corroboratorName: "Phương Anh Nguyễn",
  corroboratorInitials: "PA",
  corroboratorTeam: "Sales",
  itemsTotal: 14,
  filesTotal: 4,
  redirects: 1,
  daysUntilLastDay: 4,
};

const MONO_STACK = 'ui-monospace, "Geist Mono", "JetBrains Mono", Menlo, monospace';

export default function UCHO04ManagerReview() {
  const [stepIdx, setStepIdx] = useState(0);
  const step = FLOW[stepIdx];
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      <DevChrome step={step} stepIdx={stepIdx} onJump={setStepIdx} />
      <main className="flex-1 flex flex-col bg-white border-x border-gray-200 shadow-sm max-w-[1400px] w-full mx-auto">
        <StateRenderer id={step.id} />
      </main>
      <DevFooterNav stepIdx={stepIdx} step={step} onChange={setStepIdx} />
    </div>
  );
}

/* ─── Dev chrome ─── */

function DevChrome({ step, stepIdx, onJump }) {
  return (
    <header className="bg-gray-50 border-b border-gray-200 sticky top-0 z-30">
      <div className="px-5 py-2 flex items-center justify-between gap-4 max-w-[1400px] mx-auto w-full">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
          <span className="text-gray-900 font-semibold tracking-[0.18em] text-xs" style={{ fontFamily: MONO_STACK }}>ART-EEP</span>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-gray-500 text-xs">UC-HO-04 · Manager review · Management plane</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-gray-500 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
          <span className="uppercase tracking-wider font-semibold text-violet-700">QA-INT-01 commit gate</span>
          <span className="text-gray-300">·</span>
          <span className="text-gray-700" style={{ fontFamily: MONO_STACK }}>{step.uc}</span>
        </div>
      </div>
      <div className="px-5 pb-2 flex items-center justify-between gap-4 max-w-[1400px] mx-auto w-full">
        <div className="min-w-0 flex-1">
          <h1 className="text-sm font-semibold text-gray-900 truncate">
            {stepIdx + 1} of {FLOW.length} · {step.label}
          </h1>
          <p className="text-[11px] text-gray-500 mt-0.5 truncate">{step.trigger}</p>
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
      className={`w-7 h-7 rounded-md border text-[11px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 cursor-pointer ${
        active ? "bg-violet-600 text-white border-violet-600" : "bg-white text-violet-700 border-violet-200 hover:border-violet-400"
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
    <footer className="bg-gray-50 border-t border-gray-200 px-5 py-2 flex items-center justify-between sticky bottom-0 z-30">
      <button
        onClick={() => !atFirst && onChange(stepIdx - 1)}
        disabled={atFirst}
        className={`h-7 px-3 rounded-md text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
          atFirst ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <ChevronLeft className="w-3 h-3" />
        Previous
      </button>
      <div className="hidden sm:block text-[10px] text-gray-500 max-w-md text-center truncate px-3">
        Dev chrome · this strip is NOT part of the real review workspace.
      </div>
      <button
        onClick={() => !atLast && onChange(stepIdx + 1)}
        disabled={atLast}
        className={`h-7 px-3 rounded-md text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
          atLast ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-700 text-white"
        }`}
      >
        Next
        <ChevronRight className="w-3 h-3" />
      </button>
    </footer>
  );
}

function StateRenderer({ id }) {
  if (id === "s1") return <S1Arrival />;
  if (id === "s2") return <S2ReviewingPriority />;
  if (id === "s3") return <S3QuickAccept />;
  if (id === "s4") return <S4Placeholder />;
  if (id === "s5") return <S5Placeholder />;
  if (id === "s6") return <S6Placeholder />;
  if (id === "s7") return <S7Placeholder />;
  if (id === "s8") return <S8Placeholder />;
  return null;
}

/* ═══════════════════════════════════════════════════════════════════
   ReviewShell · Management plane chrome
   ═══════════════════════════════════════════════════════════════════ */

function ReviewShell({ children, bundleState, hideRightRail }) {
  return (
    <div className="flex flex-col flex-1 min-h-[820px]">
      <ManagementHeader />
      <ReviewSubHeader />
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[240px_1fr_300px] min-h-0">
        <ItemListRail activeState={bundleState} />
        <div className="min-w-0 bg-gray-50/30 overflow-y-auto">
          {children}
        </div>
        {!hideRightRail && <DecisionRail state={bundleState} />}
      </div>
    </div>
  );
}

function ManagementHeader() {
  return (
    <header className="px-6 h-14 flex items-center justify-between border-b border-gray-100 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 bg-violet-500 rounded-full" />
          <span className="text-gray-900 font-semibold tracking-[0.18em] text-[11px]" style={{ fontFamily: MONO_STACK }}>ART-EEP</span>
        </div>
        <span className="text-gray-300 text-xs">·</span>
        <a href="#" className="text-xs text-gray-500 hover:text-gray-900">Dashboard</a>
        <ChevronRight className="w-3 h-3 text-gray-300" />
        <a href="#" className="text-xs text-gray-500 hover:text-gray-900 truncate">{SESSION.offboarder}'s session</a>
        <ChevronRight className="w-3 h-3 text-gray-300" />
        <span className="text-xs text-gray-900 font-medium">Review bundle</span>
      </div>
      <div className="flex items-center gap-1.5">
        <button className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
          <Bell className="w-3.5 h-3.5" strokeWidth={1.75} />
        </button>
        <button className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
          <HelpCircle className="w-3.5 h-3.5" strokeWidth={1.75} />
        </button>
        <span className="w-px h-5 bg-gray-200 mx-1" />
        <div className="w-8 h-8 rounded-full bg-violet-50 border border-violet-200 flex items-center justify-center shrink-0" title={SESSION.reviewer}>
          <span className="text-[10px] font-semibold text-violet-700">{SESSION.reviewerInitials}</span>
        </div>
      </div>
    </header>
  );
}

function ReviewSubHeader() {
  return (
    <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap bg-violet-50/20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-violet-50 border border-violet-200 flex items-center justify-center">
          <FileCheck className="w-5 h-5 text-violet-700" strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="text-base font-semibold text-gray-900 tracking-tight">
            Reviewing <span className="text-violet-700">{SESSION.offboarder}</span>'s capture bundle
          </h1>
          <p className="text-[11px] text-gray-600 mt-0.5 inline-flex items-center gap-2 flex-wrap">
            <span>Submitted 2 hours ago</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-600" strokeWidth={2} /> CL-092 sanitization · cleared</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1"><ListChecks className="w-3 h-3 text-emerald-600" strokeWidth={2} /> CL-101 network flag loop · 24h window closed</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <BundleProgress />
        <button className="h-8 px-3 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-[12px] font-medium inline-flex items-center gap-1.5 transition-colors">
          <MessageSquare className="w-3 h-3" strokeWidth={2} />
          Message {SESSION.offboarderShort}
        </button>
      </div>
    </div>
  );
}

function BundleProgress() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 flex items-center gap-2">
      <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Reviewed</div>
      <div className="text-[13px] font-bold text-violet-700" style={{ fontFamily: MONO_STACK }}>2 / 14</div>
      <div className="w-20 h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-violet-500 to-violet-600 rounded-full" style={{ width: "14%" }} />
      </div>
    </div>
  );
}

/* ─── Item List Rail · left sidebar ─── */

function ItemListRail({ activeState }) {
  return (
    <aside className="border-r border-gray-200 bg-white flex flex-col">
      <div className="px-4 h-12 border-b border-gray-100 flex items-center gap-2">
        <Inbox className="w-3.5 h-3.5 text-violet-700" strokeWidth={2} />
        <h3 className="text-xs font-semibold text-gray-900">Items in bundle</h3>
        <span className="ml-auto text-[10px] text-gray-500" style={{ fontFamily: MONO_STACK }}>14</span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        <ItemListGroup label="Manager priorities" count={2} items={[
          { id: "mp1", n: 1, title: "Vendor XYZ SLA penalty", source: "manager", status: activeState === "reviewing-mp" ? "active" : activeState === "accepting" ? "just-accepted" : "pending" },
          { id: "mp2", n: 2, title: "Payment Gateway fix", source: "manager", status: "pending" },
        ]} />

        <ItemListGroup label="Network questions" count={3} items={[
          { id: "nq1", n: 3, title: "Cosmos rollback heuristic", source: "network", status: "accepted" },
          { id: "nq2", n: 4, title: "Vendor XYZ grace period", source: "network", status: "edit-pending", active: activeState === "editing" },
          { id: "nq3", n: 5, title: "2am Saturday coverage", source: "network", status: "send-back-pending", active: activeState === "send-back" },
        ]} />

        <ItemListGroup label="Pre-commit flag fixes" count={1} items={[
          { id: "fl1", n: 6, title: "Atlas rollback correction", source: "flag", status: "flag-review", active: activeState === "flag-fix" },
        ]} />

        <ItemListGroup label="Own contributions" count={5} items={[
          { id: "ow1", n: 7, title: "Friday-deploy rule", source: "own", status: "accepted" },
          { id: "ow2", n: 8, title: "Khanh Linh escalation", source: "own", status: "accepted" },
          { id: "ow3", n: 9, title: "Vendor verbal commitments", source: "own", status: "pending" },
          { id: "ow4", n: 10, title: "Atlas wiki gaps", source: "own", status: "pending" },
          { id: "ow5", n: 11, title: "On-call quirks", source: "own", status: "pending" },
        ]} />

        <ItemListGroup label="Uploaded files" count={3} items={[
          { id: "f1", n: 12, title: "Architecture-2024Q3.md", source: "file", status: "pending" },
          { id: "f2", n: 13, title: "Payment-flow.png", source: "file", status: "pending" },
          { id: "f3", n: 14, title: "Vendor-call-notes.txt", source: "file", status: "pending" },
        ]} />

        <ItemListGroup label="Redirected" count={1} items={[
          { id: "rd1", n: 0, title: "Comp policy → Khánh Linh", source: "manager", status: "redirected" },
        ]} dimmed />
      </div>
    </aside>
  );
}

function ItemListGroup({ label, count, items, dimmed }) {
  return (
    <div className={dimmed ? "opacity-60" : ""}>
      <div className="flex items-baseline justify-between mb-1.5 px-1">
        <h4 className="text-[9px] uppercase tracking-[0.18em] font-semibold text-gray-500">{label}</h4>
        <span className="text-[10px] text-gray-400" style={{ fontFamily: MONO_STACK }}>{count}</span>
      </div>
      <div className="space-y-0.5">
        {items.map(it => <ItemListRow key={it.id} {...it} />)}
      </div>
    </div>
  );
}

function ItemListRow({ n, title, source, status, active }) {
  const SourceIcon = { manager: Sparkles, network: Users, flag: AlertTriangle, own: Plus, file: FileText }[source];
  const sourceColor = { manager: "text-violet-600", network: "text-indigo-600", flag: "text-yellow-700", own: "text-gray-600", file: "text-emerald-600" }[source];
  const statusCfg = {
    pending: { icon: CircleIcon, iconCls: "text-gray-300" },
    active: { icon: CircleDot, iconCls: "text-violet-600" },
    "just-accepted": { icon: CheckCircle2, iconCls: "text-emerald-600" },
    accepted: { icon: CheckCircle2, iconCls: "text-emerald-600" },
    "edit-pending": { icon: Edit3, iconCls: "text-violet-700" },
    "send-back-pending": { icon: RotateCcw, iconCls: "text-yellow-700" },
    "flag-review": { icon: AlertTriangle, iconCls: "text-yellow-700" },
    redirected: { icon: ArrowUpRight, iconCls: "text-gray-400" },
  }[status];
  const StatusIcon = statusCfg.icon;
  const isActive = status === "active" || active || status === "just-accepted";
  return (
    <button className={`w-full text-left rounded-md px-2 py-1.5 flex items-center gap-2 transition-colors cursor-pointer ${
      status === "just-accepted" ? "bg-emerald-50/40 border border-emerald-200" :
      isActive ? "bg-violet-50 border border-violet-200" : "hover:bg-gray-50 border border-transparent"
    }`}>
      <StatusIcon className={`w-3.5 h-3.5 shrink-0 ${statusCfg.iconCls}`} strokeWidth={2} />
      <SourceIcon className={`w-3 h-3 shrink-0 ${sourceColor}`} strokeWidth={2} />
      <span className={`text-[11px] flex-1 min-w-0 truncate ${
        status === "just-accepted" ? "font-semibold text-emerald-900" :
        isActive ? "font-semibold text-gray-900" :
        status === "accepted" ? "text-gray-700" :
        status === "redirected" ? "text-gray-400 italic" :
        "text-gray-700"
      }`}>
        {n > 0 && <span className="text-gray-400" style={{ fontFamily: MONO_STACK }}>{n}.</span>} {title}
      </span>
    </button>
  );
}

/* ─── Decision Rail · right sidebar · dispatches on state ─── */

function DecisionRail({ state }) {
  return (
    <aside className="border-l border-gray-200 bg-white flex flex-col">
      <div className="px-4 h-12 border-b border-gray-100 flex items-center gap-2">
        <Crosshair className="w-3.5 h-3.5 text-violet-700" strokeWidth={2} />
        <h3 className="text-xs font-semibold text-gray-900">Your decision</h3>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {state === "reviewing-mp" && <DecisionPanelReviewing />}
        {state === "accepting" && <DecisionPanelAccepted />}
        {!state && <DecisionPanelDefault />}
      </div>
    </aside>
  );
}

function DecisionPanelDefault() {
  return (
    <div className="space-y-4">
      <div className="text-[11px] text-gray-600 leading-relaxed">
        Pick an item from the bundle on the left, or work top-to-bottom. Manager priorities come first by default.
      </div>
      <div className="rounded-lg bg-violet-50/40 border border-violet-100 px-3 py-2.5">
        <div className="text-[10px] uppercase tracking-wider text-violet-700 font-semibold mb-1.5">QA-INT-01 reminder</div>
        <p className="text-[10px] text-gray-700 leading-relaxed">
          You're the commit gate · nothing reaches the Knowledge Graph until you sign off. Items can be accepted as-is, edited, or sent back to {SESSION.offboarderShort} for clarification.
        </p>
      </div>
      <div className="rounded-lg bg-emerald-50/40 border border-emerald-100 px-3 py-2.5">
        <div className="text-[10px] uppercase tracking-wider text-emerald-700 font-semibold mb-1.5">SLA</div>
        <p className="text-[10px] text-gray-700 leading-relaxed">
          Target · within 2 business days. {SESSION.offboarderShort} has {SESSION.daysUntilLastDay} days until his last day.
        </p>
      </div>
    </div>
  );
}

function DecisionPanelReviewing() {
  return (
    <div className="space-y-3">
      <ContextStrip
        label="Confidence signals"
        items={[
          { label: "Sources cited", value: "3", positive: true },
          { label: "Verbatim quotes", value: "2", positive: true },
          { label: "Network corroboration", value: "yes · Phương Anh", positive: true },
          { label: "Worker SLM confidence", value: "92%", positive: true },
        ]}
      />

      <div className="space-y-1.5">
        <PrimaryDecisionButton icon={Check} label="Accept · promote to Canonical" tone="emerald" />
        <PrimaryDecisionButton icon={Award} label="Accept · keep as Verified only" tone="violet" />
        <PrimaryDecisionButton icon={Edit3} label="Edit inline before accepting" tone="violet" subtle />
        <PrimaryDecisionButton icon={RotateCcw} label="Send back for clarification" tone="yellow" subtle />
        <PrimaryDecisionButton icon={X} label="Reject · don't commit this" tone="rose" subtle />
      </div>

      <div className="pt-3 border-t border-gray-100">
        <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2">Quick reference</div>
        <ul className="space-y-1.5 text-[10px] text-gray-600 leading-snug">
          <li className="flex items-start gap-1.5">
            <Award className="w-2.5 h-2.5 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2} />
            <span><strong>Canonical</strong> · authoritative · propagates everywhere · emerald badge</span>
          </li>
          <li className="flex items-start gap-1.5">
            <ShieldCheck className="w-2.5 h-2.5 text-violet-600 shrink-0 mt-0.5" strokeWidth={2} />
            <span><strong>Verified</strong> · accurate but not canonical · scoped to this session</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function DecisionPanelAccepted() {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border-2 border-emerald-300 bg-emerald-50/50 p-3 text-center">
        <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto mb-2">
          <Check className="w-5 h-5 text-emerald-700" strokeWidth={2.5} />
        </div>
        <div className="text-[12px] font-semibold text-emerald-900">Accepted as Canonical</div>
        <div className="text-[10px] text-emerald-800/80 mt-1 leading-snug">
          Will commit to KG when you sign off the whole bundle · propagates to {SESSION.successorShort}'s playbook automatically.
        </div>
      </div>

      <div className="space-y-1.5">
        <SecondaryDecisionButton icon={Edit3} label="Actually, let me edit it" />
        <SecondaryDecisionButton icon={RotateCcw} label="Change my mind · send back" />
      </div>

      <div className="pt-3 border-t border-gray-100">
        <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2">Propagation preview</div>
        <ul className="space-y-1.5 text-[10px] text-gray-600 leading-snug">
          <PropagateRowSm label="Vendor XYZ wiki" detail="Replaces v2.1 entry" />
          <PropagateRowSm label="Knowledge Graph" detail="Canonical badge applied" />
          <PropagateRowSm label={`${SESSION.successorShort}'s playbook §3`} detail="Auto-update on commit" />
          <PropagateRowSm label="Sales team Slack" detail="Notified · @phuong-anh" />
        </ul>
      </div>

      <button className="w-full h-9 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-[12px] font-semibold inline-flex items-center justify-center gap-1.5 transition-colors">
        Continue to item 2
        <ChevronRight className="w-3 h-3" strokeWidth={2.5} />
      </button>
    </div>
  );
}

function PrimaryDecisionButton({ icon: Icon, label, tone, subtle }) {
  const cfg = {
    emerald: subtle ? "border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50" : "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600",
    violet: subtle ? "border-violet-200 bg-white text-violet-700 hover:bg-violet-50" : "bg-violet-600 hover:bg-violet-700 text-white border-violet-600",
    yellow: subtle ? "border-yellow-200 bg-white text-yellow-800 hover:bg-yellow-50" : "bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-600",
    rose: subtle ? "border-rose-200 bg-white text-rose-700 hover:bg-rose-50" : "bg-rose-600 hover:bg-rose-700 text-white border-rose-600",
  }[tone];
  return (
    <button className={`w-full h-9 px-3 rounded-md border text-[12px] font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer focus:outline-none focus:ring-2 ${cfg}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
      <span className="flex-1 text-left">{label}</span>
    </button>
  );
}

function SecondaryDecisionButton({ icon: Icon, label }) {
  return (
    <button className="w-full h-8 px-3 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 text-[11px] font-medium inline-flex items-center gap-2 transition-colors">
      <Icon className="w-3 h-3 shrink-0" strokeWidth={2} />
      <span className="flex-1 text-left">{label}</span>
    </button>
  );
}

function ContextStrip({ label, items }) {
  return (
    <div className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2.5">
      <div className="text-[9px] uppercase tracking-[0.18em] font-semibold text-gray-500 mb-2">{label}</div>
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

function PropagateRowSm({ label, detail }) {
  return (
    <li className="flex items-start gap-1.5">
      <GitMerge className="w-2.5 h-2.5 text-violet-600 shrink-0 mt-0.5" strokeWidth={2} />
      <span><strong className="text-gray-700">{label}</strong> · {detail}</span>
    </li>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S1 · Arrival · bundle overview
   ═══════════════════════════════════════════════════════════════════ */

function S1Arrival() {
  return (
    <ReviewShell bundleState={null}>
      <div className="px-8 py-8 max-w-[820px] mx-auto">
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] font-semibold text-violet-700 mb-3">
            <Sparkles className="w-3 h-3" strokeWidth={2.5} />
            Ready for your review
          </span>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight leading-tight mb-2">
            {SESSION.offboarderShort} captured <span className="text-violet-700">14 things</span> · let's get them into the graph.
          </h1>
          <p className="text-[14px] text-gray-600 leading-relaxed max-w-2xl">
            His bundle has been sanitized (regex + few-shot + Purview, all clear) and the pre-commit network flag window has closed. {SESSION.daysUntilLastDay} days until his last day · {SESSION.successorShort} can start reading the moment you sign off.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <BundleStatTile icon={Sparkles} label="Manager priorities" count={2} sublabel="High-confidence" tone="violet" />
          <BundleStatTile icon={Users} label="Network questions" count={3} sublabel="From Duy + Phương Anh" tone="indigo" />
          <BundleStatTile icon={AlertTriangle} label="Flag fixes" count={1} sublabel={`${SESSION.successorShort} raised, ${SESSION.offboarderShort} corrected`} tone="yellow" />
          <BundleStatTile icon={Plus} label="Own contributions" count={5} sublabel="3 unwritten rules + 2 other" tone="emerald" />
        </div>

        <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50/40 to-yellow-50/20 p-5 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white border border-violet-200 flex items-center justify-center shrink-0">
              <Crosshair className="w-5 h-5 text-violet-700" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-gray-900 mb-1">Recommended review order</h2>
              <p className="text-[11px] text-gray-600 leading-relaxed mb-3">
                Top to bottom · the items you flagged as critical come first. The AI grouped similar topics together so context carries between items.
              </p>
              <ol className="space-y-1.5">
                <ReviewOrderItem n={1} kind="Most critical" detail={`Vendor XYZ SLA · ${SESSION.successorShort}'s renewal call in 9 days`} />
                <ReviewOrderItem n={2} kind="High confidence" detail="3 items where AI structuring + Minh's raw text agree" />
                <ReviewOrderItem n={3} kind="Network agreement" detail="Items where colleagues already corroborated" />
                <ReviewOrderItem n={4} kind="Flag fixes" detail={`The Atlas rollback correction from ${SESSION.successorShort}`} />
                <ReviewOrderItem n={5} kind="Files" detail="Architecture doc + diagram + meeting notes" />
              </ol>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 mb-6">
          <h3 className="text-[11px] font-semibold text-gray-900 uppercase tracking-wider mb-2 inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-emerald-600" strokeWidth={2} />
            Pre-review checks · all cleared
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <PreCheckItem label="CL-092 Regex sanitization" detail="2 emails redacted" done />
            <PreCheckItem label="CL-092 Few-shot neutralization" detail="0 toxic phrases found" done />
            <PreCheckItem label="Microsoft Purview PII gate" detail="3 sensitive items auto-tagged Tier 1" done />
            <PreCheckItem label="CL-101 network flag window" detail="24h closed · 1 flag raised (resolved)" done />
            <PreCheckItem label="CL-093 Tier auto-assignment" detail="2 Tier 1 stubs · 0 Tier 2 ghosts" done />
            <PreCheckItem label="Source provenance check" detail="All items have ≥1 cited source" done />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="text-[11px] text-gray-500 inline-flex items-center gap-1.5">
            <Hourglass className="w-3 h-3" strokeWidth={2} />
            Estimated review time · ~25 minutes total · save anytime
          </div>
          <button className="h-10 px-5 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-[14px] font-semibold inline-flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30">
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
            Start with item 1
          </button>
        </div>
      </div>
    </ReviewShell>
  );
}

function BundleStatTile({ icon: Icon, label, count, sublabel, tone }) {
  const cfg = {
    violet: { ring: "border-violet-200", bg: "bg-violet-50/30", iconBg: "bg-violet-50 border-violet-200 text-violet-700", valueCls: "text-violet-700" },
    indigo: { ring: "border-indigo-200", bg: "bg-indigo-50/30", iconBg: "bg-indigo-50 border-indigo-200 text-indigo-700", valueCls: "text-indigo-700" },
    yellow: { ring: "border-yellow-200", bg: "bg-yellow-50/30", iconBg: "bg-yellow-50 border-yellow-200 text-yellow-700", valueCls: "text-yellow-700" },
    emerald: { ring: "border-emerald-200", bg: "bg-emerald-50/30", iconBg: "bg-emerald-50 border-emerald-200 text-emerald-700", valueCls: "text-emerald-700" },
  }[tone];
  return (
    <div className={`rounded-xl border ${cfg.ring} ${cfg.bg} p-3`}>
      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center mb-2 ${cfg.iconBg}`}>
        <Icon className="w-3.5 h-3.5" strokeWidth={2} />
      </div>
      <div className={`text-2xl font-bold ${cfg.valueCls} tracking-tight leading-none`} style={{ fontFamily: MONO_STACK }}>{count}</div>
      <div className="text-[11px] font-semibold text-gray-900 mt-1.5">{label}</div>
      <div className="text-[10px] text-gray-500 mt-0.5 leading-snug">{sublabel}</div>
    </div>
  );
}

function ReviewOrderItem({ n, kind, detail }) {
  return (
    <li className="flex items-start gap-2 text-[11px]">
      <span className="w-5 h-5 rounded-md bg-white border border-violet-200 flex items-center justify-center shrink-0 text-[10px] font-bold text-violet-700" style={{ fontFamily: MONO_STACK }}>{n}</span>
      <div>
        <span className="font-semibold text-gray-900">{kind}</span>
        <span className="text-gray-600"> · {detail}</span>
      </div>
    </li>
  );
}

function PreCheckItem({ label, detail, done }) {
  return (
    <div className="flex items-start gap-2 text-[11px]">
      <Check className={`w-3 h-3 ${done ? "text-emerald-600" : "text-gray-300"} shrink-0 mt-0.5`} strokeWidth={2.5} />
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-medium text-gray-900">{label}</div>
        <div className="text-[10px] text-gray-500 leading-snug">{detail}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S2 · Reviewing a Manager Priority answer · side-by-side
   ═══════════════════════════════════════════════════════════════════ */

function S2ReviewingPriority() {
  return (
    <ReviewShell bundleState="reviewing-mp">
      <div className="px-6 py-6 max-w-[900px]">
        <ItemHeader
          n={1}
          source="manager-priority"
          title="Vendor XYZ · the SLA penalty clause"
          subtitle="Manager priority · from you to Minh · #1 of 2"
          tagBadge="Vendor XYZ"
          tagBadgeKind="topic"
          itemId="ITEM-2026-06-03-007"
        />

        <OriginalQuestionCard />

        <DiffPanes
          rawTitle={`${SESSION.offboarder}'s raw text`}
          rawAuthor={`${SESSION.offboarder} · written 6 hours ago · 2 attachments`}
          rawContent={
            <>
              <p>The contract says 2% penalty on next quarter's invoice if we miss SLA more than once per quarter. But the verbal grace period from Linh at XYZ that I negotiated last March isn't in the contract — she said any single miss within 5 business days of resolution doesn't trigger the penalty clock.</p>
              <p className="mt-3">Came up after a Q3 incident where we missed by 4 hours due to their infrastructure. She offered the grace period verbally · I have it in a voicemail attached.</p>
              <p className="mt-3 text-gray-600 italic">⚠ Don't email Linh about this · she'll deny it on record. Talk to her by phone if it comes up · she's good about it as long as it's not in writing.</p>
            </>
          }
          structuredTitle="AI-structured version"
          structuredAuthor="Worker SLM · auto-generated · 5 min ago"
          structuredContent={
            <>
              <p><strong className="text-emerald-800">Vendor XYZ SLA penalty clause</strong></p>
              <ul className="list-disc pl-5 mt-2 space-y-1.5">
                <li><strong>Contractual:</strong> 2% penalty on next quarter's invoice if SLA missed more than once per quarter.</li>
                <li><strong>Verbal grace period (off-contract):</strong> Linh at Vendor XYZ verbally committed in March that any single miss within 5 business days of resolution does not trigger the penalty clock. Sourced from Q3 negotiation following an incident where they were 4h late due to their infrastructure.</li>
                <li><strong>How to invoke:</strong> Phone call only · do not put in writing.</li>
              </ul>
              <p className="mt-3 text-[11px] text-emerald-700/80 italic">Auto-tagged: <code style={{ fontFamily: MONO_STACK }} className="text-[11px] bg-emerald-100/60 px-1 rounded">[Vendor]</code> <code style={{ fontFamily: MONO_STACK }} className="text-[11px] bg-emerald-100/60 px-1 rounded">[Off-contract]</code> · Tier 1 lock applied (legal-adjacent)</p>
            </>
          }
        />

        <SourceProvenanceStrip
          sources={[
            { kind: "doc", label: "Vendor XYZ contract v2.1.pdf", source: "SharePoint · Vendor-Contracts" },
            { kind: "voicemail", label: "Linh confirming grace period (0:42)", source: "Voicemail · uploaded with bundle" },
            { kind: "board", label: "March 14 renewal call notes", source: "Trello · Vendor-Mgmt" },
            { kind: "person", label: "Phương Anh corroboration", source: "Cross-team · independently confirmed" },
          ]}
        />

        <NetworkCorroborationCard />
      </div>
    </ReviewShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S3 · Quick accept · all signals green · one-click
   ═══════════════════════════════════════════════════════════════════ */

function S3QuickAccept() {
  return (
    <ReviewShell bundleState="accepting">
      <div className="px-6 py-6 max-w-[900px]">
        <AcceptedToastBar />

        <ItemHeader
          n={1}
          source="manager-priority"
          title="Vendor XYZ · the SLA penalty clause"
          subtitle="Manager priority · from you to Minh · #1 of 2"
          tagBadge="Vendor XYZ"
          tagBadgeKind="topic"
          itemId="ITEM-2026-06-03-007"
          status="accepted"
        />

        <OriginalQuestionCard />

        <DiffPanes
          rawTitle={`${SESSION.offboarder}'s raw text`}
          rawAuthor={`${SESSION.offboarder} · written 6 hours ago · 2 attachments`}
          rawContent={
            <>
              <p>The contract says 2% penalty on next quarter's invoice if we miss SLA more than once per quarter. But the verbal grace period from Linh at XYZ that I negotiated last March isn't in the contract — she said any single miss within 5 business days of resolution doesn't trigger the penalty clock.</p>
              <p className="mt-3">Came up after a Q3 incident where we missed by 4 hours due to their infrastructure. She offered the grace period verbally · I have it in a voicemail attached.</p>
              <p className="mt-3 text-gray-600 italic">⚠ Don't email Linh about this · she'll deny it on record. Talk to her by phone if it comes up · she's good about it as long as it's not in writing.</p>
            </>
          }
          structuredTitle="AI-structured version · now Canonical"
          structuredAuthor="Worker SLM · auto-generated · accepted as Canonical by you 3 sec ago"
          structuredContent={
            <>
              <p><strong className="text-emerald-800">Vendor XYZ SLA penalty clause</strong></p>
              <ul className="list-disc pl-5 mt-2 space-y-1.5">
                <li><strong>Contractual:</strong> 2% penalty on next quarter's invoice if SLA missed more than once per quarter.</li>
                <li><strong>Verbal grace period (off-contract):</strong> Linh at Vendor XYZ verbally committed in March that any single miss within 5 business days of resolution does not trigger the penalty clock. Sourced from Q3 negotiation following an incident where they were 4h late due to their infrastructure.</li>
                <li><strong>How to invoke:</strong> Phone call only · do not put in writing.</li>
              </ul>
            </>
          }
          structuredAccepted
        />

        <PostAcceptInlineActions />
      </div>
    </ReviewShell>
  );
}

function AcceptedToastBar() {
  return (
    <div className="rounded-xl border border-emerald-300 bg-emerald-50/60 px-4 py-3 mb-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0">
        <Check className="w-4 h-4 text-emerald-700" strokeWidth={2.5} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-emerald-900">Item 1 accepted as Canonical</div>
        <div className="text-[11px] text-emerald-800/80 mt-0.5">
          Will commit to KG when you sign off the full bundle · 4 downstream targets queued · audit entry created.
        </div>
      </div>
      <button className="text-[11px] text-emerald-800 hover:text-emerald-900 font-medium inline-flex items-center gap-1">
        <RotateCcw className="w-3 h-3" strokeWidth={2} />
        Undo
      </button>
    </div>
  );
}

function PostAcceptInlineActions() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 mt-4 flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2 text-[11px] text-gray-600">
        <Sparkles className="w-3 h-3 text-violet-500" strokeWidth={2} />
        <span>Next up · <strong className="text-gray-900">item 2 · Payment Gateway timeout fix</strong> · also a Manager priority.</span>
      </div>
      <div className="flex items-center gap-2">
        <button className="h-8 px-3 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-[11px] font-medium inline-flex items-center gap-1.5 transition-colors">
          <Save className="w-3 h-3" strokeWidth={2} />
          Save + finish later
        </button>
        <button className="h-8 px-3 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-[12px] font-semibold inline-flex items-center gap-1.5 transition-colors">
          Continue to item 2
          <ChevronRight className="w-3 h-3" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Shared primitives for S2/S3 (and reused by C/D/E)
   ═══════════════════════════════════════════════════════════════════ */

function ItemHeader({ n, source, title, subtitle, tagBadge, tagBadgeKind, itemId, status }) {
  const cfg = {
    "manager-priority": { borderL: "border-l-violet-500", iconCls: "bg-violet-50 border-violet-200 text-violet-700", icon: Sparkles },
    "network": { borderL: "border-l-indigo-500", iconCls: "bg-indigo-50 border-indigo-200 text-indigo-700", icon: Users },
    "flag": { borderL: "border-l-yellow-500", iconCls: "bg-yellow-50 border-yellow-200 text-yellow-700", icon: AlertTriangle },
    "own": { borderL: "border-l-gray-400", iconCls: "bg-gray-50 border-gray-200 text-gray-700", icon: Plus },
  }[source];
  const SourceIcon = cfg.icon;
  return (
    <div className={`rounded-xl bg-white border border-gray-200 border-l-[3px] ${cfg.borderL} px-4 py-3 mb-4 flex items-center gap-3`}>
      <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${cfg.iconCls}`}>
        <SourceIcon className="w-4.5 h-4.5" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-gray-500">Item {n}</span>
          <span className="text-gray-300">·</span>
          <span className="text-[11px] text-gray-600">{subtitle}</span>
          {tagBadge && <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-gray-700 inline-flex items-center gap-1"><Tag className="w-2.5 h-2.5" strokeWidth={2} />{tagBadge}</span>}
          {status === "accepted" && <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 inline-flex items-center gap-1"><Check className="w-2.5 h-2.5" strokeWidth={2.5} />Accepted</span>}
        </div>
        <h2 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">{title}</h2>
        {itemId && <div className="text-[9px] text-gray-400 mt-1" style={{ fontFamily: MONO_STACK }}>{itemId}</div>}
      </div>
      <button className="text-gray-400 hover:text-gray-700 p-1.5 shrink-0">
        <MoreHorizontal className="w-4 h-4" strokeWidth={1.75} />
      </button>
    </div>
  );
}

function OriginalQuestionCard() {
  return (
    <div className="rounded-xl bg-violet-50/30 border border-violet-200 p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center shrink-0">
          <span className="text-[10px] font-semibold text-violet-700">{SESSION.reviewerInitials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold text-gray-900">{SESSION.reviewer} · you</span>
            <span className="text-[10px] text-gray-500">asked this on May 31 · 2 days ago</span>
            <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700">Critical</span>
          </div>
          <blockquote className="text-[13px] text-gray-700 leading-relaxed italic flex items-start gap-2">
            <Quote className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" strokeWidth={1.75} />
            <span>What's the exact penalty clause you negotiated, and is there a verbal commitment from the vendor that isn't in the contract? Anything that would surprise {SESSION.successorShort} during the renewal.</span>
          </blockquote>
          <div className="text-[10px] text-gray-500 mt-2 inline-flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-violet-500" strokeWidth={2} />
            Tagged as critical because {SESSION.successorShort}'s renewal call is in 9 days
          </div>
        </div>
      </div>
    </div>
  );
}

function DiffPanes({ rawTitle, rawAuthor, rawContent, structuredTitle, structuredAuthor, structuredContent, structuredAccepted }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
      <DiffPane
        side="raw"
        title={rawTitle}
        author={rawAuthor}
        content={rawContent}
      />
      <DiffPane
        side="structured"
        title={structuredTitle}
        author={structuredAuthor}
        content={structuredContent}
        accepted={structuredAccepted}
      />
    </div>
  );
}

function DiffPane({ side, title, author, content, accepted }) {
  const cfg = {
    raw: {
      border: "border-rose-200",
      header: "bg-rose-50/40 border-rose-100",
      badge: "bg-rose-100 border-rose-200 text-rose-700",
      badgeLabel: "Raw input",
      icon: Edit3,
    },
    structured: {
      border: accepted ? "border-emerald-400" : "border-emerald-200",
      header: accepted ? "bg-emerald-50/60 border-emerald-200" : "bg-emerald-50/40 border-emerald-100",
      badge: accepted ? "bg-emerald-600 text-white border-emerald-600" : "bg-emerald-100 border-emerald-200 text-emerald-700",
      badgeLabel: accepted ? "Canonical · accepted" : "AI-structured",
      icon: accepted ? Award : Sparkles,
    },
  }[side];
  const HeaderIcon = cfg.icon;
  return (
    <article className={`rounded-xl bg-white border ${cfg.border} overflow-hidden flex flex-col ${accepted ? "ring-2 ring-emerald-500/15" : ""}`}>
      <header className={`px-4 py-2.5 border-b ${cfg.header} flex items-center gap-2`}>
        <HeaderIcon className={`w-3.5 h-3.5 ${side === "raw" ? "text-rose-700" : "text-emerald-700"}`} strokeWidth={2} />
        <span className="text-[12px] font-semibold text-gray-900 truncate flex-1">{title}</span>
        <span className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full border ${cfg.badge} inline-flex items-center gap-1 shrink-0`}>
          {accepted && <Check className="w-2.5 h-2.5" strokeWidth={2.5} />}
          {cfg.badgeLabel}
        </span>
      </header>
      <div className="px-4 py-4 text-[13px] text-gray-800 leading-relaxed flex-1">
        {content}
      </div>
      <footer className="px-4 py-2 border-t border-gray-100 bg-gray-50/50 text-[10px] text-gray-500 truncate">
        {author}
      </footer>
    </article>
  );
}

function SourceProvenanceStrip({ sources }) {
  const iconFor = (kind) => ({
    doc: FileText,
    voicemail: Volume2,
    board: GitBranch,
    person: Users,
    transcript: MessageSquare,
    incident: AlertOctagon,
    ticket: Tag,
  }[kind] || FileText);
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="w-3 h-3 text-emerald-600" strokeWidth={2} />
        <h3 className="text-[11px] font-semibold text-gray-900">Source provenance · {sources.length} cited</h3>
        <span className="ml-auto text-[9px] text-gray-500" style={{ fontFamily: MONO_STACK }}>QA-INT-01 §1.3</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {sources.map((s, i) => {
          const Icon = iconFor(s.kind);
          return (
            <button key={i} className="rounded-md border border-gray-200 bg-white px-2.5 py-1.5 hover:border-violet-300 hover:bg-violet-50/30 transition-colors text-left inline-flex items-center gap-2 cursor-pointer">
              <Icon className="w-3 h-3 text-violet-600 shrink-0" strokeWidth={2} />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium text-gray-900 truncate">{s.label}</div>
                <div className="text-[9px] text-gray-500 truncate" style={{ fontFamily: MONO_STACK }}>{s.source}</div>
              </div>
              <ArrowUpRight className="w-2.5 h-2.5 text-gray-400 shrink-0" strokeWidth={2} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NetworkCorroborationCard() {
  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50/30 p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-white border border-indigo-200 flex items-center justify-center shrink-0">
          <Users className="w-4 h-4 text-indigo-700" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700">Network corroboration</span>
            <span className="text-[10px] text-gray-500">independently confirmed by {SESSION.corroboratorName}</span>
          </div>
          <h3 className="text-[13px] font-semibold text-gray-900 mb-2">
            {SESSION.corroboratorName.split(" ")[0]} flagged the same grace period in her UC-HO-08 network question
          </h3>
          <blockquote className="text-[11px] text-gray-700 leading-relaxed italic border-l-2 border-indigo-300 pl-2.5 mb-2">
            "From my Sales team's view, we have a 5-business-day grace on the penalty clause that I think you negotiated verbally. The contract doesn't show it explicitly · could you confirm and document the back-and-forth?"
          </blockquote>
          <div className="flex items-center gap-2 text-[10px] text-gray-500">
            <span className="inline-flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center">
                <span className="text-[8px] font-semibold text-indigo-700">{SESSION.corroboratorInitials}</span>
              </span>
              {SESSION.corroboratorName} · {SESSION.corroboratorTeam}
            </span>
            <span>·</span>
            <span style={{ fontFamily: MONO_STACK }}>asked 2 days ago · answered in Minh's queue</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S4-S8 · Placeholder cards · filled in by Steps C-E
   ═══════════════════════════════════════════════════════════════════ */

function StatePlaceholder({ stateNum, plannedStep, purpose, willShow }) {
  return (
    <ReviewShell bundleState={null}>
      <div className="px-8 py-12 max-w-[640px] mx-auto">
        <div className="rounded-2xl border-2 border-dashed border-violet-300 bg-violet-50/30 p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl bg-white border border-violet-200 flex items-center justify-center shrink-0">
              <Hammer className="w-5 h-5 text-violet-700" strokeWidth={1.75} />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] font-semibold text-violet-700 mb-1">
                <CircleDot className="w-2.5 h-2.5" strokeWidth={2.5} />
                Coming in build Step {plannedStep}
              </span>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">State {stateNum} · {purpose}</h2>
            </div>
          </div>

          <p className="text-[13px] text-gray-700 leading-relaxed mb-4">
            This state is scaffolded · the architecture, shell, item list rail, and decision rail are all in place. The state-specific content lands in Step {plannedStep}.
          </p>

          <div className="rounded-lg bg-white border border-violet-200 px-4 py-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-violet-700 font-semibold mb-2">What this state will show</div>
            <ul className="space-y-1.5">
              {willShow.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[12px] text-gray-700">
                  <ArrowRight className="w-3 h-3 text-violet-600 shrink-0 mt-0.5" strokeWidth={2} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-500">
            <Info className="w-3 h-3" strokeWidth={2} />
            <span>States 1, 2, 3 are now complete. Navigate via the dev chrome step dots to see them.</span>
          </div>
        </div>
      </div>
    </ReviewShell>
  );
}

function S4Placeholder() {
  return (
    <StatePlaceholder
      stateNum={4}
      plannedStep="C"
      purpose="Edit inline · CL-086 grammar"
      willShow={[
        "Editable version of the AI-structured text · Hà Vy makes a small correction",
        "Original AI text greyed/strikethrough above the edited version (CL-086)",
        "Edit history breadcrumb · Minh raw → AI structure → Hà Vy edit",
        "Decision rail · Save edit + accept primary action",
      ]}
    />
  );
}

function S5Placeholder() {
  return (
    <StatePlaceholder
      stateNum={5}
      plannedStep="C"
      purpose="Send back for clarification"
      willShow={[
        "Send-back form with prefilled question for Minh",
        "Returns to his queue as a follow-up question (visible in Capture Queue mockup)",
        "Item moves to 'Awaiting Minh' group in the rail · doesn't block sign-off of other items",
        "Decision rail · Send back to Minh CTA with yellow accent",
      ]}
    />
  );
}

function S6Placeholder() {
  return (
    <StatePlaceholder
      stateNum={6}
      plannedStep="D"
      purpose="Pre-commit flag fix · 3-way diff"
      willShow={[
        "3-way diff · AI original capture + Trần's flagged correction + Minh's accepted fix",
        "Network corroboration · Duy independently agreed with the staging-first rule",
        "Approve the chain CTA · promotes Minh's fix to Canonical and resolves the flag",
        "Audit trail preview showing all 3 versions preserved in history",
      ]}
    />
  );
}

function S7Placeholder() {
  return (
    <StatePlaceholder
      stateNum={7}
      plannedStep="E"
      purpose="Bundle summary · propagation preview"
      willShow={[
        "Full breakdown · 9 Canonical, 3 Verified-only, 2 sent back, 0 rejected",
        "Propagation graph preview showing where each item lands (playbook sections, graph nodes, Slack channels)",
        "Per-team impact summary · Engineering / Sales / Data Platform",
        "Ready to sign-off CTA · routes to S8",
      ]}
    />
  );
}

function S8Placeholder() {
  return (
    <StatePlaceholder
      stateNum={8}
      plannedStep="E"
      purpose="Sign-off · QA-INT-01 §1.4 commit gate"
      willShow={[
        "Cryptographic anchor preview · SHA-256 of the bundle generated on sign-off",
        "Signature card with Hà Vy's avatar + role + handle + timestamp",
        "KG commit progress · live propagation to playbook + graph + downstream consumers",
        "Audit log entry visible · QA-INT-01 §2.3 immutable trail",
        "Done state with link back to dashboard + Trần's playbook (now updated)",
      ]}
    />
  );
}
