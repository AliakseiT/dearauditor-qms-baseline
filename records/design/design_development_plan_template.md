---
record_type: design_development_plan
plan_id: "DDP-<product>-<yyyy-mm-dd>"
product_id: ""
intended_use_reference: "docs/regulatory/intended_use.md"
scope_summary: ""
lifecycle_model: "incremental|iterative|waterfall_with_iterations"
software_safety_classification: "A|B|C|not_applicable_with_rationale"
accountable_roles:
  engineering_lead: ""
  usability_lead: ""
  qa_lead: ""
github_native_operating_model:
  designated_repository: ""
  protected_branch: "main"
  change_control_flow: "issue_or_pr_context -> branch -> pull_request -> merge -> signature_attestation -> immutable_release_evidence"
linked_records:
  user_needs_reference: "records/design/user_needs.md"
  system_requirements_reference: "records/design/system_requirements_spec.md"
  software_architecture_reference: "records/design/software_architecture_spec.md"
  design_traceability_reference: "records/design/design_traceability_matrix.md"
  risk_management_plan_reference: "records/risk/risk_management_plan.md"
  verification_validation_plan_reference: "records/verification_validation/vv_plan.md"
  release_plan_reference: "records/configuration/release_plan.md"
  usability_file_index_reference: "records/usability/usability_file_index.md"
approval:
  meaning_of_signature: "Approved Design Inputs and Development Plan"
  signer_roles:
    - qa_lead
    - engineering_lead
---

# Design and Development Plan Template

This template shows one workable Markdown-first variant of a design and development plan for a GitHub-native team.

You may rewrite the section order, headings, tables, or prose style to fit the product, as long as the same planning decisions, gate reviews, linked records, and approval intent remain clear and traceable.

Instantiated product records are expected to be Markdown files with YAML frontmatter so they render directly in GitHub while still exposing structured metadata for automation.

Replace all example text below with product-specific content before approval.

## 1. Purpose and Scope

Example:

- Product / subsystem in scope: `ACME-GENERIC-SAMD` clinical decision support web application and supporting API
- Intended use summary: provide rule-based decision support to trained clinical staff in outpatient triage workflows
- Major feature or change boundary: initial regulated baseline for product launch, including core workflow, audit trail, and role-based access
- Out of scope: billing integrations, analytics dashboards, and non-clinical admin tooling

## 2. Lifecycle Model and Governance

Example:

- Lifecycle model: incremental delivery on protected `main`, with formal baseline and release gates
- Controlled lifecycle gates: design planning and input baseline; verification readiness; release readiness
- Software safety classification and rationale: class `B` per IEC 62304 because incorrect or unavailable output could contribute to delayed or incorrect clinical decisions if not mitigated
- Product classification and regulatory pathway are documented separately in the product classification decision; do not treat software safety classification as the same decision
- Required controlled deliverables across the lifecycle: Gate 1 design-input baseline records; later architecture and traceability records; separate risk-management and verification/validation plan records; release-readiness, release-baseline, and final-release records; and medical device file references where the product maintains an MDF

## 3. Roles and Responsibilities

Example:

- Engineering lead: owns technical planning, architecture, release readiness, and technical traceability
- QA lead: owns intended use, claims, classification rationale, dossier coherence, process conformance, gate completeness, and approval evidence
- Usability lead: owns user-profile, critical-task, and formative/summative input for user-facing features
- Additional contributors or specialist reviewers: security reviewer for authentication and access control; clinical advisor for validation context

## 4. GitHub-Native Working Model

Example:

- Designated repository and default protected branch: product repository on protected `main`
- Change context convention: every controlled change starts from either a planning issue or a PR body that states the regulated change context
- Branch and pull request workflow: short-lived feature branches, PR review on current head, merge to `main`, post-merge signature attestation, immutable release evidence
- Required approvals and signature flow: gate PRs require designated role approvals and post-merge signatures per the QMS workflow
- Traceability and evidence locations: design records in `records/design/`, risk records in `records/risk/`, V&V records in `records/verification_validation/`, release records in `records/configuration/`, MDF index in `records/mdf/`

## 5. Design Inputs and Baseline Content

Example:

