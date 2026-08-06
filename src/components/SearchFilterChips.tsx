import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Home, Wallet, CalendarDays, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SearchFilters } from './SearchFilterSheet';

interface FilterItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  hasDropdown: boolean;
}

export interface EstateOption {
  name: string;
  count: number;
}

interface SearchFilterChipsProps {
  searchQuery?: string;
  filters?: SearchFilters;
  onOpenFilters?: () => void;
  estates?: EstateOption[];
  onSelectEstate?: (name: string | null) => void;
  showAvailableOnly?: boolean;
  onShowAvailableOnlyChange?: (val: boolean) => void;
}

export default function SearchFilterChips({
  searchQuery = '',
  filters,
  onOpenFilters,
  estates = [],
  onSelectEstate,
  showAvailableOnly = false,
  onShowAvailableOnlyChange
}: SearchFilterChipsProps) {
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filterItems: FilterItem[] = [
    { id: 'location', label: 'Location', icon: MapPin, hasDropdown: true },
    { id: 'house-type', label: 'House Type', icon: Home, hasDropdown: true },
    { id: 'budget', label: 'Budget', icon: Wallet, hasDropdown: true },
    { id: 'available', label: 'Available Now', icon: CalendarDays, hasDropdown: false },
  ];

  const handleChipClick = (id: string) => {
    if (id === 'location' && estates.length > 0) {
      setIsLocationOpen((prev) => !prev);
      return;
    }
    if (onOpenFilters) {
      onOpenFilters();
    } else if (id === 'available' && onShowAvailableOnlyChange) {
      onShowAvailableOnlyChange(!showAvailableOnly);
    }
  };

  const handleSelectEstate = (name: string | null) => {
    onSelectEstate?.(name);
    setIsLocationOpen(false);
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
          const isLocation = item.id === 'location';

          return (
            <div key={item.id} className={isLocation ? 'relative shrink-0' : 'contents'} ref={isLocation ? locationRef : undefined}>
              <motion.button
                id={`search-filter-chip-${item.id}`}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleChipClick(item.id)}
                aria-pressed={isActive}
                aria-expanded={isLocation ? isLocationOpen : undefined}
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
                      isLocation && isLocationOpen ? 'rotate-180' : ''
                    } ${
                      isActive ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-neutral-405 dark:text-stone-500'
                    }`}
                  />
                )}
              </motion.button>

              {/* Real estate dropdown -- populated from actually-loaded listings, never a curated/fake list */}
              {isLocation && (
                <AnimatePresence>
                  {isLocationOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute left-0 mt-1.5 w-56 max-h-72 overflow-y-auto rounded-xl bg-white/95 dark:bg-stone-850/95 backdrop-blur-md border border-neutral-100/90 dark:border-neutral-700/80 shadow-lg z-60 py-1 origin-top-left"
                      role="listbox"
                    >
                      <button
                        onClick={() => handleSelectEstate(null)}
                        role="option"
                        aria-selected={searchQuery.trim().length === 0}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold flex items-center justify-between border-none outline-none cursor-pointer transition-colors bg-transparent text-neutral-700 dark:text-stone-300 hover:bg-neutral-50 dark:hover:bg-stone-800"
                      >
                        <span>All estates</span>
                        {searchQuery.trim().length === 0 && <Check className="w-3.5 h-3.5 text-emerald-650 dark:text-emerald-400 stroke-[2.5]" />}
                      </button>
                      {estates.map((estate) => {
                        const isSelected = searchQuery.trim().toLowerCase() === estate.name.toLowerCase();
                        return (
                          <button
                            key={estate.name}
                            onClick={() => handleSelectEstate(estate.name)}
                            role="option"
                            aria-selected={isSelected}
                            className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center justify-between border-none outline-none cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                                : 'bg-transparent text-neutral-700 dark:text-stone-300 hover:bg-neutral-50 dark:hover:bg-stone-800'
                            }`}
                          >
                            <span className="truncate">{estate.name}</span>
                            <span className="text-2xs font-bold text-neutral-400 dark:text-stone-500 shrink-0 ml-2">{estate.count}</span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
