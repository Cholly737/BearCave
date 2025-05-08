import { useState, useEffect } from 'react';
import { 
  User,
  UserCredential,
  signInWithPopup, 
  signInWithRedirect, 
  signOut as firebaseSignOut, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  getRedirectResult, 
  AuthError
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

// Key for storing guest mode status in local storage
const GUEST_MODE_KEY = 'deepdene_bears_guest_mode';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isGuestMode, setIsGuestMode] = useState<boolean>(localStorage.getItem(GUEST_MODE_KEY) === 'true');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isFirebaseAvailable, setIsFirebaseAvailable] = useState<boolean>(
    // Check if auth has the necessary methods
    !!(auth && typeof auth.onAuthStateChanged === 'function')
  );

  // Initialize auth state
  useEffect(() => {
    // If Firebase isn't available, just set loading to false
    if (!isFirebaseAvailable) {
      setLoading(false);
      return;
    }

    // Handle redirect result if Firebase is available
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          setUser(result.user);
          // Clear guest mode if user logs in with Google
          localStorage.removeItem(GUEST_MODE_KEY);
          setIsGuestMode(false);
        }
      } catch (error) {
        console.error("Redirect error:", error);
        setError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setLoading(false);
      }
    };

    handleRedirectResult();
  }, [isFirebaseAvailable]);

  // Listen for auth state changes
  useEffect(() => {
    // Skip if Firebase isn't available
    if (!isFirebaseAvailable) {
      return () => {};
    }

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        // Clear guest mode if user logs in with Google
        localStorage.removeItem(GUEST_MODE_KEY);
        setIsGuestMode(false);
      } else {
        setUser(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Auth state change error:", error);
      setError(error);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [isFirebaseAvailable]);

  // Sign in with Google (Redirect)
  const signInWithGoogle = async () => {
    if (!isFirebaseAvailable) {
      console.warn("Firebase authentication is not available. Enabling guest mode instead.");
      enableGuestMode();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error("Sign in redirect error:", error);
      setError(error instanceof Error ? error : new Error(String(error)));
      setLoading(false);
      // Fall back to guest mode on error
      enableGuestMode();
    }
  };

  // Sign in with Google (Popup) - alternative method
  const signInWithGooglePopup = async (): Promise<User | null> => {
    if (!isFirebaseAvailable) {
      console.warn("Firebase authentication is not available. Enabling guest mode instead.");
      enableGuestMode();
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      // Clear guest mode if user logs in with Google
      localStorage.removeItem(GUEST_MODE_KEY);
      setIsGuestMode(false);
      setLoading(false);
      return result.user;
    } catch (error) {
      console.error("Sign in popup error:", error);
      setError(error instanceof Error ? error : new Error(String(error)));
      setLoading(false);
      // Fall back to guest mode on error
      enableGuestMode();
      return null;
    }
  };

  // Enable guest mode
  const enableGuestMode = () => {
    localStorage.setItem(GUEST_MODE_KEY, 'true');
    setIsGuestMode(true);
    setLoading(false);
  };

  // Sign out
  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      if (isFirebaseAvailable && user) {
        await firebaseSignOut(auth);
      }
      // Also clear guest mode
      localStorage.removeItem(GUEST_MODE_KEY);
      setIsGuestMode(false);
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
      setError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    signInWithGoogle,
    signInWithGooglePopup,
    enableGuestMode,
    signOut,
    isAuthenticated: !!user || isGuestMode, // Authenticated if user exists or in guest mode
    isFirebaseAvailable,
  };
}
