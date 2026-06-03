"use client";

import React, { useState } from "react";
import {
  ChevronLeft, ChevronRight, Check, X, AlertTriangle, AlertCircle, Info, Clock,
  Bell, Calendar, GitBranch, Github, Folder, Users, Briefcase, ShieldAlert,
  ShieldCheck, Sparkles, Loader2, Database, ArrowRight, ArrowUpRight, Lock,
  Tag, MessageSquare, FileText, Layers, Pencil, ChevronDown, Network, Plus,
  Eye, Hash, Mail, UserX, AlertOctagon, RefreshCw, Hourglass, PauseCircle,
  ChevronsRight, CheckCircle2, KeyRound, UploadCloud
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   UC-HO-01 · Edge Cases — Sprint 1 every-exception coverage

   10 clickable states covering every edge case in UC-HO-01 v2.1's
   "Edge Cases & Error Handling" section (E1 through E10). Each
   state renders the precise UI/UX response defined in the spec,
   built on the current definition · 3-phase lifecycle (CL-088),
   approved shared workspaces only (CL-087), one-click initiation,
   command-view route (CL-089).

     E1  · Offboarder profile not provisioned          (Validation · BLOCK)
     E2  · RBAC scope cannot resolve                    (Validation · BLOCK)
     E3  · One data source fails to seed                (Network · PARTIAL)
     E4  · Sensitivity classification service paused    (Network · PAUSE)
     E5  · Manual initiation · no HR sync yet           (User branch · ALT)
     E6  · Manager customizes before starting           (User branch · ALT)
     E7  · No integrated shared workspaces              (User branch · ALT)
     E8  · Last working date <3 business days           (User branch · URGENT)
     E9  · >30% sensitivity exclusion after seeding     (User branch · ALT)
     E10 · Manager pauses on quick-initiate page        (User branch · IDLE)

   Edge-case kinds carry their own chrome accent:
     · BLOCK states use rose accent (E1, E2)
     · PAUSE / PARTIAL states use yellow accent (E3, E4)
     · ALT and URGENT states use violet / rose-edge accents (E5–E10)

   Canonical scenario · Hà Vy as Manager · varies offboarder per case
   to match the dev-spec scenario hints (Minh Lê for engineering,
   Khánh Linh for urgent / high-PII, Phương Anh for no-sources or
   manual initiation).
   ═══════════════════════════════════════════════════════════════════ */

const FLOW = [
  { id: "e1",  uc: "E1",  label: "Profile not provisioned",         kind: "block",   trigger: "Triggered at step 3 — lookup returns no ART-EEP profile." },
  { id: "e2",  uc: "E2",  label: "RBAC scope unresolvable",         kind: "block",   trigger: "Triggered at step 4 — directory lookup fails on Start session." },
  { id: "e3",  uc: "E3",  label: "One source fails to seed",        kind: "partial", trigger: "Triggered at step 5 — Drive OAuth token expired mid-extract." },
  { id: "e4",  uc: "E4",  label: "Classification service paused",   kind: "pause",   trigger: "Triggered at step 5 — sensitivity classification unreachable." },
  { id: "e5",  uc: "E5",  label: "Manual initiation",               kind: "alt",     trigger: "Triggered at step 1 — Manager creates session without HR sync." },
  { id: "e6",  uc: "E6",  label: "Customize before starting",       kind: "alt",     trigger: "Triggered at step 3 — Manager opens the customize expander." },
  { id: "e7",  uc: "E7",  label: "No integrated sources",           kind: "alt",     trigger: "Triggered at step 3 — no approved shared workspaces connected." },
  { id: "e8",  uc: "E8",  label: "Urgent · <3 business days",       kind: "urgent",  trigger: "Triggered at step 3 — last working date is fewer than 3 business days." },
  { id: "e9",  uc: "E9",  label: ">30% sensitivity exclusion",      kind: "alt",     trigger: "Triggered at step 6 — classification redacted >30% of one source." },
  { id: "e10", uc: "E10", label: "Page paused · no action taken",   kind: "idle",    trigger: "Triggered at step 3 — Manager opened the page but didn't click Start session." },
];

export default function UCHO01EdgeCases() {
  const [stepIdx, setStepIdx] = useState(0);
  const step = FLOW[stepIdx];
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      <TopBar step={step} stepIdx={stepIdx} onJump={setStepIdx} />
      <main className="flex-1">
        <CaseRenderer id={step.id} />
      </main>
      <FooterNav stepIdx={stepIdx} step={step} onChange={setStepIdx} />
    </div>
  );
}

/* ─── Chrome ──────────────────────────────────────────────────── */

function TopBar({ step, stepIdx, onJump }) {
  const accentColor = {
    block: "bg-rose-500",
    partial: "bg-yellow-500",
    pause: "bg-yellow-500",
    alt: "bg-violet-500",
    urgent: "bg-rose-500",
    idle: "bg-gray-400",
  }[step.kind];
  const accentText = {
    block: "text-rose-700",
    partial: "text-yellow-700",
    pause: "text-yellow-700",
    alt: "text-violet-700",
    urgent: "text-rose-700",
    idle: "text-gray-600",
  }[step.kind];
  const kindLabel = {
    block: "Block",
    partial: "Partial",
    pause: "Pause",
    alt: "Alternative",
    urgent: "Urgent",
    idle: "Idle",
  }[step.kind];
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="px-5 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
          <span className="text-gray-900 font-semibold tracking-[0.18em] text-xs" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>ART-EEP</span>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-gray-500 text-xs">UC-HO-01 · Edge cases</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-gray-500 shrink-0">
          <span className={`w-1.5 h-1.5 rounded-full ${accentColor}`} />
          <span className={`uppercase tracking-wider font-semibold ${accentText}`}>{kindLabel}</span>
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
            {step.trigger}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0 flex-wrap">
          {FLOW.map((s, i) => (
            <CaseDot key={s.id} step={s} active={i === stepIdx} onClick={() => onJump(i)} />
          ))}
        </div>
      </div>
    </header>
  );
}

