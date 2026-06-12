import { AppShell } from "@/components/app/AppShell";
import AllSessions from "@/components/mockups/all-sessions.jsx";

export const metadata = {
  title: "All sessions · ART-EEP",
  description: "Registry of all handover sessions — active and completed.",
};

export default function SessionsPage() {
  return (
    <AppShell>
      <AllSessions embedded />
    </AppShell>
  );
}
