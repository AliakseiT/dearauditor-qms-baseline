#!/usr/bin/env python3

from __future__ import annotations

import argparse
import datetime as dt
import fnmatch
import json
import shutil
import subprocess
import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]


def load_map(repo_root: Path) -> dict:
    path = repo_root / "distribution-map.json"
    return json.loads(path.read_text(encoding="utf-8"))


def git_output(repo_root: Path, args: list[str]) -> str:
    proc = subprocess.run(
        ["git", "-C", str(repo_root), *args],
        check=True,
        text=True,
        capture_output=True,
    )
    return proc.stdout


def tracked_files_for_ref(repo_root: Path, git_ref: str) -> list[str]:
    out = git_output(repo_root, ["ls-tree", "-r", "--name-only", git_ref])
    return [line.strip() for line in out.splitlines() if line.strip()]


def matches(rule: dict, path: str) -> bool:
    value = rule["value"]
    kind = rule["kind"]
    if kind == "path":
        if path == value:
            return True
        prefix = value.rstrip("/") + "/"
        return path.startswith(prefix)
    if kind == "glob":
        return fnmatch.fnmatch(path, value)
    raise ValueError(f"Unsupported rule kind: {kind}")


def resolve_sync_files(repo_root: Path, git_ref: str) -> list[str]:
    config = load_map(repo_root)
    files = tracked_files_for_ref(repo_root, git_ref)
    include_rules = config.get("sync_includes", [])
    exclude_rules = config.get("sync_excludes", [])
    selected = []
    for path in files:
        if not any(matches(rule, path) for rule in include_rules):
            continue
        if any(matches(rule, path) for rule in exclude_rules):
            continue
        selected.append(path)
    return sorted(dict.fromkeys(selected))


def apply_template_tokens(text: str, replacements: dict[str, str]) -> str:
    rendered = text
    for key, value in replacements.items():
        rendered = rendered.replace(key, value)
    return rendered


def apply_bootstrap_overlays(repo_root: Path, target_root: Path, replacements: dict[str, str]) -> None:
    config = load_map(repo_root)
    for overlay in config.get("bootstrap_overlays", []):
        source = repo_root / overlay["source"]
        target = target_root / overlay["target"]
        target.parent.mkdir(parents=True, exist_ok=True)
        rendered = apply_template_tokens(source.read_text(encoding="utf-8"), replacements)
        target.write_text(rendered, encoding="utf-8")


def write_baseline_file(
    repo_root: Path,
    target_root: Path,
    upstream_repository: str,
    upstream_ref: str,
) -> Path:
    config = load_map(repo_root)
    rel_path = Path(config["tracked_baseline_file"])
    dest = target_root / rel_path
    dest.parent.mkdir(parents=True, exist_ok=True)
    previous = {}
    if dest.exists():
        previous = json.loads(dest.read_text(encoding="utf-8"))
    recorded_at = previous.get("recorded_at_utc")
    if not recorded_at or previous.get("upstream_repository") != upstream_repository or previous.get("upstream_ref") != upstream_ref:
        recorded_at = dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat()

    payload = {
        "schema_version": 1,
        "model": "private-adopter-repo",
        "upstream_repository": upstream_repository,
        "upstream_ref": upstream_ref,
        "recorded_at_utc": recorded_at,
        "managed_by": [
            "tools/bootstrap_company_repo.sh",
            "tools/open_upstream_upgrade_pr.sh",
        ],
    }
    dest.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    return dest


def signer_registry_logins(target_root: Path, registry_path: str) -> list[str]:
    path = target_root / registry_path
    registry = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(registry, dict):
        raise ValueError(f"{registry_path} must contain a JSON object keyed by GitHub login")

    logins: list[str] = []
    seen: set[str] = set()
    for raw_login in registry.keys():
        login = str(raw_login).strip().removeprefix("@")
        if not login:
            continue
        key = login.lower()
        if key in seen:
            continue
        seen.add(key)
        logins.append(login)
    return logins


def render_codeowners(logins: list[str], registry_path: str) -> str:
    owners = " ".join(f"@{login}" for login in logins)
    return (
        f"# Generated from {registry_path} by tools/qms_distribution.py sync-codeowners.\n"
        f"* {owners}\n"
    )


def sync_codeowners(
    target_root: Path,
    registry_path: str,
    codeowners_path: str,
    check: bool,
) -> int:
    logins = signer_registry_logins(target_root, registry_path)
    if not logins:
        raise ValueError(f"{registry_path} does not contain any signer GitHub logins")

    expected = render_codeowners(logins, registry_path)
    target = target_root / codeowners_path

    if check:
        actual = target.read_text(encoding="utf-8") if target.exists() else ""
        if actual != expected:
            print(f"{codeowners_path} is not aligned with {registry_path}")
            print(f"Expected owners: {' '.join(f'@{login}' for login in logins)}")
            return 1
        return 0

    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(expected, encoding="utf-8")
    print(codeowners_path)
    return 0


def placeholder_hits(repo_root: Path) -> list[str]:
    config = load_map(repo_root)
    prefixes = tuple(config.get("placeholder_prefixes", []))
    if not prefixes:
        return []

    paths = set(config.get("placeholder_scan_paths", []))
    if not paths:
        paths = {str(Path(config["tracked_baseline_file"]))}

    hits = []
    for rel_path in sorted(paths):
        path = repo_root / rel_path
        if not path.exists():
            hits.append(f"{rel_path}: missing")
            continue
        text = path.read_text(encoding="utf-8")
        if any(prefix in text for prefix in prefixes):
            hits.append(f"{rel_path}: contains placeholder token")
    return hits


