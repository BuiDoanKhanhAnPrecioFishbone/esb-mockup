import { AppShell } from "@/components/app/AppShell";
import PrepareStage from "@/components/mockups/prepare-stage.jsx";

export const metadata = {
  title: "Prepare · ART-EEP",
  description: "The handover process begins the moment an employee is marked Offboarding.",
};

// Management plane — light AppShell system. The Prepare stage is session-scoped
// (/prepare/[id]); the mockup renders Minh Lê's session regardless of id.
export default function PreparePage() {
  return (
    <AppShell>
      <PrepareStage />
    </AppShell>
  );
}
