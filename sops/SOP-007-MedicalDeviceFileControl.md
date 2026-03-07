---
sop_id: SOP-007
title: Medical Device File Control
revision: R02
effective_date: 2026-03-07
status: Published
owner_role: management_representative
approver_role: qa_lead
iso_13485_clauses:
  - 4.2.3
related_issue: "#3"
---

## 1. Purpose
Define structure, ownership, and control of product-specific medical device files (MDF) for ACME software products.

## 2. Scope
Applies to each product that may be regulated as medical device software in Switzerland, EU, or US markets. Product MDF records are maintained in designated product/study repositories, not in `qms-lite`.

## 3. Inputs
- Product intended use and claims
- Classification rationale and regulatory pathway
- Design, risk, verification/validation, and post-market artifacts

## 4. Outputs
- Controlled product MDF index and current artifact set
- Traceable linkage between requirements, risks, tests, releases, and post-market records

## 5. Roles and Responsibilities
| Role | Responsibilities |
|---|---|
| Management Representative | Ensures MDF completeness and regulatory coherence. |
| Engineering Owner | Maintains technical artifact currency and release traceability references. |
| QA Lead | Verifies file control and traceability quality. |

## 6. Procedure

### 6.1 MDF Structure
Each product MDF must include at minimum:
1. Intended use, claims, users, and contraindications
2. Qualification/classification rationale by jurisdiction
3. Requirements and architecture references
4. Risk management file references
5. Verification/validation summary and traceability
6. Release history and post-market references
7. Repository path/structure that identifies where controlled MDF records are maintained

### 6.2 Product-Specific Governance Rules
1. Company QMS is generic; product-specific intended use/classification is never inferred from company-level SOPs.
2. Each product must define its own infrastructure and operational controls in product architecture documentation.

### 6.3 Change Control
1. MDF-impacting changes must be assessed in product change records.
2. Regulatory-impacting changes require documented pathway reassessment.
3. MDF index must be updated before release in the designated record repository.
4. GitHub issue/PR workflow and post-merge Part 11 signature attestation are used as the approval evidence model for released MDF records.

### 6.4 Periodic Review
1. Review MDF completeness at least quarterly and before major release.
2. Resolve missing/obsolete artifact references via CAPA or change control.

## 7. Required Records
- Product MDF index and change history in the designated product/study repository
- Classification and regulatory decision records
- Traceability summary evidence

## 8. Traceability
| ISO 13485 Clause | Control in this SOP |
|---|---|
| 4.2.3 | Defines content and control expectations for the medical device file per product. |

## 9. Related Controlled Documents
- SOP-008 Design and Development Control
- SOP-009 Change Management
- SOP-014 Post-Market Surveillance

## 10. Revision History
| Revision | Effective Date | Change Summary |
|---|---|---|
| R00 | 2026-03-02 | Initial full release. |
| R01 | 2026-03-05 | Clarified that product MDF records are maintained in designated product/study repositories and aligned release evidence model with GitHub PR plus post-merge Part 11 attestation. |
| R02 | 2026-03-07 | Normalized responsibility labels to the controlled small-team role model and clarified engineering ownership of MDF technical traceability. |
