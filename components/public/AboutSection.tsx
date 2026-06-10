import {
  BookOpen,
  Compass,
  Mic2,
  ShieldCheck,
  Sparkles,
  Users2
} from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";

const pillars = [
  {
    icon: BookOpen,
    title: "Formation Clinique",
    desc: "Cursus immersifs theoriques et pratiques structures en thematiques de pointe avec des ateliers intensifs."
  },
  {
    icon: Mic2,
    title: "Evenements Scientifiques",
    desc: "Organisation de congres d'elite, symposiums et masterclasses de haut standing avec retransmission live."
  },
  {
    icon: Users2,
    title: "Reseau & Partage Clinique",
    desc: "Acces privilegie a un cercle ferme de praticiens actifs en Algerie pour s'entraider sur l'analyse de cas complexes."
  }
];

export function AboutSection() {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-24 text-left" id="about">
      <div className="pointer-events-none absolute left-0 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-dentova-teal-500/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-dentova-navy-100 blur-3xl" />

      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col items-start lg:col-span-6">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-dentova-teal-100 bg-dentova-teal-50 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-dentova-teal-700">
              <Sparkles className="h-3 w-3 text-dentova-teal-600" />
              QUI SOMMES-NOUS ?
            </span>
            <h2 className="mb-6 font-display text-3xl font-black leading-tight text-dentova-navy-900 sm:text-4xl">
              L&apos;Elite de la Formation Continue{" "}
              <span className="bg-gradient-to-r from-dentova-magenta to-dentova-lavender bg-clip-text text-transparent">
                Dentaire en Algerie
              </span>
            </h2>
            <p className="mb-4 text-sm font-light leading-relaxed text-dentova-navy-600">
              <strong>Dentova Events</strong> est le leader incontournable engage
              dans l&apos;elevation des standards de la medecine bucco-dentaire
              en Algerie. Nous creons des environnements d&apos;apprentissage
              exclusifs ou la theorie scientifique moderne rencontre la rigueur
              du geste clinique.
            </p>
            <p className="mb-8 text-sm font-light leading-relaxed text-dentova-navy-600">
              En direct lien avec des mentors internationaux de renom et des
              industries de pointe, nos formations intensives equipent les
              omnipraticiens avec l&apos;excellence requise pour progresser au
              cabinet des le lendemain.
            </p>

            <div className="mb-8 flex w-full items-center gap-4 rounded-2xl border border-dentova-teal-100 bg-dentova-teal-50/60 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-dentova-teal-100 bg-white text-dentova-teal-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <p className="text-xs font-medium leading-relaxed text-dentova-teal-950">
                Programmes certifies, accredites officiellement par les
                conferenciers experts et co-valides pour dynamiser votre
                carriere.
              </p>
            </div>

            <div className="flex w-full items-start gap-4 rounded-r-2xl border-l-4 border-dentova-teal-600 bg-gradient-to-r from-dentova-teal-50/50 to-white p-6 shadow-sm transition-colors hover:from-dentova-teal-50">
              <div className="shrink-0 rounded-xl bg-dentova-teal-100 p-2.5 text-dentova-teal-700">
                <Compass className="h-5 w-5 text-dentova-teal-600" />
              </div>
              <div>
                <h4 className="mb-1 font-display text-sm font-bold text-dentova-teal-900">
                  Notre Vision de l&apos;Education
                </h4>
                <p className="text-xs font-light leading-relaxed text-dentova-navy-600">
                  &quot;Soutenir durablement les chirurgiens-dentistes algeriens
                  en leur offrant des opportunites d&apos;enseignement clinique
                  de standing international, renforcant l&apos;habilete et la
                  securite des traitements.&quot;
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:col-span-6">
            <div className="group relative flex h-64 flex-col justify-end overflow-hidden rounded-3xl border border-dentova-navy-200 bg-slate-100 p-6 shadow-lg">
              <Image
                alt="Dentova Classroom"
                className="object-cover transition-transform duration-500 group-hover:scale-105 saturate-50"
                fill
                sizes="(min-width: 1024px) 42vw, 92vw"
                src="/images/assets/about-clinical.webp"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              <div className="relative z-10 text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-dentova-teal-300">
                  DENTOVA EVENTS ACADEMIE
                </span>
                <h4 className="mt-1 font-display text-lg font-black leading-snug text-white">
                  Ateliers pratiques en direct & sessions interactives
                </h4>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    className="group flex items-start gap-5 rounded-2xl border border-dentova-navy-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-dentova-teal-300 hover:shadow-md"
                    key={pillar.title}
                  >
                    <div className="shrink-0 rounded-xl bg-dentova-navy-50 p-3 text-dentova-teal-700 transition-all duration-300 group-hover:bg-dentova-teal-600 group-hover:text-white">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="mb-1 font-display text-sm font-bold leading-snug text-dentova-navy-900">
                        {pillar.title}
                      </h4>
                      <p className="text-xs font-light leading-relaxed text-dentova-navy-600">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
