"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Network,
  Settings,
  HelpCircle,
  Bell,
  Search,
  BookOpen,
  Compass,
  LayoutGrid,
  AlertOctagon,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  Check,
  Info,
  X,
} from "lucide-react";
import { ViewAsProvider } from "@/lib/view-as";
import {
  ROLES,
  isRouteAllowed,
  defaultRoute,
  viewStates,
  defaultStateFor,
} from "@/lib/view-matrix";

type NavItem = {
  label: string;
  href?: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  match?: (pathname: string) => boolean;
  disabled?: boolean;
  hint?: string;
};

const PRIMARY_NAV: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, match: (p) => p === "/" },
  {
    label: "Sessions",
    href: "/sessions",
    icon: Briefcase,
    match: (p) => p.startsWith("/session"),
  },
  {
    label: "Knowledge graph",
    href: "/knowledge-graph",
    icon: Network,
    match: (p) => p.startsWith("/knowledge-graph"),
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    match: (p) => p.startsWith("/settings"),
  },
];

const SECONDARY_NAV: NavItem[] = [
  {
    label: "Spec traces",
    href: "/spec",
    icon: Compass,
    match: (p) => p.startsWith("/spec"),
  },
  {
    label: "Design states",
    href: "/states",
    icon: LayoutGrid,
    match: (p) => p.startsWith("/states"),
  },
  { label: "Team guide", href: "/guide", icon: BookOpen, match: (p) => p.startsWith("/guide") },
  { label: "Help", icon: HelpCircle, disabled: true },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState("manager");
  const [step, setStep] = useState("");
  const [note, setNote] = useState<string | null>(null);

  // Reset the selected state whenever the view changes — state ids are scoped
  // per view, so a session step shouldn't leak onto the dashboard and back.
  useEffect(() => {
    setStep("");
  }, [pathname]);

  const handleSwitch = (r: string) => {
    setRole(r);
    setStep("");
    if (!isRouteAllowed(r, pathname)) {
      const persona = ROLES.find((x) => x.id === r);
      setNote(
        `${persona?.label ?? "This role"} can't open this page — showing their dashboard.`
      );
      router.push(defaultRoute(r));
    } else {
      setNote(null);
    }
  };

  return (
    <ViewAsProvider value={{ role, setRole, step, setStep }}>
      <div
        className="min-h-screen flex bg-gray-50 text-gray-900"
        style={{
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
        }}
      >
        <Sidebar pathname={pathname} />
        <div className="flex-1 min-w-0 flex flex-col">
          <TopBar
            role={role}
            onSwitch={handleSwitch}
            pathname={pathname}
            step={step}
            onStep={setStep}
          />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
        {note && <PreviewNote text={note} onClose={() => setNote(null)} />}
      </div>
    </ViewAsProvider>
  );
}

function Sidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-gray-200 bg-white">
      <div className="h-12 px-4 flex items-center gap-2 border-b border-gray-200">
        <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
        <span
          className="text-xs font-semibold tracking-[0.18em] text-gray-900"
          style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
        >
          ART-EEP
        </span>
      </div>

      <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5">
        <NavSectionLabel>Workspace</NavSectionLabel>
        {PRIMARY_NAV.map((item) => (
          <NavLink key={item.label} item={item} pathname={pathname} />
        ))}

        <NavSectionLabel className="mt-4">More</NavSectionLabel>
        {SECONDARY_NAV.map((item) => (
          <NavLink key={item.label} item={item} pathname={pathname} />
        ))}
      </nav>

      <div className="border-t border-gray-200 px-4 py-3 text-[11px] text-gray-500">
        <p className="font-medium text-gray-700">Mockup playground</p>
        <p className="leading-snug mt-0.5">
          Live preview of ART-EEP surfaces. Changes ship via Claude → main → Vercel.
        </p>
      </div>
    </aside>
  );
}

function NavSectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`px-2 py-1 text-[10px] uppercase tracking-wider font-semibold text-gray-400 ${className ?? ""}`}
      style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
    >
      {children}
    </p>
  );
}

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = item.match?.(pathname) ?? false;
  const Icon = item.icon;
  const baseCls =
    "group inline-flex items-center gap-2.5 h-8 px-2 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20";

  if (item.disabled || !item.href) {
    return (
      <span
        className={`${baseCls} text-gray-400 cursor-not-allowed`}
        title={item.hint}
      >
        <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
        <span className="flex-1 truncate">{item.label}</span>
        {item.hint && (
          <span
            className="text-[9px] uppercase tracking-wider text-gray-400 bg-gray-100 border border-gray-200 rounded px-1 py-0.5"
            style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
          >
            {item.hint}
          </span>
        )}
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      className={`${baseCls} ${
        active
          ? "bg-violet-50 text-violet-700 font-medium"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Icon
        className={`w-3.5 h-3.5 ${active ? "text-violet-600" : "text-gray-500"}`}
        strokeWidth={1.75}
      />
      <span className="flex-1 truncate">{item.label}</span>
    </Link>
  );
}

function TopBar({
  role,
  onSwitch,
  pathname,
  step,
  onStep,
}: {
  role: string;
  onSwitch: (r: string) => void;
  pathname: string;
  step: string;
  onStep: (s: string) => void;
}) {
  return (
    <header className="h-12 bg-white border-b border-gray-200 px-4 flex items-center gap-4">
      <div className="hidden sm:flex items-center gap-2 h-8 px-2.5 rounded-md border border-gray-200 bg-gray-50 max-w-md flex-1">
        <Search className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />
        <input
          type="text"
          placeholder="Search sessions, people, or knowledge"
          className="bg-transparent outline-none text-[12px] text-gray-700 placeholder:text-gray-400 flex-1 min-w-0"
        />
        <span
          className="text-[10px] text-gray-400 border border-gray-200 rounded px-1 py-0.5"
          style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
        >
          ⌘K
        </span>
      </div>

      <div className="flex-1" />

      <NotificationsButton />

      <StateSwitcher pathname={pathname} role={role} step={step} onStep={onStep} />

      <ViewAsButton role={role} onSwitch={onSwitch} />
    </header>
  );
}

function StateSwitcher({
  pathname,
  role,
  step,
  onStep,
}: {
  pathname: string;
  role: string;
  step: string;
  onStep: (s: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const states = viewStates(pathname, role);
  if (states.length <= 1) return null;
  const currentId = step || defaultStateFor(pathname, role);
  const current = states.find((s) => s.id === currentId) ?? states[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 h-8 px-2.5 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 text-[12px] focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span
          className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold hidden lg:inline"
          style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
        >
          State
        </span>
        <span className="font-medium text-gray-900">{current.label}</span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-11 w-56 rounded-xl border border-gray-200 bg-white shadow-lg z-50 overflow-hidden"
        >
          <div className="px-3 py-2 border-b border-gray-200">
            <p
              className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold"
              style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
            >
              State
            </p>
          </div>
          <ul className="py-1">
            {states.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => {
                    onStep(s.id);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 text-left focus:outline-none focus:bg-gray-50"
                >
                  <span className="flex-1 min-w-0 text-[12px] text-gray-900 leading-tight">
                    {s.label}
                  </span>
                  {s.id === current.id && (
                    <Check className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                  )}
                </button>
              </li>
            ))}
          </ul>
          <div className="px-3 py-1.5 border-t border-gray-200 bg-gray-50/40">
            <p className="text-[10px] text-gray-500">Preview · jump to any state of this view</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ViewAsButton({ role, onSwitch }: { role: string; onSwitch: (r: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const cur = ROLES.find((r) => r.id === role) ?? ROLES[0];

  return (
    <div className="relative pl-2 border-l border-gray-200" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 h-8 px-1 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 text-[11px] font-semibold inline-flex items-center justify-center">
          {cur.initials}
        </div>
        <div className="text-[11px] text-gray-700 hidden lg:block text-left">
          <div className="font-medium text-gray-900 leading-tight">{cur.label}</div>
          <div className="text-gray-500 leading-tight">{cur.sub}</div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-11 w-60 rounded-xl border border-gray-200 bg-white shadow-lg z-50 overflow-hidden"
        >
          <div className="px-3 py-2 border-b border-gray-200">
            <p
              className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold"
              style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
            >
              Viewing as
            </p>
          </div>
          <ul className="py-1">
            {ROLES.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSwitch(r.id);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 text-left focus:outline-none focus:bg-gray-50"
                >
                  <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-[10px] font-semibold inline-flex items-center justify-center shrink-0">
                    {r.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium text-gray-900 leading-tight">{r.label}</div>
                    <div className="text-[10px] text-gray-500 leading-tight">{r.sub}</div>
                  </div>
                  {r.id === role && <Check className="w-3.5 h-3.5 text-violet-600 shrink-0" />}
                </button>
              </li>
            ))}
          </ul>
          <div className="px-3 py-1.5 border-t border-gray-200 bg-gray-50/40">
            <p className="text-[10px] text-gray-500">Preview · switches the whole app</p>
          </div>
        </div>
      )}
    </div>
  );
}

function PreviewNote({ text, onClose }: { text: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100%-2rem)]">
      <div className="flex items-start gap-2 rounded-lg bg-slate-900 text-slate-100 px-4 py-2.5 shadow-lg">
        <Info className="w-4 h-4 mt-0.5 shrink-0 text-slate-300" strokeWidth={1.75} />
        <p className="text-[12px] leading-snug flex-1">{text}</p>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 shrink-0"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

type Notification = {
  id: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  tone: "violet" | "rose" | "yellow" | "emerald" | "gray";
  title: string;
  detail: string;
  time: string;
  href?: string;
};

const NOTIFICATIONS: Notification[] = [
  {
    id: "n-kltran-urgent",
    icon: AlertOctagon,
    tone: "rose",
    title: "Khánh Linh Trần is urgent",
    detail: "2 days until departure · awaiting your initiation",
    time: "38m",
    href: "/session/new",
  },
  {
    id: "n-minhle-committed",
    icon: CheckCircle2,
    tone: "emerald",
    title: "Minh Lê committed to knowledge graph",
    detail: "487 entries committed · Knowledge Graph access ready for the Senior Backend Engineer role",
    time: "2h",
    href: "/session/minh-le",
  },
  {
    id: "n-minhle-seeding",
    icon: Sparkles,
    tone: "violet",
    title: "Minh Lê seeding finished",
    detail: "Knowledge map ready · question queue ready",
    time: "4h",
    href: "/session/minh-le",
  },
];

function NotificationsButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-8 w-8 rounded-md hover:bg-gray-100 inline-flex items-center justify-center text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 relative"
        title="Notifications"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Bell className="w-3.5 h-3.5" strokeWidth={1.75} />
        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-10 w-80 rounded-xl border border-gray-200 bg-white shadow-lg z-50 overflow-hidden"
        >
          <div className="px-4 py-2.5 border-b border-gray-200 flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-900">Notifications</p>
            <button
              type="button"
              className="text-[11px] text-violet-700 hover:text-violet-900"
            >
              Mark all as read
            </button>
          </div>
          <ul className="max-h-96 overflow-y-auto divide-y divide-gray-100">
            {NOTIFICATIONS.map((n) => (
              <NotificationItem key={n.id} n={n} onClose={() => setOpen(false)} />
            ))}
          </ul>
          <div className="px-4 py-2 border-t border-gray-200 bg-gray-50/40">
            <p
              className="text-[10px] text-gray-500"
              style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
            >
              {NOTIFICATIONS.length} unread · feed updates in near-real-time
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationItem({
  n,
  onClose,
}: {
  n: Notification;
  onClose: () => void;
}) {
  const toneCls = {
    violet: "bg-violet-50 text-violet-700 border-violet-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    gray: "bg-gray-50 text-gray-600 border-gray-200",
  }[n.tone];

  const body = (
    <div className="flex items-start gap-2.5 px-4 py-3">
      <span
        className={`w-7 h-7 rounded-md border inline-flex items-center justify-center shrink-0 ${toneCls}`}
      >
        <n.icon className="w-3.5 h-3.5" strokeWidth={1.75} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-gray-900 font-medium leading-snug">
          {n.title}
        </p>
        <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
          {n.detail}
        </p>
      </div>
      <span
        className="text-[10px] text-gray-500 shrink-0"
        style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
      >
        {n.time}
      </span>
    </div>
  );

  if (!n.href) {
    return <li>{body}</li>;
  }
  return (
    <li>
      <Link
        href={n.href}
        onClick={onClose}
        className="block hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
      >
        {body}
      </Link>
    </li>
  );
}
