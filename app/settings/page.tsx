import { AppShell } from "@/components/app/AppShell";
import SettingsConnectors from "@/components/mockups/settings-connectors.jsx";

export const metadata = {
  title: "Settings · ART-EEP",
  description:
    "Platform Admin home · connector library, health, and department × source mapping for Step Zero.",
};

export default function SettingsPage() {
  return (
    <AppShell>
      <SettingsConnectors />
    </AppShell>
  );
}
