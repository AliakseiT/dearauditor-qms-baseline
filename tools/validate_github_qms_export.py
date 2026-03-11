#!/usr/bin/env python3

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import subprocess
import sys
import tarfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def detect_git_binary(explicit: str | None) -> str:
    if explicit:
        return explicit
    candidates = [
        "/Library/Developer/CommandLineTools/usr/bin/git",
        "/Applications/Xcode.app/Contents/Developer/usr/bin/git",
        shutil.which("git") or "",
    ]
    for candidate in candidates:
        if candidate and Path(candidate).exists():
            return candidate
    return "git"


def run(argv: list[str]) -> subprocess.CompletedProcess:
    return subprocess.run(argv, capture_output=True, text=True, check=False)


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def write_text(path: Path, payload: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(payload, encoding="utf-8")


def verify_inventory(export_dir: Path, manifest: dict[str, Any]) -> list[dict[str, str]]:
    findings: list[dict[str, str]] = []
    inventory = manifest.get("inventory") or []
    for entry in inventory:
        rel = str(entry.get("path") or "").strip()
        if not rel:
            findings.append({"status": "fail", "name": "inventory-entry", "detail": "Entry missing path."})
            continue
        path = export_dir / rel
        if not path.exists():
            findings.append({"status": "fail", "name": "inventory-file", "detail": f"Missing file: {rel}"})
            continue
        actual_size = path.stat().st_size
        expected_size = int(entry.get("size_bytes") or 0)
        if actual_size != expected_size:
            findings.append(
                {
                    "status": "fail",
                    "name": "inventory-size",
                    "detail": f"Size mismatch for {rel}: expected {expected_size}, got {actual_size}",
                }
            )
        actual_hash = sha256_file(path)
        expected_hash = str(entry.get("sha256") or "").strip()
        if actual_hash != expected_hash:
            findings.append(
                {
                    "status": "fail",
                    "name": "inventory-sha256",
                    "detail": f"SHA256 mismatch for {rel}: expected {expected_hash}, got {actual_hash}",
                }
            )
    if not findings:
        findings.append({"status": "pass", "name": "inventory", "detail": f"Verified {len(inventory)} exported file(s)."})
    return findings


def verify_json_files(export_dir: Path, manifest: dict[str, Any]) -> list[dict[str, str]]:
    findings: list[dict[str, str]] = []
    inventory = manifest.get("inventory") or []
    checked = 0
    for entry in inventory:
        rel = str(entry.get("path") or "").strip()
        if not rel.endswith(".json"):
            continue
        try:
            load_json(export_dir / rel)
            checked += 1
        except Exception as exc:  # noqa: BLE001
            findings.append({"status": "fail", "name": "json-parse", "detail": f"Invalid JSON in {rel}: {exc}"})
    if not findings:
        findings.append({"status": "pass", "name": "json-parse", "detail": f"Parsed {checked} JSON file(s)."})
    return findings


def verify_bundle(export_dir: Path, manifest: dict[str, Any], git_binary: str) -> list[dict[str, str]]:
    bundle_rel = ((manifest.get("artifacts") or {}).get("git_bundle") or "").strip()
    if not bundle_rel:
        return [{"status": "warn", "name": "git-bundle", "detail": "No git bundle recorded in the export manifest."}]
    bundle_path = export_dir / bundle_rel
    if not bundle_path.exists():
        return [{"status": "fail", "name": "git-bundle", "detail": f"Missing git bundle: {bundle_rel}"}]
    proc = run([git_binary, "bundle", "verify", str(bundle_path)])
    if proc.returncode != 0:
        detail = (proc.stderr or proc.stdout or "").strip() or "git bundle verify failed"
        return [{"status": "fail", "name": "git-bundle", "detail": detail}]
    return [{"status": "pass", "name": "git-bundle", "detail": "git bundle verify succeeded."}]


def verify_snapshot_archive(export_dir: Path, manifest: dict[str, Any]) -> list[dict[str, str]]:
    archive_rel = ((manifest.get("artifacts") or {}).get("selected_snapshot") or "").strip()
    if not archive_rel:
        return [{"status": "warn", "name": "selected-snapshot", "detail": "No selected snapshot archive recorded in the export manifest."}]
    archive_path = export_dir / archive_rel
    if not archive_path.exists():
        return [{"status": "fail", "name": "selected-snapshot", "detail": f"Missing snapshot archive: {archive_rel}"}]
    try:
        with tarfile.open(archive_path, "r:gz") as archive:
            members = archive.getmembers()
    except Exception as exc:  # noqa: BLE001
        return [{"status": "fail", "name": "selected-snapshot", "detail": f"Could not read tar archive: {exc}"}]
    if not members:
        return [{"status": "fail", "name": "selected-snapshot", "detail": "Snapshot archive is empty."}]
    return [{"status": "pass", "name": "selected-snapshot", "detail": f"Snapshot archive contains {len(members)} entries."}]


def build_summary(export_dir: Path, manifest: dict[str, Any]) -> dict[str, Any]:
    summary = dict(manifest.get("summary") or {})
    summary["inventory_file_count"] = len(manifest.get("inventory") or [])
    summary["export_dir"] = str(export_dir)
    summary["mode"] = manifest.get("mode") or "unknown"
    summary["source_repository"] = manifest.get("source_repository") or "unknown"
    summary["selected_ref"] = manifest.get("selected_ref") or ""
    summary["selected_commit_sha"] = manifest.get("selected_commit_sha") or ""
    return summary


def overall_status(checks: list[dict[str, str]]) -> str:
    if any(check["status"] == "fail" for check in checks):
        return "fail"
    if any(check["status"] == "warn" for check in checks):
        return "warn"
    return "pass"


def render_report(summary: dict[str, Any], checks: list[dict[str, str]], manifest_path: Path) -> str:
    lines = [
        "# QMS Export Validation Report",
        "",
        f"- Manifest: `{manifest_path}`",
        f"- Validated at: `{utc_now()}`",
        f"- Result: `{overall_status(checks).upper()}`",
        f"- Export mode: `{summary['mode']}`",
        f"- Source repository: `{summary['source_repository']}`",
    ]
    if summary.get("selected_ref"):
        lines.append(f"- Selected ref: `{summary['selected_ref']}`")
    if summary.get("selected_commit_sha"):
        lines.append(f"- Selected commit: `{summary['selected_commit_sha']}`")
    lines.extend(
        [
            "",
            "## Summary",
            "",
            "| Metric | Value |",
            "| --- | --- |",
        ]
    )
    for key in sorted(summary):
        if key in {"mode", "source_repository", "selected_ref", "selected_commit_sha", "export_dir"}:
            continue
        lines.append(f"| `{key}` | `{summary[key]}` |")
    lines.extend(
        [
            "",
            "## Checks",
            "",
            "| Check | Status | Detail |",
            "| --- | --- | --- |",
        ]
    )
    for check in checks:
        lines.append(f"| `{check['name']}` | `{check['status']}` | {check['detail']} |")
    return "\n".join(lines) + "\n"


def validate_export(args: argparse.Namespace) -> int:
    export_dir = Path(args.export_dir).resolve()
    manifest_path = export_dir / "export_manifest.json"
    if not manifest_path.exists():
        raise SystemExit(f"Missing export manifest: {manifest_path}")
    manifest = load_json(manifest_path)
    git_binary = detect_git_binary(args.git_binary)

    checks: list[dict[str, str]] = []
    checks.extend(verify_inventory(export_dir, manifest))
    checks.extend(verify_json_files(export_dir, manifest))
    if manifest.get("mode") == "snapshot":
        checks.extend(verify_bundle(export_dir, manifest, git_binary))
        checks.extend(verify_snapshot_archive(export_dir, manifest))

    summary = build_summary(export_dir, manifest)
    result = overall_status(checks)
    report_dir = export_dir / "analysis"
    payload = {
        "schema_version": 1,
        "validated_at_utc": utc_now(),
        "result": result,
        "summary": summary,
        "checks": checks,
    }
    write_json(report_dir / "validation_summary.json", payload)
    write_text(report_dir / "validation_report.md", render_report(summary, checks, manifest_path))
    print(result)
    return 1 if result == "fail" else 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Validate an exported GitHub QMS snapshot or snapshot catalog.")
    parser.add_argument("export_dir", help="Directory containing export_manifest.json.")
    parser.add_argument("--git-binary", help="Path to git binary used for bundle verification.")
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    return validate_export(args)


if __name__ == "__main__":
    sys.exit(main())
