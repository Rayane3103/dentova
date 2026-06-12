"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { SectionHeader } from "@/components/public/SectionHeader";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import type { WorkshopImage } from "@/types";

const SLIDE_INTERVAL_MS = 5000;

export function ImageGallery({ images }: { images: WorkshopImage[] }) {
  const galleryImages = images.slice(0, 5);
  const sidebarImages = galleryImages.slice(0, 4);
  const [activeIndex, setActiveIndex] = useState(0);
  const [timerKey, setTimerKey] = useState(0);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
    setTimerKey((key) => key + 1);
  }, []);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % galleryImages.length);
    setTimerKey((key) => key + 1);
  }, [galleryImages.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % galleryImages.length);
    }, SLIDE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [galleryImages.length, timerKey]);

  const activeImage = galleryImages[activeIndex];

  if (galleryImages.length === 0 || !activeImage) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-dentova-navy-50 px-6 py-24">
      {/* Decorative float */}
      <motion.div
        aria-hidden="true"
        animate={{ x: [0, 10, 0, -10, 0] }}
        className="pointer-events-none absolute -right-20 top-1/4 h-96 w-96 rounded-full bg-dentova-teal-500/[0.04] blur-3xl"
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <Container>
        <motion.div
          className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-end"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            align="left"
            eyebrow="Immersion"
            description="Decouvrez nos moments forts en images."
            title="Galerie"
            accent="Dentova"
          />
          <p className="max-w-xl text-base font-light leading-relaxed text-dentova-navy-600 lg:ml-auto">
            Des formats concrets, des cas cliniques, et un environnement pense
            pour apprendre entre praticiens.
          </p>
        </motion.div>

        <motion.div
          className="mt-10 flex flex-col gap-4 lg:flex-row lg:gap-5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <div className="group relative min-h-[280px] flex-[7] overflow-hidden rounded-3xl bg-dentova-navy-900 text-left shadow-card sm:min-h-[360px] lg:min-h-[420px]">
            <AnimatePresence mode="wait">
              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0"
                exit={{ opacity: 0, scale: 1.03 }}
                initial={{ opacity: 0, scale: 0.97 }}
                key={activeIndex}
                transition={{ duration: 0.45, ease: "easeInOut" }}
              >
                <Image
                  alt={activeImage.title}
                  className="object-cover transition duration-500 group-hover:scale-[1.02]"
                  fill
                  priority={activeIndex === 0}
                  sizes="(min-width: 1024px) 65vw, 92vw"
                  src={activeImage.imageUrl}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dentova-navy-950/85 via-dentova-navy-950/10 to-transparent" />
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  className="pointer-events-none absolute inset-x-0 bottom-14 px-6 pb-2 text-white"
                  key={`caption-${activeIndex}`}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <p className="text-2xl font-extrabold leading-7 sm:text-3xl">
                    {activeImage.title}
                  </p>
                  {activeImage.description ? (
                    <p className="mt-2 max-w-xl text-sm font-light text-white/80 sm:text-base">
                      {activeImage.description}
                    </p>
                  ) : null}
                </motion.div>
              </motion.div>
            </AnimatePresence>

            <button
              aria-label="Afficher l'image suivante"
              className="absolute inset-x-0 top-0 bottom-12 z-[1] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-dentova-teal-500"
              onClick={nextSlide}
              type="button"
            />

            <div
              aria-label="Selection de l'image"
              className="absolute inset-x-0 bottom-5 z-[2] flex justify-center gap-2"
              role="group"
            >
              {galleryImages.map((image, index) => (
                <button
                  aria-label={`Afficher ${image.title}`}
                  aria-pressed={index === activeIndex}
                  className={cn(
                    "rounded-full transition-all duration-300",
                    index === activeIndex
                      ? "h-2.5 w-8 bg-white"
                      : "h-2.5 w-2.5 bg-white/45 hover:bg-white/75"
                  )}
                  key={image.id}
                  onClick={() => goToSlide(index)}
                  type="button"
                />
              ))}
            </div>
          </div>

          {/* Sidebar images with staggered reveal */}
          <div className="grid flex-[3] grid-cols-2 gap-3 sm:gap-4">
            {sidebarImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <button
                  aria-label={`Afficher ${image.title}`}
                  aria-pressed={index === activeIndex}
                  className={cn(
                    "group relative min-h-[120px] w-full overflow-hidden rounded-2xl bg-dentova-navy-900 shadow-card transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dentova-teal-500 focus-visible:ring-offset-2 sm:min-h-[140px] lg:min-h-0",
                    index === activeIndex
                      ? "ring-2 ring-dentova-teal-500 ring-offset-2"
                      : "hover:ring-2 hover:ring-white/40 hover:ring-offset-2"
                  )}
                  onClick={() => goToSlide(index)}
                  type="button"
                >
                  <Image
                    alt={image.title}
                    className="object-cover transition duration-500 group-hover:scale-105"
                    fill
                    sizes="(min-width: 1024px) 15vw, 45vw"
                    src={image.imageUrl}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dentova-navy-950/70 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3 text-left text-white">
                    <p className="text-xs font-bold leading-tight sm:text-sm">
                      {image.title}
                    </p>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
