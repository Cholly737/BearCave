import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { requestNotificationPermission, onForegroundMessage, initializeMessaging } from '@/lib/firebase';
import { isSupported } from 'firebase/messaging';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import type { PluginListenerHandle } from '@capacitor/core';
import {
  isFCMToken,
  NATIVE_PUSH_DISABLED,
  PUSH_STATE_CHANGED,
  registerNativePushToken,
  subscribeNativePushToken,
} from '@/lib/native-push';
import { trackEvent } from '@/hooks/useAnalytics';

interface NotificationState {
  permission: NotificationPermission;
  token: string | null;
  isSupported: boolean;
  isLoading: boolean;
}

export function useNotifications() {
  const [state, setState] = useState<NotificationState>({
    permission: 'default',
    token: null,
    isSupported: false,
    isLoading: false
  });
  const { toast } = useToast();

  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    let disposed = false;
    const nativeListeners: PluginListenerHandle[] = [];
    let stopForegroundMessages: (() => void) | undefined;
    const syncTokenState = () => {
      const token = localStorage.getItem('fcmToken');
      if (!disposed) setState(prev => ({
        ...prev,
        token: token && (!isNative || isFCMToken(token)) ? token : null,
      }));
    };
    window.addEventListener(PUSH_STATE_CHANGED, syncTokenState);

    async function keepListener(listener: Promise<PluginListenerHandle>) {
      const handle = await listener;
      if (disposed) await handle.remove();
      else nativeListeners.push(handle);
    }

    async function initializeNotifications() {
      if (isNative) {
        try {
          const permStatus = await PushNotifications.checkPermissions();
          const savedToken = localStorage.getItem('fcmToken');
          
          setState(prev => ({
            ...prev,
            permission: permStatus.receive === 'granted' ? 'granted' : 
                       permStatus.receive === 'denied' ? 'denied' : 'default',
            isSupported: true,
            token: savedToken && isFCMToken(savedToken) ? savedToken : null
          }));

          await keepListener(PushNotifications.addListener('pushNotificationReceived', notification => {
            trackEvent('notification_received', undefined, {
              title: notification.title,
              body: notification.body,
            });
            toast({
              title: notification.title || 'BearCave',
              description: notification.body || 'You have a new notification',
            });
          }));

          await keepListener(PushNotifications.addListener('pushNotificationActionPerformed', action => {
            trackEvent('notification_open', undefined, {
              title: action.notification?.title,
              body: action.notification?.body,
            });
          }));

          // Keep rotated FCM tokens in sync, but never undo an explicit opt-out.
          await keepListener(PushNotifications.addListener('registration', ({ value }) => {
            if (disposed || permStatus.receive !== 'granted' ||
                localStorage.getItem(NATIVE_PUSH_DISABLED) === 'true' || !isFCMToken(value)) return;
            if (value !== localStorage.getItem('fcmToken')) {
              void subscribeNativePushToken(value).catch(error => {
                console.error('Failed to refresh native push subscription:', error);
              });
            }
          }));

          // Existing permission is not proof of a working server subscription.
          // Re-register on launch to migrate old APNs tokens and refresh FCM.
          if (!disposed && permStatus.receive === 'granted' &&
              localStorage.getItem(NATIVE_PUSH_DISABLED) !== 'true') {
            try {
              const token = await registerNativePushToken();
              if (!disposed && localStorage.getItem(NATIVE_PUSH_DISABLED) !== 'true') {
                await subscribeNativePushToken(token);
              }
            } catch (error) {
              console.error('Native push registration needs attention:', error);
              if (!disposed) setState(prev => ({ ...prev, token: null }));
            }
          }
        } catch (error) {
          console.error('Error initializing native notifications:', error);
          setState(prev => ({ ...prev, isSupported: false }));
        }
      } else {
        if (typeof window === 'undefined' || !('Notification' in window)) {
          console.log('Notifications not available in this environment');
          return;
        }

        try {
          // isSupported() can return false on iOS Safari PWA even when push works.
          // Fall back to manual API checks so the prompt still shows up.
          let supported = await isSupported();
          if (!supported) {
            supported = (
              'serviceWorker' in navigator &&
              'PushManager' in window &&
              'Notification' in window
            );
          }
          const savedToken = localStorage.getItem('fcmToken');
          
          setState(prev => ({
            ...prev,
            permission: Notification.permission,
            isSupported: supported,
            token: savedToken
          }));

          if (supported) {
            await initializeMessaging();
            
            stopForegroundMessages = onForegroundMessage((payload) => {
              const title = payload.notification?.title || payload.data?.title;
              const body = payload.notification?.body || payload.data?.body;
              trackEvent('notification_received', undefined, {
                title,
                body,
              });
              toast({
                title: title || 'BearCave',
                description: body || 'You have a new notification',
              });
            });
          }
        } catch (error) {
          console.error('Error initializing notifications:', error);
        }
      }
    }

    initializeNotifications();
    return () => {
      disposed = true;
      window.removeEventListener(PUSH_STATE_CHANGED, syncTokenState);
      stopForegroundMessages?.();
      nativeListeners.forEach(handle => { void handle.remove(); });
    };
  }, [toast, isNative]);

  const requestPermission = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      if (isNative) {
        const permStatus = await PushNotifications.requestPermissions();
        
        if (permStatus.receive === 'granted') {
          localStorage.removeItem(NATIVE_PUSH_DISABLED);
          const token = await registerNativePushToken();
          await subscribeNativePushToken(token);
          setState(prev => ({
            ...prev,
            permission: 'granted',
            token,
            isLoading: false
          }));

          toast({
            title: 'Notifications Enabled',
            description: 'You will receive updates about fixtures and events.',
          });
        } else {
          setState(prev => ({
            ...prev,
            permission: permStatus.receive === 'denied' ? 'denied' : 'default',
            isLoading: false
          }));
        }
      } else {
        let supported = await isSupported();
        if (!supported) {
          supported = (
            'serviceWorker' in navigator &&
            'PushManager' in window &&
            'Notification' in window
          );
        }

        if (!supported) {
          toast({
            title: 'Not Supported',
            description: 'Push notifications are not supported in this browser.',
            variant: 'destructive',
          });
          setState(prev => ({ ...prev, isLoading: false }));
          return;
        }

        const token = await requestNotificationPermission();

        if (token) {
          localStorage.setItem('fcmToken', token);
          
          const response = await fetch('/api/notifications/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          });

          if (response.ok) {
            setState(prev => ({
              ...prev,
              permission: 'granted',
              token,
              isLoading: false
            }));

            toast({
              title: 'Notifications Enabled',
              description: 'You will receive updates about fixtures and events.',
            });
          } else {
            throw new Error('Failed to register token');
          }
        } else {
          setState(prev => ({
            ...prev,
            permission: Notification.permission,
            isLoading: false
          }));

          if (Notification.permission === 'denied') {
            toast({
              title: 'Permission Denied',
              description: 'Please enable notifications in your browser settings.',
              variant: 'destructive',
            });
          }
        }
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to enable notifications. Please try again.',
        variant: 'destructive',
      });
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [toast, isNative]);

  const unsubscribe = useCallback(async () => {
    if (!state.token) return;

    const wasDisabled = localStorage.getItem(NATIVE_PUSH_DISABLED);
    if (isNative) localStorage.setItem(NATIVE_PUSH_DISABLED, 'true');
    try {
      const response = await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: state.token }),
      });

      if (response.ok) {
        localStorage.removeItem('fcmToken');
        setState(prev => ({ ...prev, token: null }));
        window.dispatchEvent(new Event(PUSH_STATE_CHANGED));

        toast({
          title: 'Notifications Disabled',
          description: 'You will no longer receive push notifications.',
        });
      } else {
        throw new Error('Failed to disable the notification subscription');
      }
    } catch (error) {
      if (isNative && wasDisabled !== 'true') localStorage.removeItem(NATIVE_PUSH_DISABLED);
      console.error('Error unsubscribing:', error);
      toast({
        title: 'Error',
        description: 'Failed to disable notifications. Please try again.',
        variant: 'destructive',
      });
    }
  }, [state.token, toast, isNative]);

  return {
    ...state,
    requestPermission,
    unsubscribe,
    canRequestPermission: state.isSupported && state.permission !== 'denied' &&
      (state.permission !== 'granted' || !state.token)
  };
}
