#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

TARGET_DIR=""
UPSTREAM_REF=""
UPSTREAM_REPO=""
UPSTREAM_URL=""
GH_REPO=""
ORIGIN_URL=""
ORIGIN_USE_SSH=0
DEFAULT_BRANCH="main"
CREATE_REPO=0
PUSH_AFTER_BOOTSTRAP=0
SYNC_CODEOWNERS=1
CONFIGURE_GITHUB=0
MERGE_CONTROLS_SOURCE_REPO=""
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

Creates a private adopter repo from an upstream DearAuditor Open QMS Baseline ref, overlays generic
company-owned seed files, and optionally creates/pushes a GitHub repository.

Options:
  --target-dir <path>              Directory to create
  --upstream-ref <git-ref>         Recommended: QMS-YYYY-MM-DD-RNNN tag
  --upstream-repository <owner/repo>
                                   Logical upstream repository label written to adoption metadata
  --upstream-url <git-url>         Upstream git remote URL added as remote "upstream"
  --repo <owner/repo>              Downstream GitHub repository to create/use as origin
  --origin-url <git-url>           Exact origin remote URL to use instead of deriving one from --repo
  --ssh-origin                     Derive origin as git@github.com:<owner/repo>.git from --repo
  --create-repo                    Create the downstream GitHub repository with gh
  --push                           Push initial main branch after local bootstrap
  --default-branch <name>          Default branch name (default: main)
  --skip-codeowners-sync           Do not regenerate .github/CODEOWNERS from matrices/signer_registry.json
  --configure-github               After push, copy baseline rulesets/branch protection to --repo
  --merge-controls-source-repo <owner/repo>
                                   Source repo for --configure-github (default: --upstream-repository
                                   when it is owner/repo, otherwise detected current gh repo)
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

is_owner_repo() {
  [[ "$1" =~ ^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$ ]]
}

detect_merge_controls_source_repo() {
  if is_owner_repo "${UPSTREAM_REPO}"; then
    printf '%s\n' "${UPSTREAM_REPO}"
    return 0
  fi

  if command -v gh >/dev/null 2>&1; then
    gh repo view --json nameWithOwner --jq .nameWithOwner 2>/dev/null || true
  fi
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --target-dir) TARGET_DIR="$2"; shift 2 ;;
    --upstream-ref) UPSTREAM_REF="$2"; shift 2 ;;
    --upstream-repository) UPSTREAM_REPO="$2"; shift 2 ;;
    --upstream-url) UPSTREAM_URL="$2"; shift 2 ;;
    --repo) GH_REPO="$2"; shift 2 ;;
    --origin-url) ORIGIN_URL="$2"; shift 2 ;;
    --ssh-origin) ORIGIN_USE_SSH=1; shift ;;
    --create-repo) CREATE_REPO=1; shift ;;
    --push) PUSH_AFTER_BOOTSTRAP=1; shift ;;
    --default-branch) DEFAULT_BRANCH="$2"; shift 2 ;;
    --skip-codeowners-sync) SYNC_CODEOWNERS=0; shift ;;
    --configure-github) CONFIGURE_GITHUB=1; shift ;;
    --merge-controls-source-repo) MERGE_CONTROLS_SOURCE_REPO="$2"; shift 2 ;;
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

if [[ -n "${ORIGIN_URL}" && "${ORIGIN_USE_SSH}" -eq 1 ]]; then
  echo "--origin-url and --ssh-origin cannot be used together" >&2
  exit 1
fi

if [[ "${ORIGIN_USE_SSH}" -eq 1 && -z "${GH_REPO}" ]]; then
  echo "--ssh-origin requires --repo <owner/repo>" >&2
  exit 1
fi

if [[ "${CONFIGURE_GITHUB}" -eq 1 ]]; then
  if [[ -z "${GH_REPO}" ]]; then
    echo "--configure-github requires --repo <owner/repo>" >&2
    exit 1
  fi
  if [[ "${PUSH_AFTER_BOOTSTRAP}" -ne 1 ]]; then
    echo "--configure-github requires --push so the target branch exists before protection is applied" >&2
    exit 1
  fi
  if [[ -n "${MERGE_CONTROLS_SOURCE_REPO}" ]] && ! is_owner_repo "${MERGE_CONTROLS_SOURCE_REPO}"; then
    echo "--merge-controls-source-repo must be owner/repo" >&2
    exit 1
  fi
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

if [[ "${SYNC_CODEOWNERS}" -eq 1 ]]; then
  python3 "${REPO_ROOT}/tools/qms_distribution.py" sync-codeowners \
    --target-root "${TARGET_DIR}" >/dev/null
fi

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

ORIGIN_REMOTE_URL="${ORIGIN_URL}"
if [[ -z "${ORIGIN_REMOTE_URL}" && -n "${GH_REPO}" ]]; then
  if [[ "${ORIGIN_USE_SSH}" -eq 1 ]]; then
    ORIGIN_REMOTE_URL="git@github.com:${GH_REPO}.git"
  else
    ORIGIN_REMOTE_URL="https://github.com/${GH_REPO}.git"
  fi
fi

if [[ -n "${ORIGIN_REMOTE_URL}" ]] && ! git -C "${TARGET_DIR}" remote get-url origin >/dev/null 2>&1; then
  git -C "${TARGET_DIR}" remote add origin "${ORIGIN_REMOTE_URL}"
fi

if [[ "${PUSH_AFTER_BOOTSTRAP}" -eq 1 ]]; then
  if ! git -C "${TARGET_DIR}" remote get-url origin >/dev/null 2>&1; then
    echo "--push requires --repo <owner/repo> or --origin-url <git-url>" >&2
    exit 1
  fi
  git -C "${TARGET_DIR}" push -u origin "${DEFAULT_BRANCH}"
fi

if [[ "${CONFIGURE_GITHUB}" -eq 1 ]]; then
  require_cmd gh
  require_cmd jq
  if [[ -z "${MERGE_CONTROLS_SOURCE_REPO}" ]]; then
    MERGE_CONTROLS_SOURCE_REPO="$(detect_merge_controls_source_repo)"
  fi
  if [[ -z "${MERGE_CONTROLS_SOURCE_REPO}" ]]; then
    echo "Could not determine merge controls source repo. Pass --merge-controls-source-repo <owner/repo>." >&2
    exit 1
  fi
  "${REPO_ROOT}/scripts/copy_github_merge_controls.sh" \
    --branch "${DEFAULT_BRANCH}" \
    "${MERGE_CONTROLS_SOURCE_REPO}" \
    "${GH_REPO}"
fi

cat <<EOF
Bootstrap complete.

Repo root: ${TARGET_DIR}
Recorded upstream ref: ${UPSTREAM_REF}
Downstream repo: ${GH_REPO:-not-created}
Origin remote: ${ORIGIN_REMOTE_URL:-not-configured}
CODEOWNERS synced from signer registry: $([[ "${SYNC_CODEOWNERS}" -eq 1 ]] && echo yes || echo no)
GitHub merge controls configured: $([[ "${CONFIGURE_GITHUB}" -eq 1 ]] && echo yes || echo no)

Next commands:
  cd ${TARGET_DIR}
  tools/check_adoption_readiness.sh --skip-gh
  gh pr create --fill    # after company-specific onboarding edits are committed and pushed
EOF
