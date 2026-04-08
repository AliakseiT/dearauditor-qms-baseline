---
record_id: RLP-DEARAUDITOR-QMS-BASELINE-2026-04-08
product_id: DEARAUDITOR-QMS-BASELINE
record_type: release_plan
status: approved
owner_role: engineering_lead
approver_role: qa_lead
related_issue: "#314"
target_version_or_tag: QMS-2026-04-08-R01
release_cutoff_revision: approved release commit on main
---

# Release Plan

## Scope Summary

This record defines the first formal upstream baseline publication for DearAuditor Open QMS Baseline.
The release unit is the repository content at the approved cutoff commit together with the immutable
GitHub Release assets generated from tag `QMS-2026-04-08-R01`.

This is not a SaMD shipment release. It does not authorize downstream operational use,
deployment, or adoption decisions.

## Controlled Documents Entering Release

The release publishes the current baseline document set. This release does not change the content of
those documents; it places the approved document set under the first immutable `QMS-*` baseline tag.

| Document family | Included documents | Expected release effect |
|---|---|---|
| Quality Manual | `QM-001` | Published as part of the first tagged baseline |
| SOPs | `SOP-001` through `SOP-020` | Published as part of the first tagged baseline |
| Work Instructions | `WI-001`, `WI-002` | Published as part of the first tagged baseline |

Before release, each included QM, SOP, and WI must have:
- a published revision in its document metadata
- an effective date in its document metadata
- `status: Published`
- matching revision evidence in `README.md`
- a matching revision-history row in the document

## Code and Automation Entering Release

The release includes repository automation and support code needed to maintain and publish the
baseline. The expected code scope is:
- GitHub Actions for PR approval gates, signature evidence, QMS release publishing, training
  issues, and signature-worker deployment
- validation and release helper scripts in `scripts/` and `tools/`
- the signature worker under `services/signature-worker/`

This release does not validate a deployed runtime environment or downstream implementation.
Code validation for this baseline release is limited to release packaging, document-control checks,
and review of the workflows that support controlled publication.

## Training Expectations

Training is governed by `matrices/training_matrix.yml`.

For this first baseline release, the training focus is:
- the full published baseline scope: `QM-001`, `SOP-001` through `SOP-020`, `WI-001`, and `WI-002`
- how controlled documents, PR approvals, signatures, release tags, and training records are used
- the boundary between this upstream baseline release and downstream adoption

The release itself does not create adopter-specific training. Downstream adopters must assign their
own personnel and training records after adoption.

## Included Change Records

- GitHub issue `#314`
- Approved repository baseline on `main` at the release commit
- Existing merged PR approval evidence already retained in immutable `sig-pr*` releases for the
  constituent changes included in the cutoff revision

## Deferred Change Records

- Any commit merged after the approved release commit
- Any downstream adopter-owned records created after bootstrapping from this upstream baseline

## Formal Publication Unit Entering Review

- Repository: `AliakseiT/dearauditor-qms-baseline`
- Cutoff branch: `main`
- Publication unit: approved release commit on `main`; exact SHA captured in `qms_release_manifest.json`
- Expected immutable release assets:
  - `qms_release_manifest.json`
  - `qms_release_snapshot.tgz`
- External binary or deployment package: not applicable

## Supporting Release-Control Evidence

- Release planning issue: GitHub issue `#314`
- Release change request: GitHub PR `#315`
- Bootstrap V&V report: `records/verification_validation/upstream_baseline_bootstrap_vv_report.md`
- Release baseline manifest: `records/configuration/release_baseline_manifest.md`
- Final release decision: `records/configuration/final_release_decision.md`
- QMS release tag: `QMS-2026-04-08-R01`
- QMS release assets:
  - `qms_release_manifest.json`
  - `qms_release_snapshot.tgz`
- Risk decision: not applicable; no operational deployment is released here
- Anomaly summary: no known open anomaly blocks were identified for the initial baseline publication

## Rollback or Containment Note

- If release readiness concerns are identified before publication, do not create tag
  `QMS-2026-04-08-R01`.
- Before tagging, confirm the selected QMS tag date matches the approved baseline publication date.
- If a problem is identified after publication, preserve the released tag and GitHub Release as
  immutable evidence, open corrective changes through the normal PR flow, and publish a superseding
  `QMS-*` baseline rather than mutating the released baseline.

## Approval Basis

- Meaning of Signature: Approved Baseline Release
- Signer Roles: Quality Assurance Lead; Engineering Lead
- Required Signatures: 2
