"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  AlertOctagon,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

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
    href: "/session/minh-le",
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
  { label: "Team guide", href: "/guide", icon: BookOpen, match: (p) => p.startsWith("/guide") },
  { label: "Help", icon: HelpCircle, disabled: true },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div
      className="min-h-screen flex bg-gray-50 text-gray-900"
      style={{
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
      }}
    >
      <Sidebar pathname={pathname} />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
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

function TopBar() {
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

      <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
        <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 text-[11px] font-semibold inline-flex items-center justify-center">
          HV
        </div>
        <div className="text-[11px] text-gray-700 hidden lg:block">
          <div className="font-medium text-gray-900 leading-tight">Hà Vy</div>
          <div className="text-gray-500 leading-tight">Manager · Engineering</div>
        </div>
      </div>
    </header>
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

// CL-118 · the `n-pha-review` Phương Anh notification is removed
// (Phương Anh / Sales is out of POC scope; the `/session/phuong-anh`
// route 404s).
// CL-112 · `n-minhle-committed` uses the post-commit vocabulary
// "entries", not "items".
// CL-113 / CL-116 · `n-minhle-committed` no longer says "playbook";
// the post-commit beat is Knowledge Graph access readiness for the
// Newcomer role.
// CL-114 · `n-minhle-committed` no longer names the successor
// ("Trần Hữu Nam"). Newcomer identity is RBAC-flagged at KG access
// time, not session-time; the role string ("Senior Backend Engineer")
// is what role-customized prompts key off.
// CL-098 · `n-minhle-seeding` no longer says "interview ready to
// schedule" — the live voice interview (UC-HO-02) is deferred to
// Phase 2. POC capture is the async question queue (CL-098/099),
// so the seeding-complete beat ends with the queue being ready.
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
