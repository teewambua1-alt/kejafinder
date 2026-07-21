import React from 'react';
import { motion } from 'motion/react';
import { Heart, Compass, Search } from 'lucide-react';

interface SavedEmptyStateProps {
  onBrowseHomes?: () => void;
  onSearchNearby?: () => void;
}

export default function SavedEmptyState({ onBrowseHomes, onSearchNearby }: SavedEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="bg-white/70 dark:bg-stone-900/40 backdrop-blur-md rounded-2.5xl border border-dashed border-neutral-250 dark:border-neutral-800/80 p-8 py-10 shadow-3xs text-center flex flex-col items-center justify-center space-y-5"
    >
      {/* Decorative Icon Area */}
      <div className="relative">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-3xs">
          <Heart className="w-7.5 h-7.5 stroke-[2]" />
        </div>
        {/* Tiny warm orange badge accent to signify interactive status */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
        </span>
      </div>

      {/* Structured Text block */}
      <div className="space-y-1.5">
        <h3 className="text-base font-extrabold text-neutral-800 dark:text-stone-300">
          No saved homes yet
        </h3>
        <p className="text-xs text-neutral-550 dark:text-stone-400 max-w-[250px] mx-auto leading-relaxed">
          Tap the heart on homes you like and they’ll appear here.
        </p>
      </div>

      {/* Accessibility Compliant Dual Action Buttons */}
      <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 w-full max-w-[260px] pt-1">
        
        {/* Primary CTA: Browse */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onBrowseHomes}
          className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11.5px] tracking-tight shadow-md flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
          aria-label="Browse popular homes"
        >
          <Compass className="w-4 h-4 stroke-[2.5]" />
          <span>Browse homes</span>
        </motion.button>

        {/* Secondary CTA: Search Nearby */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onSearchNearby || onBrowseHomes}
          className="h-10 px-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-stone-850 text-neutral-700 dark:text-stone-300 font-extrabold text-[11.5px] tracking-tight flex items-center justify-center space-x-1.5 cursor-pointer hover:bg-neutral-50 dark:hover:bg-stone-800 transition-colors shadow-3xs"
          aria-label="Search homes nearby"
        >
          <Search className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Search nearby</span>
        </motion.button>

      </div>
    </motion.div>
  );
}
