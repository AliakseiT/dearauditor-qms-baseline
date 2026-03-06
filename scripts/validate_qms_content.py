#!/usr/bin/env python3

import argparse
import re
import subprocess
import sys
from pathlib import Path


RECORD_INDEX_RULES = [
    {
        "name": "Approved supplier list",
        "index_path": "records/suppliers/approved_supplier_list.yml",
        "watch_prefix": "records/suppliers/",
    },
]


def git_output(args, allow_fail=False):
    proc = subprocess.run(["git", *args], text=True, capture_output=True)
    if proc.returncode != 0:
        if allow_fail:
            return ""
        raise RuntimeError(proc.stderr.strip() or f"git {' '.join(args)} failed")
    return proc.stdout


def changed_files(base_sha, head_sha):
    output = git_output(["diff", "--name-only", base_sha, head_sha])
    return [line.strip() for line in output.splitlines() if line.strip()]


def file_at_revision(rev, path):
    return git_output(["show", f"{rev}:{path}"], allow_fail=True)


def parse_front_matter_value(text, key):
    match = re.search(rf"(?mi)^{re.escape(key)}:\s*(.+?)\s*$", text)
    return match.group(1).strip() if match else ""


def revision_number(value):
    match = re.fullmatch(r"R(\d+)", value or "")
    return int(match.group(1)) if match else -1


def parse_markdown_revision_row_pairs(text):
    rows = set()
    for line in text.splitlines():
        row = line.strip()
        if not row.startswith("|"):
            continue
        cols = [col.strip() for col in row.strip("|").split("|")]
        if len(cols) < 2:
            continue
        revision = cols[0]
        date = cols[1]
        if re.fullmatch(r"R\d{2}", revision) and re.fullmatch(r"\d{4}-\d{2}-\d{2}", date):
            rows.add((revision, date))
    return rows


def parse_readme_doc_nav(text):
    entries = {}
    pattern = re.compile(
        r"^- \[[^\]]+\]\((?P<path>(?:sops|wis)/[^)]+)\) - `(?P<revision>R\d{2})`, effective `(?P<date>\d{4}-\d{2}-\d{2})`$",
        flags=re.MULTILINE,
    )
    for match in pattern.finditer(text):
        path = match.group("path").strip()
        id_match = re.search(r"((?:SOP|WI)-\d+)", path, flags=re.IGNORECASE)
        if not id_match:
            continue
        doc_id = id_match.group(1).upper()
        entries[doc_id] = {
            "path": path,
            "revision": match.group("revision"),
            "date": match.group("date"),
        }
    return entries


def parse_readme_sop_index(text):
    start = "<!-- PUBLISHED-SOP-INDEX:START -->"
    end = "<!-- PUBLISHED-SOP-INDEX:END -->"
    if start not in text or end not in text:
        return {}
    block = text.split(start, 1)[1].split(end, 1)[0]
    entries = {}
    for line in block.splitlines():
        row = line.strip()
        if not row.startswith("|"):
            continue
        if row.startswith("| SOP ID ") or row.startswith("|---"):
            continue
        cols = [col.strip() for col in row.strip("|").split("|")]
        if len(cols) < 6:
            continue
        sop_id, _title, path, date, revision, _status = cols[:6]
        if not re.fullmatch(r"SOP-\d+", sop_id):
            continue
        entries[sop_id] = {"path": path, "date": date, "revision": revision}
    return entries


def is_template_record(path):
    return bool(re.search(r"(^|[_-])template\.(md|ya?ml|json)$", Path(path).name, flags=re.IGNORECASE))


def is_record_readme(path):
    return bool(re.search(r"(^|/)README\.md$", path, flags=re.IGNORECASE))


def is_record_artifact(path):
    return path.startswith("records/") and bool(re.search(r"\.(md|ya?ml|json)$", path, flags=re.IGNORECASE))


