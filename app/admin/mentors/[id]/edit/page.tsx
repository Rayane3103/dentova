import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { MentorForm } from "@/components/admin/MentorForm";
import { tryConnectToDatabase } from "@/lib/db/connect";
import { Mentor } from "@/models/Mentor";

type EditMentorPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditMentorPage({ params }: EditMentorPageProps) {
  const { id } = await params;

  if (!(await tryConnectToDatabase())) {
    notFound();
  }

  const mentor = (await Mentor.findById(id).lean()) as Record<string, unknown> | null;

  if (!mentor) {
    notFound();
  }

  return (
    <>
      <AdminHeader title="Modifier le formateur" />
      <div className="mt-5">
        <MentorForm
          initialValues={{
            active: Boolean(mentor.active),
            bio: mentor.bio ? String(mentor.bio) : "",
            imagePublicId: mentor.imagePublicId ? String(mentor.imagePublicId) : undefined,
            imageUrl: String(mentor.imageUrl),
            name: String(mentor.name),
            order: Number(mentor.order ?? 0),
            showOnHomepage: Boolean(mentor.showOnHomepage),
            specialty: mentor.specialty ? String(mentor.specialty) : "",
            title: String(mentor.title)
          }}
          mentorId={id}
        />
      </div>
    </>
  );
}
