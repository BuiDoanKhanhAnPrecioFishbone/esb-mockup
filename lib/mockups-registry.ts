import type { ComponentType } from "react";

import HaVyHandoverDashboard from "@/components/mockups/ha-vy-handover-dashboard.jsx";
import UcHo01QuickInitiate from "@/components/mockups/uc-ho-01-quick-initiate.jsx";
import SessionCommandView from "@/components/mockups/session-command-view.jsx";
import UcHo01NormalFlow from "@/components/mockups/uc-ho-01-normal-flow.jsx";
import UcHo01EdgeCases from "@/components/mockups/uc-ho-01-edge-cases.jsx";
import UcHo02InterviewCanvas from "@/components/mockups/uc-ho-02-interview-canvas.jsx";

export type MockupEntry = {
  /** URL slug — used at `/m/<slug>`. Lowercase-kebab. */
  slug: string;
  /** Short title shown on the index card and in mockup chrome. */
  title: string;
  /** One-sentence description for the index card. */
  description: string;
  /** Sprint tag, e.g. "S1", "SZ", "S2". Optional. */
  sprint?: string;
  /** Personas featured in the mockup. Optional. */
  personas?: string[];
  /** Use case IDs covered, e.g. ["UC-HO-01"]. Optional. */
  useCases?: string[];
  /** Free-form tags for filtering. Optional. */
  tags?: string[];
  /** The React component to render. */
  Component: ComponentType;
  /** Optional ordered flow for Prev/Next chrome. */
  flow?: { id: string; label: string; steps: string[] };
};

/* ─────────────────────────────────────────────────────────────
   Registry · 6 active mockups across two architectural planes.

   ┌─────────────────────────────────────────────────────────┐
   │  S1 · MANAGEMENT PLANE · Hà Vy + HR Admin              │
   │   · ha-vy-handover-dashboard                            │
   │   · uc-ho-01-quick-initiate                             │
   │   · session-command-view                                │
   │   · uc-ho-01-normal-flow      (spec-trace · 8 states)   │
   │   · uc-ho-01-edge-cases       (spec-trace · 10 states)  │
   ├─────────────────────────────────────────────────────────┤
   │  S2 · CAPTURE PLANE · Offboarder · isolated shell       │
   │   · uc-ho-02-interview-canvas (focus surface · 8 states)│
   └─────────────────────────────────────────────────────────┘

   The Capture plane is architecturally isolated from the
   Management plane (CL-090 · Offboarder shell separation).
   The Offboarder never sees session-management chrome, the
   Manager never types answers on the Offboarder's behalf.

   Prior registry content recoverable from git at SHA
   71e19d4fd157a4b1aae11974fe00bf18e887b91c (17 hidden mockups).
   ───────────────────────────────────────────────────────────── */

