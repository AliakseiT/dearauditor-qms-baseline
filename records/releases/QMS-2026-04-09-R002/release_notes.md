---
record_id: RLN-QMS-2026-04-09-R002
record_type: qms_baseline_release_notes
product_id: DEARAUDITOR-QMS-BASELINE
release_tag: QMS-2026-04-09-R002
status: approved
owner_role: engineering_lead
approver_role: qa_lead
related_issue: "#329"
---

# Release Notes: QMS-2026-04-09-R002

## Purpose

This record supports the formal release of the DearAuditor Open QMS Baseline repository as
`QMS-2026-04-09-R002`.

This is the second published upstream baseline release. The `R002` suffix is the global sequential
QMS baseline release number and does not reset by date.

This release republishes the repository for downstream adoption after the post-R001 fixes to
release, signature, immutable record publication, and training automation.

## Release Unit

- Approved release commit on `main`; exact SHA captured in `qms_release_manifest.json`
- GitHub tag: `QMS-2026-04-09-R002`
- GitHub Release assets:
  - `qms_release_manifest.json`
  - `qms_release_snapshot.tgz`
- Release planning issue: GitHub issue `#329`
- Release change request: this PR

## Release Scope

Included unchanged under this tag:

- `QM-001`
- `SOP-001` through `SOP-020`
- `WI-001`, `WI-002`

Included as merged post-R001 workflow fixes:

- QMS release-signature flow hardening
- issue and training signature label reconciliation
- training status login normalization and refresh-flow deduplication
- bot-authored signature and immutable record publication fixes
- signature request parsing hardening

This release does not change QM, SOP, or WI text. It updates the baseline automation around
release control, signatures, immutable evidence publication, and training status maintenance.

## Validation and Approval Check

- `python3 -m py_compile scripts/validate_qms_content.py scripts/resolve_signature_policy.py`
- `python3 scripts/validate_qms_content.py --base origin/main --head HEAD`
- `git diff --check`

The QMS content gate confirms that the included QM/SOP/WI set remains published, revisioned, and
indexed. The release decision confirms that the post-R001 workflow fixes are present in the
approved release commit.

## Training Scope

Training remains governed by `matrices/training_matrix.yml`.

For this release, the training focus is:

- how release, signature, and training automation behaves after the post-R001 fixes
- how immutable record publication and release-signature flows are recovered and backfilled when
  needed
- the unchanged role-based document training expectations for the approved QM/SOP/WI set

## Not Applicable

- QM, SOP, or WI content rewrites
- Downstream adopter validation records
- Adopter-specific training completion records
- Downstream operational-use or deployment decisions
