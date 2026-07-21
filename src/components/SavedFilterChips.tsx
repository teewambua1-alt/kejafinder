import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutGrid, 
  Clock, 
  Bed, 
  Home, 
  ShieldCheck 
} from 'lucide-react';

interface FilterChipOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SavedFilterChipsProps {
  activeFilter: string;
  onFilterChange: (id: string) => void;
}

const FILTER_OPTIONS: FilterChipOption[] = [
  { id: 'all', label: 'All', icon: LayoutGrid },
  { id: 'recently_saved', label: 'Recently Saved', icon: Clock },
  { id: 'bedsitter', label: 'Bedsitter', icon: Bed },
  { id: 'one_bedroom', label: '1 Bedroom', icon: Home },
  { id: 'verified', label: 'Verified', icon: ShieldCheck },
];

export default function SavedFilterChips({ activeFilter, onFilterChange }: SavedFilterChipsProps) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar pb-1 -mb-1 flex items-center space-x-2 scroll-smooth select-none">
      <div className="flex space-x-2.5 px-0.5">
        {FILTER_OPTIONS.map((option) => {
          const IconComponent = option.icon;
          const isActive = activeFilter === option.id;

          return (
            <motion.button
              key={option.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => onFilterChange(option.id)}
              aria-pressed={isActive}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-full border text-[12.5px] font-extrabold whitespace-nowrap transition-all shadow-3xs cursor-pointer ${
                isActive
                  ? 'bg-emerald-500/10 border-emerald-500/60 text-emerald-600 dark:text-emerald-400 font-black'
                  : 'bg-white/90 dark:bg-stone-880/90 border-neutral-100/80 dark:border-neutral-800 text-neutral-600 dark:text-stone-300 hover:text-neutral-800 dark:hover:text-stone-100'
              }`}
            >
              <IconComponent 
                className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive 
                    ? 'text-emerald-600 dark:text-emerald-400 scale-105 stroke-[2.5]' 
                    : 'text-neutral-400 dark:text-stone-500 stroke-[2]'
                }`} 
              />
              <span>{option.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
