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
intended_use_reference: "records/mdf/intended_use.md"
device_description_reference: "records/mdf/device_description.md"
classification_reference: "records/mdf/classification_decision.md"
traceability_summary_reference: "records/mdf/traceability_summary.md"
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

Example:

- Product: `ACME-GENERIC-SAMD`
- Repository: `github.com/acme/acme-generic-samd`
- Intended-use reference: `records/mdf/intended_use.md`
- Device description reference: `records/mdf/device_description.md`
- Classification reference: `records/mdf/classification_decision.md`
- Primary market scope: EU MDR first release, with Switzerland and US assessment tracked in linked regulatory decisions
- Notes: this index is the product-level source for locating current design, risk, V&V, release, and post-market dossier records

## 2. Current Controlled Artifact Index

Record one row per deliverable family or concrete controlled record set that belongs in the current product dossier.

| Deliverable Area | Current Record Path | Revision / Baseline | Status | Gate / Release | Primary Owner | Notes |
|---|---|---|---|---|---|---|
| Intended use and claims | `records/mdf/intended_use.md` | `R03` | approved | Gate 1 baseline | qa_lead | Controlled intended use, users, use environment, and claims |
| Device description | `records/mdf/device_description.md` | `R02` | approved | Gate 1 baseline | engineering_lead + qa_lead | Product overview, major subsystems, interfaces, variants, and accessories |
| Classification and pathway | `records/mdf/classification_decision.md` | `R01` | approved | Gate 1 baseline | qa_lead | Distinct from IEC 62304 software safety classification |
| Design and development plan | `records/design/design_development_plan.md` | `R01` | approved | Gate 1 baseline | engineering_lead | Lifecycle model, gates, and linked plans |
| User needs | `records/design/user_needs.md` | `R02` | approved | Gate 1 baseline | product_manager | Needs, use context, and critical user outcomes |
| System and software requirements | `records/design/system_requirements_spec.md` | `R04` | approved | Gate 1 baseline | engineering_lead | Testable functional, safety, security, and usability requirements |
| Software architecture | `records/design/software_architecture_spec.md` | `R03` | approved | Gate 2 | engineering_lead | Components, interfaces, external dependencies, and deployment model |
| Design traceability matrix | `records/design/design_traceability_matrix.md` | `R02` | approved | Gate 2 / Gate 3 | engineering_lead | Links needs, requirements, risks, tests, and released baselines |
| Risk management plan | `records/risk/risk_management_plan.md` | `R01` | approved | Gate 1 baseline | qa_lead | Defines methods, scoring, review cadence, and responsibilities |
| Risk file and reviews | `records/risk/risk_register.md`, `records/risk/risk_management_review.md` | `R05` / `R02` | current | Gate 2 / Gate 3 | engineering_lead + qa_lead | Current hazard, failure-mode, and residual-risk state |
| Verification and validation | `records/verification_validation/vv_plan.md`, `records/verification_validation/vv_report.md` | `R02` / `R01` | approved | Gate 2 / Gate 3 | qa_lead + engineering_lead | Formal campaign planning, execution, and release recommendation |
| Release records | `records/configuration/release_plan.md`, `records/configuration/release_baseline_manifest.md`, `records/configuration/final_release_decision.md` | `R02` / `R01` / `R01` | approved | Gate 2 / Gate 3 | engineering_lead + qa_lead | Candidate scope, released baseline, and final authorization |
| Declaration of conformity | `records/mdf/declaration_of_conformity.md` | `R00` | draft until placed on market | release package | qa_lead | Signed only for the placed-on-market configuration and jurisdictions in scope |
| Traceability summary | `records/mdf/traceability_summary.md` | `R01` | approved | Gate 3 | qa_lead | High-level dossier completeness and linkage summary |
| Post-market and quality follow-up links | `records/feedback/`, `records/pms/`, `records/incidents/`, `records/capas/` | current | ongoing | post-release | qa_lead | Linked lifecycle records, not Gate 1 baseline artifacts |

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
