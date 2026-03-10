# signature-worker

Cloudflare Worker that hosts the QMS signature ceremony UI and callback backend.

## What It Does

- Serves signer-facing ceremony page at `GET /sign`.
- Accepts stable signer links from QMS workflows and rebuilds signing context from the latest request comment.
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
- `WORKER_VERSION` (automatically injected as `YYYY-MM-DD-<short git hash>` during `npm run dev` and `npm run deploy`)
- `DEFAULT_OAUTH_PROVIDER` (`github`)
- `ALLOWED_OAUTH_PROVIDERS` (`github`)
- `REPO_ALIASES_JSON` (optional JSON object for old-slug to current-slug mapping; example: `{"AliakseiT/qms-lite":"AliakseiT/dearauditor-qms-baseline"}`)
- `GITHUB_API_BASE_URL` (optional; default `https://api.github.com`)

### Worker Secrets

- `GITHUB_OAUTH_CLIENT_ID`
- `GITHUB_OAUTH_CLIENT_SECRET`
- `QMS_BOT_APP_ID`
- `QMS_BOT_APP_PRIVATE_KEY`
- `QMS_BOT_APP_INSTALLATION_ID` (optional; the worker can resolve the installation automatically when omitted)
- `SIGNATURE_STATE_SECRET`
- `PIN_PEPPER` (server-side pepper for PIN KDF)

### KV Binding

`wrangler.toml` must include:

- `[[kv_namespaces]]`
- `binding = "PIN_KV"`
- valid `id` and `preview_id`
- a valid `PUBLIC_BASE_URL` under `[vars]`

The committed `wrangler.toml` uses neutral placeholder values. Replace them before deploy, or let [`scripts/bootstrap_env.sh`](./scripts/bootstrap_env.sh) write the values from `.env.local`.

`REPO_ALIASES_JSON` is optional but useful after a repository rename. The worker includes a built-in compatibility alias from `AliakseiT/qms-lite` to `AliakseiT/dearauditor-qms-baseline`, and the JSON map lets you add future rename aliases without code changes.

## GitHub OAuth App

Use a standard GitHub OAuth App (not a GitHub App installation flow):

- Homepage URL: `https://sign.qms.dearauditor.ch`
- Authorization callback URL: `https://sign.qms.dearauditor.ch/auth/callback`
- OAuth scope requested by worker: `read:user`
- Signer full legal name is resolved from `matrices/signer_registry.json` (no manual name entry in UI).

## GitHub App Access

Repository reads and attestation-comment posting use a GitHub App installation, not a personal access token.

Required GitHub App repository permissions:

- Issues: `Read and write`
- Pull requests: `Read-only`
- Contents: `Read-only`
- Workflows: `Read and write`
- Metadata: `Read-only`

`Workflows: Read and write` is needed because the same GitHub App token is also used by repository automation to merge PRs, including PRs that may modify `.github/workflows/`.

## Local Development

1. `cd services/signature-worker`
2. `cp .dev.vars.example .dev.vars` and fill values
3. `npm install`
4. `npm run dev`

The worker UI and `/healthz` expose the active worker version. The default format is `YYYY-MM-DD-<short git hash>` in UTC, derived automatically from the checked-out repository state.

## Deploy

- Manual: `npm run deploy`
- GitHub Actions manual run (`workflow_dispatch`): `.github/workflows/4.1_deploy_signature_worker.yml`

## Hosted Option

This repository includes everything needed to self-host the signing worker.

For adopters that prefer not to operate their own worker, the hosted endpoint `https://sign.qms.dearauditor.ch` may also be offered as a separate service for compatible DearAuditor Open QMS Baseline signing workflows. Any commercial terms, onboarding conditions, or support commitments for hosted use are separate from the open-source repository and are not defined by this README.

## Bootstrap Helper

Use the bootstrap script to sync `.env.local` values to GitHub and Cloudflare:

```bash
./services/signature-worker/scripts/bootstrap_env.sh --deploy
```

What it does:

- Upserts repo variables `SIGNATURE_UI_BASE_URL`, `PIN_KV_NAMESPACE_ID`, `PIN_KV_PREVIEW_NAMESPACE_ID`, and `SIGNATURE_REPO_ALIASES_JSON` when values are present.
- Sets repo secrets `QMS_BOT_APP_ID` and `QMS_BOT_APP_PRIVATE_KEY`, plus Cloudflare deploy secrets when values are present.
- Sets worker secrets for OAuth, GitHub App access, and signing state.
- Writes worker runtime values into `wrangler.toml` and `.dev.vars`.
- Writes `.dev.vars` for local `wrangler dev`.
- Validates that KV namespace IDs in `wrangler.toml` are not placeholders before deploy.