- Intended use reference: `docs/regulatory/intended_use.md`
- User needs reference: `records/design/user_needs.md`
- System requirements reference: `records/design/system_requirements_spec.md`
- Classification decision reference: `records/mdf/classification_decision.md` when the product regulatory pathway or market classification is in scope for the baseline
- Initial risk management plan reference: `records/risk/risk_management_plan.md`
- Planned V&V strategy reference: `records/verification_validation/vv_plan.md` or equivalent approved product record
- Usability inputs and critical-task references: `records/usability/usability_file_index.md`
- Open constraints or deferred inputs: external SSO provider not finalized; production hosting region pending supplier contract review

## 6. Gated Review Record Set

### 6.1 Gate 1: Design Planning and Input Baseline

Example minimum review set:

- Design and development plan
- Intended use or equivalent scope statement
- Classification decision when product classification or jurisdictional pathway is already part of the baseline scope
- User needs
- System requirements baseline
- Initial risk management plan or approved risk-planning reference
- Planned V&V strategy or approved V&V plan reference
- Usability file index or equivalent input reference for user-facing products

Example gate decision:

- Controlled implementation may start only after this gate is approved.

### 6.2 Gate 2: Verification Readiness

Example minimum review set:

- Current software architecture specification
- Current design traceability matrix
- Approved verification and validation plan
- Test case index and any required manual test records
- Release-readiness or formal V&V-entry decision reference
- Current risk register or risk-control references
- Open anomaly, deviation, and change summary relevant to the candidate scope

Example gate decision:

- Formal verification and validation execution may start only after this gate is approved and the exact candidate scope and binary or deployment are recorded.

### 6.3 Gate 3: Release Readiness

Example minimum review set:

- Approved V&V report and linked execution records
- Residual risk review or risk management review decision
- Open anomaly or deviation disposition summary
- Release baseline manifest
- Final release decision record
- Medical device file index and traceability summary references
- Post-market, complaint, incident, or cybersecurity follow-up references when applicable

Example gate decision:

- Product release may proceed only after this gate is approved.

## 7. Standard Planning Areas Covered by This SDP

### 7.1 Development Deliverables and Reviews

Example:

- Planned requirements, architecture, implementation, and traceability outputs: user needs, SRS, architecture spec, traceability matrix, risk file, V&V records, release records
- Review cadence and independence expectations: architecture reviewed before formal V&V planning; regulated gate PRs reviewed by non-author approvers on current head
- Acceptance approach for major output types: requirements accepted when testable and linked; architecture accepted when interfaces and dependencies are allocated; release accepted only after approved V&V and residual-risk review

### 7.2 Configuration and Baseline Management

Example:

- Configuration items to be controlled: repository revision, build or deployment package, requirements/risk/test record revisions, release manifest
- Baseline identification method: merged PRs establish approved content on `main`; explicit release records define the candidate and shipped baseline
- Release tag or versioning approach: semantic product version plus immutable Git commit and release tag
- Rollback or containment expectations: every release candidate defines rollback target, rollback trigger, and containment actions for failed deployment or post-release issue discovery

### 7.3 External Dependencies and SOUP-Like Components

Example:

- Known external components or services in scope: managed database, identity provider, GitHub Actions, selected open-source libraries
- Evaluation and approval approach: document intended use, version or service, rationale, and risk/review impact in architecture and supplier or change records
- Change-impact expectations for dependency updates: significant upgrades require impact review on requirements, risk, V&V scope, and release readiness

### 7.4 Maintenance and Problem Resolution

Example:

- Expected anomaly intake path: issue intake through product defects, complaint records, incident records, or PMS findings
- Defect triage and escalation approach: pre-milestone defects remain standard engineering defects; post-milestone quality issues route through complaint or nonconformity logic as applicable
- Maintenance-release or patching expectations: patch releases follow the same release-readiness and final-release controls, scaled to impact
- Feedback loop into risk management and V&V: significant anomalies reopen risk analysis, regression scope, and release assumptions before shipment

### 7.5 Release Planning Interface

Example:

- Planned release-readiness decision reference: `records/configuration/release_plan.md`
- Planned final release decision reference: `records/configuration/final_release_decision.md`
- Entry conditions for formal release-candidate V&V: candidate scope frozen, included and deferred changes named, binary or deployment reference recorded, open anomaly posture reviewed

## 8. Separate Linked Plans

Example:

