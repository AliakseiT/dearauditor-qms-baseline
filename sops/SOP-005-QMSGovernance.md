---
sop_id: SOP-005
title: QMS Governance
revision: R18
effective_date: 2026-04-25
status: Published
owner_role: qa_lead
approver_role: management_representative
related_issue: "#1"
---
## 1. Purpose
Define how ACME GmbH governs the Quality Management System (QMS): ownership, review cadence, communication, document hierarchy, tooling governance, and the interfaces between top-level QMS policy, operational SOPs, and product-level records.

## 2. Scope
Applies to QMS governance activities, company-level role responsibilities, document hierarchy control, governance reviews, and the maintenance of QMS-wide reference baselines.

## 3. Inputs
- Applicable standards and regulatory requirements
- `QM-001 Quality Manual`
- Management review outputs and KPI trends
- Audit, CAPA, complaint, PMS, supplier, and regulatory-scope inputs
- Proposed QMS process, tooling, or documentation changes

## 4. Outputs
- QMS governance review decisions and actions
- Updated role and responsibility expectations
- Approved QMS-wide reference baselines and governance records
- Disseminated governance decisions and training-impact updates

## 5. Roles and Responsibilities
| Role | Responsibilities |
|---|---|
| Top Management | Appoints the Management Representative within the defined governance model and retains ultimate responsibility for QMS effectiveness. |
| Management Representative | Approves governance changes, confirms QMS adequacy/effectiveness, and acts for top management in the small-team model. |
| QA Lead | Maintains governance cadence, the integrated quality/regulatory ownership baseline, and cross-document traceability completeness. |
| Engineering Lead / Usability Lead / Technical QMS Maintainer | Maintain assigned procedures and evidence within their governed process area. |
| Auditor | Independently verifies conformance and effectiveness of governed processes through audits. |

## 6. Procedure

### 6.1 Governance Cadence
1. Hold a QMS governance review at least quarterly.
2. Review at minimum: KPI trends, open CAPAs, audit findings, late training, supplier status, post-market signals, and regulatory changes.
3. Governance review outputs and decisions must be recorded and maintained as controlled quality records.
4. Formal management review under `SOP-004` uses governance-review outputs as an input for top-management confirmation of QMS suitability, adequacy, and effectiveness.

### 6.2 Responsibility and Communication Control
1. Maintain the responsibility matrix for quality-affecting functions and role assignments in `matrices/training_matrix.yml` and related governance records.
2. Disseminate governance decisions to impacted roles within five business days.
3. Dissemination records must capture audience, channel, date, and any required follow-up.

### 6.3 Quality Manual Interface
1. `QM-001 Quality Manual` is the top-level orientation document for QMS purpose, scope, policy, objectives, and process interaction.
2. `SOP-005` governs how `QM-001` and the related QMS baselines are maintained, approved, and communicated.
3. Changes to `QM-001` require impact review on downstream SOPs, traceability matrices, and training assignments before merge.

### 6.4 Regulatory Scope and Product Dossier Rules
1. Jurisdiction baseline references are maintained in `matrices/regulatory_market_scope.yml`.
2. Each product must maintain its own intended use, claims, classification rationale, and regulatory pathway in a product-specific dossier.
3. Release is blocked for products missing approved regulatory dossier entries where required by the applicable process.

### 6.5 QMS Tooling Governance
1. QMS digital tooling inventory is maintained in `matrices/qms_tooling_inventory.yml`.
2. GitHub is the approved primary platform for QMS processes, including repositories, pull requests, issues, and workflows. Supporting signing and evidence components are defined and controlled in the QMS tooling inventory.
3. Tooling changes require risk-based validation or revalidation evidence per `SOP-006`.

### 6.6 Supplier and Infrastructure Governance
1. Supplier qualification, approved supplier maintenance, and re-evaluation are defined in `SOP-010`.
2. Shared lifecycle infrastructure controls are defined in `SOP-017`; product-specific runtime controls are defined per product dossier.
3. Governance review must consider supplier or infrastructure changes that could affect quality, compliance, or record integrity.

### 6.7 Change and Training Interface
1. Any QMS process change must be assessed for impact on compliance obligations, product risk controls, existing controlled documents, and training mappings.
2. Impacted QM or SOP revisions must be updated in the published controlled-document index and `matrices/training_matrix.yml` before merge.
3. Governance changes that materially alter role expectations require training assignment review under `SOP-011`.

### 6.8 Effectiveness Monitoring
1. QA Lead tracks:
   - on-time management review completion
   - QMS document update cycle time
   - late training closure rate
   - recurrence rate of systemic CAPAs
2. Indicators are reviewed during governance review and fed into management review and CAPA when needed.

### 6.9 Standards Adoption Governance
1. ACME adopts `EVS-EN ISO 14971:2019+A11:2021` as the risk-management baseline standard for medical device software risk processes.
2. ACME adopts `EVS-EN 62366-1:2015+A1:2020` as the baseline standard for safety-related usability engineering.
3. ACME adopts `IEC 62304:2006+A1:2015` as the baseline standard for software lifecycle, maintenance, configuration management, and problem resolution.
4. ACME adopts `ISO/IEC 42001:2023` as the baseline standard for AI management for AI components inside ACME medical-device software, including AI policy, AI lifecycle, AI risk and impact assessment, and Annex A control selection through a Statement of Applicability.
5. Governance review verifies whether newly applicable standards, guidance, or changes to adopted standards affect the QMS baseline.
6. Changes to these standards or their supporting processes must be reflected in the affected SOPs, WIs, and matrices.

