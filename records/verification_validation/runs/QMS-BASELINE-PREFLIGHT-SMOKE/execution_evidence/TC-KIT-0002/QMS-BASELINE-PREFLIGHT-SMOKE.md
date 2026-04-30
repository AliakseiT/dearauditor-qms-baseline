# Evidence Record

## Metadata
- Run ID: QMS-BASELINE-PREFLIGHT-SMOKE
- Test Case ID: TC-KIT-0002
- Repository: AliakseiT/dearauditor-qms-baseline

## Automated Preflight
- `SIGNATURE_UI_BASE_URL` configured: `true`
- Required repository secrets present: `true`
- Signer registry contains designated users: `true`
- Browser evidence requested: `false`
- Signature ceremony URL configured: `false`

## Observed State
- Signature UI URL: https://sign.qms.dearauditor.ch
- Signature ceremony URL: not configured
- Missing repository secrets: none detected
- Signer registry users: AliakseiT, InaTsitovich, SorenWesThorup
- Browser evidence: {"requested":false}
- Query issues: none

## Result
- Status: `not_run`
- Conclusion: Repository-side signature preflight passed, but live signer execution was intentionally not performed in this dry run.
