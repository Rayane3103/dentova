"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { FeedbackForm } from "@/components/forms/FeedbackForm";
import { SectionHeader } from "@/components/public/SectionHeader";
import { Container } from "@/components/ui/Container";
import type { Testimonial } from "@/types";

export function TestimonialsSection({
  testimonials
}: {
  testimonials: Testimonial[];
}) {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-20" id="testimonials">
      {/* Decorative blobs */}
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, 20, 0] }}
        className="pointer-events-none absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-dentova-navy-50/40 blur-3xl"
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, -15, 0] }}
        className="pointer-events-none absolute -right-20 bottom-1/4 h-60 w-60 rounded-full bg-dentova-teal-500/[0.04] blur-3xl"
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      <Container>
        <SectionHeader
          align="center"
          description="Retours de praticiens ayant suivi nos formations."
          eyebrow="Temoignages"
          title="Ce que disent nos"
          accent="participants"
        />

        <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
          {testimonials.length > 0 ? (
            testimonials.map((testimonial, i) => (
              <motion.article
                className="rounded-xl border border-dentova-navy-100 bg-white p-5"
                key={testimonial.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
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
              </motion.article>
            ))
          ) : (
            <motion.p
              className="col-span-full text-center text-sm text-dentova-navy-500"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Les temoignages approuves apparaitront ici apres moderation.
            </motion.p>
          )}
        </div>

        <motion.div
          className="mx-auto mt-16 max-w-2xl border-t border-dentova-navy-100 pt-12"
          id="feedback"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <h3 className="mb-6 text-center text-lg font-semibold text-dentova-navy-900">
            Vous aussi, partagez votre experience
          </h3>
          <FeedbackForm />
        </motion.div>
      </Container>
    </section>
  );
}
