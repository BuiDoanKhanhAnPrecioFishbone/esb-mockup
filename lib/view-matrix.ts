// lib/view-matrix.ts
// Single source of truth for the ART-EEP mockup's surfaces and their states.
//
// Purpose:
//   1. Drive the Design States stage at /states (the team's quick flow/role check).
//   2. Serve as the enumerable, declarative INPUT for design generation
//      (e.g. prototype-to-figma). Read this file to know every flow the web app
//      has and every notable state within it — no need to trace conditional JSX.
//   3. Drive runtime access control for the global "View as" switcher (which
//      routes each role may see, and where to send them when one is blocked).
//   4. Drive the global "State" switcher (which cases of the current view a
//      viewer can flip through, and the default to land on).

// Keep this in sync whenever a surface or its states change.

export type Visibility = "visible" | "disabled" | "hidden";

export interface RoleDef {
  id: string;
  label: string;
  sub: string;
  initials: string;
}
export interface StepDef {
  id: string;
  label: string;
}
export interface TabDef {
  id: string;
  label: string;
}

// The live mockup ships 3 roles. "Coworker" is one role (Stakeholder is the
// deprecated name). If RBAC later splits a distinct 4th seat, add it here and
// the matrix expands automatically.
export const ROLES: RoleDef[] = [
  { id: "manager", label: "Hà Vy", sub: "Manager / HR", initials: "HV" },
  { id: "offboarder", label: "Minh Lê", sub: "Offboarder", initials: "ML" },
  { id: "coworker", label: "Coworker", sub: "Project peer", initials: "CW" },
];

export const STEPS: StepDef[] = [
  { id: "collecting", label: "Collecting data" },
  { id: "ready", label: "Ready for review" },
  { id: "capture", label: "Capture (active)" },
  { id: "deliver", label: "Deliver (review)" },
  { id: "complete", label: "Complete" },
];

export const TABS: TabDef[] = [
  { id: "overview", label: "Overview" },
  { id: "data", label: "Data" },
  { id: "logs", label: "Logs" },
];

// Phase derived from step (matches session-command-view).
export function phaseOf(step: string): "prepare" | "capture" | "deliver" {
  if (step === "capture") return "capture";
  if (step === "deliver" || step === "complete") return "deliver";
  return "prepare";
}

// Tab visibility per role × step. This is the declarative version of the logic
// currently inlined in session-command-view.jsx — both should reconcile here.
export function tabVisibility(
  role: string,
  step: string,
  tab: string
): Visibility {
  const phase = phaseOf(step);
  if (tab === "logs" && role === "coworker") return "hidden";
  if (tab === "data" && role === "offboarder" && phase === "prepare")
    return "disabled";
  return "visible";
}

// Fully enumerated session matrix: role × step × tab → visibility.
export const SESSION_MATRIX = ROLES.flatMap((r) =>
  STEPS.map((s) => ({
    role: r.id,
    step: s.id,
    tabs: TABS.map((t) => ({
      tab: t.id,
      visibility: tabVisibility(r.id, s.id, t.id),
    })),
  }))
);

// --- App-wide flow registry: every flow the web app has --------------------

export interface FlowState {
  id: string;
  label: string;
  query?: string; // appended to route to reach this state
}
export interface Flow {
  id: string;
  label: string;
  route: string;
  group: "workspace" | "session" | "spec";
  // "session" → role × step × tab matrix (sessionUrl).
  // "dashboard" → role × DASHBOARD_STATES[role] matrix (dashboardUrl).
  // otherwise → flat list of states.
  matrix?: "session" | "dashboard";
  states?: FlowState[];
}

export const FLOWS: Flow[] = [
  {
    id: "dashboard",
    label: "Handover dashboard",
    route: "/",
    group: "workspace",
    matrix: "dashboard",
    states: [{ id: "default", label: "Active sessions" }],
  },
  {
    id: "all-sessions",
    label: "All sessions",
    route: "/sessions",
    group: "workspace",
    states: [{ id: "default", label: "List" }],
  },
  {
    id: "quick-initiate",
    label: "Quick initiate",
    route: "/session/new",
    group: "workspace",
    states: [
      { id: "default", label: "One-click" },
      { id: "customize", label: "Customize", query: "?customize=1" },
    ],
  },
  {
    id: "prepare",
    label: "Prepare stage",
    route: "/prepare/minh-le",
    group: "session",
    states: [{ id: "default", label: "Automated cascade" }],
  },
  {
    id: "session",
    label: "Session command view",
    route: "/session/minh-le",
    group: "session",
    matrix: "session",
  },
  {
    id: "knowledge-graph",
    label: "Knowledge graph explorer",
    route: "/knowledge-graph",
    group: "workspace",
    states: [
      { id: "default", label: "Explorer" },
      { id: "from-session", label: "From session", query: "?prompt=minh-le" },
    ],
  },
  {
    id: "settings",
    label: "Settings · connectors",
    route: "/settings",
    group: "workspace",
    states: [{ id: "default", label: "Connectors" }],
  },
  {
    id: "spec-normal",
    label: "UC-HO-01 normal flow",
    route: "/spec/uc-ho-01/normal",
    group: "spec",
    states: [{ id: "default", label: "8-state walkthrough" }],
  },
  {
    id: "spec-edges",
    label: "UC-HO-01 edge cases",
    route: "/spec/uc-ho-01/edges",
    group: "spec",
    states: [{ id: "default", label: "10-state walkthrough" }],
  },
];

// Clean-product URL for a session state (consumed by the stage; activated by
// the session-command-view clean-product-mode edit).
export function sessionUrl(role: string, step: string, tab: string): string {
  return `/session/minh-le?role=${role}&step=${step}&tab=${tab}`;
}

// Clean-product URL for a dashboard role × state cell. Mirrors sessionUrl;
// app/page.tsx reads ?role= and ?state= and pins the dashboard to that cell.
export function dashboardUrl(role: string, state?: string): string {
  const params = new URLSearchParams();
  params.set("role", role);
  if (state) params.set("state", state);
  return `/?${params.toString()}`;
}

// --- Runtime access control for the global "View as" switcher --------------
// Most routes are open to all roles (rendering per-role where the surface
// differs). A few are gated. Switching to a role that can't see the current
// route redirects to that role's default route (all "/" for now).
export const ROUTE_GATES: { prefix: string; roles: string[] }[] = [
  { prefix: "/settings", roles: ["manager"] },
  { prefix: "/prepare", roles: ["manager"] },
];

export function isRouteAllowed(role: string, pathname: string): boolean {
  const gate = ROUTE_GATES.find((g) => pathname.startsWith(g.prefix));
  return gate ? gate.roles.includes(role) : true;
}

export function defaultRoute(_role: string): string {
  return "/";
}

// --- Runtime state control for the global "State" switcher ------------------
// Lets a viewer flip the CURRENT surface through its cases without leaving it.
// Session detail = the 5 lifecycle steps. Dashboard = the current role's flow.
// Every other route is single-state, so the switcher hides itself there.

export const DASHBOARD_STATES: Record<string, FlowState[]> = {
  manager: [
    { id: "departures", label: "Departures pending" },
    { id: "active", label: "Active sessions" },
    { id: "completed", label: "Session completed" },
  ],
  offboarder: [
    { id: "not-started", label: "Not started" },
    { id: "active-queue", label: "Active queue" },
    { id: "all-answered", label: "All answered" },
    { id: "complete", label: "Complete" },
  ],
  coworker: [
    { id: "active", label: "Active" },
    { id: "all-satisfied", label: "All satisfied" },
  ],
};

function isSessionDetail(pathname: string): boolean {
  return pathname.startsWith("/session/") && pathname !== "/session/new";
}

export function statesFor(pathname: string, role: string): FlowState[] {
  if (isSessionDetail(pathname))
    return STEPS.map((s) => ({ id: s.id, label: s.label }));
  if (pathname === "/") return DASHBOARD_STATES[role] ?? [];
  return [];
}

export function defaultStateFor(pathname: string, role: string): string {
  if (isSessionDetail(pathname)) return "capture";
  if (pathname === "/") return role === "offboarder" ? "active-queue" : "active";
  return "";
}
