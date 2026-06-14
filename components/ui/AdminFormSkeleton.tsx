/**
 * Loading skeleton for admin create/edit form pages.
 * Shows a card with placeholder form fields.
 */

export function AdminFormSkeleton({
  fields = 6,
  title = "Chargement..."
}: {
  fields?: number;
  title?: string;
}) {
  return (
    <div className="admin-loading-enter">
      {/* Header */}
      <div className="mb-6">
        <div className="h-7 w-48 rounded-lg bg-slate-200 animate-pulse" />
        <div className="mt-1.5 h-4 w-56 rounded-lg bg-slate-100 animate-pulse" />
      </div>

      {/* Form card */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="space-y-5 p-6">
          {Array.from({ length: fields }).map((_, i) => (
            <div
              key={i}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="mb-1.5 h-4 w-24 rounded bg-slate-200 animate-pulse" />
              <div className="h-10 w-full rounded-lg bg-slate-100 animate-pulse" />
            </div>
          ))}

          <div className="flex items-center gap-3 pt-2">
            <div className="h-10 w-32 rounded-full bg-dentova-magenta/20 animate-pulse" />
            <div className="h-10 w-24 rounded-full bg-slate-100 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
