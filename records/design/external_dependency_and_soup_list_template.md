---
record_type: external_dependency_and_soup_list
record_id: "SOUP-<product>-<yyyy-mm-dd>"
product_id: ""
linked_records:
  design_development_plan_reference: "records/design/design_development_plan.md"
  device_description_reference: "records/mdf/device_description.md"
  architecture_reference: "records/design/software_architecture_spec.md"
approval:
  meaning_of_signature: "Approved External Dependency and SOUP List"
  signer_roles:
    - engineering_lead
    - qa_lead
---

# External Dependency and SOUP List Template

This template shows one workable Markdown-first inventory for the third-party software components, cloud services, and SOUP-like dependencies that materially affect a product's controlled baseline. It operationalizes the SOUP/external-dependency activities described in `SOP-020 §6.3` and complements the high-level statements in the design and development plan (`records/design/design_development_plan_template.md §7.3`).

The record serves as the controlled reference cited from the SDP and the software architecture specification. Each entry captures what the component is, how it is used in the product, the version under review, the evaluation rationale, the review status, and any change-impact notes relevant to risk, verification, and release.

You may rewrite the table structure to fit the product, as long as the same inventory content, usage rationale, review status, and change-impact notes remain clear.

Replace the example text below with product-specific content before approval.

## 1. Purpose and Scope

Example:

- Purpose: identify external software items, services, tools, and SOUP-like components used by the product and maintain them under change control.
- In scope: third-party frameworks, libraries, runtimes, cloud services, managed infrastructure, build-and-release toolchains, supporting tooling, and any component whose change could affect safety, performance, security, data integrity, availability, or regulatory posture.
- Out of scope: components of development-only utilities that do not affect the shipped product, and documentation-only references that do not enter the controlled baseline.

## 2. Inventory

Example:

| Component | Version / Service | Category | Usage in Product | Evaluation Rationale | Review Status |
|---|---|---|---|---|---|
| `example-framework` | `1.2.3` | runtime library | Application framework for the web layer | Widely used, active maintenance, known CVE track record reviewed | approved |
| `example-cloud-service` | `v2 API` | managed service | Persistent storage backing service evidence | Supplier vetted; encryption and access controls meet product requirements | approved |
| `example-toolchain` | `4.5.0` | build tool | Build and test automation in CI | Pinned by lockfile; revalidated on major upgrade | approved |

Expand or split the inventory into sub-tables (runtime dependencies, services, toolchain, infrastructure) when the product reaches a size where one flat table becomes hard to review.

## 3. Selection and Approval Approach

Example:

- New dependencies require documented intended use, version, license, security/risk rationale, and architecture-record update before the baseline is changed.
- The architecture record and the traceability matrix must link each controlled dependency to the requirements and risk controls it supports.
- Supplier qualification, where applicable, follows `SOP-010`.

## 4. Change Impact Expectations

Example:

- Minor dependency upgrades that do not affect intended use, interfaces, safety, security, or performance can proceed through normal change control under `SOP-009`.
- Major upgrades, replacements, or removals require impact review on:
  - requirements and architecture
  - risk controls and residual-risk posture
  - verification and validation scope, including regression re-execution
  - release-readiness and deployment controls
- Security-relevant changes trigger review under the applicable cybersecurity and release processes even when no functional interface changes.

## 5. Review Cadence

Example:

- At each release gate for components in the shipped baseline.
- On cybersecurity vulnerability disclosures affecting a listed component.
- On supplier-initiated deprecation or licensing changes.
- At least annually for active products.

## 6. Approval Record

Example:

- Inventory approved for current lifecycle scope: yes
- Approval date: `YYYY-MM-DD`
- Linked approving PR: `#123`
- Notes: approval authorizes the inventory content and change-impact expectations; individual dependency upgrades beyond approved scope require controlled change under `SOP-009`.