function CaseDot({ step, active, onClick }) {
  const accent = {
    block: active ? "bg-rose-600 text-white border-rose-600" : "bg-white text-rose-700 border-rose-200 hover:border-rose-400",
    partial: active ? "bg-yellow-600 text-white border-yellow-600" : "bg-white text-yellow-700 border-yellow-200 hover:border-yellow-400",
    pause: active ? "bg-yellow-600 text-white border-yellow-600" : "bg-white text-yellow-700 border-yellow-200 hover:border-yellow-400",
    alt: active ? "bg-violet-600 text-white border-violet-600" : "bg-white text-violet-700 border-violet-200 hover:border-violet-400",
    urgent: active ? "bg-rose-600 text-white border-rose-600" : "bg-white text-rose-700 border-rose-200 hover:border-rose-400",
    idle: active ? "bg-gray-600 text-white border-gray-600" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400",
  }[step.kind];
  return (
    <button
      onClick={onClick}
      title={`${step.uc} · ${step.label}`}
      className={`h-7 px-2 rounded-md border text-[10px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${accent}`}
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

function CaseRenderer({ id }) {
  if (id === "e1") return <E1ProfileMissing />;
  if (id === "e2") return <E2RBACUnresolvable />;
  if (id === "e3") return <E3SourceFailed />;
  if (id === "e4") return <E4ClassificationPaused />;
  if (id === "e5") return <E5ManualInitiation />;
  if (id === "e6") return <E6CustomizeExpander />;
  if (id === "e7") return <E7NoSources />;
  if (id === "e8") return <E8UrgentTimeline />;
  if (id === "e9") return <E9HighExclusion />;
  if (id === "e10") return <E10PausedPage />;
  return null;
}

/* ═══════════════════════════════════════════════════════════════════
   E1 · Offboarder profile not provisioned
   ═══════════════════════════════════════════════════════════════════ */

function E1ProfileMissing() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <PageHeader
        eyebrow="/session/[id]/setup · blocked"
        title="Offboarder profile not found"
        actor="Hà Vy · Manager · Engineering"
      />

      <article className="rounded-lg border border-rose-200 bg-white overflow-hidden" style={{ borderLeft: "2px solid rgb(244, 63, 94)" }}>
        <div className="px-5 py-4 border-b border-gray-100 bg-rose-50/30 flex items-start gap-3">
          <div className="w-9 h-9 rounded-md bg-white border border-rose-200 flex items-center justify-center shrink-0">
            <UserX className="w-4 h-4 text-rose-700" strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900">Hoàng Anh Lê's profile does not exist in ART-EEP.</h3>
            <p className="text-[12px] text-gray-600 mt-1 leading-relaxed">
              HR created the departure record, but the ART-EEP user profile was never provisioned for this person. The handover session cannot be created until the profile is in place. <strong>No partial session record has been written.</strong>
            </p>
          </div>
        </div>

        <div className="px-5 py-4">
          <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium mb-2">What to do</div>
          <ol className="space-y-1.5 text-[12px] text-gray-700">
            <RemediationStep n={1}>Contact HR Admin and ask them to provision Hoàng Anh Lê's ART-EEP profile.</RemediationStep>
            <RemediationStep n={2}>Once the profile exists, return to your dashboard and click <strong>Start setup</strong> from the notification again.</RemediationStep>
            <RemediationStep n={3}>If provisioning is taking longer than 24 hours, escalate to Platform Admin with the error reference below.</RemediationStep>
          </ol>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-3 flex-wrap">
            <div className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
              ERR · UC-HO-01.EX.2 · 2026-05-29T14:18:42Z<br />
              attempted-uid · hoang-anh-le · not-found
            </div>
            <div className="flex items-center gap-2">
              <SecondaryButton><Mail className="w-3 h-3" />Notify HR Admin</SecondaryButton>
              <SecondaryButton><ChevronLeft className="w-3 h-3" />Back to dashboard</SecondaryButton>
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

/* ═══════════════════════════════════════════════════════════════════
   E2 · RBAC scope cannot resolve
   ═══════════════════════════════════════════════════════════════════ */

function E2RBACUnresolvable() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <PageHeader
        eyebrow="/session/[id]/setup · session creation halted"
        title="Authorization scope could not be established"
        actor="Hà Vy · Manager · Engineering"
      />

      <article className="rounded-lg border border-rose-200 bg-white overflow-hidden" style={{ borderLeft: "2px solid rgb(244, 63, 94)" }}>
        <div className="px-5 py-4 border-b border-gray-100 bg-rose-50/30 flex items-start gap-3">
          <div className="w-9 h-9 rounded-md bg-white border border-rose-200 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-4 h-4 text-rose-700" strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900">The session's authorization boundary could not be resolved.</h3>
            <p className="text-[12px] text-gray-600 mt-1 leading-relaxed">
              ART-EEP looked up Minh Lê's role authorizations and your authority over his record in the directory, but one of them came back missing or corrupted. The session was not created and nothing was written to the audit log.
            </p>
          </div>
        </div>

        <div className="px-5 py-4">
          <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium mb-2">What to do</div>
          <ol className="space-y-1.5 text-[12px] text-gray-700">
            <RemediationStep n={1}>The most common cause is a directory sync delay. Wait 10 minutes, then click <strong>Retry</strong>. If it succeeds, no further action is needed.</RemediationStep>
            <RemediationStep n={2}>If retry still fails, contact HR Admin with the error reference below. They will check Minh Lê's role record and the reporting hierarchy.</RemediationStep>
            <RemediationStep n={3}>If you are not the person who normally manages this Offboarder, ask the correct Manager to retry from their dashboard.</RemediationStep>
          </ol>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-3 flex-wrap">
            <div className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
              ERR · UC-HO-01.EX.5 · 2026-05-29T14:32:08Z<br />
              directory-trace · minh.le · scope-resolve-failed
            </div>
            <div className="flex items-center gap-2">
              <SecondaryButton><ChevronLeft className="w-3 h-3" />Back to dashboard</SecondaryButton>
              <PrimaryButton><RefreshCw className="w-3.5 h-3.5" />Retry</PrimaryButton>
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
   E3 · One data source fails to seed (partial)
   ═══════════════════════════════════════════════════════════════════ */

function E3SourceFailed() {
  return (
    <CommandViewLayout subtitle="Phase 1 · Prepare · partial completion · Drive OAuth token rejected">
      <CommandHero phaseIdx={0} subStageIdx={1} subStageLabel="Context seeding · partial" timeElapsed="8m 34s" subStageFraction="2 of 3" />
      <CommandTabs active="overview" />

      <Banner tone="warning" icon={AlertTriangle}>
        <strong>Context seeding from Google Drive could not be completed.</strong>{" "}
        Interview questions may be less targeted for topics covered by Drive. Jira and GitHub seeded successfully — the session can proceed.
      </Banner>

      <div className="grid grid-cols-[1fr_280px] gap-6">
        <div className="space-y-4">
          <FormSection title="Seeding pipeline" subtitle="Per-stage status · failed stage preserved for traceability.">
            <article className="rounded-lg border border-gray-200 bg-white overflow-hidden">
              <ProgressStage status="done" label="Establishing authorization scope" detail="RBAC resolved · 23 nodes in scope · 2 seconds" />
              <ProgressStage status="done" label="Decomposing the seeding job" detail="3 sources · Worker handles metadata · Expert reserved for gaps" />
              <ProgressStage status="done" label="Extracting Jira ticket metadata" detail="47 tickets · 1.4 minutes" />
              <ProgressStage status="done" label="Extracting GitHub metadata" detail="23 shared repos · 2.8 minutes" />
              <ProgressStage status="failed" label="Extracting Google Drive metadata" detail="OAuth refresh token rejected after 12 retries · escalated to Platform Admin" />
              <ProgressStage status="done" label="Sensitivity classification gate" detail="412 items classified · 21 redacted · 0 excluded" />
              <ProgressStage status="done" label="Inferring likely knowledge gaps" detail="Expert Agent · 38 seconds · 3 gaps flagged" />
              <ProgressStage status="done" label="Building the preliminary knowledge map" detail="Stored in session workspace · scoped to RBAC boundary" last />
            </article>
          </FormSection>

          <FormSection title="What we couldn't see" subtitle="Interview questions will be less detailed in these areas — priority prompts can help.">
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
                    The OAuth refresh token for Minh Lê's Drive expired before the scan completed. Platform Admin has the full retrieval trace and will re-issue access. You can re-run the Drive scan once that's done — or proceed without it.
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
              <SecondaryButton><RefreshCw className="w-3 h-3" />Retry Drive after re-auth</SecondaryButton>
              <PrimaryButton>Continue with partial seed<ArrowRight className="w-3.5 h-3.5" /></PrimaryButton>
            </div>
          </div>
        </div>

        <ActionSidebar
          title="Pipeline outcome"
          steps={[
            { label: "Jira", done: true },
            { label: "GitHub", done: true },
            { label: "Drive · failed", failed: true },
            { label: "Classification + map", done: true },
          ]}
          note="Session is created. Phase 1 ends with partial seed. Hà Vy decides whether to proceed or wait for Drive re-auth."
        />
      </div>
    </CommandViewLayout>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   E4 · Sensitivity classification service paused
   ═══════════════════════════════════════════════════════════════════ */

function E4ClassificationPaused() {
  return (
    <CommandViewLayout subtitle="Phase 1 · Prepare · paused at classification gate · no unclassified content staged">
      <CommandHero phaseIdx={0} subStageIdx={1} subStageLabel="Context seeding · paused" timeElapsed="6m 22s" subStageFraction="paused" />
      <CommandTabs active="overview" />

      <Banner tone="warning" icon={PauseCircle}>
        <strong>Status · Seeding paused — classification service unavailable.</strong>{" "}
        The pipeline will automatically retry every 15 minutes for up to 4 hours. If the service does not recover in that window, Platform Admin will be notified to re-trigger seeding manually. Phase 1 cannot advance until the gate clears.
      </Banner>

      <div className="grid grid-cols-[1fr_280px] gap-6">
        <div className="space-y-4">
          <FormSection title="Where the pipeline halted" subtitle="Sources extracted cleanly · the gate is the only block.">
            <article className="rounded-lg border border-gray-200 bg-white overflow-hidden">
              <ProgressStage status="done" label="Establishing authorization scope" detail="RBAC resolved · audit anchor written" />
              <ProgressStage status="done" label="Decomposing the seeding job" />
              <ProgressStage status="done" label="Extracting Jira ticket metadata" detail="47 tickets · 1.4 minutes" />
              <ProgressStage status="done" label="Extracting GitHub metadata" detail="23 shared repos · 2.8 minutes" />
              <ProgressStage status="done" label="Extracting Google Drive metadata" detail="412 files · 2.1 minutes" />
              <ProgressStage status="paused" label="Sensitivity classification gate" detail="Service unreachable · halted · NEVER falling back to unclassified content" />
              <ProgressStage status="pending" label="Inferring likely knowledge gaps" detail="Waits for full classified context" />
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
                <StatPill label="Last attempt" value="3 min ago" />
                <StatPill label="Next retry" value="in 12 min" />
                <StatPill label="Time remaining" value="3h 42m" />
              </div>
              <div className="text-[11px] text-yellow-900/80 leading-relaxed space-y-1">
                <p><strong>If the service recovers within the window</strong> · seeding resumes from the classification stage automatically. You'll be notified when the map is ready.</p>
                <p><strong>If 4 hours pass without recovery</strong> · Platform Admin gets a high-priority alert and will re-trigger seeding manually once the service is back.</p>
              </div>
            </div>
          </FormSection>

          <p className="text-[11px] text-gray-500 leading-relaxed">
            <span className="text-gray-700 font-medium">Why we halt rather than fall back ·</span> the classification gate is a hard requirement. Letting unclassified content into the staging area — even temporarily — would violate the data-handling policy at the architecture level, so the pipeline pauses cleanly rather than degrading.
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <GhostButton>View error logs</GhostButton>
            <div className="flex items-center gap-2">
              <SecondaryButton><ChevronLeft className="w-3 h-3" />Back to dashboard</SecondaryButton>
              <SecondaryButton><RefreshCw className="w-3 h-3" />Try now</SecondaryButton>
            </div>
          </div>
        </div>

        <ActionSidebar
          title="Phase 1 · paused"
          steps={[
            { label: "Sources extracted", done: true },
            { label: "Classification gate", paused: true },
            { label: "Map build" },
          ]}
          note="Platform Admin will alert if the service doesn't recover in 4 hours. Phase 1 won't advance until the gate clears."
        />
      </div>
    </CommandViewLayout>
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
   E5 · Manual initiation · no HR sync yet
   ═══════════════════════════════════════════════════════════════════ */

function E5ManualInitiation() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader
        eyebrow="/session/[id]/setup · manual initiation · audit-flagged"
        title="Create a manual handover session"
        subtitle="HR has not yet synced this departure. Manually enter the basics — HR Admin will be notified to reconcile."
        actor="Hà Vy · Manager · Sales"
      />

      <Banner tone="muted" icon={Info}>
        <strong>This session will be flagged in the audit trail.</strong>{" "}
        <code className="text-gray-900 bg-gray-50 px-1 py-0.5 rounded text-[10px]">Manual Initiation</code>.{" "}
        HR Admin will be notified to sync the official departure record.
      </Banner>

      <FormSection title="Offboarder details" subtitle="Enter manually — HR sync hasn't reached ART-EEP yet.">
        <div className="space-y-2">
          <ManualField label="Full name" value="Phương Anh Nguyễn" />
          <ManualField label="Role" value="Senior Account Executive" />
          <ManualField label="Department" value="Sales" />
          <ManualField label="Last working date" value="June 12, 2026" icon={Calendar} mono />
        </div>
      </FormSection>

      <FormSection title="Why are you initiating manually?" subtitle="Optional · helps HR Admin reconcile records once they sync.">
        <textarea
          defaultValue="Departure agreed informally on Tuesday. HR sync expected within 24 hours but the Vendor XYZ renewal closes Friday — initiating now so the interview can happen before that deadline."
          className="w-full min-h-[72px] px-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/15 transition-colors resize-none"
          style={{ fontFamily: "inherit" }}
        />
      </FormSection>

      <FormSection title="Sources available for this account" subtitle="Confirmed via OAuth · approved shared workspaces only.">
        <div className="space-y-2">
          <SourceRow icon={Briefcase} name="Salesforce" detail="38 active deals · pipeline + activity log" selected />
          <SourceRow icon={Calendar} name="Shared Calendar" detail="6 months of customer-facing meetings" selected />
          <SourceRow icon={Folder} name="SharePoint · Sales" detail="124 files · titles and edit recency only" selected />
        </div>
      </FormSection>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <GhostButton>Cancel · wait for HR sync</GhostButton>
        <PrimaryButton>
          Start session
          <ArrowRight className="w-3.5 h-3.5" />
        </PrimaryButton>
      </div>

      <p className="text-[11px] text-gray-500 mt-5 leading-relaxed">
        <span className="text-gray-700 font-medium">After you start ·</span> the session creates with a <code className="text-gray-900 bg-gray-50 px-1 rounded text-[10px]">Manual Initiation</code> flag on the audit anchor. HR Admin will be notified to reconcile the official record. Everything else proceeds identically — Phase 1 · Prepare begins immediately.
      </p>
    </div>
  );
}

function ManualField({ label, value, icon: Icon, mono }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-white px-3 py-2 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-500/15 transition-colors">
      <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium w-32 shrink-0">{label}</div>
      <div className="flex-1 flex items-center gap-2">
        {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />}
        <input defaultValue={value} className="flex-1 text-sm text-gray-900 bg-transparent outline-none" style={mono ? { fontFamily: "ui-monospace, Menlo, monospace" } : undefined} />
      </div>
      <Pencil className="w-3 h-3 text-gray-300" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   E6 · Customize expander opened
   ═══════════════════════════════════════════════════════════════════ */

function E6CustomizeExpander() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader
        eyebrow="/session/[id]/setup · customizing"
        title="Customize Minh Lê's session before starting"
        subtitle="Defaults remain in effect unless you change something. CTA stays in the same place — one click ships."
        actor="Hà Vy · Manager · Engineering"
      />

      <FormSection title="Offboarder">
        <div className="rounded-lg border border-gray-200 bg-white p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-violet-50 border border-violet-200 flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-violet-700">ML</span>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900">Minh Lê · Senior Backend Engineer</h3>
            <p className="text-[11px] text-gray-500">Engineering · Last working day June 4, 2026</p>
          </div>
        </div>
      </FormSection>

      <article className="rounded-lg border border-violet-200 bg-violet-50/30 overflow-hidden mb-6">
        <div className="px-4 py-2.5 bg-violet-50 border-b border-violet-200 flex items-center gap-2">
          <ChevronDown className="w-3.5 h-3.5 text-violet-700" strokeWidth={1.75} />
          <span className="text-xs font-semibold text-violet-900">Customize before starting · expander open</span>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-[0.18em] text-gray-600 font-medium block mb-1.5">Review deadline</label>
            <div className="rounded-md border border-gray-200 bg-white p-2.5 flex items-center gap-3 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-500/15 transition-colors">
              <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" strokeWidth={1.75} />
              <input defaultValue="June 8, 2026 · 17:00" className="flex-1 text-sm text-gray-900 bg-transparent outline-none" style={{ fontFamily: "ui-monospace, Menlo, monospace" }} />
              <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>+3 business days</span>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.18em] text-gray-600 font-medium block mb-1.5">Approved shared workspaces · uncheck to exclude</label>
            <div className="space-y-1.5">
              <SourceRow icon={GitBranch} name="Jira" detail="47 active tickets · 6 months of comments" selected />
              <SourceRow icon={Github} name="GitHub" detail="23 shared repos · PR descriptions, commit messages, wiki pages — uncheck if mostly archived legacy" selected />
              <SourceRow icon={Folder} name="Google Drive · shared" detail="412 files · titles and edit recency · content read only during interview" selected />
            </div>
            <p className="text-[10px] text-gray-500 mt-2 leading-relaxed flex items-start gap-1.5">
              <ShieldCheck className="w-3 h-3 mt-0.5 shrink-0 text-gray-400" />
              <span>Email, personal directories, and private messaging are never scanned. Personal files reach the system only via manual upload by Minh Lê during the interview.</span>
            </p>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.18em] text-gray-600 font-medium block mb-1.5">Focus note · optional</label>
            <textarea
              placeholder="For example · 'Prioritize Project Atlas and the Payment Gateway timeout — Trần Hữu Nam needs to hit the ground running on both.'"
              className="w-full min-h-[64px] px-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/15 transition-colors resize-none"
              style={{ fontFamily: "inherit" }}
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.18em] text-gray-600 font-medium block mb-1.5">Successor · reassign if needed</label>
            <div className="rounded-md border border-gray-200 bg-white p-2.5 flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-semibold text-emerald-700">TN</span>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-900">Trần Hữu Nam</div>
                <div className="text-[10px] text-gray-500">Pre-assigned from HR · onboarding starts after KG commit</div>
              </div>
              <button className="text-[11px] text-violet-700 hover:text-violet-900 font-medium">Reassign</button>
            </div>
          </div>
        </div>
      </article>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <GhostButton>Cancel · back to dashboard</GhostButton>
        <PrimaryButton>
          Start session
          <ArrowRight className="w-3.5 h-3.5" />
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   E7 · No integrated shared workspaces
   ═══════════════════════════════════════════════════════════════════ */

function E7NoSources() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader
        eyebrow="/session/[id]/setup · no automated context"
        title="Start Phương Anh's handover · generic interview mode"
        subtitle="No approved shared workspaces are connected. The interview will use a role-based question bank instead of seeded context."
        actor="Hà Vy · Manager · Sales"
      />

      <Banner tone="warning" icon={AlertTriangle}>
        <strong>No integrated shared workspaces are available for Phương Anh Nguyễn.</strong>{" "}
        Context seeding will be skipped. The interview will use a generic question bank based on her role and department.
      </Banner>

      <FormSection title="Offboarder">
        <div className="rounded-lg border border-gray-200 bg-white p-4 flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-violet-50 border border-violet-200 flex items-center justify-center shrink-0">
            <span className="text-base font-semibold text-violet-700">PA</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900">Phương Anh Nguyễn</h3>
            <p className="text-xs text-gray-500 mt-0.5">Senior Account Executive · Sales</p>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>Last working day · <span className="text-gray-900 font-medium" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>June 12, 2026</span> · 19 days remaining</span>
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection title="Data sources" subtitle="None found for this account.">
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50/40 p-5 flex items-start gap-3">
          <div className="w-9 h-9 rounded-md bg-white border border-gray-200 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4 text-gray-400" strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900">No integrated shared workspaces found</h4>
            <p className="text-[12px] text-gray-600 mt-1 leading-relaxed">
              Phương Anh's tools either aren't integrated with ART-EEP or her account no longer has access. The interview will run from a generic question bank tailored to her role.
            </p>
            <div className="mt-2.5 flex items-center gap-2 flex-wrap">
              <span className="text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold bg-yellow-50 border border-yellow-200 text-yellow-800">
                Session flag · No Context — Generic Interview
              </span>
              <span className="text-[10px] text-gray-500">Per UC-HO-02 EX.4.</span>
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection title="Alternative · upload context manually" subtitle="Phương Anh can upload files during her interview if she wants.">
        <article className="rounded-lg border border-gray-200 bg-white p-3 flex items-start gap-3">
          <div className="w-8 h-8 rounded-md bg-violet-50 border border-violet-200 flex items-center justify-center shrink-0">
            <UploadCloud className="w-4 h-4 text-violet-600" strokeWidth={1.75} />
          </div>
          <div className="flex-1">
            <p className="text-[12px] text-gray-700 leading-relaxed">
              During UC-HO-02 voice interview, Phương Anh will see an Upload affordance · she can attach decks, contract PDFs, or specific reference files relevant to the handover. Anything uploaded passes through the same sensitivity classification gate before staging.
            </p>
          </div>
        </article>
      </FormSection>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <GhostButton>Cancel · back to dashboard</GhostButton>
        <PrimaryButton>
          Start session · no seeding
          <ArrowRight className="w-3.5 h-3.5" />
        </PrimaryButton>
      </div>

      <p className="text-[11px] text-gray-500 mt-5 leading-relaxed">
        <span className="text-gray-700 font-medium">What this means downstream ·</span> Phương Anh's interview won't have project-specific context, so it will rely on role-level questions. Priority prompts via UC-HO-05 can still steer it toward known concerns.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   E8 · Urgent · last working date <3 business days
   ═══════════════════════════════════════════════════════════════════ */

function E8UrgentTimeline() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader
        eyebrow="/session/[id]/setup · urgent · auto-reduced deadline"
        title="Start Khánh Linh's handover — urgent"
        subtitle="Last working date is fewer than 3 business days away. Review deadline auto-reduced. Schedule the interview as soon as possible."
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
                Critical · Khánh Linh Trần's last working date is in 2 business days.
              </h3>
              <span className="text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold bg-rose-100 border border-rose-200 text-rose-700">Urgent</span>
            </div>
            <p className="text-[12px] text-rose-900/90 leading-relaxed">
              The review deadline has been auto-adjusted to <strong>May 30, 2026 · 17:00</strong> (one business day before her last day). You can override it within the customize expander, but you can't push past May 31, 2026. Schedule the interview as soon as possible — the Offboarder's notification will include an urgency flag.
            </p>
          </div>
        </div>
      </article>

      <FormSection title="Offboarder">
        <div className="rounded-lg border border-gray-200 bg-white p-4 flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
            <span className="text-base font-semibold text-rose-700">KL</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900">Khánh Linh Trần</h3>
            <p className="text-xs text-gray-500 mt-0.5">Head of People Operations · People & Culture</p>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-rose-700 font-medium">
              <Calendar className="w-3 h-3" />
              <span>Last working day · <span style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>May 31, 2026</span> · 2 days remaining</span>
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection title="Session defaults · auto-adjusted">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-rose-200 bg-rose-50/30 p-3" style={{ borderLeft: "2px solid rgb(244, 63, 94)" }}>
            <div className="flex items-center gap-1.5 mb-2">
              <Calendar className="w-3 h-3 text-rose-700" strokeWidth={1.75} />
              <span className="text-[10px] uppercase tracking-[0.18em] text-rose-700 font-medium">Review deadline</span>
            </div>
            <div className="text-sm font-semibold text-gray-900">May 30 · 17:00</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-700 uppercase tracking-wider font-semibold">Auto-reduced</span>
            </div>
          </div>
          <DefaultTile icon={Database} label="Data sources" value="3 integrated" detail="HRIS · Notion · SharePoint" />
          <DefaultTile icon={Clock} label="Estimated seeding" value="~9 minutes" detail="Larger HR record volume" />
        </div>
      </FormSection>

      <FormSection title="Focus note · recommended given the short notice">
        <textarea
          defaultValue="Khánh Linh's notice is short — prioritize the most recent policy decisions and pending HR cases over historical context."
          className="w-full min-h-[64px] px-3 py-2 rounded-md border border-rose-200 bg-white text-sm text-gray-900 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/15 transition-colors resize-none"
          style={{ fontFamily: "inherit" }}
        />
      </FormSection>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <GhostButton>Cancel · back to dashboard</GhostButton>
        <PrimaryButton>
          Start session · expedited
          <ArrowRight className="w-3.5 h-3.5" />
        </PrimaryButton>
      </div>
    </div>
  );
}

