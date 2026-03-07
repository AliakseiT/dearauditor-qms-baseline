---
wi_id: WI-002
title: Configuration and Release Management Execution
revision: R07
effective_date: 2026-03-07
status: Published
owner_role: engineering_lead
related_sops:
  - SOP-009
  - SOP-017
  - SOP-020
---

## 1. Purpose
Define the default GitHub workflow for configuration identification, release planning, release-readiness approval, final release decision approval, and immutable publication of released software lifecycle records.

## 2. Scope
Applies to product releases, significant maintenance drops, and other controlled configuration baselines that must be reproducible and reviewable.

## 3. Procedure

### 3.1 Plan the Release Baseline
1. Open a GitHub issue using `.github/ISSUE_TEMPLATE/release_plan.yml`.
2. Capture scope, target version or tag, impacted repositories/components, included and deferred change candidates, rollback note, linked V&V/risk/change inputs, and release done criteria.
3. The issue remains the coordination thread; the controlled release record is the PR-merged file set in the designated product/study repository.

### 3.2 Approve Release Readiness and Formal V&V Entry
1. Product changes may be developed and merged in parallel on the product `main` branch while release planning is in progress.
2. Branch-only work may support planning and technical rehearsal, but controlled release scope is selected only from merged state on `main`.
3. Before formal release-candidate V&V begins, open a PR in the designated product/study repository that commits or updates the release plan record and captures:
   - the candidate cutoff revision or candidate commit on `main`
   - the included change records for the upcoming release
   - merged changes that are explicitly deferred
   - the binary, image, or deployment package that enters formal V&V
4. The PR body must state:
   - `**Meaning of Signature:** Approved Release Readiness and Formal V&V Entry`
   - `**Signer Roles:** Quality Assurance Lead; Engineering Lead; Regulatory Lead`
   - `**Required Signatures:** 3`
5. Merge only after required approvals and mandatory checks complete.
6. Pre-gate execution may continue as dry run only; formal release evidence starts after the post-merge signature attestation on this release-readiness PR.

### 3.3 Prepare the Final Configuration Baseline
1. Identify all configuration items required to reproduce the release baseline.
2. At minimum capture:
   - repository and target commit
   - release tag or version
   - approved release-readiness reference and included change set
   - linked requirements, risk, V&V, and known-anomaly references
   - build or deployment package identifier
   - rollback or containment note
   - execution-configuration references for the formal release test runs
3. Record the baseline in the designated product/study repository using the release manifest template from `qms-lite/records/configuration/` or an approved derivative.

### 3.4 Approve the Final Release Decision
1. After the V&V report and residual-risk review are complete, open a PR in the designated product/study repository that commits or updates:
   - final release decision record
   - release baseline manifest
2. The final release decision must capture:
   - approved V&V report reference
   - residual-risk decision reference
   - unresolved anomaly posture and rationale
   - exact binary, image, or deployment package accepted for shipment
   - whether management escalation was required
3. The normal signer set is QA Lead, Engineering Lead, and Regulatory Lead. Add Management Representative when escalation or exceptional release conditions require it.
4. The PR body must state:
   - `**Meaning of Signature:** Approved Final Release Decision`
   - `**Signer Roles:** Quality Assurance Lead; Engineering Lead; Regulatory Lead`
   - `**Required Signatures:** 3`
5. Merge only after required approvals and mandatory checks complete.
6. The post-merge PIN-based signature attestation on that merged PR is the formal release authorization.

### 3.5 Publish the Release
1. Create the release tag defined in the approved manifest.
2. Publish immutable GitHub release assets from the approved baseline commit.
3. Ensure the release package links back to:
   - source PR
   - signature attestation
   - approved release-readiness decision
   - approved final release decision
   - approved V&V report
   - current residual risk decision

### 3.6 Maintenance and Hotfix Releases
1. Hotfixes and maintenance releases follow the same change-context -> PR -> merge -> PIN signature -> immutable release sequence, where a separate issue may be used but is not mandatory when the PR itself carries the controlled change context.
2. If a binary upgrade is proposed inside the current release scope, update the change/risk/release records, record the new binary deployment identifier, and document why the remaining risk is acceptable.
3. Reuse the prior baseline only by explicit reference; do not assume inherited approval without a new PR and manifest update.
4. Individual engineers may prepare build and baseline artifacts, but the engineering lead remains accountable for release-readiness signoff and completeness of linked evidence.

## 4. Required Records
- Release planning issue
- Approved release-readiness and formal V&V-entry record
- Approved final release decision record
- Configuration and release baseline manifest in the designated product/study repository
- Release tag and immutable release package
- Linked approval, V&V, risk, and rollback references

## 5. Revision History
| Revision | Effective Date | Change Summary |
|---|---|---|
| R00 | 2026-03-06 | Initial release defining GitHub-native configuration and release-baseline execution flow. |
| R01 | 2026-03-06 | Clarified that product release baseline records are maintained in designated product/study repositories using QMS Lite templates as the default baseline. |
| R02 | 2026-03-07 | Normalized release-baseline signoff accountability to the engineering owner role while keeping engineers as the minimum trained execution role. |
| R03 | 2026-03-07 | Renamed the accountable technical signoff role to `engineering_lead`. |
| R04 | 2026-03-07 | Added the explicit release-readiness/V&V-entry gate, clarified that changes may progress in parallel on product `main`, and required exact binary/configuration recording for formal release execution. |
| R05 | 2026-03-07 | Added the explicit post-V&V final release-decision gate with group approval separate from release-readiness. |
| R06 | 2026-03-07 | Clarified that release/hotfix changes may be initiated directly from PR-stated change context and that branch-only planning remains uncontrolled until merged approval. |
| R07 | 2026-03-07 | Removed overly specific signature-regulation terminology from the release signature wording and used technology-neutral language. |
