#!/usr/bin/env python3
"""Resolve reviewer candidates from CODEOWNERS and fallback role mappings."""

from __future__ import annotations

import argparse
import json
import re
import shlex
import subprocess
import sys
import tempfile
from pathlib import Path


def _strip_yaml_quotes(value: str) -> str:
    stripped = value.strip()
    if len(stripped) >= 2 and stripped[0] == stripped[-1] and stripped[0] in {"'", '"'}:
        return stripped[1:-1]
    return stripped


def _load_training_matrix(path: Path) -> dict[str, dict[str, list[str]]]:
    roles: dict[str, dict[str, list[str]]] = {}
    section = ""
    current_role = ""
    in_role_users = False

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.rstrip()
        if not line or line.lstrip().startswith("#"):
            continue

        indent = len(line) - len(line.lstrip(" "))
        stripped = line.strip()

        if indent == 0 and stripped == "roles:":
            section = "roles"
            current_role = ""
            in_role_users = False
            continue
        if indent == 0 and stripped.endswith(":"):
            section = ""
            current_role = ""
            in_role_users = False
            continue

        if section != "roles":
            continue
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

    return roles


def _find_codeowners_file(repo_root: Path) -> Path | None:
    for relative_path in (".github/CODEOWNERS", "CODEOWNERS", "docs/CODEOWNERS"):
        candidate = repo_root / relative_path
        if candidate.is_file():
            return candidate
    return None


def _parse_codeowners(path: Path) -> tuple[list[str], dict[int, list[str]]]:
    lines = path.read_text(encoding="utf-8").splitlines()
    owners_by_line: dict[int, list[str]] = {}

    for line_number, raw_line in enumerate(lines, start=1):
        stripped = raw_line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        try:
            tokens = shlex.split(raw_line, comments=False, posix=True)
        except ValueError:
            tokens = stripped.split()
        if len(tokens) < 2:
            continue

        individual_logins: list[str] = []
        for owner in tokens[1:]:
            if owner.startswith("@") and "/" not in owner[1:]:
                login = owner[1:].strip()
                if login:
                    individual_logins.append(login)
        owners_by_line[line_number] = individual_logins

    return lines, owners_by_line


def _resolve_codeowners_candidates(repo_root: Path, changed_paths: list[str]) -> tuple[Path | None, list[str]]:
    codeowners_path = _find_codeowners_file(repo_root)
    if not codeowners_path or not changed_paths:
        return codeowners_path, []

    lines, owners_by_line = _parse_codeowners(codeowners_path)
    if not owners_by_line:
        return codeowners_path, []

    gitignore_lines: list[str] = []
    for line_number, raw_line in enumerate(lines, start=1):
        stripped = raw_line.strip()
        owners = owners_by_line.get(line_number)
        if not stripped or stripped.startswith("#"):
            gitignore_lines.append(raw_line)
            continue
        if owners is None:
            gitignore_lines.append("")
            continue
        try:
            tokens = shlex.split(raw_line, comments=False, posix=True)
        except ValueError:
            tokens = raw_line.strip().split()
        gitignore_lines.append(tokens[0] if tokens else "")

    with tempfile.TemporaryDirectory(prefix="codeowners-match-") as tmp_dir:
        tmp_root = Path(tmp_dir)
        subprocess.run(["git", "init", "-q"], cwd=tmp_root, check=True)
        (tmp_root / ".gitignore").write_text("\n".join(gitignore_lines) + "\n", encoding="utf-8")
        proc = subprocess.run(
            ["git", "check-ignore", "-v", "--no-index", "--stdin"],
            cwd=tmp_root,
            check=False,
            capture_output=True,
            text=True,
            input="".join(f"{path}\n" for path in changed_paths),
        )
        if proc.returncode not in {0, 1}:
            raise RuntimeError(proc.stderr.strip() or "git check-ignore failed")

    matched_line_by_path: dict[str, int] = {}
    for raw_line in proc.stdout.splitlines():
        match = re.match(r"^[^:]+:(\d+):[^\t]*\t(.+)$", raw_line)
        if not match:
            continue
        matched_line_by_path[match.group(2)] = int(match.group(1))

    ordered_candidates: list[str] = []
    seen: set[str] = set()
    for path in changed_paths:
        line_number = matched_line_by_path.get(path)
        if not line_number:
            continue
        for login in owners_by_line.get(line_number, []):
            key = login.lower()
            if key in seen:
                continue
            seen.add(key)
            ordered_candidates.append(login)

    return codeowners_path, ordered_candidates


