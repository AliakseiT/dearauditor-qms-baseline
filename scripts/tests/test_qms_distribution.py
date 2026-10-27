"""Tests for CODEOWNERS generation in tools/qms_distribution.py."""
from __future__ import annotations

import json
from pathlib import Path

import pytest

from tools import qms_distribution


REPO_ROOT = Path(__file__).resolve().parents[2]

TRAINING_MATRIX = """---
version: 1
users:
  qa-one:
    full_name: QA One
roles:
  qa_lead:
    users:
      - qa-one
      - "QA-Two"
    required_documents:
      - SOP-001
  engineering_lead:
    users:
      - eng-one
  auditor:
    users: []
  management_representative:
    users:
      - mr-one
"""


def _write_repo(root: Path, registry: dict, training_matrix: str = TRAINING_MATRIX) -> None:
    (root / "matrices").mkdir()
    (root / "matrices" / "signer_registry.json").write_text(json.dumps(registry), encoding="utf-8")
    (root / "matrices" / "training_matrix.yml").write_text(training_matrix, encoding="utf-8")


def test_role_members_are_read_per_role() -> None:
    members = qms_distribution.training_matrix_role_members(REPO_ROOT, "matrices/training_matrix.yml")
    assert "AliakseiT" in members["management_representative"]
    assert "LemmyKilmisterish" in members["engineering_lead"]
    assert "LemmyKilmisterish" not in members["qa_lead"]


def test_codeowners_lists_only_approver_role_signers(tmp_path: Path) -> None:
    _write_repo(tmp_path, {"eng-one": {}, "qa-two": {}, "mr-one": {}, "qa-one": {}, "former-qa": {}})
    assert qms_distribution.codeowner_logins(
        tmp_path, "matrices/signer_registry.json", "matrices/training_matrix.yml"
    ) == ["qa-two", "mr-one", "qa-one"]


def test_sync_then_check_round_trip(tmp_path: Path) -> None:
    _write_repo(tmp_path, {"qa-one": {}, "eng-one": {}})
    args = ("matrices/signer_registry.json", ".github/CODEOWNERS")
    assert qms_distribution.sync_codeowners(tmp_path, *args, check=True) == 1
    assert qms_distribution.sync_codeowners(tmp_path, *args, check=False) == 0
    assert (tmp_path / ".github" / "CODEOWNERS").read_text(encoding="utf-8").endswith("* @qa-one\n")
    assert qms_distribution.sync_codeowners(tmp_path, *args, check=True) == 0


def test_sync_fails_without_an_approver_signer(tmp_path: Path) -> None:
    _write_repo(tmp_path, {"eng-one": {}})
    with pytest.raises(ValueError, match="holds management_representative or qa_lead"):
        qms_distribution.sync_codeowners(tmp_path, "matrices/signer_registry.json", ".github/CODEOWNERS", check=True)


def test_repository_codeowners_is_aligned() -> None:
    assert qms_distribution.sync_codeowners(
        REPO_ROOT, "matrices/signer_registry.json", ".github/CODEOWNERS", check=True
    ) == 0
