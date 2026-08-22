import React, { useEffect, useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import { ListingType, LISTING_TYPES, getListingTypeLabel } from '../types/listing';
import type { Listing } from '../types/listing';
import PriceRangeSlider from './PriceRangeSlider';
import Sheet from './ui/Sheet';
import Button from './ui/Button';
import {
  type SearchFilters,
  defaultSearchFilters,
  countMatches,
} from '../lib/searchFilters';

// Single source of truth is lib/searchFilters; re-exported so the existing
// importers (App, SaveSearchButton, useSavedSearches) keep one import path.
export type { SearchFilters };
export { defaultSearchFilters };

interface SearchFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onApply: (updatedFilters: SearchFilters) => void;
  rentBounds: { min: number; max: number };
  depositBounds: { min: number; max: number };
  /**
   * The set the draft is counted against, plus the live query. Without these
   * the Apply button could only say a static "Apply filters" while the page
   * behind it already knew the number.
   */
  listings: Listing[];
  query: string;
}

/** Real amenity ids -- must match PostAmenitiesGrid.tsx, since these are the
 *  literal strings stored in listing.amenities. */
const AMENITY_OPTIONS: { value: string; label: string }[] = [
  { value: 'water_available', label: 'Water' },
  { value: 'token_electricity', label: 'Token electricity' },
  { value: 'private_toilet', label: 'Private toilet' },
  { value: 'shared_toilet', label: 'Shared toilet' },
  { value: 'private_bathroom', label: 'Private bathroom' },
  { value: 'shared_bathroom', label: 'Shared bathroom' },
  { value: 'tiled_floor', label: 'Tiled floor' },
  { value: 'secure_gate', label: 'Secure gate' },
  { value: 'near_main_road', label: 'Near main road' },
  { value: 'near_bus_stage', label: 'Near bus stage' },
  { value: 'no_agent_fee', label: 'No agent fee' },
  { value: 'parking', label: 'Parking' },
];

/** All nine, derived from the type. The old hand-written list had six, so
 *  three house types were unfilterable. */
const HOUSE_TYPE_OPTIONS = LISTING_TYPES.filter((t) => t !== 'other');

/** flex-wrap, not overflow -- chips must reflow rather than clip. */
function PillGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

function Pill({
  label, selected, onToggle,
}: { label: string; selected: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={`h-10 px-3.5 rounded-2xl text-xs font-semibold border cursor-pointer select-none outline-none transition-[background-color,border-color,color] ${
        selected
          ? 'bg-emerald-700 border-emerald-700 text-white shadow-xs'
          : 'bg-neutral-50 dark:bg-stone-850 border-neutral-150 dark:border-stone-800 text-neutral-750 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-stone-700'
      }`}
    >
      {label}
    </button>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-bold text-neutral-600 dark:text-stone-400 uppercase tracking-wider">
      {children}
    </h3>
  );
}

/**
 * Advanced filters. Keeps the draft/apply model, which was already sound, and
 * moves onto ui/Sheet -- a primitive whose docblock says it was extracted
 * *from* this file, yet which this file never adopted, so it was missing
 * overscroll containment, reduced motion, aria-labelledby, and the
 * max(..., env(safe-area-inset-bottom)) footer it had itself pioneered.
 */
export default function SearchFilterSheet({
  isOpen, onClose, filters, onApply, rentBounds, depositBounds, listings, query,
}: SearchFilterSheetProps) {
  const [draft, setDraft] = useState<SearchFilters>(filters);

  useEffect(() => {
    if (isOpen) setDraft(filters);
  }, [isOpen, filters]);

  const patch = (next: Partial<SearchFilters>) => setDraft((prev) => ({ ...prev, ...next }));

  function toggleIn<T>(list: T[], value: T): T[] {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  }

  const lowRent = draft.minRent === '' ? rentBounds.min : draft.minRent;
  const highRent = draft.maxRent === '' ? rentBounds.max : draft.maxRent;
  const lowDeposit = draft.minDeposit === '' ? depositBounds.min : draft.minDeposit;
  const highDeposit = draft.maxDeposit === '' ? depositBounds.max : draft.maxDeposit;

  // Recomputed as the draft changes, so the CTA reports what Apply will do.
  const matchCount = useMemo(
    () => (isOpen ? countMatches(listings, draft, query) : 0),
    [isOpen, listings, draft, query]
  );

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title="Filter vacancies"
      footer={
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="md"
            /* Draft-only. This used to call onClear(), applying instantly while
             * every other control in the sheet waited for Apply -- so "Clear
             * all" then Close left the filters cleared anyway. */
            onClick={() => setDraft(defaultSearchFilters)}
            className="w-1/3 bg-neutral-100 dark:bg-stone-850"
          >
            Clear all
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={Check}
            onClick={handleApply}
            disabled={matchCount === 0}
            className="flex-1"
          >
            {matchCount === 0
              ? 'No matches'
              : `Show ${matchCount} ${matchCount === 1 ? 'home' : 'homes'}`}
          </Button>
        </div>
      }
    >
      <div className="space-y-6 pb-2">
        <section className="space-y-2.5">
          <GroupLabel>House type</GroupLabel>
          <PillGroup>
            {HOUSE_TYPE_OPTIONS.map((type: ListingType) => (
              <Pill
                key={type}
                label={getListingTypeLabel(type)}
                selected={draft.houseTypes.includes(type)}
                onToggle={() => patch({ houseTypes: toggleIn(draft.houseTypes, type) })}
              />
            ))}
          </PillGroup>
        </section>

        <section className="space-y-2.5">
          <GroupLabel>Rent per month</GroupLabel>
          <PriceRangeSlider
            ariaLabel="rent"
            min={rentBounds.min}
            max={rentBounds.max}
            value={[lowRent, highRent]}
            onChange={([min, max]) => patch({ minRent: min, maxRent: max })}
          />
        </section>

        <section className="space-y-2.5">
          <GroupLabel>Deposit</GroupLabel>
          {/* Was two bare number inputs with unassociated labels, which also
            * accepted a minimum above the maximum. The slider makes that
            * unrepresentable. */}
          <PriceRangeSlider
            ariaLabel="deposit"
            min={depositBounds.min}
            max={depositBounds.max}
            value={[lowDeposit, highDeposit]}
            onChange={([min, max]) => patch({ minDeposit: min, maxDeposit: max })}
          />
        </section>

        <section className="space-y-2.5">
          <GroupLabel>Quick filters</GroupLabel>
          <PillGroup>
            <Pill label="Available now" selected={draft.availableNow} onToggle={() => patch({ availableNow: !draft.availableNow })} />
            <Pill label="Verified only" selected={draft.verifiedOnly} onToggle={() => patch({ verifiedOnly: !draft.verifiedOnly })} />
            <Pill label="Recently updated" selected={draft.recentlyUpdatedOnly} onToggle={() => patch({ recentlyUpdatedOnly: !draft.recentlyUpdatedOnly })} />
          </PillGroup>
        </section>

        <section className="space-y-2.5">
          <GroupLabel>Amenities</GroupLabel>
          <PillGroup>
            {AMENITY_OPTIONS.map((opt) => (
              <Pill
                key={opt.value}
                label={opt.label}
                selected={draft.amenities.includes(opt.value)}
                onToggle={() => patch({ amenities: toggleIn(draft.amenities, opt.value) })}
              />
            ))}
          </PillGroup>
        </section>
      </div>
    </Sheet>
  );
}
