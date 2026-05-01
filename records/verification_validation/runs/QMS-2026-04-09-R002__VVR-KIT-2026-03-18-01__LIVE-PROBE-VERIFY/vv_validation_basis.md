# V&V Validation Basis

## Purpose
This record exposes the input side of the validation package so reviewers can assess whether the verification and validation evidence is sufficient. It is generated with the run evidence and is intended to be read before `vv_report.md`, `validation-summary.pdf`, or `evidence.zip`.

## Verification / Validation Scope
- Scope type: DearAuditor reference QMS baseline control-system validation
- Target repository: `AliakseiT/dearauditor-qms-baseline`
- Target ref / tag: `QMS-2026-04-09-R002`
- Target resolved revision: `fc7b66eb4818a05e908764e36d0f2a293a112f93`
- Execution mode: `live`
- Included control surface: GitHub repository records, pull-request review flow, GitHub Actions workflows, signature worker ceremony integration, signature attestation comments, V&V release publication, evidence package generation, and reviewer-accessible evidence links.
- Explicit boundary: company/adopter validation remains required for local intended use, users, role assignments, repository settings, secrets, supplier controls, operational access reviews, and company-specific record scope.

## System Requirements
Source record: `records/design/system_requirements_spec.yml`

| Requirement | Statement | Acceptance criteria used for this run |
|---|---|---|
| SYS-REQ-001 | Conformance Kit shall use GitHub issues, pull requests, controlled content, and releases as the canonical controlled surface for QMS operation and change history. | Adopted baseline documents GitHub as the canonical controlled surface.<br>Run evidence records the target baseline and controlled release path. |
| SYS-REQ-004 | The dedicated Conformance Kit SDLC repository shall record the adopted upstream baseline and use controlled changes when moving to a new upstream revision. | Target ref or release tag is recorded before execution.<br>Probe and evidence changes are opened through governed pull requests. |
| SYS-REQ-005 | Conformance Kit shall define validation and revalidation triggers for quality-critical platform, workflow, and intended-use changes. | Run protocol identifies scope, target revision, and downstream validation boundary.<br>Residual platform validation gaps are listed for follow-up instead of being silently accepted. |
| SYS-REQ-006 | The SDLC repository shall maintain explicit traceability from user needs and system requirements to architecture components, implementation files, risk controls, and verification evidence for the adopted baseline. | Validation basis maps requirements and risks to selected tests and evidence.<br>Test scripts and deterministic check implementations are named for each selected test. |
| SYS-REQ-002 | Conformance Kit shall collect post-merge signature evidence in a flow that verifies designated signer identity, binds the ceremony to the current request context, and records the resulting attestation. | Target-generated signature request is present.<br>Signature attestation references the approved request context, signer, meaning, and target hash. |
| SYS-REQ-003 | Conformance Kit shall publish immutable record-release packages that include source content, manifest hashes, source PR linkage, and signed attestation metadata. | Publication workflow produces V&V release evidence.<br>Evidence package includes manifest/source linkage and signed attestation metadata where applicable. |

## Risk Basis
Source record: `records/risk/risk_register.yml`

| Risk | Hazard / threat | Controls assessed by this package |
|---|---|---|
| RISK-003 | The SDLC evidence set no longer matches the actual adopted upstream Conformance Kit revision. | Record adopted upstream repository/ref and move to new revisions only through controlled PR updates.<br>Maintain traceability from requirements to architecture, implementation references, and verification artifacts. |
| RISK-004 | A platform or workflow change invalidates the validated intended use without triggering reassessment. | Identify target revision, environments, and revalidation triggers in V&V planning.<br>Review major platform, workflow, or upstream changes through controlled SDLC changes before use. |
| RISK-001 | Incorrect or unauthorized electronic signature is captured for a controlled request. | Verify GitHub login against designated signer and request context.<br>Require PIN verification before posting attestation evidence. |
| RISK-002 | Immutable record release package is incomplete or loses source linkage. | Generate record bundle manifests with source hashes, source PR linkage, and signed attestation metadata before release publication. |

## Verification Plan And Coverage
Plan source: `records/verification_validation/vv_run_plan.yml`
Test index source: `records/verification_validation/test_case_index.yml`
Run protocol: `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/vv_run_protocol.md`

