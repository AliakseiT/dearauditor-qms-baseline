---
record_id: FRD-DEARAUDITOR-QMS-BASELINE-2026-04-01
product_id: DEARAUDITOR-QMS-BASELINE
record_type: final_release_decision
status: approved
owner_role: engineering_lead
approver_role: qa_lead
related_issue: "#314"
release_tag: QMS-2026-03-31-R01
decision_date: 2026-04-01
---

# Final Release Decision

## Metadata

- Decision ID: `FRD-DEARAUDITOR-QMS-BASELINE-2026-04-01`
- Product ID: `DEARAUDITOR-QMS-BASELINE`
- Release Tag / Version: `QMS-2026-03-31-R01`
- Release Baseline Manifest Reference: `records/configuration/release_baseline_manifest.md`
- Release Readiness Reference: `records/configuration/release_plan.md`
- Decision Date: `2026-04-01`

## Inputs Reviewed

- Approved V&V Report Reference: `records/verification_validation/upstream_baseline_bootstrap_vv_report.md`
- Residual Risk Decision Reference: not applicable for product residual-risk release because this
  record approves publication of the upstream baseline repository rather than shipment of a medical
  device product
- Anomaly / Deviation Summary Reference: no known blocking anomalies identified for the release scope
- Exact Baseline Accepted for Release:
  - repository `AliakseiT/dearauditor-qms-baseline`
  - commit `ece2ad4a97474f12714316f0dcbf54a51f29d119`
  - GitHub Release assets generated from tag `QMS-2026-03-31-R01`
- Execution Configuration References:
  - `.github/workflows/2.3_publish_qms_release.yml`
  - `.github/workflows/3.1_release_training_diff.yml`

## Bootstrap Justification

- This decision approves publication of the upstream baseline repository itself as the first
  downstream-adoptable `QMS-*` reference.
- It does not approve a medical-device product shipment, deployment, intended use, or adopter
  operational release.
- Product/study repositories that adopt this baseline remain responsible for their own design,
  risk, V&V, MDF, and final release decisions.

## Group Release Decision

- [x] Verification results are sufficient for upstream baseline publication.
- [x] The publication scope is limited to the upstream baseline repository and does not require a
  product residual-risk release decision.
- [x] No unresolved anomalies are known that would compromise the integrity of the published
  baseline package.
- [x] The exact repository baseline and release assets accepted for publication match the reviewed
  evidence set.
- [x] Any later content change requires a new PR revision and a superseding `QMS-*` tag.

## Escalation and Conditions

- Management escalation required: no
- Management review reference (if required): not applicable
- Release restrictions / conditions:
  - publication authorizes only the upstream baseline repository release
  - downstream adopters remain responsible for company-owned records and product-specific release
    decisions in designated repositories
  - no product claims, shipment authorization, or deployment approval are created by this record

## Signatures

- Meaning of Signature: Approved Final Release Decision for Bootstrap Upstream Baseline Publication
- Signer Roles: Quality Assurance Lead; Engineering Lead
- Required Signatures: 2
