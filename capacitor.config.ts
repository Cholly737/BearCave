import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.deepdenebears.bearcave',
  appName: 'BearCave',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https'
  }
};

export default config;
