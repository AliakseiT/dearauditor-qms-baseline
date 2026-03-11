#!/usr/bin/env python3

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import subprocess
import sys
import tarfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


QMS_TAG_RE = re.compile(r"^QMS-\d{4}-\d{2}-\d{2}-R\d{2}$")
QMS_PREVIEW_TAG_RE = re.compile(r"^QMSPREVIEW-\d{4}-\d{2}-\d{2}-R\d{2}$")
PR_SIGNATURE_TAG_RE = re.compile(r"^sig-pr\d+-h[a-f0-9]{1,12}-r\d+$")
TRAINING_SIGNATURE_TAG_RE = re.compile(r"^sig-train-\d+-h[a-f0-9]{1,12}-r\d+$")
CERTIFICATE_ASSET_RE = re.compile(r"^Electronic_Signature_Certificate_PR\d+\.pdf$")


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


def safe_name(value: str) -> str:
    return re.sub(r"[^A-Za-z0-9._-]+", "_", value).strip("._") or "unnamed"


def classify_release(tag_name: str, asset_names: list[str]) -> str:
    if QMS_TAG_RE.fullmatch(tag_name):
        return "qms_release"
    if QMS_PREVIEW_TAG_RE.fullmatch(tag_name):
        return "qms_preview"
    if PR_SIGNATURE_TAG_RE.fullmatch(tag_name):
        return "pr_signature_release"
    if TRAINING_SIGNATURE_TAG_RE.fullmatch(tag_name):
        return "training_signature_release"
    if "manifest.json" in asset_names and "signed_attestation.json" in asset_names:
        return "record_release"
    return "other"


def load_release_metadata(export_dir: Path, manifest: dict[str, Any]) -> list[dict[str, Any]]:
    releases_rel = ((manifest.get("artifacts") or {}).get("releases") or "metadata/releases.json").strip()
    path = export_dir / releases_rel
    if not path.exists():
        return []
    payload = load_json(path)
    return payload if isinstance(payload, list) else []


def asset_path_for_release(export_dir: Path, tag_name: str, asset_name: str) -> Path:
    return export_dir / "releases" / "assets" / safe_name(tag_name or "untagged") / safe_name(asset_name)


def validate_required_fields(payload: dict[str, Any], fields: list[str]) -> list[str]:
    missing: list[str] = []
    for field in fields:
        value = payload.get(field)
        if value is None:
            missing.append(field)
            continue
        if isinstance(value, str) and not value.strip():
            missing.append(field)
        elif isinstance(value, list) and len(value) == 0:
            missing.append(field)
    return missing


def validate_qms_release_assets(export_dir: Path, release: dict[str, Any], asset_names: list[str]) -> list[dict[str, str]]:
    findings: list[dict[str, str]] = []
    tag_name = str(release.get("tag_name") or "")
    expected = {"qms_release_manifest.json", "qms_release_snapshot.tgz"}
    missing_assets = sorted(expected - set(asset_names))
    if missing_assets:
        findings.append(
            {
                "status": "fail",
                "name": f"release:{tag_name}",
                "detail": f"Missing expected QMS release asset(s): {', '.join(missing_assets)}",
            }
        )
        return findings

    manifest_path = asset_path_for_release(export_dir, tag_name, "qms_release_manifest.json")
    snapshot_path = asset_path_for_release(export_dir, tag_name, "qms_release_snapshot.tgz")
    if not manifest_path.exists():
        findings.append(
            {
                "status": "warn",
                "name": f"release:{tag_name}",
                "detail": "Release metadata looks valid, but qms_release_manifest.json was not exported; deep validation skipped.",
            }
        )
        return findings

    payload = load_json(manifest_path)
    missing_fields = validate_required_fields(
        payload,
        ["schema_version", "release_tag", "source_repository", "source_sha", "published_at_utc"],
    )
    if missing_fields:
        findings.append(
            {
                "status": "fail",
                "name": f"release:{tag_name}",
                "detail": f"qms_release_manifest.json missing field(s): {', '.join(missing_fields)}",
            }
        )
        return findings
    if str(payload.get("release_tag") or "") != tag_name:
        findings.append(
            {
                "status": "fail",
                "name": f"release:{tag_name}",
                "detail": f"qms_release_manifest.json release_tag '{payload.get('release_tag')}' does not match release tag '{tag_name}'.",
            }
        )
        return findings
    if snapshot_path.exists():
        try:
            with tarfile.open(snapshot_path, "r:gz") as archive:
                member_count = len(archive.getmembers())
        except Exception as exc:  # noqa: BLE001
            findings.append(
                {
                    "status": "fail",
                    "name": f"release:{tag_name}",
                    "detail": f"qms_release_snapshot.tgz is unreadable: {exc}",
                }
            )
            return findings
        findings.append(
            {
                "status": "pass",
                "name": f"release:{tag_name}",
                "detail": f"QMS release assets validated; snapshot archive contains {member_count} entries.",
            }
        )
        return findings

    findings.append(
        {
            "status": "warn",
            "name": f"release:{tag_name}",
            "detail": "QMS release metadata validated, but qms_release_snapshot.tgz was not exported for offline inspection.",
        }
    )
    return findings


