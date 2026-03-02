---
sop_id: SOP-012
title: Feedback and Complaint Handling
revision: R00
effective_date: 2026-03-02
status: Published
owner_role: clinical_ops
approver_role: qa_lead
iso_13485_clauses:
  - 8.2.1
  - 8.2.2
related_issue: "#8"
---

## 1. Purpose
Define a consistent process to collect, assess, investigate, and respond to user feedback and complaints for ACME healthcare software products.

## 2. Scope
Applies to all product feedback and complaint signals from users, customers, partners, and internal channels across supported markets.

## 3. Inputs
- Incoming feedback/complaint reports
- Product release history and known issue context
- Risk and incident criteria

## 4. Outputs
- Classified case record
- Investigation outcome and response
- Escalations to CAPA, incident reporting, or PMS trend actions

## 5. Roles and Responsibilities
| Role | Responsibilities |
|---|---|
| Clinical Ops | Owns intake, triage, and case communication. |
| QA Lead | Reviews complaint quality/risk classification and trend signals. |
| Engineering Owner | Investigates technical causes and corrective actions. |

## 6. Procedure

### 6.1 Intake and Logging
1. Log each report with source, timestamp, product/version, and reporter details.
2. Assign unique case identifier and initial severity class.
3. Acknowledge receipt within 2 business days.

### 6.2 Triage
1. Determine whether report is general feedback, complaint, or potential reportable incident.
2. Prioritize by potential patient/user impact, recurrence, and regulatory significance.
3. Escalate possible incidents immediately under SOP-013.

### 6.3 Investigation
1. Collect evidence: logs, reproduction steps, affected population, and controls.
2. Determine root cause status (`confirmed`, `probable`, `not confirmed`).
3. Define corrective actions and target timelines.

### 6.4 Response and Closure
1. Provide documented response or status update to reporter when applicable.
2. Close case only when investigation and actions are complete or justified.
3. Link case to CAPA/change record when systemic action is required.

### 6.5 Trending and Escalation
1. Review complaint trends monthly.
2. Escalate adverse trends to PMS analysis and management review.

## 7. Required Records
- Complaint/feedback case log
- Investigation evidence and conclusion
- Linked CAPA/incident/PMS references

## 8. Traceability
| ISO 13485 Clause | Control in this SOP |
|---|---|
| 8.2.1 | Defines feedback collection and monitoring controls. |
| 8.2.2 | Defines complaint handling workflow and records. |

## 9. Related Controlled Documents
- SOP-013 Regulatory Incident Reporting
- SOP-014 Post-Market Surveillance
- SOP-002 CAPA

## 10. Revision History
| Revision | Effective Date | Change Summary |
|---|---|---|
| R00 | 2026-03-02 | Initial full release. |
