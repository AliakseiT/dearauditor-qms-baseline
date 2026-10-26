---
sop_id: SOP-024
title: AI Act Provider QMS (EN 18286:2026)
revision: R00
revision_date: 2026-10-15
status: Published
owner_role: qa_lead
approver_role: management_representative
related_issue: "#431"
---

## 1. Purpose
Define the QMS procedure used by an organisation that acts as a provider of
AI systems placed on, or put into service in, the European Union. This SOP adds
the regulatory layer required by Regulation (EU) 2024/1689 (the EU AI Act)
through EN 18286:2026, and is intended to be layered into an existing QMS
operated under ISO 13485, ISO 9001, or ISO 27001/42001 rather than to
replace them. It supplies the clauses that EN 18286 carries under clause 8
(AI system realization) and clause 9 (operation, supply chain, modifications,
post-market monitoring, serious incident reporting, non-compliance) which have
no equivalent in ISO 9001 or ISO/IEC 42001.

This SOP acts as the **regulatory layer**. The organisational governance layer
for AI is carried by `SOP-022` (ISO/IEC 42001:2023). Together they are what an
adopting organisation should list under `qms_intent_standards` when it has a
high-risk AI product in or destined for the EU market.

## 2. Scope
Applies whenever a product under the organisation's QMS is placed on, or put
into service in, the EU market and includes an AI system, or whenever a product
otherwise qualifies as a high-risk AI system under Regulation (EU) 2024/1689
Art. 6(1) (Annex I: safety component of a regulated product requiring
third-party conformity assessment) or Art. 6(2) (Annex III: high-risk use
case). It also applies to a provider's own EEA-facing AI systems even if the
operating QMS is 13485-heavy.

Where the adopting organisation serves the EU market through a non-device
digital product, the ISO 13485 medical-device SOPs do not apply to that
product, but this SOP and `SOP-022` remain in force.

This SOP is optional at the upstream baseline; see `docs/adoption/README.md` and
`matrices/adoption_profiles.yml` for which profile activates it.

## 3. Inputs
- Product documentation on classification and regulatory qualification
- `matrices/regulatory_market_scope.yml` regulatory commitments ledger
- `matrices/en_18286_gap_analysis.yml` clause-to-control coverage and companion
  standard status
- AI system inventory held in the AIMS register (`records/aims/aims_register.yml`)
- Product risk management file under `SOP-018`
- `records/design/*`, `records/mdf/*`, `records/usability/*`, `records/risk/*`
- Deployer, supplier, and third-party AI component interfaces

## 4. Outputs
- Determination of provider role and QMS scope for each EEA-facing AI system
- Written strategy for regulatory compliance per Regulation (EU) 2024/1689
- Technical specification selection register (Art. 17(1)(e))
- AI system requirements specification mapped to the essential requirements
  (Art. 9-15)
- Substantial versus non-substantial modification test outcomes
- Pre-determined change plans for continuous-learning systems
- AI data governance records under clause 8.5
- Serious incident reports under the AI Act statutory clock (Art. 73)
- Authority cooperation log (reasoned requests)
- Environmental sustainability assessments

## 5. Roles and Responsibilities
| Role | Responsibilities |
|---|---|
| Management Representative | Approves QMS scope for EU AI provision, written compliance strategy, technical specification selection baseline, substantial-modification determinations for complex cases, and serious incident report submission. |
| QA Lead | Maintains this SOP, the technical specification selection register, the compliance strategy record, AI data governance records, the authority cooperation log, and the AI Act incident timelines. |
| Engineering Lead | Authors AI system requirements mapped to the essential requirements, V&V evidence, data lineage, substantial-modification assessments, and pre-determined change plans. |
| Privacy Lead | Inputs on personal data processing in AI data governance and DPIA hand-offs. |
| Auditor | Independently verifies conformance and effectiveness through internal audit. |

## 6. Procedure

### 6.1 Provider role and QMS scope
1. Determine the provider role per product: a **provider** is the organisation
   that develops an AI system, or has one developed, and places it on the EU
   market or puts it into service under its own name or trademark (Regulation
   (EU) 2024/1689 Art. 3(3)), while an **importer**, **distributor**, or
   **deployer** holds the other roles.
