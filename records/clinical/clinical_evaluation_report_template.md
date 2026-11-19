---
record_type: clinical_evaluation_report
cer_id: "CER-<product>-<version>-<yyyy-mm-dd>"
product_id: ""
device_version_evaluated: ""
device_class: ""
supersedes: ""
linked_cep_reference: "records/clinical/clinical_evaluation_plan.md"
linked_appraisal_reference: "records/clinical/clinical_data_appraisal.yml"
linked_risk_management_report_reference: ""
linked_pmcf_plan_reference: "records/clinical/pmcf_plan.md"
approval:
  meaning_of_signature: "Approved Clinical Evaluation Report"
  signer_roles:
    - qa_lead
    - management_representative
---

# Clinical Evaluation Report Template

Implements MDR Art. 61(12), Annex XIV Part A section 4, and `SOP-025 §6.10` to
`§6.11`. The structure covers the topics of the notified body clinical
evaluation assessment report (MDCG 2020-13), so a reviewer can find and check
each topic. Write it for a clinical reader. Summarise and appraise sources
rather than copying them, and reference every source so it can be sampled.

## 1. Administrative Particulars
- Manufacturer, device name, version evaluated, UDI-DI, class, conformity assessment route:
- CER version, date, and the CER it supersedes:
- Evaluators, with links to declarations:
- Summary of changes since the last CER:

## 2. Executive Summary
State the conclusion on safety, performance, clinical benefit, and benefit-risk
in a few paragraphs, listing the claims supported and any claims removed.

## 3. Scope and Device Description
- Intended purpose, indications, contraindications, population, users, environment (consistent with `records/mdf/intended_use.md`):
- Device description from a clinical-use point of view: inputs, outputs, and role in the clinical pathway (include a workflow figure):
- Variants, configurations, accessories, platforms:
- Novel features:
- Expected lifetime and factors that may change performance:
- Classification and rationale:

## 4. Clinical Evaluation Plan
- Reference to the approved CEP and any revisions, with reasons:
- GSPRs requiring clinical data:
- Claims, endpoints, and acceptance criteria (table from the CEP):

## 5. State of the Art
Summary of the state of the art assessment, the benchmarks derived, and their
origin.

## 6. Data Identification
- Literature searches: protocol reference, dates, results flow, inclusion and exclusion outcome:
- Manufacturer-held data: analytical, verification and validation, usability, simulated-use, clinical studies:
- PMS, PMCF, vigilance, and complaint data:
- Equivalence (if used): conclusion and reference to the equivalence assessment:
- Art. 61(10) (if used): conclusion and reference to the justification:

## 7. Appraisal
Summary of the appraisal method and outcome per data set, including the data
type (clinical data versus technical or analytical data) and weight. Reference
`records/clinical/clinical_data_appraisal.yml`.

## 8. Analysis
### 8.1 Evidence chain
| Claim / benefit | Valid clinical association | Technical performance | Clinical performance | Clinical benefit | Conclusion |
|---|---|---|---|---|---|
| | | | | | |

### 8.2 Performance
Results against each acceptance criterion and the state-of-the-art benchmark.
For AI-enabled software, include subgroup and edge-case performance.

### 8.3 Safety
Clinical risks, side effects, and effectiveness of risk controls, including
evidence that use-related controls work under normal conditions of use.

### 8.4 Benefit-risk
Weigh the demonstrated benefits against residual risks, compared with the
state of the art.

### 8.5 GSPR conformity
| GSPR | Evidence | Conclusion |
|---|---|---|
| 1 | | |
| 8 | | |

### 8.6 Claims check (Art. 7)
Confirm every claim in the intended purpose, IFU, labelling, website, and
marketing material is supported. List claims changed or withdrawn.

## 9. Consistency with Other Documentation
- Risk management file (residual risks, benefit-risk conclusion):
- Accompanying information (IFU warnings, limitations, performance information):
- PMS plan and PMCF plan:
- SSCP (class III and implantables) / PSUR:

## 10. Uncertainties and Post-Market Actions
| Uncertainty | Impact | PMS / PMCF action | Timeline |
|---|---|---|---|
| | | | |

## 11. Conclusions
- Safety:
- Performance:
- Clinical benefit:
- Benefit-risk acceptability:
- Sufficiency of clinical evidence for the class and claims:

## 12. Next Update
- Planned date and justification:
- Triggers for an earlier update:

## 13. References
Full citation list, numbered to match references in the text.

## 14. Signatures
- Evaluators (name, role, date):
- QA Lead approval:
- Management Representative approval:
- External evaluator sign-off attached to the approving PR (where applicable):
- Linked approving PR:
