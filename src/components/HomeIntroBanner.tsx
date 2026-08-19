import { useState } from 'react';
import { Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

const DISMISS_KEY = 'kejafinder-intro-dismissed';

/**
 * One-time explainer for a brand-new, signed-out visitor landing on Home --
 * the app otherwise has no onboarding at all before this, just a one-line
 * tagline in HeroSearch. Persists only on explicit dismiss (not on mount),
 * matching SafetyBanner's exact convention -- App.tsx unmounts/remounts the
 * Home tab's content on every tab switch, so marking "seen" on mount alone
 * would make this vanish after a single tab-away-and-back within one visit.
 */
export default function HomeIntroBanner() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(DISMISS_KEY) !== '1';
  });

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(DISMISS_KEY, '1');
  };

  if (user || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full relative rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/25 border border-emerald-100 dark:border-emerald-900/50 p-4 pr-11 shadow-3xs flex items-start space-x-3"
      >
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <Info className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
        </div>
        <div>
          <h4 className="font-sans text-[13px] font-extrabold text-neutral-800 dark:text-neutral-50 leading-tight tracking-tight">
            New to KejaFinder?
          </h4>
          <p className="font-sans text-[11px] text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed mt-1">
            Search vacant houses near you, contact caretakers directly, and always view a home in person before paying anything.
          </p>
        </div>

        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 w-10 h-10 rounded-full bg-neutral-200/40 dark:bg-stone-800/80 hover:bg-neutral-200/70 dark:hover:bg-stone-750/90 active:scale-90 text-neutral-500 dark:text-stone-400 hover:text-neutral-700 dark:hover:text-stone-200 flex items-center justify-center transition-all cursor-pointer outline-none border-none"
          aria-label="Dismiss introduction"
        >
          <X className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
