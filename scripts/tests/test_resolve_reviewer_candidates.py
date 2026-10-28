"""Tests for CODEOWNERS matching in scripts/resolve_reviewer_candidates.py."""
from __future__ import annotations

from pathlib import Path

from scripts import resolve_reviewer_candidates


CODEOWNERS = """# comment
* @qa-one @mr-one
/tools/ @eng-one
/services/signature-worker/ @eng-one
/tools/legacy/ @qa-one
docs/*.md @doc-one
"""


def _candidates(tmp_path: Path, changed_paths: list[str]) -> list[str]:
    (tmp_path / ".github").mkdir(exist_ok=True)
    (tmp_path / ".github" / "CODEOWNERS").write_text(CODEOWNERS, encoding="utf-8")
    _, candidates = resolve_reviewer_candidates._resolve_codeowners_candidates(tmp_path, changed_paths)
    return candidates


def test_specific_rule_after_catch_all_wins(tmp_path: Path) -> None:
    assert _candidates(tmp_path, ["tools/qms_distribution.py"]) == ["eng-one"]
    assert _candidates(tmp_path, ["tools/nested/helper.py"]) == ["eng-one"]
    assert _candidates(tmp_path, ["services/signature-worker/package.json"]) == ["eng-one"]


def test_catch_all_applies_to_unmatched_paths(tmp_path: Path) -> None:
    assert _candidates(tmp_path, ["sops/SOP-001.md"]) == ["qa-one", "mr-one"]


def test_last_matching_rule_wins(tmp_path: Path) -> None:
    assert _candidates(tmp_path, ["tools/legacy/old.py"]) == ["qa-one"]
    assert _candidates(tmp_path, ["docs/README.md"]) == ["doc-one"]


def test_mixed_change_lists_owners_in_path_order(tmp_path: Path) -> None:
    assert _candidates(tmp_path, ["tools/a.py", "sops/SOP-001.md", "tools/b.py"]) == ["eng-one", "qa-one", "mr-one"]
