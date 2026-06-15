import { AppShell } from "@/components/app/AppShell";
import KnowledgeGraphExplorer from "@/components/mockups/knowledge-graph-explorer.jsx";

export default function Page() {
  return (
    <AppShell>
      <KnowledgeGraphExplorer embedded />
    </AppShell>
  );
}
