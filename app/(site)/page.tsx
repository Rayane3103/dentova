import { AboutSection } from "@/components/public/AboutSection";
import { ContactSection } from "@/components/public/ContactSection";
import { CoursesSection } from "@/components/public/CoursesSection";
import { FAQSection } from "@/components/public/FAQSection";
import { HeroSection } from "@/components/public/HeroSection";
import { ImageGallery } from "@/components/public/ImageGallery";
import { TestimonialsSection } from "@/components/public/TestimonialsSection";
import { WhyParticipateSection } from "@/components/public/WhyParticipateSection";

export default function HomePage() {
  return (
    <main className="bg-white">
      <HeroSection />
      <WhyParticipateSection />
      <AboutSection />
      <CoursesSection />
      <TestimonialsSection />
      <FAQSection />
      <ImageGallery />
      <ContactSection />
    </main>
  );
}
