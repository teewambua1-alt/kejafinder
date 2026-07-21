import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { firebaseAuth, firebaseDb, isFirebaseConfigured } from '../lib/firebase';
import { getFirebaseErrorMessage } from '../lib/firebase-errors';
import { COLLECTIONS, userDocPath } from '../lib/firebaseCollections';
import { FirebaseUserProfile, FirebaseUserRole } from '../types/firebase';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  profile: FirebaseUserProfile | null;
  isAuthLoading: boolean;
  isFirebaseReady: boolean;
  authError: string | null;
  signUpWithEmailPassword: (params: SignUpParams) => Promise<void>;
  signInWithEmailPassword: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  clearAuthError: () => void;
}

export interface SignUpParams {
  email: string;
  password?: string; // Optional if we consider handling phone signup later, but required for Email Auth
  fullName: string;
  phone: string;
  role: FirebaseUserRole;
  county?: string;
  town?: string;
  estate?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<FirebaseUserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !firebaseAuth || !firebaseDb) {
      setIsAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      setFirebaseUser(user);
      
      if (user) {
        try {
          const profileRef = doc(firebaseDb, userDocPath(user.uid));
          const profileSnap = await getDoc(profileRef);
          
          if (profileSnap.exists()) {
            setProfile(profileSnap.data() as FirebaseUserProfile);
          } else {
            // Minimal fallback profile if somehow it's not created
            setProfile({
              id: user.uid,
              email: user.email || '',
              fullName: user.displayName || user.email?.split('@')[0] || 'Unknown User',
              phone: '',
              role: 'tenant', // Default to tenant
              isPhoneVerified: false,
              isIdVerified: false,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          }
        } catch (error) {
          console.error("Error loading profile:", error);
          setAuthError("Failed to load user profile.");
        }
      } else {
        setProfile(null);
      }
      
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUpWithEmailPassword = async (params: SignUpParams) => {
    if (!isFirebaseConfigured || !firebaseAuth || !firebaseDb) {
      setAuthError("Firebase is not configured for sign up.");
      return;
    }

    if (!params.password) {
      setAuthError("Password is required.");
      return;
    }

    if (params.role === 'admin') {
      setAuthError("Admin role cannot be created via public sign up.");
      return;
    }

    setIsAuthLoading(true);
    setAuthError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, params.email, params.password);
      const user = userCredential.user;

      const profileRef = doc(firebaseDb, userDocPath(user.uid));
      const newProfile: Partial<FirebaseUserProfile> = {
        id: user.uid,
        email: params.email,
        fullName: params.fullName,
        phone: params.phone,
        role: params.role,
        county: params.county || null,
        town: params.town || null,
        estate: params.estate || null,
        isPhoneVerified: false,
        isIdVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(profileRef, newProfile);
    } catch (error) {
      setAuthError(getFirebaseErrorMessage(error));
      throw error; // Re-throw to inform caller 
    } finally {
      setIsAuthLoading(false);
    }
  };

  const signInWithEmailPassword = async (email: string, password: string) => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      setAuthError("Firebase is not configured for sign in.");
      return;
    }

    setIsAuthLoading(true);
    setAuthError(null);

    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error) {
      setAuthError(getFirebaseErrorMessage(error));
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const signOutUser = async () => {
    if (!isFirebaseConfigured || !firebaseAuth) return;
    
    setIsAuthLoading(true);
    try {
      await signOut(firebaseAuth);
    } catch (error) {
      console.error("Sign out error", error);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  return (
    <AuthContext.Provider value={{
      firebaseUser,
      profile,
      isAuthLoading,
      isFirebaseReady: isFirebaseConfigured,
      authError,
      signUpWithEmailPassword,
      signInWithEmailPassword,
      signOutUser,
      clearAuthError
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
