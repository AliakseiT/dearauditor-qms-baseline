---
sop_id: SOP-020
title: Software Lifecycle, Configuration, and Release Management (IEC 62304)
revision: R00
effective_date: 2026-03-06
status: Published
owner_role: software_engineer
approver_role: qa_lead
iso_13485_clauses:
  - 7.3
  - 7.5.1
  - 7.5.3
iec_62304_clauses:
  - 4
  - 5
  - 6
  - 7
  - 8
  - 9
related_issue: "#45"
---

## 1. Purpose
Define a lightweight, GitHub-native software lifecycle control model aligned with IEC 62304 for software development planning, software-system classification, verification/validation linkage, configuration management, release baselining, maintenance, and problem resolution.

## 2. Scope
Applies to regulated software products and significant product changes that require controlled software lifecycle records.

## 3. Inputs
- Product intended use and claims
- Regulatory and standards requirements
- Risk management plan/register
- Software requirements, architecture, and implementation artifacts
- Known anomalies, cybersecurity findings, and post-production inputs

## 4. Outputs
- Approved software development and maintenance plan
- Controlled software configuration baseline and release manifest
- Linked verification/validation records and release decision evidence
- Maintenance and problem-resolution records with feedback to risk and design controls

## 5. Roles and Responsibilities
| Role | Responsibilities |
|---|---|
| Engineering Lead | Owns software lifecycle planning, configuration identification, and release readiness. |
| QA Lead | Verifies procedure conformance, traceability, and record completeness. |
| Management Representative | Approves major residual risk or release decisions requiring management review. |
| Product/Engineering Owner | Maintains release scope, anomaly disposition, and maintenance follow-up actions. |

## 6. Procedure

### 6.1 Software System Classification
1. Assign software safety classification per product or subsystem before detailed development work.
2. Classification rationale must reference intended use, hazardous situations, and current risk records.
3. Classification changes require reassessment of verification depth, independence needs, and release criteria.

### 6.2 Software Development Planning
1. Define lifecycle model, deliverables, responsibilities, interfaces, and review gates before implementation.
2. Plan must identify:
   - target product or subsystem
   - software safety classification
   - required requirements, architecture, implementation, and review outputs
   - verification/validation strategy and evidence expectations
   - maintenance/problem-resolution approach
3. Planning and approval are executed through the GitHub workflow defined in `wis/WI-001-VerificationAndValidationExecution.md` and `wis/WI-002-ConfigurationAndReleaseManagementExecution.md`.

### 6.3 Development Outputs and SOUP/SOUP-Like Dependencies
1. Maintain software requirements, architecture, implementation references, and traceability in the designated product repository.
2. Identify externally sourced software components and document their intended use, version, and evaluation rationale.
3. Changes to externally sourced components require impact review on risk, verification scope, and release baseline.

### 6.4 Verification and Validation Interface
1. Verification and validation records must be traceable to software requirements, risk controls, anomalies, and release decisions.
2. Use controlled test-case identifiers and exact repository references to bind automated or manual evidence to the approved plan.
3. Validation against intended use or user needs must be reviewed with appropriate clinical or regulatory participation where required.

### 6.5 Configuration Identification and Baseline Control
1. All controlled software lifecycle changes follow issue -> branch -> pull request -> merge -> Part 11 attestation -> immutable release evidence.
2. Each release-capable baseline must identify configuration items at minimum:
   - source revision/commit
   - relevant requirements/risk/test record revisions
   - approved build or deployment package reference
   - release manifest and rollback note
3. Baseline updates after approval require a new PR revision; issue edits alone are not sufficient.

### 6.6 Release Decision and Publication
1. Release decisions require:
   - approved and current lifecycle records
   - acceptable unresolved anomaly posture
   - completed required verification/validation activities
   - approved residual risk status
2. Release evidence is published as immutable GitHub release assets using the QMS tag and record publication model.
3. Product MDF and related dossiers must link to the released baseline and associated evidence package.

### 6.7 Maintenance and Problem Resolution
1. Maintenance inputs include anomalies, complaints, incidents, cybersecurity findings, supplier changes, and PMS signals.
2. Each software problem is logged with classification, impact, disposition, and linkage to affected requirements, risk items, and releases.
3. High-severity or systemic software problems are escalated through nonconformity/CAPA and fed back into risk management and future V&V planning.

## 7. Required Records
- Software development and maintenance plan
- Software safety classification rationale
- Configuration item list and release baseline manifest
- Verification/validation plan, execution, and report references
- Problem-resolution and maintenance records

## 8. Traceability
| Standard Clause | Control in this SOP |
|---|---|
| IEC 62304 4 | Defines quality system linkage and software lifecycle governance baseline. |
| IEC 62304 5 | Defines software development planning and lifecycle outputs. |
| IEC 62304 6 | Defines maintenance planning and execution linkage. |
| IEC 62304 7 | Defines software risk-management interfaces to IEC 62304 activities. |
| IEC 62304 8 | Defines configuration identification, change, and release baseline control. |
| IEC 62304 9 | Defines problem-resolution recording and feedback. |

## 9. Related Controlled Documents
- SOP-005 QMS Governance and Quality Manual
- SOP-007 Medical Device File Control
- SOP-008 Design and Development Control
- SOP-009 Change Management
- SOP-015 Nonconforming Product Control
- SOP-018 Risk Management (ISO 14971)
- WI-001 Verification and Validation Execution
- WI-002 Configuration and Release Management Execution

## 10. Revision History
| Revision | Effective Date | Change Summary |
|---|---|---|
| R00 | 2026-03-06 | Initial release establishing IEC 62304 lifecycle, configuration, release, maintenance, and problem-resolution controls in the GitHub-native QMS model. |
