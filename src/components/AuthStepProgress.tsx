import React from 'react';
import { motion } from 'motion/react';
import { useMotion } from '../lib/motion';

interface AuthStepProgressProps {
  /** Ordered step labels. */
  steps: string[];
  /** Zero-based index of the current step. */
  current: number;
}

/**
 * Step indicator for the sign-up flow, which is three screens long and
 * previously gave no sense of length or position at all.
 *
 * The visible bar is decorative; the sentence beside it is the real
 * announcement, so screen-reader users get "Step 2 of 3: Your role" rather
 * than a row of unlabelled divs.
 */
export default function AuthStepProgress({ steps, current }: AuthStepProgressProps) {
  const m = useMotion();
  const total = steps.length;
  const clamped = Math.min(Math.max(current, 0), total - 1);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-550 dark:text-stone-400">
        Step {clamped + 1} of {total}
        <span className="text-neutral-550 dark:text-stone-400"> &middot; {steps[clamped]}</span>
      </p>
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {steps.map((label, i) => (
          <div
            key={label}
            className="h-1 flex-1 rounded-full bg-neutral-200 dark:bg-stone-800 overflow-hidden"
          >
            <motion.div
              initial={false}
              animate={{ scaleX: i <= clamped ? 1 : 0 }}
              transition={m.spring.settle}
              style={{ originX: 0 }}
              className="h-full w-full rounded-full bg-emerald-700 dark:bg-emerald-700"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
