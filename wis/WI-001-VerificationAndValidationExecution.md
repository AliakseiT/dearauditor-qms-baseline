---
wi_id: WI-001
title: Verification and Validation Execution
revision: R02
effective_date: 2026-03-07
status: Published
owner_role: engineering_owner
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
   - `**Signer Roles:** Quality Assurance Lead; Engineering Owner`
   - `**Required Signatures:** 2`
3. Merge only after required approvals on the current head commit.
4. After merge, the merged PR is PIN-signed through the standard Part 11 flow. That post-merge attestation is the formal approval of the plan baseline.

### 3.4 Execute the Approved Plan
1. Execute only against the frozen build, environment, and target commit named in the approved plan.
2. Automated evidence may be generated in GitHub Actions or other validated tooling, but the controlled record must capture the exact job/run or artifact reference.
3. Manual execution results are recorded in the designated product/study repository using the execution log template or an equivalent controlled derivative.
4. Deviations or failed results are logged immediately and linked to defects, nonconformities, CAPA, or change actions as applicable.

### 3.5 Review and Sign Evidence and the V&V Report
1. Open a second PR that commits:
   - execution log
   - evidence index
   - deviation log or linked deviation summary
   - V&V report with release recommendation or restriction
2. The executor must not be the sole approver of this PR.
3. The PR body must state:
   - `**Meaning of Signature:** Approved V&V Evidence and Report`
   - `**Signer Roles:** Quality Assurance Lead; Engineering Owner`
   - `**Required Signatures:** 2`
4. After merge, collect the post-merge PIN-based Part 11 attestation on the merged PR.
5. Publish the immutable release package and link it from the MDF, risk records, usability records, and release baseline as applicable.

### 3.6 Change Control and Re-Execution
1. If planned scope, environment, or acceptance criteria change, revise the plan through a new PR before further execution.
2. If test outcomes invalidate prior approval assumptions, reopen affected risk, change, or release decisions before shipment.
3. Individual engineers may execute tests and prepare evidence, but the engineering owner remains accountable for plan completeness, evidence disposition, and routing into release decisions.

## 4. Required Records
- V&V planning issue
- Approved V&V plan record and test case index in the designated product/study repository
- Test execution log and evidence index
- Deviation log
- V&V report with signed approval evidence

## 5. Revision History
| Revision | Effective Date | Change Summary |
|---|---|---|
| R00 | 2026-03-06 | Initial release defining GitHub-native V&V execution flow. |
| R01 | 2026-03-06 | Clarified that product V&V execution records are maintained in designated product/study repositories using QMS Lite templates as the default baseline. |
| R02 | 2026-03-07 | Normalized V&V signoff accountability to the engineering owner role while keeping engineers as the minimum trained execution role. |
