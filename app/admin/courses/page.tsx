import { Eye, Pencil, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/Button";
import { getAllCourses } from "@/lib/data/queries";
import { formatShortDate } from "@/lib/format";
import type { Course } from "@/types";

export default async function AdminCoursesPage() {
  const courses = await getAllCourses();

  const columns: DataTableColumn<Course>[] = [
    {
      key: "title",
      header: "Formation",
      sortable: true,
      render: (course) => (
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-slate-100">
            <Image
              alt={course.title}
              className="object-cover"
              fill
              sizes="36px"
              src={course.imageUrl}
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              {course.title}
            </p>
            <p className="text-xs text-slate-400">{course.category.name}</p>
          </div>
        </div>
      )
    },
    {
      key: "instructor",
      header: "Formateur",
      sortable: true,
      hidden: "md",
      render: (course) => (
        <span className="text-slate-600">{course.instructor}</span>
      )
    },
    {
      key: "date",
      header: "Date",
      sortable: true,
      hidden: "md",
      render: (course) => (
        <span className="text-slate-600">{formatShortDate(course.date)}</span>
      )
    },
    {
      key: "location",
      header: "Lieu",
      sortable: true,
      hidden: "lg",
      render: (course) => (
        <span className="text-slate-600">{course.location}</span>
      )
    },
    {
      key: "price",
      header: "Prix",
      sortable: true,
      render: (course) => (
        <span className="text-sm font-semibold text-slate-800">
          DA {course.price.toLocaleString("fr-DZ")}
        </span>
      )
    },
    {
      key: "published",
      header: "Statut",
      sortable: true,
      render: (course) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
            course.published
              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
              : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
          }`}
        >
          {course.published ? "Publié" : "Brouillon"}
        </span>
      )
    },
    {
      key: "actions",
      header: "",
      render: (course) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            className="dentova-focus inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-slate-300 hover:text-slate-600"
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
            className="dentova-focus inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-slate-300 hover:text-slate-600"
            href={`/courses/${course.slug}`}
            target="_blank"
            title="Voir"
          >
            <Eye className="h-3.5 w-3.5" />
          </Link>
        </div>
      )
    }
  ];

  return (
    <>
      <AdminHeader
        actions={
          <Button asChild href="/admin/courses/new" size="sm">
            <Plus className="h-3.5 w-3.5" />
            Nouvelle formation
          </Button>
        }
        description="Gérez le catalogue de formations, les dates et la publication"
        title="Formations"
      />
      <DataTable
        columns={columns}
        data={courses}
        emptyMessage="Aucune formation créée. Ajoutez votre première formation."
        pageSize={10}
        rowKey={(course) => course.id}
        searchFields={["title", "instructor", "location"]}
        searchPlaceholder="Rechercher par titre, formateur, lieu..."
        subtitle={`${courses.length} formation${courses.length !== 1 ? "s" : ""} au total`}
        title="Toutes les formations"
      />
    </>
  );
}
