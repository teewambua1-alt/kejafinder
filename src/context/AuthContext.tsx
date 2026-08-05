import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase/client';
import { getSupabaseErrorMessage } from '../lib/supabase/errors';
import type { Database } from '../types/database';
import { AuthRole } from '../types/auth';

export type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: SupabaseUser | null;
  profile: Profile | null;
  isAuthLoading: boolean;
  authError: string | null;
  signUp: (params: SignUpParams) => Promise<{ requiresEmailConfirmation: boolean }>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearAuthError: () => void;
}

export interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role: AuthRole;
  county?: string;
  town?: string;
  estate?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error loading profile:', error);
      setAuthError('Failed to load user profile.');
      return;
    }

    setProfile(data);
  };

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (cancelled) return;
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      setIsAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (cancelled) return;
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (params: SignUpParams) => {
    if (params.role === ('admin' as AuthRole)) {
      setAuthError('Admin role cannot be created via public sign up.');
      return { requiresEmailConfirmation: false };
    }

    setIsAuthLoading(true);
    setAuthError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          data: {
            full_name: params.fullName,
            phone: params.phone,
            role: params.role,
            county: params.county,
            town: params.town,
            estate: params.estate,
          },
        },
      });

      if (error) throw error;

      // The handle_new_user trigger creates the profile row in the same
      // transaction as the auth.users insert, so the row itself always
      // exists by the time this resolves. But if the project requires email
      // confirmation, signUp() returns no session — fetching the profile
      // under an anonymous request would just be rejected by RLS (profiles
      // are owner/admin-only), producing a confusing "failed to load
      // profile" error for a signup that actually succeeded. Only fetch
      // when a session was actually established.
      if (data.session && data.user) {
        await fetchProfile(data.user.id);
        return { requiresEmailConfirmation: false };
      }

      return { requiresEmailConfirmation: true };
    } catch (error) {
      setAuthError(getSupabaseErrorMessage(error));
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsAuthLoading(true);
    setAuthError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      setAuthError(getSupabaseErrorMessage(error));
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const signOut = async () => {
    setIsAuthLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error', error);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isAuthLoading,
      authError,
      signUp,
      signIn,
      signOut,
      clearAuthError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
