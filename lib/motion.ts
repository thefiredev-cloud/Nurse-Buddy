"use client";

import { useEffect, useState } from "react";
import type { Variants } from "framer-motion";

/**
 * Hook to detect if user prefers reduced motion
 * Returns true if user has enabled reduced motion preference
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Optimized animation variants for Framer Motion
 * Automatically respects prefers-reduced-motion
 */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/**
 * Get animation props that respect reduced motion preference
 */
export function getAnimationProps(reducedMotion: boolean) {
  if (reducedMotion) {
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      transition: { duration: 0 },
    };
  }

  return {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, margin: "-50px" },
  };
}

/**
 * Viewport options for scroll animations
 */
export const defaultViewport = {
  once: true,
  margin: "-50px",
  amount: 0.3,
};

/**
 * Common transition presets
 */
export const transitions = {
  fast: { duration: 0.2, ease: "easeOut" },
  default: { duration: 0.4, ease: "easeOut" },
  slow: { duration: 0.6, ease: "easeOut" },
  spring: { type: "spring", stiffness: 400, damping: 25 },
  springGentle: { type: "spring", stiffness: 300, damping: 30 },
  bounce: { type: "spring", stiffness: 500, damping: 15 },
};

/**
 * Hover animation presets
 */
export const hoverScale = {
  scale: 1.02,
  transition: transitions.spring,
};

export const hoverLift = {
  y: -4,
  transition: transitions.spring,
};

export const tapScale = {
  scale: 0.98,
  transition: transitions.fast,
};

/**
 * Create staggered animation variants with custom settings
 */
export function createStaggerVariants(
  staggerDelay = 0.1,
  childDuration = 0.4
): { container: Variants; item: Variants } {
  return {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: 0.1,
        },
      },
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: childDuration, ease: "easeOut" },
      },
    },
  };
}

/**
 * Animation wrapper component props helper
 */
export function getMotionDivProps(
  reducedMotion: boolean,
  variants: Variants,
  delay = 0
) {
  if (reducedMotion) {
    return {};
  }

  return {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, margin: "-50px" },
    variants,
    transition: { delay },
  };
}
