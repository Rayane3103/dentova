import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { WorkshopImageForm } from "@/components/admin/WorkshopImageForm";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db/connect";
import { WorkshopImage } from "@/models/WorkshopImage";

type EditWorkshopImagePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditWorkshopImagePage({ params }: EditWorkshopImagePageProps) {
  const { id } = await params;

  if (!hasDatabaseConfig()) {
    notFound();
  }

  await connectToDatabase();
  const image = (await WorkshopImage.findById(id).lean()) as Record<string, unknown> | null;

  if (!image) {
    notFound();
  }

  return (
    <AdminShell>
      <h1 className="text-4xl font-extrabold text-dentova-navy">Modifier l&apos;image</h1>
      <div className="mt-8">
        <WorkshopImageForm
          imageId={id}
          initialValues={{
            active: Boolean(image.active),
            description: image.description ? String(image.description) : "",
            imagePublicId: image.imagePublicId ? String(image.imagePublicId) : undefined,
            imageUrl: String(image.imageUrl),
            order: Number(image.order ?? 0),
            title: String(image.title)
          }}
        />
      </div>
    </AdminShell>
  );
}
