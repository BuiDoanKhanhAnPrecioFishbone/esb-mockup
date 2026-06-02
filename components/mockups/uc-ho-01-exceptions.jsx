"use client";

import React, { useState } from "react";
import {
  ChevronLeft, ChevronRight, Check, X, AlertTriangle, AlertCircle, Info,
  Clock, RefreshCw, Calendar, Mail, Github, Folder, GitBranch, Briefcase, ShieldAlert,
  Lock, ArrowRight, Database, Hourglass, PauseCircle, UserX, AlertOctagon,
  Loader2, ChevronsRight
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   UC-HO-01 · Exceptions — clickable flow

   Five screens, one per exception, strictly traced to UC-HO-01 v2.0:

     EX.1 — Context seeding fails to complete
     EX.2 — Offboarder record not found in ART-EEP
     EX.3 — Last working date is fewer than 3 business days away
     EX.4 — Sensitivity classification service unavailable
     EX.5 — RBAC scope cannot be resolved

   Sources used here are restricted to approved shared workspaces ·
   Jira · GitHub · Google Drive. Email is NEVER an automated data
   source per the data-ingestion governance rule.

   Note · the "Email HR Admin" action button in EX.2 is a USER ACTION
   (compose an outbound email), not data collection — that's a
   notification channel, distinct from email-as-a-source-for-scanning.

   Honors the locked S1 v2 visual system:
     · CL-054 violet primary + pastel yellow secondary + rose critical
     · CL-056 RBAC failure pattern
     · CL-014 critical-notice copy names the actual person
     · CL-013 "sensitivity classification", never vendor names
     · CL-012 "sensitive content", never "PII"
     · CL-017 "Skipped" with strikethrough, not "Failed"
     · CL-065 critical urgency · 2px rose left-border + Urgent pill
   ═══════════════════════════════════════════════════════════════════ */

const FLOW = [
  { id: "ex1", uc: "EX.1", label: "Seeding partial",                 trigger: "Triggered at step 7 — a data source fails mid-scan.",                                  severity: "warning" },
  { id: "ex2", uc: "EX.2", label: "Profile not provisioned",         trigger: "Triggered at step 2 — the Offboarder has no ART-EEP profile yet.",                    severity: "block"   },
  { id: "ex3", uc: "EX.3", label: "Critical short notice",           trigger: "Triggered at step 3 — last working date is fewer than 3 business days away.",        severity: "urgent"  },
  { id: "ex4", uc: "EX.4", label: "Classification service paused",   trigger: "Triggered at step 8 — the sensitivity classification service is unreachable.",       severity: "pause"   },
  { id: "ex5", uc: "EX.5", label: "Authorization unresolvable",      trigger: "Triggered at step 6 — the orchestrator can't establish the session's RBAC scope.",   severity: "block"   },
];

const SCENARIO = {
  ex1: { name: "Minh Lê",          role: "Senior Backend Engineer",   dept: "Engineering" },
  ex2: { name: "Hoàng Anh Lê",     role: "Profile lookup attempted",  dept: "Not found in ART-EEP" },
  ex3: { name: "Khánh Linh Trần",  role: "Head of People Operations", dept: "People & Culture",   lastDay: "May 31, 2026",  daysLeft: 2 },
  ex4: { name: "Minh Lê",          role: "Senior Backend Engineer",   dept: "Engineering" },
  ex5: { name: "Minh Lê",          role: "Senior Backend Engineer",   dept: "Engineering" },
};

export default function UCHO01ExceptionsFlow() {
  const [stepIdx, setStepIdx] = useState(0);
  const step = FLOW[stepIdx];
  const scenario = SCENARIO[step.id];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      <TopBar step={step} stepIdx={stepIdx} scenario={scenario} onJump={setStepIdx} />
      <main className="flex-1">
        <StepRenderer id={step.id} scenario={scenario} />
      </main>
      <FooterNav stepIdx={stepIdx} step={step} onChange={setStepIdx} />
    </div>
  );
}

/* ─── Chrome ────────────────────────────────────────────────── */

