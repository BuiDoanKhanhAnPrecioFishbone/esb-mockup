import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { findMockup, mockups } from "@/lib/mockups-registry";
import { FlowNav } from "@/components/FlowNav";

export function generateStaticParams() {
  return mockups.map((m) => ({ slug: m.slug }));
}

export default async function MockupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mockup = findMockup(slug);
  if (!mockup) notFound();

  const { Component } = mockup;

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-40 flex items-center justify-between px-4 h-10 bg-white/90 backdrop-blur border-b border-gray-200">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-gray-700 hover:text-violet-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All mockups
        </Link>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          {mockup.sprint && (
            <span className="font-mono text-[10px] uppercase tracking-wide text-violet-700 bg-violet-50 border border-violet-100 rounded px-1.5 py-0.5">
              {mockup.sprint}
            </span>
          )}
          <span className="font-medium text-gray-900">{mockup.title}</span>
        </div>
        <span className="w-20" />
      </div>

      <div>
        <Component />
      </div>

      {mockup.flow && (
        <FlowNav
          flowLabel={mockup.flow.label}
          currentSlug={mockup.slug}
          steps={mockup.flow.steps}
        />
      )}
    </div>
  );
}
