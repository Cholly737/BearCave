import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
let adminApp: admin.app.App | null = null;

export function initializeFirebaseAdmin() {
  if (adminApp) {
    return adminApp;
  }

  try {
    // Check if we have the required environment variables
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
    
    if (!projectId) {
      console.warn('Firebase Admin SDK not initialized - missing project ID');
      return null;
    }

    // For testing/development, we can use the Application Default Credentials
    // In production, you'd use a service account key file
    adminApp = admin.initializeApp({
      projectId: projectId,
    });

    console.log('Firebase Admin SDK initialized successfully');
    return adminApp;
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    return null;
  }
}

export async function sendTestNotification(tokens: string[], title: string, body: string) {
  try {
    const app = initializeFirebaseAdmin();
    if (!app) {
      throw new Error('Firebase Admin SDK not initialized');
    }

    const messaging = admin.messaging();
    
    // Create notification payload
    const message = {
      notification: {
        title: title,
        body: body,
      },
      data: {
        click_action: 'FCM_PLUGIN_ACTIVITY',
        type: 'test_notification',
        timestamp: new Date().toISOString(),
      },
      tokens: tokens,
    };

    // Send notification to multiple tokens
    const response = await messaging.sendEachForMulticast(message);
    
    console.log('Notification sent successfully:', {
      successCount: response.successCount,
      failureCount: response.failureCount,
      responses: response.responses.map(r => ({ success: r.success, error: r.error?.message }))
    });

    return {
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
      details: response.responses
    };
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}

export { admin };