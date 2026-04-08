#!/usr/bin/env python3

import argparse
import json
import os
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
        r"^- \[[^\]]+\]\((?P<path>(?:qm|sops|wis)/[^)]+)\) - `(?P<revision>R\d{2})`$",
        flags=re.MULTILINE,
    )
    for match in pattern.finditer(text):
        path = match.group("path").strip()
        id_match = re.search(r"((?:QM|SOP|WI)-\d+)", path, flags=re.IGNORECASE)
        if not id_match:
            continue
        doc_id = id_match.group(1).upper()
        entries[doc_id] = {
            "path": path,
            "revision": match.group("revision"),
        }
    return entries


def parse_readme_doc_index(text):
    start = "<!-- PUBLISHED-CONTROLLED-DOC-INDEX:START -->"
    end = "<!-- PUBLISHED-CONTROLLED-DOC-INDEX:END -->"
    if start not in text or end not in text:
        return {}
    block = text.split(start, 1)[1].split(end, 1)[0]
    entries = {}
    for line in block.splitlines():
        row = line.strip()
        if not row.startswith("|"):
            continue
        if row.startswith("| Document ID ") or row.startswith("|---"):
            continue
        cols = [col.strip() for col in row.strip("|").split("|")]
        if len(cols) < 6:
            continue
        doc_id, title, path, date, revision, status = cols[:6]
        if not re.fullmatch(r"(?:QM|SOP|WI)-\d+", doc_id):
            continue
        entries[doc_id] = {
            "title": title,
            "path": path,
            "date": date,
            "revision": revision,
            "status": status,
        }
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


def is_execution_record(path):
    return is_record_artifact(path) and not is_template_record(path) and not is_record_readme(path)


@dataclass
class DocInfo:
    path: str
    doc_id: str
    title: str
    revision: str
    date: str
    status: str
    head_text: str
    base_text: str


@dataclass
class QMSContext:
    base_sha: str
    head_sha: str
    pr_body: str
    changed: list[str]
    changed_set: set[str]
    readme_text: str
    readme_nav: dict
    readme_doc_index: dict
    all_doc_infos: list[DocInfo]
    changed_doc_infos: list[DocInfo]
    changed_qms: list[DocInfo]
    changed_sops: list[DocInfo]
    changed_wis: list[DocInfo]
    training_matrix: dict
    doc_to_roles: dict


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
            roles[current_role] = {"required_documents": [], "required_revisions": {}}
            current_section = None
            continue

        if current_role is None:
            continue

        section_match = re.match(r"^    ([A-Za-z0-9_]+):\s*$", line)
        if section_match:
            current_section = section_match.group(1)
            continue

        if current_section in {"required_documents", "required_sops"}:
            item_match = re.match(r"^      - (.+?)\s*$", line)
            if item_match:
                roles[current_role]["required_documents"].append(item_match.group(1).strip())
                continue

        if current_section == "required_revisions":
            kv_match = re.match(r"^      ([A-Za-z0-9_-]+):\s*(.+?)\s*$", line)
            if kv_match:
                roles[current_role]["required_revisions"][kv_match.group(1).strip()] = kv_match.group(2).strip()
                continue

        if re.match(r"^(?:\S|  [A-Za-z0-9_]+:)", line):
            current_section = None

    return {"roles": roles}


def is_controlled_doc_path(path):
    return (
        (path.startswith("qm/") or path.startswith("sops/") or path.startswith("wis/"))
        and path.endswith(".md")
    )


def id_key_for_controlled_doc_path(path):
    if path.startswith("qm/"):
        return "qm_id"
    if path.startswith("sops/"):
        return "sop_id"
    return "wi_id"


def controlled_doc_paths():
    paths = []
    for directory in ["qm", "sops", "wis"]:
        root = Path(directory)
        if root.exists():
            paths.extend(str(path) for path in sorted(root.glob("*.md")))
    return paths


def load_doc_info(path, base_sha=None):
    head_text = Path(path).read_text(encoding="utf-8")
    base_text = file_at_revision(base_sha, path) if base_sha else ""
    return DocInfo(
        path=path,
        doc_id=parse_front_matter_value(head_text, id_key_for_controlled_doc_path(path)),
        title=parse_front_matter_value(head_text, "title"),
        revision=parse_front_matter_value(head_text, "revision"),
        date=parse_front_matter_value(head_text, "effective_date"),
        status=parse_front_matter_value(head_text, "status"),
        head_text=head_text,
        base_text=base_text,
    )


