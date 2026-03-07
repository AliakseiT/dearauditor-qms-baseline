# Test Case

## Metadata
- Test Case ID: TC-QMSL-0003
- Title: Immutable record-publication package verification
- Type: mixed
- Target Product: qms-lite
- Requirement References: SYS-REQ-003
- Risk References: RISK-002
- Preconditions:
  - a merged controlled record change exists
  - required signatures and attestations have completed
  - record publication workflow is enabled for the target repository
- Script or File Reference: upstream/qms-lite/.github/workflows/2.2_publish_qms_records.yml

## Steps
1. Merge a controlled record change that falls inside the execution-record publication scope.
2. Wait for immutable record publication to complete.
3. Inspect the produced release assets and manifest.
4. Confirm the package includes source content, source hashes, source PR linkage, and signed attestation metadata.

## Expected Result
- The workflow publishes an immutable release bundle for the changed record scope.
- The manifest captures the source repository, source PR, merge revision, and source hashes.
- Signed attestation metadata is included in the release package.

## Evidence
- Evidence Type: artifact
- Evidence Location: records/verification_validation/execution_evidence/TC-QMSL-0003/
