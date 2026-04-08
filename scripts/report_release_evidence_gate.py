#!/usr/bin/env python3
"""Report release-note evidence coverage for controlled QMS releases."""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Any


CONTROLLED_DOC_RE = re.compile(r"^(?:qm|sops|wis)/.+\.md$")
DOC_ID_RE = re.compile(r"(?:QM|SOP|WI)-\d+", flags=re.IGNORECASE)
RELEASE_NOTES_RE = re.compile(r"^records/releases/(QMS-\d{4}-\d{2}-\d{2}-R\d{3})/release_notes\.md$")
SIGNATURE_RELEASE_RE = re.compile(r"^sig-pr(?P<pr>\d+)-h(?P<hash>[a-f0-9]{1,12})-r(?P<rev>\d+)$")


@dataclass
class ControlledDocument:
    path: str
    doc_id: str
    revision: str
    effective_date: str
    status: str
    introduction_commit: str
    approval_pr: str
    signature_release: str
    signature_evidence: str
    traceability_status: str


def run_git(args: list[str], *, allow_fail: bool = False) -> str:
    proc = subprocess.run(["git", *args], text=True, capture_output=True)
    if proc.returncode != 0:
        if allow_fail:
            return ""
        raise RuntimeError(proc.stderr.strip() or f"git {' '.join(args)} failed")
    return proc.stdout.strip()


def changed_files(base_sha: str, head_sha: str) -> list[str]:
    output = run_git(["diff", "--name-only", base_sha, head_sha])
    return [line.strip() for line in output.splitlines() if line.strip()]


def controlled_doc_paths() -> list[str]:
    paths: list[str] = []
    for root in (Path("qm"), Path("sops"), Path("wis")):
        if root.exists():
            paths.extend(str(path) for path in sorted(root.glob("*.md")))
    return paths


def read_file_at_revision(revision: str, path: str) -> str:
    return run_git(["show", f"{revision}:{path}"], allow_fail=True)


def parse_front_matter_value(text: str, key: str) -> str:
    match = re.search(rf"(?mi)^{re.escape(key)}:\s*(.+?)\s*$", text)
    return match.group(1).strip().strip("\"'") if match else ""


def doc_id_key(path: str) -> str:
    if path.startswith("qm/"):
        return "qm_id"
    if path.startswith("sops/"):
        return "sop_id"
    return "wi_id"


def current_doc_metadata(path: str) -> dict[str, str]:
    text = Path(path).read_text(encoding="utf-8")
    return {
        "doc_id": parse_front_matter_value(text, doc_id_key(path)).upper(),
        "revision": parse_front_matter_value(text, "revision").upper(),
        "effective_date": parse_front_matter_value(text, "effective_date"),
        "status": parse_front_matter_value(text, "status"),
    }


def metadata_matches(text: str, path: str, expected: dict[str, str]) -> bool:
    if not text:
        return False
    return current_metadata_from_text(text, path) == expected


def current_metadata_from_text(text: str, path: str) -> dict[str, str]:
    return {
        "doc_id": parse_front_matter_value(text, doc_id_key(path)).upper(),
        "revision": parse_front_matter_value(text, "revision").upper(),
        "effective_date": parse_front_matter_value(text, "effective_date"),
        "status": parse_front_matter_value(text, "status"),
    }


def find_revision_introduction_commit(path: str, expected: dict[str, str]) -> str:
    commits_raw = run_git(["log", "--format=%H", "--follow", "--", path], allow_fail=True)
    commits = [line.strip() for line in commits_raw.splitlines() if line.strip()]
    if not commits:
        return ""

    introduction = commits[0]
    for commit in commits:
        if metadata_matches(read_file_at_revision(commit, path), path, expected):
            introduction = commit
            continue
        break
    return introduction


def parse_pr_number_from_commit(commit: str) -> str:
    subject = run_git(["show", "-s", "--format=%s", commit], allow_fail=True)
    match = re.search(r"\(#(\d+)\)", subject) or re.search(r"#(\d+)", subject)
    return match.group(1) if match else ""


def api_json(url: str, token: str) -> Any:
    request = urllib.request.Request(
        url,
        headers={
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {token}",
            "X-GitHub-Api-Version": "2022-11-28",
        },
    )
    with urllib.request.urlopen(request, timeout=20) as response:
        return json.loads(response.read().decode("utf-8"))


def github_commit_pr(repo: str, commit: str, token: str) -> str:
    if not token or not repo or not commit:
        return ""
    try:
        pulls = api_json(f"https://api.github.com/repos/{repo}/commits/{commit}/pulls", token)
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, json.JSONDecodeError):
        return ""
    if isinstance(pulls, list) and pulls:
        number = pulls[0].get("number")
        return str(number) if number else ""
    return ""


def github_signature_releases(repo: str, token: str) -> dict[str, dict[str, Any]]:
    releases_by_pr: dict[str, dict[str, Any]] = {}
    if not token or not repo:
        return releases_by_pr

    page = 1
    while page <= 10:
        try:
            releases = api_json(
                f"https://api.github.com/repos/{repo}/releases?per_page=100&page={page}",
                token,
            )
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, json.JSONDecodeError):
            return releases_by_pr
        if not isinstance(releases, list) or not releases:
            break
        for release in releases:
            tag = str(release.get("tag_name") or "")
            match = SIGNATURE_RELEASE_RE.fullmatch(tag)
            if match:
                asset_names = [
                    str(asset.get("name") or "")
                    for asset in (release.get("assets") or [])
                    if isinstance(asset, dict)
                ]
                releases_by_pr.setdefault(
                    match.group("pr"),
                    {
                        "tag": tag,
                        "asset_names": asset_names,
                        "url": str(release.get("html_url") or ""),
                    },
                )
        page += 1
    return releases_by_pr


