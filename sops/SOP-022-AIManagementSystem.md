---
sop_id: SOP-022
title: AI Management System (ISO/IEC 42001)
revision: R00
effective_date: 2026-04-25
status: Published
owner_role: qa_lead
approver_role: management_representative
related_issue: "#291"
---
## 1. Purpose
Define the AI Management System (AIMS) procedure used to govern AI components inside ACME medical-device software so that AI-related accountability, lifecycle, risk, impact, and post-market interfaces are controlled. This procedure aligns the GitHub-native QMS operating model with ISO/IEC 42001 while reusing the existing QMS controls for document control, governance, design, change, supplier control, competence, audit, management review, CAPA, software lifecycle, product risk, and metrics.

## 2. Scope
Applies to AI components, models, training data, inference behavior, and AI lifecycle decisions used inside ACME medical-device software products. AI tooling used to author or operate the QMS itself (for example authoring assistants, validation aids) is governed under existing supplier control, tooling validation, and document control procedures and is out of scope for the AIMS unless the same tooling becomes part of a released product.

## 3. Inputs
- AI-related requirements from intended use, users, regulators, customers, and adopted standards
- Product AI inventory, model and data sources, and AI-bearing supplier interfaces
- AI risks, AI impact assessments, change requests, anomalies, complaints, and post-market signals affecting AI behavior
- Product design, software lifecycle, release, and risk records

## 4. Outputs
- AIMS scope, AI system inventory, and AI lifecycle context records
- AI risk assessment and treatment records
- AI system impact assessment records
- Statement of Applicability for ISO/IEC 42001 Annex A
- AI control implementation evidence
- AI incident, anomaly, exception, and improvement records
- AIMS audit and management-review inputs

## 5. Roles and Responsibilities
| Role | Responsibilities |
|---|---|
| Management Representative | Approves AIMS scope, AI policy, AI risk acceptance, SoA baseline, and management-review decisions. |
| QA Lead | Maintains the AIMS procedure, AIMS register integrity, SoA control of changes, AI internal-audit scope, and AI-related document control. |
| Engineering Lead | Maintains AI lifecycle, model and data control, AI verification and monitoring evidence, and product-level AI risk and change implementation. |
| Auditor | Independently verifies AIMS conformance and effectiveness through internal audit. |

## 6. Procedure

### 6.1 AIMS Scope and AI System Context
1. Maintain the AIMS scope as the AI components inside released or candidate ACME medical-device software products and the supporting AI-related supplier interfaces.
2. Record AI systems at a level sufficient to identify product, owner, model and data sources, intended AI function, AI lifecycle stage, classification, third-party dependencies, and evidence location.
3. Product-specific AI system records and runtime monitoring evidence are maintained in the designated product repository and linked from the product dossier.

### 6.2 AI Risk Assessment and Treatment
1. Assess AI risks when introducing or changing AI components, models, training data sources, deployment configurations, AI suppliers, or runtime monitoring.
2. Each AI risk record must identify the AI system, threat or failure mode, possible impact on intended use, safety, performance, fairness, privacy, and information integrity, existing controls, residual risk, owner, and treatment decision.
3. Treatment decisions are: mitigate, avoid, transfer, or accept. Risk acceptance requires Management Representative approval and an expiry or review trigger.
4. AI risks with product safety or clinical impact must also be reflected in product risk management under `SOP-018`.

### 6.3 AI System Impact Assessment
1. Perform an AI system impact assessment whenever a new AI system is introduced, an AI system materially changes intended use, users, deployment context, training data, or model behavior, or external feedback indicates a potential impact change.
2. The impact assessment records affected stakeholders, foreseeable benefits and adverse effects, fairness and accessibility considerations, transparency obligations, and residual concerns to feed AI risk treatment and product risk management.
3. The impact assessment is a controlled record in the AIMS register and is reviewed during management review and before each release that changes AI behavior.

### 6.4 Statement of Applicability and Control Operation
1. Maintain a Statement of Applicability that lists selected ISO/IEC 42001 Annex A controls, applicability rationale, implementation status, owner, and evidence reference.
2. Annex A control coverage may be implemented through existing QMS procedures where the control is already governed there, including:
   - document and record integrity through `SOP-001`
   - competence and awareness through `SOP-011`
   - supplier and third-party AI provider controls through `SOP-010`
   - change and release control through `SOP-009`, `SOP-020`, and `WI-002`
   - validation of QMS tooling through `SOP-006`
   - audit, management review, CAPA, and metrics through `SOP-003`, `SOP-004`, `SOP-002`, and `SOP-016`
   - design control and verification through `SOP-008`
   - product risk management through `SOP-018`
3. Controls that are not fully implemented through existing QMS procedures must have explicit implementation evidence or a risk-approved treatment plan.

### 6.5 AI Lifecycle, Data, and Information Controls
1. AI components follow the controlled software lifecycle in `SOP-020`, with AI-specific outputs: model and data provenance, training and evaluation evidence, acceptance criteria, and pre-release performance baseline.
2. Training, validation, and evaluation data sources are recorded with origin, licensing, representativeness rationale, and retention or deletion controls.
3. Information about AI systems provided to users (for example AI behavior summary, limitations, and oversight expectations) is included in product-accompanying information and labeling under `SOP-007` and design output review.

### 6.6 AI Events, Anomalies, and Improvement
1. AI events are triaged for impact on intended use, safety, performance, user understanding, fairness, privacy, and reportability.
2. Confirmed AI anomalies require an event record identifying timeline, affected AI systems, containment, model or data correction, evidence integrity impact, customer or regulatory impact, and follow-up actions.
3. Product-affecting AI anomalies must be linked to change management, product risk management, post-market surveillance, complaint handling, regulatory incident reporting, nonconformity, or CAPA as applicable.

### 6.7 Monitoring, Review, and Improvement
1. Monitor AIMS effectiveness through AI risk treatment timeliness, impact assessment currency, AI supplier review status, AI anomaly trends, monitoring or drift signals, audit findings, and bypassed-control signals.
2. Include AIMS inputs in governance review, internal audit planning, management review, and CAPA when thresholds are missed or recurring issues are detected.
3. Review AIMS scope, AI risk treatment, and SoA at least quarterly and whenever a material AI system, model, data, supplier, deployment, or regulatory change occurs.

## 7. Required Records
- AIMS scope, AI system inventory, AI risks, AI impact assessments, AI events, exceptions, and reviews, using `records/aims/aims_register_template.yml` or an equivalent controlled register
- Statement of Applicability, using `records/aims/statement_of_applicability_template.yml` or an equivalent controlled SoA
- AI lifecycle, model and data, verification, and release-impact records, maintained under `SOP-008`, `SOP-020`, and `WI-001`/`WI-002`
- Product safety or clinical-impact AI risks, maintained under `SOP-018`
- AIMS audit, management review, CAPA, and metric records

## 8. Traceability
| ISO/IEC 42001 Clause | Control in this SOP | Linked Artifact |
|---|---|---|
| 4 | Defines AIMS scope and AI system context interfaces. | AIMS scope record, AI system inventory |
| 5 | Defines AI policy, AI roles, and management approval of scope, risk acceptance, and SoA. | Role matrix, governance review, management review |
| 6 | Defines AI risk assessment, AI system impact assessment, treatment, and AI objectives. | AI risk records, AI impact assessment records, SoA |
| 7 | Defines AI competence, awareness, communication, and controlled documented information through existing QMS controls. | `SOP-001`, `SOP-011` |
| 8 | Defines AI lifecycle, data, information for users, and operational change interfaces. | `SOP-008`, `SOP-009`, `SOP-020`, `WI-001`, `WI-002` |
| 9 | Defines monitoring, internal audit, and management-review inputs for the AIMS. | `SOP-003`, `SOP-004`, `SOP-016` |
| 10 | Defines nonconformity, corrective action, and continual improvement interfaces. | `SOP-002`, CAPA records |
| Annex A | Defines applicable AI controls operationalized through this SOP and the SoA. | `records/aims/statement_of_applicability_template.yml` |

## 9. Related Controlled Documents
- QM-001 Quality Manual
- SOP-001 Document and Record Control
- SOP-002 Corrective and Preventive Action (CAPA)
- SOP-003 Internal Audit
- SOP-004 Management Review
- SOP-005 QMS Governance
- SOP-006 Software Validation (QMS Tools)
- SOP-008 Design and Development Control
- SOP-009 Change Management
- SOP-010 Supplier and Purchasing Control
- SOP-011 Competence, Training, and Awareness
- SOP-016 Quality Metrics and Data Analysis
- SOP-018 Risk Management (ISO 14971)
- SOP-020 Software Lifecycle, Configuration, and Release Management (IEC 62304)
- WI-001 Verification and Validation Execution
- WI-002 Configuration and Release Management Execution
- `records/aims/README.md`

## 10. Revision History
| Revision | Effective Date | Change Summary |
|---|---|---|
| R00 | 2026-04-25 | Initial release establishing the GitHub-native AIMS procedure, ISO/IEC 42001 traceability baseline, AIMS register and Statement of Applicability templates, and AI lifecycle/impact/event interfaces to existing QMS controls. |
