#!/usr/bin/env python3
"""Resolve signer-role policy from PR content and the author's role set."""

from __future__ import annotations

import argparse
import base64
import json
import re
import sys
from pathlib import Path
from typing import Any


ROLE_DISPLAY_NAMES = {
    "qa_lead": "Quality Assurance Lead",
    "engineer": "Engineer",
    "engineering_lead": "Engineering Lead",
    "technical_qms_maintainer": "Technical QMS Maintainer",
    "regulatory_lead": "Regulatory Lead",
    "usability_lead": "Usability Lead",
    "management_representative": "Management Representative",
}

TECHNICAL_QMS_MAINTAINER_PREFIXES = (
    ".github/",
    "scripts/",
    "services/signature-worker/",
    "tools/",
)

CONTROLLED_DOCUMENT_SIGNATURE_MEANING = "Approved Controlled Document Revision"
DEFAULT_SIGNATURE_MEANING = "Approved Quality Record"
CONTROLLED_DOCUMENT_SIGNER_ROLES = [
    "Management Representative",
    "Quality Assurance Lead",
]
CONTROLLED_DOCUMENT_REQUIRED_SIGNATURES = 2

CONTROLLED_DOC_PREFIXES = ("qm/", "sops/", "wis/")

EXECUTION_RECORD_PREFIX = "records/"


