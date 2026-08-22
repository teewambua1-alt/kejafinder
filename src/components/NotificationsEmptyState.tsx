import React from 'react';
import { motion } from 'motion/react';
import { Bell, Search } from 'lucide-react';

interface NotificationsEmptyStateProps {
  mode: 'empty' | 'no-results';
  onBrowseHomes?: () => void;
  onSetAlerts?: () => void;
  onClearFilters?: () => void;
}

export default function NotificationsEmptyState({
  mode,
  onBrowseHomes,
  onSetAlerts,
  onClearFilters
}: NotificationsEmptyStateProps) {
  const isNoResults = mode === 'no-results';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full bg-white/90 dark:bg-stone-900/95 border border-neutral-200/55 dark:border-stone-850/45 rounded-3xl p-8 shadow-3xs flex flex-col items-center justify-center text-center space-y-5 select-none"
    >
      {/* Centered illustration style icon area */}
      <div className="relative">
        {/* Soft emerald icon circle container */}
        <div className="w-16 h-16 rounded-2.5xl bg-emerald-550/10 dark:bg-emerald-550/5 border border-emerald-500/20 dark:border-emerald-500/10 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
          {isNoResults ? (
            <Search className="w-7 h-7 stroke-[2.2]" />
          ) : (
            <Bell className="w-7 h-7 stroke-[2.2]" />
          )}
        </div>
        {/* Warm orange small accent dot */}
        <span 
          className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-orange-700 border-2 border-white dark:border-stone-900"
          aria-hidden="true"
        />
      </div>

      {/* Structured Text Metadata Header */}
      <div className="space-y-1.5 max-w-xs">
        <h3 className="text-sm font-black text-neutral-850 dark:text-stone-100 uppercase tracking-wider">
          {isNoResults ? 'No matching notifications' : 'No notifications yet'}
        </h3>
        <p className="text-[11px] text-neutral-500 dark:text-stone-400 font-semibold leading-relaxed">
          {isNoResults 
            ? 'Try changing your search, tabs, or filters.' 
            : 'We’ll show saved-home updates, caretaker replies, price drops, and safety alerts here.'
          }
        </p>
      </div>

      {/* Adaptive actions row with high accessibility standards */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full max-w-[280px]">
        {isNoResults ? (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onClearFilters}
            aria-label="Clear all active notification filters"
            className="w-full py-2.5 px-5 rounded-xl text-center text-xs font-black uppercase tracking-wider bg-emerald-700 hover:bg-emerald-800 text-white shadow-3xs cursor-pointer outline-none transition-all"
          >
            Clear filters
          </motion.button>
        ) : (
          <>
            {onBrowseHomes && (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={onBrowseHomes}
                aria-label="Browse newly vacant homes"
                className="w-full py-2.5 px-5 rounded-xl text-center text-xs font-black uppercase tracking-wider bg-emerald-700 hover:bg-emerald-800 text-white shadow-3xs cursor-pointer outline-none transition-all"
              >
                Browse homes
              </motion.button>
            )}
            
            {onSetAlerts && (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={onSetAlerts}
                aria-label="Customize notification alert settings"
                className="w-full py-2.5 px-5 rounded-xl text-center text-xs font-extrabold uppercase tracking-wider bg-neutral-100 hover:bg-neutral-150 text-neutral-700 dark:bg-stone-850 dark:hover:bg-stone-800 dark:text-stone-300 border border-neutral-200/50 dark:border-stone-800 cursor-pointer outline-none transition-all"
              >
                Set alerts
              </motion.button>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
