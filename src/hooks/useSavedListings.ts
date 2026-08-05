import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getUserSavedListings,
  saveListingForUser,
  removeSavedListingForUser
} from '../services/savedListingsService';
import { mapSupabaseListingToListing } from '../lib/listingMappers';
import { Listing } from '../types/listing';

export type SavedSource = 'supabase' | 'signed_out';

export function useSavedListings() {
  const { user } = useAuth();
  const [savedListings, setSavedListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<SavedSource>('signed_out');
  // Tracks the most recently started fetch so a slower, stale request (e.g.
  // from signing in then out again quickly) can't overwrite a newer one's
  // result after both resolve out of order.
  const requestIdRef = useRef(0);

  const fetchSavedListings = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    const isStale = () => requestId !== requestIdRef.current;

    setIsLoading(true);
    setError(null);

    if (!user) {
      if (isStale()) return;
      setSavedListings([]);
      setSource('signed_out');
      setIsLoading(false);
      return;
    }

    try {
      const rows = await getUserSavedListings(user.id);
      if (isStale()) return;
      if (rows) {
        setSavedListings(rows.map(mapSupabaseListingToListing));
        setSource('supabase');
      } else {
        setSavedListings([]);
        setSource('supabase');
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

  // Loosely typed on purpose: callers pass either the app's Listing type or
  // the separate, pre-existing KejaListing type (see ListingDetailsPage /
  // SimilarHomeCard) — unifying those two listing shapes is a separate,
  // larger cleanup, not something this function should force.
  const saveListing = async (listing: any) => {
    if (!user) return false;

    // Optimistic update
    setSavedListings(prev => [listing as Listing, ...prev.filter(l => l.id !== listing.id)]);

    const success = await saveListingForUser(user.id, listing.id);
    if (!success) {
      // Revert optimistic update
      setSavedListings(prev => prev.filter(l => l.id !== listing.id));
      setError('Failed to save listing');
      return false;
    }
    return true;
  };

  const unsaveListing = async (listingId: string) => {
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

  const toggleSavedListing = async (listing: any) => {
    if (!user) return false;
    const isSaved = savedListingIds.has(listing.id);
    if (isSaved) {
      return await unsaveListing(listing.id);
    } else {
      return await saveListing(listing);
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
