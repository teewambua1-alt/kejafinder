import React, { useEffect, useRef, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion } from 'motion/react';
import Input from './ui/Input';
import { useMotion } from '../lib/motion';

interface SearchTopBarProps {
  /** The committed query. This component keeps its own draft while typing. */
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onOpenFilters?: () => void;
  /** Shown on the Filters button so the user can see filters are on. */
  activeFilterCount?: number;
}

/** Long enough that a fast typist isn't re-filtering per keystroke, short
 *  enough that results feel live. */
const DEBOUNCE_MS = 250;

/**
 * Search + Filters. Two controls, where there used to be twelve across three
 * rows (this bar, four SearchFilterChips, seven SearchHouseTypeChips) -- and
 * the house-type row was single-select against the sheet's multi-select, so
 * picking three types in the sheet made the row read "All types".
 *
 * Fixes carried over from the old version: the submit handler only called
 * preventDefault, so Enter did nothing; there was no clear button; the input
 * had no label of any kind; and the Filters trigger was
 * `bg-neutral-900 dark:bg-emerald-600` -- black in light mode and emerald in
 * dark, which inverted the app's primary-action colour with the theme.
 */
export default function SearchTopBar({
  searchQuery, onSearchChange, onOpenFilters, activeFilterCount = 0,
}: SearchTopBarProps) {
  const m = useMotion();
  const [draft, setDraft] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  // Skips the debounce for clear/submit, which should be instant.
  const skipDebounce = useRef(false);

  // Keep in step when the query is changed from outside (e.g. Clear search in
  // the empty state), without fighting the user mid-word.
  useEffect(() => {
    setDraft((current) => (current === searchQuery ? current : searchQuery));
  }, [searchQuery]);

  useEffect(() => {
    if (draft === searchQuery) return;
    if (skipDebounce.current) {
      skipDebounce.current = false;
      onSearchChange(draft);
      return;
    }
    const timer = setTimeout(() => onSearchChange(draft), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [draft, searchQuery, onSearchChange]);

  const commitNow = (value: string) => {
    skipDebounce.current = true;
    setDraft(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    commitNow(draft);
    // Dismisses the mobile keyboard so the results are actually visible.
    inputRef.current?.blur();
  };

  const handleClear = () => {
    commitNow('');
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} role="search" className="flex items-center gap-2.5">
      <div className="flex-1 min-w-0">
        <Input
          ref={inputRef}
          type="search"
          label="Search vacancies"
          hideLabel
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Estate, area or landmark"
          icon={Search}
          enterKeyHint="search"
          autoComplete="off"
          spellCheck={false}
          trailing={
            draft ? (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search"
                className="grid h-7 w-7 place-items-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-800 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
              >
                <X className="h-4 w-4 stroke-[2.4]" aria-hidden="true" />
              </button>
            ) : undefined
          }
        />
      </div>

      <motion.button
        type="button"
        whileTap={m.tap}
        onClick={onOpenFilters}
        aria-label={activeFilterCount > 0 ? `Filters, ${activeFilterCount} active` : 'Filters'}
        className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-transparent bg-emerald-700 text-white shadow-sm shadow-emerald-500/15 transition-colors hover:bg-emerald-800 outline-none cursor-pointer"
      >
        <SlidersHorizontal className="h-4.5 w-4.5 stroke-[2.2]" aria-hidden="true" />
        {activeFilterCount > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full border-2 border-surface bg-orange-700 px-1 text-3xs font-black text-white dark:border-stone-900">
            {activeFilterCount}
          </span>
        )}
      </motion.button>
    </form>
  );
}
