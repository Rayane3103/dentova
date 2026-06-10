import { Eye, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { adminCardClassName } from "@/components/admin/admin-ui";
import { Card } from "@/components/ui/Card";
import { formatShortDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Course } from "@/types";

export function AdminTable({
  compact = false,
  courses
}: {
  compact?: boolean;
  courses: Course[];
}) {
  return (
    <Card className={cn(adminCardClassName, "mt-5 overflow-hidden p-0")}>
      {!compact ? (
        <div className="border-b border-dentova-navy/10 px-4 py-3">
          <h2 className="text-sm font-bold text-dentova-navy">Tous les cours</h2>
        </div>
      ) : null}
      {courses.length === 0 ? (
        <p className="px-4 py-6 text-sm text-dentova-muted">
          Aucun cours pour le moment. Creez votre premier cours depuis l&apos;admin.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-dentova-navy/10 bg-dentova-ice/40 text-[11px] font-bold uppercase tracking-wide text-dentova-muted">
                <th className="px-4 py-2.5">Titre</th>
                <th className="px-4 py-2.5">Formateur</th>
                <th className="px-4 py-2.5">Date</th>
                <th className="px-4 py-2.5">Lieu</th>
                <th className="px-4 py-2.5">Prix</th>
                <th className="px-4 py-2.5">Publie</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr
                  className="border-b border-dentova-navy/8 last:border-0 hover:bg-dentova-ice/30"
                  key={course.id}
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-dentova-ice">
                        <Image
                          alt={course.title}
                          className="object-cover"
                          fill
                          sizes="36px"
                          src={course.imageUrl}
                        />
                      </div>
                      <span className="max-w-[220px] truncate font-semibold text-dentova-navy">
                        {course.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-dentova-ink/70">{course.instructor}</td>
                  <td className="px-4 py-2.5 text-dentova-ink/70">
                    {formatShortDate(course.date)}
                  </td>
                  <td className="px-4 py-2.5 text-dentova-ink/70">{course.location}</td>
                  <td className="px-4 py-2.5 text-dentova-ink/70">
                    DA {course.price.toLocaleString("fr-DZ")}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                        course.published
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-dentova-ice text-dentova-muted"
                      )}
                    >
                      {course.published ? "Oui" : "Non"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-1.5">
                      <Link
                        className="dentova-focus inline-flex h-8 w-8 items-center justify-center rounded-md border border-dentova-navy/10 text-dentova-navy transition hover:bg-white"
                        href={`/admin/courses/${course.id}/edit`}
                        title="Modifier"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                      <AdminDeleteButton
                        compact
                        endpoint={`/api/admin/courses/${course.id}`}
                      />
                      <Link
                        className="dentova-focus inline-flex h-8 w-8 items-center justify-center rounded-md border border-dentova-navy/10 text-dentova-navy transition hover:bg-white"
                        href={`/courses/${course.slug}`}
                        title="Voir"
                      >
                        <Eye className="h-3.5 w-3.5" />
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
