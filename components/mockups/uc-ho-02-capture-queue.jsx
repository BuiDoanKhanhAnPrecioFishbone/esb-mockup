"use client";

import React, { useState } from "react";
import {
  ChevronLeft, ChevronRight, Sparkles, MessageSquare, Upload, Plus,
  Lock, Eye, KeyRound, Send, Search, Bell, HelpCircle, X,
  ChevronDown, ChevronUp, ArrowUpRight, Check, AlertTriangle,
  AlertOctagon, Info, Tag, Hash, FileText, GitBranch, Folder, Paperclip,
  Calendar, ArrowRight, Maximize2, Clock, BookOpen, Cpu, Award, Bookmark,
  Users, Compass, Filter, History, Flame, Activity, BarChart3, TrendingUp,
  ShieldCheck, FileCheck, Crosshair, Layers, Zap, RotateCcw, Edit3,
  ThumbsUp, ThumbsDown, MoreHorizontal, GitMerge, Settings, Image as ImageIcon,
  FileImage, File, Database, Type, Mic, Smile, ListTodo, Save,
  Hourglass, ChevronsRight, Coffee, Target, CheckCircle2, Circle,
  ArrowDown, Star, Inbox, MailQuestion, ShieldQuestion, Pin, Trash2,
  Volume2
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   UC-HO-02 · Capture · QUEUE · Sprint 2 (POC) · Capture plane

   The POC Capture surface · replaces the deferred voice interview
   (CL-098). The Offboarder answers a unified text question queue at
   their own pace, optionally uploading files. The queue is the union
   of three streams per CL-099:

     · Manager Priority Prompts (UC-HO-05) · violet, Sparkles, attributed to Hà Vy
     · Network questions (UC-HO-08, CL-100) · indigo, Users, attributed to colleague
     · Pre-commit flags (CL-101) · yellow, AlertTriangle, attributed to flagger
     · Own contributions (Offboarder-initiated) · gray, Plus, attributed to self

   Honors:
     · CL-098 Voice deferred · this IS the POC Capture path
     · CL-099 Self-serve upload + async text queue
     · CL-100 Network questions feed the queue
     · CL-101 ACL-bounded flag loop · flagger's reason visible
     · OffboarderShell isolation · no sidebar / no session enum
     · ART-EEP violet/yellow visual system (snapshot §4)

   8 clickable states walk the full Capture lifecycle:

     S1 · Day 3 landing · queue overview · all 4 source kinds visible
     S2 · Answering a Manager Priority Prompt · violet card, context
     S3 · Answering a Network question · attribution to Duy Nguyen
     S4 · Fixing a Pre-commit flag · diff view of contested item
     S5 · Adding own topic · simple form with category chips
     S6 · Self-upload surface · drag-drop + per-file classification
     S7 · Mid-session save state · partial progress · checkpoint
     S8 · Done · contributions summary · handoff to transcript review

   Canonical scenario · Minh Le's 12-day handover · Day 3 · 8 of 14
   inputs pending. Hà Vy is Manager · Tran Huu Nam is successor ·
   Duy Nguyen (Data Platform) and Phuong Anh (Sales) are network
   members who already contributed questions/flags.
   ═══════════════════════════════════════════════════════════════════ */

const FLOW = [
  { id: "s1", uc: "Step 1", label: "Day 3 landing · queue overview",          trigger: "Minh lands at /me/handover/[id]/capture · Day 3 of 12 · 8 of 14 inputs pending · all 4 source kinds visible." },
  { id: "s2", uc: "Step 2", label: "Answering Manager Priority Prompt",        trigger: "Minh tapped Hà Vy's #1 priority · Vendor XYZ SLA penalty clause · text input area with context." },
  { id: "s3", uc: "Step 3", label: "Answering a Network question",             trigger: "Picked Duy Nguyen's question about Cosmos partition rollback · attribution + team context visible." },
  { id: "s4", uc: "Step 4", label: "Fixing a Pre-commit flag",                 trigger: "Tran flagged the AI-collected Atlas rollback summary as wrong · Minh sees the contested item + flagger reason · diff editor." },
  { id: "s5", uc: "Step 5", label: "Adding own topic",                         trigger: "Minh has a 'thing only I know' to capture · adding it as a new topic · category chips help structure." },
  { id: "s6", uc: "Step 6", label: "Self-upload surface",                      trigger: "Minh switched to Upload tab · drag-and-drop zone · 3 staged files · per-file classification preview." },
  { id: "s7", uc: "Step 7", label: "Mid-session save · checkpoint",            trigger: "Minh saved partial progress · checkpoint badge appears · 5 of 14 inputs complete · safe to leave." },
  { id: "s8", uc: "Step 8", label: "Done · handoff to review",                 trigger: "Minh declared 'I'm done' · contributions summary · 14 inputs complete · routes to transcript review (UC-HO-03)." },
];

const SESSION = {
  offboarder: "Minh Lê",
  initials: "ML",
  manager: "Hà Vy",
  managerFirst: "Hà Vy",
  successor: "Trần Hữu Nam",
  flaggerEng: "Trần Hữu Nam",
  flaggerEngInitials: "TN",
  netMember: "Duy Nguyễn",
  netMemberInitials: "DN",
  netMemberTeam: "Data Platform",
  netMember2: "Phương Anh Nguyễn",
  netMember2Initials: "PA",
  netMember2Team: "Sales",
  dayCurrent: 3,
  dayTotal: 12,
  inputsTotal: 14,
  inputsRemaining: 8,
};

export default function UCHO02CaptureQueue() {
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
          <span className="text-gray-900 font-semibold tracking-[0.18em] text-xs" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>ART-EEP</span>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-gray-500 text-xs">UC-HO-02 · POC Capture queue · Offboarder plane</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-gray-500 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
          <span className="uppercase tracking-wider font-semibold text-violet-700">Async self-serve</span>
          <span className="text-gray-300">·</span>
          <span className="text-gray-700" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{step.uc}</span>
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
      className={`w-7 h-7 rounded-md border text-[11px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${
        active ? "bg-violet-600 text-white border-violet-600" : "bg-white text-violet-700 border-violet-200 hover:border-violet-400"
      }`}
      style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
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
        className={`h-7 px-3 rounded-md text-xs font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${
          atFirst ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <ChevronLeft className="w-3 h-3" />
        Previous
      </button>
      <div className="hidden sm:block text-[10px] text-gray-500 max-w-md text-center truncate px-3">
        Dev chrome · this strip is NOT shown to {SESSION.offboarder}. The real surface is below.
      </div>
      <button
        onClick={() => !atLast && onChange(stepIdx + 1)}
        disabled={atLast}
        className={`h-7 px-3 rounded-md text-xs font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30 ${
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
  if (id === "s1") return <S1Landing />;
  if (id === "s2") return <S2ManagerPriority />;
  if (id === "s3") return <S3NetworkQuestion />;
  if (id === "s4") return <S4FlagFix />;
  if (id === "s5") return <S5AddOwn />;
  if (id === "s6") return <S6Upload />;
  if (id === "s7") return <S7MidSave />;
  if (id === "s8") return <S8Done />;
  return null;
}

/* ═══════════════════════════════════════════════════════════════════
   OffboarderShell · stripped chrome · async-capture variant
   No Pause/End · instead Save & continue later / I'm done
   ═══════════════════════════════════════════════════════════════════ */

function OffboarderShell({ children, activeTab = "queue", showImDone, hideTabs }) {
  return (
    <div className="flex flex-col flex-1 min-h-[820px]">
      <header className="px-6 h-14 flex items-center justify-between border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 bg-violet-500 rounded-full" />
          <span className="text-gray-900 font-semibold tracking-[0.18em] text-[11px]" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>ART-EEP</span>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-xs text-gray-700">{SESSION.offboarder}'s handover</span>
          <DayPill />
        </div>
        <div className="flex items-center gap-1.5">
          <SaveIndicator />
          <span className="w-px h-5 bg-gray-200 mx-1" />
          <button className="h-8 px-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-50 text-xs font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
            <HelpCircle className="w-3.5 h-3.5" strokeWidth={1.75} />
            Help
          </button>
          <button className="h-8 px-3 rounded-md border border-gray-200 bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-50 text-xs font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
            <Save className="w-3 h-3" strokeWidth={2} />
            Save · continue later
          </button>
          {showImDone && (
            <button className="h-8 px-3 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
              <Check className="w-3 h-3" strokeWidth={2.5} />
              I'm done
            </button>
          )}
          <span className="w-px h-5 bg-gray-200 mx-1" />
          <div className="w-8 h-8 rounded-full bg-violet-50 border border-violet-200 flex items-center justify-center shrink-0" title={SESSION.offboarder}>
            <span className="text-[10px] font-semibold text-violet-700">{SESSION.initials}</span>
          </div>
        </div>
      </header>
      {!hideTabs && <TabBar active={activeTab} />}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}

function DayPill() {
  return (
    <span className="ml-2 inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold bg-violet-50 border border-violet-200 text-violet-800">
      <Calendar className="w-2.5 h-2.5" strokeWidth={2} />
      Day {SESSION.dayCurrent} of {SESSION.dayTotal}
    </span>
  );
}

function SaveIndicator() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-gray-500">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      <span>Auto-saved · just now</span>
    </span>
  );
}

function TabBar({ active }) {
  return (
    <div className="px-6 h-11 flex items-end gap-1 border-b border-gray-100 shrink-0">
      <TabButton id="queue" active={active === "queue"} count={SESSION.inputsRemaining} icon={Inbox} label="Question queue" />
      <TabButton id="upload" active={active === "upload"} icon={Upload} label="Upload files" />
      <TabButton id="add-own" active={active === "add-own"} icon={Plus} label="Add your own topic" />
      <div className="flex-1" />
      <button className="h-8 px-2.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-50 text-[11px] inline-flex items-center gap-1 transition-colors mb-1.5">
        <Filter className="w-3 h-3" strokeWidth={1.75} />
        Filter
      </button>
      <button className="h-8 px-2.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-50 text-[11px] inline-flex items-center gap-1 transition-colors mb-1.5">
        <BarChart3 className="w-3 h-3" strokeWidth={1.75} />
        Progress
      </button>
    </div>
  );
}

function TabButton({ id, active, count, icon: Icon, label }) {
  return (
    <button className={`h-10 px-3.5 -mb-px text-[12px] font-medium inline-flex items-center gap-2 border-b-2 transition-colors focus:outline-none ${
      active ? "border-violet-600 text-violet-700" : "border-transparent text-gray-500 hover:text-gray-900"
    }`}>
      <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
      {label}
      {count !== undefined && count > 0 && (
        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${active ? "bg-violet-100 text-violet-800" : "bg-gray-100 text-gray-600"}`} style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
          {count}
        </span>
      )}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S1 · Day 3 landing · queue overview · all 4 source kinds visible
   ═══════════════════════════════════════════════════════════════════ */

function S1Landing() {
  return (
    <OffboarderShell activeTab="queue">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[860px] mx-auto px-6 py-6">
          <ProgressHeader complete={6} total={SESSION.inputsTotal} />
          <SectionDivider label="Most important · attend first" />
          <div className="space-y-3">
            <QueueItem
              kind="manager-priority"
              rank={1}
              title="Vendor XYZ renewal · the SLA penalty clause"
              author={SESSION.manager}
              authorRole="Manager"
              authorInitials="HV"
              authorTone="violet"
              body={`What's the exact penalty clause you negotiated, and is there a verbal commitment from the vendor that isn't in the contract? Anything that would surprise ${SESSION.successor} during the renewal.`}
              meta={[{ icon: Clock, label: "Added 2 days ago" }, { icon: Flame, label: "Critical · Tran's renewal call in 9 days" }]}
              cta="Answer this"
            />
            <QueueItem
              kind="manager-priority"
              rank={2}
              title="Payment Gateway timeout · the undocumented fix"
              author={SESSION.manager}
              authorRole="Manager"
              authorInitials="HV"
              authorTone="violet"
              body="The 4 incidents in 6 months suggest there's a fix you've been doing that isn't documented. Walk us through it · step by step, including what someone less senior would miss."
              meta={[{ icon: Clock, label: "Added 2 days ago" }]}
              cta="Answer this"
            />
            <QueueItem
              kind="flag"
              title="Atlas rollback summary · flagged as wrong"
              author={SESSION.flaggerEng}
              authorRole="Successor"
              authorInitials={SESSION.flaggerEngInitials}
              authorTone="yellow"
              body={`Tran says the AI's summary missed the staging-first rule. The AI version says "deploy → snapshot → verify" but Tran knows from talking to you that staging is mandatory. Can you fix the summary or confirm the AI is right?`}
              meta={[{ icon: Clock, label: "Flagged 4 hours ago" }, { icon: AlertTriangle, label: "Pre-commit · won't reach KG until fixed" }]}
              cta="Review the flag"
            />
          </div>

          <SectionDivider label="From your network · 3 questions" sublabel={`People who worked with you submitted these via UC-HO-08`} />
          <div className="space-y-3">
            <QueueItem
              kind="network"
              title="Cosmos partition rollback · what does Atlas miss?"
              author={SESSION.netMember}
              authorRole={SESSION.netMemberTeam}
              authorInitials={SESSION.netMemberInitials}
              authorTone="indigo"
              body="Hey Minh · my team owns Cosmos. When Atlas rollback fails partway, we sometimes have to clean up partition state manually. Is there a heuristic you used to decide when a manual clean-up is needed vs when retry-from-snapshot is enough?"
              meta={[{ icon: Clock, label: "Submitted yesterday" }, { icon: Users, label: `Co-assignee on 14 Trello cards with you` }]}
              cta="Answer Duy"
            />
            <QueueItem
              kind="network"
              title="Vendor XYZ · the late-payment grace period story"
              author={SESSION.netMember2}
              authorRole={SESSION.netMember2Team}
              authorInitials={SESSION.netMember2Initials}
              authorTone="indigo"
              body="From my Sales team's view, we have a 5-business-day grace on the penalty clause that I think you negotiated verbally. The contract doesn't show it explicitly · could you confirm and document the back-and-forth?"
              meta={[{ icon: Clock, label: "Submitted 2 days ago" }]}
              cta="Answer Phuong Anh"
            />
            <QueueItem
              kind="network"
              title="On-call escalation · who covers the 2am Saturday slot?"
              author={SESSION.netMember}
              authorRole={SESSION.netMemberTeam}
              authorInitials={SESSION.netMemberInitials}
              authorTone="indigo"
              body="I noticed in your calendar that you covered the 2am Saturday slot pretty often. Who's been doing that when you're not? Want to make sure Tran knows."
              meta={[{ icon: Clock, label: "Submitted 3 hours ago" }]}
              cta="Answer Duy"
            />
          </div>

          <SectionDivider label="Things you added yourself · 2 topics" sublabel="Your own contributions · keep adding as you remember things" />
          <div className="space-y-3">
            <QueueItem
              kind="own"
              title="The Friday-deploy team rule (since INC-2942)"
              author="You"
              authorRole="Own"
              authorInitials={SESSION.initials}
              authorTone="gray"
              body="Note to self · captured this on Day 1. The team agreement after the Q3 outage was 'no Atlas deploys on Friday.' Not company policy. Worth documenting for Tran."
              meta={[{ icon: Check, label: "Drafted Day 1 · 142 words" }]}
              cta="Continue editing"
              status="draft"
            />
            <QueueItem
              kind="own"
              title="Khanh Linh's escalation preference"
              author="You"
              authorRole="Own"
              authorInitials={SESSION.initials}
              authorTone="gray"
              body="Empty draft · add later."
              meta={[{ icon: Edit3, label: "Empty draft" }]}
              cta="Start writing"
              status="empty"
            />
          </div>

          <div className="mt-8 pt-5 border-t border-gray-100">
            <button className="h-9 px-4 rounded-md border border-dashed border-gray-300 bg-white text-gray-700 text-sm font-medium inline-flex items-center gap-2 hover:border-violet-400 hover:text-violet-700 hover:bg-violet-50/40 transition-colors w-full justify-center">
              <Plus className="w-4 h-4" strokeWidth={2} />
              Add another topic you want to capture
            </button>
          </div>
        </div>
      </div>
    </OffboarderShell>
  );
}

function ProgressHeader({ complete, total }) {
  const pct = (complete / total) * 100;
  return (
    <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-yellow-50/30 border border-violet-200 p-5 mb-6">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-[0.18em] text-violet-700 font-semibold inline-flex items-center gap-1">
              <Coffee className="w-3 h-3" strokeWidth={2} />
              Day {SESSION.dayCurrent} of {SESSION.dayTotal}
            </span>
            <span className="text-gray-300">·</span>
            <span className="text-[10px] text-gray-600">9 working days left before your last day</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight leading-tight">
            <span className="text-violet-700">{complete}</span> of <span style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{total}</span> inputs captured
          </h1>
          <p className="text-[12px] text-gray-600 mt-1 leading-relaxed">
            Take it at your own pace · {SESSION.successor} can start reading what you've already written. Save anytime · come back when you're ready.
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-3xl font-extrabold text-violet-700 tracking-tight leading-none" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{Math.round(pct)}%</div>
          <div className="text-[10px] text-gray-500 mt-1">complete</div>
        </div>
      </div>

      <div className="h-2 rounded-full bg-white border border-gray-200 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-violet-500 to-violet-600 rounded-full" style={{ width: `${pct}%` }} />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-[10px] flex-wrap">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-violet-700">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            <span className="font-semibold">2</span> manager priorities pending
          </span>
          <span className="inline-flex items-center gap-1 text-indigo-700">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span className="font-semibold">3</span> network questions
          </span>
          <span className="inline-flex items-center gap-1 text-yellow-700">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
            <span className="font-semibold">1</span> flag to fix
          </span>
          <span className="inline-flex items-center gap-1 text-gray-600">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            <span className="font-semibold">2</span> drafts of your own
          </span>
        </div>
      </div>
    </div>
  );
}

function SectionDivider({ label, sublabel }) {
  return (
    <div className="mt-7 mb-4 first:mt-0">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold text-gray-900 tracking-tight">{label}</h2>
        {sublabel && <span className="text-[10px] text-gray-500">{sublabel}</span>}
      </div>
      <div className="h-px bg-gradient-to-r from-gray-200 via-gray-100 to-transparent mt-2" />
    </div>
  );
}

function QueueItem({ kind, rank, title, author, authorRole, authorInitials, authorTone, body, meta, cta, status }) {
  const cfg = {
    "manager-priority": { ring: "border-violet-200 hover:border-violet-400", accent: "bg-violet-50/30", eyebrow: "Manager priority", eyebrowCls: "text-violet-700 bg-violet-100/60 border-violet-200", icon: Sparkles },
    "network": { ring: "border-indigo-200 hover:border-indigo-400", accent: "bg-indigo-50/30", eyebrow: `Network question · ${authorRole}`, eyebrowCls: "text-indigo-700 bg-indigo-100/60 border-indigo-200", icon: Users },
    "flag": { ring: "border-yellow-200 hover:border-yellow-400", accent: "bg-yellow-50/30", eyebrow: "Pre-commit flag · review needed", eyebrowCls: "text-yellow-800 bg-yellow-100/60 border-yellow-300", icon: AlertTriangle },
    "own": { ring: "border-gray-200 hover:border-gray-400", accent: "bg-gray-50/30", eyebrow: "Your contribution", eyebrowCls: "text-gray-700 bg-gray-100 border-gray-200", icon: Plus },
  }[kind];

  const avatarTone = {
    violet: "bg-violet-50 border-violet-200 text-violet-700",
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    gray: "bg-gray-100 border-gray-200 text-gray-700",
  }[authorTone];

  const EyebrowIcon = cfg.icon;
  const statusBadge = {
    draft: { label: "Draft saved", cls: "bg-yellow-50 border-yellow-200 text-yellow-700" },
    empty: { label: "Not started", cls: "bg-gray-100 border-gray-200 text-gray-500" },
  }[status];

  return (
    <article className={`rounded-xl border ${cfg.ring} bg-white transition-colors`}>
      <div className={`px-4 py-3 ${cfg.accent} border-b border-gray-100 rounded-t-xl flex items-center gap-2.5 flex-wrap`}>
        <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-semibold border ${cfg.eyebrowCls}`}>
          <EyebrowIcon className="w-2.5 h-2.5" strokeWidth={2.5} />
          {cfg.eyebrow}
          {rank && <span className="ml-1 font-bold">#{rank}</span>}
        </span>
        <span className="text-gray-300">·</span>
        <div className="inline-flex items-center gap-1.5">
          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${avatarTone}`}>
            <span className="text-[9px] font-semibold">{authorInitials}</span>
          </div>
          <span className="text-[11px] text-gray-700 font-medium">{author}</span>
        </div>
        {statusBadge && (
          <span className={`ml-auto inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold border ${statusBadge.cls}`}>
            {statusBadge.label}
          </span>
        )}
      </div>

      <div className="px-4 py-3.5">
        <h3 className="text-[14px] font-semibold text-gray-900 leading-snug tracking-tight">{title}</h3>
        <p className="text-[12px] text-gray-600 leading-relaxed mt-1.5">{body}</p>

        <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 text-[10px] text-gray-500">
            {meta.map((m, i) => {
              const MetaIcon = m.icon;
              return (
                <span key={i} className="inline-flex items-center gap-1">
                  <MetaIcon className="w-2.5 h-2.5" strokeWidth={2} />
                  {m.label}
                </span>
              );
            })}
          </div>
          <button className={`h-7 px-3 rounded-md text-[11px] font-semibold inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 ${
            kind === "manager-priority" ? "bg-violet-600 hover:bg-violet-700 text-white focus:ring-violet-500/30" :
            kind === "network" ? "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500/30" :
            kind === "flag" ? "bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500/30" :
            "bg-gray-900 hover:bg-gray-800 text-white focus:ring-gray-500/30"
          }`}>
            {cta}
            <ChevronRight className="w-3 h-3" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S2 · Answering a Manager Priority Prompt
   ═══════════════════════════════════════════════════════════════════ */

function S2ManagerPriority() {
  return (
    <OffboarderShell activeTab="queue">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[860px] mx-auto px-6 py-6">
          <Breadcrumb items={["Question queue", "Manager priorities", "#1 · Vendor XYZ SLA penalty clause"]} />

          <AnswerCard
            kind="manager-priority"
            eyebrow="Manager priority · #1 of 2"
            title="Vendor XYZ renewal · the SLA penalty clause"
            author={SESSION.manager}
            authorRole="Manager"
            authorInitials="HV"
            authorTone="violet"
            context={`What's the exact penalty clause you negotiated, and is there a verbal commitment from the vendor that isn't in the contract? Anything that would surprise ${SESSION.successor} during the renewal.`}
            contextMeta="Added 2 days ago · Critical priority (Tran's renewal call in 9 days)"
            relatedHint="3 related sources have been auto-attached for context · review below"
            answer={
              <>
                The contract specifies a <strong>2% penalty on the next quarter's invoice</strong> if we miss the SLA more than once per quarter. But what's NOT in the contract is the <strong>5-business-day grace period</strong> their account manager (Linh at XYZ) verbally committed to last March{`—`}she told us during the renewal call that any single miss within 5 business days of resolution doesn't trigger the penalty clock.
              </>
            }
            attachments={[
              { icon: FileText, label: "Vendor XYZ contract v2.1.pdf", source: "SharePoint · Vendor-Contracts" },
              { icon: MessageSquare, label: "March 14 renewal call notes", source: "Trello · Vendor-Mgmt board" },
              { icon: Volume2, label: "Snippet · Linh confirming the grace period (0:42)", source: "Voicemail · personal" },
            ]}
          />
        </div>
      </div>
    </OffboarderShell>
  );
}

function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-4 overflow-x-auto">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />}
          <span className={i === items.length - 1 ? "text-gray-900 font-medium truncate" : "hover:text-gray-700 cursor-pointer shrink-0"}>{item}</span>
        </React.Fragment>
      ))}
    </nav>
  );
}

