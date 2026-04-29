---
record_type: isms_evidence_collection_plan
plan_id: "ISMS-ECP-<yyyy-mm-dd>"
scope_reference: "records/isms/isms_register.yml"
soa_reference: "records/isms/statement_of_applicability.yml"
planned_run_window: "YYYY-MM-DD to YYYY-MM-DD"
collection_mode: "manual|scheduled|change-triggered|incident-triggered"
approval:
  meaning_of_signature: "Approved ISMS Evidence Collection Plan"
  signer_roles:
    - management_representative
    - technical_qms_maintainer
---

# ISMS Evidence Collection Plan Template

Use this template to plan a controlled evidence collection run without making the QMS depend on one specific scanner or vendor tool.

## 1. Purpose and Scope

Example:

- Purpose: collect quarterly ISMS control evidence for the GitHub-native QMS baseline and connected Microsoft 365 tenant.
- In-scope systems: GitHub organization, Microsoft 365 tenant, Azure subscription, Cloudflare account.
- Out of scope: product runtime logs that are controlled in the product repository.
- Reporting period: `YYYY-MM-DD` to `YYYY-MM-DD`.
- Linked ISMS register: `records/isms/isms_register.yml`.
- Linked SoA: `records/isms/statement_of_applicability.yml`.

## 2. Collector Selection

Collectors are selected for this run only. Selection here does not approve a tool for all future use.

| Collector | Target System | Collection Method | Version / Pin | Authentication | Output Expected | Rationale |
|---|---|---|---|---|---|---|
| `maester` | Microsoft 365 / Entra | GitHub Action or PowerShell run | `vX.Y.Z` or commit SHA | read-only app registration | Pester/Maester test results | Microsoft security configuration checks |
| `prowler` | Azure / AWS / GCP / Cloudflare / GitHub | CLI or container | `vX.Y.Z` or image digest | least-privilege service principal/token | JSON/CSV/native report | cloud posture checks |
| `microsoft-graph` | Microsoft 365 / Entra | PowerShell or API script | module/API version | read-only app registration | JSON export | raw audit/sign-in/configuration evidence |
| `manual-attestation` | Control not machine-collectable | PR-reviewed statement | N/A | named responsible role | Markdown statement + evidence links | policy/process evidence |

Allowed profile values are `prowler`, `maester`, `microsoft-graph`, and `manual-attestation`. Other tools may be used when justified for a specific run, but they are not reusable profiles until validated.

## 3. Evidence Contract

Each collector output must be normalized into a report that includes:

- collector name and version
- collector profile
- execution timestamp and runner
- target tenant/account/subscription/repository
- identity or service principal used
- permission scope used
- raw artifact reference and SHA-256
- mapped SoA control IDs
- result: pass, fail, not applicable, manual review, or inconclusive
- linked ISMS risk, exception, CAPA, supplier record, change record, or product risk item when applicable

## 4. Planned Controls and Queries

| SoA Control ID | Evidence Objective | Collector Profile | Query / Test / Check Reference | Expected Result | Follow-Up Rule |
|---|---|---|---|---|---|
| `A.5.example` | Confirm quarterly access review completed | `manual-attestation` | ISMS access review section | completed with no unresolved high-risk findings | open CAPA if overdue |
| `A.8.example` | Confirm privileged identity controls | `maester` or `microsoft-graph` | named test/query reference | pass or documented exception | update ISMS risk if failed |

## 5. Authentication and Safety Controls

- Credentials are stored in approved GitHub Actions secrets or an approved secret-management location.
- Collector identity is read-only unless a documented control requires broader access.
- No collector may change cloud configuration during evidence collection.
- Raw evidence containing secrets, personal data, or sensitive logs must be redacted or access-restricted before publication.
- Tool versions, action SHAs, container digests, and script revisions must be captured in the report.

## 6. Review and Done Criteria

- Plan reviewed by: management_representative, technical_qms_maintainer.
- Evidence run report expected at: `records/isms/evidence_run_report.md`.
- Done criteria:
  - selected collectors and versions recorded
  - authentication model approved
  - controls mapped to SoA IDs
  - expected outputs and follow-up rules defined
  - privacy/security handling reviewed

## 7. Approval Record

- Plan approved for execution: yes | no
- Approval date: `YYYY-MM-DD`
- Linked approving PR: `#123`
- Notes:
