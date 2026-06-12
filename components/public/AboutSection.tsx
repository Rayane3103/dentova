"use client";

import { motion } from "framer-motion";
import { Award, BookOpen, GraduationCap, Microscope, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";

const highlights = [
  {
    icon: Microscope,
    stat: "+70%",
    label: "de pratique hands-on sur fantômes et simulateurs",
    color: "bg-dentova-teal-500/10 border-dentova-teal-100 text-dentova-teal-700",
    iconBg: "bg-dentova-teal-100 text-dentova-teal-600"
  },
  {
    icon: GraduationCap,
    stat: "6 mois",
    label: "de mentorat post-formation avec la cohorte",
    color: "bg-sky-500/10 border-sky-100 text-sky-700",
    iconBg: "bg-sky-100 text-sky-600"
  },
  {
    icon: BookOpen,
    stat: "10–15",
    label: "participants max par session pour un suivi d'élite",
    color: "bg-violet-500/10 border-violet-100 text-violet-700",
    iconBg: "bg-violet-100 text-violet-600"
  }
];

export function AboutSection() {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-24" id="about">
      {/* Ambient blurs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-dentova-teal-500/[0.03] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 translate-y-1/2 rounded-full bg-dentova-navy-100/40 blur-3xl" />

      <Container>
        {/* Header */}
        <motion.div
          className="mx-auto mb-20 max-w-3xl text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-dentova-teal-200 bg-dentova-teal-50 px-5 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-dentova-teal-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            Qui sommes-nous ?
          </span>

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
            algériens — du cursus théorique jusqu&rsquo;au geste au cabinet, dès le lendemain.
          </p>
        </motion.div>

        {/* Highlights grid */}
        <motion.div
          className="mb-20 grid grid-cols-1 gap-6 sm:grid-cols-3"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {highlights.map((h) => {
            const Icon = h.icon;
            return (
              <div
                key={h.stat}
                className={`group relative flex flex-col items-center gap-5 rounded-2xl border p-8 text-center transition-all duration-300 hover:shadow-lg ${h.color}`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${h.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <span className="block font-display text-3xl font-black leading-none tracking-tight">
                    {h.stat}
                  </span>
                  <span className="mt-2 block text-xs font-medium leading-relaxed opacity-80">
                    {h.label}
                  </span>
                </div>
              </div>
            );
          })}
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
            <div>
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-dentova-teal-400">
                Notre Vision
              </span>
              <p className="max-w-lg text-lg font-light leading-relaxed text-dentova-navy-100 sm:text-xl">
                &ldquo;Soutenir durablement les chirurgiens-dentistes algériens en leur
                offrant des opportunités d&rsquo;enseignement clinique de standing
                international, renforçant l&rsquo;habileté et la sécurité des
                traitements.&rdquo;
              </p>
            </div>

            {/* Certs */}
            <div className="flex flex-col gap-4 lg:pl-8 lg:border-l lg:border-white/10">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-dentova-teal-400">
                Nos engagements
              </span>
              {[
                "Programmes certifiés & accrédités officiellement",
                "Matériel clinique de dernière génération",
                "Suivi post-formation pendant 6 mois",
                "Groupes restreints (10 à 15 participants)"
              ].map((item) => (
                <div className="flex items-center gap-3" key={item}>
                  <Award className="h-4 w-4 shrink-0 text-dentova-teal-400" />
                  <span className="text-sm font-medium text-dentova-navy-100">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
