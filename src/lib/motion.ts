/**
 * Motion helpers that respect prefers-reduced-motion.
 * Keep transitions tasteful; never rely on JS-only animation for meaning.
 */

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** CSS class helpers applied when motion is allowed */
export const motionSafe = {
  fadeIn: "motion-safe:animate-fade-in",
  rise: "motion-safe:animate-rise",
  transition: "motion-safe:transition-all motion-safe:duration-300",
} as const;
