---
record_id: RLN-QMS-2026-10-28-R006
record_type: qms_baseline_release_notes
product_id: DEARAUDITOR-QMS-BASELINE
release_tag: QMS-2026-10-28-R006
status: approved
owner_role: engineering_lead
approver_role: qa_lead
related_issue: "#438"
---

# Release Notes: QMS-2026-10-28-R006

## Purpose

This record supports the formal release of the DearAuditor Open QMS Baseline repository as
`QMS-2026-10-28-R006`.

This is the sixth published baseline release. The `R006` number is a running counter across all
baseline releases; it does not reset with the date.

Since R005, the baseline gained four things:

1. **An EU AI Act provider QMS.** A new procedure, SOP-024, for providers of high-risk AI
   systems under the EU AI Act. It comes with a gap analysis against EN 18286:2026, the
   harmonised standard for the AI Act quality management system, along with record templates,
   an adoption profile, and a guide on what to prepare now and what can wait. It is opt-in.
2. **A regulatory commitments ledger.** Each adopter records, for every framework the baseline
   maps, whether it applies it, plans to, has ruled it out, has not decided yet, or has not
   selected it. Planned and undecided entries carry a review date, and the readiness check fails
   once that date passes.
3. **Review routing that matches the signature policy.** Changes to tooling (`.github/`,
   `scripts/`, `services/signature-worker/`, `tools/`) now go to the Technical QMS Maintainer
   instead of requesting quality review.
4. **Signature and automation maintenance.** Fixes to how signature workflows read requests,
   how training diffs render in email, and how auto-merge reports an open change request.

Three controlled documents changed: the Quality Manual (`QM-001` R10), the AI management system
procedure (`SOP-022` R03), and the new `SOP-024` (R00). All other controlled documents enter this
release unchanged.

## Release Unit

- Approved release commit on `main`; the exact commit hash is captured in
  `qms_release_manifest.json`
- GitHub tag: `QMS-2026-10-28-R006`
- GitHub Release assets:
  - `qms_release_manifest.json`
  - `qms_release_snapshot.tgz`
- Release planning issue: GitHub issue `#438`
- Release change request: this PR

## Release Scope

Included under this tag:

- `QM-001` (R10, changed since R005)
- `SOP-001` through `SOP-024`: `SOP-022` (R03) changed and `SOP-024` (R00) is new
- `WI-001`, `WI-002`

All other documents are unchanged since R005 and enter this release at their R005-approved
revisions.

### EU AI Act provider QMS (PRs `#431`, `#432`, `#433`, `#434`)

- `sops/SOP-024-AIActProviderQMS.md` covers provider role determination, a written compliance
  strategy, selection of technical specifications, data governance, substantial modifications
  and pre-determined change plans, the supply chain, post-market monitoring, serious incident
  reporting, cooperation with authorities, and traceability to EN 18286. For medical devices,
  AI Act incident notification is limited to fundamental-rights infringements; other device
  incidents stay with SOP-013 vigilance.
- `SOP-022` R03 extends the AI management system from medical devices to all software products
  and points to SOP-024 as the AI Act layer.
- `QM-001` R10 adds EN 18286:2026 and the EU AI Act to the standards and regulatory framework.
- `matrices/en_18286_gap_analysis.yml` maps the standard's clauses and the Article 17 QMS
  requirements to baseline controls. It follows the public Annex ZA table, including its
  conditions, and lists what Annex ZA does not cover.
- `records/ai_act/` holds nine record templates, among them a compliance strategy, a
  technical specification selection register, a pre-determined change plan, and a serious
  incident report.
- `matrices/adoption_profiles.yml` adds an EU AI Act high-risk provider profile, and
  `docs/adoption/en-18286-staging.md` explains what to capture early and which events trigger
  the rest.
- `matrices/regulatory_market_scope.yml` adds the `regulatory_commitments` ledger, and
  `tools/qms_distribution.py check-commitments` checks its review dates as part of
  `tools/check_adoption_readiness.sh`.

The EN 18286 mapping is built from public sources, not from the purchased normative text, and
the gap analysis records this as `normative_source_verified: false`. Adopters who apply
EN 18286 must verify the clause references against their own copy of the standard. The
baseline does not, by itself, give any adopter a presumption of conformity.

### Review routing (PRs `#435`, `#437`)

- `.github/CODEOWNERS` is generated from signer roles. Signers holding the Management
  Representative or QA Lead role own every path; signers holding the Technical QMS Maintainer
  role own the tooling paths. A tooling-only change no longer requests quality review.
