'use client';

import React, { useState } from 'react';
import {
  ChevronLeft, ChevronRight, ChevronDown, ArrowRight, ArrowUpRight,
  CheckCircle2, AlertTriangle, AlertCircle, Info, Clock, X, RefreshCw,
  Plus, Pencil, Trash2, Send, Flag, Eye, Filter, Maximize2, Settings,
  GitBranch, Folder, Mail, Users, FileText, Briefcase, Calendar,
  Globe, MessageSquare, Building2, Sparkles, Lock, ShieldCheck, ShieldAlert,
  KeyRound, Network, Mic, Pause, Play, Square, MicOff, Volume2,
  MessageCircle, Type, BookOpen, FileSignature, Loader2, ExternalLink,
  TrendingUp, Target, ArrowDownRight, Tag,
  Database, GitCompare, History
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════
   ART-EEP — Comprehensive System UI Tour
   
   8 features × 3 states = 24 demonstrated state views, traceable to
   UC-HO-01 through UC-HO-07, UC-ON-01 through UC-ON-03, plus Step Zero.
   
   Personas:
     · Hà Vy — Manager
     · Minh Lê — Offboarder (Engineering)
     · Trần Hữu Nam — Onboarder (succeeds Minh Lê)
     · Khánh Linh Trần — People Ops (urgent offboard)
     · Phương Anh Nguyễn — Sales
     · An Quân Vũ — Platform Admin (Step Zero)
   ═══════════════════════════════════════════════════════════════════ */

const FEATURES = [
  { id: 'sz',    num: '00', name: 'Step Zero',          uc: 'SZ',           states: [['empty','Cold start'], ['happy','All connected'], ['failure','Connector failed']] },
  { id: 'dash',  num: '01', name: 'Handover Dashboard', uc: 'UC-HO-01',     states: [['empty','No pending'], ['happy','3 sessions'], ['urgent','Critical notice']] },
  { id: 'intv',  num: '02', name: 'Voice Interview',    uc: 'UC-HO-02',     states: [['briefing','Pre-interview'], ['live','Recording'], ['inactivity','Inactivity check']] },
  { id: 'rev',   num: '03', name: 'Review & Sign',      uc: 'UC-HO-03',     states: [['reading','Reading draft'], ['editing','Editing item'], ['flagged','Manager flag']] },
  { id: 'kg',    num: '04', name: 'KG Commit',          uc: 'UC-HO-04',     states: [['indexing','Indexing'], ['complete','Complete'], ['review','Needs review']] },
  { id: 'build', num: '05', name: 'Playbook Builder',   uc: 'UC-ON-01',     states: [['configure','Configure'], ['generating','Generating'], ['complete','Complete']] },
  { id: 'read',  num: '06', name: 'Playbook Reading',   uc: 'UC-ON-02',     states: [['dashboard','Day 1'], ['reading','Reading'], ['restricted','Restricted'], ['lineage','Lineage open']] },
  { id: 'skill', num: '07', name: 'Skill Gap',          uc: 'UC-ON-03',     states: [['empty','No profile'], ['happy','Gaps & plan'], ['disputed','Disputed']] },
  { id: 'fb',    num: '08', name: 'Feedback Loop',      uc: 'UC-HO-06/07',  states: [['report','Report'], ['review','Manager review'], ['resolved','Resolved']] },
];

export default function ARTeepSystemUI() {
  const [featureId, setFeatureId] = useState('sz');
  const [stateKey, setStateKey] = useState('empty');

  const feature = FEATURES.find(f => f.id === featureId);

  const handleFeatureChange = (id) => {
    setFeatureId(id);
    const f = FEATURES.find(x => x.id === id);
    setStateKey(f.states[0][0]);
  };

  return (
    <div className="h-screen w-full bg-gray-50 text-gray-900 flex flex-col overflow-hidden" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>

      <style>{`
        @keyframes completionGlow {
          0% { box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.45), 0 0 16px rgba(124, 58, 237, 0.35); }
          100% { box-shadow: 0 0 0 0px rgba(124, 58, 237, 0), 0 0 0px rgba(124, 58, 237, 0); }
        }
        .completion-glow { animation: completionGlow 800ms ease-out; }
      `}</style>

      {/* Brand + feature nav */}
      <header className="bg-white border-b border-gray-200 px-5 py-2.5 flex items-center justify-between shrink-0 gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
          <span className="text-gray-900 font-semibold tracking-[0.18em] text-xs" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>ART-EEP</span>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-gray-500 text-xs">System UI Tour</span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {FEATURES.map(f => {
            const isActive = f.id === featureId;
            return (
              <button
                key={f.id}
                onClick={() => handleFeatureChange(f.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] border transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${
                  isActive ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-gray-400" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{f.num}</span>
                <span>{f.name}</span>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-gray-500 shrink-0" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{feature.uc}</div>
      </header>

      {/* State selector */}
      <div className="bg-white border-b border-gray-200 px-5 py-2 flex items-center gap-2 shrink-0">
        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium shrink-0">State</span>
        <span className="w-px h-3 bg-gray-200" />
        <div className="flex items-center gap-1 flex-wrap">
          {feature.states.map(([key, label]) => {
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

      <main className="flex-1 overflow-y-auto">
        {featureId === 'sz'    && <FeatureStepZero state={stateKey} />}
        {featureId === 'dash'  && <FeatureHandoverDash state={stateKey} />}
        {featureId === 'intv'  && <FeatureVoiceInterview state={stateKey} />}
        {featureId === 'rev'   && <FeatureReviewSign state={stateKey} />}
        {featureId === 'kg'    && <FeatureKGCommit state={stateKey} />}
        {featureId === 'build' && <FeaturePlaybookBuilder state={stateKey} />}
        {featureId === 'read'  && <FeaturePlaybookReading state={stateKey} />}
        {featureId === 'skill' && <FeatureSkillGap state={stateKey} />}
        {featureId === 'fb'    && <FeatureFeedbackLoop state={stateKey} />}
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FEATURE 00 · STEP ZERO — Connector Setup
   ═══════════════════════════════════════════════════════════════════ */
function FeatureStepZero({ state }) {
  if (state === 'empty') return <StepZeroEmpty />;
  if (state === 'happy') return <StepZeroHealthy />;
  return <StepZeroFailure />;
}

const CONNECTOR_CATALOG = [
  { name: 'Microsoft 365',    icon: Mail,         category: 'Productivity' },
  { name: 'Google Workspace', icon: Folder,       category: 'Productivity' },
  { name: 'Jira',             icon: GitBranch,    category: 'Engineering' },
  { name: 'Salesforce',       icon: Briefcase,    category: 'Sales' },
  { name: 'Slack',            icon: MessageSquare,category: 'Communication' },
  { name: 'Notion',           icon: FileText,     category: 'Productivity' },
  { name: 'GitHub',           icon: GitBranch,    category: 'Engineering' },
  { name: 'HRIS',             icon: Users,        category: 'HR' },
];

function StepZeroEmpty() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader
        eyebrow="Step Zero"
        title="Integrations"
        subtitle="Connect the data sources ART-EEP will use to capture knowledge."
        actor="An Quân Vũ · Platform Admin"
      />

      <div className="rounded-lg border border-gray-200 bg-white p-10 mb-6 flex flex-col items-center text-center">
        <div className="w-11 h-11 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center mb-3">
          <Globe className="w-5 h-5 text-violet-600" strokeWidth={1.75} />
        </div>
        <h2 className="text-sm font-semibold text-gray-900 mb-1">No integrations connected yet</h2>
        <p className="text-sm text-gray-500 max-w-sm mb-4">
          Connect at least one data source per department so the AI can learn what people actually work on.
        </p>
        <PrimaryButton>
          <Plus className="w-3.5 h-3.5" />
          Set up first integration
        </PrimaryButton>
      </div>

      <SectionLabel count={8}>Available</SectionLabel>
      <div className="grid grid-cols-4 gap-2.5">
        {CONNECTOR_CATALOG.map(c => (
          <ConnectorCard key={c.name} {...c} status="off" />
        ))}
      </div>
    </div>
  );
}

function StepZeroHealthy() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader
        eyebrow="Step Zero"
        title="Integration health"
        subtitle="6 healthy · 0 degraded · 0 failed · 2 not connected"
        actor="An Quân Vũ · Platform Admin"
      />

      <SectionLabel count={6}>Connected</SectionLabel>
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        <ConnectorHealthCard name="Microsoft 365"    icon={Mail}        status="healthy" lastSync="2 minutes ago" />
        <ConnectorHealthCard name="Google Workspace" icon={Folder}      status="healthy" lastSync="3 minutes ago" />
        <ConnectorHealthCard name="Jira"             icon={GitBranch}   status="healthy" lastSync="12 minutes ago" />
        <ConnectorHealthCard name="Salesforce"       icon={Briefcase}   status="healthy" lastSync="6 minutes ago" />
        <ConnectorHealthCard name="Slack"            icon={MessageSquare} status="healthy" lastSync="1 minute ago" />
        <ConnectorHealthCard name="HRIS"             icon={Users}       status="healthy" lastSync="1 hour ago" />
      </div>

      <SectionLabel count={2}>Not connected</SectionLabel>
      <div className="grid grid-cols-3 gap-2.5">
        <ConnectorCard name="Notion" icon={FileText}  category="Productivity" status="off" />
        <ConnectorCard name="GitHub" icon={GitBranch} category="Engineering"  status="off" />
      </div>
    </div>
  );
}

function StepZeroFailure() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader
        eyebrow="Step Zero"
        title="Integration health"
        subtitle="5 healthy · 0 degraded · 1 failed · 2 not connected"
        actor="An Quân Vũ · Platform Admin"
      />

      <Banner tone="critical" icon={AlertCircle}>
        <strong>Salesforce sync has failed for 4 hours.</strong> The OAuth token expired and the refresh attempt was rejected. Sales handover sessions can't access deal context until this is resolved.
      </Banner>

      <SectionLabel>Needs attention</SectionLabel>
      <div className="mb-6">
        <ConnectorHealthCard
          name="Salesforce"
          icon={Briefcase}
          status="failed"
          lastSync="4 hours ago · failed"
          error="OAuth refresh token rejected · re-authentication required"
          showRetry
        />
      </div>

      <SectionLabel count={5}>Connected</SectionLabel>
      <div className="grid grid-cols-3 gap-2.5">
        <ConnectorHealthCard name="Microsoft 365"    icon={Mail}          status="healthy" lastSync="2 minutes ago" />
        <ConnectorHealthCard name="Google Workspace" icon={Folder}        status="healthy" lastSync="3 minutes ago" />
        <ConnectorHealthCard name="Jira"             icon={GitBranch}     status="healthy" lastSync="12 minutes ago" />
        <ConnectorHealthCard name="Slack"            icon={MessageSquare} status="healthy" lastSync="1 minute ago" />
        <ConnectorHealthCard name="HRIS"             icon={Users}         status="healthy" lastSync="1 hour ago" />
      </div>
    </div>
  );
}

function ConnectorCard({ name, icon: Icon, category, status }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 hover:border-gray-300 transition-colors">
      <div className="w-7 h-7 rounded-md bg-gray-50 border border-gray-200 flex items-center justify-center mb-2">
        <Icon className="w-3.5 h-3.5 text-gray-600" strokeWidth={1.75} />
      </div>
      <div className="text-sm font-medium text-gray-900">{name}</div>
      <div className="text-[10px] text-gray-500 mt-0.5">{category}</div>
      <div className="text-[10px] text-gray-400 mt-1.5">Not connected</div>
    </div>
  );
}

function ConnectorHealthCard({ name, icon: Icon, status, lastSync, error, showRetry }) {
  const statusCfg = {
    healthy: { dotCls: 'bg-emerald-500', textCls: 'text-emerald-700', label: 'Healthy' },
    failed:  { dotCls: 'bg-rose-500',    textCls: 'text-rose-700',    label: 'Failed' },
  }[status];

  return (
    <div
      className="rounded-lg border bg-white p-3"
      style={status === 'failed' ? { borderColor: 'rgb(254, 205, 211)', borderLeft: '2px solid rgb(244, 63, 94)' } : { borderColor: 'rgb(229, 231, 235)' }}
    >
      <div className="flex items-start gap-2 mb-2">
        <div className="w-7 h-7 rounded-md bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
          <Icon className="w-3.5 h-3.5 text-gray-600" strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">{name}</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotCls}`} />
            <span className={`text-[10px] ${statusCfg.textCls} font-medium`}>{statusCfg.label}</span>
          </div>
        </div>
      </div>
      <div className="text-[11px] text-gray-500">{lastSync}</div>
      {error && (
        <div className="text-[11px] text-rose-700 mt-1 leading-relaxed">{error}</div>
      )}
      {showRetry && (
        <button className="mt-2 px-2 py-1 rounded-md border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 text-[11px] font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
          <RefreshCw className="w-2.5 h-2.5" />
          Re-authenticate
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FEATURE 01 · HANDOVER DASHBOARD (UC-HO-01)
   ═══════════════════════════════════════════════════════════════════ */
function FeatureHandoverDash({ state }) {
  if (state === 'empty') return <HandoverDashEmpty />;
  return <HandoverDashHappy urgent={state === 'urgent'} />;
}

function HandoverDashEmpty() {
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

function HandoverDashHappy({ urgent }) {
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
          {urgent && (
            <PendingSession
              initials="KL"
              name="Khánh Linh Trần"
              role="Head of People Operations"
              dept="People & Culture"
              lastDay="May 26, 2026"
              days={2}
              sources={[
                { icon: Users,    label: 'HR system · 240 records' },
                { icon: FileText, label: 'Notion · 212 policy docs' },
                { icon: Mail,     label: 'Email metadata' },
              ]}
            />
          )}
          <PendingSession
            initials="PA"
            name="Phương Anh Nguyễn"
            role="Senior Account Executive"
            dept="Sales"
            lastDay="May 30, 2026"
            days={urgent ? 6 : 14}
            sources={[
              { icon: Briefcase, label: 'Salesforce · 38 active deals' },
              { icon: Calendar,  label: 'Calendar · 90 days' },
              { icon: Mail,      label: 'Email metadata' },
            ]}
          />
          <PendingSession
            initials="ML"
            name="Minh Lê"
            role="Senior Backend Engineer"
            dept="Engineering"
            lastDay="June 4, 2026"
            days={urgent ? 12 : 21}
            sources={[
              { icon: GitBranch, label: 'Jira · 47 active tickets' },
              { icon: Folder,    label: 'Google Drive · 412 files' },
              { icon: Mail,      label: 'Email metadata' },
            ]}
          />
          {!urgent && <PlaceholderSession />}
        </div>
      </section>
    </div>
  );
}

function PendingSession({ initials, name, role, dept, lastDay, days, sources }) {
  const urgent = days < 5;
  const critical = days < 3;
  return (
    <article
      className="rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-colors"
      style={critical ? { borderLeft: '2px solid rgb(244, 63, 94)' } : undefined}
    >
      <div className="p-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-gray-900">{name}</h3>
              {critical && (
                <span className="text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold bg-rose-50 border border-rose-200 text-rose-700">
                  Urgent
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{role} · {dept}</p>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-500 flex-wrap">
              <Calendar className="w-3 h-3 text-gray-400" />
              <span>Last working day · {lastDay}</span>
              <span className="text-gray-300">·</span>
              <span className={urgent ? 'text-rose-700 font-medium' : 'text-gray-600'}>{days} days remaining</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              {sources.map((src, i) => {
                const Icon = src.icon;
                return (
                  <span key={i} className="inline-flex items-center gap-1 text-[10px] text-gray-600 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded">
                    <Icon className="w-2.5 h-2.5 text-gray-500" strokeWidth={1.75} />
                    {src.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        <PrimaryButton>
          Initiate
          <ArrowRight className="w-3.5 h-3.5" />
        </PrimaryButton>
      </div>
    </article>
  );
}

function PlaceholderSession() {
  return null;
}

/* ═══════════════════════════════════════════════════════════════════
   FEATURE 02 · VOICE INTERVIEW (UC-HO-02)
   ═══════════════════════════════════════════════════════════════════ */
function FeatureVoiceInterview({ state }) {
  if (state === 'briefing') return <InterviewBriefing />;
  return <InterviewLive inactive={state === 'inactivity'} />;
}

function InterviewBriefing() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <PageHeader
        eyebrow="Voice interview · pre-briefing"
        title="Ready to capture your knowledge"
        subtitle="This session will take about 45 minutes. The AI will ask follow-up questions based on what you share."
        actor="Minh Lê · Offboarder"
      />

      <FormSection title="Recording consent" subtitle="What happens with your voice.">
        <div className="rounded-md border border-gray-200 bg-white p-4 space-y-2.5">
          <ConsentLine icon={Mic}>
            Your voice is transcribed in real time. The audio file is encrypted and auto-deleted 90 days after commit.
          </ConsentLine>
          <ConsentLine icon={Eye}>
            Only you, your manager, and authorized HR admins can access the recording during that window.
          </ConsentLine>
          <ConsentLine icon={Type}>
            You can switch to text mode at any time if you prefer typing.
          </ConsentLine>
        </div>
      </FormSection>

      <FormSection title="Topics we've prepared (7 from your work history)" subtitle="The AI steers through these. You can go deeper into any.">
        <div className="space-y-1.5">
          <TopicRow title="Project Atlas" detail="32 tickets · primary contributor" />
          <TopicRow title="Payment Gateway timeout" detail="Recurring incident · no runbook" priority="critical" mgr />
          <TopicRow title="Vendor XYZ renewal" detail="High email volume · no project doc" priority="critical" mgr />
          <TopicRow title="Customer Portal infra" detail="Owned by you · low documentation" />
          <TopicRow title="Architecture decisions" detail="Cross-cutting · escalation patterns" />
        </div>
      </FormSection>

      <div className="flex items-center justify-between pt-2">
        <GhostButton>
          <Type className="w-3 h-3" />
          Switch to text mode
        </GhostButton>
        <PrimaryButton>
          Begin interview
          <ArrowRight className="w-3.5 h-3.5" />
        </PrimaryButton>
      </div>
    </div>
  );
}

function ConsentLine({ icon: Icon, children }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" strokeWidth={1.75} />
      <p className="text-[12px] text-gray-700 leading-relaxed">{children}</p>
    </div>
  );
}

function TopicRow({ title, detail, priority, mgr }) {
  const dotCls = priority === 'critical' ? 'bg-rose-500' : 'bg-gray-400';
  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2 flex items-center gap-3">
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotCls}`} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900">{title}</div>
        <div className="text-[11px] text-gray-500 mt-0.5">{detail}</div>
      </div>
      {mgr && (
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-50 border border-yellow-200 text-yellow-800 uppercase tracking-wider font-semibold shrink-0">
          Manager priority
        </span>
      )}
    </div>
  );
}

function InterviewLive({ inactive }) {
  return (
    <div className="h-full flex flex-col bg-white relative">
      <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between shrink-0">
        <div className="text-xs flex items-center gap-2">
          <span className="text-gray-500">Voice interview</span>
          <span className="text-gray-300">·</span>
          <span className="text-gray-900 font-medium">Minh Lê</span>
        </div>
        <div className="text-xs flex items-center gap-2 text-gray-500">
          <span>Topic <span className="text-gray-900 font-semibold">3</span> of <span className="text-gray-900 font-semibold">7</span></span>
          <div className="w-16 h-1 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full bg-gray-900" style={{ width: '42%' }} />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-xl">
          <div className="flex justify-center mb-5">
            <PulsingMic />
          </div>

          <div className="text-center mb-6 flex items-center justify-center gap-2 text-sm">
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
            <span className="text-rose-700 font-medium">Recording</span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-700" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>12:34</span>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-4 mb-3">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-600" />
              <span className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium">AI asked</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-50 border border-yellow-200 text-yellow-800 ml-auto">
                Manager priority
              </span>
            </div>
            <p className="text-sm text-gray-900 leading-relaxed">
              Can you walk me through what conditions you committed to in the Vendor XYZ renewal negotiation?
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium">Live transcription</span>
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Yes, the most challenging conversation was around the SLA terms. We agreed to a 4-hour response window for critical issues, but only after pushing back on their initial 1-hour ask. The trade-off was that we accepted
              <span className="inline-block w-0.5 h-3.5 bg-gray-900 ml-0.5 align-middle animate-pulse" />
            </p>
          </div>

          <div className="flex items-center justify-center gap-2">
            <SecondaryButton>
              <Pause className="w-3.5 h-3.5" />
              Pause
            </SecondaryButton>
            <button className="px-3 py-2 rounded-md bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
              <Square className="w-3.5 h-3.5" fill="currentColor" />
              End interview
            </button>
          </div>
        </div>
      </div>

      {inactive && (
        <div className="absolute inset-0 bg-gray-900/30 flex items-center justify-center z-10" style={{ backdropFilter: 'blur(2px)' }}>
          <div className="bg-white rounded-lg border border-gray-200 px-5 py-4 max-w-sm shadow-xl">
            <div className="flex items-start gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-yellow-700" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Still there?</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  We haven't heard from you in 5 minutes. We'll pause automatically in 60 seconds.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <SecondaryButton>Pause now</SecondaryButton>
              <PrimaryButton>I'm here</PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PulsingMic() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 96, height: 96 }}>
      <span className="absolute inline-flex rounded-full bg-rose-400 opacity-20 animate-ping" style={{ width: 96, height: 96 }} />
      <span className="absolute rounded-full bg-rose-100" style={{ width: 72, height: 72 }} />
      <span className="relative inline-flex items-center justify-center rounded-full bg-rose-500" style={{ width: 52, height: 52 }}>
        <Mic className="w-6 h-6 text-white" strokeWidth={2} />
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FEATURE 03 · REVIEW & SIGN (UC-HO-03)
   ═══════════════════════════════════════════════════════════════════ */
function FeatureReviewSign({ state }) {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between shrink-0">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">Review and sign</span>
          <h1 className="text-base font-semibold text-gray-900">Your handover summary</h1>
        </div>
        <button
          disabled={state === 'flagged'}
          className={`px-3 py-1.5 rounded-md text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30 ${
            state === 'flagged' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-700 text-white'
          }`}
        >
          Approve & sign
          <FileSignature className="w-3.5 h-3.5" />
        </button>
      </div>

      {state === 'flagged' && (
        <div className="px-5 py-2 border-b border-rose-200 bg-rose-50/40 flex items-center gap-2 shrink-0">
          <Flag className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <p className="text-[12px] text-rose-800">
            <strong>Your manager flagged 1 item.</strong> Resolve it before you can sign.
          </p>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Transcript panel */}
        <div style={{ width: '45%' }} className="border-r border-gray-200 flex flex-col overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50/60 flex items-center justify-between shrink-0">
            <h2 className="text-xs uppercase tracking-[0.18em] text-gray-500 font-medium">Interview transcript</h2>
            <span className="text-[10px] text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>42:18</span>
          </div>
          <div className="px-4 py-2.5 border-b border-gray-200 bg-white flex items-center gap-2.5 shrink-0">
            <button className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center">
              <Play className="w-2.5 h-2.5" fill="currentColor" />
            </button>
            <span className="text-[10px] text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>03:38</span>
            <div className="flex-1 h-1 rounded-full bg-gray-100 overflow-hidden relative">
              <div className="absolute inset-y-0 left-0 bg-gray-900" style={{ width: '8.5%' }} />
            </div>
            <span className="text-[10px] text-gray-400" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>42:18</span>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
            <TranscriptLine time="03:21" speaker="ai">
              Can you walk me through what conditions you committed to in the Vendor XYZ renewal negotiation?
            </TranscriptLine>
            <TranscriptLine time="03:38" speaker="user" highlighted={state === 'editing'}>
              The most challenging conversation was around the SLA terms. We agreed to a 4-hour response window for critical issues, but only after pushing back on their initial 1-hour ask.
            </TranscriptLine>
            <TranscriptLine time="05:02" speaker="user">
              On the Payment Gateway timeout — we never wrote a formal runbook for it. The fix is to restart the connection pool service between 2 and 4 AM.
            </TranscriptLine>
          </div>
        </div>

        {/* Summary panel */}
        <div style={{ width: '55%' }} className="flex flex-col overflow-hidden bg-white">
          <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50/60 flex items-center gap-2 shrink-0 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            <SectionTab active>Vendor XYZ renewal</SectionTab>
            <SectionTab>Project Atlas</SectionTab>
            <SectionTab flagged={state === 'flagged'}>Payment Gateway</SectionTab>
            <SectionTab>Customer Portal</SectionTab>
            <SectionTab>Tools & access</SectionTab>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {state === 'flagged' && <ManagerFlag />}
            {state === 'editing' ? <DraftItemEditing /> : (
              <DraftItem
                id="VXZ-01"
                title="SLA terms agreed during renewal"
                body="Agreed to a 4-hour response window for critical issues (initial Vendor ask was 1-hour). Trade-off: accepted higher per-incident penalty."
                status="ai"
                source="03:38"
              />
            )}
            <DraftItem
              id="VXZ-02"
              title="Penalty escalation clause"
              body="If three SLA breaches occur in a calendar quarter, the per-incident penalty doubles for the rest of the quarter."
              status="ai"
              source="04:12"
            />
            <DraftItem
              id="VXZ-03"
              title="Pricing renegotiation trigger"
              body="If monthly transaction volume exceeds 2.5M, pricing automatically renegotiates. Currently at 1.8M."
              status="manual"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function TranscriptLine({ time, speaker, children, highlighted }) {
  return (
    <div className={`rounded-md px-2.5 py-1.5 transition-colors ${highlighted ? 'bg-yellow-50 border border-yellow-200' : ''}`}>
      <div className="flex items-center gap-2 mb-0.5">
        <span className="text-[10px] text-gray-400" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{time}</span>
        <span className={`text-[10px] uppercase tracking-wider font-semibold ${speaker === 'ai' ? 'text-violet-700' : 'text-gray-600'}`}>
          {speaker === 'ai' ? 'AI' : 'You'}
        </span>
      </div>
      <p className="text-[12px] text-gray-700 leading-relaxed">{children}</p>
    </div>
  );
}

function SectionTab({ children, active, flagged }) {
  return (
    <button className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition-all border shrink-0 ${
      active ? 'border-gray-900 bg-white text-gray-900 font-medium' : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-white hover:border-gray-200'
    }`}>
      <span>{children}</span>
      {flagged && <Flag className="w-3 h-3 text-rose-500" />}
    </button>
  );
}

function DraftItem({ id, title, body, status, source }) {
  const statusCfg = {
    ai:     { label: 'AI generated', cls: 'bg-gray-50 border-gray-200 text-gray-600',          icon: Sparkles },
    manual: { label: 'Added by you', cls: 'bg-emerald-50 border-emerald-200 text-emerald-700', icon: Plus },
  }[status];
  const Icon = statusCfg.icon;
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
        <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase tracking-wider font-semibold inline-flex items-center gap-1 ${statusCfg.cls}`}>
          <Icon className="w-2.5 h-2.5" />
          {statusCfg.label}
        </span>
        <span className="text-[10px] text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{id}</span>
        {source && (
          <>
            <span className="text-gray-300">·</span>
            <button className="text-[10px] text-gray-500 hover:text-gray-900 inline-flex items-center gap-1 transition-colors">
              <ExternalLink className="w-2.5 h-2.5" />
              Source · {source}
            </button>
          </>
        )}
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-700 leading-relaxed mb-2">{body}</p>
      <div className="flex items-center justify-end">
        <button className="text-xs text-gray-500 hover:text-gray-900 inline-flex items-center gap-1 transition-colors">
          <Pencil className="w-3 h-3" />
          Edit
        </button>
      </div>
    </article>
  );
}

function DraftItemEditing() {
  return (
    <article className="rounded-lg border border-yellow-300 bg-yellow-50/30 p-3">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-[10px] px-1.5 py-0.5 rounded border uppercase tracking-wider font-semibold bg-yellow-100 border-yellow-300 text-yellow-800 inline-flex items-center gap-1">
          <Pencil className="w-2.5 h-2.5" />
          Editing
        </span>
        <span className="text-[10px] text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>VXZ-01</span>
        <span className="ml-auto text-[10px] text-gray-500 inline-flex items-center gap-1">
          <GitCompare className="w-3 h-3" />
          Inline diff
        </span>
      </div>

      {/* QA-INT-01 Refinement C: original AI text preserved and visible during edit */}
      <div className="rounded-md border border-gray-200 bg-gray-50/60 p-2.5 mb-2.5">
        <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium mb-1 flex items-center gap-1.5">
          <Sparkles className="w-2.5 h-2.5 text-gray-400" />
          Original · AI-generated
        </div>
        <p className="text-sm text-gray-500 leading-relaxed line-through opacity-70">
          Agreed to a 4-hour response window for critical issues (initial Vendor ask was 1-hour). Trade-off: accepted higher per-incident penalty.
        </p>
      </div>

      {/* Editable */}
      <div className="text-[10px] uppercase tracking-[0.18em] text-yellow-800 font-medium mb-1">Your correction</div>
      <input
        defaultValue="SLA terms agreed during renewal"
        className="w-full text-sm font-semibold text-gray-900 bg-transparent outline-none border-b border-yellow-300 pb-1 mb-2"
      />
      <textarea
        defaultValue="Agreed to a 4-hour response window for P1 incidents only — P2/P3 retain the standard 1 business day SLA. Trade-off: accepted higher per-incident penalty (2x base rate)."
        className="w-full text-sm text-gray-700 leading-relaxed bg-transparent outline-none resize-none min-h-[50px]"
        style={{ fontFamily: 'inherit' }}
      />

      <div className="flex items-center justify-between pt-2 border-t border-yellow-200/60 mt-2">
        <span className="text-[10px] text-yellow-800">Both versions preserved in immutable audit trail (QA-INT-01 §1.3).</span>
        <div className="flex items-center gap-2">
          <GhostButton>Cancel</GhostButton>
          <PrimaryButton>
            <CheckCircle2 className="w-3 h-3" />
            Save
          </PrimaryButton>
        </div>
      </div>
    </article>
  );
}

function ManagerFlag() {
  return (
    <div className="rounded-lg border border-rose-200 bg-rose-50/40 p-3" style={{ borderLeft: '2px solid rgb(244, 63, 94)' }}>
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-[10px] font-medium text-rose-700 shrink-0">
          HV
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-gray-900">Hà Vy</span>
            <span className="text-[10px] text-gray-500">flagged · 2 hours ago</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed mb-2">
            Could you also cover the rollback procedure if the timeout fix doesn't take? Trần Hữu Nam will likely need it.
          </p>
          <div className="flex items-center gap-2">
            <SecondaryButton>Add to the item</SecondaryButton>
            <GhostButton>Dismiss</GhostButton>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FEATURE 04 · KG COMMIT (UC-HO-04)
   ═══════════════════════════════════════════════════════════════════ */
function FeatureKGCommit({ state }) {
  if (state === 'indexing') return <KGIndexing />;
  if (state === 'complete') return <KGComplete />;
  return <KGReview />;
}

function KGIndexing() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <PageHeader
        eyebrow="Step 4 of 4"
        title="Indexing Minh Lê's handover"
        subtitle="Building the knowledge graph. Usually takes 5–10 minutes."
        actor="Hà Vy · Manager"
      />
      <Banner tone="muted" icon={Info}>
        You can leave this page — we'll email you when it's done.
      </Banner>
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        <ProgressStage status="done"    label="Chunking transcript into semantic units" detail="12 sections detected" />
        <ProgressStage status="done"    label="Extracting entities and relationships"   detail="23 entities · 31 relationships" />
        <ProgressStage status="active"  label="Resolving entity conflicts"               detail="7 of 23 · checking against existing graph" />
        <ProgressStage status="pending" label="Writing to knowledge graph" />
        <ProgressStage status="pending" label="Updating skill taxonomy" last />
      </div>
    </div>
  );
}

function KGComplete() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader
        eyebrow="Indexing complete · 7 minutes"
        title="Minh Lê's handover is committed"
        subtitle="All verified knowledge has entered the company's knowledge graph."
        actor="Hà Vy · Manager"
      />

      {/* QA-INT-01 Gap A — Canonical Facts surfaced */}
      <div className="rounded-lg border border-emerald-200 bg-emerald-50/30 p-4 mb-5 flex items-start gap-3">
        <div className="w-9 h-9 rounded-md bg-white border border-emerald-300 flex items-center justify-center shrink-0">
          <Network className="w-4 h-4 text-emerald-700" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-semibold text-gray-900">47 items are now Canonical Facts</h3>
            <span className="text-[10px] text-emerald-700 font-normal">Sự thật gốc</span>
          </div>
          <p className="text-xs text-gray-600">
            Verified content has propagated to Playbook Generator, Copilot, and Skill Engine. Every item carries an immutable audit trail per QA-INT-01.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-violet-200 bg-violet-50/40 p-4 mb-6 flex items-start gap-3">
        <div className="w-9 h-9 rounded-md bg-white border border-violet-200 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-violet-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-[0.18em] text-violet-800 font-medium mb-0.5">Up next</div>
          <h3 className="text-sm font-semibold text-gray-900">Onboarding playbook for Trần Hữu Nam</h3>
          <p className="text-xs text-gray-600 mt-0.5">
            Generating now · ready in about 15 minutes.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3 mb-6">
        <CommitStat value="47" label="Canonical items committed" />
        <CommitStat value="23" label="Entities added or updated" />
        <CommitStat value="8"  label="Skills mapped" />
        <CommitStat value="31" label="Relationships established" />
      </div>
      <FormSection title="Skills mapped · canonical" subtitle="New or refined entries in the company's skill catalog. All propagated to the Skill Engine.">
        <div className="flex flex-wrap gap-2">
          <SkillChip name="Distributed systems architecture" status="strengthened" />
          <SkillChip name="Vendor negotiation" status="new" />
          <SkillChip name="Payment system maintenance" status="strengthened" />
          <SkillChip name="Database performance tuning" status="strengthened" />
          <SkillChip name="Incident response" status="new" />
        </div>
      </FormSection>
    </div>
  );
}

function KGReview() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader
        eyebrow="Indexing paused · 3 items need your call"
        title="Minh Lê's handover — almost there"
        subtitle="Most knowledge committed automatically. A few entities matched existing items in the graph closely but not exactly."
        actor="Hà Vy · Manager"
      />
      <Banner tone="warning" icon={AlertCircle}>
        <strong>44 of 47 items committed automatically.</strong> The 3 below are paused awaiting your call.
      </Banner>
      <FormSection title="Ambiguous entities" subtitle="Pick the right interpretation, or skip if you're unsure.">
        <article className="rounded-lg border border-gray-200 bg-white overflow-hidden mb-3">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/60 flex items-center gap-2">
            <Network className="w-3.5 h-3.5 text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-900">Vendor XYZ</h3>
            <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-yellow-50 border border-yellow-200 text-yellow-800 ml-auto">
              Needs your call
            </span>
          </div>
          <div className="px-4 py-3 space-y-3">
            <p className="text-[12px] text-gray-700 leading-relaxed italic border-l-2 border-gray-200 pl-3">
              "...the contact at Vendor XYZ for escalations was Linh Pham..."
            </p>
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium mb-1.5">Possible match · 91% similarity</div>
              <div className="rounded-md border border-gray-200 bg-white px-3 py-2">
                <div className="text-sm font-medium text-gray-900">Vendor XYZ Inc.</div>
                <div className="text-[11px] text-gray-500 mt-0.5">Active vendor · 14 existing relationships</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-2.5 py-1 rounded-md border border-violet-600 bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium transition-colors">Merge with existing</button>
              <SecondaryButton>Create as new</SecondaryButton>
              <GhostButton>Skip</GhostButton>
            </div>
          </div>
        </article>
      </FormSection>
    </div>
  );
}

function ProgressStage({ status, label, detail, last }) {
  const config = {
    done:    { icon: CheckCircle2, iconCls: 'text-emerald-600',             labelCls: 'text-gray-900' },
    active:  { icon: Loader2,      iconCls: 'text-violet-600 animate-spin', labelCls: 'text-gray-900 font-medium' },
    pending: { icon: Clock,        iconCls: 'text-gray-300',                labelCls: 'text-gray-400' },
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

function CommitStat({ value, label }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-3">
      <div className="text-2xl font-semibold text-gray-900 tracking-tight" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{value}</div>
      <div className="text-[11px] text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

function SkillChip({ name, status }) {
  const cfg = {
    new:          { cls: 'bg-emerald-50 border-emerald-200 text-emerald-800', label: 'New' },
    strengthened: { cls: 'bg-gray-50 border-gray-200 text-gray-700',          label: 'Strengthened' },
  }[status];
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs ${cfg.cls}`}>
      <span>{name}</span>
      <span className="text-[10px] uppercase tracking-wider opacity-75 font-semibold">· {cfg.label}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FEATURE 05 · PLAYBOOK BUILDER & GENERATION (UC-ON-01)
   ═══════════════════════════════════════════════════════════════════ */
function FeaturePlaybookBuilder({ state }) {
  if (state === 'configure') return <BuilderConfigure />;
  return <BuilderGeneration complete={state === 'complete'} />;
}

function BuilderConfigure() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader
        title="Build Trần Hữu Nam's onboarding playbook"
        subtitle="Configure what gets generated. The AI builds from Minh Lê's verified handover."
        actor="Hà Vy · Manager"
      />
      <div className="rounded-md border border-emerald-200 bg-emerald-50/40 px-3 py-2 mb-6 flex items-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
        <p className="text-[12px] text-emerald-900">
          <strong>Knowledge layer ready.</strong> 47 verified items from Minh Lê's handover · 318 entities in the engineering subgraph.
        </p>
      </div>
      <FormSection title="Smart presets" subtitle="Generated from the role profile and the seeded handover context.">
        <div className="grid grid-cols-2 gap-2.5">
          <PresetCard title="Senior Backend Engineer onboarding" rationale="Matches Trần Hữu Nam's role exactly · uses Minh Lê's handover as primary source" sections="6 sections" selected />
          <PresetCard title="Departing-engineer transition" rationale="High overlap with handover topics · adds first-90-day priorities" sections="5 sections" />
          <PresetCard title="Critical-incident response" rationale="Payment Gateway timeout matches Critical pattern" sections="3 sections" />
          <PresetCard title="Vendor relationship handoff" rationale="Vendor XYZ renewal flagged as Manager priority" sections="2 sections" />
        </div>
      </FormSection>
      <FormSection title="Custom prompts" subtitle="Anything not covered by the presets.">
        <div className="rounded-md border border-gray-200 bg-white p-3">
          <textarea
            placeholder="For example: 'Spend extra time on the Payment Gateway timeout — Trần Hữu Nam will likely hit it in week one.'"
            className="w-full min-h-[60px] resize-none outline-none text-sm placeholder:text-gray-400 text-gray-900"
            style={{ fontFamily: 'inherit' }}
          />
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-[10px] text-gray-400 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-violet-500" />
              AI will confirm its interpretation before adding
            </span>
            <SecondaryButton>
              <Plus className="w-3 h-3" />
              Add prompt
            </SecondaryButton>
          </div>
        </div>
      </FormSection>
      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <GhostButton>Cancel</GhostButton>
        <PrimaryButton>
          <Sparkles className="w-3.5 h-3.5" />
          Generate playbook
        </PrimaryButton>
      </div>
    </div>
  );
}

function PresetCard({ title, rationale, sections, selected }) {
  return (
    <button className={`text-left rounded-lg border bg-white p-3 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${
      selected ? 'border-violet-600 ring-1 ring-violet-600/10' : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-start gap-2 mb-1">
        {selected ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 shrink-0 mt-0.5" fill="currentColor" />
        ) : (
          <span className="w-3.5 h-3.5 rounded-full border border-gray-300 shrink-0 mt-0.5" />
        )}
        <h3 className="text-sm font-semibold text-gray-900 leading-tight">{title}</h3>
      </div>
      <p className="text-[11px] text-gray-600 leading-relaxed mb-2 ml-5">{rationale}</p>
      <span className="text-[10px] text-gray-500 ml-5" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{sections}</span>
    </button>
  );
}

function BuilderGeneration({ complete }) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader
        eyebrow={complete ? "Generation complete · 7m 42s" : "Generating · approx. 4 min remaining"}
        title={complete ? "Trần Hữu Nam's playbook is ready" : "Building Trần Hữu Nam's playbook"}
        subtitle={complete ? "6 sections, 38 knowledge items, ready for review." : "The AI is drafting each section from the seeded context."}
        actor="Hà Vy · Manager"
      />
      {complete && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-white border border-emerald-200 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Review before releasing</h3>
              <p className="text-xs text-gray-600">Adjust any section, swap sources, or release as-is.</p>
            </div>
          </div>
          <PrimaryButton>
            Open playbook
            <ArrowRight className="w-3.5 h-3.5" />
          </PrimaryButton>
        </div>
      )}
      <div className="space-y-3">
        <GenerationSection step={1} title="Your role & responsibilities" status="complete" itemCount={6} />
        <GenerationSection step={2} title="Project Atlas — architecture decisions" status="complete" itemCount={8} />
        <GenerationSection step={3} title="Payment Gateway timeout — runbook" severity="critical" status={complete ? 'complete' : 'drafting'} itemCount={complete ? 5 : null} partialText={complete ? null : "When the gateway fails between 2 and 4 AM, the first action is to check the connection pool service status. The most common cause is the nightly batch job holding open"} glowOnComplete={complete} />
        <GenerationSection step={4} title="Vendor XYZ renewal" severity="high" status={complete ? 'complete' : 'pending'} itemCount={complete ? 4 : null} />
        <GenerationSection step={5} title="Customer Portal infra" status={complete ? 'complete' : 'pending'} itemCount={complete ? 3 : null} />
        <GenerationSection step={6} title="First 30 days — recommended priorities" status={complete ? 'complete' : 'pending'} itemCount={complete ? 5 : null} />
      </div>
    </div>
  );
}

function GenerationSection({ step, title, status, itemCount, severity, partialText, glowOnComplete }) {
  const statusCfg = {
    pending:  { label: 'Pending',  cls: 'text-gray-400',          borderCls: 'border-gray-200 bg-gray-50/60' },
    drafting: { label: 'Drafting', cls: 'text-violet-700 font-medium', borderCls: 'border-violet-200 bg-violet-50/30' },
    complete: { label: 'Complete', cls: 'text-emerald-700 font-medium', borderCls: 'border-gray-200 bg-white' },
  }[status];
  const severityColor = { critical: 'rgb(244, 63, 94)', high: 'rgb(234, 179, 8)' };
  return (
    <article
      className={`rounded-lg border ${statusCfg.borderCls} px-4 py-3 transition-all ${glowOnComplete ? 'completion-glow' : ''}`}
      style={severity ? { borderLeft: `2px solid ${severityColor[severity]}` } : undefined}
    >
      <div className="flex items-start justify-between gap-3 mb-1">
        <div className="flex items-baseline gap-2 min-w-0 flex-1">
          <span className="text-[10px] text-gray-400 shrink-0" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>0{step}</span>
          <h3 className="text-sm font-semibold text-gray-900 leading-tight">{title}</h3>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {status === 'drafting' && <Loader2 className="w-3 h-3 text-violet-600 animate-spin" />}
          {status === 'complete' && <CheckCircle2 className="w-3 h-3 text-emerald-600" fill="currentColor" />}
          <span className={`text-[10px] uppercase tracking-wider font-semibold ${statusCfg.cls}`}>{statusCfg.label}</span>
        </div>
      </div>
      {status === 'drafting' && partialText && (
        <div className="mt-2 text-[12px] text-gray-700 leading-relaxed">
          {partialText}
          <span className="inline-block w-0.5 h-3 bg-gray-900 ml-0.5 align-middle animate-pulse" />
        </div>
      )}
      {status === 'pending' && (
        <div className="mt-2 space-y-1.5">
          <div className="h-2 rounded bg-gray-200/70 animate-pulse" style={{ width: '85%' }} />
          <div className="h-2 rounded bg-gray-200/70 animate-pulse" style={{ width: '65%' }} />
        </div>
      )}
      {status === 'complete' && itemCount !== null && (
        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-gray-500">
          <span style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{itemCount} items</span>
          <span className="text-gray-300">·</span>
          <span className="text-emerald-700 inline-flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Verified
          </span>
        </div>
      )}
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FEATURE 06 · PLAYBOOK READING (UC-ON-02)
   ═══════════════════════════════════════════════════════════════════ */
function FeaturePlaybookReading({ state }) {
  if (state === 'dashboard') return <ReadingDashboard />;
  return <ReadingSplitScreen restricted={state === 'restricted'} showLineage={state === 'lineage'} />;
}

function ReadingDashboard() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader
        eyebrow="Day 1 · welcome"
        title="Hello, Trần Hữu Nam"
        subtitle="Your onboarding playbook is ready. Hà Vy and Minh Lê built this for you."
        actor="Trần Hữu Nam · Onboarder"
      />
      <div className="rounded-lg border border-gray-200 bg-white p-5 mb-6 hover:border-gray-300 transition-colors">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-gray-700" strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-gray-900">Senior Backend Engineer · onboarding playbook</h3>
              <p className="text-xs text-gray-500 mt-0.5">6 sections · 38 items · estimated read time 45 minutes</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-[10px] px-1.5 py-0.5 rounded border bg-rose-50 border-rose-200 text-rose-700 uppercase tracking-wider font-semibold inline-flex items-center gap-1">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  1 Critical
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded border bg-yellow-50 border-yellow-200 text-yellow-800 uppercase tracking-wider font-semibold">
                  1 High
                </span>
                <span className="text-[10px] text-gray-500">· built from Minh Lê's verified handover</span>
              </div>
            </div>
          </div>
          <PrimaryButton>
            Open playbook
            <ArrowRight className="w-3.5 h-3.5" />
          </PrimaryButton>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <ContextTile icon={Users}     title="Your team"           items={['Hà Vy · Manager', '4 engineers · Backend', 'Minh Lê · departing']} />
        <ContextTile icon={Briefcase} title="First-week priorities" items={['Set up dev environment', 'Pair with Minh Lê × 2', 'Read Project Atlas docs']} />
        <ContextTile icon={Sparkles}  title="Ask the AI anytime"  items={['Inline copilot on the playbook', "Anchors to what you're reading", 'Cites its sources']} />
      </div>
    </div>
  );
}

function ContextTile({ icon: Icon, title, items }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <Icon className="w-4 h-4 text-gray-500 mb-2.5" strokeWidth={1.75} />
      <h4 className="text-xs uppercase tracking-[0.18em] text-gray-500 font-medium mb-2">{title}</h4>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={i} className="text-[12px] text-gray-700 leading-relaxed flex items-start gap-1.5">
            <span className="text-gray-400 shrink-0 mt-0.5">·</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReadingSplitScreen({ restricted, showLineage }) {
  return (
    <div className="h-full flex flex-col bg-white relative">
      <div className="px-5 py-3 border-b border-gray-200 shrink-0">
        <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">Section 3 of 6</div>
        <h1 className="text-sm font-semibold text-gray-900">Senior Backend Engineer · onboarding playbook</h1>
      </div>
      <div className="px-5 py-2 border-b border-gray-200 bg-gray-50/60 flex items-center gap-2 shrink-0 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        <SectionTab>Your role</SectionTab>
        <SectionTab>Project Atlas</SectionTab>
        <SectionTab active>Payment Gateway timeout</SectionTab>
        <SectionTab>Vendor XYZ renewal</SectionTab>
        <SectionTab>Customer Portal</SectionTab>
        <SectionTab>First 30 days</SectionTab>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div style={{ width: '50%' }} className="border-r border-gray-200 flex flex-col overflow-hidden bg-white relative">
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded border bg-rose-50 border-rose-200 text-rose-700 uppercase tracking-wider font-semibold inline-flex items-center gap-1">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  Critical
                </span>
                <ProvenanceChip source="From:" label="Minh Lê's handover" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Payment Gateway timeout — runbook</h2>
            </div>
            <article className="rounded-lg border border-rose-200 bg-rose-50/20 p-4 mb-3" style={{ borderLeft: '2px solid rgb(244, 63, 94)' }}>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[10px] px-1.5 py-0.5 rounded border bg-rose-50 border-rose-200 text-rose-700 uppercase tracking-wider font-semibold inline-flex items-center gap-1">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  Critical
                </span>
                <span className="text-[10px] text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>BUG-404</span>
                {/* QA-INT-01 Gap A — Canonical Badge (clickable to open lineage drawer) */}
                <CanonicalBadge />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Symptoms</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Visa card payments fail between 2 AM and 4 AM. Customers see a generic error. Logs show
                <button className="text-gray-900 underline decoration-violet-400 decoration-2 underline-offset-2 mx-1 hover:bg-violet-50 transition-colors">
                  connection pool timeout
                </button>
                errors against the
                <button className="text-gray-900 underline decoration-violet-400 decoration-2 underline-offset-2 mx-1 hover:bg-violet-50 transition-colors">
                  Payment Gateway v2
                </button>
                service.
              </p>
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Fix</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Restart the connection pool service between 2 and 4 AM, after the nightly batch finishes.
              </p>
            </article>
            {restricted && (
              <article className="rounded-lg border border-gray-200 bg-gray-50/60 p-4 mb-3 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-700 mb-0.5">Vendor pricing details</h3>
                  <p className="text-[12px] text-gray-500 mb-2">
                    This content needs Level 4 access. Your access is Level 3. The fix above is complete without it.
                  </p>
                  <SecondaryButton>
                    Request access
                    <ArrowUpRight className="w-3 h-3" />
                  </SecondaryButton>
                </div>
              </article>
            )}
          </div>
          <div className="border-t border-gray-200 bg-white shrink-0 px-4 py-2.5 flex items-center gap-2.5">
            <Sparkles className="w-3.5 h-3.5 text-violet-500 shrink-0" />
            <input
              placeholder="Ask anything about your playbook…"
              className="flex-1 text-sm outline-none placeholder:text-gray-400 bg-transparent"
            />
            <button className="w-7 h-7 rounded-md bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30">
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
        <div style={{ width: '50%' }} className="flex flex-col overflow-hidden bg-gray-50/40">
          <div className="px-5 py-2.5 border-b border-gray-200 bg-white shrink-0">
            <h2 className="text-xs uppercase tracking-[0.18em] text-gray-500 font-medium">Spotlight</h2>
            <p className="text-[11px] text-gray-700 mt-0.5">
              Showing entities related to <span className="font-medium text-gray-900">Payment Gateway v2</span>
            </p>
          </div>
          <div className="flex-1 overflow-hidden">
            <SpotlightGraph />
          </div>
        </div>
      </div>

      {/* QA-INT-01 Gap B — Lineage drawer opens over the reading view */}
      {showLineage && <LineageDrawer itemId="BUG-404 · v1" itemTitle="Payment Gateway timeout — runbook" />}
    </div>
  );
}

function ProvenanceChip({ source, label }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] bg-violet-50/60"
      style={{
        borderLeft: '2px solid rgb(124, 58, 237)',
        borderTop: '1px solid rgb(229, 231, 235)',
        borderRight: '1px solid rgb(229, 231, 235)',
        borderBottom: '1px solid rgb(229, 231, 235)'
      }}
    >
      <Sparkles className="w-2.5 h-2.5 text-violet-600" />
      <span className="text-gray-500">{source}</span>
      <span className="text-gray-900">{label}</span>
    </span>
  );
}

function SpotlightGraph() {
  return (
    <svg viewBox="0 0 500 400" className="w-full h-full">
      <g stroke="rgb(229, 231, 235)" strokeWidth="1" fill="none">
        <line x1="250" y1="60" x2="250" y2="170" opacity="0.3" />
        <line x1="250" y1="170" x2="140" y2="260" />
        <line x1="250" y1="170" x2="250" y2="280" />
        <line x1="250" y1="170" x2="370" y2="240" opacity="0.3" />
        <line x1="140" y1="260" x2="250" y2="280" />
        <line x1="380" y1="310" x2="250" y2="280" />
      </g>
      <GraphNode x={250} y={60}  label="Trần Hữu Nam" sublabel="you" dimmed />
      <GraphNode x={250} y={170} label="Minh Lê" sublabel="predecessor" />
      <GraphNode x={140} y={260} label="Project Atlas" sublabel="project" />
      <GraphNode x={370} y={240} label="Customer Portal" sublabel="project" dimmed />
      <GraphNode x={380} y={310} label="Vendor XYZ" sublabel="vendor" />
      <GraphNode x={250} y={280} label="Payment Gateway v2" sublabel="service" highlighted />
    </svg>
  );
}

function GraphNode({ x, y, label, sublabel, highlighted, dimmed }) {
  const opacity = dimmed ? 0.3 : 1;
  if (highlighted) {
    return (
      <g opacity={opacity}>
        <circle cx={x} cy={y} r={28} fill="rgb(254, 226, 226)" stroke="rgb(244, 63, 94)" strokeWidth="2" />
        <circle cx={x} cy={y} r={6} fill="rgb(244, 63, 94)" />
        <text x={x} y={y + 46} fill="rgb(17, 24, 39)" fontSize="11" fontWeight="600" textAnchor="middle">{label}</text>
        <text x={x} y={y + 60} fill="rgb(107, 114, 128)" fontSize="9" textAnchor="middle">{sublabel}</text>
      </g>
    );
  }
  return (
    <g opacity={opacity}>
      <circle cx={x} cy={y} r={18} fill="white" stroke="rgb(209, 213, 219)" strokeWidth="1" />
      <circle cx={x} cy={y} r={4} fill="rgb(156, 163, 175)" />
      <text x={x} y={y + 34} fill="rgb(55, 65, 81)" fontSize="10" fontWeight="500" textAnchor="middle">{label}</text>
      <text x={x} y={y + 46} fill="rgb(156, 163, 175)" fontSize="9" textAnchor="middle">{sublabel}</text>
    </g>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FEATURE 07 · SKILL GAP (UC-ON-03)
   ═══════════════════════════════════════════════════════════════════ */
function FeatureSkillGap({ state }) {
  if (state === 'empty') return <SkillGapEmpty />;
  return <SkillGapHappy disputed={state === 'disputed'} />;
}

function SkillGapEmpty() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader
        eyebrow="Skill profile"
        title="Your growth plan is being built"
        actor="Trần Hữu Nam · Onboarder"
      />
      <div className="rounded-lg border border-gray-200 bg-white p-12 flex flex-col items-center text-center">
        <div className="w-11 h-11 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center mb-4">
          <Target className="w-5 h-5 text-violet-600" strokeWidth={1.5} />
        </div>
        <h2 className="text-sm font-semibold text-gray-900 mb-1">No skill profile yet</h2>
        <p className="text-sm text-gray-500 max-w-sm">
          Your skill gap analysis appears after your first week — once we have enough signal from your work to give you a useful baseline.
        </p>
      </div>
    </div>
  );
}

function SkillGapHappy({ disputed }) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader
        eyebrow="Skill profile · week 2"
        title="Your growth plan"
        subtitle="Comparing your current skills to what the Senior Backend Engineer role typically needs."
        actor="Trần Hữu Nam · Onboarder"
      />
      <div className="grid grid-cols-3 gap-3 mb-6">
        <SummaryStat value="2" label="Critical gaps" tone="critical" />
        <SummaryStat value="3" label="Important gaps" tone="warning" />
        <SummaryStat value="5" label="Strengthening" tone="default" />
      </div>
      <FormSection title="Critical gaps" subtitle="Skills you'll need quickly. Closing these has the highest impact.">
        <div className="space-y-2">
          <SkillRow name="Payment system maintenance" current={1} target={4} reason="Inherited from Minh Lê · used weekly" recommended="Internal training: Payment Gateway v2 · 2 hours" />
          <SkillRow name="Vendor negotiation" current={2} target={4} reason="Vendor XYZ renewal in 6 months" recommended="External course: Procurement essentials · 8 hours" />
        </div>
      </FormSection>
      <FormSection title="Important gaps" subtitle="Useful within your first 90 days.">
        <div className="space-y-2">
          <SkillRow name="Database performance tuning" current={2} target={4} reason="Project Atlas read/write split" recommended="Self-paced: Indexing strategies · 4 hours" disputed={disputed} />
          <SkillRow name="Incident response" current={2} target={3} reason="On-call rotation in month 2" />
          <SkillRow name="Event-driven systems" current={2} target={3} />
        </div>
      </FormSection>
      {disputed && (
        <div className="rounded-md border border-yellow-200 bg-yellow-50/40 p-3 mb-5">
          <div className="flex items-start gap-2 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-yellow-700 shrink-0 mt-0.5" />
            <p className="text-[12px] text-yellow-900 leading-relaxed">
              <strong>You disputed "Database performance tuning · current level 2."</strong> Hà Vy will review your evidence and adjust the assessment if appropriate.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryStat({ value, label, tone }) {
  const cfg = {
    critical: { border: 'border-rose-200',   bg: 'bg-rose-50/30',   valueCls: 'text-rose-700' },
    warning:  { border: 'border-yellow-200', bg: 'bg-yellow-50/30', valueCls: 'text-yellow-800' },
    default:  { border: 'border-gray-200',   bg: 'bg-white',        valueCls: 'text-gray-900' },
  }[tone];
  return (
    <div className={`rounded-lg border ${cfg.border} ${cfg.bg} px-4 py-3`}>
      <div className={`text-2xl font-semibold ${cfg.valueCls} tracking-tight`} style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{value}</div>
      <div className="text-[11px] text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

function SkillRow({ name, current, target, reason, recommended, disputed }) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
        <h3 className="text-sm font-semibold text-gray-900">{name}</h3>
        {disputed ? (
          <span className="text-[10px] px-1.5 py-0.5 rounded border uppercase tracking-wider font-semibold bg-yellow-50 border-yellow-200 text-yellow-800 inline-flex items-center gap-1">
            <AlertTriangle className="w-2.5 h-2.5" />
            Disputed
          </span>
        ) : (
          <span className="text-[10px] text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>
            level {current} → {target}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5 mb-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            className="flex-1 h-1.5 rounded-full"
            style={{
              backgroundColor: i <= current
                ? 'rgb(124, 58, 237)'
                : i <= target
                ? 'rgb(221, 214, 254)'
                : 'rgb(229, 231, 235)'
            }}
          />
        ))}
      </div>
      {reason && <div className="text-[11px] text-gray-500 mb-1.5">{reason}</div>}
      {recommended && (
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
          <BookOpen className="w-3 h-3 text-violet-600 shrink-0" />
          <span className="text-[11px] text-gray-700 flex-1">{recommended}</span>
          {!disputed && (
            <GhostButton>
              Start
              <ArrowRight className="w-3 h-3" />
            </GhostButton>
          )}
        </div>
      )}
      {!disputed && (
        <div className="mt-1.5 flex items-center justify-end">
          <button className="text-[11px] text-gray-400 hover:text-yellow-700 inline-flex items-center gap-1 transition-colors">
            <Flag className="w-3 h-3" />
            Dispute this assessment
          </button>
        </div>
      )}
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FEATURE 08 · FEEDBACK LOOP (UC-HO-06, UC-HO-07)
   ═══════════════════════════════════════════════════════════════════ */
function FeatureFeedbackLoop({ state }) {
  if (state === 'report')   return <FeedbackReport />;
  if (state === 'review')   return <FeedbackReview />;
  return <FeedbackResolved />;
}

function FeedbackReport() {
  return (
    <div className="h-full flex bg-white">
      <div className="flex-1 px-6 py-5 border-r border-gray-200 overflow-y-auto">
        <PageHeader
          eyebrow="Payment Gateway timeout · section 3"
          title="Reading your playbook"
          actor="Trần Hữu Nam · Onboarder"
        />
        <article className="rounded-lg border border-rose-200 bg-rose-50/20 p-4" style={{ borderLeft: '2px solid rgb(244, 63, 94)' }}>
          <p className="text-sm text-gray-700 leading-relaxed">
            Restart the connection pool service between 2 and 4 AM, after the nightly batch finishes. The likely root cause is the batch job holding the pool open past its lease window. <mark className="bg-yellow-100 text-yellow-900">Minh Lê opened a ticket to address the lease behavior but it hadn't shipped before his departure.</mark>
          </p>
        </article>
      </div>
      <div className="w-96 bg-gray-50/60 overflow-y-auto shrink-0">
        <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center gap-2">
          <Flag className="w-3.5 h-3.5 text-yellow-700" />
          <h2 className="text-sm font-semibold text-gray-900">Report this passage</h2>
        </div>
        <div className="px-4 py-4 space-y-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium mb-1.5">What's wrong?</div>
            <div className="space-y-1.5">
              <RadioRow label="Factually incorrect" />
              <RadioRow label="Out of date" selected />
              <RadioRow label="Misattributed source" />
              <RadioRow label="Other" />
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium mb-1.5">Your suggested correction</div>
            <textarea
              defaultValue="Minh Lê's ticket shipped last week — the lease window is now 8 hours, so the workaround above isn't needed for new deployments."
              className="w-full min-h-[80px] px-2.5 py-2 rounded-md border border-gray-200 bg-white text-[12px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/15 transition-colors resize-none"
              style={{ fontFamily: 'inherit' }}
            />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <GhostButton>Cancel</GhostButton>
            <PrimaryButton>
              <Send className="w-3.5 h-3.5" />
              Submit
            </PrimaryButton>
          </div>
          <p className="text-[10px] text-gray-500 leading-relaxed">
            Hà Vy will review and respond. The passage stays in the playbook with a "Disputed" marker until then.
          </p>
        </div>
      </div>
    </div>
  );
}

function RadioRow({ label, selected }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer px-2 py-1.5 rounded-md hover:bg-white transition-colors">
      <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${selected ? 'border-violet-600' : 'border-gray-300'}`}>
        {selected && <span className="w-1.5 h-1.5 rounded-full bg-violet-600" />}
      </span>
      <span className="text-sm text-gray-900">{label}</span>
    </label>
  );
}

function FeedbackReview() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Breadcrumb path={['Corrections queue', 'BUG-404 · payment gateway']} />
      <PageHeader
        title="Review correction request"
        subtitle="Trần Hữu Nam reported that this passage is out of date."
        actor="Hà Vy · Manager"
      />
      <div className="rounded-md border border-gray-200 bg-gray-50/60 px-3 py-2 mb-5 flex items-center justify-between text-[11px] text-gray-600">
        <span>Reported 4 hours ago by <strong className="text-gray-900">Trần Hữu Nam</strong> · category: Out of date</span>
        <span style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>FB-2026-05-22-7c4f</span>
      </div>
      <FormSection title="What changes" subtitle="Side-by-side diff.">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md border border-rose-200 bg-rose-50/30 p-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-rose-700 font-medium mb-1.5">Current</div>
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className="line-through opacity-70">Minh Lê opened a ticket to address the lease behavior but it hadn't shipped before his departure.</span>
            </p>
          </div>
          <div className="rounded-md border border-emerald-200 bg-emerald-50/30 p-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-emerald-700 font-medium mb-1.5">Proposed</div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Minh Lê's ticket shipped last week — the lease window is now 8 hours, so the workaround above isn't needed for new deployments.
            </p>
          </div>
        </div>
      </FormSection>
      <FormSection title="Downstream impact" subtitle="If you accept, the system will:">
        <ul className="space-y-1.5 text-[12px] text-gray-700">
          <li className="flex items-start gap-2">
            <ArrowDownRight className="w-3 h-3 text-gray-400 shrink-0 mt-1" />
            <span>Update <strong>3 playbooks</strong> containing this passage</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowDownRight className="w-3 h-3 text-gray-400 shrink-0 mt-1" />
            <span>Notify <strong>12 onboarders</strong> currently reading affected sections</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowDownRight className="w-3 h-3 text-gray-400 shrink-0 mt-1" />
            <span>Update the underlying knowledge graph node (BUG-404, v3 → v4)</span>
          </li>
        </ul>
      </FormSection>
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <button className="text-[11px] text-gray-500 hover:text-rose-700 transition-colors">
          Reject correction
        </button>
        <div className="flex items-center gap-2">
          <SecondaryButton>Edit before accepting</SecondaryButton>
          <PrimaryButton>
            <CheckCircle2 className="w-3.5 h-3.5" />
            Accept correction
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function FeedbackResolved() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <PageHeader
        eyebrow="Correction applied · 2 minutes ago"
        title="BUG-404 — knowledge graph updated"
        subtitle="Trần Hữu Nam's correction has been accepted and propagated."
        actor="Hà Vy · Manager"
      />
      <div className="rounded-lg border border-emerald-200 bg-emerald-50/30 p-4 mb-5 flex items-start gap-3">
        <div className="w-9 h-9 rounded-md bg-white border border-emerald-200 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" fill="currentColor" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900">Active learning loop closed</h3>
          <p className="text-xs text-gray-600 mt-0.5">3 playbooks updated · 12 onboarders notified · KG node v3 → v4</p>
        </div>
      </div>
      <FormSection title="What the playbook now says" subtitle="Visible to all onboarders. Promoted to Canonical (Sự thật gốc) after correction was accepted.">
        <article className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {/* QA-INT-01 Gap A — Canonical promotion is explicit in the Resolved state */}
            <CanonicalBadge />
            <span className="text-[10px] text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>BUG-404 · v4</span>
            <span className="text-[10px] text-gray-500">· corrected by Trần Hữu Nam · approved by Hà Vy</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            Minh Lê's ticket shipped last week — the lease window is now 8 hours, so the workaround above isn't needed for new deployments.
          </p>
        </article>
      </FormSection>
      <FormSection title="Audit trail" subtitle="Permanent record of the correction.">
        <div className="space-y-2">
          <AuditTile timestamp="2026-05-22 16:42:11" actor="System" action="Active Learning · skill graph re-weighted · 3 downstream playbooks updated" />
          <AuditTile timestamp="2026-05-22 16:42:08" actor="Hà Vy"  action="Accepted correction · BUG-404 v3 → v4" />
          <AuditTile timestamp="2026-05-22 12:18:33" actor="Trần Hữu Nam" action="Reported passage as out of date · suggested correction" />
        </div>
      </FormSection>
    </div>
  );
}

function AuditTile({ timestamp, actor, action }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2" style={{ borderLeft: '2px solid rgb(229, 231, 235)' }}>
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[10px] text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{timestamp}</span>
        <span className="text-[10px] text-gray-700 font-medium">{actor}</span>
      </div>
      <div className="text-xs text-gray-900">{action}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   QA-INT-01 PRIMITIVES (Gap A — Canonical Fact, Gap B — Lineage Drawer)
   ═══════════════════════════════════════════════════════════════════ */

function CanonicalBadge({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-[10px] px-1.5 py-0.5 rounded border bg-emerald-50 border-emerald-300 text-emerald-800 font-medium inline-flex items-center gap-1 hover:bg-emerald-100 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20"
      title="Canonical · Sự thật gốc · click for lineage"
    >
      <Network className="w-2.5 h-2.5" strokeWidth={2} />
      <span className="uppercase tracking-wider font-semibold">Canonical</span>
      <span className="text-emerald-600 normal-case">· Sự thật gốc</span>
      <History className="w-2.5 h-2.5 opacity-50 ml-0.5" />
    </button>
  );
}

function LineageDrawer({ itemId, itemTitle }) {
  return (
    <div className="absolute inset-0 z-30 flex justify-end" style={{ backdropFilter: 'blur(2px)', background: 'rgba(17, 24, 39, 0.25)' }}>
      <div className="w-[400px] bg-white border-l border-gray-200 h-full overflow-y-auto flex flex-col shadow-xl">
        <div className="px-4 py-3 border-b border-gray-200 sticky top-0 bg-white flex items-start justify-between gap-3 shrink-0">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium flex items-center gap-1.5">
              <Network className="w-2.5 h-2.5 text-emerald-700" />
              Lineage · Sự thật gốc
            </div>
            <h2 className="text-sm font-semibold text-gray-900 mt-0.5">{itemTitle}</h2>
            <p className="text-[10px] text-gray-500 mt-0.5" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{itemId}</p>
          </div>
          <button className="w-7 h-7 rounded-md hover:bg-gray-100 flex items-center justify-center transition-colors shrink-0">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="px-4 py-4 space-y-2 flex-1 overflow-y-auto">
          <LineageEvent
            type="created"
            timestamp="2026-05-22 14:32"
            actor="Minh Lê"
            action="Captured in voice interview"
            detail="UC-HO-02 · topic 3 · timestamp 05:02"
          />
          <LineageEvent
            type="verified"
            timestamp="2026-05-22 16:18"
            actor="Minh Lê"
            action="Signed off after review"
            detail="UC-HO-03 · 3 edits applied · confidence raised to 100%"
          />
          <LineageEvent
            type="committed"
            timestamp="2026-05-22 16:42"
            actor="System"
            action="Atomic write to knowledge graph"
            detail="UC-HO-04 · BUG-404 v1 · 23 entities linked"
          />
          <LineageEvent
            type="propagated"
            timestamp="2026-05-22 16:42"
            actor="System"
            action="Propagated to downstream modules"
            detail="Playbook Generator · Copilot · Skill Engine"
            highlight
          />
        </div>

        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50/40 shrink-0">
          <p className="text-[10px] text-gray-500 leading-relaxed">
            <strong>QA-INT-01 §2.3 ·</strong> Every update maintains an immutable audit trail tracking who approved the change, what was corrected, and the original version.
          </p>
        </div>
      </div>
    </div>
  );
}

function LineageEvent({ type, timestamp, actor, action, detail, highlight }) {
  const cfg = {
    created:    { icon: Plus,         iconCls: 'bg-gray-100 text-gray-600' },
    verified:   { icon: CheckCircle2, iconCls: 'bg-emerald-100 text-emerald-700' },
    committed:  { icon: Database,     iconCls: 'bg-violet-100 text-violet-700' },
    propagated: { icon: Network,      iconCls: 'bg-emerald-100 text-emerald-700' },
    corrected:  { icon: Pencil,       iconCls: 'bg-yellow-100 text-yellow-800' },
  }[type];
  const Icon = cfg.icon;
  return (
    <div className={`rounded-md border px-3 py-2.5 ${highlight ? 'bg-emerald-50/40 border-emerald-200' : 'bg-white border-gray-200'}`}>
      <div className="flex items-start gap-2.5">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${cfg.iconCls}`}>
          <Icon className="w-3 h-3" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5 gap-2">
            <span className="text-[10px] text-gray-500 truncate" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{timestamp}</span>
            <span className="text-[10px] text-gray-700 font-medium shrink-0">{actor}</span>
          </div>
          <div className="text-xs text-gray-900 font-medium leading-tight">{action}</div>
          <div className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{detail}</div>
        </div>
      </div>
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
