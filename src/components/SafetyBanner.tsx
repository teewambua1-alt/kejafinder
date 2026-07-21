import { useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SafetyBanner() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="safety-banner"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
          className="w-full relative rounded-2xl bg-gradient-to-r from-emerald-50/70 to-emerald-50/20 dark:from-emerald-950/30 dark:to-emerald-950/10 border border-emerald-100 dark:border-emerald-900/55 p-4 shadow-3xs overflow-hidden flex items-start space-x-3.5 transition-colors duration-300"
        >
        {/* Subtle decorative background illustration of estate/plot house on the right side */}
        <div className="absolute right-0 bottom-0 top-0 w-2/5 opacity-[0.09] dark:opacity-[0.14] pointer-events-none select-none flex items-end justify-end transition-opacity">
          <svg viewBox="0 0 120 80" className="h-full w-auto text-emerald-800 dark:text-emerald-300" fill="currentColor">
            <path d="M10 80 L30 50 L50 80 Z" />
            <path d="M40 80 L60 40 L80 80 Z" />
            <rect x="75" y="45" width="35" height="35" rx="2" />
            <polygon points="70,45 92.5,25 115,45" />
            <rect x="87" y="60" width="10" height="20" />
          </svg>
        </div>

        {/* 1. Shield Check Icon Container on the Left */}
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 dark:border-emerald-500/35 flex items-center justify-center shrink-0 shadow-3xs transition-colors">
          <ShieldCheck className="w-5.5 h-5.5 text-emerald-600 dark:text-emerald-450 stroke-[2.2]" />
        </div>

        {/* 2. Text Message Content in the Middle */}
        <div className="flex-1 flex flex-col pr-6">
          <h4 className="font-sans text-[13px] font-extrabold text-neutral-800 dark:text-neutral-50 leading-tight tracking-tight">
            Stay safe on KejaFinder
          </h4>
          <p className="font-sans text-[11px] text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed mt-1 max-w-[92%]">
            Never send deposit before physically viewing the house and confirming the caretaker or landlord.
          </p>
        </div>

        {/* 3. Close Dismiss Button on the Top-Right */}
        <button
          onClick={() => setIsVisible(false)}
          id="btn-close-safety"
          className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full bg-neutral-200/40 dark:bg-stone-800/80 hover:bg-neutral-200/70 dark:hover:bg-stone-750/90 active:scale-90 text-neutral-500 dark:text-stone-400 hover:text-neutral-700 dark:hover:text-stone-200 flex items-center justify-center transition-all cursor-pointer outline-none border-none animate-none"
          aria-label="Dismiss safety message"
        >
          <X className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>

        {/* Small floating check status ornament mimicking the bottom right image badge overlay */}
        <div className="absolute bottom-3 right-8 pointer-events-none opacity-45">
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-white stroke-[2.5]" />
          </div>
        </div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}
