#!/usr/bin/env bash
set -euo pipefail

# Script-only package.json changes do not need a reinstall, but missing tools or
# dependency/lockfile changes do. Never skip validation after a failed install.
setup_state="$(node scripts/post-merge-dependencies.mjs)"
if [[ "$setup_state" == "install" ]]; then
  npm ci --no-audit --no-fund
else
  echo "npm dependencies are present and unchanged; skipping reinstall."
fi

node --test scripts/post-merge-dependencies.test.mjs
npm run check
npm run check:ios
npm run test:ios-minimum
npm run build
