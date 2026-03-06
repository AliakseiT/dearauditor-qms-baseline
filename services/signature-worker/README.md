# signature-worker

Cloudflare Worker that hosts the QMS signature ceremony UI and callback backend.

The worker sits between two GitHub integrations:
- `QMS Lite Signature`: the signer-facing GitHub OAuth App used only for identity verification during the ceremony
- `qms-lite-bot`: the repository automation GitHub App used to read PR context and post attestation comments

## What It Does

- Serves signer-facing ceremony page at `GET /sign`.
- Accepts only cryptographically signed link context from QMS workflows.
- Uses GitHub OAuth App login for identity verification (`read:user` scope).
- Enforces a second-factor 6-digit signature PIN stored as salted PBKDF2-SHA256 hash in Cloudflare KV.
- Applies automatic PIN TTL deletion after 60 days (`expirationTtl=5184000`).
- Returns `pin_expiring_soon` when less than 7 days remain.
- Validates signer eligibility against the latest PR signature request comment.
- Posts immutable attestation comment back to the PR (`<!-- SIGNATURE_ATTESTATION_V1 -->`).

## Endpoints

- `GET /healthz`
- `GET /sign`
- `POST /auth/start`
- `GET /auth/callback`
- `POST /pin/complete`
- `POST /api/pin/status`

## Runtime Configuration

### Vars

- `PUBLIC_BASE_URL` (example: `https://sign.qms.dearauditor.ch`)
- `DEFAULT_OAUTH_PROVIDER` (`github`)
- `ALLOWED_OAUTH_PROVIDERS` (`github`)
- `GITHUB_API_BASE_URL` (optional; default `https://api.github.com`)

### Worker Secrets

- `GITHUB_OAUTH_CLIENT_ID`
- `GITHUB_OAUTH_CLIENT_SECRET`
- `QMS_BOT_APP_ID`
- `QMS_BOT_APP_PRIVATE_KEY`
- `QMS_BOT_APP_INSTALLATION_ID` (optional; if omitted, worker resolves installation from repo)
- `SIGNATURE_LINK_SECRET` (must match QMS Lite GitHub Actions secret)
- `SIGNATURE_STATE_SECRET`
- `PIN_PEPPER` (server-side pepper for PIN KDF)

### KV Binding

`wrangler.toml` must include:

- `[[kv_namespaces]]`
- `binding = "PIN_KV"`
- valid `id` and `preview_id`

## GitHub OAuth App

Use a standard GitHub OAuth App (not a GitHub App installation flow):

- Homepage URL: `https://sign.qms.dearauditor.ch`
- Authorization callback URL: `https://sign.qms.dearauditor.ch/auth/callback`
- OAuth scope requested by worker: `read:user`
- Signer full legal name is resolved from `matrices/signer_registry.json` (no manual name entry in UI).

## GitHub App for Automation

Use a separate GitHub App for repository-side automation:

- App name: `qms-lite-bot`
- Minimum repository permissions:
  - `Contents: Read and write`
  - `Pull requests: Read and write`
  - `Issues: Read and write`
  - `Metadata: Read-only`
- Optional later permission:
  - `Repository projects: Read and write` if project-board sync is moved under the bot

## Local Development

1. `cd services/signature-worker`
2. `cp .dev.vars.example .dev.vars` and fill values
3. `npm install`
4. `npm run dev`

## Deploy

- Manual: `npm run deploy`
- GitHub Actions manual run (`workflow_dispatch`): `.github/workflows/deploy_signature_worker.yml`

## Bootstrap Helper

Use the bootstrap script to sync `.env.local` values to GitHub and Cloudflare:

```bash
./services/signature-worker/scripts/bootstrap_env.sh --deploy
```

What it does:

- Upserts repo variable `SIGNATURE_UI_BASE_URL`.
- Sets repo secrets for `QMS_BOT_APP_*`, `SIGNATURE_LINK_SECRET`, `CLOUDFLARE_API_TOKEN`, and `CLOUDFLARE_ACCOUNT_ID` when values are present.
- Sets worker secrets for OAuth + `qms-lite-bot` app auth + signing secrets.
- Writes `.dev.vars` for local `wrangler dev`.
- Validates that KV namespace IDs in `wrangler.toml` are not placeholders before deploy.
