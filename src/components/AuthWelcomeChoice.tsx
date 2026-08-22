import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { AuthMode } from '../types/auth';
import { useMotion } from '../lib/motion';

interface AuthWelcomeChoiceProps {
  onSetAuthMode: (mode: AuthMode) => void;
  onGoHome: () => void;
  /** lg+ shows AuthPitch in its own column, so the step supplies the heading. */
  showHeading?: boolean;
}

/**
 * The welcome step's actions. Two buttons and a link.
 *
 * It was four CTAs — log in / create account / browse as guest / post a vacancy
 * — under four generic benefit chips and a five-item "who can use KejaFinder"
 * list. Three things were wrong with that:
 *
 * - **Four CTAs is no CTA.** There is one thing a new visitor should do.
 * - **"Post a vacancy" was a dead end.** It sent a signed-out user to the post
 *   tab, which immediately told them to create an account first.
 * - **The roles list belonged inside the flow.** Choosing a role is step 2 of
 *   signup and `profiles.role` is write-once, so naming five roles here invited
 *   a decision the user could not yet make.
 *
 * The old version also used `text-blue-500`, `text-purple-500` and
 * `text-teal-500` — three off-palette hues in a one-accent system.
 *
 * The reasons to sign up now live in AuthPitch, which is the left column at lg+
 * and sits above this on mobile.
 */
export default function AuthWelcomeChoice({
  onSetAuthMode, onGoHome, showHeading = false,
}: AuthWelcomeChoiceProps) {
  const m = useMotion();

  return (
    <motion.div variants={m.stagger(0.06)} initial="hidden" animate="show" className="flex flex-col gap-3">
      {showHeading && (
        <motion.h1
          variants={m.fadeUp}
          className="mb-2 text-[26px] font-black leading-[1.15] tracking-tight text-neutral-850 dark:text-stone-50"
        >
          Get started
        </motion.h1>
      )}

      <motion.button
        variants={m.fadeUp}
        type="button"
        whileTap={m.tap}
        onClick={() => onSetAuthMode('signup')}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 text-sm font-black uppercase tracking-wider text-white shadow-md shadow-emerald-700/20 transition-colors hover:bg-emerald-800 outline-none cursor-pointer"
      >
        Create an account
        <ArrowRight className="h-4 w-4 stroke-[2.4]" aria-hidden="true" />
      </motion.button>

      <motion.button
        variants={m.fadeUp}
        type="button"
        whileTap={m.tap}
        onClick={() => onSetAuthMode('login')}
        className="flex h-13 w-full items-center justify-center rounded-2xl border border-neutral-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-stone-100 transition-colors hover:bg-neutral-50 dark:hover:bg-stone-850 outline-none cursor-pointer"
      >
        I already have an account
      </motion.button>

      {/* A link, not a third button -- browsing is the fallback, not a peer of
        * the two real choices. */}
      <motion.button
        variants={m.fadeUp}
        type="button"
        onClick={onGoHome}
        className="mx-auto mt-1 py-2 text-2xs font-bold uppercase tracking-wider text-neutral-550 underline decoration-neutral-300 decoration-1 underline-offset-4 transition-colors hover:text-neutral-800 dark:text-stone-400 dark:decoration-stone-700 dark:hover:text-stone-100"
      >
        Browse without an account
      </motion.button>
    </motion.div>
  );
}
