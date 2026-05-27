"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type FlowNavProps = {
  flowLabel: string;
  currentSlug: string;
  steps: string[];
};

export function FlowNav({ flowLabel, currentSlug, steps }: FlowNavProps) {
  const idx = steps.indexOf(currentSlug);
  if (idx === -1) return null;
  const prev = idx > 0 ? steps[idx - 1] : null;
  const next = idx < steps.length - 1 ? steps[idx + 1] : null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full border border-gray-200 bg-white/95 backdrop-blur px-3 py-2 shadow-sm">
      <span className="font-mono text-[10px] uppercase tracking-wide text-violet-700 bg-violet-50 border border-violet-100 rounded px-1.5 py-0.5">
        {flowLabel}
      </span>
      <span className="text-xs text-gray-600">
        Step {idx + 1} of {steps.length}
      </span>
      <div className="flex items-center gap-1 ml-2">
        {prev ? (
          <Link
            href={`/m/${prev}`}
            className="inline-flex items-center gap-1 h-7 px-2 rounded-md border border-gray-200 hover:border-violet-300 text-xs text-gray-700 hover:text-violet-700"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Prev
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 h-7 px-2 rounded-md border border-gray-100 text-xs text-gray-300">
            <ChevronLeft className="h-3.5 w-3.5" /> Prev
          </span>
        )}
        {next ? (
          <Link
            href={`/m/${next}`}
            className="inline-flex items-center gap-1 h-7 px-2 rounded-md bg-violet-600 hover:bg-violet-700 text-xs text-white"
          >
            Next <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 h-7 px-2 rounded-md bg-violet-200 text-xs text-white">
            Next <ChevronRight className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
    </div>
  );
}
