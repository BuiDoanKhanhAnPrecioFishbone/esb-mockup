"use client";

import React from "react";
import {
  Sparkles, Check, X, AlertTriangle, Info, Edit3, ShieldCheck,
  Users, ArrowRight, MoreHorizontal, History, Tag, RotateCcw,
  CheckCircle2, CircleDot, Crosshair, Flag, ListChecks, Layers,
  ShieldQuestion, GitBranch, FileText, MessageSquare, AlertOctagon,
  Plus, Send, Hash, Save,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   UC-HO-04 · Step D · S6 Pre-commit Flag Fix · 3-way diff

   This file holds the S6 view content + DecisionPanelFlag side panel
   for the UC-HO-04 Manager Review workspace. Imported by the main
   uc-ho-04-manager-review.jsx file, composed inside its ReviewShell.

   Split from main file to keep individual file size sustainable for
   incremental commits (the main file is ~92KB and adding S6 inline
   would push it past ~110KB, which exceeds the safe write threshold).

   The 3-way chain visualized here:
     · AI's wrong auto-capture (deploy → snapshot → verify)
     · Trần's flag raised during CL-101 pre-commit window
     · Minh's corrected procedure (snapshot → staging → verify → promote)
     · Duy independently corroborated in #data-platform Slack
     · Hà Vy approves the chain · commits Canonical · resolves flag

   Honors CL-101 (pre-commit network-driven correction loop),
   QA-INT-01 §2.3 (all 3 versions preserved in immutable audit trail),
   and the semantic palette (rose = AI wrong, yellow = flag, emerald
   = corrected, violet = your live decision).
   ═══════════════════════════════════════════════════════════════════ */

const MONO_STACK = 'ui-monospace, "Geist Mono", "JetBrains Mono", Menlo, monospace';

const SESSION = {
  reviewer: "Hà Vy",
  reviewerInitials: "HV",
  offboarder: "Minh Lê",
  offboarderShort: "Minh",
  offboarderInitials: "ML",
  successor: "Trần Hữu Nam",
  successorShort: "Trần",
  successorInitials: "TN",
  flaggerNet: "Duy Nguyễn",
  flaggerNetInitials: "DN",
  flaggerNetTeam: "Data Platform",
};

/* ═══════════════════════════════════════════════════════════════════
   Public exports · the main file imports these
   ═══════════════════════════════════════════════════════════════════ */

export function S6FlagFixView() {
  return (
    <div className="px-6 py-6 max-w-[1100px]">
      <FlagItemHeader />
      <FlagOriginCard />
      <ThreeWayDiffPanes />
      <FlagNetworkAgreementCard />
      <AuditChainPreview />
    </div>
  );
}

export function DecisionPanelFlag() {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border-2 border-yellow-300 bg-yellow-50/50 p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-yellow-100 border border-yellow-300 flex items-center justify-center shrink-0">
            <Flag className="w-4 h-4 text-yellow-700" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-yellow-900">Pre-commit flag chain</div>
            <div className="text-[10px] text-yellow-800/80 leading-snug">
              CL-101 · 3 versions to reconcile · all audit-preserved
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-md bg-white border border-yellow-200 px-2.5 py-2">
          <div className="text-[9px] uppercase tracking-wider font-semibold text-gray-500 mb-1.5">The chain</div>
          <ol className="space-y-1.5">
            <ChainStepSm n={1} actor="AI" label="Auto-captured · 6h ago" tone="rose" />
            <ChainStepSm n={2} actor={SESSION.successorShort} label="Flagged · 4h ago" tone="yellow" />
            <ChainStepSm n={3} actor={SESSION.offboarderShort} label="Corrected · 30m ago" tone="emerald" />
            <ChainStepSm n={4} actor={SESSION.reviewer} label="Approving · live" tone="violet" active />
          </ol>
        </div>
      </div>

      <FlagContextStrip />

      <div className="space-y-1.5">
        <FlagDecisionButton icon={ShieldCheck} label="Approve chain · commit Canonical" tone="emerald" />
        <FlagDecisionButton icon={Edit3} label={`Edit ${SESSION.offboarderShort}'s fix first`} tone="violet" subtle />
        <FlagDecisionButton icon={X} label="Reject correction · keep AI" tone="rose" subtle />
        <FlagDecisionButton icon={ShieldQuestion} label="Escalate · senior reviewer" tone="yellow" subtle />
      </div>

      <div className="pt-3 border-t border-gray-100">
        <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2">Why CL-101 matters</div>
        <p className="text-[10px] text-gray-600 leading-relaxed">
          {SESSION.successorShort} flagged this during the 24h pre-commit window because he had direct memory from his Day-0 conversation with {SESSION.offboarderShort}. Without this loop the AI's wrong version would have committed silently · he'd have used it on Day 1 and discovered the error in production.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   S6 internals · view
   ═══════════════════════════════════════════════════════════════════ */

function FlagItemHeader() {
  return (
    <div className="rounded-xl bg-white border border-gray-200 border-l-[3px] border-l-yellow-500 px-4 py-3 mb-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg border bg-yellow-50 border-yellow-200 text-yellow-700 flex items-center justify-center shrink-0">
        <AlertTriangle className="w-4.5 h-4.5" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-gray-500">Item 6</span>
          <span className="text-gray-300">·</span>
          <span className="text-[11px] text-gray-600">Pre-commit flag fix · raised by {SESSION.successorShort} · corrected by {SESSION.offboarderShort}</span>
          <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-gray-700 inline-flex items-center gap-1">
            <Tag className="w-2.5 h-2.5" strokeWidth={2} />
            Atlas rollback
          </span>
          <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-yellow-100 border border-yellow-300 text-yellow-800 inline-flex items-center gap-1">
            <Flag className="w-2.5 h-2.5" strokeWidth={2} />
            Flag review
          </span>
        </div>
        <h2 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">Atlas rollback · staging-first correction</h2>
        <div className="text-[9px] text-gray-400 mt-1" style={{ fontFamily: MONO_STACK }}>ITEM-2026-06-03-021</div>
      </div>
      <button className="text-gray-400 hover:text-gray-700 p-1.5 shrink-0">
        <MoreHorizontal className="w-4 h-4" strokeWidth={1.75} />
      </button>
    </div>
  );
}

function FlagOriginCard() {
  return (
    <div className="rounded-xl border border-yellow-200 bg-yellow-50/30 p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-white border border-yellow-200 flex items-center justify-center shrink-0">
          <Flag className="w-5 h-5 text-yellow-700" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-yellow-100 border border-yellow-200 text-yellow-800">CL-101 pre-commit flag</span>
            <span className="text-[10px] text-gray-600">raised during 24h network review window</span>
            <span className="ml-auto text-[10px] text-gray-500" style={{ fontFamily: MONO_STACK }}>flagged 4h ago · corrected 30m ago</span>
          </div>
          <h3 className="text-[14px] font-semibold text-gray-900 mb-2">
            {SESSION.successor} caught a wrong AI capture · {SESSION.offboarder} confirmed and corrected it
          </h3>
          <p className="text-[12px] text-gray-600 leading-relaxed">
            The AI auto-captured Atlas rollback from {SESSION.offboarderShort}'s Trello + Slack scrapes, but got the order wrong. {SESSION.successorShort} read the bundle during pre-commit review and recognized it didn't match what {SESSION.offboarderShort} had told him directly. He raised a flag · {SESSION.offboarderShort} agreed and submitted the correct version. {SESSION.flaggerNet} corroborated independently in #data-platform.
          </p>
          <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-500 flex-wrap">
            <FlagWindowChip label="Window opened" detail="24h before commit" tone="gray" />
            <FlagWindowChip label="Flag raised" detail={`${SESSION.successorShort} · 4h in`} tone="yellow" />
            <FlagWindowChip label="Correction" detail={`${SESSION.offboarderShort} · 30m ago`} tone="emerald" />
            <FlagWindowChip label="Awaiting" detail="Your decision · live" tone="violet" active />
          </div>
        </div>
      </div>
    </div>
  );
}

function FlagWindowChip({ label, detail, tone, active }) {
  const cfg = {
    gray: "border-gray-200 bg-white text-gray-700",
    yellow: "border-yellow-200 bg-yellow-50 text-yellow-800",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
    violet: "border-violet-300 bg-violet-50 text-violet-800",
  }[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border ${cfg} px-2 py-1 ${active ? "ring-2 ring-violet-500/20" : ""}`}>
      <span className="font-semibold">{label}</span>
      <span className="opacity-70">·</span>
      <span style={{ fontFamily: MONO_STACK }} className="opacity-80">{detail}</span>
    </span>
  );
}

function ThreeWayDiffPanes() {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2.5">
        <Layers className="w-3.5 h-3.5 text-violet-700" strokeWidth={2} />
        <h3 className="text-[12px] font-semibold text-gray-900">The 3-way chain · read left to right</h3>
        <span className="ml-auto text-[10px] text-gray-500" style={{ fontFamily: MONO_STACK }}>QA-INT-01 §2.3 · all 3 versions preserved</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <ThreeWayDiffPane
          step={1}
          tone="rose"
          badge="AI · wrong"
          actor="Worker SLM"
          actorInitials="AI"
          actorRole="Auto-captured · 6h ago"
          title="Original auto-capture"
          content={
            <>
              <p className="font-semibold text-gray-900 mb-2">Atlas rollback procedure:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Deploy rollback artifact to production cluster</li>
                <li>Snapshot Cosmos partition after deployment</li>
                <li>Verify schema integrity post-rollout</li>
              </ol>
              <p className="mt-3 text-[11px] text-gray-500 italic">Source: Trello card scrape · Slack #atlas-deploys snippet</p>
            </>
          }
          footer="Confidence · 72% · Worker SLM did not escalate to Expert"
        />

        <ThreeWayDiffPane
          step={2}
          tone="yellow"
          badge={`${SESSION.successorShort}'s flag`}
          actor={SESSION.successor}
          actorInitials={SESSION.successorInitials}
          actorRole="Successor · raised 4h ago"
          title="What's wrong here"
          content={
            <>
              <blockquote className="border-l-2 border-yellow-400 pl-3 italic text-gray-700">
                "This is in the wrong order. {SESSION.offboarderShort} explicitly told me <strong>staging first</strong>, never deploy to prod directly. The wiki is outdated · he said so himself in our Day-0 walkthrough. Step 1 should be snapshot, step 2 should be staging deploy, then promote only after staging verifies clean."
              </blockquote>
              <div className="mt-3 rounded-md bg-yellow-100/60 border border-yellow-200 px-2.5 py-2 text-[11px] text-yellow-900/90">
                <strong>Suggested fix:</strong> reorder to snapshot → staging → verify → promote.
              </div>
              <p className="mt-2 text-[11px] text-gray-500 italic">Source: in-person conversation with {SESSION.offboarderShort} on May 28</p>
            </>
          }
          footer="Specificity: high · cited a specific rule + alternative procedure"
        />

        <ThreeWayDiffPane
          step={3}
          tone="emerald"
          badge={`${SESSION.offboarderShort}'s fix`}
          actor={SESSION.offboarder}
          actorInitials={SESSION.offboarderInitials}
          actorRole="Offboarder · corrected 30m ago"
          title="Corrected version · ready for KG"
          content={
            <>
              <p className="font-semibold text-gray-900 mb-2">Atlas rollback procedure:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Snapshot Cosmos partition keyed by <code style={{ fontFamily: MONO_STACK }} className="text-[12px] bg-emerald-100/60 px-1 rounded">org</code></li>
                <li><strong>Run migration playbook against staging first</strong> — never production directly</li>
                <li>Verify schema integrity in staging</li>
                <li>Only after staging verifies clean · promote to production</li>
              </ol>
              <p className="mt-3 text-[11px] text-emerald-700/80 italic">
                Note: {SESSION.successorShort} is correct. The wiki has been out of date since the Q3 INC-2942 post-mortem. I should have caught this when the AI summarized it.
              </p>
            </>
          }
          footer="Confidence · 94% · matches INC-2942 post-mortem + 3 verbal corroborators"
        />
      </div>
    </div>
  );
}

function ThreeWayDiffPane({ step, tone, badge, actor, actorInitials, actorRole, title, content, footer }) {
  const cfg = {
    rose:    { border: "border-rose-200",                                            header: "bg-rose-50/40 border-rose-100",       badge: "bg-rose-100 border-rose-200 text-rose-700",          avatarBg: "bg-rose-100 border-rose-200 text-rose-700",          step: "bg-rose-200 text-rose-800" },
    yellow:  { border: "border-yellow-300",                                          header: "bg-yellow-50/40 border-yellow-200",   badge: "bg-yellow-100 border-yellow-300 text-yellow-800",    avatarBg: "bg-yellow-100 border-yellow-200 text-yellow-800",    step: "bg-yellow-200 text-yellow-900" },
    emerald: { border: "border-emerald-300 ring-2 ring-emerald-500/10",              header: "bg-emerald-50/40 border-emerald-200", badge: "bg-emerald-100 border-emerald-200 text-emerald-700", avatarBg: "bg-emerald-100 border-emerald-200 text-emerald-700", step: "bg-emerald-200 text-emerald-800" },
  }[tone];

  return (
    <article className={`rounded-xl bg-white border ${cfg.border} overflow-hidden flex flex-col`}>
      <header className={`px-4 py-2.5 border-b ${cfg.header}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className={`w-5 h-5 rounded ${cfg.step} flex items-center justify-center shrink-0 text-[10px] font-bold`} style={{ fontFamily: MONO_STACK }}>{step}</span>
          <span className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full border ${cfg.badge}`}>{badge}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-7 h-7 rounded-full ${cfg.avatarBg} border flex items-center justify-center text-[10px] font-semibold shrink-0`}>{actorInitials}</span>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold text-gray-900 truncate">{actor}</div>
            <div className="text-[9px] text-gray-500 truncate" style={{ fontFamily: MONO_STACK }}>{actorRole}</div>
          </div>
        </div>
      </header>
      <div className="px-4 py-3 border-b border-gray-100">
        <h4 className="text-[12px] font-semibold text-gray-900 mb-2">{title}</h4>
        <div className="text-[12px] text-gray-700 leading-relaxed">{content}</div>
      </div>
      <footer className="px-4 py-2 bg-gray-50/50 text-[10px] text-gray-500 truncate">
        {footer}
      </footer>
    </article>
  );
}

function FlagNetworkAgreementCard() {
  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50/30 p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-white border border-indigo-200 flex items-center justify-center shrink-0">
          <Users className="w-4 h-4 text-indigo-700" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700">Network corroboration</span>
            <span className="text-[10px] text-gray-500">independently agreed in Slack during the flag window</span>
          </div>
          <h3 className="text-[13px] font-semibold text-gray-900 mb-2">
            {SESSION.flaggerNet} corroborated the correction in #data-platform
          </h3>
          <blockquote className="text-[11px] text-gray-700 leading-relaxed italic border-l-2 border-indigo-300 pl-2.5 mb-2">
            "Yes, staging-first is the rule. I ran into the same thing in May and we settled it after INC-2942. {SESSION.offboarderShort}'s corrected version matches what we agreed in the post-mortem · I'd commit it as Canonical."
          </blockquote>
          <div className="flex items-center gap-2 text-[10px] text-gray-500">
            <span className="inline-flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center">
                <span className="text-[8px] font-semibold text-indigo-700">{SESSION.flaggerNetInitials}</span>
              </span>
              {SESSION.flaggerNet} · {SESSION.flaggerNetTeam}
            </span>
            <span>·</span>
            <span style={{ fontFamily: MONO_STACK }}>via #data-platform · 25m ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuditChainPreview() {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 mb-4">
      <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-semibold mb-3 inline-flex items-center gap-1.5">
        <History className="w-3 h-3" strokeWidth={2} />
        Audit chain on commit · QA-INT-01 §2.3 preserves all 3 versions
      </div>

      <ol className="space-y-2">
        <AuditRow
          n={1}
          actor="Worker SLM (AI)"
          when="6h ago · 14:22"
          tone="rose"
          headline="Auto-captured from Trello + Slack scrape"
          detail="Generated initial Atlas rollback summary · 72% confidence · did not escalate"
          tag="ai-capture"
        />
        <AuditRow
          n={2}
          actor={SESSION.successor}
          when="4h ago · 16:11"
          tone="yellow"
          headline="Raised CL-101 pre-commit flag"
          detail="Cited rule + alternative procedure · added Source: in-person conversation"
          tag="network-flag"
        />
        <AuditRow
          n={3}
          actor={SESSION.offboarder}
          when="30m ago · 19:38"
          tone="emerald"
          headline="Submitted corrected procedure"
          detail="Acknowledged AI was wrong · acknowledged Trần was right · cited INC-2942 post-mortem"
          tag="self-correction"
        />
        <AuditRow
          n={4}
          actor={SESSION.flaggerNet}
          when="25m ago · 19:43"
          tone="indigo"
          headline="Corroborated in #data-platform Slack"
          detail="Independent agreement · matched post-mortem reference · recommended Canonical"
          tag="network-agreement"
        />
        <AuditRow
          n={5}
          actor={`${SESSION.reviewer} · you`}
          when="live · awaiting decision"
          tone="violet"
          headline="Approving the chain · live"
          detail="Will commit Minh's fix as Canonical · resolve flag · cryptographic anchor on bundle sign-off"
          tag="manager-approval"
          active
          last
        />
      </ol>

      <div className="mt-3 pt-3 border-t border-gray-200 text-[10px] text-gray-500 leading-relaxed inline-flex items-start gap-1.5">
        <Info className="w-3 h-3 text-gray-400 shrink-0 mt-0.5" strokeWidth={2} />
        <span>The wrong AI version is <strong>not deleted</strong> · it stays in the immutable trail as version 1 so future readers can see how the correction came to be. Minh's correction is committed as version 3 (Canonical) with the flag chain attached.</span>
      </div>
    </div>
  );
}

function AuditRow({ n, actor, when, tone, headline, detail, tag, active, last }) {
  const cfg = {
    rose: { dot: "bg-rose-500", text: "text-rose-700", bg: "bg-rose-50/40", border: "border-rose-200" },
    yellow: { dot: "bg-yellow-500", text: "text-yellow-700", bg: "bg-yellow-50/40", border: "border-yellow-200" },
    emerald: { dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50/40", border: "border-emerald-200" },
    indigo: { dot: "bg-indigo-500", text: "text-indigo-700", bg: "bg-indigo-50/40", border: "border-indigo-200" },
    violet: { dot: "bg-violet-500", text: "text-violet-700", bg: "bg-violet-50/40", border: "border-violet-300" },
  }[tone];
  return (
    <li className={`flex items-start gap-3 ${!last ? "pb-2 border-b border-gray-200" : ""}`}>
      <span className={`w-6 h-6 rounded-md ${cfg.dot} flex items-center justify-center text-white shrink-0 text-[10px] font-bold ${active ? "ring-2 ring-violet-500/30" : ""}`} style={{ fontFamily: MONO_STACK }}>{n}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap mb-0.5">
          <span className={`text-[11px] font-semibold text-gray-900`}>{headline}</span>
          {tag && <code className={`text-[9px] px-1 py-0.5 rounded ${cfg.bg} ${cfg.text} border ${cfg.border}`} style={{ fontFamily: MONO_STACK }}>{tag}</code>}
        </div>
        <div className="text-[10px] text-gray-600 leading-snug">{detail}</div>
        <div className="text-[9px] text-gray-500 mt-0.5 inline-flex items-center gap-2">
          <span className={`font-medium ${cfg.text}`}>{actor}</span>
          <span className="text-gray-300">·</span>
          <span style={{ fontFamily: MONO_STACK }}>{when}</span>
          {active && <CircleDot className={`w-2.5 h-2.5 ${cfg.text} animate-pulse`} strokeWidth={2.5} />}
        </div>
      </div>
    </li>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   DecisionPanelFlag internals · right-rail decision UI
   ═══════════════════════════════════════════════════════════════════ */

function ChainStepSm({ n, actor, label, tone, active }) {
  const cfg = {
    rose: { dot: "bg-rose-500", text: "text-rose-700" },
    yellow: { dot: "bg-yellow-500", text: "text-yellow-700" },
    emerald: { dot: "bg-emerald-500", text: "text-emerald-700" },
    violet: { dot: "bg-violet-500", text: "text-violet-700" },
  }[tone];
  return (
    <li className={`flex items-center gap-2 text-[10px] ${active ? "font-semibold" : ""}`}>
      <span className={`w-3.5 h-3.5 rounded-full ${cfg.dot} flex items-center justify-center text-white text-[7px] font-bold shrink-0`} style={{ fontFamily: MONO_STACK }}>{n}</span>
      <span className="text-gray-700 flex-1 min-w-0 truncate">
        <strong className="text-gray-900">{actor}</strong> · <span className={cfg.text}>{label}</span>
      </span>
      {active && <CircleDot className={`w-2.5 h-2.5 ${cfg.text} shrink-0 animate-pulse`} strokeWidth={2.5} />}
    </li>
  );
}

function FlagContextStrip() {
  const items = [
    { label: "Flag specificity", value: "high · cited rule", positive: true },
    { label: "Network corroboration", value: `yes · ${SESSION.flaggerNetInitials}`, positive: true },
    { label: "Source verification", value: "matches INC-2942", positive: true },
    { label: `${SESSION.offboarderShort}'s fix confidence`, value: "94%", positive: true },
  ];
  return (
    <div className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2.5">
      <div className="text-[9px] uppercase tracking-[0.18em] font-semibold text-gray-500 mb-2">Correction signals</div>
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

function FlagDecisionButton({ icon: Icon, label, tone, subtle }) {
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
