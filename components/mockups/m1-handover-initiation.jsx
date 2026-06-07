"use client";

import { useState, useEffect, useRef } from "react";
import {
  Home, FolderKanban, Network, Settings as SettingsIcon, Search, Bell,
  Plus, ArrowLeft, ChevronDown, ChevronRight, Check, X, Trello,
  ShieldCheck, Sparkles, Clock, Users, FileText, AlertTriangle, RotateCcw,
  Calendar, User,
} from "lucide-react";

/* ART-EEP · Module 1 — Handover Initiation (happy path)
   Management/Capture plane · violet/yellow aesthetic, light mode.
   Self-contained clickable walkthrough: dashboard -> quick initiate ->
   Prepare seeding (Trello 4-layer hard-filter) -> network confirm (UC-HO-08)
   -> Capture handoff.

   Field principle (per BA direction): no field is hidden or disabled.
   The Customize step shows every option, all selectable, pre-filled with
   the happy-path values. */

function Avatar({ name, className = "" }) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  return (
    <div className={`flex items-center justify-center rounded-full bg-violet-100 text-violet-700 font-semibold ${className}`}>
      {initials}
    </div>
  );
}

function SourceChip({ label }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-0.5 text-xs font-medium text-gray-600">
      <Trello className="h-3 w-3 text-sky-600" /> {label}
    </span>
  );
}

