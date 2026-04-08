---
record_id: FRD-DEARAUDITOR-QMS-BASELINE-2026-04-08
product_id: DEARAUDITOR-QMS-BASELINE
record_type: final_release_decision
status: approved
owner_role: engineering_lead
approver_role: qa_lead
related_issue: "#314"
release_tag: QMS-2026-04-08-R01
decision_date: 2026-04-08
---

# Final Release Decision

## Metadata

- Decision ID: `FRD-DEARAUDITOR-QMS-BASELINE-2026-04-08`
- Product ID: `DEARAUDITOR-QMS-BASELINE`
- Release Tag / Version: `QMS-2026-04-08-R01`
- Release Baseline Manifest Reference: `records/configuration/release_baseline_manifest.md`
- Release Readiness Reference: `records/configuration/release_plan.md`
- Decision Date: `2026-04-08`

## Inputs Reviewed

- Approved V&V Report Reference: `records/verification_validation/upstream_baseline_bootstrap_vv_report.md`
- Risk Decision Reference: not applicable; this record approves publication of the upstream baseline
  repository, not a downstream implementation release or operational deployment
- Anomaly / Deviation Summary Reference: no known blocking anomalies identified for the release scope
- Release Planning Issue Reference: GitHub issue `#314`
- Release Change Request Reference: GitHub PR `#315`
- Exact Baseline Accepted for Release:
  - repository `AliakseiT/dearauditor-qms-baseline`
  - approved release commit on `main`; exact SHA captured in `qms_release_manifest.json`
  - GitHub Release assets generated from tag `QMS-2026-04-08-R01`
- Execution Configuration References:
  - `.github/workflows/2.3_publish_qms_release.yml`
  - `.github/workflows/3.1_release_training_diff.yml`
- Controlled Document Scope Accepted for Release:
  - `QM-001`
  - `SOP-001` through `SOP-020`
  - `WI-001`, `WI-002`
- Code and Automation Scope Accepted for Release:
  - GitHub Actions under `.github/workflows/`
  - validation and release helpers under `scripts/` and `tools/`
  - signature worker source under `services/signature-worker/`

## Validation Scope Decision

The accepted validation scope is appropriate because this is a QMS baseline publication release.
The review confirms the released document set is published, revisioned, indexed, and packaged under
an immutable tag.

Runtime validation of the signature worker and validation of any downstream adopted QMS are not
required for this release decision. They remain required before using the worker as an operational
production service or before relying on a downstream implementation.

## Bootstrap Justification

- This decision approves publication of the upstream baseline repository itself as the first
  downstream-adoptable `QMS-*` reference.
- It does not approve shipment, deployment, intended use, or adopter operational release.
- Organizations that adopt this baseline remain responsible for their own implementation records,
  training, operational tool validation, and release decisions.

## Group Release Decision

- [x] Verification results are sufficient for upstream baseline publication.
- [x] The publication scope is limited to the upstream baseline repository and does not require a
  risk release decision.
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
  - downstream adopters remain responsible for company-owned records and operational-use decisions
  - no shipment authorization or deployment approval is created by this record

## Signatures

- Meaning of Signature: Approved Baseline Release
- Signer Roles: Quality Assurance Lead; Engineering Lead
- Required Signatures: 2
