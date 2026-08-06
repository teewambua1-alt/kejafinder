import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import { useAuth } from '../context/AuthContext';

// admin-ness lives in a separate `admins` table, never in profiles.role (see
// supabase/migrations/20260805000001_schema.sql) -- is_admin() is the only
// way to check it, since admins has no client-readable SELECT policy for
// non-admins.
export function useIsAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (!user) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    supabase.rpc('is_admin').then(({ data, error }) => {
      if (cancelled) return;
      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(!!data);
      }
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [user]);

  return { isAdmin, isLoading };
}
