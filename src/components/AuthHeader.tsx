import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

interface AuthHeaderProps {
  onBack: () => void;
}

export default function AuthHeader({ onBack }: AuthHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 bg-white/80 dark:bg-stone-950/80 backdrop-blur-xl border-b border-neutral-200/50 dark:border-stone-800/40"
    >
      <div className="flex items-center">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-stone-900 text-neutral-600 dark:text-stone-300 mr-3"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <span className="text-lg font-black tracking-tight text-neutral-850 dark:text-stone-100">
          KejaFinder
        </span>
      </div>

      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
        <ShieldCheck className="w-5 h-5" />
      </div>
    </motion.header>
  );
}
