---
sop_id: SOP-023
title: Data Protection and Privacy Management (GDPR and Swiss nFADP)
revision: R00
revision_date: 2026-05-14
status: Published
owner_role: management_representative
approver_role: qa_lead
related_issue: ""
---
## 1. Purpose
Define the data protection and privacy management procedure used by adopting companies when personal data processing is in scope for the adopted QMS, product, supplier, support, or operational process.

This procedure provides a baseline privacy-management process. It does not by itself create a GDPR, Swiss nFADP, or other privacy compliance claim. The adopting company must define its processing scope, controller/processor roles, jurisdictional applicability, legal basis or justification, notices, contracts, technical and organizational measures, and retained evidence before making a compliance claim.

## 2. Scope
Applies when an adopting company determines that one or more controlled processes involve personal data under an applicable privacy or data-protection requirement.

The procedure may be marked not in scope for an adopting company or product scope when no personal data is processed, processing is outside the selected jurisdictional scope, or privacy records are not yet in scope with a documented review trigger before regulated processing begins.

## 3. Roles and Responsibilities
| Role | Responsibilities |
|---|---|
| Management Representative | Approves privacy applicability, risk acceptance, privacy policy decisions, and compliance claims. |
| QA Lead | Confirms privacy records are controlled, complete, and linked to QMS/product evidence where privacy affects regulated lifecycle decisions. |
| Engineering Lead | Implements privacy-by-design/default controls and privacy-relevant technical measures. |
| Technical QMS Maintainer | Maintains privacy-relevant QMS tooling, repository, workflow, access, and evidence-retention controls. |
| Privacy Lead or Assigned Owner | Maintains processing records, DPIA records, rights-request handling, breach assessment, transfer assessments, and privacy notices. |
| Supplier Owner | Ensures processor, subprocessor, data-processing agreement, transfer, and supplier evidence is obtained and reviewed. |

## 4. Procedure

### 4.1 Determine Privacy Applicability
1. Determine whether the company, product, supplier, support, QMS tooling, or operational scope processes personal data.
2. Record applicable jurisdictions and the applicable role for each processing activity, such as controller, processor, joint controller, subprocessor, independent recipient, or not in scope.
3. If privacy controls are not yet in scope, record the rationale, owner, review trigger, and condition that must be met before processing personal data.
4. If privacy controls are in scope, instantiate the applicable privacy records before processing begins or before a material processing change is released.

### 4.2 Maintain Processing and Legal-Basis Records
1. Maintain a processing activity register for in-scope processing.
2. For each activity, document purpose, data subject categories, personal data categories, recipients, transfers, retention or deletion criteria, security measures, privacy notice references, and linked supplier or product records.
3. For controller activities, document lawful basis, special-category or sensitive-data conditions, transparency evidence, and consent or legitimate-interest evidence where used.
4. For processor activities, document controller instructions, contract references, subprocessors, assistance obligations, and deletion or return expectations.

### 4.3 Build Privacy Into Design, Change, Supplier, and Security Controls
1. Design and change records must identify privacy-relevant data flows, minimization decisions, default-access decisions, retention/deletion controls, and security controls when personal data is processed.
2. Supplier qualification must identify processor, subprocessor, transfer, privacy-term, and audit-evidence expectations when suppliers process personal data.
3. Information-security, infrastructure, risk, and incident records must be linked where they provide privacy-relevant safeguards or evidence.

### 4.4 Assess High-Risk Processing
1. Screen in-scope processing activities for high risk before processing begins and after material processing changes.
2. Complete a DPIA or equivalent risk assessment when required by the applicable jurisdiction, processing context, or company policy.
3. Record residual risk, required safeguards, approval, authority-consultation decision, and review trigger before starting or materially changing high-risk processing.

### 4.5 Handle Rights Requests and Personal Data Breaches
1. Maintain an intake and tracking process for data-subject rights requests.
2. Verify requester identity where required before disclosing or changing personal data.
3. Record request scope, decision, response, extension or refusal rationale, recipient notification, and closure evidence.
4. Screen security events for personal data impact and record breach assessment, containment, corrective actions, notification decisions, and timing rationale.
5. Processors must notify and assist controllers according to applicable contracts, documented instructions, and law.

### 4.6 Review and Improve
1. Review privacy applicability, processing records, DPIAs, transfer assessments, supplier privacy controls, and breach/rights metrics at least annually and after material processing changes.
2. Include privacy controls in internal audit scope when privacy compliance is claimed as applicable.
3. Route nonconformities, overdue privacy actions, recurring rights-request issues, breach trends, supplier gaps, or authority findings through CAPA, supplier control, change management, risk management, or management review.

## 5. Required Records
- Processing activity register, using `records/privacy/processing_activity_register_template.md`
- Lawful basis or justification assessment, using `records/privacy/lawful_basis_assessment_template.md`
- DPIA screening and DPIA records, using `records/privacy/dpia_screening_template.md` and `records/privacy/dpia_template.md`
- Data-subject rights request log, using `records/privacy/data_subject_request_log_template.md`
- Personal data breach register, using `records/privacy/personal_data_breach_register_template.md`
- Transfer assessment, using `records/privacy/transfer_assessment_template.md`
- Processor, subprocessor, and supplier privacy-control evidence, using supplier records or equivalent controlled records
- Privacy-by-design/default evidence in design, architecture, requirement, change, risk, ISMS, AIMS, or product dossier records

## 6. Framework Mapping
Detailed GDPR and Swiss nFADP mappings are maintained in:

- `matrices/gdpr_gap_analysis.yml`
- `matrices/swiss_nfadp_gap_analysis.yml`
- `matrices/privacy_data_protection_gap_index.yml`

## 7. Related Controlled Documents
- SOP-001 Document and Record Control
- SOP-002 Corrective and Preventive Action (CAPA)
- SOP-003 Internal Audit
- SOP-004 Management Review
- SOP-005 QMS Governance
- SOP-008 Design and Development Control
- SOP-009 Change Management
- SOP-010 Supplier and Purchasing Control
- SOP-011 Competence, Training, and Awareness
- SOP-017 Infrastructure and Maintenance Control
- SOP-018 Risk Management
- SOP-021 Information Security Management
- SOP-022 AI Management System
- `records/privacy/README.md`

## 8. Revision History
| Revision | Revision Date | Change Summary |
|---|---|---|
| R00 | 2026-05-14 | Initial release establishing data protection and privacy-management controls with processing records, lawful-basis assessment, DPIA, rights request, breach, supplier, transfer, and privacy-by-design controls for use when in scope. |
