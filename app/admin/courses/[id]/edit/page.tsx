import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CourseForm } from "@/components/admin/CourseForm";
import { serializeCourseQuestions } from "@/lib/data/serialize";
import { getCourseAdminRecord } from "@/lib/data/queries";

type EditCoursePageProps = {
  params: Promise<{ id: string }>;
};

function toDateInputValue(value: unknown) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value).slice(0, 10);
}

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
            courseType: course.courseType === "cycle" ? "cycle" : "formation",
            cycleDates: Array.isArray(course.cycleDates)
              ? (course.cycleDates.map((date) => toDateInputValue(date)) as unknown as Date[])
              : [],
            date: toDateInputValue(course.date) as unknown as Date,
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
            questions: serializeCourseQuestions(course.questions),
            showOnHomepage: Boolean(course.showOnHomepage),
            subtitle: course.subtitle ? String(course.subtitle) : "",
            time: course.time ? String(course.time) : "",
            title: String(course.title),
            youtubeUrl: course.youtubeUrl ? String(course.youtubeUrl) : ""
          }}
        />
      </div>
    </>
  );
}
