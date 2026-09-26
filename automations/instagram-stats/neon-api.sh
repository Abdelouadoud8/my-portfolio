# Shared settings for deploy.sh / run.sh. The function runs in the Frankfurt project
# "portfolio-automations" (Neon Functions aren't available in the London region of the stats DB).
PROJECT_ID="young-wildflower-73641515"
BRANCH_ID="br-steep-resonance-b1bwn48v"
SLUG="igstats"
FUNCTION_API="https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches/$BRANCH_ID/functions/$SLUG"

# Print only safe fields (status, ids, url, messages) from a Neon API JSON response; never environment values
safe_fields() {
  node -e '
    let s = ""; process.stdin.on("data", d => s += d).on("end", () => {
      let j; try { j = JSON.parse(s); } catch { console.log("unparsable response"); process.exit(1); }
      const out = {};
      (function walk(o, path) {
        if (!o || typeof o !== "object") return;
        for (const [k, v] of Object.entries(o)) {
          if (k === "environment") continue;
          if (["status", "state", "message", "code", "invocation_url", "id", "deployment_id", "error"].includes(k) && typeof v !== "object")
            out[path + k] = v;
          else walk(v, path + k + ".");
        }
      })(j, "");
      console.log(JSON.stringify(out));
      if (out.message && !out.status && !out.invocation_url) process.exit(2);
    });'
}

# Load KEY=VALUE lines from a .env file without shell interpretation (connection strings contain "&")
load_env() {
  local line key val
  while IFS= read -r line || [ -n "$line" ]; do
    [[ "$line" =~ ^[A-Za-z_][A-Za-z0-9_]*= ]] || continue
    key=${line%%=*}; val=${line#*=}
    val=${val%\"}; val=${val#\"}; val=${val%\'}; val=${val#\'}
    export "$key=$val"
  done < "$1"
}
