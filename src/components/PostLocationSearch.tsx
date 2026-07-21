import React, { useState } from 'react';
import { Search, Locate } from 'lucide-react';
import { motion } from 'motion/react';

interface PostLocationSearchProps {
  value: string;
  onChange: (val: string) => void;
}

export default function PostLocationSearch({ value, onChange }: PostLocationSearchProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full relative z-10"
    >
      <div className="flex flex-col space-y-1.5">
        <label htmlFor="location-search-input" className="sr-only">
          Search Estate, Area or Landmark
        </label>
        <div className="relative flex items-center">
          {/* Search Icon */}
          <Search className="absolute left-4 w-4.5 h-4.5 text-neutral-400 dark:text-stone-600 pointer-events-none stroke-[2.2]" />
          
          <input
            type="text"
            id="location-search-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search estate, area, or landmark..."
            className="w-full h-12.5 pl-11 pr-12 bg-white/70 dark:bg-stone-900/40 backdrop-blur-md rounded-2xl border border-neutral-100 dark:border-neutral-800/80 text-xs font-bold text-neutral-800 dark:text-stone-105 placeholder-neutral-450 dark:placeholder-stone-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/15 focus:border-emerald-500/85 focus:bg-white dark:focus:bg-stone-900 transition-all font-sans"
          />

          {/* Quick Clear / Locate button on the right */}
          <button
            type="button"
            aria-label="Use current GPS location"
            className="absolute right-3.5 w-8.5 h-8.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-stone-800 active:scale-95 text-neutral-400 dark:text-stone-500 hover:text-emerald-600 dark:hover:text-emerald-450 flex items-center justify-center transition-all cursor-pointer"
          >
            <Locate className="w-4.5 h-4.5 stroke-[2.2]" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
