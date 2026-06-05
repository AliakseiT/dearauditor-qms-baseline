---
record_id: RLN-QMS-2026-06-01-R004
record_type: qms_baseline_release_notes
product_id: DEARAUDITOR-QMS-BASELINE
release_tag: QMS-2026-06-01-R004
status: approved
owner_role: engineering_lead
approver_role: qa_lead
related_issue: "#389"
---

# Release Notes: QMS-2026-06-01-R004

## Purpose

This record supports the formal release of the DearAuditor Open QMS Baseline repository as
`QMS-2026-06-01-R004`.

This is the fourth published upstream baseline release. The `R004` suffix is the global sequential
QMS baseline release number and does not reset by date.

This release republishes the repository for downstream adoption after the post-R003 expansion of
privacy/data-protection controls, ISO 9001 preparation scope, release-signature evidence handling,
training-status refresh, Dependabot policy handling, GitHub Actions runtime updates, and GitHub
approval-gate modernization.

## Release Unit

- Approved release commit on `main`; exact SHA captured in `qms_release_manifest.json`
- GitHub tag: `QMS-2026-06-01-R004`
- GitHub Release assets:
  - `qms_release_manifest.json`
  - `qms_release_snapshot.tgz`
- Release planning issue: GitHub issue `#389`
- Release change request: this PR

## Release Scope

Included under this tag:

- `QM-001`
- `SOP-001` through `SOP-023`
- `WI-001`, `WI-002`

Included as merged privacy and data-protection baseline expansion:

- `SOP-023` Data Protection and Privacy Management for use when personal data processing is in
  scope
- GDPR gap analysis in `matrices/gdpr_gap_analysis.yml`
- Swiss nFADP/nFDAP gap analysis in `matrices/swiss_nfadp_gap_analysis.yml`
- privacy/data-protection gap index in `matrices/privacy_data_protection_gap_index.yml`
- privacy templates for processing activities, lawful basis or justification, DPIA screening, DPIA,
  data-subject rights requests, personal data breach tracking, and transfer assessments
- supplier, design, architecture, and requirements template updates for privacy-by-design,
  processor/subprocessor, transfer, and privacy-evidence interfaces
- role-based training updates for privacy ownership and SOP-023 applicability

Included as merged ISO 9001 preparation expansion:

- ISO 9001 gap-analysis coverage in `matrices/iso_9001_gap_analysis.yml`
- quality manual traceability for organization context, interested-party needs, customer focus,
  process performance, organizational knowledge, risks and opportunities, and continual improvement
- governance, management review, competence/training, feedback/complaint handling, and
  quality-metrics SOP updates supporting the ISO 9001 preparation scope
- company-profile and README scope updates listing ISO 9001 in the public baseline preparation set
- QMS content-gate validation for ISO 9001 matrix publication and mapping

Included as merged GitHub-native automation and signature-flow hardening:

- QMS release-signature evidence publication as separate immutable `sig-qms-release-*` releases
- release-signature recovery behavior after immutable QMS release publication
- training status refresh and training-register alignment
- release training-diff hash-anchor import fix
- Dependabot dependency-update signature policy synthesis and reviewer fallback handling
- GitHub Actions updates for Node 24-capable action majors
- approval-gate modernization from a workflow check to the `qms_approval_gate` commit status
- PR description gate and content gate updates that support the new policy and matrix checks
- GitHub QMS export validation coverage for known release/signature asset types

This release changes QM, SOP, templates, matrices, workflow automation, validation tooling, and
release-signature support content that has already been approved on `main` since R003. It does not
approve any downstream adopter implementation, product release, privacy compliance claim, or
certification claim.

## Public Legal References for Privacy Scope

The privacy/data-protection release scope uses these public official legal references:

- GDPR: Regulation (EU) 2016/679 of the European Parliament and of the Council of 27 April 2016,
  published in the Official Journal of the European Union, OJ L 119, 4 May 2016, p. 1-88;
  CELEX `32016R0679`; official EUR-Lex permalink:
  `https://eur-lex.europa.eu/eli/reg/2016/679/oj`
- Swiss FADP / nFADP / nFDAP: Federal Act of 25 September 2020 on Data Protection
  (Data Protection Act, FADP), Classified Compilation `CC 235.1` / `SR 235.1`, in force from
  1 September 2023; official Federal Office of Justice legal-basis page:
  `https://www.bj.admin.ch/bj/en/home/staat/datenschutz/rechtsgrundlagen.html`; official Fedlex
  publication reference: `https://www.fedlex.admin.ch/eli/cc/2022/491/en`

The release uses `Swiss nFADP/nFDAP` in baseline matrices to identify the revised Swiss Federal Act
on Data Protection now in force. English is used for baseline readability; adopting companies must
resolve the applicable official-language text and jurisdictional scope for their own use.

## Product-Independent Standards Preparation Scope

The release exposes the current product-independent standards preparation set:

- ISO 9001
- ISO 13485
- ISO 14971
- IEC 62304
- IEC 62366-1
- IEC 82304-1
- ISO/IEC 27001
- ISO/IEC 42001
- GDPR
- Swiss nFADP/nFDAP

These gap analyses and templates do not approve any downstream company, product, study, hosted
service, GitHub App registration, OAuth App registration, configured QMS toolchain, privacy program,
or certification claim by themselves.

## Validation and Approval Check

- `git diff --check origin/main HEAD`
- `python3 scripts/validate_qms_content.py --base origin/main --head HEAD`
- `python3 scripts/report_release_evidence_gate.py --base origin/main --head HEAD` (report mode)
- dependency/security posture check for the signature-worker package tree
- public release materials checked for absence of private validation-repository references,
  product-specific overlay content, adopter-specific privacy records, and product-specific
  certification claims

The QMS content gate confirms that the included QM/SOP/WI set remains published, revisioned, and
indexed. The release decision confirms that the merged post-R003 privacy/data-protection, ISO 9001,
release-signature, training-status, Dependabot-policy, Node 24 action, approval-gate, and QMS-export
validation changes are included in the approved release commit.

## Training Scope

Training remains governed by `matrices/training_matrix.yml`.

For this release, the training focus is:

- SOP-023 privacy/data-protection applicability and privacy-record expectations when personal data
  processing is in scope
- GDPR and Swiss nFADP/nFDAP gap-analysis use as upstream preparation artifacts only
- ISO 9001 preparation scope and its organization-context, customer-focus, process-performance,
  organizational-knowledge, and continual-improvement interfaces
- GitHub-native release-signature evidence handling and immutable release-signature publication
- Dependabot policy handling, approval-gate status behavior, and Node 24 action updates
- unchanged role-based document training expectations for the approved QM/SOP/WI set

## Not Applicable

- new product-specific profile implementation
- product-specific controls or templates
- downstream adopter validation records
- adopter-specific privacy records, notices, agreements, DPIAs, transfer assessments, or breach
  records
- adopter-specific GitHub App or OAuth App credentials
- adopter-specific training completion records
- downstream operational-use, deployment, certification, privacy-compliance, or compliance-claim
  decisions
