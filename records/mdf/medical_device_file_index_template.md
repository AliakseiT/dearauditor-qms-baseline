---
record_type: medical_device_file_index
mdf_id: "MDF-<product>-<yyyy-mm-dd>"
product_id: ""
product_name: ""
repository: ""
primary_markets:
  - EU
  - CH
  - US
approval:
  meaning_of_signature: "Approved Medical Device File Index"
  signer_roles:
    - management_representative
    - engineering_lead
---

# Medical Device File Index Template

This template shows one workable Markdown-first index for the product medical device file (`MDF`).

It can serve as the GitHub-native index for the product dossier / technical documentation set and, where a team uses the term, the design history file style artifact log.

You may rewrite the sections or tables to match the product repository, as long as the current controlled artifact set, revision state, and ownership remain clear.

Replace the example text below with product-specific content before approval.

## 1. Purpose and Scope

The medical device file index is the product-level index to the current technical documentation set. It identifies, for one product, the controlled artifacts that together form the medical device file required by ISO 13485 4.2.3 and the technical documentation expected under applicable medical device regulations (for example EU MDR Annex II/III).

The index is not the source of any individual artifact. Each row points to the current controlled record that lives elsewhere in the product repository. The index is updated whenever the underlying record set changes so that a reader, auditor, or release reviewer can locate the current state of the dossier from a single entry point.

Example:

- Product: `ACME-GENERIC-SAMD`
- Repository: `github.com/acme/acme-generic-samd`
- Primary market scope: EU MDR first release, with Switzerland and US assessment tracked in linked regulatory decisions
- Notes: the controlled artifact references that locate the current intended use, device description, classification, and traceability summary records are listed in Section 2 rather than duplicated in the YAML header

## 2. Current Controlled Artifact Index

Record one row per deliverable family or concrete controlled record set that belongs in the current product dossier.

| # | Dossier Area | Current Record Path | Revision / Baseline | Status | Gate / Release | Primary Owner | Notes |
|---|---|---|---|---|---|---|---|
| 1 | Intended use and claims | `records/mdf/intended_use.md` | `R03` | approved | Gate 1 baseline | qa_lead | Controlled intended use, users, use environment, and claims |
| 2 | Device description | `records/mdf/device_description.md` | `R02` | approved | Gate 1 baseline | engineering_lead + qa_lead | Product overview, major subsystems, interfaces, variants, and accessories |
| 3 | Classification and pathway | `records/mdf/classification_decision.md` | `R01` | approved | Gate 1 baseline | qa_lead | Distinct from IEC 62304 software safety classification |
| 4 | Design and development plan | `records/design/design_development_plan.md` | `R01` | approved | Gate 1 baseline | engineering_lead | Lifecycle model, gates, and linked plans |
| 5 | User needs | `records/design/user_needs.md` | `R02` | approved | Gate 1 baseline | product_manager | Needs, use context, and critical user outcomes |
| 6 | System and software requirements | `records/design/system_requirements_spec.md` | `R04` | approved | Gate 1 baseline | engineering_lead | Testable functional, safety, security, and usability requirements |
| 7 | Software architecture | `records/design/software_architecture_spec.md` | `R03` | approved | Gate 2 | engineering_lead | Components, interfaces, external dependencies, and deployment model |
| 8 | Design traceability matrix | `records/design/design_traceability_matrix.md` | `R02` | approved | Gate 2 / Gate 3 | engineering_lead | Links needs, requirements, risks, tests, and released baselines |
| 9 | Risk management plan | `records/risk/risk_management_plan.md` | `R01` | approved | Gate 1 baseline | qa_lead | Defines methods, scoring, review cadence, and responsibilities |
| 10 | Risk file and reviews | `records/risk/risk_register.md`, `records/risk/risk_management_review.md` | `R05` / `R02` | current | Gate 2 / Gate 3 | engineering_lead + qa_lead | Current hazard, failure-mode, and residual-risk state |
| 11 | Verification and validation | `records/verification_validation/vv_plan.md`, `records/verification_validation/vv_report.md` | `R02` / `R01` | approved | Gate 2 / Gate 3 | qa_lead + engineering_lead | Formal campaign planning, execution, and release recommendation |
| 12 | Release records | `records/configuration/release_plan.md`, `records/configuration/release_baseline_manifest.md`, `records/configuration/final_release_decision.md` | `R02` / `R01` / `R01` | approved | Gate 2 / Gate 3 | engineering_lead + qa_lead | Candidate scope, released baseline, and final authorization |
| 13 | Declaration of conformity | `records/mdf/declaration_of_conformity.md` | `R00` | draft until placed on market | release package | qa_lead | Signed only for the placed-on-market configuration and jurisdictions in scope |
| 14 | Traceability summary | `records/mdf/traceability_summary.md` | `R01` | approved | Gate 3 | qa_lead | High-level dossier completeness and linkage summary |
| 15 | Post-market and quality follow-up links | `records/feedback/`, `records/pms/`, `records/incidents/`, `records/capas/` | current | ongoing | post-release | qa_lead | Linked lifecycle records, not Gate 1 baseline artifacts |

## 3. Release and Change History

Use this table to keep the dossier index aligned with released baselines and major controlled revisions.

| Release / Change | Date | PR / Issue | Main Records Updated | Notes |
|---|---|---|---|---|
| `v1.0.0` | `YYYY-MM-DD` | `#123` | design plan, requirements, architecture, risk file, V&V report, release records, DoC | Initial regulated release |
| `v1.0.1` | `YYYY-MM-DD` | `#145` | risk review, regression evidence, release baseline, release decision | Post-release corrective patch |

## 4. Periodic Completeness Review

Example:

- Last completeness review date: `YYYY-MM-DD`
- Reviewer roles: management_representative, engineering_lead, qa_lead
- Missing or stale records: none | list here
- Records requiring update before next release: none | list here
- Follow-up issue or CAPA reference: `#123` or `N/A`

## 5. Linked Post-Market and Quality Follow-Up

Example:

- Complaint log reference: `records/feedback/complaint_case_log.md`
- PMS plan/reference: `records/pms/pms_plan.md`
- Incident assessment reference: `records/incidents/reportability_assessment.md`
- CAPA / nonconformity references: `records/capas/CAPA-001.md`, `records/nonconformity/NC-001.md`

## 6. Approval Record

Example:

- Index approved for current release baseline: yes
- Approval date: `YYYY-MM-DD`
- Linked approving PR: `#123`
- Notes: approval confirms the index points to the current controlled artifact set for the released configuration
