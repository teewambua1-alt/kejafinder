import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { KejaListing } from '../types/listings';
import SimilarHomeCard from './SimilarHomeCard';

interface SimilarHomesSectionProps {
  currentListing: KejaListing;
  allListings: KejaListing[];
  onOpenListingDetails: (id: string) => void;
  onNavigateSearch?: () => void;
  setListingFeedback?: (message: string) => void;
}

export default function SimilarHomesSection({ 
  currentListing, 
  allListings, 
  onOpenListingDetails,
  onNavigateSearch,
  setListingFeedback
}: SimilarHomesSectionProps) {

  // Simple local similarity logic
  const similarHomes = useMemo(() => {
    return allListings
      .filter((listing) => listing.id !== currentListing.id)
      .map((listing) => {
        let score = 0;
        
        // Location Match (+3)
        if (listing.location === currentListing.location) score += 3;
        
        // House Type Match (+2)
        if (listing.houseType === currentListing.houseType) score += 2;
        
        // Rent diff within 5000 (+1)
        if (listing.rent && currentListing.rent) {
          if (Math.abs(listing.rent - currentListing.rent) <= 5000) score += 1;
        }

        // Trust badges (+1)
        if (listing.trustBadges?.includes('Location Checked') || listing.trustBadges?.includes('Scout Verified')) {
          score += 1;
        }

        return { listing, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5) // Limit visible similar homes to 5
      .map(item => item.listing);
  }, [allListings, currentListing]);

  const handleSeeMore = () => {
    if (onNavigateSearch) {
      onNavigateSearch();
    } else if (setListingFeedback) {
      setListingFeedback("More similar homes coming soon.");
    }
  };

  const handleSave = (id: string, isSaved: boolean) => {
    if (setListingFeedback) {
      setListingFeedback(isSaved ? "Listing removed from saved." : "Listing saved locally.");
    }
    // Note: since this is local dummy data and we don't have a global state editor passed here
    // for save toggling, we just show feedback for prototype purposes.
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.1 }}
      className="space-y-4"
    >
      {/* Header */}
      <motion.div variants={rowVariants} className="px-1 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-neutral-850 dark:text-stone-50 flex items-center gap-2">
            Similar homes
          </h3>
          <p className="text-xs font-semibold text-neutral-500 dark:text-stone-400 mt-0.5">
            Other vacant homes you may want to check.
          </p>
        </div>
        <button 
          onClick={handleSeeMore}
          className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full"
        >
          See more
        </button>
      </motion.div>

      {similarHomes.length > 0 ? (
        <motion.div variants={rowVariants} className="flex overflow-x-auto gap-4 pb-4 -mx-1 px-1 snap-x scrollbar-hide">
          {similarHomes.map((listing) => (
            <div key={listing.id} className="snap-start pt-1">
              <SimilarHomeCard
                listing={listing}
                onView={() => onOpenListingDetails(listing.id)}
                onSave={handleSave}
              />
            </div>
          ))}
        </motion.div>
      ) : (
        <motion.div variants={rowVariants} className="bg-white/95 dark:bg-stone-900/95 border border-neutral-150/60 dark:border-stone-800/60 rounded-3xl p-6 shadow-sm text-center">
          <h4 className="text-sm font-black text-neutral-850 dark:text-stone-100 mb-1">
            No similar homes yet
          </h4>
          <p className="text-xs font-semibold text-neutral-500 dark:text-stone-400 mb-4">
            Try nearby areas or adjust your search filters.
          </p>
          <motion.button 
            whileTap={{ scale: 0.97 }}
            onClick={handleSeeMore}
            className="bg-neutral-900 dark:bg-stone-100 text-white dark:text-stone-900 px-6 py-3.5 rounded-2xl text-[12px] uppercase font-black tracking-wider shadow-sm"
          >
            Search nearby
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
