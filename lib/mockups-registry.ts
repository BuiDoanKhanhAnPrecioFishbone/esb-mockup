import type { ComponentType } from "react";

import HaVyHandoverDashboard from "@/components/mockups/ha-vy-handover-dashboard.jsx";
import UcHo01QuickInitiate from "@/components/mockups/uc-ho-01-quick-initiate.jsx";
import SessionCommandView from "@/components/mockups/session-command-view.jsx";
import UcHo01NormalFlow from "@/components/mockups/uc-ho-01-normal-flow.jsx";
import UcHo01EdgeCases from "@/components/mockups/uc-ho-01-edge-cases.jsx";
import UcHo02InterviewCanvas from "@/components/mockups/uc-ho-02-interview-canvas.jsx";
import UcHo02CaptureQueue from "@/components/mockups/uc-ho-02-capture-queue.jsx";
import UcOn02ConsumerNewcomer from "@/components/mockups/uc-on-02-consumer-newcomer.jsx";
import UcOn02ConsumerColleague from "@/components/mockups/uc-on-02-consumer-colleague.jsx";
import UcOn02ConsumerManager from "@/components/mockups/uc-on-02-consumer-manager.jsx";

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
   Registry · 10 active mockups across three architectural planes.

   ┌─────────────────────────────────────────────────────────┐
   │  S1 · MANAGEMENT PLANE · Ha Vy + HR Admin              │
   │  ART-EEP violet/yellow visual system (snapshot §4)      │
   │   · ha-vy-handover-dashboard                            │
   │   · uc-ho-01-quick-initiate                             │
   │   · session-command-view                                │
   │   · uc-ho-01-normal-flow      (spec-trace · 8 states)   │
   │   · uc-ho-01-edge-cases       (spec-trace · 10 states)  │
   ├─────────────────────────────────────────────────────────┤
   │  S2 · CAPTURE PLANE · Offboarder                        │
   │  ART-EEP visual system · OffboarderShell isolation      │
   │   · uc-ho-02-capture-queue    (POC · 8 states · current)│
   │   · uc-ho-02-interview-canvas (Phase 2 reference)       │
   ├─────────────────────────────────────────────────────────┤
   │  S4 · CONSUMPTION PLANE · Knowledge Graph readers       │
   │  MASTER.md "AI-Native Minimal" indigo/glassmorphism     │
   │  per CL-096 (scoped) · semantic palette preserved as    │
   │  meaning layer · same GLOBAL graph, three RBAC lenses   │
   │   · uc-on-02-consumer-newcomer    (8 states · current)  │
   │   · uc-on-02-consumer-colleague   (8 states · current)  │
   │   · uc-on-02-consumer-manager     (8 states · current)  │
   └─────────────────────────────────────────────────────────┘

   POC Capture path · per CL-098/099/100/101:
     The voice interview (uc-ho-02-interview-canvas) is deferred
     to Phase 2 · retained as design reference only. The POC uses
     the text question queue + self-upload + UC-HO-08 network
     requests · all surfaced through uc-ho-02-capture-queue.

   The three Consumer mockups render the SAME global knowledge
   graph through three different RBAC lenses (CL-093 hybrid
   security tiering).

   Plane isolation invariants (CL-094 + CL-096 + CL-093):
   · Management uses AppShell · full sidebar · session enum
   · Capture uses OffboarderShell · zero sidebar · focus mode
   · Consumption uses ConsumerShell · floating navbar pattern ·
     split-pane reading + global graph + persistent Copilot

   Prior registry content recoverable from git at SHA
   71e19d4fd157a4b1aae11974fe00bf18e887b91c (17 hidden mockups).
   ───────────────────────────────────────────────────────────── */

