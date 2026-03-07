---
sop_id: SOP-001
title: Document and Record Control
revision: R07
effective_date: 2026-03-07
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
2. `WI`: controlled work instructions in `wis/` that define default execution detail for selected SOP activities.
3. `Matrix`: structured governance references in `matrices/`.
4. `Template`: forms for planning/execution in `.github/ISSUE_TEMPLATE` and template artifacts in `records/*`.
5. `Execution Record`: objective evidence maintained in approved target record repositories.

### 6.2 Identification and Metadata
1. SOP files must use `SOP-XXX-Title.md` naming.
2. WI files must use `WI-XXX-Title.md` naming and include YAML front matter fields: `wi_id`, `title`, `revision`, `effective_date`, `status`, `owner_role`, `related_sops`.
3. SOPs must include YAML front matter fields: `sop_id`, `title`, `revision`, `effective_date`, `status`, `owner_role`, `approver_role`, `iso_13485_clauses`.
4. Revision format is `RNN` (for example `R03`).

### 6.3 Draft, Review, and Approval
1. All controlled document and record changes are prepared on a branch in the target repository and submitted via PR with linked issue context.
2. Branch-only and PR-draft states are work-in-progress and are not approved controlled revisions, released baselines, or record evidence.
3. The PR must identify the execution issue and state the required electronic-signature meaning and roles.
4. At least one designated approver reviews technical and compliance adequacy.
5. Electronic Signature Declaration: Execution of a PR approval in GitHub, when captured by the `qms-lite` signature automation, constitutes a legally binding electronic signature equivalent to a handwritten signature.
6. Merges are permitted only after required status checks and reviewer approvals are successfully completed.
7. Controlled state exists only after merge to `main` in the governing repository and, where required by process, after the associated immutable release/tag evidence is created.
8. Signature collection and attestation evidence are captured post-merge on the merged PR and must complete before immutable record publication.

### 6.4 Published Index Synchronization
1. Any SOP text change must update the Published SOP Index in `README.md`.
2. Index entries must include SOP ID, title, file, effective date, revision, and status.
3. `1.4_qms_content_gate.yml` blocks PRs where SOP updates are not reflected in index changes.

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
3. A controlled document authored outside GitHub, for example in Word, must be brought under QMS control through a manifest-based record package in the target repository.
4. The package must include:
   - the controlled rendering approved under this QMS, normally PDF
   - the native source file when retention is required by process or product needs
   - source-system identifier, source revision/version, and export timestamp
   - SHA-256 hashes for the controlled rendering and retained native source
   - PR and issue references used for approval and immutable release publication
5. Approval and retention of such external-origin documents follow the same issue -> PR -> merge -> signature attestation -> immutable release sequence used for GitHub-authored controlled records.
6. The approved rendering and manifest in the target repository are the QMS-controlled record of the approved state, even when the authoring system is external.

## 7. Required Records
- PR with approvals and signature attestation
- Updated `README.md` published SOP index
- Record release manifest and immutable release assets in the designated record repository when applicable
- External document manifest and hash evidence when external-origin controlled documents are used
- Training issue/record when applicable

## 8. Traceability
| ISO 13485 Clause | Control in this SOP |
|---|---|
| 4.2.4 | Defines document approval, revision control, and controlled availability. |
| 4.2.5 | Defines record identification, retention, and immutability expectations. |

## 9. Related Controlled Documents
- SOP-005 QMS Governance and Quality Manual
- SOP-009 Change Management
- WI-001 Verification and Validation Execution
- WI-002 Configuration and Release Management Execution
- `records/external/external_document_manifest_template.yml`
- `README.md` Published SOP Index

## 10. Revision History
| Revision | Effective Date | Change Summary |
|---|---|---|
| R00 | 2026-03-01 | Initial placeholder release. |
| R01 | 2026-03-02 | Full procedure content implemented for ACME GmbH. |
| R02 | 2026-03-05 | Updated Sections 5, 6.3, and 6.6 to formally define GitHub PR approvals as binding electronic signatures and clarify the structure of immutable cryptographic records. |
| R03 | 2026-03-05 | Updated repository-of-record model: product/study records are maintained outside `qms-lite`, and SOP workflow wording now matches post-merge Part 11 signature collection before immutable publication. |
| R04 | 2026-03-06 | Added controlled WI document class and metadata rules for the targeted GitHub-native execution instructions. |
| R05 | 2026-03-06 | Added normative control path for external-origin documents and clarified manifest/hash requirements for documents authored outside GitHub. |
| R06 | 2026-03-07 | Updated workflow references and terminology to the current gate and electronic-signature naming model. |
| R07 | 2026-03-07 | Updated workflow filename references to the per-automation numbering scheme. |
