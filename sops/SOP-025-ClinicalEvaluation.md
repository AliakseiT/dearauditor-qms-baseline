---
sop_id: SOP-025
title: Clinical Evaluation and Post-Market Clinical Follow-up
revision: R00
revision_date: 2026-11-19
status: Published
owner_role: qa_lead
approver_role: management_representative
---

## 1. Purpose
Define how the organisation plans, conducts, documents, and maintains the
clinical evaluation of each medical device software product, and how
post-market clinical follow-up (PMCF) keeps that evaluation current. The
procedure implements Regulation (EU) 2017/745 (MDR) Article 61 and Annex XIV,
which the Swiss Medical Devices Ordinance (MedDO) applies through its reference
to the MDR. It also supplies the clinical evaluation part of design validation
required by ISO 13485:2016 clause 7.3.7.

Clinical evaluation is a continuous, evidence-based argument. It is not a
document assembled once before submission. Its output must let a qualified
reviewer who did not take part in it follow how each claim about safety,
performance, and clinical benefit is supported. Where the evidence does not
support a claim, the claim must change.

## 2. Scope
Applies to every product that qualifies as a medical device (including software
as a medical device and software driving or influencing a device) in a
jurisdiction recorded in `matrices/regulatory_market_scope.yml`, for every
class, from the start of design and development until the product is retired.

Software components without their own medical intended purpose (libraries,
APIs, algorithm modules) are evaluated as part of the device they are
integrated into. A component placed on the market on its own, with its own
intended purpose, is evaluated as a device for each claimed purpose and each
combination with other devices for which compatibility is claimed.

In-house devices under MDR Art. 5(5) follow
`records/mdf/in_house_health_institution_justification_template.md`; this SOP
applies to them only where the health institution chooses to use it to show
conformity with the applicable Annex I requirements. Performance evaluation of
in vitro diagnostic software under Regulation (EU) 2017/746 is out of scope.

## 3. Inputs
- Approved intended use and claims (`records/mdf/intended_use_template.md`)
- Classification decision (`records/mdf/classification_decision_template.md`)
- Device description, including variants, configurations, and lifetime
- Risk management file under `SOP-018`, including benefit-risk inputs
- Usability engineering file under `SOP-019`
- Verification and validation evidence under `SOP-008` and `WI-001`
- Post-market surveillance data under `SOP-014`, complaints under `SOP-012`,
  and incidents under `SOP-013`
- For AI-enabled software: data governance and model documentation under
  `SOP-022` and, where in scope, `SOP-024`

## 4. Outputs
- Clinical evaluation plan (CEP), including the clinical development plan
- State of the art (SotA) assessment
- Literature search protocol and report
- Appraisal of every data set considered
- Equivalence assessment or Art. 61(10) justification, where used
- Clinical evaluation report (CER)
- PMCF plan and PMCF evaluation report, or a justified decision that PMCF
  activities beyond PMS are not needed
- Updates to the risk management file, accompanying information, and claims

## 5. Roles and Responsibilities
| Role | Responsibilities |
|---|---|
| QA Lead | Owns this SOP and each product's clinical evaluation file; confirms evaluator competence; checks that the CER, risk file, PMS/PMCF documents, and accompanying information stay consistent; approves CEP, CER, and PMCF records. |
| Management Representative | Approves the evaluation strategy for new devices and any use of equivalence or Art. 61(10); provides resources; receives CER conclusions in management review. |
| Engineering Lead | Supplies device description, technical and analytical performance evidence, change impact information, and data for AI-enabled functions. |
| Usability Lead | Supplies evidence on use-related risk controls and on user performance with the device under representative conditions. |
| Clinical evaluator(s) | Plan and perform the evaluation and author the CER. Not a QMS role: a competence requirement assigned per product under §6.1 and recorded in the CEP. May be employees or external experts. |

## 6. Procedure

### 6.1 Evaluator Competence and Independence
1. For each product, name the people who will plan, perform, and review the
   clinical evaluation. Together they must cover: the clinical field and
   current clinical practice for the condition concerned; research methodology,
   including study design and biostatistics; information management for
   systematic literature searches; regulatory requirements; and the device
   technology, including AI/ML where present.
