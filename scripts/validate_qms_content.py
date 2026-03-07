#!/usr/bin/env python3

import argparse
import json
import re
import subprocess
import sys
import unittest
from dataclasses import dataclass
from pathlib import Path

RECORD_INDEX_RULES = [
    {
        "name": "Approved supplier list",
        "index_path": "records/suppliers/approved_supplier_list.yml",
        "watch_prefix": "records/suppliers/",
    },
]

ARGS = None


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


def load_yaml_via_ruby(path):
    script = (
        "require 'yaml'; "
        "require 'json'; "
        "data = YAML.safe_load(File.read(ARGV[0]), permitted_classes: [], aliases: false) || {}; "
        "print JSON.generate(data)"
    )
    proc = subprocess.run(
        ["ruby", "-e", script, path],
        text=True,
        capture_output=True,
    )
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr.strip() or proc.stdout.strip() or "ruby YAML parse failed")
    return json.loads(proc.stdout or "{}")


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
    return bool(
        re.search(r"(^|[_-])template\.(md|ya?ml|json)$", Path(path).name, flags=re.IGNORECASE)
    )


def is_record_readme(path):
    return bool(re.search(r"(^|/)README\.md$", path, flags=re.IGNORECASE))


def is_record_artifact(path):
    return path.startswith("records/") and bool(
        re.search(r"\.(md|ya?ml|json)$", path, flags=re.IGNORECASE)
    )


@dataclass
class DocInfo:
    path: str
    doc_id: str
    revision: str
    date: str
    head_text: str
    base_text: str


@dataclass
class QMSContext:
    base_sha: str
    head_sha: str
    changed: list[str]
    changed_set: set[str]
    readme_text: str
    readme_nav: dict
    readme_sop_index: dict
    changed_doc_infos: list[DocInfo]
    changed_sops: list[DocInfo]
    changed_wis: list[DocInfo]
    training_matrix: dict
    sop_to_roles: dict


def parse_training_matrix(text):
    roles = {}
    in_roles = False
    current_role = None
    current_section = None

    for raw_line in text.splitlines():
        line = raw_line.rstrip()
        if re.match(r"^roles:\s*$", line):
            in_roles = True
            current_role = None
            current_section = None
            continue
        if not in_roles:
            continue

        role_match = re.match(r"^  ([A-Za-z0-9_]+):\s*$", line)
        if role_match:
            current_role = role_match.group(1)
            roles[current_role] = {"required_sops": [], "required_revisions": {}}
            current_section = None
            continue

        if current_role is None:
            continue

        section_match = re.match(r"^    ([A-Za-z0-9_]+):\s*$", line)
        if section_match:
            current_section = section_match.group(1)
            continue

        if current_section == "required_sops":
            item_match = re.match(r"^      - (.+?)\s*$", line)
            if item_match:
                roles[current_role]["required_sops"].append(item_match.group(1).strip())
                continue

        if current_section == "required_revisions":
            kv_match = re.match(r"^      ([A-Za-z0-9_-]+):\s*(.+?)\s*$", line)
            if kv_match:
                roles[current_role]["required_revisions"][kv_match.group(1).strip()] = kv_match.group(2).strip()
                continue

        if re.match(r"^(?:\S|  [A-Za-z0-9_]+:)", line):
            current_section = None

    return {"roles": roles}


def build_context(base_sha, head_sha):
    changed = changed_files(base_sha, head_sha)
    changed_set = set(changed)
    readme_text = Path("README.md").read_text(encoding="utf-8")
    readme_nav = parse_readme_doc_nav(readme_text)
    readme_sop_index = parse_readme_sop_index(readme_text)

    matrix_path = Path("matrices/training_matrix.yml")
    training_matrix = parse_training_matrix(matrix_path.read_text(encoding="utf-8"))
    roles = training_matrix.get("roles", {}) or {}
    sop_to_roles = {}
    for role_name, role_def in roles.items():
        for item in role_def.get("required_sops", []) or []:
            match = re.search(r"(SOP-\d+)", str(item), flags=re.IGNORECASE)
            if not match:
                continue
            sop_id = match.group(1).upper()
            sop_to_roles.setdefault(sop_id, set()).add(role_name)

    changed_doc_infos = []
    for path in changed:
        if not (
            (path.startswith("sops/") or path.startswith("wis/"))
            and path.endswith(".md")
        ):
            continue
        head_text = Path(path).read_text(encoding="utf-8")
        base_text = file_at_revision(base_sha, path)
        id_key = "sop_id" if path.startswith("sops/") else "wi_id"
        changed_doc_infos.append(
            DocInfo(
                path=path,
                doc_id=parse_front_matter_value(head_text, id_key),
                revision=parse_front_matter_value(head_text, "revision"),
                date=parse_front_matter_value(head_text, "effective_date"),
                head_text=head_text,
                base_text=base_text,
            )
        )

    changed_sops = [doc for doc in changed_doc_infos if doc.path.startswith("sops/")]
    changed_wis = [doc for doc in changed_doc_infos if doc.path.startswith("wis/")]

    return QMSContext(
        base_sha=base_sha,
        head_sha=head_sha,
        changed=changed,
        changed_set=changed_set,
        readme_text=readme_text,
        readme_nav=readme_nav,
        readme_sop_index=readme_sop_index,
        changed_doc_infos=changed_doc_infos,
        changed_sops=changed_sops,
        changed_wis=changed_wis,
        training_matrix=training_matrix,
        sop_to_roles=sop_to_roles,
    )


class QMSContentGuardTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.ctx = build_context(ARGS.base, ARGS.head)

    def assert_no_failures(self, failures):
        self.assertEqual([], failures, "\n".join(failures))

    def test_readme_updated_when_sops_or_wis_change(self):
        failures = []
        if self.ctx.changed_sops or self.ctx.changed_wis:
            if "README.md" not in self.ctx.changed_set:
                failures.append("README.md must be updated when SOP or WI files change.")
        self.assert_no_failures(failures)

    def test_changed_documents_have_valid_metadata(self):
        failures = []
        for doc in self.ctx.changed_doc_infos:
            id_key = "sop_id" if doc.path.startswith("sops/") else "wi_id"
            if not re.fullmatch(r"(?:SOP|WI)-\d+", doc.doc_id or ""):
                failures.append(f"{doc.path}: missing or invalid {id_key} in front matter.")
            if not re.fullmatch(r"R\d{2}", doc.revision or ""):
                failures.append(f"{doc.path}: missing or invalid revision in front matter.")
            if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", doc.date or ""):
                failures.append(f"{doc.path}: missing or invalid effective_date in front matter.")
        self.assert_no_failures(failures)

    def test_changed_documents_increment_revision(self):
        failures = []
        for doc in self.ctx.changed_doc_infos:
            previous_revision = parse_front_matter_value(doc.base_text, "revision")
            if previous_revision and revision_number(doc.revision) <= revision_number(previous_revision):
                failures.append(
                    f"{doc.path}: revision was not incremented ({previous_revision} -> {doc.revision})."
                )
        self.assert_no_failures(failures)

    def test_changed_documents_add_revision_history_rows(self):
        failures = []
        for doc in self.ctx.changed_doc_infos:
            if doc.revision and doc.date:
                revision_rows = parse_markdown_revision_row_pairs(doc.head_text)
                if (doc.revision, doc.date) not in revision_rows:
                    failures.append(
                        f"{doc.path}: revision history is missing row for {doc.revision} / {doc.date}."
                    )
        self.assert_no_failures(failures)

    def test_readme_visible_navigation_matches_changed_documents(self):
        failures = []
        for doc in self.ctx.changed_doc_infos:
            entry = self.ctx.readme_nav.get((doc.doc_id or "").upper())
            if not entry:
                failures.append(f"README.md visible navigation is missing entry for {doc.doc_id or doc.path}.")
                continue
            if entry["path"] != doc.path:
                failures.append(
                    f"README.md visible navigation path mismatch for {doc.doc_id}: {entry['path']} != {doc.path}."
                )
            if doc.revision and entry["revision"] != doc.revision:
                failures.append(
                    f"README.md visible navigation revision mismatch for {doc.doc_id}: {entry['revision']} != {doc.revision}."
                )
            if doc.date and entry["date"] != doc.date:
                failures.append(
                    f"README.md visible navigation effective date mismatch for {doc.doc_id}: {entry['date']} != {doc.date}."
                )
        self.assert_no_failures(failures)

    def test_readme_published_sop_index_matches_changed_sops(self):
        failures = []
        for doc in self.ctx.changed_sops:
            entry = self.ctx.readme_sop_index.get((doc.doc_id or "").upper())
            if not entry:
                failures.append(f"README.md published SOP index is missing entry for {doc.doc_id or doc.path}.")
                continue
            if entry["path"] != doc.path:
                failures.append(
                    f"README.md published SOP index path mismatch for {doc.doc_id}: {entry['path']} != {doc.path}."
                )
            if doc.revision and entry["revision"] != doc.revision:
                failures.append(
                    f"README.md published SOP index revision mismatch for {doc.doc_id}: {entry['revision']} != {doc.revision}."
                )
            if doc.date and entry["date"] != doc.date:
                failures.append(
                    f"README.md published SOP index effective date mismatch for {doc.doc_id}: {entry['date']} != {doc.date}."
                )
        self.assert_no_failures(failures)

    def test_training_matrix_updated_when_sops_change(self):
        failures = []
        if self.ctx.changed_sops and "matrices/training_matrix.yml" not in self.ctx.changed_set:
            failures.append("matrices/training_matrix.yml must be updated when SOP files change.")
        self.assert_no_failures(failures)

    def test_changed_sops_are_mapped_to_training_roles(self):
        failures = []
        for doc in self.ctx.changed_sops:
            if not self.ctx.sop_to_roles.get((doc.doc_id or "").upper(), set()):
                failures.append(f"{doc.doc_id or doc.path} has no roles mapped in training_matrix.yml.")
        self.assert_no_failures(failures)

    def test_training_matrix_explicit_revisions_match_changed_sops(self):
        failures = []
        roles = (self.ctx.training_matrix.get("roles", {}) or {})
        for doc in self.ctx.changed_sops:
            sop_id = (doc.doc_id or "").upper()
            for role_name, role_def in roles.items():
                required_revisions = role_def.get("required_revisions", {}) or {}
                for key, value in required_revisions.items():
                    match = re.search(r"(SOP-\d+)", str(key), flags=re.IGNORECASE)
                    if not match or match.group(1).upper() != sop_id:
                        continue
                    expected_revision = str(value).strip().upper()
                    if expected_revision != doc.revision:
                        failures.append(
                            f"training_matrix.yml role {role_name} pins {sop_id} to {expected_revision}, expected {doc.revision}."
                        )
        self.assert_no_failures(failures)

    def test_record_indexes_are_updated_for_changed_records(self):
        failures = []
        for rule in RECORD_INDEX_RULES:
            watched_records = [
                path
                for path in self.ctx.changed
                if path.startswith(rule["watch_prefix"])
                and is_record_artifact(path)
                and path != rule["index_path"]
                and not is_template_record(path)
                and not is_record_readme(path)
            ]
            if watched_records and rule["index_path"] not in self.ctx.changed_set:
                failures.append(
                    f"{rule['name']} must be updated when these record files change: {', '.join(sorted(watched_records))}."
                )
        self.assert_no_failures(failures)

    def test_risk_records_have_valid_schema(self):
        failures = []
        allowed_source_types = {
            "hazard_top_down",
            "failure_mode_bottom_up",
            "cybersecurity_threat",
        }

        changed_risk_files = [
            path
            for path in self.ctx.changed
            if path.startswith("records/risk/") and path.endswith(".yml")
        ]

        for file_path in changed_risk_files:
            path = Path(file_path)
            if not path.exists() or is_template_record(file_path):
                continue

            try:
                doc = load_yaml_via_ruby(file_path) or {}
            except Exception as exc:
                failures.append(f"{file_path}: YAML could not be parsed ({exc}).")
                continue

            if str(doc.get("record_type", "")).strip() != "risk_register":
                continue

            for root_key in ["version", "product_id", "assessment_scope", "scoring_model", "entries"]:
                if root_key not in doc:
                    failures.append(f"{file_path}: missing root key '{root_key}'")

            entries = doc.get("entries", []) or []
            if not isinstance(entries, list) or not entries:
                failures.append(f"{file_path}: entries must be a non-empty list")
                continue

            for idx, entry in enumerate(entries, start=1):
                record_path = f"{file_path} entry[{idx}]"
                if not isinstance(entry, dict):
                    failures.append(f"{record_path}: entry must be a mapping")
                    continue

                for key in [
                    "risk_id",
                    "source_type",
                    "hazard_or_threat",
                    "hazardous_situation",
                    "possible_harm",
                    "initial_risk",
                    "controls",
                    "residual_risk",
                    "status",
                ]:
                    if key not in entry:
                        failures.append(f"{record_path}: missing '{key}'")

                source_type = str(entry.get("source_type", "")).strip()
                if source_type and source_type not in allowed_source_types:
                    failures.append(f"{record_path}: invalid source_type '{source_type}'")

                for risk_key in ["initial_risk", "residual_risk"]:
                    risk_value = entry.get(risk_key, {}) or {}
                    if not isinstance(risk_value, dict):
                        failures.append(f"{record_path}: {risk_key} must be a mapping")
                        continue
                    for key in ["severity", "probability", "score"]:
                        if key not in risk_value:
                            failures.append(f"{record_path}: {risk_key} missing '{key}'")
                    try:
                        severity = int(risk_value.get("severity"))
                        probability = int(risk_value.get("probability"))
                        score = int(risk_value.get("score"))
                        if score != severity * probability:
                            failures.append(
                                f"{record_path}: {risk_key}.score ({score}) != severity*probability ({severity * probability})"
                            )
                    except Exception:
                        failures.append(f"{record_path}: {risk_key} severity/probability/score must be integers")

                controls = entry.get("controls", []) or []
                if not isinstance(controls, list) or not controls:
                    failures.append(f"{record_path}: controls must be a non-empty list")

        self.assert_no_failures(failures)


def main():
    global ARGS
    parser = argparse.ArgumentParser(description="Validate QMS content sanity rules.")
    parser.add_argument("--base", required=True, help="Base git revision")
    parser.add_argument("--head", required=True, help="Head git revision")
    ARGS = parser.parse_args()
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(QMSContentGuardTests)
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    return 0 if result.wasSuccessful() else 1


if __name__ == "__main__":
    sys.exit(main())
