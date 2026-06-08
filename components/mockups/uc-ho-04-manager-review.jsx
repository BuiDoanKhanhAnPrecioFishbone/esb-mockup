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
  PenTool, RotateCcw, Flag, ListChecks, Volume2, Quote,
  Zap, ArrowLeftRight
} from "lucide-react";
import { S6FlagFixView, DecisionPanelFlag } from "./uc-ho-04-s6-flag-fix.jsx";
import { S7BundleSummaryView, S8SignOffView, DecisionPanelSummary, DecisionPanelSignOff } from "./uc-ho-04-s7s8-signoff.jsx";

/* ═══════════════════════════════════════════════════════════════════
   UC-HO-04 · Manager Review + Sign-off · Management plane

   Hà Vy's workspace for reviewing Minh Lê's captured bundle before it
   commits to the Knowledge Graph. Manager sign-off is the commit gate;
   nothing reaches the graph without it.

   CL-108 (2026-06-07) · embedded-surface cleanup. When embedded in the
   SessionCommandView "Manager review" tab:
     · the loud S1–S8 state chips become a muted "Preview" stepper
       (demo navigation kept, but de-emphasized — it's a preview aid,
       not product chrome);
     · internal references (CL-###, QA-INT-01 §, "Worker SLM", Tier
       labels, UC-HO-## ) are removed from user-visible copy — they
       live in code/comments and the change log, not the UI;
     · S1 arrival prose (hero headline, intro paragraph, recommended-
       order card, pre-checks grid, est-time note) collapses to a
       compact bundle summary + a single "Start review" CTA, matching
       the CL-107 labels-only rule used across the Management plane.
   Standalone dev harness (embedded={false}) is unchanged.

   CL-112 (2026-06-08) · terminology + count consistency. The review
   unit is an "item" everywhere (umbrella for answers + uploaded files
   + flag fixes); the post-commit KG count on the dashboard is "entries"
   (a different unit at a different stage). S1's bundle tiles now mirror
   the left-rail groups and sum to the headline 14 (Uploaded files tile
   added; Own→gray to match the rail source colors). Uploaded files are
   part of the 14 (3 of them); SESSION.filesTotal aligned to 3.

   Embedded contract (CL-103): default export accepts `embedded` +
   `state` ("s1".."s8"); `?tab=review-s4` deep-links still work.
   ═══════════════════════════════════════════════════════════════════ */

const FLOW = [
  { id: "s1", uc: "Step 1", label: "Arrival · bundle overview",        trigger: "Hà Vy opens Minh's submitted bundle · 14 items (3 are uploaded files) · 1 redirected." },
  { id: "s2", uc: "Step 2", label: "Reviewing Manager Priority",       trigger: "First item · Vendor XYZ SLA penalty clause · side-by-side · Minh's raw text + AI-structured version." },
  { id: "s3", uc: "Step 3", label: "Quick accept · all green",         trigger: "All confidence signals positive · sources cited · one-click acceptance · auto-canonical." },
  { id: "s4", uc: "Step 4", label: "Edit inline",                      trigger: "Item 4 (Vendor XYZ grace period) needs a small wording fix · Hà Vy edits inline." },
  { id: "s5", uc: "Step 5", label: "Send back for clarification",      trigger: "Item 5 (2am Saturday coverage) is incomplete · Hà Vy sends it back to Minh with a specific follow-up question." },
  { id: "s6", uc: "Step 6", label: "Pre-commit flag fix · 3-way",      trigger: "Item 6 · Atlas rollback · Trần caught a mistake, Minh corrected it · Hà Vy approves the 3-way chain." },
  { id: "s7", uc: "Step 7", label: "Bundle summary",                   trigger: "All 14 items reviewed · 9 Canonical, 3 Verified, 2 sent back · propagation preview." },
  { id: "s8", uc: "Step 8", label: "Sign-off · commit gate",           trigger: "Hà Vy signs off · KG commit begins · propagation to playbook + graph + downstream consumers." },
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
  flaggerNetTeam: "Data Platform",
  corroboratorName: "Phương Anh Nguyễn",
  corroboratorInitials: "PA",
  corroboratorTeam: "Sales",
  itemsTotal: 14,
  filesTotal: 3,
  redirects: 1,
  daysUntilLastDay: 4,
};

const MONO_STACK = 'ui-monospace, "Geist Mono", "JetBrains Mono", Menlo, monospace';

const EmbeddedContext = React.createContext(false);

