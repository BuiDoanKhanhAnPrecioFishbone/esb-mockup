import KnowledgeGraphExplorer from "@/components/mockups/knowledge-graph-explorer.jsx";

export const metadata = {
  title: "Knowledge graph · ART-EEP",
  description:
    "Consumer plane — ask the graph. Progressive disclosure, 0-token hover, Timeline + Heatmap.",
};

// Consumer plane — standalone glass shell (MASTER.md scope, CL-096), intentionally
// NOT wrapped in AppShell. The explorer renders its own floating top bar with a
// Dashboard link back into the main (light) app. The previous placeholder
// (components/mockups/knowledge-graph.jsx) is superseded but kept in the repo.
export default function KnowledgeGraphPage() {
  return <KnowledgeGraphExplorer />;
}
