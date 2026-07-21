import React from 'react';
import { MapPin, Home, Wallet, CalendarDays, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { SearchFilters } from './SearchFilterSheet';

interface FilterItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  hasDropdown: boolean;
}

interface SearchFilterChipsProps {
  searchQuery?: string;
  filters?: SearchFilters;
  onOpenFilters?: () => void;
  showAvailableOnly?: boolean;
  onShowAvailableOnlyChange?: (val: boolean) => void;
}

export default function SearchFilterChips({
  searchQuery = '',
  filters,
  onOpenFilters,
  showAvailableOnly = false,
  onShowAvailableOnlyChange
}: SearchFilterChipsProps) {

  const filterItems: FilterItem[] = [
    { id: 'location', label: 'Location', icon: MapPin, hasDropdown: true },
    { id: 'house-type', label: 'House Type', icon: Home, hasDropdown: true },
    { id: 'budget', label: 'Budget', icon: Wallet, hasDropdown: true },
    { id: 'available', label: 'Available Now', icon: CalendarDays, hasDropdown: false },
  ];

  const handleChipClick = (id: string) => {
    if (onOpenFilters) {
      onOpenFilters();
    } else if (id === 'available' && onShowAvailableOnlyChange) {
      onShowAvailableOnlyChange(!showAvailableOnly);
    }
  };

  const isChipActive = (id: string): boolean => {
    if (id === 'location') {
      return searchQuery.trim().length > 0;
    }
    if (!filters) {
      if (id === 'available') return showAvailableOnly;
      return false;
    }
    if (id === 'house-type') {
      return filters.houseTypes.length > 0;
    }
    if (id === 'budget') {
      return (
        filters.minRent !== "" ||
        filters.maxRent !== "" ||
        filters.minDeposit !== "" ||
        filters.maxDeposit !== ""
      );
    }
    if (id === 'available') {
      return filters.availableNow;
    }
    return false;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut', delay: 0.15 }}
      className="w-full"
    >
      {/* Horizontal scrolling row for mobile, no-scrollbar */}
      <div className="-mx-6 px-6 flex items-center space-x-2.5 overflow-x-auto no-scrollbar py-1">
        {filterItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = isChipActive(item.id);

          return (
            <motion.button
              key={item.id}
              id={`search-filter-chip-${item.id}`}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleChipClick(item.id)}
              aria-pressed={isActive}
              className={`flex items-center space-x-1.5 px-4 h-[38px] rounded-full text-xs font-semibold whitespace-nowrap border cursor-pointer select-none outline-none transition-all duration-200 shrink-0 ${
                isActive
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-600/75 text-emerald-850 dark:text-emerald-300 shadow-md'
                  : 'bg-white/95 dark:bg-stone-800/90 border-neutral-150 dark:border-neutral-700/60 text-neutral-700 dark:text-neutral-300 shadow-3xs hover:border-neutral-300 dark:hover:border-neutral-600'
              }`}
            >
              {/* Emerald Green Icon */}
              <IconComponent
                className={`w-3.5 h-3.5 stroke-[2.2] ${
                  isActive ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-emerald-600 dark:text-emerald-450'
                }`}
              />

              {/* Readable Dark Charcoal/Neutral text */}
              <span className={isActive ? 'text-emerald-950 dark:text-emerald-200 font-bold' : 'text-neutral-850 dark:text-neutral-200 font-medium'}>
                {item.label}
              </span>

              {/* Optional Dropdown Chevron */}
              {item.hasDropdown && (
                <ChevronDown
                  className={`w-3.5 h-3.5 stroke-[2.2] transition-transform duration-200 ${
                    isActive ? 'text-emerald-700 dark:text-emerald-400 rotate-185 font-bold' : 'text-neutral-405 dark:text-stone-500'
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
