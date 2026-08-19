import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MapPin, Check, Plus, Landmark, BedDouble } from 'lucide-react';
import { Listing } from '../types/listing';
import { initialSavedSuggestions } from '../data/savedSuggestions';

interface SavedSuggestionsProps {
  onSaveSuggestion: (listing: Listing) => void;
  // Let's pass the IDs of currently saved listings to know if one of them is already saved
  savedIds: string[];
}

export default function SavedSuggestions({ onSaveSuggestion, savedIds }: SavedSuggestionsProps) {
  // Local state to track which items are saved or have been tapped
  const [suggestions, setSuggestions] = useState<Listing[]>(initialSavedSuggestions);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSave = (item: Listing) => {
    onSaveSuggestion(item);
    
    // Show a small inline success message
    setSuccessMessage(`Saved "${item.title}" to your homes.`);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const formatCurrency = (val: number) => `KSh ${val.toLocaleString()}`;

  return (
    <div className="w-full flex flex-col space-y-3.5 pt-3">
      {/* Title block */}
      <div className="px-1">
        <h2 className="text-base font-black text-neutral-800 dark:text-neutral-50 tracking-tight font-sans">
          Suggested homes
        </h2>
        <p className="text-[11px] font-medium text-neutral-500 dark:text-stone-400">
          Similar affordable homes you may want to save.
        </p>
      </div>

      {/* Success Notification Alert */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mx-1 px-3.5 py-2.5 bg-emerald-500/10 dark:bg-emerald-950/35 border border-emerald-500/30 rounded-xl flex items-center space-x-2 text-emerald-800 dark:text-emerald-400 text-[11px] font-bold"
          >
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
            <span>{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Horizontal horizontal Scroll Grid on Mobile */}
      <div className="w-full overflow-x-auto no-scrollbar pb-2 -mb-2 flex items-stretch space-x-3.5 scroll-smooth select-none px-1">
        {suggestions.map((item) => {
          const isAlreadySaved = savedIds.includes(item.id);

          return (
            <motion.div
              key={item.id}
              whileTap={{ scale: 0.99 }}
              className="w-[240px] xs:w-[260px] flex-shrink-0 bg-white/95 dark:bg-stone-900/90 border border-neutral-100 dark:border-neutral-800 rounded-2.5xl p-3 shadow-3xs hover:shadow-2xs transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                {/* Compact Thumbnail Container */}
                <div className="relative w-full h-28 rounded-xl overflow-hidden bg-neutral-100 dark:bg-stone-950">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />

                  {/* House type overlay tag */}
                  <span className="absolute bottom-2 left-2 text-[8px] font-black tracking-wider uppercase bg-black/65 backdrop-blur-xs text-white px-1.5 py-0.5 rounded-md">
                    {item.type === 'one_bedroom' ? '1 Bedroom' : item.type === 'bedsitter' ? 'Bedsitter' : 'Studio'}
                  </span>

                  {/* Compact Floating Heart overlay target */}
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => !isAlreadySaved && handleSave(item)}
                    disabled={isAlreadySaved}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 dark:bg-stone-850/95 flex items-center justify-center shadow-3xs cursor-pointer disabled:cursor-default"
                    aria-label={`Save ${item.title}`}
                  >
                    <Heart 
                      className={`w-3.5 h-3.5 ${
                        isAlreadySaved 
                          ? 'fill-emerald-600 text-emerald-600 dark:fill-emerald-400 dark:text-emerald-400' 
                          : 'text-neutral-500 hover:text-rose-500'
                      }`} 
                    />
                  </motion.button>
                </div>

                {/* Listing metadata elements */}
                <div className="space-y-1">
                  <h3 className="text-xs font-extrabold text-neutral-800 dark:text-stone-200 tracking-tight truncate leading-snug">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center space-x-1 text-[10.5px] font-semibold text-neutral-550 dark:text-neutral-400">
                    <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>

                {/* Rental and Trust Labels */}
                <div className="flex items-baseline justify-between space-x-1 border-t border-dashed border-neutral-100 dark:border-stone-800/80 pt-2">
                  <div className="flex items-baseline space-x-0.5">
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(item.rent)}
                    </span>
                    <span className="text-[8.5px] text-neutral-400 font-bold">/mo</span>
                  </div>

                  {item.badges && item.badges[0] && (
                    <span className="inline-flex items-center gap-0.5 text-[8.5px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/20 px-1 py-0.5 rounded border border-emerald-500/10">
                      <Check className="w-2.5 h-2.5 stroke-[3] shrink-0" aria-hidden="true" />
                      {item.badges[0]}
                    </span>
                  )}
                </div>
              </div>

              {/* View/Save bottom action row */}
              <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-stone-800/60 flex items-center justify-end">
                {isAlreadySaved ? (
                  <div className="text-[9.5px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-950/30 px-3.5 py-1.5 rounded-lg flex items-center space-x-1 select-none">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Saved</span>
                  </div>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleSave(item)}
                    className="flex items-center space-x-1 h-7.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[9.5px] font-extrabold rounded-lg shadow-3xs cursor-pointer transition-colors"
                  >
                    <Plus className="w-3 h-3 stroke-[3]" />
                    <span>Save Home</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
