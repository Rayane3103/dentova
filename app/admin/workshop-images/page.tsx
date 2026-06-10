import { Plus } from "lucide-react";
import Image from "next/image";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminCardClassName } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
    <AdminShell>
      <AdminHeader
        actions={
          <Button asChild href="/admin/workshop-images/new" size="sm">
            <Plus className="h-3.5 w-3.5" />
            Ajouter une image
          </Button>
        }
        title="Galerie"
      />
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {images.length === 0 ? (
          <Card className={`${adminCardClassName} col-span-full p-5 text-sm text-dentova-muted`}>
            Aucune image de galerie. Ajoutez vos photos d&apos;ateliers ici.
          </Card>
        ) : (
          images.map((image) => (
            <Card className={`${adminCardClassName} overflow-hidden`} key={image.id}>
              <div className="relative aspect-[4/3] bg-dentova-ice">
                <Image
                  alt={image.title}
                  className="object-cover"
                  fill
                  sizes="(min-width: 1280px) 25vw, 45vw"
                  src={image.imageUrl}
                />
              </div>
              <div className="space-y-2.5 p-4">
                <h2 className="text-sm font-bold text-dentova-navy">{image.title}</h2>
                {image.description ? (
                  <p className="line-clamp-2 text-xs text-dentova-muted">{image.description}</p>
                ) : null}
                <div className="flex gap-2 pt-1">
                  <Button
                    asChild
                    href={`/admin/workshop-images/${image.id}/edit`}
                    size="sm"
                    variant="outline"
                  >
                    Modifier
                  </Button>
                  <AdminDeleteButton endpoint={`/api/admin/workshop-images/${image.id}`} />
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </AdminShell>
  );
}
