# Issue Closure Drafts for `#39` and `#44`

## Issue `#39`

```md
Closing as upstream framework capability is now implemented.

`qms-lite` now includes immutable record publication support for risk-family records in `.github/workflows/2.2_publish_qms_records.yml`, including grouped risk bundles, manifest generation with hashes/source PR linkage, and signed attestation packaging.

What is not expected in this upstream repo is product-specific risk evidence. Operational proof for a real software item belongs in an adopter or SDLC repository, not in the public upstream baseline.

Follow-on execution evidence will live in the dedicated QMS Lite SDLC repository seed (`examples/qms-lite-sdlc/` in this repo, intended to become `qms-lite-sdlc`), where QMS Lite itself is handled under the same controlled process.
```

## Issue `#44`

```md
Closing as upstream framework capability is now implemented.

`qms-lite` now includes immutable record publication support for usability-family records in `.github/workflows/2.2_publish_qms_records.yml`, including grouped usability-file bundles, index/reference expansion for YAML records, manifest generation with hashes/source PR linkage, and signed attestation packaging.

Usability-file execution records are not expected to live in the public upstream QMS baseline. Operational proof belongs in an adopter or SDLC repository for the actual software item being developed and validated.

Follow-on execution evidence will live in the dedicated QMS Lite SDLC repository seed (`examples/qms-lite-sdlc/` in this repo, intended to become `qms-lite-sdlc`), where QMS Lite itself is treated as the software item under control.
```
