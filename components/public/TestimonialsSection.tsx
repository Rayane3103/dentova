import { FeedbackForm } from "@/components/forms/FeedbackForm";
import { SectionHeader } from "@/components/public/SectionHeader";
import { Container } from "@/components/ui/Container";
import { testimonials } from "@/lib/constants";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  return (
    <section className="bg-white px-6 py-20" id="testimonials">
      <Container>
        <SectionHeader
          align="center"
          description="Retours de praticiens ayant suivi nos formations."
          eyebrow="Temoignages"
          title="Ce que disent nos"
          accent="participants"
        />

        <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              className="rounded-xl border border-dentova-navy-100 bg-white p-5"
              key={testimonial.id}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-dentova-navy-900">
                    {testimonial.fullName}
                  </h3>
                  <p className="text-xs text-dentova-navy-500">
                    {testimonial.role}
                  </p>
                </div>
                <span className="flex items-center gap-0.5 text-xs font-medium text-dentova-navy-600">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {testimonial.rating}/5
                </span>
              </div>
              <p className="text-sm leading-relaxed text-dentova-navy-600">
                &ldquo;{testimonial.message}&rdquo;
              </p>
            </article>
          ))}
        </div>

        <div
          className="mx-auto mt-16 max-w-2xl border-t border-dentova-navy-100 pt-12"
          id="feedback"
        >
          <h3 className="mb-6 text-center text-lg font-semibold text-dentova-navy-900">
            Vous aussi, partagez votre experience
          </h3>
          <FeedbackForm />
        </div>
      </Container>
    </section>
  );
}
