import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

interface SafetyHeaderProps {
  onBack: () => void;
}

export default function SafetyHeader({ onBack }: SafetyHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 bg-white/80 dark:bg-stone-950/80 backdrop-blur-xl border-b border-neutral-200/50 dark:border-stone-800/50 shadow-sm"
    >
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-stone-900 border border-neutral-200 dark:border-stone-800 text-neutral-700 dark:text-stone-300 hover:bg-neutral-200 dark:hover:bg-stone-800 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft className="w-5 h-5" />
      </motion.button>
      
      <div className="flex-1 flex justify-center">
        <h1 className="text-base font-black text-neutral-800 dark:text-stone-100 tracking-tight uppercase">
          Safety
        </h1>
      </div>

      <div className="w-10 h-10 flex items-center justify-center">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
      </div>
    </motion.header>
  );
}
