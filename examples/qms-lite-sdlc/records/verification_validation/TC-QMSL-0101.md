# Test Case

## Metadata
- Test Case ID: TC-QMSL-0101
- Title: End-to-end intended-use validation scenario
- Type: manual
- Target Product: qms-lite
- Requirement References: SYS-REQ-001; SYS-REQ-002; SYS-REQ-003; SYS-REQ-004; SYS-REQ-005
- Risk References: RISK-001; RISK-002; RISK-003; RISK-004
- Preconditions:
  - the SDLC repo has adopted the current upstream baseline
  - representative QA and engineering users are available
  - signature-worker environment and immutable-release target are available
- Script or File Reference: docs/regulatory/intended_use.md; records/verification_validation/qms_lite_vv_plan.yml

## Steps
1. Create or select a controlled change that updates a record or workflow-relevant artifact in the software item baseline.
2. Process the change through the normal issue and pull-request review path.
3. Complete the post-merge signature flow with the designated signer.
4. Confirm immutable record evidence is published for the changed execution record scope.
5. Review the resulting evidence package and confirm it supports the intended QMS use described in `docs/regulatory/intended_use.md`.

## Expected Result
- Trained internal users can operate the software item through the intended GitHub-native process.
- Approval, signature, and immutable publication evidence remain attributable to the reviewed change.
- The resulting evidence set is sufficient to support the intended QMS use for the selected baseline.

## Evidence
- Evidence Type: report
- Evidence Location: records/verification_validation/execution_evidence/TC-QMSL-0101/
