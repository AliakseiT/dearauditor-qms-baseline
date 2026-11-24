---
record_id: RLN-QMS-2026-11-24-R007
record_type: qms_baseline_release_notes
product_id: DEARAUDITOR-QMS-BASELINE
release_tag: QMS-2026-11-24-R007
status: approved
owner_role: engineering_lead
approver_role: qa_lead
related_issue: "#447"
---

# Release Notes: QMS-2026-11-24-R007

## Purpose

This record supports the formal release of the DearAuditor Open QMS Baseline repository as
`QMS-2026-11-24-R007`.

This is the seventh published baseline release. The `R007` number is a running counter across all
baseline releases; it does not reset with the date.

Since R006, the baseline gained two updates:

1. **Clinical evaluation and PMCF (`SOP-025`, EU MDR Art. 61 & Annex XIV; Swiss MedDO).** A new
   controlled procedure, `SOP-025` (R00), for clinical evaluation and post-market clinical
   follow-up of medical device software and AI-enabled software. It ships with ten record
   templates under `records/clinical/`, a requirement-to-control gap analysis
   (`matrices/mdr_clinical_evaluation_gap_analysis.yml`), updated MDF, PMS, and release-decision
   templates, and cross-references across the Quality Manual and seven existing SOPs.
2. **Training status register refresh.** The generated training status register and auditor-facing
   report were refreshed from signed training evidence (`#445`).

Nine controlled documents changed or were added: the Quality Manual (`QM-001` R12), the new
`SOP-025` (R00), and seven updated SOPs (`SOP-004` R10, `SOP-007` R11, `SOP-008` R12, `SOP-009`
R12, `SOP-014` R08, `SOP-018` R11, `SOP-020` R14). All other controlled documents enter this
release unchanged.

## Release Unit

- Approved release commit on `main`; the exact commit hash is captured in
  `qms_release_manifest.json`
- GitHub tag: `QMS-2026-11-24-R007`
- GitHub Release assets:
  - `qms_release_manifest.json`
  - `qms_release_snapshot.tgz`
- Release planning issue: GitHub issue `#447`
- Release change request: this PR

## Release Scope

Included under this tag:

- `QM-001` (R12, changed since R006)
- `SOP-001` through `SOP-025`:
  - `SOP-025` (R00, new)
  - `SOP-004` (R10), `SOP-007` (R11), `SOP-008` (R12), `SOP-009` (R12), `SOP-014` (R08),
    `SOP-018` (R11), `SOP-020` (R14) (updated since R006)
- `WI-001` (R09), `WI-002` (R10)

All other documents are unchanged since R006 and enter this release at their R006-approved
revisions.

### Clinical evaluation and PMCF (PR `#446`)

- `sops/SOP-025-ClinicalEvaluation.md` (R00) structures clinical evaluation on MDR Annex XIV Part A
  Section 1(a)-(e) and Part B, and cites Swiss MedDO (SR 812.213) Art. 21(4) and Art. 46(3):
  - evaluator competence and declarations of interest (MEDDEV 2.7/1 rev. 4 §6.4);
  - intended purpose, normal conditions of use, novelty, lifetime, and full Annex VIII / Rule 11
    classification checks;
  - Clinical Evaluation Plan (CEP) contents with two-step approval so acceptance criteria are set
    after the state of the art and before device data are appraised;
  - systematic literature search, state-of-the-art benchmarks, equivalence (including Art. 61(5)
    MDR-compliance and data-access conditions), and the software evidence chain (valid clinical
    association, technical performance, clinical performance, clinical benefit per MDCG 2020-1 and
    IMDRF N41, keeping stored-dataset testing distinct from clinical data under Art. 2(48));
  - clinical data appraisal (establishing that complaint and vigilance data are supportive only and
    never the sole basis for GSPR conformity per MDCG 2020-6 Appendix III), generation of new data
    (including Art. 61(4)-(6), Art. 54, and Art. 74(1) hooks), and the Art. 61(10) non-clinical
    evidence pathway;
  - analysis (including Art. 7 claims verification and effectiveness of use-related risk controls),
    CER, PMCF (including method rationale and documented decisions where no PMCF is needed), and
    lifecycle update triggers (at least at PSUR cadence under Art. 86(1));
  - clinical impact screening of every software change, with notified-body notification and
    pre-release approval (linked in the change record) where required by the conformity assessment
    route (MDR Annex IX §4.10, Annex X §5.2);
  - AI-enabled software rules covering error modes, data representativeness, ground-truth reference
    standards, patient/site separation on a fixed test set, generalisability, prevalence effects,
    and AI Act evidence reuse (MDCG 2025-6).
