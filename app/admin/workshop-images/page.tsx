import { ImageIcon, Pencil, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { tryConnectToDatabase } from "@/lib/db/connect";
import { serializeWorkshopImage } from "@/lib/data/serialize";
import { WorkshopImage } from "@/models/WorkshopImage";

export default async function WorkshopImagesPage() {
  let images: ReturnType<typeof serializeWorkshopImage>[] = [];

  if (await tryConnectToDatabase()) {
    const docs = await WorkshopImage.find({}).sort({ order: 1 }).lean();
    images = docs.map((doc) => serializeWorkshopImage(doc as Record<string, unknown>));
  }

  return (
    <>
      <AdminHeader
        actions={
          <Button asChild href="/admin/workshop-images/new" size="sm">
            <Plus className="h-3.5 w-3.5" />
            Ajouter une image
          </Button>
        }
        description="Gérez la galerie photo des ateliers"
        title="Galerie"
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {images.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <ImageIcon className="h-7 w-7 text-slate-400" />
            </div>
            <h3 className="mt-5 text-base font-bold text-slate-800">
              Aucune image
            </h3>
            <p className="mt-1.5 text-sm text-slate-500">
              Ajoutez des photos pour la galerie de votre site.
            </p>
          </div>
        ) : (
          images.map((image) => (
            <div
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              key={image.id}
            >
              <div className="relative aspect-[4/3] bg-slate-100">
                <Image
                  alt={image.title}
                  className="object-cover"
                  fill
                  sizes="(min-width: 1280px) 25vw, 45vw"
                  src={image.imageUrl}
                />
                {!image.active && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                    <StatusBadge variant="inactive" label="Inactif" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-slate-800">
                  {image.title}
                </h3>
                {image.description && (
                  <p className="mt-0.5 line-clamp-2 text-xs text-slate-400">
                    {image.description}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    className="dentova-focus inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                    href={`/admin/workshop-images/${image.id}/edit`}
                  >
                    <Pencil className="mr-1 h-3 w-3" />
                    Modifier
                  </Link>
                  <AdminDeleteButton
                    compact
                    endpoint={`/api/admin/workshop-images/${image.id}`}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
