---
sop_id: SOP-015
title: Nonconforming Product Control
revision: R02
effective_date: 2026-03-18
status: Published
owner_role: qa_lead
approver_role: management_representative
related_issue: "#11"
---
## 1. Purpose
Define controls for identification, segregation, disposition, and correction of nonconforming software product outputs.

## 2. Scope
Applies to nonconforming software releases, artifacts, or delivered outputs detected before or after deployment.

## 3. Inputs
- Test failures and release gate failures
- Customer-reported defects with quality impact
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
1. Create nonconformity record immediately when detected.
2. Classify severity and potential patient/user impact.
3. Block release or isolate affected version where needed.

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

## 10. Revision History
| Revision | Effective Date | Change Summary |
|---|---|---|
| R00 | 2026-03-02 | Initial full release. |
| R01 | 2026-03-07 | Renamed the accountable engineering role to `engineering_lead` in the simplified role taxonomy. |
| R02 | 2026-03-18 | Removed top-table standards clause metadata; normative references remain in the Traceability section. |
