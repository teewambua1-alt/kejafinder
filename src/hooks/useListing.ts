import { useState, useEffect } from 'react';
import { Listing } from '../types/listing';
import { getApprovedListingById } from '../services/listingService';
import { mapSupabaseListingToListing } from '../lib/listingMappers';

export function useListing(listingId: string | undefined) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Guards against rapid listing-to-listing navigation: if listingId
    // changes again before this fetch resolves, its result must not
    // overwrite the newer listing's data.
    let cancelled = false;

    async function fetchListing() {
      if (!listingId) {
        if (!cancelled) {
          setListing(null);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const row = await getApprovedListingById(listingId);
        if (cancelled) return;
        if (row) {
          setListing(mapSupabaseListingToListing(row));
        } else {
          setListing(null);
          setError('Listing not found');
        }
      } catch (err) {
        console.error('Error fetching listing in hook:', err);
        if (cancelled) return;
        setListing(null);
        setError('Could not load listing.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchListing();

    return () => {
      cancelled = true;
    };
  }, [listingId]);

  return {
    listing,
    isLoading,
    error,
  };
}