- Risk management plan reference: `records/risk/risk_management_plan.md`
- Verification and validation plan reference: `records/verification_validation/vv_plan.md`
- Usability engineering plan or file reference: `records/usability/usability_file_index.md`
- Other linked plans or supporting records: `records/configuration/release_plan.md`, `records/mdf/medical_device_file_index.md`

## 9. Expected Product Dossier / MDF Deliverables and Linked Records

Use the controlled record names already adopted in the product repository where possible. If a product uses different filenames or combines records, keep the same intent and traceability rather than copying these names mechanically.

The table below lists expected deliverable areas, not a rigid one-file-per-row mandate.

`MDF` means `medical device file`.

| Deliverable Area | Typical Record Name(s) | Main Purpose | Normative / Regulatory Anchor |
|---|---|---|---|
| Intended use and claims | `intended_use.md` or equivalent controlled product statement | Define product purpose, users, use environment, and claims | SOP-008 design inputs; SOP-007 MDF structure; FDA QMSR as implemented through 21 CFR part 820 incorporating ISO 13485:2016 |
| Classification and regulatory pathway | `classification_decision.md` or equivalent regulatory decision record | Capture jurisdictional classification and pathway rationale | SOP-007 MDF structure; product-specific regulatory dossier expectations |
| Design and development planning | `design_development_plan.md` | Define lifecycle model, roles, gates, and operating model | ISO 13485 7.1, 7.3; IEC 62304 5; SOP-008; SOP-020 |
| User needs | `user_needs.md` | Define user and intended-use driven needs | ISO 13485 7.3; SOP-008 |
| System and software requirements | `system_requirements_spec.md` | Define testable functional, safety, security, usability, and interface requirements | ISO 13485 7.3; IEC 62304 5; SOP-008; SOP-020 |
| Software architecture | `software_architecture_spec.md` | Define components, interfaces, external dependencies, and architecture decisions | IEC 62304 5; SOP-008; SOP-020 |
| Design traceability | `design_traceability_matrix.md` | Link user needs, requirements, risks, tests, and releases | ISO 13485 7.3; IEC 62304 5, 7, 8; SOP-007; SOP-008; SOP-020 |
| Risk management file | `risk_management_plan.md`, `risk_register.md`, `risk_management_review.md`, or equivalent linked records | Define and maintain product risk method, analysis, controls, and residual risk decisions | ISO 13485 7.1, 7.3; ISO 14971; SOP-018 |
| Verification and validation | `vv_plan.md`, `test_case_index.md`, execution logs, `vv_report.md`, or equivalent linked records | Define and record verification, validation, and usability-validation evidence | SOP-008; SOP-020; WI-001; IEC 62304 lifecycle evidence expectations |
| Release and configuration control | `release_plan.md`, `release_baseline_manifest.md`, `final_release_decision.md` | Record formal V&V entry, release baseline, exact binary or deployment, and shipment authorization | SOP-020; WI-002; IEC 62304 configuration, release, and problem-resolution interfaces |
| Medical device file index and summary | `medical_device_file_index.md`, `traceability_summary.md` | Tie the product dossier together and point to current controlled artifacts | ISO 13485 4.2.3; SOP-007 |
| Linked post-market and quality follow-up records | complaint, PMS, incident, CAPA, and nonconformity references when applicable | Maintain lifecycle continuity after release; these are linked records rather than part of the initial design baseline | SOP-012; SOP-013; SOP-014; SOP-015; SOP-002 |

## 10. Milestones and Entry/Exit Criteria

| Milestone | Entry Criteria | Exit Criteria |
|---|---|---|
| Design inputs baselined | intended use approved; user needs reviewed | requirements baselined; open assumptions documented |
| Architecture ready | requirements baselined | architecture and interfaces reviewed |
| Formal V&V entry ready | release-readiness scope approved; binary identified | formal V&V can start against recorded candidate |
| Release ready | V&V complete; residual risk reviewed | final release decision can proceed |

## 11. Open Assumptions and Deferred Inputs

Example:

- Assumption or deferred input: production SSO provider remains provisional until supplier review closes
- Owner: engineering lead plus QA lead
- Due milestone: verification readiness
- Resolution path: finalize supplier decision, update architecture and access-control requirements, assess regression scope if changed

## 12. Approval Record

Example:

- Baseline approved for controlled implementation: yes
- Approval date: `YYYY-MM-DD`
- Linked approving PR: `#123`
- Notes: approval covers the baseline records listed in Gate 1; changes after approval require a new controlled revision
