import UcHo01NormalFlow from "@/components/mockups/uc-ho-01-normal-flow.jsx";

export const metadata = {
  title: "UC-HO-01 · Normal flow · ART-EEP",
  description:
    "Clickable 8-state walkthrough of the UC-HO-01 v2.1 happy path on current primitives (3-phase lifecycle, approved shared workspaces only, /session/[id] command view).",
};

export default function UcHo01NormalFlowPage() {
  return <UcHo01NormalFlow />;
}
