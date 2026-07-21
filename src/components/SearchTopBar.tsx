import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';

interface SearchTopBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onOpenFilters?: () => void;
}

export default function SearchTopBar({ searchQuery, onSearchChange, onOpenFilters }: SearchTopBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
      className="w-full"
    >
      <form onSubmit={handleSubmit} className="w-full relative">
        <div className="relative flex items-center bg-white/95 dark:bg-stone-800/90 backdrop-blur-md rounded-2xl border border-neutral-100/90 dark:border-neutral-700/80 shadow-md focus-within:border-emerald-500/50 focus-within:shadow-lg transition-all p-1.5 pl-4">
          
          {/* Search Icon on the Left */}
          <Search className="w-5.5 h-5.5 text-neutral-400 dark:text-stone-400 shrink-0 mr-3 stroke-[2]" />
          
          {/* Controlled Input Area */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search estate, area, landmark..."
            className="w-full bg-transparent text-[14px] text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-stone-500 outline-none pr-12 py-2"
          />
          
          {/* Right Action: Purely Visual Sliders Filter trigger */}
          <button
            type="button"
            onClick={onOpenFilters}
            aria-label="Open filters"
            className="absolute right-1.5 w-10 h-10 rounded-xl bg-neutral-900 dark:bg-emerald-600 hover:bg-neutral-850 dark:hover:bg-emerald-500 text-white flex items-center justify-center transition-colors shadow-sm outline-none border-none cursor-pointer"
          >
            <SlidersHorizontal className="w-4.5 h-4.5 stroke-[2.2]" />
          </button>
          
        </div>
      </form>
    </motion.div>
  );
}
