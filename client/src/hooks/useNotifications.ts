import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { requestNotificationPermission, onForegroundMessage, initializeMessaging } from '@/lib/firebase';
import { isSupported } from 'firebase/messaging';

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

  useEffect(() => {
    async function initializeNotifications() {
      if (typeof window === 'undefined' || !('Notification' in window)) {
        console.log('Notifications not available in this environment');
        return;
      }

      try {
        const supported = await isSupported();
        const savedToken = localStorage.getItem('fcmToken');
        
        setState(prev => ({
          ...prev,
          permission: Notification.permission,
          isSupported: supported,
          token: savedToken
        }));

        if (supported) {
          await initializeMessaging();
          
          onForegroundMessage((payload) => {
            toast({
              title: payload.notification?.title || 'BearCave',
              description: payload.notification?.body || 'You have a new notification',
            });
          });
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    }

    initializeNotifications();
  }, [toast]);

  const requestPermission = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const supported = await isSupported();
      
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
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: 'Error',
        description: 'Failed to enable notifications. Please try again.',
        variant: 'destructive',
      });
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [toast]);

  const unsubscribe = useCallback(async () => {
    if (!state.token) return;

    try {
      const response = await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: state.token }),
      });

      if (response.ok) {
        localStorage.removeItem('fcmToken');
        setState(prev => ({ ...prev, token: null }));

        toast({
          title: 'Notifications Disabled',
          description: 'You will no longer receive push notifications.',
        });
      }
    } catch (error) {
      console.error('Error unsubscribing:', error);
      toast({
        title: 'Error',
        description: 'Failed to disable notifications. Please try again.',
        variant: 'destructive',
      });
    }
  }, [state.token, toast]);

  return {
    ...state,
    requestPermission,
    unsubscribe,
    canRequestPermission: state.isSupported && state.permission !== 'granted'
  };
}
