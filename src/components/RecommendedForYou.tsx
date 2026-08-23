import React, { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Listing } from '../types/listing';
import { PropertyCardVertical, PropertyCardVerticalSkeleton } from './property';

import { useSavedListings } from '../hooks/useSavedListings';

interface RecommendedForYouProps {
  allListings: Listing[];
  searchQuery: string;
  onSelectListing?: (id: string) => void;
  isLoading?: boolean;
}

export default function RecommendedForYou({ 
  allListings,
  searchQuery,
  onSelectListing,
  isLoading = false
}: RecommendedForYouProps) {
  const { savedListings } = useSavedListings();

  const recommendedListings = useMemo(() => {
    // Collect attributes from saved listings to find similarities
    const savedTypes = new Set(savedListings.map(l => l.type));
    const savedLocations = new Set(savedListings.map(l => l.location.toLowerCase()));
    const savedEstates = new Set(savedListings.map(l => l.estate.toLowerCase()));

    // Also consider search query
    const sq = searchQuery.toLowerCase().trim();

    return allListings.filter(listing => {
      // Don't recommend already saved listings
      if (savedListings.some(sl => sl.id === listing.id)) return false;

      // Don't recommend unavailable listings
      if (listing.isAvailable === false) return false;

      let score = 0;
      if (savedTypes.has(listing.type)) score += 1;
      if (savedLocations.has(listing.location.toLowerCase())) score += 2;
      if (savedEstates.has(listing.estate.toLowerCase())) score += 2;
      
      if (sq && (
        listing.title.toLowerCase().includes(sq) ||
        listing.location.toLowerCase().includes(sq) ||
        listing.estate.toLowerCase().includes(sq)
      )) {
        score += 3; // High weight for matching active search
      }

      return score > 0;
    }).sort((a, b) => {
        // Calculate score for sorting
        let scoreA = 0;
        let scoreB = 0;
        if (savedTypes.has(a.type)) scoreA += 1;
        if (savedLocations.has(a.location.toLowerCase())) scoreA += 2;
        if (savedEstates.has(a.estate.toLowerCase())) scoreA += 2;
        if (sq && (a.title.toLowerCase().includes(sq) || a.location.toLowerCase().includes(sq) || a.estate.toLowerCase().includes(sq))) scoreA += 3;
        
        if (savedTypes.has(b.type)) scoreB += 1;
        if (savedLocations.has(b.location.toLowerCase())) scoreB += 2;
        if (savedEstates.has(b.estate.toLowerCase())) scoreB += 2;
        if (sq && (b.title.toLowerCase().includes(sq) || b.location.toLowerCase().includes(sq) || b.estate.toLowerCase().includes(sq))) scoreB += 3;
        
        return scoreB - scoreA;
    });
  }, [allListings, savedListings, searchQuery]);

  // Don't show if no recommendations and not loading
  if (!isLoading && recommendedListings.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
      className="w-full flex flex-col space-y-3.5 pt-4 pb-2"
    >
      <div className="flex items-center space-x-2 px-0.5">
        <Sparkles className="w-5 h-5 text-orange-700 dark:text-orange-400" />
        <h2 className="font-display text-lg font-extrabold text-neutral-800 dark:text-neutral-100 tracking-tight">
          Recommended for you
        </h2>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 items-start">
          {Array.from({ length: 4 }).map((_, i) => (
            <PropertyCardVerticalSkeleton key={i} className="w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 items-start">
          {recommendedListings.slice(0, 6).map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 + index * 0.05 }}
              className="min-w-0"
            >
              <PropertyCardVertical
                listing={listing}
                onSelect={() => onSelectListing?.(listing.id)}
                className="w-full"
              />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
