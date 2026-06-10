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
import { navItems, siteConfig } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-dentova-navy-100 bg-dentova-navy-950 pt-16 pb-8 text-white">
      <Container className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Link className="inline-block" href="/">
            <Image
              alt="Dentova"
              className="h-7 w-auto object-contain brightness-0 invert"
              height={28}
              src="/brand/logo-white.svg"
              width={110}
            />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-dentova-navy-300">
            Formation dentaire d&apos;excellence et evenements scientifiques en
            Algerie.
          </p>
          <div className="mt-5 flex items-center gap-3">
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

        <div className="lg:col-span-3 lg:pl-2">
          <h4 className="mb-4 text-sm font-semibold text-white">Navigation</h4>
          <nav className="flex flex-col gap-2.5">
            {navItems.map((item) => (
              <Link
                className="text-sm text-dentova-navy-300 transition-colors hover:text-white"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
            <Link
              className="text-sm text-dentova-navy-300 transition-colors hover:text-white"
              href="/privacy"
            >
              Confidentialite
            </Link>
            <Link
              className="text-sm text-dentova-navy-300 transition-colors hover:text-white"
              href="/terms"
            >
              Conditions
            </Link>
          </nav>
        </div>

        <div className="lg:col-span-2">
          <h4 className="mb-4 text-sm font-semibold text-white">Contact</h4>
          <div className="flex flex-col gap-2.5 text-sm text-dentova-navy-300">
            <span className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-dentova-teal-400" />
              {siteConfig.location}
            </span>
            <span className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-dentova-teal-400" />
              {siteConfig.phone}
            </span>
            <span className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-dentova-teal-400" />
              {siteConfig.email}
            </span>
          </div>
        </div>

        <div className="lg:col-span-3">
          <h4 className="mb-4 text-sm font-semibold text-white">Newsletter</h4>
          <p className="mb-3 text-sm text-dentova-navy-300">
            Recevez les dates de nos prochaines formations.
          </p>
          <NewsletterForm compact dark />
        </div>
      </Container>

      <Container className="flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-xs text-dentova-navy-400 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Dentova Events. Tous droits reserves.</p>
      </Container>
    </footer>
  );
}
