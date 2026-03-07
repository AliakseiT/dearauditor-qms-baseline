# Open-Source Adoption Model

QMS Lite can be published as a public upstream baseline without forcing adopters to expose their live QMS evidence.

## Operating Model

- this repository remains the public upstream source for reusable SOPs, WIs, templates, validators, automations, and example seed files
- each adopting company creates a private repository from a selected upstream baseline ref, normally a `QMS-YYYY-MM-DD-RNN` tag
- product or study execution records stay in separate designated private repositories as already described in [`../architecture/README.md`](../architecture/README.md)

The downstream repo is not expected to ingest every upstream tag. It records one adopted upstream ref at a time in `adoption/upstream-baseline.json` and only moves when the company approves an upgrade PR.

## Repo Boundaries

The machine-readable source of truth is [`../../distribution-map.json`](../../distribution-map.json).

- `sync_includes`: paths that can be proposed from upstream into downstream upgrade PRs
- `company_owned_paths`: paths that belong to the adopter once bootstrapped
- `bootstrap_overlays`: generic seed files copied into company-owned destinations during onboarding

Current intent:

- upstream-owned: `.github/`, `qm/`, `sops/`, `wis/`, `scripts/`, `services/signature-worker/`, record templates, open-source docs, licensing, and the distribution scripts
- company-owned: `matrices/`, live operational records, signer assignments, training logs, supplier state, and downstream adoption metadata

While the upstream project is still being actively developed, it continues to dogfood the workflow model using named company/person data in the live upstream `matrices/` and selected `records/` paths. That state is retained on purpose so the automations can be exercised end to end. Downstream adopters should not copy it directly; they should start from the generic seed files in [`../../examples/bootstrap`](../../examples/bootstrap/README.md).

## CLI Entry Points

Use the repository scripts instead of ad hoc copy/paste:

1. [`../../tools/bootstrap_company_repo.sh`](../../tools/bootstrap_company_repo.sh)
   Creates a downstream repo from a selected upstream ref and overlays generic company-owned seed files.
2. [`../../tools/open_upstream_upgrade_pr.sh`](../../tools/open_upstream_upgrade_pr.sh)
   Opens a controlled branch containing only upstream-owned changes from a selected upstream ref.
3. [`../../tools/check_adoption_readiness.sh`](../../tools/check_adoption_readiness.sh)
   Fails if placeholder tokens remain or if required GitHub repo settings are missing.

## Signature Hosting Options

Adopters that want the GitHub-native signing flow have two practical options:

- self-host the worker in [`../../services/signature-worker`](../../services/signature-worker/README.md)
- use the hosted signing endpoint `https://sign.qms.dearauditor.ch` by separate arrangement, if offered for the adopter's use case

The hosted endpoint is not part of the open-source license grant by itself. Any commercial terms, support scope, uptime expectations, data-handling terms, or onboarding conditions for hosted use are separate from the repository license and still to be defined.

## Tag Namespaces

The current automations treat `QMS-*` as the formal upstream baseline channel.

- `QMS-*`: curated baseline refs intended to be eligible for downstream adoption
- `QMSPREVIEW-*`: reserved for immutable upstream preview baselines when needed; these are not automatically treated as downstream-adoptable
- `sig-*`, `record-*`, `trn-*`, and similar prefixes: immutable evidence/publication tags and explicitly out of scope for downstream sync tooling

This keeps high-volume immutable record/signature tags available for evidence retention without making them part of the downstream upgrade surface.

## Contact

For adoption, pilot use, hosted-signing inquiries, or support: [aliaksei@dearauditor.ch](mailto:aliaksei@dearauditor.ch)
