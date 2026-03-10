# DearAuditor Open QMS Baseline

DearAuditor Open QMS Baseline serves two purposes at the same time:

- the published front page and controlled index for the fictional `ACME GmbH` quality management system
- the open-source base template for remote-first, engineering-friendly medical device companies building a GitHub-native QMS

Repository links in this documentation assume the finalized GitHub slug `AliakseiT/dearauditor-qms-baseline`.

If you are reading this page on a `QMS-YYYY-MM-DD-RNN` tag, this README is the release landing page for that published QMS baseline.

## Start Here

| I need to... | Open |
|---|---|
| Read the current controlled document set | [Published library](#published-library) |
| Start with the top-level QMS explanation | [Quality Manual](#quality-manual) |
| Jump straight to a SOP | [SOP library by topic](#sop-library-by-topic) |
| Open the work instructions | [Work instructions](#work-instructions) |
| See my training work as a logged-in GitHub user | [My open training issues](https://github.com/AliakseiT/dearauditor-qms-baseline/issues?q=is%3Aopen+is%3Aissue+label%3Atraining-diff+assignee%3A%40me+sort%3Aupdated-desc) |
| See role-based training requirements | [Training matrix](matrices/training_matrix.yml) |
| See recorded training status | [Training status report](records/training/training_status.md) |
| Browse record families and templates | [Records index](records/README.md) |
| Understand how public upstream and private adopter repos fit together | [Open-source adoption model](docs/open-source/README.md) |
| Ask about adoption, support, or pilot use | [aliaksei@dearauditor.ch](mailto:aliaksei@dearauditor.ch) |
| Understand workflows, automations, and trust boundaries | [System architecture](docs/architecture/README.md) |
| Open the end-to-end automation diagram | [Workflow automation map](docs/architecture/README.md#6-automation-map) |
| Check published releases in GitHub | [Releases](https://github.com/AliakseiT/dearauditor-qms-baseline/releases) |

## Publication Status

- Legal entity: `ACME GmbH`
- Registered office: `Paradeplatz 8, 8001 Zurich, Switzerland`
- Operating model: `Remote-first`
- Current baseline shown in this README: `1` published Quality Manual, `20` published SOPs, and `2` published WIs
- Formal QMS releases use `QMS-YYYY-MM-DD-RNN`
- This repository also publishes record-specific releases, so the newest overall release is not always the newest QMS baseline. In GitHub Releases, use the newest `QMS-...` entry when you need the latest published QMS version.

## Open-Source Distribution Model

This repository remains the public upstream baseline. Adopting companies should not run their live QMS directly as a long-lived public fork. Instead:

- a company creates a private adopter repository from a selected upstream baseline ref, normally a `QMS-YYYY-MM-DD-RNN` tag
- the adopter repo records its current upstream baseline in `adoption/upstream-baseline.json`
- later upstream changes are proposed into the adopter repo as controlled upgrade PRs that update only upstream-owned paths
- company-owned matrices, signer assignments, training logs, supplier state, and operational records stay local to the adopter repository

The machine-readable boundary is defined in [distribution-map.json](distribution-map.json). The generic bootstrap seeds for company-owned files live under [examples/bootstrap](examples/bootstrap/README.md), and the supported CLI entry points live under [tools/](tools).

The upstream repository still keeps a dogfooded company baseline in the live `matrices/` and selected `records/` paths so the content and automations can be exercised end to end while the model is evolving. That is intentional. Adopters should treat those upstream files as upstream-only operating state and bootstrap their own company-owned copies from [examples/bootstrap](examples/bootstrap/README.md).

Recommended scripts:

- [tools/bootstrap_company_repo.sh](tools/bootstrap_company_repo.sh) to create a private adopter repo from an upstream baseline
- [tools/open_upstream_upgrade_pr.sh](tools/open_upstream_upgrade_pr.sh) to propose a selected upstream update into a downstream repo
- [tools/check_adoption_readiness.sh](tools/check_adoption_readiness.sh) to block incomplete onboarding and missing repo settings

Signing service options:

- self-host the GitHub signing worker described in [services/signature-worker](services/signature-worker/README.md)
- optionally discuss use of the hosted signing endpoint `https://sign.qms.dearauditor.ch` for GitHub-native signing workflows; commercial terms and service conditions remain separate from the open-source baseline

Contact for adoption, pilot use, or support: [aliaksei@dearauditor.ch](mailto:aliaksei@dearauditor.ch)

## Training and Role Navigation

GitHub README pages cannot personalize content by the viewer's login, so the GitHub-native training entry points are:

- [My open training issues](https://github.com/AliakseiT/dearauditor-qms-baseline/issues?q=is%3Aopen+is%3Aissue+label%3Atraining-diff+assignee%3A%40me+sort%3Aupdated-desc) for the logged-in user
- [Training matrix](matrices/training_matrix.yml) for GitHub user-to-role mappings plus required versus awareness training scope
- [Training status report](records/training/training_status.md) for auditor-friendly current completion state
- [SOP-011 Competence, Training, and Awareness](sops/SOP-011-CompetenceTrainingAndAwareness.md) for the governing procedure
- [System architecture](docs/architecture/README.md) and [workflow automation map](docs/architecture/README.md#6-automation-map) for the training workflow model

## Published Library

Use the grouped links below for navigation. The raw machine-readable published controlled-document index remains further down for automation compatibility.

### Quality Manual

- [QM-001 Quality Manual](qm/QM-001-QualityManual.md) - `R01`

### SOP Library By Topic

#### Governance and Core QMS

- [SOP-001 Document and Record Control](sops/SOP-001-DocControl.md) - `R11`
- [SOP-002 Corrective and Preventive Action (CAPA)](sops/SOP-002-CAPA.md) - `R02`
- [SOP-003 Internal Audit](sops/SOP-003-InternalAudit.md) - `R03`
- [SOP-004 Management Review](sops/SOP-004-ManagementReview.md) - `R05`
- [SOP-005 QMS Governance](sops/SOP-005-QMSGovernance.md) - `R14`
- [SOP-011 Competence, Training, and Awareness](sops/SOP-011-CompetenceTrainingAndAwareness.md) - `R06`
- [SOP-016 Quality Metrics and Data Analysis](sops/SOP-016-QualityMetricsAndDataAnalysis.md) - `R02`
- [SOP-017 Infrastructure and Maintenance Control](sops/SOP-017-InfrastructureAndMaintenanceControl.md) - `R02`

#### Development, Risk, and Release

- [SOP-006 Software Validation (QMS Tools)](sops/SOP-006-SoftwareValidation.md) - `R01`
- [SOP-007 Medical Device File Control](sops/SOP-007-MedicalDeviceFileControl.md) - `R05`
- [SOP-008 Design and Development Control](sops/SOP-008-DesignAndDevelopmentControl.md) - `R06`
- [SOP-009 Change Management](sops/SOP-009-ChangeManagement.md) - `R06`
- [SOP-018 Risk Management (ISO 14971)](sops/SOP-018-RiskManagement.md) - `R04`
- [SOP-019 Usability Engineering (IEC 62366-1)](sops/SOP-019-UsabilityEngineering.md) - `R07`
- [SOP-020 Software Lifecycle, Configuration, and Release Management (IEC 62304)](sops/SOP-020-SoftwareLifecycleConfigurationAndReleaseManagement.md) - `R07`

#### Suppliers, Complaints, and Post-Market

- [SOP-010 Supplier and Purchasing Control](sops/SOP-010-SupplierAndPurchasingControl.md) - `R01`
- [SOP-012 Feedback and Complaint Handling](sops/SOP-012-FeedbackAndComplaintHandling.md) - `R02`
- [SOP-013 Regulatory Incident Reporting](sops/SOP-013-RegulatoryIncidentReporting.md) - `R02`
- [SOP-014 Post-Market Surveillance](sops/SOP-014-PostMarketSurveillance.md) - `R02`
- [SOP-015 Nonconforming Product Control](sops/SOP-015-NonconformingProductControl.md) - `R01`

### Work Instructions

- [WI-001 Verification and Validation Execution](wis/WI-001-VerificationAndValidationExecution.md) - `R08`
- [WI-002 Configuration and Release Management Execution](wis/WI-002-ConfigurationAndReleaseManagementExecution.md) - `R08`

<details>
<summary>Machine-readable published controlled document index (used by release and training automation)</summary>

<!-- PUBLISHED-CONTROLLED-DOC-INDEX:START -->
| Document ID | Title | File | Effective Date | Published Revision | Status |
|---|---|---|---|---|---|
| QM-001 | Quality Manual | qm/QM-001-QualityManual.md | 2026-03-10 | R01 | Published |
| SOP-001 | Document and Record Control | sops/SOP-001-DocControl.md | 2026-03-10 | R11 | Published |
| SOP-002 | Corrective and Preventive Action (CAPA) | sops/SOP-002-CAPA.md | 2026-03-05 | R02 | Published |
| SOP-003 | Internal Audit | sops/SOP-003-InternalAudit.md | 2026-03-07 | R03 | Published |
| SOP-004 | Management Review | sops/SOP-004-ManagementReview.md | 2026-03-08 | R05 | Published |
| SOP-005 | QMS Governance | sops/SOP-005-QMSGovernance.md | 2026-03-10 | R14 | Published |
| SOP-006 | Software Validation (QMS Tools) | sops/SOP-006-SoftwareValidation.md | 2026-03-08 | R01 | Published |
| SOP-007 | Medical Device File Control | sops/SOP-007-MedicalDeviceFileControl.md | 2026-03-10 | R05 | Published |
| SOP-008 | Design and Development Control | sops/SOP-008-DesignAndDevelopmentControl.md | 2026-03-07 | R06 | Published |
| SOP-009 | Change Management | sops/SOP-009-ChangeManagement.md | 2026-03-08 | R06 | Published |
| SOP-010 | Supplier and Purchasing Control | sops/SOP-010-SupplierAndPurchasingControl.md | 2026-03-05 | R01 | Published |
| SOP-011 | Competence, Training, and Awareness | sops/SOP-011-CompetenceTrainingAndAwareness.md | 2026-03-08 | R06 | Published |
| SOP-012 | Feedback and Complaint Handling | sops/SOP-012-FeedbackAndComplaintHandling.md | 2026-03-07 | R02 | Published |
| SOP-013 | Regulatory Incident Reporting | sops/SOP-013-RegulatoryIncidentReporting.md | 2026-03-07 | R02 | Published |
| SOP-014 | Post-Market Surveillance | sops/SOP-014-PostMarketSurveillance.md | 2026-03-07 | R02 | Published |
| SOP-015 | Nonconforming Product Control | sops/SOP-015-NonconformingProductControl.md | 2026-03-07 | R01 | Published |
| SOP-016 | Quality Metrics and Data Analysis | sops/SOP-016-QualityMetricsAndDataAnalysis.md | 2026-03-07 | R02 | Published |
| SOP-017 | Infrastructure and Maintenance Control | sops/SOP-017-InfrastructureAndMaintenanceControl.md | 2026-03-07 | R02 | Published |
| SOP-018 | Risk Management (ISO 14971) | sops/SOP-018-RiskManagement.md | 2026-03-08 | R04 | Published |
| SOP-019 | Usability Engineering (IEC 62366-1) | sops/SOP-019-UsabilityEngineering.md | 2026-03-10 | R07 | Published |
| SOP-020 | Software Lifecycle, Configuration, and Release Management (IEC 62304) | sops/SOP-020-SoftwareLifecycleConfigurationAndReleaseManagement.md | 2026-03-08 | R07 | Published |
| WI-001 | Verification and Validation Execution | wis/WI-001-VerificationAndValidationExecution.md | 2026-03-10 | R08 | Published |
| WI-002 | Configuration and Release Management Execution | wis/WI-002-ConfigurationAndReleaseManagementExecution.md | 2026-03-10 | R08 | Published |
<!-- PUBLISHED-CONTROLLED-DOC-INDEX:END -->

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

Process detail lives in the Quality Manual, SOPs, and WIs. System behavior, workflow boundaries, and automation relationships live in the architecture docs.

- [DearAuditor Open QMS Baseline system architecture](docs/architecture/README.md)
- [Workflow automation map](docs/architecture/README.md#6-automation-map)
- [Signature worker service](services/signature-worker/README.md)
