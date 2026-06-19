import { AppShell } from "@/components/app/AppShell";
import HaVyHandoverDashboardImpl from "@/components/mockups/ha-vy-handover-dashboard.jsx";
import type { ComponentType } from "react";

type DashProps = {
  embedded?: boolean;
  role?: string;
  state?: string;
};
const HaVyHandoverDashboard =
  HaVyHandoverDashboardImpl as unknown as ComponentType<DashProps>;

export const metadata = {
  title: "Dashboard · ART-EEP",
  description: "Hà Vy's handover dashboard — multi-session, 3-phase progress.",
};

const VALID_ROLES = ["manager", "offboarder", "coworker"];
const VALID_STATES: Record<string, string[]> = {
  manager: ["departures", "active", "completed"],
  offboarder: ["not-started", "active-queue", "all-answered", "complete"],
  coworker: ["active", "all-satisfied"],
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; state?: string }>;
}) {
  const { role, state } = await searchParams;
  // Clean product mode: when role is pinned via URL (used by /states thumbnails
  // and shareable deep links), render the dashboard for that single role +
  // optional state. Without ?role=, the dashboard reads from context as usual.
  const safeRole = role && VALID_ROLES.includes(role) ? role : undefined;
  const safeState =
    safeRole && state && VALID_STATES[safeRole]?.includes(state)
      ? state
      : undefined;
  return (
    <AppShell>
      <HaVyHandoverDashboard embedded role={safeRole} state={safeState} />
    </AppShell>
  );
}
