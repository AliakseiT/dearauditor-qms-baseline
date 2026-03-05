---
sop_id: SOP-005
title: QMS Governance and Quality Manual
revision: R06
effective_date: 2026-03-05
status: Published
owner_role: qa_lead
approver_role: management_representative
iso_13485_clauses:
  - 4.1.1
  - 4.1.2
  - 4.1.3
  - 4.1.4
  - 4.1.6
  - 4.2.1
  - 4.2.2
  - 5.1
  - 5.2
  - 5.3
  - 5.4.1
  - 5.4.2
  - 5.5.1
  - 5.5.2
  - 5.5.3
related_issue: "#1"
---

## 1. Purpose
Define how ACME GmbH establishes, maintains, governs, and improves the Quality Management System (QMS) and Quality Manual for healthcare software products, including products that qualify as software as a medical device (SaMD).

## 2. Scope
Applies to all QMS processes, records, and personnel roles involved in design, development, release, post-market activities, supplier control, infrastructure governance, and management oversight.

## 3. Company Context
- Legal Entity: ACME GmbH
- Registered Address: Paradeplatz 8, 8001 Zurich, Switzerland
- Operating Model: Remote-first company
- Regulatory Role: Manufacturer
- Product Intent Policy: No single device intended medical purpose is defined at company level; each product defines intended use, claims, and classification in a product dossier.

## 4. Regulatory Scope Baseline (Exact References)
Regulatory applicability is maintained in `matrices/regulatory_market_scope.yml` and reviewed in governance meetings.

- Switzerland:
  - Ordinance on Medical Devices (MedDO), SR 812.213
  - MedDO Art. 3 (definition baseline)
  - MedDO Art. 15 (classification references Annex VIII MDR software rules)
- European Union:
  - Regulation (EU) 2017/745 (MDR), Article 2(1)
  - MDR Article 51 + Annex VIII (including software Rule 11 classification approach)
  - MDCG 2019-11 Rev.1 (Qualification and classification of software)
- United States:
  - FD&C Act section 201(h), codified at 21 U.S.C. 321(h)
  - FD&C Act section 520(o), codified at 21 U.S.C. 360j(o)
  - FDA Guidance: Policy for Device Software Functions and Mobile Medical Applications (September 2022)
  - FDA Guidance: Content of Premarket Submissions for Device Software Functions (June 2023)
  - 21 CFR Part 820 (QMSR, effective February 2, 2026)

## 5. Inputs
- Applicable standards and regulatory requirements
- Current Quality Manual structure and process map
- KPI and management review outputs
- Internal audit, CAPA, complaint, and post-market inputs
- Supplier performance and external issue signals

## 6. Outputs
- Controlled and approved Quality Manual baseline
- Documented QMS scope, process interactions, and responsibilities
- Approved quality policy and measurable quality objectives
- Management review actions and follow-up evidence
- Updated process ownership and governance records

## 7. Roles and Responsibilities
| Role | Responsibilities |
|---|---|
| Management Representative | Approves QMS/Quality Manual changes, confirms adequacy and effectiveness. |
| QA Lead | Maintains QMS process inventory, drives updates, verifies records and traceability completeness. |
| Process Owners | Maintain procedure content, execute controls, provide objective evidence. |
| Lead Auditor | Independently verifies conformance of governed processes through audits. |
| Top Management | Sets quality policy/objectives, ensures resources, reviews QMS performance. |

## 8. Procedure

### 8.1 Define QMS Scope and Process Map
1. QA Lead maintains QMS scope statement in the Quality Manual.
2. Scope includes organization role (manufacturer), product portfolio boundaries, and justified non-applications.
3. QA Lead maintains process interaction map linking each major QMS process to SOP ownership.

### 8.2 Maintain Quality Manual Structure
1. Quality Manual must contain at minimum:
   - Scope and exclusions/non-applications
   - Quality policy and objectives reference
   - QMS process interaction map
   - References to controlled SOPs and records
2. Changes to Quality Manual structure are reviewed/approved per document control.
3. Structure changes require impact review on downstream SOPs and training assignments.

### 8.3 Governance Cadence
1. Monthly QMS governance review is held by QA Lead and Management Representative.
2. Quarterly governance package includes KPI trends, open CAPAs, audit findings, post-market signals, and regulatory changes.
3. Annual management review confirms suitability, adequacy, and effectiveness of the QMS.

### 8.4 Quality Policy and Objectives Control
1. Top Management approves quality policy and quality objectives.
2. Objectives must be measurable and mapped to process owners.
3. Objective changes require rationale, baseline metric definition, and inclusion in management review inputs.

### 8.5 Responsibility and Communication
1. Management Representative maintains the responsibility matrix for quality-affecting functions.
2. QMS governance decisions are disseminated to impacted roles within five business days.
3. Dissemination records capture audience, channel, date, and feedback summary.

### 8.6 Regulatory Scope and Product Dossier Rules
1. Jurisdiction baseline references are maintained in `matrices/regulatory_market_scope.yml`.
2. Each product must maintain its own intended use, claims, classification rationale, and regulatory pathway.
3. Release is blocked for products missing approved regulatory dossier entries.

### 8.7 QMS Tooling Governance (GitHub-Only)
1. QMS digital tooling inventory is maintained in `matrices/qms_tooling_inventory.yml`.
2. Current approved QMS tooling is GitHub (repositories, pull requests, issues, workflows).
3. QMS Lite repository defines governance SOPs, matrices, and workflow baselines; product and study execution records are maintained in designated product/study repositories.
4. Tooling changes require risk-based validation/revalidation evidence per ISO 13485 4.1.6.

