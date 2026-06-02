"use client";

import React, { useState } from "react";
import {
  ChevronLeft, ChevronRight, Check, AlertTriangle, AlertCircle, Info,
  Plus, Pencil, Calendar, Github, Folder, GitBranch, Briefcase, ShieldCheck,
  Lock, Sparkles, ArrowRight, ArrowUpRight, Database, Eye, Tag, Network,
  MessageSquare, FileText, Users, Layers
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   UC-HO-01 · Alternative Courses — clickable flow

   Four screens, one per AC. Originally traced to UC-HO-01 v2.0 but
   AC.2 has been REPURPOSED — email is no longer a data source per
   the data-ingestion governance rule, so the original "Email excluded"
   alternative course has been replaced with the more general
   "Manager deselects a shared workspace" pattern, using GitHub as the
   demonstration case.

     AC.1 — Manual initiation (no HR sync)
     AC.2 — Manager deselects a data source (GitHub example)
     AC.3 — Offboarder has no integrated data sources
     AC.4 — Sensitivity classification excludes >30% of content

   Sources used throughout are restricted to approved shared
   workspaces · Jira · GitHub · Google Drive (shared) · SharePoint ·
   Trello · Microsoft Planner. Email, personal directories, and
   private messaging are NEVER scanned.

   Honors the locked S1 v2 visual system:
     · CL-054 violet primary + pastel yellow secondary
     · CL-055 primary CTAs · 32px button height
     · CL-057 AC.4 offers two parallel actions
     · CL-059 explicit focus rings
     · CL-060 AI-generated content on violet-tinted background
     · CL-062 yellow dot bullets for knowledge gaps
     · CL-013 no vendor names in user copy
     · CL-012 "sensitive content" not "PII"
   ═══════════════════════════════════════════════════════════════════ */

const FLOW = [
  { id: "ac1", uc: "AC.1", label: "Manual initiation",         trigger: "Triggered at step 1 — HR sync hasn't occurred yet." },
  { id: "ac2", uc: "AC.2", label: "Source deselected",         trigger: "Triggered at step 4 — Manager deselects a shared workspace (GitHub) for relevance." },
  { id: "ac3", uc: "AC.3", label: "No integrated sources",     trigger: "Triggered at step 3 — no integrations available for this account." },
  { id: "ac4", uc: "AC.4", label: "High sensitivity exclusion",trigger: "Triggered at step 8 — classification redacts >30% of one source." },
];

const SCENARIO = {
  ac1: { name: "Phương Anh Nguyễn", role: "Senior Account Executive", dept: "Sales",            lastDay: "June 12, 2026" },
  ac2: { name: "Minh Lê",           role: "Senior Backend Engineer",   dept: "Engineering",      lastDay: "June 4, 2026"  },
  ac3: { name: "Phương Anh Nguyễn", role: "Senior Account Executive", dept: "Sales",            lastDay: "June 12, 2026" },
  ac4: { name: "Khánh Linh Trần",   role: "Head of People Operations", dept: "People & Culture", lastDay: "May 31, 2026"  },
};

export default function UCHO01AlternativeCoursesFlow() {
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
          <span className="text-gray-500 text-xs">UC-HO-01 · Alternative courses</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-gray-500 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
          <span className="uppercase tracking-wider font-semibold text-violet-700">Alternative course</span>
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
            Scenario · <span className="text-gray-700 font-medium">{scenario.name}</span> · {scenario.role}
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
          ? "bg-violet-600 text-white border-violet-600"
          : "bg-white text-violet-700 border-violet-200 hover:border-violet-400"
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
  if (id === "ac1") return <AC1ManualInitiation scenario={scenario} />;
  if (id === "ac2") return <AC2SourceDeselected scenario={scenario} />;
  if (id === "ac3") return <AC3NoSources scenario={scenario} />;
  if (id === "ac4") return <AC4HighExclusion scenario={scenario} />;
  return null;
}

/* ═══════════════════════════════════════════════════════════════════
   AC.1 — Manual initiation (no HR sync)
   ═══════════════════════════════════════════════════════════════════ */

function AC1ManualInitiation({ scenario }) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader
        eyebrow="Offboarding module · manual entry"
        title="Create a manual handover session"
        subtitle="Use this when HR has not yet synced the departure record. All other steps proceed normally."
        actor="Hà Vy · Manager · Sales"
      />

      <Banner tone="muted" icon={Info}>
        <strong>This session will be flagged in the audit trail.</strong>{" "}
        <code className="text-gray-900 bg-gray-50 px-1 py-0.5 rounded text-[10px]">Manual Initiation</code>.{" "}
        HR Admin will be notified to sync the official departure record.
      </Banner>

      <FormSection title="Offboarder details" subtitle="Enter manually — HR sync hasn't reached ART-EEP yet.">
        <div className="space-y-2">
          <ManualField label="Full name"         value={scenario.name} />
          <ManualField label="Role"              value={scenario.role} />
          <ManualField label="Department"        value={scenario.dept} />
          <ManualField label="Last working date" value={scenario.lastDay} icon={Calendar} mono />
        </div>
      </FormSection>

      <FormSection title="Why are you initiating manually?" subtitle="Optional · helps HR Admin reconcile records once they sync.">
        <textarea
          defaultValue="Departure agreed informally on Tuesday. HR sync expected within 24 hours but the Vendor XYZ renewal closes Friday — initiating now so the interview can happen before that deadline."
          className="w-full min-h-[72px] px-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/15 transition-colors resize-none"
          style={{ fontFamily: "inherit" }}
        />
      </FormSection>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <GhostButton>Cancel · wait for HR sync</GhostButton>
        <PrimaryButton>
          Continue to session setup
          <ArrowRight className="w-3.5 h-3.5" />
        </PrimaryButton>
      </div>

      <p className="text-[11px] text-gray-500 mt-5 leading-relaxed">
        <span className="text-gray-700 font-medium">After you continue ·</span> the wizard proceeds identically to the normal course, with the data sources, review deadline, and focus-note panels populated from the manual entries above.
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
        <input
          defaultValue={value}
          className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
          style={mono ? { fontFamily: "ui-monospace, Menlo, monospace" } : undefined}
        />
      </div>
      <Pencil className="w-3 h-3 text-gray-300" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   AC.2 — Manager deselects a shared workspace (GitHub example)
   Previously "Email excluded" — repurposed since email is no longer
   an automated source per the data-ingestion governance rule.
   ═══════════════════════════════════════════════════════════════════ */

function AC2SourceDeselected({ scenario }) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader
        eyebrow="Session setup · data sources"
        title="Set up a handover session"
        subtitle="Confirm the details, review deadline, and data sources. Then start context seeding."
        actor="Hà Vy · Manager · Engineering"
      />

      <FormSection title="Session details" subtitle="Pre-filled from the HR record.">
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <DetailRow label="Offboarder"        value={scenario.name} />
          <DetailRow label="Role"              value={scenario.role} />
          <DetailRow label="Department"        value={scenario.dept} />
          <DetailRow label="Last working date" value={scenario.lastDay} mono icon={Calendar} last />
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
      </FormSection>

      <FormSection title="Data sources" subtitle="Approved shared workspaces only. Manager has deselected GitHub for this session.">
        <div className="space-y-2">
          <SourceRow icon={GitBranch} name="Jira"           detail="47 active tickets · 6 months of comments"           selected />
          <SourceRow icon={Folder}    name="Google Drive"   detail="412 files · titles and edit recency only · content read only during interview" selected />
          <SourceRow icon={Github}    name="GitHub"         detail="23 shared repos — mostly archived legacy code, not relevant to the successor's scope." excluded />
        </div>

        <div className="mt-3 rounded-md border border-yellow-200 bg-yellow-50/50 px-3 py-2.5 flex items-start gap-2.5">
          <AlertTriangle className="w-3.5 h-3.5 text-yellow-700 shrink-0 mt-0.5" strokeWidth={1.75} />
          <div className="flex-1">
            <p className="text-[12px] text-yellow-900 leading-relaxed">
              <strong>GitHub data excluded.</strong> Knowledge map coverage may be reduced for code-related decisions — PR review history, design discussions in wikis, commit message context. The session will proceed normally.
            </p>
            <p className="text-[11px] text-yellow-900/70 mt-1 leading-relaxed">
              The interview can still cover these topics through priority prompts (UC-HO-05). The Offboarder can also bring them up directly. You can re-enable GitHub before seeding starts.
            </p>
          </div>
        </div>
      </FormSection>

      <FormSection title="Focus note" subtitle="Optional · steers the context seeding toward what matters most.">
        <textarea
          placeholder="For example · 'Prioritize Project Atlas and the Payment Gateway timeout — Trần Hữu Nam needs to hit the ground running on both.'"
          className="w-full min-h-[64px] px-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/15 transition-colors resize-none"
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
        <span className="text-gray-700 font-medium">Data ingestion scope ·</span> automated collection is restricted to approved shared workspaces. Email, personal directories, and private messaging are never scanned. Manual file upload remains available for anything outside this scope.
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

function SourceRow({ icon: Icon, name, detail, selected, excluded }) {
  return (
    <label className={`flex items-start gap-3 rounded-md border bg-white px-3 py-2.5 cursor-pointer transition-colors ${
      excluded ? "border-gray-200 opacity-60" : "border-gray-200 hover:border-gray-300"
    }`}>
      <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
        selected ? "bg-violet-600 border-violet-600" : "bg-white border-gray-300"
      }`}>
        {selected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
      </span>
      <Icon className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" strokeWidth={1.75} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
          {name}
          {excluded && <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">Excluded</span>}
        </div>
        <div className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{detail}</div>
      </div>
    </label>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   AC.3 — No integrated data sources
   ═══════════════════════════════════════════════════════════════════ */

function AC3NoSources({ scenario }) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader
        eyebrow="Session setup · data sources"
        title="Set up a handover session"
        subtitle="No data sources are connected for this Offboarder. The interview will fall back to a generic question bank."
        actor="Hà Vy · Manager · Sales"
      />

      <Banner tone="warning" icon={AlertTriangle}>
        <strong>No integrated shared workspaces are available for {scenario.name}.</strong>{" "}
        Context seeding will be skipped. The interview will use a generic question bank based on her role and department.
      </Banner>

      <FormSection title="Session details" subtitle="Pre-filled from the HR record.">
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <DetailRow label="Offboarder"        value={scenario.name} />
          <DetailRow label="Role"              value={scenario.role} />
          <DetailRow label="Department"        value={scenario.dept} />
          <DetailRow label="Last working date" value={scenario.lastDay} mono icon={Calendar} last />
        </div>
      </FormSection>

      <FormSection title="Review deadline" subtitle="Default · 3 business days after the interview ends.">
        <div className="rounded-lg border border-gray-200 bg-white p-3 flex items-center gap-3">
          <Calendar className="w-4 h-4 text-gray-400 shrink-0" strokeWidth={1.75} />
          <input
            defaultValue="June 16, 2026 · 17:00"
            className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
            style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
          />
          <span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>+3 business days</span>
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
              {scenario.name}'s tools either aren't integrated with ART-EEP or her account no longer has access. The interview will run from a generic question bank tailored to her role.
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

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <GhostButton>Cancel</GhostButton>
        <PrimaryButton>
          Start session · no seeding
          <ArrowRight className="w-3.5 h-3.5" />
        </PrimaryButton>
      </div>

      <p className="text-[11px] text-gray-500 mt-5 leading-relaxed">
        <span className="text-gray-700 font-medium">What this means downstream ·</span> the Offboarder's interview won't have project-specific context, so it will rely on role-level questions ("Walk me through your typical week", "What relationships matter most for the next person in this seat?"). Priority prompts via UC-HO-05 can still steer it toward known concerns.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   AC.4 — High sensitivity exclusion (>30%)
   ═══════════════════════════════════════════════════════════════════ */

function AC4HighExclusion({ scenario }) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader
        eyebrow="Seeding complete · 6 minutes"
        title={`${scenario.name}'s preliminary knowledge map`}
        subtitle="What we learned from the scan. Review before scheduling the interview."
        actor="Hà Vy · Manager · People & Culture"
      />

      <article className="rounded-lg border border-yellow-200 bg-yellow-50/50 overflow-hidden mb-6">
        <div className="px-4 py-3.5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-white border border-yellow-200 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-yellow-700" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-yellow-900 mb-1">
              A significant portion of {scenario.name}'s activity involves sensitive content.
            </h3>
            <p className="text-[12px] text-yellow-900/90 leading-relaxed mb-3">
              <strong>43% of her scanned content was excluded by sensitivity classification.</strong>{" "}
              This is expected for People Operations roles — much of her work concerns personnel cases, salary discussions, and policy disputes. Interview questions may be less detailed for those areas.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <PrimaryButton>
                <Plus className="w-3 h-3" />
                Add priority prompts
              </PrimaryButton>
              <SecondaryButton>
                <Eye className="w-3 h-3" />
                Request override review
              </SecondaryButton>
              <span className="text-[10px] text-yellow-800/80 ml-1 max-w-xs leading-relaxed">
                HR + Legal will examine whether the classification rules are over-broad for this role.
              </span>
            </div>
          </div>
        </div>
      </article>

      <div className="grid grid-cols-4 gap-3 mb-6">
        <SummaryStat value="568"  label="Items detected" />
        <SummaryStat value="243"  label="Excluded by classification" tone="warning" />
        <SummaryStat value="325"  label="Items in scope" />
        <SummaryStat value="4"    label="Likely knowledge gaps" tone="warning" />
      </div>

      <FormSection title="Top areas by activity" subtitle="Where this person spent the most of her time over the last 6 months.">
        <div className="grid grid-cols-3 gap-3">
          <AreaCard icon={Users}     name="Performance review cycle Q1" detail="34% of activity · cross-team" />
          <AreaCard icon={FileText}  name="Policy revision · remote work" detail="22% of activity · ongoing" />
          <AreaCard icon={Briefcase} name="Compensation framework v3"   detail="18% of activity · paused" />
        </div>
      </FormSection>

      <FormSection title="Likely knowledge gaps" subtitle="High activity, sparse documentation. The interview should probe these — and priority prompts will help.">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50/30 p-4">
          <ul className="space-y-2.5">
            <KnowledgeGap title="Compensation framework v3 · paused mid-revision"  detail="9 in-flight cases · no decision log committed since March" />
            <KnowledgeGap title="High-sensitivity disciplinary cases"             detail="Mostly excluded by classification — Khánh Linh likely holds context not in any retained document" />
            <KnowledgeGap title="Vendor selection · benefits provider"             detail="Active conversations · no shortlist captured in writing" />
            <KnowledgeGap title="Policy revision · remote work"                    detail="Recent edits not yet reflected in the published handbook" />
          </ul>
        </div>
      </FormSection>

      <FormSection title="Next actions" subtitle="The session is ready. What would you like to do?">
        <div className="grid grid-cols-2 gap-3">
          <NextActionCard
            icon={MessageSquare}
            title="Schedule the voice interview"
            detail={`Send ${scenario.name} an invite to start her handover. About 45 minutes.`}
            ucRef="UC-HO-02"
            primary
          />
          <NextActionCard
            icon={Tag}
            title="Add priority prompts"
            detail="Steer the interview toward what matters most for the successor. Recommended given the high exclusion rate."
            ucRef="UC-HO-05"
          />
        </div>
      </FormSection>

      <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
        <span className="text-gray-700 font-medium">For the audit log ·</span> the exclusion volume (243 items across 6 minutes of seeding) has been recorded with the session anchor for HR Admin review and future policy refinement.
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

function SummaryStat({ value, label, tone }) {
  const cfg = {
    default: { border: "border-gray-200",   bg: "bg-white",        valueCls: "text-gray-900",   labelCls: "text-gray-500"  },
    warning: { border: "border-yellow-200", bg: "bg-yellow-50/30", valueCls: "text-yellow-800", labelCls: "text-yellow-700" },
  }[tone || "default"];
  return (
    <div className={`rounded-lg border ${cfg.border} ${cfg.bg} px-3 py-3`}>
      <div className={`text-2xl font-semibold ${cfg.valueCls} tracking-tight`} style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{value}</div>
      <div className={`text-[11px] ${cfg.labelCls} mt-0.5`}>{label}</div>
    </div>
  );
}

function AreaCard({ icon: Icon, name, detail }) {
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
