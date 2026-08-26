# Agent guide

This file tells AI coding agents how to work in this repository. Humans should
start with [README.md](README.md) and [CONTRIBUTING.md](CONTRIBUTING.md)
instead.

## What this repository is

This is the public upstream baseline of an open-source, GitHub-native
electronic Quality Management System (eQMS) for medical device and regulated
software teams. It is a controlled QMS, not a normal code repository. Every
change to controlled content goes through a gated pull request, and released
content is immutable quality evidence.

Companies do not run their QMS here. They mirror this baseline into a private
repository, tailor it, validate it, and operate there. If you are working in
such a mirror, the same rules apply plus whatever the adopting company added.

## Repository map

| Path | Contents |
|---|---|
| `qm/` | Quality Manual (controlled document) |
| `sops/` | Standard operating procedures (controlled documents) |
| `wis/` | Work instructions (controlled documents) |
| `records/` | Record templates and published quality records |
| `matrices/` | Gap analyses, training matrix, signer registry, company profile |
| `docs/adoption/` | Adoption profiles: which standards apply to which product type |
| `docs/architecture/` | Workflow, automation, and trust-boundary documentation |
| `docs/open-source/` | The adoption model for companies mirroring this baseline |
| `examples/bootstrap/` | Example matrices and records for a new adopter |
| `scripts/`, `tools/` | Validators and automation used by the CI gates |
| `services/signature-worker/` | Cloudflare Worker for 21 CFR Part 11 electronic signatures |
| `.github/workflows/` | The CI gates that enforce QMS policy |

A machine-readable index of the published library lives at
<https://qms.dearauditor.ch/llms.txt>, with a full project summary at
<https://qms.dearauditor.ch/llms-full.txt>.

## Rules that will block your PR if ignored

1. Never commit to `main`. All changes go through a pull request.
2. The PR description must contain `## Summary`, `## Why` or `## Context`,
   and `## Validation` or `## Testing` sections. A CI gate rejects PRs
   without them.
3. PRs that touch `qm/`, `sops/`, or `wis/` markdown change controlled
   documents. They must declare signature requirements in the PR body (see
   the PR template) and collect signatory approvals before merge. Do not try
   to work around the signature flow.
4. PRs that touch `.github/`, `scripts/`, `services/signature-worker/`, or
   `tools/` are routed to the Technical QMS Maintainer role for review.
5. Controlled documents carry front matter (id, revision, roles). Keep it
   intact and bump revisions per SOP-001 (document control). The content
   gate validates this.
6. Released tags (`QMS-YYYY-MM-DD-RNNN`, `sig-*`, `audit-*`, and other
   evidence tags) are immutable. Never retag, force-push, or edit published
   release assets.
7. Published records under `records/` are quality evidence. Correct mistakes
   through a new controlled change, not by rewriting history.

## Finding the current published baseline

Releases follow `QMS-YYYY-MM-DD-RNNN`. Record-specific releases are
interleaved, so the newest release overall is not always the newest baseline.
Use the newest `QMS-...` tag. The README on any such tag is the landing page
for that published baseline version.

## Licensing

Split licensing (see [LICENSE](LICENSE)): Apache-2.0 for code, scripts,
workflows, and automation; CC BY-SA 4.0 for SOPs, work instructions,
templates, and other narrative content. Project names, logos, and badges are
trademark-restricted (see [TRADEMARKS.md](TRADEMARKS.md)).

## Contact

Adoption, support, or pilot questions: aliaksei@dearauditor.ch. Landing page:
<https://qms.dearauditor.ch>.
