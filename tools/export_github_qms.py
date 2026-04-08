#!/usr/bin/env python3

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tarfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


QMS_TAG_RE = re.compile(r"^QMS-\d{4}-\d{2}-\d{2}-R\d{3}$")
QMS_PREVIEW_TAG_RE = re.compile(r"^QMSPREVIEW-\d{4}-\d{2}-\d{2}-R\d{3}$")
EVIDENCE_TAG_PREFIXES = (
    "sig-",
    "audit-",
    "capa-",
    "change-",
    "ncr-",
    "pms-",
    "record-",
    "risk-",
    "trn-",
)


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def write_json(path: Path, payload: Any) -> None:
    ensure_dir(path.parent)
    path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def write_text(path: Path, text: str) -> None:
    ensure_dir(path.parent)
    path.write_text(text, encoding="utf-8")


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def run(
    argv: list[str],
    *,
    cwd: Path | None = None,
    input_bytes: bytes | None = None,
    text: bool = True,
) -> subprocess.CompletedProcess:
    return subprocess.run(
        argv,
        cwd=str(cwd) if cwd else None,
        input=input_bytes,
        capture_output=True,
        text=text,
        check=False,
    )


def require_ok(proc: subprocess.CompletedProcess, *, context: str) -> subprocess.CompletedProcess:
    if proc.returncode != 0:
        stderr = proc.stderr.strip() if isinstance(proc.stderr, str) else (proc.stderr or b"").decode("utf-8", "replace").strip()
        stdout = proc.stdout.strip() if isinstance(proc.stdout, str) else (proc.stdout or b"").decode("utf-8", "replace").strip()
        detail = stderr or stdout or f"exit code {proc.returncode}"
        raise SystemExit(f"{context} failed: {detail}")
    return proc


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
    raise SystemExit("Could not locate a usable git binary.")


def require_cmd(name: str) -> str:
    resolved = shutil.which(name)
    if not resolved:
        raise SystemExit(f"Required command not found: {name}")
    return resolved


