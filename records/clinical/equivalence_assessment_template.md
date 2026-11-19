---
record_type: equivalence_assessment
equivalence_id: "EQ-<product>-<equivalent-device>-<yyyy-mm-dd>"
product_id: ""
equivalent_device: ""
equivalent_device_manufacturer: ""
linked_cep_reference: "records/clinical/clinical_evaluation_plan.md"
approval:
  meaning_of_signature: "Approved Equivalence Assessment"
  signer_roles:
    - qa_lead
    - management_representative
---

# Equivalence Assessment Template

Implements `SOP-025 §6.5(5)`, MDR Annex XIV Part A section 3, and MDCG 2020-5.
Use one record per claimed equivalent device. Equivalence is decided on
clinical relevance, not on matching specification sheets.

## 1. Identification
- Device under evaluation (name, version, UDI-DI where available):
- Equivalent device (name, version, manufacturer, CE certificate, UDI-DI):
- Own earlier version or another manufacturer's device:

## 2. Access to Data
- Basis for sufficient access to the equivalent device's technical documentation and clinical data:
- For class III or implantable devices of another manufacturer: contract reference allowing ongoing full access (MDR Art. 61(5)):

## 3. Characteristics Comparison
For each row, state the differences and give the scientific evidence that each
difference does not change clinical safety or performance. A difference
without evidence fails the row.

| Characteristic | Device under evaluation | Equivalent device | Differences | Evidence of no clinically significant impact |
|---|---|---|---|---|
| **Technical**: design, specifications, principles of operation | | | | |
| Software architecture, algorithm, model, and training data | | | | |
| Inputs (data types, sources, acquisition devices) and outputs | | | | |
| User interface and information presentation | | | | |
| Interoperability and operating platforms | | | | |
| Risk controls and safety features | | | | |
| **Biological** (usually not applicable to standalone software; state why) | | | | |
| **Clinical**: condition, indication, severity, stage | | | | |
| Patient population | | | | |
| Intended users and use environment | | | | |
| Clinical workflow and the decision the output supports | | | | |
| Clinical performance and expected benefit | | | | |

## 4. Conclusion
- Equivalence demonstrated: yes / no / partially (state for which claims):
- Clinical data from the equivalent device to be used, and for which claims:
- PMCF activities needed to generate data on the device under evaluation:
