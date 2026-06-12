"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleGroup = (label: string) => {
    setCollapsed((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="space-y-1">
      {adminNavGroups.map((group) => {
        const isCollapsed = collapsed[group.label] ?? false;

        return (
          <div key={group.label} className="pb-1">
            <button
              aria-expanded={!isCollapsed}
              className={cn(
                "flex w-full items-center gap-1.5 px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 transition-colors hover:text-slate-600",
                variant === "drawer" && "text-slate-500"
              )}
              onClick={() => toggleGroup(group.label)}
              type="button"
            >
              <ChevronDown
                className={cn(
                  "h-3 w-3 shrink-0 transition-transform",
                  isCollapsed && "-rotate-90"
                )}
              />
              {group.label}
            </button>

            {!isCollapsed && (
              <ul className="mt-0.5 space-y-0.5">
                {group.items.map((item) => {
                  const active = isAdminNavActive(pathname, item.href, item.exact);
                  const Icon = item.icon;

                  return (
                    <li key={item.href}>
                      <Link
                        className={cn(
                          "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all",
                          active
                            ? "bg-dentova-navy/8 text-dentova-navy"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                        )}
                        href={item.href}
                        onClick={onNavigate}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            active
                              ? "text-dentova-navy"
                              : "text-slate-400 group-hover:text-slate-500"
                          )}
                        />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-dentova-magenta/10 px-1.5 text-[10px] font-bold text-dentova-magenta">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
