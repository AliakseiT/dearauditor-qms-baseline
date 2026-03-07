---
wi_id: WI-001
title: Verification and Validation Execution
revision: R05
effective_date: 2026-03-07
status: Published
owner_role: engineering_lead
related_sops:
  - SOP-008
  - SOP-019
  - SOP-020
---

## 1. Purpose
Define the default GitHub workflow for preparing test cases, approving and signing test plans, executing approved test plans, and reviewing/signing V&V evidence and reports.

## 2. Scope
Applies to software verification, software validation, and usability-validation activities that require controlled evidence.

## 3. Procedure

### 3.1 Initiate the V&V Campaign
1. Open a GitHub issue using `.github/ISSUE_TEMPLATE/verification_validation_plan.yml`.
2. Use the issue for coordination only: scope, target build or commit, owners, linked requirements/risk items, and done criteria.
3. Do not treat the issue body alone as the approved V&V record.

### 3.2 Prepare Controlled Test Cases
1. Use stable test-case identifiers (`TC-...`) for both automated and manual tests.
2. Automated test cases remain near code; the controlled record references repository path, command, and exact commit or tag.
3. Manual or mixed tests are maintained as controlled records in the designated product/study repository, typically using templates derived from `qms-lite/records/verification_validation/`.
4. Each test case must define objective, requirement links, risk-control links, preconditions, steps or script reference, expected result, and evidence type.

### 3.3 Approve the Test Plan
1. Open a PR that commits or updates:
   - a `vv_plan_template.yml`-derived plan record in the target repository
   - test case index
   - any new or revised manual test case records in the target repository
2. The PR body must state:
   - `**Meaning of Signature:** Approved V&V Plan`
   - `**Signer Roles:** Quality Assurance Lead; Engineering Lead`
   - `**Required Signatures:** 2`
3. Merge only after required approvals on the current head commit.
4. After merge, the merged PR is PIN-signed through the standard Part 11 flow. That post-merge attestation is the formal approval of the plan baseline.

### 3.4 Execute the Approved Plan
1. Dry-run or exploratory execution may occur before the formal release-readiness gate, but those runs are not the controlled release-evidence set.
2. Formal release-candidate V&V begins only after the approved release-readiness decision names:
   - the candidate revision or cutoff on `main`
   - the included/deferred change set
   - the binary or deployment package entering formal V&V
3. Every controlled execution run containing one or more tests must begin by recording the exact execution configuration before the first test starts, including:
   - operating system or platform version
   - hardware model, host, or device under test
   - environment or deployment name
   - binary, image, or package identifier under test
   - any supporting software or dependency versions needed to reproduce the run
4. Execute only against the recorded configuration for that run.
5. Automated evidence may be generated in GitHub Actions or other validated tooling, but the controlled record must capture the exact job/run or artifact reference.
6. Manual execution results are recorded in the designated product/study repository using the execution log template or an equivalent controlled derivative.
7. Deviations or failed results are logged immediately and linked to defects, nonconformities, CAPA, or change actions as applicable.
8. If the binary or deployment package changes after formal execution has started, open a new controlled execution run with a new configuration capture and reassess the required regression scope before using the new results for release.

### 3.5 Review and Sign Evidence and the V&V Report
1. Open a second PR that commits:
   - execution log
   - evidence index
   - deviation log or linked deviation summary
   - V&V report with release recommendation or restriction
2. The executor must not be the sole approver of this PR.
3. The PR body must state:
   - `**Meaning of Signature:** Approved V&V Evidence and Report`
   - `**Signer Roles:** Quality Assurance Lead; Engineering Lead`
   - `**Required Signatures:** 2`
4. After merge, collect the post-merge PIN-based Part 11 attestation on the merged PR.
5. Route the approved V&V report into the final release-decision gate defined in WI-002 before shipment authorization.
6. Publish the immutable release package and link it from the MDF, risk records, usability records, and release baseline as applicable.

### 3.6 Change Control and Re-Execution
1. If planned scope, environment, or acceptance criteria change, revise the plan through a new PR before further execution.
2. If test outcomes invalidate prior approval assumptions, reopen affected risk, change, or release decisions before shipment.
3. Individual engineers may execute tests and prepare evidence, but the engineering lead remains accountable for plan completeness, evidence disposition, and routing into release decisions.

## 4. Required Records
- V&V planning issue
- Approved V&V plan record and test case index in the designated product/study repository
- Test execution log with per-run configuration capture and evidence index
- Deviation log
- V&V report with signed approval evidence

## 5. Revision History
| Revision | Effective Date | Change Summary |
|---|---|---|
| R00 | 2026-03-06 | Initial release defining GitHub-native V&V execution flow. |
| R01 | 2026-03-06 | Clarified that product V&V execution records are maintained in designated product/study repositories using QMS Lite templates as the default baseline. |
| R02 | 2026-03-07 | Normalized V&V signoff accountability to the engineering owner role while keeping engineers as the minimum trained execution role. |
| R03 | 2026-03-07 | Renamed the accountable technical signoff role to `engineering_lead`. |
| R04 | 2026-03-07 | Distinguished dry runs from formal release-candidate V&V, required approved release-readiness entry before formal execution, and made per-run configuration capture mandatory. |
| R05 | 2026-03-07 | Explicitly routed the approved V&V report into the separate final release-decision gate before shipment authorization. |
