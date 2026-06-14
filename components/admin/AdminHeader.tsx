import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function AdminHeader({
  actions,
  description,
  icon: Icon,
  title
}: {
  actions?: ReactNode;
  description?: string;
  icon?: LucideIcon;
  title: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-dentova-gradient shadow-lg">
            <Icon className="h-6 w-6 text-white" />
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
