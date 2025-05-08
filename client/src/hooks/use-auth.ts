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

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | null>(null);

  // Check if we've been redirected from Google login
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          setUser(result.user);
        }
      } catch (error) {
        console.error("Redirect error:", error);
        setError(error as AuthError);
      } finally {
        setLoading(false);
      }
    };

    handleRedirectResult();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Sign in with Google (Redirect)
  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error("Sign in redirect error:", error);
      setError(error as AuthError);
      setLoading(false);
    }
  };

  // Sign in with Google (Popup) - alternative method
  const signInWithGooglePopup = async (): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      setLoading(false);
      return result.user;
    } catch (error) {
      console.error("Sign in popup error:", error);
      setError(error as AuthError);
      setLoading(false);
      return null;
    }
  };

  // Sign out
  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
      setError(error as AuthError);
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
    signOut,
    isAuthenticated: !!user,
  };
}
