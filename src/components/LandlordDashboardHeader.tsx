import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Building2 } from 'lucide-react';

interface LandlordDashboardHeaderProps {
  onBack: () => void;
}

export default function LandlordDashboardHeader({ onBack }: LandlordDashboardHeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-neutral-200/50 dark:border-stone-800/50"
    >
      <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-100/50 dark:bg-stone-800/50 text-neutral-700 dark:text-stone-300 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </motion.button>
        
        <h1 className="text-[15px] font-black tracking-tight text-neutral-800 dark:text-stone-100 uppercase">
          Dashboard
        </h1>

        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400" aria-hidden="true">
          <Building2 className="w-5 h-5 stroke-[2.2]" />
        </div>
      </div>
    </motion.header>
  );
}