export const mockups: MockupEntry[] = [
  /* ─── S1 · Management plane · feature surfaces ─── */
  {
    slug: "ha-vy-handover-dashboard",
    title: "Ha Vy's handover dashboard — multi-session, 3-phase",
    description:
      "Manager command center · multi-session glance with 3-phase progress (Prepare · Capture · Deliver) per row. Approved shared workspaces only — Jira · GitHub · Drive shared (no email). Session cards navigate to /session/[id] · the side drawer is gone. 2 screens: active dashboard (3 sessions, different phases) and just-completed celebration.",
    sprint: "S1",
    personas: ["Hà Vy", "Minh Lê", "Khánh Linh Trần", "Phương Anh Nguyễn", "Trần Hữu Nam"],
    useCases: ["UC-HO-01", "UC-HO-02", "UC-HO-03", "UC-HO-04"],
    tags: ["s1", "management", "dashboard", "3-phase", "command-center", "current"],
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
    tags: ["s1", "management", "initiation", "one-click", "current"],
    Component: UcHo01QuickInitiate,
  },
  {
    slug: "session-command-view",
    title: "Session command view — full-screen per-session workspace",
    description:
      "Dedicated route at /session/[id] · replaces the 480px side drawer with a tabbed full-screen view (Overview · Stages · Data · Audit · Settings). Hero shows 3-phase progress bar with the current sub-stage. 3 screens covering Minh Lê mid-seeding, full 3-phase/8-sub-stage timeline, and Phương Anh awaiting transcript review.",
    sprint: "S1",
    personas: ["Hà Vy", "Minh Lê", "Phương Anh Nguyễn", "Trần Hữu Nam"],
    useCases: ["UC-HO-01", "UC-HO-02", "UC-HO-03", "UC-HO-04"],
    tags: ["s1", "management", "session-detail", "tabbed", "command-view", "3-phase", "current"],
    Component: SessionCommandView,
  },

  /* ─── S1 · Management plane · spec-trace walkthroughs ─── */
  {
    slug: "uc-ho-01-normal-flow",
    title: "UC-HO-01 · Normal flow — 8-state walkthrough",
    description:
      "Clickable 8-state walkthrough of the complete UC-HO-01 v2.1 happy path · dashboard entry → quick-initiate (default + customize) → command-view through Phase 1 sub-stages → dashboard refreshed at Phase 2. Prev/Next chrome with state selector.",
    sprint: "S1",
    personas: ["Hà Vy", "Minh Lê", "Khánh Linh Trần", "Phương Anh Nguyễn", "Trần Hữu Nam"],
    useCases: ["UC-HO-01"],
    tags: ["s1", "management", "flow", "normal-course", "spec-trace", "current", "comprehensive"],
    Component: UcHo01NormalFlow,
  },
  {
    slug: "uc-ho-01-edge-cases",
    title: "UC-HO-01 · Edge cases — E1 through E10",
    description:
      "Clickable 10-state coverage of every edge case in UC-HO-01 v2.1 · profile not provisioned (E1) · RBAC unresolvable (E2) · source seeding failure (E3) · classification service paused (E4) · manual initiation (E5) · customize expander (E6) · no integrated sources (E7) · urgent <3 days (E8) · >30% sensitivity exclusion (E9) · paused page (E10).",
    sprint: "S1",
    personas: ["Hà Vy", "Minh Lê", "Khánh Linh Trần", "Phương Anh Nguyễn", "Hoàng Anh Lê"],
    useCases: ["UC-HO-01"],
    tags: ["s1", "management", "flow", "edge-cases", "spec-trace", "current", "comprehensive"],
    Component: UcHo01EdgeCases,
  },

  /* ─── S2 · Capture plane · POC (CL-099) + Phase 2 reference (CL-098) ─── */
  {
    slug: "uc-ho-02-capture-queue",
    title: "UC-HO-02 · Capture queue — POC text-based capture",
    description:
      "The POC Capture surface · replaces the deferred voice interview per CL-098. The Offboarder answers a unified text question queue at their own pace, optionally uploading files. The queue is the union of Manager Priority Prompts (UC-HO-05, violet), Network questions (UC-HO-08 / CL-100, indigo), Pre-commit flags (CL-101, yellow), and the Offboarder's own contributions (gray). 8 states walk: Day 3 landing with progress header · answering a Manager Priority Prompt · answering a Network question from Duy Nguyễn with co-assignment context · fixing a Pre-commit flag with side-by-side AI-vs-correct diff · adding own topic with category chips · self-upload with per-file classification preview and CL-092 sanitization reminder · mid-session save checkpoint with 3-tile summary · done state with 6 contribution tiles and 4-step next-actions list.",
    sprint: "S2",
    personas: ["Minh Lê", "Hà Vy", "Trần Hữu Nam", "Duy Nguyễn", "Phương Anh Nguyễn"],
    useCases: ["UC-HO-02", "UC-HO-05", "UC-HO-08"],
    tags: ["s2", "capture", "poc", "offboarder", "text-queue", "self-upload", "uc-ho-08", "current"],
    Component: UcHo02CaptureQueue,
  },
  {
    slug: "uc-ho-02-interview-canvas",
    title: "UC-HO-02 · Interview canvas — Phase 2 reference",
    description:
      "PHASE 2 REFERENCE per CL-098 · NOT part of the POC build. The Offboarder's dedicated voice-interview workspace, retained as design reference for the eventual voice flow. OffboarderShell with zero sidebar / zero session enumeration. 8 states walking the full focus-mode lifecycle including CL-009 rose triple-pulse recording rings and Manager Priority Prompt inline pattern. The POC capture path instead uses the text queue + upload + UC-HO-08 network requests model from CL-099/100/101 (see uc-ho-02-capture-queue).",
    sprint: "S2",
    personas: ["Minh Lê", "Hà Vy", "Trần Hữu Nam"],
    useCases: ["UC-HO-02"],
    tags: ["s2", "capture", "offboarder", "focus-mode", "interview", "phase-2-reference"],
    Component: UcHo02InterviewCanvas,
  },

  /* ─── S4 · Consumption plane · Knowledge Graph readers ─── */
  {
    slug: "uc-on-02-consumer-newcomer",
    title: "UC-ON-02 · Newcomer · Tran Huu Nam's reading experience",
    description:
      "The Newcomer's reading experience · personalized Day 1 playbook (left pane) + global Knowledge Graph through the Newcomer's RBAC lens (right pane top) + persistent Copilot (right pane bottom). MASTER.md 'AI-Native Minimal' indigo/glassmorphism aesthetic per CL-096. 8 states walk landing → reading Atlas → entity hover (0-token pre-computed short_summary) → graph 2-hop expand → Tier 1 Lock stub with Request access (CL-093) → Copilot Prompt Disambiguation chips → grounded answer with named source chips → Quick Check feeding UC-ON-03 Skill Gap.",
    sprint: "S4",
    personas: ["Tran Huu Nam", "Minh Le", "Ha Vy"],
    useCases: ["UC-ON-02", "UC-ON-03"],
    tags: ["s4", "consumption", "newcomer", "playbook", "knowledge-graph", "master-md", "current"],
    Component: UcOn02ConsumerNewcomer,
  },
  {
    slug: "uc-on-02-consumer-colleague",
    title: "UC-ON-02 · Colleague · Duy Nguyen's cross-team lookup",
    description:
      "The Colleague's lookup experience · search-first entry (no playbook), narrower RBAC lens, more visible Tier 1 Lock stubs, narrower Copilot scope. 8 states walk hero search with suggested queries + recent searches → typed query with optimistic UI showing pre-retrieval ACL trim → Prompt Disambiguation with 3 narrowed chips → grounded canonical answer with source chips and team-owned step badge → lock-heavy view exposing 3 Tier 1 stubs + ghost-stub indicator for Tier 2 → out-of-scope rejection with CL-019 redirect grammar → 1-hop neighborhood browsing → follow-entity re-centering.",
    sprint: "S4",
    personas: ["Duy Nguyen", "Minh Le", "Ha Vy"],
    useCases: ["UC-ON-02"],
    tags: ["s4", "consumption", "colleague", "search-first", "lock-heavy", "knowledge-graph", "master-md", "current"],
    Component: UcOn02ConsumerColleague,
  },
  {
    slug: "uc-on-02-consumer-manager",
    title: "UC-ON-02 · Manager · Ha Vy's audit + correction workspace",
    description:
      "The Manager's view of the same global graph · richest set of affordances. 8 states walk arrival with KPI bar + Timeline at 'now' + Hot Spots panel → Heatmap overlay → Timeline drag rewinding 2 weeks with ghost nodes → Contested flag drill-down with AI recommendation + QA-INT-01 §1.4 commit gate reminder → UC-HO-07 correction approval with side-by-side diff + propagation preview → CL-085 LineageDrawer with 4-event timeline + cryptographic anchor → CL-095 Critical alert (real-time [Risk] route with 4h SLA, two flaggers, Expert LLM escalation) → after-signoff confirmation with audit log entry.",
    sprint: "S4",
    personas: ["Ha Vy", "Minh Le", "Tran Huu Nam", "Duy Nguyen"],
    useCases: ["UC-ON-02", "UC-HO-06", "UC-HO-07"],
    tags: ["s4", "consumption", "manager", "audit", "timeline", "heatmap", "lineage", "critical-alert", "uc-ho-07", "knowledge-graph", "master-md", "current"],
    Component: UcOn02ConsumerManager,
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
