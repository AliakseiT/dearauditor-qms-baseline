---
sop_id: SOP-019
title: Usability Engineering (IEC 62366-1)
revision: R03
effective_date: 2026-03-07
status: Published
owner_role: regulatory_lead
approver_role: qa_lead
iso_13485_clauses:
  - 7.3
  - 7.5.1
iec_62366_1_clauses:
  - 4.1.1
  - 4.1.2
  - 4.1.3
  - 4.2
  - 4.3
  - 5.1
  - 5.2
  - 5.3
  - 5.4
  - 5.5
  - 5.6
  - 5.7.1
  - 5.7.2
  - 5.7.3
  - 5.8
  - 5.9
  - 5.10
related_issue: "#44"
---

## 1. Purpose
Define a lightweight, auditable usability engineering process for ACME user-facing healthcare software products, aligned with IEC 62366-1 and integrated with risk management.

## 2. Scope
Applies to user interface design and evaluation activities that affect safety, including:
- intended use and reasonably foreseeable misuse
- hazard-related use scenarios
- formative and summative usability evaluation
- user interface of unknown provenance (UOUP)

## 3. Process Strategy
1. Use Git/GitHub as the usability engineering system of record in the designated product or study repository.
2. Keep records concise and structured in YAML/Markdown.
3. Store only evidence needed to justify safety-related usability decisions.
4. Link usability findings directly to ISO 14971 risk items and product changes.
5. QMS Lite maintains governance SOPs and traceability baselines; operational usability records are maintained outside `qms-lite`.

## 4. Required Inputs
- Product intended use and user profiles
- Risk management plan/register (`SOP-018` artifacts)
- UI requirements and architecture
- Complaint/post-production use-related signals

## 5. Required Outputs
- Maintained usability engineering file
- Formative and summative evidence records
- Updated use-related risk controls and residual risk rationale

## 6. Roles and Responsibilities
| Role | Responsibilities |
|---|---|
| Regulatory Lead | Owns use context, user profiles, and use-related safety assumptions. |
| Engineering Lead | Implements UI risk controls and design updates. |
| QA Lead | Verifies process compliance and usability file completeness. |
| Management Representative | Approves major residual use-risk decisions. |

## 7. Lightweight Usability File Structure
For each product, maintain:

`<product-or-study-repository>/records/usability/<product-id>/`
- `usability_file_index.yml`
- `use_specification.yml`
- `ui_safety_characteristics.yml`
- `hazard_related_use_scenarios.yml`
- `formative_evaluation_log.yml`
- `summative_evaluation_record.yml`
- `uoup_evaluation.yml` (if applicable)
- `post_production_usability_review.yml`

The file index is the entrypoint for audits and must reference current revisions of all required records.

## 8. Procedure

### 8.1 General Requirements (IEC 62366-1 4.1.1)
1. Apply usability engineering activities as part of development lifecycle.
2. Tailor effort by risk, complexity, and novelty.
3. Maintain objective evidence in the usability engineering file.

### 8.2 Risk Control and Information for Safety (4.1.2, 4.1.3)
1. Treat user interface risk controls as risk controls within the ISO 14971 process.
2. Information for safety is used only when design/protective controls are insufficient.
3. Claims that rely on user behavior must be verified in evaluation evidence.

### 8.3 Prepare Use Specification (5.1)
1. Define intended users, use environments, operating conditions, and critical tasks.
2. Document reasonably foreseeable misuse relevant to safety.

### 8.4 Identify UI Characteristics and Potential Use Errors (5.2)
1. Identify UI characteristics related to safety.
2. Identify potential use errors by task and workflow step.
3. Link each potential use error to affected risk items.

### 8.5 Identify Hazards/Hazardous Situations and Scenarios (5.3, 5.4)
1. Identify known or foreseeable hazards/hazardous situations related to use.
2. Define hazard-related use scenarios with event sequence and possible harm.

### 8.6 Select Scenarios for Summative Evaluation (5.5)
1. Select scenarios based on severity, probability, and uncertainty.
2. Include high-severity and high-uncertainty scenarios even if infrequent.

### 8.7 Establish UI Specification and Evaluation Plan (5.6, 5.7)
1. Define UI requirements and safety-critical acceptance criteria.
2. Define formative and summative evaluation plans with participant profiles and pass/fail criteria.

### 8.8 Perform Design, Formative Evaluation, and Iteration (5.8)
1. Conduct formative evaluations iteratively.
2. Record only essential evidence: scenario, participant type, observed use errors, disposition, and follow-up action.
3. Close findings through tracked design/risk updates.

### 8.9 Perform Summative Evaluation (5.9)
1. Execute representative validation against selected hazard-related use scenarios.
2. Document conclusion on whether usability-related residual risks are acceptable.
3. If not acceptable, return to design/risk control updates.

### 8.10 UOUP Handling (5.10)
1. For UI elements of unknown provenance, perform a focused UOUP evaluation record.
2. Review post-production evidence and apply additional controls where needed.

### 8.11 Post-Production Feedback Loop
1. At least quarterly, review complaints/incidents/usability signals.
2. Update use-related hazards/scenarios and risk controls when assumptions change.
3. Keep usability file current at each major release.

### 8.12 GitHub Workflow Alignment
1. Track usability-engineering activities through issues in the designated product/study repository.
2. Implement usability record updates through pull requests that include linked issue context and required Part 11 signature meaning/roles.
3. Require non-author review approval on current PR head commit before merge.
4. Collect Part 11 attestations post-merge and publish immutable release assets (including manifest and signature evidence) for released usability records.

## 9. Required Records
- Product usability file index and referenced records in the designated product/study repository
- Formative and summative evaluation evidence
- UOUP evaluation record (if applicable)
- Links to related risk and change records
- Immutable release manifest and Part 11 attestation evidence for released usability records

## 10. Traceability
| Standard Clause | Control in this SOP |
|---|---|
| IEC 62366-1 4.1.1-4.3 | Defines process, risk-control linkage, usability file, and effort tailoring. |
| IEC 62366-1 5.1-5.7 | Defines use specification, hazard-related scenario identification, and evaluation planning. |
| IEC 62366-1 5.8-5.9 | Defines formative iteration and summative validation evidence. |
| IEC 62366-1 5.10 | Defines handling of user interface of unknown provenance. |

## 11. Related Controlled Documents
- SOP-018 Risk Management (ISO 14971)
- SOP-008 Design and Development Control
- SOP-009 Change Management
- SOP-012 Feedback and Complaint Handling
- SOP-014 Post-Market Surveillance

## 12. Revision History
| Revision | Effective Date | Change Summary |
|---|---|---|
| R00 | 2026-03-02 | Initial full release with lightweight usability-file model for Git/GitHub execution. |
| R01 | 2026-03-05 | Clarified multi-repository model for usability records, linked to Issue #44, and aligned procedure with implemented GitHub lifecycle (issue -> PR -> merge -> post-merge Part 11 attestation -> immutable release). |
| R02 | 2026-03-07 | Renamed the usability process business owner role to the controlled product/regulatory owner role used in small-team deployments. |
| R03 | 2026-03-07 | Simplified usability role names to `regulatory_lead` and `engineering_lead`. |
