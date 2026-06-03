import { AppShell } from "@/components/app/AppShell";
import KnowledgeGraph from "@/components/mockups/knowledge-graph.jsx";

export const metadata = {
  title: "Knowledge graph · ART-EEP",
  description:
    "What the team has captured · 4,218 items · 187 canonical facts · 14 sessions committed.",
};

export default function KnowledgeGraphPage() {
  return (
    <AppShell>
      <KnowledgeGraph />
    </AppShell>
  );
}
