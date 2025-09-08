import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Bell, BellOff, Shield, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  requestNotificationPermission, 
  getMessagingSupported,
  onMessageListener 
} from '@/lib/firebase';

export function NotificationManager() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check support and current permission
    const checkStatus = () => {
      setIsSupported(getMessagingSupported() && 'Notification' in window);
      if ('Notification' in window) {
        setPermission(Notification.permission);
        setNotificationsEnabled(Notification.permission === 'granted');
      }
    };

    checkStatus();

    // Listen for foreground messages
    if (isSupported) {
      onMessageListener()
        .then((payload: any) => {
          console.log('Received foreground message:', payload);
          toast({
            title: payload.notification?.title || 'BearCave Update',
            description: payload.notification?.body || 'You have a new update',
          });
        })
        .catch(err => {
          console.log('Failed to listen for messages:', err);
        });
    }
  }, [isSupported, toast]);

  const handleEnableNotifications = async () => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Push notifications are not supported in this browser.",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = await requestNotificationPermission();
      
      if (token) {
        setFcmToken(token);
        setNotificationsEnabled(true);
        setPermission('granted');
        
        // Store token for backend use (you might want to send this to your backend)
        localStorage.setItem('fcm-token', token);
        
        toast({
          title: "Notifications Enabled! 🎉",
          description: "You'll now receive updates about fixtures, events, and club news.",
        });
        
        // Send token to backend for future use
        try {
          await fetch('/api/notifications/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
          });
        } catch (error) {
          console.log('Failed to register token with backend:', error);
        }
      } else {
        toast({
          title: "Permission Denied",
          description: "Please allow notifications to receive club updates.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      toast({
        title: "Setup Failed",
        description: "Failed to enable notifications. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDisableNotifications = () => {
    setNotificationsEnabled(false);
    localStorage.removeItem('fcm-token');
    setFcmToken(null);
    
    toast({
      title: "Notifications Disabled",
      description: "You won't receive push notifications anymore.",
    });
  };

  const handleToggle = (enabled: boolean) => {
    if (enabled) {
      handleEnableNotifications();
    } else {
      handleDisableNotifications();
    }
  };

  if (!isSupported) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BellOff className="h-5 w-5 text-muted-foreground" />
            Push Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span className="text-sm">
              Push notifications are not supported in this browser or environment.
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Push Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Enable notifications</p>
            <p className="text-xs text-muted-foreground">
              Get updates about fixtures, events, and club news
            </p>
          </div>
          <Switch
            checked={notificationsEnabled}
            onCheckedChange={handleToggle}
            disabled={permission === 'denied'}
          />
        </div>

        {permission === 'denied' && (
          <div className="p-3 bg-destructive/10 rounded-md">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-destructive mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-destructive">Notifications Blocked</p>
                <p className="text-muted-foreground text-xs mt-1">
                  To enable notifications, click the 🔒 icon in your browser's address bar 
                  and allow notifications for this site.
                </p>
              </div>
            </div>
          </div>
        )}

        {notificationsEnabled && (
          <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-md">
            <div className="flex items-start gap-2">
              <Smartphone className="h-4 w-4 text-green-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-green-700 dark:text-green-400">
                  Notifications Active ✅
                </p>
                <p className="text-green-600 dark:text-green-300 text-xs mt-1">
                  You'll receive updates about club activities and important announcements.
                </p>
              </div>
            </div>
          </div>
        )}

        {permission === 'default' && (
          <Button onClick={handleEnableNotifications} className="w-full">
            <Bell className="h-4 w-4 mr-2" />
            Enable Push Notifications
          </Button>
        )}
      </CardContent>
    </Card>
  );
}