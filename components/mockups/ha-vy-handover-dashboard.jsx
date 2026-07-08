"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, Plus, ArrowRight, X,
  AlertTriangle, CheckCircle2, Clock, RefreshCw,
  Database, Network, Sparkles, Users, FileText,
  Bell, Layers, ClipboardList, User, MessageCircle
} from "lucide-react";
import { useViewAs } from "@/lib/view-as";
import SessionCommandView from "./session-command-view";
import { SESSION } from "@/lib/data";

const ROLES = [
  { id: "manager", label: "H\u00e0 Vy", sub: "Manager / HR", icon: "HV" },
  { id: "offboarder", label: "Minh L\u00ea", sub: "Offboarder", icon: "ML" },
  { id: "coworker", label: "Coworker", sub: "Tr\u1ea7n H\u1eefu Nam", icon: "CW" },
];

const MANAGER_FLOW = [
  { id: "departures", label: "Departures pending", trigger: "HRIS flagged 2 departures." },
  { id: "active", label: "Active sessions", trigger: "2 sessions in different phases." },
  { id: "completed", label: "Session completed", trigger: "Minh L\u00ea's session committed." },
];
const OFFBOARDER_FLOW = [
  { id: "not-started", label: "Not started", trigger: "Session in Prepare." },
  { id: "active-queue", label: "Active queue", trigger: `${SESSION.questions - SESSION.answered} questions to answer.` },
  { id: "all-answered", label: "All answered", trigger: `All ${SESSION.questions} questions answered.` },
  { id: "complete", label: "Complete", trigger: "Knowledge committed to KG." },
];
const COWORKER_FLOW = [
  { id: "active", label: "Active", trigger: "2 answers to review, 2 waiting." },
  { id: "all-satisfied", label: "All satisfied", trigger: "All questions answered and reviewed." },
];

const PHASES = [
  { id: 1, key: "prepare", label: "Prepare", subs: [{ id: 1, label: "Setup confirmed" }, { id: 2, label: "Context seeding" }, { id: 3, label: "Knowledge map ready" }] },
  { id: 2, key: "capture", label: "Capture", subs: [{ id: 4, label: "Questions assigned" }, { id: 5, label: "Answering queue" }, { id: 6, label: "Answers reviewed" }] },
  { id: 3, key: "deliver", label: "Deliver", subs: [{ id: 7, label: "Committed to KG" }, { id: 8, label: "KG access ready" }] },
];
function getPhase(sid) { return PHASES.find(p => p.subs.some(s => s.id === sid)); }
function getSub(sid) { for (const p of PHASES) { const s = p.subs.find(x => x.id === sid); if (s) return s; } return null; }