2. Record the determination in the product dossier (`records/mdf/`), because the
   role determines the whole obligation set; a deployer role carries a lighter
   set than a provider role.
3. An importer, distributor, deployer, or other third party becomes the provider
   of a high-risk AI system under Art. 25(1) when it puts its name or trademark
   on a high-risk AI system already on the market, makes a substantial
   modification to one, or modifies the intended purpose of an AI system so that
   it becomes high-risk. Integrating third-party AI therefore needs a recorded
   role review; do not assume distributor or deployer status without one.
4. Scope the QMS to each EEA-facing AI system at system level, linked through the
   AIMS register, not at organisational level. An organisation may run one corporate
   QMS for many AI systems provided the product-level scope and evidence are
   complete.
5. Record the scope decision and any excludes in `matrices/regulatory_market_scope.yml`.

### 6.2 Written strategy for regulatory compliance (Art. 17(1)(a))
1. Maintain a written strategy covering: identification of applicable regulatory
   requirements at each lifecycle stage, conformity assessment route (Annex VI
   internal control vs Annex VII notified body), post-market monitoring plan,
   serious incident procedures, technical documentation approach, selection of
   technical specifications, and data management strategy.
2. Record it in `records/ai_act/regulatory_compliance_strategy_template.md` or
   equivalent controlled record, approved by the Management Representative at
   initial release and reviewed in management review.
3. Re-verify the strategy at each management review because Regulation (EU)
   2024/1689 delegates many details to secondary acts and the standard set changes.

### 6.3 Selection of technical specifications (Art. 17(1)(e))
1. Maintain a register of measures selected to demonstrate conformity: list each
   applicable EU-harmonised standard, common specification, or other technical
   specification, with its scope of application, coverage, reference, and gaps
   where the standard does not cover a requirement.
2. Where an alternative is used in preference to a cited harmonised standard, record
   the justification and the residual gap in both the register and the system's
   technical documentation (`records/ai_act/technical_specification_selection_register_template.yml`).
3. Maintain the companion-standard status block in
   `matrices/en_18286_gap_analysis.yml`; at the time of this SOP every AI Act
   companion standard (18228/18282/18283/18284/18229 Parts 1-2/24970) is
   **not OJ-cited**. The gap matrix records them with `oj_cited: false`, and the
   register records any of them that is used with `selection_status:
   gap_justified`, stating how its topic is handled in the interim.
4. When a companion becomes OJ-cited, the register is the single place where that
   transition is recorded.

### 6.4 Design and development controls (Art. 17(1)(b), (c), (d))
1. AI system requirements must translate the applicable regulatory requirements
   and risk controls into explicit, verifiable design inputs, covering transparency,
   human oversight, accuracy, robustness, cybersecurity, data governance, and
   record keeping (clause 8.3).
2. Requirements must be complete, unambiguous, and reviewed and approved in the
   controlled evidence before the system is placed on the market (clause 8.3.2).
3. V&V plans with acceptance criteria and reproducible conditions, with written
   evidence, per `WI-001-VerificationAndValidationExecution.md` (clause 8.4).
4. Accuracy testing must be reproducible and statistically meaningful for the
   intended purpose, and must be documented.
5. Test for foreseeable misuse. Human oversight requirements must be captured in
   the use specification and in the user interface design. Usability formative and
   summative evidence is captured under `SOP-019-UsabilityEngineering.md`.
6. Traceability from regulatory requirement through AI system requirement through
   V&V evidence is recorded in the design traceability matrix (`records/design/design_traceability_matrix_template.yml`).
7. Fundamental-rights consultation with affected persons and interested parties
   from inception through validation, with accessible engagement methods and
   documented outcomes feeding design choices and risk controls, per ISO/IEC
   42001 Annex A practice (`records/ai_act/fundamental_rights_consultation_template.md`).

### 6.5 Data governance (clause 8.5)
1. Implement processes for data acquisition, collection, labelling, analysis,
   storage, filtration, mining, aggregation, retention, and decommissioning,
   including lawful destruction or archival that preserves regulatory compliance
   capability.
2. Capture dataset provenance, origin, licensing, representativeness rationale,
   and decommissioning conditions in `records/ai_act/ai_data_governance_record_template.yml`.