def print_required_settings(repo_root: Path) -> None:
    config = load_map(repo_root)
    payload = {
        "variables": config.get("required_repo_variables", []),
        "secrets": config.get("required_repo_secrets", []),
    }
    print(json.dumps(payload, indent=2))


def cmd_resolve_sync_files(args: argparse.Namespace) -> int:
    repo_root = Path(args.repo_root).resolve()
    for path in resolve_sync_files(repo_root, args.upstream_ref):
        print(path)
    return 0


def cmd_apply_bootstrap_overlays(args: argparse.Namespace) -> int:
    repo_root = Path(args.repo_root).resolve()
    target_root = Path(args.target_root).resolve()
    replacements = {
        "REPLACE_WITH_COMPANY_LEGAL_NAME": args.company_name or "REPLACE_WITH_COMPANY_LEGAL_NAME",
        "REPLACE_WITH_COMPANY_STREET": args.company_street or "REPLACE_WITH_COMPANY_STREET",
        "REPLACE_WITH_COMPANY_POSTAL_CODE": args.company_postal_code or "REPLACE_WITH_COMPANY_POSTAL_CODE",
        "REPLACE_WITH_COMPANY_CITY": args.company_city or "REPLACE_WITH_COMPANY_CITY",
        "REPLACE_WITH_COMPANY_COUNTRY": args.company_country or "REPLACE_WITH_COMPANY_COUNTRY",
        "REPLACE_WITH_PRIMARY_GH_USERNAME": args.primary_gh_username or "REPLACE_WITH_PRIMARY_GH_USERNAME",
        "REPLACE_WITH_PRIMARY_FULL_NAME": args.primary_full_name or "REPLACE_WITH_PRIMARY_FULL_NAME",
        "REPLACE_WITH_PRIMARY_JOB_TITLE": args.primary_job_title or "REPLACE_WITH_PRIMARY_JOB_TITLE",
        "REPLACE_WITH_SIGNING_BASE_URL": args.signature_ui_base_url or "REPLACE_WITH_SIGNING_BASE_URL",
    }
    apply_bootstrap_overlays(repo_root, target_root, replacements)
    return 0


def cmd_write_baseline(args: argparse.Namespace) -> int:
    repo_root = Path(args.repo_root).resolve()
    target_root = Path(args.target_root).resolve()
    baseline_path = write_baseline_file(
        repo_root,
        target_root,
        args.upstream_repository,
        args.upstream_ref,
    )
    print(baseline_path.relative_to(target_root))
    return 0


def cmd_check_placeholders(args: argparse.Namespace) -> int:
    repo_root = Path(args.repo_root).resolve()
    hits = placeholder_hits(repo_root)
    if hits:
        print("\n".join(hits))
        return 1
    return 0


def cmd_required_settings(args: argparse.Namespace) -> int:
    print_required_settings(Path(args.repo_root).resolve())
    return 0


def cmd_sync_codeowners(args: argparse.Namespace) -> int:
    target_root = Path(args.target_root).resolve()
    return sync_codeowners(target_root, args.registry, args.codeowners, args.check)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="DearAuditor Open QMS Baseline distribution helper")
    sub = parser.add_subparsers(dest="command", required=True)

    resolve_parser = sub.add_parser("resolve-sync-files")
    resolve_parser.add_argument("--repo-root", default=str(REPO_ROOT))
    resolve_parser.add_argument("--upstream-ref", required=True)
    resolve_parser.set_defaults(func=cmd_resolve_sync_files)

    overlays_parser = sub.add_parser("apply-bootstrap-overlays")
    overlays_parser.add_argument("--repo-root", default=str(REPO_ROOT))
    overlays_parser.add_argument("--target-root", required=True)
    overlays_parser.add_argument("--company-name")
    overlays_parser.add_argument("--company-street")
    overlays_parser.add_argument("--company-postal-code")
    overlays_parser.add_argument("--company-city")
    overlays_parser.add_argument("--company-country")
    overlays_parser.add_argument("--primary-gh-username")
    overlays_parser.add_argument("--primary-full-name")
    overlays_parser.add_argument("--primary-job-title")
    overlays_parser.add_argument("--signature-ui-base-url")
    overlays_parser.set_defaults(func=cmd_apply_bootstrap_overlays)

    baseline_parser = sub.add_parser("write-baseline")
    baseline_parser.add_argument("--repo-root", default=str(REPO_ROOT))
    baseline_parser.add_argument("--target-root", required=True)
    baseline_parser.add_argument("--upstream-repository", required=True)
    baseline_parser.add_argument("--upstream-ref", required=True)
    baseline_parser.set_defaults(func=cmd_write_baseline)

    placeholders_parser = sub.add_parser("check-placeholders")
    placeholders_parser.add_argument("--repo-root", default=str(REPO_ROOT))
    placeholders_parser.set_defaults(func=cmd_check_placeholders)

    settings_parser = sub.add_parser("required-settings")
    settings_parser.add_argument("--repo-root", default=str(REPO_ROOT))
    settings_parser.set_defaults(func=cmd_required_settings)

    codeowners_parser = sub.add_parser("sync-codeowners")
    codeowners_parser.add_argument("--target-root", default=str(REPO_ROOT))
    codeowners_parser.add_argument("--registry", default="matrices/signer_registry.json")
    codeowners_parser.add_argument("--codeowners", default=".github/CODEOWNERS")
    codeowners_parser.add_argument("--check", action="store_true")
    codeowners_parser.set_defaults(func=cmd_sync_codeowners)

    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
