---
sop_id: SOP-001
title: Document and Record Control
revision: R01
effective_date: 2026-03-02
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
Applies to all controlled information in `qms-lite`, including SOPs, matrices, execution records, templates, and evidence files used to demonstrate QMS compliance.

## 3. Inputs
- Change request, issue, CAPA, audit finding, or management review action
- Applicable standard/regulatory update
- Existing controlled document revision

## 4. Outputs
- Approved controlled document revision in `main`
- Immutable execution record through PR history and released record assets
- Updated published index and training obligations

## 5. Roles and Responsibilities
| Role | Responsibilities |
|---|---|
| QA Lead | Maintains document control process and naming/version rules. |
| Management Representative | Approves new/revised SOPs and critical records. |
| Process Owner | Drafts/updates document content and verifies technical correctness. |
| All Personnel | Use only current approved revisions. |

## 6. Procedure

### 6.1 Document Classes
1. `SOP`: controlled procedures in `sops/`.
2. `Matrix`: structured governance references in `matrices/`.
3. `Record`: objective evidence in `records/`.
4. `Template`: forms for planning/execution in `.github/ISSUE_TEMPLATE` and `records/*`.

### 6.2 Identification and Metadata
1. SOP files must use `SOP-XXX-Title.md` naming.
2. SOPs must include YAML front matter fields: `sop_id`, `title`, `revision`, `effective_date`, `status`, `owner_role`, `approver_role`, `iso_13485_clauses`.
3. Revision format is `RNN` (for example `R03`).

### 6.3 Draft, Review, and Approval
1. All controlled document changes are prepared on a branch and submitted via PR.
2. PR must identify execution issue and Part 11 signature meaning/roles.
3. At least one designated approver reviews technical and compliance adequacy.
4. Merge is permitted only after required checks and required signature gate completion.

### 6.4 Published Index Synchronization
1. Any SOP text change must update the Published SOP Index in `README.md`.
2. Index entries must include SOP ID, title, file, effective date, revision, and status.
3. `sop_published_index_guard.yml` blocks PRs where SOP updates are not reflected in index changes.

### 6.5 Training and Role Impact Synchronization
1. SOP revisions must be evaluated for role/training impact.
2. `matrices/training_matrix.yml` must be updated when role coverage changes.
3. Training assignment automation creates issues only for mapped roles/users.

### 6.6 Record Retention and Immutability
1. Merged PRs are immutable evidence of approved document state.
2. Required quality records are published as immutable release assets in `qms-records`.
3. Obsolete revisions remain available in Git history and must not be deleted.

### 6.7 External Documents
1. External normative references are maintained as citation metadata, not copied full text.
2. If external requirements change, impacted SOPs are revised through controlled change.

## 7. Required Records
- PR with approvals and Part 11 attestation
- Updated `README.md` published SOP index
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
