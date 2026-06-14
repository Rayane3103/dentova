"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  marketerNavGroups,
  isMarketerNavActive
} from "@/lib/marketer/navigation";
import { cn } from "@/lib/utils";

export function MarketerNavLinks({
  onNavigate,
  variant = "sidebar"
}: {
  onNavigate?: () => void;
  variant?: "sidebar" | "drawer";
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);

  const toggleGroup = (label: string) => {
    setCollapsed((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="space-y-0.5">
      {marketerNavGroups.map((group) => {
        const isCollapsed = collapsed[group.label] ?? false;

        return (
          <div key={group.label} className="pb-1.5">
            <button
              aria-expanded={!isCollapsed}
              className={cn(
                "flex w-full items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] transition-colors",
                variant === "sidebar"
                  ? "text-dentova-lavender/60 hover:text-dentova-lavender"
                  : "text-slate-400 hover:text-slate-600"
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
                  const active =
                    pendingSlug === item.href ||
                    isMarketerNavActive(pathname, item.href, item.exact);
                  const Icon = item.icon;

                  return (
                    <li key={item.href}>
                      <Link
                        className={cn(
                          "group flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150",
                          variant === "sidebar"
                            ? cn(
                                active
                                  ? "bg-white/15 text-white"
                                  : "text-dentova-lavender/70 hover:bg-white/8 hover:text-white"
                              )
                            : cn(
                                active
                                  ? "bg-dentova-navy/8 text-dentova-navy"
                                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                              )
                        )}
                        href={item.href}
                        onClick={() => {
                          setPendingSlug(item.href);
                          requestAnimationFrame(() =>
                            requestAnimationFrame(() => setPendingSlug(null))
                          );
                          onNavigate?.();
                        }}
                        prefetch={true}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            variant === "sidebar"
                              ? cn(
                                  active
                                    ? "text-dentova-teal-400"
                                    : "text-dentova-lavender/50 group-hover:text-dentova-lavender/80"
                                )
                              : cn(
                                  active
                                    ? "text-dentova-navy"
                                    : "text-slate-400 group-hover:text-slate-500"
                                )
                          )}
                        />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-dentova-teal-400/20 px-1.5 text-[10px] font-bold text-dentova-teal-400">
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
