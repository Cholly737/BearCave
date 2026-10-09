---
name: iOS upload diagnosis
description: Diagnose Apple upload failures by stage and distinguish uploader changes from credential problems.
---

Do not assume an App Store Connect app-lookup failure means that previously working API credentials need replacing. Check the exact Apple error, uploader version, and known tool regressions first.

When Apple rejects a bundle because its marketing version matches an already approved release, increase the marketing version; incrementing only the build number is not enough.

Treat TestFlight beta-review submission as a separate stage after upload and processing. An “another build is in review” rejection does not mean the IPA upload failed. Codemagic's overall finished status and generic Publishing step can also succeed while its separate Apple distribution task fails.

**Why:** Apple validates the user-facing version independently of the build number, and newer Xcode upload tooling can also fail at app-ID lookup without any credential change. The workflow follows the latest Xcode, so tooling can change without an app-code change.

**How to apply:** Separate native compilation, archive signing, upload, Apple processing, and beta-review submission when reporting status. Inspect the separate Apple distribution task and its log rather than relying only on the overall build status. For a version rejection, use a new marketing version while retaining the CI-managed build number. For an app-lookup error, check for a tool regression before changing working credentials.
