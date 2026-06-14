/**
 * Reusable loading skeleton for admin listing pages (table layout).
 * Matches the structure of AdminHeader + data table used across the admin panel.
 */

export function AdminPageSkeleton({
  rows = 5,
  headerTitle = true
}: {
  rows?: number;
  headerTitle?: boolean;
}) {
  return (
    <div className="admin-loading-enter">
      {/* AdminHeader skeleton */}
      <div className="mb-6">
        {headerTitle ? (
          <>
            <div className="h-7 w-48 rounded-lg bg-slate-200 animate-pulse" />
            <div className="mt-1.5 h-4 w-72 rounded-lg bg-slate-100 animate-pulse" />
          </>
        ) : (
          <div className="h-7 w-40 rounded-lg bg-slate-200 animate-pulse" />
        )}
      </div>

      {/* Table card skeleton */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div className="h-5 w-32 rounded-lg bg-slate-200 animate-pulse" />
          <div className="h-8 w-48 rounded-lg bg-slate-100 animate-pulse" />
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-50">
          {Array.from({ length: rows }).map((_, i) => (
            <div
              className="flex items-center gap-4 px-4 py-3"
              key={i}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="h-8 w-8 shrink-0 rounded-lg bg-slate-100 animate-pulse" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="h-4 w-48 rounded bg-slate-100 animate-pulse" />
                <div className="h-3 w-28 rounded bg-slate-50 animate-pulse" />
              </div>
              <div className="hidden h-4 w-20 rounded bg-slate-100 animate-pulse sm:block" />
              <div className="hidden h-4 w-16 rounded bg-slate-50 animate-pulse md:block" />
              <div className="hidden h-5 w-14 rounded-full bg-slate-100 animate-pulse lg:block" />
              <div className="ml-auto flex gap-1">
                <div className="h-8 w-8 rounded-lg bg-slate-100 animate-pulse" />
                <div className="h-8 w-8 rounded-lg bg-slate-100 animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination footer */}
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5">
          <div className="h-4 w-32 rounded bg-slate-100 animate-pulse" />
          <div className="flex gap-2">
            <div className="h-8 w-20 rounded-lg bg-slate-100 animate-pulse" />
            <div className="h-8 w-8 rounded-lg bg-slate-100 animate-pulse" />
            <div className="h-8 w-20 rounded-lg bg-slate-100 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * CRM-style skeleton (wider rows with more columns) — used for Reservations, Messages, Signups.
 */
export function AdminCRMSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="admin-loading-enter">
      <div className="mb-6">
        <div className="h-7 w-48 rounded-lg bg-slate-200 animate-pulse" />
        <div className="mt-1.5 h-4 w-72 rounded-lg bg-slate-100 animate-pulse" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Search + filters toolbar */}
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3">
          <div className="h-9 w-64 rounded-lg bg-slate-100 animate-pulse" />
          <div className="h-9 w-28 rounded-lg bg-slate-100 animate-pulse" />
          <div className="h-9 w-28 rounded-lg bg-slate-100 animate-pulse" />
        </div>

        <div className="divide-y divide-slate-50">
          {Array.from({ length: rows }).map((_, i) => (
            <div
              className="flex items-center gap-3 px-4 py-3"
              key={i}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="h-8 w-8 shrink-0 rounded-full bg-slate-100 animate-pulse" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="h-4 w-36 rounded bg-slate-100 animate-pulse" />
                <div className="h-3 w-48 rounded bg-slate-50 animate-pulse" />
              </div>
              <div className="hidden h-4 w-24 rounded bg-slate-100 animate-pulse md:block" />
              <div className="hidden h-4 w-20 rounded bg-slate-100 animate-pulse sm:block" />
              <div className="h-5 w-16 rounded-full bg-slate-100 animate-pulse" />
              <div className="ml-auto h-8 w-8 rounded-lg bg-slate-100 animate-pulse" />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5">
          <div className="h-4 w-28 rounded bg-slate-100 animate-pulse" />
          <div className="flex gap-2">
            <div className="h-8 w-20 rounded-lg bg-slate-100 animate-pulse" />
            <div className="h-8 w-20 rounded-lg bg-slate-100 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
