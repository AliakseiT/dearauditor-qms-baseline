# Test Case

## Metadata
- Test Case ID: TC-QMSL-0002
- Title: Signature flow identity and request-context verification
- Type: mixed
- Target Product: qms-lite
- Requirement References: SYS-REQ-002
- Risk References: RISK-001
- Preconditions:
  - a merged controlled change requires signatures
  - signer accounts and signature-worker environment are available
  - signer registry and PIN flow are configured for the test accounts
- Script or File Reference: upstream/qms-lite/.github/workflows/2.1_pr_signature_request_gate.yml; upstream/qms-lite/services/signature-worker/src/index.ts

## Steps
1. Open the signature request from the merged controlled change.
2. Attempt the flow with a non-designated GitHub account and capture the rejection behavior.
3. Repeat with the designated signer account and complete the PIN verification step.
4. Confirm the resulting attestation references the expected request context and signer.

## Expected Result
- A non-designated signer is rejected.
- The designated signer can complete the ceremony only through the expected identity and request context.
- The generated attestation records the expected signer and target context.

## Evidence
- Evidence Type: log
- Evidence Location: records/verification_validation/execution_evidence/TC-QMSL-0002/
