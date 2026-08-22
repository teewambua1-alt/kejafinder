import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Heart, Share2, AlertTriangle } from 'lucide-react';

interface ListingDetailsHeaderProps {
  onBack: () => void;
  isInitialSaved?: boolean;
  onSaveToggle?: (isSaved: boolean) => void;
  onShare?: () => void;
  onReport?: () => void;
}

export default function ListingDetailsHeader({ onBack, isInitialSaved = false, onSaveToggle, onShare, onReport }: ListingDetailsHeaderProps) {
  const handleSaveToggle = () => {
    if (onSaveToggle) onSaveToggle(!isInitialSaved);
  };

  const handleShare = () => {
    if (onShare) onShare();
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full flex items-center justify-between py-3 mb-4 sticky top-0 z-[var(--z-nav)] bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-neutral-200/50 dark:border-stone-800/40 px-3 rounded-2xl shadow-3xs"
    >
      {/* Back Button */}
      <motion.button 
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="w-9 h-9 rounded-full bg-neutral-50 dark:bg-stone-850 border border-neutral-150/50 dark:border-stone-800/50 flex items-center justify-center text-neutral-600 dark:text-stone-300 hover:text-neutral-800 dark:hover:text-stone-100 transition-colors cursor-pointer outline-none"
        aria-label="Go back"
      >
        <ArrowLeft className="w-4.5 h-4.5 stroke-[2.2]" />
      </motion.button>

      {/* Title */}
      <div className="flex flex-col items-center">
        {/* Not a heading: the listing title below is this page's h1, and two
          * h1s gave AT users two competing page titles. This is a toolbar
          * label. */}
        <p className="text-sm font-black text-neutral-805 dark:text-stone-100 uppercase tracking-tight font-sans">
          Listing details
        </p>
      </div>

      {/* Action Buttons on the Right (Share, Report and Save) */}
      <div className="flex items-center space-x-2">
        {/* Report Button */}
        {onReport && (
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={onReport}
            className="w-9 h-9 rounded-full bg-neutral-50 dark:bg-stone-850 border border-neutral-150/50 dark:border-stone-800/50 flex items-center justify-center text-neutral-500 dark:text-stone-400 hover:text-orange-700 transition-colors cursor-pointer outline-none"
            aria-label="Report listing"
          >
            <AlertTriangle className="w-4 h-4 stroke-[2]" />
          </motion.button>
        )}

        {/* Share Button */}
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="w-9 h-9 rounded-full bg-neutral-50 dark:bg-stone-850 border border-neutral-150/50 dark:border-stone-800/50 flex items-center justify-center text-neutral-500 dark:text-stone-400 hover:text-neutral-800 dark:hover:text-stone-100 transition-colors cursor-pointer outline-none"
          aria-label="Share listing"
        >
          <Share2 className="w-4 h-4 stroke-[2]" />
        </motion.button>

        {/* Save/Wishlist Button */}
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={handleSaveToggle}
          className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer outline-none ${
            isInitialSaved 
              ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/45 text-emerald-700 dark:text-emerald-400 shadow-sm' 
              : 'bg-neutral-50 dark:bg-stone-850 border-neutral-150/50 dark:border-stone-800/50 text-neutral-550 dark:text-stone-400 hover:text-emerald-800 dark:hover:text-emerald-400'
          }`}
          aria-label="Save listing"
        >
          <motion.div
            animate={isInitialSaved ? { scale: [1, 1.25, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Heart className={`w-4 h-4 stroke-[2.2] ${isInitialSaved ? 'fill-emerald-600 dark:fill-emerald-400' : ''}`} />
          </motion.div>
        </motion.button>
      </div>
    </motion.header>
  );
}
