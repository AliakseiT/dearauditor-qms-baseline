---
record_type: literature_search_protocol
protocol_id: "LSP-<product>-<yyyy-mm-dd>"
product_id: ""
linked_cep_reference: "records/clinical/clinical_evaluation_plan.md"
approval:
  meaning_of_signature: "Approved Literature Search Protocol"
  signer_roles:
    - qa_lead
---

# Literature Search Protocol and Report Template

Implements `SOP-025 §6.5(2)`. Approve sections 1 to 4 before searching.
Section 5 records the execution. Someone else must be able to repeat the
search and get the same results. Methodological reference: MEDDEV 2.7/1 rev. 4
appendix 5.

## 1. Search Questions
Write one block per search. Typical searches: state of the art; device under
evaluation; equivalent device; targeted searches for specific risks, features,
or populations.

| Search ID | Purpose | Question (e.g. PICO: population, intervention/index test, comparator, outcome) |
|---|---|---|
| S-SOTA-01 | State of the art | |
| S-DUE-01 | Device under evaluation | |

## 2. Sources
- Bibliographic databases (e.g. PubMed/MEDLINE, Embase, Cochrane Library):
- Registries and trial databases (e.g. ClinicalTrials.gov, EU CTR):
- Vigilance and safety databases (e.g. FDA MAUDE, national competent authority notices):
- Clinical guidelines and professional society sources:
- Other (conference proceedings, preprint servers; state how they are weighted):

## 3. Search Strategy
| Search ID | Database | Search string (exact) | Filters | Date range |
|---|---|---|---|---|
| | | | | |

## 4. Selection Criteria
- Inclusion criteria:
- Exclusion criteria (each exclusion must map to one of these):
- Screening method (title/abstract then full text; number of reviewers; how disagreements are resolved):

## 5. Execution Log
| Search ID | Run date | Run by | Hits | After de-duplication | After title/abstract | After full text | Included |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

Excluded full-text articles with reason:

| Reference | Search ID | Exclusion reason |
|---|---|---|
| | | |

Attach the database export and a PRISMA-style flow diagram.

## 6. Deviations
Changes to the protocol after approval, with reasons:

## 7. Output
Included references go to `records/clinical/clinical_data_appraisal.yml`.
Unfavourable results are included, not filtered out.
