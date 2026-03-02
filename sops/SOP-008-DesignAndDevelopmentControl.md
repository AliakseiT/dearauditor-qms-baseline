---
sop_id: SOP-008
title: Design and Development Control
revision: R00
effective_date: 2026-03-02
status: Published
owner_role: software_engineer
approver_role: qa_lead
iso_13485_clauses:
  - 7.1
  - 7.3.1
  - 7.3.2
  - 7.3.3
  - 7.3.4
  - 7.3.5
  - 7.3.6
  - 7.3.7
  - 7.3.8
  - 7.3.9
  - 7.3.10
related_issue: "#4"
---

## 1. Purpose
Define design and development controls for healthcare software products from planning through release and maintenance.

## 2. Scope
Applies to new products, major features, and significant lifecycle changes affecting safety, performance, regulatory submissions, or claims.

## 3. Inputs
- Product intended use and user needs
- Regulatory and standards requirements
- Risk management inputs

## 4. Outputs
- Design plan and design history evidence
- Verified/validated software release package
- Controlled transfer and maintenance artifacts

## 5. Roles and Responsibilities
| Role | Responsibilities |
|---|---|
| Engineering Lead | Owns design planning and technical outputs. |
| QA Lead | Ensures process conformance and evidence adequacy. |
| Clinical/Regulatory Stakeholders | Review clinical and regulatory adequacy of outputs. |

## 6. Procedure

### 6.1 Design and Development Planning
1. Define lifecycle plan, milestones, and responsibilities.
2. Identify review/verification/validation gates.
3. Define required deliverables and entry/exit criteria per phase.

### 6.2 Design Inputs
1. Capture user needs, safety/performance requirements, and regulatory constraints.
2. Verify input completeness, consistency, and testability.
3. Resolve conflicting requirements before implementation.

### 6.3 Design Outputs
1. Produce architecture, detailed design, and implementation artifacts.
2. Ensure outputs are traceable to approved inputs.
3. Define acceptance criteria for each output element.

### 6.4 Design Review
1. Conduct planned independent reviews at defined milestones.
2. Record participants, findings, decisions, and action items.
3. Resolve critical findings before proceeding to next phase.

### 6.5 Verification and Validation
1. Verification demonstrates outputs meet design input requirements.
2. Validation demonstrates product meets user needs/intended use in representative context.
3. Maintain bidirectional traceability requirements -> risk controls -> tests -> results.

### 6.6 Transfer and Release
1. Confirm release readiness checklist completion.
2. Ensure required regulatory and QMS deliverables are approved.
3. Release only controlled versions with immutable record linkage.

### 6.7 Design Changes
1. Manage post-baseline changes under SOP-009.
2. Re-run impacted verification/validation and update traceability.

## 7. Required Records
- Design/development plan and reviews
- Requirements, architecture, and traceability records
- Verification/validation evidence

## 8. Traceability
| ISO 13485 Clause | Control in this SOP |
|---|---|
| 7.1 | Planning of product realization and quality controls. |
| 7.3.1-7.3.10 | End-to-end design/development controls from planning to changes. |

## 9. Related Controlled Documents
- SOP-007 Medical Device File Control
- SOP-009 Change Management
- SOP-015 Nonconforming Product Control

## 10. Revision History
| Revision | Effective Date | Change Summary |
|---|---|---|
| R00 | 2026-03-02 | Initial full release. |
