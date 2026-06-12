import { AboutSection } from "@/components/public/AboutSection";
import { BlogSection } from "@/components/public/BlogSection";
import { ContactSection } from "@/components/public/ContactSection";
import { CoursesSection } from "@/components/public/CoursesSection";
import { FAQSection } from "@/components/public/FAQSection";
import { HeroSection } from "@/components/public/HeroSection";
import { ImageGallery } from "@/components/public/ImageGallery";
import { TestimonialsSection } from "@/components/public/TestimonialsSection";

import { getAdminSession } from "@/lib/auth/cookies";
import {
  getActiveWorkshopImages,
  getCategories,
  getPublishedCourses,
  getPublishedFaqs,
  getPublishedPosts,
  getPublishedTestimonials
} from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [session, courses, categories, testimonials, faqs, gallery, posts] =
    await Promise.all([
      getAdminSession(),
      getPublishedCourses({ homepageOnly: true }),
      getCategories(),
      getPublishedTestimonials(),
      getPublishedFaqs(),
      getActiveWorkshopImages(),
      getPublishedPosts({ limit: 3 })
    ]);

  return (
    <main className="bg-white">
      <HeroSection />
      <AboutSection />
      <CoursesSection categories={categories} courses={courses} />
      <BlogSection authenticated={Boolean(session)} posts={posts} />
      <TestimonialsSection testimonials={testimonials} />
      <FAQSection faqs={faqs} />
      <ContactSection />
      {gallery.length > 0 ? <ImageGallery images={gallery} /> : null}
    </main>
  );
}