def _normalize_label(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", str(value or "").strip().lower()).strip()


def _display_name_for_role(role_id: str) -> str:
    return ROLE_DISPLAY_NAMES.get(role_id, role_id.replace("_", " ").title())


def _role_id_for_label(label: str) -> str | None:
    normalized = _normalize_label(label)
    for role_id, display in ROLE_DISPLAY_NAMES.items():
        if normalized in {_normalize_label(role_id), _normalize_label(display)}:
            return role_id
    return None


def _extract_signature_field(body: str, label: str) -> str | None:
    pattern = rf"\*\*{re.escape(label)}:\*\*\s*([^\n]+)"
    match = re.search(pattern, body, flags=re.IGNORECASE)
    if not match:
        return None
    raw = match.group(1).strip()
    if not raw or raw.startswith("["):
        return None
    return raw


def _parse_meaning(body: str) -> str:
    return _extract_signature_field(body, "Meaning of Signature") or ""


def _parse_roles(body: str) -> list[str]:
    raw = _extract_signature_field(body, "Signer Roles") or ""
    if not raw:
        return []
    return [part.strip() for part in re.split(r"[;,]", raw) if part.strip()]


def _parse_required_signatures(body: str) -> int:
    raw = _extract_signature_field(body, "Required Signatures") or ""
    if not raw:
        return 1
    try:
        value = int(raw)
    except ValueError:
        return 1
    return value if value > 0 else 1


def _strip_yaml_quotes(value: str) -> str:
    stripped = value.strip()
    if len(stripped) >= 2 and stripped[0] == stripped[-1] and stripped[0] in {"'", '"'}:
        return stripped[1:-1]
    return stripped


def _load_training_matrix(path: Path) -> dict[str, Any]:
    users: dict[str, dict[str, str]] = {}
    roles: dict[str, dict[str, list[str]]] = {}

    section = ""
    current_user = ""
    current_role = ""
    in_role_users = False

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.rstrip()
        if not line or line.lstrip().startswith("#"):
            continue

        indent = len(line) - len(line.lstrip(" "))
        stripped = line.strip()

        if indent == 0 and stripped == "users:":
            section = "users"
            current_user = ""
            current_role = ""
            in_role_users = False
            continue
        if indent == 0 and stripped == "roles:":
            section = "roles"
            current_user = ""
            current_role = ""
            in_role_users = False
            continue

        if section == "users":
            if indent == 2 and stripped.endswith(":"):
                current_user = stripped[:-1]
                users.setdefault(current_user, {})
                continue
            if current_user and indent == 4 and stripped.startswith("job_title:"):
                _, value = stripped.split(":", 1)
                users[current_user]["job_title"] = _strip_yaml_quotes(value)
                continue

        if section == "roles":
            if indent == 2 and stripped.endswith(":"):
                current_role = stripped[:-1]
                roles.setdefault(current_role, {"users": []})
                in_role_users = False
                continue
            if current_role and indent == 4 and stripped == "users:":
                in_role_users = True
                continue
            if current_role and indent == 4 and stripped.endswith(":") and stripped != "users:":
                in_role_users = False
                continue
            if current_role and in_role_users and indent == 6 and stripped.startswith("- "):
                roles[current_role]["users"].append(_strip_yaml_quotes(stripped[2:]))

    return {"users": users, "roles": roles}


def _load_front_matter_roles(repo_root: Path, relative_path: str) -> list[str]:
    path = repo_root / relative_path
    if not path.exists() or not path.is_file():
        return []
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        return []
    end_index = text.find("\n---\n", 4)
    if end_index == -1:
        return []
    front_matter = text[4:end_index]
    roles: list[str] = []
    for key in ("owner_role", "approver_role"):
        match = re.search(rf"^{key}:\s*(.+)$", front_matter, flags=re.MULTILINE)
        value = _strip_yaml_quotes(match.group(1)) if match else ""
        if value:
            roles.append(value)
    return roles


def _qualifies_for_role(role_id: str, author_role_ids: set[str], author_job_title: str) -> bool:
    if role_id in author_role_ids:
        return True
    return role_id == "management_representative" and _normalize_label(author_job_title) == _normalize_label(
        _display_name_for_role(role_id)
    )


def _matches_role_sequence(actual_roles: list[str], expected_roles: list[str]) -> bool:
    return [_normalize_label(role) for role in actual_roles] == [_normalize_label(role) for role in expected_roles]


def _infer_content_signature_policy(paths: list[str]) -> dict[str, Any] | None:
    if any(path.startswith(("qm/", "sops/")) and path.lower().endswith(".md") for path in paths):
        return {
            "meaning": CONTROLLED_DOCUMENT_SIGNATURE_MEANING,
            "roles": list(CONTROLLED_DOCUMENT_SIGNER_ROLES),
            "required_signatures": CONTROLLED_DOCUMENT_REQUIRED_SIGNATURES,
            "reason": "controlled QM/SOP document changes",
        }
    return None


def _infer_role_candidates(repo_root: Path, paths: list[str]) -> tuple[list[str], list[str]]:
    candidates: list[str] = []
    reasons: list[str] = []

    def add_candidate(role_id: str, reason: str) -> None:
        if role_id not in candidates:
            candidates.append(role_id)
        if reason not in reasons:
            reasons.append(reason)

    if any(path.startswith(TECHNICAL_QMS_MAINTAINER_PREFIXES) for path in paths):
        add_candidate("technical_qms_maintainer", "repository tooling/policy changes")

    controlled_doc_paths = [
        path
        for path in paths
        if path.startswith(CONTROLLED_DOC_PREFIXES) and path.lower().endswith(".md")
    ]
    controlled_doc_roles: list[str] = []
    for relative_path in controlled_doc_paths:
        for role_id in _load_front_matter_roles(repo_root, relative_path):
            if role_id not in controlled_doc_roles:
                controlled_doc_roles.append(role_id)
    for role_id in controlled_doc_roles:
        add_candidate(role_id, "controlled document metadata")

    if any(path.startswith("matrices/") for path in paths):
        add_candidate("management_representative", "matrix/role changes")

    if any(path.startswith(EXECUTION_RECORD_PREFIX) for path in paths):
        if "execution record changes" not in reasons:
            reasons.append("execution record changes")

    return candidates, reasons


def _write_outputs(outputs: dict[str, str], github_output_path: str | None) -> None:
    if not github_output_path:
        return
    with Path(github_output_path).open("a", encoding="utf-8") as fh:
        for key, value in outputs.items():
            fh.write(f"{key}={value}\n")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo-root", default=".")
    parser.add_argument("--author", required=True)
    parser.add_argument("--body-base64", required=True)
    parser.add_argument("--paths-json", required=True)
    parser.add_argument("--github-output")
    args = parser.parse_args()

    repo_root = Path(args.repo_root).resolve()
    training_matrix = _load_training_matrix(repo_root / "matrices" / "training_matrix.yml")
    users = training_matrix.get("users", {}) or {}
    roles = training_matrix.get("roles", {}) or {}

    author = args.author.strip()
    author_key = author.lower()
    author_profile = next(
        (profile for login, profile in users.items() if str(login).strip().lower() == author_key),
        {},
    )
    author_job_title = str((author_profile or {}).get("job_title") or "").strip()
    author_role_ids = [
        role_id
        for role_id, role_data in roles.items()
        if any(str(user).strip().lower() == author_key for user in (role_data.get("users", []) or []))
    ]
    author_role_id_set = set(author_role_ids)

    try:
        body = base64.b64decode(args.body_base64.encode("utf-8")).decode("utf-8")
    except Exception as exc:  # pragma: no cover - defensive decoding path
        raise SystemExit(f"Could not decode PR body: {exc}") from exc

    try:
        paths = json.loads(args.paths_json)
    except json.JSONDecodeError as exc:
        raise SystemExit(f"Could not parse changed paths JSON: {exc}") from exc
    if not isinstance(paths, list) or not all(isinstance(path, str) for path in paths):
        raise SystemExit("Changed paths must be a JSON array of strings.")
    changed_paths = [str(path) for path in paths]

    explicit_roles = _parse_roles(body)
    explicit_meaning = _parse_meaning(body)
    required_signatures = _parse_required_signatures(body)
    inferred_role_candidates, inference_reasons = _infer_role_candidates(repo_root, changed_paths)
    eligible_inferred_roles = [
        role_id
        for role_id in inferred_role_candidates
        if _qualifies_for_role(role_id, author_role_id_set, author_job_title)
    ]
    content_policy = _infer_content_signature_policy(changed_paths)

    if content_policy:
        expected_meaning = str(content_policy["meaning"])
        expected_roles = list(content_policy["roles"])
        expected_required_signatures = int(content_policy["required_signatures"])
        expected_primary_role_id = _role_id_for_label(expected_roles[0])
        if expected_primary_role_id and not _qualifies_for_role(
            expected_primary_role_id, author_role_id_set, author_job_title
        ):
            raise SystemExit(
                f"PRs touching QM/SOP controlled documents require the author to be eligible for "
                f"primary signer role '{expected_roles[0]}'. Author @{author} is not."
            )
        if explicit_meaning != expected_meaning:
            raise SystemExit(
                "PRs touching QM/SOP controlled documents must declare "
                f"'**Meaning of Signature:** {expected_meaning}'."
            )
        if not _matches_role_sequence(explicit_roles, expected_roles):
            raise SystemExit(
                "PRs touching QM/SOP controlled documents must declare "
                f"'**Signer Roles:** {'; '.join(expected_roles)}'."
            )
        if required_signatures != expected_required_signatures:
            raise SystemExit(
                "PRs touching QM/SOP controlled documents must declare "
                f"'**Required Signatures:** {expected_required_signatures}'."
            )
        final_roles = expected_roles
        required_signatures = expected_required_signatures
        meaning_of_signature = expected_meaning
        source = "content_policy"
        summary = (
            f"Applied the fixed signature policy for {content_policy['reason']}: "
            f"{'; '.join(expected_roles)} with {expected_required_signatures} required signatures."
        )
    elif explicit_roles:
        if len(explicit_roles) != required_signatures:
            raise SystemExit(
                f"Explicit signer roles count ({len(explicit_roles)}) must match required signatures ({required_signatures})."
            )
        explicit_primary_role = explicit_roles[0]
        explicit_primary_role_id = _role_id_for_label(explicit_primary_role)
        if explicit_primary_role_id and not _qualifies_for_role(
            explicit_primary_role_id, author_role_id_set, author_job_title
        ):
            raise SystemExit(
                f"PR author @{author} is not eligible for explicit primary signer role '{explicit_primary_role}'. "
                "The first listed '**Signer Roles:**' entry is treated as the PR author's role; "
                "reviewer/co-signer roles must come after it."
            )
        final_roles = explicit_roles
        meaning_of_signature = explicit_meaning or DEFAULT_SIGNATURE_MEANING
        source = "explicit"
        summary = "Using explicit signer roles from the PR body."
    else:
        if required_signatures != 1:
            raise SystemExit(
                "PRs requiring multiple signatures must declare explicit '**Signer Roles:**' in the PR body."
            )
        if len(eligible_inferred_roles) == 1:
            final_roles = [_display_name_for_role(eligible_inferred_roles[0])]
            meaning_of_signature = explicit_meaning or DEFAULT_SIGNATURE_MEANING
            source = "inferred"
            summary = (
                f"Inferred signer role '{final_roles[0]}' from {', '.join(inference_reasons) or 'PR content'} "
                f"and author role set."
            )
        elif len(eligible_inferred_roles) > 1:
            display_roles = ", ".join(_display_name_for_role(role_id) for role_id in eligible_inferred_roles)
            raise SystemExit(
                f"Signer role is ambiguous for @{author}. Eligible inferred roles: {display_roles}. "
                "Declare '**Signer Roles:**' explicitly in the PR body."
            )
        else:
            display_roles = ", ".join(_display_name_for_role(role_id) for role_id in inferred_role_candidates)
            author_roles = ", ".join(_display_name_for_role(role_id) for role_id in author_role_ids)
            detail = f" Candidate content roles: {display_roles}." if display_roles else ""
            raise SystemExit(
                f"Could not infer a signer role for @{author} from the changed content and author role set.{detail} "
                f"Author roles: {author_roles or 'none resolved'}. Declare '**Signer Roles:**' explicitly in the PR body."
            )

    outputs = {
        "signatory_roles": "; ".join(final_roles),
        "signatory_roles_json": json.dumps(final_roles),
        "meaning_of_signature": meaning_of_signature,
        "required_signatures": str(required_signatures),
        "required_reviewer_signatures": str(max(0, required_signatures - 1)),
        "role_resolution_source": source,
        "role_resolution_summary": summary,
        "author_role_ids": ",".join(author_role_ids),
        "author_job_title": author_job_title,
        "inferred_role_candidates": ",".join(inferred_role_candidates),
        "inference_reasons": "; ".join(inference_reasons),
    }
    _write_outputs(outputs, args.github_output)
    print(json.dumps(outputs, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
