import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SponsorForm } from "@/components/admin/SponsorForm";
import { tryConnectToDatabase } from "@/lib/db/connect";
import { Sponsor } from "@/models/Sponsor";

type EditSponsorPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditSponsorPage({ params }: EditSponsorPageProps) {
  const { id } = await params;

  if (!(await tryConnectToDatabase())) {
    notFound();
  }

  const sponsor = (await Sponsor.findById(id).lean()) as Record<string, unknown> | null;

  if (!sponsor) {
    notFound();
  }

  return (
    <>
      <AdminHeader title="Modifier le sponsor" />
      <div className="mt-5">
        <SponsorForm
          sponsorId={id}
          initialValues={{
            active: Boolean(sponsor.active),
            imagePublicId: sponsor.imagePublicId ? String(sponsor.imagePublicId) : undefined,
            imageUrl: String(sponsor.imageUrl),
            name: String(sponsor.name),
            order: Number(sponsor.order ?? 0),
            websiteUrl: sponsor.websiteUrl ? String(sponsor.websiteUrl) : undefined
          }}
        />
      </div>
    </>
  );
}
