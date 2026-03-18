---
sop_id: SOP-002
title: Corrective and Preventive Action (CAPA)
revision: R03
effective_date: 2026-03-18
status: Published
owner_role: qa_lead
approver_role: management_representative
related_issue: "#1"
---
## 1. Purpose
Define a risk-based CAPA process to eliminate causes of nonconformities, prevent recurrence, and prevent occurrence of potential nonconformities.

## 2. Scope
Applies to quality system and product lifecycle nonconformities originating from audits, complaints, incidents, trend analysis, supplier issues, or management review outputs.

## 3. Inputs
- Audit findings
- Complaint/PMS trend signals
- Incident investigations
- Supplier nonconformities
- Management review actions

## 4. Outputs
- Approved CAPA record with root cause, action plan, and effectiveness evidence
- Updates to SOPs, training, risk controls, or product artifacts as needed

## 5. Roles and Responsibilities
| Role | Responsibilities |
|---|---|
| QA Lead | Owns CAPA system, assures method quality and timeliness. |
| CAPA Owner | Executes investigation and actions. |
| Process Owner | Implements process/product changes. |
| Management Representative | Reviews escalated/high-risk CAPAs and approves closure. |

## 6. Procedure

### 6.1 CAPA Initiation
1. Create CAPA record when systemic issue or significant risk is identified.
2. Classify severity: `critical`, `major`, `minor`.
3. Define immediate containment to protect patient/user and compliance state.

### 6.2 Investigation and Root Cause
1. Assign investigator independent from the initiating activity when practical.
2. Use a structured method (`5 Why`, fishbone, fault-tree, or equivalent).
3. Identify root cause category: process, design, supplier, training, infrastructure, or oversight.

### 6.3 Action Plan
1. Define corrective actions to remove identified root cause.
2. Define preventive actions where similar failures could occur.
3. Assign accountable owners and due dates for each action.
4. For software impacts, include verification evidence requirements.

### 6.4 Implementation and Verification
1. Implement approved actions through controlled changes.
2. Verify each action was completed as designed.
3. Update impacted SOPs, risk files, and training where required.

### 6.5 Effectiveness Check
1. Define measurable effectiveness criteria before closure.
2. Observe post-implementation period appropriate to risk.
3. Reopen/escalate CAPA if effectiveness criteria are not met.

### 6.6 Closure
1. QA Lead confirms completeness of objective evidence.
2. Management Representative approves closure for `critical` and `major` CAPAs.
3. Closed CAPA records are retained as immutable quality records.

## 7. Required Records
- CAPA execution record in the designated product/study record repository
- Investigation evidence and root cause rationale
- Action completion and effectiveness evidence

## 8. Traceability
| ISO 13485 Clause | Control in this SOP |
|---|---|
| 8.5.2 | Corrective action trigger, investigation, implementation, and verification. |
| 8.5.3 | Preventive action trigger, risk-based planning, and effectiveness monitoring. |

## 9. Related Controlled Documents
- SOP-009 Change Management
- SOP-015 Nonconforming Product Control
- SOP-016 Quality Metrics and Data Analysis

## 10. Revision History
| Revision | Effective Date | Change Summary |
|---|---|---|
| R00 | 2026-03-01 | Initial placeholder release. |
| R01 | 2026-03-02 | Full CAPA lifecycle procedure implemented. |
| R02 | 2026-03-05 | Updated record-location control to designated product/study repositories instead of `qms-lite` local record paths. |
| R03 | 2026-03-18 | Removed top-table standards clause metadata; normative references remain in the Traceability section. |
