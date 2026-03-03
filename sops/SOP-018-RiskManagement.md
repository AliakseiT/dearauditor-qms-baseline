---
sop_id: SOP-018
title: Risk Management (ISO 14971)
revision: R00
effective_date: 2026-03-02
status: Published
owner_role: qa_lead
approver_role: management_representative
iso_13485_clauses:
  - 7.1
  - 7.3
  - 8.5.1
iso_14971_clauses:
  - 4.1
  - 4.2
  - 4.3
  - 4.4
  - 4.5
  - 5.1
  - 5.2
  - 5.3
  - 5.4
  - 5.5
  - 6
  - 7.1
  - 7.2
  - 7.3
  - 7.4
  - 7.5
  - 7.6
  - 8
  - 9
  - 10.1
  - 10.2
  - 10.3
  - 10.4
related_issue: "#35"
---

## 1. Purpose
Define a pragmatic, software-first risk management process for ACME GmbH aligned with ISO 14971:2019, using one unified method for top-down hazards, bottom-up failure modes, and cybersecurity risks.

## 2. Scope
Applies to all ACME healthcare software products across lifecycle phases (planning, development, release, and post-production).

This SOP covers:
- Product safety and performance risks
- Use-related risks (reasonably foreseeable misuse)
- Cybersecurity risks that can lead to clinical or operational harm

## 3. Principles
1. One process, not three separate risk tracks.
2. One risk record structure for hazards, failures, and threats.
3. Risk controls must be testable and traceable to implementation evidence.
4. Residual risk decisions are explicit and reviewable.

## 4. Inputs
- Intended use and foreseeable misuse definitions
- Product requirements and architecture
- Historical defects/incidents/complaints/PMS data
- Threat intelligence and vulnerability reports
- Regulatory and standards requirements

## 5. Outputs
- Risk management plan
- Living risk register and risk management file
- Verified risk control evidence
- Residual risk and benefit-risk decisions
- Production/post-production risk updates

## 6. Roles and Responsibilities
| Role | Responsibilities |
|---|---|
| QA Lead | Owns risk process integrity, file completeness, and governance cadence. |
| Engineering Owner | Identifies failure modes/threat scenarios and implements controls. |
| Clinical Ops | Identifies foreseeable misuse and clinical workflow hazards. |
| Management Representative | Approves risk acceptability framework and overall residual risk decisions. |
| Lead Auditor | Audits risk process execution and traceability quality. |

## 7. Unified Risk Method

### 7.1 Single Risk Item Taxonomy
Each risk entry includes `source_type`:
- `hazard_top_down`
- `failure_mode_bottom_up`
- `cybersecurity_threat`

All three use the same core fields:
- Hazard/threat description
- Sequence of events / attack path
- Hazardous situation
- Possible harm
- Initial risk estimate
- Risk controls
- Residual risk estimate
- Evidence links (requirements/tests/monitoring)

### 7.2 Practical Risk Estimation Model
Use two dimensions:
- Severity (`S1` negligible to `S5` critical)
- Probability (`P1` remote to `P5` frequent/credible)

Risk index `R = S x P`.
- `R <= 4`: acceptable with rationale
- `R 5..9`: reduce when practicable, justify residual risk
- `R >= 10`: not acceptable without additional controls or benefit-risk justification

For software/systematic faults where numeric probability is weak, probability may be estimated using scenario credibility and exposure proxies. Rationale is mandatory.

### 7.3 Control Priority
Risk controls are selected in this order:
1. Inherent safety by design (architecture, constraints, safe defaults)
2. Protective measures (runtime checks, alarms, monitoring, access controls)
3. Information for safety (labeling, user guidance, training)

Cybersecurity controls follow the same priority and are not separated from safety risk controls.

## 8. Procedure

### 8.1 Planning (ISO 14971 Clause 4.4)
1. Create product risk management plan before detailed analysis.
2. Define acceptability criteria, methods, responsibilities, and review cadence.
3. Define method for overall residual risk evaluation.

### 8.2 Risk Analysis (Clause 5)
1. Identify intended use and foreseeable misuse.
2. Identify hazards/threats and hazardous situations.
3. For each item, identify event sequence and possible harms.
4. Estimate initial risk and capture rationale.

### 8.3 Risk Evaluation (Clause 6)
1. Compare estimated risk against acceptability criteria.
2. If acceptable, proceed to completeness checks.
3. If not acceptable, perform risk control activities.

### 8.4 Risk Control (Clause 7)
1. Select controls using priority order.
2. Implement controls through controlled requirements/design/code/process changes.
3. Verify implementation and verify effectiveness.
4. Evaluate residual risk.
5. If residual risk remains unacceptable and further control is impracticable, perform benefit-risk analysis.
6. Assess risks introduced by controls themselves.
7. Confirm completeness of risk controls for all identified hazardous situations.

### 8.5 Overall Residual Risk (Clause 8)
1. Evaluate aggregate residual risk across all risk items.
2. Decision is approved by management representative with QA lead recommendation.
3. Significant residual risks are disclosed in product documentation where required.

### 8.6 Risk Management Review (Clause 9)
1. Confirm plan execution, record completeness, and overall residual risk decision.
2. Review occurs at major release gates and at least quarterly for active products.

### 8.7 Production/Post-Production (Clause 10)
1. Continuously collect relevant post-production information.
2. Feed incidents, vulnerabilities, complaints, and trend shifts back into risk analysis.
3. Reopen and reassess risk items when acceptability assumptions change.

## 9. Cybersecurity Integration Rules
1. Cybersecurity threats are created and maintained in the same risk register as other risks.
2. Threat scenarios must include potential path to harm (for example delayed therapy, incorrect output, unavailable system).
3. Vulnerability remediation is prioritized by patient/user harm potential, not only CVSS-like technical severity.
4. Security monitoring findings are mandatory inputs to post-production risk review.

## 10. Required Records
- Risk management plan
- Risk register / risk management file
- Risk control verification and effectiveness evidence
- Residual risk and benefit-risk decisions
- Post-production risk review records

## 11. Traceability
| Standard Clause | Control in this SOP |
|---|---|
| ISO 14971 4.1-4.5 | Defines risk system, responsibilities, plan, and file controls. |
| ISO 14971 5.1-5.5 | Defines intended use/misuse, hazard identification, and estimation method. |
| ISO 14971 6 | Defines acceptability-based evaluation. |
| ISO 14971 7.1-7.6 | Defines option analysis, implementation/effectiveness checks, residual and completeness review. |
| ISO 14971 8-10 | Defines overall residual risk, formal review, and post-production feedback loop. |

## 12. Related Controlled Documents
- SOP-005 QMS Governance and Quality Manual
- SOP-008 Design and Development Control
- SOP-009 Change Management
- SOP-012 Feedback and Complaint Handling
- SOP-013 Regulatory Incident Reporting
- SOP-014 Post-Market Surveillance

## 13. Revision History
| Revision | Effective Date | Change Summary |
|---|---|---|
| R00 | 2026-03-02 | Initial full release with unified software, use-related, and cybersecurity risk method aligned to ISO 14971. |
