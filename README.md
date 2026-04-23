# DearAuditor Open QMS Baseline

This repository publishes the open-source baseline behind [qms.dearauditor.ch](https://qms.dearauditor.ch/). It exists to provide a GitHub-native, reusable QMS baseline for remote-first medical device teams and to expose the controlled documents, templates, and workflows that make up the published example system.

If you are here to use or read the QMS, start with the end-user links below. If you need repository/adoption background, use the [landing page](https://qms.dearauditor.ch/), the [open-source adoption model](docs/open-source/README.md), and [CONTRIBUTING.md](CONTRIBUTING.md).

If you are reading this page on a `QMS-YYYY-MM-DD-RNNN` tag, this README is the release landing page for that published QMS baseline.

## Start Here

| I need to... | Open |
|---|---|
| Understand what this QMS is for | [Landing page](https://qms.dearauditor.ch/) |
| Read the top-level QMS explanation | [QM-001 Quality Manual](qm/QM-001-QualityManual.md) |
| Jump straight to the current published document set | [Published library](#published-library) |
| Open the formal QMS release for this baseline | [QMS-2026-04-09-R002](https://github.com/AliakseiT/dearauditor-qms-baseline/releases/tag/QMS-2026-04-09-R002) |
| Find a specific SOP by topic | [SOP library by topic](#sop-library-by-topic) |
| Open the work instructions | [Work instructions](#work-instructions) |
| See my training work as a logged-in GitHub user | [My open training issues](https://github.com/AliakseiT/dearauditor-qms-baseline/issues?q=is%3Aopen+is%3Aissue+label%3Atraining-diff+assignee%3A%40me+sort%3Aupdated-desc) |
| See role-based training requirements | [Training matrix](matrices/training_matrix.yml) |
| See recorded training status | [Training status report](records/training/training_status.md) |
| Browse record families and templates | [Records index](records/README.md) |
| Understand workflows, automations, and trust boundaries | [System architecture](docs/architecture/README.md) |
| Open the end-to-end automation diagram | [Workflow automation map](docs/architecture/README.md#6-automation-map) |
| Check published GitHub releases | [Releases](https://github.com/AliakseiT/dearauditor-qms-baseline/releases) |
| Ask about adoption, support, or pilot use | [aliaksei@dearauditor.ch](mailto:aliaksei@dearauditor.ch) |

## Baseline Snapshot

- Legal entity: `ACME GmbH`
- Registered office: `Paradeplatz 8, 8001 Zurich, Switzerland`
- Operating model: `Remote-first`
- Current baseline shown in this README: `1` published Quality Manual, `21` published SOPs, and `2` published WIs
- Formal QMS release for this baseline: [`QMS-2026-04-09-R002`](https://github.com/AliakseiT/dearauditor-qms-baseline/releases/tag/QMS-2026-04-09-R002)
- Formal QMS releases use `QMS-YYYY-MM-DD-RNNN`, where `RNNN` is the global sequential upstream baseline release number
- This repository also publishes record-specific releases, so the newest overall release is not always the newest QMS baseline. In GitHub Releases, use the newest `QMS-...` entry when you need the latest published QMS version.

## Training and Role Navigation

- [My open training issues](https://github.com/AliakseiT/dearauditor-qms-baseline/issues?q=is%3Aopen+is%3Aissue+label%3Atraining-diff+assignee%3A%40me+sort%3Aupdated-desc) for the logged-in user
- [Training matrix](matrices/training_matrix.yml) for GitHub user-to-role mappings plus required versus awareness training scope
- [Training status report](records/training/training_status.md) for auditor-friendly current completion state
- [SOP-011 Competence, Training, and Awareness](sops/SOP-011-CompetenceTrainingAndAwareness.md) for the governing procedure
- [System architecture](docs/architecture/README.md) and [workflow automation map](docs/architecture/README.md#6-automation-map) for the workflow model

## Published Library

Use the grouped links below for navigation. The raw machine-readable published controlled-document index remains further down for automation compatibility.

### Quality Manual

- [QM-001 Quality Manual](qm/QM-001-QualityManual.md) - `R04`

### SOP Library By Topic

#### Governance and Core QMS

- [SOP-001 Document and Record Control](sops/SOP-001-DocControl.md) - `R13`
- [SOP-002 Corrective and Preventive Action (CAPA)](sops/SOP-002-CAPA.md) - `R04`
- [SOP-003 Internal Audit](sops/SOP-003-InternalAudit.md) - `R05`
- [SOP-004 Management Review](sops/SOP-004-ManagementReview.md) - `R06`
- [SOP-005 QMS Governance](sops/SOP-005-QMSGovernance.md) - `R18`
- [SOP-011 Competence, Training, and Awareness](sops/SOP-011-CompetenceTrainingAndAwareness.md) - `R09`
- [SOP-016 Quality Metrics and Data Analysis](sops/SOP-016-QualityMetricsAndDataAnalysis.md) - `R04`
- [SOP-017 Infrastructure and Maintenance Control](sops/SOP-017-InfrastructureAndMaintenanceControl.md) - `R04`
- [SOP-021 Information Security Management (ISO/IEC 27001)](sops/SOP-021-InformationSecurityManagement.md) - `R00`

#### Development, Risk, and Release

- [SOP-006 Software Validation (QMS Tools)](sops/SOP-006-SoftwareValidation.md) - `R03`
- [SOP-007 Medical Device File Control](sops/SOP-007-MedicalDeviceFileControl.md) - `R07`
- [SOP-008 Design and Development Control](sops/SOP-008-DesignAndDevelopmentControl.md) - `R09`
- [SOP-009 Change Management](sops/SOP-009-ChangeManagement.md) - `R09`
- [SOP-018 Risk Management (ISO 14971)](sops/SOP-018-RiskManagement.md) - `R08`
- [SOP-019 Usability Engineering (IEC 62366-1)](sops/SOP-019-UsabilityEngineering.md) - `R11`
- [SOP-020 Software Lifecycle, Configuration, and Release Management (IEC 62304)](sops/SOP-020-SoftwareLifecycleConfigurationAndReleaseManagement.md) - `R10`

#### Suppliers, Complaints, and Post-Market

- [SOP-010 Supplier and Purchasing Control](sops/SOP-010-SupplierAndPurchasingControl.md) - `R03`
- [SOP-012 Feedback and Complaint Handling](sops/SOP-012-FeedbackAndComplaintHandling.md) - `R05`
- [SOP-013 Regulatory Incident Reporting](sops/SOP-013-RegulatoryIncidentReporting.md) - `R05`
- [SOP-014 Post-Market Surveillance](sops/SOP-014-PostMarketSurveillance.md) - `R05`
- [SOP-015 Nonconforming Product Control](sops/SOP-015-NonconformingProductControl.md) - `R04`

### Work Instructions

- [WI-001 Verification and Validation Execution](wis/WI-001-VerificationAndValidationExecution.md) - `R08`
- [WI-002 Configuration and Release Management Execution](wis/WI-002-ConfigurationAndReleaseManagementExecution.md) - `R09`

<details>
<summary>Machine-readable published controlled document index (used by release and training automation)</summary>

<!-- PUBLISHED-CONTROLLED-DOC-INDEX:START -->
| Document ID | Title | File | Effective Date | Published Revision | Status |
|---|---|---|---|---|---|
| QM-001 | Quality Manual | qm/QM-001-QualityManual.md | 2026-04-23 | R04 | Published |
| SOP-001 | Document and Record Control | sops/SOP-001-DocControl.md | 2026-03-25 | R13 | Published |
| SOP-002 | Corrective and Preventive Action (CAPA) | sops/SOP-002-CAPA.md | 2026-03-25 | R04 | Published |
| SOP-003 | Internal Audit | sops/SOP-003-InternalAudit.md | 2026-03-25 | R05 | Published |
| SOP-004 | Management Review | sops/SOP-004-ManagementReview.md | 2026-03-18 | R06 | Published |
| SOP-005 | QMS Governance | sops/SOP-005-QMSGovernance.md | 2026-04-23 | R18 | Published |
| SOP-006 | Software Validation (QMS Tools) | sops/SOP-006-SoftwareValidation.md | 2026-03-25 | R03 | Published |
| SOP-007 | Medical Device File Control | sops/SOP-007-MedicalDeviceFileControl.md | 2026-03-25 | R07 | Published |
| SOP-008 | Design and Development Control | sops/SOP-008-DesignAndDevelopmentControl.md | 2026-03-27 | R09 | Published |
| SOP-009 | Change Management | sops/SOP-009-ChangeManagement.md | 2026-03-27 | R09 | Published |
| SOP-010 | Supplier and Purchasing Control | sops/SOP-010-SupplierAndPurchasingControl.md | 2026-03-25 | R03 | Published |
| SOP-011 | Competence, Training, and Awareness | sops/SOP-011-CompetenceTrainingAndAwareness.md | 2026-03-25 | R09 | Published |
| SOP-012 | Feedback and Complaint Handling | sops/SOP-012-FeedbackAndComplaintHandling.md | 2026-03-27 | R05 | Published |
| SOP-013 | Regulatory Incident Reporting | sops/SOP-013-RegulatoryIncidentReporting.md | 2026-03-27 | R05 | Published |
| SOP-014 | Post-Market Surveillance | sops/SOP-014-PostMarketSurveillance.md | 2026-03-27 | R05 | Published |
| SOP-015 | Nonconforming Product Control | sops/SOP-015-NonconformingProductControl.md | 2026-03-25 | R04 | Published |
| SOP-016 | Quality Metrics and Data Analysis | sops/SOP-016-QualityMetricsAndDataAnalysis.md | 2026-03-25 | R04 | Published |
| SOP-017 | Infrastructure and Maintenance Control | sops/SOP-017-InfrastructureAndMaintenanceControl.md | 2026-03-25 | R04 | Published |
| SOP-018 | Risk Management (ISO 14971) | sops/SOP-018-RiskManagement.md | 2026-03-27 | R08 | Published |
| SOP-019 | Usability Engineering (IEC 62366-1) | sops/SOP-019-UsabilityEngineering.md | 2026-03-27 | R11 | Published |
| SOP-020 | Software Lifecycle, Configuration, and Release Management (IEC 62304) | sops/SOP-020-SoftwareLifecycleConfigurationAndReleaseManagement.md | 2026-03-27 | R10 | Published |
| SOP-021 | Information Security Management (ISO/IEC 27001) | sops/SOP-021-InformationSecurityManagement.md | 2026-04-23 | R00 | Published |
| WI-001 | Verification and Validation Execution | wis/WI-001-VerificationAndValidationExecution.md | 2026-03-10 | R08 | Published |
| WI-002 | Configuration and Release Management Execution | wis/WI-002-ConfigurationAndReleaseManagementExecution.md | 2026-03-27 | R09 | Published |
<!-- PUBLISHED-CONTROLLED-DOC-INDEX:END -->

</details>

## Records and Templates

- [Records index](records/README.md) for reusable record templates and record families
- [Company profile baseline](matrices/company_profile.yml)
- [Regulatory market scope baseline](matrices/regulatory_market_scope.yml)
- [Quality manual traceability matrix](matrices/quality_manual_traceability.yml)
- [QMS tooling inventory and validation baseline](matrices/qms_tooling_inventory.yml)
- [Signer registry](matrices/signer_registry.json)
- Gap analyses: [ISO 13485](matrices/iso_13485_gap_analysis.yml), [ISO 14971](matrices/iso_14971_gap_analysis.yml), [IEC 62304](matrices/iec_62304_gap_analysis.yml), [IEC 62366-1](matrices/iec_62366_1_gap_analysis.yml), [ISO/IEC 27001](matrices/iso_27001_gap_analysis.yml)

## Architecture and Automation

- [System architecture](docs/architecture/README.md)
- [Workflow automation map](docs/architecture/README.md#6-automation-map)
- [GitHub backup and validation](docs/architecture/GITHUB_BACKUP_AND_VALIDATION.md)
- [Signature worker service](services/signature-worker/README.md)

## Repository Context

- [Landing page](https://qms.dearauditor.ch/) for the higher-level explanation of why this project exists
- [Open-source adoption model](docs/open-source/README.md) for public-upstream versus private-adopter repo boundaries
- [examples/bootstrap](examples/bootstrap/README.md) for downstream bootstrap seeds
- [CONTRIBUTING.md](CONTRIBUTING.md) for contribution and validation expectations
