#!/usr/bin/env bash
set -euo pipefail

cleanup() {
  lsof -ti -a -iTCP:4173 -sTCP:LISTEN | xargs -r kill >/dev/null 2>&1 || true
}

cleanup

npm run smoke
