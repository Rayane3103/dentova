import { Eye, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { formatShortDate } from "@/lib/format";
import type { Course } from "@/types";

export function AdminTable({ courses }: { courses: Course[] }) {
  return (
    <Card className="mt-8 overflow-hidden rounded-xl p-6">
      <h2 className="text-3xl font-extrabold text-dentova-navy">All Courses</h2>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[920px] border-collapse text-left">
          <thead>
            <tr className="border-b border-dentova-navy/10 text-base font-bold text-dentova-ink/70">
              <th className="py-4">Title</th>
              <th className="py-4">Instructor</th>
              <th className="py-4">Date</th>
              <th className="py-4">Location</th>
              <th className="py-4">Price</th>
              <th className="py-4">Status</th>
              <th className="py-4">Homepage</th>
              <th className="py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr
                className="border-b border-dentova-navy/10 last:border-0"
                key={course.id}
              >
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
                    <span className="font-bold text-dentova-navy">
                      {course.title}
                    </span>
                  </div>
                </td>
                <td className="py-4 text-dentova-ink/70">{course.instructor}</td>
                <td className="py-4 text-dentova-ink/70">
                  {formatShortDate(course.date)}
                </td>
                <td className="py-4 text-dentova-ink/70">{course.location}</td>
                <td className="py-4 text-dentova-ink/70">
                  DA{course.price.toFixed(2)}
                </td>
                <td className="py-4 font-bold text-dentova-ink">
                  {course.featured ? "Featured" : "Not Featured"}
                </td>
                <td className="py-4 font-bold text-dentova-ink">
                  {course.showOnHomepage ? "On Homepage" : "Hidden"}
                </td>
                <td className="py-4">
                  <div className="flex justify-end gap-3">
                    <Link
                      className="dentova-focus rounded-md border border-dentova-navy/10 p-2 text-dentova-navy hover:bg-dentova-ice"
                      href={`/admin/courses/${course.id}/edit`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      className="dentova-focus rounded-md border border-dentova-navy/10 p-2 text-dentova-navy hover:bg-dentova-ice"
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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
    </Card>
  );
}
