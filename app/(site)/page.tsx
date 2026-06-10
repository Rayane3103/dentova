import { AboutSection } from "@/components/public/AboutSection";
import { ContactSection } from "@/components/public/ContactSection";
import { CoursesSection } from "@/components/public/CoursesSection";
import { FAQSection } from "@/components/public/FAQSection";
import { HeroSection } from "@/components/public/HeroSection";
import { ImageGallery } from "@/components/public/ImageGallery";
import { TestimonialsSection } from "@/components/public/TestimonialsSection";
import { WhyParticipateSection } from "@/components/public/WhyParticipateSection";
import {
  getActiveWorkshopImages,
  getCategories,
  getPublishedCourses,
  getPublishedFaqs,
  getPublishedTestimonials
} from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [courses, categories, testimonials, faqs, gallery] = await Promise.all([
    getPublishedCourses({ homepageOnly: true }),
    getCategories(),
    getPublishedTestimonials(),
    getPublishedFaqs(),
    getActiveWorkshopImages()
  ]);

  return (
    <main className="bg-white">
      <HeroSection />
      <WhyParticipateSection />
      <AboutSection />
      <CoursesSection categories={categories} courses={courses} />
      <TestimonialsSection testimonials={testimonials} />
      <FAQSection faqs={faqs} />
      <ImageGallery images={gallery} />
      <ContactSection />
    </main>
  );
}
