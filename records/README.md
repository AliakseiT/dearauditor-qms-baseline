# Records Index

This page is the GitHub navigation hub for controlled record families and reusable record templates in DearAuditor Open QMS Baseline.

DearAuditor Open QMS Baseline uses a mixed model:

- company-level operational records may be maintained in this repository
- reusable templates live here and are copied or adapted into designated product/study repositories
- product-specific execution records such as design history, V&V evidence, MDF artifacts, release baselines, and post-market files belong in the designated product/study repository, not in this upstream repository
- exception: when publishing this upstream repository itself as a `QMS-*` baseline, tag-specific release notes may live under `records/releases/` because they govern the upstream baseline repository rather than an adopter implementation release

For downstream adopters, the practical rule is:

- template files under `records/` can be proposed from upstream into a company repo
- upstream `QMS-*` release notes under `records/releases/` can be proposed from upstream into a company repo
- non-template operational records become company-owned immediately and are never auto-overwritten by upstream upgrade scripts
- generic bootstrap seed files for adopter-owned records live under [`examples/bootstrap/`](../examples/bootstrap/README.md)

Some folders are intentionally empty until the first signed and published company-level record exists.

## Start Here

| I need to... | Open |
|---|---|
| See training completion status | [Training status report](training/training_status.md) |
| Browse management review outputs | [Management reviews](management-reviews/) |
| Browse audit records | [Audits](audits/) |
| Open the approved supplier list | [Approved supplier list](suppliers/approved_supplier_list.yml) |
| Start with design-control templates | [Design record templates](design/) |
| Start with risk records | [Risk management records](risk/) |
| Start with usability-engineering templates | [Usability engineering templates](usability/) |
| Start with medical device file templates | [Medical device file templates](mdf/) |
| Start with V&V templates | [Verification and validation templates](verification_validation/) |
| Start with release/configuration templates | [Configuration and release templates](configuration/) |
| Start with AIMS templates | [AIMS record templates](aims/) |
| Record a Word/PDF-origin controlled document | [External document manifest template](external/external_document_manifest_template.yml) |
| Go back to the top-level project index | [DearAuditor Open QMS Baseline README](../README.md) |

## Operational Record Families

- [Training status report](training/training_status.md) - auditor-facing current training completion state
- [Training status register](training/training_status.yml) - machine-readable current training state derived from signed evidence
- [Upstream baseline release notes](releases/) - tag-specific release notes for this repository's own `QMS-*` releases
- [Management reviews](management-reviews/) - signed management review records
- [Audits](audits/) - internal and external audit records
- [CAPA](capas/) - corrective and preventive action records
- [Change control](change/change_request_template.md) - change request template and related change records
- [Suppliers](suppliers/approved_supplier_list.yml) and [supplier vetting template](suppliers/supplier_vetting_template.yml)

## Product and Lifecycle Record Families

- [Design control](design/) - design and development plan templates, user needs, system requirements, software architecture, and traceability templates
- [Risk management](risk/) - Markdown-first risk management plan and review templates, plus risk register templates/reference artifacts
- [Usability engineering](usability/) - usability file index, use specification, hazard-related scenarios, formative/summative, and post-production usability review templates
- [Medical device file](mdf/) - classification, device description, declaration of conformity, file index, and traceability summary templates
- [Verification and validation](verification_validation/) - V&V plan, test case, execution log, and report templates for designated product/study repositories
- [Configuration and release](configuration/) - release readiness, final release decision, and release baseline manifest templates for designated product/study repositories
- [AIMS](aims/) - ISO/IEC 42001 AI system inventory, AI risk, AI impact assessment, AI event, exception, and Statement of Applicability templates
- [Validation](validation/qms-tools/) - QMS tooling validation evidence
- [Post-market surveillance](pms/) - PMS plan and periodic report templates
- [Feedback and complaints](feedback/complaint_case_log_template.yml) - complaint case log template
- [Regulatory incidents](incidents/) - reportability assessment and submission record templates
- [Nonconformity](nonconformity/nonconformity_record_template.md) - nonconformity record template
- [External-origin controlled documents](external/external_document_manifest_template.yml) - manifest template for Word/PDF-origin records managed under the same PR/signature/release model

## External-Origin Documents

Use the external manifest template when a controlled document is authored outside GitHub, for example in Word.

1. Export the controlled rendering that will be approved, typically PDF.
2. Capture the source-system identifier, revision, export timestamp, and SHA-256 for both the exported PDF and the native source file.
3. Commit the manifest and the controlled artifact set in the target record repository, then route approval through the normal change-context -> PR -> merge -> Part 11 attestation flow. The change context may be captured in a separate issue or directly in the PR.
4. Publish the immutable release package with the exported artifact, manifest, and signature evidence so GitHub remains the approval and retention surface even when authoring happened elsewhere.

## Immutable Publication Notes

- Most execution records publish as one immutable bundle per changed record file.
- Risk-management PRs publish grouped bundles so the risk review, register snapshot, and related risk artifacts travel together.
- Usability-engineering PRs publish grouped bundles so the usability file index and referenced YAML records travel together.
- Every immutable bundle includes source hashes, source PR linkage, and captured Part 11 attestation metadata.

## GitHub Workflow Entry Points

- [Start a management review issue](https://github.com/AliakseiT/dearauditor-qms-baseline/issues/new?template=mgmt_review_plan.yml)
- [Start an audit issue](https://github.com/AliakseiT/dearauditor-qms-baseline/issues/new?template=audit_plan.yml)
- [Start a CAPA issue](https://github.com/AliakseiT/dearauditor-qms-baseline/issues/new?template=capa_plan.yml)
- [Start a change assessment issue](https://github.com/AliakseiT/dearauditor-qms-baseline/issues/new?template=change_impact_assessment.yml)
- [Start a feedback and complaint intake issue](https://github.com/AliakseiT/dearauditor-qms-baseline/issues/new?template=complaint_intake.yml)
- [Start a nonconformity intake issue](https://github.com/AliakseiT/dearauditor-qms-baseline/issues/new?template=nonconformity_intake.yml)
- [Start a PMS review issue](https://github.com/AliakseiT/dearauditor-qms-baseline/issues/new?template=pms_review.yml)
- [Start a design input baseline issue](https://github.com/AliakseiT/dearauditor-qms-baseline/issues/new?template=design_development_plan.yml)
- [Start a risk management plan issue](https://github.com/AliakseiT/dearauditor-qms-baseline/issues/new?template=risk_management_plan.yml)
- [Start a usability engineering plan issue](https://github.com/AliakseiT/dearauditor-qms-baseline/issues/new?template=usability_engineering_plan.yml)
- [Start a verification and validation plan issue](https://github.com/AliakseiT/dearauditor-qms-baseline/issues/new?template=verification_validation_plan.yml)
- [Start a release plan issue](https://github.com/AliakseiT/dearauditor-qms-baseline/issues/new?template=release_plan.yml)
- [Start a final release decision issue](https://github.com/AliakseiT/dearauditor-qms-baseline/issues/new?template=final_release_decision.yml)

## Related Navigation

- [DearAuditor Open QMS Baseline README](../README.md)
- [Open-source adoption model](../docs/open-source/README.md)
- [DearAuditor Open QMS Baseline system architecture](../docs/architecture/README.md)
- [Workflow automation map](../docs/architecture/README.md#6-automation-map)
