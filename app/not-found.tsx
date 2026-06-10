import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-dentova-canvas px-6">
      <div className="max-w-xl text-center">
        <p className="text-lg font-bold text-dentova-teal">404</p>
        <h1 className="mt-3 text-5xl font-extrabold text-dentova-graphite">
          Page introuvable
        </h1>
        <p className="mt-4 text-xl text-dentova-muted">
          Cette page n&apos;existe pas encore ou a ete deplacee.
        </p>
        <Button asChild className="mt-8" href="/">
          Retour a l&apos;accueil
        </Button>
      </div>
    </main>
  );
}
