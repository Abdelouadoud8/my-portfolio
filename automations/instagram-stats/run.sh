#!/bin/bash
# Manually run igstats. Default is a dry run (computes the row, saves nothing).
#   ./run.sh            dry run for today (Paris)
#   ./run.sh --save     compute and save today (overwritten by the 23:59 run)
set -euo pipefail
cd "$(dirname "$0")"
source ./neon-api.sh
load_env ../../.env.local
: "${NEON_API_KEY:?}" "${IGSTATS_RUN_SECRET:?}"
URL=$(curl -sS "$FUNCTION_API" -H "Authorization: Bearer $NEON_API_KEY" |
  node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const f=(function find(o){if(!o||typeof o!=="object")return;if(o.invocation_url)return o.invocation_url;for(const v of Object.values(o)){const r=find(v);if(r)return r}})(JSON.parse(s));if(!f){console.error("function not found");process.exit(1)}console.log(f)})')
QUERY="?dryRun=1"; [ "${1:-}" = "--save" ] && QUERY=""
curl -sS -X POST "${URL%/}/run$QUERY" -H "Authorization: Bearer $IGSTATS_RUN_SECRET" -w '\nHTTP %{http_code}\n'
