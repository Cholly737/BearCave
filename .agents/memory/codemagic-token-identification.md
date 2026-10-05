---
name: Codemagic token identification
description: Distinguish Codemagic REST access from Apple signing and publishing credentials when requesting build access.
---

An Apple Developer Portal integration key named “Codemagic CI/CD” is an Apple credential, not the Codemagic REST API token. Leave the existing Apple integration unchanged when obtaining Codemagic API access.

**Why:** The project owner's Codemagic screenshot showed that label inside the Apple Developer Portal integration dialog, making it easy to confuse the two providers.

**How to apply:** Identify the provider shown in the dialog, not merely the key's display name. Codemagic documentation describes Account settings → API token, while its support answer also describes Teams → Personal Account → Integrations → Codemagic API → Show. If neither matches the current UI, request a credential-redacted screenshot rather than repeatedly asserting a menu path.
