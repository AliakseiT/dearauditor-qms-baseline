---
sop_id: SOP-012
title: Feedback and Complaint Handling
revision: R05
effective_date: 2026-03-27
status: Published
owner_role: qa_lead
approver_role: qa_lead
related_issue: "#8"
---
## 1. Purpose
Define a consistent process to collect, assess, investigate, and respond to user feedback and complaints for ACME healthcare software products.

## 2. Scope
Applies to all product feedback and complaint signals from users, customers, partners, and internal channels across supported markets. A complaint is any written, electronic, or oral communication alleging deficiencies related to the identity, quality, durability, reliability, safety, or performance of a product.

## 3. Inputs
- Incoming feedback/complaint reports
- Product release history and known issue context
- Risk evaluation criteria and regulatory incident reporting criteria as defined in SOP-013

## 4. Outputs
- Classified case record
- Investigation outcome and response
- Escalations to CAPA, incident reporting, or PMS trend actions

## 5. Roles and Responsibilities
| Role | Responsibilities |
|---|---|
| QA Lead | Owns intake, triage, case communication, complaint quality/risk classification, and trend-signal review. |
| Engineering Lead | Investigates technical causes and corrective actions. |

## 6. Procedure

### 6.1 Intake and Logging
1. Log each report with source, timestamp, product/version, and reporter details.
2. Assign unique case identifier and initial severity class.
3. Acknowledge receipt within 2 business days.

### 6.2 Triage
1. Determine whether report is general feedback, complaint, or potential reportable incident.
2. Prioritize by potential patient/user impact, recurrence, and regulatory significance.
3. All complaints shall be reviewed and evaluated to determine the need for investigation. Where no investigation is conducted, justification shall be documented.
4. Escalate possible incidents immediately under SOP-013.

### 6.3 Investigation
1. Collect evidence: logs, reproduction steps, affected population, and controls.
2. Determine root cause status (`confirmed`, `probable`, `not confirmed`).
3. Where applicable, complaint findings shall be evaluated for impact on the risk management file.
4. Define corrective actions and target timelines.

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
| R01 | 2026-03-07 | Renamed the complaint-process business owner role to the controlled product/regulatory owner role used in small-team deployments. |
| R02 | 2026-03-07 | Simplified the complaint-process role names to `regulatory_lead` and `engineering_lead`. |
| R03 | 2026-03-18 | Removed top-table standards clause metadata; normative references remain in the Traceability section. |
| R04 | 2026-03-25 | Added complaint definition, clarified incident-criteria input, required complaint investigation decisions, and linked complaint findings back to risk management. |
| R05 | 2026-03-27 | Consolidated the standalone regulatory-lead complaint-owner role into the QA-lead baseline and aligned the role table plus ownership metadata. |
