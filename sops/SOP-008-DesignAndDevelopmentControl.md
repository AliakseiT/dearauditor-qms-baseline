---
sop_id: SOP-008
title: Design and Development Control
revision: R06
effective_date: 2026-03-07
status: Published
owner_role: engineering_lead
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
- Approved design-input baseline and design history evidence
- Verified/validated software release package
- Controlled transfer and maintenance artifacts

## 5. Roles and Responsibilities
| Role | Responsibilities |
|---|---|
| Engineering Lead | Owns system/software requirements, technical design planning, architecture, and release-readiness accountability. |
| Engineer | Implements design outputs and executes assigned verification activities under approved plans. |
| QA Lead | Ensures process conformance and evidence adequacy. |
| Regulatory Lead | Owns intended use, claims, user needs, and regulatory constraints that become design inputs. |
| Usability Lead | Owns usability-engineering inputs, user profiles, critical tasks, and user-interface evaluation planning for user-facing products. |

## 6. Procedure

### 6.1 Design and Development Planning
1. Define lifecycle plan, milestones, and responsibilities.
2. Identify review/verification/validation gates.
3. Define required deliverables and entry/exit criteria per phase.
4. For regulated software products, include software safety classification, configuration baselines, and release decision criteria per SOP-020.
5. Do not treat implementation planning as approved until the design-input baseline gate is completed.

### 6.2 Design Inputs
1. Capture user needs, safety/performance requirements, and regulatory constraints.
2. Engineering Lead owns system and software requirements; Regulatory Lead owns intended-use, claims, and regulatory input definitions; Usability Lead owns user-profile and critical-task inputs for user-facing products.
3. Verify input completeness, consistency, and testability.
4. Resolve conflicting requirements before implementation.

### 6.3 Design-Input Baseline Approval
1. Before controlled implementation starts, open a PR in the designated product repository that baselines:
   - design and development plan
   - intended use or equivalent scope statement
   - user needs
   - system requirements baseline
   - initial risk-management plan/reference set
   - planned V&V strategy
2. The design-input baseline must state key assumptions, open constraints, and any explicitly deferred inputs.
3. The PR body must state:
   - `**Meaning of Signature:** Approved Design Inputs and Development Plan`
   - `**Signer Roles:** Quality Assurance Lead; Engineering Lead; Regulatory Lead`
   - `**Required Signatures:** 3`
4. Merge only after required approvals on the current head commit and post-merge signature attestation collection.
5. Changes to approved design inputs require a new PR revision before they are used as the basis for controlled implementation or release evidence.

### 6.4 Design Outputs
1. Produce architecture, detailed design, and implementation artifacts.
2. Ensure outputs are traceable to approved inputs.
3. Define acceptance criteria for each output element.

### 6.5 Design Review
1. Conduct planned independent reviews at defined milestones.
2. Record participants, findings, decisions, and action items.
3. Resolve critical findings before proceeding to next phase.

### 6.6 Verification and Validation
1. Verification demonstrates outputs meet design input requirements.
2. Validation demonstrates product meets user needs/intended use in representative context.
3. Maintain bidirectional traceability requirements -> risk controls -> tests -> results.
4. Execute V&V planning, approval, evidence review, and post-merge PIN signature flow using WI-001.

### 6.7 Transfer and Release
1. Confirm release readiness checklist completion.
2. Ensure required regulatory and QMS deliverables are approved.
3. Release only controlled versions with immutable record linkage.
4. Configuration baseline and release publication must follow SOP-020 and WI-002.

### 6.8 Design Changes
1. Manage post-baseline changes under SOP-009.
2. Re-run impacted verification/validation and update traceability.

## 7. Required Records
- Design/development plan and approved design-input baseline
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
- SOP-020 Software Lifecycle, Configuration, and Release Management (IEC 62304)
- WI-001 Verification and Validation Execution
- WI-002 Configuration and Release Management Execution

## 10. Revision History
| Revision | Effective Date | Change Summary |
|---|---|---|
| R00 | 2026-03-02 | Initial full release. |
| R01 | 2026-03-06 | Added IEC 62304 lifecycle/release linkage and default GitHub-native V&V execution reference. |
| R02 | 2026-03-07 | Normalized engineering and product/regulatory roles for small teams and added explicit engineer execution responsibilities under approved plans. |
| R03 | 2026-03-07 | Renamed lead roles to `engineering_lead` and `regulatory_lead` to remove owner-style role wording. |
| R04 | 2026-03-07 | Clarified ownership of system requirements, regulatory design inputs, and usability inputs, and added `usability_lead` responsibilities. |
| R05 | 2026-03-07 | Added the explicit design-input baseline gate requiring group approval of the development plan and approved input set before controlled implementation. |
| R06 | 2026-03-07 | Removed overly specific signature-regulation terminology from the design-input approval wording and used technology-neutral signature language. |
