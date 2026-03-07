# Test Case

## Metadata
- Test Case ID: TC-QMSL-0001
- Title: Controlled upstream-baseline and review-path verification
- Type: mixed
- Target Product: qms-lite
- Requirement References: SYS-REQ-001; SYS-REQ-004; SYS-REQ-005
- Risk References: RISK-003; RISK-004
- Preconditions:
  - `adoption/upstream-baseline.json` is present in the SDLC repo
  - the adopted upstream baseline is available for review
  - repository issue and pull-request flow is available
- Script or File Reference: adoption/upstream-baseline.json; upstream/qms-lite/README.md; upstream/qms-lite/docs/architecture/README.md

## Steps
1. Review `adoption/upstream-baseline.json` and confirm the upstream repository and exact baseline ref are recorded.
2. Confirm the SDLC design, risk, and V&V records all reference the same adopted baseline and current intended-use scope.
3. Open a controlled change in the SDLC repo and confirm review is planned through issue and pull-request flow rather than direct unreviewed editing.
4. Confirm the V&V plan identifies revalidation triggers for upstream baseline or workflow changes.

## Expected Result
- The active upstream baseline is explicit and consistent across SDLC records.
- The planned change path remains issue -> branch -> pull request -> review.
- Revalidation triggers are documented before relying on the software item baseline.

## Evidence
- Evidence Type: report
- Evidence Location: records/verification_validation/execution_evidence/TC-QMSL-0001/
