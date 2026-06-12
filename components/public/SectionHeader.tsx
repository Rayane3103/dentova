"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: React.ReactNode;
  title: string;
  accent?: string;
  description?: string;
  align?: "center" | "left";
  tone?: "default" | "inverse";
  icon?: React.ReactNode;
};

export function SectionHeader({
  eyebrow,
  title,
  accent,
  description,
  align = "center",
  tone = "default",
  icon
}: SectionHeaderProps) {
  const inverse = tone === "inverse";

  return (
    <motion.div
      className={cn(
        "mx-auto max-w-2xl",
        align === "center" ? "text-center" : "text-left"
      )}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {eyebrow ? (
        <motion.p
          className={cn(
            "mb-3 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider",
            inverse ? "text-dentova-teal-300" : "text-dentova-teal-600"
          )}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          {icon}
          {eyebrow}
        </motion.p>
      ) : null}
      <h2
        className={cn(
          "font-display text-2xl font-bold leading-tight sm:text-3xl",
          inverse ? "text-white" : "text-dentova-navy-900"
        )}
      >
        {title}
        {accent ? (
          <span
            className={cn(
              inverse ? "text-dentova-teal-300" : "text-dentova-teal-600"
            )}
          >
            {" "}
            {accent}
          </span>
        ) : null}
      </h2>
      {description ? (
        <motion.p
          className={cn(
            "mt-3 text-sm leading-relaxed sm:text-base",
            inverse ? "text-white/70" : "text-dentova-navy-600"
          )}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {description}
        </motion.p>
      ) : null}
    </motion.div>
  );
}
