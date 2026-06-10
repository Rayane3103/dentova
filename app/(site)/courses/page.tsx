import type { Metadata } from "next";
import { CoursesSection } from "@/components/public/CoursesSection";

export const metadata: Metadata = {
  title: "Prochains cours"
};

export default function CoursesPage() {
  return (
    <main>
      <CoursesSection />
    </main>
  );
}
