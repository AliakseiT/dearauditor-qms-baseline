#!/usr/bin/env python3
"""Rebuild current training status artifacts from signed training issues."""

from __future__ import annotations

import argparse
import csv
import json
import re
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

import yaml


CHECKLIST_SECTION_RE = re.compile(
    r"### (?:Controlled Document Checklist|SOP Delta Checklist)([\s\S]*?)(?:\n###\s|\n##\s|$)",
    flags=re.IGNORECASE,
)
CHECKLIST_ITEM_RE = re.compile(
    r"^- \[(?: |x|X)\]\s+`?((?:QM|SOP|WI)-\d+)`?(?:.*?):\s+`?([^`\n]+?)`?\s*->\s*`?([^`\n]+?)`?\s*$",
    flags=re.MULTILINE,
)
MARKER_USER_RE = re.compile(r"training-release:user=([A-Za-z0-9-]+)", flags=re.IGNORECASE)
TRAINING_USER_LINE_RE = re.compile(
    r"- Training user:\s+`([^`]+)`\s+\(`@([A-Za-z0-9-]+)`\)",
    flags=re.IGNORECASE,
)
ROLES_LINE_RE = re.compile(r"- Roles in scope:\s+`([^`]+)`", flags=re.IGNORECASE)
JSON_BLOCK_RE = re.compile(r"```json\s*([\s\S]*?)```", flags=re.IGNORECASE)
COMPLETE_CONTEXT_RE = re.compile(
    r"<!-- TRAINING_COMPLETION_CONTEXT_V1\s*([\s\S]*?)-->",
    flags=re.IGNORECASE,
)
RELEASE_URL_RE = re.compile(r"^Immutable signature release:\s*(\S+)\s*$", flags=re.MULTILINE)
RELEASE_TAG_RE = re.compile(r"^Release tag:\s*`([^`]+)`\s*$", flags=re.MULTILINE)
REPOSITORY_ALIASES = {
    "aliakseit/dearauditor-qms-baseline": {"aliakseit/qms-lite"},
}


def _parse_revision(value: str) -> int:
    match = re.fullmatch(r"R(\d+)", str(value or "").strip().upper())
    return int(match.group(1)) if match else -1


def _newer_revision(candidate: str, baseline: str) -> bool:
    return _parse_revision(candidate) > _parse_revision(baseline)


def _timestamp_key(value: str) -> tuple[int, str]:
    if not value:
        return (0, "")
    try:
        return (1, datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(UTC).isoformat())
    except ValueError:
        return (0, value)


def _parse_json_block(text: str) -> dict[str, Any] | None:
    match = JSON_BLOCK_RE.search(str(text or ""))
    if not match or not match.group(1):
        return None
    try:
        payload = json.loads(match.group(1))
    except json.JSONDecodeError:
        return None
    return payload if isinstance(payload, dict) else None


def _parse_completion_context(text: str) -> dict[str, Any] | None:
    match = COMPLETE_CONTEXT_RE.search(str(text or ""))
    if not match or not match.group(1):
        return None
    try:
        payload = json.loads(match.group(1).strip())
    except json.JSONDecodeError:
        return None
    return payload if isinstance(payload, dict) else None


def _extract_roles(body: str) -> list[str]:
    match = ROLES_LINE_RE.search(body or "")
    if not match:
        return []
    raw = match.group(1).strip()
    if not raw or raw.lower() == "none":
        return []
    return [part.strip() for part in raw.split(",") if part.strip()]


def _extract_training_user(body: str) -> tuple[str, str]:
    match = TRAINING_USER_LINE_RE.search(body or "")
    if match:
        return match.group(1).strip(), match.group(2).strip()
    marker = MARKER_USER_RE.search(body or "")
    return ("", marker.group(1).strip() if marker else "")


