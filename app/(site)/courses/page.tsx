import type { Metadata } from "next";
import { CoursesSection } from "@/components/public/CoursesSection";
import { getCategories, getPublishedCourses } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Formations dentaires",
  description:
    "Catalogue complet des formations, masterclasses et cycles dentaires Dentova a Alger, Oran et Constantine.",
  alternates: { canonical: "/courses" }
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
