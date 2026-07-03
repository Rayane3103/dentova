"use client";

import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  Calendar,
  Flame,
  MapPin,
  Star,
  Users
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MotionCounter } from "@/components/public/MotionCounter";
import { ParallaxBlob } from "@/components/public/ParallaxBlob";
import type { Course } from "@/types";

const HERO_BACKGROUND = "/images/assets/hero-academy.webp";

const stats = [
  { value: 3, suffix: "+ Ans", label: "D'Excellence Active", icon: Award },
  { value: 1500, suffix: "+", label: "Praticiens Formes", icon: Users },
  { value: 35, suffix: "+", label: "Sessions Realisees", icon: BookOpen },
  { value: 99, suffix: "%", label: "Avis Excellents", icon: Star }
];

const MONTHS_FR = [
  "Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"
];

function formatFrenchDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return `${d} ${MONTHS_FR[m - 1]} ${y}`;
}

function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function isUrgent(days: number): boolean {
  return days >= 0 && days <= 30;
}

function isPast(days: number): boolean {
  return days < 0;
}

export function HeroSection({
  upcomingCourses = []
}: {
  upcomingCourses?: Course[];
}) {
  const parsedUpcoming = useMemo(
    () =>
      upcomingCourses.filter(
        (c) => !isPast(getDaysUntil(c.date))
      ),
    [upcomingCourses]
  );

  return (
    <section
      className="relative -mt-[76px] flex min-h-[90vh] flex-col justify-center overflow-hidden px-6 pb-20 pt-[calc(76px+3rem)] text-white sm:-mt-[80px] sm:pt-[calc(80px+3rem)] lg:-mt-[116px] lg:pt-[calc(116px+3rem)]"
      id="hero"
    >
      <Image
        alt="Session de formation Dentova"
        className="object-cover object-center"
        fill
        priority
        sizes="100vw"
        src={HERO_BACKGROUND}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-dentova-navy-950/80 via-dentova-navy-950/55 to-dentova-teal-950/70" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <ParallaxBlob
        className="-left-40 top-1/4"
        color="bg-dentova-teal-500/8"
        size="500px"
        speed={25}
      />
      <ParallaxBlob
        className="-bottom-40 right-0"
        color="bg-dentova-magenta-500/5"
        size="350px"
        speed={30}
        delay={2}
      />

      <Container className="relative z-10 grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Left column: text */}
        <motion.div
          className="flex flex-col text-left lg:col-span-7"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <motion.div
            className="mb-8 inline-flex items-center gap-2 self-start rounded-full border border-dentova-teal-500/30 bg-dentova-teal-950/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-dentova-teal-300 shadow-inner"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <span className="h-2 w-2 animate-ping rounded-full bg-dentova-teal-400" />
            <span className="font-display">
              Formations Dentaires de Pointe en Algerie
            </span>
          </motion.div>

          <motion.h1
            className="mb-6 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl xl:text-6xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            Ou l&apos;Excellence <br />
            <span className="bg-gradient-to-r from-dentova-teal-400 via-dentova-lavender to-dentova-magenta-300 bg-clip-text text-transparent">
              Rencontre l&apos;Expertise
            </span>
          </motion.h1>

          <motion.p
            className="mb-10 max-w-2xl text-base font-light leading-relaxed text-dentova-navy-200 sm:text-lg lg:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Developpez vos competences cliniques aupres de conferenciers
            internationaux de haut niveau. Debutez ou perfectionnez votre
            pratique en implantologie, endodontie, esthetique et dentisterie
            numerique grace a l&apos;excellence theorique et la rigueur
            d&apos;ateliers pratiques immersifs en Algerie.
          </motion.p>

          <motion.div
            className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
          >
            <Button asChild href="/#courses" size="lg" variant="primary">
              Decouvrir nos formations
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button asChild href="/#contact" size="lg" variant="light">
              Nous contacter
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Right column: upcoming card */}
        <motion.div
          className="flex justify-center lg:col-span-5 lg:justify-end"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="group relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-60" />

            <div className="relative z-10 flex flex-col">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h3 className="font-display text-lg font-black uppercase tracking-tight">
                    DENTOVA ACADEMY
                  </h3>
                  <p className="text-xs font-medium text-dentova-teal-400">
                    Programme d&apos;elite 2026
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: [0, -5, 5, -5, 0] }}
                  className="rounded-xl border border-dentova-teal-400/30 bg-dentova-teal-500/20 p-2 text-dentova-teal-300"
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Flame className="h-5 w-5" />
                </motion.div>
              </div>

              {parsedUpcoming.length > 0 ? (
                <div className="mb-6 flex flex-col gap-3">
                  {parsedUpcoming.map((course, i) => {
                    const days = getDaysUntil(course.date);
                    const urgent = isUrgent(days);

                    return (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 + i * 0.12 }}
                      >
                        <Link
                          className="group/item flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3.5 transition-all duration-200 hover:border-dentova-teal-500/30 hover:bg-white/10 hover:shadow-lg hover:shadow-dentova-teal-500/5"
                          href={`/courses/${course.slug}`}
                        >
                          <div className="flex shrink-0 flex-col items-center rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-center">
                            <span className="text-[9px] font-bold uppercase leading-tight tracking-wider text-dentova-teal-400">
                              {MONTHS_FR[Number(course.date.split("-")[1]) - 1]?.slice(0, 3)}
                            </span>
                            <span className="text-lg font-black leading-tight text-white">
                              {course.date.split("-")[2]}
                            </span>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <p className="truncate text-xs font-bold uppercase tracking-wide text-white/90 transition-colors group-hover/item:text-dentova-teal-300">
                                {course.title}
                              </p>
                              {urgent && (
                                <span className="shrink-0 rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                                  Limite
                                </span>
                              )}
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-white/60">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 shrink-0" />
                                {formatFrenchDate(course.date)}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 shrink-0" />
                                {course.location}
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0 text-white/30 transition-all duration-200 group-hover/item:translate-x-0.5 group-hover/item:text-dentova-teal-400">
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="mb-6 flex flex-col gap-4">
                  <div className="rounded-xl border border-white/5 bg-white/5 p-4 text-center">
                    <p className="text-sm font-medium text-white/60">
                      Aucune formation programmee pour le moment
                    </p>
                    <p className="mt-1 text-xs text-white/40">
                      Revenez bientot pour decouvrir nos prochaines sessions
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-white/10 pt-5 text-left">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-lime-500" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-dentova-navy-400">
                      Inscriptions
                    </p>
                    <p className="text-xs font-semibold text-white">
                      En cours sur dossier
                    </p>
                  </div>
                </div>
                <Link
                  className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-bold text-dentova-navy-950 shadow-sm transition-all hover:bg-dentova-magenta hover:text-white"
                  href="/#contact"
                >
                  Postuler
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>

      {/* Stats bar — scroll-reveal */}
      <Container className="relative z-10 mt-16 w-full border-t border-white/10 pt-12 lg:mt-24">
        <div className="grid grid-cols-2 justify-items-center gap-6 md:grid-cols-4 xl:gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                className="group flex flex-col items-center text-center md:items-start md:text-left"
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="mb-2 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-dentova-teal-500/20 bg-dentova-teal-500/10 text-dentova-teal-400 transition-transform group-hover:scale-110">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="font-display text-3xl font-black tracking-tight text-white transition-colors group-hover:text-dentova-teal-400 md:text-4xl">
                    <MotionCounter
                      value={stat.value}
                      suffix={stat.suffix}
                    />
                  </span>
                </div>
                <span className="text-sm font-medium tracking-wide text-dentova-navy-300">
                  {stat.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
