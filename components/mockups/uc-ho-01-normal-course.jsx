"use client";

import React, { useState } from "react";
import {
  Bell, ChevronLeft, ChevronRight, Check, AlertTriangle, Info, Clock,
  Calendar, Mail, Folder, GitBranch, Users, Briefcase, ShieldCheck,
  Network, Sparkles, Loader2, Database, ArrowRight, ArrowUpRight,
  Tag, MessageSquare, FileText, Layers, CheckCircle2, KeyRound
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   UC-HO-01 · Normal Course — clickable flow

   Four screens covering the 13 happy-path steps of UC-HO-01 v2.0:

     Screen 1 (steps 1–2)    Dashboard notification → Initiate
     Screen 2 (steps 3–5)    Session setup wizard
     Screen 3 (steps 6–9)    Context seeding · live progress
     Screen 4 (steps 10–13)  Preliminary knowledge map · next actions

   Single scenario throughout: Hà Vy initiating a handover for Minh Lê,
   the canonical Senior Backend Engineer departure.

   Honors the locked S1 v2 visual system:
     · CL-054 violet primary + pastel yellow secondary
     · CL-055 primary CTAs carry the brand color · 32px button height
     · CL-013 "sensitivity classification", never "Microsoft Purview"
     · CL-015 email scanning constraint surfaced inline at the source row
     · CL-016 knowledge gaps framed as warm guidance, not deficiency
     · CL-020 audit anchor referenced as ambient context
     · CL-059 explicit focus rings
   ═══════════════════════════════════════════════════════════════════ */

const FLOW = [
  { id: "notify",  uc: "Steps 1–2",   label: "Notification",        trigger: "System detects HR sync · Manager opens the notification." },
  { id: "wizard",  uc: "Steps 3–5",   label: "Session setup",       trigger: "Manager reviews configuration and starts context seeding." },
  { id: "seeding", uc: "Steps 6–9",   label: "Context seeding",     trigger: "Pipeline runs in the background · Manager can leave the page." },
  { id: "map",     uc: "Steps 10–13", label: "Preliminary map",     trigger: "Seeding complete · Manager reviews and chooses next action." },
];

const SCENARIO = {
  name: "Minh Lê",
  role: "Senior Backend Engineer",
  dept: "Engineering",
  lastDay: "June 4, 2026",
  daysLeft: 12,
};

export default function UCHO01NormalCourseFlow() {
  const [stepIdx, setStepIdx] = useState(0);
  const step = FLOW[stepIdx];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      <TopBar step={step} stepIdx={stepIdx} onJump={setStepIdx} />
      <main className="flex-1">
        <StepRenderer id={step.id} />
      </main>
      <FooterNav stepIdx={stepIdx} step={step} onChange={setStepIdx} />
    </div>
  );
}

/* ─── Chrome ────────────────────────────────────────────────── */

function TopBar({ step, stepIdx, onJump }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="px-5 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
          <span className="text-gray-900 font-semibold tracking-[0.18em] text-xs" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>ART-EEP</span>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-gray-500 text-xs">UC-HO-01 · Normal course</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-gray-500 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="uppercase tracking-wider font-semibold text-emerald-700">Normal course</span>
          <span className="text-gray-300">·</span>
          <span className="text-gray-700" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{step.uc}</span>
        </div>
      </div>

      <div className="px-5 pb-2 flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-sm font-semibold text-gray-900 truncate">
            {stepIdx + 1} of {FLOW.length} · {step.label}
          </h1>
          <p className="text-[11px] text-gray-500 mt-0.5 truncate">
            Scenario · <span className="text-gray-700 font-medium">{SCENARIO.name}</span> · {SCENARIO.role}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {FLOW.map((s, i) => (
            <StepDot key={s.id} step={s} active={i === stepIdx} onClick={() => onJump(i)} />
          ))}
        </div>
      </div>
    </header>
  );
}

function StepDot({ step, active, onClick }) {
  return (
    <button
      onClick={onClick}
      title={`${step.uc} · ${step.label}`}
      className={`h-7 px-2.5 rounded-md border text-[10px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 whitespace-nowrap ${
        active
          ? "bg-gray-900 text-white border-gray-900"
          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
      }`}
      style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
    >
      {step.uc.replace("Steps ", "")}
    </button>
  );
}

