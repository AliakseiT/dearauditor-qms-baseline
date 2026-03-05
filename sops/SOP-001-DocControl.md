---
sop_id: SOP-001
title: Document and Record Control
revision: R03
effective_date: 2026-03-05
status: Published
owner_role: qa_lead
approver_role: management_representative
iso_13485_clauses:
  - 4.2.4
  - 4.2.5
related_issue: "#1"
---

## 1. Purpose
Define how ACME GmbH creates, reviews, approves, revises, distributes, and archives controlled QMS documents and quality records.

## 2. Scope
Applies to controlled QMS documentation in `qms-lite` and to quality records maintained in designated GitHub product/study record repositories. Product/study execution records are not maintained in `qms-lite`.

## 3. Inputs
- Change request, issue, CAPA, audit finding, or management review action
- Applicable standard/regulatory update
- Existing controlled document revision

## 4. Outputs
- Approved controlled document revision in `main` of the governing repository
- Immutable execution record through PR history and released record assets
- Updated published index and training obligations

## 5. Roles and Responsibilities
| Role | Responsibilities |
|---|---|
| QA Lead | Maintains document control process and naming/version rules. |
| Management Representative | Approves new/revised SOPs and critical records. |
| Process Owner | Drafts/updates document content and verifies technical correctness. |
| All Personnel | Use only current approved revisions. Responsible for maintaining the security of their GitHub credentials. The use of a user's GitHub account to approve a pull request under this QMS constitutes their legally binding electronic signature. |

## 6. Procedure

### 6.1 Document Classes
1. `SOP`: controlled procedures in `sops/`.
2. `Matrix`: structured governance references in `matrices/`.
3. `Template`: forms for planning/execution in `.github/ISSUE_TEMPLATE` and template artifacts in `records/*`.
4. `Execution Record`: objective evidence maintained in approved external record repositories.

### 6.2 Identification and Metadata
1. SOP files must use `SOP-XXX-Title.md` naming.
2. SOPs must include YAML front matter fields: `sop_id`, `title`, `revision`, `effective_date`, `status`, `owner_role`, `approver_role`, `iso_13485_clauses`.
3. Revision format is `RNN` (for example `R03`).

### 6.3 Draft, Review, and Approval
1. All controlled document and record changes are prepared on a branch in the target repository and submitted via PR with linked issue context.
2. The PR must identify the execution issue and state the required Part 11 signature meaning and roles.
3. At least one designated approver reviews technical and compliance adequacy.
4. Electronic Signature Declaration: Execution of a PR approval in GitHub, when captured by the `qms-lite` signature automation, constitutes a legally binding electronic signature equivalent to a handwritten signature.
5. Merges are permitted only after required status checks and reviewer approvals are successfully completed.
6. Part 11 signature collection and attestation evidence are captured post-merge on the merged PR and must complete before immutable record publication.

### 6.4 Published Index Synchronization
1. Any SOP text change must update the Published SOP Index in `README.md`.
2. Index entries must include SOP ID, title, file, effective date, revision, and status.
3. `sop_published_index_guard.yml` blocks PRs where SOP updates are not reflected in index changes.

### 6.5 Training and Role Impact Synchronization
1. SOP revisions must be evaluated for role/training impact.
2. `matrices/training_matrix.yml` must be updated when role coverage changes.
3. Training assignment automation creates issues only for mapped roles/users.

### 6.6 Record Retention and Immutability
1. Merged PRs serve as the trigger for immutable evidence of the approved document state.
2. The definitive quality record consists of the cryptographically signed `signed_attestation.json` and corresponding immutable GitHub Release/Sigstore attestation bundle in the target record repository.
3. A human-readable `Electronic_Signature_Certificate.pdf` is automatically generated alongside these assets to satisfy regulatory manifestation requirements (for example displaying the printed name, date/time, and meaning of the signature).
4. Required quality records are published as immutable release assets in the designated record repository and linked back to source PR context.
5. Obsolete revisions remain available in Git history and must not be deleted.

### 6.7 External Documents
1. External normative references are maintained as citation metadata, not copied full text.
2. If external requirements change, impacted SOPs are revised through controlled change.

## 7. Required Records
- PR with approvals and Part 11 attestation
- Updated `README.md` published SOP index
- Record release manifest and immutable release assets in the designated record repository when applicable
- Training issue/record when applicable

## 8. Traceability
| ISO 13485 Clause | Control in this SOP |
|---|---|
| 4.2.4 | Defines document approval, revision control, and controlled availability. |
| 4.2.5 | Defines record identification, retention, and immutability expectations. |

## 9. Related Controlled Documents
- SOP-005 QMS Governance and Quality Manual
- SOP-009 Change Management
- `README.md` Published SOP Index

## 10. Revision History
| Revision | Effective Date | Change Summary |
|---|---|---|
| R00 | 2026-03-01 | Initial placeholder release. |
| R01 | 2026-03-02 | Full procedure content implemented for ACME GmbH. |
| R02 | 2026-03-05 | Updated Sections 5, 6.3, and 6.6 to formally define GitHub PR approvals as binding electronic signatures and clarify the structure of immutable cryptographic records. |
| R03 | 2026-03-05 | Updated repository-of-record model: product/study records are maintained outside `qms-lite`, and SOP workflow wording now matches post-merge Part 11 signature collection before immutable publication. |