def release_note_tags(paths: list[str]) -> list[str]:
    tags = []
    for path in paths:
        match = RELEASE_NOTES_RE.fullmatch(path)
        if match:
            tags.append(match.group(1))
    return sorted(set(tags))


def traceability_text(paths: list[str]) -> str:
    parts = []
    for path in paths:
        matrix = Path(path)
        if matrix.exists():
            parts.append(matrix.read_text(encoding="utf-8"))
    return "\n".join(parts)


def signature_status(approval_pr: str, token: str, signature_release: dict[str, Any] | None) -> tuple[str, str]:
    if not approval_pr:
        return "", "missing_approval_pr"
    if not token:
        return "", "not_checked_without_github_token"
    if not signature_release:
        return "", "missing_signature_release"

    tag = str(signature_release.get("tag") or "")
    asset_names = set(signature_release.get("asset_names") or [])
    cert_assets = [name for name in asset_names if re.fullmatch(r"Electronic_Signature_Certificate_PR\d+\.pdf", name)]
    missing_assets = []
    if "signed_attestation.json" not in asset_names:
        missing_assets.append("signed_attestation.json")
    if not cert_assets:
        missing_assets.append("Electronic_Signature_Certificate_PR<nnn>.pdf")
    if missing_assets:
        return tag, "signature_release_missing_assets"
    return tag, "pass"


def build_documents(repo: str, token: str, traceability: list[str]) -> list[ControlledDocument]:
    signatures_by_pr = github_signature_releases(repo, token)
    trace_text = traceability_text(traceability)
    documents: list[ControlledDocument] = []

    for path in controlled_doc_paths():
        metadata = current_doc_metadata(path)
        introduction_commit = find_revision_introduction_commit(path, metadata)
        approval_pr = parse_pr_number_from_commit(introduction_commit)
        if not approval_pr:
            approval_pr = github_commit_pr(repo, introduction_commit, token)

        signature_release, signature_evidence = signature_status(
            approval_pr,
            token,
            signatures_by_pr.get(approval_pr) if approval_pr else None,
        )

        doc_id = metadata["doc_id"]
        traceability_status = "pass" if doc_id and doc_id in trace_text else "missing_traceability_reference"

        documents.append(
            ControlledDocument(
                path=path,
                doc_id=doc_id,
                revision=metadata["revision"],
                effective_date=metadata["effective_date"],
                status=metadata["status"],
                introduction_commit=introduction_commit,
                approval_pr=approval_pr,
                signature_release=signature_release,
                signature_evidence=signature_evidence,
                traceability_status=traceability_status,
            )
        )

    return documents


def markdown_report(
    tags: list[str],
    documents: list[ControlledDocument],
    traceability: list[str],
    strict: bool,
) -> str:
    signature_gaps = [doc for doc in documents if doc.signature_evidence != "pass"]
    traceability_gaps = [doc for doc in documents if doc.traceability_status != "pass"]

    lines = [
        "# Release Evidence Gate Report",
        "",
        f"- Mode: `{'strict' if strict else 'report'}`",
        f"- Release note tag(s): `{', '.join(tags) if tags else 'none'}`",
        f"- Controlled QM/SOP/WI documents checked: `{len(documents)}`",
        f"- Signature evidence gaps: `{len(signature_gaps)}`",
        f"- Traceability source(s): `{', '.join(traceability)}`",
        f"- Traceability gaps: `{len(traceability_gaps)}`",
        "",
        "| Document | Revision | Path | Approval PR | Signature Release | Traceability |",
        "|---|---|---|---|---|---|",
    ]
    for doc in documents:
        pr_text = f"#{doc.approval_pr}" if doc.approval_pr else doc.signature_evidence
        signature_text = f"`{doc.signature_release}`" if doc.signature_release else doc.signature_evidence
        lines.append(
            f"| `{doc.doc_id or 'UNKNOWN'}` | `{doc.revision or 'UNKNOWN'}` | `{doc.path}` | "
            f"{pr_text} | {signature_text} | {doc.traceability_status} |"
        )

    if not strict:
        lines.extend(
            [
                "",
                "> Report mode: missing signature or traceability evidence is reported but does not fail the PR.",
            ]
        )
    return "\n".join(lines) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description="Report release evidence coverage for QMS release-note PRs.")
    parser.add_argument("--base", required=True, help="Base git revision")
    parser.add_argument("--head", required=True, help="Head git revision")
    parser.add_argument("--repo", default=os.environ.get("GITHUB_REPOSITORY", ""), help="owner/repo for GitHub API lookups")
    parser.add_argument("--token", default=os.environ.get("GITHUB_TOKEN", ""), help="GitHub token for API lookups")
    parser.add_argument(
        "--traceability",
        action="append",
        default=[],
        help="Traceability matrix file to scan for released document ids; may be provided multiple times",
    )
    parser.add_argument("--strict", action="store_true", help="Fail on missing signature or traceability evidence")
    args = parser.parse_args()

    changed = changed_files(args.base, args.head)
    tags = release_note_tags(changed)
    if not tags:
        print("No QMS release note changes detected; release evidence gate skipped.")
        return 0

    traceability = args.traceability or ["matrices/quality_manual_traceability.yml"]
    documents = build_documents(args.repo, args.token, traceability)
    report = markdown_report(tags, documents, traceability, args.strict)
    print(report)

    summary_path = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary_path:
        with Path(summary_path).open("a", encoding="utf-8") as fh:
            fh.write(report)

    if args.strict:
        has_gap = any(doc.signature_evidence != "pass" or doc.traceability_status != "pass" for doc in documents)
        return 1 if has_gap else 0
    return 0


if __name__ == "__main__":
    sys.exit(main())
