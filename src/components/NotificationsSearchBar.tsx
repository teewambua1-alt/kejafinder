import React from 'react';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface NotificationsSearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSettingsClick?: () => void;
}

export default function NotificationsSearchBar({ value, onChange, onSettingsClick }: NotificationsSearchBarProps) {
  const { showToast } = useToast();

  const triggerPlaceholderToast = () => {
    if (onSettingsClick) {
      onSettingsClick();
    } else {
      showToast("Notification filters coming soon.", { icon: AlertCircle });
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
    </div>
  );
}
