import Image from "next/image";
import { SectionHeader } from "@/components/public/SectionHeader";
import { Container } from "@/components/ui/Container";

const partnerLogos = [
  {
    name: "Orodent",
    src: "/images/partners/orodenl.jpg"
  },
  {
    name: "Blender for Dental",
    src: "/images/partners/blenderfordental.png"
  }
];

const marqueeLogos = Array.from({ length: 8 }, () => partnerLogos).flat();

export function PartnersSection() {
  return (
    <section className="border-t border-dentova-navy-100 bg-white px-6 py-20" id="partenaires">
      <Container className="text-center">
        <SectionHeader
          align="center"
          description="Des partenaires de confiance qui accompagnent nos formations."
          eyebrow="Partenaires"
          title="Notre"
          accent="ecosysteme"
        />
      </Container>

      <div className="relative mt-10 overflow-hidden border-y border-dentova-navy-100 bg-dentova-navy-50/50 py-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-dentova-navy-50/50 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-dentova-navy-50/50 to-transparent" />
        <div className="dentova-marquee flex w-max items-center gap-8 px-8">
          {marqueeLogos.map((partner, index) => (
            <div
              aria-hidden={index >= partnerLogos.length}
              className="relative h-20 w-36 shrink-0 rounded-lg border border-dentova-navy-100 bg-white p-4"
              key={`${partner.name}-${index}`}
            >
              <Image
                alt={partner.name}
                className="object-contain"
                fill
                sizes="144px"
                src={partner.src}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
