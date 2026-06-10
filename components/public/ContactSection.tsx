import { ContactForm } from "@/components/forms/ContactForm";
import { Container } from "@/components/ui/Container";

export function ContactSection() {
  return (
    <section className="border-t border-dentova-navy-100 bg-white px-6 py-16" id="contact">
      <Container>
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-dentova-teal-600">
              Contact
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-dentova-navy-900">
              Ecrivez-nous
            </h2>
            <p className="mt-2 text-sm text-dentova-navy-600">
              Une question sur une formation ou une inscription ?
            </p>
          </div>
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