3. Data documentation per model and per deployment environment, including lawful
   basis for personal data, DPIA triggers, and special-category data review,
   linked to the `records/privacy/` family.
4. Bias examination at intake and before release, with documented decisions.
5. PII, security-relevant, and proprietary data must be controlled per
   `SOP-021-InformationSecurityManagement.md`. Model serving data, input/output
   samples retained for monitoring, and PMS feedback data all count.

### 6.6 Environmental sustainability (clause 8.6)
1. Identify and assess the environmental impacts of the AI system, including
   compute, data storage, and deployment footprint, and the mitigations applied.
2. Provide deployers with the relevant information, typically in the accompanying
   documentation and instructions for use.
3. Record in `records/ai_act/environmental_sustainability_assessment_template.md`.
4. This item is fully documentation-bounded and reversible; it may be deferred
   under the four-state commitment model as long as the deferral is recorded,
   and it must be closed before the AI system is placed on the market or put
   into service.

### 6.7 Supply chain (clause 9.2)
1. Evaluate, select, monitor, and re-evaluate suppliers of components, data, and
   services based on their ability to meet the regulatory requirements and the
   requirements of EN 18286, per `SOP-010-SupplierAndPurchasingControl.md`.
2. Communicate requirements covering quality, competence, interaction, security
   by design, and vulnerability disclosure, and acceptance and verification
   activities including on-site where necessary.
3. AI-bearing suppliers (model providers, data providers, labelling services,
   evaluation services) must be registered in the approved supplier list with
   criticality and, for proprietary-model providers, with an approved sourcing
   decision.

### 6.8 Changes and continuous learning (clause 8.8, 9.3, 9.4)
1. Distinguish a substantial modification from a non-substantial one. A
   substantial modification is one likely to affect compliance with the regulation
   or to introduce a new risk, or to represent a change to the input data
   distribution or designated use. Record the determination case by case.
2. For continuous-learning systems, define pre-determined changes in advance:
   description of the change, affected version range, modification procedures,
   acceptance criteria, notification to authorities, cumulative impact. Implement
   via `records/ai_act/pre_determined_change_plan_template.md`.
3. Link any implemented modification into the technical documentation and, where
   the regulation requires it, into the instructions for use.
4. Modifications also flow through `SOP-009-ChangeManagement.md`; the substantial
   modification test is a requirement added on top of its four categories.

### 6.9 Post-market monitoring (Art. 72, clause 9.4, 9.5)
1. Integrate the AI Act post-market monitoring system into `SOP-014-PostMarketSurveillance.md`,
   including deployer feedback channels, system logs (logging aligned with
   ISO/IEC 24970 where applicable), authority reports, and complaint/incident inputs.
2. Track performance, interactions, residual risks, and effectiveness of risk controls.
3. Non-conformities identified by post-market monitoring require clear thresholds
   and triggers for corrective action.
4. Include post-market monitoring obligations in the instructions for use where
   deployer involvement is needed.

### 6.10 Serious incident reporting (Art. 73, clause 9.6)
1. A serious incident is an incident or malfunctioning of an AI system that
   directly or indirectly leads to any of the following (Regulation (EU)
   2024/1689 Art. 3(49)):
   - (a) the death of a person, or serious harm to a person's health;
   - (b) a serious and irreversible disruption of the management or operation
     of critical infrastructure;
   - (c) the infringement of obligations under Union law intended to protect
     fundamental rights;
   - (d) serious harm to property or the environment.

   Assess every candidate incident against all four categories. Do not narrow a
   category by sector, by the purpose of the system, or by a significance
   threshold that the definition does not contain.
2. Every statutory clock runs from the moment the provider or, where applicable,
   the deployer becomes aware of the serious incident. Record the awareness
   time, and who became aware, at intake. Waiting for a complete investigation
   or for more information does not delay the clock. Deadlines (Art. 73(2)-(4)):
   - Widespread infringement (Art. 3(61)) or critical-infrastructure disruption
     (Art. 3(49)(b)): **immediately, and not later than 2 days** after awareness.
   - Death of a person: **immediately** once a causal relationship between the
     AI system and the incident is established or suspected, **and not later
     than 10 days** after awareness.
   - All other serious incidents: **immediately** once a causal link between the
     AI system and the incident, or its reasonable likelihood, is established,
     **and not later than 15 days** after awareness.

   Where more than one class applies, the shortest deadline governs.