function FooterNav({ stepIdx, step, onChange }) {
  const atFirst = stepIdx === 0;
  const atLast = stepIdx === FLOW.length - 1;
  return (
    <footer className="bg-white border-t border-gray-200 px-5 py-2.5 flex items-center justify-between sticky bottom-0 z-20">
      <button
        onClick={() => !atFirst && onChange(stepIdx - 1)}
        disabled={atFirst}
        className={`h-8 px-3 rounded-md text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${
          atFirst ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        Previous
      </button>

      <div className="hidden sm:block text-[11px] text-gray-500 max-w-md text-center truncate px-3">
        {step.trigger}
      </div>

      <button
        onClick={() => !atLast && onChange(stepIdx + 1)}
        disabled={atLast}
        className={`h-8 px-3 rounded-md text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30 ${
          atLast ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-700 text-white"
        }`}
      >
        Next
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </footer>
  );
}

function StepRenderer({ id }) {
  if (id === "notify")  return <NotificationScreen />;
  if (id === "wizard")  return <WizardScreen />;
  if (id === "seeding") return <SeedingScreen />;
  if (id === "map")     return <KnowledgeMapScreen />;
  return null;
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 1 · NOTIFICATION (UC-HO-01 steps 1–2)
   ═══════════════════════════════════════════════════════════════════ */

function NotificationScreen() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader
        eyebrow="Handover dashboard"
        title="Good afternoon, Hà Vy"
        subtitle="One handover detected from the HR system. Initiate when you're ready — context seeding runs in the background."
        actor="Hà Vy · Manager · Engineering"
      />

      <SectionLabel count={1}>Pending</SectionLabel>

      <article className="rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-colors mb-6">
        <div className="p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-violet-50 border border-violet-200 flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4 text-violet-600" strokeWidth={1.75} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-violet-700 font-semibold">New from HR sync</span>
              <span className="text-gray-300">·</span>
              <span className="text-[11px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>2 minutes ago</span>
            </div>
            <h3 className="text-base font-semibold text-gray-900">
              A handover session is ready to be initiated for {SCENARIO.name}.
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {SCENARIO.role} · {SCENARIO.dept} · last working date {SCENARIO.lastDay} · {SCENARIO.daysLeft} days remaining.
            </p>

            <div className="flex items-center gap-1.5 mt-3 flex-wrap">
              <SourcePreviewChip icon={GitBranch} label="Jira · 47 active tickets" />
              <SourcePreviewChip icon={Folder}    label="Google Drive · 412 files" />
              <SourcePreviewChip icon={Mail}      label="Email metadata" />
            </div>

            <div className="flex items-center gap-3 mt-4">
              <PrimaryButton>
                Initiate handover session
                <ArrowRight className="w-3.5 h-3.5" />
              </PrimaryButton>
              <GhostButton>Snooze for 24 hours</GhostButton>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 px-5 py-2.5 bg-gray-50/40 flex items-center justify-between text-[11px] text-gray-500">
          <span className="inline-flex items-center gap-1.5">
            <Database className="w-3 h-3" />
            HR sync · departure confirmed
          </span>
          <span style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>SESSION-DRAFT-2026-05-29-3f8a</span>
        </div>
      </article>

      <SectionLabel>Recent activity</SectionLabel>
      <div className="space-y-1.5">
        <AuditTile
          timestamp="2026-05-29 14:18:42"
          actor="System"
          action="Detected new departure record from HR sync"
          severity="medium"
        />
        <AuditTile
          timestamp="2026-05-22 16:42:08"
          actor="System"
          action="Trần Hữu Nam's onboarding playbook released — built from Minh Lê's verified handover"
          severity="low"
        />
        <AuditTile
          timestamp="2026-05-22 12:18:33"
          actor="Khánh Linh Trần"
          action="Signed her handover transcript · committed to the knowledge graph"
          severity="low"
        />
      </div>

      <p className="text-[11px] text-gray-500 mt-5 leading-relaxed">
        <span className="text-gray-700 font-medium">Per UC-HO-01 preconditions ·</span> {SCENARIO.name}'s departure has been formally recorded in HR with a confirmed last working date and synced to ART-EEP (status <code className="text-gray-900">Departure Confirmed</code>). His Jira, Drive, and email integrations are reachable. The audit anchor entry will be written when you initiate.
      </p>
    </div>
  );
}

function SourcePreviewChip({ icon: Icon, label }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-gray-600 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded">
      <Icon className="w-2.5 h-2.5 text-gray-500" strokeWidth={1.75} />
      {label}
    </span>
  );
}

function AuditTile({ timestamp, actor, action, severity }) {
  const borderColor = {
    low:    "rgb(229, 231, 235)",
    medium: "rgb(234, 179, 8)",
    high:   "rgb(244, 63, 94)",
  }[severity];
  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2" style={{ borderLeft: `2px solid ${borderColor}` }}>
      <div className="flex items-center justify-between mb-0.5 gap-2">
        <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{timestamp}</span>
        <span className="text-[10px] text-gray-700 font-medium shrink-0">{actor}</span>
      </div>
      <div className="text-xs text-gray-900">{action}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 2 · SESSION SETUP WIZARD (UC-HO-01 steps 3–5)
   ═══════════════════════════════════════════════════════════════════ */

function WizardScreen() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader
        eyebrow="Session setup · steps 3–5"
        title="Set up a handover session"
        subtitle="Confirm the details, review deadline, and data sources. Then start context seeding."
        actor="Hà Vy · Manager · Engineering"
      />

      <FormSection title="Session details" subtitle="Pre-filled from the HR record. Edit typos but not the person.">
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <DetailRow label="Offboarder"        value={SCENARIO.name} />
          <DetailRow label="Role"              value={SCENARIO.role} />
          <DetailRow label="Department"        value={SCENARIO.dept} />
          <DetailRow label="Last working date" value={SCENARIO.lastDay} mono icon={Calendar} last />
        </div>
      </FormSection>

      <FormSection title="Review deadline" subtitle="Default · 3 business days after the interview ends. Edit if needed.">
        <div className="rounded-lg border border-gray-200 bg-white p-3 flex items-center gap-3 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-500/15 transition-colors">
          <Calendar className="w-4 h-4 text-gray-400 shrink-0" strokeWidth={1.75} />
          <input
            defaultValue="June 8, 2026 · 17:00"
            className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
            style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
          />
          <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>+3 business days</span>
        </div>
        <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
          Maximum override · {SCENARIO.lastDay} · 17:00 (his last working day).
        </p>
      </FormSection>

      <FormSection title="Data sources" subtitle="Pre-selected based on the integrations available for this Offboarder.">
        <div className="space-y-2">
          <SourceRow icon={GitBranch} name="Jira"           detail="47 active tickets · 6 months of comments"           selected />
          <SourceRow icon={Folder}    name="Google Drive"   detail="412 files · access through OAuth · titles only"     selected />
          <SourceRow icon={Mail}      name="Email metadata" detail="Subject lines and participants only. Email content is never read or stored." selected />
        </div>
      </FormSection>

      <FormSection title="Focus note" subtitle="Optional · steers the context seeding toward what matters most.">
        <textarea
          placeholder="For example · 'Prioritize Project Atlas and the Payment Gateway timeout — Trần Hữu Nam needs to hit the ground running on both.'"
          defaultValue="Probe deeply on the Payment Gateway timeout — recurring incident, no runbook. Also the Vendor XYZ renewal SLA terms."
          className="w-full min-h-[72px] px-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/15 transition-colors resize-none"
          style={{ fontFamily: "inherit" }}
        />
      </FormSection>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <GhostButton>Cancel</GhostButton>
        <PrimaryButton>
          Start session & begin context seeding
          <ArrowRight className="w-3.5 h-3.5" />
        </PrimaryButton>
      </div>

      <p className="text-[11px] text-gray-500 mt-5 leading-relaxed">
        <span className="text-gray-700 font-medium">When you click start ·</span> ART-EEP creates the session record, establishes the RBAC scope from the directory, writes the audit anchor, and queues the background seeding job. You'll see live progress on the next screen.
      </p>
    </div>
  );
}

function DetailRow({ label, value, mono, icon: Icon, last }) {
  return (
    <div className={`px-3 py-2.5 flex items-center gap-3 ${!last ? "border-b border-gray-100" : ""}`}>
      <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium w-32 shrink-0">{label}</div>
      <div className="flex-1 flex items-center gap-2">
        {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />}
        <span className="text-sm text-gray-900" style={mono ? { fontFamily: "ui-monospace, Menlo, monospace" } : undefined}>
          {value}
        </span>
      </div>
    </div>
  );
}

function SourceRow({ icon: Icon, name, detail, selected }) {
  return (
    <label className="flex items-start gap-3 rounded-md border border-gray-200 bg-white px-3 py-2.5 cursor-pointer transition-colors hover:border-gray-300">
      <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
        selected ? "bg-violet-600 border-violet-600" : "bg-white border-gray-300"
      }`}>
        {selected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
      </span>
      <Icon className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" strokeWidth={1.75} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900">{name}</div>
        <div className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{detail}</div>
      </div>
    </label>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 3 · CONTEXT SEEDING (UC-HO-01 steps 6–9)
   Mid-flight state · 3 stages done, 1 active, 4 pending.
   ═══════════════════════════════════════════════════════════════════ */

function SeedingScreen() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader
        eyebrow="Step 6–9 · context seeding · 3m 12s elapsed"
        title={`Scanning ${SCENARIO.name}'s work history`}
        subtitle="This typically takes 5 to 10 minutes. You can leave this page — we'll notify you when the knowledge map is ready."
        actor="Hà Vy · Manager · Engineering"
      />

      <Banner tone="muted" icon={Info}>
        <strong>Session created · audit anchor written.</strong>{" "}
        Session ID · <code className="text-gray-900 bg-gray-50 px-1 py-0.5 rounded text-[10px]">SESSION-2026-05-29-7a3c</code>.{" "}
        Status · <code className="text-gray-900 bg-gray-50 px-1 py-0.5 rounded text-[10px]">Offboarding In Progress</code>.
      </Banner>

      <FormSection title="Seeding pipeline" subtitle="Each stage runs in order. Earlier stages must complete before later ones start.">
        <article className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <ProgressStage
            status="done"
            label="Establishing the session's authorization scope"
            detail="RBAC resolved · 23 nodes in scope · audit anchor written · 2 seconds"
          />
          <ProgressStage
            status="done"
            label="Decomposing the seeding job"
            detail="3 sources · estimated 8 minutes · Worker handles metadata · Expert reserved for gap inference"
          />
          <ProgressStage
            status="done"
            label="Extracting Jira ticket metadata"
            detail="47 tickets · titles, statuses, labels, comment counts · 1.4 minutes"
          />
          <ProgressStage
            status="active"
            label="Extracting Google Drive file metadata"
            detail="318 of 412 files · titles and edit recency only · no raw content stored"
          />
          <ProgressStage
            status="pending"
            label="Extracting email metadata"
            detail="Subject lines and participants only · email content is never read or stored"
          />
          <ProgressStage
            status="pending"
            label="Sensitivity classification gate"
            detail="All ingested content classified before staging · no bypass under any condition"
          />
          <ProgressStage
            status="pending"
            label="Inferring likely knowledge gaps"
            detail="Expert Agent · single pass · runs once when classified context is complete"
          />
          <ProgressStage
            status="pending"
            label="Building the preliminary knowledge map"
            last
          />
        </article>
      </FormSection>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <ActivityTile label="Worker tokens"  value="48,210" detail="Phi-3 / GPT-4o-mini · ≥80% of seeding tokens" />
        <ActivityTile label="Expert tokens"  value="0"      detail="Reserved for the gap inference pass" />
        <ActivityTile label="Items classified" value="83"  detail="0 redacted · 0 excluded so far" />
      </div>

      <p className="text-[11px] text-gray-500 leading-relaxed flex items-center gap-2">
        <Sparkles className="w-3 h-3 text-violet-500 shrink-0" />
        <span>The Expert Agent runs once · only for the knowledge-gap inference. ≥80% of seeding tokens stay on the lightweight Worker Agent (per UC-HO-01 SR · token cost).</span>
      </p>
    </div>
  );
}

function ActivityTile({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium">{label}</div>
      <div className="text-lg font-semibold text-gray-900 mt-0.5 tracking-tight" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{value}</div>
      <div className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{detail}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 4 · PRELIMINARY KNOWLEDGE MAP (UC-HO-01 steps 10–13)
   Per CL-013, exclusion count shown without revealing what was
   excluded. Per CL-016, gaps framed warmly. Per CL-012, "sensitive"
   not "PII".
   ═══════════════════════════════════════════════════════════════════ */

function KnowledgeMapScreen() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader
        eyebrow="Seeding complete · 7 minutes"
        title={`${SCENARIO.name}'s preliminary knowledge map`}
        subtitle="What we learned from the scan. Review before scheduling the interview."
        actor="Hà Vy · Manager · Engineering"
      />

      <div className="rounded-lg border border-emerald-200 bg-emerald-50/30 p-4 mb-6 flex items-start gap-3">
        <div className="w-9 h-9 rounded-md bg-white border border-emerald-200 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900">Session ready · {SCENARIO.name} has been notified</h3>
          <p className="text-xs text-gray-600 mt-0.5">
            He received an in-app notification to begin his handover interview at his earliest convenience. UC-HO-02 and UC-HO-05 are now unlocked.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        <SummaryStat value="487" label="Items detected" />
        <SummaryStat value="23"  label="Excluded by classification" subtle />
        <SummaryStat value="464" label="Items in scope" />
        <SummaryStat value="3"   label="Likely knowledge gaps" tone="warning" />
      </div>

      <FormSection title="Top 3 projects by activity" subtitle="Where Minh Lê spent the most of his time over the last 6 months.">
        <div className="grid grid-cols-3 gap-3">
          <ProjectCard icon={Layers}        name="Project Atlas"           detail="32 tickets · primary contributor · 8 months" />
          <ProjectCard icon={Network}       name="Payment Gateway v2"      detail="19 tickets · most recent owner · critical service" />
          <ProjectCard icon={MessageSquare} name="Vendor XYZ renewal"      detail="High email volume · no project doc · negotiation lead" />
        </div>
      </FormSection>

      <FormSection title="Likely knowledge gaps" subtitle="Where activity is high but documentation is sparse. The interview should probe these.">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50/30 p-4">
          <ul className="space-y-2.5">
            <KnowledgeGap
              title="Payment Gateway timeout"
              detail="Recurring incidents · no runbook · 4 tickets in the last 6 months · fix appears in three ticket comments but never written up"
            />
            <KnowledgeGap
              title="Vendor XYZ renewal · SLA terms"
              detail="Heavy email traffic · no project page captures the negotiated penalty clause · pricing renegotiation trigger mentioned but undocumented"
            />
            <KnowledgeGap
              title="Project Atlas · rollback procedure"
              detail="Mentioned in three tickets · never documented anywhere central · institutional knowledge"
            />
          </ul>
        </div>
      </FormSection>

      <FormSection title="What we excluded" subtitle="Counts only · per the privacy constraint, ART-EEP doesn't reveal what was excluded.">
        <div className="rounded-md border border-gray-200 bg-gray-50/40 p-3 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" strokeWidth={1.75} />
          <div className="flex-1 min-w-0">
            <p className="text-[12px] text-gray-700 leading-relaxed">
              <strong>23 items were excluded by sensitivity classification</strong> — content tagged as personal, salary, or confidential under your organization's labels. The count is recorded in the audit log for compliance review, but the items themselves are not surfaced here.
            </p>
            <p className="text-[11px] text-gray-500 mt-1.5">
              This is a low exclusion rate for an engineering role · expected.
            </p>
          </div>
        </div>
      </FormSection>

      <FormSection title="Next actions" subtitle="The session is ready. What would you like to do?">
        <div className="grid grid-cols-2 gap-3">
          <NextActionCard
            icon={MessageSquare}
            title="Schedule the voice interview"
            detail={`Send ${SCENARIO.name} the calendar invite to start his handover. About 45 minutes.`}
            ucRef="UC-HO-02"
            primary
          />
          <NextActionCard
            icon={Tag}
            title="Add priority prompts"
            detail="Steer the interview toward the runbook gap and the SLA terms before he begins."
            ucRef="UC-HO-05"
          />
        </div>
      </FormSection>

      <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
        <span className="text-gray-700 font-medium">Audit anchor entry ·</span> session creation, configuration choices, classification counts (487 ingested · 464 retained), and the RBAC scope hash have been written to the immutable audit log. Every subsequent action on this session traces back to this anchor.
      </p>
    </div>
  );
}

function SummaryStat({ value, label, tone, subtle }) {
  const cfg = {
    default: { border: "border-gray-200",   bg: "bg-white",        valueCls: "text-gray-900",   labelCls: "text-gray-500"   },
    warning: { border: "border-yellow-200", bg: "bg-yellow-50/30", valueCls: "text-yellow-800", labelCls: "text-yellow-700" },
  }[tone || "default"];
  return (
    <div className={`rounded-lg border ${cfg.border} ${cfg.bg} px-3 py-3 ${subtle ? "opacity-90" : ""}`}>
      <div className={`text-2xl font-semibold ${cfg.valueCls} tracking-tight`} style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{value}</div>
      <div className={`text-[11px] ${cfg.labelCls} mt-0.5`}>{label}</div>
    </div>
  );
}

function ProjectCard({ icon: Icon, name, detail }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="w-7 h-7 rounded-md bg-gray-50 border border-gray-200 flex items-center justify-center mb-2">
        <Icon className="w-3.5 h-3.5 text-gray-600" strokeWidth={1.75} />
      </div>
      <h4 className="text-sm font-medium text-gray-900 leading-tight">{name}</h4>
      <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{detail}</p>
    </div>
  );
}