### 8.8 Infrastructure Definition Rule
1. Product infrastructure architecture and controls are defined per product dossier.
2. This SOP does not impose a single shared product infrastructure baseline.
3. Shared lifecycle infrastructure controls are defined in SOP-017.

### 8.9 Supplier Lifecycle Governance
1. Supplier qualification, approved supplier list control, and re-evaluation are defined in SOP-010.
2. Supplier decisions with quality impact are reviewed in governance meetings.

### 8.10 Change Management Interface
1. Any QMS process change is assessed for impact on compliance obligations, product risk controls, existing SOPs, and training matrix mappings.
2. Impacted SOP revisions must be updated in the Published SOP Index and training matrix before merge.

### 8.11 Effectiveness Monitoring
1. QA Lead tracks:
   - On-time management review completion
   - QMS document update cycle time
   - Late training closure rate
   - Recurrence rate of systemic CAPAs
2. Indicators are reviewed in management review and drive improvement actions.

### 8.12 Integrated Risk Management Standard Adoption
1. ACME adopts `EVS-EN ISO 14971:2019+A11:2021` as the risk management baseline standard for medical device software risk processes.
2. The risk management operating procedure is defined in SOP-018 and is part of QMS scope.
3. Risk governance uses a single process for top-down hazards, bottom-up failure modes, and cybersecurity threats.
4. Product release and post-market decisions require current residual risk evaluation status from the risk management file.

### 8.13 Usability Engineering Standard Adoption
1. ACME adopts `EVS-EN 62366-1:2015+A1:2020` as the baseline for safety-related usability engineering.
2. The usability engineering operating procedure is defined in SOP-019 and is part of QMS scope for user-facing products.
3. Usability engineering records are maintained in designated product/study repositories as a lightweight usability engineering file with explicit links to risk records.
4. Use-related post-production findings are reviewed and fed back into risk and design controls.

### 8.14 GitHub Workflow Alignment Rule
1. QMS SOP execution model follows GitHub-native lifecycle: issue -> branch -> pull request -> required checks/approvals -> merge -> Part 11 signature attestation -> immutable release evidence.
2. SOP wording must reflect implemented GitHub workflow behavior; if automation sequence changes, impacted SOPs are revised in the same change set.
3. Part 11 signing mechanism is common across QMS Lite and designated product/study record repositories.

## 9. Required Records
- Quality Manual revision and approval log
- QMS governance meeting minutes and actions
- Regulatory scope register review record
- Product dossier approval records for intended use/classification
- Risk management plan and risk management file references per product
- Usability engineering file references per product
- QMS tooling validation/revalidation records
- Record repository mapping (product/study -> repository path) with ownership
- Dissemination and feedback records for QMS updates

## 10. Traceability
| ISO 13485 Clause | Control in this SOP | Linked Artifact |
|---|---|---|
| 4.2.1, 4.2.2 | Defines documented QMS structure and quality manual minimum content | `matrices/quality_manual_traceability.yml` |
| 5.1, 5.3, 5.4 | Management commitment, policy, and objectives governance | Management review records and KPI package |
| 5.5 | Responsibility and communication governance | Responsibility matrix and dissemination records |
| 4.1.4 | QMS process change impact control | Change impact records and SOP/index/training updates |
| 4.1.6 | QMS software validation governance | `matrices/qms_tooling_inventory.yml`, designated QMS-tool validation record repository |
| ISO 14971 Clauses 4-10 | Integrated lifecycle risk governance | `sops/SOP-018-RiskManagement.md`, `matrices/iso_14971_gap_analysis.yml` |
| IEC 62366-1 Clauses 4.1.1-5.10 | Usability engineering lifecycle governance | `sops/SOP-019-UsabilityEngineering.md`, `matrices/iec_62366_1_gap_analysis.yml` |

## 11. Related Controlled Documents
- SOP-001 Document and Record Control
- SOP-002 Corrective and Preventive Action (CAPA)
- SOP-003 Internal Audit
- SOP-004 Management Review
- SOP-006 Software Validation (QMS Tools)
- SOP-007 Medical Device File Control
- SOP-008 Design and Development Control
- SOP-009 Change Management
- SOP-010 Supplier and Purchasing Control
- SOP-011 Competence, Training, and Awareness
- SOP-012 Feedback and Complaint Handling
- SOP-013 Regulatory Incident Reporting
- SOP-014 Post-Market Surveillance
- SOP-015 Nonconforming Product Control
- SOP-016 Quality Metrics and Data Analysis
- SOP-017 Infrastructure and Maintenance Control
- SOP-018 Risk Management (ISO 14971)
- SOP-019 Usability Engineering (IEC 62366-1)

## 12. Revision History
| Revision | Effective Date | Change Summary |
|---|---|---|
| R00 | 2026-03-01 | Initial release (skeleton content). |
| R01 | 2026-03-01 | Expanded to full operating procedure with ACME GmbH context and governance controls. |
| R02 | 2026-03-01 | Added exact CH/EU/US regulatory reference baseline, product-specific intended use/infrastructure rules, GitHub-only QMS tooling governance, and supplier-model dependency handling. |
| R03 | 2026-03-02 | Aligned related-process references to implemented SOP-006..SOP-017 and finalized supplier/infrastructure cross-links. |
| R04 | 2026-03-02 | Added ISO 14971 adoption and integrated risk governance linkage to SOP-018 and the risk matrix baseline. |
| R05 | 2026-03-02 | Added IEC 62366-1 adoption and usability engineering governance linkage to SOP-019 and the usability matrix baseline. |
| R06 | 2026-03-05 | Added repository-of-record governance for product/study records, clarified IEC 62366 evidence location, and added explicit rule to keep SOP lifecycle wording aligned with implemented GitHub workflow. |
