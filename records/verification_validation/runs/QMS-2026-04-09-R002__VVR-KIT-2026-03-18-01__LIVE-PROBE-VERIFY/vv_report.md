# Verification and Validation Report

## Metadata
- Report ID: VSR-KIT-2026-05-01-01
- Product ID: conformance-kit
- Run ID: QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY
- Planned Run ID: VVR-KIT-2026-03-18-01
- Execution Log Reference: records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/vv_execution_log.yml
- Evidence Index Reference: records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/vv_evidence_index.yml
- Evidence Manifest Reference: records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/vv_evidence_manifest.yml
- Approved Run Protocol Reference: records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/vv_run_protocol.md
- Validation Basis Reference: records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/vv_validation_basis.md
- Deviation Log Reference: records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/vv_deviation_log.md
- Evidence Review Reference: records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/vv_review.md
- Target Revision: fc7b66eb4818a05e908764e36d0f2a293a112f93
- Target Ref / Tag: QMS-2026-04-09-R002
- Planned Execution Date: 2026-03-18
- Report Date: 2026-05-01
- Generated At UTC: 2026-05-01T12:55:07.919Z

## Target Repository
- Repository: AliakseiT/dearauditor-qms-baseline
- Requested Repository: AliakseiT/dearauditor-qms-baseline
- Checkout Source: github
- Origin URL: https://github.com/AliakseiT/dearauditor-qms-baseline.git
- QMS URLs: https://sign.qms.dearauditor.ch
- Default Branch: main
- Current Branch: unknown
- HEAD Revision: fc7b66eb4818a05e908764e36d0f2a293a112f93
- Exact Git Tags on HEAD: QMS-2026-04-09-R002; sig-pr330-hc2de3ee6b44f-r01
- Visibility: public

## Scope
- Activity Type: verification_and_validation
- Execution Mode: live
- Validation Scope: DearAuditor reference QMS baseline control-system validation
- Scope Boundary: This evidence validates the reference baseline workflow behavior: GitHub repository controls, Actions workflows, signature worker integration, review/approval flow, immutable release publication, and evidence packaging. Company-specific QMS validation must be repeated or adopted in each downstream company repository with local configuration, users, roles, secrets, intended use, and record scope verified there.
- Covered Requirements: SYS-REQ-001; SYS-REQ-004; SYS-REQ-005; SYS-REQ-006; SYS-REQ-002; SYS-REQ-003
- Covered Risks: RISK-003; RISK-004; RISK-001; RISK-002
- Environment / Tooling References: AliakseiT/dearauditor-qms-baseline; https://github.com/AliakseiT/dearauditor-qms-baseline.git; fc7b66eb4818a05e908764e36d0f2a293a112f93; https://sign.qms.dearauditor.ch

## Summary of Results
- Total Test Cases: 6
- Passed: 6
- Failed: 0
- Blocked: 0
- Not Run: 0

## Evidence Completeness
- Execution Log: present
- Evidence Index: present
- Evidence Manifest: present
- Report Record: present
- Review Record: present
- Per-Test Evidence: present
- Screenshot / Browser Evidence: present
- Review Package: `evidence.zip`, `evidence.zip.sha256`, and `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/validation-summary.pdf`
- Screenshot Retention: Browser screenshots are included in `evidence.zip` and listed as evidence attachments; they are not duplicated as separate PR files unless explicitly committed.

## Requirement / Risk Traceability
| Requirement / Risk | Intended-use control | Test case | Acceptance basis | Evidence / status | Residual gap |
|---|---|---|---|---|---|
| SYS-REQ-001 / RISK-003 | Controlled baseline and review path | TC-KIT-0001 | Target repository exposes required baseline/QMS controls | `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0001/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.md` (pass) | Adopter must verify its own fork/configuration |
| SYS-REQ-002 / RISK-001 | Signature identity, meaning, timestamp, and ceremony link | TC-KIT-0002, TC-KIT-0202 | Target-generated ceremony and attestation are present | `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0002/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.md` (pass); `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0202/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.md` (pass) | Adopter must verify local signer authorization |
| SYS-REQ-003 / RISK-002 | Immutable evidence publication | TC-KIT-0003 | V&V release publication path observed | `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0003/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.md` (pass) | Retention/export controls tracked as platform follow-up |
| SYS-REQ-004 / RISK-003 | Controlled PR change for a V&V record | TC-KIT-0201 | Probe PR exists in target repository | `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0201/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.md` (pass) | None for baseline probe scope |
| SYS-REQ-005 / RISK-004 | Traceable evidence package | TC-KIT-0101 | End-to-end probe links run, PR, signature, and evidence | `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0101/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.md` (pass) | Company intended-use validation remains downstream |
| SYS-REQ-006 / RISK-004 | Reviewable generated records | All planned cases | Report, review, manifest, PDF, and bundle available | ready_for_formal_release | Negative/edge cases tracked below |

