"use client";

import {
  Bell,
  BookOpen,
  HelpCircle,
  LogOut,
  Menu,
  MessageSquare,
  Newspaper,
  Plus,
  Search,
  Settings,
  Star,
  Ticket,
  User
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";

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

const quickActions = [
  { href: "/admin/courses/new", label: "Nouveau cours", icon: BookOpen },
  { href: "/admin/posts/new", label: "Nouvel article", icon: Newspaper },
  { href: "/admin/feedback", label: "Avis en attente", icon: Star },
  { href: "/admin/reservations", label: "Réservations", icon: Ticket },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare }
];

type SearchResult = {
  href: string;
  label: string;
  group: string;
};

export function AdminTopBar({ authenticated }: { authenticated: boolean }) {
  const pathname = usePathname();
  const breadcrumbs = segmentsToBreadcrumb(pathname);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const createRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery("");
  }, []);

  useEffect(() => {
    closeSearch();
    setCreateOpen(false);
    setUserOpen(false);
  }, [pathname, closeSearch]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
      if (e.key === "Escape") {
        closeSearch();
        setCreateOpen(false);
        setUserOpen(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [closeSearch]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        closeSearch();
      }
      if (createRef.current && !createRef.current.contains(e.target as Node)) {
        setCreateOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [closeSearch]);

  const searchResults: SearchResult[] = [
    { href: "/admin", label: "Dashboard", group: "Vue d'ensemble" },
    { href: "/admin/courses", label: "Cours", group: "Contenu" },
    { href: "/admin/courses/new", label: "Nouveau cours", group: "Contenu" },
    { href: "/admin/categories", label: "Catégories", group: "Contenu" },
    { href: "/admin/mentors", label: "Mentors", group: "Contenu" },
    { href: "/admin/posts", label: "Blog", group: "Contenu" },
    { href: "/admin/faqs", label: "FAQ", group: "Contenu" },
    { href: "/admin/workshop-images", label: "Galerie", group: "Contenu" },
    { href: "/admin/reservations", label: "Réservations", group: "Demandes" },
    { href: "/admin/signups", label: "Inscriptions", group: "Demandes" },
    { href: "/admin/messages", label: "Messages", group: "Demandes" },
    { href: "/admin/newsletter", label: "Newsletter", group: "Demandes" },
    { href: "/admin/feedback", label: "Avis", group: "Modération" }
  ];

  const filtered = searchQuery
    ? searchResults.filter((r) =>
        r.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:gap-4 sm:px-6">
      {/* Mobile menu trigger */}
      <button
        aria-label="Ouvrir le menu"
        className="dentova-focus -ml-1.5 inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
        type="button"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="hidden min-w-0 flex-1 items-center gap-1 text-sm sm:flex">
        {breadcrumbs.map((crumb, i) => (
          <span className="flex items-center gap-1" key={crumb.href}>
            {i > 0 && (
              <span className="text-slate-300 select-none" aria-hidden>
                /
              </span>
            )}
            {i === breadcrumbs.length - 1 ? (
              <span className="truncate font-semibold text-slate-800">
                {crumb.label}
              </span>
            ) : (
              <Link
                className="truncate text-slate-500 transition hover:text-slate-700"
                href={crumb.href}
              >
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Search */}
        <div ref={searchRef} className="relative">
          <button
            aria-label="Rechercher (Ctrl+K)"
            className="dentova-focus hidden h-9 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 transition hover:border-slate-300 hover:text-slate-600 sm:flex"
            onClick={() => {
              setSearchOpen(true);
              setTimeout(() => searchInputRef.current?.focus(), 100);
            }}
            type="button"
          >
            <Search className="h-4 w-4" />
            <span className="hidden lg:inline">Rechercher...</span>
            <kbd className="ml-4 hidden rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 lg:inline-block">
              Ctrl+K
            </kbd>
          </button>

          {/* Mobile search icon */}
          <button
            aria-label="Rechercher"
            className="dentova-focus inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 sm:hidden"
            onClick={() => {
              setSearchOpen(true);
              setTimeout(() => searchInputRef.current?.focus(), 100);
            }}
            type="button"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Search dropdown */}
          {searchOpen && (
            <div className="absolute right-0 top-full mt-1 w-80 rounded-xl border border-slate-200 bg-white shadow-xl sm:w-96">
              <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2.5">
                <Search className="h-4 w-4 shrink-0 text-slate-400" />
                <input
                  autoFocus
                  className="flex-1 border-none bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une page..."
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                />
                <kbd className="hidden rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 sm:inline-block">
                  ESC
                </kbd>
              </div>
              {searchQuery && (
                <div className="max-h-64 overflow-y-auto p-1">
                  {filtered.length === 0 ? (
                    <p className="px-3 py-6 text-center text-sm text-slate-400">
                      Aucun résultat
                    </p>
                  ) : (
                    filtered.map((result) => (
                      <Link
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                        href={result.href}
                        key={result.href}
                        onClick={closeSearch}
                      >
                        <span className="truncate">{result.label}</span>
                        <span className="ml-auto shrink-0 text-xs text-slate-400">
                          {result.group}
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              )}
              {!searchQuery && (
                <div className="p-2">
                  <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Actions rapides
                  </p>
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Link
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                        href={action.href}
                        key={action.href}
                        onClick={closeSearch}
                      >
                        <Icon className="h-4 w-4 shrink-0 text-slate-400" />
                        {action.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick create */}
        <div ref={createRef} className="relative">
          <button
            aria-expanded={createOpen}
            aria-label="Créer"
            className="dentova-focus inline-flex h-9 items-center gap-1.5 rounded-lg bg-dentova-navy px-3 text-sm font-semibold text-white transition hover:bg-dentova-navy/90 active:bg-dentova-navy/80"
            onClick={() => setCreateOpen((v) => !v)}
            type="button"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Créer</span>
          </button>

          {createOpen && (
            <div className="absolute right-0 top-full mt-1 w-56 rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
              <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Créer un élément
              </p>
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                    href={action.href}
                    key={action.href}
                    onClick={() => setCreateOpen(false)}
                  >
                    <Icon className="h-4 w-4 text-slate-400" />
                    {action.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="dentova-focus relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100"
          type="button"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-dentova-magenta ring-2 ring-white" />
        </button>

        {/* User menu */}
        {authenticated && (
          <div ref={userRef} className="relative">
            <button
              aria-expanded={userOpen}
              aria-label="Menu utilisateur"
              className="dentova-focus ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-dentova-navy text-sm font-semibold text-white transition hover:bg-dentova-navy/90"
              onClick={() => setUserOpen((v) => !v)}
              type="button"
            >
              <User className="h-4 w-4" />
            </button>

            {userOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
                <div className="border-b border-slate-100 px-3 py-2">
                  <p className="text-sm font-semibold text-slate-800">Admin</p>
                  <p className="text-xs text-slate-400">admin@dentova.com</p>
                </div>
                <Link
                  className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
                  href="/"
                >
                  <HelpCircle className="h-4 w-4 text-slate-400" />
                  Voir le site
                </Link>
                <Link
                  className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
                  href="/admin"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  Paramètres
                </Link>
                <div className="border-t border-slate-100 mt-1 pt-1">
                  <form action="/api/admin/logout" method="post">
                    <button
                      className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
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
        )}
      </div>
    </header>
  );
}
