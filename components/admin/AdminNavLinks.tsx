"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavGroups, isAdminNavActive } from "@/lib/admin/navigation";
import { cn } from "@/lib/utils";

export function AdminNavLinks({
  onNavigate,
  variant = "sidebar"
}: {
  onNavigate?: () => void;
  variant?: "sidebar" | "drawer";
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigation admin" className="space-y-5">
      {adminNavGroups.map((group) => (
        <div key={group.label}>
          <p
            className={cn(
              "mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-dentova-muted/80",
              variant === "drawer" && "text-dentova-muted"
            )}
          >
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = isAdminNavActive(pathname, item.href, item.exact);
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    className={cn(
                      "dentova-focus flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-semibold transition",
                      active
                        ? "bg-dentova-navy text-white shadow-sm"
                        : "text-dentova-navy/70 hover:bg-dentova-ice hover:text-dentova-navy"
                    )}
                    href={item.href}
                    onClick={onNavigate}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
