"use client";

import { motion } from "framer-motion";
import { ContactForm } from "@/components/forms/ContactForm";
import { Container } from "@/components/ui/Container";

export function ContactSection() {
  return (
    <section
      className="relative overflow-hidden border-t border-dentova-navy-100 bg-white px-6 py-16"
      id="contact"
    >
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, -20, 0] }}
        className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-dentova-teal-500/[0.03] blur-3xl"
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <Container>
        <motion.div
          className="mx-auto max-w-2xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center">
            <motion.p
              className="text-xs font-medium uppercase tracking-wider text-dentova-teal-600"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.05 }}
            >
              Contact
            </motion.p>
            <h2 className="mt-2 font-display text-2xl font-bold text-dentova-navy-900">
              Ecrivez-nous
            </h2>
            <motion.p
              className="mt-2 text-sm text-dentova-navy-600"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              Une question sur une formation ou une inscription ?
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: 0.15 }}
          >
            <ContactForm />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
