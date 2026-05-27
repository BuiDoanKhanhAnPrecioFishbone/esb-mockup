import Link from "next/link";
import { mockupsBySprint, mockups } from "@/lib/mockups-registry";
import { MockupCard } from "@/components/MockupCard";
import { BookOpen, Layers } from "lucide-react";

const SPRINT_ORDER = ["S6", "S0", "SZ", "S1", "S2", "S3", "S4", "S5", "Demos", "Unsorted"];

export default function Home() {
  const grouped = mockupsBySprint();
  const orderedKeys = Object.keys(grouped).sort(
    (a, b) => SPRINT_ORDER.indexOf(a) - SPRINT_ORDER.indexOf(b),
  );

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-violet-700 mb-1">
              <Layers className="h-5 w-5" />
              <span className="text-xs uppercase tracking-wide font-mono">esb-mockup</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Mockup playground</h1>
            <p className="text-sm text-gray-600 mt-1 max-w-2xl">
              Clickable wireframes for ART-EEP flows. Pick a card to explore. New mockups land
              here automatically when registered in{" "}
              <code className="font-mono text-xs bg-gray-100 border border-gray-200 rounded px-1 py-0.5">
                lib/mockups-registry.ts
              </code>
              .
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {mockups.length} mockup{mockups.length === 1 ? "" : "s"} registered.
            </p>
          </div>
          <Link
            href="/guide"
            className="shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 text-xs font-medium transition"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Team guide
          </Link>
        </header>

        {orderedKeys.map((sprint) => (
          <section key={sprint} className="mb-8">
            <h2 className="text-xs uppercase tracking-wide font-mono text-gray-600 mb-3">
              {sprint}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {grouped[sprint].map((m) => (
                <MockupCard key={m.slug} mockup={m} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
