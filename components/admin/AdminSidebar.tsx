"use client";

import Image from "next/image";
import Link from "next/link";
import { AdminNavLinks } from "@/components/admin/AdminNavLinks";

export function AdminSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-slate-100 px-4">
        <Link
          className="dentova-focus flex items-center gap-2.5 rounded-lg"
          href="/admin"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-dentova-navy">
            <Image
              alt="Dentova"
              className="h-5 w-auto invert"
              height={20}
              src="/brand/logo.svg"
              width={70}
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight text-slate-900">
              Dentova
            </p>
            <p className="text-[10px] font-medium leading-tight text-slate-400">
              Console
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Navigation admin">
        <AdminNavLinks />
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-100 px-4 py-3">
        <Link
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-slate-400 transition hover:text-slate-600"
          href="/"
          target="_blank"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Voir le site public
        </Link>
      </div>
    </aside>
  );
}
