"use client";

import { motion } from "framer-motion";
import { BookOpen, GraduationCap, Users } from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";

const ABOUT_IMAGE = "/images/assets/about-image.webp";

const features = [
  {
    icon: GraduationCap,
    title: "Formation dentaire",
    description:
      "Nos formations sont animées par des experts reconnus dans leur domaine.",
  },
  {
    icon: BookOpen,
    title: "Événements professionnels",
    description:
      "Nous organisons des conférences, séminaires et ateliers avec les dernières techniques et technologies dentaires.",
  },
  {
    icon: Users,
    title: "Réseau professionnel",
    description:
      "Opportunités uniques d'échanger avec des experts et collègues du secteur dentaire.",
  },
];

const MARQUEE_TEXT = "✶ Formations dentaires haut de gamme par Dentova";

export function AboutSection() {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-24" id="about">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ── Left column: Image + stat badge ── */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative overflow-hidden rounded-3xl bg-dentova-navy-100 shadow-soft">
              <Image
                src={ABOUT_IMAGE}
                alt="Session de formation Dentova en cours"
                width={720}
                height={540}
                className="h-auto w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Stat badge — overlaid bottom-left */}
            <motion.div
              className="absolute bottom-6 left-6 rounded-2xl bg-white/90 px-6 py-4 shadow-card backdrop-blur-sm"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <span className="block font-display text-3xl font-black leading-none text-dentova-navy-900">
                3+ Ans
              </span>
              <span className="mt-0.5 block text-xs font-medium text-dentova-navy-500">
                D&rsquo;expérience en formation dentaire
              </span>
            </motion.div>
          </motion.div>

          {/* ── Right column: Text content ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {/* Section eyebrow */}
            <div className="mb-4 flex items-center gap-3">
              <span className="block h-px w-10 bg-dentova-teal-400" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-dentova-teal-600">
                Qui sommes-nous&nbsp;?
              </span>
            </div>

            <h2 className="mb-6 font-display text-3xl font-black leading-tight text-dentova-navy-900 sm:text-4xl lg:text-5xl">
              Qui sommes-nous&nbsp;?
            </h2>

            {/* Main paragraph */}
            <p className="mb-8 text-base leading-relaxed text-dentova-navy-500 sm:text-lg">
              Dentova est une société spécialisée dans l’organisation de
              formations continues en médecine dentaire. Nous concevons et
              organisons des formations, masterclasses et cycles animés par des
              experts reconnus, en mettant l’accent sur la qualité scientifique,
              la pratique clinique et une organisation professionnelle.
            </p>

            {/* Feature cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {features.map(({ icon: Icon, title, description }, i) => (
                <motion.div
                  key={title}
                  className="rounded-2xl border border-dentova-navy-100 bg-dentova-canvas/50 p-5"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.25 + i * 0.1 }}
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-dentova-teal-100 text-dentova-teal-700">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h4 className="mb-1.5 font-display text-sm font-bold text-dentova-navy-900">
                    {title}
                  </h4>
                  <p className="text-xs leading-relaxed text-dentova-navy-400">
                    {description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>

      {/* ── Marquee ticker ── */}
      <div className="mt-20 border-y border-dentova-navy-100 bg-dentova-navy-900 py-4">
        <div className="dentova-marquee flex w-max gap-8">
          {Array.from({ length: 10 }, (_, i) => (
            <span
              key={i}
              className="shrink-0 font-display text-sm font-bold uppercase tracking-[0.15em] text-white"
            >
              {MARQUEE_TEXT}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
