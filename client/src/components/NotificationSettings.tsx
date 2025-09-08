import { useState } from 'react';
import { Bell, BellOff, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useNotifications } from '@/hooks/useNotifications';
import { Badge } from '@/components/ui/badge';

export function NotificationSettings() {
  const {
    permission,
    token,
    isSupported,
    isLoading,
    canRequestPermission,
    requestPermission,
    unsubscribe
  } = useNotifications();

  const [showDetails, setShowDetails] = useState(false);

  const getPermissionStatus = () => {
    switch (permission) {
      case 'granted':
        return { text: 'Enabled', variant: 'default' as const, icon: Bell };
      case 'denied':
        return { text: 'Blocked', variant: 'destructive' as const, icon: BellOff };
      default:
        return { text: 'Not Set', variant: 'secondary' as const, icon: Settings };
    }
  };

  const status = getPermissionStatus();
  const StatusIcon = status.icon;

  const handleToggleNotifications = async () => {
    if (permission === 'granted' && token) {
      await unsubscribe();
    } else if (canRequestPermission) {
      await requestPermission();
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Push notifications are not supported in your browser.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <StatusIcon className="h-5 w-5" />
          Push Notifications
        </CardTitle>
        <CardDescription>
          Get notified about club updates, match results, and important announcements.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="notifications">Enable notifications</Label>
            <div className="flex items-center gap-2">
              <Badge variant={status.variant}>{status.text}</Badge>
              {permission === 'denied' && (
                <p className="text-xs text-muted-foreground">
                  Please enable in browser settings
                </p>
              )}
            </div>
          </div>
          <Switch
            id="notifications"
            checked={permission === 'granted' && !!token}
            onCheckedChange={handleToggleNotifications}
            disabled={isLoading || permission === 'denied'}
          />
        </div>

        {permission === 'default' && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 Enable notifications to get real-time updates about:
            </p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• Match results and fixtures</li>
              <li>• Club events and announcements</li>
              <li>• Important club news</li>
            </ul>
          </div>
        )}

        {permission === 'denied' && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              To enable notifications:
            </p>
            <ol className="text-xs text-orange-700 mt-1 space-y-1">
              <li>1. Click the lock icon in your browser's address bar</li>
              <li>2. Set "Notifications" to "Allow"</li>
              <li>3. Refresh this page</li>
            </ol>
          </div>
        )}

        {(permission === 'granted' && token) && (
          <>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 flex items-center gap-2">
                ✅ You're all set! You'll receive notifications from the Bears Cricket Club.
              </p>
            </div>
            
            <div className="pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs text-muted-foreground"
              >
                {showDetails ? 'Hide' : 'Show'} technical details
              </Button>
              
              {showDetails && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-xs font-mono text-gray-600">
                  <p>Token: {token.substring(0, 20)}...</p>
                  <p>Status: Active</p>
                </div>
              )}
            </div>
          </>
        )}

        <div className="flex gap-2">
          {canRequestPermission && (
            <Button
              onClick={requestPermission}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Setting up...' : 'Enable Notifications'}
            </Button>
          )}
          
          {permission === 'granted' && token && (
            <Button
              variant="outline"
              onClick={unsubscribe}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Updating...' : 'Disable Notifications'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}