# QMS Lite Sign Setup

## 1. GitHub OAuth App Configuration

OAuth app name: `QMS Lite Sign`

- Homepage URL: `https://sign.qms.dearauditor.ch`
- Callback URL: `https://sign.qms.dearauditor.ch/auth/callback`
- Scope used by worker: `read:user`

## 2. Cloudflare Worker Configuration

Worker vars:

- `PUBLIC_BASE_URL=https://sign.qms.dearauditor.ch`
- `DEFAULT_OAUTH_PROVIDER=github`
- `ALLOWED_OAUTH_PROVIDERS=github`

Worker secrets:

- `GITHUB_OAUTH_CLIENT_ID`
- `GITHUB_OAUTH_CLIENT_SECRET`
- `GITHUB_REPO_TOKEN`
- `SIGNATURE_LINK_SECRET`
- `SIGNATURE_STATE_SECRET`
- `PIN_PEPPER`

KV binding in `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "PIN_KV"
id = "<prod-namespace-id>"
preview_id = "<preview-namespace-id>"
```

## 3. Token Requirements for `GITHUB_REPO_TOKEN`

Use a token with access to the target QMS repository and minimum permissions required by the worker:

- Issues: `read/write` (read existing comments, post attestation comment)
- Pull requests: `read` (read PR context and metadata)
- Contents: `read` (read `matrices/signer_registry.json`)

## 4. qms-lite Repository Settings

Repository variable:

- `SIGNATURE_UI_BASE_URL=https://sign.qms.dearauditor.ch`

Repository secrets:

- `SIGNATURE_LINK_SECRET` (must match worker secret)
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## 5. Deploy

Manual:

- `cd services/signature-worker`
- `npm install`
- `npm run deploy`

The deploy command injects `WORKER_VERSION` automatically using the format `YYYY-MM-DD-<short git hash>` in UTC, and the active version is shown in the worker UI and `/healthz`.

GitHub Actions:

- run workflow `6.4 Deploy Signature Worker` manually (`workflow_dispatch`)

## 6. One-Command Bootstrap

From repo root:

- `./services/signature-worker/scripts/bootstrap_env.sh --deploy`

This syncs `.env.local` values to GitHub/Cloudflare, validates KV IDs, and deploys worker.
