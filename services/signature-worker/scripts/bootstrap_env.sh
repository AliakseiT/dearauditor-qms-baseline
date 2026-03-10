#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVICE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
WRANGLER_TOML="${SERVICE_DIR}/wrangler.toml"

ENV_FILE="${SERVICE_DIR}/.env.local"
WORKER_NAME=""
GH_REPO_OVERRIDE=""
SKIP_GH=0
SKIP_CF=0
DO_DEPLOY=0

usage() {
  cat <<USAGE
Usage: $(basename "$0") [options]

Options:
  --env-file <path>      Path to .env.local (default: services/signature-worker/.env.local)
  --worker-name <name>   Cloudflare Worker name (default: from wrangler.toml or "signature-worker")
  --repo <owner/repo>    GitHub repo for Actions variables/secrets (default: GITHUB_REPO from env)
  --skip-gh              Skip GitHub variable/secret updates
  --skip-cf              Skip Cloudflare secret updates
  --deploy               Deploy worker after secrets are updated
  -h, --help             Show this help

Expected env keys in .env.local:
  PUBLIC_BASE_URL
  GITHUB_REPO
  CLOUDFLARE_API_TOKEN
  CLOUDFLARE_ACCOUNT_ID
  GITHUB_OAUTH_CLIENT_ID
  GITHUB_OAUTH_CLIENT_SECRET
  QMS_BOT_APP_ID
  QMS_BOT_APP_PRIVATE_KEY
  SIGNATURE_STATE_SECRET
  PIN_PEPPER

Optional env keys:
  QMS_BOT_APP_INSTALLATION_ID
  GITHUB_API_BASE_URL
  DEFAULT_OAUTH_PROVIDER
  ALLOWED_OAUTH_PROVIDERS
  SIGNATURE_UI_BASE_URL
  PIN_KV_NAMESPACE_ID
  PIN_KV_PREVIEW_NAMESPACE_ID
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --env-file)
      ENV_FILE="$2"; shift 2 ;;
    --worker-name)
      WORKER_NAME="$2"; shift 2 ;;
    --repo)
      GH_REPO_OVERRIDE="$2"; shift 2 ;;
    --skip-gh)
      SKIP_GH=1; shift ;;
    --skip-cf)
      SKIP_CF=1; shift ;;
    --deploy)
      DO_DEPLOY=1; shift ;;
    -h|--help)
      usage; exit 0 ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1 ;;
  esac
done

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing env file: $ENV_FILE" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

if [[ -z "$WORKER_NAME" ]]; then
  if [[ -f "$WRANGLER_TOML" ]]; then
    WORKER_NAME="$(awk -F'=' '/^name\s*=/{gsub(/[ \"\r\n]/,"",$2); print $2; exit}' "$WRANGLER_TOML")"
  fi
  WORKER_NAME="${WORKER_NAME:-signature-worker}"
fi

GH_REPO="${GH_REPO_OVERRIDE:-${GITHUB_REPO:-}}"
if [[ -z "$GH_REPO" ]]; then
  echo "GITHUB_REPO is not set (and --repo not provided)." >&2
  exit 1
fi

SIGNATURE_UI_BASE_URL="${SIGNATURE_UI_BASE_URL:-${PUBLIC_BASE_URL:-}}"
if [[ -z "$SIGNATURE_UI_BASE_URL" ]]; then
  echo "PUBLIC_BASE_URL (or SIGNATURE_UI_BASE_URL) must be set in env file." >&2
  exit 1
fi

is_placeholder() {
  local val="${1:-}"
  [[ -z "$val" ]] && return 0
  [[ "$val" == *"..."* ]] && return 0
  [[ "$val" == "CHANGEME"* ]] && return 0
  [[ "$val" == "REPLACE_WITH_"* ]] && return 0
  [[ "$val" == "<"*">" ]] && return 0
  return 1
}

require_non_placeholder_for_deploy() {
  local key="$1"
  local val="${!key:-}"
  if is_placeholder "$val"; then
    echo "Missing required value for --deploy: ${key}" >&2
    return 1
  fi
  return 0
}

wrangler_has_config_placeholders() {
  [[ -f "$WRANGLER_TOML" ]] || return 1
  grep -Eq 'REPLACE_WITH_PIN_KV_NAMESPACE_ID|REPLACE_WITH_PIN_KV_PREVIEW_NAMESPACE_ID|REPLACE_WITH_SIGNING_BASE_URL' "$WRANGLER_TOML"
}

