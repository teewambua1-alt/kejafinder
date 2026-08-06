import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getAdminStats,
  getPendingListings,
  moderateListing,
  getOpenReports,
  getPendingVerificationRequests,
  getRecentAdminActions,
  type AdminStats,
  type AdminListingRow,
  type ListingReportRow,
  type VerificationRequestRow,
  type AdminActionWithActor,
} from '../services/adminService';

// enabled defaults to true; pass false when the signed-in user isn't a
// confirmed admin yet, to skip 5 queries that would just come back
// RLS-empty/meaningless for a non-admin.
export function useAdminDashboard(enabled = true) {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingListings, setPendingListings] = useState<AdminListingRow[]>([]);
  const [openReports, setOpenReports] = useState<ListingReportRow[]>([]);
  const [pendingVerifications, setPendingVerifications] = useState<VerificationRequestRow[]>([]);
  const [recentActions, setRecentActions] = useState<AdminActionWithActor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user || !enabled) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const [statsRes, pendingRes, reportsRes, verificationsRes, actionsRes] = await Promise.all([
      getAdminStats(),
      getPendingListings(),
      getOpenReports(),
      getPendingVerificationRequests(),
      getRecentAdminActions(),
    ]);

    if (!statsRes || !pendingRes || !reportsRes || !verificationsRes || !actionsRes) {
      setError('Could not load some admin dashboard data.');
    }

    setStats(statsRes);
    setPendingListings(pendingRes || []);
    setOpenReports(reportsRes || []);
    setPendingVerifications(verificationsRes || []);
    setRecentActions(actionsRes || []);
    setIsLoading(false);
  }, [user, enabled]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const approveListing = async (listingId: string): Promise<boolean> => {
    const previous = [...pendingListings];
    setPendingListings((prev) => prev.filter((l) => l.id !== listingId));

    const success = await moderateListing(listingId, 'approve');
    if (!success) {
      setPendingListings(previous);
      setError('Failed to approve listing.');
      return false;
    }
    refresh();
    return true;
  };

  const rejectListing = async (listingId: string, notes?: string): Promise<boolean> => {
    const previous = [...pendingListings];
    setPendingListings((prev) => prev.filter((l) => l.id !== listingId));

    const success = await moderateListing(listingId, 'reject', notes);
    if (!success) {
      setPendingListings(previous);
      setError('Failed to reject listing.');
      return false;
    }
    refresh();
    return true;
  };

  return {
    stats,
    pendingListings,
    openReports,
    pendingVerifications,
    recentActions,
    isLoading,
    error,
    approveListing,
    rejectListing,
    refresh,
  };
}
