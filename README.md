# QMS Lite

## Published SOP Index

<!-- PUBLISHED-SOP-INDEX:START -->
| SOP ID | SOP Title | File | Effective Date | Published Revision | Status |
|---|---|---|---|---|---|
| SOP-001 | Document and Record Control | sops/SOP-001-DocControl.md | 2026-03-06 | R04 | Published |
| SOP-002 | Corrective and Preventive Action (CAPA) | sops/SOP-002-CAPA.md | 2026-03-05 | R02 | Published |
| SOP-003 | Internal Audit | sops/SOP-003-InternalAudit.md | 2026-03-05 | R02 | Published |
| SOP-004 | Management Review | sops/SOP-004-ManagementReview.md | 2026-03-05 | R02 | Published |
| SOP-005 | QMS Governance and Quality Manual | sops/SOP-005-QMSGovernanceAndQualityManual.md | 2026-03-06 | R07 | Published |
| SOP-006 | Software Validation (QMS Tools) | sops/SOP-006-SoftwareValidation.md | 2026-03-02 | R00 | Published |
| SOP-007 | Medical Device File Control | sops/SOP-007-MedicalDeviceFileControl.md | 2026-03-05 | R01 | Published |
| SOP-008 | Design and Development Control | sops/SOP-008-DesignAndDevelopmentControl.md | 2026-03-06 | R01 | Published |
| SOP-009 | Change Management | sops/SOP-009-ChangeManagement.md | 2026-03-06 | R01 | Published |
| SOP-010 | Supplier and Purchasing Control | sops/SOP-010-SupplierAndPurchasingControl.md | 2026-03-05 | R01 | Published |
| SOP-011 | Competence, Training, and Awareness | sops/SOP-011-CompetenceTrainingAndAwareness.md | 2026-03-05 | R01 | Published |
| SOP-012 | Feedback and Complaint Handling | sops/SOP-012-FeedbackAndComplaintHandling.md | 2026-03-02 | R00 | Published |
| SOP-013 | Regulatory Incident Reporting | sops/SOP-013-RegulatoryIncidentReporting.md | 2026-03-02 | R00 | Published |
| SOP-014 | Post-Market Surveillance | sops/SOP-014-PostMarketSurveillance.md | 2026-03-02 | R00 | Published |
| SOP-015 | Nonconforming Product Control | sops/SOP-015-NonconformingProductControl.md | 2026-03-02 | R00 | Published |
| SOP-016 | Quality Metrics and Data Analysis | sops/SOP-016-QualityMetricsAndDataAnalysis.md | 2026-03-02 | R00 | Published |
| SOP-017 | Infrastructure and Maintenance Control | sops/SOP-017-InfrastructureAndMaintenanceControl.md | 2026-03-02 | R00 | Published |
| SOP-018 | Risk Management (ISO 14971) | sops/SOP-018-RiskManagement.md | 2026-03-02 | R00 | Published |
| SOP-019 | Usability Engineering (IEC 62366-1) | sops/SOP-019-UsabilityEngineering.md | 2026-03-05 | R01 | Published |
| SOP-020 | Software Lifecycle, Configuration, and Release Management (IEC 62304) | sops/SOP-020-SoftwareLifecycleConfigurationAndReleaseManagement.md | 2026-03-06 | R00 | Published |
<!-- PUBLISHED-SOP-INDEX:END -->

## Published WI Index

| WI ID | WI Title | File | Effective Date | Published Revision | Status |
|---|---|---|---|---|---|
| WI-001 | Verification and Validation Execution | wis/WI-001-VerificationAndValidationExecution.md | 2026-03-06 | R00 | Published |
| WI-002 | Configuration and Release Management Execution | wis/WI-002-ConfigurationAndReleaseManagementExecution.md | 2026-03-06 | R00 | Published |

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
- IEC 62304 gap-analysis summary: `matrices/iec_62304_gap_analysis.yml`
- IEC 62366-1 gap-analysis summary: `matrices/iec_62366_1_gap_analysis.yml`
- Quality manual section-to-SOP traceability: `matrices/quality_manual_traceability.yml`
- QMS tooling inventory and validation baseline: `matrices/qms_tooling_inventory.yml`
- Signer identity registry (full name/title for attestations): `matrices/signer_registry.json`
- Supplier control templates: `records/suppliers/approved_supplier_list.yml`, `records/suppliers/supplier_vetting_template.yml`
- Risk management templates: `records/risk/risk_management_plan_template.yml`, `records/risk/risk_register_template.yml`
- V&V templates: `records/verification_validation/vv_plan_template.yml`, `records/verification_validation/test_case_index_template.yml`, `records/verification_validation/vv_report_template.md`
- Configuration/release templates: `records/configuration/release_plan_template.yml`, `records/configuration/release_baseline_manifest_template.yml`

