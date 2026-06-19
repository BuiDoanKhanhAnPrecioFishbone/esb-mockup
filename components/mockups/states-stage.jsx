"use client";
import React, { useState } from "react";
import {
  ROLES,
  STEPS,
  TABS,
  FLOWS,
  DASHBOARD_STATES,
  tabVisibility,
  sessionUrl,
  dashboardUrl,
} from "@/lib/view-matrix";

/* /states — designer preview stage. Matrix-only as of CL-129+.
   Every flow gets its own section with whatever matrix it has:
   · session  = role × step grid (per-section tab selector)
   · dashboard = 3-row role × state grid (DASHBOARD_STATES)
   · other    = flat row of state thumbnails
   Sidebar is an anchor-link TOC. Single mode removed. */

const GROUPS = [
  { id: "workspace", label: "Workspace" },
  { id: "session", label: "Session lifecycle" },
  { id: "spec", label: "Spec traces" },
];

// Thumbnail dimensions + virtual viewport the iframe scales from.
const W = 232;
const H = 146;
const VW = 1280;
const VH = 800;

export default function StatesStage() {
  const [tab, setTab] = useState("overview");

  return (
    <div
      className="min-h-screen flex flex-col bg-gray-900 text-gray-100"
      style={{
        fontFamily: 'ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif',
      }}
    >
      <header className="flex items-center gap-3 px-4 h-12 bg-gray-900 border-b border-gray-700 shrink-0">
        <span
          className="text-[10px] tracking-[0.16em] font-semibold text-gray-400"
          style={{ fontFamily: "ui-monospace,Menlo,monospace" }}
        >
          PREVIEW STAGE
        </span>
        <span className="text-gray-600">·</span>
        <span className="text-[12px] text-gray-300">All states</span>
        <div className="flex-1" />
        <span
          className="text-[10px] text-gray-500"
          style={{ fontFamily: "ui-monospace,Menlo,monospace" }}
        >
          click a thumbnail to open in a new tab
        </span>
      </header>

      <div className="flex-1 flex min-h-0">
        <Sidebar />
        <main className="flex-1 min-w-0 bg-gray-800 overflow-auto p-5 space-y-10">
          {GROUPS.map((g) => (
            <GroupBlock key={g.id} group={g} tab={tab} setTab={setTab} />
          ))}
        </main>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="w-60 shrink-0 bg-gray-900 border-r border-gray-700 overflow-y-auto p-3">
      {GROUPS.map((g) => {
        const flows = FLOWS.filter((f) => f.group === g.id);
        if (!flows.length) return null;
        return (
          <div key={g.id} className="mb-4">
            <p
              className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold px-1 mb-1.5"
              style={{ fontFamily: "ui-monospace,Menlo,monospace" }}
            >
              {g.label}
            </p>
            {flows.map((f) => (
              <a
                key={f.id}
                href={`#flow-${f.id}`}
                className="block w-full text-left px-2 py-1.5 rounded-md text-[12px] mb-0.5 text-gray-300 hover:bg-gray-800 border border-transparent hover:border-gray-700"
              >
                {f.label}
                <span className="block text-[9px] text-gray-500 mt-0.5">
                  {flowStateCount(f)}
                </span>
              </a>
            ))}
          </div>
        );
      })}
    </aside>
  );
}

function flowStateCount(flow) {
  if (flow.matrix === "session")
    return `${ROLES.length}×${STEPS.length} per tab`;
  if (flow.matrix === "dashboard") {
    const total = Object.values(DASHBOARD_STATES).reduce(
      (acc, arr) => acc + arr.length,
      0
    );
    return `${total} role×state combos`;
  }
  const n = (flow.states || []).length || 1;
  return `${n} state${n > 1 ? "s" : ""}`;
}

function GroupBlock({ group, tab, setTab }) {
  const flows = FLOWS.filter((f) => f.group === group.id);
  if (!flows.length) return null;
  return (
    <section>
      <h2
        className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold mb-3"
        style={{ fontFamily: "ui-monospace,Menlo,monospace" }}
      >
        {group.label}
      </h2>
      <div className="space-y-6">
        {flows.map((f) => (
          <FlowBlock key={f.id} flow={f} tab={tab} setTab={setTab} />
        ))}
      </div>
    </section>
  );
}

function FlowBlock({ flow, tab, setTab }) {
  return (
    <article
      id={`flow-${flow.id}`}
      className="rounded-lg bg-gray-900/40 border border-gray-700 p-4"
      style={{ scrollMarginTop: 64 }}
    >
      <header className="flex items-center gap-3 mb-3">
        <h3 className="text-[13px] font-medium text-gray-100">{flow.label}</h3>
        <span
          className="text-[10px] text-gray-500"
          style={{ fontFamily: "ui-monospace,Menlo,monospace" }}
        >
          {flow.route}
        </span>
        <div className="flex-1" />
        {flow.matrix === "session" && (
          <TabSelector value={tab} onChange={setTab} />
        )}
      </header>
      <FlowMatrix flow={flow} tab={tab} />
    </article>
  );
}

