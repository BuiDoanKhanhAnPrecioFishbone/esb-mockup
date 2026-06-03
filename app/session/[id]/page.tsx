import { notFound } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import SessionCommandView from "@/components/mockups/session-command-view.jsx";

type TabId = "overview" | "stages" | "data" | "audit" | "settings";

const SESSIONS: Record<string, { initials: "ml" | "pa"; title: string }> = {
  "minh-le": { initials: "ml", title: "Minh Lê · session command view" },
  "phuong-anh": { initials: "pa", title: "Phương Anh Nguyễn · session command view" },
};

const VALID_TABS: TabId[] = ["overview", "stages", "data", "audit", "settings"];

export function generateStaticParams() {
  return Object.keys(SESSIONS).map((id) => ({ id }));
}

export default async function SessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const session = SESSIONS[id];
  if (!session) notFound();

  const { tab } = await searchParams;
  const safeTab: TabId = (VALID_TABS as string[]).includes(tab ?? "")
    ? (tab as TabId)
    : "overview";

  // Compose the embedded view id: "<sessionKey>-<tabId>". Both sessions support
  // every tab; the component renders the matching tab content.
  const view = `${session.initials}-${safeTab}`;

  return (
    <AppShell>
      <SessionCommandView embedded view={view} />
    </AppShell>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const s = SESSIONS[id];
  return {
    title: s ? s.title : "Session · ART-EEP",
  };
}
