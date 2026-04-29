---
record_type: device_description
device_description_id: "DDESC-<product>-<yyyy-mm-dd>"
product_id: ""
product_name: ""
linked_intended_use_reference: "records/mdf/intended_use.md"
linked_mdf_index_reference: "records/mdf/medical_device_file_index.md"
approval:
  meaning_of_signature: "Approved Device Description"
  signer_roles:
    - engineering_lead
    - qa_lead
---

# Device Description Template

This template shows one workable Markdown-first device description for a software medical device product or subsystem.

Use it to describe what the product is, what it is for, which users and environments are in scope, and how the product is structured at a level suitable for regulatory, engineering, and quality review.

You may rewrite the sections and tables to fit the product, as long as the same product-definition content remains clear.

Replace the example text below with product-specific content before approval.

## 1. Product Overview

Example:

- Product name: `ACME-GENERIC-SAMD`
- Product type: browser-based software as a medical device with supporting API
- Intended medical purpose summary: provides rule-based triage support for trained clinical staff in outpatient workflows
- Product boundary: clinician-facing web app, backend services, audit trail, and release-controlled configuration
- Out of scope: general practice management, billing, and non-clinical analytics

## 2. Intended Users, Patient Population, and Use Environment

Example:

- Intended users: trained clinicians and supervised support staff
- Target patient population: adult ambulatory patients presenting to outpatient triage workflows
- Use environment: managed clinical environments with authenticated users and supported browsers
- User qualifications or training assumptions: users are trained on triage workflow and local escalation policy

## 3. Principle of Operation and Major Features

Example:

- Core operating principle: captures structured inputs, applies reviewed decision logic, and presents recommended triage outputs with rationale and audit trail
- Major features in scope:
  - user authentication and role-based access
  - structured intake workflow
  - rules engine and output presentation
  - audit logging and record retention
- Major safety or performance constraints:
  - system output supports but does not replace trained clinical judgment
  - unsupported browser or incomplete input states must fail safely with clear user feedback

## 4. Product Variants, Configurations, and Accessories

Example:

- Variants in scope:
  - hosted SaaS deployment
  - validated staging environment used for formal V&V
- Optional modules or feature flags:
  - multilingual user interface pack
  - region-specific decision logic bundle
- Accessories or companion items:
  - none | list external hardware, mobile companion, or support tools here

## 5. Major Subsystems and External Interfaces

Example:

| Subsystem / Interface | Purpose | Key Dependencies | Controlled Reference |
|---|---|---|---|
| Web client | User-facing workflow and output display | supported browsers, identity provider | `records/design/software_architecture_spec.md` |
| API service | Business logic, persistence, audit services | managed runtime, database | `records/design/software_architecture_spec.md` |
| Identity provider interface | Authentication and session claims | external identity platform | `records/design/software_architecture_spec.md` |
| Audit export | Controlled evidence export for support and review | object storage, signed export workflow | `records/design/software_architecture_spec.md` |

## 6. Reference to Previous or Similar Generations

Example:

- Previous internal generation: prototype branch `prototype-triage-v2`, not placed on market
- Similar products or predecessor releases: `ACME-TRIAGE-LITE v0.9` used as design input reference only
- Key differences relevant to classification, risk, or validation: current product introduces formal audit trail, role control, and regulated release evidence

## 7. Labeling, Claims, and Public Product Description References

Example:

- Intended-use statement reference: `records/mdf/intended_use.md`
- Product labeling or user-facing claims reference: `records/mdf/labeling_overview.md`
- Marketing-claim control note: only claims aligned with intended use and approved release scope may be used

## 8. Approval Record

Example:

- Device description approved: yes
- Approval date: `YYYY-MM-DD`
- Linked approving PR: `#123`
- Notes: approval covers the product definition and major variant/configuration statement for the current baseline
