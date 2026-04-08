---
record_id: VVR-DEARAUDITOR-QMS-BASELINE-2026-04-08
product_id: DEARAUDITOR-QMS-BASELINE
record_type: verification_validation_report
status: approved
owner_role: engineering_lead
approver_role: qa_lead
related_issue: "#314"
target_revision: approved release commit on main
---

# Upstream Baseline Bootstrap Verification and Validation Report

## Metadata

- Report ID: `VVR-DEARAUDITOR-QMS-BASELINE-2026-04-08`
- Product ID: `DEARAUDITOR-QMS-BASELINE`
- Plan Reference: `records/configuration/release_plan.md`
- Release Scope Decision Reference: `records/configuration/release_plan.md`
- Traceability Reference:
  - `README.md`
  - `docs/architecture/README.md`
  - `docs/open-source/README.md`
- Target Revision: approved release commit on `main`; exact SHA captured in `qms_release_manifest.json`
- Report Date: `2026-04-08`

## Scope

- Activity Type: bootstrap upstream baseline publication verification
- Controlled Document Scope:
  - `QM-001`
  - `SOP-001` through `SOP-020`
  - `WI-001`, `WI-002`
- Code and Automation Scope:
  - GitHub Actions under `.github/workflows/`
  - validation and release helpers under `scripts/` and `tools/`
  - signature worker source under `services/signature-worker/`
- Covered Requirements:
  - formal QMS tag namespace and format for downstream-adoptable upstream baselines
  - immutable QMS release asset publication workflow
  - explicit separation between upstream baseline publication and downstream adoption
  - presence of controlled release records for the first upstream `QMS-*` publication
- Covered Risk Controls:
  - immutable release packaging on `QMS-*` tags
  - documented upstream/downstream repository boundary
  - controlled PR and signature workflow before publication
- Covered Use Scenarios:
  - selecting the first formal upstream baseline ref for downstream adoption
  - reading the repository as controlled content at the released `QMS-*` tag
- Environment / Tooling References:
  - `.github/workflows/2.3_publish_qms_release.yml`
  - `.github/workflows/3.1_release_training_diff.yml`
  - `scripts/validate_qms_content.py`
- Configuration Capture References:
  - repository `AliakseiT/dearauditor-qms-baseline`
  - target revision: approved release commit on `main`
  - GitHub issue `#314`

## Validation Scope Justification

This is a baseline publication release. It confirms that the approved QMS content can be identified,
packaged, and released under an immutable tag.

The validation scope is limited to:
- document metadata, revision history, README index consistency, and published status for all QM,
  SOP, and WI documents entering the release
- release record presence and approval metadata
- release packaging and publication workflow review
- signature and training workflow review as supporting baseline controls

Runtime testing of the signature worker and validation of any downstream adopted QMS are out of
scope for this release. The worker is included as baseline support code, not as an approved
production runtime.

## Training Validation

The release uses `matrices/training_matrix.yml` as the training source.
For this first baseline release, training review focuses on the full baseline document set,
document-control responsibilities, release-tag use, signature evidence, and the upstream/downstream
adoption boundary.

## Summary of Results

- Total Test Cases: `12`
- Passed: `12`
- Failed: `0`
- Blocked: `0`
- Not Run: `0`

## Evidence Reviewed

1. `python3 scripts/validate_qms_content.py --base origin/main --head HEAD`
   Confirmed that all QM, SOP, and WI documents entering the release are marked published, have
   revisions and effective dates, are listed consistently in `README.md`, and include matching
   revision-history rows. Also confirmed the release records and documentation updates pass the
   repository content guard suite.
2. `git diff --check`
   Confirmed the proposed release records and guidance updates apply without diff-format or trailing
   whitespace defects.
3. Document and workflow review of:
   - `README.md`
   - `docs/open-source/README.md`
   - `docs/architecture/README.md`
   - `.github/workflows/2.3_publish_qms_release.yml`
   - `.github/workflows/3.1_release_training_diff.yml`
   - `.github/workflows/4.1_deploy_signature_worker.yml`
   - `services/signature-worker/README.md`

## Deviations and Open Issues

- No deviation was identified that blocks publication of the initial upstream `QMS-*` baseline.
- Downstream adopter validation records and production worker validation are not required for this
  upstream baseline publication.

## Release Recommendation

- [x] Approved for release
- [ ] Approved with restrictions
- [ ] Not approved for release

## Bootstrap Justification

This report verifies the upstream repository as a controlled QMS baseline publication unit.
It does not claim verification or validation of any downstream implementation or deployment
environment.

## Signatures

- Meaning of Signature: Approved Baseline Release
- Signer Roles: Quality Assurance Lead; Engineering Lead
- Required Signatures: 2
