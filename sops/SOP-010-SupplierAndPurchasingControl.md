---
sop_id: SOP-010
title: Supplier and Purchasing Control
revision: R01
effective_date: 2026-03-05
status: Published
owner_role: management_representative
approver_role: qa_lead
iso_13485_clauses:
  - 4.1.5
  - 7.4.1
  - 7.4.2
  - 7.4.3
related_issue: "#6"
---

## 1. Purpose
Define selection, qualification, monitoring, and re-evaluation of suppliers and outsourced processes affecting product quality or QMS compliance.

## 2. Scope
Applies to all external providers of software components, cloud services, consulting, testing, and quality-critical operational support.

## 3. Inputs
- Supplier service description and criticality assessment
- Qualification evidence and due diligence
- Quality agreement and purchasing requirements

## 4. Outputs
- Approved Supplier List (ASL)
- Supplier performance and re-evaluation records
- Controlled purchasing specifications

## 5. Roles and Responsibilities
| Role | Responsibilities |
|---|---|
| Management Representative | Owns supplier governance framework and ASL approvals. |
| QA Lead | Verifies supplier controls and evidence quality. |
| Requesting Owner | Defines technical requirements and monitors delivery quality. |

## 6. Procedure

### 6.1 Supplier Criticality Classification
1. Classify supplier as `critical`, `major`, or `minor` based on quality/product impact.
2. Critical suppliers require enhanced qualification and periodic review.

### 6.2 Qualification and Vetting
1. Complete supplier vetting template at onboarding.
2. Evaluate competence, security/privacy posture, continuity, and compliance history.
3. Approve supplier only if minimum controls are met.

### 6.3 Approved Supplier List Maintenance
1. Record approved suppliers in the designated product/study record repository.
2. ASL fields must include service scope, criticality, approval date, and next review date.
3. Procurement from non-approved critical suppliers is prohibited unless documented temporary waiver is approved.

### 6.4 Purchasing Controls
1. Purchase requirements must define expected quality/compliance deliverables.
2. Quality agreements are required for critical suppliers.
3. Supplier deliverables must be reviewed against acceptance criteria.

### 6.5 Ongoing Monitoring and Re-evaluation
1. Monitor supplier performance (service quality, incidents, SLA breaches, audit outcomes).
2. Re-evaluate critical suppliers at least annually.
3. Remove/suspend suppliers from ASL if controls are no longer adequate.

## 7. Required Records
- Supplier vetting forms in the designated product/study record repository
- Approved supplier list
- Supplier performance reviews and decisions

## 8. Traceability
| ISO 13485 Clause | Control in this SOP |
|---|---|
| 4.1.5 | Defines control of outsourced processes affecting conformity. |
| 7.4.1 | Defines supplier evaluation and selection criteria. |
| 7.4.2 | Defines purchasing information/requirements control. |
| 7.4.3 | Defines verification of purchased product/service conformity. |

## 9. Related Controlled Documents
- SOP-009 Change Management
- SOP-017 Infrastructure and Maintenance Control

## 10. Revision History
| Revision | Effective Date | Change Summary |
|---|---|---|
| R00 | 2026-03-02 | Initial full release. |
| R01 | 2026-03-05 | Updated supplier record-location control to designated product/study repositories instead of `qms-lite` local record paths. |
