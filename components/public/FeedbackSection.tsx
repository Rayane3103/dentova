import { FeedbackForm } from "@/components/forms/FeedbackForm";
import { SectionHeader } from "@/components/public/SectionHeader";
import { Container } from "@/components/ui/Container";

export function FeedbackSection() {
  return (
    <section className="border-t border-dentova-navy-100 bg-white px-6 py-20" id="feedback">
      <Container>
        <SectionHeader
          align="center"
          description="Vous avez suivi une formation ? Votre retour nous aide a ameliorer nos programmes."
          eyebrow="Votre avis"
          title="Partagez votre"
          accent="experience"
        />
        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-dentova-navy-100 bg-white p-6 sm:p-8">
          <FeedbackForm />
        </div>
      </Container>
    </section>
  );
}
