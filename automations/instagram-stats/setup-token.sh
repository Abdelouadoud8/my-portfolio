#!/bin/bash
# One-off: save the new Instagram token (IG_TOKEN in .env.local) encrypted for igstats.
set -euo pipefail
cd "$(dirname "$0")"
source ./neon-api.sh
load_env ../../.env.local
node setup-token.mjs