def _extract_checklist_documents(body: str) -> list[dict[str, str]]:
    match = CHECKLIST_SECTION_RE.search(body or "")
    if not match:
        return []
    section = match.group(1) or ""
    documents: list[dict[str, str]] = []
    for item in CHECKLIST_ITEM_RE.finditer(section):
        documents.append(
            {
                "doc_id": item.group(1).strip().upper(),
                "from_revision": item.group(2).strip().upper(),
                "to_revision": item.group(3).strip().upper(),
            }
        )
    return documents


def _accepted_repositories(repo_full_name: str) -> set[str]:
    canonical = repo_full_name.strip().lower()
    accepted = {canonical} if canonical else set()
    accepted.update(REPOSITORY_ALIASES.get(canonical, set()))
    return accepted


def _normalize_login(value: Any) -> str:
    return str(value or "").strip().lower()


def _find_latest_valid_attestation(
    issue: dict[str, Any], accepted_repositories: set[str], expected_signer: str
) -> tuple[dict[str, Any], str] | tuple[None, None]:
    comments = list(issue.get("comments", []) or [])
    comments.sort(key=lambda item: str(item.get("created_at") or ""))
    expected_signer = _normalize_login(expected_signer)

    for comment in reversed(comments):
        body = str(comment.get("body") or "")
        if not any(
            marker in body
            for marker in (
                "<!-- SIGNATURE_ATTESTATION_V1 -->",
                "<!-- PART11_ATTESTATION_V1 -->",
                "<!-- signature-native-attestation -->",
                "<!-- part11-native-attestation -->",
            )
        ):
            continue
        payload = _parse_json_block(body)
        if not payload:
            continue
        if str(payload.get("repository") or "").strip().lower() not in accepted_repositories:
            continue
        if int(payload.get("pr_number") or 0) != int(issue.get("number") or 0):
            continue
        signer = _normalize_login(payload.get("user_id") or payload.get("actor_login"))
        if expected_signer and signer != expected_signer:
            continue
        return payload, str(comment.get("html_url") or "")

    return None, None


def _find_latest_completion_comment(issue: dict[str, Any]) -> dict[str, Any] | None:
    comments = list(issue.get("comments", []) or [])
    comments.sort(key=lambda item: str(item.get("created_at") or ""))
    for comment in reversed(comments):
        body = str(comment.get("body") or "")
        if "<!-- training-signature-complete -->" not in body:
            continue
        return comment
    return None


def _event_from_completion_context(
    issue: dict[str, Any], completion_comment: dict[str, Any], context_payload: dict[str, Any]
) -> dict[str, Any] | None:
    documents = context_payload.get("documents", []) or []
    if not isinstance(documents, list) or not documents:
        return None
    return {
        "issue_number": int(context_payload.get("source_issue") or issue.get("number") or 0),
        "issue_title": str(context_payload.get("source_issue_title") or issue.get("title") or "").strip(),
        "issue_url": str(context_payload.get("source_issue_url") or issue.get("html_url") or "").strip(),
        "trainee_login": _normalize_login(context_payload.get("trainee_login")),
        "trainee_full_name": str(context_payload.get("trainee_full_name") or "").strip(),
        "roles_in_scope": [str(role).strip() for role in (context_payload.get("roles_in_scope") or []) if str(role).strip()],
        "completed_at_utc": str(context_payload.get("completed_at_utc") or "").strip(),
        "attestation_comment_url": str(context_payload.get("source_attestation_comment_url") or "").strip(),
        "evidence_release_tag": str(context_payload.get("evidence_release_tag") or "").strip(),
        "evidence_release_url": str(context_payload.get("evidence_release_url") or "").strip(),
        "signer_login": _normalize_login(context_payload.get("signer_login")),
        "signer_full_name": str(context_payload.get("signer_full_name") or "").strip(),
        "meaning_of_signature": str(context_payload.get("meaning_of_signature") or "Completed QMS Training Review").strip(),
        "documents": [
            {
                "doc_id": str(doc.get("doc_id") or "").strip().upper(),
                "from_revision": str(doc.get("from_revision") or "").strip().upper(),
                "to_revision": str(doc.get("to_revision") or "").strip().upper(),
            }
            for doc in documents
            if str(doc.get("doc_id") or "").strip()
        ],
        "completion_comment_url": str(completion_comment.get("html_url") or "").strip(),
    }


