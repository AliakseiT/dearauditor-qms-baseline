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
procedure implements Regulation (EU) 2017/745 (MDR) Article 61 and Annex XIV.
For Switzerland, the Medical Devices Ordinance (MedDO, SR 812.213) requires the
same clinical evaluation: Art. 21(4) makes it part of demonstrating conformity
with the general safety and performance requirements, and Art. 46(3) requires
manufacturers to conduct it in accordance with MDR Art. 61, including
amendments adopted by delegated acts, and Annex XIV, and to update it with
PMCF results. It also supplies
the clinical evaluation part of design validation required by ISO 13485:2016
clause 7.3.7.

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

The steps apply to every class, but their depth does not. Scale the volume and
type of evidence to the class, the novelty of the device, the severity of the
clinical risks, and how directly the output affects patient management, and
record that reasoning in the CEP. A class I device with a narrow,
well-established purpose may need little more than a focused literature and
state of the art review; a novel class IIb or III device usually needs data
generated for that device.

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
| QA Lead | Owns this SOP and each product's clinical evaluation file; confirms evaluator competence; checks that the CER, risk file, PMS/PMCF documents, and accompanying information stay consistent; approves every clinical evaluation record. |
| Management Representative | Co-approves with the QA Lead the CEP, CER, PMCF plan, any equivalence assessment, and any use of Art. 61(10); confirms evaluator competence where the QA Lead is also an evaluator; provides resources; receives CER conclusions in management review. |
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
3. The QA Lead confirms competence before the CEP is approved. Nobody
   confirms their own competence: where the QA Lead is also an evaluator, the
   Management Representative confirms instead. Guidance on expected
   qualifications: MEDDEV 2.7/1 rev. 4 section 6.4.
4. External evaluators who are not in `matrices/signer_registry.json` sign
   their declaration, and their sign-off of the CEP or CER, outside GitHub.
   Attach the signed documents and a dated CV to the record's approving PR,
   and record there which internal signer checked them.

### 6.2 Define the Device and Its Clinical Context
1. The intended purpose must be stable and specific before conformity
   assessment starts. It states the medical purpose, indications and
   contraindications, patient population, intended users and their expertise,
   use environment, software inputs and outputs, and how the output is used in
   the clinical workflow (Art. 2(12); Annex II 1.1). Use
   `records/mdf/intended_use_template.md`.
2. Describe normal conditions of use as they will realistically occur: user
   experience levels, workload, workflow variants, input variability, and
   reasonably foreseeable misuse. An intended purpose that only holds if users
   behave perfectly, or if supervision is stricter than sites actually provide,
   is not acceptable.
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
4. The methods for examining the qualitative and quantitative aspects of
   clinical safety, with explicit reference to residual risks and side effects.
5. The parameters and acceptance criteria used to judge benefit-risk
   acceptability, derived from the state of the art.
6. The evidence strategy: the evidence chain in §6.6, the data sources to be
   used, whether equivalence or Art. 61(10) is intended, and the appraisal
   method.
7. A clinical development plan describing how evidence will be generated
   before and after market placement, with milestones and acceptance criteria,
   and a link to the PMCF plan.
8. How benefit-risk questions raised by particular components (medicinal
   substances, non-viable tissues of human or animal origin) are addressed.
   For standalone software this is normally "not applicable"; say so and give
   the reason, because the item is checked.

Approve the CEP in two steps so that acceptance criteria are never set after
seeing the device's own results. The first approval covers scope, the
questions to answer, and the state of the art search protocol. Once the state
of the art assessment (§6.5(4)) is done, a CEP revision adds the benchmarks
and acceptance criteria, and must be approved before any device-specific data
set is appraised under §6.7. Any later change to an acceptance criterion needs
a recorded reason in the CEP revision history and is reported in the CER.

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
   performance. For a class III or implantable device that relies on
   equivalence to another manufacturer's device in order not to perform a
   clinical investigation, Art. 61(5) adds two conditions, both to be
   evidenced to the notified body: a contract giving ongoing full access to
   that device's technical documentation, and an original clinical evaluation
   performed in compliance with the MDR.

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
   MDCG 2020-6 was written for legacy devices; its ranking is used here by
   analogy, and the CEP states that.
4. Complaint and vigilance data are clinical data under Art. 2(48), but
   under-reporting makes them a weak source: an absence of complaints does not
   show that the device is safe or performs as claimed. Use them to detect
   safety trends and as support only. They are never the sole basis for
   concluding conformity with the GSPRs (MDCG 2020-6 Appendix III); pair them
   with appraised clinical data or proactive PMCF data.
5. Summarise the appraisal as gaps, uncertainties, and open questions for
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
5. For class III and implantable devices, clinical investigations are
   required (Art. 61(4)) unless one of the exemptions in Art. 61(4) to (6)
   applies, such as a modification of the manufacturer's own marketed device
   whose equivalence the notified body has endorsed, equivalence under the
   Art. 61(5) conditions, or a device type covered by Art. 61(6). Record in the
   CEP either the planned investigation or the exemption relied on and the
   evidence for it (MDCG 2023-7). Where the device is a class III implantable
   device, or a class IIb active device that administers or removes a medicinal
   product (Rule 12), plan for the notified body's clinical evaluation
   consultation procedure (Art. 54).
