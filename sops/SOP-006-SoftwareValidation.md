---
sop_id: SOP-006
title: Software Validation (QMS Tools)
revision: R03
effective_date: 2026-03-25
status: Published
owner_role: qa_lead
approver_role: management_representative
related_issue: "#2"
---
## 1. Purpose
Define risk-based validation and revalidation of software used in the QMS.

## 2. Scope
Applies to software tools that create, modify, approve, or retain quality records and compliance evidence.

## 3. Inputs
- Tool purpose and intended QMS use
- Risk assessment (impact to record integrity, product quality, and compliance decisions)
- User requirements and acceptance criteria

## 4. Outputs
- Validation record with scope, tests, results, and approval
- Revalidation record after significant tool changes

## 5. Roles and Responsibilities
| Role | Responsibilities |
|---|---|
| QA Lead | Owns validation planning, evidence completeness, and approval routing. |
| Tool Administrator | Configures tool and executes test protocol steps. |
| Process Owner | Confirms validated behavior supports intended process use. |
| Management Representative | Approves validation for high-criticality tools. |

## 6. Procedure

### 6.1 Tool Inventory and Criticality
1. Maintain QMS tool inventory in `matrices/qms_tooling_inventory.yml`.
2. Classify each tool criticality (`high`, `medium`, `low`) based on impact to record integrity, product quality, and compliance decisions.

### 6.2 Validation Planning
1. Define intended use and user requirements.
2. Define validation strategy proportional to risk and complexity.
3. Define objective acceptance criteria for each requirement.
4. Define traceability from intended use and requirements to planned test coverage and expected evidence.

### 6.3 Validation Execution
1. Execute test cases and capture evidence (screenshots, logs, exported artifacts).
2. Record deviations and assess impact.
3. Maintain traceability between defined requirements, executed tests, and captured evidence.
4. Resolve critical deviations before tool release for QMS use.

### 6.4 Approval and Release
1. QA Lead reviews validation completeness.
2. Management Representative approval is required for high-criticality tools.
3. Tool status in inventory is updated to validated only after approval.

### 6.5 Validated State Maintenance and Revalidation Triggers
Maintain the validated state throughout tool use by monitoring for internal or vendor changes that could affect intended use, risk, or evidence integrity.

Revalidation is required when:
1. Tool vendor introduces major functional/security changes.
2. Internal workflows/automation logic changes quality-critical behavior.
3. New intended QMS use is introduced.

## 7. Required Records
- Validation plan and protocol
- Test results and deviation log
- Validation summary and approval record

## 8. Traceability
| ISO 13485 Clause | Control in this SOP |
|---|---|
| 4.1.6 | Defines validation/revalidation controls for QMS software applications. |

## 9. Related Controlled Documents
- SOP-001 Document and Record Control
- SOP-005 QMS Governance

## 10. Revision History
| Revision | Effective Date | Change Summary |
|---|---|---|
| R00 | 2026-03-02 | Initial full release. |
| R01 | 2026-03-08 | Updated governance cross-reference after the Quality Manual was split out of SOP-005. |
| R02 | 2026-03-18 | Removed top-table standards clause metadata; normative references remain in the Traceability section. |
| R03 | 2026-03-25 | Generalized the purpose statement, added product-quality criticality language, required requirement-to-test traceability, and defined validated-state maintenance expectations. |
