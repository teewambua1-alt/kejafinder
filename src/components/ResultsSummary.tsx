import React from 'react';
import { motion } from 'motion/react';
import SortDropdown, { SortOption } from './SortDropdown';
import { List, LayoutGrid } from 'lucide-react';

interface ResultsSummaryProps {
  count?: number;
  searchQuery?: string;
  selectedSort?: SortOption;
  onSortChange?: (option: SortOption) => void;
  viewMode?: 'list' | 'grid';
  onViewModeChange?: (mode: 'list' | 'grid') => void;
}

export default function ResultsSummary({ 
  count = 6, 
  searchQuery = '',
  selectedSort = 'Most relevant',
  onSortChange,
  viewMode = 'list',
  onViewModeChange
}: ResultsSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut', delay: 0.25 }}
      className="w-full flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 px-1 py-1"
    >
      {/* Dynamic Count Text Indicator */}
      <div className="text-[14px] font-medium tracking-tight text-neutral-800 dark:text-neutral-100 font-sans">
        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold pr-1">{count}</span>
        {searchQuery.trim() ? (
          <>
            homes found in <span className="font-semibold text-neutral-900 dark:text-neutral-100">{searchQuery}</span>
          </>
        ) : (
          'homes found'
        )}
      </div>

      <div className="flex items-center justify-between w-full xs:w-auto gap-3 shrink-0">
        {/* View Mode Toggle */}
        <div className="flex items-center bg-neutral-100 dark:bg-stone-850 p-1 rounded-xl shadow-sm border border-neutral-200/50 dark:border-stone-800">
          <button
            onClick={() => onViewModeChange?.('list')}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'list' 
                ? 'bg-white dark:bg-stone-700 text-emerald-600 shadow-sm border border-neutral-200/50 dark:border-stone-600' 
                : 'text-neutral-500 dark:text-stone-400 hover:text-neutral-700 dark:hover:text-stone-300'
            }`}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange?.('grid')}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'grid' 
                ? 'bg-white dark:bg-stone-700 text-emerald-600 shadow-sm border border-neutral-200/50 dark:border-stone-600' 
                : 'text-neutral-500 dark:text-stone-400 hover:text-neutral-700 dark:hover:text-stone-300'
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>

        {/* Sort selection drop down trigger menu */}
        <div className="shrink-0">
          <SortDropdown selected={selectedSort} onChange={onSortChange} />
        </div>
      </div>
    </motion.div>
  );
}
