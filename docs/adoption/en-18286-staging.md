# Staging EN 18286 / AI Act provider QMS

A company that places a high-risk AI system on the EU market, or puts one into
service there, must operate an Article 17 quality management system. That is a
large body of work. A startup that adopts EN 18286 too early carries the cost
before it has revenue; one that adopts it too late finds that some facts can no
longer be reconstructed. This guide handles that with two tools: a
**commitment model** and an **irreversibility test**.

## The commitment model

Commitment state is recorded per framework in
[`matrices/regulatory_market_scope.yml`](../../matrices/regulatory_market_scope.yml)
`regulatory_commitments`. States:

- `applied` — live now, with evidence locations.
- `planned` — committed later; trigger, owner, and `review_by` are mandatory.
- `not_applicable` — determined out of scope; rationale plus re-evaluation trigger.
- `unknown` — no determination made. This state is legal. Hiding it is not, so
  it is recorded explicitly with a review-by date.
- `not_selected` — the organisation does not follow this framework. The
  bootstrap seed starts every framework here, and nothing is checked until the
  organisation selects it by moving it to another state.

`tools/qms_distribution.py check-commitments` fails on any `planned` or `unknown`
entry whose `review_by` date has passed or is not a valid `YYYY-MM-DD` date.
`tools/check_adoption_readiness.sh` runs it, which turns a planned deferral into
a checked obligation rather than a note.

## The irreversibility test

Work is classified by whether it can be reconstructed later. Deferral is a
preparation-phase tool only. Where the high-risk obligations apply, everything
on both lists below must be complete before the system is placed on the market
or put into service: the technical documentation has to be drawn up before
placement (Reg. (EU) 2024/1689 Art. 11(1)), and the conformity assessment has to
be completed before placement (Art. 16(f) and Art. 43). Nothing on either list
may start at launch.

**Do now (cannot be reconstructed later):**
- Dataset provenance, origin, licensing, lawful basis; especially the rationale
  for representativeness and any special-category data handling.
- Design decision log capturing why the model or data distribution was chosen.
- Logging and observability designed into the model pipeline.
- Versioned, immutable model and training assets from release 1.
- AI entries in the existing risk register.
- Provider-vs-deployer determination in the product dossier.

**Can wait during preparation (closed before market placement):**
- Annex IV technical documentation, assembled from the records captured above.
- Notified-body engagement and the conformity-assessment route decision.
- The environmental sustainability assessment (SOP-024 §6.6).
- The full clause-by-clause EN 18286 closure.

Fundamental-rights consultation does not belong on the second list. SOP-024
§6.4(7) runs it from inception through validation so its outcomes can shape
design choices and risk controls. Start it once the intended purpose and the
affected persons are known, even if you have no deployers yet.

Data provenance is the single irrecoverable item. You cannot reconstruct where
last year's training set came from, who licensed it, or on what lawful basis, a
year from now. Log capture is the easy one to get wrong in the other direction:
retrofitting structured logging into a live inference pipeline is far more
expensive than shipping it from day one, and retrofits usually leak.

## Trigger on events, not dates

An EN 18286 commitment moves to `applied` on an event, with the `review_by`
date as a backstop. Each event comes before market placement, because the work
it triggers has to be finished by then:

- A decision to place an AI system on the EU market or put it into service
  there, or the start of conformity-assessment planning.
- High-risk classification under Reg. (EU) 2024/1689 Art. 6(1) or Art. 6(2).
- A customer contract requiring it.
- A funding or regulatory milestone you choose.

Events announce themselves. Dates pass silently.

## Activating the profile

Use the [`eu_ai_act_high_risk` profile](profiles.md#eu-ai-act-high-risk-provider)
in `matrices/adoption_profiles.yml` only when the commitment moves to `applied`,
which has to happen before market placement. That activates SOP-024, the
EN 18286 gap analysis, and the `records/ai_act/` family. The profile combines
with `ai_diagnostic` when the product is also a medical device.

Until then, the upstream baseline ships SOP-024 as a present-but-unapplied
controlled document and lists it in `published_not_applied`. An adopter that
notes that in the ledger is defensible; an uncontrolled floating SOP is not.

## See also

- [`profiles.md`](profiles.md#eu-ai-act-high-risk-provider) for this profile and the others.
- [`sops/SOP-024-AIActProviderQMS.md`](../../sops/SOP-024-AIActProviderQMS.md)
- [`matrices/en_18286_gap_analysis.yml`](../../matrices/en_18286_gap_analysis.yml)
- [`matrices/regulatory_market_scope.yml`](../../matrices/regulatory_market_scope.yml)
