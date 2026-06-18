import { Suspense } from "react";
import { AppShell } from "@/components/app/AppShell";
import KnowledgeGraphExplorer from "@/components/mockups/knowledge-graph-explorer.jsx";

export default function Page() {
  return (
    <AppShell>
      <Suspense fallback={<div className="flex items-center justify-center h-full text-sm text-gray-400">Loading knowledge graph...</div>}>
        <KnowledgeGraphExplorer embedded />
      </Suspense>
    </AppShell>
  );
}
