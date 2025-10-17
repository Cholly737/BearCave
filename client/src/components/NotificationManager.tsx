import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Bell, BellOff, Shield, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function NotificationManager() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, [toast]);

  const handleEnableNotifications = async () => {
    toast({
      title: "Not Available",
      description: "Push notifications are not configured for this app.",
      variant: "destructive",
    });
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