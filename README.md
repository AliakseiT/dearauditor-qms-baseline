# QMS Lite

## Published SOP Index

<!-- PUBLISHED-SOP-INDEX:START -->
| SOP ID | SOP Title | File | Effective Date | Published Revision | Status |
|---|---|---|---|---|---|
| SOP-001 | Document and Record Control | sops/SOP-001-DocControl.md | 2026-03-05 | R02 | Published |
| SOP-002 | Corrective and Preventive Action (CAPA) | sops/SOP-002-CAPA.md | 2026-03-02 | R01 | Published |
| SOP-003 | Internal Audit | sops/SOP-003-InternalAudit.md | 2026-03-02 | R01 | Published |
| SOP-004 | Management Review | sops/SOP-004-ManagementReview.md | 2026-03-02 | R01 | Published |
| SOP-005 | QMS Governance and Quality Manual | sops/SOP-005-QMSGovernanceAndQualityManual.md | 2026-03-02 | R05 | Published |
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
| SOP-018 | Risk Management (ISO 14971) | sops/SOP-018-RiskManagement.md | 2026-03-02 | R00 | Published |
| SOP-019 | Usability Engineering (IEC 62366-1) | sops/SOP-019-UsabilityEngineering.md | 2026-03-02 | R00 | Published |
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
- ISO 14971 gap-analysis summary: `matrices/iso_14971_gap_analysis.yml`
- IEC 62366-1 gap-analysis summary: `matrices/iec_62366_1_gap_analysis.yml`
- Quality manual section-to-SOP traceability: `matrices/quality_manual_traceability.yml`
- QMS tooling inventory and validation baseline: `matrices/qms_tooling_inventory.yml`
- Signer identity registry (full name/title for attestations): `matrices/signer_registry.json`
- Supplier controls: `records/suppliers/approved_supplier_list.yml`, `records/suppliers/supplier_vetting_template.yml`
- Risk management artifacts: `records/risk/risk_management_plan_template.yml`, `records/risk/risk_register_template.yml`

## Immutable Record Release Tags

QMS execution records are published as immutable releases in this repository (`AliakseiT/qms-lite`) on the relevant PR target commit/hash.

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
- `training_review_signoff.yml`: when such review-only PR is closed unmerged, enforces trainee approval, runs Part 11 signature collection, and publishes immutable training record assets as releases in `AliakseiT/qms-lite`.
- Attestation:
  - merged training update PRs use post-merge Part 11 flow.
  - review-only onboarding PRs use post-close (unmerged) Part 11 flow via `training_review_signoff.yml`.

## Part 11 Git-Native Flow

- On merged PRs, `issue_pr_part11_gate.yml` posts signer-specific links to the Cloudflare `signature-worker` title page.
- The link payload is signed by GitHub Actions (`SIGNATURE_LINK_SECRET`) and verified by worker backend before any OAuth step.
- Signers open the link, enter only full legal name, and complete GitHub OAuth login.
- Worker verifies signer eligibility against the latest PR signature request comment and posts attestation (`<!-- PART11_ATTESTATION_V1 -->`) directly to PR.
- Signature comments are posted via mandatory GitHub App token (`SIGNATURE_APP_ID`, `SIGNATURE_APP_PRIVATE_KEY`).
- `required_reviewer_approval_guard.yml` enforces at least one non-author approval on the current PR head SHA (except `review-only` PRs).
- `part11_git_native_signature.yml` enriches attestations with signer full name/title from `matrices/signer_registry.json`.
- The `part11_git_native_signature.yml` workflow also supports `workflow_dispatch`.
- Cloudflare signer flow creates PR attestation comment (`<!-- PART11_ATTESTATION_V1 -->`) directly from worker backend.
- Optional fallback workflow (`part11_git_native_signature.yml`) still supports in-GitHub attestation comments (`<!-- part11-native-attestation -->`) and signed artifacts (`signed_attestation.json`, `.sig`, `.pem`).
- Reusable PDF title-page generator for attestation packages:
  - `scripts/generate_part11_title_page.py`
  - Produces `part11_title_page.pdf` with signatory names, roles, titles, and signature timestamps.
- Record publication workflows wait for required signature count/role/meaning before releasing immutable records.

## Artifact Quota Control

- Artifact retention is intentionally short for heavy workflows (5 days).
- Use `artifact_quota_cleanup.yml` (`workflow_dispatch`) to delete old artifacts when nearing quota.

## Repository Secrets (Part 11)

- `SIGNATURE_APP_ID`: GitHub App ID used by signature workflows.
- `SIGNATURE_APP_PRIVATE_KEY`: GitHub App private key (PEM) for installation token minting.
- `SIGNATURE_LINK_SECRET`: shared HMAC key used to sign `/sign` links in Actions and verify them in worker backend.
- `CLOUDFLARE_API_TOKEN`: token used by `deploy_signature_worker.yml`.
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare account identifier for worker deploy.

## Repository Variables (Part 11)

- `SIGNATURE_UI_BASE_URL`: external signer UI origin, for example `https://sign.qms.dearauditor.ch`.

## Signature Worker Service

- Service source: `services/signature-worker/`
- Setup guide: `services/signature-worker/SETUP.md`
- Deploy workflow: `.github/workflows/deploy_signature_worker.yml`
- Worker runtime secrets are configured in Cloudflare Worker settings:
  - `GITHUB_APP_ID`, `GITHUB_APP_CLIENT_ID`, `GITHUB_APP_CLIENT_SECRET`, `GITHUB_APP_PRIVATE_KEY`
  - `SIGNATURE_LINK_SECRET`, `SIGNATURE_STATE_SECRET`
  - optional `GITHUB_APP_INSTALLATION_ID`

## Risk Operations

- `SOP-018` defines one integrated method for hazard-based, failure-mode-based, and cybersecurity risk management.
- `.github/ISSUE_TEMPLATE/risk_management_plan.yml` provides a structured planning form with required top-down, bottom-up, and cybersecurity inputs.
- `risk_record_schema_guard.yml` validates `records/risk/*.yml` risk-register structure and score consistency in PRs.
