import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Calendar } from 'lucide-react';
import { Listing } from '../types/listing';
import { PropertyCardVertical } from './property';
import { formatSavedOn } from '../lib/relativeDate';

interface SavedHomesListProps {
  listings: Listing[];
  onUnsave: (id: string) => void;
  isCompareMode?: boolean;
  selectedCompareIds: string[];
  onToggleCompare?: (id: string) => void;
  onSelectListing?: (id: string) => void;
}

export default function SavedHomesList({
  listings,
  onUnsave,
  isCompareMode = false,
  selectedCompareIds,
  onToggleCompare,
  onSelectListing,
}: SavedHomesListProps) {
  return (
    // Grid, matching Search -- listings use one layout everywhere now.
    <motion.div layout className="w-full grid grid-cols-2 gap-3 sm:grid-cols-3 items-start">
      <AnimatePresence mode="popLayout">
        {listings.map((item) => {
          const isSelected = selectedCompareIds.includes(item.id);
          const savedOn = formatSavedOn(item.savedAt);

          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="min-w-0"
            >
              <PropertyCardVertical
                listing={item}
                onUnsave={onUnsave}
                // In compare mode the whole card toggles selection instead of
                // opening the listing -- same behaviour the old card had.
                onSelect={
                  isCompareMode && onToggleCompare
                    ? () => onToggleCompare(item.id)
                    : onSelectListing
                }
                photoOverlay={
                  isCompareMode ? (
                    <span
                      className={`absolute top-2.5 left-2.5 z-10 w-6 h-6 rounded-full flex items-center justify-center border-2 shadow-sm transition-colors ${
                        isSelected
                          ? 'bg-emerald-700 border-emerald-700 text-white'
                          : 'bg-white/90 border-neutral-300 text-transparent dark:bg-stone-850/90 dark:border-stone-600'
                      }`}
                      role="img"
                      aria-label={isSelected ? 'Selected for comparison' : 'Not selected for comparison'}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" aria-hidden="true" />}
                    </span>
                  ) : undefined
                }
                meta={
                  savedOn ? (
                    <div className="flex items-center gap-1 text-2xs font-bold text-neutral-550 dark:text-stone-400">
                      <Calendar className="w-3.5 h-3.5 text-neutral-550 stroke-[2]" aria-hidden="true" />
                      {savedOn}
                    </div>
                  ) : undefined
                }
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
