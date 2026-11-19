---
record_type: intended_use
intended_use_id: "IU-<product>-<yyyy-mm-dd>"
product_id: ""
product_name: ""
linked_design_plan_reference: "records/design/design_development_plan.md"
linked_mdf_index_reference: "records/mdf/medical_device_file_index.md"
approval:
  meaning_of_signature: "Approved Intended Use and Claims"
  signer_roles:
    - qa_lead
    - engineering_lead
---

# Intended Use and Claims Template

This template shows one workable Markdown-first intended use and claims record for a software medical device product or subsystem.

Use it to define what the product is for, who the intended users are, the intended use environment, normal conditions of use, the inputs and outputs and how the output is used clinically, in-scope and out-of-scope claims, and the product-versus-configured-use boundary. Intended use is a primary design input per `SOP-008 §6.2` and the foundation of the clinical evaluation per `SOP-025 §6.2`. It is referenced from device description, classification decision, clinical evaluation plan, risk management plan, V&V plan, user needs, and usability records.

Before this template was published, product repositories referenced `docs/regulatory/intended_use.md`. New instantiations should place the record at `records/mdf/intended_use.md` alongside the other medical-device-file records so the MDF is self-contained. Existing products may migrate incrementally; references inside the QMS repo should use the new path.

You may rewrite the sections or wording to fit the product, as long as the same intended-use content, claims boundary, and linked records remain clear.

Replace the example text below with product-specific content before approval.

## 1. Intended Use Statement

Example:

- Intended use statement: `ACME-GENERIC-SAMD` is intended for use as rule-based decision support for trained clinical staff in outpatient triage workflows.
- Intended users: trained clinical staff operating the product in the defined workflow.
- Use environment: approved clinical networks accessed through supported web browsers on managed devices.
- Patient population: adult outpatients presenting to the triage workflow within the approved indication scope.
- Medical condition and indications: the conditions or clinical questions the output relates to, with severity or stage where relevant.
- Software inputs: the data the product relies on (types, sources, acquisition devices, quality requirements).
- Software outputs and their clinical use: what the output is, who acts on it, and which diagnostic, treatment, monitoring, or patient-management decision it informs, drives, or determines.
- Intended clinical benefit: the positive effect on patient health, patient management, or public health the product is expected to achieve (MDR Art. 2(53)).

## 1a. Normal Conditions of Use

Describe how the product will realistically be used, not how it would ideally be used. Restrictions stated here do not remove risks that arise in realistic use; see `SOP-025 §6.2`.

Example:

- User expertise range: newly qualified to senior triage nurses; no algorithm-specific training assumed beyond the onboarding module.
- Workload and environment: busy shifts with interruptions; output reviewed on shared workstations.
- Workflow variants: sites that act on the output directly versus sites that require a second review.
- Foreseeable variation in inputs and population: incomplete records, non-native-language free text, paediatric patients presented despite the adult-only indication.
- Reasonably foreseeable misuse: use as the sole basis for discharge decisions.
- Novel aspects: none / list new technology, application, population, workflow, or user interaction.
- Expected lifetime and performance-relevant changes over it: platform updates, guideline changes, drift in input data.

## 2. Claims In Scope

List every claim, wherever it will appear (labelling, IFU, website, marketing material, technical documentation). Each claim must be supportable through the clinical evaluation under `SOP-025`; unsupported claims are not permitted (MDR Art. 7).

Example:

- Rule-based decision support for the approved triage workflow
- Controlled access, audit trail, and session record retention
- Controlled release and configuration management for approved rule sets
- Supported languages, jurisdictions, and integration surfaces defined in the applicable release record

## 3. Non-Intended Use / Contraindications

Example:

- Not intended for diagnosis, prognosis, treatment recommendation, autonomous monitoring, autonomous triage, or autonomous care-routing
- Not intended for time-critical clinical decision-making
- Not intended to replace clinician judgment

## 4. System Boundary

Example:

- Participant-facing UI/UX and clinician-facing wording are part of the configured product layer rather than the reusable platform layer when the product is built on a platform baseline.
- Platform-layer records cover configurable platform capabilities, controlled configuration handling, evidence retention, auditability, and deployment controls.
- Any UI/UX claims, usability validation, and user-facing workflow constraints are defined in the relevant configured-product or study record set, not inferred from this record.

## 5. Related Controlled Records

Example:

- Device description: `records/mdf/device_description.md`
- Classification decision: `records/mdf/classification_decision.md`
- Clinical evaluation plan and report: `records/clinical/clinical_evaluation_plan.md`, `records/clinical/clinical_evaluation_report.md`
- MDF index: `records/mdf/medical_device_file_index.md`
- Design and development plan: `records/design/design_development_plan.md`
- Risk management plan: `records/risk/risk_management_plan.md`
- V&V plan: `records/verification_validation/vv_plan.md`
- Usability file index: `records/usability/usability_file_index.md` (when applicable)

## 6. Approval Record

Example:

- Intended use approved for current lifecycle scope: yes
- Approval date: `YYYY-MM-DD`
- Linked approving PR: `#123`
- Notes: approval authorizes the stated intended use, claims, and boundary; downstream product-specific or study-specific claims must be stated in their own controlled records and are not inferred from this record.