- `records/clinical/`: a README and ten templates covering evaluator declaration, CEP, literature
  search protocol, state of the art, YAML appraisal, equivalence, Art. 61(10) justification, CER
  (MDCG 2020-13 structure), PMCF plan (MDCG 2020-7), and PMCF evaluation report (MDCG 2020-8).
- Updated lifecycle templates:
  - `records/mdf/`: intended use, classification decision (Rule 11 detail and Annex VIII rules),
    and medical device file index;
  - `records/pms/`: PMS plan (linking PMCF plan, CER, and optional AI performance monitoring) and
    PMS periodic report;
  - `records/configuration/final_release_decision_template.md`: adds CER coverage, clinical impact
    screening, pre-release notified-body approval verification, and current PMCF plan to the release
    gate.
- Controlled-document interfaces updated:
  - `QM-001` (R12): framework, process table, MedDO citations, and traceability row (`QM-22`);
  - `SOP-004` (R10): CER and PMCF conclusions as management review inputs;
  - `SOP-007` (R11): CEP, CER, and PMCF as named MDF content;
  - `SOP-008` (R12): clinical evaluation as part of design validation (ISO 13485 7.3.7);
  - `SOP-009` (R12): change impact assessment records clinical impact screening and notified-body
    impact;
  - `SOP-014` (R08): PMS plan includes the PMCF plan (Annex III 1(b)) and CER updates as PMS
    actions;
  - `SOP-018` (R11): overall residual risk aligned with CER benefit-risk conclusions; PMCF results
    as post-production inputs;
  - `SOP-020` (R14): CER coverage or recorded change screening as a release prerequisite.
- Matrices updated:
  - `matrices/mdr_clinical_evaluation_gap_analysis.yml` (new, with requirement-to-control map,
    guidance crosswalk, and provenance);
  - `matrices/regulatory_market_scope.yml` (commitment ledger entry `applied`; MedDO citations) and
    `examples/bootstrap/matrices/regulatory_market_scope.yml` (`not_selected` seed row);
  - `matrices/quality_manual_traceability.yml` (v10, `QM-22`), `matrices/iso_13485_gap_analysis.yml`
    (`7.3.7`), `matrices/adoption_profiles.yml` (`ai_diagnostic`), and `matrices/training_matrix.yml`
    (v32).

### Maintenance since R006

- The training status register and auditor-facing report were refreshed (`#445`,
  `trn-training-status-r07` / `trn-training-status-r08`).

### Documentation brought in line with this release

- `README.md` counts `25` published SOPs, points at `QMS-2026-11-24-R007`, and includes EU MDR
  clinical evaluation and PMCF (Art. 61, Annex XIV; Swiss MedDO) in its standards summary.
- `CITATION.cff`, `llms.txt`, and `docs/open-source/README.md` point at `QMS-2026-11-24-R007` and
  reflect the clinical evaluation and PMCF layer.
- `docs/open-source/README.md` includes the adopter upgrade note for `SOP-025` (added in `#446`).

This release does not approve any downstream company's implementation, product release, clinical
evaluation, privacy compliance claim, AI Act conformity, or certification claim.

## Upgrade Notes for Existing Adopters

`matrices/` is company-owned, so upstream upgrade PRs deliver `SOP-025` and the `records/clinical/`
templates without changing `matrices/`. Medical device adopters should follow
`docs/open-source/README.md#clinical-evaluation-sop-025`:

1. Copy `matrices/mdr_clinical_evaluation_gap_analysis.yml` from this release into your repository.
2. Add the `Regulation (EU) 2017/745 Art. 61 and Annex XIV` entry from
   `examples/bootstrap/matrices/regulatory_market_scope.yml` into your `regulatory_commitments`
   ledger and set its status.
3. Map `SOP-025` in `matrices/training_matrix.yml` and update your adoption profile if used.
4. Run `python3 tools/qms_distribution.py check-commitments --repo-root .` and
   `tools/check_adoption_readiness.sh --skip-gh`.

