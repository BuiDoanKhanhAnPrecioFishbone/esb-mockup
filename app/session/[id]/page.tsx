import { notFound } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import SessionCommandView from "@/components/mockups/session-command-view.jsx";

type TabId = "overview" | "scope" | "data" | "logs";

const SESSIONS: Record<string, { initials: "ml"; title: string }> = {
  "minh-le": { initials: "ml", title: "Minh Lê · session command view" },
};

const VALID_TABS: TabId[] = ["overview", "scope", "data", "logs"];
const VALID_ROLES = ["manager", "offboarder", "coworker"];
const VALID_STEPS = ["collecting", "ready", "capture", "deliver", "complete"];

export function generateStaticParams() {
  return Object.keys(SESSIONS).map((id) => ({ id }));
}

export default async function SessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string; role?: string; step?: string }>;
}) {
  const { id } = await params;
  const session = SESSIONS[id];
  if (!session) notFound();

  const { tab, role, step } = await searchParams;
  const safeTab: TabId = (VALID_TABS as string[]).includes(tab ?? "")
    ? (tab as TabId)
    : "overview";

  // Clean product mode: when a role is pinned via URL (e.g. opened from the
  // /states preview stage), render the real app for that single role with no
  // inline role/step switcher. The switcher belongs to the stage, not the product.
  if (role && VALID_ROLES.includes(role)) {
    const safeStep = VALID_STEPS.includes(step ?? "") ? (step as string) : "ready";
    const productTab = safeTab === "scope" ? "overview" : safeTab;
    return (
      <AppShell>
        <SessionCommandView embedded chrome={false} role={role} step={safeStep} tab={productTab} />
      </AppShell>
    );
  }

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
