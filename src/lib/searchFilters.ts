import type { Listing, ListingType } from '../types/listing';
import type { SortOption } from '../components/SortDropdown';

/**
 * The search filter model, its predicate, and its sort -- in one module so the
 * results page and the filter sheet cannot disagree.
 *
 * They did disagree. The page owned a 130-line inline predicate and the sheet
 * received no listings at all, so its Apply button could only ever say a static
 * "Show results" while the page knew the real number. Lifting the predicate is
 * what makes a live "Show N homes" count possible without duplicating it.
 */

export type SearchFilters = {
  houseTypes: ListingType[];
  minRent: number | '';
  maxRent: number | '';
  minDeposit: number | '';
  maxDeposit: number | '';
  availableNow: boolean;
  verifiedOnly: boolean;
  recentlyUpdatedOnly: boolean;
  amenities: string[];
};

export const defaultSearchFilters: SearchFilters = {
  houseTypes: [],
  minRent: '',
  maxRent: '',
  minDeposit: '',
  maxDeposit: '',
  availableNow: false,
  verifiedOnly: false,
  recentlyUpdatedOnly: false,
  amenities: [],
};

/**
 * The badge strings the mapper actually emits for a verified listing. Kept next
 * to the filter that reads them -- these were previously spelled out inline in
 * three places with a different subset each time (the sort omitted
 * 'Trusted Landlord', so the top rung of the ladder sorted as unverified).
 */
export const VERIFIED_BADGES = [
  'Phone Verified',
  'Location Checked',
  'Scout Verified',
  'Trusted Landlord',
] as const;

export function isVerified(listing: Listing): boolean {
  return listing.badges.some((badge) => (VERIFIED_BADGES as readonly string[]).includes(badge));
}

/** Human synonyms for house types, so "one bedroom" finds `one_bedroom`. */
const TYPE_SYNONYMS: Partial<Record<ListingType, string[]>> = {
  single_room: ['single room', 'single'],
  one_bedroom: ['1 bedroom', 'one bedroom', '1 bed', 'one bed'],
  two_bedroom: ['2 bedroom', 'two bedroom', '2 bed', 'two bed'],
  three_bedroom: ['3 bedroom', 'three bedroom', '3 bed', 'three bed'],
  student_room: ['student room', 'student', 'hostel'],
  mabati: ['mabati', 'iron sheet'],
  bedsitter: ['bedsitter', 'bedsit'],
  studio: ['studio'],
};

function matchesQuery(listing: Listing, q: string): boolean {
  if (!q) return true;

  const haystack = [
    listing.title,
    listing.location,
    listing.town,
    listing.estate,
    listing.landmark ?? '',
    listing.typeLabel ?? '',
    listing.type,
    ...listing.amenities,
    ...listing.badges,
  ]
    .join(' ')
    .toLowerCase();

  if (haystack.includes(q)) return true;

  // Two-way containment on synonyms so both "bed" -> "1 bedroom" and
  // "one bedroom flat" -> one_bedroom match.
  const synonyms = TYPE_SYNONYMS[listing.type] ?? [];
  return synonyms.some((s) => s.includes(q) || q.includes(s));
}

/** True when this listing survives the given filters and query. */
export function matchesFilters(listing: Listing, filters: SearchFilters, query: string): boolean {
  if (filters.houseTypes.length > 0 && !filters.houseTypes.includes(listing.type)) return false;

  if (filters.minRent !== '' && listing.rent < filters.minRent) return false;
  if (filters.maxRent !== '' && listing.rent > filters.maxRent) return false;
  if (filters.minDeposit !== '' && listing.deposit < filters.minDeposit) return false;
  if (filters.maxDeposit !== '' && listing.deposit > filters.maxDeposit) return false;

  if (filters.availableNow && !listing.isAvailable) return false;
  if (filters.verifiedOnly && !isVerified(listing)) return false;
  if (filters.recentlyUpdatedOnly && !listing.badges.includes('Recently Updated')) return false;

  // Exact id match against the ids Post Vacancy actually writes
  // (see PostAmenitiesGrid.tsx) -- not a substring guess.
  if (filters.amenities.length > 0) {
    if (!filters.amenities.every((id) => listing.amenities.includes(id))) return false;
  }

  return matchesQuery(listing, query.toLowerCase().trim());
}

export function applyFilters(listings: Listing[], filters: SearchFilters, query: string): Listing[] {
  return listings.filter((listing) => matchesFilters(listing, filters, query));
}

/** How many results a *draft* set of filters would produce. Used by the sheet. */
export function countMatches(listings: Listing[], filters: SearchFilters, query: string): number {
  let n = 0;
  for (const listing of listings) if (matchesFilters(listing, filters, query)) n++;
  return n;
}

const updatedTime = (l: Listing) => (l.updatedAt ? new Date(l.updatedAt).getTime() : 0);

/**
 * Returns a new array; never sorts in place. 'Nearest' is absent on purpose --
 * the nearby_listings RPC already returns real server-side distance ordering,
 * and re-sorting here would throw it away.
 */
export function sortListings(listings: Listing[], sort: SortOption): Listing[] {
  const out = [...listings];
  switch (sort) {
    case 'Newest':
      return out.sort((a, b) => updatedTime(b) - updatedTime(a));
    case 'Cheapest':
      return out.sort((a, b) => a.rent - b.rent);
    case 'Most viewed':
      return out.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    case 'Verified first':
      return out.sort((a, b) => Number(isVerified(b)) - Number(isVerified(a)));
    case 'Recently updated':
      return out.sort((a, b) => {
        const flag = Number(b.badges.includes('Recently Updated')) - Number(a.badges.includes('Recently Updated'));
        return flag !== 0 ? flag : updatedTime(b) - updatedTime(a);
      });
    case 'Most relevant':
      return out.sort((a, b) => Number(!!b.isFeatured) - Number(!!a.isFeatured));
    default:
      return out;
  }
}

/**
 * Slider bounds from the real loaded data, never guessed constants. `field`
 * rather than two near-identical functions: nothing aggregated `deposit`
 * before, which is why the deposit filter had bare number inputs that happily
 * accepted a minimum above the maximum.
 */
export function amountBounds(
  listings: Listing[],
  field: 'rent' | 'deposit',
  fallbackMax: number
): { min: number; max: number } {
  const values = listings.map((l) => l[field]).filter((v) => typeof v === 'number' && v > 0);
  if (values.length === 0) return { min: 0, max: fallbackMax };
  const min = Math.min(...values);
  const max = Math.max(...values);
  // A single distinct value gives a zero-width slider you cannot drag.
  return min === max ? { min: Math.max(0, min - 1000), max: max + 1000 } : { min, max };
}

/** Count of non-default filter groups -- drives the Filters button's badge. */
export function activeFilterCount(filters: SearchFilters): number {
  let n = 0;
  if (filters.houseTypes.length > 0) n++;
  if (filters.minRent !== '' || filters.maxRent !== '') n++;
  if (filters.minDeposit !== '' || filters.maxDeposit !== '') n++;
  if (filters.availableNow) n++;
  if (filters.verifiedOnly) n++;
  if (filters.recentlyUpdatedOnly) n++;
  if (filters.amenities.length > 0) n++;
  return n;
}
