"use client";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Sparkles
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MotionCounter } from "@/components/public/MotionCounter";
import { formatPrice, formatShortDate } from "@/lib/format";
import type { Course } from "@/types";

const HOME_SLIDE_MS = 7000;
const COURSE_SLIDE_MS = 3000;

const homeStats = [
  { value: 3, prefix: "+", suffix: " ans", label: "D'excellence active" },
  { value: 500, prefix: "+", suffix: "", label: "Praticiens formes" },
  { value: 20, prefix: "+", suffix: "", label: "Sessions realisees" }
];

const MONTHS_FR = [
  "Janvier",
  "Fevrier",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Aout",
  "Septembre",
  "Octobre",
  "Novembre",
  "Decembre"
];

function formatFrenchDate(dateStr: string): string {
  const [y, m, d] = dateStr.slice(0, 10).split("-").map(Number);

  if (!y || !m || !d) {
    return dateStr;
  }

  return `${d} ${MONTHS_FR[m - 1]} ${y}`;
}

function HeroCoursePreview({ course }: { course: Course }) {
  const isCycle = course.courseType === "cycle";

  return (
    <Link
      className="group grid min-h-[430px] overflow-hidden transition-all duration-500 md:grid-cols-[1fr_0.88fr]"
      href={`/courses/${course.slug}`}
    >
      <div className="relative flex min-h-[250px] items-center justify-center overflow-hidden">
        {course.imageUrl ? (
          <>
            <Image
              alt=""
              aria-hidden="true"
              className="object-cover opacity-20 blur-2xl scale-110"
              fill
              sizes="(min-width: 1024px) 460px, 100vw"
              src={course.imageUrl}
            />
            <Image
              alt={course.title}
              className="object-contain p-2 drop-shadow-2xl transition-transform duration-700 ease-out group-hover:scale-[1.02] sm:p-3"
              fill
              sizes="(min-width: 1024px) 460px, 100vw"
              src={course.imageUrl}
            />
          </>
        ) : null}

        <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
          <span className="rounded-md bg-dentova-navy-950/70 px-3 py-1 text-[9px] font-bold uppercase text-white backdrop-blur-sm">
            {course.category.name}
          </span>
          <span className="rounded-md bg-dentova-teal-500/90 px-3 py-1 text-[9px] font-bold uppercase text-dentova-navy-950">
            {isCycle ? "Cycle" : "Formation"}
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-6 p-5 sm:p-6">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-semibold text-dentova-navy-300">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 shrink-0 text-dentova-teal-400" />
              {isCycle && course.cycleDates.length > 1
                ? `${course.cycleDates.length} dates`
                : formatShortDate(course.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-dentova-teal-400" />
              {course.location}
            </span>
          </div>

          <h2 className="font-display text-3xl font-black leading-none text-white transition-colors group-hover:text-dentova-teal-300 sm:text-4xl">
            {course.title}
          </h2>

          <p className="mt-4 line-clamp-6 text-sm leading-7 text-dentova-navy-300">
            {course.excerpt || course.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
          <span className="font-display text-2xl font-black text-dentova-teal-400">
            {formatPrice(course.price)}
          </span>
          <span className="flex items-center gap-1.5 rounded-lg bg-dentova-magenta px-4 py-2 text-xs font-bold text-white transition-all group-hover:bg-dentova-violet">
            Voir les details
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

type HeroSlide =
  | {
      kind: "home";
      id: "home";
      label: string;
      title: string;
      subtitle: string;
      href: string;
      eyebrow: string;
    }
  | {
      kind: "course";
      id: string;
      label: string;
      title: string;
      subtitle: string;
      href: string;
      eyebrow: string;
      course: Course;
    };

export function HeroSection({
  upcomingCourses = []
}: {
  upcomingCourses?: Course[];
}) {
  const slides = useMemo<HeroSlide[]>(
    () => [
      {
        kind: "home",
        id: "home",
        label: "Accueil",
        title: "Dentova Academy",
        subtitle:
          "Formations dentaires premium en Algerie, pensees pour transformer la pratique clinique avec des mentors experts, des protocoles concrets et des ateliers immersifs.",
        href: "/#courses",
        eyebrow: "Academie d'excellence clinique"
      },
      ...upcomingCourses.slice(0, 5).map((course) => ({
        kind: "course" as const,
        id: course.id,
        label: course.category?.name ?? "Formation",
        title: course.title,
        subtitle:
          course.excerpt ||
          course.subtitle ||
          "Une session pratique pour progresser avec methode, precision et accompagnement expert.",
        href: `/courses/${course.slug}`,
        eyebrow: `${formatFrenchDate(course.date)} - ${course.location}`,
        course
      }))
    ],
    [upcomingCourses]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex] ?? slides[0];

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, activeSlide.kind === "home" ? HOME_SLIDE_MS : COURSE_SLIDE_MS);

    return () => window.clearTimeout(timeout);
  }, [activeSlide.kind, activeIndex, slides.length]);

  useEffect(() => {
    if (activeIndex > slides.length - 1) {
      setActiveIndex(0);
    }
  }, [activeIndex, slides.length]);

  function goToPrevious() {
    setActiveIndex((index) => (index - 1 + slides.length) % slides.length);
  }

  function goToNext() {
    setActiveIndex((index) => (index + 1) % slides.length);
  }

  return (
    <section
      className="relative -mt-[76px] min-h-[90vh] overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(115,203,213,0.28),transparent_34%),linear-gradient(135deg,#10103a_0%,#181453_45%,#2d1247_100%)] px-6 pb-12 pt-[calc(76px+2.5rem)] text-white sm:-mt-[80px] sm:pt-[calc(80px+3rem)] lg:-mt-[116px] lg:pt-[calc(116px+4rem)]"
      id="hero"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:4.5rem_4.5rem]" />
      <motion.div
        className="absolute left-1/2 top-24 h-72 w-72 rounded-full bg-dentova-teal-400/20 blur-3xl"
        animate={{ x: ["-60%", "-30%", "-70%"], y: [0, 36, 0], opacity: [0.45, 0.7, 0.45] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-dentova-magenta-400/20 blur-3xl"
        animate={{ x: [20, -30, 20], y: [20, -20, 20], opacity: [0.35, 0.58, 0.35] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <Container className="relative z-10">
        <AnimatePresence mode="wait">
          {activeSlide.kind === "home" ? (
            <motion.div
              key="home-centered"
              className="mx-auto flex min-h-[calc(90vh-7rem)] max-w-5xl flex-col items-center justify-center text-center"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -28 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Image
                alt="Dentova"
                className="h-auto w-48"
                height={48}
                priority
                src="/brand/logo-white.svg"
                width={192}
              />

              <h1 className="mt-8 font-display text-6xl font-black leading-[0.82] text-white sm:text-7xl lg:text-8xl">
                Dentova
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-dentova-navy-100 sm:text-xl">
                Une academie dentaire premium en Algerie pour apprendre les
                protocoles, maitriser le geste clinique et progresser avec des
                mentors experts.
              </p>

              <div className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
                {homeStats.map((stat) => (
                  <div
                    className="border-y border-white/10 bg-white/[0.06] px-5 py-5 backdrop-blur-sm"
                    key={stat.label}
                  >
                    <p className="font-display text-5xl font-black leading-none text-white">
                      <MotionCounter
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                        value={stat.value}
                      />
                    </p>
                    <p className="mt-2 text-xs font-semibold uppercase text-white/60">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <motion.div
                className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2 }}
              >
                <Button asChild href="/#courses" size="lg" variant="primary">
                  Decouvrir les formations
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button asChild href="/courses" size="lg" variant="light">
                  Voir tout
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </motion.div>

            </motion.div>
          ) : (
            <motion.div
              className="grid min-h-[calc(90vh-7rem)] grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10"
              key={activeSlide.id}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -28 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="lg:col-span-5">
               <motion.div
                  className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-bold uppercase text-dentova-teal-100 backdrop-blur"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Formation a venir
                </motion.div>

                <p className="mb-3 text-sm font-semibold text-dentova-teal-200">
                  {activeSlide.eyebrow}
                </p>
                <h1 className="font-display text-5xl font-black leading-[0.9] text-white sm:text-6xl xl:text-7xl">
                  {activeSlide.title}
                </h1>
                <p className="mt-7 max-w-xl text-base leading-8 text-dentova-navy-100 sm:text-lg">
                  {activeSlide.subtitle}
                </p>

                <motion.div
                  className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.2 }}
                >
                  <Button asChild href={activeSlide.href} size="lg" variant="primary">
                    Voir la formation
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button asChild href="/courses" size="lg" variant="light">
                    Voir tout
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </motion.div>

              </div>

              <div className="lg:col-span-7">
                <div className="relative mx-auto w-full max-w-3xl">
                  <div className="absolute inset-x-8 -bottom-6 h-24 rounded-full bg-dentova-teal-300/20 blur-3xl" />
                  <HeroCoursePreview course={activeSlide.course} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mx-auto mt-8 flex w-full max-w-sm items-center justify-center gap-3">
          <button
            aria-label="Slide precedent"
            className="dentova-focus flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur transition hover:border-dentova-teal-300 hover:bg-white/15"
            onClick={goToPrevious}
            type="button"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 py-1">
            {slides.map((slide, index) => (
              <button
                aria-label={`Afficher ${slide.label}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-10 bg-dentova-teal-300"
                    : "w-2.5 bg-white/30 hover:bg-white/55"
                }`}
                key={slide.id}
                onClick={() => setActiveIndex(index)}
                type="button"
              />
            ))}
          </div>
          <button
            aria-label="Slide suivant"
            className="dentova-focus flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur transition hover:border-dentova-teal-300 hover:bg-white/15"
            onClick={goToNext}
            type="button"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </Container>
    </section>
  );
}
