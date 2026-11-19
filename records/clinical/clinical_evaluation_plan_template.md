---
record_type: clinical_evaluation_plan
cep_id: "CEP-<product>-<version>"
product_id: ""
device_version: ""
device_class: ""
linked_intended_use_reference: "records/mdf/intended_use.md"
linked_classification_reference: "records/mdf/classification_decision.md"
linked_risk_management_plan_reference: "records/risk/risk_management_plan.md"
linked_pmcf_plan_reference: "records/clinical/pmcf_plan.md"
approval:
  meaning_of_signature: "Approved Clinical Evaluation Plan"
  signer_roles:
    - qa_lead
    - management_representative
---

# Clinical Evaluation Plan Template

Implements MDR Annex XIV Part A 1(a) and `SOP-025 §6.4`. Approve the plan
before data identification starts. Later changes to endpoints or acceptance
criteria are revisions of this plan, with the reason recorded, so it is clear
they were not fitted to the results.

Replace the guidance text with product-specific content.

## 1. Scope of the Evaluation
- Device name, version(s), variants, and configurations covered:
- First evaluation, or update of CER `<id>`; reason for update:
- Evaluation team and declarations (`records/clinical/clinical_evaluator_declaration_*.md`):

## 2. Device and Clinical Context
Summarise from the approved intended use record; do not restate it differently.

- Intended purpose (one sentence):
- Medical condition, indications, contraindications:
- Patient population and relevant sub-populations:
- Intended users and expected expertise:
- Use environment:
- Software inputs (data types, sources, quality requirements):
- Software outputs and how they are used in the clinical workflow:
- Position in the patient pathway, and what changes compared with care without the device:
- Normal conditions of use, including realistic variation and foreseeable misuse:
- Novel aspects (technology, application, population, workflow, user interaction):
- Expected lifetime and factors that may change performance over time:

## 3. Classification
- Class and rule(s) applied (all Annex VIII rules considered):
- Rule 11 significance of information / healthcare situation:
- Consequences for the level of evidence expected:

## 4. GSPRs Requiring Clinical Data
| GSPR | Why clinical data is needed | Planned evidence |
|---|---|---|
| 1 | Performance and benefit-risk under normal conditions of use | |
| 8 | Risks and side effects minimised and acceptable against benefits | |
| | | |

## 5. Claims, Clinical Benefits, and Endpoints
List every claim that will appear in the intended purpose, IFU, labelling,
website, or marketing material (Art. 7).

| ID | Claim / intended clinical benefit | Evidence-chain level (VCA / technical / clinical performance / clinical benefit) | Outcome parameter | Acceptance criterion | Source of criterion (SotA ref.) |
|---|---|---|---|---|---|
| C-01 | | | | | |

## 6. Safety Evaluation
- Clinical risks in scope (from the risk management file), including incorrect, delayed, unavailable, or misinterpreted output:
- Methods for evaluating residual risks and side effects:
- Use-related risk controls whose effectiveness needs usability, simulated-use, or clinical evidence:

## 7. Benefit-Risk Acceptability
- Parameters used to judge benefit-risk, based on the state of the art:
- Acceptance thresholds and how they were derived:

## 8. Evidence Strategy
- Data sources to be searched (state of the art, device under evaluation, equivalent device, targeted searches):
- Literature search protocol: `records/clinical/literature_search_protocol.md`
- Equivalence intended: yes / no; candidate device(s) and data-access basis:
- Art. 61(10) intended: yes / no; preliminary rationale:
- Appraisal method and weighting scheme (e.g. MDCG 2020-6 Appendix III; MEDDEV 2.7/1 rev. 4 section 9):
- Handling of AI-specific evidence (dataset representativeness, subgroup performance, edge cases):

## 9. Clinical Development Plan
| Milestone | Activity (e.g. analytical study, MRMC study, clinical investigation, PMCF study) | Question answered | Acceptance criteria | Timing (pre/post market) |
|---|---|---|---|---|
| | | | | |

## 10. Update Frequency
- Planned CER update interval and justification (class, risk, novelty, pace of the state of the art):
- Out-of-cycle triggers (SOP-025 §6.13):

## 11. Approval Record
- Approval date:
- Linked approving PR:
