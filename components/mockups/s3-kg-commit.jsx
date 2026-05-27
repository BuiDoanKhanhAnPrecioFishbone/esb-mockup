'use client';

import React, { useState } from 'react';
import {
  CheckCircle2, Clock, ArrowRight, AlertCircle, AlertTriangle,
  Loader2, Sparkles, X, Info, Network, Database, GitBranch,
  ChevronRight, Eye, RefreshCw, Mail, FileText, Hash,
  Zap, ShieldCheck, Users, ExternalLink, Wrench, Layers,
  PackageCheck, Tag
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════
   ART-EEP — Sprint 3: Knowledge Graph Commit
   
   Screen delivered:
     11. Manager Completion Report (UC-HO-04 steps 6–10)
   
   Single user-facing surface for an otherwise-automated sprint. Four
   states reflect the lifecycle from indexing → completion, plus the
   two edge cases (low-confidence review per AC.1, partial commit).
   Persona: Hà Vy receives this after Minh Lê signs off in S2.
   ═══════════════════════════════════════════════════════════════════ */

const STATES = [
  ['indexing',  'Indexing in progress'],
  ['completed', 'Completed'],
  ['low-conf',  'Needs your review'],
  ['partial',   'Partial commit'],
];

export default function S3KGCommit() {
  const [stateKey, setStateKey] = useState('indexing');

  return (
    <div className="h-screen w-full bg-gray-50 text-gray-900 flex flex-col overflow-hidden" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>

      {/* Brand bar */}
      <header className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
          <span className="text-gray-900 font-semibold tracking-[0.18em] text-xs" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>ART-EEP</span>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-gray-500 text-xs">Sprint 3 · Knowledge Graph Commit</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-gray-200 bg-white text-[11px]">
            <span className="text-gray-400 font-medium" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>11</span>
            <span className="text-gray-900">Completion Report</span>
          </div>
          <div className="text-[11px] text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>UC-HO-04</div>
        </div>
      </header>

      {/* State selector */}
      <div className="bg-white border-b border-gray-200 px-5 py-2 flex items-center gap-2 shrink-0">
        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium shrink-0">State</span>
        <span className="w-px h-3 bg-gray-200" />
        <div className="flex items-center gap-1">
          {STATES.map(([key, label]) => {
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

      <main className="flex-1 overflow-y-auto">
        <Screen11CompletionReport state={stateKey} />
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 11 — MANAGER COMPLETION REPORT
   UC-HO-04 · The only user-facing surface for the KG commit pipeline
   ═══════════════════════════════════════════════════════════════════ */
function Screen11CompletionReport({ state }) {
  if (state === 'indexing') return <IndexingView />;
  if (state === 'completed') return <CompletedView />;
  if (state === 'low-conf') return <LowConfidenceView />;
  if (state === 'partial') return <PartialCommitView />;
  return null;
}

/* ─────────────────────────────────────────────────────────────────
   STATE A — INDEXING IN PROGRESS
   The Offboarder just signed off. The pipeline is running.
   ───────────────────────────────────────────────────────────────── */
function IndexingView() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Breadcrumb path={['Dashboard', "Minh Lê's session", 'Commit to knowledge graph']} />
      <PageHeader
        eyebrow="Step 4 of 4"
        title="Indexing Minh Lê's handover"
        subtitle="Building the knowledge graph from the verified transcript. This usually takes 5–10 minutes."
        actor="Hà Vy · Manager"
      />

      <Banner tone="muted" icon={Info}>
        You can leave this page — we'll email you when it's done. The onboarding playbook for Trần Hữu Nam will be queued automatically once indexing completes.
      </Banner>

      {/* Progress stages */}
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden mb-6">
        <ProgressStage status="done"   label="Chunking transcript into semantic units" detail="12 sections detected" />
        <ProgressStage status="done"   label="Extracting entities and relationships"   detail="23 entities · 31 relationships" />
        <ProgressStage status="active" label="Resolving entity conflicts"               detail="7 of 23 · checking against existing graph" />
        <ProgressStage status="pending" label="Writing to knowledge graph" />
        <ProgressStage status="pending" label="Updating skill taxonomy" last />
      </div>

      {/* What happens after */}
      <div className="rounded-md border border-gray-200 bg-gray-50/60 p-4">
        <h3 className="text-xs uppercase tracking-[0.18em] text-gray-500 font-medium mb-2">What happens after this</h3>
        <ul className="space-y-1.5">
          <ListItem>The committed knowledge becomes searchable by anyone on your team with the right access level.</ListItem>
          <ListItem>An onboarding playbook is generated automatically for Trần Hữu Nam, scheduled for Day 1.</ListItem>
          <ListItem>The commit appears in the audit log with a permanent reference for compliance review.</ListItem>
        </ul>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   STATE B — COMPLETED (HAPPY PATH)
   Manager sees a clean summary of what entered the graph.
   ───────────────────────────────────────────────────────────────── */
function CompletedView() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Breadcrumb path={['Dashboard', "Minh Lê's session", 'Commit complete']} />
      <PageHeader
        eyebrow="Indexing complete · 7 minutes"
        title="Minh Lê's handover is committed"
        subtitle="All verified knowledge has entered the company's knowledge graph. The onboarding playbook for Trần Hữu Nam is being generated."
        actor="Hà Vy · Manager"
      />

      {/* Up next — most important for the Manager right now */}
      <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-4 mb-6 flex items-start gap-3">
        <div className="w-9 h-9 rounded-md bg-white border border-amber-200 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-[0.18em] text-amber-800 font-medium">Up next</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900">
            Onboarding playbook for Trần Hữu Nam
          </h3>
          <p className="text-xs text-gray-600 mt-0.5">
            Generating now · ready in about 15 minutes. You'll get an email when it's available to review.
          </p>
          <button className="mt-2 px-2.5 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium inline-flex items-center gap-1.5 transition-colors">
            Preview the builder
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Commit stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <CommitStat icon={Layers}      value="47" label="Knowledge items committed" />
        <CommitStat icon={Network}     value="23" label="Entities added or updated" />
        <CommitStat icon={Tag}         value="8"  label="Skills mapped" />
        <CommitStat icon={GitBranch}   value="31" label="Relationships established" />
      </div>

      {/* What was committed */}
      <FormSection title="What was committed" subtitle="The top topics that entered the graph from Minh Lê's interview.">
        <div className="space-y-2">
          <CommittedTopicRow
            title="Vendor XYZ renewal terms"
            detail="SLA terms · penalty escalation · termination notice · pricing trigger"
            count="4 items"
            priority="high"
          />
          <CommittedTopicRow
            title="Payment Gateway timeout fix"
            detail="Runbook · symptoms · resolution steps · rollback procedure"
            count="4 items"
            priority="critical"
          />
          <CommittedTopicRow
            title="Project Atlas architecture decisions"
            detail="Read/write split rationale · event sourcing trade-offs · scaling patterns"
            count="6 items"
          />
          <CommittedTopicRow
            title="Customer Portal infra configuration"
            detail="Environment variables · deployment quirks · escalation contacts"
            count="3 items"
          />
        </div>
      </FormSection>

      {/* Skill taxonomy */}
      <FormSection title="Skills mapped" subtitle="New or refined entries in the company's skill catalog.">
        <div className="flex flex-wrap gap-2">
          <SkillChip name="Distributed systems architecture" status="strengthened" />
          <SkillChip name="Vendor negotiation" status="new" />
          <SkillChip name="Payment system maintenance" status="strengthened" />
          <SkillChip name="Database performance tuning" status="strengthened" />
          <SkillChip name="Incident response" status="new" />
          <SkillChip name="Postgres replication" status="strengthened" />
          <SkillChip name="Event-driven systems" status="refined" />
          <SkillChip name="Production rollback procedures" status="new" />
        </div>
      </FormSection>

      {/* Audit trail */}
      <FormSection title="Audit trail" subtitle="Recent commit events. The full log is retained for 2 years.">
        <div className="space-y-2">
          <AuditLogTile
            severity="low"
            timestamp="2026-05-22 16:42:08"
            actor="System"
            action="Skill taxonomy updated · 8 entries"
            details="commit_id=KG-2026-05-22-7a3f · taxonomy_version=v142"
          />
          <AuditLogTile
            severity="low"
            timestamp="2026-05-22 16:41:55"
            actor="System"
            action="47 knowledge items committed to graph"
            details="commit_id=KG-2026-05-22-7a3f · session=HO-2026-04-22"
          />
          <AuditLogTile
            severity="low"
            timestamp="2026-05-22 16:35:11"
            actor="Minh Lê"
            action="Signed handover transcript"
            details="signature_hash=sha256:9f8c... · e-signature standard: VN local"
          />
        </div>
      </FormSection>

      {/* Action bar */}
      <div className="flex items-center justify-between pt-2 pb-4">
        <button className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
          Back to dashboard
        </button>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 text-sm font-medium inline-flex items-center gap-1.5 transition-colors">
            <Eye className="w-3.5 h-3.5" />
            Preview on graph
          </button>
          <button className="px-4 py-1.5 rounded-md bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium inline-flex items-center gap-1.5 transition-colors">
            Continue to onboarding
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   STATE C — LOW CONFIDENCE REVIEW (AC.1)
   System needs Manager to resolve ambiguous entities.
   ───────────────────────────────────────────────────────────────── */
function LowConfidenceView() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Breadcrumb path={['Dashboard', "Minh Lê's session", 'Resolve ambiguous entities']} />
      <PageHeader
        eyebrow="Indexing paused · 3 items need your call"
        title="Minh Lê's handover — almost there"
        subtitle="Most knowledge committed automatically. A few entities matched existing items in the graph closely but not exactly — we want you to decide before they merge."
        actor="Hà Vy · Manager"
      />

      <Banner tone="warning" icon={AlertCircle}>
        <strong>44 of 47 items committed automatically.</strong> The 3 below are paused awaiting your call. Indexing resumes as soon as you resolve them.
      </Banner>

      <FormSection title="Ambiguous entities" subtitle="Pick the right interpretation, or skip if you're unsure — we'll keep the new entity isolated until someone else resolves it.">
        <div className="space-y-3">

          <AmbiguousEntity
            name="Vendor XYZ"
            quote="...the contact at Vendor XYZ for escalations was Linh Pham, but she may have moved teams since then..."
            existing={{
              name: "Vendor XYZ Inc.",
              detail: "Active vendor · 14 existing relationships · last updated Q1 2026",
              similarity: 0.91
            }}
            suggestion="merge"
          />

          <AmbiguousEntity
            name="Customer Portal"
            quote="...the Customer Portal infra refresh kicked off in late Q3, partly because the legacy Customer Portal needed a database migration..."
            existing={{
              name: "Customer Portal",
              detail: "Project · 23 existing relationships · last updated last week",
              similarity: 0.76
            }}
            suggestion="ambiguous"
          />

          <AmbiguousEntity
            name="Linh Pham"
            quote="...Linh Pham was the main point of contact at Vendor XYZ — she handled the SLA escalations directly..."
            existing={null}
            suggestion="create"
          />
        </div>
      </FormSection>

      {/* Action bar */}
      <div className="flex items-center justify-between pt-2 pb-4 border-t border-gray-200 mt-6">
        <span className="text-xs text-gray-500">
          0 of 3 resolved
        </span>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">
            Skip all and isolate
          </button>
          <button
            disabled
            className="px-4 py-1.5 rounded-md bg-gray-100 text-gray-400 cursor-not-allowed text-sm font-medium inline-flex items-center gap-1.5"
          >
            Commit decisions
            <CheckCircle2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AmbiguousEntity({ name, quote, existing, suggestion }) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/60">
        <div className="flex items-center gap-2">
          <Network className="w-3.5 h-3.5 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-900">{name}</h3>
          <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700 ml-auto">
            Needs your call
          </span>
        </div>
      </div>

      <div className="px-4 py-3 space-y-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium mb-1">From the interview</div>
          <p className="text-[12px] text-gray-700 leading-relaxed italic border-l-2 border-gray-200 pl-3">
            "{quote}"
          </p>
        </div>

        {existing ? (
          <>
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium mb-1.5">
                Possible match in graph · {Math.round(existing.similarity * 100)}% similarity
              </div>
              <div className="rounded-md border border-gray-200 bg-white px-3 py-2">
                <div className="text-sm font-medium text-gray-900">{existing.name}</div>
                <div className="text-[11px] text-gray-500 mt-0.5">{existing.detail}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                suggestion === 'merge'
                  ? 'border-gray-900 bg-gray-900 text-white hover:bg-gray-800'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}>
                Merge with existing
              </button>
              <button className="px-2.5 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors">
                Create as new entity
              </button>
              <button className="px-2.5 py-1 rounded-md text-xs text-gray-500 hover:text-gray-900 transition-colors ml-auto">
                Skip
              </button>
            </div>

            {suggestion === 'ambiguous' && (
              <p className="text-[11px] text-amber-700 flex items-start gap-1.5">
                <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                Lower similarity — could be a different project. Worth a closer look.
              </p>
            )}
          </>
        ) : (
          <>
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-medium mb-1.5">No close match in graph</div>
              <p className="text-[12px] text-gray-600">No existing entity matched within the similarity threshold. This person isn't in the graph yet.</p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button className="px-2.5 py-1 rounded-md border border-gray-900 bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium transition-colors">
                Create as new person
              </button>
              <button className="px-2.5 py-1 rounded-md text-xs text-gray-500 hover:text-gray-900 transition-colors ml-auto">
                Skip
              </button>
            </div>
          </>
        )}
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────────
   STATE D — PARTIAL COMMIT
   Some items committed, others failed. Manager needs to act.
   ───────────────────────────────────────────────────────────────── */
function PartialCommitView() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Breadcrumb path={['Dashboard', "Minh Lê's session", 'Partial commit']} />
      <PageHeader
        eyebrow="Indexing finished with issues"
        title="Minh Lê's handover — partially committed"
        subtitle="Most of the handover entered the graph cleanly, but 5 items couldn't be committed. You can retry them or escalate to a graph admin."
        actor="Hà Vy · Manager"
      />

      <Banner tone="warning" icon={AlertTriangle}>
        <strong>42 of 47 items committed.</strong> 5 items couldn't be written due to a transient conflict in the graph database. Nothing is corrupted — failed items are preserved exactly as Minh Lê signed them.
      </Banner>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <CommitStat icon={CheckCircle2} value="42" label="Committed successfully" tone="default" />
        <CommitStat icon={AlertCircle}  value="5"  label="Failed — retryable"     tone="warning" />
        <CommitStat icon={Clock}        value="2:14" label="Time spent" />
      </div>

      <FormSection title="What failed" subtitle="These items hit a conflict during the write. The data itself is fine — the graph just rejected the transaction.">
        <div className="space-y-2">
          <FailedItemRow
            id="KG-FAIL-01"
            title="Project Atlas → depends_on → Auth Service"
            reason="Conflict: Auth Service was updated by another commit during this transaction"
            retryable
          />
          <FailedItemRow
            id="KG-FAIL-02"
            title="Project Atlas → depends_on → Notification Service"
            reason="Conflict: Notification Service was updated by another commit during this transaction"
            retryable
          />
          <FailedItemRow
            id="KG-FAIL-03"
            title="Vendor XYZ → contracted_with → ACME Inc."
            reason="Source entity (ACME Inc.) not found in graph"
            retryable={false}
          />
          <FailedItemRow
            id="KG-FAIL-04"
            title="Minh Lê → contributed_to → Project Atlas (skill_tag: 'distributed systems')"
            reason="Conflict: skill_tag updated by another commit during this transaction"
            retryable
          />
          <FailedItemRow
            id="KG-FAIL-05"
            title="Customer Portal → relates_to → Payment Gateway v2"
            reason="Conflict: target entity updated during transaction"
            retryable
          />
        </div>
      </FormSection>

      {/* Action bar */}
      <div className="flex items-center justify-between pt-2 pb-4 border-t border-gray-200 mt-6">
        <button className="text-xs text-gray-500 hover:text-gray-900 transition-colors inline-flex items-center gap-1.5">
          <Mail className="w-3 h-3" />
          Escalate to graph admin
        </button>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 text-sm font-medium inline-flex items-center gap-1.5 transition-colors">
            Skip the failed items
          </button>
          <button className="px-4 py-1.5 rounded-md bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium inline-flex items-center gap-1.5 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
            Retry the 4 retryable
          </button>
        </div>
      </div>
    </div>
  );
}

function FailedItemRow({ id, title, reason, retryable }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2.5">
      <div className="flex items-start gap-3">
        <AlertCircle className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${retryable ? 'text-amber-600' : 'text-rose-600'}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] text-gray-500" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{id}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase tracking-wider font-semibold ${
              retryable ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}>
              {retryable ? 'Retryable' : 'Needs admin'}
            </span>
          </div>
          <div className="text-sm text-gray-900 font-medium" style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12 }}>{title}</div>
          <div className="text-[11px] text-gray-500 mt-0.5">{reason}</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SHARED PIECES (S0 + S1 components inlined)
   ═══════════════════════════════════════════════════════════════════ */

