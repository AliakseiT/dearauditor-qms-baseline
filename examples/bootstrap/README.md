# Bootstrap Seed Files

These files are the generic company-owned starting point for downstream adopter repositories.

Use them through [`tools/bootstrap_company_repo.sh`](../../tools/bootstrap_company_repo.sh), not by copying them manually one-by-one. The bootstrap flow overlays these files onto a selected upstream baseline and then writes `adoption/upstream-baseline.json` in the downstream repo.

Design rules:

- `examples/bootstrap/` stays generic and syncable from upstream.
- the copied destination files in `matrices/` and `records/` become company-owned immediately
- placeholder values start with `REPLACE_WITH_` so [`tools/check_adoption_readiness.sh`](../../tools/check_adoption_readiness.sh) can block incomplete onboarding

The current upstream repository still operates a fictional `ACME GmbH` baseline for dogfooding and release validation. These bootstrap seeds exist so adopters do not have to fork that company-specific state.
