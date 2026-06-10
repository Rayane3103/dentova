import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
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
    <AdminShell>
      <h1 className="text-4xl font-extrabold text-dentova-navy">Modifier le mentor</h1>
      <div className="mt-8">
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
    </AdminShell>
  );
}