function TabSelector({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      <span
        className="text-[10px] text-gray-500 mr-1"
        style={{ fontFamily: "ui-monospace,Menlo,monospace" }}
      >
        tab
      </span>
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`h-7 px-2 rounded-md text-[11px] border ${
            value === t.id
              ? "bg-violet-600 text-white border-violet-600"
              : "bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-500"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function FlowMatrix({ flow, tab }) {
  if (flow.matrix === "session") return <SessionMatrix tab={tab} />;
  if (flow.matrix === "dashboard") return <DashboardMatrix />;
  return <FlatStates flow={flow} />;
}

function SessionMatrix({ tab }) {
  return (
    <div className="overflow-x-auto">
      <div
        className="inline-grid gap-2"
        style={{ gridTemplateColumns: `80px repeat(${STEPS.length}, ${W}px)` }}
      >
        <span />
        {STEPS.map((s, i) => (
          <div
            key={s.id}
            className="text-[10px] text-gray-400 px-1 self-end pb-1"
          >
            {i + 1}. {s.label}
          </div>
        ))}
        {ROLES.map((r) => (
          <React.Fragment key={r.id}>
            <div className="text-[11px] text-gray-300 flex items-center">
              {r.label}
            </div>
            {STEPS.map((s) => {
              const v = tabVisibility(r.id, s.id, tab);
              const cellTab = v === "visible" ? tab : "overview";
              return (
                <ThumbLink
                  key={r.id + s.id}
                  href={sessionUrl(r.id, s.id, cellTab)}
                  title={`${r.label} · ${s.label}`}
                  badge={v !== "visible" ? `tab ${v}` : null}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function DashboardMatrix() {
  const maxCols = Math.max(
    ...ROLES.map((r) => (DASHBOARD_STATES[r.id] || []).length)
  );
  return (
    <div className="overflow-x-auto">
      <div
        className="inline-grid gap-2"
        style={{ gridTemplateColumns: `80px repeat(${maxCols}, ${W}px)` }}
      >
        {ROLES.map((r) => {
          const states = DASHBOARD_STATES[r.id] || [];
          const pad = maxCols - states.length;
          return (
            <React.Fragment key={r.id}>
              <div className="text-[11px] text-gray-300 flex items-center">
                {r.label}
              </div>
              {states.map((s) => (
                <LabeledThumb
                  key={s.id}
                  href={dashboardUrl(r.id, s.id)}
                  title={`${r.label} · ${s.label}`}
                  label={s.label}
                />
              ))}
              {Array.from({ length: pad }).map((_, i) => (
                <div key={`pad-${r.id}-${i}`} />
              ))}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function FlatStates({ flow }) {
  const states =
    flow.states && flow.states.length
      ? flow.states
      : [{ id: "default", label: "Default" }];
  return (
    <div className="flex flex-wrap gap-3">
      {states.map((s) => (
        <LabeledThumb
          key={s.id}
          href={flow.route + (s.query || "")}
          title={s.label}
          label={s.label}
        />
      ))}
    </div>
  );
}

function LabeledThumb({ href, title, label }) {
  return (
    <div>
      <ThumbLink href={href} title={title} />
      <p
        className="text-[10px] text-gray-400 mt-1 truncate"
        style={{
          maxWidth: W,
          fontFamily: "ui-monospace,Menlo,monospace",
        }}
      >
        {label}
      </p>
    </div>
  );
}

function ThumbLink({ href, title, badge }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group block text-left"
      title={title}
    >
      <div className="relative">
        <Thumb src={href} />
        {badge && (
          <div className="absolute top-1 right-1 text-[8px] px-1 py-0.5 rounded bg-gray-900/80 text-gray-300 border border-gray-600">
            {badge}
          </div>
        )}
        <div className="absolute inset-0 rounded-md group-hover:ring-2 group-hover:ring-violet-500" />
      </div>
    </a>
  );
}

function Thumb({ src }) {
  const scale = Math.min(W / VW, H / VH);
  return (
    <div
      className="relative bg-white rounded-md overflow-hidden border border-gray-700"
      style={{ width: W, height: H }}
    >
      <iframe
        src={src}
        title={src}
        loading="lazy"
        tabIndex={-1}
        scrolling="no"
        className="absolute top-0 left-0 origin-top-left border-0 pointer-events-none"
        style={{ width: VW, height: VH, transform: `scale(${scale})` }}
      />
    </div>
  );
}
