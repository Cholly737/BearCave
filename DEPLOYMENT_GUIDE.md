# 📱 BearCave App - Deployment Guide

## Deploy to iOS & Android App Stores from Windows

This guide shows you how to build and publish your BearCave app using Codemagic (cloud build service) - **no Mac required!**

---

## 🎯 What You'll Accomplish

- ✅ Build iOS app for Apple App Store (from Windows!)
- ✅ Build Android app for Google Play Store
- ✅ Automated builds with every code push
- ✅ Direct publishing to TestFlight & App Stores

---

## 📋 Prerequisites

### Required Accounts

1. **Apple Developer** ($99/year)
   - Sign up: https://developer.apple.com
   - Needed for iOS app publishing

2. **Google Play Console** ($25 one-time)
   - Sign up: https://play.google.com/console
   - Needed for Android app publishing

3. **Codemagic** (Free tier: 500 min/month)
   - Sign up: https://codemagic.io
   - Cloud build service for iOS/Android

4. **Git Repository** (Free)
   - GitHub, GitLab, or Bitbucket
   - Push your code here

---

## 🚀 Step-by-Step Setup

### Step 1: Publish Your Replit App

**Why?** Mobile apps need a stable URL to connect to your backend.

1. In Replit, click **"Publish"** button (top right)
2. Follow the prompts to publish your app
3. You'll get a stable URL like: `https://bearcave.your-username.replit.app`
4. **Save this URL** - you'll need it next

### Step 2: Update Capacitor Config

Edit `capacitor.config.ts`:

```typescript
server: {
  androidScheme: 'https',
  url: 'https://bearcave.your-username.replit.app', // Your published URL
},
```

### Step 3: Push Code to Git

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Ready for mobile deployment"

# Push to GitHub
git remote add origin https://github.com/yourusername/bearcave.git
git push -u origin main
```

---

## 🍎 iOS Setup (Apple App Store)

### A. Create App in App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Click **"Apps"** → **"+"** → **"New App"**
3. Fill in details:
   - Platform: **iOS**
   - Name: **BearCave**
   - Primary Language: **English**
   - Bundle ID: **com.deepdenebears.bearcave** (select existing)
   - SKU: **bearcave**
4. Click **"Create"**
5. **Copy the App ID** (numbers only) - you'll need it for Codemagic

### B. Generate App Store Connect API Key

1. In App Store Connect, go to **Users and Access** → **Integrations** → **App Store Connect API**
2. Click **"+"** to generate a new key
3. Name it: **"Codemagic"**
4. Access: **App Manager**
5. Click **"Generate"**
6. **Download the .p8 file** - you'll upload this to Codemagic
7. **Save the Issuer ID and Key ID** - you'll need these

---

## 🤖 Android Setup (Google Play Store)

### A. Create App in Google Play Console

1. Go to https://play.google.com/console
2. Click **"Create app"**
3. Fill in details:
   - App name: **BearCave**
   - Default language: **English**
   - App type: **App**
   - Category: **Sports**
4. Accept declarations and click **"Create app"**

### B. Create Service Account (for automated uploads)

1. In Google Play Console → **Setup** → **API access**
2. Link to Google Cloud project (or create new)
3. Create service account
4. Grant **"Service Account User"** role
5. Download JSON key file
6. **Save this file** - you'll upload to Codemagic

### C. Generate Android Keystore

You need a keystore to sign your Android app. Run this on Windows:

```bash
# Install Java if not installed
# Then run:
keytool -genkey -v -keystore bearcave-release.keystore -alias bearcave -keyalg RSA -keysize 2048 -validity 10000

