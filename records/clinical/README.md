# records/clinical - Clinical evaluation and PMCF records

Record templates for `sops/SOP-025-ClinicalEvaluation.md`, which implements
Regulation (EU) 2017/745 (MDR) Article 61 and Annex XIV for medical device
software. Copy them into the product's designated repository and keep the
filled-in records in the medical device file under `SOP-007`. The approved
intended use and classification decision these records depend on stay in
`records/mdf/`.

| Template | Purpose | SOP-025 |
|---|---|---|
| `clinical_evaluator_declaration_template.md` | Evaluator qualifications, experience, and declaration of interests. | §6.1 |
| `clinical_evaluation_plan_template.md` | CEP per Annex XIV Part A 1(a), including the clinical development plan. | §6.4 |
| `literature_search_protocol_template.md` | Reproducible literature search protocol and results log. | §6.5 |
| `state_of_the_art_assessment_template.md` | Clinical context, alternatives, and the benchmarks used as acceptance criteria. | §6.5 |
| `equivalence_assessment_template.md` | Technical, biological, and clinical equivalence with data-access evidence. | §6.5(5) |
| `clinical_data_appraisal_template.yml` | Appraisal of each data set: relevance, representativeness, quality, data type, weight. | §6.6, §6.7 |
| `article_61_10_justification_template.md` | The four-part justification for relying on non-clinical evidence. | §6.9 |
| `clinical_evaluation_report_template.md` | CER, structured on the topics of the notified body assessment report (MDCG 2020-13). | §6.10, §6.11 |
| `pmcf_plan_template.md` | PMCF plan per Annex XIV Part B (MDCG 2020-7). | §6.12 |
| `pmcf_evaluation_report_template.md` | PMCF evaluation report (MDCG 2020-8). | §6.12 |

## Keeping the Record Set Small

The CEP, CER, PMCF plan, PMCF evaluation reports, and evaluator declarations
are separate approved records. The state of the art assessment, literature
search report, appraisal, equivalence assessment, and Art. 61(10)
justification may instead be appendices of the CER, provided each still has
the content its template asks for and can be found and sampled by a reviewer.
The literature search protocol itself (sections 1 to 4) must still be
approved before the search runs. Refer to a table in another record rather
than copying it: for example, the CER points to the CEP claims table instead
of repeating it.

External clinical evaluators who are not registered signers sign outside
GitHub; their signed declaration, CV, and sign-off are attached to the
approving PR (`SOP-025 §6.1`).

## Sources

The templates are written from the legal text and public guidance:
Regulation (EU) 2017/745 Art. 2, 7, 32, 61, 74, 86 and Annexes I, II, III, XIV,
XV; MDCG 2019-11 rev. 1, MDCG 2020-1, MDCG 2020-5, MDCG 2020-6, MDCG 2020-7,
MDCG 2020-8, MDCG 2020-13, MDCG 2021-24 rev. 1, MDCG 2025-6; MEDDEV 2.7/1
rev. 4; IMDRF/SaMD WG/N12, N41, and N81. Standards (ISO 14155:2020,
ISO 14971:2019, IEC 62366-1, ISO/DIS 18969) are cited by number only; their
text is not reproduced. The BSI white paper "Clinical Evaluation of Software as
a Medical Device (SaMD) for Conformity Assessment" (2026) was used as
informative background on common notified-body findings; none of its text or
tables are reproduced.
