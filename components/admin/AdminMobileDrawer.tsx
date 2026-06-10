"use client";

import { Menu, X } from "lucide-react";
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
    <div className="mb-4 lg:hidden">
      <button
        aria-expanded={open}
        className="dentova-focus inline-flex items-center gap-2 rounded-lg border border-dentova-navy/10 bg-white px-3 py-2 text-sm font-semibold text-dentova-navy shadow-sm"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Menu className="h-4 w-4" />
        Menu admin
      </button>

      {open ? (
        <>
          <button
            aria-label="Fermer le menu admin"
            className="fixed inset-0 z-40 bg-dentova-navy/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            type="button"
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-dentova-navy/10 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-dentova-navy/10 px-4 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-dentova-muted">
                  Administration
                </p>
                <p className="text-sm font-semibold text-dentova-navy">Dentova Console</p>
              </div>
              <button
                aria-label="Fermer"
                className="dentova-focus rounded-md p-2 text-dentova-navy hover:bg-dentova-ice"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <AdminNavLinks onNavigate={() => setOpen(false)} variant="drawer" />
            </div>
          </aside>
        </>
      ) : null}
    </div>
  );
}
