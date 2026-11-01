#!/bin/bash
# Bundle and deploy the trainbot Neon Function, then wait for it to be live.
# Reads TRAINING_BOT_DATABASE_URL, TELEGRAM_WEBHOOK_SECRET (setup-db.mjs writes both), TELEGRAM_BOT_TOKEN,
# TELEGRAM_ADMIN_CHAT_ID (telegram-setup.mjs admin) and PAYMENT_DETAILS from .env.local (never printed).
# Redeploy after changing any of them.
set -euo pipefail
cd "$(dirname "$0")"
source ./neon-api.sh
load_env ../../.env.local
: "${NEON_API_KEY:?Add NEON_API_KEY to .env.local}"
: "${TRAINING_BOT_DATABASE_URL:?Run node setup-db.mjs first}"
: "${TELEGRAM_WEBHOOK_SECRET:?Run node setup-db.mjs first}"
for name in TELEGRAM_BOT_TOKEN TELEGRAM_ADMIN_CHAT_ID PAYMENT_DETAILS; do
  [ -n "${!name:-}" ] || echo "warning: $name is not set in .env.local (the bot can't work without it)"
done

npm run -s bundle >/dev/null && npm run -s zip
ENV_JSON=$(node -e 'const e = process.env; process.stdout.write(JSON.stringify({
  BOT_DATABASE_URL: e.TRAINING_BOT_DATABASE_URL, TELEGRAM_WEBHOOK_SECRET: e.TELEGRAM_WEBHOOK_SECRET,
  TELEGRAM_BOT_TOKEN: e.TELEGRAM_BOT_TOKEN ?? "", TELEGRAM_ADMIN_CHAT_ID: e.TELEGRAM_ADMIN_CHAT_ID ?? "",
  PAYMENT_DETAILS: e.PAYMENT_DETAILS ?? "" }))')

echo "deploying..."
curl -sS -X POST "$FUNCTION_API/deployments" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -F "zip=@function.zip" -F "runtime=nodejs24" -F "environment=$ENV_JSON" | safe_fields

for i in $(seq 1 40); do
  sleep 5
  RESULT=$(curl -sS "$FUNCTION_API" -H "Authorization: Bearer $NEON_API_KEY" | safe_fields)
  echo "$RESULT"
  case "$RESULT" in *completed*|*failed*) break ;; esac
done