## Automation Map
- End-to-end workflow diagram (SVG): `docs/automation/workflow-automation-map.svg`
- System architecture description and automation catalog: `docs/QMS-Lite-System-Architecture.md`

## Immutable Record Release Tags

QMS Lite defines the release-tagging and signature model. Operational product/study records (including usability engineering files) are published as immutable releases in designated product/study repositories on the relevant PR target commit/hash.

| Record Type | Tag Pattern | Example |
|---|---|---|
| Management Review | `mr-<record-id>-rNN` | `mr-2026-q1-r01` |
| CAPA | `capa-<record-id>-rNN` | `capa-0007-r01` |
| Audit | `audit-<record-id>-rNN` | `audit-mdsap-internal-r02` |
| Training | `trn-<record-id>-rNN` | `trn-dev-lina-sop-002-r01` |
| Training Issue Signature | `sig-train-<issue>-h<hash12>-rNN` | `sig-train-143-h23b61e73b5d7-r01` |
| Supplier List / Evaluation | `asl-YYYY.MM.DD-rNN` / `sup-<record-id>-rNN` | `asl-2026.03.01-r01` |
| Fallback | `record-<record-id>-rNN` | `record-general-note-r01` |

## QMS Release Publication

- QMS release tags use `QMS-YYYY-MM-DD-RNN`.
- Canonical controlled content is read directly in GitHub at the tagged commit; no separate handbook repository is required by default.
- `publish_qms_release.yml` publishes a GitHub Release on each QMS tag with a release manifest and repository snapshot for immutable reference.

## Training Automation

- `auto_training_assign.yml`: deprecated (manual-only notice); release-based consolidated training diffs are authoritative.
- `matrices/training_matrix.yml` now contains only active GitHub collaborators as users.
- `sop_training_matrix_guard.yml`: blocks SOP PRs unless training matrix impact is updated and each changed SOP maps to at least one role.
- `release_training_diff.yml`: runs only for training release tags matching `QMS-YYYY-MM-DD-RNN` (for example, `QMS-2026-03-05-R01`), compares required SOP revisions against the designated training log in the record repository, and opens one training issue per user.
- `training_issue_signature_flow.yml`: when all SOP checklist boxes are completed, posts a signer link; training issue closure/release publication is reconciled by manual run (`workflow_dispatch`) in the same workflow (no `issue_comment` trigger).
- `training_issue_legacy_cleanup.yml`: auto-closes legacy per-SOP training issues (`TRAINING DIFF REQUIRED: ... SOP-...`) and non-QMS consolidated training issues (`TRAINING REQUIRED: ... (sig-pr...)`), unassigning users before closure.
- `training_pr_approval_gate.yml`: for PRs updating designated training log records, requires approval by the user declared in PR body:
  - `**Trainee GitHub Login:** @<login>`
- `manual_training_onboarding_pr.yml` (`workflow_dispatch`): creates a review-only onboarding PR where base is a branch pinned to the first commit and head is a SOP-only snapshot of current `main`.
- `training_review_signoff.yml`: when such review-only PR is closed unmerged, enforces trainee approval, runs Part 11 signature collection, and publishes immutable training record assets as releases in the designated record repository.
- Attestation:
  - merged training update PRs use post-merge Part 11 flow.
  - review-only onboarding PRs use post-close (unmerged) Part 11 flow via `training_review_signoff.yml`.

## Part 11 Git-Native Flow

- On merged PRs, `issue_pr_part11_gate.yml` posts signer-specific links to the Cloudflare `signature-worker` title page.
- The link payload is signed by GitHub Actions (`SIGNATURE_LINK_SECRET`) and verified by worker backend before any OAuth step.
- Signers open the link and complete GitHub OAuth login through the signer-facing `QMS Lite Signature` OAuth app; full legal name is resolved from `matrices/signer_registry.json`.
- Worker verifies signer eligibility against the latest PR signature request comment and posts attestation (`<!-- PART11_ATTESTATION_V1 -->`) directly to PR via the automation app.
- PR comments, reviewer-assignment comments, merges, and immutable-release publication should run through the future `qms-lite-bot` GitHub App (`QMS_BOT_APP_ID`, `QMS_BOT_APP_PRIVATE_KEY`).
- `required_reviewer_approval_guard.yml` enforces at least one non-author approval on the current PR head SHA (except `review-only` PRs).
- `part11_git_native_signature.yml` is manual fallback (`workflow_dispatch`) only.
- Cloudflare signer flow creates PR attestation comment (`<!-- PART11_ATTESTATION_V1 -->`) directly from worker backend.
- Optional fallback workflow (`part11_git_native_signature.yml`) posts in-GitHub native attestation comments (`<!-- signature-native-attestation -->`) and signed artifacts (`signed_attestation.json`, `.sig`, `.pem`).
- Reusable PDF title-page generator for attestation packages:
  - `scripts/generate_part11_title_page.py`
  - Produces `Electronic_Signature_Certificate_PR{n}.pdf` with signatory names, roles, titles, and signature timestamps.
