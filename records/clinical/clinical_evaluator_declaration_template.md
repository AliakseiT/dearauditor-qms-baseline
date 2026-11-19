---
record_type: clinical_evaluator_declaration
declaration_id: "CED-<product>-<evaluator>-<yyyy-mm-dd>"
product_id: ""
linked_cep_reference: "records/clinical/clinical_evaluation_plan.md"
approval:
  meaning_of_signature: "Approved Clinical Evaluator Competence"
  signer_roles:
    - qa_lead            # management_representative instead when the QA Lead is the evaluator
---

# Clinical Evaluator Declaration Template

One record per person who plans, performs, or reviews the clinical evaluation
(`SOP-025 §6.1`). External experts use the same record. If the person is
not in `matrices/signer_registry.json`, they sign this declaration outside
GitHub; attach the signed copy and a dated CV to the approving PR.

## 1. Evaluator
- Name:
- Organisation / employment status (employee, contractor, external expert):
- Role in this evaluation (planning, literature search, appraisal, analysis, CER author, reviewer):
- Product(s) and CER version(s) covered:

## 2. Qualifications and Experience
State how this person contributes to each competence area the evaluation needs.
Attach a CV.

| Competence area | Evidence (degree, years of practice, prior evaluations, publications) |
|---|---|
| Clinical field and current clinical practice for the condition | |
| Research methodology, study design, biostatistics | |
| Information management / systematic literature searching | |
| Regulatory requirements (MDR, MedDO, relevant MDCG guidance) | |
| Device technology, software, and AI/ML where present | |

Reference for typical expectations: MEDDEV 2.7/1 rev. 4 section 6.4.

## 3. Declaration of Interests
List any financial or other interest in the manufacturer, the device, competing
devices, or the outcome of the evaluation (employment, consultancy, equity,
royalties, research funding, authorship of included studies, relationships with
investigators).

- Interests declared:
- How each interest is managed (e.g. excluded from appraising own studies, second reviewer):

I declare the information above is complete and accurate, and I will update it
if anything changes during the evaluation.

- Signature / date:

## 4. Competence Confirmation
Confirmed by the QA Lead, or by the Management Representative where the QA
Lead is the evaluator named in this record. Nobody confirms their own
competence.

- Confirmed by (role):
- Competence confirmed for the role stated: yes / no
- Conditions or limitations:
- Linked approving PR:
