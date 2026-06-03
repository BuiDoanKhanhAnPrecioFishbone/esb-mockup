import Link from "next/link";
import { AppShell } from "@/components/app/AppShell";
import { ArrowUpRight, Compass } from "lucide-react";

export const metadata = {
  title: "Spec traces · ART-EEP",
  description:
    "Clickable spec walkthroughs. Each trace covers a use case's happy path or edge-case set built on the same primitives as the real app.",
};

const TRACES = [
  {
    slug: "uc-ho-01/normal",
    href: "/spec/uc-ho-01/normal",
    uc: "UC-HO-01",
    title: "Normal flow — 8-state happy path",
    description:
      "Dashboard → quick-initiate → command-view through every Phase 1 sub-stage to the Phase 2 transition.",
    states: 8,
    tags: ["happy-path", "current"],
  },
  {
    slug: "uc-ho-01/edges",
    href: "/spec/uc-ho-01/edges",
    uc: "UC-HO-01",
    title: "Edge cases — E1 through E10",
    description:
      "Profile missing, RBAC unresolvable, source failure, paused, manual fallback, no integrated sources, urgent, sensitivity threshold, paused page.",
    states: 10,
    tags: ["edge-cases", "current"],
  },
];

export default function SpecIndexPage() {
  return (
    <AppShell>
      <div className="px-6 py-8 max-w-5xl mx-auto">
        <header className="mb-6">
          <div className="flex items-center gap-2 text-violet-700 mb-1">
            <Compass className="w-5 h-5" strokeWidth={1.75} />
            <span
              className="text-xs uppercase tracking-wider font-semibold"
              style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
            >
              Spec traces
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Walkthroughs for use-case verification
          </h1>
          <p className="text-sm text-gray-600 mt-1 max-w-2xl">
            Each trace is a clickable Prev/Next walk-through built on the same
            primitives as the real app. Use these to verify a UC&apos;s happy path
            or edge-case coverage 1:1 against the spec.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TRACES.map((t) => (
            <Link
              key={t.slug}
              href={t.href}
              className="group block rounded-2xl border border-gray-200 bg-white p-5 hover:border-violet-300 hover:shadow-sm transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[10px] uppercase tracking-wider text-violet-700 bg-violet-50 border border-violet-100 rounded px-1.5 py-0.5 font-medium"
                      style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
                    >
                      {t.uc}
                    </span>
                    <span
                      className="text-[10px] text-gray-600 bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5"
                      style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
                    >
                      {t.states} states
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-violet-700">
                    {t.title}
                  </h3>
                  <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                    {t.description}
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-violet-600 shrink-0 mt-0.5" />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {t.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] text-gray-500 bg-white border border-gray-200 rounded-full px-2 py-0.5"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
