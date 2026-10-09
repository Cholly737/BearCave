---
name: Post-merge npm setup
description: Avoid unnecessary dependency reinstalls and handle package-firewall blocks safely.
---

Skip a full npm reinstall when a task merge does not change install-affecting configuration or the lockfile. Adding ordinary npm check/test commands is not a dependency change. If an install is required and the package firewall blocks a locked dependency, do not bypass the block or claim setup succeeded.

Lockfiles generated inside Replit can contain internal-only package-download URLs. Before sending an approved lockfile to external CI, ensure its download URLs are portable while retaining the approved package versions and integrity hashes. This is not permission to install a firewall-blocked version.

**Why:** Reinstalling an unchanged lockfile can trigger a security-policy failure even when the merge only changes native or application code. Repeated install attempts do not fix a stale lockfile and can leave the current environment without its installed packages. Codemagic cannot resolve Replit's internal package host, and npm can report an install error yet exit successfully with build executables missing.

**How to apply:** Compare install-affecting configuration with the merge's first parent rather than treating every package.json edit as a dependency change. Check for missing installed tools before skipping installation, and run validation even when reinstallation is unnecessary. For dependency changes, identify the parent package and update to a compatible safe version; if the firewall still blocks installation, report the blocker instead of suppressing the failure.

Do not treat a still-running development process as proof that local dependencies are intact.

**Why:** An already-running server can retain loaded modules in memory even after a failed npm reinstall has removed its on-disk tools. A successful no-op setup can conceal the fact that the next server start will fail.

**How to apply:** After recovering from a failed install, verify a fresh application workflow start and its preview, not just the old process's status.