### 6.10 GitHub Workflow Alignment Rule
1. Controlled QMS changes follow a GitHub-native lifecycle: change context is established in a separate issue or directly in the pull request, then work proceeds through branch -> pull request -> required checks/approvals -> merge -> signature attestation -> immutable release evidence.
2. Branch-only and PR-draft content may be used for collaboration, but it is not approved controlled state.
3. The controlled repository baseline exists on `main` and, where applicable, on approved immutable release tags and release assets created from `main`.
4. The signature mechanism is common across this upstream baseline and designated product/study record repositories.

## 7. Required Records
- QMS governance review minutes and action log
- Responsibility matrix and dissemination records
- Regulatory scope register review record
- QMS tooling validation or revalidation references
- Product dossier governance decisions where applicable

## 8. Traceability
| ISO 13485 Clause | Control in this SOP | Linked Artifact |
|---|---|---|
| 4.1.4 | Defines QMS process change impact control and governance follow-up. | Change records, training matrix updates, published controlled-document index |
| 4.1.6 | Defines governance of QMS software applications and validation expectations. | `matrices/qms_tooling_inventory.yml`, `sops/SOP-006-SoftwareValidation.md` |
| 5.5 | Defines responsibilities, authority, communication, and governance dissemination. | Responsibility matrix, governance review minutes, dissemination records |

## 9. Related Controlled Documents
- QM-001 Quality Manual
- SOP-001 Document and Record Control
- SOP-004 Management Review
- SOP-006 Software Validation (QMS Tools)
- SOP-010 Supplier and Purchasing Control
- SOP-011 Competence, Training, and Awareness
- SOP-017 Infrastructure and Maintenance Control
- SOP-018 Risk Management (ISO 14971)
- SOP-019 Usability Engineering (IEC 62366-1)
- SOP-020 Software Lifecycle, Configuration, and Release Management (IEC 62304)
- SOP-022 AI Management System (ISO/IEC 42001)

## 10. Revision History
| Revision | Effective Date | Change Summary |
|---|---|---|
| R00 | 2026-03-01 | Initial release (skeleton content). |
| R01 | 2026-03-01 | Expanded to full operating procedure with ACME GmbH context and governance controls. |
| R02 | 2026-03-01 | Added exact CH/EU/US regulatory reference baseline, product-specific intended use/infrastructure rules, GitHub-only QMS tooling governance, and supplier-model dependency handling. |
| R03 | 2026-03-02 | Aligned related-process references to implemented SOP-006..SOP-017 and finalized supplier/infrastructure cross-links. |
| R04 | 2026-03-02 | Added ISO 14971 adoption and integrated risk governance linkage to SOP-018 and the risk matrix baseline. |
| R05 | 2026-03-02 | Added IEC 62366-1 adoption and usability engineering governance linkage to SOP-019 and the usability matrix baseline. |
| R06 | 2026-03-05 | Added repository-of-record governance for product/study records, clarified IEC 62366 evidence location, and added explicit rule to keep SOP lifecycle wording aligned with implemented GitHub workflow. |
| R07 | 2026-03-06 | Added IEC 62304 adoption, linked lifecycle execution instructions, and required product-level lifecycle/release record references. |
| R08 | 2026-03-07 | Normalized small-team accountability language to role owners and management representative responsibilities used in the controlled role matrix. |
| R09 | 2026-03-07 | Renamed controlled lead roles to the simplified `*_lead`/`auditor` taxonomy and removed product-owner wording from governance responsibilities. |
| R10 | 2026-03-07 | Added `usability_lead` to the controlled role taxonomy and clarified that usability ownership is distinct from regulatory oversight. |
| R11 | 2026-03-07 | Clarified that only `main` and approved immutable releases are controlled baselines, and that the GitHub lifecycle may be initiated directly from PR-stated change context when no separate issue is used. |
| R12 | 2026-03-07 | Removed overly specific signature-regulation terminology from the QMS workflow wording and used technology-neutral signature language. |
| R13 | 2026-03-08 | Split the reader-facing Quality Manual into `QM-001` and limited `SOP-005` to governance, ownership, cadence, and control interfaces. |
| R14 | 2026-03-10 | Updated DearAuditor Open QMS Baseline naming, licensing, and open-source governance references. |
| R15 | 2026-03-18 | Removed top-table standards clause metadata; normative references remain in the Traceability section. |
| R16 | 2026-03-25 | Reduced governance-review cadence to quarterly, added explicit top-management accountability and recordkeeping, refined tooling-governance wording, and required review of newly applicable standards. |
| R17 | 2026-03-27 | Consolidated the standalone regulatory-lead governance role into the QA-lead ownership baseline and removed the redundant separate role reference. |
| R18 | 2026-04-25 | Added ISO/IEC 42001 adoption for AI components inside ACME medical-device software and linked the dedicated AIMS procedure into the governance baseline. |
