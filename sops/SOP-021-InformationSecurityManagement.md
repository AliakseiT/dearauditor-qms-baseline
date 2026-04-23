---
sop_id: SOP-021
title: Information Security Management (ISO/IEC 27001)
revision: R00
effective_date: 2026-04-23
status: Published
owner_role: technical_qms_maintainer
approver_role: management_representative
related_issue: "#289"
---
## 1. Purpose
Define the compact Information Security Management System (ISMS) procedure used to protect QMS records, product information, regulated software lifecycle evidence, supplier interfaces, and operational systems. This procedure aligns the GitHub-native QMS operating model with ISO/IEC 27001 while reusing the existing QMS controls for document control, competence, suppliers, infrastructure, audit, management review, CAPA, software lifecycle control, and record retention.

## 2. Scope
Applies to information assets used to create, approve, release, operate, support, or retain QMS and product lifecycle evidence, including GitHub repositories, issues, pull requests, Actions workflows, release artifacts, signing components, supplier systems, credentials, source code, configuration, product data, and security-relevant operational records.

## 3. Inputs
- Information security requirements from customers, regulators, contracts, and adopted standards
- Asset, supplier, infrastructure, and QMS tooling inventories
- Security events, vulnerabilities, access changes, audit findings, CAPAs, complaints, and post-market signals
- Product risk, software lifecycle, release, and change records

## 4. Outputs
- ISMS scope and asset/security-context records
- Information security risk assessment and treatment records
- Statement of Applicability (SoA)
- Security control implementation evidence
- Security incident, vulnerability, exception, and improvement records
- ISMS audit and management-review inputs

## 5. Roles and Responsibilities
| Role | Responsibilities |
|---|---|
| Management Representative | Approves ISMS scope, risk acceptance, SoA baseline, and management-review decisions. |
| Technical QMS Maintainer | Maintains GitHub-native security controls, QMS tooling security evidence, workflow protections, and access-control implementation records. |
| QA Lead | Confirms security controls remain compatible with QMS record integrity, release evidence, supplier controls, and regulated product lifecycle expectations. |
| Engineering Lead | Maintains product and software security controls, vulnerability handling, secure configuration, and release-impact assessment. |
| Auditor | Independently verifies ISMS conformance and effectiveness through internal audit. |

## 6. Procedure

### 6.1 ISMS Scope and Asset Context
1. Maintain the ISMS scope as the GitHub-native QMS, associated product/study repositories, signature tooling, controlled release assets, supplier systems that store or process QMS/product information, and supporting operational infrastructure.
2. Record information assets at a level sufficient to identify owner, repository or system, information type, confidentiality/integrity/availability expectations, supplier dependency, and control evidence location.
3. Product-specific security assets and runtime controls are maintained in the designated product repository and linked from the product dossier.

### 6.2 Information Security Risk Assessment and Treatment
1. Assess information security risks when introducing or changing repositories, tools, suppliers, workflows, runtime infrastructure, access models, signing components, or product security-relevant architecture.
2. Each risk record must identify the asset or process, threat or vulnerability, possible impact on confidentiality, integrity, availability, QMS record integrity, product safety, or regulatory evidence, existing controls, residual risk, owner, and treatment decision.
3. Treatment decisions are: mitigate, avoid, transfer, or accept. Risk acceptance requires Management Representative approval and an expiry or review trigger.
4. Product safety or clinical-impact security risks must also be reflected in product risk management under `SOP-018`.

### 6.3 Statement of Applicability and Control Operation
1. Maintain a Statement of Applicability that lists selected ISO/IEC 27001 Annex A controls, applicability rationale, implementation status, owner, and evidence reference.
2. Annex A control coverage may be implemented through existing QMS procedures where the control is already governed there, including:
   - document and record integrity through `SOP-001`
   - competence and awareness through `SOP-011`
   - supplier controls through `SOP-010`
   - infrastructure and access control through `SOP-017`
   - change and release control through `SOP-009`, `SOP-020`, and `WI-002`
   - validation of QMS tooling through `SOP-006`
   - audit, management review, CAPA, and metrics through `SOP-003`, `SOP-004`, `SOP-002`, and `SOP-016`
3. Controls that are not fully implemented through existing QMS procedures must have explicit implementation evidence or a risk-approved treatment plan.