export const mockups: MockupEntry[] = [
  /* ─── S1 · Management plane · feature surfaces ─── */
  {
    slug: "ha-vy-handover-dashboard",
    title: "Hà Vy's handover dashboard — multi-session, 3-phase",
    description:
      "Manager command center · multi-session glance with 3-phase progress (Prepare · Capture · Deliver) per row. Approved shared workspaces only — Jira · GitHub · Drive shared (no email). Session cards navigate to /session/[id] · the side drawer is gone. 2 screens: active dashboard (3 sessions, different phases) and just-completed celebration.",
    sprint: "S1",
    personas: ["Hà Vy", "Minh Lê", "Khánh Linh Trần", "Phương Anh Nguyễn", "Trần Hữu Nam"],
    useCases: ["UC-HO-01", "UC-HO-02", "UC-HO-03", "UC-HO-04"],
    tags: ["s1", "dashboard", "3-phase", "command-center", "current"],
    Component: HaVyHandoverDashboard,
  },
  {
    slug: "uc-ho-01-quick-initiate",
    title: "UC-HO-01 · Quick initiate — one-click session creation",
    description:
      "Streamlined initiation page · replaces the multi-step wizard per UX feedback. Single page · HR-pre-filled defaults · one primary 'Start session' CTA · customization hidden behind a progressive-disclosure expander. 2 screens: default ready + customize expanded. Sources are GitHub + Jira + Drive shared (no email).",
    sprint: "S1",
    personas: ["Hà Vy", "Minh Lê", "Trần Hữu Nam"],
    useCases: ["UC-HO-01"],
    tags: ["s1", "initiation", "one-click", "current"],
    Component: UcHo01QuickInitiate,
  },
  {
    slug: "session-command-view",
    title: "Session command view — full-screen per-session workspace",
    description:
      "Dedicated route at /session/[id] · replaces the 480px side drawer with a tabbed full-screen view (Overview · Stages · Data · Audit · Settings). Hero shows 3-phase progress bar with the current sub-stage. 3 screens: Minh Lê mid-seeding (Overview), Minh Lê full 3-phase / 8-sub-stage timeline (Stages), Phương Anh awaiting transcript review (Overview).",
    sprint: "S1",
    personas: ["Hà Vy", "Minh Lê", "Phương Anh Nguyễn", "Trần Hữu Nam"],
    useCases: ["UC-HO-01", "UC-HO-02", "UC-HO-03", "UC-HO-04"],
    tags: ["s1", "session-detail", "tabbed", "command-view", "3-phase", "current"],
    Component: SessionCommandView,
  },

  /* ─── S1 · Management plane · spec-trace walkthroughs ─── */
  {
    slug: "uc-ho-01-normal-flow",
    title: "UC-HO-01 · Normal flow — 8-state walkthrough",
    description:
      "Clickable 8-state walkthrough of the complete UC-HO-01 v2.1 happy path · dashboard entry → quick-initiate (default + customize) → command-view through Phase 1 sub-stages (start → mid-seeding → Knowledge Map ready → Next Actions) → dashboard refreshed at Phase 2. Prev/Next chrome with state selector. Built on the same primitives as the feature surfaces for 1:1 comparison.",
    sprint: "S1",
    personas: ["Hà Vy", "Minh Lê", "Khánh Linh Trần", "Phương Anh Nguyễn", "Trần Hữu Nam"],
    useCases: ["UC-HO-01"],
    tags: ["s1", "flow", "normal-course", "spec-trace", "current", "comprehensive"],
    Component: UcHo01NormalFlow,
  },
  {
    slug: "uc-ho-01-edge-cases",
    title: "UC-HO-01 · Edge cases — E1 through E10",
    description:
      "Clickable 10-state coverage of every edge case in UC-HO-01 v2.1 · profile not provisioned (E1) · RBAC unresolvable (E2) · source seeding failure (E3) · classification service paused (E4) · manual initiation (E5) · customize expander (E6) · no integrated sources (E7) · urgent <3 days (E8) · >30% sensitivity exclusion (E9) · paused page (E10). Chrome accent changes per edge-case kind (rose for blocks, yellow for partial/pause, violet for alt, gray for idle).",
    sprint: "S1",
    personas: ["Hà Vy", "Minh Lê", "Khánh Linh Trần", "Phương Anh Nguyễn", "Hoàng Anh Lê"],
    useCases: ["UC-HO-01"],
    tags: ["s1", "flow", "edge-cases", "spec-trace", "current", "comprehensive"],
    Component: UcHo01EdgeCases,
  },

  /* ─── S2 · Capture plane · Offboarder focus surface ─── */
  {
    slug: "uc-ho-02-interview-canvas",
    title: "UC-HO-02 · Interview canvas — Offboarder focus surface",
    description:
      "The Offboarder's dedicated voice-interview workspace · architecturally isolated from the Management plane · OffboarderShell with zero sidebar / zero session enumeration. 8 clickable states walking the full focus-mode lifecycle: first question · mid-recording (CL-009 rose triple-pulse) · Manager Priority Prompt inline · live transcript drawer expanded · paused with checkpoint · 5-minute soft warning · final question · saving + transitioning to review. The first Sprint 2 surface · isolates Capture from Management per CL-090.",
    sprint: "S2",
    personas: ["Minh Lê", "Hà Vy", "Trần Hữu Nam"],
    useCases: ["UC-HO-02"],
    tags: ["s2", "capture", "offboarder", "focus-mode", "interview", "current"],
    Component: UcHo02InterviewCanvas,
  },
];

export function findMockup(slug: string): MockupEntry | undefined {
  return mockups.find((m) => m.slug === slug);
}

export function mockupsBySprint(): Record<string, MockupEntry[]> {
  const grouped: Record<string, MockupEntry[]> = {};
  for (const m of mockups) {
    const key = m.sprint ?? "Unsorted";
    (grouped[key] ??= []).push(m);
  }
  return grouped;
}
