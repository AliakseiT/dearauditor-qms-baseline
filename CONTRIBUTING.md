# Contributing

Use GitHub issues and pull requests for all controlled changes.

## Before Opening a PR

- Open or link the relevant issue when the change affects process, workflow behavior, or controlled content.
- Keep public-baseline changes generic. Company-specific operating state belongs in downstream private adopters.
- Preserve the document structure used by the repository templates and QMS workflows.

## Validation Expectations

- Run the narrowest relevant checks locally before opening a PR.
- For QMS content changes, run `python3 scripts/validate_qms_content.py --base <base-sha> --head <head-sha>` when practical.
- For distribution or onboarding changes, run `tools/check_adoption_readiness.sh --skip-gh`.
- For signature-worker changes, run `npm run typecheck` in `services/signature-worker`.

## Pull Request Expectations

- Use the PR template and keep `Summary`, `Why` or `Context`, and `Validation` or `Testing` sections complete.
- Keep changes scoped. Separate infrastructure, workflow, and controlled-content changes unless they must ship together.
- Do not commit local env files, generated caches, or company-specific secrets.

## Maintainer Notes

- The repository workflows assume self-hosted GitHub Actions runners for full automation coverage.
- Maintainers may request that changes be split when they affect both the public upstream baseline and downstream-adopter guidance.
