"use client";

import Image from "next/image";
import Link from "next/link";
import { AdminNavLinks } from "@/components/admin/AdminNavLinks";
import { ExternalLink } from "lucide-react";

export function AdminSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col bg-dentova-gradient lg:flex">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/8 px-5">
        <Link
          className="dentova-focus flex items-center gap-3 rounded-lg"
          href="/admin"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <Image
              alt="Dentova"
              className="h-5 w-auto invert"
              height={20}
              src="/brand/logo.svg"
              width={70}
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight text-white">
              Dentova
            </p>
            <p className="text-[10px] font-medium leading-tight text-dentova-teal-400">
              Console
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto px-2 py-4"
        aria-label="Navigation admin"
      >
        <AdminNavLinks variant="sidebar" />
      </nav>

      {/* Footer */}
      <div className="border-t border-white/8 px-4 py-3">
        <Link
          className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-dentova-lavender/50 transition hover:text-dentova-lavender/80"
          href="/"
          target="_blank"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Voir le site public
        </Link>
        <Link
          className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-dentova-lavender/50 transition hover:text-dentova-lavender/80"
          href="/marketer"
          target="_blank"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Marketing
        </Link>
      </div>
    </aside>
  );
}
