"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { Sponsor } from "@/types";

export function SponsorsBar({ sponsors }: { sponsors: Sponsor[] }) {
  if (sponsors.length === 0) {
    return null;
  }

  const marqueeSponsors = [...sponsors, ...sponsors, ...sponsors];
  const duration = Math.max(18, sponsors.length * 8);

  return (
    <section className="overflow-hidden bg-white px-6 py-7">
      <Container>
        <div className="flex items-center gap-5 border-y border-dentova-navy-100/80 py-3">
          <p className="hidden shrink-0 text-xs font-bold uppercase tracking-[0.18em] text-dentova-navy-400 sm:block">
            Sponsors
          </p>
          <div className="relative min-w-0 flex-1 overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-10 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-10 bg-gradient-to-l from-white to-transparent" />
            <motion.div
              animate={{ x: ["0%", "-33.333%"] }}
              className="flex w-max items-center gap-8"
              transition={{ duration, ease: "linear", repeat: Infinity }}
            >
              {marqueeSponsors.map((sponsor, index) => {
                const logo = (
                  <span className="relative block h-10 w-28 shrink-0 opacity-75 grayscale transition hover:opacity-100 hover:grayscale-0 sm:h-11 sm:w-32">
                    <Image
                      alt={sponsor.name}
                      className="object-contain"
                      fill
                      sizes="128px"
                      src={sponsor.imageUrl}
                    />
                  </span>
                );

                return sponsor.websiteUrl ? (
                  <Link
                    aria-label={sponsor.name}
                    className="shrink-0"
                    href={sponsor.websiteUrl}
                    key={`${sponsor.id}-${index}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {logo}
                  </Link>
                ) : (
                  <span className="shrink-0" key={`${sponsor.id}-${index}`}>
                    {logo}
                  </span>
                );
              })}
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
