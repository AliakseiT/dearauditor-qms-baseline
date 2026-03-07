---
sop_id: SOP-011
title: Competence, Training, and Awareness
revision: R04
effective_date: 2026-03-07
status: Published
owner_role: qa_lead
approver_role: management_representative
iso_13485_clauses:
  - 6.2
related_issue: "#7"
---

## 1. Purpose
Define how ACME GmbH establishes competence requirements, assigns training, verifies completion, and maintains awareness for quality-relevant responsibilities.

## 2. Scope
Applies to all personnel and contractors performing tasks that can affect product quality, regulatory compliance, or QMS record integrity.

## 3. Inputs
- Role definitions and required SOP set in `matrices/training_matrix.yml`
- New/updated SOP revisions
- Onboarding and role-change events

## 4. Outputs
- Assigned training tasks/issues
- Completed and signed training records
- Current user training log

## 5. Roles and Responsibilities
| Role | Responsibilities |
|---|---|
| QA Lead | Owns training matrix and training process effectiveness. |
| Role Leads | Confirm assigned personnel complete required training for the roles they assign or supervise. |
| Trainees | Review material, acknowledge understanding, and complete required signoff. |
| Management Representative | Approves training process adequacy and escalations. |

## 6. Procedure

### 6.1 Competence Definition
1. Define role-specific required SOPs in `matrices/training_matrix.yml`.
2. Avoid broad over-assignment; include only SOPs needed for role responsibilities.
3. Any user who changes code, prepares builds, or executes controlled verification/validation activities must hold the `engineer` role at minimum.
4. Any user accountable for lifecycle planning, release readiness, or technical approval decisions must also hold the `engineering_lead` role.

### 6.2 Triggering Training
Training is required when:
1. New user is onboarded to one or more roles.
2. User changes role.
3. SOP revision affects assigned role responsibilities.
4. CAPA/audit identifies competence gaps.

### 6.3 Training Assignment and Review
1. Automation opens training issues when mapped SOPs are revised.
2. Training is executed through consolidated per-user training issues rather than review-only onboarding PRs.
3. Trainee acknowledgement and electronic-signature evidence are captured per workflow rules.

### 6.4 Completion and Evidence
1. Training completion is logged in the designated product/study record repository.
2. For formal records, immutable package is published to the designated product/study record repository.
3. Overdue training is escalated to QA Lead and management representative.

### 6.5 Effectiveness Verification
1. Sample completed training artifacts each quarter for quality of evidence.
2. Use audit/CAPA feedback to improve training assignments and content.

## 7. Required Records
- Training matrix revisions
- Training assignment issues
- User training logs and signed attestations

## 8. Traceability
| ISO 13485 Clause | Control in this SOP |
|---|---|
| 6.2 | Defines competence determination, training, awareness, and record maintenance. |

## 9. Related Controlled Documents
- SOP-001 Document and Record Control
- SOP-005 QMS Governance and Quality Manual

## 10. Revision History
| Revision | Effective Date | Change Summary |
|---|---|---|
| R00 | 2026-03-02 | Initial full release. |
| R01 | 2026-03-05 | Removed repository-specific naming and aligned training completion plus immutable publication wording to designated product/study record repositories. |
| R02 | 2026-03-07 | Removed the deprecated review-only onboarding PR path and aligned training execution wording to the consolidated issue-based signature flow. |
| R03 | 2026-03-07 | Added explicit minimum training role expectations for engineers and normalized manager language to role owners for small teams. |
| R04 | 2026-03-07 | Renamed accountable roles to the simplified `*_lead` taxonomy and aligned training language to that naming. |
