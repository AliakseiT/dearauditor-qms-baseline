---
record_id: RLN-QMS-2026-04-09-R002
record_type: qms_baseline_release_notes
product_id: DEARAUDITOR-QMS-BASELINE
release_tag: QMS-2026-04-09-R002
status: approved
owner_role: engineering_lead
approver_role: qa_lead
related_issue: "#329"
---

# Release Notes: QMS-2026-04-09-R002

## Purpose

This record supports the formal release of the DearAuditor Open QMS Baseline repository as
`QMS-2026-04-09-R002`.

This is the second published upstream baseline release. The `R002` suffix is the global sequential
QMS baseline release number and does not reset by date.

This release republishes the repository for downstream adoption after the post-R001 fixes to
release, signature, immutable record publication, and training automation. It does not approve
downstream operational use, deployment, or adopter release decisions.

## Release Unit

- Approved release commit on `main`; exact SHA captured in `qms_release_manifest.json`
- GitHub tag: `QMS-2026-04-09-R002`
- GitHub Release assets:
  - `qms_release_manifest.json`
  - `qms_release_snapshot.tgz`
- Release planning issue: GitHub issue `#329`
- Release change request: this PR
- Included merged fix PRs since `QMS-2026-04-08-R001`: `#321`, `#323`, `#324`, `#325`, `#326`,
  `#327`, `#328`

## Controlled Documents Entering Release

The release includes the current approved document set:

| Document family | Included documents | Release effect |
|---|---|---|
| Quality Manual | `QM-001` | Included unchanged in the tagged release |
| SOPs | `SOP-001` through `SOP-020` | Included unchanged in the tagged release |
| Work Instructions | `WI-001`, `WI-002` | Included unchanged in the tagged release |

The release does not rewrite QM, SOP, or WI content. It republishes the approved document set
under the next formal `QMS-*` baseline tag.

## Code and Automation Entering Release

The release includes the support code and automation merged after `QMS-2026-04-08-R001`,
including:

- release-signature flow hardening so non-`QMS-*` releases do not trigger QMS release-signature
  handling
- issue and training signature label reconciliation
- training status login normalization and refresh-flow deduplication
- support for bot-authored training-status signature requests
- bot-authored QMS record publication fixes, including manual backfill support and GitHub App token
  use for immutable record releases
- signature request parsing hardening for malformed escaped newline text

These changes affect release control, signature handling, immutable evidence publication, and
training-status maintenance. They do not change the published QM/SOP/WI text.

## Validation and Approval Check

- `python3 -m py_compile scripts/validate_qms_content.py scripts/resolve_signature_policy.py`
- `python3 scripts/validate_qms_content.py --base origin/main --head HEAD`
- `git diff --check`

The QMS content gate checks the full QM/SOP/WI set entering the release. It verifies that each
released document has a revision, an effective date, `status: Published`, a matching README index
entry, and a matching revision-history row.

The release decision also confirms that the post-R001 workflow fixes listed above are present in
the approved release commit.

Approval is confirmed through the signed PR history for the document revisions already in the
baseline and by the approval signatures on this release-decision PR.

## Training Scope

Training for this upstream baseline release remains governed by
`matrices/training_matrix.yml`.

For this release, the training focus is:

- how release, signature, and training automation behaves after the post-R001 fixes
- how immutable record publication and release-signature flows are recovered and backfilled when
  needed
- the unchanged role-based document training expectations for the approved QM/SOP/WI set

Downstream adopters must assign and record their own training after adoption.

## Not Applicable

- QM, SOP, or WI content rewrites
- Downstream adopter validation records
- Adopter-specific training completion records
- Downstream operational-use or deployment decisions
