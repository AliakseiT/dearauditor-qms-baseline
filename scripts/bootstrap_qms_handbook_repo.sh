#!/usr/bin/env bash
set -euo pipefail

TARGET_REPO="${1:-AliakseiT/qms-handbook}"
TARGET_BRANCH="${2:-main}"

TMP_DIR="$(mktemp -d)"
cleanup() {
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT

if gh repo view "${TARGET_REPO}" >/dev/null 2>&1; then
  echo "Repository exists: ${TARGET_REPO}"
else
  echo "Creating private repository: ${TARGET_REPO}"
  gh repo create "${TARGET_REPO}" --private --disable-issues --disable-wiki --description "Private read-only published QMS handbook for internal staff"
fi

echo "Cloning ${TARGET_REPO}..."
git clone "https://github.com/${TARGET_REPO}.git" "${TMP_DIR}/repo"
cd "${TMP_DIR}/repo"

if ! git rev-parse --verify HEAD >/dev/null 2>&1; then
  git checkout --orphan "${TARGET_BRANCH}"
  git rm -rf . >/dev/null 2>&1 || true
fi

mkdir -p published/latest published/releases

cat > README.md <<'EOF'
# QMS Handbook

Private read-only publication repository for internal QMS reading and training.

## Latest Publication

- Not published yet.

Expected assets:
- `published/latest/qms_handbook.md`
- `published/latest/qms_handbook.html`
- `published/latest/qms_handbook.pdf`
- `published/latest/publish_manifest.json`
- `published/index.json`
EOF

cat > published/index.json <<'EOF'
{
  "schema_version": 1,
  "updated_at_utc": "",
  "latest_publish_id": "",
  "latest": {},
  "releases": []
}
EOF

git add README.md published/
if git diff --cached --quiet; then
  echo "No bootstrap changes to commit."
  exit 0
fi

git config user.name "AliakseiT"
git config user.email "AliakseiT@users.noreply.github.com"
git commit -m "Bootstrap handbook repository structure"
git push --set-upstream origin "${TARGET_BRANCH}"
echo "Bootstrapped ${TARGET_REPO} (${TARGET_BRANCH})"
