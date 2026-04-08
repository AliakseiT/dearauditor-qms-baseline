---
record_id: RLN-QMS-2026-04-08-R001
record_type: qms_baseline_release_notes
product_id: DEARAUDITOR-QMS-BASELINE
release_tag: QMS-2026-04-08-R001
status: approved
owner_role: engineering_lead
approver_role: qa_lead
related_issue: "#314"
---

# Release Notes: QMS-2026-04-08-R001

## Purpose

This record supports the first formal release of the DearAuditor Open QMS Baseline repository.

This release publishes the upstream baseline for downstream adoption. It does not approve downstream
operational use, deployment, or adopter release decisions.

## Release Unit

- Approved release commit on `main`; exact SHA captured in `qms_release_manifest.json`
- GitHub tag: `QMS-2026-04-08-R001`
- GitHub Release assets:
  - `qms_release_manifest.json`
  - `qms_release_snapshot.tgz`
- Release planning issue: GitHub issue `#314`
- Release change request: GitHub PR `#315`

## Controlled Documents Entering Release

The release includes the current approved baseline document set:

| Document family | Included documents | Release effect |
|---|---|---|
| Quality Manual | `QM-001` | Included in the first tagged baseline |
| SOPs | `SOP-001` through `SOP-020` | Included in the first tagged baseline |
| Work Instructions | `WI-001`, `WI-002` | Included in the first tagged baseline |

The release does not rewrite these documents. It places the approved document set under the first
immutable `QMS-*` baseline tag.

## Code and Automation Entering Release

The release includes baseline support code and automation:

- GitHub Actions for PR gates, signatures, QMS release publishing, training issues, and
  signature-worker deployment
- validation and release helper scripts in `scripts/` and `tools/`
- signature worker source under `services/signature-worker/`

Code validation for this release is limited to baseline control and release packaging. Production
runtime validation of the signature worker is not part of this first upstream baseline release.

## Validation Performed

- `python3 -m py_compile scripts/validate_qms_content.py`
- `python3 scripts/validate_qms_content.py --base origin/main --head HEAD`
- `git diff --check`

The QMS content gate checks the full QM/SOP/WI set entering the release. It verifies that each
released document has a revision, an effective date, `status: Published`, a matching README index
entry, and a matching revision-history row.

## Training Scope

Training is governed by `matrices/training_matrix.yml`.

For this first baseline release, the training focus is:

- the full baseline document set: `QM-001`, `SOP-001` through `SOP-020`, `WI-001`, and `WI-002`
- document-control responsibilities
- GitHub approval and signature evidence
- release-tag use
- the upstream/downstream adoption boundary

This release does not create adopter-specific training records.

## Not Applicable

- Downstream adopter validation records
- Adopter-specific training completion records
- Production runtime validation of the signature worker
- Downstream operational-use or deployment decisions

## Approval

- Meaning of Signature: Approved Baseline Release
- Signer Roles: Quality Assurance Lead; Engineering Lead
- Required Signatures: 2
