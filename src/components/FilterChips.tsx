import React, { useState } from 'react';
import { MapPin, Home, Wallet, CalendarDays, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';

interface FilterItem {
  id: string;
  label: string;
  // Use specific React component type for Lucide icon
  icon: React.ComponentType<{ className?: string }>;
  hasDropdown: boolean;
}

interface FilterChipsProps {
  activeChip?: string | null;
  onChipClick?: (id: string) => void;
}

export default function FilterChips({ activeChip: propActiveChip, onChipClick }: FilterChipsProps = {}) {
  const [localActiveChip, setLocalActiveChip] = useState<string | null>(null);

  const activeChip = propActiveChip !== undefined ? propActiveChip : localActiveChip;

  const filterItems: FilterItem[] = [
    { id: 'location', label: 'Location', icon: MapPin, hasDropdown: true },
    { id: 'house-type', label: 'House Type', icon: Home, hasDropdown: true },
    { id: 'budget', label: 'Budget', icon: Wallet, hasDropdown: true },
    { id: 'available', label: 'Available Now', icon: CalendarDays, hasDropdown: false },
  ];

  const handleChipClick = (id: string) => {
    if (onChipClick) {
      onChipClick(id);
    } else {
      setLocalActiveChip(prev => (prev === id ? null : id));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
      className="w-full"
    >
      {/* Horizontal scrolling row with scroll bar hidden */}
      <div className="-mx-6 px-6 flex items-center space-x-2.5 overflow-x-auto no-scrollbar py-1.5">
        {filterItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeChip === item.id;

          return (
            <motion.button
              key={item.id}
              id={`filter-chip-${item.id}`}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleChipClick(item.id)}
              className={`flex items-center space-x-1.5 px-4 h-[38px] rounded-full text-xs font-semibold whitespace-nowrap border cursor-pointer select-none outline-none transition-all duration-200 shrink-0 ${
                isActive 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-600/75 text-emerald-800 dark:text-emerald-300 shadow-sm' 
                  : 'bg-white dark:bg-stone-800/85 border-neutral-100 dark:border-neutral-700/60 text-neutral-700 dark:text-neutral-300 shadow-xs hover:border-neutral-200 dark:hover:border-neutral-600'
              }`}
            >
              {/* Emerald Green Icon */}
              <IconComponent 
                className={`w-3.5 h-3.5 stroke-[2.2] ${
                  isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-emerald-500 dark:text-emerald-400'
                }`} 
              />
              
              {/* Readable Dark Charcoal Text */}
              <span className={isActive ? 'text-emerald-950 dark:text-emerald-200' : 'text-neutral-800 dark:text-neutral-200'}>
                {item.label}
              </span>

              {/* Optional Dropdown Chevron */}
              {item.hasDropdown && (
                <ChevronDown 
                  className={`w-3.5 h-3.5 stroke-[2] transition-transform duration-200 ${
                    isActive ? 'text-emerald-700 dark:text-emerald-400 rotate-180' : 'text-neutral-400 dark:text-stone-500'
                  }`} 
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
