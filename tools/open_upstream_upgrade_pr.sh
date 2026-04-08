#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

UPSTREAM_REF=""
UPSTREAM_REMOTE="upstream"
BRANCH_NAME=""
PUSH_BRANCH=0
OPEN_PR=0
PR_TITLE=""

usage() {
  cat <<'EOF'
Usage: tools/open_upstream_upgrade_pr.sh --upstream-ref <git-ref> [options]

Fetches a selected upstream baseline, updates only syncable paths from distribution-map.json,
records the adopted upstream ref, and optionally pushes/opens a PR.

Options:
  --upstream-ref <git-ref>         Recommended: QMS-YYYY-MM-DD-RNNN tag
  --upstream-remote <name>         Remote name (default: upstream)
  --branch <name>                  Branch to create (default: upgrade/<ref>)
  --push                           Push branch to origin
  --pr                             Open a PR with gh after push
  --title <text>                   PR title override
  -h, --help                       Show this help
EOF
}

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Required command not found: $1" >&2
    exit 1
  fi
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --upstream-ref) UPSTREAM_REF="$2"; shift 2 ;;
    --upstream-remote) UPSTREAM_REMOTE="$2"; shift 2 ;;
    --branch) BRANCH_NAME="$2"; shift 2 ;;
    --push) PUSH_BRANCH=1; shift ;;
    --pr) OPEN_PR=1; shift ;;
    --title) PR_TITLE="$2"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "${UPSTREAM_REF}" ]]; then
  usage
  exit 1
fi

if [[ "${OPEN_PR}" -eq 1 && "${PUSH_BRANCH}" -eq 0 ]]; then
  echo "--pr requires --push" >&2
  exit 1
fi

require_cmd git
require_cmd python3

if [[ -n "$(git -C "${REPO_ROOT}" status --short)" ]]; then
  echo "Working tree must be clean before opening an upgrade branch." >&2
  exit 1
fi

if ! git -C "${REPO_ROOT}" remote get-url "${UPSTREAM_REMOTE}" >/dev/null 2>&1; then
  echo "Remote not found: ${UPSTREAM_REMOTE}" >&2
  exit 1
fi

CHECKOUT_REF="${UPSTREAM_REF}"
if ! git -C "${REPO_ROOT}" rev-parse --verify "${UPSTREAM_REF}^{commit}" >/dev/null 2>&1; then
  if git -C "${REPO_ROOT}" fetch "${UPSTREAM_REMOTE}" "refs/tags/${UPSTREAM_REF}:refs/tags/${UPSTREAM_REF}" >/dev/null 2>&1; then
    CHECKOUT_REF="${UPSTREAM_REF}"
  else
    git -C "${REPO_ROOT}" fetch "${UPSTREAM_REMOTE}" "${UPSTREAM_REF}" >/dev/null
    CHECKOUT_REF="${UPSTREAM_REMOTE}/${UPSTREAM_REF}"
  fi
fi

if ! git -C "${REPO_ROOT}" rev-parse --verify "${CHECKOUT_REF}^{commit}" >/dev/null 2>&1; then
  echo "Fetched ref is not available locally: ${UPSTREAM_REF}" >&2
  exit 1
fi

if [[ -z "${BRANCH_NAME}" ]]; then
  BRANCH_NAME="upgrade/${UPSTREAM_REF}"
fi

git -C "${REPO_ROOT}" checkout -b "${BRANCH_NAME}" >/dev/null

SYNC_FILE_LIST="$(mktemp)"
python3 "${REPO_ROOT}/tools/qms_distribution.py" resolve-sync-files \
  --repo-root "${REPO_ROOT}" \
  --upstream-ref "${CHECKOUT_REF}" > "${SYNC_FILE_LIST}"

SYNC_FILES=()
while IFS= read -r line; do
  if [[ -n "${line}" ]]; then
    SYNC_FILES+=("${line}")
  fi
done < "${SYNC_FILE_LIST}"
rm -f "${SYNC_FILE_LIST}"

if [[ "${#SYNC_FILES[@]}" -eq 0 ]]; then
  echo "No syncable files resolved from ${UPSTREAM_REF}" >&2
  exit 1
fi

git -C "${REPO_ROOT}" checkout "${CHECKOUT_REF}" -- "${SYNC_FILES[@]}"

UPSTREAM_URL="$(git -C "${REPO_ROOT}" remote get-url "${UPSTREAM_REMOTE}")"
python3 "${REPO_ROOT}/tools/qms_distribution.py" write-baseline \
  --repo-root "${REPO_ROOT}" \
  --target-root "${REPO_ROOT}" \
  --upstream-repository "${UPSTREAM_URL}" \
  --upstream-ref "${UPSTREAM_REF}" >/dev/null

if git -C "${REPO_ROOT}" diff --quiet --exit-code; then
  echo "No upgrade changes detected for ${UPSTREAM_REF}."
  exit 0
fi

git -C "${REPO_ROOT}" add .
git -C "${REPO_ROOT}" commit -m "Adopt upstream baseline ${UPSTREAM_REF}" >/dev/null

if [[ "${PUSH_BRANCH}" -eq 1 ]]; then
  git -C "${REPO_ROOT}" push -u origin "${BRANCH_NAME}"
fi

if [[ "${OPEN_PR}" -eq 1 ]]; then
  require_cmd gh
  if [[ -z "${PR_TITLE}" ]]; then
    PR_TITLE="Adopt upstream baseline ${UPSTREAM_REF}"
  fi
  gh pr create --title "${PR_TITLE}" --body "Controlled update of upstream-owned DearAuditor Open QMS Baseline paths from \`${UPSTREAM_REF}\`. Company-owned matrices and operational records were intentionally left untouched."
fi

cat <<EOF
Upgrade branch ready.

Branch: ${BRANCH_NAME}
Upstream ref: ${UPSTREAM_REF}

Recommended verification:
  tools/check_adoption_readiness.sh --skip-gh
EOF
