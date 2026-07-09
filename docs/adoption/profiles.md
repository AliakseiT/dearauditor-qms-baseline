# Adoption Profiles — Detail

Detailed view of each optional adoption profile. Start with the
[adoption profiles overview](README.md) for how profiles work, the core
baseline, and how to apply one. The source of truth for every list below is
[`matrices/adoption_profiles.yml`](../../matrices/adoption_profiles.yml).

> Profiles are **optional adoption aids, not requirements**, and are **not
> regulatory advice**. Each profile adds layers on top of the shared
> [core baseline](README.md#the-core-baseline-every-profile); it never removes a
> core control. Your completed records belong in your adopter repository, not in
> this public upstream baseline.

---

## AI-based diagnostic

The most complete profile — the full baseline plus the AI management layer. Every
control this profile needs is already in the baseline.

- **For:** software intended for a medical purpose (diagnosis, screening,
  triage, decision support) that embeds AI/ML components and qualifies as a
  medical device (SaMD).
- **Not for:** non-device wellness or general digital-health apps; software with
  AI features but no medical purpose.

**Adds on top of core**

- **SOPs:** SOP-007 (medical device file), SOP-008 (design & development),
  SOP-013 (regulatory incident reporting), SOP-014 (post-market surveillance),
  SOP-015 (nonconforming product), SOP-018 (risk management), SOP-019
  (usability engineering), SOP-021 (information security), SOP-022 (AI
  management system), SOP-023 (data protection & privacy).
- **Gap analyses:** ISO 13485, ISO 14971, IEC 62304, IEC 62366-1, IEC 82304-1,
  ISO/IEC 42001, ISO/IEC 27001, GDPR, Swiss nFADP, the privacy gap index, and
  `regulatory_market_scope.yml`.
- **Record families:** `records/mdf`, `records/design`, `records/risk`,
  `records/usability`, `records/incidents`, `records/pms`,
  `records/nonconformity`, `records/aims`, `records/isms`, `records/privacy`.

**`qms_intent` standards:** ISO 13485:2016 (+A11:2021); ISO 14971:2019
(+A11:2021); IEC 62304:2006 (+A1:2015); IEC 62366-1:2015 (+A1:2020);
IEC 82304-1:2016; ISO/IEC 42001:2023; ISO/IEC 27001:2022 (incl. Amd 1:2024);
GDPR / Swiss nFADP where in scope — on top of the core ISO 9001:2015.

**Boundary.** Device qualification and classification must be determined per
[`regulatory_market_scope.yml`](../../matrices/regulatory_market_scope.yml)
before development and release. The AI layer (SOP-022, ISO/IEC 42001) applies to
AI components inside the device and to AI-bearing supplier interfaces.

**Adopter must provide.** Product intended use, indications, claims, and
regulatory classification; the conformity route and notified-body / regulator
interactions for the target markets.

---

## App with AI

Every control this profile needs is already in the baseline.

- **For:** a general software product that embeds AI/ML features but has no
  medical purpose and does not qualify as a medical device. The distinguishing
  layer is AI management plus security and privacy.
- **Not for:** software intended for a medical purpose; products making any
  diagnostic, therapeutic, or clinical claim.

**Adds on top of core**

- **SOPs:** SOP-021 (information security), SOP-022 (AI management system),
  SOP-023 (data protection & privacy), SOP-019 (usability — optional good
  practice).
- **Gap analyses:** ISO/IEC 42001, ISO/IEC 27001, GDPR, Swiss nFADP, the privacy
  gap index.
- **Record families:** `records/aims`, `records/isms`, `records/privacy`,
  `records/usability` (optional).

**`qms_intent` standards:** ISO 9001:2015 (incl. Amd 1:2024); ISO/IEC 42001:2023;
ISO/IEC 27001:2022 (incl. Amd 1:2024); GDPR / Swiss nFADP where personal data is
processed.

**Boundary.** Explicitly **not** a medical device: the ISO 13485 / IEC 62304 /
IEC 62366-1 medical-device controls and the medical device file are out of scope
unless the product later acquires a medical purpose.

**Escalation.** → **AI-based diagnostic** when AI output is used for a medical
purpose or the product makes a diagnostic/therapeutic claim (it then qualifies
as SaMD).

**Adopter must provide.** Confirmation that the product makes no medical claim
and is out of device scope.

---

## Digital health app

Every control this profile needs is already in the baseline.

- **For:** a consumer or professional digital-health / wellness application that
  processes health-adjacent personal data but does **not** make a medical claim
  and does not qualify as a medical device. Privacy and security are the
  load-bearing layers, with product-safety good practice for health software.
- **Not for:** software intended for a medical purpose or making a medical claim.

**Adds on top of core**

- **SOPs:** SOP-021 (information security), SOP-023 (data protection & privacy),
  SOP-019 (usability — optional good practice).
- **Gap analyses:** ISO/IEC 27001, IEC 82304-1, GDPR, Swiss nFADP, the privacy
  gap index.
- **Record families:** `records/isms`, `records/privacy`, `records/usability`
  (optional).

**`qms_intent` standards:** ISO 9001:2015 (incl. Amd 1:2024); ISO/IEC 27001:2022
(incl. Amd 1:2024); IEC 82304-1:2016 (health-software product safety, good
practice); GDPR / Swiss nFADP.

**Boundary.** Maintain an explicit non-device / wellness boundary. The product
must not make a diagnostic, therapeutic, or other medical claim without
re-qualifying it. IEC 82304-1 is applied as health-software product-safety good
practice, not as evidence of device conformity.

**Escalation.** → **AI-based diagnostic** if the product makes a medical claim
or is intended for a medical purpose. → **App with AI** (additionally) if the
product embeds AI/ML features — adopt the AI management layer (SOP-022,
ISO/IEC 42001) as well.

**Adopter must provide.** A documented non-device determination and the basis
for the wellness boundary.

---

## In-house clinical software

The baseline provides the general medical-software controls; the in-house
regulatory basis is **not** in the baseline and is adopter-supplied (see
*Adopter must provide* below).

- **For:** software developed and used inside a single health institution (e.g.
  a clinic or hospital) for its own patients rather than placed on the market.
  The baseline supplies the general medical-software lifecycle, risk, usability,
  security, and privacy controls such software still needs.
- **Not for:** software placed on the market or supplied to other organisations
  (use **AI-based diagnostic**).

**Adds on top of core**

- **SOPs:** SOP-008 (design & development, scaled), SOP-012 (feedback &
  complaints — internal user feedback), SOP-014 (post-market surveillance —
  scaled internal monitoring), SOP-018 (risk management), SOP-019 (usability),
  SOP-021 (information security), SOP-023 (data protection & privacy).
- **Gap analyses:** ISO 14971, IEC 62304, IEC 62366-1, ISO/IEC 27001, GDPR,
  Swiss nFADP, the privacy gap index, and `regulatory_market_scope.yml`.
- **Record families:** `records/design`, `records/risk`, `records/usability`,
  `records/isms`, `records/privacy`, `records/feedback`, `records/pms`,
  `records/mdf` (for the in-house justification record).
- **Added record template:**
  [`records/mdf/in_house_health_institution_justification_template.md`](../../records/mdf/in_house_health_institution_justification_template.md)
  — an adopter-completed record of the in-house determination.

**`qms_intent` standards:** ISO 9001:2015 (incl. Amd 1:2024); ISO 14971:2019
(+A11:2021); IEC 62304:2006 (+A1:2015), tailored to the in-house context;
IEC 62366-1:2015 (+A1:2020); ISO/IEC 27001:2022 (incl. Amd 1:2024); GDPR /
Swiss nFADP.

**Boundary.** ISO 13485 certification is optional here and is applied (if at
all) as good practice rather than as a market-access requirement. The
device-vs-non-device qualification question is still resolved per
[`regulatory_market_scope.yml`](../../matrices/regulatory_market_scope.yml).

**Escalation.** → **AI-based diagnostic** when the software is placed on the
market, supplied to other organisations, or otherwise leaves the in-house /
own-use boundary.

**Adopter must provide.**

- The regulatory basis for the in-house / own-use pathway **in the adopter's own
  jurisdiction** (for example, the applicable health-institution or own-device
  provisions). **The baseline does not pre-assert any specific exemption
  clause;** the adopter records its determination in the in-house justification
  record above.
- The determination that no suitable equivalent device is available, where the
  chosen pathway requires it.
- The internal-use boundary and the conditions under which the software may be
  used.

---

## Clinical-trial / study-support software

This profile is **opt-in**: per [issue #373](https://github.com/AliakseiT/dearauditor-qms-baseline/issues/373)
it is not part of the default baseline and is selected explicitly. The baseline
supplies only QMS-tooling validation, lifecycle, security, and privacy controls;
**the clinical-research control layer is not part of the baseline and must be
supplied by the adopter.**

- **For:** software used as a computerized system in clinical research (for
  example data capture, study management, ePRO).
- **Not for:** default adoption.

**Adds on top of core**

- **SOPs:** SOP-021 (information security), SOP-023 (data protection & privacy).
- **Work instructions:**
  [`WI-001`](../../wis/WI-001-VerificationAndValidationExecution.md) (V&V
  execution),
  [`WI-002`](../../wis/WI-002-ConfigurationAndReleaseManagementExecution.md)
  (configuration & release execution) — alongside the core SOP-006 (software
  validation) and SOP-020 (software lifecycle & release).
- **Gap analyses:** the optional
  [GAMP 5 / GxP / CSV overlay](../../matrices/gamp5_gxp_gap_analysis.yml) (maps
  which GxP/CSV/Part 11/Annex 11 expectations the baseline already covers by reuse
  versus what you must supply), plus ISO/IEC 27001, GDPR, Swiss nFADP, and the
  privacy gap index.
- **Record families:** `records/validation`, `records/verification_validation`,
  `records/configuration`, `records/isms`, `records/privacy`.

**`qms_intent` standards:** ISO 9001:2015 (incl. Amd 1:2024); ISO/IEC 27001:2022
(incl. Amd 1:2024); GDPR / Swiss nFADP.

**Boundary.** This profile reuses the baseline's computerized-system validation
(SOP-006), lifecycle/release (SOP-020), and the V&V and configuration work
instructions. It does **not** provide clinical-research-specific controls.

**Adopter must provide** (this is the substance of the profile, not the
baseline):

- Good Clinical Practice (GCP) processes appropriate to the adopter's role
  (sponsor, CRO, site) — not covered by the baseline.
- Computerized-system validation depth and data-integrity (ALCOA+) controls for
  the regulated-research context — beyond the baseline's QMS-tooling validation.
- Electronic records / electronic signatures mapping to the applicable framework
  (for example 21 CFR Part 11, EU Annex 11) — not asserted by the baseline.
- Sponsor / CRO / site interface obligations and trial-master-file linkage.
