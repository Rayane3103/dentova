"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminNavLinks } from "@/components/admin/AdminNavLinks";

export function AdminMobileDrawer() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Trigger button — visible only on mobile */}
      <button
        aria-expanded={open}
        aria-label="Menu admin"
        className="dentova-focus mb-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Menu className="h-4 w-4" />
        Menu
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Fermer le menu"
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            type="button"
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white shadow-2xl">
            {/* Drawer header */}
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-100 px-4">
              <Link
                className="flex items-center gap-2.5"
                href="/admin"
                onClick={() => setOpen(false)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-dentova-navy">
                  <Image
                    alt="Dentova"
                    className="h-5 w-auto invert"
                    height={20}
                    src="/brand/logo.svg"
                    width={70}
                  />
                </div>
                <div>
                  <p className="text-sm font-bold leading-tight text-slate-900">Dentova</p>
                  <p className="text-[10px] font-medium leading-tight text-slate-400">Console</p>
                </div>
              </Link>
              <button
                aria-label="Fermer"
                className="dentova-focus rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer nav */}
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <AdminNavLinks onNavigate={() => setOpen(false)} variant="drawer" />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
