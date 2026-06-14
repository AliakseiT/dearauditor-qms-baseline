# Adoption Profiles

Optional, higher-level aids for tailoring the DearAuditor Open QMS Baseline to
what you are actually building.

> **These profiles are optional adoption aids, not requirements.** They select
> and explain which baseline areas typically apply to a kind of product or use
> case. They do **not** change the product-independent upstream baseline, do
> **not** make any product-specific control mandatory for every adopter, and are
> **not** regulatory advice. You remain responsible for determining your
> product's qualification, classification, applicable regulations, and the
> controls you operate. Keep your operational QMS evidence in your own adopter
> repository — separate from this public upstream baseline (see the
> [open-source adoption model](../open-source/README.md)).

## How profiles work

Every adopter operates the same **core baseline** — a product-independent QMS
spine. A profile only **adds layers** on top of that spine for a given product
type; it never removes a core control. Pick the profile that matches what you
are building, then add its layers to your core.

The machine-readable mapping is [`matrices/adoption_profiles.yml`](../../matrices/adoption_profiles.yml).
That file is the source of truth for the SOP sets, gap analyses, record
families, and `qms_intent` standards listed here; this page is the readable
companion. The per-profile detail lives in [`profiles.md`](profiles.md).

## Pick your profile

| If you are building… | Use profile | What the baseline gives you |
|---|---|---|
| Software with a medical purpose that embeds AI (SaMD + AI) | [AI-based diagnostic](profiles.md#ai-based-diagnostic) | All the controls this profile needs |
| A non-device software product with AI features (no medical claim) | [App with AI](profiles.md#app-with-ai) | All the controls this profile needs |
| A digital-health / wellness app that is **not** a medical device | [Digital health app](profiles.md#digital-health-app) | All the controls this profile needs |
| Software built inside a clinic for its own patients (not placed on the market) | [In-house clinical software](profiles.md#in-house-clinical-software) | Most controls; you supply the in-house regulatory basis |
| A computerized system used in clinical research / trials | [Clinical-trial / study-support software](profiles.md#clinical-trial--study-support-software) | Opt-in; validation/security/privacy only — you supply the clinical-research layer |

Not sure whether your product is a medical device? Resolve qualification and
classification first using
[`matrices/regulatory_market_scope.yml`](../../matrices/regulatory_market_scope.yml).
The answer decides whether you escalate to **AI-based diagnostic** or stay on a
non-device profile.

## The core baseline (every profile)

Applies regardless of product type. Derived from the SOP sets common to the
baseline's core management-system gap analyses plus the GitHub-native QMS tooling
controls.

- **Quality manual:** [`qm/QM-001-QualityManual.md`](../../qm/QM-001-QualityManual.md)
- **Core SOPs:** SOP-001 (document control), SOP-002 (CAPA), SOP-003 (internal
  audit), SOP-004 (management review), SOP-005 (QMS governance), SOP-006
  (software validation / computerized systems), SOP-009 (change management),
  SOP-010 (supplier control), SOP-011 (training), SOP-016 (quality metrics),
  SOP-017 (infrastructure), SOP-020 (software lifecycle and release).
- **Baseline gap analysis:** [`matrices/iso_9001_gap_analysis.yml`](../../matrices/iso_9001_gap_analysis.yml)
- **Core record families:** `records/audits`, `records/capas`, `records/change`,
  `records/configuration`, `records/management-reviews`, `records/releases`,
  `records/suppliers`, `records/training`, `records/validation`,
  `records/verification_validation`.

## How to apply a profile

1. **Confirm scope.** Determine your product type and, if relevant, device
   qualification/classification per
   [`matrices/regulatory_market_scope.yml`](../../matrices/regulatory_market_scope.yml).
   Record the determination in your own adopter repository.
2. **Set your `qms_intent`.** In your adopter copy of
   [`matrices/company_profile.yml`](../../matrices/company_profile.yml), include
   the `qms_intent` standards listed for your profile (core + the profile's
   layers). This is how the baseline already expresses scope — profiles just
   give you a recommended preset.
3. **Adopt the layered SOPs, gap analyses, and record families** listed for your
   profile in [`profiles.md`](profiles.md) on top of the core baseline.
4. **Close the adopter-supplied gaps.** Where a profile lists
   `adopter_must_provide` items (notably the in-house regulatory basis, and the
   entire clinical-research layer), supply those yourself; the baseline does not
   assert them.
5. **Re-check on change.** If your product later crosses a boundary (for example
   a wellness app starts making a medical claim, or in-house software is placed
   on the market), follow the profile's escalation note to the appropriate
   profile.

## Boundaries this guidance keeps

- **Optional, not default.** Selecting a profile is an adopter choice. The
  default upstream baseline remains product-independent.
- **Public baseline vs. adopter evidence.** Profiles describe which baseline
  areas apply; they never place product-specific or operational evidence into
  this public upstream repository. Your completed records live in your adopter
  repository.
- **Security and AI preparation are represented.** ISO/IEC 27001 (ISMS,
  SOP-021) and ISO/IEC 42001 (AIMS, SOP-022) appear in the profiles wherever
  security or AI components are in scope.
- **No regulatory advice, no invented requirements.** Standard names and
  jurisdictional references trace to the baseline's own gap analyses and
  [`matrices/regulatory_market_scope.yml`](../../matrices/regulatory_market_scope.yml).
  Where the baseline does not cover a regulatory layer (in-house exemption,
  GCP/CSV/data-integrity for clinical research), the profile says so plainly
  instead of filling the gap.