def validate_pr_signature_release(export_dir: Path, release: dict[str, Any], asset_names: list[str]) -> list[dict[str, str]]:
    findings: list[dict[str, str]] = []
    tag_name = str(release.get("tag_name") or "")
    cert_asset = next((name for name in asset_names if CERTIFICATE_ASSET_RE.fullmatch(name)), "")
    missing = []
    if "signed_attestation.json" not in asset_names:
        missing.append("signed_attestation.json")
    if not cert_asset:
        missing.append("Electronic_Signature_Certificate_PR<nnn>.pdf")
    if missing:
        findings.append(
            {
                "status": "fail",
                "name": f"release:{tag_name}",
                "detail": f"Missing expected PR signature asset(s): {', '.join(missing)}",
            }
        )
        return findings

    attestation_path = asset_path_for_release(export_dir, tag_name, "signed_attestation.json")
    if not attestation_path.exists():
        findings.append(
            {
                "status": "warn",
                "name": f"release:{tag_name}",
                "detail": "PR signature release assets are listed, but signed_attestation.json was not exported; deep validation skipped.",
            }
        )
        return findings

    payload = load_json(attestation_path)
    missing_fields = validate_required_fields(
        payload,
        ["attestation_scope", "source_repository", "source_pull_request", "part11_target_hash", "signed_attestations"],
    )
    if missing_fields:
        findings.append(
            {
                "status": "fail",
                "name": f"release:{tag_name}",
                "detail": f"signed_attestation.json missing field(s): {', '.join(missing_fields)}",
            }
        )
        return findings
    if str(payload.get("attestation_scope") or "") != "pr_signature_ceremony":
        findings.append(
            {
                "status": "fail",
                "name": f"release:{tag_name}",
                "detail": f"Unexpected attestation_scope '{payload.get('attestation_scope')}' for PR signature release.",
            }
        )
        return findings
    findings.append(
        {
            "status": "pass",
            "name": f"release:{tag_name}",
            "detail": f"PR signature release validated with {len(payload.get('signed_attestations') or [])} captured attestation(s).",
        }
    )
    return findings


def validate_training_signature_release(export_dir: Path, release: dict[str, Any], asset_names: list[str]) -> list[dict[str, str]]:
    findings: list[dict[str, str]] = []
    tag_name = str(release.get("tag_name") or "")
    expected = {"signed_attestation.json", "training_completion_manifest.json"}
    missing_assets = sorted(expected - set(asset_names))
    if missing_assets:
        findings.append(
            {
                "status": "fail",
                "name": f"release:{tag_name}",
                "detail": f"Missing expected training signature asset(s): {', '.join(missing_assets)}",
            }
        )
        return findings

    attestation_path = asset_path_for_release(export_dir, tag_name, "signed_attestation.json")
    completion_path = asset_path_for_release(export_dir, tag_name, "training_completion_manifest.json")
    if not attestation_path.exists() or not completion_path.exists():
        findings.append(
            {
                "status": "warn",
                "name": f"release:{tag_name}",
                "detail": "Training release asset names are present, but downloadable JSON assets were not exported; deep validation skipped.",
            }
        )
        return findings

    attestation = load_json(attestation_path)
    completion = load_json(completion_path)
    attestation_missing = validate_required_fields(
        attestation,
        ["attestation_scope", "source_repository", "source_issue", "part11_target_hash", "signed_attestations"],
    )
    completion_missing = validate_required_fields(
        completion,
        ["source_repository", "source_issue", "trainee_login", "evidence_release_tag", "documents"],
    )
    if attestation_missing or completion_missing:
        detail_parts = []
        if attestation_missing:
            detail_parts.append(f"signed_attestation.json missing {', '.join(attestation_missing)}")
        if completion_missing:
            detail_parts.append(f"training_completion_manifest.json missing {', '.join(completion_missing)}")
        findings.append(
            {
                "status": "fail",
                "name": f"release:{tag_name}",
                "detail": "; ".join(detail_parts),
            }
        )
        return findings
    if str(attestation.get("attestation_scope") or "") != "training_issue_signature":
        findings.append(
            {
                "status": "fail",
                "name": f"release:{tag_name}",
                "detail": f"Unexpected attestation_scope '{attestation.get('attestation_scope')}' for training signature release.",
            }
        )
        return findings
    if str(completion.get("evidence_release_tag") or "") != tag_name:
        findings.append(
            {
                "status": "fail",
                "name": f"release:{tag_name}",
                "detail": f"training_completion_manifest.json evidence_release_tag '{completion.get('evidence_release_tag')}' does not match release tag '{tag_name}'.",
            }
        )
        return findings
    findings.append(
        {
            "status": "pass",
            "name": f"release:{tag_name}",
            "detail": f"Training signature release validated with {len(completion.get('documents') or [])} completed training item(s).",
        }
    )
    return findings


