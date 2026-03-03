# signature-worker

Cloudflare Worker that hosts the Part 11 signing UI and OAuth callback backend for QMS Lite.

## What It Does

- Serves signer-facing title page at `GET /sign`.
- Accepts only cryptographically signed link context from QMS workflows.
- Runs GitHub OAuth login for signer identity confirmation.
- Uses minimal GitHub identity scope (`read:user`) and forces account-selection prompt (`prompt=select_account`).
- Validates signer eligibility against the latest PR signature request comment.
- Posts immutable attestation comment back to the PR (`<!-- PART11_ATTESTATION_V1 -->`).

## Provider Strategy

Current implementation supports `github` provider.

The worker already has provider selection hooks:
- `DEFAULT_OAUTH_PROVIDER`
- `ALLOWED_OAUTH_PROVIDERS`

To add additional IDPs later, keep the same state/context verification and implement provider-specific start/callback handlers.

## Endpoints

- `GET /healthz`
- `GET /sign`
- `POST /auth/start`
- `GET /auth/callback`

## Runtime Configuration

### Plain vars

- `PUBLIC_BASE_URL` (example: `https://sign.qms.dearauditor.ch`)
- `DEFAULT_OAUTH_PROVIDER` (`github`)
- `ALLOWED_OAUTH_PROVIDERS` (`github` for now)
- `GITHUB_API_BASE_URL` (optional; default `https://api.github.com`)

### Secrets

- `GITHUB_APP_ID`
- `GITHUB_APP_CLIENT_ID`
- `GITHUB_APP_CLIENT_SECRET`
- `GITHUB_APP_PRIVATE_KEY`
- `GITHUB_APP_INSTALLATION_ID` (optional; auto-resolved if omitted)
- `SIGNATURE_LINK_SECRET` (must match QMS Lite GitHub Actions secret)
- `SIGNATURE_STATE_SECRET`

## Local Development

1. `cd services/signature-worker`
2. `cp .dev.vars.example .dev.vars` and fill values
3. `npm install`
4. `npm run dev`

## Deploy

- Manual: `npm run deploy`
- CI: `.github/workflows/deploy_signature_worker.yml`

## Bootstrap Helper

Use the bootstrap script to push settings from `.env.local` to GitHub and Cloudflare:

```bash
./services/signature-worker/scripts/bootstrap_env.sh --deploy
```

What it does:
- Upserts repo variable `SIGNATURE_UI_BASE_URL`.
- Sets repo secrets `SIGNATURE_LINK_SECRET`, `SIGNATURE_APP_ID`, `SIGNATURE_APP_PRIVATE_KEY` when values are present.
- Sets worker secrets from `.env.local`.
- Writes `.dev.vars` for local `wrangler dev`.

After deploy, set repo variable in `qms-lite`:
- `SIGNATURE_UI_BASE_URL=https://sign.qms.dearauditor.ch`

and repo secret:
- `SIGNATURE_LINK_SECRET=<same value as worker secret>`
