import { useState, useEffect, useCallback } from 'react';
import { Listing } from '../types/listing';
import { getApprovedAvailableListings } from '../services/listingService';
import { mapFirebaseListingsToListings } from '../lib/listingMappers';
import { sampleListings } from '../data/listings';
import { isFirebaseConfigured } from '../lib/firebase';

export function useFirestoreListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'firestore' | 'local_fallback'>('local_fallback');

  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    if (!isFirebaseConfigured) {
      setListings(sampleListings);
      setSource('local_fallback');
      setIsLoading(false);
      return;
    }

    try {
      const fbListings = await getApprovedAvailableListings();
      if (fbListings && fbListings.length > 0) {
        setListings(mapFirebaseListingsToListings(fbListings));
        setSource('firestore');
      } else {
        // Fallback to local if empty or null (null implies error reading)
        setListings(sampleListings);
        setSource('local_fallback');
      }
    } catch (err) {
      console.error('Error fetching listings in hook:', err);
      // Fallback
      setListings(sampleListings);
      setSource('local_fallback');
      setError('Could not load Firestore listings. Showing sample listings.');
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
    source,
    isFirebaseReady: isFirebaseConfigured,
    refreshListings: fetchListings
  };
}
