---
sop_id: SOP-015
title: Nonconforming Product Control
revision: R03
effective_date: 2026-03-18
status: Published
owner_role: qa_lead
approver_role: management_representative
related_issue: "#11"
---
## 1. Purpose
Define how quality issues are triaged and controlled so that formal nonconforming software product outputs are identified, segregated, dispositioned, and corrected after defined lifecycle milestones.

## 2. Scope
Applies to quality issues affecting software releases, verification/validation artifacts, and delivered outputs that have reached a formal milestone (`Verification`, `Validation`, or `Production`). Internal development defects found before those milestones are managed as standard defects under `SOP-008`, and externally reported issues are first triaged under `SOP-012`. A formal nonconformity record is required only when the issue is determined to affect post-milestone output that is nonconforming.

## 3. Inputs
- Test failures and release gate failures after formal milestones
- Complaint investigations indicating post-milestone product nonconformity
- Monitoring alerts indicating product malfunction

## 4. Outputs
- Nonconformity record and disposition decision
- Corrective actions and re-verification evidence
- Containment/communication evidence when applicable

## 5. Roles and Responsibilities
| Role | Responsibilities |
|---|---|
| QA Lead | Owns nonconformity classification and disposition control. |
| Engineering Lead | Performs correction/rework and verification. |
| Management Representative | Approves major disposition decisions and concessions. |

## 6. Procedure

### 6.1 Identification and Logging
1. Treat each detected problem first as a quality issue and triage it to the correct control path.
2. Internal development bugs found before formal milestones are managed as standard defects under `SOP-008` and are not formal nonconformities under this SOP.
3. If an issue is reported by a customer, user, or patient, open a complaint record under `SOP-012`; create or cross-link a formal nonconformity record if complaint evaluation confirms a post-milestone nonconforming product.
4. If an issue is found internally after a formal milestone (`Verification`, `Validation`, or `Production`), assess whether the affected output is nonconforming; if yes, create a formal nonconformity record immediately.
5. Classify severity and potential patient/user impact.
6. Block release or isolate affected version where needed.

### 6.2 Segregation and Containment
1. Mark affected build/artifact as non-releasable.
2. Prevent accidental distribution via release controls.
3. For deployed issues, define containment/communication plan.

### 6.3 Disposition
Disposition options:
1. `Rework/Fix` and re-verify.
2. `Use as-is with justification` (requires management representative approval).
3. `Scrap/withdraw` (version retired).

### 6.4 Verification After Disposition
1. Re-run affected verification/validation activities.
2. Ensure no new unacceptable risks are introduced.
3. Update risk and traceability records as needed.

### 6.5 Closure and Improvement
1. Close nonconformity only with complete evidence.
2. Escalate recurring/systemic issues to CAPA.

## 7. Required Records
- Nonconformity record and classification
- Disposition approval and evidence
- Re-verification and closure evidence

## 8. Traceability
| ISO 13485 Clause | Control in this SOP |
|---|---|
| 8.3.1 | Defines identification and control of nonconforming product. |
| 8.3.2 | Defines response/actions to nonconformity. |
| 8.3.3 | Defines concession/rework controls and requirements. |
| 8.3.4 | Defines records for nonconformity and dispositions. |

## 9. Related Controlled Documents
- SOP-002 CAPA
- SOP-008 Design and Development Control
- SOP-009 Change Management
- SOP-012 Feedback and Complaint Handling

## 10. Revision History
| Revision | Effective Date | Change Summary |
|---|---|---|
| R00 | 2026-03-02 | Initial full release. |
| R01 | 2026-03-07 | Renamed the accountable engineering role to `engineering_lead` in the simplified role taxonomy. |
| R02 | 2026-03-18 | Removed top-table standards clause metadata; normative references remain in the Traceability section. |
| R03 | 2026-03-18 | Clarified quality-issue triage boundaries between development defects, formal nonconformities, and complaint-triggered intake while reserving formal nonconformity as the explicit post-milestone decision point. |
