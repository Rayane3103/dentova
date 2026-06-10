import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  Flame,
  Star,
  Users
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const HERO_BACKGROUND = "/images/assets/hero-academy.webp";

const stats = [
  { value: "3+ Ans", label: "D'Excellence Active", icon: Award },
  { value: "1,500+", label: "Praticiens Formes", icon: Users },
  { value: "35+", label: "Sessions Realisees", icon: BookOpen },
  { value: "99%", label: "Avis Excellents", icon: Star }
];

const highlights = [
  {
    title: "Endodontie Avancee",
    date: "10 Avril · Alger",
    urgent: true
  },
  {
    title: "Dentova OrthoCycle",
    date: "20 Mai · Constantine",
    urgent: false
  },
  {
    title: "Dental Clinic Management",
    date: "25 Juin · Alger",
    urgent: false
  }
];

export function HeroSection() {
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

      <Container className="relative z-10 grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col text-left lg:col-span-7">
          <div className="mb-8 inline-flex items-center gap-2 self-start rounded-full border border-dentova-teal-500/30 bg-dentova-teal-950/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-dentova-teal-300 shadow-inner transition-transform duration-300 hover:scale-105">
            <span className="h-2 w-2 animate-ping rounded-full bg-dentova-teal-400" />
            <span className="font-display">
              Formations Dentaires de Pointe en Algerie
            </span>
          </div>

          <h1 className="mb-6 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl xl:text-6xl">
            Ou l&apos;Excellence <br />
            <span className="bg-gradient-to-r from-dentova-teal-400 via-dentova-lavender to-dentova-magenta-300 bg-clip-text text-transparent">
              Rencontre l&apos;Expertise
            </span>
          </h1>

          <p className="mb-10 max-w-2xl text-base font-light leading-relaxed text-dentova-navy-200 sm:text-lg lg:text-xl">
            Developpez vos competences cliniques aupres de conferenciers
            internationaux de haut niveau. Debutez ou perfectionnez votre
            pratique en implantologie, endodontie, esthetique et dentisterie
            numerique grace a l&apos;excellence theorique et la rigueur
            d&apos;ateliers pratiques immersifs en Algerie.
          </p>

          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button asChild href="/#courses" size="lg" variant="primary">
              Decouvrir nos formations
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button asChild href="/#contact" size="lg" variant="light">
              Nous contacter
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex justify-center lg:col-span-5 lg:justify-end">
          <div className="group relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent transition-opacity duration-300 group-hover:opacity-60" />

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
                <div className="rounded-xl border border-dentova-teal-400/30 bg-dentova-teal-500/20 p-2 text-dentova-teal-300">
                  <Flame className="h-5 w-5 animate-bounce" />
                </div>
              </div>

              <div className="mb-6 flex flex-col gap-4">
                {highlights.map((item) => (
                  <div
                    className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3.5 transition-colors hover:bg-white/10"
                    key={item.title}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${item.urgent ? "animate-pulse bg-emerald-400" : "bg-dentova-teal-400"}`}
                    />
                    <div className="text-left">
                      <p className="text-xs font-bold uppercase text-dentova-navy-300">
                        {item.title}
                      </p>
                      <p className="text-xs font-semibold text-white/70">
                        {item.date}
                        {item.urgent ? " (Places limitees)" : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-5 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-lime-500" />
                  </div>
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
        </div>
      </Container>

      <Container className="relative z-10 mt-16 w-full border-t border-white/10 pt-12 lg:mt-24">
        <div className="grid grid-cols-2 justify-items-center gap-6 md:grid-cols-4 xl:gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                className="group flex flex-col items-center text-center md:items-start md:text-left"
                key={stat.label}
              >
                <div className="mb-2 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-dentova-teal-500/20 bg-dentova-teal-500/10 text-dentova-teal-400 transition-transform group-hover:scale-110">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="font-display text-3xl font-black tracking-tight text-white transition-colors group-hover:text-dentova-teal-400 md:text-4xl">
                    {stat.value}
                  </span>
                </div>
                <span className="text-sm font-medium tracking-wide text-dentova-navy-300">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