6. A PMCF investigation that adds invasive or burdensome procedures to normal
   use (for example extra imaging, sampling, or visits to establish a
   reference result) must be notified to the Member States concerned at least
   30 days before it starts, with the Annex XV Chapter II documentation
   (Art. 74(1)). Build that lead time into the PMCF plan.

### 6.9 Article 61(10) Pathway
1. Art. 61(10) may be used only where demonstration of conformity based on
   clinical data is not appropriate. Absence of clinical data, or difficulty
   collecting it, is not a justification.
2. Record the justification using
   `records/clinical/article_61_10_justification_template.md`. It must show:
   (a) why clinical data are not appropriate, based on the risk management
   results, the device's interaction with the patient and the clinical process,
   the intended clinical performance, and the claims; (b) that the
   non-clinical evidence sources selected are suitable; (c) how they support each
   clinically relevant safety and performance objective; and (d) why the
   totality of evidence is sufficient for the relevant GSPRs.
3. The more directly the output determines diagnosis or treatment, the harder
   this justification becomes. For decision-support software, consider whether
   simulated-use, MRMC, or workflow studies are needed to bridge from
   analytical performance to clinical performance.
4. The Management Representative approves any use of Art. 61(10). Clinical
   data that becomes available after market placement, through PMS or PMCF,
   must still be collected and evaluated.
5. Art. 61(10) applies without prejudice to Art. 61(4). For a class III or
   implantable device it does not remove the requirement for clinical
   investigations; only an exemption under Art. 61(4) to (6) does (§6.8(5)).

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
   evaluators and approved by the QA Lead and the Management Representative.

### 6.12 Post-Market Clinical Follow-up (Annex XIV Part B)
1. Prepare a PMCF plan using `records/clinical/pmcf_plan_template.md` as part
   of the PMS plan under `SOP-014` (Annex III Section 1(b)). The plan targets the
   residual uncertainties from §6.10, with research questions, general and
   specific methods, rationale, and timelines (MDCG 2020-7).
2. Choose methods against the aims in Annex XIV Section 6.1. General methods
   (user feedback, complaints, literature screening) rarely settle a question
   the pre-market evidence left open. Plan a specific method, such as a
   registry or PMCF study (Annex XIV Section 6.2(b)), for each CER uncertainty
   that general methods cannot answer: little pre-market data for a
   sub-population or setting, claims that rest mainly on equivalence or on
   Art. 61(10), or a model whose behaviour on the real input population is not
   yet known. Where the plan has no specific method, state why in the plan.
3. Software can often collect real-world performance and use data directly.
   Where lawful and proportionate under `SOP-023`, use it to confirm
   pre-market assumptions.
4. Report results in a PMCF evaluation report
   (`records/clinical/pmcf_evaluation_report_template.md`; MDCG 2020-8). The
   PMCF evaluation report forms part of the CER and the technical
   documentation (Annex XIV Section 7). Feed its conclusions into the CER,
   the risk management file (Annex XIV Section 8) and, where applicable, the
   summary of safety and clinical performance (SSCP, Art. 32) and periodic
   safety update report (PSUR, Art. 86).
5. The PMCF plan also states why each chosen general and specific method is
   suitable for the question it serves (Annex XIV Section 6.2(c)), not only
   why other methods were left out.
6. Concluding that no PMCF is needed at all is a separate decision from
   having a PMCF plan without specific methods. Record it in the PMS plan with
   its justification (Annex III Section 1(b)): which residual uncertainties
   exist, why PMS data alone are enough to address them, and why the device's
   class, novelty, and evidence base make that acceptable. The QA Lead and
   Management Representative approve it, and it is re-examined at every CER
   update.

### 6.13 Updating the Clinical Evaluation (Art. 61(11))
1. Update the clinical evaluation and its documentation throughout the
   lifecycle with clinical data from PMCF and PMS (Art. 61(11)). Set the CER
   update frequency in the CEP and justify it by class, risk, novelty, and how
   fast the state of the art changes. For class III and implantable devices,
   the PMCF evaluation report and, where indicated, the SSCP are updated at
   least annually. Review the CER and PMCF results at least as often as the
   PSUR is updated (Art. 86(1): at least annually for class IIb and III, at
   least every two years for class IIa), so the PSUR never reports clinical
   conclusions the CER does not contain.
2. Update it out of cycle when there is a significant safety signal, a PMCF
   result, a change in the state of the art that affects the benchmarks, a
   design change that may affect clinical performance or safety under
   `SOP-009`, or a change to intended purpose or claims.
3. The CER always reflects the current released device version. Superseded
   versions remain retrievable under `SOP-001`.
