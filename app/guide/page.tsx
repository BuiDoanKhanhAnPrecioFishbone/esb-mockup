import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const metadata = {
  title: "Team guide · esb-mockup",
  description: "How PMs, POs, and designers use Claude to update the mockup site.",
};

export default async function GuidePage() {
  const md = await fs.readFile(
    path.join(process.cwd(), "TEAM-GUIDE.md"),
    "utf8",
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 flex items-center justify-between px-4 h-10 bg-white/90 backdrop-blur border-b border-gray-200">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-gray-700 hover:text-violet-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All mockups
        </Link>
        <div className="flex items-center gap-2 text-xs">
          <BookOpen className="h-3.5 w-3.5 text-violet-600" />
          <span className="font-medium text-gray-900">Team guide</span>
        </div>
        <span className="w-20" />
      </div>

      <article className="max-w-3xl mx-auto px-6 py-10 pb-20">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold text-gray-900 mt-0 mb-6 tracking-tight">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-3 tracking-tight">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-base font-semibold text-violet-700 mt-6 mb-2">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-6 space-y-1.5 text-sm text-gray-700 mb-4 marker:text-violet-400">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-6 space-y-1.5 text-sm text-gray-700 mb-4 marker:text-violet-500 marker:font-mono">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed">{children}</li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-violet-300 bg-violet-50/50 pl-4 pr-3 py-2 my-3 text-sm text-gray-700 rounded-r">
                {children}
              </blockquote>
            ),
            code: ({ children, className, ...rest }) => {
              const isInline = !className;
              if (isInline) {
                return (
                  <code className="font-mono text-[12px] bg-gray-100 border border-gray-200 rounded px-1 py-0.5 text-gray-800">
                    {children}
                  </code>
                );
              }
              return (
                <code className={className} {...rest}>
                  {children}
                </code>
              );
            },
            pre: ({ children }) => (
              <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-xs my-3 font-mono">
                {children}
              </pre>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                className="text-violet-700 hover:text-violet-900 underline decoration-violet-300 underline-offset-2"
              >
                {children}
              </a>
            ),
            hr: () => <hr className="my-10 border-gray-200" />,
            table: ({ children }) => (
              <div className="overflow-x-auto my-4 rounded-lg border border-gray-200">
                <table className="w-full text-sm border-collapse">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-gray-50 border-b border-gray-200">
                {children}
              </thead>
            ),
            th: ({ children }) => (
              <th className="text-left font-semibold text-gray-900 px-3 py-2 text-xs uppercase tracking-wide">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-3 py-2 border-t border-gray-200 text-gray-700 align-top">
                {children}
              </td>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-gray-900">{children}</strong>
            ),
            em: ({ children }) => (
              <em className="italic text-gray-700">{children}</em>
            ),
          }}
        >
          {md}
        </ReactMarkdown>
      </article>
    </main>
  );
}