function PhaseBar({ phase }) {
  const phases = ["prepare", "capture", "deliver"];
  const idx = phases.indexOf(phase);
  const labels = { prepare: "Prepare", capture: "Capture", deliver: "Deliver" };
  return (
    <div className="flex items-center gap-1.5">
      {phases.map((p, i) => (
        <div key={p} className="flex items-center gap-1.5">
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
              i < idx
                ? "bg-emerald-50 text-emerald-700"
                : i === idx
                ? "bg-violet-600 text-white"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {labels[p]}
          </span>
          {i < phases.length - 1 && (
            <span className={`h-px w-4 ${i < idx ? "bg-emerald-300" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function SessionCard({ name, role, dept, phase, days, urgent, onClick, isNew }) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center gap-4 rounded-xl border bg-white p-4 text-left transition-colors hover:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${
        isNew ? "border-violet-300 ring-2 ring-violet-500/10" : "border-gray-200"
      }`}
    >
      <Avatar name={name} className="h-10 w-10 text-sm shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-semibold text-gray-900">{name}</p>
          {isNew && <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-semibold text-violet-700">NEW</span>}
        </div>
        <p className="truncate text-sm text-gray-500">{role} · {dept}</p>
        <div className="mt-2"><SourceChip label="Trello" /></div>
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span
          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
            urgent ? "bg-rose-50 text-rose-700" : "bg-yellow-50 text-yellow-800"
          }`}
        >
          <Clock className="h-3 w-3" /> {days} days left
        </span>
        <PhaseBar phase={phase} />
      </div>
    </button>
  );
}

function Kpi({ label, value, tint }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-1 font-mono text-2xl font-semibold ${tint}`}>{value}</p>
    </div>
  );
}

/* ---------------- Screens ---------------- */

function Dashboard({ go, minhLeState }) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Handovers</h1>
          <p className="mt-1 text-sm text-gray-500">Sessions you own across Engineering.</p>
        </div>
        <button
          onClick={() => go("initiate")}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
        >
          <Plus className="h-4 w-4" /> Initiate handover
        </button>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <Kpi label="Active sessions" value={minhLeState ? 3 : 2} tint="text-gray-900" />
        <Kpi label="Pending your review" value={1} tint="text-violet-600" />
        <Kpi label="Open knowledge gaps" value={minhLeState ? 14 : 8} tint="text-yellow-700" />
      </div>

      <h2 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">In progress</h2>
      <div className="space-y-3">
        {minhLeState && (
          <SessionCard
            name="Minh Lê" role="Senior Backend Engineer" dept="Engineering"
            phase={minhLeState} days={12} isNew
            onClick={() => go(minhLeState === "capture" ? "capture" : "prepare")}
          />
        )}
        <SessionCard name="Phương Anh Nguyễn" role="Senior Account Executive" dept="Sales" phase="capture" days={9} />
        <SessionCard name="Khánh Linh Trần" role="Head of People Operations" dept="People & Culture" phase="deliver" days={2} urgent />
      </div>
    </div>
  );
}

/* ---- Reusable field primitives (always visible, always interactive) ---- */

function FieldLabel({ children }) {
  return <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-gray-500">{children}</label>;
}

function SelectField({ value, onChange, options, icon: Icon }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-500/15">
      {Icon && <Icon className="h-4 w-4 shrink-0 text-gray-400" />}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent text-sm text-gray-900 outline-none"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function QuickInitiate({ go }) {
  const [customizeOpen, setCustomizeOpen] = useState(true); // shown by default
  const [offboarder, setOffboarder] = useState("Minh Lê — Senior Backend Engineer");
  const [successor, setSuccessor] = useState("Trần Hữu Nam");
  const [blueprint, setBlueprint] = useState("Engineering (default)");
  const [tuning, setTuning] = useState("Auto from knowledge gaps");
  const [trelloOn, setTrelloOn] = useState(true);

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <button onClick={() => go("dashboard")} className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" /> Back to handovers
      </button>

      <h1 className="text-2xl font-semibold text-gray-900">Initiate handover</h1>
      <p className="mt-1 text-sm text-gray-500">Everything's pre-filled — review or adjust any field, then start.</p>

      {/* Identity (selectable, pre-filled) */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
        <FieldLabel>Who's handing over?</FieldLabel>
        <SelectField
          value={offboarder} onChange={setOffboarder} icon={User}
          options={[
            "Minh Lê — Senior Backend Engineer",
            "Khánh Linh Trần — Head of People Operations",
            "Phương Anh Nguyễn — Senior Account Executive",
          ]}
        />
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
          <span className="text-gray-500">Engineering · last day in</span>
          <span className="font-mono">12</span><span className="text-gray-500">days</span>
        </div>
      </div>

      {/* Customize — all fields shown, selectable, pre-filled */}
      <div className="mt-4 rounded-xl border border-violet-200 bg-violet-50/20">
        <button
          onClick={() => setCustomizeOpen((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-3 text-left"
        >
          <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-900">
            <SettingsIcon className="h-4 w-4 text-gray-500" /> Customize <span className="text-xs font-normal text-gray-500">· optional — pre-filled for you</span>
          </span>
          {customizeOpen ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
        </button>

        {customizeOpen && (
          <div className="space-y-4 border-t border-violet-100 px-5 py-4">
            {/* Successor */}
            <div>
              <FieldLabel>Successor</FieldLabel>
              <SelectField value={successor} onChange={setSuccessor} icon={User}
                options={["Trần Hữu Nam", "Duy Nguyễn", "Assign later"]} />
            </div>

            {/* Review deadline */}
            <div>
              <FieldLabel>Review deadline</FieldLabel>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-500/15">
                <Calendar className="h-4 w-4 shrink-0 text-gray-400" />
                <input defaultValue="June 8, 2026 · 17:00"
                  className="flex-1 bg-transparent font-mono text-sm text-gray-900 outline-none" />
              </div>
            </div>

            {/* Data source */}
            <div>
              <FieldLabel>Data source · POC</FieldLabel>
              <button
                onClick={() => setTrelloOn((v) => !v)}
                className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-left hover:border-gray-300"
              >
                <span className={`flex h-4 w-4 items-center justify-center rounded border ${trelloOn ? "border-violet-600 bg-violet-600" : "border-gray-300 bg-white"}`}>
                  {trelloOn && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                </span>
                <Trello className="h-4 w-4 text-sky-600" />
                <span className="flex-1 text-sm text-gray-800">Trello <span className="text-gray-400">· 4-layer hard-filter applied</span></span>
                <span className="text-[11px] text-gray-400">connected</span>
              </button>
              <p className="mt-1.5 text-[11px] text-gray-500">Shared workspaces only · personal directories and mailboxes are never scanned.</p>
            </div>

            {/* Section blueprint */}
            <div>
              <FieldLabel>Section blueprint</FieldLabel>
              <SelectField value={blueprint} onChange={setBlueprint} icon={FileText}
                options={["Engineering (default)", "Sales", "People Operations", "Custom"]} />
            </div>

            {/* Question-queue tuning */}
            <div>
              <FieldLabel>Question queue</FieldLabel>
              <SelectField value={tuning} onChange={setTuning} icon={Sparkles}
                options={["Auto from knowledge gaps", "Manual only", "Auto + manual"]} />
            </div>

            {/* Focus note */}
            <div>
              <FieldLabel>Focus note · optional</FieldLabel>
              <textarea
                defaultValue="Probe deeply on the payment gateway timeout — recurring incident, no runbook. Also the Vendor XYZ renewal SLA terms."
                className="min-h-[64px] w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/15"
              />
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => go("prepare")}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
      >
        <Sparkles className="h-4 w-4" /> Start session
      </button>
    </div>
  );
}

function SeedRow({ label, detail, state }) {
  const icon = {
    pending: <span className="h-4 w-4 rounded-full border-2 border-gray-200" />,
    running: <span className="h-4 w-4 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />,
    done: <Check className="h-4 w-4 text-emerald-600" />,
    skip: <X className="h-4 w-4 text-gray-300" />,
  }[state];
  return (
    <div className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 ${state === "skip" ? "border-gray-100 bg-gray-50" : "border-gray-200 bg-white"}`}>
      <span className="shrink-0">{icon}</span>
      <div className="flex-1">
        <p className={`text-sm font-medium ${state === "skip" ? "text-gray-400" : "text-gray-800"}`}>{label}</p>
        {detail && <p className="text-xs text-gray-400">{detail}</p>}
      </div>
    </div>
  );
}

function CommandView({ go, setMinhLe }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    [1, 2, 3, 4].forEach((n) =>
      timers.current.push(setTimeout(() => setProgress(n), n * 850))
    );
    timers.current.push(setTimeout(() => setDone(true), 4 * 850 + 600));
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const layerState = (n) => (progress >= n ? "done" : progress === n - 1 ? "running" : "pending");

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <button onClick={() => go("dashboard")} className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" /> Back to handovers
      </button>

      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-3">
          <Avatar name="Minh Lê" className="h-11 w-11 text-sm" />
          <div>
            <p className="font-semibold text-gray-900">Minh Lê</p>
            <p className="text-sm text-gray-500">Senior Backend Engineer · Engineering · <span className="font-mono">SESS-ML-0427</span></p>
          </div>
        </div>
        <PhaseBar phase="prepare" />
      </div>

      <div className="mt-5 flex gap-6 border-b border-gray-200 text-sm">
        {["Overview", "Stages", "Data", "Audit", "Settings"].map((t, i) => (
          <span key={t} className={`-mb-px border-b-2 pb-2 ${i === 0 ? "border-violet-600 font-medium text-violet-700" : "border-transparent text-gray-400"}`}>{t}</span>
        ))}
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-600" />
          <h2 className="text-sm font-semibold text-gray-900">Gathering from Trello</h2>
        </div>
        <div className="space-y-2">
          <SeedRow label="Scanning active lists" detail="In Progress · Review · Done" state={layerState(1)} />
          {progress >= 1 && <SeedRow label="Backlog · To-Do" detail="skipped — not in scope" state="skip" />}
          <SeedRow label="Filtering by content depth" detail={progress >= 2 ? "kept 24 cards · skipped 11 thin cards" : "checking descriptions & comments"} state={layerState(2)} />
          <SeedRow label="Prioritizing labels" detail={progress >= 3 ? "Bug/Hotfix · Architecture · Core Feature" : "ranking by signal"} state={layerState(3)} />
          <SeedRow label="Sensitive-content check" detail={progress >= 4 ? "contact details redacted · comments neutralized · cleared" : "redacting & neutralizing"} state={layerState(4)} />
        </div>

        {progress >= 3 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["Bug/Hotfix", "Architecture", "Core Feature"].map((l) => (
              <span key={l} className="rounded-md bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">{l}</span>
            ))}
          </div>
        )}
      </div>

      {done && (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <p className="text-sm font-medium text-gray-900">Draft bundle assembled</p>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Auto-derived <span className="font-mono font-semibold text-gray-900">24</span> items from Trello ·{" "}
              <span className="inline-flex items-center gap-1 rounded bg-yellow-50 px-1.5 py-0.5 font-mono text-yellow-800"><AlertTriangle className="h-3 w-3" />6 knowledge gaps</span> remain.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-violet-600" />
              <p className="text-sm font-medium text-gray-900">Who should we ask?</p>
              <span className="text-xs text-gray-400">· within your access scope</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">Auto-derived from Minh Lê's collaboration network.</p>
            <div className="mt-3 space-y-2">
              {[
                { n: "Duy Nguyễn", r: "Data Platform" },
                { n: "Hà Vy", r: "Engineering Manager" },
              ].map((p) => (
                <label key={p.n} className="flex items-center gap-3 rounded-lg border border-gray-200 p-2.5">
                  <input type="checkbox" defaultChecked className="h-4 w-4 accent-violet-600" />
                  <Avatar name={p.n} className="h-8 w-8 text-xs" />
                  <span className="text-sm text-gray-700">{p.n} <span className="text-gray-400">· {p.r}</span></span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={() => { setMinhLe("capture"); go("capture"); }}
            className="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          >
            Move to Capture
          </button>
        </div>
      )}
    </div>
  );
}

function CaptureHandoff({ go, restart }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-3">
          <Avatar name="Minh Lê" className="h-11 w-11 text-sm" />
          <div>
            <p className="font-semibold text-gray-900">Minh Lê</p>
            <p className="text-sm text-gray-500">Session moved to Capture</p>
          </div>
        </div>
        <PhaseBar phase="capture" />
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <FileText className="h-5 w-5 shrink-0 text-violet-600" />
          <p className="text-sm text-gray-700">Question queue ready for Minh Lê — <span className="font-mono font-semibold">6</span> questions targeting the open gaps.</p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <Users className="h-5 w-5 shrink-0 text-violet-600" />
          <p className="text-sm text-gray-700">Contributors notified — Duy Nguyễn, Hà Vy.</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-violet-200 bg-violet-50/40 p-4 text-center">
        <p className="text-sm font-medium text-violet-700">End of Module 1 — Handover Initiation</p>
        <p className="mt-1 text-xs text-gray-500">Module 2 (Knowledge Capture) begins from this Capture state.</p>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button onClick={() => go("dashboard")} className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300">
          Back to handovers
        </button>
        <button onClick={restart} className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-violet-600 hover:text-violet-700">
          <RotateCcw className="h-4 w-4" /> Restart walkthrough
        </button>
      </div>
    </div>
  );
}

/* ---------------- Shell ---------------- */

export default function M1HandoverInitiation({ embedded = false } = {}) {
  const [screen, setScreen] = useState("dashboard");
  const [minhLe, setMinhLe] = useState(null);

  const go = (s) => {
    if (s === "prepare" && !minhLe) setMinhLe("prepare");
    setScreen(s);
  };
  const restart = () => { setMinhLe(null); setScreen("dashboard"); };

  const Content = (
    <>
      {screen === "dashboard" && <Dashboard go={go} minhLeState={minhLe} />}
      {screen === "initiate" && <QuickInitiate go={go} />}
      {screen === "prepare" && <CommandView key="cv" go={go} setMinhLe={setMinhLe} />}
      {screen === "capture" && <CaptureHandoff go={go} restart={restart} />}
    </>
  );

  if (embedded) return <div className="min-h-screen bg-gray-50 font-sans text-gray-900">{Content}</div>;

  const nav = [
    { icon: Home, label: "Handovers", active: true },
    { icon: FolderKanban, label: "Sessions" },
    { icon: Network, label: "Knowledge graph" },
    { icon: SettingsIcon, label: "Settings" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      <aside className="hidden w-56 shrink-0 border-r border-gray-200 bg-white px-3 py-5 sm:block">
        <div className="mb-6 flex items-center gap-2 px-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-xs font-bold text-white">AE</div>
          <span className="font-semibold">ART-EEP</span>
        </div>
        <nav className="space-y-1">
          {nav.map((n) => (
            <div key={n.label} className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm ${n.active ? "bg-violet-50 font-medium text-violet-700" : "text-gray-500"}`}>
              <n.icon className="h-4 w-4" /> {n.label}
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Handovers</span>
            {screen !== "dashboard" && <><ChevronRight className="h-3.5 w-3.5" /><span className="text-gray-700">{screen === "initiate" ? "Initiate" : "Minh Lê"}</span></>}
          </div>
          <div className="flex items-center gap-3">
            <Search className="h-4 w-4 text-gray-400" />
            <Bell className="h-4 w-4 text-gray-400" />
            <div className="flex items-center gap-2">
              <Avatar name="Hà Vy" className="h-7 w-7 text-xs" />
              <span className="hidden text-sm font-medium md:inline">Hà Vy</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto">{Content}</main>
      </div>
    </div>
  );
}
