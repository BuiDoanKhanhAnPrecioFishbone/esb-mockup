import { notFound } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import SessionCommandView from "@/components/mockups/session-command-view.jsx";

type TabId = "overview" | "scope" | "stages" | "data" | "audit" | "settings" | "review";

// CL-118 · POC persona scope narrowed 9 → 8. The "phuong-anh" entry is
// removed from the allow-list; the initials type union narrows to "ml"
// only. /session/phuong-anh now 404s (notFound), matching the upstream
// supersession of CL-109 in session-command-view.jsx.
const SESSIONS: Record<string, { initials: "ml"; title: string }> = {
  "minh-le": { initials: "ml", title: "Minh Lê · session command view" },
};

// "scope" is the Prepare subStage 3 (review scope / duyệt) surface.
// "review" is the Review tab (UC-HO-04) merged into SessionCommandView per CL-103.
// Legacy tabs (stages/data/audit/settings) resolve to overview per CL-107.
const VALID_TABS: TabId[] = ["overview", "scope", "stages", "data", "audit", "settings", "review"];

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

  // Compose the embedded view id: "<sessionKey>-<tabId>". The session supports
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