2. Record each evaluator's qualifications and experience and a signed
   declaration of interests using
   `records/clinical/clinical_evaluator_declaration_template.md`. A declared
   interest is not automatically disqualifying; record how it is managed.
3. The QA Lead confirms competence before the CEP is approved. Guidance on
   expected qualifications: MEDDEV 2.7/1 rev. 4 section 6.4.

### 6.2 Define the Device and Its Clinical Context
1. The intended purpose must be stable and specific before conformity
   assessment starts. It states the medical purpose, indications and
   contraindications, patient population, intended users and their expertise,
   use environment, software inputs and outputs, and how the output is used in
   the clinical workflow (Art. 2(12); Annex II 1.1). Use
   `records/mdf/intended_use_template.md`.
2. Describe normal conditions of use as they will realistically occur: user
   experience levels, workload, workflow variants, input variability, and
   reasonably foreseeable misuse. Do not define the intended purpose around
   ideal behaviour or levels of oversight that will not exist in practice.
3. Describe where the software sits in the patient pathway, what it changes in
   that pathway, and how that change is expected to lead to clinical benefit.
   A workflow diagram is recommended.
4. Identify novelty: new technology, new clinical application, new population,
   changed workflow, or new user interaction. Each novel aspect must be
   addressed explicitly in the evaluation strategy.
5. State the expected lifetime and the factors that may change safety or
   performance over it: software updates, platform and dependency changes,
   changes in clinical practice, drift in input data, and adaptive behaviour.
6. A significant change to the intended purpose is a design change under
   `SOP-009`. It requires reassessment of classification, risk, and the
   clinical evaluation, not an editorial update.

### 6.3 Classification Check
1. Confirm the classification decision covers every applicable MDR Annex VIII
   rule, not only Rule 11, and applies the highest resulting class.
2. For Rule 11, assess the significance of the information to the healthcare
   decision and the seriousness of the healthcare situation or condition, using
   MDCG 2019-11 rev. 1 and IMDRF/SaMD WG/N12. Base the assessment on realistic
   use: a clinician making the final decision, disclaimers, or restrictive
   wording do not by themselves lower the significance of the information.
3. Record the rationale in `records/mdf/classification_decision_template.md`.
   The class sets the level of clinical evidence expected.

### 6.4 Clinical Evaluation Plan (Annex XIV Part A 1(a))
Prepare and approve a CEP using
`records/clinical/clinical_evaluation_plan_template.md` before evidence is
identified. The CEP shall contain, as a minimum:
1. The general safety and performance requirements (GSPRs) that need clinical
   data. GSPR 1 and GSPR 8 always apply; assess others such as risk control
   effectiveness, usability, and performance over lifetime.
2. The intended purpose, target groups, indications, and contraindications.
3. The intended clinical benefits, each with specified, measurable clinical
   outcome parameters.
4. The methods for examining clinical safety, including residual risks and
   side effects.
5. The parameters and acceptance criteria used to judge benefit-risk
   acceptability, derived from the state of the art.
6. The evidence strategy: the evidence chain in §6.6, the data sources to be
   used, whether equivalence or Art. 61(10) is intended, and the appraisal
   method.
7. A clinical development plan describing how evidence will be generated
   before and after market placement, with milestones and acceptance criteria,
   and a link to the PMCF plan.

### 6.5 Identify Data and Establish the State of the Art (Annex XIV Part A 1(b))
1. Identify all available data relevant to the device, its equivalent device
   where used, and the state of the art: clinical investigations, scientific
   literature, manufacturer-held pre-clinical and clinical data, PMS and PMCF
   data, registries, usability and simulated-use studies, and retrospective
   performance studies.
2. Run literature searches against a written protocol
   (`records/clinical/literature_search_protocol_template.md`) with defined
   questions, databases, search strings, inclusion and exclusion criteria, and
   date ranges, so that a second person could repeat the search. Separate
   searches are normally needed for the state of the art, for the device under
   evaluation (and any equivalent device), and for specific risks, features,
   or populations.
3. Include favourable and unfavourable data. Excluding data requires a
   documented reason.
4. Write the state of the art assessment using
   `records/clinical/state_of_the_art_assessment_template.md`. It describes the
   condition and current clinical management, alternative technologies and
   comparable devices, their claims and performance, the risks of the existing
   care pathway, and from these derives the benchmarks and acceptance criteria
   used in §6.4(5). Record where each benchmark came from and why it is an
   appropriate expectation. The state of the art is generally acknowledged
   good practice, not necessarily the newest technology (MDCG 2020-1).