# Answer prompts:
# - Enter keystore password (SAVE THIS!)
# - Re-enter password
# - First/Last name: Deepdene Bears
# - Organization: Deepdene Bears Cricket Club
# - City: Melbourne
# - State: Victoria
# - Country: AU
# - Confirm: yes
# - Enter key password (use same as keystore)
```

**IMPORTANT:** Save the keystore file and password securely! You'll need them for all future updates.

---

## ☁️ Codemagic Setup

### A. Connect Repository

1. Go to https://codemagic.io
2. Click **"Add application"**
3. Select your Git provider (GitHub/GitLab)
4. Choose **"bearcave"** repository
5. Select project type: **Ionic Capacitor**

### B. Configure iOS Code Signing

1. In Codemagic app → **Settings** → **Integrations**
2. Click **"App Store Connect API"**
3. Click **"Add key"**
4. Upload:
   - .p8 key file (from Step B above)
   - Issuer ID
   - Key ID
5. Name it: **"codemagic_api_key"**
6. Save

### C. Configure Android Signing

1. In Codemagic app → **Settings** → **Code signing**
2. Click **"Android"** → **"Add keystore"**
3. Upload `bearcave-release.keystore`
4. Enter:
   - Keystore password
   - Key alias: **bearcave**
   - Key password
5. Name reference: **bearcave_keystore**
6. Save

### D. Add Environment Variables

1. In Codemagic app → **Environment variables** (global)
2. Add these variables:

| Variable Name | Value | Secure? |
|--------------|-------|---------|
| `APP_STORE_APP_ID` | Your App ID from App Store Connect | No |
| `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` | Paste contents of Google service account JSON | Yes ✓ |

### E. Update Build Config

Edit `codemagic.yaml` line 44:
```yaml
sed -i 's|url: .*|url: "https://bearcave.your-username.replit.app",|g' capacitor.config.ts
```
Replace with your actual published Replit URL.

---

## 🏗️ Trigger Your First Build

### Option 1: Automatic Build (Recommended)
```bash
git add .
git commit -m "Deploy to app stores"
git push
```
Codemagic automatically detects the push and starts building!

### Option 2: Manual Build
1. Go to Codemagic dashboard
2. Select your app
3. Click **"Start new build"**
4. Choose workflow: **ios-build** or **android-build**
5. Click **"Start new build"**

---

## 📦 What Happens During Build

### iOS Build (~15 minutes):
1. ✅ Installs dependencies
2. ✅ Builds web assets (`npm run build`)
3. ✅ Syncs to iOS with Capacitor
4. ✅ Installs CocoaPods
5. ✅ Signs with your certificates
6. ✅ Builds IPA file
7. ✅ Uploads to TestFlight automatically

### Android Build (~10 minutes):
1. ✅ Installs dependencies
2. ✅ Builds web assets
3. ✅ Syncs to Android with Capacitor
4. ✅ Signs with your keystore
5. ✅ Builds AAB file
6. ✅ Uploads to Google Play (internal testing)

---

## 🧪 Testing Your App

### iOS (TestFlight)
1. Open TestFlight app on iPhone
2. Sign in with Apple ID (same as developer account)
3. Your app appears automatically
4. Tap **"Install"** → **"Test"**

### Android (Internal Testing)
1. Go to Google Play Console
2. **Testing** → **Internal testing**
3. Add testers (emails)
4. Testers get email with download link

---

## 🚀 Publishing to Production

### iOS App Store

1. In App Store Connect, go to your app
2. Fill in all required info:
   - Screenshots (iPhone 6.7" required)
   - Description
   - Keywords
   - Support URL
   - Privacy Policy URL
3. Select the build from TestFlight
4. Click **"Submit for Review"**
5. Wait 1-3 days for review

### Google Play Store

1. In Google Play Console
2. Complete **Store presence** sections:
   - App icon
   - Screenshots
   - Description
3. **Release** → **Production** → **Create new release**
4. Select the AAB from internal testing
5. Click **"Review release"** → **"Start rollout"**
6. Wait 1-3 days for review

---

## 🔄 Updating Your App

Whenever you make changes:

```bash
# Make your code changes
git add .
git commit -m "Update: [describe changes]"
git push
```

Codemagic automatically:
1. Builds new version
2. Increments build number
3. Uploads to TestFlight/Google Play

Then just promote the build to production in each console!

---

## 💰 Cost Breakdown

- **Apple Developer**: $99/year
- **Google Play**: $25 one-time
- **Codemagic Free Tier**: 500 macOS min/month (≈25 iOS builds)
  - Paid plans: $20-50/month if you need more builds
- **Replit**: Already covered by your plan

**Total to start: ~$125**

---

## 📞 Support & Resources

- **Codemagic Docs**: https://docs.codemagic.io/yaml-quick-start/building-an-ionic-app/
- **Capacitor Docs**: https://capacitorjs.com/docs
- **Apple Developer**: https://developer.apple.com/support
- **Google Play Help**: https://support.google.com/googleplay/android-developer

---

## ✅ Checklist

Before you start:
- [ ] Apple Developer account ($99)
- [ ] Google Play Console account ($25)
- [ ] Codemagic account (free)
- [ ] Published Replit app with stable URL
- [ ] Code pushed to Git repository

iOS Setup:
- [ ] App created in App Store Connect
- [ ] App Store Connect API key generated
- [ ] API key uploaded to Codemagic

Android Setup:
- [ ] App created in Google Play Console
- [ ] Service account JSON downloaded
- [ ] Android keystore generated
- [ ] Keystore uploaded to Codemagic

Codemagic:
- [ ] Repository connected
- [ ] Environment variables added
- [ ] Build triggered successfully

Testing:
- [ ] iOS build tested on TestFlight
- [ ] Android build tested via internal testing

Production:
- [ ] Store listings completed (screenshots, descriptions)
- [ ] Submitted for review
- [ ] Apps live on stores! 🎉

---

## 🎉 You're Ready!

Follow this guide step by step, and you'll have your BearCave app on both app stores - all from Windows, no Mac needed!

Good luck! 🐻🏏
