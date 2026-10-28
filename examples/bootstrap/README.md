# Bootstrap Seed Files

These files are the generic company-owned starting point for downstream adopter repositories.

Use them through [`tools/bootstrap_company_repo.sh`](../../tools/bootstrap_company_repo.sh), not by copying them manually one-by-one. The bootstrap flow overlays these files onto a selected upstream baseline and then writes `adoption/upstream-baseline.json` in the downstream repo.

These seeds are onboarding inputs only. After bootstrap, the copied files are company-owned controlled records that must be tailored, reviewed, validated where applicable, trained against, and approved in the adopter repository before the adopted QMS is used operationally.

Design rules:

- `examples/bootstrap/` stays generic and syncable from upstream.
- the copied destination files in `matrices/` and `records/` become company-owned immediately
- placeholder values start with `REPLACE_WITH_` so [`tools/check_adoption_readiness.sh`](../../tools/check_adoption_readiness.sh) can block incomplete onboarding
- the `regulatory_commitments` ledger in `matrices/regulatory_market_scope.yml` starts every framework as `not_selected`; set the status of each framework the company follows (see the [commitments ledger upgrade note](../../docs/open-source/README.md#regulatory-commitments-ledger))

The current upstream repository still operates a fictional `ACME GmbH` baseline for dogfooding and release validation. These bootstrap seeds exist so adopters do not have to fork that company-specific state.
