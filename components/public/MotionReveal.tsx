"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right";
type Variant = "fade" | "scale" | "rotate";

type MotionRevealProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  direction?: Direction;
  variant?: Variant;
  className?: string;
  once?: boolean;
  margin?: string;
};

const getInitial = (direction: Direction, variant: Variant) => {
  const base: Record<string, number> = { opacity: 0 };

  if (variant === "scale") return { ...base, scale: 0.85 };
  if (variant === "rotate") return { ...base, rotate: -6, scale: 0.95 };

  switch (direction) {
    case "up":    return { ...base, y: 30 };
    case "down":  return { ...base, y: -30 };
    case "left":  return { ...base, x: -40 };
    case "right": return { ...base, x: 40 };
    default:      return { ...base, y: 24 };
  }
};

const getAnimate = (variant: Variant) => {
  if (variant === "scale") return { opacity: 1, scale: 1 };
  if (variant === "rotate") return { opacity: 1, rotate: 0, scale: 1 };
  return { opacity: 1, x: 0, y: 0 };
};

export function MotionReveal({
  children,
  delay = 0,
  duration = 0.5,
  y,
  x,
  direction = "up",
  variant = "fade",
  className,
  once = true,
  margin = "-60px"
}: MotionRevealProps) {
  const initial = getInitial(direction, variant);
  const animate = getAnimate(variant);

  // Override with explicit values if provided
  if (y !== undefined) (initial as Record<string, number>).y = y;
  if (x !== undefined) (initial as Record<string, number>).x = x;

  return (
    <motion.div
      animate={animate}
      className={className}
      initial={initial}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once, margin }}
      whileInView={animate}
    >
      {children}
    </motion.div>
  );
}
