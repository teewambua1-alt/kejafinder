import { motion } from 'motion/react';
import type { Listing } from '../types/listing';
import { SAVED_FILTERS, savedFilterCounts, type SavedFilterId } from '../lib/savedFilters';
import { useMotion } from '../lib/motion';
import { cn } from '../lib/cn';

interface SavedFilterChipsProps {
  activeFilter: SavedFilterId;
  onFilterChange: (id: SavedFilterId) => void;
  /** The set being filtered — needed to show real counts. */
  listings: Listing[];
}

/**
 * Four chips, each with a real count, each backed by a real predicate.
 * See lib/savedFilters for what this replaced and why.
 *
 * Chips that would match nothing are not rendered: a chip that leads only to an
 * empty list is a dead end, and hiding it is the honest form of a disabled
 * state here — there is nothing the user could do to make it match.
 */
export default function SavedFilterChips({ activeFilter, onFilterChange, listings }: SavedFilterChipsProps) {
  const m = useMotion();
  const counts = savedFilterCounts(listings);
  const visible = SAVED_FILTERS.filter((f) => f.id === 'all' || counts[f.id] > 0);

  // One real option is not a choice.
  if (visible.length < 2) return null;

  return (
    <div
      className="flex w-full flex-wrap gap-2"
      role="group"
      aria-label="Filter saved homes"
    >
      {visible.map((option) => {
        const isActive = activeFilter === option.id;
        const Icon = option.icon;
        return (
          <motion.button
            key={option.id}
            type="button"
            whileTap={m.tap}
            onClick={() => onFilterChange(option.id)}
            aria-pressed={isActive}
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-3.5 h-9 text-2xs font-bold whitespace-nowrap transition-[background-color,border-color,color] cursor-pointer outline-none',
              isActive
                ? 'bg-emerald-700 border-emerald-700 text-white'
                : 'bg-white dark:bg-stone-900 border-neutral-150 dark:border-stone-800 text-neutral-700 dark:text-stone-300 hover:border-neutral-300 dark:hover:border-stone-700'
            )}
          >
            <Icon
              className={cn('h-3.5 w-3.5 shrink-0 stroke-[2.2]', isActive ? 'text-white' : 'text-emerald-700 dark:text-emerald-400')}
              aria-hidden="true"
            />
            <span>{option.label}</span>
            <span className={cn('font-black tabular-nums', isActive ? 'text-white/80' : 'text-neutral-500 dark:text-stone-400')}>
              {counts[option.id]}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