function DefaultTile({ icon: Icon, label, value, detail }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="flex items-center gap-1.5 mb-2">
        <Icon className="w-3 h-3 text-gray-500" strokeWidth={1.75} />
        <span className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium">{label}</span>
      </div>
      <div className="text-sm font-semibold text-gray-900">{value}</div>
      <div className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{detail}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   E9 · >30% sensitivity exclusion after seeding
   ═══════════════════════════════════════════════════════════════════ */

function E9HighExclusion() {
  return (
    <CommandViewLayout subtitle="Phase 1 · Prepare · complete with high exclusion rate · two parallel actions offered">
      <CommandHero phaseIdx={0} subStageIdx={2} subStageLabel="Knowledge map ready · high exclusion" timeElapsed="9m 18s" subStageFraction="3 of 3" actorOverride="Khánh Linh Trần · Head of People Operations · last day May 31" actorInitials="KL" />
      <CommandTabs active="overview" />

      <div className="grid grid-cols-[1fr_280px] gap-6">
        <div className="space-y-4">
          <article className="rounded-lg border border-yellow-200 bg-yellow-50/50 overflow-hidden">
            <div className="px-4 py-3.5 flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-white border border-yellow-200 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-yellow-700" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-yellow-900 mb-1">
                  A significant portion of Khánh Linh's activity involves sensitive content.
                </h3>
                <p className="text-[12px] text-yellow-900/90 leading-relaxed mb-3">
                  <strong>43% of her scanned content was excluded by sensitivity classification.</strong>{" "}
                  This is expected for People Operations roles — much of her work concerns personnel cases, salary discussions, and policy disputes. Interview questions may be less detailed for those areas.
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <PrimaryButton><Plus className="w-3 h-3" />Add priority prompts</PrimaryButton>
                  <SecondaryButton><Eye className="w-3 h-3" />Request override review</SecondaryButton>
                  <span className="text-[10px] text-yellow-800/80 ml-1 max-w-xs leading-relaxed">
                    HR + Legal will examine whether the classification rules are over-broad for this role.
                  </span>
                </div>
              </div>
            </div>
          </article>

          <div className="grid grid-cols-4 gap-3">
            <SummaryStat value="568" label="Items detected" />
            <SummaryStat value="243" label="Excluded by classification" tone="warning" />
            <SummaryStat value="325" label="Items in scope" />
            <SummaryStat value="4" label="Likely knowledge gaps" tone="warning" />
          </div>

          <FormSection title="Top areas by activity">
            <div className="grid grid-cols-3 gap-3">
              <ProjectCard icon={Users} name="Performance review cycle Q1" detail="34% of activity · cross-team" />
              <ProjectCard icon={FileText} name="Policy revision · remote work" detail="22% of activity · ongoing" />
              <ProjectCard icon={Briefcase} name="Compensation framework v3" detail="18% of activity · paused" />
            </div>
          </FormSection>

          <FormSection title="Likely knowledge gaps" subtitle="High activity, sparse documentation. The interview should probe these.">
            <div className="rounded-lg border border-yellow-200 bg-yellow-50/30 p-4">
              <ul className="space-y-2.5">
                <KnowledgeGap title="Compensation framework v3 · paused mid-revision" detail="9 in-flight cases · no decision log committed since March" />
                <KnowledgeGap title="High-sensitivity disciplinary cases" detail="Mostly excluded — Khánh Linh likely holds context not in any retained document" />
                <KnowledgeGap title="Vendor selection · benefits provider" detail="Active conversations · no shortlist captured in writing" />
                <KnowledgeGap title="Policy revision · remote work" detail="Recent edits not yet reflected in the published handbook" />
              </ul>
            </div>
          </FormSection>
        </div>

        <ActionSidebar
          title="Two parallel paths"
          steps={[
            { label: "Add priority prompts", active: true },
            { label: "OR request override review", active: true },
          ]}
          note="Per CL-057 · both actions are peer options. Adding prompts steers the interview. Override review may relax the classification rules for this role."
        />
      </div>

      <p className="text-[11px] text-gray-500 mt-3 leading-relaxed">
        <span className="text-gray-700 font-medium">For the audit log ·</span> the exclusion volume (243 items across 9 minutes of seeding) has been recorded with the session anchor for HR Admin review and future policy refinement.
      </p>
    </CommandViewLayout>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   E10 · Manager pauses on the quick-initiate page
   ═══════════════════════════════════════════════════════════════════ */

function E10PausedPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Banner tone="muted" icon={Clock}>
        <strong>Session timeout · no draft has been written.</strong>{" "}
        You opened this page but didn't click <em>Start session</em>. The pre-filled defaults are preserved · the audit anchor has NOT been written. You can resume here or close this tab — nothing was lost, nothing was committed.
      </Banner>

      <PageHeader
        eyebrow="/session/[id]/setup · paused · no draft written"
        title="Start Minh Lê's handover"
        subtitle="Page state preserved · click Start session when you're ready, or close this tab to discard."
        actor="Hà Vy · Manager · Engineering"
      />

      <FormSection title="Offboarder">
        <div className="rounded-lg border border-gray-200 bg-white p-4 flex items-start gap-4 opacity-90">
          <div className="w-12 h-12 rounded-lg bg-violet-50 border border-violet-200 flex items-center justify-center shrink-0">
            <span className="text-base font-semibold text-violet-700">ML</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900">Minh Lê</h3>
            <p className="text-xs text-gray-500 mt-0.5">Senior Backend Engineer · Engineering</p>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>Last working day · <span className="text-gray-900 font-medium" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>June 4, 2026</span> · 12 days remaining</span>
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection title="Session defaults · still loaded">
        <div className="grid grid-cols-3 gap-3 opacity-90">
          <DefaultTile icon={Calendar} label="Review deadline" value="June 8, 2026" detail="+3 business days after the interview" />
          <DefaultTile icon={Database} label="Data sources" value="3 integrated" detail="Jira · GitHub · Drive shared" />
          <DefaultTile icon={Clock} label="Estimated seeding" value="~7 minutes" detail="Background · you can leave the page" />
        </div>
      </FormSection>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <GhostButton>Cancel · back to dashboard</GhostButton>
        <PrimaryButton>
          Start session
          <ArrowRight className="w-3.5 h-3.5" />
        </PrimaryButton>
      </div>

      <p className="text-[11px] text-gray-500 mt-5 leading-relaxed">
        <span className="text-gray-700 font-medium">Why nothing was committed ·</span> the audit anchor is written only when you click <em>Start session</em>. A paused page has no audit footprint — by design. If you come back later, the defaults reload from the HR record exactly as you saw them now.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Shared command-view primitives
   ═══════════════════════════════════════════════════════════════════ */

function CommandViewLayout({ subtitle, children }) {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">/session/[id] · command view</span>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight mt-1">Session command view</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-1 leading-relaxed">{subtitle}</p>}
        </div>
        <span className="text-[11px] text-gray-500 shrink-0 pt-1">Hà Vy · Manager</span>
      </div>
      {children}
    </div>
  );
}

function CommandHero({ phaseIdx, subStageIdx, subStageLabel, timeElapsed, subStageFraction, actorOverride, actorInitials }) {
  const phases = [
    { label: "Prepare", subStages: 3, actor: "Manager + System" },
    { label: "Capture", subStages: 3, actor: "Offboarder + Manager" },
    { label: "Deliver", subStages: 2, actor: "System + Successor" },
  ];
  const initials = actorInitials || "ML";
  const name = actorOverride || "Minh Lê · Senior Backend Engineer · last day June 4";
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-5 mb-4">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-violet-50 border border-violet-200 flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-violet-700">{initials}</span>
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">{name.split(" · ")[0]}</h2>
            <p className="text-[11px] text-gray-500">{name.split(" · ").slice(1).join(" · ")}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-[0.18em] text-violet-700 font-semibold">Phase {phaseIdx + 1} · {phases[phaseIdx].label}</div>
          <div className="text-sm font-medium text-gray-900 mt-0.5">{subStageLabel}</div>
          <div className="text-[10px] text-gray-500 mt-0.5" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
            {subStageFraction ? `${subStageFraction} sub-stages · ` : ""}{timeElapsed} elapsed
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {phases.map((p, i) => {
          const isComplete = i < phaseIdx;
          const isActive = i === phaseIdx;
          const fillPct = isActive && typeof subStageIdx === "number" ? Math.round(((subStageIdx + 1) / p.subStages) * 100) : 0;
          return (
            <div key={p.label} className="flex-1">
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden relative">
                {isComplete && <div className="absolute inset-0 bg-emerald-400" />}
                {isActive && <div className="absolute inset-y-0 left-0 bg-violet-500" style={{ width: `${Math.max(fillPct, 8)}%` }} />}
              </div>
              <div className={`flex items-center justify-between mt-1.5 ${isComplete ? "text-emerald-700" : isActive ? "text-violet-700" : "text-gray-400"}`}>
                <span className="text-[10px] uppercase tracking-wider font-semibold">Phase {i + 1} · {p.label}</span>
                <span className="text-[9px]">{p.actor}</span>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function CommandTabs({ active }) {
  const tabs = ["Overview", "Stages", "Data", "Audit log", "Settings"];
  return (
    <nav className="border-b border-gray-200 flex items-center gap-1 mb-4">
      {tabs.map((t) => {
        const isActive = t.toLowerCase() === active.toLowerCase();
        return (
          <button key={t} className={`px-3 h-9 text-xs font-medium border-b-2 transition-colors -mb-px ${isActive ? "text-violet-700 border-violet-600" : "text-gray-500 border-transparent hover:text-gray-900"}`}>
            {t}
          </button>
        );
      })}
    </nav>
  );
}

function ActionSidebar({ title, steps, note }) {
  return (
    <aside className="rounded-lg border border-gray-200 bg-white p-4 self-start">
      <h3 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wider">{title}</h3>
      <ol className="space-y-2 mb-3">
        {steps.map((s, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
              s.done ? "bg-emerald-50 border-emerald-300" :
              s.failed ? "bg-rose-50 border-rose-300" :
              s.paused ? "bg-yellow-50 border-yellow-300" :
              s.active ? "bg-violet-50 border-violet-300" :
              "bg-white border-gray-200"
            }`}>
              {s.done ? <Check className="w-2.5 h-2.5 text-emerald-700" strokeWidth={2.5} /> :
               s.failed ? <X className="w-2.5 h-2.5 text-rose-700" strokeWidth={2.5} /> :
               s.paused ? <PauseCircle className="w-2.5 h-2.5 text-yellow-700" /> :
               s.active ? <Loader2 className="w-2.5 h-2.5 text-violet-600 animate-spin" /> : null}
            </span>
            <span className={`text-[11px] leading-relaxed ${
              s.done ? "text-gray-700" :
              s.failed ? "text-rose-700 font-medium" :
              s.paused ? "text-yellow-700 font-medium" :
              s.active ? "text-gray-900 font-medium" :
              "text-gray-500"
            }`}>{s.label}</span>
          </li>
        ))}
      </ol>
      {note && <p className="text-[10px] text-gray-500 leading-relaxed border-t border-gray-100 pt-2.5">{note}</p>}
    </aside>
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
      {title && <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>}
      {subtitle && <p className="text-[12px] text-gray-500 mb-2.5 leading-relaxed">{subtitle}</p>}
      {children}
    </section>
  );
}

function Banner({ tone, icon: Icon, children }) {
  const cfg = {
    critical: { cls: "border-rose-200 bg-rose-50/50", iconCls: "text-rose-600", textCls: "text-rose-900" },
    warning: { cls: "border-yellow-200 bg-yellow-50/60", iconCls: "text-yellow-700", textCls: "text-yellow-900" },
    muted: { cls: "border-gray-200 bg-gray-50/60", iconCls: "text-gray-500", textCls: "text-gray-700" },
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
    done: { icon: Check, iconCls: "text-emerald-600 bg-emerald-50 border-emerald-200", labelCls: "text-gray-900" },
    active: { icon: Loader2, iconCls: "text-violet-600 bg-violet-50 border-violet-200 animate-spin", labelCls: "text-gray-900 font-medium" },
    pending: { icon: Clock, iconCls: "text-gray-300 bg-white border-gray-200", labelCls: "text-gray-400" },
    failed: { icon: X, iconCls: "text-rose-600 bg-rose-50 border-rose-200", labelCls: "text-rose-900 font-medium" },
    skipped: { icon: ChevronsRight, iconCls: "text-gray-400 bg-gray-50 border-gray-200", labelCls: "text-gray-400 line-through" },
    paused: { icon: PauseCircle, iconCls: "text-yellow-700 bg-yellow-50 border-yellow-200", labelCls: "text-yellow-900 font-medium" },
  }[status];
  const Icon = config.icon;
  return (
    <div className={`px-4 py-2.5 flex items-start gap-3 ${!last ? "border-b border-gray-100" : ""}`}>
      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${config.iconCls}`}>
        <Icon className="w-2.5 h-2.5" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-xs ${config.labelCls}`}>{label}</div>
        {detail && <div className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{detail}</div>}
      </div>
    </div>
  );
}

function SourceRow({ icon: Icon, name, detail, selected }) {
  return (
    <label className="flex items-start gap-3 rounded-md border border-gray-200 bg-white px-3 py-2 cursor-pointer hover:border-gray-300 transition-colors">
      <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${selected ? "bg-violet-600 border-violet-600" : "bg-white border-gray-300"}`}>
        {selected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
      </span>
      <Icon className="w-3.5 h-3.5 text-gray-500 mt-0.5 shrink-0" strokeWidth={1.75} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900">{name}</div>
        <div className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{detail}</div>
      </div>
    </label>
  );
}

function SummaryStat({ value, label, tone, subtle }) {
  const cfg = {
    default: { border: "border-gray-200", bg: "bg-white", valueCls: "text-gray-900", labelCls: "text-gray-500" },
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

function RemediationStep({ n, children }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="w-4 h-4 rounded-full bg-gray-100 text-gray-600 text-[10px] font-semibold inline-flex items-center justify-center shrink-0 mt-0.5">{n}</span>
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}

function PrimaryButton({ onClick, children }) {
  return (
    <button onClick={onClick} className="h-8 px-3 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30">
      {children}
    </button>
  );
}

function SecondaryButton({ onClick, children }) {
  return (
    <button onClick={onClick} className="h-8 px-3 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
      {children}
    </button>
  );
}

function GhostButton({ onClick, children }) {
  return (
    <button onClick={onClick} className="h-8 px-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 text-xs font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
      {children}
    </button>
  );
}
