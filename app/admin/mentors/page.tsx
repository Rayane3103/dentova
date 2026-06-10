import { Plus } from "lucide-react";
import Image from "next/image";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminCardClassName } from "@/components/admin/admin-ui";
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
      <AdminHeader
        actions={
          <Button asChild href="/admin/mentors/new" size="sm">
            <Plus className="h-3.5 w-3.5" />
            Nouveau mentor
          </Button>
        }
        title="Mentors"
      />
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {mentors.length === 0 ? (
          <Card className={`${adminCardClassName} col-span-full p-5 text-sm text-dentova-muted`}>
            Aucun mentor ajoute.
          </Card>
        ) : (
          mentors.map((mentor) => (
            <Card className={`${adminCardClassName} overflow-hidden`} key={mentor.id}>
              <div className="relative aspect-[4/3] bg-dentova-ice">
                <Image alt={mentor.name} className="object-cover" fill src={mentor.imageUrl} />
              </div>
              <div className="space-y-2.5 p-4">
                <h2 className="text-sm font-bold text-dentova-navy">{mentor.name}</h2>
                <p className="text-xs text-dentova-muted">{mentor.title}</p>
                <div className="flex gap-2 pt-1">
                  <Button
                    asChild
                    href={`/admin/mentors/${mentor.id}/edit`}
                    size="sm"
                    variant="outline"
                  >
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
