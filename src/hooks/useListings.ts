import { useState, useEffect, useCallback } from 'react';
import { Listing } from '../types/listing';
import { getApprovedAvailableListings } from '../services/listingService';
import { mapSupabaseListingsToListings } from '../lib/listingMappers';

export function useListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const rows = await getApprovedAvailableListings();
      if (rows) {
        setListings(mapSupabaseListingsToListings(rows));
      } else {
        setListings([]);
        setError('Could not load listings.');
      }
    } catch (err) {
      console.error('Error fetching listings in hook:', err);
      setListings([]);
      setError('Could not load listings.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return {
    listings,
    isLoading,
    error,
    refreshListings: fetchListings
  };
}
