# Test Environments

## GitHub Control Surface

- Purpose: verify intended use of GitHub issues, pull requests, workflow gates, immutable record publication, and release evidence
- Configuration reference: repository settings, branch/ruleset settings, workflow files, and `adoption/upstream-baseline.json`
- Notes: platform caveats from upstream `docs/architecture/README.md` still apply, especially where hard branch blocking depends on repository plan/features

## Signature Worker Environment

- Purpose: verify signer ceremony, designated-signer checks, PIN verification, and attestation posting
- Configuration reference: deployed signature worker plus the matching upstream baseline under control
- Notes: use staged credentials and signer accounts for dry-run testing whenever possible

## Local Review Workspace

- Purpose: inspect generated manifests, signed attestation JSON, and record bundles after workflow execution
- Configuration reference: checked-out SDLC repo plus optional `upstream/qms-lite` submodule pinned to the adopted baseline
