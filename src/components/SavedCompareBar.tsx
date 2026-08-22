import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Listing } from '../types/listing';
import { Columns3, Trash2 } from 'lucide-react';

interface SavedCompareBarProps {
  selectedListings: Listing[];
  onClear: () => void;
  onCompare: () => void;
}

export default function SavedCompareBar({ 
  selectedListings, 
  onClear, 
  onCompare 
}: SavedCompareBarProps) {
  if (selectedListings.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 70 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 70 }}
        transition={{ type: 'spring', damping: 20, stiffness: 220 }}
        // Sticky above the bottom navigation panel
        className="fixed bottom-[76px] left-4 right-4 z-[var(--z-overlay)] max-w-lg mx-auto bg-white/90 dark:bg-stone-900/95 backdrop-blur-md border border-neutral-150 dark:border-stone-800 rounded-2.5xl p-3.5 shadow-lg flex items-center justify-between space-x-3 select-none"
      >
        {/* Left Side: Thumbnail Row & Label counts */}
        <div className="flex items-center space-x-3.5 min-w-0">
          {/* Active Thumb Stack */}
          <div className="flex -space-x-2.5 items-center shrink-0">
            {selectedListings.map((lst) => (
              <motion.div
                key={lst.id}
                layoutId={`compare-thumb-${lst.id}`}
                className="w-8 h-8 rounded-lg overflow-hidden border border-white dark:border-stone-900 shadow-3xs bg-neutral-100 dark:bg-stone-950"
              >
                <img
                  src={lst.image}
                  alt={lst.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </motion.div>
            ))}
          </div>

          {/* Texts */}
          <div className="min-w-0">
            <span className="block text-[11.5px] font-black text-neutral-800 dark:text-neutral-50 tracking-tight leading-none">
              {selectedListings.length} {selectedListings.length === 1 ? 'Keja' : 'Kejas'} Selected
            </span>
            <span className="block text-2xs font-semibold text-neutral-550 dark:text-stone-400">
              Max 3 can be compared side-by-side
            </span>
          </div>
        </div>

        {/* Right Side: Action Controllers */}
        <div className="flex items-center space-x-2 shrink-0">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClear}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-neutral-100 dark:hover:bg-stone-800 text-neutral-700 hover:text-neutral-600 dark:text-stone-400 dark:hover:text-stone-200 transition-colors cursor-pointer"
            title="Clear compare selection"
            aria-label="Clear all compared listings"
          >
            <Trash2 className="w-4 h-4 stroke-[2]" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onCompare}
            className="h-9 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-[11.5px] tracking-tight flex items-center space-x-1.5 cursor-pointer shadow-3xs transition-colors"
          >
            <Columns3 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Compare Now</span>
          </motion.button>
        </div>

      </motion.div>
    </AnimatePresence>
  );
}
