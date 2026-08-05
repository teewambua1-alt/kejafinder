import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { isFirebaseConfigured } from '../lib/firebase';
import { 
  getUserSavedListings, 
  saveListingForUser, 
  removeSavedListingForUser 
} from '../services/savedListingsService';
import { mapFirebaseSavedListingToListing } from '../lib/listingMappers';
import { Listing } from '../types/listing';
import { initialSavedListings } from '../data/savedListings';

export type SavedSource = 'firestore' | 'local_fallback' | 'signed_out' | 'not_configured';

export function useSavedListings() {
  const { user } = useAuth();
  const [savedListings, setSavedListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<SavedSource>('not_configured');
  // Tracks the most recently started fetch so a slower, stale request (e.g.
  // from signing in then out again quickly) can't overwrite a newer one's
  // result after both resolve out of order.
  const requestIdRef = useRef(0);

  const fetchSavedListings = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    const isStale = () => requestId !== requestIdRef.current;

    setIsLoading(true);
    setError(null);

    if (!isFirebaseConfigured) {
      if (isStale()) return;
      setSavedListings(initialSavedListings);
      setSource('not_configured');
      setIsLoading(false);
      return;
    }

    if (!user) {
      if (isStale()) return;
      setSavedListings([]); // We use an empty list for signed out users, prototype fallback will be managed per view
      setSource('signed_out');
      setIsLoading(false);
      return;
    }

    try {
      const fbSaved = await getUserSavedListings(user.id);
      if (isStale()) return;
      if (fbSaved) {
        setSavedListings(fbSaved.map(mapFirebaseSavedListingToListing));
        setSource('firestore');
      } else {
        setSavedListings([]);
        setSource('firestore');
        setError('Could not load saved listings.');
      }
    } catch (err) {
      console.error('Error in useSavedListings fetch:', err);
      if (isStale()) return;
      setSavedListings([]);
      setError('Error loading saved listings.');
    } finally {
      if (!isStale()) setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSavedListings();
  }, [fetchSavedListings]);

  const savedListingIds = useMemo(() => new Set(savedListings.map(l => l.id)), [savedListings]);

  const saveListing = async (listing: any, isFirebaseListing = false) => {
    if (!isFirebaseConfigured) {
      // Prototype local update if they want to build logic
      // Usually components handle this locally
      return false;
    }
    
    if (!user) return false;

    // Optimistic update
    const tempListing = isFirebaseListing ? mapFirebaseSavedListingToListing(listing) : listing;
    setSavedListings(prev => [tempListing, ...prev.filter(l => l.id !== listing.id)]);

    const success = await saveListingForUser(user.id, listing, isFirebaseListing);
    if (!success) {
      // Revert optimistic update
      setSavedListings(prev => prev.filter(l => l.id !== listing.id));
      setError('Failed to save listing');
      return false;
    }
    return true;
  };

  const unsaveListing = async (listingId: string) => {
    if (!isFirebaseConfigured) return false;
    if (!user) return false;

    // Optimistic update
    const previous = [...savedListings];
    setSavedListings(prev => prev.filter(l => l.id !== listingId));

    const success = await removeSavedListingForUser(user.id, listingId);
    if (!success) {
      // Revert optimistic update
      setSavedListings(previous);
      setError('Failed to remove saved listing');
      return false;
    }
    return true;
  };

  const toggleSavedListing = async (listing: any, isFirebaseListing = false) => {
    if (!isFirebaseConfigured || !user) return false;
    const isSaved = savedListingIds.has(listing.id);
    if (isSaved) {
      return await unsaveListing(listing.id);
    } else {
      return await saveListing(listing, isFirebaseListing);
    }
  };

  const isSaved = useCallback((listingId: string) => savedListingIds.has(listingId), [savedListingIds]);

  return {
    savedListings,
    savedListingIds,
    isLoading,
    error,
    source,
    saveListing,
    unsaveListing,
    toggleSavedListing,
    isSaved,
    refreshSavedListings: fetchSavedListings
  };
}
