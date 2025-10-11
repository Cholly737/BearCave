import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.deepdenebears.bearcave',
  appName: 'BearCave',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    // For local development, comment out the url
    // For production builds, use your published Replit URL
    // url: 'https://674d7369-9ad2-4cb5-a960-b5a0828e489e-00-1er9eiaoyyxej.picard.replit.dev',
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
