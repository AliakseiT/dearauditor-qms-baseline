#!/usr/bin/env python3
"""Build a read-only QMS handbook bundle from SOP sources."""

from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import re
from pathlib import Path
from typing import Any

import markdown
import yaml
from fpdf import FPDF


def parse_frontmatter(raw: str) -> tuple[dict[str, Any], str]:
    if not raw.startswith("---\n"):
        return {}, raw
    end = raw.find("\n---\n", 4)
    if end == -1:
        return {}, raw
    fm_raw = raw[4:end]
    body = raw[end + 5 :]
    try:
        meta = yaml.safe_load(fm_raw) or {}
    except Exception:
        meta = {}
    if not isinstance(meta, dict):
        meta = {}
    return meta, body


def sop_num(sop_id: str, fallback_name: str) -> int:
    m = re.search(r"SOP-(\d+)", sop_id or fallback_name, flags=re.IGNORECASE)
    return int(m.group(1)) if m else 9999


def sha256_text(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def build_markdown(
    entries: list[dict[str, Any]],
    source_ref: str,
    source_repo: str,
    generated_at: str,
) -> str:
    lines = [
        "# ACME GmbH QMS Handbook",
        "",
        "Internal controlled reading/training package.",
        "",
        f"- Source repository: `{source_repo}`",
        f"- Source reference: `{source_ref}`",
        f"- Generated at (UTC): `{generated_at}`",
        "",
        "## Published SOP Index",
        "",
        "| SOP ID | Title | Revision | Effective Date | Status |",
        "|---|---|---|---|---|",
    ]
    for entry in entries:
        lines.append(
            "| {sop_id} | {title} | {revision} | {effective_date} | {status} |".format(
                sop_id=entry["sop_id"],
                title=entry["title"],
                revision=entry["revision"],
                effective_date=entry["effective_date"],
                status=entry["status"],
            )
        )

    lines.extend(["", "## SOP Content", ""])
    for entry in entries:
        lines.extend(
            [
                f"### {entry['sop_id']} - {entry['title']}",
                f"- Revision: `{entry['revision']}`",
                f"- Effective Date: `{entry['effective_date']}`",
                f"- Status: `{entry['status']}`",
                f"- Source File: `{entry['file']}`",
                "",
                entry["body"].rstrip(),
                "",
            ]
        )

    return "\n".join(lines).rstrip() + "\n"


def markdown_to_pdf(md_text: str, pdf_path: Path) -> str:
    html = markdown.markdown(md_text, extensions=["tables", "fenced_code"])
    plain = re.sub(r"<[^>]+>", "", html)
    lines = plain.splitlines() or [""]

    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.set_margins(15, 15, 15)
    pdf.add_page()
    pdf.set_font("Helvetica", size=11)
    for raw in lines:
        line = raw.replace("\t", "    ")
        pdf.multi_cell(0, 6, line if line else " ", new_x="LMARGIN", new_y="NEXT")

    pdf.output(str(pdf_path))
    return hashlib.sha256(pdf_path.read_bytes()).hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser(description="Build QMS handbook bundle.")
    parser.add_argument("--repo-root", default=".", help="Path to qms-lite root")
    parser.add_argument("--output-dir", default="handbook_build", help="Output directory")
    parser.add_argument("--source-ref", required=True, help="Source git ref/sha/tag")
    parser.add_argument("--source-repo", required=True, help="Source repository full name")
    args = parser.parse_args()

    repo_root = Path(args.repo_root).resolve()
    out_dir = Path(args.output_dir).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)

    sops_dir = repo_root / "sops"
    if not sops_dir.exists():
        raise SystemExit(f"Missing directory: {sops_dir}")

    entries: list[dict[str, Any]] = []
    for sop_path in sorted(sops_dir.glob("SOP-*.md")):
        raw = sop_path.read_text(encoding="utf-8")
        meta, body = parse_frontmatter(raw)
        sop_id = str(meta.get("sop_id") or sop_path.stem.split("-")[0] + "-" + sop_path.stem.split("-")[1]).strip()
        title = str(meta.get("title") or sop_path.stem).strip()
        revision = str(meta.get("revision") or "R00").strip()
        effective_date = str(meta.get("effective_date") or "").strip()
        status = str(meta.get("status") or "Published").strip()
        rel_file = str(sop_path.relative_to(repo_root))
        body_sha = sha256_text(body)
        entries.append(
            {
                "sop_id": sop_id,
                "title": title,
                "revision": revision,
                "effective_date": effective_date,
                "status": status,
                "file": rel_file,
                "body": body,
                "body_sha256": body_sha,
            }
        )

    entries.sort(key=lambda x: sop_num(x["sop_id"], x["file"]))
    generated_at = dt.datetime.now(dt.timezone.utc).isoformat()

    handbook_md = build_markdown(entries, args.source_ref, args.source_repo, generated_at)
    md_path = out_dir / "qms_handbook.md"
    md_path.write_text(handbook_md, encoding="utf-8")

    html_path = out_dir / "qms_handbook.html"
    html_path.write_text(
        markdown.markdown(handbook_md, extensions=["tables", "fenced_code"]),
        encoding="utf-8",
    )

    pdf_path = out_dir / "qms_handbook.pdf"
    pdf_sha = markdown_to_pdf(handbook_md, pdf_path)
    md_sha = hashlib.sha256(md_path.read_bytes()).hexdigest()
    html_sha = hashlib.sha256(html_path.read_bytes()).hexdigest()

    manifest = {
        "schema_version": 1,
        "bundle_type": "qms_handbook",
        "source_repository": args.source_repo,
        "source_ref": args.source_ref,
        "generated_at_utc": generated_at,
        "sop_count": len(entries),
        "assets": {
            "qms_handbook.md": md_sha,
            "qms_handbook.html": html_sha,
            "qms_handbook.pdf": pdf_sha,
        },
        "sops": [
            {
                "sop_id": e["sop_id"],
                "title": e["title"],
                "revision": e["revision"],
                "effective_date": e["effective_date"],
                "status": e["status"],
                "file": e["file"],
                "body_sha256": e["body_sha256"],
            }
            for e in entries
        ],
    }
    (out_dir / "publish_manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")

    print(f"Built handbook bundle at {out_dir}")
    print(f"SOP count: {len(entries)}")


if __name__ == "__main__":
    main()
