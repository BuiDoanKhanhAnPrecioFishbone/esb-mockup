import { AppShell } from "@/components/app/AppShell";
import UCHO01QuickInitiate from "@/components/mockups/uc-ho-01-quick-initiate.jsx";

export const metadata = {
  title: "Initiate session · ART-EEP",
  description:
    "One-click handover-session initiation with HR-pre-filled defaults and a progressive-disclosure customize panel.",
};

export default function NewSessionPage({
  searchParams,
}: {
  searchParams: Promise<{ customize?: string }>;
}) {
  // ?customize=1 opens the customize expander by default
  return (
    <AppShell>
      <NewSessionContent searchParams={searchParams} />
    </AppShell>
  );
}

async function NewSessionContent({
  searchParams,
}: {
  searchParams: Promise<{ customize?: string }>;
}) {
  const params = await searchParams;
  const view = params.customize ? "customize" : "ready";
  return <UCHO01QuickInitiate embedded view={view} />;
}
