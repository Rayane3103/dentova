export default function AdminLoading() {
  return (
    <div className="admin-loading-enter">
      {/* Header skeleton */}
      <div className="mb-6">
        <div className="h-7 w-48 rounded-lg bg-slate-200 animate-pulse" />
        <div className="mt-1.5 h-4 w-72 rounded-lg bg-slate-100 animate-pulse" />
      </div>

      {/* Content skeleton — card with table rows */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div className="space-y-1">
            <div className="h-5 w-40 rounded-lg bg-slate-200 animate-pulse" />
            <div className="h-3.5 w-24 rounded bg-slate-100 animate-pulse" />
          </div>
          <div className="h-8 w-52 rounded-lg bg-slate-100 animate-pulse" />
        </div>
        <div className="divide-y divide-slate-50">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              className="flex items-center gap-4 px-4 py-3"
              key={i}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="h-9 w-9 shrink-0 rounded-lg bg-slate-100 animate-pulse" />
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="h-4 w-48 rounded bg-slate-100 animate-pulse" />
                <div className="h-3 w-28 rounded bg-slate-50 animate-pulse" />
              </div>
              <div className="hidden sm:block h-4 w-24 rounded bg-slate-100 animate-pulse" />
              <div className="hidden md:block h-4 w-16 rounded bg-slate-50 animate-pulse" />
              <div className="hidden lg:block h-5 w-14 rounded-full bg-slate-100 animate-pulse" />
              <div className="ml-auto flex gap-1">
                <div className="h-8 w-8 rounded-lg bg-slate-100 animate-pulse" />
                <div className="h-8 w-8 rounded-lg bg-slate-100 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5">
          <div className="h-4 w-32 rounded bg-slate-100 animate-pulse" />
          <div className="flex gap-2">
            <div className="h-8 w-20 rounded-lg bg-slate-100 animate-pulse" />
            <div className="h-8 w-12 rounded-lg bg-slate-100 animate-pulse" />
            <div className="h-8 w-20 rounded-lg bg-slate-100 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
