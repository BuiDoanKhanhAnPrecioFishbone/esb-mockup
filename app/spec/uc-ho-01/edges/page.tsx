import UcHo01EdgeCases from "@/components/mockups/uc-ho-01-edge-cases.jsx";

export const metadata = {
  title: "UC-HO-01 · Edge cases · ART-EEP",
  description:
    "Clickable 10-state coverage of every edge case in UC-HO-01 v2.1: profile missing, RBAC unresolvable, source failure, classification paused, manual fallback, customize expander, no integrated sources, urgent, sensitivity exclusion, paused page.",
};

export default function UcHo01EdgeCasesPage() {
  return <UcHo01EdgeCases />;
}
