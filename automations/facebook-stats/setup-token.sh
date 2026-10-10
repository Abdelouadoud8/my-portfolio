#!/bin/bash
# One-off: get the Facebook Page token from FB_USER_TOKEN (in .env.local) and save it for fbstats.
set -euo pipefail
cd "$(dirname "$0")"
source ./neon-api.sh
load_env ../../.env.local
node setup-token.mjs
