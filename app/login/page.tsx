"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

const ROLES = [
  { id: "manager", label: "H\u00e0 Vy", sub: "Manager \u00b7 Engineering", initials: "HV", color: "bg-violet-100 text-violet-700 border-violet-200" },
  { id: "offboarder", label: "Minh L\u00ea", sub: "Offboarder \u00b7 Engineering", initials: "ML", color: "bg-violet-100 text-violet-700 border-violet-200" },
  { id: "coworker", label: "Tr\u1ea7n H\u1eefu Nam", sub: "Coworker \u00b7 Engineering", initials: "CW", color: "bg-gray-100 text-gray-700 border-gray-200" },
];

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("manager");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!password.trim()) { setError("Enter the password"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, role: selectedRole }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Wrong password"); setLoading(false); return; }
      router.push("/");
      router.refresh();
    } catch { setError("Connection error"); setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="w-full max-w-sm px-6">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-violet-600 inline-flex items-center justify-center mb-4">
            <Sparkles className="w-5 h-5 text-white" strokeWidth={1.75} />
          </div>
          <h1 className="text-lg font-semibold text-gray-900 tracking-tight">ART-EEP</h1>
          <p className="text-xs text-gray-500 mt-1">Employee Handover Knowledge Platform</p>
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="text-[11px] text-gray-500 uppercase tracking-wider font-medium block mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="Enter mockup password"
            className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 placeholder:text-gray-400"
            autoFocus
          />
        </div>

        {/* Role selection */}
        <div className="mb-5">
          <label className="text-[11px] text-gray-500 uppercase tracking-wider font-medium block mb-1.5">View as</label>
          <div className="space-y-2">
            {ROLES.map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRole(r.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  selectedRole === r.id
                    ? "border-violet-400 bg-violet-50/50 ring-2 ring-violet-500/10"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className={`w-9 h-9 rounded-full border text-[11px] font-semibold inline-flex items-center justify-center shrink-0 ${r.color}`}>{r.initials}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">{r.label}</div>
                  <div className="text-[11px] text-gray-500">{r.sub}</div>
                </div>
                {selectedRole === r.id && <div className="w-4 h-4 rounded-full bg-violet-600 inline-flex items-center justify-center shrink-0"><svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg></div>}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && <p className="text-xs text-rose-600 mb-3">{error}</p>}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-10 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Signing in..." : "Enter mockup"}
        </button>

        <p className="text-[10px] text-gray-400 text-center mt-4">Role can be changed anytime via the top-right switcher</p>
      </div>
    </div>
  );
}
