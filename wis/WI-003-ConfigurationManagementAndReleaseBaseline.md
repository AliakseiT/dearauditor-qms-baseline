---
wi_id: WI-003
title: Configuration Management and Release Baseline
revision: R00
effective_date: 2026-03-05
status: Published
owner_role: engineering_lead
related_sops:
  - SOP-009
  - SOP-008
  - SOP-001
---

## 1. Purpose
Define how configuration items are identified, versioned, reviewed, and released with complete traceability.

## 2. Scope
Applies to source code, requirements artifacts, risk files, test artifacts, and release metadata.

## 3. Procedure
1. Maintain unique IDs and version references for all controlled configuration items.
2. Route all changes via issue -> branch -> pull request workflow.
3. Ensure PR includes impact statement (requirements, risk, V&V, training).
4. Require at least one non-author approval and all mandatory checks before merge.
5. Tag release baselines using approved record/release naming pattern.
6. Publish immutable release evidence and link to signed attestation where required.
7. Keep a rollback note for each production-impacting release baseline.

## 4. Required Records
- PR history with reviews and checks
- Release tag and immutable release package
- Baseline manifest with artifact hashes/links