- Title-page/release finalization waits for the full required attestation set before publishing one immutable certificate package for the PR.
- Record publication workflows wait for required signature count/role/meaning before releasing immutable records.

## Attention Board

- `signature_status_tracker.yml` syncs actionable work into GitHub Project `#<SIGNATURE_PROJECT_NUMBER>` (open issues and merged PR signature states).
- PRs are auto-labeled with exactly one signature state: `signature/outstanding`, `signature/complete`, or `signature/not-required`.
- No-PAT mode: workflow always updates signature labels and attempts Project sync using `github.token`; if Project access/scope is unavailable, it skips board sync without failing.
- Set repository variable `SIGNATURE_PROJECT_NUMBER` (for example, `1`) to enable board sync; if unset, labels are still maintained and project sync is skipped.
- Project status mapping:
  - `Todo` lane: open issues, merged PRs with outstanding signatures.
  - `Done` lane: merged PRs with complete/not-required signatures.

## Artifact Quota Control

- Artifact retention is intentionally short for heavy workflows (5 days).
- Use `artifact_quota_cleanup.yml` (`workflow_dispatch`) to delete old artifacts when nearing quota.

## Repository Secrets (Part 11)

- `QMS_BOT_APP_ID`: GitHub App ID for the future `qms-lite-bot` automation app.
- `QMS_BOT_APP_PRIVATE_KEY`: GitHub App private key (PEM) for `qms-lite-bot` installation token minting.
- `SIGNATURE_LINK_SECRET`: shared HMAC key used to sign `/sign` links in Actions and verify them in worker backend.
- `CLOUDFLARE_API_TOKEN`: token used by `deploy_signature_worker.yml`.
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare account identifier for worker deploy.

Temporary compatibility:
- `SIGNATURE_APP_ID` and `SIGNATURE_APP_PRIVATE_KEY` are still accepted as fallbacks while migrating to `qms-lite-bot`.

## Repository Variables (Part 11)

- `SIGNATURE_UI_BASE_URL`: external signer UI origin, for example `https://sign.qms.dearauditor.ch`.
- `SIGNATURE_PROJECT_NUMBER`: optional GitHub ProjectV2 number used by `signature_status_tracker.yml` for Todo/Done board sync.

## Signature Worker Service

- Service source: `services/signature-worker/`
- Setup guide: `services/signature-worker/SETUP.md`
- Deploy workflow: `.github/workflows/deploy_signature_worker.yml`
- Worker runtime secrets are configured in Cloudflare Worker settings:
  - Signer identity: `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`
  - Automation app: `QMS_BOT_APP_ID`, `QMS_BOT_APP_PRIVATE_KEY`, optional `QMS_BOT_APP_INSTALLATION_ID`
  - Signing state: `SIGNATURE_LINK_SECRET`, `SIGNATURE_STATE_SECRET`, `PIN_PEPPER`
  - Legacy fallback only: `GITHUB_REPO_TOKEN`
- Recommended `qms-lite-bot` repository permissions:
  - `Contents: Read and write`
  - `Pull requests: Read and write`
  - `Issues: Read and write`
  - `Metadata: Read-only`
- Optional future extension:
  - `Repository projects: Read and write` if project-board synchronization is later moved under `qms-lite-bot`

## Risk Operations

- `SOP-018` defines one integrated method for hazard-based, failure-mode-based, and cybersecurity risk management.
- `.github/ISSUE_TEMPLATE/risk_management_plan.yml` provides a structured planning form with required top-down, bottom-up, and cybersecurity inputs.
- `risk_record_schema_guard.yml` validates designated risk-register YAML structure and score consistency in PRs.

## Software Lifecycle Operations

- `SOP-020` defines the IEC 62304-aligned lifecycle, configuration, release, maintenance, and problem-resolution baseline.
- `WI-001` defines the GitHub-native plan -> PR approval -> post-merge PIN signature -> execution -> evidence PR -> post-merge PIN signature V&V flow.
- `WI-002` defines the GitHub-native release-plan issue, release-baseline PR, post-merge PIN signature, release tag, and immutable publication flow.
