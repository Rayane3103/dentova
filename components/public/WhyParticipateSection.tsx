import {
  CheckCircle,
  Flame,
  GraduationCap,
  Monitor,
  Target,
  Users
} from "lucide-react";
import { Container } from "@/components/ui/Container";

const points = [
  {
    icon: Target,
    tag: "Pratique Reelle",
    title: "Travaux Pratiques en Hands-On direct",
    description:
      "Plus de 70% du temps de formation est alloue a la manipulation concrete sur des fantomes anatomiques haut de gamme ou des simulateurs de cabinet moderne.",
    iconColor: "bg-teal-500/10 border-teal-500/20 text-teal-600"
  },
  {
    icon: Users,
    tag: "Expertise Mondiale",
    title: "Intervenants et Conferenciers Experts",
    description:
      "Formez-vous aupres de leaders opinion nationaux et internationaux reconnus issus d'institutions academiques majeures ou de cliniques specialisees reputees.",
    iconColor: "bg-sky-500/10 border-sky-500/20 text-sky-600"
  },
  {
    icon: Monitor,
    tag: "Derniere Technologie",
    title: "Equipement Clinique Ultra-Moderne",
    description:
      "Accedez a des technologies dentaires immersives haut de gamme : cameras intra-orales 3D, microscopes operatoires cliniques, moteurs d'endodontie intelligents, etc.",
    iconColor: "bg-violet-500/10 border-violet-500/20 text-violet-600"
  },
  {
    icon: GraduationCap,
    tag: "Accompagnement Suivi",
    title: "Mentorat de Cas Cliniques sur 6 Mois",
    description:
      "Beneficiez d'un accompagnement inedit post-formation : integrez en toute serenite vos cas de cabinet avec un soutien direct par le conferencier et la cohorte.",
    iconColor: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
  }
];

export function WhyParticipateSection() {
  return (
    <section
      className="relative bg-gradient-to-b from-dentova-navy-50 to-white px-6 py-24"
      id="why-us"
    >
      <Container>
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-dentova-teal-100 bg-dentova-teal-50 px-4 py-1 text-sm font-black uppercase tracking-widest text-dentova-teal-700">
            <Flame className="h-3 w-3 animate-bounce" />
            POURQUOI PARTICIPER ?
          </span>
          <h2 className="font-display text-3xl font-extrabold leading-tight text-dentova-navy-900 sm:text-4xl">
            Prenez une longueur d&apos;avance dans{" "}
            <span className="bg-gradient-to-r from-dentova-magenta to-dentova-lavender bg-clip-text text-transparent">
              votre Pratique Dentaire
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-light text-dentova-navy-600">
            L&apos;evolution des technologies et des exigences des patients
            necessite une mise a jour constante. Decouvrez comment nous
            transformons votre apprentissage en reussite clinique.
          </p>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          {points.map((point) => {
            const Icon = point.icon;
            return (
              <div
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-dentova-navy-200/50 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg"
                key={point.title}
              >
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-dentova-teal-500/5 blur-2xl transition-transform duration-500 group-hover:scale-150" />

                <div className="relative z-10 flex flex-col items-start gap-6 sm:flex-row">
                  <div
                    className={`flex-shrink-0 rounded-2xl border p-4 shadow-inner transition-transform group-hover:scale-110 ${point.iconColor}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-grow text-left">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-dentova-teal-600">
                      {point.tag}
                    </span>
                    <h3 className="mb-3 font-display text-xl font-bold text-dentova-navy-900 transition-colors group-hover:text-dentova-teal-700">
                      {point.title}
                    </h3>
                    <p className="text-sm font-light leading-relaxed text-dentova-navy-600">
                      {point.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-dentova-navy-900 p-8 text-left text-white shadow-xl sm:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-dentova-teal-900/40 to-transparent opacity-40" />

          <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h3 className="mb-3 font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Pret a integrer les techniques dentaires de demain ?
              </h3>
              <p className="max-w-3xl text-sm font-light leading-relaxed text-dentova-navy-200 sm:text-base">
                Toutes nos formations sont validees, certifiantes et dotees
                d&apos;un nombre de sieges restreint (10 a 15 participants
                maximum) afin de garantir une attention continue et un
                encadrement hautement qualitatif lors des travaux pratiques.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center lg:col-span-4 lg:flex-col lg:items-start xl:pl-6">
              {[
                "Attestation clinique de haut niveau",
                "Accreditation Dentova Events",
                "Supports cliniques exclusifs inclus"
              ].map((item) => (
                <div className="flex items-center gap-3" key={item}>
                  <CheckCircle className="h-5 w-5 shrink-0 text-dentova-teal-400" />
                  <span className="text-sm font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
