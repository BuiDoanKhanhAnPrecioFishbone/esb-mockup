import { notFound } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import SessionCommandView from "@/components/mockups/session-command-view.jsx";

type TabId = "overview" | "scope" | "data" | "logs";

const SESSIONS: Record<string, { initials: "ml"; title: string }> = {
  "minh-le": { initials: "ml", title: "Minh Lê · session command view" },
};

// 3 visible tabs: Overview · Data · Logs.
// "scope" is a virtual tab that renders Overview with subStageId overridden to 3.
// Legacy tabs (stages/audit/settings/review) resolve to overview.
const VALID_TABS: TabId[] = ["overview", "scope", "data", "logs"];

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
