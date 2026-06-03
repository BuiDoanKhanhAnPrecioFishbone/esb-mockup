import type { ComponentType } from "react";

import HaVyHandoverDashboard from "@/components/mockups/ha-vy-handover-dashboard.jsx";
import UcHo01QuickInitiate from "@/components/mockups/uc-ho-01-quick-initiate.jsx";
import SessionCommandView from "@/components/mockups/session-command-view.jsx";
import UcHo01NormalFlow from "@/components/mockups/uc-ho-01-normal-flow.jsx";
import UcHo01EdgeCases from "@/components/mockups/uc-ho-01-edge-cases.jsx";

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
   2026-06-03 · Sprint 1 registry · 5 active mockups

   The current definition is locked at:
     · 3-phase user-facing lifecycle (CL-088)
     · Approved shared workspaces only · no email (CL-087)
     · /session/[id] command-view route · no side drawer (CL-089)
     · One-click initiation · progressive-disclosure customize

   The three feature mockups (dashboard, quick-initiate, command-
   view) are the production-shaped surfaces. The two flow mockups
   (normal-flow, edge-cases) are the spec-trace overlays — each
   walks the complete UC-HO-01 v2.1 happy path or edge-case set
   as a clickable Prev/Next walkthrough, built on the same
   primitives so dev can compare 1:1.

   Previously-registered mockups are intentionally not imported
   here — JSX preserved in components/mockups/ for git history.
   Prior registry content is recoverable from git at SHA
   71e19d4fd157a4b1aae11974fe00bf18e887b91c.
   ───────────────────────────────────────────────────────────── */

export const mockups: MockupEntry[] = [
  /* ─── Feature surfaces ─── */
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

  /* ─── Spec-trace flow walkthroughs ─── */
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
