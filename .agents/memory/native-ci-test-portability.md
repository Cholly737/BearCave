---
name: Native CI test portability
description: Why passing Linux plist fixtures do not establish compatibility with Codemagic's macOS tools.
---

Keep plist fixture input compatible with the Python version used by native CI. Prefer byte input across Python versions rather than depending on newer Python's acceptance of strings.

**Why:** Local Python 3.13 accepted a string passed to plistlib.loads, while Codemagic's macOS Python 3.12 rejected that same fixture before native compilation. Passing local binary-plist tests therefore did not establish macOS test readiness.

**How to apply:** Run fixtures on the actual native CI alongside the real signed export. Do not change the build machine's Python merely to make it match Linux when the fixture can use the portable API.
