import { useState, useEffect } from 'react';
import { requestNotificationPermission, onMessageListener, messagingSupported } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

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
    // Check initial permission state
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setState(prev => ({
        ...prev,
        permission: Notification.permission,
        isSupported: messagingSupported
      }));
    }

    // Listen for foreground messages
    if (messagingSupported) {
      onMessageListener()
        .then((payload: any) => {
          console.log('Foreground message received:', payload);
          
          // Show toast notification for foreground messages
          toast({
            title: payload.notification?.title || 'New Notification',
            description: payload.notification?.body || 'You have a new update',
          });
        })
        .catch((error) => {
          console.error('Error setting up message listener:', error);
        });
    }
  }, [toast]);

  const requestPermission = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const token = await requestNotificationPermission();
      
      if (token) {
        setState(prev => ({
          ...prev,
          token,
          permission: 'granted',
          isLoading: false
        }));

        // Store token on server (you'll need to implement this endpoint)
        try {
          const response = await fetch('/api/notifications/subscribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });
          
          if (response.ok) {
            toast({
              title: 'Notifications Enabled',
              description: 'You will now receive push notifications from the Bears Cricket Club.',
            });
          } else {
            console.error('Failed to store FCM token on server');
          }
        } catch (error) {
          console.error('Error storing FCM token:', error);
        }
      } else {
        setState(prev => ({
          ...prev,
          permission: Notification.permission,
          isLoading: false
        }));
        
        if (Notification.permission === 'denied') {
          toast({
            title: 'Notifications Blocked',
            description: 'Please enable notifications in your browser settings to receive updates.',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      
      toast({
        title: 'Error',
        description: 'Failed to enable notifications. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const unsubscribe = async () => {
    if (!state.token) return;

    try {
      // Remove token from server
      const response = await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: state.token }),
      });

      if (response.ok) {
        setState(prev => ({
          ...prev,
          token: null
        }));
        
        toast({
          title: 'Notifications Disabled',
          description: 'You will no longer receive push notifications.',
        });
      }
    } catch (error) {
      console.error('Error unsubscribing from notifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to disable notifications. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return {
    ...state,
    requestPermission,
    unsubscribe,
    canRequestPermission: state.isSupported && state.permission !== 'granted'
  };
}