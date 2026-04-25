---
sop_id: SOP-007
title: Medical Device File Control
revision: R08
effective_date: 2026-04-25
status: Published
owner_role: management_representative
approver_role: qa_lead
related_issue: "#3"
---
## 1. Purpose
Define structure, ownership, and control of product-specific medical device files (MDF) as the technical documentation set required for ACME software products under applicable medical device regulations, including EU MDR Annex II/III and equivalent design-history-file expectations.

## 2. Scope
Applies to each product that qualifies as medical device software under applicable regulatory requirements. Regulatory applicability, including jurisdictions and frameworks such as EU MDR, UK MDR/UKCA, Swiss MedDO, US FDA regulations, and MDSAP-participating markets, is defined and maintained in the regulatory scope baseline. Product MDF records are maintained in designated product or study repositories, not in `dearauditor-qms-baseline`.

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
| Engineering Lead | Maintains technical artifact currency and release traceability references. |
| QA Lead | Verifies file control and traceability quality. |

## 6. Procedure

### 6.1 MDF Structure
The MDF shall reflect the configuration of each released product version and remain traceable to the corresponding approved release baseline.

Each product MDF must include at minimum:
1. Intended use, claims, users, and contraindications
2. Qualification/classification rationale by jurisdiction
3. Requirements and architecture references
4. Risk management file references
5. Verification/validation summary and traceability
6. Release history and post-market references
7. Repository path/structure that identifies where controlled MDF records are maintained
8. Clinical or performance evaluation references where applicable
9. Accompanying information, including instructions for use, user-facing labeling, and technical description, controlled per `records/mdf/accompanying_information_template.md` or an equivalent product-specific record
10. Usability engineering file references where applicable
11. Cybersecurity and data protection considerations where applicable
12. Retirement, decommissioning, or disposal record reference for the released product where applicable, controlled under `SOP-020`

### 6.2 Product-Specific Governance Rules
1. Company QMS is generic; product-specific intended use/classification is never inferred from company-level SOPs.
2. Each product must define its own infrastructure and operational controls in product architecture documentation.

### 6.3 Change Control
1. MDF-impacting changes must be assessed in product change records.
2. Regulatory-impacting changes require documented pathway reassessment.
3. MDF index must be updated before release in the designated record repository.
4. GitHub issue/PR workflow and post-merge signature attestation are used as the approval evidence model for released MDF records.
5. Product release shall not proceed unless the MDF is complete and current, including documented requirements traceability, risk-management evidence with residual risk acceptability, and verification/validation evidence demonstrating conformity to intended use and applicable regulatory requirements.

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
| R01 | 2026-03-05 | Clarified that product MDF records are maintained in designated product/study repositories and aligned release evidence model with GitHub PR plus post-merge signature attestation. |
| R02 | 2026-03-07 | Normalized responsibility labels to the controlled small-team role model and clarified engineering ownership of MDF technical traceability. |
| R03 | 2026-03-07 | Renamed the accountable engineering role to `engineering_lead` in the simplified role taxonomy. |
| R04 | 2026-03-07 | Removed overly specific signature-regulation terminology from the MDF approval evidence wording. |
| R05 | 2026-03-10 | Updated the upstream baseline repository naming reference used for product MDF record separation guidance. |
| R06 | 2026-03-18 | Removed top-table standards clause metadata; normative references remain in the Traceability section. |
| R07 | 2026-03-25 | Expanded MDF scope and minimum content to cover technical-documentation expectations, release-baseline traceability, and release-readiness evidence. |
| R08 | 2026-04-25 | Made accompanying information (IFU, user-facing labeling, technical description) and product retirement/decommissioning explicit minimum MDF content with controlled template references for IEC 82304-1 clauses 7 and 8. |
