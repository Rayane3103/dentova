import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CourseForm } from "@/components/admin/CourseForm";
import { getCourseAdminRecord } from "@/lib/data/queries";

type EditCoursePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { id } = await params;
  const course = await getCourseAdminRecord(id);

  if (!course) {
    notFound();
  }

  return (
    <>
      <AdminHeader title="Modifier le cours" />
      <div className="mt-5">
        <CourseForm
          courseId={id}
          initialValues={{
            categoryId: String(course.categoryId),
            contactEmail: String(course.contactEmail),
            contactPhone: String(course.contactPhone),
            date: course.date as Date,
            description: String(course.description),
            excerpt: course.excerpt ? String(course.excerpt) : "",
            featured: Boolean(course.featured),
            imagePublicId: course.imagePublicId ? String(course.imagePublicId) : undefined,
            imageUrl: String(course.imageUrl),
            instructor: String(course.instructor),
            location: String(course.location),
            maxSeats: course.maxSeats ? Number(course.maxSeats) : undefined,
            price: Number(course.price),
            published: Boolean(course.published),
            showOnHomepage: Boolean(course.showOnHomepage),
            subtitle: course.subtitle ? String(course.subtitle) : "",
            time: course.time ? String(course.time) : "",
            title: String(course.title)
          }}
        />
      </div>
    </>
  );
}
