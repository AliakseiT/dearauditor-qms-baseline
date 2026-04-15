---
record_type: risk_management_plan
plan_id: "RMP-<product>-<yyyy-mm-dd>"
product_id: ""
product_name: ""
intended_use_reference: "records/mdf/intended_use.md"
device_description_reference: "records/mdf/device_description.md"
lifecycle_scope:
  - design
  - development
  - verification_validation
  - release
  - production_post_production
responsible_roles:
  qa_lead: ""
  engineering_lead: ""
  usability_lead: ""
  management_representative: ""
linked_records:
  risk_register_reference: "records/risk/risk_register.md"
  design_traceability_reference: "records/design/design_traceability_matrix.md"
  verification_validation_plan_reference: "records/verification_validation/vv_plan.md"
  release_decision_reference: "records/configuration/final_release_decision.md"
risk_acceptability:
  method: "severity_x_probability"
  scoring_formula: "risk_score = severity_value * probability_value"
  overall_residual_risk_method: "aggregate_review_by_release_and_quarter"
approval:
  meaning_of_signature: "Approved Risk Management Plan"
  signer_roles:
    - qa_lead
    - management_representative
---

# Risk Management Plan Template

This template shows one workable Markdown-first risk management plan for a GitHub-native software medical device team.

You may rewrite the section order, headings, tables, or prose style to fit the product, as long as the same planning decisions, scoring method, review cadence, linked records, and approval intent remain clear and traceable.

Instantiated product records are expected to be Markdown files with YAML frontmatter so they render directly in GitHub while still exposing structured metadata for automation.

Replace all example text below with product-specific content before approval.

## 1. Purpose and Scope

Example:

- Product / subsystem in scope: `ACME-GENERIC-SAMD` clinician-facing triage support web application and supporting API
- Trigger for this plan revision: initial regulated baseline for new product release
- Intended use reference: `records/mdf/intended_use.md`
- Device description reference: `records/mdf/device_description.md`
- Assessment boundary: user-facing workflow, decision logic, authentication, audit trail, release/deployment configuration, and post-release monitoring inputs
- Out of scope: non-clinical back-office analytics and finance tooling

## 2. Lifecycle Scope and Planning Interfaces

Example:

- Lifecycle phases covered: design, development, verification and validation, release, and production/post-production
- Separate but linked records: design development plan, V&V plan, design traceability matrix, release decision, complaint/PMS/incident records
- Risk file operating model: this plan defines the method; the living analysis is maintained in `records/risk/risk_register.md` or an equivalent renderable risk register
- Gate expectations:
  - Gate 1: plan, intended use context, device description, and seed risk-analysis inputs approved
  - Gate 2: current risk register reviewed alongside architecture, traceability, and V&V readiness
  - Gate 3: residual-risk and overall risk-management review completed before release authorization

## 3. Roles and Responsibilities

Example:

- QA lead: owns intended-use context, foreseeable misuse framing, acceptability logic, and risk-file coherence, and verifies risk-process integrity
- Engineering lead: owns failure-mode analysis, technical control implementation, and traceability to design/test evidence
- Usability lead: owns use-related hazards, critical-task risk inputs, and user-interface misuse analysis for user-facing products
- Management representative: approves the acceptability framework and overall residual-risk decisions

## 4. Unified Risk Method

### 4.1 One Risk File, Three Entry Perspectives

Example:

- Top-down hazard analysis is used to identify hazards and hazardous situations from intended use, misuse, workflow, and clinical context
- Bottom-up failure-mode analysis is used to identify software, interface, operational, and workflow failures that can lead to hazardous situations
- Cybersecurity threat analysis is used to identify threat scenarios that can create hazardous situations or compromise safety, performance, or availability
- All three perspectives feed one living risk register; they are not maintained as separate approval systems

### 4.2 Shared Entry Structure

Example:

Each risk entry records:

- `source_type`: `hazard_top_down`, `failure_mode_bottom_up`, or `cybersecurity_threat`
- initiating condition or scenario
- sequence of events or attack path
- hazardous situation
- possible harm
- initial severity and probability estimate with rationale
- controls
- residual severity and probability estimate with rationale
- linked requirements, implementation, verification, and monitoring evidence

