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
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/constants";

const partnerLogos = [
  { name: "Orodent", src: "/images/partners/orodenl.jpg" },
  { name: "Blender for Dental", src: "/images/partners/blenderfordental.png" }
];

export function Footer() {
  return (
    <footer className="border-t border-dentova-navy-100 bg-dentova-navy-950 text-white">
      <Container className="grid grid-cols-1 gap-10 py-12 md:grid-cols-3 md:gap-8">
        <div>
          <Link className="inline-block" href="/">
            <Image
              alt="Dentova"
              className="h-7 w-auto object-contain brightness-0 invert"
              height={28}
              src="/brand/logo-white.svg"
              width={110}
            />
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-dentova-navy-300">
            Formation dentaire d&apos;excellence en Algerie.
          </p>
          <div className="mt-4 flex items-center gap-2">
            {[
              { icon: Facebook, label: "Facebook" },
              { icon: Instagram, label: "Instagram" },
              { icon: Linkedin, label: "LinkedIn" },
              { icon: Youtube, label: "YouTube" }
            ].map(({ icon: Icon, label }) => (
              <Link
                aria-label={label}
                className="rounded-md p-2 text-dentova-navy-400 transition-colors hover:bg-white/5 hover:text-white"
                href="#"
                key={label}
              >
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Contact</h4>
          <div className="flex flex-col gap-2.5 text-sm text-dentova-navy-300">
            <span className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-dentova-teal-400" />
              {siteConfig.location}
            </span>
            <a
              className="flex items-start gap-2 transition-colors hover:text-white"
              href={`tel:${siteConfig.phone}`}
            >
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-dentova-teal-400" />
              {siteConfig.phone}
            </a>
            <a
              className="flex items-start gap-2 transition-colors hover:text-white"
              href={`mailto:${siteConfig.email}`}
            >
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-dentova-teal-400" />
              {siteConfig.email}
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Newsletter</h4>
          <p className="mb-3 text-sm text-dentova-navy-300">
            Dates des prochaines formations.
          </p>
          <NewsletterForm compact dark />
        </div>
      </Container>

      <Container className="border-t border-white/10 py-6">
        <div className="flex flex-wrap items-center justify-center gap-6">
          {partnerLogos.map((partner) => (
            <div className="relative h-8 w-24 opacity-60" key={partner.name}>
              <Image
                alt={partner.name}
                className="object-contain brightness-0 invert"
                fill
                sizes="96px"
                src={partner.src}
              />
            </div>
          ))}
        </div>
      </Container>

      <Container className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs text-dentova-navy-400 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Dentova Events. Tous droits reserves.</p>
        <div className="flex gap-4">
          <Link className="transition-colors hover:text-white" href="/privacy">
            Confidentialite
          </Link>
          <Link className="transition-colors hover:text-white" href="/terms">
            Conditions
          </Link>
        </div>
      </Container>
    </footer>
  );
}
