#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVICE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
REPO_ROOT="$(cd "${SERVICE_DIR}/../.." && pwd)"

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
  GITHUB_APP_ID
  GITHUB_APP_CLIENT_ID
  GITHUB_APP_CLIENT_SECRET
  GITHUB_APP_PRIVATE_KEY
  GITHUB_APP_INSTALLATION_ID (optional)
  SIGNATURE_LINK_SECRET
  SIGNATURE_STATE_SECRET
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
  if [[ -f "${SERVICE_DIR}/wrangler.toml" ]]; then
    WORKER_NAME="$(awk -F'=' '/^name\s*=/{gsub(/[ \"\r\n]/,"",$2); print $2; exit}' "${SERVICE_DIR}/wrangler.toml")"
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

normalize_private_key() {
  local key="${1:-}"
  if [[ "$key" == *"\\n"* ]]; then
    printf '%b' "${key//\\n/\n}"
  else
    printf '%s' "$key"
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

write_dev_vars() {
  local out="${SERVICE_DIR}/.dev.vars"
  cat > "$out" <<DEVVARS
PUBLIC_BASE_URL=${PUBLIC_BASE_URL:-}
DEFAULT_OAUTH_PROVIDER=${DEFAULT_OAUTH_PROVIDER:-github}
ALLOWED_OAUTH_PROVIDERS=${ALLOWED_OAUTH_PROVIDERS:-github}
GITHUB_API_BASE_URL=${GITHUB_API_BASE_URL:-https://api.github.com}
GITHUB_APP_ID=${GITHUB_APP_ID:-}
GITHUB_APP_CLIENT_ID=${GITHUB_APP_CLIENT_ID:-}
GITHUB_APP_CLIENT_SECRET=${GITHUB_APP_CLIENT_SECRET:-}
GITHUB_APP_INSTALLATION_ID=${GITHUB_APP_INSTALLATION_ID:-}
SIGNATURE_LINK_SECRET=${SIGNATURE_LINK_SECRET:-}
SIGNATURE_STATE_SECRET=${SIGNATURE_STATE_SECRET:-}
DEVVARS

  local normalized_key
  normalized_key="$(normalize_private_key "${GITHUB_APP_PRIVATE_KEY:-}")"
  {
    printf 'GITHUB_APP_PRIVATE_KEY='
    printf '%q' "$normalized_key"
    printf '\n'
  } >> "$out"

  echo "Wrote local dev file: ${out}"
}

write_dev_vars

if [[ "$DO_DEPLOY" -eq 1 ]]; then
  require_non_placeholder_for_deploy "GITHUB_APP_ID"
  require_non_placeholder_for_deploy "GITHUB_APP_CLIENT_ID"
  require_non_placeholder_for_deploy "GITHUB_APP_CLIENT_SECRET"
  require_non_placeholder_for_deploy "GITHUB_APP_PRIVATE_KEY"
  require_non_placeholder_for_deploy "SIGNATURE_LINK_SECRET"
  require_non_placeholder_for_deploy "SIGNATURE_STATE_SECRET"
fi

if [[ "$SKIP_GH" -eq 0 ]]; then
  require_cmd gh
  gh auth status >/dev/null

  upsert_repo_variable "$GH_REPO" "SIGNATURE_UI_BASE_URL" "$SIGNATURE_UI_BASE_URL"
  set_repo_secret_if_present "$GH_REPO" "SIGNATURE_LINK_SECRET" "${SIGNATURE_LINK_SECRET:-}"
  set_repo_secret_if_present "$GH_REPO" "SIGNATURE_APP_ID" "${GITHUB_APP_ID:-}"

  local_private_key="$(normalize_private_key "${GITHUB_APP_PRIVATE_KEY:-}")"
  set_repo_secret_if_present "$GH_REPO" "SIGNATURE_APP_PRIVATE_KEY" "$local_private_key"
fi

if [[ "$SKIP_CF" -eq 0 ]]; then
  require_cmd wrangler

  local_private_key="$(normalize_private_key "${GITHUB_APP_PRIVATE_KEY:-}")"

  set_worker_secret_if_present "$WORKER_NAME" "GITHUB_APP_ID" "${GITHUB_APP_ID:-}"
  set_worker_secret_if_present "$WORKER_NAME" "GITHUB_APP_CLIENT_ID" "${GITHUB_APP_CLIENT_ID:-}"
  set_worker_secret_if_present "$WORKER_NAME" "GITHUB_APP_CLIENT_SECRET" "${GITHUB_APP_CLIENT_SECRET:-}"
  set_worker_secret_if_present "$WORKER_NAME" "GITHUB_APP_PRIVATE_KEY" "$local_private_key"
  set_worker_secret_if_present "$WORKER_NAME" "SIGNATURE_LINK_SECRET" "${SIGNATURE_LINK_SECRET:-}"
  set_worker_secret_if_present "$WORKER_NAME" "SIGNATURE_STATE_SECRET" "${SIGNATURE_STATE_SECRET:-}"
  set_worker_secret_if_present "$WORKER_NAME" "GITHUB_APP_INSTALLATION_ID" "${GITHUB_APP_INSTALLATION_ID:-}"
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
