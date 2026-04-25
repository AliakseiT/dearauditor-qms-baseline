# AIMS Record Templates

This folder contains the minimum reusable records for a GitHub-native AI Management System (AIMS) implemented under `SOP-022`.

The AIMS scope is the AI components inside ACME medical-device software products. AI tooling used to author or operate the QMS itself is governed under existing supplier control, tooling validation, and document control procedures and is not duplicated here.

Use these templates with the existing QMS workflow: open an issue or PR with the change context, edit the controlled record, obtain review and signature where required, merge to the controlled branch, and retain immutable release evidence when the record is published.

## Minimum Record Set

| Need | Template | Notes |
|---|---|---|
| Define AIMS scope, AI system inventory, AI risks, AI impact assessments, AI events, exceptions, and review cadence | `aims_register_template.yml` | Use one register per product or product family. Split later only when the record becomes too large to review safely. |
| Map ISO/IEC 42001 Annex A control applicability to implementation evidence | `statement_of_applicability_template.yml` | Keep this as a separate controlled record because it is a primary audit artifact. |

## Reuse Existing QMS Records

Do not create duplicate AIMS records when an existing QMS record already controls the work.

| AIMS activity | Reuse |
|---|---|
| Corrective action | `records/capas/` and `SOP-002` |
| Internal audit | `records/audits/` and `SOP-003` |
| Management review | `records/management-reviews/` and `SOP-004` |
| Change implementation | `records/change/change_request_template.md` and `SOP-009` |
| AI supplier or third-party AI provider review | `records/suppliers/supplier_vetting_template.yml` and `SOP-010` |
| Training and awareness evidence | `records/training/` and `SOP-011` |
| Product safety or clinical-impact AI risks | `records/risk/` and `SOP-018` |
| AI lifecycle and release evidence | `records/design/`, `records/configuration/`, `SOP-008`, `SOP-020`, `WI-001`, and `WI-002` |

## Example Operating Pattern

1. Create or update the AIMS register with the in-scope AI systems, model and data sources, third-party dependencies, and product owners.
2. Add AI risks and treatment decisions for material AI changes or new AI components.
3. Record an AI system impact assessment whenever AI is introduced or materially changes intended use, users, deployment context, training data, or model behavior.
4. Update the Statement of Applicability when an Annex A control becomes applicable, not applicable, implemented, partially implemented, or risk accepted.
5. Route confirmed AI anomalies, drift findings, and exceptions through the AIMS register first, then link CAPA, change, supplier, product risk, or incident-reporting records only when those processes are actually triggered.
6. Review the AIMS register and SoA at least quarterly and before any release that changes AI behavior.