function AnswerCard({ kind, eyebrow, title, author, authorRole, authorInitials, authorTone, context, contextMeta, relatedHint, answer, attachments }) {
  const cfg = {
    "manager-priority": { ring: "border-violet-200", accent: "bg-violet-50/30 border-violet-100", eyebrowCls: "text-violet-700 bg-violet-100/60 border-violet-200", icon: Sparkles, focusRing: "focus-within:ring-violet-500/30 focus-within:border-violet-500", primaryBg: "bg-violet-600 hover:bg-violet-700" },
    "network": { ring: "border-indigo-200", accent: "bg-indigo-50/30 border-indigo-100", eyebrowCls: "text-indigo-700 bg-indigo-100/60 border-indigo-200", icon: Users, focusRing: "focus-within:ring-indigo-500/30 focus-within:border-indigo-500", primaryBg: "bg-indigo-600 hover:bg-indigo-700" },
  }[kind];

  const avatarTone = {
    violet: "bg-violet-50 border-violet-200 text-violet-700",
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
  }[authorTone];

  const EyebrowIcon = cfg.icon;

  return (
    <div className={`rounded-2xl border ${cfg.ring} bg-white overflow-hidden shadow-sm`}>
      <div className={`px-5 py-4 ${cfg.accent} border-b`}>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-semibold border ${cfg.eyebrowCls}`}>
            <EyebrowIcon className="w-2.5 h-2.5" strokeWidth={2.5} />
            {eyebrow}
          </span>
        </div>
        <h1 className="text-xl font-semibold text-gray-900 leading-snug tracking-tight">{title}</h1>
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1.5">
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${avatarTone}`}>
              <span className="text-[10px] font-semibold">{authorInitials}</span>
            </div>
            <span className="text-[11px] text-gray-700 font-medium">{author}</span>
            <span className="text-[10px] text-gray-500">· {authorRole}</span>
          </div>
        </div>
        <blockquote className="mt-3 text-[13px] text-gray-700 leading-relaxed italic border-l-2 border-violet-300 pl-3">
          "{context}"
        </blockquote>
        <div className="mt-2 text-[10px] text-gray-500">{contextMeta}</div>
      </div>

      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between gap-2 mb-2">
          <label className="text-[11px] font-semibold text-gray-900 inline-flex items-center gap-1.5">
            <Edit3 className="w-3 h-3" strokeWidth={2} />
            Your answer
          </label>
          <div className="flex items-center gap-2 text-[10px] text-gray-500">
            <span style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>~ 320 words · 2 min</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 text-emerald-700"><Save className="w-2.5 h-2.5" strokeWidth={2} /> Auto-saved</span>
          </div>
        </div>

        <div className={`rounded-lg border border-gray-300 bg-white transition-all ${cfg.focusRing} focus-within:ring-2`}>
          <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-1 bg-gray-50/50">
            <ToolbarButton icon={Type} label="B" />
            <ToolbarButton icon={Type} label="i" italic />
            <span className="w-px h-4 bg-gray-200 mx-1" />
            <ToolbarButton icon={ListTodo} label="" />
            <ToolbarButton icon={Hash} label="" />
            <span className="w-px h-4 bg-gray-200 mx-1" />
            <ToolbarButton icon={Paperclip} label="Attach" />
            <ToolbarButton icon={Mic} label="Dictate" />
            <div className="flex-1" />
            <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>1,847 / 5,000</span>
          </div>
          <div className="px-3 py-3 text-[13px] text-gray-800 leading-relaxed min-h-[200px]">
            <p>{answer}</p>
            <p className="mt-3">The verbal commitment came after a Q3 incident where we missed an SLA by 4 hours due to their infrastructure issue, not ours. Linh acknowledged it wasn't our fault and offered the grace period <em>"for situations like this"</em>—I have it in a voicemail from March 14 (attached below).</p>
            <p className="mt-3 text-gray-500"><em>...continue writing</em></p>
          </div>
        </div>

        {relatedHint && (
          <div className="mt-3 rounded-lg bg-violet-50/40 border border-violet-100 px-3 py-2 flex items-start gap-2">
            <Sparkles className="w-3 h-3 text-violet-600 shrink-0 mt-0.5" strokeWidth={2} />
            <p className="text-[10px] text-violet-900/80 leading-relaxed">{relatedHint}</p>
          </div>
        )}
      </div>

      <div className="px-5 py-4 border-b border-gray-100">
        <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-semibold mb-2">Attached for context</div>
        <div className="space-y-1.5">
          {attachments.map((a, i) => (
            <AttachmentRow key={i} {...a} />
          ))}
          <button className="w-full text-[11px] text-gray-500 hover:text-violet-700 inline-flex items-center justify-center gap-1.5 py-1.5 border border-dashed border-gray-300 rounded-md hover:border-violet-400 hover:bg-violet-50/40 transition-colors">
            <Plus className="w-3 h-3" strokeWidth={2} />
            Attach another file or link
          </button>
        </div>
      </div>

      <div className="px-5 py-3 bg-gray-50/50 flex items-center justify-between gap-3 flex-wrap">
        <div className="text-[11px] text-gray-500 inline-flex items-center gap-1.5">
          <Info className="w-3 h-3" strokeWidth={2} />
          Your answer will be reviewed before it reaches the Knowledge Graph · you can edit it again during transcript review (UC-HO-03).
        </div>
        <div className="flex items-center gap-2">
          <button className="h-8 px-3 rounded-md text-gray-600 hover:text-gray-900 text-[12px] font-medium transition-colors">Save draft</button>
          <button className={`h-8 px-4 rounded-md ${cfg.primaryBg} text-white text-[12px] font-semibold inline-flex items-center gap-1.5 transition-colors`}>
            <Check className="w-3 h-3" strokeWidth={2.5} />
            Submit answer
          </button>
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({ icon: Icon, label, italic }) {
  return (
    <button className="h-6 px-1.5 rounded text-gray-500 hover:bg-gray-200 hover:text-gray-900 text-[11px] font-medium inline-flex items-center gap-1 transition-colors">
      <Icon className="w-3 h-3" strokeWidth={1.75} />
      {label && <span className={italic ? "italic" : ""}>{label}</span>}
    </button>
  );
}

function AttachmentRow({ icon: Icon, label, source }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-1.5 flex items-center gap-2.5 hover:border-gray-300 transition-colors">
      <Icon className="w-3.5 h-3.5 text-gray-500 shrink-0" strokeWidth={1.75} />
      <div className="flex-1 min-w-0">
        <div className="text-[11px] text-gray-900 font-medium truncate">{label}</div>
        <div className="text-[9px] text-gray-500 truncate" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{source}</div>
      </div>
      <button className="p-1 text-gray-400 hover:text-gray-700"><MoreHorizontal className="w-3 h-3" /></button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S3 · Answering a Network question
   ═══════════════════════════════════════════════════════════════════ */

function S3NetworkQuestion() {
  return (
    <OffboarderShell activeTab="queue">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[860px] mx-auto px-6 py-6">
          <Breadcrumb items={["Question queue", "Network questions", `Duy Nguyễn · Cosmos partition rollback`]} />

          <div className="rounded-2xl border border-indigo-200 bg-white overflow-hidden shadow-sm">
            <div className="px-5 py-4 bg-indigo-50/30 border-b border-indigo-100">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-semibold border bg-indigo-100/60 border-indigo-200 text-indigo-700">
                  <Users className="w-2.5 h-2.5" strokeWidth={2.5} />
                  Network question · co-assignee
                </span>
                <span className="text-[10px] text-gray-500">UC-HO-08 · auto-derived from Trello co-assignments</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 leading-snug tracking-tight">Cosmos partition rollback · what does Atlas miss?</h1>

              <div className="mt-3 rounded-lg bg-white border border-indigo-100 px-3 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                    <span className="text-[10px] font-semibold text-indigo-700">{SESSION.netMemberInitials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-semibold text-gray-900">{SESSION.netMember}</div>
                    <div className="text-[10px] text-gray-500">Senior SRE · {SESSION.netMemberTeam} team</div>
                  </div>
                  <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>Submitted yesterday</span>
                </div>
                <p className="text-[13px] text-gray-700 leading-relaxed italic">
                  "Hey Minh · my team owns Cosmos. When Atlas rollback fails partway, we sometimes have to clean up partition state manually. Is there a heuristic you used to decide when a manual clean-up is needed vs when retry-from-snapshot is enough?"
                </p>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-[10px]">
                <NetworkContextTile label="Co-assigned cards" value="14" sublabel="On Trello · last 6 months" />
                <NetworkContextTile label="Shared incidents" value="3" sublabel="INC-2942 · INC-2731 · INC-2598" />
                <NetworkContextTile label="Last conversation" value="2 weeks ago" sublabel="Slack #data-platform-eng" />
              </div>
            </div>

            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between gap-2 mb-2">
                <label className="text-[11px] font-semibold text-gray-900 inline-flex items-center gap-1.5">
                  <Edit3 className="w-3 h-3" strokeWidth={2} />
                  Your answer · Duy will be notified when you submit
                </label>
                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                  <span className="inline-flex items-center gap-1 text-emerald-700"><Save className="w-2.5 h-2.5" strokeWidth={2} /> Auto-saved · 2s ago</span>
                </div>
              </div>

              <div className="rounded-lg border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-500">
                <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-1 bg-gray-50/50">
                  <ToolbarButton icon={Type} label="B" />
                  <ToolbarButton icon={Type} label="i" italic />
                  <span className="w-px h-4 bg-gray-200 mx-1" />
                  <ToolbarButton icon={ListTodo} label="" />
                  <ToolbarButton icon={Paperclip} label="Attach" />
                  <div className="flex-1" />
                  <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>980 / 5,000</span>
                </div>
                <div className="px-3 py-3 text-[13px] text-gray-800 leading-relaxed min-h-[180px]">
                  <p>Great question Duy · the heuristic is actually pretty simple but isn't written down anywhere. <strong>Manual clean-up is needed if the rollback failed after the migration playbook started writing to staging.</strong> If the failure happened before that point, retry-from-snapshot is safe because nothing got written yet.</p>
                  <p className="mt-3">The signal I use is the <code style={{ fontFamily: "ui-monospace, Menlo, monospace" }} className="text-[12px] bg-gray-100 px-1 rounded">migration_id</code> in Datadog · if it's been emitted, you need clean-up; if not, retry. The runbook should mention this but currently doesn't · adding it to my list of things to fix this week.</p>
                  <p className="mt-3 text-gray-500"><em>...continue writing</em></p>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 bg-gray-50/50 flex items-center justify-between gap-3 flex-wrap">
              <div className="text-[11px] text-gray-500 inline-flex items-center gap-1.5">
                <Info className="w-3 h-3" strokeWidth={2} />
                Your answer will go to Duy directly + feed into the knowledge graph for {SESSION.successor}.
              </div>
              <div className="flex items-center gap-2">
                <button className="h-8 px-3 rounded-md text-gray-600 hover:text-gray-900 text-[12px] font-medium transition-colors">Skip this one</button>
                <button className="h-8 px-3 rounded-md text-gray-600 hover:text-gray-900 text-[12px] font-medium transition-colors">Save draft</button>
                <button className="h-8 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-semibold inline-flex items-center gap-1.5 transition-colors">
                  <Send className="w-3 h-3" strokeWidth={2.5} />
                  Submit answer
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-indigo-50/30 border border-indigo-100 p-3 flex items-start gap-2.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-700 shrink-0 mt-0.5" strokeWidth={2} />
            <div className="text-[11px] text-indigo-900/80 leading-relaxed">
              <strong>Why Duy could ask this · ACL-bounded.</strong> Duy was a co-assignee on 14 Trello cards related to Cosmos. UC-HO-08 only lets network members ask about content they already had access to (CL-101). The question feature never grants net-new visibility.
            </div>
          </div>
        </div>
      </div>
    </OffboarderShell>
  );
}

function NetworkContextTile({ label, value, sublabel }) {
  return (
    <div className="rounded-md bg-white border border-indigo-100 px-2.5 py-2">
      <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">{label}</div>
      <div className="text-sm font-bold text-gray-900 mt-0.5" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{value}</div>
      <div className="text-[9px] text-gray-500 leading-snug mt-0.5">{sublabel}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S4 · Fixing a Pre-commit flag · diff view of contested item
   ═══════════════════════════════════════════════════════════════════ */

function S4FlagFix() {
  return (
    <OffboarderShell activeTab="queue">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[860px] mx-auto px-6 py-6">
          <Breadcrumb items={["Question queue", "Pre-commit flags", "Atlas rollback summary"]} />

          <div className="rounded-2xl border-2 border-yellow-300 bg-white overflow-hidden shadow-sm">
            {/* Top header */}
            <div className="px-5 py-4 bg-yellow-50/40 border-b border-yellow-200">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-semibold border bg-yellow-100/60 border-yellow-300 text-yellow-800">
                  <AlertTriangle className="w-2.5 h-2.5" strokeWidth={2.5} />
                  Pre-commit flag · review needed
                </span>
                <span className="text-[10px] text-yellow-800/80">CL-101 · ACL-bounded · won't reach KG until you decide</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 leading-snug tracking-tight">Atlas rollback summary · flagged by {SESSION.flaggerEng}</h1>

              <div className="mt-3 rounded-lg bg-white border border-yellow-200 px-3 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center">
                    <span className="text-[10px] font-semibold text-yellow-700">{SESSION.flaggerEngInitials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-semibold text-gray-900">{SESSION.flaggerEng}</div>
                    <div className="text-[10px] text-gray-500">Your successor · Engineering · Platform</div>
                  </div>
                  <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>4 hours ago</span>
                </div>
                <p className="text-[13px] text-gray-700 leading-relaxed italic">
                  "Minh · the AI summarized your Atlas rollback as 'deploy → snapshot → verify' but from our conversation last week, I'm pretty sure the order is the opposite, AND the staging step is mandatory. Can you fix the summary? I don't want to read the wrong thing all week."
                </p>
              </div>
            </div>

            {/* Diff view · what AI captured vs what was actually said */}
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-semibold mb-3 inline-flex items-center gap-1.5">
                <GitBranch className="w-3 h-3" strokeWidth={2} />
                What the AI captured vs Tran's understanding
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-lg border-2 border-rose-200 bg-rose-50/30 overflow-hidden">
                  <div className="px-3 py-2 border-b border-rose-200 flex items-center gap-2">
                    <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-rose-100 border border-rose-200 text-rose-700">AI captured</span>
                    <span className="text-[10px] text-gray-500">From Day 1 Trello scrape</span>
                  </div>
                  <div className="px-3 py-3 text-[13px] text-gray-700 leading-relaxed">
                    <p className="mb-1.5"><strong>Atlas rollback procedure:</strong></p>
                    <ol className="list-decimal pl-5 space-y-0.5">
                      <li>Deploy the rollback package to production</li>
                      <li>Take a snapshot of Cosmos partition <code style={{ fontFamily: "ui-monospace, Menlo, monospace" }} className="text-[12px] bg-rose-100/60 px-1 rounded">order</code></li>
                      <li>Verify schema integrity</li>
                    </ol>
                  </div>
                </div>

                <div className="rounded-lg border-2 border-emerald-200 bg-emerald-50/30 overflow-hidden">
                  <div className="px-3 py-2 border-b border-emerald-200 flex items-center gap-2">
                    <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700">Tran's version</span>
                    <span className="text-[10px] text-gray-500">From your conversation last week</span>
                  </div>
                  <div className="px-3 py-3 text-[13px] text-gray-700 leading-relaxed">
                    <p className="mb-1.5"><strong>Atlas rollback procedure:</strong></p>
                    <ol className="list-decimal pl-5 space-y-0.5">
                      <li>Take a snapshot of Cosmos partition first</li>
                      <li>Run migration playbook against <strong>staging</strong></li>
                      <li>Promote to production only after staging verifies</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* What Minh should do · 3 actions */}
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-semibold mb-3 inline-flex items-center gap-1.5">
                <Target className="w-3 h-3" strokeWidth={2} />
                What you can do · pick one
              </div>

              <div className="space-y-2">
                <ActionOption
                  icon={Edit3}
                  label="Write a corrected version"
                  detail="Replace the AI's summary with your own canonical version. Tran's version will be used as a starting point."
                  recommended
                />
                <ActionOption
                  icon={Check}
                  label="Tran is right · use his version"
                  detail="One-click accept. Tran's summary becomes the canonical entry."
                />
                <ActionOption
                  icon={ThumbsDown}
                  label="The AI was right · dismiss the flag"
                  detail={`We'll let Tran know with a one-line explanation from you (required so he understands why).`}
                />
              </div>
            </div>

            {/* Writing area · pre-populated with Tran's version */}
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="text-[11px] font-semibold text-gray-900 mb-2 inline-flex items-center gap-1.5">
                <Edit3 className="w-3 h-3" strokeWidth={2} />
                Your corrected version
              </div>
              <div className="rounded-lg border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-yellow-500/30 focus-within:border-yellow-500">
                <div className="px-3 py-3 text-[13px] text-gray-800 leading-relaxed min-h-[140px]">
                  <p><strong>Atlas rollback procedure:</strong></p>
                  <ol className="list-decimal pl-5 mt-1.5 space-y-1">
                    <li>Snapshot the Cosmos partition keyed by <code style={{ fontFamily: "ui-monospace, Menlo, monospace" }} className="text-[12px] bg-gray-100 px-1 rounded">org</code>.</li>
                    <li>Run the migration playbook against <strong>staging first</strong> — never production directly. The wiki v2.3 is wrong about this.</li>
                    <li>Verify schema integrity in staging, then promote to production.</li>
                  </ol>
                  <p className="mt-3 text-gray-500"><em>...add anything else</em></p>
                </div>
              </div>

              <div className="mt-3 rounded-lg bg-yellow-50/40 border border-yellow-100 px-3 py-2 flex items-start gap-2">
                <Info className="w-3 h-3 text-yellow-700 shrink-0 mt-0.5" strokeWidth={2} />
                <p className="text-[10px] text-yellow-900/80 leading-relaxed">
                  <strong>This becomes a Canonical Fact</strong> after Hà Vy reviews it (QA-INT-01 §1.4 commit gate). The flag stays visible to all readers until the new version is approved.
                </p>
              </div>
            </div>

            <div className="px-5 py-3 bg-gray-50/50 flex items-center justify-between gap-3 flex-wrap">
              <div className="text-[11px] text-gray-500 inline-flex items-center gap-1.5">
                <History className="w-3 h-3" strokeWidth={2} />
                Tran + Hà Vy + Knowledge Graph audit log will all see this decision.
              </div>
              <div className="flex items-center gap-2">
                <button className="h-8 px-3 rounded-md text-gray-600 hover:text-gray-900 text-[12px] font-medium">Save draft</button>
                <button className="h-8 px-4 rounded-md bg-yellow-600 hover:bg-yellow-700 text-white text-[12px] font-semibold inline-flex items-center gap-1.5 transition-colors">
                  <ShieldCheck className="w-3 h-3" strokeWidth={2.5} />
                  Submit correction for Hà Vy's review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OffboarderShell>
  );
}

function ActionOption({ icon: Icon, label, detail, recommended }) {
  return (
    <button className={`w-full text-left rounded-lg border ${recommended ? "border-yellow-300 bg-yellow-50/40" : "border-gray-200 bg-white hover:border-gray-300"} px-3 py-2.5 flex items-start gap-3 transition-colors`}>
      <div className={`w-7 h-7 rounded-lg ${recommended ? "bg-yellow-100 border-yellow-200" : "bg-gray-50 border-gray-200"} border flex items-center justify-center shrink-0`}>
        <Icon className={`w-3.5 h-3.5 ${recommended ? "text-yellow-700" : "text-gray-600"}`} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[12px] font-semibold text-gray-900">{label}</span>
          {recommended && <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-yellow-600 text-white">Recommended</span>}
        </div>
        <div className="text-[10px] text-gray-600 mt-0.5 leading-snug">{detail}</div>
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-1" strokeWidth={2} />
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S5 · Adding own topic · simple form with category chips
   ═══════════════════════════════════════════════════════════════════ */

function S5AddOwn() {
  return (
    <OffboarderShell activeTab="add-own">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[760px] mx-auto px-6 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              Add a topic <span className="text-violet-700">only you know</span>
            </h1>
            <p className="text-[13px] text-gray-600 leading-relaxed mt-2">
              Something you've been doing that isn't written down · an unwritten rule · a person to talk to · a story that explains why we do things this way. Doesn't need to be polished · drafts save as you type.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <label className="block text-[11px] font-semibold text-gray-900 mb-1.5">What's this about?</label>
              <input
                type="text"
                defaultValue="The 'don't touch on Fridays' rule for Atlas deployments"
                className="w-full text-[15px] text-gray-900 placeholder:text-gray-400 border-none outline-none focus:ring-0 px-0 py-1"
                style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}
              />
              <p className="text-[10px] text-gray-500 mt-1">Short and direct works best · 5-12 words.</p>
            </div>

            <div className="px-5 py-4 border-b border-gray-100">
              <label className="block text-[11px] font-semibold text-gray-900 mb-2">What kind of thing is this?</label>
              <div className="flex flex-wrap gap-1.5">
                <CategoryChip icon={AlertOctagon} label="Red flag" tone="rose" />
                <CategoryChip icon={Bookmark} label="Unwritten rule" tone="yellow" active />
                <CategoryChip icon={Award} label="Canonical procedure" tone="emerald" />
                <CategoryChip icon={Users} label="Person to know" tone="indigo" />
                <CategoryChip icon={History} label="Backstory" tone="gray" />
                <CategoryChip icon={Cpu} label="System behavior" tone="indigo" />
                <CategoryChip icon={Tag} label="Other" tone="gray" />
              </div>
            </div>

            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between gap-2 mb-2">
                <label className="text-[11px] font-semibold text-gray-900 inline-flex items-center gap-1.5">
                  <Edit3 className="w-3 h-3" strokeWidth={2} />
                  Tell the story
                </label>
                <span className="text-[10px] text-gray-500 inline-flex items-center gap-1 text-emerald-700"><Save className="w-2.5 h-2.5" strokeWidth={2} /> Auto-saved</span>
              </div>

              <div className="rounded-lg border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-violet-500/30 focus-within:border-violet-500">
                <div className="px-3 py-3 text-[13px] text-gray-800 leading-relaxed min-h-[180px]">
                  <p>After INC-2942 (the Q3 outage), the team made an informal agreement that we don't deploy Atlas on Fridays. It's not a company policy · it's a team-level convention we adopted because the on-call rotation gets thin Friday evening and weekend coverage is limited if something goes wrong.</p>
                  <p className="mt-2">In practice this means:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-0.5">
                    <li>Anything Atlas-related ships Thursday at latest, unless it's a hotfix</li>
                    <li>Hotfixes still ship Friday but with explicit Slack heads-up to me</li>
                    <li>Rollbacks during weekend on-call are OK · they're recovery, not changes</li>
                  </ul>
                  <p className="mt-2 text-gray-500"><em>...keep going if there's more</em></p>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-b border-gray-100">
              <label className="block text-[11px] font-semibold text-gray-900 mb-2">Who should know this?</label>
              <div className="flex flex-wrap gap-1.5">
                <PersonChip name={SESSION.successor} initials="TN" tone="emerald" />
                <PersonChip name={SESSION.netMember} initials="DN" tone="indigo" />
                <button className="h-7 px-2 rounded-full border border-dashed border-gray-300 text-[10px] text-gray-500 hover:border-violet-400 hover:text-violet-700 transition-colors inline-flex items-center gap-1">
                  <Plus className="w-2.5 h-2.5" strokeWidth={2} />
                  Add person
                </button>
              </div>
              <p className="text-[10px] text-gray-500 mt-2">They'll see this in the Knowledge Graph after {SESSION.manager} reviews it.</p>
            </div>

            <div className="px-5 py-3 bg-gray-50/50 flex items-center justify-between gap-3">
              <div className="text-[10px] text-gray-500">
                Word count · <span style={{ fontFamily: "ui-monospace, Menlo, monospace" }} className="font-semibold text-gray-700">132</span> · estimated reading time · 1 min
              </div>
              <div className="flex items-center gap-2">
                <button className="h-8 px-3 rounded-md text-gray-600 hover:text-gray-900 text-[12px] font-medium">Save draft</button>
                <button className="h-8 px-4 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-[12px] font-semibold inline-flex items-center gap-1.5">
                  <Check className="w-3 h-3" strokeWidth={2.5} />
                  Add to queue
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-gray-50 border border-gray-200 p-4">
            <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-semibold mb-2 inline-flex items-center gap-1.5">
              <Star className="w-3 h-3 text-yellow-600" strokeWidth={2} />
              Topics other offboarders found useful
            </div>
            <div className="grid grid-cols-2 gap-2">
              <SuggestedTopic label="Vendor relationships not in CRM" detail="People you actually email, not the official account manager" />
              <SuggestedTopic label="The 'production-but-not-really-tested' code path" detail="Things that only run in edge cases you've personally seen" />
              <SuggestedTopic label="Promises you made to other teams" detail="Verbal commitments that aren't tracked anywhere" />
              <SuggestedTopic label="People to thank or warn about" detail="Soft context that helps a successor navigate the org" />
            </div>
          </div>
        </div>
      </div>
    </OffboarderShell>
  );
}

function CategoryChip({ icon: Icon, label, tone, active }) {
  const cfg = {
    rose: { base: "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100", activeBg: "bg-rose-600 text-white border-rose-600" },
    yellow: { base: "bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100", activeBg: "bg-yellow-600 text-white border-yellow-600" },
    emerald: { base: "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100", activeBg: "bg-emerald-600 text-white border-emerald-600" },
    indigo: { base: "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100", activeBg: "bg-indigo-600 text-white border-indigo-600" },
    gray: { base: "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100", activeBg: "bg-gray-700 text-white border-gray-700" },
  }[tone];
  return (
    <button className={`h-7 px-2.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 border transition-colors ${active ? cfg.activeBg : cfg.base}`}>
      <Icon className="w-2.5 h-2.5" strokeWidth={2.5} />
      {label}
    </button>
  );
}

function PersonChip({ name, initials, tone }) {
  const cfg = {
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
    violet: "bg-violet-50 border-violet-200 text-violet-700",
  }[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 h-7 px-2 rounded-full border ${cfg} text-[10px] font-medium`}>
      <span className="w-4 h-4 rounded-full bg-white border border-current/40 flex items-center justify-center text-[8px] font-semibold">{initials}</span>
      {name}
      <button className="ml-0.5 hover:opacity-70"><X className="w-2.5 h-2.5" strokeWidth={2.5} /></button>
    </span>
  );
}

function SuggestedTopic({ label, detail }) {
  return (
    <button className="text-left rounded-md bg-white border border-gray-200 px-3 py-2 hover:border-violet-300 hover:bg-violet-50/30 transition-colors">
      <div className="text-[12px] font-semibold text-gray-900 leading-tight">{label}</div>
      <div className="text-[10px] text-gray-500 mt-1 leading-snug">{detail}</div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S6 · Self-upload surface
   ═══════════════════════════════════════════════════════════════════ */

function S6Upload() {
  return (
    <OffboarderShell activeTab="upload">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[860px] mx-auto px-6 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              Drop in <span className="text-violet-700">anything else</span> from your computer
            </h1>
            <p className="text-[13px] text-gray-600 leading-relaxed mt-2">
              Old design docs · diagrams you sketched · runbooks living in your private notes · screenshots of important Slack threads. Anything that's only on your machine and would help {SESSION.successor}.
            </p>
          </div>

          <DropZone />

          <div className="mt-6">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h2 className="text-sm font-semibold text-gray-900 inline-flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-violet-600" strokeWidth={2} />
                Staged files · 3 ready to attach
              </h2>
              <span className="text-[10px] text-gray-500">Per-file classification preview · review before submitting</span>
            </div>

            <div className="space-y-2">
              <UploadFileRow
                icon={FileText}
                name="atlas-architecture-2024Q3.md"
                size="42 KB"
                source="Local · Documents/Atlas/"
                category={{ label: "Canonical procedure", tone: "emerald" }}
                detected="Detected as architectural documentation · linked to 4 graph nodes"
                accessOverride="Inheriting Atlas Trello board ACLs"
              />
              <UploadFileRow
                icon={ImageIcon}
                name="payment-gateway-flow-sketch.png"
                size="187 KB"
                source="Local · Desktop"
                category={{ label: "System behavior", tone: "indigo" }}
                detected="Detected as diagram · OCR found 'timeout · listener restart'"
                accessOverride="Will inherit Atlas-Payments Trello board"
              />
              <UploadFileRow
                icon={FileText}
                name="vendor-xyz-march-call-notes.txt"
                size="8 KB"
                source="Local · Notes app"
                category={{ label: "Backstory", tone: "yellow" }}
                detected="Detected as meeting notes · 1 named person · 2 commitments referenced"
                accessOverride="Will inherit Vendor-Mgmt Trello board"
                warning="Contains an email address · we'll redact during ingestion"
              />
            </div>

            <div className="mt-4 rounded-xl bg-emerald-50/40 border border-emerald-200 p-3 flex items-start gap-2.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" strokeWidth={2} />
              <div className="text-[11px] text-emerald-900/80 leading-relaxed">
                <strong>Pre-commit sanitization runs before anything reaches the graph (CL-092).</strong> Regex layer redacts secrets and PII (emails, phone numbers, API keys) to <code style={{ fontFamily: "ui-monospace, Menlo, monospace" }} className="text-[10px] bg-emerald-100/60 px-1 rounded">[REDACTED]</code>. Few-shot prompting layer neutralizes any emotional / venting language. Then Microsoft Purview's mandatory PII gate applies (snapshot §2).
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <button className="h-8 px-3 rounded-md text-gray-600 hover:text-gray-900 text-[12px] font-medium border border-gray-200 inline-flex items-center gap-1.5">
              <Plus className="w-3 h-3" strokeWidth={2} />
              Add more files
            </button>
            <button className="h-9 px-4 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-[12px] font-semibold inline-flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" strokeWidth={2} />
              Submit all 3 files for review
            </button>
          </div>
        </div>
      </div>
    </OffboarderShell>
  );
}

function DropZone() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-violet-300 bg-violet-50/30 px-6 py-8 text-center hover:border-violet-400 hover:bg-violet-50/50 transition-colors cursor-pointer">
      <div className="w-12 h-12 rounded-xl bg-white border border-violet-200 flex items-center justify-center mx-auto mb-3">
        <Upload className="w-5 h-5 text-violet-600" strokeWidth={1.75} />
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">Drop files here · or click to browse</h3>
      <p className="text-[11px] text-gray-600 leading-relaxed max-w-md mx-auto">
        Markdown · PDF · images · plain text · meeting notes · diagrams. Max 50 MB per file · no spreadsheet exports (we'll handle those via direct integration).
      </p>
      <div className="mt-3 flex items-center justify-center gap-3 text-[10px] text-gray-500">
        <span className="inline-flex items-center gap-1"><FileText className="w-2.5 h-2.5" /> .md .txt</span>
        <span className="inline-flex items-center gap-1"><File className="w-2.5 h-2.5" /> .pdf</span>
        <span className="inline-flex items-center gap-1"><ImageIcon className="w-2.5 h-2.5" /> .png .jpg</span>
      </div>
    </div>
  );
}

function UploadFileRow({ icon: Icon, name, size, source, category, detected, accessOverride, warning }) {
  const catCfg = {
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-800",
  }[category.tone];
  return (
    <article className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:border-gray-300 transition-colors">
      <div className="px-4 py-3 flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-gray-600" strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
            <h4 className="text-[13px] font-semibold text-gray-900 truncate" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{name}</h4>
            <button className="text-gray-400 hover:text-rose-600 p-0.5"><Trash2 className="w-3 h-3" strokeWidth={1.75} /></button>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-500 flex-wrap" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
            <span>{size}</span>
            <span>·</span>
            <span>{source}</span>
          </div>

          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-semibold border ${catCfg}`}>
              <Sparkles className="w-2.5 h-2.5" strokeWidth={2.5} />
              {category.label}
            </span>
            <button className="text-[10px] text-violet-700 hover:text-violet-900 font-medium">Change category</button>
          </div>

          <div className="mt-2 text-[11px] text-gray-600 leading-relaxed inline-flex items-start gap-1.5">
            <Sparkles className="w-3 h-3 text-violet-500 shrink-0 mt-0.5" strokeWidth={2} />
            <span>{detected}</span>
          </div>

          <div className="mt-1.5 text-[10px] text-gray-500 leading-relaxed inline-flex items-center gap-1">
            <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" strokeWidth={2} />
            <span>{accessOverride}</span>
          </div>

          {warning && (
            <div className="mt-2 rounded-md bg-yellow-50/60 border border-yellow-200 px-2 py-1 inline-flex items-start gap-1.5">
              <AlertTriangle className="w-2.5 h-2.5 text-yellow-700 shrink-0 mt-0.5" strokeWidth={2} />
              <span className="text-[10px] text-yellow-900/80 leading-snug">{warning}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S7 · Mid-session save · checkpoint badge
   ═══════════════════════════════════════════════════════════════════ */

function S7MidSave() {
  return (
    <OffboarderShell activeTab="queue">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[760px] mx-auto px-6 py-12">
          <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-8 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-white border-2 border-emerald-300 flex items-center justify-center mx-auto mb-5 shadow-sm">
              <Save className="w-7 h-7 text-emerald-600" strokeWidth={1.75} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-2">
              Saved · everything is safe.
            </h2>
            <p className="text-[14px] text-gray-600 leading-relaxed max-w-md mx-auto mb-6">
              5 of 14 inputs complete · 6 drafts in progress · 3 attached files. Come back anytime · your work is in the same state.
            </p>

            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-6">
              <CheckpointTile value="5" label="Submitted" sublabel="Going to review" tone="emerald" />
              <CheckpointTile value="6" label="Drafts" sublabel="Auto-saved" tone="violet" />
              <CheckpointTile value="3" label="Files staged" sublabel="Will sync on submit" tone="indigo" />
            </div>

            <div className="rounded-lg bg-emerald-50/40 border border-emerald-100 px-4 py-3 max-w-md mx-auto mb-5 text-left">
              <div className="text-[10px] uppercase tracking-[0.18em] text-emerald-700 font-semibold mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3 h-3" strokeWidth={2} />
                Reminders we'll send you
              </div>
              <ul className="space-y-1 text-[11px] text-emerald-900/80">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span>Tomorrow at 10am · "3 manager priorities still waiting"</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span>Day 7 of 12 · "You're halfway · 8 days left"</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span>Day 10 · "2 days to wrap up · Hà Vy will see what you've shared"</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-center gap-2 flex-wrap">
              <button className="h-9 px-4 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-[13px] font-semibold inline-flex items-center gap-1.5 transition-colors">
                <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2} />
                Continue where I left off
              </button>
              <button className="h-9 px-4 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-[13px] font-medium inline-flex items-center gap-1.5 transition-colors">
                <X className="w-3.5 h-3.5" strokeWidth={2} />
                Close · come back later
              </button>
            </div>

            <p className="text-[10px] text-gray-500 mt-5 leading-relaxed max-w-sm mx-auto">
              {SESSION.successor} can already see the 5 things you submitted while you're gone. Nothing else is shared yet.
            </p>
          </div>
        </div>
      </div>
    </OffboarderShell>
  );
}

function CheckpointTile({ value, label, sublabel, tone }) {
  const cfg = {
    emerald: { ring: "border-emerald-200", valueCls: "text-emerald-700", iconCls: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
    violet: { ring: "border-violet-200", valueCls: "text-violet-700", iconCls: "bg-violet-100 text-violet-700", icon: Edit3 },
    indigo: { ring: "border-indigo-200", valueCls: "text-indigo-700", iconCls: "bg-indigo-100 text-indigo-700", icon: Paperclip },
  }[tone];
  const Icon = cfg.icon;
  return (
    <div className={`rounded-xl bg-white border ${cfg.ring} px-3 py-3`}>
      <div className={`w-7 h-7 rounded-lg ${cfg.iconCls} flex items-center justify-center mx-auto mb-2`}>
        <Icon className="w-3.5 h-3.5" strokeWidth={2} />
      </div>
      <div className={`text-2xl font-bold ${cfg.valueCls} tracking-tight leading-none`} style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{value}</div>
      <div className="text-[10px] font-semibold text-gray-700 mt-1">{label}</div>
      <div className="text-[9px] text-gray-500 mt-0.5">{sublabel}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S8 · Done · contributions summary · handoff to review
   ═══════════════════════════════════════════════════════════════════ */

function S8Done() {
  return (
    <OffboarderShell activeTab="queue" hideTabs>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[820px] mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 border-2 border-emerald-300 flex items-center justify-center mx-auto mb-5 shadow-md">
              <Check className="w-9 h-9 text-emerald-600" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight mb-2">
              Thank you, <span className="text-violet-700">Minh</span>.
            </h1>
            <p className="text-[15px] text-gray-600 leading-relaxed max-w-lg mx-auto">
              Your handover is captured. 14 of 14 inputs complete · {SESSION.manager} will review your contributions before they reach the Knowledge Graph. {SESSION.successor} already has access to your draft work.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between gap-2 mb-4">
              <h2 className="text-sm font-semibold text-gray-900 inline-flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" strokeWidth={2} />
                What you contributed
              </h2>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">14 of 14 · 100%</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <SummaryTile
                icon={Sparkles}
                tone="violet"
                count="2"
                label="Manager priorities answered"
                detail="Vendor XYZ SLA · Payment Gateway timeout"
              />
              <SummaryTile
                icon={Users}
                tone="indigo"
                count="3"
                label="Network questions answered"
                detail={`From ${SESSION.netMember}, ${SESSION.netMember2}`}
              />
              <SummaryTile
                icon={AlertTriangle}
                tone="yellow"
                count="1"
                label="Pre-commit flag fixed"
                detail="Atlas rollback summary corrected"
              />
              <SummaryTile
                icon={Plus}
                tone="emerald"
                count="5"
                label="Your own topics added"
                detail="3 unwritten rules · 1 backstory · 1 person to know"
              />
              <SummaryTile
                icon={Upload}
                tone="indigo"
                count="3"
                label="Files attached"
                detail="Architecture doc · sketch · meeting notes"
              />
              <SummaryTile
                icon={Edit3}
                tone="violet"
                count="~4,200"
                label="Words written"
                detail="In your own voice · across all 14 contributions"
              />
            </div>

            <div className="pt-5 border-t border-gray-100">
              <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-semibold mb-2 inline-flex items-center gap-1.5">
                <Activity className="w-3 h-3" strokeWidth={2} />
                What happens next · in order
              </div>
              <ol className="space-y-2">
                <NextStep n={1} title={`${SESSION.manager} reviews your contributions`} detail="She has 3 days to read through. You'll get a copy of any clarifying questions." active />
                <NextStep n={2} title="QA-INT-01 §1.4 sign-off gate" detail={`${SESSION.manager} marks each contribution as Canonical, Verified, or sends back for clarification.`} />
                <NextStep n={3} title="Knowledge Graph commit" detail={`Your Canonical Facts get an emerald badge and propagate to ${SESSION.successor}'s playbook.`} />
                <NextStep n={4} title={`${SESSION.successor}'s playbook updates`} detail="He sees your contributions in his Section 3 reading flow. You're done here." last />
              </ol>
            </div>
          </div>

          <div className="rounded-xl bg-violet-50/40 border border-violet-200 p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-white border border-violet-200 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4 text-violet-700" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">One more thing you can do (optional)</h3>
                <p className="text-[12px] text-gray-700 leading-relaxed mb-3">
                  Want to record a short voice note for {SESSION.successor}? Just 2-3 minutes of personal context · "the things I wish someone had told me on day one." Lives outside the Knowledge Graph · just for him.
                </p>
                <button className="h-7 px-3 rounded-md bg-white border border-violet-200 text-violet-700 hover:bg-violet-50 text-[11px] font-semibold inline-flex items-center gap-1.5">
                  <Mic className="w-3 h-3" strokeWidth={2} />
                  Record a voice note
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button className="h-9 px-4 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-[13px] font-medium inline-flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" strokeWidth={2} />
              Review my contributions
            </button>
            <button className="h-10 px-5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[14px] font-semibold inline-flex items-center gap-2 shadow-md">
              <Check className="w-4 h-4" strokeWidth={2.5} />
              I'm done · close the workspace
            </button>
          </div>

          <p className="text-[11px] text-gray-500 text-center mt-6 leading-relaxed max-w-md mx-auto">
            You can come back to read your contributions any time before your last day. After that, the Knowledge Graph is the canonical record.
          </p>
        </div>
      </div>
    </OffboarderShell>
  );
}

function SummaryTile({ icon: Icon, tone, count, label, detail }) {
  const cfg = {
    violet: { ring: "border-violet-200", iconBg: "bg-violet-50 border-violet-200 text-violet-700", valueCls: "text-violet-700" },
    indigo: { ring: "border-indigo-200", iconBg: "bg-indigo-50 border-indigo-200 text-indigo-700", valueCls: "text-indigo-700" },
    yellow: { ring: "border-yellow-200", iconBg: "bg-yellow-50 border-yellow-200 text-yellow-700", valueCls: "text-yellow-700" },
    emerald: { ring: "border-emerald-200", iconBg: "bg-emerald-50 border-emerald-200 text-emerald-700", valueCls: "text-emerald-700" },
  }[tone];
  return (
    <div className={`rounded-xl bg-white border ${cfg.ring} p-3.5 flex items-start gap-3`}>
      <div className={`w-9 h-9 rounded-lg ${cfg.iconBg} border flex items-center justify-center shrink-0`}>
        <Icon className="w-4 h-4" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-extrabold ${cfg.valueCls} tracking-tight leading-none`} style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{count}</span>
        </div>
        <div className="text-[12px] font-semibold text-gray-900 mt-1 leading-tight">{label}</div>
        <div className="text-[10px] text-gray-500 mt-0.5 leading-snug">{detail}</div>
      </div>
    </div>
  );
}

function NextStep({ n, title, detail, active, last }) {
  return (
    <li className={`flex items-start gap-3 py-1.5 ${!last ? "border-b border-gray-100 pb-2.5" : ""}`}>
      <div className={`w-6 h-6 rounded-full ${active ? "bg-violet-600 text-white" : "bg-white border border-gray-300 text-gray-500"} flex items-center justify-center shrink-0 text-[10px] font-bold`} style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{n}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[12px] font-semibold ${active ? "text-gray-900" : "text-gray-700"}`}>{title}</span>
          {active && <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700">Next · happens automatically</span>}
        </div>
        <div className="text-[10px] text-gray-500 mt-0.5 leading-snug">{detail}</div>
      </div>
    </li>
  );
}
