import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.deepdenebears.bearcave',
  appName: 'BearCave',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    // For live updates, point to your Replit app URL
    url: 'https://[your-repl-name].[your-username].replit.app',
    cleartext: true
  },
  ios: {
    scheme: 'BearCave'
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
