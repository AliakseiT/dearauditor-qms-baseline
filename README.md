# QMS Lite

## Published SOP Index

<!-- PUBLISHED-SOP-INDEX:START -->
| SOP ID | SOP Title | File | Effective Date | Published Revision | Status |
|---|---|---|---|---|---|
| SOP-001 | Document Control | sops/SOP-001-DocControl.md | 2026-03-01 | R00 | Published |
| SOP-002 | Corrective and Preventive Action (CAPA) | sops/SOP-002-CAPA.md | 2026-03-01 | R00 | Published |
| SOP-003 | Internal Audit | sops/SOP-003-InternalAudit.md | 2026-03-01 | R00 | Published |
| SOP-004 | Management Review | sops/SOP-004-ManagementReview.md | 2026-03-01 | R00 | Published |
| SOP-005 | QMS Governance and Quality Manual | sops/SOP-005-QMSGovernanceAndQualityManual.md | 2026-03-01 | R02 | Published |
<!-- PUBLISHED-SOP-INDEX:END -->

## Company Context
- Legal entity: `ACME GmbH`
- Registered office: `Paradeplatz 8, 8001 Zurich, Switzerland`
- Operating model: `Remote-first`
- Regulatory role: `Manufacturer of healthcare software products`
- Product intent policy: `No single intended medical purpose at company level; each product defines intended use/classification in its own dossier.`

## QMS Baseline References
- Company and quality intent baseline: `matrices/company_profile.yml`
- Regulatory scope baseline (CH/EU/US): `matrices/regulatory_market_scope.yml`
- Quality manual section-to-SOP traceability: `matrices/quality_manual_traceability.yml`
- QMS tooling inventory and validation baseline: `matrices/qms_tooling_inventory.yml`

## Immutable Record Release Tags

QMS execution records are published as immutable releases in `AliakseiT/qms-records`.

| Record Type | Tag Pattern | Example |
|---|---|---|
| Management Review | `mr-<record-id>-rNN` | `mr-2026-q1-r01` |
| CAPA | `capa-<record-id>-rNN` | `capa-0007-r01` |
| Audit | `audit-<record-id>-rNN` | `audit-mdsap-internal-r02` |
| Training | `trn-<record-id>-rNN` | `trn-dev-lina-sop-002-r01` |
| Supplier List / Evaluation | `asl-YYYY.MM.DD-rNN` / `sup-<record-id>-rNN` | `asl-2026.03.01-r01` |
| Fallback | `record-<record-id>-rNN` | `record-general-note-r01` |

## Training Automation

- `auto_training_assign.yml`: opens SOP training issues only when changed SOPs are mapped to at least one role in `matrices/training_matrix.yml`.
- `release_training_diff.yml`: on release publish, compares required SOP revisions against `records/training/user_training_log.yml` and opens per-user training delta issues.
- `training_pr_approval_gate.yml`: for PRs updating `records/training/**`, requires approval by the user declared in PR body:
  - `**Trainee GitHub Login:** @<login>`
- `manual_training_onboarding_pr.yml` (`workflow_dispatch`): creates a **review-only** onboarding PR where base is a branch pinned to the first commit and head is `main`, so trainee reviews full current QMS state.
  - PR body includes in-scope roles and SOP IDs from `matrices/training_matrix.yml`.
  - If PR creation is blocked by token policy, either enable repository setting **Allow GitHub Actions to create and approve pull requests** or set repository secret `TRAINING_PR_TOKEN` (token with repo write scope).
- Post-merge attestation: training update PRs must include the standard Part 11 fields and complete signature links on the merged PR.
