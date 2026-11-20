---
record_type: classification_decision
decision_id: "CLASS-<product>-<yyyy-mm-dd>"
product_id: ""
jurisdiction: ""
linked_intended_use_reference: "records/mdf/intended_use.md"
linked_mdf_index_reference: "records/mdf/medical_device_file_index.md"
approval:
  meaning_of_signature: "Approved Classification Decision"
  signer_roles:
    - qa_lead
    - management_representative
---

# Product Classification Decision Template

This template shows one workable Markdown-first classification decision record.

Replace the example text below with product-specific content before approval.

## Metadata
- Decision ID:
- Product ID:
- Jurisdiction:
- Decision Date:
- Owner:

## Product Description
- Intended Use:
- Target User / Use Environment:
- Claims in Scope:

## Classification Analysis
- Applicable Rule or Pathway:
- Classification Outcome:
- Rationale:
- Supporting References:

## Software Classification Detail (EU MDR / MedDO)
Complete this section for medical device software. Guidance: MDCG 2019-11 rev. 1, MDCG 2021-24 rev. 1, IMDRF/SaMD WG/N12 and N81. Base every answer on how the software is realistically used under normal conditions of use (`SOP-025 §6.3`). Clinician review of the output, disclaimers, and restrictive wording do not by themselves lower the significance of the information.

### All Annex VIII rules considered
| Rule | Applies? | Resulting class | Reason |
|---|---|---|---|
| Rule 11 | | | |
| Other Annex VIII rules that may apply (e.g. Rules 9, 10, 12 for active devices) | | | |
| Implementing rule 3.3 (software driving or influencing a device takes that device's class) | | | |

Highest resulting class:

### Rule 11, first paragraph: information used for diagnostic or therapeutic decisions
- Significance of the information to the healthcare decision (treat or diagnose / drives clinical management / informs clinical management), with reasoning:
- How much users rely on the output in practice; whether there is a realistic opportunity to check the output independently before acting:
- State of the healthcare situation or condition (critical / serious / non-serious), judged by what happens to the patient after an incorrect or late decision rather than the patient's current presentation:
- Worst credible harm from an incorrect, delayed, or unavailable output:

Reference matrix (MDCG 2019-11 rev. 1, adapted from IMDRF/SaMD WG/N12; illustrative, not a substitute for the rule text):

| State of the situation or condition | Treat or diagnose | Drives clinical management | Informs clinical management |
|---|---|---|---|
| Critical | Class III | Class IIb | Class IIa |
| Serious | Class IIb | Class IIa | Class IIa |
| Non-serious | Class IIa | Class IIa | Class IIa |

### Rule 11, second paragraph: monitoring of physiological processes
- Physiological process monitored:
- Whether variations in vital parameters could result in immediate danger to the patient in the intended clinical context (consider the setting and patient condition, not only the parameter):
- Whether the software also triggers or prioritises clinical action (if so, reassess under the first paragraph):

### Rule 11, third paragraph: all other software
Software not caught by the first or second paragraph, nor by another rule, is
class I. The reference matrix above illustrates only the first paragraph, so
class I does not appear in it.
- Reason neither the first nor the second paragraph applies:

## Follow-Up
- Dossier Updates Required:
- Submission or Registration Impact:
- Linked Risk / V&V / Release References:
- Clinical evidence level implications for the clinical evaluation plan (`records/clinical/clinical_evaluation_plan.md`):
