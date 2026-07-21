import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MapPin, AlertCircle, ChevronRight, Star } from 'lucide-react';
import { interactedListings } from '../data/profileData';

export default function ProfileInteractedListings() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>({
    'int-001': true,
    'int-002': false,
  });

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const toggleSave = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isSaved = !savedStatus[id];
    setSavedStatus(prev => ({ ...prev, [id]: isSaved }));
    showToast(isSaved ? `Saved "${name}" successfully!` : `Removed "${name}" from saved list.`);
  };

  return (
    <div className="w-full space-y-3.5" id="profile-interacted-listings-section">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-black text-neutral-800 dark:text-stone-255 uppercase tracking-wider">
          Recent listings you interacted with
        </h3>
        <button 
          onClick={() => showToast('Full activity history coming soon!')}
          className="flex items-center space-x-0.5 text-[10.5px] font-black text-emerald-600 dark:text-emerald-450 uppercase tracking-tight hover:text-emerald-700 hover:underline transition-colors cursor-pointer outline-none bg-transparent border-none"
          aria-label="See all interacted listings"
        >
          <span>See all</span>
          <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
        </button>
      </div>

      {/* Grid containing the compact horizontal-styled listing cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {interactedListings.map((listing) => {
          const isSaved = savedStatus[listing.id];

          return (
            <motion.div
              key={listing.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => showToast(`Listing details for "${listing.title}" is coming soon.`)}
              className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-800/40 rounded-2.5xl overflow-hidden shadow-3xs hover:shadow-2xs transition-all flex items-stretch h-[115px] cursor-pointer"
            >
              {/* Product Image Cover thumbnail */}
              <div className="w-1/3 relative shrink-0 overflow-hidden bg-neutral-100 dark:bg-stone-850">
                <img 
                  src={listing.imageUrl} 
                  alt={listing.title} 
                  className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Featured Badge flag overlay */}
                {listing.isFeatured && (
                  <span className="absolute top-2 left-2 text-[7.5px] font-black bg-orange-500 text-white uppercase tracking-wider px-1.5 py-0.5 rounded-md flex items-center space-x-0.5 shadow-sm">
                    <Star className="w-2 h-2 fill-white stroke-[2]" />
                    <span>Featured</span>
                  </span>
                )}
              </div>

              {/* Text Description Box Panel right */}
              <div className="p-3 flex-1 flex flex-col justify-between min-w-0 relative">
                {/* Save Heart Button Floating inside card */}
                <button
                  type="button"
                  onClick={(e) => toggleSave(listing.id, listing.title, e)}
                  className="absolute top-2.5 right-2.5 w-6.5 h-6.5 rounded-full bg-white/90 dark:bg-stone-800/90 border border-neutral-200/40 dark:border-stone-800 flex items-center justify-center shadow-3xs cursor-pointer select-none text-neutral-450 hover:text-rose-500 active:scale-90 transition-all outline-none"
                  aria-label={isSaved ? "Remove from saved homes" : "Add to saved homes"}
                >
                  <Heart 
                    className={`w-3.5 h-3.5 transition-colors ${
                      isSaved ? 'text-rose-500 fill-rose-500 stroke-[2.2]' : 'text-neutral-500 dark:text-stone-400 stroke-[2.2]'
                    }`} 
                  />
                </button>

                {/* Title & Location details */}
                <div className="space-y-0.5 pr-6">
                  <h4 className="text-[12.5px] font-black text-neutral-850 dark:text-stone-100 uppercase tracking-tight leading-none truncate">
                    {listing.title}
                  </h4>
                  
                  {/* Rent Tag */}
                  <div className="text-[11.5px] font-black text-emerald-600 dark:text-emerald-450 flex items-baseline">
                    <span>{listing.rent}</span>
                    <span className="text-[8.5px] font-semibold text-neutral-400 dark:text-stone-500 ml-0.5">/month</span>
                  </div>

                  <div className="flex items-center space-x-1 text-neutral-450 dark:text-stone-500 max-w-full">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="text-[10px] font-semibold truncate">
                      {listing.location}
                    </span>
                  </div>
                </div>

                {/* Viewed/Contacted Status badge line */}
                <div className="pt-1 flex items-center">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-stone-800 text-[8.5px] font-extrabold text-neutral-500 dark:text-stone-400 uppercase tracking-wide">
                    {listing.statusBadge}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating feedback alert toast info */}
      <AnimatePresence>
        {toastMessage && (
          <div className="fixed inset-x-0 bottom-24 z-50 flex items-center justify-center pointer-events-none px-4">
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              className="bg-neutral-900 border border-neutral-800 text-white font-extrabold text-[10.5px] uppercase tracking-wider px-4 py-2 rounded-xl shadow-lg flex items-center space-x-2 pointer-events-auto"
            >
              <AlertCircle className="w-4 h-4 text-emerald-450 shrink-0" />
              <span>{toastMessage}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