const DEPARTURES = [
  { id: "minh-le", name: "Minh L\u00ea", role: "Senior Backend Engineer", dept: "Engineering", lastDay: "July 4, 2026", daysLeft: 30, initials: "ML" },
  { id: "phuong-anh", name: "Ph\u01b0\u01a1ng Anh Nguy\u1ec5n", role: "Account Executive", dept: "Sales", lastDay: "July 11, 2026", daysLeft: 33, initials: "PA" },
];
const SESSIONS = [
  { id: "minh-le", name: "Minh L\u00ea", role: "Senior Backend Engineer", dept: "Engineering", initials: "ML", subStageId: 5, daysLeft: SESSION.daysLeft, gapsResolved: `${SESSION.gapsAddressed}/${SESSION.gaps}`, answered: `${SESSION.answered}/${SESSION.questions}` },
];
const ACTIVITY_ACTIVE = [
  { ts: "2 hours ago", actor: "System", text: "Coworker joined Minh L\u00ea\u2019s session · asked 2 questions", severity: "low" },
  { ts: "3 hours ago", actor: "Minh L\u00ea", text: "Answered 3 questions in Payment Service module", severity: "low" },
  { ts: "5 hours ago", actor: "H\u00e0 Vy", text: "Added 3 priority prompts to Minh L\u00ea\u2019s session", severity: "low" },
];
const ACTIVITY_COMPLETED = [
  { ts: "2 min ago", actor: "System", text: "KG access ready · starter prompts seeded", severity: "low" },
  { ts: "7 min ago", actor: "System", text: "Minh L\u00ea\u2019s session committed · 487 entries", severity: "low" },
  { ts: "3 hours ago", actor: "H\u00e0 Vy", text: "Reviewed and committed Minh L\u00ea\u2019s answers", severity: "low" },
];
const OB_QUESTIONS = [
  { q: "What are the undocumented rate limits on the payment API?", from: "Coworker", fromType: "human", module: "Payment Service" },
  { q: "Is there a runbook for the nightly batch job failures?", from: "Coworker", fromType: "human", module: "CI/CD Pipeline" },
  { q: "What\u2019s the rollback procedure for the Atlas migration?", from: "H\u00e0 Vy", fromType: "human", module: "CI/CD Pipeline" },
  { q: "How does the Kafka retry logic handle poison messages?", from: "AI-generated", fromType: "ai", module: "Payment Service" },
  { q: "Who owns the vendor XYZ contract renewal?", from: "AI-generated", fromType: "ai", module: "Shared Libraries" },
];
// Full historical answer log (OV-R4-02 \u2014 the "All answered" view shows every Q&A, not a truncated 2).
const OB_ANSWERED = [
  { q: "Where is the API key rotation doc?", module: "Shared Libraries", satisfied: true, preview: "Engineering wiki at /security/api-key-rotation.md. Rotates every 90 days via GitHub Action..." },
  { q: "Who should I contact about the SLA penalty terms?", module: "Shared Libraries", satisfied: false, preview: "Talk to Linh Ph\u1ea1m in Procurement \u2014 she handled the last renewal. SLA doc at /vendor-contracts..." },
  { q: "How does the Kafka retry logic handle poison messages?", module: "Payment Service", satisfied: true, preview: "After 5 retries with exponential backoff, messages route to the DLQ. Monitor via Datadog alert #4421." },
  { q: "What's the max retry count before DLQ routing?", module: "Payment Service", satisfied: true, preview: "Max 5, configurable per topic in kafka-config.yaml. Backoff doubles from 500ms." },
  { q: "Which webhook events are critical vs optional?", module: "Payment Service", satisfied: true, preview: "Critical: payment_intent.succeeded, charge.refunded, invoice.payment_failed. The rest route to the batch queue." },
  { q: "What's the rollback procedure for a failed Atlas migration?", module: "CI/CD Pipeline", satisfied: true, preview: "Run /scripts/atlas-rollback.sh with the migration ID. A snapshot is taken before each run (7-day expiry)." },
  { q: "Is there a runbook for the nightly batch job failures?", module: "CI/CD Pipeline", satisfied: false, preview: "Check the Actions logs and rerun transient failures. After 3 fails, check Datadog for the upstream cause." },
  { q: "What's the token refresh strategy?", module: "Shared Libraries", satisfied: true, preview: "15-min access token, 7-day refresh in HTTP-only cookies. On failure the user is bounced to login." },
  { q: "What are the critical Datadog alert thresholds?", module: "Monitoring & Alerts", satisfied: false, preview: "P99 latency > 800ms for 5m pages on-call. Error rate > 2% pages immediately. Full list in the dashboard JSON." },
  { q: "What's the log retention policy?", module: "Monitoring & Alerts", satisfied: true, preview: "30 days hot in Elasticsearch, 1 year cold in S3 Glacier. PII is redacted at the Fluentd layer." },
  { q: "Is the Terraform version pinned?", module: "Infrastructure as Code", satisfied: true, preview: "Pinned to 1.7.x in versions.tf. State is in S3 with DynamoDB locking." },
  { q: "How are Helm values overridden per environment?", module: "Infrastructure as Code", satisfied: true, preview: "values-<env>.yaml layered over the base chart. Staging auto-deploys; prod needs manual approval." },
  { q: "How does currency conversion handle ECB API failures?", module: "Payment Service", satisfied: true, preview: "Falls back to the last cached rate (max 24h old) and flags the transaction for review." },
  { q: "Who owns the on-call escalation rotation?", module: "Monitoring & Alerts", satisfied: true, preview: "Primary \u2192 secondary \u2192 eng manager via PagerDuty. Schedule in oncall-schedule.pdf, owned by the platform team." },
];

const CW_SESSIONS = [
  { id: "minh-le", name: "Minh L\u00ea", role: "Senior Backend Engineer", initials: "ML", phase: "Capture", phaseKey: "capture", daysLeft: 22,
    ready: [
      { q: "What are the undocumented rate limits on the payment API?", module: "Payment Service", card: "Payment gateway timeout", time: "2h ago", answer: "1,000 req/min per tenant with 1.5x burst for 10s. Admin API for mid-contract changes. No public doc yet." },
      { q: "Which webhook events are critical vs optional?", module: "Payment Service", card: "Stripe webhook handler", time: "20m ago", answer: "Critical: payment_intent.succeeded, charge.refunded, invoice.payment_failed. Everything else routes to the batch queue." },
    ],
    waiting: [
      { q: "Is there a runbook for the nightly batch job failures?", module: "CI/CD Pipeline", card: "GitHub Actions workflow", time: "1 day" },
      { q: "What's the rollback procedure for the Atlas migration?", module: "CI/CD Pipeline", card: "Atlas migration rollback", time: "3h" },
    ],
  },
];

export default function HaVyHandoverDashboard({ embedded = false, role: roleProp, state: stateProp } = {}) {
  const { role: ctxRole, state: ctxState } = useViewAs();
  const pinned = !!roleProp;
  const role = pinned ? roleProp : ctxRole;
  const rawState = pinned ? (stateProp || "") : ctxState;
  const stepId = rawState || (role === "offboarder" ? "active-queue" : "active");
  return <RoleRenderer role={role} stepId={stepId} />;
}

function RoleRenderer({ role, stepId }) { if (role === "manager") return <ManagerStep id={stepId} />; if (role === "offboarder") return <OffboarderStep id={stepId} />; if (role === "coworker") return <CoworkerStep id={stepId} />; return null; }

// Dashboard state id drives which Manager surface renders. The two empty/orbital
// variants are chosen by id (not by SESSIONS.length), so the zero-session states
// are reachable from the "View as" → State switcher even though SESSIONS has 2 by default:
//   departures     → orbital + HRIS departure list + "Create session"  (zero-session, HRIS pending)
//   no-departures  → orbital + "No upcoming departures" + Sync/Create  (zero-session, zero HRIS)
//   active/completed → normal dashboard (no orbital)
function ManagerStep({ id }) { if (id === "departures") return <ManagerEmpty hasDepartures />; if (id === "no-departures") return <ManagerEmpty hasDepartures={false} />; if (id === "active") return <ManagerActive />; if (id === "completed") return <ManagerCompleted />; return null; }
// Zero-active-sessions state — orbital illustration; message + CTAs depend on HRIS status (R3-01).
function ManagerActive() {
  const sessions = SESSIONS;
  if (sessions.length === 0) return <ManagerEmpty hasDepartures={DEPARTURES.length > 0} />;
  return (<div className="max-w-4xl mx-auto p-6">
    <GreetingBanner name={"H\u00e0 Vy"} subtitle={`${sessions.length} active handover${sessions.length !== 1 ? "s" : ""}`} />
    <div className="grid grid-cols-3 gap-5">
      <div className="col-span-2 space-y-3">
        <div className="flex items-center justify-between">
          <SectionLabel count={sessions.length}>Active sessions</SectionLabel>
          <Link href="/session/new" className="h-8 px-3 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30"><Plus className="w-3.5 h-3.5" />Create session</Link>
        </div>
        {sessions.map(s => <SessionCard key={s.id} session={s} />)}
      </div>
      <div className="space-y-3"><SectionLabel>Recent activity</SectionLabel>{ACTIVITY_ACTIVE.map((a, i) => <ActivityItem key={i} {...a} />)}</div>
    </div>
  </div>);
}
function ManagerCompleted() { const [dismissed, setDismissed] = useState(false); const active = SESSIONS.filter(s => s.id !== "minh-le"); return (<div className="max-w-4xl mx-auto p-6"><GreetingBanner name={"H\u00e0 Vy"} subtitle={`${active.length} active handover${active.length !== 1 ? "s" : ""} · 1 just completed`} />{!dismissed && (<article className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4 mb-6 flex items-center justify-between"><div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" strokeWidth={2} /><div><h3 className="text-sm font-semibold text-gray-900">{"Minh L\u00ea\u2019s session is complete"}</h3><p className="text-xs text-gray-500 mt-0.5">{"Knowledge committed · "}<Link href="/sessions" className="text-violet-600 underline">{"View in sessions \u2192"}</Link></p></div></div><button onClick={() => setDismissed(true)} className="w-7 h-7 rounded-md hover:bg-emerald-100 inline-flex items-center justify-center text-emerald-400 hover:text-emerald-600 transition-colors"><X className="w-3.5 h-3.5" /></button></article>)}<div className="grid grid-cols-3 gap-5"><div className="col-span-2 space-y-3"><div className="flex items-center justify-between"><SectionLabel count={active.length}>Active sessions</SectionLabel><Link href="/session/new" className="h-8 px-3 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30"><Plus className="w-3.5 h-3.5" />Create session</Link></div>{active.map(s => <SessionCard key={s.id} session={s} />)}<p className="text-xs text-gray-500 pt-2"><Link href="/sessions" className="text-violet-600 underline">{"View all sessions \u2192"}</Link>{" (includes 1 completed)"}</p></div><div className="space-y-3"><SectionLabel>Recent activity</SectionLabel>{ACTIVITY_COMPLETED.map((a, i) => <ActivityItem key={i} {...a} />)}</div></div></div>); }

