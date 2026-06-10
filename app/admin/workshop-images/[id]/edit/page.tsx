import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { WorkshopImageForm } from "@/components/admin/WorkshopImageForm";
import { tryConnectToDatabase } from "@/lib/db/connect";
import { WorkshopImage } from "@/models/WorkshopImage";

type EditWorkshopImagePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditWorkshopImagePage({ params }: EditWorkshopImagePageProps) {
  const { id } = await params;

  if (!(await tryConnectToDatabase())) {
    notFound();
  }

  const image = (await WorkshopImage.findById(id).lean()) as Record<string, unknown> | null;

  if (!image) {
    notFound();
  }

  return (
    <AdminShell>
      <AdminHeader title={"Modifier l'image"} />
      <div className="mt-5">
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
