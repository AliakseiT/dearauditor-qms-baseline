# Evidence Record

## Metadata
- Run ID: QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY
- Test Case ID: TC-KIT-0002
- Repository: AliakseiT/dearauditor-qms-baseline

## Automated Preflight
- `SIGNATURE_UI_BASE_URL` configured: `true`
- Required repository secrets present: `true`
- Signer registry contains designated users: `true`
- Browser evidence requested: `true`
- Signature ceremony URL discovered from target repo: `true`
- Live probe verify phase: `true`

## Observed State
- Signature UI URL: https://sign.qms.dearauditor.ch
- Signature ceremony URL: https://sign.qms.dearauditor.ch/sign?repo=AliakseiT%2Fdearauditor-qms-baseline&pr=362&signer=aliakseit&role=Quality+Assurance+Lead
- Signature ceremony URL source: target_repository_signature_request
- Signature ceremony URL source reference: AliakseiT/dearauditor-qms-baseline#362
- Signature ceremony URL discovery notes: Ceremony URL discovered from a target repository signature request comment.
- Missing repository secrets: none detected
- Signer registry users: AliakseiT, InaTsitovich, SorenWesThorup
- Browser evidence: {"requested":true,"ok":true,"url":"https://sign.qms.dearauditor.ch/sign?repo=AliakseiT%2Fdearauditor-qms-baseline&pr=362&signer=aliakseit&role=Quality+Assurance+Lead","title":"DearAuditor Open QMS Baseline Sign","screenshot_reference":"records/verification_validation/runs/QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY/execution_evidence/TC-KIT-0002/ceremony/signature-ceremony-QMS-2026-04-09-R002__VVR-KIT-2026-03-18-01__LIVE-PROBE-VERIFY.jpg","notes":"Browser page loaded and screenshot evidence was captured."}
- Query issues: none

## Result
- Status: `pass`
- Conclusion: Target-generated signature ceremony was discovered and browser evidence was captured when requested.