def validate_doc_revision(path, head_text, base_text, errors):
    current_revision = parse_front_matter_value(head_text, "revision")
    current_date = parse_front_matter_value(head_text, "effective_date")
    doc_id_key = "sop_id" if path.startswith("sops/") else "wi_id"
    doc_id = parse_front_matter_value(head_text, doc_id_key)

    if not re.fullmatch(r"(?:SOP|WI)-\d+", doc_id):
        errors.append(f"{path}: missing or invalid {doc_id_key} in front matter.")
    if not re.fullmatch(r"R\d{2}", current_revision):
        errors.append(f"{path}: missing or invalid revision in front matter.")
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", current_date):
        errors.append(f"{path}: missing or invalid effective_date in front matter.")

    if base_text:
        previous_revision = parse_front_matter_value(base_text, "revision")
        if previous_revision and revision_number(current_revision) <= revision_number(previous_revision):
            errors.append(
                f"{path}: revision was not incremented ({previous_revision} -> {current_revision})."
            )

    if current_revision and current_date:
        revision_rows = parse_markdown_revision_row_pairs(head_text)
        if (current_revision, current_date) not in revision_rows:
            errors.append(
                f"{path}: revision history is missing row for {current_revision} / {current_date}."
            )

    return doc_id, current_revision, current_date


def validate_record_indexes(changed, errors):
    changed_set = set(changed)
    for rule in RECORD_INDEX_RULES:
        watched_records = [
            path
            for path in changed
            if path.startswith(rule["watch_prefix"])
            and is_record_artifact(path)
            and path != rule["index_path"]
            and not is_template_record(path)
            and not is_record_readme(path)
        ]
        if watched_records and rule["index_path"] not in changed_set:
            errors.append(
                f"{rule['name']} must be updated when these record files change: {', '.join(sorted(watched_records))}."
            )


def main():
    parser = argparse.ArgumentParser(description="Validate QMS content sanity rules.")
    parser.add_argument("--base", required=True, help="Base git revision")
    parser.add_argument("--head", required=True, help="Head git revision")
    args = parser.parse_args()

    changed = changed_files(args.base, args.head)
    readme_text = Path("README.md").read_text(encoding="utf-8")
    readme_nav = parse_readme_doc_nav(readme_text)
    readme_sop_index = parse_readme_sop_index(readme_text)
    errors = []

    changed_sops = [path for path in changed if path.startswith("sops/") and path.endswith(".md")]
    changed_wis = [path for path in changed if path.startswith("wis/") and path.endswith(".md")]

    if (changed_sops or changed_wis) and "README.md" not in changed:
        errors.append("README.md must be updated when SOP or WI files change.")

    for path in changed_sops + changed_wis:
        head_text = Path(path).read_text(encoding="utf-8")
        base_text = file_at_revision(args.base, path)
        doc_id, revision, date = validate_doc_revision(path, head_text, base_text, errors)

        if doc_id:
            nav_entry = readme_nav.get(doc_id)
            if not nav_entry:
                errors.append(f"README.md visible navigation is missing entry for {doc_id}.")
            else:
                if nav_entry["path"] != path:
                    errors.append(f"README.md visible navigation path mismatch for {doc_id}: {nav_entry['path']} != {path}.")
                if revision and nav_entry["revision"] != revision:
                    errors.append(f"README.md visible navigation revision mismatch for {doc_id}: {nav_entry['revision']} != {revision}.")
                if date and nav_entry["date"] != date:
                    errors.append(f"README.md visible navigation effective date mismatch for {doc_id}: {nav_entry['date']} != {date}.")

            if path.startswith("sops/"):
                index_entry = readme_sop_index.get(doc_id)
                if not index_entry:
                    errors.append(f"README.md published SOP index is missing entry for {doc_id}.")
                else:
                    if revision and index_entry["revision"] != revision:
                        errors.append(f"README.md published SOP index revision mismatch for {doc_id}: {index_entry['revision']} != {revision}.")
                    if date and index_entry["date"] != date:
                        errors.append(f"README.md published SOP index effective date mismatch for {doc_id}: {index_entry['date']} != {date}.")
                    if index_entry["path"] != path:
                        errors.append(f"README.md published SOP index path mismatch for {doc_id}: {index_entry['path']} != {path}.")

    validate_record_indexes(changed, errors)

    if errors:
        print("ERROR: QMS content validation failed:")
        for err in errors:
            print(f" - {err}")
        return 1

    print("QMS content validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
