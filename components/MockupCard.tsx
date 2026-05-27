import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { MockupEntry } from "@/lib/mockups-registry";

export function MockupCard({ mockup }: { mockup: MockupEntry }) {
  return (
    <Link
      href={`/m/${mockup.slug}`}
      className="group block rounded-2xl border border-gray-200 bg-white p-5 hover:border-violet-300 hover:shadow-sm transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {mockup.sprint && (
              <span className="font-mono text-[10px] uppercase tracking-wide text-violet-700 bg-violet-50 border border-violet-100 rounded px-1.5 py-0.5">
                {mockup.sprint}
              </span>
            )}
            {mockup.useCases?.map((uc) => (
              <span
                key={uc}
                className="font-mono text-[10px] uppercase tracking-wide text-gray-600 bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5"
              >
                {uc}
              </span>
            ))}
          </div>
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-violet-700 truncate">
            {mockup.title}
          </h3>
          <p className="mt-1 text-xs text-gray-600 line-clamp-2">{mockup.description}</p>
        </div>
        <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-violet-600 shrink-0 mt-0.5" />
      </div>

      {(mockup.personas?.length || mockup.tags?.length) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {mockup.personas?.map((p) => (
            <span
              key={p}
              className="text-[11px] text-gray-700 bg-gray-50 border border-gray-200 rounded-full px-2 py-0.5"
            >
              {p}
            </span>
          ))}
          {mockup.tags?.map((t) => (
            <span
              key={t}
              className="text-[11px] text-gray-500 bg-white border border-gray-200 rounded-full px-2 py-0.5"
            >
              #{t}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
