const fs = require('fs');
const path = require('path');

// Build script to inject Firebase config into service worker
function injectFirebaseConfig() {
  const swPath = path.join(__dirname, '../client/public/sw.js');
  let swContent = fs.readFileSync(swPath, 'utf8');

  // Get Firebase config from environment variables
  const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY || "missing-api-key",
    authDomain: `${process.env.VITE_FIREBASE_PROJECT_ID || "missing-project"}.firebaseapp.com`,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || "missing-project",
    storageBucket: `${process.env.VITE_FIREBASE_PROJECT_ID || "missing-project"}.appspot.com`,
    appId: process.env.VITE_FIREBASE_APP_ID || "missing-app-id"
  };

  // Replace placeholder values with actual config
  swContent = swContent.replace('"process_will_replace_this"', `"${firebaseConfig.apiKey}"`);
  swContent = swContent.replace('"process_will_replace_this"', `"${firebaseConfig.authDomain}"`);
  swContent = swContent.replace('"process_will_replace_this"', `"${firebaseConfig.projectId}"`);
  swContent = swContent.replace('"process_will_replace_this"', `"${firebaseConfig.storageBucket}"`);
  swContent = swContent.replace('"process_will_replace_this"', `"${firebaseConfig.appId}"`);

  // Write back the updated service worker
  fs.writeFileSync(swPath, swContent, 'utf8');
  console.log('Firebase configuration injected into service worker');
}

// Run if called directly
if (require.main === module) {
  injectFirebaseConfig();
}

module.exports = { injectFirebaseConfig };