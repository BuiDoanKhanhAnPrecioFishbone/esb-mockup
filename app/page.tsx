import { AppShell } from "@/components/app/AppShell";
import HaVyHandoverDashboard from "@/components/mockups/ha-vy-handover-dashboard.jsx";

export const metadata = {
  title: "Dashboard · ART-EEP",
  description: "Hà Vy's handover dashboard — multi-session, 3-phase progress.",
};

export default function HomePage() {
  return (
    <AppShell>
      <HaVyHandoverDashboard embedded view="active" />
    </AppShell>
  );
}
