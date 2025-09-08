import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NotificationManager } from '@/components/NotificationManager';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Smartphone, Shield } from 'lucide-react';

export default function Settings() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-2xl">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-primary">
          <SettingsIcon className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your BearCave app preferences and notifications
        </p>
      </div>

      {/* Notification Settings */}
      <NotificationManager />

      {/* App Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            App Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Version</span>
              <p className="text-muted-foreground">1.0.0</p>
            </div>
            <div>
              <span className="font-medium">Build</span>
              <p className="text-muted-foreground">PWA</p>
            </div>
            <div>
              <span className="font-medium">Platform</span>
              <p className="text-muted-foreground">Web & Mobile</p>
            </div>
            <div>
              <span className="font-medium">Mode</span>
              <p className="text-muted-foreground">
                {window.matchMedia('(display-mode: standalone)').matches ? 'Installed' : 'Browser'}
              </p>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Shield className="h-4 w-4" />
              <div>
                <p className="text-xs font-medium">Privacy & Security</p>
                <p className="text-xs">
                  Your data is stored locally and synchronized securely. 
                  No personal information is shared without consent.
                </p>
              </div>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => window.location.reload()}
          >
            Refresh App Cache
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}