def _event_from_legacy_issue(issue: dict[str, Any], accepted_repositories: set[str]) -> dict[str, Any] | None:
    body = str(issue.get("body") or "")
    full_name, marker_user = _extract_training_user(body)
    assignee_login = _normalize_login((((issue.get("assignees") or []) or [{}])[0] or {}).get("login"))
    trainee_login = assignee_login or _normalize_login(marker_user)
    if not trainee_login:
        return None

    documents = _extract_checklist_documents(body)
    if not documents:
        return None

    attestation, attestation_comment_url = _find_latest_valid_attestation(issue, accepted_repositories, trainee_login)
    if not attestation:
        return None

    completion_comment = _find_latest_completion_comment(issue)
    completion_body = str((completion_comment or {}).get("body") or "")
    release_url_match = RELEASE_URL_RE.search(completion_body)
    release_tag_match = RELEASE_TAG_RE.search(completion_body)

    return {
        "issue_number": int(issue.get("number") or 0),
        "issue_title": str(issue.get("title") or "").strip(),
        "issue_url": str(issue.get("html_url") or "").strip(),
        "trainee_login": trainee_login,
        "trainee_full_name": full_name,
        "roles_in_scope": _extract_roles(body),
        "completed_at_utc": str(attestation.get("timestamp") or "").strip(),
        "attestation_comment_url": attestation_comment_url,
        "evidence_release_tag": release_tag_match.group(1).strip() if release_tag_match else "",
        "evidence_release_url": release_url_match.group(1).strip() if release_url_match else "",
        "signer_login": _normalize_login(attestation.get("user_id") or attestation.get("actor_login")),
        "signer_full_name": str(attestation.get("signer_full_name") or "").strip(),
        "meaning_of_signature": str(attestation.get("meaning_of_signature") or "Completed QMS Training Review").strip(),
        "documents": documents,
        "completion_comment_url": str((completion_comment or {}).get("html_url") or "").strip(),
    }


def _extract_training_events(issues: list[dict[str, Any]], repo_full_name: str) -> list[dict[str, Any]]:
    accepted_repositories = _accepted_repositories(repo_full_name)
    events: list[dict[str, Any]] = []
    for issue in issues:
        if issue.get("pull_request"):
            continue
        completion_comment = _find_latest_completion_comment(issue)
        if completion_comment:
            payload = _parse_completion_context(str(completion_comment.get("body") or ""))
            if payload:
                event = _event_from_completion_context(issue, completion_comment, payload)
                if event:
                    events.append(event)
                    continue
        event = _event_from_legacy_issue(issue, accepted_repositories)
        if event:
            events.append(event)
    events.sort(key=lambda item: (_timestamp_key(str(item.get("completed_at_utc") or "")), int(item.get("issue_number") or 0)))
    return events


def _matrix_user_roles(matrix: dict[str, Any]) -> dict[str, list[str]]:
    roles = matrix.get("roles", {}) or {}
    user_roles: dict[str, list[str]] = {}
    for role_name, role_def in roles.items():
        for login in role_def.get("users", []) or []:
            login_text = _normalize_login(login)
            if not login_text:
                continue
            user_roles.setdefault(login_text, [])
            if role_name not in user_roles[login_text]:
                user_roles[login_text].append(role_name)
    return {user: sorted(role_list) for user, role_list in user_roles.items()}


