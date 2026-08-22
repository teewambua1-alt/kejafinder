import { useEffect, useState } from 'react';
import { Listing } from '../types/listing';
import { searchApprovedListings } from '../services/listingService';
import { mapSupabaseListingsToListings } from '../lib/listingMappers';

/**
 * Reaches listings the client-side pipeline cannot see.
 *
 * `getApprovedAvailableListings()` fetches the 60 most-recently-updated rows,
 * and every filter on the search page then runs over that array. So row 61
 * onward was simply unfindable, no matter what you typed. Meanwhile
 * `searchApprovedListings` already ran `.textSearch('search_vector', ...)`
 * against a real GIN-indexed tsvector -- and nothing in the app ever passed
 * `locationQuery`, so that code path had never executed.
 *
 * This is deliberately **additive**: the caller unions these rows into its
 * source set rather than replacing it. That matters for correctness, not just
 * safety. The filter sheet's live "Show N homes" count is computed by the same
 * client predicate over the same array; if a typed query swapped the source for
 * a server-narrowed set, the count and the result would drift apart for every
 * filter Postgres cannot express here (deposit range, amenity AND-match,
 * recently-updated). Unioning keeps one source of truth for display and uses
 * the server purely to widen it.
 *
 * Failure is non-fatal by design: a null response leaves the caller with
 * exactly today's behaviour.
 *
 * Before this goes to production, confirm the RLS policy on `listings` covers
 * anon SELECT for approved+available rows the same way the existing default
 * query relies on -- the predicates here are identical, so it should, but a
 * text-search path that returns rows the browse path would not is a leak.
 */
export function useServerSearch(query: string, debounceMs = 350) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setListings([]);
      setIsSearching(false);
      return;
    }

    let cancelled = false;
    setIsSearching(true);

    const timer = setTimeout(async () => {
      try {
        const rows = await searchApprovedListings({ locationQuery: trimmed, pageSize: 60 });
        if (cancelled) return;
        setListings(rows ? mapSupabaseListingsToListings(rows) : []);
      } catch (err) {
        if (!cancelled) {
          console.error('Server search failed; falling back to loaded listings:', err);
          setListings([]);
        }
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    }, debounceMs);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      setIsSearching(false);
    };
  }, [query, debounceMs]);

  return { listings, isSearching };
}

/** Union by id, keeping `primary`'s ordering and its version of a row. */
export function unionById(primary: Listing[], extra: Listing[]): Listing[] {
  if (extra.length === 0) return primary;
  const seen = new Set(primary.map((l) => l.id));
  const additions = extra.filter((l) => !seen.has(l.id));
  return additions.length === 0 ? primary : [...primary, ...additions];
}

export default useServerSearch;
