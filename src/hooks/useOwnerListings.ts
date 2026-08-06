import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOwnerListings, deleteOwnerListing, setListingAvailability, type OwnerListingRow } from '../services/ownerListingsService';

export interface OwnerListingsStats {
  total: number;
  pendingReview: number;
  liveNow: number;
  totalViews: number;
  totalContacts: number;
}

// enabled defaults to true; pass false for accounts that can never own
// listings (e.g. a tenant) to skip the query entirely rather than firing an
// RLS-empty fetch on every Profile page visit.
export function useOwnerListings(enabled = true) {
  const { user } = useAuth();
  const [listings, setListings] = useState<OwnerListingRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = useCallback(async () => {
    if (!user || !enabled) {
      setListings([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const rows = await getOwnerListings(user.id);
    if (rows) {
      setListings(rows);
    } else {
      setListings([]);
      setError('Could not load your listings.');
    }
    setIsLoading(false);
  }, [user, enabled]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const stats: OwnerListingsStats = useMemo(() => {
    return listings.reduce(
      (acc, l) => ({
        total: acc.total + 1,
        pendingReview: acc.pendingReview + (l.moderation_status === 'pending_review' ? 1 : 0),
        liveNow: acc.liveNow + (l.moderation_status === 'approved' && l.availability_status === 'available' ? 1 : 0),
        totalViews: acc.totalViews + (l.views_count || 0),
        totalContacts: acc.totalContacts + (l.call_clicks_count || 0) + (l.whatsapp_clicks_count || 0),
      }),
      { total: 0, pendingReview: 0, liveNow: 0, totalViews: 0, totalContacts: 0 }
    );
  }, [listings]);

  const deleteListing = async (listingId: string): Promise<boolean> => {
    const previous = [...listings];
    setListings((prev) => prev.filter((l) => l.id !== listingId));

    const success = await deleteOwnerListing(listingId);
    if (!success) {
      setListings(previous);
      setError('Failed to delete listing.');
      return false;
    }
    return true;
  };

  const setAvailability = async (listingId: string, available: boolean): Promise<boolean> => {
    const previous = [...listings];
    setListings((prev) =>
      prev.map((l) =>
        l.id === listingId
          ? { ...l, availability_status: available ? 'available' : 'taken', is_available: available }
          : l
      )
    );

    const success = await setListingAvailability(listingId, available);
    if (!success) {
      setListings(previous);
      setError('Failed to update availability.');
      return false;
    }
    return true;
  };

  return {
    listings,
    stats,
    isLoading,
    error,
    deleteListing,
    setAvailability,
    refreshListings: fetchListings,
  };
}
