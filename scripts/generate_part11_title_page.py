#!/usr/bin/env python3
"""Generate a compact Part 11 attestation title-page PDF from JSON."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from fpdf import FPDF


def _as_list(attestation: dict[str, Any]) -> list[dict[str, Any]]:
    if isinstance(attestation.get("signed_attestations"), list):
        return [x for x in attestation["signed_attestations"] if isinstance(x, dict)]
    # Support single-signer payload shape.
    if attestation.get("actor_login") or attestation.get("signer_role"):
        return [
            {
                "user_id": attestation.get("actor_login", ""),
                "signer_full_name": attestation.get("signer_full_name", ""),
                "signer_job_title": attestation.get("signer_job_title", ""),
                "signer_role": attestation.get("signer_role", ""),
                "timestamp": attestation.get("timestamp_utc", ""),
            }
        ]
    return []


def _pick_value(attestation: dict[str, Any], keys: tuple[str, ...]) -> str:
    for key in keys:
        value = attestation.get(key)
        if value not in (None, ""):
            return str(value).strip()
    return ""


def build_pdf(attestation_path: Path, output_path: Path, record_id: str) -> None:
    attestation = json.loads(attestation_path.read_text(encoding="utf-8"))
    signers = _as_list(attestation)

    repo = _pick_value(attestation, ("source_repository", "repository"))
    pr_num = _pick_value(attestation, ("source_pull_request", "pr_number"))
    target_hash = _pick_value(attestation, ("part11_target_hash", "target_hash"))
    scope = _pick_value(attestation, ("attestation_scope", "attestation_type"))
    captured_at = _pick_value(attestation, ("captured_at_utc",))

    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Helvetica", style="B", size=14)
    pdf.cell(0, 8, "Part 11 Signature Attestation Title Page", ln=1)
    pdf.ln(1)

    pdf.set_font("Helvetica", size=11)
    header_lines = [
        f"Record ID: {record_id or 'n/a'}",
        f"Attestation Scope: {scope or 'n/a'}",
        f"Repository: {repo or 'n/a'}",
        f"Source PR: {pr_num or 'n/a'}",
        f"Target Hash: {target_hash or 'n/a'}",
        f"Captured At (UTC): {captured_at or 'n/a'}",
        f"Signer Count: {len(signers)}",
    ]
    for line in header_lines:
        pdf.multi_cell(0, 6, line, new_x="LMARGIN", new_y="NEXT")

    pdf.ln(2)
    pdf.set_font("Helvetica", style="B", size=11)
    pdf.multi_cell(
        0,
        6,
        "Signatories (name, role, title, signing date):",
        new_x="LMARGIN",
        new_y="NEXT",
    )
    pdf.set_font("Helvetica", size=10)

    if not signers:
        pdf.multi_cell(0, 6, "- none", new_x="LMARGIN", new_y="NEXT")
    else:
        for idx, signer in enumerate(signers, start=1):
            full_name = str(signer.get("signer_full_name") or "").strip()
            user_id = str(signer.get("user_id") or signer.get("actor_login") or "").strip()
            display_name = full_name or user_id or "unknown"
            role = str(signer.get("signer_role") or "unspecified").strip()
            title = str(signer.get("signer_job_title") or "unspecified").strip()
            timestamp = str(signer.get("timestamp") or signer.get("timestamp_utc") or "n/a").strip()
            login_text = f" ({user_id})" if user_id and user_id != display_name else ""
            line = f"{idx}. {display_name}{login_text} | Role: {role} | Title: {title} | Signed At: {timestamp}"
            pdf.multi_cell(0, 6, line, new_x="LMARGIN", new_y="NEXT")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    pdf.output(str(output_path))


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate Part 11 title-page PDF from attestation JSON.")
    parser.add_argument("--attestation", required=True, help="Path to signed_attestation.json")
    parser.add_argument("--output", required=True, help="Output PDF path")
    parser.add_argument("--record-id", default="", help="Record identifier for title page")
    args = parser.parse_args()

    build_pdf(Path(args.attestation), Path(args.output), args.record_id.strip())


if __name__ == "__main__":
    main()
