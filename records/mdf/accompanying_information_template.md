---
record_type: accompanying_information
accompanying_information_id: "ACCINFO-<product>-<yyyy-mm-dd>"
product_id: ""
product_name: ""
linked_intended_use_reference: "records/mdf/intended_use.md"
linked_device_description_reference: "records/mdf/device_description.md"
linked_mdf_index_reference: "records/mdf/medical_device_file_index.md"
released_baseline_reference: "records/configuration/release_baseline_manifest.md"
approval:
  meaning_of_signature: "Approved Accompanying Information"
  signer_roles:
    - qa_lead
    - engineering_lead
---

# Accompanying Information Template

This template captures the controlled accompanying information set required for a released health software product under IEC 82304-1 clause 7. It provides the controlled product information that is delivered with, or made available to users of, the released software.

The accompanying information set is product-specific. Adapt the sections and tables to match the released product, but keep the controlled artifact set, revision state, and ownership clear.

Replace the example text below with product-specific content before approval.

## 1. Released Product Identification

Example:

- Product name: `ACME-GENERIC-SAMD`
- Product version or release: `v1.0.0`
- Released-baseline reference: `records/configuration/release_baseline_manifest.md`
- Manufacturer identification: `ACME GmbH, Paradeplatz 8, 8001 Zurich, Switzerland`
- Unique product identifier or labeling reference: `<UDI / labeling reference>`

## 2. Instructions for Use (User-Facing)

Example structure for the IFU artifact set delivered with or made available to users:

| Section | Purpose | Controlled Reference |
|---|---|---|
| Intended use and indications | Describes intended medical purpose, intended users, and intended use environment | `records/mdf/intended_use.md` |
| Contraindications, warnings, precautions | States limits of use, residual risk warnings, and required user safeguards | linked from risk file `records/risk/risk_register.md` |
| Operating instructions | Step-by-step instructions for safe and effective product use | product user documentation reference |
| Limitations and known issues | Documents performance limits, unsupported configurations, and known anomalies relevant to safe use | linked from `records/verification_validation/vv_report.md` |
| Support and incident reporting | How to obtain support, report problems, or report incidents | linked from `records/feedback/` and `records/incidents/` |

## 3. Technical Description

Example structure for the technical description delivered with or made available to qualified deployers, integrators, or operators:

| Section | Purpose | Controlled Reference |
|---|---|---|
| Product overview | Summary of product type, boundary, and architecture | `records/mdf/device_description.md` |
| Operating environment requirements | Required runtime environment, supported browsers, operating systems, network, and identity dependencies | `records/design/software_architecture_spec.md` |
| Installation, configuration, and update model | How the product is installed, configured, updated, or deployed | `records/configuration/release_plan.md`, `records/configuration/release_baseline_manifest.md` |
| Interfaces and external dependencies | API, identity, storage, audit, and supplier dependencies | `records/design/software_architecture_spec.md`, supplier records |
| Security and data protection summary | Security controls, audit logging, and data protection considerations relevant to safe operation | `records/risk/risk_register.md`, security/architecture references |
| Maintenance and support expectations | Expected maintenance, patching, support window, and end-of-support model | `sops/SOP-020-SoftwareLifecycleConfigurationAndReleaseManagement.md`, `records/configuration/` |

## 4. Languages and Localization

Example:

- Languages provided with this released baseline: `EN` (primary), `DE`
- Localization control note: only translations approved against the controlled source IFU and technical description are released
- Translation evidence reference: `records/configuration/` translation manifest or PR reference

## 5. Distribution and Availability

Example:

- Delivery model: in-product help, downloadable PDF on the customer support portal, and API technical reference
- Availability for regulators on request: yes
- Distribution evidence reference: `records/configuration/release_baseline_manifest.md`

## 6. Change Control and Versioning

Example:

- Accompanying information revision: `R01`
- Linked product version: `v1.0.0`
- Last reviewed for content currency: `YYYY-MM-DD`
- Change-control rule: any change to intended use, indications, contraindications, warnings, precautions, supported environments, or end-of-support model triggers a controlled revision through the normal PR/signature/release flow

## 7. Approval Record

Example:

- Accompanying information approved: yes
- Approval date: `YYYY-MM-DD`
- Linked approving PR: `#123`
- Notes: approval covers the IFU and technical description set delivered with the listed product version
