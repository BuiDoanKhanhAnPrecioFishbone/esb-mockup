"use client";

// ART-EEP — Prepare stage (Management plane, locked light system)
// The start of the handover process: fires when an employee's status flips to
// "Offboarding". Shows the automated Prepare cascade — Trello seeding through the
// 4-Layer Hard-Filter (CL-091), the auto-derived network + UC-HO-08 knowledge
// requests (CL-100), the pre-commit flag → correction task (CL-101), and the
// knowledge map building toward the capture queue (CL-099). Voice interview is
// Phase 2 (CL-098). Tailwind + lucide-react only. Static mock data.
//
// CL-111 · 30-day offboarding window. Minh's status flipped Jun 4, last day
// Jul 4, 2026 · 26 days left (review deadline would be Jun 30, set elsewhere).

import Link from "next/link";
import {
  CheckCircle2, Clock, Sparkles, Trello, Filter, Users, Send, Network,
  AlertTriangle, FileQuestion, Upload, ArrowRight, UserPlus, Calendar,
  Briefcase, ShieldCheck, Layers,
} from "lucide-react";

const SUBJECT = {
  id: "minh-le", name: "Minh Lê", role: "Senior Backend Engineer", dept: "Engineering",
  initials: "ML", markedOn: "Jun 4, 2026", trigger: "HR system · Workday",
  departure: "Jul 4, 2026", daysLeft: 26, manager: "Hà Vy", successor: "Trần Hữu Nam",
  source: "Trello",
};

const FILTER_LAYERS = [
  { label: "Time-decay", note: "kept all history for Timeline + Heatmap", delta: "kept", tone: "neutral" },
  { label: "List / status", note: "skipped Backlog + To-Do", delta: "−136", tone: "drop" },
  { label: "Content depth", note: "dropped empty title-only cards", delta: "−74", tone: "drop" },
  { label: "Label priority", note: "deprioritized admin labels", delta: "−44", tone: "drop" },
];

const NETWORK = [
  { initials: "HV", name: "Hà Vy", rel: "Manager", responded: true },
  { initials: "TN", name: "Trần Hữu Nam", rel: "Successor", responded: true },
  { initials: "LT", name: "Linh", rel: "Frontend lead", responded: true },
  { initials: "QV", name: "Quân", rel: "Platform admin", responded: false },
  { initials: "TM", name: "Tuấn", rel: "Teammate", responded: false },
  { initials: "MM", name: "Mai", rel: "Coach", responded: false },
];

const REQUESTS = [
  { kind: "question", from: "Linh", text: "What's the freeze-window rule for the Atlas shard migration?" },
  { kind: "question", from: "Trần Hữu Nam", text: "Where do the production Gateway keys actually live?" },
  { kind: "flag", from: "Linh", text: "The Atlas shard-key card (ATLAS-530) looks out of date — can Minh confirm?", ref: "ATLAS-530" },
];

const DOMAINS = ["Project Atlas", "Payment Gateway", "On-call & incidents", "Decisions & rationale", "Team & stakeholders"];

export default function PrepareStage() {
  const mono = { fontFamily: "ui-monospace, Menlo, monospace" };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Trigger header */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-700 text-sm font-semibold inline-flex items-center justify-center shrink-0">
              {SUBJECT.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-semibold text-gray-900">{SUBJECT.name}</h1>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Offboarding
                </span>
              </div>
              <p className="text-[13px] text-gray-500 mt-0.5">{SUBJECT.role} · {SUBJECT.dept}</p>
              <p className="text-[12px] text-gray-500 mt-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />
                Status set to <span className="font-medium text-gray-700">Offboarding</span> on {SUBJECT.markedOn} by {SUBJECT.trigger} — handover preparation started automatically.
              </p>
            </div>
            <div className="text-right shrink-0 hidden sm:block">
              <p className="text-[11px] text-gray-400" style={mono}>DEPARTS</p>
              <p className="text-[13px] font-medium text-gray-900">{SUBJECT.departure}</p>
              <p className="text-[12px] text-gray-500">{SUBJECT.daysLeft} days left</p>
            </div>
          </div>

          {/* 3-phase progress */}
          <div className="mt-5">
            <PhaseBar />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
          {/* Cascade */}
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 px-1" style={mono}>
              Preparation underway
            </p>

            {/* Step 1 — seeding + filter */}
            <StepCard state="active" icon={Trello} title="Sources connected & seeded"
              meta={<span className="inline-flex items-center gap-1 text-[11px] text-gray-500"><Sparkles className="w-3 h-3 text-violet-500" strokeWidth={2} /> live</span>}>
              <p className="text-[13px] text-gray-600">
                Connected to <span className="font-medium text-gray-800">Trello</span> · Engineering board. The 4-layer hard-filter strips noise before any model runs.
              </p>
              <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50/60 p-3">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-medium text-gray-800">342 cards scanned</span>
                  <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
                    <Filter className="w-3.5 h-3.5" strokeWidth={1.75} /> 88 kept
                  </span>
                </div>
                <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {FILTER_LAYERS.map((l, i) => (
                    <div key={i} className="flex items-center justify-between gap-2 text-[11px] px-2 py-1.5 rounded-md bg-white border border-gray-200">
                      <span className="text-gray-600 min-w-0 truncate">
                        <span className="text-gray-400 mr-1" style={mono}>{i + 1}.</span>{l.label}
                        <span className="text-gray-400"> · {l.note}</span>
                      </span>
                      <span className={`shrink-0 font-medium ${l.tone === "drop" ? "text-gray-400" : "text-emerald-600"}`} style={mono}>{l.delta}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[10px] text-gray-400" style={mono}>0-token filtering · protects the budget before any LLM call</p>
              </div>
            </StepCard>

            {/* Step 2 — network derived */}
            <StepCard state="done" icon={Users} title="Network derived">
              <p className="text-[13px] text-gray-600">
                Auto-derived from Trello collaborators (card members + comment participants), plus {SUBJECT.manager} and the assigned coach. {SUBJECT.manager} can edit before requests go out.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {NETWORK.map((p) => (
                  <span key={p.initials} className="inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-full bg-white border border-gray-200">
                    <span className="w-4 h-4 rounded-full bg-violet-100 text-violet-700 text-[8px] font-semibold inline-flex items-center justify-center">{p.initials}</span>
                    {p.name}<span className="text-gray-400">· {p.rel}</span>
                  </span>
                ))}
                <button className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full border border-dashed border-gray-300 text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20">
                  <UserPlus className="w-3 h-3" strokeWidth={1.75} /> Add people
                </button>
              </div>
            </StepCard>

            {/* Step 3 — network knowledge requests */}
            <StepCard state="active" icon={Send} title="Network knowledge requests sent"
              meta={<span className="text-[11px] text-gray-500">Sent to 6 · <span className="font-medium text-gray-700">3 responded</span></span>}>
              <p className="text-[13px] text-gray-600">
                Each person was asked two things: <span className="text-gray-800">what do you still need to know from {SUBJECT.name.split(" ")[0]}?</span> and <span className="text-gray-800">did we capture anything wrong?</span>
              </p>
              <div className="mt-3 space-y-2">
                {REQUESTS.map((r, i) => (
                  <div key={i} className={`rounded-lg border p-2.5 ${r.kind === "flag" ? "border-yellow-200 bg-yellow-50/60 border-l-2 border-l-yellow-500" : "border-gray-200 bg-white"}`}>
                    <div className="flex items-start gap-2">
                      <span className={`w-6 h-6 rounded-md inline-flex items-center justify-center shrink-0 ${r.kind === "flag" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"}`}>
                        {r.kind === "flag" ? <AlertTriangle className="w-3.5 h-3.5" strokeWidth={1.75} /> : <FileQuestion className="w-3.5 h-3.5" strokeWidth={1.75} />}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[12.5px] text-gray-800 leading-snug">{r.text}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {r.kind === "flag" ? (
                            <>Flagged by {r.from} · <span className="text-yellow-700 font-medium">becomes a correction task for {SUBJECT.name.split(" ")[0]}</span> · access-bounded</>
                          ) : (
                            <>Asked by {r.from} · added to the capture queue</>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </StepCard>

            {/* Step 4 — knowledge map */}
            <StepCard state="active" icon={Layers} title="Knowledge map building">
              <p className="text-[13px] text-gray-600">
                Five domains detected from the seeded sources. Manager prompts and the network's questions merge into one queue for {SUBJECT.name.split(" ")[0]} to answer.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {DOMAINS.map((d) => (
                  <span key={d} className="inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-md bg-violet-50 text-violet-700 border border-violet-100">
                    <Network className="w-3 h-3" strokeWidth={1.75} /> {d}
                  </span>
                ))}
              </div>
              <p className="mt-2.5 text-[12px] text-gray-500">
                <span className="font-medium text-gray-800">24 questions</span> queued · <span className="text-gray-800">1 correction</span> awaiting {SUBJECT.name.split(" ")[0]}
              </p>
            </StepCard>

            {/* Step 5 — next */}
            <StepCard state="queued" icon={Upload} title="Ready for Capture" last>
              <p className="text-[13px] text-gray-600">
                Next, {SUBJECT.name.split(" ")[0]} uploads his own files and answers the question queue in his own words, at his own pace. <span className="text-gray-400">(The voice interview is Phase 2.)</span>
              </p>
            </StepCard>
          </div>

          {/* Action sidebar */}
          <aside className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-2.5" style={mono}>Next step</p>
              <Link href="/session/minh-le" className="w-full h-9 inline-flex items-center justify-center gap-1.5 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-[13px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30">
                Open the capture queue <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
              </Link>
              <button className="mt-2 w-full h-9 inline-flex items-center justify-center gap-1.5 rounded-md border border-gray-200 text-gray-700 text-[13px] hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20">
                Manage network requests
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-2.5" style={mono}>Session</p>
              <InfoRow icon={Clock} label="Status" value="Offboarding" />
              <InfoRow icon={Calendar} label="Departs" value={`${SUBJECT.departure} · ${SUBJECT.daysLeft}d`} />
              <InfoRow icon={Briefcase} label="Manager" value={SUBJECT.manager} />
              <InfoRow icon={UserPlus} label="Successor" value={SUBJECT.successor} />
              <InfoRow icon={Trello} label="Source" value={SUBJECT.source} last />
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-[12px] text-gray-600 leading-relaxed">
                <span className="font-medium text-gray-800">Prepare</span> is automated. {SUBJECT.name.split(" ")[0]} doesn't lift a finger until the capture queue is ready.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function PhaseBar() {
  const phases = [
    { label: "Prepare", state: "active", fill: 0.7 },
    { label: "Capture", state: "future", fill: 0 },
    { label: "Deliver", state: "future", fill: 0 },
  ];
  return (
    <div>
      <div className="flex gap-2">
        {phases.map((p) => (
          <div key={p.label} className="flex-1">
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full rounded-full ${p.state === "done" ? "bg-emerald-500" : "bg-violet-500"}`}
                style={{ width: p.state === "done" ? "100%" : `${p.fill * 100}%` }}
              />
            </div>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className={`text-[12px] font-medium ${p.state === "active" ? "text-violet-700" : p.state === "done" ? "text-emerald-700" : "text-gray-400"}`}>{p.label}</span>
              {p.state === "active" && <span className="text-[10px] text-gray-400">· seeding & soliciting</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepCard({ state, icon: Icon, title, meta, children, last }) {
  const ind = {
    done: { wrap: "bg-emerald-100 text-emerald-700", Mark: CheckCircle2 },
    active: { wrap: "bg-violet-100 text-violet-700", Mark: null },
    queued: { wrap: "bg-gray-100 text-gray-400", Mark: Clock },
  }[state];

  return (
    <div className="relative">
      {!last && <span className="absolute left-[19px] top-10 bottom-[-16px] w-px bg-gray-200" />}
      <div className="bg-white border border-gray-200 rounded-xl p-4 relative">
        <div className="flex items-start gap-3">
          <span className={`w-10 h-10 rounded-lg inline-flex items-center justify-center shrink-0 relative ${ind.wrap}`}>
            <Icon className="w-4 h-4" strokeWidth={1.75} />
            {state === "active" && <span className="absolute -right-0.5 -top-0.5 w-2.5 h-2.5 rounded-full bg-violet-500 ring-2 ring-white animate-pulse" />}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-[14px] font-semibold text-gray-900">{title}</h3>
                {state === "done" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2} />}
              </div>
              {meta}
            </div>
            <div className="mt-1.5">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, last }) {
  return (
    <div className={`flex items-center justify-between py-1.5 ${last ? "" : "border-b border-gray-100"}`}>
      <span className="inline-flex items-center gap-1.5 text-[12px] text-gray-500">
        <Icon className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} /> {label}
      </span>
      <span className="text-[12px] font-medium text-gray-800">{value}</span>
    </div>
  );
}
