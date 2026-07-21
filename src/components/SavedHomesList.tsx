import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Listing } from '../types/listing';
import SavedListingCard from './SavedListingCard';

interface SavedHomesListProps {
  listings: Listing[];
  onUnsave?: (id: string) => void;
  isCompareMode?: boolean;
  selectedCompareIds?: string[];
  onToggleCompare?: (id: string) => void;
  onSelectListing?: (id: string) => void;
}

export default function SavedHomesList({ 
  listings, 
  onUnsave,
  isCompareMode = false,
  selectedCompareIds = [],
  onToggleCompare,
  onSelectListing
}: SavedHomesListProps) {
  // Stagger wrapper for layout entries
  const listContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <motion.div
      variants={listContainerVariants}
      initial="hidden"
      animate="show"
      className="w-full flex flex-col space-y-4 pb-16" // pb-16 prevents covers by the floating bottom nav
    >
      <AnimatePresence mode="popLayout">
        {listings.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-full"
          >
            <SavedListingCard 
              listing={item} 
              onUnsave={onUnsave} 
              isCompareMode={isCompareMode}
              isSelectedForCompare={selectedCompareIds.includes(item.id)}
              onToggleCompare={onToggleCompare}
              onSelectListing={onSelectListing}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
