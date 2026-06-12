"use client";

import { motion } from "framer-motion";
import { Award, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ParallaxBlob } from "@/components/public/ParallaxBlob";

export function AboutSection() {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-24" id="about">
      {/* Ambient blurs with float */}
      <ParallaxBlob
        className="-top-40 left-1/2 -translate-x-1/2"
        color="bg-dentova-teal-500/[0.04]"
        size="800px"
        speed={22}
      />
      <ParallaxBlob
        className="-bottom-20 right-0"
        color="bg-dentova-navy-100/30"
        size="400px"
        speed={28}
        delay={1.5}
      />

      <Container>
        {/* Header */}
        <motion.div
          className="mx-auto mb-20 max-w-3xl text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-dentova-teal-200 bg-dentova-teal-50 px-5 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-dentova-teal-700"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Qui sommes-nous ?
          </motion.span>

          <h2 className="mb-6 font-display text-3xl font-black leading-tight text-dentova-navy-900 sm:text-4xl lg:text-5xl">
            L&rsquo;Excellence de la{" "}
            <span className="bg-gradient-to-r from-dentova-magenta to-dentova-lavender bg-clip-text text-transparent">
              Formation Dentaire
            </span>{" "}
            en Algérie
          </h2>

          <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-dentova-navy-500 sm:text-lg">
            <strong className="font-bold text-dentova-navy-800">Dentova Events</strong>{" "}
            réunit des mentors internationaux de renom, des équipements cliniques de pointe
            et une pédagogie immersive pour transformer la pratique des chirurgiens-dentistes
            algériens — du cursus théorique jusqu&apos;au geste au cabinet, dès le lendemain.
          </p>
        </motion.div>

        {/* Bottom strip — Vision + Certification */}
        <motion.div
          className="relative overflow-hidden rounded-3xl bg-dentova-navy-900 p-10 text-white shadow-xl sm:p-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-dentova-teal-900/30 to-transparent" />

          <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-dentova-teal-400">
                Notre Vision
              </span>
              <p className="max-w-lg text-lg font-light leading-relaxed text-dentova-navy-100 sm:text-xl">
                &ldquo;Soutenir durablement les chirurgiens-dentistes algériens en leur
                offrant des opportunités d&apos;enseignement clinique de standing
                international, renforçant l&apos;habileté et la sécurité des
                traitements.&rdquo;
              </p>
            </motion.div>

            {/* Engagements */}
            <motion.div
              className="flex flex-col gap-4 lg:pl-8 lg:border-l lg:border-white/10"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <span className="text-xs font-black uppercase tracking-[0.2em] text-dentova-teal-400">
                Nos engagements
              </span>
              {[
                "Programmes certifiés & accrédités officiellement",
                "Matériel clinique de dernière génération",
                "Suivi post-formation pendant 6 mois",
                "Groupes restreints (10 à 15 participants)"
              ].map((item, i) => (
                <motion.div
                  className="flex items-center gap-3"
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.55 + i * 0.08 }}
                >
                  <Award className="h-4 w-4 shrink-0 text-dentova-teal-400" />
                  <span className="text-sm font-medium text-dentova-navy-100">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
