# Staging EN 18286 / AI Act provider QMS

When a company ships a high-risk AI system in the European Union it must hold an
Article 17 quality management system. That is a large body of work, and a
startup provokes 18286 either too early (cost now, no revenue) or too late (facts
are no longer reconstructable). The basin defends that by doing two things: the
**irreversibility test** and a **four-state commitment model**.

## The four-state commitment model

Commitment state is recorded per framework in
[`matrices/regulatory_market_scope.yml`](../../matrices/regulatory_market_scope.yml)
`regulatory_commitments`. States:

- `applied` — live now, with evidence locations.
- `planned` — committed later; trigger, owner, and `review_by` are mandatory.
- `not_applicable` — determined out of scope; rationale plus re-evaluation trigger.
- `unknown` — no determination made. Startups live here by default. This state
  is legal. Hiding it is not, so it is recorded explicitly with a review-by date.

`tools/qms_distribution.py check-commitments` fails on any `planned` or `unknown`
entry whose `review_by` date has passed. That turns a planned deferral into a
machine-checked obligation rather than a note.

## The irreversibility test

Work is classified as irreversible or reversible:

**Do now (cannot be reconstructed later):**
- Dataset provenance, origin, licensing, lawful basis; especially the rationale
  for representativeness and any special-category data handling.
- Design decision log capturing why the model or data distribution was chosen.
- Logging and observability designed into the model pipeline.
- Versioned, immutable model and training assets from release 1.
- AI entries in the existing risk register.
- Provider-vs-deployer determination in the product dossier.

**Defer safely (bounded; expensive now, cheap later):**
- Annex IV technical documentation.
- Notified body engagement and conformity assessment route.
- Fundamental-rights consultation until you have real deployers.
- Environmental sustainability only.
- The full clause-by-clause EN 18286 closure.

Data provenance is the single irrecoverable item. You cannot reconstruct where
last year's training set came from, who licensed it, or on what lawful basis, a
year from now. Log capture is the easy one to get wrong in the other direction:
retrofitting structured logging into a live inference pipeline is far more
expensive than shipping it from day one, and retrofits usually leak.

## Trigger on events, not dates

An EN 18286 commitment activates on an event, with the date as a floor:

- Placing an AI system on, or putting into service in, the EU market.
- High-risk classification under Reg. (EU) 2024/1689 Art. 6(1) or Art. 6(2).
- A customer contract requiring it.
- A funding or regulatory milestone you choose.

Events announce themselves. Dates pass silently.

## Activating the profile

Use the `eu_ai_act_high_risk` profile in `matrices/adoption_profiles.yml` only
when the commitment moves to `applied`. That activates SOP-024, the EN 18286
gap analysis, and the `records/ai_act/` family. The profile combines with
`ai_diagnostic` when the product is also a medical device.

Until then, the upstream baseline ships SOP-024 as a present-but-unapplied
controlled document and lists it in `published_not_applied`. An adopter that
notes that in the ledger is defensible; an uncontrolled floating SOP is not.

## See also

- [`profiles.md`](profiles.md) for the other profiles.
- [`sops/SOP-024-AIActProviderQMS.md`](../../sops/SOP-024-AIActProviderQMS.md)
- [`matrices/en_18286_gap_analysis.yml`](../../matrices/en_18286_gap_analysis.yml)
- [`matrices/regulatory_market_scope.yml`](../../matrices/regulatory_market_scope.yml)
