import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

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
let app: FirebaseApp | null = null;
try {
  if (isFirebaseConfigValid) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    console.log("Firebase initialized successfully");
  } else {
    console.warn("Firebase configuration is incomplete - using guest mode only");
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = (isFirebaseConfigValid && app) ? getAuth(app) : {} as any;

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
// Add scopes for additional permissions
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');

// Initialize Firebase Messaging
export let messaging: any;
let messagingSupported = false;

async function initializeMessaging() {
  try {
    if (isFirebaseConfigValid && app && typeof window !== 'undefined') {
      messagingSupported = await isSupported();
      console.log("FCM isSupported check result:", messagingSupported);
      if (messagingSupported) {
        messaging = getMessaging(app);
        console.log("Firebase Messaging initialized successfully");
      } else {
        console.log("Firebase Messaging not supported in this environment");
      }
    } else {
      console.log("FCM initialization skipped - conditions not met:", {
        isFirebaseConfigValid,
        hasApp: !!app,
        hasWindow: typeof window !== 'undefined'
      });
    }
  } catch (error) {
    console.error("Error initializing Firebase Messaging:", error);
  }
}

// Initialize messaging when the module loads
initializeMessaging();

// Function to request notification permission and get FCM token
export async function requestNotificationPermission() {
  if (!messagingSupported || !messaging) {
    console.log("Firebase Messaging not available");
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      
      // Get FCM token
      // Note: VAPID key should be added to environment variables
      // Generate one in Firebase Console > Project Settings > Cloud Messaging > Web Push certificates
      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
      
      const tokenOptions = vapidKey ? { vapidKey } : {};
      const token = await getToken(messaging, tokenOptions);
      
      if (token) {
        console.log('FCM Token:', token);
        return token;
      } else {
        console.log('No registration token available.');
        return null;
      }
    } else {
      console.log('Unable to get permission to notify.');
      return null;
    }
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
}

// Function to handle foreground messages
export function onMessageListener() {
  if (!messagingSupported || !messaging) {
    return Promise.reject('Firebase Messaging not available');
  }
  
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Message received in foreground: ", payload);
      resolve(payload);
    });
  });
}

// Function to get messaging support status
export function getMessagingSupported(): boolean {
  return messagingSupported;
}

// Function to wait for messaging initialization
export async function waitForMessagingInitialization(): Promise<boolean> {
  // If already initialized, return immediately
  if (messagingSupported || !isFirebaseConfigValid || !app) {
    return messagingSupported;
  }
  
  // Wait a bit for initialization to complete
  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      if (messagingSupported) {
        clearInterval(checkInterval);
        resolve(true);
      }
    }, 100);
    
    // Timeout after 5 seconds
    setTimeout(() => {
      clearInterval(checkInterval);
      resolve(false);
    }, 5000);
  });
}

export { messagingSupported };
export default app;
