"use client";

import { AdminNavLinks } from "@/components/admin/AdminNavLinks";

export function AdminSidebar() {
  return (
    <aside className="hidden w-[220px] shrink-0 border-r border-dentova-navy/10 bg-white lg:block">
      <div className="sticky top-[76px] flex max-h-[calc(100vh-76px)] flex-col gap-5 overflow-y-auto px-3 py-5">
        <div className="px-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-dentova-muted">
            Administration
          </p>
          <p className="mt-1 text-sm font-semibold text-dentova-navy">Dentova Console</p>
        </div>
        <AdminNavLinks />
      </div>
    </aside>
  );
}
