import type { ComponentType } from "react";

import HaVyHandoverDashboard from "@/components/mockups/ha-vy-handover-dashboard.jsx";
import UcHo01QuickInitiate from "@/components/mockups/uc-ho-01-quick-initiate.jsx";
import SessionCommandView from "@/components/mockups/session-command-view.jsx";

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
   2026-06-02 · registry stripped to the three S1 redesign mockups
   that embody the current definition · 3-phase lifecycle (CL-088),
   approved-shared-workspaces-only data ingestion (CL-087), and the
   command-view route replacing the side drawer (CL-089).

   Previously-registered mockups are intentionally not imported
   here — the JSX files remain in components/mockups/ for git-
   history reference but are unreachable via /m/[slug] until
   re-registered. Recoverable if needed:

     · system-ui-tour                    (S6 canonical demo)
     · s0-component-library              (S0 foundation)
     · transactional-gateways            (SZ specialized · Vietnamese)
     · uc-ho-01-normal-course            (superseded · pre-redesign wizard)
     · uc-ho-01-alternative-courses      (pre-redesign · AC.2 repurposed)
     · uc-ho-01-exceptions               (pre-redesign · email→GitHub swept)
     · uc-ho-05-configure-prompts-draft  (v0.1 DRAFT · pending BA review)
     · s1-handover-initiation-v2         (canonical S1 v2 · predates the trio)
     · s1-handover-initiation            (v1 amber · superseded)
     · s2-capture-verify                 (S2 · amber · needs migration)
     · s3-kg-commit                      (S3 · amber · needs migration)
     · s4-onboarding-gen-read            (S4 · amber · needs migration)
     · dashboard / dashboard-light       (early dashboard explorations)
     · prototype / hackathon-demo        (early walkthrough prototypes)

   To restore any of the above · add an import line and append the
   corresponding entry to the `mockups` array. Prior registry
   content is recoverable from git at SHA
   71e19d4fd157a4b1aae11974fe00bf18e887b91c.
   ───────────────────────────────────────────────────────────── */

export const mockups: MockupEntry[] = [
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
