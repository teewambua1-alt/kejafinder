import { useState, useEffect, useCallback } from 'react';
import { Listing } from '../types/listing';
import { getFeaturedListings } from '../services/listingService';
import { mapSupabaseListingsToListings } from '../lib/listingMappers';

export function useFeaturedListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const rows = await getFeaturedListings();
      if (rows) {
        setListings(mapSupabaseListingsToListings(rows));
      } else {
        setListings([]);
        setError('Could not load featured listings.');
      }
    } catch (err) {
      console.error('Error fetching featured listings in hook:', err);
      setListings([]);
      setError('Could not load featured listings.');
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
  };
}
