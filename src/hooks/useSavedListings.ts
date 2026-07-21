import { useState, useEffect, useCallback, useMemo } from 'react';
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
  const { firebaseUser, isFirebaseReady } = useAuth();
  const [savedListings, setSavedListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<SavedSource>('not_configured');

  const fetchSavedListings = useCallback(async () => {
    if (!isFirebaseReady) return;
    
    setIsLoading(true);
    setError(null);

    if (!isFirebaseConfigured) {
      setSavedListings(initialSavedListings);
      setSource('not_configured');
      setIsLoading(false);
      return;
    }

    if (!firebaseUser) {
      setSavedListings([]); // We use an empty list for signed out users, prototype fallback will be managed per view
      setSource('signed_out');
      setIsLoading(false);
      return;
    }

    try {
      const fbSaved = await getUserSavedListings(firebaseUser.uid);
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
      setSavedListings([]);
      setError('Error loading saved listings.');
    } finally {
      setIsLoading(false);
    }
  }, [firebaseUser, isFirebaseReady]);

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
    
    if (!firebaseUser) return false;

    // Optimistic update
    const tempListing = isFirebaseListing ? mapFirebaseSavedListingToListing(listing) : listing;
    setSavedListings(prev => [tempListing, ...prev.filter(l => l.id !== listing.id)]);

    const success = await saveListingForUser(firebaseUser.uid, listing, isFirebaseListing);
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
    if (!firebaseUser) return false;

    // Optimistic update
    const previous = [...savedListings];
    setSavedListings(prev => prev.filter(l => l.id !== listingId));

    const success = await removeSavedListingForUser(firebaseUser.uid, listingId);
    if (!success) {
      // Revert optimistic update
      setSavedListings(previous);
      setError('Failed to remove saved listing');
      return false;
    }
    return true;
  };

  const toggleSavedListing = async (listing: any, isFirebaseListing = false) => {
    if (!isFirebaseConfigured || !firebaseUser) return false;
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