function TopBar({ step, stepIdx, scenario, onJump }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="px-5 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
          <span className="text-gray-900 font-semibold tracking-[0.18em] text-xs" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>ART-EEP</span>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-gray-500 text-xs">UC-HO-01 · Exceptions</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-gray-500 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          <span className="uppercase tracking-wider font-semibold text-rose-700">Exception</span>
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
            Scenario · <span className="text-gray-700 font-medium">{scenario.name}</span>
            {scenario.role && <span> · {scenario.role}</span>}
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
      className={`h-7 px-2 rounded-md border text-[10px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${
        active
          ? "bg-rose-600 text-white border-rose-600"
          : "bg-white text-rose-700 border-rose-200 hover:border-rose-400"
      }`}
      style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
    >
      {step.uc}
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

function StepRenderer({ id, scenario }) {
  if (id === "ex1") return <EX1SeedingPartial scenario={scenario} />;
  if (id === "ex2") return <EX2ProfileMissing scenario={scenario} />;
  if (id === "ex3") return <EX3CriticalShortNotice scenario={scenario} />;
  if (id === "ex4") return <EX4ClassificationPaused scenario={scenario} />;
  if (id === "ex5") return <EX5RBACUnresolvable scenario={scenario} />;
  return null;
}

/* ═══════════════════════════════════════════════════════════════════
   EX.1 — Context seeding fails (partial completion)
   ═══════════════════════════════════════════════════════════════════ */

function EX1SeedingPartial({ scenario }) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader
        eyebrow="Seeding complete with one failure · 9 minutes"
        title={`${scenario.name}'s context — partial seed`}
        subtitle="Two of three sources finished. One could not be reached. The session has been created with the data we have."
        actor="Hà Vy · Manager · Engineering"
      />

      <Banner tone="warning" icon={AlertTriangle}>
        <strong>Context seeding from Google Drive could not be completed.</strong>{" "}
        Interview questions may be less targeted for topics covered by Drive. Jira and GitHub seeded successfully — the session can proceed.
      </Banner>

      <FormSection title="Seeding pipeline" subtitle="Per-stage status. Failed and skipped stages are preserved here for traceability.">
        <article className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <ProgressStage
            status="done"
            label="Establishing the session's authorization scope"
            detail="RBAC resolved · 23 nodes in scope · audit anchor written · 2 seconds"
          />
          <ProgressStage
            status="done"
            label="Decomposing the seeding job"
            detail="3 sources · Worker handles metadata · Expert reserved for gap inference"
          />
          <ProgressStage
            status="done"
            label="Extracting Jira ticket metadata"
            detail="47 tickets · titles, statuses, labels, comment counts · 1.4 minutes"
          />
          <ProgressStage
            status="done"
            label="Extracting GitHub metadata"
            detail="23 shared repos · PR descriptions, commit messages, wiki pages · 2.8 minutes"
          />
          <ProgressStage
            status="failed"
            label="Extracting Google Drive file metadata"
            detail="OAuth refresh token rejected after 12 retries across 8 minutes · marked Seeding Failed · escalated to Platform Admin"
          />
          <ProgressStage
            status="done"
            label="Sensitivity classification gate"
            detail="412 items classified · 21 redacted · 0 excluded"
          />
          <ProgressStage
            status="done"
            label="Inferring likely knowledge gaps"
            detail="Expert Agent · single pass · 3 gaps flagged · 38 seconds"
          />
          <ProgressStage
            status="done"
            label="Building the preliminary knowledge map"
            detail="Stored in session workspace · scoped to RBAC boundary"
            last
          />
        </article>
      </FormSection>

      <FormSection title="What we couldn't see" subtitle="The interview will be less detailed in these areas — priority prompts can help.">
        <article className="rounded-lg border border-rose-200 bg-white" style={{ borderLeft: "2px solid rgb(244, 63, 94)" }}>
          <div className="px-4 py-3 flex items-start gap-3">
            <div className="w-8 h-8 rounded-md bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
              <Folder className="w-3.5 h-3.5 text-rose-700" strokeWidth={1.75} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="text-sm font-semibold text-gray-900">Google Drive · seeding failed</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold bg-rose-50 border border-rose-200 text-rose-700">Failed</span>
              </div>
              <p className="text-[12px] text-gray-700 leading-relaxed mb-2">
                The OAuth refresh token for {scenario.name}'s Drive expired before the scan completed. Platform Admin has the full retrieval trace and will re-issue access. You can re-run the Drive scan once that's done — or proceed without it.
              </p>
              <div className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
                UC-HO-01.EX.1 · source.drive · oauth-token-rejected · 2026-05-29T14:46:12Z
              </div>
            </div>
          </div>
        </article>
      </FormSection>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <GhostButton>View full retrieval trace</GhostButton>
        <div className="flex items-center gap-2">
          <SecondaryButton>
            <RefreshCw className="w-3 h-3" />
            Retry Drive after re-auth
          </SecondaryButton>
          <PrimaryButton>
            Continue with partial seed
            <ArrowRight className="w-3.5 h-3.5" />
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   EX.2 — Offboarder record not found in ART-EEP
   ═══════════════════════════════════════════════════════════════════ */

function EX2ProfileMissing({ scenario }) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <PageHeader
        eyebrow="Initiation blocked · EX.2"
        title="Offboarder profile not found"
        actor="Hà Vy · Manager"
      />

      <article className="rounded-lg border border-rose-200 bg-white overflow-hidden" style={{ borderLeft: "2px solid rgb(244, 63, 94)" }}>
        <div className="px-5 py-4 border-b border-gray-100 bg-rose-50/30 flex items-start gap-3">
          <div className="w-9 h-9 rounded-md bg-white border border-rose-200 flex items-center justify-center shrink-0">
            <UserX className="w-4 h-4 text-rose-700" strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900">
              {scenario.name}'s profile does not exist in ART-EEP.
            </h3>
            <p className="text-[12px] text-gray-600 mt-1 leading-relaxed">
              HR created the departure record, but the ART-EEP user profile was never provisioned for this person. The handover session cannot be created until the profile is in place. <strong>No partial session record has been written.</strong>
            </p>
          </div>
        </div>

        <div className="px-5 py-4">
          <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium mb-2">What to do</div>
          <ol className="space-y-1.5 text-[12px] text-gray-700">
            <RemediationStep n={1}>Contact HR Admin and ask them to provision {scenario.name}'s ART-EEP profile.</RemediationStep>
            <RemediationStep n={2}>Once the profile exists, return to your dashboard and click <strong>Initiate handover session</strong> from the notification again.</RemediationStep>
            <RemediationStep n={3}>If provisioning is taking longer than 24 hours, escalate to Platform Admin with the error reference below.</RemediationStep>
          </ol>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-3 flex-wrap">
            <div className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
              ERR · UC-HO-01.EX.2 · 2026-05-29T14:18:42Z<br />
              attempted-uid · hoang-anh-le · not-found
            </div>
            <div className="flex items-center gap-2">
              <SecondaryButton>
                <Mail className="w-3 h-3" />
                Notify HR Admin
              </SecondaryButton>
              <SecondaryButton>
                <ChevronLeft className="w-3 h-3" />
                Back to dashboard
              </SecondaryButton>
            </div>
          </div>
        </div>
      </article>

      <p className="text-[11px] text-gray-500 mt-4 leading-relaxed">
        <span className="text-gray-700 font-medium">Why no partial record exists ·</span> creating a session without a verified Offboarder profile would leave a dangling reference in the audit trail. ART-EEP refuses to write the session anchor until the profile lookup succeeds — by design.
      </p>
    </div>
  );
}

