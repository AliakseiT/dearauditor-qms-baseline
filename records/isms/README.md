# ISMS Record Templates

This folder contains the minimum reusable records for a GitHub-native ISMS implemented under `SOP-021`.

Use these templates with the existing QMS workflow: open an issue or PR with the change context, edit the controlled record, obtain review and signature where required, merge to the controlled branch, and retain immutable release evidence when the record is published.

## Minimum Record Set

| Need | Template | Notes |
|---|---|---|
| Define ISMS scope, assets, security risks, access reviews, incidents, vulnerabilities, exceptions, and review cadence | `isms_register_template.yml` | Use one register for small teams. Split later only when the record becomes too large to review safely. |
| Map ISO/IEC 27001 Annex A control applicability to implementation evidence | `statement_of_applicability_template.yml` | Keep this as a separate controlled record because it is a primary audit artifact. |

## Reuse Existing QMS Records

Do not create duplicate ISMS records when an existing QMS record already controls the work.

| ISMS activity | Reuse |
|---|---|
| Corrective action | `records/capas/` and `SOP-002` |
| Internal audit | `records/audits/` and `SOP-003` |
| Management review | `records/management-reviews/` and `SOP-004` |
| Change implementation | `records/change/change_request_template.md` and `SOP-009` |
| Supplier security review | `records/suppliers/supplier_vetting_template.yml` and `SOP-010` |
| Training and awareness evidence | `records/training/` and `SOP-011` |
| Infrastructure/security control evidence | `SOP-017` plus the controlled repository or product record that owns the control |
| Product safety or clinical-impact cybersecurity risks | `records/risk/` and `SOP-018` |
| Release and configuration evidence | `records/configuration/`, `SOP-020`, and `WI-002` |

## Example Operating Pattern

1. Create or update the ISMS register with the in-scope GitHub repositories, signing components, suppliers, secrets, product repositories, and runtime systems.
2. Add information security risks and treatment decisions for material assets or changes.
3. Update the Statement of Applicability when a control becomes applicable, not applicable, implemented, partially implemented, or risk accepted.
4. Record quarterly access reviews in the ISMS register, linking review issues or PRs.
5. Route confirmed incidents, vulnerabilities, and exceptions through the ISMS register first, then link CAPA, change, supplier, product risk, or incident-reporting records only when those processes are actually triggered.