### 4.3 Shared Scoring and Acceptability Method

Example:

- Severity scale:
  - `S1` negligible
  - `S2` minor
  - `S3` moderate
  - `S4` serious
  - `S5` critical
- Probability scale:
  - `P1` remote
  - `P2` low
  - `P3` occasional
  - `P4` probable
  - `P5` frequent or credible
- Scoring formula: `R = S x P`
- Acceptability bands:
  - `1-4`: acceptable with rationale
  - `5-9`: reduce when practicable or justify residual risk
  - `10-25`: not acceptable without additional controls or benefit-risk justification
- The same method is used before and after mitigation
- When numeric probability is weak, especially for systematic software faults or cybersecurity scenarios, probability may be estimated using credibility, exposure, and detectability proxies, but rationale remains mandatory

### 4.4 Control Strategy and Benefit-Risk Rules

Example:

- Control priority:
  - inherent safety by design
  - protective measures in the product or process
  - information for safety
- Controls introduced by mitigation must themselves be assessed for new risk
- Benefit-risk analysis is allowed only when further risk reduction is impracticable and the rationale is explicitly documented and approved

## 5. Planned Analysis Inputs

### 5.1 Top-Down Hazard Domains

Example:

- incorrect or delayed decision-support output
- unavailable system during intended clinical use
- misleading or incomplete user interface presentation
- inappropriate user action under foreseeable misuse

These are seed domains for analysis planning, not the full approved risk register.

### 5.2 Bottom-Up Failure-Mode Domains

Example:

- incorrect rules-engine behavior
- stale or corrupted configuration
- interface contract mismatch between web client and API
- authentication or authorization defect affecting access or role behavior
- audit-trail write failure

These are seed domains for analysis planning, not the full approved risk register.

### 5.3 Cybersecurity Threat Domains

Example:

- unauthorized access to decision-support functions or data
- integrity compromise of configuration or deployed package
- denial-of-service affecting availability during intended use
- log or evidence tampering affecting traceability or response

These are seed domains for analysis planning, not the full approved risk register.

## 6. Living Risk File Structure

Example:

- Risk plan reference: `records/risk/risk_management_plan.md`
- Risk register reference: `records/risk/risk_register.md`
- Risk review reference: `records/risk/risk_management_review.md`
- Product traceability reference: `records/design/design_traceability_matrix.md`
- Planned rule for updates: the risk register is updated under change control whenever new design inputs, anomalies, complaints, incidents, vulnerabilities, or post-market signals materially affect risk assumptions

## 7. Review Triggers and Cadence

Example:

- Scheduled review cadence: quarterly and at each major release gate
- Event-driven review triggers:
  - significant design or architecture change
  - new complaint or post-market signal
  - cybersecurity vulnerability or incident
  - significant verification failure or anomalous trend
  - intended-use, claims, or deployment-context change
- Formal review outputs:
  - current score-band summary
  - open unacceptable or justification-required items
  - overall residual-risk decision
  - follow-up actions with owners and due dates

## 8. Production and Post-Production Inputs

Example:

- Complaint and feedback records
- PMS reviews and trend outputs
- Incident-reportability assessments and submissions
- Vulnerability disclosures and internal security findings
- Reliability, uptime, and operational monitoring signals relevant to harm scenarios

Post-production signals are reviewed against both top-down hazards and bottom-up failure modes; they are not treated as a separate risk method.

## 9. Done Criteria for This Plan Revision

Example:

- Risk management plan approved
- Intended use and device description references linked
- Shared scoring and acceptability method defined
- Seed analysis domains named for top-down, bottom-up, and cybersecurity perspectives
- Risk register operating model and review cadence agreed
- Linked downstream records identified for traceability, V&V, release, and post-production follow-up

## 10. Approval Record

Example:

- Plan approved for current lifecycle scope: yes
- Approval date: `YYYY-MM-DD`
- Linked approving PR: `#123`
- Notes: approval authorizes the risk method and review framework; the detailed living analysis remains in the risk register and review records
