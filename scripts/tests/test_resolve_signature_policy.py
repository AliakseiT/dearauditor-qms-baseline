"""Tests for signer-role policy resolution."""
from __future__ import annotations

import base64
import json
import subprocess
import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
RESOLVER = REPO_ROOT / "scripts" / "resolve_signature_policy.py"

_HUMAN_TWO_ROLE_BODY = """## Summary

Change.

## Context

Context.

## Validation

Checked.

## Signature Requirements

- **Meaning of Signature:** Approved Quality Record
- **Signer Roles:** Quality Assurance Lead; Engineering Lead
- **Required Signatures:** 2
"""

_HUMAN_ENG_QA_BODY = _HUMAN_TWO_ROLE_BODY.replace(
    "Quality Assurance Lead; Engineering Lead",
    "Engineering Lead; Quality Assurance Lead",
)


def _run_resolver(*, author: str, body: str, paths: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [
            sys.executable,
            str(RESOLVER),
            "--repo-root",
            str(REPO_ROOT),
            "--author",
            author,
            "--body-base64",
            base64.b64encode(body.encode("utf-8")).decode("ascii"),
            "--paths-json",
            json.dumps(paths),
        ],
        capture_output=True,
        text=True,
        cwd=REPO_ROOT,
    )


def test_dependabot_lockfile_pr_without_signature_block_gets_tqm_policy() -> None:
    result = _run_resolver(
        author="dependabot[bot]",
        body="Bumps urllib3 from 2.6.3 to 2.7.0.\n",
        paths=["apps/audio-service/poetry.lock"],
    )
    assert result.returncode == 0, result.stderr

    outputs = json.loads(result.stdout)
    assert outputs["role_resolution_source"] == "dependabot"
    assert outputs["meaning_of_signature"] == "Approved Dependency Update"
    assert outputs["signatory_roles"] == "Technical QMS Maintainer"
    assert outputs["signatory_role_ids"] == "technical_qms_maintainer"
    assert outputs["required_signatures"] == "1"
    assert outputs["required_reviewer_signatures"] == "1"
    assert outputs["author_is_automation_bot"] == "true"


def test_dependabot_github_actions_pr_without_signature_block_gets_tqm_policy() -> None:
    result = _run_resolver(
        author="dependabot[bot]",
        body="Bumps actions/checkout from 4 to 5.\n",
        paths=[".github/workflows/1.4_qms_content_gate.yml"],
    )
    assert result.returncode == 0, result.stderr

    outputs = json.loads(result.stdout)
    assert outputs["role_resolution_source"] == "dependabot"
    assert outputs["signatory_role_ids"] == "technical_qms_maintainer"


def test_dependabot_non_dependency_path_does_not_get_fast_path() -> None:
    result = _run_resolver(
        author="dependabot[bot]",
        body="Bumps a controlled-document-adjacent dependency.\n",
        paths=["sops/SOP-001-DocControl.md"],
    )
    assert result.returncode != 0
    assert "require the author to be eligible for primary signer role" in result.stderr


def test_human_dependency_pr_without_signature_block_still_fails() -> None:
    result = _run_resolver(
        author="AliakseiT",
        body="## Summary\n\nChange.\n",
        paths=["apps/audio-service/poetry.lock"],
    )
    assert result.returncode != 0
    assert "Could not infer a signer role" in result.stderr


def test_dual_qualified_author_keeps_all_role_candidate_pools_for_flexible_coverage() -> None:
    result = _run_resolver(
        author="AliakseiT",
        body=_HUMAN_ENG_QA_BODY,
        paths=[".github/workflows/1.3_auto_merge_after_signatory_approvals.yml"],
    )
    assert result.returncode == 0, result.stderr
    outputs = json.loads(result.stdout)

    assert outputs["author_signed_role_id"] == ""
    assert set(outputs["author_eligible_role_ids"].split(",")) == {
        "engineering_lead",
        "qa_lead",
    }
    assert json.loads(outputs["signatory_role_id_sequence_json"]) == [
        "engineering_lead",
        "qa_lead",
    ]

    candidates_by_role = json.loads(outputs["reviewer_candidates_by_role_json"])
    assert set(candidates_by_role.keys()) == {"engineering_lead", "qa_lead"}
    assert "AliakseiT" not in candidates_by_role["engineering_lead"]
    assert "AliakseiT" not in candidates_by_role["qa_lead"]
    assert "LemmyKilmisterish" in candidates_by_role["engineering_lead"]
    assert {"InaTsitovich", "SorenWesThorup"} <= set(candidates_by_role["qa_lead"])


def test_resolver_allows_order_independent_author_role_coverage() -> None:
    result = _run_resolver(
        author="LemmyKilmisterish",
        body=_HUMAN_TWO_ROLE_BODY,
        paths=[".github/workflows/1.3_auto_merge_after_signatory_approvals.yml"],
    )
    assert result.returncode == 0, result.stderr
    outputs = json.loads(result.stdout)
    assert outputs["author_eligible_role_ids"] == "engineering_lead"
    candidates_by_role = json.loads(outputs["reviewer_candidates_by_role_json"])
    assert "qa_lead" in candidates_by_role
    assert {"AliakseiT", "InaTsitovich", "SorenWesThorup"} <= set(candidates_by_role["qa_lead"])


def test_explicit_signature_block_requires_author_eligible_role() -> None:
    result = _run_resolver(
        author="SorenWesThorup",
        body=_HUMAN_ENG_QA_BODY.replace(
            "Engineering Lead; Quality Assurance Lead",
            "Engineering Lead; Technical QMS Maintainer",
        ),
        paths=[".github/workflows/1.3_auto_merge_after_signatory_approvals.yml"],
    )

    assert result.returncode != 0
    assert "not eligible for any declared signer role" in result.stderr
    assert "Engineering Lead, Technical QMS Maintainer" in result.stderr
