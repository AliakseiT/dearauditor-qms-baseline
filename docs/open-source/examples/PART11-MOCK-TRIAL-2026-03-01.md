---
record_id: AUDIT-MOCK-PART11-TRIAL-2026-03-01
related_issue: "#27"
objective: "Validate post-merge two-signature mock Part 11 ceremony"
status: "historical-example"
---

# Historical Part 11 Mock Trial Example

This file is retained as historical validation example material for the open-source baseline.

It is not a live operational record for downstream adopters and should not be copied into a production QMS unchanged.

## Trial Plan
1. Merge PR linked to Issue #27.
2. Wait for the post-merge signature workflow to post role-based sign links on the closed PR.
3. Signatory A (`Quality Assurance Lead`) signs and auto-posts attestation.
4. Signatory B (`Management Representative`) signs and auto-posts attestation.
5. Verify the signature gate succeeds.

## Expected Evidence
- Closed PR comments containing two attestation payloads.
- Successful post-merge signature gate on the merged commit hash.