def _matrix_required_revisions(matrix: dict[str, Any]) -> dict[str, dict[str, dict[str, Any]]]:
    roles = matrix.get("roles", {}) or {}
    requirements: dict[str, dict[str, dict[str, Any]]] = {}
    for role_name, role_def in roles.items():
        users = [_normalize_login(user) for user in (role_def.get("users", []) or []) if _normalize_login(user)]
        required_revisions = {
            str(doc_id).strip().upper(): str(revision).strip().upper()
            for doc_id, revision in (role_def.get("required_revisions", {}) or {}).items()
            if str(doc_id).strip() and str(revision).strip()
        }
        for user in users:
            user_reqs = requirements.setdefault(user, {})
            for doc_id, revision in required_revisions.items():
                current = user_reqs.get(doc_id)
                if not current:
                    user_reqs[doc_id] = {"required_revision": revision, "roles": [role_name]}
                    continue
                if role_name not in current["roles"]:
                    current["roles"].append(role_name)
                if _newer_revision(revision, str(current.get("required_revision") or "")):
                    current["required_revision"] = revision
    for user_docs in requirements.values():
        for doc_entry in user_docs.values():
            doc_entry["roles"] = sorted(doc_entry.get("roles", []))
    return requirements


def _build_status_document(
    matrix: dict[str, Any], events: list[dict[str, Any]], repository: str
) -> dict[str, Any]:
    users_cfg = {
        _normalize_login(login): profile
        for login, profile in (matrix.get("users", {}) or {}).items()
        if _normalize_login(login)
    }
    user_roles = _matrix_user_roles(matrix)

    result: dict[str, Any] = {
        "version": 1,
        "generated_at_utc": datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "source_repository": repository,
        "source_event_count": len(events),
        "users": {},
    }

    for event in events:
        trainee_login = _normalize_login(event.get("trainee_login"))
        if not trainee_login:
            continue
        user_profile = users_cfg.get(trainee_login, {}) or {}
        user_entry = result["users"].setdefault(
            trainee_login,
            {
                "full_name": str(event.get("trainee_full_name") or user_profile.get("full_name") or trainee_login).strip(),
                "current_roles": user_roles.get(trainee_login, []),
                "documents": {},
            },
        )
        if not user_entry.get("full_name"):
            user_entry["full_name"] = trainee_login
        if not user_entry.get("current_roles"):
            user_entry["current_roles"] = user_roles.get(trainee_login, [])

        for document in event.get("documents", []) or []:
            doc_id = str(document.get("doc_id") or "").strip().upper()
            to_revision = str(document.get("to_revision") or "").strip().upper()
            if not doc_id or not to_revision:
                continue
            current = user_entry["documents"].get(doc_id)
            candidate_time = str(event.get("completed_at_utc") or "")
            should_replace = current is None
            if current is not None:
                current_time = str(current.get("trained_at_utc") or "")
                should_replace = _timestamp_key(candidate_time) >= _timestamp_key(current_time)
            if not should_replace:
                continue
            user_entry["documents"][doc_id] = {
                "trained_revision": to_revision,
                "trained_at_utc": candidate_time,
                "from_revision": str(document.get("from_revision") or "").strip().upper(),
                "roles_in_scope": sorted(
                    {str(role).strip() for role in (event.get("roles_in_scope") or []) if str(role).strip()}
                ),
                "source_issue": int(event.get("issue_number") or 0),
                "source_issue_title": str(event.get("issue_title") or "").strip(),
                "source_issue_url": str(event.get("issue_url") or "").strip(),
                "completion_comment_url": str(event.get("completion_comment_url") or "").strip(),
                "attestation_comment_url": str(event.get("attestation_comment_url") or "").strip(),
                "evidence_release_tag": str(event.get("evidence_release_tag") or "").strip(),
                "evidence_release_url": str(event.get("evidence_release_url") or "").strip(),
                "signer_login": _normalize_login(event.get("signer_login")),
                "signer_full_name": str(event.get("signer_full_name") or "").strip(),
                "meaning_of_signature": str(event.get("meaning_of_signature") or "Completed QMS Training Review").strip(),
            }

    for user_entry in result["users"].values():
        user_entry["documents"] = dict(sorted(user_entry.get("documents", {}).items()))

    result["users"] = dict(sorted(result["users"].items()))
    return result


