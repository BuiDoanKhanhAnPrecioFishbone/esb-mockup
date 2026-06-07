import { notFound } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import SessionCommandView from "@/components/mockups/session-command-view.jsx";

type TabId = "overview" | "stages" | "data" | "audit" | "settings" | "review";

const SESSIONS: Record<string, { initials: "ml" | "pa"; title: string }> = {
  "minh-le": { initials: "ml", title: "Minh Lê · session command view" },
  "phuong-anh": { initials: "pa", title: "Phương Anh Nguyễn · session command view" },
};

// "review" is the Manager review tab (UC-HO-04) merged into SessionCommandView per CL-103.
// Only Minh Lê's session has the UC-HO-04 mockup wired in for the POC; other sessions
// render a friendly placeholder in the tab content (handled inside SessionCommandView).
const VALID_TABS: TabId[] = ["overview", "stages", "data", "audit", "settings", "review"];

export function generateStaticParams() {
  return Object.keys(SESSIONS).map((id) => ({ id }));
}

export default async function SessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string; state?: string }>;
}) {
  const { id } = await params;
  const session = SESSIONS[id];
  if (!session) notFound();

  const { tab, state } = await searchParams;
  const safeTab: TabId = (VALID_TABS as string[]).includes(tab ?? "")
    ? (tab as TabId)
    : "overview";

  // Compose the embedded view id: "<sessionKey>-<tabId>". Both sessions support
  // every tab; the component renders the matching tab content. For the review tab,
  // the optional ?state= param picks which of UC-HO-04's 8 states to land on
  // (default s1). Passed through via the view string and parsed inside SessionCommandView.
  const view = safeTab === "review" && state
    ? `${session.initials}-${safeTab}-${state}`
    : `${session.initials}-${safeTab}`;

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
