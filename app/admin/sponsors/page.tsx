import { Handshake, Pencil, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { EmptyAdminState } from "@/components/admin/EmptyAdminState";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/Button";
import { serializeSponsor } from "@/lib/data/serialize";
import { tryConnectToDatabase } from "@/lib/db/connect";
import { Sponsor } from "@/models/Sponsor";

export default async function SponsorsPage() {
  let sponsors: ReturnType<typeof serializeSponsor>[] = [];

  if (await tryConnectToDatabase()) {
    const docs = await Sponsor.find({}).sort({ order: 1, name: 1 }).lean();
    sponsors = docs.map((doc) => serializeSponsor(doc as Record<string, unknown>));
  }

  return (
    <>
      <AdminHeader
        actions={
          <Button asChild href="/admin/sponsors/new" size="sm">
            <Plus className="h-3.5 w-3.5" />
            Ajouter un sponsor
          </Button>
        }
        description="Gerez les logos qui defilent sur la page d'accueil"
        title="Sponsors"
      />
      {sponsors.length === 0 ? (
        <EmptyAdminState
          description="Ajoutez des logos pour afficher la barre de sponsors au-dessus de la galerie."
          icon={Handshake}
          title="Aucun sponsor"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {sponsors.map((sponsor) => (
            <div
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              key={sponsor.id}
            >
              <div className="relative flex h-28 items-center justify-center bg-slate-50 p-6">
                <Image
                  alt={sponsor.name}
                  className="object-contain"
                  fill
                  sizes="(min-width: 1280px) 25vw, 45vw"
                  src={sponsor.imageUrl}
                />
                {!sponsor.active && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                    <StatusBadge variant="inactive" label="Inactif" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-slate-800">{sponsor.name}</h3>
                {sponsor.websiteUrl ? (
                  <p className="mt-0.5 truncate text-xs text-slate-400">
                    {sponsor.websiteUrl}
                  </p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    className="dentova-focus inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                    href={`/admin/sponsors/${sponsor.id}/edit`}
                  >
                    <Pencil className="mr-1 h-3 w-3" />
                    Modifier
                  </Link>
                  <AdminDeleteButton compact endpoint={`/api/admin/sponsors/${sponsor.id}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