function RemediationStep({ n, children }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="w-4 h-4 rounded-full bg-gray-100 text-gray-600 text-[10px] font-semibold inline-flex items-center justify-center shrink-0 mt-0.5">{n}</span>
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   EX.3 — Last working date is fewer than 3 business days away
   ═══════════════════════════════════════════════════════════════════ */

function EX3CriticalShortNotice({ scenario }) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader
        eyebrow="Session setup · steps 3–5 · expedited"
        title="Set up a handover session — urgent"
        subtitle="The review deadline has been auto-adjusted to fit the timeline. You can override it within the remaining window."
        actor="Hà Vy · Manager · People & Culture"
      />

      <article className="rounded-lg bg-rose-50/50 border border-rose-200 overflow-hidden mb-5" style={{ borderLeft: "2px solid rgb(244, 63, 94)" }}>
        <div className="px-4 py-3 flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-white border border-rose-200 flex items-center justify-center shrink-0">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-700" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-sm font-semibold text-rose-900">
                Critical · {scenario.name}'s last working date is in {scenario.daysLeft} business days.
              </h3>
              <span className="text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold bg-rose-100 border border-rose-200 text-rose-700">Urgent</span>
            </div>
            <p className="text-[12px] text-rose-900/90 leading-relaxed">
              The review deadline has been adjusted to <strong>May 30, 2026 · 17:00</strong>{" "}
              (one business day before her last day). You can override it, but you can't push past {scenario.lastDay}. Schedule the interview as soon as possible — the Offboarder's notification will include an urgency flag.
            </p>
          </div>
        </div>
      </article>

      <FormSection title="Session details" subtitle="Pre-filled from the HR record.">
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <DetailRow label="Offboarder"        value={scenario.name} />
          <DetailRow label="Role"              value={scenario.role} />
          <DetailRow label="Department"        value={scenario.dept} />
          <DetailRow label="Last working date" value={scenario.lastDay} mono icon={Calendar} last />
        </div>
      </FormSection>

      <FormSection title="Review deadline" subtitle="Auto-reduced because the last working date is fewer than 3 business days away.">
        <div className="rounded-lg border border-rose-200 bg-white p-3 flex items-center gap-3" style={{ borderLeft: "2px solid rgb(244, 63, 94)" }}>
          <Calendar className="w-4 h-4 text-rose-600 shrink-0" strokeWidth={1.75} />
          <input
            defaultValue="May 30, 2026 · 17:00"
            className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
            style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
          />
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-700 uppercase tracking-wider font-semibold">Auto-reduced</span>
        </div>
        <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
          Maximum override · {scenario.lastDay} · 17:00 (her last working day).
        </p>
      </FormSection>

      <FormSection title="Focus note" subtitle="Recommended given the short notice — steer the seeding toward what matters most.">
        <textarea
          defaultValue="Khánh Linh's notice is short — prioritize the most recent policy decisions and pending HR cases over historical context."
          className="w-full min-h-[64px] px-3 py-2 rounded-md border border-rose-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/15 transition-colors resize-none"
          style={{ fontFamily: "inherit" }}
        />
      </FormSection>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <GhostButton>Cancel</GhostButton>
        <PrimaryButton>
          Start session · expedited
          <ArrowRight className="w-3.5 h-3.5" />
        </PrimaryButton>
      </div>
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

/* ═══════════════════════════════════════════════════════════════════
   EX.4 — Sensitivity classification service unavailable
   ═══════════════════════════════════════════════════════════════════ */

function EX4ClassificationPaused({ scenario }) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader
        eyebrow="Seeding paused · EX.4"
        title="Sensitivity classification service is unavailable"
        subtitle="The pipeline has halted at the classification gate. No content has entered the staging area without classification — by design."
        actor="Hà Vy · Manager · Engineering"
      />

      <Banner tone="warning" icon={PauseCircle}>
        <strong>Status · Seeding paused — classification service unavailable.</strong>{" "}
        The pipeline will automatically retry every 15 minutes for up to 4 hours. If the service does not recover in that window, Platform Admin will be notified to re-trigger seeding manually.
      </Banner>

      <FormSection title="Where the pipeline halted" subtitle="Sources extracted cleanly. The gate is the only block.">
        <article className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <ProgressStage
            status="done"
            label="Establishing the session's authorization scope"
            detail="RBAC resolved · audit anchor written"
          />
          <ProgressStage
            status="done"
            label="Decomposing the seeding job"
            detail="3 sources · Worker handles metadata · Expert reserved for gap inference"
          />
          <ProgressStage
            status="done"
            label="Extracting Jira ticket metadata"
            detail="47 tickets · 1.4 minutes"
          />
          <ProgressStage
            status="done"
            label="Extracting GitHub metadata"
            detail="23 shared repos · 2.8 minutes"
          />
          <ProgressStage
            status="done"
            label="Extracting Google Drive file metadata"
            detail="412 files · 2.1 minutes"
          />
          <ProgressStage
            status="paused"
            label="Sensitivity classification gate"
            detail="Service unreachable · halted · NEVER falling back to unclassified content"
          />
          <ProgressStage status="pending" label="Inferring likely knowledge gaps"        detail="Waits for full classified context" />
          <ProgressStage status="pending" label="Building the preliminary knowledge map" last />
        </article>
      </FormSection>

      <FormSection title="Auto-retry · classification service" subtitle="The pipeline resumes automatically when the service responds.">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50/30 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Hourglass className="w-3.5 h-3.5 text-yellow-700" />
            <h3 className="text-sm font-semibold text-yellow-900">Retry status</h3>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <StatPill label="Last attempt"    value="3 min ago" />
            <StatPill label="Next retry"       value="in 12 min" />
            <StatPill label="Time remaining"  value="3h 42m" />
          </div>
          <div className="text-[11px] text-yellow-900/80 leading-relaxed space-y-1">
            <p><strong>If the service recovers within the window</strong> · seeding resumes from the classification stage automatically. You'll be notified when the map is ready.</p>
            <p><strong>If 4 hours pass without recovery</strong> · Platform Admin gets a high-priority alert and will re-trigger seeding manually once the service is back.</p>
          </div>
        </div>
      </FormSection>

      <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
        <span className="text-gray-700 font-medium">Why we halt rather than fall back ·</span> the classification gate is a hard requirement. Letting unclassified content into the staging area — even temporarily — would violate the data-handling policy at the architecture level, so the pipeline pauses cleanly rather than degrading.
      </p>

      <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
        <GhostButton>View error logs</GhostButton>
        <div className="flex items-center gap-2">
          <SecondaryButton>
            <ChevronLeft className="w-3 h-3" />
            Back to dashboard
          </SecondaryButton>
          <SecondaryButton>
            <RefreshCw className="w-3 h-3" />
            Try now
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
}

