---
record_type: in_house_health_institution_justification
justification_id: "INHOUSE-<product>-<yyyy-mm-dd>"
product_id: ""
health_institution: ""
jurisdiction: ""
regulatory_basis_cited_by_adopter: ""
linked_intended_use_reference: "records/mdf/intended_use.md"
linked_classification_decision_reference: "records/mdf/classification_decision.md"
linked_risk_reference: "records/risk/risk_management_plan.md"
approval:
  meaning_of_signature: "Approved In-House Software Justification"
  signer_roles:
    - qa_lead
    - management_representative
---

# In-House Health-Institution Software Justification Template

This template supports the `in_house_clinical_software` adoption profile
(`matrices/adoption_profiles.yml`). It records an adopter's determination for
software developed and used inside a single health institution for its own
patients rather than placed on the market.

> **Scope note.** This is an adopter-completed record, not regulatory advice.
> The DearAuditor Open QMS Baseline does **not** pre-assert any specific
> in-house, own-use, or health-institution exemption clause. The adopter must
> identify and cite the regulatory basis that applies in its own jurisdiction in
> the "Regulatory Basis" section below and confirm it with its regulatory
> function. Device qualification and classification are still resolved per
> `matrices/regulatory_market_scope.yml`.

Replace the placeholder text below with product- and institution-specific
content before approval.

## Metadata
- Justification ID:
- Product ID:
- Health Institution:
- Jurisdiction:
- Decision Date:
- Owner:

## Software and Intended Use
- Intended Use (internal):
- Target User / Use Environment:
- Patient Population:
- Why an in-house solution is used:

## In-House / Own-Use Boundary
- Confirmation the software is used only within the institution:
- Conditions and limits of internal use:
- Controls preventing the software from being placed on the market or supplied to others:
- Trigger conditions that would move this software out of the in-house boundary
  (and require escalation to the `ai_diagnostic` profile):

## Regulatory Basis (adopter-supplied)
- Applicable in-house / own-use / health-institution provision(s) in this jurisdiction:
- Citation(s) and source link(s):
- Determination that no suitable equivalent device is available (where the cited basis requires it):
- Confirmation reviewed with the regulatory function:

## Linked Controls and Evidence
- Risk management reference (ISO 14971 / SOP-018):
- Software lifecycle reference (IEC 62304 / SOP-020, tailored):
- Usability reference (IEC 62366-1 / SOP-019):
- Information security reference (ISO/IEC 27001 / SOP-021):
- Data protection reference (GDPR / Swiss nFADP / SOP-023):
- Internal feedback / monitoring reference (SOP-012 / SOP-014):

## Follow-Up
- Dossier Updates Required:
- Re-review trigger and cadence:
- Linked Risk / V&V / Release References:
