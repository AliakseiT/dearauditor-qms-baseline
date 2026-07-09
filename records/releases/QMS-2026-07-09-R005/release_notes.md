---
record_id: RLN-QMS-2026-07-09-R005
record_type: qms_baseline_release_notes
product_id: DEARAUDITOR-QMS-BASELINE
release_tag: QMS-2026-07-09-R005
status: approved
owner_role: engineering_lead
approver_role: qa_lead
related_issue: "#416"
---

# Release Notes: QMS-2026-07-09-R005

## Purpose

This record supports the formal release of the DearAuditor Open QMS Baseline repository as
`QMS-2026-07-09-R005`.

This is the fifth published baseline release. The `R005` number is a running counter across all
baseline releases; it does not reset with the date.

Since R004, the baseline gained four things:

1. **Adoption profiles.** A new, optional way to answer "I am building X — which parts of this
   baseline apply to me?". Five product types are covered, from AI-based diagnostic software to
   clinical-study support software.
2. **A GxP overlay.** An optional reference for adopters whose software falls under
   good-practice rules for clinical research (GAMP 5, 21 CFR Part 11, EU Annex 11). It shows
   which existing baseline controls they can reuse and what they must add themselves.
3. **Better bootstrap tooling.** The scripts that create a company's own QMS repository from
   this baseline can now set up code-owner review and GitHub merge protections automatically.
4. **Smoother review and signature automation.** Several fixes to how reviewers are assigned,
   how signature requests read in email, and how training links are generated.

None of the controlled documents (Quality Manual, SOPs, Work Instructions) changed since R004.
This release republishes them unchanged, together with the additions above.

## Release Unit

- Approved release commit on `main`; the exact commit hash is captured in
  `qms_release_manifest.json`
- GitHub tag: `QMS-2026-07-09-R005`
- GitHub Release assets:
  - `qms_release_manifest.json`
  - `qms_release_snapshot.tgz`
- Release planning issue: GitHub issue `#416`
- Release change request: this PR

## Release Scope

Included under this tag:

- `QM-001`
- `SOP-001` through `SOP-023`
- `WI-001`, `WI-002`

All of these are unchanged since R004 and enter this release at their R004-approved revisions.

### Adoption profiles (issue `#373`)

- `matrices/adoption_profiles.yml` defines a shared core baseline and five profiles: AI-based
  diagnostic software, an app with AI features, a digital health app, software built in-house by
  a clinic for its own patients, and clinical-study support software. Each profile lists the
  SOPs, gap analyses, record families, and standards that typically apply to it, plus what the
  adopter must provide on their own.
- `docs/adoption/README.md` helps an adopter pick a profile; `docs/adoption/profiles.md`
  describes each one in detail.
- `records/mdf/in_house_health_institution_justification_template.md` is a template for clinics
  using the in-house profile to record the legal basis for building their own software.
- `matrices/gamp5_gxp_gap_analysis.yml` is the optional GxP overlay. For each expectation area
  it states whether the baseline already covers it, partly covers it, or leaves it to the
  adopter. The clinical-study profile points to it.

The profiles are optional aids, not requirements, and not regulatory advice. The default
baseline is unchanged. Where the baseline does not cover a regulatory topic — for example the
legal basis for in-house clinical software, or the clinical-research rules themselves — the
profiles say so plainly instead of claiming coverage.

### Bootstrap tooling (issue `#385`)

- `tools/bootstrap_company_repo.sh` can now push over SSH and use a custom remote.
- The bootstrap derives the new repository's `.github/CODEOWNERS` from the company's signer
  registry, so code-owner review matches the registered QMS signers from day one.
- With `--configure-github`, the bootstrap also copies this baseline's branch protection and
  merge rules into the new repository.
- `tools/check_adoption_readiness.sh` now flags a CODEOWNERS file that has drifted from the
  signer registry.

### Review and signature automation

- Reviewer assignment and the approval gate no longer care in which order signer roles are
  declared in a PR.
- The signature service's automation accounts are now configurable, and its GitHub App
  permission documentation was corrected.
- Signature request comments are shorter and render correctly in GitHub email notifications.
- Links in training issues that show what changed in a document now work reliably.
- The training status register was refreshed.
- The signature service's development tooling was updated to clear all reported audit findings;
  its production dependencies were already clean.

This release does not approve any downstream company's implementation, product release, privacy
compliance claim, or certification claim.

## Public References for the GxP Overlay

The overlay does not quote any standard or guide. It is anchored on these public regulations:

- 21 CFR Part 11 (Electronic Records; Electronic Signatures), U.S. Food and Drug
  Administration: `https://www.ecfr.gov/current/title-21/chapter-I/subchapter-A/part-11`
- EudraLex Volume 4, Annex 11 (Computerised Systems), European Commission:
  `https://health.ec.europa.eu/medicinal-products/eudralex/eudralex-volume-4_en`

GAMP 5 is a guide published by ISPE, and "GxP" is shorthand for a family of good-practice
expectations, so the overlay uses a descriptive framing note instead of clause-by-clause
references. The overlay is opt-in and deliberately kept out of the core ISO 13485 preparation
set.

## Product-Independent Standards Preparation Scope

The release exposes the same standards preparation set as R004:

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

These gap analyses and templates do not, by themselves, approve any downstream company,
product, study, hosted service, GitHub App registration, OAuth App registration, configured QMS
toolchain, privacy program, or certification claim.

## Validation and Approval Check

- `git diff --check origin/main HEAD`
- `python3 scripts/validate_qms_content.py --base origin/main --head HEAD`
- `python3 scripts/report_release_evidence_gate.py --base origin/main --head HEAD` (report mode)
- dependency and security check of the signature service's package tree
- public release materials checked for private repository references, product-specific content,
  adopter-specific privacy records, and certification claims — none introduced

The QMS content gate confirms that the QM/SOP/WI set remains published, revisioned, and
indexed. The release decision confirms that the adoption profiles, the GxP overlay, the
bootstrap tooling, the automation fixes, and the signature-service dependency update merged
since R004 are all included in the approved release commit.

## Training Scope

Training remains governed by `matrices/training_matrix.yml`.

For this release, the training focus is:

- how to pick an adoption profile, and the boundary between what the public baseline provides
  and what the adopter must evidence themselves
- when the GxP overlay applies
- what the bootstrap now configures automatically (CODEOWNERS, merge protections)
- how reviewer assignment and signature requests behave after the automation fixes
- unchanged role-based training expectations for the approved QM/SOP/WI set

## Not Applicable

- new product-specific profile implementation
- product-specific controls or templates
- downstream adopter validation records
- adopter-specific privacy records, notices, agreements, DPIAs, transfer assessments, or breach
  records
- adopter-specific GitHub App or OAuth App credentials
- adopter-specific training completion records
- downstream operational-use, deployment, certification, privacy-compliance, or
  compliance-claim decisions