4. Screen every software change raised under `SOP-009` for clinical impact,
   and record the outcome in the change record as one of:
   (a) no effect on clinical performance, safety, intended purpose, or claims,
   with the reason (for example a refactoring with unchanged outputs, or a
   dependency patch with passing regression tests);
   (b) a CER addendum that records the new version and why existing evidence
   still covers it;
   (c) new analytical or clinical performance evidence before release, such
   as retesting a retrained or re-thresholded model on the locked test set
   under §6.14(6);
   (d) a full CER update.
   Changes to a model, decision threshold, input type, output, or intended
   user always need at least (b), with the reasoning for not choosing (c).
5. Where the conformity assessment route requires it, inform the notified
   body before introducing changes that could affect safety, performance, or
   the conditions of use (for example MDR Annex IX Section 4.10 or Annex X
   Section 5.2). The outcome of the screening in item 4 is the input to that
   decision.

### 6.14 AI-Enabled Software
In addition to the steps above:
1. Report error modes over the reasonably foreseeable range of inputs,
   including atypical and incomplete inputs, as well as summary metrics. An
   error mode that the user would not notice is a risk to control under
   GSPR 4 in the order the GSPR sets: design first, then protective measures,
   and only then information for users.
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
   §6.7. Meeting AI Act obligations is not in itself evidence of MDR
   conformity, and the reverse also holds (MDCG 2025-6).
6. Performance studies of an AI model must show:
   (a) how the reference standard (ground truth) was established, by whom,
   whether they were blinded to the device output, and how disagreement
   between them was measured and resolved;
   (b) that no patient, and where relevant no site, appears in both the data
   used to develop or tune the model and the data used to test it, and that
   the test set was fixed before the final model was evaluated and not reused
   to tune it;
   (c) how performance holds across sites, acquisition equipment and
   protocols, and patient subgroups, and how the prevalence of the condition in
   the intended care setting changes predictive values compared with the
   study population.

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
| Regulation (EU) 2017/745 Art. 61(4) to (6), Annex XIV Part A 3 | Clinical investigations for class III and implantables; equivalence (§6.5(5), §6.8(5), §6.9(5)). |
| Regulation (EU) 2017/745 Art. 54 | Clinical evaluation consultation procedure planned where applicable (§6.8(5)). |
| Regulation (EU) 2017/745 Art. 74(1) | PMCF investigation notification (§6.8(6)). |
| Regulation (EU) 2017/745 Art. 86(1) | CER and PMCF review aligned with PSUR cadence (§6.13(1)). |
| Regulation (EU) 2017/745 Annex IX 4.10, Annex X 5.2 | Clinical impact screening of changes and notified body information (§6.13(4), (5)). |
| Regulation (EU) 2017/745 Art. 61(10) | Justification for non-clinical evidence (§6.9). |
| Regulation (EU) 2017/745 Art. 61(11), (12); Annex XIV Part A 4 | Updates and CER (§6.11, §6.13). |
| Regulation (EU) 2017/745 Annex XIV Part B; Annex III Section 1(b) | PMCF, including method rationale and any decision that PMCF is not needed (§6.12). |
| MedDO (SR 812.213) Art. 21(4), Art. 46(3) | Swiss requirement for clinical evaluation under MDR Art. 61 and Annex XIV, updated with PMCF results (§1, §6.4 to §6.13). |
| Regulation (EU) 2017/745 Art. 7 | Claims supported by evidence (§6.10(2)). |
| ISO 13485:2016 7.3.7 | Clinical evaluation as part of design and development validation. |
| ISO 14971:2019 7.4, 8 | Benefit-risk inputs aligned with the risk management file (§6.10(5)). |

The clause-level mapping is maintained in
`matrices/mdr_clinical_evaluation_gap_analysis.yml`.

## 9. Related Controlled Documents
- QM-001 Quality Manual
- SOP-001 Document and Record Control
- SOP-004 Management Review
- SOP-007 Medical Device File Control
- SOP-008 Design and Development Control
- SOP-009 Change Management
- SOP-011 Competence, Training, and Awareness
- SOP-012 Feedback and Complaint Handling
- SOP-013 Regulatory Incident Reporting
- SOP-014 Post-Market Surveillance
- SOP-018 Risk Management (ISO 14971:2019)
- SOP-019 Usability Engineering (IEC 62366-1:2015+A1:2020)
- SOP-020 Software Lifecycle, Configuration, and Release Management (IEC 62304:2006+A1:2015)
- SOP-022 AI Management System (ISO/IEC 42001:2023)
- SOP-023 Data Protection and Privacy Management
- SOP-024 AI Act Provider QMS (EN 18286:2026)
- WI-001 Verification and Validation Execution
- `records/clinical/` record family
- `matrices/mdr_clinical_evaluation_gap_analysis.yml`

## 10. Revision History
| Revision | Revision Date | Change Summary |
|---|---|---|
| R00 | 2026-11-19 | Initial release of the clinical evaluation and PMCF procedure under MDR Art. 61 and Annex XIV, with software-specific controls for intended purpose, classification, the evidence chain from valid clinical association to clinical benefit, the Art. 61(10) pathway, AI-enabled software, Art. 61(4) to (6) investigation and exemption decisions, PMCF notification and PSUR cadence, clinical impact screening of software changes, and two-step CEP approval, with MedDO Art. 21(4) and Art. 46(3) cited for Switzerland. |
