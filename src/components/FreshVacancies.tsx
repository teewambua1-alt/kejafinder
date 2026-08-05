import { ChevronRight, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { Listing } from '../types/listing';
import ListingCard from './ListingCard';
import ListingCardSkeleton from './ListingCardSkeleton';

interface FreshVacanciesProps {
  listings: Listing[];
  searchQuery: string;
  selectedCategory: string;
  onClearFilters: () => void;
  onSelectListing?: (id: string) => void;
  isLoading?: boolean;
}

export default function FreshVacancies({ 
  listings, 
  searchQuery, 
  selectedCategory, 
  onClearFilters,
  onSelectListing,
  isLoading = false
}: FreshVacanciesProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.35 }}
      className="w-full flex flex-col space-y-3.5 pt-1.5"
    >
      {/* 1. Header Action Row */}
      <div className="flex items-center justify-between px-0.5">
        <h2 className="font-display text-lg font-extrabold text-neutral-800 dark:text-neutral-100 tracking-tight">
          Recently added
        </h2>
        
        <button 
          id="btn-see-all-vacancies"
          className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline transition-all cursor-pointer outline-none bg-transparent border-none"
        >
          <span>See all</span>
          <ChevronRight className="w-4 h-4 stroke-[2.2]" />
        </button>
      </div>

      {/* 2. Horizontal Scrolling Carousel List or Empty State */}
      {isLoading ? (
        <div className="-mx-6 px-6 flex items-start space-x-4 overflow-x-auto no-scrollbar py-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="-mx-6 px-6 flex items-start space-x-4 overflow-x-auto no-scrollbar py-2.5">
          {listings.map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 + index * 0.05 }}
            >
              <ListingCard listing={listing} onSelectListing={onSelectListing} />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full rounded-2xl bg-white/65 dark:bg-stone-850/60 border border-neutral-100 dark:border-neutral-800/80 p-6 flex flex-col items-center justify-center text-center space-y-3 shadow-3xs"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Search className="w-5.5 h-5.5 stroke-[2.2]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-sm font-extrabold text-neutral-800 dark:text-neutral-100">
              No vacancies found
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 max-w-[240px] leading-normal font-medium">
              Try another estate, area, landmark, or house type.
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClearFilters}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors shadow-2xs outline-none border-none cursor-pointer"
          >
            Clear search
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
