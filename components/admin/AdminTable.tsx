import { Eye, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { Card } from "@/components/ui/Card";
import { formatShortDate } from "@/lib/format";
import type { Course } from "@/types";

export function AdminTable({
  compact = false,
  courses
}: {
  compact?: boolean;
  courses: Course[];
}) {
  return (
    <Card className="mt-8 overflow-hidden rounded-xl p-6">
      {!compact ? (
        <h2 className="text-2xl font-extrabold text-dentova-navy">Tous les cours</h2>
      ) : null}
      {courses.length === 0 ? (
        <p className="mt-4 text-dentova-muted">
          Aucun cours pour le moment. Creez votre premier cours depuis l&apos;admin.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[920px] border-collapse text-left">
            <thead>
              <tr className="border-b border-dentova-navy/10 text-sm font-bold text-dentova-ink/70">
                <th className="py-4">Titre</th>
                <th className="py-4">Formateur</th>
                <th className="py-4">Date</th>
                <th className="py-4">Lieu</th>
                <th className="py-4">Prix</th>
                <th className="py-4">Publie</th>
                <th className="py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr className="border-b border-dentova-navy/10 last:border-0" key={course.id}>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-md bg-dentova-ice">
                        <Image
                          alt={course.title}
                          className="object-cover"
                          fill
                          sizes="48px"
                          src={course.imageUrl}
                        />
                      </div>
                      <span className="font-bold text-dentova-navy">{course.title}</span>
                    </div>
                  </td>
                  <td className="py-4 text-dentova-ink/70">{course.instructor}</td>
                  <td className="py-4 text-dentova-ink/70">{formatShortDate(course.date)}</td>
                  <td className="py-4 text-dentova-ink/70">{course.location}</td>
                  <td className="py-4 text-dentova-ink/70">DA {course.price.toLocaleString("fr-DZ")}</td>
                  <td className="py-4 font-bold text-dentova-ink">
                    {course.published ? "Oui" : "Non"}
                  </td>
                  <td className="py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        className="dentova-focus rounded-md border border-dentova-navy/10 p-2 text-dentova-navy hover:bg-dentova-ice"
                        href={`/admin/courses/${course.id}/edit`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <AdminDeleteButton endpoint={`/api/admin/courses/${course.id}`} />
                      <Link
                        className="dentova-focus rounded-md border border-dentova-navy/10 p-2 text-dentova-navy hover:bg-dentova-ice"
                        href={`/courses/${course.slug}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
