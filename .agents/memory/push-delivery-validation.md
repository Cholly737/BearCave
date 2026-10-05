---
name: Push delivery validation
description: Distinguish notification send acceptance from actual delivery on the native iOS app.
---

Validate native iOS push on an installed TestFlight build, separately from browser/PWA push. Do not interpret an FCM success count as confirmation that a native device received a notification.

**Why:** Earlier tests returned success for an active browser subscription while the native app still failed to receive notifications. Treating those results as native success concealed a registration problem.

**How to apply:** After native push changes, distinguish the web build checks, Mac-runner compilation, Firebase send acceptance, and user-confirmed delivery on the native app. A local Firebase configuration file does not prove that Firebase has the correct Apple push-provider credentials.

## Targeted device tests

Limit diagnostic sends to a user-confirmed device; do not broadcast a test to discover which subscription belongs to the phone.

**Why:** Existing subscriptions can be reused without a new creation timestamp, so the newest record alone does not establish device identity. A user-controlled opt-out identified the correct subscription and enabled a confirmed native delivery test without notifying other subscribers.

**How to apply:** When device metadata is unavailable, have the user turn notifications off inside the app, identify the single subscription removed from the active set, then have them turn notifications back on. Send only to that reactivated subscription and ask the user to confirm delivery.
