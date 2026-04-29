---
record_type: isms_evidence_run_report
report_id: "ISMS-ERR-<yyyy-mm-dd>"
plan_reference: "records/isms/evidence_collection_plan.md"
scope_reference: "records/isms/isms_register.yml"
soa_reference: "records/isms/statement_of_applicability.yml"
run_started_at: "YYYY-MM-DDThh:mm:ssZ"
run_completed_at: "YYYY-MM-DDThh:mm:ssZ"
approval:
  meaning_of_signature: "Approved ISMS Evidence Run Report"
  signer_roles:
    - management_representative
    - technical_qms_maintainer
---

# ISMS Evidence Run Report Template

Use this template to convert collector output into a controlled, auditor-readable ISMS evidence record. Keep raw collector files as linked artifacts or release assets; do not rely on raw scanner output alone as the controlled record.

## 1. Run Summary

Example:

- Reporting period: `YYYY-MM-DD` to `YYYY-MM-DD`
- Plan reference: `records/isms/evidence_collection_plan.md`
- Systems assessed: GitHub organization, Microsoft 365 tenant, Azure subscription
- Overall result: pass | pass with exceptions | fail | inconclusive
- Executive summary: no critical findings; two medium findings accepted under `ISMS-EXC-001`.

## 2. Collector Execution Log

| Collector Profile | Collector | Version / Pin | Runner | Started | Completed | Identity Used | Permission Scope | Raw Artifact | SHA-256 |
|---|---|---|---|---|---|---|---|---|---|
| `maester` | Maester | `vX.Y.Z` | GitHub Actions run URL | timestamp | timestamp | app registration ID | Graph read permissions | artifact URL | hash |
| `prowler` | Prowler | `vX.Y.Z` | GitHub Actions run URL | timestamp | timestamp | service principal | subscription reader | artifact URL | hash |

## 3. Normalized Control Results

| SoA Control ID | Evidence Objective | Collector Profile | Collector | Result | Evidence Summary | Linked Risk / Exception / CAPA / Change |
|---|---|---|---|---|---|---|
| `A.5.example` | Confirm access review completed | `manual-attestation` | PR-reviewed statement | pass | Review completed on `YYYY-MM-DD`; no unresolved privileged-access findings. | N/A |
| `A.8.example` | Confirm privileged identity controls | `maester` | Maester | fail | One privileged account missing required control. | `ISMS-RISK-001`, `ISMS-EXC-001` |

Allowed result values:

- `pass`
- `fail`
- `not_applicable`
- `manual_review`
- `inconclusive`

## 4. Findings and Follow-Up

| Finding ID | Severity | Source | Description | Owner Role | Due Date | Required Follow-Up |
|---|---|---|---|---|---|---|
| `ISMS-FIND-001` | medium | Maester | Example finding text. | technical_qms_maintainer | `YYYY-MM-DD` | update ISMS risk and open change/CAPA if not resolved by due date |

## 5. Exceptions and Risk Acceptance

- New exceptions requested: none | list here
- Existing exceptions reviewed: `ISMS-EXC-001`
- Residual risk acceptance required: yes | no
- Management Representative decision:

## 6. Data Handling and Limitations

- Raw artifacts stored at:
- Redactions applied:
- Known tool limitations:
- Evidence gaps:
- Follow-up collection needed:

## 7. Conclusion

- Evidence run accepted: yes | no
- SoA update required: yes | no
- ISMS register update required: yes | no
- CAPA/change/supplier/product-risk follow-up required: yes | no
- Next planned run:

## 8. Approval Record

- Report approved: yes | no
- Approval date: `YYYY-MM-DD`
- Linked approving PR: `#123`
- Notes:
