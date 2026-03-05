---
qm_id: QM-001
title: Quality Manual
revision: R00
effective_date: 2026-03-05
status: Published
owner_role: qa_lead
approver_role: management_representative
standards:
  - ISO 13485:2016
  - ISO 14971:2019
  - IEC 62366-1:2015+A1:2020
---

## 1. Purpose
Define the complete ACME GmbH Quality Management System (QMS) structure, including company context, scope boundaries, justified non-applications, and ISO 13485 traceability to controlled SOPs and WIs.

## 2. Company Context
- Legal entity: `ACME GmbH`
- Registered office: `Paradeplatz 8, 8001 Zurich, Switzerland`
- Operating model: `Remote-first`
- Regulatory role: `Manufacturer of healthcare software products`
- Product intent policy: `No single intended medical purpose at company level; each product defines intended use/classification in product dossier.`

## 3. QMS Scope and Boundaries

### 3.1 Included Activities
The QMS covers the full lifecycle of healthcare software products:
- QMS governance and document control
- Design and development planning/outputs/reviews
- Verification and validation (V&V) planning and execution
- Configuration management and release/change control
- Supplier qualification, purchasing, and supplier re-evaluation
- Risk management (including cybersecurity risk)
- Usability engineering for safety-related user interfaces
- Feedback, complaint handling, PMS, and incident reporting
- CAPA, nonconformity control, internal audit, metrics, and management review
- Personnel competence/training and infrastructure governance

### 3.2 Justified Non-Applications / Exclusions
The following ISO 13485 requirements are treated as non-applicable at company baseline unless required by product dossier:
- `7.5.2` (cleanliness of product): no physical product manufacturing
- `7.5.3.2.2` (installation activities): no on-site installation by default for cloud/SaaS model
- `7.5.5` (sterile medical device requirements): no sterile products
- `7.5.7` (sterilization process validation): no sterilization processes
- `7.5.8` (implantable device identification records): no implantable devices

Any product-specific exception to the above must be declared in product dossier and activates the corresponding controls.

## 4. Process Architecture and Controlled Documents

| QM Chapter | Topic | Primary SOP(s) | Primary WI(s) |
|---|---|---|---|
| QM-01 | QMS context and governance | SOP-005 | WI-001 |
| QM-02 | Documented information control | SOP-001 | WI-001 |
| QM-03 | Management commitment/objectives/review | SOP-004, SOP-016 | WI-008 |
| QM-04 | Competence and awareness | SOP-011 | WI-008 |
| QM-05 | Design and development controls | SOP-008, SOP-007 | WI-002, WI-003 |
| QM-06 | Purchasing and outsourced process control | SOP-010 | WI-004 |
| QM-07 | Risk and cybersecurity lifecycle control | SOP-018 | WI-005 |
| QM-08 | Feedback, complaints, PMS, incidents | SOP-012, SOP-013, SOP-014 | WI-006 |
| QM-09 | Nonconformity and CAPA | SOP-015, SOP-002 | WI-007 |

## 5. ISO 13485 Clause Traceability

| ISO 13485 Clause(s) | Manual Chapter | Implementing SOP(s) | Supporting WI(s) |
|---|---|---|---|
| 4.1, 4.2.1, 4.2.2 | QM-01 | SOP-005 | WI-001 |
| 4.2.4, 4.2.5 | QM-02 | SOP-001 | WI-001 |
| 5.1, 5.3, 5.4, 5.5, 5.6 | QM-03, QM-04 | SOP-004, SOP-005, SOP-011, SOP-016 | WI-008 |
| 6.2, 6.3, 6.4 | QM-04 | SOP-011, SOP-017 | WI-008 |
| 7.1, 7.3 | QM-05 | SOP-008, SOP-007, SOP-009 | WI-002, WI-003 |
| 7.4 | QM-06 | SOP-010 | WI-004 |
| 7.5, 7.6 | QM-05/QM-06 (as applicable) | SOP-008, SOP-010, SOP-017 | WI-002, WI-003, WI-004 |
| 8.2.1, 8.2.2, 8.2.3, 8.2.4, 8.2.6 | QM-08 | SOP-003, SOP-012, SOP-013, SOP-014, SOP-016 | WI-006 |
| 8.3, 8.5.1, 8.5.2, 8.5.3 | QM-09 | SOP-015, SOP-002 | WI-007 |

Detailed section-level traceability is maintained in `matrices/quality_manual_traceability.yml`.

## 6. Regulatory and Product-Dossier Linkage
- Regulatory baseline and market scope: `matrices/regulatory_market_scope.yml`
- Company profile baseline: `matrices/company_profile.yml`
- Product intended use/classification and dossier content: maintained in designated product repositories

## 7. Revision History
| Revision | Effective Date | Change Summary |
|---|---|---|
| R00 | 2026-03-05 | Initial complete quality manual baseline: company context, included/excluded scope, and ISO 13485 traceability to SOP/WI controls. |
