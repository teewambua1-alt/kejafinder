import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function HeroSearch({ searchQuery, onSearchChange }: HeroSearchProps) {
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
      className="w-full flex flex-col space-y-5"
    >
      {/* 1. Hero Headline & Subtitle */}
      <div className="flex flex-col space-y-1.5">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-neutral-800 dark:text-neutral-50 leading-[1.15]">
          Find a vacant house <br />
          <span className="text-emerald-600 dark:text-emerald-500">near you</span>
        </h1>
        <p className="text-[13px] font-medium text-neutral-500 dark:text-neutral-400 tracking-wide">
          Affordable homes. Verified listings. Peace of mind.
        </p>
      </div>

      {/* 2. Main Large Rounded Search Pill */}
      <form onSubmit={handleSearchSubmit} className="w-full relative">
        <div className="relative flex items-center bg-white/95 dark:bg-stone-800/90 backdrop-blur-md rounded-2xl border border-neutral-100/90 dark:border-neutral-700/80 shadow-md focus-within:border-emerald-500/50 focus-within:shadow-lg transition-all p-1.5 pl-4">
          
          {/* Search Icon on the Left */}
          <Search className="w-5.5 h-5.5 text-neutral-400 dark:text-stone-400 shrink-0 mr-3 stroke-[2]" />
          
          {/* Text Input area */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search estate, area, landmark..."
            className="w-full bg-transparent text-[14px] text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-stone-500 outline-none pr-12 py-2"
          />

          {/* Filter Icon Button on the Right */}
          <button
            type="button"
            id="btn-filters"
            className="absolute right-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 active:scale-95 transition-all outline-none"
            aria-label="Filter Vacancies"
          >
            <SlidersHorizontal className="w-4.5 h-4.5 stroke-[2.2]" />
          </button>
        </div>
      </form>
    </motion.div>
  );
}