export default function UCHO04ManagerReview({ embedded = false, state } = {}) {
  const initialIdx = (() => {
    if (state) {
      const i = FLOW.findIndex((s) => s.id === state);
      if (i >= 0) return i;
    }
    return 0;
  })();
  const [stepIdx, setStepIdx] = useState(initialIdx);
  const step = FLOW[stepIdx];

  if (embedded) {
    return (
      <EmbeddedContext.Provider value={true}>
        <div className="bg-white text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>
          <PreviewStepper step={step} stepIdx={stepIdx} onChange={setStepIdx} />
          <StateRenderer id={step.id} />
        </div>
      </EmbeddedContext.Provider>
    );
  }

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

/* ─── Dev chrome (standalone only · not the product surface) ─── */

function DevChrome({ step, stepIdx, onJump }) {
  return (
    <header className="bg-gray-50 border-b border-gray-200 sticky top-0 z-30">
      <div className="px-5 py-2 flex items-center justify-between gap-4 max-w-[1400px] mx-auto w-full">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
          <span className="text-gray-900 font-semibold tracking-[0.18em] text-xs" style={{ fontFamily: MONO_STACK }}>ART-EEP</span>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-gray-500 text-xs">UC-HO-04 · Manager review · dev harness</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-gray-500 shrink-0">
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
        Dev harness · this strip is NOT part of the real review workspace.
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

/* ─── CL-108 · Muted preview stepper (embedded) ──────────────────────
   Replaces the loud S1–S8 violet chip strip. Demo navigation kept,
   but de-emphasized so it reads as a preview aid, not product chrome. */
function PreviewStepper({ step, stepIdx, onChange }) {
  const atFirst = stepIdx === 0;
  const atLast = stepIdx === FLOW.length - 1;
  return (
    <div className="px-5 py-1.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2 shrink-0">
      <span className="text-[10px] uppercase tracking-[0.18em] text-gray-400 font-medium shrink-0">Preview</span>
      <span className="text-[11px] text-gray-500 truncate min-w-0 flex-1">{step.label}</span>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => !atFirst && onChange(stepIdx - 1)}
          disabled={atFirst}
          className={`w-6 h-6 rounded inline-flex items-center justify-center transition-colors ${atFirst ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-200/60 cursor-pointer"}`}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="text-[10px] text-gray-400 tabular-nums" style={{ fontFamily: MONO_STACK }}>{stepIdx + 1}/{FLOW.length}</span>
        <button
          onClick={() => !atLast && onChange(stepIdx + 1)}
          disabled={atLast}
          className={`w-6 h-6 rounded inline-flex items-center justify-center transition-colors ${atLast ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-200/60 cursor-pointer"}`}
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function StateRenderer({ id }) {
  if (id === "s1") return <S1Arrival />;
  if (id === "s2") return <S2ReviewingPriority />;
  if (id === "s3") return <S3QuickAccept />;
  if (id === "s4") return <S4EditInline />;
  if (id === "s5") return <S5SendBack />;
  if (id === "s6") return <S6FlagFix />;
  if (id === "s7") return <S7BundleSummary />;
  if (id === "s8") return <S8SignOff />;
  return null;
}

/* ═══════════════════════════════════════════════════════════════════
   ReviewShell · ManagementHeader skipped when embedded (host provides
   nav). ReviewSubHeader kept; its status reads in plain language now.
   ═══════════════════════════════════════════════════════════════════ */

function ReviewShell({ children, bundleState, hideRightRail }) {
  const isEmbedded = React.useContext(EmbeddedContext);
  return (
    <div className="flex flex-col flex-1 min-h-[820px]">
      {!isEmbedded && <ManagementHeader />}
      <ReviewSubHeader bundleState={bundleState} />
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

function ReviewSubHeader({ bundleState }) {
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
            <span className="inline-flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-600" strokeWidth={2} /> Sensitive content checked</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1"><ListChecks className="w-3 h-3 text-emerald-600" strokeWidth={2} /> Colleague review window closed</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <BundleProgress bundleState={bundleState} />
        <button className="h-8 px-3 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-[12px] font-medium inline-flex items-center gap-1.5 transition-colors">
          <MessageSquare className="w-3 h-3" strokeWidth={2} />
          Message {SESSION.offboarderShort}
        </button>
      </div>
    </div>
  );
}

function BundleProgress({ bundleState }) {
  const cfg = (() => {
    if (bundleState === "sign-off") return { value: "14 / 14", pct: 100, label: "Decided" };
    if (bundleState === "bundle-summary") return { value: "14 / 14", pct: 100, label: "Decided" };
    if (bundleState === "flag-fix") return { value: "5 / 14", pct: 36, label: "Reviewed" };
    if (bundleState === "send-back") return { value: "4 / 14", pct: 28, label: "Reviewed" };
    if (bundleState === "editing") return { value: "3 / 14", pct: 21, label: "Reviewed" };
    if (bundleState === "accepting") return { value: "1 / 14", pct: 7, label: "Reviewed" };
    if (bundleState === "reviewing-mp") return { value: "0 / 14", pct: 0, label: "Reviewed" };
    return { value: "0 / 14", pct: 0, label: "Reviewed" };
  })();
  const isDone = cfg.pct === 100;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 flex items-center gap-2">
      <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">{cfg.label}</div>
      <div className={`text-[13px] font-bold ${isDone ? "text-emerald-700" : "text-violet-700"}`} style={{ fontFamily: MONO_STACK }}>{cfg.value}</div>
      <div className="w-20 h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-full rounded-full ${isDone ? "bg-gradient-to-r from-emerald-500 to-emerald-600" : "bg-gradient-to-r from-violet-500 to-violet-600"}`} style={{ width: `${cfg.pct}%` }} />
      </div>
    </div>
  );
}

/* ─── Item List Rail · left sidebar ─── */

function ItemListRail({ activeState }) {
  const isFinal = activeState === "bundle-summary" || activeState === "sign-off";
  const fin = (def, final = "accepted") => isFinal ? final : def;

  return (
    <aside className="border-r border-gray-200 bg-white flex flex-col">
      <div className="px-4 h-12 border-b border-gray-100 flex items-center gap-2">
        <Inbox className="w-3.5 h-3.5 text-violet-700" strokeWidth={2} />
        <h3 className="text-xs font-semibold text-gray-900">Items in bundle</h3>
        <span className="ml-auto text-[10px] text-gray-500" style={{ fontFamily: MONO_STACK }}>14</span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        <ItemListGroup label="Manager priorities" count={2} items={[
          { id: "mp1", n: 1, title: "Vendor XYZ SLA penalty", source: "manager", status: activeState === "reviewing-mp" ? "active" : activeState === "accepting" ? "just-accepted" : "accepted" },
          { id: "mp2", n: 2, title: "Payment Gateway fix", source: "manager", status: fin("pending") },
        ]} />

        <ItemListGroup label="Network questions" count={3} items={[
          { id: "nq1", n: 3, title: "Cosmos rollback heuristic", source: "network", status: "accepted" },
          { id: "nq2", n: 4, title: "Vendor XYZ grace period", source: "network", status: activeState === "editing" ? "active" : fin("edit-pending") },
          { id: "nq3", n: 5, title: "2am Saturday coverage", source: "network", status: activeState === "send-back" ? "active" : fin("pending", "send-back-pending") },
        ]} />

        <ItemListGroup label="Pre-commit flag fixes" count={1} items={[
          { id: "fl1", n: 6, title: "Atlas rollback correction", source: "flag", status: activeState === "flag-fix" ? "active" : fin("flag-review") },
        ]} />

        <ItemListGroup label="Own contributions" count={5} items={[
          { id: "ow1", n: 7, title: "Friday-deploy rule", source: "own", status: "accepted" },
          { id: "ow2", n: 8, title: "Khanh Linh escalation", source: "own", status: "accepted" },
          { id: "ow3", n: 9, title: "Vendor verbal commitments", source: "own", status: fin("pending") },
          { id: "ow4", n: 10, title: "Atlas wiki gaps", source: "own", status: fin("pending") },
          { id: "ow5", n: 11, title: "On-call quirks", source: "own", status: fin("pending", "send-back-pending") },
        ]} />

        <ItemListGroup label="Uploaded files" count={3} items={[
          { id: "f1", n: 12, title: "Architecture-2024Q3.md", source: "file", status: fin("pending") },
          { id: "f2", n: 13, title: "Payment-flow.png", source: "file", status: fin("pending") },
          { id: "f3", n: 14, title: "Vendor-call-notes.txt", source: "file", status: fin("pending") },
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
        {state === "editing" && <DecisionPanelEditing />}
        {state === "send-back" && <DecisionPanelSendBack />}
        {state === "flag-fix" && <DecisionPanelFlag />}
        {state === "bundle-summary" && <DecisionPanelSummary />}
        {state === "sign-off" && <DecisionPanelSignOff />}
        {!state && <DecisionPanelDefault />}
      </div>
    </aside>
  );
}

function DecisionPanelDefault() {
  return (
    <div className="space-y-3">
      <div className="text-[11px] text-gray-600 leading-relaxed">
        Pick an item on the left, or work top-to-bottom. Manager priorities come first.
      </div>
      <div className="space-y-1.5">
        <PrimaryDecisionButton icon={ArrowRight} label="Start with item 1" tone="violet" />
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
          { label: "AI confidence", value: "92%", positive: true },
        ]}
      />

      <div className="space-y-1.5">
        <PrimaryDecisionButton icon={Check} label="Accept · promote to Canonical" tone="emerald" />
        <PrimaryDecisionButton icon={Award} label="Accept · keep as Verified only" tone="violet" />
        <PrimaryDecisionButton icon={Edit3} label="Edit inline before accepting" tone="violet" subtle />
        <PrimaryDecisionButton icon={RotateCcw} label="Send back for clarification" tone="yellow" subtle />
        <PrimaryDecisionButton icon={X} label="Reject · don't commit this" tone="rose" subtle />
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
          Commits to the graph when you sign off · propagates to {SESSION.successorShort}'s playbook.
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

function DecisionPanelEditing() {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border-2 border-violet-300 bg-violet-50/50 p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-violet-100 border border-violet-300 flex items-center justify-center shrink-0">
            <Edit3 className="w-4 h-4 text-violet-700" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-violet-900">Editing inline</div>
            <div className="text-[10px] text-violet-800/80 leading-snug">
              Original kept in history
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1.5 mt-3">
          <DiffStatTile value="+24" label="Added" tone="violet" />
          <DiffStatTile value="−18" label="Removed" tone="rose" />
          <DiffStatTile value="3" label="Spans" tone="gray" />
        </div>
      </div>

      <div className="space-y-1.5">
        <PrimaryDecisionButton icon={Check} label="Save edit · promote to Canonical" tone="emerald" />
        <PrimaryDecisionButton icon={Award} label="Save edit · keep as Verified" tone="violet" subtle />
        <PrimaryDecisionButton icon={RotateCcw} label="Discard edits · revert to AI" tone="rose" subtle />
      </div>

      <div className="pt-3 border-t border-gray-100">
        <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2">Edit history</div>
        <ol className="space-y-1.5 text-[10px] text-gray-600 leading-snug">
          <LineageRowSm n={1} label={`${SESSION.offboarder} raw`} detail="Original capture" done />
          <LineageRowSm n={2} label="AI structured" detail="Auto-format" done />
          <LineageRowSm n={3} label={`${SESSION.reviewer} edit`} detail="Your wording fix · live" active />
        </ol>
      </div>
    </div>
  );
}

function DecisionPanelSendBack() {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border-2 border-yellow-300 bg-yellow-50/50 p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-yellow-100 border border-yellow-300 flex items-center justify-center shrink-0">
            <RotateCcw className="w-4 h-4 text-yellow-700" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-yellow-900">Sending back to {SESSION.offboarderShort}</div>
            <div className="text-[10px] text-yellow-800/80 leading-snug">
              Goes to his queue · doesn't block the rest of the bundle
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <PrimaryDecisionButton icon={Send} label={`Send to ${SESSION.offboarderShort}'s queue`} tone="yellow" />
        <PrimaryDecisionButton icon={Save} label="Save draft · send later" tone="violet" subtle />
        <PrimaryDecisionButton icon={X} label="Cancel · go back to accept" tone="rose" subtle />
      </div>

      <div className="rounded-lg bg-rose-50/30 border border-rose-100 px-3 py-2 text-[10px] text-rose-900/80 leading-snug">
        <AlertTriangle className="w-3 h-3 text-rose-700 inline-block mr-1 -mt-0.5" strokeWidth={2} />
        {SESSION.offboarderShort} has {SESSION.daysUntilLastDay} days left · consider marking urgent.
      </div>
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

function DiffStatTile({ value, label, tone }) {
  const cfg = {
    violet: { bg: "bg-violet-100", border: "border-violet-200", text: "text-violet-700" },
    rose: { bg: "bg-rose-100", border: "border-rose-200", text: "text-rose-700" },
    gray: { bg: "bg-gray-100", border: "border-gray-200", text: "text-gray-700" },
  }[tone];
  return (
    <div className={`rounded-md ${cfg.bg} border ${cfg.border} px-2 py-1.5 text-center`}>
      <div className={`text-sm font-bold ${cfg.text} leading-none`} style={{ fontFamily: MONO_STACK }}>{value}</div>
      <div className="text-[9px] text-gray-600 mt-1 uppercase tracking-wider">{label}</div>
    </div>
  );
}

function LineageRowSm({ n, label, detail, done, active }) {
  return (
    <li className="flex items-start gap-2">
      <span className={`w-4 h-4 rounded shrink-0 flex items-center justify-center text-[8px] font-bold ${
        active ? "bg-violet-600 text-white" :
        done ? "bg-emerald-100 text-emerald-700 border border-emerald-300" :
        "bg-white border border-gray-300 text-gray-400"
      }`} style={{ fontFamily: MONO_STACK }}>{active ? <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> : done ? <Check className="w-2 h-2" strokeWidth={3} /> : n}</span>
      <div className="flex-1 min-w-0">
        <div className={`text-[10px] ${active ? "font-semibold text-gray-900" : "text-gray-700"}`}>{label}</div>
        <div className="text-[9px] text-gray-500 leading-snug">{detail}</div>
      </div>
    </li>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S1 · Arrival · compact bundle summary + single CTA (CL-108)
   Tiles mirror the left-rail groups and sum to 14 (CL-112): priorities
   2 + network 3 + flag 1 + own 5 + files 3 = 14. The redirected item
   is excluded (it left the bundle).
   ═══════════════════════════════════════════════════════════════════ */

function S1Arrival() {
  return (
    <ReviewShell bundleState={null}>
      <div className="px-8 py-8 max-w-[820px] mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
            {SESSION.offboarderShort}'s bundle · 14 items
          </h1>
          <p className="text-[12px] text-gray-500 mt-1">
            {SESSION.daysUntilLastDay} days until his last day · {SESSION.successorShort} reads it once you sign off
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <BundleStatTile icon={Sparkles} label="Manager priorities" count={2} sublabel="High-confidence" tone="violet" />
          <BundleStatTile icon={Users} label="Network questions" count={3} sublabel="From Duy + Phương Anh" tone="indigo" />
          <BundleStatTile icon={AlertTriangle} label="Flag fixes" count={1} sublabel={`${SESSION.successorShort} raised, ${SESSION.offboarderShort} corrected`} tone="yellow" />
          <BundleStatTile icon={Plus} label="Own contributions" count={5} sublabel="3 unwritten rules + 2 other" tone="gray" />
          <BundleStatTile icon={FileText} label="Uploaded files" count={3} sublabel="Architecture, payment flow, notes" tone="emerald" />
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50/40 px-4 py-2.5 mb-6 flex items-center gap-2 text-[11px] text-gray-600">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" strokeWidth={2} />
          <span>Pre-checks cleared · sensitive content checked · sources cited · colleague review window closed</span>
        </div>

        <button className="h-10 px-5 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-[14px] font-semibold inline-flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30">
          <ArrowRight className="w-4 h-4" strokeWidth={2} />
          Start with item 1
        </button>
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
    gray: { ring: "border-gray-200", bg: "bg-gray-50/50", iconBg: "bg-gray-100 border-gray-200 text-gray-700", valueCls: "text-gray-700" },
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
          structuredAuthor="AI-structured · auto-generated · 5 min ago"
          structuredContent={
            <>
              <p><strong className="text-emerald-800">Vendor XYZ SLA penalty clause</strong></p>
              <ul className="list-disc pl-5 mt-2 space-y-1.5">
                <li><strong>Contractual:</strong> 2% penalty on next quarter's invoice if SLA missed more than once per quarter.</li>
                <li><strong>Verbal grace period (off-contract):</strong> Linh at Vendor XYZ verbally committed in March that any single miss within 5 business days of resolution does not trigger the penalty clock. Sourced from Q3 negotiation following an incident where they were 4h late due to their infrastructure.</li>
                <li><strong>How to invoke:</strong> Phone call only · do not put in writing.</li>
              </ul>
              <p className="mt-3 text-[11px] text-emerald-700/80 italic">Tagged: <code style={{ fontFamily: MONO_STACK }} className="text-[11px] bg-emerald-100/60 px-1 rounded">Vendor</code> <code style={{ fontFamily: MONO_STACK }} className="text-[11px] bg-emerald-100/60 px-1 rounded">Off-contract</code> · access-limited (sensitive)</p>
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
          structuredAuthor="AI-structured · accepted as Canonical by you 3 sec ago"
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
          Commits when you sign off the full bundle · 4 downstream targets queued.
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
        <span>Next up · <strong className="text-gray-900">item 2 · Payment Gateway timeout fix</strong></span>
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
   S4 · Edit inline · original strikethrough + violet additions
   ═══════════════════════════════════════════════════════════════════ */

function S4EditInline() {
  return (
    <ReviewShell bundleState="editing">
      <div className="px-6 py-6 max-w-[900px]">
        <ItemHeader
          n={4}
          source="network"
          title="Vendor XYZ · the 5-day grace period story"
          subtitle="Network question · from Phương Anh · #2 of 3"
          tagBadge="Vendor XYZ"
          itemId="ITEM-2026-06-03-011"
          status="editing"
        />

        <NetworkQuestionCard
          asker={SESSION.corroboratorName}
          askerInitials={SESSION.corroboratorInitials}
          askerTeam={SESSION.corroboratorTeam}
          question={`Minh, I think you and Linh worked out a verbal grace period on the SLA penalty clause — can you confirm the exact terms? My team will need to know when we close out the contract paperwork.`}
          when="asked 2 days ago"
        />

        <EditableDiffEditor />

        <EditLineageFooter />
      </div>
    </ReviewShell>
  );
}

function NetworkQuestionCard({ asker, askerInitials, askerTeam, question, when }) {
  return (
    <div className="rounded-xl bg-indigo-50/30 border border-indigo-200 p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center shrink-0">
          <span className="text-[10px] font-semibold text-indigo-700">{askerInitials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[11px] font-semibold text-gray-900">{asker}</span>
            <span className="text-[10px] text-gray-500">· {askerTeam} team</span>
            <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 inline-flex items-center gap-1">
              <Users className="w-2.5 h-2.5" strokeWidth={2.5} />
              Network
            </span>
          </div>
          <blockquote className="text-[13px] text-gray-700 leading-relaxed italic flex items-start gap-2">
            <Quote className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" strokeWidth={1.75} />
            <span>{question}</span>
          </blockquote>
          <div className="text-[10px] text-gray-500 mt-2" style={{ fontFamily: MONO_STACK }}>{when}</div>
        </div>
      </div>
    </div>
  );
}

function EditableDiffEditor() {
  return (
    <div className="rounded-xl border-2 border-violet-300 bg-white overflow-hidden mb-4 shadow-sm">
      <div className="px-4 py-2.5 border-b border-violet-200 bg-violet-50/40 flex items-center gap-2 flex-wrap">
        <Edit3 className="w-3.5 h-3.5 text-violet-700" strokeWidth={2} />
        <span className="text-[12px] font-semibold text-violet-900">You are editing this item</span>
        <span className="ml-auto text-[10px] text-violet-700 inline-flex items-center gap-1">
          <ArrowLeftRight className="w-2.5 h-2.5" strokeWidth={2} />
          <button className="hover:underline cursor-pointer">Show original side-by-side</button>
        </span>
      </div>

      <div className="px-5 py-5 text-[14px] text-gray-800 leading-[1.7]">
        <p className="mb-4">
          <DelSpan>The vendor has provided a verbal commitment that</DelSpan>
          {" "}
          <InsSpan>Linh at Vendor XYZ verbally agreed:</InsSpan>
          {" "}
          <DelSpan>any single SLA miss occurring within a</DelSpan>
          {" "}
          <InsSpan>a single SLA miss within</InsSpan>
          {" "}
          5
          {" "}
          <DelSpan>-business-day grace period following resolution</DelSpan>
          {" "}
          <InsSpan>business days of resolution</InsSpan>
          {" "}
          <DelSpan>does not trigger the contractual penalty clause</DelSpan>
          <InsSpan>doesn't trigger the penalty</InsSpan>
          .
        </p>

        <p className="mb-2 font-semibold text-gray-900">Context</p>
        <p>
          Sourced from
          {" "}
          <DelSpan>the</DelSpan>
          {" "}
          <InsSpan>a</InsSpan>
          {" "}
          Q3 negotiation
          {" "}
          <DelSpan>session following</DelSpan>
          {" "}
          <InsSpan>after</InsSpan>
          {" "}
          an incident where
          {" "}
          <DelSpan>they exceeded SLA by 4 hours</DelSpan>
          {" "}
          <InsSpan>they were 4h late</InsSpan>
          {" "}
          due to
          {" "}
          <DelSpan>their infrastructure-side failure</DelSpan>
          <InsSpan>their infrastructure</InsSpan>
          . Linh
          {" "}
          <DelSpan>extended this courtesy</DelSpan>
          {" "}
          <InsSpan>offered the grace</InsSpan>
          {" "}
          for similar scenarios going forward.
        </p>

        <p className="mt-4 text-gray-900">
          <strong>How to invoke:</strong> phone call only ·
          {" "}
          <InsSpan>don't put in writing.</InsSpan>
          {" "}
          <DelSpan>this grace period should not be referenced in written communication with the vendor.</DelSpan>
        </p>

        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-[10px] text-gray-500">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-violet-100 border border-violet-200 text-violet-700 font-semibold">
            <Sparkles className="w-2.5 h-2.5" strokeWidth={2.5} />
            Your edits
          </span>
          <span>· cursor at end · ⌘S to save draft · ⌘↵ to save + accept</span>
        </div>
      </div>

      <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/40 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-3 text-[10px] text-gray-500">
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-rose-200 inline-block" />
            <span>removed</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-violet-200 inline-block" />
            <span>your additions</span>
          </span>
          <span>·</span>
          <span style={{ fontFamily: MONO_STACK }}>6 spans changed · 24 words added · 18 removed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="h-6 px-2 rounded text-[10px] text-gray-500 hover:text-violet-700 inline-flex items-center gap-1 cursor-pointer">
            <RotateCcw className="w-2.5 h-2.5" strokeWidth={2} />
            Reset to AI version
          </button>
          <button className="h-6 px-2 rounded text-[10px] text-gray-500 hover:text-violet-700 inline-flex items-center gap-1 cursor-pointer">
            <Sparkles className="w-2.5 h-2.5 text-violet-500" strokeWidth={2} />
            AI · suggest tighter wording
          </button>
        </div>
      </div>
    </div>
  );
}

function DelSpan({ children }) {
  return (
    <span className="bg-rose-100 text-rose-800 line-through decoration-rose-400 decoration-1.5 px-1 py-0.5 rounded-sm">
      {children}
    </span>
  );
}

function InsSpan({ children }) {
  return (
    <span className="bg-violet-100 text-violet-900 underline decoration-violet-400 decoration-1.5 underline-offset-2 px-1 py-0.5 rounded-sm font-medium">
      {children}
    </span>
  );
}

function EditLineageFooter() {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 mb-4">
      <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-semibold mb-3 inline-flex items-center gap-1.5">
        <History className="w-3 h-3" strokeWidth={2} />
        Edit history · all versions kept
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <LineageCard
          n={1}
          stage="Raw capture"
          actor={SESSION.offboarder}
          actorInitials={SESSION.offboarderInitials}
          when="6 hours ago"
          preview={`The verbal grace period from Linh isn't in the contract — she said any single miss within 5 business days of resolution doesn't trigger the penalty clock.`}
          tone="gray"
          done
        />
        <LineageCard
          n={2}
          stage="AI-structured"
          actor="AI"
          actorInitials="AI"
          when="5 min ago"
          preview={`The vendor has provided a verbal commitment that any single SLA miss occurring within a 5-business-day grace period following resolution does not trigger the contractual penalty clause...`}
          tone="emerald"
          done
        />
        <LineageCard
          n={3}
          stage={`${SESSION.reviewer}'s edit`}
          actor={SESSION.reviewer}
          actorInitials={SESSION.reviewerInitials}
          when="editing live"
          preview={`Linh at Vendor XYZ verbally agreed: a single SLA miss within 5 business days of resolution doesn't trigger the penalty...`}
          tone="violet"
          active
        />
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200 text-[10px] text-gray-500 leading-relaxed inline-flex items-start gap-1.5">
        <Info className="w-3 h-3 text-gray-400 shrink-0 mt-0.5" strokeWidth={2} />
        <span>{SESSION.offboarderShort} sees your edits in his history. If a change misrepresents what he meant, he can flag it.</span>
      </div>
    </div>
  );
}

function LineageCard({ n, stage, actor, actorInitials, when, preview, tone, done, active }) {
  const cfg = {
    gray: { ring: "border-gray-200", bg: "bg-white", avatar: "bg-gray-100 text-gray-700 border-gray-200", header: "text-gray-900" },
    emerald: { ring: "border-emerald-200", bg: "bg-emerald-50/30", avatar: "bg-emerald-100 text-emerald-700 border-emerald-200", header: "text-gray-900" },
    violet: { ring: active ? "border-violet-400 ring-2 ring-violet-500/20" : "border-violet-200", bg: "bg-violet-50/30", avatar: "bg-violet-100 text-violet-700 border-violet-200", header: "text-violet-900" },
  }[tone];
  return (
    <div className={`rounded-lg border ${cfg.ring} ${cfg.bg} p-3 relative`}>
      {active && (
        <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-full bg-violet-600 text-white text-[8px] font-bold uppercase tracking-wider">Live</span>
      )}
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-5 h-5 rounded ${cfg.avatar} border flex items-center justify-center text-[9px] font-bold`} style={{ fontFamily: MONO_STACK }}>{n}</span>
        <div className="flex-1 min-w-0">
          <div className={`text-[11px] font-semibold ${cfg.header} truncate`}>{stage}</div>
        </div>
        {done && <Check className="w-3 h-3 text-emerald-600 shrink-0" strokeWidth={2.5} />}
      </div>
      <div className="flex items-center gap-1.5 text-[10px] text-gray-600 mb-2">
        <span className={`w-4 h-4 rounded-full ${cfg.avatar} border flex items-center justify-center text-[8px] font-semibold`}>{actorInitials}</span>
        <span className="truncate">{actor}</span>
        <span className="text-gray-400">·</span>
        <span style={{ fontFamily: MONO_STACK }} className="text-gray-500">{when}</span>
      </div>
      <p className="text-[10px] text-gray-600 leading-snug line-clamp-3 italic">"{preview}"</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S5 · Send back for clarification
   ═══════════════════════════════════════════════════════════════════ */

function S5SendBack() {
  return (
    <ReviewShell bundleState="send-back">
      <div className="px-6 py-6 max-w-[900px]">
        <ItemHeader
          n={5}
          source="network"
          title="On-call · 2am Saturday slot coverage"
          subtitle="Network question · from Duy Nguyễn · #3 of 3"
          tagBadge="On-call rotation"
          itemId="ITEM-2026-06-03-015"
          status="sending-back"
        />

        <NetworkQuestionCard
          asker={SESSION.flaggerNet}
          askerInitials={SESSION.flaggerNetInitials}
          askerTeam={SESSION.flaggerNetTeam}
          question={`Minh — I noticed in your calendar that you cover the 2am Saturday slot pretty often. Who's been doing that when you're not? Want to make sure Trần knows.`}
          when="asked 3 hours ago"
        />

        <IncompleteAnswerCard />

        <SendBackComposer />

        <SendBackImpactNote />
      </div>
    </ReviewShell>
  );
}

function IncompleteAnswerCard() {
  return (
    <div className="rounded-xl border-2 border-yellow-200 bg-yellow-50/30 p-4 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-3.5 h-3.5 text-yellow-700" strokeWidth={2} />
        <span className="text-[11px] font-semibold text-gray-900">{SESSION.offboarderShort}'s answer is incomplete</span>
        <span className="ml-auto text-[10px] text-gray-500" style={{ fontFamily: MONO_STACK }}>answered 1 hour ago</span>
      </div>

      <div className="rounded-lg bg-white border border-yellow-200 px-3 py-3 mb-3">
        <p className="text-[13px] text-gray-700 leading-relaxed">
          "<span>It varies week to week. </span><span className="bg-yellow-100 text-yellow-900 px-0.5 rounded-sm">Daniel and Tuan have been alternating mostly</span><span>, but sometimes Hieu picks it up if they're both out. The pattern isn't documented anywhere — we just figure it out in the team chat at the start of each month.</span>"
        </p>
      </div>

      <div className="rounded-md bg-yellow-100/60 border border-yellow-200 px-3 py-2 flex items-start gap-2">
        <AlertTriangle className="w-3 h-3 text-yellow-700 shrink-0 mt-0.5" strokeWidth={2} />
        <div className="text-[10px] text-yellow-900/90 leading-relaxed">
          <strong>What's missing:</strong> the actual upcoming schedule, last names, contact preferences for after-hours pings, and whether anyone is responsible during planned leave. {SESSION.successorShort} needs concrete names and rotation order, not just first names.
        </div>
      </div>
    </div>
  );
}

function SendBackComposer() {
  return (
    <div className="rounded-xl border-2 border-yellow-300 bg-white mb-4 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-yellow-200 bg-yellow-50/50 flex items-center gap-2">
        <Send className="w-3.5 h-3.5 text-yellow-700" strokeWidth={2} />
        <span className="text-[12px] font-semibold text-yellow-900">Your follow-up question for {SESSION.offboarderShort}</span>
        <span className="ml-auto text-[10px] text-yellow-700 inline-flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" strokeWidth={2} />
          AI drafted from the gaps · edit before sending
        </span>
      </div>

      <div className="px-4 py-4">
        <RecipientPill />

        <div className="mt-3">
          <label className="text-[10px] uppercase tracking-[0.18em] font-semibold text-gray-500 mb-1.5 block">Question</label>
          <div className="rounded-lg border border-gray-300 bg-white focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-500/30 transition-colors">
            <textarea
              className="w-full px-3 py-3 text-[13px] text-gray-900 outline-none resize-none bg-transparent rounded-lg"
              rows={6}
              defaultValue={`Minh — you mentioned Daniel and Tuan alternate the 2am Saturday slot but didn't give the actual schedule. Trần will need to know who to ping. Three things:

1. Can you list the rotation through end of Q3 (or however far you know)?
2. Last names + Slack handles for Daniel, Tuan, and Hieu?
3. What's the escalation if all three are unreachable?

Also — is this rotation written down anywhere, or just lived in your head and the team chat?`}
            />
          </div>
          <div className="mt-1.5 text-[10px] text-gray-500 inline-flex items-center gap-1">
            <Hash className="w-2.5 h-2.5" strokeWidth={2} />
            <span style={{ fontFamily: MONO_STACK }}>92 words · 0.4 min to read</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <UrgencySelector />
          <SourceContextPanel />
        </div>
      </div>

      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/40 flex items-center justify-between gap-2 flex-wrap">
        <div className="text-[10px] text-gray-500 inline-flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" strokeWidth={2} />
          <span>{SESSION.offboarderShort} sees this in his capture queue</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="h-8 px-3 rounded-md text-gray-600 hover:text-gray-900 text-[11px] font-medium inline-flex items-center gap-1.5">
            <Save className="w-3 h-3" strokeWidth={2} />
            Save draft
          </button>
          <button className="h-8 px-3 rounded-md text-gray-600 hover:text-gray-900 text-[11px] font-medium inline-flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-violet-500" strokeWidth={2} />
            Improve with AI
          </button>
          <button className="h-9 px-4 rounded-md bg-yellow-600 hover:bg-yellow-700 text-white text-[12px] font-semibold inline-flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5" strokeWidth={2.5} />
            Send to {SESSION.offboarderShort}
          </button>
        </div>
      </div>
    </div>
  );
}

function RecipientPill() {
  return (
    <div className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 flex items-center gap-2">
      <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">To</span>
      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white border border-gray-200">
        <span className="w-5 h-5 rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center text-[9px] font-semibold text-violet-700">{SESSION.offboarderInitials}</span>
        <span className="text-[11px] font-medium text-gray-900">{SESSION.offboarder}</span>
        <span className="text-[10px] text-gray-500" style={{ fontFamily: MONO_STACK }}>{SESSION.offboarderHandle}</span>
      </div>
      <span className="ml-auto text-[10px] text-gray-500 inline-flex items-center gap-1">
        <Clock className="w-2.5 h-2.5" strokeWidth={2} />
        <span style={{ fontFamily: MONO_STACK }}>{SESSION.daysUntilLastDay}d left</span>
      </span>
    </div>
  );
}

function UrgencySelector() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="text-[10px] uppercase tracking-[0.18em] font-semibold text-gray-500 mb-2 inline-flex items-center gap-1.5">
        <Zap className="w-3 h-3 text-yellow-600" strokeWidth={2} />
        Urgency
      </div>
      <div className="space-y-1.5">
        <UrgencyOption label="Urgent" detail={`Notify ${SESSION.offboarderShort} now · email + push`} tone="rose" active />
        <UrgencyOption label="Standard" detail="Shows in his queue on next login" tone="violet" />
        <UrgencyOption label="Whenever" detail="No notification · low priority" tone="gray" />
      </div>
    </div>
  );
}

function UrgencyOption({ label, detail, tone, active }) {
  const cfg = {
    rose: { dot: "bg-rose-500", text: "text-rose-700", ring: "border-rose-300 bg-rose-50/40 ring-2 ring-rose-500/15" },
    violet: { dot: "bg-violet-500", text: "text-violet-700", ring: "border-violet-200" },
    gray: { dot: "bg-gray-400", text: "text-gray-600", ring: "border-gray-200" },
  }[tone];
  return (
    <button className={`w-full text-left rounded-md border ${active ? cfg.ring : "border-gray-200 hover:border-gray-300"} px-2 py-1.5 flex items-center gap-2 transition-colors`}>
      <span className={`w-2 h-2 rounded-full ${cfg.dot} shrink-0`} />
      <div className="flex-1 min-w-0">
        <div className={`text-[11px] font-semibold ${active ? cfg.text : "text-gray-900"}`}>{label}</div>
        <div className="text-[9px] text-gray-500 leading-snug">{detail}</div>
      </div>
      {active && <Check className="w-3 h-3 text-rose-600 shrink-0" strokeWidth={2.5} />}
    </button>
  );
}

function SourceContextPanel() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="text-[10px] uppercase tracking-[0.18em] font-semibold text-gray-500 mb-2 inline-flex items-center gap-1.5">
        <FileText className="w-3 h-3 text-violet-600" strokeWidth={2} />
        Context attached
      </div>
      <ul className="space-y-1">
        <SourceContextRow icon={Calendar} label={`${SESSION.offboarderShort}'s Google calendar`} detail="Last 90 days · auto-pulled" />
        <SourceContextRow icon={MessageSquare} label="On-call Slack channel" detail="#oncall-platform" />
        <SourceContextRow icon={GitBranch} label="Existing rotation doc" detail="Trello · On-Call board (incomplete)" warning />
      </ul>
      <button className="mt-2 w-full text-[10px] text-gray-500 hover:text-violet-700 inline-flex items-center justify-center gap-1 py-1 border border-dashed border-gray-200 rounded hover:border-violet-300 hover:bg-violet-50/40 transition-colors">
        <Plus className="w-2.5 h-2.5" strokeWidth={2} />
        Attach more context
      </button>
    </div>
  );
}

function SourceContextRow({ icon: Icon, label, detail, warning }) {
  return (
    <li className="flex items-center gap-2">
      <Icon className={`w-3 h-3 shrink-0 ${warning ? "text-yellow-700" : "text-gray-500"}`} strokeWidth={2} />
      <div className="flex-1 min-w-0">
        <div className="text-[11px] text-gray-900 truncate">{label}</div>
        <div className={`text-[9px] truncate ${warning ? "text-yellow-700" : "text-gray-500"}`} style={{ fontFamily: MONO_STACK }}>
          {detail}
        </div>
      </div>
      <button className="text-gray-400 hover:text-gray-700 p-0.5"><X className="w-2.5 h-2.5" strokeWidth={2.5} /></button>
    </li>
  );
}

function SendBackImpactNote() {
  return (
    <div className="rounded-xl bg-violet-50/30 border border-violet-200 p-4 mb-4">
      <div className="text-[10px] uppercase tracking-[0.18em] text-violet-700 font-semibold mb-2 inline-flex items-center gap-1.5">
        <Activity className="w-3 h-3" strokeWidth={2} />
        What happens when {SESSION.offboarderShort} answers
      </div>

      <ol className="space-y-2">
        <SendBackImpactStep n={1} title="Item moves to 'Awaiting Minh' group" detail="Stays in your bundle · doesn't block sign-off of the other 13 items" />
        <SendBackImpactStep n={2} title={`${SESSION.offboarderShort} sees the question in his capture queue`} detail="Yellow accent · marked urgent · he gets a push + email notification" />
        <SendBackImpactStep n={3} title="When he answers · returns here as a fresh review item" detail="You'll see his new answer + your original question + the history · ready to accept" />
        <SendBackImpactStep n={4} title="If he can't or won't · you can sign off the rest" detail="After sign-off, this item stays open as a post-handover follow-up" last />
      </ol>
    </div>
  );
}

function SendBackImpactStep({ n, title, detail, last }) {
  return (
    <li className={`flex items-start gap-2.5 ${!last ? "pb-2 border-b border-violet-100" : ""}`}>
      <span className="w-5 h-5 rounded-md bg-white border border-violet-200 flex items-center justify-center shrink-0 text-[10px] font-bold text-violet-700" style={{ fontFamily: MONO_STACK }}>{n}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-semibold text-gray-900">{title}</div>
        <div className="text-[10px] text-gray-600 leading-snug">{detail}</div>
      </div>
    </li>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S6 · flag fix · S7 · summary · S8 · sign-off (sibling files)
   ═══════════════════════════════════════════════════════════════════ */

function S6FlagFix() {
  return (
    <ReviewShell bundleState="flag-fix">
      <S6FlagFixView />
    </ReviewShell>
  );
}

function S7BundleSummary() {
  return (
    <ReviewShell bundleState="bundle-summary">
      <S7BundleSummaryView />
    </ReviewShell>
  );
}

function S8SignOff() {
  return (
    <ReviewShell bundleState="sign-off">
      <S8SignOffView />
    </ReviewShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Shared primitives used by S2/S3/S4/S5
   ═══════════════════════════════════════════════════════════════════ */

function ItemHeader({ n, source, title, subtitle, tagBadge, itemId, status }) {
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
          {status === "editing" && <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-violet-100 border border-violet-300 text-violet-800 inline-flex items-center gap-1"><Edit3 className="w-2.5 h-2.5" strokeWidth={2} />Editing live</span>}
          {status === "sending-back" && <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-yellow-100 border border-yellow-300 text-yellow-800 inline-flex items-center gap-1"><RotateCcw className="w-2.5 h-2.5" strokeWidth={2} />Sending back</span>}
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
      <DiffPane side="raw" title={rawTitle} author={rawAuthor} content={rawContent} />
      <DiffPane side="structured" title={structuredTitle} author={structuredAuthor} content={structuredContent} accepted={structuredAccepted} />
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
        <h3 className="text-[11px] font-semibold text-gray-900">Sources · {sources.length} cited</h3>
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
            {SESSION.corroboratorName.split(" ")[0]} flagged the same grace period in her network question
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
