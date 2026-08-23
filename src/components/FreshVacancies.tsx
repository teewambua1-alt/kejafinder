import { ChevronRight, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { Listing } from '../types/listing';
import { PropertyCardVertical, PropertyCardVerticalSkeleton } from './property';


interface FreshVacanciesProps {
  listings: Listing[];
  /** Used only to distinguish an empty database from an empty search result. */
  searchQuery?: string;
  onClearFilters: () => void;
  onSelectListing?: (id: string) => void;
  onSeeAll?: () => void;
  isLoading?: boolean;
}

export default function FreshVacancies({
  listings,
  searchQuery = '',
  onClearFilters,
  onSelectListing,
  onSeeAll,
  isLoading = false
}: FreshVacanciesProps) {
  const hasQuery = searchQuery.trim().length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
      className="w-full flex flex-col space-y-3.5 pt-1.5"
    >
      {/* 1. Header Action Row */}
      <div className="flex items-center justify-between px-0.5">
        <h2 id="fresh-vacancies-heading" className="font-display text-lg font-extrabold text-neutral-800 dark:text-neutral-100 tracking-tight">
          Recently added
        </h2>
        
        <button
          id="btn-see-all-vacancies"
          onClick={onSeeAll}
          className="flex items-center space-x-1 text-emerald-700 dark:text-emerald-400 text-xs font-bold hover:text-emerald-800 dark:hover:text-emerald-300 hover:underline transition-all cursor-pointer outline-none bg-transparent border-none"
        >
          <span>See all</span>
          <ChevronRight className="w-4 h-4 stroke-[2.2]" />
        </button>
      </div>

      {/* 2. Horizontal Scrolling Carousel List or Empty State */}
      {isLoading ? (
        <div
          role="list"
          aria-labelledby="fresh-vacancies-heading"
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 items-start"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <PropertyCardVerticalSkeleton key={i} className="w-full" />
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div
          role="list"
          aria-labelledby="fresh-vacancies-heading"
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 items-start"
        >
          {listings.map((listing, index) => (
            <motion.div
              key={listing.id}
              role="listitem"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 + index * 0.05 }}
            >
              <PropertyCardVertical listing={listing} onSelect={onSelectListing} className="w-full" />
            </motion.div>
          ))}
        </div>
      ) : (
        /* Two distinct states. This used to be one: with an empty database and
           no search active, it still said "No vacancies found -- try another
           estate, area, landmark, or house type" and offered a Clear search
           button, which blamed the user for a search they had not run. */
        <motion.div
          role="status"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full rounded-2xl bg-white/65 dark:bg-stone-850/60 border border-neutral-100 dark:border-neutral-800/80 p-8 flex flex-col items-center justify-center text-center gap-3 shadow-3xs"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
            <Search className="w-5.5 h-5.5 stroke-[2.2]" aria-hidden="true" />
          </div>

          {hasQuery ? (
            <>
              <div className="space-y-1">
                <h3 className="font-display text-sm font-extrabold text-neutral-800 dark:text-neutral-100">
                  Nothing matched &ldquo;{searchQuery.trim()}&rdquo;
                </h3>
                <p className="text-[11px] text-neutral-550 dark:text-neutral-400 max-w-[240px] leading-normal font-medium">
                  Try a nearby estate or a landmark instead.
                </p>
              </div>
              <button
                type="button"
                onClick={onClearFilters}
                className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 dark:hover:bg-emerald-800 transition-colors outline-none border-none cursor-pointer"
              >
                Clear search
              </button>
            </>
          ) : (
            <div className="space-y-1">
              <h3 className="font-display text-sm font-extrabold text-neutral-800 dark:text-neutral-100">
                No homes listed yet
              </h3>
              <p className="text-[11px] text-neutral-550 dark:text-neutral-400 max-w-[250px] leading-normal font-medium">
                New vacancies appear here as landlords and caretakers post them.
              </p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
