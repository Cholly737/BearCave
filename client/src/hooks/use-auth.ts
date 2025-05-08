import { useState, useEffect } from 'react';
import { 
  getAuth, 
  signInWithPopup, 
  signInWithRedirect, 
  signOut as firebaseSignOut, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  getRedirectResult 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if we've been redirected from Google login
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // This gives you a Google Access Token
          const credential = GoogleAuthProvider.credentialFromResult(result);
          // The signed-in user info
          setUser(result.user);
        }
      } catch (error) {
        setError(error);
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
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  // Sign in with Google (Popup) - alternative method
  const signInWithGooglePopup = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setLoading(false);
      return result.user;
    } catch (error) {
      setError(error);
      setLoading(false);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      setError(error);
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
