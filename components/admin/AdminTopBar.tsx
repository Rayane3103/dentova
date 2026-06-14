"use client";

import {
  Bell,
  ChevronDown,
  ExternalLink,
  LogOut,
  Menu,
  User
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const segmentsToBreadcrumb = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: { href: string; label: string }[] = [
    { href: "/admin", label: "Dashboard" }
  ];

  let current = "/admin";
  for (const segment of segments) {
    if (segment === "admin") continue;
    current += `/${segment}`;

    let label = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    if (segment === "new") label = "Nouveau";
    if (/^[a-f0-9]{24}$/i.test(segment)) label = "Modifier";

    breadcrumbs.push({ href: current, label });
  }

  return breadcrumbs;
};

import type { DashboardUser } from "@/components/admin/AdminShell";

export function AdminTopBar({ user }: { user: DashboardUser }) {
  const pathname = usePathname();
  const breadcrumbs = segmentsToBreadcrumb(pathname);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUserOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setUserOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-slate-200/80 bg-white/90 px-5 backdrop-blur-lg sm:px-6">
      {/* Mobile menu trigger */}
      <button
        aria-label="Ouvrir le menu"
        className="dentova-focus -ml-2 inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
        type="button"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="hidden min-w-0 flex-1 items-center gap-2 text-sm sm:flex"
      >
        {breadcrumbs.map((crumb, i) => (
          <span className="flex items-center gap-2" key={crumb.href}>
            {i > 0 && (
              <span className="text-slate-300 select-none" aria-hidden>
                <ChevronDown className="h-3 w-3 -rotate-90" />
              </span>
            )}
            {i === breadcrumbs.length - 1 ? (
              <span className="truncate font-semibold text-slate-800">
                {crumb.label}
              </span>
            ) : (
              <Link
                className="truncate font-medium text-slate-400 transition hover:text-slate-600"
                href={crumb.href}
              >
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          aria-label="Notifications"
          className="dentova-focus relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          type="button"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-dentova-magenta ring-2 ring-white" />
        </button>

        {/* User menu */}
        <div ref={userRef} className="relative">
          <button
            aria-expanded={userOpen}
            aria-label="Menu utilisateur"
            className="dentova-focus ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-dentova-gradient text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
            onClick={() => setUserOpen((v) => !v)}
            type="button"
          >
            <User className="h-4 w-4" />
          </button>

          {userOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white py-1 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {user.email}
                </p>
              </div>
                <Link
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50"
                  href="/"
                  target="_blank"
                >
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                  Voir le site
                </Link>
                <Link
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50"
                  href="/marketer"
                  target="_blank"
                >
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                  Marketing
                </Link>
                <div className="mt-1 border-t border-slate-100 pt-1">
                  <form action="/api/auth/logout" method="post">
                    <button
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
                      type="submit"
                    >
                      <LogOut className="h-4 w-4" />
                      Déconnexion
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
    </header>
  );
}
