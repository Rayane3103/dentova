import Image from "next/image";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { tryConnectToDatabase } from "@/lib/db/connect";
import { serializeMentor } from "@/lib/data/serialize";
import { Mentor } from "@/models/Mentor";

export default async function AdminMentorsPage() {
  let mentors: ReturnType<typeof serializeMentor>[] = [];

  if (await tryConnectToDatabase()) {
    const docs = await Mentor.find({}).sort({ order: 1 }).lean();
    mentors = docs.map((doc) => serializeMentor(doc as Record<string, unknown>));
  }

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <AdminHeader title="Mentors" />
        <Button asChild href="/admin/mentors/new">
          Nouveau mentor
        </Button>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mentors.length === 0 ? (
          <Card className="col-span-full p-6 text-dentova-muted">Aucun mentor ajoute.</Card>
        ) : (
          mentors.map((mentor) => (
            <Card className="overflow-hidden" key={mentor.id}>
              <div className="relative aspect-square bg-dentova-ice">
                <Image alt={mentor.name} className="object-cover" fill src={mentor.imageUrl} />
              </div>
              <div className="space-y-3 p-5">
                <h2 className="text-xl font-extrabold text-dentova-navy">{mentor.name}</h2>
                <p className="text-sm text-dentova-muted">{mentor.title}</p>
                <div className="flex gap-2">
                  <Button asChild href={`/admin/mentors/${mentor.id}/edit`} size="sm" variant="outline">
                    Modifier
                  </Button>
                  <AdminDeleteButton endpoint={`/api/admin/mentors/${mentor.id}`} />
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </AdminShell>
  );
}
