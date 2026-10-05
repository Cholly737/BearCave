---
name: iOS upload diagnosis
description: Diagnose Apple upload failures by stage and distinguish uploader changes from credential problems.
---

Do not assume an App Store Connect app-lookup failure means that previously working API credentials need replacing. Check the exact Apple error, uploader version, and known tool regressions first.

**Why:** The project's earlier upload failure was a marketing-version conflict, not authentication. A subsequent upload used a newer Xcode uploader and failed during app-ID lookup after native compilation succeeded. The workflow follows the latest Xcode, so Apple tooling can change without an app-code change.

**How to apply:** Separate native compilation, archive signing, upload, and Apple processing when reporting status. Apply the smallest supported upload configuration change first, and only investigate credential replacement when the resulting errors indicate an authorization problem.
