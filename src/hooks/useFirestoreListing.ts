import { useState, useEffect } from 'react';
import { Listing } from '../types/listing';
import { getApprovedListingById } from '../services/listingService';
import { mapFirebaseListingToListing } from '../lib/listingMappers';
import { sampleListings } from '../data/listings';
import { isFirebaseConfigured } from '../lib/firebase';

export function useFirestoreListing(listingId: string | undefined) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'firestore' | 'local_fallback'>('local_fallback');

  useEffect(() => {
    async function fetchListing() {
      if (!listingId) {
        setListing(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      if (!isFirebaseConfigured) {
        const local = sampleListings.find(l => l.id === listingId) || null;
        setListing(local);
        setSource('local_fallback');
        if (!local) setError('Listing not found');
        setIsLoading(false);
        return;
      }

      try {
        const fbListing = await getApprovedListingById(listingId);
        if (fbListing) {
          setListing(mapFirebaseListingToListing(fbListing));
          setSource('firestore');
        } else {
          // Fallback to local
          const local = sampleListings.find(l => l.id === listingId) || null;
          setListing(local);
          setSource('local_fallback');
          if (!local) setError('Listing not found');
        }
      } catch (err) {
        console.error('Error fetching listing in hook:', err);
        // Fallback
        const local = sampleListings.find(l => l.id === listingId) || null;
        setListing(local);
        setSource('local_fallback');
        if (!local) setError('Could not load Firestore listing. Showing sample listings.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchListing();
  }, [listingId]);

  return {
    listing,
    isLoading,
    error,
    source,
    isFirebaseReady: isFirebaseConfigured
  };
}
