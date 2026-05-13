---
record_id: RLN-QMS-2026-05-13-R003
record_type: qms_baseline_release_notes
product_id: DEARAUDITOR-QMS-BASELINE
release_tag: QMS-2026-05-13-R003
status: approved
owner_role: engineering_lead
approver_role: qa_lead
related_issue: "#375"
---

# Release Notes: QMS-2026-05-13-R003

## Purpose

This record supports the formal release of the DearAuditor Open QMS Baseline repository as
`QMS-2026-05-13-R003`.

This is the third published upstream baseline release. The `R003` suffix is the global sequential
QMS baseline release number and does not reset by date.

This release republishes the repository for downstream adoption after the post-R002 expansion of
the baseline standards-preparation scope, controlled-record templates, validation probes, GitHub
automation controls, signature-worker setup guidance, and public adoption model.

## Release Unit

- Approved release commit on `main`; exact SHA captured in `qms_release_manifest.json`
- GitHub tag: `QMS-2026-05-13-R003`
- GitHub Release assets:
  - `qms_release_manifest.json`
  - `qms_release_snapshot.tgz`
- Release planning issue: GitHub issue `#375`
- Release change request: this PR

## Release Scope

Included unchanged under this tag:

- `QM-001`
- `SOP-001` through `SOP-022`
- `WI-001`, `WI-002`

Included as merged standards-preparation and QMS content expansion:

- ISO/IEC 27001 information security management preparation, including ISMS procedure coverage,
  gap analysis, register, Statement of Applicability, and evidence-collection templates
- ISO/IEC 42001 AI management preparation, including AIMS procedure coverage, gap analysis,
  register, Statement of Applicability, and AI management-system interfaces
- IEC 82304-1 health software product-safety scope coverage, including MDF/accompanying
  information updates and product-level release/retirement interfaces
- updated standards citations, effective-date to revision-date metadata migration, and refreshed
  training matrix alignment for the expanded controlled-document set
- additional reusable design, intended-use, external-dependency, SOUP-like dependency, ISMS, AIMS,
  and validation probe records

Included as merged GitHub-native automation and signature-flow hardening:

- reviewer-assignment, co-approval, CODEOWNERS, and signature-role resolution hardening
- PR description parsing hardening, including escaped-newline rejection and last-occurrence parsing
  for signature fields
- release-signature, training-diff, training-status refresh, and signature-label recovery fixes
- signature request count handling, signature cap handling, and idempotent signature title-page
  publication
- target-owned QMS conformance validation workflow and release-evidence reporting improvements
- signature-worker configurability, setup guidance, dependency refresh, and adopter-owned
  GitHub App / OAuth App trust-boundary clarification

Included as merged public adoption-model clarification:

- top-level README clarification that this repository is the public upstream baseline, not an
  adopter's operational QMS by itself
- open-source adoption model updates defining the sequence from public baseline adoption to
  operational company QMS use
- bootstrap-seed clarification that copied seed files become adopter-owned controlled records after
  adoption
- architecture and signature-worker guidance that adopter deployments create and control their own
  GitHub App and GitHub OAuth App registrations

This release changes QM, SOP, WI, templates, matrices, workflow automation, and signature-worker
support content that has already been approved on `main` since R002. It does not approve any
downstream adopter implementation or product release.

## Product-Independent Standards Preparation Scope

The release continues to expose the current product-independent standards preparation set:

- ISO 13485
- ISO 14971
- IEC 62304
- IEC 62366-1
- IEC 82304-1
- ISO/IEC 27001
- ISO/IEC 42001

These gap analyses do not approve any downstream company, product, study, hosted service, GitHub
App registration, OAuth App registration, or configured QMS toolchain by themselves.

## Validation and Approval Check

- `python3 scripts/validate_qms_content.py --base origin/main --head HEAD`
- `git diff --check`
- `npm audit --json` in `services/signature-worker`
- public release materials checked for absence of private validation-repository references and
  product-specific overlay content

The QMS content gate confirms that the included QM/SOP/WI set remains published, revisioned, and
indexed. The release decision confirms that the merged post-R002 standards-preparation,
automation-hardening, validation-probe, signature-worker, and adoption-boundary changes are included
in the approved release commit.

## Training Scope

Training remains governed by `matrices/training_matrix.yml`.

For this release, the training focus is:

- public upstream baseline versus adopter operational QMS boundary
- adopter go-live responsibilities before operational QMS use
- adopter-owned trust boundary for GitHub App and GitHub OAuth App registrations
- unchanged role-based document training expectations for the approved QM/SOP/WI set

## Not Applicable

- new product-specific profile implementation
- product-specific controls or templates
- downstream adopter validation records
- adopter-specific GitHub App or OAuth App credentials
- adopter-specific training completion records
- downstream operational-use or deployment decisions
