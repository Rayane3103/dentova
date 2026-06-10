import { ContactForm } from "@/components/forms/ContactForm";
import { SectionHeader } from "@/components/public/SectionHeader";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/constants";
import { Mail, MapPin, Phone } from "lucide-react";

const locations = [
  { city: "Alger", address: "Centre d'Affaires El-Qods, Cheraga" },
  { city: "Oran", address: "Residence El-Bahia, Frange Maritime" },
  { city: "Constantine", address: "Boulevard Belouizdad, Immeuble Lafayette" }
];

export function ContactSection() {
  return (
    <section className="border-t border-dentova-navy-100 bg-dentova-navy-50/40 px-6 py-20" id="contact">
      <Container>
        <SectionHeader
          align="center"
          description="Une question sur une formation, un partenariat ou une inscription ? Nous vous repondons sous 24h."
          eyebrow="Contact"
          title="Ecrivez"
          accent="nous"
        />
        <div className="mx-auto mt-10 grid max-w-5xl gap-10 lg:grid-cols-[1fr_280px] lg:items-start">
          <div className="rounded-2xl border border-dentova-navy-100 bg-white p-6 sm:p-8">
            <ContactForm />
          </div>
          <aside className="space-y-6 text-sm text-dentova-navy-600">
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-dentova-navy-500">
                Coordonnees
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-dentova-teal-600" />
                  <span>{siteConfig.location}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-dentova-teal-600" />
                  <span>{siteConfig.phone}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-dentova-teal-600" />
                  <span>{siteConfig.email}</span>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-dentova-navy-500">
                Nos centres
              </p>
              <ul className="space-y-2.5">
                {locations.map((loc) => (
                  <li key={loc.city}>
                    <span className="font-medium text-dentova-navy-800">{loc.city}</span>
                    <span className="text-dentova-navy-500"> — {loc.address}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
