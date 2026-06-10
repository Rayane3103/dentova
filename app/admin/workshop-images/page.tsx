import Image from "next/image";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <AdminHeader title="Galerie" />
        <Button asChild href="/admin/workshop-images/new">
          Ajouter une image
        </Button>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {images.length === 0 ? (
          <Card className="col-span-full p-6 text-dentova-muted">
            Aucune image de galerie. Ajoutez vos photos d&apos;ateliers ici.
          </Card>
        ) : (
          images.map((image) => (
            <Card className="overflow-hidden" key={image.id}>
              <div className="relative aspect-[4/3] bg-dentova-ice">
                <Image
                  alt={image.title}
                  className="object-cover"
                  fill
                  sizes="(min-width: 1024px) 30vw, 92vw"
                  src={image.imageUrl}
                />
              </div>
              <div className="space-y-3 p-5">
                <h2 className="text-xl font-extrabold text-dentova-navy">{image.title}</h2>
                <p className="text-sm text-dentova-muted">{image.description}</p>
                <div className="flex gap-2">
                  <Button asChild href={`/admin/workshop-images/${image.id}/edit`} size="sm" variant="outline">
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
