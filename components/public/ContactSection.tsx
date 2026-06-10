import { ContactForm } from "@/components/forms/ContactForm";
import { SectionHeader } from "@/components/public/SectionHeader";
import { Container } from "@/components/ui/Container";

export function ContactSection() {
  return (
    <section className="border-t border-dentova-navy-100 bg-white px-6 py-20" id="contact">
      <Container>
        <SectionHeader
          align="center"
          description="Une question sur une formation ou une inscription ? Envoyez-nous un message."
          eyebrow="Contact"
          title="Ecrivez"
          accent="nous"
        />
        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-dentova-navy-100 bg-white p-6 sm:p-8">
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
