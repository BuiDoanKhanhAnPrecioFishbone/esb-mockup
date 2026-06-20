import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { AppShell } from "@/components/app/AppShell";
import SessionCommandViewImpl from "@/components/mockups/session-command-view.jsx";
import SessionThanhTungImpl from "@/components/mockups/session-thanh-tung.jsx";

type SCVProps = {
  embedded?: boolean;
  view?: string;
  chrome?: boolean;
  role?: string;
  step?: string;
  tab?: string;
};
const SessionCommandView = SessionCommandViewImpl as unknown as ComponentType<SCVProps>;
const SessionThanhTung = SessionThanhTungImpl as unknown as ComponentType<{ embedded?: boolean }>;

type TabId = "overview" | "scope" | "data" | "logs";

const SESSIONS: Record<string, { initials: string; title: string; component?: string }> = {
  "minh-le": { initials: "ml", title: "Minh L\u00ea \u00b7 session command view" },
  "thanh-tung": { initials: "tt", title: "Thanh T\u00f9ng \u00b7 session command view", component: "thanh-tung" },
  "thanh-duc": { initials: "td", title: "Thanh \u0110\u1ee9c \u00b7 session command view" },
  "anh-thu": { initials: "at", title: "Anh Th\u01b0 \u00b7 session command view" },
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

  // Thanh T\u00f9ng has a dedicated component showing "Waiting on you" Prepare state
  if (session.component === "thanh-tung") {
    return (
      <AppShell>
        <SessionThanhTung embedded />
      </AppShell>
    );
  }

  const { tab, role, step } = await searchParams;
  const safeTab: TabId = (VALID_TABS as string[]).includes(tab ?? "")
    ? (tab as TabId)
    : "overview";

  if (role && VALID_ROLES.includes(role)) {
    const safeStep = VALID_STEPS.includes(step ?? "") ? (step as string) : "ready";
    const productTab: string = safeTab === "scope" ? "overview" : safeTab;
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
    title: s ? s.title : "Session \u00b7 ART-EEP",
  };
}
