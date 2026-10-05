---
name: Push delivery validation
description: Distinguish notification send acceptance from actual delivery on the native iOS app.
---

Validate native iOS push on an installed TestFlight build, separately from browser/PWA push. Do not interpret an FCM success count as confirmation that a native device received a notification.

**Why:** Earlier tests returned success for an active browser subscription while the native app still failed to receive notifications. Treating those results as native success concealed a registration problem.

**How to apply:** After native push changes, distinguish the web build checks, Mac-runner compilation, Firebase send acceptance, and user-confirmed delivery on the native app. A local Firebase configuration file does not prove that Firebase has the correct Apple push-provider credentials.
