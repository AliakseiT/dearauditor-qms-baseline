# QMS Lite

## Published SOP Index

<!-- PUBLISHED-SOP-INDEX:START -->
| SOP ID | SOP Title | File | Effective Date | Published Revision | Status |
|---|---|---|---|---|---|
| SOP-001 | Document and Record Control | sops/SOP-001-DocControl.md | 2026-03-02 | R01 | Published |
| SOP-002 | Corrective and Preventive Action (CAPA) | sops/SOP-002-CAPA.md | 2026-03-02 | R01 | Published |
| SOP-003 | Internal Audit | sops/SOP-003-InternalAudit.md | 2026-03-02 | R01 | Published |
| SOP-004 | Management Review | sops/SOP-004-ManagementReview.md | 2026-03-02 | R01 | Published |
| SOP-005 | QMS Governance and Quality Manual | sops/SOP-005-QMSGovernanceAndQualityManual.md | 2026-03-02 | R03 | Published |
| SOP-006 | Software Validation (QMS Tools) | sops/SOP-006-SoftwareValidation.md | 2026-03-02 | R00 | Published |
| SOP-007 | Medical Device File Control | sops/SOP-007-MedicalDeviceFileControl.md | 2026-03-02 | R00 | Published |
| SOP-008 | Design and Development Control | sops/SOP-008-DesignAndDevelopmentControl.md | 2026-03-02 | R00 | Published |
| SOP-009 | Change Management | sops/SOP-009-ChangeManagement.md | 2026-03-02 | R00 | Published |
| SOP-010 | Supplier and Purchasing Control | sops/SOP-010-SupplierAndPurchasingControl.md | 2026-03-02 | R00 | Published |
| SOP-011 | Competence, Training, and Awareness | sops/SOP-011-CompetenceTrainingAndAwareness.md | 2026-03-02 | R00 | Published |
| SOP-012 | Feedback and Complaint Handling | sops/SOP-012-FeedbackAndComplaintHandling.md | 2026-03-02 | R00 | Published |
| SOP-013 | Regulatory Incident Reporting | sops/SOP-013-RegulatoryIncidentReporting.md | 2026-03-02 | R00 | Published |
| SOP-014 | Post-Market Surveillance | sops/SOP-014-PostMarketSurveillance.md | 2026-03-02 | R00 | Published |
| SOP-015 | Nonconforming Product Control | sops/SOP-015-NonconformingProductControl.md | 2026-03-02 | R00 | Published |
| SOP-016 | Quality Metrics and Data Analysis | sops/SOP-016-QualityMetricsAndDataAnalysis.md | 2026-03-02 | R00 | Published |
| SOP-017 | Infrastructure and Maintenance Control | sops/SOP-017-InfrastructureAndMaintenanceControl.md | 2026-03-02 | R00 | Published |
<!-- PUBLISHED-SOP-INDEX:END -->

## Company Context
- Legal entity: `ACME GmbH`
- Registered office: `Paradeplatz 8, 8001 Zurich, Switzerland`
- Operating model: `Remote-first`
- Regulatory role: `Manufacturer of healthcare software products`
- Product intent policy: `No single intended medical purpose at company level; each product defines intended use/classification in its own dossier.`

## QMS Baseline References
- Company and quality intent baseline: `matrices/company_profile.yml`
- Regulatory scope baseline (CH/EU/US): `matrices/regulatory_market_scope.yml`
- ISO 13485 gap-analysis summary: `matrices/iso_13485_gap_analysis.yml`
- Quality manual section-to-SOP traceability: `matrices/quality_manual_traceability.yml`
- QMS tooling inventory and validation baseline: `matrices/qms_tooling_inventory.yml`
- Signer identity registry (full name/title for attestations): `matrices/signer_registry.json`
- Supplier controls: `records/suppliers/approved_supplier_list.yml`, `records/suppliers/supplier_vetting_template.yml`

## Immutable Record Release Tags

QMS execution records are published as immutable releases in `AliakseiT/qms-records`.

| Record Type | Tag Pattern | Example |
|---|---|---|
| Management Review | `mr-<record-id>-rNN` | `mr-2026-q1-r01` |
| CAPA | `capa-<record-id>-rNN` | `capa-0007-r01` |
| Audit | `audit-<record-id>-rNN` | `audit-mdsap-internal-r02` |
| Training | `trn-<record-id>-rNN` | `trn-dev-lina-sop-002-r01` |
| Supplier List / Evaluation | `asl-YYYY.MM.DD-rNN` / `sup-<record-id>-rNN` | `asl-2026.03.01-r01` |
| Fallback | `record-<record-id>-rNN` | `record-general-note-r01` |

## Training Automation

- `auto_training_assign.yml`: opens SOP training issues only when changed SOPs are mapped to at least one role in `matrices/training_matrix.yml`.
- `matrices/training_matrix.yml` now contains only active GitHub collaborators as users.
- `sop_training_matrix_guard.yml`: blocks SOP PRs unless training matrix impact is updated and each changed SOP maps to at least one role.
- `release_training_diff.yml`: on release publish, compares required SOP revisions against `records/training/user_training_log.yml` and opens per-user training delta issues.
- `training_pr_approval_gate.yml`: for PRs updating `records/training/**`, requires approval by the user declared in PR body:
  - `**Trainee GitHub Login:** @<login>`
- `manual_training_onboarding_pr.yml` (`workflow_dispatch`): creates a review-only onboarding PR where base is a branch pinned to the first commit and head is a SOP-only snapshot of current `main`.
- `training_review_signoff.yml`: when such review-only PR is closed unmerged, enforces trainee approval, runs Part 11 signature collection, and publishes immutable training record assets to `AliakseiT/qms-records`.
- Attestation:
  - merged training update PRs use post-merge Part 11 flow.
  - review-only onboarding PRs use post-close (unmerged) Part 11 flow via `training_review_signoff.yml`.

## Part 11 Git-Native Flow

- On merged PRs, `issue_pr_part11_gate.yml` posts a signature-request comment with ready-to-use slash commands.
- Signature request comments now include signer-specific one-click links to:
  - `https://aliakseit.github.io/part11-action/` (pre-filled repository/PR/hash/meaning/role).
- Signers can reply directly on the PR with:
  - `/part11-sign meaning="<meaning>" role="<role>" auth="GitHub session re-authenticated"`
- `part11_git_native_signature.yml` enriches attestations with signer full name/title from `matrices/signer_registry.json`.
- The `part11_git_native_signature.yml` workflow also supports `workflow_dispatch`.
- Each signature run creates:
  - PR attestation comment (`<!-- part11-native-attestation -->`)
  - Signed attestation artifacts (`signed_attestation.json`, `.sig`, `.pem`)
- Reusable PDF title-page generator for attestation packages:
  - `scripts/generate_part11_title_page.py`
  - Produces `part11_title_page.pdf` with signatory names, roles, titles, and signature timestamps.
- Record publication workflows wait for required signature count/role/meaning before releasing immutable records.

## Artifact Quota Control

- Artifact retention is intentionally short for heavy workflows (5 days).
- Use `artifact_quota_cleanup.yml` (`workflow_dispatch`) to delete old artifacts when nearing quota.