5. Equivalence may only be claimed when technical, biological, and clinical
   characteristics are shown to be equivalent and the manufacturer has
   sufficient access to the other device's data (Annex XIV Part A 3;
   Art. 61(5) for class III and implantable devices; MDCG 2020-5). For
   software, technical and clinical equivalence usually needs detailed
   justification, including algorithms, inputs, outputs, user interface, and
   workflow. Use `records/clinical/equivalence_assessment_template.md`. Any
   difference must be shown, with evidence, not to change clinical safety or
   performance.

### 6.6 Evidence Chain for Software
Assess and report each link separately. Evidence for one link is not evidence
for the next (MDCG 2020-1; IMDRF/SaMD WG/N41).
1. **Valid clinical association**: the output is associated with the targeted
   clinical condition or physiological state.
2. **Technical (analytical) performance**: the software reliably and
   accurately produces the intended output from the input data. Choose metrics
   relevant to the clinical task; justify why a chosen metric reflects
   clinically meaningful performance.
3. **Clinical performance**: using the device, in its intended workflow and
   with its intended users, achieves the intended effect on the clinical
   process.
4. **Clinical benefit**: the positive impact on patient health, patient
   management, or public health (Art. 2(53)).

Analytical testing on previously collected clinical datasets produces
technical or analytical data about the algorithm. It does not, by itself,
produce clinical data within Art. 2(48), which comes from the clinical use of
the device. Label every data set accordingly in the appraisal.

### 6.7 Appraise the Data (Annex XIV Part A 1(c))
1. Define the appraisal method in the CEP and apply it consistently to every
   data set using `records/clinical/clinical_data_appraisal_template.yml`.
2. For each data set record at least: relevance to the device, intended
   purpose, users, population, and environment; representativeness of normal
   conditions of use; methodological quality, including study design, sample
   size, statistics, and bias; the type of data (clinical data, technical or
   analytical data, or other); which claims, endpoints, or risks it
   contributes to; and its overall weight.
3. Use a recognised hierarchy of evidence to weight data, such as MDCG 2020-6
   Appendix III together with MEDDEV 2.7/1 rev. 4 section 9 and appendix 6.
4. Summarise the appraisal as gaps, uncertainties, and open questions for
   §6.8.

### 6.8 Generate New Data (Annex XIV Part A 1(d))
1. Where the appraisal shows that the evidence is not sufficient, plan
   additional activities. Choose the activity type for the question it has to
   answer, for example: clinical investigation; prospective or retrospective
   clinical performance study; multi-reader multi-case (MRMC) or other
   simulated-use study; summative usability evaluation; registry or real-world
   data study.
2. Write a protocol before execution with justified objectives, clinically
   meaningful endpoints linked to the intended purpose and state of the art,
   representative conditions of use (or justified limitations), a justified
   sample size, pre-defined statistical methods and acceptance criteria,
   unbiased data collection, and follow-up duration.
3. Clinical investigations follow MDR Articles 62 to 82, Annex XV, and
   ISO 14155:2020. PMCF investigations also follow Art. 74. Studies with human
   participants require the applicable ethics and legal approvals.
4. Report results against the protocol, including deviations, unmet
   endpoints, limitations, and bias, and their effect on conclusions.

### 6.9 Article 61(10) Pathway
1. Art. 61(10) may be used only where demonstration of conformity based on
   clinical data is not appropriate. Absence of clinical data, or difficulty
   collecting it, is not a justification.
2. Record the justification using
   `records/clinical/article_61_10_justification_template.md`. It must show:
   (a) why clinical data are not appropriate, based on the risk management
   results, the device's interaction with the patient and the clinical process,
   the intended clinical performance, and the claims; (b) why the chosen
   non-clinical evidence sources are suitable; (c) how they support each
   clinically relevant safety and performance objective; and (d) why the
   totality of evidence is sufficient for the relevant GSPRs.
3. The more directly the output determines diagnosis or treatment, the harder
   this justification becomes. For decision-support software, consider whether
   simulated-use, MRMC, or workflow studies are needed to bridge from
   analytical performance to clinical performance.
