import React from 'react';
import { motion } from 'motion/react';
import { Search, Trash2, ChevronRight } from 'lucide-react';
import { SavedSearch } from '../hooks/useSavedSearches';

interface SavedSearchesSectionProps {
  savedSearches: SavedSearch[];
  onApply: (search: SavedSearch) => void;
  onDelete: (id: string) => void;
}

function filterSummary(search: SavedSearch): string {
  const parts: string[] = [];
  if (search.filters.houseTypes.length > 0) parts.push(`${search.filters.houseTypes.length} house type${search.filters.houseTypes.length > 1 ? 's' : ''}`);
  if (search.filters.minRent !== "" || search.filters.maxRent !== "") parts.push('rent range');
  if (search.filters.amenities.length > 0) parts.push(`${search.filters.amenities.length} amenit${search.filters.amenities.length > 1 ? 'ies' : 'y'}`);
  if (search.sort !== 'Most relevant') parts.push(`sorted by ${search.sort.toLowerCase()}`);
  return parts.length > 0 ? parts.join(' · ') : 'No extra filters';
}

/**
 * Hidden entirely when there are zero saved searches -- same "hide rather
 * than show an empty-looking section" rule used for Popular Locations.
 */
export default function SavedSearchesSection({ savedSearches, onApply, onDelete }: SavedSearchesSectionProps) {
  if (savedSearches.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full flex flex-col space-y-2.5"
    >
      <h2 className="text-xs font-black text-neutral-800 dark:text-neutral-50 uppercase tracking-wider px-1">
        Saved searches
      </h2>

      <div className="flex flex-col gap-2">
        {savedSearches.map((search) => (
          <div
            key={search.id}
            className="w-full bg-white/95 dark:bg-stone-900/90 border border-neutral-150/60 dark:border-stone-800/60 rounded-2xl p-3.5 flex items-center gap-3 shadow-3xs"
          >
            <button
              type="button"
              onClick={() => onApply(search)}
              className="flex-1 min-w-0 flex items-center gap-3 text-left cursor-pointer outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Search className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-neutral-800 dark:text-neutral-100 truncate">{search.label}</p>
                <p className="text-2xs font-semibold text-neutral-450 dark:text-stone-500 truncate mt-0.5">
                  {filterSummary(search)}
                </p>
              </div>
            </button>

            <ChevronRight className="w-4 h-4 text-neutral-350 dark:text-stone-600 shrink-0" />

            <button
              type="button"
              onClick={() => onDelete(search.id)}
              aria-label={`Delete saved search ${search.label}`}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 dark:text-stone-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors cursor-pointer outline-none shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
