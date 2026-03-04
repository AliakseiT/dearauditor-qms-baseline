#!/usr/bin/env python3
"""Generate a paper-style signature attestation title page (PDF and optional PNG)."""

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


def _normalized_signers(attestation: dict[str, Any]) -> list[dict[str, str]]:
    normalized: list[dict[str, str]] = []
    for signer in _as_list(attestation):
        user_id = str(signer.get("user_id") or signer.get("actor_login") or "").strip()
        full_name = str(signer.get("signer_full_name") or "").strip()
        role = str(signer.get("signer_role") or "Unspecified role").strip()
        title = str(signer.get("signer_job_title") or "").strip()
        signed_at = str(signer.get("timestamp") or signer.get("timestamp_utc") or "n/a").strip()
        normalized.append(
            {
                "user_id": user_id or "unknown",
                "full_name": full_name or user_id or "unknown",
                "role": role or "Unspecified role",
                "title": title or "n/a",
                "signed_at": signed_at,
            }
        )
    return normalized


def _compose_sections(attestation: dict[str, Any], record_id: str) -> list[tuple[str, list[str]]]:
    signers = _normalized_signers(attestation)

    repo = _pick_value(attestation, ("source_repository", "repository"))
    pr_num = _pick_value(attestation, ("source_pull_request", "pr_number"))
    pr_title = _pick_value(attestation, ("source_pr_title", "pr_title"))
    target_hash = _pick_value(attestation, ("part11_target_hash", "target_hash"))
    scope = _pick_value(attestation, ("attestation_scope", "attestation_type"))
    captured_at = _pick_value(attestation, ("captured_at_utc",))
    meaning = _pick_value(attestation, ("meaning_of_signature",))
    required = _pick_value(attestation, ("required_signatures",))
    captured = _pick_value(attestation, ("captured_signatures",))
    completion = _pick_value(attestation, ("all_required_collected",)).lower()
    status = "Complete" if completion == "true" else "Pending"
    change_text = f"PR #{pr_num}: {pr_title}" if pr_num and pr_title else (f"PR #{pr_num}" if pr_num else "n/a")

    summary_lines = [
        "This page documents the electronic signatures captured for a QMS change.",
        f"Record ID: {record_id or 'n/a'}",
        f"Change: {change_text}",
        f"Repository: {repo or 'n/a'}",
        f"Meaning of signature: {meaning or 'Approved Quality Record'}",
        f"Target hash: {target_hash or 'n/a'}",
        f"Scope: {scope or 'pr_signature'}",
        f"Captured at (UTC): {captured_at or 'n/a'}",
        f"Status: {status} ({captured or len(signers)}/{required or len(signers)} required)",
    ]

    signatory_lines: list[str] = []
    if not signers:
        signatory_lines.append("No signatories captured.")
    else:
        for idx, signer in enumerate(signers, start=1):
            signatory_lines.extend(
                [
                    f"Signatory {idx}",
                    f"Role: {signer['role']}",
                    f"Full legal name: {signer['full_name']}",
                    f"Job title: {signer['title']}",
                    f"GitHub account: @{signer['user_id']}",
                    f"Signed at (UTC): {signer['signed_at']}",
                    "",
                ]
            )
        while signatory_lines and not signatory_lines[-1].strip():
            signatory_lines.pop()

    footer_lines = [
        "Electronic signature assertion:",
        "I confirm this signature is executed by me with my authenticated account and applied to this exact target hash.",
    ]

    return [
        ("Signature Attestation Page", summary_lines),
        ("Signatories", signatory_lines),
        ("Assertion", footer_lines),
    ]


def build_pdf(attestation_path: Path, output_path: Path, record_id: str) -> None:
    attestation = json.loads(attestation_path.read_text(encoding="utf-8"))
    sections = _compose_sections(attestation, record_id)

    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_margins(18, 18, 18)
    pdf.set_draw_color(80, 80, 80)
    pdf.rect(12, 12, 186, 273)

    first = True
    for heading, lines in sections:
        if first:
            pdf.set_font("Helvetica", style="B", size=16)
            pdf.multi_cell(0, 9, heading, new_x="LMARGIN", new_y="NEXT")
            first = False
        else:
            pdf.ln(2)
            pdf.set_font("Helvetica", style="B", size=12)
            pdf.multi_cell(0, 7, heading, new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", size=10)
        for line in lines:
            pdf.multi_cell(0, 6, line if line else " ", new_x="LMARGIN", new_y="NEXT")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    pdf.output(str(output_path))


def _build_png(attestation_path: Path, output_path: Path, record_id: str) -> None:
    try:
        from PIL import Image, ImageDraw, ImageFont
    except Exception as exc:
        raise RuntimeError("Pillow is required for --output-png rendering.") from exc

    attestation = json.loads(attestation_path.read_text(encoding="utf-8"))
    sections = _compose_sections(attestation, record_id)

    width, height = 1400, 1980
    margin = 90
    img = Image.new("RGB", (width, height), "#d9dfeb")
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle((52, 52, width - 52, height - 52), radius=20, fill="#f7f3e8", outline="#6f7480", width=3)

    def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
        candidates = ["DejaVuSans-Bold.ttf", "Arial Bold.ttf"] if bold else ["DejaVuSans.ttf", "Arial.ttf"]
        for name in candidates:
            try:
                return ImageFont.truetype(name, size=size)
            except Exception:
                continue
        return ImageFont.load_default()

    font_title = load_font(50, bold=True)
    font_heading = load_font(34, bold=True)
    font_body = load_font(27, bold=False)

    line_gap = 10
    y = margin
    text_width = width - (margin * 2)

    def wrap_line(text: str, font: Any) -> list[str]:
        words = text.split()
        if not words:
            return [""]
        lines: list[str] = []
        cur = words[0]
        for word in words[1:]:
            candidate = f"{cur} {word}"
            w = draw.textbbox((0, 0), candidate, font=font)[2]
            if w <= text_width:
                cur = candidate
            else:
                lines.append(cur)
                cur = word
        lines.append(cur)
        return lines

    for idx, (heading, lines) in enumerate(sections):
        hfont = font_title if idx == 0 else font_heading
        draw.text((margin, y), heading, font=hfont, fill="#1b2a47")
        y += draw.textbbox((0, 0), heading, font=hfont)[3] + 12
        for line in lines:
            wrapped = wrap_line(line, font_body)
            for piece in wrapped:
                draw.text((margin, y), piece, font=font_body, fill="#202225")
                y += draw.textbbox((0, 0), piece or " ", font=font_body)[3] + line_gap
            if not line.strip():
                y += 4
        y += 20
        if y > height - margin:
            break

    output_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(output_path, format="PNG", optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate signature title page from attestation JSON.")
    parser.add_argument("--attestation", required=True, help="Path to signed_attestation.json")
    parser.add_argument("--output", required=True, help="Output PDF path")
    parser.add_argument("--output-png", default="", help="Optional output PNG path")
    parser.add_argument("--record-id", default="", help="Record identifier for title page")
    args = parser.parse_args()

    attestation_path = Path(args.attestation)
    build_pdf(attestation_path, Path(args.output), args.record_id.strip())
    if args.output_png.strip():
        _build_png(attestation_path, Path(args.output_png.strip()), args.record_id.strip())


if __name__ == "__main__":
    main()