def _render_markdown_report(
    matrix: dict[str, Any], status: dict[str, Any], output_path: Path
) -> list[dict[str, str]]:
    users_cfg = {
        _normalize_login(login): profile
        for login, profile in (matrix.get("users", {}) or {}).items()
        if _normalize_login(login)
    }
    user_roles = _matrix_user_roles(matrix)
    required_by_user = _matrix_required_revisions(matrix)
    status_users = status.get("users", {}) or {}

    all_users = sorted(set(users_cfg.keys()) | set(required_by_user.keys()) | set(status_users.keys()))
    generated_at = str(status.get("generated_at_utc") or "")
    source_repository = str(status.get("source_repository") or "")
    lines = [
        "# Training Status Report",
        "",
        f"- Generated at: `{generated_at or 'n/a'}`",
        f"- Source repository: `{source_repository or 'n/a'}`",
        f"- Signed training events considered: `{status.get('source_event_count', 0)}`",
        "",
        "This report is generated from signed training issues and their immutable evidence links.",
        "",
        "## User Summary",
        "",
        "| Person | Login | Role(s) | Required Docs | Current | Missing/Outdated | Last Signed Training |",
        "|---|---|---|---:|---:|---:|---|",
    ]

    detailed_rows: list[dict[str, str]] = []
    additional_rows: list[dict[str, str]] = []

    for user in all_users:
        profile = users_cfg.get(user, {}) or {}
        full_name = str((status_users.get(user, {}) or {}).get("full_name") or profile.get("full_name") or user).strip()
        roles = (status_users.get(user, {}) or {}).get("current_roles") or user_roles.get(user) or []
        required_docs = required_by_user.get(user, {})
        trained_docs = ((status_users.get(user, {}) or {}).get("documents") or {})

        current_count = 0
        missing_or_outdated = 0
        last_signed = ""
        for doc_id, requirement in required_docs.items():
            trained = trained_docs.get(doc_id, {}) or {}
            required_revision = str(requirement.get("required_revision") or "").strip().upper()
            trained_revision = str(trained.get("trained_revision") or "").strip().upper()
            status_label = "Missing"
            if trained_revision and _parse_revision(trained_revision) >= _parse_revision(required_revision):
                status_label = "Current"
                current_count += 1
            else:
                missing_or_outdated += 1
                if trained_revision:
                    status_label = "Outdated"

            trained_at = str(trained.get("trained_at_utc") or "")
            if _timestamp_key(trained_at) > _timestamp_key(last_signed):
                last_signed = trained_at

            detailed_rows.append(
                {
                    "person": full_name,
                    "login": user,
                    "roles": ", ".join(roles),
                    "document": doc_id,
                    "required_revision": required_revision,
                    "trained_revision": trained_revision or "UNTRAINED",
                    "status": status_label,
                    "completed_on": trained_at,
                    "evidence_release_tag": str(trained.get("evidence_release_tag") or ""),
                    "evidence_release_url": str(trained.get("evidence_release_url") or ""),
                    "source_issue": str(trained.get("source_issue") or ""),
                    "source_issue_url": str(trained.get("source_issue_url") or ""),
                }
            )

        lines.append(
            "| {person} | `@{login}` | {roles} | {required_total} | {current_count} | {gap_count} | {last_signed} |".format(
                person=full_name,
                login=user,
                roles=", ".join(roles) or "none",
                required_total=len(required_docs),
                current_count=current_count,
                gap_count=missing_or_outdated,
                last_signed=last_signed or "n/a",
            )
        )

        additional_doc_ids = sorted(set(trained_docs.keys()) - set(required_docs.keys()))
        for doc_id in additional_doc_ids:
            trained = trained_docs.get(doc_id, {}) or {}
            additional_rows.append(
                {
                    "person": full_name,
                    "login": user,
                    "document": doc_id,
                    "trained_revision": str(trained.get("trained_revision") or "").strip().upper() or "UNTRAINED",
                    "completed_on": str(trained.get("trained_at_utc") or ""),
                    "evidence_release_tag": str(trained.get("evidence_release_tag") or ""),
                    "evidence_release_url": str(trained.get("evidence_release_url") or ""),
                    "source_issue": str(trained.get("source_issue") or ""),
                    "source_issue_url": str(trained.get("source_issue_url") or ""),
                }
            )

    lines.extend(
        [
            "",
            "## Required Training Detail",
            "",
            "| Person | Login | Role(s) | Document | Required Rev | Trained Rev | Status | Completed On | Evidence |",
            "|---|---|---|---|---|---|---|---|---|",
        ]
    )
    for row in detailed_rows:
        release_link = (
            f"[`{row['evidence_release_tag']}`]({row['evidence_release_url']})"
            if row["evidence_release_tag"] and row["evidence_release_url"]
            else "n/a"
        )
        issue_link = (
            f"[#{row['source_issue']}]({row['source_issue_url']})"
            if row["source_issue"] and row["source_issue_url"]
            else "n/a"
        )
        lines.append(
            f"| {row['person']} | `@{row['login']}` | {row['roles'] or 'none'} | `{row['document']}` | "
            f"`{row['required_revision'] or 'n/a'}` | `{row['trained_revision']}` | {row['status']} | "
            f"{row['completed_on'] or 'n/a'} | {release_link}; {issue_link} |"
        )

    lines.extend(["", "## Additional Signed Training Not Currently Required", ""])
    if additional_rows:
        lines.extend(
            [
                "| Person | Login | Document | Trained Rev | Completed On | Evidence |",
                "|---|---|---|---|---|---|",
            ]
        )
        for row in additional_rows:
            release_link = (
                f"[`{row['evidence_release_tag']}`]({row['evidence_release_url']})"
                if row["evidence_release_tag"] and row["evidence_release_url"]
                else "n/a"
            )
            issue_link = (
                f"[#{row['source_issue']}]({row['source_issue_url']})"
                if row["source_issue"] and row["source_issue_url"]
                else "n/a"
            )
            lines.append(
                f"| {row['person']} | `@{row['login']}` | `{row['document']}` | `{row['trained_revision']}` | "
                f"{row['completed_on'] or 'n/a'} | {release_link}; {issue_link} |"
            )
    else:
        lines.append("No additional signed training outside the current role requirements.")

    output_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return detailed_rows


