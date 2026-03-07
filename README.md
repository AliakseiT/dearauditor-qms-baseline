# QMS Lite

QMS Lite serves two purposes at the same time:

- the published front page and controlled index for the fictional `ACME GmbH` quality management system
- the open-source base template for remote-first, engineering-friendly medical device companies building a GitHub-native QMS

If you are reading this page on a `QMS-YYYY-MM-DD-RNN` tag, this README is the release landing page for that published QMS baseline.

## Start Here

| I need to... | Open |
|---|---|
| Read the current controlled document set | [Published library](#published-library) |
| Jump straight to a SOP | [SOP library by topic](#sop-library-by-topic) |
| Open the work instructions | [Work instructions](#work-instructions) |
| See my training work as a logged-in GitHub user | [My open training issues](https://github.com/AliakseiT/qms-lite/issues?q=is%3Aopen+is%3Aissue+label%3Atraining-diff+assignee%3A%40me+sort%3Aupdated-desc) |
| See role-based training requirements | [Training matrix](matrices/training_matrix.yml) |
| See recorded training status | [User training log](records/training/user_training_log.yml) |
| Browse record families and templates | [Records index](records/README.md) |
| Understand workflows, automations, and trust boundaries | [System architecture](docs/architecture/README.md) |
| Open the end-to-end automation diagram | [Workflow automation map](docs/architecture/README.md#6-automation-map) |
| Check published releases in GitHub | [Releases](https://github.com/AliakseiT/qms-lite/releases) |

## Publication Status

- Legal entity: `ACME GmbH`
- Registered office: `Paradeplatz 8, 8001 Zurich, Switzerland`
- Operating model: `Remote-first`
- Current baseline shown in this README: `20` published SOPs and `2` published WIs
- Latest effective date currently shown in the published baseline: `2026-03-07`
- Formal QMS releases use `QMS-YYYY-MM-DD-RNN`
- This repository also publishes record-specific releases, so the newest overall release is not always the newest QMS baseline. In GitHub Releases, use the newest `QMS-...` entry when you need the latest published QMS version.

## Training and Role Navigation

GitHub README pages cannot personalize content by the viewer's login, so the GitHub-native training entry points are:

- [My open training issues](https://github.com/AliakseiT/qms-lite/issues?q=is%3Aopen+is%3Aissue+label%3Atraining-diff+assignee%3A%40me+sort%3Aupdated-desc) for the logged-in user
- [Training matrix](matrices/training_matrix.yml) for GitHub user-to-role mappings and required SOP revisions
- [User training log](records/training/user_training_log.yml) for recorded completion state
- [SOP-011 Competence, Training, and Awareness](sops/SOP-011-CompetenceTrainingAndAwareness.md) for the governing procedure
- [System architecture](docs/architecture/README.md) and [workflow automation map](docs/architecture/README.md#6-automation-map) for the training workflow model

## Published Library

Use the grouped links below for navigation. The raw machine-readable published index remains further down for automation compatibility.

### SOP Library By Topic

#### Governance and Core QMS

- [SOP-001 Document and Record Control](sops/SOP-001-DocControl.md) - `R07`, effective `2026-03-07`
- [SOP-002 Corrective and Preventive Action (CAPA)](sops/SOP-002-CAPA.md) - `R02`, effective `2026-03-05`
- [SOP-003 Internal Audit](sops/SOP-003-InternalAudit.md) - `R02`, effective `2026-03-05`
- [SOP-004 Management Review](sops/SOP-004-ManagementReview.md) - `R02`, effective `2026-03-05`
- [SOP-005 QMS Governance and Quality Manual](sops/SOP-005-QMSGovernanceAndQualityManual.md) - `R07`, effective `2026-03-06`
- [SOP-011 Competence, Training, and Awareness](sops/SOP-011-CompetenceTrainingAndAwareness.md) - `R02`, effective `2026-03-07`
- [SOP-016 Quality Metrics and Data Analysis](sops/SOP-016-QualityMetricsAndDataAnalysis.md) - `R00`, effective `2026-03-02`
- [SOP-017 Infrastructure and Maintenance Control](sops/SOP-017-InfrastructureAndMaintenanceControl.md) - `R00`, effective `2026-03-02`

#### Development, Risk, and Release

- [SOP-006 Software Validation (QMS Tools)](sops/SOP-006-SoftwareValidation.md) - `R00`, effective `2026-03-02`
- [SOP-007 Medical Device File Control](sops/SOP-007-MedicalDeviceFileControl.md) - `R01`, effective `2026-03-05`
- [SOP-008 Design and Development Control](sops/SOP-008-DesignAndDevelopmentControl.md) - `R01`, effective `2026-03-06`
- [SOP-009 Change Management](sops/SOP-009-ChangeManagement.md) - `R01`, effective `2026-03-06`
- [SOP-018 Risk Management (ISO 14971)](sops/SOP-018-RiskManagement.md) - `R00`, effective `2026-03-02`
- [SOP-019 Usability Engineering (IEC 62366-1)](sops/SOP-019-UsabilityEngineering.md) - `R01`, effective `2026-03-05`
- [SOP-020 Software Lifecycle, Configuration, and Release Management (IEC 62304)](sops/SOP-020-SoftwareLifecycleConfigurationAndReleaseManagement.md) - `R00`, effective `2026-03-06`

#### Suppliers, Complaints, and Post-Market

- [SOP-010 Supplier and Purchasing Control](sops/SOP-010-SupplierAndPurchasingControl.md) - `R01`, effective `2026-03-05`
- [SOP-012 Feedback and Complaint Handling](sops/SOP-012-FeedbackAndComplaintHandling.md) - `R00`, effective `2026-03-02`
- [SOP-013 Regulatory Incident Reporting](sops/SOP-013-RegulatoryIncidentReporting.md) - `R00`, effective `2026-03-02`
- [SOP-014 Post-Market Surveillance](sops/SOP-014-PostMarketSurveillance.md) - `R00`, effective `2026-03-02`
- [SOP-015 Nonconforming Product Control](sops/SOP-015-NonconformingProductControl.md) - `R00`, effective `2026-03-02`

### Work Instructions

- [WI-001 Verification and Validation Execution](wis/WI-001-VerificationAndValidationExecution.md) - `R01`, effective `2026-03-06`
- [WI-002 Configuration and Release Management Execution](wis/WI-002-ConfigurationAndReleaseManagementExecution.md) - `R01`, effective `2026-03-06`

<details>
<summary>Machine-readable published SOP index (used by release and training automation)</summary>

<!-- PUBLISHED-SOP-INDEX:START -->
| SOP ID | SOP Title | File | Effective Date | Published Revision | Status |
|---|---|---|---|---|---|
| SOP-001 | Document and Record Control | sops/SOP-001-DocControl.md | 2026-03-07 | R07 | Published |
| SOP-002 | Corrective and Preventive Action (CAPA) | sops/SOP-002-CAPA.md | 2026-03-05 | R02 | Published |
| SOP-003 | Internal Audit | sops/SOP-003-InternalAudit.md | 2026-03-05 | R02 | Published |
| SOP-004 | Management Review | sops/SOP-004-ManagementReview.md | 2026-03-05 | R02 | Published |
| SOP-005 | QMS Governance and Quality Manual | sops/SOP-005-QMSGovernanceAndQualityManual.md | 2026-03-06 | R07 | Published |
| SOP-006 | Software Validation (QMS Tools) | sops/SOP-006-SoftwareValidation.md | 2026-03-02 | R00 | Published |
| SOP-007 | Medical Device File Control | sops/SOP-007-MedicalDeviceFileControl.md | 2026-03-05 | R01 | Published |
| SOP-008 | Design and Development Control | sops/SOP-008-DesignAndDevelopmentControl.md | 2026-03-06 | R01 | Published |
| SOP-009 | Change Management | sops/SOP-009-ChangeManagement.md | 2026-03-06 | R01 | Published |
| SOP-010 | Supplier and Purchasing Control | sops/SOP-010-SupplierAndPurchasingControl.md | 2026-03-05 | R01 | Published |
| SOP-011 | Competence, Training, and Awareness | sops/SOP-011-CompetenceTrainingAndAwareness.md | 2026-03-07 | R02 | Published |
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

</details>

## Records and Baselines

- [Records index](records/README.md) for company-level records kept here, reusable record templates, and links to record families used in designated product/study repositories
- [Company profile baseline](matrices/company_profile.yml)
- [Regulatory market scope baseline](matrices/regulatory_market_scope.yml)
- [Quality manual traceability matrix](matrices/quality_manual_traceability.yml)
- [QMS tooling inventory and validation baseline](matrices/qms_tooling_inventory.yml)
- [Signer registry](matrices/signer_registry.json)
- Gap analyses: [ISO 13485](matrices/iso_13485_gap_analysis.yml), [ISO 14971](matrices/iso_14971_gap_analysis.yml), [IEC 62304](matrices/iec_62304_gap_analysis.yml), [IEC 62366-1](matrices/iec_62366_1_gap_analysis.yml)

## Architecture and Automation

Process detail lives in the SOPs. System behavior, workflow boundaries, and automation relationships live in the architecture docs.

- [QMS Lite system architecture](docs/architecture/README.md)
- [Workflow automation map](docs/architecture/README.md#6-automation-map)
- [Signature worker service](services/signature-worker/README.md)
