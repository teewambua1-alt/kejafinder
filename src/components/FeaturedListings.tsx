import React, { useEffect } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'motion/react';
import { PropertyCardVertical, PropertyCardVerticalSkeleton } from './property';

import EmptyState from './ui/EmptyState';
import { useFeaturedListings } from '../hooks/useFeaturedListings';
import { useToast } from '../context/ToastContext';

interface FeaturedListingsProps {
  onSelectListing?: (id: string) => void;
}

/**
 * Real data-driven replacement for the old FeaturedListing.tsx, which
 * rendered a single fully hardcoded mock card regardless of database state
 * (flagged during Phase 2 testing -- clicking it produced a real console
 * error since its fake id didn't exist). Sources from listings.is_featured,
 * set only by an admin via admin_moderate_listing()'s 'feature' action --
 * genuinely empty on a fresh database until that happens, which the empty
 * state below says honestly rather than hiding.
 */
export default function FeaturedListings({ onSelectListing }: FeaturedListingsProps) {
  const { listings, isLoading, error } = useFeaturedListings();
  const { showToast } = useToast();

  useEffect(() => {
    if (error) {
      showToast(error);
    }
  }, [error, showToast]);

  if (!isLoading && listings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
        className="w-full flex flex-col space-y-3.5"
      >
        <div className="flex items-center space-x-2 px-0.5">
          <Star className="w-4 h-4 text-orange-700 dark:text-orange-400 stroke-[2.2]" />
          <h2 className="font-display text-lg font-extrabold text-neutral-800 dark:text-neutral-100 tracking-tight">
            Featured listings
          </h2>
        </div>
        <EmptyState
          icon={Star}
          title="No featured homes yet"
          description="Verified, trusted listings will show up here once our team features them."
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
      className="w-full flex flex-col space-y-3.5"
    >
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center space-x-2">
          <Star className="w-4 h-4 text-orange-700 dark:text-orange-400 stroke-[2.2]" />
          <h2 id="featured-listings-heading" className="font-display text-lg font-extrabold text-neutral-800 dark:text-neutral-100 tracking-tight">
            Featured listings
          </h2>
        </div>
      </div>

      {isLoading ? (
        <div
          role="list"
          aria-labelledby="featured-listings-heading"
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 items-start"
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <PropertyCardVerticalSkeleton key={i} className="w-full" />
          ))}
        </div>
      ) : (
        <div
          role="list"
          aria-labelledby="featured-listings-heading"
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
      )}
    </motion.div>
  );
}
