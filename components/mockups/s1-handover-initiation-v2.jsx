'use client';

import React, { useState } from 'react';
import {
  Users, Calendar, Mail, Folder, GitBranch, Sparkles, AlertTriangle,
  CheckCircle2, Clock, ArrowRight, ChevronRight, ShieldAlert,
  Lock, Flag, Plus, Pencil, Trash2, X, Info, AlertCircle,
  Settings, ShieldCheck, Loader2, KeyRound, RefreshCw, Send,
  Shield, Briefcase, FileText
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════
   ART-EEP — Sprint 1 v2: Handover Initiation
   
   Comprehensive rebuild:
   · Brand palette migrated to Violet (primary) + Pastel Yellow (secondary)
   · UC-HO-01 v2.0 exception coverage completed (EX.5 RBAC failure, AC.1 PII override)
   · Minimalism pass — every component earns its place
   · UIUX health — explicit focus states, ≥32px touch targets, accessible contrast
   
   Screens: 01–05 covering UC-HO-01 and UC-HO-05.
   ═══════════════════════════════════════════════════════════════════ */

const SCREENS = [
  { id: 1, num: '01', name: 'Dashboard',          uc: 'UC-HO-01',    states: [['happy','Pending session'], ['cold','No pending']] },
  { id: 2, num: '02', name: 'Setup Wizard',       uc: 'UC-HO-01',    states: [['happy','Happy path'], ['critical','Critical notice (EX.2)'], ['no-sources','No data sources (AC.3)'], ['rbac-fail','Access scope unresolved (EX.5)']] },
  { id: 3, num: '03', name: 'Seeding Progress',   uc: 'UC-HO-01',    states: [['loading','Loading'], ['partial','Partial seeding (EX.1)'], ['purview','Classification halted (EX.4)']] },
  { id: 4, num: '04', name: 'Knowledge Map',      uc: 'UC-HO-01',    states: [['happy','Happy path'], ['high-pii','High exclusion (AC.1)'], ['partial','Partial seeding']] },
  { id: 5, num: '05', name: 'Prompt Configuration', uc: 'UC-HO-05',  states: [['cold','No priority prompts'], ['happy','Happy path'], ['policy','Policy violation (EX.1)'], ['locked','Interview completed (EX.2)']] },
];

export default function S1HandoverInitiationV2() {
  const [screenId, setScreenId] = useState(1);
  const [stateKey, setStateKey] = useState('happy');

  const screen = SCREENS.find(s => s.id === screenId);

  const handleScreenChange = (id) => {
    setScreenId(id);
    const next = SCREENS.find(s => s.id === id);
    setStateKey(next.states[0][0]);
  };

  const advance = (toId) => {
    setScreenId(toId);
    const next = SCREENS.find(s => s.id === toId);
    setStateKey(next.states[0][0]);
  };

  return (
    <div className="h-screen w-full bg-gray-50 text-gray-900 flex flex-col overflow-hidden" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>

      {/* Brand + screen nav */}
      <header className="bg-white border-b border-gray-200 px-5 py-2.5 flex items-center justify-between shrink-0 gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
          <span className="text-gray-900 font-semibold tracking-[0.18em] text-xs" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>ART-EEP</span>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-gray-500 text-xs">Sprint 1 v2 · Handover Initiation</span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {SCREENS.map(s => {
            const isActive = s.id === screenId;
            return (
              <button
                key={s.id}
                onClick={() => handleScreenChange(s.id)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] border transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${
                  isActive ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className={isActive ? 'text-gray-400' : 'text-gray-400'} style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{s.num}</span>
                <span>{s.name}</span>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-gray-500 shrink-0" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{screen.uc}</div>
      </header>

      {/* State selector */}
      <div className="bg-white border-b border-gray-200 px-5 py-2 flex items-center gap-2 shrink-0">
        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium shrink-0">State</span>
        <span className="w-px h-3 bg-gray-200" />
        <div className="flex items-center gap-1 flex-wrap">
          {screen.states.map(([key, label]) => {
            const isActive = stateKey === key;
            return (
              <button
                key={key}
                onClick={() => setStateKey(key)}
                className={`px-2 py-1 rounded text-[11px] border transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${
                  isActive ? 'border-violet-300 bg-violet-50 text-violet-800' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {screenId === 1 && <Screen01Dashboard state={stateKey} onInitiate={() => advance(2)} />}
        {screenId === 2 && <Screen02Wizard state={stateKey} onStart={() => advance(3)} />}
        {screenId === 3 && <Screen03Seeding state={stateKey} onComplete={() => advance(4)} />}
        {screenId === 4 && <Screen04Map state={stateKey} onConfigure={() => advance(5)} />}
        {screenId === 5 && <Screen05Prompts state={stateKey} />}
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 01 — MANAGER DASHBOARD
   Entry point. Happy + Cold Start only. No empty-section noise.
   ═══════════════════════════════════════════════════════════════════ */
function Screen01Dashboard({ state, onInitiate }) {
  if (state === 'cold') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <PageHeader
          eyebrow="Handover"
          title="Dashboard"
          actor="Hà Vy · Manager"
        />
        <div className="rounded-lg border border-gray-200 bg-white p-12 flex flex-col items-center text-center">
          <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-4">
            <Users className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
          </div>
          <h2 className="text-sm font-semibold text-gray-900 mb-1">No pending handovers</h2>
          <p className="text-sm text-gray-500 max-w-sm">
            When a team member's departure is confirmed in HR, you'll see them here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader
        eyebrow="Handover"
        title="Dashboard"
        subtitle="Manage knowledge transfer for departing team members."
        actor="Hà Vy · Manager"
      />

      <section className="mb-7">
        <SectionLabel count={3}>Pending</SectionLabel>
        <div className="space-y-2.5">
          <PendingSessionCard
            initials="KL"
            name="Khánh Linh Trần"
            role="Head of People Operations"
            department="People & Culture"
            lastDay="May 26, 2026"
            daysRemaining={2}
            sources={[
              { icon: Users,    label: 'HR system · 240 records' },
              { icon: FileText, label: 'Notion · 212 policy docs' },
              { icon: Mail,     label: 'Email metadata' },
            ]}
            onInitiate={onInitiate}
          />
          <PendingSessionCard
            initials="PA"
            name="Phương Anh Nguyễn"
            role="Senior Account Executive"
            department="Sales"
            lastDay="May 30, 2026"
            daysRemaining={6}
            sources={[
              { icon: Briefcase, label: 'Salesforce · 38 active deals' },
              { icon: Calendar,  label: 'Calendar · 90 days of meetings' },
              { icon: Mail,      label: 'Email metadata' },
            ]}
            onInitiate={onInitiate}
          />
          <PendingSessionCard
            initials="ML"
            name="Minh Lê"
            role="Senior Backend Engineer"
            department="Engineering"
            lastDay="June 4, 2026"
            daysRemaining={12}
            sources={[
              { icon: GitBranch, label: 'Jira · 47 active tickets' },
              { icon: Folder,    label: 'Google Drive · 412 files' },
              { icon: Mail,      label: 'Email metadata' },
            ]}
            onInitiate={onInitiate}
          />
        </div>
      </section>

      <section>
        <SectionLabel>Recent activity</SectionLabel>
        <div className="space-y-2">
          <AuditLogTile
            timestamp="2026-05-22 14:32:15"
            actor="System"
            action="Detected departure record for Khánh Linh Trần · ready to initiate"
          />
          <AuditLogTile
            timestamp="2026-05-21 09:08:11"
            actor="System"
            action="Detected departure record for Phương Anh Nguyễn · ready to initiate"
          />
          <AuditLogTile
            timestamp="2026-05-20 16:02:08"
            actor="Hà Vy"
            action="Released onboarding playbook for Trần Hữu Nam"
            details="6 sections · 3 critical items"
          />
        </div>
      </section>
    </div>
  );
}

function PendingSessionCard({ initials, name, role, department, lastDay, daysRemaining, sources, onInitiate }) {
  const urgent = daysRemaining < 5;
  const critical = daysRemaining < 3;

  return (
    <article
      className="rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-colors"
      style={critical ? { borderLeft: '2px solid rgb(244, 63, 94)' } : undefined}
    >
      <div className="p-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <h3 className="text-sm font-semibold text-gray-900">{name}</h3>
              {critical && (
                <span className="text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold bg-rose-50 border border-rose-200 text-rose-700">
                  Urgent
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">{role} · {department}</p>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-500 flex-wrap">
              <Calendar className="w-3 h-3 text-gray-400" />
              <span>Last working day · {lastDay}</span>
              <span className="text-gray-300">·</span>
              <span className={urgent ? 'text-rose-700 font-medium' : 'text-gray-600'}>
                {daysRemaining} days remaining
              </span>
            </div>
            {sources && (
              <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                {sources.map((src, i) => {
                  const Icon = src.icon;
                  return (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-[10px] text-gray-600 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded"
                    >
                      <Icon className="w-2.5 h-2.5 text-gray-500" strokeWidth={1.75} />
                      {src.label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <PrimaryButton onClick={onInitiate}>
          Initiate session
          <ArrowRight className="w-3.5 h-3.5" />
        </PrimaryButton>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 02 — SESSION SETUP WIZARD
   Adds EX.5 RBAC failure state (was missing from v1).
   ═══════════════════════════════════════════════════════════════════ */
function Screen02Wizard({ state, onStart }) {
  const isCritical = state === 'critical';
  const noSources  = state === 'no-sources';
  const rbacFail   = state === 'rbac-fail';

  // EX.5 — Session creation is blocked; wizard renders, but disabled with error
  if (rbacFail) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Breadcrumb path={['Dashboard', 'Initiate session for Minh Lê']} />
        <PageHeader title="Can't create this session" actor="Hà Vy · Manager" />

        <div className="rounded-lg border border-rose-200 bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-rose-100 bg-rose-50/40 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" strokeWidth={1.75} />
            <div>
              <h3 className="text-sm font-semibold text-rose-900 mb-0.5">Access scope couldn't be resolved</h3>
              <p className="text-[12px] text-rose-800 leading-relaxed">
                We couldn't determine what data and people Minh Lê's session should be scoped to. The most common cause is a missing or out-of-sync record in the company directory.
              </p>
            </div>
          </div>

          <div className="px-5 py-4">
            <div className="rounded-md border border-gray-200 bg-gray-50/60 px-3 py-2.5 mb-4 text-[11px]" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>
              <div className="flex items-center justify-between text-gray-500 mb-1">
                <span>Error reference</span>
                <span>2026-05-22 14:08:32</span>
              </div>
              <div className="text-gray-700">UC-HO-01.EX.5 · directory query failed for offboarder_id=ML-2026-04</div>
            </div>

            <h4 className="text-xs font-semibold text-gray-900 mb-2">Try these in order</h4>
            <ol className="space-y-2 text-[13px] text-gray-700">
              <NumberedStep n={1}>Check Minh Lê's record in the company directory — confirm department, manager, and access level are populated.</NumberedStep>
              <NumberedStep n={2}>Wait 10 minutes for directory sync to complete, then retry below.</NumberedStep>
              <NumberedStep n={3}>If the problem persists, escalate to IT support with the error reference above.</NumberedStep>
            </ol>
          </div>

          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/40 flex items-center justify-between">
            <GhostButton>Back to dashboard</GhostButton>
            <SecondaryButton>
              <RefreshCw className="w-3.5 h-3.5" />
              Retry session creation
            </SecondaryButton>
          </div>
        </div>
      </div>
    );
  }

  const reviewDeadline = isCritical ? 'June 3, 2026' : 'June 9, 2026';

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Breadcrumb path={['Dashboard', 'Initiate session for Minh Lê']} />
      <PageHeader
        title="Initiate session for Minh Lê"
        subtitle="Configure how this knowledge transfer runs."
      />

      {isCritical && (
        <Banner tone="critical" icon={AlertTriangle}>
          <strong>Minh Lê's last working day is in 2 days.</strong> The review deadline has been adjusted to {reviewDeadline}. Schedule the interview as soon as possible.
        </Banner>
      )}

      {noSources && (
        <Banner tone="warning" icon={AlertCircle}>
          <strong>No integrated data sources are available for Minh Lê.</strong> The interview will use a generic question bank based on the role. To enable personalized seeding, ask your admin to set up integrations.
        </Banner>
      )}

      <FormSection title="Session details" subtitle="Pre-filled from the HR record.">
        <div className="grid grid-cols-2 gap-2.5">
          <ReadOnlyField label="Offboarder" value="Minh Lê" />
          <ReadOnlyField label="Role" value="Senior Backend Engineer" />
          <ReadOnlyField label="Department" value="Engineering" />
          <ReadOnlyField label="Last working day" value={isCritical ? 'May 24, 2026' : 'June 4, 2026'} highlight={isCritical} />
        </div>
      </FormSection>

      <FormSection
        title="Review deadline"
        subtitle="How long Minh Lê has to review the transcript before signing off."
      >
        <div className="flex items-center gap-3 flex-wrap">
          <div className={`px-3 py-2 rounded-md border bg-white text-sm ${isCritical ? 'border-rose-200 text-rose-700 font-medium' : 'border-gray-200 text-gray-900'}`}>
            {reviewDeadline}
          </div>
          <span className="text-[11px] text-gray-500">
            {isCritical ? 'Auto-adjusted to last working day minus 1.' : 'Default · 3 business days after interview completion.'}
          </span>
        </div>
      </FormSection>

      <FormSection
        title="Data sources"
        subtitle="Where the AI looks to understand Minh Lê's work before the interview."
      >
        {noSources ? (
          <div className="rounded-md border border-gray-200 bg-gray-50/60 p-4 text-center">
            <p className="text-sm text-gray-500">No integrated data sources found for this account.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <DataSourceRow icon={GitBranch} name="Jira"            detail="47 active tickets in the last 90 days" checked />
            <DataSourceRow icon={Folder}    name="Google Drive"    detail="412 files owned or recently edited" checked />
            <DataSourceRow icon={Mail}      name="Email metadata"  detail="Subject lines and participants only. Email content is never read or stored." checked />
          </div>
        )}
      </FormSection>

      {!noSources && (
        <FormSection title="Focus note" subtitle="Optional. Guide the AI's questioning.">
          <textarea
            placeholder="For example: 'Prioritize Project Atlas and the renewal negotiation with Vendor XYZ.'"
            className="w-full min-h-[72px] px-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/15 transition-colors resize-none"
            style={{ fontFamily: 'inherit' }}
          />
        </FormSection>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <GhostButton>Cancel</GhostButton>
        <PrimaryButton onClick={onStart}>
          {noSources ? 'Start session (no seeding)' : 'Start session & begin seeding'}
          <ArrowRight className="w-3.5 h-3.5" />
        </PrimaryButton>
      </div>
    </div>
  );
}

function NumberedStep({ n, children }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-medium flex items-center justify-center shrink-0 mt-0.5" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{n}</span>
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}

function ReadOnlyField({ label, value, highlight }) {
  return (
    <div className="px-3 py-2 rounded-md border border-gray-200 bg-gray-50/60">
      <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium mb-0.5">{label}</div>
      <div className={`text-sm ${highlight ? 'text-rose-700 font-medium' : 'text-gray-900'}`}>{value}</div>
    </div>
  );
}

function DataSourceRow({ icon: Icon, name, detail, checked }) {
  return (
    <label className="flex items-start gap-3 px-3 py-2.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50/50 cursor-pointer transition-colors">
      <input type="checkbox" defaultChecked={checked} className="mt-0.5 accent-violet-600 focus:ring-2 focus:ring-violet-500/20" />
      <Icon className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" strokeWidth={1.75} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900">{name}</div>
        <div className="text-[11px] text-gray-500 mt-0.5">{detail}</div>
      </div>
    </label>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 03 — CONTEXT SEEDING PROGRESS
   ═══════════════════════════════════════════════════════════════════ */
function Screen03Seeding({ state, onComplete }) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <PageHeader
        eyebrow="Step 2 of 4"
        title="Seeding context for Minh Lê"
        subtitle="Scanning work history. You can leave this page — we'll notify you when it's done."
      />

      {state === 'partial' && (
        <Banner tone="warning" icon={AlertCircle}>
          <strong>We couldn't reach Google Drive.</strong> Seeding continued with the other sources. The knowledge map will be less detailed for files.
        </Banner>
      )}

      {state === 'purview' && (
        <Banner tone="critical" icon={ShieldAlert}>
          <strong>Sensitivity classification is unavailable.</strong> Seeding is paused — content can't enter staging without classification. Retrying every 15 minutes (attempt 2 of 16).
        </Banner>
      )}

      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden mb-5">
        <ProgressStage status="done" label="Connecting to Jira" />
        <ProgressStage status="done" label="Scanning 47 tickets" detail="Indexed metadata only — descriptions stay in Jira" />

        {state !== 'partial'  && <ProgressStage status="done"    label="Connecting to Google Drive" />}
        {state === 'partial'  && <ProgressStage status="failed"  label="Connecting to Google Drive" detail="Permission denied · retry from session dashboard" />}

        {state === 'loading'  && <ProgressStage status="active"  label="Scanning 412 files" detail="245 of 412 · indexing titles only" />}
        {state === 'partial'  && <ProgressStage status="skipped" label="Scanning files — skipped" />}
        {state === 'purview'  && <ProgressStage status="done"    label="Scanning 412 files" detail="Held in staging awaiting classification" />}

        {state === 'loading'  && <ProgressStage status="pending" label="Classifying sensitive content" />}
        {state === 'partial'  && <ProgressStage status="active"  label="Classifying sensitive content" detail="63% complete" />}
        {state === 'purview'  && <ProgressStage status="paused"  label="Classifying sensitive content" detail="Service unavailable · next retry in 9 minutes" />}

        <ProgressStage status="pending" label="Building knowledge map" last />
      </div>

      <div className="rounded-md border border-gray-200 bg-gray-50/60 px-3 py-2.5 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" strokeWidth={1.75} />
        <p className="text-[11px] text-gray-600 leading-relaxed">
          Personal or sensitive content is excluded from the knowledge map automatically. Counts shown once seeding completes.
        </p>
      </div>

      {state === 'loading' && (
        <div className="mt-5 flex items-center justify-end">
          <GhostButton onClick={onComplete}>
            Simulate completion <ArrowRight className="w-3 h-3" />
          </GhostButton>
        </div>
      )}
    </div>
  );
}

function ProgressStage({ status, label, detail, last }) {
  const config = {
    done:    { icon: CheckCircle2, iconCls: 'text-emerald-600',           labelCls: 'text-gray-900' },
    active:  { icon: Loader2,      iconCls: 'text-violet-600 animate-spin', labelCls: 'text-gray-900 font-medium' },
    pending: { icon: Clock,        iconCls: 'text-gray-300',              labelCls: 'text-gray-400' },
    failed:  { icon: AlertCircle,  iconCls: 'text-rose-500',              labelCls: 'text-rose-700' },
    skipped: { icon: X,            iconCls: 'text-gray-400',              labelCls: 'text-gray-500 line-through' },
    paused:  { icon: PauseIcon,    iconCls: 'text-yellow-700',            labelCls: 'text-yellow-900 font-medium' },
  };
  const c = config[status];
  const Icon = c.icon;
  return (
    <div className={`px-4 py-3 flex items-start gap-3 ${!last ? 'border-b border-gray-100' : ''}`}>
      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${c.iconCls}`} strokeWidth={1.75} />
      <div className="flex-1 min-w-0">
        <div className={`text-sm ${c.labelCls}`}>{label}</div>
        {detail && <div className="text-[11px] text-gray-500 mt-0.5">{detail}</div>}
      </div>
    </div>
  );
}

function PauseIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <circle cx="12" cy="12" r="10" />
      <line x1="10" y1="9" x2="10" y2="15" />
      <line x1="14" y1="9" x2="14" y2="15" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 04 — PRELIMINARY KNOWLEDGE MAP
   Adds UC-HO-01 v2.0 AC.1 (PII Override Request) action on High PII state.
   ═══════════════════════════════════════════════════════════════════ */
function Screen04Map({ state, onConfigure }) {
  const highPii = state === 'high-pii';
  const partial = state === 'partial';

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader
        eyebrow="Seeding complete"
        title="What we found in Minh Lê's work"
        subtitle="Review the preliminary knowledge map. You can add priority prompts before the interview begins."
      />

      {highPii && (
        <div className="rounded-md border border-yellow-200 bg-yellow-50/60 mb-5 overflow-hidden">
          <div className="px-3 py-2.5 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-yellow-700 shrink-0 mt-0.5" strokeWidth={1.75} />
            <div className="flex-1">
              <p className="text-[12px] text-yellow-900 leading-relaxed">
                <strong>35% of the scanned content was classified as personal or sensitive and excluded.</strong> The knowledge map covers Minh Lê's role visibly, but some areas may be less detailed than usual.
              </p>
            </div>
          </div>
          <div className="px-3 py-2 border-t border-yellow-200/70 bg-yellow-50 flex items-center justify-between gap-3">
            <span className="text-[11px] text-yellow-800">Two ways to compensate:</span>
            <div className="flex items-center gap-2">
              <button className="text-[11px] px-2 py-1 rounded-md border border-yellow-300 bg-white hover:bg-yellow-100 text-yellow-900 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
                Add priority prompts
              </button>
              <button className="text-[11px] px-2 py-1 rounded-md border border-yellow-300 bg-white hover:bg-yellow-100 text-yellow-900 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
                Request override review
              </button>
            </div>
          </div>
        </div>
      )}

      {partial && (
        <Banner tone="warning" icon={AlertCircle}>
          <strong>Google Drive couldn't be scanned.</strong> The map below is built from Jira and email metadata only.
        </Banner>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-2.5 mb-6">
        <StatCard value="47" label="Tickets scanned" />
        <StatCard value={partial ? '—' : '412'} label="Files indexed" muted={partial} />
        <StatCard value={partial ? '17' : '23'} label="Entities detected" />
        <StatCard
          value={highPii ? '15' : '18'}
          label="Retained after classification"
          tone={highPii ? 'warning' : 'default'}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="px-3 py-2 border-b border-gray-100">
            <h3 className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium">Top projects by activity</h3>
          </div>
          <div className="divide-y divide-gray-100">
            <ProjectRow name="Project Atlas"            detail="32 tickets · primary contributor" />
            <ProjectRow name="Payment Gateway v2"        detail="18 tickets · maintenance lead" />
            <ProjectRow name="Customer Portal Refresh"   detail="11 tickets · code reviewer" />
          </div>
        </div>

        <div className="rounded-lg border border-yellow-200 bg-white overflow-hidden">
          <div className="px-3 py-2 border-b border-yellow-200/70 bg-yellow-50/50">
            <h3 className="text-[10px] uppercase tracking-[0.18em] text-yellow-800 font-medium">Likely knowledge gaps</h3>
          </div>
          <div className="divide-y divide-yellow-100/60">
            <GapRow text="Payment Gateway timeout · no written runbook, recurring incidents" />
            <GapRow text="Vendor XYZ renewal · high email volume, no project doc" />
            <GapRow text="Customer Portal infra config · owned by Minh Lê, low documentation" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <GhostButton>Back to dashboard</GhostButton>
        <div className="flex items-center gap-2">
          <SecondaryButton onClick={onConfigure}>
            <Settings className="w-3.5 h-3.5" />
            Configure interview prompts
          </SecondaryButton>
          <PrimaryButton>
            Confirm and finish
            <CheckCircle2 className="w-3.5 h-3.5" />
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label, muted, tone }) {
  const cls = tone === 'warning' ? 'border-yellow-200 bg-yellow-50/40' : 'border-gray-200 bg-white';
  const valueCls = tone === 'warning' ? 'text-yellow-800' : muted ? 'text-gray-400' : 'text-gray-900';
  return (
    <div className={`rounded-lg border px-3 py-2.5 ${cls}`}>
      <div className={`text-xl font-semibold ${valueCls} tracking-tight`} style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{value}</div>
      <div className="text-[11px] text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

function ProjectRow({ name, detail }) {
  return (
    <div className="px-3 py-2 hover:bg-gray-50/60 transition-colors">
      <div className="text-sm text-gray-900 font-medium">{name}</div>
      <div className="text-[11px] text-gray-500 mt-0.5">{detail}</div>
    </div>
  );
}

function GapRow({ text }) {
  return (
    <div className="px-3 py-2 flex items-start gap-2">
      <span className="w-1 h-1 rounded-full bg-yellow-500 shrink-0 mt-1.5" />
      <p className="text-[12px] text-gray-700 leading-relaxed">{text}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 05 — PROMPT CONFIGURATION (UC-HO-05)
   ═══════════════════════════════════════════════════════════════════ */
function Screen05Prompts({ state }) {
  const locked = state === 'locked';

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Breadcrumb path={['Dashboard', "Minh Lê's session", 'Configure prompts']} />
      <PageHeader
        title="Configure interview prompts"
        subtitle="Guide what the AI focuses on during Minh Lê's voice interview."
      />

      {locked && (
        <Banner tone="muted" icon={Lock}>
          <strong>The interview has been completed.</strong> You can view the prompts used here, but they can no longer be edited.
        </Banner>
      )}

      <FormSection
        title="AI-generated prompts"
        subtitle="Prepared from the seeded context. Asked unless you remove the source content."
      >
        <div className="space-y-2">
          <AiPromptRow text="What were your most active client relationships in the final quarter?" />
          <AiPromptRow text="Walk me through the architecture decisions on Project Atlas." />
          <AiPromptRow text="Are there any unwritten escalation paths the team relies on?" />
          <AiPromptRow text="Which tools or integrations are most likely to break after you leave?" />
        </div>
      </FormSection>

      <FormSection
        title="Priority prompts"
        subtitle="Your additions. Asked before the AI-generated ones, weighted by priority."
      >
        {state === 'cold' && (
          <div className="rounded-md border border-gray-200 border-dashed bg-white p-6 text-center">
            <p className="text-sm text-gray-500 mb-3">No priority prompts yet.</p>
            <PrimaryButton>
              <Plus className="w-3 h-3" />
              Add priority prompt
            </PrimaryButton>
          </div>
        )}

        {(state === 'happy' || locked) && (
          <div className="space-y-2 mb-3">
            <PriorityPromptRow
              text="Probe deeply on the renewal negotiation with Vendor XYZ — what conditions did you commit to?"
              priority="critical"
              locked={locked}
            />
            <PriorityPromptRow
              text="Capture the manual reconciliation workaround used during the Q1 finance close."
              priority="high"
              locked={locked}
            />
          </div>
        )}

        {state === 'policy' && (
          <div className="rounded-md border border-rose-200 bg-rose-50/40 p-3 mb-2">
            <div className="flex items-start gap-2 mb-2.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" strokeWidth={1.75} />
              <div className="text-[12px] text-rose-900 leading-relaxed">
                This looks like it might ask for personal opinions about colleagues, which is outside the scope of a knowledge transfer interview. Try rephrasing around the work itself.
              </div>
            </div>
            <div className="px-3 py-2 rounded border border-rose-200 bg-white text-sm text-gray-700 mb-2">
              <span className="bg-rose-100 text-rose-800 px-1 rounded">What do you think about</span> the team's handling of Vendor XYZ?
            </div>
            <div className="flex items-center gap-2">
              <button className="text-xs text-rose-700 hover:text-rose-800 underline focus:outline-none focus:ring-2 focus:ring-violet-500/20 rounded px-1">Rephrase</button>
              <button className="text-xs text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 rounded px-1">Remove</button>
            </div>
          </div>
        )}

        {!locked && state !== 'policy' && state !== 'cold' && (
          <GhostButton>
            <Plus className="w-3 h-3" />
            Add another prompt
          </GhostButton>
        )}
      </FormSection>

      {!locked && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <GhostButton>Back</GhostButton>
          <PrimaryButton>
            Save prompts
            <CheckCircle2 className="w-3.5 h-3.5" />
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}

function AiPromptRow({ text }) {
  return (
    <div className="flex items-start gap-2 px-3 py-2 rounded-md bg-violet-50/40 border border-violet-100">
      <Sparkles className="w-3 h-3 text-violet-600 shrink-0 mt-1" />
      <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
    </div>
  );
}

function PriorityPromptRow({ text, priority, locked }) {
  const priCfg = {
    critical: { label: 'Critical', cls: 'bg-rose-50 border-rose-200 text-rose-700' },
    high:     { label: 'High',     cls: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
    normal:   { label: 'Normal',   cls: 'bg-gray-100 border-gray-200 text-gray-600' },
  }[priority];

  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2.5 flex items-start gap-3">
      <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase tracking-wider font-semibold shrink-0 mt-0.5 ${priCfg.cls}`}>
        {priCfg.label}
      </span>
      <p className="text-sm text-gray-700 leading-relaxed flex-1">{text}</p>
      {!locked && (
        <div className="flex items-center gap-0.5 shrink-0">
          <button className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
            <Pencil className="w-3 h-3" />
          </button>
          <button className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-rose-700 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SHARED PRIMITIVES
   ═══════════════════════════════════════════════════════════════════ */

function PageHeader({ eyebrow, title, subtitle, actor }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        {eyebrow && <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">{eyebrow}</span>}
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight mt-1">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {actor && <span className="text-[11px] text-gray-500 shrink-0 pt-1">{actor}</span>}
    </div>
  );
}

function Breadcrumb({ path }) {
  return (
    <div className="flex items-center gap-1.5 mb-2 text-[11px]">
      {path.map((p, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="text-gray-300">/</span>}
          <span className={i === path.length - 1 ? 'text-gray-700' : 'text-gray-500'}>{p}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

function SectionLabel({ count, children }) {
  return (
    <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium mb-3 flex items-center gap-2">
      <span>{children}</span>
      {count !== undefined && (
        <span className="text-gray-400" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>· {count}</span>
      )}
    </h2>
  );
}

function FormSection({ title, subtitle, children }) {
  return (
    <section className="mb-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      {subtitle && <p className="text-[12px] text-gray-500 mb-2.5">{subtitle}</p>}
      {children}
    </section>
  );
}

function Banner({ tone, icon: Icon, children }) {
  const cfg = {
    critical: { cls: 'border-rose-200 bg-rose-50/60',     iconCls: 'text-rose-600',   textCls: 'text-rose-900' },
    warning:  { cls: 'border-yellow-200 bg-yellow-50/60', iconCls: 'text-yellow-700', textCls: 'text-yellow-900' },
    muted:    { cls: 'border-gray-200 bg-gray-50',        iconCls: 'text-gray-500',   textCls: 'text-gray-700' },
  }[tone];

  return (
    <div className={`rounded-md border ${cfg.cls} px-3 py-2.5 mb-5 flex items-start gap-2`}>
      <Icon className={`w-4 h-4 ${cfg.iconCls} shrink-0 mt-0.5`} strokeWidth={1.75} />
      <div className={`text-[12px] ${cfg.textCls} leading-relaxed`}>{children}</div>
    </div>
  );
}

function AuditLogTile({ severity = 'low', timestamp, actor, action, details }) {
  const borderColor = {
    critical: 'rgb(244, 63, 94)',
    high:     'rgb(234, 179, 8)',
    medium:   'rgb(156, 163, 175)',
    low:      'rgb(229, 231, 235)'
  }[severity];

  return (
    <div
      className="rounded-md border border-gray-200 bg-white px-3 py-2.5"
      style={{ borderLeft: `2px solid ${borderColor}` }}
    >
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[10px] text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{timestamp}</span>
        <span className="text-[10px] text-gray-700 font-medium">{actor}</span>
      </div>
      <div className="text-xs text-gray-900">{action}</div>
      {details && (
        <div className="text-[11px] text-gray-500 mt-0.5" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>
          {details}
        </div>
      )}
    </div>
  );
}

/* Buttons — three tiers, consistent sizing, accessible focus */
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
