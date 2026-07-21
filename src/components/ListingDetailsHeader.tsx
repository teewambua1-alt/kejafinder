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
      className="w-full flex items-center justify-between py-3 mb-4 sticky top-0 z-30 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-neutral-200/50 dark:border-stone-800/40 px-3 rounded-2xl shadow-3xs"
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
        <h1 className="text-sm font-black text-neutral-805 dark:text-stone-100 uppercase tracking-tight font-sans">
          Listing details
        </h1>
        <span className="text-[8px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest leading-none mt-0.5">
          Prototype Mode
        </span>
      </div>

      {/* Action Buttons on the Right (Share, Report and Save) */}
      <div className="flex items-center space-x-2">
        {/* Report Button */}
        {onReport && (
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={onReport}
            className="w-9 h-9 rounded-full bg-neutral-50 dark:bg-stone-850 border border-neutral-150/50 dark:border-stone-800/50 flex items-center justify-center text-neutral-500 dark:text-stone-400 hover:text-orange-500 transition-colors cursor-pointer outline-none"
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
              ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/45 text-rose-500 shadow-sm' 
              : 'bg-neutral-50 dark:bg-stone-850 border-neutral-150/50 dark:border-stone-800/50 text-neutral-450 dark:text-stone-400 hover:text-rose-500 dark:hover:text-rose-450'
          }`}
          aria-label="Save listing"
        >
          <Heart className={`w-4 h-4 stroke-[2.2] ${isInitialSaved ? 'fill-rose-500' : ''}`} />
        </motion.button>
      </div>
    </motion.header>
  );
}
