import { Suspense } from "react";
import { AppShell } from "@/components/app/AppShell";
import KnowledgeGraphInsightsImpl from "@/components/mockups/knowledge-graph-insights.jsx";

type InsightsProps = { embedded?: boolean };
const KnowledgeGraphInsights = KnowledgeGraphInsightsImpl as unknown as React.ComponentType<InsightsProps>;

export default function Page() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-6 text-sm text-gray-500">Loading insights...</div>}>
        <KnowledgeGraphInsights embedded />
      </Suspense>
    </AppShell>
  );
}

export const metadata = {
  title: "Knowledge insights \u00b7 ART-EEP",
};
