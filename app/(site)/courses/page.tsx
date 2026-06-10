import type { Metadata } from "next";
import { CoursesSection } from "@/components/public/CoursesSection";
import { getCategories, getPublishedCourses } from "@/lib/data/queries";

export const metadata: Metadata = {
  title: "Prochains cours"
};

export default async function CoursesPage() {
  const [courses, categories] = await Promise.all([
    getPublishedCourses(),
    getCategories()
  ]);

  return (
    <main>
      <CoursesSection categories={categories} courses={courses} />
    </main>
  );
}
