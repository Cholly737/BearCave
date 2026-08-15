import admin from 'firebase-admin';

let initialized = false;

function initializeFirebaseAdmin() {
  if (initialized) {
    return admin;
  }

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  
  if (!serviceAccountKey) {
    console.warn('FIREBASE_SERVICE_ACCOUNT_KEY not set - push notifications will not work');
    return null;
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    
    initialized = true;
    console.log('Firebase Admin SDK initialized successfully');
    return admin;
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    return null;
  }
}

export async function sendPushNotification(
  token: string,
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<boolean> {
  const firebaseAdmin = initializeFirebaseAdmin();
  
  if (!firebaseAdmin) {
    console.error('Firebase Admin not initialized');
    return false;
  }

  try {
    const message = {
      token,
      notification: {
        title,
        body,
      },
      data: data || {},
      android: {
        notification: {
          sound: 'bearcave_notification',
          channelId: 'bearcave_alerts',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'bearcave_notification.mp3',
          },
        },
      },
      webpush: {
        notification: {
          icon: '/icons/icon-192.png',
          badge: '/icons/icon-72.png',
        },
      },
    };

    await firebaseAdmin.messaging().send(message);
    console.log('Notification sent successfully');
    return true;
  } catch (error: any) {
    if (error.code === 'messaging/registration-token-not-registered') {
      console.log('Token no longer valid, should be removed');
    } else {
      console.error('Error sending notification:', error);
    }
    return false;
  }
}

const STALE_TOKEN_ERRORS = new Set([
  'messaging/registration-token-not-registered',
  'messaging/invalid-registration-token',
  'messaging/invalid-argument',
]);

export async function sendPushNotificationToAll(
  tokens: string[],
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<{ success: number; failure: number; staleTokens: string[] }> {
  const firebaseAdmin = initializeFirebaseAdmin();
  
  if (!firebaseAdmin || tokens.length === 0) {
    return { success: 0, failure: 0, staleTokens: [] };
  }

  try {
    const message = {
      notification: { title, body },
      data: data || {},
      android: {
        notification: {
          sound: 'bearcave_notification',
          channelId: 'bearcave_alerts',
        },
      },
      apns: {
        payload: {
          aps: { sound: 'bearcave_notification.mp3' },
        },
      },
      webpush: {
        notification: {
          icon: '/icons/icon-192.png',
          badge: '/icons/icon-72.png',
        },
      },
    };

    const response = await firebaseAdmin.messaging().sendEachForMulticast({
      tokens,
      ...message,
    });

    // Collect tokens FCM has told us are no longer valid
    const staleTokens: string[] = [];
    response.responses.forEach((resp, idx) => {
      if (!resp.success && resp.error && STALE_TOKEN_ERRORS.has(resp.error.code)) {
        staleTokens.push(tokens[idx]);
      }
    });

    console.log(`Notifications sent: ${response.successCount} success, ${response.failureCount} failed, ${staleTokens.length} stale removed`);
    return { success: response.successCount, failure: response.failureCount, staleTokens };
  } catch (error) {
    console.error('Error sending notifications:', error);
    return { success: 0, failure: tokens.length, staleTokens: [] };
  }
}

export default initializeFirebaseAdmin;