validate_deploy_config() {
  require_non_placeholder_for_deploy "GITHUB_OAUTH_CLIENT_ID"
  require_non_placeholder_for_deploy "GITHUB_OAUTH_CLIENT_SECRET"
  require_non_placeholder_for_deploy "QMS_BOT_APP_ID"
  require_non_placeholder_for_deploy "QMS_BOT_APP_PRIVATE_KEY"
  require_non_placeholder_for_deploy "SIGNATURE_STATE_SECRET"
  require_non_placeholder_for_deploy "PIN_PEPPER"

  if [[ "$SKIP_GH" -eq 0 ]]; then
    require_non_placeholder_for_deploy "CLOUDFLARE_API_TOKEN"
    require_non_placeholder_for_deploy "CLOUDFLARE_ACCOUNT_ID"
  fi

  if wrangler_has_config_placeholders; then
    require_non_placeholder_for_deploy "PIN_KV_NAMESPACE_ID"
    require_non_placeholder_for_deploy "PIN_KV_PREVIEW_NAMESPACE_ID"
  fi
}

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Required command not found: $1" >&2
    exit 1
  fi
}

upsert_repo_variable() {
  local repo="$1"
  local name="$2"
  local value="$3"

  if gh api "repos/${repo}/actions/variables/${name}" >/dev/null 2>&1; then
    gh api -X PATCH "repos/${repo}/actions/variables/${name}" -f name="$name" -f value="$value" >/dev/null
    echo "Updated repo variable: ${name}"
  else
    gh api -X POST "repos/${repo}/actions/variables" -f name="$name" -f value="$value" >/dev/null
    echo "Created repo variable: ${name}"
  fi
}

set_repo_secret_if_present() {
  local repo="$1"
  local name="$2"
  local value="$3"
  if is_placeholder "$value"; then
    echo "Skip repo secret ${name}: value missing/placeholder"
    return 0
  fi
  gh secret set "$name" --repo "$repo" --body "$value" >/dev/null
  echo "Set repo secret: ${name}"
}

set_worker_secret_if_present() {
  local worker="$1"
  local name="$2"
  local value="$3"
  if is_placeholder "$value"; then
    echo "Skip worker secret ${name}: value missing/placeholder"
    return 0
  fi
  printf '%s' "$value" | wrangler secret put "$name" --name "$worker" >/dev/null
  echo "Set worker secret: ${name}"
}

update_wrangler_string_value() {
  local key="$1"
  local value="$2"
  python3 - "$WRANGLER_TOML" "$key" "$value" <<'PY'
from pathlib import Path
import re
import sys

path = Path(sys.argv[1])
key = sys.argv[2]
value = sys.argv[3]
content = path.read_text()
pattern = rf'(^\s*{re.escape(key)}\s*=\s*)".*?"(\s*$)'
updated, count = re.subn(pattern, rf'\1"{value}"\2', content, count=1, flags=re.MULTILINE)
if count != 1:
    raise SystemExit(f"Could not update {key} in {path}")
path.write_text(updated)
PY
}

sync_wrangler_config_from_env() {
  [[ -f "$WRANGLER_TOML" ]] || return 0

  local kv_id="${PIN_KV_NAMESPACE_ID:-}"
  local preview_id="${PIN_KV_PREVIEW_NAMESPACE_ID:-}"
  local public_base_url="${PUBLIC_BASE_URL:-}"

  if ! is_placeholder "$kv_id"; then
    update_wrangler_string_value "id" "$kv_id"
  fi
  if ! is_placeholder "$preview_id"; then
    update_wrangler_string_value "preview_id" "$preview_id"
  fi
  if ! is_placeholder "$public_base_url"; then
    update_wrangler_string_value "PUBLIC_BASE_URL" "$public_base_url"
  fi
}

assert_kv_binding_configured() {
  [[ -f "$WRANGLER_TOML" ]] || { echo "Missing wrangler.toml at ${WRANGLER_TOML}" >&2; return 1; }

  if ! grep -q 'binding = "PIN_KV"' "$WRANGLER_TOML"; then
    echo "wrangler.toml is missing KV binding PIN_KV." >&2
    return 1
  fi

  local has_placeholder
  has_placeholder="$(grep -E 'REPLACE_WITH_PIN_KV_NAMESPACE_ID|REPLACE_WITH_PIN_KV_PREVIEW_NAMESPACE_ID|REPLACE_WITH_SIGNING_BASE_URL' "$WRANGLER_TOML" || true)"
  if [[ -n "$has_placeholder" ]]; then
    echo "wrangler.toml still has placeholder runtime values. Set PUBLIC_BASE_URL and any required KV namespace IDs in .env.local and rerun this script." >&2
    return 1
  fi

  return 0
}