| Test case | Category / type | Requirement coverage | Risk coverage | Test script | Deterministic implementation | Procedure summary | Acceptance basis | Result evidence |
|---|---|---|---|---|---|---|---|---|
| TC-KIT-0001 | IQ / mixed | SYS-REQ-001, SYS-REQ-004, SYS-REQ-005, SYS-REQ-006 | RISK-003, RISK-004 | records/verification_validation/TC-KIT-IQ-001.md | kit/src/core/checks/tc-kit-0001.ts | Inspect the target baseline/control surface, workflow files, controlled-document references, and traceability records. | Baseline, controlled-surface, and review-path prerequisites are consistent and traceable. | pass; records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0001/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.md |
| TC-KIT-0002 | IQ / mixed | SYS-REQ-002 | RISK-001 | records/verification_validation/TC-KIT-IQ-002.md | kit/src/core/checks/tc-kit-0002.ts | Inspect target signature configuration and, for live execution, capture the target-generated signing ceremony page. | Target signature configuration is present and target-generated ceremony evidence is captured when required. | pass; records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0002/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.md |
| TC-KIT-0003 | IQ / mixed | SYS-REQ-003 | RISK-002 | records/verification_validation/TC-KIT-IQ-003.md | kit/src/core/checks/tc-kit-0003.ts | Inspect target release-publication workflow support and verify that a V&V evidence release exists for live probe evidence. | V&V publication workflow is configured and a V&V release exists for live probe evidence. | pass; records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0003/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.md |
| TC-KIT-0101 | OQ / manual | SYS-REQ-001, SYS-REQ-002, SYS-REQ-003, SYS-REQ-004, SYS-REQ-005, SYS-REQ-006 | RISK-001, RISK-002, RISK-003, RISK-004 | records/verification_validation/TC-KIT-OQ-001.md | kit/src/core/checks/tc-kit-0101.ts | Correlate the target PR, merge state, signature evidence, release evidence, and generated evidence package. | End-to-end probe links the target PR, merge, signature, and evidence package. | pass; records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0101/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.md |
| TC-KIT-0201 | PQ / manual_gated | SYS-REQ-001, SYS-REQ-002, SYS-REQ-004 | RISK-001, RISK-003 | records/verification_validation/TC-KIT-PQ-001.md | kit/src/core/checks/tc-kit-0201.ts | Open or verify a controlled target-repository probe PR containing an obvious validation test record. | Controlled live probe PR exists in the target repository and is reviewable. | pass; records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0201/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.md |
| TC-KIT-0202 | PQ / manual_gated | SYS-REQ-002, SYS-REQ-003, SYS-REQ-006 | RISK-001, RISK-002, RISK-004 | records/verification_validation/TC-KIT-PQ-002.md | kit/src/core/checks/tc-kit-0202.ts | After manual approval/signature, verify the merged probe PR, signature attestation, and retained release evidence. | Probe PR is merged and target signature request/attestation evidence is present. | pass; records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0202/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.md |

## Test Scripts And Deterministic Check Coverage
- Human-readable test scripts are the `records/verification_validation/TC-KIT-*.md` records named in the coverage table.
- Deterministic executable checks are the `kit/src/core/checks/tc-kit-*.ts` implementations named in the coverage table.
- The live probe pair is manual-gated: `TC-KIT-0201` opens/verifies the controlled probe PR, and `TC-KIT-0202` verifies merge/signature evidence after the manual gate.
- Browser evidence is captured only for checks that require UI-mediated ceremony evidence and is retained inside `evidence.zip`.

## Evidence And Report Outputs
- Execution log: `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/vv_execution_log.yml`
- Evidence index: `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/vv_evidence_index.yml`
- Evidence manifest: `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/vv_evidence_manifest.yml`
- Review record: `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/vv_review.md`
- V&V report: `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/vv_report.md`
- Run record JSON: `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/run-record.json`
- Summary PDF: `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/validation-summary.pdf`
- Evidence bundle: `evidence.zip`

## Reviewer Assessment Prompt
The reviewer should confirm:
- the scope matches the intended baseline/reference-QMS validation use;
- every covered requirement has at least one passing test or documented deviation;
- each quality-critical risk has an assessed control and linked evidence;
- the listed test scripts and deterministic checks are sufficient for the stated scope;
- residual platform/adopter gaps are explicitly identified instead of implied as completed.
