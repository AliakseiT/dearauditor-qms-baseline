---
sop_id: SOP-020
title: Software Lifecycle, Configuration, and Release Management (IEC 62304)
revision: R05
effective_date: 2026-03-07
status: Published
owner_role: engineering_lead
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
Define a lightweight, GitHub-native software lifecycle control model aligned with IEC 62304 for software development planning, software-system classification, verification/validation linkage, parallel controlled change flow on product `main`, release-readiness gating, configuration management, release baselining, maintenance, and problem resolution.

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
- Approved final release decision
- Approved release-readiness and V&V-entry decision
- Controlled software configuration baseline and release manifest
- Linked verification/validation records and release decision evidence
- Maintenance and problem-resolution records with feedback to risk and design controls

## 5. Roles and Responsibilities
| Role | Responsibilities |
|---|---|
| Engineering Lead | Owns software lifecycle planning, configuration identification, and release readiness. |
| Engineer | Prepares implementation, build, and test artifacts and executes approved lifecycle activities. |
| QA Lead | Verifies procedure conformance, traceability, and record completeness. |
| Management Representative | Approves major residual risk or release decisions requiring management review. |
| Regulatory Lead | Maintains release scope, anomaly disposition, and maintenance follow-up actions. |

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
4. Dry-run executions may occur before formal release-readiness approval, but they are not release evidence until the candidate scope and binary deployment are formally approved and recorded.

### 6.5 Configuration Identification and Baseline Control
1. All controlled software lifecycle changes follow GitHub-managed change context -> branch -> pull request -> merge -> Part 11 attestation -> immutable release evidence, where the change context may be established in a separate issue or directly in the PR.
2. Working branches are collaboration and draft baselines only; they are not controlled release baselines and must not be used as the approved product state.
3. Multiple approved product changes may exist in parallel on product `main`; the subsequent release is defined later by an explicit release-readiness decision, not by merge order alone.
4. Before formal release-candidate V&V starts, record:
   - the selected release cutoff or candidate revision on `main`
   - which merged change records are included
   - which merged change records are deferred
   - the binary or deployment package that enters formal V&V
5. Each release-capable baseline must identify configuration items at minimum:
   - source revision/commit
   - relevant requirements/risk/test record revisions
   - approved build or deployment package reference
   - release manifest and rollback note
5. Formal release test execution must record the exact environment and binary configuration at the start of each test run.
6. Baseline updates after approval require a new PR revision; issue edits alone are not sufficient.

### 6.6 Release Decision and Publication
1. Release decisions require:
   - approved release-readiness scope decision
   - approved and current lifecycle records
   - acceptable unresolved anomaly posture
   - completed required verification/validation activities
   - approved residual risk status
2. Final release authorization must be made through a distinct group approval after the V&V report, residual-risk decision, anomaly posture, and exact binary/deployment reference are current.
3. The normal final release decision group is QA Lead, Engineering Lead, and Regulatory Lead; Management Representative participates when escalation, exceptional residual risk, or management review is required.
4. If the release binary changes after formal V&V entry, assess the change through change/risk/release records, record the new binary deployment, and determine whether partial or full re-execution is required before release.
5. Release evidence is published as immutable GitHub release assets using the QMS tag and record publication model.
6. Product MDF and related dossiers must link to the released baseline and associated evidence package.

### 6.7 Maintenance and Problem Resolution
1. Maintenance inputs include anomalies, complaints, incidents, cybersecurity findings, supplier changes, and PMS signals.
2. Each software problem is logged with classification, impact, disposition, and linkage to affected requirements, risk items, and releases.
3. High-severity or systemic software problems are escalated through nonconformity/CAPA and fed back into risk management and future V&V planning.

## 7. Required Records
- Software development and maintenance plan
- Software safety classification rationale
- Final release decision record
- Release-readiness and V&V-entry decision record
- Configuration item list and release baseline manifest
- Verification/validation plan, execution, configuration-capture, and report references
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
| R01 | 2026-03-07 | Normalized engineering and product/regulatory roles for small teams and clarified the distinction between engineer execution and engineering-owner accountability. |
| R02 | 2026-03-07 | Simplified lifecycle role names to `engineering_lead` and `regulatory_lead`. |
| R03 | 2026-03-07 | Clarified parallel change flow on product `main`, added the controlled release-readiness/V&V-entry gate, and made per-run execution configuration capture mandatory for formal release testing. |
| R04 | 2026-03-07 | Added the explicit final release-decision gate after V&V and residual-risk review, separate from release-readiness approval. |
| R05 | 2026-03-07 | Clarified that working branches are draft-only baselines and that controlled lifecycle changes may be initiated from PR-stated change context without a mandatory separate issue. |
