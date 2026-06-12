"use client";

import { motion } from "framer-motion";

type ParallaxBlobProps = {
  className?: string;
  size?: string;
  color?: string;
  speed?: number;
  delay?: number;
};

/**
 * A floating blurred circle that drifts slowly —
 * gives a subtle parallax / depth feel to the background.
 */
export function ParallaxBlob({
  className = "",
  size = "400px",
  color = "bg-dentova-teal-500/5",
  speed = 20,
  delay = 0
}: ParallaxBlobProps) {
  return (
    <motion.div
      animate={{
        y: [0, -20, 0, 15, 0],
        x: [0, 10, -10, 5, 0],
        scale: [1, 1.05, 0.97, 1.03, 1]
      }}
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full blur-3xl ${color} ${className}`}
      style={{ width: size, height: size }}
      transition={{
        duration: speed,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}
