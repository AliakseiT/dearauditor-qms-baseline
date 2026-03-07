#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

SKIP_GH=0
GH_REPO=""

usage() {
  cat <<'EOF'
Usage: tools/check_adoption_readiness.sh [options]

Checks that an adopter repo has the expected split between upstream-owned and
company-owned artifacts and that the required GitHub variables/secrets exist.

Options:
  --repo <owner/repo>   Repository to query with gh (default: derived from origin remote)
  --skip-gh             Skip GitHub API checks and only run local file checks
  -h, --help            Show this help
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
    --repo) GH_REPO="$2"; shift 2 ;;
    --skip-gh) SKIP_GH=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

require_cmd python3
python3 "${REPO_ROOT}/tools/qms_distribution.py" check-placeholders --repo-root "${REPO_ROOT}"

BASELINE_FILE="$(REPO_ROOT="${REPO_ROOT}" python3 - <<'PY'
import json
import os
from pathlib import Path
repo_root = Path(os.environ["REPO_ROOT"])
cfg = json.loads((repo_root / "distribution-map.json").read_text(encoding="utf-8"))
print(cfg["tracked_baseline_file"])
PY
)"

if [[ ! -f "${REPO_ROOT}/${BASELINE_FILE}" ]]; then
  echo "Missing baseline tracking file: ${BASELINE_FILE}" >&2
  exit 1
fi

REPO_ROOT="${REPO_ROOT}" python3 - "${BASELINE_FILE}" <<'PY'
import json
import os
import sys
from pathlib import Path
repo_root = Path(os.environ["REPO_ROOT"])
baseline_file = Path(sys.argv[1])
payload = json.loads((repo_root / baseline_file).read_text(encoding="utf-8"))
required = {"schema_version", "model", "upstream_repository", "upstream_ref", "recorded_at_utc"}
missing = sorted(required - payload.keys())
if missing:
    raise SystemExit(f"{baseline_file} missing keys: {', '.join(missing)}")
PY

if [[ "${SKIP_GH}" -eq 1 ]]; then
  echo "Local adoption readiness checks passed."
  exit 0
fi

require_cmd gh
gh auth status >/dev/null

if [[ -z "${GH_REPO}" ]]; then
  ORIGIN_URL="$(git -C "${REPO_ROOT}" remote get-url origin 2>/dev/null || true)"
  GH_REPO="$(printf '%s' "${ORIGIN_URL}" | sed -E 's#(git@github.com:|https://github.com/)##; s#\.git$##')"
fi

if [[ -z "${GH_REPO}" ]]; then
  echo "Could not determine GitHub repository. Pass --repo <owner/repo>." >&2
  exit 1
fi

SETTINGS_JSON="$(python3 "${REPO_ROOT}/tools/qms_distribution.py" required-settings --repo-root "${REPO_ROOT}")"
VARIABLES_JSON="$(gh api "repos/${GH_REPO}/actions/variables")"
SECRETS_OUTPUT="$(gh secret list --repo "${GH_REPO}")"

python3 - "${SETTINGS_JSON}" "${VARIABLES_JSON}" "${SECRETS_OUTPUT}" <<'PY'
import json
import sys

required = json.loads(sys.argv[1])
variables = json.loads(sys.argv[2])
secret_output = sys.argv[3]

present_variables = {entry["name"] for entry in variables.get("variables", [])}
present_secrets = set()
for line in secret_output.splitlines():
    cols = [col for col in line.split() if col]
    if cols:
        present_secrets.add(cols[0])

missing_variables = [name for name in required.get("variables", []) if name not in present_variables]
missing_secrets = [name for name in required.get("secrets", []) if name not in present_secrets]

if missing_variables or missing_secrets:
    lines = []
    if missing_variables:
        lines.append("Missing repo variables: " + ", ".join(missing_variables))
    if missing_secrets:
        lines.append("Missing repo secrets: " + ", ".join(missing_secrets))
    raise SystemExit("\n".join(lines))
PY

echo "Adoption readiness checks passed for ${GH_REPO}."
