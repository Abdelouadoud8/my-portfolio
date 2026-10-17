#!/bin/bash
# Bundle and deploy the fbstats Neon Function, then wait for it to be live.
# Reads NEON_API_KEY, FBSTATS_RUN_SECRET, STATS_AUTOMATION_DATABASE_URL, TOKEN_ENCRYPTION_KEY, SMTP_EMAIL, SMTP_PASSWORD
# from .env.local (never printed).
set -euo pipefail
cd "$(dirname "$0")"
source ./neon-api.sh
load_env ../../.env.local
: "${NEON_API_KEY:?Add NEON_API_KEY to .env.local}"
: "${FBSTATS_RUN_SECRET:?Add FBSTATS_RUN_SECRET to .env.local}"
: "${STATS_AUTOMATION_DATABASE_URL:?Add STATS_AUTOMATION_DATABASE_URL (least-privilege stats_automation role) to .env.local}"
: "${TOKEN_ENCRYPTION_KEY:?Add TOKEN_ENCRYPTION_KEY to .env.local}"
: "${SMTP_EMAIL:?Add SMTP_EMAIL to .env.local}" "${SMTP_PASSWORD:?Add SMTP_PASSWORD to .env.local}"

npm run -s bundle >/dev/null && npm run -s zip
ENV_JSON=$(node -e 'process.stdout.write(JSON.stringify({ RUN_SECRET: process.env.FBSTATS_RUN_SECRET, STATS_DATABASE_URL: process.env.STATS_AUTOMATION_DATABASE_URL, TOKEN_ENCRYPTION_KEY: process.env.TOKEN_ENCRYPTION_KEY, SMTP_EMAIL: process.env.SMTP_EMAIL, SMTP_PASSWORD: process.env.SMTP_PASSWORD }))')

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