## Public References for the Clinical Evaluation Layer

No copyrighted standard or commercial publication text is reproduced in `SOP-025`,
`records/clinical/`, or `matrices/mdr_clinical_evaluation_gap_analysis.yml`. Legal requirements and
guidance references are anchored on:

- Regulation (EU) 2017/745 (MDR), consolidated text (`http://data.europa.eu/eli/reg/2017/745/2026-11-09`
  and `CELEX:02017R0745-20250110`)
- Swiss Medical Devices Ordinance (MedDO, SR 812.213): `https://www.fedlex.admin.ch/eli/cc/2020/552/en`
- MDCG endorsed guidance (`MDCG 2019-11 rev. 1`, `2020-1`, `2020-5`, `2020-6`, `2020-7`, `2020-8`,
  `2020-13`, `2021-24 rev. 1`, `2023-7`, `2025-6`, `2025-10`), `MEDDEV 2.7/1 rev. 4`, and IMDRF
  SaMD documents (`N12`, `N41`, `N81`)

Retrieval dates and outstanding gaps (including ISO/FDIS 18969 review upon publication) are
recorded in `matrices/mdr_clinical_evaluation_gap_analysis.yml`.

## Product-Independent Standards Preparation Scope

The release exposes the R006 standards preparation set plus EU MDR clinical evaluation and PMCF
(Art. 61, Annex XIV) and Swiss MedDO (Art. 21(4), Art. 46(3)):

- ISO 9001
- ISO 13485
- ISO 14971
- IEC 62304
- IEC 62366-1
- IEC 82304-1
- ISO/IEC 27001
- ISO/IEC 42001
- EN 18286:2026 (EU AI Act provider QMS; opt-in; not verified against the normative text)
- Regulation (EU) 2017/745 (MDR) Art. 61 and Annex XIV; Swiss MedDO (SR 812.213) Art. 21(4) and
  Art. 46(3) (clinical evaluation and PMCF)
- GDPR
- Swiss nFADP/nFDAP

The optional GxP overlay (21 CFR Part 11, EU Annex 11) remains available as an opt-in reference.

These gap analyses and templates do not, by themselves, approve any downstream company, product,
study, hosted service, GitHub App registration, OAuth App registration, configured QMS toolchain,
clinical evaluation, privacy program, AI Act conformity, or certification claim.

## Validation and Approval Check

- `git diff --check origin/main HEAD`
- `python3 scripts/validate_qms_content.py --base origin/main --head HEAD`
- `python3 scripts/report_release_evidence_gate.py --base origin/main --head HEAD` (report mode)
- `python3 tools/qms_distribution.py check-commitments --repo-root .`
- `python3 -m pytest scripts/tests`
- signatures complete on every PR merged since R006 (`#445`, `#446`; `sig-pr446-h56a26cb6dbab-r01`)
- public release materials checked for private repository references, product-specific content,
  adopter-specific records, quoted standard or commercial white-paper text, and certification
  claims; none was introduced

The QMS content gate confirms that the QM/SOP/WI set (`1` QM, `25` SOPs, `2` WIs) remains
published, revisioned, and indexed. The release decision confirms that `SOP-025`, its templates and
matrices, the controlled-document cross-references, and the training status refresh merged since
R006 are all included in the approved release commit.

## Training Scope

Training remains governed by `matrices/training_matrix.yml` (v32).

For this release, the training focus is:

- `SOP-025` R00 for QA Lead, Engineering Lead, Usability Lead, Auditor, and Management
  Representative
- `QM-001` R12, `SOP-004` R10, `SOP-007` R11, `SOP-008` R12, `SOP-009` R12, `SOP-014` R08,
  `SOP-018` R11, and `SOP-020` R14 for their assigned roles via diff-based training

## Not Applicable

- new product-specific profile implementation
- product-specific controls, clinical evaluations, or CERs
- downstream adopter validation records
- adopter-specific privacy records, notices, agreements, DPIAs, transfer assessments, or breach
  records
- adopter-specific AI Act technical documentation, conformity assessment, or registration
- adopter-specific GitHub App or OAuth App credentials
- adopter-specific training completion records
- downstream operational-use, deployment, certification, clinical conformity, privacy-compliance,
  AI Act conformity, or compliance-claim decisions