4. The Management Representative approves any use of Art. 61(10). Clinical
   data that becomes available after market placement, through PMS or PMCF,
   must still be collected and evaluated.

### 6.10 Analyse and Conclude (Annex XIV Part A 1(e))
1. Analyse the whole body of appraised evidence against the CEP endpoints,
   claims, GSPRs, and state-of-the-art benchmarks. Conclusions rest on the
   totality of evidence, not on one data set.
2. Confirm every claim made anywhere (intended purpose, labelling, IFU,
   website, marketing material, technical documentation) is supported by the
   evidence (Art. 7). Remove or reword unsupported claims.
3. Evaluate clinical risks together with the effectiveness of risk controls.
   For controls that depend on how users notice, understand, and act on
   information (warnings, alerts, confirmations, workflow steps), technical
   verification that the control exists is not sufficient; use usability,
   simulated-use, or clinical evidence that it works under normal conditions of
   use.
4. Decide whether the benefit-risk ratio is acceptable compared with the state
   of the art. Record residual uncertainties and assign each one to PMS or PMCF
   (§6.12).
5. Keep conclusions consistent with the risk management file under `SOP-018`.
   Residual risks and limitations must be reflected in the accompanying
   information.

### 6.11 Clinical Evaluation Report (Art. 61(12); Annex XIV Part A 4)
1. Write the CER using
   `records/clinical/clinical_evaluation_report_template.md`. Its structure
   follows the topics a notified body covers in the clinical evaluation
   assessment report (MDCG 2020-13), so each topic can be found and verified.
2. The CER summarises and critically appraises sources rather than
   reproducing them, and references each source so that a reviewer can sample
   it. It reports favourable and unfavourable findings.
3. The CER identifies the software version evaluated and is signed by the
   evaluators and approved by the QA Lead.

### 6.12 Post-Market Clinical Follow-up (Annex XIV Part B)
1. Prepare a PMCF plan using `records/clinical/pmcf_plan_template.md` as part
   of the PMS plan under `SOP-014` (Annex III Section 1(b)). The plan targets the
   residual uncertainties from §6.10, with research questions, general and
   specific methods, rationale, and timelines (MDCG 2020-7).
2. Specific PMCF methods are normally expected when the device or its
   application is novel, when the evaluation relies on equivalence or
   Art. 61(10), when questions remain about sub-populations or use scenarios,
   or when AI functionality leaves uncertainty about performance stability,
   bias, drift, or human oversight. Where no specific method is planned,
   justify it in the PMCF plan.
3. Software can often collect real-world performance and use data directly.
   Where lawful and proportionate under `SOP-023`, use it to confirm
   pre-market assumptions.
4. Report results in a PMCF evaluation report
   (`records/clinical/pmcf_evaluation_report_template.md`; MDCG 2020-8). The
   PMCF evaluation report forms part of the CER and the technical
   documentation (Annex XIV Section 7). Feed its conclusions into the CER, risk management file, and, where applicable,
   the summary of safety and clinical performance (SSCP, Art. 32) and periodic
   safety update report (PSUR, Art. 86).

### 6.13 Updating the Clinical Evaluation (Art. 61(11))
1. Update the CER at a frequency set in the CEP and justified by class, risk,
   novelty, and how fast the state of the art changes. Class III and
   implantable devices are updated at least annually with PMCF data.
2. Update it out of cycle when there is a significant safety signal, a PMCF
   result, a change in the state of the art that affects the benchmarks, a
   design change that may affect clinical performance or safety under
   `SOP-009`, or a change to intended purpose or claims.
3. The CER always reflects the current released device version. Superseded
   versions remain retrievable under `SOP-001`.

### 6.14 AI-Enabled Software
In addition to the steps above:
1. Show performance across the reasonably foreseeable range of inputs,
   including atypical, ambiguous, incomplete, and edge cases, not only average
   performance. Pay attention to failures users are unlikely to detect; the
   design should not shift onto the user the job of catching errors the device
   should prevent.
2. Assess the representativeness of training, tuning, and test data against
   the intended population and environment, and reflect known data limitations
   in the intended purpose, warnings, and limitations.
3. For generative models, show that outputs stay consistent and appropriate
   for the intended purpose across foreseeable inputs.
