import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  icon?: LucideIcon;
  className?: string;
  'aria-label'?: string;
}

/**
 * Selectable pill chip -- codifies the filter-chip pattern used across
 * Search, Saved, and Notifications filter rows (rounded-full, emerald tint
 * when selected, neutral outline otherwise).
 */
export default function Chip({ label, selected = false, onClick, icon: Icon, className, ...aria }: ChipProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      role={onClick ? 'switch' : undefined}
      aria-checked={onClick ? selected : undefined}
      className={cn(
        'flex items-center space-x-1.5 px-4 h-[38px] rounded-full text-xs font-semibold whitespace-nowrap border cursor-pointer select-none outline-none transition-all duration-200 shrink-0',
        selected
          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-600/75 text-emerald-950 dark:text-emerald-200 shadow-sm'
          : 'bg-white dark:bg-stone-800/85 border-neutral-100 dark:border-neutral-700/60 text-neutral-800 dark:text-neutral-200 shadow-xs hover:border-neutral-200 dark:hover:border-neutral-600',
        className
      )}
      {...aria}
    >
      {Icon && (
        <Icon
          className={cn(
            'w-3.5 h-3.5 stroke-[2.2]',
            selected ? 'text-emerald-700 dark:text-emerald-400' : 'text-emerald-500 dark:text-emerald-400'
          )}
        />
      )}
      <span>{label}</span>
    </motion.button>
  );
}
