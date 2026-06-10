import { AboutSection } from "@/components/public/AboutSection";
import { ContactSection } from "@/components/public/ContactSection";
import { CoursesSection } from "@/components/public/CoursesSection";
import { FAQSection } from "@/components/public/FAQSection";
import { FeedbackSection } from "@/components/public/FeedbackSection";
import { HeroSection } from "@/components/public/HeroSection";
import { ImageGallery } from "@/components/public/ImageGallery";
import { PartnersSection } from "@/components/public/PartnersSection";
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
      <PartnersSection />
      <FeedbackSection />
      <ContactSection />
    </main>
  );
}
