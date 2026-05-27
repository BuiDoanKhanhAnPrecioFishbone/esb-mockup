'use client';

import React, { useState } from 'react';
import {
  AlertTriangle, Lock, CheckCircle2, Sparkles, Flag,
  ChevronDown, ChevronRight, ArrowUpRight, Clock,
  MessageCircle, Network, Eye, Info
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════
   ART-EEP — Sprint 0 Shared Component Library
   
   Seven reusable components consumed across all 20 screens in S1–S5.
   Each component is shown in its full variant set with the UC steps
   it serves listed below the showcase.
   
   Visual system: Light mode · Gray-50 canvas · 1px hairlines ·
   Two accents (amber for signal, rose for critical) · Emerald reserved
   for verified content.
   ═══════════════════════════════════════════════════════════════════ */

export default function S0ComponentLibrary() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-16" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-10">
        <TokensSection />
        <Section
          number="01"
          title="Provenance Chip"
          purpose="Shows the source of AI-generated content. Distinctive amber left-edge stripe makes it visually unmistakable across all surfaces."
          usedIn={['UC-HO-04 step 10', 'UC-ON-01 step 13', 'UC-ON-02 step 4', 'UC-HO-06 step 2']}
        >
          <ProvenanceChipShowcase />
        </Section>

        <Section
          number="02"
          title="Severity Badge"
          purpose="Tags an item with one of four severity levels. Critical uses rose; High uses amber; Medium and Low use neutral grays. Severity drives auto-expand behavior in the Section Card."
          usedIn={['UC-HO-03 step 2', 'UC-ON-01 step 9', 'UC-ON-02 step 4', 'UC-ON-03 step 4']}
        >
          <SeverityBadgeShowcase />
        </Section>

        <Section
          number="03"
          title="Confidence Badge"
          purpose="Communicates the AI's confidence in a piece of content. Verified content earns emerald (the only non-amber/rose accent in the system). Low-confidence content surfaces sparse-data warnings without alarm."
          usedIn={['UC-HO-03 step 6', 'UC-HO-04 AC.1', 'UC-ON-01 step 14', 'UC-ON-02 step 4', 'UC-HO-07 step 9']}
        >
          <ConfidenceBadgeShowcase />
        </Section>

        <Section
          number="04"
          title="Status Badge"
          purpose="Tracks the human review state of AI content through the correction lifecycle: Disputed (during review), Resolved (after Manager decision), Flagged (user-initiated)."
          usedIn={['UC-HO-06 step 5', 'UC-ON-02 AC.1', 'UC-HO-07 step 9']}
        >
          <StatusBadgeShowcase />
        </Section>

        <Section
          number="05"
          title="Mask Card"
          purpose="The standard treatment for RBAC-restricted content. Shows what kind of content is hidden without revealing its substance, and offers a clear next step."
          usedIn={['UC-HO-01 step 10', 'UC-ON-02 EX.4', 'UC-ON-01 step 14']}
        >
          <MaskCardShowcase />
        </Section>

        <Section
          number="06"
          title="Section Card"
          purpose="The most-reused complex component. Auto-expands for Critical severity (per BR-05); collapses by default for High/Medium/Low. Provenance chip optional. Always carries a flag affordance for AI-generated content."
          usedIn={['UC-HO-03 step 2', 'UC-ON-01 step 13', 'UC-ON-02 step 4']}
        >
          <SectionCardShowcase />
        </Section>

        <Section
          number="07"
          title="Audit Log Tile"
          purpose="A timestamped record of system actions, used in admin and debug surfaces across the system. Mono-typed for scannability; severity-tinted left edge mirrors the Section Card pattern."
          usedIn={['UC-HO-04 PC.6', 'UC-HO-07 PC.3', 'UC-ON-01 step 14']}
        >
          <AuditLogTileShowcase />
        </Section>
      </main>
      <Footer />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   HEADER
   ────────────────────────────────────────────────────────────────── */
function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
          <span className="text-gray-900 font-semibold tracking-[0.18em] text-xs" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>ART-EEP</span>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-gray-500 text-xs">Sprint 0 — Shared Component Library</span>
        </div>
        <span className="text-[11px] text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>v0.1</span>
      </div>
    </header>
  );
}

/* ──────────────────────────────────────────────────────────────────
   DESIGN TOKENS PREVIEW
   ────────────────────────────────────────────────────────────────── */
