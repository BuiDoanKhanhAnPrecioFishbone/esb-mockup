"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setPending(false);
    if (res.ok) {
      router.push(from);
      router.refresh();
    } else {
      setError("Wrong password.");
      setPassword("");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center gap-2 text-violet-700 mb-4">
          <Lock className="h-5 w-5" />
          <h1 className="text-lg font-semibold">esb-mockup</h1>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Enter the team password to view the mockups.
        </p>

        <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          autoFocus
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-9 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
        />

        {error && (
          <p className="mt-2 text-xs text-rose-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-4 inline-flex items-center justify-center gap-2 w-full h-8 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white text-sm font-medium transition"
        >
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          {pending ? "Checking..." : "Enter"}
        </button>
      </form>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