def _write_csv(rows: list[dict[str, str]], output_path: Path) -> None:
    fieldnames = [
        "person",
        "login",
        "roles",
        "document",
        "required_revision",
        "trained_revision",
        "status",
        "completed_on",
        "evidence_release_tag",
        "evidence_release_url",
        "source_issue",
        "source_issue_url",
    ]
    with output_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--issues-json", required=True, help="Path to training issue export JSON.")
    parser.add_argument("--training-matrix", required=True, help="Path to training matrix YAML.")
    parser.add_argument("--status-yaml", required=True, help="Output path for training status YAML.")
    parser.add_argument("--report-md", required=True, help="Output path for auditor-facing Markdown report.")
    parser.add_argument("--report-csv", required=True, help="Output path for auditor-facing CSV export.")
    parser.add_argument("--repository", default="", help="GitHub owner/repo for issue validation.")
    args = parser.parse_args()

    issues = json.loads(Path(args.issues_json).read_text(encoding="utf-8"))
    matrix = yaml.safe_load(Path(args.training_matrix).read_text(encoding="utf-8")) or {}
    repository = args.repository.strip()

    events = _extract_training_events(issues if isinstance(issues, list) else [], repository)
    status = _build_status_document(matrix, events, repository)

    status_yaml_path = Path(args.status_yaml)
    status_yaml_path.write_text(yaml.safe_dump(status, sort_keys=False), encoding="utf-8")

    report_rows = _render_markdown_report(matrix, status, Path(args.report_md))
    _write_csv(report_rows, Path(args.report_csv))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