def build_context(base_sha, head_sha):
    changed = changed_files(base_sha, head_sha)
    changed_set = set(changed)
    pr_body = os.environ.get("PR_BODY", "")
    readme_text = Path("README.md").read_text(encoding="utf-8")
    readme_nav = parse_readme_doc_nav(readme_text)
    readme_doc_index = parse_readme_doc_index(readme_text)

    matrix_path = Path("matrices/training_matrix.yml")
    training_matrix = parse_training_matrix(matrix_path.read_text(encoding="utf-8"))
    roles = training_matrix.get("roles", {}) or {}
    doc_to_roles = {}
    for role_name, role_def in roles.items():
        required_documents = role_def.get("required_documents", []) or role_def.get("required_sops", []) or []
        for item in required_documents:
            match = re.search(r"((?:QM|SOP)-\d+)", str(item), flags=re.IGNORECASE)
            if not match:
                continue
            doc_id = match.group(1).upper()
            doc_to_roles.setdefault(doc_id, set()).add(role_name)

    all_doc_infos = [load_doc_info(path) for path in controlled_doc_paths()]
    changed_doc_infos = []
    for path in changed:
        if not is_controlled_doc_path(path):
            continue
        if not Path(path).exists():
            continue
        changed_doc_infos.append(load_doc_info(path, base_sha=base_sha))

    changed_qms = [doc for doc in changed_doc_infos if doc.path.startswith("qm/")]
    changed_sops = [doc for doc in changed_doc_infos if doc.path.startswith("sops/")]
    changed_wis = [doc for doc in changed_doc_infos if doc.path.startswith("wis/")]

    return QMSContext(
        base_sha=base_sha,
        head_sha=head_sha,
        pr_body=pr_body,
        changed=changed,
        changed_set=changed_set,
        readme_text=readme_text,
        readme_nav=readme_nav,
        readme_doc_index=readme_doc_index,
        all_doc_infos=all_doc_infos,
        changed_doc_infos=changed_doc_infos,
        changed_qms=changed_qms,
        changed_sops=changed_sops,
        changed_wis=changed_wis,
        training_matrix=training_matrix,
        doc_to_roles=doc_to_roles,
    )


class QMSContentGuardTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.ctx = build_context(ARGS.base, ARGS.head)

    def assert_no_failures(self, failures):
        self.assertEqual([], failures, "\n".join(failures))

    def test_readme_updated_when_sops_or_wis_change(self):
        failures = []
        if self.ctx.changed_doc_infos:
            if "README.md" not in self.ctx.changed_set:
                failures.append("README.md must be updated when controlled document files change.")
        self.assert_no_failures(failures)

    def test_changed_documents_have_valid_metadata(self):
        failures = []
        for doc in self.ctx.changed_doc_infos:
            id_key = id_key_for_controlled_doc_path(doc.path)
            if not re.fullmatch(r"(?:QM|SOP|WI)-\d+", doc.doc_id or ""):
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

    def test_released_controlled_documents_have_published_metadata_and_indexes(self):
        failures = []
        docs = self.ctx.all_doc_infos
        if not docs:
            failures.append("No controlled QM/SOP/WI documents were found for release validation.")

        seen_doc_ids = {}
        actual_paths = {doc.path for doc in docs}
        for doc in docs:
            id_key = id_key_for_controlled_doc_path(doc.path)
            doc_id = (doc.doc_id or "").upper()
            if not re.fullmatch(r"(?:QM|SOP|WI)-\d+", doc_id):
                failures.append(f"{doc.path}: missing or invalid {id_key} in front matter.")
                continue
            if doc_id in seen_doc_ids:
                failures.append(f"{doc.path}: duplicate document id {doc_id}; already used by {seen_doc_ids[doc_id]}.")
            seen_doc_ids[doc_id] = doc.path

            if not doc.title:
                failures.append(f"{doc.path}: missing title in front matter.")
            if not re.fullmatch(r"R\d{2}", doc.revision or ""):
                failures.append(f"{doc.path}: missing or invalid revision in front matter.")
            if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", doc.date or ""):
                failures.append(f"{doc.path}: missing or invalid effective_date in front matter.")
            if doc.status != "Published":
                failures.append(f"{doc.path}: status must be Published before release.")
            if doc.revision and doc.date:
                revision_rows = parse_markdown_revision_row_pairs(doc.head_text)
                if (doc.revision, doc.date) not in revision_rows:
                    failures.append(f"{doc.path}: revision history is missing row for {doc.revision} / {doc.date}.")

            nav_entry = self.ctx.readme_nav.get(doc_id)
            if not nav_entry:
                failures.append(f"README.md visible navigation is missing entry for {doc_id}.")
            else:
                if nav_entry["path"] != doc.path:
                    failures.append(f"README.md visible navigation path mismatch for {doc_id}: {nav_entry['path']} != {doc.path}.")
                if nav_entry["revision"] != doc.revision:
                    failures.append(f"README.md visible navigation revision mismatch for {doc_id}: {nav_entry['revision']} != {doc.revision}.")

            index_entry = self.ctx.readme_doc_index.get(doc_id)
            if not index_entry:
                failures.append(f"README.md published controlled document index is missing entry for {doc_id}.")
            else:
                if index_entry["path"] != doc.path:
                    failures.append(f"README.md published controlled document index path mismatch for {doc_id}: {index_entry['path']} != {doc.path}.")
                if index_entry["revision"] != doc.revision:
                    failures.append(f"README.md published controlled document index revision mismatch for {doc_id}: {index_entry['revision']} != {doc.revision}.")
                if index_entry["date"] != doc.date:
                    failures.append(f"README.md published controlled document index effective date mismatch for {doc_id}: {index_entry['date']} != {doc.date}.")
                if index_entry["status"] != "Published":
                    failures.append(f"README.md published controlled document index status mismatch for {doc_id}: {index_entry['status']} != Published.")

        for doc_id, entry in self.ctx.readme_doc_index.items():
            if entry["path"] not in actual_paths:
                failures.append(f"README.md published controlled document index lists {doc_id} at missing path {entry['path']}.")

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
        self.assert_no_failures(failures)

    def test_readme_published_doc_index_matches_changed_documents(self):
        failures = []
        for doc in self.ctx.changed_doc_infos:
            entry = self.ctx.readme_doc_index.get((doc.doc_id or "").upper())
            if not entry:
                failures.append(f"README.md published controlled document index is missing entry for {doc.doc_id or doc.path}.")
                continue
            if entry["path"] != doc.path:
                failures.append(
                    f"README.md published controlled document index path mismatch for {doc.doc_id}: {entry['path']} != {doc.path}."
                )
            if doc.revision and entry["revision"] != doc.revision:
                failures.append(
                    f"README.md published controlled document index revision mismatch for {doc.doc_id}: {entry['revision']} != {doc.revision}."
                )
            if doc.date and entry["date"] != doc.date:
                failures.append(
                    f"README.md published controlled document index effective date mismatch for {doc.doc_id}: {entry['date']} != {doc.date}."
                )
        self.assert_no_failures(failures)

    def test_training_matrix_updated_when_training_scoped_docs_change(self):
        failures = []
        if (self.ctx.changed_qms or self.ctx.changed_sops) and "matrices/training_matrix.yml" not in self.ctx.changed_set:
            failures.append("matrices/training_matrix.yml must be updated when QM or SOP files change.")
        self.assert_no_failures(failures)

    def test_changed_training_scoped_docs_are_mapped_to_roles(self):
        failures = []
        for doc in [*self.ctx.changed_qms, *self.ctx.changed_sops]:
            if not self.ctx.doc_to_roles.get((doc.doc_id or "").upper(), set()):
                failures.append(f"{doc.doc_id or doc.path} has no roles mapped in training_matrix.yml.")
        self.assert_no_failures(failures)

    def test_training_matrix_explicit_revisions_match_changed_training_scoped_docs(self):
        failures = []
        roles = (self.ctx.training_matrix.get("roles", {}) or {})
        for doc in [*self.ctx.changed_qms, *self.ctx.changed_sops]:
            doc_id = (doc.doc_id or "").upper()
            for role_name, role_def in roles.items():
                required_revisions = role_def.get("required_revisions", {}) or {}
                for key, value in required_revisions.items():
                    match = re.search(r"((?:QM|SOP)-\d+)", str(key), flags=re.IGNORECASE)
                    if not match or match.group(1).upper() != doc_id:
                        continue
                    expected_revision = str(value).strip().upper()
                    if expected_revision != doc.revision:
                        failures.append(
                            f"training_matrix.yml role {role_name} pins {doc_id} to {expected_revision}, expected {doc.revision}."
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
        allowed_statuses = {"open", "closed", "accepted", "monitoring"}
        allowed_control_statuses = {"planned", "implemented", "verified", "retired"}

        changed_risk_files = [
            path
            for path in self.ctx.changed
            if path.startswith("records/risk/") and path.endswith((".yml", ".yaml"))
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

            scoring_model = doc.get("scoring_model", {}) or {}
            severity_scale = scoring_model.get("severity_scale", {}) or {}
            probability_scale = scoring_model.get("probability_scale", {}) or {}
            acceptability_bands = scoring_model.get("acceptability_bands", {}) or {}

            if str(scoring_model.get("formula", "")).strip() != "risk_score = severity_value * probability_value":
                failures.append(f"{file_path}: scoring_model.formula must be 'risk_score = severity_value * probability_value'")

            for scale_name, scale in [("severity_scale", severity_scale), ("probability_scale", probability_scale)]:
                if not isinstance(scale, dict) or not scale:
                    failures.append(f"{file_path}: scoring_model.{scale_name} must be a non-empty mapping")
                    continue
                for code, descriptor in scale.items():
                    if not isinstance(descriptor, dict):
                        failures.append(f"{file_path}: scoring_model.{scale_name}.{code} must be a mapping")
                        continue
                    if "label" not in descriptor or "value" not in descriptor:
                        failures.append(f"{file_path}: scoring_model.{scale_name}.{code} must include label and value")
                        continue
                    try:
                        int(descriptor.get("value"))
                    except Exception:
                        failures.append(f"{file_path}: scoring_model.{scale_name}.{code}.value must be an integer")

            for band in ["acceptable", "alarp_or_justification", "not_acceptable"]:
                if band not in acceptability_bands:
                    failures.append(f"{file_path}: scoring_model.acceptability_bands missing '{band}'")

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
                    for key in [
                        "severity_code",
                        "severity_value",
                        "probability_code",
                        "probability_value",
                        "score",
                        "acceptability_decision",
                    ]:
                        if key not in risk_value:
                            failures.append(f"{record_path}: {risk_key} missing '{key}'")
                    try:
                        severity_value = int(risk_value.get("severity_value"))
                        probability_value = int(risk_value.get("probability_value"))
                        score = int(risk_value.get("score"))
                        if score != severity_value * probability_value:
                            failures.append(
                                f"{record_path}: {risk_key}.score ({score}) != severity_value*probability_value ({severity_value * probability_value})"
                            )
                    except Exception:
                        failures.append(
                            f"{record_path}: {risk_key} severity_value/probability_value/score must be integers"
                        )

                    severity_code = str(risk_value.get("severity_code", "")).strip()
                    probability_code = str(risk_value.get("probability_code", "")).strip()
                    if severity_code and severity_code not in severity_scale:
                        failures.append(f"{record_path}: {risk_key}.severity_code '{severity_code}' not present in scoring_model.severity_scale")
                    if probability_code and probability_code not in probability_scale:
                        failures.append(f"{record_path}: {risk_key}.probability_code '{probability_code}' not present in scoring_model.probability_scale")

                    if severity_code in severity_scale:
                        expected = int(severity_scale[severity_code].get("value"))
                        if int(risk_value.get("severity_value")) != expected:
                            failures.append(
                                f"{record_path}: {risk_key}.severity_value ({risk_value.get('severity_value')}) does not match scoring_model.severity_scale.{severity_code}.value ({expected})"
                            )
                    if probability_code in probability_scale:
                        expected = int(probability_scale[probability_code].get("value"))
                        if int(risk_value.get("probability_value")) != expected:
                            failures.append(
                                f"{record_path}: {risk_key}.probability_value ({risk_value.get('probability_value')}) does not match scoring_model.probability_scale.{probability_code}.value ({expected})"
                            )

                    if not str(risk_value.get("acceptability_decision", "")).strip():
                        failures.append(f"{record_path}: {risk_key}.acceptability_decision must not be empty")

                controls = entry.get("controls", []) or []
                if not isinstance(controls, list) or not controls:
                    failures.append(f"{record_path}: controls must be a non-empty list")
                for ctrl_idx, control in enumerate(controls, start=1):
                    ctrl_path = f"{record_path} controls[{ctrl_idx}]"
                    if not isinstance(control, dict):
                        failures.append(f"{ctrl_path}: control must be a mapping")
                        continue
                    for key in [
                        "control_id",
                        "control_type",
                        "description",
                        "implementation_reference",
                        "effectiveness_verification_reference",
                        "implementation_status",
                    ]:
                        if key not in control:
                            failures.append(f"{ctrl_path}: missing '{key}'")
                    status = str(control.get("implementation_status", "")).strip()
                    if status and status not in allowed_control_statuses:
                        failures.append(f"{ctrl_path}: invalid implementation_status '{status}'")

                status = str(entry.get("status", "")).strip()
                if status and status not in allowed_statuses:
                    failures.append(f"{record_path}: invalid status '{status}'")

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
