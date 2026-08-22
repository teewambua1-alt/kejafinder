import { LayoutGrid, ShieldCheck, Wallet, CalendarCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Listing } from '../types/listing';
import { isVerified } from './searchFilters';

/**
 * Filters for the Saved page, with their predicates, so the chips and the list
 * cannot disagree — and so every chip can show a real count.
 *
 * What this replaces:
 *
 * - **`SavedCollections`** (172 lines, four cards) advertised **hardcoded
 *   counts**: "Budget Picks — 3 homes", "Near Transport — 4 homes",
 *   "Verified Homes — 5 homes", "Move This Month — 2 homes", regardless of what
 *   the account had actually saved. Its "Near Transport" predicate also guessed
 *   by substring-matching `title.includes('stage')`, so a house called
 *   "Bedsitter near Stage Road" qualified and one 2 minutes from a stage with a
 *   plain title did not.
 * - **`recently_saved`** was a chip whose filter branch was an empty comment
 *   ("Just keep them all, sorting handles order") — it looked like a filter and
 *   did nothing. Recency is a sort, and the sort control already offers it.
 * - **`bedsitter` / `one_bedroom`** were two of the nine house types, picked
 *   arbitrarily. House type belongs to search, which filters on all nine.
 * - **`verified`** existed in *both* the chip row and the collections row, two
 *   independent controls for one predicate.
 */

/** A meaningful threshold in this market, named rather than inlined. */
export const BUDGET_CEILING = 10_000;

export type SavedFilterId = 'all' | 'verified' | 'budget' | 'available';

interface SavedFilter {
  id: SavedFilterId;
  label: string;
  icon: LucideIcon;
  test: (listing: Listing) => boolean;
}

export const SAVED_FILTERS: SavedFilter[] = [
  { id: 'all', label: 'All', icon: LayoutGrid, test: () => true },
  { id: 'verified', label: 'Verified', icon: ShieldCheck, test: isVerified },
  { id: 'budget', label: 'Under 10K', icon: Wallet, test: (l) => l.rent > 0 && l.rent <= BUDGET_CEILING },
  { id: 'available', label: 'Available', icon: CalendarCheck, test: (l) => l.isAvailable },
];

export function applySavedFilter(listings: Listing[], id: SavedFilterId): Listing[] {
  const filter = SAVED_FILTERS.find((f) => f.id === id);
  return filter ? listings.filter(filter.test) : listings;
}

/** Real counts, so a chip never promises results it cannot produce. */
export function savedFilterCounts(listings: Listing[]): Record<SavedFilterId, number> {
  const counts = { all: listings.length, verified: 0, budget: 0, available: 0 };
  for (const listing of listings) {
    for (const filter of SAVED_FILTERS) {
      if (filter.id !== 'all' && filter.test(listing)) counts[filter.id]++;
    }
  }
  return counts;
}
