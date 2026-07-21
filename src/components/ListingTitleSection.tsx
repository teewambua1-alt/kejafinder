import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Clock, ShieldCheck, Home } from 'lucide-react';
import { KejaListing } from '../types/listings';

interface ListingTitleSectionProps {
  listing: KejaListing;
}

export default function ListingTitleSection({ listing }: ListingTitleSectionProps) {
  // Extract specific amenities to display in the quick strip, if they exist
  // Or just display the first 3 or 4 amenities if present.
  const topAmenities = listing.amenities?.slice(0, 3) || [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/95 dark:bg-stone-900/95 border border-neutral-150/60 dark:border-stone-800/60 rounded-3xl p-5 shadow-sm space-y-4"
    >
      {/* 1. Top Pills and Title */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="bg-neutral-100 dark:bg-stone-800 text-neutral-700 dark:text-stone-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
            {listing.typeLabel || listing.houseType}
          </span>
          <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
            {listing.availabilityText || 'Available'}
          </span>
          {listing.listingCode && (
            <span className="bg-neutral-50 dark:bg-stone-850 border border-neutral-200 dark:border-stone-800 text-neutral-400 dark:text-stone-500 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ml-auto font-mono">
              {listing.listingCode}
            </span>
          )}
        </div>
        <h2 className="text-2xl font-black text-neutral-850 dark:text-stone-50 leading-tight tracking-tight">
          {listing.title}
        </h2>
      </div>

      {/* 2. Metadata Rows */}
      <div className="space-y-2">
        <div className="flex items-start justify-start gap-2 text-sm text-neutral-600 dark:text-stone-350">
          <MapPin className="w-4.5 h-4.5 text-neutral-400 shrink-0 mt-0.5" />
          <span className="font-medium leading-snug">
            {listing.location}{listing.estate ? `, ${listing.estate}` : ''}
          </span>
        </div>
        {listing.landmark && (
          <div className="flex items-start justify-start gap-2 text-sm text-neutral-600 dark:text-stone-350">
            <Navigation className="w-4.5 h-4.5 text-neutral-400 shrink-0 mt-0.5" />
            <span className="font-medium leading-snug">
              Near {listing.landmark}
            </span>
          </div>
        )}
        <div className="flex items-start justify-start gap-2 text-sm text-neutral-500 dark:text-stone-450">
          <Clock className="w-4.5 h-4.5 text-neutral-400 shrink-0 mt-0.5" />
          <span className="font-semibold text-xs mt-0.5 tracking-tight uppercase">
            {listing.updatedAtText || 'Updated recently'}
          </span>
        </div>
      </div>

      {/* 3. Trust Badges Row */}
      {listing.trustBadges && listing.trustBadges.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1 border-t border-neutral-100 dark:border-stone-800">
          {listing.trustBadges.map((badge, idx) => {
            const isUpdated = badge.includes('Updated');
            return (
              <div 
                key={idx}
                className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${
                  isUpdated 
                    ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200/50 dark:border-orange-900/30 text-orange-600 dark:text-orange-400'
                    : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{badge}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Quick Summary Strip */}
      <div className="bg-neutral-50 dark:bg-stone-850 rounded-2xl p-3 border border-neutral-150/50 dark:border-stone-800/50 mt-4 flex items-center justify-between overflow-x-auto scrollbar-none gap-4">
        <div className="flex flex-col flex-shrink-0 items-start">
          <span className="text-[9px] uppercase tracking-wider font-bold text-neutral-400 dark:text-stone-500 mb-0.5">Type</span>
          <span className="text-xs font-black text-neutral-800 dark:text-stone-200 flex items-center space-x-1">
            <Home className="w-3.5 h-3.5 text-emerald-500" />
            <span>{listing.houseType}</span>
          </span>
        </div>
        {topAmenities.map((amenity, idx) => (
          <div key={idx} className="flex flex-col flex-shrink-0 items-start border-l border-neutral-200 dark:border-stone-700 pl-4">
            <span className="text-[9px] uppercase tracking-wider font-bold text-neutral-400 dark:text-stone-500 mb-0.5">Feature</span>
            <span className="text-xs font-black text-neutral-800 dark:text-stone-200">
              {amenity}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