function PageHeader({ eyebrow, title, subtitle, actor }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        {eyebrow && <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">{eyebrow}</span>}
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight mt-1">{title}</h1>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
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
    critical: { cls: 'border-rose-200 bg-rose-50/60',   iconCls: 'text-rose-600',  textCls: 'text-rose-900' },
    warning:  { cls: 'border-amber-200 bg-amber-50/60', iconCls: 'text-amber-600', textCls: 'text-amber-900' },
    muted:    { cls: 'border-gray-200 bg-gray-50',      iconCls: 'text-gray-500',  textCls: 'text-gray-700' },
  }[tone];

  return (
    <div className={`rounded-md border ${cfg.cls} px-3 py-2.5 mb-5 flex items-start gap-2`}>
      <Icon className={`w-4 h-4 ${cfg.iconCls} shrink-0 mt-0.5`} strokeWidth={1.75} />
      <div className={`text-[12px] ${cfg.textCls} leading-relaxed`}>{children}</div>
    </div>
  );
}

function ProgressStage({ status, label, detail, last }) {
  const config = {
    done:    { icon: CheckCircle2, iconCls: 'text-emerald-600',                  labelCls: 'text-gray-900' },
    active:  { icon: Loader2,      iconCls: 'text-amber-600 animate-spin',       labelCls: 'text-gray-900 font-medium' },
    pending: { icon: Clock,        iconCls: 'text-gray-300',                     labelCls: 'text-gray-400' },
    failed:  { icon: AlertCircle,  iconCls: 'text-rose-500',                     labelCls: 'text-rose-700' },
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

function ListItem({ children }) {
  return (
    <li className="flex items-start gap-2 text-[12px] text-gray-700">
      <span className="text-gray-400 shrink-0 mt-0.5">→</span>
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}

function CommitStat({ icon: Icon, value, label, tone }) {
  const toneCfg = {
    warning: { border: 'border-amber-200', bg: 'bg-amber-50/30', iconCls: 'text-amber-600', valueCls: 'text-amber-700' },
    default: { border: 'border-gray-200',  bg: 'bg-white',       iconCls: 'text-gray-500',  valueCls: 'text-gray-900' },
  }[tone || 'default'];

  return (
    <div className={`rounded-lg border ${toneCfg.border} ${toneCfg.bg} px-4 py-3`}>
      <Icon className={`w-3.5 h-3.5 ${toneCfg.iconCls} mb-2`} strokeWidth={1.75} />
      <div className={`text-2xl font-semibold tracking-tight ${toneCfg.valueCls}`} style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{value}</div>
      <div className="text-[11px] text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

function CommittedTopicRow({ title, detail, count, priority }) {
  const priCfg = {
    critical: 'bg-rose-500',
    high: 'bg-amber-500',
  };
  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2.5 flex items-center gap-3 hover:border-gray-300 transition-colors">
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${priority ? priCfg[priority] : 'bg-gray-400'}`} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900">{title}</div>
        <div className="text-[11px] text-gray-500 mt-0.5">{detail}</div>
      </div>
      <span className="text-[10px] text-gray-500 shrink-0" style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{count}</span>
    </div>
  );
}

function SkillChip({ name, status }) {
  const cfg = {
    new:           { cls: 'bg-emerald-50 border-emerald-200 text-emerald-800',  label: 'New' },
    strengthened:  { cls: 'bg-gray-50 border-gray-200 text-gray-700',           label: 'Strengthened' },
    refined:       { cls: 'bg-amber-50 border-amber-200 text-amber-800',        label: 'Refined' },
  }[status];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs ${cfg.cls}`}>
      <span>{name}</span>
      <span className="text-[10px] uppercase tracking-wider opacity-75 font-semibold">· {cfg.label}</span>
    </div>
  );
}

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