function TokensSection() {
  const swatches = [
    { name: 'Canvas',      hex: '#f9fafb', cls: 'bg-gray-50',    border: true },
    { name: 'Surface',     hex: '#ffffff', cls: 'bg-white',      border: true },
    { name: 'Hairline',    hex: '#e5e7eb', cls: 'bg-gray-200',   border: false },
    { name: 'Text muted',  hex: '#6b7280', cls: 'bg-gray-500',   border: false },
    { name: 'Text body',   hex: '#111827', cls: 'bg-gray-900',   border: false },
    { name: 'Amber',       hex: '#f59e0b', cls: 'bg-amber-500',  border: false },
    { name: 'Rose',        hex: '#f43f5e', cls: 'bg-rose-500',   border: false },
    { name: 'Emerald',     hex: '#10b981', cls: 'bg-emerald-500',border: false },
  ];

  return (
    <section>
      <h2 className="text-xs uppercase tracking-[0.2em] text-gray-500 font-medium mb-3">Design tokens</h2>
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="grid grid-cols-4 gap-3 mb-5">
          {swatches.map(s => (
            <div key={s.name} className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-md ${s.cls} ${s.border ? 'border border-gray-200' : ''}`} />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-900 font-medium truncate">{s.name}</div>
                <div className="text-[10px] text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{s.hex}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
          <TokenSample label="Display" sample="Aa" desc="22/28px · semibold" style={{ fontFamily: 'ui-sans-serif, system-ui', fontWeight: 600 }} />
          <TokenSample label="Body" sample="Aa" desc="14/22px · regular" style={{ fontFamily: 'ui-sans-serif, system-ui' }} />
          <TokenSample label="Mono" sample="Aa" desc="11/16px · ID + metadata" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }} />
        </div>
      </div>
    </section>
  );
}

function TokenSample({ label, sample, desc, style }) {
  return (
    <div className="rounded-md border border-gray-200 bg-gray-50/60 px-3 py-2.5">
      <div className="flex items-baseline gap-3">
        <span className="text-2xl text-gray-900" style={style}>{sample}</span>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium">{label}</div>
          <div className="text-[11px] text-gray-600">{desc}</div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   SECTION WRAPPER
   ────────────────────────────────────────────────────────────────── */
function Section({ number, title, purpose, usedIn, children }) {
  return (
    <section>
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] text-gray-400 font-medium" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{number}</span>
          <h2 className="text-base font-semibold text-gray-900 tracking-tight">{title}</h2>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{purpose}</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-5 space-y-5">
        {children}
      </div>

      <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-500">
        <Info className="w-3 h-3 text-gray-400" />
        <span>Used in:</span>
        {usedIn.map((u, i) => (
          <span key={u} style={{ fontFamily: 'ui-monospace, Menlo, monospace' }} className="text-gray-600">
            {u}{i < usedIn.length - 1 ? ' ·' : ''}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────
   01 · PROVENANCE CHIP
   ────────────────────────────────────────────────────────────────── */
function ProvenanceChip({ source, label }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] bg-amber-50/60"
      style={{
        borderLeft: '2px solid rgb(245, 158, 11)',
        borderTop: '1px solid rgb(229, 231, 235)',
        borderRight: '1px solid rgb(229, 231, 235)',
        borderBottom: '1px solid rgb(229, 231, 235)'
      }}
    >
      <Sparkles className="w-3 h-3 text-amber-600" />
      <span className="text-gray-500">{source}</span>
      <span className="text-gray-900">{label}</span>
    </span>
  );
}

function ProvenanceChipShowcase() {
  return (
    <div className="space-y-4">
      <Variant label="From a Smart Preset">
        <ProvenanceChip source="Generated from preset:" label="Tech Debt Inventory" />
      </Variant>
      <Variant label="From a Manager's custom prompt">
        <ProvenanceChip source="From your custom prompt:" label="Difficult clients" />
      </Variant>
      <Variant label="From a verified handover session">
        <ProvenanceChip source="From verified handover:" label="@minhle · session 2026-04" />
      </Variant>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   02 · SEVERITY BADGE
   ────────────────────────────────────────────────────────────────── */
function SeverityBadge({ level }) {
  const config = {
    critical: { label: 'Critical', cls: 'bg-rose-50 border-rose-200 text-rose-700',     icon: AlertTriangle },
    high:     { label: 'High',     cls: 'bg-amber-50 border-amber-200 text-amber-700', icon: null },
    medium:   { label: 'Medium',   cls: 'bg-gray-100 border-gray-200 text-gray-600',   icon: null },
    low:      { label: 'Low',      cls: 'bg-gray-50 border-gray-200 text-gray-500',    icon: null },
  };
  const c = config[level];
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] uppercase tracking-wider font-semibold ${c.cls}`}>
      {Icon && <Icon className="w-2.5 h-2.5" />}
      {c.label}
    </span>
  );
}

function SeverityBadgeShowcase() {
  return (
    <div className="space-y-4">
      <Variant label="The four severity levels">
        <div className="flex items-center gap-2 flex-wrap">
          <SeverityBadge level="critical" />
          <SeverityBadge level="high" />
          <SeverityBadge level="medium" />
          <SeverityBadge level="low" />
        </div>
      </Variant>
      <Variant label="In context — item header">
        <div className="flex items-center gap-2 flex-wrap">
          <SeverityBadge level="critical" />
          <span className="text-[10px] text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>BUG-404</span>
          <span className="text-gray-300">·</span>
          <span className="text-[10px] text-gray-500">reported 14 days ago</span>
        </div>
      </Variant>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   03 · CONFIDENCE BADGE
   ────────────────────────────────────────────────────────────────── */
function ConfidenceBadge({ state }) {
  const config = {
    verified: { label: 'Verified',          cls: 'bg-emerald-50 border-emerald-200 text-emerald-700', icon: CheckCircle2 },
    pending:  { label: 'Pending review',    cls: 'bg-gray-50 border-gray-200 text-gray-600',          icon: Clock },
    low:      { label: 'Low confidence',    cls: 'bg-amber-50 border-amber-200 text-amber-700',       icon: AlertTriangle },
  };
  const c = config[state];
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-medium ${c.cls}`}>
      <Icon className="w-2.5 h-2.5" />
      {c.label}
    </span>
  );
}

function ConfidenceBadgeShowcase() {
  return (
    <div className="space-y-4">
      <Variant label="The three confidence states">
        <div className="flex items-center gap-2 flex-wrap">
          <ConfidenceBadge state="verified" />
          <ConfidenceBadge state="pending" />
          <ConfidenceBadge state="low" />
        </div>
      </Variant>
      <Variant label="Verified content — full context">
        <div className="px-3 py-2 rounded-md border border-emerald-200 bg-emerald-50/40 max-w-md">
          <div className="text-[9px] uppercase tracking-wider text-emerald-700/80 mb-1">Confidence</div>
          <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3 h-3" />
            Verified · handover session 2026-Q1
          </div>
        </div>
      </Variant>
      <Variant label="Low confidence — content with warning banner">
        <div className="rounded-md border border-amber-200 bg-amber-50/40 px-3 py-2 max-w-md">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-[11px]">
              <span className="text-amber-800 font-medium">Limited source data.</span>
              <span className="text-amber-700"> This section was generated from less than 10 minutes of interview content. Treat as a starting point, not a final reference.</span>
            </div>
          </div>
        </div>
      </Variant>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   04 · STATUS BADGE
   ────────────────────────────────────────────────────────────────── */
function StatusBadge({ state }) {
  const config = {
    disputed: { label: 'Under review', cls: 'bg-gray-100 border-gray-300 text-gray-700', icon: AlertTriangle },
    resolved: { label: 'Resolved',     cls: 'bg-emerald-50 border-emerald-200 text-emerald-700', icon: CheckCircle2 },
    flagged:  { label: 'Flagged',      cls: 'bg-amber-50 border-amber-200 text-amber-700', icon: Flag },
  };
  const c = config[state];
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-medium ${c.cls}`}>
      <Icon className="w-2.5 h-2.5" />
      {c.label}
    </span>
  );
}

function StatusBadgeShowcase() {
  return (
    <div className="space-y-4">
      <Variant label="The correction lifecycle">
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge state="flagged" />
          <span className="text-gray-300 text-xs">→</span>
          <StatusBadge state="disputed" />
          <span className="text-gray-300 text-xs">→</span>
          <StatusBadge state="resolved" />
        </div>
      </Variant>
      <Variant label="On a flagged passage in context">
        <div className="px-3 py-2 rounded-md border border-gray-200 bg-white max-w-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-700">Payment Gateway connection timeout details</span>
            <StatusBadge state="disputed" />
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Trần Hữu Nam flagged this 2 hours ago. Awaiting Hà Vy's review.</p>
        </div>
      </Variant>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   05 · MASK CARD
   ────────────────────────────────────────────────────────────────── */
function MaskCard() {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-6 text-center max-w-md">
      <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-white border border-gray-200 flex items-center justify-center">
        <Lock className="w-5 h-5 text-gray-400" />
      </div>
      <h3 className="text-sm font-semibold text-gray-700 mb-1">Restricted content</h3>
      <p className="text-xs text-gray-500 mb-1">This section needs a higher access level than your current role provides.</p>
      <p className="text-[11px] text-gray-400 mb-5" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>
        Required: Level 4 · Your role: Level 2
      </p>
      <button className="px-3 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 text-xs font-medium inline-flex items-center gap-1.5 transition-colors">
        Request access
        <ArrowUpRight className="w-3 h-3" />
      </button>
    </div>
  );
}

function MaskCardShowcase() {
  return (
    <div className="space-y-4">
      <Variant label="Standard restricted state — full card">
        <MaskCard />
      </Variant>
      <Variant label="Inline blurred preview — used below the mask card on the same screen">
        <div className="space-y-1.5 max-w-md">
          <div className="h-3 rounded bg-gray-200/70" style={{ filter: 'blur(2px)' }} />
          <div className="h-3 rounded bg-gray-200/70 w-4/5" style={{ filter: 'blur(2px)' }} />
          <div className="h-3 rounded bg-gray-200/70 w-2/3" style={{ filter: 'blur(2px)' }} />
        </div>
      </Variant>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   06 · SECTION CARD
   ────────────────────────────────────────────────────────────────── */
function SectionCard({ severity, id, title, body, autoExpand = false, hasFlag = true }) {
  const [expanded, setExpanded] = useState(autoExpand);
  const borderColor = {
    critical: 'rgb(244, 63, 94)',
    high: 'rgb(245, 158, 11)',
    medium: 'rgb(156, 163, 175)',
    low: 'rgb(209, 213, 219)'
  }[severity];

  return (
    <article
      className="rounded-lg border border-gray-200 bg-white overflow-hidden max-w-lg"
      style={{ borderLeft: `2px solid ${borderColor}` }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-start justify-between gap-3 hover:bg-gray-50/50 transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <SeverityBadge level={severity} />
            <span className="text-[10px] text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{id}</span>
          </div>
          <h3 className="text-sm text-gray-900 font-semibold">{title}</h3>
        </div>
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-3">
          <p className="text-sm text-gray-700 leading-relaxed">{body}</p>
          {hasFlag && (
            <div className="flex items-center justify-end">
              <button className="flex items-center gap-1 px-2 py-0.5 rounded border border-gray-200 bg-white hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 text-[11px] text-gray-500 transition-colors">
                <Flag className="w-3 h-3" />
                Report inaccurate
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function SectionCardShowcase() {
  return (
    <div className="space-y-4">
      <Variant label="Critical severity — auto-expanded per BR-05">
        <SectionCard
          severity="critical"
          id="BUG-404"
          title="Payment Gateway timeout"
          body="Customers can't pay with Visa cards between 2am and 4am. The pattern has held for three consecutive nights. Likely cause: connection pool timeout during the nightly reset window."
          autoExpand={true}
        />
      </Variant>
      <Variant label="High severity — collapsed by default">
        <SectionCard
          severity="high"
          id="ARCH-DEBT-12"
          title="Architectural debt: User microservice"
          body="High coupling with the Order service. Splitting it out is in the Q2 roadmap."
        />
      </Variant>
      <Variant label="Medium severity — collapsed, no flag affordance">
        <SectionCard
          severity="medium"
          id="TEST-COV-08"
          title="Test coverage below threshold in Notification module"
          body="Current coverage: 42%. Internal target: 70%."
          hasFlag={false}
        />
      </Variant>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   07 · AUDIT LOG TILE
   ────────────────────────────────────────────────────────────────── */
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

function AuditLogTileShowcase() {
  return (
    <div className="space-y-4">
      <Variant label="Standard log entry">
        <AuditLogTile
          timestamp="2026-05-22 14:32:07"
          actor="Hà Vy"
          action="Approved correction on BUG-404 (Payment Gateway timeout)"
          details="diff archived · KG node updated v_prev=3, v_new=4"
        />
      </Variant>
      <Variant label="High-severity entry — Manager override">
        <AuditLogTile
          severity="high"
          timestamp="2026-05-22 11:15:42"
          actor="Hà Vy"
          action="Override applied: review deadline extended by 2 days"
          details="reason: Minh Lê unavailable due to medical leave"
        />
      </Variant>
      <Variant label="Critical entry — RBAC scope failure">
        <AuditLogTile
          severity="critical"
          timestamp="2026-05-22 09:04:11"
          actor="System"
          action="Session creation blocked: RBAC scope could not be resolved"
          details="UC-HO-01.EX.5 · directory query failed for offboarder_id=ML-2026-04"
        />
      </Variant>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   VARIANT WRAPPER + FOOTER
   ────────────────────────────────────────────────────────────────── */
function Variant({ label, children }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium mb-2">{label}</div>
      {children}
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-16">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between text-[11px] text-gray-500">
        <div className="flex items-center gap-3">
          <span>7 components · ready for S1 consumption</span>
        </div>
        <div className="flex items-center gap-3">
          <span style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>S0 / S6</span>
        </div>
      </div>
    </footer>
  );
}
