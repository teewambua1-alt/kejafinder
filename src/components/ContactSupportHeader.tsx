import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, LifeBuoy } from 'lucide-react';

interface ContactSupportHeaderProps {
  onBack: () => void;
}

export default function ContactSupportHeader({ onBack }: ContactSupportHeaderProps) {
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
          Support
        </h1>

        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400" aria-hidden="true">
          <LifeBuoy className="w-5 h-5 stroke-[2.2]" />
        </div>
      </div>
    </motion.header>
  );
}
