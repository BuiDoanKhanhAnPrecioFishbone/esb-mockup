import type { ComponentType } from "react";

import SystemUiTour from "@/components/mockups/system-ui-tour.jsx";
import S0ComponentLibrary from "@/components/mockups/s0-component-library.jsx";
import S1HandoverInitiationV2 from "@/components/mockups/s1-handover-initiation-v2.jsx";
import S1HandoverInitiation from "@/components/mockups/s1-handover-initiation.jsx";
import S2CaptureVerify from "@/components/mockups/s2-capture-verify.jsx";
import S3KgCommit from "@/components/mockups/s3-kg-commit.jsx";
import S4OnboardingGenRead from "@/components/mockups/s4-onboarding-gen-read.jsx";
import TransactionalGateways from "@/components/mockups/transactional-gateways.jsx";
import Dashboard from "@/components/mockups/dashboard.jsx";
import DashboardLight from "@/components/mockups/dashboard-light.jsx";
import Prototype from "@/components/mockups/prototype.jsx";
import HackathonDemo from "@/components/mockups/hackathon-demo.jsx";

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

export const mockups: MockupEntry[] = [
  {
    slug: "system-ui-tour",
    title: "System UI Tour — canonical demo",
    description:
      "Single navigable artifact covering all 8 features × 3-4 states. Violet/yellow palette, QA-INT-01 fixes integrated. Start here.",
    sprint: "S6",
    personas: ["Hà Vy", "Minh Lê", "Trần Hữu Nam", "Khánh Linh", "Phương Anh", "An Quân"],
    useCases: ["UC-HO-01", "UC-HO-02", "UC-HO-03", "UC-HO-04", "UC-HO-06", "UC-HO-07", "UC-ON-01", "UC-ON-02"],
    tags: ["canonical", "demo", "tour"],
    Component: SystemUiTour,
  },
  {
    slug: "s0-component-library",
    title: "S0 — Component library",
    description:
      "Shared design tokens and the 7 canonical components: Provenance Chip, Severity/Confidence/Status Badges, Mask Card, Section Card, Audit Log Tile.",
    sprint: "S0",
    useCases: [],
    tags: ["foundation", "components", "tokens"],
    Component: S0ComponentLibrary,
  },
  {
    slug: "transactional-gateways",
    title: "Step Zero — Transactional Gateways",
    description:
      "Specialized SZ artifact: Ontology Mapping, Seeding Progress, Glass-Box Editor. Vietnamese UI (CL-077 deviation) with 3-category entity badges.",
    sprint: "SZ",
    personas: ["An Quân Vũ"],
    useCases: ["Z01", "Z02", "Z03", "Z04"],
    tags: ["step-zero", "vietnamese", "specialized"],
    Component: TransactionalGateways,
  },
  {
    slug: "s1-handover-initiation-v2",
    title: "S1 — Handover Initiation (v2)",
    description:
      "Canonical S1 with violet/yellow palette. 5 screens covering the 3-persona dashboard, wizard, seeding, mapping, and prompts.",
    sprint: "S1",
    personas: ["Hà Vy", "Minh Lê"],
    useCases: ["UC-HO-01", "UC-HO-05"],
    tags: ["canonical", "v2"],
    Component: S1HandoverInitiationV2,
  },
  {
    slug: "s1-handover-initiation",
    title: "S1 — Handover Initiation (v1, superseded)",
    description:
      "Original S1 with the old amber palette. Kept for comparison. Use v2 for current work.",
    sprint: "S1",
    personas: ["Hà Vy", "Minh Lê"],
    useCases: ["UC-HO-01", "UC-HO-05"],
    tags: ["superseded", "v1", "amber"],
    Component: S1HandoverInitiation,
  },
  {
    slug: "s2-capture-verify",
    title: "S2 — Capture & Verify",
    description:
      "5 Offboarder screens: briefing, live voice interview (rose pulsing rings), text mode, review workspace, sign. Old amber — needs migration.",
    sprint: "S2",
    personas: ["Minh Lê"],
    useCases: ["UC-HO-02", "UC-HO-03"],
    tags: ["needs-migration", "amber"],
    Component: S2CaptureVerify,
  },
  {
    slug: "s3-kg-commit",
    title: "S3 — KG Commit",
    description:
      "Manager Completion Report in 4 states: indexing, completed, low-confidence, partial commit. Old amber — needs migration.",
    sprint: "S3",
    personas: ["Hà Vy"],
    useCases: ["UC-HO-04"],
    tags: ["needs-migration", "amber"],
    Component: S3KgCommit,
  },
  {
    slug: "s4-onboarding-gen-read",
    title: "S4 — Onboarding Generate & Read",
    description:
      "5 Onboarder screens: playbook builder, generation, dashboard, reading view with Persistent Copilot Bar, full graph. Old amber — needs migration.",
    sprint: "S4",
    personas: ["Trần Hữu Nam"],
    useCases: ["UC-ON-01", "UC-ON-02"],
    tags: ["needs-migration", "amber"],
    Component: S4OnboardingGenRead,
  },
  {
    slug: "dashboard",
    title: "Dashboard exploration",
    description:
      "Earlier dashboard exploration with full activity feed and side panels.",
    sprint: "Demos",
    tags: ["exploration"],
    Component: Dashboard,
  },
  {
    slug: "dashboard-light",
    title: "Dashboard exploration (light)",
    description: "Lighter-weight variant of the dashboard exploration.",
    sprint: "Demos",
    tags: ["exploration"],
    Component: DashboardLight,
  },
  {
    slug: "prototype",
    title: "Prototype — multi-state walkthrough",
    description:
      "Early prototype covering Cold Start → Happy Path → RBAC → Voice Interview → Skill Gap → Diff Review.",
    sprint: "Demos",
    tags: ["prototype", "walkthrough"],
    Component: Prototype,
  },
  {
    slug: "hackathon-demo",
    title: "Hackathon demo — extended walkthrough",
    description:
      "Extended hackathon prototype with additional states and polish over the base prototype.",
    sprint: "Demos",
    tags: ["prototype", "hackathon"],
    Component: HackathonDemo,
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
