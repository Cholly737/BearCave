#!/usr/bin/env bash
set -euo pipefail

# The web workflow needs no extra setup for native-only task merges. Reinstall,
# type-check, and rebuild only when a merge changes the npm dependency manifests.
if git diff --quiet HEAD^1 HEAD -- package.json package-lock.json npm-shrinkwrap.json; then
  echo "No npm dependency changes in this merge; no post-merge setup is required."
  exit 0
fi

npm ci --no-audit --no-fund
npm run check
npm run build
