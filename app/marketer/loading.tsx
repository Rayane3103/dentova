export default function MarketerLoading() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50/80">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-dentova-navy border-t-transparent" />
        <p className="text-sm font-medium text-slate-400">
          Chargement du tableau de bord marketing...
        </p>
      </div>
    </div>
  );
}
