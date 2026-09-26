#!/bin/bash
# Bundle and deploy the igstats Neon Function, then wait for it to be live.
# Reads NEON_API_KEY, IGSTATS_RUN_SECRET and STATS_DATABASE_URL from the portfolio's .env.local (never printed).
set -euo pipefail
cd "$(dirname "$0")"
source ./neon-api.sh
load_env ../../.env.local
: "${NEON_API_KEY:?Add NEON_API_KEY to .env.local}"
: "${IGSTATS_RUN_SECRET:?Add IGSTATS_RUN_SECRET to .env.local}"
: "${STATS_DATABASE_URL:?Add STATS_DATABASE_URL (my-portfolio DB connection string) to .env.local}"

npm run -s bundle >/dev/null && npm run -s zip
ENV_JSON=$(node -e 'process.stdout.write(JSON.stringify({ RUN_SECRET: process.env.IGSTATS_RUN_SECRET, STATS_DATABASE_URL: process.env.STATS_DATABASE_URL }))')

echo "deploying..."
curl -sS -X POST "$FUNCTION_API/deployments" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -F "zip=@function.zip" -F "environment=$ENV_JSON" | safe_fields

for i in $(seq 1 40); do
  sleep 5
  RESULT=$(curl -sS "$FUNCTION_API" -H "Authorization: Bearer $NEON_API_KEY" | safe_fields)
  echo "$RESULT"
  case "$RESULT" in *completed*|*failed*) break ;; esac
done