4. For models that change after market placement, show how performance
   changes are detected and controlled, and why the lifecycle approach chosen
   is appropriate compared with controlled versioned updates.
5. Evidence produced under `SOP-022` and, where applicable, `SOP-024` for data
   governance, transparency, human oversight, robustness, and post-market
   monitoring can be reused in the clinical evaluation after appraisal under
   §6.7. Alignment with one framework does not by itself show compliance with
   the other (MDCG 2025-6).

## 7. Required Records
- Clinical evaluator declarations (`records/clinical/clinical_evaluator_declaration_template.md`)
- Clinical evaluation plan (`records/clinical/clinical_evaluation_plan_template.md`)
- Literature search protocol and report (`records/clinical/literature_search_protocol_template.md`)
- State of the art assessment (`records/clinical/state_of_the_art_assessment_template.md`)
- Clinical data appraisal (`records/clinical/clinical_data_appraisal_template.yml`)
- Equivalence assessment, where used (`records/clinical/equivalence_assessment_template.md`)
- Art. 61(10) justification, where used (`records/clinical/article_61_10_justification_template.md`)
- Protocols and reports for any data-generating activity under §6.8
- Clinical evaluation report (`records/clinical/clinical_evaluation_report_template.md`)
- PMCF plan and PMCF evaluation report (`records/clinical/pmcf_plan_template.md`, `records/clinical/pmcf_evaluation_report_template.md`)

All records are kept in the product's medical device file under `SOP-007`.

## 8. Traceability
| Standard Clause | Control in this SOP |
|---|---|
| Regulation (EU) 2017/745 Art. 61(1) | GSPR conformity and level of clinical evidence (§6.4, §6.10). |
| Regulation (EU) 2017/745 Art. 61(1) third subparagraph, Art. 61(3), Annex XIV Part A Section 1 | Plan, identify, appraise, generate, analyse (§6.4 to §6.10). |
| Regulation (EU) 2017/745 Art. 61(4) to (6), Annex XIV Part A 3 | Clinical investigations for class III and implantables; equivalence (§6.5(5), §6.8). |
| Regulation (EU) 2017/745 Art. 61(10) | Justification for non-clinical evidence (§6.9). |
| Regulation (EU) 2017/745 Art. 61(11), (12); Annex XIV Part A 4 | Updates and CER (§6.11, §6.13). |
| Regulation (EU) 2017/745 Annex XIV Part B | PMCF (§6.12). |
| Regulation (EU) 2017/745 Art. 7 | Claims supported by evidence (§6.10(2)). |
| MedDO (SR 812.213) | Applies the MDR clinical evaluation requirements in Switzerland. |
| ISO 13485:2016 7.3.7 | Clinical evaluation as part of design and development validation. |
| ISO 14971:2019 7.4, 8 | Benefit-risk inputs aligned with the risk management file (§6.10(5)). |

The clause-level mapping is maintained in
`matrices/mdr_clinical_evaluation_gap_analysis.yml`.

## 9. Related Controlled Documents
- QM-001 Quality Manual
- SOP-001 Document and Record Control
- SOP-007 Medical Device File Control
- SOP-008 Design and Development Control
- SOP-009 Change Management
- SOP-011 Competence, Training, and Awareness
- SOP-012 Feedback and Complaint Handling
- SOP-013 Regulatory Incident Reporting
- SOP-014 Post-Market Surveillance
- SOP-018 Risk Management (ISO 14971:2019)
- SOP-019 Usability Engineering (IEC 62366-1:2015+A1:2020)
- SOP-022 AI Management System (ISO/IEC 42001:2023)
- SOP-023 Data Protection and Privacy Management
- SOP-024 AI Act Provider QMS (EN 18286:2026)
- WI-001 Verification and Validation Execution
- `records/clinical/` record family
- `matrices/mdr_clinical_evaluation_gap_analysis.yml`

## 10. Revision History
| Revision | Revision Date | Change Summary |
|---|---|---|
| R00 | 2026-11-19 | Initial release of the clinical evaluation and PMCF procedure under MDR Art. 61 and Annex XIV, with software-specific controls for intended purpose, classification, the evidence chain from valid clinical association to clinical benefit, the Art. 61(10) pathway, and AI-enabled software. |