// Offboarder's dashboard IS their session command view (Overview/Data/Logs). Dashboard
// states map to session lifecycle steps; the old dashboard UI now lives in the Overview tab.
const OB_STATE_TO_STEP = { "not-started": "ready", "active-queue": "capture", "all-answered": "capture", "complete": "complete" };
function OffboarderStep({ id }) { if (id === "all-answered") return <OBAllAnswered />; return <SessionCommandView role="offboarder" step={OB_STATE_TO_STEP[id] || "capture"} chrome={false} />; }
function DeadlineBar({ days }) { const color = days > 14 ? "safe" : days > 7 ? "amber" : "danger"; const cls = { safe: "bg-emerald-50 border-emerald-200 text-emerald-800", amber: "bg-yellow-50 border-yellow-200 text-yellow-800", danger: "bg-rose-50 border-rose-200 text-rose-800" }[color]; return (<div className={`rounded-lg border px-4 py-2.5 mb-4 text-[12px] flex items-center gap-2 ${cls}`}><Clock className="w-3.5 h-3.5 shrink-0" /><span><span className="font-semibold">{days}{" days"}</span>{" until your last day · July 4, 2026"}</span></div>); }
function OBNotStarted() { return (<div className="max-w-2xl mx-auto p-6"><DeadlineBar days={30} /><div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center mt-4"><div className="w-12 h-12 rounded-full bg-gray-100 inline-flex items-center justify-center mb-3"><Clock className="w-5 h-5 text-gray-400" strokeWidth={1.5} /></div><h3 className="text-sm font-medium text-gray-700 mb-1">Your session is being prepared</h3><p className="text-xs text-gray-500">{"You\u2019ll be notified when your question queue is ready."}</p></div></div>); }
function OBActiveQueue() { return (<div className="max-w-2xl mx-auto p-6"><DeadlineBar days={22} /><div className="grid grid-cols-3 gap-3 mb-4"><ActionCard label={"To answer"} value={5} color="urgent" /><ActionCard label={"Answered"} value={9} color="good" /><ActionCard label={"Files uploaded"} value={2} color="normal" /></div><div className="flex items-center gap-3 mb-4"><div className="flex-1 h-[5px] rounded-full bg-gray-200 overflow-hidden"><div className="h-full rounded-full bg-violet-500" style={{ width: "64%" }} /></div><span className="text-[11px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>9 / 14</span></div><SectionLabel count={5}>Questions waiting for you</SectionLabel><div className="space-y-2 mt-2">{OB_QUESTIONS.map((q, i) => (<Link key={i} href="/session/minh-le?tab=data" className="block rounded-lg border border-gray-200 bg-white px-4 py-3 hover:border-gray-300 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/20"><div className="text-[13px] text-gray-900 mb-1">{q.q}</div><div className="text-[11px] text-gray-500 flex items-center gap-1.5">{q.fromType === "ai" ? <Sparkles className="w-3 h-3 text-violet-500" /> : <User className="w-3 h-3" />}<span>{q.from}</span><span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 ml-1">{q.module}</span></div></Link>))}</div><div className="mt-3"><Link href="/session/minh-le?tab=data" className="h-8 px-4 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30">Open question queue<ArrowRight className="w-3 h-3" /></Link><p className="text-[10px] text-gray-400 mt-1.5">Opens in Data tab</p></div><div className="mt-6"><SectionLabel count={9}>Recently answered</SectionLabel><div className="space-y-2 mt-2">{OB_ANSWERED.map((q, i) => (<div key={i} className="rounded-lg border border-gray-200 bg-white px-4 py-3 opacity-50"><div className="text-[13px] text-gray-900 line-through mb-1">{q.q}</div><div className="text-[11px] text-gray-500 flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500" /><span>Answered</span>{q.satisfied && <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">{"\u2713 Accepted"}</span>}{!q.satisfied && <span className="text-[9px] text-gray-400">waiting for review</span>}<span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 ml-1">{q.module}</span></div>{q.preview && <p className="text-[11px] text-gray-500 mt-1.5 italic leading-relaxed">&quot;{q.preview}&quot;</p>}<Link href="/session/minh-le?tab=data" className="text-[10px] text-violet-600 mt-1 inline-block">{"See full answer \u2192"}</Link></div>))}</div></div></div>); }
// OV-03 \u2014 "All answered" is a distinct celebration moment: contribution summary + read-only answers, no inputs/progress.
function OBStat({ v, l }) { return (<div className="rounded-lg border border-gray-200 bg-white p-3 text-center"><div className="text-xl font-semibold text-gray-900" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{v}</div><div className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-0.5">{l}</div></div>); }
function OBAllAnswered() {
  return (<div className="max-w-2xl mx-auto p-6">
    <div className="rounded-xl border border-emerald-200 p-8 text-center mb-5" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)" }}>
      <div className="w-14 h-14 rounded-full bg-white inline-flex items-center justify-center mb-3 shadow-sm"><CheckCircle2 className="w-8 h-8 text-emerald-500" strokeWidth={1.75} /></div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">{"You\u2019re all caught up!"}</h3>
      <p className="text-xs text-gray-600">{"You answered "}{OB_ANSWERED.length}{` questions across ${SESSION.modules} modules.`}</p>
    </div>
    <div className="grid grid-cols-3 gap-3 mb-5"><OBStat v={OB_ANSWERED.length} l="Questions answered" /><OBStat v={SESSION.modules} l="Modules covered" /><OBStat v={SESSION.entries} l="Knowledge entries" /></div>
    {/* OV-R4-02 \u2014 full read-only answer history, scrollable, no truncation. */}
    <SectionLabel count={OB_ANSWERED.length}>Your submitted answers</SectionLabel>
    <div className="space-y-2 mt-2 max-h-[420px] overflow-y-auto pr-1">{OB_ANSWERED.map((q, i) => (<div key={i} className="rounded-lg border border-gray-200 bg-white px-4 py-3"><div className="text-[12px] text-gray-900 mb-1">{q.q}</div><div className="text-[11px] text-gray-500 flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500" /><span>Answered</span>{q.satisfied ? <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">{"\u2713 Accepted"}</span> : <span className="text-[9px] text-gray-400">waiting for review</span>}<span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 ml-1">{q.module}</span></div>{q.preview && <p className="text-[11px] text-gray-500 mt-1.5 italic leading-relaxed">&quot;{q.preview}&quot;</p>}</div>))}</div>
    <p className="text-[11px] text-gray-400 text-center mt-5">{"H\u00e0 Vy will review your answers and commit them to the knowledge graph. You\u2019ll be notified if new questions come in."}</p>
  </div>);
}
function OBComplete() { return (<div className="max-w-2xl mx-auto p-6"><div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-8 text-center"><CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" strokeWidth={1.5} /><h3 className="text-base font-semibold text-gray-900 mb-1">Your knowledge has been preserved</h3><p className="text-xs text-gray-500">{"14 answers and 4 files committed to the knowledge graph."}<br />{"Future team members can access this knowledge."}<br /><br />{"Thank you, Minh L\u00ea."}</p></div></div>); }

function CoworkerStep({ id }) { if (id === "all-satisfied") return <CoworkerAllSatisfied />; return <CoworkerActive />; }

function CoworkerActive() {
  const totalAnswers = CW_SESSIONS.reduce((s, c) => s + c.ready.length, 0);
  const totalWaiting = CW_SESSIONS.reduce((s, c) => s + c.waiting.length, 0);
  return (<div className="max-w-3xl mx-auto p-6">
    <GreetingBanner name={"Tr\u1ea7n H\u1eefu Nam"} subtitle={`${totalAnswers} answer${totalAnswers !== 1 ? "s" : ""} to review across ${CW_SESSIONS.length} sessions`} />
    <div className="grid grid-cols-3 gap-3 mb-6">
      <ActionCard label={"Answers to review"} value={totalAnswers} color={totalAnswers > 0 ? "good" : "normal"} />
      <ActionCard label={"Waiting for answer"} value={totalWaiting} color={totalWaiting > 0 ? "warn" : "normal"} />
      <ActionCard label={"Active sessions"} value={CW_SESSIONS.length} color="normal" />
    </div>
    <SectionLabel count={CW_SESSIONS.length}>Your sessions</SectionLabel>
    <div className="space-y-3 mt-3">
      {CW_SESSIONS.map(s => <CoworkerSessionCard key={s.id} session={s} />)}
    </div>
  </div>);
}

function CoworkerAllSatisfied() {
  return (<div className="max-w-3xl mx-auto p-6">
    <GreetingBanner name={"Tr\u1ea7n H\u1eefu Nam"} subtitle={`All caught up · ${CW_SESSIONS.length} session${CW_SESSIONS.length !== 1 ? "s" : ""}`} />
    <div className="grid grid-cols-3 gap-3 mb-6">
      <ActionCard label={"Answers to review"} value={0} color="good" />
      <ActionCard label={"Waiting for answer"} value={0} color="good" />
      <ActionCard label={"Active sessions"} value={CW_SESSIONS.length} color="normal" />
    </div>
    <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-6 text-center mb-6">
      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" strokeWidth={1.5} />
      <h3 className="text-sm font-medium text-gray-900 mb-1">{"You\u2019re all caught up"}</h3>
      <p className="text-xs text-gray-500">All your questions have been answered and reviewed.</p>
    </div>
    <SectionLabel count={CW_SESSIONS.length}>Your sessions</SectionLabel>
    <div className="space-y-3 mt-3">
      {CW_SESSIONS.map(s => <CoworkerSessionCard key={s.id} session={s} showEmpty />)}
    </div>
  </div>);
}

// Deep link to a specific card's Q&A: opens the Data tab with the side panel pre-opened (CW-04).
function cardLink(sessionId, card) { return `/session/${sessionId}?tab=data&card=${encodeURIComponent(card)}`; }
function CWReadyItem({ sessionId, item }) {
  const [verdict, setVerdict] = useState(null);
  return (
    <div className="rounded-md bg-gray-50 px-3 py-2.5" style={{ borderLeft: "2px solid rgb(16,185,129)", borderRadius: 0 }}>
      <p className="text-[11px] font-medium text-gray-900 mb-1">{item.q}</p>
      <p className="text-[11px] text-gray-700 leading-relaxed mb-1.5">{item.answer}</p>
      <div className="flex items-center gap-1.5 mb-2 text-[9px]"><CheckCircle2 className="w-3 h-3 text-emerald-500" /><span className="text-emerald-600">{"Answered "}{item.time}</span><span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{item.module}</span></div>
      {verdict ? (
        <p className="text-[10px] text-emerald-600 inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />{verdict === "satisfied" ? "Marked accepted" : "Sent back for more detail"}</p>
      ) : (
        <div className="flex gap-2 items-center">
          <button onClick={() => setVerdict("satisfied")} className="h-6 px-2 rounded border border-emerald-300 text-emerald-700 text-[10px] inline-flex items-center gap-1 hover:bg-emerald-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20"><CheckCircle2 className="w-2.5 h-2.5" />Accept</button>
          <button onClick={() => setVerdict("more")} className="h-6 px-2 rounded border border-gray-300 text-gray-600 text-[10px] inline-flex items-center gap-1 hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500/20">Needs more</button>
          <Link href={cardLink(sessionId, item.card)} className="text-[10px] text-violet-600 hover:text-violet-700 ml-auto inline-flex items-center gap-1">{"In context \u2192"}</Link>
        </div>
      )}
    </div>
  );
}
function CoworkerSessionCard({ session: s, showEmpty }) {
  const phaseColors = { prepare: "bg-blue-50 border-blue-200 text-blue-700", capture: "bg-violet-50 border-violet-200 text-violet-700", deliver: "bg-emerald-50 border-emerald-200 text-emerald-700" };
  const ready = showEmpty ? [] : (s.ready || []);
  const waiting = showEmpty ? [] : (s.waiting || []);
  const hasActivity = (ready.length + waiting.length) > 0;
  const noQuestions = (s.ready || []).length === 0 && (s.waiting || []).length === 0;
  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <Link href={`/session/${s.id}`} className="flex items-center gap-3 p-4 hover:bg-gray-50/50 transition-colors">
        <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 text-gray-700 text-[10px] font-semibold inline-flex items-center justify-center shrink-0">{s.initials}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-semibold text-gray-900">{s.name}&apos;s session</h3>
            <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold border ${phaseColors[s.phaseKey]}`}>{s.phase}</span>
          </div>
          <p className="text-[11px] text-gray-500">{s.role}{" · "}{s.daysLeft}{" days left"}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
      </Link>
      {hasActivity && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
          {ready.length > 0 && (<div>
            <p className="text-[10px] uppercase tracking-wider font-medium text-emerald-700 mb-1.5">{"Ready for review · "}{ready.length}</p>
            <div className="space-y-1.5">{ready.map((item, i) => <CWReadyItem key={i} sessionId={s.id} item={item} />)}</div>
          </div>)}
          {waiting.length > 0 && (<div>
            <p className="text-[10px] uppercase tracking-wider font-medium text-yellow-700 mb-1.5">{"Waiting for answer · "}{waiting.length}</p>
            <div className="space-y-1.5">{waiting.map((item, i) => (
              <Link key={i} href={cardLink(s.id, item.card)} className="block rounded-md bg-gray-50 px-3 py-2 hover:bg-gray-100 transition-colors" style={{ borderLeft: "2px solid rgb(234,179,8)", borderRadius: 0 }}>
                <p className="text-[11px] font-medium text-gray-900 mb-0.5">{item.q}</p>
                <div className="flex items-center gap-1.5 text-[9px]"><Clock className="w-3 h-3 text-yellow-600" /><span className="text-yellow-600">{"Waiting · "}{item.time}</span><span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{item.module}</span></div>
              </Link>
            ))}</div>
          </div>)}
          <div><Link href={`/session/${s.id}?tab=data`} className="h-7 px-3 rounded-md border border-gray-300 text-gray-700 text-[10px] font-medium inline-flex items-center gap-1 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20">Ask a question</Link></div>
        </div>
      )}
      {noQuestions && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3">
          <div className="flex items-start gap-1.5 mb-3">
            <AlertTriangle className="w-3 h-3 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-600">{s.name}{" is leaving in "}{s.daysLeft}{" days. Ask about knowledge you\u2019ll need after they\u2019re gone."}</p>
          </div>
          <Link href={`/session/${s.id}?tab=data`} className="h-7 px-3 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-medium inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">Ask your first question<ArrowRight className="w-2.5 h-2.5" /></Link>
        </div>
      )}
    </div>
  );
}

// Greeting banner (§9) — gradient background with a faint decorative knowledge-graph in the corner.
function GreetingBanner({ name, subtitle }) {
  return (<div className="relative overflow-hidden rounded-xl border border-violet-100 mb-6 px-5 py-4" style={{ background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 55%, #faf5ff 100%)" }}>
    <DecoNodes />
    <div className="relative">
      <h1 className="text-lg font-semibold text-gray-900 tracking-tight">{"Good afternoon, "}{name}</h1>
      <p className="text-[12px] text-gray-600 mt-0.5">{subtitle}</p>
    </div>
  </div>);
}
function DecoNodes() {
  return (<svg className="absolute -right-2 -top-2 h-[120%] w-52 pointer-events-none" viewBox="0 0 200 110" fill="none" style={{ opacity: 0.16 }} aria-hidden="true">
    <line x1="150" y1="30" x2="110" y2="20" stroke="#7c3aed" strokeWidth="1" /><line x1="150" y1="30" x2="175" y2="68" stroke="#7c3aed" strokeWidth="1" /><line x1="150" y1="30" x2="120" y2="70" stroke="#7c3aed" strokeWidth="1" /><line x1="175" y1="68" x2="120" y2="70" stroke="#7c3aed" strokeWidth="1" strokeDasharray="3,3" />
    <circle cx="150" cy="30" r="9" fill="#7c3aed" /><circle cx="110" cy="20" r="5" fill="#a78bfa" /><circle cx="175" cy="68" r="5" fill="#a78bfa" /><circle cx="120" cy="70" r="6" fill="#c4b5fd" />
  </svg>);
}
// Orbital illustration (§9 / R3-01) — the "no active work" signal. Reused on the
// dashboard zero-states and inside a session's departure-pending state.
export function OrbitalIllustration() {
  return (<div className="relative w-40 h-40 mx-auto mb-6">
    <style>{"@keyframes orbit-cw{from{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes orbit-ccw{from{transform:rotate(0)}to{transform:rotate(-360deg)}}"}</style>
    <div className="absolute inset-0 rounded-full border border-violet-200/70" />
    <div className="absolute inset-[18px] rounded-full border border-violet-200/60" />
    <div className="absolute inset-[36px] rounded-full border border-violet-200/50" />
    <div className="absolute inset-0" style={{ animation: "orbit-cw 18s linear infinite" }}><span className="absolute left-1/2 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-violet-400" /></div>
    <div className="absolute inset-[18px]" style={{ animation: "orbit-ccw 24s linear infinite" }}><span className="absolute left-1/2 top-0 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-violet-300" /></div>
    <div className="absolute inset-[36px]" style={{ animation: "orbit-cw 14s linear infinite" }}><span className="absolute left-1/2 top-0 -translate-x-1/2 w-2 h-2 rounded-full bg-fuchsia-300" /></div>
    <div className="absolute inset-0 flex items-center justify-center"><div className="w-12 h-12 rounded-full inline-flex items-center justify-center shadow-sm" style={{ background: "linear-gradient(135deg,#8b5cf6,#7c3aed)" }}><Sparkles className="w-5 h-5 text-white" strokeWidth={1.75} /></div></div>
  </div>);
}

const GRADIENT = "linear-gradient(135deg,#8b5cf6,#7c3aed)";
function SyncFromHris() {
  const [spinning, setSpinning] = useState(false);
  const [done, setDone] = useState(false);
  const handle = () => { setSpinning(true); setDone(false); setTimeout(() => { setSpinning(false); setDone(true); }, 700); };
  return (<button onClick={handle} disabled={spinning} className="h-9 px-4 rounded-lg text-sm font-medium inline-flex items-center gap-1.5 transition-colors border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 disabled:opacity-60">
    <RefreshCw className={`w-3.5 h-3.5 ${spinning ? "animate-spin" : ""}`} />{spinning ? "Syncing…" : done ? "Synced just now" : "Sync from HRIS"}
  </button>);
}

// Zero active sessions (R3-01 / §2.1). Orbital (OrbitalIllustration) is constant; the copy +
// CTAs depend on HRIS status via `hasDepartures`:
//   hasDepartures → orbital + "N upcoming departures" + Create session / Sync, plus the
//                   HRIS departure list below (DepartureBanner).
//   !hasDepartures → orbital + "No upcoming departures" + Sync / Create manually, no list.
// MV-R4-03 — a departure that already has an active session is removed from the list (shown
// only as a session card). If every departure has a session, the list section is hidden.
function ManagerEmpty({ hasDepartures }) {
  const departures = DEPARTURES.filter(d => !SESSIONS.some(s => s.id === d.id));
  const showDepartures = hasDepartures && departures.length > 0;
  return (<div className="max-w-2xl mx-auto p-6">
    <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
      <OrbitalIllustration />
      {showDepartures ? (<>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">{departures.length}{" upcoming departure"}{departures.length !== 1 ? "s" : ""}</h3>
        <p className="text-xs text-gray-500 mb-5">{"HRIS flagged people leaving soon. Start a session to begin building their knowledge graph."}</p>
        <div className="flex items-center justify-center gap-2">
          <Link href="/session/new" className="h-9 px-4 rounded-lg text-white text-sm font-medium inline-flex items-center gap-1.5 transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-violet-500/30" style={{ background: GRADIENT }}><Plus className="w-3.5 h-3.5" />Create session</Link>
          <SyncFromHris />
        </div>
      </>) : (<>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">No upcoming departures</h3>
        <p className="text-xs text-gray-500 mb-5">{"Nothing from HRIS right now. When someone’s leaving, their knowledge graph starts building here."}</p>
        <div className="flex items-center justify-center gap-2">
          <SyncFromHris />
          <Link href="/session/new" className="h-9 px-4 rounded-lg text-white text-sm font-medium inline-flex items-center gap-1.5 transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-violet-500/30" style={{ background: GRADIENT }}><Plus className="w-3.5 h-3.5" />Create manually</Link>
        </div>
      </>)}
    </div>
    {showDepartures && <div className="mt-5"><DepartureBanner departures={departures} /></div>}
  </div>);
}
function DepartureBanner({ departures }) { return (<article className="rounded-lg border border-yellow-200 bg-yellow-50/40 p-4 mb-6"><div className="flex items-center gap-2 mb-3"><AlertTriangle className="w-3.5 h-3.5 text-yellow-700" strokeWidth={2} /><h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">{departures.length}{" upcoming departures from HRIS"}</h3></div><div className="space-y-2">{departures.map((d, i) => (<div key={i} className="flex items-center justify-between bg-white rounded-md border border-gray-200 px-3 py-2"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 text-gray-700 text-[10px] font-semibold inline-flex items-center justify-center shrink-0">{d.initials}</div><div><div className="text-sm font-medium text-gray-900">{d.name}</div><div className="text-[11px] text-gray-500">{d.role}{" · "}{d.dept}</div></div></div><div className="flex items-center gap-3"><span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{"Last day "}{d.lastDay}{" · "}{d.daysLeft}{"d"}</span><Link href={`/session/new?employee=${d.id}`} className="h-7 px-2.5 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-medium inline-flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30">Start session<ArrowRight className="w-2.5 h-2.5" /></Link></div></div>))}</div></article>); }
function ActionCard({ label, value, color = "normal", active, onClick }) { const cls = { urgent: "text-rose-600", warn: "text-yellow-700", good: "text-emerald-600", normal: "text-gray-900" }[color]; return (<button onClick={onClick} className={`rounded-lg border bg-white p-3 text-left transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/20 cursor-pointer ${active ? "border-violet-400 ring-2 ring-violet-500/10" : "border-gray-200 hover:border-gray-300"}`}><div className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">{label}</div><div className={`text-xl font-semibold ${cls}`} style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{value}</div></button>); }
function SessionCard({ session }) { const phase = getPhase(session.subStageId); const pc = { prepare: "bg-blue-50 border-blue-200 text-blue-700", capture: "bg-violet-50 border-violet-200 text-violet-700", deliver: "bg-emerald-50 border-emerald-200 text-emerald-700" }; return (<Link href={`/session/${session.id}`} className="block rounded-lg border border-gray-200 bg-white transition-all hover:shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20"><article className="p-4 flex items-start gap-4"><div className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 border border-gray-200 text-[11px] font-semibold inline-flex items-center justify-center shrink-0">{session.initials}</div><div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-1 flex-wrap"><h3 className="text-sm font-semibold text-gray-900">{session.name}&apos;s session</h3><span className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold border ${pc[phase.key]}`}>{phase.label}</span></div><p className="text-[12px] text-gray-500 mb-3">{session.role}{" · "}{session.dept}{" · "}{session.daysLeft}{" days left"}</p><PhaseProgress subStageId={session.subStageId} /></div><span className="h-8 px-3 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium inline-flex items-center gap-1.5 shrink-0">Open<ArrowRight className="w-3 h-3" /></span></article></Link>); }
// UI-03 — compact 3-node stepper (matches the in-session stepper): green done · violet active · gray upcoming.
function PhaseProgress({ subStageId, done }) {
  const cur = getPhase(subStageId);
  const activeIdx = done ? PHASES.length : cur.id - 1;
  const activeLabel = done ? "Complete" : cur.label;
  const nodeEl = (state) => state === "done"
    ? <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
    : state === "active"
    ? <span className="w-2.5 h-2.5 rounded-full bg-violet-600 inline-block shrink-0" />
    : <span className="w-2.5 h-2.5 rounded-full border border-gray-300 bg-white inline-block shrink-0" />;
  return (<div className="flex items-center gap-2">
    <div className="flex items-center">{PHASES.map((p, i) => { const state = i < activeIdx ? "done" : i === activeIdx ? "active" : "upcoming"; return (<React.Fragment key={p.id}>{nodeEl(state)}{i < PHASES.length - 1 && <span className="w-4 h-px mx-0.5 inline-block" style={{ background: state === "done" ? "#10b981" : "#e5e7eb" }} />}</React.Fragment>); })}</div>
    <span className="text-[11px] font-medium text-gray-700">{activeLabel}</span>
  </div>);
}
function SectionLabel({ count, children }) { return (<h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium flex items-center gap-2"><span>{children}</span>{count !== undefined && <span className="text-gray-400" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{"· "}{count}</span>}</h2>); }
function ActivityItem({ ts, actor, text, severity }) { const border = { low: "rgb(229,231,235)", medium: "rgb(234,179,8)", high: "rgb(244,63,94)" }[severity]; return (<div className="rounded-md border border-gray-200 bg-white px-3 py-2" style={{ borderLeft: `2px solid ${border}` }}><div className="flex items-center justify-between mb-0.5 gap-2"><span className="text-[10px] text-gray-500" style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{ts}</span><span className="text-[10px] text-gray-700 font-medium shrink-0">{actor}</span></div><div className="text-[11px] text-gray-900 leading-relaxed">{text}</div></div>); }
