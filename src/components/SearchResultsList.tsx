import React from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { Listing } from '../types/listing';
import SearchResultCard from './SearchResultCard';

interface SearchResultsListProps {
  listings: Listing[];
  onClearSearch?: () => void;
  onSelectListing?: (id: string) => void;
  viewMode?: 'list' | 'grid';
}

export default function SearchResultsList({ listings, onClearSearch, onSelectListing, viewMode = 'list' }: SearchResultsListProps) {
  // Stagger animation container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  if (listings.length === 0) {
    return (
      <motion.div
        role="status"
        aria-live="polite"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full bg-white/80 dark:bg-stone-900/85 rounded-3xl border border-neutral-100 dark:border-neutral-800/80 shadow-xs p-8 flex flex-col items-center justify-center text-center gap-4 py-12"
      >
        <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center border border-emerald-100/50 dark:border-emerald-900/55">
          <Search className="w-6 h-6 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
        </div>

        <div className="space-y-1.5 max-w-xs">
          <h3 className="font-extrabold text-[16px] text-[#111] dark:text-neutral-50 tracking-tight">
            No vacancies found
          </h3>
          <p className="text-[12px] text-neutral-500 dark:text-stone-400 font-semibold leading-relaxed">
            Try another estate, area, landmark, or house type.
          </p>
        </div>

        {onClearSearch && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={onClearSearch}
            className="mt-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-[12px] font-extrabold shadow-sm transition-colors border-none cursor-pointer outline-none"
          >
            Clear search
          </motion.button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={`w-full pb-28 md:pb-4 ${
        viewMode === 'grid'
          ? 'grid grid-cols-2 md:grid-cols-3 gap-3'
          : 'flex flex-col gap-4'
      }`} // Safe bottom margin/padding to prevent bottom navigation overlaps on mobile screens (not needed at md+, no bottom nav there)
    >
      {listings.map((listing) => (
        <SearchResultCard key={listing.id} listing={listing} onSelectListing={onSelectListing} viewMode={viewMode} />
      ))}
    </motion.div>
  );
}