def validate_record_release(export_dir: Path, release: dict[str, Any], asset_names: list[str]) -> list[dict[str, str]]:
    findings: list[dict[str, str]] = []
    tag_name = str(release.get("tag_name") or "")
    cert_asset = next((name for name in asset_names if CERTIFICATE_ASSET_RE.fullmatch(name)), "")
    required = {"manifest.json", "signed_attestation.json"}
    missing = sorted(required - set(asset_names))
    if not cert_asset:
        missing.append("Electronic_Signature_Certificate_PR<nnn>.pdf")
    if missing:
        findings.append(
            {
                "status": "fail",
                "name": f"release:{tag_name}",
                "detail": f"Missing expected record-release asset(s): {', '.join(missing)}",
            }
        )
        return findings

    manifest_path = asset_path_for_release(export_dir, tag_name, "manifest.json")
    attestation_path = asset_path_for_release(export_dir, tag_name, "signed_attestation.json")
    if not manifest_path.exists() or not attestation_path.exists():
        findings.append(
            {
                "status": "warn",
                "name": f"release:{tag_name}",
                "detail": "Record release metadata validated, but downloadable JSON assets were not exported; deep validation skipped.",
            }
        )
        return findings

    manifest_payload = load_json(manifest_path)
    attestation_payload = load_json(attestation_path)
    manifest_missing = validate_required_fields(
        manifest_payload,
        ["bundle_kind", "source_repository", "source_pull_request", "part11_target_hash", "bundle_members"],
    )
    attestation_missing = validate_required_fields(
        attestation_payload,
        ["attestation_scope", "source_repository", "source_pull_request", "part11_target_hash", "signed_attestations"],
    )
    if manifest_missing or attestation_missing:
        detail_parts = []
        if manifest_missing:
            detail_parts.append(f"manifest.json missing {', '.join(manifest_missing)}")
        if attestation_missing:
            detail_parts.append(f"signed_attestation.json missing {', '.join(attestation_missing)}")
        findings.append(
            {
                "status": "fail",
                "name": f"release:{tag_name}",
                "detail": "; ".join(detail_parts),
            }
        )
        return findings
    if str(attestation_payload.get("attestation_scope") or "") != "qms_record_release":
        findings.append(
            {
                "status": "fail",
                "name": f"release:{tag_name}",
                "detail": f"Unexpected attestation_scope '{attestation_payload.get('attestation_scope')}' for record release.",
            }
        )
        return findings
    findings.append(
        {
            "status": "pass",
            "name": f"release:{tag_name}",
            "detail": f"Record release validated for bundle_kind '{manifest_payload.get('bundle_kind')}' with {len(manifest_payload.get('bundle_members') or [])} bundle member(s).",
        }
    )
    return findings


def validate_release_assets(export_dir: Path, manifest: dict[str, Any]) -> list[dict[str, str]]:
    releases = load_release_metadata(export_dir, manifest)
    if not releases:
        return [{"status": "warn", "name": "release-assets", "detail": "No releases metadata found in the export package."}]

    findings: list[dict[str, str]] = []
    checked = 0
    for release in releases:
        tag_name = str(release.get("tag_name") or "").strip()
        asset_names = [str(asset.get("name") or "").strip() for asset in (release.get("assets") or []) if str(asset.get("name") or "").strip()]
        classification = classify_release(tag_name, asset_names)
        if classification == "qms_release":
            findings.extend(validate_qms_release_assets(export_dir, release, asset_names))
            checked += 1
        elif classification == "pr_signature_release":
            findings.extend(validate_pr_signature_release(export_dir, release, asset_names))
            checked += 1
        elif classification == "training_signature_release":
            findings.extend(validate_training_signature_release(export_dir, release, asset_names))
            checked += 1
        elif classification == "record_release":
            findings.extend(validate_record_release(export_dir, release, asset_names))
            checked += 1

    if checked == 0:
        return [{"status": "warn", "name": "release-assets", "detail": "No release entries matched built-in attestation validation rules."}]
    return findings


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
        checks.extend(validate_release_assets(export_dir, manifest))

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
