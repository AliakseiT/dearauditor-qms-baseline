# V&V Run Protocol

## Metadata
- Protocol ID: VVPROT-KIT-2026-05-01-01
- Product ID: conformance-kit
- Run ID: QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY
- Planned Run ID: VVR-KIT-2026-03-18-01
- Target Repository: AliakseiT/dearauditor-qms-baseline
- Target Ref / Tag: QMS-2026-04-09-R002
- Execution Mode: live
- Validation Basis Reference: records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/vv_validation_basis.md
- Planned Execution Date: 2026-03-18
- Generated At UTC: 2026-05-01T12:55:07.919Z

## Scope
- This protocol covers validation of the DearAuditor reference QMS baseline GitHub-native control workflow for the selected target repository/ref.
- Covered controls: repository review controls, GitHub Actions workflow execution, signature-worker ceremony integration, post-merge signature attestation, immutable V&V release publication, and evidence package generation.
- Downstream company/adopter QMS validation remains required for local intended use, configured users, role assignments, secrets, repository settings, record scope, supplier controls, and operational procedures.

## Acceptance Criteria
- All selected test cases pass or have approved deviations.
- The target probe PR is reviewed, merged, signed, and published through the target repository controls.
- Evidence records, evidence manifest, summary PDF, and evidence bundle are available for reviewer inspection before evidence PR approval.
- Electronic signature evidence is linked to the target repository PR, signer identity, meaning of signature, timestamp, target hash, and retained release assets.

## Planned Test Cases
- TC-KIT-0001: Controlled upstream-baseline and review-path verification (automated_preflight)
- TC-KIT-0002: Signature flow identity and request-context verification (automated_preflight_with_live_execution_blocker_capture)
- TC-KIT-0003: Immutable record-publication package verification (automated_preflight_with_publication_blocker_capture)
- TC-KIT-0101: End-to-end intended-use validation scenario (live_probe_end_to_end_verification)
- TC-KIT-0201: Controlled live validation probe PR creation (manual_live_probe_pr_creation)
- TC-KIT-0202: Post-merge signature and publication probe verification (manual_live_probe_signature_verification)

## Protocol Approval Model
- Approval is captured through the evidence PR review/signature workflow.
- Meaning of Signature: Approved V&V Evidence and Report
- Signer Role: Quality Assurance Lead
- Required Signatures: 1
