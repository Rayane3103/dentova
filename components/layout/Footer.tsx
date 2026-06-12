import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/constants";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Youtube
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const quickLinks = [
  { href: "/#hero", label: "Accueil" },
  { href: "/#courses", label: "Formations" },
  { href: "/#about", label: "À propos" },
  { href: "/#contact", label: "Contact" },
  { href: "/privacy", label: "Politique de confidentialité" },
  { href: "/terms", label: "Conditions d'utilisation" },
  { href: "/cookies", label: "Politique des cookies" }
];

const legalLinks = [
  { href: "/privacy", label: "Politique de confidentialité" },
  { href: "/terms", label: "Conditions d'utilisation" },
  { href: "/cookies", label: "Politique des cookies" }
];

const socialLinks = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" }
];

function FooterLink({
  href,
  label
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      className="group flex items-center gap-2 text-sm text-dentova-navy-300 transition-colors hover:text-dentova-teal-300"
      href={href}
    >
      <span className="text-dentova-teal-500/60 transition-transform group-hover:translate-x-0.5 group-hover:text-dentova-teal-400">
        ›
      </span>
      <span>{label}</span>
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-dentova-navy-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-dentova-teal-600/8 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-dentova-magenta/5 blur-3xl" />

      <Container className="relative z-10 pt-16 pb-10">
        <div className="grid grid-cols-1 gap-12 border-b border-white/10 pb-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col gap-5 lg:col-span-4">
            <Link className="inline-block w-fit" href="/">
              <Image
                alt="Dentova"
                className="h-7 w-auto object-contain brightness-0 invert"
                height={28}
                src="/brand/logo-white.svg"
                width={120}
              />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-dentova-navy-300">
              Plateforme d&apos;éducation dentaire premium offrant une formation
              pratique dispensée par des experts internationaux à des
              professionnels du monde entier.
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <Link
                  aria-label={label}
                  className="rounded-full border border-white/10 bg-white/5 p-2.5 text-dentova-navy-300 transition-all hover:border-dentova-teal-400/40 hover:bg-white/10 hover:text-dentova-teal-300"
                  href={href}
                  key={label}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 lg:pl-2">
            <h4 className="mb-5 font-display text-xs font-extrabold uppercase tracking-[0.2em] text-white">
              Liens rapides
            </h4>
            <nav className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <FooterLink key={link.href + link.label} {...link} />
              ))}
            </nav>
          </div>

          <div className="lg:col-span-3">
            <h4 className="mb-5 font-display text-xs font-extrabold uppercase tracking-[0.2em] text-white">
              Nous contacter
            </h4>
            <ul className="space-y-4">
              <li>
                <span className="flex items-start gap-3 text-sm text-dentova-navy-300">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-dentova-teal-500/20 bg-dentova-teal-500/10 text-dentova-teal-400">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <span className="pt-1 leading-relaxed">
                    Algiers, Algeria
                  </span>
                </span>
              </li>
              <li>
                <a
                  className="group flex items-start gap-3 text-sm text-dentova-navy-300 transition-colors hover:text-white"
                  href="tel:+213540153806"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-dentova-teal-500/20 bg-dentova-teal-500/10 text-dentova-teal-400 transition-colors group-hover:border-dentova-teal-400/40 group-hover:bg-dentova-teal-500/15">
                    <Phone className="h-4 w-4" />
                  </span>
                  <span className="pt-1 leading-relaxed">+213 540 15 38 06</span>
                </a>
              </li>
              <li>
                <a
                  className="group flex items-start gap-3 text-sm text-dentova-navy-300 transition-colors hover:text-white"
                  href={`mailto:${siteConfig.email}`}
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-dentova-teal-500/20 bg-dentova-teal-500/10 text-dentova-teal-400 transition-colors group-hover:border-dentova-teal-400/40 group-hover:bg-dentova-teal-500/15">
                    <Mail className="h-4 w-4" />
                  </span>
                  <span className="break-all pt-1 leading-relaxed">
                    {siteConfig.email}
                  </span>
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm sm:p-6">
              <h4 className="font-display text-xs font-extrabold uppercase tracking-[0.2em] text-white">
                Newsletter
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-dentova-navy-300">
                Abonnez-vous pour recevoir les dernières actualités et offres
                exclusives.
              </p>
              <div className="mt-5">
                <NewsletterForm
                  dark
                  footer
                  placeholder="Votre adresse email"
                  submitLabel="S'abonner"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 pt-2 text-xs text-dentova-navy-400 sm:flex-row">
          <p>&copy; 2026 Dentova. Tous droits réservés.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 sm:justify-end">
            {legalLinks.map((link, index) => (
              <span className="flex items-center" key={link.href}>
                {index > 0 ? (
                  <span aria-hidden className="mx-2 text-white/15">
                    ·
                  </span>
                ) : null}
                <Link
                  className="transition-colors hover:text-dentova-teal-300"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
