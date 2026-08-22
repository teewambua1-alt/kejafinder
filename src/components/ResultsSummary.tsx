import React from 'react';
import SortDropdown, { SortOption } from './SortDropdown';
import { List, LayoutGrid } from 'lucide-react';

interface ResultsSummaryProps {
  count?: number;
  searchQuery?: string;
  selectedSort?: SortOption;
  onSortChange?: (option: SortOption) => void;
  viewMode?: 'list' | 'grid';
  onViewModeChange?: (mode: 'list' | 'grid') => void;
  rightSlot?: React.ReactNode;
}

export default function ResultsSummary({
  count = 6,
  searchQuery = '',
  selectedSort = 'Most relevant',
  onSortChange,
  viewMode = 'list',
  onViewModeChange,
  rightSlot
}: ResultsSummaryProps) {
  return (
    /* No animation of its own any more: the parent page already fades this in
     * as part of a stagger, and a second initial/animate here overrode it with
     * a hardcoded 0.25s delay that also ignored prefers-reduced-motion. */
    /* flex-wrap rather than an `xs:flex-row` switch. At exactly 390px -- iPhone
     * 14/15 width -- xs fired and put four controls on one line, pushing "Save
     * this search" 21px outside the viewport where it was clipped and
     * unreachable. 375px wrapped fine and 430px fit fine, so the bug lived in
     * a narrow band that a two-width check would miss. Wrapping needs no
     * breakpoint to be right. */
    <div className="w-full flex flex-wrap items-center justify-between gap-x-3 gap-y-2.5 px-1 py-1">
      {/* Dynamic Count Text Indicator */}
      <div
        role="status"
        aria-live="polite"
        className="text-sm font-medium tracking-tight text-neutral-800 dark:text-neutral-100 font-sans"
      >
        <span className="text-emerald-700 dark:text-emerald-400 font-extrabold pr-1">{count}</span>
        {searchQuery.trim() ? (
          <>
            homes found in <span className="font-semibold text-neutral-900 dark:text-neutral-100">{searchQuery}</span>
          </>
        ) : (
          'homes found'
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2.5 ml-auto">
        {/* View Mode Toggle */}
        <div className="flex items-center bg-neutral-100 dark:bg-stone-850 p-1 rounded-xl shadow-sm border border-neutral-200/50 dark:border-stone-800">
          <button
            onClick={() => onViewModeChange?.('list')}
            aria-pressed={viewMode === 'list'}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
              viewMode === 'list'
                ? 'bg-white dark:bg-stone-700 text-emerald-700 shadow-sm border border-neutral-200/50 dark:border-stone-600'
                : 'text-neutral-500 dark:text-stone-400 hover:text-neutral-700 dark:hover:text-stone-300'
            }`}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange?.('grid')}
            aria-pressed={viewMode === 'grid'}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-stone-700 text-emerald-700 shadow-sm border border-neutral-200/50 dark:border-stone-600'
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

        {rightSlot}
      </div>
    </div>
  );
}
