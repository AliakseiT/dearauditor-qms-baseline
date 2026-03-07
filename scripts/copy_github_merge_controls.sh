#!/usr/bin/env bash
set -euo pipefail

API_VERSION="2022-11-28"

usage() {
  cat <<'EOF'
Usage: scripts/copy_github_merge_controls.sh [--branch BRANCH] [--dry-run] SOURCE_OWNER/REPO TARGET_OWNER/REPO

Copies repository-level branch rulesets and classic branch protection settings
from SOURCE_OWNER/REPO to TARGET_OWNER/REPO using `gh api`.

Notes:
- The target repository must already exist.
- Branch names are copied as-is and must already exist in the target repository.
- If no `--branch` arguments are supplied, the source repository default branch is used.
- Existing target rulesets with the same name and target are updated; otherwise a new ruleset is created.
- Org-level rulesets and other repository settings are not copied.
EOF
}

die() {
  echo "error: $*" >&2
  exit 1
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "missing required command: $1"
}

api() {
  gh api \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: ${API_VERSION}" \
    "$@"
}

api_with_method() {
  local method="$1"
  shift
  gh api \
    --method "$method" \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: ${API_VERSION}" \
    "$@"
}

urlencode() {
  jq -rn --arg value "$1" '$value|@uri'
}

copy_rulesets() {
  local source_repo="$1"
  local target_repo="$2"
  local target_rulesets source_rulesets

  source_rulesets="$(api "repos/${source_repo}/rulesets")"
  target_rulesets="$(api "repos/${target_repo}/rulesets")"

  while IFS= read -r ruleset_id; do
    local payload name target existing_id

    payload="$(
      api "repos/${source_repo}/rulesets/${ruleset_id}" |
        jq '{
          name,
          target,
          enforcement,
          bypass_actors: (.bypass_actors // []),
          conditions,
          rules
        }'
    )"
    name="$(jq -r '.name' <<<"${payload}")"
    target="$(jq -r '.target' <<<"${payload}")"
    existing_id="$(
      jq -r --arg name "${name}" --arg target "${target}" '
        map(select(.name == $name and .target == $target)) | first | .id // empty
      ' <<<"${target_rulesets}"
    )"

    if [[ -n "${existing_id}" ]]; then
      echo "Updating ${target} ruleset '${name}' on ${target_repo}"
      if [[ "${DRY_RUN}" == "true" ]]; then
        jq . <<<"${payload}"
      else
        api_with_method PUT "repos/${target_repo}/rulesets/${existing_id}" --input - <<<"${payload}" >/dev/null
      fi
    else
      echo "Creating ${target} ruleset '${name}' on ${target_repo}"
      if [[ "${DRY_RUN}" == "true" ]]; then
        jq . <<<"${payload}"
      else
        api_with_method POST "repos/${target_repo}/rulesets" --input - <<<"${payload}" >/dev/null
      fi
      target_rulesets="$(api "repos/${target_repo}/rulesets")"
    fi
  done < <(jq -r '.[] | select(.target == "branch") | .id' <<<"${source_rulesets}")
}

copy_branch_protection() {
  local source_repo="$1"
  local target_repo="$2"
  local branch="$3"
  local encoded_branch source_branch_response payload

  encoded_branch="$(urlencode "${branch}")"
  source_branch_response="$(api "repos/${source_repo}/branches/${encoded_branch}")"
  if [[ "$(jq -r '.protected' <<<"${source_branch_response}")" != "true" ]]; then
    echo "Skipping branch '${branch}' because it is not protected in ${source_repo}"
    return
  fi

  payload="$(
    api "repos/${source_repo}/branches/${encoded_branch}/protection" |
      jq '{
        required_status_checks: (
          if .required_status_checks == null then
            null
          else
            {
              strict: .required_status_checks.strict,
              contexts: (.required_status_checks.contexts // [])
            }
            + if (.required_status_checks.checks // [] | length) > 0 then
                {checks: (.required_status_checks.checks | map({context, app_id}))}
              else
                {}
              end
          end
        ),
        enforce_admins: (.enforce_admins.enabled // false),
        required_pull_request_reviews: (
          if .required_pull_request_reviews == null then
            null
          else
            {
              dismissal_restrictions: {
                users: (.required_pull_request_reviews.dismissal_restrictions.users // [] | map(.login)),
                teams: (.required_pull_request_reviews.dismissal_restrictions.teams // [] | map(.slug))
              },
              dismiss_stale_reviews: (.required_pull_request_reviews.dismiss_stale_reviews // false),
              require_code_owner_reviews: (.required_pull_request_reviews.require_code_owner_reviews // false),
              required_approving_review_count: (.required_pull_request_reviews.required_approving_review_count // 0),
              require_last_push_approval: (.required_pull_request_reviews.require_last_push_approval // false),
              bypass_pull_request_allowances: {
                users: (.required_pull_request_reviews.bypass_pull_request_allowances.users // [] | map(.login)),
                teams: (.required_pull_request_reviews.bypass_pull_request_allowances.teams // [] | map(.slug)),
                apps: (.required_pull_request_reviews.bypass_pull_request_allowances.apps // [] | map(.slug))
              }
            }
          end
        ),
        restrictions: (
          if .restrictions == null then
            null
          else
            {
              users: (.restrictions.users // [] | map(.login)),
              teams: (.restrictions.teams // [] | map(.slug)),
              apps: (.restrictions.apps // [] | map(.slug))
            }
          end
        ),
        required_linear_history: (.required_linear_history.enabled // false),
        allow_force_pushes: (.allow_force_pushes.enabled // false),
        allow_deletions: (.allow_deletions.enabled // false),
        block_creations: (.block_creations.enabled // false),
        required_conversation_resolution: (.required_conversation_resolution.enabled // false),
        lock_branch: (.lock_branch.enabled // false),
        allow_fork_syncing: (.allow_fork_syncing.enabled // false)
      }'
  )"

  echo "Applying branch protection for '${branch}' to ${target_repo}"
  if [[ "${DRY_RUN}" == "true" ]]; then
    jq . <<<"${payload}"
  else
    api_with_method PUT "repos/${target_repo}/branches/${encoded_branch}/protection" --input - <<<"${payload}" >/dev/null
  fi
}

DRY_RUN="false"
declare -a BRANCHES=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --branch)
      [[ $# -ge 2 ]] || die "--branch requires a value"
      BRANCHES+=("$2")
      shift 2
      ;;
    --dry-run)
      DRY_RUN="true"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    --)
      shift
      break
      ;;
    -*)
      die "unknown option: $1"
      ;;
    *)
      break
      ;;
  esac
done

[[ $# -eq 2 ]] || {
  usage >&2
  exit 1
}

SOURCE_REPO="$1"
TARGET_REPO="$2"

[[ "${SOURCE_REPO}" == */* ]] || die "source repository must be OWNER/REPO"
[[ "${TARGET_REPO}" == */* ]] || die "target repository must be OWNER/REPO"

require_cmd gh
require_cmd jq

gh auth status >/dev/null 2>&1 || die "run 'gh auth login' first"

api "repos/${SOURCE_REPO}" >/dev/null
api "repos/${TARGET_REPO}" >/dev/null

if [[ ${#BRANCHES[@]} -eq 0 ]]; then
  BRANCHES+=("$(api "repos/${SOURCE_REPO}" --jq '.default_branch')")
fi

copy_rulesets "${SOURCE_REPO}" "${TARGET_REPO}"

for branch in "${BRANCHES[@]}"; do
  copy_branch_protection "${SOURCE_REPO}" "${TARGET_REPO}" "${branch}"
done
