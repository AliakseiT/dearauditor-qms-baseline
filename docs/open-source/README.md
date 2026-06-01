# Open-Source Adoption Model

DearAuditor Open QMS Baseline can be published as a public upstream baseline without forcing adopters to expose their live QMS evidence.

This repository is the upstream baseline, not the adopter's operational QMS. A company creates its operational QMS by adopting a released baseline into its own controlled repository, tailoring the company-owned records, validating the configured toolchain for intended use, training users, and approving the adopted system before use.

## Operating Model

- this repository remains the public upstream source for reusable SOPs, WIs, templates, validators, automations, and example seed files
- each adopting company creates a private repository from a selected upstream baseline ref, normally a `QMS-YYYY-MM-DD-RNNN` tag
- product or study execution records stay in separate designated private repositories as already described in [`../architecture/README.md`](../architecture/README.md)
- release notes for this repository's own `QMS-*` publication may live in this upstream repo because they govern the upstream baseline release itself rather than an adopter implementation release

The downstream repo is not expected to ingest every upstream tag. It records one adopted upstream ref at a time in `adoption/upstream-baseline.json` and only moves when the company approves an upgrade PR.

## Adoption Model 2

Use this sequence when turning the public baseline into a company-controlled QMS:

1. Select a released upstream baseline tag from the `QMS-*` namespace.
2. Run [`../../tools/bootstrap_company_repo.sh`](../../tools/bootstrap_company_repo.sh) to create the downstream repository from that exact tag.
3. Tailor company-owned files, including company profile, market scope, signer registry, training matrix, supplier state, QMS tooling inventory, and live operational records.
4. Configure repository settings, required variables/secrets, branch protection or equivalent rules, signature hosting, and service dependencies. Create the GitHub App used by repository automation and the GitHub OAuth App used by the signature worker in the adopting company's GitHub organization or account, then install/configure them only for the adopter-controlled repositories that need them.
5. Run [`../../tools/check_adoption_readiness.sh`](../../tools/check_adoption_readiness.sh) to confirm placeholders and required repository settings are resolved.
6. Validate the configured QMS toolchain for intended use under `SOP-006`, using the adopter's designated controlled validation repository or record location.
7. Train assigned roles on the adopted controlled-document set and capture training evidence in the adopter repository.
8. Approve the adopted QMS baseline for operational use through the adopter's controlled PR, signature, and release process.

Only after this sequence is complete should the adopter use the repository as the governing QMS for product, study, supplier, release, validation, or operational evidence.

The upstream gap analyses are product-independent preparation artifacts. They help adopters understand how the baseline maps to ISO 9001, ISO 13485, ISO 14971, IEC 62304, IEC 62366-1, IEC 82304-1, ISO/IEC 27001, ISO/IEC 42001, GDPR, and Swiss nFADP/nFDAP, but they do not replace adopter-specific applicability decisions, validation evidence, training, or approval.

The privacy controls are used when GDPR or Swiss nFADP/nFDAP is in scope for the adopting company's quality manual. Adopters whose approved scope does not yet include in-scope personal data processing should record the scope rationale and review trigger, then instantiate the `records/privacy/` templates before privacy-relevant processing begins.

## Repo Boundaries

The machine-readable source of truth is [`../../distribution-map.json`](../../distribution-map.json).

- `sync_includes`: paths that can be proposed from upstream into downstream upgrade PRs
- `company_owned_paths`: paths that belong to the adopter once bootstrapped
- `bootstrap_overlays`: generic seed files copied into company-owned destinations during onboarding

Current intent:

- upstream-owned: `.github/`, `qm/`, `sops/`, `wis/`, `scripts/`, `services/signature-worker/`, record templates, upstream release notes under `records/releases/`, open-source docs, licensing, and the distribution scripts
- company-owned: `matrices/`, live operational records, signer assignments, training logs, supplier state, and downstream adoption metadata

While the upstream project is still being actively developed, it continues to dogfood the workflow model using named company/person data in the live upstream `matrices/` and selected `records/` paths. That state is retained on purpose so the automations can be exercised end to end. Downstream adopters should not copy it directly; they should start from the generic seed files in [`../../examples/bootstrap`](../../examples/bootstrap/README.md).

Historical validation or mock-trial artifacts that are useful as public reference examples should live under `docs/open-source/` rather than under live operational record paths.

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

Regardless of hosting model, the GitHub trust boundary remains adopter-owned. The GitHub App that posts attestations or drives repository automation, and the GitHub OAuth App that verifies signer identity, should be created under the adopting company's GitHub organization or account. Do not reuse the public upstream project's app registrations as the adopter's regulated-system trust boundary.

## Tag Namespaces

The current automations treat `QMS-*` as the formal upstream baseline channel.

- `QMS-*`: curated baseline refs intended to be eligible for downstream adoption
- `QMSPREVIEW-*`: reserved for immutable upstream preview baselines when needed; these are not automatically treated as downstream-adoptable
- `sig-*`, `record-*`, `trn-*`, and similar prefixes: immutable evidence/publication tags and explicitly out of scope for downstream sync tooling

For formal `QMS-YYYY-MM-DD-RNNN` tags, the date component is the publication date recorded for the
approved upstream baseline release, and `RNNN` is the global sequential upstream baseline release
number.

This keeps high-volume immutable record/signature tags available for evidence retention without making them part of the downstream upgrade surface.

## Contact

For adoption, pilot use, hosted-signing inquiries, or support: [aliaksei@dearauditor.ch](mailto:aliaksei@dearauditor.ch)
