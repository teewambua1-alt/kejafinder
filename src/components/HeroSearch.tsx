import React, { useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useMotion } from '../lib/motion';

interface HeroSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: (query: string) => void;
}

/**
 * The one thing the home screen asks you to do.
 *
 * Typing narrows the listings below immediately, so a search costs nothing and
 * needs no commitment; submitting hands off to full Search. There is exactly
 * one control here besides the field itself, and it only appears once there is
 * something to act on.
 */
export default function HeroSearch({ searchQuery, onSearchChange, onSearchSubmit }: HeroSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const m = useMotion();
  const hasQuery = searchQuery.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit?.(searchQuery);
  };

  const handleClear = () => {
    onSearchChange('');
    inputRef.current?.focus();
  };

  return (
    <motion.section
      initial={m.reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: m.duration.base }}
      className="w-full flex flex-col gap-4"
      aria-labelledby="hero-heading"
    >
      <div className="flex flex-col gap-2">
        <h1
          id="hero-heading"
          className="font-display text-[25px] xs:text-[28px] sm:text-4xl font-extrabold tracking-[-0.02em] leading-[1.12] text-neutral-850 dark:text-stone-50 text-balance"
        >
          Find a vacant house{' '}
          <span className="text-emerald-700 dark:text-emerald-500">near you</span>
        </h1>
        <p className="text-xs font-medium text-neutral-550 dark:text-stone-400">
          Search by estate, area, or landmark.
        </p>
      </div>

      <form onSubmit={handleSubmit} role="search" className="w-full">
        <div className="relative flex items-center h-14 rounded-2.5xl bg-white dark:bg-stone-900 border border-neutral-150 dark:border-stone-800 shadow-sm focus-within:border-emerald-500/60 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-[border-color,box-shadow] duration-200">
          <Search
            className="absolute left-5 w-5 h-5 text-neutral-550 dark:text-stone-400 stroke-[2.2] pointer-events-none"
            aria-hidden="true"
          />

          <input
            ref={inputRef}
            type="search"
            name="q"
            enterKeyHint="search"
            autoComplete="off"
            spellCheck={false}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Kilimani, Rongai, Syokimau…"
            aria-label="Search homes by estate, area, or landmark"
            className={`w-full h-full bg-transparent pl-14 text-base font-medium text-neutral-850 dark:text-stone-100 placeholder-neutral-550 dark:placeholder-stone-600 outline-none [&::-webkit-search-cancel-button]:hidden ${hasQuery ? 'pr-28' : 'pr-5'}`}
          />

          {/* Both controls are query-dependent: an empty field shows none. */}
          {hasQuery && (
            <div className="absolute right-2.5 flex items-center gap-1">
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search"
                className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-550 hover:text-neutral-700 dark:text-stone-400 dark:hover:text-stone-300 transition-colors cursor-pointer outline-none"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
              <motion.button
                type="submit"
                whileTap={m.tap}
                aria-label={`See all results for ${searchQuery}`}
                className="w-11 h-11 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center shadow-sm transition-colors cursor-pointer outline-none border-none"
              >
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </motion.button>
            </div>
          )}
        </div>
      </form>
    </motion.section>
  );
}
