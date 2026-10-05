---
name: iOS minimum compatibility gate
description: The user-impact requirement for ending iOS 14 support.
---

Normally, review active-user distribution by OS version before raising the iOS minimum. Platform-only analytics can count iOS devices but cannot establish how many still run an older OS. The user explicitly approved this iOS 15 change while accepting the unknown iOS 14 impact; do not treat that as a general waiver for future minimum-version increases.

**Why:** Ending older OS support can prevent affected users from installing future releases, and this app's existing telemetry does not capture the OS version.

**How to apply:** Before a future support-floor change, obtain a recent OS-version breakdown from App Store Connect or collect reliable native OS-version telemetry. Update all relevant deployment targets together and verify the TestFlight build on the new minimum OS.
