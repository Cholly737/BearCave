import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "bearcave-55ce4.firebaseapp.com",
  projectId: "bearcave-55ce4",
  storageBucket: "bearcave-55ce4.appspot.com",
  messagingSenderId: "267658947052",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

let messaging: ReturnType<typeof getMessaging> | null = null;
let swRegistration: ServiceWorkerRegistration | null = null;

async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.log('Service workers not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    swRegistration = registration;
    await navigator.serviceWorker.ready;
    return registration;
  } catch (error) {
    console.error('Service worker registration failed:', error);
    return null;
  }
}

export async function initializeMessaging() {
  const supported = await isSupported();
  if (supported) {
    messaging = getMessaging(app);
    await registerServiceWorker();
    return messaging;
  }
  return null;
}

export async function requestNotificationPermission(): Promise<string | null> {
  try {
    const supported = await isSupported();
    if (!supported) {
      console.log('Firebase messaging not supported in this browser');
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    if (!messaging) {
      messaging = getMessaging(app);
    }

    if (!swRegistration) {
      swRegistration = await registerServiceWorker();
    }
    
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    
    const tokenOptions: { vapidKey: string; serviceWorkerRegistration?: ServiceWorkerRegistration } = {
      vapidKey
    };
    
    if (swRegistration) {
      tokenOptions.serviceWorkerRegistration = swRegistration;
    }
    
    const token = await getToken(messaging, tokenOptions);
    
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
}

export function onForegroundMessage(callback: (payload: any) => void) {
  if (!messaging) {
    console.log('Messaging not initialized');
    return () => {};
  }
  
  return onMessage(messaging, (payload) => {
    console.log('Foreground message received:', payload);
    callback(payload);
  });
}

export { app, messaging, firebaseConfig };
