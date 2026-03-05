---
wi_id: WI-001
title: Document and Quality Manual Change Execution
revision: R00
effective_date: 2026-03-05
status: Published
owner_role: qa_lead
related_sops:
  - SOP-001
  - SOP-005
---

## 1. Purpose
Define operational steps to draft, review, approve, publish, and communicate controlled document changes (QM/SOP/WI/templates).

## 2. Scope
Applies to all controlled documentation in QMS Lite.

## 3. Procedure
1. Open a change issue with rationale, impacted document list, and training impact.
2. Create branch and update affected files.
3. Update document metadata fields (`revision`, `effective_date`, `status`) and README published index rows.
4. Map each changed SOP to at least one role in `matrices/training_matrix.yml`.
5. Request review from QA Lead and Management Representative for quality-impacting changes.
6. Merge only after required checks and approval pass.
7. Publish release evidence and communicate changes to impacted roles.

## 4. Required Records
- Change issue/PR with approvals
- Updated controlled document metadata
- Training impact update evidence
