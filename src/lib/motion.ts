import { useReducedMotion } from 'motion/react';
import type { Transition, Variants } from 'motion/react';

/**
 * Shared motion vocabulary. The app already had a consistent feel -- spring
 * transitions, a 0.97 tap scale, staggered section fades -- but every value
 * was re-typed inline at each call site, so "consistent" was a coincidence
 * rather than a guarantee. These are the values that were already in use,
 * named once.
 *
 * Pair with useMotion() below so every animation collapses under
 * prefers-reduced-motion, which nothing in the app honoured before.
 */

/** Springs, tuned by distance travelled rather than by taste. */
export const spring = {
  /** Small, decisive UI: nav indicators, toggles. Was 400/30 in BottomNav. */
  snap: { type: 'spring', stiffness: 400, damping: 30 } as const,
  /** Default for cards and sheets settling into place. */
  settle: { type: 'spring', stiffness: 220, damping: 25 } as const,
  /** Large surfaces: bottom sheets travelling most of the screen. */
  sheet: { type: 'spring', stiffness: 150, damping: 20 } as const,
} satisfies Record<string, Transition>;

/** Durations for opacity/colour crossfades, where a spring would be wrong. */
export const duration = {
  instant: 0.12,
  fast: 0.18,
  base: 0.3,
} as const;

/** Press feedback. One scale, applied everywhere, so taps feel the same. */
export const tap = { scale: 0.97 } as const;

/** Section entrance: fade up a short distance. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

/**
 * Stagger container. `step` is per-child delay -- 30-50ms reads as one
 * gesture; slower reads as a queue.
 */
export function stagger(step = 0.04, delayChildren = 0): Variants {
  return {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: step, delayChildren } },
  };
}

/**
 * Reduced-motion-aware accessors. Under `prefers-reduced-motion: reduce`
 * transitions become instant and travel/scale is dropped, so state still
 * changes but nothing moves.
 *
 *   const m = useMotion();
 *   <motion.div {...m.fadeUp} transition={m.spring.settle} whileTap={m.tap} />
 */
export function useMotion() {
  const reduce = useReducedMotion();

  const still: Transition = { duration: 0 };

  return {
    reduce: !!reduce,
    spring: reduce
      ? { snap: still, settle: still, sheet: still }
      : spring,
    duration: reduce
      ? { instant: 0, fast: 0, base: 0 }
      : duration,
    /** Empty object rather than scale:1 -- avoids a pointless re-render. */
    tap: reduce ? {} : tap,
    fadeUp: reduce
      ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
      : fadeUp,
    stagger: (step = 0.04, delayChildren = 0) =>
      reduce
        ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
        : stagger(step, delayChildren),
  };
}
