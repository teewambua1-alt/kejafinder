import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

interface SavedSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SavedSearchBar({ value, onChange }: SavedSearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative">
      <div className="relative flex items-center bg-white/95 dark:bg-stone-880/90 backdrop-blur-md rounded-2.5xl border border-neutral-100/90 dark:border-neutral-800/80 shadow-xs focus-within:border-emerald-500/50 focus-within:shadow-md transition-all p-1.5 pl-4">
        
        {/* Search Icon on the Left */}
        <Search className="w-5 h-5 text-neutral-550 dark:text-stone-400 shrink-0 mr-2.5 stroke-[2]" />
        
        {/* Controlled Search Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search your saved homes..."
          aria-label="Search saved homes"
          className="w-full bg-transparent text-[13.5px] text-neutral-800 dark:text-neutral-100 placeholder-neutral-550 dark:placeholder-stone-550 outline-none pr-12 py-2.5 font-medium font-sans"
        />

        {/* Filter Sliders Button on the Right */}
        <button
          type="button"
          id="btn-saved-filters"
          className="absolute right-2 p-2.5 rounded-xl bg-neutral-50 dark:bg-stone-800 text-neutral-500 dark:text-stone-400 hover:text-emerald-800 dark:hover:text-emerald-400 active:scale-95 transition-all outline-none cursor-pointer"
          aria-label="Open saved filters"
        >
          <SlidersHorizontal className="w-4.5 h-4.5 stroke-[2.2]" />
        </button>
      </div>
    </form>
  );
}
