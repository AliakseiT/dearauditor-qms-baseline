---
qm_id: QM-001
title: Quality Manual
revision: R02
effective_date: 2026-03-25
status: Published
owner_role: qa_lead
approver_role: management_representative
iso_13485_clauses:
  - 4.1.1
  - 4.1.2
  - 4.1.3
  - 4.2.1
  - 4.2.2
  - 5.1
  - 5.2
  - 5.3
  - 5.4.1
  - 5.4.2
related_issue: "#1"
---

## 1. Purpose
Describe why ACME GmbH maintains a Quality Management System (QMS), what the QMS covers, how the controlled document set fits together, and how quality objectives are translated into operating procedures and records.

## 2. Scope
Applies to the ACME GmbH QMS for healthcare software products, including products that may qualify as software as a medical device (SaMD), and to the company-level governance baseline maintained in this upstream baseline repository.

## 3. Organization and Context
- Legal Entity: ACME GmbH
- Registered Address: Paradeplatz 8, 8001 Zurich, Switzerland
- Operating Model: Remote-first company
- Regulatory Role: Manufacturer
- Product Type: Healthcare software products; some products may qualify as SaMD
- Intended Use Policy: Each product must define intended use, indications, claims, and regulatory classification before development and release under controlled procedures.
- Infrastructure Policy: Each product must define and approve its infrastructure architecture and controls against applicable security, availability, and traceability requirements within the product dossier.

## 4. QMS Intent and Quality Policy
ACME maintains this QMS to:
- ensure consistent compliance with ISO 13485 and applicable regulatory requirements
- apply IEC 62304 lifecycle and maintenance controls to regulated software
- apply ISO 14971 risk management across the software lifecycle, including cybersecurity-related harms
- apply IEC 62366-1 usability engineering for safety-related user interfaces
- maintain product safety and performance through controlled lifecycle processes
- retain objective evidence and traceability for quality decisions

Quality Policy:
> ACME GmbH commits to delivering safe and effective healthcare software through a risk-based, evidence-driven quality management system and continuous improvement.

The approved policy baseline is maintained in `matrices/company_profile.yml`.
The QMS uses a risk-based approach in which processes are defined, measured, and continuously improved.

## 5. Quality Objectives
The quality objective framework is maintained in `matrices/company_profile.yml` and is reviewed through management review. The current company-level objectives are to:
- merge controlled pull requests only after required approval on the current head commit
- release only baselines with complete V&V, risk, and release traceability evidence
- close critical quality actions on time
- complete required controlled-document training on time
- maintain management review cadence
- ensure products perform against defined performance criteria and complaint thresholds

Each objective must have an accountable role, a measurable indicator, and a target threshold.

## 6. QMS Structure and Process Interaction
The QMS is structured as:
1. `QM-001` Quality Manual: purpose, scope, policy, objectives, and system architecture.
2. `SOP-005` QMS Governance: governance cadence, ownership, document hierarchy, communication, and governance interfaces.
3. Operational SOPs: controlled procedures for document control, CAPA, audit, management review, training, design control, change control, suppliers, feedback, incident, PMS, nonconformity, metrics, infrastructure, risk, usability, and software lifecycle control.
4. WIs: detailed execution instructions for selected lifecycle activities.
5. Matrices and records: traceability baselines, role/training assignments, and objective evidence.

High-level process interaction:

| QMS Area | Primary Controlled Documents | Main Outputs |
|---|---|---|
| QMS framing and policy | `QM-001`, `SOP-005`, `SOP-004`, `SOP-016` | Scope statement, policy, objectives, management review decisions |
| Document and training control | `SOP-001`, `SOP-011` | Controlled revisions, training assignments, training logs |
| Product lifecycle control | `SOP-007`, `SOP-008`, `SOP-009`, `SOP-020`, `WI-001`, `WI-002` | Product dossier, development plans, release baselines, V&V evidence |
| Risk and usability | `SOP-018`, `SOP-019` | Risk file, usability file, residual risk decisions |
| Suppliers and post-market processes | `SOP-010`, `SOP-012`, `SOP-013`, `SOP-014`, `SOP-015` | Supplier approvals, complaint/PMS/incidents, nonconformity handling |
| Improvement and oversight | `SOP-002`, `SOP-003`, `SOP-004`, `SOP-016` | CAPAs, audits, reviews, metrics and improvement actions |

## 7. Roles and Responsibility Overview
| Role | System-Level Responsibility |
|---|---|
| Management Representative | Acts for top management within the small-team model, approves the quality policy/objective baseline, and confirms QMS adequacy and effectiveness. |
| QA Lead | Maintains the controlled QMS baseline, verifies process interaction completeness, and drives quality-system improvements. |
| Engineering Lead | Owns lifecycle planning, technical release readiness, and engineering process implementation. |
| Regulatory Lead | Owns regulatory pathway, dossier completeness, and regulated lifecycle oversight. |
| Usability Lead | Owns safety-related usability engineering inputs and file completeness for user-facing products. |
| Technical QMS Maintainer | Maintains quality tooling, automation, and technical QMS infrastructure under controlled change. |
| Auditor | Verifies conformance and effectiveness of selected QMS processes and must remain independent of the activities being audited. |

Detailed governance responsibilities are defined in `sops/SOP-005-QMSGovernance.md`.

## 8. Standards and Regulatory Framework
Regulatory applicability is maintained in `matrices/regulatory_market_scope.yml`. The QMS baseline is aligned to:
- ISO 13485:2016 / EVS-EN ISO 13485:2016+A11:2021
- IEC 62304:2006+A1:2015
- ISO 14971:2019 / EVS-EN ISO 14971:2019+A11:2021
- IEC 62366-1:2015+A1:2020

Jurisdiction references currently maintained in the regulatory scope baseline include:
- Switzerland: MedDO, including software classification references
- European Union: MDR and MDCG software guidance
- United States: FD&C Act device definitions, section 520(o), FDA software guidance, and 21 CFR Part 820

## 9. Document Architecture and Record Model
Document-control rules are defined in `SOP-001`, governance rules in `SOP-005`, and role-specific training expectations in `SOP-011` plus `matrices/training_matrix.yml`.

The record model is:
- company-level QMS documents and selected quality records are maintained in a controlled central repository that constitutes the authoritative QMS baseline
- standardized templates and controlled document structures are published from this repository to support consistent implementation across products and studies
- product- and study-specific records are maintained in designated controlled repositories and linked to the relevant medical device file and release evidence

QMS tooling and validation baselines are maintained in:
- `matrices/qms_tooling_inventory.yml`
- `records/validation/qms-tools/github-validation-record.md`

## 10. Traceability
| ISO 13485 Clause | Quality Manual Coverage | Linked Baseline |
|---|---|---|
| 4.1, 4.2.1, 4.2.2 | Defines QMS scope, structure, and interaction model | `matrices/quality_manual_traceability.yml` |
| 5.1, 5.3 | Defines management commitment and quality policy context | `matrices/company_profile.yml`, `sops/SOP-004-ManagementReview.md` |
| 5.4.1, 5.4.2 | Defines quality objectives and planning context | `matrices/company_profile.yml`, `sops/SOP-016-QualityMetricsAndDataAnalysis.md` |
| 5.5 | Defines system-level responsibilities and communication overview | `sops/SOP-005-QMSGovernance.md`, `sops/SOP-011-CompetenceTrainingAndAwareness.md` |

## 11. Related Controlled Documents
- SOP-001 Document and Record Control
- SOP-004 Management Review
- SOP-005 QMS Governance
- SOP-011 Competence, Training, and Awareness
- SOP-016 Quality Metrics and Data Analysis
- `matrices/company_profile.yml`
- `matrices/quality_manual_traceability.yml`
- `matrices/regulatory_market_scope.yml`

## 12. Revision History
| Revision | Effective Date | Change Summary |
|---|---|---|
| R00 | 2026-03-08 | Initial release split from SOP-005 so the QMS intent, scope, policy, objectives, and process structure are available as a standalone Quality Manual. |
| R01 | 2026-03-10 | Updated public upstream baseline naming, licensing, and repository references for open-source publication. |
| R02 | 2026-03-25 | Tightened company-level scope wording, added risk-based quality framing and product performance objectives, and clarified auditor independence plus repository-of-record language. |
