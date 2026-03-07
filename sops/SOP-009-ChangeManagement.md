---
sop_id: SOP-009
title: Change Management
revision: R04
effective_date: 2026-03-07
status: Published
owner_role: qa_lead
approver_role: management_representative
iso_13485_clauses:
  - 4.1.4
  - 7.3.9
related_issue: "#5"
---

## 1. Purpose
Define controlled change evaluation, approval, implementation, and verification for QMS and product artifacts.

## 2. Scope
Applies to procedural, tooling, product, infrastructure, supplier, and regulatory-impacting changes.

## 3. Inputs
- Change request or issue
- Impact/risk assessment
- Existing baseline artifacts

## 4. Outputs
- Approved change record and implementation evidence
- Updated controlled documents and training assignments

## 5. Roles and Responsibilities
| Role | Responsibilities |
|---|---|
| Change Owner | Prepares change rationale, scope, and implementation plan. |
| QA Lead | Reviews compliance and traceability impacts. |
| Management Representative | Approves significant QMS/regulatory-impacting changes. |
| Engineering Lead / Regulatory Lead / Technical QMS Maintainer | Execute and verify change within their assigned domain. |

## 6. Procedure

### 6.1 Change Classification
Classify each change as one or more of:
1. `QMS-document/process`
2. `Product design/software`
3. `Infrastructure/operations`
4. `Supplier/external dependency`

### 6.2 Impact Assessment
1. Assess impact on safety/performance, compliance, and record integrity.
2. Determine affected SOPs, training, tests, risks, and regulatory submissions.
3. Define rollback/containment approach for high-risk changes.
4. For software changes, determine whether configuration baseline, release manifest, or software safety classification updates are required.

### 6.3 Approval
1. Minor changes: QA Lead approval.
2. Major/regulatory-impacting changes: QA Lead + Management Representative approval.
3. Approval must occur before implementation in controlled baseline.

### 6.4 Implementation and Verification
1. Implement via PR with linked issue and evidence.
2. Execute required tests/reviews and attach objective evidence.
3. Update published SOP index and training matrix where applicable.
4. Multiple approved software changes may progress in parallel on the product `main` branch; merge alone does not imply inclusion in the next release.
5. Software release-affecting changes must update the release-readiness and release-baseline records defined in SOP-020 and WI-002.

### 6.5 Closure
1. Confirm all impacted artifacts are updated and approved.
2. Confirm post-change effectiveness indicators are stable.
3. Close change record with linkage to release and traceability artifacts.

## 7. Required Records
- Change request and impact assessment
- Approval evidence
- Verification evidence and closure summary

## 8. Traceability
| ISO 13485 Clause | Control in this SOP |
|---|---|
| 4.1.4 | Defines control of QMS process changes and their effect on conformity. |
| 7.3.9 | Defines control of design/development changes. |

## 9. Related Controlled Documents
- SOP-001 Document and Record Control
- SOP-008 Design and Development Control
- SOP-011 Competence, Training, and Awareness
- SOP-020 Software Lifecycle, Configuration, and Release Management (IEC 62304)
- WI-002 Configuration and Release Management Execution

## 10. Revision History
| Revision | Effective Date | Change Summary |
|---|---|---|
| R00 | 2026-03-02 | Initial full release. |
| R01 | 2026-03-06 | Added software baseline and release-manifest impact controls for regulated software changes. |
| R02 | 2026-03-07 | Normalized change-execution responsibilities to the controlled small-team role model. |
| R03 | 2026-03-07 | Renamed change-execution roles to the simplified `engineering_lead` and `regulatory_lead` taxonomy. |
| R04 | 2026-03-07 | Clarified that multiple software changes may proceed in parallel on product `main`, and that formal release inclusion is decided later through the controlled release-readiness gate. |
