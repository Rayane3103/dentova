export default function PixelsLoading() {
  return (
    <div className="space-y-5">
      <div className="h-9 w-48 animate-pulse rounded-lg bg-slate-200" />
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="space-y-4">
          <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
          <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