## Electronic Signature Control Mapping
| Control | Evidence reference | Baseline conclusion | Downstream/adopter boundary |
|---|---|---|---|
| Signer identity | `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0202/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.md` | Target attestation records signer identity and role | Local authorization review remains adopter-specific |
| Meaning of signature | `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0202/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.md` | PR/signature flow records explicit meaning | Company-specific meaning text may differ by record type |
| Timestamp | `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0202/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.md` | Attestation includes timestamp from target ceremony | Time-source qualification is platform follow-up |
| Signature-to-record linkage | `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0202/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.md` | Attestation links repository, PR, and target hash | Adopter must verify local record scope |
| Target hash / merge binding | `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0202/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.md` | Probe PR merge/signature linkage is verified | Branch protection/ruleset evidence is platform follow-up |
| Attestation retention | `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0003/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.md` | V&V release presence is verified | Long-term retention/export is platform follow-up |
| Record retrieval | `evidence.zip` | Bundle/PDF links are included in evidence PR | Adopter must retain final release assets |

## Negative / Edge-Case Coverage
| Control challenge | Coverage in this package | Disposition |
|---|---|---|
| Unauthorized signer cannot sign | Not directly challenged in this happy-path probe | Follow-up platform validation issue |
| Wrong signer link rejected | Not directly challenged in this happy-path probe | Follow-up signature-worker validation issue |
| Invalid/expired PIN fails | Not directly challenged in this happy-path probe | Follow-up signature-worker validation issue |
| Signature bound to intended PR/hash | Positively verified by probe PR/signature evidence | Covered for baseline happy path |
| Records cannot be silently changed after approval/publication | Publication release observed; deletion/edit controls not fully evidenced | Follow-up retention/immutability issue |
| Missing required approval prevents merge | Not directly challenged in this package | Follow-up repository enforcement issue |
| Missing required signature prevents completion/publication | Not directly challenged in this package | Follow-up workflow negative-case issue |
| Tampered/mismatched artifact hashes detected | Hashes generated and review checklist requires verification; tamper challenge not executed | Follow-up evidence-package negative test |

## Result Details
- TC-KIT-0001: **PASS**. Controlled GitHub-native QMS surface and review-path prerequisites are consistent for the target profile. Evidence: `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0001/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.md`
- TC-KIT-0002: **PASS**. Target-generated signature ceremony was discovered and browser evidence was captured when requested. Evidence: `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0002/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.md` Attachments: `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0002/ceremony/signature-ceremony-QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.jpg`
- TC-KIT-0003: **PASS**. Immutable V&V publication path was exercised for the live probe campaign and a V&V release is present in the target repository. Evidence: `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0003/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.md`
- TC-KIT-0101: **PASS**. End-to-end intended-use validation was exercised by the controlled live probe PR, which was merged and signed in the target repository. Evidence: `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0101/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.md`
- TC-KIT-0201: **PASS**. Controlled live probe PR creation was verified from the target repository PR supplied to this verify run. Evidence: `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0201/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.md`
- TC-KIT-0202: **PASS**. Live probe PR was merged and target signature evidence was found. Evidence: `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0202/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.md` Attachments: `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0202/browser/signature-ceremony-QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.jpg`

## Evidence Inventory
- `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/vv_execution_log.yml` SHA256 `142381960f3c292b844eabc7dab0125724cf203f6fe047263b04cf6cbc836a83`
- `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/vv_evidence_index.yml` SHA256 `63ba8300f58497b81615321a16a4da8dca14976f0f666b6e942678ceb169afa0`
- `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/vv_deviation_log.md` SHA256 `96d565080c6cca5ea9720416ec24ee7768de9d8f2311a9e23c57be71b69365f8`
- `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/vv_run_protocol.md` SHA256 `d28f7be1a2cc7288c3dd8ea3868cbcef1e8595df158b270bd79900102bf50362`
- `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/vv_validation_basis.md` SHA256 `b5b77c54473131c8730e8dd711dd06c11355cbc5ed1654562235f8dacc9d0299`
- `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/vv_review.md` SHA256 `aec0e2428f60e4a7b07717cd963153634b9419a1f624c806e8a3368c440f556f`
- `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0001/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.md` SHA256 `bcf38c157065bd5bb1efa526f0709d3750f0434038240f5a6065c97c99870a53`
- `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0002/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.md` SHA256 `7e7a2c1cfd49092ffd1cf823c0e5f8b327537b59a46575e174aeb1e8ca06ef12`
- `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0002/ceremony/signature-ceremony-QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.jpg` SHA256 `73d77bca00487b3041b2e5d813ac299ff590969dad6ecf1bcc3ececb09e28aa1`
- `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0003/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.md` SHA256 `9ffefe91092be51e6f453996cedc5ea26d0b435e92951913c364f1dd480bfd27`
- `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0101/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.md` SHA256 `1907fa7d7798dd926cc5383ee0075eaeefabc988bbc18914a3dee980d046f45e`
- `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0201/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.md` SHA256 `3513b9a9c2ab5375cc56536c874bb806d8f2a70da90e3ec50a62f36fdd1c1df9`
- `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0202/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.md` SHA256 `1e2998ba551622875aa3c2b904241f2b84d223186d6b26830fd7aa523ec48968`
- `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0202/browser/signature-ceremony-QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.jpg` SHA256 `73d77bca00487b3041b2e5d813ac299ff590969dad6ecf1bcc3ececb09e28aa1`

## Generated Review Artifacts
- Run Record JSON: `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/run-record.json`
- Validation Summary PDF: `records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/validation-summary.pdf`
- Evidence Bundle ZIP: `evidence.zip`
- Evidence Bundle SHA256: `evidence.zip.sha256`

## Recommendation
- ready_for_formal_release
