# Intended Use: QMS Lite

## Product

`qms-lite`

## Intended Use

QMS Lite is GitHub-native software intended for quality, regulatory, and engineering personnel to maintain controlled QMS documents, coordinate controlled issues and pull requests, collect approval and electronic-signature evidence, track training, and publish immutable quality-record evidence packages.

## Intended Users

- QA lead
- Engineering lead
- Regulatory lead
- Engineers and controlled reviewers
- Management representative

## Intended Environment

- GitHub-hosted repository, issues, pull requests, workflows, and releases
- Cloudflare-hosted signature worker for the signer ceremony
- Desktop web browser access by trained internal users

## Intended QMS Use Boundaries

- Supports QMS process control and evidence retention
- Supports post-merge signature attestation and immutable record publication
- Supports software-tool validation and revalidation planning for QMS use

## Not Intended For

- clinical decision support
- patient diagnosis or treatment
- direct medical device operation
- autonomous quality decisions without trained human review

## Current Scope Note

This SDLC seed treats QMS Lite itself as the software item under control so the upstream QMS process can be exercised end to end in a dedicated repository without mixing product-specific records into the public upstream baseline.
