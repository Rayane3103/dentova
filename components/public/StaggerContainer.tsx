"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type StaggerContainerProps = {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
  margin?: string;
  y?: number;
};

/**
 * Wraps a list of children and animates them in sequentially
 * on scroll into view. Each child gets its own fade-up with
 * a staggered delay.
 */
export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.08,
  once = true,
  margin = "-40px",
  y = 20
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.05
          }
        }
      }}
      viewport={{ once, margin }}
      whileInView="visible"
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }
                }
              }}
            >
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}
