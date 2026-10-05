---
name: Post-merge npm setup
description: Avoid unnecessary dependency reinstalls and handle package-firewall blocks safely.
---

Skip a full npm reinstall when a task merge does not change the dependency manifests or lockfile. If an install is required and the package firewall blocks a locked dependency, do not bypass the block or claim setup succeeded.

**Why:** Reinstalling an unchanged lockfile can trigger a security-policy failure even when the merge only changes native or application code. Repeated install attempts do not fix a stale lockfile and can leave the current environment without its installed packages.

**How to apply:** Compare the merged commit with its first parent for dependency-file changes. Skip `npm ci` for code-only merges. For dependency changes, identify the parent package and update to a compatible safe version; if the firewall still blocks installation, report the blocker instead of suppressing the failure.