3. Where necessary to report on time, submit an initial report that is
   incomplete, followed by a complete report (Art. 73(5)). An initial report does
   not extend any deadline in item 2; it is the means of meeting it.
4. Medical-device scope (Art. 73(10)): where the AI system is itself a device,
   or a safety component of a device, under Regulation (EU) 2017/745 or (EU)
   2017/746, the AI Act notification covers only infringements of
   fundamental-rights obligations (Art. 3(49)(c)) and goes to the national
   competent authority designated for that purpose in the Member State where the
   incident occurred. Report every other serious incident involving such a
   device through device vigilance under `SOP-013`. Art. 73(9) applies the same
   limit to Annex III systems whose providers are subject to equivalent Union
   reporting obligations.
5. After reporting, investigate without delay, including a risk assessment of
   the incident and corrective action. Cooperate with the competent authorities
   and, where relevant, the notified body. Do not alter the AI system in a way
   that could affect a later evaluation of the cause before informing the
   competent authorities (Art. 73(6)).
6. Document escalation roles, allocate resources for investigations, and maintain
   written evidence including root-cause analyses and corrective actions.
7. Report using `records/ai_act/serious_incident_report_template.md`. Internal
   triage makes a preliminary entry within 24 hours of awareness. That entry is
   an internal record; it is not, and does not replace, the report to the
   authority.
8. Cross-reference `SOP-013-RegulatoryIncidentReporting.md` for jurisdictional
   reporting across CH/EU/US. SOP-013 §6.3 item 3 requires submission timelines
   to follow the applicable regulatory requirements; for AI Act serious
   incidents, those are the values in item 2.

### 6.11 Technical documentation (clause 4.5, 8.7)
1. Each AI system must carry technical documentation suitable for authorities and
   auditors in an EU official language, version-controlled, traceable, and
   maintained per `SOP-001-DocControl.md`.
2. Technical documentation covers identification, system description, development
   process, data, V&V, risk management, monitoring, and changes; the AI Act
   Annex IV content set overlays (but does not replace) the MDR technical
   documentation set.
3. Instructions for use must clearly describe integration, installation,
   deployment, servicing, and any deployer post-market monitoring role.
4. Documentation must be retrievable on request without the deployer's involvement
   where required.

### 6.12 Authority cooperation (clause 7.3)
1. Maintain procedures for responding to reasoned requests from competent
   authorities, notified bodies, and market surveillance authorities within the
   statutory response windows.
2. Communicate non-conformities, risks, and changes to other operators (providers,
   deployers, importers, distributors).
3. Record every inbound request and response in
   `records/ai_act/authority_cooperation_log_template.md`, including the
   regulation requiring response, the deadline, the response date, and the outcome.
4. Coordinate with the signer registry and legal counsel for any non-routine
   authority communication.

### 6.13 Resources and competence (clause 7)
1. Competency frameworks must reflect intended purpose, foreseeable misuse,
   technologies used, data types, and accessibility impacts, including fundamental
   rights concerns. Add AI Act competence elements to the training matrix.
2. Maintain a training plan covering legal literacy (AI Act essentials),
   engineering practice (documentation discipline), and bias/fairness awareness.

### 6.14 Monitoring, review and continual improvement
1. Monitor QMS effectiveness through conformity-evidence completeness, AI Act
   incident timeliness, substantial-modification determination quality, and the
   currency of the technical specification selection register.
2. Include EN 18286 inputs in governance review (`SOP-005`), internal audit
   (`SOP-003`), management review (`SOP-004`), metrics (`SOP-016`) and CAPA
   (`SOP-002`).
3. Review QMS scope, written strategy, and register at least once annually, and
   whenever a new AI system, model, data source, supplier, deployment environment,
   or regulatory change occurs.

