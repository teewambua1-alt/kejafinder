import React from 'react';
import { motion } from 'motion/react';
import { ListingType, getListingTypeLabel } from '../types/listing';

interface SearchHouseTypeChipsProps {
  selectedType: ListingType | null;
  onSelectType: (type: ListingType | null) => void;
}

const HOUSE_TYPES: ListingType[] = ['single_room', 'bedsitter', 'studio', 'one_bedroom', 'two_bedroom', 'mabati'];

/**
 * Quick, page-level house-type chip row -- applies instantly (no sheet, no
 * Apply step), writing straight into the same SearchFilters.houseTypes the
 * filter sheet also reads/writes. Single-select for a fast top-level shortcut;
 * the sheet's own house-type pills stay available for multi-select.
 */
export default function SearchHouseTypeChips({ selectedType, onSelectType }: SearchHouseTypeChipsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut', delay: 0.2 }}
      className="w-full"
    >
      <div className="-mx-6 px-6 flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelectType(null)}
          aria-pressed={selectedType === null}
          className={`px-4 h-[34px] rounded-full text-xs font-bold whitespace-nowrap border cursor-pointer select-none outline-none transition-all shrink-0 ${
            selectedType === null
              ? 'bg-neutral-900 dark:bg-emerald-600 border-neutral-900 dark:border-emerald-600 text-white'
              : 'bg-white/95 dark:bg-stone-800/90 border-neutral-150 dark:border-neutral-700/60 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300'
          }`}
        >
          All types
        </motion.button>
        {HOUSE_TYPES.map((type) => {
          const isActive = selectedType === type;
          return (
            <motion.button
              key={type}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectType(isActive ? null : type)}
              aria-pressed={isActive}
              className={`px-4 h-[34px] rounded-full text-xs font-bold whitespace-nowrap border cursor-pointer select-none outline-none transition-all shrink-0 ${
                isActive
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-white/95 dark:bg-stone-800/90 border-neutral-150 dark:border-neutral-700/60 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300'
              }`}
            >
              {getListingTypeLabel(type)}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
