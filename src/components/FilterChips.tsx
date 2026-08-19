import React from 'react';
import { CalendarDays } from 'lucide-react';
import { motion } from 'motion/react';

interface FilterChipsProps {
  activeChip?: string | null;
  onChipClick?: (id: string) => void;
}

export default function FilterChips({ activeChip, onChipClick }: FilterChipsProps = {}) {
  const isActive = activeChip === 'available';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
      className="w-full"
    >
      <div className="flex items-center py-1.5">
        <motion.button
          id="filter-chip-available"
          aria-pressed={isActive}
          whileTap={{ scale: 0.97 }}
          onClick={() => onChipClick?.(isActive ? '' : 'available')}
          className={`flex items-center space-x-1.5 px-4 h-[38px] rounded-full text-xs font-semibold whitespace-nowrap border cursor-pointer select-none outline-none transition-all duration-200 shrink-0 ${
            isActive
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-600/75 text-emerald-800 dark:text-emerald-300 shadow-sm'
              : 'bg-white dark:bg-stone-800/85 border-neutral-100 dark:border-neutral-700/60 text-neutral-700 dark:text-neutral-300 shadow-xs hover:border-neutral-200 dark:hover:border-neutral-600'
          }`}
        >
          <CalendarDays
            className={`w-3.5 h-3.5 stroke-[2.2] ${
              isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-emerald-500 dark:text-emerald-400'
            }`}
          />
          <span className={isActive ? 'text-emerald-950 dark:text-emerald-200' : 'text-neutral-800 dark:text-neutral-200'}>
            Available Now
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}