function KnowledgeGap({ title, detail }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="w-1 h-1 rounded-full bg-yellow-500 shrink-0 mt-2" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 leading-tight">{title}</div>
        <div className="text-[11px] text-yellow-900/70 mt-0.5 leading-relaxed">{detail}</div>
      </div>
    </li>
  );
}

function NextActionCard({ icon: Icon, title, detail, ucRef, primary }) {
  return (
    <button className={`text-left rounded-lg border bg-white p-4 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${
      primary ? "border-violet-300 hover:border-violet-500 ring-1 ring-violet-600/5" : "border-gray-200 hover:border-gray-400"
    }`}>
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-md border flex items-center justify-center shrink-0 ${
          primary ? "bg-violet-50 border-violet-200" : "bg-gray-50 border-gray-200"
        }`}>
          <Icon className={`w-4 h-4 ${primary ? "text-violet-600" : "text-gray-600"}`} strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
            <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{ucRef}</span>
          </div>
          <p className="text-[12px] text-gray-600 leading-relaxed">{detail}</p>
        </div>
        <ArrowUpRight className={`w-3.5 h-3.5 shrink-0 mt-1 ${primary ? "text-violet-600" : "text-gray-400"}`} />
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Shared primitives
   ═══════════════════════════════════════════════════════════════════ */

function PageHeader({ eyebrow, title, subtitle, actor }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        {eyebrow && <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">{eyebrow}</span>}
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight mt-1">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1 leading-relaxed">{subtitle}</p>}
      </div>
      {actor && <span className="text-[11px] text-gray-500 shrink-0 pt-1">{actor}</span>}
    </div>
  );
}

function SectionLabel({ count, children }) {
  return (
    <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium mb-3 flex items-center gap-2">
      <span>{children}</span>
      {count !== undefined && (
        <span className="text-gray-400" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>· {count}</span>
      )}
    </h2>
  );
}

function FormSection({ title, subtitle, children }) {
  return (
    <section className="mb-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      {subtitle && <p className="text-[12px] text-gray-500 mb-2.5 leading-relaxed">{subtitle}</p>}
      {children}
    </section>
  );
}

function Banner({ tone, icon: Icon, children }) {
  const cfg = {
    warning: { cls: "border-yellow-200 bg-yellow-50/60", iconCls: "text-yellow-700", textCls: "text-yellow-900" },
    muted:   { cls: "border-gray-200 bg-gray-50/60",     iconCls: "text-gray-500",   textCls: "text-gray-700"   },
  }[tone];
  return (
    <div className={`rounded-md border ${cfg.cls} px-3 py-2.5 mb-5 flex items-start gap-2`}>
      <Icon className={`w-4 h-4 ${cfg.iconCls} shrink-0 mt-0.5`} strokeWidth={1.75} />
      <div className={`text-[12px] ${cfg.textCls} leading-relaxed flex-1`}>{children}</div>
    </div>
  );
}

function ProgressStage({ status, label, detail, last }) {
  const config = {
    done:    { icon: Check,   iconCls: "text-emerald-600 bg-emerald-50 border-emerald-200",                 labelCls: "text-gray-900" },
    active:  { icon: Loader2, iconCls: "text-violet-600 bg-violet-50 border-violet-200 animate-spin",       labelCls: "text-gray-900 font-medium" },
    pending: { icon: Clock,   iconCls: "text-gray-300 bg-white border-gray-200",                            labelCls: "text-gray-400" },
  }[status];
  const Icon = config.icon;
  return (
    <div className={`px-4 py-3 flex items-start gap-3 ${!last ? "border-b border-gray-100" : ""}`}>
      <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${config.iconCls}`}>
        <Icon className="w-3 h-3" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-sm ${config.labelCls}`}>{label}</div>
        {detail && <div className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{detail}</div>}
      </div>
    </div>
  );
}

function PrimaryButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="h-8 px-3 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30"
    >
      {children}
    </button>
  );
}

function GhostButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="h-8 px-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 text-xs font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20"
    >
      {children}
    </button>
  );
}