def parse_repo_from_remote(remote_url: str) -> str:
    value = remote_url.strip()
    value = re.sub(r"^git@github\.com:", "", value)
    value = re.sub(r"^https://github\.com/", "", value)
    value = re.sub(r"\.git$", "", value)
    if re.fullmatch(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+", value):
        return value
    raise SystemExit(f"Could not derive owner/repo from origin remote: {remote_url}")


def derive_repo(repo_arg: str | None, repo_root: Path | None, git_binary: str) -> str:
    if repo_arg:
        return repo_arg.strip()
    env_repo = os.environ.get("GH_REPO", "").strip()
    if env_repo:
        return env_repo
    if not repo_root:
        raise SystemExit("--repo is required when --repo-root is not provided.")
    proc = require_ok(
        run([git_binary, "-C", str(repo_root), "remote", "get-url", "origin"]),
        context="git remote get-url origin",
    )
    return parse_repo_from_remote(proc.stdout.strip())


def flatten_pages(payload: Any) -> Any:
    if isinstance(payload, list) and payload and all(isinstance(page, list) for page in payload):
        flattened: list[Any] = []
        for page in payload:
            flattened.extend(page)
        return flattened
    return payload


def gh_api_json(gh_binary: str, route: str, *, paginate: bool = False) -> Any:
    cmd = [gh_binary, "api"]
    if paginate:
        cmd.extend(["--paginate", "--slurp"])
    cmd.append(route)
    proc = require_ok(run(cmd), context=f"gh api {route}")
    payload = json.loads(proc.stdout)
    return flatten_pages(payload)


def classify_tag(name: str) -> str:
    if QMS_TAG_RE.fullmatch(name):
        return "qms_release"
    if QMS_PREVIEW_TAG_RE.fullmatch(name):
        return "qms_preview"
    if name.startswith(EVIDENCE_TAG_PREFIXES):
        return "evidence"
    return "other"


def classify_release(tag_name: str) -> str:
    return classify_tag(tag_name or "")


def build_snapshot_catalog(tags: list[dict[str, Any]], releases: list[dict[str, Any]]) -> dict[str, Any]:
    tag_rows = []
    for tag in tags:
        name = str(tag.get("name") or "").strip()
        tag_rows.append(
            {
                "name": name,
                "classification": classify_tag(name),
                "commit_sha": ((tag.get("commit") or {}).get("sha") or "").strip(),
                "tarball_url": tag.get("tarball_url") or "",
                "zipball_url": tag.get("zipball_url") or "",
            }
        )

    release_rows = []
    for release in releases:
        tag_name = str(release.get("tag_name") or "").strip()
        assets = release.get("assets") or []
        release_rows.append(
            {
                "id": release.get("id"),
                "tag_name": tag_name,
                "classification": classify_release(tag_name),
                "name": release.get("name") or "",
                "draft": bool(release.get("draft")),
                "prerelease": bool(release.get("prerelease")),
                "created_at": release.get("created_at") or "",
                "published_at": release.get("published_at") or "",
                "html_url": release.get("html_url") or "",
                "asset_count": len(assets),
                "asset_names": [asset.get("name") or "" for asset in assets],
            }
        )

    return {
        "schema_version": 1,
        "generated_at_utc": utc_now(),
        "tags": tag_rows,
        "releases": release_rows,
        "summary": {
            "tag_count": len(tag_rows),
            "release_count": len(release_rows),
            "qms_release_tag_count": sum(1 for row in tag_rows if row["classification"] == "qms_release"),
            "qms_preview_tag_count": sum(1 for row in tag_rows if row["classification"] == "qms_preview"),
            "evidence_tag_count": sum(1 for row in tag_rows if row["classification"] == "evidence"),
        },
    }


def render_catalog_markdown(repo: str, catalog: dict[str, Any]) -> str:
    lines = [
        f"# GitHub QMS Snapshot Catalog: {repo}",
        "",
        f"- Generated at: `{catalog['generated_at_utc']}`",
        f"- Tags captured: `{catalog['summary']['tag_count']}`",
        f"- Releases captured: `{catalog['summary']['release_count']}`",
        "",
        "## Tag Summary",
        f"- Formal QMS tags: `{catalog['summary']['qms_release_tag_count']}`",
        f"- Preview QMS tags: `{catalog['summary']['qms_preview_tag_count']}`",
        f"- Evidence tags: `{catalog['summary']['evidence_tag_count']}`",
        "",
        "## Releases",
        "",
        "| Tag | Classification | Published | Assets |",
        "| --- | --- | --- | --- |",
    ]
    for release in catalog["releases"]:
        published_at = release["published_at"] or "n/a"
        lines.append(
            f"| `{release['tag_name'] or 'n/a'}` | `{release['classification']}` | `{published_at}` | `{release['asset_count']}` |"
        )
    return "\n".join(lines) + "\n"


def resolve_repo_root(repo_root_arg: str | None) -> Path | None:
    if not repo_root_arg:
        return None
    return Path(repo_root_arg).resolve()


def git_output(git_binary: str, repo_root: Path, args: list[str]) -> str:
    proc = require_ok(
        run([git_binary, "-C", str(repo_root), *args]),
        context=f"git {' '.join(args)}",
    )
    return proc.stdout.strip()


def export_git_artifacts(
    *,
    git_binary: str,
    repo_root: Path,
    output_dir: Path,
    selected_ref: str,
) -> dict[str, Any]:
    git_dir = output_dir / "git"
    ensure_dir(git_dir)

    selected_commit = git_output(git_binary, repo_root, ["rev-parse", selected_ref])
    refs_text = git_output(git_binary, repo_root, ["for-each-ref", "--format=%(refname) %(objectname)"])
    refs_payload = []
    for line in refs_text.splitlines():
        refname, sha = line.split(" ", 1)
        refs_payload.append({"ref": refname, "sha": sha})
    write_json(git_dir / "refs.json", refs_payload)

    bundle_path = git_dir / "repo.bundle"
    require_ok(
        run([git_binary, "-C", str(repo_root), "bundle", "create", str(bundle_path), "--all"]),
        context="git bundle create",
    )

    snapshot_path = git_dir / "selected_snapshot.tgz"
    require_ok(
        run([git_binary, "-C", str(repo_root), "archive", "--format=tar.gz", "-o", str(snapshot_path), selected_ref]),
        context="git archive",
    )

    selected_payload = {
        "selected_ref": selected_ref,
        "selected_commit_sha": selected_commit,
    }
    write_json(git_dir / "selected_ref.json", selected_payload)
    return selected_payload


def safe_name(value: str) -> str:
    return re.sub(r"[^A-Za-z0-9._-]+", "_", value).strip("._") or "unnamed"


def download_release_assets(
    *,
    gh_binary: str,
    repo: str,
    releases: list[dict[str, Any]],
    output_dir: Path,
) -> dict[str, int]:
    assets_root = output_dir / "releases" / "assets"
    ensure_dir(assets_root)
    downloaded = 0
    skipped = 0
    for release in releases:
        tag_name = safe_name(str(release.get("tag_name") or "untagged"))
        for asset in release.get("assets") or []:
            asset_id = asset.get("id")
            asset_name = safe_name(str(asset.get("name") or f"asset-{asset_id}"))
            if asset_id is None:
                skipped += 1
                continue
            target = assets_root / tag_name / asset_name
            ensure_dir(target.parent)
            proc = require_ok(
                run(
                    [
                        gh_binary,
                        "api",
                        "-H",
                        "Accept: application/octet-stream",
                        f"repos/{repo}/releases/assets/{asset_id}",
                    ],
                    text=False,
                ),
                context=f"download release asset {asset_id}",
            )
            target.write_bytes(proc.stdout)
            downloaded += 1
    return {"downloaded_release_assets": downloaded, "skipped_release_assets": skipped}


def collect_inventory(output_dir: Path, manifest_name: str) -> list[dict[str, Any]]:
    entries: list[dict[str, Any]] = []
    for path in sorted(output_dir.rglob("*")):
        if not path.is_file():
            continue
        rel = path.relative_to(output_dir).as_posix()
        if rel == manifest_name:
            continue
        entries.append(
            {
                "path": rel,
                "sha256": sha256_file(path),
                "size_bytes": path.stat().st_size,
            }
        )
    return entries


def export_catalog(args: argparse.Namespace) -> int:
    gh_binary = require_cmd("gh")
    git_binary = detect_git_binary(args.git_binary)
    repo_root = resolve_repo_root(args.repo_root)
    repo = derive_repo(args.repo, repo_root, git_binary)
    output_dir = Path(args.output).resolve()
    ensure_dir(output_dir)

    tags = gh_api_json(gh_binary, f"repos/{repo}/tags?per_page=100", paginate=True)
    releases = gh_api_json(gh_binary, f"repos/{repo}/releases?per_page=100", paginate=True)
    catalog = build_snapshot_catalog(tags, releases)

    write_json(output_dir / "snapshot_catalog.json", catalog)
    write_text(output_dir / "snapshot_catalog.md", render_catalog_markdown(repo, catalog))

    manifest_name = "export_manifest.json"
    manifest = {
        "schema_version": 1,
        "mode": "catalog",
        "exported_at_utc": utc_now(),
        "source_repository": repo,
        "artifacts": {
            "snapshot_catalog": "snapshot_catalog.json",
            "snapshot_catalog_report": "snapshot_catalog.md",
        },
    }
    manifest["inventory"] = collect_inventory(output_dir, manifest_name)
    write_json(output_dir / manifest_name, manifest)
    print(output_dir)
    return 0


def export_snapshot(args: argparse.Namespace) -> int:
    gh_binary = require_cmd("gh")
    git_binary = detect_git_binary(args.git_binary)
    repo_root = resolve_repo_root(args.repo_root)
    if not repo_root:
        raise SystemExit("--repo-root is required for snapshot export.")
    repo = derive_repo(args.repo, repo_root, git_binary)
    output_dir = Path(args.output).resolve()
    ensure_dir(output_dir)

    repository = gh_api_json(gh_binary, f"repos/{repo}")
    tags = gh_api_json(gh_binary, f"repos/{repo}/tags?per_page=100", paginate=True)
    releases = gh_api_json(gh_binary, f"repos/{repo}/releases?per_page=100", paginate=True)
    issues = gh_api_json(gh_binary, f"repos/{repo}/issues?state=all&direction=asc&per_page=100", paginate=True)
    pulls = gh_api_json(gh_binary, f"repos/{repo}/pulls?state=all&sort=updated&direction=asc&per_page=100", paginate=True)

    metadata_dir = output_dir / "metadata"
    write_json(metadata_dir / "repository.json", repository)
    write_json(metadata_dir / "tags.json", tags)
    write_json(metadata_dir / "releases.json", releases)
    catalog = build_snapshot_catalog(tags, releases)
    write_json(metadata_dir / "snapshot_catalog.json", catalog)

    selected_ref = (args.ref or str(repository.get("default_branch") or "HEAD")).strip()
    git_metadata = export_git_artifacts(
        git_binary=git_binary,
        repo_root=repo_root,
        output_dir=output_dir,
        selected_ref=selected_ref,
    )

    issues_dir = output_dir / "issues"
    pulls_dir = output_dir / "pulls"
    write_json(issues_dir / "issues.json", issues)
    write_json(pulls_dir / "pulls.json", pulls)

    issue_comment_count = 0
    for issue in issues:
        number = int(issue["number"])
        comments = gh_api_json(gh_binary, f"repos/{repo}/issues/{number}/comments?per_page=100", paginate=True)
        write_json(issues_dir / "comments" / f"{number}.json", comments)
        issue_comment_count += len(comments)

    review_count = 0
    review_comment_count = 0
    for pull in pulls:
        number = int(pull["number"])
        reviews = gh_api_json(gh_binary, f"repos/{repo}/pulls/{number}/reviews?per_page=100", paginate=True)
        review_comments = gh_api_json(gh_binary, f"repos/{repo}/pulls/{number}/comments?per_page=100", paginate=True)
        write_json(pulls_dir / "reviews" / f"{number}.json", reviews)
        write_json(pulls_dir / "review_comments" / f"{number}.json", review_comments)
        review_count += len(reviews)
        review_comment_count += len(review_comments)

    release_asset_summary = {
        "downloaded_release_assets": 0,
        "skipped_release_assets": 0,
    }
    if args.download_release_assets:
        release_asset_summary = download_release_assets(
            gh_binary=gh_binary,
            repo=repo,
            releases=releases,
            output_dir=output_dir,
        )

    manifest_name = "export_manifest.json"
    manifest = {
        "schema_version": 1,
        "mode": "snapshot",
        "exported_at_utc": utc_now(),
        "source_repository": repo,
        "repo_root": str(repo_root),
        "selected_ref": selected_ref,
        "selected_commit_sha": git_metadata["selected_commit_sha"],
        "artifacts": {
            "repository": "metadata/repository.json",
            "tags": "metadata/tags.json",
            "releases": "metadata/releases.json",
            "snapshot_catalog": "metadata/snapshot_catalog.json",
            "issues": "issues/issues.json",
            "pulls": "pulls/pulls.json",
            "git_bundle": "git/repo.bundle",
            "selected_snapshot": "git/selected_snapshot.tgz",
            "git_refs": "git/refs.json",
            "selected_ref_metadata": "git/selected_ref.json",
        },
        "summary": {
            "tag_count": len(tags),
            "release_count": len(releases),
            "release_asset_count": sum(len(release.get("assets") or []) for release in releases),
            "issue_count": sum(1 for issue in issues if "pull_request" not in issue),
            "issue_like_entry_count": len(issues),
            "issue_comment_count": issue_comment_count,
            "pull_request_count": len(pulls),
            "pull_review_count": review_count,
            "pull_review_comment_count": review_comment_count,
            **release_asset_summary,
        },
    }
    manifest["inventory"] = collect_inventory(output_dir, manifest_name)
    write_json(output_dir / manifest_name, manifest)
    print(output_dir)
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Export GitHub-hosted QMS repository snapshots or snapshot catalogs.")
    subparsers = parser.add_subparsers(dest="command", required=True)

    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("--repo", help="GitHub repository in owner/name form. Defaults to origin remote or GH_REPO.")
    common.add_argument("--repo-root", help="Local repository root. Required for snapshot exports.")
    common.add_argument("--git-binary", help="Path to git binary for bundle/archive operations.")
    common.add_argument("--output", required=True, help="Output directory for the export package.")

    snapshot = subparsers.add_parser("snapshot", parents=[common], help="Export a restorable QMS snapshot package.")
    snapshot.add_argument("--ref", help="Git ref to archive as the selected snapshot. Defaults to the repository default branch.")
    snapshot.add_argument(
        "--download-release-assets",
        action="store_true",
        help="Download release asset binaries into the export package. Metadata is always exported.",
    )
    snapshot.set_defaults(func=export_snapshot)

    catalog = subparsers.add_parser("catalog", parents=[common], help="Export a catalog of available QMS snapshots/releases.")
    catalog.set_defaults(func=export_catalog)
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    return int(args.func(args))


if __name__ == "__main__":
    sys.exit(main())
