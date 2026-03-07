# QMS Lite SDLC Seed

This directory is a starter set for a dedicated `qms-lite-sdlc` repository.

Use it when QMS Lite itself is treated as the software item under design, risk, verification, validation, release, and revalidation control. It is intentionally separate from the public upstream `qms-lite` baseline so product-specific execution evidence does not have to live in the upstream repository.

## Design Rules

- Keep the SDLC repo aligned to upstream `qms-lite` templates, SOP assumptions, workflow model, and naming.
- Keep software-item records local to the SDLC repo.
- Track the imported upstream baseline in `adoption/upstream-baseline.json`.
- Use controlled upgrade PRs when moving to a newer upstream baseline.
- Do not create a parallel process model here; this repo should exercise the same model already defined in `qms-lite`.

## Suggested Top-Level Layout

- `adoption/`: upstream baseline tracking
- `docs/`: intended use, admin notes, environment notes
- `records/design/`: plan, user needs, requirements, architecture, traceability
- `records/risk/`: risk plan, risk register, risk review
- `records/verification_validation/`: V&V plan, test index, test cases, execution/report artifacts
- `records/configuration/`: release-readiness and release-baseline decisions
- `upstream/`: optional pinned submodule location for agent and reviewer convenience

## Optional Upstream Submodule

You can keep the upstream baseline only in `adoption/upstream-baseline.json`, or also pin it locally as a read-only submodule:

```bash
git submodule add https://github.com/AliakseiT/qms-lite.git upstream/qms-lite
git -C upstream/qms-lite checkout 4bd638d2ccaca6dbfb2a20492225abce55017882
```

If you use the submodule:

- do not edit upstream-controlled content through `upstream/qms-lite`
- update it only through controlled upstream-baseline change records
- keep SDLC-owned records outside the submodule

## Why Usability Is Not Seeded Here

The upstream QMS supports usability-engineering records, but this starter intentionally does not open a usability file for QMS Lite yet.

Current rationale:

- QMS Lite is being scoped here as GitHub-native QMS software, not as a user-facing medical device product with separate usability-engineering deliverables.
- the minimal SDLC set should cover the controls that are already clearly in use today: design input control, risk management, verification/validation, release readiness, software-tool validation, and immutable evidence publication.
- if QMS Lite later takes on product claims or user-interface risk that justify dedicated IEC 62366-1 artifacts, add `records/usability/` at that point instead of creating placeholder records with no real decision value.

## Seeded Record Set

- `records/design/qms_lite_design_development_plan.yml`
- `records/design/qms_lite_user_needs.yml`
- `records/design/qms_lite_system_requirements_spec.yml`
- `records/design/qms_lite_software_architecture_spec.yml`
- `records/design/qms_lite_design_traceability_matrix.yml`
- `records/risk/qms_lite_risk_management_plan.yml`
- `records/risk/qms_lite_risk_register.yml`
- `records/risk/qms_lite_risk_management_review.md`
- `records/verification_validation/qms_lite_vv_plan.yml`
- `records/verification_validation/qms_lite_test_case_index.yml`
- `records/verification_validation/TC-QMSL-0001.md`
- `records/verification_validation/TC-QMSL-0002.md`
- `records/verification_validation/TC-QMSL-0003.md`
- `records/verification_validation/TC-QMSL-0101.md`
- `records/configuration/qms_lite_release_plan.yml`

These files are intentionally simple. They are meant to be the smallest coherent SDLC baseline that still matches the current `qms-lite` process model.