### 6.4 GitHub-Native Security Control Baseline
1. GitHub is the primary system of record for ISMS-controlled repositories, issues, pull requests, workflow evidence, approvals, releases, and security-relevant change history.
2. Repository protections must preserve controlled review, signed approval, branch protection, release evidence, auditability, and least-privilege access.
3. Access to controlled repositories and signing components must be role-based, reviewed at least quarterly, and updated when personnel, supplier, or responsibility changes occur.
4. Secrets, tokens, signing keys, and automation credentials must be stored only in approved secret-management locations, rotated after suspected compromise, and removed when no longer required.

### 6.5 Security Events, Vulnerabilities, and Incidents
1. Security events are triaged for impact on QMS evidence, product safety, availability, confidentiality, integrity, supplier obligations, and reportability.
2. Confirmed incidents require an incident record identifying timeline, affected assets, containment, eradication, recovery, evidence integrity impact, customer/regulatory impact, and follow-up actions.
3. Product-affecting vulnerabilities or security incidents must be linked to change management, risk management, post-market surveillance, complaint handling, regulatory incident reporting, nonconformity, or CAPA as applicable.

### 6.6 Monitoring, Review, and Improvement
1. Monitor ISMS effectiveness through access-review completion, overdue security risk treatments, vulnerability response timeliness, supplier security review status, incident trends, audit findings, and failed or bypassed control signals.
2. Include ISMS inputs in governance review, internal audit planning, management review, and CAPA when thresholds are missed or recurring issues are detected.
3. Review ISMS scope, risk treatment, and SoA at least quarterly and whenever a material repository, supplier, product, workflow, infrastructure, or regulatory change occurs.

## 7. Required Records
- ISMS scope and asset/security-context record, using `records/isms/isms_register_template.yml` or an equivalent controlled register
- Information security risk assessment and treatment records, using `records/isms/isms_register_template.yml` or linked product/security risk records
- Statement of Applicability, using `records/isms/statement_of_applicability_template.yml` or an equivalent controlled SoA
- Access review records, maintained in the ISMS register unless a separate access review record is justified
- Security incident and vulnerability records, maintained in the ISMS register first and linked to CAPA/change/product records when required
- Security exception and risk acceptance records, maintained in the ISMS register unless a separate exception record is justified
- Evidence collection plans and evidence run reports, using `records/isms/evidence_collection_plan_template.md` and `records/isms/evidence_run_report_template.md`
- ISMS audit, management review, CAPA, and metric records

## 8. Traceability
| ISO/IEC 27001 Clause | Control in this SOP | Linked Artifact |
|---|---|---|
| 4 | Defines ISMS scope and interested-party/security-context interfaces. | ISMS scope record, asset/security-context record |
| 5 | Defines security responsibilities and management approval of scope, risk acceptance, and SoA. | Role matrix, governance review, management review |
| 6 | Defines information security risk assessment, treatment, objectives, and change planning. | Risk treatment records, SoA, security objectives |
| 7 | Defines competence, awareness, communication, and controlled documented information through existing QMS controls. | `SOP-001`, `SOP-011` |
| 8 | Defines operational planning, control operation, risk treatment execution, and change interfaces. | SoA evidence, change records, release records |
| 9 | Defines monitoring, internal audit, and management-review inputs. | `SOP-003`, `SOP-004`, `SOP-016` |
| 10 | Defines nonconformity, corrective action, and continual improvement interfaces. | `SOP-002`, CAPA records |

## 9. Related Controlled Documents
- QM-001 Quality Manual
- SOP-001 Document and Record Control
- SOP-002 Corrective and Preventive Action (CAPA)
- SOP-003 Internal Audit
- SOP-004 Management Review
- SOP-005 QMS Governance
- SOP-006 Software Validation (QMS Tools)
- SOP-009 Change Management
- SOP-010 Supplier and Purchasing Control
- SOP-011 Competence, Training, and Awareness
- SOP-016 Quality Metrics and Data Analysis
- SOP-017 Infrastructure and Maintenance Control
- SOP-018 Risk Management (ISO 14971)
- SOP-020 Software Lifecycle, Configuration, and Release Management (IEC 62304)
- WI-002 Configuration and Release Management Execution
- `records/isms/README.md`

## 10. Revision History
| Revision | Effective Date | Change Summary |
|---|---|---|
| R00 | 2026-04-23 | Initial release establishing the compact GitHub-native ISMS procedure, ISO/IEC 27001 traceability baseline, minimum ISMS record template set, and tool-neutral evidence collection plan/report templates. |
