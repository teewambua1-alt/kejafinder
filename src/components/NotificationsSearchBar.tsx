import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, AlertCircle } from 'lucide-react';

interface NotificationsSearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSettingsClick?: () => void;
}

export default function NotificationsSearchBar({ value, onChange, onSettingsClick }: NotificationsSearchBarProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerPlaceholderToast = () => {
    if (onSettingsClick) {
      onSettingsClick();
    } else {
      setToastMessage("Notification filters coming soon.");
      setTimeout(() => {
        setToastMessage(null);
      }, 2000);
    }
  };

  return (
    <div className="w-full relative">
      <div className="flex items-center space-x-2 w-full">
        {/* Search input container with glassy look */}
        <div className="flex-1 relative flex items-center bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-800/40 rounded-2.5xl px-3.5 py-2.5 shadow-3xs hover:border-neutral-300 dark:hover:border-stone-750 transition-all focus-within:ring-2 focus-within:ring-emerald-500/30 focus-within:border-emerald-500/50">
          <Search className="w-4.5 h-4.5 text-neutral-400 dark:text-stone-500 shrink-0 stroke-[2.2]" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search notifications..."
            aria-label="Search notifications"
            className="w-full ml-2.5 bg-transparent text-neutral-800 dark:text-stone-100 placeholder-neutral-400 dark:placeholder-stone-500 text-[12.5px] font-semibold outline-none border-none py-1"
          />
        </div>

        {/* Filter / settings button on the right */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={triggerPlaceholderToast}
          aria-label="Open notification filters"
          className="w-[45px] h-[45px] bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-800/40 rounded-2.5xl flex items-center justify-center text-neutral-600 dark:text-stone-300 shadow-3xs hover:bg-neutral-50 dark:hover:bg-stone-850/60 transition-all cursor-pointer outline-none shrink-0"
        >
          <SlidersHorizontal className="w-4.5 h-4.5 stroke-[2.2]" />
        </motion.button>
      </div>

      {/* Floating Micro-Toast for filtering feedback */}
      <AnimatePresence>
        {toastMessage && (
          <div className="absolute right-0 -bottom-14 left-0 z-30 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              className="bg-neutral-900/95 border border-neutral-800 text-white font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-xl shadow-md flex items-center space-x-1.5 pointer-events-auto"
            >
              <AlertCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
