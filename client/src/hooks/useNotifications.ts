import { useState, useEffect } from 'react';
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
    async function initializeNotifications() {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        console.log('Notifications hook initializing...');
        console.log('Current permission:', Notification.permission);
        
        setState(prev => ({
          ...prev,
          permission: Notification.permission,
          isSupported: false
        }));
      } else {
        console.log('Window or Notification API not available');
      }
    }

    initializeNotifications();
  }, [toast]);

  const requestPermission = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    toast({
      title: 'Not Available',
      description: 'Push notifications are not configured for this app.',
      variant: 'destructive',
    });
    
    setState(prev => ({ ...prev, isLoading: false }));
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