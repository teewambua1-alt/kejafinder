import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getUserSavedSearches,
  createSavedSearch,
  deleteSavedSearch,
  type SupabaseSavedSearch
} from '../services/savedSearchesService';
import { SearchFilters, defaultSearchFilters } from '../components/SearchFilterSheet';
import { SortOption } from '../components/SortDropdown';

export interface SavedSearch {
  id: string;
  label: string;
  query: string;
  filters: SearchFilters;
  sort: SortOption;
  createdAt: string;
}

function mapRow(row: SupabaseSavedSearch): SavedSearch {
  return {
    id: row.id,
    label: row.label,
    query: row.query,
    filters: { ...defaultSearchFilters, ...(row.filters as Partial<SearchFilters>) },
    sort: (row.sort as SortOption) || 'Most relevant',
    createdAt: row.created_at,
  };
}

export function useSavedSearches() {
  const { user } = useAuth();
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Guards against a slower, stale fetch (e.g. signing out mid-request)
  // overwriting a newer one's result after both resolve out of order.
  const requestIdRef = useRef(0);

  const fetchSavedSearches = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    const isStale = () => requestId !== requestIdRef.current;

    setIsLoading(true);
    setError(null);

    if (!user) {
      if (isStale()) return;
      setSavedSearches([]);
      setIsLoading(false);
      return;
    }

    try {
      const rows = await getUserSavedSearches(user.id);
      if (isStale()) return;
      if (rows) {
        setSavedSearches(rows.map(mapRow));
      } else {
        setSavedSearches([]);
        setError('Could not load saved searches.');
      }
    } catch (err) {
      console.error('Error in useSavedSearches fetch:', err);
      if (isStale()) return;
      setSavedSearches([]);
      setError('Error loading saved searches.');
    } finally {
      if (!isStale()) setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSavedSearches();
  }, [fetchSavedSearches]);

  const saveSearch = async (label: string, query: string, filters: SearchFilters, sort: SortOption): Promise<boolean> => {
    if (!user) return false;

    const created = await createSavedSearch({ userId: user.id, label, query, filters, sort });
    if (!created) {
      setError('Failed to save search');
      return false;
    }
    setSavedSearches((prev) => [mapRow(created), ...prev]);
    return true;
  };

  const removeSearch = async (id: string): Promise<boolean> => {
    if (!user) return false;

    const previous = [...savedSearches];
    setSavedSearches((prev) => prev.filter((s) => s.id !== id));

    const success = await deleteSavedSearch(user.id, id);
    if (!success) {
      setSavedSearches(previous);
      setError('Failed to delete saved search');
      return false;
    }
    return true;
  };

  return {
    savedSearches,
    isLoading,
    error,
    saveSearch,
    removeSearch,
    refreshSavedSearches: fetchSavedSearches
  };
}
