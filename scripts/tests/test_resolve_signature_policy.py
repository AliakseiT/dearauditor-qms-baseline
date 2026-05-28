"""Tests for signer-role policy resolution."""
from __future__ import annotations

import base64
import json
import subprocess
import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
RESOLVER = REPO_ROOT / "scripts" / "resolve_signature_policy.py"


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
