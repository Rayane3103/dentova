import type { ReactNode } from "react";

export function AdminHeader({
  actions,
  description,
  title
}: {
  actions?: ReactNode;
  description?: string;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-bold tracking-tight text-dentova-navy sm:text-2xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-dentova-muted">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
