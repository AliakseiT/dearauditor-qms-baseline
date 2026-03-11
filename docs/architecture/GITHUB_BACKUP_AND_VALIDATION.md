# GitHub Backup And Validation

This repository can already publish immutable QMS release bundles and immutable execution-record releases. The gap addressed here is operator-driven backup and offline validation of the GitHub-hosted QMS itself.

## Proposed Backup Model

Use two complementary export modes:

1. Snapshot catalog
   Produces a lightweight list of available QMS snapshots and evidence snapshots:
   - Git tags
   - GitHub releases
   - release classification (`QMS-*`, `QMSPREVIEW-*`, evidence tags such as `sig-*` / `trn-*`, other)

2. Snapshot package
   Produces a restorable/exportable package for one repository state:
   - repository metadata
   - tag and release metadata
   - issues plus issue comments
   - pull requests plus review metadata
   - git bundle of the repository (`--all`)
   - tarball snapshot of a selected ref
   - optional release-asset binary download
   - file inventory with SHA-256 for offline integrity checking

The intent is:

- the git bundle is the primary restorable source for repository contents and refs
- the selected snapshot tarball is the immediate readable baseline for auditors or emergency review
- issue/PR/release exports preserve the GitHub-side workflow evidence that is not contained in Git alone
- release-asset download is optional because some organizations may prefer metadata-only exports plus standard GitHub release retention

## Proposed Validation Model

Validation should operate offline on an exported package and produce both machine-readable and human-readable output.

Validation checks performed by the export validator:

- manifest presence and schema sanity
- file inventory completeness
- SHA-256 verification of every exported file listed in the manifest
- JSON parse validation of exported JSON artifacts
- `git bundle verify` for the repository bundle
- gzip/tar readability of the selected snapshot archive
- summary report generation in JSON and Markdown

Validation output:

- `analysis/validation_summary.json`
- `analysis/validation_report.md`

This gives one scriptable result for automation and one result suitable for review in GitHub, email, or a retained evidence store.

## Repo Boundary Versus SDLC

This repository should contain:

- reusable export and offline-validation scripts for a GitHub-hosted QMS repository
- the export package format
- the validation report format
- documentation describing what is captured and what is intentionally out of scope

The neighboring SDLC repository should contain:

- scheduled execution of exports and validations
- organization-specific storage destinations and retention rules
- alerting, dashboards, and historical trend comparison across runs
- restore drills, campaign records, and validation execution records for the backup process itself

The principle is simple: this repo ships the portable mechanism; SDLC owns the recurring operational use of that mechanism.

## CLI Entry Points

- `tools/export_github_qms.py catalog --repo-root . --output /path/to/catalog`
- `tools/export_github_qms.py snapshot --repo-root . --output /path/to/export --download-release-assets`
- `tools/validate_github_qms_export.py /path/to/export`
