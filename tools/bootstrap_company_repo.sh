#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

TARGET_DIR=""
UPSTREAM_REF=""
UPSTREAM_REPO=""
UPSTREAM_URL=""
GH_REPO=""
DEFAULT_BRANCH="main"
CREATE_REPO=0
PUSH_AFTER_BOOTSTRAP=0
COMPANY_NAME=""
COMPANY_STREET=""
COMPANY_POSTAL_CODE=""
COMPANY_CITY=""
COMPANY_COUNTRY=""
PRIMARY_GH_USERNAME=""
PRIMARY_FULL_NAME=""
PRIMARY_JOB_TITLE=""
SIGNATURE_UI_BASE_URL=""

usage() {
  cat <<'EOF'
Usage: tools/bootstrap_company_repo.sh --target-dir <path> --upstream-ref <git-ref> [options]

Creates a private adopter repo from an upstream QMS Lite baseline, overlays generic
company-owned seed files, and optionally creates/pushes a GitHub repository.

Options:
  --target-dir <path>              Directory to create
  --upstream-ref <git-ref>         Recommended: QMS-YYYY-MM-DD-RNN tag
  --upstream-repository <owner/repo>
                                   Logical upstream repository label written to adoption metadata
  --upstream-url <git-url>         Upstream git remote URL added as remote "upstream"
  --repo <owner/repo>              Downstream GitHub repository to create/use as origin
  --create-repo                    Create the downstream GitHub repository with gh
  --push                           Push initial main branch after local bootstrap
  --default-branch <name>          Default branch name (default: main)
  --company-name <name>
  --company-street <text>
  --company-postal-code <text>
  --company-city <text>
  --company-country <text>
  --primary-gh-username <login>
  --primary-full-name <text>
  --primary-job-title <text>
  --signature-ui-base-url <url>
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
    --target-dir) TARGET_DIR="$2"; shift 2 ;;
    --upstream-ref) UPSTREAM_REF="$2"; shift 2 ;;
    --upstream-repository) UPSTREAM_REPO="$2"; shift 2 ;;
    --upstream-url) UPSTREAM_URL="$2"; shift 2 ;;
    --repo) GH_REPO="$2"; shift 2 ;;
    --create-repo) CREATE_REPO=1; shift ;;
    --push) PUSH_AFTER_BOOTSTRAP=1; shift ;;
    --default-branch) DEFAULT_BRANCH="$2"; shift 2 ;;
    --company-name) COMPANY_NAME="$2"; shift 2 ;;
    --company-street) COMPANY_STREET="$2"; shift 2 ;;
    --company-postal-code) COMPANY_POSTAL_CODE="$2"; shift 2 ;;
    --company-city) COMPANY_CITY="$2"; shift 2 ;;
    --company-country) COMPANY_COUNTRY="$2"; shift 2 ;;
    --primary-gh-username) PRIMARY_GH_USERNAME="$2"; shift 2 ;;
    --primary-full-name) PRIMARY_FULL_NAME="$2"; shift 2 ;;
    --primary-job-title) PRIMARY_JOB_TITLE="$2"; shift 2 ;;
    --signature-ui-base-url) SIGNATURE_UI_BASE_URL="$2"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "${TARGET_DIR}" || -z "${UPSTREAM_REF}" ]]; then
  usage
  exit 1
fi

require_cmd git
require_cmd python3

if [[ -e "${TARGET_DIR}" ]] && [[ -n "$(find "${TARGET_DIR}" -mindepth 1 -maxdepth 1 2>/dev/null)" ]]; then
  echo "Target directory must not already contain files: ${TARGET_DIR}" >&2
  exit 1
fi

if ! git -C "${REPO_ROOT}" rev-parse --verify "${UPSTREAM_REF}^{commit}" >/dev/null 2>&1; then
  echo "Git ref not found locally: ${UPSTREAM_REF}" >&2
  exit 1
fi

mkdir -p "${TARGET_DIR}"
git -C "${REPO_ROOT}" archive --format=tar "${UPSTREAM_REF}" | tar -xf - -C "${TARGET_DIR}"

python3 "${REPO_ROOT}/tools/qms_distribution.py" apply-bootstrap-overlays \
  --repo-root "${REPO_ROOT}" \
  --target-root "${TARGET_DIR}" \
  --company-name "${COMPANY_NAME}" \
  --company-street "${COMPANY_STREET}" \
  --company-postal-code "${COMPANY_POSTAL_CODE}" \
  --company-city "${COMPANY_CITY}" \
  --company-country "${COMPANY_COUNTRY}" \
  --primary-gh-username "${PRIMARY_GH_USERNAME}" \
  --primary-full-name "${PRIMARY_FULL_NAME}" \
  --primary-job-title "${PRIMARY_JOB_TITLE}" \
  --signature-ui-base-url "${SIGNATURE_UI_BASE_URL}"

if [[ -z "${UPSTREAM_REPO}" ]]; then
  UPSTREAM_REPO="${UPSTREAM_URL}"
fi
if [[ -z "${UPSTREAM_REPO}" ]]; then
  UPSTREAM_REPO="$(git -C "${REPO_ROOT}" config --get remote.origin.url || true)"
fi
if [[ -z "${UPSTREAM_REPO}" ]]; then
  UPSTREAM_REPO="UNKNOWN_UPSTREAM_REPOSITORY"
fi

python3 "${REPO_ROOT}/tools/qms_distribution.py" write-baseline \
  --repo-root "${REPO_ROOT}" \
  --target-root "${TARGET_DIR}" \
  --upstream-repository "${UPSTREAM_REPO}" \
  --upstream-ref "${UPSTREAM_REF}" >/dev/null

git -C "${TARGET_DIR}" init -b "${DEFAULT_BRANCH}" >/dev/null
git -C "${TARGET_DIR}" add .
git -C "${TARGET_DIR}" commit -m "Bootstrap adopter repo from ${UPSTREAM_REF}" >/dev/null

if [[ -n "${UPSTREAM_URL}" ]]; then
  git -C "${TARGET_DIR}" remote add upstream "${UPSTREAM_URL}"
fi

if [[ "${CREATE_REPO}" -eq 1 ]]; then
  if [[ -z "${GH_REPO}" ]]; then
    echo "--create-repo requires --repo <owner/repo>" >&2
    exit 1
  fi
  require_cmd gh
  gh repo create "${GH_REPO}" --private >/dev/null
fi

if [[ -n "${GH_REPO}" ]] && ! git -C "${TARGET_DIR}" remote get-url origin >/dev/null 2>&1; then
  git -C "${TARGET_DIR}" remote add origin "https://github.com/${GH_REPO}.git"
fi

if [[ "${PUSH_AFTER_BOOTSTRAP}" -eq 1 ]]; then
  if [[ -z "${GH_REPO}" ]]; then
    echo "--push requires --repo <owner/repo>" >&2
    exit 1
  fi
  git -C "${TARGET_DIR}" push -u origin "${DEFAULT_BRANCH}"
fi

cat <<EOF
Bootstrap complete.

Repo root: ${TARGET_DIR}
Recorded upstream ref: ${UPSTREAM_REF}
Downstream repo: ${GH_REPO:-not-created}

Next commands:
  cd ${TARGET_DIR}
  tools/check_adoption_readiness.sh --skip-gh
  gh pr create --fill    # after company-specific onboarding edits are committed and pushed
EOF
