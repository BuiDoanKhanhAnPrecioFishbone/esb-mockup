'use client';

import React, { useState } from 'react';
import {
  Users, Calendar, Briefcase, FileText, Mail, Database,
  Sparkles, AlertTriangle, CheckCircle2, Clock, ArrowRight,
  ArrowUpRight, ChevronDown, ChevronRight, ShieldAlert,
  Lock, Flag, Plus, Pencil, Trash2, X, Network, Info, Folder,
  GitBranch, MessageCircle, PauseCircle, AlertCircle, Settings,
  ShieldCheck, Loader2, Zap
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════
   ART-EEP — Sprint 1: Handover Initiation
   
   Screens delivered:
     01. Manager Dashboard (UC-HO-01 step 1)
     02. Session Setup Wizard (UC-HO-01 steps 2–5)
     03. Context Seeding Progress (UC-HO-01 steps 6–9)
     04. Preliminary Knowledge Map (UC-HO-01 steps 10–11)
     05. Prompt Configuration (UC-HO-05)
   
   Each screen toggles between its applicable states via the state
   selector below the top nav. UX copy in English; UC traceability
   on every screen.
   ═══════════════════════════════════════════════════════════════════ */

const SCREENS = [
  { id: 1, num: '01', name: 'Dashboard',           uc: 'UC-HO-01', states: [['happy', 'Happy path'], ['cold', 'No pending']] },
  { id: 2, num: '02', name: 'Setup Wizard',        uc: 'UC-HO-01', states: [['happy', 'Happy path'], ['critical', 'Critical notice'], ['no-sources', 'No data sources']] },
  { id: 3, num: '03', name: 'Seeding Progress',    uc: 'UC-HO-01', states: [['loading', 'Loading'], ['partial', 'Partial seeding'], ['purview', 'Classification halted']] },
  { id: 4, num: '04', name: 'Knowledge Map',       uc: 'UC-HO-01', states: [['happy', 'Happy path'], ['high-pii', 'High exclusion'], ['partial', 'Partial seeding']] },
  { id: 5, num: '05', name: 'Prompt Configuration',uc: 'UC-HO-05', states: [['cold', 'No priority prompts'], ['happy', 'Happy path'], ['policy', 'Policy violation'], ['locked', 'Interview completed']] },
];

export default function S1HandoverInitiation() {
  const [screenId, setScreenId] = useState(1);
  const [stateKey, setStateKey] = useState('happy');

  const screen = SCREENS.find(s => s.id === screenId);

  const handleScreenChange = (id) => {
    setScreenId(id);
    const next = SCREENS.find(s => s.id === id);
    setStateKey(next.states[0][0]);
  };

  // Allow CTAs on screens to advance to the next screen's happy path
  const advance = (toId) => {
    setScreenId(toId);
    const next = SCREENS.find(s => s.id === toId);
    setStateKey(next.states[0][0]);
  };

  return (
    <div className="h-screen w-full bg-gray-50 text-gray-900 flex flex-col overflow-hidden" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>

      {/* Brand + screen nav */}
      <header className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between shrink-0 gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
          <span className="text-gray-900 font-semibold tracking-[0.18em] text-xs" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>ART-EEP</span>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-gray-500 text-xs">Sprint 1 · Handover Initiation</span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {SCREENS.map(s => {
            const isActive = s.id === screenId;
            return (
              <button
                key={s.id}
                onClick={() => handleScreenChange(s.id)}
                className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] border transition-all whitespace-nowrap ${
                  isActive ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-gray-400 font-medium" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{s.num}</span>
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
        <div className="flex items-center gap-1">
          {screen.states.map(([key, label]) => {
            const isActive = stateKey === key;
            return (
              <button
                key={key}
                onClick={() => setStateKey(key)}
                className={`px-2 py-0.5 rounded text-[11px] border transition-all ${
                  isActive ? 'border-amber-300 bg-amber-50 text-amber-800' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
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
   UC-HO-01 step 1 · Manager arrives via notification
   ═══════════════════════════════════════════════════════════════════ */
function Screen01Dashboard({ state, onInitiate }) {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <PageHeader
        eyebrow="Handover"
        title="Dashboard"
        subtitle="Manage knowledge transfer for departing team members"
        actor="Hà Vy · Manager"
      />

      {state === 'cold' && <EmptyDashboard />}

      {state === 'happy' && (
        <>
          <section className="mb-6">
            <SectionLabel count={1}>Pending</SectionLabel>
            <PendingSessionCard
              name="Minh Lê"
              role="Senior Backend Engineer"
              department="Engineering"
              lastDay="June 4, 2026"
              daysRemaining={12}
              onInitiate={onInitiate}
            />
          </section>

          <section className="mb-6">
            <SectionLabel count={0}>In progress</SectionLabel>
            <DashedEmpty>Nothing in progress right now.</DashedEmpty>
          </section>

          <section>
            <SectionLabel>Recent activity</SectionLabel>
            <div className="space-y-2">
              <AuditLogTile
                timestamp="2026-05-22 09:14:22"
                actor="System"
                action="Detected departure record for Minh Lê — handover ready to initiate"
              />
              <AuditLogTile
                timestamp="2026-05-20 16:02:08"
                actor="Hà Vy"
                action="Released onboarding playbook for Trần Hữu Nam"
                details="6 sections · 3 critical items"
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function EmptyDashboard() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-12 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-4">
        <Users className="w-5 h-5 text-gray-400" strokeWidth={1.75} />
      </div>
      <h2 className="text-sm font-semibold text-gray-900 mb-1">No pending handovers</h2>
      <p className="text-sm text-gray-600 max-w-sm">
        When a team member's departure is confirmed in HR, you'll see them here.
      </p>
    </div>
  );
}

function PendingSessionCard({ name, role, department, lastDay, daysRemaining, onInitiate }) {
  const urgent = daysRemaining < 5;
  return (
    <article className="rounded-lg border border-gray-200 bg-white overflow-hidden hover:border-gray-300 transition-colors">
      <div className="p-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 shrink-0">
            ML
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-gray-900">{name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{role} · {department}</p>
            <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-gray-400" />
                Last working day · {lastDay}
              </span>
              <span className="text-gray-300">·</span>
              <span className={urgent ? 'text-rose-700 font-medium' : 'text-gray-600'}>
                {daysRemaining} days remaining
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onInitiate}
          className="px-3 py-1.5 rounded-md bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors shrink-0"
        >
          Initiate session
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 02 — SESSION SETUP WIZARD
   UC-HO-01 steps 2–5 · Manager configures the session
   ═══════════════════════════════════════════════════════════════════ */
function Screen02Wizard({ state, onStart }) {
  const reviewDeadline = state === 'critical' ? 'June 3, 2026' : 'June 9, 2026';

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Breadcrumb path={['Dashboard', 'Initiate session for Minh Lê']} />
      <PageHeader
        title="Initiate session for Minh Lê"
        subtitle="Configure the parameters for this knowledge transfer."
      />

      {state === 'critical' && (
        <Banner tone="critical" icon={AlertTriangle}>
          <strong>Minh Lê's last working day is in 2 days.</strong> The review deadline has been adjusted to {reviewDeadline}. Schedule the interview as soon as possible.
        </Banner>
      )}

      {state === 'no-sources' && (
        <Banner tone="warning" icon={AlertCircle}>
          <strong>No integrated data sources are available for Minh Lê.</strong> The interview will use a generic question bank based on the role. To enable personalized seeding, contact your admin to set up integrations.
        </Banner>
      )}

      {/* Section 1 — Session Details */}
      <FormSection title="Session details" subtitle="Pre-filled from the HR record.">
        <div className="grid grid-cols-2 gap-3">
          <ReadOnlyField label="Offboarder" value="Minh Lê" />
          <ReadOnlyField label="Role" value="Senior Backend Engineer" />
          <ReadOnlyField label="Department" value="Engineering" />
          <ReadOnlyField label="Last working day" value={state === 'critical' ? 'May 24, 2026' : 'June 4, 2026'} highlight={state === 'critical'} />
        </div>
      </FormSection>

      {/* Section 2 — Review Deadline */}
      <FormSection
        title="Review deadline"
        subtitle="How long Minh Lê has to review their transcript before signing off."
      >
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-md border bg-white text-sm ${state === 'critical' ? 'border-rose-200 text-rose-700' : 'border-gray-200 text-gray-900'}`}>
            {reviewDeadline}
          </div>
          {state === 'critical' && (
            <span className="text-[11px] text-rose-700">Auto-adjusted to your team member's last working day minus 1.</span>
          )}
          {state !== 'critical' && (
            <span className="text-[11px] text-gray-500">Default · 3 business days after interview completion.</span>
          )}
        </div>
      </FormSection>

      {/* Section 3 — Data Sources */}
      <FormSection
        title="Data sources"
        subtitle="Where the AI looks to understand Minh Lê's work before the interview."
      >
        {state === 'no-sources' ? (
          <div className="rounded-md border border-gray-200 bg-gray-50/60 p-4 text-center">
            <p className="text-sm text-gray-600">No integrated data sources found for this account.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <DataSourceRow
              icon={GitBranch}
              name="Jira"
              detail="47 active tickets in the last 90 days"
              checked
            />
            <DataSourceRow
              icon={Folder}
              name="Google Drive"
              detail="412 files owned or recently edited"
              checked
            />
            <DataSourceRow
              icon={Mail}
              name="Email metadata"
              detail="Subject lines and participants only. Email content is never read or stored."
              checked
            />
          </div>
        )}
      </FormSection>

      {/* Section 4 — Focus Note */}
      {state !== 'no-sources' && (
        <FormSection title="Focus note" subtitle="Optional. Guide the AI's questioning.">
          <textarea
            placeholder="For example: 'Prioritize Project Atlas and the renewal negotiation with Vendor XYZ.'"
            className="w-full min-h-[80px] px-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors"
            style={{ fontFamily: 'inherit' }}
          />
        </FormSection>
      )}

      {/* Action bar */}
      <div className="flex items-center justify-between pt-2">
        <button className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
          Cancel
        </button>
        <button
          onClick={onStart}
          className="px-4 py-2 rounded-md bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium inline-flex items-center gap-2 transition-colors"
        >
          {state === 'no-sources' ? 'Start session (no seeding)' : 'Start session & begin seeding'}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
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
      <input type="checkbox" defaultChecked={checked} className="mt-0.5 accent-gray-900" />
      <Icon className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900">{name}</div>
        <div className="text-[11px] text-gray-500 mt-0.5">{detail}</div>
      </div>
    </label>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 03 — CONTEXT SEEDING PROGRESS
   UC-HO-01 steps 6–9 · Background scan with Purview classification
   ═══════════════════════════════════════════════════════════════════ */
function Screen03Seeding({ state, onComplete }) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader
        eyebrow="Step 2 of 4"
        title="Seeding context for Minh Lê"
        subtitle="Scanning work history and building a preliminary knowledge map. You can leave this page — we'll notify you when it's done."
      />

      {state === 'partial' && (
        <Banner tone="warning" icon={AlertCircle}>
          <strong>We couldn't reach Google Drive.</strong> Seeding continued with the other sources. The knowledge map will be less detailed for files.
        </Banner>
      )}

      {state === 'purview' && (
        <Banner tone="critical" icon={ShieldAlert}>
          <strong>Sensitivity classification is unavailable.</strong> Seeding is paused. Content cannot enter the staging area without classification, so we're retrying every 15 minutes (attempt 2 of 16).
        </Banner>
      )}

      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        <ProgressStage status="done"     label="Connecting to Jira" />
        <ProgressStage status="done"     label="Scanning 47 tickets" detail="Indexed metadata only — descriptions stay in Jira" />

        {state !== 'partial' && <ProgressStage status="done" label="Connecting to Google Drive" />}
        {state === 'partial' && <ProgressStage status="failed" label="Connecting to Google Drive" detail="Permission denied. Retry from session dashboard." />}

        {state === 'loading' && <ProgressStage status="active" label="Scanning 412 files" detail="245 of 412 · indexing titles only" />}
        {state === 'partial' && <ProgressStage status="skipped" label="Scanning files — skipped" />}
        {state === 'purview' && <ProgressStage status="done" label="Scanning 412 files" detail="Held in staging awaiting classification" />}

        {state === 'loading' && <ProgressStage status="pending" label="Classifying sensitive content" />}
        {state === 'partial' && <ProgressStage status="active" label="Classifying sensitive content" detail="Microsoft Purview · 63%" />}
        {state === 'purview' && <ProgressStage status="paused" label="Classifying sensitive content" detail="Service unavailable · next retry in 9 minutes" />}

        <ProgressStage status="pending" label="Building knowledge map" last />
      </div>

      {/* Info card */}
      <div className="mt-5 rounded-md border border-gray-200 bg-gray-50/60 px-3 py-2.5 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" />
        <p className="text-[11px] text-gray-600 leading-relaxed">
          Personal or sensitive content detected by classification is excluded from the knowledge map automatically. Counts will be shown once seeding completes.
        </p>
      </div>

      {state === 'loading' && (
        <div className="mt-6 flex items-center justify-end">
          <button
            onClick={onComplete}
            className="text-xs text-gray-500 hover:text-gray-900 transition-colors inline-flex items-center gap-1"
          >
            Simulate completion <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}

function ProgressStage({ status, label, detail, last }) {
  const config = {
    done:    { icon: CheckCircle2,   iconCls: 'text-emerald-600',  labelCls: 'text-gray-900' },
    active:  { icon: Loader2,        iconCls: 'text-amber-600 animate-spin', labelCls: 'text-gray-900 font-medium' },
    pending: { icon: Clock,          iconCls: 'text-gray-300',     labelCls: 'text-gray-400' },
    failed:  { icon: AlertCircle,    iconCls: 'text-rose-500',     labelCls: 'text-rose-700' },
    skipped: { icon: X,              iconCls: 'text-gray-400',     labelCls: 'text-gray-500 line-through' },
    paused:  { icon: PauseCircle,    iconCls: 'text-amber-600',    labelCls: 'text-amber-800 font-medium' },
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

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 04 — PRELIMINARY KNOWLEDGE MAP
   UC-HO-01 steps 10–11 · Manager reviews the map
   ═══════════════════════════════════════════════════════════════════ */
function Screen04Map({ state, onConfigure }) {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <PageHeader
        eyebrow="Seeding complete"
        title="Here's what we found in Minh Lê's work"
        subtitle="Review the preliminary knowledge map. You can add priority prompts before the interview begins."
      />

      {state === 'high-pii' && (
        <Banner tone="warning" icon={ShieldCheck}>
          <strong>35% of the scanned content was classified as personal or sensitive and excluded.</strong> The knowledge map covers Minh Lê's role visibly, but some areas may be less detailed than usual. Consider adding priority prompts to fill the gaps.
        </Banner>
      )}

      {state === 'partial' && (
        <Banner tone="warning" icon={AlertCircle}>
          <strong>Google Drive couldn't be scanned.</strong> The map below is built from Jira and email metadata only.
        </Banner>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <StatCard value="47" label="Tickets scanned" />
        <StatCard value={state === 'partial' ? '—' : '412'} label="Files indexed" muted={state === 'partial'} />
        <StatCard value={state === 'partial' ? '17' : '23'} label="Entities detected" />
        <StatCard
          value={state === 'high-pii' ? '15' : '18'}
          label="Retained after classification"
          tone={state === 'high-pii' ? 'warning' : 'default'}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Top projects */}
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-xs uppercase tracking-[0.18em] text-gray-500 font-medium">Top projects by activity</h3>
          </div>
          <div className="divide-y divide-gray-100">
            <ProjectRow name="Project Atlas" detail="32 tickets · primary contributor" />
            <ProjectRow name="Payment Gateway v2" detail="18 tickets · maintenance lead" />
            <ProjectRow name="Customer Portal Refresh" detail="11 tickets · code reviewer" />
          </div>
        </div>

        {/* Knowledge gaps */}
        <div className="rounded-lg border border-amber-200 bg-amber-50/30 overflow-hidden">
          <div className="px-4 py-3 border-b border-amber-200/70 bg-amber-50/40">
            <h3 className="text-xs uppercase tracking-[0.18em] text-amber-800 font-medium">Likely knowledge gaps</h3>
          </div>
          <div className="divide-y divide-amber-100/60">
            <GapRow text="Payment Gateway timeout — no written runbook, recurring incidents" />
            <GapRow text="Vendor XYZ renewal — high email volume, no project doc" />
            <GapRow text="Customer Portal infra config — owned by Minh Lê, low documentation" />
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between pt-2 pb-4">
        <button className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
          Back to dashboard
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={onConfigure}
            className="px-3 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 text-sm font-medium inline-flex items-center gap-1.5 transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            Configure interview prompts
          </button>
          <button className="px-4 py-1.5 rounded-md bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium inline-flex items-center gap-1.5 transition-colors">
            Confirm and finish
            <CheckCircle2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label, muted, tone }) {
  const cls = tone === 'warning' ? 'border-amber-200 bg-amber-50/30' : 'border-gray-200 bg-white';
  const valueCls = tone === 'warning' ? 'text-amber-700' : muted ? 'text-gray-400' : 'text-gray-900';
  return (
    <div className={`rounded-lg border px-4 py-3 ${cls}`}>
      <div className={`text-2xl font-semibold ${valueCls} tracking-tight`} style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{value}</div>
      <div className="text-[11px] text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

function ProjectRow({ name, detail }) {
  return (
    <div className="px-4 py-2.5 hover:bg-gray-50/50 transition-colors">
      <div className="text-sm text-gray-900 font-medium">{name}</div>
      <div className="text-[11px] text-gray-500 mt-0.5">{detail}</div>
    </div>
  );
}

function GapRow({ text }) {
  return (
    <div className="px-4 py-2.5 flex items-start gap-2">
      <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0 mt-1" />
      <p className="text-[12px] text-gray-700 leading-relaxed">{text}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 05 — PROMPT CONFIGURATION (UC-HO-05)
   Manager adds priority prompts to steer the interview
   ═══════════════════════════════════════════════════════════════════ */
function Screen05Prompts({ state }) {
  const locked = state === 'locked';

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Breadcrumb path={['Dashboard', "Minh Lê's session", 'Configure prompts']} />
      <PageHeader
        title="Configure interview prompts"
        subtitle="Guide what the AI focuses on during Minh Lê's voice interview."
      />

      {locked && (
        <Banner tone="muted" icon={Lock}>
          <strong>The interview has already been completed.</strong> You can view the prompts that were used, but they can no longer be edited.
        </Banner>
      )}

      {/* AI-generated prompts (read-only always) */}
      <FormSection
        title="AI-generated prompts"
        subtitle="Suggestions the AI prepared from the seeded context. These will be asked unless you remove the source content."
      >
        <div className="space-y-2">
          <AiPromptRow text="What were your most active client relationships in the final quarter?" />
          <AiPromptRow text="Walk me through the architecture decisions on Project Atlas." />
          <AiPromptRow text="Are there any unwritten escalation paths the team relies on?" />
          <AiPromptRow text="Which tools or integrations are most likely to break after you leave?" />
        </div>
      </FormSection>

      {/* Priority prompts (editable except in locked state) */}
      <FormSection
        title="Priority prompts"
        subtitle="Your additions. These get asked before the AI-generated ones, weighted by priority."
      >
        {state === 'cold' && (
          <div className="rounded-md border border-gray-200 border-dashed bg-white p-6 text-center">
            <p className="text-sm text-gray-600 mb-3">No priority prompts yet.</p>
            <button className="px-3 py-1.5 rounded-md bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors">
              <Plus className="w-3 h-3" />
              Add priority prompt
            </button>
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
              text="Ensure we capture the manual reconciliation workaround used during the Q1 finance close."
              priority="high"
              locked={locked}
            />
          </div>
        )}

        {state === 'policy' && (
          <>
            <div className="rounded-md border border-rose-200 bg-rose-50/40 px-4 py-3 mb-2">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-[12px] text-rose-800 leading-relaxed">
                  This prompt looks like it might ask for personal opinions about colleagues, which is outside the scope of a knowledge transfer interview. Try rephrasing around the work itself.
                </div>
              </div>
              <div className="px-3 py-2 rounded border border-rose-200 bg-white text-sm text-gray-700">
                <span className="bg-rose-100 text-rose-800 px-1 rounded">What do you think about</span> the team's handling of Vendor XYZ?
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-xs text-rose-700 hover:text-rose-800 underline">Rephrase</button>
              <button className="text-xs text-gray-500 hover:text-gray-700">Remove</button>
            </div>
          </>
        )}

        {!locked && state !== 'policy' && (
          <button className="mt-2 text-xs text-gray-700 hover:text-gray-900 inline-flex items-center gap-1.5 transition-colors">
            <Plus className="w-3 h-3" />
            Add another prompt
          </button>
        )}
      </FormSection>

      {/* Action bar */}
      {!locked && (
        <div className="flex items-center justify-between pt-2 pb-4">
          <button className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
            Back
          </button>
          <button className="px-4 py-2 rounded-md bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium inline-flex items-center gap-2 transition-colors">
            Save prompts
            <CheckCircle2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

function AiPromptRow({ text }) {
  return (
    <div className="flex items-start gap-2 px-3 py-2 rounded-md bg-gray-50/60 border border-gray-200">
      <Sparkles className="w-3 h-3 text-amber-500 shrink-0 mt-1" />
      <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
    </div>
  );
}

function PriorityPromptRow({ text, priority, locked }) {
  const priCfg = {
    critical: { label: 'Critical', cls: 'bg-rose-50 border-rose-200 text-rose-700' },
    high:     { label: 'High',     cls: 'bg-amber-50 border-amber-200 text-amber-700' },
    normal:   { label: 'Normal',   cls: 'bg-gray-100 border-gray-200 text-gray-600' },
  }[priority];

  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2.5 flex items-start gap-3">
      <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase tracking-wider font-semibold shrink-0 mt-0.5 ${priCfg.cls}`}>
        {priCfg.label}
      </span>
      <p className="text-sm text-gray-700 leading-relaxed flex-1">{text}</p>
      {!locked && (
        <div className="flex items-center gap-1 shrink-0">
          <button className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
            <Pencil className="w-3 h-3" />
          </button>
          <button className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-rose-700 transition-colors">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SHARED PRIMITIVES — used across screens
   ═══════════════════════════════════════════════════════════════════ */

function PageHeader({ eyebrow, title, subtitle, actor }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        {eyebrow && <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">{eyebrow}</span>}
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight mt-1">{title}</h1>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {actor && (
        <span className="text-[11px] text-gray-500 shrink-0 pt-1">{actor}</span>
      )}
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
      {subtitle && <p className="text-[12px] text-gray-500 mb-3">{subtitle}</p>}
      {children}
    </section>
  );
}

function Banner({ tone, icon: Icon, children }) {
  const cfg = {
    critical: { cls: 'border-rose-200 bg-rose-50/60',   iconCls: 'text-rose-600',   textCls: 'text-rose-900' },
    warning:  { cls: 'border-amber-200 bg-amber-50/60', iconCls: 'text-amber-600',  textCls: 'text-amber-900' },
    muted:    { cls: 'border-gray-200 bg-gray-50',      iconCls: 'text-gray-500',   textCls: 'text-gray-700' },
  }[tone];

  return (
    <div className={`rounded-md border ${cfg.cls} px-3 py-2.5 mb-5 flex items-start gap-2`}>
      <Icon className={`w-4 h-4 ${cfg.iconCls} shrink-0 mt-0.5`} strokeWidth={1.75} />
      <div className={`text-[12px] ${cfg.textCls} leading-relaxed`}>{children}</div>
    </div>
  );
}

function DashedEmpty({ children }) {
  return (
    <div className="rounded-lg border border-gray-200 border-dashed bg-white p-6 text-center text-sm text-gray-500">
      {children}
    </div>
  );
}

/* Shared S0 component — Audit Log Tile */
function AuditLogTile({ severity = 'low', timestamp, actor, action, details }) {
  const borderColor = {
    critical: 'rgb(244, 63, 94)',
    high: 'rgb(245, 158, 11)',
    medium: 'rgb(156, 163, 175)',
    low: 'rgb(229, 231, 235)'
  }[severity];

  return (
    <div
      className="rounded-md border border-gray-200 bg-white px-3 py-2.5"
      style={{ borderLeft: `2px solid ${borderColor}` }}
    >
      <div className="flex items-center justify-between mb-1">
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
