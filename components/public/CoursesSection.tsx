"use client";

import { AlertCircle, Award, Filter, Info } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { CourseCard } from "@/components/public/CourseCard";
import { Container } from "@/components/ui/Container";
import { placeholderCategories, placeholderCourses, siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";

const locations = [
  { id: "all", label: "Pays Entier" },
  { id: "Alger", label: "Alger" },
  { id: "Oran", label: "Oran" },
  { id: "Constantine", label: "Constantine" }
];

export function CoursesSection({ limit }: { limit?: number }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeLocation, setActiveLocation] = useState("all");

  const categories = [
    { id: "all", label: "Toutes" },
    ...placeholderCategories.map((cat) => ({
      id: cat.slug,
      label: cat.name
    }))
  ];

  const courses = useMemo(() => {
    const filtered = placeholderCourses.filter((course) => {
      const matchCategory =
        activeCategory === "all" || course.category.slug === activeCategory;
      const matchLocation =
        activeLocation === "all" || course.location === activeLocation;
      return matchCategory && matchLocation;
    });
    return typeof limit === "number" ? filtered.slice(0, limit) : filtered;
  }, [activeCategory, activeLocation, limit]);

  return (
    <section
      className="relative border-t border-white/5 bg-dentova-navy-950 px-6 py-24 text-left text-white"
      id="courses"
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="pointer-events-none absolute right-10 top-1/3 z-0 h-96 w-96 rounded-full bg-dentova-teal-600/5 blur-3xl" />

      <Container className="relative z-10">
        <div className="mb-16 max-w-3xl text-left">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-dentova-teal-500/20 bg-dentova-teal-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-dentova-teal-300">
            <Award className="h-3 w-3 text-dentova-teal-400" />
            CATALOGUE DES FORMATIONS D&apos;ELITE
          </span>
          <h2 className="font-display text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
            Prenez place pour nos prochaines{" "}
            <span className="bg-gradient-to-r from-dentova-teal-400 via-dentova-lavender to-dentova-magenta-300 bg-clip-text text-transparent">
              Masterclasses & Travaux Pratiques
            </span>
          </h2>
          <p className="mt-4 max-w-2xl text-sm font-light text-dentova-navy-300">
            Cliquez sur un cursus pour ouvrir sa fiche clinique structuree,
            explorer ses modules theoriques d&apos;excellence et postuler en
            ligne.
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 items-end gap-8 border-b border-white/10 pb-8 lg:grid-cols-12">
          <div className="flex flex-col gap-3 lg:col-span-8">
            <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-dentova-navy-400">
              <Filter className="h-2.5 w-2.5 text-dentova-teal-400" />
              Filtrer par Thematique :
            </span>
            <div className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-2 font-medium">
              {categories.map((cat) => (
                <button
                  className={cn(
                    "cursor-pointer whitespace-nowrap rounded-xl border px-4 py-2 text-xs font-bold transition-all focus:outline-none",
                    activeCategory === cat.id
                      ? "scale-105 border-dentova-teal-400 bg-dentova-teal-500/20 font-black text-dentova-teal-300"
                      : "border-white/5 bg-white/5 text-dentova-navy-300 hover:bg-white/10 hover:text-white"
                  )}
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  type="button"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
            <span className="w-full text-[10px] font-black uppercase tracking-wider text-dentova-navy-400 lg:text-right">
              Ville de Session :
            </span>
            <div className="flex flex-wrap gap-2">
              {locations.map((loc) => (
                <button
                  className={cn(
                    "cursor-pointer rounded-lg border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all focus:outline-none",
                    activeLocation === loc.id
                      ? "border-white bg-white text-dentova-navy-950"
                      : "border-white/5 bg-white/5 text-dentova-navy-300 hover:border-dentova-teal-400/50"
                  )}
                  key={loc.id}
                  onClick={() => setActiveLocation(loc.id)}
                  type="button"
                >
                  {loc.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid min-h-[400px] grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {courses.length > 0 ? (
              courses.map((course) => (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  initial={{ opacity: 0, y: 30 }}
                  key={course.id}
                  layout
                  transition={{ duration: 0.4, type: "spring", damping: 20 }}
                >
                  <CourseCard course={course} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center py-20 text-center">
                <AlertCircle className="mb-2 h-8 w-8 text-dentova-navy-500" />
                <p className="mb-1 text-lg font-bold text-dentova-navy-400">
                  Aucune session trouvee
                </p>
                <p className="max-w-sm text-xs font-light text-dentova-navy-500">
                  Essayez de reinitialiser la recherche thematique ou de choisir
                  une autre ville en Algerie.
                </p>
                <button
                  className="mt-4 cursor-pointer rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-bold text-white transition-colors hover:border-dentova-teal-400/50 hover:bg-white/10"
                  onClick={() => {
                    setActiveCategory("all");
                    setActiveLocation("all");
                  }}
                  type="button"
                >
                  Reinitialiser les filtres
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="mx-auto mt-16 flex max-w-4xl flex-col items-center gap-5 rounded-2xl border border-white/10 bg-white/5 p-6 text-left sm:flex-row">
          <div className="shrink-0 rounded-2xl border border-dentova-teal-500/20 bg-dentova-teal-500/10 p-3 text-dentova-teal-400">
            <Info className="h-5 w-5" />
          </div>
          <div className="text-xs">
            <h4 className="mb-1 font-display font-bold text-white">
              Des interrogations sur le choix du theme ou votre niveau clinique ?
            </h4>
            <p className="font-light leading-relaxed text-dentova-navy-300">
              Toutes nos sessions sont supervisees en direct par des chirurgiens
              experts. Contactez notre academie au{" "}
              <strong className="text-dentova-teal-400">{siteConfig.phone}</strong>{" "}
              pour un conseil personnalise.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
