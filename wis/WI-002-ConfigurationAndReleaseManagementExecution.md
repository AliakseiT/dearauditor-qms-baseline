---
wi_id: WI-002
title: Configuration and Release Management Execution
revision: R02
effective_date: 2026-03-07
status: Published
owner_role: engineering_owner
related_sops:
  - SOP-009
  - SOP-017
  - SOP-020
---

## 1. Purpose
Define the default GitHub workflow for configuration identification, release planning, release baseline approval, and immutable publication of released software lifecycle records.

## 2. Scope
Applies to product releases, significant maintenance drops, and other controlled configuration baselines that must be reproducible and reviewable.

## 3. Procedure

### 3.1 Plan the Release Baseline
1. Open a GitHub issue using `.github/ISSUE_TEMPLATE/release_plan.yml`.
2. Capture scope, target version or tag, impacted repositories/components, rollback note, linked V&V/risk/change inputs, and release done criteria.
3. The issue remains the coordination thread; the controlled release record is the PR-merged file set in the designated product/study repository.

### 3.2 Define Controlled Configuration Items
1. Identify all configuration items required to reproduce the release baseline.
2. At minimum capture:
   - repository and target commit
   - release tag or version
   - linked requirements, risk, V&V, and known-anomaly references
   - build or deployment package identifier
   - rollback or containment note
3. Record the baseline in the designated product/study repository using the release manifest template from `qms-lite/records/configuration/` or an approved derivative.

### 3.3 Approve the Release Baseline
1. Open a PR in the designated product/study repository that commits or updates the release plan and baseline manifest.
2. The PR body must state:
   - `**Meaning of Signature:** Approved Release Baseline`
   - `**Signer Roles:** Quality Assurance Lead; Engineering Owner`
   - `**Required Signatures:** 2`
3. Merge only after required approvals and mandatory checks complete.
4. The post-merge PIN-based Part 11 attestation on that merged PR is the formal approval of the release baseline.

### 3.4 Publish the Release
1. Create the release tag defined in the approved manifest.
2. Publish immutable GitHub release assets from the approved baseline commit.
3. Ensure the release package links back to:
   - source PR
   - Part 11 attestation
   - approved V&V report
   - current residual risk decision

### 3.5 Maintenance and Hotfix Releases
1. Hotfixes and maintenance releases follow the same issue -> PR -> merge -> PIN signature -> immutable release sequence.
2. Reuse the prior baseline only by explicit reference; do not assume inherited approval without a new PR and manifest update.
3. Individual engineers may prepare build and baseline artifacts, but the engineering owner remains accountable for release-readiness signoff and completeness of linked evidence.

## 4. Required Records
- Release planning issue
- Configuration and release baseline manifest in the designated product/study repository
- Release tag and immutable release package
- Linked approval, V&V, risk, and rollback references

## 5. Revision History
| Revision | Effective Date | Change Summary |
|---|---|---|
| R00 | 2026-03-06 | Initial release defining GitHub-native configuration and release-baseline execution flow. |
| R01 | 2026-03-06 | Clarified that product release baseline records are maintained in designated product/study repositories using QMS Lite templates as the default baseline. |
| R02 | 2026-03-07 | Normalized release-baseline signoff accountability to the engineering owner role while keeping engineers as the minimum trained execution role. |