function StatPill({ label, value }) {
  return (
    <div className="rounded-md border border-yellow-200 bg-white px-3 py-2">
      <div className="text-[10px] uppercase tracking-[0.18em] text-yellow-800 font-medium">{label}</div>
      <div className="text-sm font-semibold text-gray-900 mt-0.5" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{value}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   EX.5 — RBAC scope cannot be resolved
   ═══════════════════════════════════════════════════════════════════ */

function EX5RBACUnresolvable({ scenario }) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <PageHeader
        eyebrow="Session creation halted · EX.5"
        title="Authorization scope could not be established"
        actor="Hà Vy · Manager"
      />

      <article className="rounded-lg border border-rose-200 bg-white overflow-hidden" style={{ borderLeft: "2px solid rgb(244, 63, 94)" }}>
        <div className="px-5 py-4 border-b border-gray-100 bg-rose-50/30 flex items-start gap-3">
          <div className="w-9 h-9 rounded-md bg-white border border-rose-200 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-4 h-4 text-rose-700" strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900">
              The session's authorization boundary could not be resolved.
            </h3>
            <p className="text-[12px] text-gray-600 mt-1 leading-relaxed">
              ART-EEP looked up {scenario.name}'s role authorizations and your authority over his record in the directory, but one of them came back missing or corrupted. The session was not created and nothing was written to the audit log.
            </p>
          </div>
        </div>

        <div className="px-5 py-4">
          <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium mb-2">What to do</div>
          <ol className="space-y-1.5 text-[12px] text-gray-700">
            <RemediationStep n={1}>The most common cause is a directory sync delay. Wait 10 minutes, then click <strong>Retry</strong>. If it succeeds, no further action is needed.</RemediationStep>
            <RemediationStep n={2}>If retry still fails, contact HR Admin with the error reference below. They will check {scenario.name}'s role record and the reporting hierarchy.</RemediationStep>
            <RemediationStep n={3}>If you are not the person who normally manages this Offboarder, ask the correct Manager to retry from their dashboard.</RemediationStep>
          </ol>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-3 flex-wrap">
            <div className="text-[10px] text-gray-500 leading-relaxed" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
              ERR · UC-HO-01.EX.5 · 2026-05-29T14:32:08Z<br />
              directory-trace · minh.le · scope-resolve-failed
            </div>
            <div className="flex items-center gap-2">
              <SecondaryButton>
                <ChevronLeft className="w-3 h-3" />
                Back to dashboard
              </SecondaryButton>
              <PrimaryButton>
                <RefreshCw className="w-3.5 h-3.5" />
                Retry
              </PrimaryButton>
            </div>
          </div>
        </div>
      </article>

      <p className="text-[11px] text-gray-500 mt-4 leading-relaxed">
        <span className="text-gray-700 font-medium">Why this matters ·</span> the session's RBAC scope bounds every downstream retrieval (UC-HO-02 interview, UC-ON-01 playbook). Without it, ART-EEP can't safely proceed — by design, no fallback to unrestricted access exists.
      </p>
    </div>
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
    critical: { cls: "border-rose-200 bg-rose-50/50",     iconCls: "text-rose-600",   textCls: "text-rose-900"   },
    warning:  { cls: "border-yellow-200 bg-yellow-50/60", iconCls: "text-yellow-700", textCls: "text-yellow-900" },
    muted:    { cls: "border-gray-200 bg-gray-50/60",     iconCls: "text-gray-500",   textCls: "text-gray-700"   },
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
    done:    { icon: Check,         iconCls: "text-emerald-600 bg-emerald-50 border-emerald-200",                          labelCls: "text-gray-900" },
    active:  { icon: Loader2,       iconCls: "text-violet-600 bg-violet-50 border-violet-200 animate-spin",                labelCls: "text-gray-900 font-medium" },
    pending: { icon: Clock,         iconCls: "text-gray-300 bg-white border-gray-200",                                     labelCls: "text-gray-400" },
    failed:  { icon: X,             iconCls: "text-rose-600 bg-rose-50 border-rose-200",                                   labelCls: "text-rose-900 font-medium" },
    skipped: { icon: ChevronsRight, iconCls: "text-gray-400 bg-gray-50 border-gray-200",                                   labelCls: "text-gray-400 line-through" },
    paused:  { icon: PauseCircle,   iconCls: "text-yellow-700 bg-yellow-50 border-yellow-200",                             labelCls: "text-yellow-900 font-medium" },
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

function SecondaryButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="h-8 px-3 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20"
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
