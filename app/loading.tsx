import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-dentova-canvas">
      <div className="flex items-center gap-3 rounded-lg border border-dentova-graphite/10 bg-white px-5 py-4 text-dentova-graphite shadow-card">
        <LoaderCircle className="h-5 w-5 animate-spin text-dentova-teal" />
        <span className="font-semibold">Chargement de Dentova...</span>
      </div>
    </main>
  );
}