def _resolve_role_candidates(repo_root: Path, role_ids: list[str]) -> list[str]:
    roles = _load_training_matrix(repo_root / "matrices" / "training_matrix.yml")
    ordered_candidates: list[str] = []
    seen: set[str] = set()
    for role_id in role_ids:
        for user in roles.get(role_id, {}).get("users", []):
            login = str(user).strip().lstrip("@")
            if not login or login.lower() == "replace_with_gh_username":
                continue
            key = login.lower()
            if key in seen:
                continue
            seen.add(key)
            ordered_candidates.append(login)
    return ordered_candidates


def _write_outputs(outputs: dict[str, str], github_output_path: str | None) -> None:
    if not github_output_path:
        return
    with Path(github_output_path).open("a", encoding="utf-8") as fh:
        for key, value in outputs.items():
            fh.write(f"{key}={value}\n")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo-root", default=".")
    parser.add_argument("--paths-json", required=True)
    parser.add_argument("--fallback-role-ids", default="qa_lead")
    parser.add_argument("--github-output")
    args = parser.parse_args()

    try:
        changed_paths = json.loads(args.paths_json)
    except json.JSONDecodeError as exc:
        raise SystemExit(f"Could not parse changed paths JSON: {exc}") from exc
    if not isinstance(changed_paths, list) or not all(isinstance(path, str) for path in changed_paths):
        raise SystemExit("Changed paths must be a JSON array of strings.")

    repo_root = Path(args.repo_root).resolve()
    fallback_role_ids = [role_id.strip() for role_id in args.fallback_role_ids.split(",") if role_id.strip()]
    role_candidates = _resolve_role_candidates(repo_root, fallback_role_ids)

    codeowners_file = ""
    codeowners_candidates: list[str] = []
    codeowners_error = ""
    try:
        resolved_codeowners_file, codeowners_candidates = _resolve_codeowners_candidates(repo_root, changed_paths)
        if resolved_codeowners_file:
            codeowners_file = str(resolved_codeowners_file.relative_to(repo_root))
    except Exception as exc:  # pragma: no cover - defensive fallback path
        codeowners_error = str(exc)

    merged_candidates: list[str] = []
    seen: set[str] = set()
    for login in [*codeowners_candidates, *role_candidates]:
        key = login.lower()
        if key in seen:
            continue
        seen.add(key)
        merged_candidates.append(login)

    if codeowners_candidates:
        summary = (
            f"Matched {len(codeowners_candidates)} CODEOWNERS reviewer candidate(s)"
            f" from {codeowners_file or 'CODEOWNERS'} and kept fallback role-matrix candidates available."
        )
    elif codeowners_file:
        summary = (
            f"No individual CODEOWNERS matches were resolved from {codeowners_file}; "
            "using fallback role-matrix candidates."
        )
    else:
        summary = "No CODEOWNERS file found; using fallback role-matrix candidates."
    if codeowners_error:
        summary += f" CODEOWNERS matching fallback reason: {codeowners_error}."

    outputs = {
        "codeowners_file": codeowners_file,
        "codeowners_candidates_csv": ",".join(codeowners_candidates),
        "role_matrix_candidates_csv": ",".join(role_candidates),
        "reviewer_candidates_csv": ",".join(merged_candidates),
        "fallback_role_ids": ",".join(fallback_role_ids),
        "candidate_resolution_summary": summary,
    }
    _write_outputs(outputs, args.github_output)
    print(json.dumps(outputs, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