## 7. Required Records
- Provider role and QMS scope determination per EEA-facing AI system
- Written compliance strategy (`records/ai_act/regulatory_compliance_strategy_template.md`)
- Technical specification selection register (`records/ai_act/technical_specification_selection_register_template.yml`)
- AI system requirements specification mapped to essential requirements (`records/ai_act/ai_system_requirements_spec_template.yml`)
- Fundamental-rights consultation record (`records/ai_act/fundamental_rights_consultation_template.md`)
- AI data governance record (`records/ai_act/ai_data_governance_record_template.yml`)
- Environmental sustainability assessment (`records/ai_act/environmental_sustainability_assessment_template.md`)
- Pre-determined change and substantial modification decision records (`records/ai_act/pre_determined_change_plan_template.md`)
- Serious incident report (`records/ai_act/serious_incident_report_template.md`)
- Authority cooperation log (`records/ai_act/authority_cooperation_log_template.md`)
- V&V execution records under `WI-001`, software lifecycle under `SOP-020`
- Product risk items where product safety or fundamental rights are implicated under `SOP-018`
- AIMS register references (`records/aims/`)

## 8. Traceability
Standard Clause | Control in this SOP | Linked Artifact
---|---|---
EN 18286:2026 4 | Context, regulatory requirements, compliance strategy, scope. | `matrices/regulatory_market_scope.yml`, `records/ai_act/regulatory_compliance_strategy_template.md`
EN 18286:2026 5 | Management responsibility, roles, authorities incl. risk management system. | QM-001, SOP-005, this SOP §5
EN 18286:2026 6 | Planning and risk-based planning of AI systems. | SOP-022 §6.2, SOP-018
EN 18286:2026 7 | Resources, competence, communications incl. authorities, awareness. | SOP-011, this SOP §6.13 and §6.12
EN 18286:2026 8 | AI system realisation: lifecycle, design, V&V, data, environment, identification, continuous learning. | SOP-008, SOP-020, WI-001, §6.4-§6.8
EN 18286:2026 9 | Operation: supply chain, changes, post-market, incidents, non-compliance. | SOP-009, SOP-010, SOP-013, SOP-014, §6.7-§6.10
EN 18286:2026 10 | Performance evaluation, management review, continual improvement. | SOP-003, SOP-004, SOP-016, SOP-002
Regulation (EU) 2024/1689 Art. 17 (all) | Maps via `matrices/en_18286_gap_analysis.yml` article_17_element_to_control_map. | matrix
ISO/IEC 42001:2023 clauses 4-10 | Organisational governance layer. | `SOP-022`
ISO 13485:2016 | Host QMS; document control, design, V&V, nonconformity, CAPA, MR. | SOP-001, SOP-008, SOP-015, SOP-002, SOP-004

## 9. Related Controlled Documents
- QM-001 Quality Manual
- SOP-001 Document and Record Control
- SOP-002 Corrective and Preventive Action (CAPA)
- SOP-003 Internal Audit
- SOP-004 Management Review
- SOP-005 QMS Governance
- SOP-007 Medical Device File Control
- SOP-008 Design and Development Control
- SOP-009 Change Management
- SOP-010 Supplier and Purchasing Control
- SOP-011 Competence, Training, and Awareness
- SOP-013 Regulatory Incident Reporting
- SOP-014 Post-Market Surveillance
- SOP-016 Quality Metrics and Data Analysis
- SOP-018 Risk Management (ISO 14971:2019)
- SOP-019 Usability Engineering (IEC 62366-1:2015+A1:2020)
- SOP-020 Software Lifecycle, Configuration, and Release Management (IEC 62304:2006+A1:2015)
- SOP-022 AI Management System (ISO/IEC 42001:2023)
- SOP-021 Information Security Management (resource for security-relevant controls referenced by §6.5 and §6.7).
- WI-001 Verification and Validation Execution
- WI-002 Configuration and Release Management Execution
- `records/ai_act/` record family
- `records/aims/` record family
- `matrices/en_18286_gap_analysis.yml`
- `matrices/regulatory_market_scope.yml`

## 10. Revision History
| Revision | Revision Date | Change Summary |
|---|---|---|
| R00 | 2026-10-15 | Initial release establishing the GitHub-native AI Act provider QMS procedure, written compliance strategy, technical specification selection register, substantial-modification and pre-determined change controls, AI data governance, AI Act statutory incident clock, authority cooperation, environmental sustainability, and EN 18286:2026 traceability. Clause references are provisional against the purchased normative text. |
