import { AppShell } from "@/components/app/AppShell";
import CreateSession from "@/components/mockups/create-session.jsx";

export const metadata = {
  title: "Create session · ART-EEP",
  description: "Start a new handover session for a departing employee.",
};

export default function NewSessionPage() {
  return (
    <AppShell>
      <CreateSession embedded />
    </AppShell>
  );
}