write_dev_vars() {
  local out="${SERVICE_DIR}/.dev.vars"
  cat > "$out" <<DEVVARS
PUBLIC_BASE_URL=${PUBLIC_BASE_URL:-}
DEFAULT_OAUTH_PROVIDER=${DEFAULT_OAUTH_PROVIDER:-github}
ALLOWED_OAUTH_PROVIDERS=${ALLOWED_OAUTH_PROVIDERS:-github}
GITHUB_API_BASE_URL=${GITHUB_API_BASE_URL:-https://api.github.com}
GITHUB_OAUTH_CLIENT_ID=${GITHUB_OAUTH_CLIENT_ID:-}
GITHUB_OAUTH_CLIENT_SECRET=${GITHUB_OAUTH_CLIENT_SECRET:-}
QMS_BOT_APP_ID=${QMS_BOT_APP_ID:-}
QMS_BOT_APP_PRIVATE_KEY=${QMS_BOT_APP_PRIVATE_KEY:-}
QMS_BOT_APP_INSTALLATION_ID=${QMS_BOT_APP_INSTALLATION_ID:-}
SIGNATURE_STATE_SECRET=${SIGNATURE_STATE_SECRET:-}
PIN_PEPPER=${PIN_PEPPER:-}
DEVVARS

  echo "Wrote local dev file: ${out}"
}

if [[ "$DO_DEPLOY" -eq 1 ]]; then
  validate_deploy_config
  sync_wrangler_config_from_env
  assert_kv_binding_configured
fi

if [[ "$DO_DEPLOY" -eq 0 ]]; then
  sync_wrangler_config_from_env
fi
write_dev_vars

if [[ "$SKIP_GH" -eq 0 ]]; then
  require_cmd gh
  gh auth status >/dev/null

  upsert_repo_variable "$GH_REPO" "SIGNATURE_UI_BASE_URL" "$SIGNATURE_UI_BASE_URL"
  set_repo_secret_if_present "$GH_REPO" "QMS_BOT_APP_ID" "${QMS_BOT_APP_ID:-}"
  set_repo_secret_if_present "$GH_REPO" "QMS_BOT_APP_PRIVATE_KEY" "${QMS_BOT_APP_PRIVATE_KEY:-}"
  set_repo_secret_if_present "$GH_REPO" "CLOUDFLARE_API_TOKEN" "${CLOUDFLARE_API_TOKEN:-}"
  set_repo_secret_if_present "$GH_REPO" "CLOUDFLARE_ACCOUNT_ID" "${CLOUDFLARE_ACCOUNT_ID:-}"
fi

if [[ "$SKIP_CF" -eq 0 ]]; then
  require_cmd wrangler

  set_worker_secret_if_present "$WORKER_NAME" "GITHUB_OAUTH_CLIENT_ID" "${GITHUB_OAUTH_CLIENT_ID:-}"
  set_worker_secret_if_present "$WORKER_NAME" "GITHUB_OAUTH_CLIENT_SECRET" "${GITHUB_OAUTH_CLIENT_SECRET:-}"
  set_worker_secret_if_present "$WORKER_NAME" "QMS_BOT_APP_ID" "${QMS_BOT_APP_ID:-}"
  set_worker_secret_if_present "$WORKER_NAME" "QMS_BOT_APP_PRIVATE_KEY" "${QMS_BOT_APP_PRIVATE_KEY:-}"
  set_worker_secret_if_present "$WORKER_NAME" "QMS_BOT_APP_INSTALLATION_ID" "${QMS_BOT_APP_INSTALLATION_ID:-}"
  set_worker_secret_if_present "$WORKER_NAME" "SIGNATURE_STATE_SECRET" "${SIGNATURE_STATE_SECRET:-}"
  set_worker_secret_if_present "$WORKER_NAME" "PIN_PEPPER" "${PIN_PEPPER:-}"
fi

if [[ "$DO_DEPLOY" -eq 1 ]]; then
  require_cmd wrangler
  (
    cd "$SERVICE_DIR"
    wrangler deploy
  )
fi

echo "Bootstrap complete."
echo "Repository: ${GH_REPO}"
echo "Worker: ${WORKER_NAME}"
echo "SIGNATURE_UI_BASE_URL: ${SIGNATURE_UI_BASE_URL}"