- Reviewer assignment now applies the last matching CODEOWNERS rule, as GitHub does.
- Auto-merge waits on an open change request instead of reporting an automation failure.

### Signature and automation maintenance

- All signature workflows share one parser for signature requests (`#420`, `#428`).
- The signer-registry check in workflow 2.5 is active (`#426`).
- Training diff previews render correctly in GitHub email notifications (`#425`).
- The signature service's development tooling was updated to clear all reported audit
  findings; the deployed worker bundle is unchanged (`#436`).
- The training status register was refreshed (`#419`, `#427`, `#429`).
- `CITATION.cff`, `AGENTS.md`, and `llms.txt` were added for citation and discoverability
  (`#430`).

This release does not approve any downstream company's implementation, product release, privacy
compliance claim, AI Act conformity, or certification claim.

## Upgrade Notes for Existing Adopters

Two checks fail after an upgrade until the adopter acts:

- **Commitments ledger.** `matrices/` is company-owned, so upgrade PRs do not add the
  `regulatory_commitments` block. `check-commitments` and `tools/check_adoption_readiness.sh`
  fail until it is added. Follow the upgrade note in `docs/open-source/README.md`.
- **CODEOWNERS.** The new generator adds tooling-path lines for Technical QMS Maintainer
  signers. Re-run `python3 tools/qms_distribution.py sync-codeowners` after the upgrade, or
  `sync-codeowners --check` fails.

## Public References for the EU AI Act Layer

The EN 18286 gap analysis and SOP-024 quote no standard text. They are anchored on:

- Regulation (EU) 2024/1689 (Artificial Intelligence Act):
  `https://eur-lex.europa.eu/eli/reg/2024/1689/oj`
- Commission Implementing Decision (EU) 2026/2274, which cites EN 18286:2026 in the Official
  Journal (published 2026-10-14)

Clause references come from public secondary sources listed, with retrieval dates, in the
`analysis_provenance` block of `matrices/en_18286_gap_analysis.yml`.

## Product-Independent Standards Preparation Scope

The release exposes the R005 standards preparation set plus EN 18286:

- ISO 9001
- ISO 13485
- ISO 14971
- IEC 62304
- IEC 62366-1
- IEC 82304-1
- ISO/IEC 27001
- ISO/IEC 42001
- EN 18286:2026 (EU AI Act provider QMS; opt-in; not verified against the normative text)
- GDPR
- Swiss nFADP/nFDAP

The optional GxP overlay (21 CFR Part 11, EU Annex 11) remains available as an opt-in reference.

These gap analyses and templates do not, by themselves, approve any downstream company,
product, study, hosted service, GitHub App registration, OAuth App registration, configured QMS
toolchain, privacy program, AI Act conformity, or certification claim.

## Validation and Approval Check

- `git diff --check origin/main HEAD`
- `python3 scripts/validate_qms_content.py --base origin/main --head HEAD`
- `python3 scripts/report_release_evidence_gate.py --base origin/main --head HEAD` (report mode)
- signatures complete on every PR merged since R005
- dependency and security check of the signature service's package tree, and Dependabot alerts
  enabled for the repository
- public release materials checked for private repository references, product-specific content,
  adopter-specific privacy records, quoted standard text, and certification claims; none was
  introduced

The QMS content gate confirms that the QM/SOP/WI set remains published, revisioned, and
indexed. The release decision confirms that the EU AI Act provider QMS, the commitments ledger,
the review-routing changes, and the automation maintenance merged since R005 are all included in
the approved release commit.

## Training Scope

Training remains governed by `matrices/training_matrix.yml`.

For this release, the training focus is:

- `SOP-024` R00 for the roles with duties in it: QA Lead, Management Representative,
  Engineering Lead, Privacy Lead, and Auditor
- `SOP-022` R03 for its existing role holders
- `QM-001` R10 for all roles
- how to record framework commitments in the ledger, and when a review date is required
- how review requests are routed now that tooling paths belong to the Technical QMS Maintainer

## Not Applicable

- new product-specific profile implementation
- product-specific controls or templates
- downstream adopter validation records
- adopter-specific privacy records, notices, agreements, DPIAs, transfer assessments, or breach
  records
- adopter-specific AI Act technical documentation, conformity assessment, or registration
- adopter-specific GitHub App or OAuth App credentials
- adopter-specific training completion records
- downstream operational-use, deployment, certification, privacy-compliance, AI Act
  conformity, or compliance-claim decisions
