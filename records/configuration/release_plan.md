---
record_id: RLP-DEARAUDITOR-QMS-BASELINE-2026-03-31
product_id: DEARAUDITOR-QMS-BASELINE
record_type: release_plan
status: approved
owner_role: engineering_lead
approver_role: qa_lead
related_issue: "#314"
target_version_or_tag: QMS-2026-03-31-R01
release_cutoff_revision: ece2ad4a97474f12714316f0dcbf54a51f29d119
---

# Release Plan

## Scope Summary

This record defines the first formal upstream baseline publication for DearAuditor Open QMS Baseline.
The release unit is the repository content at the approved cutoff commit together with the immutable
GitHub Release assets generated from tag `QMS-2026-03-31-R01`.

This is not a SaMD shipment release. It does not authorize any downstream product deployment,
distribution, or product-specific release decision.

## Included Change Records

- GitHub issue `#314`
- Entire approved repository baseline on `main` at commit `ece2ad4a97474f12714316f0dcbf54a51f29d119`
- Existing merged PR approval evidence already retained in immutable `sig-pr*` releases for the
  constituent changes included in the cutoff revision

## Deferred Change Records

- Any commit merged after `ece2ad4a97474f12714316f0dcbf54a51f29d119`
- Any downstream adopter-owned records created after bootstrapping from this upstream baseline

## Formal Publication Unit Entering Review

- Repository: `AliakseiT/dearauditor-qms-baseline`
- Cutoff branch: `main`
- Publication unit: Git commit `ece2ad4a97474f12714316f0dcbf54a51f29d119`
- Expected immutable release assets:
  - `qms_release_manifest.json`
  - `qms_release_snapshot.tgz`
- External binary or deployment package: not applicable

## Linked Records

- Open-source adoption model: `docs/open-source/README.md`
- Architecture and workflow model: `docs/architecture/README.md`
- Bootstrap V&V report: `records/verification_validation/upstream_baseline_bootstrap_vv_report.md`
- Release baseline manifest: `records/configuration/release_baseline_manifest.md`
- Final release decision: `records/configuration/final_release_decision.md`
- Product residual-risk decision: not applicable for this upstream baseline publication scope
- Anomaly summary: no known open anomaly blocks were identified for the initial baseline publication

## Rollback or Containment Note

- If release readiness concerns are identified before publication, do not create tag
  `QMS-2026-03-31-R01`.
- If a problem is identified after publication, preserve the released tag and GitHub Release as
  immutable evidence, open corrective changes through the normal PR flow, and publish a superseding
  `QMS-*` baseline rather than mutating the released baseline.

## Approval Basis

- Meaning of Signature: Approved Bootstrap Upstream Baseline Release Readiness
- Signer Roles: Quality Assurance Lead; Engineering Lead
- Required Signatures: 2
