import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if Firebase configuration is valid
const isFirebaseConfigValid = 
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  firebaseConfig.appId;

// Initialize Firebase app - handle cases where configuration is missing
let app;
try {
  if (isFirebaseConfigValid) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    console.log("Firebase initialized successfully");
  } else {
    console.warn("Firebase configuration is incomplete - using guest mode only");
    // Create a mock app object if Firebase is not configured
    app = {} as any;
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
  app = {} as any;
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = isFirebaseConfigValid ? getAuth(app) : {} as any;

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
// Add scopes for additional permissions
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');

export default app;
