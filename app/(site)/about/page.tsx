import type { Metadata } from "next";
import { AboutSection } from "@/components/public/AboutSection";
import { SectionHeader } from "@/components/public/SectionHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "A propos de nous"
};

export default function AboutPage() {
  return (
    <main>
      <AboutSection />
      <section className="border-t border-dentova-navy-100 bg-dentova-navy-50/40 px-6 py-20">
        <Container>
          <SectionHeader
            align="center"
            description="Dentova Events accompagne les praticiens algeriens avec des formations cliniques rigoureuses, des intervenants reconnus et un suivi attentif."
            eyebrow="Notre mission"
            title="Former les"
            accent="praticiens de demain"
          />
        </Container>
      </section>
    </main>
  );
}
