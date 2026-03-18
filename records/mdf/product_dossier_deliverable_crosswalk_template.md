# Product Dossier / MDF Deliverable Crosswalk Template

This template is a controlled crosswalk for a product-specific dossier or medical device file (`MDF`).

Use it to make the expected deliverable set explicit across:

- product lifecycle gates
- controlling SOP or WI sources
- owning roles
- linked records in the designated product repository
- high-level standards or regulatory anchors

You may adapt the rows, split combined records, or use different filenames in the product repository, but do not lose the same deliverable intent, gate ownership, and traceability coverage.

## Metadata

- Crosswalk ID:
- Product ID:
- Product Name:
- Revision:
- Repository:
- Baseline PR or Issue:
- Owner:
- Date:

## Gate Model Used by This Product

- Gate 1: Design planning and input baseline
- Gate 2: Verification readiness
- Gate 3: Release readiness / final release decision

If this product uses additional lifecycle gates, document them here:

- Additional gate:
- Purpose:
- Entry trigger:
- Approval record:

## Deliverable Crosswalk

| Deliverable Area | Typical Record or Artifact | Gate | Primary Owning Role | Governing SOP / WI | Standards / Regulatory Anchor | Notes |
|---|---|---|---|---|---|---|
| Intended use and claims | `intended_use.md` or equivalent controlled product statement | Gate 1 | regulatory_lead | SOP-008, SOP-007 | ISO 13485 7.3; product-specific regulatory dossier expectation | Define intended purpose, users, use environment, claims, and major exclusions. |
| Product classification and regulatory pathway | `classification_decision.md` or equivalent regulatory decision record | Gate 1 when in scope; update on change | regulatory_lead | SOP-007, SOP-009 | SOP-007 MDF structure; product-specific jurisdictional expectations | Distinct from IEC 62304 software safety classification. |
| Design and development plan | `design_development_plan.md` | Gate 1 | engineering_lead | SOP-008, SOP-020 | ISO 13485 7.1, 7.3; IEC 62304 5 | Defines lifecycle model, roles, gates, deliverables, and GitHub-native operating model. |
| User needs | `user_needs.yml` | Gate 1 | regulatory_lead | SOP-008 | ISO 13485 7.3 | Inputs from intended use, user profiles, and safety-relevant context. |
| System and software requirements | `system_requirements_spec.yml` | Gate 1 baseline; updated under change control | engineering_lead | SOP-008, SOP-020 | ISO 13485 7.3; IEC 62304 5 | Testable functional, safety, security, usability, interface, and operational requirements. |
| Usability inputs and file index | `usability_file_index.yml` and linked usability records | Gate 1 when user-facing product; update through lifecycle | usability_lead | SOP-019, SOP-008 | IEC 62366-1; ISO 13485 7.3 | May be omitted only with explicit rationale for non-user-facing products. |
| Software safety classification | section in `design_development_plan.md` or separate controlled rationale | Gate 1 | engineering_lead | SOP-020 | IEC 62304 4, 5 | Not the same as product regulatory classification. |
| Risk management plan | `risk_management_plan.yml` | Gate 1 | regulatory_lead | SOP-018 | ISO 14971; ISO 13485 7.1, 7.3 | Separate controlled plan for risk method, roles, scoring, and review cadence. |
| Risk register / risk file | `risk_register.yml` plus linked reviews | Gate 2 and Gate 3; ongoing | engineering_lead with regulatory_lead | SOP-018 | ISO 14971; IEC 62304 7 | Must stay current with controls, residual risk, and post-production feedback. |
| Software architecture | `software_architecture_spec.yml` | Gate 2 | engineering_lead | SOP-008, SOP-020 | IEC 62304 5 | Components, interfaces, external dependencies, and architecture decisions. |
| Design traceability | `design_traceability_matrix.yml` | Gate 2 and Gate 3 | engineering_lead | SOP-007, SOP-008, SOP-020 | ISO 13485 7.3; IEC 62304 5, 7, 8 | Links user needs, requirements, risks, tests, and released baselines. |
| Verification and validation plan | `vv_plan.yml` or equivalent | Gate 1 reference; Gate 2 approved baseline | qa_lead and engineering_lead | WI-001, SOP-020, SOP-008 | IEC 62304 5; lifecycle evidence expectations | Separate controlled plan for campaign scope, environments, acceptance criteria, and evidence set. |
| Test case index and manual test records | `test_case_index.yml` plus linked test cases | Gate 2 | engineering_lead | WI-001 | IEC 62304 5 | Controlled test identifiers and execution intent for formal evidence. |
| Release readiness / formal V&V entry decision | `release_plan.yml` | Gate 2 | engineering_lead with qa_lead and regulatory_lead | SOP-020, WI-002 | IEC 62304 8 | Names candidate scope, included/deferred changes, and exact binary or deployment entering formal V&V. |
| Execution records and evidence index | execution logs, workflow references, evidence index | Gate 3 input | engineering_lead | WI-001 | IEC 62304 lifecycle evidence expectations | Must capture exact environment and binary or deployment used for formal runs. |
| V&V report | `vv_report.md` | Gate 3 input | qa_lead and engineering_lead | WI-001 | SOP-020 release decision inputs | Summarizes outcomes, deviations, restrictions, and release recommendation. |
| Residual risk / risk management review | `risk_management_review.md` or equivalent approved decision | Gate 3 input | management_representative with qa_lead recommendation | SOP-018 | ISO 14971 8-10 | Confirms residual risk posture for the release scope. |
| Release baseline manifest | `release_baseline_manifest.yml` | Gate 3 input | engineering_lead | SOP-020, WI-002 | IEC 62304 8 | Defines released source revision, linked records, binary or package reference, and rollback linkage. |
| Final release decision | `final_release_decision.md` | Gate 3 | qa_lead, engineering_lead, regulatory_lead | SOP-020, WI-002 | Release authorization under the controlled lifecycle model | Separate group approval after V&V and residual-risk review are current. |
| MDF index | `medical_device_file_index.yml` | Gate 3 and periodic review | management_representative with engineering_lead | SOP-007 | ISO 13485 4.2.3 | Points to the current controlled artifact set. |
| MDF traceability summary | `traceability_summary.md` | Gate 3 and periodic review | qa_lead | SOP-007 | ISO 13485 4.2.3 | Summarizes traceability coverage and open gaps across released artifacts. |
| Post-market linkage | complaint, PMS, incident, CAPA, and nonconformity references when applicable | Not a Gate 1 baseline artifact; linked at Gate 3 and maintained after release | qa_lead / regulatory_lead | SOP-012, SOP-013, SOP-014, SOP-015, SOP-002 | ISO 13485 feedback and improvement controls | These are linked lifecycle records, not part of the initial design baseline. |

## Open Product-Specific Gaps

- Deliverable area:
- Gap:
- Planned record or change:
- Owner:
- Target gate or date:

## Approval Notes

- Crosswalk approved for current baseline: yes | no
- Linked approving PR:
- Notes:
